const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const dbPath = path.join(__dirname, 'school_item.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new Database(dbPath);

db.exec(`
CREATE TABLE schools (
    school_id VARCHAR(50) PRIMARY KEY,
    school_name_zh VARCHAR(200),
    school_name_en VARCHAR(200),
    short_name VARCHAR(100),
    country_zh VARCHAR(100),
    country_en VARCHAR(100),
    city_zh VARCHAR(100),
    city_en VARCHAR(100),
    ranking_qs INT,
    logo_filename TEXT
);

CREATE TABLE school_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id VARCHAR(50) NOT NULL,
    ranking_qs INT NOT NULL,
    school_name_zh VARCHAR(200),
    school_name_en VARCHAR(200),
    program_name_cn TEXT NOT NULL,
    program_name_en TEXT,
    tuition_est REAL,
    language_requirement TEXT,
    duration TEXT,
    curriculum_summary_cn TEXT,
    curriculum_summary_en TEXT,
    difficulty_score REAL,
    display_order INT NOT NULL DEFAULT 0,
    raw_json TEXT NOT NULL,
    FOREIGN KEY(school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

CREATE INDEX idx_school_programs_school_id ON school_programs(school_id);
CREATE INDEX idx_school_programs_ranking_qs ON school_programs(ranking_qs);
CREATE INDEX idx_school_programs_display_order ON school_programs(school_id, display_order);

CREATE TABLE application_cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_no INTEGER NOT NULL UNIQUE,
    profile_tier_score REAL NOT NULL,
    undergrad_tier TEXT NOT NULL,
    gpa_scale TEXT NOT NULL,
    gpa_value REAL NOT NULL,
    gpa_rank_percent REAL,
    ielts_score REAL,
    toefl_score REAL,
    gre_score REAL,
    gre_writing_score REAL,
    internship_count INTEGER NOT NULL DEFAULT 0,
    research_count INTEGER NOT NULL DEFAULT 0,
    paper_count INTEGER NOT NULL DEFAULT 0,
    tags_json TEXT NOT NULL DEFAULT '[]',
    primary_school_id VARCHAR(50),
    primary_school_name_zh VARCHAR(200),
    primary_program_name_cn TEXT,
    primary_program_name_en TEXT,
    raw_json TEXT NOT NULL,
    FOREIGN KEY(primary_school_id) REFERENCES schools(school_id) ON DELETE SET NULL
);

CREATE TABLE application_case_offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    school_id VARCHAR(50) NOT NULL,
    ranking_qs INT NOT NULL,
    school_name_zh VARCHAR(200) NOT NULL,
    school_name_en VARCHAR(200),
    program_id INTEGER,
    program_name_cn TEXT NOT NULL,
    program_name_en TEXT,
    offer_type TEXT NOT NULL DEFAULT 'offer',
    offer_tier TEXT NOT NULL,
    is_primary_offer INTEGER NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY(case_id) REFERENCES application_cases(id) ON DELETE CASCADE,
    FOREIGN KEY(school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY(program_id) REFERENCES school_programs(id) ON DELETE SET NULL
);

CREATE INDEX idx_application_cases_score ON application_cases(profile_tier_score DESC);
CREATE INDEX idx_application_cases_undergrad_tier ON application_cases(undergrad_tier);
CREATE INDEX idx_application_cases_primary_school_id ON application_cases(primary_school_id);
CREATE INDEX idx_application_case_offers_case_id ON application_case_offers(case_id, display_order);
CREATE INDEX idx_application_case_offers_school_id ON application_case_offers(school_id, ranking_qs);
`);

const schoolDir = path.join(__dirname, '..', 'school');
const majorDir = path.join(__dirname, '..', 'major');
const personalCaseDir = path.join(__dirname, '..', 'personalCase');
const TARGET_APPLICATION_CASE_COUNT = 200;

const COUNTRY_ZH_LIST = [
  '中国香港', '中国澳门', '中国台湾',
  '沙特阿拉伯', '阿联酋', '新西兰', '澳大利亚', '马来西亚',
  '新加坡', '阿根廷', '哥伦比亚', '以色列',
  '哈萨克斯坦', '卡塔尔',
  '美国', '英国', '瑞士', '加拿大', '日本', '韩国', '中国',
  '法国', '德国', '荷兰', '瑞典', '丹麦', '芬兰', '挪威',
  '比利时', '爱尔兰', '西班牙', '意大利', '俄罗斯', '巴西',
  '墨西哥', '南非', '泰国', '印度', '葡萄牙', '捷克',
  '波兰', '匈牙利', '奥地利', '智利', '土耳其', '印度尼西亚',
  '菲律宾', '越南', '埃及', '希腊', '罗马尼亚', '哥斯达黎加'
];

const COUNTRY_EN_ALIASES = {
  'united states': 'USA', 'united states of america': 'USA', 'usa': 'USA', 'u.s.a.': 'USA', 'us': 'USA',
  'united kingdom': 'UK', 'uk': 'UK', 'u.k.': 'UK', 'england': 'UK', 'scotland': 'UK',
  'northern ireland': 'UK', 'wales': 'UK',
  'switzerland': 'Switzerland', 'canada': 'Canada', 'australia': 'Australia',
  'japan': 'Japan', 'south korea': 'South Korea', 'korea': 'South Korea',
  'china': 'China', 'singapore': 'Singapore', 'france': 'France', 'germany': 'Germany',
  'netherlands': 'Netherlands', 'the netherlands': 'Netherlands',
  'sweden': 'Sweden', 'denmark': 'Denmark', 'finland': 'Finland', 'norway': 'Norway',
  'belgium': 'Belgium', 'ireland': 'Ireland', 'spain': 'Spain', 'italy': 'Italy',
  'russia': 'Russia', 'malaysia': 'Malaysia', 'brazil': 'Brazil', 'mexico': 'Mexico',
  'new zealand': 'New Zealand', 'israel': 'Israel', 'austria': 'Austria',
  'south africa': 'South Africa', 'thailand': 'Thailand', 'india': 'India',
  'portugal': 'Portugal', 'czech republic': 'Czech Republic', 'czechia': 'Czech Republic',
  'poland': 'Poland', 'hungary': 'Hungary', 'turkey': 'Turkey',
  'hong kong': 'Hong Kong', 'hong kong sar': 'Hong Kong',
  'macau': 'Macau', 'taiwan': 'Taiwan',
  'saudi arabia': 'Saudi Arabia', 'uae': 'UAE', 'united arab emirates': 'UAE',
  'argentina': 'Argentina', 'chile': 'Chile', 'colombia': 'Colombia',
  'kazakhstan': 'Kazakhstan', 'qatar': 'Qatar',
  'indonesia': 'Indonesia', 'philippines': 'Philippines', 'egypt': 'Egypt',
  'greece': 'Greece'
};

const COUNTRY_EN_TO_ZH = {
  USA: '美国',
  UK: '英国',
  Switzerland: '瑞士',
  Canada: '加拿大',
  Australia: '澳大利亚',
  Japan: '日本',
  'South Korea': '韩国',
  China: '中国',
  Singapore: '新加坡',
  France: '法国',
  Germany: '德国',
  Netherlands: '荷兰',
  Sweden: '瑞典',
  Denmark: '丹麦',
  Finland: '芬兰',
  Norway: '挪威',
  Belgium: '比利时',
  Ireland: '爱尔兰',
  Spain: '西班牙',
  Italy: '意大利',
  Russia: '俄罗斯',
  Malaysia: '马来西亚',
  Brazil: '巴西',
  Mexico: '墨西哥',
  'New Zealand': '新西兰',
  Israel: '以色列',
  Austria: '奥地利',
  'South Africa': '南非',
  Thailand: '泰国',
  India: '印度',
  Portugal: '葡萄牙',
  'Czech Republic': '捷克',
  Poland: '波兰',
  Hungary: '匈牙利',
  Turkey: '土耳其',
  'Hong Kong': '中国香港',
  Macau: '中国澳门',
  Taiwan: '中国台湾',
  'Saudi Arabia': '沙特阿拉伯',
  UAE: '阿联酋',
  Argentina: '阿根廷',
  Chile: '智利',
  Colombia: '哥伦比亚',
  Kazakhstan: '哈萨克斯坦',
  Qatar: '卡塔尔',
  Indonesia: '印度尼西亚',
  Philippines: '菲律宾',
  Egypt: '埃及',
  Greece: '希腊'
};

const COUNTRY_ZH_NORMALIZE = {
  中华人民共和国: '中国',
  中华民国: '中国台湾'
};

const COUNTRY_EN_TOKENS = Array.from(new Set([
  ...Object.keys(COUNTRY_EN_ALIASES),
  ...Object.values(COUNTRY_EN_ALIASES)
])).sort((a, b) => b.length - a.length);

/** 去掉括号内英文校名后紧跟的中文说明，如「，正式名称…」「，全称…」 */
function stripChineseAliasSuffixFromEnglishName(nameEn) {
  return String(nameEn || '')
    .replace(/[,，]\s*正式名称[\s\S]*$/u, '')
    .replace(/[,，]\s*全称[\s\S]*$/u, '')
    .replace(/[,，]\s*(?:又名|旧称|曾用名)[\s\S]*$/u, '')
    .trim();
}

function extractEnglishNameAndShort(zhText) {
  const match = zhText.match(/[（(]([^）)]+?)[）)]/);
  if (!match) return { nameEn: '', shortName: '' };
  const inner = match[1];
  const shortMatch = inner.match(/[，,]\s*简称\s*(.+)$/);
  let nameEn, shortName = '';
  if (shortMatch) {
    nameEn = inner.replace(/[，,]\s*简称\s*.+$/, '').trim();
    shortName = shortMatch[1].trim();
  } else {
    nameEn = inner.trim();
  }
  nameEn = stripChineseAliasSuffixFromEnglishName(nameEn);
  shortName = String(shortName || '')
    .replace(/[或/]/g, ' ')
    .replace(/[^\w.+\- ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { nameEn, shortName };
}

function extractEnglishNameFromEnglishIntro(enText) {
  const text = String(enText || '').trim();
  if (!text) return '';
  const patterns = [
    /^([A-Z][A-Za-z0-9&.'’\- ]+?)\s+\(/,
    /^([A-Z][A-Za-z0-9&.'’\- ]+?)\s+(?:is|was|founded|established)\b/,
    /^([A-Z][A-Za-z0-9&.'’\- ]+?)(?:,|\.|$)/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

function extractChineseNameFromIntro(zhText) {
  return String(zhText || '').split(/[（(]/)[0].trim();
}

function normalizeCountryZh(value) {
  const text = String(value || '').trim();
  return COUNTRY_ZH_NORMALIZE[text] || text;
}

function isLikelyBrokenZhLocation(value) {
  const text = String(value || '').trim();
  return !text || /\?{2,}/.test(text) || (!/[\u3400-\u9fff]/u.test(text) && /[A-Za-z]{4,}/.test(text));
}

function isLikelyBrokenEnLocation(value) {
  const text = String(value || '').trim();
  return !text
    || /\?{2,}/.test(text)
    || /\b(university|college|research|renowned|founded|faculty|students|engineering|science|medicine|teaching|business|law|humanities|social sciences|technology)\b/i.test(text);
}

function parseAddressZh(addrZh) {
  let countryZh = '';
  let cityZh = '';
  const text = normalizeCountryZh(String(addrZh || '').trim());
  if (isLikelyBrokenZhLocation(text)) return { countryZh, cityZh };
  for (const c of COUNTRY_ZH_LIST) {
    if (text.startsWith(c) || text.includes(c)) {
      countryZh = c;
      const startIndex = text.indexOf(c);
      let rest = startIndex >= 0 ? text.slice(startIndex + c.length) : text;
      rest = rest.replace(/^[^省州市区县特别行政自治区]+(?:省|州|自治区|特别行政区|特别市|道(?=.+(?:市|区|县)))/, '');
      const cityMatch = rest.match(/^(.+?)(?:市|区|县)/) || rest.match(/^(.+?)(?:街|路|道|大道|号|大街|\d)/);
      if (cityMatch) {
        cityZh = cityMatch[1];
      } else {
        cityZh = rest.replace(/[省州市区县街路道号]+.*$/, '');
      }
      break;
    }
  }
  return { countryZh, cityZh };
}

function parseAddressEn(addrEn) {
  const raw = String(addrEn || '').trim();
  if (isLikelyBrokenEnLocation(raw)) return { countryEn: '', cityEn: '' };
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2) return { countryEn: '', cityEn: '' };
  const lastPart = parts[parts.length - 1]
    .toLowerCase()
    .replace(/^\s*the\s+/, '')
    .replace(/\d+/g, '')
    .replace(/[().]/g, '')
    .trim();
  const countryEn = COUNTRY_EN_ALIASES[lastPart] || parts[parts.length - 1];
  let cityEn = '';
  for (let i = parts.length - 2; i >= 0; i--) {
    const part = parts[i].replace(/\s*\d{4,}.*$/, '').replace(/\s+[A-Z]{1,2}\d.*$/, '').trim();
    if (part && !/^\d/.test(part) && part.length > 1 && !/university|college|institute/i.test(part)) {
      cityEn = part;
      break;
    }
  }
  return { countryEn, cityEn };
}

function parseCountryZhFromText(text) {
  const source = String(text || '');
  for (const country of COUNTRY_ZH_LIST.sort((a, b) => b.length - a.length)) {
    if (source.includes(country)) return country;
  }
  return '';
}

function parseCountryEnFromText(text) {
  const source = String(text || '').toLowerCase();
  for (const token of COUNTRY_EN_TOKENS) {
    const normalized = token.toLowerCase();
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i');
    if (regex.test(source)) return COUNTRY_EN_ALIASES[normalized] || token;
  }
  return '';
}

function toSafeTextArray(value) {
  return Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean) : [];
}

function toSafeUrlText(value) {
  const text = String(value || '').trim();
  return /^https?:\/\//i.test(text) ? text : '';
}

function normalizeProgramHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()（）.:：/\\_-]+/g, '');
}

const PROGRAM_COLUMN_ALIASES = {
  schoolNameZh: ['大学名称 (CN)', '大学名称(CN)', '大学名称', '院校名称 (CN)', '院校名称(CN)', '院校名称'],
  schoolNameEn: ['University Name (EN)', 'University Name(EN)', 'University Name', '院校英文名'],
  programNameCn: ['开设专业 (CN)', '开设专业(CN)', '开设专业', '专业名称 (CN)', '专业名称(CN)', '专业名称'],
  programNameEn: ['Program Name (EN)', 'Program Name(EN)', 'Program Name', '专业英文名'],
  tuitionEst: ['学费 (Est.) ', '学费 (Est.)', '学费(Est.)', '学费 Est.', '学费', 'Tuition'],
  languageRequirement: ['语言要求', 'Language Requirement'],
  duration: ['学制', 'Duration'],
  curriculumSummaryCn: ['培养方案简述 (CN)', '培养方案简述(CN)', '培养方案简述'],
  curriculumSummaryEn: ['Curriculum Summary (EN)', 'Curriculum Summary(EN)', 'Curriculum Summary'],
  difficultyScore: ['专业难度系数', '难度系数', 'Difficulty Score']
};

const SCHOOL_NAME_ALIAS_MAP_ZH = {
  '苏黎世联邦理工学院': '苏黎世联邦理工大学',
  '圣三一大学': '都柏林圣三一学院',
  '皇家理工学院': 'KTH皇家理工学院',
  '莫斯科国立大学': '罗蒙诺索夫莫斯科国立大学',
  '埃因霍温理工大学': '埃因霍芬理工大学',
  '瓦赫宁根大学': '瓦格宁根大学',
  '查尔姆斯理工大学': '查尔姆斯工业大学',
  '阿里-法拉比哈萨克国立大学': '阿里-法拉比哈萨克斯坦国立大学',
  '华盛顿大学圣路易斯分校': '圣路易斯华盛顿大学',
  '国立阳明交通大学': '台湾阳明交通大学',
  '清华大学(新竹)': '台湾清华大学'
};

const SCHOOL_NAME_ALIAS_MAP_EN_RAW = {
  UCL: 'University College London',
  Caltech: 'California Institute of Technology',
  WashU: 'Washington University in St. Louis',
  QMUL: 'Queen Mary University of London',
  UBC: 'The University of British Columbia',
  TokyoTech: 'Institute of Science Tokyo',
  USTC: 'University of Science and Technology of China',
  DTU: 'Technical University of Denmark',
  ASU: 'Arizona State University',
  UIUC: 'University of Illinois at Urbana-Champaign',
  LSE: 'The London School of Economics and Political Science',
  USC: 'University of Southern California',
  UCLA: 'University of California, Los Angeles',
  UCSD: 'University of California, San Diego',
  UCSB: 'University of California, Santa Barbara',
  UCDavis: 'University of California, Davis',
  UCBerkeley: 'University of California, Berkeley',
  UNCChapelHill: 'University of North Carolina at Chapel Hill',
  GeorgiaTech: 'Georgia Institute of Technology',
  KTH: 'KTH Royal Institute of Technology',
  TUEindhoven: 'Eindhoven University of Technology',
  WageningenUniversity: 'Wageningen University & Research',
  Chalmers: 'Chalmers University of Technology',
  AlFarabiKazakh: 'Al-Farabi Kazakh National University',
  NYCU: 'National Yang Ming Chiao Tung University',
  MSU: 'Lomonosov Moscow State University'
};

const SCHOOL_NAME_ALIAS_MAP_EN = Object.fromEntries(
  Object.entries(SCHOOL_NAME_ALIAS_MAP_EN_RAW).map(([key, value]) => [normalizeSchoolLookupText(key), value])
);

function normalizeSchoolLookupText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^the\s+/i, '')
    .replace(/[（(][^）)]*[）)]/g, ' ')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\u3400-\u9fff]+/gu, '');
}

function normalizeProgramText(value) {
  const text = String(value ?? '').trim();
  return text || '';
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value).replace(/[,，\s]/g, '');
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function buildProgramColumnMap(headerRow) {
  const headerLookup = new Map();
  headerRow.forEach((header) => {
    const normalized = normalizeProgramHeader(header);
    if (normalized) headerLookup.set(normalized, String(header));
  });
  const columnMap = {};
  for (const [field, aliases] of Object.entries(PROGRAM_COLUMN_ALIASES)) {
    const matchedHeader = aliases
      .map((alias) => headerLookup.get(normalizeProgramHeader(alias)))
      .find(Boolean);
    if (matchedHeader) columnMap[field] = matchedHeader;
  }
  const requiredFields = ['schoolNameZh', 'schoolNameEn', 'programNameCn', 'programNameEn'];
  const missing = requiredFields.filter((field) => !columnMap[field]);
  if (missing.length) {
    throw new Error(`专业表缺少必要列：${missing.join(', ')}`);
  }
  return columnMap;
}

function getProgramCell(row, columnMap, field) {
  const key = columnMap[field];
  return key ? row[key] : '';
}

function addSchoolLookupCandidate(lookup, key, record) {
  if (!key) return;
  const normalized = normalizeSchoolLookupText(key);
  if (!normalized) return;
  const existing = lookup.get(normalized) || [];
  if (!existing.some((item) => item.schoolId === record.schoolId)) existing.push(record);
  lookup.set(normalized, existing);
}

function buildSchoolLookup(records) {
  const lookup = new Map();
  records.forEach((record) => {
    addSchoolLookupCandidate(lookup, record.schoolNameZh, record);
    addSchoolLookupCandidate(lookup, record.schoolNameEn, record);
    addSchoolLookupCandidate(lookup, record.shortName, record);
  });
  return lookup;
}

function resolveSchoolForProgram(row, columnMap, schoolLookup, rowIndex) {
  const schoolNameZhRaw = normalizeProgramText(getProgramCell(row, columnMap, 'schoolNameZh'));
  const schoolNameEnRaw = normalizeProgramText(getProgramCell(row, columnMap, 'schoolNameEn'));
  const schoolNameZh = SCHOOL_NAME_ALIAS_MAP_ZH[schoolNameZhRaw] || schoolNameZhRaw;
  const schoolNameEnAliasKey = normalizeSchoolLookupText(schoolNameEnRaw);
  const schoolNameEn = SCHOOL_NAME_ALIAS_MAP_EN[schoolNameEnAliasKey] || schoolNameEnRaw;

  const candidates = [];
  const seen = new Set();
  [schoolNameZh, schoolNameEn, schoolNameZhRaw, schoolNameEnRaw].forEach((key) => {
    const matched = schoolLookup.get(normalizeSchoolLookupText(key)) || [];
    matched.forEach((record) => {
      if (seen.has(record.schoolId)) return;
      seen.add(record.schoolId);
      candidates.push(record);
    });
  });

  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) {
    const preciseZh = candidates.find((record) => normalizeSchoolLookupText(record.schoolNameZh) === normalizeSchoolLookupText(schoolNameZh));
    if (preciseZh) return preciseZh;
    const preciseEn = candidates.find((record) => normalizeSchoolLookupText(record.schoolNameEn) === normalizeSchoolLookupText(schoolNameEn));
    if (preciseEn) return preciseEn;
  }

  throw new Error(`第 ${rowIndex} 行专业数据无法匹配院校：${schoolNameZhRaw || '-'} / ${schoolNameEnRaw || '-'}`);
}

