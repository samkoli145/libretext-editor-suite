/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: Disposable.ts
 * 📂 المسار: packages/shared/engines/Disposable.ts
 * 🎯 الهدف الرئيسي: نمط تنظيف الموارد (Disposable Pattern) — منع تسرب الذاكرة
 * 📋 المعايير:
 *    - كل مورد يجب أن يكون له dispose()
 *    - DisposableStore يجمع الموارد ويحذفها دفعة واحدة
 * 🏷️ المعرف: CORE-DISPOSABLE-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    RAII-inspired Resource Cleanup + Disposable Store
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Disposable {
  dispose(): void;
}

export class DisposableStore implements Disposable {
  private toDispose = new Set<Disposable>();
  private isDisposed = false;

  add<T extends Disposable>(disposable: T): T {
    if (this.isDisposed) {
      disposable.dispose();
    } else {
      this.toDispose.add(disposable);
    }
    return disposable;
  }

  dispose(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;
    for (const item of this.toDispose) {
      try {
        item.dispose();
      } catch (_e) {
        // منع تسرب الأخطاء — تنظيف آمن
      }
    }
    this.toDispose.clear();
  }

  get size(): number {
    return this.toDispose.size;
  }

  clear(): void {
    for (const item of this.toDispose) {
      try {
        item.dispose();
      } catch (_e) {
        /* */
      }
    }
    this.toDispose.clear();
    this.isDisposed = false;
  }
}

export function toDisposable(fn: () => void): Disposable {
  return { dispose: fn };
}
