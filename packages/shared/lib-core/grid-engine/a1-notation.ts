/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: معالجة وتحويل تدوين A1 (A1 Notation Engine) في الجداول والصيغ
 * 🏛️ الدور: محرك خوارزمي مشترك لتحليل العناوين والنطاقات ونقل المراجع
 * 📥 المستهلك: cell-formula-engine, selection-model, grid-core
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bijective Base-26 Column Math & Regex Tokenizer
 *    تحويل رياضي دقيق للأعمدة بنظام الأساس 26 مع معالجة المراجع المطلقة ($A$1) والنسبية.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. فهرسة الأعمدة تبدأ من 0 برمجياً ومن A بصرياً للمستخدم.
 *    2. حماية النطاقات الكبيرة جداً من التوسع اللانهائي (حد أقصى 100,000 خلية).
 *    3. معالجة علامة الخطأ `#REF!` عند حذف الصفوف أو الأعمدة المشار إليها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حراسة حدود المصفوفات والمصفوفات الفارغة.
 *    - منع الحلقات التكرارية وفحص صحة النصوص المدخلة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CellRef } from './types';

export const REF_ERR = '#REF!';
const MAX_EXPAND_CELLS = 100000;

export interface ParsedRef {
  row: number;
  col: number;
  absRow: boolean;
  absCol: boolean;
}

export interface CellRangeRef {
  from: CellRef;
  to?: CellRef;
}

/**
 * تحويل رقم العمود (0-indexed) إلى حروف (A, B, ..., Z, AA, AB, ...)
 */
export function colToLetters(colIndex: number): string {
  if (colIndex < 0) return '';
  let letters = '';
  let temp = colIndex;
  while (temp >= 0) {
    letters = String.fromCharCode(65 + (temp % 26)) + letters;
    temp = Math.floor(temp / 26) - 1;
  }
  return letters;
}

/**
 * تحويل حروف العمود (A, B, ..., Z, AA, ...) إلى رقم (0-indexed)
 */
export function lettersToCol(letters: string): number {
  if (!letters) return 0;
  const upper = letters.toUpperCase();
  let col = 0;
  for (let i = 0; i < upper.length; i++) {
    const code = upper.charCodeAt(i);
    if (code < 65 || code > 90) return 0;
    col = col * 26 + (code - 64);
  }
  return col - 1;
}

/**
 * تحليل تدوين الخلية مثل A1, $B$4, C$10 إلى إحداثيات ومراجع مطلقة
 */
export function parseA1(ref: string): ParsedRef | null {
  if (!ref || typeof ref !== 'string') return null;
  const match = ref.trim().match(/^(\$?)([A-Za-z]+)(\$?)([0-9]+)$/);
  if (!match) return null;

  const absCol = match[1] === '$';
  const colLetters = match[2];
  const absRow = match[3] === '$';
  const rowNumber = parseInt(match[4], 10);

  if (isNaN(rowNumber) || rowNumber < 1) return null;

  return {
    row: rowNumber - 1,
    col: lettersToCol(colLetters),
    absRow,
    absCol,
  };
}

/**
 * تنسيق الإحداثيات إلى تدوين A1
 */
export function formatRef(row: number, col: number, absRow = false, absCol = false): string {
  const colPart = (absCol ? '$' : '') + colToLetters(col);
  const rowPart = (absRow ? '$' : '') + (row + 1);
  return `${colPart}${rowPart}`;
}

/**
 * توسيع نطاق من الخلايا (Range Expansion)
 */
export function expandRange(range: { from: CellRef; to: CellRef }): CellRef[] | null {
  const minRow = Math.min(range.from.row, range.to.row);
  const maxRow = Math.max(range.from.row, range.to.row);
  const minCol = Math.min(range.from.col, range.to.col);
  const maxCol = Math.max(range.from.col, range.to.col);

  const totalCells = (maxRow - minRow + 1) * (maxCol - minCol + 1);
  if (totalCells > MAX_EXPAND_CELLS) {
    return null; // يتجاوز الحد المسموح
  }

  const result: CellRef[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      result.push({ row: r, col: c });
    }
  }
  return result;
}

