import { expandDateRange } from './study-planning-parser.js'
import {
  normalizeTaskRecord,
  pickTaskTitle,
  pickTaskSubtitle,
  serializeCheckinTaskContent
} from './localized-content.js'

const MAX_TASKS_PER_DAY = 9

function taskContentKey(task) {
  const title = pickTaskTitle(task)
  const subtitle = pickTaskSubtitle(task)
  return `${title}\n${subtitle}`.trim().toLowerCase()
}

function normalizeDailyTask(task) {
  const record = normalizeTaskRecord(task)
  const dateStart = String(record.dateStart ?? '').trim()
  const dateEnd = String(record.dateEnd ?? dateStart).trim()
  if (!dateStart || !dateEnd) return null
  if (!pickTaskTitle(record) && !pickTaskSubtitle(record)) return null
  return {
    title: record.title,
    subtitle: record.subtitle,
    dateStart,
    dateEnd
  }
}

function findScheduleTaskCoveringDate(dateKey, scheduleEntries = []) {
  let covering = null
  let nearest = null
  let nearestDelta = Infinity
  const target = new Date(`${dateKey}T00:00:00`).getTime()
  if (!Number.isFinite(target)) return null

  scheduleEntries.forEach((entry) => {
    const tasks = Array.isArray(entry?.tasks) ? entry.tasks : []
    tasks.forEach((task) => {
      const normalized = normalizeDailyTask(task)
      if (!normalized) return

      const keys = expandDateRange(normalized.dateStart, normalized.dateEnd)
      if (keys.includes(dateKey)) {
        covering = normalized
        return
      }

      const startTs = new Date(`${normalized.dateStart}T00:00:00`).getTime()
      const endTs = new Date(`${normalized.dateEnd}T00:00:00`).getTime()
      if (!Number.isFinite(startTs) || !Number.isFinite(endTs)) return

      let delta
      if (target < startTs) delta = startTs - target
      else if (target > endTs) delta = target - endTs
      else delta = 0

      if (delta < nearestDelta) {
        nearestDelta = delta
        nearest = normalized
      }
    })
  })

  return covering || nearest
}

/** Expand phase-level schedule entries into per-day check-in tasks (deterministic fallback). */
export function buildDailyTasksFromSchedule(scheduleEntries = []) {
  const dailyTasks = []

  scheduleEntries.forEach((entry) => {
    const tasks = Array.isArray(entry?.tasks) ? entry.tasks : []
    tasks.forEach((task) => {
      const normalized = normalizeDailyTask(task)
      if (!normalized) return

      const dateKeys = expandDateRange(normalized.dateStart, normalized.dateEnd)
      if (dateKeys.length === 0) {
        dailyTasks.push(normalized)
        return
      }

      dateKeys.forEach((dateKey) => {
        dailyTasks.push({
          title: normalized.title,
          subtitle: normalized.subtitle,
          dateStart: dateKey,
          dateEnd: dateKey
        })
      })
    })
  })

  return dailyTasks
}

function addTaskToDateMap(byDate, dateKey, task, source) {
  if (!dateKey) return false
  if (!byDate.has(dateKey)) byDate.set(dateKey, [])
  const list = byDate.get(dateKey)
  if (list.length >= MAX_TASKS_PER_DAY) return false

  const key = taskContentKey(task)
  if (list.some((item) => item.key === key)) return false

  list.push({
    key,
    source,
    title: task.title,
    subtitle: task.subtitle,
    dateStart: dateKey,
    dateEnd: dateKey
  })
  return true
}

/**
 * Merge LLM daily tasks with schedule fallback.
 * LLM tasks take priority; fallback fills dates/slots still under the per-day cap.
 */
export function mergeDailyTaskLists(primaryTasks = [], fallbackTasks = []) {
  const byDate = new Map()

  const addTask = (task, source) => {
    const normalized = normalizeDailyTask(task)
    if (!normalized) return

    const dateKeys = expandDateRange(normalized.dateStart, normalized.dateEnd)
    const keys = dateKeys.length > 0 ? dateKeys : [normalized.dateStart]

    keys.forEach((dateKey) => {
      addTaskToDateMap(byDate, dateKey, normalized, source)
    })
  }

  primaryTasks.forEach((task) => addTask(task, 'llm'))
  fallbackTasks.forEach((task) => addTask(task, 'fallback'))

  return flattenDateTaskMap(byDate)
}

