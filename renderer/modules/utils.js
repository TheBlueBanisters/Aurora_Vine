import NotifyX from 'notifyx'
import 'notifyx/style.css'

export function showToast(message, type = 'info') {
  const options = { position: 'top-center', duration: 3000, showProgress: false }
  if (type === 'success') NotifyX.success(message, options)
  else if (type === 'error') NotifyX.error(message, options)
  else if (type === 'warning') NotifyX.warning(message, options)
  else NotifyX.info(message, options)
}

export function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatBilingual(zh, en) {
  const z = zh ? escapeHtml(zh) : ''
  const e = en ? escapeHtml(en) : ''
  if (z && e) return z + ' / ' + e
  return z || e || '-'
}

export function waitMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function pad2(n) {
  return String(n).padStart(2, '0')
}

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function toMonthKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`
}

export function parseDateKey(dateKey) {
  const parts = String(dateKey || '').split('-').map((v) => Number(v))
  if (parts.length !== 3) return null
  const [y, m, d] = parts
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null
  return new Date(y, m - 1, d)
}

export function formatDateTime(dateTimeText) {
  const value = String(dateTimeText || '').trim()
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}

export function formatDateLabel(dateKey) {
  const date = parseDateKey(dateKey)
  if (!date) return dateKey
  const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekNames[date.getDay()]}`
}

export function renderAuthorWithBadgeAndAvatar(authorName, isCertified, authorId, hasAvatar) {
  const name = escapeHtml(authorName || '-')
  const badgeClass = isCertified ? 'community-author-badge--gold' : 'community-author-badge--blue'
  const avatarHtml = hasAvatar && authorId
    ? `<img class="community-author-avatar" data-account-id="${escapeHtml(String(authorId))}" alt="" loading="lazy">`
    : ''
  return `${avatarHtml}<span>${name}</span><span class="community-author-badge ${badgeClass}">V</span>`
}

export async function fillCommunityAvatarImages(container) {
  if (!container || !window.api?.avatarGetDataUrl) return
  const imgs = container.querySelectorAll('.community-author-avatar[data-account-id]')
  for (const img of imgs) {
    const id = img.getAttribute('data-account-id')
    if (!id) continue
    try {
      const res = await window.api.avatarGetDataUrl(Number(id))
      if (res?.dataUrl && img.getAttribute('data-account-id') === id) {
        img.src = res.dataUrl
        img.removeAttribute('data-account-id')
      }
    } catch (_) {}
  }
}
