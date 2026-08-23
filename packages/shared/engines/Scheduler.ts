/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: Scheduler.ts
 * 📂 المسار: packages/shared/engines/Scheduler.ts
 * 🎯 الهدف الرئيسي: مجدول مهام مع debounce وcancel — لمنع التكرار الزائد
 * 📋 المعايير:
 *    - debounce(task, ms) — تأجيل التنفيذ حتى يتوقف الاستدعاء
 *    - cancel(taskId) — إلغاء مهمة محددة
 *    - cancelAll() — إلغاء كل المهام المعلقة
 * 🏷️ المعرف: CORE-SCHEDULER-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Debounce Scheduler + Disposable Cleanup + Error Isolation
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Disposable } from './Disposable';

export interface Task {
  id: string;
  run: () => void;
}

export class Scheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  debounce(task: Task, ms: number): Disposable {
    if (this.timers.has(task.id)) {
      clearTimeout(this.timers.get(task.id));
    }

    const timerId = setTimeout(() => {
      this.timers.delete(task.id);
      try {
        task.run();
      } catch (_e) {
        // عزل الخطأ — المهمة الفاشلة لا تقتل المجدول
      }
    }, ms);

    this.timers.set(task.id, timerId);

    return {
      dispose: () => {
        if (this.timers.has(task.id)) {
          clearTimeout(this.timers.get(task.id));
          this.timers.delete(task.id);
        }
      },
    };
  }

  cancel(taskId: string): boolean {
    if (this.timers.has(taskId)) {
      clearTimeout(this.timers.get(taskId));
      this.timers.delete(taskId);
      return true;
    }
    return false;
  }

  cancelAll(): void {
    for (const timerId of this.timers.values()) {
      clearTimeout(timerId);
    }
    this.timers.clear();
  }

  get pendingCount(): number {
    return this.timers.size;
  }
}
