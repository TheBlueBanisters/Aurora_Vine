# Aurora Vine · 极光藤

<p align="center">
  <strong>让留学规划更清晰 · A Clearer Path to Studying Abroad</strong>
</p>

Aurora Vine 是一款面向留学申请者的 **Electron 桌面应用**，用于整理学术背景、浏览与收藏院校、查看申请案例、管理每日任务与社区交流。渲染层为原生 HTML / CSS / JavaScript，按功能拆分为 `renderer/modules/` 下的 ES 模块；主进程逻辑集中在 `main.js` 与 `main/ipc/`。

---

## 功能概览

### 已实现

| 模块 | 说明 |
|------|------|
| **功能简介** | 启动页产品介绍与轮播；支持登录 / 注册 / 游客进入主界面 |
| **定校规划** | 多段表单收集本科背景、GPA、语言标化等；结果与建议依赖前端逻辑（`planning.js`、`scoring.js`）；数据按账号 / 游客写入 **localStorage** |
| **我的背景** | 展示已填背景；ECharts / ECharts-GL 可视化标化成绩 |
| **院校大全** | 分页列表、**关键词搜索**（`schools:search`）、**地区筛选**（英美新港欧等）；收藏；详情覆盖层含介绍、官网、地址、图片与 **专业列表**（`schools:getProgramsBySchoolId`） |
| **目标院校** | 管理已收藏院校，按 QS 排名排序 |
| **院校详情** | 覆盖层 + 灯箱；可从详情查看该校相关 **申请案例** |
| **留学规划** | **留学规划大纲**：支持将结构化文本解析为多条规划并写入 SQLite（`study_plan`）；列表展示与删除。**智能留学规划**（AI 自动生成）仍为占位 |
| **每日打卡** | 日历 + 当日任务列表；每日最多 **9** 条；完成状态、颜色标记；支持 **`dailyCheckin:appendTasks` 追加**与 **`dailyCheckin:clearAll` 清空全部** |
| **院校数据库** | 占位页（独立「数据库」查询体验尚未实现；院校数据已通过「院校大全」与 SQLite 提供） |
| **申请案例** | 分页列表、关键词搜索、本科层级 / GPA / 语言 / 软背景 / 排序等多维筛选；详情弹窗（背景、标化、软背景、Offer 列表）；与院校详情联动 |
| **资源中心** | 占位页 |
| **社区留言** | 发帖、回复、嵌套评论；可删除自己的帖子 / 回复 |
| **设置** | 夜间模式、个人信息、头像上传、邀请码认证、关于 |

### 账户系统

- 邮箱密码注册 / 登录；游客模式（无需登录即可浏览与填写）
- 邀请码认证（认证为学长 / 学姐类型，邀请码由主进程配置）
- 头像：JPEG / PNG / WebP，大小限制由主进程校验（默认 ≤ 500KB）
- 定校规划与主题等仍主要使用 **localStorage**；账户与打卡等见下文「数据与存储」

---

## 技术栈

| 类型 | 技术 |
|------|------|
| 桌面壳 | Electron 33 |
| 构建 | electron-vite 3.x |
| 数据库 | better-sqlite3（单库 `data/school_item.db`） |
| 图表 | ECharts 5.x、echarts-gl |
| 通知 | NotifyX |
| 数据脚本 | xlsx（`data/init_db.js` 读取 `major/` 下专业表） |
| 渲染 | 原生 HTML / CSS / JavaScript（无 React / Vue） |

---

## 环境要求

- **Node.js** 18+
- **npm** 9+

依赖中包含 **better-sqlite3** 原生模块：`npm install` 后会通过 `postinstall` 执行 `electron-rebuild`；若启动报错可手动执行 `npm run prestart`（与 `prestart` 脚本相同）。

---

## 快速开始

### 1. 克隆与安装

```bash
git clone <repository-url>
cd Aurora_Vine
npm install
```

### 2. 初始化院校与案例数据库（必读）

首次或需要 **全量重建** 数据时，在项目根目录执行：

```bash
node data/init_db.js
```

脚本会 **删除已有的** `data/school_item.db` 并重新创建，主要步骤包括：

- 扫描 `school/No.{QS排名}/` 目录（与 `intro.json`、校徽与图片等素材）写入 `schools` 表
- 若存在 `major/` 下的 **`.xlsx`** 工作簿，导入 `school_programs` 表
- 若存在 `personalCase/` 下的 **`.csv`**，导入 `application_cases` 与 `application_case_offers` 表

当前仓库中 `school/` 下约有 **200** 个院校目录（与 QS 排名文件夹对应）；具体条数以脚本运行日志与数据库为准。

