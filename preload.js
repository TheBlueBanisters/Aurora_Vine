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
  schoolsSearch: (keyword, page = 1, pageSize = 10, filters = {}) =>
    ipcRenderer.invoke('schools:search', keyword, page, pageSize, filters),
  schoolsGetIntro: (rankingQs) =>
    ipcRenderer.invoke('schools:getIntro', rankingQs),
  schoolsGetAssetPath: (rankingQs, filename) =>
    ipcRenderer.invoke('schools:getAssetPath', rankingQs, filename),
  schoolsGetAssetDataUrl: (rankingQs, filename) =>
    ipcRenderer.invoke('schools:getAssetDataUrl', rankingQs, filename),
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
  themeApply: (theme) => ipcRenderer.invoke('theme:apply', theme)
});
