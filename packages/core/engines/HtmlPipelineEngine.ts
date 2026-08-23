/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك معالجة وتحويل HTML الثنائي الاتجاه - HTML Pipeline Engine
 * 🏛️ الدور: محرك مشترك - تحويل HTML إلى مستندات RichText وعناصر Canvas
 * 📥 المستهلك: UnifiedIngestionPipeline, RichTextEditor, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bi-directional HTML Pipeline: محرك تحويل ثنائي الاتجاه
 *    مع تطهير وسوم الخطرة وتصدير HTML5 دلالي عربي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. scripts و iframes يجب أن تُنظف بالكامل
 *    2. التصدير يجب أن يحترم dir="rtl"
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - صفر مكتبات خارجية (DOMParser, XMLSerializer فقط)
 *    - فحص سلامة شجرة DOM
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocumentModel } from '../types';
import type { RichTextData } from '../../features/rich-text/model';
import type { CanvasElement } from '../../features/canvas-designer/model';

export interface HtmlToRichTextOptions {
  title?: string;
  stripScripts?: boolean;
  stripStyles?: boolean;
}

/**
 * تطهير وتنظيف كود HTML من العناصر الخطرة والمخلفات غير القياسية.
 */
export function sanitizeHtml(html: string, options?: { stripStyles?: boolean }): string {
  if (!html || typeof html !== 'string') return '';
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 1. إزالة العناصر الخطرة
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'applet', 'link', 'meta'];
  dangerousTags.forEach((tag) => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach((el) => el.remove());
  });

  // 2. إزالة معالجات الأحداث المضمنة (onclick, onerror, onload...)
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    const attributes = Array.from(el.attributes);
    for (const attr of attributes) {
      if (
        attr.name.toLowerCase().startsWith('on') ||
        attr.value.toLowerCase().startsWith('javascript:')
      ) {
        el.removeAttribute(attr.name);
      }
      if (options?.stripStyles && attr.name.toLowerCase() === 'style') {
        el.removeAttribute(attr.name);
      }
    }
  });

  return doc.body.innerHTML || '';
}

/**
 * تحويل كود HTML إلى نموذج مستند RichText.
 */
export function htmlToRichTextDocument(
  htmlContent: string,
  options?: HtmlToRichTextOptions,
): DocumentModel<RichTextData> {
  const cleanHtml = sanitizeHtml(htmlContent, { stripStyles: options?.stripStyles });
  const title = options?.title || extractHtmlTitle(htmlContent) || 'مستند HTML مستورد';
  const now = new Date().toISOString();

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'rich-text',
    title,
    createdAt: now,
    updatedAt: now,
    version: 1,
    data: {
      content: cleanHtml || '<p><br></p>',
    },
  };
}

/**
 * تحويل كود HTML إلى كتل وعناصر كانفا تدفقية ورسومية.
 */
