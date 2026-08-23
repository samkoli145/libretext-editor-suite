/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: ناقل أحداث Publish-Subscribe الموحد - Event Bus
 * 🏛️ الدور: نواة النظام - نقل الأحداث بين المكونات بشكل فضفاض
 * 📥 المستهلك: كل ملفات core و shared و features
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pub-Sub Event Bus: ناقل أحداث publish-subscribe
 *    مع on/once/off و TypeScript generics
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المستمعين يجب أن يُنظَّفوا عند التنظيف
 *    2. الأحداث يجب أن تكون مسجلة بشكل صحيح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المُستمع قبل الإضافة
 *    - إزالة المستمعين عند الإغلاق
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type EventHandler<TPayload = unknown> = (payload: TPayload) => void;

export type Unsubscribe = () => void;

export class EventBus {
  private handlers: Map<string, Set<EventHandler<any>>> = new Map();

  public on<TPayload = unknown>(event: string, handler: EventHandler<TPayload>): Unsubscribe {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    const set = this.handlers.get(event)!;
    set.add(handler as EventHandler<any>);

    return () => {
      this.off(event, handler);
    };
  }

  public once<TPayload = unknown>(event: string, handler: EventHandler<TPayload>): Unsubscribe {
    const unsubscribe = this.on<TPayload>(event, (payload) => {
      unsubscribe();
      handler(payload);
    });

    return unsubscribe;
  }

  public off<TPayload = unknown>(event: string, handler: EventHandler<TPayload>): void {
    const set = this.handlers.get(event);

    if (!set) {
      return;
    }

    set.delete(handler as EventHandler<any>);

    if (set.size === 0) {
      this.handlers.delete(event);
    }
  }

  public emit<TPayload = unknown>(event: string, payload?: TPayload): void {
    const set = this.handlers.get(event);

    if (!set) {
      return;
    }

    for (const handler of [...set]) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`[EventBus] Error in handler for event "${event}"`, error);
      }
    }
  }

  public clear(event?: string): void {
    if (event) {
      this.handlers.delete(event);
      return;
    }

    this.handlers.clear();
  }
}
