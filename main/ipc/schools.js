import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { getReadOnlyDb } from '../utils/db';
import { normalizeRankingQs, normalizeFilename, resolveSchoolPath } from '../utils/security';

const REGION_ALIAS_MAP = {
  hong_kong: ['中国香港', '香港', 'hong kong'],
  singapore: ['新加坡', 'singapore'],
  uk: ['英国', 'uk', 'united kingdom', 'england', 'scotland', 'wales', 'northern ireland'],
  usa: ['美国', 'usa', 'united states', 'united states of america'],
  australia: ['澳大利亚', 'australia'],
  macao: ['中国澳门', '澳门', 'macao', 'macau'],
  malaysia: ['马来西亚', 'malaysia']
};

const EUROPE_ALIASES = [
  '法国', 'france',
  '德国', 'germany',
  '荷兰', 'netherlands',
  '瑞士', 'switzerland',
  '爱尔兰', 'ireland',
  '意大利', 'italy',
  '西班牙', 'spain',
  '比利时', 'belgium',
  '瑞典', 'sweden',
  '丹麦', 'denmark',
  '芬兰', 'finland',
  '挪威', 'norway',
  '奥地利', 'austria',
  '葡萄牙', 'portugal',
  '波兰', 'poland',
  '捷克', 'czech',
  '匈牙利', 'hungary',
  '希腊', 'greece'
];

function buildCountryAliasClause(aliases = []) {
  if (!aliases.length) return { clause: '', params: [] };
  const clause = aliases.map(() => '(country_zh LIKE ? OR country_en LIKE ?)').join(' OR ');
  const params = aliases.flatMap((alias) => {
    const likePattern = `%${alias}%`;
    return [likePattern, likePattern];
  });
  return { clause: `(${clause})`, params };
}

function buildRegionFilter(filters = {}) {
  const region = String(filters?.region ?? 'all').trim().toLowerCase();
  if (!region || region === 'all') return { clause: '', params: [] };
  if (region === 'europe') return buildCountryAliasClause(EUROPE_ALIASES);
  return buildCountryAliasClause(REGION_ALIAS_MAP[region] || []);
}

