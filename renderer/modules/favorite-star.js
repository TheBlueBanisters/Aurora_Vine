import { t } from './i18n.js'
import { isFavorite, toggleFavorite } from './storage.js'

export function getFavoriteStarMarkup(schoolId, favorited = isFavorite(schoolId), extraClass = '') {
  const label = favorited ? t('uniDb.unfavorite') : t('uniDb.favorite')
  const classNames = ['school-card-star', favorited ? 'favorited' : '', extraClass].filter(Boolean).join(' ')
  return `
    <button type="button" class="${classNames}" data-school-id="${schoolId}" title="${label}" aria-label="${label}">
      <svg class="star-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
      <svg class="star-filled" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </button>
  `
}

export function bindFavoriteStar(starBtn, schoolId, onToggle) {
  if (!starBtn) return
  starBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    const nowFav = toggleFavorite(schoolId)
    starBtn.classList.toggle('favorited', nowFav)
    starBtn.title = nowFav ? t('uniDb.unfavorite') : t('uniDb.favorite')
    starBtn.setAttribute('aria-label', starBtn.title)
    onToggle?.(nowFav)
  })
}

export function updateFavoriteStarButton(starBtn, favorited) {
  if (!starBtn) return
  starBtn.classList.toggle('favorited', favorited)
  const label = favorited ? t('uniDb.unfavorite') : t('uniDb.favorite')
  starBtn.title = label
  starBtn.setAttribute('aria-label', label)
}
