import path from 'path';
import fs from 'fs';
import { app } from 'electron';

const appRoot = app.getAppPath();
const schoolDir = path.join(appRoot, 'school');
const schoolDirReal = fs.existsSync(schoolDir) ? fs.realpathSync(schoolDir) : schoolDir;

export function isSubPath(parent, target) {
  const relative = path.relative(parent, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function normalizeRankingQs(rankingQs) {
  const value = String(rankingQs ?? '').trim();
  if (!/^\d+$/.test(value)) return null;
  return value;
}

export function normalizeFilename(filename) {
  const value = String(filename ?? '').trim();
  if (!value) return null;
  if (/[\/\\]/.test(value) || value.includes('..')) return null;
  if (!/^[\w\u4e00-\u9fff\u3400-\u4dbf\u00c0-\u024f\u1e00-\u1eff._-]+$/u.test(value)) return null;
  return value;
}

export function resolveSchoolPath(rankingQs, filename) {
  const rank = normalizeRankingQs(rankingQs);
  if (!rank) return null;
  const resolved = filename
    ? path.resolve(schoolDir, `No.${rank}`, filename)
    : path.resolve(schoolDir, `No.${rank}`);
  if (!isSubPath(schoolDir, resolved)) return null;
  if (!fs.existsSync(resolved)) return null;
  const real = fs.realpathSync(resolved);
  if (!isSubPath(schoolDirReal, real)) return null;
  return real;
}

export function normalizeDateKey(dateKey) {
  const value = String(dateKey ?? '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export function normalizeMonthKey(monthKey) {
  const value = String(monthKey ?? '').trim();
  return /^\d{4}-\d{2}$/.test(value) ? value : null;
}

export function sanitizeTaskColor(color) {
  const value = String(color ?? '').trim();
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value.toUpperCase() : '#62C492';
}

export function normalizePositiveInt(value, defaultValue = null) {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) return defaultValue;
  return num;
}

export function normalizeText(value, maxLength) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  return text.slice(0, maxLength);
}

export function normalizeEmail(email) {
  const value = String(email ?? '').trim().toLowerCase();
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}

export function normalizePassword(password) {
  const value = String(password ?? '');
  if (value.length < 6 || value.length > 128) return null;
  return value;
}

export function buildDefaultNickname(email) {
  return String(email ?? '').split('@')[0].slice(0, 40) || 'Aurora用户';
}

export function normalizeNickname(nickname, fallbackEmail = '') {
  const fallback = buildDefaultNickname(fallbackEmail);
  return normalizeText(nickname, 40) || fallback;
}
