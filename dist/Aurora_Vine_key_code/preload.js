const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  authGetCurrentUser: () =>
    ipcRenderer.invoke('auth:getCurrentUser'),
  authEnterGuest: () =>
    ipcRenderer.invoke('auth:enterGuest'),
  authRegister: (payload) =>
    ipcRenderer.invoke('auth:register', payload),
  authLogin: (payload) =>
    ipcRenderer.invoke('auth:login', payload),
  authLogout: () =>
    ipcRenderer.invoke('auth:logout'),
  authUpdateNickname: (nickname) =>
    ipcRenderer.invoke('auth:updateNickname', nickname),
  authCertify: (payload) =>
    ipcRenderer.invoke('auth:certify', payload),
  authUploadAvatar: (base64DataUrl) =>
    ipcRenderer.invoke('auth:uploadAvatar', base64DataUrl),
  avatarGetDataUrl: (accountId) =>
    ipcRenderer.invoke('avatar:getDataUrl', accountId),
  schoolsList: (page = 1, pageSize = 10, filters = {}) =>
    ipcRenderer.invoke('schools:list', page, pageSize, filters),
  schoolsGetById: (schoolId) =>
    ipcRenderer.invoke('schools:getById', schoolId),
  schoolsGetByIds: (schoolIds) =>
    ipcRenderer.invoke('schools:getByIds', schoolIds),
  schoolsGetProgramsBySchoolId: (schoolId) =>
    ipcRenderer.invoke('schools:getProgramsBySchoolId', schoolId),
  schoolsSearch: (keyword, page = 1, pageSize = 10, filters = {}) =>
    ipcRenderer.invoke('schools:search', keyword, page, pageSize, filters),
  schoolsGetIntro: (rankingQs) =>
    ipcRenderer.invoke('schools:getIntro', rankingQs),
  schoolsGetAssetPath: (rankingQs, filename) =>
    ipcRenderer.invoke('schools:getAssetPath', rankingQs, filename),
  schoolsGetAssetDataUrl: (rankingQs, filename) =>
    ipcRenderer.invoke('schools:getAssetDataUrl', rankingQs, filename),
  applicationCasesList: (page = 1, pageSize = 12, filters = {}) =>
    ipcRenderer.invoke('applicationCases:list', page, pageSize, filters),
  applicationCasesGetDetail: (caseId) =>
    ipcRenderer.invoke('applicationCases:getDetail', caseId),
  applicationCasesListBySchoolId: (schoolId, limit = 6) =>
    ipcRenderer.invoke('applicationCases:listBySchoolId', schoolId, limit),
  dailyCheckinGetByDate: (dateKey) =>
    ipcRenderer.invoke('dailyCheckin:getByDate', dateKey),
  dailyCheckinListByMonth: (monthKey) =>
    ipcRenderer.invoke('dailyCheckin:listByMonth', monthKey),
  dailyCheckinSaveByDate: (dateKey, items) =>
    ipcRenderer.invoke('dailyCheckin:saveByDate', dateKey, items),
  dailyCheckinClearAll: () =>
    ipcRenderer.invoke('dailyCheckin:clearAll'),
  studyPlanSave: (entries) =>
    ipcRenderer.invoke('studyPlan:save', entries),
  studyPlanList: () =>
    ipcRenderer.invoke('studyPlan:list'),
  studyPlanDelete: (id) =>
    ipcRenderer.invoke('studyPlan:delete', id),
  dailyCheckinAppendTasks: (dateKey, tasks) =>
    ipcRenderer.invoke('dailyCheckin:appendTasks', dateKey, tasks),
  dailyCheckinImportPlan: (payload) =>
    ipcRenderer.invoke('dailyCheckin:importPlan', payload),
  communityListPosts: (page = 1, pageSize = 10) =>
    ipcRenderer.invoke('community:listPosts', page, pageSize),
  communityGetPostDetail: (postId) =>
    ipcRenderer.invoke('community:getPostDetail', postId),
  communityCreatePost: (payload) =>
    ipcRenderer.invoke('community:createPost', payload),
  communityCreateReply: (payload) =>
    ipcRenderer.invoke('community:createReply', payload),
  communityDeletePost: (postId) =>
    ipcRenderer.invoke('community:deletePost', postId),
  communityDeleteReply: (payload) =>
    ipcRenderer.invoke('community:deleteReply', payload),
  themeApply: (theme) => ipcRenderer.invoke('theme:apply', theme),
  resumeUpload: (payload) =>
    ipcRenderer.invoke('resume:upload', payload),
  resumeClearAll: () =>
    ipcRenderer.invoke('resume:clearAll'),
  resumeGetText: (md5) =>
    ipcRenderer.invoke('resume:getText', md5),
  settingsGetDeepseekApiKey: () =>
    ipcRenderer.invoke('settings:getDeepseekApiKey'),
  settingsSetDeepseekApiKey: (apiKey) =>
    ipcRenderer.invoke('settings:setDeepseekApiKey', apiKey),
  llmScoreResume: (payload) =>
    ipcRenderer.invoke('llm:scoreResume', payload),
  llmGenerateOutline: (payload) =>
    ipcRenderer.invoke('llm:generateOutline', payload),
  llmGenerateSchedule: (payload) =>
    ipcRenderer.invoke('llm:generateSchedule', payload),
  llmGenerateDailyTasks: (payload) =>
    ipcRenderer.invoke('llm:generateDailyTasks', payload),
  llmGeneratePersonalStatement: (payload) =>
    ipcRenderer.invoke('llm:generatePersonalStatement', payload),
  studyPlanClearBySource: (source) =>
    ipcRenderer.invoke('studyPlan:clearBySource', source),
  studyPlanClearBySourceAndKind: (payload) =>
    ipcRenderer.invoke('studyPlan:clearBySourceAndKind', payload),
  studyPlanClearAll: () =>
    ipcRenderer.invoke('studyPlan:clearAll'),
});
