import { describe, it, expect } from 'vitest';
import { createSpatialDragEngine } from '../../src/engines/spatial-drag-engine';

const el = (id: string, x: number, y: number, w = 100, h = 50) => ({
  id,
  x,
  y,
  width: w,
  height: h,
});

describe('CORE-ENG-009: SpatialDragEngine', () => {
  it('returns empty when not started', () => {
    const engine = createSpatialDragEngine();
    expect(engine.moveDrag([], [], 10, 10)).toEqual([]);
    expect(engine.isActive()).toBe(false);
  });

  it('drag single unlocked element', () => {
    const engine = createSpatialDragEngine();
    const elements = [el('a', 100, 200)];
    engine.startDrag(elements, ['a'], 10, 1920, 1080);
    const result = engine.moveDrag(elements, ['a'], 50, 30);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('a');
    expect(result[0]!.x).toBe(150);
    expect(result[0]!.y).toBe(230);
    engine.endDrag();
    expect(engine.isActive()).toBe(false);
  });

  it('skips locked elements', () => {
    const engine = createSpatialDragEngine();
    const elements = [el('a', 100, 200)];
    engine.startDrag(elements, ['a'], 10, 1920, 1080);
    const result = engine.moveDrag([{ ...elements[0]!, isLocked: true }], ['a'], 50, 30);
    expect(result).toHaveLength(0);
  });

  it('snaps to grid', () => {
    const engine = createSpatialDragEngine();
    const elements = [el('a', 0, 0)];
    engine.startDrag(elements, ['a'], 20, 1920, 1080);
    const result = engine.moveDrag(elements, ['a'], 7, 13);
    expect(result[0]!.x).toBe(0);
    expect(result[0]!.y).toBe(20);
  });

  it('clamps within canvas bounds', () => {
    const engine = createSpatialDragEngine();
    const elements = [el('a', 1800, 1000, 200, 100)];
    engine.startDrag(elements, ['a'], 1, 2000, 1100);
    const result = engine.moveDrag(elements, ['a'], 1000, 1000);
    expect(result[0]!.x).toBe(1800);
    expect(result[0]!.y).toBe(1000);
  });

  it('drags multiple elements in parallel', () => {
    const engine = createSpatialDragEngine();
    const elements = [el('a', 10, 10), el('b', 200, 200)];
    engine.startDrag(elements, ['a', 'b'], 1, 1920, 1080);
    const result = engine.moveDrag(elements, ['a', 'b'], 50, 50);
    expect(result).toHaveLength(2);
  });
});
