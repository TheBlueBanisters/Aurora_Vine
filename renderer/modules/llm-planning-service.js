import { showToast } from './utils.js'
import { t } from './i18n.js'
import {
  showLoading,
  hideLoading,
  createLoadingProgressTracker,
  countSubmitPipelineSteps,
  countSmartRegenerateSteps
} from './loading.js'
import { getSchoolPlanningProfile, setSchoolPlanningProfile } from './storage.js'
import { computeStudentScore, profileToScoreInput } from './scoring.js'
import { renderScoreResult } from './profile.js'
import { DAILY_TASK_COLORS } from './state.js'
import { expandDateRange } from './study-planning-parser.js'
import { pickTaskTitle, pickTaskSubtitle } from './localized-content.js'
import { serializeCheckinTaskContent } from './localized-content.js'

function pickColorByIndex(index) {
  return DAILY_TASK_COLORS[index % DAILY_TASK_COLORS.length].value
}

async function distributeDailyTasksToCheckin(dailyTasks, color) {
  if (!window.api?.dailyCheckinAppendTasks) return 0

  const dateTaskMap = new Map()
  dailyTasks.forEach((task) => {
    const title = pickTaskTitle(task)
    const subtitle = pickTaskSubtitle(task)
    if (!title && !subtitle) return
    const content = serializeCheckinTaskContent(task.title, task.subtitle)
    const dateKeys = expandDateRange(task.dateStart, task.dateEnd)
    dateKeys.forEach((dk) => {
      if (!dateTaskMap.has(dk)) dateTaskMap.set(dk, [])
      dateTaskMap.get(dk).push({ content, color, completed: false })
    })
  })

  let totalAppended = 0
  for (const [dateKey, tasks] of dateTaskMap) {
    const res = await window.api.dailyCheckinAppendTasks(dateKey, tasks)
    if (res?.success) totalAppended += (res.appended || 0)
  }
  return totalAppended
}

function enrichEntries(entries, startIndex = 0) {
  return entries.map((entry, idx) => ({
    ...entry,
    color: pickColorByIndex(startIndex + idx)
  }))
}

async function loadOutlinePayloadForSchedule(profile) {
  const res = await window.api.studyPlanList?.()
  if (res?.error) throw new Error(res.error)
  const rows = (res?.items || []).filter((row) => String(row.kind) !== 'schedule')
  if (rows.length === 0) throw new Error(t('studyPlanning.needOutline'))

  return {
    entries: rows.map((row) => ({
      title: row.title,
      description: row.description,
      tasks: []
    })),
    schoolRecommendations: profile.schoolRecommendations || { reach: [], match: [], safety: [] },
    encouragementNote: profile.llmEncouragementNote || { zh: '', en: '' }
  }
}

export async function runSchoolPlanningLlmPipeline(profile, options = {}) {
  const { resumeFile, generatePersonalStatement = false } = options
  const progress = createLoadingProgressTracker(
    countSubmitPipelineSteps({ resumeFile, generatePersonalStatement })
  )

  let workingProfile = { ...profile }
  let resumeMd5 = profile.resumeMd5 || null

  if (resumeFile) {
    const base64 = await readFileAsDataUrl(resumeFile)
    const uploadRes = await window.api.resumeUpload({
      base64,
      filename: resumeFile.name
    })
    if (!uploadRes?.success) {
      throw new Error(uploadRes?.error || t('planning.resumeUploadFail'))
    }
    if (uploadRes.duplicate) {
      showToast(t('planning.resumeDuplicate'), 'warning')
    }
    resumeMd5 = uploadRes.md5
    workingProfile.resumeMd5 = resumeMd5
    workingProfile.resumeFile = uploadRes.originalName || resumeFile.name
    progress.tick()

    const scoreRes = await window.api.llmScoreResume({ profile: workingProfile, md5: resumeMd5 })
    if (!scoreRes?.success) throw new Error(scoreRes?.error || t('planning.llmScoreFail'))
    workingProfile.llmScore = scoreRes.llmScore
    workingProfile.llmSummary = scoreRes.summary
    progress.tick()
  } else {
    delete workingProfile.llmScore
    delete workingProfile.llmSummary
  }

  const scoreInput = profileToScoreInput(workingProfile)
  if (workingProfile.llmScore != null) scoreInput.llmScore = workingProfile.llmScore
  const scoreResult = computeStudentScore(scoreInput)

  const parallelTasks = [
    window.api.llmGenerateOutline({
      profile: workingProfile,
      md5: resumeMd5,
      totalScore: scoreResult.totalScore
    }).then((res) => {
      progress.tick()
      return res
    })
  ]

  if (generatePersonalStatement) {
    parallelTasks.push(
      window.api.llmGeneratePersonalStatement({
        profile: workingProfile,
        md5: resumeMd5,
        totalScore: scoreResult.totalScore
      })
        .then((res) => {
          if (res?.success && res.statement) {
            workingProfile.personalStatement = res.statement
          }
          progress.tick()
          return res
        })
        .catch((err) => {
          console.warn('personal statement generation failed:', err)
          progress.tick()
          return null
        })
    )
  }

  const [outlineRes] = await Promise.all(parallelTasks)
  if (!outlineRes?.success) throw new Error(outlineRes?.error || t('planning.outlineFail'))

  workingProfile.schoolRecommendations = outlineRes.schoolRecommendations
  workingProfile.llmEncouragementNote = outlineRes.encouragementNote

  if (window.api?.studyPlanClearBySource) {
    await window.api.studyPlanClearBySource('llm')
  }

  const outlineEntries = enrichEntries(outlineRes.outlineEntries || [], 0)

  if (window.api?.studyPlanSave) {
    const saveRes = await window.api.studyPlanSave(outlineEntries)
    if (!saveRes?.success) throw new Error(saveRes?.error || t('studyPlanning.saveFail'))
  }

  progress.tick()

  return {
    profile: workingProfile,
    scoreResult,
    outlineCount: outlineEntries.length
  }
}

