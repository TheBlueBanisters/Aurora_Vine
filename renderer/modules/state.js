export const TARGET_SCHOOLS_KEY = 'targetSchools'
export const LEGACY_SCHOOL_PLANNING_PROFILE_KEY = 'schoolPlanningProfile'
export const GUEST_SCHOOL_PLANNING_PROFILE_KEY = 'schoolPlanningProfile:guest'
export const THEME_KEY = 'theme'
export const SETTINGS_PROFILE_KEY = 'settingsProfileInfo'
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
export const USAGE_GUIDE_STEPS = [
  { pageId: 'school-planning', title: '定校规划', desc: '填写本科背景、成绩和语言，获取留学定校建议与规划路径。' },
  { pageId: 'my-profile', title: '我的背景', desc: '查看已填写的学术背景与标化成绩可视化图表。' },
  { pageId: 'university-explorer', title: '院校大全', desc: '浏览院校列表，收藏感兴趣院校并查看详情。' },
  { pageId: 'target-universities', title: '目标院校', desc: '管理已收藏的目标院校列表。' },
  { pageId: 'study-planning', title: '留学规划', desc: '制定个性化的留学时间线与任务规划。（即将上线）' },
  { pageId: 'daily-checkin', title: '每日打卡', desc: '记录每日学习任务与完成情况，保持前进动力。' },
  { pageId: 'university-database', title: '院校数据库', desc: '查询详细的院校数据和录取信息。（即将上线）' },
  { pageId: 'application-cases', title: '申请案例', desc: '浏览真实的留学申请案例和经验分享。（即将上线）' },
  { pageId: 'resource-center', title: '资源中心', desc: '获取留学相关的工具、模板和资料。（即将上线）' },
  { pageId: 'community-messages', title: '社区留言', desc: '发帖、回复，与其他留学伙伴交流经验。' },
  { pageId: 'settings', title: '设置', desc: '切换主题、编辑个人信息、认证、更换头像等。' }
]
export const USAGE_GUIDE_FINAL_STEP = {
  title: '开始使用',
  desc: '如需再次查看本指南，请点击侧边栏中的「使用指南」。',
  isFinal: true
}
export const DAILY_TASK_COLORS = [
  { value: '#89B4FA', label: '天蓝' },
  { value: '#A6E3A1', label: '薄荷' },
  { value: '#F9E2AF', label: '淡黄' },
  { value: '#F5C2E7', label: '粉紫' },
  { value: '#FAB387', label: '橙色' },
  { value: '#CBA6F7', label: '紫色' },
  { value: '#94E2D5', label: '青绿' },
  { value: '#F38BA8', label: '玫红' },
  { value: '#B4BEFE', label: '雾蓝' }
]
export const DAILY_GRID_FILL_ORDER = [0, 3, 6, 1, 4, 7, 2, 5, 8]
export const SETTINGS_ANIMATION = {
  fadeOut: 220,
  moveAndCollapse: 320,
  aboutMoveAndCollapse: 460,
  revealSubview: 260,
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
    return currentAuthState.user?.nickname || currentAuthState.user?.email || 'Aurora 用户'
  }
  if (isGuestMode()) return '游客'
  return '未登录'
}

export function getCurrentUserMetaText() {
  if (isAccountMode()) {
    return currentAuthState.user?.email || '已登录账号'
  }
  if (isGuestMode()) return '当前为游客模式，可继续浏览与填写背景'
  return '登录后可绑定背景与社区身份'
}

const refreshHooks = []

export function registerRefreshHook(fn) {
  refreshHooks.push(fn)
}

export function runRefreshHooks() {
  refreshHooks.forEach(fn => fn())
}
