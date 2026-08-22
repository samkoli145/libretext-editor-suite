/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الصناديق المحيطة والمصفوفات الهندسية - Bounding Box Engine
 * 🏛️ الدور: محرك مشترك - دمج الصناديق وفحص التقاطع واحتواء النقاط
 * 📥 المستهلك: SelectionManager, snap-align-engine, drag-selection-engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bounding Box Operations: عمليات الصناديق المحيطة
 *    مع Union وIntersection وPoint-in-Bounds
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحسابات يجب أن تكون دقيقة لكل العناصر
 *    2. الفراغات يجب أن تُحسب بشكل صحيح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الأبعاد قبل الحساب
 *    - fallback لحدود فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * دالة فحص احتواء الصندوق لنقطة معينة (Point in Rect)
 */
export function isPointInsideBounds(bounds: RectBounds, x: number, y: number): boolean {
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
}

/**
 * دالة فحص تقاطع صندوقين محيطين (AABB Overlap / Intersection Test)
 */
export function areBoundsIntersecting(a: RectBounds, b: RectBounds): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

/**
 * دالة حساب الصندوق المحيط المجمع لمجموعة عناصر (Union of Multiple Bounding Boxes)
 */
export function calculateUnionBounds(boxes: RectBounds[]): RectBounds | null {
  if (!boxes || boxes.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const box of boxes) {
    if (box.width < 0 || box.height < 0) continue;
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  }

  if (minX === Infinity) {
    return null;
  }

  return {
    x: minX,
    y: minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
}

/**
 * تسوية أبعاد الصندوق في حال كانت القيم سالبة عند السحب المعكوس
 */
export function normalizeBounds(x1: number, y1: number, x2: number, y2: number): RectBounds {
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const maxX = Math.max(x1, x2);
  const maxY = Math.max(y1, y2);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
