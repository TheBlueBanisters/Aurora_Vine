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

  ipcMain.handle('dailyCheckin:appendTasks', async (_event, dateKey, newTasks = []) => {
    const normalizedDateKey = normalizeDateKey(dateKey);
    if (!normalizedDateKey) return { success: false, error: '日期格式不正确' };
    if (!Array.isArray(newTasks) || newTasks.length === 0) return { success: true, appended: 0 };

    try {
      ensureDailyCheckinTable();
      const db = getWritableDb();

      const existing = db.prepare(
        'SELECT content, color, completed, sort_order FROM daily_checkin WHERE date_key = ? ORDER BY sort_order ASC'
      ).all(normalizedDateKey);

      const remaining = 9 - existing.length;
      if (remaining <= 0) { db.close(); return { success: true, appended: 0 }; }

      const toInsert = newTasks
        .map((t) => {
          const content = String(t?.content ?? '').trim();
          if (!content) return null;
          return { content, color: sanitizeTaskColor(t?.color), completed: t?.completed ? 1 : 0 };
        })
        .filter(Boolean)
        .slice(0, remaining);

      if (toInsert.length === 0) { db.close(); return { success: true, appended: 0 }; }

      const startOrder = existing.length;
      const insertStmt = db.prepare(
        'INSERT INTO daily_checkin (date_key, content, color, completed, sort_order) VALUES (?, ?, ?, ?, ?)'
      );
      const appendAll = db.transaction((items) => {
        items.forEach((item, idx) => {
          insertStmt.run(normalizedDateKey, item.content, item.color, item.completed, startOrder + idx);
        });
      });
      appendAll(toInsert);
      db.close();
      return { success: true, appended: toInsert.length };
    } catch (err) {
      console.error('dailyCheckin:appendTasks error:', err);
      return { success: false, error: err.message || '追加失败' };
    }
  });

  ipcMain.handle('dailyCheckin:clearAll', async () => {
    try {
      ensureDailyCheckinTable();
      const db = getWritableDb();
      db.prepare('DELETE FROM daily_checkin').run();
      db.close();
      return { success: true };
    } catch (err) {
      console.error('dailyCheckin:clearAll error:', err);
      return { success: false, error: err.message || '清空失败' };
    }
  });

  ipcMain.handle('dailyCheckin:importPlan', async (_event, payload = {}) => {
    const byDate = payload?.byDate;
    if (!byDate || typeof byDate !== 'object') {
      return { success: false, error: '导入数据格式不正确' };
    }

    try {
      ensureDailyCheckinTable();
      const db = getWritableDb();
      const insertStmt = db.prepare(`
        INSERT INTO daily_checkin (date_key, content, color, completed, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `);

      let imported = 0;
      let days = 0;

      const importAll = db.transaction((entries) => {
        db.prepare('DELETE FROM daily_checkin').run();
        for (const [rawDateKey, rawTasks] of Object.entries(entries)) {
          const dateKey = normalizeDateKey(rawDateKey);
          if (!dateKey) continue;

          const tasks = (Array.isArray(rawTasks) ? rawTasks : [])
            .map((task) => {
              const content = String(task?.content ?? '').trim();
              if (!content) return null;
              return {
                content,
                color: sanitizeTaskColor(task?.color),
                completed: task?.completed ? 1 : 0
              };
            })
            .filter(Boolean)
            .slice(0, 9);

          if (tasks.length === 0) continue;
          days += 1;
          tasks.forEach((task, idx) => {
            insertStmt.run(dateKey, task.content, task.color, task.completed, idx);
            imported += 1;
          });
        }
      });

      importAll(byDate);
      db.close();
      return { success: true, imported, days };
    } catch (err) {
      console.error('dailyCheckin:importPlan error:', err);
      return { success: false, error: err.message || '导入失败' };
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
