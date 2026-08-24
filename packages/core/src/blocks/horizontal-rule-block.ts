/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: horizontal-rule-block.ts
 * 📂 المسار: src/blocks/horizontal-rule-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك الخط الفاصل الأفقي (Divider) لنطاق Writer
 * 📋 المعايير: دعم أنماط متعددة (متصل، منقط، متقطع) وسماكات مختلفة
 * 🧪 الاختبارات: التحقق من توليد كود Markdown الفاصل والفحص النوعي
 * 🏷️ المعرف: BLK-WRITER-HR
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Lightweight Layout Divider + Pure Visual Style Token
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم استخدام ألوان حدود داكنة.
 *    2. ضمان بقاء السماكة ضمن النطاق الطبيعي (1-6px).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isHorizontalRuleBlock).
 *    - حماية السماكة عبر Math.max و Math.min.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createHorizontalRuleBlock: إنشاء كتلة الخط الفاصل (#L48)
 *    - isHorizontalRuleBlock: فاحص نوع الخط الفاصل (#L65)
 *    - formatHorizontalRuleMarkdown: تحويل الخط الفاصل لـ Markdown (#L72)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - عنصر بصري للفصل بين أقسام المستند أو المقال.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم أيقونات زخرفية في منتصف الخط الفاصل
 *    - 📖 مرجع تقني: LibreText Block Catalog & Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export type HrStyle = 'solid' | 'dashed' | 'dotted' | 'double';

export interface HorizontalRuleData {
  readonly style: HrStyle;
  readonly thickness: number;
  readonly colorVariant: 'subtle' | 'muted' | 'accent';
}

export interface HorizontalRuleBlockNode extends BaseBlockNode<HorizontalRuleData> {
  readonly type: 'horizontal_rule';
  readonly domain: 'writer';
}

export function createHorizontalRuleBlock(
  id: string,
  data?: Partial<HorizontalRuleData>
): HorizontalRuleBlockNode {
  const rawThickness = data?.thickness ?? 1;
  const thickness = Math.min(6, Math.max(1, rawThickness));

  return {
    id,
    type: 'horizontal_rule',
    domain: 'writer',
    traits: ['draggable', 'styleable'] as readonly TraitKey[],
    data: {
      style: data?.style ?? 'solid',
      thickness,
      colorVariant: data?.colorVariant ?? 'subtle',
    },
  };
}

export function isHorizontalRuleBlock(node: unknown): node is HorizontalRuleBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as HorizontalRuleBlockNode;
  return b.type === 'horizontal_rule' && b.domain === 'writer';
}

export function formatHorizontalRuleMarkdown(_node: HorizontalRuleBlockNode): string {
  return '---';
}