/** Fill dates in the planning window that still have no tasks. */
export function fillTimelineGaps(dailyTasks = [], scheduleEntries = [], timeline = {}) {
  const planStart = timeline?.planStartDate
  const planEnd = timeline?.planEndDate
  if (!planStart || !planEnd) return dailyTasks

  const windowDays = expandDateRange(planStart, planEnd)
  if (windowDays.length === 0) return dailyTasks

  const byDate = new Map()
  dailyTasks.forEach((task) => {
    const normalized = normalizeDailyTask(task)
    if (!normalized) return
    expandDateRange(normalized.dateStart, normalized.dateEnd).forEach((dateKey) => {
      addTaskToDateMap(byDate, dateKey, normalized, 'merged')
    })
  })

  windowDays.forEach((dateKey) => {
    if (byDate.has(dateKey) && byDate.get(dateKey).length > 0) return
    const template = findScheduleTaskCoveringDate(dateKey, scheduleEntries)
    if (!template) return
    addTaskToDateMap(byDate, dateKey, {
      title: template.title,
      subtitle: template.subtitle,
      dateStart: dateKey,
      dateEnd: dateKey
    }, 'gap-fill')
  })

  return flattenDateTaskMap(byDate)
}

function flattenDateTaskMap(byDate) {
  const merged = []
  for (const [, items] of byDate) {
    items.forEach(({ title, subtitle, dateStart, dateEnd }) => {
      merged.push({ title, subtitle, dateStart, dateEnd })
    })
  }

  merged.sort((a, b) => {
    if (a.dateStart !== b.dateStart) return a.dateStart.localeCompare(b.dateStart)
    return taskContentKey(a).localeCompare(taskContentKey(b))
  })

  return merged
}

export function summarizeDailyTaskCoverage(dailyTasks = [], timeline = {}) {
  const planStart = timeline?.planStartDate
  const planEnd = timeline?.planEndDate
  if (!planStart || !planEnd) {
    return { totalDays: 0, coveredDays: 0, coverageRatio: 0 }
  }

  const windowDays = expandDateRange(planStart, planEnd)
  const covered = new Set()

  dailyTasks.forEach((task) => {
    expandDateRange(task.dateStart, task.dateEnd).forEach((dk) => covered.add(dk))
  })

  const totalDays = windowDays.length
  const coveredDays = windowDays.filter((dk) => covered.has(dk)).length
  return {
    totalDays,
    coveredDays,
    coverageRatio: totalDays > 0 ? coveredDays / totalDays : 0
  }
}

function buildImportPayload(dailyTasks, color) {
  const byDate = new Map()

  dailyTasks.forEach((task) => {
    const title = pickTaskTitle(task)
    const subtitle = pickTaskSubtitle(task)
    if (!title && !subtitle) return

    const content = serializeCheckinTaskContent(task.title, task.subtitle)
    const dateKeys = expandDateRange(task.dateStart, task.dateEnd)
    if (dateKeys.length === 0) return

    dateKeys.forEach((dk) => {
      if (!byDate.has(dk)) byDate.set(dk, [])
      const list = byDate.get(dk)
      if (list.length >= MAX_TASKS_PER_DAY) return
      if (list.some((item) => item.content === content)) return
      list.push({ content, color, completed: false })
    })
  })

  return Object.fromEntries(byDate)
}

/** Import merged daily tasks into daily check-in storage (single transaction). */
export async function distributeDailyTasksToCheckin(dailyTasks, color) {
  const byDate = buildImportPayload(dailyTasks, color)
  const dayCount = Object.keys(byDate).length
  const expectedTasks = Object.values(byDate).reduce((sum, tasks) => sum + tasks.length, 0)

  if (dayCount === 0) {
    return { appended: 0, skipped: 0, days: 0, expectedTasks, error: 'no_tasks' }
  }

  if (window.api?.dailyCheckinImportPlan) {
    const res = await window.api.dailyCheckinImportPlan({ byDate })
    if (res?.success) {
      const appended = Number(res.imported) || 0
      return {
        appended,
        skipped: Math.max(0, expectedTasks - appended),
        days: Number(res.days) || dayCount,
        expectedTasks
      }
    }
    return {
      appended: 0,
      skipped: expectedTasks,
      days: 0,
      expectedTasks,
      error: res?.error || 'import_failed'
    }
  }

  if (!window.api?.dailyCheckinClearAll || !window.api?.dailyCheckinSaveByDate) {
    return { appended: 0, skipped: expectedTasks, days: 0, expectedTasks, error: 'unavailable' }
  }

  await window.api.dailyCheckinClearAll()
  let appended = 0
  let skipped = 0
  for (const [dateKey, tasks] of Object.entries(byDate)) {
    const res = await window.api.dailyCheckinSaveByDate(dateKey, tasks)
    if (res?.success) appended += tasks.length
    else skipped += tasks.length
  }

  return { appended, skipped, days: dayCount, expectedTasks }
}
