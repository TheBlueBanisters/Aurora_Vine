import { t, getLang } from './i18n.js'
import { escapeHtml } from './utils.js'
import { EXTRA_PLACEHOLDER_ITEMS } from './resource-placeholder-extra.js'
import { decorateFireflyHosts } from './firefly-effect.js'

const ITEMS_PER_PAGE = 7

const CATEGORIES = [
  { id: 'gre', labelKey: 'resource.cat.gre', icon: 'book-open' },
  { id: 'ielts', labelKey: 'resource.cat.ielts', icon: 'headphones' },
  { id: 'toefl', labelKey: 'resource.cat.toefl', icon: 'mic' },
  { id: 'duolingo', labelKey: 'resource.cat.duolingo', icon: 'globe' },
  { id: 'letters', labelKey: 'resource.cat.letters', icon: 'mail' },
  { id: 'resume', labelKey: 'resource.cat.resume', icon: 'file-text' },
  { id: 'sop', labelKey: 'resource.cat.sop', icon: 'edit' },
  { id: 'ppt', labelKey: 'resource.cat.ppt', icon: 'monitor' },
  { id: 'guide', labelKey: 'resource.cat.guide', icon: 'compass' }
]

const CATEGORY_ICON_SVGS = {
  'book-open': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>'
}

function item(id, titleKey, descKey, date) {
  return { id, titleKey, descKey, date }
}

