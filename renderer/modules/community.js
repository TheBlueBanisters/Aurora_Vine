import { showToast, escapeHtml, formatDateTime, renderAuthorWithBadgeAndAvatar, fillCommunityAvatarImages } from './utils.js'
import { isAccountMode, getCurrentUserDisplayName, COMMUNITY_PAGE_SIZE } from './state.js'
import { openAuthGate } from './auth.js'
import { showAppConfirm } from './confirm-dialog.js'
import { t } from './i18n.js'
import picnicEmptyImg from '../../image/picnic.png'

let communityCurrentPage = 1
let communityTotal = 0
let communityInitialized = false
export let communityDetailPostId = null
let communityReplyTarget = null

export function updateCommunityComposerState() {
  const authTip = document.getElementById('community-board-auth-tip')
  const newPostBtn = document.getElementById('community-new-post-btn')
  const replyBtn = document.getElementById('community-open-reply-btn')
  const postCurrentUser = document.getElementById('community-post-current-user')
  const replyCurrentUser = document.getElementById('community-reply-current-user')
  const userText = isAccountMode()
    ? t('community.postIdentity', getCurrentUserDisplayName())
    : t('community.guestBrowse')

  if (authTip) authTip.textContent = isAccountMode() ? t('community.authTipAccount', getCurrentUserDisplayName()) : t('community.authTipGuest')
  if (newPostBtn) newPostBtn.textContent = isAccountMode() ? t('community.newPost') : t('community.loginToPost')
  if (replyBtn) replyBtn.textContent = isAccountMode() ? t('community.comment') : t('community.loginToReply')
  if (postCurrentUser) postCurrentUser.textContent = userText
  if (replyCurrentUser) replyCurrentUser.textContent = userText
}

function renderCommunityEmptyState(listEl, text) {
  if (!listEl) return
  listEl.innerHTML = `<div class="community-empty-card"><div class="empty-state-figure"><img src="${picnicEmptyImg}" alt=""></div><p class="placeholder-text">${escapeHtml(text || t('community.emptyPosts'))}</p><p class="placeholder-hint">${t('community.emptyPostsHint')}</p></div>`
}

function closeCommunityPostModal() {
  const modal = document.getElementById('community-post-modal')
  const titleInput = document.getElementById('community-post-title-input')
  const contentInput = document.getElementById('community-post-content-input')
  if (!modal || !titleInput || !contentInput) return
  modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true')
  titleInput.value = ''; contentInput.value = ''
}

async function promptCommunityLoginRequired(intent = 'post') {
  const isReply = intent === 'reply'
  const confirmed = await showAppConfirm({
    title: t(isReply ? 'community.loginRequiredReplyTitle' : 'community.loginRequiredPostTitle'),
    description: t(isReply ? 'community.loginRequiredReplyDesc' : 'community.loginRequiredPostDesc'),
    cancelText: t('daily.cancel'),
    confirmText: t('community.loginRequiredConfirm')
  })
  if (confirmed) {
    openAuthGate('login', t(isReply ? 'community.loginToReplyGate' : 'community.loginToPostGate'))
  }
}

async function openCommunityPostModal() {
  if (!isAccountMode()) {
    await promptCommunityLoginRequired('post')
    return
  }
  const modal = document.getElementById('community-post-modal')
  const titleInput = document.getElementById('community-post-title-input')
  if (!modal || !titleInput) return
  modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false')
  setTimeout(() => titleInput.focus(), 0)
}

export function closeCommunityDetailModal() {
  const modal = document.getElementById('community-detail-modal')
  if (!modal) return
  closeCommunityReplySheet()
  modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true')
  communityDetailPostId = null
}

function openCommunityDetailModal() {
  const modal = document.getElementById('community-detail-modal')
  if (!modal) return
  modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false')
}

export function closeCommunityReplySheet() {
  const sheet = document.getElementById('community-reply-sheet')
  const contentInput = document.getElementById('community-reply-content-input')
  const targetTextEl = document.getElementById('community-reply-target-text')
  if (!sheet || !contentInput || !targetTextEl) return
  sheet.classList.remove('active'); sheet.setAttribute('aria-hidden', 'true')
  contentInput.value = ''; communityReplyTarget = null
  targetTextEl.textContent = t('community.replyTargetOP')
}

