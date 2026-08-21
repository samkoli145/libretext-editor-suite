/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: code-editor.styles.ts
 * 📂 المسار: packages/core/src/blocks/code-editor.styles.ts
 * 🎯 الهدف الرئيسي: ملف التنسيقات والأنماط البصرية الفاتحة لكتلة CodeEditor
 * 📋 المعايير: الثيم الفاتح النقي (Pure Daylight Canvas)، تباين عالي للقراءة.
 * 🏷️ المعرف: CORE-STYLE-CODEEDITOR
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const CodeEditorDefaultStyles: Readonly<Record<string, string>> = Object.freeze({
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: '1px',
  borderRadius: '12px',
  color: '#0f172a',
  padding: '16px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  fontSize: '14px',
  lineHeight: '1.6',
});
