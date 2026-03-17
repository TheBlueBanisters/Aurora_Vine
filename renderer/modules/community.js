import { showToast, escapeHtml, formatDateTime, renderAuthorWithBadgeAndAvatar, fillCommunityAvatarImages } from './utils.js'
import { isAccountMode, getCurrentUserDisplayName, COMMUNITY_PAGE_SIZE } from './state.js'
import { openAuthGate } from './auth.js'

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
    ? `当前发布身份：${getCurrentUserDisplayName()}`
    : '游客模式下仅可浏览，登录后可发帖和回复'

  if (authTip) authTip.textContent = isAccountMode() ? `当前社区身份：${getCurrentUserDisplayName()}` : '游客模式下可浏览社区内容，但不能发帖、回复或删除内容。'
  if (newPostBtn) newPostBtn.textContent = isAccountMode() ? '新建帖子' : '登录后发帖'
  if (replyBtn) replyBtn.textContent = isAccountMode() ? '评论' : '登录后回复'
  if (postCurrentUser) postCurrentUser.textContent = userText
  if (replyCurrentUser) replyCurrentUser.textContent = userText
}

function renderCommunityEmptyState(listEl, text) {
  if (!listEl) return
  listEl.innerHTML = `<div class="community-empty-card"><p class="placeholder-text">${escapeHtml(text || '暂无帖子')}</p><p class="placeholder-hint">点击上方"新建帖子"，发表第一条内容吧</p></div>`
}

function closeCommunityPostModal() {
  const modal = document.getElementById('community-post-modal')
  const titleInput = document.getElementById('community-post-title-input')
  const contentInput = document.getElementById('community-post-content-input')
  if (!modal || !titleInput || !contentInput) return
  modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true')
  titleInput.value = ''; contentInput.value = ''
}

function openCommunityPostModal() {
  if (!isAccountMode()) {
    showToast('游客模式下暂不支持发帖，请先登录或注册账号。', 'info')
    openAuthGate('login', '登录后即可绑定社区身份并发布帖子。')
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
  targetTextEl.textContent = '回复对象：楼主'
}

function openCommunityReplySheet(targetReply = null) {
  if (!isAccountMode()) {
    showToast('游客模式下暂不支持回复，请先登录或注册账号。', 'info')
    openAuthGate('login', '登录后即可绑定社区身份并参与讨论。')
    return
  }
  const sheet = document.getElementById('community-reply-sheet')
  const contentInput = document.getElementById('community-reply-content-input')
  const targetTextEl = document.getElementById('community-reply-target-text')
  if (!sheet || !contentInput || !targetTextEl || !communityDetailPostId) return
  communityReplyTarget = targetReply && targetReply.replyId ? targetReply : null
  targetTextEl.textContent = communityReplyTarget ? `回复对象：${communityReplyTarget.authorName || '匿名用户'}` : '回复对象：楼主'
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
  info.className = 'pagination-info'; info.textContent = `第 ${communityCurrentPage} / ${totalPages} 页，共 ${communityTotal} 条帖子`
  paginationEl.appendChild(prev); paginationEl.appendChild(info); paginationEl.appendChild(next)
}

export async function loadCommunityDetail(postId) {
  if (!window.api?.communityGetPostDetail) return
  const res = await window.api.communityGetPostDetail(postId)
  if (res?.error || !res?.post) { showToast(res?.error || '读取帖子详情失败', 'error'); return }

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
  replyBtn.textContent = isAccountMode() ? '评论' : '登录后回复'

  if (replies.length === 0) {
    repliesEl.innerHTML = '<p class="community-reply-empty">暂无回复，来抢沙发吧~</p>'
    const detailModal = document.getElementById('community-detail-modal')
    if (detailModal) fillCommunityAvatarImages(detailModal)
    return
  }

  repliesEl.innerHTML = replies.map((reply) => {
    const replyAuthorHtml = renderAuthorWithBadgeAndAvatar(reply.author_name, !!reply.author_is_certified, reply.author_id, !!reply.author_avatar_url)
    const authorBlock = `<span class="community-detail-author">${replyAuthorHtml}</span>`
    const replyMetaText = reply.parent_author_name ? `${authorBlock} 回复 ${escapeHtml(reply.parent_author_name)}` : authorBlock
    return `<div class="community-reply-item"><div class="community-reply-main">${escapeHtml(reply.content || '')}</div><div class="community-reply-meta"><span>${replyMetaText} · ${escapeHtml(formatDateTime(reply.created_at))}</span><div class="community-reply-actions"><button type="button" class="community-reply-action-btn" data-reply-id="${Number(reply.id || 0)}" data-reply-author="${escapeHtml(reply.author_name || '')}">回复TA</button>${reply.canDelete ? `<button type="button" class="community-reply-delete-btn" data-reply-id="${Number(reply.id || 0)}">删除</button>` : ''}</div></div></div>`
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
      if (!window.confirm('确认删除这条评论及其所有子回复吗？')) return
      if (!window.api?.communityDeleteReply) return
      const delRes = await window.api.communityDeleteReply({ postId: communityDetailPostId, replyId })
      if (!delRes?.success) { showToast(delRes?.error || '删除评论失败，请稍后重试', 'error'); return }
      showToast('评论已删除', 'success')
      await loadCommunityDetail(communityDetailPostId)
      await loadCommunityMessageList()
    })
  })
}

