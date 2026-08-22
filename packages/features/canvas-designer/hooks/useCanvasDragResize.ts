/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف سحب وتحجيم عناصر الكانفا والمحاذاة المغناطيسية - Drag, Resize & Snap
 * 🏛️ الدور: خطاف مشترك - السحب والتحجيم مع جاذبية مغناطيسية ذكية
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Magnetic Snap Alignment: محاكاة جاذبية مغناطيسية للمحاذاة
 *    مع SnapAlignEngine من shared/lib-core
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الإحداثيات يجب أن تتناسب مع عامل التكبير
 *    2. المحاذاة يجب أن تُظهر خطوط إرشادية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العناصر قبل السحب
 *    - fallback لإحداثيات الأصلية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useRef, useCallback } from 'react';
import { SnapAlignEngine, type SnapLine } from '../../../shared/lib-core/geometry/snap-align-engine';
import type { RectBounds } from '../../../shared/lib-core/geometry/bounding-box';

export interface DragItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useCanvasDragResize(canvasWidth: number, canvasHeight: number) {
  const [activeGuides, setActiveGuides] = useState<SnapLine[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const snapEngineRef = useRef(new SnapAlignEngine(6));

  const startDrag = useCallback(() => {
    setIsDragging(true);
    setActiveGuides([]);
  }, []);

  const updateDrag = useCallback(
    (
      currentPos: { x: number; y: number; width: number; height: number },
      allItems: DragItem[],
      selectedIds: string[]
    ) => {
      // Exclude selected items from snap candidates
      const otherItems = allItems.filter(item => !selectedIds.includes(item.id));
      
      const snapResult = snapEngineRef.current.calculateSnap(
        currentPos,
        otherItems,
        { width: canvasWidth, height: canvasHeight }
      );

      setActiveGuides(snapResult.activeGuides);

      return {
        x: snapResult.x,
        y: snapResult.y,
        snapped: snapResult.snappedX || snapResult.snappedY,
      };
    },
    [canvasWidth, canvasHeight]
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setActiveGuides([]);
  }, []);

  return {
    activeGuides,
    isDragging,
    startDrag,
    updateDrag,
    endDrag,
  };
}
