import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { getReadOnlyDb, getWritableDb } from '../utils/db';
import { normalizePositiveInt } from '../utils/security';
import { requireAccountSession, ensureAccountTables } from './auth';

const AVATAR_MAX_BYTES = 512 * 1024;
const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function resolveAvatarUrl(authorId, avatarPath) {
  if (!authorId || !avatarPath || typeof avatarPath !== 'string') return null;
  const userDataPath = app.getPath('userData');
  const fullPath = path.join(userDataPath, avatarPath.trim());
  if (!fs.existsSync(fullPath)) return null;
  return `avatar://account/${authorId}`;
}

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

export function registerAvatarIpc() {
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

  ipcMain.handle('avatar:getDataUrl', async (event, accountId) => {
    const dataUrl = getAvatarDataUrlForAccount(accountId);
    return { dataUrl };
  });
}

export function registerAvatarProtocol(protocol) {
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
}
