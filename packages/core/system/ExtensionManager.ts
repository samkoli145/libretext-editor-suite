/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مدير الإضافات ودورة حياتها (تنشيط/تعطيل) - Extension Manager
 * 🏛️ الدور: مكون أساسي - إدارة دورة حياة الإضافات بتباطؤ وحماية من الأخطاء
 * 📥 المستهلك: Kernel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Lazy Activation Extensions: إضافات بتنشيط بطيء
 *    مع Result<T, Error> pattern وحماية من الأخطاء
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الإضافة يجب ألا تُنشَّط مرتين
 *    2. deactivate() يجب أن يكون اختيارياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم التنشيط المزدوج
 *    - try/catch حول activate() و deactivate()
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Result, ok, err } from '../../shared/primitives/Result';
import type { LocalizedString } from '../../shared/primitives/LocalizedString';

export interface Extension {
  id: string;
  name: LocalizedString;
  version: string;
  activate: () => Promise<void> | void;
  deactivate?: () => Promise<void> | void;
}

export class ExtensionManager {
  private activeExtensions = new Map<string, Extension>();

  async activate(extension: Extension): Promise<Result<void, Error>> {
    if (this.activeExtensions.has(extension.id)) {
      return ok(undefined);
    }

    try {
      await extension.activate();
      this.activeExtensions.set(extension.id, extension);
      return ok(undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return err(
        new Error(`Failed to activate extension ${extension.id}: ${msg}`)
      );
    }
  }

  async deactivate(extensionId: string): Promise<Result<void, Error>> {
    const ext = this.activeExtensions.get(extensionId);
    if (!ext) {
      return ok(undefined);
    }

    try {
      if (ext.deactivate) {
        await ext.deactivate();
      }
      this.activeExtensions.delete(extensionId);
      return ok(undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return err(
        new Error(`Failed to deactivate extension ${extensionId}: ${msg}`)
      );
    }
  }

  isActivated(extensionId: string): boolean {
    return this.activeExtensions.has(extensionId);
  }

  list(): Extension[] {
    return Array.from(this.activeExtensions.values());
  }
}