export function registerSchoolsIpc() {
  ipcMain.handle('schools:list', async (event, page = 1, pageSize = 10, filters = {}) => {
    const db = getReadOnlyDb();
    if (!db) {
      return { items: [], total: 0, error: '数据库文件不存在，请运行 node data/init_db.js 初始化' };
    }
    try {
      const offset = Math.max(0, (page - 1) * pageSize);
      const regionFilter = buildRegionFilter(filters);
      const whereClause = regionFilter.clause ? `WHERE ${regionFilter.clause}` : '';
      const stmt = db.prepare(
        `SELECT school_id, school_name_zh, school_name_en, short_name, country_zh, country_en, city_zh, city_en, ranking_qs, logo_filename FROM schools ${whereClause} ORDER BY ranking_qs ASC LIMIT ? OFFSET ?`
      );
      const countStmt = db.prepare(`SELECT COUNT(*) as total FROM schools ${whereClause}`);
      const items = stmt.all(...regionFilter.params, pageSize, offset);
      const { total } = countStmt.get(...regionFilter.params);
      return { items, total };
    } catch (err) {
      console.error('schools:list error:', err);
      return { items: [], total: 0, error: err.message || '数据库读取失败' };
    } finally {
      db.close();
    }
  });

  ipcMain.handle('schools:search', async (event, keyword = '', page = 1, pageSize = 10, filters = {}) => {
    const db = getReadOnlyDb();
    if (!db) {
      return { items: [], total: 0, error: '数据库文件不存在，请运行 node data/init_db.js 初始化' };
    }
    try {
      const kw = String(keyword ?? '').trim();
      const offset = Math.max(0, (page - 1) * pageSize);
      const regionFilter = buildRegionFilter(filters);

      if (!kw) {
        const whereClause = regionFilter.clause ? `WHERE ${regionFilter.clause}` : '';
        const stmt = db.prepare(
          `SELECT school_id, school_name_zh, school_name_en, short_name, country_zh, country_en, city_zh, city_en, ranking_qs, logo_filename FROM schools ${whereClause} ORDER BY ranking_qs ASC LIMIT ? OFFSET ?`
        );
        const countStmt = db.prepare(`SELECT COUNT(*) as total FROM schools ${whereClause}`);
        const items = stmt.all(...regionFilter.params, pageSize, offset);
        const { total } = countStmt.get(...regionFilter.params);
        return { items, total };
      }

      const likePattern = `%${kw}%`;
      const searchClause = `
        (school_name_zh LIKE ? OR school_name_en LIKE ? OR short_name LIKE ?
          OR country_zh LIKE ? OR country_en LIKE ?
          OR city_zh LIKE ? OR city_en LIKE ?)
      `;
      const whereParts = [searchClause.trim()];
      const params = Array(7).fill(likePattern);
      if (regionFilter.clause) {
        whereParts.push(regionFilter.clause);
        params.push(...regionFilter.params);
      }
      const whereClause = `WHERE ${whereParts.join(' AND ')}`;

      const stmt = db.prepare(
        `SELECT school_id, school_name_zh, school_name_en, short_name, country_zh, country_en, city_zh, city_en, ranking_qs, logo_filename FROM schools ${whereClause} ORDER BY ranking_qs ASC LIMIT ? OFFSET ?`
      );
      const countStmt = db.prepare(`SELECT COUNT(*) as total FROM schools ${whereClause}`);
      const items = stmt.all(...params, pageSize, offset);
      const { total } = countStmt.get(...params);
      return { items, total };
    } catch (err) {
      console.error('schools:search error:', err);
      return { items: [], total: 0, error: err.message || '搜索失败' };
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

  ipcMain.handle('schools:getByIds', async (event, schoolIds) => {
    if (!Array.isArray(schoolIds) || schoolIds.length === 0) return [];
    try {
      const db = getReadOnlyDb();
      if (!db) return [];
      const placeholders = schoolIds.map(() => '?').join(',');
      const stmt = db.prepare(`SELECT * FROM schools WHERE school_id IN (${placeholders})`);
      const rows = stmt.all(...schoolIds);
      db.close();
      return rows;
    } catch (err) {
      console.error('schools:getByIds error:', err);
      return [];
    }
  });

  ipcMain.handle('schools:getProgramsBySchoolId', async (_event, schoolId) => {
    const normalizedSchoolId = String(schoolId ?? '').trim();
    if (!normalizedSchoolId) return { items: [], error: '院校 ID 不正确' };
    const db = getReadOnlyDb();
    if (!db) {
      return { items: [], error: '数据库文件不存在，请运行 node data/init_db.js 初始化' };
    }
    try {
      const items = db.prepare(`
        SELECT
          id,
          school_id,
          ranking_qs,
          school_name_zh,
          school_name_en,
          program_name_cn,
          program_name_en,
          tuition_est,
          language_requirement,
          duration,
          curriculum_summary_cn,
          curriculum_summary_en,
          difficulty_score,
          display_order
        FROM school_programs
        WHERE school_id = ?
        ORDER BY display_order ASC, id ASC
      `).all(normalizedSchoolId);
      return { items };
    } catch (err) {
      console.error('schools:getProgramsBySchoolId error:', err);
      return { items: [], error: err.message || '专业数据读取失败' };
    } finally {
      db.close();
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
    return assetPath && rank ? `school://No.${rank}/${encodeURIComponent(safeFilename)}` : null;
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
    const rawUrl = String(request.url || '');
    const decoded = decodeURIComponent(rawUrl);
    const raw = decoded.replace(/^school:\/\/?/i, '').replace(/^\/+/, '');
    const match = raw.match(/^No\.(\d+)\/(.+)$/);
    if (!match) return new Response('', { status: 400 });
    const [, rank, filename] = match;
    const safeFilename = normalizeFilename(filename);
    if (!safeFilename) return new Response('', { status: 400 });
    const assetPath = resolveSchoolPath(rank, safeFilename);
    if (!assetPath || !fs.existsSync(assetPath)) return new Response('', { status: 404 });
    const buf = fs.readFileSync(assetPath);
    const ext = path.extname(assetPath).slice(1).toLowerCase();
    const mimeMap = { svg: 'image/svg+xml', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
    const mime = mimeMap[ext] || 'application/octet-stream';
    return new Response(buf, { headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' } });
  });
}
