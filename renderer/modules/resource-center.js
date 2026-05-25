import { t, getLang } from './i18n.js'
import { escapeHtml } from './utils.js'
import { EXTRA_PLACEHOLDER_ITEMS } from './resource-placeholder-extra.js'
import { RESOURCE_CONTENT } from './resource-content.js'
import { renderResourceSections } from './resource-content-renderer.js'
import { decorateFireflyHosts } from './firefly-effect.js'
import { runContentFadeTransition, runPanelSlideClose, cancelPanelSlideClose } from './ui-transition.js'

const ITEMS_PER_PAGE = 7

const CATEGORIES = [
  { id: 'gre', labelKey: 'resource.cat.gre', icon: 'book-open' },
  { id: 'ielts', labelKey: 'resource.cat.ielts', icon: 'headphones' },
  { id: 'toefl', labelKey: 'resource.cat.toefl', icon: 'mic' },
  { id: 'duolingo', labelKey: 'resource.cat.duolingo', icon: 'globe' },
  { id: 'letters', labelKey: 'resource.cat.letters', icon: 'mail' },
  { id: 'resume', labelKey: 'resource.cat.resume', icon: 'file-text' },
  { id: 'sop', labelKey: 'resource.cat.sop', icon: 'edit' },
  { id: 'ppt', labelKey: 'resource.cat.ppt', icon: 'monitor' },
  { id: 'guide', labelKey: 'resource.cat.guide', icon: 'compass' }
]