const PLACEHOLDER_ITEMS = {
  gre: [
    item('gre-vocab', 'resource.item.greVocab', 'resource.item.greVocabDesc', '2025-01-08'),
    item('gre-vocab-2', 'resource.item.greVocab2', 'resource.item.greVocab2Desc', '2025-01-15'),
    item('gre-math', 'resource.item.greMath', 'resource.item.greMathDesc', '2025-01-22'),
    item('gre-math-2', 'resource.item.greMath2', 'resource.item.greMath2Desc', '2025-02-03'),
    item('gre-writing', 'resource.item.greWriting', 'resource.item.greWritingDesc', '2025-02-10'),
    item('gre-writing-2', 'resource.item.greWriting2', 'resource.item.greWriting2Desc', '2025-02-18'),
    item('gre-practice', 'resource.item.grePractice', 'resource.item.grePracticeDesc', '2025-02-25')
  ],
  ielts: [
    item('ielts-listening', 'resource.item.ieltsListening', 'resource.item.ieltsListeningDesc', '2025-01-06'),
    item('ielts-listening-2', 'resource.item.ieltsListening2', 'resource.item.ieltsListening2Desc', '2025-01-13'),
    item('ielts-speaking', 'resource.item.ieltsSpeaking', 'resource.item.ieltsSpeakingDesc', '2025-01-20'),
    item('ielts-speaking-2', 'resource.item.ieltsSpeaking2', 'resource.item.ieltsSpeaking2Desc', '2025-01-27'),
    item('ielts-writing', 'resource.item.ieltsWriting', 'resource.item.ieltsWritingDesc', '2025-02-05'),
    item('ielts-reading', 'resource.item.ieltsReading', 'resource.item.ieltsReadingDesc', '2025-02-12'),
    item('ielts-mock', 'resource.item.ieltsMock', 'resource.item.ieltsMockDesc', '2025-02-20')
  ],
  toefl: [
    item('toefl-listening', 'resource.item.toeflListening', 'resource.item.toeflListeningDesc', '2025-01-09'),
    item('toefl-listening-2', 'resource.item.toeflListening2', 'resource.item.toeflListening2Desc', '2025-01-16'),
    item('toefl-speaking', 'resource.item.toeflSpeaking', 'resource.item.toeflSpeakingDesc', '2025-01-23'),
    item('toefl-speaking-2', 'resource.item.toeflSpeaking2', 'resource.item.toeflSpeaking2Desc', '2025-01-30'),
    item('toefl-writing', 'resource.item.toeflWriting', 'resource.item.toeflWritingDesc', '2025-02-07'),
    item('toefl-reading', 'resource.item.toeflReading', 'resource.item.toeflReadingDesc', '2025-02-14'),
    item('toefl-mock', 'resource.item.toeflMock', 'resource.item.toeflMockDesc', '2025-02-21')
  ],
  duolingo: [
    item('duolingo-guide', 'resource.item.duolingoGuide', 'resource.item.duolingoGuideDesc', '2025-01-11'),
    item('duolingo-guide-2', 'resource.item.duolingoGuide2', 'resource.item.duolingoGuide2Desc', '2025-01-18'),
    item('duolingo-practice', 'resource.item.duolingoPractice', 'resource.item.duolingoPracticeDesc', '2025-01-25'),
    item('duolingo-practice-2', 'resource.item.duolingoPractice2', 'resource.item.duolingoPractice2Desc', '2025-02-01'),
    item('duolingo-vocab', 'resource.item.duolingoVocab', 'resource.item.duolingoVocabDesc', '2025-02-08'),
    item('duolingo-speaking', 'resource.item.duolingoSpeaking', 'resource.item.duolingoSpeakingDesc', '2025-02-15'),
    item('duolingo-mock', 'resource.item.duolingoMock', 'resource.item.duolingoMockDesc', '2025-02-22')
  ],
  letters: [
    item('cover-letter', 'resource.item.coverLetter', 'resource.item.coverLetterDesc', '2024-12-20'),
    item('cover-letter-2', 'resource.item.coverLetter2', 'resource.item.coverLetter2Desc', '2024-12-28'),
    item('recommendation-letter', 'resource.item.recommendationLetter', 'resource.item.recommendationLetterDesc', '2025-01-05'),
    item('recommendation-letter-2', 'resource.item.recommendationLetter2', 'resource.item.recommendationLetter2Desc', '2025-01-12'),
    item('motivation-letter', 'resource.item.motivationLetter', 'resource.item.motivationLetterDesc', '2025-01-19'),
    item('inquiry-letter', 'resource.item.inquiryLetter', 'resource.item.inquiryLetterDesc', '2025-01-26'),
    item('follow-up-letter', 'resource.item.followUpLetter', 'resource.item.followUpLetterDesc', '2025-02-02')
  ],
  resume: [
    item('resume-template', 'resource.item.resumeTemplate', 'resource.item.resumeTemplateDesc', '2024-12-18'),
    item('resume-template-2', 'resource.item.resumeTemplate2', 'resource.item.resumeTemplate2Desc', '2024-12-26'),
    item('resume-cv', 'resource.item.resumeCv', 'resource.item.resumeCvDesc', '2025-01-03'),
    item('resume-research', 'resource.item.resumeResearch', 'resource.item.resumeResearchDesc', '2025-01-10'),
    item('resume-intern', 'resource.item.resumeIntern', 'resource.item.resumeInternDesc', '2025-01-17'),
    item('resume-design', 'resource.item.resumeDesign', 'resource.item.resumeDesignDesc', '2025-01-24'),
    item('resume-checklist', 'resource.item.resumeChecklist', 'resource.item.resumeChecklistDesc', '2025-01-31')
  ],
  sop: [
    item('sop-template', 'resource.item.sopTemplate', 'resource.item.sopTemplateDesc', '2024-12-22'),
    item('sop-template-2', 'resource.item.sopTemplate2', 'resource.item.sopTemplate2Desc', '2024-12-30'),
    item('sop-structure', 'resource.item.sopStructure', 'resource.item.sopStructureDesc', '2025-01-07'),
    item('sop-motivation', 'resource.item.sopMotivation', 'resource.item.sopMotivationDesc', '2025-01-14'),
    item('sop-career', 'resource.item.sopCareer', 'resource.item.sopCareerDesc', '2025-01-21'),
    item('sop-diversity', 'resource.item.sopDiversity', 'resource.item.sopDiversityDesc', '2025-01-28'),
    item('sop-sample', 'resource.item.sopSample', 'resource.item.sopSampleDesc', '2025-02-04')
  ],
  ppt: [
    item('ppt-defense', 'resource.item.pptDefense', 'resource.item.pptDefenseDesc', '2025-01-04'),
    item('ppt-defense-2', 'resource.item.pptDefense2', 'resource.item.pptDefense2Desc', '2025-01-11'),
    item('ppt-portfolio', 'resource.item.pptPortfolio', 'resource.item.pptPortfolioDesc', '2025-01-18'),
    item('ppt-portfolio-2', 'resource.item.pptPortfolio2', 'resource.item.pptPortfolio2Desc', '2025-01-25'),
    item('ppt-report', 'resource.item.pptReport', 'resource.item.pptReportDesc', '2025-02-01'),
    item('ppt-seminar', 'resource.item.pptSeminar', 'resource.item.pptSeminarDesc', '2025-02-08'),
    item('ppt-application', 'resource.item.pptApplication', 'resource.item.pptApplicationDesc', '2025-02-15')
  ],
  guide: [
    item('guide-timeline', 'resource.item.guideTimeline', 'resource.item.guideTimelineDesc', '2024-12-15'),
    item('guide-timeline-2', 'resource.item.guideTimeline2', 'resource.item.guideTimeline2Desc', '2024-12-23'),
    item('guide-visa', 'resource.item.guideVisa', 'resource.item.guideVisaDesc', '2024-12-30'),
    item('guide-interview', 'resource.item.guideInterview', 'resource.item.guideInterviewDesc', '2025-01-06'),
    item('guide-funding', 'resource.item.guideFunding', 'resource.item.guideFundingDesc', '2025-01-13'),
    item('guide-dorm', 'resource.item.guideDorm', 'resource.item.guideDormDesc', '2025-01-20'),
    item('guide-packing', 'resource.item.guidePacking', 'resource.item.guidePackingDesc', '2025-01-27')
  ]
}

