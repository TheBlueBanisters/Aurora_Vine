import OpenAI from 'openai';
import { getDeepseekApiKey } from '../utils/app-config.js';
import { renderPromptTemplate } from './prompt-loader.js';

const MODEL = 'deepseek-chat';

export function requireApiKey() {
  const apiKey = getDeepseekApiKey();
  if (!apiKey) {
    throw new Error('请先在设置中配置 DeepSeek API Key');
  }
  return apiKey;
}

function createClient() {
  return new OpenAI({
    apiKey: requireApiKey(),
    baseURL: 'https://api.deepseek.com'
  });
}

export async function chatJson(systemPrompt, userPrompt, options = {}) {
  const { maxTokens = 4096 } = options;
  const client = createClient();
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    stream: false,
    temperature: 0.4,
    max_tokens: maxTokens
  });
  return response.choices?.[0]?.message?.content ?? '';
}

export async function runPromptTemplate(templateName, variables = {}, options = {}) {
  const prompt = renderPromptTemplate(templateName, variables);
  return chatJson('You are a helpful assistant that returns strict JSON only.', prompt, options);
}
