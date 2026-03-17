import { showToast } from './utils.js'
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
    select.innerHTML = `<option value="">${placeholder || '请选择 Select'}</option>`
    options.forEach((v) => { const opt = document.createElement('option'); opt.value = String(v); opt.textContent = String(v); select.appendChild(opt) })
  }

  populateSelect(ieltsSelect, (() => { const a = []; for (let i = 4; i <= 9; i += 0.5) a.push(i.toFixed(1)); return a })(), '请选择 Select')
  populateSelect(toeflSelect, Array.from({ length: 51 }, (_, i) => 70 + i), '请选择 Select')
  populateSelect(greSelect, Array.from({ length: 41 }, (_, i) => 300 + i), '请选择 Select')
  populateSelect(greWritingSelect, (() => { const a = []; for (let i = 0; i <= 6; i += 0.5) a.push(i.toFixed(1)); return a })(), '请选择 Select')

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

    if (!graduationYear) { setFieldError('graduationYear', '请选择本科毕业年份 / Please select graduation year'); errors.push('graduationYear') }
    if (!institutionTier) { setFieldError('institutionTier', '请选择本科院校层次 / Please select institution tier'); errors.push('institutionTier') }
    if (!schoolName) { setFieldError('schoolName', '请输入本科学校名称 / Please enter school name'); errors.push('schoolName') }
    if (!major) { setFieldError('major', '请输入本科专业 / Please enter major'); errors.push('major') }
    if (!gpa || isNaN(gpaValue)) { setFieldError('gpa', '请输入有效绩点 / Please enter valid GPA'); errors.push('gpa') }
    else if (gpaScale === '4' && (gpaValue < 0 || gpaValue > 4)) { setFieldError('gpa', '四分制绩点需在0-4之间 / GPA must be between 0-4 for 4.0 scale'); errors.push('gpa') }
    else if (gpaScale === '5' && (gpaValue < 0 || gpaValue > 5)) { setFieldError('gpa', '五分制绩点需在0-5之间 / GPA must be between 0-5 for 5.0 scale'); errors.push('gpa') }
    if (!gpaScale) { setFieldError('gpa', '请选择绩点分制 / Please select GPA scale'); if (!errors.includes('gpa')) errors.push('gpa') }
    const pct = parseFloat(gpaPercentile)
    if (!gpaPercentile || isNaN(pct) || pct < 0 || pct > 100) { setFieldError('gpaPercentile', '请输入0-100之间的数值 / Please enter a value between 0-100'); errors.push('gpaPercentile') }

    if (!ieltsNone?.checked && (!ieltsSelect?.value || ieltsSelect.disabled)) { setFieldError('ielts', '请选择雅思分数或勾选无 / Please select IELTS score or check None'); errors.push('ielts') }
    if (!toeflNone?.checked && (!toeflSelect?.value || toeflSelect.disabled)) { setFieldError('toefl', '请选择托福分数或勾选无 / Please select TOEFL score or check None'); errors.push('toefl') }
    if (!greNone?.checked) {
      if (!greSelect?.value || greSelect.disabled) { setFieldError('gre', '请选择GRE分数或勾选无 / Please select GRE score or check None'); errors.push('gre') }
      else if (!greWritingSelect?.value || greWritingSelect.disabled) { setFieldError('gre', '请选择GRE写作分数 / Please select GRE Writing score'); if (!errors.includes('gre')) errors.push('gre') }
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
