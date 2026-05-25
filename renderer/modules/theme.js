import { THEME_KEY } from './state.js'
import logoLight from '../../image/logo.png'
import logoDark from '../../image/logo_n.png'

const THEME_LOGO_SELECTOR = '.sidebar-logo, .auth-gate-logo'
const LOGO_FADE_DURATION_MS = 360
const LOGO_SWAP_HOLD_MS = 90
const logoTransitionStates = new WeakMap()

function getLogoTransitionState(logoEl) {
  if (!logoTransitionStates.has(logoEl)) {
    logoTransitionStates.set(logoEl, { token: 0, timer: null })
  }
  return logoTransitionStates.get(logoEl)
}

function transitionThemeLogo(logoEl, isDark, animate = true) {
  if (!logoEl) return
  const targetSrc = isDark ? logoDark : logoLight
  const fallbackSrc = logoLight
  const currentSrc = logoEl.getAttribute('src') || ''

  if (currentSrc === targetSrc) return

  const state = getLogoTransitionState(logoEl)
  const token = ++state.token
  const preload = new Image()

  preload.onload = () => {
    if (token !== state.token) return

    if (!animate) {
      if (state.timer) {
        clearTimeout(state.timer)
        state.timer = null
      }
      logoEl.classList.remove('is-fading')
      logoEl.src = targetSrc
      return
    }

    if (state.timer) {
      clearTimeout(state.timer)
      state.timer = null
    }
    logoEl.classList.remove('is-fading')
    void logoEl.offsetWidth
    logoEl.classList.add('is-fading')

    state.timer = setTimeout(() => {
      if (token !== state.token) return
      logoEl.src = targetSrc
      state.timer = setTimeout(() => {
        if (token !== state.token) return
        logoEl.classList.remove('is-fading')
        state.timer = null
      }, LOGO_SWAP_HOLD_MS)
    }, LOGO_FADE_DURATION_MS)
  }

  preload.onerror = () => {
    if (targetSrc !== fallbackSrc) {
      transitionThemeLogo(logoEl, false, animate)
    } else if (token === state.token) {
      if (state.timer) {
        clearTimeout(state.timer)
        state.timer = null
      }
      logoEl.classList.remove('is-fading')
    }
  }

  preload.src = targetSrc
}

function transitionAllThemeLogos(isDark, animate = true) {
  document.querySelectorAll(THEME_LOGO_SELECTOR).forEach((logoEl) => {
    transitionThemeLogo(logoEl, isDark, animate)
  })
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function applyTheme(theme, options = {}) {
  const { animateLogo = true } = options
  const isDark = theme === 'dark'
  document.documentElement.dataset.theme = isDark ? 'dark' : ''
  transitionAllThemeLogos(isDark, animateLogo)
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
  const theme = getTheme()
  applyTheme(theme, { animateLogo: false })
  const toggle = document.getElementById('night-mode-toggle')
  if (toggle) {
    toggle.checked = theme === 'dark'
    toggle.removeEventListener('change', onNightModeChange)
    toggle.addEventListener('change', onNightModeChange)
  }
}
