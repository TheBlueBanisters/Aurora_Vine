# Aurora Vine 用户手册大纲

> 依据 `软件实作要求.pdf` 中 Proof-of-Concept Software 的 User Manual Guidelines 整理。PoC 提交需要包含一份 10-15 页 PDF 用户手册，说明软件的安装、运行、配置与使用方式，并在可用时提供 GitHub 仓库链接。

## 封面与前置部分

### Title Page

- 文档标题：Aurora Vine User Manual
- 项目名称：Aurora Vine
- 课程名称与代码：JC3510 Intelligent Software Implementation
- 小组编号、组员姓名与学号
- 提交日期
- GitHub 仓库链接：`https://github.com/TheBlueBanisters/Aurora_Vine`

### Document Information

- 文档版本，例如 `v1.0`
- 适用软件版本，例如 `Aurora Vine v1.0.0`
- 目标读者：课程评审人员、演示人员、首次使用系统的学生用户
- 文档范围：介绍如何安装、启动、配置和使用 Aurora Vine 的 PoC 版本

### Table of Contents

- 自动生成目录。
- 如最终 PDF 截图较多，可加入 List of Figures。

---

## 1. Introduction

本章用于说明 Aurora Vine 是什么、面向谁、解决什么问题。建议 1 页。

### 1.1 Purpose of the Manual

- 说明本手册用于指导用户安装、运行和使用 Aurora Vine。
- 强调本手册是 PoC Software 提交的一部分，配合软件压缩包使用。
- 简要说明手册覆盖：
  - 系统安装与运行
  - 数据库初始化
  - AI API Key 配置
  - 核心功能使用流程
  - 常见问题与限制

### 1.2 System Overview

- 简要介绍 Aurora Vine：
  - 一款面向留学申请者的 Electron 桌面应用。
  - 集成背景画像、院校探索、申请案例、AI 辅助规划、每日打卡和社区讨论。
  - 目标是帮助学生把分散的信息和抽象建议转化为可执行的申请计划。
- 可放一张系统首页或主界面截图。

### 1.3 Target Users

- 探索阶段用户：尚未确定目标院校或申请方向，需要浏览院校、项目和案例。
- 规划阶段用户：已有初步申请目标，需要整理个人背景、生成规划并跟踪任务。
- 演示/评审用户：需要快速验证 PoC 是否实现 proposal 中定义的核心功能。

### 1.4 PoC Scope

- 本 PoC 展示的核心能力：
  - 用户登录、注册和游客模式
  - 个人背景录入与展示
  - 院校数据库和申请案例浏览
  - AI 定校规划与学习规划
  - 每日任务打卡
  - 资源中心、社区和设置功能
- 明确边界：
  - 不训练自有大模型。
  - 不自动提交正式申请。
  - AI 输出仅作为辅助建议，需要用户自行判断和修改。

---

## 2. System Requirements

本章覆盖软件运行前置条件，回应用户手册中 prerequisites/configurations 的要求。建议 1 页。

### 2.1 Hardware Requirements

- 普通个人电脑即可运行。
- 建议内存：8 GB 或以上。
- 建议保留足够磁盘空间用于依赖安装、数据库和用户上传文件。

### 2.2 Software Requirements

- 操作系统：Windows 10/11；Electron 也支持跨平台构建，但本项目演示可优先说明 Windows 环境。
- Node.js：建议使用当前 LTS 版本。
- npm：随 Node.js 安装。
- Git：用于克隆仓库。
- 可选：Python，用于运行社区示例数据修复脚本。

### 2.3 Network and API Requirements

- 基础浏览和本地数据功能可在本地运行。
- AI 相关功能需要网络连接和 DeepSeek API Key。
- API Key 在应用的 Settings 页面配置，保存在本机用户数据目录，不应提交到 Git 仓库。

### 2.4 Included Project Files

- `package.json`：项目依赖与运行脚本。
- `data/init_db.js`：初始化 SQLite 数据库。
- `data/school_item.db`：本地数据库文件。
- `school/`：院校资料与图片资源。
- `major/`：专业数据表。
- `personalCase/`：申请案例数据。
- `renderer/`：前端页面和交互模块。
- `main/`：Electron 主进程、IPC、LLM 与工具模块。

---

## 3. Installation Guide

