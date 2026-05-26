/**
 * GPA ↔ 百分制 换算规则（与 main/utils/gpa-conversion.js 保持一致）。
 *
 * 5 分制锚点（用户指定规则）：
 *   0.0 → 50, 1.0 → 60, 2.0 → 70, 3.0 → 80, 3.5 → 85, 4.0 → 90, 4.5 → 95, 5.0 → 100
 *   线性公式：percent = 50 + GPA × 10
 *
 * 4 分制锚点（常见 WES 转换表）：
 *   0.0 → 60, 1.0 → 65, 2.0 → 75, 3.0 → 80, 3.5 → 85, 3.7 → 87, 4.0 → 90
 */

const FIVE_SCALE_ANCHORS = [
  { gpa: 0.0, percent: 50 },
  { gpa: 1.0, percent: 60 },
  { gpa: 2.0, percent: 70 },
  { gpa: 3.0, percent: 80 },
  { gpa: 3.5, percent: 85 },
  { gpa: 4.0, percent: 90 },
  { gpa: 4.5, percent: 95 },
  { gpa: 5.0, percent: 100 }
]

const FOUR_SCALE_ANCHORS = [
  { gpa: 0.0, percent: 60 },
  { gpa: 1.0, percent: 65 },
  { gpa: 2.0, percent: 75 },
  { gpa: 3.0, percent: 80 },
  { gpa: 3.5, percent: 85 },
  { gpa: 3.7, percent: 87 },
  { gpa: 4.0, percent: 90 }
]

function interpolate(anchors, gpa) {
  const minA = anchors[0]
  const maxA = anchors[anchors.length - 1]
  if (gpa <= minA.gpa) return minA.percent
  if (gpa >= maxA.gpa) return maxA.percent

  for (let i = 1; i < anchors.length; i++) {
    if (gpa <= anchors[i].gpa) {
      const a = anchors[i - 1]
      const b = anchors[i]
      const t = (gpa - a.gpa) / (b.gpa - a.gpa)
      return a.percent + t * (b.percent - a.percent)
    }
  }
  return maxA.percent
}

export function gpaScaleAnchors(scale) {
  return scale === 4 ? FOUR_SCALE_ANCHORS : FIVE_SCALE_ANCHORS
}

export function gpaToPercent(gpa, scale) {
  if (gpa == null) return null
  if (typeof gpa === 'string' && gpa.trim() === '') return null
  const numeric = Number(gpa)
  if (!Number.isFinite(numeric)) return null
  const numericScale = scale === 4 || scale === '4' ? 4 : 5
  const anchors = gpaScaleAnchors(numericScale)
  const value = interpolate(anchors, numeric)
  return Math.round(value * 10) / 10
}

export function gpaConversionRuleSummary(scale) {
  const numericScale = scale === 4 || scale === '4' ? 4 : 5
  const anchors = gpaScaleAnchors(numericScale)
  return anchors.map((a) => `${a.gpa.toFixed(1)}→${a.percent}`).join('，')
}
