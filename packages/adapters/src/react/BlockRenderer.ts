/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: BlockRenderer.ts
 * 📂 المسار: packages/adapters/src/react/BlockRenderer.ts
 * 🎯 الهدف الرئيسي: دالة لعرض جميع أنواع الكتل الـ 25 كـ HTML string
 * 📋 المعايير: متوافق مع محور React القائم على innerHTML بدون اعتماديات
 * 🧪 الاختبارات: TEST-ADAP-BLOCK-RENDERER
 * 🏷️ المعرف: ADAP-BLOCK-RENDERER
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Polymorphic Block Dispatcher + Headless String Rendering
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { AnyBlockNode, InlineNode } from '@libretext/core';

export interface BlockRenderOptions {
  readonly selected?: boolean;
  readonly readOnly?: boolean;
}

export function renderBlock(block: AnyBlockNode, options?: BlockRenderOptions): string {
  const cls = `lt-block lt-block--${block.type}${options?.selected ? ' lt-block--selected' : ''}`;
  return `<div class="${cls}" data-block-id="${block.id}" data-domain="${block.domain}">${renderBlockInner(block)}</div>`;
}

function renderBlockInner(block: AnyBlockNode): string {
  switch (block.type) {
    case 'paragraph':
      return `<p class="lt-paragraph">${escapeHtml(extractText(block.content))}</p>`;
    case 'heading':
      return `<h${block.data.level} class="lt-heading">${escapeHtml(extractText(block.content))}</h${block.data.level}>`;
    case 'table':
      return renderTable(block);
    case 'image':
      return `<img class="lt-image" src="${escapeHtml(block.data.src)}" alt="${escapeHtml(block.data.alt)}" style="max-width:100%">`;
    case 'list':
      return renderList(block);
    case 'code_block':
      return `<pre class="lt-code-block"><code>${escapeHtml(block.data.code)}</code></pre>`;
    case 'horizontal_rule':
      return `<hr class="lt-hr" style="border:none;border-top:${block.data.thickness}px ${block.data.style} ${colorForVariant(block.data.colorVariant)}">`;
    case 'blockquote':
      return renderBlockquote(block);
    case 'cell':
      return `<span class="lt-cell">${escapeHtml(String(block.data.computedValue ?? ''))}</span>`;
    case 'shape':
      return renderShape(block);
    case 'slide':
      return `<div class="lt-slide" style="border:1px solid #e2e8f0;border-radius:8px;padding:24px;text-align:center;background:#f8fafc"><h3 style="margin:0">${escapeHtml(block.data.title)}</h3><p style="color:#64748b">${block.data.layout}</p></div>`;
    case 'database_record':
      return renderDatabaseRecord(block);
    case 'embed':
      return `<div class="lt-embed" style="padding:16px;border:1px solid #e2e8f0;border-radius:8px"><p style="margin:0;color:#64748b">Embed: ${escapeHtml(block.data.src)}</p><span style="font-size:0.8em;color:#94a3b8">(${block.data.provider})</span></div>`;
    case 'pdf':
      return `<div class="lt-pdf" style="border:1px solid #e2e8f0;border-radius:8px;padding:16px"><p style="margin:0">📄 ${escapeHtml(block.data.title)}</p><span style="font-size:0.85em;color:#64748b">صفحات: ${block.data.totalPages} | الحالية: ${block.data.currentPage}</span></div>`;
    case 'color-picker':
      return `<div class="lt-color-picker" style="display:flex;align-items:center;gap:8px"><span style="width:24px;height:24px;border-radius:50%;background:${block.data.color};border:2px solid #e2e8f0;display:inline-block"></span><code style="font-size:0.85em">${block.data.color}</code></div>`;
    case 'icon-picker':
      return `<div class="lt-icon-picker" style="font-size:${block.data.size || 24}px;color:${block.data.color || '#000'}">[${escapeHtml(block.data.iconName)}]</div>`;
    case 'bg-color':
      return `<div class="lt-bg-color" style="width:100%;height:48px;border-radius:8px;background:${block.data.color}"></div>`;
    case 'bg-image':
      return `<div class="lt-bg-image" style="width:100%;height:120px;border-radius:8px;background-image:url('${escapeHtml(block.data.url)}');background-size:${block.data.size};background-position:${block.data.position}"></div>`;
    case 'gradient':
      return renderGradient(block);
    case 'font-picker':
      return `<div class="lt-font-picker" style="font-family:${block.data.fontFamily};padding:8px">${escapeHtml(block.data.fontFamily)} — ${block.data.fontSize}px</div>`;
    case 'text-styler':
      return `<div class="lt-text-styler" style="padding:8px;color:#334155">Text Styler</div>`;
    case 'template-card':
      return renderTemplateCard(block);
    case 'template-gallery':
      return `<div class="lt-template-gallery" style="padding:16px;border:1px solid #e2e8f0;border-radius:8px"><h4 style="margin:0 0 8px">Template Gallery</h4><p style="margin:0;color:#64748b">${block.data.items.length} templates</p></div>`;
    default:
      return `<div class="lt-unknown">Unknown block type</div>`;
  }
}

