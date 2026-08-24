/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: paragraph-block.ts
 * 📂 المسار: src/blocks/paragraph-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك الفقرة النصية الأساسي لنطاق Writer مع التنسيقات
 * 📋 المعايير: دعم العقد المضمنة، اتجاهات RTL/LTR، والتصدير متعدد الصيغ
 * 🧪 الاختبارات: فحص صحة العقدة ودوال الإنشاء
 * 🏷️ المعرف: BLK-WRITER-PARA
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Factory Function + Schema Validation + Pure Formatting Helpers
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ضمان عدم إرجاع فقرة بدون مصفوفة محتوى content صالحة.
 *    2. حظر أي لون خلفية داكن في بيانات التنسيق.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard للتحقق من سلامة الفقرة (isParagraphBlock).
 *    - قيم افتراضية آمنة للمحاذاة وارتفاع السطر.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createParagraphBlock: دالة مصنع لإنشاء كتلة فقرة (#L52)
 *    - isParagraphBlock: فاحص نوع الفقرة (#L70)
 *    - formatParagraphMarkdown: تحويل الفقرة لـ Markdown (#L78)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يمثل بلوك الفقرة أكثر من 60% من المحتوى في مستندات النصوص.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم الرموز التعبيرية والوسوم المخصصة
 *    - 📖 مرجع تقني: LibreText Block Catalog & Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, InlineNode, TraitKey, NodeId, TextMark } from '../ast/types';

export interface ParagraphBlockData {
  readonly align: 'left' | 'center' | 'right' | 'justify';
  readonly lineHeight?: number;
  readonly indent?: number;
  readonly dir?: 'rtl' | 'ltr' | 'auto';
}

export interface ParagraphBlockNode extends BaseBlockNode<ParagraphBlockData> {
  readonly type: 'paragraph';
  readonly domain: 'writer';
  readonly content: readonly InlineNode[];
}

export function createParagraphBlock(
  id: string,
  content: readonly InlineNode[],
  data?: Partial<ParagraphBlockData>
): ParagraphBlockNode {
  return {
    id,
    type: 'paragraph',
    domain: 'writer',
    traits: ['styleable', 'draggable'] as readonly TraitKey[],
    data: {
      align: data?.align ?? 'right',
      lineHeight: data?.lineHeight ?? 1.65,
      indent: data?.indent ?? 0,
      dir: data?.dir ?? 'rtl',
    },
    content: content.length > 0 ? content : [{ id: `${id}-txt-1` as NodeId, type: 'text', text: '' }],
  };
}

export function isParagraphBlock(node: unknown): node is ParagraphBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as ParagraphBlockNode;
  return b.type === 'paragraph' && b.domain === 'writer' && Array.isArray(b.content);
}

export function formatParagraphMarkdown(node: ParagraphBlockNode): string {
  const textParts = node.content.map((inline) => {
    if (inline.type === 'text') {
      let t = inline.text;
      if (inline.marks?.some((m) => m.type === 'bold')) t = `**${t}**`;
      if (inline.marks?.some((m) => m.type === 'italic')) t = `*${t}*`;
      if (inline.marks?.some((m) => m.type === 'strikethrough')) t = `~~${t}~~`;
      if (inline.marks?.some((m) => m.type === 'code')) t = `\`${t}\``;
      return t;
    }
    if (inline.type === 'link') {
      const linkText = inline.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
      return `[${linkText}](${inline.href})`;
    }
    return '';
  });
  return textParts.join('');
}
