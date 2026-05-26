import { t, registerLangChangeHook } from './i18n.js'
import { normalizeGpaTopPercent } from './gpa-percent.js'
import {
  setSchoolPlanningView,
  syncSchoolPlanningIdentityState,
  enterSchoolPlanningEditMode,
  exitSchoolPlanningEditMode
} from './profile.js'
import { executeSchoolPlanningSubmit } from './llm-planning-service.js'
import { getSchoolPlanningProfile } from './storage.js'
import { enhanceSelectsIn, refreshSelect, refreshSelectsIn, getSelectValues, setSelectValues } from './custom-select.js'
import { populateInstitutionTierSelect } from './institution-tier.js'
import {
  populatePreferredRegionSelect,
  syncSchoolPlanningFormI18n
} from './school-planning-form-i18n.js'
import {
  initSchoolPlanningResumePicker,
  clearSchoolPlanningResumePicker
} from './school-planning-resume-picker.js'

const REFILL_EVENT = 'aurora:school-planning-refill'

function mergeLegacyPreferencesExtra(profile = {}) {
  if (profile.preferencesExtra) return profile.preferencesExtra
  return [profile.preferredSchools, profile.constraintsNotes]
    .map((s) => String(s || '').trim())
    .filter(Boolean)
    .join('\n')
}

const REGION_OPTION_DEFS = [
  { value: 'us', labelKey: 'planning.region.us' },
  { value: 'uk', labelKey: 'planning.region.uk' },
  { value: 'eu', labelKey: 'planning.region.eu' },
  { value: 'sg_hk', labelKey: 'planning.region.sg_hk' },
  { value: 'ca', labelKey: 'planning.region.ca' },
  { value: 'au', labelKey: 'planning.region.au' },
  { value: 'other', labelKey: 'planning.region.other' }
]

function collectPreferredRegions() {
  const select = document.getElementById('sp-preferred-region')
  if (!select) return []
  const values = getSelectValues(select)
  const allowed = new Set(REGION_OPTION_DEFS.map((d) => d.value))
  return values.filter((v) => allowed.has(v))
}

function setPreferredRegions(regions = []) {
  const select = document.getElementById('sp-preferred-region')
  if (!select) return
  const list = Array.isArray(regions) ? regions : []
  const allowed = new Set(REGION_OPTION_DEFS.map((d) => d.value))
  setSelectValues(select, list.filter((id) => allowed.has(id)))
  refreshSelect(select)
}

export function populateSchoolPlanningForm(profile) {
  if (!profile) return

  const setValue = (id, value) => {
    const el = document.getElementById(id)
    if (el) el.value = value ?? ''
  }

  setValue('sp-graduation-year', profile.graduationYear)
  setValue('sp-institution-tier', profile.institutionTier)
  setValue('sp-school-name', profile.schoolName)
  setValue('sp-major', profile.major)
  setValue('sp-gpa', profile.gpa)
  const topPct = normalizeGpaTopPercent(profile.gpaPercentile)
  setValue('sp-gpa-percentile', topPct !== undefined ? String(topPct) : profile.gpaPercentile)

  const scaleRadio = document.querySelector(`input[name="sp-gpa-scale"][value="${profile.gpaScale}"]`)
  if (scaleRadio) scaleRadio.checked = true

  const ieltsNone = document.getElementById('sp-ielts-none')
  const toeflNone = document.getElementById('sp-toefl-none')
  const greNone = document.getElementById('sp-gre-none')
  if (ieltsNone) ieltsNone.checked = profile.ielts == null
  if (toeflNone) toeflNone.checked = profile.toefl == null
  if (greNone) greNone.checked = profile.gre == null

  if (profile.ielts != null) setValue('sp-ielts', profile.ielts)
  if (profile.toefl != null) setValue('sp-toefl', profile.toefl)
  if (profile.gre != null) setValue('sp-gre', profile.gre)
  if (profile.greWriting != null) setValue('sp-gre-writing', profile.greWriting)

  setValue('sp-research-count', String(profile.researchCount ?? 0))
  setValue('sp-internship-count', String(profile.internshipCount ?? 0))
  setValue('sp-paper-count', String(profile.paperCount ?? 0))
  setValue('sp-study-goal', profile.studyGoal)
  setValue('sp-preferences-extra', profile.preferencesExtra || mergeLegacyPreferencesExtra(profile))
  setPreferredRegions(profile.preferredRegions)
  refreshSelect(document.getElementById('sp-preferred-region'))

  clearSchoolPlanningResumePicker()

  document.dispatchEvent(new CustomEvent('aurora:school-planning-form-populated'))
}

