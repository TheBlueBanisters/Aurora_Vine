/** @type {WeakMap<HTMLSelectElement, { wrapper: HTMLElement, trigger: HTMLButtonElement, labelEl: HTMLElement, list: HTMLElement, observer: MutationObserver }>} */
const enhanced = new WeakMap()

let globalListenersBound = false

function closeAllOpen(exceptWrapper = null) {
  document.querySelectorAll('.custom-select.is-open').forEach((wrapper) => {
    if (wrapper === exceptWrapper) return
    wrapper.classList.remove('is-open')
    const select = wrapper.querySelector('select.custom-select-native')
    const ui = select && enhanced.get(select)
    if (select && ui) syncOpenState(select, ui)
  })
}

function bindGlobalListeners() {
  if (globalListenersBound) return
  globalListenersBound = true

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.target instanceof Element && event.target.closest('.custom-select')) return
      closeAllOpen()
    },
    true
  )

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllOpen()
  })
}

function syncOpenState(select, ui) {
  const { wrapper, trigger, list } = ui
  const isOpen = wrapper.classList.contains('is-open')
  trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
  list.hidden = !isOpen
}

function updateTriggerState(select, ui) {
  const { wrapper, trigger, labelEl } = ui
  const selected = select.options[select.selectedIndex]
  const noneLocked = select.dataset.noneLocked === 'true'
  labelEl.textContent = selected?.textContent || ''
  wrapper.classList.toggle('is-placeholder', !select.value)
  wrapper.classList.toggle('is-disabled', select.disabled || noneLocked)
  wrapper.classList.toggle('is-none-locked', noneLocked)
  trigger.disabled = select.disabled && !noneLocked
}

function rebuildOptions(select, ui) {
  const { list } = ui
  list.replaceChildren()

  Array.from(select.options).forEach((option) => {
    const item = document.createElement('li')
    item.className = 'custom-select-option'
    item.dataset.value = option.value
    item.textContent = option.textContent
    item.setAttribute('role', 'option')
    item.setAttribute('aria-selected', option.value === select.value ? 'true' : 'false')
    if (option.value === select.value) item.classList.add('is-selected')
    if (option.disabled) {
      item.classList.add('is-disabled')
      item.setAttribute('aria-disabled', 'true')
    }
    list.appendChild(item)
  })

  updateTriggerState(select, ui)
}

function setSelectValue(select, value, ui) {
  select.value = value
  select.dispatchEvent(new Event('change', { bubbles: true }))
  rebuildOptions(select, ui)
  ui.wrapper.classList.remove('is-open')
  syncOpenState(select, ui)
}

function bindSelectEvents(select, ui) {
  const { wrapper, trigger, list } = ui

  trigger.addEventListener('click', (event) => {
    event.stopPropagation()
    if (select.disabled) return
    if (select.dataset.noneLocked === 'true') {
      select.dispatchEvent(new CustomEvent('aurora:select-none-unlock', { bubbles: true }))
    }
    if (select.disabled) return
    const willOpen = !wrapper.classList.contains('is-open')
    closeAllOpen(willOpen ? wrapper : null)
    wrapper.classList.toggle('is-open', willOpen)
    syncOpenState(select, ui)
  })

  list.addEventListener('click', (event) => {
    const item = event.target.closest('.custom-select-option')
    if (!item || item.classList.contains('is-disabled')) return
    setSelectValue(select, item.dataset.value ?? '', ui)
  })

  select.addEventListener('change', () => rebuildOptions(select, ui))

  const observer = new MutationObserver(() => rebuildOptions(select, ui))
  observer.observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled', 'selected', 'data-none-locked'],
    characterData: true
  })
  ui.observer = observer
}

export function refreshSelect(select) {
  if (!select) return
  const ui = enhanced.get(select)
  if (!ui) return
  rebuildOptions(select, ui)
  updateTriggerState(select, ui)
}

export function refreshSelectsIn(container) {
  if (!container) return
  container.querySelectorAll('select.custom-select-native').forEach(refreshSelect)
}

export function enhanceSelect(select) {
  if (!select || !(select instanceof HTMLSelectElement)) return
  bindGlobalListeners()

  if (enhanced.has(select)) {
    refreshSelect(select)
    return
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'custom-select'

  const parent = select.parentNode
  parent?.insertBefore(wrapper, select)
  wrapper.appendChild(select)

  select.classList.add('custom-select-native')
  select.tabIndex = -1

  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.className = 'custom-select-trigger'
  trigger.setAttribute('aria-haspopup', 'listbox')

  const labelEl = document.createElement('span')
  labelEl.className = 'custom-select-label'
  const chevron = document.createElement('span')
  chevron.className = 'custom-select-chevron'
  chevron.setAttribute('aria-hidden', 'true')
  chevron.textContent = '▾'
  trigger.append(labelEl, chevron)

  const list = document.createElement('ul')
  list.className = 'custom-select-list'
  list.setAttribute('role', 'listbox')
  list.hidden = true

  wrapper.append(trigger, list)

  const ui = { wrapper, trigger, labelEl, list, observer: null }
  enhanced.set(select, ui)

  bindSelectEvents(select, ui)
  rebuildOptions(select, ui)
  syncOpenState(select, ui)
}

export function enhanceSelectsIn(container) {
  if (!container) return
  bindGlobalListeners()
  container.querySelectorAll('select.form-select').forEach(enhanceSelect)
}
