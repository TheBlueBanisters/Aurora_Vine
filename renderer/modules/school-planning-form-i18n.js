import { t } from './i18n.js'
import { isAccountMode, isGuestMode } from './state.js'
import { populateInstitutionTierSelect } from './institution-tier.js'
import { refreshSelect, refreshSelectsIn, getSelectValues, setSelectValues } from './custom-select.js'
import { syncSchoolPlanningResumePickerI18n } from './school-planning-resume-picker.js'

const REGION_OPTION_DEFS = [
  { value: 'us', labelKey: 'planning.region.us' },
  { value: 'uk', labelKey: 'planning.region.uk' },
  { value: 'eu', labelKey: 'planning.region.eu' },
  { value: 'sg_hk', labelKey: 'planning.region.sg_hk' },
  { value: 'ca', labelKey: 'planning.region.ca' },
  { value: 'au', labelKey: 'planning.region.au' },
  { value: 'other', labelKey: 'planning.region.other' }
]

export function populatePreferredRegionSelect(select) {
  if (!select) return
  const currentValues = getSelectValues(select)
  select.innerHTML = ''
  const none = document.createElement('option')
  none.value = ''
  none.textContent = t('planning.regionNone')
  select.appendChild(none)
  REGION_OPTION_DEFS.forEach(({ value, labelKey }) => {
    const opt = document.createElement('option')
    opt.value = value
    opt.textContent = t(labelKey)
    select.appendChild(opt)
  })
  const allowed = new Set(REGION_OPTION_DEFS.map((d) => d.value))
  setSelectValues(select, currentValues.filter((v) => allowed.has(v)))
}

function updateEmptyOptionLabel(select) {
  if (!select?.options?.length) return
  const value = select.value
  const first = select.options[0]
  if (first && first.value === '') {
    first.textContent = t('planning.select')
  }
  select.value = value
}

function repopulateScoreSelect(select, values) {
  if (!select) return
  const current = select.value
  select.innerHTML = `<option value="">${t('planning.select')}</option>`
  values.forEach((v) => {
    const opt = document.createElement('option')
    opt.value = String(v)
    opt.textContent = String(v)
    select.appendChild(opt)
  })
  if (current && Array.from(select.options).some((o) => o.value === current)) {
    select.value = current
  }
  refreshSelect(select)
}

const IELTS_OPTIONS = (() => {
  const a = []
  for (let i = 4; i <= 9; i += 0.5) a.push(i.toFixed(1))
  return a
})()

const GRE_WRITING_OPTIONS = (() => {
  const a = []
  for (let i = 0; i <= 6; i += 0.5) a.push(i.toFixed(1))
  return a
})()

/** 同步定校规划表单在语言/登录态变化后的文案（提交按钮、旁注、下拉占位等） */
export function syncSchoolPlanningFormI18n() {
  const form = document.getElementById('school-planning-form')
  if (!form) return

  const submitBtn = document.getElementById('school-planning-submit')
  if (submitBtn) submitBtn.textContent = t('planning.submitBtn')

  const hint = document.getElementById('school-planning-submit-hint')
  if (hint) {
    if (isAccountMode()) {
      hint.textContent = ''
      hint.hidden = true
    } else if (isGuestMode()) {
      hint.textContent = t('state.guestMeta')
      hint.hidden = false
    } else {
      hint.textContent = t('state.loginMeta')
      hint.hidden = false
    }
  }

  const institutionTierSelect = document.getElementById('sp-institution-tier')
  const preferredRegionSelect = document.getElementById('sp-preferred-region')
  const savedTier = institutionTierSelect?.value || ''
  const savedRegions = preferredRegionSelect ? getSelectValues(preferredRegionSelect) : []
  populateInstitutionTierSelect(institutionTierSelect)
  populatePreferredRegionSelect(preferredRegionSelect)
  if (institutionTierSelect) institutionTierSelect.value = savedTier
  if (preferredRegionSelect) setSelectValues(preferredRegionSelect, savedRegions)

  updateEmptyOptionLabel(document.getElementById('sp-graduation-year'))
  repopulateScoreSelect(document.getElementById('sp-ielts'), IELTS_OPTIONS)
  repopulateScoreSelect(document.getElementById('sp-toefl'), Array.from({ length: 51 }, (_, i) => 70 + i))
  repopulateScoreSelect(document.getElementById('sp-gre'), Array.from({ length: 41 }, (_, i) => 300 + i))
  repopulateScoreSelect(document.getElementById('sp-gre-writing'), GRE_WRITING_OPTIONS)

  refreshSelectsIn(form)
  syncSchoolPlanningResumePickerI18n()
}
