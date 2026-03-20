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
  'indonesia': 'Indonesia', 'philippines': 'Philippines', 'egypt': 'Egypt',
  'greece': 'Greece'
};

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
  nameEn = nameEn.replace(/[，,].+$/, '').trim();
  return { nameEn, shortName };
}

function parseAddressZh(addrZh) {
  let countryZh = '';
  let cityZh = '';
  for (const c of COUNTRY_ZH_LIST) {
    if (addrZh.startsWith(c)) {
      countryZh = c;
      const rest = addrZh.slice(c.length);
      const cityMatch = rest.match(/^(.+?)(?:省|州|特别市|特别行政区|市|区|县|街|路|道|大道|号|大街|\d)/);
      if (cityMatch) {
        cityZh = cityMatch[1];
      } else {
        cityZh = rest.replace(/[省州市区街路道号]+.*$/, '');
      }
      break;
    }
  }
  return { countryZh, cityZh };
}

function parseAddressEn(addrEn) {
  const parts = addrEn.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2) return { countryEn: '', cityEn: '' };
  const lastPart = parts[parts.length - 1].toLowerCase().replace(/^\s*the\s+/, '');
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

  const schoolNameZh = logoPng.replace(/\.png$/i, '');
  const zhIntro = (intro.intro?.zh || []).join(' ');
  const { nameEn, shortName } = extractEnglishNameAndShort(zhIntro);

  const addrZh = intro.address?.zh || '';
  const addrEn = intro.address?.en || '';
  const { countryZh, cityZh } = parseAddressZh(addrZh);
  const { countryEn, cityEn } = parseAddressEn(addrEn);

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
