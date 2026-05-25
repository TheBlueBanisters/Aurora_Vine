import { getReadOnlyDb } from '../utils/db';
import { normalizeLocalized } from './i18n-content.js';
import { filterCatalogByRegions } from './study-preferences.js';

const TIER_KEYS = ['reach', 'match', 'safety'];
const MIN_PER_TIER = 2;
const MAX_PER_TIER = 4;
const MAX_POOL_PER_TIER = 30;
const MAX_SUPPLEMENTAL_PER_TIER = 35;
/** 每档允许 LLM 在预筛池外额外加入的院校数（须在放宽 QS 带内） */
const MAX_OUT_OF_POOL_PER_TIER = 1;

const MAINLAND_COUNTRY_ZH = new Set(['中国', '中华人民共和国']);
const MAINLAND_COUNTRY_EN = new Set(['china', "people's republic of china", 'prc', 'mainland china']);

export function isMainlandChinaSchool(school) {
  const zh = String(school?.country_zh || '').trim();
  const en = String(school?.country_en || '').trim().toLowerCase();

  if (/中国香港|中国澳门|中国台湾/.test(zh)) return false;
  if (/hong\s*kong|macau|macao|taiwan/i.test(en)) return false;

  if (MAINLAND_COUNTRY_ZH.has(zh)) return true;
  if (MAINLAND_COUNTRY_EN.has(en)) return true;
  return false;
}

export function filterAbroadSchoolCatalog(catalog = []) {
  return catalog.filter((school) => !isMainlandChinaSchool(school));
}

export function loadSchoolCatalog() {
  const db = getReadOnlyDb();
  if (!db) return [];
  try {
    const rows = db.prepare(`
      SELECT school_id, school_name_zh, school_name_en, ranking_qs, country_zh, country_en
      FROM schools
      WHERE ranking_qs IS NOT NULL
      ORDER BY ranking_qs ASC
    `).all();
    return filterAbroadSchoolCatalog(rows);
  } finally {
    db.close();
  }
}

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

/** 较宽的 QS 区间，供 LLM 在此池内二次筛选 */
function tierRankRangeWide(tier, anchorRank) {
  if (tier === 'reach') {
    const best = Math.max(1, anchorRank - 10);
    const worst = Math.max(best, anchorRank - 42);
    return { min: worst, max: best };
  }
  if (tier === 'match') {
    return {
      min: Math.max(1, anchorRank - 20),
      max: Math.min(200, anchorRank + 20)
    };
  }
  return {
    min: Math.max(1, anchorRank + 6),
    max: Math.min(200, anchorRank + 48)
  };
}

/** 最终落档用的较窄区间（兜底选校） */
function tierRankRangeNarrow(tier, anchorRank) {
  if (tier === 'reach') {
    const best = Math.max(1, anchorRank - 12);
    const worst = Math.max(best, anchorRank - 28);
    return { min: worst, max: best };
  }
  if (tier === 'match') {
    return {
      min: Math.max(1, anchorRank - 8),
      max: Math.min(200, anchorRank + 8)
    };
  }
  return {
    min: Math.max(1, anchorRank + 10),
    max: Math.min(200, anchorRank + 35)
  };
}

function tierTargetQs(tier, anchorRank) {
  if (tier === 'reach') return Math.max(20, anchorRank - 20);
  if (tier === 'match') return anchorRank;
  return Math.min(195, anchorRank + 22);
}

function schoolInRange(school, range) {
  const rank = Number(school.ranking_qs) || 999;
  return rank >= range.min && rank <= range.max;
}

function toPoolEntry(school) {
  return {
    schoolId: school.school_id,
    schoolNameZh: school.school_name_zh,
    schoolNameEn: school.school_name_en,
    rankingQs: school.ranking_qs,
    countryZh: school.country_zh,
    countryEn: school.country_en
  };
}

