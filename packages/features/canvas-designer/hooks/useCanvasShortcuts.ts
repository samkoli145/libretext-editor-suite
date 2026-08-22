/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة اختصارات لوحة المفاتيح لمحرر الكانفا - Canvas Shortcuts Hook
 * 🏛️ الدور: خطاف مشترك - إدارة أزرار التراجع والإعادة والحذف والتحريك
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Keyboard Canvas: اختصارات معزولة لمحرر الكانفا
 *    لا تتداخل مع المحرر النصي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. أحداث اللوحة يجب ألا تُعالج إذا كان حقل نص نشطاً
 *    2. التكرار يجب أن يحفظ الحالة الأصلية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص activeElement قبل التعامل مع الأحداث
 *    - إزالة المستمعين عند التخلص
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';
import type { CanvasElement } from '../model';

export interface UseCanvasShortcutsOptions {
  selectedElementId: string | null;
  elements: CanvasElement[];
  undo: () => void;
  redo: () => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  updateBlock: (id: string, updates: Partial<CanvasElement>) => void;
  onSpacePressedChange: (isPressed: boolean) => void;
}

export function useCanvasShortcuts({
  selectedElementId,
  elements,
  undo,
  redo,
  deleteBlock,
  duplicateBlock,
  selectBlock,
  updateBlock,
  onSpacePressedChange,
}: UseCanvasShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.closest('[contenteditable="true"]')
      ) {
        return;
      }

      // Spacebar: Toggle Manual Pan Hand Tool
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        onSpacePressedChange(true);
        return;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (isCtrlOrMeta && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y / Cmd+Y / Ctrl+Shift+Z / Cmd+Shift+Z
      if (
        (isCtrlOrMeta && e.key.toLowerCase() === 'y') ||
        (isCtrlOrMeta && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete: Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        deleteBlock(selectedElementId);
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (isCtrlOrMeta && e.key.toLowerCase() === 'd' && selectedElementId) {
        e.preventDefault();
        duplicateBlock(selectedElementId);
        return;
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        selectBlock(null);
        return;
      }

      // Arrow Keys: Nudge
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
        selectedElementId
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const currentEl = elements.find((el) => el.id === selectedElementId);
        if (!currentEl) return;

        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;

        updateBlock(selectedElementId, {
          x: Math.max(0, currentEl.x + dx),
          y: Math.max(0, currentEl.y + dy),
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        onSpacePressedChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    selectedElementId,
    elements,
    undo,
    redo,
    deleteBlock,
    duplicateBlock,
    selectBlock,
    updateBlock,
    onSpacePressedChange,
  ]);
}