**目录命名、`intro.json` / xlsx 表头、csv 列名等细则** 见下文 **[数据准备](#数据准备)**。

### 3. 开发模式

```bash
npm run dev
```

- 渲染进程由 Vite 提供，支持 HMR；修改 `renderer/` 下文件会热更新
- 开发服务器默认：`http://127.0.0.1:5173`（见 `electron.vite.config.js`）
- 开发时通过中间件映射 `/image` → 项目根目录 `image/`，便于加载静态图

主进程或 `preload.js` 变更后需重启 Electron；也可使用：

```bash
npx electron-vite dev --watch
```

### 4. 生产构建与运行

```bash
npm run build
npm start
```

构建输出位于 `out/`（`main`、`preload`、`renderer`）。`package.json` 中 `"main"` 指向 `out/main/main.js`。

---

## 数据准备

执行 `node data/init_db.js` 前，请按需准备下列目录。**脚本会删除已有的 `data/school_item.db` 并新建**；该文件同时存放账户、打卡、社区、留学规划等运行期数据，**重建后这些内容会一并丢失**，重要数据请先备份。

### 1. 院校目录 `school/`（必填）

- 每个院校一个子文件夹，命名 **`No.{QS排名}`**（例如 `No.2`、`No.163`），与数据库中的 `ranking_qs` 一致。
- **必备文件**
  - **`intro.json`**：至少包含 `intro.zh` / `intro.en`（字符串数组，用于解析中/英校名、简称）、`contact`（官网 URL）、`address.zh` / `address.en`（用于推断国家与城市）。可参考仓库内现有院校的 `intro.json`。
  - **校徽 PNG**：目录内需有 **至少一个 `.png` 且文件名不是纯数字**（如 `帝国理工学院.png`）；脚本用它作为 `logo_filename`，并辅助推断中文校名。
- 详情页轮播图等可使用 `1.jpg`、`2.jpg` 等数字文件名（导入脚本不强制要求，应用内会按现有逻辑加载）。

### 2. 专业表 `major/`（可选）

- 放置 **一个** `.xlsx` 工作簿（忽略 Excel 临时文件 `~$*.xlsx`）；读取 **第一张工作表**，**第一行为表头**。
- **必须能匹配到列**（表头文字可与下列任一别名一致，脚本会做规范化比对）：
  - 中文校名：`大学名称 (CN)`、`大学名称(CN)`、`大学名称`、`院校名称` 等变体。
  - 英文校名：`University Name (EN)`、`University Name`、`院校英文名` 等。
  - 中文专业：`开设专业 (CN)`、`开设专业`、`专业名称` 等。
  - 英文专业：`Program Name (EN)`、`Program Name`、`专业英文名` 等。
- **可选列**：学费（如 `学费 (Est.)`、`Tuition`）、`语言要求`、`学制`、培养方案简述中/英、`专业难度系数` 等（详见 `data/init_db.js` 中的 `PROGRAM_COLUMN_ALIASES`）。
- 每一行专业数据中的校名须能在 **`school/` 已导入的院校** 中唯一定位；无法匹配或多校冲突时，脚本会 **报错并终止**（并提示行号）。

### 3. 申请案例 `personalCase/`（可选）

- 放置 **一个** `.csv`；脚本取目录中第一个匹配的文件。
- 文件内容按 **`GB18030`** 解码读取（便于兼容 Excel 在中文 Windows 下的默认导出）。若使用 UTF-8 保存，可能出现乱码，需改为 GB18030/ANSI 或与脚本解码方式一致。
- CSV 使用 **英文逗号** 分隔的简单格式（字段值中请勿包含未转义的逗号；仓库示例见 `personalCase/个人案例整理.csv`）。
- 表头可含 **额外列**（如示例中的说明列），脚本只读取下列列名，其余忽略。
- **表头建议使用下列中文列名**（与 `init_db.js` 中读取逻辑一致）：

| 列名 | 说明 |
|------|------|
| `案例序号` | 整数，唯一标识案例 |
| `本科层次` | 如 985、211、海本、双非、中外合作等（影响标签与背景分） |
| `绩点分制` | 如 `5分制`、`4分制`，用于归一化计算 |
| `绩点` | 数值 |
| `绩点排名百分比` | 可带 `%`，用于排名相关标签与得分 |
| `雅思成绩` / `托福成绩` | 无成绩可填 `0` |
| `GRE` / `GRE写作` | 无则 `0` |
| `实习数量` / `科研数量` / `论文数量` | 整数，缺失可填 `0` |

案例的 **Offer 列表** 由脚本根据院校列表与专业数据 **自动分配**（非 CSV 直接列出）；导入专业表有助于 Offer 关联到 `school_programs`。

---

## 项目结构（摘要）

```
Aurora_Vine/
├── main.js                    # 主进程入口：窗口、主题 IPC、注册各 IPC 模块
├── preload.js                 # 预加载：向渲染进程暴露 window.api
├── electron.vite.config.js    # electron-vite：main / preload / renderer 构建与 dev 中间件
├── package.json
│
├── main/
│   ├── ipc/                   # 按域拆分的 IPC：auth、avatar、schools、daily-checkin、
│   │                          # study-planning、community、application-cases
│   └── utils/                 # db、crypto、security 等
│
├── data/
│   ├── init_db.js             # 重建 SQLite：院校、专业、申请案例
│   ├── school_item.db         # 运行期数据库（init 后生成，勿提交敏感数据）
│   └── school_item.sql        # schools 表示例（完整表结构以 init_db 为准）
│
├── school/                    # 院校素材：No.{ranking}/intro.json、logo、图片等
├── major/                     # 可选：专业信息 xlsx，供 init_db 导入
├── personalCase/              # 可选：申请案例 csv，供 init_db 导入
├── image/                     # 应用静态图、启动轮播等
│
├── renderer/
│   ├── index.html
│   ├── style.css
│   ├── app.js                 # 入口：导航、各模块 init
│   └── modules/               # auth、schools、profile、planning、daily-checkin、
│                              # study-planning、application-cases、community、settings 等
│
└── out/                       # npm run build 产物
```

---

## 数据与存储

所有 SQLite 数据（只读院校 / 案例 + 可写业务表）均在 **`data/school_item.db`**：

| 类别 | 表 / 位置 | 说明 |
|------|-----------|------|
| 院校与专业 | `schools`、`school_programs` | 由 `init_db.js` 从 `school/`、`major/` 导入 |
| 申请案例 | `application_cases`、`application_case_offers` | 由 `init_db.js` 从 `personalCase/` 导入 |
| 账户与会话 | `accounts`、`app_session` | 启动时 `ensureAccountTables` 自动建表 / 迁移 |
| 每日打卡 | `daily_checkin` | 含 `completed`、`sort_order` 等 |
| 留学规划大纲 | `study_plan` | 标题、描述、任务 JSON、颜色、创建时间 |
| 社区 | `community_posts`、`community_replies` | 帖子与嵌套回复 |

**localStorage**（浏览器存储，按用户目录隔离）：定校规划 `schoolPlanningProfile` 及账号 / 游客键、目标院校 `targetSchools`、主题 `theme` 等。

**头像文件**：保存在系统 **userData** 目录下，通过自定义协议 `avatar://account/{id}` 引用。

---

## 主进程 IPC 通道（window.api 对应关系）

渲染进程通过 `preload.js` 暴露的方法调用下列通道（命名与 `ipcMain.handle` 一致）：

| 通道 | 说明 |
|------|------|
| `theme:apply` | 同步窗口标题栏与背景主题 |
| `auth:*` | `getCurrentUser`、`enterGuest`、`register`、`login`、`logout`、`updateNickname`、`certify`、`uploadAvatar` |
| `avatar:getDataUrl` | 读取指定账号头像为 Data URL |
| `schools:list` | 分页列表，支持 `filters.region` 等地区条件 |
| `schools:search` | 关键词搜索 + 同等地区筛选 |
| `schools:getById` / `schools:getByIds` | 单校 / 批量 |
| `schools:getProgramsBySchoolId` | 该校专业列表 |
| `schools:getIntro` / `getAssetPath` / `getAssetDataUrl` | intro.json 与素材路径 / Data URL |
| `applicationCases:list` | 分页 + `filters`（关键词、本科层级、GPA / 语言 / 软背景、院校 ID、排序等） |
| `applicationCases:getDetail` | 案例详情（含 offers） |
| `applicationCases:listBySchoolId` | 某校关联案例（详情页展示） |
| `dailyCheckin:getByDate` / `listByMonth` / `saveByDate` | 按日 / 月读写打卡 |
| `dailyCheckin:appendTasks` | 向当日追加任务（仍受 9 条上限约束） |
| `dailyCheckin:clearAll` | 清空所有打卡记录 |
| `studyPlan:save` / `list` / `delete` | 留学规划大纲批量写入、列表、按 ID 删除 |
| `community:listPosts` / `getPostDetail` / `createPost` / `createReply` / `deletePost` / `deleteReply` | 社区 |

---

## 自定义协议

- `school://No.{ranking}/{filename}`：读取 `school/` 下对应排名文件夹中的静态资源  
- `avatar://account/{id}`：用户头像

均在 `app.whenReady` 后通过 `protocol` 注册（见 `main/ipc/schools.js`、`main/ipc/avatar.js`）。

---

## 开发说明

- 渲染进程启用 **`contextIsolation`**，禁用 Node 集成；仅通过 **`window.api`** 与主进程通信。
- 亮 / 暗主题通过 `document.documentElement.dataset.theme` 与 `theme:apply` 协同。
- 院校列表无数据库文件时，IPC 会返回明确错误提示，引导执行 `node data/init_db.js`。

---

## 许可证

请遵循项目仓库中声明的许可证条款。

---

*Aurora Vine · 极光藤 — 让留学规划更清晰*
