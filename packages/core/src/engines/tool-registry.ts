/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: tool-registry.ts
 * 📂 المسار: packages/core/src/engines/tool-registry.ts
 * 🎯 الهدف الرئيسي: سجل مركزي للأدوات يقبل تسجيل الأدوات من إضافات خارجية.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية (لا imports لمكتبات خارجية أو إضافات أخرى).
 *    - نظام تسجيل ديناميكي (Lazy Registration).
 *    - لا يتجاوز 50 سطراً للدالة الواحدة.
 * 🧪 الاختبارات: (تضاف لاحقاً)
 * 🏷️ المعرف: CORE-020
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Inversion of Control (IoC): النواة لا تعرف عن الأدوات (مثل LaTeX)،
 *    بل توفر واجهة موحدة `UnifiedToolItem` لكي تقوم الإضافات بتسجيل نفسها.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تكرار معرفات الأدوات (Tool IDs).
 *    2. ضمان عزل الأدوات عن بعضها البعض وعدم وجود اقتران (Coupling).
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ToolCategory = 
  | 'text' | 'format' | 'insert' | 'geometry' 
  | 'logic' | 'data' | 'system' | 'visual' | string;

export interface UnifiedToolItem {
  readonly id: string;
  readonly name: string;
  readonly nameAr: string;
  readonly icon?: string;
  readonly category: ToolCategory;
  readonly actionId: string;
  readonly payload?: unknown;
  readonly description?: string;
  execute?: (context: any) => boolean;
}

export class ToolRegistry {
  private static instance: ToolRegistry;
  private readonly tools: Map<string, UnifiedToolItem> = new Map();

  private constructor() {}

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  public registerTool(tool: UnifiedToolItem): void {
    if (this.tools.has(tool.id)) {
      console.warn(`[ToolRegistry] Tool with ID ${tool.id} is already registered. Overwriting.`);
    }
    this.tools.set(tool.id, tool);
  }

  public registerTools(tools: UnifiedToolItem[]): void {
    for (const tool of tools) {
      this.registerTool(tool);
    }
  }

  public getTool(id: string): UnifiedToolItem | undefined {
    return this.tools.get(id);
  }

  public getAllTools(): UnifiedToolItem[] {
    return Array.from(this.tools.values());
  }

  public getToolsByCategory(category: ToolCategory): UnifiedToolItem[] {
    return this.getAllTools().filter(t => t.category === category);
  }

  public getCategories(): ToolCategory[] {
    const categories = new Set(this.getAllTools().map(t => t.category));
    return Array.from(categories);
  }

  public executeTool(toolId: string, context: any): boolean {
    const tool = this.tools.get(toolId);
    if (!tool) {
      console.warn(`[ToolRegistry] Tool ${toolId} not found.`);
      return false;
    }
    
    if (tool.execute) {
      return tool.execute(context);
    }
    
    return false; // Tools must provide an executor or be handled externally
  }
}

export const toolRegistry = ToolRegistry.getInstance();
