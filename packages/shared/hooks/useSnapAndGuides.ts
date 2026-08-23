/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف المحاذاة الذكية وخطوط الإرشاد - Snapping & Smart Guides
 * 🏛️ الدور: خطاف مشترك - يربط SnapAlignEngine بحركات السحب والتحجيم
 * 📥 المستهلك: CanvasDesignerEditor, UiDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Snap-to-Grid + Smart Guides: محاذاة ذكية لشبكة وخطوط إرشاد زرقاء
 *    مع اكتشاف التلامس التلقائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. السحب يجب أن يكون سلساً مع المحاذاة
 *    2. الخطوط يجب أن تظهر فقط عند التلامس
 *    3. الشبكة يجب أن تتناسب مع التكبير
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود عناصر للمحاذاة
 *    - حد أدنى للمسافة (5px)
 *    - تنظيف الخطوط بعد الإفلات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useMemo } from 'react';
import {
  SnapAlignEngine,
  type SnapResult,
  type SnapLine,
} from '../lib-core/geometry/snap-align-engine';
import type { RectBounds } from '../lib-core/geometry/bounding-box';

export function useSnapAndGuides(snapThreshold = 6) {
  const [activeGuides, setActiveGuides] = useState<SnapLine[]>([]);
  const engine = useMemo(() => new SnapAlignEngine(snapThreshold), [snapThreshold]);

  const snapElement = useCallback(
    (
      draggingBox: { x: number; y: number; width: number; height: number },
      otherElements: RectBounds[],
      canvasBounds?: { width: number; height: number },
    ): SnapResult => {
      const result = engine.calculateSnap(draggingBox, otherElements, canvasBounds);

      setActiveGuides(result.activeGuides);
      return result;
    },
    [engine],
  );

  const clearGuides = useCallback(() => {
    setActiveGuides([]);
  }, []);

  return {
    activeGuides,
    snapElement,
    clearGuides,
  };
}