/**
 * مسح واستبدال مراجع الخلايا داخل نص الصيغة بواسطة دالة تحويل مخصصة
 */
export function mapRefs(
  formula: string,
  transform: (ref: { from: CellRef; to?: CellRef; raw: string }) => string,
): string {
  if (!formula) return '';
  // regex لمطابقة النطاقات A1:B10 أو الخلايا الفردية A1 مع دعم $
  const refRegex = /(\$?)([A-Za-z]+)(\$?)([0-9]+)(?::(\$?)([A-Za-z]+)(\$?)([0-9]+))?/g;

  return formula.replace(refRegex, (raw, _d1, c1, _d2, r1, _d3, c2, _d4, r2) => {
    const parsed1 = parseA1(`${c1}${r1}`);
    if (!parsed1) return raw;

    if (c2 && r2) {
      const parsed2 = parseA1(`${c2}${r2}`);
      if (!parsed2) return raw;
      return transform({
        from: { row: parsed1.row, col: parsed1.col },
        to: { row: parsed2.row, col: parsed2.col },
        raw,
      });
    }

    return transform({
      from: { row: parsed1.row, col: parsed1.col },
      raw,
    });
  });
}

/**
 * نقل المراجع عند نسخ أو نقل الصيغة بإزاحة معينة (deltaRow, deltaCol)
 */
export function rewriteFormulaRefs(formula: string, deltaRow: number, deltaCol: number): string {
  if (!formula) return '';
  return mapRefs(formula, ({ from, to, raw }) => {
    const isSingle = !to;
    const p1 = parseA1(raw.split(':')[0]);
    if (!p1) return raw;

    const newR1 = p1.absRow ? from.row : from.row + deltaRow;
    const newC1 = p1.absCol ? from.col : from.col + deltaCol;

    if (newR1 < 0 || newC1 < 0) return REF_ERR;

    const ref1Str = formatRef(newR1, newC1, p1.absRow, p1.absCol);
    if (isSingle) return ref1Str;

    const p2 = parseA1(raw.split(':')[1]);
    if (!p2 || !to) return ref1Str;

    const newR2 = p2.absRow ? to.row : to.row + deltaRow;
    const newC2 = p2.absCol ? to.col : to.col + deltaCol;
    if (newR2 < 0 || newC2 < 0) return REF_ERR;

    const ref2Str = formatRef(newR2, newC2, p2.absRow, p2.absCol);
    return `${ref1Str}:${ref2Str}`;
  });
}

/**
 * تعديل المراجع عند إدراج أو حذف صفوف أو أعمدة في ورقة العمل
 */
export function shiftRefsForInsert(
  formula: string,
  type: 'row' | 'col',
  startIndex: number,
  count: number,
): string {
  if (!formula) return '';
  return mapRefs(formula, ({ from, to, raw }) => {
    const isSingle = !to;
    const shift = (pos: number) => {
      if (pos >= startIndex) {
        const next = pos + count;
        return next >= 0 ? next : -1;
      }
      return pos;
    };

    const newR1 = type === 'row' ? shift(from.row) : from.row;
    const newC1 = type === 'col' ? shift(from.col) : from.col;

    if (newR1 === -1 || newC1 === -1) return REF_ERR;

    const ref1 = formatRef(newR1, newC1);
    if (isSingle) return ref1;

    const newR2 = type === 'row' ? shift(to.row) : to.row;
    const newC2 = type === 'col' ? shift(to.col) : to.col;

    if (newR2 === -1 || newC2 === -1) return REF_ERR;
    const ref2 = formatRef(newR2, newC2);

    return `${ref1}:${ref2}`;
  });
}
