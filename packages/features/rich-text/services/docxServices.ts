/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خدمات استيراد وتصدير DOCX والصيغ الأخرى - DOCX Services
 * 🏛️ الدور: خدمة مشتركة - استيراد وتصدير المستندات بصيغ متعددة
 * 📥 المستهلك: RichTextEditor, ReviewTab
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Format Import/Export: استيراد وتصدير متعدد الصيغ
 *    (DOCX, HTML, Markdown) بصفر مكتبات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. DOCX يجب أن يكون متوافقاً مع OOXML
 *    2. التحويل يجب أن يحافظ على التنسيق
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الملف قبل الاستيراد
 *    - fallback لصيغة بديلة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { INativeEditor } from "../types";
import { downloadFile } from "./fileUtils";
import { generateDocxFromHtml, parseDocxToHtml } from "./docxUtils";

/**
 * Service to handle DOCX and other format imports into the editor (100% native)
 */
export async function importDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return parseDocxToHtml(arrayBuffer);
}

/**
 * Service to handle DOCX export from the editor (100% native OOXML)
 */
export async function exportToDocx(editor: INativeEditor, fileName: string = "document") {
  const html = editor.getHTML();
  const cleanName = fileName.replace(/[\\/:*?"<>|]/g, "_").trim() || "document";
  const blob = await generateDocxFromHtml(html, cleanName);
  downloadFile(blob, `${cleanName}.docx`);
}

/**
 * Export to plain HTML file
 */
export function exportToHtml(editor: INativeEditor, fileName: string = "document") {
  const html = editor.getHTML();
  const cleanName = fileName.replace(/[\\/:*?"<>|]/g, "_").trim() || "document";
  const styledHtml = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>${cleanName}</title>
  <style>
    body { font-family: 'Cairo', sans-serif; padding: 40px; max-width: 800px; margin: auto; line-height: 1.8; color: #0f172a; background-color: #ffffff; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: right; }
    th { background-color: #f1f5f9; font-weight: bold; }
    img { max-width: 100%; height: auto; border-radius: 6px; }
    blockquote { border-right: 4px solid #3b82f6; padding-right: 16px; margin-right: 0; color: #64748b; font-style: italic; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  downloadFile(styledHtml, `${cleanName}.html`, "text/html;charset=utf-8");
}

/**
 * Export to Markdown file
 */
export function exportToMarkdown(editor: INativeEditor, fileName: string = "document") {
  const text = editor.getText();
  const cleanName = fileName.replace(/[\\/:*?"<>|]/g, "_").trim() || "document";
  downloadFile(text, `${cleanName}.md`, "text/markdown;charset=utf-8");
}
