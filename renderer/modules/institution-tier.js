import { t } from './i18n.js'

export const TIER_OPTION_DEFS = [
  { value: '985', labelKey: 'planning.tier.985' },
  { value: '211', labelKey: 'planning.tier.211' },
  { value: '双非', labelKey: 'planning.tier.nonTop' },
  { value: '海外本科', labelKey: 'planning.tier.overseasUg' }
]

const TIER_LABEL_KEYS = {
  '985': 'planning.tier.985',
  '211': 'planning.tier.211',
  '双非': 'planning.tier.nonTop',
  '海外本科': 'planning.tier.overseasUg',
  '双一流': 'planning.tier.nonTop'
}

export function institutionTierLabel(tier) {
  const key = TIER_LABEL_KEYS[String(tier || '').trim()]
  return key ? t(key) : (tier || '-')
}

export function populateInstitutionTierSelect(select) {
  if (!select) return
  const current = select.value
  select.innerHTML = ''
  const placeholder = document.createElement('option')
  placeholder.value = ''
  placeholder.textContent = t('planning.select')
  select.appendChild(placeholder)
  TIER_OPTION_DEFS.forEach(({ value, labelKey }) => {
    const opt = document.createElement('option')
    opt.value = value
    opt.textContent = t(labelKey)
    select.appendChild(opt)
  })
  if (current && Array.from(select.options).some((o) => o.value === current)) {
    select.value = current
  }
}
