/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: بنية التحرير الآمن للموارد - Disposable Pattern
 * 🏛️ الدور: نوع أساسي - واجهة وtedad للموارد القابلة للتنظيف
 * 📥 المستهلك: كل المحركات والمكونات التي تدير موارد (listeners, timers, etc.)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Disposable Pattern: واجهة dispose() مع DisposableStore لتخزين وتنظيم
 *    تنظيف الموارد تلقائياً
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل مورد يجب أن يستدعي dispose() عند الانتهاء
 *    2. DisposableStore يجب أن يُنظف مرة واحدة فقط
 *    3. بعد dispose() يجب ألا يُستخدم المورد
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص disposed قبل الاستخدام
 *    - تعامل مع dispose مكرر بصمت
 *    - تسجيل الموارد في store
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// src/shared/primitives/Disposable.ts

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
      } catch (error) {
        console.error('Error disposing resource:', error);
      }
    }
    this.toDispose.clear();
  }
}
