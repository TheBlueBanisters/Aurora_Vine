/** 简历资源条目正文集合（除 resume-template / resume-cv 主入口外的其它条目） */

export const RESUME_EXTRA_CONTENT = {
  'resume-template-2': {
    zh: { sections: [
      { type: 'paragraph', text: '一页版 CV 要求信息密度高但层级清晰：姓名与联系方式置顶，Education 与 Experience 占主体，Skills 一行或两列收尾。' },
      { type: 'list', title: '排版要点', items: ['页边距 0.5–0.75 inch，字号 10–11 pt。', '模块标题全大写或 small caps，与正文区分。', '每段经历 2–4 条 bullet，动词开头。', '删除高中、无关兼职、空泛 soft skills。'] },
      { type: 'template', title: '模块顺序（一页）', lines: ['Name | Email | Phone | LinkedIn', 'EDUCATION', 'EXPERIENCE / PROJECTS', 'SKILLS (languages, tools)'] },
      { type: 'note', title: '提示', text: '若内容超一页，优先压缩描述而非缩小字号到 9 pt 以下。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'A one-page CV packs information densely but clearly: contact header, Education and Experience as core, Skills in one or two lines at the bottom.' },
      { type: 'list', title: 'Layout', items: ['Margins 0.5–0.75 in; body 10–11 pt.', 'Section headers in caps or small caps.', '2–4 bullets per role; lead with verbs.', 'Drop high school, irrelevant jobs, vague soft skills.'] },
      { type: 'template', title: 'One-Page Order', lines: ['Name | Email | Phone | LinkedIn', 'EDUCATION', 'EXPERIENCE / PROJECTS', 'SKILLS (languages, tools)'] },
      { type: 'note', title: 'Tip', text: 'If content overflows, trim bullets before shrinking below 9 pt.' }
    ]}
  },

  'resume-research': {
    zh: { sections: [
      { type: 'paragraph', text: '科研导向简历突出研究问题、方法、个人贡献与可验证成果，适合 RA、研究型硕士与 PhD 申请。' },
      { type: 'list', title: 'Research Experience 写法', items: ['标题：Research Assistant, [Lab], [Dates]', 'Bullet 1：研究问题 + 你的角色', 'Bullet 2：方法/工具 + 数据规模', 'Bullet 3：结果（论文、报告、会议）'] },
      { type: 'template', title: '示例 bullet', lines: ['Investigated [topic] under Prof. [Name]; designed survey (N=500).', 'Cleaned and analyzed data in Stata; co-authored working paper.', 'Presented poster at [Conference], [Year].'] },
      { type: 'note', title: '提示', text: '区分 team outcome 与 personal contribution，用 I / independently / led 明确分工。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Research-focused resumes highlight questions, methods, personal contribution, and verifiable outputs—for RA, research master, and PhD applications.' },
      { type: 'list', title: 'Research Bullets', items: ['Header: Research Assistant, [Lab], [Dates]', 'Bullet 1: research question + your role', 'Bullet 2: methods/tools + data scale', 'Bullet 3: outputs (paper, report, conference)'] },
      { type: 'template', title: 'Sample Lines', lines: ['Investigated [topic] under Prof. [Name]; designed survey (N=500).', 'Cleaned and analyzed data in Stata; co-authored working paper.', 'Presented poster at [Conference], [Year].'] },
      { type: 'note', title: 'Tip', text: 'Separate team outcomes from your work—use I / independently / led.' }
    ]}
  },

  'resume-intern': {
    zh: { sections: [
      { type: 'paragraph', text: '实习导向简历强调行业技能、项目交付与量化影响，适合商科、数据、产品等就业导向项目。' },
      { type: 'list', title: 'STAR 化 bullet', items: ['Situation：业务背景一句', 'Task：你的职责', 'Action：具体行动 + 工具', 'Result：数字或定性成果'] },
      { type: 'template', title: '示例', lines: ['Marketing Intern, [Company] | Summer 2024', '- Supported campaign for [product]; A/B tested email subject lines in Mailchimp.', '- Increased open rate by 12% over 4-week period.', '- Summarized competitor analysis in deck for manager.'] },
      { type: 'note', title: '提示', text: '无数字时可写 scope：handled 20+ client inquiries weekly。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Internship resumes stress industry skills, deliverables, and quantified impact—for business, data, and product-oriented programs.' },
      { type: 'list', title: 'STAR Bullets', items: ['Situation: one-line context', 'Task: your responsibility', 'Action: concrete steps + tools', 'Result: numbers or clear outcome'] },
      { type: 'template', title: 'Sample', lines: ['Marketing Intern, [Company] | Summer 2024', '- Supported [product] campaign; A/B tested Mailchimp subject lines.', '- Raised open rate 12% over four weeks.', '- Delivered competitor analysis deck to manager.'] },
      { type: 'note', title: 'Tip', text: 'Without metrics, use scope: handled 20+ client inquiries weekly.' }
    ]}
  },

  'resume-design': {
    zh: { sections: [
      { type: 'paragraph', text: '设计类申请可在 CV 中嵌入 portfolio 链接，并用视觉 hierarchy 展示 2–3 个代表项目，仍建议保持可读性与 ATS 友好。' },
      { type: 'list', title: '项目展示', items: ['Project title | Role | Year | portfolio link', 'One-line problem statement', 'Tools: Figma, Adobe CC, etc.', 'Outcome: user testing, award, deployment'] },
      { type: 'list', title: '排版建议', items: ['主 CV 仍用简洁黑白版提交网申。', 'Portfolio PDF 或网站承载视觉细节。', '避免纯图片 CV 无法被系统解析。'] },
      { type: 'note', title: '提示', text: 'MFA / design master 常要求 separate portfolio—CV 只做索引与上下文。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Design applicants embed portfolio links and use visual hierarchy for 2–3 flagship projects while keeping the CV readable and ATS-friendly.' },
      { type: 'list', title: 'Project Lines', items: ['Title | Role | Year | portfolio URL', 'One-line problem', 'Tools: Figma, Adobe CC, etc.', 'Outcome: testing, award, launch'] },
      { type: 'list', title: 'Layout', items: ['Submit a clean black-and-white CV for portals.', 'Put visuals in portfolio PDF or site.', 'Avoid image-only CVs systems cannot parse.'] },
      { type: 'note', title: 'Tip', text: 'MFA/design masters often require a separate portfolio—the CV indexes context only.' }
    ]}
  },

  'resume-checklist': {
    zh: { sections: [
      { type: 'paragraph', text: '提交前用清单核对格式与内容，避免低级错误影响第一印象。' },
      { type: 'list', title: '格式检查', items: ['PDF 命名：LastName_FirstName_CV.pdf', '日期格式统一（Jan 2024 – Present）', '超链接可点击（LinkedIn, portfolio）', '无表格、文本框、页眉页脚复杂元素（ATS）'] },
      { type: 'list', title: '内容检查', items: ['拼写与语法（Grammarly 或人工）', '每 bullet 有动词 + 结果', 'GPA 按项目要求填写（4.0/100  scale 注明）', '与网申表单信息一致'] },
      { type: 'note', title: '提示', text: '打印黑白预览一次，检查对齐与 orphan bullet。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Run this checklist before submission to avoid first-impression errors.' },
      { type: 'list', title: 'Format', items: ['PDF name: LastName_FirstName_CV.pdf', 'Consistent dates (Jan 2024 – Present)', 'Clickable links (LinkedIn, portfolio)', 'No tables/text boxes for ATS'] },
      { type: 'list', title: 'Content', items: ['Spelling and grammar pass', 'Each bullet: verb + outcome', 'GPA scale labeled (4.0 / 100)', 'Matches application form data'] },
      { type: 'note', title: 'Tip', text: 'Print black-and-white preview to catch alignment and orphan bullets.' }
    ]}
  },

  'resume-onepage-en': {
    zh: { sections: [
      { type: 'paragraph', text: '商科一页 CV 强调 leadership、impact 与 career progression，Education 可含 relevant coursework，Experience 按时间倒序。' },
      { type: 'template', title: '商科精简结构', lines: ['Header + 1-line profile (optional)', 'EDUCATION: school, degree, GPA, honors', 'PROFESSIONAL EXPERIENCE: company, title, dates, bullets', 'LEADERSHIP / ACTIVITIES (if space)', 'SKILLS: Excel, Python, languages'] },
      { type: 'list', title: 'MBA 偏好', items: ['量化 impact：revenue, cost, team size', '展示 upward mobility 或 increasing responsibility', 'Community leadership 单独一小节'] },
      { type: 'note', title: '提示', text: 'Consulting / finance 申请常要求严格一页；tech 可略宽松但仍建议一页。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Business one-page CVs foreground leadership, impact, and progression. Education may list relevant coursework; Experience is reverse chronological.' },
      { type: 'template', title: 'Business Layout', lines: ['Header + optional 1-line profile', 'EDUCATION: school, degree, GPA, honors', 'PROFESSIONAL EXPERIENCE: company, title, dates, bullets', 'LEADERSHIP / ACTIVITIES (if space)', 'SKILLS: Excel, Python, languages'] },
      { type: 'list', title: 'MBA Preferences', items: ['Quantify: revenue, cost, team size', 'Show upward mobility', 'Separate community leadership block'] },
      { type: 'note', title: 'Tip', text: 'Consulting/finance often mandate one page; tech may allow slight overflow but one page is safer.' }
    ]}
  },

  'resume-bullet': {
    zh: { sections: [
      { type: 'paragraph', text: 'Strong bullet = Action Verb + Task + Method/Tool + Result。STAR 法则帮助把经历写成可验证陈述。' },
      { type: 'list', title: '动词库（按类）', items: ['Research：analyzed, investigated, modeled', 'Leadership：led, coordinated, mentored', 'Creation：designed, built, drafted', 'Improvement：optimized, reduced, increased'] },
      { type: 'template', title: 'STAR 模板', lines: ['[Action] [task] using [tool], resulting in [metric/outcome].', 'Example: Built Python pipeline to clean 10k records, cutting prep time 40%.'] },
      { type: 'note', title: '提示', text: '避免 responsible for / participated in 等弱动词开头。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Strong bullets follow Action + Task + Method/Tool + Result. STAR keeps experiences verifiable.' },
      { type: 'list', title: 'Verb Bank', items: ['Research: analyzed, investigated, modeled', 'Leadership: led, coordinated, mentored', 'Creation: designed, built, drafted', 'Improvement: optimized, reduced, increased'] },
      { type: 'template', title: 'STAR Line', lines: ['[Action] [task] using [tool], resulting in [metric/outcome].', 'Example: Built Python pipeline for 10k records, cutting prep time 40%.'] },
      { type: 'note', title: 'Tip', text: 'Avoid weak openers like responsible for or participated in.' }
    ]}
  },

  'resume-skill': {
    zh: { sections: [
      { type: 'paragraph', text: 'Skills 栏应分类清晰，语言注明水平（Native / Fluent / Professional），技术栈按熟练度或项目相关性排列。' },
      { type: 'list', title: '常见分类', items: ['Languages: English (Fluent), Mandarin (Native)', 'Programming: Python, R, SQL', 'Software: Stata, SPSS, LaTeX, Office', 'Lab / Other: PCR, microscopy (if relevant)'] },
      { type: 'list', title: '避免', items: ['Microsoft Word 单独列出（默认）', '过长 soft skill 列表', '与正文无关的 hobby skills'] },
      { type: 'note', title: '提示', text: '正文 bullet 中用过的工具应在 Skills 中出现，形成呼应。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Skills sections need clear categories. Label language level; order technical tools by proficiency or relevance.' },
      { type: 'list', title: 'Categories', items: ['Languages: English (Fluent), Mandarin (Native)', 'Programming: Python, R, SQL', 'Software: Stata, SPSS, LaTeX, Office', 'Lab / Other: as relevant'] },
      { type: 'list', title: 'Avoid', items: ['Listing Microsoft Word alone', 'Long soft-skill laundry lists', 'Irrelevant hobbies'] },
      { type: 'note', title: 'Tip', text: 'Tools mentioned in bullets should appear in Skills for consistency.' }
    ]}
  },

  'resume-phd': {
    zh: { sections: [
      { type: 'paragraph', text: 'PhD CV 可 2–3 页，Publication 按 APA 或 field convention 列出，Working papers 标注状态。' },
      { type: 'list', title: 'Publication 格式', items: ['Published：作者, (年). Title. Journal, vol(issue), pages.', 'Under review：Title. Manuscript under review at [Journal].', 'In prep：Title. Manuscript in preparation.'] },
      { type: 'template', title: '模块顺序', lines: ['Education', 'Research Interests', 'Research Experience', 'Publications', 'Conference Presentations', 'Teaching / TA', 'Grants / Awards', 'Skills'] },
      { type: 'note', title: '提示', text: '勿夸大 publication status；committee 可核实。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'PhD CVs may run 2–3 pages. List publications in field convention; label working paper status accurately.' },
      { type: 'list', title: 'Publication Lines', items: ['Published: authors, (year). Title. Journal, vol(issue), pages.', 'Under review: Title. Manuscript under review at [Journal].', 'In prep: Title. Manuscript in preparation.'] },
      { type: 'template', title: 'Section Order', lines: ['Education', 'Research Interests', 'Research Experience', 'Publications', 'Conference Presentations', 'Teaching / TA', 'Grants / Awards', 'Skills'] },
      { type: 'note', title: 'Tip', text: 'Do not inflate publication status—committees can verify.' }
    ]}
  },

  'resume-mba': {
    zh: { sections: [
      { type: 'paragraph', text: 'MBA 简历强调 leadership narrative：每段工作展示 scope 扩大、跨职能协作与 measurable business impact。' },
      { type: 'list', title: '叙事线', items: ['Early role：foundation skills + key project', 'Mid role：team lead + metric', 'Recent：strategic impact + stakeholder management'] },
      { type: 'template', title: 'Leadership bullet', lines: ['Led cross-functional team of [N] to [deliverable], achieving [metric].', 'Identified [problem]; implemented [solution], saving [cost/time].'] },
      { type: 'note', title: '提示', text: '与 optional essay 中的 career goals 对齐，CV 提供 evidence 而非重复 essay 原文。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'MBA resumes tell a leadership arc: expanding scope, cross-functional work, and measurable business impact each role.' },
      { type: 'list', title: 'Narrative Arc', items: ['Early: foundation + flagship project', 'Mid: team lead + metric', 'Recent: strategic impact + stakeholders'] },
      { type: 'template', title: 'Leadership Bullet', lines: ['Led cross-functional team of [N] to [deliverable], achieving [metric].', 'Identified [problem]; implemented [solution], saving [cost/time].'] },
      { type: 'note', title: 'Tip', text: 'Align with career goals in essays—CV supplies evidence, not essay copy.' }
    ]}
  },

  'resume-linkedin': {
    zh: { sections: [
      { type: 'paragraph', text: 'LinkedIn 与申请 CV 应信息一致：职位 title、日期、学校名、关键 bullet 描述对齐，避免 recruiter 看到矛盾。' },
      { type: 'list', title: '同步项', items: ['Headline：目标方向 + 当前身份', 'About：2–3 句 elevator pitch', 'Experience：与 CV bullet 一致或略扩', 'Education：degree, field, dates', 'Featured：portfolio / publication links'] },
      { type: 'note', title: '提示', text: '网申前更新 LinkedIn URL 于 CV；部分学校会 cross-check。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'LinkedIn should match application CV: titles, dates, schools, and key bullets aligned—recruiters notice conflicts.' },
      { type: 'list', title: 'Sync Checklist', items: ['Headline: target field + current role', 'About: 2–3 sentence pitch', 'Experience: mirrors CV bullets', 'Education: degree, field, dates', 'Featured: portfolio / publications'] },
      { type: 'note', title: 'Tip', text: 'Update LinkedIn URL on the CV before submitting; some schools cross-check.' }
    ]}
  },

  'resume-ats': {
    zh: { sections: [
      { type: 'paragraph', text: 'ATS（申请人跟踪系统）解析纯文本 CV。复杂排版会导致信息丢失或乱序。' },
      { type: 'list', title: 'ATS 友好', items: ['标准字体：Arial, Calibri, Times', '单栏布局', 'Bullet 用 • 或 - ，非特殊符号', '关键词与 JD 自然匹配（勿 keyword stuffing）'] },
      { type: 'list', title: '避免', items: ['多栏、表格、文本框', '页眉页脚放关键信息', '图片、图标代替文字', 'PDF 扫描件'] },
      { type: 'note', title: '提示', text: '网申系统多接受 PDF；仍建议用 Word 导出标准 PDF 而非 Canva 纯视觉版。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Applicant tracking systems parse plain-text CVs. Fancy layouts lose or scramble fields.' },
      { type: 'list', title: 'ATS-Friendly', items: ['Standard fonts: Arial, Calibri, Times', 'Single column', 'Bullets: • or -', 'Natural keyword overlap with job description'] },
      { type: 'list', title: 'Avoid', items: ['Multi-column, tables, text boxes', 'Critical info in headers/footers', 'Icons instead of text', 'Scanned PDFs'] },
      { type: 'note', title: 'Tip', text: 'Export a standard PDF from Word rather than a Canva-only visual file.' }
    ]}
  }
}
