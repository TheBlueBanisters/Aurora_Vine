function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function makeDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * 根据真实申请季关键节点（基于 2026–2027 申请季公开信息）生成里程碑。
 * 所有日期使用申请季年份 N（= 入学年 - 1），覆盖意向地区：US / UK / SG / HK / EU / CA / AU 等。
 * 参考来源：NUS/NTU/HKU 官方页面、Oxford Graduate Admissions、Common App、各高校公开公告（2026/05 检索）。
 */
function buildApplicationMilestones(applicationSeasonYear) {
  const N = applicationSeasonYear;
  const nextYear = N + 1;

  return [
    {
      key: 'standardized_tests',
      title: { zh: '语言/标化最终考期', en: 'Final language & standardized test window' },
      dateStart: formatDate(makeDate(N, 6, 1)),
      dateEnd: formatDate(makeDate(N, 10, 15)),
      detail: {
        zh: '雅思/托福建议在 6–9 月完成达标考期，GRE 首考 6–8 月、补考 9 月，10 月前完成正式送分（多数欧美/亚洲院校的成绩有效期需覆盖申请季）。',
        en: 'Take IELTS/TOEFL between Jun and Sep; first GRE attempt Jun–Aug with a Sep retake window. Send official scores by mid-Oct to cover most US/UK/SG/HK deadlines.'
      }
    },
    {
      key: 'resume_letters_prep',
      title: { zh: '简历定稿与推荐人沟通', en: 'Resume finalization & recommender outreach' },
      dateStart: formatDate(makeDate(N, 7, 1)),
      dateEnd: formatDate(makeDate(N, 9, 30)),
      detail: {
        zh: '7–9 月完成 CV/简历定稿，并与 2–3 位推荐人（科研导师、实习主管/课业老师）确认时间线、共享 PS 与推荐要点。',
        en: 'Finalize CV/resume by Sep; line up 2–3 recommenders (research advisor, internship manager, academic instructor) with shared PS context and timeline.'
      }
    },
    {
      key: 'ps_first_draft',
      title: { zh: 'PS / 文书初稿', en: 'PS / SOP first draft' },
      dateStart: formatDate(makeDate(N, 9, 1)),
      dateEnd: formatDate(makeDate(N, 10, 31)),
      detail: {
        zh: '9–10 月完成通用版 PS/SOP 初稿，建立故事线（学术兴趣、研究/项目证据、为何选该校/项目、职业规划）。',
        en: 'Draft a general PS/SOP between Sep and Oct: academic motivation, research/project evidence, fit with target programs, career path.'
      }
    },
    {
      key: 'us_portals_open',
      title: { zh: '美国研究生申请门户开放', en: 'US graduate application portals open' },
      dateStart: formatDate(makeDate(N, 9, 1)),
      dateEnd: formatDate(makeDate(N, 10, 31)),
      detail: {
        zh: '多数美国 MS/PhD 项目 9 月底前开放申请通道（如 ApplyWeb、CollegeNet、各校独立系统），10 月填写背景与成绩、上传推荐人邀请。',
        en: 'Most US MS/PhD portals open by late Sep (ApplyWeb, CollegeNet or school-specific). Use Oct to seed background, scores, and recommender invites.'
      }
    },
    {
      key: 'oxford_priority',
      title: { zh: 'Oxford / Cambridge 早轮截止', en: 'Oxford / Cambridge priority deadlines' },
      dateStart: formatDate(makeDate(N, 11, 1)),
      dateEnd: formatDate(makeDate(N, 12, 5)),
      detail: {
        zh: 'Oxford 多数硕士项目首轮截止集中在 11 月底–12 月初（同时也是奖学金考虑截止）；Cambridge 多数为 12 月初–1 月初。建议作为英国冲刺校最早 deadline。',
        en: 'Most Oxford master’s programs have priority deadlines in late Nov–early Dec (also the scholarship cut-off); Cambridge follows in Dec–early Jan. Treat as the earliest UK reach deadlines.'
      }
    },
    {
      key: 'ntu_round1',
      title: { zh: 'NTU Round 1 / NUS 早轮奖学金', en: 'NTU Round 1 & NUS scholarship priority' },
      dateStart: formatDate(makeDate(N, 11, 1)),
      dateEnd: formatDate(makeDate(N, 12, 15)),
      detail: {
        zh: 'NTU 多数硕士项目 Round 1 截止约 11 月底；NUS BAC/部分奖学金 12 月 15 日截止，建议同步完成。',
        en: 'NTU master programs typically close Round 1 in late Nov; NUS BAC and several scholarship cut-offs land around Dec 15. Submit early for scholarship consideration.'
      }
    },
    {
      key: 'us_tier1_deadlines',
      title: { zh: '美国 Tier-1 项目主截止', en: 'US Tier-1 master/PhD primary deadlines' },
      dateStart: formatDate(makeDate(N, 12, 1)),
      dateEnd: formatDate(makeDate(N, 12, 31)),
      detail: {
        zh: '美国 Top 项目 MS/PhD 主截止集中在 12/1–12/15（如 CMU、Stanford、MIT 多数），部分到 12/31。需在此前完成 PS 定稿、推荐信提交。',
        en: 'Top US MS/PhD deadlines cluster between Dec 1 and Dec 15 (CMU, Stanford, MIT etc.), with a few stretching to Dec 31. Submit PS and rec letters before this window.'
      }
    },
    {
      key: 'hk_main_round',
      title: { zh: '港校主轮截止', en: 'HK main application round' },
      dateStart: formatDate(makeDate(N, 12, 1)),
      dateEnd: formatDate(nextYear === N + 1 ? makeDate(nextYear, 2, 28) : makeDate(N, 12, 31)),
      detail: {
        zh: 'HKU / CUHK / HKUST 多数授课型硕士主轮截止集中在 12 月–次年 2 月（部分滚动）。建议第一轮在 12 月底前提交以争取早 offer。',
        en: 'HKU / CUHK / HKUST taught master programs run main rounds Dec–Feb (some rolling). Submit by late Dec for early decisions.'
      }
    },
    {
      key: 'us_regular_deadlines',
      title: { zh: '美国常规批主截止', en: 'US regular-round deadlines' },
      dateStart: formatDate(makeDate(nextYear, 1, 1)),
      dateEnd: formatDate(makeDate(nextYear, 1, 31)),
      detail: {
        zh: '美国大部分研究生项目常规批集中在 1/1–1/15，少数 1/31 截止。此阶段需完成所有 supplementary essays 与 fee waiver 处理。',
        en: 'Mainstream US grad regular deadlines fall Jan 1–Jan 15, with a handful at Jan 31. Wrap up supplementary essays and fee waivers in this window.'
      }
    },
    {
      key: 'nus_regular_deadlines',
      title: { zh: 'NUS 主轮 / NTU Round 2 截止', en: 'NUS main round & NTU Round 2' },
      dateStart: formatDate(makeDate(nextYear, 1, 15)),
      dateEnd: formatDate(makeDate(nextYear, 2, 28)),
      detail: {
        zh: 'NUS 多数硕士项目主轮截止集中在 1 月底–2 月底；NTU Round 2 一般 1/31。优先递交以保留更多奖学金机会。',
        en: 'NUS master programs’ primary round runs late Jan to late Feb; NTU Round 2 deadline lands around Jan 31. Submit early to keep scholarship windows open.'
      }
    },
    {
      key: 'uk_rolling_main',
      title: { zh: '英国其他高校主轮 / 滚动批', en: 'UK rolling/main rounds (UCL, Imperial, KCL, LSE...)' },
      dateStart: formatDate(makeDate(N, 10, 1)),
      dateEnd: formatDate(makeDate(nextYear, 4, 30)),
      detail: {
        zh: 'UCL/Imperial/KCL/LSE 等多数项目滚动审理，热门方向（CS、AI、金融）通常 1–3 月名额吃紧，建议 12 月前完成首批投递。',
        en: 'UCL/Imperial/KCL/LSE primarily run rolling admissions; popular tracks (CS, AI, finance) often fill by Jan–Mar. Submit the first batch by Dec.'
      }
    },
    {
      key: 'interview_window',
      title: { zh: '面试与补充材料窗口', en: 'Interview & supplemental documents window' },
      dateStart: formatDate(makeDate(nextYear, 1, 15)),
      dateEnd: formatDate(makeDate(nextYear, 3, 31)),
      detail: {
        zh: '美国 PhD、部分 MS、港新及英国名校项目集中在 1 月中–3 月安排面试；同步准备补充材料、coding test、video essay。',
        en: 'US PhD, some MS, plus top HK/SG/UK programs run interviews Jan–Mar. Prepare supplemental docs, coding tests, and video essays during this window.'
      }
    },
    {
      key: 'decision_offers',
      title: { zh: '录取通知与奖学金决定', en: 'Admission decisions & funding outcomes' },
      dateStart: formatDate(makeDate(nextYear, 2, 1)),
      dateEnd: formatDate(makeDate(nextYear, 4, 30)),
      detail: {
        zh: '主要录取与奖学金通知集中在 2–4 月。建议建立 offer 对比表（学费、生活成本、就业资源、ranking、地理位置）以确定最终入学。',
        en: 'Most offers and scholarship decisions arrive between Feb and Apr. Build a comparison table (tuition, COL, career resources, ranking, location) before committing.'
      }
    },
    {
      key: 'accept_visa',
      title: { zh: '确认入学 / 签证申请', en: 'Enrollment confirmation & visa application' },
      dateStart: formatDate(makeDate(nextYear, 4, 15)),
      dateEnd: formatDate(makeDate(nextYear, 6, 30)),
      detail: {
        zh: '4 月中–6 月：确认 offer、缴定金、办理 I-20/CAS/STP 等签证文件，预约美/英/澳/加签证，办理体检与疫苗。',
        en: 'Apr–Jun: confirm offer & deposit, secure I-20/CAS/STP, book visa appointments (US/UK/AU/CA), complete medical and vaccination requirements.'
      }
    },
    {
      key: 'pre_departure',
      title: { zh: '行前准备（住宿/机票/行李）', en: 'Pre-departure: housing, flights & logistics' },
      dateStart: formatDate(makeDate(nextYear, 6, 1)),
      dateEnd: formatDate(makeDate(nextYear, 8, 15)),
      detail: {
        zh: '6 月起：宿舍/校外租房签约、机票预订、保险与海外账户、行李清单、抵达后报到 onboarding 安排。',
        en: 'From Jun: secure dorm/off-campus lease, book flights, set up insurance & overseas account, finalize luggage checklist and arrival onboarding.'
      }
    }
  ];
}

