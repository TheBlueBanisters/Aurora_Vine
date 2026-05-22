# Aurora Vine — AI 代码包说明

本压缩包为 **关键源码快照**，用于让其他 AI 理解全项目架构与实现，非可独立运行的完整发行版。

## 如何使用

1. 先读 **PROJECT_TREE.txt**：了解完整仓库有哪些路径，以及哪些未打入包内。
2. 再读 **README.md**、**功能汇总.md**：产品功能与模块划分。
3. 入口：`main.js`（主进程）→ `preload.js`（IPC 桥）→ `renderer/app.js`（渲染进程）。
4. 业务 IPC：`main/ipc/`；LLM 管线：`main/llm/`；前端模块：`renderer/modules/`。

## 已包含

- Electron 主进程、预加载、渲染层全部 `.js` / `.html` / `.css`
- LLM prompts（`main/llm/prompts/*.md`）
- 数据库初始化脚本与 SQL（不含 `.db`）
- `package.json`、`.gitignore`、`electron.vite.config.js`
- `school/No.1/intro.json` 作为院校元数据样本

## 刻意省略（见 PROJECT_TREE）

| 路径 | 原因 |
|------|------|
| `school/No.*/` 图片与其余 199 校 intro | 体积大；结构见样本与 PROJECT_TREE |
| `image/`、`major/`、`personalCase/` | 媒体与外部数据表 |
| `data/school_item.db` | 运行时库，可 `node data/init_db.js` 重建 |
| `node_modules/`、`out/` | 依赖与构建产物 |
| `package-lock.json` | 体积大，非理解架构必需 |

## 重建数据

```bash
node data/init_db.js
```

需本地具备完整 `school/`、`major/`、`personalCase/`（本包未带）。

## 技术栈

Electron 33 · better-sqlite3 · electron-vite · DeepSeek API · ECharts · KaTeX
