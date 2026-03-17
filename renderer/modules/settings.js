import { showToast, waitMs } from './utils.js'
import {
  isAccountMode,
  isGuestMode,
  getAuthState,
  applyAuthState,
  getCurrentUserDisplayName,
  SETTINGS_DEFAULT_PROFILE,
  SETTINGS_ANIMATION
} from './state.js'
import { getProfileInfo, setProfileInfo } from './storage.js'
import { openAuthGate, applyAuthStateAndRefresh } from './auth.js'

function updateProfileTipText(profileExpanded = false) {
  const profileTip = document.querySelector('.settings-profile-tip')
  if (!profileTip) return
  profileTip.textContent = profileExpanded
    ? '收起'
    : (isAccountMode()
      ? '点击查看个人资料'
      : '当前身份可继续浏览，登录后将绑定到账号')
}

export function updateSettingsCertifyState() {
  const certifyBody = document.getElementById('settings-certify-body')
  const certifyGuestHint = document.getElementById('settings-certify-guest-hint')
  const certifyStatus = document.getElementById('settings-certify-status')
  const codeInput = document.getElementById('settings-certify-code')
  const certifyTrigger = document.getElementById('settings-certify-trigger')
  if (!certifyBody || !certifyGuestHint || !certifyStatus) return

  if (!isAccountMode()) {
    certifyGuestHint.hidden = false
    certifyBody.hidden = true
    certifyStatus.textContent = '-'
    if (certifyTrigger) certifyTrigger.disabled = true
    if (codeInput) codeInput.value = ''
    return
  }
  certifyGuestHint.hidden = true
  if (certifyTrigger) certifyTrigger.disabled = false
  const isCertified = !!getAuthState().user?.is_certified
  if (isCertified) {
    certifyBody.hidden = true
    certifyStatus.textContent = '已认证'
  } else {
    certifyBody.hidden = true
    certifyStatus.textContent = '未认证'
    if (codeInput) codeInput.value = ''
  }
}

export function updateSettingsAvatarBadge() {
  const badge = document.getElementById('settings-avatar-badge')
  if (!badge) return
  const isCertified = isAccountMode() && !!getAuthState().user?.is_certified
  badge.classList.remove('settings-profile-badge--gold', 'settings-profile-badge--blue')
  badge.classList.add(isCertified ? 'settings-profile-badge--gold' : 'settings-profile-badge--blue')
  badge.hidden = false
}

export function updateSettingsAccountState() {
  const primaryBtn = document.getElementById('settings-account-primary-btn')
  const logoutBtn = document.getElementById('settings-account-logout-btn')
  const profileAvatar = document.getElementById('settings-profile-avatar')
  const profileName = document.querySelector('.settings-profile-name')
  const avatarWrap = document.querySelector('.settings-profile-avatar-wrap')

  if (primaryBtn) primaryBtn.textContent = isAccountMode() ? '切换账号' : '登录 / 注册'
  if (logoutBtn) logoutBtn.hidden = !isAccountMode()
  if (profileAvatar) {
    const initial = getCurrentUserDisplayName().slice(0, 1) || 'A'
    const hasAvatar = isAccountMode() && getAuthState().user?.avatar_url
    const accountId = isAccountMode() ? getAuthState().user?.id : null
    profileAvatar.innerHTML = ''
    if (hasAvatar && accountId && window.api?.avatarGetDataUrl) {
      const img = document.createElement('img')
      img.alt = ''
      profileAvatar.appendChild(img)
      window.api.avatarGetDataUrl(accountId).then((res) => {
        if (res?.dataUrl && img.parentNode) img.src = res.dataUrl
        else if (img.parentNode) {
          profileAvatar.innerHTML = ''
          profileAvatar.textContent = initial
        }
      }).catch(() => {
        if (profileAvatar.contains(img)) {
          profileAvatar.innerHTML = ''
          profileAvatar.textContent = initial
        }
      })
    } else {
      profileAvatar.textContent = initial
    }
  }
  if (avatarWrap) avatarWrap.classList.toggle('avatar-readonly', !isAccountMode())
  if (profileName) profileName.textContent = getCurrentUserDisplayName()
  updateProfileTipText(false)
  updateSettingsCertifyState()
  updateSettingsAvatarBadge()
}

function populateProfileForm(profileForm, profile) {
  if (!profileForm) return
  profileForm.elements.nickname.value = profile.nickname ?? ''
  profileForm.elements.gender.value = profile.gender
  profileForm.elements.phone.value = profile.phone
  profileForm.elements.email.value = profile.email
  profileForm.elements.region.value = profile.region
}