export function resetSchoolPlanningForm() {
  const form = document.getElementById('school-planning-form')
  if (!form) return

  form.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach((input) => {
    input.value = ''
    input.disabled = false
  })
  setPreferredRegions([])
  form.querySelectorAll('select').forEach((select) => {
    const isCountSelect = ['sp-research-count', 'sp-internship-count', 'sp-paper-count'].includes(select.id)
    select.value = isCountSelect ? '0' : ''
    select.disabled = false
    delete select.dataset.noneLocked
  })
  form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false
  })
  form.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.checked = false
  })
  clearSchoolPlanningResumePicker()
  form.querySelectorAll('.form-field').forEach((field) => {
    field.classList.remove('error')
    const err = field.querySelector('.form-error')
    if (err) err.textContent = ''
  })

  refreshSelectsIn(form)
  document.dispatchEvent(new CustomEvent('aurora:school-planning-form-populated'))
}

export function beginSchoolPlanningRefill() {
  enterSchoolPlanningEditMode()
  resetSchoolPlanningForm()
  const mainContent = document.querySelector('.main-content')
  if (mainContent) mainContent.scrollTop = 0
}

function handleSchoolPlanningRefillClick() {
  beginSchoolPlanningRefill()
}

export function initSchoolPlanningForm() {
  const form = document.getElementById('school-planning-form')
  const thanksView = document.getElementById('school-planning-thanks')
  const submitBtn = document.getElementById('school-planning-submit')
  if (!form || !thanksView || !submitBtn) return

  const ieltsSelect = document.getElementById('sp-ielts')
  const toeflSelect = document.getElementById('sp-toefl')
  const greSelect = document.getElementById('sp-gre')
  const greWritingSelect = document.getElementById('sp-gre-writing')
  const gpaInput = document.getElementById('sp-gpa')
  const ieltsNone = document.getElementById('sp-ielts-none')
  const toeflNone = document.getElementById('sp-toefl-none')
  const greNone = document.getElementById('sp-gre-none')
  const researchCountSelect = document.getElementById('sp-research-count')
  const internshipCountSelect = document.getElementById('sp-internship-count')
  const paperCountSelect = document.getElementById('sp-paper-count')
  const preferredRegionSelect = document.getElementById('sp-preferred-region')
  const institutionTierSelect = document.getElementById('sp-institution-tier')

  function populateSelect(select, options, placeholder) {
    if (!select) return
    select.innerHTML = `<option value="">${placeholder || t('planning.select')}</option>`
    options.forEach((v) => { const opt = document.createElement('option'); opt.value = String(v); opt.textContent = String(v); select.appendChild(opt) })
  }

  populateSelect(ieltsSelect, (() => { const a = []; for (let i = 4; i <= 9; i += 0.5) a.push(i.toFixed(1)); return a })(), t('planning.select'))
  populateSelect(toeflSelect, Array.from({ length: 51 }, (_, i) => 70 + i), t('planning.select'))
  populateSelect(greSelect, Array.from({ length: 41 }, (_, i) => 300 + i), t('planning.select'))
  populateSelect(greWritingSelect, (() => { const a = []; for (let i = 0; i <= 6; i += 0.5) a.push(i.toFixed(1)); return a })(), t('planning.select'))

  function populateCountSelect(select) {
    if (!select) return
    select.innerHTML = ''
    for (let i = 0; i <= 10; i++) {
      const opt = document.createElement('option')
      opt.value = String(i)
      opt.textContent = String(i)
      select.appendChild(opt)
    }
  }
  populateCountSelect(researchCountSelect)
  populateCountSelect(internshipCountSelect)
  populateCountSelect(paperCountSelect)
  populateInstitutionTierSelect(institutionTierSelect)
  populatePreferredRegionSelect(preferredRegionSelect)

  function syncIeltsNone() {
    if (!ieltsSelect) return
    const checked = !!ieltsNone?.checked
    if (checked) {
      ieltsSelect.value = ''
      ieltsSelect.dataset.noneLocked = 'true'
    } else {
      delete ieltsSelect.dataset.noneLocked
    }
    ieltsSelect.disabled = false
    refreshSelect(ieltsSelect)
  }
  function syncToeflNone() {
    if (!toeflSelect) return
    const checked = !!toeflNone?.checked
    if (checked) {
      toeflSelect.value = ''
      toeflSelect.dataset.noneLocked = 'true'
    } else {
      delete toeflSelect.dataset.noneLocked
    }
    toeflSelect.disabled = false
    refreshSelect(toeflSelect)
  }
  function syncGreNone() {
    const checked = !!greNone?.checked
    ;[greSelect, greWritingSelect].forEach((select) => {
      if (!select) return
      if (checked) {
        select.value = ''
        select.dataset.noneLocked = 'true'
      } else {
        delete select.dataset.noneLocked
      }
      select.disabled = false
      refreshSelect(select)
    })
  }

  function bindNoneUnlock(select, noneCheckbox, syncFn) {
    select?.addEventListener('aurora:select-none-unlock', () => {
      if (!noneCheckbox?.checked) return
      noneCheckbox.checked = false
      syncFn()
    })
  }

  bindNoneUnlock(ieltsSelect, ieltsNone, syncIeltsNone)
  bindNoneUnlock(toeflSelect, toeflNone, syncToeflNone)
  bindNoneUnlock(greSelect, greNone, syncGreNone)
  bindNoneUnlock(greWritingSelect, greNone, syncGreNone)

  ieltsNone?.addEventListener('change', syncIeltsNone)
  toeflNone?.addEventListener('change', syncToeflNone)
  greNone?.addEventListener('change', syncGreNone)
  document.addEventListener('aurora:school-planning-form-populated', () => {
    syncIeltsNone()
    syncToeflNone()
    syncGreNone()
    syncGpaRangeByScale()
    const savedRegions = preferredRegionSelect ? getSelectValues(preferredRegionSelect) : []
    const savedTier = institutionTierSelect?.value || ''
    populateInstitutionTierSelect(institutionTierSelect)
    populatePreferredRegionSelect(preferredRegionSelect)
    if (institutionTierSelect) institutionTierSelect.value = savedTier
    if (preferredRegionSelect) setSelectValues(preferredRegionSelect, savedRegions)
    refreshSelectsIn(form)
  })

  registerLangChangeHook(() => syncSchoolPlanningFormI18n())
  document.addEventListener('aurora:sync-school-planning-form-i18n', () => syncSchoolPlanningFormI18n())

  const gpaConversionHintEl = document.getElementById('sp-gpa-conversion-hint')

  function syncGpaRangeByScale() {
    if (!gpaInput) return
    const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value
    gpaInput.min = '0'
    if (gpaScale === '4') gpaInput.max = '4'; else gpaInput.max = '5'
    if (gpaConversionHintEl) {
      const key = gpaScale === '4' ? 'planning.gpaConversionHint4' : 'planning.gpaConversionHint5'
      gpaConversionHintEl.dataset.i18n = key
      gpaConversionHintEl.textContent = t(key)
    }
  }
  form.querySelectorAll('input[name="sp-gpa-scale"]').forEach((radio) => radio.addEventListener('change', syncGpaRangeByScale))
  syncGpaRangeByScale()

  function clearFieldErrors() {
    form.querySelectorAll('.form-field').forEach((f) => { f.classList.remove('error'); const err = f.querySelector('.form-error'); if (err) err.textContent = '' })
  }

  function setFieldError(fieldName, msg) {
    const field = form.querySelector(`[data-field="${fieldName}"]`)
    if (field) { field.classList.add('error'); const err = field.querySelector('.form-error'); if (err) err.textContent = msg }
  }

  function validateSchoolPlanningForm() {
    clearFieldErrors()
    const errors = []
    const graduationYear = document.getElementById('sp-graduation-year')?.value?.trim()
    const institutionTier = document.getElementById('sp-institution-tier')?.value?.trim()
    const schoolName = document.getElementById('sp-school-name')?.value?.trim()
    const major = document.getElementById('sp-major')?.value?.trim()
    const gpa = document.getElementById('sp-gpa')?.value?.trim()
    const gpaValue = parseFloat(gpa)
    const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value
    const gpaPercentile = document.getElementById('sp-gpa-percentile')?.value?.trim()

    if (!graduationYear) { setFieldError('graduationYear', t('planning.err.gradYear')); errors.push('graduationYear') }
    if (!institutionTier) { setFieldError('institutionTier', t('planning.err.tier')); errors.push('institutionTier') }
    if (!schoolName) { setFieldError('schoolName', t('planning.err.schoolName')); errors.push('schoolName') }
    if (!major) { setFieldError('major', t('planning.err.major')); errors.push('major') }
    if (!gpa || isNaN(gpaValue)) { setFieldError('gpa', t('planning.err.gpa')); errors.push('gpa') }
    else if (gpaScale === '4' && (gpaValue < 0 || gpaValue > 4)) { setFieldError('gpa', t('planning.err.gpa4Range')); errors.push('gpa') }
    else if (gpaScale === '5' && (gpaValue < 0 || gpaValue > 5)) { setFieldError('gpa', t('planning.err.gpa5Range')); errors.push('gpa') }
    if (!gpaScale) { setFieldError('gpa', t('planning.err.gpaScale')); if (!errors.includes('gpa')) errors.push('gpa') }
    const topPct = normalizeGpaTopPercent(gpaPercentile)
    if (topPct === undefined) { setFieldError('gpaPercentile', t('planning.err.gpaPercentile')); errors.push('gpaPercentile') }

    if (!ieltsNone?.checked && !ieltsSelect?.value) { setFieldError('ielts', t('planning.err.ielts')); errors.push('ielts') }
    if (!toeflNone?.checked && !toeflSelect?.value) { setFieldError('toefl', t('planning.err.toefl')); errors.push('toefl') }
    if (!greNone?.checked) {
      if (!greSelect?.value) { setFieldError('gre', t('planning.err.gre')); errors.push('gre') }
      else if (!greWritingSelect?.value) { setFieldError('gre', t('planning.err.greWriting')); if (!errors.includes('gre')) errors.push('gre') }
    }

    return { valid: errors.length === 0, errors }
  }

  function collectSchoolPlanningData() {
    const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value
    return {
      graduationYear: document.getElementById('sp-graduation-year')?.value?.trim() || '',
      institutionTier: document.getElementById('sp-institution-tier')?.value?.trim() || '',
      schoolName: document.getElementById('sp-school-name')?.value?.trim() || '',
      major: document.getElementById('sp-major')?.value?.trim() || '',
      gpa: document.getElementById('sp-gpa')?.value?.trim() || '',
      gpaScale: gpaScale || '',
      gpaPercentile: (() => {
        const raw = document.getElementById('sp-gpa-percentile')?.value?.trim() || ''
        const top = normalizeGpaTopPercent(raw)
        return top !== undefined ? String(top) : ''
      })(),
      ielts: ieltsNone?.checked ? null : (ieltsSelect?.value || null),
      toefl: toeflNone?.checked ? null : (toeflSelect?.value || null),
      gre: greNone?.checked ? null : (greSelect?.value || null),
      greWriting: greNone?.checked ? null : (greWritingSelect?.value || null),
      researchCount: parseInt(researchCountSelect?.value || '0', 10),
      internshipCount: parseInt(internshipCountSelect?.value || '0', 10),
      paperCount: parseInt(paperCountSelect?.value || '0', 10),
      studyGoal: document.getElementById('sp-study-goal')?.value?.trim() || '',
      preferredRegions: collectPreferredRegions(),
      preferencesExtra: document.getElementById('sp-preferences-extra')?.value?.trim() || '',
      resumeFile: document.getElementById('sp-resume')?.files?.[0]?.name || null,
    }
  }

  submitBtn.addEventListener('click', async () => {
    const { valid } = validateSchoolPlanningForm()
    if (!valid) return

    const profile = collectSchoolPlanningData()
    const resumeInput = document.getElementById('sp-resume')
    const resumeFile = resumeInput?.files?.[0] || null

    try {
      await executeSchoolPlanningSubmit(profile, resumeFile)
      exitSchoolPlanningEditMode()
      setSchoolPlanningView(true)
    } catch {
      /* toast already shown */
    }
  })

  document.getElementById('school-planning-refill')?.addEventListener('click', handleSchoolPlanningRefillClick)
  document.addEventListener(REFILL_EVENT, handleSchoolPlanningRefillClick)

  enhanceSelectsIn(form)
  initSchoolPlanningResumePicker()
  syncSchoolPlanningFormI18n()
  syncSchoolPlanningIdentityState()
}
