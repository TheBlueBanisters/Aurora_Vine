import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { createRequire } from 'module';
import { getResumeFilePath } from './resume-store.js';

const require = createRequire(import.meta.url);

function getTextCachePath(md5) {
  return path.join(app.getPath('userData'), 'resumes', `${md5}.txt`);
}

async function loadPdfParseClass() {
  try {
    const mod = await import('pdf-parse');
    if (mod?.PDFParse) return mod.PDFParse;
  } catch (err) {
    console.warn('pdf-parse ESM import failed, trying require:', err.message);
  }

  const mod = require('pdf-parse');
  if (mod?.PDFParse) return mod.PDFParse;
  if (typeof mod === 'function') return null;
  throw new Error('pdf-parse 模块加载失败');
}

async function extractPdfText(filePath) {
  const PDFParse = await loadPdfParseClass();

  if (PDFParse) {
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return String(result?.text || '').trim();
    } finally {
      await parser.destroy();
    }
  }

  // pdf-parse v1 fallback: default export is a function(buffer) => Promise<{ text }>
  const legacyParse = require('pdf-parse');
  const parseFn = legacyParse.default || legacyParse;
  if (typeof parseFn !== 'function') {
    throw new Error('当前 pdf-parse 版本不兼容，请重新安装依赖');
  }
  const buffer = fs.readFileSync(filePath);
  const result = await parseFn(buffer);
  return String(result?.text || '').trim();
}

async function extractDocxText(filePath) {
  const mammothModule = await import('mammoth');
  const mammoth = mammothModule.default || mammothModule;
  if (typeof mammoth.extractRawText !== 'function') {
    throw new Error('mammoth 模块加载失败');
  }
  const result = await mammoth.extractRawText({ path: filePath });
  return String(result?.value || '').trim();
}

async function extractDocText(filePath) {
  const wordModule = await import('word-extractor');
  const WordExtractor = wordModule.default || wordModule;
  const extractor = new WordExtractor();
  const doc = await extractor.extract(filePath);
  const body = String(doc?.getBody() || '').trim();
  if (body) return body;
  throw new Error('无法解析 .doc 文件，请另存为 PDF 或 DOCX 后重试');
}

export async function extractResumeText(md5) {
  const hash = String(md5 || '').trim();
  const cachePath = getTextCachePath(hash);
  if (fs.existsSync(cachePath)) {
    const cached = fs.readFileSync(cachePath, 'utf8').trim();
    if (cached) return cached;
    try { fs.unlinkSync(cachePath); } catch { /* ignore stale empty cache */ }
  }

  const filePath = getResumeFilePath(hash);
  if (!filePath) return { error: '简历文件不存在，请重新上传' };

  const ext = path.extname(filePath).toLowerCase();
  let text = '';
  try {
    if (ext === '.pdf') text = await extractPdfText(filePath);
    else if (ext === '.docx') text = await extractDocxText(filePath);
    else if (ext === '.doc') text = await extractDocText(filePath);
    else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      text = '[图片格式简历] 文件已成功存档，但暂不支持 OCR 文字识别。请主要依据申请人填写的结构化背景信息进行评估。\n[Image resume] Stored successfully; OCR is not available. Please evaluate using the structured profile data.';
    } else return { error: '不支持的简历格式' };
  } catch (err) {
    console.error('extractResumeText error:', err);
    return { error: err.message || '简历文本提取失败' };
  }

  if (!text) return { error: '未能从简历中提取到文本内容（可能是扫描版 PDF，暂不支持 OCR）' };

  fs.writeFileSync(cachePath, text, 'utf8');
  return text;
}