function resolveProgramWorkbookPath() {
  if (!fs.existsSync(majorDir)) return '';
  const workbook = fs.readdirSync(majorDir).find((name) => /\.xlsx$/i.test(name) && !/^~\$/.test(name));
  return workbook ? path.join(majorDir, workbook) : '';
}

function importSchoolPrograms(records) {
  const workbookPath = resolveProgramWorkbookPath();
  if (!workbookPath) {
    console.warn('[SKIP] no major workbook found under major/');
    return 0;
  }

  const workbook = XLSX.readFile(workbookPath);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    console.warn(`[SKIP] ${path.basename(workbookPath)}: no worksheet found`);
    return 0;
  }

  const sheet = workbook.Sheets[sheetName];
  const rowsAsArrays = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: '' });
  if (!rowsAsArrays.length) {
    console.warn(`[SKIP] ${path.basename(workbookPath)}: worksheet is empty`);
    return 0;
  }

  const headerRow = rowsAsArrays[0];
  const columnMap = buildProgramColumnMap(headerRow);
  const rows = XLSX.utils.sheet_to_json(sheet, { raw: true, defval: '' });
  const schoolLookup = buildSchoolLookup(records);
  const insertProgramStmt = db.prepare(`
    INSERT INTO school_programs
    (school_id, ranking_qs, school_name_zh, school_name_en, program_name_cn, program_name_en, tuition_est,
     language_requirement, duration, curriculum_summary_cn, curriculum_summary_en, difficulty_score, display_order, raw_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const displayOrderMap = new Map();
  let insertedPrograms = 0;
  const insertPrograms = db.transaction((items) => {
    for (const item of items) {
      insertProgramStmt.run(
        item.schoolId,
        item.rankingQs,
        item.schoolNameZh,
        item.schoolNameEn,
        item.programNameCn,
        item.programNameEn,
        item.tuitionEst,
        item.languageRequirement,
        item.duration,
        item.curriculumSummaryCn,
        item.curriculumSummaryEn,
        item.difficultyScore,
        item.displayOrder,
        item.rawJson
      );
      insertedPrograms++;
    }
  });

  const programRecords = rows
    .filter((row) => Object.values(row).some((value) => String(value ?? '').trim()))
    .map((row, index) => {
      const matchedSchool = resolveSchoolForProgram(row, columnMap, schoolLookup, index + 2);
      const schoolCount = (displayOrderMap.get(matchedSchool.schoolId) || 0) + 1;
      displayOrderMap.set(matchedSchool.schoolId, schoolCount);
      return {
        schoolId: matchedSchool.schoolId,
        rankingQs: matchedSchool.rank,
        schoolNameZh: matchedSchool.schoolNameZh,
        schoolNameEn: matchedSchool.schoolNameEn,
        programNameCn: normalizeProgramText(getProgramCell(row, columnMap, 'programNameCn')),
        programNameEn: normalizeProgramText(getProgramCell(row, columnMap, 'programNameEn')),
        tuitionEst: toNullableNumber(getProgramCell(row, columnMap, 'tuitionEst')),
        languageRequirement: normalizeProgramText(getProgramCell(row, columnMap, 'languageRequirement')),
        duration: normalizeProgramText(getProgramCell(row, columnMap, 'duration')),
        curriculumSummaryCn: normalizeProgramText(getProgramCell(row, columnMap, 'curriculumSummaryCn')),
        curriculumSummaryEn: normalizeProgramText(getProgramCell(row, columnMap, 'curriculumSummaryEn')),
        difficultyScore: toNullableNumber(getProgramCell(row, columnMap, 'difficultyScore')),
        displayOrder: schoolCount,
        rawJson: JSON.stringify(row)
      };
    })
    .filter((item) => item.programNameCn || item.programNameEn);

  insertPrograms(programRecords);
  console.log(`Programs imported from ${path.basename(workbookPath)} (${insertedPrograms} rows inserted)`);
  return insertedPrograms;
}

function resolvePersonalCaseCsvPath() {
  if (!fs.existsSync(personalCaseDir)) return '';
  const csvFile = fs.readdirSync(personalCaseDir).find((name) => /\.csv$/i.test(name));
  return csvFile ? path.join(personalCaseDir, csvFile) : '';
}

function parseSimpleCsvText(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return [];
  const rows = lines.map((line) => line.split(',').map((cell) => cell.trim()));
  const header = rows[0];
  return rows.slice(1).map((cells) => {
    const row = {};
    header.forEach((key, index) => {
      row[key] = cells[index] ?? '';
    });
    return row;
  });
}

function parsePercentNumber(value) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function pickFirstPositive(...values) {
  for (const value of values) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }
  return 0;
}

function getGpaScaleNumber(scaleText) {
  const text = String(scaleText || '').trim();
  if (/4/.test(text)) return 4;
  if (/100/.test(text)) return 100;
  return 5;
}

function normalizeTierWeight(value) {
  const text = String(value || '').trim();
  if (text === '985') return 1;
  if (text === '海本') return 0.92;
  if (text === '211') return 0.82;
  if (text === '中外合作') return 0.72;
  if (text === '双非') return 0.58;
  return 0.62;
}

function buildCaseTags(row) {
  const tags = new Set();
  const tier = String(row['本科层次'] || '').trim();
  if (tier) tags.add(tier);

  const gpaValue = Number(row['绩点'] || 0);
  if (gpaValue >= 4.5) tags.add('高GPA');
  else if (gpaValue >= 3.6) tags.add('稳健GPA');
  else if (gpaValue > 0) tags.add('低GPA冲刺');

  const rankPercent = parsePercentNumber(row['绩点排名百分比']);
  if (Number.isFinite(rankPercent)) {
    if (rankPercent <= 5) tags.add('排名前列');
    else if (rankPercent >= 50) tags.add('排名靠后');
  }

  const ielts = Number(row['雅思成绩'] || 0);
  const toefl = Number(row['托福成绩'] || 0);
  if (ielts >= 7.5 || toefl >= 110) tags.add('语言强');
  else if (ielts > 0 || toefl > 0) tags.add('语言达标');
  else tags.add('语言待补强');

  const gre = Number(row.GRE || 0);
  if (gre >= 325) tags.add('GRE高分');
  else if (gre >= 310) tags.add('GRE达标');

  const internshipCount = Number(row['实习数量'] || 0);
  const researchCount = Number(row['科研数量'] || 0);
  const paperCount = Number(row['论文数量'] || 0);
  if (researchCount >= 3) tags.add('科研强');
  if (internshipCount >= 3) tags.add('实习丰富');
  if (paperCount >= 1) tags.add('论文加成');

  return Array.from(tags);
}

function computeProfileTierScore(row) {
  const gpaScale = getGpaScaleNumber(row['绩点分制']);
  const gpaValue = Number(row['绩点'] || 0);
  const gpaNorm = clamp01(gpaScale > 0 ? gpaValue / gpaScale : 0);
  const rankPercent = parsePercentNumber(row['绩点排名百分比']);
  const rankNorm = Number.isFinite(rankPercent) ? clamp01(1 - rankPercent / 100) : 0.45;

  const ielts = Number(row['雅思成绩'] || 0);
  const toefl = Number(row['托福成绩'] || 0);
  const gre = Number(row.GRE || 0);
  const greWriting = Number(row['GRE写作'] || 0);
  const internshipCount = Number(row['实习数量'] || 0);
  const researchCount = Number(row['科研数量'] || 0);
  const paperCount = Number(row['论文数量'] || 0);

  const languageNorm = clamp01(
    Math.max(
      ielts > 0 ? ielts / 9 : 0,
      toefl > 0 ? toefl / 120 : 0
    )
  );
  const greNorm = clamp01(
    Math.max(
      gre > 0 ? (gre - 290) / 50 : 0,
      greWriting > 0 ? greWriting / 6 : 0
    )
  );
  const softNorm = clamp01(
    internshipCount / 4 * 0.28
    + researchCount / 5 * 0.5
    + paperCount / 2 * 0.22
  );
  const tierNorm = normalizeTierWeight(row['本科层次']);

  const score = (
    gpaNorm * 34
    + rankNorm * 16
    + languageNorm * 15
    + greNorm * 11
    + softNorm * 14
    + tierNorm * 10
  );
  return Number(score.toFixed(2));
}

function clampNumber(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, num));
}

function roundTo(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}

function buildApplicationCaseProfile(row) {
  const caseNo = Number(row['案例序号'] || 0);
  const ieltsScore = pickFirstPositive(row['雅思成绩']);
  const toeflScore = pickFirstPositive(row['托福成绩']);
  const greScore = pickFirstPositive(row.GRE);
  const greWritingScore = pickFirstPositive(row['GRE写作']);
  return {
    caseNo,
    profileTierScore: computeProfileTierScore(row),
    undergradTier: String(row['本科层次'] || '').trim() || '其他',
    gpaScale: String(row['绩点分制'] || '').trim() || '5分制',
    gpaValue: Number(row['绩点'] || 0),
    gpaRankPercent: parsePercentNumber(row['绩点排名百分比']),
    ieltsScore: ieltsScore || null,
    toeflScore: toeflScore || null,
    greScore: greScore || null,
    greWritingScore: greWritingScore || null,
    internshipCount: Number(row['实习数量'] || 0),
    researchCount: Number(row['科研数量'] || 0),
    paperCount: Number(row['论文数量'] || 0),
    tags: buildCaseTags(row),
    rawJson: JSON.stringify(row)
  };
}

function createVariantCaseRow(sourceRow, variantIndex, caseNo) {
  const row = { ...sourceRow };
  const gpaScale = getGpaScaleNumber(row['绩点分制']);
  const gpaDelta = [-0.08, 0.06, 0.11, -0.04, 0.03][variantIndex % 5];
  const rankDelta = [4, -3, 6, -5, 2][variantIndex % 5];
  const ieltsDelta = [-0.5, 0, 0.5, 0, 0.5][variantIndex % 5];
  const toeflDelta = [-3, 2, 4, -2, 3][variantIndex % 5];
  const greDelta = [-4, 3, 5, -2, 4][variantIndex % 5];
  const writingDelta = [-0.5, 0, 0.5, 0, 0.5][variantIndex % 5];
  const softDelta = [-1, 0, 1, 0, 1][variantIndex % 5];

  row['案例序号'] = String(caseNo);
  row['绩点'] = String(roundTo(clampNumber(Number(row['绩点'] || 0) + gpaDelta, 0, gpaScale), 2));

  const rankPercent = parsePercentNumber(row['绩点排名百分比']);
  if (Number.isFinite(rankPercent)) {
    row['绩点排名百分比'] = String(roundTo(clampNumber(rankPercent + rankDelta, 1, 80), 1));
  }

  const ielts = Number(row['雅思成绩'] || 0);
  if (ielts > 0) row['雅思成绩'] = String(roundTo(clampNumber(ielts + ieltsDelta, 5, 8.5), 1));

  const toefl = Number(row['托福成绩'] || 0);
  if (toefl > 0) row['托福成绩'] = String(Math.round(clampNumber(toefl + toeflDelta, 70, 119)));

  const gre = Number(row.GRE || 0);
  if (gre > 0) row.GRE = String(Math.round(clampNumber(gre + greDelta, 295, 338)));

  const greWriting = Number(row['GRE写作'] || 0);
  if (greWriting > 0) row['GRE写作'] = String(roundTo(clampNumber(greWriting + writingDelta, 2.5, 5.5), 1));

  row['实习数量'] = String(Math.round(clampNumber(Number(row['实习数量'] || 0) + softDelta, 0, 5)));
  row['科研数量'] = String(Math.round(clampNumber(Number(row['科研数量'] || 0) - softDelta, 0, 5)));
  row['论文数量'] = String(Math.round(clampNumber(Number(row['论文数量'] || 0) + (variantIndex % 3 === 0 ? 1 : 0), 0, 3)));
  row['基础案例序号'] = sourceRow['案例序号'] || '';
  row['模拟变体序号'] = String(variantIndex + 1);

  return row;
}

function expandApplicationCaseRows(rows, targetCount = TARGET_APPLICATION_CASE_COUNT) {
  if (!Array.isArray(rows) || rows.length >= targetCount) return rows;
  const maxCaseNo = rows.reduce((max, row) => Math.max(max, Number(row['案例序号'] || 0)), 0);
  const expandedRows = [...rows];
  let variantIndex = 0;

  while (expandedRows.length < targetCount) {
    const sourceRow = rows[variantIndex % rows.length];
    expandedRows.push(createVariantCaseRow(sourceRow, variantIndex, maxCaseNo + variantIndex + 1));
    variantIndex++;
  }

  return expandedRows;
}

function buildOfferTier(targetRank, rankingQs) {
  if (rankingQs < targetRank - 8) return '冲刺';
  if (rankingQs > targetRank + 12) return '保底';
  return '匹配';
}

function chooseProgramForOffer(programs, caseNo, displayOrder) {
  if (!Array.isArray(programs) || programs.length === 0) return null;
  const index = Math.abs((caseNo * 7 + displayOrder * 3) % programs.length);
  return programs[index];
}

function buildSchoolProgramsMap() {
  const rows = db.prepare(`
    SELECT id, school_id, ranking_qs, program_name_cn, program_name_en
    FROM school_programs
    ORDER BY school_id ASC, display_order ASC, id ASC
  `).all();
  const programMap = new Map();
  rows.forEach((row) => {
    const list = programMap.get(row.school_id) || [];
    list.push(row);
    programMap.set(row.school_id, list);
  });
  return programMap;
}

function assignSchoolSlotsToCases(caseProfiles, schoolRecords) {
  const slots = schoolRecords.flatMap((school, duplicateIndex) => ([
    { school, duplicateIndex: 0, targetCaseIndex: 0 },
    { school, duplicateIndex: 1, targetCaseIndex: 0 }
  ]));

  slots.forEach((slot, index) => {
    const schoolIndex = schoolRecords.findIndex((school) => school.schoolId === slot.school.schoolId);
    const normalizedCaseIndex = schoolIndex / Math.max(1, schoolRecords.length - 1) * Math.max(1, caseProfiles.length - 1);
    slot.targetCaseIndex = slot.duplicateIndex === 0
      ? normalizedCaseIndex * 0.72
      : normalizedCaseIndex * 0.72 + (caseProfiles.length - 1) * 0.28;
    slot.sortValue = slot.targetCaseIndex + slot.duplicateIndex * 0.0001 + index * 0.000001;
  });

  slots.sort((a, b) => a.sortValue - b.sortValue);

  caseProfiles.forEach((profile) => {
    profile.offerSchools = [];
    profile.offerSchoolIds = new Set();
    profile.capacity = 5;
  });

  slots.forEach((slot) => {
    let bestIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < caseProfiles.length; i++) {
      const profile = caseProfiles[i];
      if (profile.capacity <= 0) continue;
      if (profile.offerSchoolIds.has(slot.school.schoolId)) continue;
      const distance = Math.abs(i - slot.targetCaseIndex);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }
    if (bestIndex < 0) {
      for (let i = 0; i < caseProfiles.length; i++) {
        const profile = caseProfiles[i];
        if (profile.capacity <= 0) continue;
        const distance = Math.abs(i - slot.targetCaseIndex);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }
    }
    if (bestIndex < 0) return;
    const profile = caseProfiles[bestIndex];
    profile.offerSchools.push(slot.school);
    profile.offerSchoolIds.add(slot.school.schoolId);
    profile.capacity -= 1;
  });

  caseProfiles.forEach((profile) => {
    profile.offerSchools.sort((a, b) => a.rank - b.rank);
  });
}

function importApplicationCases(records) {
  const csvPath = resolvePersonalCaseCsvPath();
  if (!csvPath) {
    console.warn('[SKIP] no personal case csv found under personalCase/');
    return { cases: 0, offers: 0 };
  }

  const csvBuffer = fs.readFileSync(csvPath);
  const csvText = new TextDecoder('gb18030').decode(csvBuffer);
  const rows = parseSimpleCsvText(csvText)
    .filter((row) => Object.values(row).some((value) => String(value ?? '').trim()));
  if (!rows.length) {
    console.warn(`[SKIP] ${path.basename(csvPath)}: csv is empty`);
    return { cases: 0, offers: 0 };
  }

  const schoolRecords = records.map((record) => ({
    schoolId: record.schoolId,
    schoolNameZh: record.schoolNameZh,
    schoolNameEn: record.schoolNameEn,
    countryZh: record.countryZh,
    rank: record.rank
  })).sort((a, b) => a.rank - b.rank);
  const schoolProgramsMap = buildSchoolProgramsMap();

  const expandedRows = expandApplicationCaseRows(rows);
  const caseProfiles = expandedRows.map(buildApplicationCaseProfile).sort((a, b) => {
    if (b.profileTierScore !== a.profileTierScore) return b.profileTierScore - a.profileTierScore;
    return a.caseNo - b.caseNo;
  });

  assignSchoolSlotsToCases(caseProfiles, schoolRecords);

  const insertCaseStmt = db.prepare(`
    INSERT INTO application_cases
    (case_no, profile_tier_score, undergrad_tier, gpa_scale, gpa_value, gpa_rank_percent, ielts_score,
     toefl_score, gre_score, gre_writing_score, internship_count, research_count, paper_count,
     tags_json, primary_school_id, primary_school_name_zh, primary_program_name_cn, primary_program_name_en, raw_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertOfferStmt = db.prepare(`
    INSERT INTO application_case_offers
    (case_id, school_id, ranking_qs, school_name_zh, school_name_en, program_id, program_name_cn, program_name_en,
     offer_type, offer_tier, is_primary_offer, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'offer', ?, ?, ?)
  `);

  let insertedCases = 0;
  let insertedOffers = 0;
  const insertAll = db.transaction((profiles) => {
    profiles.forEach((profile, caseIndex) => {
      const targetRank = schoolRecords[Math.max(0, Math.min(schoolRecords.length - 1, Math.round(caseIndex / Math.max(1, profiles.length - 1) * (schoolRecords.length - 1))))].rank;
      const offers = profile.offerSchools.map((school, displayIndex) => {
        const programs = schoolProgramsMap.get(school.schoolId) || [];
        const program = chooseProgramForOffer(programs, profile.caseNo, displayIndex + 1);
        return {
          schoolId: school.schoolId,
          rankingQs: school.rank,
          schoolNameZh: school.schoolNameZh,
          schoolNameEn: school.schoolNameEn,
          programId: program?.id || null,
          programNameCn: program?.program_name_cn || `${school.schoolNameZh}相关专业`,
          programNameEn: program?.program_name_en || '',
          offerTier: buildOfferTier(targetRank, school.rank),
          displayOrder: displayIndex + 1
        };
      }).sort((a, b) => a.rankingQs - b.rankingQs);

      let primaryOffer = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      offers.forEach((offer) => {
        const distance = Math.abs(offer.rankingQs - targetRank);
        if (distance < bestDistance) {
          bestDistance = distance;
          primaryOffer = offer;
        }
      });
      if (primaryOffer) primaryOffer.offerTier = '匹配';

      const caseResult = insertCaseStmt.run(
        profile.caseNo,
        profile.profileTierScore,
        profile.undergradTier,
        profile.gpaScale,
        profile.gpaValue,
        profile.gpaRankPercent,
        profile.ieltsScore,
        profile.toeflScore,
        profile.greScore,
        profile.greWritingScore,
        profile.internshipCount,
        profile.researchCount,
        profile.paperCount,
        JSON.stringify(profile.tags),
        primaryOffer?.schoolId || null,
        primaryOffer?.schoolNameZh || null,
        primaryOffer?.programNameCn || null,
        primaryOffer?.programNameEn || null,
        profile.rawJson
      );
      insertedCases++;

      offers.forEach((offer, index) => {
        insertOfferStmt.run(
          caseResult.lastInsertRowid,
          offer.schoolId,
          offer.rankingQs,
          offer.schoolNameZh,
          offer.schoolNameEn,
          offer.programId,
          offer.programNameCn,
          offer.programNameEn,
          offer.offerTier,
          offer === primaryOffer ? 1 : 0,
          index + 1
        );
        insertedOffers++;
      });
    });
  });

  insertAll(caseProfiles);
  console.log(`Application cases imported from ${path.basename(csvPath)} (${rows.length} base rows expanded to ${insertedCases} cases, ${insertedOffers} offers inserted)`);
  return { cases: insertedCases, offers: insertedOffers };
}

function generateSchoolId(shortName, nameEn, rank) {
  if (shortName) {
    const id = shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (id) return id;
  }
  if (nameEn) {
    const id = nameEn.toLowerCase()
      .replace(/^the\s+/, '')
      .replace(/\s*\(.+?\)\s*/g, ' ')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 50);
    if (id) return id;
  }
  return `school-${rank}`;
}

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO schools
  (school_id, school_name_zh, school_name_en, short_name, country_zh, country_en, city_zh, city_en, ranking_qs, logo_filename)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const entries = fs.readdirSync(schoolDir)
  .filter(name => /^No\.\d+$/.test(name))
  .sort((a, b) => parseInt(a.replace('No.', ''), 10) - parseInt(b.replace('No.', ''), 10));

