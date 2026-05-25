import { t } from './i18n.js'
import { escapeHtml } from './utils.js'
import { PAGE_SIZE } from './state.js'
import { isFavorite, toggleFavorite, getTargetSchools, setTargetSchools } from './storage.js'
import { getFavoriteStarMarkup, bindFavoriteStar } from './favorite-star.js'
import { getTheme } from './theme.js'
import { openApplicationCaseDetail } from './application-cases.js'
import { decorateFireflyHost } from './firefly-effect.js'
import { translateCaseTag, translateOfferTier, translateUndergradTier } from './case-display.js'
import { runContentFadeTransition, runPanelSlideClose, cancelPanelSlideClose } from './ui-transition.js'

let explorerPage = 1
let explorerTotal = 0
let explorerKeyword = ''
let explorerRegion = 'all'
let explorerRanking = 'qs'
let explorerSearchTimer = null
let detailBackPage = 'university-database'
let currentDetailSchool = null
const schoolAssetDataUrlCache = new Map()

const REGION_BUCKET_ALIASES = {
  hong_kong: ['中国香港', '香港', 'hong kong'],
  singapore: ['新加坡', 'singapore'],
  uk: ['英国', 'uk', 'united kingdom', 'england', 'scotland', 'wales', 'northern ireland'],
  usa: ['美国', 'usa', 'united states', 'united states of america'],
  australia: ['澳大利亚', 'australia'],
  malaysia: ['马来西亚', 'malaysia']
}

const EUROPE_ALIASES = [
  '法国', 'france',
  '德国', 'germany',
  '荷兰', 'netherlands',
  '瑞士', 'switzerland',
  '爱尔兰', 'ireland',
  '意大利', 'italy',
  '西班牙', 'spain',
  '比利时', 'belgium',
  '瑞典', 'sweden',
  '丹麦', 'denmark',
  '芬兰', 'finland',
  '挪威', 'norway',
  '奥地利', 'austria',
  '葡萄牙', 'portugal',
  '波兰', 'poland',
  '捷克', 'czech',
  '匈牙利', 'hungary',
  '希腊', 'greece'
]

let overlay, backBtn, titleEl, starBtn, heroBg, logoEl, nameEl, metaEl, introEl, programsEl, relatedCasesEl, detailBody, carouselTrack
let lightbox, lightboxImg, lightboxClose

function renderSkeletonCards(container, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'school-card school-card-skeleton'
    el.innerHTML = `
      <div class="school-card-main">
        <div class="skeleton-block skeleton-logo"></div>
        <div class="skeleton-block skeleton-name"></div>
        <div class="skeleton-block skeleton-meta"></div>
        <div class="skeleton-block skeleton-qs"></div>
        <div class="skeleton-block skeleton-star"></div>
      </div>`
    container.appendChild(el)
  }
}

async function getSchoolAssetDataUrl(rankingQs, filename) {
  if (!rankingQs || !filename || !window.api?.schoolsGetAssetDataUrl) return null
  const cacheKey = `${rankingQs}:${filename}`
  if (schoolAssetDataUrlCache.has(cacheKey)) return schoolAssetDataUrlCache.get(cacheKey)
  const res = await window.api.schoolsGetAssetDataUrl(rankingQs, filename)
  const dataUrl = res?.dataUrl || null
  if (dataUrl) schoolAssetDataUrlCache.set(cacheKey, dataUrl)
  return dataUrl
}

function formatProgramTuition(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return ''
  return t('schoolDetail.tuitionPrefix', amount.toLocaleString())
}

function formatProgramDifficulty(value) {
  const score = Number(value)
  if (!Number.isFinite(score)) return ''
  const formatted = Number.isInteger(score) ? String(score) : score.toFixed(1)
  return t('schoolDetail.difficulty', formatted)
}

function buildProgramPills(program) {
  return [
    program.duration ? `<span class="school-program-pill">${escapeHtml(program.duration)}</span>` : '',
    program.language_requirement ? `<span class="school-program-pill">${escapeHtml(program.language_requirement)}</span>` : '',
    formatProgramDifficulty(program.difficulty_score) ? `<span class="school-program-pill">${escapeHtml(formatProgramDifficulty(program.difficulty_score))}</span>` : ''
  ].filter(Boolean).join('')
}

function buildProgramField(label, value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return `
    <div class="school-program-field">
      <span class="school-program-field-label">${escapeHtml(label)}</span>
      <span class="school-program-field-value">${escapeHtml(text)}</span>
    </div>`
}

