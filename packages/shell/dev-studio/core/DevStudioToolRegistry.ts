/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: DevStudioToolRegistry.ts
 * 📂 المسار: packages/shell/dev-studio/core/DevStudioToolRegistry.ts
 * 🎯 الهدف: سجل الأدوات — تسجيل + تنفيذ + فئات + مخاطر
 * 🏷️ المعرف: PLUG-TOOL-REGISTRY
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ToolRisk = 'safe' | 'caution' | 'danger';
export type ToolCategory = 'scan' | 'test' | 'lint' | 'fix' | 'git' | 'report' | 'guard';

export interface ToolDefinition {
  readonly id: string;
  readonly name: string;
  readonly nameAr: string;
  readonly category: ToolCategory;
  readonly risk: ToolRisk;
  readonly description: string;
  readonly execute: (args: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolResult {
  ok: boolean;
  data?: unknown;
  error?: string;
  durationMs: number;
}

export class DevStudioToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }

  unregister(id: string): boolean {
    return this.tools.delete(id);
  }

  get(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  listTools(): string[] {
    return Array.from(this.tools.keys());
  }

  listByCategory(cat: ToolCategory): string[] {
    return Array.from(this.tools.values())
      .filter(t => t.category === cat)
      .map(t => t.id);
  }

  async execute(id: string, args: Record<string, unknown> = {}): Promise<ToolResult> {
    const tool = this.tools.get(id);
    if (!tool) return { ok: false, error: `أداة "${id}" غير موجودة`, durationMs: 0 };
    const start = Date.now();
    try {
      const result = await tool.execute(args);
      result.durationMs = Date.now() - start;
      return result;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e), durationMs: Date.now() - start };
    }
  }
}

export const toolRegistry = new DevStudioToolRegistry();
