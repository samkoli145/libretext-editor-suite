/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: multi-selection-engine.ts
 * 📂 المسار: packages/core/src/engines/multi-selection-engine.ts
 * 🎯 الهدف الرئيسي: محرك إدارة مجموعة التحديد المتعدد
 *    مع دعم Shift+Click وإضافة/إزالة وعكس التحديد.
 * 📋 المعايير: صفر اعتماديات، دوال نقية < 50 سطر.
 * 🏷️ المعرف: CORE-ENG-011
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export function createMultiSelectionEngine() {
  let selected = new Set<string>();

  function select(id: string): readonly string[] {
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

  function toggleSelection(id: string, allIds: readonly string[]): readonly string[] {
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    return Array.from(selected);
  }

  function invertSelection(allIds: readonly string[]): readonly string[] {
    const next = new Set<string>();
    for (const id of allIds) {
      if (!selected.has(id)) next.add(id);
    }
    selected = next;
    return Array.from(selected);
  }

  function selectAll(allIds: readonly string[]): readonly string[] {
    selected = new Set(allIds);
    return Array.from(selected);
  }

  function clearSelection(): readonly string[] {
    selected = new Set();
    return [];
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
    select, addToSelection, removeFromSelection, toggleSelection,
    invertSelection, selectAll, clearSelection, getSelection,
    isSelected, count,
  };
}