本章说明从源码安装和首次准备环境的步骤。建议 1-1.5 页。

### 3.1 Clone the Repository

```bash
git clone https://github.com/TheBlueBanisters/Aurora_Vine.git
cd Aurora_Vine
```

- 说明如果通过课程提交的 zip 包获取源码，则解压后进入项目根目录即可。

### 3.2 Install Dependencies

```bash
npm install
```

- 说明项目依赖 Electron、electron-vite、better-sqlite3、OpenAI SDK、ECharts 等。
- 说明 `better-sqlite3` 是原生依赖，安装后会通过 `electron-rebuild` 重建。

### 3.3 Fix Native Dependency Issues

```bash
npm run prestart
```

- 当应用启动时出现 `better-sqlite3` 相关错误时，可运行该命令。
- 如仍失败，可重新执行 `npm install`。

### 3.4 Initialize the Database

```bash
node data/init_db.js
```

- 说明该命令会重建 `data/school_item.db`。
- 数据来源包括：
  - `school/` 中的院校资料
  - `major/*.xlsx` 中的专业数据
  - `personalCase/*.csv` 中的申请案例
- 注意：重新初始化会清空运行时数据，例如账号、打卡、社区帖子和学习计划。正式演示前应确认是否需要备份数据库。

---

## 4. Running the Application

本章说明开发运行、构建运行和首次进入应用。建议 1 页。

### 4.1 Development Mode

```bash
npm run dev
```

- 适用于开发和演示调试。
- 渲染进程支持 Vite 热更新。
- 修改主进程、preload 或 IPC 文件后通常需要重启 Electron。

### 4.2 Production Build

```bash
npm run build
npm start
```

- `npm run build` 会将构建结果输出到 `out/`。
- `npm start` 从构建后的入口运行应用。

### 4.3 First Launch

- 启动后进入 Aurora Vine 欢迎页。
- 用户可选择：
  - 登录已有账号
  - 注册新账号
  - 使用游客模式
- 建议放一张欢迎页或登录弹窗截图。

---

## 5. Account and Basic Navigation

本章说明用户如何进入系统、切换主要模块。建议 1 页。

### 5.1 Login, Registration, and Guest Mode

- 注册：输入邮箱、昵称和密码。
- 登录：使用邮箱和密码进入个人账号。
- 游客模式：无需注册即可体验部分功能，适合快速演示。
- 说明账号数据保存在本地 SQLite 数据库中。

### 5.2 Main Layout

- 左侧导航栏分为：
  - 核心入口：定校规划、我的背景
  - 目标推进：目标院校、留学规划、每日打卡
  - 信息参考：院校数据库、申请案例、资源中心、社区、设置等
- 右侧为当前功能页面。
- 建议放一张主界面截图，并标注导航栏和内容区域。

### 5.3 Language and Theme

- 用户可在 Settings 中切换中文/英文界面。
- 用户可切换浅色/深色主题。
- 深色模式包含萤火虫等视觉效果，用于提升界面体验。

---

## 6. School Planning

本章是核心使用流程之一，说明如何录入背景并生成定校建议。建议 1.5-2 页。

### 6.1 Open School Planning

- 从左侧导航栏点击“定校规划 / School Planning”。
- 页面用于收集用户本科背景、GPA、语言考试、科研、实习、论文和申请偏好。

### 6.2 Fill in Academic Profile

- 填写学校层次、本科专业、GPA、排名或百分位信息。
- 填写 IELTS、TOEFL、GRE 等标化考试信息。
- 填写科研、实习、论文等软背景数量。
- 说明必填项和可选项，避免用户空缺关键数据导致评估不准确。

### 6.3 Upload Resume

- 可选上传 PDF、DOC 或 DOCX 简历。
- 系统会提取简历文本，用于 AI 简历评分和规划生成。
- 如不上传简历，系统仍可根据表单信息生成结构化背景输入。

### 6.4 Generate Competitiveness Score and AI Outline

- 提交后系统会计算本地竞争力分数。
- 配置 API Key 后，可生成：
  - 背景分析
  - 申请策略建议
  - 冲刺、匹配、保底院校分层
  - 个人陈述草稿
- 强调 AI 输出是辅助建议，用户应结合实际申请要求自行判断。
- 建议放一张定校规划表单截图和一张 AI 输出结果截图。