export function htmlToCanvasBlocks(htmlContent: string): CanvasElement[] {
  if (!htmlContent) return [];

  // بيئة بلا DOM (اختبارات / خوادم): نستخدم محللًا خفيفًا خالصًا (صفر مكتبات)
  if (typeof DOMParser === 'undefined') {
    return parseHtmlToCanvasBlocksFallback(htmlContent);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const elements: CanvasElement[] = [];

  let currentY = 40;
  const startX = 40;
  const standardWidth = 720;

  const children = Array.from(doc.body.children);
  const processNodes = children.length > 0 ? children : Array.from(doc.body.childNodes);

  processNodes.forEach((node, index) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (!text) return;
      elements.push({
        id: `el-text-${Date.now()}-${index}`,
        type: 'text',
        x: startX,
        y: currentY,
        width: standardWidth,
        height: 36,
        rotation: 0,
        zIndex: index + 1,
        locked: false,
        visible: true,
        text,
        fontSize: 15,
        textColor: '#1e293b',
        textAlign: 'right',
        props: {
          text,
          fontSize: 15,
          color: '#1e293b',
          textAlign: 'right',
        },
      });
      currentY += 46;
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || '';

      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag.charAt(1), 10);
        const fontSize = level === 1 ? 26 : level === 2 ? 22 : level === 3 ? 18 : 16;
        const height = fontSize + 16;

        elements.push({
          id: `el-heading-${Date.now()}-${index}`,
          type: 'text',
          x: startX,
          y: currentY,
          width: standardWidth,
          height,
          rotation: 0,
          zIndex: index + 1,
          locked: false,
          visible: true,
          text,
          fontSize,
          fontWeight: 'bold',
          textColor: '#0f172a',
          textAlign: 'right',
          props: {
            text,
            fontSize,
            fontWeight: 'bold',
            color: '#0f172a',
            textAlign: 'right',
          },
        });
        currentY += height + 12;
      } else if (tag === 'p') {
        const height = Math.max(36, Math.ceil(text.length / 50) * 22);
        elements.push({
          id: `el-para-${Date.now()}-${index}`,
          type: 'text',
          x: startX,
          y: currentY,
          width: standardWidth,
          height,
          rotation: 0,
          zIndex: index + 1,
          locked: false,
          visible: true,
          text,
          fontSize: 14,
          textColor: '#334155',
          textAlign: 'right',
          props: {
            text,
            fontSize: 14,
            lineHeight: 1.6,
            color: '#334155',
            textAlign: 'right',
          },
        });
        currentY += height + 10;
      } else if (tag === 'img') {
        const imgEl = el as HTMLImageElement;
        const src = imgEl.getAttribute('src') || '';
        const alt = imgEl.getAttribute('alt') || 'صورة مستوردة';
        const width = Math.min(parseInt(imgEl.getAttribute('width') || '500', 10), standardWidth);
        const height = parseInt(imgEl.getAttribute('height') || '300', 10);

        elements.push({
          id: `el-img-${Date.now()}-${index}`,
          type: 'image',
          x: startX,
          y: currentY,
          width: width > 0 ? width : 500,
          height: height > 0 ? height : 300,
          rotation: 0,
          zIndex: index + 1,
          locked: false,
          visible: true,
          src,
          alt,
          props: {
            src,
            alt,
          },
        });
        currentY += (height > 0 ? height : 300) + 16;
      } else if (tag === 'hr' || tag === 'divider') {
        elements.push({
          id: `el-line-${Date.now()}-${index}`,
          type: 'line',
          x: startX,
          y: currentY + 10,
          width: standardWidth,
          height: 2,
          rotation: 0,
          zIndex: index + 1,
          locked: false,
          visible: true,
          strokeColor: '#e2e8f0',
          strokeWidth: 2,
          props: {
            strokeColor: '#e2e8f0',
            strokeWidth: 2,
          },
        });
        currentY += 24;
      } else {
        // حاوية أو كتلة عامة
        if (text) {
          elements.push({
            id: `el-block-${Date.now()}-${index}`,
            type: 'text',
            x: startX,
            y: currentY,
            width: standardWidth,
            height: 40,
            rotation: 0,
            zIndex: index + 1,
            locked: false,
            visible: true,
            text,
            fontSize: 14,
            textColor: '#334155',
            props: {
              text,
              fontSize: 14,
              color: '#334155',
            },
          });
          currentY += 50;
        }
      }
    }
  });

  return elements;
}

/**
 * تصدير المستند إلى شفرة HTML5 عربية نقية بمعايير الثيم الفاتح.
 */
