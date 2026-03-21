import { escapeHtml, showToast } from './utils.js'

const APPLICATION_CASE_PAGE_SIZE = 12

let casesCurrentPage = 1
let casesTotal = 0
let casesInitialized = false
let casesSearchTimer = null
let casesKeyword = ''
let casesUndergradTier = 'all'
let casesGpaBand = 'all'
let casesLanguageBand = 'all'
let casesBgFocus = 'all'
let casesSort = 'score_desc'

function getCaseFilters() {
  return {
    keyword: casesKeyword,
    undergradTier: casesUndergradTier,
    gpaBand: casesGpaBand,
    languageBand: casesLanguageBand,
    bgFocus: casesBgFocus,
    sort: casesSort
  }
}

function formatMaybeNumber(value, allowZero = false) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '-'
  if (allowZero) return String(num)
  return num > 0 ? String(num) : '-'
}

function formatRankPercent(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '-'
  return `${num}%`
}

function formatLanguageSummary(item) {
  if (Number(item.ielts_score) > 0) return `IELTS ${item.ielts_score}`
  if (Number(item.toefl_score) > 0) return `TOEFL ${item.toefl_score}`
  return '语言待补强'
}

function formatGreSummary(item) {
  if (Number(item.gre_score) > 0) return `GRE ${item.gre_score}`
  return 'GRE 未提供'
}

function renderCaseTags(tags = []) {
  const safeTags = Array.isArray(tags) ? tags : []
  return safeTags.map((tag) => `<span class="application-case-tag">${escapeHtml(tag)}</span>`).join('')
}

function syncTierFilterState() {
  const container = document.getElementById('application-cases-tier-filters')
  if (!container) return
  container.querySelectorAll('.school-filter-chip[data-tier]').forEach((button) => {
    const active = button.dataset.tier === casesUndergradTier
    button.classList.toggle('is-active', active)
    button.setAttribute('aria-pressed', String(active))
  })
}

function renderCaseEmptyState(message = '暂无申请案例') {
  const listEl = document.getElementById('application-cases-list')
  const paginationEl = document.getElementById('application-cases-pagination')
  if (listEl) {
    listEl.innerHTML = `
      <div class="application-case-empty-card">
        <p class="placeholder-text">${escapeHtml(message)}</p>
        <p class="placeholder-hint">请尝试调整筛选条件，或稍后再试。</p>
      </div>`
  }
  if (paginationEl) paginationEl.innerHTML = ''
}

function renderCaseSummary(total) {
  const summaryEl = document.getElementById('application-cases-summary')
  if (!summaryEl) return
  summaryEl.innerHTML = `
    <div class="application-cases-summary-card">
      <p class="application-cases-summary-title">案例样本库</p>
      <p class="application-cases-summary-text">共 ${total} 条背景案例，可按本科层次、GPA、语言和软背景进行筛选。</p>
    </div>`
}

function renderCasePagination() {
  const paginationEl = document.getElementById('application-cases-pagination')
  if (!paginationEl) return
  paginationEl.innerHTML = ''
  const totalPages = Math.ceil(casesTotal / APPLICATION_CASE_PAGE_SIZE) || 1
  const prev = document.createElement('button')
  prev.className = 'pagination-btn pagination-prev'
  prev.innerHTML = '‹'
  prev.title = '上一页'
  prev.disabled = casesCurrentPage <= 1
  prev.addEventListener('click', () => {
    if (casesCurrentPage <= 1) return
    casesCurrentPage -= 1
    loadApplicationCases()
  })
  const next = document.createElement('button')
  next.className = 'pagination-btn pagination-next'
  next.innerHTML = '›'
  next.title = '下一页'
  next.disabled = casesCurrentPage >= totalPages
  next.addEventListener('click', () => {
    if (casesCurrentPage >= totalPages) return
    casesCurrentPage += 1
    loadApplicationCases()
  })
  const info = document.createElement('span')
  info.className = 'pagination-info'
  info.textContent = `第 ${casesCurrentPage} / ${totalPages} 页，共 ${casesTotal} 条案例`
  paginationEl.appendChild(prev)
  paginationEl.appendChild(info)
  paginationEl.appendChild(next)
}

