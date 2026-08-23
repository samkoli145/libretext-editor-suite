/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نظام أحداث النشر والاشتراك (Pub/Sub Event Bus) لاستوديو التطوير
 * 🏛️ الدور: وسيط معزول لربط أجنحة ومحركات الاستوديو دون اقتران مباشر (Decoupled)
 * 📥 المستهلك: DevStudioEngine, Workbench, Panels
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Type-Safe Zero-Dependency Event Bus: دعم كامل للأنواع دون استهلاك ذاكرة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تنظيف الاشتراكات (Unsubscribe) لمنع تسريب الذاكرة.
 *    2. حماية مستمعي الأحداث من رمي استثناءات غير معالجة تؤثر على باقي النظام.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - عزل تنفيذ كل معالج حدث بـ try/catch.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Checkpoint, DevTask, DoctorReport } from './DevStudioTypes';

export type DevStudioEventMap = {
  'task:created': DevTask;
  'task:status': { taskId: string; status: DevTask['status']; error?: string };
  'task:completed': DevTask;
  'doctor:evaluated': DoctorReport;
  'checkpoint:created': Checkpoint;
  'checkpoint:restored': Checkpoint;
  'tree:updated': { path?: string; action: string };
  'log:entry': { level: 'info' | 'warn' | 'error' | 'success'; message: string; timestamp: number };
};

export type DevStudioEventListener<K extends keyof DevStudioEventMap> = (
  payload: DevStudioEventMap[K],
) => void;

export class DevStudioEventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners = new Map<string, Set<DevStudioEventListener<any>>>();

  on<K extends keyof DevStudioEventMap>(event: K, listener: DevStudioEventListener<K>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener);

    return () => {
      this.off(event, listener);
    };
  }

  off<K extends keyof DevStudioEventMap>(event: K, listener: DevStudioEventListener<K>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
    }
  }

  emit<K extends keyof DevStudioEventMap>(event: K, payload: DevStudioEventMap[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;

    for (const listener of set) {
      try {
        listener(payload);
      } catch (err) {
        console.error(`[DevStudioEventBus] Error in listener for event "${event}":`, err);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const globalDevStudioEvents = new DevStudioEventBus();
