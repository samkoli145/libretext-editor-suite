import { describe, it, expect } from 'vitest';
import { createMarqueeSelectionEngine } from '../../src/engines/marquee-selection-engine';

const el = (id: string, x: number, y: number, w = 50, h = 50) => ({ id, x, y, width: w, height: h });

describe('CORE-ENG-010: MarqueeSelectionEngine', () => {
  it('is inactive by default', () => {
    const engine = createMarqueeSelectionEngine();
    expect(engine.isActive()).toBe(false);
  });

  it('selects elements inside marquee box', () => {
    const engine = createMarqueeSelectionEngine();
    engine.start(0, 0);
    engine.update(120, 120);
    const elements = [el('a', 10, 10), el('b', 60, 60), el('c', 200, 200)];
    const ids = engine.getIntersectingIds(elements);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).not.toContain('c');
    engine.end();
  });

  it('handles reverse direction marquee', () => {
    const engine = createMarqueeSelectionEngine();
    engine.start(100, 100);
    engine.update(0, 0);
    const elements = [el('a', 10, 10), el('b', 200, 200)];
    const ids = engine.getIntersectingIds(elements);
    expect(ids).toContain('a');
    expect(ids).not.toContain('b');
  });

  it('clears after end', () => {
    const engine = createMarqueeSelectionEngine();
    engine.start(0, 0);
    engine.update(500, 500);
    engine.end();
    expect(engine.isActive()).toBe(false);
  });

  it('returns correct box dimensions', () => {
    const engine = createMarqueeSelectionEngine();
    engine.start(20, 20);
    engine.update(80, 60);
    const box = engine.getBox();
    expect(box.minX).toBe(20);
    expect(box.minY).toBe(20);
    expect(box.maxX).toBe(80);
    expect(box.maxY).toBe(60);
  });
});
