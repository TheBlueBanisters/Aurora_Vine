# Aurora Vine Final Report 大纲

> 依据 `软件实作要求.pdf` 中 Final Report 的建议结构整理。报告建议长度为 20-30 页，使用可读字体，例如 Times New Roman 12pt，单倍行距，单栏排版，包含页码和清晰章节标题。报告中不要直接放源代码；如需说明实现，可使用架构图、流程图、界面截图、数据表、伪代码或关键逻辑描述。

## 封面与前置部分

### Title Page

- 项目名称：Aurora Vine
- 课程名称与代码：JC3510 Intelligent Software Implementation
- 小组编号、组员姓名与学号
- 指导老师或 supervisor 信息
- 提交日期
- GitHub 仓库链接或项目访问方式，如课程允许

### Abstract / Executive Summary

- 用 150-250 词概括项目背景、目标用户、核心问题、系统方案与主要成果。
- 建议突出 Aurora Vine 是一个面向留学申请者的 Electron 桌面应用，整合背景画像、院校探索、申请案例、AI 辅助规划、每日任务追踪与社区讨论。
- 简要说明最终 PoC 已实现的核心能力，以及项目的主要技术价值，例如本地数据管理、LLM 辅助规划、多模块桌面应用架构等。

### Table of Contents

- 自动生成目录。
- 如果报告中图表较多，可以增加 List of Figures / List of Tables。

---

## 1. Introduction and System Overview

本章对应 PDF 要求中的 "Introduction and System Overview"。目标是说明项目要解决什么问题、为什么值得做、系统整体是什么。

### 1.1 Project Background

- 说明留学申请过程中常见痛点：
  - 信息分散：院校、项目、申请案例、语言考试、文书资源分散在不同平台。
  - 规划困难：学生难以根据 GPA、语言成绩、科研、实习等背景判断申请竞争力。
  - 时间管理压力：申请准备周期长，任务拆分和持续执行困难。
  - 个性化不足：通用攻略无法完全适配个人背景与目标地区。
- 引出 Aurora Vine 的项目动机：提供一个集中、清晰、可持续使用的留学规划工作台。

### 1.2 Problem Statement

- 明确本项目要解决的核心问题：
  - 如何帮助学生系统化整理个人申请背景？
  - 如何基于背景信息生成合理的选校与学习规划？
  - 如何在桌面端整合数据库浏览、申请案例、AI 规划与每日任务管理？
- 可以用一段话定义问题边界：本系统不是完整商业留学中介平台，而是一个 Proof of Concept 级别的智能留学规划辅助工具。

### 1.3 Target Users and User Needs

- 目标用户：
  - 准备申请海外研究生或本科项目的学生。
  - 希望了解学校、项目、案例和申请规划的用户。
  - 需要管理长期备考或申请任务的用户。
- 用户需求：
  - 输入并保存个人背景信息。
  - 浏览大学数据库和专业信息。
  - 查看真实申请案例。
  - 获得 AI 生成的选校建议、规划大纲和个人陈述草稿。
  - 将长期规划拆分为每日可执行任务。
  - 使用中英文界面、主题切换、个人资料和社区讨论等辅助功能。

### 1.4 Project Objectives

- 功能目标：
  - 构建一个跨平台桌面应用。
  - 实现用户身份、个人资料、选校规划、院校库、申请案例、学习规划、每日打卡、资源中心和社区模块。
  - 集成 DeepSeek API，为用户生成规划建议、学校分层和任务安排。
- 技术目标：
  - 使用 Electron 构建桌面端应用。
  - 通过 SQLite 管理学校、案例、计划、社区和用户数据。
  - 通过模块化 JavaScript 和 IPC 机制组织前后端交互。
  - 保持系统可维护、可扩展和相对安全。
- 课程目标关联：
  - 展示软件设计、实现、团队协作、项目管理和专业开发实践。

### 1.5 System Overview

- 高层描述 Aurora Vine 的主要功能模块：
  - School Planning：收集背景信息，计算竞争力，生成 AI 选校规划。
  - My Profile：展示用户背景、分数图表和 AI 文书草稿。
  - University Database：浏览约 200 所大学及其项目、图片和简介。
  - Application Cases：按条件筛选真实申请案例。
  - Study Planning：生成学习规划、智能日程和自定义计划。
  - Daily Check-in：把规划转化为每日任务并记录完成状态。
  - Resource Center：提供 GRE、IELTS、TOEFL、SOP、简历等资源。
  - Community：支持发帖和回复。
  - Settings：语言、主题、API key、账号和头像设置。
