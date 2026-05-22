import { getReadOnlyDb } from '../utils/db';
import { normalizeLocalized } from './i18n-content.js';

const TIER_KEYS = ['reach', 'match', 'safety'];
const MIN_PER_TIER = 2;
const MAX_PER_TIER = 4;

/** Lower QS rank number = more prestigious. Shift anchor upward (more generous). */
const ANCHOR_SHIFT = 18;

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

function scoreToAnchorRank(totalScore = 70, institutionTier = '双非') {
  const tierBoost = {
    '985': -32,
    '211': -22,
    '双一流': -16,
    '双非': -6,
    '海本': -12,
    '海外本科': -12,
    '民办': 2
  };
  const boost = tierBoost[institutionTier] ?? -6;
  const normalized = Math.max(
    1,
    Math.min(200, Math.round(totalScore * 0.82 + boost - ANCHOR_SHIFT))
  );
  return normalized;
}

function tierRankRange(tier, anchorRank) {
  if (tier === 'reach') {
    return { min: 1, max: Math.max(1, anchorRank - 30) };
  }
  if (tier === 'match') {
    return { min: Math.max(1, anchorRank - 35), max: Math.min(200, anchorRank + 15) };
  }
  return { min: Math.max(1, anchorRank - 5), max: Math.min(200, anchorRank + 55) };
}

function normalizeTierItem(item) {
  const schoolId = Number(item?.schoolId ?? item?.school_id);
  if (!Number.isFinite(schoolId) || schoolId <= 0) return null;
  return {
    schoolId,
    reason: normalizeLocalized(item?.reason, '')
  };
}

function pickCandidates(catalog, range, usedIds, count) {
  const inRange = catalog.filter((school) => {
    const rank = Number(school.ranking_qs) || 999;
    return rank >= range.min && rank <= range.max && !usedIds.has(school.school_id);
  });

  const picked = inRange.slice(0, count);

  if (picked.length < count) {
    for (const school of catalog) {
      if (usedIds.has(school.school_id)) continue;
      if (picked.some((p) => p.school_id === school.school_id)) continue;
      picked.push(school);
      if (picked.length >= count) break;
    }
  }
  return picked;
}

function defaultReason(tier, school) {
  const zhName = school.school_name_zh || school.school_name_en || `院校 #${school.school_id}`;
  const enName = school.school_name_en || school.school_name_zh || `School #${school.school_id}`;
  const templates = {
    reach: {
      zh: `${zhName}（QS ${school.ranking_qs}）可作为冲刺目标，值得在材料完善后尝试。`,
      en: `${enName} (QS ${school.ranking_qs}) is a reasonable reach school to target with strong preparation.`
    },
    match: {
      zh: `${zhName}（QS ${school.ranking_qs}）与当前背景匹配度较高，建议纳入核心申请清单。`,
      en: `${enName} (QS ${school.ranking_qs}) fits your profile well and belongs on your core list.`
    },
    safety: {
      zh: `${zhName}（QS ${school.ranking_qs}）录取把握相对更高，适合作为保底选项。`,
      en: `${enName} (QS ${school.ranking_qs}) offers a relatively safer admit profile as a backup.`
    }
  };
  return templates[tier];
}

export function resolveSchoolTiers(rawTiers = {}, catalog = [], profile = {}, totalScore = 70) {
  const validIds = new Set(catalog.map((s) => s.school_id));
  const schoolById = new Map(catalog.map((s) => [s.school_id, s]));
  const usedIds = new Set();
  const anchorRank = scoreToAnchorRank(totalScore, profile.institutionTier);
  const resolved = { reach: [], match: [], safety: [] };

  for (const tier of TIER_KEYS) {
    const rawItems = Array.isArray(rawTiers?.[tier]) ? rawTiers[tier] : [];
    for (const raw of rawItems) {
      const item = normalizeTierItem(raw);
      if (!item || !validIds.has(item.schoolId) || usedIds.has(item.schoolId)) continue;
      if (resolved[tier].length >= MAX_PER_TIER) break;
      usedIds.add(item.schoolId);
      resolved[tier].push(item);
    }
  }

  for (const tier of TIER_KEYS) {
    while (resolved[tier].length < MIN_PER_TIER) {
      const range = tierRankRange(tier, anchorRank);
      const need = MIN_PER_TIER - resolved[tier].length;
      const picks = pickCandidates(catalog, range, usedIds, need);
      if (picks.length === 0) break;
      for (const school of picks) {
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