const GENERATED_CONTENT_BLUEPRINTS = {
  gre: {
    zh: {
      intro: '这份 GRE 资源围绕当前主题整理了可直接执行的复习方法、检查清单和练习模板，适合放进每日备考计划中滚动使用。',
      listTitle: '使用步骤',
      items: ['先用 10 分钟浏览主题和例题，确认自己薄弱点。', '把相关题型拆成词汇、逻辑、计算或写作结构逐项练习。', '每次练习后记录错因，并在 48 小时内完成二次复盘。'],
      templateTitle: '复盘模板',
      lines: ['Topic / Question Type:', 'Mistake Reason:', 'Correct Strategy:', 'Next Review Date:'],
      note: 'GRE 复习最怕只刷数量，建议每周固定整理一次错题和高频表达。'
    },
    en: {
      intro: 'This GRE resource turns the topic into practical review steps, checklists, and templates that can be used in a daily prep routine.',
      listTitle: 'How to Use',
      items: ['Spend 10 minutes scanning the topic and sample tasks to identify weak points.', 'Break practice into vocabulary, logic, quant, or writing structure depending on the task.', 'Record the error type after each practice session and review again within 48 hours.'],
      templateTitle: 'Review Template',
      lines: ['Topic / Question Type:', 'Mistake Reason:', 'Correct Strategy:', 'Next Review Date:'],
      note: 'For GRE prep, volume alone is not enough. Review errors and high-frequency expressions weekly.'
    }
  },
  ielts: {
    zh: {
      intro: '这份雅思资源把当前主题拆成可练习的输入、输出和复盘任务，适合用于听说读写单项突破。',
      listTitle: '练习路径',
      items: ['先阅读技巧说明，标出自己最容易失分的步骤。', '用 20-30 分钟完成一组限时练习。', '复盘时同时检查语言准确度、结构完整度和时间控制。'],
      templateTitle: '雅思复盘表',
      lines: ['Skill:', 'Target Band:', 'Main Problem:', 'Useful Expression:', 'Next Drill:'],
      note: '雅思提分需要持续输入和输出结合，建议每次练习都保留一份可复看的记录。'
    },
    en: {
      intro: 'This IELTS resource breaks the topic into input, output, and review tasks that support focused practice across listening, speaking, reading, and writing.',
      listTitle: 'Practice Path',
      items: ['Read the strategy notes first and mark the step where you lose points most often.', 'Complete one timed drill in 20-30 minutes.', 'During review, check language accuracy, structure, and timing together.'],
      templateTitle: 'IELTS Review Sheet',
      lines: ['Skill:', 'Target Band:', 'Main Problem:', 'Useful Expression:', 'Next Drill:'],
      note: 'IELTS improvement requires both input and output. Keep a review record after every practice session.'
    }
  },
  toefl: {
    zh: {
      intro: '这份托福资源强调结构化输入和稳定输出，帮助你把题型要求转化为可重复使用的答题流程。',
      listTitle: '训练步骤',
      items: ['先明确题型任务：复述、整合、表达观点还是提取主旨。', '建立固定笔记或回答框架，再进行限时练习。', '用录音或错题表复盘内容完整度、逻辑连接和语言流畅度。'],
      templateTitle: '托福答题框架',
      lines: ['Main Idea:', 'Key Detail 1:', 'Key Detail 2:', 'Transition:', 'Final Response:'],
      note: '托福训练要重视时间限制，平时练习就应按照正式考试节奏完成。'
    },
    en: {
      intro: 'This TOEFL resource focuses on structured input and stable output, helping you turn task requirements into repeatable response routines.',
      listTitle: 'Training Steps',
      items: ['Identify the task first: summarize, integrate, express an opinion, or extract the main idea.', 'Build a fixed note-taking or response framework before timed practice.', 'Use recordings or error logs to review completeness, logic, and fluency.'],
      templateTitle: 'TOEFL Response Framework',
      lines: ['Main Idea:', 'Key Detail 1:', 'Key Detail 2:', 'Transition:', 'Final Response:'],
      note: 'TOEFL practice should follow exam timing from the beginning, not only during final mocks.'
    }
  },
  duolingo: {
    zh: {
      intro: '这份多邻国资源围绕快速反应、短时输出和设备准备展开，适合用来做考前专项训练。',
      listTitle: '准备步骤',
      items: ['先熟悉题型和时间限制，避免正式考试时被节奏打乱。', '每天轮换练习听写、朗读、短写作和口语表达。', '考前检查摄像头、麦克风、网络和考试环境。'],
      templateTitle: 'DET 练习记录',
      lines: ['Task Type:', 'Time Used:', 'Accuracy / Fluency:', 'Common Error:', 'Tomorrow Focus:'],
      note: 'DET 很看重稳定发挥，短时间高频练习比单次长时间刷题更有效。'
    },
    en: {
      intro: 'This Duolingo resource focuses on fast response, short-form output, and device readiness for targeted pre-exam practice.',
      listTitle: 'Prep Steps',
      items: ['Learn the task types and time limits first so the test pace is not surprising.', 'Rotate dictation, read-aloud, short writing, and speaking tasks daily.', 'Check camera, microphone, network, and testing environment before the exam.'],
      templateTitle: 'DET Practice Log',
      lines: ['Task Type:', 'Time Used:', 'Accuracy / Fluency:', 'Common Error:', 'Tomorrow Focus:'],
      note: 'DET rewards stable performance. Short high-frequency drills are often better than a single long session.'
    }
  },
  letters: {
    zh: {
      intro: '这份申请信资源提供邮件和正式信件的写作结构，适合用于联系招生办、教授、校友或处理申请后续沟通。',
      listTitle: '写作步骤',
      items: ['第一段直接说明身份、目的和背景。', '第二段提供关键事实或请求理由，避免长篇叙述。', '结尾明确希望对方采取的下一步，并表达感谢。'],
      templateTitle: '邮件结构',
      lines: ['Dear [Name / Committee],', 'I am writing to...', 'The reason for my request is...', 'I would appreciate it if...', 'Thank you for your time and consideration.', 'Sincerely,', '[Your Name]'],
      note: '申请沟通邮件应保持礼貌、简洁、信息完整，尽量一封邮件只处理一个主题。'
    },
    en: {
      intro: 'This application letter resource provides structures for emails and formal letters used with admissions offices, professors, alumni, or follow-up communication.',
      listTitle: 'Writing Steps',
      items: ['State your identity, purpose, and background directly in the first paragraph.', 'Provide key facts or reasons in the second paragraph without over-explaining.', 'Close with a clear next step and a polite thank-you.'],
      templateTitle: 'Email Structure',
      lines: ['Dear [Name / Committee],', 'I am writing to...', 'The reason for my request is...', 'I would appreciate it if...', 'Thank you for your time and consideration.', 'Sincerely,', '[Your Name]'],
      note: 'Application emails should be polite, concise, and complete. Keep one main topic per email.'
    }
  },
  resume: {
    zh: {
      intro: '这份简历资源帮助你把经历转化为清晰、可验证、适合申请场景的表达，重点突出贡献和结果。',
      listTitle: '优化步骤',
      items: ['先确定目标项目看重的能力，例如研究、数据、领导力或实践经验。', '每段经历使用动作动词开头，并写清楚工具、方法和结果。', '删除与申请目标无关或无法证明能力的描述。'],
      templateTitle: 'Bullet 写作模板',
      lines: ['Action Verb + Task + Method / Tool + Result', 'Example: Analyzed 5,000+ survey records using Python and summarized findings in a policy memo.'],
      note: '简历不是经历清单，而是申请竞争力摘要。每条 bullet 都应该回答“我贡献了什么”。'
    },
    en: {
      intro: 'This resume resource helps turn experiences into clear, verifiable application-ready statements that emphasize contribution and outcomes.',
      listTitle: 'Optimization Steps',
      items: ['Identify the abilities valued by the target program, such as research, data, leadership, or practice.', 'Start each experience bullet with an action verb and include tools, methods, and results.', 'Remove descriptions that are unrelated to the application goal or hard to verify.'],
      templateTitle: 'Bullet Template',
      lines: ['Action Verb + Task + Method / Tool + Result', 'Example: Analyzed 5,000+ survey records using Python and summarized findings in a policy memo.'],
      note: 'A resume is not a list of activities. Each bullet should answer: what did I contribute?'
    }
  },
  sop: {
    zh: {
      intro: '这份个人陈述资源帮助你围绕申请动机、经历证据、项目匹配和未来目标搭建一条清晰主线。',
      listTitle: '写作步骤',
      items: ['先用一句话确定主线：我为什么适合这个方向。', '选择 2-3 段最能支撑主线的经历，不要堆砌所有故事。', '单独定制 Why School 段，写出课程、导师、资源或职业目标匹配。'],
      templateTitle: '段落框架',
      lines: ['Motivation:', 'Relevant Experience:', 'Program Fit:', 'Future Goal:', 'Contribution:'],
      note: 'PS/SOP 应该解释选择背后的逻辑，而不是把简历改写成散文。'
    },
    en: {
      intro: 'This personal statement resource helps build a clear storyline around motivation, evidence, program fit, and future goals.',
      listTitle: 'Writing Steps',
      items: ['Define the main theme in one sentence: why this field fits you.', 'Choose two or three experiences that best support the theme instead of listing everything.', 'Customize the Why School paragraph with curriculum, faculty, resources, or career fit.'],
      templateTitle: 'Paragraph Framework',
      lines: ['Motivation:', 'Relevant Experience:', 'Program Fit:', 'Future Goal:', 'Contribution:'],
      note: 'A PS/SOP should explain the logic behind your choices, not rewrite your resume as an essay.'
    }
  },
  ppt: {
    zh: {
      intro: '这份 PPT 资源用于快速搭建学术汇报、项目展示或申请面试展示结构，重点是信息层级和视觉清晰度。',
      listTitle: '制作步骤',
      items: ['先确定听众需要记住的 3 个关键信息。', '每页只表达一个结论，标题尽量写成判断句。', '用图表、流程图或关键词替代大段文字。'],
      templateTitle: '单页模板',
      lines: ['Slide Title: one clear conclusion', 'Main Visual: chart / diagram / example', 'Support Points: 2-3 bullets', 'Takeaway: one sentence'],
      note: '展示型 PPT 不应成为讲稿全文。能被快速扫读，才更适合答辩和面试场景。'
    },
    en: {
      intro: 'This slide resource helps build academic, project, or interview presentations with clear information hierarchy and visual structure.',
      listTitle: 'Creation Steps',
      items: ['Decide the three key messages the audience should remember.', 'Use one conclusion per slide, preferably as the slide title.', 'Replace long text with charts, diagrams, or keywords.'],
      templateTitle: 'Single-Slide Template',
      lines: ['Slide Title: one clear conclusion', 'Main Visual: chart / diagram / example', 'Support Points: 2-3 bullets', 'Takeaway: one sentence'],
      note: 'Presentation slides should not be a full script. They work best when they can be scanned quickly.'
    }
  },
  guide: {
    zh: {
      intro: '这份申请指南资源把复杂申请事项拆成清单、时间线和执行步骤，方便你按阶段推进。',
      listTitle: '执行步骤',
      items: ['先确认目标国家、项目类型和关键截止日期。', '把材料准备、考试、文书、推荐信和网申拆成独立任务。', '每周检查一次进度，优先处理有硬截止日期的事项。'],
      templateTitle: '申请任务看板',
      lines: ['Task:', 'Deadline:', 'Owner:', 'Current Status:', 'Next Action:'],
      note: '申请管理的关键是提前量。建议把官方截止日期提前 7 天作为自己的内部截止。'
    },
    en: {
      intro: 'This application guide resource breaks complex application work into checklists, timelines, and actionable steps.',
      listTitle: 'Action Steps',
      items: ['Confirm target countries, program types, and key deadlines first.', 'Separate preparation, tests, essays, recommendations, and online applications into tasks.', 'Review progress weekly and prioritize items with hard deadlines.'],
      templateTitle: 'Application Task Board',
      lines: ['Task:', 'Deadline:', 'Owner:', 'Current Status:', 'Next Action:'],
      note: 'Application management depends on buffer time. Set your internal deadline seven days before the official one.'
    }
  }
}