function renderProgramsLoading() {
  if (!programsEl) return
  programsEl.innerHTML = `
    <div class="school-detail-section-block school-programs-section">
      <div class="school-programs-heading">
        <h3 class="school-detail-section-title">${t('schoolDetail.programs')}</h3>
        <p class="school-programs-subtitle">${t('schoolDetail.programsLoading')}</p>
      </div>
    </div>`
}

function renderProgramsSection(items = [], error = '') {
  if (!programsEl) return
  if (error) {
    programsEl.innerHTML = `
      <div class="school-detail-section-block school-programs-section">
        <div class="school-programs-heading">
          <h3 class="school-detail-section-title">${t('schoolDetail.programs')}</h3>
          <p class="placeholder-hint">${escapeHtml(error)}</p>
        </div>
      </div>`
    return
  }

  if (!items.length) {
    programsEl.innerHTML = `
      <div class="school-detail-section-block school-programs-section">
        <div class="school-programs-heading">
          <h3 class="school-detail-section-title">${t('schoolDetail.programs')}</h3>
          <p class="placeholder-hint">${t('schoolDetail.programsNone')}</p>
        </div>
      </div>`
    return
  }

  const cards = items.map((program) => {
    const tuition = formatProgramTuition(program.tuition_est)
    const summaryCn = String(program.curriculum_summary_cn || '').trim()
    const summaryEn = String(program.curriculum_summary_en || '').trim()
    return `
      <details class="school-program-card">
        <summary class="school-program-summary">
          <div class="school-program-title-wrap">
            <h4 class="school-program-title">${escapeHtml(program.program_name_cn || program.program_name_en || t('schoolDetail.programUnnamed'))}</h4>
            ${program.program_name_en ? `<p class="school-program-title-en">${escapeHtml(program.program_name_en)}</p>` : ''}
          </div>
          <div class="school-program-pills">${buildProgramPills(program)}</div>
        </summary>
        <div class="school-program-body">
          <div class="school-program-grid">
            ${buildProgramField(t('schoolDetail.fieldDuration'), program.duration)}
            ${buildProgramField(t('schoolDetail.fieldLanguage'), program.language_requirement)}
            ${buildProgramField(t('schoolDetail.fieldTuition'), tuition)}
            ${buildProgramField(t('schoolDetail.fieldDifficulty'), formatProgramDifficulty(program.difficulty_score).replace(/^(难度|Difficulty)\s*/i, ''))}
          </div>
          ${summaryCn ? `<div class="school-program-copy"><h5>${t('schoolDetail.curriculumCn')}</h5><p>${escapeHtml(summaryCn)}</p></div>` : ''}
          ${summaryEn ? `<div class="school-program-copy"><h5>${t('schoolDetail.curriculumEn')}</h5><p>${escapeHtml(summaryEn)}</p></div>` : ''}
        </div>
      </details>`
  }).join('')

  programsEl.innerHTML = `
    <div class="school-detail-section-block school-programs-section">
      <div class="school-programs-heading">
        <div>
          <h3 class="school-detail-section-title">${t('schoolDetail.programs')}</h3>
          <p class="school-programs-subtitle">${t('schoolDetail.programCount', items.length)}</p>
        </div>
      </div>
      <div class="school-programs-list">${cards}</div>
    </div>`
}

function loadSchoolPrograms(school) {
  if (!programsEl) return
  if (!window.api?.schoolsGetProgramsBySchoolId || !school?.school_id) {
    programsEl.innerHTML = ''
    return
  }
  renderProgramsLoading()
  window.api.schoolsGetProgramsBySchoolId(school.school_id).then((res) => {
    if (currentDetailSchool?.school_id !== school.school_id) return
    renderProgramsSection(res?.items || [], res?.error || '')
  }).catch((err) => {
    if (currentDetailSchool?.school_id !== school.school_id) return
    renderProgramsSection([], err?.message || t('schoolDetail.programsFail'))
  })
}

function renderRelatedCasesLoading() {
  if (!relatedCasesEl) return
  relatedCasesEl.innerHTML = `
    <div class="school-detail-section-block school-related-cases-section">
      <div class="school-related-cases-heading">
        <h3 class="school-detail-section-title">${t('schoolDetail.relatedCases')}</h3>
        <p class="school-programs-subtitle">${t('schoolDetail.relatedCasesLoading')}</p>
      </div>
    </div>`
}

