const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const Database = require('better-sqlite3');

protocol.registerSchemesAsPrivileged([
  { scheme: 'avatar', privileges: { standard: true, secure: true } }
]);

const INVITE_CODE = 'ABDAUV';

const appRoot = app.getAppPath();
const dbPath = path.join(appRoot, 'data', 'school_item.db');
const schoolDir = path.join(appRoot, 'school');
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

function getReadOnlyDb() {
  if (!fs.existsSync(dbPath)) return null;
  return new Database(dbPath, { readonly: true });
}

function getWritableDb() {
  return new Database(dbPath);
}

function normalizeDateKey(dateKey) {
  const value = String(dateKey ?? '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function normalizeMonthKey(monthKey) {
  const value = String(monthKey ?? '').trim();
  return /^\d{4}-\d{2}$/.test(value) ? value : null;
}

function sanitizeTaskColor(color) {
  const value = String(color ?? '').trim();
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value.toUpperCase() : '#89B4FA';
}

function normalizePositiveInt(value, defaultValue = null) {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) return defaultValue;
  return num;
}

function normalizeText(value, maxLength) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  return text.slice(0, maxLength);
}

function normalizeEmail(email) {
  const value = String(email ?? '').trim().toLowerCase();
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}

function normalizePassword(password) {
  const value = String(password ?? '');
  if (value.length < 6 || value.length > 128) return null;
  return value;
}

function buildDefaultNickname(email) {
  return String(email ?? '').split('@')[0].slice(0, 40) || 'Aurora用户';
}

function normalizeNickname(nickname, fallbackEmail = '') {
  const fallback = buildDefaultNickname(fallbackEmail);
  return normalizeText(nickname, 40) || fallback;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const raw = String(storedPassword ?? '');
  const [salt, expectedHash] = raw.split(':');
  if (!salt || !expectedHash) return false;
  const actualHash = crypto.scryptSync(password, salt, 64).toString('hex');
  const actualBuffer = Buffer.from(actualHash, 'hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function serializeAccount(row) {
  if (!row) return null;
  let avatar_url = null;
  if (row.avatar_path) {
    const userDataPath = app.getPath('userData');
    const fullPath = path.join(userDataPath, row.avatar_path);
    const exists = fs.existsSync(fullPath);
    if (exists) {
      avatar_url = `avatar://account/${row.id}`;
    }
  }
  return {
    id: Number(row.id),
    email: row.email,
    nickname: row.nickname,
    is_certified: Number(row.is_certified || 0) === 1,
    senior_type: row.senior_type || null,
    avatar_url
  };
}

function buildAuthResponse(session) {
  if (!session || session.mode === 'none') {
    return { authenticated: false, mode: 'none', user: null };
  }
  if (session.mode === 'guest') {
    return { authenticated: false, mode: 'guest', user: null };
  }
  return {
    authenticated: true,
    mode: 'account',
    user: serializeAccount(session.user)
  };
}

function ensureAccountTables() {
  const db = getWritableDb();
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        nickname TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );

      CREATE TABLE IF NOT EXISTS app_session (
        session_id INTEGER PRIMARY KEY CHECK (session_id = 1),
        mode TEXT NOT NULL CHECK (mode IN ('guest', 'account')),
        account_id INTEGER,
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE
      );
    `);
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
    `);
    const accountColumns = db.prepare(`PRAGMA table_info(accounts)`).all();
    const hasNickname = accountColumns.some((col) => col.name === 'nickname');
    if (!hasNickname) {
      db.exec(`ALTER TABLE accounts ADD COLUMN nickname TEXT NOT NULL DEFAULT 'Aurora用户';`);
    }
    const hasIsCertified = accountColumns.some((col) => col.name === 'is_certified');
    if (!hasIsCertified) {
      db.exec(`ALTER TABLE accounts ADD COLUMN is_certified INTEGER NOT NULL DEFAULT 0;`);
    }
    const hasSeniorType = accountColumns.some((col) => col.name === 'senior_type');
    if (!hasSeniorType) {
      db.exec(`ALTER TABLE accounts ADD COLUMN senior_type TEXT;`);
    }
    const hasAvatarPath = accountColumns.some((col) => col.name === 'avatar_path');
    if (!hasAvatarPath) {
      db.exec(`ALTER TABLE accounts ADD COLUMN avatar_path TEXT;`);
    }
  } finally {
    db.close();
  }
}

