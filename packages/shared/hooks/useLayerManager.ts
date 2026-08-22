/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة الطبقات المشترك - Shared Layer Manager Hook
 * 🏛️ الدور: خطاف حالة مشترك لإدارة طبقات المستندات (PDF, Canvas, UI, Rich Text)
 * 📥 المستهلك: PdfEditor, CanvasDesignerEditor, UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الميزات | Features:
 *    1. إدارة حالة الطبقات التعليمية (Teacher Solution, Student Notes, Grids)
 *    2. تبديل الرؤية والقفل والشفافية
 *    3. التبديل الفوري لشبكات الرسم البياني (Graph, Dot, Isometric)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بالثيم الفاتح النقي 100%
 *    2. صفر اعتماديات خارجية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل التوجيهي باللغة العربية)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import {
  type DocumentLayer,
  type GridPatternType,
  createDefaultEducationalLayers,
  toggleLayerVisibility as toggleVisibilityEngine,
  toggleLayerLock as toggleLockEngine,
  setLayerOpacity as setOpacityEngine,
} from '../lib-core/document-pipeline/layer-document-compositor';

export type LayerItem = DocumentLayer;
export type GridType = GridPatternType;

export function useLayerManager(initialLayers?: DocumentLayer[]) {
  const [layers, setLayers] = useState<DocumentLayer[]>(() => {
    return initialLayers && initialLayers.length > 0
      ? initialLayers
      : createDefaultEducationalLayers();
  });

  const [activeLayerId, setActiveLayerId] = useState<string>(() => {
    return layers[0]?.id || 'layer-base';
  });

  const [gridType, setGridType] = useState<GridPatternType>('none');

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers((prev) => toggleVisibilityEngine(prev, layerId));
  }, []);

  const toggleLayerLock = useCallback((layerId: string) => {
    setLayers((prev) => toggleLockEngine(prev, layerId));
  }, []);

  const setLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setLayers((prev) => setOpacityEngine(prev, layerId, opacity));
  }, []);

  const isLayerVisible = useCallback(
    (layerId: string) => {
      const found = layers.find((l) => l.id === layerId);
      return found ? found.visible : true;
    },
    [layers]
  );

  return {
    layers,
    setLayers,
    activeLayerId,
    setActiveLayerId,
    gridType,
    setGridType,
    toggleLayerVisibility,
    toggleLayerLock,
    setLayerOpacity,
    isLayerVisible,
  };
}
