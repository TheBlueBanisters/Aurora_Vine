import { showToast, escapeHtml, toDateKey, toMonthKey, formatDateLabel } from './utils.js'
import { DAILY_MAX_TASKS, DAILY_TASK_COLORS, DAILY_GRID_FILL_ORDER, getTaskColors } from './state.js'
import { t } from './i18n.js'
import { parseCheckinTaskContent, pickTaskTitle, pickTaskSubtitle, serializeCheckinTaskContent } from './localized-content.js'

let dailyCurrentMonth = new Date()
let dailySelectedDateKey = ''
let dailyTaskItems = []
let dailyMonthTaskMap = new Map()
let dailyInitialized = false
let dailyModalInitialized = false
let dailySaveTimer = null
let dailyActiveTaskIndex = -1
let dailyDateSwitching = false

const DAILY_DATE_SWITCH_MS = 240

function getDailyDateSwitchMs() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0 : DAILY_DATE_SWITCH_MS
}

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function syncDailyCalendarSelection() {
  const grid = document.getElementById('daily-checkin-calendar-grid')
  if (!grid) return
  grid.querySelectorAll('.daily-checkin-day').forEach((el) => {
    el.classList.toggle('is-selected', el.dataset.dateKey === dailySelectedDateKey)
  })
}

async function runDailyDateSwitchTransition(updateContent) {
  if (dailyDateSwitching) return
  dailyDateSwitching = true
  const taskPanel = document.querySelector('.daily-checkin-task-panel')
  try {
    taskPanel?.classList.add('is-date-switching')
    await waitMs(getDailyDateSwitchMs())
    await updateContent()
    void taskPanel?.offsetHeight
    taskPanel?.classList.remove('is-date-switching')
  } finally {
    dailyDateSwitching = false
  }
}

function monthRangeDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const firstWeekday = first.getDay() === 0 ? 7 : first.getDay()
  const start = new Date(first)
  start.setDate(first.getDate() - (firstWeekday - 1))
  const days = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
      isToday: toDateKey(date) === toDateKey(new Date()),
      isSelected: toDateKey(date) === dailySelectedDateKey
    })
  }
  return { days, monthLastDate: last }
}

function getMappedGridColors(dateKey) {
  const raw = (dailyMonthTaskMap.get(dateKey) || [])
    .filter((item) => String(item.content || '').trim())
    .slice(0, DAILY_MAX_TASKS)
  const result = new Array(9).fill(null)
  raw.forEach((item, index) => {
    const targetIdx = DAILY_GRID_FILL_ORDER[index]
    result[targetIdx] = { color: item.color || DAILY_TASK_COLORS[0].value, completed: !!item.completed }
  })
  return result
}

async function loadDailyMonthData(monthDate) {
  const monthKey = toMonthKey(monthDate)
  dailyMonthTaskMap = new Map()
  if (!window.api?.dailyCheckinListByMonth) return
  const res = await window.api.dailyCheckinListByMonth(monthKey)
  if (res?.error) { console.error('dailyCheckinListByMonth:', res.error); return }
  const groups = new Map()
  ;(res?.items || []).forEach((item) => {
    const key = String(item.date_key || '')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({
      content: String(item.content || ''),
      color: String(item.color || DAILY_TASK_COLORS[0].value).toUpperCase(),
      completed: !!item.completed,
      sort_order: Number(item.sort_order || 0)
    })
  })
  groups.forEach((items, key) => {
    items.sort((a, b) => a.sort_order - b.sort_order)
    dailyMonthTaskMap.set(key, items.slice(0, DAILY_MAX_TASKS))
  })
}

async function loadDailyTasksByDate(dateKey) {
  if (!window.api?.dailyCheckinGetByDate) { dailyTaskItems = []; return }
  const res = await window.api.dailyCheckinGetByDate(dateKey)
  if (res?.error) { console.error('dailyCheckinGetByDate:', res.error); dailyTaskItems = []; return }
  dailyTaskItems = (res?.items || [])
    .map((item) => ({
      content: String(item.content || ''),
      color: String(item.color || DAILY_TASK_COLORS[0].value).toUpperCase(),
      completed: !!item.completed
    }))
    .slice(0, DAILY_MAX_TASKS)
  dailyActiveTaskIndex = -1
}

function updateDailyTaskCounter() {
  const counter = document.getElementById('daily-checkin-task-count')
  if (!counter) return
  counter.textContent = `${dailyTaskItems.length}/${DAILY_MAX_TASKS}`
}