function renderRelatedCases(items = [], error = '') {
  if (!relatedCasesEl) return
  if (error) {
    relatedCasesEl.innerHTML = `
      <div class="school-detail-section-block school-related-cases-section">
        <div class="school-related-cases-heading">
          <h3 class="school-detail-section-title">${t('schoolDetail.relatedCases')}</h3>
          <p class="placeholder-hint">${escapeHtml(error)}</p>
        </div>
      </div>`
    return
  }

  if (!items.length) {
    relatedCasesEl.innerHTML = `
      <div class="school-detail-section-block school-related-cases-section">
        <div class="school-related-cases-heading">
          <h3 class="school-detail-section-title">${t('schoolDetail.relatedCases')}</h3>
          <p class="placeholder-hint">${t('schoolDetail.relatedCasesNone')}</p>
        </div>
      </div>`
    return
  }

  const cards = items.map((item) => {
    const language = Number(item.ielts_score) > 0
      ? `IELTS ${item.ielts_score}`
      : Number(item.toefl_score) > 0
        ? `TOEFL ${item.toefl_score}`
        : t('schoolDetail.langWeak')
    const gre = Number(item.gre_score) > 0 ? `GRE ${item.gre_score}` : t('schoolDetail.greNone')
    const tags = Array.isArray(item.tags) ? item.tags.slice(0, 4) : []
    const programCn = String(item.program_name_cn || '').trim() || '—'
    const programEn = String(item.program_name_en || '').trim()
    return `
      <article class="school-related-case-card" data-case-id="${item.id}">
        <div class="school-related-case-top">
          <div>
            <p class="school-related-case-kicker">${escapeHtml(t('schoolDetail.caseKicker', item.case_no || '-', translateUndergradTier(item.undergrad_tier) || '-'))}</p>
            <div class="school-related-case-program">
              <span class="school-related-case-program-label">${t('schoolDetail.admittedProgram')}</span>
              <div class="school-related-case-program-body">
                <p class="school-related-case-program-cn">
                  <span>${escapeHtml(programCn)}</span>
                  <span class="school-related-case-offer-mark" title="${escapeHtml(t('schoolDetail.offerMark'))}">Offer</span>
                </p>
                ${programEn ? `<p class="school-related-case-program-en">${escapeHtml(programEn)}</p>` : ''}
              </div>
            </div>
          </div>
          <div class="school-related-case-score">
            <span>${t('schoolDetail.profileScore')}</span>
            <strong>${escapeHtml(String(item.profile_tier_score || '-'))}</strong>
          </div>
        </div>
        <div class="school-related-case-meta">
          <span>GPA ${escapeHtml(String(item.gpa_value || '-'))}</span>
          <span>${escapeHtml(language)}</span>
          <span>${escapeHtml(gre)}</span>
          <span>${escapeHtml(translateOfferTier(item.offer_tier, t('schoolDetail.offerTierMatch')))}</span>
        </div>
        ${tags.length ? `<div class="school-related-case-tags">${tags.map((tag) => `<span class="school-related-case-tag">${escapeHtml(translateCaseTag(tag))}</span>`).join('')}</div>` : ''}
      </article>`
  }).join('')

  relatedCasesEl.innerHTML = `
    <div class="school-detail-section-block school-related-cases-section">
      <div class="school-related-cases-heading">
        <div>
          <h3 class="school-detail-section-title">${t('schoolDetail.relatedCases')}</h3>
          <p class="school-programs-subtitle">${t('schoolDetail.relatedCasesCount', items.length)}</p>
        </div>
      </div>
      <div class="school-related-cases-list">${cards}</div>
    </div>`

  relatedCasesEl.querySelectorAll('.school-related-case-card[data-case-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const caseId = Number(card.getAttribute('data-case-id'))
      if (caseId) openApplicationCaseDetail(caseId)
    })
  })
}

function loadRelatedCases(school) {
  if (!relatedCasesEl) return
  if (!window.api?.applicationCasesListBySchoolId || !school?.school_id) {
    relatedCasesEl.innerHTML = ''
    return
  }
  renderRelatedCasesLoading()
  window.api.applicationCasesListBySchoolId(school.school_id, 6).then((res) => {
    if (currentDetailSchool?.school_id !== school.school_id) return
    renderRelatedCases(res?.items || [], res?.error || '')
  }).catch((err) => {
    if (currentDetailSchool?.school_id !== school.school_id) return
    renderRelatedCases([], err?.message || t('schoolDetail.relatedCasesFail'))
  })
}

/** 与 data/init_db.js 中逻辑一致：列表英文行不显示「，正式名称…」「，全称…」等括号内中文说明 */
function stripChineseAliasSuffixFromEnglishName(nameEn) {
  return String(nameEn || '')
    .replace(/[,，]\s*正式名称[\s\S]*$/u, '')
    .replace(/[,，]\s*全称[\s\S]*$/u, '')
    .replace(/[,，]\s*(?:又名|旧称|曾用名)[\s\S]*$/u, '')
    .trim()
}

