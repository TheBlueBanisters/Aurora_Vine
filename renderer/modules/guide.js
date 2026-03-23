import { getUsageGuideSteps, getUsageGuideFinalStep, USAGE_GUIDE_NO_MORE_KEY } from './state.js'

let usageGuideCurrentStep = 0
let usageGuideManualReplay = false
const USAGE_GUIDE_CARD_GAP = 16

function positionUsageGuideSpotlight(targetEl) {
  const spotlight = document.getElementById('usage-guide-spotlight')
  if (!spotlight || !targetEl) return
  const rect = targetEl.getBoundingClientRect()
  const padding = 4
  spotlight.style.top = `${rect.top - padding}px`
  spotlight.style.left = `${rect.left - padding}px`
  spotlight.style.width = `${rect.width + padding * 2}px`
  spotlight.style.height = `${rect.height + padding * 2}px`
  spotlight.style.display = ''
}

function positionUsageGuideCard(targetEl) {
  const card = document.getElementById('usage-guide-card')
  if (!card || !targetEl) return
  const rect = targetEl.getBoundingClientRect()
  const cardRect = card.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  let left = rect.right + USAGE_GUIDE_CARD_GAP
  let top = rect.top + (rect.height / 2) - (cardRect.height / 2)
  if (left + cardRect.width > viewportWidth - 24) left = rect.left - cardRect.width - USAGE_GUIDE_CARD_GAP
  if (left < 24) left = 24
  if (top < 24) top = 24
  if (top + cardRect.height > viewportHeight - 24) top = viewportHeight - cardRect.height - 24
  card.style.left = `${left}px`
  card.style.top = `${top}px`
  card.style.right = 'auto'
  card.style.bottom = 'auto'
}

function runUsageGuideStep(stepIndex) {
  const overlay = document.getElementById('usage-guide-overlay')
  const titleEl = document.getElementById('usage-guide-title')
  const descEl = document.getElementById('usage-guide-desc')
  const progressEl = document.getElementById('usage-guide-progress')
  const prevBtn = document.getElementById('usage-guide-prev')
  const nextBtn = document.getElementById('usage-guide-next')
  const doneBtn = document.getElementById('usage-guide-done')
  const noMoreWrap = document.getElementById('usage-guide-no-more-wrap')
  const skipBtn = document.getElementById('usage-guide-skip')
  const spotlight = document.getElementById('usage-guide-spotlight')
  const steps = getUsageGuideSteps()
  const totalSteps = steps.length
  const isFinal = stepIndex >= totalSteps

  if (!overlay || !titleEl || !descEl) return

  if (isFinal) {
    const step = getUsageGuideFinalStep()
    titleEl.textContent = step.title
    descEl.textContent = step.desc
    const usageGuideNav = document.getElementById('nav-item-usage-guide')
    if (usageGuideNav) {
      usageGuideNav.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      positionUsageGuideSpotlight(usageGuideNav)
      requestAnimationFrame(() => { requestAnimationFrame(() => positionUsageGuideCard(usageGuideNav)) })
    } else {
      spotlight.style.display = 'none'
    }
    prevBtn.style.display = 'none'
    nextBtn.style.display = 'none'
    doneBtn.style.display = ''
    noMoreWrap.style.display = ''
    if (skipBtn) skipBtn.style.display = 'none'
    progressEl.innerHTML = ''
  } else {
    const step = steps[stepIndex]
    const targetNav = document.querySelector(`.nav-item[data-page="${step.pageId}"]`)
    titleEl.textContent = step.title
    descEl.textContent = step.desc
    if (targetNav) {
      targetNav.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      positionUsageGuideSpotlight(targetNav)
      requestAnimationFrame(() => { requestAnimationFrame(() => positionUsageGuideCard(targetNav)) })
    } else {
      spotlight.style.display = 'none'
    }
    prevBtn.style.display = stepIndex === 0 ? 'none' : ''
    nextBtn.style.display = ''
    doneBtn.style.display = 'none'
    noMoreWrap.style.display = 'none'
    if (skipBtn) skipBtn.style.display = ''
    progressEl.innerHTML = Array.from({ length: totalSteps }, (_, i) => {
      const active = i === stepIndex ? ' is-active' : ''
      return `<span class="usage-guide-progress-dot${active}" aria-hidden="true"></span>`
    }).join('')
  }
}

export function closeUsageGuide(saveNoMore = false) {
  const overlay = document.getElementById('usage-guide-overlay')
  if (!overlay) return
  overlay.classList.remove('active')
  overlay.setAttribute('aria-hidden', 'true')
  if (saveNoMore) {
    try { localStorage.setItem(USAGE_GUIDE_NO_MORE_KEY, 'true') } catch (_) {}
  }
}

export function startUsageGuide(manualReplay = false) {
  usageGuideManualReplay = !!manualReplay
  const overlay = document.getElementById('usage-guide-overlay')
  if (!overlay) return
  if (!manualReplay && localStorage.getItem(USAGE_GUIDE_NO_MORE_KEY) === 'true') return
  usageGuideCurrentStep = 0
  overlay.classList.add('active')
  overlay.setAttribute('aria-hidden', 'false')
  requestAnimationFrame(() => {
    runUsageGuideStep(usageGuideCurrentStep)
    document.getElementById('usage-guide-card')?.focus?.()
  })
}

export function maybeShowUsageGuideOnFirstEntry() {
  if (localStorage.getItem(USAGE_GUIDE_NO_MORE_KEY) === 'true') return
  requestAnimationFrame(() => startUsageGuide(false))
}

export function initUsageGuide() {
  const overlay = document.getElementById('usage-guide-overlay')
  const prevBtn = document.getElementById('usage-guide-prev')
  const nextBtn = document.getElementById('usage-guide-next')
  const doneBtn = document.getElementById('usage-guide-done')
  const noMoreCheckbox = document.getElementById('usage-guide-no-more')
  const skipBtn = document.getElementById('usage-guide-skip')
  if (!overlay || !prevBtn || !nextBtn || !doneBtn || !noMoreCheckbox) return

  skipBtn?.addEventListener('click', () => closeUsageGuide(false))

  prevBtn.addEventListener('click', () => {
    if (usageGuideCurrentStep > 0) { usageGuideCurrentStep--; runUsageGuideStep(usageGuideCurrentStep) }
  })
  nextBtn.addEventListener('click', () => {
    if (usageGuideCurrentStep < getUsageGuideSteps().length) { usageGuideCurrentStep++; runUsageGuideStep(usageGuideCurrentStep) }
  })
  doneBtn.addEventListener('click', () => {
    const saveNoMore = noMoreCheckbox.checked && !usageGuideManualReplay
    closeUsageGuide(saveNoMore)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    if (!overlay.classList.contains('active')) return
    closeUsageGuide(false)
  })
  window.addEventListener('resize', () => {
    if (!overlay.classList.contains('active')) return
    const resizeSteps = getUsageGuideSteps()
    const isFinal = usageGuideCurrentStep >= resizeSteps.length
    if (isFinal) {
      const usageGuideNav = document.getElementById('nav-item-usage-guide')
      if (usageGuideNav) { positionUsageGuideSpotlight(usageGuideNav); positionUsageGuideCard(usageGuideNav) }
    } else {
      const step = resizeSteps[usageGuideCurrentStep]
      const targetNav = document.querySelector(`.nav-item[data-page="${step.pageId}"]`)
      if (targetNav) { positionUsageGuideSpotlight(targetNav); positionUsageGuideCard(targetNav) }
    }
  })
}
