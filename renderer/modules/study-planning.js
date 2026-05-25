import { showToast, escapeHtml } from './utils.js'
import { DAILY_TASK_COLORS } from './state.js'
import { parseStudyPlanText, expandDateRange } from './study-planning-parser.js'
import { t } from './i18n.js'
import { getSchoolPlanningProfile, getTargetSchools, isFavorite } from './storage.js'
import {
  pickLocalized,
  parseLocalizedTasks,
  pickTaskTitle,
  pickTaskSubtitle,
  serializeCheckinTaskContent
} from './localized-content.js'
import { openSchoolDetail } from './schools.js'
import { getFavoriteStarMarkup, bindFavoriteStar, updateFavoriteStarButton } from './favorite-star.js'
import { regenerateSmartSchedule } from './llm-planning-service.js'
import { initDailyCheckinPage } from './daily-checkin.js'
import { showAppConfirm } from './confirm-dialog.js'
import { getNavigateTo } from './auth.js'
import { decorateFireflyHost } from './firefly-effect.js'

let spInitialized = false
let spEntries = []

const TIER_KEYS = [
  { key: 'reach', labelKey: 'studyPlanning.tierReach', className: 'reach' },
  { key: 'match', labelKey: 'studyPlanning.tierMatch', className: 'match' },
  { key: 'safety', labelKey: 'studyPlanning.tierSafety', className: 'safety' }
]

const REASON_CLAMP_LINES = 2
const OUTLINE_CATEGORIES = new Set(['strength', 'weakness', 'improvement'])

function parseDescriptionObject(raw) {
  if (raw == null || raw === '') return { zh: '', en: '' }
  if (typeof raw === 'object') return { ...raw }
  const str = String(raw).trim()
  if (str.startsWith('{')) {
    try { return JSON.parse(str) } catch { /* fall through */ }
  }
  return { zh: str, en: str }
}

function pickOutlineCategory(descriptionObj, titleText = '') {
  const category = String(descriptionObj?.category ?? '').trim()
  if (OUTLINE_CATEGORIES.has(category)) return category
  const text = String(titleText || '')
  if (/优势|亮点|长处|竞争力|strength|advantage/i.test(text)) return 'strength'
  if (/劣势|不足|短板|weakness|gap|risk/i.test(text)) return 'weakness'
  return 'improvement'
}

function getOutlineCategoryLabel(category) {
  if (category === 'strength') return t('studyPlanning.categoryStrength')
  if (category === 'weakness') return t('studyPlanning.categoryWeakness')
  return t('studyPlanning.categoryImprovement')
}

function pickOutlineHighlights(descriptionObj) {
  const items = Array.isArray(descriptionObj?.highlights) ? descriptionObj.highlights : []
  return items.map((item) => pickLocalized(item)).filter(Boolean)
}

function renderOutlineHighlightsHtml(descriptionObj) {
  const highlights = pickOutlineHighlights(descriptionObj)
  if (!highlights.length) return ''
  return `
    <ul class="study-planning-entry-highlights">
      ${highlights.map((text) => `<li>${escapeHtml(text)}</li>`).join('')}
    </ul>
  `
}

function pickColorByIndex(index) {
  return DAILY_TASK_COLORS[index % DAILY_TASK_COLORS.length].value
}

function renderTwoLevelTaskHtml(task, extraClass = '') {
  const title = pickTaskTitle(task)
  const subtitle = pickTaskSubtitle(task)
  if (subtitle) {
    return `
      <div class="task-two-level ${extraClass}">
        <span class="task-two-level-title">${escapeHtml(title)}</span>
        <span class="task-two-level-subtitle">${escapeHtml(subtitle)}</span>
      </div>
    `
  }
  return `<span class="task-two-level-title ${extraClass}">${escapeHtml(title)}</span>`
}

function bindExpandableReason(reasonEl, toggleBtn) {
  const fullText = reasonEl.textContent || ''
  requestAnimationFrame(() => {
    const lineHeight = parseFloat(getComputedStyle(reasonEl).lineHeight) || 18
    const maxHeight = lineHeight * REASON_CLAMP_LINES
    if (reasonEl.scrollHeight <= maxHeight + 2) {
      toggleBtn.hidden = true
      return
    }
    reasonEl.classList.add('is-clamped')
    toggleBtn.hidden = false
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const expanded = reasonEl.classList.toggle('is-expanded')
      reasonEl.classList.toggle('is-clamped', !expanded)
      toggleBtn.textContent = expanded ? t('common.collapse') : t('common.more')
    })
  })
}

