/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: selection-manager.ts
 * 📂 المسار: packages/core/src/engines/selection-manager.ts
 * 🎯 الهدف الرئيسي: مدير شامل لتحديد العناصر على لوحة الرسم
 *    مع دعم النقر والتحديد المتعدد وتحديد الكل.
 * 🏷️ المعرف: CORE-ENG-017
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface SelectableElement {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly isLocked?: boolean;
}

export type SelectionMode = 'single' | 'multi' | 'range';

function pointInElement(px: number, py: number, el: SelectableElement): boolean {
  return px >= el.x && px <= el.x + el.width && py >= el.y && py <= el.y + el.height;
}

export function createSelectionManager() {
  let selected = new Set<string>();

  function selectById(id: string): readonly string[] {
    selected = new Set([id]);
    return Array.from(selected);
  }

  function addToSelection(id: string): readonly string[] {
    selected.add(id);
    return Array.from(selected);
  }

  function removeFromSelection(id: string): readonly string[] {
    selected.delete(id);
    return Array.from(selected);
  }

  function toggleSelection(id: string): readonly string[] {
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    return Array.from(selected);
  }

  function selectAll(allIds: readonly string[]): readonly string[] {
    selected = new Set(allIds);
    return Array.from(selected);
  }

  function clearSelection(): void {
    selected = new Set();
  }

  function selectByPoint(
    px: number,
    py: number,
    elements: readonly SelectableElement[],
    additive = false,
  ): readonly string[] {
    if (!additive) selected = new Set();
    for (const el of elements) {
      if (!el.isLocked && pointInElement(px, py, el)) {
        selected.add(el.id);
        break;
      }
    }
    return Array.from(selected);
  }

  function selectByRect(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    elements: readonly SelectableElement[],
  ): readonly string[] {
    selected = new Set();
    for (const el of elements) {
      if (el.isLocked) continue;
      if (el.x < maxX && el.x + el.width > minX && el.y < maxY && el.y + el.height > minY) {
        selected.add(el.id);
      }
    }
    return Array.from(selected);
  }

  function getSelection(): readonly string[] {
    return Array.from(selected);
  }
  function isSelected(id: string): boolean {
    return selected.has(id);
  }
  function count(): number {
    return selected.size;
  }

  return {
    selectById,
    addToSelection,
    removeFromSelection,
    toggleSelection,
    selectAll,
    clearSelection,
    selectByPoint,
    selectByRect,
    getSelection,
    isSelected,
    count,
  };
}
