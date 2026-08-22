/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محللات كتل HTML - تحليل وتحويل كتل HTML إلى هياكل بيانات
 * 🏛️ الدور: محرك مشترك - تحليل DOM وتحويله لـ AST
 * 📥 المستهلك: LiveInterpreterEngine, SharedMarkdownHtmlSuite, WebScrapingEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    DOM-to-AST Converter: تحويل DOM Browser إلى شجرة AST مشتركة
 *    يمكن التعديل عليها ثم إعادة تصييرها
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. DOMParser قد يفشل على HTML غير صالح
 *    2. بعض الوسوم المخصصة قد لا تُعرف
 *    3. الخصائص data-* يجب الحفاظ عليها
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة HTML قبل التحليل
 *    - إرجاع شجرة فارغة عند الخطأ بدلاً من استثناء
 *    - الحفاظ على خصائص data-* أثناء التحويل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/htmlBlockParsers.ts
// ============================================================
// محولات البلوك وتحليل وسوم HTML (HTML Block Parsers & Serializers)
// ============================================================

import { WebBlock, BlockType } from './types';

export interface HtmlBlockParser {
  nodeNames: string[];
  serialize(block: WebBlock, innerHtml: string): string;
  parse(el: Element): Omit<WebBlock, 'id'> | null;
}