function getCurrentSession() {
  ensureAccountTables();
  const db = getWritableDb();
  try {
    const session = db.prepare(`
      SELECT session_id, mode, account_id
      FROM app_session
      WHERE session_id = 1
    `).get();
    if (!session) return { mode: 'none', user: null };
    if (session.mode === 'guest') return { mode: 'guest', user: null };
    if (!session.account_id) return { mode: 'none', user: null };
    const user = db.prepare(`
      SELECT id, email, nickname, is_certified, senior_type, avatar_path
      FROM accounts
      WHERE id = ?
    `).get(session.account_id);
    if (!user) return { mode: 'none', user: null };
    return { mode: 'account', user };
  } finally {
    db.close();
  }
}

function setCurrentSession(mode, accountId = null) {
  ensureAccountTables();
  const db = getWritableDb();
  try {
    const stmt = db.prepare(`
      INSERT INTO app_session (session_id, mode, account_id, updated_at)
      VALUES (1, ?, ?, datetime('now', 'localtime'))
      ON CONFLICT(session_id) DO UPDATE SET
        mode = excluded.mode,
        account_id = excluded.account_id,
        updated_at = excluded.updated_at
    `);
    stmt.run(mode, accountId);
  } finally {
    db.close();
  }
}

function clearCurrentSession() {
  ensureAccountTables();
  const db = getWritableDb();
  try {
    db.prepare(`DELETE FROM app_session WHERE session_id = 1`).run();
  } finally {
    db.close();
  }
}

function requireAccountSession() {
  const session = getCurrentSession();
  if (session.mode !== 'account' || !session.user) {
    return { error: '请先登录账号后再执行此操作' };
  }
  return { user: session.user };
}

