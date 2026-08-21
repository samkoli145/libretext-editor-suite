/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: control-handle-manager.ts
 * 📂 المسار: packages/algorithms/src/vector/control-handle-manager.ts
 * 🎯 الهدف الرئيسي: توليد وإدارة مقابض التحجيم والتدوير الثمانية
 *    مع حساب زاوية التدوير ونقاط بيزييه.
 * 🏷️ المعرف: ALGO-036
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

import { type Point2D, type BoundingBox, degToRad, radToDeg, rotatePoint, distance, angle, clamp } from './common';

export type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotation' | 'vertex' | 'inHandle' | 'outHandle';

export interface ControlHandle {
  readonly id: string;
  readonly type: HandleType;
  readonly x: number;
  readonly y: number;
  readonly cursor: string;
  readonly targetId: string;
  readonly vertexId?: string;
}

function cursorForHandle(type: HandleType, rotationDeg = 0): string {
  if (type === 'rotation') return 'grab';
  if (type === 'vertex' || type === 'inHandle' || type === 'outHandle') return 'crosshair';
  const base: Record<string, number> = { n: 0, ne: 45, e: 90, se: 135, s: 180, sw: 225, w: 270, nw: 315 };
  const total = ((base[type] ?? 0) + rotationDeg) % 360;
  if ((total >= 337.5 || total < 22.5) || (total >= 157.5 && total < 202.5)) return 'ns-resize';
  if ((total >= 22.5 && total < 67.5) || (total >= 202.5 && total < 247.5)) return 'nesw-resize';
  if ((total >= 67.5 && total < 112.5) || (total >= 247.5 && total < 292.5)) return 'ew-resize';
  return 'nwse-resize';
}

export function getTransformHandles(
  box: BoundingBox, rotationDeg = 0, targetId = 'element',
): ControlHandle[] {
  const center: Point2D = { x: box.centerX, y: box.centerY };
  const rad = degToRad(rotationDeg);
  const raw: Array<{ type: HandleType; point: Point2D }> = [
    { type: 'nw', point: { x: box.minX, y: box.minY } },
    { type: 'n', point: { x: box.centerX, y: box.minY } },
    { type: 'ne', point: { x: box.maxX, y: box.minY } },
    { type: 'e', point: { x: box.maxX, y: box.centerY } },
    { type: 'se', point: { x: box.maxX, y: box.maxY } },
    { type: 's', point: { x: box.centerX, y: box.maxY } },
    { type: 'sw', point: { x: box.minX, y: box.maxY } },
    { type: 'w', point: { x: box.minX, y: box.centerY } },
    { type: 'rotation', point: { x: box.centerX, y: box.minY - 24 } },
  ];
  return raw.map(h => {
    const rotated = rotationDeg !== 0 ? rotatePoint(h.point, center, rad) : h.point;
    return { id: `${targetId}-handle-${h.type}`, type: h.type, x: rotated.x, y: rotated.y, cursor: cursorForHandle(h.type, rotationDeg), targetId };
  });
}

export function hitTestHandles(handles: readonly ControlHandle[], point: Point2D, tolerance = 8): ControlHandle | null {
  for (const h of handles) {
    if (distance(point, { x: h.x, y: h.y }) <= tolerance) return h;
  }
  return null;
}

export function calculateResizeDelta(
  handle: HandleType, startBox: BoundingBox,
  currentPoint: Point2D, startPoint: Point2D,
  lockAspect = false,
): BoundingBox {
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  let nx = startBox.x, ny = startBox.y, nw = startBox.width, nh = startBox.height;
  const ar = startBox.width / (startBox.height || 1);

  if (handle.includes('e')) nw = Math.max(10, startBox.width + dx);
  else if (handle.includes('w')) { const r = startBox.width - dx; if (r >= 10) { nw = r; nx = startBox.x + dx; } }
  if (handle.includes('s')) nh = Math.max(10, startBox.height + dy);
  else if (handle.includes('n')) { const r = startBox.height - dy; if (r >= 10) { nh = r; ny = startBox.y + dy; } }
  if (lockAspect && ['nw', 'ne', 'se', 'sw'].includes(handle)) nh = Math.round(nw / ar);

  return { x: nx, y: ny, width: nw, height: nh, minX: nx, minY: ny, maxX: nx + nw, maxY: ny + nh, centerX: nx + nw / 2, centerY: ny + nh / 2 };
}

export function calculateRotationAngle(center: Point2D, currentPoint: Point2D, snapDeg = 15): number {
  const rad = angle(center, currentPoint);
  let deg = ((radToDeg(rad) + 90) % 360 + 360) % 360;
  if (snapDeg > 0) {
    const rem = deg % snapDeg;
    if (rem < snapDeg / 3 || rem > (snapDeg * 2) / 3) deg = Math.round(deg / snapDeg) * snapDeg;
  }
  return Math.round(deg);
}
