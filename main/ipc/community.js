import { ipcMain } from 'electron';
import { getReadOnlyDb, getWritableDb } from '../utils/db';
import { normalizePositiveInt, normalizeText, normalizeNickname } from '../utils/security';
import { getCurrentSession, requireAccountSession } from './auth';
import { resolveAvatarUrl } from './avatar';

export function ensureCommunityTables() {
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

export function registerCommunityIpc() {
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
}
