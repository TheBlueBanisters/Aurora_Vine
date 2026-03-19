import { showToast, escapeHtml, toDateKey, toMonthKey, formatDateLabel } from './utils.js'
import { DAILY_MAX_TASKS, DAILY_TASK_COLORS, DAILY_GRID_FILL_ORDER } from './state.js'

let dailyCurrentMonth = new Date()
let dailySelectedDateKey = ''
let dailyTaskItems = []
let dailyMonthTaskMap = new Map()
let dailyInitialized = false
let dailyModalInitialized = false
let dailySaveTimer = null
let dailyActiveTaskIndex = -1

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

function renderDailyTaskList() {
  const listEl = document.getElementById('daily-checkin-task-list')
  const addBtn = document.getElementById('daily-checkin-add-task')
  const dateTitle = document.getElementById('daily-checkin-task-date')
  const emptyEl = document.getElementById('daily-checkin-task-empty')
  if (!listEl || !addBtn || !dateTitle || !emptyEl) return

  dateTitle.textContent = formatDateLabel(dailySelectedDateKey)
  listEl.innerHTML = ''
  emptyEl.style.display = dailyTaskItems.length === 0 ? 'flex' : 'none'

  dailyTaskItems.forEach((item, idx) => {
    const row = document.createElement('div')
    row.className = 'daily-checkin-task-item'
    if (idx === dailyActiveTaskIndex) row.classList.add('is-operating')
    if (item.completed) row.classList.add('is-completed')
    row.style.setProperty('--task-color', String(item.color || DAILY_TASK_COLORS[0].value))
    row.innerHTML = `
      <div class="daily-checkin-task-content">
        <span class="daily-checkin-task-pin" aria-hidden="true">📌</span>
        <span class="daily-checkin-task-text">${escapeHtml(item.content || '')}</span>
      </div>
      <div class="daily-checkin-task-opbar">
        <button class="daily-checkin-task-icon-btn task-op-back" type="button" title="返回" aria-label="返回">↩</button>
        <button class="daily-checkin-task-icon-btn task-op-complete" type="button" title="完成" aria-label="完成">${item.completed ? '↺' : '✓'}</button>
        <button class="daily-checkin-task-icon-btn task-op-delete" type="button" title="删除" aria-label="删除">🗑</button>
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

function renderDailyCalendar() {
  const monthTitle = document.getElementById('daily-checkin-month-title')
  const grid = document.getElementById('daily-checkin-calendar-grid')
  if (!monthTitle || !grid) return
  monthTitle.textContent = `${dailyCurrentMonth.getFullYear()}年 ${dailyCurrentMonth.getMonth() + 1}月`
  grid.innerHTML = ''
  const { days } = monthRangeDays(dailyCurrentMonth)
  days.forEach((day) => {
    const dayEl = document.createElement('button')
    dayEl.type = 'button'; dayEl.className = 'daily-checkin-day'
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
    dayEl.addEventListener('click', async () => {
      await persistDailyTasks()
      dailyActiveTaskIndex = -1; dailySelectedDateKey = day.dateKey
      if (day.date.getMonth() !== dailyCurrentMonth.getMonth() || day.date.getFullYear() !== dailyCurrentMonth.getFullYear()) {
        dailyCurrentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1)
        await loadDailyMonthData(dailyCurrentMonth)
      }
      await loadDailyTasksByDate(dailySelectedDateKey)
      renderDailyCalendar(); renderDailyTaskList()
    })
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
  if (!res?.success) { showToast(res?.error || '保存失败，请稍后重试', 'error'); return }
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
  const modalInput = document.getElementById('daily-checkin-modal-input')
  const modalColor = document.getElementById('daily-checkin-modal-color')
  const modalCancel = document.getElementById('daily-checkin-modal-cancel')
  const modalConfirm = document.getElementById('daily-checkin-modal-confirm')
  if (!modal || !modalInput || !modalColor || !modalCancel || !modalConfirm) return

  modalColor.innerHTML = DAILY_TASK_COLORS.map((c) => `<option value="${c.value}">${c.label}</option>`).join('')

  function closeModal() { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); modalInput.value = ''; modalColor.value = DAILY_TASK_COLORS[0].value }
  function openModal(defaultColor) {
    if (dailyTaskItems.length >= DAILY_MAX_TASKS) return
    modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false')
    modalInput.value = ''; modalColor.value = defaultColor || DAILY_TASK_COLORS[0].value
    setTimeout(() => modalInput.focus(), 0)
  }

  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal() })
  modalCancel.addEventListener('click', closeModal)
  modalConfirm.addEventListener('click', () => {
    const content = modalInput.value.trim()
    if (!content) { showToast('请先填写任务内容', 'warning'); return }
    if (dailyTaskItems.length >= DAILY_MAX_TASKS) { closeModal(); return }
    dailyTaskItems.push({ content, color: String(modalColor.value || DAILY_TASK_COLORS[0].value).toUpperCase(), completed: false })
    closeModal(); renderDailyTaskList(); scheduleDailyTasksSave(true)
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
      if (!res?.success) { showToast(res?.error || '清空失败', 'error'); return }
      dailyTaskItems = []
      dailyActiveTaskIndex = -1
      await loadDailyMonthData(dailyCurrentMonth)
      renderDailyCalendar()
      renderDailyTaskList()
      showToast('已清空全部日程', 'success')
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
