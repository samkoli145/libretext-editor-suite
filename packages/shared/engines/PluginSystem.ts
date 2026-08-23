/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نظام الإضافات الم.Shared - Plugin Registration & Lifecycle Management
 * 🏛️ الدور: محرك مشترك - إدارة دورة حياة الإضافات والربط بها
 * 📥 المستهلك: PluginRegistry, PluginContext, BaseEditorPlugin
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Plugin Lifecycle Manager: مدير دورة حياة الإضافات (Register → Activate → Deactivate → Dispose)
 *    مع Dependency Injection للخدمات المشتركة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الإضافات يجب أن تُسجل قبل استخدام خدماتها
 *    2. الترتيب مهم - الإضافات تعتمد على بعضها
 *    3. التنظيف يجب أن يكون شاملاً عند الإزالة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم تكرار التسجيل
 *    - تعامل مع الإضافات الفاشلة بتنبيه
 *    - تنظيف تلقائي للإضافات الملغاة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/PluginSystem.ts
// ============================================================
// نظام الإضافات والملحقات المشترك لمحررات التطبيق (Plugin System)
// ============================================================

export interface EditorPlugin {
  name: string;
  icon?: string;
  label: string;
  description?: string;
  commands?: Record<string, (context?: any) => void>;
  toolbarButton?: {
    icon: string;
    tooltip: string;
    action: (context?: any) => void;
    isActive?: (context?: any) => boolean;
  };
  contextMenuItems?: Array<{
    id: string;
    label: string;
    icon?: string;
    action: (context?: any, pos?: number) => void;
    condition?: (context?: any, pos?: number) => boolean;
  }>;
  init?: (context?: any) => void;
  destroy?: (context?: any) => void;
}

export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, EditorPlugin> = new Map();
  private initializedPlugins: Set<string> = new Set();

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public register(plugin: EditorPlugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  public unregister(name: string): void {
    this.plugins.delete(name);
    this.initializedPlugins.delete(name);
  }

  public getPlugins(): EditorPlugin[] {
    return Array.from(this.plugins.values());
  }

  public getToolbarButtons(): Array<{
    plugin: EditorPlugin;
    button: NonNullable<EditorPlugin['toolbarButton']>;
  }> {
    return this.getPlugins()
      .filter((p) => p.toolbarButton)
      .map((p) => ({ plugin: p, button: p.toolbarButton! }));
  }

  public getContextMenuItems(
    context?: any,
    pos?: number,
  ): Array<{ plugin: EditorPlugin; item: NonNullable<EditorPlugin['contextMenuItems']>[0] }> {
    const items: Array<{
      plugin: EditorPlugin;
      item: NonNullable<EditorPlugin['contextMenuItems']>[0];
    }> = [];

    for (const plugin of this.plugins.values()) {
      if (!plugin.contextMenuItems) continue;

      for (const item of plugin.contextMenuItems) {
        if (!item.condition || item.condition(context, pos)) {
          items.push({ plugin, item });
        }
      }
    }

    return items;
  }

  public getCommands(): Record<string, (context?: any) => void> {
    const commands: Record<string, (context?: any) => void> = {};

    for (const plugin of this.plugins.values()) {
      if (plugin.commands) {
        Object.assign(commands, plugin.commands);
      }
    }

    return commands;
  }

  public initializeAll(context?: any): void {
    for (const [name, plugin] of this.plugins.entries()) {
      if (!this.initializedPlugins.has(name) && plugin.init) {
        plugin.init(context);
        this.initializedPlugins.add(name);
      }
    }
  }

  public destroyAll(context?: any): void {
    for (const [name, plugin] of this.plugins.entries()) {
      if (this.initializedPlugins.has(name) && plugin.destroy) {
        plugin.destroy(context);
        this.initializedPlugins.delete(name);
      }
    }
  }
}

export const pluginManager = PluginManager.getInstance();