---

## 7. My Profile and Target Universities

本章说明用户如何查看个人背景和管理目标院校。建议 1 页。

### 7.1 My Profile

- 展示已保存的个人背景信息。
- 使用图表展示语言成绩和关键指标。
- 展示 AI 生成的个人陈述草稿。
- 支持返回编辑背景信息。

### 7.2 Target Universities

- 用户可从院校数据库或定校建议中收藏目标院校。
- 目标院校列表可按 QS 排名等信息展示。
- 用户可从列表快速进入学校详情页。

### 7.3 Suggested Screenshots

- 我的背景页面截图。
- 目标院校列表截图。

---

## 8. Study Planning and Daily Check-in

本章说明如何把 AI 规划转化为可执行任务。建议 1.5-2 页。

### 8.1 Study Planning Overview

- 留学规划页面提供：
  - AI 规划大纲
  - 智能时间表
  - 自定义计划导入
  - 院校分层与意向院校信息
- 说明该模块对应 proposal 中“从抽象建议转化为结构化任务”的目标。

### 8.2 Generate Smart Schedule

- 点击 Regenerate Smart Schedule 或对应中文按钮。
- 系统调用 LLM 生成阶段性计划。
- 系统将计划进一步转换为每日打卡任务。
- 若 AI 结果不完整，系统会使用 fallback 逻辑补充任务。

### 8.3 Import Tasks into Daily Check-in

- 智能时间表生成后，可导入每日打卡模块。
- 每日打卡页面以日历形式展示任务。
- 每天最多可显示 9 个任务，并支持完成状态和颜色标签。

### 8.4 Custom Plan

- 用户可输入结构化文本计划。
- 系统解析后保存到 SQLite。
- 适合用户手动调整 AI 生成结果或补充个人安排。

### 8.5 Suggested Screenshots

- 留学规划页面截图。
- 智能时间表截图。
- 每日打卡日历截图。
- 单日任务完成状态截图。

---

## 9. Information Browsing Modules

本章说明院校、案例和资源中心的使用方式。建议 1.5 页。

### 9.1 University Database

- 支持浏览约 200 所院校。
- 支持按关键词、地区等条件搜索和筛选。
- 学校详情页包含：
  - 学校简介
  - 官网、地址和联系方式
  - 图片轮播
  - 专业列表
  - 相关申请案例
- 用户可收藏院校到目标院校列表。

### 9.2 Application Cases

- 用户可浏览真实申请案例。
- 支持按学校层次、GPA、语言成绩、软背景等条件筛选。
- 案例详情可帮助用户对比自身背景和申请结果。

### 9.3 Resource Center

- 提供 GRE、IELTS、TOEFL、SOP、简历模板等资料入口。
- 支持富文本内容和 KaTeX 数学公式渲染。
- 说明该模块用于辅助用户准备申请材料和考试。

### 9.4 Suggested Screenshots

- 院校数据库列表。
- 学校详情侧栏。
- 申请案例筛选页面。
- 资源中心页面。

---

## 10. Community and Settings

本章说明辅助功能和系统配置。建议 1 页。

### 10.1 Community

- 用户可以创建帖子。
- 用户可以查看帖子详情并回复。
- 用户可删除自己发布的帖子或回复。
- 说明社区功能用于同伴交流和经验分享。

### 10.2 Settings

- 语言切换：中文/英文。
- 主题切换：浅色/深色。
- 个人资料：昵称、头像等。
- DeepSeek API Key：用于开启 AI 功能。
- 邀请码验证：如演示需要，可说明验证入口和用途。
- 清除个人数据：用于重置本地用户体验数据。

### 10.3 Configure DeepSeek API Key

- 打开 Settings。
- 展开 API Key 区域。
- 输入 DeepSeek API Key 并保存。
- 回到 School Planning 或 Study Planning 使用 AI 功能。
- 提醒：不要把 API Key 写入文档截图或提交到仓库。

---

## 11. Typical User Workflow

本章用一个完整示例串联系统功能，帮助评审快速理解 PoC。建议 1 页。

### 11.1 Workflow Example

