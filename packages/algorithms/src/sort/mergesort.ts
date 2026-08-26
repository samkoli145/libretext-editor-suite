/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mergesort.ts
 * 📂 المسار: packages/algorithms/src/sort/mergesort.ts
 * 🎯 الهدف الرئيسي: فرز المدمج التكراري المستقر + مقارن خلايا الجداول
 * 🏷️ المعرف: ALGO-SORT-001
 * ═══════════════════════════════════════════════════════════════════════════
 */

type CellValue = string | number | boolean | null | undefined;

export function compareCellValues(a: CellValue, b: CellValue): number {
  if (a === b) return 0;
  if (a == null || a === '') return 1;
  if (b == null || b === '') return -1;

  if (typeof a === 'number' && typeof b === 'number') return a - b;

  const numA = typeof a === 'string' ? Number(a) : NaN;
  const numB = typeof b === 'string' ? Number(b) : NaN;
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;

  return String(a).localeCompare(String(b));
}

function merge<T>(
  src: T[],
  aux: T[],
  lo: number,
  mid: number,
  hi: number,
  cmp: (a: T, b: T) => number,
): void {
  for (let k = lo; k <= hi; k++) aux[k] = src[k]!;

  let i = lo;
  let j = mid + 1;

  for (let k = lo; k <= hi; k++) {
    if (i > mid) {
      src[k] = aux[j++]!;
    } else if (j > hi) {
      src[k] = aux[i++]!;
    } else if (cmp(aux[i]!, aux[j]!) <= 0) {
      src[k] = aux[i++]!;
    } else {
      src[k] = aux[j++]!;
    }
  }
}

export function bottomUpMergeSort<T>(
  items: readonly T[],
  comparator: (a: T, b: T) => number = (a, b) => compareCellValues(a as CellValue, b as CellValue),
): T[] {
  const n = items.length;
  if (n <= 1) return [...items];

  const src: T[] = [...items];
  const aux: T[] = new Array(n);

  for (let sz = 1; sz < n; sz *= 2) {
    for (let lo = 0; lo < n - sz; lo += 2 * sz) {
      const mid = lo + sz - 1;
      const hi = Math.min(lo + 2 * sz - 1, n - 1);
      merge(src, aux, lo, mid, hi, comparator);
    }
  }

  return src;
}

interface ColumnSortSpec {
  columnIndex: number;
  direction: 'asc' | 'desc';
}

export function createTableColumnComparator(
  specs: ColumnSortSpec[],
): (a: readonly CellValue[], b: readonly CellValue[]) => number {
  return (a, b) => {
    for (const spec of specs) {
      const cmp = compareCellValues(a[spec.columnIndex], b[spec.columnIndex]);
      if (cmp !== 0) return spec.direction === 'asc' ? cmp : -cmp;
    }
    return 0;
  };
}
