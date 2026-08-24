/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: slide-block.ts
 * 📂 المسار: src/blocks/slide-block.ts
 * 🎯 الهدف الرئيسي: تعريف كتلة إطار الشريحة للعروض التقديمية بنطاق Impress
 * 📋 المعايير: دعم التخطيطات القياسية (16:9)، مذكرات العارض، وخلفيات نهارية
 * 🧪 الاختبارات: التحقق من صحة ترقيم الشرائح وعناصر الحاوية
 * 🏷️ المعرف: BLK-IMPRESS-SLIDE
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Slide Container Canvas + Layout Archetype + Presentation Metadata
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بنسبة الأبعاد القياسية 16:9 أو 4:3.
 *    2. ضمان عدم استخدام خلفيات داكنة للشرائح.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isSlideBlock).
 *    - حماية ترقيم الشريحة (slideIndex >= 1).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createSlideBlock: إنشاء كتلة شريحة عرض (#L50)
 *    - isSlideBlock: فاحص نوع الشريحة (#L70)
 *    - formatSlideSummary: توليد ملخص الشريحة (#L77)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - الحاوية الأساسية لتسلسل العروض التقديمية في Impress.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم تأثيرات الانتقال البصرية (Slide Transitions)
 *    - 📖 مرجع تقني: ODF Impress Specification & LibreText Catalog
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export type SlideLayout = 'title_slide' | 'title_and_content' | 'two_columns' | 'blank';

export interface SlideBlockData {
  readonly slideIndex: number;
  readonly title: string;
  readonly subtitle?: string;
  readonly layout: SlideLayout;
  readonly backgroundColor: string;
  readonly presenterNotes?: string;
}

export interface SlideBlockNode extends BaseBlockNode<SlideBlockData> {
  readonly type: 'slide';
  readonly domain: 'impress';
}

export function createSlideBlock(
  id: string,
  slideIndex: number = 1,
  title: string = 'عنوان الشريحة',
  data?: Partial<SlideBlockData>
): SlideBlockNode {
  return {
    id,
    type: 'slide',
    domain: 'impress',
    traits: ['styleable', 'lockable'] as readonly TraitKey[],
    data: {
      slideIndex: Math.max(1, slideIndex),
      title: title || 'شريحة بدون عنوان',
      subtitle: data?.subtitle,
      layout: data?.layout ?? 'title_and_content',
      backgroundColor: data?.backgroundColor ?? '#FFFFFF',
      presenterNotes: data?.presenterNotes,
    },
  };
}

export function isSlideBlock(node: unknown): node is SlideBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as SlideBlockNode;
  return b.type === 'slide' && b.domain === 'impress' && typeof b.data?.slideIndex === 'number';
}

export function formatSlideSummary(node: SlideBlockNode): string {
  const note = node.data.presenterNotes ? ` (ملاحظة: ${node.data.presenterNotes})` : '';
  return `[شريحة ${node.data.slideIndex}] ${node.data.title}${note}`;
}
