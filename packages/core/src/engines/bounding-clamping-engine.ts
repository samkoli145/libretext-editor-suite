/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: bounding-clamping-engine.ts
 * 📂 المسار: packages/core/src/engines/bounding-clamping-engine.ts
 * 🎯 الهدف الرئيسي: تقييد حركة العناصر داخل حدود اللوحة
 * 🏷️ المعرف: CORE-ENG-015
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface CanvasBounds {
  readonly width: number;
  readonly height: number;
}

export interface ClampInput {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ClampResult {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function clampElement(el: ClampInput, canvas: CanvasBounds): ClampResult {
  return {
    id: el.id,
    x: clamp(el.x, 0, Math.max(0, canvas.width - el.width)),
    y: clamp(el.y, 0, Math.max(0, canvas.height - el.height)),
  };
}

export function clampMultiple(
  elements: readonly ClampInput[],
  canvas: CanvasBounds,
): readonly ClampResult[] {
  return elements.map(el => clampElement(el, canvas));
}

export function isOutOfBounds(el: ClampInput, canvas: CanvasBounds): boolean {
  return (
    el.x < 0 || el.y < 0 ||
    el.x + el.width > canvas.width ||
    el.y + el.height > canvas.height
  );
}
