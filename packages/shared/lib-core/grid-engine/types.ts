/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: تعريف جميع العقود والأنماط لنواة شبكة البيانات والجداول (Data Grid Engine Types)
 * 🏛️ الدور: نواة العقود (Contracts Core) لشبكة البيانات
 * 📥 المستهلك: cell-formula-engine, selection-model, format-engine, grid-core
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type-Driven Immutable Contracts & Zero-Dependency Model
 *    عقود نقية تضمن فصل منطق العرض عن البيانات وتوحيد هياكل الخلايا والصيغ.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. دعم القيم الفارغة (null/undefined) كخلايا صالحة بدون كسر الحسابات.
 *    2. تمييز الأخطاء الحسابية (FormulaError) ككائنات مميزة وليس كـ strings عادية.
 *    3. التوافق التام مع الثيم الفاتح النقي 100% في هياكل أنماط الخلايا (CellStyle).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards شاملة لتمييز الأنواع.
 *    - واجهات صارمة لبيانات النطاقات والإحداثيات.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'currency' | 'percent' | 'formula' | 'auto';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  width?: number;
  format?: string;
  formula?: string;
  hidden?: boolean;
  align?: 'left' | 'center' | 'right';
}

export type CellValue = string | number | boolean | null | undefined;

export class FormulaError {
  constructor(
    public readonly code: string,
    public readonly message: string = ''
  ) {}

  toString(): string {
    return this.code;
  }
}

export type Cell = CellValue | FormulaError;
export type Vec = Cell[];

export interface CellRef {
  row: number;
  col: number;
}

export interface GridRange {
  anchor: CellRef;
  head: CellRef;
}

export interface NormalizedBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  background?: string;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  border?: string;
}

export interface TableSheet {
  id: string;
  name: string;
  columns: Column[];
  rids: Array<[startRid: number, count: number]>;
  cellFormulas?: Map<string, string>;
  cellValues?: Map<string, CellValue>;
  cellStyles?: Map<string, CellStyle>;
  frozenRows?: number;
  frozenCols?: number;
}

export interface Patch {
  sheetId: string;
  type: 'cell-change' | 'col-resize' | 'row-add' | 'row-delete' | 'col-add' | 'col-delete' | 'reorder';
  target: { row?: number; col?: string | number; colId?: string };
  prevValue?: unknown;
  newValue?: unknown;
  timestamp: number;
}

export interface Store {
  getSheet(id: string): TableSheet | undefined;
  readCell(sheetId: string, row: number, colId: string | number): CellValue;
  writeCell(sheetId: string, row: number, colId: string | number, value: CellValue): void;
  applyPatch(patch: Patch): void;
  subscribe(listener: (patch: Patch) => void): () => void;
}

export interface GridHost {
  el: HTMLElement;
  store: Store;
  sheetId: string;
}

export const isFormulaError = (val: unknown): val is FormulaError => {
  return val instanceof FormulaError || (typeof val === 'object' && val !== null && 'code' in val && typeof (val as Record<string, unknown>).code === 'string');
};
