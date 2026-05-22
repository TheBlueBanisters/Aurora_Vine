import { getLang } from './i18n.js';

export function parseStoredLocalized(raw) {
  if (raw == null || raw === '') return { zh: '', en: '' };
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return {
      zh: String(raw.zh ?? '').trim(),
      en: String(raw.en ?? '').trim()
    };
  }
  const str = String(raw).trim();
  if (str.startsWith('{')) {
    try {
      const parsed = JSON.parse(str);
      return {
        zh: String(parsed.zh ?? '').trim(),
        en: String(parsed.en ?? '').trim()
      };
    } catch {
      return { zh: str, en: str };
    }
  }
  return { zh: str, en: str };
}

export function pickLocalized(value, lang = getLang()) {
  const loc = parseStoredLocalized(value);
  if (lang === 'en') return loc.en || loc.zh || '';
  return loc.zh || loc.en || '';
}

export function normalizeTaskRecord(task = {}) {
  const dateStart = String(task.dateStart ?? '');
  const dateEnd = String(task.dateEnd ?? '');

  if (task.title !== undefined) {
    return {
      title: parseStoredLocalized(task.title),
      subtitle: parseStoredLocalized(task.subtitle ?? task.content ?? ''),
      dateStart,
      dateEnd
    };
  }

  const legacy = parseStoredLocalized(task.content);
  return {
    title: legacy,
    subtitle: { zh: '', en: '' },
    dateStart,
    dateEnd
  };
}

export function parseLocalizedTasks(raw) {
  try {
    const tasks = JSON.parse(raw || '[]');
    if (!Array.isArray(tasks)) return [];
    return tasks.map((task) => normalizeTaskRecord(task));
  } catch {
    return [];
  }
}

export function serializeCheckinTaskContent(title, subtitle, lang = getLang()) {
  const payload = {
    title: parseStoredLocalized(title),
    subtitle: parseStoredLocalized(subtitle)
  };
  return JSON.stringify(payload);
}

export function parseCheckinTaskContent(raw) {
  const str = String(raw ?? '').trim();
  if (!str) {
    return { title: { zh: '', en: '' }, subtitle: { zh: '', en: '' }, isStructured: false };
  }
  if (str.startsWith('{')) {
    try {
      const parsed = JSON.parse(str);
      if (parsed?.title !== undefined) {
        return {
          title: parseStoredLocalized(parsed.title),
          subtitle: parseStoredLocalized(parsed.subtitle),
          isStructured: true
        };
      }
    } catch {
      /* fall through */
    }
  }
  return {
    title: { zh: str, en: str },
    subtitle: { zh: '', en: '' },
    isStructured: false
  };
}

export function pickTaskTitle(task, lang = getLang()) {
  return pickLocalized(task?.title, lang);
}

export function pickTaskSubtitle(task, lang = getLang()) {
  return pickLocalized(task?.subtitle, lang);
}
