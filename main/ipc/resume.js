import { ipcMain } from 'electron';
import { saveResume, clearAllResumes, listResumeIndex } from '../utils/resume-store.js';
import { extractResumeText } from '../utils/resume-text.js';

export function registerResumeIpc() {
  ipcMain.handle('resume:upload', async (_event, payload = {}) => {
    const raw = String(payload?.base64 ?? '').trim();
    const filename = String(payload?.filename ?? 'resume.pdf').trim();
    const m = raw.match(/^data:[^;]+;base64,(.+)$/i) || raw.match(/^(.+)$/);
    if (!m) return { success: false, error: '文件数据无效' };

    let buffer;
    try {
      buffer = Buffer.from(m[1], 'base64');
    } catch {
      return { success: false, error: '文件数据无效' };
    }

    try {
      return saveResume(buffer, filename);
    } catch (err) {
      console.error('resume:upload error:', err);
      return { success: false, error: err.message || '简历上传失败' };
    }
  });

  ipcMain.handle('resume:clearAll', async () => {
    try {
      return clearAllResumes();
    } catch (err) {
      console.error('resume:clearAll error:', err);
      return { success: false, error: err.message || '清除失败' };
    }
  });

  ipcMain.handle('resume:list', async () => {
    try {
      return { items: listResumeIndex() };
    } catch (err) {
      return { items: [], error: err.message || '读取失败' };
    }
  });

  ipcMain.handle('resume:getText', async (_event, md5) => {
    try {
      const result = await extractResumeText(md5);
      if (typeof result === 'string') return { text: result };
      return { error: result?.error || '提取失败' };
    } catch (err) {
      console.error('resume:getText error:', err);
      return { error: err.message || '提取失败' };
    }
  });
}
