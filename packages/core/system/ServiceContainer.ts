/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: حاوية الخدمات وحقن الاعتماديات - Service Container
 * 🏛️ الدور: مكون أساسي - تسجيل واسترجاع الخدمات بناءً على Tokens
 * 📥 المستهلك: Kernel, createEditorServices
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Token-Based DI Container: حقن اعتماديات مبني على Tokens
 *    مع Result<T, Error> pattern لمعالجة الأخطاء
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الخدمات يجب أن تُسجَّل قبل get()
 *    2. Tokens يجب أن تكون فريدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Result pattern بدل throw
 *    - fallback لخطأ واضح عند عدم التسجيل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Result, ok, err } from '../../shared/primitives/Result';

export interface ServiceToken<T> {
  name: string;
  _type?: T;
}

export function createToken<T>(name: string): ServiceToken<T> {
  return { name };
}

export class ServiceContainer {
  private services = new Map<string, unknown>();

  register<T>(token: ServiceToken<T>, service: T): void {
    this.services.set(token.name, service);
  }

  get<T>(token: ServiceToken<T>): Result<T, Error> {
    const service = this.services.get(token.name);
    if (!service) {
      return err(
        new Error(`Service '${token.name}' not registered in ServiceContainer`)
      );
    }
    return ok(service as T);
  }

  has(token: ServiceToken<unknown>): boolean {
    return this.services.has(token.name);
  }
}