function sortByTargetQs(schools, target) {
  return [...schools].sort((a, b) => {
    const da = Math.abs((Number(a.ranking_qs) || 999) - target);
    const db = Math.abs((Number(b.ranking_qs) || 999) - target);
    if (da !== db) return da - db;
    return (Number(a.ranking_qs) || 999) - (Number(b.ranking_qs) || 999);
  });
}

/**
 * 按分数映射宽区间 + 意向地区，生成各梯度候选池。
 */
export function buildTierCandidatePools(catalog = [], totalScore = 70, profile = {}) {
  let abroad = filterAbroadSchoolCatalog(catalog);
  abroad = filterCatalogByRegions(abroad, profile.preferredRegions);

  const anchorRank = scoreToAnchorRank(totalScore, profile.institutionTier);
  const ranges = {};
  const pools = { reach: [], match: [], safety: [] };

  for (const tier of TIER_KEYS) {
    const range = tierRankRangeWide(tier, anchorRank);
    ranges[tier] = range;
    const target = tierTargetQs(tier, anchorRank);
    const inRange = abroad.filter((s) => schoolInRange(s, range));
    pools[tier] = sortByTargetQs(inRange, target)
      .slice(0, MAX_POOL_PER_TIER)
      .map(toPoolEntry);
  }

  return { anchorRank, ranges, pools };
}

/** LLM 可增补选校的 QS 带（略宽于预筛池） */
function tierRankRangeLlmExtra(tier, anchorRank) {
  if (tier === 'reach') {
    const best = Math.max(1, anchorRank - 6);
    const worst = Math.max(best, anchorRank - 50);
    return { min: worst, max: best };
  }
  if (tier === 'match') {
    return {
      min: Math.max(1, anchorRank - 28),
      max: Math.min(200, anchorRank + 28)
    };
  }
  return {
    min: Math.max(1, anchorRank + 4),
    max: Math.min(200, anchorRank + 55)
  };
}

/**
 * 预筛池 + 可增补院校（池外但仍在合理 QS 带），供 LLM 校验与提示。
 */
export function buildTierLlmAllowance(catalog = [], poolBundle, profile = {}) {
  const abroadCatalog = filterCatalogByRegions(
    filterAbroadSchoolCatalog(catalog),
    profile.preferredRegions
  );
  const anchorRank = poolBundle.anchorRank;
  const allowedByTier = { reach: [], match: [], safety: [] };
  const supplementalByTier = { reach: [], match: [], safety: [] };

  for (const tier of TIER_KEYS) {
    const poolIds = new Set((poolBundle.pools[tier] || []).map((s) => s.schoolId));
    const extraRange = tierRankRangeLlmExtra(tier, anchorRank);
    const target = tierTargetQs(tier, anchorRank);

    poolIds.forEach((id) => allowedByTier[tier].push(id));

    const supplemental = sortByTargetQs(
      abroadCatalog.filter((s) => {
        return !poolIds.has(s.school_id) && schoolInRange(s, extraRange);
      }),
      target
    )
      .slice(0, MAX_SUPPLEMENTAL_PER_TIER)
      .map(toPoolEntry);

    supplementalByTier[tier] = supplemental;
    supplemental.forEach((entry) => {
      if (!poolIds.has(entry.schoolId)) {
        allowedByTier[tier].push(entry.schoolId);
      }
    });
  }

  return { allowedByTier, supplementalByTier, abroadCatalog };
}

export function poolsToPromptPayload(poolBundle, allowance = null) {
  const payload = {
    anchorQsRank: poolBundle.anchorRank,
    scorePools: {
      reach: poolBundle.pools.reach,
      match: poolBundle.pools.match,
      safety: poolBundle.pools.safety
    },
    poolRanges: poolBundle.ranges
  };
  if (allowance) {
    payload.supplementalCatalog = allowance.supplementalByTier;
    payload.llmExtraQsRanges = {
      reach: tierRankRangeLlmExtra('reach', poolBundle.anchorRank),
      match: tierRankRangeLlmExtra('match', poolBundle.anchorRank),
      safety: tierRankRangeLlmExtra('safety', poolBundle.anchorRank)
    };
  }
  return payload;
}