- 建议放一张系统首页或功能地图截图。

### 1.6 Scope and Exclusions

- 已实现范围：
  - 本地桌面应用。
  - 本地 SQLite 数据库。
  - 用户数据保存、学校与案例浏览、AI 辅助规划、每日任务管理等核心功能。
- 未覆盖或暂不覆盖：
  - 完整商业级云同步。
  - 多端实时协作。
  - 官方录取概率预测。
  - 简历 OCR 识别。
  - 支付、课程购买或中介服务流程。

---

## 2. System Design

本章对应 PDF 要求中的 "System Design"。重点写架构、组件责任、交互方式和关键设计理由。

### 2.1 Design Goals and Principles

- 可用性：让申请规划流程直观、连续、低干扰。
- 模块化：将不同功能拆分到独立 renderer modules、main IPC handlers 和 LLM pipeline 文件中。
- 本地优先：学校、案例、计划和打卡数据主要存储在 SQLite 或本地存储中。
- 可扩展性：未来可以增加新的规划类型、更多学校数据或新的 LLM prompt。
- 安全性：通过 Electron 的 context isolation、preload bridge 和受控 IPC 限制 renderer 的权限。

### 2.2 High-Level Architecture

- 说明系统采用 Electron 架构：
  - Renderer Process：负责 UI、交互逻辑和页面模块。
  - Preload Script：通过 `contextBridge` 暴露受控 API。
  - Main Process：负责窗口管理、数据库访问、文件处理、LLM 调用和自定义协议。
  - SQLite Database：保存学校、项目、案例、计划、打卡、社区、账号等数据。
  - External LLM Service：通过 DeepSeek API 生成规划内容。
- 建议加入一张架构图：
  - User Interface -> Preload API -> IPC Handlers -> SQLite / File System / LLM Service

### 2.3 Component Design

#### 2.3.1 Renderer Layer

- 说明 renderer 由 HTML、CSS 和 ES modules 组成。
- 主要模块及职责：
  - `planning.js`：学校规划表单与背景信息收集。
  - `profile.js`：个人资料展示与编辑。
  - `schools.js`：学校列表、筛选、详情展示。
  - `application-cases.js`：申请案例筛选和详情展示。
  - `study-planning.js` 或相关模块：学习规划、智能日程、自定义计划。
  - `daily-checkin.js`：日历和每日任务。
  - `resource-center.js`：学习资源内容。
  - `i18n.js`：中英文切换。
  - `custom-select.js`、`ui-transition.js`：交互体验和界面效果。

#### 2.3.2 Main Process and IPC Layer

- 说明 main process 负责所有高权限操作。
- 主要 IPC 分组：
  - Auth：注册、登录、访客模式、认证、头像。
  - Schools：学校列表、搜索、详情、项目、图片资源。
  - Cases：案例列表和案例详情。
  - Daily Check-in：任务读取、保存、导入、清空。
  - Study Plan：规划保存、查询、删除。
  - Community：帖子和回复。
  - Resume：上传、解析、文本缓存。
  - Settings：DeepSeek API key 管理。
  - LLM：简历评分、规划大纲、日程、每日任务、个人陈述。
- 解释为什么使用 IPC：
  - Renderer 不直接访问 Node.js、数据库或文件系统。
  - 数据访问集中在 main process，更容易控制权限和错误处理。

#### 2.3.3 LLM Pipeline Design

- 说明 LLM pipeline 的设计：
  - Prompt templates 存放在 `main/llm/prompts/`。
  - `profile-context.js` 将用户背景结构化。
  - `plan-schema.js` 校验模型输出 JSON。
  - `school-matcher.js` 将学校数据库与选校分层逻辑结合。
  - `school-tier-review.js` 让 LLM 在候选池中复核冲刺、匹配、保底学校。
- 可说明几个典型 LLM 任务：
  - Resume scoring。
  - Planning outline generation。
  - School tier recommendation。
  - Phase-level schedule。
  - Daily task generation。
  - Personal statement draft。
