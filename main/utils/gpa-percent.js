/**
 * 绩点「年级前 X%」：与 renderer/modules/gpa-percent.js 保持一致。
 */

export function normalizeGpaTopPercent(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw).trim());
  if (!Number.isFinite(n)) return null;

  let top = n;
  if (top > 0 && top < 1) top *= 100;
  if (top <= 0 || top > 100) return null;
  return Math.round(top * 10) / 10;
}

export function topPercentToRankStrength(topPercent) {
  const top = normalizeGpaTopPercent(topPercent);
  if (top == null) return null;
  return Math.max(0, Math.min(100, 100 - top));
}
