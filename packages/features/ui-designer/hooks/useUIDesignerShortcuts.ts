/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف معالجة اختصارات لوحة المفاتيح لمصمم واجهات المستخدم - UI Designer Shortcuts
 * 🏛️ الدور: خطاف مشترك - التراجع/الإعادة، الحذف، التكرار، تبديل الكود، التكبير
 * 📥 المستهلك: UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Protected Shortcut Handler: معالج اختصارات محمي
 *    لا يتعارض مع حقول الإدخال النشطة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الاختصارات يجب ألا تعمل أثناء الكتابة في حقل نص
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص activeElement قبل التنفيذ
 *    - إزالة المستمعين عند التنظيف
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';

export interface UseUIDesignerShortcutsOptions {
  selectedCompId: string | null;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleCodePreview: () => void;
  onDeselect: () => void;
}

export function useUIDesignerShortcuts({
  selectedCompId,
  onDeleteSelected,
  onDuplicateSelected,
  onUndo,
  onRedo,
  onToggleCodePreview,
  onDeselect,
}: UseUIDesignerShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an editable field
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInput) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        onRedo();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        if (selectedCompId) {
          e.preventDefault();
          onDuplicateSelected();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCompId) {
          e.preventDefault();
          onDeleteSelected();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onDeselect();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        onToggleCodePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedCompId,
    onDeleteSelected,
    onDuplicateSelected,
    onUndo,
    onRedo,
    onToggleCodePreview,
    onDeselect,
  ]);
}