const REGION_DEADLINE_HINTS = {
  us: {
    zh: '美国研究生：早轮 11–12 月（少数项目）；Tier-1 主截止 12/1–12/15；常规批 1/1–1/15；少量 1/31。决定通知 2–4 月。',
    en: 'US grad: early round Nov–Dec (limited), Tier-1 primary Dec 1–15, regular Jan 1–15 with a few Jan 31. Decisions Feb–Apr.'
  },
  uk: {
    zh: '英国：Oxford 多数项目 11/底–12/初；Cambridge 12–1 月；UCL/Imperial/KCL/LSE 滚动审理，热门方向 1–3 月饱和。',
    en: 'UK: Oxford most programs late Nov–early Dec; Cambridge Dec–Jan; UCL/Imperial/KCL/LSE rolling, popular tracks fill by Jan–Mar.'
  },
  sg_hk: {
    zh: '新加坡/港澳：NTU Round 1 ~11/底，Round 2 ~1/31；NUS 主截止 1/底–2/底，奖学金 12/15；HKU/CUHK/HKUST 主轮 12 月–次年 2 月。',
    en: 'SG/HK: NTU Round 1 late Nov, Round 2 ~Jan 31; NUS primary late Jan–Feb (scholarships Dec 15); HKU/CUHK/HKUST main rounds Dec–Feb.'
  },
  eu: {
    zh: '欧洲大陆：ETH/EPFL 12–1 月；荷兰/北欧/德国 1–3 月（部分提前 1/15 国际生）；意/法 12 月–次年 4 月。',
    en: 'EU continental: ETH/EPFL Dec–Jan; NL/Nordics/DE Jan–Mar (some Jan 15 intl deadlines); IT/FR Dec–Apr.'
  },
  ca: {
    zh: '加拿大：UToronto/UBC/McGill 12 月–次年 2 月；部分 MS 滚动至 4 月。',
    en: 'Canada: UToronto/UBC/McGill Dec–Feb; some MS rolling to Apr.'
  },
  au: {
    zh: '澳洲/新西兰：S2 7 月入学截止 4–5 月；S1 次年 2 月入学截止 10–11 月。',
    en: 'AU/NZ: S2 (Jul intake) deadline Apr–May; S1 (Feb intake) deadline Oct–Nov.'
  },
  other: {
    zh: '其他地区：按目标国家/院校的官方公告执行，建议比照美/英/港/新的节奏倒推 6 个月。',
    en: 'Other regions: follow official program guidance; pace tasks ~6 months before the target deadline as a default.'
  }
};