function formatLocationZh(countryZh, cityZh) {
  const normalizedCountry = String(countryZh || '').trim()
  let normalizedCity = String(cityZh || '').trim()
  if (normalizedCountry && normalizedCity.startsWith(normalizedCountry)) {
    normalizedCity = normalizedCity.slice(normalizedCountry.length)
  }
  const zh = [normalizedCountry, normalizedCity].filter(Boolean).join('')
  return escapeHtml(zh || '-')
}

function normalizeSearchText(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeCountryText(value) {
  return normalizeSearchText(value).replace(/\d+/g, '').replace(/[().]/g, '').trim()
}

function getSchoolCountryFields(school) {
  return [school.country_zh, school.country_en].map(normalizeCountryText).filter(Boolean)
}

function schoolCountryMatchesAliases(school, aliases) {
  const fields = getSchoolCountryFields(school)
  return aliases.some((alias) => {
    const needle = normalizeSearchText(alias)
    return needle && fields.some((field) => field.includes(needle))
  })
}

function getSchoolRegionBucket(school) {
  const orderedBuckets = ['hong_kong', 'singapore', 'uk', 'usa', 'australia', 'malaysia']
  for (const bucket of orderedBuckets) {
    if (schoolCountryMatchesAliases(school, REGION_BUCKET_ALIASES[bucket] || [])) return bucket
  }
  if (schoolCountryMatchesAliases(school, EUROPE_ALIASES)) return 'europe'
  return 'other'
}

function schoolMatchesRegion(school, region) {
  if (!region || region === 'all') return true
  return getSchoolRegionBucket(school) === region
}

function sliceExplorerItems(items, page, pageSize) {
  const safeItems = Array.isArray(items) ? items : []
  const offset = Math.max(0, (page - 1) * pageSize)
  return {
    items: safeItems.slice(offset, offset + pageSize),
    total: safeItems.length
  }
}

function getExplorerFilters() {
  return {
    region: explorerRegion,
    ranking: explorerRanking
  }
}

function syncFilterChipState(container, attrName, activeValue) {
  if (!container) return
  container.querySelectorAll(`.school-filter-chip[data-${attrName}]`).forEach((button) => {
    const isActive = button.dataset[attrName] === activeValue
    button.classList.toggle('is-active', isActive)
    button.setAttribute('aria-pressed', String(isActive))
  })
}

function schoolMatchesKeyword(school, keyword) {
  const kw = normalizeSearchText(keyword)
  if (!kw) return true
  const fields = [
    school.school_name_zh,
    school.school_name_en,
    school.short_name,
    school.country_zh,
    school.country_en,
    school.city_zh,
    school.city_en
  ]
  return fields.some((field) => normalizeSearchText(field).includes(kw))
}

async function searchSchoolsFallback(keyword) {
  if (!window.api?.schoolsList) return { items: [], total: 0, error: t('uniDb.noData') }
  const res = await window.api.schoolsList(1, 1000, getExplorerFilters())
  const { items = [], error } = res || {}
  if (error) return { items: [], total: 0, error }
  const filtered = items.filter((school) => schoolMatchesKeyword(school, keyword) && schoolMatchesRegion(school, explorerRegion))
  return { items: filtered, total: filtered.length }
}

function renderSchoolCard(school, container, onClick) {
  const card = document.createElement('div')
  card.className = 'school-card'
  card.dataset.schoolId = school.school_id
  const fav = isFavorite(school.school_id)
  card.innerHTML = `
    <div class="school-card-main" ${onClick ? 'role="button" tabindex="0"' : ''}>
      <img class="school-card-logo" alt="" src="" loading="lazy">
      <div class="school-card-names">
        <span class="school-card-name-zh">${escapeHtml(school.school_name_zh || '')}</span>
        <span class="school-card-name-en">${escapeHtml(stripChineseAliasSuffixFromEnglishName(school.school_name_en || ''))}</span>
      </div>
      <div class="school-card-meta-block school-card-meta-block-location">
        <span class="school-card-meta-label">${t('uniDb.locationLabel')}</span>
        <span class="school-card-meta-value school-card-meta-location">${formatLocationZh(school.country_zh, school.city_zh)}</span>
      </div>
      <div class="school-card-meta-block school-card-meta-block-qs">
        <span class="school-card-meta-label">QS</span>
        <span class="school-card-meta-value school-card-meta-qs">${school.ranking_qs || '-'}</span>
      </div>
      ${getFavoriteStarMarkup(school.school_id, fav)}
    </div>
  `
  const logoImg = card.querySelector('.school-card-logo')
  if (logoImg && school.logo_filename && school.ranking_qs) {
    getSchoolAssetDataUrl(school.ranking_qs, school.logo_filename).then((dataUrl) => {
      if (dataUrl && logoImg.isConnected) logoImg.src = dataUrl
    }).catch(() => {})
  }
  bindFavoriteStar(card.querySelector('.school-card-star'), school.school_id, () => {
    if (container.closest('#school-list-target')) loadSchoolListTarget()
  })
  if (onClick) {
    const main = card.querySelector('.school-card-main')
    main.addEventListener('click', () => { main.blur(); onClick(school) })
    main.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); main.blur(); onClick(school) } })
  }
  decorateFireflyHost(card, 'dark-hover')
  container.appendChild(card)
}

