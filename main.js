const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'data', 'school_item.db');
const schoolDir = path.join(__dirname, 'school');
const schoolDirReal = fs.existsSync(schoolDir) ? fs.realpathSync(schoolDir) : schoolDir;

function isSubPath(parent, target) {
  const relative = path.relative(parent, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function normalizeRankingQs(rankingQs) {
  const value = String(rankingQs ?? '').trim();
  if (!/^\d+$/.test(value)) return null;
  return value;
}

function normalizeFilename(filename) {
  const value = String(filename ?? '').trim();
  if (!value) return null;
  // Restrict to plain filenames to prevent traversal/injection.
  if (!/^[A-Za-z0-9._-]+$/.test(value)) return null;
  return value;
}

function resolveSchoolPath(rankingQs, filename) {
  const rank = normalizeRankingQs(rankingQs);
  if (!rank) return null;
  const resolved = filename
    ? path.resolve(schoolDir, `No.${rank}`, filename)
    : path.resolve(schoolDir, `No.${rank}`);
  if (!isSubPath(schoolDir, resolved)) return null;
  if (!fs.existsSync(resolved)) return null;
  const real = fs.realpathSync(resolved);
  if (!isSubPath(schoolDirReal, real)) return null;
  return real;
}

function getDb() {
  if (!fs.existsSync(dbPath)) return null;
  return new Database(dbPath, { readonly: true });
}

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
  const win = new BrowserWindow({
    width: 1300,
    height: 860,
    minWidth: 960,
    minHeight: 600,
    icon: path.join(__dirname, 'image', 'icon.png'),
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
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  ipcMain.handle('theme:apply', async (event, theme) => {
    applyThemeToWindow(win, theme);
  });
}

// IPC: 分页查询院校列表
ipcMain.handle('schools:list', async (event, page = 1, pageSize = 10) => {
  const db = getDb();
  if (!db) {
    return { items: [], total: 0, error: '数据库文件不存在，请运行 node data/init_db.js 初始化' };
  }
  try {
    const offset = Math.max(0, (page - 1) * pageSize);
    const stmt = db.prepare(
      'SELECT * FROM schools ORDER BY ranking_qs ASC LIMIT ? OFFSET ?'
    );
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM schools');
    const items = stmt.all(pageSize, offset);
    const { total } = countStmt.get();
    return { items, total };
  } catch (err) {
    console.error('schools:list error:', err);
    return { items: [], total: 0, error: err.message || '数据库读取失败' };
  } finally {
    db.close();
  }
});

// IPC: 按 school_id 获取单条院校
ipcMain.handle('schools:getById', async (event, schoolId) => {
  try {
    const db = getDb();
    if (!db) return null;
    const stmt = db.prepare('SELECT * FROM schools WHERE school_id = ?');
    const row = stmt.get(schoolId) || null;
    db.close();
    return row;
  } catch (err) {
    console.error('schools:getById error:', err);
    return null;
  }
});

// IPC: 读取 intro.json
ipcMain.handle('schools:getIntro', async (event, rankingQs) => {
  const introPath = resolveSchoolPath(rankingQs, 'intro.json');
  if (!introPath) return null;
  try {
    const raw = fs.readFileSync(introPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
});

// IPC: 返回院校素材的 file:// 路径
ipcMain.handle('schools:getAssetPath', async (event, rankingQs, filename) => {
  const safeFilename = normalizeFilename(filename);
  if (!safeFilename) return null;
  const assetPath = resolveSchoolPath(rankingQs, safeFilename);
  if (!assetPath) return null;
  return pathToFileURL(assetPath).href;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
