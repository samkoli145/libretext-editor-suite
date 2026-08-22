/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نواة النظام - دورة حياة موحّدة للخدمات والجدولة والإضافات - Kernel
 * 🏛️ الدور: نواة النظام الرئيسي - boot و lifecycle management
 * 📥 المستهلك: Shell, createEditorServices
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unified Kernel Lifecycle: دورة حياة موحدة للنظام
 *    مع ServiceContainer و ExtensionManager و Scheduler
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. boot() يجب أن تُنفَّذ مرة واحدة فقط
 *    2. الخدمات يجب أن تُسجَّل قبل boot()
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص isReady قبل boot
 *    - Result<T, Error> pattern لمعالجة الأخطاء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { EventBus } from '../events/EventBus';
import type { CommandRegistry } from '../commands/CommandRegistry';
import { Result, ok, err } from '../../../shared/primitives/Result';
import { Scheduler } from '../../../shared/primitives/Scheduler';
import { ServiceContainer } from './ServiceContainer';
import { ExtensionManager } from './ExtensionManager';

export interface KernelContext {
  events: EventBus;
  commands: CommandRegistry;
  services: ServiceContainer;
  scheduler: Scheduler;
  extensions: ExtensionManager;
}

export class Kernel {
  private services = new ServiceContainer();
  private scheduler = new Scheduler();
  private extensions = new ExtensionManager();
  private isReady = false;

  constructor(
    private events: EventBus,
    private commands: CommandRegistry
  ) {}

  async boot(): Promise<Result<KernelContext, Error>> {
    if (this.isReady) {
      return ok(this.getContext());
    }

    try {
      this.isReady = true;
      this.events.emit('kernel:ready', { timestamp: Date.now() });
      return ok(this.getContext());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return err(new Error(`Kernel boot error: ${msg}`));
    }
  }

  async shutdown(): Promise<Result<void, Error>> {
    if (!this.isReady) return ok(undefined);

    try {
      this.events.emit('kernel:beforeShutdown', { timestamp: Date.now() });
      this.scheduler.cancelAll();

      const activeList = [...this.extensions.list()];
      for (const ext of activeList) {
        await this.extensions.deactivate(ext.id);
      }

      this.isReady = false;
      this.events.emit('kernel:shutdown', { timestamp: Date.now() });
      return ok(undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return err(new Error(`Kernel shutdown error: ${msg}`));
    }
  }

  getContext(): KernelContext {
    return {
      events: this.events,
      commands: this.commands,
      services: this.services,
      scheduler: this.scheduler,
      extensions: this.extensions,
    };
  }
}
