/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إنشاء وإدارة المحرر الأصلي - useNativeEditor Hook
 * 🏛️ الدور: خطاف رئيسي - إنشاء NativeEditor وتحديثه وإزالته
 * 📥 المستهلك: RichTextEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Editor Lifecycle Hook: خطاف دورة حياة المحرر
 *    مع إنشاء وتحديث وتنضيف تلقائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Cleanup يجب أن ي移除 DOM
 *    2. التحديث يجب أن يحافظ على الحالة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص editor قبل الإنشاء
 *    - cleanup شامل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useState, useRef } from "react";
import { NativeEditor, type NativeEditorOptions } from "../core/NativeEditor";

export function useNativeEditor(options: NativeEditorOptions = {}, deps: any[] = []): NativeEditor {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const editorRef = useRef<NativeEditor | null>(null);

  const [editor, setEditor] = useState<NativeEditor>(() => {
    const inst = new NativeEditor(options);
    editorRef.current = inst;
    return inst;
  });

  useEffect(() => {
    // If editor does not exist or deps changed, recreate properly
    if (!editorRef.current) {
      const inst = new NativeEditor(optionsRef.current);
      editorRef.current = inst;
      setEditor(inst);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, deps);

  return editor;
}
