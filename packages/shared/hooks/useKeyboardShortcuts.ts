/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة اختصارات لوحة المفاتيح الموحدة
 * 🏛️ الدور: خطاف مشترك - يربط اختصارات لوحة المفاتيح بالأفعال في كل المحررات
 * 📥 المستهلك: CanvasDesignerEditor, RichTextEditor, UiDesignerEditor, PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Protected Input Detection: حماية حقول الإدخال تلقائياً
 *    مع دعم اختصارات التراجع/الإعادة/الحفظ/الحذف/التكبير
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الاختصارات يجب ألا تعمل داخل حقول الإدخال
 *    2. Ctrl+Z/Y يجب أن يربط بـ HistoryEngine
 *    3. بعض الاختصارات قد تتداخل مع المتصفح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص tag名 الحقل النشط
 *    - preventDefault على الاختصارات المسجلة
 *    - تنظيف listener عند الإزالة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useCallback } from 'react';
import { isEditableElementTarget } from '../lib-core/events/universal-context-menu';

export interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelectAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onCustomShortcut?: (key: string, e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(
  handlers: ShortcutHandlers,
  enabled = true
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // حماية حقول الكتابة والنصوص من اعتراض أحداث المفاتيح العادية
      const isInput = isEditableElementTarget(e.target);
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      if (isCtrlOrMeta) {
        const key = e.key.toLowerCase();

        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handlers.onRedo?.();
          } else {
            handlers.onUndo?.();
          }
          return;
        }

        if (key === 'y') {
          e.preventDefault();
          handlers.onRedo?.();
          return;
        }

        if (key === 's') {
          e.preventDefault();
          handlers.onSave?.();
          return;
        }

        if (key === 'd') {
          e.preventDefault();
          handlers.onDuplicate?.();
          return;
        }

        if (key === 'a' && !isInput) {
          e.preventDefault();
          handlers.onSelectAll?.();
          return;
        }

        if (key === '=' || key === '+') {
          e.preventDefault();
          handlers.onZoomIn?.();
          return;
        }

        if (key === '-') {
          e.preventDefault();
          handlers.onZoomOut?.();
          return;
        }

        if (key === '0') {
          e.preventDefault();
          handlers.onResetZoom?.();
          return;
        }
      }

      if (!isInput) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          handlers.onDelete?.();
          return;
        }
      }

      handlers.onCustomShortcut?.(e.key, e);
    },
    [handlers, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
