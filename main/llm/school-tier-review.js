import { runPromptTemplate } from './deepseek-client.js';
import { parseJsonFromLlm, validateSchoolTierReviewResponse } from './plan-schema.js';
import { buildProfileForLlm } from './profile-context.js';
import { buildStudyPreferencesBlock } from './study-preferences.js';
import {
  buildTierCandidatePools,
  buildTierLlmAllowance,
  poolsToPromptPayload,
  finalizeSchoolTiersFromLlm
} from './school-matcher.js';

export async function reviewAndFinalizeSchoolTiers({
  profile = {},
  catalog = [],
  totalScore = 70,
  scoreDetail = null,
  resumeText = ''
}) {
  const poolBundle = buildTierCandidatePools(catalog, totalScore, profile);
  const allowance = buildTierLlmAllowance(catalog, poolBundle, profile);
  const profileJson = {
    ...buildProfileForLlm(profile, { resumeText, totalScore, scoreDetail }),
    studyPreferences: buildStudyPreferencesBlock(profile),
    tierMapping: {
      anchorQsRank: poolBundle.anchorRank,
      scoreTotal: totalScore,
      poolRanges: poolBundle.ranges
    }
  };

  let llmTiers = null;
  try {
    const raw = await runPromptTemplate('school-tier-review', {
      profileJson,
      resumeText: resumeText || '',
      tierPoolsJson: poolsToPromptPayload(poolBundle, allowance)
    });
    const parsed = validateSchoolTierReviewResponse(parseJsonFromLlm(raw), {
      allowedByTier: allowance.allowedByTier
    });
    llmTiers = parsed.schoolTiers;
  } catch (err) {
    console.warn('school-tier-review LLM failed, using score fallback:', err?.message || err);
  }

  return finalizeSchoolTiersFromLlm(llmTiers, poolBundle, catalog, profile, totalScore);
}
