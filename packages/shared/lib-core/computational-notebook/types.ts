/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: تعريف الأنواع والعقود الأساسية المنقاة للمفكرة الحسابية (Refined Core Types)
 * 🏛️ الدور: نواة العقود المعمارية المعزولة (Zero-Dependency Engine Contracts)
 * 📥 المستهلك: ScratchpadParser, ScratchpadGraph, ScratchpadEngine, ScratchpadStore, ScratchpadBindings
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Rule #1: A STEP IS DOCUMENT DATA; THE READER'S POSITION IS NOT (فصل Document State عن View State).
 *    - Rule #2: VALUES ARE DERIVED, NEVER STORED (المتغيرات في المستند لا تحمل `value` أبداً).
 *    - Additive Fields Rule: ABSENT = NONE (استخدام `drop: string[]` للحذف الصريح بدلاً من `undefined`).
 *    - PLATFORM §3: UNKNOWN FIELDS SURVIVE (دوال `normalizeNotebook` و `normalizeVar` تحافظ على الحقول المجهولة).
 *    - Rule #3: HONEST ERRORS (أخطاء صريحة #REF!, #CYCLE! دون تخمين أرقام).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع وجود حقل `value` داخل `ScratchpadVar`؛ القيمة مشتقة حصراً runtime عبر `ComputedVar`.
 *    2. حظر تمرير `undefined` في الـ JSON Patches واستخدام `drop` الصريح لتفادي تبخر الحذف.
 *    3. `varId` (UUID) غير قابل لإعادة الاستخدام مطلقاً لمنع ظاهرة البعث (Resurrection Bug).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards شاملة (`isValidVarName`, `isValidVarId`, `isScratchpadError`).
 *    - تطبيع دفاعي للبيانات الخام (Defensive Normalization) ضد Prototype Pollution و الحقول الفارغة `""` أو `[]`.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 الأنواع الأساسية (Core Types)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ScratchpadColumnType =
  'number' | 'text' | 'percent' | 'money' | 'date' | 'boolean' | 'formula' | 'enum';

/**
 * متغير في المفكرة الحسابية (Document State)
 *
 * ⚠️ Rule #2: VALUES ARE DERIVED, NEVER STORED
 * لا يحتوي على حقل `value` أبداً في المستند الدائم.
 */
export interface ScratchpadVar {
  id: string; // 🛡️ الهوية الدائمة UUID (var_...)
  name: string; // الاسم الظاهر (بدون $)
  expr: string; // التعبير الحسابي الأصلي
  type?: ScratchpadColumnType; // نوع اختياري (additive: absent = default)
  format?: string; // نمط التنسيق (additive: absent = default)
  description?: string; // وصف توضيحي (additive: absent = none)
  created: number; // timestamp
  updated: number; // timestamp
  [key: string]: unknown; // PLATFORM §3: للحفاظ على الحقول المجهولة
}

/**
 * متغير محسوب ومشتق بالذاكرة فقط (Runtime Only — Never Persisted)
 *
 * الجسر بين حالة المستند Document State والعرض View State.
 */
export interface ComputedVar extends ScratchpadVar {
  value: unknown; // القيمة الحسابية المشتقة
  error?: ScratchpadError; // الخطأ الحسابي الصريح إن وجد
}

/**
 * سطر في المفكرة (View State)
 */
export interface ScratchpadLine {
  id: string;
  varId?: string; // المعرف الدائم للمتغير المرتبط
  expr: string; // نص التعبير في هذا السطر
}

/**
 * دفتر حسابي كامل (Document State)
 *
 * ⚠️ PLATFORM §3: Unknown fields survive
 */
