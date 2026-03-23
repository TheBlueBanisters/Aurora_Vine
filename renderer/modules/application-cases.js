import { escapeHtml, showToast } from './utils.js'
import { t } from './i18n.js'

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
  return t('cases.langWeak')
}

function formatGreSummary(item) {
  if (Number(item.gre_score) > 0) return `GRE ${item.gre_score}`
  return t('cases.greNone')
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

function renderCaseEmptyState(message = t('cases.empty')) {
  const listEl = document.getElementById('application-cases-list')
  const paginationEl = document.getElementById('application-cases-pagination')
  if (listEl) {
    listEl.innerHTML = `
      <div class="application-case-empty-card">
        <p class="placeholder-text">${escapeHtml(message)}</p>
        <p class="placeholder-hint">${t('cases.emptyHint')}</p>
      </div>`
  }
  if (paginationEl) paginationEl.innerHTML = ''
}

function renderCaseSummary(total) {
  const summaryEl = document.getElementById('application-cases-summary')
  if (!summaryEl) return
  summaryEl.innerHTML = `
    <div class="application-cases-summary-card">
      <p class="application-cases-summary-title">${t('cases.sampleTitle')}</p>
      <p class="application-cases-summary-text">${t('cases.sampleText', total)}</p>
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
  prev.title = t('uniDb.prevPage')
  prev.disabled = casesCurrentPage <= 1
  prev.addEventListener('click', () => {
    if (casesCurrentPage <= 1) return
    casesCurrentPage -= 1
    loadApplicationCases()
  })
  const next = document.createElement('button')
  next.className = 'pagination-btn pagination-next'
  next.innerHTML = '›'
  next.title = t('uniDb.nextPage')
  next.disabled = casesCurrentPage >= totalPages
  next.addEventListener('click', () => {
    if (casesCurrentPage >= totalPages) return
    casesCurrentPage += 1
    loadApplicationCases()
  })
  const info = document.createElement('span')
  info.className = 'pagination-info'
  info.textContent = t('cases.pagination', casesCurrentPage, totalPages, casesTotal)
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
  document.body.classList.remove('application-case-modal-open')
}

function openApplicationCaseModal() {
  const modal = document.getElementById('application-case-modal')
  if (!modal) return
  modal.classList.add('active')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('application-case-modal-open')
  const scrollArea = modal.querySelector('.application-case-modal-scroll')
  if (scrollArea) scrollArea.scrollTop = 0
}

export async function openApplicationCaseDetail(caseId) {
  if (!window.api?.applicationCasesGetDetail) return
  const res = await window.api.applicationCasesGetDetail(caseId)
  if (res?.error || !res?.caseItem) {
    showToast(res?.error || t('cases.detailFail'), 'error')
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

  kickerEl.textContent = t('cases.kicker', caseItem.case_no, caseItem.undergrad_tier) + ' · ' + t('cases.profileScore') + ' ' + caseItem.profile_tier_score
  titleEl.textContent = caseItem.primary_school_name_zh || t('caseDetail.title')
  subtitleEl.textContent = caseItem.primary_program_name_cn
    ? `${caseItem.primary_program_name_cn}${caseItem.primary_program_name_en ? ` / ${caseItem.primary_program_name_en}` : ''}`
    : t('caseDetail.subtitleDefault')

  overviewEl.innerHTML = [
    buildDetailField(t('caseDetail.labelTier'), caseItem.undergrad_tier || '-'),
    buildDetailField(t('caseDetail.labelGpa'), `${formatMaybeNumber(caseItem.gpa_value)} / ${escapeHtml(caseItem.gpa_scale || '-')}`),
    buildDetailField(t('caseDetail.labelGpaRank'), formatRankPercent(caseItem.gpa_rank_percent)),
    buildDetailField(t('caseDetail.labelPrimarySchool'), caseItem.primary_school_name_zh || '-'),
    buildDetailField(t('caseDetail.labelPrimaryProgram'), caseItem.primary_program_name_cn || '-'),
    buildDetailField(t('caseDetail.labelTags'), (caseItem.tags || []).join(' · ') || '-')
  ].join('')

  testsEl.innerHTML = [
    buildDetailField(t('caseDetail.labelIelts'), formatMaybeNumber(caseItem.ielts_score)),
    buildDetailField(t('caseDetail.labelToefl'), formatMaybeNumber(caseItem.toefl_score)),
    buildDetailField(t('caseDetail.labelGre'), formatMaybeNumber(caseItem.gre_score)),
    buildDetailField(t('caseDetail.labelGreWriting'), formatMaybeNumber(caseItem.gre_writing_score))
  ].join('')

  softEl.innerHTML = [
    buildDetailField(t('caseDetail.labelInternship'), t('caseDetail.unitInternship', formatMaybeNumber(caseItem.internship_count, true))),
    buildDetailField(t('caseDetail.labelResearch'), t('caseDetail.unitResearch', formatMaybeNumber(caseItem.research_count, true))),
    buildDetailField(t('caseDetail.labelPapers'), t('caseDetail.unitPaper', formatMaybeNumber(caseItem.paper_count, true)))
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
            <span class="application-case-offer-badge">${escapeHtml(offer.offer_tier || t('caseDetail.offerTierMatch'))}</span>
            ${offer.is_primary_offer ? `<span class="application-case-offer-badge is-primary">${t('caseDetail.primaryBadge')}</span>` : ''}
          </div>
        </div>
        <p class="application-case-offer-meta">${escapeHtml([offer.country_zh, offer.city_zh].filter(Boolean).join(' · ') || t('caseDetail.noLocation'))}</p>
      </div>`).join('')
    : `<p class="placeholder-hint">${t('caseDetail.noOffers')}</p>`

  openApplicationCaseModal()
}

