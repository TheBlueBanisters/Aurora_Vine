// 纯函数：合并 outline 段与 schedule 段的结果。
// 抽出来是为了让「schedule 段失败仍保留 outline 段结果」这一行为可在 Node 中被单元测试覆盖，
// 而不需要 mock 整个 DOM/Electron 环境。
//
// outlineResult: { profile, scoreResult, outlineCount, outlineEntries }
// smartOutcome:  { smartResult: { profile, scheduleCount, ... } | null, smartError: Error | null }
//
// 输出：保证即使 smartResult === null（schedule 段失败），调用方仍能拿到 outline 段所有结果，
// 且 smartError 字段会暴露失败原因，供上层提示用户「重新生成」重试。
export function composeFullPipelineResult(outlineResult, smartOutcome = {}) {
  if (!outlineResult || typeof outlineResult !== 'object') {
    throw new Error('composeFullPipelineResult: outlineResult is required');
  }
  const { smartResult = null, smartError = null } = smartOutcome;
  return {
    profile: smartResult?.profile || outlineResult.profile,
    scoreResult: outlineResult.scoreResult,
    outlineCount: outlineResult.outlineCount,
    outlineEntries: outlineResult.outlineEntries,
    smartResult,
    smartError
  };
}

// 纯函数：把已经生成（并保存进 DB）的 outline entries 转换为 schedule 段需要的 payload，
// 避免在合并流程里再次读 DB 造成时序/缓存问题。
// 注意：与 main 进程无关，仅在 renderer 内部使用；保留在独立文件里方便测试。
export function buildOutlinePayloadFromEntries(profile = {}, outlineEntries = []) {
  return {
    entries: (outlineEntries || []).map((entry) => ({
      title: entry?.title,
      description: entry?.description,
      tasks: []
    })),
    schoolRecommendations: profile.schoolRecommendations || { reach: [], match: [], safety: [] },
    encouragementNote: profile.llmEncouragementNote || { zh: '', en: '' }
  };
}
