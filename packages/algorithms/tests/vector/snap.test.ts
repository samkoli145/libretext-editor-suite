import { describe, it, expect } from 'vitest';
import { snapPointToGrid, calculateSmartSnap } from '../../src/vector/snap';

describe('ALGO-034: vector/snap', () => {
  it('snapPointToGrid rounds correctly', () => {
    expect(snapPointToGrid({ x: 12, y: 27 }, 10)).toEqual({ x: 10, y: 30 });
    expect(snapPointToGrid({ x: 5, y: 5 }, 10)).toEqual({ x: 10, y: 10 });
  });

  it('snapPointToGrid returns same for gridSize <= 1', () => {
    expect(snapPointToGrid({ x: 12, y: 27 }, 1)).toEqual({ x: 12, y: 27 });
  });

  it('calculateSmartSnap snaps to canvas center', () => {
    const box = {
      x: 480,
      y: 0,
      width: 40,
      height: 40,
      minX: 480,
      minY: 0,
      maxX: 520,
      maxY: 40,
      centerX: 500,
      centerY: 20,
    };
    const result = calculateSmartSnap(box, [], {
      snapToCanvas: true,
      canvasWidth: 1000,
      canvasHeight: 600,
      snapThreshold: 10,
    });
    expect(result.matchedTargets.some((t) => t.type === 'canvas')).toBe(true);
  });

  it('calculateSmartSnap snaps to element edge', () => {
    const moving = {
      x: 298,
      y: 0,
      width: 100,
      height: 50,
      minX: 298,
      minY: 0,
      maxX: 398,
      maxY: 50,
      centerX: 348,
      centerY: 25,
    };
    const ref = {
      x: 300,
      y: 0,
      width: 100,
      height: 50,
      minX: 300,
      minY: 0,
      maxX: 400,
      maxY: 50,
      centerX: 350,
      centerY: 25,
    };
    const result = calculateSmartSnap(moving, [ref], { snapThreshold: 10 });
    expect(result.matchedTargets.some((t) => t.type === 'element')).toBe(true);
  });

  it('calculateSmartSnap falls back to grid', () => {
    const box = {
      x: 53,
      y: 47,
      width: 100,
      height: 50,
      minX: 53,
      minY: 47,
      maxX: 153,
      maxY: 97,
      centerX: 103,
      centerY: 72,
    };
    const result = calculateSmartSnap(box, [], {
      snapToGrid: true,
      gridSize: 10,
      snapThreshold: 4,
    });
    expect(result.snappedPoint.x).toBe(50);
    expect(result.snappedPoint.y).toBe(50);
  });
});
