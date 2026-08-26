// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [base-engine.ts] محرك قواعد البيانات — Base Engine
//
// هذا الملف يجيب: "كيف ندير بيانات منظمة بدقة؟"
//
// المبادئ المعمارية:
//
// 1. EVERY OPERATION IS A PATCH FACTORY (من rowcol.ts):
//    كل عملية CRUD تعيد Database جديد — الأصلي لا يتغير.
//    هذا يجعل كل تعديل قابلاً للتراجع، ومتوافقاً مع CRDT مستقبلاً.
//
// 2. IDENTITY REFUSES (من rowcol.ts):
//    الأعمدة المكررة تُرفض بصوت عالٍ.
//    السجلات بدون معرف فريد تُرفض.
//
// 3. VALIDATION BEFORE COMMIT:
//    كل سجل يُتحقق منه قبل الحفظ.
//    الأخطاء تُجمع، لا تُخفي.
//
// 4. DERIVED STATISTICS:
//    الإحصائيات تُشتق من البيانات، لا تُخزن.
//    التغيير في سجل يُحدّث كل الإحصائيات فوراً.
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import { bottomUpMergeSort } from '../../../algorithms/src/sort/mergesort';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. DATABASE MODEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Database {
  id: string;
  name: string;
  tables: DatabaseTable[];
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseTable {
  id: string;
  name: string;
  columns: DatabaseColumn[];
  records: DatabaseRecord[];
}

export type ColumnType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'url'
  | 'email'
  | 'currency'
  | 'formula';

export interface DatabaseColumn {
  id: string;
  name: string;
  type: ColumnType;
  required: boolean;
  defaultValue?: unknown;
  options?: string[]; // لنوع 'select'
  formula?: string; // لنوع 'formula'
  width?: number;
}

export interface DatabaseRecord {
  id: string;
  fields: Record<string, unknown>; // columnId → value
  createdAt: string;
  updatedAt: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. QUERY TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type FilterOperator =
  | 'eq' | 'neq'
  | 'gt' | 'lt' | 'gte' | 'lte'
  | 'contains' | 'startsWith' | 'endsWith'
  | 'isEmpty' | 'isNotEmpty';

export interface FilterPredicate {
  columnId: string;
  operator: FilterOperator;
  value?: unknown;
}

export interface QueryOptions {
  filters?: FilterPredicate[];
  sort?: { columnId: string; direction: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ columnId: string; message: string }>;
}

export interface TableStats {
  totalRecords: number;
  columns: Array<{
    columnId: string;
    name: string;
    type: ColumnType;
    nonEmptyCount: number;
    uniqueCount: number;
  }>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. BASE ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let dbSeq = 0;
function mintId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${(dbSeq++).toString(36)}`;
}

export class BaseEngine {
  // ── Factory ──

  /** إنشاء قاعدة بيانات فارغة. */
  createDatabase(name: string): Database {
    return {
      id: mintId('db'),
      name,
      tables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // ── Table Operations ──

  /** إنشاء جدول. */
  createTable(db: Database, name: string, columns: DatabaseColumn[]): Database {
    // التحقق من عدم تكرار أسماء الأعمدة
    const names = new Set(columns.map(c => c.name));
    if (names.size !== columns.length) {
      throw new Error('Duplicate column names');
    }

    const table: DatabaseTable = {
      id: mintId('tbl'),
      name,
      columns: columns.map(c => ({ ...c, id: c.id || mintId('col') })),
      records: [],
    };

    return {
      ...db,
      tables: [...db.tables, table],
      updatedAt: new Date().toISOString(),
    };
  }

  /** إعادة تسمية جدول. */
  renameTable(db: Database, tableId: string, newName: string): Database {
    if (!newName.trim()) throw new Error('Table name cannot be empty');

    return {
      ...db,
      tables: db.tables.map(t => t.id === tableId ? { ...t, name: newName } : t),
      updatedAt: new Date().toISOString(),
    };
  }

  /** حذف جدول. */
  deleteTable(db: Database, tableId: string): Database {
    return {
      ...db,
      tables: db.tables.filter(t => t.id !== tableId),
      updatedAt: new Date().toISOString(),
    };
  }

  /** تكرار جدول. */
  duplicateTable(db: Database, tableId: string): Database {
    const table = db.tables.find(t => t.id === tableId);
    if (!table) return db;

    const copy: DatabaseTable = {
      ...JSON.parse(JSON.stringify(table)),
      id: mintId('tbl'),
      name: `${table.name} (نسخة)`,
      columns: table.columns.map(c => ({ ...c, id: mintId('col') })),
      records: table.records.map(r => ({ ...r, id: mintId('rec') })),
    };

    return {
      ...db,
      tables: [...db.tables, copy],
      updatedAt: new Date().toISOString(),
    };
  }

  // ── Column Operations ──

  /** إضافة عمود. */
  addColumn(db: Database, tableId: string, column: DatabaseColumn): Database {
    return this.updateTable(db, tableId, (table) => {
      // التحقق من عدم تكرار الاسم
      if (table.columns.some(c => c.name === column.name)) {
        throw new Error(`Column "${column.name}" already exists`);
      }

      const newCol = { ...column, id: column.id || mintId('col') };
      const records = table.records.map(r => ({
        ...r,
        fields: { ...r.fields, [newCol.id]: newCol.defaultValue ?? null },
      }));

      return {
        ...table,
        columns: [...table.columns, newCol],
        records,
      };
    });
  }

  /** تحديث عمود. */
  updateColumn(
    db: Database,
    tableId: string,
    columnId: string,
    updates: Partial<DatabaseColumn>,
  ): Database {
    return this.updateTable(db, tableId, (table) => {
      // التحقق من عدم تكرار الاسم الجديد
      if (updates.name && table.columns.some(c => c.id !== columnId && c.name === updates.name)) {
        throw new Error(`Column "${updates.name}" already exists`);
      }

      return {
        ...table,
        columns: table.columns.map(c => c.id === columnId ? { ...c, ...updates } : c),
      };
    });
  }

  /** حذف عمود. */
  deleteColumn(db: Database, tableId: string, columnId: string): Database {
    return this.updateTable(db, tableId, (table) => {
      if (table.columns.length <= 1) {
        throw new Error('Cannot delete the last column');
      }

      const records = table.records.map(r => {
        const { [columnId]: _, ...rest } = r.fields;
        return { ...r, fields: rest };
      });

      return {
        ...table,
        columns: table.columns.filter(c => c.id !== columnId),
        records,
      };
    });
  }

  /** إعادة ترتيب الأعمدة. */
  reorderColumns(
    db: Database,
    tableId: string,
    fromIndex: number,
    toIndex: number,
  ): Database {
    return this.updateTable(db, tableId, (table) => {
      const columns = [...table.columns];
      if (fromIndex < 0 || fromIndex >= columns.length) return table;
      if (toIndex < 0 || toIndex >= columns.length) return table;

      const [col] = columns.splice(fromIndex, 1) as [DatabaseColumn];
      columns.splice(toIndex, 0, col);

      return { ...table, columns };
    });
  }

  // ── Record Operations (CRUD) ──

  /** إنشاء سجل. */
  createRecord(
    db: Database,
    tableId: string,
    fields: Record<string, unknown>,
  ): Database {
    return this.updateTable(db, tableId, (table) => {
      // التحقق من الصحة
      const validation = this.validateRecord(fields, table.columns);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // ملء القيم الافتراضية
      const fullFields: Record<string, unknown> = {};
      for (const col of table.columns) {
        fullFields[col.id] = fields[col.id] ?? col.defaultValue ?? null;
      }

      const record: DatabaseRecord = {
        id: mintId('rec'),
        fields: fullFields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { ...table, records: [...table.records, record] };
    });
  }

  /** قراءة سجل. */
  readRecord(db: Database, tableId: string, recordId: string): DatabaseRecord | undefined {
    const table = db.tables.find(t => t.id === tableId);
    return table?.records.find(r => r.id === recordId);
  }

  /** تحديث سجل. */
  updateRecord(
    db: Database,
    tableId: string,
    recordId: string,
    fields: Record<string, unknown>,
  ): Database {
    return this.updateTable(db, tableId, (table) => {
      const record = table.records.find(r => r.id === recordId);
      if (!record) return table;

      // التحقق من الصحة — دمج الحقول القديمة مع الجديدة
      const merged = { ...record.fields, ...fields };
      const validation = this.validateRecord(merged, table.columns);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      return {
        ...table,
        records: table.records.map(r =>
          r.id === recordId
            ? { ...r, fields: merged, updatedAt: new Date().toISOString() }
            : r
        ),
      };
    });
  }

  /** حذف سجل. */
  deleteRecord(db: Database, tableId: string, recordId: string): Database {
    return this.updateTable(db, tableId, (table) => ({
      ...table,
      records: table.records.filter(r => r.id !== recordId),
    }));
  }

  // ── Query Operations ──

  /** استعلام شامل. */
  query(db: Database, tableId: string, options: QueryOptions = {}): DatabaseRecord[] {
    const table = db.tables.find(t => t.id === tableId);
    if (!table) return [];

    let records = [...table.records];

    // التصفية
    if (options.filters && options.filters.length > 0) {
      records = this.filterRecords(records, options.filters);
    }

    // البحث
    if (options.search) {
      records = this.searchRecords(records, options.search, table.columns);
    }

    // الفرز — استخدام mergesort من algorithms
    if (options.sort) {
      const col = table.columns.find(c => c.id === options.sort!.columnId);
      if (col) {
        records = this.sortRecords(records, options.sort.columnId, options.sort.direction);
      }
    }

    // الترقيم
    if (options.offset) {
      records = records.slice(options.offset);
    }
    if (options.limit) {
      records = records.slice(0, options.limit);
    }

    return records;
  }

  /** فرز السجلات. */
  sortRecords(
    records: DatabaseRecord[],
    columnId: string,
    direction: 'asc' | 'desc',
  ): DatabaseRecord[] {
    const comparator = (a: DatabaseRecord, b: DatabaseRecord): number => {
      const valA = a.fields[columnId];
      const valB = b.fields[columnId];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let cmp: number;
      if (typeof valA === 'number' && typeof valB === 'number') {
        cmp = valA - valB;
      } else if (valA instanceof Date && valB instanceof Date) {
        cmp = valA.getTime() - valB.getTime();
      } else {
        cmp = String(valA).localeCompare(String(valB));
      }

      return direction === 'desc' ? -cmp : cmp;
    };

    return bottomUpMergeSort(records, comparator);
  }

  /** تصفية السجلات. */
  filterRecords(
    records: DatabaseRecord[],
    predicates: FilterPredicate[],
  ): DatabaseRecord[] {
    return records.filter(record => {
      return predicates.every(pred => this.matchPredicate(record, pred));
    });
  }

  /** البحث في السجلات. */
  searchRecords(
    records: DatabaseRecord[],
    query: string,
    columns: DatabaseColumn[],
  ): DatabaseRecord[] {
    if (!query) return records;
    const lower = query.toLowerCase();

    return records.filter(record => {
      return columns.some(col => {
        const val = record.fields[col.id];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(lower);
      });
    });
  }

  // ── Validation ──

  /** التحقق من صحة سجل. */
  validateRecord(
    record: Record<string, unknown>,
    columns: DatabaseColumn[],
  ): ValidationResult {
    const errors: Array<{ columnId: string; message: string }> = [];

    for (const col of columns) {
      const value = record[col.id];

      // التحقق من الحقول المطلوبة
      if (col.required && (value === null || value === undefined || value === '')) {
        errors.push({ columnId: col.id, message: `${col.name} مطلوب` });
        continue;
      }

      // التحقق من النوع
      if (value !== null && value !== undefined && value !== '') {
        switch (col.type) {
          case 'number':
          case 'currency':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push({ columnId: col.id, message: `${col.name} يجب أن يكون رقماً` });
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push({ columnId: col.id, message: `${col.name} يجب أن يكون قيمة منطقية` });
            }
            break;
          case 'date':
            if (typeof value === 'string' && isNaN(Date.parse(value))) {
              errors.push({ columnId: col.id, message: `${col.name} يجب أن يكون تاريخاً صالحاً` });
            }
            break;
          case 'email':
            if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors.push({ columnId: col.id, message: `${col.name} يجب أن يكون بريدًا إلكترونياً صالحاً` });
            }
            break;
          case 'url':
            if (typeof value === 'string') {
              try { new URL(value); } catch {
                errors.push({ columnId: col.id, message: `${col.name} يجب أن يكون رابطاً صالحاً` });
              }
            }
            break;
          case 'select':
            if (col.options && !col.options.includes(String(value))) {
              errors.push({ columnId: col.id, message: `${col.name} يجب أن يكون من الخيارات المحددة` });
            }
            break;
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // ── Statistics ──

  /** إحصائيات جدول. */
  getTableStats(db: Database, tableId: string): TableStats {
    const table = db.tables.find(t => t.id === tableId);
    if (!table) {
      return { totalRecords: 0, columns: [] };
    }

    const columns = table.columns.map(col => {
      const values = table.records.map(r => r.fields[col.id]);
      const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '').length;
      const unique = new Set(values.map(String)).size;

      return {
        columnId: col.id,
        name: col.name,
        type: col.type,
        nonEmptyCount: nonEmpty,
        uniqueCount: unique,
      };
    });

    return {
      totalRecords: table.records.length,
      columns,
    };
  }

  // ── Private Helpers ──

  private updateTable(
    db: Database,
    tableId: string,
    updater: (table: DatabaseTable) => DatabaseTable,
  ): Database {
    return {
      ...db,
      tables: db.tables.map(t => t.id === tableId ? updater(t) : t),
      updatedAt: new Date().toISOString(),
    };
  }

  private matchPredicate(record: DatabaseRecord, pred: FilterPredicate): boolean {
    const value = record.fields[pred.columnId];
    const target = pred.value;

    switch (pred.operator) {
      case 'eq': return value === target;
      case 'neq': return value !== target;
      case 'gt':
        return typeof value === 'number' && typeof target === 'number' && value > target;
      case 'lt':
        return typeof value === 'number' && typeof target === 'number' && value < target;
      case 'gte':
        return typeof value === 'number' && typeof target === 'number' && value >= target;
      case 'lte':
        return typeof value === 'number' && typeof target === 'number' && value <= target;
      case 'contains':
        return typeof value === 'string' && typeof target === 'string' &&
               value.toLowerCase().includes(target.toLowerCase());
      case 'startsWith':
        return typeof value === 'string' && typeof target === 'string' &&
               value.toLowerCase().startsWith(target.toLowerCase());
      case 'endsWith':
        return typeof value === 'string' && typeof target === 'string' &&
               value.toLowerCase().endsWith(target.toLowerCase());
      case 'isEmpty':
        return value === null || value === undefined || value === '';
      case 'isNotEmpty':
        return value !== null && value !== undefined && value !== '';
      default:
        return true;
    }
  }
}