import { ipcMain } from 'electron';
import { getReadOnlyDb } from '../utils/db';
import { normalizePositiveInt } from '../utils/security';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 30;

function parseTags(value) {
  try {
    const parsed = JSON.parse(String(value || '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function serializeCaseRow(row) {
  if (!row) return null;
  return {
    ...row,
    tags: parseTags(row.tags_json),
    tags_json: undefined
  };
}

function buildCaseFilter(filters = {}) {
  const where = [];
  const params = [];

  const keyword = String(filters?.keyword ?? '').trim();
  if (keyword) {
    const likePattern = `%${keyword}%`;
    where.push(`
      (
        c.primary_school_name_zh LIKE ?
        OR c.primary_program_name_cn LIKE ?
        OR c.undergrad_tier LIKE ?
        OR c.tags_json LIKE ?
      )
    `);
    params.push(likePattern, likePattern, likePattern, likePattern);
  }

  const undergradTier = String(filters?.undergradTier ?? 'all').trim();
  if (undergradTier && undergradTier !== 'all') {
    where.push('c.undergrad_tier = ?');
    params.push(undergradTier);
  }

  const gpaBand = String(filters?.gpaBand ?? 'all').trim();
  if (gpaBand === 'high') where.push('c.gpa_value >= 4.2');
  else if (gpaBand === 'mid') where.push('c.gpa_value >= 3.3 AND c.gpa_value < 4.2');
  else if (gpaBand === 'low') where.push('c.gpa_value < 3.3');

  const languageBand = String(filters?.languageBand ?? 'all').trim();
  if (languageBand === 'strong') {
    where.push('((c.ielts_score >= 7.5) OR (c.toefl_score >= 105))');
  } else if (languageBand === 'qualified') {
    where.push('((c.ielts_score >= 6.5) OR (c.toefl_score >= 90))');
  } else if (languageBand === 'pending') {
    where.push('((IFNULL(c.ielts_score, 0) > 0 AND c.ielts_score < 6.5) OR (IFNULL(c.toefl_score, 0) > 0 AND c.toefl_score < 90) OR (IFNULL(c.ielts_score, 0) = 0 AND IFNULL(c.toefl_score, 0) = 0))');
  }

  const bgFocus = String(filters?.bgFocus ?? 'all').trim();
  if (bgFocus === 'research') where.push('c.research_count >= 3');
  else if (bgFocus === 'internship') where.push('c.internship_count >= 3');
  else if (bgFocus === 'paper') where.push('c.paper_count >= 1');
  else if (bgFocus === 'balanced') where.push('(c.internship_count + c.research_count + c.paper_count) >= 4');

  const schoolId = String(filters?.schoolId ?? '').trim();
  if (schoolId) {
    where.push(`
      EXISTS (
        SELECT 1 FROM application_case_offers f
        WHERE f.case_id = c.id AND f.school_id = ?
      )
    `);
    params.push(schoolId);
  }

  return {
    clause: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
}

function buildCaseOrder(sort = 'score_desc') {
  const normalized = String(sort || 'score_desc').trim();
  if (normalized === 'qs_asc') return 'ORDER BY primary_offer.ranking_qs ASC, c.profile_tier_score DESC, c.case_no ASC';
  if (normalized === 'gpa_desc') return 'ORDER BY c.gpa_value DESC, c.profile_tier_score DESC, c.case_no ASC';
  if (normalized === 'language_desc') {
    return 'ORDER BY MAX(IFNULL(c.ielts_score / 9.0, 0), IFNULL(c.toefl_score / 120.0, 0)) DESC, c.profile_tier_score DESC, c.case_no ASC';
  }
  return 'ORDER BY c.profile_tier_score DESC, c.case_no ASC';
}

export function registerApplicationCasesIpc() {
  ipcMain.handle('applicationCases:list', async (_event, page = 1, pageSize = DEFAULT_PAGE_SIZE, filters = {}) => {
    const normalizedPage = normalizePositiveInt(page, 1);
    const normalizedSize = Math.min(MAX_PAGE_SIZE, Math.max(1, normalizePositiveInt(pageSize, DEFAULT_PAGE_SIZE)));
    const offset = (normalizedPage - 1) * normalizedSize;
    const filter = buildCaseFilter(filters);
    const orderClause = buildCaseOrder(filters?.sort);
    const db = getReadOnlyDb();
    if (!db) return { items: [], total: 0, error: '数据库文件不存在，请先初始化院校与案例数据' };

    try {
      const baseFrom = `
        FROM application_cases c
        LEFT JOIN application_case_offers primary_offer
          ON primary_offer.case_id = c.id AND primary_offer.is_primary_offer = 1
        LEFT JOIN (
          SELECT case_id, COUNT(*) AS offer_count
          FROM application_case_offers
          GROUP BY case_id
        ) offer_stats
          ON offer_stats.case_id = c.id
      `;
      const listStmt = db.prepare(`
        SELECT
          c.id,
          c.case_no,
          c.profile_tier_score,
          c.undergrad_tier,
          c.gpa_scale,
          c.gpa_value,
          c.gpa_rank_percent,
          c.ielts_score,
          c.toefl_score,
          c.gre_score,
          c.gre_writing_score,
          c.internship_count,
          c.research_count,
          c.paper_count,
          c.tags_json,
          c.primary_school_id,
          c.primary_school_name_zh,
          c.primary_program_name_cn,
          c.primary_program_name_en,
          primary_offer.ranking_qs AS primary_ranking_qs,
          IFNULL(offer_stats.offer_count, 0) AS offer_count
        ${baseFrom}
        ${filter.clause}
        ${orderClause}
        LIMIT ? OFFSET ?
      `);
      const countStmt = db.prepare(`
        SELECT COUNT(*) AS total
        ${baseFrom}
        ${filter.clause}
      `);
      const items = listStmt.all(...filter.params, normalizedSize, offset).map(serializeCaseRow);
      const countRow = countStmt.get(...filter.params);
      return { items, total: Number(countRow?.total || 0) };
    } catch (err) {
      console.error('applicationCases:list error:', err);
      return { items: [], total: 0, error: err.message || '读取案例列表失败' };
    } finally {
      db.close();
    }
  });

  ipcMain.handle('applicationCases:getDetail', async (_event, caseId) => {
    const normalizedId = normalizePositiveInt(caseId);
    if (!normalizedId) return { caseItem: null, offers: [], error: '案例 ID 不正确' };
    const db = getReadOnlyDb();
    if (!db) return { caseItem: null, offers: [], error: '数据库文件不存在，请先初始化院校与案例数据' };

    try {
      const caseRow = db.prepare(`
        SELECT
          c.*,
          primary_offer.ranking_qs AS primary_ranking_qs
        FROM application_cases c
        LEFT JOIN application_case_offers primary_offer
          ON primary_offer.case_id = c.id AND primary_offer.is_primary_offer = 1
        WHERE c.id = ?
      `).get(normalizedId);
      const offers = db.prepare(`
        SELECT
          o.id,
          o.school_id,
          o.ranking_qs,
          o.school_name_zh,
          o.school_name_en,
          o.program_name_cn,
          o.program_name_en,
          o.offer_type,
          o.offer_tier,
          o.is_primary_offer,
          o.display_order,
          s.country_zh,
          s.country_en,
          s.city_zh,
          s.city_en
        FROM application_case_offers o
        LEFT JOIN schools s ON s.school_id = o.school_id
        WHERE o.case_id = ?
        ORDER BY o.display_order ASC, o.ranking_qs ASC, o.id ASC
      `).all(normalizedId);

      if (!caseRow) return { caseItem: null, offers: [], error: '案例不存在或已被删除' };
      return {
        caseItem: serializeCaseRow(caseRow),
        offers: offers.map((offer) => ({
          ...offer,
          is_primary_offer: Number(offer.is_primary_offer || 0) === 1
        }))
      };
    } catch (err) {
      console.error('applicationCases:getDetail error:', err);
      return { caseItem: null, offers: [], error: err.message || '读取案例详情失败' };
    } finally {
      db.close();
    }
  });

  ipcMain.handle('applicationCases:listBySchoolId', async (_event, schoolId, limit = 6) => {
    const normalizedSchoolId = String(schoolId ?? '').trim();
    const normalizedLimit = Math.min(12, Math.max(1, normalizePositiveInt(limit, 6)));
    if (!normalizedSchoolId) return { items: [], error: '院校 ID 不正确' };
    const db = getReadOnlyDb();
    if (!db) return { items: [], error: '数据库文件不存在，请先初始化院校与案例数据' };

    try {
      const items = db.prepare(`
        SELECT
          c.id,
          c.case_no,
          c.profile_tier_score,
          c.undergrad_tier,
          c.gpa_value,
          c.gpa_rank_percent,
          c.ielts_score,
          c.toefl_score,
          c.gre_score,
          c.tags_json,
          o.program_name_cn,
          o.program_name_en,
          o.offer_tier,
          o.is_primary_offer
        FROM application_case_offers o
        JOIN application_cases c ON c.id = o.case_id
        WHERE o.school_id = ?
        ORDER BY c.profile_tier_score DESC, c.case_no ASC
        LIMIT ?
      `).all(normalizedSchoolId, normalizedLimit).map(serializeCaseRow);
      return { items };
    } catch (err) {
      console.error('applicationCases:listBySchoolId error:', err);
      return { items: [], error: err.message || '读取院校相关案例失败' };
    } finally {
      db.close();
    }
  });
}
