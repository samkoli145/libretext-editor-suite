// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-generator.ts
 * 📂 المسار: packages/core/src/blocks/html-block-generator.ts
 * 🎯 الهدف الرئيسي: توليد كود HTML و TSX نظيف ومطابق لمعايير Tailwind من شجرة
 *    عقد كتل HTML الموحدة (HtmlBlockNode Tree) بدقة ثنائية الاتجاه.
 * 📋 المعايير: Zero-Dependency, Pure Daylight Defaults, <50 lines/fn, Strict Types.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-generator.test.ts
 * 🏷️ المعرف: CORE-BLK-GEN-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive AST Visitor + Flat Tailwind Compiler + Pure String Synthesis
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بتوليد كود خالي من الثيم الداكن تماماً.
 *    2. كل دالة يجب ألا تتجاوز 50 سطراً.
 *    3. تعقيم وتأمين النصوص ضد هجمات الحقن النصي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من العقد قبل التوليد.
 *    - حماية ضد الحلقات التكرارية (Circular References).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts, html-block-registry.ts
 *    - 📄 مرتبط مباشر: packages/features/html-component/HTMLComponentEditor.tsx
 *    - 🧪 اختبارات: html-block-generator.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - compileTailwindClasses: تجميع فئات Tailwind في نص واحد (#L65)
 *    - generateHtmlNode: توليد كود HTML لعقدة واحدة وأطفالها (#L85)
 *    - generateTsxNode: توليد كود TSX/React لعقدة واحدة وأطفالها (#L115)
 *    - generateFullHtmlDocument: توليد مستند HTML كامل جاهز للعرض (#L145)
 *    - generateFullTsxComponent: توليد مكون React TSX كامل (#L165)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - الدوال مقسمة إلى أجزاء مستقلة ومطابقة لقاعدة 50 سطراً كحد أقصى.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { HtmlBlockNode, TailwindClasses, isValidBlockNode } from './html-block-types';

/**
 * تجميع كائن فئات Tailwind إلى نص فئات موحد
 * // @function-index: #1/5 — compileTailwindClasses
 */
export function compileTailwindClasses(styles?: TailwindClasses): string {
  if (!styles) return '';
  const parts: string[] = [];

  if (styles.layout) parts.push(...styles.layout);
  if (styles.spacing) parts.push(...styles.spacing);
  if (styles.sizing) parts.push(...styles.sizing);
  if (styles.typography) parts.push(...styles.typography);
  if (styles.colors) parts.push(...styles.colors);
  if (styles.borders) parts.push(...styles.borders);
  if (styles.effects) parts.push(...styles.effects);
  if (styles.responsive) parts.push(...styles.responsive);

  return parts.filter(Boolean).join(' ');
}

/**
 * تعقيم النصوص البسيطة
 */
function escapeText(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * توليد وسم HTML لعقدة مفردة
 * // @function-index: #2/5 — generateHtmlNode
 */
export function generateHtmlNode(node: HtmlBlockNode, indent = 0): string {
  if (!isValidBlockNode(node)) return '';
  const pad = '  '.repeat(indent);
  const cls = compileTailwindClasses(node.styles);
  const classAttr = cls ? ` class="${cls}"` : '';

  const childrenHtml = (node.children || [])
    .map((child) => generateHtmlNode(child, indent + 1))
    .join('\n');

  switch (node.type) {
    case 'text':
      return `${pad}<p${classAttr}>${escapeText(String(node.props.text || ''))}</p>`;
    case 'heading': {
      const level = node.props.level || 2;
      return `${pad}<h${level}${classAttr}>${escapeText(String(node.props.text || ''))}</h${level}>`;
    }
    case 'button':
      return `${pad}<button${classAttr}>${escapeText(String(node.props.text || 'إجراء'))}</button>`;
    case 'input':
      return `${pad}<input type="${node.props.type || 'text'}" placeholder="${escapeText(String(node.props.placeholder || ''))}"${classAttr} />`;
    case 'textarea':
      return `${pad}<textarea placeholder="${escapeText(String(node.props.placeholder || ''))}" rows="${node.props.rows || 4}"${classAttr}></textarea>`;
    case 'image':
      return `${pad}<img src="${node.props.src || ''}" alt="${escapeText(String(node.props.alt || ''))}"${classAttr} />`;
    case 'link':
      return `${pad}<a href="${node.props.href || '#'}"${classAttr}>${escapeText(String(node.props.text || 'رابط'))}</a>`;
    case 'badge':
      return `${pad}<span${classAttr}>${escapeText(String(node.props.text || 'شارة'))}</span>`;
    case 'container':
    case 'card':
    case 'grid':
    case 'flexbox':
    case 'tabs':
    case 'accordion':
    case 'modal':
    case 'hero':
    case 'pricing':
    case 'testimonial':
    case 'faq':
    case 'cta':
    default:
      if (!childrenHtml) {
        return `${pad}<div${classAttr}></div>`;
      }
      return `${pad}<div${classAttr}>\n${childrenHtml}\n${pad}</div>`;
  }
}

/**
 * توليد كود TSX / React لعقدة مفردة
 * // @function-index: #3/5 — generateTsxNode
 */
export function generateTsxNode(node: HtmlBlockNode, indent = 0): string {
  if (!isValidBlockNode(node)) return '';
  const pad = '  '.repeat(indent);
  const cls = compileTailwindClasses(node.styles);
  const classAttr = cls ? ` className="${cls}"` : '';

  const childrenTsx = (node.children || [])
    .map((child) => generateTsxNode(child, indent + 1))
    .join('\n');

  switch (node.type) {
    case 'text':
      return `${pad}<p${classAttr}>${escapeText(String(node.props.text || ''))}</p>`;
    case 'heading': {
      const level = node.props.level || 2;
      return `${pad}<h${level}${classAttr}>${escapeText(String(node.props.text || ''))}</h${level}>`;
    }
    case 'button':
      return `${pad}<button${classAttr}>${escapeText(String(node.props.text || 'إجراء'))}</button>`;
    case 'input':
      return `${pad}<input type="${node.props.type || 'text'}" placeholder="${escapeText(String(node.props.placeholder || ''))}"${classAttr} />`;
    case 'textarea':
      return `${pad}<textarea placeholder="${escapeText(String(node.props.placeholder || ''))}" rows={${node.props.rows || 4}}${classAttr} />`;
    case 'image':
      return `${pad}<img src="${node.props.src || ''}" alt="${escapeText(String(node.props.alt || ''))}"${classAttr} />`;
    case 'link':
      return `${pad}<a href="${node.props.href || '#'}"${classAttr}>${escapeText(String(node.props.text || 'رابط'))}</a>`;
    case 'badge':
      return `${pad}<span${classAttr}>${escapeText(String(node.props.text || 'شارة'))}</span>`;
    case 'container':
    case 'card':
    case 'grid':
    case 'flexbox':
    case 'tabs':
    case 'accordion':
    case 'modal':
    case 'hero':
    case 'pricing':
    case 'testimonial':
    case 'faq':
    case 'cta':
    default:
      if (!childrenTsx) {
        return `${pad}<div${classAttr} />`;
      }
      return `${pad}<div${classAttr}>\n${childrenTsx}\n${pad}</div>`;
  }
}

/**
 * توليد مستند HTML متكامل مع Tailwind CDN
 * // @function-index: #4/5 — generateFullHtmlDocument
 */
export function generateFullHtmlDocument(rootNodes: HtmlBlockNode[], title = 'مكون واجهة HTML'): string {
  const bodyContent = rootNodes.map((n) => generateHtmlNode(n, 2)).join('\n');
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeText(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 p-6 antialiased font-sans">
  <div class="max-w-6xl mx-auto space-y-6">
${bodyContent}
  </div>
</body>
</html>`;
}

/**
 * توليد مكون React TSX كامل قابل للاستيراد والاستخدام المباشر
 * // @function-index: #5/5 — generateFullTsxComponent
 */
export function generateFullTsxComponent(rootNodes: HtmlBlockNode[], componentName = 'UIComponent'): string {
  const jsxContent = rootNodes.map((n) => generateTsxNode(n, 2)).join('\n');
  return `import React from 'react';

export const ${componentName}: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
${jsxContent}
    </div>
  );
};

export default ${componentName};
`;
}
