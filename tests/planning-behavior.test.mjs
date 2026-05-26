import { test } from 'node:test';
import assert from 'node:assert/strict';

import { gpaToPercent, gpaConversionRuleText } from '../main/utils/gpa-conversion.js';
import { buildApplicationTimeline } from '../main/llm/application-timeline.js';
import { normalizePreferredRegions, filterCatalogByRegions } from '../main/llm/study-preferences.js';
import { buildProfileForLlm } from '../main/llm/profile-context.js';
import {
  countSubmitPipelineSteps,
  countOutlineSegmentSteps,
  countSmartRegenerateSteps
} from '../renderer/modules/loading.js';
import {
  composeFullPipelineResult,
  buildOutlinePayloadFromEntries
} from '../renderer/modules/pipeline-compose.js';

test('gpaToPercent: 5 分制锚点精确匹配用户规则', () => {
  assert.equal(gpaToPercent(3.0, 5), 80);
  assert.equal(gpaToPercent(3.5, 5), 85);
  assert.equal(gpaToPercent(4.0, 5), 90);
  assert.equal(gpaToPercent(4.5, 5), 95);
  assert.equal(gpaToPercent(5.0, 5), 100);
  assert.equal(gpaToPercent(2.0, 5), 70);
  assert.equal(gpaToPercent(0.0, 5), 50);
});

test('gpaToPercent: 5 分制中间值线性插值', () => {
  assert.equal(gpaToPercent(3.25, 5), 82.5);
  assert.equal(gpaToPercent(3.75, 5), 87.5);
  assert.equal(gpaToPercent(4.2, 5), 92);
});

test('gpaToPercent: 4 分制锚点（WES 习惯）', () => {
  assert.equal(gpaToPercent(4.0, 4), 90);
  assert.equal(gpaToPercent(3.7, 4), 87);
  assert.equal(gpaToPercent(3.5, 4), 85);
  assert.equal(gpaToPercent(3.0, 4), 80);
  assert.equal(gpaToPercent(2.0, 4), 75);
  assert.equal(gpaToPercent(1.0, 4), 65);
});

test('gpaToPercent: 处理非法输入', () => {
  assert.equal(gpaToPercent(null, 5), null);
  assert.equal(gpaToPercent(undefined, 5), null);
  assert.equal(gpaToPercent('', 5), null);
  assert.equal(gpaToPercent('abc', 5), null);
});

test('gpaToPercent: 字符串 scale 也能识别', () => {
  assert.equal(gpaToPercent(3.5, '5'), 85);
  assert.equal(gpaToPercent(3.5, '4'), 85);
});

test('gpaConversionRuleText: 包含 5 分制锚点表', () => {
  const rule = gpaConversionRuleText(5);
  assert.ok(rule.zh.includes('3.0→80'));
  assert.ok(rule.zh.includes('3.5→85'));
  assert.ok(rule.zh.includes('4.0→90'));
  assert.ok(rule.en.includes('3.0→80'));
});

test('buildProfileForLlm: GPA display 包含百分制换算与换算规则', () => {
  const ctx = buildProfileForLlm({
    gpa: '3.5',
    gpaScale: '5',
    gpaPercentile: '30',
    graduationYear: '2027',
    institutionTier: '211',
    schoolName: '某 211 大学',
    major: 'CS',
    ielts: 7,
    researchCount: 1,
    internshipCount: 1,
    paperCount: 0
  });
  assert.equal(ctx.academic.gpa.percentage, 85);
  assert.equal(ctx.academic.gpa.scale, 5);
  assert.ok(ctx.academic.gpa.display.zh.includes('85'), `expected display to mention 85, got: ${ctx.academic.gpa.display.zh}`);
  assert.ok(!/约\s*70\s*%/.test(ctx.academic.gpa.display.zh), 'should not produce the wrong 70% conversion');
  assert.ok(ctx.academic.gpa.conversionRule.zh.includes('3.5→85'));
});