export async function runSmartScheduleRegeneratePipeline() {
  const profile = getSchoolPlanningProfile()
  if (!profile) throw new Error(t('studyPlanning.needProfile'))

  const progress = createLoadingProgressTracker(countSmartRegenerateSteps())
  const outlinePayload = await loadOutlinePayloadForSchedule(profile)

  if (window.api?.dailyCheckinClearAll) {
    const clearRes = await window.api.dailyCheckinClearAll()
    if (!clearRes?.success) throw new Error(clearRes?.error || t('daily.clearFail'))
  }

  if (window.api?.studyPlanClearBySourceAndKind) {
    await window.api.studyPlanClearBySourceAndKind({ source: 'llm', kind: 'schedule' })
  }

  const scheduleRes = await window.api.llmGenerateSchedule({
    profile,
    outline: outlinePayload
  })
  progress.tick()
  if (!scheduleRes?.success) throw new Error(scheduleRes?.error || t('planning.scheduleFail'))

  const dailyRes = await window.api.llmGenerateDailyTasks({
    profile,
    schedule: {
      entries: scheduleRes.scheduleEntries,
      encouragementNote: scheduleRes.encouragementNote
    }
  })
  progress.tick()

  let dailyTasks = []
  let dailyWarning = null
  if (dailyRes?.success) {
    dailyTasks = dailyRes.dailyTasks || []
  } else {
    dailyWarning = dailyRes?.error || t('planning.dailyTasksFail')
    console.warn('daily tasks generation skipped:', dailyWarning)
  }

  const updatedProfile = {
    ...profile,
    llmEncouragementNote: scheduleRes.encouragementNote?.zh || scheduleRes.encouragementNote?.en
      ? scheduleRes.encouragementNote
      : profile.llmEncouragementNote
  }

  const outlineCount = outlinePayload.entries.length
  const scheduleEntries = enrichEntries(scheduleRes.scheduleEntries || [], outlineCount)

  if (window.api?.studyPlanSave) {
    const saveRes = await window.api.studyPlanSave(scheduleEntries)
    if (!saveRes?.success) throw new Error(saveRes?.error || t('studyPlanning.saveFail'))
  }

  const checkinColor = scheduleEntries[0]?.color || pickColorByIndex(outlineCount)
  const appended = await distributeDailyTasksToCheckin(dailyTasks, checkinColor)
  progress.tick()

  return {
    profile: updatedProfile,
    scheduleCount: scheduleEntries.length,
    dailyCount: dailyTasks.length,
    appended,
    dailyWarning
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(t('planning.resumeReadFail')))
    reader.readAsDataURL(file)
  })
}

export async function executeSchoolPlanningSubmit(profile, resumeFile) {
  showLoading()
  try {
    const keyRes = await window.api.settingsGetDeepseekApiKey?.()
    const generatePersonalStatement = !!keyRes?.configured
    const result = await runSchoolPlanningLlmPipeline(profile, {
      resumeFile,
      generatePersonalStatement
    })
    setSchoolPlanningProfile(result.profile)
    renderScoreResult(result.scoreResult)
    showToast(t('planning.submitSuccess', result.outlineCount), 'success')
    return result
  } catch (err) {
    console.error('executeSchoolPlanningSubmit:', err)
    showToast(err.message || t('planning.submitFail'), 'error')
    throw err
  } finally {
    hideLoading()
  }
}

export async function regenerateSmartSchedule() {
  const profile = getSchoolPlanningProfile()
  if (!profile) {
    showToast(t('studyPlanning.needProfile'), 'warning')
    return null
  }
  showLoading()
  try {
    const result = await runSmartScheduleRegeneratePipeline()
    setSchoolPlanningProfile(result.profile)
    showToast(
      t('studyPlanning.regenerateSuccess', result.scheduleCount, result.appended),
      'success'
    )
    if (result.dailyWarning) {
      showToast(result.dailyWarning, 'warning')
    }
    return result
  } catch (err) {
    console.error('regenerateSmartSchedule:', err)
    showToast(err.message || t('studyPlanning.regenerateFail'), 'error')
    return null
  } finally {
    hideLoading()
  }
}

/** @deprecated use regenerateSmartSchedule */
export const regenerateLlmPlanning = regenerateSmartSchedule