/** 按内容预估高度排序，避免操作态（勾选/删除栏）改变实测高度导致条目跳动 */
function estimateTaskItemSortHeight(item) {
  const parsed = parseCheckinTaskContent(item.content)
  const title = pickTaskTitle(parsed)
  const subtitle = pickTaskSubtitle(parsed)
  let height = 62
  if (subtitle) height += 20
  const titleLines = Math.ceil(Math.max(title.length, 1) / 32)
  if (titleLines > 1) height += (titleLines - 1) * 18
  return height
}

function getTaskDisplayOrder() {
  return dailyTaskItems
    .map((item, idx) => ({ idx, height: estimateTaskItemSortHeight(item) }))
    .sort((a, b) => b.height - a.height)
    .map(({ idx }) => idx)
}

function renderDailyTaskList() {
  const listEl = document.getElementById('daily-checkin-task-list')
  const addBtn = document.getElementById('daily-checkin-add-task')
  const dateTitle = document.getElementById('daily-checkin-task-date')
  const emptyEl = document.getElementById('daily-checkin-task-empty')
  if (!listEl || !addBtn || !dateTitle || !emptyEl) return

  dateTitle.textContent = formatDateLabel(dailySelectedDateKey)
  listEl.innerHTML = ''
  emptyEl.style.display = dailyTaskItems.length === 0 ? 'flex' : 'none'

  getTaskDisplayOrder().forEach((idx) => {
    const item = dailyTaskItems[idx]
    const parsed = parseCheckinTaskContent(item.content)
    const title = pickTaskTitle(parsed)
    const subtitle = pickTaskSubtitle(parsed)
    const row = document.createElement('div')
    row.className = 'daily-checkin-task-item'
    row.dataset.taskIndex = String(idx)
    if (idx === dailyActiveTaskIndex) row.classList.add('is-operating')
    if (item.completed) row.classList.add('is-completed')
    row.style.setProperty('--task-color', String(item.color || DAILY_TASK_COLORS[0].value))

    const subtitleHtml = subtitle
      ? `<span class="daily-checkin-task-subtitle">${escapeHtml(subtitle)}</span>`
      : ''

    row.innerHTML = `
      <div class="daily-checkin-task-content">
        <span class="daily-checkin-task-pin" aria-hidden="true">📌</span>
        <div class="daily-checkin-task-text-wrap">
          <span class="daily-checkin-task-title">${escapeHtml(title)}</span>
          ${subtitleHtml}
        </div>
      </div>
      <div class="daily-checkin-task-opbar">
        <button class="daily-checkin-task-icon-btn task-op-back" type="button" title="${t('daily.taskBack')}" aria-label="${t('daily.taskBack')}">↩</button>
        <button class="daily-checkin-task-icon-btn task-op-complete" type="button" title="${t('daily.taskComplete')}" aria-label="${t('daily.taskComplete')}">${item.completed ? '↺' : '✓'}</button>
        <button class="daily-checkin-task-icon-btn task-op-delete" type="button" title="${t('daily.taskDelete')}" aria-label="${t('daily.taskDelete')}">🗑</button>
      </div>
    `
    row.addEventListener('click', () => { if (dailyActiveTaskIndex === idx) return; dailyActiveTaskIndex = idx; renderDailyTaskList() })
    row.querySelector('.task-op-back')?.addEventListener('click', (e) => { e.stopPropagation(); dailyActiveTaskIndex = -1; renderDailyTaskList() })
    row.querySelector('.task-op-complete')?.addEventListener('click', (e) => {
      e.stopPropagation(); dailyTaskItems[idx].completed = !dailyTaskItems[idx].completed; dailyActiveTaskIndex = -1; renderDailyTaskList(); scheduleDailyTasksSave(true)
    })
    row.querySelector('.task-op-delete')?.addEventListener('click', (e) => {
      e.stopPropagation(); dailyTaskItems.splice(idx, 1); dailyActiveTaskIndex = -1; renderDailyTaskList(); scheduleDailyTasksSave(true)
    })
    listEl.appendChild(row)
  })

  addBtn.disabled = dailyTaskItems.length >= DAILY_MAX_TASKS
  updateDailyTaskCounter()
}

async function selectDailyDate(day) {
  if (day.dateKey === dailySelectedDateKey || dailyDateSwitching) return
  await persistDailyTasks()
  dailyActiveTaskIndex = -1
  const monthChanged =
    day.date.getMonth() !== dailyCurrentMonth.getMonth() ||
    day.date.getFullYear() !== dailyCurrentMonth.getFullYear()
  dailySelectedDateKey = day.dateKey
  if (!monthChanged) syncDailyCalendarSelection()

  await runDailyDateSwitchTransition(async () => {
    if (monthChanged) {
      dailyCurrentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1)
      await loadDailyMonthData(dailyCurrentMonth)
      renderDailyCalendar()
    }
    await loadDailyTasksByDate(dailySelectedDateKey)
    renderDailyTaskList()
  })
}