const CATEGORY_ICON_SVGS = {
  'book-open': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>'
}

function item(id, titleKey, descKey, date) {
  return { id, titleKey, descKey, date }
}

const PLACEHOLDER_ITEMS = {
  gre: [
    item('gre-vocab', 'resource.item.greVocab', 'resource.item.greVocabDesc', '2025-01-08'),
    item('gre-vocab-2', 'resource.item.greVocab2', 'resource.item.greVocab2Desc', '2025-01-15'),
    item('gre-math', 'resource.item.greMath', 'resource.item.greMathDesc', '2025-01-22'),
    item('gre-math-2', 'resource.item.greMath2', 'resource.item.greMath2Desc', '2025-02-03'),
    item('gre-writing', 'resource.item.greWriting', 'resource.item.greWritingDesc', '2025-02-10'),
    item('gre-writing-2', 'resource.item.greWriting2', 'resource.item.greWriting2Desc', '2025-02-18'),
    item('gre-practice', 'resource.item.grePractice', 'resource.item.grePracticeDesc', '2025-02-25')
  ],
  ielts: [
    item('ielts-listening', 'resource.item.ieltsListening', 'resource.item.ieltsListeningDesc', '2025-01-06'),
    item('ielts-listening-2', 'resource.item.ieltsListening2', 'resource.item.ieltsListening2Desc', '2025-01-13'),
    item('ielts-speaking', 'resource.item.ieltsSpeaking', 'resource.item.ieltsSpeakingDesc', '2025-01-20'),
    item('ielts-speaking-2', 'resource.item.ieltsSpeaking2', 'resource.item.ieltsSpeaking2Desc', '2025-01-27'),
    item('ielts-writing', 'resource.item.ieltsWriting', 'resource.item.ieltsWritingDesc', '2025-02-05'),
    item('ielts-reading', 'resource.item.ieltsReading', 'resource.item.ieltsReadingDesc', '2025-02-12'),
    item('ielts-mock', 'resource.item.ieltsMock', 'resource.item.ieltsMockDesc', '2025-02-20')
  ],
  toefl: [
    item('toefl-listening', 'resource.item.toeflListening', 'resource.item.toeflListeningDesc', '2025-01-09'),
    item('toefl-listening-2', 'resource.item.toeflListening2', 'resource.item.toeflListening2Desc', '2025-01-16'),
    item('toefl-speaking', 'resource.item.toeflSpeaking', 'resource.item.toeflSpeakingDesc', '2025-01-23'),
    item('toefl-speaking-2', 'resource.item.toeflSpeaking2', 'resource.item.toeflSpeaking2Desc', '2025-01-30'),
    item('toefl-writing', 'resource.item.toeflWriting', 'resource.item.toeflWritingDesc', '2025-02-07'),
    item('toefl-reading', 'resource.item.toeflReading', 'resource.item.toeflReadingDesc', '2025-02-14'),
    item('toefl-mock', 'resource.item.toeflMock', 'resource.item.toeflMockDesc', '2025-02-21')
  ],
  duolingo: [
    item('duolingo-guide', 'resource.item.duolingoGuide', 'resource.item.duolingoGuideDesc', '2025-01-11'),
    item('duolingo-guide-2', 'resource.item.duolingoGuide2', 'resource.item.duolingoGuide2Desc', '2025-01-18'),
    item('duolingo-practice', 'resource.item.duolingoPractice', 'resource.item.duolingoPracticeDesc', '2025-01-25'),
    item('duolingo-practice-2', 'resource.item.duolingoPractice2', 'resource.item.duolingoPractice2Desc', '2025-02-01'),
    item('duolingo-vocab', 'resource.item.duolingoVocab', 'resource.item.duolingoVocabDesc', '2025-02-08'),
    item('duolingo-speaking', 'resource.item.duolingoSpeaking', 'resource.item.duolingoSpeakingDesc', '2025-02-15'),
    item('duolingo-mock', 'resource.item.duolingoMock', 'resource.item.duolingoMockDesc', '2025-02-22')
  ],
  letters: [
    item('cover-letter', 'resource.item.coverLetter', 'resource.item.coverLetterDesc', '2024-12-20'),
    item('cover-letter-2', 'resource.item.coverLetter2', 'resource.item.coverLetter2Desc', '2024-12-28'),
    item('recommendation-letter', 'resource.item.recommendationLetter', 'resource.item.recommendationLetterDesc', '2025-01-05'),
    item('recommendation-letter-2', 'resource.item.recommendationLetter2', 'resource.item.recommendationLetter2Desc', '2025-01-12'),
    item('motivation-letter', 'resource.item.motivationLetter', 'resource.item.motivationLetterDesc', '2025-01-19'),
    item('inquiry-letter', 'resource.item.inquiryLetter', 'resource.item.inquiryLetterDesc', '2025-01-26'),
    item('follow-up-letter', 'resource.item.followUpLetter', 'resource.item.followUpLetterDesc', '2025-02-02')
  ],
  resume: [
    item('resume-template', 'resource.item.resumeTemplate', 'resource.item.resumeTemplateDesc', '2024-12-18'),
    item('resume-template-2', 'resource.item.resumeTemplate2', 'resource.item.resumeTemplate2Desc', '2024-12-26'),
    item('resume-cv', 'resource.item.resumeCv', 'resource.item.resumeCvDesc', '2025-01-03'),
    item('resume-research', 'resource.item.resumeResearch', 'resource.item.resumeResearchDesc', '2025-01-10'),
    item('resume-intern', 'resource.item.resumeIntern', 'resource.item.resumeInternDesc', '2025-01-17'),
    item('resume-design', 'resource.item.resumeDesign', 'resource.item.resumeDesignDesc', '2025-01-24'),
    item('resume-checklist', 'resource.item.resumeChecklist', 'resource.item.resumeChecklistDesc', '2025-01-31')
  ],
  sop: [
    item('sop-template', 'resource.item.sopTemplate', 'resource.item.sopTemplateDesc', '2024-12-22'),
    item('sop-template-2', 'resource.item.sopTemplate2', 'resource.item.sopTemplate2Desc', '2024-12-30'),
    item('sop-structure', 'resource.item.sopStructure', 'resource.item.sopStructureDesc', '2025-01-07'),
    item('sop-motivation', 'resource.item.sopMotivation', 'resource.item.sopMotivationDesc', '2025-01-14'),
    item('sop-career', 'resource.item.sopCareer', 'resource.item.sopCareerDesc', '2025-01-21'),
    item('sop-diversity', 'resource.item.sopDiversity', 'resource.item.sopDiversityDesc', '2025-01-28'),
    item('sop-sample', 'resource.item.sopSample', 'resource.item.sopSampleDesc', '2025-02-04')
  ],
  ppt: [
    item('ppt-defense', 'resource.item.pptDefense', 'resource.item.pptDefenseDesc', '2025-01-04'),
    item('ppt-defense-2', 'resource.item.pptDefense2', 'resource.item.pptDefense2Desc', '2025-01-11'),
    item('ppt-portfolio', 'resource.item.pptPortfolio', 'resource.item.pptPortfolioDesc', '2025-01-18'),
    item('ppt-portfolio-2', 'resource.item.pptPortfolio2', 'resource.item.pptPortfolio2Desc', '2025-01-25'),
    item('ppt-report', 'resource.item.pptReport', 'resource.item.pptReportDesc', '2025-02-01'),
    item('ppt-seminar', 'resource.item.pptSeminar', 'resource.item.pptSeminarDesc', '2025-02-08'),
    item('ppt-application', 'resource.item.pptApplication', 'resource.item.pptApplicationDesc', '2025-02-15')
  ],
  guide: [
    item('guide-timeline', 'resource.item.guideTimeline', 'resource.item.guideTimelineDesc', '2024-12-15'),
    item('guide-timeline-2', 'resource.item.guideTimeline2', 'resource.item.guideTimeline2Desc', '2024-12-23'),
    item('guide-visa', 'resource.item.guideVisa', 'resource.item.guideVisaDesc', '2024-12-30'),
    item('guide-interview', 'resource.item.guideInterview', 'resource.item.guideInterviewDesc', '2025-01-06'),
    item('guide-funding', 'resource.item.guideFunding', 'resource.item.guideFundingDesc', '2025-01-13'),
    item('guide-dorm', 'resource.item.guideDorm', 'resource.item.guideDormDesc', '2025-01-20'),
    item('guide-packing', 'resource.item.guidePacking', 'resource.item.guidePackingDesc', '2025-01-27')
  ]
}