const usedIds = new Set();
let insertedCount = 0;

const insertAll = db.transaction((records) => {
  for (const rec of records) {
    insertStmt.run(
      rec.schoolId, rec.schoolNameZh, rec.schoolNameEn, rec.shortName,
      rec.countryZh, rec.countryEn, rec.cityZh, rec.cityEn,
      rec.rank, rec.logoFilename
    );
    insertedCount++;
  }
});

const records = [];

for (const dirName of entries) {
  const rank = parseInt(dirName.replace('No.', ''), 10);
  const dirPath = path.join(schoolDir, dirName);

  const introPath = path.join(dirPath, 'intro.json');
  if (!fs.existsSync(introPath)) {
    console.warn(`[SKIP] ${dirName}: no intro.json`);
    continue;
  }

  let intro;
  try {
    intro = JSON.parse(fs.readFileSync(introPath, 'utf-8'));
  } catch (err) {
    console.warn(`[SKIP] ${dirName}: failed to parse intro.json - ${err.message}`);
    continue;
  }

  const files = fs.readdirSync(dirPath);
  const logoPng = files.find(f => /\.png$/i.test(f) && !/^\d+\.png$/i.test(f));
  if (!logoPng) {
    console.warn(`[SKIP] ${dirName}: no logo PNG file found`);
    continue;
  }

  const zhIntroItems = toSafeTextArray(intro.intro?.zh);
  const enIntroItems = toSafeTextArray(intro.intro?.en);
  const zhIntro = zhIntroItems.join(' ');
  const enIntro = enIntroItems.join(' ');
  const schoolNameZh = extractChineseNameFromIntro(zhIntro) || logoPng.replace(/\.png$/i, '');
  const nameInfo = extractEnglishNameAndShort(zhIntro);
  const nameEn = stripChineseAliasSuffixFromEnglishName(
    nameInfo.nameEn || extractEnglishNameFromEnglishIntro(enIntro)
  );
  const shortName = nameInfo.shortName;

  const addrZh = intro.address?.zh || '';
  const addrEn = intro.address?.en || '';
  const zhAllText = [
    ...zhIntroItems,
    intro.address?.zh || ''
  ].join(' ');
  const enAllText = [
    ...enIntroItems,
    intro.address?.en || '',
    toSafeUrlText(intro.contact || '')
  ].join(' ');

  const addrParsedZh = parseAddressZh(addrZh);
  const addrParsedEn = parseAddressEn(addrEn);
  let countryZh = normalizeCountryZh(addrParsedZh.countryZh || parseCountryZhFromText(zhAllText));
  let countryEn = addrParsedEn.countryEn || parseCountryEnFromText(enAllText);
  let cityZh = addrParsedZh.cityZh;
  const cityEn = addrParsedEn.cityEn;

  if (!countryZh && countryEn) countryZh = COUNTRY_EN_TO_ZH[countryEn] || '';
  if (!countryEn && countryZh) {
    const pair = Object.entries(COUNTRY_EN_TO_ZH).find(([, zh]) => zh === countryZh);
    countryEn = pair ? pair[0] : '';
  }
  if (!cityZh && !countryZh && /[\u3400-\u9fff]/u.test(String(addrZh || '').trim())) {
    cityZh = String(addrZh || '').trim().replace(/[街路道号]+.*$/, '');
  } else if (!cityZh && /[\u3400-\u9fff]/u.test(String(addrZh || '').trim()) && String(addrZh || '').trim().length <= 12) {
    cityZh = String(addrZh || '').trim().replace(/[街路道号]+.*$/, '');
  }

  let schoolId = generateSchoolId(shortName, nameEn, rank);
  if (usedIds.has(schoolId)) {
    schoolId = `${schoolId}-${rank}`;
  }
  usedIds.add(schoolId);

  records.push({
    schoolId,
    schoolNameZh,
    schoolNameEn: nameEn,
    shortName: shortName || '',
    countryZh,
    countryEn,
    cityZh,
    cityEn,
    rank,
    logoFilename: logoPng
  });
}

insertAll(records);
const importedPrograms = importSchoolPrograms(records);
const importedApplicationCases = importApplicationCases(records);
db.close();

console.log(
  `Database generated: data/school_item.db (${insertedCount} schools inserted, ${importedPrograms} programs inserted, ${importedApplicationCases.cases} cases inserted, ${importedApplicationCases.offers} case offers inserted)`
);
