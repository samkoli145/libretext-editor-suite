/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مستضيف محرر المستند الديناميكي - Document Editor Host
 * 🏛️ الدور: مكون رئيسي - تحميل وإظهار المحرر المناسب لنوع المستند
 * 📥 المستهلك: Workbench
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dynamic Editor Loading: تحميل ديناميكي للمحرر
 *    بناءً على نوع المستند عبر PluginRegistry
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المحرر يجب أن يكون مسجلاً في PluginRegistry
 *    2. التحميل يجب أن يكون فورياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المحرر قبل التحميل
 *    - fallback لرسالة خطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ComponentType } from "react";
import { useEditorServices } from "./providers";
import type {
  DocumentModel,
  EditorPluginProps,
} from "../core/types";

interface DocumentEditorHostProps {
  key?: string | number | null;
  document: DocumentModel;
  onChange: (updated: DocumentModel) => void;
}

export function DocumentEditorHost({
  document,
  onChange,
}: DocumentEditorHostProps) {
  const services = useEditorServices();

  const plugin = services.plugins.getPlugin(document.type);

  if (!plugin) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm bg-white h-full flex flex-col items-center justify-center">
        <p className="font-medium text-slate-700">لا يوجد محرر مسجل لهذا النوع: {document.type}</p>
        <p className="text-xs text-slate-400 mt-1">تأكد من تسجيل الـ Plugin في نظام الإضافات.</p>
      </div>
    );
  }

  const Editor = plugin.renderEditor as ComponentType<
    EditorPluginProps<any>
  >;

  return <Editor document={document} onChange={onChange} />;
}
