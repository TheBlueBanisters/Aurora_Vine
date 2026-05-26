import { greVocabContent } from './resource-content/gre-vocab.js'
import { greVocab2Content } from './resource-content/gre-vocab-2.js'
import { greMathContent } from './resource-content/gre-math.js'
import { GRE_EXTRA_CONTENT } from './resource-content/gre-extra.js'
import { IELTS_EXTRA_CONTENT } from './resource-content/ielts-extra.js'
import { TOEFL_EXTRA_CONTENT } from './resource-content/toefl-extra.js'
import { DUOLINGO_EXTRA_CONTENT } from './resource-content/duolingo-extra.js'
import { LETTERS_EXTRA_CONTENT } from './resource-content/letters-extra.js'
import { RESUME_EXTRA_CONTENT } from './resource-content/resume-extra.js'
import { SOP_EXTRA_CONTENT } from './resource-content/sop-extra.js'
import { PPT_EXTRA_CONTENT } from './resource-content/ppt-extra.js'
import { GUIDE_EXTRA_CONTENT } from './resource-content/guide-extra.js'

export const RESOURCE_CONTENT = {
  'gre-vocab': greVocabContent,
  'gre-vocab-2': greVocab2Content,
  'gre-math': greMathContent,
  ...GRE_EXTRA_CONTENT,
  ...IELTS_EXTRA_CONTENT,
  ...TOEFL_EXTRA_CONTENT,
  ...DUOLINGO_EXTRA_CONTENT,
  ...LETTERS_EXTRA_CONTENT,
  ...RESUME_EXTRA_CONTENT,
  ...SOP_EXTRA_CONTENT,
  ...PPT_EXTRA_CONTENT,
  ...GUIDE_EXTRA_CONTENT,
  'ielts-speaking': {
    zh: {
      sections: [
        { type: 'paragraph', text: '雅思口语 Part 2 的关键是把一个话题准备成多个可迁移素材，而不是为每个题目背一篇完整答案。' },
        { type: 'list', title: '万能素材方向', items: ['一次重要决定：选专业、换城市、参加竞赛。', '一个帮助过你的人：老师、同学、实习导师。', '一段难忘经历：旅行、志愿活动、项目展示。'] },
        { type: 'template', title: '两分钟结构', lines: ['Opening: I would like to talk about...', 'Context: It happened when...', 'Details: What made it special was...', 'Reflection: Looking back, I think it taught me...'] },
        { type: 'note', title: '使用提示', text: '每个素材准备 6-8 个关键词即可，不建议逐字背诵。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'For IELTS Speaking Part 2, the key is to prepare flexible stories that can be adapted to multiple prompts, rather than memorizing one full answer per topic.' },
        { type: 'list', title: 'Reusable Story Angles', items: ['An important decision: choosing a major, moving to a city, joining a competition.', 'Someone who helped you: a teacher, classmate, or internship mentor.', 'A memorable experience: travel, volunteering, or a project presentation.'] },
        { type: 'template', title: 'Two-Minute Structure', lines: ['Opening: I would like to talk about...', 'Context: It happened when...', 'Details: What made it special was...', 'Reflection: Looking back, I think it taught me...'] },
        { type: 'note', title: 'Tip', text: 'Prepare 6-8 keywords for each story. Avoid memorizing the entire response word for word.' }
      ]
    }
  },
  'ielts-writing': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'Task 2 写作首先要保证立场清楚、段落功能明确。高分答案通常不是复杂词堆砌，而是观点推进自然、例子具体。' },
        { type: 'template', title: '四段式模板', lines: ['Introduction: paraphrase the question + give your position.', 'Body 1: first reason + explanation + example.', 'Body 2: second reason or concession + explanation.', 'Conclusion: restate your position and summarize key reasons.'] },
        { type: 'list', title: '常用检查点', items: ['每个主体段是否只有一个中心观点？', '例子是否能直接支持观点？', '结尾是否只是总结，而不是引入新观点？'] },
        { type: 'note', title: '使用提示', text: '练习时先限时写提纲 5 分钟，再写正文，能显著降低跑题风险。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'For IELTS Writing Task 2, clarity of position and paragraph function matters more than using many advanced words. Strong essays develop ideas naturally with concrete examples.' },
        { type: 'template', title: 'Four-Paragraph Template', lines: ['Introduction: paraphrase the question + give your position.', 'Body 1: first reason + explanation + example.', 'Body 2: second reason or concession + explanation.', 'Conclusion: restate your position and summarize key reasons.'] },
        { type: 'list', title: 'Checklist', items: ['Does each body paragraph have one main idea?', 'Does the example directly support the claim?', 'Does the conclusion summarize rather than introduce a new argument?'] },
        { type: 'note', title: 'Tip', text: 'Spend five minutes outlining before writing. It greatly reduces the risk of going off topic.' }
      ]
    }
  },
  'toefl-listening': {
    zh: {
      sections: [
        { type: 'paragraph', text: '托福听力笔记不是速记全部内容，而是抓讲座结构、转折、例子和教授态度。笔记越像大纲，回忆越稳定。' },
        { type: 'list', title: '笔记符号建议', items: ['Def = definition，记录概念定义。', 'Ex = example，记录例子和用途。', 'But / however = 转折，通常对应考点。', '? = 学生疑问或教授强调的问题。'] },
        { type: 'template', title: 'Lecture 笔记框架', lines: ['Topic:', 'Main idea 1 -> detail / example', 'Main idea 2 -> contrast / problem', 'Professor attitude:', 'Conclusion / implication:'] },
        { type: 'note', title: '使用提示', text: '复盘时不要只看错题，最好把听力原文按结构重新标注一遍。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'TOEFL listening notes are not transcripts. Capture structure, transitions, examples, and speaker attitude. Notes that look like outlines are easier to use.' },
        { type: 'list', title: 'Useful Symbols', items: ['Def = definition or concept.', 'Ex = example and function.', 'But / however = contrast, often tested.', '? = student question or highlighted issue.'] },
        { type: 'template', title: 'Lecture Note Framework', lines: ['Topic:', 'Main idea 1 -> detail / example', 'Main idea 2 -> contrast / problem', 'Professor attitude:', 'Conclusion / implication:'] },
        { type: 'note', title: 'Tip', text: 'During review, annotate the transcript by structure instead of only checking wrong answers.' }
      ]
    }
  },
  'toefl-speaking': {
    zh: {
      sections: [
        { type: 'paragraph', text: '托福口语的目标是稳定输出，而不是追求复杂表达。建议每类题准备固定结构，确保 15 秒内能组织答案。' },
        { type: 'template', title: '独立题回答框架', lines: ['I prefer / agree with...', 'The first reason is...', 'For example, when I...', 'Another reason is...', 'That is why I think...'] },
        { type: 'list', title: '提分重点', items: ['开头直接表态，不绕圈。', '例子优先用个人经历，细节更容易展开。', '每次练习录音，检查停顿和重复词。'] },
        { type: 'note', title: '使用提示', text: '如果表达卡住，优先保证完整性，不要临时换观点。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The goal of TOEFL Speaking is stable delivery, not complex language. Prepare fixed structures so you can organize an answer within 15 seconds.' },
        { type: 'template', title: 'Independent Task Framework', lines: ['I prefer / agree with...', 'The first reason is...', 'For example, when I...', 'Another reason is...', 'That is why I think...'] },
        { type: 'list', title: 'Scoring Focus', items: ['State your position directly.', 'Use personal examples because they are easier to expand.', 'Record each practice response and check pauses and repeated words.'] },
        { type: 'note', title: 'Tip', text: 'If you get stuck, keep the answer complete instead of changing your position midway.' }
      ]
    }
  },
  'duolingo-guide': {
    zh: {
      sections: [
        { type: 'paragraph', text: '多邻国考试节奏快、题型切换频繁，备考重点是熟悉流程和保持稳定输出，而不是只刷单项题。' },
        { type: 'list', title: '备考步骤', items: ['先完成一次官方样题，熟悉题型顺序。', '每天练习听写、朗读和短写作，保证基础反应速度。', '考前模拟完整流程，检查设备、网络和环境。'] },
        { type: 'list', title: '常见失分点', items: ['口语答案过短，没有展开原因。', '写作句子过于简单，缺少连接词。', '听写时忽略单复数和时态。'] },
        { type: 'note', title: '使用提示', text: '考试环境要求严格，正式考试前务必清理桌面并测试摄像头。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The Duolingo English Test is fast-paced and switches task types frequently. Preparation should focus on flow familiarity and stable output, not only isolated drills.' },
        { type: 'list', title: 'Prep Steps', items: ['Complete one official sample test to learn the task order.', 'Practice dictation, read-aloud, and short writing every day.', 'Run a full mock before the exam and check device, network, and environment.'] },
        { type: 'list', title: 'Common Score Losses', items: ['Speaking answers are too short and lack reasons.', 'Writing uses overly simple sentences with few connectors.', 'Dictation misses plurals and tense markers.'] },
        { type: 'note', title: 'Tip', text: 'The testing environment is strict. Clear your desk and test your camera before the official exam.' }
      ]
    }
  },
  'cover-letter': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'Cover Letter 适合用于邮件申请、补充材料说明或联系项目方。它应该简洁说明你是谁、为什么联系、希望对方做什么。' },
        { type: 'template', title: '标准邮件模板', lines: ['Dear Admissions Committee,', 'I am writing to submit my application for the [Program Name] at [University].', 'My academic background in [Major] and experience in [Project/Internship] have prepared me for this program.', 'Attached please find my CV and supporting materials for your review.', 'Thank you for your time and consideration.', 'Sincerely,', '[Your Name]'] },
        { type: 'list', title: '写作要点', items: ['一页以内，避免重复简历。', '第一段直接说明目的。', '最后一句明确附件或下一步。'] },
        { type: 'note', title: '使用提示', text: '如果是联系教授，应把重点从“申请项目”改为“研究兴趣匹配”。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'A cover letter is useful for email applications, additional material explanations, or contacting a program. It should briefly explain who you are, why you are writing, and what you hope the reader will do.' },
        { type: 'template', title: 'Standard Email Template', lines: ['Dear Admissions Committee,', 'I am writing to submit my application for the [Program Name] at [University].', 'My academic background in [Major] and experience in [Project/Internship] have prepared me for this program.', 'Attached please find my CV and supporting materials for your review.', 'Thank you for your time and consideration.', 'Sincerely,', '[Your Name]'] },
        { type: 'list', title: 'Writing Notes', items: ['Keep it within one page and avoid repeating your CV.', 'State your purpose directly in the first paragraph.', 'End with attachments or the next step.'] },
        { type: 'note', title: 'Tip', text: 'When contacting a professor, shift the focus from application submission to research fit.' }
      ]
    }
  },
  'recommendation-letter': {
    zh: {
      sections: [
        { type: 'paragraph', text: '给推荐人的素材包越清楚，推荐信越容易写得具体。建议提前准备课程表现、项目贡献、能力关键词和申请方向。' },
        { type: 'list', title: '推荐人素材包', items: ['申请项目和截止日期。', '你的简历和成绩单。', '希望强调的 2-3 个能力点。', '课堂、科研或项目中的具体例子。'] },
        { type: 'template', title: '推荐信结构参考', lines: ['Relationship: how the recommender knows the applicant.', 'Academic / professional performance.', 'Specific example showing ability or character.', 'Comparison with peers if appropriate.', 'Clear recommendation for the target program.'] },
        { type: 'note', title: '使用提示', text: '不要只请求“帮我写推荐信”，最好给推荐人一页以内的素材摘要。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The clearer your recommender package is, the more specific the letter can be. Prepare course performance, project contributions, ability keywords, and application goals.' },
        { type: 'list', title: 'Recommender Package', items: ['Target programs and deadlines.', 'Your CV and transcript.', 'Two or three abilities you hope to highlight.', 'Specific examples from class, research, or projects.'] },
        { type: 'template', title: 'Letter Structure', lines: ['Relationship: how the recommender knows the applicant.', 'Academic / professional performance.', 'Specific example showing ability or character.', 'Comparison with peers if appropriate.', 'Clear recommendation for the target program.'] },
        { type: 'note', title: 'Tip', text: 'Do not only ask for a recommendation letter. Provide a concise one-page summary for the recommender.' }
      ]
    }
  },
  'resume-template': {
    zh: {
      sections: [
        { type: 'paragraph', text: '留学申请英文简历应突出学术背景、项目经历和可验证成果。排版上建议一到两页，内容密度高但层级清楚。' },
        { type: 'list', title: '核心模块', items: ['Education：学校、专业、GPA、核心课程。', 'Research / Projects：问题、方法、结果、你的贡献。', 'Internship / Experience：职责、工具、量化结果。', 'Skills：语言、软件、编程、实验技能。'] },
        { type: 'template', title: '项目经历写法', lines: ['Project Name | Role | Date', '- Built / analyzed / designed ... using ...', '- Improved / reduced / achieved ... by ...', '- Presented findings in ... / delivered ...'] },
        { type: 'note', title: '使用提示', text: '每条经历尽量用动词开头，并写出结果，而不是只写“参与了某项目”。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'An application CV should highlight academic background, projects, and verifiable outcomes. Keep the layout clear and dense, usually one to two pages.' },
        { type: 'list', title: 'Core Sections', items: ['Education: university, major, GPA, relevant coursework.', 'Research / Projects: problem, method, result, and your contribution.', 'Internship / Experience: responsibilities, tools, quantified outcomes.', 'Skills: languages, software, programming, lab skills.'] },
        { type: 'template', title: 'Project Bullet Template', lines: ['Project Name | Role | Date', '- Built / analyzed / designed ... using ...', '- Improved / reduced / achieved ... by ...', '- Presented findings in ... / delivered ...'] },
        { type: 'note', title: 'Tip', text: 'Start each bullet with an action verb and show the result, rather than only saying you participated in a project.' }
      ]
    }
  },
  'resume-cv': {
    zh: {
      sections: [
        { type: 'paragraph', text: '学术 CV 比普通简历更重视研究经历、论文、会议、助研和学术技能，适合研究型硕士、博士和 RA 申请。' },
        { type: 'list', title: '建议模块顺序', items: ['Education', 'Research Interests', 'Research Experience', 'Publications / Working Papers', 'Conference / Presentation', 'Teaching or Assistant Experience', 'Skills'] },
        { type: 'template', title: '研究经历描述', lines: ['Research Assistant, [Lab Name]', '- Investigated [topic] under the supervision of [Professor].', '- Collected and cleaned [data/materials] using [method/tool].', '- Contributed to [paper/report/presentation].'] },
        { type: 'note', title: '使用提示', text: '如果论文尚未发表，可以写 Working Paper 或 Manuscript in Preparation，但不要夸大状态。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'An academic CV emphasizes research, publications, conferences, assistantships, and academic skills. It is suitable for research master, PhD, and RA applications.' },
        { type: 'list', title: 'Suggested Order', items: ['Education', 'Research Interests', 'Research Experience', 'Publications / Working Papers', 'Conference / Presentation', 'Teaching or Assistant Experience', 'Skills'] },
        { type: 'template', title: 'Research Experience Bullet', lines: ['Research Assistant, [Lab Name]', '- Investigated [topic] under the supervision of [Professor].', '- Collected and cleaned [data/materials] using [method/tool].', '- Contributed to [paper/report/presentation].'] },
        { type: 'note', title: 'Tip', text: 'If a paper is not published yet, use Working Paper or Manuscript in Preparation, but do not exaggerate its status.' }
      ]
    }
  },
  'sop-template': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'SOP 的核心不是重复简历，而是解释你的学术兴趣如何形成、为什么适合目标项目、未来想解决什么问题。' },
        { type: 'template', title: 'SOP 五段结构', lines: ['1. Opening: academic motivation or defining experience.', '2. Preparation: coursework, research, or project foundation.', '3. Fit: why this program, curriculum, faculty, or resources.', '4. Goals: short-term and long-term academic/career direction.', '5. Closing: what you will contribute to the community.'] },
        { type: 'list', title: '避免的问题', items: ['不要把学校官网介绍整段改写。', '不要堆砌空泛品质，例如 hardworking。', '不要只讲经历，要讲经历如何影响选择。'] },
        { type: 'note', title: '使用提示', text: '每个目标项目至少改写 fit 段，体现课程、方向或导师匹配。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'A strong SOP does not repeat the CV. It explains how your academic interests developed, why the target program fits, and what problems you hope to work on.' },
        { type: 'template', title: 'Five-Part SOP Structure', lines: ['1. Opening: academic motivation or defining experience.', '2. Preparation: coursework, research, or project foundation.', '3. Fit: why this program, curriculum, faculty, or resources.', '4. Goals: short-term and long-term academic/career direction.', '5. Closing: what you will contribute to the community.'] },
        { type: 'list', title: 'Avoid', items: ['Do not rewrite the university website in long chunks.', 'Do not rely on generic traits such as hardworking.', 'Do not only list experiences; explain how they shaped your choices.'] },
        { type: 'note', title: 'Tip', text: 'Customize the fit paragraph for each program, mentioning curriculum, research direction, or faculty fit.' }
      ]
    }
  },
  'sop-structure': {
    zh: {
      sections: [
        { type: 'paragraph', text: 'SOP 结构应服务于一条清晰主线：过去的准备、现在的申请理由、未来的目标。每段都应该回答一个明确问题。' },
        { type: 'list', title: '段落问题', items: ['我为什么对这个方向感兴趣？', '我已经做过哪些相关准备？', '目标项目为什么适合我？', '我进入项目后想继续发展什么？'] },
        { type: 'template', title: '衔接句参考', lines: ['This experience led me to explore...', 'To build a stronger foundation, I then...', 'The program is a strong fit because...', 'In the long term, I hope to...'] },
        { type: 'note', title: '使用提示', text: '写完后检查每段第一句，应该能读出完整逻辑线。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'The SOP structure should support one clear storyline: past preparation, current application rationale, and future goals. Each paragraph should answer a specific question.' },
        { type: 'list', title: 'Paragraph Questions', items: ['Why am I interested in this field?', 'What relevant preparation have I completed?', 'Why is the target program a good fit?', 'What do I want to develop after joining the program?'] },
        { type: 'template', title: 'Transition Sentences', lines: ['This experience led me to explore...', 'To build a stronger foundation, I then...', 'The program is a strong fit because...', 'In the long term, I hope to...'] },
        { type: 'note', title: 'Tip', text: 'After drafting, read the first sentence of each paragraph. They should form a coherent logic chain.' }
      ]
    }
  },
  'ppt-defense': {
    zh: {
      sections: [
        { type: 'paragraph', text: '答辩或项目展示 PPT 的重点是让听众快速理解问题、方法和结果。每页只承担一个功能，不要把论文原文搬到幻灯片上。' },
        { type: 'list', title: '推荐页序', items: ['Title：题目、姓名、项目/课程。', 'Background：问题背景和研究价值。', 'Method：数据、流程、工具。', 'Result：关键发现和图表。', 'Conclusion：贡献、不足和下一步。'] },
        { type: 'template', title: '单页结构', lines: ['Slide title = conclusion, not topic.', 'Main visual = chart / diagram / process.', 'Bottom note = one sentence takeaway.'] },
        { type: 'note', title: '使用提示', text: '如果一页需要解释超过 60 秒，通常说明信息过多，应该拆页。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'A defense or project presentation should help the audience quickly understand the problem, method, and result. Each slide should serve one purpose.' },
        { type: 'list', title: 'Suggested Slide Order', items: ['Title: topic, name, course or project.', 'Background: problem and significance.', 'Method: data, process, tools.', 'Result: key findings and visuals.', 'Conclusion: contribution, limitation, next steps.'] },
        { type: 'template', title: 'Single-Slide Structure', lines: ['Slide title = conclusion, not topic.', 'Main visual = chart / diagram / process.', 'Bottom note = one sentence takeaway.'] },
        { type: 'note', title: 'Tip', text: 'If one slide takes more than 60 seconds to explain, it probably contains too much information.' }
      ]
    }
  },
  'ppt-application': {
    zh: {
      sections: [
        { type: 'paragraph', text: '申请展示类 PPT 适合面试、作品集补充或项目介绍，目标是把个人背景和目标项目之间的匹配讲清楚。' },
        { type: 'list', title: '内容结构', items: ['个人简介：教育背景和申请方向。', '核心项目：展示 2-3 个最相关项目。', '能力矩阵：研究、数据、写作、沟通等能力。', '项目匹配：为什么适合该学校或项目。'] },
        { type: 'template', title: '项目页模板', lines: ['Project Goal:', 'My Role:', 'Method / Tool:', 'Outcome:', 'Relevance to Target Program:'] },
        { type: 'note', title: '使用提示', text: '每个项目页都要明确“我做了什么”，不要只展示团队成果。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'An application presentation is useful for interviews, portfolio supplements, or project introductions. Its goal is to explain the fit between your background and the target program.' },
        { type: 'list', title: 'Content Structure', items: ['Profile: education and application direction.', 'Key projects: two or three most relevant projects.', 'Skill matrix: research, data, writing, communication, etc.', 'Program fit: why this school or program fits you.'] },
        { type: 'template', title: 'Project Slide Template', lines: ['Project Goal:', 'My Role:', 'Method / Tool:', 'Outcome:', 'Relevance to Target Program:'] },
        { type: 'note', title: 'Tip', text: 'Each project slide should make your own contribution clear, not only the team outcome.' }
      ]
    }
  },
  'guide-timeline': {
    zh: {
      sections: [
        { type: 'paragraph', text: '申请时间线的作用是把长期任务拆成可执行节点。建议从目标入学时间倒推，先锁定考试、选校、文书和网申截止日期。' },
        { type: 'list', title: '12 个月倒推节奏', items: ['T-12 到 T-10：确定国家、专业方向和考试计划。', 'T-9 到 T-7：完成语言考试首考，整理初版简历。', 'T-6 到 T-4：确定选校名单，启动文书和推荐信。', 'T-3 到 T-1：提交网申，跟进材料和面试。'] },
        { type: 'list', title: '每周固定检查', items: ['是否有新截止日期？', '文书是否需要按项目定制？', '推荐信是否已提交？', '成绩单和证明是否齐全？'] },
        { type: 'note', title: '使用提示', text: '把硬截止日期提前 7 天作为自己的内部截止日期。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'An application timeline turns a long process into manageable checkpoints. Work backward from the intended intake and identify test, school list, essay, and application deadlines.' },
        { type: 'list', title: '12-Month Backward Plan', items: ['T-12 to T-10: choose countries, fields, and test plan.', 'T-9 to T-7: take the first language test and draft the CV.', 'T-6 to T-4: finalize school list, essays, and recommendations.', 'T-3 to T-1: submit applications and follow up materials and interviews.'] },
        { type: 'list', title: 'Weekly Check', items: ['Are there new deadlines?', 'Does each essay need program-specific customization?', 'Have recommendation letters been submitted?', 'Are transcripts and certificates ready?'] },
        { type: 'note', title: 'Tip', text: 'Set your internal deadline seven days before the official deadline.' }
      ]
    }
  },
  'guide-visa': {
    zh: {
      sections: [
        { type: 'paragraph', text: '签证准备要以目标国家官方要求为准。资源中心只提供通用清单，正式提交前应核对使馆或学校最新说明。' },
        { type: 'list', title: '通用材料清单', items: ['有效护照和录取通知。', '资金证明或奖学金证明。', '签证申请表和照片。', '语言成绩、学历证明或学校要求文件。', '住宿、保险或体检材料。'] },
        { type: 'list', title: '准备建议', items: ['提前扫描所有材料并统一命名。', '资金证明注意冻结期和币种要求。', '面签国家需要准备学习计划和回国/职业规划说明。'] },
        { type: 'note', title: '使用提示', text: '不同国家政策差异很大，本清单不能替代官方签证指南。' }
      ]
    },
    en: {
      sections: [
        { type: 'paragraph', text: 'Visa preparation must follow the official requirements of the target country. This resource provides a general checklist only; always check the latest embassy or university instructions before submission.' },
        { type: 'list', title: 'General Document Checklist', items: ['Valid passport and admission letter.', 'Financial proof or scholarship proof.', 'Visa application form and photo.', 'Language score, academic proof, or university-required documents.', 'Accommodation, insurance, or medical examination documents.'] },
        { type: 'list', title: 'Preparation Tips', items: ['Scan all documents and use consistent file names.', 'Check deposit period and currency requirements for financial proof.', 'For interviews, prepare study plan and career explanation.'] },
        { type: 'note', title: 'Tip', text: 'Visa policies vary widely by country. This checklist does not replace official visa guidance.' }
      ]
    }
  }
}
