import { t } from './i18n.js'

export const TARGET_SCHOOLS_KEY = 'targetSchools'
export const LEGACY_SCHOOL_PLANNING_PROFILE_KEY = 'schoolPlanningProfile'
export const GUEST_SCHOOL_PLANNING_PROFILE_KEY = 'schoolPlanningProfile:guest'
export const THEME_KEY = 'theme'
export const LANG_KEY = 'language'
export const SETTINGS_PROFILE_KEY = 'settingsProfileInfo'

export function getDefaultProfile() {
  return {
    nickname: t('state.defaultNickname'),
    gender: t('state.defaultGender'),
    phone: t('state.defaultPhone'),
    email: t('state.defaultEmail'),
    region: t('state.defaultRegion')
  }
}

export const SETTINGS_DEFAULT_PROFILE = {
  nickname: '未设置',
  gender: '未公开',
  phone: '未公开',
  email: '未公开',
  region: '未公开'
}
export const PAGE_SIZE = 10
export const COMMUNITY_PAGE_SIZE = 10
export const DAILY_MAX_TASKS = 9
export const USAGE_GUIDE_NO_MORE_KEY = 'usageGuideNoLongerShow'
const GUIDE_STEP_KEYS = [
  { pageId: 'school-planning', titleKey: 'guide.step.schoolPlanning', descKey: 'guide.step.schoolPlanningDesc' },
  { pageId: 'my-profile', titleKey: 'guide.step.myProfile', descKey: 'guide.step.myProfileDesc' },
  { pageId: 'target-universities', titleKey: 'guide.step.targetUniversities', descKey: 'guide.step.targetUniversitiesDesc' },
  { pageId: 'study-planning', titleKey: 'guide.step.studyPlanning', descKey: 'guide.step.studyPlanningDesc' },
  { pageId: 'daily-checkin', titleKey: 'guide.step.dailyCheckin', descKey: 'guide.step.dailyCheckinDesc' },
  { pageId: 'university-database', titleKey: 'guide.step.universityDatabase', descKey: 'guide.step.universityDatabaseDesc' },
  { pageId: 'application-cases', titleKey: 'guide.step.applicationCases', descKey: 'guide.step.applicationCasesDesc' },
  { pageId: 'resource-center', titleKey: 'guide.step.resourceCenter', descKey: 'guide.step.resourceCenterDesc' },
  { pageId: 'community-messages', titleKey: 'guide.step.communityMessages', descKey: 'guide.step.communityMessagesDesc' },
  { pageId: 'settings', titleKey: 'guide.step.settings', descKey: 'guide.step.settingsDesc' }
]

export function getUsageGuideSteps() {
  return GUIDE_STEP_KEYS.map((s) => ({ pageId: s.pageId, title: t(s.titleKey), desc: t(s.descKey) }))
}

export function getUsageGuideFinalStep() {
  return { title: t('guide.step.final'), desc: t('guide.step.finalDesc'), isFinal: true }
}

export const USAGE_GUIDE_STEPS = GUIDE_STEP_KEYS.map((s) => ({ pageId: s.pageId, title: s.titleKey, desc: s.descKey }))
export const USAGE_GUIDE_FINAL_STEP = { title: 'guide.step.final', desc: 'guide.step.finalDesc', isFinal: true }
const TASK_COLOR_DEFS = [
  { value: '#62C492', labelKey: 'color.skyBlue' },
  { value: '#A6E3A1', labelKey: 'color.mint' },
  { value: '#F9E2AF', labelKey: 'color.lightYellow' },
  { value: '#F5C2E7', labelKey: 'color.pinkPurple' },
  { value: '#FAB387', labelKey: 'color.orange' },
  { value: '#CBA6F7', labelKey: 'color.purple' },
  { value: '#94E2D5', labelKey: 'color.teal' },
  { value: '#F38BA8', labelKey: 'color.rose' },
  { value: '#A8E4C8', labelKey: 'color.fogBlue' }
]

export function getTaskColors() {
  return TASK_COLOR_DEFS.map((c) => ({ value: c.value, label: t(c.labelKey) }))
}

export const DAILY_TASK_COLORS = TASK_COLOR_DEFS.map((c) => ({ value: c.value, label: c.labelKey }))
export const DAILY_GRID_FILL_ORDER = [0, 3, 6, 1, 4, 7, 2, 5, 8]
export const SETTINGS_ANIMATION = {
  fadeOut: 220,
  moveAndCollapse: 320,
  aboutMoveAndCollapse: 460,
  revealSubview: 360,
  showTopActions: 240
}

let currentAuthState = { mode: 'none', user: null }

export function normalizeAuthState(payload) {
  return { mode: payload?.mode || 'none', user: payload?.user || null }
}

export function applyAuthState(payload) {
  currentAuthState = normalizeAuthState(payload)
}

export function getAuthState() {
  return currentAuthState
}

export function isAccountMode() {
  return currentAuthState.mode === 'account' && !!currentAuthState.user?.id
}

export function isGuestMode() {
  return currentAuthState.mode === 'guest'
}

export function getCurrentAccountId() {
  return isAccountMode() ? Number(currentAuthState.user.id) : null
}

export function getCurrentUserDisplayName() {
  if (isAccountMode()) {
    return currentAuthState.user?.nickname || currentAuthState.user?.email || t('state.auroraUser')
  }
  if (isGuestMode()) return t('state.guest')
  return t('state.notLoggedIn')
}

export function getCurrentUserMetaText() {
  if (isAccountMode()) {
    return currentAuthState.user?.email || t('state.accountMeta')
  }
  if (isGuestMode()) return t('state.guestMeta')
  return t('state.loginMeta')
}

const refreshHooks = []

export function registerRefreshHook(fn) {
  refreshHooks.push(fn)
}

export function runRefreshHooks() {
  refreshHooks.forEach(fn => fn())
}
