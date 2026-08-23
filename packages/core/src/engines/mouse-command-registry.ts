/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: mouse-command-registry.ts
 * 📂 المسار: packages/core/src/engines/mouse-command-registry.ts
 * 🎯 الهدف الرئيسي: سجل أوامر الماوس المكتسبة لكل أداة
 *    (Scale, Rotate, Snap, TextFormat, TableOp).
 * 📋 المعايير: صفر اعتماديات، دوال نقية < 50 سطر.
 * 🏷️ المعرف: CORE-ENG-013
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export type CommandHandler = (context: Readonly<Record<string, unknown>>) => void | Promise<void>;

export interface MouseCommand {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly handler: CommandHandler;
}

export function createMouseCommandRegistry() {
  const commands = new Map<string, MouseCommand>();

  function register(id: string, label: string, category: string, handler: CommandHandler): void {
    commands.set(id, { id, label, category, handler });
  }

  function unregister(id: string): boolean {
    return commands.delete(id);
  }

  function execute(id: string, context: Readonly<Record<string, unknown>>): boolean {
    const cmd = commands.get(id);
    if (!cmd) return false;
    try {
      const result = cmd.handler(context);
      if (result instanceof Promise) {
        result.catch((err) => console.error(`[MouseCommandRegistry] ${id}:`, err));
      }
      return true;
    } catch (err) {
      console.error(`[MouseCommandRegistry] ${id}:`, err);
      return false;
    }
  }

  function get(id: string): MouseCommand | undefined {
    return commands.get(id);
  }
  function list(): readonly MouseCommand[] {
    return Array.from(commands.values());
  }
  function listByCategory(category: string): readonly MouseCommand[] {
    return Array.from(commands.values()).filter((c) => c.category === category);
  }
  function size(): number {
    return commands.size;
  }
  function clear(): void {
    commands.clear();
  }

  return { register, unregister, execute, get, list, listByCategory, size, clear };
}
