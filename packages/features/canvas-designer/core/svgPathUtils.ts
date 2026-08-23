/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أدوات توليد وتحويل مسارات SVG الهندسية والأشكال التفاعلية - SVG Path Utils
 * 🏛️ الدور: محرك مشترك - توليد مسارات d-attribute للأشكال الأساسية والمتقدمة
 * 📥 المستهلك: CanvasDesignerEditor, ElementRenderer
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Path Generator: مولد مسارات SVG فيكتورية نقية
 *    لمستطيلات مدورة ودوائر ونجوم وسهم ومنحنيات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المسارات يجب أن تكون صالحة لـ SVG
 *    2. النقاط يجب أن تكون صحيحة رياضياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الإحداثيات
 *    - fallback لمسار مستطيل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Point } from './svgMath';

/**
 * توليد مسار مستطيل بحواف دائرية اختيارية
 */
export function createRectanglePath(
  x: number,
  y: number,
  w: number,
  h: number,
  rx = 0,
  ry = 0,
): string {
  if (rx <= 0 && ry <= 0) {
    return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
  }
  const radX = Math.min(rx, w / 2);
  const radY = Math.min(ry || rx, h / 2);

  return [
    `M ${x + radX} ${y}`,
    `H ${x + w - radX}`,
    `A ${radX} ${radY} 0 0 1 ${x + w} ${y + radY}`,
    `V ${y + h - radY}`,
    `A ${radX} ${radY} 0 0 1 ${x + w - radX} ${y + h}`,
    `H ${x + radX}`,
    `A ${radX} ${radY} 0 0 1 ${x} ${y + h - radY}`,
    `V ${y + radY}`,
    `A ${radX} ${radY} 0 0 1 ${x + radX} ${y}`,
    'Z',
  ].join(' ');
}

/**
 * توليد مسار دائرة
 */
export function createCirclePath(cx: number, cy: number, r: number): string {
  return [
    `M ${cx - r} ${cy}`,
    `A ${r} ${r} 0 1 0 ${cx + r} ${cy}`,
    `A ${r} ${r} 0 1 0 ${cx - r} ${cy}`,
    'Z',
  ].join(' ');
}

/**
 * توليد مسار قطع ناقص (Ellipse)
 */
export function createEllipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return [
    `M ${cx - rx} ${cy}`,
    `A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`,
    `A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`,
    'Z',
  ].join(' ');
}

/**
 * توليد مسار مضلع منتظم من مجموعة نقاط
 */
export function createPolygonPath(points: Point[]): string {
  if (!points || points.length === 0) return '';
  const first = points[0];
  const rest = points.slice(1);
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(' ') + ' Z';
}

/**
 * توليد مسار نجمة متعددة الرؤوس
 */
export function createStarPath(
  cx: number,
  cy: number,
  numPoints = 5,
  outerRadius = 50,
  innerRadius = 25,
): string {
  const points: Point[] = [];
  const step = Math.PI / numPoints;

  for (let i = 0; i < 2 * numPoints; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }

  return createPolygonPath(points);
}

/**
 * توليد مسار سهم متجه برأس مدبب
 */
export function createArrowPath(from: Point, to: Point, headSize = 14): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  const headAngle = Math.PI / 6; // 30 درجة

  const headLeft: Point = {
    x: to.x - headSize * Math.cos(angle - headAngle),
    y: to.y - headSize * Math.sin(angle - headAngle),
  };

  const headRight: Point = {
    x: to.x - headSize * Math.cos(angle + headAngle),
    y: to.y - headSize * Math.sin(angle + headAngle),
  };

  return `M ${from.x} ${from.y} L ${to.x} ${to.y} M ${headLeft.x} ${headLeft.y} L ${to.x} ${to.y} L ${headRight.x} ${headRight.y}`;
}

/**
 * توليد مسار منحنى انسيابي (Smooth Bezier) يمر بنقاط متعددة
 */
export function createSmoothCurvePath(points: Point[]): string {
  if (!points || points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${Math.round(cp1x)} ${Math.round(cp1y)}, ${Math.round(cp2x)} ${Math.round(cp2y)}, ${p2.x} ${p2.y}`;
  }

  return d;
}