- 讨论设计理由：
  - Prompt 与业务逻辑分离，便于维护。
  - 使用 schema validation 降低 LLM 输出不稳定风险。
  - 使用本地 fallback 保证关键流程在 LLM 失败时仍可运行。

#### 2.3.4 Data and Storage Design

- SQLite 数据：
  - `schools`、`school_programs`
  - `application_cases`、`application_case_offers`
  - `accounts`、`app_session`
  - `daily_checkin`
  - `study_plan`
  - `community_posts`、`community_replies`
- LocalStorage：
  - 规划表单状态、目标学校、主题、语言等轻量状态。
- Electron userData：
  - API key 配置。
  - 上传简历和提取文本。
  - 用户头像。
- 说明为什么采用混合存储：
  - 结构化共享数据适合 SQLite。
  - UI 偏好和临时表单状态适合 LocalStorage。
  - 文件和敏感配置适合 userData 目录。

### 2.4 User Interaction and Data Flow

#### 2.4.1 School Planning Flow

- 用户填写学校背景、专业、GPA、语言成绩、GRE、科研、实习、论文、目标地区和偏好。
- 可选上传简历。
- 系统计算本地竞争力分数。
- LLM 生成规划大纲和学校分层。
- 结果保存到用户资料，并可在 My Profile 和 Study Planning 中复用。

#### 2.4.2 Smart Schedule and Daily Check-in Flow

- 用户从 Study Planning 触发智能日程生成。
- LLM 生成阶段性计划。
- 系统将阶段计划拆分为每日任务。
- 任务批量导入 Daily Check-in。
- 用户在日历中查看、完成和追踪任务。

#### 2.4.3 University and Case Exploration Flow

- 用户通过学校库搜索和筛选学校。
- 查看学校简介、排名、项目、图片、相关案例。
- 用户可收藏目标学校。
- 申请案例模块支持通过 GPA、语言、背景、录取结果等条件进行筛选。

### 2.5 Interface and UX Design

- 说明主要 UI 设计原则：
  - Calm and focused workspace：降低申请压力。
  - 中英文切换：适配中国学生和英文申请语境。
  - Light/Dark theme：提升可访问性和个性化。
  - Toast、confirm dialog、loading overlay：提供清晰反馈。
  - Frameless window 和自定义 title bar：增强桌面应用完整性。
- 建议放 3-5 张界面截图：
  - 首页或导航。
  - School Planning 表单。
  - AI 规划结果。
  - University Database。
  - Daily Check-in。

### 2.6 Key Design Decisions and Rationale

- 选择 Electron：
  - 适合快速实现跨平台桌面 PoC。
  - 允许使用 Web 技术构建复杂 UI，同时能访问本地文件和数据库。
- 选择 Vanilla HTML/CSS/JS + ES Modules：
  - 降低框架复杂度，适合课程 PoC。
  - 模块化文件仍能保持可维护性。
- 选择 SQLite：
  - 适合本地桌面应用。
  - 无需部署数据库服务器。
  - 对学校、案例、计划等结构化数据查询友好。
- 选择 DeepSeek API：
  - 提供生成式规划能力。
  - 与本地规则和数据库结合，形成可解释的辅助规划流程。
- 选择模块化 IPC：
  - 让功能边界清楚，便于调试和扩展。

---

## 3. Implementation

本章对应 PDF 要求中的 "Implementation"。重点写系统如何被实现，使用了什么技术，遇到什么技术挑战，如何体现设计原则和模式。

### 3.1 Technology Stack

- Desktop framework：Electron 33。
- Build tool：electron-vite。
- Frontend：HTML、CSS、JavaScript ES modules。
- Database：better-sqlite3。
- LLM integration：OpenAI SDK compatible client + DeepSeek API。
- Charts：ECharts / echarts-gl。
- Rich content：KaTeX。
- Document parsing：pdf-parse、mammoth、word-extractor。
- Data import：xlsx、CSV parsing scripts。
- Notifications：NotifyX。
- Development environment：Node.js、npm、Git。

### 3.2 Project Structure

