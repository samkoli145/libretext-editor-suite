/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-pipeline.ts
 * 📂 المسار: packages/core/src/engines/html-pipeline.ts
 * 🎯 الهدف الرئيسي: محرك معالجة وتحويل HTML الثنائي الاتجاه
 * 📋 المعايير: صفر مكتبات خارجية، تطهير وسوم الخطرة، تصدير HTML5 دلالي عربي
 * 🧪 الاختبارات: tests/engines/html-pipeline.test.ts
 * 🏷️ المعرف: CORE-ENG-001
 * 📅 تاريخ الإنشاء: 2026-08-21
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

export interface RichTextData {
  content: string;
}

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

  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'applet', 'link', 'meta'];
  dangerousTags.forEach((tag) => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach((el) => el.remove());
  });

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
): {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  data: RichTextData;
} {
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
 * تصدير المستند إلى شفرة HTML5 عربية نقية بمعايير الثيم الفاتح.
 */
export function exportDocumentToCleanHtml(document: {
  title?: string;
  type: string;
  data: unknown;
}): string {
  const title = document.title || 'مستند';
  let bodyContent = '';

  if (document.type === 'rich-text') {
    const data = document.data as { content?: string } | undefined;
    bodyContent = data?.content || '';
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

export function extractHtmlTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? match[1].trim() : '';
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * إزالة كل وسوم HTML الداخلية من نص مع الحفاظ على المحتوى النصي.
 */
export function stripHtmlTags(text: string): string {
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
export function readAttr(attrs: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = attrs.match(
    new RegExp(`\\b${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  if (!match) return '';
  return match[1] ?? match[2] ?? match[3] ?? '';
}
