import { describe, it, expect } from 'vitest';
import { generateDynamicGuides, generateMeasurementLabels } from '../../src/spatial/dynamic-guide-lines';

describe('ALGO-032: dynamic-guide-lines', () => {
  it('generates vertical guide when edges align', () => {
    const moving = { x: 50, y: 0, width: 100, height: 50 };
    const statics = [{ x: 50, y: 100, width: 80, height: 40 }];
    const guides = generateDynamicGuides(moving, statics, 5);
    expect(guides.some(g => g.orientation === 'vertical')).toBe(true);
  });

  it('generates horizontal guide when center aligns', () => {
    const moving = { x: 0, y: 50, width: 100, height: 20 };
    const statics = [{ x: 200, y: 40, width: 60, height: 40 }];
    const guides = generateDynamicGuides(moving, statics, 5);
    expect(guides.some(g => g.orientation === 'horizontal')).toBe(true);
  });

  it('deduplicates guides', () => {
    const moving = { x: 0, y: 0, width: 100, height: 50 };
    const statics = [{ x: 100, y: 0, width: 100, height: 50 }];
    const guides = generateDynamicGuides(moving, statics, 10);
    const verticals = guides.filter(g => g.orientation === 'vertical');
    expect(verticals.length).toBeLessThanOrEqual(2);
  });

  it('generates measurement labels for small gaps', () => {
    const moving = { x: 0, y: 0, width: 100, height: 50 };
    const statics = { x: 150, y: 0, width: 100, height: 50 };
    const labels = generateMeasurementLabels(moving, statics);
    expect(labels.length).toBeGreaterThan(0);
  });
});