export async function loadCommunityMessageList() {
  const listEl = document.getElementById('community-board-list')
  const paginationEl = document.getElementById('community-board-pagination')
  if (!listEl || !paginationEl) return

  if (!window.api?.communityListPosts) { renderCommunityEmptyState(listEl, '当前版本不支持社区留言'); paginationEl.innerHTML = ''; return }

  const res = await window.api.communityListPosts(communityCurrentPage, COMMUNITY_PAGE_SIZE)
  if (res?.error) { renderCommunityEmptyState(listEl, res.error); paginationEl.innerHTML = ''; return }

  const items = res?.items || []
  communityTotal = Number(res?.total || 0)

  if (items.length === 0) {
    if (communityCurrentPage > 1) { communityCurrentPage = Math.max(1, communityCurrentPage - 1); await loadCommunityMessageList(); return }
    renderCommunityEmptyState(listEl, '暂无社区帖子'); renderCommunityPagination(); return
  }

  listEl.innerHTML = ''
  items.forEach((item) => {
    const card = document.createElement('button')
    card.type = 'button'; card.className = 'community-post-card'
    const authorHtml = renderAuthorWithBadgeAndAvatar(item.author_name, !!item.author_is_certified, item.author_id, !!item.author_avatar_url)
    card.innerHTML = `<div class="community-post-title">${escapeHtml(item.title || '')}</div><div class="community-post-meta"><span class="community-post-author">${authorHtml}</span><span>${escapeHtml(formatDateTime(item.created_at))}</span><span>回复 ${Number(item.reply_count || 0)}</span></div>`
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
      if (!title) { showToast('请填写标题', 'warning'); titleInput.focus(); return }
      if (!content) { showToast('请填写帖子内容', 'warning'); contentInput.focus(); return }
      if (!isAccountMode()) { showToast('请先登录账号后再发帖', 'info'); openAuthGate('login', '登录后即可绑定社区身份并发布帖子。'); return }
      if (!window.api?.communityCreatePost) return
      const postRes = await window.api.communityCreatePost({ title, content })
      if (!postRes?.success) { showToast(postRes?.error || '发帖失败，请稍后再试', 'error'); return }
      showToast('发帖成功', 'success'); closeCommunityPostModal(); communityCurrentPage = 1; await loadCommunityMessageList()
    })

    detailCloseBtn?.addEventListener('click', () => closeCommunityDetailModal())
    detailModal?.addEventListener('click', (e) => { if (e.target === detailModal) closeCommunityDetailModal() })
    openReplyBtn?.addEventListener('click', () => openCommunityReplySheet(null))
    deletePostBtn?.addEventListener('click', async () => {
      if (!communityDetailPostId) return
      if (!window.confirm('确认删除这个帖子及其全部评论吗？')) return
      if (!window.api?.communityDeletePost) return
      const delRes = await window.api.communityDeletePost(communityDetailPostId)
      if (!delRes?.success) { showToast(delRes?.error || '删除帖子失败，请稍后重试', 'error'); return }
      showToast('帖子已删除', 'success'); closeCommunityDetailModal(); await loadCommunityMessageList()
    })
    replyCancelBtn?.addEventListener('click', () => closeCommunityReplySheet())
    replySheetMask?.addEventListener('click', () => closeCommunityReplySheet())
    replySheet?.addEventListener('click', (e) => { if (e.target === replySheet) closeCommunityReplySheet() })

    replySubmitBtn?.addEventListener('click', async () => {
      const contentInput = document.getElementById('community-reply-content-input')
      if (!contentInput || !communityDetailPostId) return
      const content = contentInput.value.trim()
      if (!content) { showToast('请填写回复内容', 'warning'); contentInput.focus(); return }
      if (!isAccountMode()) { showToast('请先登录账号后再回复', 'info'); openAuthGate('login', '登录后即可绑定社区身份并参与讨论。'); return }
      if (!window.api?.communityCreateReply) return
      const replyRes = await window.api.communityCreateReply({ postId: communityDetailPostId, content, parentReplyId: communityReplyTarget?.replyId || null })
      if (!replyRes?.success) { showToast(replyRes?.error || '回复失败，请稍后再试', 'error'); return }
      showToast('回复已发送', 'success')
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
