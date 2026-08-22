/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الصيغ الخلوية وحساب التبعيات (Per-Cell Formula Engine & Dependency Graph)
 * 🏛️ الدور: نواة معالجة الصيغ الخلوية والترتيب الطوبولوجي
 * 📥 المستهلك: grid-core, TableSheet runtime
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Kahn's Topological Sorting with IndexedQueue & Numeric Fast Keys
 *    محرك طوبولوجي فائق السرعة O(1) dequeue لكشف الدورات التكرارية (#CYCLE!)
 *    وحساب التبعيات المعقدة بدون أي تأخير زمني.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كشف الدورات التكرارية وإسناد `#CYCLE!` لجميع الخلايا المشاركة فيها فوراً.
 *    2. تنظيف الذاكرة (Memory Cleanup) وإدارة LRU Cache للتبعيات.
 *    3. التوافق مع تدوين A1 والمراجع النسبية والمطلقة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص حدود المصفوفات (Max 16384 أعمدة x 1048576 صفوف).
 *    - Type Guards لتمييز الأخطاء والقيم الناتجة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { FormulaError, isFormulaError, type Cell, type CellRef, type CellValue } from './types';
import { expandRange, formatRef, mapRefs, parseA1, rewriteFormulaRefs, shiftRefsForInsert, REF_ERR } from './a1-notation';
import { evaluateExpression, type EvalContext } from './formula-evaluator';

const MAX_COLS = 16384;
const MAX_ROWS = 1048576;
const MAX_CACHE_SIZE = 1000;

/**
 * طابور مفهرس سريع O(1) dequeue لتجنب كلفة Array.shift() الباهظة O(N)
 */
export class IndexedQueue<T> {
  private items: T[] = [];
  private head = 0;

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.head >= this.items.length) return undefined;
    const item = this.items[this.head];
    this.head++;
    return item;
  }

  peek(): T | undefined {
    return this.head < this.items.length ? this.items[this.head] : undefined;
  }

  get size(): number {
    return Math.max(0, this.items.length - this.head);
  }

  isEmpty(): boolean {
    return this.head >= this.items.length;
  }

  clear(): void {
    this.items = [];
    this.head = 0;
  }
}

/**
 * تحويل (row, col) إلى مفتاح رقمي فريد وسريع
 */
export const cellKey = (row: number, col: number): string => {
  if (row < 0 || col < 0 || row >= MAX_ROWS || col >= MAX_COLS) {
    throw new Error(`Invalid cell position: row=${row}, col=${col}`);
  }
  const key = row * MAX_COLS + col;
  return String(key);
};

/**
 * استخراج (row, col) من المفتاح الرقمي
 */
export const cellFromKey = (key: string): { row: number; col: number } => {
  const numKey = Number(key);
  if (!Number.isFinite(numKey) || numKey < 0) {
    throw new Error(`Invalid cell key: ${key}`);
  }
  return {
    row: Math.floor(numKey / MAX_COLS),
    col: numKey % MAX_COLS,
  };
};

export interface CellSource {
  rows: number;
  cols: number;
  formulaAt(row: number, col: number): string | undefined;
  valueAt(row: number, col: number): Cell;
}

export interface CellRecalc {
  values: Map<string, Cell>;
  cycles: string[];
  order: string[];
}

export interface Dep {
  name: string;
  cells: CellRef[];
  tooBig?: boolean;
  dead?: boolean;
}

const depCache = new Map<string, CellRef[]>();

export const isFormula = (v: unknown): boolean => {
  return typeof v === 'string' && v.length > 1 && v.startsWith('=');
};

export const formulaBody = (src: string): string => {
  if (!src) return '';
  return src.startsWith('=') ? src.slice(1) : src;
};

/**
 * ربط المراجع داخل الصيغة بأسماء مؤقتة واستخراج التبعيات
 */
export function bindRefs(src: string): { expr: string; deps: Dep[] } {
  if (!src || typeof src !== 'string') {
    throw new Error('Formula source must be a non-empty string');
  }
  const body = formulaBody(src);
  if (!body.trim()) {
    throw new Error('Formula body is empty');
  }

  const deps: Dep[] = [];
  const expr = mapRefs(body, (u) => {
    const name = `_a1_${deps.length}`;
    if (!u.to) {
      deps.push({ name, cells: [u.from] });
      return name;
    }
    const cells = expandRange({ from: u.from, to: u.to });
    deps.push(cells === null ? { name, cells: [], tooBig: true } : { name, cells });
    return name;
  });

  return {
    expr,
    deps: src.includes(REF_ERR) ? [{ name: '', cells: [], dead: true }] : deps,
  };
}

/**
 * استخراج تبعيات الصيغة مع كاش LRU
 */
export const cellDeps = (src: string): CellRef[] => {
  if (!src) return [];
  if (depCache.has(src)) {
    return depCache.get(src)!;
  }
  const deps = bindRefs(src).deps.flatMap((d) => d.cells);
  if (depCache.size >= MAX_CACHE_SIZE) {
    const firstKey = depCache.keys().next().value;
    if (firstKey !== undefined) depCache.delete(firstKey);
  }
  depCache.set(src, deps);
  return deps;
};

