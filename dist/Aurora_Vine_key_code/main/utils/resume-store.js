import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const RESUME_MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTS = new Set(['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']);

function getResumesDir() {
  return path.join(app.getPath('userData'), 'resumes');
}

function getIndexPath() {
  return path.join(getResumesDir(), 'index.json');
}

function readIndex() {
  const indexPath = getIndexPath();
  if (!fs.existsSync(indexPath)) return { items: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return { items: Array.isArray(parsed?.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

function writeIndex(data) {
  const dir = getResumesDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(getIndexPath(), JSON.stringify(data, null, 2), 'utf8');
}

export function computeMd5(buffer) {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

export function validateResumeFile(filename, buffer) {
  const ext = path.extname(String(filename || '')).toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) {
    return { ok: false, error: '仅支持 PDF、DOC、DOCX、PNG、JPG 格式' };
  }
  if (!buffer || buffer.length === 0) {
    return { ok: false, error: '文件内容为空' };
  }
  if (buffer.length > RESUME_MAX_BYTES) {
    return { ok: false, error: '文件过大，请选择 10MB 以内的简历' };
  }
  return { ok: true, ext };
}

export function saveResume(buffer, filename) {
  const validation = validateResumeFile(filename, buffer);
  if (!validation.ok) return validation;

  const md5 = computeMd5(buffer);
  const dir = getResumesDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${md5}${validation.ext}`);
  const index = readIndex();
  const existing = index.items.find((item) => item.md5 === md5);

  if (existing && fs.existsSync(filePath)) {
    return { success: true, duplicate: true, md5, ext: validation.ext, originalName: existing.originalName || filename };
  }

  fs.writeFileSync(filePath, buffer, { flag: 'w' });

  const entry = {
    md5,
    originalName: String(filename || 'resume').trim(),
    ext: validation.ext,
    uploadedAt: new Date().toISOString()
  };
  const nextItems = index.items.filter((item) => item.md5 !== md5);
  nextItems.push(entry);
  writeIndex({ items: nextItems });

  return { success: true, duplicate: false, md5, ext: validation.ext, originalName: entry.originalName };
}

export function getResumeFilePath(md5) {
  const hash = String(md5 || '').trim();
  if (!/^[a-f0-9]{32}$/i.test(hash)) return null;
  const index = readIndex();
  const entry = index.items.find((item) => item.md5 === hash);
  if (!entry) return null;
  const filePath = path.join(getResumesDir(), `${hash}${entry.ext}`);
  return fs.existsSync(filePath) ? filePath : null;
}

export function clearAllResumes() {
  const dir = getResumesDir();
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      for (const name of fs.readdirSync(dir)) {
        try { fs.unlinkSync(path.join(dir, name)); } catch { /* ignore */ }
      }
    }
  }
  writeIndex({ items: [] });
  return { success: true };
}

export function listResumeIndex() {
  return readIndex().items;
}
