import fs from 'fs';
import path from 'path';
import { app } from 'electron';

function getPromptsDir() {
  const candidates = [
    path.join(app.getAppPath(), 'main', 'llm', 'prompts'),
    path.join(process.cwd(), 'main', 'llm', 'prompts')
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0];
}

export function loadPromptTemplate(name) {
  const filePath = path.join(getPromptsDir(), `${name}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt template not found: ${name}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

export function renderPromptTemplate(name, variables = {}) {
  let text = loadPromptTemplate(name);
  for (const [key, value] of Object.entries(variables)) {
    const replacement = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    text = text.replaceAll(`{{${key}}}`, replacement);
  }
  return text;
}