test('normalizePreferredRegions: 接收数组并过滤未知键', () => {
  assert.deepEqual(normalizePreferredRegions(['us', 'uk', 'foo']), ['us', 'uk']);
  assert.deepEqual(normalizePreferredRegions(['sg_hk', 'ca']), ['sg_hk', 'ca']);
  assert.deepEqual(normalizePreferredRegions([]), []);
  assert.deepEqual(normalizePreferredRegions(null), []);
});

test('filterCatalogByRegions: 多个地区取并集（多选场景）', () => {
  const catalog = [
    { school_id: 1, country_zh: '美国', country_en: 'United States' },
    { school_id: 2, country_zh: '英国', country_en: 'United Kingdom' },
    { school_id: 3, country_zh: '加拿大', country_en: 'Canada' },
    { school_id: 4, country_zh: '澳大利亚', country_en: 'Australia' },
    { school_id: 5, country_zh: '新加坡', country_en: 'Singapore' }
  ];

  const us = filterCatalogByRegions(catalog, ['us']);
  assert.deepEqual(us.map((s) => s.school_id), [1]);

  const usUk = filterCatalogByRegions(catalog, ['us', 'uk']);
  assert.deepEqual(usUk.map((s) => s.school_id).sort(), [1, 2]);

  const usUkSg = filterCatalogByRegions(catalog, ['us', 'uk', 'sg_hk']);
  assert.deepEqual(usUkSg.map((s) => s.school_id).sort(), [1, 2, 5]);

  const all = filterCatalogByRegions(catalog, []);
  assert.equal(all.length, catalog.length);
});

test('buildApplicationTimeline: 包含 milestones 与 regionGuidance', () => {
  const tl = buildApplicationTimeline({ graduationYear: 2027, preferredRegions: ['us', 'sg_hk'] });
  assert.equal(tl.graduationYear, 2027);
  assert.equal(tl.targetIntakeYear, 2027);
  assert.equal(tl.applicationSeasonYear, 2026);
  assert.ok(Array.isArray(tl.milestones) && tl.milestones.length >= 10, 'should generate 10+ milestones');
  assert.ok(Array.isArray(tl.regionGuidance) && tl.regionGuidance.length === 2);
  assert.equal(tl.regionGuidance[0].key, 'us');
  assert.equal(tl.regionGuidance[1].key, 'sg_hk');
});

test('buildApplicationTimeline: 关键节点日期符合 2026-2027 实际申请季', () => {
  const tl = buildApplicationTimeline({ graduationYear: 2027 });
  const byKey = Object.fromEntries(tl.milestones.map((m) => [m.key, m]));

  // 美国 Tier-1: 12 月初
  assert.equal(byKey.us_tier1_deadlines.dateStart, '2026-12-01');
  assert.equal(byKey.us_tier1_deadlines.dateEnd, '2026-12-31');

  // 美国常规批: 1 月
  assert.equal(byKey.us_regular_deadlines.dateStart, '2027-01-01');
  assert.equal(byKey.us_regular_deadlines.dateEnd, '2027-01-31');

  // NUS 主轮 / NTU Round 2: 1 月底 - 2 月底
  assert.equal(byKey.nus_regular_deadlines.dateStart, '2027-01-15');
  assert.equal(byKey.nus_regular_deadlines.dateEnd, '2027-02-28');

  // Oxford 早轮: 11 月
  assert.equal(byKey.oxford_priority.dateStart, '2026-11-01');
  assert.equal(byKey.oxford_priority.dateEnd, '2026-12-05');

  // 决定通知期: 2-4 月
  assert.equal(byKey.decision_offers.dateStart, '2027-02-01');
  assert.equal(byKey.decision_offers.dateEnd, '2027-04-30');

  // 签证准备: 4 月中 - 6 月
  assert.equal(byKey.accept_visa.dateStart, '2027-04-15');
  assert.equal(byKey.accept_visa.dateEnd, '2027-06-30');

  // 行前准备: 6-8 月
  assert.equal(byKey.pre_departure.dateStart, '2027-06-01');
  assert.equal(byKey.pre_departure.dateEnd, '2027-08-15');
});

