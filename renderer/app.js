document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pages = document.querySelectorAll('.page');
  const logoWrap = document.querySelector('.sidebar-logo-wrap');
  const logoHi = document.querySelector('.sidebar-logo-hi');
  const sidebarLogo = document.querySelector('.sidebar-logo');
  let sidebarLogoTransitionToken = 0;
  let sidebarLogoTransitionTimer = null;

  const TARGET_SCHOOLS_KEY = 'targetSchools';
  const SCHOOL_PLANNING_PROFILE_KEY = 'schoolPlanningProfile';
  const THEME_KEY = 'theme';
  const SETTINGS_PROFILE_KEY = 'settingsProfileInfo';
  const SETTINGS_DEFAULT_PROFILE = {
    gender: '未公开',
    phone: '未公开',
    email: '未公开',
    region: '未公开'
  };

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  function transitionSidebarLogo(isDark, animate = true) {
    if (!sidebarLogo) return;
    const darkLogoSrc = '../image/logo_n.png';
    const lightLogoSrc = '../image/logo.png';
    const targetSrc = isDark ? darkLogoSrc : lightLogoSrc;
    const fallbackSrc = lightLogoSrc;
    const currentSrc = sidebarLogo.getAttribute('src') || '';

    if (currentSrc.endsWith(targetSrc.replace('../image/', ''))) {
      return;
    }

    const token = ++sidebarLogoTransitionToken;
    const preload = new Image();
    const LOGO_FADE_DURATION_MS = 360;
    const LOGO_SWAP_HOLD_MS = 90;

    preload.onload = () => {
      if (token !== sidebarLogoTransitionToken) return;

      if (!animate) {
        if (sidebarLogoTransitionTimer) {
          clearTimeout(sidebarLogoTransitionTimer);
          sidebarLogoTransitionTimer = null;
        }
        sidebarLogo.classList.remove('is-fading');
        sidebarLogo.src = targetSrc;
        return;
      }

      if (sidebarLogoTransitionTimer) {
        clearTimeout(sidebarLogoTransitionTimer);
        sidebarLogoTransitionTimer = null;
      }
      sidebarLogo.classList.remove('is-fading');
      // 强制重排以确保快速来回切换时，opacity 过渡能被重新触发。
      void sidebarLogo.offsetWidth;
      sidebarLogo.classList.add('is-fading');

      sidebarLogoTransitionTimer = setTimeout(() => {
        if (token !== sidebarLogoTransitionToken) return;
        sidebarLogo.src = targetSrc;
        sidebarLogoTransitionTimer = setTimeout(() => {
          if (token !== sidebarLogoTransitionToken) return;
          sidebarLogo.classList.remove('is-fading');
          sidebarLogoTransitionTimer = null;
        }, LOGO_SWAP_HOLD_MS);
      }, LOGO_FADE_DURATION_MS);
    };

    preload.onerror = () => {
      if (targetSrc !== fallbackSrc) {
        transitionSidebarLogo(false, animate);
      } else if (token === sidebarLogoTransitionToken) {
        if (sidebarLogoTransitionTimer) {
          clearTimeout(sidebarLogoTransitionTimer);
          sidebarLogoTransitionTimer = null;
        }
        sidebarLogo.classList.remove('is-fading');
      }
    };

    preload.src = targetSrc;
  }

  function applyTheme(theme, options = {}) {
    const { animateLogo = true } = options;
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : '';
    transitionSidebarLogo(isDark, animateLogo);
    if (window.api?.themeApply) {
      window.api.themeApply(theme);
    }
  }

  function initTheme() {
    const theme = getTheme();
    applyTheme(theme, { animateLogo: false });
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
    applyTheme(theme, { animateLogo: true });
  }

  function waitMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const SETTINGS_ANIMATION = {
    fadeOut: 220,
    moveAndCollapse: 320,
    aboutMoveAndCollapse: 460,
    revealSubview: 260,
    showTopActions: 240
  };

  function animateItemMoveByLayout(element, applyLayout, durationMs) {
    if (!element) {
      applyLayout();
      return Promise.resolve();
    }

    const firstTop = element.getBoundingClientRect().top;
    applyLayout();
    const lastTop = element.getBoundingClientRect().top;
    const deltaY = firstTop - lastTop;

    if (Math.abs(deltaY) < 1) {
      return Promise.resolve();
    }

    element.style.transition = 'none';
    element.style.transform = `translateY(${deltaY}px)`;
    void element.offsetHeight;

    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        element.removeEventListener('transitionend', onTransitionEnd);
        element.style.transition = '';
        element.style.transform = '';
        resolve();
      };
      const onTransitionEnd = (event) => {
        if (event.propertyName !== 'transform') return;
        finish();
      };

      element.addEventListener('transitionend', onTransitionEnd);
      requestAnimationFrame(() => {
        element.style.transition = `transform ${durationMs}ms ease`;
        element.style.transform = 'translateY(0)';
      });
      setTimeout(finish, durationMs + 80);
    });
  }

  function getProfileInfo() {
    try {
      const raw = localStorage.getItem(SETTINGS_PROFILE_KEY);
      if (!raw) return { ...SETTINGS_DEFAULT_PROFILE };
      const parsed = JSON.parse(raw);
      return {
        gender: parsed.gender || SETTINGS_DEFAULT_PROFILE.gender,
        phone: parsed.phone || SETTINGS_DEFAULT_PROFILE.phone,
        email: parsed.email || SETTINGS_DEFAULT_PROFILE.email,
        region: parsed.region || SETTINGS_DEFAULT_PROFILE.region
      };
    } catch {
      return { ...SETTINGS_DEFAULT_PROFILE };
    }
  }

  function setProfileInfo(profile) {
    localStorage.setItem(SETTINGS_PROFILE_KEY, JSON.stringify(profile));
  }

  function populateProfileForm(profileForm, profile) {
    if (!profileForm) return;
    profileForm.elements.gender.value = profile.gender;
    profileForm.elements.phone.value = profile.phone;
    profileForm.elements.email.value = profile.email;
    profileForm.elements.region.value = profile.region;
  }

  function collectProfileForm(profileForm) {
    if (!profileForm) return { ...SETTINGS_DEFAULT_PROFILE };
    const normalize = (value, fallback) => {
      const nextValue = String(value || '').trim();
      return nextValue || fallback;
    };
    return {
      gender: normalize(profileForm.elements.gender.value, SETTINGS_DEFAULT_PROFILE.gender),
      phone: normalize(profileForm.elements.phone.value, SETTINGS_DEFAULT_PROFILE.phone),
      email: normalize(profileForm.elements.email.value, SETTINGS_DEFAULT_PROFILE.email),
      region: normalize(profileForm.elements.region.value, SETTINGS_DEFAULT_PROFILE.region)
    };
  }

  function bindSettingsPanel(settingsNodes) {
    const {
      layout,
      mainList,
      backBtn,
      editBtn,
      profileTrigger,
      aboutTrigger,
      profileView,
      aboutView,
      profileForm,
      formActions,
      cancelBtn
    } = settingsNodes;

    if (!layout || !mainList || !backBtn || !editBtn || !profileTrigger || !aboutTrigger || !profileView || !aboutView) {
      return;
    }

    const navItems = [profileTrigger, document.getElementById('settings-night-mode-item'), aboutTrigger].filter(Boolean);
    const subviews = {
      profile: profileView,
      about: aboutView
    };

    let currentRoute = 'main';
    let transitioning = false;
    let profileEditable = false;
    const profileInfo = getProfileInfo();
    populateProfileForm(profileForm, profileInfo);

    function setProfileEditable(editable) {
      profileEditable = editable;
      if (!profileForm) return;
      ['gender', 'phone', 'email', 'region'].forEach((field) => {
        if (profileForm.elements[field]) {
          profileForm.elements[field].disabled = !editable;
        }
      });
      if (formActions) {
        formActions.hidden = !editable;
      }
      editBtn.textContent = '编辑';
    }

    setProfileEditable(false);

    function showActionButton(button) {
      button.hidden = false;
      requestAnimationFrame(() => button.classList.add('is-visible'));
    }

    async function hideActionButton(button) {
      button.classList.remove('is-visible');
      await waitMs(SETTINGS_ANIMATION.showTopActions);
      button.hidden = true;
    }

    function setFadeState(selected) {
      mainList.classList.add('is-fading');
      navItems.forEach(item => {
        item.classList.remove('is-selected', 'is-fading-out', 'is-collapsed');
        if (item === selected) return;
        item.classList.add('is-fading-out');
      });
    }

    function collapseOthers(selected) {
      navItems.forEach(item => {
        if (item === selected) return;
        item.classList.add('is-collapsed');
      });
    }

    function expandAllItems() {
      navItems.forEach(item => item.classList.remove('is-collapsed'));
    }

    function clearFadeState() {
      mainList.classList.remove('is-fading', 'is-focused');
      navItems.forEach(item => item.classList.remove('is-selected', 'is-fading-out', 'is-collapsed'));
    }

    async function openSubView(route, selected) {
      if (transitioning || currentRoute !== 'main') return;
      transitioning = true;
      layout.classList.add('is-transitioning');

      setFadeState(selected);
      await waitMs(SETTINGS_ANIMATION.fadeOut);

      if (route === 'about') {
        await animateItemMoveByLayout(selected, () => {
          selected.classList.add('is-selected');
          mainList.classList.add('is-focused');
          collapseOthers(selected);
        }, SETTINGS_ANIMATION.aboutMoveAndCollapse);
      } else {
        selected.classList.add('is-selected');
        mainList.classList.add('is-focused');
        collapseOthers(selected);
        await waitMs(SETTINGS_ANIMATION.moveAndCollapse);
      }

      const targetView = subviews[route];
      if (targetView) {
        targetView.classList.add('is-visible');
        await waitMs(16);
        targetView.classList.add('is-shown');
      }
      await waitMs(SETTINGS_ANIMATION.revealSubview);

      if (route === 'profile') {
        setProfileEditable(false);
        showActionButton(editBtn);
      } else {
        editBtn.classList.remove('is-visible');
        editBtn.hidden = true;
      }
      showActionButton(backBtn);
      await waitMs(SETTINGS_ANIMATION.showTopActions);

      currentRoute = route;
      layout.classList.remove('is-transitioning');
      transitioning = false;
    }

    async function closeSubView() {
      if (transitioning || currentRoute === 'main') return;
      transitioning = true;
      layout.classList.add('is-transitioning');

      if (currentRoute === 'profile') {
        await hideActionButton(editBtn);
        setProfileEditable(false);
        populateProfileForm(profileForm, getProfileInfo());
      }
      await hideActionButton(backBtn);

      const activeView = subviews[currentRoute];
      if (activeView) {
        activeView.classList.remove('is-shown');
        await waitMs(SETTINGS_ANIMATION.revealSubview);
        activeView.classList.remove('is-visible');
      }

      if (currentRoute === 'about') {
        await animateItemMoveByLayout(aboutTrigger, () => {
          mainList.classList.remove('is-focused');
          expandAllItems();
        }, SETTINGS_ANIMATION.aboutMoveAndCollapse);
      } else {
        mainList.classList.remove('is-focused');
        expandAllItems();
        await waitMs(SETTINGS_ANIMATION.moveAndCollapse);
      }
      clearFadeState();

      currentRoute = 'main';
      layout.classList.remove('is-transitioning');
      transitioning = false;
    }

    profileTrigger.addEventListener('click', () => {
      openSubView('profile', profileTrigger);
    });
    aboutTrigger.addEventListener('click', () => {
      openSubView('about', aboutTrigger);
    });
    backBtn.addEventListener('click', closeSubView);
    editBtn.addEventListener('click', () => {
      if (currentRoute !== 'profile') return;
      if (profileEditable) return;
      setProfileEditable(true);
      if (profileForm?.elements.gender) {
        profileForm.elements.gender.focus();
      }
    });
    cancelBtn?.addEventListener('click', () => {
      if (currentRoute !== 'profile') return;
      setProfileEditable(false);
      populateProfileForm(profileForm, getProfileInfo());
    });

    profileForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!profileEditable) return;
      const latestProfile = collectProfileForm(profileForm);
      setProfileInfo(latestProfile);
      populateProfileForm(profileForm, latestProfile);
      setProfileEditable(false);
    });
  }

  function initSettingsPanel() {
    bindSettingsPanel({
      layout: document.getElementById('settings-layout'),
      mainList: document.getElementById('settings-main-list'),
      backBtn: document.getElementById('settings-back-btn'),
      editBtn: document.getElementById('settings-edit-btn'),
      profileTrigger: document.getElementById('settings-profile-trigger'),
      aboutTrigger: document.getElementById('settings-about-trigger'),
      profileView: document.getElementById('settings-subview-profile'),
      aboutView: document.getElementById('settings-subview-about'),
      profileForm: document.getElementById('settings-profile-form'),
      formActions: document.getElementById('settings-form-actions'),
      cancelBtn: document.getElementById('settings-profile-cancel')
    });
  }

  initTheme();
  initSettingsPanel();

  const PAGE_SIZE = 10;
  const COMMUNITY_PAGE_SIZE = 10;
  const DAILY_MAX_TASKS = 9;
  const DAILY_TASK_COLORS = [
    { value: '#89B4FA', label: '天蓝' },
    { value: '#A6E3A1', label: '薄荷' },
    { value: '#F9E2AF', label: '淡黄' },
    { value: '#F5C2E7', label: '粉紫' },
    { value: '#FAB387', label: '橙色' },
    { value: '#CBA6F7', label: '紫色' },
    { value: '#94E2D5', label: '青绿' },
    { value: '#F38BA8', label: '玫红' },
    { value: '#B4BEFE', label: '雾蓝' }
  ];
  const DAILY_GRID_FILL_ORDER = [0, 3, 6, 1, 4, 7, 2, 5, 8];

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
        if (pageId !== 'community-messages') {
          closeCommunityReplySheet();
          closeCommunityDetailModal();
          closeCommunityPostModal();
        }
        if (overlay?.classList.contains('active')) closeSchoolDetail();
        navigateTo(pageId);
        if (pageId === 'university-explorer') loadSchoolListExplorer();
        if (pageId === 'target-universities') loadSchoolListTarget();
        if (pageId === 'my-profile') loadMyProfile();
        if (pageId === 'daily-checkin') initDailyCheckinPage();
        if (pageId === 'community-messages') initCommunityMessagesPage();
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

  function setSchoolPlanningView(showThanks) {
    const introBox = document.querySelector('#page-school-planning .planning-intro-box');
    const form = document.getElementById('school-planning-form');
    const thanksView = document.getElementById('school-planning-thanks');
    if (introBox) introBox.style.display = showThanks ? 'none' : '';
    if (form) form.style.display = showThanks ? 'none' : '';
    if (thanksView) thanksView.style.display = showThanks ? '' : 'none';
  }

  document.getElementById('my-profile-refill')?.addEventListener('click', () => {
    setSchoolPlanningView(false);
    navigateTo('school-planning');
  });

  // ---------- 社区留言 ----------
  let communityCurrentPage = 1;
  let communityTotal = 0;
  let communityInitialized = false;
  let communityDetailPostId = null;
  let communityReplyTarget = null;

  function formatDateTime(dateTimeText) {
    const value = String(dateTimeText || '').trim();
    if (!value) return '-';
    return value.replace('T', ' ').slice(0, 16);
  }

  function renderCommunityEmptyState(listEl, text) {
    if (!listEl) return;
    listEl.innerHTML = `
      <div class="community-empty-card">
        <p class="placeholder-text">${escapeHtml(text || '暂无帖子')}</p>
        <p class="placeholder-hint">点击上方“新建帖子”，发表第一条内容吧</p>
      </div>
    `;
  }

  function closeCommunityPostModal() {
    const modal = document.getElementById('community-post-modal');
    const titleInput = document.getElementById('community-post-title-input');
    const authorInput = document.getElementById('community-post-author-input');
    const contentInput = document.getElementById('community-post-content-input');
    if (!modal || !titleInput || !authorInput || !contentInput) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    titleInput.value = '';
    authorInput.value = '';
    contentInput.value = '';
  }

  function openCommunityPostModal() {
    const modal = document.getElementById('community-post-modal');
    const titleInput = document.getElementById('community-post-title-input');
    if (!modal || !titleInput) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => titleInput.focus(), 0);
  }

  function closeCommunityDetailModal() {
    const modal = document.getElementById('community-detail-modal');
    if (!modal) return;
    closeCommunityReplySheet();
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    communityDetailPostId = null;
  }

  function openCommunityDetailModal() {
    const modal = document.getElementById('community-detail-modal');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeCommunityReplySheet() {
    const sheet = document.getElementById('community-reply-sheet');
    const authorInput = document.getElementById('community-reply-author-input');
    const contentInput = document.getElementById('community-reply-content-input');
    const targetTextEl = document.getElementById('community-reply-target-text');
    if (!sheet || !authorInput || !contentInput || !targetTextEl) return;
    sheet.classList.remove('active');
    sheet.setAttribute('aria-hidden', 'true');
    authorInput.value = '';
    contentInput.value = '';
    communityReplyTarget = null;
    targetTextEl.textContent = '回复对象：楼主';
  }

  function openCommunityReplySheet(targetReply = null) {
    const sheet = document.getElementById('community-reply-sheet');
    const authorInput = document.getElementById('community-reply-author-input');
    const contentInput = document.getElementById('community-reply-content-input');
    const targetTextEl = document.getElementById('community-reply-target-text');
    if (!sheet || !authorInput || !contentInput || !targetTextEl || !communityDetailPostId) return;
    communityReplyTarget = targetReply && targetReply.replyId ? targetReply : null;
    targetTextEl.textContent = communityReplyTarget
      ? `回复对象：${communityReplyTarget.authorName || '匿名用户'}`
      : '回复对象：楼主';
    sheet.classList.add('active');
    sheet.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      const hasAuthor = authorInput.value.trim().length > 0;
      (hasAuthor ? contentInput : authorInput).focus();
    }, 0);
  }

  function renderCommunityPagination() {
    const paginationEl = document.getElementById('community-board-pagination');
    if (!paginationEl) return;
    paginationEl.innerHTML = '';

    const totalPages = Math.ceil(communityTotal / COMMUNITY_PAGE_SIZE) || 1;
    const prev = document.createElement('button');
    prev.className = 'pagination-btn pagination-prev';
    prev.innerHTML = '‹';
    prev.title = '上一页';
    prev.disabled = communityCurrentPage <= 1;
    prev.addEventListener('click', () => {
      if (communityCurrentPage <= 1) return;
      communityCurrentPage -= 1;
      loadCommunityMessageList();
    });

    const next = document.createElement('button');
    next.className = 'pagination-btn pagination-next';
    next.innerHTML = '›';
    next.title = '下一页';
    next.disabled = communityCurrentPage >= totalPages;
    next.addEventListener('click', () => {
      if (communityCurrentPage >= totalPages) return;
      communityCurrentPage += 1;
      loadCommunityMessageList();
    });

    const info = document.createElement('span');
    info.className = 'pagination-info';
    info.textContent = `第 ${communityCurrentPage} / ${totalPages} 页，共 ${communityTotal} 条帖子`;

    paginationEl.appendChild(prev);
    paginationEl.appendChild(info);
    paginationEl.appendChild(next);
  }

  async function loadCommunityDetail(postId) {
    if (!window.api?.communityGetPostDetail) return;
    const res = await window.api.communityGetPostDetail(postId);
    if (res?.error || !res?.post) {
      window.alert(res?.error || '读取帖子详情失败');
      return;
    }

    const titleEl = document.getElementById('community-detail-title');
    const metaEl = document.getElementById('community-detail-meta');
    const contentEl = document.getElementById('community-detail-content');
    const repliesEl = document.getElementById('community-replies-list');
    if (!titleEl || !metaEl || !contentEl || !repliesEl) return;

    const post = res.post;
    const replies = res.replies || [];

    titleEl.textContent = post.title || '';
    metaEl.textContent = `${post.author_name || '-'} · ${formatDateTime(post.created_at)}`;
    contentEl.textContent = post.content || '';

    if (replies.length === 0) {
      repliesEl.innerHTML = '<p class="community-reply-empty">暂无回复，来抢沙发吧~</p>';
      return;
    }

    repliesEl.innerHTML = replies.map((reply) => `
      <div class="community-reply-item">
        <div class="community-reply-main">${escapeHtml(reply.content || '')}</div>
        <div class="community-reply-meta">
          <span>${escapeHtml(reply.parent_author_name ? `${reply.author_name || '-'} 回复 ${reply.parent_author_name}` : (reply.author_name || '-'))} · ${escapeHtml(formatDateTime(reply.created_at))}</span>
          <div class="community-reply-actions">
            <button type="button" class="community-reply-action-btn" data-reply-id="${Number(reply.id || 0)}" data-reply-author="${escapeHtml(reply.author_name || '')}">回复TA</button>
            <button type="button" class="community-reply-delete-btn" data-reply-id="${Number(reply.id || 0)}">删除</button>
          </div>
        </div>
      </div>
    `).join('');

    const actionBtns = repliesEl.querySelectorAll('.community-reply-action-btn');
    actionBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const replyId = Number(btn.getAttribute('data-reply-id') || 0);
        const authorName = btn.getAttribute('data-reply-author') || '';
        if (!replyId) return;
        openCommunityReplySheet({ replyId, authorName });
      });
    });

    const deleteBtns = repliesEl.querySelectorAll('.community-reply-delete-btn');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const replyId = Number(btn.getAttribute('data-reply-id') || 0);
        if (!replyId || !communityDetailPostId) return;
        const confirmed = window.confirm('确认删除这条评论及其所有子回复吗？');
        if (!confirmed) return;
        if (!window.api?.communityDeleteReply) return;

        const res = await window.api.communityDeleteReply({
          postId: communityDetailPostId,
          replyId
        });
        if (!res?.success) {
          window.alert(res?.error || '删除评论失败，请稍后重试');
          return;
        }
        await loadCommunityDetail(communityDetailPostId);
        await loadCommunityMessageList();
      });
    });
  }

  async function loadCommunityMessageList() {
    const listEl = document.getElementById('community-board-list');
    const paginationEl = document.getElementById('community-board-pagination');
    if (!listEl || !paginationEl) return;

    if (!window.api?.communityListPosts) {
      renderCommunityEmptyState(listEl, '当前版本不支持社区留言');
      paginationEl.innerHTML = '';
      return;
    }

    const res = await window.api.communityListPosts(communityCurrentPage, COMMUNITY_PAGE_SIZE);
    if (res?.error) {
      renderCommunityEmptyState(listEl, res.error);
      paginationEl.innerHTML = '';
      return;
    }

    const items = res?.items || [];
    communityTotal = Number(res?.total || 0);

    if (items.length === 0) {
      if (communityCurrentPage > 1) {
        communityCurrentPage = Math.max(1, communityCurrentPage - 1);
        await loadCommunityMessageList();
        return;
      }
      renderCommunityEmptyState(listEl, '暂无社区帖子');
      renderCommunityPagination();
      return;
    }

    listEl.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'community-post-card';
      card.innerHTML = `
        <div class="community-post-title">${escapeHtml(item.title || '')}</div>
        <div class="community-post-meta">
          <span>${escapeHtml(item.author_name || '-')}</span>
          <span>${escapeHtml(formatDateTime(item.created_at))}</span>
          <span>回复 ${Number(item.reply_count || 0)}</span>
        </div>
      `;
      card.addEventListener('click', async () => {
        communityDetailPostId = Number(item.id);
        await loadCommunityDetail(communityDetailPostId);
        openCommunityDetailModal();
      });
      listEl.appendChild(card);
    });

    renderCommunityPagination();
  }

  async function initCommunityMessagesPage() {
    if (!communityInitialized) {
      const newPostBtn = document.getElementById('community-new-post-btn');
      const postModal = document.getElementById('community-post-modal');
      const postCancelBtn = document.getElementById('community-post-cancel-btn');
      const postSubmitBtn = document.getElementById('community-post-submit-btn');
      const detailModal = document.getElementById('community-detail-modal');
      const detailCloseBtn = document.getElementById('community-detail-close-btn');
      const openReplyBtn = document.getElementById('community-open-reply-btn');
      const deletePostBtn = document.getElementById('community-delete-post-btn');
      const replySheet = document.getElementById('community-reply-sheet');
      const replySheetMask = document.getElementById('community-reply-sheet-mask');
      const replyCancelBtn = document.getElementById('community-reply-cancel-btn');
      const replySubmitBtn = document.getElementById('community-reply-submit-btn');

      newPostBtn?.addEventListener('click', () => openCommunityPostModal());
      postCancelBtn?.addEventListener('click', () => closeCommunityPostModal());
      postModal?.addEventListener('click', (e) => {
        if (e.target === postModal) closeCommunityPostModal();
      });

      postSubmitBtn?.addEventListener('click', async () => {
        const titleInput = document.getElementById('community-post-title-input');
        const authorInput = document.getElementById('community-post-author-input');
        const contentInput = document.getElementById('community-post-content-input');
        if (!titleInput || !authorInput || !contentInput) return;

        const title = titleInput.value.trim();
        const authorName = authorInput.value.trim();
        const content = contentInput.value.trim();

        if (!title) {
          window.alert('请填写标题');
          titleInput.focus();
          return;
        }
        if (!authorName) {
          window.alert('请填写发帖人昵称');
          authorInput.focus();
          return;
        }
        if (!content) {
          window.alert('请填写帖子内容');
          contentInput.focus();
          return;
        }
        if (!window.api?.communityCreatePost) return;

        const res = await window.api.communityCreatePost({ title, content, authorName });
        if (!res?.success) {
          window.alert(res?.error || '发帖失败，请稍后再试');
          return;
        }
        closeCommunityPostModal();
        communityCurrentPage = 1;
        await loadCommunityMessageList();
      });

      detailCloseBtn?.addEventListener('click', () => closeCommunityDetailModal());
      detailModal?.addEventListener('click', (e) => {
        if (e.target === detailModal) closeCommunityDetailModal();
      });

      openReplyBtn?.addEventListener('click', () => openCommunityReplySheet(null));
      deletePostBtn?.addEventListener('click', async () => {
        if (!communityDetailPostId) return;
        const confirmed = window.confirm('确认删除这个帖子及其全部评论吗？');
        if (!confirmed) return;
        if (!window.api?.communityDeletePost) return;

        const res = await window.api.communityDeletePost(communityDetailPostId);
        if (!res?.success) {
          window.alert(res?.error || '删除帖子失败，请稍后重试');
          return;
        }
        closeCommunityDetailModal();
        await loadCommunityMessageList();
      });
      replyCancelBtn?.addEventListener('click', () => closeCommunityReplySheet());
      replySheetMask?.addEventListener('click', () => closeCommunityReplySheet());
      replySheet?.addEventListener('click', (e) => {
        if (e.target === replySheet) closeCommunityReplySheet();
      });

      replySubmitBtn?.addEventListener('click', async () => {
        const authorInput = document.getElementById('community-reply-author-input');
        const contentInput = document.getElementById('community-reply-content-input');
        if (!authorInput || !contentInput || !communityDetailPostId) return;

        const authorName = authorInput.value.trim();
        const content = contentInput.value.trim();
        if (!authorName) {
          window.alert('请填写回复人昵称');
          authorInput.focus();
          return;
        }
        if (!content) {
          window.alert('请填写回复内容');
          contentInput.focus();
          return;
        }
        if (!window.api?.communityCreateReply) return;

        const res = await window.api.communityCreateReply({
          postId: communityDetailPostId,
          authorName,
          content,
          parentReplyId: communityReplyTarget?.replyId || null
        });
        if (!res?.success) {
          window.alert(res?.error || '回复失败，请稍后再试');
          return;
        }

        closeCommunityReplySheet();
        await loadCommunityDetail(communityDetailPostId);
        await loadCommunityMessageList();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (replySheet?.classList.contains('active')) {
          closeCommunityReplySheet();
          return;
        }
        if (postModal?.classList.contains('active')) {
          closeCommunityPostModal();
          return;
        }
        if (detailModal?.classList.contains('active')) {
          closeCommunityDetailModal();
        }
      });

      communityInitialized = true;
    }

    await loadCommunityMessageList();
  }

  // ---------- 每日打卡 ----------
  let dailyCurrentMonth = new Date();
  let dailySelectedDateKey = '';
  let dailyTaskItems = [];
  let dailyMonthTaskMap = new Map();
  let dailyInitialized = false;
  let dailyModalInitialized = false;
  let dailySaveTimer = null;
  let dailyActiveTaskIndex = -1;

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function toMonthKey(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
  }

  function parseDateKey(dateKey) {
    const parts = String(dateKey || '').split('-').map((v) => Number(v));
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
    return new Date(y, m - 1, d);
  }

  function formatDateLabel(dateKey) {
    const date = parseDateKey(dateKey);
    if (!date) return dateKey;
    const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekNames[date.getDay()]}`;
  }

  function monthRangeDays(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const firstWeekday = first.getDay() === 0 ? 7 : first.getDay(); // 周一为 1
    const start = new Date(first);
    start.setDate(first.getDate() - (firstWeekday - 1));
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push({
        date,
        dateKey: toDateKey(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: toDateKey(date) === toDateKey(new Date()),
        isSelected: toDateKey(date) === dailySelectedDateKey
      });
    }
    return { days, monthLastDate: last };
  }

  function getMappedGridColors(dateKey) {
    const raw = (dailyMonthTaskMap.get(dateKey) || [])
      .filter((item) => String(item.content || '').trim())
      .slice(0, DAILY_MAX_TASKS);
    const result = new Array(9).fill(null);
    raw.forEach((item, index) => {
      const targetIdx = DAILY_GRID_FILL_ORDER[index];
      result[targetIdx] = {
        color: item.color || DAILY_TASK_COLORS[0].value,
        completed: !!item.completed
      };
    });
    return result;
  }

  async function loadDailyMonthData(monthDate) {
    const monthKey = toMonthKey(monthDate);
    dailyMonthTaskMap = new Map();
    if (!window.api?.dailyCheckinListByMonth) return;
    const res = await window.api.dailyCheckinListByMonth(monthKey);
    if (res?.error) {
      console.error('dailyCheckinListByMonth:', res.error);
      return;
    }
    const groups = new Map();
    (res?.items || []).forEach((item) => {
      const key = String(item.date_key || '');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({
        content: String(item.content || ''),
        color: String(item.color || DAILY_TASK_COLORS[0].value).toUpperCase(),
        completed: !!item.completed,
        sort_order: Number(item.sort_order || 0)
      });
    });
    groups.forEach((items, key) => {
      items.sort((a, b) => a.sort_order - b.sort_order);
      dailyMonthTaskMap.set(key, items.slice(0, DAILY_MAX_TASKS));
    });
  }

  async function loadDailyTasksByDate(dateKey) {
    if (!window.api?.dailyCheckinGetByDate) {
      dailyTaskItems = [];
      return;
    }
    const res = await window.api.dailyCheckinGetByDate(dateKey);
    if (res?.error) {
      console.error('dailyCheckinGetByDate:', res.error);
      dailyTaskItems = [];
      return;
    }
    const normalized = (res?.items || [])
      .map((item) => ({
        content: String(item.content || ''),
        color: String(item.color || DAILY_TASK_COLORS[0].value).toUpperCase(),
        completed: !!item.completed
      }))
      .slice(0, DAILY_MAX_TASKS);
    dailyTaskItems = normalized;
    dailyActiveTaskIndex = -1;
  }

  function updateDailyTaskCounter() {
    const counter = document.getElementById('daily-checkin-task-count');
    if (!counter) return;
    counter.textContent = `${dailyTaskItems.length}/${DAILY_MAX_TASKS}`;
  }

  function buildColorOptions(currentColor) {
    return DAILY_TASK_COLORS
      .map((c) => `<option value="${c.value}" ${String(currentColor).toUpperCase() === c.value ? 'selected' : ''}>${c.label}</option>`)
      .join('');
  }

  function renderDailyTaskList() {
    const listEl = document.getElementById('daily-checkin-task-list');
    const addBtn = document.getElementById('daily-checkin-add-task');
    const dateTitle = document.getElementById('daily-checkin-task-date');
    const emptyEl = document.getElementById('daily-checkin-task-empty');
    if (!listEl || !addBtn || !dateTitle || !emptyEl) return;

    dateTitle.textContent = formatDateLabel(dailySelectedDateKey);
    listEl.innerHTML = '';
    emptyEl.style.display = dailyTaskItems.length === 0 ? 'flex' : 'none';

    dailyTaskItems.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'daily-checkin-task-item';
      if (idx === dailyActiveTaskIndex) row.classList.add('is-operating');
      if (item.completed) row.classList.add('is-completed');
      row.style.setProperty('--task-color', String(item.color || DAILY_TASK_COLORS[0].value));
      row.innerHTML = `
        <div class="daily-checkin-task-content">
          <span class="daily-checkin-task-pin" aria-hidden="true">📌</span>
          <span class="daily-checkin-task-text">${escapeHtml(item.content || '')}</span>
        </div>
        <div class="daily-checkin-task-opbar">
          <button class="daily-checkin-task-icon-btn task-op-back" type="button" title="返回" aria-label="返回">↩</button>
          <button class="daily-checkin-task-icon-btn task-op-complete" type="button" title="完成" aria-label="完成">${item.completed ? '↺' : '✓'}</button>
          <button class="daily-checkin-task-icon-btn task-op-delete" type="button" title="删除" aria-label="删除">🗑</button>
        </div>
      `;
      const backBtn = row.querySelector('.task-op-back');
      const completeBtn = row.querySelector('.task-op-complete');
      const deleteBtn = row.querySelector('.task-op-delete');

      row.addEventListener('click', () => {
        if (dailyActiveTaskIndex === idx) return;
        dailyActiveTaskIndex = idx;
        renderDailyTaskList();
      });

      backBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dailyActiveTaskIndex = -1;
        renderDailyTaskList();
      });

      completeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dailyTaskItems[idx].completed = !dailyTaskItems[idx].completed;
        dailyActiveTaskIndex = -1;
        renderDailyTaskList();
        scheduleDailyTasksSave(true);
      });

      deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dailyTaskItems.splice(idx, 1);
        dailyActiveTaskIndex = -1;
        renderDailyTaskList();
        scheduleDailyTasksSave(true);
      });
      listEl.appendChild(row);
    });

    addBtn.disabled = dailyTaskItems.length >= DAILY_MAX_TASKS;
    updateDailyTaskCounter();
  }

  function renderDailyCalendar() {
    const monthTitle = document.getElementById('daily-checkin-month-title');
    const grid = document.getElementById('daily-checkin-calendar-grid');
    if (!monthTitle || !grid) return;
    monthTitle.textContent = `${dailyCurrentMonth.getFullYear()}年 ${dailyCurrentMonth.getMonth() + 1}月`;
    grid.innerHTML = '';
    const { days } = monthRangeDays(dailyCurrentMonth);
    days.forEach((day) => {
      const dayEl = document.createElement('button');
      dayEl.type = 'button';
      dayEl.className = 'daily-checkin-day';
      if (!day.isCurrentMonth) dayEl.classList.add('is-other-month');
      if (day.isToday) dayEl.classList.add('is-today');
      if (day.isSelected) dayEl.classList.add('is-selected');

      const mappedColors = getMappedGridColors(day.dateKey);
      const gridCells = mappedColors
        .map((cell) => {
          if (!cell) return '<span class="daily-checkin-day-grid-cell"></span>';
          const stateClass = cell.completed ? ' is-completed' : ' is-pending';
          return `<span class="daily-checkin-day-grid-cell${stateClass}" style="--cell-color:${cell.color};"></span>`;
        })
        .join('');

      dayEl.innerHTML = `
        <span class="daily-checkin-day-date">${day.date.getDate()}</span>
        <div class="daily-checkin-day-grid">${gridCells}</div>
      `;
      dayEl.addEventListener('click', async () => {
        await persistDailyTasks();
        dailyActiveTaskIndex = -1;
        dailySelectedDateKey = day.dateKey;
        if (day.date.getMonth() !== dailyCurrentMonth.getMonth() || day.date.getFullYear() !== dailyCurrentMonth.getFullYear()) {
          dailyCurrentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
          await loadDailyMonthData(dailyCurrentMonth);
        }
        await loadDailyTasksByDate(dailySelectedDateKey);
        renderDailyCalendar();
        renderDailyTaskList();
      });
      grid.appendChild(dayEl);
    });
  }

  async function persistDailyTasks() {
    if (dailySaveTimer) {
      clearTimeout(dailySaveTimer);
      dailySaveTimer = null;
    }
    const payload = dailyTaskItems
      .map((item) => ({
        content: String(item.content || '').trim(),
        color: String(item.color || DAILY_TASK_COLORS[0].value).toUpperCase(),
        completed: !!item.completed
      }))
      .filter((item) => item.content)
      .slice(0, DAILY_MAX_TASKS);

    if (!window.api?.dailyCheckinSaveByDate) return;
    const res = await window.api.dailyCheckinSaveByDate(dailySelectedDateKey, payload);
    if (!res?.success) {
      window.alert(res?.error || '保存失败，请稍后重试');
      return;
    }
    await loadDailyMonthData(dailyCurrentMonth);
    await loadDailyTasksByDate(dailySelectedDateKey);
    renderDailyCalendar();
    renderDailyTaskList();
  }

  function scheduleDailyTasksSave(immediate = false) {
    if (dailySaveTimer) {
      clearTimeout(dailySaveTimer);
      dailySaveTimer = null;
    }
    if (immediate) {
      persistDailyTasks();
      return;
    }
    dailySaveTimer = setTimeout(() => {
      persistDailyTasks();
    }, 450);
  }

  function initDailyTaskModal() {
    if (dailyModalInitialized) return;
    const modal = document.getElementById('daily-checkin-modal');
    const modalInput = document.getElementById('daily-checkin-modal-input');
    const modalColor = document.getElementById('daily-checkin-modal-color');
    const modalCancel = document.getElementById('daily-checkin-modal-cancel');
    const modalConfirm = document.getElementById('daily-checkin-modal-confirm');
    if (!modal || !modalInput || !modalColor || !modalCancel || !modalConfirm) return;

    modalColor.innerHTML = DAILY_TASK_COLORS
      .map((c) => `<option value="${c.value}">${c.label}</option>`)
      .join('');

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      modalInput.value = '';
      modalColor.value = DAILY_TASK_COLORS[0].value;
    }

    function openModal(defaultColor) {
      if (dailyTaskItems.length >= DAILY_MAX_TASKS) return;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      modalInput.value = '';
      modalColor.value = defaultColor || DAILY_TASK_COLORS[0].value;
      setTimeout(() => modalInput.focus(), 0);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modalCancel.addEventListener('click', closeModal);

    modalConfirm.addEventListener('click', () => {
      const content = modalInput.value.trim();
      if (!content) {
        window.alert('请先填写任务内容');
        return;
      }
      if (dailyTaskItems.length >= DAILY_MAX_TASKS) {
        closeModal();
        return;
      }
      dailyTaskItems.push({
        content,
        color: String(modalColor.value || DAILY_TASK_COLORS[0].value).toUpperCase(),
        completed: false
      });
      closeModal();
      renderDailyTaskList();
      scheduleDailyTasksSave(true);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    const addBtn = document.getElementById('daily-checkin-add-task');
    addBtn?.addEventListener('click', () => {
      if (dailyTaskItems.length >= DAILY_MAX_TASKS) return;
      const defaultColor = DAILY_TASK_COLORS[dailyTaskItems.length % DAILY_TASK_COLORS.length].value;
      openModal(defaultColor);
    });

    dailyModalInitialized = true;
  }

  async function initDailyCheckinPage() {
    const panel = document.getElementById('page-daily-checkin');
    if (!panel) return;

    const prevBtn = document.getElementById('daily-checkin-prev-month');
    const nextBtn = document.getElementById('daily-checkin-next-month');
    initDailyTaskModal();

    if (!dailyInitialized) {
      prevBtn?.addEventListener('click', async () => {
        await persistDailyTasks();
        dailyCurrentMonth = new Date(dailyCurrentMonth.getFullYear(), dailyCurrentMonth.getMonth() - 1, 1);
        await loadDailyMonthData(dailyCurrentMonth);
        renderDailyCalendar();
      });
      nextBtn?.addEventListener('click', async () => {
        await persistDailyTasks();
        dailyCurrentMonth = new Date(dailyCurrentMonth.getFullYear(), dailyCurrentMonth.getMonth() + 1, 1);
        await loadDailyMonthData(dailyCurrentMonth);
        renderDailyCalendar();
      });
      dailyInitialized = true;
    }

    const today = new Date();
    dailyCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    dailySelectedDateKey = toDateKey(today);
    await loadDailyMonthData(dailyCurrentMonth);
    await loadDailyTasksByDate(dailySelectedDateKey);
    renderDailyCalendar();
    renderDailyTaskList();
  }

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
    const gpaInput = document.getElementById('sp-gpa');
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

    function syncGpaRangeByScale() {
      if (!gpaInput) return;
      const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value;
      gpaInput.min = '0';
      if (gpaScale === '4') gpaInput.max = '4';
      else gpaInput.max = '5';
    }
    form.querySelectorAll('input[name="sp-gpa-scale"]').forEach((radio) => {
      radio.addEventListener('change', syncGpaRangeByScale);
    });
    syncGpaRangeByScale();

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
      const gpaValue = parseFloat(gpa);
      const gpaScale = document.querySelector('input[name="sp-gpa-scale"]:checked')?.value;
      const gpaPercentile = document.getElementById('sp-gpa-percentile')?.value?.trim();

      if (!graduationYear) { setFieldError('graduationYear', '请选择本科毕业年份 / Please select graduation year'); errors.push('graduationYear'); }
      if (!institutionTier) { setFieldError('institutionTier', '请选择本科院校层次 / Please select institution tier'); errors.push('institutionTier'); }
      if (!schoolName) { setFieldError('schoolName', '请输入本科学校名称 / Please enter school name'); errors.push('schoolName'); }
      if (!major) { setFieldError('major', '请输入本科专业 / Please enter major'); errors.push('major'); }
      if (!gpa || isNaN(gpaValue)) {
        setFieldError('gpa', '请输入有效绩点 / Please enter valid GPA');
        errors.push('gpa');
      } else if (gpaScale === '4' && (gpaValue < 0 || gpaValue > 4)) {
        setFieldError('gpa', '四分制绩点需在0-4之间 / GPA must be between 0-4 for 4.0 scale');
        errors.push('gpa');
      } else if (gpaScale === '5' && (gpaValue < 0 || gpaValue > 5)) {
        setFieldError('gpa', '五分制绩点需在0-5之间 / GPA must be between 0-5 for 5.0 scale');
        errors.push('gpa');
      }
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
        setSchoolPlanningView(true);
      }
    });

    const refillBtn = document.getElementById('school-planning-refill');
    refillBtn?.addEventListener('click', () => {
      setSchoolPlanningView(false);
    });
  }

  initSchoolPlanningForm();

  // 初始化：进入院校大全或目标院校时加载
  const activePage = document.querySelector('.page.active');
  if (activePage?.id === 'page-university-explorer') loadSchoolListExplorer();
  if (activePage?.id === 'page-target-universities') loadSchoolListTarget();
  if (activePage?.id === 'page-daily-checkin') initDailyCheckinPage();
  if (activePage?.id === 'page-community-messages') initCommunityMessagesPage();
});
