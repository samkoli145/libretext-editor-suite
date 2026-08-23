/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: smart-alignment.ts
 * 📂 المسار: packages/algorithms/src/vector/smart-alignment.ts
 * 🎯 الهدف الرئيسي: نظام المحاذاة الذكي (Smart Alignment / Snapping Guidelines)
 * 📋 المعايير: صفر مكتبات خارجية، كشف المحاذاة الأفقية/الرأسية
 * 🧪 الاختبارات: tests/vector/smart-alignment.test.ts
 * 🏷️ المعرف: ALGO-036
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Smart Alignment Detection: كشف المحاذاة بالبداية/المنتصف/النهاية
 *    مع threshold ديناميكي وإصدار خطوط إرشاد
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Threshold يجب أن يكون مناسباً (8px افتراضي)
 *    2. يجب تجاهل العنصر نفسه
 *    3. أولوية: start > center > end
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RectBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AlignmentGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  matchType: 'start' | 'center' | 'end';
}

export interface AlignmentResult {
  x: number;
  y: number;
  guides: AlignmentGuide[];
}

export class SmartAlignmentSystem {
  private threshold: number;

  constructor(threshold = 8) {
    this.threshold = threshold;
  }

  public calculateAlignment(activeRect: RectBounds, otherRects: RectBounds[]): AlignmentResult {
    let alignedX = activeRect.x;
    let alignedY = activeRect.y;
    const guides: AlignmentGuide[] = [];

    const activeCenterX = activeRect.x + activeRect.width / 2;
    const activeRightX = activeRect.x + activeRect.width;
    const activeCenterY = activeRect.y + activeRect.height / 2;
    const activeBottomY = activeRect.y + activeRect.height;

    for (const other of otherRects) {
      if (other.id === activeRect.id) continue;

      const otherCenterX = other.x + other.width / 2;
      const otherRightX = other.x + other.width;
      const otherCenterY = other.y + other.height / 2;
      const otherBottomY = other.y + other.height;

      if (Math.abs(activeRect.x - other.x) <= this.threshold) {
        alignedX = other.x;
        guides.push({ type: 'vertical', position: other.x, matchType: 'start' });
      } else if (Math.abs(activeCenterX - otherCenterX) <= this.threshold) {
        alignedX = otherCenterX - activeRect.width / 2;
        guides.push({ type: 'vertical', position: otherCenterX, matchType: 'center' });
      } else if (Math.abs(activeRightX - otherRightX) <= this.threshold) {
        alignedX = otherRightX - activeRect.width;
        guides.push({ type: 'vertical', position: otherRightX, matchType: 'end' });
      }

      if (Math.abs(activeRect.y - other.y) <= this.threshold) {
        alignedY = other.y;
        guides.push({ type: 'horizontal', position: other.y, matchType: 'start' });
      } else if (Math.abs(activeCenterY - otherCenterY) <= this.threshold) {
        alignedY = otherCenterY - activeRect.height / 2;
        guides.push({ type: 'horizontal', position: otherCenterY, matchType: 'center' });
      } else if (Math.abs(activeBottomY - otherBottomY) <= this.threshold) {
        alignedY = otherBottomY - activeRect.height;
        guides.push({ type: 'horizontal', position: otherBottomY, matchType: 'end' });
      }
    }

    return { x: alignedX, y: alignedY, guides };
  }

  public setThreshold(t: number): void {
    this.threshold = t;
  }
  public getThreshold(): number {
    return this.threshold;
  }
}

export const defaultSmartAlignment = new SmartAlignmentSystem(8);
