/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الخطوط الإرشادية الذكية والجاذبية المغناطيسية - Smart Snapping Guides
 * 🏛️ الدور: محرك مشترك - حساب المحاذاة والجاذبية وتوليد الخطوط الإرشادية
 * 📥 المستهلك: CanvasDesignerEditor (handleMouseMove), useCanvasDragResize
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Magnetic Snap Engine: محرك جاذبية مغناطيسية مع مسافة سماحية قابلة للضبط
 *    وخطوط إرشادية فاتحة اللون ومسافات تساوي بين العناصر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحسابات يجب أن تكون سريعة (requestAnimationFrame)
 *    2. الخطوط يجب أن تختفي عند الإفلات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدد العناصر قبل الحساب
 *    - fallback لعدم وجود خطوط
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CanvasElement } from '../model';

export interface GuideLine {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number; // Y للخط الأفقي، X للخط العمودي
  start: number; // نقطة البداية للمحور الآخر
  end: number; // نقطة النهاية للمحور الآخر
  targetElementIds: string[];
}

export interface SnapResult {
  x: number;
  y: number;
  guides: GuideLine[];
  snappedX: boolean;
  snappedY: boolean;
}

export interface ElementBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

/**
 * حساب الصندوق المحيط لعنصر الكانفا
 */
export function getElementBox(el: CanvasElement): ElementBounds {
  const left = el.x;
  const top = el.y;
  const width = el.width;
  const height = el.height;
  const right = left + width;
  const bottom = top + height;
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  return { left, right, top, bottom, centerX, centerY, width, height };
}

/**
 * حساب الجاذبية المغناطيسية والخطوط الإرشادية أثناء سحب عنصر
 */
