/** 申请信 / 邮件资源条目正文集合（除 cover-letter / recommendation-letter 主入口外的其它条目） */

export const LETTERS_EXTRA_CONTENT = {
  'cover-letter-2': {
    zh: { sections: [
      { type: 'paragraph', text: '精简版 Cover Letter 适合邮件正文或一页 PDF 附信，控制在 150–200 词。核心是：谁、申请什么、为何匹配、附件说明。' },
      { type: 'template', title: '精简模板', lines: ['Dear [Admissions Team],', 'I am applying to [Program] at [University] for [Term].', 'My background in [field] and experience in [project] align with [specific aspect of program].', 'Please find my CV and statement attached.', 'Thank you for your consideration.', 'Best regards,', '[Name]'] },
      { type: 'list', title: '删减原则', items: ['删除与简历重复的 bullet 罗列。', '只保留 1 个最强匹配点。', '避免第二页或长段落。'] },
      { type: 'note', title: '提示', text: '邮件主题写清楚：Application – [Name] – [Program] – [ID if any].' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'A concise cover letter fits email body or a one-page PDF—150–200 words. Cover who you are, what you apply for, why you fit, and attachments.' },
      { type: 'template', title: 'Short Template', lines: ['Dear [Admissions Team],', 'I am applying to [Program] at [University] for [Term].', 'My background in [field] and [project] align with [specific program aspect].', 'Please find my CV and statement attached.', 'Thank you for your consideration.', 'Best regards,', '[Name]'] },
      { type: 'list', title: 'Trim Rules', items: ['Cut bullets that repeat the CV.', 'Keep one strongest fit point.', 'Avoid page two or long blocks.'] },
      { type: 'note', title: 'Tip', text: 'Subject line: Application – [Name] – [Program] – [ID if any].' }
    ]}
  },

  'recommendation-letter-2': {
    zh: { sections: [
      { type: 'paragraph', text: '实习主管推荐信侧重职业素养、执行力与团队贡献，而非学术潜力。应提供具体项目场景与可量化成果供推荐人引用。' },
      { type: 'list', title: '素材包内容', items: ['实习公司、岗位、时长、主要职责。', '2–3 个 STAR 案例：情境、任务、行动、结果。', '与申请项目的关联（技能 transferable）。', '截止日期与提交方式。'] },
      { type: 'template', title: '主管信结构参考', lines: ['Relationship and role of applicant', 'Professional performance and reliability', 'Specific project example with outcome', 'Comparison with peers if appropriate', 'Recommendation for target program'] },
      { type: 'note', title: '提示', text: '若主管英文有限，可提供 bullet 要点供其改写，但勿代写全文冒充推荐人签名。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Supervisor letters emphasize professionalism, execution, and team impact—not academic potential. Supply concrete project scenes and quantified outcomes.' },
      { type: 'list', title: 'Package Contents', items: ['Company, role, duration, key duties.', '2–3 STAR cases: situation, task, action, result.', 'Link skills to the target program.', 'Deadline and submission method.'] },
      { type: 'template', title: 'Supervisor Letter Frame', lines: ['Relationship and applicant role', 'Professional performance and reliability', 'Specific project with outcome', 'Peer comparison if appropriate', 'Recommendation for target program'] },
      { type: 'note', title: 'Tip', text: 'If English is limited, offer bullet talking points—but never submit a full ghostwritten letter as the recommender\'s own.' }
    ]}
  },

  'motivation-letter': {
    zh: { sections: [
      { type: 'paragraph', text: 'Motivation Letter 常见于欧陆硕士申请，比美式 SOP 更短（通常 1–2 页），强调动机、学术准备与项目匹配，语气正式但个人化。' },
      { type: 'template', title: '四段结构', lines: ['1. 开场：为何对该国/领域/项目感兴趣', '2. 学术与经历：相关课程、项目、实习', '3. 项目匹配：课程、研究方向、职业资源', '4. Closing：目标与贡献'] },
      { type: 'list', title: '欧陆申请注意', items: ['部分国家要求 Motivation + CV 合并上传。', '注意字数上限（常见 500–1000 词）。', '避免过度美式 marketing 语气。'] },
      { type: 'note', title: '提示', text: '查阅项目官网是否提供 prompt 或问题清单，逐条回答比通用模板更有效。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Motivation letters are common in European master applications—shorter than US SOPs (1–2 pages), formal yet personal, focused on drive, preparation, and fit.' },
      { type: 'template', title: 'Four Paragraphs', lines: ['1. Opening: interest in country/field/program', '2. Preparation: relevant courses, projects, internships', '3. Fit: curriculum, research, career resources', '4. Closing: goals and contribution'] },
      { type: 'list', title: 'European Notes', items: ['Some systems combine motivation letter with CV upload.', 'Respect word caps (often 500–1000 words).', 'Avoid overly US-style marketing tone.'] },
      { type: 'note', title: 'Tip', text: 'Check whether the program lists explicit prompts—answer each beats a generic template.' }
    ]}
  },

  'inquiry-letter': {
    zh: { sections: [
      { type: 'paragraph', text: '套磁信用于联系潜在导师或招生办，询问招生、研究 fit 或 visit。应短、具体、证明做过功课，不要群发空洞模板。' },
      { type: 'template', title: '套磁邮件', lines: ['Subject: Prospective [Degree] Applicant – [Your Name] – [Research Interest]', 'Dear Professor [Name],', 'I am [year/background] planning to apply to [Program]. I read your paper on [topic] and am interested in [specific angle].', 'My experience in [project] involved [method/result].', 'May I ask whether you expect to take students in [cycle]?', 'Thank you. Attached is my CV.', 'Best, [Name]'] },
      { type: 'list', title: '写作要点', items: ['提及教授具体论文或项目。', '说明你的技能如何 complement 其研究。', '问题明确，一封邮件 1–2 个问题即可。'] },
      { type: 'note', title: '提示', text: '若无回复，2 周后 polite follow-up 一次即可，避免频繁轰炸。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Inquiry emails reach potential advisors or admissions offices. Keep them short, specific, and evidence that you did homework—avoid blank mass templates.' },
      { type: 'template', title: 'Inquiry Email', lines: ['Subject: Prospective [Degree] Applicant – [Name] – [Research Interest]', 'Dear Professor [Name],', 'I plan to apply to [Program]. I read your work on [topic] and am interested in [specific angle].', 'My [project] involved [method/result].', 'May I ask whether you expect students in [cycle]?', 'Thank you. CV attached.', 'Best, [Name]'] },
      { type: 'list', title: 'Key Points', items: ['Cite a specific paper or project.', 'Explain how your skills complement their lab.', 'One or two clear questions per email.'] },
      { type: 'note', title: 'Tip', text: 'One polite follow-up after two weeks is enough—avoid repeated pings.' }
    ]}
  },

  'follow-up-letter': {
    zh: { sections: [
      { type: 'paragraph', text: 'Follow-up 邮件用于确认材料收讫、询问审核进度、面试后感谢或补充说明。保持礼貌、简短、一次只处理一个事项。' },
      { type: 'list', title: '常见场景', items: ['材料缺失：说明已重新上传/邮寄 tracking。', '进度询问：距 deadline 2 周以上再礼貌询问。', '面试后：24 小时内感谢 + 1 点补充亮点。', 'Waitlist：更新成绩或新成果（简短）。'] },
      { type: 'template', title: '进度询问', lines: ['Dear [Office],', 'I applied to [Program] on [date]. Could you confirm whether my [document] was received?', 'Application ID: [ID].', 'Thank you for your help.', 'Sincerely, [Name]'] },
      { type: 'note', title: '提示', text: '避免语气催促；若官网写明不接受催促，则不要发 progress email。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Follow-up emails confirm receipt, ask status, thank after interviews, or add brief updates. Stay polite, short, one topic per message.' },
      { type: 'list', title: 'Scenarios', items: ['Missing doc: note re-upload or tracking number.', 'Status: ask politely only if >2 weeks before deadline.', 'Post-interview: thank within 24 hours + one highlight.', 'Waitlist: brief update on grades or new achievement.'] },
      { type: 'template', title: 'Status Inquiry', lines: ['Dear [Office],', 'I applied to [Program] on [date]. Could you confirm receipt of my [document]?', 'Application ID: [ID].', 'Thank you for your help.', 'Sincerely, [Name]'] },
      { type: 'note', title: 'Tip', text: 'Avoid pushy tone; if the website says no status inquiries, do not send one.' }
    ]}
  },

  'letter-thank': {
    zh: { sections: [
      { type: 'paragraph', text: '感谢信适用于面试、校园 visit、教授回信或校友帮助后。24–48 小时内发送，3–5 句即可，提及具体对话内容显得真诚。' },
      { type: 'template', title: '面试后感谢', lines: ['Dear [Name],', 'Thank you for meeting with me on [date] to discuss [Program].', 'I especially appreciated your insight on [specific topic we discussed].', 'Our conversation reinforced my interest in [Program].', 'Thank you again.', 'Best regards, [Name]'] },
      { type: 'list', title: '要点', items: ['提及具体讨论点，非泛泛 "great conversation"。', '不重复整篇 SOP 内容。', 'Subject: Thank you – [Your Name] – [Program Interview]'] },
      { type: 'note', title: '提示', text: '若面试是 group format，可 cc 招生办或单独给主要面试官发。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Thank-you notes follow interviews, campus visits, professor replies, or alumni help. Send within 24–48 hours; 3–5 sentences citing a specific discussion point.' },
      { type: 'template', title: 'Post-Interview Thanks', lines: ['Dear [Name],', 'Thank you for meeting on [date] to discuss [Program].', 'I appreciated your insight on [specific topic].', 'Our talk reinforced my interest in [Program].', 'Thank you again.', 'Best regards, [Name]'] },
      { type: 'list', title: 'Notes', items: ['Reference a concrete topic, not "great conversation."', 'Do not paste your whole SOP.', 'Subject: Thank you – [Name] – [Program Interview]'] },
      { type: 'note', title: 'Tip', text: 'For panel interviews, email the lead interviewer or cc admissions as appropriate.' }
    ]}
  },

  'letter-defer': {
    zh: { sections: [
      { type: 'paragraph', text: 'Deferral 请求用于已获 offer 但需推迟入学（常见原因：签证延迟、工作交接、健康、军事等）。应说明原因、 proposed 入学学期及仍就读意愿。' },
      { type: 'template', title: '延期申请', lines: ['Dear [Admissions],', 'I am grateful for admission to [Program] for [Term].', 'Due to [brief reason], I respectfully request deferral to [Term].', 'I remain committed to attending and will [any conditions].', 'Please advise on required forms or deposits.', 'Sincerely, [Name]'] },
      { type: 'list', title: '注意', items: ['查阅学校 deferral policy（是否 guaranteed）。', '部分项目仅允许 defer 一次或需重新竞争奖学金。', '保持专业，避免过度私人细节。'] },
      { type: 'note', title: '提示', text: '尽早提出，勿拖到开学前最后一周。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Deferral requests postpone enrollment after an offer (visa delay, work handover, health, service, etc.). State reason, target term, and continued intent to enroll.' },
      { type: 'template', title: 'Deferral Request', lines: ['Dear [Admissions],', 'Thank you for admission to [Program] for [Term].', 'Due to [brief reason], I respectfully request deferral to [Term].', 'I remain committed to attending and will [any conditions].', 'Please advise on forms or deposits.', 'Sincerely, [Name]'] },
      { type: 'list', title: 'Cautions', items: ['Read deferral policy (guaranteed or case-by-case).', 'Some programs allow one deferral or re-compete for aid.', 'Stay professional; limit private detail.'] },
      { type: 'note', title: 'Tip', text: 'Submit early—not the week before orientation.' }
    ]}
  },

  'letter-waiver': {
    zh: { sections: [
      { type: 'paragraph', text: '语言豁免申请信说明为何无需提交 TOEFL/IELTS（如英语国家学位、全英文授课证明、长期英语工作环境等）。须附证据清单并对照学校 policy。' },
      { type: 'list', title: '常见豁免依据', items: ['本科或硕士在英语国家完成。', '学位授课语言为英语（需学校证明）。', '多年英语工作环境（部分学校接受）。'] },
      { type: 'template', title: '豁免申请', lines: ['Dear [Admissions],', 'I request a waiver of the English proficiency requirement for [Program].', 'I completed [degree] at [Institution] where instruction was in English (see attached certificate).', 'Policy reference: [link or section if known].', 'Please confirm if additional documents are needed.', 'Thank you, [Name]'] },
      { type: 'note', title: '提示', text: '并非所有项目接受 waiver；先查官网，再写信，避免无效申请。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Language waiver letters explain why TOEFL/IELTS is unnecessary—English-medium degree, official proof of instruction, or long professional English use per policy.' },
      { type: 'list', title: 'Common Grounds', items: ['Degree completed in an English-speaking country.', 'Official proof that instruction was in English.', 'Extended English workplace (select programs only).'] },
      { type: 'template', title: 'Waiver Request', lines: ['Dear [Admissions],', 'I request a waiver of the English requirement for [Program].', 'I completed [degree] at [Institution] in English (certificate attached).', 'Policy reference: [link or section].', 'Please confirm if more documents are needed.', 'Thank you, [Name]'] },
      { type: 'note', title: 'Tip', text: 'Not all programs grant waivers—verify policy before writing.' }
    ]}
  },

  'letter-scholar': {
    zh: { sections: [
      { type: 'paragraph', text: '奖学金申请信阐述财务需求、学术潜力与项目贡献，常作为 separate scholarship form 的补充说明。' },
      { type: 'template', title: '结构', lines: ['Opening: 申请 [Scholarship Name] for [Program]', 'Academic merit: GPA, research, awards (brief)', 'Financial need: factual, dignified explanation', 'Future contribution: career or community impact', 'Closing: gratitude and enclosed materials'] },
      { type: 'list', title: '写作原则', items: ['财务描述客观，避免过度悲情。', '强调 merit + need 双重匹配 scholarship 宗旨。', '附官方要求的 income / tax 表格。'] },
      { type: 'note', title: '提示', text: '区分 merit-based 与 need-based， tailor 重点不同。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Scholarship letters explain financial need, academic merit, and potential contribution—often supplementing official scholarship forms.' },
      { type: 'template', title: 'Structure', lines: ['Opening: applying for [Scholarship] in [Program]', 'Merit: GPA, research, awards (brief)', 'Need: factual, dignified statement', 'Contribution: future career or community impact', 'Closing: gratitude and enclosures'] },
      { type: 'list', title: 'Principles', items: ['Describe finances objectively.', 'Match both merit and need to the award mission.', 'Attach required income or tax forms.'] },
      { type: 'note', title: 'Tip', text: 'Merit-based vs need-based awards need different emphasis.' }
    ]}
  },

  'letter-network': {
    zh: { sections: [
      { type: 'paragraph', text: 'Networking 邮件联系校友或学长学姐，目标通常是了解项目体验、内推建议或 career path。应尊重对方时间，问题具体且可快速回复。' },
      { type: 'template', title: '校友联系', lines: ['Subject: [Your School] student interested in [Program/Company]', 'Dear [Name],', 'I am [background] applying to [Program]. I found your profile via [LinkedIn/alumni directory].', 'Would you have 15 minutes for a brief call about [specific question]?', 'I am happy to work around your schedule.', 'Thank you, [Name]'] },
      { type: 'list', title: '礼仪', items: ['自我介绍 2 句以内。', '一次 1–2 个具体问题。', '若对方忙，接受 written reply。'] },
      { type: 'note', title: '提示', text: '通话后 24 小时内发 thank-you，维护长期关系而非一次性索取。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Networking emails reach alumni for program insight, referrals, or career paths. Respect time; ask specific, quick-to-answer questions.' },
      { type: 'template', title: 'Alumni Outreach', lines: ['Subject: [Your School] student interested in [Program/Company]', 'Dear [Name],', 'I am [background], applying to [Program]. I found you via [LinkedIn/alumni directory].', 'Would you have 15 minutes for [specific question]?', 'Happy to work around your schedule.', 'Thank you, [Name]'] },
      { type: 'list', title: 'Etiquette', items: ['Two-sentence self intro max.', 'One or two concrete questions.', 'Accept a written reply if they are busy.'] },
      { type: 'note', title: 'Tip', text: 'Send thanks within 24 hours after a call—build relationships, not one-off asks.' }
    ]}
  },

  'letter-admission': {
    zh: { sections: [
      { type: 'paragraph', text: 'Admission appeal 用于拒信后请求 reconsideration，仅在有 substantial new information 时有效（如新成绩、重大成果、材料错误澄清）。' },
      { type: 'list', title: '可 appeal 情形', items: ['新 GRE/IELTS 显著提分。', '重要奖项或论文发表。', '申请系统错误或材料未审。'] },
      { type: 'template', title: 'Appeal 信', lines: ['Dear [Committee],', 'Thank you for reviewing my application to [Program].', 'I respectfully request reconsideration based on [new information].', 'Since submitting, I have [specific update with evidence].', 'I remain strongly interested in [Program].', 'Enclosed: [documents].', 'Sincerely, [Name]'] },
      { type: 'note', title: '提示', text: '许多项目明确不接受 appeal；若无 new info，不宜发送。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Admission appeals request reconsideration after a denial—effective only with substantial new information: higher scores, major achievements, or clerical errors.' },
      { type: 'list', title: 'Valid Grounds', items: ['Significantly improved GRE/IELTS.', 'Major award or publication.', 'Portal error or unread materials.'] },
      { type: 'template', title: 'Appeal Letter', lines: ['Dear [Committee],', 'Thank you for reviewing my [Program] application.', 'I respectfully request reconsideration based on [new information].', 'Since submitting, I have [update with evidence].', 'I remain strongly interested in [Program].', 'Enclosed: [documents].', 'Sincerely, [Name]'] },
      { type: 'note', title: 'Tip', text: 'Many programs state they do not accept appeals—do not send without new evidence.' }
    ]}
  },

  'letter-visa-invite': {
    zh: { sections: [
      { type: 'paragraph', text: '签证邀请/资助信用于证明资金来源或亲属邀请（部分国家），格式因使馆而异。本资源提供通用结构，正式提交须核对目标国模板。' },
      { type: 'template', title: '家庭资助声明（参考）', lines: ['To Whom It May Concern,', 'I, [Sponsor Name], confirm financial support for [Student Name] during studies at [University].', 'Relationship: [parent/guardian].', 'Estimated annual support: [amount] for tuition and living expenses.', 'Attached: bank statements / employment proof.', 'Signed, [Name], [Date]'] },
      { type: 'list', title: '材料常附', items: ['资助人身份证/护照复印件', '银行流水（注意冻结期）', '与学生关系证明', '学生录取信复印件'] },
      { type: 'note', title: '提示', text: '各国使馆格式差异大，务必使用官方最新样本，本模板不能替代 legal advice。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Visa invitation or sponsorship letters prove funding or family support—formats vary by embassy. This is a general structure; verify the destination country template before submission.' },
      { type: 'template', title: 'Sponsorship Statement (Sample)', lines: ['To Whom It May Concern,', 'I, [Sponsor], confirm financial support for [Student] at [University].', 'Relationship: [parent/guardian].', 'Estimated annual support: [amount] for tuition and living.', 'Attached: bank statements / employment proof.', 'Signed, [Name], [Date]'] },
      { type: 'list', title: 'Common Enclosures', items: ['Sponsor ID or passport copy', 'Bank statements (check hold period)', 'Proof of relationship', 'Copy of admission letter'] },
      { type: 'note', title: 'Tip', text: 'Embassy formats differ widely—use official samples; this is not legal advice.' }
    ]}
  }
}
