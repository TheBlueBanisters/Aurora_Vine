const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

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
`);

const schoolDir = path.join(__dirname, '..', 'school');

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
db.close();

console.log(`Database generated: data/school_item.db (${insertedCount} schools inserted)`);
