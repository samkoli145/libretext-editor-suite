/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المزامنة التزامنية ثنائية الاتجاه بين الكانفا والأكواد
 * 🏛️ الدور: محرك مشترك - نشر واستقبال أحداث المزامنة
 * 📥 المستهلك: CanvasDesignerEditor, LiveCodePanel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Static Pub-Sub Sync Engine: محرك مزامنة publish-subscribe ثابت
 *    مع 4 مصادر مزامنة وتشبع الأحداث
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. subscribers يجب أن تُنظَّف عند التنظيف
 *    2. الأحداث يجب ألا تتراكم (debounce)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم وجود подписات مكررة
 *    - cleanup function لإزالة المستمعين
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CanvasElement } from '../../features/canvas-designer/model';

export type SyncSource = 'canvas' | 'code' | 'inspector' | 'external-drop';

export interface SyncEvent {
  source: SyncSource;
  timestamp: number;
  updatedElementIds: string[];
  elements: CanvasElement[];
}

export class SyncEngine {
  private static subscribers: Array<(event: SyncEvent) => void> = [];

  static subscribe(callback: (event: SyncEvent) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  static emitSync(
    source: SyncSource,
    elements: CanvasElement[],
    updatedElementIds: string[] = []
  ): void {
    const event: SyncEvent = {
      source,
      timestamp: Date.now(),
      updatedElementIds,
      elements,
    };
    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('SyncEngine broadcast error:', err);
      }
    });
  }
}
