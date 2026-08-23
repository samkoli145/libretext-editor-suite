import { describe, it, expect } from 'vitest';
import {
  getTransformHandles,
  hitTestHandles,
  calculateResizeDelta,
  calculateRotationAngle,
} from '../../src/vector/control-handle-manager';

describe('ALGO-036: control-handle-manager', () => {
  const box = {
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    minX: 100,
    minY: 100,
    maxX: 300,
    maxY: 200,
    centerX: 200,
    centerY: 150,
  };

  it('generates 9 handles (8 + rotation)', () => {
    const handles = getTransformHandles(box, 0);
    expect(handles).toHaveLength(9);
    expect(handles.some((h) => h.type === 'rotation')).toBe(true);
  });

  it('hitTestHandles finds handle within tolerance', () => {
    const handles = getTransformHandles(box, 0);
    const found = hitTestHandles(handles, { x: 100, y: 100 }, 10);
    expect(found).not.toBeNull();
    expect(found!.type).toBe('nw');
  });

  it('hitTestHandles returns null when too far', () => {
    const handles = getTransformHandles(box, 0);
    expect(hitTestHandles(handles, { x: 999, y: 999 })).toBeNull();
  });

  it('calculateResizeDelta increases width from east handle', () => {
    const result = calculateResizeDelta('e', box, { x: 350, y: 150 }, { x: 300, y: 150 });
    expect(result.width).toBe(250);
  });

  it('calculateResizeDelta decreases width from west handle', () => {
    const result = calculateResizeDelta('w', box, { x: 120, y: 150 }, { x: 100, y: 150 });
    expect(result.width).toBe(180);
    expect(result.x).toBe(120);
  });

  it('calculateResizeDelta enforces minimum size', () => {
    const result = calculateResizeDelta('e', box, { x: 105, y: 150 }, { x: 300, y: 150 });
    expect(result.width).toBeGreaterThanOrEqual(10);
  });

  it('calculateRotationAngle snaps to 15 degrees', () => {
    const center = { x: 200, y: 150 };
    const angle = calculateRotationAngle(center, { x: 200, y: 100 });
    expect(angle % 15).toBe(0);
  });
});