- 简述主要目录：
  - `main.js`：Electron main entry。
  - `preload.js`：安全暴露 renderer API。
  - `main/ipc/`：功能相关 IPC handler。
  - `main/llm/`：LLM prompts、schema、context builder、school matching。
  - `main/utils/`：数据库、安全、配置、简历文本处理。
  - `renderer/`：UI、样式和前端模块。
  - `data/`：数据库初始化和数据处理脚本。
  - `school/`、`major/`、`personalCase/`：学校、专业和案例数据源。
  - `image/`：品牌和插图资源。

### 3.3 Database Implementation

- 说明数据库初始化流程：
  - 从学校文件夹导入学校基础信息、简介、图片和 logo。
  - 从专业表格导入 program 信息。
  - 从申请案例 CSV 导入案例和 offer 信息。
  - 初始化社区或样例数据。
- 说明查询模式：
  - 学校列表分页与筛选。
  - 学校详情和项目查询。
  - 申请案例按多条件筛选。
  - 每日任务按日期和月份查询。
  - 社区帖子和回复查询。
- 讨论事务使用：
  - 批量导入每日任务时使用事务，降低部分写入失败的风险。

### 3.4 School Planning Implementation

- 输入处理：
  - 收集本科学校层级、学校名、专业、GPA、GPA scale、GPA percentile。
  - 收集 IELTS / TOEFL / GRE 分数或未参加状态。
  - 收集科研、实习、论文数量。
  - 收集目标地区、申请目标和补充偏好。
- 竞争力评分：
  - 将学术背景、语言成绩、软背景和简历质量组合为总评分。
  - 用评分确定大致 QS anchor rank 或候选区间。
- AI 规划：
  - 构造结构化 profile context。
  - 发送到 prompt template。
  - 校验 JSON 输出。
  - 保存 outline、school tiers 和 personal statement draft。
- 简历处理：
  - 支持 PDF、DOC、DOCX。
  - 提取文本并缓存。
  - 对重复文件使用 hash 或缓存机制降低重复处理成本。

### 3.5 School Tier Recommendation Implementation

- 候选池构建：
  - 从 SQLite school catalog 中读取学校数据。
  - 根据用户总评分和院校背景计算候选范围。
  - 构造 reach、match、safety 三类学校池。
- LLM review：
  - 将候选学校和用户背景输入 LLM。
  - 要求 LLM 只在允许候选池内选择学校。
  - 对模型输出进行 schema validation。
- Fallback：
  - 如果 LLM 调用失败或返回无效结果，系统使用本地 score-based fallback。
- 结果呈现：
  - 每个 tier 包含学校、QS 排名、推荐理由。
  - 支持中英文内容展示。

### 3.6 Study Planning and Daily Task Implementation

- Study Planning：
  - 展示 AI outline。
  - 生成 phase-level schedule。
  - 支持自定义文本规划解析并保存。
  - 展示目标学校和学校层级推荐。
- Smart schedule：
  - 将长期目标拆分为阶段。
  - 再将阶段拆分为每日任务。
  - 若 LLM 输出不完整，使用 fallback 和 gap-fill 填补空白日期。
- Daily Check-in：
  - 按日期保存最多若干任务。
  - 支持颜色标签、完成状态、月视图。
  - 从智能规划批量导入任务。

### 3.7 University Database and Application Cases Implementation

- University Database：
  - 学校列表分页。
  - 关键词搜索。
  - 国家、地区、排名等筛选。
  - 学校详情侧栏，展示简介、地址、官网、图片、项目、相关案例。
  - 使用自定义 `school://` 协议加载本地学校资源。
- Application Cases：
  - 案例分页和多条件筛选。
  - 根据学校链接到相关案例。
  - 详情页展示申请背景、录取结果、语言成绩、软背景等信息。

### 3.8 Account, Settings, Theme and i18n Implementation

- Account：
  - 注册用户、访客模式、当前 session。
  - 账号数据和 guest 数据隔离。
  - 头像上传并通过自定义协议展示。
- Settings：
  - DeepSeek API key 保存和读取。
  - 清空个人数据。
  - 语言和主题设置。
- i18n：
  - 中英文 UI 文案。
  - LLM 输出采用 bilingual JSON fields。
- Theme：
  - Light theme：绿色、清爽、规划感。
  - Dark theme：深色背景、暖黄色按钮和萤火虫效果。

### 3.9 Security and Reliability Implementation

- Electron security：
  - 启用 context isolation。
  - Renderer 通过 preload 暴露的 API 与 main process 通信。
  - 文件系统和数据库访问不暴露给 renderer。
