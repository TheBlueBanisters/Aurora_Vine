import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import path from 'path';

import { registerAuthIpc, ensureAccountTables } from './main/ipc/auth';
import { registerAvatarIpc, registerAvatarProtocol } from './main/ipc/avatar';
import { registerSchoolsIpc, registerSchoolProtocol } from './main/ipc/schools';
import { registerDailyCheckinIpc, ensureDailyCheckinTable } from './main/ipc/daily-checkin';
import { registerStudyPlanIpc, ensureStudyPlanTable } from './main/ipc/study-planning';
import { registerCommunityIpc, ensureCommunityTables } from './main/ipc/community';

protocol.registerSchemesAsPrivileged([
  { scheme: 'avatar', privileges: { standard: true, secure: true } },
  { scheme: 'school', privileges: { standard: true, secure: true } }
]);

const appRoot = app.getAppPath();

function applyThemeToWindow(win, theme) {
  if (!win || win.isDestroyed()) return;
  const isDark = theme === 'dark';
  const overlay = {
    color: isDark ? '#1e1e2e' : '#f8f9fc',
    symbolColor: isDark ? '#cdd6f4' : '#4a4a5a',
    height: 38
  };
  if (win.setTitleBarOverlay) {
    win.setTitleBarOverlay(overlay);
  }
  win.setBackgroundColor(isDark ? '#2d2d3a' : '#4a90d9');
}

function createWindow() {
  const isDev = !app.isPackaged && process.env.ELECTRON_RENDERER_URL;
  const preloadPath = path.join(__dirname, '..', 'preload', 'preload.js');

  const win = new BrowserWindow({
    width: 1300,
    height: 860,
    minWidth: 960,
    minHeight: 600,
    icon: path.join(appRoot, 'image', 'icon.png'),
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f8f9fc',
      symbolColor: '#4a4a5a',
      height: 38
    },
    backgroundColor: '#4a90d9',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    }
  });

  if (isDev) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }

  ipcMain.handle('theme:apply', async (event, theme) => {
    applyThemeToWindow(win, theme);
  });
}

registerAuthIpc();
registerAvatarIpc();
registerSchoolsIpc();
registerDailyCheckinIpc();
registerStudyPlanIpc();
registerCommunityIpc();

app.whenReady()
  .then(() => {
    ensureAccountTables();
    ensureDailyCheckinTable();
    ensureStudyPlanTable();
    ensureCommunityTables();

    registerSchoolProtocol(protocol);
    registerAvatarProtocol(protocol);

    createWindow();
  })
  .catch((err) => {
    console.error('app initialization failed:', err);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