function collectProfileForm(profileForm) {
  if (!profileForm) return { ...SETTINGS_DEFAULT_PROFILE }
  const normalize = (value, fallback) => {
    const nextValue = String(value || '').trim()
    return nextValue || fallback
  }
  return {
    nickname: normalize(profileForm.elements.nickname?.value, SETTINGS_DEFAULT_PROFILE.nickname),
    gender: normalize(profileForm.elements.gender.value, SETTINGS_DEFAULT_PROFILE.gender),
    phone: normalize(profileForm.elements.phone.value, SETTINGS_DEFAULT_PROFILE.phone),
    email: normalize(profileForm.elements.email.value, SETTINGS_DEFAULT_PROFILE.email),
    region: normalize(profileForm.elements.region.value, SETTINGS_DEFAULT_PROFILE.region)
  }
}

function bindSettingsPanel(settingsNodes, refreshAuthBoundUI) {
  const { layout, mainList, editBtn, profileTrigger, aboutTrigger, profileView, aboutView, profileForm, formActions, cancelBtn } = settingsNodes

  if (!layout || !mainList || !editBtn || !profileTrigger || !aboutTrigger || !profileView || !aboutView) return

  const subviews = { profile: profileView, about: aboutView }
  let currentRoute = 'main'
  let transitioning = false
  let profileEditable = false
  const profileInfo = getProfileInfo()
  populateProfileForm(profileForm, profileInfo)

  function setProfileEditable(editable) {
    profileEditable = editable
    if (!profileForm) return
    ;['nickname', 'gender', 'phone', 'email', 'region'].forEach((field) => {
      if (profileForm.elements[field]) profileForm.elements[field].disabled = !editable
    })
    if (formActions) formActions.hidden = !editable
    editBtn.textContent = '编辑'
  }

  setProfileEditable(false)

  function showActionButton(button) {
    button.hidden = false
    requestAnimationFrame(() => button.classList.add('is-visible'))
  }

  async function hideActionButton(button) {
    button.classList.remove('is-visible')
    await waitMs(SETTINGS_ANIMATION.showTopActions)
    button.hidden = true
  }

  async function openSubView(route) {
    if (transitioning) return
    if (currentRoute === route) { closeSubView(); return }
    if (currentRoute !== 'main') { closeSubView(); await waitMs(SETTINGS_ANIMATION.revealSubview) }
    transitioning = true
    layout.classList.add('is-transitioning')

    const targetView = subviews[route]
    if (targetView) { targetView.classList.add('is-visible'); await waitMs(16); targetView.classList.add('is-shown') }
    await waitMs(SETTINGS_ANIMATION.revealSubview)

    if (route === 'profile') {
      const profileToShow = getProfileInfo()
      if (isAccountMode() && getAuthState().user) {
        if (getAuthState().user.email) profileToShow.email = getAuthState().user.email
        if (getAuthState().user.nickname) profileToShow.nickname = getAuthState().user.nickname
      }
      populateProfileForm(profileForm, profileToShow)
      setProfileEditable(false)
      showActionButton(editBtn)
      updateProfileTipText(true)
    } else {
      editBtn.classList.remove('is-visible')
      editBtn.hidden = true
      updateProfileTipText(false)
    }

    currentRoute = route
    layout.classList.remove('is-transitioning')
    transitioning = false
  }

  async function closeSubView() {
    if (transitioning || currentRoute === 'main') return
    transitioning = true
    layout.classList.add('is-transitioning')

    if (currentRoute === 'profile') {
      await hideActionButton(editBtn)
      setProfileEditable(false)
      populateProfileForm(profileForm, getProfileInfo())
      updateProfileTipText(false)
    }

    const activeView = subviews[currentRoute]
    if (activeView) { activeView.classList.remove('is-shown'); await waitMs(SETTINGS_ANIMATION.revealSubview); activeView.classList.remove('is-visible') }

    currentRoute = 'main'
    layout.classList.remove('is-transitioning')
    transitioning = false
  }

  profileTrigger.addEventListener('click', () => openSubView('profile'))
  aboutTrigger.addEventListener('click', () => openSubView('about'))
  editBtn.addEventListener('click', () => {
    if (currentRoute !== 'profile' || profileEditable) return
    setProfileEditable(true)
    if (profileForm?.elements.nickname) profileForm.elements.nickname.focus()
    else if (profileForm?.elements.gender) profileForm.elements.gender.focus()
  })
  cancelBtn?.addEventListener('click', () => {
    if (currentRoute !== 'profile') return
    setProfileEditable(false)
    const profileToShow = getProfileInfo()
    if (isAccountMode() && getAuthState().user) {
      if (getAuthState().user.email) profileToShow.email = getAuthState().user.email
      if (getAuthState().user.nickname) profileToShow.nickname = getAuthState().user.nickname
    }
    populateProfileForm(profileForm, profileToShow)
  })

  profileForm?.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!profileEditable) return
    const latestProfile = collectProfileForm(profileForm)
    if (isAccountMode() && latestProfile.nickname && window.api?.authUpdateNickname) {
      const res = await window.api.authUpdateNickname(latestProfile.nickname)
      if (!res?.success) { showToast(res?.error || '更新昵称失败，请稍后重试', 'error'); return }
      const authRes = await window.api.authGetCurrentUser()
      if (authRes) applyAuthState(authRes)
    }
    setProfileInfo(latestProfile)
    populateProfileForm(profileForm, latestProfile)
    setProfileEditable(false)
    refreshAuthBoundUI()
  })
}

