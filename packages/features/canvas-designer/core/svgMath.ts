/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الحسابات والتحويلات الهندسية والمصفوفات - SVG Math Engine
 * 🏛️ الدور: محرك مشترك - مصفوفات 2D Affine وتدوير نقاط ومحاذاة زوايا
 * 📥 المستهلك: svgSelection, TransformHandles, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Affine Matrix Calculator: حاسبة مصفوفات تحويل 2D
 *    مع Angle Snapping (15°/45°/90°) وال bounding box بعد التحويلات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الدقة يجب أن تكون متناهية (لا أخطاء floating point)
 *    2. التدوير يجب أن يكون حول المركز
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام toFixed لتجنب أخطاء floating point
 *    - fallback لقيمة صفر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * مصفوفة تحويل ثنائية الأبعاد بنظام SVG Affine Matrix
 * | a  c  e |
 * | b  d  f |
 * | 0  0  1 |
 */
export interface Matrix2D {
  a: number; // Scale X
  b: number; // Skew Y
  c: number; // Skew X
  d: number; // Scale Y
  e: number; // Translate X
  f: number; // Translate Y
}

/** مصفوفة الوحدة المحايدة */
export function identityMatrix(): Matrix2D {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}

/** ضرب مصفوفتين ثنائيتي الأبعاد (m1 * m2) */
export function multiplyMatrices(m1: Matrix2D, m2: Matrix2D): Matrix2D {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    e: m1.a * m2.e + m1.c * m2.f + m1.e,
    f: m1.b * m2.e + m1.d * m2.f + m1.f,
  };
}

/** حساب مقلوب المصفوفة (Inverse Matrix) */
export function invertMatrix(m: Matrix2D): Matrix2D | null {
  const det = m.a * m.d - m.b * m.c;
  if (Math.abs(det) < 1e-10) {
    return null; // مصفوفة غير قابلة للعكس
  }
  const invDet = 1 / det;
  return {
    a: m.d * invDet,
    b: -m.b * invDet,
    c: -m.c * invDet,
    d: m.a * invDet,
    e: (m.c * m.f - m.d * m.e) * invDet,
    f: (m.b * m.e - m.a * m.f) * invDet,
  };
}

/** تحويل نقطة عبر مصفوفة تحويل */
export function transformPoint(p: Point, m: Matrix2D): Point {
  return {
    x: m.a * p.x + m.c * p.y + m.e,
    y: m.b * p.x + m.d * p.y + m.f,
  };
}

/** مصفوفة إزاحة */
export function translationMatrix(dx: number, dy: number): Matrix2D {
  return { a: 1, b: 0, c: 0, d: 1, e: dx, f: dy };
}

/** مصفوفة قياس/تحجيم */
export function scalingMatrix(sx: number, sy: number, cx = 0, cy = 0): Matrix2D {
  if (cx === 0 && cy === 0) {
    return { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 };
  }
  const toOrigin = translationMatrix(-cx, -cy);
  const scale = { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 };
  const fromOrigin = translationMatrix(cx, cy);
  return multiplyMatrices(fromOrigin, multiplyMatrices(scale, toOrigin));
}

/** مصفوفة تدوير بالدرجات حول مركز محدد */
export function rotationMatrix(angleDeg: number, cx = 0, cy = 0): Matrix2D {
  const rad = degToRad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  if (cx === 0 && cy === 0) {
    return { a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 };
  }

  const toOrigin = translationMatrix(-cx, -cy);
  const rotate: Matrix2D = { a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 };
  const fromOrigin = translationMatrix(cx, cy);
  return multiplyMatrices(fromOrigin, multiplyMatrices(rotate, toOrigin));
}

/** تحويل الدرجات إلى راديان */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** تحويل الراديان إلى درجات */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** جذب الزاوية لأقرب خطوة (Snapping) مثل 15° أو 45° */
export function snapAngle(angleDeg: number, snapStep = 15, threshold = 4): number {
  const normalized = ((angleDeg % 360) + 360) % 360;
  const closestSnap = Math.round(normalized / snapStep) * snapStep;
  const diff = Math.abs(normalized - closestSnap);
  if (diff <= threshold || Math.abs(diff - 360) <= threshold) {
    return closestSnap % 360;
  }
  return angleDeg;
}

/** تدوير نقطة حول مركز بزاوية محددة بالدرجات */
export function rotatePoint(p: Point, center: Point, angleDeg: number): Point {
  const rad = degToRad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos),
  };
}

/** حساب المسافة الإقليدية بين نقطتين */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** حساب زاوية الخط المار بين نقطتين بالدرجات (0 إلى 360) */
export function angleBetweenPoints(p1: Point, p2: Point): number {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;
  let deg = radToDeg(Math.atan2(dy, dx));
  if (deg < 0) deg += 360;
  return deg;
}

/** حساب مستطيل الإحاطة لمجموعة نقاط */
export function calcBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    const pt = points[i];
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  return {
    x: minX,
    y: minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
}

/** حساب مستطيل الإحاطة الفعلي لعنصر بعد تدويره */
export function getRotatedBBox(
  x: number,
  y: number,
  width: number,
  height: number,
  angleDeg: number
): BoundingBox {
  if (angleDeg % 360 === 0) {
    return { x, y, width, height };
  }
  const center: Point = { x: x + width / 2, y: y + height / 2 };
  const corners: Point[] = [
    rotatePoint({ x, y }, center, angleDeg),
    rotatePoint({ x: x + width, y }, center, angleDeg),
    rotatePoint({ x: x + width, y: y + height }, center, angleDeg),
    rotatePoint({ x, y: y + height }, center, angleDeg),
  ];
  return calcBoundingBox(corners);
}

/** تقييد قيمة رقمية بين حد أدنى وأعلى */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** تقريب رقم لأقرب عدد من الخانات العشرية */
export function roundTo(val: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}
