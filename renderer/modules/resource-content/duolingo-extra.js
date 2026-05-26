/** DET / 多邻国资源条目正文集合（除 duolingo-guide 主入口外的其它条目） */

export const DUOLINGO_EXTRA_CONTENT = {
  'duolingo-guide-2': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 采用计算机自适应（CAT）：答对则下一题更难，答错则变易。分数是能力估计值，不是“对几题得几分”。理解这一点有助于调整备考心态。' },
      { type: 'list', title: '分数区间说明', items: ['10–60 为总分，多数学校要求 105–120+。', 'Literacy / Comprehension / Conversation / Production 四子分反映单项能力。', '子分与 CEFR、雅思有官方对照表，申请时可换算说明。'] },
      { type: 'list', title: '自适应特点', items: ['前期题目决定难度区间，后期题目精估分数。', '连续答错会拉低估计，但后续答对仍可回升。', '不要因一题卡住而 panic，保持节奏更重要。'] },
      { type: 'note', title: '提示', text: '模考时记录“哪类题型连续出错”，比纠结单题对错更有用。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'The Duolingo English Test uses computer-adaptive scoring: correct answers raise difficulty; misses lower it. Your score is an ability estimate, not raw item counts.' },
      { type: 'list', title: 'Score Ranges', items: ['Overall 10–60; many programs want 105–120+.', 'Literacy, Comprehension, Conversation, Production subscores show skill bands.', 'Official concordance maps to CEFR and IELTS for applications.'] },
      { type: 'list', title: 'Adaptive Behavior', items: ['Early items set the difficulty band; later items refine the estimate.', 'A streak of misses pulls the estimate down, but recovery is possible.', 'Do not panic on one hard item—pace matters more.'] },
      { type: 'note', title: 'Tip', text: 'Log which task types fail in clusters during mocks; that beats obsessing over single items.' }
    ]}
  },

  'duolingo-practice': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 练习应模拟自适应节奏：混合题型、限时反应、无字典。建议按官方样题顺序轮换，而非只练单项。' },
      { type: 'list', title: '高频题型练习', items: ['Read and Complete：语法与搭配填空。', 'Read and Select：真假词识别。', 'Listen and Type：听写完整句子。', 'Read Aloud / Speak About Photo：口语输出。'] },
      { type: 'template', title: '每日 45 分钟', lines: ['15 min: 填空 + 选词', '10 min: 听写 × 5 句', '10 min: 朗读或看图说', '10 min: 短写作 3–5 句'] },
      { type: 'note', title: '提示', text: '练习环境与正式考试一致：安静、摄像头可用、全屏模式。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET drills should mimic adaptive pacing: mixed tasks, timed responses, no dictionary. Rotate official sample tasks instead of isolating one skill.' },
      { type: 'list', title: 'High-Frequency Tasks', items: ['Read and Complete: grammar and collocation gaps.', 'Read and Select: real vs fake words.', 'Listen and Type: full-sentence dictation.', 'Read Aloud / Speak About Photo: spoken output.'] },
      { type: 'template', title: 'Daily 45 Minutes', lines: ['15 min: completion + word selection', '10 min: five dictation sentences', '10 min: read-aloud or photo speaking', '10 min: short writing (3–5 sentences)'] },
      { type: 'note', title: 'Tip', text: 'Match the exam environment: quiet room, working camera, fullscreen when possible.' }
    ]}
  },

  'duolingo-practice-2': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 口语与写作占 Production 子分，且限时极短。Speak About Photo 需 90 秒内描述图片；Writing Sample 需 3–5 分钟写 50–100 词观点段。' },
      { type: 'list', title: '看图说话结构', items: ['Opening: This photo shows...', 'Details: In the foreground / background...', 'Interpretation: It seems that / This might suggest...', 'Closing: Overall, the image conveys...'] },
      { type: 'list', title: '观点写作结构', items: ['立场句：I believe / In my view...', '理由 1 + 简短例子', '理由 2 或让步', '总结句'] },
      { type: 'template', title: '限时训练', lines: ['Photo: 30s 看题 + 90s 录音', 'Writing: 5 min 50–100 words', 'Self-check: 是否覆盖 who/where/what?'] },
      { type: 'note', title: '提示', text: '口语不要追求复杂句，完整、清晰、有细节即可得分。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET speaking and writing drive the Production subscore under tight limits. Speak About Photo allows ~90 seconds; the writing sample expects 50–100 words in 3–5 minutes.' },
      { type: 'list', title: 'Photo Speaking Frame', items: ['Opening: This photo shows...', 'Details: In the foreground / background...', 'Interpretation: It seems that / This might suggest...', 'Closing: Overall, the image conveys...'] },
      { type: 'list', title: 'Opinion Writing Frame', items: ['Position: I believe / In my view...', 'Reason 1 + brief example', 'Reason 2 or concession', 'Closing sentence'] },
      { type: 'template', title: 'Timed Drills', lines: ['Photo: 30s prep + 90s recording', 'Writing: 5 min, 50–100 words', 'Self-check: who / where / what covered?'] },
      { type: 'note', title: 'Tip', text: 'Complete, clear, detailed beats overly complex sentences on speaking tasks.' }
    ]}
  },

  'duolingo-vocab': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 核心词汇覆盖填空、听写与选词题。重点不是 GRE 级难词，而是中高频学术词、搭配与拼写易错词。' },
      { type: 'list', title: '填空高频词', items: ['however, therefore, although, whereas', 'significant, essential, various, particular', 'achieve, maintain, establish, contribute'] },
      { type: 'list', title: '听写易错词', items: ['accommodation, environment, government', 'definitely, separately, occasionally', 'their / there / they\'re；its / it\'s'] },
      { type: 'template', title: '每日词卡', lines: ['Word: ___', 'Part of speech: ___', 'Collocation: ___', 'Dictation check: ___'] },
      { type: 'note', title: '提示', text: 'Read and Select 假词常改一个字母，练拼写能同时提升选词准确率。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET core vocabulary feeds completion, dictation, and word-selection tasks. Focus on mid-high academic words, collocations, and spelling traps—not GRE-level rarity.' },
      { type: 'list', title: 'Completion High-Frequency', items: ['however, therefore, although, whereas', 'significant, essential, various, particular', 'achieve, maintain, establish, contribute'] },
      { type: 'list', title: 'Dictation Traps', items: ['accommodation, environment, government', 'definitely, separately, occasionally', 'their / there / they\'re; its / it\'s'] },
      { type: 'template', title: 'Daily Card', lines: ['Word: ___', 'Part of speech: ___', 'Collocation: ___', 'Dictation check: ___'] },
      { type: 'note', title: 'Tip', text: 'Fake words in Read and Select often change one letter—spelling drills help both tasks.' }
    ]}
  },

  'duolingo-speaking': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 口语题（Read Aloud、Listen and Repeat、Speak About Photo）均限时且自动评分。评分关注发音可懂度、流利度与内容完整度。' },
      { type: 'list', title: 'Read Aloud 技巧', items: ['预读全文，标重音与停顿。', '匀速朗读，不要赶时间吞音。', '数字、专有名词放慢读清。'] },
      { type: 'list', title: 'Speak About Photo', items: ['先描述可见事实，再推测情境。', '用 There is / I can see / In the center...', '90 秒内至少 4–5 句。'] },
      { type: 'template', title: '自检清单', lines: ['Pronunciation: 关键词是否读清？', 'Fluency: 有无长时间停顿？', 'Content: 是否描述足够细节？'] },
      { type: 'note', title: '提示', text: '考前测试麦克风，环境安静，避免回声。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET speaking tasks (Read Aloud, Listen and Repeat, Speak About Photo) are timed and auto-scored for intelligibility, fluency, and completeness.' },
      { type: 'list', title: 'Read Aloud Tips', items: ['Preview the passage; mark stress and pauses.', 'Read at a steady pace—do not swallow endings.', 'Slow down on numbers and proper nouns.'] },
      { type: 'list', title: 'Speak About Photo', items: ['Describe visible facts first, then infer context.', 'Use There is / I can see / In the center...', 'Aim for at least 4–5 sentences in 90 seconds.'] },
      { type: 'template', title: 'Self-Check', lines: ['Pronunciation: key words clear?', 'Fluency: long pauses?', 'Content: enough detail?'] },
      { type: 'note', title: 'Tip', text: 'Test your microphone beforehand; quiet room, no echo.' }
    ]}
  },

  'duolingo-mock': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 官方提供免费样题与付费加试。模考应完整走一遍：设备检测 → 身份验证 → 自适应题型 → 口语写作样本。' },
      { type: 'list', title: '模考自评清单', items: ['设备：摄像头、麦克风、网络、浏览器。', '环境：独处、桌面整洁、光线充足。', '流程：是否完成 ID 验证与 room scan？', '状态：是否因紧张导致连续失误？'] },
      { type: 'template', title: '模考后记录', lines: ['Estimated score range: ___', 'Weakest task type: ___', 'Production subscore concern: Y/N', 'Next drill focus: ___'] },
      { type: 'note', title: '提示', text: '正式考试 48 小时内出分。模考与真考间隔至少 3 天，避免疲劳。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET offers free samples and paid add-ons. A mock should cover device check, ID verification, adaptive tasks, and speaking/writing samples.' },
      { type: 'list', title: 'Self-Check List', items: ['Device: camera, mic, network, browser.', 'Environment: alone, clear desk, good lighting.', 'Flow: ID verification and room scan completed?', 'State: nerves causing error streaks?'] },
      { type: 'template', title: 'Post-Mock Log', lines: ['Estimated score range: ___', 'Weakest task type: ___', 'Production subscore concern: Y/N', 'Next drill focus: ___'] },
      { type: 'note', title: 'Tip', text: 'Official results arrive within 48 hours. Space mock and real exam by at least three days.' }
    ]}
  },

  'duolingo-interactive': {
    zh: { sections: [
      { type: 'paragraph', text: 'Interactive Reading 包含完形填空、段落排序、高亮总结等。核心是快速理解段落逻辑与语法搭配。' },
      { type: 'list', title: '题型要点', items: ['Cloze：看搭配与语法，不是猜最难词。', 'Paragraph order：找指代词 this/these 与转折 however。', 'Highlight summary：选覆盖主旨的 1–2 句，非细节。'] },
      { type: 'template', title: '排序线索', lines: ['Opening: 背景或定义', 'Middle: 例子、步骤、对比', 'Closing: 总结或 implication', 'Pronouns link backward'] },
      { type: 'note', title: '提示', text: '限时内先完成有把握的填空，再回头处理难题。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Interactive Reading mixes cloze, paragraph ordering, and highlight-summary tasks. Speed and grammar collocations matter more than rare vocabulary.' },
      { type: 'list', title: 'Task Tips', items: ['Cloze: collocations and grammar, not the hardest word.', 'Ordering: track this/these and however pivots.', 'Highlight: pick 1–2 sentences covering main idea, not trivia.'] },
      { type: 'template', title: 'Ordering Cues', lines: ['Opening: background or definition', 'Middle: examples, steps, contrast', 'Closing: summary or implication', 'Pronouns link backward'] },
      { type: 'note', title: 'Tip', text: 'Secure easy blanks first under time pressure, then revisit hard ones.' }
    ]}
  },

  'duolingo-write': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 写作样本（Writing Sample）会随成绩送交学校，需展示真实写作水平。题目多为观点论述或情境描述，50–100 词，5 分钟内完成。' },
      { type: 'list', title: '范文结构要点', items: ['Opening：改写题目 + 明确立场。', 'Body：1–2 个理由，各带一句例子。', 'Closing：重申立场或提出 modest 建议。'] },
      { type: 'template', title: '观点题范例骨架', lines: ['Some people argue that ___. I partly agree because ___.', 'On one hand, ___. For instance, ___.', 'On the other hand, ___.', 'Overall, ___ is more important in this context.'] },
      { type: 'note', title: '提示', text: '避免过于口语化或 bullet 式罗列；完整句 + 连接词即可。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'The Writing Sample is sent to institutions with your score. Prompts are opinion or situational; aim for 50–100 words in five minutes.' },
      { type: 'list', title: 'Structure', items: ['Opening: paraphrase prompt + clear stance.', 'Body: 1–2 reasons with a sentence example each.', 'Closing: restate or offer a modest recommendation.'] },
      { type: 'template', title: 'Opinion Skeleton', lines: ['Some people argue that ___. I partly agree because ___.', 'On one hand, ___. For instance, ___.', 'On the other hand, ___.', 'Overall, ___ is more important in this context.'] },
      { type: 'note', title: 'Tip', text: 'Avoid overly casual tone or bullet lists; full sentences with connectors suffice.' }
    ]}
  },

  'duolingo-listen': {
    zh: { sections: [
      { type: 'paragraph', text: 'Listen and Type 要求听写完整句子，考查拼写、语法与标点。句子长度中等，但语速自然，含连读与弱读。' },
      { type: 'list', title: '听写冲刺要点', items: ['先听结构：主谓宾再填修饰。', '注意冠词 a/an/the 与复数 -s。', '标点：句首大写、句末句号。', '专有名词按常见拼写规则猜。'] },
      { type: 'list', title: '易错句型', items: ['I\'ve / I have；don\'t / do not', 'Numbers: 15 vs 50', 'Homophones: their / there / they\'re'] },
      { type: 'template', title: '错题本', lines: ['Sentence: ___', 'My typo: ___', 'Correct: ___', 'Rule: ___'] },
      { type: 'note', title: '提示', text: '每天 10 句听写，比一次刷 50 句更有效。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Listen and Type requires full-sentence dictation—spelling, grammar, and punctuation. Sentences are medium length with natural linking and weak forms.' },
      { type: 'list', title: 'Sprint Tips', items: ['Catch S-V-O skeleton first, then modifiers.', 'Watch articles a/an/the and plural -s.', 'Capitalize starts; end with a period.', 'Guess proper nouns by common spelling patterns.'] },
      { type: 'list', title: 'Trap Patterns', items: ['I\'ve / I have; don\'t / do not', 'Numbers: 15 vs 50', 'Homophones: their / there / they\'re'] },
      { type: 'template', title: 'Error Log', lines: ['Sentence: ___', 'My typo: ___', 'Correct: ___', 'Rule: ___'] },
      { type: 'note', title: 'Tip', text: 'Ten sentences daily beats fifty in one sitting.' }
    ]}
  },

  'duolingo-read': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 阅读题限时极短，需 skim 抓主旨再答题。Interactive Reading 与 Read and Select 都考验快速识别关键词与逻辑。' },
      { type: 'list', title: 'Skim 策略', items: ['首句 + 末句定段落功能。', '标转折词 however、yet、instead。', '数字、专有名词往往是考点。'] },
      { type: 'list', title: 'Read and Select', items: ['真词：符合英语拼写规律与常见词根。', '假词：多改一个字母或非法组合。', '不确定时选“见过且能造句”的词。'] },
      { type: 'note', title: '提示', text: '练习时用计时器，培养 20–30 秒内完成单题的习惯。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET reading tasks are sharply timed—skim for gist before answering. Interactive Reading and Read and Select both reward fast keyword and logic recognition.' },
      { type: 'list', title: 'Skim Tactics', items: ['First and last sentence set paragraph function.', 'Mark pivots: however, yet, instead.', 'Numbers and proper nouns often anchor answers.'] },
      { type: 'list', title: 'Read and Select', items: ['Real words: normal spelling and roots.', 'Fake words: one-letter swaps or illegal clusters.', 'When unsure, pick words you have used in sentences.'] },
      { type: 'note', title: 'Tip', text: 'Practice with a timer; aim to finish single items in 20–30 seconds.' }
    ]}
  },

  'duolingo-cert': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 成绩报告含总分、四子分及 CEFR 等级。申请时可对照学校要求与雅思/托福换算表说明竞争力。' },
      { type: 'list', title: '分数对照（参考）', items: ['125–130：约 IELTS 7.5+ / 托福 100+', '115–120：约 IELTS 7 / 托福 90+', '105–110：约 IELTS 6.5 / 托福 80+', '具体以 Duolingo 官方 concordance 为准'] },
      { type: 'list', title: '子分解读', items: ['Literacy：阅读写作综合。', 'Comprehension：听读理解。', 'Conversation：口语互动。', 'Production：口语写作产出。'] },
      { type: 'note', title: '提示', text: '部分学校只看总分，部分要求 Production 不低于某线。送分前核对项目官网。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET score reports show overall, four subscores, and CEFR bands. Compare against program cutoffs and official IELTS/TOEFL concordance when applying.' },
      { type: 'list', title: 'Concordance (Guide)', items: ['125–130: roughly IELTS 7.5+ / TOEFL 100+', '115–120: roughly IELTS 7 / TOEFL 90+', '105–110: roughly IELTS 6.5 / TOEFL 80+', 'Always verify on Duolingo official tables'] },
      { type: 'list', title: 'Subscore Meaning', items: ['Literacy: reading + writing blend.', 'Comprehension: listening + reading.', 'Conversation: interactive speaking.', 'Production: spoken + written output.'] },
      { type: 'note', title: 'Tip', text: 'Some schools require minimum Production. Check each program before sending scores.' }
    ]}
  },

  'duolingo-device': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 在家考试对设备与环境要求严格。考前 24 小时务必完成官方 equipment check，避免正式考试时无法启动。' },
      { type: 'list', title: '设备自检清单', items: ['电脑：Windows/Mac，Chrome 浏览器最新版。', '摄像头：720p 以上，能拍清面部与桌面。', '麦克风：无杂音，说话清晰可录。', '网络：稳定，建议有线或靠近路由器。', '桌面：仅允许电脑、键盘、鼠标、身份证。'] },
      { type: 'list', title: '环境要求', items: ['独处房间，门可关闭。', '光线充足，面部无强背光。', '移除第二屏幕、手机、笔记。', '考试前完成 room scan。'] },
      { type: 'note', title: '提示', text: '若 equipment check 失败，先更新驱动/浏览器，勿带着问题进正式考试。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'DET at-home testing is strict about devices and environment. Run the official equipment check within 24 hours of the exam.' },
      { type: 'list', title: 'Device Checklist', items: ['Computer: Windows/Mac, latest Chrome.', 'Camera: 720p+, face and desk visible.', 'Microphone: clear capture, low noise.', 'Network: stable; wired or near router preferred.', 'Desk: only computer, keyboard, mouse, ID.'] },
      { type: 'list', title: 'Room Rules', items: ['Alone in a closable room.', 'Good lighting, no strong backlight.', 'Remove second screens, phones, notes.', 'Complete room scan before starting.'] },
      { type: 'note', title: 'Tip', text: 'If equipment check fails, update drivers/browser first—do not enter the real exam with open issues.' }
    ]}
  },

  'duolingo-retake': {
    zh: { sections: [
      { type: 'paragraph', text: 'DET 二考冲刺建议 14 天高频轮换弱项题型，而非重复完整模考。官方允许快速重考，但应给专项训练留出间隔。' },
      { type: 'list', title: '14 天轮换表', items: ['D1–2：听写 + 选词', 'D3–4：Interactive Reading + 排序', 'D5–6：口语 Read Aloud + Photo', 'D7–8：写作样本限时', 'D9–10：混合限时套题', 'D11–12：弱项加练', 'D13：设备与环境演练', 'D14：轻量复习 + 休息'] },
      { type: 'template', title: '每日记录', lines: ['Task type: ___', 'Score / accuracy: ___', 'Error pattern: ___', 'Tomorrow focus: ___'] },
      { type: 'note', title: '提示', text: 'Production 子分偏低时，每天至少 1 次口语 + 1 次写作限时。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'A DET retake sprint rotates weak task types over 14 days instead of repeating full mocks. Retakes are allowed quickly, but leave room for targeted drills.' },
      { type: 'list', title: '14-Day Rotation', items: ['D1–2: dictation + word selection', 'D3–4: interactive reading + ordering', 'D5–6: read-aloud + photo speaking', 'D7–8: timed writing sample', 'D9–10: mixed timed sets', 'D11–12: weakness drills', 'D13: device and room rehearsal', 'D14: light review + rest'] },
      { type: 'template', title: 'Daily Log', lines: ['Task type: ___', 'Score / accuracy: ___', 'Error pattern: ___', 'Tomorrow focus: ___'] },
      { type: 'note', title: 'Tip', text: 'If Production lags, schedule at least one speaking and one writing timed task daily.' }
    ]}
  }
}
