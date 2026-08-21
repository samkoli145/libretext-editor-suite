/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: snap.ts
 * 📂 المسار: packages/algorithms/src/vector/snap.ts
 * 🎯 الهدف الرئيسي: محرك التسنين الذكي متعدد الأهداف
 *    (شبكة، عناصر، حدود كانفا) مع أولوية وتلامس.
 * 🏷️ المعرف: ALGO-034
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

import { type Point2D, type BoundingBox } from './common';

export interface SnapTarget {
  readonly type: 'grid' | 'element' | 'canvas' | 'center';
  readonly axis: 'x' | 'y';
  readonly position: number;
  readonly guideStart: number;
  readonly guideEnd: number;
  readonly targetId?: string;
}

export interface SnapResult {
  readonly snappedPoint: Point2D;
  readonly delta: Point2D;
  readonly matchedTargets: readonly SnapTarget[];
}

export interface SnapConfig {
  readonly gridSize?: number;
  readonly snapThreshold?: number;
  readonly snapToGrid?: boolean;
  readonly snapToElements?: boolean;
  readonly snapToCanvas?: boolean;
  readonly canvasWidth?: number;
  readonly canvasHeight?: number;
}

export function snapPointToGrid(point: Point2D, gridSize = 10): Point2D {
  if (gridSize <= 1) return point;
  return { x: Math.round(point.x / gridSize) * gridSize, y: Math.round(point.y / gridSize) * gridSize };
}

function findBestSnap(
  movingVals: readonly number[],
  targetVals: readonly number[],
  currentBest: number,
): { delta: number; best: number; pos: number } {
  let best = currentBest;
  let delta = 0;
  let pos = 0;
  for (const mv of movingVals) {
    for (const tv of targetVals) {
      const diff = Math.abs(mv - tv);
      if (diff < best) {
        best = diff;
        delta = tv - mv;
        pos = tv;
      }
    }
  }
  return { delta, best, pos };
}

export function calculateSmartSnap(
  movingBox: BoundingBox,
  referenceBoxes: readonly BoundingBox[],
  config: SnapConfig = {},
): SnapResult {
  const threshold = config.snapThreshold ?? 6;
  const gridSize = config.gridSize ?? 10;
  let dX = 0, dY = 0;
  let bestX = threshold + 1;
  let bestY = threshold + 1;
  const targets: SnapTarget[] = [];

  if (config.snapToCanvas && config.canvasWidth && config.canvasHeight) {
    const cxVals = [0, config.canvasWidth / 2, config.canvasWidth];
    const cyVals = [0, config.canvasHeight / 2, config.canvasHeight];
    const mX = [movingBox.minX, movingBox.centerX, movingBox.maxX];
    const mY = [movingBox.minY, movingBox.centerY, movingBox.maxY];
    const rx = findBestSnap(mX, cxVals, bestX);
    if (rx.best < bestX) { bestX = rx.best; dX = rx.delta; targets.push({ type: 'canvas', axis: 'x', position: rx.pos, guideStart: 0, guideEnd: config.canvasHeight }); }
    const ry = findBestSnap(mY, cyVals, bestY);
    if (ry.best < bestY) { bestY = ry.best; dY = ry.delta; targets.push({ type: 'canvas', axis: 'y', position: ry.pos, guideStart: 0, guideEnd: config.canvasWidth }); }
  }

  if (config.snapToElements !== false && referenceBoxes.length > 0) {
    for (const ref of referenceBoxes) {
      const rX = findBestSnap([movingBox.minX, movingBox.centerX, movingBox.maxX], [ref.minX, ref.centerX, ref.maxX], bestX);
      if (rX.best < bestX) { bestX = rX.best; dX = rX.delta; targets.push({ type: 'element', axis: 'x', position: rX.pos, guideStart: Math.min(movingBox.minY, ref.minY) - 10, guideEnd: Math.max(movingBox.maxY, ref.maxY) + 10 }); }
      const rY = findBestSnap([movingBox.minY, movingBox.centerY, movingBox.maxY], [ref.minY, ref.centerY, ref.maxY], bestY);
      if (rY.best < bestY) { bestY = rY.best; dY = rY.delta; targets.push({ type: 'element', axis: 'y', position: rY.pos, guideStart: Math.min(movingBox.minX, ref.minX) - 10, guideEnd: Math.max(movingBox.maxX, ref.maxX) + 10 }); }
    }
  }

  if (config.snapToGrid && bestX > threshold) dX = Math.round(movingBox.x / gridSize) * gridSize - movingBox.x;
  if (config.snapToGrid && bestY > threshold) dY = Math.round(movingBox.y / gridSize) * gridSize - movingBox.y;

  return { snappedPoint: { x: movingBox.x + dX, y: movingBox.y + dY }, delta: { x: dX, y: dY }, matchedTargets: targets };
}
