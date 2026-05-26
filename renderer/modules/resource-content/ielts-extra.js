/** 雅思资源条目正文集合（除 speaking/writing 主入口外的其它 IELTS 条目） */

export const IELTS_EXTRA_CONTENT = {
  'ielts-listening': {
    zh: {
      sections: [
        { type: 'paragraph', text: '雅思听力分四个 Section，话题、口音和题型都不同。Section 1 是生活信息（电话、咨询）；Section 2 是独白（介绍、讲座）；Section 3 是多人学术讨论；Section 4 是大学讲座。备考时应按 Section 分别准备词汇与场景。' },
        { type: 'list', title: '高频场景词汇', items: ['Accommodation：deposit、tenancy、furnished、utility bill', 'Travel：itinerary、boarding、return ticket、travel insurance', 'University：tutorial、seminar、assignment、dissertation', 'Lecture：hypothesis、methodology、findings、implication'] },
        { type: 'list', title: '按题型对应训练', items: ['填空题：注意单复数、拼写、大小写、字数限制。', '选择题：先读选项关键词，再听对比/转折信号。', '配对题：先标注每项关键词，再边听边连线。', '地图题：识别方位词 north / opposite / behind。'] },
        { type: 'template', title: '一周听力训练表', lines: ['Mon: Section 1 填空 + 数字训练', 'Tue: Section 2 多选 + 地图', 'Wed: Section 3 配对 + 多选', 'Thu: Section 4 笔记 + 学术词汇', 'Fri-Sat: 全真模考 + 跟读', 'Sun: 错题复盘 + 弱项专练'] },
        { type: 'note', title: '提示', text: '听力关键不是音节速度，而是预读题干和锁定信号词。每次练习后整理“漏掉的关键词”表，比反复刷套题更有效。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'IELTS Listening has four sections that differ in topic, accent, and question type. S1 covers life info (calls, inquiries); S2 is a monologue (introduction, tour); S3 is an academic group conversation; S4 is a university lecture. Prep by section, not just by accent.' },
        { type: 'list', title: 'Topic Vocabulary', items: ['Accommodation: deposit, tenancy, furnished, utility bill', 'Travel: itinerary, boarding, return ticket, travel insurance', 'University: tutorial, seminar, assignment, dissertation', 'Lecture: hypothesis, methodology, findings, implication'] },
        { type: 'list', title: 'Drill By Question Type', items: ['Fill-in: watch plural, spelling, capitals, word limit.', 'Multiple choice: pre-read keywords, listen for contrast cues.', 'Matching: mark key terms first, then connect while listening.', 'Map: orient by direction words like north, opposite, behind.'] },
        { type: 'template', title: 'Weekly Listening Plan', lines: ['Mon: S1 fill-in + numbers drill', 'Tue: S2 multiple choice + map', 'Wed: S3 matching + multiple choice', 'Thu: S4 note-taking + academic vocab', 'Fri-Sat: full mock + shadowing', 'Sun: error log + weakness drill'] },
        { type: 'note', title: 'Tip', text: 'Listening is less about speed and more about pre-reading prompts and locking onto signal words. After each session, log the keywords you missed — that is more useful than another mock.' }
      ]
    }
  },

  'ielts-listening-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: '精听是改善听力上限的关键，但要避免变成“盲听 N 遍”。规范精听流程应该是“先听 → 检查答案 → 看文本 → 重点跟读 → 再盲听”。每段材料控制在 3-5 分钟，避免疲劳。' },
        { type: 'list', title: '精听五步流程', items: ['第一遍：盲听并完成题目。', '第二遍：核对答案，标出听错的词。', '第三遍：对照文本听，找出漏听/混淆的位置。', '第四遍：选 1-2 段跟读模仿语调与连读。', '第五遍：合上文本再盲听，验证是否能完整理解。'] },
        { type: 'list', title: '常见漏听点', items: ['弱读 / 连读：could have、didn’t I、a lot of', '数字与符号：fifteen vs fifty、postal code、telephone', '专有名词拼写：street name、姓氏、机构缩写', '时态信号词：used to、would、had been'] },
        { type: 'template', title: '精听记录单', lines: ['Audio: ___', 'Section / Type: ___', '听错单词：___', '错因：弱读 / 连读 / 词汇 / 速度 / 注意力', '跟读片段：00:30-01:00', '再次盲听结果：全对 / 仍有 X 个问题'] },
        { type: 'note', title: '材料来源', text: '建议优先选官方剑桥真题（剑 11–18），其次是雅思官方 YouTube 频道。BBC 6 Minute English 适合做轻量泛听，但不适合精听训练。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Intensive listening (精听) lifts your ceiling, but only with discipline. Avoid "listen N more times" loops. The standard flow is blind listen → check answers → read transcript → targeted shadowing → blind listen again. Keep each clip to 3-5 minutes to limit fatigue.' },
        { type: 'list', title: 'Five-Step Flow', items: ['Pass 1: blind listen and answer.', 'Pass 2: check answers; mark misheard words.', 'Pass 3: listen with transcript; locate missed or confused spots.', 'Pass 4: shadow 1-2 segments for tone and linking.', 'Pass 5: blind listen again; verify full comprehension.'] },
        { type: 'list', title: 'Common Misses', items: ['Weak forms / linking: could have, didn’t I, a lot of', 'Numbers and symbols: fifteen vs fifty, postal codes, phone formats', 'Proper-noun spelling: street names, surnames, acronyms', 'Tense markers: used to, would, had been'] },
        { type: 'template', title: 'Intensive Log', lines: ['Audio: ___', 'Section / Type: ___', 'Misheard words: ___', 'Cause: weak form / linking / lexis / speed / attention', 'Shadowed segment: 00:30-01:00', 'Re-listen: all correct / X remain'] },
        { type: 'note', title: 'Source Choice', text: 'Use the official Cambridge sets (11–18) first, then the official IELTS YouTube channel. BBC 6 Minute English is great for light extensive listening but not for intensive drills.' }
      ]
    }
  },

  'ielts-speaking-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'Part 3 与 Part 2 关联，但要求更深：考官会基于话题追问“为什么”“是否同意某看法”“未来趋势如何”。回答时间通常 4-5 句，包含立场、原因、举例和让步。仅给出短答案会被反复追问。' },
        { type: 'list', title: '常见追问方向', items: ['Compare：过去与现在 / 城市与乡村 / 中国与海外', 'Cause：为什么人们更倾向于 X', 'Effect：X 趋势带来什么影响', 'Predict：未来 10 年是否会变化', 'Personal vs Society：对个人影响 vs 对社会影响'] },
        { type: 'template', title: '四句答题框架', lines: ['1. 立场句：I think / It depends on ...', '2. 原因句：The main reason is that ...', '3. 例证句：For example, in many cities ...', '4. 让步或预测：That said, ... / Looking ahead, ...'] },
        { type: 'list', title: '常用过渡词', items: ['提出观点：From my perspective / In my view', '让步：That said / It is true that ... but ...', '举例：Take ... as an example / A good case is ...', '总结：On the whole / All in all'] },
        { type: 'note', title: '常见问题', text: '不要在 Part 3 一直说“yes, yes, yes”。即使同意考官观点，也要补充一个细节或反例，体现 lexical resource 与 fluency。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Part 3 builds on Part 2 but demands depth. The examiner probes why, whether you agree with a view, and what trends may emerge. Aim for 4-5 sentences per answer: position, reason, example, concession. Short answers invite more follow-up.' },
        { type: 'list', title: 'Frequent Probe Angles', items: ['Compare: past vs present, urban vs rural, home vs abroad', 'Cause: why people prefer X', 'Effect: what consequences a trend brings', 'Predict: will this change in ten years', 'Personal vs society: impact on individuals vs communities'] },
        { type: 'template', title: 'Four-Sentence Frame', lines: ['1. Position: I think / It depends on ...', '2. Reason: The main reason is that ...', '3. Example: For example, in many cities ...', '4. Concession or prediction: That said, ... / Looking ahead, ...'] },
        { type: 'list', title: 'Useful Transitions', items: ['Opinion: From my perspective / In my view', 'Concession: That said / It is true that ... but ...', 'Example: Take ... as an example / A good case is ...', 'Summary: On the whole / All in all'] },
        { type: 'note', title: 'Common Pitfall', text: 'Avoid stacking "yes, yes, yes" in Part 3. Even when agreeing, add a detail or counterpoint to show lexical resource and fluency.' }
      ]
    }
  },

  'ielts-reading': {
    zh: {
      sections: [
        { type: 'paragraph', text: '雅思阅读 60 分钟做 40 道题，时间是最大压力。建议先用 2-3 分钟略读全文（看标题、段首句、段尾句），抓住每段功能，再根据题型决定回原文位置的策略。' },
        { type: 'list', title: '高频题型解题策略', items: ['T/F/NG：原文找不到 = NG；与原文相反 = F；要小心绝对词。', 'Matching headings：找每段中心句，注意首段与转折段。', 'Sentence completion：定位关键词，注意词性与字数。', 'Multiple choice：错误项往往含“partial truth + wrong detail”。'] },
        { type: 'list', title: '速度管理', items: ['Passage 1：18 分钟（题目较易）', 'Passage 2：20 分钟', 'Passage 3：22 分钟（难度最高）', '剩 5 分钟检查空白与拼写'] },
        { type: 'template', title: '段落功能笔记', lines: ['Para 1: introduction / background', 'Para 2: example or contrast', 'Para 3: cause / mechanism', 'Para 4: counter view', 'Para 5: implication / future'] },
        { type: 'note', title: '常见误区', text: '不要全文精读再做题——时间根本不够。也不要完全靠关键词定位，遇到改写句应通读上下文判断逻辑关系。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'You answer 40 items in 60 minutes on IELTS Reading. Time is the main pressure. Skim the passage for 2-3 minutes (title, first and last sentence of each paragraph) to catch paragraph functions, then jump back to the text based on question type.' },
        { type: 'list', title: 'Strategy by Question Type', items: ['T/F/NG: not found = NG; contradicted = F; beware absolute words.', 'Matching headings: locate the topic sentence; watch the opener and pivot paragraphs.', 'Sentence completion: anchor on keywords; check part of speech and word limit.', 'Multiple choice: wrong options often combine partial truth with a wrong detail.'] },
        { type: 'list', title: 'Pacing', items: ['Passage 1: 18 minutes (easiest)', 'Passage 2: 20 minutes', 'Passage 3: 22 minutes (hardest)', 'Keep five minutes to check blanks and spelling'] },
        { type: 'template', title: 'Paragraph Function Notes', lines: ['Para 1: introduction / background', 'Para 2: example or contrast', 'Para 3: cause / mechanism', 'Para 4: counter view', 'Para 5: implication / future'] },
        { type: 'note', title: 'Pitfalls', text: 'Do not read each passage word-by-word; you will run out of time. Do not rely only on keyword matching either — paraphrased lines require reading nearby logic.'} 
      ]
    }
  },

  'ielts-mock': {
    zh: {
      sections: [
        { type: 'paragraph', text: '雅思全真模考的目的是模拟真实节奏与心理压力，而非追求高分。建议在备考最后 3-4 周开始安排模考，每周 1 次，剩下时间用于错题归类与单项强化。' },
        { type: 'list', title: '模考清单', items: ['打印纸版答题卡，按真实时长一次性完成 4 科。', '听力中途不能暂停，写作不能查字典。', '口语单独录音，自评流利度与连贯性。', '模考后 24 小时内完成复盘报告。'] },
        { type: 'template', title: '模考复盘表', lines: ['Listening: 错题数 / 主要错因（S1/2/3/4）', 'Reading: Passage 1/2/3 用时 + 错题分布', 'Writing T1: 字数 + 是否覆盖关键信息', 'Writing T2: 字数 + 立场清晰度 + 主要问题', 'Speaking: P1/2/3 录音时长 + 主要扣分点'] },
        { type: 'list', title: '常见问题', items: ['模考间隔太密导致疲劳累计。', '只关注总分而不归类错因。', '模考写作不动笔，跳过 Task 1 直接练 Task 2。', '口语模考缺少录音对比。'] },
        { type: 'note', title: '建议', text: '完成 2 套完整模考后，把错因聚类成不超过 5 类，做对应专项练习。再做 1 套验证改善，最后留 1 套贴近考试日做总演练。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Full IELTS mocks aim to simulate real pacing and stress, not to chase a high score. Run weekly mocks in the last three to four weeks. Use the rest of the time for error categorization and skill drills.' },
        { type: 'list', title: 'Mock Checklist', items: ['Use printed answer sheets and complete all four skills in one sitting.', 'No pausing during Listening; no dictionary during Writing.', 'Record Speaking and self-assess fluency and coherence.', 'Finish the debrief within 24 hours.'] },
        { type: 'template', title: 'Debrief Sheet', lines: ['Listening: error count + dominant causes by section', 'Reading: time per passage + error distribution', 'Writing T1: word count + key data covered?', 'Writing T2: word count + clarity of stance + main issue', 'Speaking: recording length per part + scoring weaknesses'] },
        { type: 'list', title: 'Common Mistakes', items: ['Mocks too close together, fatigue accumulates.', 'Watching totals only, no error categorization.', 'Skipping Writing or doing only Task 2.', 'No recording for Speaking, no later comparison.'] },
        { type: 'note', title: 'Plan', text: 'After two full mocks, cluster errors into at most five categories and run targeted drills. Do a third mock to verify gains. Save one final mock for the week before the real exam.' }
      ]
    }
  },

  'ielts-band7': {
    zh: {
      sections: [
        { type: 'paragraph', text: '从 6 分到 7 分的瓶颈通常不是单项极弱，而是四科都缺少“最后一步”的稳定性。建议先用 1 套模考定位最低分单科，重点突破；再用 2-3 周做平衡训练。' },
        { type: 'list', title: '四科 7 分核心要求', items: ['Listening 7：30/40 正确，需 S3-S4 稳定。', 'Reading 7：30/40 正确，Passage 3 要稳。', 'Writing 7：T2 立场清晰、论证完整、句式多样。', 'Speaking 7：能延展回答 + 用复杂句 + 偶尔讨论抽象话题。'] },
        { type: 'template', title: '6→7 突破计划（4 周）', lines: ['W1: 单科诊断 + 题型短板专练（每天 1 项）', 'W2: 写作 7 分句型库 + 口语 Part 3 框架训练', 'W3: 模考 + 错因聚类 + 弱项加练', 'W4: 全真节奏 + 状态调整 + 单题修复'] },
        { type: 'list', title: '7 分关键句式（写作）', items: ['让步：While ___, it is more often the case that ___.', '因果：The increase stems primarily from ___.', '建议：A more sustainable approach would be to ___.', '数据：The figure rose markedly, reaching X by ___.'] },
        { type: 'note', title: '提示', text: '不要试图同时把四科推到 7 分；优先把最低单科推到 6.5，再用平衡训练拉齐其余三科。这是 7 分总分最稳的路径。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The gap from 6 to 7 rarely comes from one fatal weakness — it usually means every skill lacks the final layer of stability. Diagnose the lowest skill with one mock, attack it first, then run 2-3 weeks of balanced training.' },
        { type: 'list', title: 'Band 7 Requirements', items: ['Listening 7: ~30/40, S3-S4 must be stable.', 'Reading 7: ~30/40, Passage 3 cannot tank.', 'Writing 7: Task 2 needs clear stance, complete logic, varied syntax.', 'Speaking 7: extended answers, complex sentences, comfort with abstract topics.'] },
        { type: 'template', title: 'Four-Week 6→7 Plan', lines: ['W1: diagnose + drill the lowest skill daily', 'W2: writing 7-band sentence bank + speaking Part 3 frames', 'W3: full mock + error clusters + targeted retries', 'W4: real pacing + state regulation + per-question fixes'] },
        { type: 'list', title: 'Band 7 Writing Phrases', items: ['Concession: "While ___, it is more often the case that ___."', 'Cause: "The increase stems primarily from ___."', 'Recommendation: "A more sustainable approach would be to ___."', 'Data: "The figure rose markedly, reaching X by ___."'] },
        { type: 'note', title: 'Tip', text: 'Do not push all four skills to 7 at once. Lift the lowest skill to 6.5 first, then balance the rest. This is the steadiest path to a 7 overall.' }
      ]
    }
  },

  'ielts-collocation': {
    zh: {
      sections: [
        { type: 'paragraph', text: '雅思写作的“词汇丰富度”不是堆 GRE 单词，而是用得地道的话题搭配。Task 2 高频话题集中在教育、科技、环境、健康、文化、政府，每个话题都有自己常用名词、动词与形容词。' },
        { type: 'list', title: '六大话题词伙', items: ['Education：critical thinking、academic pressure、tuition fees、vocational training', 'Technology：digital literacy、algorithm、screen time、cybersecurity', 'Environment：carbon footprint、renewable energy、biodiversity、greenhouse gas', 'Health：sedentary lifestyle、mental well-being、obesity rate、preventive care', 'Culture：cultural heritage、intercultural exchange、traditional craftsmanship', 'Government：public funding、policy framework、welfare system、urban planning'] },
        { type: 'template', title: '话题句框架', lines: ['Education: "Investing in critical thinking skills equips students for ___."', 'Technology: "Algorithmic curation often narrows ___, raising concerns about ___."', 'Environment: "A transition to renewable energy can curb ___ while ___."', 'Health: "Encouraging preventive care reduces long-term ___."'] },
        { type: 'list', title: '使用建议', items: ['每个话题精选 8-10 个核心搭配，背 2 句典型用法。', '写完作文后回头标注：用了哪些搭配，哪些其实是中式表达。', '把替代表达写在错词本里，例如 “make a contribution to” → “contribute to”。'] },
        { type: 'note', title: '提示', text: '词伙的目标不是“用 5 个高级词”，而是“用 5 个准确的搭配”。考官评分时优先看搭配是否自然，而非词汇是否生僻。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Lexical resource in IELTS writing is not about stacking GRE words; it is about idiomatic topic collocations. Task 2 questions cluster around education, technology, environment, health, culture, and government — each topic has its own go-to nouns, verbs, and adjectives.' },
        { type: 'list', title: 'Six Topic Banks', items: ['Education: critical thinking, academic pressure, tuition fees, vocational training', 'Technology: digital literacy, algorithm, screen time, cybersecurity', 'Environment: carbon footprint, renewable energy, biodiversity, greenhouse gas', 'Health: sedentary lifestyle, mental well-being, obesity rate, preventive care', 'Culture: cultural heritage, intercultural exchange, traditional craftsmanship', 'Government: public funding, policy framework, welfare system, urban planning'] },
        { type: 'template', title: 'Sample Frames', lines: ['Education: "Investing in critical thinking skills equips students for ___."', 'Technology: "Algorithmic curation often narrows ___, raising concerns about ___."', 'Environment: "A transition to renewable energy can curb ___ while ___."', 'Health: "Encouraging preventive care reduces long-term ___."'] },
        { type: 'list', title: 'How to Use', items: ['Pick 8-10 core collocations per topic; memorize two model sentences each.', 'After drafting, highlight which collocations you used and flag Chinglish phrases.', 'Log alternatives in your wrong-word book, e.g. "make a contribution to" → "contribute to".'] },
        { type: 'note', title: 'Tip', text: 'Aim for five accurate collocations, not five fancy words. Examiners reward natural pairing over obscure lexis.' }
      ]
    }
  },

  'ielts-map': {
    zh: {
      sections: [
        { type: 'paragraph', text: '小作文地图题考察“描述两个时点（或多个时点）之间地理位置的变化”。重点是方位表达、时态切换与变化动词。建议先用 1 分钟划区域比较差异，再写 4 段。' },
        { type: 'list', title: '常用方位表达', items: ['to the north / south / east / west of ___', 'opposite ___ / adjacent to ___ / next to ___', 'in the centre / along the river / at the corner of', 'on the eastern side / in the south-western part'] },
        { type: 'list', title: '变化动词', items: ['be demolished / be replaced by / be converted into', 'be built / be constructed / be erected', 'be expanded / be extended / be modernized', 'remain unchanged / remain intact'] },
        { type: 'template', title: '地图题四段结构', lines: ['Para 1: paraphrase + overall change (例如 from residential to mixed-use)', 'Para 2: 第一类变化（新增的建筑）', 'Para 3: 第二类变化（拆除或替换）', 'Para 4: 保留未变的部分 + 总体趋势'] },
        { type: 'note', title: '提示', text: '地图题时态以被动语态为主（be + 过去分词）。若题目只有两个时点（past → present），用过去时；若是 present → future plan，用 will be + 过去分词。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'IELTS Task 1 map questions ask you to describe geographic changes between time points. Direction phrasing, tense switching, and change verbs are the core. Spend a minute zoning the map for contrasts before writing four paragraphs.' },
        { type: 'list', title: 'Direction Phrases', items: ['to the north / south / east / west of ___', 'opposite ___ / adjacent to ___ / next to ___', 'in the centre / along the river / at the corner of', 'on the eastern side / in the south-western part'] },
        { type: 'list', title: 'Change Verbs', items: ['be demolished / be replaced by / be converted into', 'be built / be constructed / be erected', 'be expanded / be extended / be modernized', 'remain unchanged / remain intact'] },
        { type: 'template', title: 'Four-Paragraph Frame', lines: ['Para 1: paraphrase + overall change (e.g. residential → mixed-use)', 'Para 2: first change cluster (new builds)', 'Para 3: second change cluster (demolition or replacement)', 'Para 4: unchanged features + overall trend'] },
        { type: 'note', title: 'Tip', text: 'Map answers lean on passive voice (be + past participle). Past → present uses simple past; present → future plan uses "will be + past participle".' }
      ]
    }
  },

  'ielts-process': {
    zh: {
      sections: [
        { type: 'paragraph', text: '流程图题要求按步骤客观描述制造过程或自然循环。失分点常出现在：步骤遗漏、时态混乱、被动语态使用错误。建议先用箭头列出每个阶段及对应动词，再展开成文。' },
        { type: 'list', title: '常用阶段词', items: ['Initially / At the first stage, ___', 'Subsequently / The next step involves ___', 'Once ___ has been completed, ___', 'Finally / In the last stage, ___'] },
        { type: 'list', title: '常用动词', items: ['be heated / be cooled / be filtered / be mixed', 'be poured into / be transferred to / be released into', 'be packaged / be distributed / be exported', 'evaporate / condense / freeze / dissolve'] },
        { type: 'template', title: '流程图四段结构', lines: ['Para 1: paraphrase + 总体共几个阶段 + 起点 → 终点', 'Para 2: 前半段步骤（输入与初加工）', 'Para 3: 后半段步骤（成品与分发）', 'Para 4 (可选): 是否有循环 / 是否回到起点'] },
        { type: 'note', title: '提示', text: '流程图不需要个人立场，避免使用 “I think / however”。建议每段使用 1 个被动结构 + 1 个连接词，使描述既客观又流畅。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Process diagrams ask for an objective, step-by-step description of a manufacturing process or natural cycle. Common losses come from skipped steps, tense drift, and misused passives. List arrows of each stage with its verb before drafting.' },
        { type: 'list', title: 'Stage Phrases', items: ['Initially / At the first stage, ___', 'Subsequently / The next step involves ___', 'Once ___ has been completed, ___', 'Finally / In the last stage, ___'] },
        { type: 'list', title: 'Process Verbs', items: ['be heated / be cooled / be filtered / be mixed', 'be poured into / be transferred to / be released into', 'be packaged / be distributed / be exported', 'evaporate / condense / freeze / dissolve'] },
        { type: 'template', title: 'Four-Paragraph Frame', lines: ['Para 1: paraphrase + number of stages + start → end', 'Para 2: first half of steps (input + early processing)', 'Para 3: second half of steps (finishing + distribution)', 'Para 4 (optional): cyclic step or return to origin'] },
        { type: 'note', title: 'Tip', text: 'Process tasks need no personal opinion; avoid "I think / however". Use one passive plus one connector per paragraph to stay objective and fluent.' }
      ]
    }
  },

  'ielts-pronunciation': {
    zh: {
      sections: [
        { type: 'paragraph', text: '雅思口语 Pronunciation 评分关注的是“可懂度 + 自然度”，而非“是否像英美母语”。重点改善方向是连读、弱读、语调起伏与重音位置。' },
        { type: 'list', title: '四个改善方向', items: ['连读：辅音 + 元音，如 not at all → /nɒtətɔːl/', '弱读：to、for、from、of 通常发 /ə/', '语调：信息焦点上扬，陈述句结尾下沉', '重音：复合名词重音通常在前，例如 ‘postcard, ’checklist'] },
        { type: 'list', title: '常见中式发音问题', items: ['/θ/ 与 /ð/ 替换为 /s/、/d/', '词尾辅音吞音（example → /ɪɡˈzæmpə/）', '长短元音不分（ship vs sheep）', '句末统一升调，缺少语义起伏'] },
        { type: 'template', title: '每日 15 分钟练习', lines: ['5 min 跟读 1 段考官示范音频', '5 min 录音自评：连读 / 弱读 / 语调', '5 min 修正重读两次同段'] },
        { type: 'note', title: '提示', text: '改善发音的最有效方法是“跟读 + 录音对比”，不是单纯听音标。建议每周固定挑 3 段官方音频做跟读，2 周后明显感到肌肉记忆改善。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'IELTS Speaking pronunciation grades intelligibility and naturalness, not whether you sound native. Focus on linking, weak forms, intonation, and stress placement.' },
        { type: 'list', title: 'Four Focus Areas', items: ['Linking: consonant + vowel, e.g. not at all → /nɒtətɔːl/', 'Weak forms: to, for, from, of usually reduce to /ə/', 'Intonation: rise on focus, fall at end of statement', 'Stress: compound nouns usually take front stress, e.g. ’postcard, ’checklist'] },
        { type: 'list', title: 'Common L1 Issues', items: ['/θ/ and /ð/ replaced by /s/ or /d/', 'Swallowed word-final consonants (example → /ɪɡˈzæmpə/)', 'Long-short vowel mergers (ship vs sheep)', 'Uniform rising tone at sentence end, no semantic contour'] },
        { type: 'template', title: 'Daily 15-Minute Routine', lines: ['5 min shadow an examiner sample audio', '5 min record yourself and self-rate linking / weak forms / intonation', '5 min retry the same passage with corrections'] },
        { type: 'note', title: 'Tip', text: 'Shadow plus recording comparison fixes pronunciation faster than studying IPA in isolation. Three official clips a week for two weeks should yield audible muscle-memory gains.' }
      ]
    }
  },

  'ielts-notebook': {
    zh: {
      sections: [
        { type: 'paragraph', text: '听力错题本应该按 Section 而非按试卷归档，因为每个 Section 的失分原因不同。Section 1 多为拼写或数字；Section 2 多为细节信息或地图方位；Section 3-4 多为同义改写与笔记结构。' },
        { type: 'list', title: '按 Section 归档字段', items: ['S1：错词 + 错因（拼写 / 数字 / 字数）', 'S2：错点 + 错因（地图 / 选择 / 听漏）', 'S3：错点 + 错因（同义改写 / 多人混淆）', 'S4：错点 + 错因（学术词汇 / 笔记结构）'] },
        { type: 'template', title: '错题单格式', lines: ['Date: ___', 'Test source: ___ Section: ___', 'Q number + my answer + correct answer', 'Cause tag (from list above)', 'Audio timestamp + transcript line', 'Fix action: 跟读 / 词汇 / 题型策略'] },
        { type: 'list', title: '复习节奏', items: ['错题当天：标注错因 + 跟读 1 次', '第 3 天：盲听同段 + 核对', '第 7 天：把该类错因相关题再做 5 题', '第 14 天：抽测，是否仍有相同错因'] },
        { type: 'note', title: '提示', text: '错题本不是仓库，是训练计划的来源。每周回看错题本一次，归类前三类错因并安排下周专项练习；其余错题先标记，不要分散注意。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'File listening errors by section, not by test paper, because each section fails for different reasons. S1 misses are spellings and numbers; S2 misses are details and map orientation; S3-S4 misses are paraphrase and note structure.' },
        { type: 'list', title: 'Per-Section Fields', items: ['S1: missed word + cause (spelling / number / word limit)', 'S2: missed point + cause (map / multiple choice / skipped detail)', 'S3: missed point + cause (paraphrase / multi-speaker confusion)', 'S4: missed point + cause (academic vocab / note structure)'] },
        { type: 'template', title: 'Error Card', lines: ['Date: ___', 'Source: ___ Section: ___', 'Q number + my answer + correct answer', 'Cause tag (from list above)', 'Audio timestamp + transcript line', 'Fix: shadowing / vocab / type strategy'] },
        { type: 'list', title: 'Review Rhythm', items: ['Same day: tag the cause + shadow once', 'Day 3: blind listen the segment and verify', 'Day 7: do five more items of the same cause family', 'Day 14: spot test: is the cause still active?'] },
        { type: 'note', title: 'Tip', text: 'The error log is not a graveyard; it is the source of next week’s plan. Review weekly, pick the top three causes, and drill those. Tag the rest but do not let them dilute focus.' }
      ]
    }
  },

  'ielts-fullmock-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: '第二次全真模考的目的是“验证第一次模考之后做的针对性训练是否生效”。因此一定要在两次模考之间留出 7-10 天进行专项训练，否则没有可比性。' },
        { type: 'list', title: '与第一次模考的差异', items: ['对比错因分布是否减少：前 3 类错因应明显下降。', '对比时间分布：是否在原本超时的部分已经稳定。', '对比口语录音：连贯性、词汇、复杂句是否改善。', '对比写作字数：T1 ≥ 150、T2 ≥ 250 是否稳定。'] },
        { type: 'template', title: '对比表', lines: ['Item | Mock 1 | Mock 2 | Change', 'Listening band | __ | __ | __', 'Reading band | __ | __ | __', 'Writing band (est.) | __ | __ | __', 'Speaking band (est.) | __ | __ | __', '前 3 错因 | __ | __ | __'] },
        { type: 'list', title: '模考评分参考', items: ['Listening / Reading：使用官方分数对照表', 'Writing：参考 4 项评分量表（TR / CC / LR / GRA）', 'Speaking：录音 → 自评 4 项 → 同伴或老师二评'] },
        { type: 'note', title: '常见误区', text: '第二次模考分数有时反而下降，原因常是“疲劳累计 + 题目难度变化”，不必过度紧张。重点看错因分布与节奏是否改善，而不是总分波动。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The second full mock should verify whether the targeted training after the first mock actually worked. Leave 7-10 days of focused drills between mocks; otherwise comparison is meaningless.' },
        { type: 'list', title: 'What to Compare', items: ['Error cause distribution: top three causes should drop.', 'Time distribution: is the previously slow section now stable?', 'Speaking recording: better fluency, lexis, complex sentences?', 'Writing word count: Task 1 ≥ 150, Task 2 ≥ 250 reliably?'] },
        { type: 'template', title: 'Comparison Sheet', lines: ['Item | Mock 1 | Mock 2 | Change', 'Listening band | __ | __ | __', 'Reading band | __ | __ | __', 'Writing band (est.) | __ | __ | __', 'Speaking band (est.) | __ | __ | __', 'Top 3 error causes | __ | __ | __'] },
        { type: 'list', title: 'Band Reference', items: ['Listening / Reading: use the official conversion table.', 'Writing: rate against the four descriptors (TR / CC / LR / GRA).', 'Speaking: record → self-rate four descriptors → peer or teacher cross-check.'] },
        { type: 'note', title: 'Watch Out', text: 'Mock 2 scores sometimes drop due to fatigue or harder content. Focus on error-cause distribution and pacing rather than score swings.' }
      ]
    }
  }
}