function extractText(nodes: readonly InlineNode[]): string {
  return nodes.map((n) => {
    if ('text' in n) return n.text;
    if ('content' in n) return extractText(n.content);
    return '';
  }).join('');
}

function colorForVariant(variant: string): string {
  switch (variant) {
    case 'subtle': return '#e2e8f0';
    case 'muted': return '#94a3b8';
    case 'accent': return '#3b82f6';
    default: return '#e2e8f0';
  }
}

function renderTable(block: import('@libretext/core').TableBlockNode): string {
  const rows = block.rows.map((row) => {
    const cells = row.cells.map((cell) => {
      return `<td style="border:1px solid #e2e8f0;padding:8px">${escapeHtml(cell.text)}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table class="lt-table" style="border-collapse:collapse;width:100%"><tbody>${rows}</tbody></table>`;
}

function renderList(block: import('@libretext/core').ListBlockNode): string {
  const tag = block.data.ordered ? 'ol' : 'ul';
  const items = block.items.map((item) => {
    const check = block.data.listType === 'task' ? `<span style="margin-right:6px">${item.checked ? '☑' : '☐'}</span>` : '';
    return `<li>${check}${escapeHtml(item.text)}</li>`;
  }).join('');
  return `<${tag} class="lt-list">${items}</${tag}>`;
}

function renderBlockquote(block: import('@libretext/core').BlockquoteBlockNode): string {
  const border = block.data.borderPosition === 'right' ? 'border-right:4px solid #3b82f6' : '';
  const author = block.data.author
    ? `<footer style="font-size:0.85em;color:#64748b">— ${escapeHtml(block.data.author)}${block.data.source ? ` (${escapeHtml(block.data.source)})` : ''}</footer>`
    : '';
  return `<blockquote class="lt-blockquote" style="${border};padding:8px 16px;margin:0;color:#334155"><p>${escapeHtml(block.data.text)}</p>${author}</blockquote>`;
}

function renderShape(block: import('@libretext/core').ShapeBlockNode): string {
  const { width, height, shapeType, fillColor, strokeColor, strokeWidth } = block.data;
  if (shapeType === 'circle') {
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><ellipse cx="${width / 2}" cy="${height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/></svg>`;
  }
  if (shapeType === 'triangle') {
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><polygon points="${width / 2},0 0,${height} ${width},${height}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/></svg>`;
  }
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="0" y="0" width="${width}" height="${height}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" rx="4"/></svg>`;
}

function renderGradient(block: import('@libretext/core').GradientBlockNode): string {
  const stops = block.data.stops.map((s) => `${s.color} ${s.position}%`).join(', ');
  let bg = '';
  if (block.data.gradientType === 'linear') bg = `linear-gradient(${block.data.angle || 90}deg, ${stops})`;
  else if (block.data.gradientType === 'radial') bg = `radial-gradient(circle, ${stops})`;
  else bg = `conic-gradient(from ${block.data.angle || 0}deg, ${stops})`;
  return `<div class="lt-gradient" style="width:100%;height:80px;border-radius:8px;background:${bg}"></div>`;
}

function renderDatabaseRecord(block: import('@libretext/core').DatabaseRecordBlockNode): string {
  const fields = Object.values(block.data.fields).map((f) => {
    return `<dt style="font-weight:600;color:#334155">${escapeHtml(f.label)}</dt><dd style="margin:0;color:#64748b">${escapeHtml(String(f.value))}</dd>`;
  }).join('');
  return `<div class="lt-database-record" style="border:1px solid #e2e8f0;border-radius:8px;padding:16px"><h4 style="margin:0 0 8px">${escapeHtml(block.data.title)}</h4><dl style="margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 12px">${fields}</dl></div>`;
}

function renderTemplateCard(block: import('@libretext/core').TemplateCardBlockNode): string {
  const img = block.data.imageUrl ? `<img src="${escapeHtml(block.data.imageUrl)}" alt="${escapeHtml(block.data.title)}" style="max-width:100%;border-radius:4px;margin-bottom:8px">` : '';
  const btn = block.data.buttonText ? `<button style="margin-top:8px;background:#3b82f6;color:#fff;border:none;border-radius:4px;padding:6px 12px;cursor:pointer">${escapeHtml(block.data.buttonText)}</button>` : '';
  return `<div class="lt-template-card" style="border:1px solid #e2e8f0;border-radius:8px;padding:16px">${img}<h3 style="margin:0 0 4px">${escapeHtml(block.data.title)}</h3><p style="margin:0;color:#64748b">${escapeHtml(block.data.description)}</p>${btn}</div>`;
}

function escapeHtml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );
}