async function openCommunityReplySheet(targetReply = null) {
  if (!isAccountMode()) {
    await promptCommunityLoginRequired('reply')
    return
  }
  const sheet = document.getElementById('community-reply-sheet')
  const contentInput = document.getElementById('community-reply-content-input')
  const targetTextEl = document.getElementById('community-reply-target-text')
  if (!sheet || !contentInput || !targetTextEl || !communityDetailPostId) return
  communityReplyTarget = targetReply && targetReply.replyId ? targetReply : null
  targetTextEl.textContent = communityReplyTarget ? t('community.replyTargetAuthor', communityReplyTarget.authorName || t('community.anonymousUser')) : t('community.replyTargetOP')
  sheet.classList.add('active'); sheet.setAttribute('aria-hidden', 'false')
  setTimeout(() => contentInput.focus(), 0)
}

function renderCommunityPagination() {
  const paginationEl = document.getElementById('community-board-pagination')
  if (!paginationEl) return
  paginationEl.innerHTML = ''
  const totalPages = Math.ceil(communityTotal / COMMUNITY_PAGE_SIZE) || 1
  const prev = document.createElement('button')
  prev.className = 'pagination-btn pagination-prev'; prev.innerHTML = '‹'; prev.title = '上一页'; prev.disabled = communityCurrentPage <= 1
  prev.addEventListener('click', () => { if (communityCurrentPage <= 1) return; communityCurrentPage -= 1; loadCommunityMessageList() })
  const next = document.createElement('button')
  next.className = 'pagination-btn pagination-next'; next.innerHTML = '›'; next.title = '下一页'; next.disabled = communityCurrentPage >= totalPages
  next.addEventListener('click', () => { if (communityCurrentPage >= totalPages) return; communityCurrentPage += 1; loadCommunityMessageList() })
  const info = document.createElement('span')
  info.className = 'pagination-info'; info.textContent = t('community.pagination', communityCurrentPage, totalPages, communityTotal)
  paginationEl.appendChild(prev); paginationEl.appendChild(info); paginationEl.appendChild(next)
}