function renderDailyCalendar() {
  const monthTitle = document.getElementById('daily-checkin-month-title')
  const grid = document.getElementById('daily-checkin-calendar-grid')
  if (!monthTitle || !grid) return
  monthTitle.textContent = t('daily.monthTitle', dailyCurrentMonth.getFullYear(), t('month.' + (dailyCurrentMonth.getMonth() + 1)))

  const weekdayContainer = document.getElementById('daily-checkin-weekday-labels')
  if (weekdayContainer) {
    const weekdayNames = t('daily.weekdays')
    const spans = weekdayContainer.querySelectorAll('span')
    if (Array.isArray(weekdayNames) && spans.length === weekdayNames.length) {
      spans.forEach((span, i) => { span.textContent = weekdayNames[i] })
    }
  }

  grid.innerHTML = ''
  const { days } = monthRangeDays(dailyCurrentMonth)
  days.forEach((day) => {
    const dayEl = document.createElement('button')
    dayEl.type = 'button'; dayEl.className = 'daily-checkin-day'
    dayEl.dataset.dateKey = day.dateKey
    if (!day.isCurrentMonth) dayEl.classList.add('is-other-month')
    if (day.isToday) dayEl.classList.add('is-today')
    if (day.isSelected) dayEl.classList.add('is-selected')

    const mappedColors = getMappedGridColors(day.dateKey)
    const gridCells = mappedColors
      .map((cell) => {
        if (!cell) return '<span class="daily-checkin-day-grid-cell"></span>'
        const stateClass = cell.completed ? ' is-completed' : ' is-pending'
        return `<span class="daily-checkin-day-grid-cell${stateClass}" style="--cell-color:${cell.color};"></span>`
      })
      .join('')

    dayEl.innerHTML = `<span class="daily-checkin-day-date">${day.date.getDate()}</span><div class="daily-checkin-day-grid">${gridCells}</div>`
    dayEl.addEventListener('click', () => { void selectDailyDate(day) })
    grid.appendChild(dayEl)
  })
}

async function persistDailyTasks() {
  if (dailySaveTimer) { clearTimeout(dailySaveTimer); dailySaveTimer = null }
  const payload = dailyTaskItems
    .map((item) => ({ content: String(item.content || '').trim(), color: String(item.color || DAILY_TASK_COLORS[0].value).toUpperCase(), completed: !!item.completed }))
    .filter((item) => item.content).slice(0, DAILY_MAX_TASKS)
  if (!window.api?.dailyCheckinSaveByDate) return
  const res = await window.api.dailyCheckinSaveByDate(dailySelectedDateKey, payload)
  if (!res?.success) { showToast(res?.error || t('daily.saveFail'), 'error'); return }
  await loadDailyMonthData(dailyCurrentMonth); await loadDailyTasksByDate(dailySelectedDateKey)
  renderDailyCalendar(); renderDailyTaskList()
}

function scheduleDailyTasksSave(immediate = false) {
  if (dailySaveTimer) { clearTimeout(dailySaveTimer); dailySaveTimer = null }
  if (immediate) { persistDailyTasks(); return }
  dailySaveTimer = setTimeout(() => persistDailyTasks(), 450)
}

