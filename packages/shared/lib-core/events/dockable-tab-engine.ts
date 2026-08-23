/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الألواح والتبويبات القابلة للإرساء والتحجيم - Dockable Tab Engine
 * 🏛️ الدور: محرك مشترك - حسابات التحجيم المقيد والإرساء المغناطيسي
 * 📥 المستهلك: WorkbenchPropertiesPanel, DockablePanelContainer
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Docking Hit-Testing: اختبار إرساء مغناطيسي
 *    مع حسابات حدود دقيقة وحماية من التشوه البصري
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحسابات يجب أن تكون دقيقة لمنع التشوه
 *    2. الثيم الفاتح النقي يجب أن يبقى سليماً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الحدود الدنيا والقصوى
 *    - fallback لحدود افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface PanelBounds {
  width: number;
  height?: number;
  isPinned: boolean;
  isVisible: boolean;
  isFloating: boolean;
  floatingPosition?: { x: number; y: number };
}

export interface ResizeConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight?: number;
  maxHeight?: number;
}

export const DEFAULT_SIDEBAR_CONSTRAINTS: ResizeConstraints = {
  minWidth: 200,
  maxWidth: 580,
};

export const DEFAULT_PROPERTIES_CONSTRAINTS: ResizeConstraints = {
  minWidth: 220,
  maxWidth: 620,
};

/**
 * تقييد قيمة العرض أو الارتفاع بين الحد الأدنى والأقصى
 */
export function clampDimension(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * حساب العرض الجديد عند سحب مقبض التحجيم لليمين أو اليسار
 * مع مراعاة اتجاه السحب (RTL أو LTR)
 */
export function calculateResizedWidth(
  startWidth: number,
  deltaX: number,
  direction: 'left' | 'right',
  constraints: ResizeConstraints,
): number {
  // في اللغات من اليمين لليسار RTL، زيادة الإزاحة يميناً أو يساراً تعتمد على موضع اللوحة
  const multiplier = direction === 'left' ? -1 : 1;
  const target = startWidth + deltaX * multiplier;
  return clampDimension(target, constraints.minWidth, constraints.maxWidth);
}

/**
 * فحص ما إذا كانت النقطة الحالية للمؤشر تقع في منطقة إرساء (Dock Zone)
 */
export function checkDockHitZone(
  clientX: number,
  clientY: number,
  windowWidth: number,
  dockEdge: 'left' | 'right' | 'top',
  thresholdPx: number = 40,
): boolean {
  if (dockEdge === 'right') {
    return clientX >= windowWidth - thresholdPx;
  }
  if (dockEdge === 'left') {
    return clientX <= thresholdPx;
  }
  if (dockEdge === 'top') {
    return clientY <= thresholdPx;
  }
  return false;
}
