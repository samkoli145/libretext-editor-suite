/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [disjoint-set.test.ts] اختبارات Union-Find — الدمج، الاتصال، ضغط المسار
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { DisjointSet } from '../../src/structure/disjoint-set';

describe('DisjointSet', () => {
  it('makeSet creates a single-element set', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    expect(ds.find('A')).toBe('A');
  });

  it('makeSet is idempotent', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    ds.makeSet('A');
    expect(ds.find('A')).toBe('A');
  });

  it('two separate sets are not connected', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    ds.makeSet('B');
    expect(ds.connected('A', 'B')).toBe(false);
  });

  it('union merges two sets', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    ds.makeSet('B');
    ds.union('A', 'B');
    expect(ds.connected('A', 'B')).toBe(true);
  });

  it('union returns the primary root', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    ds.makeSet('B');
    const root = ds.union('A', 'B');
    expect(root).toBe(ds.find('A'));
    expect(root).toBe(ds.find('B'));
  });

  it('union is idempotent', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    ds.makeSet('B');
    ds.union('A', 'B');
    ds.union('A', 'B');
    expect(ds.connected('A', 'B')).toBe(true);
  });

  it('transitive connectivity', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    ds.makeSet('B');
    ds.makeSet('C');
    ds.union('A', 'B');
    ds.union('B', 'C');
    expect(ds.connected('A', 'C')).toBe(true);
  });

  it('find auto-creates missing keys', () => {
    const ds = new DisjointSet();
    const root = ds.find('X');
    expect(root).toBe('X');
  });

  it('mergeRange merges a rectangular range of cells', () => {
    const ds = new DisjointSet();
    const root = ds.mergeRange(0, 0, 1, 1);
    expect(ds.connected('0:0', '1:1')).toBe(true);
    expect(ds.connected('0:0', '0:1')).toBe(true);
    expect(ds.connected('0:0', '1:0')).toBe(true);
    expect(root).toBe(ds.find('0:0'));
  });

  it('getMergedBounds returns correct bounds for merged range', () => {
    const ds = new DisjointSet();
    ds.mergeRange(1, 2, 3, 4);
    const bounds = ds.getMergedBounds('1:2');
    expect(bounds).not.toBeNull();
    expect(bounds!.minRow).toBe(1);
    expect(bounds!.maxRow).toBe(3);
    expect(bounds!.minCol).toBe(2);
    expect(bounds!.maxCol).toBe(4);
    expect(bounds!.rowSpan).toBe(3);
    expect(bounds!.colSpan).toBe(3);
  });

  it('getMergedBounds returns null for single element', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    expect(ds.getMergedBounds('A')).toBeNull();
  });

  it('unmerge splits a set back into singletons', () => {
    const ds = new DisjointSet();
    ds.union('A', 'B');
    ds.union('B', 'C');
    ds.unmerge('A');
    expect(ds.connected('A', 'B')).toBe(false);
    expect(ds.connected('B', 'C')).toBe(false);
  });

  it('clear removes all sets', () => {
    const ds = new DisjointSet();
    ds.makeSet('A');
    ds.makeSet('B');
    ds.union('A', 'B');
    ds.clear();
    expect(ds.find('A')).toBe('A');
    expect(ds.connected('A', 'B')).toBe(false);
  });

  it('getAllMergedClusters returns only multi-member clusters', () => {
    const ds = new DisjointSet();
    ds.makeSet('lonely');
    ds.mergeRange(0, 0, 0, 1);
    const clusters = ds.getAllMergedClusters();
    expect(clusters.length).toBe(1);
    expect(clusters[0].cellKeys.length).toBe(2);
  });
});
