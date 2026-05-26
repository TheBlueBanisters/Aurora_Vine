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
import {
  buildDailyTasksFromSchedule,
  mergeDailyTaskLists,
  fillTimelineGaps,
  summarizeDailyTaskCoverage,
  distributeDailyTasksToCheckin
} from './daily-task-distributor.js'
import {
  composeFullPipelineResult,
  buildOutlinePayloadFromEntries
} from './pipeline-compose.js'

function pickColorByIndex(index) {
  return DAILY_TASK_COLORS[index % DAILY_TASK_COLORS.length].value
}

function buildTimelineFromProfile(profile = {}) {
  const now = new Date()
  const gradYearRaw = parseInt(profile.graduationYear, 10)
  const gradYear = Number.isFinite(gradYearRaw) && gradYearRaw >= 2020
    ? gradYearRaw
    : now.getFullYear() + 1
  const targetIntakeYear = gradYear
  const pad = (n) => String(n).padStart(2, '0')
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const planStart = new Date(now)
  planStart.setHours(0, 0, 0, 0)
  // Cover from now through arrival/orientation (~Sep of intake year) so visa & pre-departure tasks fit.
  const planEnd = new Date(`${targetIntakeYear}-09-30T00:00:00`)
  return { planStartDate: fmt(planStart), planEndDate: fmt(planEnd) }
}

async function generateDailyTasksWithRetry(profile, schedulePayload, llmScorePayload, maxAttempts = 3) {
  let lastError = null
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await window.api.llmGenerateDailyTasks({
      profile,
      schedule: schedulePayload,
      ...llmScorePayload
    })
    if (res?.success && Array.isArray(res.dailyTasks) && res.dailyTasks.length > 0) {
      return { dailyTasks: res.dailyTasks, error: null, attempts: attempt + 1 }
    }
    lastError = res?.error || t('planning.dailyTasksFail')
    console.warn(`daily tasks generation attempt ${attempt + 1} failed:`, lastError)
  }
  return { dailyTasks: [], error: lastError, attempts: maxAttempts }
}