function normalizeTierItem(item) {
  const schoolId = Number(item?.schoolId ?? item?.school_id);
  if (!Number.isFinite(schoolId) || schoolId <= 0) return null;
  return {
    schoolId,
    reason: normalizeLocalized(item?.reason, '')
  };
}

function pickFallbackSchools(catalog, range, usedIds, count, tier, anchorRank) {
  const target = tierTargetQs(tier, anchorRank);
  const eligible = catalog.filter((school) => {
    return schoolInRange(school, range)
      && !usedIds.has(school.school_id)
      && !isMainlandChinaSchool(school);
  });
  return sortByTargetQs(eligible, target).slice(0, count);
}

/** 无视 QS 区间，按档位目标排名从目录中补足（最后手段） */
function pickClosestSchools(catalog, usedIds, count, tier, anchorRank) {
  const target = tierTargetQs(tier, anchorRank);
  const eligible = catalog.filter(
    (school) => !usedIds.has(school.school_id) && !isMainlandChinaSchool(school)
  );
  return sortByTargetQs(eligible, target).slice(0, count);
}

function appendTierSchools(resolved, tier, schools, usedIds) {
  let added = 0;
  for (const school of schools) {
    if (resolved[tier].length >= MIN_PER_TIER) break;
    const id = school.school_id;
    if (!id || usedIds.has(id)) continue;
    usedIds.add(id);
    resolved[tier].push({
      schoolId: id,
      reason: defaultReason(tier, school)
    });
    added += 1;
  }
  return added;
}

/**
 * 按优先级补足至 MIN_PER_TIER：地区+窄区间 → 地区+宽区间 → 分数池 → 全球+窄 → 全球+宽 → 全球最近 QS。
 */