function resetSchoolViewScroll() {
  const mainContent = document.querySelector('.main-content')
  const applyReset = () => { if (mainContent) mainContent.scrollTop = 0; if (detailBody) detailBody.scrollTop = 0 }
  applyReset()
  requestAnimationFrame(() => { applyReset(); requestAnimationFrame(applyReset) })
}

function openLightbox(url) {
  if (lightboxImg) lightboxImg.src = url
  if (lightbox) lightbox.classList.add('active')
}

function closeLightbox() {
  if (lightbox) lightbox.classList.remove('active')
}

function updateCarousel() {
  const imgs = carouselTrack.querySelectorAll('img')
  const wrap = document.getElementById('school-detail-carousel-wrap')
  if (wrap) wrap.style.display = imgs.length > 0 ? '' : 'none'
  if (imgs.length === 4 && !carouselTrack.dataset.duplicated) {
    carouselTrack.dataset.duplicated = '1'
    carouselTrack.classList.add('carousel-animate')
    const urls = Array.from(imgs).map((img) => img.src)
    urls.forEach((url) => {
      const img = document.createElement('img')
      img.src = url; img.alt = ''
      img.addEventListener('click', () => openLightbox(url))
      carouselTrack.appendChild(img)
    })
  }
  if (imgs.length < 4) carouselTrack.classList.remove('carousel-animate')
}

export function openSchoolDetail(school, fromPage) {
  if (fromPage) detailBackPage = fromPage
  currentDetailSchool = school
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  resetSchoolViewScroll()
  if (overlay) {
    cancelPanelSlideClose(overlay)
    overlay.classList.remove('is-closing')
    overlay.classList.add('active')
  }
  document.body.classList.add('school-detail-open')
  requestAnimationFrame(() => resetSchoolViewScroll())

  titleEl.textContent = school.school_name_zh || stripChineseAliasSuffixFromEnglishName(school.school_name_en || '') || ''
  const fav = isFavorite(school.school_id)
  starBtn.classList.toggle('favorited', fav)

  const rq = school.ranking_qs
  heroBg.style.backgroundImage = ''
  if (rq) {
    getSchoolAssetDataUrl(rq, '1.jpg').then((dataUrl) => {
      if (dataUrl && currentDetailSchool?.school_id === school.school_id) {
        heroBg.style.backgroundImage = `url(${dataUrl})`
      }
    }).catch(() => {})
  }
  if (school.logo_filename && rq) {
    logoEl.style.display = ''
    getSchoolAssetDataUrl(rq, school.logo_filename).then((dataUrl) => {
      if (dataUrl && currentDetailSchool?.school_id === school.school_id) {
        logoEl.src = dataUrl
      }
    }).catch(() => {})
  } else {
    logoEl.style.display = 'none'
  }

  nameEl.textContent = school.school_name_zh || stripChineseAliasSuffixFromEnglishName(school.school_name_en || '') || ''
  metaEl.textContent = [school.country_zh, school.city_zh, `QS #${school.ranking_qs || '-'}`].filter(Boolean).join(' · ')
  loadSchoolPrograms(school)
  loadRelatedCases(school)

  if (window.api.schoolsGetIntro) {
    window.api.schoolsGetIntro(rq).then((intro) => {
      if (intro && intro.intro && intro.intro.zh) {
        let html = '<div class="school-detail-section-block">'
        html += `<h3 class="school-detail-section-title">${t('schoolDetail.intro')}</h3>`
        html += intro.intro.zh.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
        if (intro.intro.en && intro.intro.en.length) html += intro.intro.en.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
        html += '</div>'
        if (intro.contact) {
          html += '<div class="school-detail-section-block">'
          html += `<h3 class="school-detail-section-title">${t('schoolDetail.contact')}</h3>`
          html += `<p class="school-detail-contact"><a href="${escapeHtml(intro.contact)}" target="_blank" rel="noopener">${escapeHtml(intro.contact)}</a></p>`
          html += '</div>'
        }
        if (intro.address && (intro.address.zh || intro.address.en)) {
          html += '<div class="school-detail-section-block">'
          html += `<h3 class="school-detail-section-title">${t('schoolDetail.address')}</h3>`
          const zh = intro.address.zh ? escapeHtml(intro.address.zh) : ''
          const en = intro.address.en ? escapeHtml(intro.address.en) : ''
          html += '<p class="school-detail-address">'
          if (zh) html += zh; if (zh && en) html += '<br>'; if (en) html += en
          html += '</p></div>'
        }
        introEl.innerHTML = html
      } else introEl.innerHTML = `<p class="placeholder-hint">${t('schoolDetail.noIntro')}</p>`
    })
  } else introEl.innerHTML = ''

  carouselTrack.innerHTML = ''
  delete carouselTrack.dataset.duplicated
  carouselTrack.classList.remove('carousel-animate')
  if (rq) {
    let loadedCount = 0
    for (let i = 2; i <= 5; i++) {
      const filename = `${i}.jpg`
      const img = document.createElement('img')
      img.alt = ''
      img.addEventListener('click', () => {
        if (img.src) openLightbox(img.src)
      })
      img.addEventListener('load', () => { loadedCount++; if (loadedCount > 0) updateCarousel() })
      img.addEventListener('error', () => img.remove())
      carouselTrack.appendChild(img)
      getSchoolAssetDataUrl(rq, filename).then((dataUrl) => {
        if (dataUrl && currentDetailSchool?.school_id === school.school_id && img.isConnected) {
          img.src = dataUrl
        } else if (!dataUrl && img.isConnected) {
          img.remove()
        }
      }).catch(() => {
        if (img.isConnected) img.remove()
      })
    }
  }
}

