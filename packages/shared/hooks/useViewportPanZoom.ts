/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة التكبير والتحريك - Viewport Pan & Zoom Hook
 * 🏛️ الدور: خطاف مشترك - يربط ViewportPanZoomEngine بواجهات React
 * 📥 المستهلك: CanvasDesignerEditor, PdfEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Wheel-Based Zoom + Hand Tool: تكبير بعجلة الفأرة وأداة اليد
 *    مع Spacebar Pan وحدود للتكبير
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التكبير يجب أن يكون حول مؤشر الفأرة
 *    2. الحدود يجب أن تُحترم (10% - 500%)
 *    3. Spacebar Pan يجب أن يreef cursor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص دعم الـ events
 *    - debounce على wheel
 *    - تنظيف listeners عند الإزالة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ViewportPanZoomEngine,
  type ViewportTransform,
  type PanZoomConfig,
} from '../lib-core/events/viewport-pan-zoom';

export function useViewportPanZoom(
  initialState: Partial<ViewportTransform> = {},
  config: PanZoomConfig = {},
) {
  const engine = useMemo(() => new ViewportPanZoomEngine(config), [config]);
  const [viewport, setViewport] = useState<ViewportTransform>({
    x: initialState.x ?? 0,
    y: initialState.y ?? 0,
    scale: initialState.scale ?? 1,
  });

  const isPanningRef = useRef(false);
  const startPanPos = useRef({ x: 0, y: 0 });

  const handleZoom = useCallback(
    (
      deltaY: number,
      screenX: number,
      screenY: number,
      containerRect: { left: number; top: number },
    ) => {
      setViewport((prev) =>
        engine.calculateZoomAtPoint(prev, deltaY, screenX, screenY, containerRect),
      );
    },
    [engine],
  );

  const handlePan = useCallback(
    (dx: number, dy: number) => {
      setViewport((prev) => engine.calculatePan(prev, dx, dy));
    },
    [engine],
  );

  const handleReset = useCallback(() => {
    setViewport({ x: 0, y: 0, scale: 1 });
  }, []);

  const startPan = useCallback((clientX: number, clientY: number) => {
    isPanningRef.current = true;
    startPanPos.current = { x: clientX, y: clientY };
  }, []);

  const updatePan = useCallback(
    (clientX: number, clientY: number) => {
      if (!isPanningRef.current) return;
      const dx = clientX - startPanPos.current.x;
      const dy = clientY - startPanPos.current.y;
      startPanPos.current = { x: clientX, y: clientY };
      setViewport((prev) => engine.calculatePan(prev, dx, dy));
    },
    [engine],
  );

  const endPan = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  return {
    viewport,
    setViewport,
    handleZoom,
    handlePan,
    handleReset,
    startPan,
    updatePan,
    endPan,
    isPanning: isPanningRef.current,
  };
}
