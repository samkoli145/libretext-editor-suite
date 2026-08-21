/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: screen-edge-detector.ts
 * 📂 المسار: packages/core/src/engines/screen-edge-detector.ts
 * 🎯 الهدف الرئيسي: كشف حواف الشاشة وعكس اتجاه القوائم
 *    لتجنب تجاوز حدود النافذة.
 * 🏷️ المعرف: CORE-ENG-014
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface ViewportBounds {
  readonly width: number;
  readonly height: number;
}

export interface MenuDimensions {
  readonly width: number;
  readonly height: number;
}

export interface FlipResult {
  readonly x: number;
  readonly y: number;
  readonly flippedX: boolean;
  readonly flippedY: boolean;
}

function clampToViewport(x: number, max: number, menuSize: number): { val: number; flipped: boolean } {
  if (x + menuSize > max) return { val: Math.max(0, x - menuSize), flipped: true };
  if (x < 0) return { val: 0, flipped: true };
  return { val: x, flipped: false };
}

export function detectAndFlip(
  x: number,
  y: number,
  menuDims: MenuDimensions,
  viewport: ViewportBounds,
): FlipResult {
  const fx = clampToViewport(x, viewport.width, menuDims.width);
  const fy = clampToViewport(y, viewport.height, menuDims.height);
  return { x: fx.val, y: fy.val, flippedX: fx.flipped, flippedY: fy.flipped };
}

export function isNearEdge(
  x: number, y: number,
  viewport: ViewportBounds,
  edgeThreshold = 50,
): { nearRight: boolean; nearBottom: boolean; nearLeft: boolean; nearTop: boolean } {
  return {
    nearRight: viewport.width - x < edgeThreshold,
    nearBottom: viewport.height - y < edgeThreshold,
    nearLeft: x < edgeThreshold,
    nearTop: y < edgeThreshold,
  };
}
