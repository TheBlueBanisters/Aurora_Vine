import { t } from './i18n.js'

let modalEl = null
let titleEl = null
let descEl = null
let cancelBtn = null
let okBtn = null
let resolveFn = null

function ensureElements() {
  if (modalEl) return
  modalEl = document.getElementById('app-confirm-modal')
  titleEl = document.getElementById('app-confirm-title')
  descEl = document.getElementById('app-confirm-desc')
  cancelBtn = document.getElementById('app-confirm-cancel')
  okBtn = document.getElementById('app-confirm-ok')
}

function closeConfirm(result) {
  if (!modalEl) return
  modalEl.classList.remove('active')
  modalEl.setAttribute('aria-hidden', 'true')
  const fn = resolveFn
  resolveFn = null
  fn?.(result)
}

export function showAppConfirm(options = {}) {
  ensureElements()
  if (!modalEl || !titleEl || !descEl || !cancelBtn || !okBtn) return Promise.resolve(false)

  titleEl.textContent = options.title || ''
  descEl.textContent = options.description || ''
  cancelBtn.textContent = options.cancelText || t('daily.cancel')
  okBtn.textContent = options.confirmText || t('common.confirm')
  okBtn.classList.toggle('app-confirm-danger', !!options.danger)

  return new Promise((resolve) => {
    resolveFn = resolve
    modalEl.classList.add('active')
    modalEl.setAttribute('aria-hidden', 'false')
    cancelBtn.focus()
  })
}

export function initAppConfirm() {
  ensureElements()
  if (!modalEl || !cancelBtn || !okBtn) return

  cancelBtn.addEventListener('click', () => closeConfirm(false))
  okBtn.addEventListener('click', () => closeConfirm(true))
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeConfirm(false)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    if (modalEl?.getAttribute('aria-hidden') !== 'false') return
    closeConfirm(false)
  })
}