export async function loadCommunityDetail(postId) {
  if (!window.api?.communityGetPostDetail) return
  const res = await window.api.communityGetPostDetail(postId)
  if (res?.error || !res?.post) { showToast(res?.error || t('community.detailFail'), 'error'); return }

  const detailTitleEl = document.getElementById('community-detail-title')
  const detailMetaEl = document.getElementById('community-detail-meta')
  const contentEl = document.getElementById('community-detail-content')
  const repliesEl = document.getElementById('community-replies-list')
  const deletePostBtn = document.getElementById('community-delete-post-btn')
  const replyBtn = document.getElementById('community-open-reply-btn')
  if (!detailTitleEl || !detailMetaEl || !contentEl || !repliesEl || !deletePostBtn || !replyBtn) return

  const post = res.post; const replies = res.replies || []
  detailTitleEl.textContent = post.title || ''
  const postAuthorHtml = renderAuthorWithBadgeAndAvatar(post.author_name, !!post.author_is_certified, post.author_id, !!post.author_avatar_url)
  detailMetaEl.innerHTML = `<span class="community-detail-author">${postAuthorHtml}</span> · ${escapeHtml(formatDateTime(post.created_at))}`
  contentEl.textContent = post.content || ''
  deletePostBtn.style.display = post.canDelete ? '' : 'none'
  replyBtn.textContent = isAccountMode() ? t('community.comment') : t('community.loginToReply')

  if (replies.length === 0) {
    repliesEl.innerHTML = `<p class="community-reply-empty">${t('community.noReplies')}</p>`
    const detailModal = document.getElementById('community-detail-modal')
    if (detailModal) fillCommunityAvatarImages(detailModal)
    return
  }

  repliesEl.innerHTML = replies.map((reply) => {
    const replyAuthorHtml = renderAuthorWithBadgeAndAvatar(reply.author_name, !!reply.author_is_certified, reply.author_id, !!reply.author_avatar_url)
    const authorBlock = `<span class="community-detail-author">${replyAuthorHtml}</span>`
    const replyMetaText = reply.parent_author_name ? `${authorBlock} ${t('community.replyLabel')} ${escapeHtml(reply.parent_author_name)}` : authorBlock
    return `<div class="community-reply-item"><div class="community-reply-main">${escapeHtml(reply.content || '')}</div><div class="community-reply-meta"><span>${replyMetaText} · ${escapeHtml(formatDateTime(reply.created_at))}</span><div class="community-reply-actions"><button type="button" class="community-reply-action-btn" data-reply-id="${Number(reply.id || 0)}" data-reply-author="${escapeHtml(reply.author_name || '')}">${t('community.replyTA')}</button>${reply.canDelete ? `<button type="button" class="community-reply-delete-btn" data-reply-id="${Number(reply.id || 0)}">${t('community.deleteReply')}</button>` : ''}</div></div></div>`
  }).join('')

  const detailModal = document.getElementById('community-detail-modal')
  if (detailModal) fillCommunityAvatarImages(detailModal)

  repliesEl.querySelectorAll('.community-reply-action-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const replyId = Number(btn.getAttribute('data-reply-id') || 0)
      const authorName = btn.getAttribute('data-reply-author') || ''
      if (!replyId) return
      openCommunityReplySheet({ replyId, authorName })
    })
  })

  repliesEl.querySelectorAll('.community-reply-delete-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const replyId = Number(btn.getAttribute('data-reply-id') || 0)
      if (!replyId || !communityDetailPostId) return
      if (!window.confirm(t('community.confirmDeleteReply'))) return
      if (!window.api?.communityDeleteReply) return
      const delRes = await window.api.communityDeleteReply({ postId: communityDetailPostId, replyId })
      if (!delRes?.success) { showToast(delRes?.error || t('community.deleteReplyFail'), 'error'); return }
      showToast(t('community.deleteReplySuccess'), 'success')
      await loadCommunityDetail(communityDetailPostId)
      await loadCommunityMessageList()
    })
  })
}

export async function loadCommunityMessageList() {
  const listEl = document.getElementById('community-board-list')
  const paginationEl = document.getElementById('community-board-pagination')
  if (!listEl || !paginationEl) return

  if (!window.api?.communityListPosts) { renderCommunityEmptyState(listEl, t('community.noSupport')); paginationEl.innerHTML = ''; return }

  const res = await window.api.communityListPosts(communityCurrentPage, COMMUNITY_PAGE_SIZE)
  if (res?.error) { renderCommunityEmptyState(listEl, res.error); paginationEl.innerHTML = ''; return }

  const items = res?.items || []
  communityTotal = Number(res?.total || 0)

  if (items.length === 0) {
    if (communityCurrentPage > 1) { communityCurrentPage = Math.max(1, communityCurrentPage - 1); await loadCommunityMessageList(); return }
    renderCommunityEmptyState(listEl, t('community.emptyPosts')); renderCommunityPagination(); return
  }

  listEl.innerHTML = ''
  items.forEach((item) => {
    const card = document.createElement('button')
    card.type = 'button'; card.className = 'community-post-card'
    const authorHtml = renderAuthorWithBadgeAndAvatar(item.author_name, !!item.author_is_certified, item.author_id, !!item.author_avatar_url)
    card.innerHTML = `<div class="community-post-title">${escapeHtml(item.title || '')}</div><div class="community-post-meta"><span class="community-post-author">${authorHtml}</span><span>${escapeHtml(formatDateTime(item.created_at))}</span><span>${t('community.replyCount', Number(item.reply_count || 0))}</span></div>`
    card.addEventListener('click', async () => {
      communityDetailPostId = Number(item.id)
      await loadCommunityDetail(communityDetailPostId)
      openCommunityDetailModal()
    })
    listEl.appendChild(card)
  })

  fillCommunityAvatarImages(listEl)
  renderCommunityPagination()
}

