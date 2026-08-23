/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: result.ts
 * 📂 المسار: packages/shared/utils/result.ts
 * 🎯 الهدف الرئيسي: نوع Result<T, E> بنمط Rust — التعامل المبرمج مع الأخطاء
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية — pure TypeScript فقط
 *    - يُستخدم في كل API يُرجع خطأ محتملاً
 * 🧪 الاختبارات: result.test.ts
 * 🏷️ المعرف: CORE-RESULT-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Rust-inspired Result Type + Exhaustive Match + Zero-Alloc Ok/Err
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. لا تستخدم throw — كل الأخطاء عبر Result
 *    2. لا تستخدم null/undefined — كل القيم عبر Result
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Result<T, E = Error> = Ok<T> | Err<E>;

export class Ok<T> {
  readonly isOk = true as const;
  readonly isErr = false as const;
  constructor(readonly value: T) {}

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_fallback: T): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Ok(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Result<U, Error>): Result<U, Error> {
    return fn(this.value);
  }

  match<U>(onOk: (value: T) => U, _onErr: (error: Error) => U): U {
    return onOk(this.value);
  }

  toString(): string {
    return `Ok(${JSON.stringify(this.value)})`;
  }
}

export class Err<E> {
  readonly isOk = false as const;
  readonly isErr = true as const;
  constructor(readonly error: E) {}

  unwrap(): never {
    throw new Error(`Called unwrap on Err: ${this.error}`);
  }

  unwrapOr<T>(fallback: T): T {
    return fallback;
  }

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as Result<U, E>;
  }

  flatMap<U>(_fn: (value: never) => Result<U, Error>): Result<U, E> {
    return this as Result<U, E>;
  }

  match<U>(_onOk: (value: never) => U, onErr: (error: E) => U): U {
    return onErr(this.error);
  }

  toString(): string {
    return `Err(${this.error})`;
  }
}

export function ok<T>(value: T): Result<T, never> {
  return new Ok(value);
}

export function err<E>(error: E): Result<never, E> {
  return new Err(error);
}

export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return new Ok(fn());
  } catch (e) {
    return new Err(e instanceof Error ? e : new Error(String(e)));
  }
}

export async function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return new Ok(await fn());
  } catch (e) {
    return new Err(e instanceof Error ? e : new Error(String(e)));
  }
}
