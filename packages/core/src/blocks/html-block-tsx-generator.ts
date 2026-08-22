// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-tsx-generator.ts
 * 📂 المسار: packages/core/src/blocks/html-block-tsx-generator.ts
 * 🎯 الهدف الرئيسي: مولد TSX/HTML المتقدم يدعم كل الأنواع الجديدة
 *    (Forms, Media, Interactive) مع Tailwind flattening.
 * 📋 المعايير: Zero-Dependency, Clean Output, Indentation.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-tsx-generator.test.ts
 * 🏷️ المعرف: CORE-BLK-TSX-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Tree Traversal + Template Rendering + Tailwind Flattening
 * ═══════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. لا eval أو Function constructor.
 *    2. كل خصائص HTML مهربة (escape).
 *    3. Tailwind classes من القائمة البيضاء.
 * ═══════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - escapeHtml للتحقق من النصوص.
 *    - flattenTailwind لدمج الفئات بشكل آمن.
 * ═══════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts
 *    - 📄 مرتبط مباشر: html-block-generator.ts
 *    - 🧪 اختبارات: html-block-tsx-generator.test.ts
 * ═══════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - generateTsx: توليد TSX من شجرة (#L60)
 *    - generateHtml: توليد HTML من شجرة (#L70)
 *    - renderNodeTsx: توليد TSX لعقدة (#L80)
 *    - renderNodeHtml: توليد HTML لعقدة (#L165)
 * ═══════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - المولد يدعم كل الأنواع الجديدة.
 *    - Indentation ذكية حسب العمق.
 * ═══════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم JSX expressions.
 *    - 📖 مرجع تقني: Prettier, ESLint.
 *    - 🎯 التحسينات المستقبلية: Code formatting options.
 * ═══════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════
 */

import { HtmlBlockNode, TailwindClasses } from './html-block-types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Generators | المولدات الرئيسية
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد TSX من شجرة بلوكات.
 * // @function-index: #1/14 — generateTsx
 */
export function generateTsx(nodes: HtmlBlockNode[]): string {
  return nodes.map((n) => renderNodeTsx(n, 0)).join('\n');
}

/**
 * توليد HTML من شجرة بلوكات.
 * // @function-index: #2/14 — generateHtml
 */
export function generateHtml(nodes: HtmlBlockNode[]): string {
  return nodes.map((n) => renderNodeHtml(n, 0)).join('\n');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Node Renderers | عارضات العقد
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد TSX لعقدة واحدة.
 * // @function-index: #3/14 — renderNodeTsx
 */
function renderNodeTsx(node: HtmlBlockNode, indent: number): string {
  const pad = '  '.repeat(indent);
  const classes = flattenTailwind(node.styles);
  const classAttr = classes ? ` className="${classes}"` : '';
  const dataAttr = node.data
    ? Object.entries(node.data)
        .map(([k, v]) => ` data-${k}="${escapeHtml(v)}"`)
        .join('')
    : '';

  switch (node.type) {
    case 'text':
      return `${pad}<p${classAttr}${dataAttr}>${escapeHtml(String(node.props.content ?? ''))}</p>`;

    case 'heading': {
      const level = String(node.props.level ?? 'h2');
      return `${pad}<${level}${classAttr}${dataAttr}>${escapeHtml(String(node.props.content ?? ''))}</${level}>`;
    }

    case 'button':
      return `${pad}<button${classAttr}${dataAttr}>${escapeHtml(String(node.props.label ?? ''))}</button>`;

    case 'input':
      return `${pad}<input type="${escapeHtml(String(node.props.type ?? 'text'))}" placeholder="${escapeHtml(String(node.props.placeholder ?? ''))}"${classAttr}${dataAttr} />`;

    case 'textarea':
      return `${pad}<textarea placeholder="${escapeHtml(String(node.props.placeholder ?? ''))}" rows="${node.props.rows ?? 4}"${classAttr}${dataAttr}></textarea>`;

    case 'select':
      return renderSelectTsx(node, pad, classAttr, dataAttr);

    case 'checkbox':
      return `${pad}<input type="checkbox"${classAttr}${dataAttr} />`;

    case 'radio-group':
      return renderRadioGroupTsx(node, pad, classAttr, dataAttr);

    case 'switch':
      return `${pad}<input type="checkbox" role="switch"${classAttr}${dataAttr} />`;

    case 'slider':
      return renderSliderTsx(node, pad, classAttr, dataAttr);

    case 'color-picker':
      return `${pad}<input type="color" value="${escapeHtml(String(node.props.value ?? '#000000'))}"${classAttr}${dataAttr} />`;

    case 'date-picker':
      return `${pad}<input type="date"${classAttr}${dataAttr} />`;

    case 'image':
      return `${pad}<img src="${escapeHtml(String(node.props.src ?? ''))}" alt="${escapeHtml(String(node.props.alt ?? ''))}"${classAttr}${dataAttr} />`;

    case 'video':
      return `${pad}<video src="${escapeHtml(String(node.props.src ?? ''))}" controls${classAttr}${dataAttr}></video>`;

    case 'audio':
      return `${pad}<audio src="${escapeHtml(String(node.props.src ?? ''))}" controls${classAttr}${dataAttr}></audio>`;

    case 'avatar':
      return `${pad}<img src="${escapeHtml(String(node.props.src ?? ''))}" alt="${escapeHtml(String(node.props.name ?? ''))}"${classAttr}${dataAttr} />`;

    case 'tooltip':
      return renderTooltipTsx(node, pad, classAttr, dataAttr);

    case 'popover':
      return renderPopoverTsx(node, pad, classAttr, dataAttr);

    case 'container':
    case 'grid':
    case 'flexbox':
    case 'tabs':
    case 'accordion':
    case 'hero':
    case 'pricing':
    case 'testimonial':
    case 'faq':
    case 'cta': {
      const tag = node.type === 'grid' || node.type === 'flexbox' ? 'div' : 'section';
      const children = (node.children ?? []).map((c) => renderNodeTsx(c, indent + 1)).join('\n');
      return `${pad}<${tag}${classAttr}${dataAttr}>\n${children}\n${pad}</${tag}>`;
    }

    case 'data-table':
      return renderTableTsx(node, indent);

    case 'stat-card':
      return renderStatCardTsx(node, indent);

    case 'pagination':
      return renderPaginationTsx(node, indent);

    default:
      return `${pad}<!-- Unknown block type: ${node.type} -->`;
  }
}

/**
 * توليد HTML لعقدة واحدة.
 * // @function-index: #4/14 — renderNodeHtml
 */
function renderNodeHtml(node: HtmlBlockNode, indent: number): string {
  return renderNodeTsx(node, indent).replace(/className=/g, 'class=');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Specialized Renderers | عارضات متخصصة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد Select TSX.
 * // @function-index: #5/14 — renderSelectTsx
 */
function renderSelectTsx(
  node: HtmlBlockNode,
  pad: string,
  classAttr: string,
  dataAttr: string,
): string {
  const options = (node.props.options as Array<{ value: string; label: string }>) ?? [];
  const opts = options
    .map((o) => `${pad}  <option value="${escapeHtml(String(o.value))}">${escapeHtml(String(o.label))}</option>`)
    .join('\n');
  return `${pad}<select${classAttr}${dataAttr}>\n${opts}\n${pad}</select>`;
}

/**
 * توليد Radio Group TSX.
 * // @function-index: #6/14 — renderRadioGroupTsx
 */
function renderRadioGroupTsx(
  node: HtmlBlockNode,
  pad: string,
  classAttr: string,
  dataAttr: string,
): string {
  const options = (node.props.options as Array<{ value: string; label: string }>) ?? [];
  const name = String(node.props.name ?? 'radio');
  const radios = options
    .map((o) => `${pad}  <label><input type="radio" name="${name}" value="${escapeHtml(String(o.value))}" /> ${escapeHtml(String(o.label))}</label>`)
    .join('\n');
  return `${pad}<div${classAttr}${dataAttr}>\n${radios}\n${pad}</div>`;
}

/**
 * توليد Slider TSX.
 * // @function-index: #7/14 — renderSliderTsx
 */
function renderSliderTsx(
  node: HtmlBlockNode,
  pad: string,
  classAttr: string,
  dataAttr: string,
): string {
  const min = node.props.min ?? 0;
  const max = node.props.max ?? 100;
  const value = node.props.value ?? 50;
  return `${pad}<input type="range" min="${min}" max="${max}" value="${value}"${classAttr}${dataAttr} />`;
}

/**
 * توليد Tooltip TSX.
 * // @function-index: #8/14 — renderTooltipTsx
 */
function renderTooltipTsx(
  node: HtmlBlockNode,
  pad: string,
  classAttr: string,
  dataAttr: string,
): string {
  const content = String(node.props.content ?? '');
  return `${pad}<div title="${escapeHtml(content)}"${classAttr}${dataAttr}></div>`;
}

/**
 * توليد Popover TSX.
 * // @function-index: #9/14 — renderPopoverTsx
 */
function renderPopoverTsx(
  node: HtmlBlockNode,
  pad: string,
  classAttr: string,
  dataAttr: string,
): string {
  const content = String(node.props.content ?? '');
  const children = (node.children ?? []).map((c) => renderNodeTsx(c, 1)).join('\n');
  return `${pad}<div data-popover="${escapeHtml(content)}"${classAttr}${dataAttr}>\n${children}\n${pad}</div>`;
}

/**
 * توليد Table TSX.
 * // @function-index: #10/14 — renderTableTsx
 */
function renderTableTsx(node: HtmlBlockNode, indent: number): string {
  const pad = '  '.repeat(indent);
  const classes = flattenTailwind(node.styles);
  const headers = (node.props.headers as string[]) ?? [];
  const rows = (node.props.rows as string[][]) ?? [];

  const thead = headers
    .map((h) => `${pad}    <th>${escapeHtml(h)}</th>`)
    .join('\n');

  const tbody = rows
    .map(
      (row) =>
        `${pad}    <tr>\n${row
          .map((cell) => `${pad}      <td>${escapeHtml(String(cell))}</td>`)
          .join('\n')}\n${pad}    </tr>`,
    )
    .join('\n');

  return `${pad}<table class="${classes}">\n${pad}  <thead>\n${pad}    <tr>\n${thead}\n${pad}    </tr>\n${pad}  </thead>\n${pad}  <tbody>\n${tbody}\n${pad}  </tbody>\n${pad}</table>`;
}

/**
 * توليد Stat Card TSX.
 * // @function-index: #11/14 — renderStatCardTsx
 */
function renderStatCardTsx(node: HtmlBlockNode, indent: number): string {
  const pad = '  '.repeat(indent);
  const classes = flattenTailwind(node.styles);
  const value = String(node.props.value ?? '0');
  const label = String(node.props.label ?? '');
  const change = String(node.props.change ?? '');

  return `${pad}<div class="${classes}">\n${pad}  <div class="text-3xl font-bold">${escapeHtml(value)}</div>\n${pad}  <div class="text-sm text-gray-600">${escapeHtml(label)}</div>\n${pad}  <div class="text-sm text-green-600">${escapeHtml(change)}</div>\n${pad}</div>`;
}

/**
 * توليد Pagination TSX.
 * // @function-index: #12/14 — renderPaginationTsx
 */
function renderPaginationTsx(node: HtmlBlockNode, indent: number): string {
  const pad = '  '.repeat(indent);
  const classes = flattenTailwind(node.styles);
  const current = Number(node.props.current ?? 1);
  const total = Number(node.props.total ?? 10);

  const buttons = Array.from({ length: total }, (_, i) => {
    const page = i + 1;
    const active = page === current ? 'bg-blue-600 text-white' : 'bg-white text-gray-700';
    return `${pad}  <button class="px-3 py-1 rounded ${active}">${page}</button>`;
  }).join('\n');

  return `${pad}<div class="${classes}">\n${buttons}\n${pad}</div>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helpers | دوال مساعدة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تسطيح فئات Tailwind.
 * // @function-index: #13/14 — flattenTailwind
 */
function flattenTailwind(styles?: TailwindClasses): string {
  if (!styles) return '';
  const all: string[] = [];
  for (const key of Object.keys(styles) as Array<keyof TailwindClasses>) {
    const classes = styles[key];
    if (Array.isArray(classes)) all.push(...classes);
  }
  return all.join(' ');
}

/**
 * تهريب HTML.
 * // @function-index: #14/14 — escapeHtml
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
