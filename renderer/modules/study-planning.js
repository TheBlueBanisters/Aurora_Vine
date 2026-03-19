import { showToast, escapeHtml } from './utils.js'
import { DAILY_TASK_COLORS } from './state.js'
import { parseStudyPlanText, expandDateRange } from './study-planning-parser.js'

let spInitialized = false
let spEntries = []

function pickColorByIndex(index) {
  return DAILY_TASK_COLORS[index % DAILY_TASK_COLORS.length].value
}

async function loadEntries() {
  if (!window.api?.studyPlanList) { spEntries = []; return }
  const res = await window.api.studyPlanList()
  if (res?.error) { console.error('studyPlanList:', res.error); spEntries = []; return }
  spEntries = (res?.items || []).map((row) => {
    let tasks = []
    try { tasks = JSON.parse(row.tasks_json || '[]') } catch (_) {}
    return {
      id: row.id,
      title: String(row.title || ''),
      description: String(row.description || ''),
      color: String(row.color || DAILY_TASK_COLORS[0].value),
      tasks
    }
  })
}

function renderOutlinePanel() {
  const listEl = document.getElementById('study-planning-outline-list')
  const emptyEl = document.getElementById('study-planning-outline-empty')
  if (!listEl) return

  const existing = listEl.querySelectorAll('.study-planning-entry')
  existing.forEach((el) => el.remove())

  if (emptyEl) emptyEl.style.display = spEntries.length === 0 ? 'flex' : 'none'

  spEntries.forEach((entry) => {
    const el = document.createElement('div')
    el.className = 'study-planning-entry'

    const tasksHtml = entry.tasks.map((t) =>
      `<div class="study-planning-entry-task" style="--task-dot-color:${entry.color}">${escapeHtml(t.content)}</div>`
    ).join('')

    let descHtml = ''
    if (entry.description) {
      const stripped = entry.description.replace(/^["'\u201c\u201d\u2018\u2019]+|["'\u201c\u201d\u2018\u2019]+$/g, '')
      descHtml = `<p class="study-planning-entry-desc">\u201c${escapeHtml(stripped)}\u201d</p>`
    }

    el.innerHTML = `
      <div class="study-planning-entry-header">
        <span class="study-planning-entry-title">
          <span class="study-planning-entry-color" style="background:${entry.color}"></span>
          ${escapeHtml(entry.title)}
        </span>
        <button class="study-planning-entry-delete" type="button" title="删除该条目" aria-label="删除该条目">✕</button>
      </div>
      ${descHtml}
      <div class="study-planning-entry-tasks">${tasksHtml}</div>
    `

    el.querySelector('.study-planning-entry-delete')?.addEventListener('click', async () => {
      if (!window.api?.studyPlanDelete) return
      const res = await window.api.studyPlanDelete(entry.id)
      if (!res?.success) { showToast(res?.error || '删除失败', 'error'); return }
      await loadEntries()
      renderOutlinePanel()
      showToast('已删除该规划条目', 'success')
    })

    listEl.appendChild(el)
  })
}

async function distributeTasksToDailyCheckin(entries) {
  if (!window.api?.dailyCheckinAppendTasks) {
    showToast('打卡接口不可用', 'error')
    return 0
  }

  const dateTaskMap = new Map()

  entries.forEach((entry) => {
    entry.tasks.forEach((task) => {
      const dateKeys = expandDateRange(task.dateStart, task.dateEnd)
      dateKeys.forEach((dk) => {
        if (!dateTaskMap.has(dk)) dateTaskMap.set(dk, [])
        dateTaskMap.get(dk).push({ content: task.content, color: entry.color, completed: false })
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

function initCustomPanel() {
  const submitBtn = document.getElementById('study-planning-custom-submit')
  const textarea = document.getElementById('study-planning-custom-input')
  if (!submitBtn || !textarea) return

  submitBtn.addEventListener('click', async () => {
    const text = textarea.value.trim()
    if (!text) { showToast('请先输入规划内容', 'warning'); return }

    const { entries: parsed, errors } = parseStudyPlanText(text)

    if (errors.length > 0 && parsed.length === 0) {
      showToast('输入内容格式有误：\n' + errors.join('\n'), 'error')
      return
    }

    if (errors.length > 0) {
      showToast('部分内容格式有误已跳过：\n' + errors.join('\n'), 'warning')
    }

    if (parsed.length === 0) { showToast('未识别到有效的规划条目（需以 # 开头）', 'warning'); return }

    const existingCount = spEntries.length
    const enriched = parsed.map((entry, idx) => ({
      ...entry,
      color: pickColorByIndex(existingCount + idx)
    }))

    if (!window.api?.studyPlanSave) { showToast('存储接口不可用', 'error'); return }

    submitBtn.disabled = true
    try {
      const saveRes = await window.api.studyPlanSave(enriched)
      if (!saveRes?.success) { showToast(saveRes?.error || '保存失败', 'error'); return }

      const appended = await distributeTasksToDailyCheckin(enriched)

      await loadEntries()
      renderOutlinePanel()
      textarea.value = ''

      showToast(`已添加 ${enriched.length} 条规划，分发了 ${appended} 条任务到每日打卡`, 'success')
    } catch (err) {
      console.error('study-planning submit error:', err)
      showToast('操作失败，请稍后重试', 'error')
    } finally {
      submitBtn.disabled = false
    }
  })
}

export async function initStudyPlanningPage() {
  await loadEntries()
  renderOutlinePanel()

  if (!spInitialized) {
    initCustomPanel()
    spInitialized = true
  }
}