let activeCategoryId = CATEGORIES[0].id
let activePage = 1
let rcInitialized = false

function pickLocalized(value) {
  if (!value || typeof value !== 'object') return ''
  const lang = getLang()
  return value[lang] || value.zh || value.en || ''
}

function getItemTitle(entry) {
  return entry.titleKey ? t(entry.titleKey) : pickLocalized(entry.title)
}

function getItemDesc(entry) {
  return entry.descKey ? t(entry.descKey) : pickLocalized(entry.desc)
}

function getCategoryItems(categoryId) {
  return [
    ...(PLACEHOLDER_ITEMS[categoryId] || []),
    ...(EXTRA_PLACEHOLDER_ITEMS[categoryId] || [])
  ]
}

function openResourceDetail(item) {
  const page = document.getElementById('page-resource-center')
  const detailPage = document.getElementById('resource-detail-page')
  const dateEl = document.getElementById('resource-detail-date')
  const titleEl = document.getElementById('resource-detail-title')
  const descEl = document.getElementById('resource-detail-desc')
  if (!page || !detailPage || !titleEl || !descEl) return

  if (dateEl) dateEl.textContent = item.date || ''
  titleEl.textContent = getItemTitle(item)
  descEl.textContent = getItemDesc(item)

  page.classList.add('is-detail-open')
  detailPage.hidden = false
}

function closeResourceDetail() {
  const page = document.getElementById('page-resource-center')
  const detailPage = document.getElementById('resource-detail-page')
  if (!page || !detailPage) return

  page.classList.remove('is-detail-open')
  detailPage.hidden = true
}

export { closeResourceDetail }

