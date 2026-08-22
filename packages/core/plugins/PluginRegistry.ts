/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل الإضافات (Plugins) الرئيسي - Plugin Registry
 * 🏛️ الدور: نواة النظام - تسجيل واسترجاع الإضافات حسب نوع المستند
 * 📥 المستهلك: Shell, DocumentManager, كل المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Singleton Registry: سجل فريد
 *    مع Map<DocumentType, EditorPlugin> و Type-safe retrieval
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل نوع مستند يمكن أن يكون له إضافة واحدة فقط
 *    2. التسجيل المزدوج يُستبدل الأسبق
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - console.warn عند التسجيل المزدوج
 *    - fallback لـ undefined عند عدموجود الإضافة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocumentType, EditorPlugin } from "../types";

export class PluginRegistry {
  private static instance: PluginRegistry | null = null;

  /**
   * داخليًا نخزن Plugins بأي نوع data،
   * لأن كل Plugin يمكن أن يكون له نوع بيانات مختلف.
   */
  private plugins: Map<DocumentType, EditorPlugin<any>> = new Map();

  private constructor() {}

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }

    return PluginRegistry.instance;
  }

  public registerPlugin(plugin: EditorPlugin<any>): void {
    if (this.plugins.has(plugin.documentType)) {
      console.warn(
        `[PluginRegistry] Plugin already registered for documentType: "${plugin.documentType}". It will be replaced.`
      );
    }

    this.plugins.set(plugin.documentType, plugin);
  }

  public getPlugin<TData = unknown>(
    type: DocumentType
  ): EditorPlugin<TData> | undefined {
    return this.plugins.get(type) as EditorPlugin<TData> | undefined;
  }

  public getAllPlugins(): EditorPlugin<any>[] {
    return Array.from(this.plugins.values());
  }

  public hasPlugin(type: DocumentType): boolean {
    return this.plugins.has(type);
  }

  public unregisterPlugin(type: DocumentType): boolean {
    return this.plugins.delete(type);
  }

  public clear(): void {
    this.plugins.clear();
  }
}

/**
 * نسخة جاهزة للاستخدام في التطبيق.
 */
export const pluginRegistry = PluginRegistry.getInstance();
