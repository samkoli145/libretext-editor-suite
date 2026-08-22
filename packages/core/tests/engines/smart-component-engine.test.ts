import { describe, it, expect } from 'vitest';
import { resolveComponents, sortByIdWeight } from '../../src/engines/smart-component-engine';

describe('CORE-ENG-019: smart-component-engine', () => {
  const deps = [
    { id: 'a', requires: [], conflicts: ['c'], weight: 10 },
    { id: 'b', requires: ['a'], conflicts: [], weight: 20 },
    { id: 'c', requires: [], conflicts: ['a'], weight: 5 },
    { id: 'd', requires: ['b', 'a'], conflicts: [], weight: 15 },
  ];

  it('resolves transitive dependencies', () => {
    const result = resolveComponents(['d'], deps);
    expect(result.resolved).toContain('d');
    expect(result.resolved).toContain('b');
    expect(result.resolved).toContain('a');
  });

  it('detects conflicts', () => {
    const result = resolveComponents(['a', 'c'], deps);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  it('detects missing dependencies', () => {
    const result = resolveComponents(['e'], deps);
    expect(result.missing).toContain('e');
  });

  it('sortByIdWeight sorts descending', () => {
    const sorted = sortByIdWeight(deps);
    expect(sorted[0]!.weight).toBe(20);
    expect(sorted[sorted.length - 1]!.weight).toBe(5);
  });
});
