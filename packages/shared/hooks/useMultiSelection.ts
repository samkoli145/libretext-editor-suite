/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة التحديد المتعدد وتجميع العناصر
 * 🏛️ الدور: خطاف مشترك - يدير التحديد الفردي والمتعدد ومستطيل السحب
 * 📥 المستهلك: CanvasDesignerEditor, UiDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Marquee Selection: مستطيل سحب ماركيه مع تحديد فردي/متعدد
 *    عبر Shift/Ctrl مع دعم التجميع
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Shift يضيف للتحديد، Ctrl يحول
 *    2. النقر بالخارج يلغي التحديد
 *    3. المستطيل يجب أن يظهر بصرياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود عناصر قبل التحديد
 *    - حد أقصى للعناصر المحددة
 *    - تنظيف عند الإلغاء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import {
  getElementsInMarquee,
  type SelectableElement,
  type MarqueeSelectionState,
} from '../lib-core/events/drag-selection-engine';

export function useMultiSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [marquee, setMarquee] = useState<MarqueeSelectionState>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const selectSingle = useCallback((id: string) => {
    setSelectedIds([id]);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const startMarquee = useCallback((x: number, y: number) => {
    setMarquee({
      isActive: true,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
    });
  }, []);

  const updateMarquee = useCallback((x: number, y: number) => {
    setMarquee((prev) => {
      if (!prev.isActive) return prev;
      return { ...prev, currentX: x, currentY: y };
    });
  }, []);

  const endMarquee = useCallback(
    (elements: SelectableElement[], isShiftKey = false) => {
      if (!marquee.isActive) return;

      const hitIds = getElementsInMarquee(marquee, elements);
      setMarquee((prev) => ({ ...prev, isActive: false }));

      if (isShiftKey) {
        setSelectedIds((prev) => Array.from(new Set([...prev, ...hitIds])));
      } else {
        setSelectedIds(hitIds);
      }
    },
    [marquee]
  );

  return {
    selectedIds,
    setSelectedIds,
    selectSingle,
    toggleSelect,
    selectAll,
    clearSelection,
    marquee,
    startMarquee,
    updateMarquee,
    endMarquee,
  };
}
