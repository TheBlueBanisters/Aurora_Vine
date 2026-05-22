import { t } from './i18n.js'

const CASE_TAG_I18N_KEYS = {
  高GPA: 'caseTag.highGpa',
  稳健GPA: 'caseTag.stableGpa',
  低GPA冲刺: 'caseTag.lowGpaReach',
  排名前列: 'caseTag.topRank',
  排名靠后: 'caseTag.lowerRank',
  语言强: 'caseTag.strongLanguage',
  语言达标: 'caseTag.qualifiedLanguage',
  语言待补强: 'caseTag.languagePending',
  GRE高分: 'caseTag.highGre',
  GRE达标: 'caseTag.qualifiedGre',
  科研强: 'caseTag.strongResearch',
  实习丰富: 'caseTag.richInternship',
  论文加成: 'caseTag.paperBonus',
  985: 'caseTier.985',
  211: 'caseTier.211',
  海本: 'caseTier.overseas',
  中外合作: 'caseTier.joint',
  双非: 'caseTier.non211',
  其他: 'caseTier.other'
}

const OFFER_TIER_I18N_KEYS = {
  冲刺: 'caseOfferTier.reach',
  匹配: 'caseOfferTier.match',
  保底: 'caseOfferTier.safety'
}

export function translateCaseTag(tag) {
  const text = String(tag || '').trim()
  if (!text) return ''
  const key = CASE_TAG_I18N_KEYS[text]
  return key ? t(key) : text
}

export function translateUndergradTier(tier) {
  return translateCaseTag(tier)
}

export function translateOfferTier(tier, fallback = t('caseDetail.offerTierMatch')) {
  const text = String(tier || '').trim()
  if (!text) return fallback
  const key = OFFER_TIER_I18N_KEYS[text]
  return key ? t(key) : text
}
