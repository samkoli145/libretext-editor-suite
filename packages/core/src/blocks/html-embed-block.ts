/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-embed-block.ts
 * 📂 المسار: packages/core/src/blocks/html-embed-block.ts
 * 🎯 الهدف الرئيسي: بلوك HTML مضمّن مع تعقيم إلزامي قبل التخزين والتصدير
 * 📋 المعايير: sanitizeHtml من html-pipeline، حد 200KB، تصدير خام معقّم
 * 🧪 الاختبارات: packages/core/tests/blocks/conversion-blocks.test.ts
 * 🏷️ المعرف: BLK-WRITER-HTML-EMBED
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Sanitize-on-Write — التعقيم عند الإنشاء/التحديث لا عند العرض فقط
 *    (دفاع متعدد الطبقات ضد XSS)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. لا تُخزّن HTML خام أبداً — createHtmlEmbedBlock يعقّم فوراً.
 *    2. السكربتات والأحداث inline تُزال بواسطة sanitizeHtml.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isHtmlEmbedBlock).
 *    - حد أقصى 200,000 حرف + تعقيم مزدوج (تخزين + تصدير).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/ast/types.ts, src/engines/html-pipeline.ts
 *    - 🧪 اختبارات: tests/blocks/conversion-blocks.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createHtmlEmbedBlock: إنشاء كتلة معقّمة (#L76)
 *    - isHtmlEmbedBlock: فاحص النوع (#L92)
 *    - sanitizeEmbedContent: إعادة تعقيم المحتوى (#L99)
 *    - formatHtmlEmbedMarkdown: تصدير خام معقّم (#L106)
 *    - getEmbedTextPreview: معاينة نصية بلا وسوم (#L113)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText html-pipeline (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';
import { sanitizeHtml, stripHtmlTags } from '../engines/html-pipeline';

const MAX_HTML_LENGTH = 200_000;

/** وسوم خطيرة تُزال بمحتواها بالكامل. */
const DANGEROUS_TAGS_WITH_CONTENT =
  /<\s*(script|iframe|object|embed|applet|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;

/** وسوم خطيرة ذاتية الإغلاق أو اليتيمة. */
const DANGEROUS_SELF_CLOSING =
  /<\s*(script|iframe|object|embed|applet|link|meta)\b[^>]*\/?>/gi;

/** معالجات الأحداث inline — on*="..." */
const INLINE_EVENT_HANDLERS = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

/** روابط javascript: الخطيرة. */
const JS_URLS = /(\s(?:href|src|action)\s*=\s*)("|')?\s*javascript:[^"'>\s]*/gi;

/**
 * طبقة دفاع أولى بـ regex — تعمل في Node والمتصفح معاً
 * (sanitizeHtml من html-pipeline يعمل في المتصفح فقط).
 */
function stripDangerousHtml(html: string): string {
  return html
    .replace(DANGEROUS_TAGS_WITH_CONTENT, '')
    .replace(DANGEROUS_SELF_CLOSING, '')
    .replace(INLINE_EVENT_HANDLERS, '')
    .replace(JS_URLS, '$1$2#');
}

/** التعقيم الكامل: regex أولاً ثم DOM عند توفره. */
function deepSanitize(html: string): string {
  return sanitizeHtml(stripDangerousHtml(html));
}

export interface HtmlEmbedBlockData {
  readonly html: string;
  readonly caption?: string;
}

export interface HtmlEmbedBlockNode extends BaseBlockNode<HtmlEmbedBlockData> {
  readonly type: 'html_embed';
  readonly domain: 'writer';
}

export function createHtmlEmbedBlock(
  id: string,
  data?: Partial<HtmlEmbedBlockData>,
): HtmlEmbedBlockNode {
  const raw = (data?.html ?? '').slice(0, MAX_HTML_LENGTH);

  return {
    id,
    type: 'html_embed',
    domain: 'writer',
    traits: ['draggable', 'styleable', 'lockable'] as readonly TraitKey[],
    data: {
      html: deepSanitize(raw),
      caption: data?.caption,
    },
  };
}

export function isHtmlEmbedBlock(node: unknown): node is HtmlEmbedBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as HtmlEmbedBlockNode;
  return b.type === 'html_embed' && b.domain === 'writer';
}

/** إعادة تعقيم المحتوى بعد أي تحديث خارجي. */
export function sanitizeEmbedContent(
  node: HtmlEmbedBlockNode,
): HtmlEmbedBlockNode {
  return { ...node, data: { ...node.data, html: deepSanitize(node.data.html) } };
}

/** تصدير خام معقّم — Markdown يدعم HTML مضمناً. */
export function formatHtmlEmbedMarkdown(node: HtmlEmbedBlockNode): string {
  if (!node.data.html.trim()) return '';
  const caption = node.data.caption ? `*${node.data.caption}*\n\n` : '';
  return `${caption}${deepSanitize(node.data.html)}`;
}

/** معاينة نصية نظيفة بلا وسوم. */
export function getEmbedTextPreview(node: HtmlEmbedBlockNode, maxLen = 120): string {
  const text = stripHtmlTags(node.data.html).replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}
