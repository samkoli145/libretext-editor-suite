/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [hlookup.test.ts] اختبارات دالة البحث الأفقي HLOOKUP
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  HLOOKUP,
  compareValues,
  exactSearchRow,
  binarySearchRow,
} from '../../src/lookup/hlookup';

const sampleTable: readonly (readonly unknown[])[] = [
  ['Name', 'Alice', 'Bob', 'Charlie', 'David'],
  ['Age', 25, 30, 35, 40],
  ['Score', 90, 85, 95, 80],
];

describe('HLOOKUP exact search', () => {
  it('finds exact match in first row and returns from target row', () => {
    expect(HLOOKUP('Bob', sampleTable, 2)).toBe(30);
  });

  it('returns first row value', () => {
    expect(HLOOKUP('Alice', sampleTable, 1)).toBe('Alice');
  });

  it('returns third row value', () => {
    expect(HLOOKUP('Charlie', sampleTable, 3)).toBe(95);
  });

  it('returns #N/A for non-existent value', () => {
    expect(HLOOKUP('Zara', sampleTable, 2)).toBe('#N/A');
  });

  it('returns #REF! for invalid row index (0)', () => {
    expect(HLOOKUP('Alice', sampleTable, 0)).toBe('#REF!');
  });

  it('returns #REF! for row index exceeding table', () => {
    expect(HLOOKUP('Alice', sampleTable, 5)).toBe('#REF!');
  });

  it('returns #N/A for empty table', () => {
    expect(HLOOKUP('x', [], 1)).toBe('#N/A');
  });

  it('returns #N/A for table with empty first row', () => {
    expect(HLOOKUP('x', [[], [1, 2]], 1)).toBe('#N/A');
  });
});

describe('HLOOKUP approximate search', () => {
  const numericTable: readonly (readonly unknown[])[] = [
    [10, 20, 30, 40],
    ['a', 'b', 'c', 'd'],
  ];

  it('finds exact match in approximate mode', () => {
    expect(HLOOKUP(30, numericTable, 2, true)).toBe('c');
  });

  it('finds closest smaller value', () => {
    expect(HLOOKUP(25, numericTable, 2, true)).toBe('b');
  });

  it('returns -1 if smaller than all values in binary search', () => {
    expect(binarySearchRow([10, 20, 30, 40], 5)).toBe(-1);
  });
});

describe('compareValues', () => {
  it('returns 0 for identical values', () => {
    expect(compareValues(5, 5)).toBe(0);
    expect(compareValues('a', 'a')).toBe(0);
  });

  it('null < defined', () => {
    expect(compareValues(null, 1)).toBeLessThan(0);
    expect(compareValues(1, null)).toBeGreaterThan(0);
  });

  it('undefined < defined', () => {
    expect(compareValues(undefined, 'x')).toBeLessThan(0);
  });

  it('compares numbers', () => {
    expect(compareValues(1, 2)).toBeLessThan(0);
    expect(compareValues(2, 1)).toBeGreaterThan(0);
  });

  it('compares strings with locale', () => {
    expect(compareValues('apple', 'banana')).toBeLessThan(0);
  });

  it('compares dates', () => {
    const d1 = new Date('2020-01-01');
    const d2 = new Date('2021-01-01');
    expect(compareValues(d1, d2)).toBeLessThan(0);
  });

  it('compares booleans', () => {
    expect(compareValues(false, true)).toBeLessThan(0);
    expect(compareValues(true, true)).toBe(0);
  });

  it('NaN equals NaN', () => {
    expect(compareValues(NaN, NaN)).toBe(0);
  });
});

describe('exactSearchRow', () => {
  it('returns index of exact match', () => {
    expect(exactSearchRow(['a', 'b', 'c'], 'b')).toBe(1);
  });

  it('returns -1 if not found', () => {
    expect(exactSearchRow(['a', 'b'], 'z')).toBe(-1);
  });

  it('finds first occurrence', () => {
    expect(exactSearchRow(['x', 'y', 'x'], 'x')).toBe(0);
  });
});

describe('binarySearchRow', () => {
  it('finds exact match', () => {
    expect(binarySearchRow([10, 20, 30, 40], 30)).toBe(2);
  });

  it('finds closest smaller value', () => {
    expect(binarySearchRow([10, 20, 30, 40], 25)).toBe(1);
  });

  it('returns -1 for empty row', () => {
    expect(binarySearchRow([], 1)).toBe(-1);
  });

  it('finds first element', () => {
    expect(binarySearchRow([10, 20, 30], 10)).toBe(0);
  });

  it('finds last element', () => {
    expect(binarySearchRow([10, 20, 30], 30)).toBe(2);
  });
});
