import { normalizeGpaTopPercent } from '../utils/gpa-percent.js';
import { buildStudyPreferencesBlock } from './study-preferences.js';

const TIER_LABELS = {
  '985': { zh: '985 工程院校', en: '985 Project university' },
  '211': { zh: '211 工程院校', en: '211 Project university' },
  '双非': { zh: '双非院校', en: 'Non-985/211 domestic university' },
  '海本': { zh: '海外本科', en: 'Overseas undergraduate' },
  '海外本科': { zh: '海外本科', en: 'Overseas undergraduate' }
};

function tierLabel(tier) {
  return TIER_LABELS[tier] || { zh: tier || '未填写', en: tier || 'Not specified' };
}

function parseOptionalFloat(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function parseOptionalInt(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

function buildTestEntry(value, { min, max, label, unit = '' }) {
  if (value === null || value === undefined || value === '') {
    return {
      status: 'not_taken',
      label,
      display: { zh: `${label.zh}：未考/暂未提交`, en: `${label.en}: not taken / not provided` }
    };
  }

  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  if (!Number.isFinite(parsed) || (min != null && parsed < min) || (max != null && parsed > max)) {
    return {
      status: 'invalid',
      label,
      raw: value,
      display: { zh: `${label.zh}：数据异常 (${value})`, en: `${label.en}: invalid value (${value})` }
    };
  }

  const formatted = Number.isInteger(parsed) ? String(parsed) : parsed.toFixed(1);
  return {
    status: 'reported',
    label,
    value: parsed,
    unit,
    display: {
      zh: `${label.zh}：${formatted}${unit}`,
      en: `${label.en}: ${formatted}${unit}`
    }
  };
}

function buildExperienceCounts(profile) {
  const researchCount = parseOptionalInt(profile.researchCount) ?? 0;
  const internshipCount = parseOptionalInt(profile.internshipCount) ?? 0;
  const paperCount = parseOptionalInt(profile.paperCount) ?? 0;

  return {
    researchCount,
    internshipCount,
    paperCount,
    display: {
      zh: `科研 ${researchCount} 段，实习 ${internshipCount} 段，论文/发表 ${paperCount} 篇`,
      en: `Research: ${researchCount}; Internships: ${internshipCount}; Papers/publications: ${paperCount}`
    }
  };
}

function buildGpaBlock(profile) {
  const gpa = parseOptionalFloat(profile.gpa);
  const scale = profile.gpaScale === '5' ? 5 : 4;
  const topPercent = normalizeGpaTopPercent(profile.gpaPercentile);

  if (gpa == null) {
    return {
      value: null,
      scale,
      topPercent,
      percentile: topPercent,
      display: { zh: 'GPA：未填写', en: 'GPA: not provided' }
    };
  }

  const pctText = topPercent != null ? `，年级排名前 ${topPercent}%` : '';
  const pctTextEn = topPercent != null ? `, top ${topPercent}% of class` : '';

  return {
    value: gpa,
    scale,
    topPercent,
    percentile: topPercent,
    display: {
      zh: `GPA ${gpa}/${scale}${pctText}`,
      en: `GPA ${gpa}/${scale}${pctTextEn}`
    }
  };
}

function buildStandardizedTests(profile) {
  const ielts = buildTestEntry(profile.ielts, {
    min: 4,
    max: 9,
    label: { zh: '雅思', en: 'IELTS overall' }
  });
  const toefl = buildTestEntry(profile.toefl, {
    min: 70,
    max: 120,
    label: { zh: '托福', en: 'TOEFL iBT' }
  });
  const gre = buildTestEntry(profile.gre, {
    min: 260,
    max: 340,
    label: { zh: 'GRE 总分', en: 'GRE total' }
  });
  const greWriting = buildTestEntry(profile.greWriting, {
    min: 0,
    max: 6,
    label: { zh: 'GRE 写作', en: 'GRE Analytical Writing' }
  });

  const reported = [ielts, toefl, gre].filter((t) => t.status === 'reported');
  let primary = null;
  if (ielts.status === 'reported') primary = ielts.display;
  else if (toefl.status === 'reported') primary = toefl.display;
  else if (gre.status === 'reported') primary = gre.display;

  return {
    ielts,
    toefl,
    gre,
    greWriting: gre.status === 'reported' || greWriting.status === 'reported' ? greWriting : {
      ...greWriting,
      status: gre.status === 'not_taken' ? 'not_taken' : greWriting.status
    },
    primaryLanguageScore: primary,
    summary: {
      zh: [ielts, toefl, gre, greWriting].map((t) => t.display.zh).join('；'),
      en: [ielts, toefl, gre, greWriting].map((t) => t.display.en).join('; ')
    }
  };
}

function buildBackgroundNarrative(structured, hasResume) {
  const { academic, standardizedTests, experience, competitiveness } = structured;
  const tier = academic.institutionTierLabel;

  const zhParts = [
    `申请人就读于${academic.schoolName || '（院校未填）'}（${tier.zh}），${academic.major || '专业未填'}，预计 ${academic.graduationYear || '—'} 年毕业。`,
    academic.gpa.display.zh,
    `标化成绩：${standardizedTests.summary.zh}。`,
    experience.display.zh
  ];

  const enParts = [
    `The applicant studies at ${academic.schoolName || '(school not specified)'} (${tier.en}), majoring in ${academic.major || '(major not specified)'}, expected graduation ${academic.graduationYear || '—'}.`,
    academic.gpa.display.en,
    `Standardized tests: ${standardizedTests.summary.en}.`,
    experience.display.en
  ];

  if (competitiveness?.totalScore != null) {
    zhParts.push(`系统综合竞争力评分约 ${competitiveness.totalScore}/100（无简历时仅基于表单标化与背景计数）。`);
    enParts.push(`Estimated competitiveness score: ${competitiveness.totalScore}/100 (form-based only when no resume).`);
  }

  if (structured.studyPreferences?.display?.zh) {
    zhParts.push(structured.studyPreferences.display.zh);
    enParts.push(structured.studyPreferences.display.en);
  }

  if (hasResume) {
    zhParts.push('详细经历见下方简历文本。');
    enParts.push('See resume text below for detailed experiences.');
  } else {
    zhParts.push('未上传简历；请主要依据上述结构化标化信息与背景计数进行分析与撰写。');
    enParts.push('No resume uploaded; base analysis and writing primarily on the structured test scores and background counts above.');
  }

  if (structured.llmResumeReview?.summary?.zh) {
    zhParts.push(`简历评估摘要：${structured.llmResumeReview.summary.zh}`);
    enParts.push(`Resume review summary: ${structured.llmResumeReview.summary.en}`);
  }

  return { zh: zhParts.join(' '), en: enParts.join(' ') };
}

/**
 * Organize school-planning form data into a structured LLM context.
 * When no resume is provided, backgroundNarrative becomes the primary evidence source.
 */
export function buildProfileForLlm(profile = {}, options = {}) {
  const { totalScore, scoreDetail, resumeText = '' } = options;
  const hasResume = Boolean(String(resumeText || '').trim());
  const tier = tierLabel(profile.institutionTier);

  const standardizedTests = buildStandardizedTests(profile);
  const experience = buildExperienceCounts(profile);
  const gpa = buildGpaBlock(profile);

  const competitiveness = totalScore != null
    ? {
        totalScore: Number(totalScore),
        breakdown: scoreDetail && typeof scoreDetail === 'object'
          ? {
              gpa: scoreDetail.gpa ?? null,
              language: scoreDetail.lang ?? null,
              background: scoreDetail.bg ?? null,
              schoolTier: scoreDetail.school ?? null,
              resumeReview: scoreDetail.llm ?? null
            }
          : null
      }
    : null;

  const llmResumeReview = profile.llmScore != null && profile.llmScore !== ''
    ? {
        score: Number(profile.llmScore),
        summary: profile.llmSummary || null
      }
    : null;

  const studyPreferences = buildStudyPreferencesBlock(profile);

  const structured = {
    studyPreferences,
    academic: {
      graduationYear: parseOptionalInt(profile.graduationYear),
      institutionTier: profile.institutionTier || null,
      institutionTierLabel: tier,
      schoolName: profile.schoolName || null,
      major: profile.major || null,
      gpa
    },
    standardizedTests,
    experience,
    resume: {
      provided: hasResume,
      fileName: profile.resumeFile || profile.resumeMd5 || null
    },
    llmResumeReview,
    competitiveness
  };

  const backgroundNarrative = buildBackgroundNarrative(structured, hasResume);

  return {
    ...structured,
    dataSources: {
      resumeProvided: hasResume,
      primaryEvidence: hasResume ? 'resume_and_structured_form' : 'structured_form_only'
    },
    backgroundNarrative,
    guidanceForModel: hasResume
      ? {
          zh: '结合 backgroundNarrative、standardizedTests 与简历全文进行分析。',
          en: 'Combine backgroundNarrative, standardizedTests, and the full resume text.'
        }
      : {
          zh: '未提供简历：务必基于 standardizedTests、academic、experience 与 backgroundNarrative 撰写，不可臆造简历细节。',
          en: 'No resume: rely on standardizedTests, academic, experience, and backgroundNarrative; do not invent resume details.'
        }
  };
}