test('buildApplicationTimeline: planEndDate 覆盖到入学开学', () => {
  const tl = buildApplicationTimeline({ graduationYear: 2027 });
  assert.equal(tl.planEndDate, '2027-09-30');
});

test('buildApplicationTimeline: 无地区偏好时返回全部地区指引', () => {
  const tl = buildApplicationTimeline({ graduationYear: 2027 });
  assert.ok(tl.regionGuidance.length >= 6);
  const keys = tl.regionGuidance.map((g) => g.key);
  assert.ok(keys.includes('us'));
  assert.ok(keys.includes('uk'));
  assert.ok(keys.includes('sg_hk'));
});

// ──────────────────────────────────────────────────────────
// 「提交即一次性跑完 outline + schedule + dailyTasks + 分发」回归测试
// ──────────────────────────────────────────────────────────

test('countSubmitPipelineSteps: 合并提交模式包含 schedule/dailyTasks/checkin 分发步骤', () => {
  // 基础组合（无简历、无 PS）：outline 段 2 步 + schedule 段 3 步 = 5 步
  assert.equal(countSubmitPipelineSteps(), 5);
  assert.equal(countSubmitPipelineSteps({}), 5);

  // 带简历：+2 步（上传 + 评分）
  assert.equal(countSubmitPipelineSteps({ resumeFile: {} }), 7);

  // 带 PS：+1 步
  assert.equal(countSubmitPipelineSteps({ generatePersonalStatement: true }), 6);

  // 简历 + PS：+3 步
  assert.equal(
    countSubmitPipelineSteps({ resumeFile: {}, generatePersonalStatement: true }),
    8
  );

  // 显式关闭 schedule 段时退化到老的 outline-only 计数
  assert.equal(
    countSubmitPipelineSteps({ includeSmartSchedule: false }),
    countOutlineSegmentSteps()
  );
  assert.equal(
    countSubmitPipelineSteps({ resumeFile: {}, includeSmartSchedule: false }),
    countOutlineSegmentSteps({ resumeFile: {} })
  );
});

test('countSubmitPipelineSteps: 合并步骤数等于 outline + schedule 段之和', () => {
  // schedule 段恒为 3（generateSchedule + generateDailyTasks + 分发）
  assert.equal(countSmartRegenerateSteps(), 3);

  const cases = [
    { resumeFile: null, generatePersonalStatement: false },
    { resumeFile: { name: 'cv.pdf' }, generatePersonalStatement: false },
    { resumeFile: null, generatePersonalStatement: true },
    { resumeFile: { name: 'cv.pdf' }, generatePersonalStatement: true }
  ];
  for (const opts of cases) {
    const merged = countSubmitPipelineSteps({ ...opts, includeSmartSchedule: true });
    const outline = countOutlineSegmentSteps(opts);
    assert.equal(
      merged,
      outline + countSmartRegenerateSteps(),
      `merged steps should equal outline+smart for ${JSON.stringify(opts)}`
    );
  }
});

test('composeFullPipelineResult: schedule 段失败时仍保留 outline 段所有结果', () => {
  // 注意：合并 pipeline 入口 runFullSchoolPlanningPipeline 依赖 Electron preload (window.api)
  // 与 DOM（showLoading），不便在 node:test 中直接 mock。
  // 因此把「失败后如何合并结果」这条关键不变量抽出到纯函数 composeFullPipelineResult，
  // 让本测试可以无 mock、确定性地验证：schedule 失败 → outline 结果不丢、smartError 暴露。

  const outlineResult = {
    profile: { schoolName: 'A 大学', llmEncouragementNote: { zh: '加油', en: 'You got this' } },
    scoreResult: { totalScore: 78.5, detail: { gpa: 30 } },
    outlineCount: 4,
    outlineEntries: [
      { title: { zh: '优势', en: 'Strength' }, description: { zh: 'GPA 出色', en: 'Strong GPA' } },
      { title: { zh: '提升', en: 'Improvement' }, description: { zh: '补语言', en: 'Improve language' } }
    ]
  };
  const smartError = new Error('schedule LLM timeout');

  const merged = composeFullPipelineResult(outlineResult, { smartResult: null, smartError });

  // outline 段所有信息都应该原样保留
  assert.equal(merged.profile, outlineResult.profile);
  assert.equal(merged.scoreResult, outlineResult.scoreResult);
  assert.equal(merged.outlineCount, 4);
  assert.equal(merged.outlineEntries.length, 2);
  // schedule 段失败：smartResult 为 null，smartError 应能透传给上层用于提示
  assert.equal(merged.smartResult, null);
  assert.equal(merged.smartError, smartError);
  assert.equal(merged.smartError.message, 'schedule LLM timeout');
});

