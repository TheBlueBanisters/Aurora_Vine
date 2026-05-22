/** GRE 高频词汇表（核心篇）— 章节式正文 */
export const greVocabContent = {
  zh: {
    sections: [
      {
        type: 'chapter',
        title: '复习方法与每日节奏',
        blocks: [
          { type: 'heading', text: 'GRE 词汇在考什么' },
          { type: 'paragraph', text: 'GRE 语文部分并不是单纯考查“你认不认识这个词”，而是考查你能否在复杂句式里识别词义方向、态度与逻辑关系。许多填空题即使四个选项的中文释义都已背过，仍可能选错——因为命题人考察的是语境中的精确含义、搭配习惯，以及分句之间的因果、转折与对比。词汇复习的核心目标应从“记住中文”转向“能在句子里用对”，并在错题中反复验证这一能力。' },
          { type: 'heading', text: '词汇的四类分层' },
          { type: 'paragraph', text: '建议把词表拆成四类循环复习：第一类是态度词（positive / negative / neutral），例如 laudatory、scathing、ambivalent；第二类是逻辑连接词（concede、nevertheless、albeit），它们决定句子走向；第三类是学术高频动词与抽象名词（exacerbate、mitigate、paradigm）；第四类是学科背景词（biology、history 常见术语）。四类词的复习比例建议为 3:3:2:2，备考时间少于 40 天时，优先前三类。' },
          { type: 'heading', text: '每日节奏：60–80 词' },
          { type: 'paragraph', text: '每天固定 60–80 个新词，流程建议为：先看英文释义 → 读 1 条例句 → 尝试自己造一个学术语境短句 → 最后才看中文提示。新词学习占 40 分钟，复习旧词占 20 分钟，再用 20 分钟做 5–8 道 Text Completion 或 Sentence Equivalence 真题，把当天词汇放进真实题干里验证。' },
          { type: 'heading', text: '记忆与复习周期' },
          { type: 'paragraph', text: '词根词缀适合批量识别，例如 bene-（好）、mal-（坏）、-logy（学科）。但 GRE 常考“熟词僻义”，词根只能作辅助。建议为易混词建立对比卡片，如 credible / credulous、disinterested / uninterested、eminent / imminent。新词在第 1、3、7、21 天各复习一次；若第 7 天仍想不起词义，该词进入“高危词本”每天额外看 5 分钟。' }
        ]
      },
      {
        type: 'chapter',
        title: '题型实战与核心词表',
        blocks: [
          { type: 'heading', text: 'Text Completion 与 Sentence Equivalence' },
          { type: 'paragraph', text: '做填空题时，先找信号词：but、however 提示转折；because、therefore 提示因果。确定分句逻辑后，再判断空格需要 positive 还是 negative 语义。六选二题型要求两个正确选项不仅意思相近，还要在句中生成完整且合理的句意——做完题后把正确 pair 写在错题本上，并标注“为什么另外两个近义词不行”。' },
          { type: 'heading', text: '阅读中的词汇' },
          { type: 'paragraph', text: '阅读长难句里的生词，不要立刻查中文然后继续往下读。应根据并列结构、定语从句、同位语解释、前缀后缀，先猜词义方向，再验证。GRE 阅读常考“作者态度”和“段落功能”，即使个别名词不认识，只要抓住动词和形容词的情感色彩，仍能定位主旨。建议每周精读 2 篇文章，专门标注态度词与转折词。' },
          { type: 'heading', text: '态度词与逻辑词' },
          { type: 'list', items: [
            '正向：laudatory / commendatory（赞扬）、judicious（审慎）、pragmatic（务实）',
            '负向：scathing / excoriating（抨击）、meretricious（华而不实）、spurious（虚假）',
            '逻辑：concede（让步）、undermine（削弱）、bolster / buttress（加强）、corroborate（证实）'
          ]},
          { type: 'template', lines: [
            'concede = admit reluctantly    |    undermine = weaken an argument',
            'bolster = support with evidence    |    ambivalent = mixed feelings',
            'scrutinize = examine carefully    |    mitigate / exacerbate = lessen / worsen'
          ]}
        ]
      },
      {
        type: 'chapter',
        title: '冲刺计划与常见误区',
        blocks: [
          { type: 'heading', text: '30 天冲刺与模考节奏' },
          { type: 'paragraph', text: '若距离考试不足 30 天：第 1 周集中态度词+逻辑词（约 800 词），第 2 周做 TC/SE 真题并按错题回查词表，第 3 周精读阅读文章，第 4 周每天 1 套 verbal section 限时+复盘。建议每 7–10 天做 1 次 Verbal section 限时，模考后只复盘三类错题：不认识词、认识但方向错、句子结构没读懂。' },
          { type: 'heading', text: '常见误区' },
          { type: 'paragraph', text: '误区一：只背中文释义，不看英文定义。误区二：忽视词性，把形容词当动词用。误区三：同义词组不辨细微差别，如 suppress / repress / oppress。误区四：不做限时练习。误区五：把词汇和阅读完全分开练——两者应交叉验证。' },
          { type: 'list', items: [
            '今天 60–80 词是否都看了英文释义和例句？',
            '是否完成至少 5 道 TC/SE 并复盘？',
            '错题是否按“方向错误/词义不准/没看懂逻辑”分类？',
            '是否复习了 3 天前、7 天前的词？'
          ]},
          { type: 'paragraph', text: '建议在 Aurora Vine 定校规划里填好 GRE 目标分后，把词汇计划按考试日期倒推：总词量 ÷ 剩余天数 = 每日新词上限。社区讨论区可记录每日打卡，避免“只背不复盘”的自我感动式学习。' },
          { type: 'note', text: '如果备考时间少于 30 天，优先背态度词和逻辑词，它们对填空和阅读的收益最高。配合资源中心其他 GRE 篇章，把数学与写作节奏分开安排。' }
        ]
      }
    ]
  },
  en: {
    sections: [
      {
        type: 'chapter',
        title: 'Method and Daily Rhythm',
        blocks: [
          { type: 'heading', text: 'What GRE Vocabulary Tests' },
          { type: 'paragraph', text: 'GRE Verbal tests whether you can identify meaning, tone, and logical relations inside complex sentences—not merely whether you recognize a word. Your goal should shift from memorizing translations to using words correctly in context.' },
          { type: 'heading', text: 'Four Layers of Word Lists' },
          { type: 'paragraph', text: 'Split your list into attitude words, logical connectors, academic verbs/abstract nouns, and subject-background terms. A practical ratio is 3:3:2:2. If you have fewer than 40 days, prioritize the first three groups.' },
          { type: 'heading', text: 'Daily Rhythm: 60–80 Words' },
          { type: 'paragraph', text: 'Study 60–80 new words per day: English definition first, one example sentence, one self-made mini-sentence, then L1 translation. Allocate 40 minutes to new words, 20 to review, and 20 to 5–8 real completion questions.' },
          { type: 'heading', text: 'Memory and Spaced Review' },
          { type: 'paragraph', text: 'Review new words on days 1, 3, 7, and 21. Build contrast cards for pairs like credible/credulous. Words still missed on day 7 go to a high-risk list with five extra minutes daily.' }
        ]
      },
      {
        type: 'chapter',
        title: 'Question Types and Core Word Groups',
        blocks: [
          { type: 'heading', text: 'Text Completion and Sentence Equivalence' },
          { type: 'paragraph', text: 'Start with signal words for contrast and causation. Decide positive vs. negative meaning before comparing synonyms. For sentence equivalence, the two answers must produce equivalent, coherent sentences—not just share a rough gloss.' },
          { type: 'heading', text: 'Reading Vocabulary' },
          { type: 'paragraph', text: 'Infer direction from parallelism, appositives, and affixes before looking up translations. Annotate two passages weekly for tone and pivot words.' },
          { type: 'list', items: [
            'Positive: laudatory, judicious, pragmatic',
            'Negative: scathing, meretricious, spurious',
            'Logic: concede, undermine, bolster, corroborate'
          ]},
          { type: 'template', lines: [
            'concede = admit reluctantly    |    undermine = weaken an argument',
            'bolster = support with evidence    |    scrutinize = examine carefully'
          ]}
        ]
      },
      {
        type: 'chapter',
        title: 'Sprint Plan and Pitfalls',
        blocks: [
          { type: 'heading', text: '30-Day Sprint' },
          { type: 'paragraph', text: 'Week 1: attitude + logic words. Week 2: TC/SE drills with error review. Week 3: reading passages. Week 4: timed verbal sections. Run one timed section every 7–10 days and track error types, not single scores.' },
          { type: 'note', text: 'If you have less than 30 days, prioritize attitude and logic words. Pair this guide with GRE Quant and writing schedules in the Resource Center.' }
        ]
      }
    ]
  }
}
