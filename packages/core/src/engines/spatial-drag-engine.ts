/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: spatial-drag-engine.ts
 * 📂 المسار: packages/core/src/engines/spatial-drag-engine.ts
 * 🎯 الهدف الرئيسي: محرك السحب المكاني لعناصر لوحة الرسم
 *    مع التسنين للشبكة وضبط الحدود والسحب المتعدد المتواز.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية (Zero-Dependency Headless Core).
 *    - دوال نقية بأقل من 50 سطر لكل دالة.
 * 🏷️ المعرف: CORE-ENG-009
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface DragElement {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly isLocked?: boolean;
}

export interface DragState {
  readonly initialPositions: ReadonlyMap<string, { readonly x: number; readonly y: number }>;
  readonly snapGrid: number;
  readonly canvasWidth: number;
  readonly canvasHeight: number;
}

export interface DragResult {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

function snapToGrid(value: number, gridSize: number): number {
  if (gridSize <= 1) return Math.round(value);
  return Math.round(value / gridSize) * gridSize;
}

function clampInBounds(
  x: number,
  y: number,
  w: number,
  h: number,
  canvasW: number,
  canvasH: number,
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(x, Math.max(0, canvasW - w))),
    y: Math.max(0, Math.min(y, Math.max(0, canvasH - h))),
  };
}

function buildInitialMap(
  elements: readonly DragElement[],
  selectedIds: readonly string[],
): ReadonlyMap<string, { readonly x: number; readonly y: number }> {
  const map = new Map<string, { readonly x: number; readonly y: number }>();
  for (const el of elements) {
    if (selectedIds.includes(el.id)) {
      map.set(el.id, { x: el.x, y: el.y });
    }
  }
  return map;
}

export function createSpatialDragEngine() {
  let state: DragState | null = null;

  function startDrag(
    elements: readonly DragElement[],
    selectedIds: readonly string[],
    snapGrid: number,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    state = {
      initialPositions: buildInitialMap(elements, selectedIds),
      snapGrid,
      canvasWidth,
      canvasHeight,
    };
  }

  function moveDrag(
    elements: readonly DragElement[],
    selectedIds: readonly string[],
    deltaX: number,
    deltaY: number,
  ): readonly DragResult[] {
    if (!state) return [];
    const results: DragResult[] = [];
    for (const el of elements) {
      if (!selectedIds.includes(el.id) || el.isLocked) continue;
      const init = state.initialPositions.get(el.id);
      if (!init) continue;
      const snappedX = snapToGrid(init.x + deltaX, state.snapGrid);
      const snappedY = snapToGrid(init.y + deltaY, state.snapGrid);
      const clamped = clampInBounds(
        snappedX,
        snappedY,
        el.width,
        el.height,
        state.canvasWidth,
        state.canvasHeight,
      );
      results.push({ id: el.id, x: clamped.x, y: clamped.y });
    }
    return results;
  }

  function endDrag(): void {
    state = null;
  }

  function isActive(): boolean {
    return state !== null;
  }

  return { startDrag, moveDrag, endDrag, isActive };
}
