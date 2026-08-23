/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: shared-utils.test.ts
 * 🎯 الهدف: اختبارات شاملة لـ Result + EventBus + Disposable + Scheduler
 * 🧪 الاختبارات: vitest run packages/shared/tests/shared-utils.test.ts
 * 🏷️ المعرف: TEST-SHARED-UTILS-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi } from 'vitest';
import { Ok, Err, ok, err, tryCatch, tryCatchAsync } from '../utils/result';
import { EventBus } from '../engines/EventBus';
import { DisposableStore, toDisposable } from '../engines/Disposable';
import { Scheduler } from '../engines/Scheduler';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Result<T, E>
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Result<T, E>', () => {
  describe('Ok', () => {
    it('يجب أن يُنشئ Ok بقيمة صحيحة', () => {
      const r = ok(42);
      expect(r.isOk).toBe(true);
      expect(r.isErr).toBe(false);
      expect(r.unwrap()).toBe(42);
    });

    it('يجب أن يُرجع unwrapOr القيمة الأصلية', () => {
      const r = ok('hello');
      expect(r.unwrapOr('fallback')).toBe('hello');
    });

    it('يجب أن يُحوّل عبر map', () => {
      const r = ok(5);
      const mapped = r.map((x) => x * 2);
      expect(mapped.unwrap()).toBe(10);
    });

    it('يجب أن يُحوّل عبر flatMap', () => {
      const r = ok(5);
      const flat = r.flatMap((x) => ok(x * 3));
      expect(flat.unwrap()).toBe(15);
    });

    it('يجب أن يُنفّذ match branch الصحيح', () => {
      const r = ok(10);
      const result = r.match(
        (v) => `value: ${v}`,
        (_e) => 'error',
      );
      expect(result).toBe('value: 10');
    });

    it('يجب أن يُرجع toString صالح', () => {
      expect(ok(42).toString()).toBe('Ok(42)');
    });
  });

  describe('Err', () => {
    it('يجب أن يُنشئ Err بخطأ', () => {
      const r = err(new Error('fail'));
      expect(r.isOk).toBe(false);
      expect(r.isErr).toBe(true);
      expect(r.error.message).toBe('fail');
    });

    it('يجب أن يُرجع unwrapOr القيمة الافتراضية', () => {
      const r = err(new Error('fail'));
      expect(r.unwrapOr('fallback')).toBe('fallback');
    });

    it('يجب أن يُlycer map (لا يُغيّر الخطأ)', () => {
      const r = err('original');
      const mapped = r.map((_v: never) => 42);
      expect(mapped.isErr).toBe(true);
    });

    it('يجب أن يُنفّذ match branch الخطأ', () => {
      const r = err('oops');
      const result = r.match(
        (_v) => 'ok',
        (e) => `error: ${e}`,
      );
      expect(result).toBe('error: oops');
    });
  });

  describe('tryCatch', () => {
    it('يجب أن يُchatch نجاح', () => {
      const r = tryCatch(() => 42);
      expect(r.isOk).toBe(true);
      expect(r.unwrap()).toBe(42);
    });

    it('يجب أن يُchatch خطأ', () => {
      const r = tryCatch(() => {
        throw new Error('boom');
      });
      expect(r.isErr).toBe(true);
      if (r.isErr) expect(r.error.message).toBe('boom');
    });

    it('يجب أن يُchatch خطأ غير Error', () => {
      const r = tryCatch(() => {
        throw 'string error';
      });
      expect(r.isErr).toBe(true);
    });
  });

  describe('tryCatchAsync', () => {
    it('يجب أن يُchatch نجاح async', async () => {
      const r = await tryCatchAsync(async () => 42);
      expect(r.isOk).toBe(true);
      expect(r.unwrap()).toBe(42);
    });

    it('يجب أن يُchatch خطأ async', async () => {
      const r = await tryCatchAsync(async () => {
        throw new Error('async boom');
      });
      expect(r.isErr).toBe(true);
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EventBus
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('EventBus', () => {
  it('يجب أن يُرسل ويُستقبل الأحداث', () => {
    const bus = new EventBus();
    const received: number[] = [];
    bus.on('test', (e) => received.push(e.payload as number));
    bus.emit('test', 1);
    bus.emit('test', 2);
    expect(received).toEqual([1, 2]);
  });

  it('يجب أن يُخزّن تاريخ الأحداث', () => {
    const bus = new EventBus();
    bus.emit('a', 'x');
    bus.emit('b', 'y');
    expect(bus.recent()).toHaveLength(2);
    expect(bus.recent()[0]!.name).toBe('a');
  });

  it('يجب أن يحترم maxHistory', () => {
    const bus = new EventBus(3);
    for (let i = 0; i < 5; i++) bus.emit('e', i);
    expect(bus.recent()).toHaveLength(3);
    expect(bus.recent()[0]!.payload).toBe(2);
  });

  it('يجب أن يُلغي المستمع عبر disposable', () => {
    const bus = new EventBus();
    const received: string[] = [];
    const sub = bus.on('test', (e) => received.push(e.payload as string));
    bus.emit('test', 'a');
    sub.dispose();
    bus.emit('test', 'b');
    expect(received).toEqual(['a']);
  });

  it('يجب أن يدعم once()', () => {
    const bus = new EventBus();
    const received: number[] = [];
    bus.once('test', (e) => received.push(e.payload as number));
    bus.emit('test', 1);
    bus.emit('test', 2);
    expect(received).toEqual([1]);
  });

  it('يجب أن يمنع تسرب الأخطاء من المستمعين', () => {
    const bus = new EventBus();
    bus.on('test', () => {
      throw new Error('handler error');
    });
    expect(() => bus.emit('test', 'data')).not.toThrow();
  });

  it('يجب أن يعدّ المستمعين', () => {
    const bus = new EventBus();
    expect(bus.handlerCount('test')).toBe(0);
    const sub = bus.on('test', () => {});
    expect(bus.handlerCount('test')).toBe(1);
    sub.dispose();
    expect(bus.handlerCount('test')).toBe(0);
  });

  it('يجب أن يُنظّف dispose()', () => {
    const bus = new EventBus();
    bus.on('test', () => {});
    bus.emit('test', 'x');
    bus.dispose();
    expect(bus.recent()).toHaveLength(0);
    expect(bus.handlerCount('test')).toBe(0);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DisposableStore
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('DisposableStore', () => {
  it('يجب أن يجمع ويُنظّف الموارد', () => {
    const store = new DisposableStore();
    const disposed: string[] = [];
    store.add(toDisposable(() => disposed.push('a')));
    store.add(toDisposable(() => disposed.push('b')));
    store.dispose();
    expect(disposed).toEqual(['a', 'b']);
  });

  it('يجب أن يمنع التكرار بعد dispose', () => {
    const store = new DisposableStore();
    let count = 0;
    store.add(toDisposable(() => count++));
    store.dispose();
    expect(count).toBe(1);
    store.dispose();
    expect(count).toBe(1);
  });

  it('يجب أن يحذف الموارد المضافة بعد dispose', () => {
    const store = new DisposableStore();
    store.add(toDisposable(() => {}));
    expect(store.size).toBe(1);
    store.dispose();
    expect(store.size).toBe(0);
  });

  it('يجب أن يمنع تسرب الأخطاء عند التنظيف', () => {
    const store = new DisposableStore();
    store.add(
      toDisposable(() => {
        throw new Error('cleanup error');
      }),
    );
    expect(() => store.dispose()).not.toThrow();
  });

  it('يجب أن يدعم clear()', () => {
    const store = new DisposableStore();
    const disposed: string[] = [];
    store.add(toDisposable(() => disposed.push('x')));
    store.clear();
    expect(disposed).toEqual(['x']);
    expect(store.size).toBe(0);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Scheduler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Scheduler', () => {
  it('يجب أن يُؤجل التنفيذ بـ debounce', async () => {
    const scheduler = new Scheduler();
    const fn = vi.fn();
    scheduler.debounce({ id: 't1', run: fn }, 50);
    expect(fn).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 80));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('يجب أن يُلغي المهمة عبر cancel', async () => {
    const scheduler = new Scheduler();
    const fn = vi.fn();
    scheduler.debounce({ id: 't1', run: fn }, 100);
    scheduler.cancel('t1');
    await new Promise((r) => setTimeout(r, 150));
    expect(fn).not.toHaveBeenCalled();
  });

  it('يجب أن يُلغي كل المهام عبر cancelAll', async () => {
    const scheduler = new Scheduler();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    scheduler.debounce({ id: 't1', run: fn1 }, 50);
    scheduler.debounce({ id: 't2', run: fn2 }, 50);
    scheduler.cancelAll();
    await new Promise((r) => setTimeout(r, 80));
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  it('يجب أن يُعيد تشغيل عند الاستدعاء المتكرر (debounce behavior)', async () => {
    const scheduler = new Scheduler();
    const fn = vi.fn();
    scheduler.debounce({ id: 't1', run: fn }, 50);
    await new Promise((r) => setTimeout(r, 30));
    scheduler.debounce({ id: 't1', run: fn }, 50);
    await new Promise((r) => setTimeout(r, 80));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('يجب أن يمنع تسرب الأخطاء من المهام', async () => {
    const scheduler = new Scheduler();
    scheduler.debounce(
      {
        id: 't1',
        run: () => {
          throw new Error('task error');
        },
      },
      10,
    );
    await new Promise((r) => setTimeout(r, 30));
    expect(scheduler.pendingCount).toBe(0);
  });

  it('يجب أن يعدّ المهام المعلقة', () => {
    const scheduler = new Scheduler();
    expect(scheduler.pendingCount).toBe(0);
    scheduler.debounce({ id: 't1', run: () => {} }, 1000);
    expect(scheduler.pendingCount).toBe(1);
  });

  it('positive: cancel يُرجع true عند الإلغاء الناجح', () => {
    const scheduler = new Scheduler();
    scheduler.debounce({ id: 't1', run: () => {} }, 1000);
    expect(scheduler.cancel('t1')).toBe(true);
  });

  it('negative: cancel يُرجع false لمهمة غير موجودة', () => {
    const scheduler = new Scheduler();
    expect(scheduler.cancel('nonexistent')).toBe(false);
  });
});
