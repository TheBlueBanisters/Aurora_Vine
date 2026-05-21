/** Page-2 placeholder entries (bilingual literals, kept out of i18n.js bulk). */

export function litItem(id, titleZh, titleEn, descZh, descEn, date) {
  return {
    id,
    title: { zh: titleZh, en: titleEn },
    desc: { zh: descZh, en: descEn },
    date
  }
}

export const EXTRA_PLACEHOLDER_ITEMS = {
  gre: [
    litItem('gre-analytical', 'GRE 逻辑推理专项', 'GRE Analytical Reasoning Drills', '逻辑题常见陷阱与解题模板', 'Common logic traps and solution templates', '2025-03-04'),
    litItem('gre-vocab-3', 'GRE 填空高频搭配', 'GRE Text Completion Collocations', '两空/三空题高频固定搭配整理', 'High-frequency collocations for TC questions', '2025-03-11'),
    litItem('gre-reading', 'GRE 阅读长难句拆解', 'GRE Reading Sentence Analysis', '学术文章句子主干与逻辑关系训练', 'Academic sentence parsing drills', '2025-03-18'),
    litItem('gre-timing', 'GRE 模考时间管理', 'GRE Timing Strategy Guide', 'Verbal / Quant 分段计时策略', 'Section timing strategies for Verbal and Quant', '2025-03-25'),
    litItem('gre-error-log', 'GRE 错题本模板', 'GRE Error Log Template', '按题型记录错因与复习计划', 'Error tracking template by question type', '2025-04-01'),
    litItem('gre-aw-3', 'GRE 写作高分表达', 'GRE Writing Phrase Bank', 'Issue / Argument 常用论证表达', 'Argument phrases for Issue and Argument tasks', '2025-04-08'),
    litItem('gre-weekly', 'GRE 8 周冲刺计划', 'GRE 8-Week Sprint Plan', '按周拆解的 Verbal + Quant 任务', 'Weekly Verbal and Quant task breakdown', '2025-04-15')
  ],
  ielts: [
    litItem('ielts-band7', '雅思 7 分突破指南', 'IELTS Band 7 Breakthrough Guide', '四科均衡提分路径', 'Balanced improvement path across four skills', '2025-03-03'),
    litItem('ielts-collocation', '雅思写作话题词汇', 'IELTS Writing Topic Vocabulary', '教育/科技/环境等话题词伙', 'Topic collocations for common themes', '2025-03-10'),
    litItem('ielts-map', '雅思小作文地图题', 'IELTS Task 1 Map Questions', '地图变迁描述结构与句型', 'Structures for map change descriptions', '2025-03-17'),
    litItem('ielts-process', '雅思小作文流程图', 'IELTS Task 1 Process Diagrams', '流程阶段划分与被动语态', 'Process stages and passive voice patterns', '2025-03-24'),
    litItem('ielts-pronunciation', '雅思口语发音纠正', 'IELTS Pronunciation Correction', '连读弱读与语调练习', 'Linking, weak forms and intonation drills', '2025-03-31'),
    litItem('ielts-notebook', '雅思听力错题复盘', 'IELts Listening Error Review', '按 Section 分类的错因分析表', 'Section-based error analysis sheet', '2025-04-07'),
    litItem('ielts-fullmock-2', '雅思第二次全真模考', 'IELTS Second Full Mock Test', '含评分标准对照表', 'Includes band descriptor reference', '2025-04-14')
  ],
  toefl: [
    litItem('toefl-integrated-2', '托福综合口语 Camp 题', 'TOEFL Integrated Speaking Campus Set', 'Campus conversation 常见场景', 'Common campus conversation scenarios', '2025-03-05'),
    litItem('toefl-academic-2', '托福学术讲座笔记', 'TOEFL Academic Lecture Notes', 'Biology / History 讲座结构', 'Lecture structures in biology and history', '2025-03-12'),
    litItem('toefl-vocab', '托福学科词汇包', 'TOEFL Subject Vocabulary Pack', '天文/经济/艺术学科词汇', 'Astronomy, economics and art terms', '2025-03-19'),
    litItem('toefl-writing-2', '托福独立写作题库', 'TOEFL Independent Writing Prompt Bank', '高频题型思路与范文片段', 'Ideas and sample paragraphs by prompt type', '2025-03-26'),
    litItem('toefl-shadowing', '托福口语 shadowing 训练', 'TOEFL Speaking Shadowing Drills', '跟读材料与节奏标注', 'Shadowing scripts with rhythm marks', '2025-04-02'),
    litItem('toefl-template', '托福答题模板合集', 'TOEFL Response Template Collection', '四科通用开头/过渡/结尾模板', 'Opening, transition and closing templates', '2025-04-09'),
    litItem('toefl-retake', '托福二考提分计划', 'TOEFL Retake Improvement Plan', '针对弱项的 4 周复习表', 'Four-week review plan targeting weak areas', '2025-04-16')
  ],
  duolingo: [
    litItem('duolingo-interactive', 'DET 互动阅读专项', 'DET Interactive Reading Drills', '完形填空与段落排序练习', 'Cloze and paragraph ordering practice', '2025-03-06'),
    litItem('duolingo-write', 'DET 写作样本库', 'DET Writing Sample Bank', '看图写作与观点题范例', 'Photo and opinion writing samples', '2025-03-13'),
    litItem('duolingo-listen', 'DET 听写冲刺包', 'DET Dictation Sprint Pack', '高频听写句型与易错词', 'Common dictation patterns and tricky words', '2025-03-20'),
    litItem('duolingo-read', 'DET 阅读速答技巧', 'DET Reading Quick Response Tips', '限时阅读题的 skim 策略', 'Skimming strategies under time pressure', '2025-03-27'),
    litItem('duolingo-cert', 'DET 成绩解读指南', 'DET Score Interpretation Guide', '分数与 CEFR / 雅思对照', 'Score mapping to CEFR and IELTS', '2025-04-03'),
    litItem('duolingo-device', 'DET 考试设备检测', 'DET Equipment Checklist', '摄像头/麦克风/网络自检清单', 'Camera, mic and network pre-check list', '2025-04-10'),
    litItem('duolingo-retake', 'DET 二考冲刺安排', 'DET Retake Sprint Schedule', '14 天高频题型轮换表', '14-day rotating question-type schedule', '2025-04-17')
  ],
  letters: [
    litItem('letter-thank', '感谢信模板', 'Thank-you Letter Template', '面试/活动后跟进感谢', 'Post-interview and event follow-up thanks', '2025-02-09'),
    litItem('letter-defer', '延期申请信模板', 'Deferral Request Letter', 'Offer 延期入学申请结构', 'Structure for admission deferral requests', '2025-02-16'),
    litItem('letter-waiver', '语言豁免申请信', 'Language Waiver Request Letter', '申请语言成绩豁免的说明', 'Explanation for language score waiver', '2025-02-23'),
    litItem('letter-scholar', '奖学金申请信', 'Scholarship Application Letter', '阐述财务需求与学术潜力', 'Financial need and academic potential', '2025-03-02'),
    litItem('letter-network', 'Networking 邮件模板', 'Networking Email Templates', '校友/学长学姐联系话术', 'Outreach scripts for alumni contacts', '2025-03-09'),
    litItem('letter-admission', 'Admission Appeal 信', 'Admission Appeal Letter', '拒信后的申诉与补充材料说明', 'Appeal letter with supplemental materials', '2025-03-16'),
    litItem('letter-visa-invite', '签证邀请信参考', 'Visa Invitation Letter Reference', '家庭资助/邀请说明格式', 'Family sponsorship invitation format', '2025-03-23')
  ],
  resume: [
    litItem('resume-onepage-en', '一页英文 CV 范例', 'One-Page English CV Sample', '商科申请精简版式', 'Compact business school layout', '2025-02-07'),
    litItem('resume-bullet', '简历 bullet 写作指南', 'Resume Bullet Writing Guide', 'STAR 法则与量化表达', 'STAR method and quantified impact', '2025-02-14'),
    litItem('resume-skill', '技能栏写法参考', 'Skills Section Reference', 'Technical / Language skills 排版', 'Formatting technical and language skills', '2025-02-21'),
    litItem('resume-phd', 'PhD 申请 CV 模板', 'PhD Application CV Template', 'Publication / Conference 展示', 'Publications and conference listing', '2025-02-28'),
    litItem('resume-mba', 'MBA 申请简历模板', 'MBA Application Resume Template', '领导力与职业进展叙事', 'Leadership and career progression narrative', '2025-03-07'),
    litItem('resume-linkedin', 'LinkedIn 同步优化', 'LinkedIn Profile Sync Guide', '简历与 LinkedIn 信息对齐', 'Align resume with LinkedIn profile', '2025-03-14'),
    litItem('resume-ats', 'ATS 友好格式说明', 'ATS-Friendly Format Guide', '避免表格与特殊字符的提示', 'Tips to avoid tables and special characters', '2025-03-21')
  ],
  sop: [
    litItem('sop-opening', 'PS 开头段落范例', 'PS Opening Paragraph Samples', '多种_hook_写法对比', 'Comparison of different opening hooks', '2025-02-11'),
    litItem('sop-research', '研究经历段落模板', 'Research Experience Paragraph', '从项目到研究兴趣的衔接', 'Bridging projects to research interests', '2025-02-18'),
    litItem('sop-failure', '失败与成长叙事', 'Failure and Growth Narrative', '如何将挫折写进 PS', 'Writing setbacks constructively in PS', '2025-02-25'),
    litItem('sop-why-school', 'Why School 段落模板', 'Why School Paragraph Template', '匹配项目资源与教授方向', 'Matching program resources and faculty', '2025-03-04'),
    litItem('sop-short', '500 词精简 PS', '500-Word Concise PS', '超短字数下的结构取舍', 'Structural trade-offs under word limits', '2025-03-11'),
    litItem('sop-phd', 'PhD 研究计划片段', 'PhD Research Plan Excerpt', '研究问题与方法论概述', 'Research questions and methodology overview', '2025-03-18'),
    litItem('sop-peer', 'PS 互评 checklist', 'PS Peer Review Checklist', '提交前同伴互评要点', 'Peer review points before submission', '2025-03-25')
  ],
  ppt: [
    litItem('ppt-thesis', '论文答辩 PPT 模板', 'Thesis Defense Slide Deck', '研究背景/方法/结果/结论结构', 'Background, methods, results and conclusion', '2025-02-22'),
    litItem('ppt-group', '小组汇报 PPT 模板', 'Group Presentation Template', '分工页与进度页设计', 'Division of work and progress slides', '2025-03-01'),
    litItem('ppt-data', '数据可视化 PPT 技巧', 'Data Visualization in Slides', '图表选择与配色建议', 'Chart selection and color guidance', '2025-03-08'),
    litItem('ppt-interview', '面试展示 PPT 模板', 'Interview Presentation Template', '5 分钟自我展示结构', 'Five-minute self-presentation structure', '2025-03-15'),
    litItem('ppt-poster', 'Poster 转 PPT 参考', 'Poster-to-Slide Reference', '学术海报改口头报告', 'Converting academic posters to talks', '2025-03-22'),
    litItem('ppt-minimal', '极简风 PPT 模板', 'Minimal Slide Template', '留白与字号层级规范', 'Whitespace and typography hierarchy', '2025-03-29'),
    litItem('ppt-animation', 'PPT 动画使用指南', 'Slide Animation Guide', '学术场景适度动画建议', 'Appropriate animation for academic talks', '2025-04-05')
  ],
  guide: [
    litItem('guide-freshman', '大一留学预备清单', 'Freshman Prep Checklist', '从大一开始的背景积累', 'Background building starting freshman year', '2025-02-03'),
    litItem('guide-gpa', 'GPA 规划与选课建议', 'GPA Planning and Course Selection', '均分与先修课策略', 'GPA and prerequisite course strategy', '2025-02-10'),
    litItem('guide-recommend', '推荐信沟通指南', 'Recommendation Letter Communication', '如何与推荐人高效沟通', 'How to communicate with recommenders', '2025-02-17'),
    litItem('guide-waiver', '语言/ GRE 豁免查询', 'Test Waiver Lookup Guide', '各校豁免政策汇总入口', 'Entry point for school waiver policies', '2025-02-24'),
    litItem('guide-budget', '留学预算规划表', 'Study Abroad Budget Planner', '学费/生活/保险费用估算', 'Tuition, living and insurance estimates', '2025-03-03'),
    litItem('guide-culture', '跨文化适应指南', 'Cross-Cultural Adaptation Guide', '初到海外的生活与文化差异', 'Life and culture shock upon arrival', '2025-03-10'),
    litItem('guide-alumni', '校友网络利用指南', 'Alumni Network Guide', 'LinkedIn 与校友活动参与', 'LinkedIn and alumni event participation', '2025-03-17')
  ]
}
