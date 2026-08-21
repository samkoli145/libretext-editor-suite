/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: undo-redo-engine.ts
 * 📂 المسار: packages/core/src/engines/undo-redo-engine.ts
 * 🎯 الهدف الرئيسي: محرك التراجع والإعادة (Undo/Redo)
 *    مع حفظ_snapshots وتقييد حجم الذاكرة القصوى.
 * 📋 المعايير: صفر اعتماديات، دوال نقية < 50 سطر.
 * 🏷️ المعرف: CORE-ENG-012
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface Snapshot<T = unknown> {
  readonly data: T;
  readonly description: string;
  readonly timestamp: number;
}

export function createUndoRedoEngine<T = unknown>(maxSize = 50) {
  let stack: Snapshot<T>[] = [];
  let pointer = -1;

  function push(data: T, description: string): void {
    const truncated = stack.slice(0, pointer + 1);
    stack = [...truncated, { data, description, timestamp: Date.now() }];
    if (stack.length > maxSize) {
      stack = stack.slice(stack.length - maxSize);
    }
    pointer = stack.length - 1;
  }

  function undo(): Snapshot<T> | null {
    if (pointer < 0) return null;
    const snap = stack[pointer]!;
    pointer--;
    return snap;
  }

  function redo(): Snapshot<T> | null {
    if (pointer >= stack.length - 1) return null;
    pointer++;
    return stack[pointer]!;
  }

  function canUndo(): boolean { return pointer >= 0; }
  function canRedo(): boolean { return pointer < stack.length - 1; }
  function current(): Snapshot<T> | null { return pointer >= 0 ? stack[pointer]! : null; }
  function clear(): void { stack = []; pointer = -1; }
  function size(): number { return stack.length; }

  return { push, undo, redo, canUndo, canRedo, current, clear, size };
}
