import { describe, it, expect } from 'vitest';
import { smartSnap } from '../../src/spatial/smart-snap-engine';

const el = (id: string, x: number, y: number, w = 100, h = 50) => ({ id, type: 'paragraph' as const, domain: 'Writer' as const, name: id, x, y, width: w, height: h, zIndex: 0 });

describe('ALGO-031: smartSnap', () => {
  it('snaps to element left edge', () => {
    const elements = [el('a', 0, 0), el('b', 200, 0)];
    const result = smartSnap(elements, ['b'], 198, 0, 100, 50);
    expect(result.guides.length).toBeGreaterThan(0);
  });

  it('snaps to element right edge', () => {
    const elements = [el('a', 0, 0, 100, 50)];
    const result = smartSnap(elements, ['b'], 98, 0, 100, 50);
    expect(result.guides.length).toBeGreaterThan(0);
  });

  it('does not snap beyond threshold', () => {
    const elements = [el('a', 0, 0)];
    const result = smartSnap(elements, ['b'], 50, 50, 100, 50, 6);
    expect(result.guides).toHaveLength(0);
  });
});