- Protocol security：
  - `school://`、`avatar://` 只允许访问白名单路径。
- API key：
  - 存储在本地 userData config，不提交到仓库。
- Error handling：
  - IPC handler 捕获异常并返回可控错误。
  - LLM 失败时提供 fallback。
  - UI 使用 toast、loading overlay 和 confirm dialog 提供反馈。

### 3.10 Significant Technical Challenges

- LLM 输出不稳定：
  - 问题：生成结果可能不是合法 JSON，或学校 ID 超出允许范围。
  - 解决：schema validation、candidate allowance、fallback。
- 数据清洗和导入：
  - 问题：学校、专业、案例来源格式不一致，可能存在编码问题。
  - 解决：初始化脚本、GB18030 处理、字段映射和可选数据容错。
- 桌面应用权限边界：
  - 问题：Renderer 需要使用数据库和文件，但直接暴露 Node 权限不安全。
  - 解决：使用 preload + IPC。
- 长期规划到每日任务的转化：
  - 问题：LLM 可能生成过于抽象或不连续的任务。
  - 解决：阶段计划、每日任务生成、fallback expansion、gap-fill。
- 多模块 UI 复杂度：
  - 问题：学校、案例、规划、社区、设置等功能同时存在，容易形成耦合。
  - 解决：按功能拆分 renderer modules 和 main IPC files。

---

## 4. Development Process

本章对应 PDF 要求中的 "Development Process"。重点写开发方法、迭代、里程碑、团队协作和过程中做出的调整。

### 4.1 Development Methodology

- 建议描述为轻量 Agile / iterative development。
- 说明为什么适合本项目：
  - 项目功能多，适合分阶段实现和验证。
  - UI、数据库、LLM prompt 需要持续调整。
  - PoC 目标允许先实现核心闭环，再逐步完善细节。

### 4.2 Team Roles and Responsibilities

- 可按实际情况填写：
  - Project coordination / planning。
  - UI/UX design。
  - Frontend module implementation。
  - Electron main process and IPC。
  - Database schema and data import。
  - LLM prompt engineering and validation。
  - Testing and documentation。
- 建议强调协作方式：
  - Git 版本管理。
  - 分工开发后合并。
  - 定期 review 功能和进度。

### 4.3 Milestones and Iterations

#### Iteration 1: Requirement Analysis and Proposal

- 明确目标用户、项目范围和核心功能。
- 确定桌面应用方向和技术栈。
- 完成 proposal。

#### Iteration 2: Core Architecture Setup

- 搭建 Electron + electron-vite 项目。
- 建立 main / preload / renderer 结构。
- 配置 SQLite 和基础 IPC。
- 完成导航和基础页面框架。

#### Iteration 3: Data-Driven Modules

- 导入学校、专业、申请案例数据。
- 实现学校库、学校详情、案例筛选。
- 实现收藏目标学校等基础状态管理。

#### Iteration 4: Planning and Profile Features

- 实现 School Planning 表单。
- 实现背景评分和 Profile 展示。
- 加入 ECharts 数据可视化。
- 支持用户重新编辑和保存背景信息。

#### Iteration 5: LLM Integration

- 接入 DeepSeek API。
- 设计 prompt templates。
- 实现简历解析、简历评分、规划大纲、学校分层、个人陈述生成。
- 加入 JSON validation 和 fallback。

#### Iteration 6: Study Plan and Daily Check-in

- 实现 AI schedule 和 daily task generation。
- 将任务导入每日打卡。
- 加入日历、任务完成状态、颜色标签。

#### Iteration 7: UX, i18n and Polish

- 加入中英文切换。
- 完善 light/dark theme。
- 加入 toast、confirm dialog、loading overlay、transition effects。
- 优化用户手册、README 和最终演示流程。

### 4.4 Adaptations During Development

- 可写几个真实或合理的调整：
  - 从单一规划文本扩展为学校分层 + 阶段计划 + 每日任务。
  - 对 LLM 输出增加 schema validation，提升可靠性。
  - 将松散功能拆分为独立模块，降低 renderer 文件复杂度。
  - 将学校推荐改为本地候选池 + LLM review，避免模型凭空推荐不存在的学校。
  - 增加 fallback，确保没有 API key 或 LLM 失败时系统仍有可展示结果。

