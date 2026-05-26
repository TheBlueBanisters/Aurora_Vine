/** TOEFL 资源条目正文集合（除 listening/speaking 主入口外的其它 TOEFL 条目） */

export const TOEFL_EXTRA_CONTENT = {
  'toefl-listening-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: '托福听力讲座横跨生物、地质、艺术、经济等学科，失分常因“听懂大意但抓不住考点词”。建议按学科建立 mini 词表，并在笔记中标注学科信号词。' },
        { type: 'list', title: '学科高频词示例', items: ['Biology：ecosystem、predator、symbiosis、mutation', 'Geology：sediment、erosion、tectonic、fossil', 'Art history：Renaissance、patron、medium、restoration', 'Economics：incentive、subsidy、elasticity、monopoly'] },
        { type: 'template', title: '学科笔记框架', lines: ['Field: ___', 'Main concept: ___', 'Example / evidence: ___', 'Professor contrast: however / on the other hand', 'Implication: ___'] },
        { type: 'note', title: '提示', text: '遇到陌生学科词不要 panic，先抓动词和逻辑连接词判断段落功能，专有名词往往会在后文解释。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'TOEFL lectures span biology, geology, art, economics, and more. Many misses come from catching the gist but not the tested terms. Build mini word lists by field and mark discipline cues in your notes.' },
        { type: 'list', title: 'Sample Field Vocabulary', items: ['Biology: ecosystem, predator, symbiosis, mutation', 'Geology: sediment, erosion, tectonic, fossil', 'Art history: Renaissance, patron, medium, restoration', 'Economics: incentive, subsidy, elasticity, monopoly'] },
        { type: 'template', title: 'Field Note Frame', lines: ['Field: ___', 'Main concept: ___', 'Example / evidence: ___', 'Professor contrast: however / on the other hand', 'Implication: ___'] },
        { type: 'note', title: 'Tip', text: 'When a technical term is unfamiliar, track verbs and connectors first. Proper nouns are often defined later in the lecture.' }
      ]
    }
  },

  'toefl-speaking-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: '综合口语 Task 3（Campus）与 Task 4（Academic）要求你在 60 秒内整合阅读与听力。关键是先读清“变化/观点”，再听“支持/反对理由”，最后用固定结构输出。' },
        { type: 'list', title: 'Task 3 Campus 结构', items: ['Reading：学校计划 + 两个理由', 'Listening：男生/女生 agree 或 disagree + 两个反驳', '回答：The reading proposes... The student disagrees because...'] },
        { type: 'list', title: 'Task 4 Academic 结构', items: ['Reading：定义一个概念 + 两个特征', 'Listening：教授举例说明', '回答：The lecture explains [concept] by giving two examples...'] },
        { type: 'template', title: '60 秒回答模板', lines: ['The reading passage discusses...', 'In the listening, the professor / student explains that...', 'First, ...', 'Second, ...', 'Therefore, ...'] },
        { type: 'note', title: '提示', text: '综合口语不要复述全部细节，选 2 个最强理由即可。练习时用计时器，45 秒内容 + 15 秒缓冲最稳。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Integrated Speaking Tasks 3 and 4 require a 60-second summary of reading plus listening. Clarify the change or concept in the reading, capture support or opposition in the audio, then deliver a fixed structure.' },
        { type: 'list', title: 'Task 3 Campus Pattern', items: ['Reading: university plan with two reasons', 'Listening: student agrees or disagrees with two counterpoints', 'Response: "The reading proposes... The student disagrees because..."'] },
        { type: 'list', title: 'Task 4 Academic Pattern', items: ['Reading: defines a concept with two features', 'Listening: professor illustrates with examples', 'Response: "The lecture explains [concept] with two examples..."'] },
        { type: 'template', title: '60-Second Template', lines: ['The reading passage discusses...', 'In the listening, the professor / student explains that...', 'First, ...', 'Second, ...', 'Therefore, ...'] },
        { type: 'note', title: 'Tip', text: 'Do not recite every detail. Pick the two strongest points. Practice with a timer: ~45 seconds of content plus a 15-second buffer.' }
      ]
    }
  },

  'toefl-writing': {
    zh: {
      sections: [
        { type: 'paragraph', text: '综合写作（Integrated Writing）考查你是否能准确对比阅读与听力：阅读提出 3 点，听力通常逐条反驳。文章应客观描述双方，不要加入个人观点。' },
        { type: 'template', title: '四段结构', lines: ['Intro: The reading and the lecture discuss ___; they disagree on three points.', 'Body 1: The reading claims that ___. However, the lecturer argues that ___.', 'Body 2: ...', 'Body 3: ...'] },
        { type: 'list', title: '常用对比表达', items: ['The reading states / suggests / claims...', 'In contrast, the lecturer contends / points out...', 'While the article argues..., the speaker refutes this by...', 'The professor casts doubt on... by noting...'] },
        { type: 'list', title: '检查清单', items: ['是否覆盖阅读 3 点 + 听力 3 点反驳？', '是否避免使用 I think / personally？', '字数是否达到 150–225 词？', '时态是否一致（一般现在时描述观点）？'] },
        { type: 'note', title: '提示', text: '笔记阶段用 R1/R2/R3 对应 L1/L2/L3，写作时逐条展开，能显著降低漏点风险。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Integrated Writing tests whether you can contrast reading and listening accurately. The passage usually offers three claims; the lecture typically rebuts each. Stay objective—no personal opinion.' },
        { type: 'template', title: 'Four-Paragraph Structure', lines: ['Intro: The reading and lecture discuss ___; they disagree on three points.', 'Body 1: The reading claims ___. However, the lecturer argues ___.', 'Body 2: ...', 'Body 3: ...'] },
        { type: 'list', title: 'Contrast Phrases', items: ['The reading states / suggests / claims...', 'In contrast, the lecturer contends / points out...', 'While the article argues..., the speaker refutes this by...', 'The professor casts doubt on... by noting...'] },
        { type: 'list', title: 'Checklist', items: ['All three reading points and three lecture rebuttals covered?', 'No I think / personally?', 'Word count 150–225?', 'Consistent present tense for reporting views?'] },
        { type: 'note', title: 'Tip', text: 'Label notes R1/R2/R3 and L1/L2/L3 during the task. Expand point by point in the essay to avoid omissions.' }
      ]
    }
  },

  'toefl-reading': {
    zh: {
      sections: [
        { type: 'paragraph', text: '托福阅读长难句的核心是找主干：主语 + 谓语 + 宾语。插入语、定语从句、分词结构都是修饰，不应干扰主干理解。' },
        { type: 'list', title: '拆句四步', items: ['找谓语动词（注意并列谓语）。', '确定主语（可能在从句前或后）。', '用括号剥离修饰成分。', '还原逻辑连接词：however、therefore、in contrast。'] },
        { type: 'list', title: '常见结构', items: ['同位语：The theory, a controversial idea, suggests...', '倒装：Not until the 19th century did scientists...', '分词：Having been observed for decades, the phenomenon...'] },
        { type: 'template', title: '精读笔记', lines: ['Sentence: ___', 'Main S-V-O: ___', 'Logic connector: ___', 'One-line paraphrase: ___'] },
        { type: 'note', title: '提示', text: '每天精析 5 句比泛读 1 篇更有效。两周后回到限时阅读，句子边界会清晰很多。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'TOEFL reading sentences reward finding the core clause: subject, verb, object. Parentheticals, relative clauses, and participial phrases are modifiers—they should not block the main line.' },
        { type: 'list', title: 'Four Parsing Steps', items: ['Locate the main verb (watch coordinated verbs).', 'Identify the subject (may precede or follow a clause).', 'Strip modifiers with brackets.', 'Restore logic connectors: however, therefore, in contrast.'] },
        { type: 'list', title: 'Frequent Patterns', items: ['Appositive: "The theory, a controversial idea, suggests..."', 'Inversion: "Not until the 19th century did scientists..."', 'Participial: "Having been observed for decades, the phenomenon..."'] },
        { type: 'template', title: 'Intensive Notes', lines: ['Sentence: ___', 'Main S-V-O: ___', 'Logic connector: ___', 'One-line paraphrase: ___'] },
        { type: 'note', title: 'Tip', text: 'Parse five sentences daily rather than skim a full passage. After two weeks, timed reading feels much clearer.' }
      ]
    }
  },

  'toefl-mock': {
    zh: {
      sections: [
        { type: 'paragraph', text: '托福模考应模拟完整 3 小时流程：阅读 54–72 分钟、听力 41–57 分钟、10 分钟休息、口语 17 分钟、写作 50 分钟。中途不暂停，才能暴露真实节奏问题。' },
        { type: 'list', title: '模考节奏', items: ['T-6 周：1 套 TPO 基线（可不含写作）。', 'T-4 周：完整模考 + 写作限时。', 'T-2 周：再 1 套完整模考对比进步。', 'T-1 周：单 section 计时，避免疲劳。'] },
        { type: 'template', title: '复盘模板', lines: ['Reading: time / errors / slow passage', 'Listening: lecture vs conversation errors', 'Speaking: recording review (fluency / structure)', 'Writing: integrated + independent word count', 'Next week focus: ___'] },
        { type: 'note', title: '提示', text: '模考分数波动 3–5 分属正常。重点看错因类型是否减少，而非单次总分。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'A TOEFL mock should mirror the full ~3-hour flow: Reading 54–72 min, Listening 41–57 min, 10-min break, Speaking 17 min, Writing 50 min. No pauses—only then will pacing issues surface.' },
        { type: 'list', title: 'Mock Schedule', items: ['T-6 weeks: one TPO baseline (writing optional).', 'T-4 weeks: full mock with timed writing.', 'T-2 weeks: second full mock for comparison.', 'T-1 week: single-section timing only.'] },
        { type: 'template', title: 'Debrief Template', lines: ['Reading: time / errors / slow passage', 'Listening: lecture vs conversation errors', 'Speaking: recording review (fluency / structure)', 'Writing: integrated + independent word count', 'Next week focus: ___'] },
        { type: 'note', title: 'Tip', text: 'A 3–5 point swing is normal. Track whether error types shrink, not just the total score.' }
      ]
    }
  },

  'toefl-integrated-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'Campus Conversation 综合口语常考：图书馆延长开放、食堂改菜单、停车政策、宿舍规则、课程调整。熟悉场景后，听力中的 agree/disagree 信号更容易捕捉。' },
        { type: 'list', title: '高频 Campus 场景', items: ['Library hours / study room reservation', 'Dining hall menu / meal plan change', 'Parking permit / shuttle bus schedule', 'Dorm quiet hours / guest policy', 'Course schedule / add-drop deadline'] },
        { type: 'template', title: 'Task 3 笔记', lines: ['Reading plan: ___', 'Reason 1 / Reason 2', 'Student stance: agree / disagree', 'Counter 1 / Counter 2'] },
        { type: 'note', title: '提示', text: 'Campus 题阅读通常只有 45 秒，务必先圈出 plan 和两个 reason，再听学生立场。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Campus integrated speaking often covers library hours, dining changes, parking, dorm rules, or course adjustments. Knowing the scenarios helps you catch agree/disagree cues faster.' },
        { type: 'list', title: 'Common Campus Topics', items: ['Library hours / study room reservation', 'Dining hall menu / meal plan change', 'Parking permit / shuttle bus schedule', 'Dorm quiet hours / guest policy', 'Course schedule / add-drop deadline'] },
        { type: 'template', title: 'Task 3 Notes', lines: ['Reading plan: ___', 'Reason 1 / Reason 2', 'Student stance: agree / disagree', 'Counter 1 / Counter 2'] },
        { type: 'note', title: 'Tip', text: 'You only get ~45 seconds on the reading. Circle the plan and two reasons before listening for the student stance.' }
      ]
    }
  },

  'toefl-academic-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'Biology 与 History 是 Task 4 学术讲座最高频领域。Biology 常考概念+双例子；History 常考事件因果+对比。笔记应抓“定义→例子→总结”三段。' },
        { type: 'list', title: 'Biology 讲座结构', items: ['定义概念（如 symbiosis、adaptation）', 'Example 1：具体物种或实验', 'Example 2：对比或例外情况', 'Conclusion：概念的应用或意义'] },
        { type: 'list', title: 'History 讲座结构', items: ['背景事件或人物', 'Cause → Effect 链条', 'Contrast：另一种解释或观点', 'Significance：对后世的影响'] },
        { type: 'template', title: 'Task 4 回答', lines: ['The reading defines [term] as...', 'The professor illustrates this with two examples.', 'First, ...', 'Second, ...', 'These examples show that...'] },
        { type: 'note', title: '提示', text: 'Task 4 不要复述阅读定义的全部细节，重点放在教授举的两个例子上。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Biology and history dominate Task 4 academic lectures. Biology often uses concept plus two examples; history favors cause-effect chains and contrast. Notes should track definition → examples → summary.' },
        { type: 'list', title: 'Biology Lecture Shape', items: ['Define a concept (symbiosis, adaptation)', 'Example 1: species or experiment', 'Example 2: contrast or exception', 'Conclusion: application or significance'] },
        { type: 'list', title: 'History Lecture Shape', items: ['Background event or figure', 'Cause → effect chain', 'Contrast: alternate explanation', 'Significance: later impact'] },
        { type: 'template', title: 'Task 4 Response', lines: ['The reading defines [term] as...', 'The professor illustrates this with two examples.', 'First, ...', 'Second, ...', 'These examples show that...'] },
        { type: 'note', title: 'Tip', text: 'Do not recite the full reading definition. Weight the professor’s two examples in your response.' }
      ]
    }
  },

  'toefl-vocab': {
    zh: {
      sections: [
        { type: 'paragraph', text: '托福学科词汇不必全背，但应掌握各领域的“骨架词”——出现频率高、能帮助猜题的词。天文、经济、艺术三科在听力与阅读中反复出现。' },
        { type: 'list', title: 'Astronomy', items: ['orbit、galaxy、telescope、light year', 'asteroid、comet、meteor、crater', 'rotation、revolution、eclipse'] },
        { type: 'list', title: 'Economics & Art', items: ['supply / demand、inflation、recession、trade', 'Renaissance、portrait、sculpture、patron', 'abstract、perspective、medium、canvas'] },
        { type: 'template', title: '学科词卡', lines: ['Field: ___', 'Core term: ___', 'Context sentence: ___', 'Related word: ___'] },
        { type: 'note', title: '提示', text: '每天 15 个学科词 + 1 条例句，比孤立背单词表更有效。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'You need not memorize every TOEFL academic term, but each field has skeleton words that recur in listening and reading. Astronomy, economics, and art appear constantly.' },
        { type: 'list', title: 'Astronomy', items: ['orbit, galaxy, telescope, light year', 'asteroid, comet, meteor, crater', 'rotation, revolution, eclipse'] },
        { type: 'list', title: 'Economics & Art', items: ['supply / demand, inflation, recession, trade', 'Renaissance, portrait, sculpture, patron', 'abstract, perspective, medium, canvas'] },
        { type: 'template', title: 'Field Flashcard', lines: ['Field: ___', 'Core term: ___', 'Context sentence: ___', 'Related word: ___'] },
        { type: 'note', title: 'Tip', text: 'Fifteen field terms plus one sample sentence daily beats a detached word list.' }
      ]
    }
  },

  'toefl-writing-2': {
    zh: {
      sections: [
        { type: 'paragraph', text: '独立写作（Independent Writing）要求 30 分钟内就一个问题表态并论证。高频题型：二选一、是否同意、三选一。建议准备 3 套万能结构，考场上只换例子。' },
        { type: 'list', title: '高频题型', items: ['Agree or disagree with a statement', 'Which do you prefer, A or B?', 'Do advantages outweigh disadvantages?', 'Describe a quality / skill and explain why'] },
        { type: 'template', title: '四段式', lines: ['Intro: paraphrase + clear position', 'Body 1: reason 1 + personal example', 'Body 2: reason 2 + hypothetical or second example', 'Conclusion: restate + broader implication'] },
        { type: 'list', title: '万能例子库', items: ['Personal: course project, internship, volunteer work', 'Societal: technology impact, education policy, environment', 'Historical: well-known figure or event (keep brief)'] },
        { type: 'note', title: '提示', text: '目标 380–450 词。开头 2 分钟写提纲，避免中途换立场。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Independent Writing gives 30 minutes to take a stand and support it. Common prompts: agree/disagree, pick A or B, advantages vs disadvantages. Prepare three reusable structures and swap examples on test day.' },
        { type: 'list', title: 'Prompt Types', items: ['Agree or disagree with a statement', 'Which do you prefer, A or B?', 'Do advantages outweigh disadvantages?', 'Describe a quality or skill and explain why'] },
        { type: 'template', title: 'Four Paragraphs', lines: ['Intro: paraphrase + clear position', 'Body 1: reason 1 + personal example', 'Body 2: reason 2 + second example', 'Conclusion: restate + broader implication'] },
        { type: 'list', title: 'Example Bank', items: ['Personal: course project, internship, volunteer work', 'Societal: technology, education policy, environment', 'Historical: brief well-known figure or event'] },
        { type: 'note', title: 'Tip', text: 'Aim for 380–450 words. Outline for two minutes up front; do not switch positions mid-essay.' }
      ]
    }
  },

  'toefl-shadowing': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'Shadowing（跟读）训练改善口语流利度、语调与节奏。选 30–60 秒 native 音频，先听 2 遍，再同步跟读，最后录音对比。' },
        { type: 'list', title: '跟读步骤', items: ['Pass 1：盲听，抓大意。', 'Pass 2：看文本，标重音与连读。', 'Pass 3：同步跟读（shadow）。', 'Pass 4：录音自评，修正 1 处发音或语调。'] },
        { type: 'template', title: '节奏标注示例', lines: ['The PROfessor EXplains that... (重音大写)', 'not‿at‿all → 连读', 'rise on focus, fall at statement end'] },
        { type: 'note', title: '材料推荐', text: 'TPO 听力 Lecture 片段、ETS Official TOEFL iBT Tests 音频。每天 15 分钟，坚持 2 周可见改善。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Shadowing improves fluency, intonation, and rhythm. Pick a 30–60 second native clip: listen twice, shadow in sync, then record and compare.' },
        { type: 'list', title: 'Shadowing Steps', items: ['Pass 1: blind listen for gist.', 'Pass 2: read transcript; mark stress and linking.', 'Pass 3: shadow in sync.', 'Pass 4: record yourself; fix one pronunciation or intonation spot.'] },
        { type: 'template', title: 'Rhythm Marks', lines: ['The PROfessor EXplains that... (stress caps)', 'not‿at‿all → linking', 'rise on focus, fall at statement end'] },
        { type: 'note', title: 'Sources', text: 'TPO lecture clips or ETS Official TOEFL iBT audio. Fifteen minutes daily for two weeks should show gains.' }
      ]
    }
  },

  'toefl-template': {
    zh: {
      sections: [
        { type: 'paragraph', text: '四科通用模板不是死记硬背，而是确保压力下仍能组织答案。建议各准备 1 套开头、过渡、结尾，考场上组合使用。' },
        { type: 'list', title: '阅读 / 听力', items: ['阅读：主旨题 → "The passage mainly discusses..."', '听力：笔记符号 Def / Ex / But / ?', '插入题：回原文找代词指代'] },
        { type: 'list', title: '口语 / 写作', items: ['口语独立：I prefer... The first reason... For example...', '口语综合：The reading... The lecturer/student...', '写作综合：The reading claims... However, the lecturer...', '写作独立：In my opinion... To begin with... Furthermore...'] },
        { type: 'template', title: '过渡句库', lines: ['To illustrate this point, ...', 'Another factor to consider is...', 'That being said, ...', 'In conclusion, ...'] },
        { type: 'note', title: '提示', text: '模板应内化为自然表达，避免考官/评分系统识别为机械套话。练习时每次换不同例子填充。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Cross-skill templates are not for rote memorization—they guarantee structure under pressure. Keep one opening, transition, and closing set per skill and mix on test day.' },
        { type: 'list', title: 'Reading / Listening', items: ['Reading main idea: "The passage mainly discusses..."', 'Listening symbols: Def / Ex / But / ?', 'Insert sentence: return to pronoun antecedent'] },
        { type: 'list', title: 'Speaking / Writing', items: ['Independent speaking: I prefer... The first reason... For example...', 'Integrated speaking: The reading... The lecturer/student...', 'Integrated writing: The reading claims... However, the lecturer...', 'Independent writing: In my opinion... To begin with... Furthermore...'] },
        { type: 'template', title: 'Transition Bank', lines: ['To illustrate this point, ...', 'Another factor to consider is...', 'That being said, ...', 'In conclusion, ...'] },
        { type: 'note', title: 'Tip', text: 'Internalize templates so they sound natural. Swap fresh examples each practice session.' }
      ]
    }
  },

  'toefl-retake': {
    zh: {
      sections: [
        { type: 'paragraph', text: '二考提分应基于首考错题分析，而非盲目重刷。找出最低分 section 和 top 3 错因，用 4 周专项计划针对性突破。' },
        { type: 'list', title: '4 周复习表', items: ['W1：错因归类 + 最低 section 专项（每天 1 小时）', 'W2：第二弱项 + 口语/写作录音复盘', 'W3：1 套完整模考 + 对比首考', 'W4：单 section 计时 + 调整作息，不做新整套'] },
        { type: 'template', title: '弱项追踪', lines: ['Section: ___', 'First score: ___ Target: ___', 'Top 3 error types: ___', 'Daily drill: ___', 'Mock 2 vs Mock 1: ___'] },
        { type: 'note', title: '提示', text: '两次考试间隔建议 ≥ 12 天。若首考 Speaking/Writing 明显偏低，二考前至少完成 8 次限时练习并录音。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Retake gains come from first-exam error analysis, not blind repetition. Find your lowest section and top three error types, then run a four-week targeted plan.' },
        { type: 'list', title: 'Four-Week Plan', items: ['W1: categorize errors; drill lowest section daily (1 hr)', 'W2: second weakness + speaking/writing recording review', 'W3: one full mock vs first exam', 'W4: single-section timing + sleep routine; no new full sets'] },
        { type: 'template', title: 'Weakness Tracker', lines: ['Section: ___', 'First score: ___ Target: ___', 'Top 3 error types: ___', 'Daily drill: ___', 'Mock 2 vs Mock 1: ___'] },
        { type: 'note', title: 'Tip', text: 'Allow at least 12 days between attempts. If Speaking/Writing lagged, complete eight timed, recorded practices before retaking.' }
      ]
    }
  }
}
