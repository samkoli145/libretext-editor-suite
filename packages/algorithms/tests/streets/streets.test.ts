/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [streets.test.ts] اختبارات بحث الأسماء والتشابه والفرز المتعدد المستويات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  calculateLevenshteinDistance,
  calculateStringSimilarity,
  analyzeDuplicateStreetNames,
  findSimilarStreetPairs,
} from '../../src/streets/similarity';
import {
  queryCityStreets,
  sortCityStreets,
  buildStreetBranchingTree,
} from '../../src/streets/search-engine';
import type { CityStreet } from '../../src/streets/types';

const streetA: CityStreet = {
  id: '1',
  name: 'شارع فيصل',
  neighborhood: 'المعادي',
  region: 'القاهرة',
  branchedFrom: 'شارع 9',
  landmarks: 'جسر المعادي',
  description: 'شارع رئيسي',
  streetType: 'شارع رئيسي',
  status: 'نشط تجاري',
  notes: '',
  updatedAt: '2026-01-01',
};

const streetB: CityStreet = {
  id: '2',
  name: 'شارع فيصل',
  neighborhood: 'حلوان',
  region: 'القاهرة',
  branchedFrom: 'شارع فيصل',
  landmarks: '',
  description: 'تفرع',
  streetType: 'شارع فرعي',
  status: 'سكني هادئ',
  notes: '',
  updatedAt: '2026-01-01',
};

const streetC: CityStreet = {
  id: '3',
  name: 'شارع النصر',
  neighborhood: 'المعادي',
  region: 'القاهرة',
  branchedFrom: '',
  landmarks: 'مسجد',
  description: '',
  streetType: 'شريان رئيسي',
  status: 'كثافة مرورية عالية',
  notes: 'م่วน',
  updatedAt: '2026-02-01',
};

describe('calculateLevenshteinDistance', () => {
  it('returns 0 for identical strings', () => {
    expect(calculateLevenshteinDistance('hello', 'hello')).toBe(0);
  });

  it('calculates correct distance', () => {
    expect(calculateLevenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('handles empty strings', () => {
    expect(calculateLevenshteinDistance('', 'abc')).toBe(3);
    expect(calculateLevenshteinDistance('abc', '')).toBe(3);
    expect(calculateLevenshteinDistance('', '')).toBe(0);
  });
});

describe('calculateStringSimilarity', () => {
  it('returns 1.0 for identical strings', () => {
    expect(calculateStringSimilarity('same', 'same')).toBe(1.0);
  });

  it('returns close to 1 for very similar strings', () => {
    const score = calculateStringSimilarity('شارع', 'شارعه');
    expect(score).toBeGreaterThan(0.7);
  });

  it('returns low score for very different strings', () => {
    const score = calculateStringSimilarity('abc', 'xyz');
    expect(score).toBeLessThan(0.5);
  });
});

describe('analyzeDuplicateStreetNames', () => {
  it('detects duplicate names', () => {
    const reports = analyzeDuplicateStreetNames([streetA, streetB]);
    expect(reports.length).toBe(1);
    expect(reports[0].count).toBe(2);
    expect(reports[0].occurrences.length).toBe(2);
  });

  it('returns empty for unique names', () => {
    expect(analyzeDuplicateStreetNames([streetA, streetC])).toEqual([]);
  });

  it('returns empty for empty input', () => {
    expect(analyzeDuplicateStreetNames([])).toEqual([]);
  });
});

describe('findSimilarStreetPairs', () => {
  it('finds identical names', () => {
    const matches = findSimilarStreetPairs([streetA, streetB], 0.9);
    expect(matches.length).toBe(1);
    expect(matches[0].matchType).toBe('تطابق تام');
    expect(matches[0].score).toBe(1.0);
  });

  it('returns empty for different names below threshold', () => {
    const matches = findSimilarStreetPairs([streetA, streetC], 0.9);
    expect(matches.length).toBe(0);
  });
});

describe('queryCityStreets', () => {
  const streets = [streetA, streetB, streetC];

  it('returns all streets with empty filter', () => {
    expect(queryCityStreets(streets, {}).length).toBe(3);
  });

  it('filters by text query', () => {
    const result = queryCityStreets(streets, { textQuery: 'فيصل' });
    expect(result.length).toBe(2);
  });

  it('filters by neighborhood', () => {
    const result = queryCityStreets(streets, { neighborhood: 'حلوان' });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by street type', () => {
    const result = queryCityStreets(streets, { streetType: 'شريان رئيسي' });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('3');
  });
});

describe('sortCityStreets', () => {
  const streets = [streetC, streetA, streetB];

  it('sorts by neighborhood ascending', () => {
    const sorted = sortCityStreets(streets, {
      primaryField: 'neighborhood',
      direction: 'asc',
    });
    expect(sorted[0].neighborhood).toBe('المعادي');
  });

  it('sorts by neighborhood descending', () => {
    const sorted = sortCityStreets(streets, {
      primaryField: 'neighborhood',
      direction: 'desc',
    });
    expect(sorted[0].neighborhood).toBe('حلوان');
  });

  it('sorts by secondary field when primary equal', () => {
    const s1: CityStreet = { ...streetA, id: '10', neighborhood: 'abc' };
    const s2: CityStreet = { ...streetA, id: '11', neighborhood: 'xyz' };
    const sorted = sortCityStreets([s2, s1], {
      primaryField: 'name',
      secondaryField: 'neighborhood',
      direction: 'asc',
    });
    expect(sorted[0].neighborhood).toBe('abc');
  });
});

describe('buildStreetBranchingTree', () => {
  it('groups streets by branchedFrom', () => {
    const tree = buildStreetBranchingTree([streetA, streetB, streetC]);
    expect(tree['شارع 9']).toBeDefined();
    expect(tree['شارع فيصل']).toBeDefined();
    expect(tree['شوارع رئيسية ومباشرة']).toBeDefined();
  });

  it('returns empty object for empty input', () => {
    expect(buildStreetBranchingTree([])).toEqual({});
  });
});
