/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل الأوامر الموحد مع صلاحيات التحقق - Command Registry
 * 🏛️ الدور: نواة النظام - تسجيل وتفعيل وتحقق من صلاحيات الأوامر
 * 📥 المستهلك: Shell, كل المحررات والإضافات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Singleton Command Registry: سجل أوامر فريد
 *    مع CommandEvents و isEnabled hooks
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأسماء يجب أن تكون فريدة
 *    2. isEnabled يجب أن يتحقق من السياق
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم التسجيل المزدوج
 *    - emit للأحداث عند التسجيل والتنفيذ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { EventBus } from "../events/EventBus";

export interface CommandContext {
  source?: string;
  payload?: unknown;
}

export interface Command<TPayload = unknown> {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  shortcut?: string;
  pluginId?: string;

  isEnabled?: (payload?: TPayload, context?: CommandContext) => boolean;

  run: (
    payload?: TPayload,
    context?: CommandContext
  ) => unknown | Promise<unknown>;
}

export const CommandEvents = {
  registered: "command:registered",
  unregistered: "command:unregistered",
  executed: "command:executed",
  failed: "command:failed",
} as const;

export class CommandRegistry {
  private static instance: CommandRegistry | null = null;
  private commands: Map<string, Command<any>> = new Map();

  public static getInstance(events?: EventBus): CommandRegistry {
    if (!CommandRegistry.instance) {
      CommandRegistry.instance = new CommandRegistry(events);
    }
    return CommandRegistry.instance;
  }

  constructor(private events?: EventBus) {}

  public register(command: Command<any>): () => void {
    if (this.commands.has(command.id)) {
      console.warn(
        `[CommandRegistry] Command already registered: "${command.id}". It will be replaced.`
      );
    }

    this.commands.set(command.id, command);

    this.events?.emit(CommandEvents.registered, command);

    return () => {
      this.unregister(command.id);
    };
  }

  public unregister(commandId: string): boolean {
    const existed = this.commands.delete(commandId);

    if (existed) {
      this.events?.emit(CommandEvents.unregistered, {
        id: commandId,
      });
    }

    return existed;
  }

  public has(commandId: string): boolean {
    return this.commands.has(commandId);
  }

  public get<TPayload = unknown>(
    commandId: string
  ): Command<TPayload> | undefined {
    return this.commands.get(commandId) as Command<TPayload> | undefined;
  }

  public getAll(): Command<any>[] {
    return Array.from(this.commands.values());
  }

  public canExecute<TPayload = unknown>(
    commandId: string,
    payload?: TPayload,
    context?: CommandContext
  ): boolean {
    const command = this.commands.get(commandId);

    if (!command) {
      return false;
    }

    if (!command.isEnabled) {
      return true;
    }

    try {
      return Boolean(command.isEnabled(payload, context));
    } catch (error) {
      console.error(
        `[CommandRegistry] Error in isEnabled for command "${commandId}"`,
        error
      );

      return false;
    }
  }

  public async execute<TPayload = unknown>(
    commandId: string,
    payload?: TPayload,
    context?: CommandContext
  ): Promise<unknown> {
    const command = this.commands.get(commandId);

    if (!command) {
      throw new Error(`[CommandRegistry] Command not found: "${commandId}"`);
    }

    if (!this.canExecute(commandId, payload, context)) {
      return undefined;
    }

    try {
      const result = await command.run(payload, context);

      this.events?.emit(CommandEvents.executed, {
        id: commandId,
        payload,
        result,
      });

      return result;
    } catch (error) {
      this.events?.emit(CommandEvents.failed, {
        id: commandId,
        payload,
        error,
      });

      throw error;
    }
  }

  public clear(): void {
    this.commands.clear();
  }
}