export function stylesObjectToString(styles?: Record<string, string>): string {
  if (!styles) return '';
  return Object.entries(styles)
    .filter(([_, v]) => v !== undefined && v !== '')
    .map(([k, v]) => {
      const kebabKey = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${v}`;
    })
    .join('; ');
}

export function styleAttrToBlockStyles(element: Element): Record<string, string> {
  const styles: Record<string, string> = {};
  const styleAttr = element.getAttribute('style');
  if (styleAttr) {
    styleAttr.split(';').forEach((rule) => {
      const [k, v] = rule.split(':').map((s) => s.trim());
      if (k && v) {
        const camelKey = k.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelKey] = v;
      }
    });
  }
  return styles;
}

export function extractCleanAttributes(element: Element): Record<string, string> {
  const attributes: Record<string, string> = {};
  Array.from(element.attributes).forEach((attr) => {
    if (!['style', 'class', 'data-wp-id', 'data-wp-type', 'data-wp-size', 'data-align'].includes(attr.name)) {
      attributes[attr.name] = attr.value;
    }
  });
  return attributes;
}

export const HTML_BLOCK_PARSERS: Record<string, HtmlBlockParser> = {
  heading: {
    nodeNames: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
    serialize: (block, innerHtml) => {
      const tag = block.tag || 'h2';
      const style = stylesObjectToString(block.styles);
      const align = block.styles?.textAlign ? ` data-align="${block.styles.textAlign}"` : '';
      const styleAttr = style ? ` style="${style}"` : '';
      return `<${tag} data-wp-type="heading"${align}${styleAttr}>${innerHtml || block.content || ''}</${tag}>`;
    },
    parse: (el) => ({
      type: 'heading',
      tag: el.tagName.toLowerCase(),
      name: 'عنوان',
      content: el.textContent?.trim() || '',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  text: {
    nodeNames: ['P', 'SPAN', 'ARTICLE', 'SECTION'],
    serialize: (block, innerHtml) => {
      const tag = block.tag || 'p';
      const style = stylesObjectToString(block.styles);
      const align = block.styles?.textAlign ? ` data-align="${block.styles.textAlign}"` : '';
      const styleAttr = style ? ` style="${style}"` : '';
      return `<${tag} data-wp-type="text"${align}${styleAttr}>${innerHtml || block.content || ''}</${tag}>`;
    },
    parse: (el) => ({
      type: 'text',
      tag: el.tagName.toLowerCase(),
      name: 'فقرة نصية',
      content: el.textContent?.trim() || '',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  button: {
    nodeNames: ['BUTTON', 'A'],
    serialize: (block, innerHtml) => {
      const tag = block.tag || 'button';
      const style = stylesObjectToString(block.styles);
      const styleAttr = style ? ` style="${style}"` : '';
      const href = block.attributes?.href ? ` href="${block.attributes.href}"` : '';
      return `<${tag} data-wp-type="button"${href}${styleAttr}>${innerHtml || block.content || 'زر تفاعلي'}</${tag}>`;
    },
    parse: (el) => ({
      type: 'button',
      tag: el.tagName.toLowerCase(),
      name: 'زر تفاعلي',
      content: el.textContent?.trim() || 'زر تفاعلي',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  image: {
    nodeNames: ['IMG'],
    serialize: (block) => {
      const style = stylesObjectToString(block.styles);
      const styleAttr = style ? ` style="${style}"` : '';
      const src = block.attributes?.src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80';
      const alt = block.attributes?.alt || 'صورة توضيحية';
      return `<img data-wp-type="image" src="${src}" alt="${alt}"${styleAttr} />`;
    },
    parse: (el) => ({
      type: 'image',
      tag: 'img',
      name: 'صورة',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  container: {
    nodeNames: ['DIV', 'HEADER', 'FOOTER', 'NAV', 'MAIN'],
    serialize: (block, innerHtml) => {
      const tag = block.tag || 'div';
      const style = stylesObjectToString(block.styles);
      const styleAttr = style ? ` style="${style}"` : '';
      return `<${tag} data-wp-type="container"${styleAttr}>${innerHtml}</${tag}>`;
    },
    parse: (el) => ({
      type: 'container',
      tag: el.tagName.toLowerCase(),
      name: 'حاوية قسم',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  grid: {
    nodeNames: ['DIV'],
    serialize: (block, innerHtml) => {
      const style = stylesObjectToString({ display: 'flex', flexWrap: 'wrap', ...block.styles });
      return `<div data-wp-type="grid" style="${style}">${innerHtml}</div>`;
    },
    parse: (el) => ({
      type: 'grid',
      tag: 'div',
      name: 'صف شبكة (Grid Row)',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  column: {
    nodeNames: ['DIV'],
    serialize: (block, innerHtml) => {
      const size = block.size || 6;
      const style = stylesObjectToString({
        width: `${((size / 12) * 100).toFixed(4)}%`,
        flex: `0 0 ${((size / 12) * 100).toFixed(4)}%`,
        ...block.styles,
      });
      return `<div data-wp-type="column" data-wp-size="${size}" style="${style}">${innerHtml}</div>`;
    },
    parse: (el) => {
      const sizeAttr = el.getAttribute('data-wp-size');
      const size = sizeAttr ? parseInt(sizeAttr, 10) : 6;
      return {
        type: 'column',
        tag: 'div',
        name: `عمود (${size}/12)`,
        size,
        styles: styleAttrToBlockStyles(el),
        attributes: extractCleanAttributes(el),
      };
    },
  },

  card: {
    nodeNames: ['DIV', 'ARTICLE'],
    serialize: (block, innerHtml) => {
      const style = stylesObjectToString(block.styles);
      return `<div data-wp-type="card" style="${style}">${innerHtml}</div>`;
    },
    parse: (el) => ({
      type: 'card',
      tag: 'div',
      name: 'بطاقة محتوى',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  badge: {
    nodeNames: ['SPAN'],
    serialize: (block) => {
      const style = stylesObjectToString(block.styles);
      return `<span data-wp-type="badge" style="${style}">${block.content || 'شارة'}</span>`;
    },
    parse: (el) => ({
      type: 'badge',
      tag: 'span',
      name: 'شارة/وسام',
      content: el.textContent?.trim() || 'شارة',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },

  divider: {
    nodeNames: ['HR'],
    serialize: (block) => {
      const style = stylesObjectToString(block.styles);
      return `<hr data-wp-type="divider" style="${style}" />`;
    },
    parse: (el) => ({
      type: 'divider',
      tag: 'hr',
      name: 'خط فاصل',
      styles: styleAttrToBlockStyles(el),
      attributes: extractCleanAttributes(el),
    }),
  },
};

export function serializeBlockToHtml(block: WebBlock): string {
  let innerHtml = block.content || '';
  if (block.children && block.children.length > 0) {
    innerHtml = block.children.map(serializeBlockToHtml).join('\n');
  }

  const parser = HTML_BLOCK_PARSERS[block.type];
  if (parser) {
    return parser.serialize(block, innerHtml);
  }

  const tag = block.tag || 'div';
  const style = stylesObjectToString(block.styles);
  const styleAttr = style ? ` style="${style}"` : '';
  const sizeAttr = block.size ? ` data-wp-size="${block.size}"` : '';
  return `<${tag} data-wp-type="${block.type}"${sizeAttr}${styleAttr}>${innerHtml}</${tag}>`;
}

export function parseHtmlElementToWebBlock(el: Element): WebBlock | null {
  if (['SCRIPT', 'STYLE', 'META', 'LINK'].includes(el.tagName)) {
    return null;
  }

  const typeAttr = el.getAttribute('data-wp-type') as BlockType | null;
  const nodeName = el.tagName.toUpperCase();

  let parserKey: BlockType | undefined;
  if (typeAttr && HTML_BLOCK_PARSERS[typeAttr]) {
    parserKey = typeAttr;
  } else {
    for (const [key, parser] of Object.entries(HTML_BLOCK_PARSERS)) {
      if (parser.nodeNames.includes(nodeName)) {
        parserKey = key as BlockType;
        break;
      }
    }
  }

  const parser = parserKey ? HTML_BLOCK_PARSERS[parserKey] : undefined;
  const parsedTemplate = parser ? parser.parse(el) : null;
  const id = el.getAttribute('data-wp-id') || `block-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  const children: WebBlock[] = [];
  if (el.children.length > 0) {
    Array.from(el.children).forEach((childEl) => {
      const childBlock = parseHtmlElementToWebBlock(childEl);
      if (childBlock) {
        children.push(childBlock);
      }
    });
  }

  if (parsedTemplate) {
    return {
      id,
      ...parsedTemplate,
      children: children.length > 0 ? children : undefined,
    };
  }

  return {
    id,
    type: typeAttr || 'container',
    tag: el.tagName.toLowerCase(),
    name: `عنصر (${el.tagName.toLowerCase()})`,
    content: el.children.length === 0 ? el.textContent?.trim() : undefined,
    styles: styleAttrToBlockStyles(el),
    attributes: extractCleanAttributes(el),
    children: children.length > 0 ? children : undefined,
  };
}
