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
  themeApply: (theme) => ipcRenderer.invoke('theme:apply', theme)
});