function resolveDailyTasksForCheckin(scheduleEntries, llmDailyTasks, profile) {
  const fallbackTasks = buildDailyTasksFromSchedule(scheduleEntries)
  const merged = mergeDailyTaskLists(llmDailyTasks, fallbackTasks)
  const timeline = buildTimelineFromProfile(profile)
  const dailyTasks = fillTimelineGaps(merged, scheduleEntries, timeline)
  const coverage = summarizeDailyTaskCoverage(dailyTasks, timeline)
  return {
    dailyTasks,
    fallbackCount: fallbackTasks.length,
    llmCount: llmDailyTasks.length,
    coverage,
    usedFallbackOnly: llmDailyTasks.length === 0
  }
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
  const {
    resumeFile,
    generatePersonalStatement = false,
    progressTracker = null
  } = options
  // 当外部已传入 tracker（合并提交时）就复用它；否则按 outline-only 步骤数建一个独立 tracker。
  const progress = progressTracker || createLoadingProgressTracker(
    countSubmitPipelineSteps({
      resumeFile,
      generatePersonalStatement,
      includeSmartSchedule: false
    })
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
  const llmScorePayload = {
    totalScore: scoreResult.totalScore,
    scoreDetail: scoreResult.detail
  }

  const parallelTasks = [
    window.api.llmGenerateOutline({
      profile: workingProfile,
      md5: resumeMd5,
      ...llmScorePayload
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
        ...llmScorePayload
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
    outlineCount: outlineEntries.length,
    outlineEntries
  }
}

// 纯粹执行「schedule + dailyTasks + 分发到 checkin」段：3 次 progress.tick()。
// 抽出来供合并提交 (runFullSchoolPlanningPipeline) 与「重新生成」(runSmartScheduleRegeneratePipeline) 共享。
async function runSmartScheduleSegment({ profile, outlinePayload, outlineCount, progressTracker }) {
  if (!progressTracker) throw new Error('runSmartScheduleSegment: progressTracker is required')

  const scoreInput = profileToScoreInput(profile)
  if (profile.llmScore != null) scoreInput.llmScore = profile.llmScore
  const scoreResult = computeStudentScore(scoreInput)
  const llmScorePayload = {
    totalScore: scoreResult.totalScore,
    scoreDetail: scoreResult.detail,
    md5: profile.resumeMd5 || null
  }

  if (window.api?.studyPlanClearBySourceAndKind) {
    await window.api.studyPlanClearBySourceAndKind({ source: 'llm', kind: 'schedule' })
  }

  const scheduleRes = await window.api.llmGenerateSchedule({
    profile,
    outline: outlinePayload,
    ...llmScorePayload
  })
  progressTracker.tick()
  if (!scheduleRes?.success) throw new Error(scheduleRes?.error || t('planning.scheduleFail'))

  const schedulePayload = {
    entries: scheduleRes.scheduleEntries,
    encouragementNote: scheduleRes.encouragementNote
  }

  const dailyGen = await generateDailyTasksWithRetry(profile, schedulePayload, llmScorePayload)
  progressTracker.tick()

  const scheduleEntries = enrichEntries(scheduleRes.scheduleEntries || [], outlineCount)

  const resolved = resolveDailyTasksForCheckin(scheduleEntries, dailyGen.dailyTasks, profile)

  let dailyWarning = null
  if (dailyGen.error) {
    dailyWarning = dailyGen.error
  }
  if (resolved.usedFallbackOnly) {
    dailyWarning = dailyWarning
      ? `${dailyWarning} · ${t('planning.dailyTasksFallback')}`
      : t('planning.dailyTasksFallback')
  } else if (resolved.coverage.coverageRatio < 0.12 && resolved.fallbackCount > 0) {
    dailyWarning = dailyWarning
      ? `${dailyWarning} · ${t('planning.dailyTasksCoverageLow')}`
      : t('planning.dailyTasksCoverageLow')
  }

  const updatedProfile = {
    ...profile,
    llmEncouragementNote: scheduleRes.encouragementNote?.zh || scheduleRes.encouragementNote?.en
      ? scheduleRes.encouragementNote
      : profile.llmEncouragementNote
  }

  if (window.api?.studyPlanSave) {
    const saveRes = await window.api.studyPlanSave(scheduleEntries)
    if (!saveRes?.success) throw new Error(saveRes?.error || t('studyPlanning.saveFail'))
  }

  const checkinColor = scheduleEntries[0]?.color || pickColorByIndex(outlineCount)
  const distribution = await distributeDailyTasksToCheckin(resolved.dailyTasks, checkinColor)
  progressTracker.tick()

  if (distribution.error === 'no_tasks') {
    throw new Error(t('planning.dailyTasksEmpty'))
  }
  if (distribution.error) {
    throw new Error(distribution.error === 'import_failed'
      ? t('planning.dailyTasksImportFail')
      : distribution.error)
  }

  return {
    profile: updatedProfile,
    scheduleCount: scheduleEntries.length,
    dailyCount: resolved.dailyTasks.length,
    appended: distribution.appended,
    skipped: distribution.skipped,
    days: distribution.days,
    expectedTasks: distribution.expectedTasks,
    coverage: resolved.coverage,
    dailyWarning
  }
}

export async function runSmartScheduleRegeneratePipeline() {
  const profile = getSchoolPlanningProfile()
  if (!profile) throw new Error(t('studyPlanning.needProfile'))

  const progress = createLoadingProgressTracker(countSmartRegenerateSteps())
  const outlinePayload = await loadOutlinePayloadForSchedule(profile)

  return runSmartScheduleSegment({
    profile,
    outlinePayload,
    outlineCount: outlinePayload.entries.length,
    progressTracker: progress
  })
}

// 合并：outline 段 + schedule/dailyTasks/checkin 分发段。
// 使用同一个 progress tracker、同一段 loading 覆盖；schedule 段失败时不抛错，仅返回 smartError 让上层提示「重试」。
export async function runFullSchoolPlanningPipeline(profile, options = {}) {
  const { resumeFile, generatePersonalStatement = false } = options
  const progress = createLoadingProgressTracker(
    countSubmitPipelineSteps({
      resumeFile,
      generatePersonalStatement,
      includeSmartSchedule: true
    })
  )

  const outlineResult = await runSchoolPlanningLlmPipeline(profile, {
    resumeFile,
    generatePersonalStatement,
    progressTracker: progress
  })

  // outline 已成功并入库，立即衔接 schedule 段。
  // 直接复用刚刚生成的 outlineEntries，不再回读 DB（避免任何时序/缓存问题）。
  const outlinePayload = buildOutlinePayloadFromEntries(
    outlineResult.profile,
    outlineResult.outlineEntries
  )

  let smartResult = null
  let smartError = null
  try {
    smartResult = await runSmartScheduleSegment({
      profile: outlineResult.profile,
      outlinePayload,
      outlineCount: outlineResult.outlineEntries.length,
      progressTracker: progress
    })
  } catch (err) {
    smartError = err
    console.warn('runFullSchoolPlanningPipeline: smart schedule segment failed:', err)
  }

  return composeFullPipelineResult(outlineResult, { smartResult, smartError })
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
    const result = await runFullSchoolPlanningPipeline(profile, {
      resumeFile,
      generatePersonalStatement
    })

    // 整段成功（outline + schedule 全过）才会有 smartResult；否则降级到只显示 outline 提示。
    setSchoolPlanningProfile(result.profile)
    renderScoreResult(result.scoreResult)

    if (result.smartResult) {
      showToast(
        t(
          'planning.submitFullSuccess',
          result.outlineCount,
          result.smartResult.scheduleCount,
          result.smartResult.appended
        ),
        'success'
      )
      if (result.smartResult.dailyWarning) {
        showToast(result.smartResult.dailyWarning, 'warning')
      }
      if (result.smartResult.skipped > 0) {
        showToast(
          t(
            'planning.dailyTasksPartial',
            result.smartResult.appended,
            result.smartResult.expectedTasks || result.smartResult.appended
          ),
          'warning'
        )
      }
    } else {
      // outline 段已落库，仍算「部分成功」；提示用户稍后点重新生成。
      showToast(t('planning.submitSuccess', result.outlineCount), 'success')
      showToast(t('planning.submitScheduleFail'), 'warning')
    }
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
    if (result.skipped > 0) {
      showToast(t('planning.dailyTasksPartial', result.appended, result.expectedTasks || result.appended), 'warning')
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
