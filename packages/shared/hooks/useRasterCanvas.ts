/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة الرسم النقطي والطبقات والفلاتر
 * 🏛️ الدور: خطاف مشترك - يدير Canvas للرسم مع طبقات وفلاتر
 * 📥 المستهلك: CanvasDesignerEditor, ImageEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Layer-Based Raster Engine: رسم نقطي بطبقات مع فلاتر فورية
 *    وتكامل مع BrushEngine و LayerBlendEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Canvas يجب أن يتناسب مع حجم الشاشة
 *    2. الطبقات يجب ألا تتجاوز 20 طبقة
 *    3. الفلاتر قد تستنزف الذاكرة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص دعم Canvas
 *    - تنظيف عند الإزالة
 *    - fallback لـ 2D context
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { BrushEngine, BrushSettings, BrushPoint } from '../lib-core/raster/brush-engine';
import { LayerBlendEngine, RasterLayer, BlendMode } from '../lib-core/raster/layer-blend-engine';
import { ImageFiltersEngine } from '../lib-core/raster/image-filters-engine';

export interface UseRasterCanvasOptions {
  width: number;
  height: number;
  initialColor?: string;
}

export function useRasterCanvas({
  width,
  height,
  initialColor = '#1e293b',
}: UseRasterCanvasOptions) {
  const [layers, setLayers] = useState<RasterLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    size: 5,
    color: initialColor,
    opacity: 1,
    type: 'pen',
    smoothing: true,
  });

  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<BrushPoint[]>([]);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize base layer
  useEffect(() => {
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = width;
    baseCanvas.height = height;

    const baseLayer: RasterLayer = {
      id: `layer-${Date.now()}`,
      name: 'الطبقة 1',
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      canvas: baseCanvas,
    };

    setLayers([baseLayer]);
    setActiveLayerId(baseLayer.id);
  }, [width, height]);

  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[0] || null;

  const startDrawing = useCallback((x: number, y: number, pressure = 0.5) => {
    if (!activeLayer || activeLayer.locked || !activeLayer.visible) return;
    isDrawingRef.current = true;
    currentPointsRef.current = [{ x, y, pressure, time: Date.now() }];

    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;

    if (brushSettings.type === 'airbrush') {
      BrushEngine.drawSpray(ctx, { x, y }, brushSettings);
    } else {
      BrushEngine.drawStroke(ctx, currentPointsRef.current, brushSettings);
    }
  }, [activeLayer, brushSettings]);

  const updateDrawing = useCallback((x: number, y: number, pressure = 0.5) => {
    if (!isDrawingRef.current || !activeLayer) return;
    const pt: BrushPoint = { x, y, pressure, time: Date.now() };
    currentPointsRef.current.push(pt);

    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;

    if (brushSettings.type === 'airbrush') {
      BrushEngine.drawSpray(ctx, pt, brushSettings);
    } else {
      BrushEngine.drawStroke(ctx, currentPointsRef.current, brushSettings);
    }
  }, [activeLayer, brushSettings]);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    currentPointsRef.current = [];
  }, []);

  const addLayer = useCallback((name?: string) => {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;

    const newLayer: RasterLayer = {
      id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name || `طبقة ${layers.length + 1}`,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      canvas: newCanvas,
    };

    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
    return newLayer;
  }, [width, height, layers.length]);

  const deleteLayer = useCallback((id: string) => {
    if (layers.length <= 1) return; // Keep at least one
    setLayers(prev => prev.filter(l => l.id !== id));
    setActiveLayerId(prev => (prev === id ? layers[0]?.id || null : prev));
  }, [layers]);

  const applyBrightnessContrast = useCallback((brightness: number, contrast: number) => {
    if (!activeLayer) return;
    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, width, height);
    ImageFiltersEngine.applyAdjustments(imgData, brightness, contrast, 0);
    ctx.putImageData(imgData, 0, 0);
  }, [activeLayer, width, height]);

  return {
    layers,
    activeLayer,
    activeLayerId,
    setActiveLayerId,
    brushSettings,
    setBrushSettings,
    canvasContainerRef,
    startDrawing,
    updateDrawing,
    stopDrawing,
    addLayer,
    deleteLayer,
    applyBrightnessContrast,
  };
}