export interface Notebook {
  id: string;
  name: string;
  vars: Map<string, ScratchpadVar>;
  lines: ScratchpadLine[];
  created: number;
  updated: number;
  [key: string]: unknown; // للحفاظ على حقول الإصدارات المستقبلية
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔧 عمليات التعديل المنقاة (Refined Patches with Drop)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ScratchpadPatch =
  | {
      op: 'setScratchpadVar';
      notebookId: string;
      varId: string;
      props: {
        name?: string;
        expr?: string;
        type?: ScratchpadColumnType;
        format?: string;
        description?: string;
        [key: string]: unknown;
      };
      drop?: string[]; // 🛡️ حذف الحقول صراحةً لمنع تبخر undefined في JSON
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'deleteScratchpadVar';
      notebookId: string;
      varId: string;
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'restoreScratchpadVar';
      notebookId: string;
      varId: string;
      data: ScratchpadVar;
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'createNotebook';
      notebookId: string;
      name: string;
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'deleteNotebook';
      notebookId: string;
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'restoreNotebook';
      data: Notebook;
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'renameNotebook';
      notebookId: string;
      newName: string;
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'unbindScratchpadVar';
      varId: string;
      inverse?: ScratchpadPatch;
    }
  | {
      op: 'noop';
      inverse?: ScratchpadPatch;
    };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 سياق التقييم (Evaluation Context)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ScratchpadEvalContext {
  vars: Map<string, ScratchpadVar>;
  evaluatedValues?: Map<string, unknown>;
  now?: string;
  locale?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📡 أحداث المفكرة (Events)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ScratchpadEvent =
  | { type: 'varChanged'; varId: string; name: string; value: unknown; notebookId: string }
  | { type: 'varDeleted'; varId: string; name?: string; notebookId: string }
  | { type: 'notebookChanged'; notebookId: string }
  | { type: 'notebookLoaded'; notebookId: string }
  | { type: 'patchApplied'; notebookId?: string };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛡️ Type Guards & Validators
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function isValidVarName(name: string): boolean {
  if (typeof name !== 'string') return false;
  const clean = name.startsWith('$') ? name.slice(1) : name;
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(clean);
}

export function isValidVarId(id: unknown): id is string {
  return typeof id === 'string' && id.startsWith('var_') && id.length > 8;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚨 أخطاء الحساب الصريحة (Honest Computational Errors — Rule #3)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class ScratchpadError {
  readonly isError = true;
  constructor(
    public readonly code: '#REF!' | '#CYCLE!' | '#VALUE!' | '#DIV/0!' | '#NAME?',
    public readonly message: string,
    public readonly details?: unknown,
  ) {}

  toString(): string {
    return `${this.code} ${this.message}`;
  }
}

export function isScratchpadError(val: unknown): val is ScratchpadError {
  return (
    val instanceof ScratchpadError ||
    (typeof val === 'object' && val !== null && (val as any).isError === true)
  );
}

export const ERR_REF = (target?: string) =>
  new ScratchpadError('#REF!', `مرجع متغير غير موجود: ${target ?? ''}`);

export const ERR_CYCLE = (cyclePath?: string[]) =>
  new ScratchpadError('#CYCLE!', `اعتماد دائري حلقي: ${cyclePath ? cyclePath.join(' -> ') : ''}`);

export const ERR_VALUE = (msg = 'قيمة غير صالحة') => new ScratchpadError('#VALUE!', msg);

export const ERR_DIV0 = () => new ScratchpadError('#DIV/0!', 'القسمة على صفر غير مسموحة');

export const ERR_NAME = (funcName: string) =>
  new ScratchpadError('#NAME?', `دالة غير معروفة: ${funcName}`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧹 التطبيع الدفاعي (Defensive Normalization — Rule #2 & PLATFORM §3)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function normalizeVar(raw: Record<string, unknown>): ScratchpadVar {
  const { value, error, ...cleanRaw } = raw;

  const id =
    typeof cleanRaw.id === 'string'
      ? cleanRaw.id
      : `var_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const name = typeof cleanRaw.name === 'string' ? cleanRaw.name.replace(/^\$/, '') : 'untitled';
  const expr = typeof cleanRaw.expr === 'string' ? cleanRaw.expr : '0';

  const res: ScratchpadVar = {
    ...cleanRaw,
    id,
    name,
    expr,
    created: typeof cleanRaw.created === 'number' ? cleanRaw.created : Date.now(),
    updated: typeof cleanRaw.updated === 'number' ? cleanRaw.updated : Date.now(),
  };

  // Strip empty strings and arrays
  if (res.description === '' || (Array.isArray(res.description) && res.description.length === 0)) {
    delete res.description;
  }
  if (res.format === '' || (Array.isArray(res.format) && res.format.length === 0)) {
    delete res.format;
  }
  for (const key of Object.keys(res)) {
    if (res[key] === '' || (Array.isArray(res[key]) && (res[key] as any[]).length === 0)) {
      if (key !== 'expr') {
        delete res[key];
      }
    }
  }

  return res;
}

export function normalizeNotebook(raw: Record<string, unknown>): Notebook {
  const id = typeof raw.id === 'string' ? raw.id : 'default';
  const name = typeof raw.name === 'string' ? raw.name : 'Untitled Notebook';
  const created = typeof raw.created === 'number' ? raw.created : Date.now();
  const updated = typeof raw.updated === 'number' ? raw.updated : Date.now();

  const varsMap = new Map<string, ScratchpadVar>();

  if (raw.vars instanceof Map) {
    for (const [k, v] of raw.vars) {
      if (typeof v === 'object' && v !== null) {
        varsMap.set(k, normalizeVar(v as Record<string, unknown>));
      }
    }
  } else if (Array.isArray(raw.vars)) {
    for (const item of raw.vars) {
      if (
        Array.isArray(item) &&
        item.length === 2 &&
        typeof item[0] === 'string' &&
        typeof item[1] === 'object' &&
        item[1] !== null
      ) {
        varsMap.set(item[0], normalizeVar(item[1] as Record<string, unknown>));
      } else if (typeof item === 'object' && item !== null && 'id' in item) {
        const norm = normalizeVar(item as Record<string, unknown>);
        varsMap.set(norm.id, norm);
      }
    }
  } else if (typeof raw.vars === 'object' && raw.vars !== null) {
    for (const [k, v] of Object.entries(raw.vars)) {
      if (typeof v === 'object' && v !== null) {
        varsMap.set(k, normalizeVar(v as Record<string, unknown>));
      }
    }
  }

  const lines: ScratchpadLine[] = [];
  if (Array.isArray(raw.lines)) {
    for (const l of raw.lines) {
      if (typeof l === 'object' && l !== null) {
        lines.push({
          id: typeof l.id === 'string' ? l.id : `line_${Math.random().toString(36).slice(2, 7)}`,
          varId: typeof l.varId === 'string' ? l.varId : undefined,
          expr: typeof l.expr === 'string' ? l.expr : '',
        });
      }
    }
  }

  return {
    ...raw,
    id,
    name,
    vars: varsMap,
    lines,
    created,
    updated,
  };
}