### 4.5 Version Control and Collaboration

- 说明使用 Git 管理代码。
- 描述 branch、commit、merge 或任务分配方式。
- 如果有 GitHub 仓库，可说明 issue、README、提交记录等协作证据。

### 4.6 Professional Practice

- 代码组织：
  - 按 feature 分文件。
  - IPC 和 renderer 分层。
  - Prompt 和 schema 独立维护。
- 数据和隐私：
  - API key 不写入源码。
  - 用户上传文件保存在本地。
  - 避免提交敏感信息。
- 文档：
  - README 说明安装、运行、数据准备和功能。
  - User Manual 说明安装和使用。

---

## 5. Evaluation of Outcomes

本章对应 PDF 要求中的 "Evaluation of Outcomes"。重点不是只说“做完了”，而是评价系统是否达成目标，并给证据、优点和限制。

### 5.1 Evaluation Objectives

- 从项目目标出发，定义评价问题：
  - 系统是否覆盖主要留学规划流程？
  - AI 规划是否能根据用户背景生成有用输出？
  - 学校和案例数据是否能支持探索和决策？
  - 用户是否能将长期计划转化为每日任务？
  - 系统是否稳定、可运行、可演示？

### 5.2 Functional Evaluation

- 建议用表格评价每个核心功能：
  - Account / guest mode：是否完成、证据截图。
  - School Planning：是否完成、输入输出说明。
  - AI school tiers：是否完成、示例结果。
  - My Profile：是否完成、图表和文书草稿。
  - University Database：是否完成、搜索和详情。
  - Application Cases：是否完成、筛选和详情。
  - Study Planning：是否完成、schedule 和 custom plan。
  - Daily Check-in：是否完成、导入和完成状态。
  - Resource Center：是否完成、资源内容。
  - Community：是否完成、发帖和回复。
  - Settings：是否完成、主题、语言、API key。
- 每项建议写：
  - Expected behaviour。
  - Actual implementation。
  - Evidence，例如截图、测试步骤或演示场景。

### 5.3 Technical Evaluation

- 架构质量：
  - Electron 分层清晰。
  - Renderer 不直接访问数据库和文件系统。
  - IPC handler 按功能拆分。
- 数据质量：
  - 学校和案例数据可查询。
  - SQLite 适合本地 PoC。
- LLM 质量：
  - Prompt template 可维护。
  - Structured output validation 提高可靠性。
  - Fallback 降低外部 API 失败影响。
- 可维护性：
  - 主要功能被拆分到独立模块。
  - README 描述项目结构和开发命令。

### 5.4 User Experience Evaluation

- 可以基于小组内部测试或同学试用反馈：
  - 导航是否清晰。
  - 表单是否容易填写。
  - AI 输出是否易读。
  - 学校和案例筛选是否有效。
  - 每日打卡是否能帮助任务执行。
- 可加入截图和用户流程：
  - "A user enters academic background -> receives school tiers -> generates schedule -> imports daily tasks"。

### 5.5 Testing and Validation

- Manual testing：
  - 启动应用。
  - 注册 / 登录 / guest mode。
  - 学校搜索。
  - 案例筛选。
  - 填写规划表单。
  - 输入 API key 后生成 AI 结果。
  - 不输入 API key 或 LLM 失败时观察 fallback。
  - 导入 daily check-in。
- Data testing：
  - 验证学校数量、排名排序、program 查询。
  - 验证案例筛选条件。
- Error testing：
  - 无效 API key。
  - 空表单或缺失字段。
  - 上传不支持的文件。
  - 数据库缺失或未初始化。
- 如果没有自动化测试，也要诚实说明目前主要依赖手动测试，并说明未来会补充单元测试和集成测试。

### 5.6 Strengths

- 功能闭环完整：从背景输入到选校、学习规划和每日任务追踪。
- 桌面端本地优先：适合处理个人申请信息。
- 数据与 AI 结合：不是单纯聊天，而是用结构化 profile 和学校数据库约束输出。
- 模块化架构：renderer modules、IPC handlers、LLM pipeline 相对清晰。
- 用户体验完整：主题、语言、通知、图表、资源中心和社区增强可用性。

### 5.7 Limitations

