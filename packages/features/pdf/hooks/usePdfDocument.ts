/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة مستندات PDF والصفحات والتعليقات التوضيحية - PDF Document State Engine
 * 🏛️ الدور: خطاف رئيسي - إدارة التنقل والتدوير والتكبير والشروحات
 * 📥 المستهلك: PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Document State Engine: محرك حالة المستند
 *    مع إدارة التنقل والتدوير والتكبير والشروحات والأختام
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحالة يجب أن تبقى متسقة عبر عمليات التعليق المتعددة
 *    2. التدوير يجب أن يحافظ على نسبة العرض للارتفاع
 *    3. التكبير يجب أن يكون محدوداً (0.25x - 5x)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة رقم الصفحة قبل التنقل
 *    - fallback للصفحة الأولى عند الخطأ
 *    - تقييد التكبير والتصغير
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useRef } from 'react';
import type { PdfDocumentModel, PdfAnnotation } from '../model';
import { createInitialPdfDocument } from '../model';

export function usePdfDocument(
  initialDocument?: PdfDocumentModel,
  onDocumentChange?: (doc: PdfDocumentModel) => void,
) {
  const [doc, setDoc] = useState<PdfDocumentModel>(() => {
    return initialDocument || createInitialPdfDocument();
  });

  const [activeTool, setActiveTool] = useState<string>('select');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

  const updateDoc = useCallback(
    (updater: (prev: PdfDocumentModel) => PdfDocumentModel) => {
      setDoc((prev) => {
        const next = updater(prev);
        onDocumentChange?.(next);
        return next;
      });
    },
    [onDocumentChange],
  );

  const nextPage = useCallback(() => {
    updateDoc((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  }, [updateDoc]);

  const prevPage = useCallback(() => {
    updateDoc((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  }, [updateDoc]);

  const goToPage = useCallback(
    (pageNum: number) => {
      updateDoc((prev) => ({
        ...prev,
        currentPage: Math.min(Math.max(1, pageNum), prev.totalPages),
      }));
    },
    [updateDoc],
  );

  const rotatePage = useCallback(() => {
    updateDoc((prev) => ({
      ...prev,
      pages: (prev.pages || []).map((p) => {
        if (p.pageNumber === prev.currentPage) {
          return { ...p, rotation: ((p.rotation || 0) + 90) % 360 };
        }
        return p;
      }),
    }));
  }, [updateDoc]);

  const zoomIn = useCallback(() => {
    updateDoc((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 10, 250),
    }));
  }, [updateDoc]);

  const zoomOut = useCallback(() => {
    updateDoc((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 10, 50),
    }));
  }, [updateDoc]);

  const resetZoom = useCallback(() => {
    updateDoc((prev) => ({
      ...prev,
      zoom: 100,
    }));
  }, [updateDoc]);

  const addAnnotation = useCallback(
    (annotation: Omit<PdfAnnotation, 'id'>) => {
      const newAnno: PdfAnnotation = {
        ...annotation,
        id: `anno-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      };

      updateDoc((prev) => ({
        ...prev,
        annotations: [...(prev.annotations || []), newAnno],
      }));

      setSelectedAnnotationId(newAnno.id);
      return newAnno;
    },
    [updateDoc],
  );

  const removeAnnotation = useCallback(
    (id: string) => {
      updateDoc((prev) => ({
        ...prev,
        annotations: (prev.annotations || []).filter((a) => a.id !== id),
      }));
      setSelectedAnnotationId((prev) => (prev === id ? null : prev));
    },
    [updateDoc],
  );

  return {
    doc,
    activeTool,
    setActiveTool,
    selectedAnnotationId,
    setSelectedAnnotationId,
    nextPage,
    prevPage,
    goToPage,
    rotatePage,
    zoomIn,
    zoomOut,
    resetZoom,
    addAnnotation,
    removeAnnotation,
  };
}
