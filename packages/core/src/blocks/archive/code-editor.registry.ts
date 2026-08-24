/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: code-editor.registry.ts
 * 📂 المسار: packages/core/src/blocks/code-editor.registry.ts
 * 🎯 الهدف الرئيسي: مفتاح التسجيل في الفهرس ومصفوفة التوافق لكتلة CodeEditor
 * 🏷️ المعرف: CORE-REG-CODEEDITOR
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const CodeEditorRegistryEntry = {
  id: 'code-editor',
  name: 'CodeEditor',
  domain: 'Writer',
  traits: ['Editable', 'FormattingSupport', 'ClipboardAndLifecycle'],
  hasContextMenu: true,
  hasFloatingGizmo: true,
  createdAt: '2026-08-21',
} as const;
