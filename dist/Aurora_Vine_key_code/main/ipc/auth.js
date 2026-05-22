import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { getWritableDb, getReadOnlyDb } from '../utils/db';
import { normalizeEmail, normalizePassword, normalizeNickname, normalizeText } from '../utils/security';
import { hashPassword, verifyPassword } from '../utils/crypto';

const INVITE_CODE = 'ABDAUV';

function serializeAccount(row) {
  if (!row) return null;
  let avatar_url = null;
  if (row.avatar_path) {
    const userDataPath = app.getPath('userData');
    const fullPath = path.join(userDataPath, row.avatar_path);
    if (fs.existsSync(fullPath)) {
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

export function buildAuthResponse(session) {
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

export function ensureAccountTables() {
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

export function getCurrentSession() {
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

export function requireAccountSession() {
  const session = getCurrentSession();
  if (session.mode !== 'account' || !session.user) {
    return { error: '请先登录账号后再执行此操作' };
  }
  return { user: session.user };
}

export function registerAuthIpc() {
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
}
