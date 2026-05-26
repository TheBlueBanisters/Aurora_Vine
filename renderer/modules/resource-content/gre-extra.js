/** GRE 资源条目正文集合（除 vocab/vocab-2/math 外的其它 GRE 条目） */

export const GRE_EXTRA_CONTENT = {
  'gre-math-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'GRE 数学典型题型并不在于知识难度，而在于在限定时间内识别题型并选择最快路径。建议先把题型梳理为三大类：纯计算与公式套用、应用题建模、Data Interpretation 图表题，然后按题型而非按知识点训练，错题更容易归类。' },
        { type: 'list', title: '六类高频题型', items: ['百分比与折扣变化：注意基数变化和复合增长。', '比例与平均数：善用加权平均与速度调和平均。', '排列组合与概率：先判断顺序是否重要、是否放回。', '几何坐标：等腰三角形、相似三角形与圆的辅助线。', '数列与函数：等差/等比通项、绝对值与分段函数。', 'Data Interpretation：先读标题、坐标轴单位，再答题。'] },
        { type: 'template', title: '解题四步法', lines: ['1. Read: 标注限制条件（正整数、非零、奇偶等）', '2. Translate: 把英文条件写成方程或不等式', '3. Strategize: 直接代入、特殊值或反向排除', '4. Verify: 单位、范围、是否漏解'] },
        { type: 'list', title: '常见易错点', items: ['Quantity Comparison 忽略变量可能为负或为 0。', '把“at most / at least”读反方向。', 'DI 题把累积柱状图当作分项柱状图。'] },
        { type: 'note', title: '复习节奏', text: '建议每周固定 2 次 25 分钟限时小测，专门刷易混题型，再用 1 次 35 分钟整 section 模拟。错题按题型而非按试卷归档，复习更有针对性。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'GRE Quant question types are not difficult in math, but they reward fast pattern recognition under time pressure. Group questions into three families: pure formula, applied modeling, and data interpretation. Train by family rather than by chapter so error logs cluster cleanly.' },
        { type: 'list', title: 'Six High-Frequency Types', items: ['Percent change: track the base and compound growth.', 'Ratio and averages: use weighted averages and harmonic mean for speed.', 'Counting and probability: order matters? with or without replacement?', 'Coordinate geometry: isosceles, similar triangles, circle auxiliary lines.', 'Sequences and functions: AP/GP general terms, absolute value, piecewise.', 'Data interpretation: read titles, axes, and units before the question.'] },
        { type: 'template', title: 'Four-Step Method', lines: ['1. Read: flag constraints (positive integer, nonzero, odd/even)', '2. Translate: turn English into equations or inequalities', '3. Strategize: substitute, test special values, or back-solve', '4. Verify: units, range, and missed cases'] },
        { type: 'list', title: 'Common Traps', items: ['Quantity Comparison ignoring negative or zero values.', 'Misreading at most / at least direction.', 'Treating a stacked bar chart as a grouped chart.'] },
        { type: 'note', title: 'Practice Rhythm', text: 'Run two 25-minute timed mini-sets per week on confused types, plus one full 35-minute section. File errors by question type rather than by test paper for sharper review.' }
      ]
    }
  },

  'gre-writing': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'GRE Issue 写作要求在 30 分钟内对一个观点性命题给出立场、论证与反驳。高分作文不在于辞藻，而在于立场清晰、推理可追、例子具体。建议先把任务指令背熟（Analyze an Issue 的六类提示），不同指令决定文章结构。' },
        { type: 'list', title: '六类常见任务指令', items: ['Discuss the extent to which you agree or disagree', 'Address the most compelling reasons', 'Discuss views on both sides', 'Explain your reasoning for the position', 'Discuss circumstances when the claim does not hold', 'Address the underlying assumption'] },
        { type: 'template', title: '五段式结构', lines: ['Para 1: 重写命题 + 给出有限制条件的立场', 'Para 2: 主要支持理由 + 学术或社会例子', 'Para 3: 第二支持理由 + 具体场景', 'Para 4: 让步段：承认对立观点 + 反驳其局限', 'Para 5: 重申立场 + 提出限制条件或更高层次原则'] },
        { type: 'list', title: '论证强化技巧', items: ['用 “to the extent that / provided that” 给出条件限制，避免绝对化。', '例子尽量具体到时间、地点、领域，避免空泛。', '反驳段不要轻易否定对方，应承认其合理之后再限定边界。'] },
        { type: 'note', title: '范文使用方法', text: '不要逐句背诵范文，应记录 3-5 篇范文的论证骨架与过渡句库。每周限时写 1 篇，参照 ETS 评分量表（Outstanding/Strong/Adequate/Limited）做自评。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The Issue task asks for a position, reasoning, and counter-reasoning on a claim in 30 minutes. High-scoring essays rely on a clear stance, traceable logic, and concrete examples rather than ornate vocabulary. Memorize the six task instructions because each one shapes the structure.' },
        { type: 'list', title: 'Six Common Instructions', items: ['Discuss the extent to which you agree or disagree.', 'Address the most compelling reasons that can be used.', 'Discuss views on both sides of the issue.', 'Explain your reasoning for the position you take.', 'Discuss circumstances in which the claim may not hold.', 'Address the underlying assumption.'] },
        { type: 'template', title: 'Five-Paragraph Structure', lines: ['Para 1: paraphrase the prompt and state a qualified position', 'Para 2: main supporting reason + academic or social example', 'Para 3: second supporting reason + concrete scenario', 'Para 4: concession to opposing view + bounded rebuttal', 'Para 5: restate position with conditions or a higher principle'] },
        { type: 'list', title: 'Argument Boosters', items: ['Use “to the extent that / provided that” to qualify claims.', 'Anchor examples to a time, place, or field instead of staying abstract.', 'In the concession, acknowledge merit first, then narrow the scope.'] },
        { type: 'note', title: 'Using Sample Essays', text: 'Do not memorize whole essays. Build a bank of three to five argument skeletons and transition phrases. Write one timed essay per week and self-score against the ETS Outstanding / Strong / Adequate / Limited rubric.' }
      ]
    }
  },

  'gre-writing-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'Argument 写作的考察重点不是“你同不同意”，而是“给定论证存在哪些逻辑漏洞、需要什么证据、做了什么未经证实的假设”。整篇文章应该围绕论证流程展开：找前提、找推理跳跃、找替代解释。' },
        { type: 'list', title: '六类典型逻辑漏洞', items: ['以偏概全 (Sampling Bias)：样本不代表总体。', '因果倒置 (Reverse Causation)：相关不等于因果。', '类比不当 (Faulty Analogy)：A 与 B 关键条件不同。', '虚假二分 (False Dichotomy)：还有第三选项被忽略。', '统计陷阱：百分比与基数、平均数与中位数。', '滑坡推论 (Slippery Slope)：步骤之间缺乏证据。'] },
        { type: 'template', title: '四段结构', lines: ['Para 1: 重写论证 + 指出整体推理薄弱', 'Para 2: 第一处具体漏洞 + 需要的证据 + 替代解释', 'Para 3: 第二处具体漏洞 + 隐含假设', 'Para 4: 结论：若补足 X、Y、Z 则论证可改善'] },
        { type: 'list', title: '高分句型', items: ['“The argument hinges on the unsupported assumption that...”', '“To strengthen the claim, the author would need to provide...”', '“An equally plausible explanation is that...”', '“Without evidence of X, the conclusion remains tenuous.”'] },
        { type: 'note', title: '常见误区', text: '不要在 Argument 写作里加入“我个人认为” 这类立场判断；评分关注的是你识别漏洞与提出证据需求的能力，不是你是否同意作者结论。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The Argument task tests whether you can dissect a given argument: identify premises, logical leaps, and unwarranted assumptions. The entire essay should walk through the reasoning chain, asking what evidence is missing and what alternative explanations exist.' },
        { type: 'list', title: 'Six Classic Flaws', items: ['Sampling bias: the sample does not represent the population.', 'Reverse causation: correlation mistaken for cause.', 'Faulty analogy: A and B differ on key conditions.', 'False dichotomy: a third option is ignored.', 'Statistical trap: percentage vs base, mean vs median.', 'Slippery slope: each step lacks supporting evidence.'] },
        { type: 'template', title: 'Four-Paragraph Structure', lines: ['Para 1: paraphrase the argument and flag overall weakness', 'Para 2: flaw 1 + evidence needed + alternative explanation', 'Para 3: flaw 2 + hidden assumption', 'Para 4: conclusion: the argument improves only if X, Y, Z are addressed'] },
        { type: 'list', title: 'High-Scoring Phrases', items: ['"The argument hinges on the unsupported assumption that..."', '"To strengthen the claim, the author would need to provide..."', '"An equally plausible explanation is that..."', '"Without evidence of X, the conclusion remains tenuous."'] },
        { type: 'note', title: 'Common Mistakes', text: 'Do not state a personal opinion in the Argument task. Scorers reward identification of flaws and required evidence, not whether you agree with the author.' }
      ]
    }
  },

  'gre-practice': {
    zh: {
      sections: [
        { type: 'paragraph', text: '模考的目的不是“多刷几套”，而是在接近真实环境的压力下暴露你的节奏问题、能量分配问题与高频错因。建议在备考最后 6 周开始安排正式模考，每次模考都对应一次系统化复盘。' },
        { type: 'list', title: '模考节奏建议', items: ['T-6 周：1 套官方 PowerPrep（不含 AW）建立基线。', 'T-4 周：1 套 PowerPrep + AW，体验完整 4 小时流程。', 'T-2 周：再做 1 套 PowerPrep，对比基线发现进步与瓶颈。', 'T-1 周：仅做单 section 计时，避免疲劳累计。'] },
        { type: 'template', title: '模考后复盘模板', lines: ['Verbal 得分 / 错题数 / 主要错因（TC / SE / RC）', 'Quant 得分 / 错题数 / 主要错因（Word / Geo / DI / QC）', '时间分配：每个 section 用时、剩余时间、是否猜题', 'Energy：状态最差的题号区间', '下一步：5 个具体训练任务'] },
        { type: 'list', title: '常见模考陷阱', items: ['过度依赖二阶 section 的自适应难度而误判真实水平。', '只看总分不看错题类型，缺乏可执行的下一步。', '连续两天模考导致疲劳积累，反而拉低发挥。'] },
        { type: 'note', title: '正式考试前一周', text: '不要做新的完整模考，改为复盘错题本、整理高频公式和填空套路。考前 48 小时保证作息正常，比临时刷题更影响发挥。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Mock tests are not about volume. They expose pacing issues, energy management, and recurring error patterns under realistic pressure. Plan formal mocks in the last six weeks, each paired with a structured debrief.' },
        { type: 'list', title: 'Mock Schedule', items: ['T-6: one official PowerPrep without AW to establish baseline.', 'T-4: one PowerPrep with AW for the full four-hour experience.', 'T-2: another PowerPrep to compare with baseline.', 'T-1: single timed sections only, to avoid fatigue.'] },
        { type: 'template', title: 'Debrief Template', lines: ['Verbal: score / errors / main types (TC / SE / RC)', 'Quant: score / errors / main types (Word / Geo / DI / QC)', 'Timing: per-section time spent, remaining, guesses', 'Energy: question range where focus dropped', 'Next: five specific training tasks'] },
        { type: 'list', title: 'Common Pitfalls', items: ['Reading the adaptive second section difficulty as your true level.', 'Looking only at totals instead of error types.', 'Stacking mocks on consecutive days and accumulating fatigue.'] },
        { type: 'note', title: 'Final Week', text: 'Skip new full mocks in the final week. Review the error log, refresh formulas and completion patterns, and keep a regular sleep schedule. Rest matters more than last-minute drills.' }
      ]
    }
  },

  'gre-analytical': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'GRE 不再单独考 Analytical Reasoning 题（旧版逻辑题），但 Verbal 中嵌入的逻辑推理元素（论证型阅读、长文段评估）仍是重点。这里整理的训练适合提高论证识别速度，对 Argument 写作也有直接帮助。' },
        { type: 'list', title: '论证拆解步骤', items: ['抽出论点 (Conclusion)：通常出现在 thus、therefore、so 后。', '抽出前提 (Premise)：用来支持结论的事实陈述。', '识别隐含假设：作者默认成立但未明说的桥梁。', '设想反例：是否存在使前提为真但结论为假的情况。'] },
        { type: 'list', title: '常考题型与对应思路', items: ['Strengthen：填补假设、提供新证据。', 'Weaken：找替代原因、找反例数据。', 'Assumption：找“必须为真才能推得结论”的桥梁。', 'Evaluate：判断哪条信息有助于决定论证成立与否。', 'Inference：只从原文推出最弱必然结论。'] },
        { type: 'template', title: '逻辑标注笔记', lines: ['C = Conclusion: ___', 'P1 = ___', 'P2 = ___', 'Assumption: ___', 'Potential alternative cause: ___'] },
        { type: 'note', title: '与阅读训练结合', text: '建议每周精读 2 篇社科类长篇阅读，在每段旁标注 P / C / Assumption。养成习惯后做 Argument 写作的速度会显著加快。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'GRE no longer has standalone Analytical Reasoning questions, but argument-based reading items in Verbal still rely on the same logic skills. The drills below sharpen argument-mapping speed and feed directly into the Argument writing task.' },
        { type: 'list', title: 'Argument Mapping Steps', items: ['Locate the conclusion: usually after thus, therefore, so.', 'Identify premises: factual statements that support the conclusion.', 'Detect hidden assumptions: bridges the author leaves unstated.', 'Imagine counterexamples: scenarios where premises hold but the conclusion fails.'] },
        { type: 'list', title: 'Common Stems and Tactics', items: ['Strengthen: confirm an assumption or add evidence.', 'Weaken: introduce an alternative cause or contrary data.', 'Assumption: find a bridge that must be true for the conclusion.', 'Evaluate: which question helps decide if the argument holds.', 'Inference: extract only the weakest necessary truth from the passage.'] },
        { type: 'template', title: 'Annotation Note', lines: ['C = Conclusion: ___', 'P1 = ___', 'P2 = ___', 'Assumption: ___', 'Potential alternative cause: ___'] },
        { type: 'note', title: 'Pair with Reading', text: 'Read two long social-science passages a week, annotating each paragraph with P / C / Assumption labels. The habit pays off both on Verbal and on Argument writing.' }
      ]
    }
  },

  'gre-vocab-3': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'GRE 填空真正难的不是单词意思，而是“在这种语境下用哪个动词与哪个名词搭配”。同样表示“减少”，diminish / mitigate / curtail / abate 适用的对象都不同。本资源专门整理 Text Completion 中的高频搭配。' },
        { type: 'list', title: '态度/评价搭配', items: ['praise / extol / laud / acclaim — 加在他人成就上', 'criticize / lambast / excoriate / decry — 强度递增', 'qualified praise = lukewarm / faint / measured', 'reverence vs deference — 前者敬畏，后者顺从'] },
        { type: 'list', title: '变化/影响搭配', items: ['mitigate / alleviate + risk, suffering, impact', 'exacerbate / aggravate + tension, condition, problem', 'curtail / abridge + freedom, rights, expenditure', 'augment / amplify + signal, capacity, voice'] },
        { type: 'template', title: '例句对照', lines: ['The policy mitigates the risk of inflation.', 'The new evidence corroborates the earlier hypothesis.', 'Her tone was dispassionate rather than indifferent.', 'He repudiated the claim with measured criticism.'] },
        { type: 'note', title: '复习方法', text: '建议每个高频动词记 2 个常见搭配名词和 1 个对立动词。复习时随机抽取“动词 + 名词”组合，自检是否搭配自然。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The hardest GRE completion questions are not about meaning but about which verb pairs with which noun in context. Diminish, mitigate, curtail, and abate all suggest reduction but apply to different objects. This resource focuses on Text Completion collocations.' },
        { type: 'list', title: 'Attitude Collocations', items: ['praise / extol / laud / acclaim — used for achievements', 'criticize / lambast / excoriate / decry — increasing intensity', 'qualified praise = lukewarm / faint / measured', 'reverence vs deference — awe vs submission'] },
        { type: 'list', title: 'Change-and-Impact Collocations', items: ['mitigate / alleviate + risk, suffering, impact', 'exacerbate / aggravate + tension, condition, problem', 'curtail / abridge + freedom, rights, expenditure', 'augment / amplify + signal, capacity, voice'] },
        { type: 'template', title: 'Sample Sentences', lines: ['The policy mitigates the risk of inflation.', 'The new evidence corroborates the earlier hypothesis.', 'Her tone was dispassionate rather than indifferent.', 'He repudiated the claim with measured criticism.'] },
        { type: 'note', title: 'Drill Method', text: 'Memorize each high-frequency verb with two common object nouns and one antonym verb. Quiz yourself on random verb-noun pairs and judge whether the collocation feels natural.' }
      ]
    }
  },

  'gre-reading': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'GRE 阅读长难句的难点不是生词，而是嵌套从句、插入语和倒装。一个句子读 3 遍仍不懂时，应停下来做句法结构标注，找到主谓宾，才能继续推进。' },
        { type: 'list', title: '拆句四步', items: ['标主句：找出谓语动词，定位 S-V-O 主干。', '剥从句：用 [ ] 框出定语、状语、宾语从句。', '辨连接词：although、whereas、insofar as 决定逻辑。', '复述含义：用一句中文/英文概括整句主旨。'] },
        { type: 'list', title: '常见结构', items: ['插入语：The hypothesis, although widely contested, remains plausible.', '倒装：Not until X did Y...', '同位语：The author—a noted historian of science—claims...', '长定语从句：suggests a phenomenon that is most clearly observed when ...'] },
        { type: 'template', title: '精读笔记示例', lines: ['Sentence: ___', 'Main S-V-O: ___', 'Modifiers: ___', 'Logic word + direction: ___', 'One-line summary: ___'] },
        { type: 'note', title: '训练建议', text: '每天精读 3 个长难句，比每天泛读 1 篇文章效果更好。两周后再回到限时阅读，会明显感觉句子边界更清晰。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The challenge of GRE reading is not vocabulary but nested clauses, parentheticals, and inversion. If a sentence resists three reads, stop and annotate its syntax — identify the main S-V-O before moving on.' },
        { type: 'list', title: 'Four-Step Parsing', items: ['Mark the main clause: find the main verb, locate S-V-O.', 'Bracket subordinate clauses: relative, adverbial, object clauses in [ ].', 'Spot connectors: although, whereas, insofar as drive the logic.', 'Paraphrase: write a one-line summary of the sentence.'] },
        { type: 'list', title: 'Frequent Structures', items: ['Parenthetical: "The hypothesis, although widely contested, remains plausible."', 'Inversion: "Not until X did Y..."', 'Apposition: "The author—a noted historian of science—claims..."', 'Long relative clause: "suggests a phenomenon that is most clearly observed when..."'] },
        { type: 'template', title: 'Intensive Notes', lines: ['Sentence: ___', 'Main S-V-O: ___', 'Modifiers: ___', 'Logic word + direction: ___', 'One-line summary: ___'] },
        { type: 'note', title: 'Practice', text: 'Parse three long sentences a day rather than skim one passage. After two weeks, return to timed reading and sentence boundaries will feel clearer.' }
      ]
    }
  },

  'gre-timing': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'GRE 是节奏型考试，Verbal 与 Quant 每个 section 都按平均 1.5–1.8 分钟/题分配时间。考试中真正的失分往往不在“难题做不对”，而在“前面磨太久、后面没时间”。本资源整理可执行的分段计时策略。' },
        { type: 'list', title: 'Verbal section 计时', items: ['TC 单空：30-45 秒/题', 'TC 双空/三空：60-90 秒/题', 'SE：45-60 秒/题', 'RC 短篇：1.5-2 分钟/题', 'RC 长篇：留出 3 分钟阅读 + 1 分钟/题'] },
        { type: 'list', title: 'Quant section 计时', items: ['QC：60-90 秒/题', 'MC / Numeric Entry：90-120 秒/题', 'Word Problem：120-150 秒/题', 'DI（一组 3 题）：留出 4-5 分钟整体'] },
        { type: 'template', title: '现场节奏检查点', lines: ['第 5 题前：用时 ≤ 7 分钟', '第 10 题前：用时 ≤ 14 分钟', '第 15 题前：用时 ≤ 22 分钟', '若超时：当前题最多再用 30 秒，否则 mark 后跳过'] },
        { type: 'note', title: '建立时间感', text: '平时练习时把题目按 5 题为一组限时，逐步过渡到整 section 限时。考前 2 周必须用真实考试的时长做完整模考，否则节奏感容易偏离。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'GRE rewards pacing. Each Verbal or Quant section budgets roughly 1.5–1.8 minutes per question. Most lost points come not from hard questions but from spending too long on the front and running out of time at the back. This resource breaks pacing into actionable splits.' },
        { type: 'list', title: 'Verbal Timing', items: ['Single-blank TC: 30-45s', 'Double / triple-blank TC: 60-90s', 'Sentence Equivalence: 45-60s', 'Short reading: 1.5-2 min per question', 'Long reading: 3 min to read + 1 min per question'] },
        { type: 'list', title: 'Quant Timing', items: ['Quantity Comparison: 60-90s', 'Multiple choice / Numeric entry: 90-120s', 'Word problems: 120-150s', 'Data Interpretation set (3 Qs): 4-5 min total'] },
        { type: 'template', title: 'Real-Time Checkpoints', lines: ['Before Q5: total time ≤ 7 min', 'Before Q10: total time ≤ 14 min', 'Before Q15: total time ≤ 22 min', 'If behind: spend at most 30 more seconds, then mark and skip'] },
        { type: 'note', title: 'Build Time Awareness', text: 'Start with five-question timed clusters, then move to full-section timing. In the last two weeks, do complete mocks at real exam length, or your pacing instinct will drift.' }
      ]
    }
  },

  'gre-error-log': {
    zh: {
      sections: [
        { type: 'paragraph', text: '错题本的价值不在“记下错题”，而在“按错因归类后做下一步训练”。建议错题不仅记下题目和正确答案，更要标注错因类型、知识点标签和复习日期。每周复盘比每天累积更有效。' },
        { type: 'list', title: '错因分类（Verbal）', items: ['不认识关键词', '认识但方向判断错', '逻辑词理解错', '近义词辨析失误', '时间不够导致猜题'] },
        { type: 'list', title: '错因分类（Quant）', items: ['公式记错或套错', '英文条件读漏', '特殊情况未考虑（负数、零、整数）', 'DI 图表读错单位', '计算错误'] },
        { type: 'template', title: '错题本字段', lines: ['Date: ___', 'Question type: ___', 'Wrong answer: ___', 'Correct answer: ___', 'Error reason (from list): ___', 'Key concept tag: ___', 'Review at: D+1, D+3, D+7'] },
        { type: 'note', title: '复盘节奏', text: '每周日固定 1 小时回看本周错题，按错因数量决定下周训练重点。错因前三类应安排专项练习，而不是再做整套真题。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'A useful error log does more than record wrong answers. It tags each miss by error type and concept so the next drill can target a real weakness. Weekly reviews beat daily piling.' },
        { type: 'list', title: 'Verbal Error Categories', items: ['Unknown keyword', 'Direction wrong despite knowing the word', 'Misread logic connector', 'Synonym confusion', 'Out of time, guessed'] },
        { type: 'list', title: 'Quant Error Categories', items: ['Wrong formula or misapplied formula', 'Missed an English constraint', 'Forgot edge cases (negative, zero, integer)', 'Misread DI units', 'Calculation slip'] },
        { type: 'template', title: 'Log Fields', lines: ['Date: ___', 'Question type: ___', 'Wrong answer: ___', 'Correct answer: ___', 'Error reason (from list): ___', 'Concept tag: ___', 'Review on: D+1, D+3, D+7'] },
        { type: 'note', title: 'Review Rhythm', text: 'Block one Sunday hour to revisit the week’s errors. The top three categories drive next week’s focused drills, not more full-length sets.' }
      ]
    }
  },

  'gre-aw-3': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'AW（Analytical Writing）的句式表达不必追求 GRE 词汇的难度，反而要追求精准与可控。Issue 与 Argument 各有一套高频表达，提前积累并能熟练使用，可以把更多时间留给论证本身。' },
        { type: 'list', title: 'Issue 常用表达', items: ['表达让步：Admittedly, ...; To be sure, ...; Granted that ...', '表达条件：Provided that ...; Insofar as ...; Only when ...', '推进论证：Furthermore, ...; Equally important, ...; Consider, for instance, ...', '重申立场：On balance, ...; Ultimately, ...; Hence, ...'] },
        { type: 'list', title: 'Argument 常用表达', items: ['指出漏洞：The argument rests on the assumption that ...', '提出证据需求：The author would need to provide evidence that ...', '替代解释：A more plausible explanation is ...', '强化建议：To bolster the claim, additional data on X is required ...'] },
        { type: 'template', title: '开头句模板', lines: ['Issue: The claim that ___ raises a complex question about ___. Although ___ has merit in some contexts, I largely [agree / disagree] because ___.', 'Argument: The author concludes that ___ based on ___. However, the reasoning relies on several questionable assumptions that, if scrutinized, weaken the conclusion.'] },
        { type: 'note', title: '使用提示', text: '建议把这些表达打印成一页随手翻阅，做练习时主动使用 2-3 个。每次写完后核对哪些表达用错语境，比单纯背诵更有效。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'AW writing does not need GRE-level lexicon; it needs precision and control. Issue and Argument tasks each rely on a small set of high-frequency phrases. Stockpile them so brainpower can stay on the argument.' },
        { type: 'list', title: 'Issue Phrases', items: ['Concession: Admittedly, ...; To be sure, ...; Granted that ...', 'Conditions: Provided that ...; Insofar as ...; Only when ...', 'Advancing: Furthermore, ...; Equally important, ...; Consider, for instance, ...', 'Restate: On balance, ...; Ultimately, ...; Hence, ...'] },
        { type: 'list', title: 'Argument Phrases', items: ['Flag flaw: "The argument rests on the assumption that..."', 'Evidence need: "The author would need to provide evidence that..."', 'Alternative: "A more plausible explanation is..."', 'Strengthen: "To bolster the claim, additional data on X is required..."'] },
        { type: 'template', title: 'Opening Templates', lines: ['Issue: "The claim that ___ raises a complex question about ___. Although ___ has merit in some contexts, I largely [agree / disagree] because ___."', 'Argument: "The author concludes that ___ based on ___. However, the reasoning relies on several questionable assumptions that, when scrutinized, weaken the conclusion."'] },
        { type: 'note', title: 'How to Use', text: 'Print the phrase bank on one sheet and consult it during practice. Each session, try to use two or three phrases, then check whether the context fits. Active reuse beats passive memorization.' }
      ]
    }
  },

  'gre-weekly': {
    zh: {
      sections: [
        { type: 'paragraph', text: '8 周冲刺计划适合已有词汇基础、需要把 Verbal 与 Quant 推到目标分的同学。整体节奏是“第 1-2 周打基础，第 3-5 周分项强化，第 6-7 周整 section 模考，第 8 周收尾与状态调整”。' },
        { type: 'list', title: '阶段任务', items: ['W1-2：核心词汇覆盖 + Quant 公式回顾 + 各题型样题练习。', 'W3-4：Verbal 分项专练（TC / SE / RC）+ Quant 弱项突破。', 'W5：第一次完整模考 + 错题归类。', 'W6-7：每周 1 套完整模考 + 错题专项 + AW 限时练习。', 'W8：每天单 section 计时 + 调整作息 + 整理高频公式。'] },
        { type: 'template', title: '每周固定项', lines: ['Mon-Thu: 60-80 新词 + 2 项专题练习（每项 30 分钟）', 'Fri: 单 section 限时（V or Q 各 1 次）', 'Sat: 完整模考或 AW 限时', 'Sun: 1 小时错题归类 + 下周计划'] },
        { type: 'list', title: '风险控制', items: ['若 W4 进度不达预期，应缩减词汇增量、加强题型专练。', '若 W6 模考 Quant 仍低于目标，集中在弱题型而非整 section。', '若 AW 状态长期不稳定，固定一套结构而非每次换思路。'] },
        { type: 'note', title: '使用提示', text: '建议每周日填写一份 1 页周报：本周完成、本周错因、下周聚焦。8 周后回看周报，能清晰看到能力曲线与瓶颈。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'An eight-week sprint fits learners with a vocabulary base who need to push Verbal and Quant toward target. The arc: weeks 1-2 lay the foundation, weeks 3-5 isolate weaknesses, weeks 6-7 run section-level mocks, week 8 tapers and consolidates.'},
        { type: 'list', title: 'Phase Tasks', items: ['W1-2: cover core vocabulary, refresh Quant formulas, light sampler drills.', 'W3-4: Verbal sub-task drills (TC / SE / RC) + targeted Quant weak spots.', 'W5: first full mock and error categorization.', 'W6-7: one full mock per week + targeted retries + timed AW.', 'W8: daily single-section timing, regulate sleep, refresh formula sheet.'] },
        { type: 'template', title: 'Weekly Pattern', lines: ['Mon-Thu: 60-80 new words + two 30-min drill blocks', 'Fri: one timed section (V or Q)', 'Sat: full mock or timed AW', 'Sun: one hour error review + next-week plan'] },
        { type: 'list', title: 'Risk Controls', items: ['If W4 progress lags, trim new-word load and double down on drills.', 'If W6 Quant still misses target, focus on weak types instead of full sections.', 'If AW remains unstable, fix one essay structure rather than reshuffling each draft.'] },
        { type: 'note', title: 'Tip', text: 'Fill a one-page weekly report each Sunday: wins, error patterns, next focus. Reviewing eight reports later reveals your growth curve and remaining bottleneck.' }
      ]
    }
  }
}