export function exportDocumentToCleanHtml(document: DocumentModel): string {
  const title = document.title || 'مستند';
  let bodyContent = '';

  if (document.type === 'rich-text') {
    const data = document.data as { content?: string } | undefined;
    bodyContent = data?.content || '';
  } else if (document.type === 'canvas') {
    const data = document.data as { elements?: CanvasElement[] } | undefined;
    const elements = data?.elements || [];
    bodyContent = `
      <div class="canvas-export-layout" style="position: relative; width: 100%; min-height: 800px;">
        ${elements
          .map((el) => {
            if (el.type === 'text') {
              const text = escapeHtml(el.text || (el.props?.text as string) || '');
              const fontSize = el.fontSize || el.props?.fontSize || 14;
              const color = el.textColor || el.props?.color || '#000000';
              const fontWeight = el.fontWeight || el.props?.fontWeight || 'normal';
              return `<div style="position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; font-size: ${fontSize}px; color: ${color}; font-weight: ${fontWeight};">${text}</div>`;
            }
            if (el.type === 'image') {
              const rawSrc = (el.src || el.props?.src || '') as string;
              const src = rawSrc.trim().toLowerCase().startsWith('javascript:')
                ? ''
                : escapeHtml(rawSrc);
              const alt = escapeHtml((el.alt || el.props?.alt || '') as string);
              return `<img src="${src}" alt="${alt}" style="position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; object-fit: contain;" />`;
            }
            return '';
          })
          .join('\n')}
      </div>
    `;
  } else {
    bodyContent = `<pre>${JSON.stringify(document.data, null, 2)}</pre>`;
  }

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light only; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Arabic", sans-serif;
      margin: 0;
      padding: 40px;
      background-color: #ffffff;
      color: #0f172a;
      line-height: 1.7;
    }
    .document-wrapper {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div class="document-wrapper">
    ${bodyContent}
  </div>
</body>
</html>`;
}

function extractHtmlTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : '';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * محلل HTML خفيف خالص (Regex-based) يعمل بدون DOM — بديل لمسار DOMParser
 * في بيئات الاختبار والخوادم. يفكك العناصر الكتلية: العناوين والفقارات
 * والصور والفواصل والحاويات العامة.
 */
function parseHtmlToCanvasBlocksFallback(htmlContent: string): CanvasElement[] {
  const elements: CanvasElement[] = [];
  let currentY = 40;
  const startX = 40;
  const standardWidth = 720;

  const blockRegex =
    /<(h[1-6])\b([^>]*)>([\s\S]*?)<\/h[1-6]>|<p\b([^>]*)>([\s\S]*?)<\/p>|<img\b([^>]*?)\/?>|<hr\b([^>]*?)\/?>|<(div|section|article|main|header|footer)\b([^>]*)>([\s\S]*?)<\/\8>/gi;

  for (const match of htmlContent.matchAll(blockRegex)) {
    const [, hTag, , hInner, , pInner, imgAttrs, hrAttrs, blockTag, , blockInner] = match;
    const index = elements.length;

    if (hTag) {
      const level = parseInt(hTag.charAt(1), 10);
      const fontSize = level === 1 ? 26 : level === 2 ? 22 : level === 3 ? 18 : 16;
      const text = stripHtmlTags(hInner).trim();

      elements.push({
        id: `el-heading-${Date.now()}-${index}`,
        type: 'text',
        x: startX,
        y: currentY,
        width: standardWidth,
        height: fontSize + 16,
        rotation: 0,
        zIndex: index + 1,
        locked: false,
        visible: true,
        text,
        fontSize,
        fontWeight: 'bold',
        textColor: '#0f172a',
        textAlign: 'right',
        props: {
          text,
          fontSize,
          fontWeight: 'bold',
          color: '#0f172a',
          textAlign: 'right',
        },
      });
      currentY += fontSize + 28;
    } else if (pInner !== undefined) {
      const text = stripHtmlTags(pInner).trim();
      const height = Math.max(36, Math.ceil(text.length / 50) * 22);

      elements.push({
        id: `el-para-${Date.now()}-${index}`,
        type: 'text',
        x: startX,
        y: currentY,
        width: standardWidth,
        height,
        rotation: 0,
        zIndex: index + 1,
        locked: false,
        visible: true,
        text,
        fontSize: 14,
        textColor: '#334155',
        textAlign: 'right',
        props: {
          text,
          fontSize: 14,
          lineHeight: 1.6,
          color: '#334155',
          textAlign: 'right',
        },
      });
      currentY += height + 10;
    } else if (imgAttrs !== undefined) {
      const src = readAttr(imgAttrs, 'src') || '';
      const alt = readAttr(imgAttrs, 'alt') || 'صورة مستوردة';
      const width = Math.min(parseInt(readAttr(imgAttrs, 'width') || '500', 10), standardWidth);
      const height = parseInt(readAttr(imgAttrs, 'height') || '300', 10);

      elements.push({
        id: `el-img-${Date.now()}-${index}`,
        type: 'image',
        x: startX,
        y: currentY,
        width: width > 0 ? width : 500,
        height: height > 0 ? height : 300,
        rotation: 0,
        zIndex: index + 1,
        locked: false,
        visible: true,
        src,
        alt,
        props: {
          src,
          alt,
        },
      });
      currentY += (height > 0 ? height : 300) + 16;
    } else if (hrAttrs !== undefined) {
      elements.push({
        id: `el-line-${Date.now()}-${index}`,
        type: 'line',
        x: startX,
        y: currentY + 10,
        width: standardWidth,
        height: 2,
        rotation: 0,
        zIndex: index + 1,
        locked: false,
        visible: true,
        strokeColor: '#e2e8f0',
        strokeWidth: 2,
        props: {
          strokeColor: '#e2e8f0',
          strokeWidth: 2,
        },
      });
      currentY += 24;
    } else if (blockTag) {
      const text = stripHtmlTags(blockInner).trim();
      if (!text) continue;

      elements.push({
        id: `el-block-${Date.now()}-${index}`,
        type: 'text',
        x: startX,
        y: currentY,
        width: standardWidth,
        height: 40,
        rotation: 0,
        zIndex: index + 1,
        locked: false,
        visible: true,
        text,
        fontSize: 14,
        textColor: '#334155',
        props: {
          text,
          fontSize: 14,
          color: '#334155',
        },
      });
      currentY += 50;
    }
  }

  return elements;
}

/**
 * إزالة كل وسوم HTML الداخلية من نص مع الحفاظ على المحتوى النصي.
 */
function stripHtmlTags(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

/**
 * قراءة قيمة سمة من سلسلة وسوم HTML.
 */
function readAttr(attrs: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = attrs.match(
    new RegExp(`\\b${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  if (!match) return '';
  return match[1] ?? match[2] ?? match[3] ?? '';
}