let activeCategoryId = CATEGORIES[0].id
let activePage = 1
let rcInitialized = false
let activeDetailItem = null

function pickLocalized(value) {
  if (!value || typeof value !== 'object') return ''
  const lang = getLang()
  return value[lang] || value.zh || value.en || ''
}

function getItemTitle(entry) {
  return entry.titleKey ? t(entry.titleKey) : pickLocalized(entry.title)
}

function getItemDesc(entry) {
  return entry.descKey ? t(entry.descKey) : pickLocalized(entry.desc)
}

function getCategoryItems(categoryId) {
  return [
    ...(PLACEHOLDER_ITEMS[categoryId] || []),
    ...(EXTRA_PLACEHOLDER_ITEMS[categoryId] || [])
  ].map((entry) => ({ ...entry, categoryId }))
}

function getResourceContent(item) {
  const content = RESOURCE_CONTENT[item?.id]
  const lang = getLang()
  if (content) return content[lang] || content.zh || content.en || null

  const blueprint = GENERATED_CONTENT_BLUEPRINTS[item?.categoryId] || GENERATED_CONTENT_BLUEPRINTS.guide
  const localizedBlueprint = blueprint[lang] || blueprint.zh || blueprint.en
  const title = getItemTitle(item)
  const desc = getItemDesc(item)
  return {
    sections: [
      { type: 'paragraph', text: `${localizedBlueprint.intro}${desc ? ` ${desc}` : ''}` },
      { type: 'list', title: localizedBlueprint.listTitle, items: localizedBlueprint.items },
      { type: 'template', title: localizedBlueprint.templateTitle, lines: localizedBlueprint.lines },
      { type: 'note', title: title || localizedBlueprint.noteTitle, text: localizedBlueprint.note }
    ]
  }
}