export function closeSchoolDetail() {
  if (!overlay?.classList.contains('active')) return
  closeLightbox()
  void runPanelSlideClose(overlay, () => {
    document.body.classList.remove('school-detail-open')
    resetSchoolViewScroll()
  })
}

export async function loadSchoolListExplorer() {
  const grid = document.getElementById('school-list-explorer-grid')
  const paginationEl = document.getElementById('school-list-explorer-pagination')
  const listContainer = document.getElementById('school-list-explorer')
  if (!grid || !paginationEl) return

  await runContentFadeTransition(listContainer, async () => {
  grid.innerHTML = ''
  paginationEl.innerHTML = ''

  const canSearch = !!window.api?.schoolsSearch
  const canList = !!window.api?.schoolsList
  if (!canList && !canSearch) {
    grid.innerHTML = `<p class="placeholder-hint">${escapeHtml(t('uniDb.noData'))}</p>`
    return
  }

  renderSkeletonCards(grid, PAGE_SIZE)

  try {
    const kw = explorerKeyword.trim()
    const filters = getExplorerFilters()
    const needsClientRegionFiltering = explorerRegion !== 'all'
    let res
    if (kw && canSearch) {
      if (needsClientRegionFiltering) {
        const fullRes = await window.api.schoolsSearch(kw, 1, 1000, filters)
        const { items = [], error } = fullRes || {}
        if (error) res = { items: [], total: 0, error }
        else res = sliceExplorerItems(items.filter((school) => schoolMatchesRegion(school, explorerRegion)), explorerPage, PAGE_SIZE)
      } else {
        res = await window.api.schoolsSearch(kw, explorerPage, PAGE_SIZE, filters)
      }
    } else if (kw) {
      const fallbackRes = await searchSchoolsFallback(kw)
      const offset = Math.max(0, (explorerPage - 1) * PAGE_SIZE)
      res = {
        ...fallbackRes,
        items: fallbackRes.items.slice(offset, offset + PAGE_SIZE)
      }
    } else {
      if (needsClientRegionFiltering) {
        const fullRes = await window.api.schoolsList(1, 1000, filters)
        const { items = [], error } = fullRes || {}
        if (error) res = { items: [], total: 0, error }
        else res = sliceExplorerItems(items.filter((school) => schoolMatchesRegion(school, explorerRegion)), explorerPage, PAGE_SIZE)
      } else {
        res = await window.api.schoolsList(explorerPage, PAGE_SIZE, filters)
      }
    }
    grid.innerHTML = ''
    const { items = [], total = 0, error } = res || {}
    if (error) { grid.innerHTML = `<p class="placeholder-hint">${escapeHtml(error)}</p>`; return }
    explorerTotal = total

    if (items.length === 0) {
      grid.innerHTML = `<div class="school-list-empty"><p class="placeholder-text">${escapeHtml(t('uniDb.noMatch'))}</p><p class="placeholder-hint">${escapeHtml(t('uniDb.noMatchHint'))}</p></div>`
      return
    }

    items.forEach((school) => renderSchoolCard(school, grid, (s) => openSchoolDetail(s, 'university-database')))

    const totalPages = Math.ceil(total / PAGE_SIZE) || 1
    const prev = document.createElement('button')
    prev.className = 'pagination-btn pagination-prev'; prev.innerHTML = '‹'; prev.title = t('uniDb.prevPage'); prev.disabled = explorerPage <= 1
    prev.addEventListener('click', () => { if (explorerPage > 1) { explorerPage--; loadSchoolListExplorer() } })
    const next = document.createElement('button')
    next.className = 'pagination-btn pagination-next'; next.innerHTML = '›'; next.title = t('uniDb.nextPage'); next.disabled = explorerPage >= totalPages
    next.addEventListener('click', () => { if (explorerPage < totalPages) { explorerPage++; loadSchoolListExplorer() } })
    const info = document.createElement('span')
    info.className = 'pagination-info'; info.textContent = t('uniDb.pagination', explorerPage, totalPages, total)
    paginationEl.appendChild(prev); paginationEl.appendChild(info); paginationEl.appendChild(next)
  } catch (err) {
    console.error('loadSchoolListExplorer:', err)
    grid.innerHTML = `<p class="placeholder-hint">${escapeHtml(t('uniDb.loadFail', err?.message || t('uniDb.refreshRetry')))}</p>`
  }
  })
}

