import { normalizeGpaTopPercent } from './gpa-percent.js'
import {
  TARGET_SCHOOLS_KEY,
  LEGACY_SCHOOL_PLANNING_PROFILE_KEY,
  GUEST_SCHOOL_PLANNING_PROFILE_KEY,
  SETTINGS_PROFILE_KEY,
  SETTINGS_DEFAULT_PROFILE,
  getCurrentAccountId
} from './state.js'

export function readJsonStorage(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getSchoolPlanningStorageKey(accountId = getCurrentAccountId()) {
  if (accountId) return `${LEGACY_SCHOOL_PLANNING_PROFILE_KEY}:account:${accountId}`
  return GUEST_SCHOOL_PLANNING_PROFILE_KEY
}

export function getGuestSchoolPlanningProfile() {
  const guestProfile = readJsonStorage(GUEST_SCHOOL_PLANNING_PROFILE_KEY)
  if (guestProfile) return guestProfile
  const legacyProfile = readJsonStorage(LEGACY_SCHOOL_PLANNING_PROFILE_KEY)
  if (!legacyProfile) return null
  writeJsonStorage(GUEST_SCHOOL_PLANNING_PROFILE_KEY, legacyProfile)
  return legacyProfile
}

function normalizeProfilePercentile(profile) {
  if (!profile || profile.gpaPercentile == null || profile.gpaPercentile === '') return profile
  const top = normalizeGpaTopPercent(profile.gpaPercentile)
  if (top === undefined) return profile
  const canonical = String(top)
  if (String(profile.gpaPercentile) === canonical) return profile
  return { ...profile, gpaPercentile: canonical }
}

export function getSchoolPlanningProfile(accountId = getCurrentAccountId()) {
  const profile = accountId
    ? readJsonStorage(getSchoolPlanningStorageKey(accountId))
    : getGuestSchoolPlanningProfile()
  return normalizeProfilePercentile(profile)
}

export function setSchoolPlanningProfile(data, accountId = getCurrentAccountId()) {
  writeJsonStorage(getSchoolPlanningStorageKey(accountId), data)
  if (!accountId) {
    writeJsonStorage(LEGACY_SCHOOL_PLANNING_PROFILE_KEY, data)
  }
}

export function clearSchoolPlanningProfile(accountId = getCurrentAccountId()) {
  localStorage.removeItem(getSchoolPlanningStorageKey(accountId))
  localStorage.removeItem(GUEST_SCHOOL_PLANNING_PROFILE_KEY)
  localStorage.removeItem(LEGACY_SCHOOL_PLANNING_PROFILE_KEY)
}

export function promptGuestProfileMigrationForAccount(accountId) {
  const guestProfile = getGuestSchoolPlanningProfile()
  if (!guestProfile || !accountId) return
  const targetProfile = getSchoolPlanningProfile(accountId)
  const message = targetProfile
    ? '检测到当前设备有游客背景数据。是否用游客背景覆盖当前账号已保存的背景信息？'
    : '检测到当前设备有游客背景数据。是否将这份背景信息迁移绑定到当前账号？'
  const shouldMigrate = window.confirm(message)
  if (shouldMigrate) {
    setSchoolPlanningProfile(guestProfile, accountId)
  }
}

export function normalizeSchoolId(schoolId) {
  const id = String(schoolId ?? '').trim()
  if (!id || id === 'NaN' || id === 'undefined' || id === 'null') return ''
  return id
}

export function getTargetSchools() {
  try {
    const raw = localStorage.getItem(TARGET_SCHOOLS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.map(normalizeSchoolId).filter(Boolean))]
  } catch {
    return []
  }
}

export function setTargetSchools(ids) {
  const normalized = [...new Set((Array.isArray(ids) ? ids : []).map(normalizeSchoolId).filter(Boolean))]
  localStorage.setItem(TARGET_SCHOOLS_KEY, JSON.stringify(normalized))
}

export function toggleFavorite(schoolId) {
  const normalizedId = normalizeSchoolId(schoolId)
  if (!normalizedId) return false
  const ids = getTargetSchools()
  const idx = ids.indexOf(normalizedId)
  if (idx >= 0) ids.splice(idx, 1)
  else ids.push(normalizedId)
  setTargetSchools(ids)
  const favorited = ids.includes(normalizedId)
  document.dispatchEvent(new CustomEvent('aurora:favorites-changed', {
    detail: { schoolId: normalizedId, favorited }
  }))
  return favorited
}

export function isFavorite(schoolId) {
  const normalizedId = normalizeSchoolId(schoolId)
  return normalizedId ? getTargetSchools().includes(normalizedId) : false
}

export function getProfileInfo() {
  try {
    const raw = localStorage.getItem(SETTINGS_PROFILE_KEY)
    if (!raw) return { ...SETTINGS_DEFAULT_PROFILE }
    const parsed = JSON.parse(raw)
    return {
      nickname: parsed.nickname || SETTINGS_DEFAULT_PROFILE.nickname,
      gender: parsed.gender || SETTINGS_DEFAULT_PROFILE.gender,
      phone: parsed.phone || SETTINGS_DEFAULT_PROFILE.phone,
      email: parsed.email || SETTINGS_DEFAULT_PROFILE.email,
      region: parsed.region || SETTINGS_DEFAULT_PROFILE.region
    }
  } catch {
    return { ...SETTINGS_DEFAULT_PROFILE }
  }
}

export function setProfileInfo(profile) {
  localStorage.setItem(SETTINGS_PROFILE_KEY, JSON.stringify(profile))
}
