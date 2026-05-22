/**
 * 绩点「年级前 X%」：数值越小越靠前（前 5% 优于前 30%）。
 * 用户输入 30 表示前 30%；若误输入 0.3 也按 30% 处理。
 */

export function normalizeGpaTopPercent(raw) {
  if (raw === null || raw === undefined || raw === '') return undefined
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw).trim())
  if (!Number.isFinite(n)) return undefined

  let top = n
  if (top > 0 && top < 1) top *= 100
  if (top <= 0 || top > 100) return undefined
  return Math.round(top * 10) / 10
}

/** 0–100，越高表示排名越靠前（用于评分曲线） */
export function topPercentToRankStrength(topPercent) {
  const top = normalizeGpaTopPercent(topPercent)
  if (top === undefined) return undefined
  return Math.max(0, Math.min(100, 100 - top))
}

export function formatGpaTopPercentDisplay(raw) {
  const top = normalizeGpaTopPercent(raw)
  if (top === undefined) return null
  return `${top}%`
}