export function calculateSnapAndGuides(
  draggingElementId: string,
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  allElements: CanvasElement[],
  tolerance: number = 6,
): SnapResult {
  let finalX = targetX;
  let finalY = targetY;
  let snappedX = false;
  let snappedY = false;
  const guides: GuideLine[] = [];

  const dragBox: ElementBounds = {
    left: targetX,
    right: targetX + width,
    top: targetY,
    bottom: targetY + height,
    centerX: targetX + width / 2,
    centerY: targetY + height / 2,
    width,
    height,
  };

  const otherElements = allElements.filter((el) => el.id !== draggingElementId);

  // 1. فحص المحاذاة العمودية (X Alignment)
  for (const other of otherElements) {
    const ob = getElementBox(other);
    const yStart = Math.min(dragBox.top, ob.top) - 10;
    const yEnd = Math.max(dragBox.bottom, ob.bottom) + 10;

    // يسار مع يسار
    if (Math.abs(dragBox.left - ob.left) <= tolerance && !snappedX) {
      finalX = ob.left;
      snappedX = true;
      guides.push({
        id: `v-left-${other.id}`,
        type: 'vertical',
        position: ob.left,
        start: yStart,
        end: yEnd,
        targetElementIds: [other.id],
      });
    }
    // مركز مع مركز
    else if (Math.abs(dragBox.centerX - ob.centerX) <= tolerance && !snappedX) {
      finalX = ob.centerX - width / 2;
      snappedX = true;
      guides.push({
        id: `v-center-${other.id}`,
        type: 'vertical',
        position: ob.centerX,
        start: yStart,
        end: yEnd,
        targetElementIds: [other.id],
      });
    }
    // يمين مع يمين
    else if (Math.abs(dragBox.right - ob.right) <= tolerance && !snappedX) {
      finalX = ob.right - width;
      snappedX = true;
      guides.push({
        id: `v-right-${other.id}`,
        type: 'vertical',
        position: ob.right,
        start: yStart,
        end: yEnd,
        targetElementIds: [other.id],
      });
    }
    // يسار مع يمين
    else if (Math.abs(dragBox.left - ob.right) <= tolerance && !snappedX) {
      finalX = ob.right;
      snappedX = true;
      guides.push({
        id: `v-leftright-${other.id}`,
        type: 'vertical',
        position: ob.right,
        start: yStart,
        end: yEnd,
        targetElementIds: [other.id],
      });
    }
    // يمين مع يسار
    else if (Math.abs(dragBox.right - ob.left) <= tolerance && !snappedX) {
      finalX = ob.left - width;
      snappedX = true;
      guides.push({
        id: `v-rightleft-${other.id}`,
        type: 'vertical',
        position: ob.left,
        start: yStart,
        end: yEnd,
        targetElementIds: [other.id],
      });
    }
  }

  // 2. فحص المحاذاة الأفقية (Y Alignment)
  for (const other of otherElements) {
    const ob = getElementBox(other);
    const xStart = Math.min(dragBox.left, ob.left) - 10;
    const xEnd = Math.max(dragBox.right, ob.right) + 10;

    // أعلى مع أعلى
    if (Math.abs(dragBox.top - ob.top) <= tolerance && !snappedY) {
      finalY = ob.top;
      snappedY = true;
      guides.push({
        id: `h-top-${other.id}`,
        type: 'horizontal',
        position: ob.top,
        start: xStart,
        end: xEnd,
        targetElementIds: [other.id],
      });
    }
    // مركز مع مركز
    else if (Math.abs(dragBox.centerY - ob.centerY) <= tolerance && !snappedY) {
      finalY = ob.centerY - height / 2;
      snappedY = true;
      guides.push({
        id: `h-center-${other.id}`,
        type: 'horizontal',
        position: ob.centerY,
        start: xStart,
        end: xEnd,
        targetElementIds: [other.id],
      });
    }
    // أسفل مع أسفل
    else if (Math.abs(dragBox.bottom - ob.bottom) <= tolerance && !snappedY) {
      finalY = ob.bottom - height;
      snappedY = true;
      guides.push({
        id: `h-bottom-${other.id}`,
        type: 'horizontal',
        position: ob.bottom,
        start: xStart,
        end: xEnd,
        targetElementIds: [other.id],
      });
    }
    // أعلى مع أسفل
    else if (Math.abs(dragBox.top - ob.bottom) <= tolerance && !snappedY) {
      finalY = ob.bottom;
      snappedY = true;
      guides.push({
        id: `h-topbottom-${other.id}`,
        type: 'horizontal',
        position: ob.bottom,
        start: xStart,
        end: xEnd,
        targetElementIds: [other.id],
      });
    }
    // أسفل مع أعلى
    else if (Math.abs(dragBox.bottom - ob.top) <= tolerance && !snappedY) {
      finalY = ob.top - height;
      snappedY = true;
      guides.push({
        id: `h-bottomtop-${other.id}`,
        type: 'horizontal',
        position: ob.top,
        start: xStart,
        end: xEnd,
        targetElementIds: [other.id],
      });
    }
  }

  return {
    x: Math.round(finalX),
    y: Math.round(finalY),
    guides,
    snappedX,
    snappedY,
  };
}

export interface ResizeSnapResult {
  x: number;
  y: number;
  width: number;
  height: number;
  guides: GuideLine[];
}

/**
 * حساب الجاذبية المغناطيسية والخطوط الإرشادية أثناء تحجيم عنصر من أي مقبض
 */
