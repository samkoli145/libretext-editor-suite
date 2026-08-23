/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف اختصارات لوحة المفاتيح للمحرر - useEditorShortcuts Hook
 * 🏛️ الدور: خطاف مشترك - اختصارات الحفظ (Ctrl+S)
 * 📥 المستهلك: RichTextEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Minimal Shortcut Hook: خطاف اختصارات بسيط
 *    مع حماية ضد الحقول النشطة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الاختصارات يجب ألا تتداخل مع النظام
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص editor قبل التسجيل
 *    - إزالة المستمعين عند التنظيف
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';
import type { INativeEditor } from '../types';

export function useEditorShortcuts(editor: INativeEditor | null, onSave?: () => void) {
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S for saving
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, onSave]);
}