export async function loadSchoolListTarget() {
  const grid = document.getElementById('school-list-target-grid')
  const emptyEl = document.getElementById('school-list-target-empty')
  if (!grid || !emptyEl) return

  grid.innerHTML = ''
  const ids = getTargetSchools()
  emptyEl.style.display = ids.length ? 'none' : 'flex'
  if (ids.length === 0) return

  let schools = []
  if (window.api?.schoolsGetByIds) {
    try { schools = await window.api.schoolsGetByIds(ids) || [] } catch (_) {}
  } else if (window.api?.schoolsGetById) {
    for (const id of ids) {
      try { const school = await window.api.schoolsGetById(id); if (school) schools.push(school) } catch (_) {}
    }
  }
  schools.sort((a, b) => (a.ranking_qs || 999) - (b.ranking_qs || 999))
  schools.forEach((school) => renderSchoolCard(school, grid, (s) => openSchoolDetail(s, 'target-universities')))
}

function createParticleBurst(container, x, y, count = 24) {
  const isDark = getTheme() === 'dark'
  const colors = isDark
    ? ['#ffe066', '#fff176', '#a6e3a1', '#f9e2af', '#fab387']
    : ['#62c492', '#a8e4c8', '#c5f0dc', '#a6e3a1', '#f9e2af']
  const particles = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const dist = 60 + Math.random() * 80
    const tx = Math.cos(angle) * dist; const ty = Math.sin(angle) * dist
    const p = document.createElement('div')
    p.className = 'logo-particle'
    p.style.left = x + 'px'; p.style.top = y + 'px'
    p.style.background = colors[Math.floor(Math.random() * colors.length)]
    p.style.setProperty('--particle-end', `translate(${tx}px, ${ty}px)`)
    p.style.animationDelay = Math.random() * 0.1 + 's'
    container.appendChild(p); particles.push(p)
  }
  setTimeout(() => particles.forEach(p => p.remove()), 700)
}

