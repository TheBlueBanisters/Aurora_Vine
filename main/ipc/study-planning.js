import { ipcMain } from 'electron';
import { getReadOnlyDb, getWritableDb } from '../utils/db';
import { normalizePositiveInt, sanitizeTaskColor } from '../utils/security';

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
        created_at TEXT DEFAULT (datetime('now', 'localtime'))
      );
    `);
  } finally {
    db.close();
  }
}

export function registerStudyPlanIpc() {
  ipcMain.handle('studyPlan:save', async (_event, entries = []) => {
    if (!Array.isArray(entries) || entries.length === 0) {
      return { success: false, error: '没有可保存的规划条目' };
    }
    if (entries.length > 50) {
      return { success: false, error: '单次最多保存 50 条规划' };
    }

    const normalized = entries
      .map((e) => {
        const title = String(e?.title ?? '').trim();
        if (!title) return null;
        const description = String(e?.description ?? '').trim();
        const color = sanitizeTaskColor(e?.color);
        let tasksJson = '[]';
        try {
          const tasks = Array.isArray(e?.tasks) ? e.tasks : [];
          tasksJson = JSON.stringify(
            tasks.map((t) => ({
              content: String(t?.content ?? '').trim(),
              dateStart: String(t?.dateStart ?? ''),
              dateEnd: String(t?.dateEnd ?? '')
            })).filter((t) => t.content)
          );
        } catch (_) { /* keep default */ }
        return { title, description, tasksJson, color };
      })
      .filter(Boolean);

    if (normalized.length === 0) {
      return { success: false, error: '没有有效的规划条目' };
    }

    try {
      ensureStudyPlanTable();
      const db = getWritableDb();
      const insertStmt = db.prepare(`
        INSERT INTO study_plan (title, description, tasks_json, color)
        VALUES (?, ?, ?, ?)
      `);
      const saveAll = db.transaction((items) => {
        for (const item of items) {
          insertStmt.run(item.title, item.description, item.tasksJson, item.color);
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
        SELECT id, title, description, tasks_json, color, created_at
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
}
