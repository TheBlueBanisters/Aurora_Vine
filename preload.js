const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  schoolsList: (page = 1, pageSize = 10) =>
    ipcRenderer.invoke('schools:list', page, pageSize),
  schoolsGetById: (schoolId) =>
    ipcRenderer.invoke('schools:getById', schoolId),
  schoolsGetIntro: (rankingQs) =>
    ipcRenderer.invoke('schools:getIntro', rankingQs),
  schoolsGetAssetPath: (rankingQs, filename) =>
    ipcRenderer.invoke('schools:getAssetPath', rankingQs, filename),
  dailyCheckinGetByDate: (dateKey) =>
    ipcRenderer.invoke('dailyCheckin:getByDate', dateKey),
  dailyCheckinListByMonth: (monthKey) =>
    ipcRenderer.invoke('dailyCheckin:listByMonth', monthKey),
  dailyCheckinSaveByDate: (dateKey, items) =>
    ipcRenderer.invoke('dailyCheckin:saveByDate', dateKey, items),
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
