import { THEME_KEY } from './state.js'
import logoLight from '../../image/logo.png'
import logoDark from '../../image/logo_n.png'

let sidebarLogo = null
let sidebarLogoTransitionToken = 0
let sidebarLogoTransitionTimer = null

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

function transitionSidebarLogo(isDark, animate = true) {
  if (!sidebarLogo) return
  const targetSrc = isDark ? logoDark : logoLight
  const fallbackSrc = logoLight
  const currentSrc = sidebarLogo.getAttribute('src') || ''

  if (currentSrc === targetSrc) return

  const token = ++sidebarLogoTransitionToken
  const preload = new Image()
  const LOGO_FADE_DURATION_MS = 360
  const LOGO_SWAP_HOLD_MS = 90

  preload.onload = () => {
    if (token !== sidebarLogoTransitionToken) return

    if (!animate) {
      if (sidebarLogoTransitionTimer) {
        clearTimeout(sidebarLogoTransitionTimer)
        sidebarLogoTransitionTimer = null
      }
      sidebarLogo.classList.remove('is-fading')
      sidebarLogo.src = targetSrc
      return
    }

    if (sidebarLogoTransitionTimer) {
      clearTimeout(sidebarLogoTransitionTimer)
      sidebarLogoTransitionTimer = null
    }
    sidebarLogo.classList.remove('is-fading')
    void sidebarLogo.offsetWidth
    sidebarLogo.classList.add('is-fading')

    sidebarLogoTransitionTimer = setTimeout(() => {
      if (token !== sidebarLogoTransitionToken) return
      sidebarLogo.src = targetSrc
      sidebarLogoTransitionTimer = setTimeout(() => {
        if (token !== sidebarLogoTransitionToken) return
        sidebarLogo.classList.remove('is-fading')
        sidebarLogoTransitionTimer = null
      }, LOGO_SWAP_HOLD_MS)
    }, LOGO_FADE_DURATION_MS)
  }

  preload.onerror = () => {
    if (targetSrc !== fallbackSrc) {
      transitionSidebarLogo(false, animate)
    } else if (token === sidebarLogoTransitionToken) {
      if (sidebarLogoTransitionTimer) {
        clearTimeout(sidebarLogoTransitionTimer)
        sidebarLogoTransitionTimer = null
      }
      sidebarLogo.classList.remove('is-fading')
    }
  }

  preload.src = targetSrc
}

export function applyTheme(theme, options = {}) {
  const { animateLogo = true } = options
  const isDark = theme === 'dark'
  document.documentElement.dataset.theme = isDark ? 'dark' : ''
  transitionSidebarLogo(isDark, animateLogo)
  if (window.api?.themeApply) {
    window.api.themeApply(theme)
  }
}

function onNightModeChange() {
  const toggle = document.getElementById('night-mode-toggle')
  const theme = toggle?.checked ? 'dark' : 'light'
  setTheme(theme)
  applyTheme(theme, { animateLogo: true })
}

export function initTheme() {
  sidebarLogo = document.querySelector('.sidebar-logo')
  const theme = getTheme()
  applyTheme(theme, { animateLogo: false })
  const toggle = document.getElementById('night-mode-toggle')
  if (toggle) {
    toggle.checked = theme === 'dark'
    toggle.removeEventListener('change', onNightModeChange)
    toggle.addEventListener('change', onNightModeChange)
  }
}
