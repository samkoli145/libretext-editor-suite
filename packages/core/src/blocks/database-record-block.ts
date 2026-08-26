/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: database-record-block.ts
 * 📂 المسار: src/blocks/database-record-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك سجل قواعد البيانات والبطاقات لنطاق Base
 * 📋 المعايير: دعم الحقول ذات الأنواع الصارمة (نصوص، أرقام، تواريخ، علاقات)
 * 🧪 الاختبارات: التحقق من بنية الحقول وصحة السجلات وتوليد بطاقة JSON
 * 🏷️ المعرف: BLK-BASE-RECORD
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Typed Schema-Driven Record + Relational Foreign Key Contract
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ضمان توفير tableId و recordId فريدين لكل سجل.
 *    2. حظر الحقول التي تحتوي على قيم غير متوافقة مع نوع الحقل.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isDatabaseRecordBlock).
 *    - حماية التاريخ الافتراضي بصيغة ISO صالحة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createDatabaseField: إنشاء حقل بيانات نوعي (#L50)
 *    - createDatabaseRecordBlock: إنشاء كتلة سجل قاعدة بيانات (#L60)
 *    - isDatabaseRecordBlock: فاحص نوع سجل قاعدة البيانات (#L84)
 *    - formatRecordCardText: توليد ملخص نصي للبطاقة (#L91)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يدعم الاستعلامات وعرض البطاقات والنماذج في نطاق Base.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم قواعد التحقق (Validation Rules) للحقول
 *    - 📖 مرجع تقني: LibreText Base Domain Specification
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'relation';

export interface DatabaseField {
  readonly key: string;
  readonly label: string;
  readonly type: FieldType;
  readonly value: unknown;
}

export interface DatabaseRecordData {
  readonly tableId: string;
  readonly recordId: string;
  readonly title: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly fields: Record<string, DatabaseField>;
}

export interface DatabaseRecordBlockNode extends BaseBlockNode<DatabaseRecordData> {
  readonly type: 'database_record';
  readonly domain: 'base';
}

export function createDatabaseField(
  key: string,
  label: string,
  type: FieldType,
  value: unknown,
): DatabaseField {
  return { key, label, type, value };
}

export function createDatabaseRecordBlock(
  id: string,
  tableId: string,
  recordId: string,
  title: string,
  fields: Record<string, DatabaseField> = {},
  data?: Partial<DatabaseRecordData>,
): DatabaseRecordBlockNode {
  const now = new Date().toISOString();
  return {
    id,
    type: 'database_record',
    domain: 'base',
    traits: ['draggable', 'styleable', 'lockable'] as readonly TraitKey[],
    data: {
      tableId,
      recordId,
      title: title || 'سجل جديد',
      createdAt: data?.createdAt ?? now,
      updatedAt: data?.updatedAt ?? now,
      fields,
    },
  };
}

export function isDatabaseRecordBlock(node: unknown): node is DatabaseRecordBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as DatabaseRecordBlockNode;
  return (
    b.type === 'database_record' && b.domain === 'base' && typeof b.data?.recordId === 'string'
  );
}

export function formatRecordCardText(node: DatabaseRecordBlockNode): string {
  const fieldList = Object.values(node.data.fields)
    .map((f) => `${f.label}: ${String(f.value)}`)
    .join(', ');
  return `[${node.data.title}] - ${fieldList || 'لا توجد حقول'}`;
}