function renderCaseCard(item) {
  return `
    <article class="application-case-card" data-case-id="${item.id}">
      <div class="application-case-card-top">
        <div>
          <p class="application-case-card-kicker">${escapeHtml(t('cases.kicker', item.case_no || '-', item.undergrad_tier || '-'))}</p>
          <h3 class="application-case-card-title">${escapeHtml(item.primary_school_name_zh || t('cases.schoolPending'))}</h3>
          <p class="application-case-card-subtitle">${escapeHtml(item.primary_program_name_cn || t('cases.programPending'))}</p>
        </div>
        <div class="application-case-card-score">
          <span class="application-case-card-score-label">${t('cases.profileScore')}</span>
          <strong>${escapeHtml(String(item.profile_tier_score || '-'))}</strong>
        </div>
      </div>

      <div class="application-case-card-grid">
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">${t('cases.labelUndergrad')}</span>
          <span class="application-case-card-metric-value">${escapeHtml(item.undergrad_tier || '-')}</span>
        </div>
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">GPA</span>
          <span class="application-case-card-metric-value">${escapeHtml(String(item.gpa_value || '-'))}</span>
        </div>
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">${t('cases.labelLang')}</span>
          <span class="application-case-card-metric-value">${escapeHtml(formatLanguageSummary(item))}</span>
        </div>
        <div class="application-case-card-metric">
          <span class="application-case-card-metric-label">GRE</span>
          <span class="application-case-card-metric-value">${escapeHtml(formatGreSummary(item))}</span>
        </div>
      </div>

      <div class="application-case-card-soft">
        <span>${t('cases.labelInternship')} ${escapeHtml(String(item.internship_count || 0))}</span>
        <span>${t('cases.labelResearch')} ${escapeHtml(String(item.research_count || 0))}</span>
        <span>${t('cases.labelPaper')} ${escapeHtml(String(item.paper_count || 0))}</span>
        <span>${escapeHtml(`Offer ${item.offer_count || 0}`)}</span>
        <span>${escapeHtml(`QS #${item.primary_ranking_qs || '-'}`)}</span>
      </div>

      <div class="application-case-card-tags">${renderCaseTags(item.tags)}</div>
      <div class="application-case-card-actions">
        <button type="button" class="form-submit-btn application-case-card-btn" data-case-detail-id="${item.id}">${t('cases.viewOffer')}</button>
      </div>
    </article>`
}

export async function loadApplicationCases() {
  const listEl = document.getElementById('application-cases-list')
  const paginationEl = document.getElementById('application-cases-pagination')
  if (!listEl || !paginationEl || !window.api?.applicationCasesList) return

  listEl.innerHTML = `
    <div class="application-case-empty-card">
      <p class="placeholder-text">${t('cases.loading')}</p>
      <p class="placeholder-hint">${t('cases.loadingHint')}</p>
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
      renderCaseEmptyState(t('cases.noMatch'))
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
    renderCaseEmptyState(t('cases.loadFail', err?.message || ''))
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

  }

  syncTierFilterState()
  loadApplicationCases()
}

export function initApplicationCaseModal() {
  const modal = document.getElementById('application-case-modal')
  const modalClose = document.getElementById('application-case-modal-close')
  modalClose?.addEventListener('click', closeApplicationCaseModal)
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeApplicationCaseModal()
  })
}

export { closeApplicationCaseModal }
