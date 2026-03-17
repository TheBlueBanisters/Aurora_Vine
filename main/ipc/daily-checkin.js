import { ipcMain } from 'electron';
import { getReadOnlyDb, getWritableDb } from '../utils/db';
import { normalizeDateKey, normalizeMonthKey, sanitizeTaskColor } from '../utils/security';

export function ensureDailyCheckinTable() {
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

export function registerDailyCheckinIpc() {
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
}