function renderCategoryBar() {
  const bar = document.getElementById('resource-category-bar')
  if (!bar) return

  bar.innerHTML = CATEGORIES.map((cat) => `
    <button
      type="button"
      class="resource-category-chip${cat.id === activeCategoryId ? ' is-active' : ''}"
      data-category-id="${cat.id}"
      role="tab"
      aria-selected="${cat.id === activeCategoryId ? 'true' : 'false'}"
    >
      <span class="resource-category-chip-icon" aria-hidden="true"><span class="resource-category-chip-icon-inner">${CATEGORY_ICON_SVGS[cat.icon] || ''}</span></span>
      <span class="resource-category-chip-label">${escapeHtml(t(cat.labelKey))}</span>
    </button>
  `).join('')

  decorateFireflyHosts(bar, '.resource-category-chip', 'dark-active-hover')

  bar.querySelectorAll('.resource-category-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategoryId = btn.dataset.categoryId
      activePage = 1
      renderCategoryBar()
      renderResourceItems()
    })
  })
}

function renderResourcePagination(totalPages) {
  const paginationEl = document.getElementById('resource-items-pagination')
  if (!paginationEl) return

  if (totalPages <= 1) {
    paginationEl.hidden = true
    paginationEl.replaceChildren()
    return
  }

  paginationEl.hidden = false
  paginationEl.innerHTML = `
    <button type="button" class="resource-pagination-btn" data-page-action="prev"${activePage <= 1 ? ' disabled' : ''}>${escapeHtml(t('resource.pagePrev'))}</button>
    <span class="resource-pagination-indicator">${escapeHtml(t('resource.pageIndicator', activePage, totalPages))}</span>
    <button type="button" class="resource-pagination-btn" data-page-action="next"${activePage >= totalPages ? ' disabled' : ''}>${escapeHtml(t('resource.pageNext'))}</button>
  `

  paginationEl.querySelector('[data-page-action="prev"]')?.addEventListener('click', () => {
    if (activePage <= 1) return
    activePage -= 1
    renderResourceItems()
  })
  paginationEl.querySelector('[data-page-action="next"]')?.addEventListener('click', () => {
    if (activePage >= totalPages) return
    activePage += 1
    renderResourceItems()
  })
}

function renderResourceItems() {
  const titleEl = document.getElementById('resource-items-title')
  const listEl = document.getElementById('resource-items-grid')
  if (!titleEl || !listEl) return

  const category = CATEGORIES.find((cat) => cat.id === activeCategoryId) || CATEGORIES[0]
  const allItems = getCategoryItems(category.id)
  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE))
  if (activePage > totalPages) activePage = totalPages
  if (activePage < 1) activePage = 1

  const start = (activePage - 1) * ITEMS_PER_PAGE
  const pageItems = allItems.slice(start, start + ITEMS_PER_PAGE)

  titleEl.textContent = t(category.labelKey)
  listEl.innerHTML = pageItems.map((entry) => `
    <button type="button" class="resource-item-row" data-item-id="${entry.id}">
      <span class="resource-item-row-date">${escapeHtml(entry.date || '')}</span>
      <span class="resource-item-row-body">
        <span class="resource-item-row-title">${escapeHtml(getItemTitle(entry))}</span>
        <span class="resource-item-row-desc">${escapeHtml(getItemDesc(entry))}</span>
      </span>
      <span class="resource-item-row-arrow" aria-hidden="true">›</span>
    </button>
  `).join('')

  listEl.querySelectorAll('.resource-item-row').forEach((row, index) => {
    row.addEventListener('click', () => openResourceDetail(pageItems[index]))
  })

  renderResourcePagination(totalPages)
}

export function initResourceCenterPage() {
  renderCategoryBar()
  renderResourceItems()

  if (rcInitialized) return
  rcInitialized = true

  document.getElementById('resource-detail-back')?.addEventListener('click', closeResourceDetail)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    const detailPage = document.getElementById('resource-detail-page')
    if (detailPage && !detailPage.hidden) closeResourceDetail()
  })
}
