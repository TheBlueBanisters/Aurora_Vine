/** 与 renderer 表单字段 studyPreferences 对齐 */

export const REGION_OPTION_IDS = ['us', 'uk', 'eu', 'sg_hk', 'ca', 'au', 'other'];

const REGION_MATCHERS = {
  us: (s) => matchCountry(s, ['美国', 'USA', 'United States', 'U.S.']),
  uk: (s) => matchCountry(s, ['英国', 'UK', 'United Kingdom']),
  eu: (s) => matchCountry(s, [
    '法国', '德国', '荷兰', '瑞士', '瑞典', '丹麦', '芬兰', '挪威', '比利时', '爱尔兰',
    '西班牙', '意大利', '奥地利', '葡萄牙', '捷克', '波兰', '匈牙利',
    'France', 'Germany', 'Netherlands', 'Switzerland', 'Sweden', 'Denmark', 'Finland',
    'Norway', 'Belgium', 'Ireland', 'Spain', 'Italy', 'Austria'
  ]),
  sg_hk: (s) => matchCountry(s, ['新加坡', '中国香港', '中国澳门', 'Singapore', 'Hong Kong', 'Macau']),
  ca: (s) => matchCountry(s, ['加拿大', 'Canada']),
  au: (s) => matchCountry(s, ['澳大利亚', '澳洲', 'Australia', 'New Zealand', '新西兰']),
  other: (s) => {
    const named = ['us', 'uk', 'eu', 'sg_hk', 'ca', 'au'];
    return !named.some((r) => REGION_MATCHERS[r](s));
  }
};

function matchCountry(school, tokens) {
  const blob = `${school?.country_zh || ''} ${school?.country_en || ''}`.toLowerCase();
  return tokens.some((t) => blob.includes(String(t).toLowerCase()));
}

export function normalizePreferredRegions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((id) => String(id || '').trim())
    .filter((id) => REGION_OPTION_IDS.includes(id));
}

export function buildStudyPreferencesBlock(profile = {}) {
  const regions = normalizePreferredRegions(profile.preferredRegions);
  const regionLabels = regions.map((id) => {
    const labels = {
      us: { zh: '美国', en: 'United States' },
      uk: { zh: '英国', en: 'United Kingdom' },
      eu: { zh: '欧洲大陆', en: 'Europe (continental)' },
      sg_hk: { zh: '新加坡/港澳', en: 'Singapore / Hong Kong / Macau' },
      ca: { zh: '加拿大', en: 'Canada' },
      au: { zh: '澳洲/新西兰', en: 'Australia / New Zealand' },
      other: { zh: '其他地区', en: 'Other regions' }
    };
    return labels[id] || { zh: id, en: id };
  });

  const studyGoal = String(profile.studyGoal || '').trim();
  const preferencesExtra = String(profile.preferencesExtra || '').trim()
    || [profile.preferredSchools, profile.constraintsNotes]
      .map((s) => String(s || '').trim())
      .filter(Boolean)
      .join('\n');

  const zhParts = [];
  const enParts = [];
  if (regionLabels.length) {
    zhParts.push(`意向地区：${regionLabels.map((l) => l.zh).join('、')}`);
    enParts.push(`Preferred regions: ${regionLabels.map((l) => l.en).join(', ')}`);
  }
  if (studyGoal) {
    zhParts.push(`留学目标：${studyGoal}`);
    enParts.push(`Study goal: ${studyGoal}`);
  }
  if (preferencesExtra) {
    zhParts.push(`心仪院校与其他说明：${preferencesExtra}`);
    enParts.push(`Dream schools & notes: ${preferencesExtra}`);
  }

  return {
    studyGoal: studyGoal || null,
    preferencesExtra: preferencesExtra || null,
    preferredRegions: regions,
    regionLabels,
    display: {
      zh: zhParts.length ? zhParts.join('；') : '未填写留学意向',
      en: enParts.length ? enParts.join('; ') : 'Study preferences not provided'
    }
  };
}

export function filterCatalogByRegions(catalog = [], preferredRegions = []) {
  const regions = normalizePreferredRegions(preferredRegions);
  if (regions.length === 0) return catalog;

  return catalog.filter((school) =>
    regions.some((id) => {
      const fn = REGION_MATCHERS[id];
      return typeof fn === 'function' && fn(school);
    })
  );
}