function renderResourceDetailContent(item) {
  const contentEl = document.getElementById('resource-detail-placeholder')
  if (!contentEl) return

  const content = getResourceContent(item)
  const sections = Array.isArray(content?.sections) ? content.sections : []
  if (!sections.length) {
    contentEl.className = 'resource-detail-placeholder'
    contentEl.innerHTML = `<p>${escapeHtml(getItemDesc(item) || t('resource.detailPreparing'))}</p>`
    return
  }

  contentEl.className = 'resource-detail-content'
  contentEl.innerHTML = renderResourceSections(sections)
}

function openResourceDetail(item) {
  const overlay = document.getElementById('resource-detail-page')
  const dateEl = document.getElementById('resource-detail-date')
  const titleEl = document.getElementById('resource-detail-title')
  const descEl = document.getElementById('resource-detail-desc')
  if (!overlay || !titleEl || !descEl) return

  activeDetailItem = item
  if (dateEl) dateEl.textContent = item.date || ''
  titleEl.textContent = getItemTitle(item)
  descEl.textContent = getItemDesc(item)
  renderResourceDetailContent(item)

  cancelPanelSlideClose(overlay)
  overlay.classList.add('active')
  document.body.classList.add('resource-detail-open')
  const body = overlay.querySelector('.resource-detail-body')
  if (body) body.scrollTop = 0
}

