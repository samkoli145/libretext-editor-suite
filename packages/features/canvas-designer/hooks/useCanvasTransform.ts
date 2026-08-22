/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف تحويل وعرض الكانفا والتكبير والتصغير - Canvas Transform & Pan-Zoom
 * 🏛️ الدور: خطاف مشترك - تحكم بالعرض والتكبير والتصغير
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Viewport Wrapper: غلاف معزول لمحرك ViewportPanZoomEngine
 *    مع مؤشرات فأرة ومسافات متحركة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التكبير يجب أن يكون ضمن الحدود
 *    2. يجب حفظ مركز التكبير عند التكبير من النقطة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الحدود قبل التكبير
 *    - fallback للعرض الافتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { ViewportPanZoomEngine, ViewportTransform } from '../../../shared/lib-core/events/viewport-pan-zoom';

export interface UseCanvasTransformOptions {
  initialTransform?: ViewportTransform;
  canvasWidth: number;
  canvasHeight: number;
}

export function useCanvasTransform({
  initialTransform = { x: 50, y: 50, scale: 1 },
  canvasWidth,
  canvasHeight,
}: UseCanvasTransformOptions) {
  const [transform, setTransform] = useState<ViewportTransform>(initialTransform);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const engineRef = useRef(new ViewportPanZoomEngine());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Spacebar for Pan/Hand Tool
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
        isPanningRef.current = false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle Wheel Zoom around cursor
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Zoom if Ctrl/Meta is pressed or if on touchpad pinch, otherwise pan vertically/horizontally
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setTransform(prev => engineRef.current.calculateZoomAtPoint(prev, e.deltaY, e.clientX, e.clientY, rect));
    } else {
      setTransform(prev => engineRef.current.calculatePan(prev, -e.deltaX, -e.deltaY));
    }
  }, []);

  const startPan = useCallback((clientX: number, clientY: number) => {
    isPanningRef.current = true;
    setIsPanning(true);
    lastMousePosRef.current = { x: clientX, y: clientY };
  }, []);

  const updatePan = useCallback((clientX: number, clientY: number) => {
    if (!isPanningRef.current) return;
    const dx = clientX - lastMousePosRef.current.x;
    const dy = clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: clientX, y: clientY };
    setTransform(prev => engineRef.current.calculatePan(prev, dx, dy));
  }, []);

  const endPan = useCallback(() => {
    isPanningRef.current = false;
    setIsPanning(false);
  }, []);

  const resetToCenter = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centered = engineRef.current.getCenterTransform(
      canvasWidth,
      canvasHeight,
      rect.width,
      rect.height
    );
    setTransform(centered);
  }, [canvasWidth, canvasHeight]);

  const zoomIn = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5.0) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.1) }));
  }, []);

  return {
    transform,
    setTransform,
    isPanning,
    isSpacePressed,
    containerRef,
    handleWheel,
    startPan,
    updatePan,
    endPan,
    resetToCenter,
    zoomIn,
    zoomOut,
    engine: engineRef.current,
  };
}
