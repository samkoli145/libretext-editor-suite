/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: blockquote-block.ts
 * 📂 المسار: src/blocks/blockquote-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك الاقتباس والتضمين الأدبي والعلمي لنطاق Writer
 * 📋 المعايير: دعم المرجع والمؤلف، شريط جانبي مع مراعاة اتجاه RTL، وفقرات متعددة
 * 🧪 الاختبارات: التحقق من كود الاقتباس وتوليد صيغ Markdown و HTML
 * 🏷️ المعرف: BLK-WRITER-QUOTE
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Container Block Node + Author Citation Payload + GFM Blockquote Formatter
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. دعم الاقتباسات الفارغة عبر فقرة نصية افتراضية.
 *    2. ضمان تناغم موضع الشريط الجانبي مع اتجاه النص العربي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isBlockquoteBlock).
 *    - التعامل الآمن مع خلو المؤلف أو المصدر.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createBlockquoteBlock: إنشاء كتلة اقتباس (#L50)
 *    - isBlockquoteBlock: فاحص نوع الاقتباس (#L70)
 *    - formatBlockquoteMarkdown: تحويل الاقتباس لـ Markdown (#L77)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يبرز الأفكار والمقولات الهامة داخل المقالات والتقارير.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم أيقونة علامات التنصيص العائمة
 *    - 📖 مرجع تقني: LibreText Block Catalog & Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface BlockquoteData {
  readonly text: string;
  readonly author?: string;
  readonly source?: string;
  readonly borderPosition: 'left' | 'right';
}

export interface BlockquoteBlockNode extends BaseBlockNode<BlockquoteData> {
  readonly type: 'blockquote';
  readonly domain: 'writer';
}

export function createBlockquoteBlock(
  id: string,
  text: string,
  data?: Partial<BlockquoteData>
): BlockquoteBlockNode {
  return {
    id,
    type: 'blockquote',
    domain: 'writer',
    traits: ['styleable', 'draggable'] as readonly TraitKey[],
    data: {
      text: text || 'نص الاقتباس هنا...',
      author: data?.author,
      source: data?.source,
      borderPosition: data?.borderPosition ?? 'right',
    },
  };
}

export function isBlockquoteBlock(node: unknown): node is BlockquoteBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as BlockquoteBlockNode;
  return b.type === 'blockquote' && typeof b.data?.text === 'string';
}

export function formatBlockquoteMarkdown(node: BlockquoteBlockNode): string {
  const lines = node.data.text.split('\n').map((l) => `> ${l}`);
  if (node.data.author) {
    const citation = node.data.source ? ` (${node.data.source})` : '';
    lines.push(`> \n> — *${node.data.author}${citation}*`);
  }
  return lines.join('\n');
}
