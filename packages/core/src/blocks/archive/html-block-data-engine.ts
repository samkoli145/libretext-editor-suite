// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-data-engine.ts
 * 📂 المسار: packages/core/src/blocks/html-block-data-engine.ts
 * 🎯 الهدف الرئيسي: محرك عرض البيانات (DataTable + Pagination + StatCard).
 * 📋 المعايير: Zero-Dependency, Patch Factory, < 50 lines/function.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-data-engine.test.ts
 * 🏷️ المعرف: CORE-BLK-DAT-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Data Transformation + Pagination + Sorting
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. headers يجب أن يكون مصفوفة غير فارغة.
 *    2. rows يجب أن يكون مصفوفة من المصفوفات.
 *    3. pageIndex يجب أن يكون ضمن الحدود.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من صحة البيانات.
 *    - معالجة الأخطاء بصمت مع تسجيلها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts
 *    - 📄 مرتبط مباشر: html-block-registry.ts
 *    - 🧪 اختبارات: html-block-data-engine.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - computeTableStyles: حساب فئات الجدول (#L65)
 *    - sortTable: فرز الجدول (#L85)
 *    - paginateTable: ترقيم الصفحات (#L105)
 *    - computeStatCardStyles: حساب فئات بطاقة الإحصائية (#L125)
 *    - computePaginationStyles: حساب فئات ترقيم الصفحات (#L145)
 *    - updateTableProps: تحديث خصائص الجدول (#L165)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - المحرك يدعم DataTable مع فرز وترقيم صفحات.
 *    - StatCard يعرض قيمة كبيرة مع نسبة تغيير.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: إضافة دعم تصفية البيانات.
 *    - 📖 مرجع تقني: Tailwind CSS Tables.
 *    - 🎯 التحسينات المستقبلية: دعم تصدير البيانات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { HtmlBlockNode, TailwindClasses } from './html-block-types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DataTable Engine | محرك جدول البيانات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب فئات DataTable من الخصائص.
 *
 * ⚠️ يُضيف فئات الجدول الافتراضية.
 *
 * // @function-index: #39/4 — computeTableStyles
 */
export function computeTableStyles(): TailwindClasses {
  return {
    layout: ['w-full', 'border-collapse'],
    borders: ['border', 'border-gray-200'],
  };
}

/**
 * فرز الجدول حسب عمود معين.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ columnIndex يجب أن يكون ضمن الحدود.
 * ⚠️ direction يجب أن يكون 'asc' أو 'desc'.
 *
 * // @function-index: #40/4 — sortTable
 */
export function sortTable(
  node: HtmlBlockNode,
  columnIndex: number,
  direction: 'asc' | 'desc' = 'asc',
): HtmlBlockNode {
  const headers = node.props.headers as string[] | undefined;
  const rows = node.props.rows as string[][] | undefined;

  if (!headers || !rows) return node;
  if (columnIndex < 0 || columnIndex >= headers.length) return node;

  const sorted = [...rows].sort((a, b) => {
    const va = a[columnIndex] ?? '';
    const vb = b[columnIndex] ?? '';
    const cmp = va.localeCompare(vb, undefined, { numeric: true });
    return direction === 'asc' ? cmp : -cmp;
  });

  return {
    ...node,
    props: { ...node.props, rows: sorted, sortColumn: columnIndex, sortDirection: direction },
  };
}

/**
 * ترقيم صفحات الجدول.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ pageIndex يجب أن يكون ضمن الحدود.
 * ⚠️ pageSize يجب أن يكون رقم موجب.
 *
 * // @function-index: #41/4 — paginateTable
 */
export function paginateTable(
  node: HtmlBlockNode,
  pageIndex: number,
  pageSize = 10,
): HtmlBlockNode {
  const rows = node.props.rows as string[][] | undefined;
  if (!rows) return node;

  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const page = Math.max(0, Math.min(totalPages - 1, pageIndex));
  const start = page * pageSize;
  const end = start + pageSize;
  const pageRows = rows.slice(start, end);

  return {
    ...node,
    props: { ...node.props, pageRows, pageIndex: page, pageSize, totalPages },
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// StatCard Engine | محرك بطاقة الإحصائية
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب فئات StatCard من الخصائص.
 *
 * ⚠️ يُضيف فئات البطاقة الافتراضية.
 *
 * // @function-index: #42/4 — computeStatCardStyles
 */
export function computeStatCardStyles(): TailwindClasses {
  return {
    layout: ['p-6', 'rounded-lg'],
    colors: ['bg-white'],
    effects: ['shadow-sm'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pagination Engine | محرك ترقيم الصفحات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب فئات Pagination من الخصائص.
 *
 * ⚠️ يُضيف فئات ترقيم الصفحات الافتراضية.
 *
 * // @function-index: #43/4 — computePaginationStyles
 */
export function computePaginationStyles(): TailwindClasses {
  return {
    layout: ['flex', 'gap-2'],
  };
}

/**
 * تحديث خصائص DataTable.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ يحسب الفئات تلقائياً من الخصائص الجديدة.
 *
 * // @function-index: #44/4 — updateTableProps
 */
export function updateTableProps(
  node: HtmlBlockNode,
  props: Record<string, unknown>,
): HtmlBlockNode {
  const styles = computeTableStyles();

  return {
    ...node,
    props: { ...node.props, ...props },
    styles: { ...node.styles, ...styles },
  };
}
