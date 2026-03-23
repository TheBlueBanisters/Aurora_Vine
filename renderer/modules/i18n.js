import { LANG_KEY } from './state.js'

const translations = {
  // ── Landing Page ──
  'landing.authBtn': { zh: '登录 / 注册 / 游客', en: 'Log In / Register / Guest' },
  'landing.title': { zh: '极光藤 · Aurora Vine', en: 'Aurora Vine' },
  'landing.subtitle': { zh: '— 让留学规划更清晰', en: '— A Clearer Path to Studying Abroad' },
  'landing.introZh': {
    zh: 'Aurora Vine 是一款为留学申请者设计的规划工具，致力于帮助每一位正在准备申请的学生更从容地整理信息、探索院校，并逐步构建属于自己的申请路径。在这里，你可以记录和管理自己的学术背景与标化成绩，获得定校建议与申请方向参考；浏览世界各地的大学信息，了解院校环境并建立自己的目标院校列表；同时通过留学时间规划与每日打卡功能，将长期目标拆解为清晰可执行的步骤。Aurora Vine 还整合了院校数据库、真实申请案例、留学资源与交流社区，帮助你在信息纷繁的申请过程中保持方向与节奏。我们希望 Aurora Vine 能成为你留学旅程中的一个安静而可靠的伙伴，陪伴你从最初的探索，到最终抵达理想的校园。',
    en: 'Aurora Vine is a planning tool designed for students preparing for international study. It helps applicants organize their information, explore universities, and gradually build a clear application path. Within Aurora Vine, you can record and manage your academic background and test scores, receive guidance for school selection, and explore universities around the world while building your own list of target institutions. With integrated study planning timelines and daily progress tracking, long-term goals become clear and manageable steps. Aurora Vine also brings together a university database, real application cases, study resources, and a community for discussion, helping you stay informed and focused throughout the complex application journey. Our hope is that Aurora Vine becomes a quiet and reliable companion on your path — supporting you from the first stage of exploration all the way to your arrival at the campus you aspire to join.'
  },

  // ── Auth Modal ──
  'auth.login': { zh: '登录', en: 'Log In' },
  'auth.register': { zh: '注册', en: 'Register' },
  'auth.email': { zh: '邮箱', en: 'Email' },
  'auth.password': { zh: '密码', en: 'Password' },
  'auth.confirmPassword': { zh: '确认密码', en: 'Confirm Password' },
  'auth.nickname': { zh: '昵称', en: 'Nickname' },
  'auth.emailPlaceholder': { zh: '请输入邮箱地址', en: 'Enter your email' },
  'auth.passwordPlaceholder': { zh: '请输入密码', en: 'Enter your password' },
  'auth.nicknamePlaceholder': { zh: '选填，默认取邮箱前缀', en: 'Optional, defaults to email prefix' },
  'auth.passwordMinPlaceholder': { zh: '至少 6 位密码', en: 'At least 6 characters' },
  'auth.passwordConfirmPlaceholder': { zh: '请再次输入密码', en: 'Re-enter your password' },
  'auth.loginBtn': { zh: '登录', en: 'Log In' },
  'auth.registerBtn': { zh: '注册并进入', en: 'Register & Enter' },
  'auth.or': { zh: '或', en: 'or' },
  'auth.guestMode': { zh: '游客模式', en: 'Guest Mode' },
  'auth.enterGuestFail': { zh: '进入游客模式失败', en: 'Failed to enter guest mode' },
  'auth.enteredGuest': { zh: '已进入游客模式', en: 'Entered guest mode' },
  'auth.enterEmail': { zh: '请输入邮箱地址', en: 'Please enter your email' },
  'auth.enterPassword': { zh: '请输入密码', en: 'Please enter your password' },
  'auth.loginFail': { zh: '登录失败，请稍后重试', en: 'Login failed, please try again later' },
  'auth.loginSuccess': { zh: '登录成功，欢迎回来', en: 'Login successful, welcome back' },
  'auth.passwordMin6': { zh: '密码至少需要 6 位', en: 'Password must be at least 6 characters' },
  'auth.passwordMismatch': { zh: '两次输入的密码不一致', en: 'Passwords do not match' },
  'auth.registerFail': { zh: '注册失败，请稍后重试', en: 'Registration failed, please try again later' },
  'auth.registerSuccess': { zh: '注册成功，欢迎使用', en: 'Registration successful, welcome' },
  'auth.initFail': { zh: '账号状态初始化失败，请重新登录。', en: 'Account initialization failed, please log in again.' },

  // ── Sidebar Nav ──
  'nav.core': { zh: '核心入口', en: 'Core' },
  'nav.schoolPlanning': { zh: '定校规划', en: 'School Planning' },
  'nav.myProfile': { zh: '我的背景', en: 'My Profile' },
  'nav.goals': { zh: '目标推进', en: 'Goals' },
  'nav.targetUniversities': { zh: '目标院校', en: 'Target Universities' },
  'nav.studyPlanning': { zh: '留学规划', en: 'Study Planning' },
  'nav.dailyCheckin': { zh: '每日打卡', en: 'Daily Check-in' },
  'nav.reference': { zh: '信息参考', en: 'Reference' },
  'nav.universityDatabase': { zh: '院校数据库', en: 'University Database' },
  'nav.applicationCases': { zh: '申请案例', en: 'Application Cases' },
  'nav.resourceCommunity': { zh: '资源与社区', en: 'Resources & Community' },
  'nav.resourceCenter': { zh: '资源中心', en: 'Resource Center' },
  'nav.community': { zh: '社区留言', en: 'Community' },
  'nav.tools': { zh: '工具', en: 'Tools' },
  'nav.settings': { zh: '设置', en: 'Settings' },
  'nav.usageGuide': { zh: '使用指南', en: 'Usage Guide' },

  // ── Page Titles ──
  'page.schoolPlanning.title': { zh: '定校规划', en: 'School Planning' },
  'page.myProfile.title': { zh: '我的背景', en: 'My Profile' },
  'page.targetUniversities.title': { zh: '目标院校', en: 'Target Universities' },
  'page.studyPlanning.title': { zh: '留学规划', en: 'Study Planning' },
  'page.dailyCheckin.title': { zh: '每日打卡', en: 'Daily Check-in' },
  'page.universityDatabase.title': { zh: '院校数据库', en: 'University Database' },
  'page.applicationCases.title': { zh: '申请案例', en: 'Application Cases' },
  'page.resourceCenter.title': { zh: '资源中心', en: 'Resource Center' },
  'page.communityMessages.title': { zh: '社区留言', en: 'Community' },
  'page.settings.title': { zh: '设置', en: 'Settings' },

  // ── School Planning Form ──
  'planning.introTitle': { zh: '定校规划 · School Planning', en: 'School Planning' },
  'planning.introTextZh': {
    zh: '欢迎来到 Aurora Vine 的定校规划模块。在这里，我们会根据你的本科背景、成绩情况和语言成绩，为你生成一份个性化的留学定校建议。填写这些信息只需要几分钟，但它将帮助系统更准确地评估你的申请竞争力，并为你推荐合适的目标院校梯度，同时生成一份未来申请规划路径。请尽量如实填写，你随时可以返回修改；准备好了的话，就从下面开始吧。',
    en: 'Welcome to the School Planning module of Aurora Vine. Here, we will generate personalized study-abroad school recommendations based on your undergraduate background, academic performance, and language test scores. Completing this information only takes a few minutes, but it will help the system evaluate your application competitiveness more accurately, recommend appropriate tiers of target universities, and outline a future application roadmap. Please fill in the information as accurately as possible — you can always return to edit it later. When you\'re ready, simply begin below.'
  },
  'planning.sectionBasicInfo': { zh: '基本信息', en: 'Basic Info' },
  'planning.sectionLanguageScores': { zh: '语言与标化成绩', en: 'Language & Test Scores' },
  'planning.sectionResume': { zh: '简历', en: 'Resume' },
  'planning.labelGradYear': { zh: '本科毕业年份', en: 'Undergraduate Graduation Year' },
  'planning.labelTier': { zh: '本科院校层次', en: 'Institution Tier' },
  'planning.labelSchool': { zh: '本科学校名称', en: 'Undergraduate School' },
  'planning.labelMajor': { zh: '本科专业', en: 'Undergraduate Major' },
  'planning.labelGpa': { zh: '绩点', en: 'GPA' },
  'planning.labelGpaPercentile': { zh: '绩点前百分比', en: 'GPA Percentile' },
  'planning.labelIelts': { zh: '雅思', en: 'IELTS' },
  'planning.labelToefl': { zh: '托福', en: 'TOEFL' },
  'planning.labelGre': { zh: 'GRE / GRE 写作', en: 'GRE / GRE Writing' },
  'planning.labelResearchCount': { zh: '科研数量', en: 'Research Count' },
  'planning.labelInternshipCount': { zh: '实习数量', en: 'Internship Count' },
  'planning.labelPaperCount': { zh: '论文数量', en: 'Paper Count' },
  'planning.labelResumeFile': { zh: '简历（选填）', en: 'Resume (Optional)' },
  'planning.select': { zh: '请选择', en: 'Select' },
  'planning.none': { zh: '无', en: 'None' },
  'planning.scale4': { zh: '四分制', en: '4.0 Scale' },
  'planning.scale5': { zh: '五分制', en: '5.0 Scale' },
  'planning.schoolNamePlaceholder': { zh: '请输入学校名称', en: 'Enter school name' },
  'planning.majorPlaceholder': { zh: '请输入专业名称', en: 'Enter major' },
  'planning.submitBtn': { zh: '提交', en: 'Submit' },
  'planning.refillBtn': { zh: '重新填写', en: 'Re-fill' },

  // ── Planning Validation ──
  'planning.err.gradYear': { zh: '请选择本科毕业年份', en: 'Please select graduation year' },
  'planning.err.tier': { zh: '请选择本科院校层次', en: 'Please select institution tier' },
  'planning.err.schoolName': { zh: '请输入本科学校名称', en: 'Please enter school name' },
  'planning.err.major': { zh: '请输入本科专业', en: 'Please enter major' },
  'planning.err.gpa': { zh: '请输入有效绩点', en: 'Please enter a valid GPA' },
  'planning.err.gpa4Range': { zh: '四分制绩点需在0-4之间', en: 'GPA must be between 0–4 for 4.0 scale' },
  'planning.err.gpa5Range': { zh: '五分制绩点需在0-5之间', en: 'GPA must be between 0–5 for 5.0 scale' },
  'planning.err.gpaScale': { zh: '请选择绩点分制', en: 'Please select GPA scale' },
  'planning.err.gpaPercentile': { zh: '请输入0-100之间的数值', en: 'Please enter a value between 0–100' },
  'planning.err.ielts': { zh: '请选择雅思分数或勾选无', en: 'Please select IELTS score or check None' },
  'planning.err.toefl': { zh: '请选择托福分数或勾选无', en: 'Please select TOEFL score or check None' },
  'planning.err.gre': { zh: '请选择GRE分数或勾选无', en: 'Please select GRE score or check None' },
  'planning.err.greWriting': { zh: '请选择GRE写作分数', en: 'Please select GRE Writing score' },

  // ── Score Card ──
  'score.overall': { zh: '综合评分', en: 'Overall Score' },
  'score.lang': { zh: '语言', en: 'Language' },
  'score.bg': { zh: '背景', en: 'Background' },
  'score.school': { zh: '院校', en: 'Institution' },

  // ── My Profile ──
  'profile.empty': { zh: '暂无背景信息', en: 'No profile information yet' },
  'profile.emptyHint': { zh: '请先在定校规划中填写您的学术背景，提交后将在此展示', en: 'Please fill in your academic background in School Planning first' },
  'profile.goPlanning': { zh: '去定校规划填写', en: 'Go to School Planning' },
  'profile.sectionBasicInfo': { zh: '基本信息', en: 'Basic Info' },
  'profile.sectionTestScores': { zh: '标化成绩', en: 'Standardized Test Scores' },
  'profile.sectionStatement': { zh: '个人陈述', en: 'Personal Statement' },
  'profile.refill': { zh: '重新填写定校规划', en: 'Re-fill School Planning' },
  'profile.noTestData': { zh: '暂无标化成绩数据可展示', en: 'No test score data to display' },
  'profile.gradYear': { zh: '本科毕业年份', en: 'Graduation Year' },
  'profile.tier': { zh: '本科院校层次', en: 'Institution Tier' },
  'profile.school': { zh: '本科学校', en: 'School' },
  'profile.major': { zh: '本科专业', en: 'Major' },
  'profile.gpa': { zh: '绩点', en: 'GPA' },
  'profile.gpaPercentile': { zh: '绩点前百分比', en: 'GPA Percentile' },
  'profile.ielts': { zh: '雅思', en: 'IELTS' },
  'profile.toefl': { zh: '托福', en: 'TOEFL' },
  'profile.greWriting': { zh: 'GRE写作', en: 'GRE Writing' },
  'profile.noData': { zh: '无', en: 'N/A' },
  'profile.statementNone': { zh: '无', en: 'None' },

  // ── Target Universities ──
  'target.empty': { zh: '暂无目标院校', en: 'No target universities yet' },
  'target.emptyHint': { zh: '去院校数据库添加你心仪的院校吧', en: 'Add universities from the University Database' },

  // ── Study Planning ──
  'studyPlanning.outlineTitle': { zh: '留学规划大纲', en: 'Planning Outline' },
  'studyPlanning.smartTitle': { zh: '智能留学规划', en: 'Smart Planning' },
  'studyPlanning.customTitle': { zh: '自定义规划', en: 'Custom Planning' },
  'studyPlanning.outlineEmpty': { zh: '暂无规划条目', en: 'No planning entries yet' },
  'studyPlanning.outlineEmptyHint': { zh: '在右侧「自定义规划」中添加规划内容', en: 'Add entries via "Custom Planning" on the right' },
  'studyPlanning.smartComingSoon': { zh: '智能留学规划即将上线', en: 'Smart Planning coming soon' },
  'studyPlanning.smartHint': { zh: 'AI 将根据你的背景自动生成个性化留学规划', en: 'AI will generate a personalized study plan based on your profile' },
  'studyPlanning.customHintZh': { zh: '格式：#标题（必填）、*简介（可选）、[年.月.日-年.月.日]任务内容', en: 'Format: #Title (required), *Description (optional), [YYYY.M.D-YYYY.M.D]Task' },
  'studyPlanning.parseAndAdd': { zh: '解析并添加', en: 'Parse & Add' },
  'studyPlanning.deleteEntry': { zh: '删除该条目', en: 'Delete this entry' },
  'studyPlanning.deleteFail': { zh: '删除失败', en: 'Delete failed' },
  'studyPlanning.deleted': { zh: '已删除该规划条目', en: 'Entry deleted' },
  'studyPlanning.inputEmpty': { zh: '请先输入规划内容', en: 'Please enter planning content first' },
  'studyPlanning.formatError': { zh: '输入内容格式有误：\n', en: 'Format error:\n' },
  'studyPlanning.partialError': { zh: '部分内容格式有误已跳过：\n', en: 'Some entries skipped due to format issues:\n' },
  'studyPlanning.noEntries': { zh: '未识别到有效的规划条目（需以 # 开头）', en: 'No valid entries found (must start with #)' },
  'studyPlanning.saveFail': { zh: '保存失败', en: 'Save failed' },
  'studyPlanning.checkinUnavailable': { zh: '打卡接口不可用', en: 'Check-in API unavailable' },
  'studyPlanning.storageUnavailable': { zh: '存储接口不可用', en: 'Storage API unavailable' },
  'studyPlanning.submitSuccess': { zh: '已添加 {0} 条规划，分发了 {1} 条任务到每日打卡', en: 'Added {0} plan(s), distributed {1} task(s) to daily check-in' },
  'studyPlanning.submitFail': { zh: '操作失败，请稍后重试', en: 'Operation failed, please try again' },

  // ── Daily Check-in ──
  'daily.clearAllTitle': { zh: '确认清空全部日程？', en: 'Clear all schedules?' },
  'daily.clearAllDesc': { zh: '此操作将删除所有日期的全部任务条目，且无法恢复。', en: 'This will permanently delete all tasks across every date.' },
  'daily.cancel': { zh: '取消', en: 'Cancel' },
  'daily.confirmClear': { zh: '确认清空', en: 'Confirm' },
  'daily.clearGlobalLabel': { zh: '清空全部日程', en: 'Clear all schedules' },
  'daily.prevMonth': { zh: '上一月', en: 'Previous month' },
  'daily.nextMonth': { zh: '下一月', en: 'Next month' },
  'daily.weekdays': { zh: ['一', '二', '三', '四', '五', '六', '日'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  'daily.clearDayLabel': { zh: '清空所有任务', en: 'Clear all tasks' },
  'daily.noTasksEn': { zh: 'No tasks today~', en: 'No tasks today~' },
  'daily.noTasksZh': { zh: '今天没有任务~', en: 'No tasks today~' },
  'daily.addTask': { zh: '新建条目', en: 'New Task' },
  'daily.modalTitle': { zh: '新增任务', en: 'New Task' },
  'daily.modalContentLabel': { zh: '任务内容', en: 'Task Content' },
  'daily.modalContentPlaceholder': { zh: '请输入任务内容（可详细一点）', en: 'Enter task details' },
  'daily.modalColorLabel': { zh: '任务颜色', en: 'Task Color' },
  'daily.modalCancel': { zh: '取消', en: 'Cancel' },
  'daily.modalConfirm': { zh: '确认添加', en: 'Confirm' },
  'daily.taskBack': { zh: '返回', en: 'Back' },
  'daily.taskComplete': { zh: '完成', en: 'Done' },
  'daily.taskDelete': { zh: '删除', en: 'Delete' },
  'daily.saveFail': { zh: '保存失败，请稍后重试', en: 'Save failed, please try again' },
  'daily.clearFail': { zh: '清空失败', en: 'Clear failed' },
  'daily.cleared': { zh: '已清空全部日程', en: 'All schedules cleared' },
  'daily.taskEmpty': { zh: '请先填写任务内容', en: 'Please enter task content first' },
  'daily.monthTitle': { zh: '{0}年 {1}月', en: '{1} / {0}' },
  'daily.weekdaysFull': { zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  'daily.dateFmt': { zh: '{0}年{1}月{2}日 {3}', en: '{3}, {1} {2}, {0}' },
  'daily.monthNameShort': { zh: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },

  // ── University Database ──
  'uniDb.searchPlaceholder': { zh: '搜索院校名称、国家或城市', en: 'Search by name, country or city' },
  'uniDb.clearSearch': { zh: '清空搜索', en: 'Clear search' },
  'uniDb.regionFilter': { zh: '地区筛选', en: 'Region' },
  'uniDb.rankingFilter': { zh: '热门榜单', en: 'Ranking Lists' },
  'uniDb.regionAll': { zh: '不限', en: 'All' },
  'uniDb.regionHK': { zh: '中国香港', en: 'Hong Kong' },
  'uniDb.regionSG': { zh: '新加坡', en: 'Singapore' },
  'uniDb.regionUK': { zh: '英国', en: 'UK' },
  'uniDb.regionUS': { zh: '美国', en: 'USA' },
  'uniDb.regionAU': { zh: '澳大利亚', en: 'Australia' },
  'uniDb.regionMY': { zh: '马来西亚', en: 'Malaysia' },
  'uniDb.regionEU': { zh: '欧洲', en: 'Europe' },
  'uniDb.regionOther': { zh: '其他', en: 'Other' },
  'uniDb.rankingQs': { zh: 'QS世界大学排名', en: 'QS World Ranking' },
  'uniDb.rankingTimes': { zh: 'Times英国大学排名', en: 'Times UK Ranking' },
  'uniDb.rankingUsNews': { zh: 'U.S.News美国大学排名', en: 'U.S.News Ranking' },
  'uniDb.comingSoon': { zh: '敬请期待', en: 'Coming Soon' },
  'uniDb.noData': { zh: '无法加载院校数据', en: 'Unable to load university data' },
  'uniDb.noMatch': { zh: '未找到匹配院校', en: 'No matching universities found' },
  'uniDb.noMatchHint': { zh: '请尝试搜索院校名称、国家或城市', en: 'Try searching by name, country or city' },
  'uniDb.pagination': { zh: '第 {0} / {1} 页，共 {2} 所院校', en: 'Page {0} / {1}, {2} universities total' },
  'uniDb.prevPage': { zh: '上一页', en: 'Previous' },
  'uniDb.nextPage': { zh: '下一页', en: 'Next' },
  'uniDb.loadFail': { zh: '加载失败：{0}', en: 'Load failed: {0}' },
  'uniDb.refreshRetry': { zh: '请刷新重试', en: 'Please refresh and retry' },
  'uniDb.locationLabel': { zh: '地区', en: 'Location' },
  'uniDb.favorite': { zh: '收藏', en: 'Favorite' },
  'uniDb.unfavorite': { zh: '取消收藏', en: 'Unfavorite' },

  // ── School Detail ──
  'schoolDetail.back': { zh: '返回', en: 'Back' },
  'schoolDetail.programs': { zh: '专业项目', en: 'Programs' },
  'schoolDetail.programsLoading': { zh: '正在加载该院校的专业数据...', en: 'Loading program data...' },
  'schoolDetail.programsNone': { zh: '暂无专业数据', en: 'No program data available' },
  'schoolDetail.programCount': { zh: '共 {0} 个专业，点击卡片可展开查看培养方向与要求。', en: '{0} programs available. Click a card to view details.' },
  'schoolDetail.programUnnamed': { zh: '未命名专业', en: 'Unnamed Program' },
  'schoolDetail.fieldDuration': { zh: '学制', en: 'Duration' },
  'schoolDetail.fieldLanguage': { zh: '语言要求', en: 'Language Requirement' },
  'schoolDetail.fieldTuition': { zh: '预估学费', en: 'Est. Tuition' },
  'schoolDetail.fieldDifficulty': { zh: '难度系数', en: 'Difficulty' },
  'schoolDetail.tuitionPrefix': { zh: '约 {0}', en: '≈ {0}' },
  'schoolDetail.difficulty': { zh: '难度 {0}/10', en: 'Difficulty {0}/10' },
  'schoolDetail.curriculumCn': { zh: '培养方案简述', en: 'Curriculum Summary (CN)' },
  'schoolDetail.curriculumEn': { zh: 'Curriculum Summary', en: 'Curriculum Summary' },
  'schoolDetail.relatedCases': { zh: '相关案例', en: 'Related Cases' },
  'schoolDetail.relatedCasesLoading': { zh: '正在加载该院校的申请案例...', en: 'Loading related cases...' },
  'schoolDetail.relatedCasesNone': { zh: '暂无相关案例', en: 'No related cases' },
  'schoolDetail.relatedCasesCount': { zh: '已为该院校匹配 {0} 条背景相近案例。', en: 'Matched {0} related case(s) for this university.' },
  'schoolDetail.relatedCasesFail': { zh: '相关案例加载失败', en: 'Failed to load related cases' },
  'schoolDetail.programsFail': { zh: '专业数据加载失败', en: 'Failed to load program data' },
  'schoolDetail.intro': { zh: '院校简介', en: 'School Introduction' },
  'schoolDetail.contact': { zh: '联系方式', en: 'Contact' },
  'schoolDetail.address': { zh: '院校地址', en: 'Address' },
  'schoolDetail.noIntro': { zh: '暂无院校介绍', en: 'No introduction available' },
  'schoolDetail.caseKicker': { zh: '案例 #{0} · {1}', en: 'Case #{0} · {1}' },
  'schoolDetail.admittedProgram': { zh: '录取专业', en: 'Admitted Program' },
  'schoolDetail.offerMark': { zh: '该院校录取项目', en: 'Offer from this university' },
  'schoolDetail.profileScore': { zh: '背景评分', en: 'Profile Score' },
  'schoolDetail.langWeak': { zh: '语言待补强', en: 'Language needs improvement' },
  'schoolDetail.greNone': { zh: 'GRE 未提供', en: 'GRE not provided' },
  'schoolDetail.offerTierMatch': { zh: '匹配', en: 'Match' },

  // ── Application Cases ──
  'cases.searchPlaceholder': { zh: '搜索录取院校、项目或案例标签', en: 'Search by school, program or tags' },
  'cases.tierFilter': { zh: '本科背景', en: 'Undergrad Tier' },
  'cases.moreFilters': { zh: '更多筛选', en: 'More Filters' },
  'cases.tierAll': { zh: '不限', en: 'All' },
  'cases.tierOverseas': { zh: '海本', en: 'Overseas' },
  'cases.tierJoint': { zh: '中外合作', en: 'Joint Program' },
  'cases.tierNon211': { zh: '双非', en: 'Non-211' },
  'cases.gpaAll': { zh: '全部', en: 'All' },
  'cases.gpaHigh': { zh: '高 GPA', en: 'High GPA' },
  'cases.gpaMid': { zh: '中等 GPA', en: 'Mid GPA' },
  'cases.gpaLow': { zh: '低 GPA', en: 'Low GPA' },
  'cases.langAll': { zh: '全部', en: 'All' },
  'cases.langStrong': { zh: '语言强', en: 'Strong Language' },
  'cases.langQualified': { zh: '语言达标', en: 'Qualified' },
  'cases.langPending': { zh: '语言待补强', en: 'Needs Improvement' },
  'cases.bgAll': { zh: '全部', en: 'All' },
  'cases.bgResearch': { zh: '科研强', en: 'Strong Research' },
  'cases.bgInternship': { zh: '实习丰富', en: 'Rich Internship' },
  'cases.bgPaper': { zh: '论文加成', en: 'Paper Bonus' },
  'cases.bgBalanced': { zh: '综合型', en: 'Balanced' },
  'cases.sortLabel': { zh: '排序', en: 'Sort' },
  'cases.sortScore': { zh: '背景强度', en: 'Profile Strength' },
  'cases.sortQs': { zh: '主录取 QS', en: 'Primary QS' },
  'cases.sortGpa': { zh: 'GPA', en: 'GPA' },
  'cases.sortLang': { zh: '语言成绩', en: 'Language Score' },
  'cases.labelGpa': { zh: 'GPA', en: 'GPA' },
  'cases.labelLang': { zh: '语言', en: 'Language' },
  'cases.sampleTitle': { zh: '案例样本库', en: 'Case Library' },
  'cases.sampleText': { zh: '共 {0} 条背景案例，可按本科层次、GPA、语言和软背景进行筛选。', en: '{0} case(s) available. Filter by tier, GPA, language, and soft background.' },
  'cases.pagination': { zh: '第 {0} / {1} 页，共 {2} 条案例', en: 'Page {0} / {1}, {2} case(s) total' },
  'cases.empty': { zh: '暂无申请案例', en: 'No application cases yet' },
  'cases.emptyHint': { zh: '请尝试调整筛选条件，或稍后再试。', en: 'Try adjusting filters or check back later.' },
  'cases.noMatch': { zh: '未找到匹配案例', en: 'No matching cases found' },
  'cases.loading': { zh: '正在加载申请案例...', en: 'Loading application cases...' },
  'cases.loadingHint': { zh: '请稍候，正在整理案例与 offer 数据。', en: 'Please wait while we organize the data.' },
  'cases.loadFail': { zh: '加载失败：{0}', en: 'Load failed: {0}' },
  'cases.viewOffer': { zh: '查看完整 Offer', en: 'View Full Offers' },
  'cases.kicker': { zh: '案例 #{0} · {1}', en: 'Case #{0} · {1}' },
  'cases.profileScore': { zh: '背景评分', en: 'Profile Score' },
  'cases.labelUndergrad': { zh: '本科', en: 'Undergrad' },
  'cases.labelInternship': { zh: '实习', en: 'Internship' },
  'cases.labelResearch': { zh: '科研', en: 'Research' },
  'cases.labelPaper': { zh: '论文', en: 'Paper' },
  'cases.langWeak': { zh: '语言待补强', en: 'Language pending' },
  'cases.greNone': { zh: 'GRE 未提供', en: 'GRE N/A' },
  'cases.schoolPending': { zh: '待分配院校', en: 'School pending' },
  'cases.programPending': { zh: '项目待定', en: 'Program pending' },
  'cases.detailFail': { zh: '读取案例详情失败', en: 'Failed to load case details' },

  // ── Application Case Detail Modal ──
  'caseDetail.overview': { zh: '背景总览', en: 'Profile Overview' },
  'caseDetail.tests': { zh: '标化成绩', en: 'Test Scores' },
  'caseDetail.softBg': { zh: '软背景画像', en: 'Soft Background' },
  'caseDetail.offerList': { zh: 'Offer 列表', en: 'Offer List' },
  'caseDetail.title': { zh: '申请案例详情', en: 'Case Details' },
  'caseDetail.subtitleDefault': { zh: '查看该背景样本对应的多 offer 结果', en: 'View multiple offer results for this profile' },
  'caseDetail.labelTier': { zh: '本科层次', en: 'Undergrad Tier' },
  'caseDetail.labelGpa': { zh: '绩点', en: 'GPA' },
  'caseDetail.labelGpaRank': { zh: '绩点排名', en: 'GPA Rank' },
  'caseDetail.labelPrimarySchool': { zh: '主录取院校', en: 'Primary School' },
  'caseDetail.labelPrimaryProgram': { zh: '主录取项目', en: 'Primary Program' },
  'caseDetail.labelTags': { zh: '案例标签', en: 'Tags' },
  'caseDetail.labelIelts': { zh: '雅思', en: 'IELTS' },
  'caseDetail.labelToefl': { zh: '托福', en: 'TOEFL' },
  'caseDetail.labelGre': { zh: 'GRE', en: 'GRE' },
  'caseDetail.labelGreWriting': { zh: 'GRE写作', en: 'GRE Writing' },
  'caseDetail.labelInternship': { zh: '实习数量', en: 'Internships' },
  'caseDetail.labelResearch': { zh: '科研数量', en: 'Research' },
  'caseDetail.labelPapers': { zh: '论文数量', en: 'Papers' },
  'caseDetail.unitInternship': { zh: '{0} 段', en: '{0}' },
  'caseDetail.unitResearch': { zh: '{0} 项', en: '{0}' },
  'caseDetail.unitPaper': { zh: '{0} 篇', en: '{0}' },
  'caseDetail.primaryBadge': { zh: '主结果', en: 'Primary' },
  'caseDetail.offerTierMatch': { zh: '匹配', en: 'Match' },
  'caseDetail.noLocation': { zh: '地区信息暂缺', en: 'Location info unavailable' },
  'caseDetail.noOffers': { zh: '暂无 offer 信息', en: 'No offer information' },

  // ── Resource Center ──
  'resource.comingSoon': { zh: '资源中心功能即将上线', en: 'Resource Center coming soon' },
  'resource.hint': { zh: '获取留学相关的工具、模板和资料', en: 'Tools, templates and resources for studying abroad' },

  // ── Community Messages ──
  'community.newPost': { zh: '新建帖子', en: 'New Post' },
  'community.loginToPost': { zh: '登录后发帖', en: 'Log in to post' },
  'community.comment': { zh: '评论', en: 'Comment' },
  'community.loginToReply': { zh: '登录后回复', en: 'Log in to reply' },
  'community.authTipAccount': { zh: '当前社区身份：{0}', en: 'Community identity: {0}' },
  'community.authTipGuest': { zh: '游客模式下可浏览社区内容，但不能发帖、回复或删除内容。', en: 'Guests can browse but cannot post, reply or delete content.' },
  'community.postIdentity': { zh: '当前发布身份：{0}', en: 'Posting as: {0}' },
  'community.guestBrowse': { zh: '游客模式下仅可浏览，登录后可发帖和回复', en: 'Guests can only browse. Log in to post and reply.' },
  'community.emptyPosts': { zh: '暂无帖子', en: 'No posts yet' },
  'community.emptyPostsHint': { zh: '点击上方"新建帖子"，发表第一条内容吧', en: 'Click "New Post" above to write the first post' },
  'community.noSupport': { zh: '当前版本不支持社区留言', en: 'Community not supported in this version' },
  'community.pagination': { zh: '第 {0} / {1} 页，共 {2} 条帖子', en: 'Page {0} / {1}, {2} post(s) total' },
  'community.replyCount': { zh: '回复 {0}', en: '{0} replies' },
  'community.postModalTitle': { zh: '新建帖子', en: 'New Post' },
  'community.postTitleLabel': { zh: '标题', en: 'Title' },
  'community.postTitlePlaceholder': { zh: '请输入帖子标题', en: 'Enter post title' },
  'community.postContentLabel': { zh: '帖子内容', en: 'Post Content' },
  'community.postContentPlaceholder': { zh: '请输入帖子内容', en: 'Enter post content' },
  'community.postCancel': { zh: '取消', en: 'Cancel' },
  'community.postSubmit': { zh: '发布帖子', en: 'Publish' },
  'community.replySection': { zh: '回复区', en: 'Replies' },
  'community.deletePost': { zh: '删除帖子', en: 'Delete Post' },
  'community.replySheetTitle': { zh: '评论', en: 'Comment' },
  'community.replyContentLabel': { zh: '回复内容', en: 'Reply Content' },
  'community.replyContentPlaceholder': { zh: '请输入回复内容', en: 'Enter reply content' },
  'community.replyCancel': { zh: '取消', en: 'Cancel' },
  'community.replySubmit': { zh: '发布评论', en: 'Submit Reply' },
  'community.replyTargetAuthor': { zh: '回复对象：{0}', en: 'Replying to: {0}' },
  'community.replyTargetOP': { zh: '回复对象：楼主', en: 'Replying to: OP' },
  'community.replyTA': { zh: '回复TA', en: 'Reply' },
  'community.deleteReply': { zh: '删除', en: 'Delete' },
  'community.noReplies': { zh: '暂无回复，来抢沙发吧~', en: 'No replies yet. Be the first!' },
  'community.guestNoPost': { zh: '游客模式下暂不支持发帖，请先登录或注册账号。', en: 'Guests cannot post. Please log in or register.' },
  'community.guestNoReply': { zh: '游客模式下暂不支持回复，请先登录或注册账号。', en: 'Guests cannot reply. Please log in or register.' },
  'community.loginToPostGate': { zh: '登录后即可绑定社区身份并发布帖子。', en: 'Log in to join the community and post.' },
  'community.loginToReplyGate': { zh: '登录后即可绑定社区身份并参与讨论。', en: 'Log in to join discussions.' },
  'community.titleRequired': { zh: '请填写标题', en: 'Title is required' },
  'community.contentRequired': { zh: '请填写帖子内容', en: 'Content is required' },
  'community.loginRequired': { zh: '请先登录账号后再发帖', en: 'Please log in first' },
  'community.postFail': { zh: '发帖失败，请稍后再试', en: 'Post failed, please try again' },
  'community.postSuccess': { zh: '发帖成功', en: 'Post published' },
  'community.replyEmpty': { zh: '请填写回复内容', en: 'Reply content is required' },
  'community.loginToReplyRequired': { zh: '请先登录账号后再回复', en: 'Please log in before replying' },
  'community.replyFail': { zh: '回复失败，请稍后再试', en: 'Reply failed, please try again' },
  'community.replySuccess': { zh: '回复已发送', en: 'Reply sent' },
  'community.confirmDeletePost': { zh: '确认删除这个帖子及其全部评论吗？', en: 'Delete this post and all its comments?' },
  'community.deletePostFail': { zh: '删除帖子失败，请稍后重试', en: 'Failed to delete post' },
  'community.deletePostSuccess': { zh: '帖子已删除', en: 'Post deleted' },
  'community.confirmDeleteReply': { zh: '确认删除这条评论及其所有子回复吗？', en: 'Delete this comment and all replies?' },
  'community.deleteReplyFail': { zh: '删除评论失败，请稍后重试', en: 'Failed to delete comment' },
  'community.deleteReplySuccess': { zh: '评论已删除', en: 'Comment deleted' },
  'community.detailFail': { zh: '读取帖子详情失败', en: 'Failed to load post details' },
  'community.replyLabel': { zh: '回复', en: 'replied to' },
  'community.anonymousUser': { zh: '匿名用户', en: 'Anonymous' },

  // ── Settings ──
  'settings.nightMode': { zh: '夜间模式', en: 'Night Mode' },
  'settings.language': { zh: '语言选择', en: 'Language' },
  'settings.langHint': { zh: '当前语言为中文 / Current language: Chinese', en: '当前语言为英文 / Current language: English' },
  'settings.langZh': { zh: '中文', en: '中文' },
  'settings.langEn': { zh: 'English', en: 'English' },
  'settings.certify': { zh: '账户认证', en: 'Account Verification' },
  'settings.certified': { zh: '已认证', en: 'Certified' },
  'settings.notCertified': { zh: '未认证', en: 'Not Certified' },
  'settings.certifyPlaceholder': { zh: '请输入邀请码', en: 'Enter invite code' },
  'settings.certifyHint': { zh: '输入邀请码可认证为「认证学长/学姐」', en: 'Enter invite code to get certified' },
  'settings.certifyBtn': { zh: '认证', en: 'Certify' },
  'settings.certifyGuestHint': { zh: '请先登录后使用认证功能', en: 'Please log in first to use certification' },
  'settings.about': { zh: '关于', en: 'About' },
  'settings.aboutVersion': { zh: '当前版本', en: 'Version' },
  'settings.aboutEmail': { zh: '联系邮箱', en: 'Contact Email' },
  'settings.profileTitle': { zh: '个人信息', en: 'Personal Info' },
  'settings.edit': { zh: '编辑', en: 'Edit' },
  'settings.profileNickname': { zh: '昵称', en: 'Nickname' },
  'settings.profileGender': { zh: '性别', en: 'Gender' },
  'settings.profilePhone': { zh: '手机', en: 'Phone' },
  'settings.profileEmail': { zh: '邮箱', en: 'Email' },
  'settings.profileRegion': { zh: '地区', en: 'Region' },
  'settings.nicknamePlaceholder': { zh: '请输入昵称', en: 'Enter nickname' },
  'settings.genderPlaceholder': { zh: '请输入性别', en: 'Enter gender' },
  'settings.phonePlaceholder': { zh: '请输入手机号', en: 'Enter phone number' },
  'settings.emailPlaceholder': { zh: '请输入邮箱地址', en: 'Enter email address' },
  'settings.regionPlaceholder': { zh: '请输入地区', en: 'Enter region' },
  'settings.save': { zh: '保存', en: 'Save' },
  'settings.cancel': { zh: '取消', en: 'Cancel' },
  'settings.login': { zh: '登录 / 注册', en: 'Log In / Register' },
  'settings.switchAccount': { zh: '切换账号', en: 'Switch Account' },
  'settings.logout': { zh: '退出登录', en: 'Log Out' },
  'settings.collapse': { zh: '收起', en: 'Collapse' },
  'settings.viewProfile': { zh: '点击查看个人资料', en: 'View profile' },
  'settings.guestHint': { zh: '当前身份可继续浏览，登录后将绑定到账号', en: 'You can continue browsing. Log in to bind to an account.' },
  'settings.viewEditProfile': { zh: '点击查看并编辑个人信息', en: 'View and edit your profile' },
  'settings.loginGateHint': { zh: '登录或注册后即可把当前使用内容绑定到账号。', en: 'Log in or register to bind your data to an account.' },
  'settings.logoutFail': { zh: '退出登录失败，请稍后重试', en: 'Logout failed, please try again' },
  'settings.logoutSuccess': { zh: '已退出登录', en: 'Logged out' },
  'settings.nickUpdateFail': { zh: '更新昵称失败，请稍后重试', en: 'Failed to update nickname' },
  'settings.avatarFormatError': { zh: '仅支持 JPEG、PNG、WebP 格式', en: 'Only JPEG, PNG, WebP formats are supported' },
  'settings.avatarSizeError': { zh: '图片过大，请选择 500KB 以内的图片', en: 'Image too large, max 500KB' },
  'settings.avatarReadFail': { zh: '图片读取失败', en: 'Failed to read image' },
  'settings.avatarUploadFail': { zh: '头像上传失败', en: 'Avatar upload failed' },
  'settings.avatarUpdated': { zh: '头像已更新', en: 'Avatar updated' },
  'settings.certifyCodeEmpty': { zh: '请输入邀请码', en: 'Please enter invite code' },
  'settings.certifyFail': { zh: '认证失败', en: 'Certification failed' },
  'settings.certifySuccess': { zh: '认证成功', en: 'Certified successfully' },

  // ── Usage Guide ──
  'guide.skip': { zh: '跳过指南，直接开始~', en: 'Skip guide, get started~' },
  'guide.prev': { zh: '上一步', en: 'Previous' },
  'guide.next': { zh: '下一步', en: 'Next' },
  'guide.done': { zh: '完成', en: 'Done' },
  'guide.noMore': { zh: '不再出现', en: 'Don\'t show again' },
  'guide.step.schoolPlanning': { zh: '定校规划', en: 'School Planning' },
  'guide.step.schoolPlanningDesc': { zh: '填写本科背景、成绩和语言，获取留学定校建议与规划路径。', en: 'Fill in your background, grades and language scores to get school recommendations.' },
  'guide.step.myProfile': { zh: '我的背景', en: 'My Profile' },
  'guide.step.myProfileDesc': { zh: '查看已填写的学术背景与标化成绩可视化图表。', en: 'View your academic background and test score visualizations.' },
  'guide.step.targetUniversities': { zh: '目标院校', en: 'Target Universities' },
  'guide.step.targetUniversitiesDesc': { zh: '管理已收藏的目标院校列表。', en: 'Manage your list of favorited target universities.' },
  'guide.step.studyPlanning': { zh: '留学规划', en: 'Study Planning' },
  'guide.step.studyPlanningDesc': { zh: '制定个性化的留学时间线与任务规划。（即将上线）', en: 'Create personalized study abroad timelines and task plans. (Coming soon)' },
  'guide.step.dailyCheckin': { zh: '每日打卡', en: 'Daily Check-in' },
  'guide.step.dailyCheckinDesc': { zh: '记录每日学习任务与完成情况，保持前进动力。', en: 'Track daily study tasks and progress to stay motivated.' },
  'guide.step.universityDatabase': { zh: '院校数据库', en: 'University Database' },
  'guide.step.universityDatabaseDesc': { zh: '浏览院校列表，收藏感兴趣院校并查看详情。', en: 'Browse universities, save favorites and view details.' },
  'guide.step.applicationCases': { zh: '申请案例', en: 'Application Cases' },
  'guide.step.applicationCasesDesc': { zh: '浏览真实的留学申请案例和经验分享。（即将上线）', en: 'Browse real application cases and experiences. (Coming soon)' },
  'guide.step.resourceCenter': { zh: '资源中心', en: 'Resource Center' },
  'guide.step.resourceCenterDesc': { zh: '获取留学相关的工具、模板和资料。（即将上线）', en: 'Access tools, templates and resources. (Coming soon)' },
  'guide.step.communityMessages': { zh: '社区留言', en: 'Community' },
  'guide.step.communityMessagesDesc': { zh: '发帖、回复，与其他留学伙伴交流经验。', en: 'Post, reply, and share experiences with peers.' },
  'guide.step.settings': { zh: '设置', en: 'Settings' },
  'guide.step.settingsDesc': { zh: '切换主题、编辑个人信息、认证、更换头像等。', en: 'Switch themes, edit profile, certify, change avatar, etc.' },
  'guide.step.final': { zh: '开始使用', en: 'Get Started' },
  'guide.step.finalDesc': { zh: '如需再次查看本指南，请点击侧边栏中的「使用指南」。', en: 'To view this guide again, click "Usage Guide" in the sidebar.' },

  // ── State defaults ──
  'state.defaultNickname': { zh: '未设置', en: 'Not Set' },
  'state.defaultGender': { zh: '未公开', en: 'Not Disclosed' },
  'state.defaultPhone': { zh: '未公开', en: 'Not Disclosed' },
  'state.defaultEmail': { zh: '未公开', en: 'Not Disclosed' },
  'state.defaultRegion': { zh: '未公开', en: 'Not Disclosed' },
  'state.auroraUser': { zh: 'Aurora 用户', en: 'Aurora User' },
  'state.guest': { zh: '游客', en: 'Guest' },
  'state.notLoggedIn': { zh: '未登录', en: 'Not Logged In' },
  'state.accountMeta': { zh: '已登录账号', en: 'Logged In' },
  'state.guestMeta': { zh: '当前为游客模式，可继续浏览与填写背景', en: 'Guest mode — you can continue browsing and filling in your background' },
  'state.loginMeta': { zh: '登录后可绑定背景与社区身份', en: 'Log in to bind your profile and community identity' },

  // ── Task color labels ──
  'color.skyBlue': { zh: '天蓝', en: 'Sky Blue' },
  'color.mint': { zh: '薄荷', en: 'Mint' },
  'color.lightYellow': { zh: '淡黄', en: 'Light Yellow' },
  'color.pinkPurple': { zh: '粉紫', en: 'Pink Purple' },
  'color.orange': { zh: '橙色', en: 'Orange' },
  'color.purple': { zh: '紫色', en: 'Purple' },
  'color.teal': { zh: '青绿', en: 'Teal' },
  'color.rose': { zh: '玫红', en: 'Rose' },
  'color.fogBlue': { zh: '雾蓝', en: 'Fog Blue' },

  // ── Month names (for en mode) ──
  'month.1': { zh: '1', en: 'Jan' },
  'month.2': { zh: '2', en: 'Feb' },
  'month.3': { zh: '3', en: 'Mar' },
  'month.4': { zh: '4', en: 'Apr' },
  'month.5': { zh: '5', en: 'May' },
  'month.6': { zh: '6', en: 'Jun' },
  'month.7': { zh: '7', en: 'Jul' },
  'month.8': { zh: '8', en: 'Aug' },
  'month.9': { zh: '9', en: 'Sep' },
  'month.10': { zh: '10', en: 'Oct' },
  'month.11': { zh: '11', en: 'Nov' },
  'month.12': { zh: '12', en: 'Dec' },
}

const langChangeHooks = []

export function getLang() {
  return localStorage.getItem(LANG_KEY) || 'zh'
}

export function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang)
}

export function t(key, ...args) {
  const entry = translations[key]
  if (!entry) return key
  const lang = getLang()
  let text = entry[lang] ?? entry.zh ?? key
  if (typeof text !== 'string') return text
  if (args.length > 0) {
    args.forEach((arg, i) => {
      text = text.replace(new RegExp(`\\{${i}\\}`, 'g'), String(arg))
    })
  }
  return text
}

export function applyLang() {
  const lang = getLang()
  document.documentElement.dataset.lang = lang
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    const val = t(key)
    if (val !== key) el.textContent = val
  })

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder')
    const val = t(key)
    if (val !== key) el.placeholder = val
  })

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title')
    const val = t(key)
    if (val !== key) el.title = val
  })

  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label')
    const val = t(key)
    if (val !== key) el.setAttribute('aria-label', val)
  })
}

export function registerLangChangeHook(fn) {
  langChangeHooks.push(fn)
}

function updateLangHint() {
  const hint = document.getElementById('settings-lang-hint')
  if (hint) hint.textContent = t('settings.langHint')
}

function onLanguageToggle() {
  const toggle = document.getElementById('language-toggle')
  const lang = toggle?.checked ? 'en' : 'zh'
  setLang(lang)
  applyLang()
  updateLangHint()
  langChangeHooks.forEach((fn) => fn())
}

export function initLang() {
  const lang = getLang()
  document.documentElement.dataset.lang = lang
  applyLang()
  updateLangHint()

  const toggle = document.getElementById('language-toggle')
  if (toggle) {
    toggle.checked = lang === 'en'
    toggle.removeEventListener('change', onLanguageToggle)
    toggle.addEventListener('change', onLanguageToggle)
  }
}
