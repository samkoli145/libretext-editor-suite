/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سياق الإضافة - واجهة تسجيل الأوامر والمساهمات والأحداث
 * 🏛️ الدور: مكون مشترك - توفر API آمن للإضافات للتفاعل مع النظام
 * 📥 المستهلك: كل الإضافات (CanvasDesignerPlugin, RichTextPlugin, PdfPlugin, UIDsPlugin)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Scoped Plugin Context: سياق إضافة محدود النطاق
 *    مع registerCommand و registerContribution و on/once
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. pluginId يجب أن يكون محدداً لمنع التداخل
 *    2. المستمعين يجب أن يُنظَّفوا عند التنظيف
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص pluginId قبل التسجيل
 *    - إزالة المستمعين عند الإغلاق
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Command, CommandRegistry } from '../commands/CommandRegistry';
import type { EventBus, EventHandler, Unsubscribe } from '../events/EventBus';
import type { Contribution, ContributionRegistry } from '../contributions/ContributionRegistry';
import type { DocumentManager } from '../documents/DocumentManager';

export interface PluginServices {
  commands: CommandRegistry;
  events: EventBus;
  contributions: ContributionRegistry;
  documents: DocumentManager;
}

export interface PluginContext extends PluginServices {
  pluginId?: string;

  registerCommand: (command: Command) => Unsubscribe;

  registerContribution: (contribution: Contribution) => Unsubscribe;

  on: <TPayload = unknown>(event: string, handler: EventHandler<TPayload>) => Unsubscribe;

  once: <TPayload = unknown>(event: string, handler: EventHandler<TPayload>) => Unsubscribe;

  off: <TPayload = unknown>(event: string, handler: EventHandler<TPayload>) => void;

  emit: <TPayload = unknown>(event: string, payload?: TPayload) => void;

  executeCommand: <TPayload = unknown>(commandId: string, payload?: TPayload) => Promise<unknown>;

  log: (...args: unknown[]) => void;
}

export function createPluginContext(services: PluginServices, pluginId?: string): PluginContext {
  return {
    ...services,

    pluginId,

    registerCommand(command: Command): Unsubscribe {
      return services.commands.register({
        ...command,
        pluginId: command.pluginId ?? pluginId,
      });
    },

    registerContribution(contribution: Contribution): Unsubscribe {
      return services.contributions.register({
        ...contribution,
        pluginId: contribution.pluginId ?? pluginId,
      } as Contribution);
    },

    on<TPayload = unknown>(event: string, handler: EventHandler<TPayload>): Unsubscribe {
      return services.events.on(event, handler);
    },

    once<TPayload = unknown>(event: string, handler: EventHandler<TPayload>): Unsubscribe {
      return services.events.once(event, handler);
    },

    off<TPayload = unknown>(event: string, handler: EventHandler<TPayload>): void {
      services.events.off(event, handler);
    },

    emit<TPayload = unknown>(event: string, payload?: TPayload): void {
      services.events.emit(event, payload);
    },

    executeCommand<TPayload = unknown>(commandId: string, payload?: TPayload): Promise<unknown> {
      return services.commands.execute(commandId, payload, {
        source: pluginId,
      });
    },

    log(...args: unknown[]): void {
      console.log(`[Plugin:${pluginId ?? 'unknown'}]`, ...args);
    },
  };
}

export interface Activatable {
  activate?: (context: PluginContext) => void | Promise<void>;
  deactivate?: () => void | Promise<void>;
}

export async function activateObject(target: Activatable, context: PluginContext): Promise<void> {
  if (target.activate) {
    await target.activate(context);
  }
}

export async function deactivateObject(target: Activatable): Promise<void> {
  if (target.deactivate) {
    await target.deactivate();
  }
}
