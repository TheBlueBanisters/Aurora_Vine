import { app } from 'electron';
import path from 'path';
import fs from 'fs';

function getConfigPath() {
  return path.join(app.getPath('userData'), 'config.json');
}

function readConfig() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8')) || {};
  } catch {
    return {};
  }
}

function writeConfig(data) {
  const configPath = getConfigPath();
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
}

export function getDeepseekApiKey() {
  const key = String(readConfig().deepseekApiKey || '').trim();
  return key || null;
}

export function setDeepseekApiKey(apiKey) {
  const config = readConfig();
  const trimmed = String(apiKey || '').trim();
  if (trimmed) config.deepseekApiKey = trimmed;
  else delete config.deepseekApiKey;
  writeConfig(config);
  return { success: true };
}

export function maskApiKey(key) {
  const s = String(key || '').trim();
  if (!s) return '';
  if (s.length <= 8) return '****';
  return `${s.slice(0, 4)}****${s.slice(-4)}`;
}
