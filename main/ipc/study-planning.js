import { ipcMain } from 'electron';
import { getReadOnlyDb, getWritableDb } from '../utils/db';
import { normalizePositiveInt, sanitizeTaskColor } from '../utils/security';
import { tasksToDbJson, localizedToDbField } from '../llm/i18n-content.js';

function migrateStudyPlanTable(db) {
  const columns = db.prepare(`PRAGMA table_info(study_plan)`).all().map((row) => row.name);
  if (!columns.includes('source')) {
    db.exec(`ALTER TABLE study_plan ADD COLUMN source TEXT DEFAULT 'manual'`);
  }
  if (!columns.includes('kind')) {
    db.exec(`ALTER TABLE study_plan ADD COLUMN kind TEXT DEFAULT 'manual'`);
  }
}

export function ensureStudyPlanTable() {
  const db = getWritableDb();
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS study_plan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        tasks_json TEXT NOT NULL DEFAULT '[]',
        color TEXT NOT NULL,
        source TEXT DEFAULT 'manual',
        kind TEXT DEFAULT 'manual',
        created_at TEXT DEFAULT (datetime('now', 'localtime'))
      );
    `);
    migrateStudyPlanTable(db);
  } finally {
    db.close();
  }
}

function normalizeEntryForSave(entry = {}) {
  const titleRaw = entry?.title;
  const descriptionRaw = entry?.description;
  const title = typeof titleRaw === 'string' && titleRaw.trim().startsWith('{')
    ? titleRaw.trim()
    : localizedToDbField(titleRaw);
  const description = typeof descriptionRaw === 'string' && descriptionRaw.trim().startsWith('{')
    ? descriptionRaw.trim()
    : localizedToDbField(descriptionRaw);
  if (!title || title === '{"zh":"","en":""}') return null;

  const color = sanitizeTaskColor(entry?.color);
  const source = String(entry?.source || 'manual').trim() || 'manual';
  const kind = String(entry?.kind || source).trim() || 'manual';
  const tasksJson = Array.isArray(entry?.tasks)
    ? tasksToDbJson(entry.tasks)
    : String(entry?.tasksJson || '[]');

  return { title, description, tasksJson, color, source, kind };
}

export function registerStudyPlanIpc() {
  ipcMain.handle('studyPlan:save', async (_event, entries = []) => {
    if (!Array.isArray(entries) || entries.length === 0) {
      return { success: false, error: '没有可保存的规划条目' };
    }
    if (entries.length > 50) {
      return { success: false, error: '单次最多保存 50 条规划' };
    }

    const normalized = entries.map(normalizeEntryForSave).filter(Boolean);
    if (normalized.length === 0) {
      return { success: false, error: '没有有效的规划条目' };
    }

    try {
      ensureStudyPlanTable();
      const db = getWritableDb();
      const insertStmt = db.prepare(`
        INSERT INTO study_plan (title, description, tasks_json, color, source, kind)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const saveAll = db.transaction((items) => {
        for (const item of items) {
          insertStmt.run(
            item.title,
            item.description,
            item.tasksJson,
            item.color,
            item.source,
            item.kind
          );
        }
      });
      saveAll(normalized);
      db.close();
      return { success: true };
    } catch (err) {
      console.error('studyPlan:save error:', err);
      return { success: false, error: err.message || '保存失败' };
    }
  });

  ipcMain.handle('studyPlan:list', async () => {
    try {
      ensureStudyPlanTable();
      const db = getReadOnlyDb();
      if (!db) return { items: [], error: '数据库文件不存在' };
      const items = db.prepare(`
        SELECT id, title, description, tasks_json, color, source, kind, created_at
        FROM study_plan
        ORDER BY created_at ASC
      `).all();
      db.close();
      return { items };
    } catch (err) {
      console.error('studyPlan:list error:', err);
      return { items: [], error: err.message || '读取失败' };
    }
  });

  ipcMain.handle('studyPlan:delete', async (_event, id) => {
    const normalizedId = normalizePositiveInt(id);
    if (!normalizedId) return { success: false, error: 'ID 无效' };
    try {
      ensureStudyPlanTable();
      const db = getWritableDb();
      db.prepare('DELETE FROM study_plan WHERE id = ?').run(normalizedId);
      db.close();
      return { success: true };
    } catch (err) {
      console.error('studyPlan:delete error:', err);
      return { success: false, error: err.message || '删除失败' };
    }
  });

  ipcMain.handle('studyPlan:clearBySource', async (_event, source = 'llm') => {
    const normalizedSource = String(source || 'llm').trim();
    try {
      ensureStudyPlanTable();
      const db = getWritableDb();
      db.prepare('DELETE FROM study_plan WHERE source = ?').run(normalizedSource);
      db.close();
      return { success: true };
    } catch (err) {
      console.error('studyPlan:clearBySource error:', err);
      return { success: false, error: err.message || '清除失败' };
    }
  });

  ipcMain.handle('studyPlan:clearBySourceAndKind', async (_event, payload = {}) => {
    const normalizedSource = String(payload?.source || 'llm').trim();
    const normalizedKind = String(payload?.kind || '').trim();
    if (!normalizedKind) return { success: false, error: 'kind 无效' };
    try {
      ensureStudyPlanTable();
      const db = getWritableDb();
      db.prepare('DELETE FROM study_plan WHERE source = ? AND kind = ?').run(
        normalizedSource,
        normalizedKind
      );
      db.close();
      return { success: true };
    } catch (err) {
      console.error('studyPlan:clearBySourceAndKind error:', err);
      return { success: false, error: err.message || '清除失败' };
    }
  });

  ipcMain.handle('studyPlan:clearAll', async () => {
    try {
      ensureStudyPlanTable();
      const db = getWritableDb();
      db.prepare('DELETE FROM study_plan').run();
      db.close();
      return { success: true };
    } catch (err) {
      console.error('studyPlan:clearAll error:', err);
      return { success: false, error: err.message || '清除失败' };
    }
  });
}
