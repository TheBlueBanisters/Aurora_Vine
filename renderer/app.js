document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pages = document.querySelectorAll('.page');
  const logoWrap = document.querySelector('.sidebar-logo-wrap');
  const logoHi = document.querySelector('.sidebar-logo-hi');
  const sidebarLogo = document.querySelector('.sidebar-logo');

  const TARGET_SCHOOLS_KEY = 'targetSchools';
  const SCHOOL_PLANNING_PROFILE_KEY = 'schoolPlanningProfile';
  const THEME_KEY = 'theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : '';
    if (sidebarLogo) {
      if (isDark) {
        sidebarLogo.src = '../image/logo_n.png';
        sidebarLogo.onerror = function () {
          this.onerror = null;
          this.src = '../image/logo.png';
        };
      } else {
        sidebarLogo.src = '../image/logo.png';
        sidebarLogo.onerror = null;
      }
    }
    if (window.api?.themeApply) {
      window.api.themeApply(theme);
    }
  }

  function initTheme() {
    const theme = getTheme();
    applyTheme(theme);
    const toggle = document.getElementById('night-mode-toggle');
    if (toggle) {
      toggle.checked = theme === 'dark';
      toggle.removeEventListener('change', onNightModeChange);
      toggle.addEventListener('change', onNightModeChange);
    }
  }

  function onNightModeChange() {
    const toggle = document.getElementById('night-mode-toggle');
    const theme = toggle?.checked ? 'dark' : 'light';
    setTheme(theme);
    applyTheme(theme);
  }

  initTheme();

  const PAGE_SIZE = 10;

  function getSchoolPlanningProfile() {
    try {
      const raw = localStorage.getItem(SCHOOL_PLANNING_PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setSchoolPlanningProfile(data) {
    localStorage.setItem(SCHOOL_PLANNING_PROFILE_KEY, JSON.stringify(data));
  }

  function getTargetSchools() {
    try {
      const raw = localStorage.getItem(TARGET_SCHOOLS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function setTargetSchools(ids) {
    localStorage.setItem(TARGET_SCHOOLS_KEY, JSON.stringify(ids));
  }

  function toggleFavorite(schoolId) {
    const ids = getTargetSchools();
    const idx = ids.indexOf(schoolId);
    if (idx >= 0) ids.splice(idx, 1);
    else ids.push(schoolId);
    setTargetSchools(ids);
    return ids.includes(schoolId);
  }

  function isFavorite(schoolId) {
    return getTargetSchools().includes(schoolId);
  }

  function createParticleBurst(container, x, y, count = 24) {
    const isDark = getTheme() === 'dark';
    const colors = isDark
      ? ['#89b4fa', '#b4befe', '#a6e3a1', '#f9e2af', '#fab387']
      : ['#89b4fa', '#cdd6f4', '#b4befe', '#a6e3a1', '#f9e2af'];
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 60 + Math.random() * 80;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const p = document.createElement('div');
      p.className = 'logo-particle';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.setProperty('--particle-end', `translate(${tx}px, ${ty}px)`);
      p.style.animationDelay = Math.random() * 0.1 + 's';
      container.appendChild(p);
      particles.push(p);
    }
    setTimeout(() => particles.forEach(p => p.remove()), 700);
  }

  if (logoWrap && logoHi) {
    logoWrap.addEventListener('mousedown', (e) => {
      if (!logoWrap.matches(':hover') || logoWrap.classList.contains('hi-suppressed')) return;
      const rect = logoHi.getBoundingClientRect();
      const wrapRect = logoWrap.getBoundingClientRect();
      const cx = rect.left - wrapRect.left + rect.width / 2;
      const cy = rect.top - wrapRect.top + rect.height / 2;
      logoWrap.classList.add('hi-suppressed', 'hi-hiding');
      createParticleBurst(logoWrap, cx - 6, cy - 6);
      setTimeout(() => logoWrap.classList.remove('hi-hiding'), 700);
    });
    logoWrap.addEventListener('mouseleave', () => {
      logoWrap.classList.remove('hi-suppressed');
    });
  }

  function navigateTo(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    const targetPage = document.getElementById(`page-${pageId}`);
    const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);

    if (targetPage) targetPage.classList.add('active');
    if (targetNav) targetNav.classList.add('active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.getAttribute('data-page');
      if (pageId) {
        if (overlay?.classList.contains('active')) closeSchoolDetail();
        navigateTo(pageId);
        if (pageId === 'university-explorer') loadSchoolListExplorer();
        if (pageId === 'target-universities') loadSchoolListTarget();
        if (pageId === 'my-profile') loadMyProfile();
      }
    });
  });

  // ---------- 功能简介轮播 ----------
  const featureIntroCarouselTrack = document.getElementById('feature-intro-carousel-track');

  function initFeatureIntroCarousel() {
    if (!featureIntroCarouselTrack) return;
    if (featureIntroCarouselTrack.dataset.initialized) return;

    const imgs = Array.from(featureIntroCarouselTrack.querySelectorAll('img'));
    if (imgs.length === 0) return;

    const fragment = document.createDocumentFragment();
    imgs.forEach((img) => {
      const clone = img.cloneNode(true);
      fragment.appendChild(clone);
    });
    featureIntroCarouselTrack.appendChild(fragment);
    featureIntroCarouselTrack.dataset.initialized = '1';

    if (imgs.length > 1) {
      featureIntroCarouselTrack.classList.add('carousel-animate');
    }
  }

  featureIntroCarouselTrack?.addEventListener('mouseenter', () => {
    featureIntroCarouselTrack.classList.add('carousel-paused');
  });
  featureIntroCarouselTrack?.addEventListener('mouseleave', () => {
    featureIntroCarouselTrack.classList.remove('carousel-paused');
  });
  initFeatureIntroCarousel();

  // ---------- 院校卡片渲染（横条） ----------
  function renderSchoolCard(school, container, onClick) {
    const card = document.createElement('div');
    card.className = 'school-card';
    card.dataset.schoolId = school.school_id;
    const fav = isFavorite(school.school_id);
    card.innerHTML = `
      <div class="school-card-main" ${onClick ? 'role="button" tabindex="0"' : ''}>
        <img class="school-card-logo" data-ranking="${school.ranking_qs}" alt="" src="">
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
    `;
    const logoImg = card.querySelector('.school-card-logo');
    if (window.api?.schoolsGetAssetPath && school.ranking_qs) {
      window.api.schoolsGetAssetPath(school.ranking_qs, 'logo.svg').then((url) => {
        if (url) logoImg.src = url;
      });
    }
    const starBtn = card.querySelector('.school-card-star');
    starBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(school.school_id);
      starBtn.classList.toggle('favorited', nowFav);
      starBtn.title = nowFav ? '取消收藏' : '收藏';
      if (container.closest('#school-list-target')) loadSchoolListTarget();
    });
    if (onClick) {
      const main = card.querySelector('.school-card-main');
      main.addEventListener('click', () => onClick(school));
      main.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(school);
        }
      });
    }
    container.appendChild(card);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBilingual(zh, en) {
    const z = zh ? escapeHtml(zh) : '';
    const e = en ? escapeHtml(en) : '';
    if (z && e) return z + ' / ' + e;
    return z || e || '-';
  }

  // ---------- 院校大全列表（分页） ----------
  let explorerPage = 1;
  let explorerTotal = 0;

  async function loadSchoolListExplorer() {
    const grid = document.getElementById('school-list-explorer-grid');
    const paginationEl = document.getElementById('school-list-explorer-pagination');
    if (!grid || !paginationEl) return;

    grid.innerHTML = '';
    paginationEl.innerHTML = '';

    if (!window.api || !window.api.schoolsList) {
      grid.innerHTML = '<p class="placeholder-hint">无法加载院校数据</p>';
      return;
    }

    try {
      const res = await window.api.schoolsList(explorerPage, PAGE_SIZE);
      const { items = [], total = 0, error } = res || {};
      if (error) {
        grid.innerHTML = `<p class="placeholder-hint">${escapeHtml(error)}</p>`;
        return;
      }
      explorerTotal = total;

      items.forEach((school) => {
        renderSchoolCard(school, grid, (s) => openSchoolDetail(s, 'university-explorer'));
      });

      const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
      const prev = document.createElement('button');
      prev.className = 'pagination-btn pagination-prev';
      prev.innerHTML = '‹';
      prev.title = '上一页';
      prev.disabled = explorerPage <= 1;
      prev.addEventListener('click', () => {
        if (explorerPage > 1) {
          explorerPage--;
          loadSchoolListExplorer();
        }
      });
      const next = document.createElement('button');
      next.className = 'pagination-btn pagination-next';
      next.innerHTML = '›';
      next.title = '下一页';
      next.disabled = explorerPage >= totalPages;
      next.addEventListener('click', () => {
        if (explorerPage < totalPages) {
          explorerPage++;
          loadSchoolListExplorer();
        }
      });
      const info = document.createElement('span');
      info.className = 'pagination-info';
      info.textContent = `第 ${explorerPage} / ${totalPages} 页，共 ${total} 所院校`;
      paginationEl.appendChild(prev);
      paginationEl.appendChild(info);
      paginationEl.appendChild(next);
    } catch (err) {
      console.error('loadSchoolListExplorer:', err);
      grid.innerHTML = `<p class="placeholder-hint">加载失败：${escapeHtml(err?.message || '请刷新重试')}</p>`;
    }
  }

  // ---------- 目标院校列表（按 QS 升序） ----------
  async function loadSchoolListTarget() {
    const grid = document.getElementById('school-list-target-grid');
    const emptyEl = document.getElementById('school-list-target-empty');
    if (!grid || !emptyEl) return;

    grid.innerHTML = '';
    const ids = getTargetSchools();
    emptyEl.style.display = ids.length ? 'none' : 'flex';

    if (ids.length === 0) return;

    if (!window.api || !window.api.schoolsGetById) return;

    const schools = [];
    for (const id of ids) {
      try {
        const school = await window.api.schoolsGetById(id);
        if (school) schools.push(school);
      } catch (_) {}
    }
    schools.sort((a, b) => (a.ranking_qs || 999) - (b.ranking_qs || 999));
    schools.forEach((school) => renderSchoolCard(school, grid, (s) => openSchoolDetail(s, 'target-universities')));
  }

  // ---------- 院校详情页 ----------
  let detailBackPage = 'university-explorer';
  let currentDetailSchool = null;

  const overlay = document.getElementById('school-detail-overlay');
  const backBtn = document.getElementById('school-detail-back');
  const titleEl = document.getElementById('school-detail-title');
  const starBtn = document.getElementById('school-detail-star');
  const heroBg = document.getElementById('school-detail-hero-bg');
  const logoEl = document.getElementById('school-detail-logo');
  const nameEl = document.getElementById('school-detail-name');
  const metaEl = document.getElementById('school-detail-meta');
  const introEl = document.getElementById('school-detail-intro');
  const carouselTrack = document.getElementById('school-detail-carousel-track');

  function openSchoolDetail(school, fromPage) {
    if (fromPage) detailBackPage = fromPage;
    currentDetailSchool = school;
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;
    overlay.classList.add('active');
    document.body.classList.add('school-detail-open');

    titleEl.textContent = school.school_name_zh || school.school_name_en || '';

    const fav = isFavorite(school.school_id);
    starBtn.classList.toggle('favorited', fav);

    const rq = school.ranking_qs;
    if (window.api.schoolsGetAssetPath) {
      window.api.schoolsGetAssetPath(rq, '1.jpg').then((url) => {
        if (url) heroBg.style.backgroundImage = `url(${url})`;
        else heroBg.style.backgroundImage = '';
      });
      window.api.schoolsGetAssetPath(rq, 'logo.svg').then((url) => {
        if (url) {
          logoEl.src = url;
          logoEl.style.display = '';
        } else logoEl.style.display = 'none';
      });
    }

    nameEl.textContent = school.school_name_zh || school.school_name_en || '';
    metaEl.textContent = [school.country_zh, school.city_zh, `QS #${school.ranking_qs || '-'}`].filter(Boolean).join(' · ');

    if (window.api.schoolsGetIntro) {
      window.api.schoolsGetIntro(rq).then((intro) => {
        if (intro && intro.intro && intro.intro.zh) {
          let html = '<div class="school-detail-section-block">';
          html += '<h3 class="school-detail-section-title">院校简介 (School Introduction)</h3>';
          html += intro.intro.zh.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
          if (intro.intro.en && intro.intro.en.length) {
            html += intro.intro.en.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
          }
          html += '</div>';
          if (intro.contact) {
            html += '<div class="school-detail-section-block">';
            html += '<h3 class="school-detail-section-title">联系方式 (Contact)</h3>';
            html += `<p class="school-detail-contact"><a href="${escapeHtml(intro.contact)}" target="_blank" rel="noopener">${escapeHtml(intro.contact)}</a></p>`;
            html += '</div>';
          }
          if (intro.address && (intro.address.zh || intro.address.en)) {
            html += '<div class="school-detail-section-block">';
            html += '<h3 class="school-detail-section-title">院校地址 (Address)</h3>';
            const zh = intro.address.zh ? escapeHtml(intro.address.zh) : '';
            const en = intro.address.en ? escapeHtml(intro.address.en) : '';
            html += '<p class="school-detail-address">';
            if (zh) html += zh;
            if (zh && en) html += '<br>';
            if (en) html += en;
            html += '</p>';
            html += '</div>';
          }
          introEl.innerHTML = html;
        } else introEl.innerHTML = '<p class="placeholder-hint">暂无院校介绍</p>';
      });
    } else introEl.innerHTML = '';

    carouselTrack.innerHTML = '';
    delete carouselTrack.dataset.duplicated;
    for (let i = 2; i <= 5; i++) {
      const f = `${i}.jpg`;
      window.api.schoolsGetAssetPath(rq, f).then((url) => {
        if (url) {
          const img = document.createElement('img');
          img.src = url;
          img.alt = '';
          img.addEventListener('click', () => openLightbox(url));
          carouselTrack.appendChild(img);
          updateCarousel();
        }
      });
    }
  }

  function updateCarousel() {
    const imgs = carouselTrack.querySelectorAll('img');
    const wrap = document.getElementById('school-detail-carousel-wrap');
    if (wrap) wrap.style.display = imgs.length > 0 ? '' : 'none';
    if (imgs.length === 4 && !carouselTrack.dataset.duplicated) {
      carouselTrack.dataset.duplicated = '1';
      carouselTrack.classList.add('carousel-animate');
      const urls = Array.from(imgs).map((img) => img.src);
      urls.forEach((url) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = '';
        img.addEventListener('click', () => openLightbox(url));
        carouselTrack.appendChild(img);
      });
    }
    if (imgs.length < 4) carouselTrack.classList.remove('carousel-animate');
  }

  carouselTrack?.addEventListener('mouseenter', () => carouselTrack.classList.add('carousel-paused'));
  carouselTrack?.addEventListener('mouseleave', () => carouselTrack.classList.remove('carousel-paused'));

  const lightbox = document.getElementById('school-detail-lightbox');
  const lightboxImg = document.getElementById('school-detail-lightbox-img');
  const lightboxClose = document.getElementById('school-detail-lightbox-close');

  function openLightbox(url) {
    if (lightboxImg) lightboxImg.src = url;
    if (lightbox) lightbox.classList.add('active');
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
  }

  lightboxClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxImg?.addEventListener('click', (e) => e.stopPropagation());

  function closeSchoolDetail() {
    closeLightbox();
    overlay.classList.remove('active');
    document.body.classList.remove('school-detail-open');
    if (detailBackPage === 'university-explorer') loadSchoolListExplorer();
    if (detailBackPage === 'target-universities') loadSchoolListTarget();
  }

  backBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeSchoolDetail();
  });
  backBtn?.addEventListener('mousedown', (e) => e.stopPropagation());

  starBtn?.addEventListener('click', () => {
    if (!currentDetailSchool) return;
    const nowFav = toggleFavorite(currentDetailSchool.school_id);
    starBtn.classList.toggle('favorited', nowFav);
  });

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeSchoolDetail();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (lightbox?.classList.contains('active')) closeLightbox();
    else if (overlay?.classList.contains('active')) closeSchoolDetail();
  });

  // ---------- 我的背景 ----------
  let myProfileChartInstance = null;

  function loadMyProfile() {
    const emptyEl = document.getElementById('my-profile-empty');
    const contentEl = document.getElementById('my-profile-content');
    const infoGrid = document.getElementById('my-profile-info-grid');
    const chartEl = document.getElementById('my-profile-chart');

    if (!emptyEl || !contentEl) return;

    const profile = getSchoolPlanningProfile();
    if (!profile) {
      emptyEl.style.display = 'flex';
      contentEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    contentEl.style.display = '';

    // 渲染基本信息（双语标签）
    const infoItems = [
      { label: '本科毕业年份 / Graduation Year', value: profile.graduationYear },
      { label: '本科院校层次 / Institution Tier', value: profile.institutionTier },
      { label: '本科学校 / School', value: profile.schoolName },
      { label: '本科专业 / Major', value: profile.major },
      { label: '绩点 / GPA', value: profile.gpa ? `${profile.gpa} (${profile.gpaScale === '4' ? '四分制' : '五分制'})` : '-' },
      { label: '绩点前百分比 / GPA Percentile', value: profile.gpaPercentile ? `${profile.gpaPercentile}%` : '-' },
      { label: '雅思 / IELTS', value: profile.ielts != null ? profile.ielts : '无' },
      { label: '托福 / TOEFL', value: profile.toefl != null ? profile.toefl : '无' },
      { label: 'GRE / GRE Writing', value: profile.gre != null ? `${profile.gre} (写作 ${profile.greWriting || '-'})` : '无' },
    ];
    if (infoGrid) {
      infoGrid.innerHTML = infoItems
        .map((item) => `<div class="my-profile-info-item"><span class="my-profile-info-label">${escapeHtml(item.label)}</span><span class="my-profile-info-value">${escapeHtml(String(item.value))}</span></div>`)
        .join('');
    }

    // 计算标化成绩在值域中的百分比，用于 2D 横向条形图
    const chartData = [];
    const labels = [];
    const gpaInverted = [];
    if (profile.gpaPercentile != null && profile.gpaPercentile !== '') {
      const pct = parseFloat(profile.gpaPercentile);
      if (!isNaN(pct) && pct >= 0 && pct <= 100) {
        chartData.push([labels.length, 0, Math.round((100 - pct) * 100) / 100]);
        gpaInverted.push(labels.length);
        labels.push('GPA');
      }
    }
    if (profile.ielts != null && profile.ielts !== '') {
      const score = parseFloat(profile.ielts);
      if (!isNaN(score)) {
        const pct = Math.round(((score - 4) / (9 - 4)) * 100 * 100) / 100;
        chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))]);
        labels.push('雅思 / IELTS');
      }
    }
    if (profile.toefl != null && profile.toefl !== '') {
      const score = parseInt(profile.toefl, 10);
      if (!isNaN(score)) {
        const pct = Math.round(((score - 70) / (120 - 70)) * 100 * 100) / 100;
        chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))]);
        labels.push('托福 / TOEFL');
      }
    }
    if (profile.gre != null && profile.gre !== '') {
      const score = parseInt(profile.gre, 10);
      if (!isNaN(score)) {
        const pct = Math.round(((score - 300) / (340 - 300)) * 100 * 100) / 100;
        chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))]);
        labels.push('GRE');
      }
    }
    if (profile.greWriting != null && profile.greWriting !== '') {
      const score = parseFloat(profile.greWriting);
      if (!isNaN(score)) {
        const pct = Math.round((score / 6) * 100 * 100) / 100;
        chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))]);
        labels.push('GRE写作 / GRE Writing');
      }
    }

    const isDark = getTheme() === 'dark';
    const barColors = isDark
      ? ['#89b4fa', '#74c7ec', '#a6e3a1', '#f9e2af', '#fab387']
      : ['#89b4fa', '#74c7ec', '#a6e3a1', '#f9e2af', '#fab387'];

    // 圆角五角星 SVG（用于柱头，随柱子一起动画）
    const roundedStarSvg = (color) =>
      `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,5 L61,38 L95,38 L68,55 L78,88 L50,72 L22,88 L32,55 L5,38 L39,38 Z" fill="${color}" stroke="${color}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/></svg>`
      )}`;

    const starRich = {};
    barColors.forEach((c, i) => {
      starRich[`star${i}`] = {
        backgroundColor: { image: roundedStarSvg(c) },
        width: 18,
        height: 18,
      };
    });

    // 渲染 2D 横向条形图
    if (chartEl && typeof echarts !== 'undefined') {
      if (chartData.length === 0) {
        if (myProfileChartInstance) {
          myProfileChartInstance.dispose();
          myProfileChartInstance = null;
        }
        chartEl.innerHTML = '<p class="placeholder-hint" style="padding: 40px; text-align: center;">暂无标化成绩数据可展示 / No test score data to display</p>';
      } else {
        chartEl.innerHTML = '';
        if (myProfileChartInstance) myProfileChartInstance.dispose();
        myProfileChartInstance = echarts.init(chartEl, isDark ? 'dark' : null);

        const barData = chartData.map((d, i) => ({
          value: d[2],
          itemStyle: { color: barColors[i % barColors.length] },
        }));

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const idx = params.dataIndex;
              const name = (labels[idx] || '').replace(/\n/g, ' ');
              let rawVal = Number(chartData[idx][2]);
              if (gpaInverted.includes(idx)) rawVal = 100 - rawVal;
              const pct = isNaN(rawVal) ? String(chartData[idx][2]) : rawVal.toFixed(2);
              return `${name}: ${pct}%`;
            },
          },
          grid: { left: 80, right: 60, top: 20, bottom: 20, containLabel: true },
          xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: { formatter: (v) => v + '%' },
          },
          yAxis: {
            type: 'category',
            data: labels,
            axisLabel: { interval: 0 },
            inverse: false,
          },
          series: [
            {
              type: 'bar',
              data: barData,
              barWidth: '50%',
              animation: true,
              animationDuration: 700,
              animationDelay: (idx) => (chartData.length - 1 - idx) * 120,
              label: {
                show: true,
                position: 'right',
                distance: 6,
                formatter: (params) => `{star${params.dataIndex % barColors.length}| }`,
                rich: starRich,
              },
              emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } },
            },
          ],
        };

        myProfileChartInstance.setOption(option);
      }
    }

  }

  document.getElementById('my-profile-go-planning')?.addEventListener('click', () => navigateTo('school-planning'));

  document.getElementById('my-profile-refill')?.addEventListener('click', () => {
    const form = document.getElementById('school-planning-form');
    const thanksView = document.getElementById('school-planning-thanks');
    if (form) form.style.display = '';
    if (thanksView) thanksView.style.display = 'none';
    navigateTo('school-planning');
  });

  // ---------- 定校规划表单 ----------
  function initSchoolPlanningForm() {
    const form = document.getElementById('school-planning-form');
    const thanksView = document.getElementById('school-planning-thanks');
    const submitBtn = document.getElementById('school-planning-submit');
    if (!form || !thanksView || !submitBtn) return;

    const ieltsSelect = document.getElementById('sp-ielts');
    const toeflSelect = document.getElementById('sp-toefl');
    const greSelect = document.getElementById('sp-gre');
    const greWritingSelect = document.getElementById('sp-gre-writing');
    const ieltsNone = document.getElementById('sp-ielts-none');
    const toeflNone = document.getElementById('sp-toefl-none');
    const greNone = document.getElementById('sp-gre-none');

    function populateSelect(select, options, placeholder) {
      if (!select) return;
      select.innerHTML = `<option value="">${placeholder || '请选择 Select'}</option>`;
      options.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = String(v);
        opt.textContent = String(v);
        select.appendChild(opt);
      });
    }

    populateSelect(ieltsSelect, (() => { const a = []; for (let i = 4; i <= 9; i += 0.5) a.push(i.toFixed(1)); return a; })(), '请选择 Select');
    populateSelect(toeflSelect, Array.from({ length: 51 }, (_, i) => 70 + i), '请选择 Select');
    populateSelect(greSelect, Array.from({ length: 41 }, (_, i) => 300 + i), '请选择 Select');
    populateSelect(greWritingSelect, (() => { const a = []; for (let i = 0; i <= 6; i += 0.5) a.push(i.toFixed(1)); return a; })(), '请选择 Select');

    function syncIeltsNone() {
      const checked = ieltsNone?.checked;
      if (ieltsSelect) {
        ieltsSelect.disabled = !!checked;
        if (checked) ieltsSelect.value = '';
      }
    }
    function syncToeflNone() {
      const checked = toeflNone?.checked;
      if (toeflSelect) {
        toeflSelect.disabled = !!checked;
        if (checked) toeflSelect.value = '';
      }
    }
    function syncGreNone() {
      const checked = greNone?.checked;
      if (greSelect) { greSelect.disabled = !!checked; if (checked) greSelect.value = ''; }
      if (greWritingSelect) { greWritingSelect.disabled = !!checked; if (checked) greWritingSelect.value = ''; }
    }

    ieltsNone?.addEventListener('change', syncIeltsNone);
    toeflNone?.addEventListener('change', syncToeflNone);
    greNone?.addEventListener('change', syncGreNone);

    function clearFieldErrors() {
      form.querySelectorAll('.form-field').forEach((f) => {
        f.classList.remove('error');
        const err = f.querySelector('.form-error');
        if (err) err.textContent = '';
      });
    }

    function setFieldError(fieldName, msg) {
      const field = form.querySelector(`[data-field="${fieldName}"]`);
      if (field) {
        field.classList.add('error');
        const err = field.querySelector('.form-error');
        if (err) err.textContent = msg;
      }
    }

    function validateSchoolPlanningForm() {
      clearFieldErrors();
      const errors = [];
      const graduationYear = document.getElementById('sp-graduation-year')?.value?.trim();
      const institutionTier = document.getElementById('sp-institution-tier')?.value?.trim();
      const schoolName = document.getElementById('sp-school-name')?.value?.trim();
      const major = document.getElementById('sp-major')?.value?.trim();
      const gpa = document.getElementById('sp-gpa')?.value?.trim();
      const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value;
      const gpaPercentile = document.getElementById('sp-gpa-percentile')?.value?.trim();

      if (!graduationYear) { setFieldError('graduationYear', '请选择本科毕业年份 / Please select graduation year'); errors.push('graduationYear'); }
      if (!institutionTier) { setFieldError('institutionTier', '请选择本科院校层次 / Please select institution tier'); errors.push('institutionTier'); }
      if (!schoolName) { setFieldError('schoolName', '请输入本科学校名称 / Please enter school name'); errors.push('schoolName'); }
      if (!major) { setFieldError('major', '请输入本科专业 / Please enter major'); errors.push('major'); }
      if (!gpa || isNaN(parseFloat(gpa))) { setFieldError('gpa', '请输入有效绩点 / Please enter valid GPA'); errors.push('gpa'); }
      if (!gpaScale) { setFieldError('gpa', '请选择绩点分制 / Please select GPA scale'); if (!errors.includes('gpa')) errors.push('gpa'); }
      const pct = parseFloat(gpaPercentile);
      if (!gpaPercentile || isNaN(pct) || pct < 0 || pct > 100) {
        setFieldError('gpaPercentile', '请输入0-100之间的数值 / Please enter a value between 0-100');
        errors.push('gpaPercentile');
      }

      if (!ieltsNone?.checked && (!ieltsSelect?.value || ieltsSelect.disabled)) {
        setFieldError('ielts', '请选择雅思分数或勾选无 / Please select IELTS score or check None');
        errors.push('ielts');
      }
      if (!toeflNone?.checked && (!toeflSelect?.value || toeflSelect.disabled)) {
        setFieldError('toefl', '请选择托福分数或勾选无 / Please select TOEFL score or check None');
        errors.push('toefl');
      }
      if (!greNone?.checked) {
        if (!greSelect?.value || greSelect.disabled) {
          setFieldError('gre', '请选择GRE分数或勾选无 / Please select GRE score or check None');
          errors.push('gre');
        } else if (!greWritingSelect?.value || greWritingSelect.disabled) {
          setFieldError('gre', '请选择GRE写作分数 / Please select GRE Writing score');
          if (!errors.includes('gre')) errors.push('gre');
        }
      }

      return { valid: errors.length === 0, errors };
    }

    function collectSchoolPlanningData() {
      const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value;
      const profile = {
        graduationYear: document.getElementById('sp-graduation-year')?.value?.trim() || '',
        institutionTier: document.getElementById('sp-institution-tier')?.value?.trim() || '',
        schoolName: document.getElementById('sp-school-name')?.value?.trim() || '',
        major: document.getElementById('sp-major')?.value?.trim() || '',
        gpa: document.getElementById('sp-gpa')?.value?.trim() || '',
        gpaScale: gpaScale || '',
        gpaPercentile: document.getElementById('sp-gpa-percentile')?.value?.trim() || '',
        ielts: ieltsNone?.checked ? null : (ieltsSelect?.value || null),
        toefl: toeflNone?.checked ? null : (toeflSelect?.value || null),
        gre: greNone?.checked ? null : (greSelect?.value || null),
        greWriting: greNone?.checked ? null : (greWritingSelect?.value || null),
        resumeFile: document.getElementById('sp-resume')?.files?.[0]?.name || null,
      };
      return profile;
    }

    submitBtn.addEventListener('click', () => {
      const { valid } = validateSchoolPlanningForm();
      if (valid) {
        const profile = collectSchoolPlanningData();
        setSchoolPlanningProfile(profile);
        form.style.display = 'none';
        thanksView.style.display = '';
      }
    });

    const refillBtn = document.getElementById('school-planning-refill');
    refillBtn?.addEventListener('click', () => {
      thanksView.style.display = 'none';
      form.style.display = '';
    });
  }

  initSchoolPlanningForm();

  // 初始化：进入院校大全或目标院校时加载
  const activePage = document.querySelector('.page.active');
  if (activePage?.id === 'page-university-explorer') loadSchoolListExplorer();
  if (activePage?.id === 'page-target-universities') loadSchoolListTarget();
});
