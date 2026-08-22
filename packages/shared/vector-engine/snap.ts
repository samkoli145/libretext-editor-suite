/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التسنين الذكي والمحاذاة الفيكتورية - Smart Snapping Engine
 * 🏛️ الدور: محرك مشترك - التسنين للشبكة والعناصر وحدود الكانفا
 * 📥 المستهلك: CanvasDesignerEditor, UiDesignerEditor, useSnapAndGuides
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Target Snapping: تسنين متعدد الأهداف (شبكة، عناصر، حدود)
 *    مع أولوية وحدود تلامس
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التسنين يجب أن يكون سريعاً (< 5ms)
 *    2. الشبكة يجب أن تتناسب مع التكبير
 *    3. الحد الأدنى للمسافة (5px)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود عناصر للتسنين
 *    - fallback للشبكة عند عدم وجود عناصر
 *    - حفظ حالة التسنين
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { type Point2D, type BoundingBox, distance } from './common';

export interface SnapTarget {
  type: 'grid' | 'element' | 'canvas' | 'center';
  axis: 'x' | 'y';
  position: number;
  guideStart: number;
  guideEnd: number;
  targetId?: string;
}

export interface SnapResult {
  snappedPoint: Point2D;
  delta: Point2D;
  matchedTargets: SnapTarget[];
}

export interface SnapConfig {
  gridSize?: number;
  snapThreshold?: number;
  snapToGrid?: boolean;
  snapToElements?: boolean;
  snapToCanvas?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * تسنين نقطة مباشرة إلى شبكة الكانفا
 */
export function snapPointToGrid(point: Point2D, gridSize: number = 10): Point2D {
  if (gridSize <= 1) return point;
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}

/**
 * حساب التسنين الذكي الشامل لصندوق محيط بالنسبة لمجموعة من العناصر المحيطة
 */
export function calculateSmartSnap(
  movingBox: BoundingBox,
  referenceBoxes: BoundingBox[],
  config: SnapConfig = {}
): SnapResult {
  const threshold = config.snapThreshold ?? 6;
  const gridSize = config.gridSize ?? 10;
  const snapToGrid = config.snapToGrid ?? false;
  const snapToElements = config.snapToElements ?? true;
  const snapToCanvas = config.snapToCanvas ?? true;

  let deltaX = 0;
  let deltaY = 0;
  let minDiffX = threshold + 1;
  let minDiffY = threshold + 1;
  const matchedTargets: SnapTarget[] = [];

  // 1. التسنين إلى الكانفا إن كان مفعلًا
  if (snapToCanvas && config.canvasWidth && config.canvasHeight) {
    const canvasTargetsX = [0, config.canvasWidth / 2, config.canvasWidth];
    const canvasTargetsY = [0, config.canvasHeight / 2, config.canvasHeight];

    // محور X
    for (const tx of canvasTargetsX) {
      // حافة يسرى
      if (Math.abs(movingBox.minX - tx) < minDiffX) {
        minDiffX = Math.abs(movingBox.minX - tx);
        deltaX = tx - movingBox.minX;
        matchedTargets.push({
          type: 'canvas',
          axis: 'x',
          position: tx,
          guideStart: 0,
          guideEnd: config.canvasHeight,
        });
      }
      // مركز
      if (Math.abs(movingBox.centerX - tx) < minDiffX) {
        minDiffX = Math.abs(movingBox.centerX - tx);
        deltaX = tx - movingBox.centerX;
        matchedTargets.push({
          type: 'center',
          axis: 'x',
          position: tx,
          guideStart: 0,
          guideEnd: config.canvasHeight,
        });
      }
      // حافة يمنى
      if (Math.abs(movingBox.maxX - tx) < minDiffX) {
        minDiffX = Math.abs(movingBox.maxX - tx);
        deltaX = tx - movingBox.maxX;
        matchedTargets.push({
          type: 'canvas',
          axis: 'x',
          position: tx,
          guideStart: 0,
          guideEnd: config.canvasHeight,
        });
      }
    }

    // محور Y
    for (const ty of canvasTargetsY) {
      if (Math.abs(movingBox.minY - ty) < minDiffY) {
        minDiffY = Math.abs(movingBox.minY - ty);
        deltaY = ty - movingBox.minY;
        matchedTargets.push({
          type: 'canvas',
          axis: 'y',
          position: ty,
          guideStart: 0,
          guideEnd: config.canvasWidth,
        });
      }
      if (Math.abs(movingBox.centerY - ty) < minDiffY) {
        minDiffY = Math.abs(movingBox.centerY - ty);
        deltaY = ty - movingBox.centerY;
        matchedTargets.push({
          type: 'center',
          axis: 'y',
          position: ty,
          guideStart: 0,
          guideEnd: config.canvasWidth,
        });
      }
      if (Math.abs(movingBox.maxY - ty) < minDiffY) {
        minDiffY = Math.abs(movingBox.maxY - ty);
        deltaY = ty - movingBox.maxY;
        matchedTargets.push({
          type: 'canvas',
          axis: 'y',
          position: ty,
          guideStart: 0,
          guideEnd: config.canvasWidth,
        });
      }
    }
  }

  // 2. التسنين إلى العناصر المجاورة (Smart Guides)
  if (snapToElements && referenceBoxes.length > 0) {
    for (const ref of referenceBoxes) {
      const movingXPoints = [
        { pos: movingBox.minX, offset: 0 },
        { pos: movingBox.centerX, offset: movingBox.width / 2 },
        { pos: movingBox.maxX, offset: movingBox.width },
      ];
      const refXPoints = [ref.minX, ref.centerX, ref.maxX];

      for (const m of movingXPoints) {
        for (const r of refXPoints) {
          const diff = Math.abs(m.pos - r);
          if (diff < minDiffX && diff <= threshold) {
            minDiffX = diff;
            deltaX = r - m.pos;
            matchedTargets.push({
              type: 'element',
              axis: 'x',
              position: r,
              guideStart: Math.min(movingBox.minY, ref.minY) - 10,
              guideEnd: Math.max(movingBox.maxY, ref.maxY) + 10,
            });
          }
        }
      }

      const movingYPoints = [
        { pos: movingBox.minY, offset: 0 },
        { pos: movingBox.centerY, offset: movingBox.height / 2 },
        { pos: movingBox.maxY, offset: movingBox.height },
      ];
      const refYPoints = [ref.minY, ref.centerY, ref.maxY];

      for (const m of movingYPoints) {
        for (const r of refYPoints) {
          const diff = Math.abs(m.pos - r);
          if (diff < minDiffY && diff <= threshold) {
            minDiffY = diff;
            deltaY = r - m.pos;
            matchedTargets.push({
              type: 'element',
              axis: 'y',
              position: r,
              guideStart: Math.min(movingBox.minX, ref.minX) - 10,
              guideEnd: Math.max(movingBox.maxX, ref.maxX) + 10,
            });
          }
        }
      }
    }
  }

  // 3. تسنين الشبكة عند عدم وجود تسنين مباشر مع العناصر
  if (snapToGrid && minDiffX > threshold) {
    const snappedX = Math.round(movingBox.x / gridSize) * gridSize;
    deltaX = snappedX - movingBox.x;
  }
  if (snapToGrid && minDiffY > threshold) {
    const snappedY = Math.round(movingBox.y / gridSize) * gridSize;
    deltaY = snappedY - movingBox.y;
  }

  return {
    snappedPoint: {
      x: movingBox.x + deltaX,
      y: movingBox.y + deltaY,
    },
    delta: { x: deltaX, y: deltaY },
    matchedTargets,
  };
}
