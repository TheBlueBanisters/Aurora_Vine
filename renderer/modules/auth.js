import { showToast } from './utils.js'
import {
  applyAuthState,
  getAuthState,
  isAccountMode,
  isGuestMode,
  getCurrentAccountId,
  runRefreshHooks
} from './state.js'
import {
  getGuestSchoolPlanningProfile,
  promptGuestProfileMigrationForAccount
} from './storage.js'
import { t } from './i18n.js'

let _navigateTo = null
let _maybeShowUsageGuide = null

export function setNavigateTo(fn) { _navigateTo = fn }
export function getNavigateTo() { return _navigateTo }
export function setMaybeShowUsageGuide(fn) { _maybeShowUsageGuide = fn }

export function switchAuthTab(tab) {
  const nextTab = tab === 'register' ? 'register' : 'login'
  document.querySelectorAll('.auth-tab').forEach((button) => {
    button.classList.toggle('active', button.dataset.authTab === nextTab)
  })
  const loginForm = document.getElementById('auth-login-form')
  const registerForm = document.getElementById('auth-register-form')
  loginForm?.classList.toggle('active', nextTab === 'login')
  registerForm?.classList.toggle('active', nextTab === 'register')
}

export function openAuthModal(preferredTab = 'login', message = '') {
  if (message) showToast(message, 'info')
  const modal = document.getElementById('auth-modal')
  if (modal) {
    modal.classList.add('active')
    modal.setAttribute('aria-hidden', 'false')
  }
  switchAuthTab(preferredTab)
}

export function closeAuthModal() {
  const modal = document.getElementById('auth-modal')
  if (modal) {
    modal.classList.remove('active')
    modal.setAttribute('aria-hidden', 'true')
  }
}

export function showLanding() {
  document.body.classList.remove('auth-boot')
  document.body.classList.add('landing-mode')
  document.body.classList.remove('app-mode')
  const landing = document.getElementById('landing-page')
  const appLayout = document.querySelector('.app-layout')
  if (landing) {
    landing.style.display = ''
    landing.style.visibility = ''
  }
  if (appLayout) appLayout.style.display = 'none'
}

export function showMainApp() {
  document.body.classList.remove('auth-boot')
  document.body.classList.remove('landing-mode')
  document.body.classList.add('app-mode')
  const landing = document.getElementById('landing-page')
  const appLayout = document.querySelector('.app-layout')
  if (landing) landing.style.display = 'none'
  if (appLayout) {
    appLayout.style.display = ''
    appLayout.style.visibility = ''
  }
}

export function openAuthGate(preferredTab = 'login', message = '') {
  openAuthModal(preferredTab, message)
}

export function applyAuthStateAndRefresh(payload, options = {}) {
  const { previousMode = getAuthState().mode, shouldPromptGuestMigration = false, successToast } = options
  applyAuthState(payload)
  if (successToast) showToast(successToast, 'success')
  if (shouldPromptGuestMigration && isAccountMode() && (previousMode === 'guest' || !!getGuestSchoolPlanningProfile())) {
    promptGuestProfileMigrationForAccount(getCurrentAccountId())
  }
  if (getAuthState().mode === 'none') {
    closeAuthModal()
    showLanding()
  } else {
    closeAuthModal()
    if (document.body.classList.contains('landing-mode')) {
      showMainApp()
      if (_navigateTo) _navigateTo('school-planning')
      if (_maybeShowUsageGuide) _maybeShowUsageGuide()
    }
    runRefreshHooks()
  }
}

export function initAuthGate() {
  document.getElementById('landing-auth-btn')?.addEventListener('click', () => {
    openAuthModal('login')
  })

  const authModal = document.getElementById('auth-modal')
  const authModalPanel = document.querySelector('.auth-modal-panel')
  const authModalBackdrop = document.getElementById('auth-modal-backdrop')
  const authModalClose = document.getElementById('auth-modal-close')

  authModalBackdrop?.addEventListener('click', () => closeAuthModal())
  authModalClose?.addEventListener('click', () => closeAuthModal())

  authModal?.addEventListener('click', (e) => {
    if (!authModalPanel?.contains(e.target)) closeAuthModal()
  })

  document.querySelectorAll('.auth-tab').forEach((button) => {
    button.addEventListener('click', () => switchAuthTab(button.dataset.authTab))
  })

  document.getElementById('auth-enter-guest-btn')?.addEventListener('click', async () => {
    if (!window.api?.authEnterGuest) return
    const res = await window.api.authEnterGuest()
    if (!res?.success) {
      showToast(res?.error || t('auth.enterGuestFail'), 'error')
      return
    }
    applyAuthStateAndRefresh(res, { previousMode: getAuthState().mode, successToast: t('auth.enteredGuest') })
  })

  document.getElementById('auth-login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!window.api?.authLogin) return
    const email = document.getElementById('auth-login-email')?.value?.trim() || ''
    const password = document.getElementById('auth-login-password')?.value || ''
    if (!email) { showToast(t('auth.enterEmail'), 'warning'); return }
    if (!password) { showToast(t('auth.enterPassword'), 'warning'); return }
    const previousMode = getAuthState().mode
    const res = await window.api.authLogin({ email, password })
    if (!res?.success) { showToast(res?.error || t('auth.loginFail'), 'error'); return }
    applyAuthStateAndRefresh(res, { previousMode, shouldPromptGuestMigration: true, successToast: t('auth.loginSuccess') })
  })

  document.getElementById('auth-register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!window.api?.authRegister) return
    const email = document.getElementById('auth-register-email')?.value?.trim() || ''
    const nickname = document.getElementById('auth-register-nickname')?.value?.trim() || ''
    const password = document.getElementById('auth-register-password')?.value || ''
    const passwordConfirm = document.getElementById('auth-register-password-confirm')?.value || ''
    if (!email) { showToast(t('auth.enterEmail'), 'warning'); return }
    if (password.length < 6) { showToast(t('auth.passwordMin6'), 'warning'); return }
    if (password !== passwordConfirm) { showToast(t('auth.passwordMismatch'), 'warning'); return }
    const previousMode = getAuthState().mode
    const res = await window.api.authRegister({ email, nickname, password })
    if (!res?.success) { showToast(res?.error || t('auth.registerFail'), 'error'); return }
    applyAuthStateAndRefresh(res, { previousMode, shouldPromptGuestMigration: true, successToast: t('auth.registerSuccess') })
  })
}

export async function initAuthState() {
  if (!window.api?.authGetCurrentUser) {
    showLanding()
    openAuthModal('login')
    return
  }
  const res = await window.api.authGetCurrentUser()
  applyAuthState(res)
  const mode = getAuthState().mode
  if (mode === 'account' || mode === 'guest') {
    showMainApp()
    closeAuthModal()
    if (_navigateTo) _navigateTo('school-planning')
    if (mode === 'account' && _maybeShowUsageGuide) _maybeShowUsageGuide()
  } else {
    showLanding()
  }
}
