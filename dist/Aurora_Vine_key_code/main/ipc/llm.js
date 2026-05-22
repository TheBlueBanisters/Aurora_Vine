import { ipcMain } from 'electron';
import { getDeepseekApiKey, setDeepseekApiKey, maskApiKey } from '../utils/app-config.js';
import { extractResumeText } from '../utils/resume-text.js';
import { runPromptTemplate } from '../llm/deepseek-client.js';
import { buildApplicationTimeline } from '../llm/application-timeline.js';
import {
  parseJsonFromLlm,
  validateScoreResponse,
  validateOutlineResponse,
  validateScheduleResponse,
  validateDailyTasksResponse,
  validatePersonalStatementResponse,
  entriesToSavePayload
} from '../llm/plan-schema.js';
import {
  loadSchoolCatalog,
  catalogForPrompt,
  resolveSchoolTiers
} from '../llm/school-matcher.js';
import { tasksToDbJson, taskToCheckinContent } from '../llm/i18n-content.js';
import { buildProfileForLlm } from '../llm/profile-context.js';

async function getResumeTextSafe(md5) {
  if (!md5) return '';
  const result = await extractResumeText(md5);
  return typeof result === 'string' ? result : '';
}

function profilePayloadForPrompt(profile, resumeText, scorePayload = {}) {
  return buildProfileForLlm(profile, {
    resumeText,
    totalScore: scorePayload.totalScore,
    scoreDetail: scorePayload.scoreDetail
  });
}

export function registerSettingsConfigIpc() {
  ipcMain.handle('settings:getDeepseekApiKey', async () => {
    const key = getDeepseekApiKey();
    return { masked: maskApiKey(key), configured: !!key };
  });

  ipcMain.handle('settings:setDeepseekApiKey', async (_event, apiKey) => {
    try {
      setDeepseekApiKey(apiKey);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || '保存失败' };
    }
  });
}

