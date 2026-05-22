<p align="center">
  <img src="image/logo.png" alt="Aurora Vine logo" width="120">
</p>

<h1 align="center">Aurora Vine</h1>

<p align="center">
  <strong>A clearer path to studying abroad</strong><br>
  <em>极光藤 · 让留学规划更清晰</em>
</p>

<p align="center">
  <img src="image/welcome.png" alt="Welcome illustration" width="420">
</p>

<p align="center">
  🌿 Electron desktop app · 🎓 ~200 universities · 🤖 DeepSeek-powered planning · 📅 Daily check-ins
</p>

---

**Aurora Vine** is an Electron desktop application for study-abroad applicants. It brings background profiling, university exploration, real application cases, AI-assisted planning, daily task tracking, and community discussion into one calm, focused workspace.

Built with vanilla **HTML / CSS / JavaScript** (ES modules in `renderer/modules/`), a modular **main process** (`main.js`, `main/ipc/`), and an optional **LLM pipeline** (`main/llm/`) powered by the DeepSeek API.

---

## 📑 Table of Contents

- [✨ Highlights](#-highlights)
- [🧭 Features](#-features)
- [🤖 AI & LLM Pipeline](#-ai--llm-pipeline)
- [👤 Accounts & Access](#-accounts--access)
- [🛠 Tech Stack](#-tech-stack)
- [⚙️ Requirements](#️-requirements)
- [🚀 Quick Start](#-quick-start)
- [📦 Data Preparation](#-data-preparation)
- [🗂 Project Structure](#-project-structure)
- [🏗 Architecture](#-architecture)
- [💾 Data & Storage](#-data--storage)
- [🔌 IPC API Reference](#-ipc-api-reference)
- [🎨 Theme & i18n](#-theme--i18n)
- [🧑‍💻 Development](#-development)
- [☁️ Backup & Git](#️-backup--git)
- [📄 License](#-license)

---

## ✨ Highlights

<table>
  <tr>
    <td align="center" width="25%">
      <img src="image/plan.png" alt="School planning" width="80"><br>
      <strong>🎯 School Planning</strong><br>
      Profile form, scoring, AI school tiers
    </td>
    <td align="center" width="25%">
      <img src="image/board.png" alt="Study planning" width="80"><br>
      <strong>📋 Study Planning</strong><br>
      AI outline, smart schedule, custom plans
    </td>
    <td align="center" width="25%">
      <img src="image/planting.png" alt="AI loading" width="80"><br>
      <strong>🤖 AI Assistant</strong><br>
      Resume review, PS draft, daily tasks
    </td>
    <td align="center" width="25%">
      <img src="image/picnic.png" alt="Community" width="80"><br>
      <strong>💬 Community</strong><br>
      Posts, replies, peer discussion
    </td>
  </tr>
</table>

<p align="center">
  <img src="image/intro/1.jpg" alt="Intro 1" width="15%">
  <img src="image/intro/2.jpg" alt="Intro 2" width="15%">
  <img src="image/intro/3.jpg" alt="Intro 3" width="15%">
  <img src="image/intro/4.jpg" alt="Intro 4" width="15%">
  <img src="image/intro/5.jpg" alt="Intro 5" width="15%">
  <img src="image/intro/6.jpg" alt="Intro 6" width="15%">
</p>
<p align="center"><em>🖼️ In-app intro carousel — sample screens from <code>image/intro/</code></em></p>

---

## 🧭 Features

### Core modules

| Module | Description |
|--------|-------------|
| **📝 School Planning** | Collect undergrad background, GPA, IELTS/TOEFL/GRE, research/internship/paper counts; optional resume upload (PDF/DOC/DOCX). Computes a competitiveness score and, with an API key, generates an AI planning outline + reach/match/safety school tiers |
| **📊 My Profile** | Displays saved background data; ECharts visualization of test scores; shows LLM-generated personal statement draft; supports re-editing |
| **⭐ Target Universities** | Manage favorited schools, sorted by QS ranking, with quick access to detail pages |
| **📅 Study Planning** | **AI outline** (SWOT-style sections + school recommendations); **Smart schedule** (phase-level plan → daily check-in import); **Custom plan** (parse structured text into SQLite); tier & intended-school panels |
| **✅ Daily Check-in** | Calendar + up to **9 tasks per day**; completion state & color tags; bulk import from smart planning |
| **🏫 University Database** | Browse ~200 schools with search & region filters; detail sidebar with intro, website, address, image carousel, programs, related cases |
| **📂 Application Cases** | Paginated case library with rich filters (tier, GPA, language, soft background, sorting); slide-out detail; linked from school pages |
| **📚 Resource Center** | GRE / IELTS / TOEFL / SOP / resume templates and guides; rich content with **KaTeX** math rendering |
| **💬 Community** | Create posts & nested replies; delete your own content |
| **⚙️ Settings** | Language, light/dark theme, profile, avatar, DeepSeek API key, invite-code verification, clear personal data |
| **📖 Usage Guide** | First-run tour and feature walkthrough |

<p align="center">
  <img src="image/lecture.png" alt="Profile & resources" width="200">
  &nbsp;&nbsp;
  <img src="image/hi.png" alt="Sidebar mascot" width="120">
</p>

### UX polish

- 🪟 Frameless window with custom title bar (draggable)
- 🌞 Light theme — mint-green accents · 🌙 Dark theme — warm yellow accents on buttons
- 🌐 Chinese / English UI toggle
- ✨ Firefly particle effects in dark mode (logo, nav, selected cards)
- 🔔 Toast notifications, confirm dialogs, AI loading overlay with progress bar

---

## 🤖 AI & LLM Pipeline

Configure a **DeepSeek API key** under **Settings → API Key**. Keys are stored in the user `config.json` file — never committed to the repo.

### Flow

```
School Planning submit
  ├─ [optional] Resume upload → text extraction → LLM resume score
  ├─ Local competitiveness score (GPA / language / background / school tier [+ resume])
  ├─ LLM planning outline (entries + reach / match / safety tiers)
  └─ [optional] LLM personal statement draft → My Profile

Study Planning → Regenerate smart schedule
  ├─ LLM phase schedule (plan-schedule)
  ├─ LLM daily tasks (plan-daily-tasks, with retries)
  ├─ Fallback: expand schedule milestones to per-day tasks
  ├─ Gap fill: assign nearest phase task to uncovered dates
  └─ Bulk import to daily_checkin (single DB transaction)
```

### Without a resume

When no resume is uploaded, `main/llm/profile-context.js` builds structured LLM input from the form:

- `academic` — school tier, GPA, percentile
- `standardizedTests` — IELTS / TOEFL / GRE with taken / not-taken status
- `experience` — research, internship, paper counts
- `backgroundNarrative` — bilingual summary for the model

### Prompt templates

Located in `main/llm/prompts/`:

| File | Purpose |
|------|---------|
| `score-resume.md` | Resume quality scoring |
| `plan-outline.md` | Planning outline + school tiers |
| `plan-schedule.md` | Phase-level smart schedule |
| `plan-daily-tasks.md` | Executable daily check-in tasks |
| `personal-statement.md` | Personal statement draft |

### Resume parsing

- **PDF** — `pdf-parse` · **DOC/DOCX** — `mammoth` / `word-extractor`
- Files deduplicated by MD5; text cached under userData
- Image-only resumes are stored but OCR is not supported yet

---

## 👤 Accounts & Access

| Mode | Description |
|------|-------------|
| **Registered user** | Email + password; data tied to SQLite session |
| **Guest** | Browse and fill forms without login; separate localStorage keys |
| **Verified user** | Invite-code certification after login (code configured in `main/ipc/auth.js`) |

- 🖼️ Avatars: JPEG / PNG / WebP, max 512 KB, served via `avatar://` protocol
- 🔐 Guest vs account data isolated in `renderer/modules/storage.js`

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop | Electron 33 |
| Build | electron-vite 3.x |
| Database | better-sqlite3 (`data/school_item.db`) |
| LLM | OpenAI SDK → DeepSeek API |
| Charts | ECharts 5.x, echarts-gl |
| Math | KaTeX (resource center) |
| Documents | pdf-parse, mammoth, word-extractor |
| Data import | xlsx (`data/init_db.js`) |
| Notifications | NotifyX |
| Frontend | Native HTML / CSS / ES Modules |

---

## ⚙️ Requirements

- **Node.js** 18+
- **npm** 9+
- **Windows / macOS / Linux**

`better-sqlite3` is a native addon. After `npm install`, `postinstall` runs `electron-rebuild`. If the app fails to start:

```bash
npm run prestart
```

---

## 🚀 Quick Start

### 1️⃣ Clone & install

```bash
git clone https://github.com/TheBlueBanisters/Aurora_Vine.git
cd Aurora_Vine
npm install
```

### 2️⃣ Initialize the database (required on first run)

```bash
node data/init_db.js
```

This **deletes and recreates** `data/school_item.db`, importing:

- 🏫 Schools from `school/No.{QS_rank}/`
- 📘 Programs from `major/*.xlsx` (optional)
- 📋 Application cases from `personalCase/*.csv` (optional)

> ⚠️ **Warning:** Rebuilding the DB wipes runtime data (accounts, check-ins, community, study plans). Back up `data/school_item.db` first if needed.

### 3️⃣ Development

```bash
npm run dev
```

- Renderer HMR at `http://127.0.0.1:5173`
- Dev server maps `/image` → project `image/` folder
- Restart Electron after changing `main.js`, `preload.js`, or `main/ipc/`

### 4️⃣ Production build

```bash
npm run build
npm start
```

Output goes to `out/`; entry point is `out/main/main.js`.

### 5️⃣ Enable AI (optional)

1. Launch the app → **Settings**
2. Expand **API Key**, enter your DeepSeek key, click **Save**
3. Fill **School Planning** and submit → AI outline is generated
4. Open **Study Planning** → **Regenerate smart schedule** → tasks flow into **Daily Check-in**

---

## 📦 Data Preparation

### 🏫 `school/` (required)

One folder per university: **`No.{QS_ranking}`** (e.g. `No.2`, `No.163`).

**Required:**

- `intro.json` — `intro.zh` / `intro.en`, `contact`, `address.zh` / `address.en`
- Logo PNG — at least one non-numeric `.png` filename

**Optional:**

- `1.jpg` … `5.jpg` for the detail-page carousel

### 📘 `major/` (optional)

- Single `.xlsx` workbook (first sheet, header row)
- Must map: CN/EN school name, CN/EN program name (aliases in `data/init_db.js`)
- Optional columns: tuition, language requirements, duration, curriculum, difficulty

### 📋 `personalCase/` (optional)

- Single `.csv`, decoded as **GB18030** (Excel CN Windows export)
- Key columns: case ID, undergrad tier, GPA scale/score, percentiles, IELTS/TOEFL/GRE, internship/research/paper counts
- Offers are auto-assigned from school + program data

### 💬 Community seed (optional)

```bash
python data/fix-community-posts.py
```

Inserts UTF-8 sample posts (avoids encoding issues on Windows).

---

## 🗂 Project Structure

```
Aurora_Vine/
├── main.js                 # Electron main entry
├── preload.js              # contextBridge → window.api
├── electron.vite.config.js
├── main/
│   ├── ipc/                # auth, schools, cases, check-in, study-plan, community, resume, llm
│   ├── llm/                # prompts, schema validation, school matcher, profile context
│   └── utils/              # db, security, app-config, resume-text
├── data/
│   ├── init_db.js          # rebuild school_item.db
│   └── fix-community-posts.py
├── school/                 # university assets
├── major/                  # program spreadsheets
├── personalCase/           # case CSVs
├── image/                  # app illustrations & branding
├── renderer/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── modules/            # feature modules (planning, schools, llm-planning-service, …)
└── out/                    # build output
```

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────┐
│  Renderer  (renderer/)                       │
│  HTML + CSS + ES Modules                     │
│  window.api  ←── preload ──→  IPC            │
└────────────────────┬─────────────────────────┘
                     │
┌────────────────────▼─────────────────────────┐
│  Main Process  (main.js + main/ipc/)         │
│  Window · protocols · SQLite · LLM · files   │
└────────────────────┬─────────────────────────┘
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 school_item.db   userData/      school/
                  config.json    image/
                  resumes/
```

**Security:** `contextIsolation: true`, no Node in renderer; privileged ops via IPC; `school://` and `avatar://` protocols read whitelisted paths only.

---

## 💾 Data & Storage

### SQLite — `data/school_item.db`

| Category | Tables |
|----------|--------|
| Universities | `schools`, `school_programs` |
| Cases | `application_cases`, `application_case_offers` |
| Accounts | `accounts`, `app_session` |
| Check-in | `daily_checkin` |
| Plans | `study_plan` |
| Community | `community_posts`, `community_replies` |

### localStorage (per account / guest)

| Key | Content |
|-----|---------|
| `schoolPlanningProfile[:guest]` | Planning form + LLM results |
| `targetSchools[:guest]` | Favorited school IDs |
| `profileInfo[:guest]` | Settings profile fields |
| `theme` | `light` / `dark` |
| `lang` | `zh` / `en` |

### userData

| Path | Content |
|------|---------|
| `config.json` | DeepSeek API key |
| `resumes/` | Uploaded resumes + extracted text |
| `avatars/` | User avatar files |

---

## 🔌 IPC API Reference

Exposed via `window.api` in `preload.js`:

| Group | Methods |
|-------|---------|
| Theme | `themeApply` |
| Auth | `authGetCurrentUser`, `authLogin`, `authRegister`, `authLogout`, `authEnterGuest`, `authCertify`, `authUpdateNickname`, `authUploadAvatar` |
| Avatar | `avatarGetDataUrl` |
| Schools | `schoolsList`, `schoolsSearch`, `schoolsGetById`, `schoolsGetByIds`, `schoolsGetProgramsBySchoolId`, `schoolsGetIntro`, `schoolsGetAssetPath`, `schoolsGetAssetDataUrl` |
| Cases | `applicationCasesList`, `applicationCasesGetDetail`, `applicationCasesListBySchoolId` |
| Check-in | `dailyCheckinGetByDate`, `dailyCheckinListByMonth`, `dailyCheckinSaveByDate`, `dailyCheckinAppendTasks`, `dailyCheckinImportPlan`, `dailyCheckinClearAll` |
| Study plan | `studyPlanSave`, `studyPlanList`, `studyPlanDelete`, `studyPlanClearBySource`, `studyPlanClearBySourceAndKind`, `studyPlanClearAll` |
| Community | `communityListPosts`, `communityGetPostDetail`, `communityCreatePost`, `communityCreateReply`, `communityDeletePost`, `communityDeleteReply` |
| Resume | `resumeUpload`, `resumeClearAll`, `resumeGetText` |
| Settings | `settingsGetDeepseekApiKey`, `settingsSetDeepseekApiKey` |
| LLM | `llmScoreResume`, `llmGenerateOutline`, `llmGenerateSchedule`, `llmGenerateDailyTasks`, `llmGeneratePersonalStatement` |

Custom protocols: `school://No.{rank}/{file}` · `avatar://account/{id}`

---

## 🎨 Theme & i18n

| | Light | Dark |
|---|-------|------|
| Sidebar | Mint green `#76c9a8` | Catppuccin-style `#2d2d3a` |
| Accent | `#4db882` | `#ffe066` (buttons) |
| Cases page | Original blue accent (isolated CSS vars) | Same blue tone |

- 🌐 Strings in `renderer/modules/i18n.js`; LLM outputs use bilingual `{ zh, en }` JSON fields
- 🔄 Toggle language in Settings; theme syncs to the native title bar via `theme:apply`

---

## 🧑‍💻 Development

| Command | Action |
|---------|--------|
| `npm run dev` | Dev mode (Vite HMR + Electron) |
| `npm run build` | Build to `out/` |
| `npm start` | Run production build |
| `node data/init_db.js` | Rebuild university / case database |

### Adding features

- Keep loosely coupled features in separate files under `renderer/modules/`
- Register new IPC in `main/ipc/` and expose in `preload.js`
- New LLM capabilities: add prompt in `main/llm/prompts/`, validation in `plan-schema.js`, handler in `llm.js`

### FAQ

| Issue | Fix |
|-------|-----|
| Empty school list | Run `node data/init_db.js` |
| `better-sqlite3` error | `npm run prestart` or reinstall |
| LLM submit fails | Check API key in Settings; inspect main-process logs |
| Incomplete check-in import | Regenerate smart schedule (fallback + gap-fill runs automatically) |
| Garbled community posts | Run `python data/fix-community-posts.py` |

---

## ☁️ Backup & Git

Use `backup.sh` to commit and push to remote (default: `origin` on GitHub). Edit the config block at the top of the script before running:

```bash
bash backup.sh
```

`node_modules` is excluded via `.gitignore`.

---

## 📄 License

Please refer to the license terms declared in this repository.

---

<p align="center">
  <img src="image/logo_n.png" alt="Aurora Vine" width="64">
  <br><br>
  <strong>Aurora Vine</strong> · 极光藤<br>
  <em>A clearer path to studying abroad 🌿</em>
</p>
