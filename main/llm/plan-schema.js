const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function extractJsonText(raw) {
  let text = String(raw ?? '').trim();
  if (!text) throw new Error('LLM 返回为空');
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  return text;
}

function closeOpenJsonContainers(text) {
  let inString = false;
  let escaped = false;
  const stack = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' && stack[stack.length - 1] === '{') stack.pop();
    else if (ch === ']' && stack[stack.length - 1] === '[') stack.pop();
  }

  if (inString) return null;

  let repaired = text;
  for (let i = stack.length - 1; i >= 0; i--) {
    repaired += stack[i] === '{' ? '}' : ']';
  }
  return repaired;
}

function salvageCompleteArrayItems(text, arrayKey) {
  const marker = `"${arrayKey}"`;
  const keyIdx = text.indexOf(marker);
  if (keyIdx < 0) return null;

  const arrayStart = text.indexOf('[', keyIdx);
  if (arrayStart < 0) return null;

  const body = text.slice(arrayStart + 1);
  const items = [];
  let depth = 0;
  let itemStart = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') {
      if (depth === 0) itemStart = i;
      depth++;
      continue;
    }
    if (ch === '}') {
      depth--;
      if (depth === 0 && itemStart >= 0) {
        items.push(body.slice(itemStart, i + 1));
        itemStart = -1;
      }
    }
  }

  if (items.length === 0) return null;

  const prefix = text.slice(0, arrayStart + 1);
  const candidate = `${prefix}${items.join(',')}]}`;
  try {
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed?.[arrayKey]) && parsed[arrayKey].length > 0) return parsed;
  } catch {
    return null;
  }
  return null;
}

function tryRepairJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    /* fall through */
  }

  const salvagedDaily = salvageCompleteArrayItems(text, 'dailyTasks');
  if (salvagedDaily) return salvagedDaily;

  const salvagedEntries = salvageCompleteArrayItems(text, 'entries');
  if (salvagedEntries) return salvagedEntries;

  let attempt = text;
  for (let i = 0; i < 24; i++) {
    const closed = closeOpenJsonContainers(attempt);
    if (!closed) break;
    try {
      return JSON.parse(closed);
    } catch {
      const cut = attempt.lastIndexOf(',');
      if (cut <= 0) break;
      attempt = attempt.slice(0, cut);
    }
  }

  return null;
}

export function parseJsonFromLlm(raw) {
  const text = extractJsonText(raw);
  const parsed = tryRepairJson(text);
  if (parsed != null) return parsed;
  return JSON.parse(text);
}

function normalizeLocalizedInput(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    const text = value.trim();
    return text ? { zh: text, en: text } : null;
  }
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  return null;
}

function assertLocalized(value, fieldName, { allowEmpty = false } = {}) {
  const normalized = normalizeLocalizedInput(value);
  if (!normalized) {
    throw new Error(`${fieldName} 必须是 { zh, en } 对象`);
  }
  let zh = String(normalized.zh ?? normalized.cn ?? normalized.chinese ?? '').trim();
  let en = String(normalized.en ?? normalized.english ?? '').trim();
  if (!zh && en) zh = en;
  if (!en && zh) en = zh;
  if (!allowEmpty && (!zh || !en)) {
    throw new Error(`${fieldName} 的中英文内容均不能为空`);
  }
  return { zh, en };
}

function assertDate(value, fieldName) {
  const date = String(value ?? '').trim();
  if (!DATE_RE.test(date)) throw new Error(`${fieldName} 必须是 YYYY-MM-DD 格式`);
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`${fieldName} 日期无效`);
  return date;
}

function validateTask(task, idx, { requireSubtitle = true } = {}) {
  const title = assertLocalized(task?.title ?? task?.content, `tasks[${idx}].title`);
  const subtitle = assertLocalized(
    task?.subtitle ?? { zh: '', en: '' },
    `tasks[${idx}].subtitle`,
    { allowEmpty: !requireSubtitle }
  );
  if (requireSubtitle && (!subtitle.zh || !subtitle.en)) {
    throw new Error(`tasks[${idx}].subtitle 的中英文内容均不能为空`);
  }
  return {
    title,
    subtitle,
    dateStart: assertDate(task?.dateStart, `tasks[${idx}].dateStart`),
    dateEnd: assertDate(task?.dateEnd, `tasks[${idx}].dateEnd`)
  };
}

