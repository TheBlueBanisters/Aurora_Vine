import { showToast } from './utils.js'
import { t } from './i18n.js'
import { getSchoolPlanningProfile, setSchoolPlanningProfile } from './storage.js'
import { setSchoolPlanningView, syncSchoolPlanningIdentityState, renderScoreResult } from './profile.js'
import { computeStudentScore, profileToScoreInput } from './scoring.js'

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

  function syncIeltsNone() { if (ieltsSelect) { ieltsSelect.disabled = !!ieltsNone?.checked; if (ieltsNone?.checked) ieltsSelect.value = '' } }
  function syncToeflNone() { if (toeflSelect) { toeflSelect.disabled = !!toeflNone?.checked; if (toeflNone?.checked) toeflSelect.value = '' } }
  function syncGreNone() {
    const checked = greNone?.checked
    if (greSelect) { greSelect.disabled = !!checked; if (checked) greSelect.value = '' }
    if (greWritingSelect) { greWritingSelect.disabled = !!checked; if (checked) greWritingSelect.value = '' }
  }

  ieltsNone?.addEventListener('change', syncIeltsNone)
  toeflNone?.addEventListener('change', syncToeflNone)
  greNone?.addEventListener('change', syncGreNone)

  function syncGpaRangeByScale() {
    if (!gpaInput) return
    const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value
    gpaInput.min = '0'
    if (gpaScale === '4') gpaInput.max = '4'; else gpaInput.max = '5'
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
    const pct = parseFloat(gpaPercentile)
    if (!gpaPercentile || isNaN(pct) || pct < 0 || pct > 100) { setFieldError('gpaPercentile', t('planning.err.gpaPercentile')); errors.push('gpaPercentile') }

    if (!ieltsNone?.checked && (!ieltsSelect?.value || ieltsSelect.disabled)) { setFieldError('ielts', t('planning.err.ielts')); errors.push('ielts') }
    if (!toeflNone?.checked && (!toeflSelect?.value || toeflSelect.disabled)) { setFieldError('toefl', t('planning.err.toefl')); errors.push('toefl') }
    if (!greNone?.checked) {
      if (!greSelect?.value || greSelect.disabled) { setFieldError('gre', t('planning.err.gre')); errors.push('gre') }
      else if (!greWritingSelect?.value || greWritingSelect.disabled) { setFieldError('gre', t('planning.err.greWriting')); if (!errors.includes('gre')) errors.push('gre') }
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
      gpaPercentile: document.getElementById('sp-gpa-percentile')?.value?.trim() || '',
      ielts: ieltsNone?.checked ? null : (ieltsSelect?.value || null),
      toefl: toeflNone?.checked ? null : (toeflSelect?.value || null),
      gre: greNone?.checked ? null : (greSelect?.value || null),
      greWriting: greNone?.checked ? null : (greWritingSelect?.value || null),
      researchCount: parseInt(researchCountSelect?.value || '0', 10),
      internshipCount: parseInt(internshipCountSelect?.value || '0', 10),
      paperCount: parseInt(paperCountSelect?.value || '0', 10),
      resumeFile: document.getElementById('sp-resume')?.files?.[0]?.name || null,
    }
  }

  submitBtn.addEventListener('click', () => {
    const { valid } = validateSchoolPlanningForm()
    if (valid) {
      const profile = collectSchoolPlanningData()
      setSchoolPlanningProfile(profile)
      const scoreInput = profileToScoreInput(profile)
      const result = computeStudentScore(scoreInput)
      setSchoolPlanningView(true)
      renderScoreResult(result)
    }
  })

  document.getElementById('school-planning-refill')?.addEventListener('click', () => setSchoolPlanningView(false))

  syncSchoolPlanningIdentityState()
}