export async function initCommunityMessagesPage() {
  updateCommunityComposerState()
  if (!communityInitialized) {
    const newPostBtn = document.getElementById('community-new-post-btn')
    const postModal = document.getElementById('community-post-modal')
    const postCancelBtn = document.getElementById('community-post-cancel-btn')
    const postSubmitBtn = document.getElementById('community-post-submit-btn')
    const detailModal = document.getElementById('community-detail-modal')
    const detailCloseBtn = document.getElementById('community-detail-close-btn')
    const openReplyBtn = document.getElementById('community-open-reply-btn')
    const deletePostBtn = document.getElementById('community-delete-post-btn')
    const replySheet = document.getElementById('community-reply-sheet')
    const replySheetMask = document.getElementById('community-reply-sheet-mask')
    const replyCancelBtn = document.getElementById('community-reply-cancel-btn')
    const replySubmitBtn = document.getElementById('community-reply-submit-btn')

    newPostBtn?.addEventListener('click', () => openCommunityPostModal())
    postCancelBtn?.addEventListener('click', () => closeCommunityPostModal())
    postModal?.addEventListener('click', (e) => { if (e.target === postModal) closeCommunityPostModal() })

    postSubmitBtn?.addEventListener('click', async () => {
      const titleInput = document.getElementById('community-post-title-input')
      const contentInput = document.getElementById('community-post-content-input')
      if (!titleInput || !contentInput) return
      const title = titleInput.value.trim(); const content = contentInput.value.trim()
      if (!title) { showToast(t('community.titleRequired'), 'warning'); titleInput.focus(); return }
      if (!content) { showToast(t('community.contentRequired'), 'warning'); contentInput.focus(); return }
      if (!isAccountMode()) { await promptCommunityLoginRequired('post'); return }
      if (!window.api?.communityCreatePost) return
      const postRes = await window.api.communityCreatePost({ title, content })
      if (!postRes?.success) { showToast(postRes?.error || t('community.postFail'), 'error'); return }
      showToast(t('community.postSuccess'), 'success'); closeCommunityPostModal(); communityCurrentPage = 1; await loadCommunityMessageList()
    })

    detailCloseBtn?.addEventListener('click', () => closeCommunityDetailModal())
    detailModal?.addEventListener('click', (e) => { if (e.target === detailModal) closeCommunityDetailModal() })
    openReplyBtn?.addEventListener('click', () => openCommunityReplySheet(null))
    deletePostBtn?.addEventListener('click', async () => {
      if (!communityDetailPostId) return
      if (!window.confirm(t('community.confirmDeletePost'))) return
      if (!window.api?.communityDeletePost) return
      const delRes = await window.api.communityDeletePost(communityDetailPostId)
      if (!delRes?.success) { showToast(delRes?.error || t('community.deletePostFail'), 'error'); return }
      showToast(t('community.deletePostSuccess'), 'success'); closeCommunityDetailModal(); await loadCommunityMessageList()
    })
    replyCancelBtn?.addEventListener('click', () => closeCommunityReplySheet())
    replySheetMask?.addEventListener('click', () => closeCommunityReplySheet())
    replySheet?.addEventListener('click', (e) => { if (e.target === replySheet) closeCommunityReplySheet() })

    replySubmitBtn?.addEventListener('click', async () => {
      const contentInput = document.getElementById('community-reply-content-input')
      if (!contentInput || !communityDetailPostId) return
      const content = contentInput.value.trim()
      if (!content) { showToast(t('community.replyEmpty'), 'warning'); contentInput.focus(); return }
      if (!isAccountMode()) { await promptCommunityLoginRequired('reply'); return }
      if (!window.api?.communityCreateReply) return
      const replyRes = await window.api.communityCreateReply({ postId: communityDetailPostId, content, parentReplyId: communityReplyTarget?.replyId || null })
      if (!replyRes?.success) { showToast(replyRes?.error || t('community.replyFail'), 'error'); return }
      showToast(t('community.replySuccess'), 'success')
      closeCommunityReplySheet(); await loadCommunityDetail(communityDetailPostId); await loadCommunityMessageList()
    })

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return
      if (replySheet?.classList.contains('active')) { closeCommunityReplySheet(); return }
      if (postModal?.classList.contains('active')) { closeCommunityPostModal(); return }
      if (detailModal?.classList.contains('active')) closeCommunityDetailModal()
    })

    communityInitialized = true
  }

  await loadCommunityMessageList()
}
