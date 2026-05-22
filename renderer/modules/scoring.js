import { normalizeGpaTopPercent, topPercentToRankStrength } from './gpa-percent.js'

const SCHOOL_LEVEL_MAP = {
  '985': 100,
  '211': 85,
  '双非': 70,
  '海本': 90,
  '海外本科': 90,
}

const BASE_WEIGHTS = {
  gpa: 0.25,
  lang: 0.20,
  bg: 0.20,
  school: 0.20,
  llm: 0.15,
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function round2(n) {
  return Math.round(n * 100) / 100
}

function calcGpa(input) {
  const gpaNorm = input.gpaScale === 4
    ? (input.gpa / 4) * 100
    : (input.gpa / 5) * 100

  const k_gpa = 30
  const gpaSat = 100 * (1 - Math.exp(-gpaNorm / k_gpa))

  if (input.percentile === undefined) return gpaSat

  const rankStrength = topPercentToRankStrength(input.percentile)
  if (rankStrength === undefined) return gpaSat

  const deficiency = Math.max(0, 80 - gpaNorm)
  const advantage = Math.max(0, rankStrength - 70)
  const rawBoost = 0.5 * Math.min(deficiency, advantage)
  const dampedBoost = rawBoost * (1 - gpaNorm / 100)

  return gpaSat + dampedBoost
}

function calcLang(input) {
  const langScores = []

  if (input.ielts !== undefined) {
    langScores.push(((input.ielts - 4) / 5) * 100)
  }
  if (input.toefl !== undefined) {
    langScores.push(((input.toefl - 70) / 50) * 100)
  }

  let rawLang
  if (langScores.length > 0) {
    rawLang = Math.max(...langScores)
  } else if (input.gre !== undefined) {
    rawLang = 0.7 * ((input.gre - 300) / 40) * 100
  } else {
    rawLang = -20
  }

  const k_lang = 30
  return rawLang >= 0
    ? 100 * (1 - Math.exp(-rawLang / k_lang))
    : rawLang
}

function calcBg(input) {
  const R = Math.min(10, input.researchCount)
  const I = Math.min(10, input.internshipCount)
  const P = Math.min(10, input.paperCount)
  const T = 1.0 * R + 0.8 * I + 0.9 * P
  const k_bg = 2.5
  return 100 * (1 - Math.exp(-T / k_bg))
}

function calcSchool(input) {
  return SCHOOL_LEVEL_MAP[input.schoolLevel] ?? 70
}

export function computeStudentScore(input) {
  const gpa = calcGpa(input)
  const lang = calcLang(input)
  const bg = calcBg(input)
  const school = calcSchool(input)

  let totalScore
  const hasLlm = input.llmScore !== undefined && input.llmScore !== null

  if (hasLlm) {
    totalScore =
      BASE_WEIGHTS.gpa * gpa +
      BASE_WEIGHTS.lang * lang +
      BASE_WEIGHTS.bg * bg +
      BASE_WEIGHTS.school * school +
      BASE_WEIGHTS.llm * input.llmScore
  } else {
    const total = BASE_WEIGHTS.gpa + BASE_WEIGHTS.lang + BASE_WEIGHTS.bg + BASE_WEIGHTS.school
    totalScore =
      (BASE_WEIGHTS.gpa / total) * gpa +
      (BASE_WEIGHTS.lang / total) * lang +
      (BASE_WEIGHTS.bg / total) * bg +
      (BASE_WEIGHTS.school / total) * school
  }

  if (input.graduationYear !== undefined) {
    const yearsLeft = input.graduationYear - 2027
    if (yearsLeft > 0) {
      const alpha = 0.15
      const tau = 2
      const factor = 1 + alpha * (1 - Math.exp(-yearsLeft / tau))
      const potentialPart = BASE_WEIGHTS.gpa * gpa + BASE_WEIGHTS.bg * bg
      totalScore += potentialPart * (factor - 1)
    }
  }

  totalScore = round2(clamp(totalScore))

  return {
    totalScore,
    detail: {
      gpa: round2(gpa),
      lang: round2(lang),
      bg: round2(bg),
      school: round2(school),
      llm: hasLlm ? round2(input.llmScore) : null,
    },
  }
}

export function profileToScoreInput(profile) {
  const gpaScale = profile.gpaScale === '5' ? 5 : 4
  const gpa = parseFloat(profile.gpa) || 0

  const percentile = normalizeGpaTopPercent(profile.gpaPercentile)

  const ieltsRaw = parseFloat(profile.ielts)
  const ielts = (!isNaN(ieltsRaw) && ieltsRaw >= 4) ? ieltsRaw : undefined

  const toeflRaw = parseInt(profile.toefl, 10)
  const toefl = (!isNaN(toeflRaw) && toeflRaw >= 70) ? toeflRaw : undefined

  const greRaw = parseInt(profile.gre, 10)
  const gre = (!isNaN(greRaw) && greRaw >= 300) ? greRaw : undefined

  const gradYear = parseInt(profile.graduationYear, 10)
  const graduationYear = (!isNaN(gradYear) && gradYear >= 2020) ? gradYear : undefined

  return {
    gpa,
    gpaScale,
    percentile,
    ielts,
    toefl,
    gre,
    researchCount: parseInt(profile.researchCount, 10) || 0,
    internshipCount: parseInt(profile.internshipCount, 10) || 0,
    paperCount: parseInt(profile.paperCount, 10) || 0,
    schoolLevel: profile.institutionTier || '双非',
    graduationYear,
    llmScore: profile.llmScore != null && profile.llmScore !== '' ? Number(profile.llmScore) : undefined,
  }
}
