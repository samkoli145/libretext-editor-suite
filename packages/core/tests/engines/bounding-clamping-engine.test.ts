import { describe, it, expect } from 'vitest';
import { clampElement, clampMultiple, isOutOfBounds } from '../../src/engines/bounding-clamping-engine';

describe('CORE-ENG-015: bounding-clamping-engine', () => {
  const canvas = { width: 800, height: 600 };

  it('clamps element inside bounds', () => {
    const result = clampElement({ id: 'a', x: -50, y: 10, width: 100, height: 50 }, canvas);
    expect(result.x).toBe(0);
    expect(result.y).toBe(10);
  });

  it('clamps element that exceeds right edge', () => {
    const result = clampElement({ id: 'a', x: 900, y: 10, width: 100, height: 50 }, canvas);
    expect(result.x).toBe(700);
  });

  it('clamps element that exceeds bottom', () => {
    const result = clampElement({ id: 'a', x: 10, y: 600, width: 50, height: 50 }, canvas);
    expect(result.y).toBe(550);
  });

  it('clampMultiple processes all', () => {
    const results = clampMultiple([
      { id: 'a', x: -10, y: 0, width: 50, height: 50 },
      { id: 'b', x: 900, y: 0, width: 50, height: 50 },
    ], canvas);
    expect(results).toHaveLength(2);
    expect(results[0]!.x).toBe(0);
    expect(results[1]!.x).toBe(750);
  });

  it('isOutOfBounds detects overflow', () => {
    expect(isOutOfBounds({ id: 'a', x: -10, y: 0, width: 50, height: 50 }, canvas)).toBe(true);
    expect(isOutOfBounds({ id: 'a', x: 100, y: 100, width: 50, height: 50 }, canvas)).toBe(false);
  });
});