export function initSchools() {
  setTargetSchools(getTargetSchools())

  overlay = document.getElementById('school-detail-overlay')
  backBtn = document.getElementById('school-detail-back')
  titleEl = document.getElementById('school-detail-title')
  starBtn = document.getElementById('school-detail-star')
  heroBg = document.getElementById('school-detail-hero-bg')
  logoEl = document.getElementById('school-detail-logo')
  nameEl = document.getElementById('school-detail-name')
  metaEl = document.getElementById('school-detail-meta')
  introEl = document.getElementById('school-detail-intro')
  programsEl = document.getElementById('school-detail-programs')
  relatedCasesEl = document.getElementById('school-detail-related-cases')
  detailBody = overlay?.querySelector('.school-detail-body')
  carouselTrack = document.getElementById('school-detail-carousel-track')
  lightbox = document.getElementById('school-detail-lightbox')
  lightboxImg = document.getElementById('school-detail-lightbox-img')
  lightboxClose = document.getElementById('school-detail-lightbox-close')

  carouselTrack?.addEventListener('mouseenter', () => carouselTrack.classList.add('carousel-paused'))
  carouselTrack?.addEventListener('mouseleave', () => carouselTrack.classList.remove('carousel-paused'))

  lightboxClose?.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox() })
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox() })
  lightboxImg?.addEventListener('click', (e) => e.stopPropagation())

  backBtn?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeSchoolDetail() })
  backBtn?.addEventListener('mousedown', (e) => e.stopPropagation())

  starBtn?.addEventListener('click', () => {
    if (!currentDetailSchool) return
    const nowFav = toggleFavorite(currentDetailSchool.school_id)
    starBtn.classList.toggle('favorited', nowFav)
  })

  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeSchoolDetail() })

  const searchInput = document.getElementById('school-search-input')
  const searchClearBtn = document.getElementById('school-search-clear')
  const searchBar = document.getElementById('school-search-bar')
  const regionFilters = document.getElementById('school-region-filters')
  const rankingFilters = document.getElementById('school-ranking-filters')
  if (searchInput) {
    const refreshSearchUiState = () => {
      if (!searchBar) return
      searchBar.classList.toggle('has-value', !!searchInput.value.trim())
    }

    searchInput.addEventListener('input', () => {
      refreshSearchUiState()
      if (explorerSearchTimer) clearTimeout(explorerSearchTimer)
      explorerSearchTimer = setTimeout(() => {
        explorerKeyword = searchInput.value
        explorerPage = 1
        loadSchoolListExplorer()
      }, 300)
    })

    searchClearBtn?.addEventListener('click', () => {
      if (!searchInput.value) return
      searchInput.value = ''
      refreshSearchUiState()
      if (explorerSearchTimer) clearTimeout(explorerSearchTimer)
      explorerKeyword = ''
      explorerPage = 1
      loadSchoolListExplorer()
      searchInput.focus()
    })

    refreshSearchUiState()
  }

  regionFilters?.querySelectorAll('.school-filter-chip[data-region]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextRegion = button.dataset.region || 'all'
      if (nextRegion === explorerRegion) return
      explorerRegion = nextRegion
      explorerPage = 1
      syncFilterChipState(regionFilters, 'region', explorerRegion)
      loadSchoolListExplorer()
    })
  })

  rankingFilters?.querySelectorAll('.school-filter-chip[data-ranking]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('is-disabled')) return
      const nextRanking = button.dataset.ranking || 'qs'
      if (nextRanking === explorerRanking) return
      explorerRanking = nextRanking
      explorerPage = 1
      syncFilterChipState(rankingFilters, 'ranking', explorerRanking)
      loadSchoolListExplorer()
    })
  })

  syncFilterChipState(regionFilters, 'region', explorerRegion)
  syncFilterChipState(rankingFilters, 'ranking', explorerRanking)

  const logoWrap = document.querySelector('.sidebar-logo-wrap')
  const logoHi = document.querySelector('.sidebar-logo-hi')
  if (logoWrap && logoHi) {
    logoWrap.addEventListener('mousedown', () => {
      if (!logoWrap.matches(':hover') || logoWrap.classList.contains('hi-suppressed')) return
      const rect = logoHi.getBoundingClientRect()
      const wrapRect = logoWrap.getBoundingClientRect()
      const cx = rect.left - wrapRect.left + rect.width / 2
      const cy = rect.top - wrapRect.top + rect.height / 2
      logoWrap.classList.add('hi-suppressed', 'hi-hiding')
      createParticleBurst(logoWrap, cx - 6, cy - 6)
      setTimeout(() => logoWrap.classList.remove('hi-hiding'), 700)
    })
    logoWrap.addEventListener('mouseleave', () => logoWrap.classList.remove('hi-suppressed'))
  }

  const featureIntroCarouselTrack = document.getElementById('feature-intro-carousel-track')
  if (featureIntroCarouselTrack && !featureIntroCarouselTrack.dataset.initialized) {
    const imgs = Array.from(featureIntroCarouselTrack.querySelectorAll('img'))
    if (imgs.length > 0) {
      const fragment = document.createDocumentFragment()
      imgs.forEach((img) => fragment.appendChild(img.cloneNode(true)))
      featureIntroCarouselTrack.appendChild(fragment)
      featureIntroCarouselTrack.dataset.initialized = '1'
      if (imgs.length > 1) featureIntroCarouselTrack.classList.add('carousel-animate')
    }
    featureIntroCarouselTrack.addEventListener('mouseenter', () => featureIntroCarouselTrack.classList.add('carousel-paused'))
    featureIntroCarouselTrack.addEventListener('mouseleave', () => featureIntroCarouselTrack.classList.remove('carousel-paused'))
  }
}

export function getOverlay() { return overlay }

export function handleGlobalEscape() {
  if (lightbox?.classList.contains('active')) closeLightbox()
  else if (overlay?.classList.contains('active')) closeSchoolDetail()
}
