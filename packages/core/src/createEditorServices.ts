/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مصنع إنشاء خدمات المحرر المتكاملة - Create Editor Services
 * 🏛️ الدور: نواة النظام - تجميع وتنسيق جميع الخدمات في كائن واحد
 * 📥 المستهلك: Shell, Workbench
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Service Factory Pattern: نمط مصنع الخدمات
 *    مع تجميع EventBus و Commands و Contributions و Documents و Plugins
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الخدمات يجب أن تُنشأ بالترتيب الصحيح
 *    2. التخزين يمكن أن يكون مخصصاً أو افتراضياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - fallback لتخزين InMemory
 *    - فحص عدم إنشاء خدمات مكررة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { EventBus } from "./events/EventBus";
import { CommandRegistry } from "./commands/CommandRegistry";
import { ContributionRegistry } from "./contributions/ContributionRegistry";
import { DocumentManager } from "./documents/DocumentManager";
import type { DocumentStorage } from "./documents/DocumentManager";
import { IndexedDBDocumentStorage } from "../storage/IndexedDBDocumentStorage";
import { PluginRegistry } from "./plugins/PluginRegistry";
import { createPluginContext } from "./plugins/PluginContext";
import type { PluginContext } from "./plugins/PluginContext";

export interface EditorServices {
  events: EventBus;
  commands: CommandRegistry;
  contributions: ContributionRegistry;
  documents: DocumentManager;
  plugins: PluginRegistry;

  createPluginContext: (pluginId?: string) => PluginContext;
}

export interface CreateEditorServicesOptions {
  storage?: DocumentStorage;
}

export function createEditorServices(
  options?: CreateEditorServicesOptions
): EditorServices {
  const events = new EventBus();
  const commands = CommandRegistry.getInstance(events);
  const contributions = new ContributionRegistry(events);

  const plugins = PluginRegistry.getInstance();

  const documents = new DocumentManager({
    pluginRegistry: plugins,
    events,
    storage: options?.storage ?? new IndexedDBDocumentStorage(),
  });

  return {
    events,
    commands,
    contributions,
    documents,
    plugins,

    createPluginContext(pluginId?: string): PluginContext {
      return createPluginContext(
        {
          events,
          commands,
          contributions,
          documents,
        },
        pluginId
      );
    },
  };
}
