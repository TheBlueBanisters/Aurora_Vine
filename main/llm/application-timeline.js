function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function buildApplicationTimeline(profile = {}) {
  const now = new Date();
  const today = formatDate(now);
  const graduationYear = parseInt(profile.graduationYear, 10);
  const gradYear = Number.isFinite(graduationYear) && graduationYear >= 2020 ? graduationYear : now.getFullYear() + 1;

  // Fall intake typically in graduation year or the year before for early applicants
  const targetIntakeYear = gradYear;
  const applicationSeasonYear = targetIntakeYear - 1;

  const planStart = new Date(now);
  planStart.setHours(0, 0, 0, 0);

  const planEnd = new Date(`${applicationSeasonYear}-12-15T00:00:00`);
  const seasonPassed = now > planEnd;

  const encouragementFallback = seasonPassed
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
    planEndDate: formatDate(planEnd),
    seasonPassed,
    encouragementFallback
  };
}