function closeResourceDetail() {
  const overlay = document.getElementById('resource-detail-page')
  if (!overlay?.classList.contains('active')) return
  void runPanelSlideClose(overlay, () => {
    document.body.classList.remove('resource-detail-open')
    activeDetailItem = null
  })
}

export { closeResourceDetail }

function renderCategoryBar() {
  const bar = document.getElementById('resource-category-bar')
  if (!bar) return

  bar.innerHTML = CATEGORIES.map((cat) => `
    <button
      type="button"
      class="resource-category-chip${cat.id === activeCategoryId ? ' is-active' : ''}"
      data-category-id="${cat.id}"
      role="tab"
      aria-selected="${cat.id === activeCategoryId ? 'true' : 'false'}"
    >
      <span class="resource-category-chip-icon" aria-hidden="true"><span class="resource-category-chip-icon-inner">${CATEGORY_ICON_SVGS[cat.icon] || ''}</span></span>
      <span class="resource-category-chip-label">${escapeHtml(t(cat.labelKey))}</span>
    </button>
  `).join('')

  decorateFireflyHosts(bar, '.resource-category-chip', 'dark-active-hover')

  bar.querySelectorAll('.resource-category-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategoryId = btn.dataset.categoryId
      activePage = 1
      renderCategoryBar()
      renderResourceItems()
    })
  })
}

