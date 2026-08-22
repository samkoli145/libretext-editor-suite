/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: تسجيل جميع الإضافات والأوامر الأساسية - Register Plugins
 * 🏛️ الدور: مكون رئيسي - تسجيل 4 محررات والأوامر الأساسية
 * 📥 المستهلك: providers.tsx (عند بدء التشغيل)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Plugin Registration Sequence: تسلسل تسجيل الإضافات
 *    مع أوامر أساسية لكل محرر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الإضافات يجب أن تُسجَّل بعد إنشاء الخدمات
 *    2. المعرفات يجب أن تبقى فريدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود الخدمات قبل التسجيل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { EditorServices } from "../core/createEditorServices";
import { HTMLComponentPlugin } from "../features/html-component/HTMLComponentPlugin";
import { RichTextPlugin } from "../features/rich-text";
import { CanvasDesignerPlugin } from "../features/canvas-designer/CanvasDesignerPlugin";
import { UIDesignerPlugin } from "../features/ui-designer/UIDesignerPlugin";
import { PdfPlugin } from "../features/pdf/PdfPlugin";

export function registerPlugins(services: EditorServices): void {
  registerCoreCommands(services);
  registerHTMLComponentPlugin(services);
  registerRichTextPlugin(services);
  registerCanvasPlugin(services);
  registerUIPlugin(services);
  registerPdfPlugin(services);
}

function registerHTMLComponentPlugin(services: EditorServices): void {
  const htmlPlugin = new HTMLComponentPlugin();
  if (!services.plugins.getPlugin(htmlPlugin.documentType)) {
    services.plugins.registerPlugin(htmlPlugin);
  }

  const context = services.createPluginContext(htmlPlugin.id);

  if (!services.commands.has("html-component:create")) {
    context.registerCommand({
      id: "html-component:create",
      title: "إنشاء مستند مكونات HTML جديد",
      category: "HTML Component",
      shortcut: "Ctrl+Alt+H",
      run: () => {
        services.documents.createDocument("html-component" as any, "مستند مكونات HTML جديد");
      },
    });
  }
}

function registerCoreCommands(services: EditorServices): void {
  if (!services.commands.has("document:save")) {
    services.commands.register({
      id: "document:save",
      title: "حفظ المستند",
      category: "Document",
      shortcut: "Ctrl+S",
      run: async () => {
        await services.documents.saveDocument();
      },
    });
  }

  if (!services.commands.has("document:save-all")) {
    services.commands.register({
      id: "document:save-all",
      title: "حفظ كل المستندات",
      category: "Document",
      shortcut: "Ctrl+Shift+S",
      run: async () => {
        await services.documents.saveAll();
      },
    });
  }

  if (!services.commands.has("document:close-active")) {
    services.commands.register({
      id: "document:close-active",
      title: "إغلاق المستند النشط",
      category: "Document",
      shortcut: "Ctrl+W",
      run: () => {
        const active = services.documents.activeDocument;
        if (active) {
          services.documents.closeDocument(active.id);
        }
      },
    });
  }
}

function registerRichTextPlugin(services: EditorServices): void {
  const richTextPlugin = new RichTextPlugin();

  if (!services.plugins.getPlugin(richTextPlugin.documentType)) {
    services.plugins.registerPlugin(richTextPlugin);
  }

  const context = services.createPluginContext(richTextPlugin.id);

  if (!services.commands.has("rich-text:create")) {
    context.registerCommand({
      id: "rich-text:create",
      title: "إنشاء مستند نصي جديد",
      category: "Rich Text",
      shortcut: "Ctrl+Alt+N",
      run: () => {
        services.documents.createDocument("rich-text", "مستند نصي جديد");
      },
    });
  }

  if (!services.commands.has("rich-text:export-docx")) {
    context.registerCommand({
      id: "rich-text:export-docx",
      title: "تصدير المستند كملف Word (DOCX)",
      category: "Export",
      run: () => {
        services.events.emit("rich-editor:export-docx");
      },
    });
  }

  if (!services.commands.has("rich-text:export-pdf")) {
    context.registerCommand({
      id: "rich-text:export-pdf",
      title: "تصدير المستند كملف PDF",
      category: "Export",
      shortcut: "Ctrl+P",
      run: () => {
        window.print();
      },
    });
  }
}

function registerCanvasPlugin(services: EditorServices): void {
  const canvasPlugin = new CanvasDesignerPlugin();
  if (!services.plugins.getPlugin(canvasPlugin.documentType)) {
    services.plugins.registerPlugin(canvasPlugin);
  }

  const context = services.createPluginContext(canvasPlugin.id);

  if (!services.commands.has("canvas:create")) {
    context.registerCommand({
      id: "canvas:create",
      title: "إنشاء لوحة رسم وكانفا جديدة",
      category: "Canvas Designer",
      run: () => {
        services.documents.createDocument("canvas", "لوحة رسم جديدة");
      },
    });
  }
}

function registerUIPlugin(services: EditorServices): void {
  const uiPlugin = new UIDesignerPlugin();
  if (!services.plugins.getPlugin(uiPlugin.documentType)) {
    services.plugins.registerPlugin(uiPlugin);
  }

  const context = services.createPluginContext(uiPlugin.id);

  if (!services.commands.has("ui-designer:create")) {
    context.registerCommand({
      id: "ui-designer:create",
      title: "إنشاء صفحة واجهة مستخدم جديدة",
      category: "UI Designer",
      run: () => {
        services.documents.createDocument("ui-page", "صفحة واجهة جديدة");
      },
    });
  }
}

function registerPdfPlugin(services: EditorServices): void {
  const pdfPlugin = new PdfPlugin();
  if (!services.plugins.getPlugin(pdfPlugin.documentType)) {
    services.plugins.registerPlugin(pdfPlugin);
  }

  const context = services.createPluginContext(pdfPlugin.id);

  if (!services.commands.has("pdf:create")) {
    context.registerCommand({
      id: "pdf:create",
      title: "فتح مستند PDF جديد",
      category: "PDF Suite",
      run: () => {
        services.documents.createDocument("pdf", "مستند PDF جديد");
      },
    });
  }
}