export function initSettingsPanel(refreshAuthBoundUI) {
  bindSettingsPanel({
    layout: document.getElementById('settings-layout'),
    mainList: document.getElementById('settings-main-list'),
    editBtn: document.getElementById('settings-edit-btn'),
    profileTrigger: document.getElementById('settings-profile-trigger'),
    aboutTrigger: document.getElementById('settings-about-trigger'),
    profileView: document.getElementById('settings-subview-profile'),
    aboutView: document.getElementById('settings-subview-about'),
    profileForm: document.getElementById('settings-profile-form'),
    formActions: document.getElementById('settings-form-actions'),
    cancelBtn: document.getElementById('settings-profile-cancel')
  }, refreshAuthBoundUI)

  const primaryBtn = document.getElementById('settings-account-primary-btn')
  const logoutBtn = document.getElementById('settings-account-logout-btn')

  primaryBtn?.addEventListener('click', () => {
    openAuthGate('login', isGuestMode() ? '登录或注册后即可把当前使用内容绑定到账号。' : '')
  })
  logoutBtn?.addEventListener('click', async () => {
    if (!window.api?.authLogout) return
    const res = await window.api.authLogout()
    if (!res?.success) { showToast(res?.error || '退出登录失败，请稍后重试', 'error'); return }
    applyAuthStateAndRefresh(res, { previousMode: getAuthState().mode, successToast: '已退出登录' })
  })

  const profileAvatar = document.getElementById('settings-profile-avatar')
  const avatarInput = document.getElementById('settings-avatar-input')
  profileAvatar?.addEventListener('click', (e) => {
    e.stopPropagation()
    if (!isAccountMode() || !avatarInput) return
    avatarInput.click()
  })
  avatarInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !window.api?.authUploadAvatar) return
    if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) { showToast('仅支持 JPEG、PNG、WebP 格式', 'warning'); return }
    if (file.size > 512 * 1024) { showToast('图片过大，请选择 500KB 以内的图片', 'warning'); return }
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result
        if (typeof base64 !== 'string') { showToast('图片读取失败', 'error'); resolve(); return }
        const res = await window.api.authUploadAvatar(base64)
        if (!res?.success) { showToast(res?.error || '头像上传失败', 'error') }
        else {
          const authRes = await window.api.authGetCurrentUser()
          if (authRes) applyAuthState(authRes)
          updateSettingsAccountState()
          showToast('头像已更新', 'success')
        }
        resolve()
      }
      reader.onerror = () => { showToast('图片读取失败', 'error'); resolve() }
      reader.readAsDataURL(file)
    })
  })

  const certifyTrigger = document.getElementById('settings-certify-trigger')
  const certifyBody = document.getElementById('settings-certify-body')
  certifyTrigger?.addEventListener('click', () => {
    if (!certifyBody || certifyTrigger.disabled) return
    if (!isAccountMode()) return
    const isCertified = !!getAuthState().user?.is_certified
    if (isCertified) return
    certifyBody.hidden = !certifyBody.hidden
  })

  const certifySubmit = document.getElementById('settings-certify-submit')
  const certifyCodeInput = document.getElementById('settings-certify-code')
  certifySubmit?.addEventListener('click', async () => {
    if (!window.api?.authCertify) return
    const inviteCode = certifyCodeInput?.value?.trim() || ''
    if (!inviteCode) { showToast('请输入邀请码', 'warning'); return }
    const gender = getProfileInfo().gender || ''
    const res = await window.api.authCertify({ inviteCode, gender })
    if (!res?.success) { showToast(res?.error || '认证失败', 'error'); return }
    applyAuthState(res)
    updateSettingsCertifyState()
    updateSettingsAvatarBadge()
    showToast('认证成功', 'success')
  })

  updateSettingsAccountState()
}
