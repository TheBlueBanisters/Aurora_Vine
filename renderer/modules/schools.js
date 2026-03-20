import { escapeHtml, formatBilingual } from './utils.js'
import { PAGE_SIZE } from './state.js'
import { isFavorite, toggleFavorite, getTargetSchools } from './storage.js'
import { getTheme } from './theme.js'

let explorerPage = 1
let explorerTotal = 0
let detailBackPage = 'university-explorer'
let currentDetailSchool = null
const schoolAssetDataUrlCache = new Map()

let overlay, backBtn, titleEl, starBtn, heroBg, logoEl, nameEl, metaEl, introEl, detailBody, carouselTrack
let lightbox, lightboxImg, lightboxClose

async function getSchoolAssetDataUrl(rankingQs, filename) {
  if (!rankingQs || !filename || !window.api?.schoolsGetAssetDataUrl) return null
  const cacheKey = `${rankingQs}:${filename}`
  if (schoolAssetDataUrlCache.has(cacheKey)) return schoolAssetDataUrlCache.get(cacheKey)
  const res = await window.api.schoolsGetAssetDataUrl(rankingQs, filename)
  const dataUrl = res?.dataUrl || null
  if (dataUrl) schoolAssetDataUrlCache.set(cacheKey, dataUrl)
  return dataUrl
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
        <span class="school-card-name-en">${escapeHtml(school.school_name_en || '')}</span>
      </div>
      <div class="school-card-meta-block">
        <span class="school-card-meta-label">国家 (Country)</span>
        <span class="school-card-meta-value school-card-meta-bilingual">${formatBilingual(school.country_zh, school.country_en)}</span>
      </div>
      <div class="school-card-meta-block">
        <span class="school-card-meta-label">城市 (City)</span>
        <span class="school-card-meta-value school-card-meta-bilingual">${formatBilingual(school.city_zh, school.city_en)}</span>
      </div>
      <div class="school-card-meta-block">
        <span class="school-card-meta-label">QS</span>
        <span class="school-card-meta-value school-card-meta-qs">${school.ranking_qs || '-'}</span>
      </div>
      <button class="school-card-star ${fav ? 'favorited' : ''}" data-school-id="${school.school_id}" title="${fav ? '取消收藏' : '收藏'}" aria-label="${fav ? '取消收藏' : '收藏'}">
        <svg class="star-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <svg class="star-filled" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
      </button>
    </div>
  `
  const logoImg = card.querySelector('.school-card-logo')
  if (logoImg && school.logo_filename && school.ranking_qs) {
    getSchoolAssetDataUrl(school.ranking_qs, school.logo_filename).then((dataUrl) => {
      if (dataUrl && logoImg.isConnected) logoImg.src = dataUrl
    }).catch(() => {})
  }
  const starBtnEl = card.querySelector('.school-card-star')
  starBtnEl.addEventListener('click', (e) => {
    e.stopPropagation()
    const nowFav = toggleFavorite(school.school_id)
    starBtnEl.classList.toggle('favorited', nowFav)
    starBtnEl.title = nowFav ? '取消收藏' : '收藏'
    if (container.closest('#school-list-target')) loadSchoolListTarget()
  })
  if (onClick) {
    const main = card.querySelector('.school-card-main')
    main.addEventListener('click', () => { main.blur(); onClick(school) })
    main.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); main.blur(); onClick(school) } })
  }
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

function openSchoolDetail(school, fromPage) {
  if (fromPage) detailBackPage = fromPage
  currentDetailSchool = school
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  resetSchoolViewScroll()
  overlay.classList.add('active')
  document.body.classList.add('school-detail-open')
  requestAnimationFrame(() => resetSchoolViewScroll())

  titleEl.textContent = school.school_name_zh || school.school_name_en || ''
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

  nameEl.textContent = school.school_name_zh || school.school_name_en || ''
  metaEl.textContent = [school.country_zh, school.city_zh, `QS #${school.ranking_qs || '-'}`].filter(Boolean).join(' · ')

  if (window.api.schoolsGetIntro) {
    window.api.schoolsGetIntro(rq).then((intro) => {
      if (intro && intro.intro && intro.intro.zh) {
        let html = '<div class="school-detail-section-block">'
        html += '<h3 class="school-detail-section-title">院校简介 (School Introduction)</h3>'
        html += intro.intro.zh.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
        if (intro.intro.en && intro.intro.en.length) html += intro.intro.en.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
        html += '</div>'
        if (intro.contact) {
          html += '<div class="school-detail-section-block">'
          html += '<h3 class="school-detail-section-title">联系方式 (Contact)</h3>'
          html += `<p class="school-detail-contact"><a href="${escapeHtml(intro.contact)}" target="_blank" rel="noopener">${escapeHtml(intro.contact)}</a></p>`
          html += '</div>'
        }
        if (intro.address && (intro.address.zh || intro.address.en)) {
          html += '<div class="school-detail-section-block">'
          html += '<h3 class="school-detail-section-title">院校地址 (Address)</h3>'
          const zh = intro.address.zh ? escapeHtml(intro.address.zh) : ''
          const en = intro.address.en ? escapeHtml(intro.address.en) : ''
          html += '<p class="school-detail-address">'
          if (zh) html += zh; if (zh && en) html += '<br>'; if (en) html += en
          html += '</p></div>'
        }
        introEl.innerHTML = html
      } else introEl.innerHTML = '<p class="placeholder-hint">暂无院校介绍</p>'
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
  closeLightbox()
  overlay.classList.remove('active')
  document.body.classList.remove('school-detail-open')
  resetSchoolViewScroll()
  if (detailBackPage === 'university-explorer') loadSchoolListExplorer()
  if (detailBackPage === 'target-universities') loadSchoolListTarget()
}

export async function loadSchoolListExplorer() {
  const grid = document.getElementById('school-list-explorer-grid')
  const paginationEl = document.getElementById('school-list-explorer-pagination')
  if (!grid || !paginationEl) return

  grid.innerHTML = ''
  paginationEl.innerHTML = ''

  if (!window.api?.schoolsList) {
    grid.innerHTML = '<p class="placeholder-hint">无法加载院校数据</p>'
    return
  }

  try {
    const res = await window.api.schoolsList(explorerPage, PAGE_SIZE)
    const { items = [], total = 0, error } = res || {}
    if (error) { grid.innerHTML = `<p class="placeholder-hint">${escapeHtml(error)}</p>`; return }
    explorerTotal = total

    items.forEach((school) => renderSchoolCard(school, grid, (s) => openSchoolDetail(s, 'university-explorer')))

    const totalPages = Math.ceil(total / PAGE_SIZE) || 1
    const prev = document.createElement('button')
    prev.className = 'pagination-btn pagination-prev'; prev.innerHTML = '‹'; prev.title = '上一页'; prev.disabled = explorerPage <= 1
    prev.addEventListener('click', () => { if (explorerPage > 1) { explorerPage--; loadSchoolListExplorer() } })
    const next = document.createElement('button')
    next.className = 'pagination-btn pagination-next'; next.innerHTML = '›'; next.title = '下一页'; next.disabled = explorerPage >= totalPages
    next.addEventListener('click', () => { if (explorerPage < totalPages) { explorerPage++; loadSchoolListExplorer() } })
    const info = document.createElement('span')
    info.className = 'pagination-info'; info.textContent = `第 ${explorerPage} / ${totalPages} 页，共 ${total} 所院校`
    paginationEl.appendChild(prev); paginationEl.appendChild(info); paginationEl.appendChild(next)
  } catch (err) {
    console.error('loadSchoolListExplorer:', err)
    grid.innerHTML = `<p class="placeholder-hint">加载失败：${escapeHtml(err?.message || '请刷新重试')}</p>`
  }
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
    ? ['#89b4fa', '#b4befe', '#a6e3a1', '#f9e2af', '#fab387']
    : ['#89b4fa', '#cdd6f4', '#b4befe', '#a6e3a1', '#f9e2af']
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
  overlay = document.getElementById('school-detail-overlay')
  backBtn = document.getElementById('school-detail-back')
  titleEl = document.getElementById('school-detail-title')
  starBtn = document.getElementById('school-detail-star')
  heroBg = document.getElementById('school-detail-hero-bg')
  logoEl = document.getElementById('school-detail-logo')
  nameEl = document.getElementById('school-detail-name')
  metaEl = document.getElementById('school-detail-meta')
  introEl = document.getElementById('school-detail-intro')
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
