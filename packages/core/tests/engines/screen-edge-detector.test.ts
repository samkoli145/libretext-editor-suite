import { describe, it, expect } from 'vitest';
import { detectAndFlip, isNearEdge } from '../../src/engines/screen-edge-detector';

describe('CORE-ENG-014: screen-edge-detector', () => {
  it('flips menu when near right edge', () => {
    const result = detectAndFlip(1850, 100, { width: 200, height: 300 }, { width: 1920, height: 1080 });
    expect(result.flippedX).toBe(true);
    expect(result.x).toBeLessThan(1850);
  });

  it('flips menu when near bottom edge', () => {
    const result = detectAndFlip(100, 900, { width: 200, height: 300 }, { width: 1920, height: 1080 });
    expect(result.flippedY).toBe(true);
  });

  it('does not flip when within bounds', () => {
    const result = detectAndFlip(500, 400, { width: 200, height: 200 }, { width: 1920, height: 1080 });
    expect(result.flippedX).toBe(false);
    expect(result.flippedY).toBe(false);
  });

  it('isNearEdge detects edges', () => {
    const edges = isNearEdge(10, 10, { width: 1920, height: 1080 }, 50);
    expect(edges.nearLeft).toBe(true);
    expect(edges.nearTop).toBe(true);
    expect(edges.nearRight).toBe(false);
    expect(edges.nearBottom).toBe(false);
  });
});