export function calculateResizeSnapAndGuides(
  resizingElementId: string,
  handle: string,
  targetX: number,
  targetY: number,
  targetWidth: number,
  targetHeight: number,
  allElements: CanvasElement[],
  tolerance: number = 6,
): ResizeSnapResult {
  let finalX = targetX;
  let finalY = targetY;
  let finalWidth = Math.max(10, targetWidth);
  let finalHeight = Math.max(10, targetHeight);
  const guides: GuideLine[] = [];

  const otherElements = allElements.filter((el) => el.id !== resizingElementId);

  // فحص المقابض الأفقية (e, w, ne, nw, se, sw)
  if (handle.includes('e')) {
    const rightEdge = targetX + finalWidth;
    for (const other of otherElements) {
      const ob = getElementBox(other);
      if (Math.abs(rightEdge - ob.left) <= tolerance) {
        finalWidth = Math.max(10, ob.left - targetX);
        guides.push({
          id: `resize-v-right-left-${other.id}`,
          type: 'vertical',
          position: ob.left,
          start: Math.min(targetY, ob.top) - 10,
          end: Math.max(targetY + finalHeight, ob.bottom) + 10,
          targetElementIds: [other.id],
        });
        break;
      } else if (Math.abs(rightEdge - ob.right) <= tolerance) {
        finalWidth = Math.max(10, ob.right - targetX);
        guides.push({
          id: `resize-v-right-right-${other.id}`,
          type: 'vertical',
          position: ob.right,
          start: Math.min(targetY, ob.top) - 10,
          end: Math.max(targetY + finalHeight, ob.bottom) + 10,
          targetElementIds: [other.id],
        });
        break;
      }
    }
  } else if (handle.includes('w')) {
    const leftEdge = targetX;
    for (const other of otherElements) {
      const ob = getElementBox(other);
      if (Math.abs(leftEdge - ob.left) <= tolerance) {
        const diff = ob.left - targetX;
        finalX = ob.left;
        finalWidth = Math.max(10, targetWidth - diff);
        guides.push({
          id: `resize-v-left-left-${other.id}`,
          type: 'vertical',
          position: ob.left,
          start: Math.min(targetY, ob.top) - 10,
          end: Math.max(targetY + finalHeight, ob.bottom) + 10,
          targetElementIds: [other.id],
        });
        break;
      } else if (Math.abs(leftEdge - ob.right) <= tolerance) {
        const diff = ob.right - targetX;
        finalX = ob.right;
        finalWidth = Math.max(10, targetWidth - diff);
        guides.push({
          id: `resize-v-left-right-${other.id}`,
          type: 'vertical',
          position: ob.right,
          start: Math.min(targetY, ob.top) - 10,
          end: Math.max(targetY + finalHeight, ob.bottom) + 10,
          targetElementIds: [other.id],
        });
        break;
      }
    }
  }

  // فحص المقابض الرأسية (s, n, se, sw, ne, nw)
  if (handle.includes('s')) {
    const bottomEdge = targetY + finalHeight;
    for (const other of otherElements) {
      const ob = getElementBox(other);
      if (Math.abs(bottomEdge - ob.top) <= tolerance) {
        finalHeight = Math.max(10, ob.top - targetY);
        guides.push({
          id: `resize-h-bottom-top-${other.id}`,
          type: 'horizontal',
          position: ob.top,
          start: Math.min(targetX, ob.left) - 10,
          end: Math.max(targetX + finalWidth, ob.right) + 10,
          targetElementIds: [other.id],
        });
        break;
      } else if (Math.abs(bottomEdge - ob.bottom) <= tolerance) {
        finalHeight = Math.max(10, ob.bottom - targetY);
        guides.push({
          id: `resize-h-bottom-bottom-${other.id}`,
          type: 'horizontal',
          position: ob.bottom,
          start: Math.min(targetX, ob.left) - 10,
          end: Math.max(targetX + finalWidth, ob.right) + 10,
          targetElementIds: [other.id],
        });
        break;
      }
    }
  } else if (handle.includes('n')) {
    const topEdge = targetY;
    for (const other of otherElements) {
      const ob = getElementBox(other);
      if (Math.abs(topEdge - ob.top) <= tolerance) {
        const diff = ob.top - targetY;
        finalY = ob.top;
        finalHeight = Math.max(10, targetHeight - diff);
        guides.push({
          id: `resize-h-top-top-${other.id}`,
          type: 'horizontal',
          position: ob.top,
          start: Math.min(targetX, ob.left) - 10,
          end: Math.max(targetX + finalWidth, ob.right) + 10,
          targetElementIds: [other.id],
        });
        break;
      } else if (Math.abs(topEdge - ob.bottom) <= tolerance) {
        const diff = ob.bottom - targetY;
        finalY = ob.bottom;
        finalHeight = Math.max(10, targetHeight - diff);
        guides.push({
          id: `resize-h-top-bottom-${other.id}`,
          type: 'horizontal',
          position: ob.bottom,
          start: Math.min(targetX, ob.left) - 10,
          end: Math.max(targetX + finalWidth, ob.right) + 10,
          targetElementIds: [other.id],
        });
        break;
      }
    }
  }

  return {
    x: Math.round(finalX),
    y: Math.round(finalY),
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
    guides,
  };
}
