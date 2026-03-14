# Aurora Vine · 极光藤

<p align="center">
  <strong>让留学规划更清晰 · A Clearer Path to Studying Abroad</strong>
</p>

Aurora Vine 是一款为留学申请者设计的桌面规划工具，基于 Electron 构建。帮助用户整理学术背景、探索院校信息、管理目标院校，并通过每日打卡与社区交流保持申请节奏。

---

## 功能概览

### 已实现功能

| 模块 | 说明 |
|------|------|
| **功能简介** | 启动页展示产品介绍与轮播图，支持登录 / 注册 / 游客模式进入 |
| **定校规划** | 多段表单收集本科背景、GPA、语言标化成绩，保存至本地 |
| **我的背景** | 展示已填写的背景信息，ECharts 条形图可视化标化成绩 |
| **院校大全** | 分页浏览院校列表，收藏感兴趣院校，点击进入详情 |
| **目标院校** | 管理已收藏院校，按 QS 排名排序 |
| **院校详情** | 覆盖层展示院校介绍、官网、地址、图片轮播与灯箱 |
| **留学规划** | 占位页，功能规划中 |
| **每日打卡** | 日历视图 + 任务列表，每日最多 9 条任务，支持完成状态标记 |
| **院校数据库** | 占位页，功能规划中 |
| **申请案例** | 占位页，功能规划中 |
| **资源中心** | 占位页，功能规划中 |
| **社区留言** | 发帖、回复、嵌套评论，支持删除自己的帖子/回复 |
| **设置** | 夜间模式、个人信息、头像上传、账户认证、关于 |

### 账户系统

- 邮箱密码注册 / 登录
- 游客模式（无需登录即可浏览与填写）
- 邀请码认证（认证为学长/学姐）
- 头像上传（JPEG / PNG / WebP，≤ 500KB）
- 定校规划数据按账号/游客分别存储

---

## 技术栈

| 类型 | 技术 |
|------|------|
| 框架 | Electron 33 |
| 构建 | electron-vite 3.x |
| 数据库 | better-sqlite3 |
| 图表 | ECharts 5.x、ECharts-GL |
| 通知 | NotifyX |
| 渲染 | 原生 HTML / CSS / JavaScript（无前端框架） |

---

## 环境要求

- **Node.js** 18+
- **npm** 9+

---

## 快速开始

### 1. 克隆与安装

```bash
git clone <repository-url>
cd Aurora_Vine
npm install
```

### 2. 初始化数据库

首次运行前需初始化院校数据库：

```bash
node data/init_db.js
```

将生成 `data/school_item.db`，预置 MIT、帝国理工、斯坦福、牛津、哈佛 5 所院校。

### 3. 开发模式

```bash
npm run dev
```

- 渲染进程支持 HMR，修改 `renderer/` 下文件会自动热更新
- 开发服务器默认地址：http://localhost:5173

主进程或 preload 变更后需重启应用，可使用：

```bash
npx electron-vite dev --watch
```

### 4. 生产构建与运行

```bash
npm run build
npm start
```

构建产物在 `out/` 目录。

---

## 项目结构

```
Aurora_Vine/
├── main.js                 # Electron 主进程
├── preload.js              # 预加载脚本，暴露 window.api
├── electron.vite.config.js # electron-vite 配置
├── package.json
│
├── data/
│   ├── init_db.js          # 初始化院校数据库
│   ├── school_item.db      # SQLite 数据库（运行 init_db 后生成）
│   └── school_item.sql     # 建表 SQL 参考
│
├── school/                 # 院校素材
│   └── No.1 ~ No.5/        # 每所院校：intro.json、logo.svg、1.jpg~5.jpg
│
├── image/                  # 应用静态图片
│   ├── logo.png、logo_n.png
│   ├── welcome.png、plan.png、hi.png
│   └── intro/              # 启动页轮播图
│
├── renderer/
│   ├── index.html          # 主页面
│   ├── style.css           # 全局样式（含亮/暗主题）
│   └── app.js              # 前端逻辑
│
└── out/                    # 构建输出（npm run build 后）
    ├── main/
    ├── preload/
    └── renderer/
```

---

## 数据与存储

| 数据类型 | 存储位置 | 说明 |
|----------|----------|------|
| 院校数据 | SQLite `data/school_item.db` | 院校基础信息，需 `node data/init_db.js` 初始化 |
| 账户 / 会话 | SQLite | `accounts`、`app_session` 表，主进程自动创建 |
| 每日打卡 | SQLite | `daily_checkin` 表 |
| 社区帖子 / 回复 | SQLite | `community_posts`、`community_replies` 表 |
| 定校规划 | localStorage | `schoolPlanningProfile` 及其账号/游客变体 |
| 目标院校 | localStorage | `targetSchools` |
| 主题 | localStorage | `theme`（`light` / `dark`） |

---

## 主进程 IPC 通道

| 通道 | 说明 |
|------|------|
| `theme:apply` | 应用主题到窗口（标题栏、背景色） |
| `auth:getCurrentUser` | 获取当前登录状态 |
| `auth:enterGuest` | 进入游客模式 |
| `auth:register` | 注册 |
| `auth:login` | 登录 |
| `auth:logout` | 退出登录 |
| `auth:updateNickname` | 更新昵称 |
| `auth:certify` | 邀请码认证 |
| `auth:uploadAvatar` | 上传头像 |
| `avatar:getDataUrl` | 获取头像 Data URL |
| `schools:list` | 分页查询院校列表 |
| `schools:getById` | 按 school_id 获取院校详情 |
| `schools:getIntro` | 读取院校 intro.json |
| `schools:getAssetPath` | 院校素材路径 |
| `schools:getAssetDataUrl` | 院校素材 Data URL |
| `dailyCheckin:getByDate` | 按日期获取打卡任务 |
| `dailyCheckin:listByMonth` | 按月份获取打卡数据 |
| `dailyCheckin:saveByDate` | 保存当日打卡任务 |
| `community:listPosts` | 分页获取帖子列表 |
| `community:getPostDetail` | 获取帖子详情及回复 |
| `community:createPost` | 发帖 |
| `community:createReply` | 回复 |
| `community:deletePost` | 删除帖子 |
| `community:deleteReply` | 删除回复 |

---

## 自定义协议

- `school://No.{ranking}/{filename}`：院校素材（logo、图片等）
- `avatar://account/{id}`：用户头像

---

## 开发说明

- 渲染进程使用 `contextIsolation`，通过 `window.api` 调用主进程能力
- 主进程通过 `protocol.handle` 注册 `school`、`avatar` 协议
- 亮/暗主题通过 `document.documentElement.dataset.theme` 切换
- 更多细节见 [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## 许可证

请遵循项目仓库中声明的许可证条款。

---

*Aurora Vine · 极光藤 — 让留学规划更清晰*
