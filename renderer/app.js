import 'echarts-gl'
import { registerRefreshHook } from './modules/state.js'
import { initTheme } from './modules/theme.js'
import { initLang, registerLangChangeHook, applyLang } from './modules/i18n.js'
import { initAuthGate, initAuthState, closeAuthModal, setNavigateTo, setMaybeShowUsageGuide } from './modules/auth.js'
import { initSettingsPanel, updateSettingsAccountState } from './modules/settings.js'
import { initUsageGuide, startUsageGuide, maybeShowUsageGuideOnFirstEntry } from './modules/guide.js'
import { initSchools, loadSchoolListExplorer, loadSchoolListTarget, closeSchoolDetail, getOverlay, handleGlobalEscape } from './modules/schools.js'
import { loadMyProfile, syncSchoolPlanningIdentityState, initProfile } from './modules/profile.js'
import { initCommunityMessagesPage, updateCommunityComposerState, communityDetailPostId, loadCommunityDetail, closeCommunityReplySheet, closeCommunityDetailModal } from './modules/community.js'
import { initDailyCheckinPage } from './modules/daily-checkin.js'
import { initStudyPlanningPage } from './modules/study-planning.js'
import { initSchoolPlanningForm } from './modules/planning.js'
import { initApplicationCasesPage, initApplicationCaseModal, closeApplicationCaseModal } from './modules/application-cases.js'
import { showToast } from './modules/utils.js'
import { t } from './modules/i18n.js'
import { applyAuthState } from './modules/state.js'
import { openAuthModal, showLanding } from './modules/auth.js'

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item[data-page]')
  const pages = document.querySelectorAll('.page')

  function navigateTo(pageId) {
    pages.forEach(page => page.classList.remove('active'))
    navItems.forEach(item => item.classList.remove('active'))
    const targetPage = document.getElementById(`page-${pageId}`)
    const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`)
    if (targetPage) targetPage.classList.add('active')
    if (targetNav) targetNav.classList.add('active')
  }

  function refreshAuthBoundUI() {
    updateSettingsAccountState()
    updateCommunityComposerState()
    syncSchoolPlanningIdentityState()
    const activePage = document.querySelector('.page.active')
    if (activePage?.id === 'page-my-profile') loadMyProfile()
    if (activePage?.id === 'page-community-messages') {
      initCommunityMessagesPage()
      if (communityDetailPostId) loadCommunityDetail(communityDetailPostId)
    }
  }

  setNavigateTo(navigateTo)
  setMaybeShowUsageGuide(maybeShowUsageGuideOnFirstEntry)
  registerRefreshHook(refreshAuthBoundUI)

  initTheme()
  initLang()
  registerLangChangeHook(() => applyLang())
  initAuthGate()
  initSettingsPanel(refreshAuthBoundUI)
  initUsageGuide()
  initSchools()
  initProfile(navigateTo)
  initSchoolPlanningForm()
  initApplicationCaseModal()

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      const pageId = item.getAttribute('data-page')
      if (!pageId) return
      if (pageId === 'usage-guide') { startUsageGuide(true); return }
      if (pageId !== 'community-messages') { closeCommunityReplySheet(); closeCommunityDetailModal(); /* closeCommunityPostModal handled internally */ }
      closeApplicationCaseModal()
      const overlay = getOverlay()
      if (overlay?.classList.contains('active')) closeSchoolDetail()
      navigateTo(pageId)
      if (pageId === 'school-planning') syncSchoolPlanningIdentityState()
      if (pageId === 'university-database') loadSchoolListExplorer()
      if (pageId === 'target-universities') loadSchoolListTarget()
      if (pageId === 'my-profile') loadMyProfile()
      if (pageId === 'study-planning') initStudyPlanningPage()
      if (pageId === 'daily-checkin') initDailyCheckinPage()
      if (pageId === 'community-messages') initCommunityMessagesPage()
      if (pageId === 'application-cases') initApplicationCasesPage()
    })
  })

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    const authModal = document.getElementById('auth-modal')
    if (authModal?.classList.contains('active')) { closeAuthModal(); return }
    const caseModal = document.getElementById('application-case-modal')
    if (caseModal?.classList.contains('active')) { closeApplicationCaseModal(); return }
    handleGlobalEscape()
  })

  initAuthState().then(() => {
    refreshAuthBoundUI()
    const activePage = document.querySelector('.page.active')
    if (activePage?.id === 'page-university-database') loadSchoolListExplorer()
    if (activePage?.id === 'page-target-universities') loadSchoolListTarget()
    if (activePage?.id === 'page-study-planning') initStudyPlanningPage()
    if (activePage?.id === 'page-daily-checkin') initDailyCheckinPage()
    if (activePage?.id === 'page-community-messages') initCommunityMessagesPage()
    if (activePage?.id === 'page-application-cases') initApplicationCasesPage()
  }).catch((err) => {
    console.error('initAuthState:', err)
    showLanding()
    openAuthModal('login', t('auth.initFail'))
  })
})
