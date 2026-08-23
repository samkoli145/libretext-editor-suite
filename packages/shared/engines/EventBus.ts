/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: EventBus.ts
 * 📂 المسار: packages/shared/engines/EventBus.ts
 * 🎯 الهدف الرئيسي: ناقل أحداث مركزي مع سجل تاريخي ودعم Disposable
 * 📋 المعايير:
 *    - typed events — كل حدث له نوع payload خاص
 *    - history buffer — آخر 100 حدث للفحص
 *    - auto-dispose — إزالة المستمع تلقائياً
 * 🏷️ المعرف: CORE-EVENTBUS-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Typed EventBus + Ring Buffer History + Disposable Subscription
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Disposable } from './Disposable';

export interface SystemEvent<T = unknown> {
  readonly id: string;
  readonly name: string;
  readonly payload: T;
  readonly timestamp: number;
}

export type EventHandler<T = unknown> = (event: SystemEvent<T>) => void;

export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();
  private history: SystemEvent[] = [];
  private readonly maxHistory: number;

  constructor(maxHistory = 100) {
    this.maxHistory = maxHistory;
  }

  emit<T>(name: string, payload: T): void {
    const event: SystemEvent<T> = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      payload,
      timestamp: Date.now(),
    };

    this.history.push(event as SystemEvent);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const set = this.handlers.get(name);
    if (set) {
      for (const handler of set) {
        try {
          handler(event);
        } catch (_e) {
          // منع تسرب الأخطاء من المستمعين
        }
      }
    }
  }

  on<T>(name: string, handler: EventHandler<T>): Disposable {
    if (!this.handlers.has(name)) {
      this.handlers.set(name, new Set());
    }
    const set = this.handlers.get(name)!;
    const genericHandler = handler as EventHandler<unknown>;
    set.add(genericHandler);

    return {
      dispose: () => {
        set.delete(genericHandler);
        if (set.size === 0) {
          this.handlers.delete(name);
        }
      },
    };
  }

  once<T>(name: string, handler: EventHandler<T>): Disposable {
    const wrapper: EventHandler<T> = (event) => {
      disposable.dispose();
      handler(event);
    };
    const disposable = this.on(name, wrapper);
    return disposable;
  }

  recent(): ReadonlyArray<SystemEvent> {
    return [...this.history];
  }

  handlerCount(name: string): number {
    return this.handlers.get(name)?.size ?? 0;
  }

  clearHistory(): void {
    this.history = [];
  }

  dispose(): void {
    this.handlers.clear();
    this.history = [];
  }
}