- LLM 结果不是官方录取预测，只能作为辅助建议。
- 推荐质量依赖输入数据质量和 prompt 设计。
- 学校和项目数据覆盖有限，未来需要持续更新。
- 简历解析不支持 OCR，对图片型 PDF 有限制。
- 目前主要是本地应用，缺少云同步和多设备使用。
- 自动化测试覆盖不足。
- 社区功能是本地 PoC，不是完整在线社区。

### 5.8 Evidence of Meeting Objectives

- 对照第 1.4 节目标逐条评价：
  - 是否实现跨平台桌面应用。
  - 是否实现核心留学规划功能。
  - 是否实现 AI 辅助规划。
  - 是否实现本地数据库和数据查询。
  - 是否体现安全、模块化和可扩展性。
- 这一节可以作为评分亮点，因为它直接回应 PDF 中 "assesses how well the implemented system meets its stated objectives"。

---

## 6. Conclusion and Future Work

本章对应 PDF 要求中的 "Conclusion and Future Work"。重点总结设计收获和现实可行的改进方向。

### 6.1 Conclusion

- 总结 Aurora Vine 的最终成果：
  - 完成了一个面向留学申请者的智能规划桌面应用 PoC。
  - 系统整合了个人画像、院校数据、申请案例、AI 规划、每日任务和社区资源。
  - 架构采用 Electron + SQLite + modular JavaScript + LLM pipeline。
  - 项目展示了软件设计、实现、项目管理和团队协作能力。

### 6.2 Key Design Insights

- LLM 适合辅助生成规划，但需要结构化输入、输出校验和 fallback。
- 对留学规划类应用来说，数据质量和用户输入结构化程度非常关键。
- 桌面端本地应用在隐私和部署上有优势，但云同步能力有限。
- 功能多的 PoC 必须通过模块化设计控制复杂度。

### 6.3 Future Work

- Data expansion：
  - 增加更多学校、专业、奖学金和申请截止日期。
  - 建立定期数据更新机制。
- Recommendation improvement：
  - 结合历史案例进行更细粒度匹配。
  - 增加可解释评分模型。
  - 允许用户调整风险偏好。
- AI reliability：
  - 增加更多 schema validation。
  - 增加 prompt versioning。
  - 记录用户反馈来改进 prompt。
- Testing：
  - 增加 IPC 单元测试、数据库测试和端到端测试。
  - 增加自动化 smoke test。
- Cloud and collaboration：
  - 可选云同步。
  - 多设备登录。
  - 在线社区和导师反馈。
- Resume and document support：
  - 增加 OCR。
  - 支持 SOP、推荐信、成绩单等材料管理。
- Deployment：
  - 打包安装程序。
  - 自动更新。
  - 更完整的错误日志和反馈机制。

---

## References

- 最多 20 条引用。
- 可引用：
  - Electron 官方文档。
  - SQLite / better-sqlite3 文档。
  - OpenAI SDK 或 DeepSeek API 文档。
  - ECharts 文档。
  - KaTeX 文档。
  - 与软件架构、LLM structured output、human-computer interaction 相关的资料。
- 注意：如果使用了 AI 工具辅助写作或开发，需按课程要求明确 acknowledgement。

---

## Appendices

Final Report 不要求必须有 appendix，但如果页数允许，可以放支持材料。注意不要把源代码全文放进去。

### Appendix A: Screenshots

- 关键页面截图。
- 每张截图配 1-2 句说明。

### Appendix B: Test Scenarios

- 列出手动测试场景、输入、预期结果和实际结果。

### Appendix C: Data Summary

- 学校数量、案例数量、主要数据表说明。

### Appendix D: AI Acknowledgement

- 说明是否使用 AI 辅助工具，以及使用范围。
- 例如：用于语言润色、大纲讨论、prompt 调试辅助，但最终分析、设计和实现由团队负责。

---

## 建议页数分配

- 封面、摘要、目录：2-3 页
- 1. Introduction and System Overview：3-4 页
- 2. System Design：5-7 页
- 3. Implementation：6-8 页
- 4. Development Process：3-4 页
- 5. Evaluation of Outcomes：4-6 页
- 6. Conclusion and Future Work：2-3 页
- References / Appendices：1-3 页

整体建议控制在 24-28 页左右，既满足 20-30 页要求，也给图表和截图留出空间。