function buildRegionGuidance(preferredRegions) {
  const regions = Array.isArray(preferredRegions) ? preferredRegions.filter((id) => REGION_DEADLINE_HINTS[id]) : [];
  if (regions.length === 0) {
    return Object.entries(REGION_DEADLINE_HINTS).map(([key, hint]) => ({ key, hint }));
  }
  return regions.map((key) => ({ key, hint: REGION_DEADLINE_HINTS[key] }));
}

export function buildApplicationTimeline(profile = {}) {
  const now = new Date();
  const today = formatDate(now);
  const graduationYear = parseInt(profile.graduationYear, 10);
  const gradYear = Number.isFinite(graduationYear) && graduationYear >= 2020 ? graduationYear : now.getFullYear() + 1;

  const targetIntakeYear = gradYear;
  const applicationSeasonYear = targetIntakeYear - 1;

  const planStart = new Date(now);
  planStart.setHours(0, 0, 0, 0);

  const planEnd = new Date(`${applicationSeasonYear}-12-31T00:00:00`);
  const cycleEnd = new Date(`${targetIntakeYear}-09-30T00:00:00`);
  const seasonPassed = now > planEnd;
  const cyclePassed = now > cycleEnd;

  const milestones = buildApplicationMilestones(applicationSeasonYear);
  const regionGuidance = buildRegionGuidance(profile.preferredRegions);

  const encouragementFallback = cyclePassed
    ? {
        zh: `当前已超过 ${applicationSeasonYear} 申请季的主要节点。建议复盘现有背景，探索延期入学、Gap 提升或下一轮申请路径，继续保持节奏。`,
        en: `The main milestones of the ${applicationSeasonYear} application cycle have passed. Review your profile, consider deferral, gap-year improvement, or the next application round, and keep building momentum.`
      }
    : { zh: '', en: '' };

  return {
    today,
    graduationYear: gradYear,
    targetIntakeYear,
    applicationSeasonYear,
    planStartDate: formatDate(planStart),
    planEndDate: formatDate(cycleEnd),
    seasonPassed,
    cyclePassed,
    milestones,
    regionGuidance,
    encouragementFallback,
    sources: [
      'NUS Office of Admissions important dates (nus.edu.sg/oam/admissions/important-dates)',
      'NTU School graduate admissions deadlines (ntu.edu.sg)',
      'Oxford Graduate Admissions guide (ox.ac.uk/admissions/graduate)',
      'UC graduate division standardized deadlines (2027 cycle)',
      'PrepAiro GRE Fall 2027 timeline summary'
    ]
  };
}
