/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: smart-snap-engine.ts
 * 📂 المسار: packages/algorithms/src/spatial/smart-snap-engine.ts
 * 🎯 الهدف الرئيسي: محرك التسنين الذكي مع خطوط الإرشاد
 *    لاكتشاف حواف ومراكز العناصر المجاورة والتسنين ضمن نطاق تحمل.
 * 🏷️ المعرف: ALGO-031
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

import type { SimulatedCanvasElement, AlignmentGuideLine } from './artboard-types';

function calcEdges(el: SimulatedCanvasElement) {
  return {
    left: el.x,
    right: el.x + el.width,
    top: el.y,
    bottom: el.y + el.height,
    centerX: el.x + el.width / 2,
    centerY: el.y + el.height / 2,
  };
}

function snapValue(
  proposed: number,
  target: number,
  threshold: number,
): { snapped: number; matched: boolean } {
  return Math.abs(proposed - target) <= threshold
    ? { snapped: target, matched: true }
    : { snapped: proposed, matched: false };
}

export function smartSnap(
  elements: readonly SimulatedCanvasElement[],
  movingIds: readonly string[],
  proposedX: number,
  proposedY: number,
  width: number,
  height: number,
  threshold = 6,
): { snappedX: number; snappedY: number; guides: readonly AlignmentGuideLine[] } {
  let sx = proposedX;
  let sy = proposedY;
  const guides: AlignmentGuideLine[] = [];
  const others = elements.filter((e) => !movingIds.includes(e.id));

  for (const other of others) {
    const t = calcEdges(other);
    const r = sx + width;
    const cx = sx + width / 2;

    for (const [prop, target] of [
      [sx, t.left],
      [r, t.right],
      [cx, t.centerX],
    ] as const) {
      const res = snapValue(prop, target, threshold);
      if (res.matched) {
        sx = res.snapped - (prop === r ? width : prop === cx ? width / 2 : 0);
        guides.push({
          type: 'vertical',
          position: target,
          start: Math.min(sy, other.y),
          end: Math.max(sy + height, other.y + other.height),
        });
        break;
      }
    }
  }

  for (const other of others) {
    const t = calcEdges(other);
    const b = sy + height;
    const cy = sy + height / 2;

    for (const [prop, target] of [
      [sy, t.top],
      [b, t.bottom],
      [cy, t.centerY],
    ] as const) {
      const res = snapValue(prop, target, threshold);
      if (res.matched) {
        sy = res.snapped - (prop === b ? height : prop === cy ? height / 2 : 0);
        guides.push({
          type: 'horizontal',
          position: target,
          start: Math.min(sx, other.x),
          end: Math.max(sx + width, other.x + other.width),
        });
        break;
      }
    }
  }

  return { snappedX: Math.round(sx), snappedY: Math.round(sy), guides };
}