function fillTierToMinimum(resolved, tier, usedIds, {
  regionCatalog,
  fullCatalog,
  poolBundle,
  anchorRank
}) {
  while (resolved[tier].length < MIN_PER_TIER) {
    const need = MIN_PER_TIER - resolved[tier].length;
    const narrowRange = tierRankRangeNarrow(tier, anchorRank);
    const wideRange = poolBundle.ranges?.[tier] || tierRankRangeWide(tier, anchorRank);
    let added = 0;

    added += appendTierSchools(
      resolved,
      tier,
      pickFallbackSchools(regionCatalog, narrowRange, usedIds, need, tier, anchorRank),
      usedIds
    );
    if (resolved[tier].length >= MIN_PER_TIER) return;

    const need2 = MIN_PER_TIER - resolved[tier].length;
    added += appendTierSchools(
      resolved,
      tier,
      pickFallbackSchools(regionCatalog, wideRange, usedIds, need2, tier, anchorRank),
      usedIds
    );
    if (resolved[tier].length >= MIN_PER_TIER) return;

    const poolSchools = (poolBundle.pools[tier] || [])
      .map((entry) => fullCatalog.find((s) => s.school_id === entry.schoolId))
      .filter(Boolean);
    const need3 = MIN_PER_TIER - resolved[tier].length;
    added += appendTierSchools(
      resolved,
      tier,
      poolSchools.filter((s) => !usedIds.has(s.school_id)).slice(0, need3),
      usedIds
    );
    if (resolved[tier].length >= MIN_PER_TIER) return;

    const need4 = MIN_PER_TIER - resolved[tier].length;
    added += appendTierSchools(
      resolved,
      tier,
      pickFallbackSchools(fullCatalog, narrowRange, usedIds, need4, tier, anchorRank),
      usedIds
    );
    if (resolved[tier].length >= MIN_PER_TIER) return;

    const need5 = MIN_PER_TIER - resolved[tier].length;
    added += appendTierSchools(
      resolved,
      tier,
      pickFallbackSchools(fullCatalog, wideRange, usedIds, need5, tier, anchorRank),
      usedIds
    );
    if (resolved[tier].length >= MIN_PER_TIER) return;

    const need6 = MIN_PER_TIER - resolved[tier].length;
    added += appendTierSchools(
      resolved,
      tier,
      pickClosestSchools(fullCatalog, usedIds, need6, tier, anchorRank),
      usedIds
    );

    if (added === 0) break;
  }
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

function poolSchoolById(poolBundle) {
  const map = { reach: new Map(), match: new Map(), safety: new Map() };
  for (const tier of TIER_KEYS) {
    for (const entry of poolBundle.pools[tier] || []) {
      map[tier].set(entry.schoolId, entry);
    }
  }
  return map;
}

/**
 * 将 LLM 审核结果落档；不足 MIN 时用分数窄区间兜底，保证每档至少 MIN_PER_TIER 所。
 */
export function finalizeSchoolTiersFromLlm(
  llmTiers = null,
  poolBundle,
  catalog = [],
  profile = {},
  totalScore = 70
) {
  const fullCatalog = filterAbroadSchoolCatalog(catalog);
  const regionCatalog = filterCatalogByRegions(fullCatalog, profile.preferredRegions);
  const schoolById = new Map(fullCatalog.map((s) => [s.school_id, s]));
  const poolMaps = poolSchoolById(poolBundle);
  const anchorRank = poolBundle?.anchorRank ?? scoreToAnchorRank(totalScore, profile.institutionTier);
  const usedIds = new Set();
  const resolved = { reach: [], match: [], safety: [] };

  const llm = llmTiers || { reach: [], match: [], safety: [] };

  for (const tier of TIER_KEYS) {
    const rawItems = Array.isArray(llm[tier]) ? llm[tier] : [];
    let outOfPoolCount = 0;
    const extraRange = tierRankRangeLlmExtra(tier, anchorRank);

    for (const raw of rawItems) {
      if (resolved[tier].length >= MAX_PER_TIER) break;
      const item = normalizeTierItem(raw);
      if (!item) continue;
      if (usedIds.has(item.schoolId)) continue;
      const school = schoolById.get(item.schoolId);
      if (!school) continue;

      const inPool = poolMaps[tier].has(item.schoolId);
      if (!inPool) {
        if (outOfPoolCount >= MAX_OUT_OF_POOL_PER_TIER) continue;
        if (!schoolInRange(school, extraRange)) continue;
        outOfPoolCount += 1;
      }

      usedIds.add(item.schoolId);
      const reason = item.reason?.zh || item.reason?.en
        ? item.reason
        : defaultReason(tier, school);
      resolved[tier].push({ schoolId: item.schoolId, reason });
    }

    resolved[tier] = resolved[tier].filter((item) => schoolById.has(item.schoolId));
    fillTierToMinimum(resolved, tier, usedIds, {
      regionCatalog,
      fullCatalog,
      poolBundle,
      anchorRank
    });
  }

  const allUsedIds = () =>
    new Set(TIER_KEYS.flatMap((k) => resolved[k].map((x) => x.schoolId)));

  for (const tier of TIER_KEYS) {
    if (resolved[tier].length < MIN_PER_TIER) {
      fillTierToMinimum(resolved, tier, allUsedIds(), {
        regionCatalog,
        fullCatalog,
        poolBundle,
        anchorRank
      });
    }
  }

  const enriched = {};
  for (const tier of TIER_KEYS) {
    enriched[tier] = resolved[tier]
      .filter((item) => schoolById.has(item.schoolId))
      .map((item) => ({
        ...item,
        school: schoolById.get(item.schoolId)
      }));
  }

  return enriched;
}

/** @deprecated 使用 reviewAndFinalizeSchoolTiers；保留纯分数兜底入口 */
export function resolveSchoolTiers(_rawTiers, catalog, profile, totalScore) {
  const poolBundle = buildTierCandidatePools(catalog, totalScore, profile);
  return finalizeSchoolTiersFromLlm(null, poolBundle, catalog, profile, totalScore);
}

export function catalogForPrompt(catalog = []) {
  return filterAbroadSchoolCatalog(catalog).map(toPoolEntry);
}
