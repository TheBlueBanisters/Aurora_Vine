import { t } from './i18n.js'
import { showAppConfirm } from './confirm-dialog.js'
import { getSchoolPlanningProfile } from './storage.js'
import { isSchoolPlanningEditing, exitSchoolPlanningEditMode } from './profile.js'
import { resetSchoolPlanningForm } from './planning.js'

export function isSchoolPlanningFormDirty() {
  const form = document.getElementById('school-planning-form')
  if (!form) return false

  const hasText = (id) => !!document.getElementById(id)?.value?.trim()
  if (['sp-school-name', 'sp-major', 'sp-gpa', 'sp-gpa-percentile', 'sp-study-goal', 'sp-preferences-extra'].some(hasText)) {
    return true
  }
  if (document.getElementById('sp-graduation-year')?.value) return true
  if (document.getElementById('sp-institution-tier')?.value) return true
  if (document.querySelector('input[name="sp-gpa-scale"]:checked')) return true
  if (document.getElementById('sp-ielts-none')?.checked) return true
  if (document.getElementById('sp-toefl-none')?.checked) return true
  if (document.getElementById('sp-gre-none')?.checked) return true
  if (document.getElementById('sp-ielts')?.value) return true
  if (document.getElementById('sp-toefl')?.value) return true
  if (document.getElementById('sp-gre')?.value) return true
  if (document.getElementById('sp-gre-writing')?.value) return true
  if (document.getElementById('sp-preferred-region')?.value) return true
  if (document.getElementById('sp-resume')?.files?.length) return true

  const countIds = ['sp-research-count', 'sp-internship-count', 'sp-paper-count']
  if (countIds.some((id) => parseInt(document.getElementById(id)?.value || '0', 10) > 0)) return true

  return false
}

export function discardSchoolPlanningRefill() {
  exitSchoolPlanningEditMode()
  resetSchoolPlanningForm()
}

function isLeavingSchoolPlanningPage(nextPageId) {
  const activePage = document.querySelector('.page.active')
  return activePage?.id === 'page-school-planning' && nextPageId !== 'school-planning'
}

export async function canLeaveSchoolPlanningPage(nextPageId) {
  if (!isLeavingSchoolPlanningPage(nextPageId)) return true
  if (!isSchoolPlanningEditing()) return true
  if (!getSchoolPlanningProfile()) return true

  if (!isSchoolPlanningFormDirty()) {
    discardSchoolPlanningRefill()
    return true
  }

  const confirmed = await showAppConfirm({
    title: t('planning.leaveRefillTitle'),
    description: t('planning.leaveRefillDesc'),
    cancelText: t('planning.leaveRefillStay'),
    confirmText: t('planning.leaveRefillConfirm'),
    danger: true
  })

  if (!confirmed) return false
  discardSchoolPlanningRefill()
  return true
}
