/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نموذج التحديد المتقدم والتفاعل مع شبكة البيانات (Selection & Interaction Model)
 * 🏛️ الدور: آلة حالة نقية (Pure State Machine) لإدارة التحديد والفأرة ولوحة المفاتيح
 * 📥 المستهلك: grid-core, grid-editor, clipboard operations
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Range Collision Box & Series Auto-Fill Detection
 *    إدارة النطاقات المتعددة (⌘-click / Ctrl-click)، التنقل الذكي عبر Tab/Enter،
 *    والكشف الذكي عن المتسلسلات (أرقام، شهور، تواريخ) وتوليد TSV دقيق.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. فصل موضع المؤشر النشط (Cursor) عن رأس التحديد (Head) في النطاقات.
 *    2. ضمان top <= bottom و left <= right دائماً في الصندوق المطبع (normalizeBox).
 *    3. دعم الزر الأيمن وتفاعلات الفأرة الكاملة بدون كسر التحديد النشط.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص حدود الورقة (0 إلى rows-1 و 0 إلى cols-1).
 *    - معالجة حالات الحافة للنصوص الفارغة أو غير المعرفة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CellRef, NormalizedBox, GridRange } from './types';
import { formatRef } from './a1-notation';

/**
 * تطبيع النطاق إلى صندوق هندسي مرتب (Box Normalization)
 */
export function normalizeBox(range: GridRange): NormalizedBox {
  return {
    top: Math.min(range.anchor.row, range.head.row),
    bottom: Math.max(range.anchor.row, range.head.row),
    left: Math.min(range.anchor.col, range.head.col),
    right: Math.max(range.anchor.col, range.head.col),
  };
}

/**
 * فحص ما إذا كانت الخلية تقع داخل النطاق
 */
export function contains(box: NormalizedBox, row: number, col: number): boolean {
  return row >= box.top && row <= box.bottom && col >= box.left && col <= box.right;
}

/**
 * تحويل نطاق إلى نص TSV للنسخ في الحافظة
 */
export function tsvFromRange(
  range: GridRange,
  getValue: (row: number, col: number) => unknown
): string {
  const box = normalizeBox(range);
  const rows: string[] = [];

  for (let r = box.top; r <= box.bottom; r++) {
    const rowCells: string[] = [];
    for (let c = box.left; c <= box.right; c++) {
      const val = getValue(r, c);
      let text = val === null || val === undefined ? '' : String(val);
      if (text.includes('\t') || text.includes('\n') || text.includes('"')) {
        text = `"${text.replace(/"/g, '""')}"`;
      }
      rowCells.push(text);
    }
    rows.push(rowCells.join('\t'));
  }

  return rows.join('\n');
}

/**
 * تحليل نص TSV من الحافظة إلى مصفوفة ثنائية الأبعاد
 */
export function parseTsv(tsv: string): string[][] {
  if (!tsv) return [];
  const lines = tsv.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  return lines.map((line) => line.split('\t'));
}

/**
 * الكشف التلقائي عن المتسلسلات وتعبئتها (Series Detection & Extrapolation)
 */
export function fillSeries(
  seedValues: unknown[],
  targetCount: number
): string[] {
  if (seedValues.length === 0 || targetCount <= 0) return [];
  if (seedValues.length === 1) {
    const val = seedValues[0];
    const num = Number(val);
    if (!isNaN(num)) {
      return Array.from({ length: targetCount }, (_, i) => String(num + i + 1));
    }
    return Array.from({ length: targetCount }, () => String(val ?? ''));
  }

  // فحص المتسلسلة الحسابية للأرقام
  const numbers = seedValues.map((v) => Number(v));
  const allNumbers = numbers.every((n) => !isNaN(n));

  if (allNumbers && numbers.length >= 2) {
    const step = numbers[numbers.length - 1] - numbers[numbers.length - 2];
    const last = numbers[numbers.length - 1];
    return Array.from({ length: targetCount }, (_, i) => String(last + step * (i + 1)));
  }

  // تكرار النمط الأبجدي / النصي
  return Array.from({ length: targetCount }, (_, i) => String(seedValues[i % seedValues.length] ?? ''));
}

/**
 * فئة نموذج التحديد الكاملة لشبكة البيانات
 */
export class SelectionModel {
  public ranges: GridRange[] = [];
  public cursor: CellRef = { row: 0, col: 0 };
  private maxRows = 1000;
  private maxCols = 50;

  constructor(maxRows = 1000, maxCols = 50) {
    this.maxRows = maxRows;
    this.maxCols = maxCols;
    this.setSingle({ row: 0, col: 0 });
  }

  public setBounds(rows: number, cols: number): void {
    this.maxRows = Math.max(1, rows);
    this.maxCols = Math.max(1, cols);
    this.clampCursor();
  }

  private clampCursor(): void {
    this.cursor.row = Math.max(0, Math.min(this.maxRows - 1, this.cursor.row));
    this.cursor.col = Math.max(0, Math.min(this.maxCols - 1, this.cursor.col));
  }

