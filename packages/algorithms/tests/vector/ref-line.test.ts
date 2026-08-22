import { describe, it, expect } from 'vitest';
import { calculateAlignmentRefLines, calculateDistanceBadges } from '../../src/vector/ref-line';

describe('ALGO-035: vector/ref-line', () => {
  const box = (x: number, y: number, w: number, h: number) => ({
    x, y, width: w, height: h,
    minX: x, minY: y, maxX: x + w, maxY: y + h,
    centerX: x + w / 2, centerY: y + h / 2,
  });

  it('detects left edge alignment', () => {
    const lines = calculateAlignmentRefLines(box(100, 0, 80, 40), [box(100, 100, 60, 30)]);
    expect(lines.some(l => l.orientation === 'vertical')).toBe(true);
  });

  it('detects horizontal center alignment', () => {
    const lines = calculateAlignmentRefLines(box(0, 100, 100, 20), [box(200, 95, 80, 30)]);
    expect(lines.some(l => l.orientation === 'horizontal')).toBe(true);
  });

  it('returns empty for far-apart elements', () => {
    const lines = calculateAlignmentRefLines(box(0, 0, 50, 50), [box(500, 500, 50, 50)]);
    expect(lines).toHaveLength(0);
  });

  it('calculateDistanceBadges for horizontal gap', () => {
    const badges = calculateDistanceBadges(box(0, 0, 80, 50), [box(150, 0, 80, 50)]);
    expect(badges.some(b => b.orientation === 'horizontal')).toBe(true);
  });

  it('calculateDistanceBadges for vertical gap', () => {
    const badges = calculateDistanceBadges(box(0, 0, 80, 50), [box(0, 150, 80, 50)]);
    expect(badges.some(b => b.orientation === 'vertical')).toBe(true);
  });
});
