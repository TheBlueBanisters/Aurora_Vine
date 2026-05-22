const TASK_RE = /^\[(\d{4})\.(\d{1,2})\.(\d{1,2})-(\d{4})\.(\d{1,2})\.(\d{1,2})\](.+)$/
const TASK_BRACKET_RE = /^\[.*\]/

function pad2(n) {
  return String(n).padStart(2, '0')
}

export function normalizeParsedDate(year, month, day) {
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)
  if (!Number.isFinite(y) || m < 1 || m > 12 || d < 1 || d > 31) return null
  return `${y}-${pad2(m)}-${pad2(d)}`
}

export function expandDateRange(dateStart, dateEnd) {
  const start = new Date(dateStart + 'T00:00:00')
  const end = new Date(dateEnd + 'T00:00:00')
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return []
  const keys = []
  const cursor = new Date(start)
  while (cursor <= end) {
    keys.push(
      `${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}-${pad2(cursor.getDate())}`
    )
    cursor.setDate(cursor.getDate() + 1)
  }
  return keys
}

export function parseStudyPlanText(text) {
  const lines = String(text || '').split(/\r?\n/)
  const entries = []
  const errors = []
  let current = null
  let lineNum = 0

  for (const raw of lines) {
    lineNum++
    const line = raw.trim()
    if (!line) continue

    if (line.startsWith('#')) {
      const title = line.slice(1).trim()
      if (!title) {
        errors.push(`第 ${lineNum} 行：# 后缺少标题内容`)
        continue
      }
      current = { title, description: '', tasks: [] }
      entries.push(current)
      continue
    }

    if (!current) {
      errors.push(`第 ${lineNum} 行：「${line.length > 20 ? line.slice(0, 20) + '…' : line}」出现在任何 # 标题之前，已忽略`)
      continue
    }

    if (line.startsWith('*')) {
      current.description = line.slice(1).trim()
      continue
    }

    const match = line.match(TASK_RE)
    if (match) {
      const dateStart = normalizeParsedDate(match[1], match[2], match[3])
      const dateEnd = normalizeParsedDate(match[4], match[5], match[6])
      const content = match[7].trim()
      if (!dateStart) {
        errors.push(`第 ${lineNum} 行：起始日期无效（月份或日期超出范围）`)
        continue
      }
      if (!dateEnd) {
        errors.push(`第 ${lineNum} 行：结束日期无效（月份或日期超出范围）`)
        continue
      }
      if (dateStart > dateEnd) {
        errors.push(`第 ${lineNum} 行：起始日期 ${dateStart} 晚于结束日期 ${dateEnd}`)
        continue
      }
      if (!content) {
        errors.push(`第 ${lineNum} 行：日期后缺少任务内容`)
        continue
      }
      current.tasks.push({ content, dateStart, dateEnd })
      continue
    }

    if (TASK_BRACKET_RE.test(line)) {
      errors.push(`第 ${lineNum} 行：日期格式有误，应为 [年.月.日-年.月.日]任务内容`)
    } else {
      errors.push(`第 ${lineNum} 行：无法识别的内容「${line.length > 20 ? line.slice(0, 20) + '…' : line}」`)
    }
  }

  return { entries, errors }
}
