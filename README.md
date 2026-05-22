# Aurora Vine · 极光藤

<p align="center">
  <strong>让留学规划更清晰 · A Clearer Path to Studying Abroad</strong>
</p>

Aurora Vine 是一款面向留学申请者的 **Electron 桌面应用**。它将背景整理、院校探索、案例参考、AI 辅助规划、每日打卡与社区交流整合在同一界面中，帮助申请者把长期目标拆解为可执行步骤。

渲染层采用原生 **HTML / CSS / JavaScript**，按功能拆分为 `renderer/modules/` 下的 ES 模块；主进程通过 `main.js` 启动，业务 IPC 集中在 `main/ipc/`；LLM 相关逻辑位于 `main/llm/`。

---

## 目录

- [功能概览](#功能概览)
- [AI 与 LLM 能力](#ai-与-llm-能力)
- [账户与权限](#账户与权限)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [数据准备](#数据准备)
- [项目结构](#项目结构)
- [架构说明](#架构说明)
- [数据与存储](#数据与存储)
- [IPC 接口一览](#ipc-接口一览)
- [主题与国际化](#主题与国际化)
- [开发说明](#开发说明)
- [备份与协作](#备份与协作)
- [许可证](#许可证)

---

## 功能概览

### 核心入口

| 模块 | 说明 |
|------|------|
| **定校规划** | 收集本科背景、GPA、语言与 GRE 标化、科研/实习/论文数量；可选上传简历（PDF/DOC/DOCX）。提交后计算综合竞争力评分，并在配置 API Key 后调用 LLM 生成规划大纲与院校梯度建议 |
| **我的背景** | 展示已填写的背景信息；ECharts 可视化标化成绩；展示 LLM 生成的个人陈述草稿（需 API Key）；支持重新填写 |
| **目标院校** | 管理收藏院校，按 QS 排名排序，可跳转详情 |
| **留学规划** | **规划大纲**（LLM 生成 SWOT 式分析 + 冲/稳/保院校推荐）；**智能留学规划**（阶段日程 + 导入每日打卡）；**自定义规划**（结构化文本解析写入 SQLite）；展示推荐院校梯度与意向院校 |
| **每日打卡** | 月历视图 + 当日任务（最多 9 条）；支持完成状态与颜色标记；可接收智能规划批量导入 |
| **院校数据库** | 分页浏览约 200 所院校；关键词搜索；地区筛选（英美新港欧等）；详情侧栏含简介、官网、地址、轮播图、专业列表、相关申请案例 |
| **申请案例** | 分页列表与多维筛选（本科层级、GPA、语言、软背景、排序等）；侧栏详情；与院校详情联动 |
| **资源中心** | 分类浏览 GRE / 雅思 / 托福 / 文书 / 简历等素材；部分条目含富文本正文（含 KaTeX 公式渲染） |
| **社区留言** | 发帖、回复、嵌套评论；可删除自己的帖子与回复 |
| **设置** | 中/英语言、亮/暗主题、个人信息、头像、DeepSeek API Key、邀请码认证、清空个人资料 |
| **使用指南** | 首次进入引导与功能说明 |

### 通用体验

- 无边框窗口 + 自定义标题栏（支持拖拽）
- 亮色主题（薄荷绿强调）与暗色主题（荧光黄按钮强调）
- 中英文界面切换（`renderer/modules/i18n.js`）
- 夜间模式「萤火虫」粒子装饰（Logo、导航、部分卡片）
- Toast 通知（NotifyX）、确认对话框、LLM 等待进度遮罩

---

## AI 与 LLM 能力

应用通过 **DeepSeek API**（OpenAI 兼容接口）提供智能规划，API Key 在「设置 → API Key」中配置，保存在用户目录 `config.json`，不会写入仓库。

### 工作流程

```
定校规划提交
  ├─ [可选] 简历上传 → 文本提取 → LLM 简历评分 (llmScore + summary)
  ├─ 本地综合评分 (GPA / 语言 / 背景 / 院校层次 [+ 简历分])
  ├─ LLM 生成规划大纲 (entries + schoolTiers 冲/稳/保)
  └─ [可选] LLM 生成个人陈述草稿 → 写入「我的背景」

留学规划 → 重新生成智能日程
  ├─ LLM 生成阶段日程 (plan-schedule)
  ├─ LLM 生成每日打卡任务 (plan-daily-tasks，带重试)
  ├─ 日程兜底：将阶段任务按天展开
  ├─ 空档补全：规划窗口内无任务的日期用最近阶段任务填充
  └─ 批量导入 daily_checkin (dailyCheckin:importPlan，单次事务)
```

### 无简历时的输入整理

未上传简历时，主进程 `main/llm/profile-context.js` 会将表单中的标化信息整理为结构化 LLM 上下文，包括：

- `academic`：院校层次、GPA、百分位等
- `standardizedTests`：雅思/托福/GRE 及「未考/已考」状态
- `experience`：科研、实习、论文计数
- `backgroundNarrative`：中英文叙事摘要
- `guidanceForModel`：提示模型勿臆造简历细节

### Prompt 模板

位于 `main/llm/prompts/`：

| 文件 | 用途 |
|------|------|
| `score-resume.md` | 简历质量评分 |
| `plan-outline.md` | 规划大纲 + 院校梯度 |
| `plan-schedule.md` | 阶段级智能日程 |
| `plan-daily-tasks.md` | 每日可执行任务 |
| `personal-statement.md` | 个人陈述草稿 |

### 简历解析

- 支持 PDF（`pdf-parse`）、DOC/DOCX（`mammoth` / `word-extractor`）
- 文件以 MD5 去重，文本缓存于 userData
- 图片格式简历会存档但暂不支持 OCR

---

## 账户与权限

| 模式 | 说明 |
|------|------|
| **注册用户** | 邮箱 + 密码；数据与 SQLite 业务表关联 |
| **游客模式** | 无需登录即可浏览与填写；定校规划等使用独立 localStorage 键 |
| **认证用户** | 登录后输入邀请码通过 `auth:certify` 认证（邀请码配置于 `main/ipc/auth.js`） |

- 头像：JPEG / PNG / WebP，≤ 512KB，经 `avatar://` 协议加载
- 游客与账号的定校规划、收藏院校、主题等通过 `renderer/modules/storage.js` 分键存储

---

## 技术栈

| 类型 | 技术 |
|------|------|
| 桌面壳 | Electron 33 |
| 构建 | electron-vite 3.x |
| 数据库 | better-sqlite3（`data/school_item.db`） |
| LLM | OpenAI SDK → DeepSeek API |
| 图表 | ECharts 5.x、echarts-gl |
| 公式 | KaTeX（资源中心 GRE 等内容） |
| 文档解析 | pdf-parse、mammoth、word-extractor |
| 表格导入 | xlsx（`data/init_db.js`） |
| 通知 | NotifyX |
| 前端 | 原生 HTML / CSS / ES Modules（无 React / Vue） |

---

## 环境要求

- **Node.js** 18+
- **npm** 9+
- **Windows / macOS / Linux**（开发环境已在 Windows 上验证）

依赖含 **better-sqlite3** 原生模块：`npm install` 后通过 `postinstall` 执行 `electron-rebuild`。若启动报原生模块错误，可手动执行：

```bash
npm run prestart
```

---

## 快速开始

### 1. 克隆与安装

```bash
git clone https://github.com/TheBlueBanisters/Aurora_Vine.git
cd Aurora_Vine
npm install
```

### 2. 初始化数据库（首次必做）

```bash
node data/init_db.js
```

脚本会 **删除已有的** `data/school_item.db` 并重建，包括：

- 从 `school/No.{QS排名}/` 导入院校与素材索引
- 从 `major/*.xlsx`（可选）导入专业表 `school_programs`
- 从 `personalCase/*.csv`（可选）导入申请案例

> **警告**：重建数据库会清空账户、打卡、社区、留学规划等运行期数据。重要数据请先备份 `data/school_item.db`。

当前仓库 `school/` 下约有 **200** 个院校目录，具体条数以脚本日志为准。

### 3. 开发模式

```bash
npm run dev
```

- 渲染进程由 Vite 提供 HMR（`http://127.0.0.1:5173`）
- 开发中间件映射 `/image` → 项目根目录 `image/`
- 修改 `main.js`、`preload.js` 或 `main/ipc/` 后需重启 Electron

### 4. 生产构建

```bash
npm run build
npm start
```

构建产物位于 `out/`（`main`、`preload`、`renderer`）。`package.json` 的 `"main"` 指向 `out/main/main.js`。

### 5. 配置 LLM（可选）

1. 启动应用 → **设置**
2. 展开 **API Key**，填入 DeepSeek API Key 并保存
3. 在 **定校规划** 填写背景并提交，即可生成 AI 大纲
4. 在 **留学规划** 点击「重新生成智能日程」，生成阶段计划并导入 **每日打卡**

---

## 数据准备

### 1. 院校目录 `school/`（必填）

每个院校一个子文件夹，命名 **`No.{QS排名}`**（如 `No.2`、`No.163`）。

**必备：**

- **`intro.json`**：含 `intro.zh` / `intro.en`（字符串数组）、`contact`（官网）、`address.zh` / `address.en`
- **校徽 PNG**：目录内至少一个非纯数字文件名的 `.png`（如 `帝国理工学院.png`）

**可选：**

- `1.jpg` ~ `5.jpg` 等轮播图（详情页展示）

### 2. 专业表 `major/`（可选）

- 放置 **一个** `.xlsx`（忽略 `~$*.xlsx`），读取第一张工作表，首行为表头
- 必须能匹配：中文校名、英文校名、中/英专业名（别名见 `data/init_db.js` 中 `PROGRAM_COLUMN_ALIASES`）
- 可选列：学费、语言要求、学制、培养方案、专业难度系数等
- 每行校名须能唯一定位到已导入院校，否则脚本报错终止

### 3. 申请案例 `personalCase/`（可选）

- 放置 **一个** `.csv`，脚本按 **GB18030** 解码（兼容 Excel 中文 Windows 导出）
- 主要列：`案例序号`、`本科层次`、`绩点分制`、`绩点`、`绩点排名百分比`、`雅思成绩`、`托福成绩`、`GRE`、`GRE写作`、`实习数量`、`科研数量`、`论文数量`
- Offer 列表由脚本结合院校与专业数据自动分配

### 4. 社区示例帖（可选）

```bash
python data/fix-community-posts.py
```

用于插入 UTF-8 编码的示例社区帖子（避免 Windows 下 SQL 管道乱码）。

---

## 项目结构

```
Aurora_Vine/
├── main.js                      # Electron 主进程入口
├── preload.js                   # contextBridge → window.api
├── electron.vite.config.js      # main / preload / renderer 构建配置
├── package.json
│
├── main/
│   ├── ipc/                     # IPC 处理器
│   │   ├── auth.js              # 注册 / 登录 / 认证
│   │   ├── avatar.js            # 头像与 avatar:// 协议
│   │   ├── schools.js           # 院校 CRUD、搜索、school:// 协议
│   │   ├── application-cases.js # 申请案例
│   │   ├── daily-checkin.js     # 每日打卡（含 bulk import）
│   │   ├── study-planning.js    # 留学规划 SQLite
│   │   ├── community.js         # 社区
│   │   ├── resume.js            # 简历上传与文本提取
│   │   └── llm.js               # DeepSeek LLM 管道
│   ├── llm/                     # Prompt、JSON 校验、院校匹配、Profile 上下文
│   └── utils/                   # db、crypto、security、app-config、resume-text
│
├── data/
│   ├── init_db.js               # 重建 school_item.db
│   ├── school_item.db           # 运行期数据库（git 通常忽略）
│   ├── fix-community-posts.py   # 社区帖 UTF-8 种子脚本
│   └── seed-community-posts.sql
│
├── school/                      # 院校素材（No.{rank}/）
├── major/                       # 专业 xlsx（可选）
├── personalCase/                # 案例 csv（可选）
├── image/                       # 应用静态图、启动页等
│
├── renderer/
│   ├── index.html               # 单页应用骨架
│   ├── style.css                # 全局样式
│   ├── styles/                  # 组件级样式（如 custom-select、firefly）
│   ├── app.js                   # 入口：导航、模块初始化
│   └── modules/
│       ├── auth.js / settings.js / theme.js / i18n.js
│       ├── planning.js / scoring.js / profile.js
│       ├── llm-planning-service.js    # LLM 提交流水线
│       ├── daily-task-distributor.js  # 打卡任务合并与导入
│       ├── study-planning.js / study-planning-parser.js
│       ├── schools.js / application-cases.js
│       ├── daily-checkin.js / community.js
│       ├── resource-center.js / resource-content*.js
│       └── ...
│
├── out/                         # npm run build 输出
├── backup.sh                    # Git 备份推送脚本
└── README.md
```

---

## 架构说明

```
┌─────────────────────────────────────────────────────────┐
│  Renderer (renderer/)                                   │
│  HTML + CSS + ES Modules                                │
│  window.api.*  ←── contextBridge ──→  preload.js       │
└───────────────────────────┬─────────────────────────────┘
                            │ IPC invoke/handle
┌───────────────────────────▼─────────────────────────────┐
│  Main Process (main.js + main/ipc/)                     │
│  BrowserWindow · protocol · SQLite · LLM · 文件 IO      │
└───────────────────────────┬─────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  data/school_item.db   userData/          school/
  (业务 + 院校数据)      config.json         静态素材
                        resumes/           major/
                        avatars/
```

**安全模型：**

- `contextIsolation: true`，渲染进程禁用 Node 集成
- 所有特权操作经 IPC；输入在主进程侧校验（`main/utils/security.js`）
- 自定义协议 `school://`、`avatar://` 仅读取白名单路径

---

## 数据与存储

### SQLite：`data/school_item.db`

| 类别 | 表 | 说明 |
|------|-----|------|
| 院校 | `schools`、`school_programs` | `init_db.js` 导入 |
| 案例 | `application_cases`、`application_case_offers` | `init_db.js` 导入 |
| 账户 | `accounts`、`app_session` | 启动时自动建表 |
| 打卡 | `daily_checkin` | 含 `completed`、`sort_order`，每日最多 9 条 |
| 规划 | `study_plan` | 标题、描述 JSON、任务 JSON、颜色、`source` / `kind` |
| 社区 | `community_posts`、`community_replies` | 帖子与嵌套回复 |

### localStorage（按账号 / 游客隔离）

| 键 | 内容 |
|----|------|
| `schoolPlanningProfile[:guest]` | 定校规划表单与 LLM 结果 |
| `targetSchools[:guest]` | 收藏院校 ID 列表 |
| `profileInfo[:guest]` | 设置页个人信息 |
| `theme` | `light` / `dark` |
| `lang` | `zh` / `en` |

### userData 目录

| 路径 | 内容 |
|------|------|
| `config.json` | DeepSeek API Key（masked 展示） |
| `resumes/{md5}.*` | 上传的简历原文件 |
| `resumes/{md5}.txt` | 提取的纯文本 |
| `avatars/{accountId}.*` | 用户头像 |

---

## IPC 接口一览

渲染进程通过 `preload.js` 暴露的 `window.api` 与主进程通信：

| 分组 | 方法 | 说明 |
|------|------|------|
| 主题 | `themeApply` | 同步窗口标题栏与背景 |
| 认证 | `authGetCurrentUser`、`authLogin`、`authRegister`、`authLogout`、`authEnterGuest`、`authCertify`、`authUpdateNickname`、`authUploadAvatar` | 账户体系 |
| 头像 | `avatarGetDataUrl` | 读取头像 Data URL |
| 院校 | `schoolsList`、`schoolsSearch`、`schoolsGetById`、`schoolsGetByIds`、`schoolsGetProgramsBySchoolId`、`schoolsGetIntro`、`schoolsGetAssetPath`、`schoolsGetAssetDataUrl` | 列表 / 搜索 / 详情 / 素材 |
| 案例 | `applicationCasesList`、`applicationCasesGetDetail`、`applicationCasesListBySchoolId` | 申请案例 |
| 打卡 | `dailyCheckinGetByDate`、`dailyCheckinListByMonth`、`dailyCheckinSaveByDate`、`dailyCheckinAppendTasks`、`dailyCheckinImportPlan`、`dailyCheckinClearAll` | 每日打卡 |
| 规划 | `studyPlanSave`、`studyPlanList`、`studyPlanDelete`、`studyPlanClearBySource`、`studyPlanClearBySourceAndKind`、`studyPlanClearAll` | 留学规划 SQLite |
| 社区 | `communityListPosts`、`communityGetPostDetail`、`communityCreatePost`、`communityCreateReply`、`communityDeletePost`、`communityDeleteReply` | 社区 |
| 简历 | `resumeUpload`、`resumeClearAll`、`resumeGetText` | 简历管理 |
| 设置 | `settingsGetDeepseekApiKey`、`settingsSetDeepseekApiKey` | API Key |
| LLM | `llmScoreResume`、`llmGenerateOutline`、`llmGenerateSchedule`、`llmGenerateDailyTasks`、`llmGeneratePersonalStatement` | AI 生成 |

---

## 主题与国际化

### 主题

- **亮色**：侧边栏薄荷绿（`#76c9a8`），按钮与强调色 `#4db882`
- **暗色**：Catppuccin 风格深色底，按钮与强调色荧光黄 `#ffe066`
- **申请案例页**独立保留原蓝色强调（`--cases-accent-rgb`），与全局主题解耦
- 切换入口：设置 → 夜间模式；状态写入 localStorage 并调用 `theme:apply`

### 国际化

- 文案集中在 `renderer/modules/i18n.js`
- 页面元素通过 `data-i18n` / `data-i18n-placeholder` 绑定
- LLM 输出要求中英文双语 JSON 字段 `{ zh, en }`

---

## 开发说明

### 常用命令

| 命令 | 作用 |
|------|------|
| `npm run dev` | 开发模式（Vite + Electron） |
| `npm run build` | 构建到 `out/` |
| `npm start` | 运行构建后的应用 |
| `node data/init_db.js` | 重建院校 / 案例数据库 |

### 新增功能建议

- 与现有板块弱相关的功能，优先封装为 `renderer/modules/` 下的独立文件（见 `.cursor/rules/encapsulation-rule.mdc`）
- 新增 IPC 时在 `main/ipc/` 注册，并同步 `preload.js` 的 `window.api`
- LLM 新能力：添加 `main/llm/prompts/*.md`，在 `plan-schema.js` 增加校验，于 `llm.js` 注册 handler

### 常见问题

| 现象 | 处理 |
|------|------|
| 院校列表为空 | 执行 `node data/init_db.js` |
| better-sqlite3 报错 | 运行 `npm run prestart` 或重新 `npm install` |
| LLM 提交失败 | 检查设置中 API Key；查看主进程控制台错误 |
| 打卡导入不完整 | 在留学规划重新「生成智能日程」；系统会自动日程兜底 + 空档补全 |
| 社区帖乱码 | 使用 `python data/fix-community-posts.py` 重新插入 |

---

## 备份与协作

仓库根目录提供 `backup.sh`，用于本地 Git 提交并推送到远程（默认 `origin` → GitHub）。使用前在脚本顶部修改 `TAG_NAME`、`BRANCH_NAME` 等变量。

```bash
bash backup.sh
```

`node_modules` 已由 `.gitignore` 排除，不会被纳入提交。

---

## 许可证

请遵循本仓库声明的许可证条款。

---

<p align="center">
  <em>Aurora Vine · 极光藤 — 让留学规划更清晰</em>
</p>
