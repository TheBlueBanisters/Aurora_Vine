/** PPT 资源条目正文集合（除 ppt-defense / ppt-application 主入口外的其它条目） */

export const PPT_EXTRA_CONTENT = {
  'ppt-defense-2': {
    zh: { sections: [
      { type: 'paragraph', text: '答辩 PPT 第二套模板侧重 Q&A 准备与 defense 节奏：正文 15–20 分钟，留 10 分钟提问。每页 slide 对应 1–2 分钟讲解。' },
      { type: 'list', title: '答辩页序（扩展）', items: ['Outline + research question', 'Literature gap', 'Method + data', 'Results (2–3 slides max)', 'Limitations + future work', 'Backup slides for tough questions'] },
      { type: 'template', title: 'Q&A backup slide', lines: ['Anticipated question: ___', 'Short answer: ___', 'Supporting figure / table: ___'] },
      { type: 'note', title: '提示', text: 'Backup slides 不计入主时间，但需编号清楚便于快速跳转。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'This defense deck adds Q&A prep and pacing: 15–20 minutes of content, ~10 for questions. Budget 1–2 minutes per slide.' },
      { type: 'list', title: 'Extended Order', items: ['Outline + research question', 'Literature gap', 'Method + data', 'Results (2–3 slides max)', 'Limitations + future work', 'Backup slides for tough questions'] },
      { type: 'template', title: 'Q&A Backup', lines: ['Anticipated question: ___', 'Short answer: ___', 'Supporting figure / table: ___'] },
      { type: 'note', title: 'Tip', text: 'Backup slides sit outside main timing—number them for quick jump.' }
    ]}
  },

  'ppt-portfolio': {
    zh: { sections: [
      { type: 'paragraph', text: 'Portfolio 展示 PPT 用于设计、建筑、交互等申请，结构为：问题 → 过程 → 成果 → 反思。' },
      { type: 'list', title: '单项目页', items: ['Project title + your role + timeline', 'Problem / user need', 'Process sketches or wireframes', 'Final deliverable + metrics or feedback'] },
      { type: 'template', title: 'Portfolio deck 顺序', lines: ['Intro: who you are + design focus', 'Project 1 (3–4 slides)', 'Project 2 (3–4 slides)', 'Project 3 (optional)', 'Closing: contact + portfolio URL'] },
      { type: 'note', title: '提示', text: '视觉为主，文字为辅；确保 projector 下对比度足够。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Portfolio decks for design, architecture, or UX applications follow problem → process → outcome → reflection.' },
      { type: 'list', title: 'Per-Project Slides', items: ['Title + role + timeline', 'Problem / user need', 'Process sketches or wireframes', 'Final deliverable + metrics or feedback'] },
      { type: 'template', title: 'Deck Order', lines: ['Intro: who you are + design focus', 'Project 1 (3–4 slides)', 'Project 2 (3–4 slides)', 'Project 3 (optional)', 'Closing: contact + portfolio URL'] },
      { type: 'note', title: 'Tip', text: 'Visual-first, text-second; check contrast on projectors.' }
    ]}
  },

  'ppt-portfolio-2': {
    zh: { sections: [
      { type: 'paragraph', text: 'Portfolio 第二套强调 before/after 对比与 design rationale，适合改版、 rebranding 类项目。' },
      { type: 'list', title: '对比页设计', items: ['Left: before / old version', 'Right: after / new version', 'Caption: design decision + user impact'] },
      { type: 'template', title: 'Rationale slide', lines: ['Constraint: ___', 'Design choice: ___', 'Trade-off considered: ___', 'Outcome: ___'] },
      { type: 'note', title: '提示', text: '说明“为何这样改”比展示漂亮终稿更能体现 design thinking。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Portfolio set two stresses before/after comparisons and design rationale—ideal for redesign or rebranding work.' },
      { type: 'list', title: 'Comparison Slide', items: ['Left: before / old version', 'Right: after / new version', 'Caption: decision + user impact'] },
      { type: 'template', title: 'Rationale Slide', lines: ['Constraint: ___', 'Design choice: ___', 'Trade-off: ___', 'Outcome: ___'] },
      { type: 'note', title: 'Tip', text: 'Explaining why you changed beats showing only pretty finals.' }
    ]}
  },

  'ppt-report': {
    zh: { sections: [
      { type: 'paragraph', text: '课程 report 展示 PPT 对齐 written report 结构，但每页只保留 report 中的一个 key finding。' },
      { type: 'list', title: 'Report → Slide 映射', items: ['Introduction → 1 slide background', 'Methods → 1 slide flowchart', 'Results → 2–3 slides charts', 'Discussion → 1 slide implications', 'Conclusion → 1 slide takeaways'] },
      { type: 'note', title: '提示', text: '图表从 report 导出矢量图，避免 screenshot 模糊。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Course report slides mirror the written report but one key finding per slide.' },
      { type: 'list', title: 'Report → Slide Map', items: ['Introduction → 1 background slide', 'Methods → 1 flowchart', 'Results → 2–3 chart slides', 'Discussion → 1 implications slide', 'Conclusion → 1 takeaways slide'] },
      { type: 'note', title: 'Tip', text: 'Export vector charts from the report—avoid blurry screenshots.' }
    ]}
  },

  'ppt-seminar': {
    zh: { sections: [
      { type: 'paragraph', text: 'Seminar 汇报 PPT 面向同领域听众，可略增 technical depth，仍控制每页一个 message。' },
      { type: 'list', title: 'Seminar 特点', items: ['可含 1 页 related work 对比表', 'Method 页可放 equation 或 algorithm box', '留 1 页 open questions for discussion'] },
      { type: 'template', title: 'Discussion slide', lines: ['Open question 1: ___', 'Open question 2: ___', 'Collaboration / feedback welcome on ___'] },
      { type: 'note', title: '提示', text: 'Seminar 时间常 30–45 分钟，slide 数约 25–35，含 appendix。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Seminar decks assume a specialist audience—slightly more technical depth, still one message per slide.' },
      { type: 'list', title: 'Seminar Traits', items: ['One related-work comparison slide', 'Method slide may include equation or algorithm box', 'One open-questions slide for discussion'] },
      { type: 'template', title: 'Discussion Slide', lines: ['Open question 1: ___', 'Open question 2: ___', 'Feedback welcome on ___'] },
      { type: 'note', title: 'Tip', text: 'Typical seminar: 30–45 minutes, ~25–35 slides including appendix.' }
    ]}
  },

  'ppt-thesis': {
    zh: { sections: [
      { type: 'paragraph', text: '论文答辩 deck 与 thesis 章节对应：Introduction, Literature, Method, Results, Discussion, Conclusion。' },
      { type: 'template', title: '章节映射', lines: ['Ch1 Intro → 2 slides', 'Ch2 Lit review → 2–3 slides (gap focus)', 'Ch3 Method → 2 slides', 'Ch4 Results → 3–4 slides', 'Ch5 Discussion + Conclusion → 2 slides'] },
      { type: 'list', title: '答辩技巧', items: ['Title 写 conclusion 非 topic', 'Limitations 主动讲，显 mature', 'Future work 与 committee 兴趣衔接'] },
      { type: 'note', title: '提示', text: '与 advisor 预演 2 次，记录 committee 常问 5 题做 backup slides。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Thesis defense decks map to chapters: Introduction, Literature, Method, Results, Discussion, Conclusion.' },
      { type: 'template', title: 'Chapter Map', lines: ['Ch1 Intro → 2 slides', 'Ch2 Lit review → 2–3 slides (gap)', 'Ch3 Method → 2 slides', 'Ch4 Results → 3–4 slides', 'Ch5 Discussion + Conclusion → 2 slides'] },
      { type: 'list', title: 'Defense Tips', items: ['Titles state conclusions', 'Proactively discuss limitations', 'Future work links to committee interests'] },
      { type: 'note', title: 'Tip', text: 'Rehearse twice with advisor; build backup slides for top five questions.' }
    ]}
  },

  'ppt-group': {
    zh: { sections: [
      { type: 'paragraph', text: '小组汇报需 division of work slide 与 smooth handoff。每人 segment 明确，transition slide 标明下一 speaker。' },
      { type: 'list', title: '必备页', items: ['Team intro + roles', 'Agenda with speaker names', 'Section dividers between speakers', 'Unified Q&A slide at end'] },
      { type: 'template', title: 'Handoff line', lines: ['That covers [topic]. Next, [Name] will discuss [next topic].'] },
      { type: 'note', title: '提示', text: '统一 template 字体配色；一人负责 master slide 避免风格割裂。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Group presentations need a division-of-work slide and smooth handoffs. Label speakers on agenda and section dividers.' },
      { type: 'list', title: 'Must-Have Slides', items: ['Team intro + roles', 'Agenda with speaker names', 'Section dividers', 'Unified Q&A at end'] },
      { type: 'template', title: 'Handoff', lines: ['That covers [topic]. Next, [Name] will discuss [next topic].'] },
      { type: 'note', title: 'Tip', text: 'One person owns the master template for consistent fonts and colors.' }
    ]}
  },

  'ppt-data': {
    zh: { sections: [
      { type: 'paragraph', text: '数据可视化 PPT 选择 chart type 匹配 data story：趋势用 line，比较用 bar，占比用 stacked bar（慎用 pie）。' },
      { type: 'list', title: '图表选择', items: ['Trend over time → line chart', 'Compare categories → bar chart', 'Part of whole → stacked bar (≤5 segments)', 'Relationship → scatter plot'] },
      { type: 'list', title: '配色', items: ['色盲友好：蓝橙对比，避免红绿 alone', 'Highlight 关键 series 用深色，其余 gray', 'Slide 背景浅灰或白，chart 区留白'] },
      { type: 'note', title: '提示', text: '每 chart 一句 takeaway 作 slide title，非 “Figure 1”。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Data slides match chart type to story: line for trends, bar for comparisons, stacked bar for parts (use pie sparingly).' },
      { type: 'list', title: 'Chart Choice', items: ['Trend → line', 'Compare categories → bar', 'Part of whole → stacked bar (≤5 segments)', 'Relationship → scatter'] },
      { type: 'list', title: 'Color', items: ['Color-blind safe: blue-orange, not red-green alone', 'Highlight key series; gray the rest', 'Light slide background; chart margin'] },
      { type: 'note', title: 'Tip', text: 'Chart slide title = takeaway, not “Figure 1.”' }
    ]}
  },

  'ppt-interview': {
    zh: { sections: [
      { type: 'paragraph', text: '5 分钟面试展示 PPT 约 5–7 页：Who you are → 2 projects → Why us → Thank you。' },
      { type: 'template', title: '5 分钟结构', lines: ['Slide 1: Name + 1-line hook (30s)', 'Slide 2–3: Project highlights (2 min)', 'Slide 4: Skills matrix (1 min)', 'Slide 5: Program fit (1 min)', 'Slide 6: Thank you + questions (30s)'] },
      { type: 'note', title: '提示', text: '预演计时；留 1 分钟给 committee 打断提问仍不超 5 分钟。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Five-minute interview decks run ~5–7 slides: Who you are → two projects → why us → thank you.' },
      { type: 'template', title: 'Five-Minute Map', lines: ['Slide 1: Name + hook (30s)', 'Slides 2–3: Projects (2 min)', 'Slide 4: Skills (1 min)', 'Slide 5: Fit (1 min)', 'Slide 6: Thanks + questions (30s)'] },
      { type: 'note', title: 'Tip', text: 'Rehearse with timer; leave buffer for interruptions.' }
    ]}
  },

  'ppt-poster': {
    zh: { sections: [
      { type: 'paragraph', text: 'Poster 转 oral 报告时，按 poster 栏目重组 slide：Background → Method → Result → Conclusion，删除 poster 上过小字体细节。' },
      { type: 'list', title: '转换步骤', items: ['每 poster section → 1–2 slides', '放大关键 figure 占半页', 'Oral 补充 poster 无法展开的 nuance'] },
      { type: 'note', title: '提示', text: 'Conference poster session 常 3 分钟 lightning talk—控制在 3–4 slides。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Converting posters to talks: map sections to slides—Background, Method, Result, Conclusion—and drop unreadable fine print.' },
      { type: 'list', title: 'Conversion Steps', items: ['Each poster section → 1–2 slides', 'Enlarge key figures to half slide', 'Orally add nuance not on poster'] },
      { type: 'note', title: 'Tip', text: 'Lightning talks often allow 3 minutes—target 3–4 slides.' }
    ]}
  },

  'ppt-minimal': {
    zh: { sections: [
      { type: 'paragraph', text: '极简 PPT：大量留白、单一 sans-serif 字体、标题 32–36 pt、正文 24–28 pt、每页不超过 30 词。' },
      { type: 'list', title: '层级规范', items: ['H1 slide title: 36 pt bold', 'H2 section: 28 pt', 'Body: 24 pt, max 3 bullets', 'Margin: ≥10% 页边'] },
      { type: 'note', title: '提示', text: 'Minimal 不等于 empty—每页仍有一个 clear takeaway。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Minimal slides: generous whitespace, one sans-serif family, titles 32–36 pt, body 24–28 pt, ≤30 words per slide.' },
      { type: 'list', title: 'Hierarchy', items: ['Title: 36 pt bold', 'Section: 28 pt', 'Body: 24 pt, max 3 bullets', 'Margins ≥10%'] },
      { type: 'note', title: 'Tip', text: 'Minimal is not empty—each slide still needs one takeaway.' }
    ]}
  },

  'ppt-animation': {
    zh: { sections: [
      { type: 'paragraph', text: '学术 PPT 动画宜少宜慢：仅用于 reveal complex diagram 步骤或 build list，避免 flashy 转场。' },
      { type: 'list', title: '推荐用法', items: ['Appear：逐步展示流程图步骤', 'Wipe：对比 before/after（慢速）', '避免：随机 fly-in、spin、sound effects'] },
      { type: 'list', title: '原则', items: ['Animation 服务 comprehension 非 decoration', 'Export PDF 版本供无 animation 场合', 'Rehearse 点击节奏，避免 live 卡顿'] },
      { type: 'note', title: '提示', text: '线上答辩优先 static slide，animation 易在 screen share 中出问题。' }
    ]},
    en: { sections: [
      { type: 'paragraph', text: 'Academic animation should be sparse and slow—reveal diagram steps or build lists, not flashy transitions.' },
      { type: 'list', title: 'Good Uses', items: ['Appear: step through flowchart', 'Wipe: slow before/after', 'Avoid: random fly-in, spin, sounds'] },
      { type: 'list', title: 'Principles', items: ['Animation serves comprehension', 'Export static PDF backup', 'Rehearse click cadence'] },
      { type: 'note', title: 'Tip', text: 'Online defenses favor static slides—animations often break in screen share.' }
    ]}
  }
}
