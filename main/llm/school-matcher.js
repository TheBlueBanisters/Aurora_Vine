import { getReadOnlyDb } from '../utils/db';
import { normalizeLocalized } from './i18n-content.js';

const TIER_KEYS = ['reach', 'match', 'safety'];
const MIN_PER_TIER = 2;
const MAX_PER_TIER = 4;

export function loadSchoolCatalog() {
  const db = getReadOnlyDb();
  if (!db) return [];
  try {
    return db.prepare(`
      SELECT school_id, school_name_zh, school_name_en, ranking_qs, country_zh, country_en
      FROM schools
      WHERE ranking_qs IS NOT NULL
      ORDER BY ranking_qs ASC
    `).all();
  } finally {
    db.close();
  }
}

/**
 * Map competitiveness score to a baseline QS rank (higher number = less selective baseline).
 * Conservative: lower scores anchor to weaker tiers; 985/211 only modestly shift upward.
 */
export function scoreToAnchorRank(totalScore = 70, institutionTier = '双非') {
  const tierAdjust = {
    '985': -12,
    '211': -8,
    '双一流': -5,
    '双非': 0,
    '海本': -4,
    '海外本科': -4,
    '民办': 6
  };
  const adjust = tierAdjust[institutionTier] ?? 0;
  const score = Math.max(0, Math.min(100, Number(totalScore) || 70));
  const anchor = Math.round(125 - score * 0.78 + adjust);
  return Math.max(20, Math.min(165, anchor));
}

function tierRankRange(tier, anchorRank) {
  if (tier === 'reach') {
    return {
      min: 1,
      max: Math.max(1, anchorRank - 18)
    };
  }
  if (tier === 'match') {
    return {
      min: Math.max(1, anchorRank - 10),
      max: Math.min(200, anchorRank + 6)
    };
  }
  return {
    min: Math.max(1, anchorRank + 8),
    max: Math.min(200, anchorRank + 32)
  };
}

function schoolInRange(school, range) {
  const rank = Number(school.ranking_qs) || 999;
  return rank >= range.min && rank <= range.max;
}

function normalizeTierItem(item) {
  const schoolId = Number(item?.schoolId ?? item?.school_id);
  if (!Number.isFinite(schoolId) || schoolId <= 0) return null;
  return {
    schoolId,
    reason: normalizeLocalized(item?.reason, '')
  };
}

function buildLlmReasonLookup(rawTiers = {}) {
  const map = new Map();
  for (const tier of TIER_KEYS) {
    const items = Array.isArray(rawTiers?.[tier]) ? rawTiers[tier] : [];
    for (const raw of items) {
      const item = normalizeTierItem(raw);
      if (!item) continue;
      const key = `${tier}:${item.schoolId}`;
      if (!map.has(key)) map.set(key, item.reason);
    }
  }
  return map;
}

function pickCandidates(catalog, range, usedIds, count) {
  const inRange = catalog.filter((school) => {
    return schoolInRange(school, range) && !usedIds.has(school.school_id);
  });

  const picked = inRange.slice(0, count);
  if (picked.length >= count) return picked;

  const expanded = { min: Math.max(1, range.min - 5), max: Math.min(200, range.max + 5) };
  for (const school of catalog) {
    if (picked.length >= count) break;
    if (usedIds.has(school.school_id)) continue;
    if (!schoolInRange(school, expanded)) continue;
    if (picked.some((p) => p.school_id === school.school_id)) continue;
    picked.push(school);
  }

  return picked;
}

function defaultReason(tier, school) {
  const zhName = school.school_name_zh || school.school_name_en || `院校 #${school.school_id}`;
  const enName = school.school_name_en || school.school_name_zh || `School #${school.school_id}`;
  const templates = {
    reach: {
      zh: `${zhName}（QS ${school.ranking_qs}）高于当前综合得分对应的基准档位，可作为冲刺校，需强化材料与匹配度。`,
      en: `${enName} (QS ${school.ranking_qs}) is above your score baseline — treat as a reach with stronger materials.`
    },
    match: {
      zh: `${zhName}（QS ${school.ranking_qs}）与系统综合得分映射的主申区间接近，建议作为核心申请目标。`,
      en: `${enName} (QS ${school.ranking_qs}) aligns with your score-mapped core target band.`
    },
    safety: {
      zh: `${zhName}（QS ${school.ranking_qs}）低于基准档位，录取概率相对更高，适合作为保底选项。`,
      en: `${enName} (QS ${school.ranking_qs}) sits below your baseline — a relatively safer backup option.`
    }
  };
  return templates[tier];
}

/**
 * 冲稳保以综合得分 → QS 锚点映射为主；LLM 仅补充已落入该区间的院校理由。
 */
export function resolveSchoolTiers(rawTiers = {}, catalog = [], profile = {}, totalScore = 70) {
  const schoolById = new Map(catalog.map((s) => [s.school_id, s]));
  const usedIds = new Set();
  const anchorRank = scoreToAnchorRank(totalScore, profile.institutionTier);
  const llmReasons = buildLlmReasonLookup(rawTiers);
  const resolved = { reach: [], match: [], safety: [] };

  for (const tier of TIER_KEYS) {
    const range = tierRankRange(tier, anchorRank);
    const picks = pickCandidates(catalog, range, usedIds, MAX_PER_TIER);
    for (const school of picks) {
      usedIds.add(school.school_id);
      const reasonKey = `${tier}:${school.school_id}`;
      const llmReason = llmReasons.get(reasonKey);
      const hasLlmReason = llmReason && (llmReason.zh || llmReason.en);
      resolved[tier].push({
        schoolId: school.school_id,
        reason: hasLlmReason ? llmReason : defaultReason(tier, school)
      });
    }

    while (resolved[tier].length < MIN_PER_TIER) {
      const need = MIN_PER_TIER - resolved[tier].length;
      const extra = pickCandidates(catalog, tierRankRange(tier, anchorRank), usedIds, need);
      if (extra.length === 0) break;
      for (const school of extra) {
        usedIds.add(school.school_id);
        resolved[tier].push({
          schoolId: school.school_id,
          reason: defaultReason(tier, school)
        });
      }
    }
  }

  const enriched = {};
  for (const tier of TIER_KEYS) {
    enriched[tier] = resolved[tier].map((item) => ({
      ...item,
      school: schoolById.get(item.schoolId)
    }));
  }

  return enriched;
}

export function catalogForPrompt(catalog = []) {
  return catalog.map((school) => ({
    schoolId: school.school_id,
    schoolNameZh: school.school_name_zh,
    schoolNameEn: school.school_name_en,
    rankingQs: school.ranking_qs,
    countryZh: school.country_zh,
    countryEn: school.country_en
  }));
}
