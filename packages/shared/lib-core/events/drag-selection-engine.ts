/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التحديد بالسحب والمستطيل المطاطي - Marquee Drag Selection
 * 🏛️ الدور: محرك مشترك - تحديد العناصر المتعددة بالكانفا ومصمم الواجهات
 * 📥 المستهلك: useMultiSelection, CanvasDesignerEditor, UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Marquee Selection Algorithm: خوارزمية تحديد بالمستطيل المطاطي
 *    بصفر مكتبات خارجية مع فحص التقاطع
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المستطيل يجب أن يتعامل مع الأبعاد السالبة
 *    2. التحديد يجب أن يكون فورياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - normalizeBounds قبل فحص التقاطع
 *    - fallback لعدم تحديد أي عنصر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { areBoundsIntersecting, normalizeBounds, type RectBounds } from '../geometry/bounding-box';

export interface SelectableElement {
  id: string;
  bounds: RectBounds;
  locked?: boolean;
}

export interface MarqueeSelectionState {
  isActive: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/**
 * حساب العناصر المحددة داخل مستطيل السحب الماركيه (Marquee Hit Test)
 */
export function getElementsInMarquee(
  marquee: { startX: number; startY: number; currentX: number; currentY: number },
  elements: SelectableElement[],
): string[] {
  const selectionBox = normalizeBounds(
    marquee.startX,
    marquee.startY,
    marquee.currentX,
    marquee.currentY,
  );

  // إذا كان المستطيل صغيراً جداً (مجرد نقرة)، لا نحدد بالماركيه
  if (selectionBox.width < 3 && selectionBox.height < 3) {
    return [];
  }

  const selectedIds: string[] = [];

  for (const el of elements) {
    if (el.locked) continue;
    if (areBoundsIntersecting(selectionBox, el.bounds)) {
      selectedIds.push(el.id);
    }
  }

  return selectedIds;
}
