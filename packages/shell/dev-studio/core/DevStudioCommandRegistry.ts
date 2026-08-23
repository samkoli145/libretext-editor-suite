/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: DevStudioCommandRegistry.ts
 * 📂 المسار: packages/shell/dev-studio/core/DevStudioCommandRegistry.ts
 * 🎯 الهدف: سجل الأوامر - تسجيل + تنفيذ + سجل التنفيذ
 * 🏷️ المعرف: PLUG-CMD-REGISTRY
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface DevStudioCommand {
  readonly id: string;
  readonly titleAr: string;
  readonly description: string;
  readonly category: string;
  readonly handler: (...args: unknown[]) => unknown | Promise<unknown>;
}

interface ExecutionEntry {
  readonly id: string;
  readonly timestamp: number;
  readonly success: boolean;
  readonly durationMs: number;
}

export class DevStudioCommandRegistry {
  private commands = new Map<string, DevStudioCommand>();
  private executionLog: ExecutionEntry[] = [];

  register(cmd: DevStudioCommand): void {
    if (this.commands.has(cmd.id)) {
      throw new Error(`Duplicate command: ${cmd.id}`);
    }
    this.commands.set(cmd.id, cmd);
  }

  async execute(id: string, ...args: unknown[]): Promise<{ ok: boolean; result: unknown }> {
    const cmd = this.commands.get(id);
    if (!cmd) throw new Error(`Command not found: ${id}`);
    const start = Date.now();
    try {
      const result = await cmd.handler(...args);
      this.executionLog.push({ id, timestamp: start, success: true, durationMs: Date.now() - start });
      return { ok: true, result };
    } catch (e) {
      this.executionLog.push({ id, timestamp: start, success: false, durationMs: Date.now() - start });
      throw e;
    }
  }

  listCommands(): string[] {
    return Array.from(this.commands.keys());
  }

  getExecutionLog(): readonly ExecutionEntry[] {
    return [...this.executionLog];
  }
}

export const commandRegistry = new DevStudioCommandRegistry();
