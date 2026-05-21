import { clearSchoolPlanningProfile } from './storage.js'
import {
  exitSchoolPlanningEditMode,
  syncSchoolPlanningIdentityState,
  loadMyProfile
} from './profile.js'
import { resetSchoolPlanningForm } from './planning.js'
import { renderStudyPlanningPage } from './study-planning.js'
import { initDailyCheckinPage } from './daily-checkin.js'

export async function clearAllPersonalData() {
  clearSchoolPlanningProfile()

  if (!window.api?.resumeClearAll) {
    return { success: false, error: '无法清除历史简历：应用接口不可用' }
  }

  const tasks = [
    window.api.resumeClearAll(),
    window.api.studyPlanClearAll?.(),
    window.api.dailyCheckinClearAll?.()
  ].filter(Boolean)

  const results = await Promise.all(tasks)
  const resumeResult = results[0]
  if (!resumeResult?.success) {
    return { success: false, error: resumeResult?.error || '清除历史简历失败' }
  }

  const failed = results.find((res) => res && res.success === false)
  if (failed) {
    return { success: false, error: failed.error }
  }

  exitSchoolPlanningEditMode()
  resetSchoolPlanningForm()
  syncSchoolPlanningIdentityState()
  loadMyProfile()
  await renderStudyPlanningPage()

  const activePage = document.querySelector('.page.active')
  if (activePage?.id === 'page-daily-checkin') {
    initDailyCheckinPage()
  }

  return { success: true }
}
