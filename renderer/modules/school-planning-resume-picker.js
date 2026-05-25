import { t } from './i18n.js'

let initialized = false

function getEls() {
  return {
    input: document.getElementById('sp-resume'),
    chooseBtn: document.getElementById('sp-resume-choose-btn'),
    nameEl: document.getElementById('sp-resume-filename')
  }
}

export function syncSchoolPlanningResumePickerI18n() {
  const { input, chooseBtn, nameEl } = getEls()
  if (chooseBtn) {
    chooseBtn.textContent = t('planning.chooseResumeFile')
    chooseBtn.setAttribute('aria-label', t('planning.chooseResumeFile'))
  }
  if (nameEl && input && !input.files?.length) {
    nameEl.textContent = t('planning.noResumeFile')
  }
}

function updateFilenameDisplay() {
  const { input, nameEl } = getEls()
  if (!nameEl || !input) return
  const file = input.files?.[0]
  nameEl.textContent = file?.name || t('planning.noResumeFile')
  nameEl.classList.toggle('is-empty', !file)
}

export function clearSchoolPlanningResumePicker() {
  const { input } = getEls()
  if (input) input.value = ''
  updateFilenameDisplay()
}

export function initSchoolPlanningResumePicker() {
  if (initialized) {
    syncSchoolPlanningResumePickerI18n()
    updateFilenameDisplay()
    return
  }

  const { input, chooseBtn } = getEls()
  if (!input || !chooseBtn) return

  chooseBtn.addEventListener('click', () => input.click())
  input.addEventListener('change', updateFilenameDisplay)

  initialized = true
  syncSchoolPlanningResumePickerI18n()
  updateFilenameDisplay()
}
