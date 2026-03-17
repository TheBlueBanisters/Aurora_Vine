import { ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { getReadOnlyDb } from '../utils/db';
import { normalizeRankingQs, normalizeFilename, resolveSchoolPath } from '../utils/security';

export function registerSchoolsIpc() {
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

  ipcMain.handle('schools:getAssetPath', async (event, rankingQs, filename) => {
    const safeFilename = normalizeFilename(filename);
    if (!safeFilename) return null;
    const assetPath = resolveSchoolPath(rankingQs, safeFilename);
    const rank = normalizeRankingQs(rankingQs);
    return assetPath && rank ? `school://No.${rank}/${safeFilename}` : null;
  });

  ipcMain.handle('schools:getAssetDataUrl', async (event, rankingQs, filename) => {
    const safeFilename = normalizeFilename(filename);
    if (!safeFilename) return { dataUrl: null };
    const assetPath = resolveSchoolPath(rankingQs, safeFilename);
    if (!assetPath || !fs.existsSync(assetPath)) return { dataUrl: null };
    try {
      const buf = fs.readFileSync(assetPath);
      const ext = path.extname(assetPath).slice(1).toLowerCase();
      const mimeMap = { svg: 'image/svg+xml', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
      const mime = mimeMap[ext] || 'application/octet-stream';
      return { dataUrl: `data:${mime};base64,${buf.toString('base64')}` };
    } catch {
      return { dataUrl: null };
    }
  });
}

export function registerSchoolProtocol(protocol) {
  protocol.handle('school', (request) => {
    const raw = String(request.url || '').replace(/^school:\/\/?/i, '').replace(/^\/+/, '');
    const match = raw.match(/^No\.(\d+)\/([A-Za-z0-9._-]+)$/);
    if (!match) return new Response('', { status: 400 });
    const [, rank, filename] = match;
    const assetPath = resolveSchoolPath(rank, filename);
    if (!assetPath || !fs.existsSync(assetPath)) return new Response('', { status: 404 });
    const buf = fs.readFileSync(assetPath);
    const ext = path.extname(assetPath).slice(1).toLowerCase();
    const mimeMap = { svg: 'image/svg+xml', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
    const mime = mimeMap[ext] || 'application/octet-stream';
    return new Response(buf, { headers: { 'Content-Type': mime } });
  });
}
