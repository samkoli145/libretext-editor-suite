/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: z-order-manager.ts
 * 📂 المسار: packages/core/src/engines/z-order-manager.ts
 * 🎯 الهدف الرئيسي: إدارة ترتيب طبقات العناصر (Z-Index)
 *    مع دعم bring-forward/send-backward/bring-to-front/send-to-back.
 * 🏷️ المعرف: CORE-ENG-016
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface ZElement {
  readonly id: string;
  readonly zIndex: number;
}

export type ZOrderAction = 'bring-to-front' | 'send-to-back' | 'bring-forward' | 'send-backward';

function getZLimits(elements: readonly ZElement[]): { max: number; min: number } {
  if (elements.length === 0) return { max: 0, min: 0 };
  let max = -Infinity;
  let min = Infinity;
  for (const e of elements) {
    if (e.zIndex > max) max = e.zIndex;
    if (e.zIndex < min) min = e.zIndex;
  }
  return { max: Math.max(max, 0), min: Math.min(min, 0) };
}

export function reorderZIndex(
  elements: readonly ZElement[],
  selectedIds: readonly string[],
  action: ZOrderAction,
): readonly { id: string; zIndex: number }[] {
  if (selectedIds.length === 0) return [];
  const { max, min } = getZLimits(elements);

  return elements
    .filter((e) => selectedIds.includes(e.id))
    .map((e) => {
      switch (action) {
        case 'bring-to-front':
          return { id: e.id, zIndex: max + 1 };
        case 'send-to-back':
          return { id: e.id, zIndex: Math.max(0, min - 1) };
        case 'bring-forward':
          return { id: e.id, zIndex: e.zIndex + 1 };
        case 'send-backward':
          return { id: e.id, zIndex: Math.max(0, e.zIndex - 1) };
      }
    });
}

export function applyZOrderChanges<T extends { readonly id: string; readonly zIndex: number }>(
  elements: readonly T[],
  changes: readonly { id: string; zIndex: number }[],
): readonly T[] {
  const changeMap = new Map(changes.map((c) => [c.id, c.zIndex]));
  return elements.map((el) => {
    const newZ = changeMap.get(el.id);
    return newZ !== undefined ? { ...el, zIndex: newZ } : el;
  });
}