function ensureDailyCheckinTable() {
  const db = getWritableDb();
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS daily_checkin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date_key TEXT NOT NULL,
        content TEXT NOT NULL,
        color TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT DEFAULT (datetime('now', 'localtime'))
      );
      CREATE INDEX IF NOT EXISTS idx_daily_checkin_date_key ON daily_checkin(date_key);
    `);
    const columns = db.prepare(`PRAGMA table_info(daily_checkin)`).all();
    const hasCompleted = columns.some((col) => col.name === 'completed');
    if (!hasCompleted) {
      db.exec(`ALTER TABLE daily_checkin ADD COLUMN completed INTEGER NOT NULL DEFAULT 0;`);
    }
  } finally {
    db.close();
  }
}

function ensureCommunityTables() {
  const db = getWritableDb();
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_id INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY(author_id) REFERENCES accounts(id) ON DELETE SET NULL
      );
      CREATE INDEX IF NOT EXISTS idx_community_posts_created_at
        ON community_posts(created_at DESC);

      CREATE TABLE IF NOT EXISTS community_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_id INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY(post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
        FOREIGN KEY(author_id) REFERENCES accounts(id) ON DELETE SET NULL
      );
    `);
    const postColumns = db.prepare(`PRAGMA table_info(community_posts)`).all();
    const hasPostAuthorId = postColumns.some((col) => col.name === 'author_id');
    if (!hasPostAuthorId) {
      db.exec(`ALTER TABLE community_posts ADD COLUMN author_id INTEGER;`);
    }
    const columns = db.prepare(`PRAGMA table_info(community_replies)`).all();
    const hasParentReplyId = columns.some((col) => col.name === 'parent_reply_id');
    if (!hasParentReplyId) {
      db.exec(`ALTER TABLE community_replies ADD COLUMN parent_reply_id INTEGER;`);
    }
    const hasReplyAuthorId = columns.some((col) => col.name === 'author_id');
    if (!hasReplyAuthorId) {
      db.exec(`ALTER TABLE community_replies ADD COLUMN author_id INTEGER;`);
    }
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_community_replies_post_id
        ON community_replies(post_id);
      CREATE INDEX IF NOT EXISTS idx_community_replies_created_at
        ON community_replies(created_at ASC);
      CREATE INDEX IF NOT EXISTS idx_community_replies_parent_reply_id
        ON community_replies(parent_reply_id);
      CREATE INDEX IF NOT EXISTS idx_community_posts_author_id
        ON community_posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_community_replies_author_id
        ON community_replies(author_id);
    `);
  } finally {
    db.close();
  }
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

ipcMain.handle('auth:getCurrentUser', async () => {
  return buildAuthResponse(getCurrentSession());
});

ipcMain.handle('auth:enterGuest', async () => {
  try {
    setCurrentSession('guest', null);
    return { success: true, ...buildAuthResponse(getCurrentSession()) };
  } catch (err) {
    console.error('auth:enterGuest error:', err);
    return { success: false, error: err.message || '进入游客模式失败' };
  }
});

ipcMain.handle('auth:register', async (event, payload = {}) => {
  const email = normalizeEmail(payload?.email);
  const password = normalizePassword(payload?.password);
  const nickname = normalizeNickname(payload?.nickname, email || '');
  if (!email) return { success: false, error: '请输入有效的邮箱地址' };
  if (!password) return { success: false, error: '密码长度需为 6 到 128 位' };

  let db;
  try {
    ensureAccountTables();
    db = getWritableDb();
    const existing = db.prepare(`SELECT id FROM accounts WHERE email = ?`).get(email);
    if (existing) {
      return { success: false, error: '该邮箱已注册，请直接登录' };
    }
    const passwordHash = hashPassword(password);
    const result = db.prepare(`
      INSERT INTO accounts (email, password_hash, nickname, updated_at)
      VALUES (?, ?, ?, datetime('now', 'localtime'))
    `).run(email, passwordHash, nickname);
    setCurrentSession('account', Number(result.lastInsertRowid));
    return { success: true, ...buildAuthResponse(getCurrentSession()) };
  } catch (err) {
    console.error('auth:register error:', err);
    return { success: false, error: err.message || '注册失败，请稍后重试' };
  } finally {
    db?.close();
  }
});

ipcMain.handle('auth:login', async (event, payload = {}) => {
  const email = normalizeEmail(payload?.email);
  const password = normalizePassword(payload?.password);
  if (!email) return { success: false, error: '请输入有效的邮箱地址' };
  if (!password) return { success: false, error: '请输入正确的密码' };

  let db;
  try {
    ensureAccountTables();
    db = getWritableDb();
    const account = db.prepare(`
      SELECT id, email, nickname, password_hash
      FROM accounts
      WHERE email = ?
    `).get(email);
    if (!account || !verifyPassword(password, account.password_hash)) {
      return { success: false, error: '邮箱或密码错误' };
    }
    setCurrentSession('account', Number(account.id));
    return { success: true, ...buildAuthResponse(getCurrentSession()) };
  } catch (err) {
    console.error('auth:login error:', err);
    return { success: false, error: err.message || '登录失败，请稍后重试' };
  } finally {
    db?.close();
  }
});

ipcMain.handle('auth:logout', async () => {
  try {
    clearCurrentSession();
    return { success: true, ...buildAuthResponse(getCurrentSession()) };
  } catch (err) {
    console.error('auth:logout error:', err);
    return { success: false, error: err.message || '退出登录失败' };
  }
});

ipcMain.handle('auth:updateNickname', async (event, nickname) => {
  const session = requireAccountSession();
  if (session.error) return { success: false, error: session.error };
  const normalized = normalizeNickname(nickname, session.user?.email || '');
  if (!normalized) return { success: false, error: '昵称不能为空，长度需为 1 到 40 个字符' };

  try {
    const db = getWritableDb();
    db.prepare(`
      UPDATE accounts
      SET nickname = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(normalized, session.user.id);
    db.close();
    return { success: true };
  } catch (err) {
    console.error('auth:updateNickname error:', err);
    return { success: false, error: err.message || '更新昵称失败' };
  }
});