function buildDetailField(label, value) {
  return `
    <div class="application-case-detail-item">
      <span class="application-case-detail-item-label">${escapeHtml(label)}</span>
      <span class="application-case-detail-item-value">${escapeHtml(value)}</span>
    </div>`
}

function closeApplicationCaseModal() {
  const modal = document.getElementById('application-case-modal')
  if (!modal) return
  modal.classList.remove('active')
  modal.setAttribute('aria-hidden', 'true')
}

function openApplicationCaseModal() {
  const modal = document.getElementById('application-case-modal')
  if (!modal) return
  modal.classList.add('active')
  modal.setAttribute('aria-hidden', 'false')
}

export async function openApplicationCaseDetail(caseId) {
  if (!window.api?.applicationCasesGetDetail) return
  const res = await window.api.applicationCasesGetDetail(caseId)
  if (res?.error || !res?.caseItem) {
    showToast(res?.error || '读取案例详情失败', 'error')
    return
  }

  const { caseItem, offers = [] } = res
  const kickerEl = document.getElementById('application-case-detail-kicker')
  const titleEl = document.getElementById('application-case-detail-title')
  const subtitleEl = document.getElementById('application-case-detail-subtitle')
  const overviewEl = document.getElementById('application-case-detail-overview')
  const testsEl = document.getElementById('application-case-detail-tests')
  const softEl = document.getElementById('application-case-detail-soft')
  const offersEl = document.getElementById('application-case-detail-offers')

  if (!kickerEl || !titleEl || !subtitleEl || !overviewEl || !testsEl || !softEl || !offersEl) return

  kickerEl.textContent = `案例 #${caseItem.case_no} · ${caseItem.undergrad_tier} · 背景评分 ${caseItem.profile_tier_score}`
  titleEl.textContent = caseItem.primary_school_name_zh || '申请案例详情'
  subtitleEl.textContent = caseItem.primary_program_name_cn
    ? `${caseItem.primary_program_name_cn}${caseItem.primary_program_name_en ? ` / ${caseItem.primary_program_name_en}` : ''}`
    : '查看该背景样本对应的多 offer 结果'

  overviewEl.innerHTML = [
    buildDetailField('本科层次', caseItem.undergrad_tier || '-'),
    buildDetailField('绩点', `${formatMaybeNumber(caseItem.gpa_value)} / ${escapeHtml(caseItem.gpa_scale || '-')}`),
    buildDetailField('绩点排名', formatRankPercent(caseItem.gpa_rank_percent)),
    buildDetailField('主录取院校', caseItem.primary_school_name_zh || '-'),
    buildDetailField('主录取项目', caseItem.primary_program_name_cn || '-'),
    buildDetailField('案例标签', (caseItem.tags || []).join(' · ') || '-')
  ].join('')

  testsEl.innerHTML = [
    buildDetailField('雅思', formatMaybeNumber(caseItem.ielts_score)),
    buildDetailField('托福', formatMaybeNumber(caseItem.toefl_score)),
    buildDetailField('GRE', formatMaybeNumber(caseItem.gre_score)),
    buildDetailField('GRE写作', formatMaybeNumber(caseItem.gre_writing_score))
  ].join('')

  softEl.innerHTML = [
    buildDetailField('实习数量', `${formatMaybeNumber(caseItem.internship_count, true)} 段`),
    buildDetailField('科研数量', `${formatMaybeNumber(caseItem.research_count, true)} 项`),
    buildDetailField('论文数量', `${formatMaybeNumber(caseItem.paper_count, true)} 篇`)
  ].join('')

  offersEl.innerHTML = offers.length
    ? offers.map((offer) => `
      <div class="application-case-offer-card ${offer.is_primary_offer ? 'is-primary' : ''}">
        <div class="application-case-offer-top">
          <div>
            <h5 class="application-case-offer-school">${escapeHtml(offer.school_name_zh || '')}</h5>
            <p class="application-case-offer-program">${escapeHtml(offer.program_name_cn || '')}${offer.program_name_en ? ` / ${escapeHtml(offer.program_name_en)}` : ''}</p>
          </div>
          <div class="application-case-offer-badges">
            <span class="application-case-offer-badge">${escapeHtml(`QS #${offer.ranking_qs || '-'}`)}</span>
            <span class="application-case-offer-badge">${escapeHtml(offer.offer_tier || '匹配')}</span>
            ${offer.is_primary_offer ? '<span class="application-case-offer-badge is-primary">主结果</span>' : ''}
          </div>
        </div>
        <p class="application-case-offer-meta">${escapeHtml([offer.country_zh, offer.city_zh].filter(Boolean).join(' · ') || '地区信息暂缺')}</p>
      </div>`).join('')
    : '<p class="placeholder-hint">暂无 offer 信息</p>'

  openApplicationCaseModal()
}

function renderCaseCard(item) {
  return `
    <article class="application-case-card" data-case-id="${item.id}">
      <div class="application-case-card-top">
        <div>
          <p class="application-case-card-kicker">案例 #${escapeHtml(String(item.case_no || '-'))} · ${escapeHtml(item.undergrad_tier || '-')}</p>
          <h3 class="application-case-card-title">${escapeHtml(item.primary_school_name_zh || '待分配院校')}</h3>
          <p class="application-case-card-subtitle">${escapeHtml(item.primary_program_name_cn || '项目待定')}</p>
        </div>
        <div class="application-case-card-score">
          <span class="application-case-card-score-label">背景评分</span>
          <strong>${escapeHtml(String(item.profile_tier_score || '-'))}</strong>
        </div>
      </div>

      <div class="application-case-card-grid">
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">本科</span>
          <span class="application-case-card-metric-value">${escapeHtml(item.undergrad_tier || '-')}</span>
        </div>
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">GPA</span>
          <span class="application-case-card-metric-value">${escapeHtml(String(item.gpa_value || '-'))}</span>
        </div>
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">语言</span>
          <span class="application-case-card-metric-value">${escapeHtml(formatLanguageSummary(item))}</span>
        </div>
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">GRE</span>
          <span class="application-case-card-metric-value">${escapeHtml(formatGreSummary(item))}</span>
        </div>
      </div>

      <div class="application-case-card-soft">
        <span>实习 ${escapeHtml(String(item.internship_count || 0))}</span>
        <span>科研 ${escapeHtml(String(item.research_count || 0))}</span>
        <span>论文 ${escapeHtml(String(item.paper_count || 0))}</span>
        <span>${escapeHtml(`Offer ${item.offer_count || 0}`)}</span>
        <span>${escapeHtml(`QS #${item.primary_ranking_qs || '-'}`)}</span>
      </div>

      <div class="application-case-card-tags">${renderCaseTags(item.tags)}</div>
      <div class="application-case-card-actions">
        <button type="button" class="form-submit-btn application-case-card-btn" data-case-detail-id="${item.id}">查看完整 Offer</button>
      </div>
    </article>`
}

export async function loadApplicationCases() {
  const listEl = document.getElementById('application-cases-list')
  const paginationEl = document.getElementById('application-cases-pagination')
  if (!listEl || !paginationEl || !window.api?.applicationCasesList) return

  listEl.innerHTML = `
    <div class="application-case-empty-card">
      <p class="placeholder-text">正在加载申请案例...</p>
      <p class="placeholder-hint">请稍候，正在整理案例与 offer 数据。</p>
    </div>`
  paginationEl.innerHTML = ''

  try {
    const res = await window.api.applicationCasesList(casesCurrentPage, APPLICATION_CASE_PAGE_SIZE, getCaseFilters())
    const { items = [], total = 0, error } = res || {}
    if (error) {
      renderCaseEmptyState(error)
      return
    }
    casesTotal = total
    renderCaseSummary(total)
    if (!items.length) {
      renderCaseEmptyState('未找到匹配案例')
      return
    }

    listEl.innerHTML = items.map(renderCaseCard).join('')
    listEl.querySelectorAll('[data-case-detail-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const caseId = Number(button.getAttribute('data-case-detail-id'))
        if (caseId) openApplicationCaseDetail(caseId)
      })
    })
    listEl.querySelectorAll('.application-case-card').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('[data-case-detail-id]')) return
        const caseId = Number(card.getAttribute('data-case-id'))
        if (caseId) openApplicationCaseDetail(caseId)
      })
    })
    renderCasePagination()
  } catch (err) {
    console.error('loadApplicationCases:', err)
    renderCaseEmptyState(`加载失败：${err?.message || '请刷新重试'}`)
  }
}

export function initApplicationCasesPage() {
  const listEl = document.getElementById('application-cases-list')
  if (!listEl) return
  if (!casesInitialized) {
    casesInitialized = true

    const searchInput = document.getElementById('application-cases-search-input')
    const searchClearBtn = document.getElementById('application-cases-search-clear')
    const searchBar = document.getElementById('application-cases-search-bar')
    const tierFilters = document.getElementById('application-cases-tier-filters')
    const gpaBandSelect = document.getElementById('application-cases-gpa-band')
    const languageBandSelect = document.getElementById('application-cases-language-band')
    const bgFocusSelect = document.getElementById('application-cases-bg-focus')
    const sortSelect = document.getElementById('application-cases-sort')
    const modal = document.getElementById('application-case-modal')
    const modalClose = document.getElementById('application-case-modal-close')

    const refreshSearchState = () => {
      if (!searchBar || !searchInput) return
      searchBar.classList.toggle('has-value', !!searchInput.value.trim())
    }

    searchInput?.addEventListener('input', () => {
      refreshSearchState()
      if (casesSearchTimer) clearTimeout(casesSearchTimer)
      casesSearchTimer = setTimeout(() => {
        casesKeyword = searchInput.value.trim()
        casesCurrentPage = 1
        loadApplicationCases()
      }, 250)
    })

    searchClearBtn?.addEventListener('click', () => {
      if (!searchInput) return
      searchInput.value = ''
      casesKeyword = ''
      refreshSearchState()
      casesCurrentPage = 1
      loadApplicationCases()
    })

    tierFilters?.querySelectorAll('.school-filter-chip[data-tier]').forEach((button) => {
      button.addEventListener('click', () => {
        casesUndergradTier = button.dataset.tier || 'all'
        syncTierFilterState()
        casesCurrentPage = 1
        loadApplicationCases()
      })
    })

    gpaBandSelect?.addEventListener('change', () => {
      casesGpaBand = gpaBandSelect.value || 'all'
      casesCurrentPage = 1
      loadApplicationCases()
    })
    languageBandSelect?.addEventListener('change', () => {
      casesLanguageBand = languageBandSelect.value || 'all'
      casesCurrentPage = 1
      loadApplicationCases()
    })
    bgFocusSelect?.addEventListener('change', () => {
      casesBgFocus = bgFocusSelect.value || 'all'
      casesCurrentPage = 1
      loadApplicationCases()
    })
    sortSelect?.addEventListener('change', () => {
      casesSort = sortSelect.value || 'score_desc'
      casesCurrentPage = 1
      loadApplicationCases()
    })

    modalClose?.addEventListener('click', closeApplicationCaseModal)
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) closeApplicationCaseModal()
    })
  }

  syncTierFilterState()
  loadApplicationCases()
}

export { closeApplicationCaseModal }