async function loadEntries() {
  if (!window.api?.studyPlanList) { spEntries = []; return }
  const res = await window.api.studyPlanList()
  if (res?.error) { console.error('studyPlanList:', res.error); spEntries = []; return }
  spEntries = (res?.items || []).map((row) => {
    const descriptionObj = parseDescriptionObject(row.description)
    const titleText = pickLocalized(row.title)
    return {
      id: row.id,
      title: row.title,
      description: descriptionObj,
      category: pickOutlineCategory(descriptionObj, titleText),
      color: String(row.color || DAILY_TASK_COLORS[0].value),
      source: String(row.source || 'manual'),
      kind: String(row.kind || row.source || 'manual'),
      tasks: parseLocalizedTasks(row.tasks_json)
    }
  })
}

function renderOutlinePanel() {
  const listEl = document.getElementById('study-planning-outline-list')
  const emptyEl = document.getElementById('study-planning-outline-empty')
  if (!listEl) return

  listEl.querySelectorAll('.study-planning-entry').forEach((el) => el.remove())

  const outlineEntries = spEntries.filter((entry) => entry.kind !== 'schedule')
  if (emptyEl) emptyEl.style.display = outlineEntries.length === 0 ? 'flex' : 'none'

  outlineEntries.forEach((entry) => {
    const category = entry.category || pickOutlineCategory(entry.description, pickLocalized(entry.title))
    const el = document.createElement('div')
    el.className = `study-planning-entry study-planning-entry--${category}`

    const tasksHtml = entry.tasks.map((task) =>
      `<div class="study-planning-entry-task" style="--task-dot-color:${entry.color}">${renderTwoLevelTaskHtml(task)}</div>`
    ).join('')

    let descHtml = ''
    const description = pickLocalized(entry.description)
    if (description) {
      const stripped = description.replace(/^["'\u201c\u201d\u2018\u2019]+|["'\u201c\u201d\u2018\u2019]+$/g, '')
      descHtml = `<p class="study-planning-entry-desc">${escapeHtml(stripped)}</p>`
    }
    const highlightsHtml = renderOutlineHighlightsHtml(entry.description)

    el.innerHTML = `
      <div class="study-planning-entry-header">
        <span class="study-planning-entry-title">
          <span class="study-planning-entry-color" style="background:${entry.color}"></span>
          <span class="study-planning-entry-category study-planning-entry-category--${category}">${escapeHtml(getOutlineCategoryLabel(category))}</span>
          ${escapeHtml(pickLocalized(entry.title))}
        </span>
        <button class="study-planning-entry-delete" type="button" title="${t('studyPlanning.deleteEntry')}" aria-label="${t('studyPlanning.deleteEntry')}">✕</button>
      </div>
      ${descHtml}
      ${highlightsHtml}
      <div class="study-planning-entry-tasks">${tasksHtml}</div>
    `

    el.querySelector('.study-planning-entry-delete')?.addEventListener('click', async () => {
      if (!window.api?.studyPlanDelete) return
      const res = await window.api.studyPlanDelete(entry.id)
      if (!res?.success) { showToast(res?.error || t('studyPlanning.deleteFail'), 'error'); return }
      await loadEntries()
      renderStudyPlanningPage()
      showToast(t('studyPlanning.deleted'), 'success')
    })

    listEl.appendChild(el)
  })
}

function renderSmartPanel() {
  const emptyEl = document.getElementById('study-planning-smart-empty')
  const listEl = document.getElementById('study-planning-smart-list')
  if (!listEl) return

  listEl.innerHTML = ''
  const profile = getSchoolPlanningProfile()
  const scheduleEntries = spEntries.filter((entry) => entry.kind === 'schedule')

  const encouragement = profile?.llmEncouragementNote
  const encouragementText = encouragement ? pickLocalized(encouragement) : ''
  if (encouragementText) {
    const noteEl = document.createElement('div')
    noteEl.className = 'study-planning-smart-note'
    noteEl.innerHTML = `
      <h4 class="study-planning-smart-note-title">${escapeHtml(t('studyPlanning.encouragementTitle'))}</h4>
      <p>${escapeHtml(encouragementText)}</p>
    `
    listEl.appendChild(noteEl)
  }

  if (emptyEl) emptyEl.style.display = scheduleEntries.length === 0 ? 'block' : 'none'

  scheduleEntries.forEach((entry) => {
    const el = document.createElement('div')
    el.className = 'study-planning-smart-entry'
    const tasksHtml = entry.tasks.map((task) => {
      const range = task.dateStart === task.dateEnd
        ? task.dateStart
        : `${task.dateStart} ~ ${task.dateEnd}`
      return `
        <li class="study-planning-smart-task-item">
          <span class="study-planning-smart-task-date">${escapeHtml(range)}</span>
          <div class="study-planning-smart-task-body">
            ${renderTwoLevelTaskHtml(task)}
          </div>
        </li>
      `
    }).join('')

    el.innerHTML = `
      <div class="study-planning-smart-entry-header">
        <span class="study-planning-entry-color" style="background:${entry.color}"></span>
        <strong>${escapeHtml(pickLocalized(entry.title))}</strong>
      </div>
      ${pickLocalized(entry.description) ? `<p class="study-planning-smart-entry-desc">${escapeHtml(pickLocalized(entry.description))}</p>` : ''}
      <ul class="study-planning-smart-task-list">${tasksHtml}</ul>
    `
    listEl.appendChild(el)
  })
}

function collectTierSchoolIds(tiers) {
  const ids = new Set()
  if (!tiers) return ids
  TIER_KEYS.forEach(({ key }) => {
    (Array.isArray(tiers[key]) ? tiers[key] : []).forEach((item) => {
      const id = String(item?.schoolId ?? '').trim()
      if (id) ids.add(id)
    })
  })
  return ids
}

async function fetchSchoolMapByIds(ids) {
  const uniqueIds = [...new Set(ids.map((id) => String(id ?? '').trim()).filter(Boolean))]
  const map = new Map()
  if (uniqueIds.length === 0) return map

  if (window.api?.schoolsGetByIds) {
    try {
      const schools = await window.api.schoolsGetByIds(uniqueIds) || []
      schools.forEach((school) => {
        if (school?.school_id != null) map.set(String(school.school_id), school)
      })
    } catch (_) {}
  }

  const missing = uniqueIds.filter((id) => !map.has(id))
  if (missing.length && window.api?.schoolsGetById) {
    await Promise.all(missing.map(async (id) => {
      try {
        const school = await window.api.schoolsGetById(id)
        if (school?.school_id != null) map.set(String(school.school_id), school)
      } catch (_) {}
    }))
  }

  return map
}

async function fetchSchoolById(schoolId) {
  const map = await fetchSchoolMapByIds([schoolId])
  return map.get(String(schoolId ?? '').trim()) || null
}

function getSchoolDisplayName(school, schoolId) {
  if (school) {
    const name = pickLocalized({ zh: school.school_name_zh, en: school.school_name_en })
    if (name) return name
    if (school.school_name_zh) return school.school_name_zh
    if (school.school_name_en) return school.school_name_en
  }
  const id = String(schoolId ?? '').trim()
  return id || t('studyPlanning.unknownSchool')
}

function bindTierSchoolRow(row, school, schoolId) {
  const nameBtn = row.querySelector('.study-planning-tier-name-btn')
  const starBtn = row.querySelector('.school-card-star')

  if (school) {
    nameBtn?.addEventListener('click', () => openSchoolDetail(school, 'study-planning'))
  } else if (nameBtn) {
    nameBtn.disabled = true
  }

  bindFavoriteStar(starBtn, schoolId, (nowFav) => {
    if (!nowFav) renderIntendedSchools()
  })
}

async function renderSchoolTiers() {
  const wrap = document.getElementById('study-planning-school-tiers')
  const listEl = document.getElementById('study-planning-tiers-list')
  if (!wrap || !listEl) return

  const profile = getSchoolPlanningProfile()
  const tiers = profile?.schoolRecommendations
  const hasAny = tiers && TIER_KEYS.some(({ key }) => Array.isArray(tiers[key]) && tiers[key].length > 0)

  if (!hasAny) {
    wrap.hidden = true
    listEl.innerHTML = ''
    return
  }

  wrap.hidden = false
  listEl.innerHTML = ''

  const tierItems = []
  for (const { key, labelKey, className } of TIER_KEYS) {
    const items = Array.isArray(tiers[key]) ? tiers[key] : []
    items.forEach((item) => tierItems.push({ item, labelKey, className }))
  }

  const schoolMap = await fetchSchoolMapByIds(tierItems.map(({ item }) => item.schoolId))

  for (const { item, labelKey, className } of tierItems) {
    const schoolId = String(item.schoolId ?? '').trim()
    const school = schoolMap.get(schoolId) || null
    const schoolName = getSchoolDisplayName(school, schoolId)
    const reasonText = pickLocalized(item.reason)

    const row = document.createElement('div')
    row.className = `study-planning-tier-row study-planning-tier-row--${className}`
    row.dataset.schoolId = schoolId

    row.innerHTML = `
      <span class="study-planning-tier-badge">${escapeHtml(t(labelKey))}</span>
      <div class="study-planning-tier-row-main">
        <button type="button" class="study-planning-tier-name-btn">${escapeHtml(schoolName)}</button>
        <p class="study-planning-tier-reason">${escapeHtml(reasonText)}</p>
        <button type="button" class="study-planning-tier-more-btn" hidden>${escapeHtml(t('common.more'))}</button>
      </div>
      ${getFavoriteStarMarkup(schoolId, isFavorite(schoolId), 'study-planning-tier-star')}
    `

    bindTierSchoolRow(row, school, schoolId)
    bindExpandableReason(row.querySelector('.study-planning-tier-reason'), row.querySelector('.study-planning-tier-more-btn'))
    decorateFireflyHost(row, 'dark-hover')
    listEl.appendChild(row)
  }
}

async function renderIntendedSchools() {
  const wrap = document.getElementById('study-planning-intended-schools')
  const listEl = document.getElementById('study-planning-intended-list')
  const emptyEl = document.getElementById('study-planning-intended-empty')
  if (!wrap || !listEl) return

  const profile = getSchoolPlanningProfile()
  const tierIds = collectTierSchoolIds(profile?.schoolRecommendations)
  const intendedIds = getTargetSchools().filter((id) => !tierIds.has(id))

  if (intendedIds.length === 0) {
    wrap.hidden = true
    listEl.innerHTML = ''
    if (emptyEl) emptyEl.hidden = true
    return
  }

  const schoolMap = await fetchSchoolMapByIds(intendedIds)

  wrap.hidden = false
  if (emptyEl) emptyEl.hidden = true
  listEl.innerHTML = ''

  for (const schoolId of intendedIds) {
    const school = schoolMap.get(schoolId) || null
    const schoolName = getSchoolDisplayName(school, schoolId)

    const row = document.createElement('div')
    row.className = 'study-planning-intended-row'
    row.dataset.schoolId = String(schoolId)
    row.innerHTML = `
      <div class="study-planning-intended-row-main">
        <button type="button" class="study-planning-tier-name-btn">${escapeHtml(schoolName)}</button>
        ${school?.ranking_qs ? `<span class="study-planning-intended-meta">QS ${escapeHtml(String(school.ranking_qs))}</span>` : ''}
      </div>
      ${getFavoriteStarMarkup(schoolId, true, 'study-planning-tier-star')}
    `

    bindTierSchoolRow(row, school, schoolId)
    decorateFireflyHost(row, 'dark-hover')
    listEl.appendChild(row)
  }
}

function syncStudyPlanningFavoriteStars() {
  document.querySelectorAll('.study-planning-tier-row[data-school-id], .study-planning-intended-row[data-school-id]').forEach((row) => {
    const schoolId = row.dataset.schoolId
    updateFavoriteStarButton(row.querySelector('.school-card-star'), isFavorite(schoolId))
  })
}

export async function renderStudyPlanningPage() {
  renderOutlinePanel()
  renderSmartPanel()
  await renderSchoolTiers()
  await renderIntendedSchools()
}

async function distributeTasksToDailyCheckin(entries) {
  if (!window.api?.dailyCheckinAppendTasks) {
    showToast(t('studyPlanning.checkinUnavailable'), 'error')
    return 0
  }

  const dateTaskMap = new Map()
  entries.forEach((entry) => {
    entry.tasks.forEach((task) => {
      const title = pickTaskTitle(task)
      const content = title
        ? serializeCheckinTaskContent(task.title, task.subtitle || { zh: '', en: '' })
        : pickLocalized(task.content)
      if (!content) return
      const dateKeys = expandDateRange(task.dateStart, task.dateEnd)
      dateKeys.forEach((dk) => {
        if (!dateTaskMap.has(dk)) dateTaskMap.set(dk, [])
        dateTaskMap.get(dk).push({ content, color: entry.color, completed: false })
      })
    })
  })

  let totalAppended = 0
  for (const [dateKey, tasks] of dateTaskMap) {
    const res = await window.api.dailyCheckinAppendTasks(dateKey, tasks)
    if (res?.success) totalAppended += (res.appended || 0)
  }
  return totalAppended
}

function syncCustomTextareaHeight(textarea) {
  const body = textarea?.closest('.study-planning-custom-body')
  if (!textarea || !body) return
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.max(body.clientHeight, textarea.scrollHeight)}px`
}

function initCustomPanel() {
  const submitBtn = document.getElementById('study-planning-custom-submit')
  const textarea = document.getElementById('study-planning-custom-input')
  if (!submitBtn || !textarea) return

  const onCustomInputResize = () => syncCustomTextareaHeight(textarea)
  textarea.addEventListener('input', onCustomInputResize)
  window.addEventListener('resize', onCustomInputResize)
  requestAnimationFrame(onCustomInputResize)

  submitBtn.addEventListener('click', async () => {
    const text = textarea.value.trim()
    if (!text) { showToast(t('studyPlanning.inputEmpty'), 'warning'); return }

    const { entries: parsed, errors } = parseStudyPlanText(text)
    if (errors.length > 0 && parsed.length === 0) {
      showToast(t('studyPlanning.formatError') + errors.join('\n'), 'error')
      return
    }
    if (errors.length > 0) showToast(t('studyPlanning.partialError') + errors.join('\n'), 'warning')
    if (parsed.length === 0) { showToast(t('studyPlanning.noEntries'), 'warning'); return }

    const existingCount = spEntries.length
    const enriched = parsed.map((entry, idx) => ({
      title: entry.title,
      description: entry.description,
      tasks: entry.tasks.map((task) => ({
        title: { zh: task.content, en: task.content },
        subtitle: { zh: '', en: '' },
        dateStart: task.dateStart,
        dateEnd: task.dateEnd
      })),
      color: pickColorByIndex(existingCount + idx),
      source: 'manual',
      kind: 'manual'
    }))

    if (!window.api?.studyPlanSave) { showToast(t('studyPlanning.storageUnavailable'), 'error'); return }

    submitBtn.disabled = true
    try {
      const saveRes = await window.api.studyPlanSave(enriched)
      if (!saveRes?.success) { showToast(saveRes?.error || t('studyPlanning.saveFail'), 'error'); return }

      const appended = await distributeTasksToDailyCheckin(enriched)
      await loadEntries()
      renderStudyPlanningPage()
      textarea.value = ''
      showToast(t('studyPlanning.submitSuccess', enriched.length, appended), 'success')
    } catch (err) {
      console.error('study-planning submit error:', err)
      showToast(t('studyPlanning.submitFail'), 'error')
    } finally {
      submitBtn.disabled = false
    }
  })
}

function hasLlmPlanningOutline(entries = spEntries) {
  return entries.some((entry) => entry.source === 'llm' && entry.kind !== 'schedule')
}

async function promptSchoolPlanningOutlineRequired() {
  const confirmed = await showAppConfirm({
    title: t('studyPlanning.needOutlineTitle'),
    description: t('studyPlanning.needOutlineDesc'),
    cancelText: t('daily.cancel'),
    confirmText: t('studyPlanning.goSchoolPlanning')
  })
  if (!confirmed) return
  const navigateTo = getNavigateTo()
  if (navigateTo) await navigateTo('school-planning')
}

function initRegenerateButton() {
  const btn = document.getElementById('study-planning-regenerate')
  btn?.addEventListener('click', async () => {
    if (!btn) return
    if (!getSchoolPlanningProfile() || !hasLlmPlanningOutline()) {
      await promptSchoolPlanningOutlineRequired()
      return
    }
    const confirmed = await showAppConfirm({
      title: t('studyPlanning.regenerateConfirmTitle'),
      description: t('studyPlanning.regenerateConfirmDesc'),
      confirmText: t('studyPlanning.regenerateConfirmOk'),
      cancelText: t('daily.cancel'),
      danger: true
    })
    if (!confirmed) return
    btn.disabled = true
    try {
      const result = await regenerateSmartSchedule()
      if (result) {
        await loadEntries()
        renderStudyPlanningPage()
        const activePage = document.querySelector('.page.active')
        if (activePage?.id === 'page-daily-checkin') initDailyCheckinPage()
      }
    } finally {
      btn.disabled = false
    }
  })
}

export async function initStudyPlanningPage() {
  await loadEntries()
  renderStudyPlanningPage()

  if (!spInitialized) {
    initCustomPanel()
    initRegenerateButton()
    document.addEventListener('aurora:favorites-changed', async () => {
      await renderIntendedSchools()
      syncStudyPlanningFavoriteStars()
    })
    spInitialized = true
  }
}
