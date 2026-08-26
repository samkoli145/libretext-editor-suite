/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: cell-block.ts
 * 📂 المسار: src/blocks/cell-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك خلية الجداول الحسابية الذكية لنطاق Calc
 * 📋 المعايير: دعم تدوين A1، تخزين الصيغ الحسابية، تتبع الأخطاء وتنسيق الأرقام
 * 🧪 الاختبارات: التحقق من صحة عنوان الخلية والتحويلات الرياضية
 * 🏷️ المعرف: BLK-CALC-CELL
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    A1-Indexed Cell Node + Formula/Value Dual State + Type-Safe Formatter
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ضمان اتساق row/col مع address (مثل row=1, col=1 -> 'A1').
 *    2. حظر القيم غير المعرفة (undefined) في computedValue واستبدالها بـ null.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - دالة formatAddress للتحويل الآمن.
 *    - Type Guard (isCellBlock).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - indexToColumnName: تحويل رقم العمود إلى حرف أبجدي (#L52)
 *    - createCellBlock: إنشاء كتلة خلية جدول حسابي (#L63)
 *    - isCellBlock: فاحص نوع خلية الحساب (#L90)
 *    - formatCellValue: تنسيق القيمة المحسوبة نصياً (#L97)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يتكامل مع محرك تقييم الصيغ الرياضية FormulaEvaluator.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم التنسيق الشرطي (Conditional Formatting)
 *    - 📖 مرجع تقني: LibreText Grid Engine & A1 Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export type CellDataType = 'number' | 'text' | 'date' | 'boolean' | 'formula' | 'error';
export type NumberFormatType = 'currency' | 'percent' | 'decimal' | 'standard' | 'date';

export interface CellBlockData {
  readonly address: string; // 'A1', 'B2', etc.
  readonly row: number;
  readonly col: number;
  readonly rawInput: string;
  readonly computedValue: number | string | boolean | null;
  readonly dataType: CellDataType;
  readonly numberFormat?: NumberFormatType;
  readonly error?: string;
}

export interface CellBlockNode extends BaseBlockNode<CellBlockData> {
  readonly type: 'cell';
  readonly domain: 'calc';
}

export function indexToColumnName(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter || 'A';
}

export function createCellBlock(
  id: string,
  row: number,
  col: number,
  rawInput: string = '',
  data?: Partial<CellBlockData>,
): CellBlockNode {
  const address = `${indexToColumnName(col)}${row}`;
  const isFormula = rawInput.startsWith('=');
  const dataType = isFormula ? 'formula' : (data?.dataType ?? 'text');

  return {
    id,
    type: 'cell',
    domain: 'calc',
    traits: ['styleable'] as readonly TraitKey[],
    data: {
      address,
      row,
      col,
      rawInput,
      computedValue: data?.computedValue ?? (isFormula ? 0 : rawInput),
      dataType,
      numberFormat: data?.numberFormat ?? 'standard',
      error: data?.error,
    },
  };
}

export function isCellBlock(node: unknown): node is CellBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as CellBlockNode;
  return b.type === 'cell' && b.domain === 'calc' && typeof b.data?.address === 'string';
}

export function formatCellValue(node: CellBlockNode): string {
  if (node.data.error) return node.data.error;
  const val = node.data.computedValue;
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') {
    if (node.data.numberFormat === 'currency') return `${val.toLocaleString()} ر.س`;
    if (node.data.numberFormat === 'percent') return `${(val * 100).toFixed(1)}%`;
    return val.toLocaleString();
  }
  return String(val);
}
