/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحرير وتنعيم مسارات النقاط ومنحنيات بيزييه - SVG Path Editor
 * 🏛️ الدور: محرك مشترك - تنعيم المسارات وتبسيطها وتحليلها
 * 📥 المستهلك: CanvasDesignerEditor (freehand), svgExporter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Path Smoothing + Ramer-Douglas-Peucker: خوارزميتا تنعيم وتبسيط المسارات
 *    مع تحويل مسارات SVG إلى نقاط تحكم قابلة للسحب
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التبسيط الزائد قد يُتلف الشكل
 *    2. الأطوال والمحيطات يجب حسابها بدقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المسار قبل التنعيم
 *    - fallback لمسار الأصلي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface PathSegment {
  type: 'M' | 'L' | 'Q' | 'C' | 'Z';
  points: Point2D[];
}

/**
 * حساب المسافة العمودية بين نقطة وخط مستقيم
 */
function perpendicularDistance(point: Point2D, lineStart: Point2D, lineEnd: Point2D): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const mag = Math.hypot(dx, dy);
  if (mag === 0) {
    return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
  }
  return Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / mag;
}

/**
 * خوارزمية Ramer-Douglas-Peucker لتبسيط مسارات النقاط
 */
export function simplifyPoints(points: Point2D[], tolerance: number = 2): Point2D[] {
  if (points.length <= 2) return points;

  let maxDistance = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(points[i], points[0], points[end]);
    if (d > maxDistance) {
      maxDistance = d;
      index = i;
    }
  }

  if (maxDistance > tolerance) {
    const left = simplifyPoints(points.slice(0, index + 1), tolerance);
    const right = simplifyPoints(points.slice(index), tolerance);
    return left.slice(0, left.length - 1).concat(right);
  }

  return [points[0], points[end]];
}

/**
 * توليد مسار SVG ناعم (Smooth Quadratic Bezier Curve) من مصفوفة نقاط
 */
export function pointsToSmoothSvgPath(points: Point2D[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    d += ` Q ${p1.x} ${p1.y}, ${midX} ${midY}`;
  }

  const lastPoint = points[points.length - 1];
  d += ` L ${lastPoint.x} ${lastPoint.y}`;

  return d;
}

/**
 * حساب الصندوق المحيط (Bounding Box) لمجموعة نقاط
 */
export function calculatePointsBounds(points: Point2D[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (!points || points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}