function initDailyTaskModal() {
  if (dailyModalInitialized) return
  const modal = document.getElementById('daily-checkin-modal')
  const titleInput = document.getElementById('daily-checkin-modal-title-input')
  const subtitleInput = document.getElementById('daily-checkin-modal-subtitle')
  const modalColor = document.getElementById('daily-checkin-modal-color')
  const modalCancel = document.getElementById('daily-checkin-modal-cancel')
  const modalConfirm = document.getElementById('daily-checkin-modal-confirm')
  if (!modal || !titleInput || !subtitleInput || !modalColor || !modalCancel || !modalConfirm) return

  modalColor.innerHTML = getTaskColors().map((c) => `<option value="${c.value}">${c.label}</option>`).join('')

  function closeModal() {
    modal.classList.remove('active')
    modal.setAttribute('aria-hidden', 'true')
    titleInput.value = ''
    subtitleInput.value = ''
    modalColor.value = DAILY_TASK_COLORS[0].value
  }

  function openModal(defaultColor) {
    if (dailyTaskItems.length >= DAILY_MAX_TASKS) return
    modal.classList.add('active')
    modal.setAttribute('aria-hidden', 'false')
    titleInput.value = ''
    subtitleInput.value = ''
    modalColor.value = defaultColor || DAILY_TASK_COLORS[0].value
    setTimeout(() => titleInput.focus(), 0)
  }

  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal() })
  modalCancel.addEventListener('click', closeModal)
  modalConfirm.addEventListener('click', () => {
    const title = titleInput.value.trim()
    const subtitle = subtitleInput.value.trim()
    if (!title) { showToast(t('daily.taskTitleEmpty'), 'warning'); return }
    if (dailyTaskItems.length >= DAILY_MAX_TASKS) { closeModal(); return }
    const content = serializeCheckinTaskContent({ zh: title, en: title }, { zh: subtitle, en: subtitle })
    dailyTaskItems.push({
      content,
      color: String(modalColor.value || DAILY_TASK_COLORS[0].value).toUpperCase(),
      completed: false
    })
    closeModal()
    renderDailyTaskList()
    scheduleDailyTasksSave(true)
  })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal() })

  const addBtn = document.getElementById('daily-checkin-add-task')
  addBtn?.addEventListener('click', () => {
    if (dailyTaskItems.length >= DAILY_MAX_TASKS) return
    openModal(DAILY_TASK_COLORS[dailyTaskItems.length % DAILY_TASK_COLORS.length].value)
  })

  dailyModalInitialized = true
}

export async function initDailyCheckinPage() {
  const panel = document.getElementById('page-daily-checkin')
  if (!panel) return

  const prevBtn = document.getElementById('daily-checkin-prev-month')
  const nextBtn = document.getElementById('daily-checkin-next-month')
  initDailyTaskModal()

  const clearAllBtn = document.getElementById('daily-checkin-clear-all')
  const clearGlobalBtn = document.getElementById('daily-checkin-clear-global')
  const confirmModal = document.getElementById('daily-checkin-confirm-modal')
  const confirmCancel = document.getElementById('daily-checkin-confirm-cancel')
  const confirmOk = document.getElementById('daily-checkin-confirm-ok')

  if (!dailyInitialized) {
    clearAllBtn?.addEventListener('click', async () => {
      if (dailyTaskItems.length === 0) return
      dailyTaskItems = []
      dailyActiveTaskIndex = -1
      renderDailyTaskList()
      await persistDailyTasks()
    })

    clearGlobalBtn?.addEventListener('click', () => {
      confirmModal?.classList.add('active')
      confirmModal?.setAttribute('aria-hidden', 'false')
    })
    confirmCancel?.addEventListener('click', () => {
      confirmModal?.classList.remove('active')
      confirmModal?.setAttribute('aria-hidden', 'true')
    })
    confirmModal?.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        confirmModal.classList.remove('active')
        confirmModal.setAttribute('aria-hidden', 'true')
      }
    })
    confirmOk?.addEventListener('click', async () => {
      confirmModal?.classList.remove('active')
      confirmModal?.setAttribute('aria-hidden', 'true')
      if (!window.api?.dailyCheckinClearAll) return
      const res = await window.api.dailyCheckinClearAll()
      if (!res?.success) { showToast(res?.error || t('daily.clearFail'), 'error'); return }
      dailyTaskItems = []
      dailyActiveTaskIndex = -1
      await loadDailyMonthData(dailyCurrentMonth)
      renderDailyCalendar()
      renderDailyTaskList()
      showToast(t('daily.cleared'), 'success')
    })

    prevBtn?.addEventListener('click', async () => {
      await persistDailyTasks()
      dailyCurrentMonth = new Date(dailyCurrentMonth.getFullYear(), dailyCurrentMonth.getMonth() - 1, 1)
      await loadDailyMonthData(dailyCurrentMonth); renderDailyCalendar()
    })
    nextBtn?.addEventListener('click', async () => {
      await persistDailyTasks()
      dailyCurrentMonth = new Date(dailyCurrentMonth.getFullYear(), dailyCurrentMonth.getMonth() + 1, 1)
      await loadDailyMonthData(dailyCurrentMonth); renderDailyCalendar()
    })
    dailyInitialized = true
  }

  const today = new Date()
  dailyCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  dailySelectedDateKey = toDateKey(today)
  await loadDailyMonthData(dailyCurrentMonth); await loadDailyTasksByDate(dailySelectedDateKey)
  renderDailyCalendar(); renderDailyTaskList()
}