function renderResourcePagination(totalPages) {
  const paginationEl = document.getElementById('resource-items-pagination')
  if (!paginationEl) return

  if (totalPages <= 1) {
    paginationEl.hidden = true
    paginationEl.replaceChildren()
    return
  }

  paginationEl.hidden = false
  paginationEl.innerHTML = `
    <button type="button" class="resource-pagination-btn" data-page-action="prev"${activePage <= 1 ? ' disabled' : ''}>${escapeHtml(t('resource.pagePrev'))}</button>
    <span class="resource-pagination-indicator">${escapeHtml(t('resource.pageIndicator', activePage, totalPages))}</span>
    <button type="button" class="resource-pagination-btn" data-page-action="next"${activePage >= totalPages ? ' disabled' : ''}>${escapeHtml(t('resource.pageNext'))}</button>
  `

  paginationEl.querySelector('[data-page-action="prev"]')?.addEventListener('click', () => {
    if (activePage <= 1) return
    activePage -= 1
    renderResourceItems()
  })
  paginationEl.querySelector('[data-page-action="next"]')?.addEventListener('click', () => {
    if (activePage >= totalPages) return
    activePage += 1
    renderResourceItems()
  })
}

async function renderResourceItems() {
  const titleEl = document.getElementById('resource-items-title')
  const listEl = document.getElementById('resource-items-grid')
  const itemsPanel = listEl?.closest('.resource-items-panel')
  if (!titleEl || !listEl) return

  const category = CATEGORIES.find((cat) => cat.id === activeCategoryId) || CATEGORIES[0]
  const allItems = getCategoryItems(category.id)
  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE))
  if (activePage > totalPages) activePage = totalPages
  if (activePage < 1) activePage = 1

  const start = (activePage - 1) * ITEMS_PER_PAGE
  const pageItems = allItems.slice(start, start + ITEMS_PER_PAGE)

  await runContentFadeTransition(itemsPanel, () => {
    titleEl.textContent = t(category.labelKey)
    listEl.innerHTML = pageItems.map((entry) => `
      <button type="button" class="resource-item-row" data-item-id="${entry.id}">
        <span class="resource-item-row-date">${escapeHtml(entry.date || '')}</span>
        <span class="resource-item-row-body">
          <span class="resource-item-row-title">${escapeHtml(getItemTitle(entry))}</span>
          <span class="resource-item-row-desc">${escapeHtml(getItemDesc(entry))}</span>
        </span>
        <span class="resource-item-row-arrow" aria-hidden="true">›</span>
      </button>
    `).join('')

    listEl.querySelectorAll('.resource-item-row').forEach((row, index) => {
      row.addEventListener('click', () => openResourceDetail(pageItems[index]))
    })

    renderResourcePagination(totalPages)
  })
}

export function initResourceCenterPage() {
  renderCategoryBar()
  renderResourceItems()
  const overlay = document.getElementById('resource-detail-page')
  if (overlay?.classList.contains('active') && activeDetailItem) {
    openResourceDetail(activeDetailItem)
  }

  if (rcInitialized) return
  rcInitialized = true

  document.getElementById('resource-detail-back')?.addEventListener('click', closeResourceDetail)
  document.getElementById('resource-detail-backdrop')?.addEventListener('click', closeResourceDetail)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    const overlay = document.getElementById('resource-detail-page')
    if (overlay?.classList.contains('active')) void closeResourceDetail()
  })
}
