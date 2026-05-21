export const FIREFLY_PARTICLE_COUNT = 8
export const FIREFLY_LOGO_PARTICLE_COUNT = 5

export function fireflyLayerHtml(count = FIREFLY_PARTICLE_COUNT) {
  const total = Math.max(1, Math.min(FIREFLY_PARTICLE_COUNT, Number(count) || FIREFLY_PARTICLE_COUNT))
  return `<span class="firefly-layer" aria-hidden="true">${'<i></i>'.repeat(total)}</span>`
}

export function decorateFireflyHost(el, mode = 'dark-hover', particleCount = FIREFLY_PARTICLE_COUNT) {
  if (!el || el.querySelector('.firefly-layer')) return
  el.classList.add('firefly-host', `firefly-host--${mode}`)
  el.insertAdjacentHTML('afterbegin', fireflyLayerHtml(particleCount))
}

export function decorateFireflyHosts(root, selector, mode = 'dark-hover', particleCount = FIREFLY_PARTICLE_COUNT) {
  if (!root?.querySelectorAll) return
  root.querySelectorAll(selector).forEach((el) => decorateFireflyHost(el, mode, particleCount))
}

const STATIC_FIREFLY_HOSTS = [
  ['.sidebar-logo-wrap', 'always', FIREFLY_LOGO_PARTICLE_COUNT],
  ['.nav-item', 'dark-active', FIREFLY_PARTICLE_COUNT],
  ['.planning-intro-box', 'dark-hover', FIREFLY_PARTICLE_COUNT],
  ['.score-card', 'dark', FIREFLY_PARTICLE_COUNT],
  ['.my-profile-info-card', 'dark', FIREFLY_PARTICLE_COUNT],
  ['.my-profile-chart-card', 'dark', FIREFLY_PARTICLE_COUNT],
  ['.my-profile-statement-card', 'dark', FIREFLY_PARTICLE_COUNT]
]

export function initFireflyStaticHosts(root = document) {
  STATIC_FIREFLY_HOSTS.forEach(([selector, mode, count]) => {
    decorateFireflyHosts(root, selector, mode, count)
  })
}
