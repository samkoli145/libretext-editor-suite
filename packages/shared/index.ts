/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: فهرس التصدير المركزي للمكونات والأدوات المشتركة - Shared Barrel Export
 * 🏛️ الدور: فهرس تصدير - re-export جميع المكونات والأدوات المشتركة
 * 📥 المستهلك: كل ملفات المشروع
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Central Barrel Export: تصدير مركزي موحد
 *    لتنظيم نقاط الدخول للمكونات المشتركة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التصدير يجب أن يكون كاملاً
 *    2. لا تكرار للتصديرات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام export * و export named
 *    - فحص عدم وجود تعارض
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export * from './colorUtils';
export * from './exportUtils';
export * from './OdtConverter';
export * from './components/SharedFormattingToolbar';
export * from './components/SharedExportToolbar';
export * from './components/SharedSourceCodeEditor';
export * from './components/InteractiveWysiwygCodeStudio';

export {
  SharedContextMenu,
  useContextMenu,
  buildCanvasContextMenu,
  buildRichTextContextMenu,
  buildEditableFieldContextMenu,
  screenToCanvasPoint,
  type ContextMenuItem as SharedContextMenuItem,
  type SharedContextMenuProps,
  type CanvasContextMenuActions,
  type RichTextContextMenuActions,
  type EditableFieldContextMenuActions,
} from './components/SharedContextMenu';
export * from './hooks/useToolRegistry';
export {
  getUnifiedToolRegistry,
  executeUnifiedTool,
  getScientificLatexTools,
  renderLatexToHtml,
  renderLatexToSvg,
} from './utils/ToolRegistry';
export {
  toolRegistry as unifiedToolRegistry,
} from './tools/ToolRegistry';
export * from './tools/unifiedTools';
export * from './engines';
export * from './lib-core';
export * from './utils/result';

