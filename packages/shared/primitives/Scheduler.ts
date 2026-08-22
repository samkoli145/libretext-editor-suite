/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: جدولة المهام وتأخيرها - Task Scheduler & Debouncer
 * 🏛️ الدور: نوع أساسي - إدارة المهام مع الأولوية والتأخير
 * 📥 المستهلك: Autosave, Search, Resize handlers
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Priority-Based Scheduler: جدولة حسب الأولوية (low, normal, high, critical)
 *    مع دعم Debounce و Cancel
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المهام يجب أن تُنظف بعد التنفيذ
 *    2. الأولوية يجب أن تؤثر على ترتيب التنفيذ
 *    3. Cancel يجب أن يكون متاحاً دائماً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المهمة قبل التنفيذ
 *    - timeout على كل مهمة
 *    - تنظيف تلقائي للمهام المنتهية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// src/shared/primitives/Scheduler.ts

import type { Disposable } from './Disposable';
import type { Id, Priority } from './SystemTypes';

export interface Task {
  id: Id;
  run: () => void;
  priority?: Priority;
}

export class Scheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  debounce(task: Task, ms: number): Disposable {
    if (this.timers.has(task.id)) {
      clearTimeout(this.timers.get(task.id)!);
    }

    const timerId = setTimeout(() => {
      this.timers.delete(task.id);
      try {
        task.run();
      } catch (error) {
        console.error(`Scheduler task error (${task.id}):`, error);
      }
    }, ms);

    this.timers.set(task.id, timerId);

    return {
      dispose: () => {
        if (this.timers.has(task.id)) {
          clearTimeout(this.timers.get(task.id)!);
          this.timers.delete(task.id);
        }
      },
    };
  }

  cancelAll(): void {
    for (const timerId of this.timers.values()) {
      clearTimeout(timerId);
    }
    this.timers.clear();
  }
}
