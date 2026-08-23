/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك عمليات العناصر والمحاذاة والتوزيع والترتيب الرأسي - Element Operations
 * 🏛️ الدور: محرك مشترك - المحاذاة والتوزيع وترتيب الطبقات والقلب الهندسي
 * 📥 المستهلك: CanvasDesignerEditor, InfiniteLayerTree, ContextMenu
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure Operations Engine: محرك عمليات نقية للمحاذاة والتوزيع
 *    مع دعم القلب الهندسي وترتيب الطبقات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المحاذاة تتطلب عنصرين على الأقل
 *    2. ترتيب الطبقات يجب أن يحافظ على z-index
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدد العناصر قبل المحاذاة
 *    - fallback لعدم وجود تغيير
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface AlignableElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
}

export type AlignmentType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

export type DistributionType = 'horizontal' | 'vertical';

export type LayerOrderAction =
  'bring-to-front' | 'send-to-back' | 'bring-forward' | 'send-backward';

/**
 * محاذاة العناصر المحددة بالنسبة لمستطيل الإحاطة المشترك أو لأول عنصر
 */
export function alignElements<T extends AlignableElement>(
  elements: T[],
  selectedIds: string[],
  type: AlignmentType,
): T[] {
  if (!elements || elements.length === 0 || selectedIds.length < 2) {
    return elements;
  }

  const selectedSet = new Set(selectedIds);
  const selectedElements = elements.filter((el) => selectedSet.has(el.id));

  if (selectedElements.length < 2) return elements;

  // حساب حدود العناصر المحددة
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const el of selectedElements) {
    minX = Math.min(minX, el.x);
    maxX = Math.max(maxX, el.x + el.width);
    minY = Math.min(minY, el.y);
    maxY = Math.max(maxY, el.y + el.height);
  }

  const boundsCenterX = minX + (maxX - minX) / 2;
  const boundsCenterY = minY + (maxY - minY) / 2;

  return elements.map((el) => {
    if (!selectedSet.has(el.id)) return el;

    let newX = el.x;
    let newY = el.y;

    switch (type) {
      case 'left':
        newX = minX;
        break;
      case 'center':
        newX = boundsCenterX - el.width / 2;
        break;
      case 'right':
        newX = maxX - el.width;
        break;
      case 'top':
        newY = minY;
        break;
      case 'middle':
        newY = boundsCenterY - el.height / 2;
        break;
      case 'bottom':
        newY = maxY - el.height;
        break;
    }

    return {
      ...el,
      x: Math.round(newX),
      y: Math.round(newY),
    };
  });
}

/**
 * توزيع العناصر المحددة بمسافات متساوية
 */
export function distributeElements<T extends AlignableElement>(
  elements: T[],
  selectedIds: string[],
  type: DistributionType,
): T[] {
  if (!elements || elements.length === 0 || selectedIds.length < 3) {
    return elements;
  }

  const selectedSet = new Set(selectedIds);
  const selected = elements.filter((el) => selectedSet.has(el.id));

  if (selected.length < 3) return elements;

  if (type === 'horizontal') {
    // الترتيب حسب الموضع الأفقي X
    const sorted = [...selected].sort((a, b) => a.x - b.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalWidthOfAll = sorted.reduce((sum, el) => sum + el.width, 0);
    const totalSpan = last.x + last.width - first.x;
    const availableGap = totalSpan - totalWidthOfAll;
    const gap = availableGap / (sorted.length - 1);

    let currentX = first.x;
    const newPositions = new Map<string, number>();

    for (const el of sorted) {
      newPositions.set(el.id, Math.round(currentX));
      currentX += el.width + gap;
    }

    return elements.map((el) => {
      if (newPositions.has(el.id)) {
        return { ...el, x: newPositions.get(el.id)! };
      }
      return el;
    });
  } else {
    // الترتيب حسب الموضع الرأسي Y
    const sorted = [...selected].sort((a, b) => a.y - b.y);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalHeightOfAll = sorted.reduce((sum, el) => sum + el.height, 0);
    const totalSpan = last.y + last.height - first.y;
    const availableGap = totalSpan - totalHeightOfAll;
    const gap = availableGap / (sorted.length - 1);

    let currentY = first.y;
    const newPositions = new Map<string, number>();

    for (const el of sorted) {
      newPositions.set(el.id, Math.round(currentY));
      currentY += el.height + gap;
    }

    return elements.map((el) => {
      if (newPositions.has(el.id)) {
        return { ...el, y: newPositions.get(el.id)! };
      }
      return el;
    });
  }
}

/**
 * إعادة ترتيب الطبقات في مصفوفة العناصر
 */
export function reorderLayers<T extends { id: string }>(
  elements: T[],
  targetId: string,
  action: LayerOrderAction,
): T[] {
  const index = elements.findIndex((el) => el.id === targetId);
  if (index === -1) return elements;

  const result = [...elements];
  const [targetElement] = result.splice(index, 1);

  switch (action) {
    case 'bring-to-front':
      result.push(targetElement);
      break;
    case 'send-to-back':
      result.unshift(targetElement);
      break;
    case 'bring-forward': {
      const newIndex = Math.min(result.length, index + 1);
      result.splice(newIndex, 0, targetElement);
      break;
    }
    case 'send-backward': {
      const newIndex = Math.max(0, index - 1);
      result.splice(newIndex, 0, targetElement);
      break;
    }
  }

  return result;
}