export function registerLlmIpc() {
  ipcMain.handle('llm:scoreResume', async (_event, payload = {}) => {
    try {
      const profile = payload?.profile || {};
      const md5 = String(payload?.md5 || '').trim();
      if (!md5) return { success: false, error: '缺少简历 MD5' };

      const resumeText = await getResumeTextSafe(md5);
      if (!resumeText) return { success: false, error: '无法读取简历文本，请重新上传' };

      const raw = await runPromptTemplate('score-resume', {
        profileJson: profilePayloadForPrompt(profile, resumeText),
        resumeText
      });
      const parsed = validateScoreResponse(parseJsonFromLlm(raw));
      return { success: true, ...parsed };
    } catch (err) {
      console.error('llm:scoreResume error:', err);
      return { success: false, error: err.message || '简历评分失败' };
    }
  });

  ipcMain.handle('llm:generateOutline', async (_event, payload = {}) => {
    try {
      const profile = payload?.profile || {};
      const md5 = String(payload?.md5 || '').trim();
      const totalScore = Number(payload?.totalScore ?? 70);
      const scoreDetail = payload?.scoreDetail || null;
      const resumeText = md5 ? await getResumeTextSafe(md5) : '';
      const timeline = buildApplicationTimeline(profile);
      const catalog = loadSchoolCatalog();
      if (catalog.length === 0) {
        return { success: false, error: '院校数据库为空，请先运行 node data/init_db.js' };
      }

      const raw = await runPromptTemplate('plan-outline', {
        profileJson: profilePayloadForPrompt(profile, resumeText, { totalScore, scoreDetail }),
        resumeText,
        timelineJson: timeline,
        schoolCatalogJson: catalogForPrompt(catalog)
      });
      const parsed = validateOutlineResponse(parseJsonFromLlm(raw));
      const schoolRecommendations = resolveSchoolTiers(
        parsed.schoolTiers,
        catalog,
        profile,
        totalScore
      );

      let encouragementNote = parsed.encouragementNote;
      if (timeline.seasonPassed && (!encouragementNote.zh || !encouragementNote.en)) {
        encouragementNote = timeline.encouragementFallback;
      }

      const outlineEntries = entriesToSavePayload(parsed.entries, 'llm', 'outline');
      return {
        success: true,
        outlineEntries,
        schoolRecommendations: {
          reach: schoolRecommendations.reach.map(({ schoolId, reason }) => ({ schoolId, reason })),
          match: schoolRecommendations.match.map(({ schoolId, reason }) => ({ schoolId, reason })),
          safety: schoolRecommendations.safety.map(({ schoolId, reason }) => ({ schoolId, reason }))
        },
        encouragementNote
      };
    } catch (err) {
      console.error('llm:generateOutline error:', err);
      return { success: false, error: err.message || '生成规划大纲失败' };
    }
  });

  ipcMain.handle('llm:generateSchedule', async (_event, payload = {}) => {
    try {
      const profile = payload?.profile || {};
      const outline = payload?.outline || {};
      const scoreDetail = payload?.scoreDetail || null;
      const totalScore = payload?.totalScore != null ? Number(payload.totalScore) : undefined;
      const md5 = String(payload?.md5 || profile?.resumeMd5 || '').trim();
      const resumeText = md5 ? await getResumeTextSafe(md5) : '';
      const timeline = buildApplicationTimeline(profile);

      const raw = await runPromptTemplate('plan-schedule', {
        profileJson: profilePayloadForPrompt(profile, resumeText, { totalScore, scoreDetail }),
        timelineJson: timeline,
        outlineJson: outline
      });
      const parsed = validateScheduleResponse(parseJsonFromLlm(raw));

      let encouragementNote = parsed.encouragementNote;
      if (timeline.seasonPassed && (!encouragementNote.zh || !encouragementNote.en)) {
        encouragementNote = timeline.encouragementFallback;
      }

      const scheduleEntries = entriesToSavePayload(parsed.entries, 'llm', 'schedule');
      return {
        success: true,
        scheduleEntries,
        encouragementNote
      };
    } catch (err) {
      console.error('llm:generateSchedule error:', err);
      return { success: false, error: err.message || '生成智能日程失败' };
    }
  });

  ipcMain.handle('llm:generateDailyTasks', async (_event, payload = {}) => {
    const profile = payload?.profile || {};
    const schedule = payload?.schedule || {};
    const scoreDetail = payload?.scoreDetail || null;
    const totalScore = payload?.totalScore != null ? Number(payload.totalScore) : undefined;
    const md5 = String(payload?.md5 || profile?.resumeMd5 || '').trim();
    const resumeText = md5 ? await getResumeTextSafe(md5) : '';
    const timeline = buildApplicationTimeline(profile);
    const variables = {
      profileJson: profilePayloadForPrompt(profile, resumeText, { totalScore, scoreDetail }),
      timelineJson: timeline,
      scheduleJson: schedule
    };

    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const raw = await runPromptTemplate('plan-daily-tasks', variables, { maxTokens: 8192 });
        const parsed = validateDailyTasksResponse(parseJsonFromLlm(raw));
        return {
          success: true,
          dailyTasks: parsed.dailyTasks
        };
      } catch (err) {
        lastError = err;
        console.error(`llm:generateDailyTasks attempt ${attempt + 1} error:`, err);
      }
    }

    return {
      success: false,
      error: lastError?.message || '生成每日打卡任务失败'
    };
  });

  ipcMain.handle('llm:generatePersonalStatement', async (_event, payload = {}) => {
    try {
      const profile = payload?.profile || {};
      const md5 = String(payload?.md5 || '').trim();
      const totalScore = Number(payload?.totalScore ?? 70);
      const scoreDetail = payload?.scoreDetail || null;
      const resumeText = md5 ? await getResumeTextSafe(md5) : '';

      const raw = await runPromptTemplate('personal-statement', {
        profileJson: profilePayloadForPrompt(profile, resumeText, { totalScore, scoreDetail }),
        resumeText,
        totalScore
      });
      const parsed = validatePersonalStatementResponse(parseJsonFromLlm(raw));
      return { success: true, statement: parsed.statement };
    } catch (err) {
      console.error('llm:generatePersonalStatement error:', err);
      return { success: false, error: err.message || '生成个人陈述失败' };
    }
  });
}

export { tasksToDbJson, taskToCheckinContent };