test('composeFullPipelineResult: schedule 段成功时优先使用 schedule 段的 profile（带有 encouragementNote）', () => {
  const outlineResult = {
    profile: { schoolName: 'B 大学' },
    scoreResult: { totalScore: 81, detail: { gpa: 32 } },
    outlineCount: 3,
    outlineEntries: [{ title: { zh: 't', en: 't' }, description: { zh: 'd', en: 'd' } }]
  };
  const smartResult = {
    profile: { schoolName: 'B 大学', llmEncouragementNote: { zh: '快冲', en: 'Push it' } },
    scheduleCount: 5,
    appended: 120,
    skipped: 0,
    days: 60,
    expectedTasks: 120,
    coverage: { totalDays: 60, coveredDays: 60, coverageRatio: 1 },
    dailyWarning: null
  };

  const merged = composeFullPipelineResult(outlineResult, { smartResult, smartError: null });
  assert.equal(merged.profile, smartResult.profile, 'should prefer smart segment profile');
  assert.equal(merged.smartResult, smartResult);
  assert.equal(merged.smartError, null);
  assert.equal(merged.outlineCount, 3);
});

test('composeFullPipelineResult: 缺失 outlineResult 直接抛错（防御性）', () => {
  assert.throws(() => composeFullPipelineResult(null), /outlineResult is required/);
  assert.throws(() => composeFullPipelineResult(undefined, {}), /outlineResult is required/);
});

test('buildOutlinePayloadFromEntries: 直接复用刚生成的 outlineEntries（不回读 DB）', () => {
  // 这是合并流程绕开「时序/缓存问题」的关键 helper：把刚 save 完的 entries 直接喂给 schedule 段。
  const profile = {
    schoolRecommendations: { reach: [{ schoolId: '1' }], match: [], safety: [] },
    llmEncouragementNote: { zh: '稳住', en: 'Stay focused' }
  };
  const entries = [
    {
      title: { zh: '优势', en: 'Strength' },
      description: { zh: 'GPA 4.0', en: 'GPA 4.0' },
      // tasks 字段应被忽略，schedule 段只关心标题/简介
      tasks: [{ content: 'should be dropped' }]
    },
    { title: { zh: '提升', en: 'Improvement' }, description: { zh: '补语言', en: 'Improve language' } }
  ];

  const payload = buildOutlinePayloadFromEntries(profile, entries);
  assert.equal(payload.entries.length, 2);
  assert.deepEqual(payload.entries[0].tasks, [], 'tasks should be reset to empty');
  assert.deepEqual(payload.entries[0].title, entries[0].title);
  assert.deepEqual(payload.entries[0].description, entries[0].description);
  assert.equal(payload.schoolRecommendations, profile.schoolRecommendations);
  assert.equal(payload.encouragementNote, profile.llmEncouragementNote);
});

test('buildOutlinePayloadFromEntries: profile 字段缺失时填充安全默认值', () => {
  const payload = buildOutlinePayloadFromEntries({}, []);
  assert.deepEqual(payload.schoolRecommendations, { reach: [], match: [], safety: [] });
  assert.deepEqual(payload.encouragementNote, { zh: '', en: '' });
  assert.deepEqual(payload.entries, []);

  // 兼容 null 入参
  const payload2 = buildOutlinePayloadFromEntries({}, null);
  assert.deepEqual(payload2.entries, []);
});