ipcMain.handle('auth:certify', async (event, payload = {}) => {
  const session = requireAccountSession();
  if (session.error) return { success: false, error: session.error };

  const inviteCode = String(payload?.inviteCode ?? '').trim();
  const gender = String(payload?.gender ?? '').trim();
  if (!inviteCode) return { success: false, error: '请输入邀请码' };
  if (inviteCode.toUpperCase() !== INVITE_CODE.toUpperCase()) {
    return { success: false, error: '邀请码错误' };
  }

  const seniorType = /女/.test(gender) ? '学姐' : '学长';

  try {
    const db = getWritableDb();
    db.prepare(`
      UPDATE accounts
      SET is_certified = 1, senior_type = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(seniorType, session.user.id);
    db.close();
    const updatedSession = getCurrentSession();
    return { success: true, ...buildAuthResponse(updatedSession) };
  } catch (err) {
    console.error('auth:certify error:', err);
    return { success: false, error: err.message || '认证失败' };
  }
});

const AVATAR_MAX_BYTES = 512 * 1024; // 500KB
const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function resolveAvatarUrl(authorId, avatarPath) {
  if (!authorId || !avatarPath || typeof avatarPath !== 'string') return null;
  const userDataPath = app.getPath('userData');
  const fullPath = path.join(userDataPath, avatarPath.trim());
  if (!fs.existsSync(fullPath)) return null;
  return `avatar://account/${authorId}`;
}

ipcMain.handle('auth:uploadAvatar', async (event, base64DataUrl) => {
  const session = requireAccountSession();
  if (session.error) return { success: false, error: session.error };

  const raw = String(base64DataUrl ?? '').trim();
  const m = raw.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
  if (!m) return { success: false, error: '图片格式不正确，请上传 JPEG、PNG 或 WebP 格式' };
  const mime = m[1].toLowerCase();
  const b64 = m[2];
  if (!AVATAR_ALLOWED_TYPES.includes(mime)) {
    return { success: false, error: '仅支持 JPEG、PNG、WebP 格式' };
  }

  let buffer;
  try {
    buffer = Buffer.from(b64, 'base64');
  } catch {
    return { success: false, error: '图片数据无效' };
  }
  if (buffer.length > AVATAR_MAX_BYTES) {
    return { success: false, error: '图片过大，请选择 500KB 以内的图片' };
  }

  const accountId = Number(session.user.id);
  const ext = mime === 'image/jpeg' ? 'jpg' : mime === 'image/png' ? 'png' : 'webp';
  const avatarsDir = path.join(app.getPath('userData'), 'avatars');
  const relativePath = `avatars/${accountId}.${ext}`;
  const fullPath = path.join(avatarsDir, `${accountId}.${ext}`);

  try {
    if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

    ensureAccountTables();
    const db = getWritableDb();
    const row = db.prepare('SELECT avatar_path FROM accounts WHERE id = ?').get(accountId);
    const oldPath = row?.avatar_path ? path.join(app.getPath('userData'), row.avatar_path) : null;
    if (oldPath && oldPath !== fullPath && fs.existsSync(oldPath)) {
      try { fs.unlinkSync(oldPath); } catch {}
    }

    fs.writeFileSync(fullPath, buffer, { flag: 'w' });
    db.prepare(`
      UPDATE accounts SET avatar_path = ?, updated_at = datetime('now', 'localtime') WHERE id = ?
    `).run(relativePath, accountId);
    db.close();

    return { success: true };
  } catch (err) {
    console.error('auth:uploadAvatar error:', err);
    return { success: false, error: err.message || '头像上传失败' };
  }
});

function getAvatarDataUrlForAccount(accountId) {
  const aid = normalizePositiveInt(accountId);
  if (!aid) return null;
  const db = getReadOnlyDb();
  if (!db) return null;
  try {
    const row = db.prepare('SELECT avatar_path FROM accounts WHERE id = ?').get(aid);
    const fullPath = row?.avatar_path ? path.join(app.getPath('userData'), row.avatar_path) : null;
    const exists = fullPath ? fs.existsSync(fullPath) : false;
    const result = row?.avatar_path && exists ? (() => {
      const buf = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).slice(1).toLowerCase();
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'image/webp';
      return `data:${mime};base64,${buf.toString('base64')}`;
    })() : null;
    return result;
  } finally {
    db.close();
  }
}

ipcMain.handle('avatar:getDataUrl', async (event, accountId) => {
  const dataUrl = getAvatarDataUrlForAccount(accountId);
  return { dataUrl };
});

// IPC: 分页查询院校列表
ipcMain.handle('schools:list', async (event, page = 1, pageSize = 10) => {
  const db = getReadOnlyDb();
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
    const db = getReadOnlyDb();
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

ipcMain.handle('dailyCheckin:getByDate', async (event, dateKey) => {
  const normalizedDateKey = normalizeDateKey(dateKey);
  if (!normalizedDateKey) return { items: [], error: '日期格式不正确' };
  try {
    ensureDailyCheckinTable();
    const db = getReadOnlyDb();
    if (!db) return { items: [], error: '数据库文件不存在' };
    const stmt = db.prepare(`
      SELECT content, color, completed, sort_order
      FROM daily_checkin
      WHERE date_key = ?
      ORDER BY sort_order ASC
    `);
    const items = stmt.all(normalizedDateKey);
    db.close();
    return { items };
  } catch (err) {
    console.error('dailyCheckin:getByDate error:', err);
    return { items: [], error: err.message || '读取失败' };
  }
});

ipcMain.handle('dailyCheckin:listByMonth', async (event, monthKey) => {
  const normalizedMonthKey = normalizeMonthKey(monthKey);
  if (!normalizedMonthKey) return { items: [], error: '月份格式不正确' };
  try {
    ensureDailyCheckinTable();
    const db = getReadOnlyDb();
    if (!db) return { items: [], error: '数据库文件不存在' };
    const stmt = db.prepare(`
      SELECT date_key, content, color, completed, sort_order
      FROM daily_checkin
      WHERE date_key LIKE ?
      ORDER BY date_key ASC, sort_order ASC
    `);
    const items = stmt.all(`${normalizedMonthKey}-%`);
    db.close();
    return { items };
  } catch (err) {
    console.error('dailyCheckin:listByMonth error:', err);
    return { items: [], error: err.message || '读取失败' };
  }
});

ipcMain.handle('dailyCheckin:saveByDate', async (event, dateKey, items = []) => {
  const normalizedDateKey = normalizeDateKey(dateKey);
  if (!normalizedDateKey) return { success: false, error: '日期格式不正确' };
  if (!Array.isArray(items)) return { success: false, error: '任务数据格式不正确' };
  if (items.length > 9) return { success: false, error: '当天任务最多 9 条' };

  const normalizedItems = items
    .map((item, idx) => {
      const content = String(item?.content ?? '').trim();
      if (!content) return null;
      return {
        content,
        color: sanitizeTaskColor(item?.color),
        completed: item?.completed ? 1 : 0,
        sortOrder: idx
      };
    })
    .filter(Boolean)
    .slice(0, 9);

  try {
    ensureDailyCheckinTable();
    const db = getWritableDb();
    const removeStmt = db.prepare('DELETE FROM daily_checkin WHERE date_key = ?');
    const insertStmt = db.prepare(`
      INSERT INTO daily_checkin (date_key, content, color, completed, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);
    const saveTransaction = db.transaction((payload) => {
      removeStmt.run(normalizedDateKey);
      payload.forEach((item) => {
        insertStmt.run(normalizedDateKey, item.content, item.color, item.completed, item.sortOrder);
      });
    });
    saveTransaction(normalizedItems);
    db.close();
    return { success: true };
  } catch (err) {
    console.error('dailyCheckin:saveByDate error:', err);
    return { success: false, error: err.message || '保存失败' };
  }
});

ipcMain.handle('community:listPosts', async (event, page = 1, pageSize = 10) => {
  const normalizedPage = normalizePositiveInt(page, 1);
  const normalizedSize = Math.min(30, Math.max(1, normalizePositiveInt(pageSize, 10)));
  const offset = (normalizedPage - 1) * normalizedSize;
  const session = getCurrentSession();
  const currentAccountId = session.mode === 'account' ? Number(session.user?.id || 0) : 0;

  try {
    ensureCommunityTables();
    const db = getReadOnlyDb();
    if (!db) return { items: [], total: 0, error: '数据库文件不存在' };

    const listStmt = db.prepare(`
      SELECT
        p.id,
        p.title,
        p.author_name,
        p.author_id,
        p.created_at,
        COUNT(r.id) AS reply_count,
        MAX(a.is_certified) AS author_is_certified,
        MAX(a.senior_type) AS author_senior_type,
        MAX(a.avatar_path) AS author_avatar_path
      FROM community_posts p
      LEFT JOIN community_replies r ON r.post_id = p.id
      LEFT JOIN accounts a ON a.id = p.author_id
      GROUP BY p.id
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT ? OFFSET ?
    `);
    const countStmt = db.prepare('SELECT COUNT(*) AS total FROM community_posts');

    const items = listStmt.all(normalizedSize, offset).map((item) => ({
      ...item,
      author_is_certified: Number(item.author_is_certified || 0) === 1,
      author_senior_type: item.author_senior_type || null,
      author_avatar_url: resolveAvatarUrl(item.author_id, item.author_avatar_path) || null,
      canDelete: !!(currentAccountId && item.author_id && Number(item.author_id) === currentAccountId)
    }));
    const countRow = countStmt.get();
    db.close();
    return { items, total: Number(countRow?.total || 0) };
  } catch (err) {
    console.error('community:listPosts error:', err);
    return { items: [], total: 0, error: err.message || '读取社区帖子失败' };
  }
});

ipcMain.handle('community:getPostDetail', async (event, postId) => {
  const normalizedPostId = normalizePositiveInt(postId);
  if (!normalizedPostId) return { post: null, replies: [], error: '帖子 ID 不正确' };
  const session = getCurrentSession();
  const currentAccountId = session.mode === 'account' ? Number(session.user?.id || 0) : 0;

  try {
    ensureCommunityTables();
    const db = getReadOnlyDb();
    if (!db) return { post: null, replies: [], error: '数据库文件不存在' };

    const postStmt = db.prepare(`
      SELECT p.id, p.title, p.content, p.author_name, p.author_id, p.created_at,
        a.is_certified AS author_is_certified,
        a.senior_type AS author_senior_type,
        a.avatar_path AS author_avatar_path
      FROM community_posts p
      LEFT JOIN accounts a ON a.id = p.author_id
      WHERE p.id = ?
    `);
    const repliesStmt = db.prepare(`
      SELECT
        r.id,
        r.post_id,
        r.content,
        r.author_name,
        r.author_id,
        r.parent_reply_id,
        pr.author_name AS parent_author_name,
        r.created_at,
        a.is_certified AS author_is_certified,
        a.senior_type AS author_senior_type,
        a.avatar_path AS author_avatar_path
      FROM community_replies r
      LEFT JOIN community_replies pr ON pr.id = r.parent_reply_id
      LEFT JOIN accounts a ON a.id = r.author_id
      WHERE r.post_id = ?
      ORDER BY r.created_at ASC, r.id ASC
    `);

    const rawPost = postStmt.get(normalizedPostId) || null;
    const post = rawPost
      ? {
          ...rawPost,
          author_is_certified: Number(rawPost.author_is_certified || 0) === 1,
          author_senior_type: rawPost.author_senior_type || null,
          author_avatar_url: resolveAvatarUrl(rawPost.author_id, rawPost.author_avatar_path) || null,
          canDelete: !!(currentAccountId && rawPost.author_id && Number(rawPost.author_id) === currentAccountId)
        }
      : null;
    const replies = post
      ? repliesStmt.all(normalizedPostId).map((reply) => ({
          ...reply,
          author_is_certified: Number(reply.author_is_certified || 0) === 1,
          author_senior_type: reply.author_senior_type || null,
          author_avatar_url: resolveAvatarUrl(reply.author_id, reply.author_avatar_path) || null,
          canDelete: !!(currentAccountId && reply.author_id && Number(reply.author_id) === currentAccountId)
        }))
      : [];
    db.close();

    if (!post) return { post: null, replies: [], error: '帖子不存在或已被删除' };
    return { post, replies };
  } catch (err) {
    console.error('community:getPostDetail error:', err);
    return { post: null, replies: [], error: err.message || '读取帖子详情失败' };
  }
});

ipcMain.handle('community:createPost', async (event, payload = {}) => {
  const session = requireAccountSession();
  if (session.error) return { success: false, error: session.error };
  const title = normalizeText(payload?.title, 120);
  const content = normalizeText(payload?.content, 5000);
  const authorName = normalizeNickname(session.user.nickname, session.user.email);
  const authorId = Number(session.user.id);

  if (!title) return { success: false, error: '标题不能为空' };
  if (!content) return { success: false, error: '帖子内容不能为空' };

  try {
    ensureCommunityTables();
    const db = getWritableDb();
    const stmt = db.prepare(`
      INSERT INTO community_posts (title, content, author_name, author_id)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(title, content, authorName, authorId);
    db.close();
    return { success: true, id: Number(result.lastInsertRowid) };
  } catch (err) {
    console.error('community:createPost error:', err);
    return { success: false, error: err.message || '发帖失败' };
  }
});

ipcMain.handle('community:createReply', async (event, payload = {}) => {
  const session = requireAccountSession();
  if (session.error) return { success: false, error: session.error };
  const postId = normalizePositiveInt(payload?.postId);
  const content = normalizeText(payload?.content, 2000);
  const authorName = normalizeNickname(session.user.nickname, session.user.email);
  const authorId = Number(session.user.id);
  const parentReplyId = normalizePositiveInt(payload?.parentReplyId, null);

  if (!postId) return { success: false, error: '帖子 ID 不正确' };
  if (!content) return { success: false, error: '回复内容不能为空' };

  try {
    ensureCommunityTables();
    const db = getWritableDb();
    const checkStmt = db.prepare('SELECT id FROM community_posts WHERE id = ?');
    const targetPost = checkStmt.get(postId);
    if (!targetPost) {
      db.close();
      return { success: false, error: '帖子不存在或已被删除' };
    }

    let normalizedParentReplyId = null;
    if (parentReplyId) {
      const parentReplyStmt = db.prepare(`
        SELECT id
        FROM community_replies
        WHERE id = ? AND post_id = ?
      `);
      const parentReply = parentReplyStmt.get(parentReplyId, postId);
      if (!parentReply) {
        db.close();
        return { success: false, error: '被回复的楼层不存在或不属于当前帖子' };
      }
      normalizedParentReplyId = parentReply.id;
    }

    const insertStmt = db.prepare(`
      INSERT INTO community_replies (post_id, content, author_name, author_id, parent_reply_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insertStmt.run(postId, content, authorName, authorId, normalizedParentReplyId);
    db.close();
    return { success: true, id: Number(result.lastInsertRowid) };
  } catch (err) {
    console.error('community:createReply error:', err);
    return { success: false, error: err.message || '回复失败' };
  }
});

ipcMain.handle('community:deletePost', async (event, postId) => {
  const session = requireAccountSession();
  if (session.error) return { success: false, error: session.error };
  const normalizedPostId = normalizePositiveInt(postId);
  if (!normalizedPostId) return { success: false, error: '帖子 ID 不正确' };

  try {
    ensureCommunityTables();
    const db = getWritableDb();
    const checkStmt = db.prepare('SELECT id, author_id FROM community_posts WHERE id = ?');
    const post = checkStmt.get(normalizedPostId);
    if (!post) {
      db.close();
      return { success: false, error: '帖子不存在或已被删除' };
    }
    if (!post.author_id || Number(post.author_id) !== Number(session.user.id)) {
      db.close();
      return { success: false, error: '只有帖子作者本人可以删除该帖子' };
    }

    const deleteRepliesStmt = db.prepare('DELETE FROM community_replies WHERE post_id = ?');
    const deletePostStmt = db.prepare('DELETE FROM community_posts WHERE id = ?');
    const trx = db.transaction(() => {
      deleteRepliesStmt.run(normalizedPostId);
      deletePostStmt.run(normalizedPostId);
    });
    trx();
    db.close();
    return { success: true };
  } catch (err) {
    console.error('community:deletePost error:', err);
    return { success: false, error: err.message || '删除帖子失败' };
  }
});

ipcMain.handle('community:deleteReply', async (event, payload = {}) => {
  const session = requireAccountSession();
  if (session.error) return { success: false, error: session.error };
  const postId = normalizePositiveInt(payload?.postId);
  const replyId = normalizePositiveInt(payload?.replyId);
  if (!postId) return { success: false, error: '帖子 ID 不正确' };
  if (!replyId) return { success: false, error: '评论 ID 不正确' };

  try {
    ensureCommunityTables();
    const db = getWritableDb();
    const checkStmt = db.prepare(`
      SELECT id, author_id
      FROM community_replies
      WHERE id = ? AND post_id = ?
    `);
    const targetReply = checkStmt.get(replyId, postId);
    if (!targetReply) {
      db.close();
      return { success: false, error: '评论不存在或不属于当前帖子' };
    }
    if (!targetReply.author_id || Number(targetReply.author_id) !== Number(session.user.id)) {
      db.close();
      return { success: false, error: '只有评论作者本人可以删除该评论' };
    }

    const deleteStmt = db.prepare(`
      WITH RECURSIVE descendants(id) AS (
        SELECT id FROM community_replies WHERE id = ? AND post_id = ?
        UNION ALL
        SELECT r.id
        FROM community_replies r
        JOIN descendants d ON r.parent_reply_id = d.id
        WHERE r.post_id = ?
      )
      DELETE FROM community_replies
      WHERE id IN (SELECT id FROM descendants);
    `);
    const result = deleteStmt.run(replyId, postId, postId);
    db.close();
    return { success: true, deletedCount: Number(result?.changes || 0) };
  } catch (err) {
    console.error('community:deleteReply error:', err);
    return { success: false, error: err.message || '删除评论失败' };
  }
});

app.whenReady()
  .then(() => {
    ensureAccountTables();
    ensureDailyCheckinTable();
    ensureCommunityTables();

    protocol.handle('avatar', (request) => {
      const url = new URL(request.url);
      const accountId = url.pathname.replace(/^\/+/, '').split('/')[0];
      if (!/^\d+$/.test(accountId)) return new Response('', { status: 400 });
      const db = getReadOnlyDb();
      if (!db) return new Response('', { status: 404 });
      try {
        const row = db.prepare('SELECT avatar_path FROM accounts WHERE id = ?').get(accountId);
        if (!row?.avatar_path) return new Response('', { status: 404 });
        const fullPath = path.join(app.getPath('userData'), row.avatar_path);
        if (!fs.existsSync(fullPath)) return new Response('', { status: 404 });
        const buf = fs.readFileSync(fullPath);
        const ext = path.extname(fullPath).slice(1).toLowerCase();
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'image/webp';
        return new Response(buf, { headers: { 'Content-Type': mime } });
      } finally {
        db.close();
      }
    });

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
