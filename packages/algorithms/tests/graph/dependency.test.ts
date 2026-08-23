/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [dependency.test.ts] اختبارات كشف الحلقات والترتيب الطوبولوجي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  detectCycle,
  getCircularError,
  topologicalSort,
  getRecalculationOrder,
} from '../../src/graph/dependency';
import type { DependencyGraphData } from '../../src/types';

const acyclicGraph: DependencyGraphData = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: {
    B: ['A'],
    C: ['A', 'B'],
    D: ['C'],
  },
};

const cyclicGraph: DependencyGraphData = {
  nodes: ['A', 'B', 'C'],
  edges: {
    A: ['B'],
    B: ['C'],
    C: ['A'],
  },
};

const selfLoopGraph: DependencyGraphData = {
  nodes: ['X'],
  edges: { X: ['X'] },
};

const emptyGraph: DependencyGraphData = {
  nodes: [],
  edges: {},
};

describe('detectCycle', () => {
  it('returns null for acyclic graph', () => {
    expect(detectCycle(acyclicGraph)).toBeNull();
  });

  it('detects simple 3-node cycle', () => {
    const cycle = detectCycle(cyclicGraph);
    expect(cycle).not.toBeNull();
    expect(cycle!).toContain('A');
    expect(cycle!).toContain('B');
    expect(cycle!).toContain('C');
    expect(cycle![0]).toBe(cycle![cycle!.length - 1]);
  });

  it('detects self-loop', () => {
    const cycle = detectCycle(selfLoopGraph);
    expect(cycle).not.toBeNull();
    expect(cycle!.length).toBeGreaterThanOrEqual(2);
    expect(cycle![0]).toBe('X');
    expect(cycle![cycle!.length - 1]).toBe('X');
  });

  it('returns null for empty graph', () => {
    expect(detectCycle(emptyGraph)).toBeNull();
  });

  it('returns null for graph with isolated nodes', () => {
    expect(detectCycle({ nodes: ['A', 'B', 'C'], edges: {} })).toBeNull();
  });
});

describe('getCircularError', () => {
  it('formats error message for cyclic graph', () => {
    const msg = getCircularError(cyclicGraph);
    expect(msg).toContain('#CIRCULAR!');
    expect(msg).toContain(' -> ');
  });

  it('returns plain #CIRCULAR! for acyclic graph', () => {
    expect(getCircularError(acyclicGraph)).toBe('#CIRCULAR!');
  });
});

describe('topologicalSort', () => {
  it('returns valid topological order for acyclic graph', () => {
    const order = topologicalSort(acyclicGraph);
    expect(order).not.toBeNull();
    expect(order!.length).toBe(4);

    const idxA = order!.indexOf('A');
    const idxB = order!.indexOf('B');
    const idxC = order!.indexOf('C');
    const idxD = order!.indexOf('D');

    expect(idxA).toBeLessThan(idxB);
    expect(idxA).toBeLessThan(idxC);
    expect(idxB).toBeLessThan(idxC);
    expect(idxC).toBeLessThan(idxD);
  });

  it('returns null for cyclic graph', () => {
    expect(topologicalSort(cyclicGraph)).toBeNull();
  });

  it('returns single node for trivial graph', () => {
    const order = topologicalSort({ nodes: ['A'], edges: {} });
    expect(order).toEqual(['A']);
  });
});

describe('getRecalculationOrder', () => {
  it('returns affected cells in topological order', () => {
    const order = getRecalculationOrder(acyclicGraph, ['B']);
    expect(order).not.toContain('A');
    expect(order).toContain('B');
    expect(order).toContain('C');
    expect(order).toContain('D');
  });

  it('returns only changed cells if no downstream deps', () => {
    const order = getRecalculationOrder(acyclicGraph, ['A']);
    expect(order).toContain('A');
    expect(order).toContain('B');
    expect(order).toContain('C');
    expect(order).toContain('D');
  });

  it('returns empty array for empty changed cells', () => {
    const order = getRecalculationOrder(acyclicGraph, []);
    expect(order).toEqual([]);
  });
});
