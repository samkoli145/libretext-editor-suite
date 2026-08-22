/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نوع النتيجة الآمنة - Result Type (Ok/Err)
 * 🏛️ الدور: نوع أساسي - نمط برمجي آمن لتمثيل النجاح أو الخطأ
 * 📥 المستهلك: كل الدوال التي قد تفشل وتريد إرجاع أخطاء مقروءة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Railway-Oriented Programming: نمط Result<T,E> يمنع الأخطاء غير المتوقعة
 *    مع Ok<T> و Err<E> classes
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يجب فحص isOk/isErr قبل الوصول للقيمة
 *    2. لا تستخدم try/catch مع Result
 *    3. unwrap() قد يسبب استثناء
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام match() بدلاً من unwrap()
 *    - fallback لقيمة افتراضية عند الخطأ
 *    - تسجيل الأخطاء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// src/shared/primitives/Result.ts

export type Result<T, E = Error> = Ok<T> | Err<E>;

export class Ok<T> {
  readonly isOk = true as const;
  readonly isErr = false as const;

  constructor(readonly value: T) {}
}

export class Err<E> {
  readonly isOk = false as const;
  readonly isErr = true as const;

  constructor(readonly error: E) {}
}

export function ok<T>(value: T): Result<T, never> {
  return new Ok(value);
}

export function err<E>(error: E): Result<never, E> {
  return new Err(error);
}
