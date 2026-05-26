/** SOP / PS 资源条目正文集合（除 sop-template / sop-structure 主入口外的其它条目） */

export const SOP_EXTRA_CONTENT = {
  'sop-template-2': {
    zh: { sections: [
      { type: 'paragraph', text: '800 词以内精简 SOP 需 ruthless 取舍：只保留 1 段动机、2 段核心经历、1 段 fit、1 段目标。' },
      { type: 'template', title: '五段紧凑结构', lines: ['P1 (~120w): hook + field interest', 'P2 (~180w): strongest experience #1', 'P3 (~180w): experience #2 or research', 'P4 (~150w): why this program (specific)', 'P5 (~100w): goals + contribution'] },
      { type: 'list', title: '删减技巧', items: ['合并相似项目为一例', '删除 childhood 除非直接相关', 'Fit 段只写 2 个具体资源名'] },
      { type: 'note', title: '提示', text: '超字数时先删 adjectives，再删 secondary examples。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Under 800 words, cut ruthlessly: one motivation block, two core experiences, one fit paragraph, one goals paragraph.' },
      { type: 'template', title: 'Compact Five Blocks', lines: ['P1 (~120w): hook + field interest', 'P2 (~180w): strongest experience', 'P3 (~180w): second experience or research', 'P4 (~150w): why this program (specific)', 'P5 (~100w): goals + contribution'] },
      { type: 'list', title: 'Trim Tactics', items: ['Merge similar projects', 'Drop childhood unless directly relevant', 'Name only two program resources in fit'] },
      { type: 'note', title: 'Tip', text: 'When over limit, cut adjectives before secondary examples.' }
    ]}
  },

  'sop-motivation': {
    zh: { sections: [
      { type: 'paragraph', text: '研究动机段需从具体经历（课程、项目、阅读、实习）自然引出“为何想深入该方向”，避免空泛“从小就喜欢”。' },
      { type: 'list', title: '引出兴趣的路径', items: ['课程论文 → 发现 unanswered question', '实习观察 → 想系统学习 method', '阅读经典 → 想 extend 到 new context', '社会现象 → 想用 discipline 分析'] },
      { type: 'template', title: '动机段骨架', lines: ['During [experience], I encountered [problem/question].', 'This led me to explore [reading/project], where I learned [skill/insight].', 'I now seek formal training in [field] to [specific goal].'] },
      { type: 'note', title: '提示', text: '动机应是 logical chain，不是 emotional declaration alone。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Motivation paragraphs should grow from concrete experiences—courses, projects, reading, internships—not vague “always loved this.”' },
      { type: 'list', title: 'Paths to Interest', items: ['Course paper → unanswered question', 'Internship → need systematic methods', 'Reading a classic → extend to new context', 'Social issue → analyze with discipline tools'] },
      { type: 'template', title: 'Motivation Skeleton', lines: ['During [experience], I encountered [problem/question].', 'I explored [reading/project] and learned [skill/insight].', 'I now seek training in [field] to [specific goal].'] },
      { type: 'note', title: 'Tip', text: 'Motivation is a logic chain, not emotion alone.' }
    ]}
  },

  'sop-career': {
    zh: { sections: [
      { type: 'paragraph', text: 'Career plan 段衔接 short-term（毕业 3–5 年）与 long-term（10 年+），并说明项目如何 bridge 两者。' },
      { type: 'template', title: '三段目标', lines: ['Short-term: After graduation, I plan to [role] at [type of org] to [skill].', 'Mid-term: With [experience], I aim to [broader impact].', 'Long-term: Ultimately, I hope to [vision] by [method].'] },
      { type: 'list', title: '避免', items: ['过于 narrow（仅一家 company 名）', '与 field 无关的 celebrity dream', '无 mid-term 的 jump'] },
      { type: 'note', title: '提示', text: 'Research 项目可写 faculty / lab / industry R&D；professional 项目写 sector 与 function。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Career paragraphs link short-term (3–5 years post-grad) and long-term (10+ years), showing how the program bridges them.' },
      { type: 'template', title: 'Three Horizons', lines: ['Short-term: After graduation, [role] at [org type] to build [skill].', 'Mid-term: With [experience], [broader impact].', 'Long-term: [vision] through [method].'] },
      { type: 'list', title: 'Avoid', items: ['Naming one company only', 'Celebrity dreams unrelated to field', 'Long-term with no mid-term step'] },
      { type: 'note', title: 'Tip', text: 'Research paths: faculty, lab, industry R&D; professional paths: sector and function.' }
    ]}
  },

  'sop-diversity': {
    zh: { sections: [
      { type: 'paragraph', text: 'Diversity Statement 阐述背景、视角如何 shape 你的贡献与学习社区的方式。聚焦 growth 与 contribution，非 victim narrative。' },
      { type: 'list', title: '可写角度', items: ['First-generation, regional, socioeconomic background', 'Cross-cultural or bilingual experience', 'Overcoming barrier 与 learned perspective', 'How you will support inclusive community'] },
      { type: 'template', title: '结构', lines: ['Context: background that shaped your view', 'Experience: specific moment of learning or challenge', 'Insight: what you bring to classroom/lab', 'Commitment: how you will engage on campus'] },
      { type: 'note', title: '提示', text: '遵循学校 prompt 字数；部分项目 diversity 与 PS 分开提交。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Diversity statements explain how background and perspective shape your contribution—focus on growth and community, not victim narratives.' },
      { type: 'list', title: 'Angles', items: ['First-gen, regional, socioeconomic context', 'Cross-cultural or bilingual life', 'Barrier overcome and insight gained', 'Supporting inclusive community'] },
      { type: 'template', title: 'Structure', lines: ['Context: background shaping your view', 'Experience: specific learning moment', 'Insight: what you bring to classroom/lab', 'Commitment: campus engagement'] },
      { type: 'note', title: 'Tip', text: 'Follow prompt word limits; some schools separate diversity from main PS.' }
    ]}
  },

  'sop-sample': {
    zh: { sections: [
      { type: 'paragraph', text: '范文用于学习论证结构与过渡，禁止 plagiarize。按专业方向比较：STEM 重 method；人文重 question；商科重 impact。' },
      { type: 'list', title: '阅读范文方法', items: ['标出每段 function（动机/证据/fit/目标）', '记录 3 个 transition 句型', '对比 weak vs strong opening', '忽略具体学校名，学 skeleton'] },
      { type: 'list', title: '方向差异', items: ['CS/Engineering：project + technical depth', 'Social science：question + method evolution', 'Business：leadership story + quant impact', 'Arts：portfolio context + intellectual frame'] },
      { type: 'note', title: '提示', text: '用范文自检：你的 PS 每段是否也有 clear function？' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Samples teach structure and transitions—never plagiarize. STEM stresses methods; humanities stress questions; business stresses impact.' },
      { type: 'list', title: 'How to Read Samples', items: ['Label each paragraph function', 'Collect three transition phrases', 'Compare weak vs strong openings', 'Learn skeleton, ignore school names'] },
      { type: 'list', title: 'By Field', items: ['CS/Engineering: projects + technical depth', 'Social science: question + method arc', 'Business: leadership + quant impact', 'Arts: portfolio + intellectual frame'] },
      { type: 'note', title: 'Tip', text: 'Self-check: does each of your paragraphs have a clear function like the samples?' }
    ]}
  },

  'sop-opening': {
    zh: { sections: [
      { type: 'paragraph', text: 'PS 开头应用 1–2 句 hook 抓住读者：具体场景、问题、或 defining moment，避免 cliché 名言或 dictionary definition。' },
      { type: 'list', title: 'Hook 类型对比', items: ['Scene：In the lab at 2 a.m., I realized...', 'Question：Why do policies fail when data is abundant?', 'Pivot：My internship in X changed how I see Y.', 'Weak：Since childhood I loved... / Webster defines...'] },
      { type: 'template', title: 'Opening 公式', lines: ['[Specific scene or question]', 'This experience revealed [insight].', 'It motivates my pursuit of [field/program].'] },
      { type: 'note', title: '提示', text: '开头 3 句内应出现 field 或 problem domain。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Open with a 1–2 sentence hook: a scene, question, or pivot moment—not cliché quotes or dictionary definitions.' },
      { type: 'list', title: 'Hook Comparison', items: ['Scene: In the lab at 2 a.m., I realized...', 'Question: Why do policies fail when data is abundant?', 'Pivot: My internship in X changed how I see Y.', 'Weak: Since childhood... / Webster defines...'] },
      { type: 'template', title: 'Opening Formula', lines: ['[Specific scene or question]', 'This revealed [insight].', 'It motivates my pursuit of [field/program].'] },
      { type: 'note', title: 'Tip', text: 'Name the field or problem domain within three sentences.' }
    ]}
  },

  'sop-research': {
    zh: { sections: [
      { type: 'paragraph', text: '研究经历段从 project 过渡到 research interest：问题 → 方法 → 发现 → 局限 → 下一步想学什么。' },
      { type: 'template', title: '研究段', lines: ['I investigated [question] using [method/data].', 'Findings showed [result], which raised [new question].', 'This experience prepared me for [skill/course/lab at target program].'] },
      { type: 'list', title: '无 formal research 时', items: ['用 course project 或 independent study', '强调 analytical process 非 title', 'Link to faculty work you hope to join'] },
      { type: 'note', title: '提示', text: '勿夸大 author order 或 publication status。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Research paragraphs move project → interest: question, method, finding, limitation, next learning goal.' },
      { type: 'template', title: 'Research Block', lines: ['I investigated [question] using [method/data].', 'Findings showed [result], raising [new question].', 'This prepared me for [skill/course/lab at target program].'] },
      { type: 'list', title: 'Without Formal Research', items: ['Use course or independent projects', 'Stress analytical process over titles', 'Link to faculty you hope to work with'] },
      { type: 'note', title: 'Tip', text: 'Do not inflate author order or publication status.' }
    ]}
  },

  'sop-failure': {
    zh: { sections: [
      { type: 'paragraph', text: 'Failure / setback 叙事展示 resilience 与 self-awareness：简述失败 → 分析原因 → 采取 action → 学到什么 → 如何 apply  forward。' },
      { type: 'template', title: '叙事弧', lines: ['When [setback] happened, I initially [reaction].', 'I realized [root cause].', 'I then [concrete action].', 'This taught me [lesson], which I applied in [later success].'] },
      { type: 'list', title: '选材', items: ['学术：项目失败、方法修正、成绩低谷后 rebound', '非学术：leadership conflict、跨文化 miscommunication', '避免：违法、严重 ethical 问题'] },
      { type: 'note', title: '提示', text: '篇幅控制在 1 段或半段，非全文 focus on failure。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Setback narratives show resilience: brief failure, root cause, action taken, lesson, forward application.' },
      { type: 'template', title: 'Arc', lines: ['When [setback] happened, I [reaction].', 'I realized [root cause].', 'I then [concrete action].', 'This taught [lesson], applied in [later success].'] },
      { type: 'list', title: 'Topic Choice', items: ['Academic: project failure, method fix, grade rebound', 'Non-academic: leadership conflict, cultural miscommunication', 'Avoid: illegal or serious ethical issues'] },
      { type: 'note', title: 'Tip', text: 'Keep to one paragraph—failure is not the whole essay.' }
    ]}
  },

  'sop-why-school': {
    zh: { sections: [
      { type: 'paragraph', text: 'Why School 段必须 program-specific：课程名、lab、教授、 clinic、career resource 至少 2 个 concrete 匹配点。' },
      { type: 'template', title: 'Fit 段', lines: ['Program X attracts me because of [Course/Lab A], which aligns with my interest in [topic].', 'I hope to work with Prof. [Name] on [research area].', 'The [center/clinic/internship] will help me [career step].'] },
      { type: 'list', title: '避免', items: ['排名与 reputation 堆砌', '复制官网 paragraph', '对所有学校同一 fit 段'] },
      { type: 'note', title: '提示', text: '每校 rewrite fit 段；其余段落可 70% 复用 + 30% tailor。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Why School paragraphs must be program-specific: at least two concrete matches—courses, labs, faculty, clinics, career resources.' },
      { type: 'template', title: 'Fit Block', lines: ['Program X fits because [Course/Lab A] aligns with [topic].', 'I hope to work with Prof. [Name] on [area].', '[Center/clinic/internship] supports my [career step].'] },
      { type: 'list', title: 'Avoid', items: ['Ranking fluff', 'Pasting website text', 'Same fit paragraph for every school'] },
      { type: 'note', title: 'Tip', text: 'Rewrite fit per school; other paragraphs may be 70% reused, 30% tailored.' }
    ]}
  },

  'sop-short': {
    zh: { sections: [
      { type: 'paragraph', text: '500 词 PS 需在 structure 与 depth 间 trade-off：优先 1 个 deep example + 1 fit paragraph。' },
      { type: 'list', title: '结构取舍', items: ['删：第二例子、冗长 background', '留：clear thesis + one evidence block + fit + goal', '句长控制：平均 15–20 词/句'] },
      { type: 'template', title: '500 词 map', lines: ['Hook + thesis: ~80w', 'Main evidence: ~200w', 'Why program: ~120w', 'Closing goal: ~100w'] },
      { type: 'note', title: '提示', text: 'UK 部分项目限 500 words—用 word count 工具 strict 检查。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'A 500-word PS trades depth for structure: one deep example plus one fit paragraph usually wins.' },
      { type: 'list', title: 'Trade-offs', items: ['Cut: second example, long background', 'Keep: thesis, one evidence block, fit, goal', 'Aim ~15–20 words per sentence average'] },
      { type: 'template', title: '500-Word Map', lines: ['Hook + thesis: ~80w', 'Main evidence: ~200w', 'Why program: ~120w', 'Closing: ~100w'] },
      { type: 'note', title: 'Tip', text: 'UK caps often at 500 words—verify with a strict word counter.' }
    ]}
  },

  'sop-phd': {
    zh: { sections: [
      { type: 'paragraph', text: 'PhD SOP 或 research statement 需 outline research questions、methodology familiarity、与 target faculty fit，及 preliminary plan。' },
      { type: 'template', title: 'Research plan 片段', lines: ['Broad area: ___', 'Specific questions: (1) ___ (2) ___', 'Methods I plan to use: ___', 'Faculty alignment: Prof. ___ works on ___; my question extends ___', 'Timeline: coursework years 1–2, proposal year 3...'] },
      { type: 'list', title: '注意', items: ['Question 要 feasible 非 overly grand', 'Show you know field debates', 'Mention alternative methods considered'] },
      { type: 'note', title: '提示', text: '部分 STEM 项目要 separate research proposal—SOP 可 shorter overview。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'PhD statements outline research questions, methodological readiness, faculty fit, and a preliminary plan.' },
      { type: 'template', title: 'Plan Excerpt', lines: ['Broad area: ___', 'Questions: (1) ___ (2) ___', 'Methods: ___', 'Faculty: Prof. ___ on ___; my question extends ___', 'Timeline: coursework years 1–2, proposal year 3...'] },
      { type: 'list', title: 'Notes', items: ['Questions should be feasible', 'Show awareness of field debates', 'Mention methods considered'] },
      { type: 'note', title: 'Tip', text: 'Some STEM apps need a separate proposal—SOP may be a shorter overview.' }
    ]}
  },

  'sop-peer': {
    zh: { sections: [
      { type: 'paragraph', text: '提交前 peer review 用 checklist 互评，比泛泛 “写得不错” 更有效。' },
      { type: 'list', title: '互评要点', items: ['Main thesis 一句话能否概括？', '每段是否 support thesis？', 'Fit 段是否 specific 到该校？', '有无 grammar / typo / 重复词？', 'Tone 是否 confident 非 arrogant？'] },
      { type: 'template', title: 'Feedback 格式', lines: ['Thesis clarity: 1–5', 'Evidence strength: 1–5', 'Program fit: 1–5', 'Top 2 fixes: ___', 'One line you found memorable: ___'] },
      { type: 'note', title: '提示', text: '互评者最好熟悉目标 field；非专业朋友可查 readability。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Pre-submission peer review with a checklist beats vague praise.' },
      { type: 'list', title: 'Review Points', items: ['Can thesis be stated in one sentence?', 'Does each paragraph support it?', 'Is fit school-specific?', 'Grammar, typos, repetition?', 'Confident but not arrogant tone?'] },
      { type: 'template', title: 'Feedback Form', lines: ['Thesis clarity: 1–5', 'Evidence strength: 1–5', 'Program fit: 1–5', 'Top 2 fixes: ___', 'Memorable line: ___'] },
      { type: 'note', title: 'Tip', text: 'Reviewers who know the field help most; others can check readability.' }
    ]}
  }
}
