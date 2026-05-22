export function emptyLocalized() {
  return { zh: '', en: '' };
}

export function normalizeLocalized(value, fallback = '') {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      zh: String(value.zh ?? value['zh-CN'] ?? fallback).trim(),
      en: String(value.en ?? value['en-US'] ?? fallback).trim()
    };
  }
  const text = String(value ?? fallback).trim();
  return { zh: text, en: text };
}

export function serializeLocalized(value) {
  const loc = normalizeLocalized(value);
  return JSON.stringify(loc);
}

export function parseStoredLocalized(raw) {
  if (raw == null || raw === '') return emptyLocalized();
  if (typeof raw === 'object') return normalizeLocalized(raw);
  const str = String(raw).trim();
  if (str.startsWith('{')) {
    try {
      return normalizeLocalized(JSON.parse(str));
    } catch {
      return normalizeLocalized(str);
    }
  }
  return normalizeLocalized(str);
}

export function pickLocalized(value, lang = 'zh') {
  const loc = parseStoredLocalized(value);
  return loc[lang === 'en' ? 'en' : 'zh'] || loc.zh || loc.en || '';
}

export function localizedToDbField(value) {
  return serializeLocalized(normalizeLocalized(value));
}

function normalizeTaskForStorage(task = {}) {
  const dateStart = String(task?.dateStart ?? '');
  const dateEnd = String(task?.dateEnd ?? '');

  if (task?.title !== undefined) {
    const title = normalizeLocalized(task.title);
    const subtitle = normalizeLocalized(task.subtitle ?? task.content ?? '');
    if (!title.zh && !title.en) return null;
    return { title, subtitle, dateStart, dateEnd };
  }

  const content = normalizeLocalized(task?.content);
  if (!content.zh && !content.en) return null;
  return {
    title: content,
    subtitle: emptyLocalized(),
    dateStart,
    dateEnd
  };
}

export function parseTasksJson(raw) {
  try {
    const tasks = JSON.parse(raw || '[]');
    if (!Array.isArray(tasks)) return [];
    return tasks.map((task) => normalizeTaskForStorage(task)).filter(Boolean);
  } catch {
    return [];
  }
}

export function tasksToDbJson(tasks = []) {
  return JSON.stringify(
    (Array.isArray(tasks) ? tasks : [])
      .map((task) => normalizeTaskForStorage(task))
      .filter(Boolean)
  );
}

export function taskToCheckinContent(task) {
  const normalized = normalizeTaskForStorage(task);
  if (!normalized) return '';
  return JSON.stringify({
    title: normalized.title,
    subtitle: normalized.subtitle
  });
}