export function validateScoreResponse(data) {
  const llmScore = Number(data?.llmScore);
  if (!Number.isFinite(llmScore) || llmScore < 0 || llmScore > 100) {
    throw new Error('llmScore 必须是 0-100 的数字');
  }
  return {
    llmScore: Math.round(llmScore * 100) / 100,
    summary: assertLocalized(data?.summary, 'summary')
  };
}

const OUTLINE_CATEGORIES = new Set(['strength', 'weakness', 'improvement']);

function validateEntry(entry, requireTasks, taskOptions = {}) {
  const title = assertLocalized(entry?.title, 'title');
  const description = assertLocalized(entry?.description, 'description');
  const tasks = Array.isArray(entry?.tasks) ? entry.tasks : [];
  if (requireTasks && tasks.length === 0) {
    throw new Error('schedule entries 必须包含 tasks');
  }
  return {
    title,
    description,
    tasks: tasks.map((task, idx) => validateTask(task, idx, taskOptions))
  };
}

function validateOutlineHighlights(raw, entryIdx) {
  const items = Array.isArray(raw) ? raw : [];
  return items.slice(0, 6).map((item, i) =>
    assertLocalized(item, `entries[${entryIdx}].highlights[${i}]`)
  );
}

function validateOutlineEntry(entry, idx) {
  const title = assertLocalized(entry?.title, `entries[${idx}].title`);
  const description = assertLocalized(entry?.description, `entries[${idx}].description`);
  const categoryRaw = String(entry?.category ?? '').trim();
  const descriptionPayload = { ...description };
  if (OUTLINE_CATEGORIES.has(categoryRaw)) {
    descriptionPayload.category = categoryRaw;
  }
  const highlights = validateOutlineHighlights(entry?.highlights, idx);
  if (highlights.length > 0) {
    descriptionPayload.highlights = highlights;
  }
  return {
    title,
    description: descriptionPayload,
    tasks: []
  };
}

export function validateOutlineResponse(data) {
  const entries = Array.isArray(data?.entries) ? data.entries.slice(0, 6) : [];
  if (entries.length === 0) throw new Error('outline entries 不能为空');

  const schoolTiers = {
    reach: Array.isArray(data?.schoolTiers?.reach) ? data.schoolTiers.reach : [],
    match: Array.isArray(data?.schoolTiers?.match) ? data.schoolTiers.match : [],
    safety: Array.isArray(data?.schoolTiers?.safety) ? data.schoolTiers.safety : []
  };

  return {
    entries: entries.map((entry, idx) => validateOutlineEntry(entry, idx)),
    schoolTiers,
    encouragementNote: assertLocalized(
      data?.encouragementNote ?? { zh: '', en: '' },
      'encouragementNote',
      { allowEmpty: true }
    )
  };
}

export function validateScheduleResponse(data) {
  const entries = Array.isArray(data?.entries) ? data.entries : [];
  if (entries.length === 0) throw new Error('schedule entries 不能为空');
  return {
    entries: entries.map((entry) => validateEntry(entry, true, { requireSubtitle: true })),
    encouragementNote: assertLocalized(
      data?.encouragementNote ?? { zh: '', en: '' },
      'encouragementNote',
      { allowEmpty: true }
    )
  };
}

export function validateDailyTasksResponse(data, { allowPartial = true } = {}) {
  const raw = Array.isArray(data?.dailyTasks) ? data.dailyTasks : [];
  if (raw.length === 0) throw new Error('dailyTasks 不能为空');

  const dailyTasks = [];
  raw.forEach((task, idx) => {
    try {
      dailyTasks.push(validateTask(task, idx, { requireSubtitle: true }));
    } catch (err) {
      if (!allowPartial) throw err;
    }
  });

  if (dailyTasks.length === 0) throw new Error('dailyTasks 无有效条目');
  return { dailyTasks: dailyTasks.slice(0, 40) };
}

export function validatePersonalStatementResponse(data) {
  return {
    statement: assertLocalized(data?.statement, 'statement')
  };
}

export function entriesToSavePayload(entries, source = 'llm', kind = 'outline') {
  return entries.map((entry) => ({
    title: JSON.stringify(entry.title),
    description: JSON.stringify(entry.description),
    tasks: entry.tasks,
    source,
    kind
  }));
}

export function dailyTasksToCheckinPayload(dailyTasks = [], color) {
  return dailyTasks.map((task) => ({
    title: task.title,
    subtitle: task.subtitle,
    dateStart: task.dateStart,
    dateEnd: task.dateEnd,
    color
  }));
}
