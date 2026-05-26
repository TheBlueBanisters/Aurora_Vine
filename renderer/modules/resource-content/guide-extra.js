/** 申请指南资源条目正文集合（除 guide-timeline / guide-visa 主入口外的其它条目） */

export const GUIDE_EXTRA_CONTENT = {
  'guide-timeline-2': {
    zh: { sections: [
      { type: 'paragraph', text: '第二套时间线侧重 rolling admission 与多轮 deadline：EA/ED/RD、奖学金截止、签证缓冲。' },
      { type: 'list', title: '多轮截止', items: ['ED/EA：通常 11 月， binding ED 需谨慎', 'RD：1 月为主，部分 12 月或 2 月', 'Rolling：越早越好，名额满即关', 'Scholarship：可能早于 program deadline'] },
      { type: 'template', title: 'Personal deadline 表', lines: ['Official deadline: ___', 'Internal deadline (-7d): ___', 'Materials ready (-14d): ___', 'Recommender reminder (-21d): ___'] },
      { type: 'note', title: '提示', text: '同一学校不同项目 deadline 可能不同，逐项目核对 portal。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Timeline set two covers rolling admissions and multiple rounds: EA/ED/RD, scholarship cuts, visa buffer.' },
      { type: 'list', title: 'Round Types', items: ['ED/EA: often November; binding ED needs care', 'RD: mostly January; some December or February', 'Rolling: earlier is better; closes when full', 'Scholarship: may precede program deadline'] },
      { type: 'template', title: 'Personal Deadline Table', lines: ['Official: ___', 'Internal (-7d): ___', 'Materials ready (-14d): ___', 'Recommender reminder (-21d): ___'] },
      { type: 'note', title: 'Tip', text: 'Deadlines differ by program within one university—check each portal.' }
    ]}
  },

  'guide-interview': {
    zh: { sections: [
      { type: 'paragraph', text: 'Admission interview 可能是 alumni、faculty 或 Kira 视频。准备 STAR 故事、Why program、以及 2–3 个 thoughtful questions。' },
      { type: 'list', title: '高频问题', items: ['Walk me through your resume / Why this program?', 'Tell me about a challenge you overcame', 'What will you contribute to the cohort?', 'Where do you see yourself in 5 years?'] },
      { type: 'template', title: 'STAR 准备', lines: ['Situation: ___', 'Task: ___', 'Action: ___', 'Result: ___'] },
      { type: 'note', title: '提示', text: '视频面试检查光线、背景、网络；提前 10 分钟进入 waiting room。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Admission interviews may be alumni, faculty, or Kira video. Prepare STAR stories, why program, and 2–3 thoughtful questions.' },
      { type: 'list', title: 'Common Questions', items: ['Walk through resume / Why this program?', 'Challenge overcome', 'Cohort contribution', 'Five-year vision'] },
      { type: 'template', title: 'STAR Prep', lines: ['Situation: ___', 'Task: ___', 'Action: ___', 'Result: ___'] },
      { type: 'note', title: 'Tip', text: 'Video: check lighting, background, network; join waiting room ten minutes early.' }
    ]}
  },

  'guide-funding': {
    zh: { sections: [
      { type: 'paragraph', text: 'Funding 包括 fellowship、TA/RA、external scholarships、校内 merit aid。Research 项目 funding 常与 admission 绑定；professional 项目多 merit-based。' },
      { type: 'list', title: '资金类型', items: ['Fellowship：通常 competitive，需 strong profile', 'TA/RA：PhD 常见，含 tuition + stipend', 'External：CSC、Fulbright、行业奖学金', 'Merit aid：MBA/LLM 部分项目'] },
      { type: 'template', title: 'Funding 追踪', lines: ['Source: ___', 'Deadline: ___', 'Requirements: ___', 'Status: applied / pending / awarded'] },
      { type: 'note', title: '提示', text: '勿仅依赖单一来源；parallel 申请 external + 询问 program financial aid office。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Funding spans fellowships, TA/RA, external awards, and merit aid. Research funding often ties to admission; professional programs lean merit-based.' },
      { type: 'list', title: 'Funding Types', items: ['Fellowship: competitive, strong profile', 'TA/RA: common in PhD, tuition + stipend', 'External: CSC, Fulbright, industry awards', 'Merit aid: some MBA/LLM programs'] },
      { type: 'template', title: 'Funding Tracker', lines: ['Source: ___', 'Deadline: ___', 'Requirements: ___', 'Status: applied / pending / awarded'] },
      { type: 'note', title: 'Tip', text: 'Do not rely on one source—parallel external apps and ask the financial aid office.' }
    ]}
  },

  'guide-dorm': {
    zh: { sections: [
      { type: 'paragraph', text: '海外宿舍申请通常与 admission 分开，deadline 可能在 summer。了解房型、meal plan、off-campus 政策。' },
      { type: 'list', title: '申请要点', items: ['On-campus housing application deadline', 'Roommate matching survey 诚实填写作息', 'Meal plan 等级与 dietary needs', 'Off-campus：合同、通勤、安全区域'] },
      { type: 'list', title: '入住准备', items: ['Bed size（常 Twin XL）', 'Kitchen / bath shared 规则', 'Move-in day 时段预约'] },
      { type: 'note', title: '提示', text: '热门城市 off-campus 应提前 2–3 个月找房，尤其 8 月入学季。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Housing applications are often separate from admission, with summer deadlines. Learn room types, meal plans, and off-campus rules.' },
      { type: 'list', title: 'Application', items: ['On-campus housing deadline', 'Roommate survey: honest about schedule', 'Meal plan tier and dietary needs', 'Off-campus: lease, commute, safety'] },
      { type: 'list', title: 'Move-In', items: ['Bed size (often Twin XL)', 'Shared kitchen/bath rules', 'Move-in appointment slot'] },
      { type: 'note', title: 'Tip', text: 'In hot markets, start off-campus search 2–3 months ahead, especially August intake.' }
    ]}
  },

  'guide-packing': {
    zh: { sections: [
      { type: 'paragraph', text: '行前打包分三类：必带文件与药品、可在当地购买的生活品、禁止托运/携带物品（各国不同）。' },
      { type: 'list', title: '必带', items: ['护照、I-20/COE、录取信、成绩单原件', 'Prescription 药物 + 英文说明', '少量现金 + 已激活国际信用卡', '转换插头（先查目的地插座类型）'] },
      { type: 'list', title: '可当地买', items: ['床品（除 adapter）、日用品 bulk', '厚衣可抵达后买（减行李）'] },
      { type: 'note', title: '提示', text: '查 airline 行李额度；贵重文件随身 cabin，不托运。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Packing splits into must-carry documents and meds, buy-locally items, and prohibited goods (varies by country).' },
      { type: 'list', title: 'Must Carry', items: ['Passport, I-20/COE, admission letter, transcripts', 'Prescription meds + English note', 'Some cash + active international card', 'Plug adapter (check socket type)'] },
      { type: 'list', title: 'Buy Locally', items: ['Bedding bulk, daily consumables', 'Heavy winter gear after arrival'] },
      { type: 'note', title: 'Tip', text: 'Check baggage allowance; keep vital documents in cabin baggage.' }
    ]}
  },

  'guide-freshman': {
    zh: { sections: [
      { type: 'paragraph', text: '大一留学预备从背景积累开始：GPA 基础、英语能力、探索兴趣方向、参与 1–2 个可持续项目而非简历堆砌。' },
      { type: 'list', title: '大一 checklist', items: ['保持 GPA，了解 major 与先修课', '开始系统英语输入（阅读+听力）', '加入 1 个 club / project 深度参与', 'Summer：实习、科研或语言考试首考规划'] },
      { type: 'template', title: '四 year 粗规划', lines: ['Y1: explore + GPA + English', 'Y2: depth project + first test', 'Y3: leadership + application prep', 'Y4: apply + finalize'] },
      { type: 'note', title: '提示', text: '早规划不等于早焦虑；重点是 direction 与 consistent effort。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Freshman prep builds background: GPA foundation, English, exploring interests, one or two sustained projects—not resume stuffing.' },
      { type: 'list', title: 'Year-One Checklist', items: ['Protect GPA; learn major prerequisites', 'Systematic English input (reading + listening)', 'One club/project with depth', 'Summer: intern, research, or first test plan'] },
      { type: 'template', title: 'Rough Four-Year Map', lines: ['Y1: explore + GPA + English', 'Y2: depth project + first test', 'Y3: leadership + application prep', 'Y4: apply + finalize'] },
      { type: 'note', title: 'Tip', text: 'Early planning is direction and consistency—not early anxiety.' }
    ]}
  },

  'guide-gpa': {
    zh: { sections: [
      { type: 'paragraph', text: 'GPA 规划需 balance 均分与先修课：目标项目要求的 math、stats、programming 等 prerequisite 有时比 overall GPA 更关键。' },
      { type: 'list', title: '选课策略', items: ['查 target program prerequisite list', 'Hard course 分散学期，避免 single semester 崩盘', 'Optional P/F 政策谨慎使用（部分学校不认）', 'Major GPA vs cumulative：网申如实填写'] },
      { type: 'template', title: 'Prerequisite 追踪', lines: ['Required course: ___', 'Taken: Y/N Semester: ___', 'Grade: ___', 'Alternative accepted: ___'] },
      { type: 'note', title: '提示', text: '使用 Aurora Vine GPA 换算了解 4.0/100 对应，避免自我误判竞争力。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'GPA planning balances overall average with prerequisites—math, stats, programming requirements can outweigh cumulative GPA.' },
      { type: 'list', title: 'Course Strategy', items: ['Check target prerequisite lists', 'Spread hard courses across terms', 'Use P/F cautiously if schools ignore it', 'Report major vs cumulative honestly'] },
      { type: 'template', title: 'Prerequisite Tracker', lines: ['Required: ___', 'Taken: Y/N Term: ___', 'Grade: ___', 'Alternative: ___'] },
      { type: 'note', title: 'Tip', text: 'Use GPA conversion tools to judge 4.0 vs 100-scale competitiveness accurately.' }
    ]}
  },

  'guide-recommend': {
    zh: { sections: [
      { type: 'paragraph', text: '与推荐人沟通应提前 4–6 周：说明项目、deadline、提交方式，并提供 one-page 素材摘要。' },
      { type: 'list', title: '沟通步骤', items: ['Email 正式请求 + 为何选 TA', 'Meeting 或 call 15 分钟对齐', '发送素材包 + deadline 日历 invite', 'Deadline 前 1 周 polite reminder', '提交后 thank-you'] },
      { type: 'template', title: '请求邮件', lines: ['Dear Prof. ___,', 'I am applying to [programs] by [date].', 'Would you be willing to write a recommendation?', 'I can share my CV, transcript, and a brief summary of points to highlight.', 'Thank you for considering.', '[Name]'] },
      { type: 'note', title: '提示', text: '同一 recommender 多校提交用统一素材，但 highlight 不同 program fit 若 TA 同意 customize。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Contact recommenders 4–6 weeks ahead: programs, deadlines, submission method, and a one-page summary package.' },
      { type: 'list', title: 'Steps', items: ['Formal email + why them', '15-minute alignment call', 'Send package + calendar deadline', 'Reminder one week before', 'Thank-you after submission'] },
      { type: 'template', title: 'Request Email', lines: ['Dear Prof. ___,', 'I am applying to [programs] by [date].', 'Would you write a recommendation?', 'I can share CV, transcript, and highlight summary.', 'Thank you for considering.', '[Name]'] },
      { type: 'note', title: 'Tip', text: 'One recommender for many schools can reuse a package; customize highlights if they agree.' }
    ]}
  },

  'guide-waiver': {
    zh: { sections: [
      { type: 'paragraph', text: '语言/GRE 豁免政策因校而异。常见：英语国家学位、GPA 门槛、工作年限。需逐校查 admission FAQ 或 email admission。' },
      { type: 'list', title: '查询路径', items: ['Program FAQ → English proficiency / GRE', 'Graduate school general policy', 'Email admission with profile 摘要询问', '记录回复存档供申请引用'] },
      { type: 'list', title: 'GRE waiver 常见条件', items: ['高 GPA + 定量课程', '已有 graduate degree', '多年相关工作经验'] },
      { type: 'note', title: '提示', text: '豁免批准常以 written confirmation 为准，口头 unofficial 信息不足。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Language and GRE waivers vary by school—English-medium degrees, GPA thresholds, work experience. Check each FAQ or email admissions.' },
      { type: 'list', title: 'Lookup Path', items: ['Program FAQ → English / GRE', 'Graduate school policy', 'Email admissions with profile summary', 'Archive replies for applications'] },
      { type: 'list', title: 'Common GRE Waiver Triggers', items: ['High GPA + quant coursework', 'Existing graduate degree', 'Years of relevant work'] },
      { type: 'note', title: 'Tip', text: 'Written waiver confirmation beats unofficial verbal hints.' }
    ]}
  },

  'guide-budget': {
    zh: { sections: [
      { type: 'paragraph', text: '留学预算 = 学费 + 生活费 + 保险 + 签证/机票 + 应急。按目标国家与城市 tier 估算，留 10–15% buffer。' },
      { type: 'list', title: '费用项（年）', items: ['Tuition：查 program 官网', 'Living：housing, food, transport（city 差异大）', 'Health insurance：学校 plan 或 private', 'Books, supplies, personal', 'One-time：visa, flight, setup'] },
      { type: 'template', title: 'Budget 表', lines: ['Item | Low est. | High est. | Notes', 'Tuition | ___ | ___ |', 'Housing | ___ | ___ |', 'Total year 1 | ___ | ___ | + 10% buffer'] },
      { type: 'note', title: '提示', text: 'Funding offer 需算清 tuition waiver 是否含 fees；stipend 是否税前。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Budget = tuition + living + insurance + visa/flight + emergency. Estimate by country and city tier; add 10–15% buffer.' },
      { type: 'list', title: 'Annual Items', items: ['Tuition: program website', 'Living: housing, food, transport', 'Health insurance: school or private', 'Books and personal', 'One-time: visa, flight, setup'] },
      { type: 'template', title: 'Budget Sheet', lines: ['Item | Low | High | Notes', 'Tuition | ___ | ___ |', 'Housing | ___ | ___ |', 'Year 1 total | ___ | ___ | + 10% buffer'] },
      { type: 'note', title: 'Tip', text: 'Clarify whether tuition waiver covers fees and whether stipend is pre-tax.' }
    ]}
  },

  'guide-culture': {
    zh: { sections: [
      { type: 'paragraph', text: '跨文化适应包括 academic culture（class participation、office hour）与 daily life（bank, healthcare, social norms）。' },
      { type: 'list', title: '学术文化', items: ['主动提问和 discussion 常占成绩', 'Office hour 是正常 learning 渠道', 'Academic integrity 严格（citation, collaboration 规则）'] },
      { type: 'list', title: '生活适应', items: ['Opening bank account + phone plan 第一周', 'Campus health / insurance 使用方式', 'Join 1–2 communities 缓解 isolation'] },
      { type: 'note', title: '提示', text: 'Culture shock 正常；school international office 通常有 orientation 与 counseling。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Cross-cultural adaptation covers academic culture (participation, office hours) and daily life (banking, healthcare, social norms).' },
      { type: 'list', title: 'Academic Culture', items: ['Participation and discussion often graded', 'Office hours are normal learning channels', 'Strict academic integrity on citation and collaboration'] },
      { type: 'list', title: 'Daily Life', items: ['Bank and phone in week one', 'Campus health and insurance use', 'Join 1–2 communities against isolation'] },
      { type: 'note', title: 'Tip', text: 'Culture shock is normal—use international office orientation and counseling.' }
    ]}
  },

  'guide-alumni': {
    zh: { sections: [
      { type: 'paragraph', text: '校友网络用于了解 program 真实体验、内推、mentorship。LinkedIn 与 school alumni portal 是主要入口。' },
      { type: 'list', title: '利用方式', items: ['LinkedIn：filter school + industry', 'Alumni events / webinar 参与', 'Informational interview 15–20 分钟', '长期维护：节日问候、分享进展'] },
      { type: 'template', title: 'LinkedIn 消息', lines: ['Hi [Name], I am an applicant/admit to [Program].', 'I noticed your path in [field] and would value 15 minutes of advice on [specific topic].', 'Happy to work around your schedule. Thank you!'] },
      { type: 'note', title: '提示', text: 'Networking 是 mutual value；准备具体 question，而非 generic “pick your brain”。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Alumni networks reveal program reality, referrals, and mentorship. LinkedIn and school alumni portals are primary entry points.' },
      { type: 'list', title: 'How to Use', items: ['LinkedIn: filter by school and industry', 'Attend alumni events and webinars', 'Informational interviews 15–20 minutes', 'Maintain ties: updates and thanks'] },
      { type: 'template', title: 'LinkedIn Message', lines: ['Hi [Name], I am applying/admitted to [Program].', 'I admire your path in [field] and would value 15 minutes on [specific topic].', 'Happy to work around your schedule. Thank you!'] },
      { type: 'note', title: 'Tip', text: 'Networking is mutual—ask specific questions, not vague “pick your brain.”' }
    ]}
  }
}