1. 启动应用并注册账号。
2. 进入 School Planning，填写本科背景、GPA、语言成绩和软背景。
3. 可选上传简历。
4. 保存并生成 AI 定校规划。
5. 查看 My Profile 中的背景摘要和个人陈述草稿。
6. 在 University Database 中浏览学校并收藏目标院校。
7. 在 Application Cases 中查找相似背景案例。
8. 在 Study Planning 中生成智能时间表。
9. 将计划导入 Daily Check-in。
10. 每天完成任务并更新打卡状态。

### 11.2 Demonstration Path for Evaluators

- 若演示时间有限，可按以下顺序展示：
  - 登录或游客模式
  - 定校规划表单
  - AI 定校建议
  - 院校数据库和案例筛选
  - 学习规划生成
  - 每日打卡导入结果

---

## 12. Troubleshooting and FAQ

本章回答常见运行问题。建议 1 页。

### 12.1 Empty School List

- 可能原因：数据库未初始化。
- 解决方法：

```bash
node data/init_db.js
```

### 12.2 better-sqlite3 Error

- 可能原因：Electron 与原生依赖未正确重建。
- 解决方法：

```bash
npm run prestart
```

### 12.3 AI Function Fails

- 检查网络连接。
- 检查 Settings 中是否已保存 DeepSeek API Key。
- 确认 API Key 有效且额度可用。
- 查看主进程控制台日志以定位错误。

### 12.4 Smart Schedule or Daily Tasks Are Incomplete

- 可重新生成智能时间表。
- 系统包含 fallback 和 gap-fill 逻辑，但 AI 输出仍可能需要用户人工确认。

### 12.5 Reinitializing Database Removed My Data

- `node data/init_db.js` 会删除并重建 `data/school_item.db`。
- 重新初始化前应备份数据库文件。

---

## 13. Data, Privacy, and Limitations

本章用于体现专业性和 AI 功能边界。建议 0.5-1 页。

### 13.1 Local Data Storage

- 账号、院校、案例、计划、打卡和社区数据主要保存在 SQLite 数据库中。
- API Key、简历和头像等文件保存在 Electron 的 userData 目录。
- 浏览器端偏好设置和部分用户状态使用 localStorage。

### 13.2 AI Output Disclaimer

- AI 生成结果仅用于辅助规划。
- 结果不代表学校官方要求、录取承诺或专业顾问意见。
- 用户应根据目标院校官网和个人情况进行复核。

### 13.3 Current Limitations

- PoC 阶段不覆盖正式申请提交。
- 不支持多端云同步。
- 院校、项目和案例数据取决于本地数据集完整性。
- AI 功能依赖第三方模型 API 的稳定性。

---

## 14. Appendix

本章放附录材料，视最终页数选择保留。建议 0.5-1 页。

### Appendix A: Command Summary

| Purpose | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Rebuild native dependency | `npm run prestart` |
| Initialize database | `node data/init_db.js` |
| Run in development mode | `npm run dev` |
| Build application | `npm run build` |
| Run production build | `npm start` |

### Appendix B: Main Feature Checklist

- 登录、注册、游客模式
- 背景信息录入
- 简历上传和文本提取
- AI 简历评分
- AI 定校规划
- 目标院校收藏
- 院校数据库浏览
- 申请案例筛选
- 留学规划生成
- 每日任务导入与打卡
- 资源中心
- 社区帖子和回复
- 中英文切换
- 深浅主题切换

### Appendix C: Suggested Figure List

- Figure 1. Welcome and login page
- Figure 2. Main navigation layout
- Figure 3. School Planning form
- Figure 4. AI-generated school tier recommendations
- Figure 5. My Profile dashboard
- Figure 6. University Database and detail panel
- Figure 7. Application Cases filter page
- Figure 8. Study Planning smart schedule
- Figure 9. Daily Check-in calendar
- Figure 10. Settings and API Key configuration

---

## Suggested Page Allocation

| Section | Suggested Pages |
| --- | --- |
| Cover, document information, contents | 1 |
| Introduction | 1 |
| System requirements | 1 |
| Installation and running | 2 |
| Account and navigation | 1 |
| School Planning | 2 |
| Profile, target universities, study planning, check-in | 2-3 |
| Information modules, community, settings | 2 |
| Workflow, FAQ, privacy, appendix | 2 |

总页数建议控制在 10-15 页。最终成稿时可以通过截图数量和附录长度调整页数。
