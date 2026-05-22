import katex from 'katex'
import 'katex/dist/katex.min.css'
import { escapeHtml } from './utils.js'

function renderKatex(latex, displayMode = false) {
  try {
    return katex.renderToString(String(latex || '').trim(), {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false
    })
  } catch {
    return escapeHtml(latex)
  }
}

/** 解析 $...$ 与 $$...$$ 并渲染公式，其余部分 escape */
export function renderRichText(text) {
  const raw = String(text ?? '')
  if (!raw) return ''

  const parts = raw.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)
  return parts.map((part) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const latex = part.slice(2, -2).trim()
      return `<span class="resource-math resource-math--display">${renderKatex(latex, true)}</span>`
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1).trim()
      return `<span class="resource-math resource-math--inline">${renderKatex(latex, false)}</span>`
    }
    return escapeHtml(part)
  }).join('')
}

function renderBlock(block) {
  if (block.type === 'heading') {
    return `<h4 class="resource-detail-heading">${escapeHtml(block.text || '')}</h4>`
  }
  if (block.type === 'paragraph') {
    return `<p class="resource-detail-paragraph">${renderRichText(block.text || '')}</p>`
  }
  if (block.type === 'list') {
    const items = Array.isArray(block.items) ? block.items : []
    return `<ul class="resource-detail-list resource-detail-list--flow">${items.map((item) => `<li>${renderRichText(item)}</li>`).join('')}</ul>`
  }
  if (block.type === 'formula') {
    const html = renderKatex(block.latex || '', true)
    const caption = block.caption ? `<p class="resource-detail-formula-caption">${escapeHtml(block.caption)}</p>` : ''
    return `<div class="resource-detail-formula">${html}${caption}</div>`
  }
  if (block.type === 'note') {
    return `<aside class="resource-detail-inline-note"><p>${renderRichText(block.text || '')}</p></aside>`
  }
  if (block.type === 'template') {
    const lines = Array.isArray(block.lines) ? block.lines : []
    return `<pre class="resource-detail-template resource-detail-template--flow"><code>${escapeHtml(lines.join('\n'))}</code></pre>`
  }
  return ''
}

function renderChapter(section, index) {
  const blocks = Array.isArray(section.blocks) ? section.blocks : []
  const chapterTitle = section.title
    ? `<h3 class="resource-detail-chapter-title">${escapeHtml(section.title)}</h3>`
    : ''
  return `
    <article class="resource-detail-chapter" data-section-index="${index}">
      ${chapterTitle}
      <div class="resource-detail-chapter-body">
        ${blocks.map(renderBlock).join('')}
      </div>
    </article>`
}

function renderLegacySection(section, index) {
  const title = section.title ? `<h4 class="resource-detail-section-title">${escapeHtml(section.title)}</h4>` : ''
  if (section.type === 'list') {
    const items = Array.isArray(section.items) ? section.items : []
    return `
      <section class="resource-detail-section resource-detail-section-list" data-section-index="${index}">
        ${title}
        <ul class="resource-detail-list">
          ${items.map((text) => `<li>${renderRichText(text)}</li>`).join('')}
        </ul>
      </section>`
  }
  if (section.type === 'template') {
    const lines = Array.isArray(section.lines) ? section.lines : []
    return `
      <section class="resource-detail-section resource-detail-section-template" data-section-index="${index}">
        ${title}
        <pre class="resource-detail-template"><code>${escapeHtml(lines.join('\n'))}</code></pre>
      </section>`
  }
  if (section.type === 'formula') {
    return `
      <section class="resource-detail-section resource-detail-section-formula" data-section-index="${index}">
        ${title}
        <div class="resource-detail-formula">${renderKatex(section.latex || '', true)}</div>
      </section>`
  }
  if (section.type === 'note') {
    return `
      <section class="resource-detail-section resource-detail-note" data-section-index="${index}">
        ${title}
        <p>${renderRichText(section.text || '')}</p>
      </section>`
  }
  return `
    <section class="resource-detail-section resource-detail-section-paragraph" data-section-index="${index}">
      ${title}
      <p>${renderRichText(section.text || '')}</p>
    </section>`
}

export function renderResourceSections(sections) {
  if (!Array.isArray(sections)) return ''
  return sections.map((section, index) => {
    if (section.type === 'chapter') return renderChapter(section, index)
    return renderLegacySection(section, index)
  }).join('')
}