/**
 * تقييم صيغة لخلية واحدة مع دالة قراءة المراجع
 */
export function evalCell(
  src: string,
  read: (r: CellRef) => Cell,
  opts: { now?: Date } = {}
): Cell {
  try {
    const { expr, deps } = bindRefs(src);
    for (const d of deps) {
      if (d.dead) return new FormulaError(REF_ERR, 'The referenced cell was deleted');
      if (d.tooBig) return new FormulaError('#VALUE!', 'The range covers too many cells');
    }

    const varMap = new Map<string, Cell | Cell[]>();
    for (const d of deps) {
      if (d.cells.length === 1) {
        varMap.set(d.name, read(d.cells[0]));
      } else {
        varMap.set(d.name, d.cells.map((c) => read(c)));
      }
    }

    const ctx: EvalContext = {
      resolveVar: (name: string) => varMap.get(name) ?? null,
      now: opts.now,
    };

    return evaluateExpression(expr, ctx);
  } catch (err) {
    if (isFormulaError(err)) return err;
    return new FormulaError('#ERROR!', String(err));
  }
}

/**
 * خوارزمية Kahn لإعادة حساب جميع خلايا الورقة بالترتيب الطوبولوجي وكشف الحلقات
 */
export function recalcCells(source: CellSource, opts: { now?: Date } = {}): CellRecalc {
  const formulas = new Map<string, string>();
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>(); // key -> list of cells that depend on it

  // 1. تجميع كل الصيغ
  for (let r = 0; r < source.rows; r++) {
    for (let c = 0; c < source.cols; c++) {
      const f = source.formulaAt(r, c);
      if (f && isFormula(f)) {
        const k = cellKey(r, c);
        formulas.set(k, f);
        inDegree.set(k, 0);
      }
    }
  }

  // 2. بناء الرسم البياني للتبعيات (Dependency Graph)
  for (const [k, src] of formulas) {
    const deps = cellDeps(src);
    let deg = 0;
    for (const d of deps) {
      if (d.row >= 0 && d.row < source.rows && d.col >= 0 && d.col < source.cols) {
        const depKey = cellKey(d.row, d.col);
        if (formulas.has(depKey)) {
          deg++;
          const list = dependents.get(depKey) ?? [];
          list.push(k);
          dependents.set(depKey, list);
        }
      }
    }
    inDegree.set(k, deg);
  }

  // 3. خوارزمية Kahn باستخدام IndexedQueue
  const queue = new IndexedQueue<string>();
  for (const [k, deg] of inDegree) {
    if (deg === 0) {
      queue.enqueue(k);
    }
  }

  const order: string[] = [];
  const computedValues = new Map<string, Cell>();

  const readValue = (ref: CellRef): Cell => {
    const k = cellKey(ref.row, ref.col);
    if (computedValues.has(k)) {
      return computedValues.get(k)!;
    }
    return source.valueAt(ref.row, ref.col);
  };

  while (!queue.isEmpty()) {
    const curr = queue.dequeue()!;
    order.push(curr);

    const f = formulas.get(curr)!;
    const computed = evalCell(f, readValue, opts);
    computedValues.set(curr, computed);

    const depsList = dependents.get(curr) ?? [];
    for (const next of depsList) {
      const remaining = (inDegree.get(next) ?? 1) - 1;
      inDegree.set(next, remaining);
      if (remaining === 0) {
        queue.enqueue(next);
      }
    }
  }

  // 4. كشف الدورات والحلقات التكرارية (Cycles)
  const cycles: string[] = [];
  if (order.length < formulas.size) {
    for (const [k] of formulas) {
      if (!computedValues.has(k)) {
        cycles.push(k);
        computedValues.set(k, new FormulaError('#CYCLE!', 'Circular reference detected'));
      }
    }
  }

  return {
    values: computedValues,
    cycles,
    order,
  };
}

/**
 * نقل وترجمة صيغة خلية عند النسخ بإزاحة معينة
 */
export function translateCellFormula(src: string, deltaRow: number, deltaCol: number): string {
  if (!isFormula(src)) return src;
  const body = formulaBody(src);
  const rewritten = rewriteFormulaRefs(body, deltaRow, deltaCol);
  return `=${rewritten}`;
}

/**
 * تعديل جميع صيغ الورقة عند إدراج أو حذف صفوف أو أعمدة
 */
export function shiftSheetFormulas(
  formulas: Map<string, string>,
  type: 'row' | 'col',
  startIndex: number,
  count: number
): Map<string, string> {
  const result = new Map<string, string>();
  for (const [key, formula] of formulas) {
    const { row, col } = cellFromKey(key);
    let newRow = row;
    let newCol = col;

    if (type === 'row' && row >= startIndex) {
      newRow = row + count;
    } else if (type === 'col' && col >= startIndex) {
      newCol = col + count;
    }

    if (newRow >= 0 && newCol >= 0 && newRow < MAX_ROWS && newCol < MAX_COLS) {
      const shiftedFormulaBody = shiftRefsForInsert(formulaBody(formula), type, startIndex, count);
      result.set(cellKey(newRow, newCol), `=${shiftedFormulaBody}`);
    }
  }
  return result;
}
