/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: فهرس تصدير النواة الأساسية للنظام - Core Barrel Export
 * 🏛️ الدور: فهرس تصدير - re-export للأنواع والأحداث وسجل الأوامر والمسجل والمستندات والتخزين
 * 📥 المستهلك: كل ملفات المشروع
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Barrel Export Pattern: نمط التصدير الجماعي
 *    لتوحيد نقاط الدخول للنواة الأساسية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التصدير يجب أن يكون كاملاً
 *    2. لا تكرار للتصديرات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام export * from
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export * from "./types";
export * from "./events/EventBus";
export * from "./commands/CommandRegistry";
export * from "./contributions/ContributionRegistry";
export * from "./documents/DocumentManager";
export * from "./storage/IndexedDBDocumentStorage";
export * from "./storage/LocalForageDocumentStorage";
export * from "./plugins/PluginContext";
export * from "./plugins/PluginRegistry";
export * from "./plugins/BaseEditorPlugin";
export * from "./createEditorServices";
export * from "../shared/primitives/Result";
export * from "../shared/primitives/Disposable";
export * from "../shared/primitives/LocalizedString";
export * from "../shared/primitives/SystemTypes";
export * from "./system/ServiceContainer";
export * from "../shared/primitives/Scheduler";
export * from "./system/ExtensionManager";
export * from "./system/Kernel";
export * from "./src/blocks/html-unified-block";
export * from "./src/blocks/html-block-types";
export * from "./src/blocks/html-block-registry";
export * from "./src/blocks/html-block-generator";
export * from "./src/blocks/html-block-layout-engine";
export * from "./src/blocks/html-block-data-engine";
export * from "./src/blocks/html-block-tailwind-editor";
export * from "./src/blocks/html-block-operations";
export * from "./src/blocks/html-block-presets";
export * from "./src/blocks/html-block-tsx-generator";