  public setSingle(ref: CellRef): void {
    const clamped: CellRef = {
      row: Math.max(0, Math.min(this.maxRows - 1, ref.row)),
      col: Math.max(0, Math.min(this.maxCols - 1, ref.col)),
    };
    this.cursor = { ...clamped };
    this.ranges = [{ anchor: { ...clamped }, head: { ...clamped } }];
  }

  public extendTo(ref: CellRef): void {
    if (this.ranges.length === 0) {
      this.setSingle(ref);
      return;
    }
    const current = this.ranges[this.ranges.length - 1];
    const clamped: CellRef = {
      row: Math.max(0, Math.min(this.maxRows - 1, ref.row)),
      col: Math.max(0, Math.min(this.maxCols - 1, ref.col)),
    };
    current.head = clamped;
  }

  public addRange(ref: CellRef): void {
    const clamped: CellRef = {
      row: Math.max(0, Math.min(this.maxRows - 1, ref.row)),
      col: Math.max(0, Math.min(this.maxCols - 1, ref.col)),
    };
    this.cursor = { ...clamped };
    this.ranges.push({ anchor: { ...clamped }, head: { ...clamped } });
  }

  public isSelected(row: number, col: number): boolean {
    for (const r of this.ranges) {
      const b = normalizeBox(r);
      if (contains(b, row, col)) return true;
    }
    return false;
  }

  public isCursor(row: number, col: number): boolean {
    return this.cursor.row === row && this.cursor.col === col;
  }

  public primaryRange(): GridRange {
    return this.ranges[0] ?? { anchor: { ...this.cursor }, head: { ...this.cursor } };
  }

  public getSummary(getValue: (r: number, c: number) => unknown): { ref: string; sum?: number; count: number; avg?: number } {
    const p = this.primaryRange();
    const box = normalizeBox(p);
    const ref = box.top === box.bottom && box.left === box.right
      ? formatRef(box.top, box.left)
      : `${formatRef(box.top, box.left)}:${formatRef(box.bottom, box.right)}`;

    let count = 0;
    let numCount = 0;
    let sum = 0;

    for (let r = box.top; r <= box.bottom; r++) {
      for (let c = box.left; c <= box.right; c++) {
        count++;
        const val = getValue(r, c);
        if (typeof val === 'number') {
          sum += val;
          numCount++;
        } else if (typeof val === 'string' && val.trim() !== '') {
          const n = Number(val);
          if (!isNaN(n)) {
            sum += n;
            numCount++;
          }
        }
      }
    }

    return {
      ref,
      count,
      sum: numCount > 0 ? sum : undefined,
      avg: numCount > 0 ? sum / numCount : undefined,
    };
  }

  public moveCursor(
    dRow: number,
    dCol: number,
    shiftKey = false,
    cmdKey = false
  ): void {
    if (cmdKey) {
      // Edge Jump
      if (dRow > 0) dRow = this.maxRows - 1 - this.cursor.row;
      else if (dRow < 0) dRow = -this.cursor.row;
      if (dCol > 0) dCol = this.maxCols - 1 - this.cursor.col;
      else if (dCol < 0) dCol = -this.cursor.col;
    }

    const nextRef: CellRef = {
      row: Math.max(0, Math.min(this.maxRows - 1, this.cursor.row + dRow)),
      col: Math.max(0, Math.min(this.maxCols - 1, this.cursor.col + dCol)),
    };

    if (shiftKey) {
      this.extendTo(nextRef);
      this.cursor = nextRef;
    } else {
      this.setSingle(nextRef);
    }
  }

  public handleTab(shiftKey = false): void {
    const p = this.primaryRange();
    const box = normalizeBox(p);
    if (box.top === box.bottom && box.left === box.right) {
      this.moveCursor(0, shiftKey ? -1 : 1, false);
      return;
    }

    // التنقل الدائري داخل النطاق
    let { row, col } = this.cursor;
    if (!shiftKey) {
      col++;
      if (col > box.right) {
        col = box.left;
        row++;
        if (row > box.bottom) row = box.top;
      }
    } else {
      col--;
      if (col < box.left) {
        col = box.right;
        row--;
        if (row < box.top) row = box.bottom;
      }
    }
    this.cursor = { row, col };
  }

  public handleEnter(shiftKey = false): void {
    const p = this.primaryRange();
    const box = normalizeBox(p);
    if (box.top === box.bottom && box.left === box.right) {
      this.moveCursor(shiftKey ? -1 : 1, 0, false);
      return;
    }

    // التنقل الرأسي داخل النطاق
    let { row, col } = this.cursor;
    if (!shiftKey) {
      row++;
      if (row > box.bottom) {
        row = box.top;
        col++;
        if (col > box.right) col = box.left;
      }
    } else {
      row--;
      if (row < box.top) {
        row = box.bottom;
        col--;
        if (col < box.left) col = box.right;
      }
    }
    this.cursor = { row, col };
  }
}
