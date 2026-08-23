/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [mergesort.test.ts] اختبارات فرز المدمج التكراري المستقر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  bottomUpMergeSort,
  compareCellValues,
  createTableColumnComparator,
} from '../../src/sort/mergesort';

describe('compareCellValues', () => {
  it('returns 0 for identical values', () => {
    expect(compareCellValues(5, 5)).toBe(0);
    expect(compareCellValues('a', 'a')).toBe(0);
  });

  it('puts null/undefined/empty at end', () => {
    expect(compareCellValues(null, 1)).toBeGreaterThan(0);
    expect(compareCellValues(1, null)).toBeLessThan(0);
    expect(compareCellValues(undefined, 'x')).toBeGreaterThan(0);
    expect(compareCellValues('', 'x')).toBeGreaterThan(0);
  });

  it('compares numbers numerically', () => {
    expect(compareCellValues(3, 10)).toBeLessThan(0);
    expect(compareCellValues(10, 3)).toBeGreaterThan(0);
  });

  it('parses numeric strings', () => {
    expect(compareCellValues('3', '10')).toBeLessThan(0);
    expect(compareCellValues('10', '3')).toBeGreaterThan(0);
  });

  it('does not parse boolean as number', () => {
    expect(compareCellValues(true, false)).not.toBe(0);
  });
});

describe('bottomUpMergeSort', () => {
  it('returns empty array for empty input', () => {
    expect(bottomUpMergeSort([])).toEqual([]);
  });

  it('returns single element unchanged', () => {
    expect(bottomUpMergeSort([42])).toEqual([42]);
  });

  it('sorts numbers ascending', () => {
    expect(bottomUpMergeSort([5, 3, 1, 4, 2])).toEqual([1, 2, 3, 4, 5]);
  });

  it('sorts strings', () => {
    expect(bottomUpMergeSort(['banana', 'apple', 'cherry'])).toEqual([
      'apple',
      'banana',
      'cherry',
    ]);
  });

  it('is stable for equal elements', () => {
    const items = [
      { v: 1, o: 'a' },
      { v: 2, o: 'b' },
      { v: 1, o: 'c' },
      { v: 2, o: 'd' },
      { v: 1, o: 'e' },
    ];
    const sorted = bottomUpMergeSort(items, (a, b) => a.v - b.v);
    const ones = sorted.filter(x => x.v === 1);
    expect(ones.map(x => x.o)).toEqual(['a', 'c', 'e']);
  });

  it('sorts already sorted array', () => {
    expect(bottomUpMergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('sorts reverse sorted array', () => {
    expect(bottomUpMergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('createTableColumnComparator', () => {
  const data = [
    [3, 'banana'],
    [1, 'apple'],
    [2, 'cherry'],
    [1, 'avocado'],
  ];

  it('sorts by single column ascending', () => {
    const cmp = createTableColumnComparator([{ columnIndex: 0, direction: 'asc' }]);
    const sorted = [...data].sort(cmp);
    expect(sorted.map(r => r[0])).toEqual([1, 1, 2, 3]);
  });

  it('sorts by single column descending', () => {
    const cmp = createTableColumnComparator([{ columnIndex: 0, direction: 'desc' }]);
    const sorted = [...data].sort(cmp);
    expect(sorted.map(r => r[0])).toEqual([3, 2, 1, 1]);
  });

  it('sorts by multiple columns', () => {
    const cmp = createTableColumnComparator([
      { columnIndex: 0, direction: 'asc' },
      { columnIndex: 1, direction: 'asc' },
    ]);
    const sorted = [...data].sort(cmp);
    expect(sorted[0]).toEqual([1, 'apple']);
    expect(sorted[1]).toEqual([1, 'avocado']);
  });

  it('returns 0 for equal rows', () => {
    const cmp = createTableColumnComparator([{ columnIndex: 0, direction: 'asc' }]);
    expect(cmp([1, 'a'], [1, 'b'])).toBe(0);
  });
});
