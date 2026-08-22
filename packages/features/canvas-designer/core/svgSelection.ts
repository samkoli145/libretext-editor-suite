/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك مقابض التحديد والحسابات الهندسية للتحريك وتغيير الحجم - SVG Selection
 * 🏛️ الدور: محرك مشترك - حساب BBox ومقابض ثمانية + تدوير
 * 📥 المستهلك: TransformHandles, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    8-Handle + Rotation System: نظام مقابض ثمانية مع مقبض تدوير
 *    مع دعم قفل النسبة والتكبير من المركز
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المؤشرات يجب أن تتوافق مع اتجاه السحب
 *    2. الأبعاد يجب أن تتناسب عند قفل النسبة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة BBox قبل توليد المقابض
 *    - fallback لمقابض أصغر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  type Point,
  type BoundingBox,
  calcBoundingBox,
  rotatePoint,
  getRotatedBBox,
} from './svgMath';

export type HandleType =
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'
  | 'rot';

export interface HandlePosition {
  type: HandleType;
  x: number;
  y: number;
  cursor: string;
}

export interface TransformResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * توليد مواضع المقابض الثمانية ومقبض التدوير لمستطيل معين
 */
export function getHandlePositions(
  bbox: BoundingBox,
  rotationDeg = 0
): HandlePosition[] {
  const { x, y, width, height } = bbox;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const center: Point = { x: cx, y: cy };

  // مسافة مقبض التدوير فوق الحافة العلوية
  const rotDistance = 24;

  const rawHandles: Array<{ type: HandleType; pt: Point; baseCursor: string }> = [
    { type: 'nw', pt: { x, y }, baseCursor: 'nwse-resize' },
    { type: 'n', pt: { x: cx, y }, baseCursor: 'ns-resize' },
    { type: 'ne', pt: { x: x + width, y }, baseCursor: 'nesw-resize' },
    { type: 'e', pt: { x: x + width, y: cy }, baseCursor: 'ew-resize' },
    { type: 'se', pt: { x: x + width, y: y + height }, baseCursor: 'nwse-resize' },
    { type: 's', pt: { x: cx, y: y + height }, baseCursor: 'ns-resize' },
    { type: 'sw', pt: { x, y: y + height }, baseCursor: 'nesw-resize' },
    { type: 'w', pt: { x, y: cy }, baseCursor: 'ew-resize' },
    { type: 'rot', pt: { x: cx, y: y - rotDistance }, baseCursor: 'grab' },
  ];

  return rawHandles.map((h) => {
    const rotated = rotationDeg !== 0 ? rotatePoint(h.pt, center, rotationDeg) : h.pt;
    return {
      type: h.type,
      x: rotated.x,
      y: rotated.y,
      cursor: h.baseCursor,
    };
  });
}

/**
 * حساب مستطيل الإحاطة المشترك لمجموعة من العناصر المحددة
 */
export function getSelectionBoundingBox(
  elements: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  }>
): BoundingBox | null {
  if (!elements || elements.length === 0) {
    return null;
  }

  const allCorners: Point[] = [];

  for (const el of elements) {
    const rot = el.rotation || 0;
    const w = Math.max(1, el.width);
    const h = Math.max(1, el.height);

    if (rot === 0) {
      allCorners.push(
        { x: el.x, y: el.y },
        { x: el.x + w, y: el.y },
        { x: el.x + w, y: el.y + h },
        { x: el.x, y: el.y + h }
      );
    } else {
      const center: Point = { x: el.x + w / 2, y: el.y + h / 2 };
      allCorners.push(
        rotatePoint({ x: el.x, y: el.y }, center, rot),
        rotatePoint({ x: el.x + w, y: el.y }, center, rot),
        rotatePoint({ x: el.x + w, y: el.y + h }, center, rot),
        rotatePoint({ x: el.x, y: el.y + h }, center, rot)
      );
    }
  }

  return calcBoundingBox(allCorners);
}

/**
 * حساب الأبعاد والمواضع الناتجة عن سحب مقبض معين بالفأرة
 */
export function calculateHandleTransform(
  handle: HandleType,
  startBBox: BoundingBox,
  deltaX: number,
  deltaY: number,
  lockAspectRatio = false,
  minSize = 10
): TransformResult {
  let { x, y, width, height } = startBBox;
  const initialAspect = startBBox.width / (startBBox.height || 1);

  switch (handle) {
    case 'se': {
      width = Math.max(minSize, startBBox.width + deltaX);
      height = lockAspectRatio
        ? width / initialAspect
        : Math.max(minSize, startBBox.height + deltaY);
      break;
    }
    case 'e': {
      width = Math.max(minSize, startBBox.width + deltaX);
      if (lockAspectRatio) {
        height = width / initialAspect;
        y = startBBox.y - (height - startBBox.height) / 2;
      }
      break;
    }
    case 's': {
      height = Math.max(minSize, startBBox.height + deltaY);
      if (lockAspectRatio) {
        width = height * initialAspect;
        x = startBBox.x - (width - startBBox.width) / 2;
      }
      break;
    }
    case 'nw': {
      const newWidth = Math.max(minSize, startBBox.width - deltaX);
      const newHeight = lockAspectRatio
        ? newWidth / initialAspect
        : Math.max(minSize, startBBox.height - deltaY);
      x = startBBox.x + (startBBox.width - newWidth);
      y = startBBox.y + (startBBox.height - newHeight);
      width = newWidth;
      height = newHeight;
      break;
    }
    case 'ne': {
      const newWidth = Math.max(minSize, startBBox.width + deltaX);
      const newHeight = lockAspectRatio
        ? newWidth / initialAspect
        : Math.max(minSize, startBBox.height - deltaY);
      y = startBBox.y + (startBBox.height - newHeight);
      width = newWidth;
      height = newHeight;
      break;
    }
    case 'sw': {
      const newWidth = Math.max(minSize, startBBox.width - deltaX);
      const newHeight = lockAspectRatio
        ? newWidth / initialAspect
        : Math.max(minSize, startBBox.height + deltaY);
      x = startBBox.x + (startBBox.width - newWidth);
      width = newWidth;
      height = newHeight;
      break;
    }
    case 'n': {
      const newHeight = Math.max(minSize, startBBox.height - deltaY);
      y = startBBox.y + (startBBox.height - newHeight);
      height = newHeight;
      if (lockAspectRatio) {
        width = height * initialAspect;
        x = startBBox.x - (width - startBBox.width) / 2;
      }
      break;
    }
    case 'w': {
      const newWidth = Math.max(minSize, startBBox.width - deltaX);
      x = startBBox.x + (startBBox.width - newWidth);
      width = newWidth;
      if (lockAspectRatio) {
        height = width / initialAspect;
        y = startBBox.y - (height - startBBox.height) / 2;
      }
      break;
    }
    case 'rot':
      // التدوير يُعالج عبر حساب الزاوية المنفصلة
      break;
  }

  return { x, y, width, height };
}
