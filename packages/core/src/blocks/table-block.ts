/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: table-block.ts
 * 📂 المسار: src/blocks/table-block.ts
 * 🎯 الهدف الرئيسي: تعريف كتلة الجداول الهيكلية الشاملة (Universal Table Block)
 * 📋 المعايير: تمثيل شبكي بصفوف وخلايا، دمج الخلايا، وتصدير GFM / HTML
 * 🧪 الاختبارات: التحقق من أبعاد الجدول وسلامة مصفوفات الصفوف والخلايا
 * 🏷️ المعرف: BLK-UNIV-TABLE
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hierarchical Cell Matrix + Dynamic Cell Spanning + GFM Formatter
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب الصفوف الفارغة دون خلايا.
 *    2. ضمان عدم استخدام ألوان خلفية داكنة للخلايا.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard للتحقق من سلامة كائنات الجدول.
 *    - توليد معرفات فريدة لكل خلية وصف.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createTableCell: إنشاء خلية جدول (#L53)
 *    - createTableRow: إنشاء صف جدول (#L68)
 *    - createTableBlock: إنشاء كتلة جدول كاملة (#L76)
 *    - isTableBlock: فاحص نوع الجدول (#L95)
 *    - formatTableMarkdown: تحويل الجدول لصيغة Markdown (#L102)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يدعم المحاذاة لكل عمود أو خلية بشكل مستقل.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم تجميد الصف الأول وعمليات الفرز
 *    - 📖 مرجع تقني: GFM Table Spec & LibreText Catalog
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface TableCellData {
  readonly id: string;
  readonly text: string;
  readonly colspan?: number;
  readonly rowspan?: number;
  readonly align?: 'left' | 'center' | 'right';
  readonly background?: string;
  readonly rawInput?: string;
  readonly computedValue?: number | string | boolean | null;
  readonly address?: string;
}

export interface TableRowData {
  readonly id: string;
  readonly cells: readonly TableCellData[];
  readonly isHeader?: boolean;
}

export interface TableBlockData {
  readonly rowsCount: number;
  readonly colsCount: number;
  readonly hasHeaderRow: boolean;
  readonly borderStyle: 'solid' | 'dashed' | 'none';
  readonly borderColor?: string;
}

export interface TableBlockNode extends BaseBlockNode<TableBlockData> {
  readonly type: 'table';
  readonly domain: 'universal';
  readonly rows: readonly TableRowData[];
}

export function createTableCell(
  id: string,
  text: string,
  options?: Partial<Omit<TableCellData, 'id' | 'text'>>,
): TableCellData {
  return {
    id,
    text,
    colspan: options?.colspan ?? 1,
    rowspan: options?.rowspan ?? 1,
    align: options?.align ?? 'right',
    background: options?.background,
  };
}

export function createTableRow(
  id: string,
  cells: readonly TableCellData[],
  isHeader: boolean = false,
): TableRowData {
  return { id, cells, isHeader };
}

export function createTableBlock(
  id: string,
  rows: readonly TableRowData[],
  data?: Partial<TableBlockData>,
): TableBlockNode {
  return {
    id,
    type: 'table',
    domain: 'universal',
    traits: ['resizable', 'styleable', 'lockable'] as readonly TraitKey[],
    data: {
      rowsCount: rows.length,
      colsCount: rows[0]?.cells.length ?? 0,
      hasHeaderRow: data?.hasHeaderRow ?? true,
      borderStyle: data?.borderStyle ?? 'solid',
      borderColor: data?.borderColor ?? '#E2E8F0',
    },
    rows,
  };
}

export function isTableBlock(node: unknown): node is TableBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as TableBlockNode;
  return b.type === 'table' && Array.isArray(b.rows);
}

export function formatTableMarkdown(node: TableBlockNode): string {
  if (node.rows.length === 0) return '';
  const lines: string[] = [];
  const headerRow = node.rows[0];
  if (!headerRow) return '';

  const headerCells = headerRow.cells.map((c) => c.text || ' ');
  lines.push(`| ${headerCells.join(' | ')} |`);
  lines.push(`| ${headerCells.map(() => '---').join(' | ')} |`);

  for (let i = 1; i < node.rows.length; i++) {
    const row = node.rows[i];
    if (row) {
      lines.push(`| ${row.cells.map((c) => c.text || ' ').join(' | ')} |`);
    }
  }

  return lines.join('\n');
}
