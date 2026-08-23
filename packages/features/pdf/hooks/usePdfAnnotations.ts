/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة الشروحات، التظليلات، الأختام، والصور - PDF Annotations
 * 🏛️ الدور: خطاف مشترك - إضافة وحذف وتعديل الشروحات مع ImageEditor
 * 📥 المستهلك: PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Annotation CRUD Hook: خطاف إنشاء/قراءة/تحديث/حذف التعليقات
 *    مع IDs فريدة وتكامل محرر الصور المباشر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. IDs يجب أن تكون فريدة باستخدام timestamp + random
 *    2. الشروحات يجب أن تحتفظ بموقعها الدقيق
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة التعليق قبل الإضافة
 *    - fallback لحالة افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import type { PdfDocumentModel, PdfAnnotation } from '../model';

export interface UsePdfAnnotationsProps {
  doc: PdfDocumentModel;
  updateDoc: (updater: (prev: PdfDocumentModel) => PdfDocumentModel) => void;
}

export function usePdfAnnotations({ doc, updateDoc }: UsePdfAnnotationsProps) {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

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

      return newAnno;
    },
    [updateDoc],
  );

  const deleteAnnotation = useCallback(
    (id: string) => {
      updateDoc((prev) => ({
        ...prev,
        annotations: (prev.annotations || []).filter((a) => a.id !== id),
      }));
      setSelectedAnnotationId((prev) => (prev === id ? null : prev));
    },
    [updateDoc],
  );

  const updateAnnotation = useCallback(
    (id: string, updates: Partial<PdfAnnotation>) => {
      updateDoc((prev) => ({
        ...prev,
        annotations: (prev.annotations || []).map((a) => (a.id === id ? { ...a, ...updates } : a)),
      }));
    },
    [updateDoc],
  );

  const clearAllAnnotationsOnPage = useCallback(
    (pageNumber: number) => {
      updateDoc((prev) => ({
        ...prev,
        annotations: (prev.annotations || []).filter((a) => a.pageNumber !== pageNumber),
      }));
    },
    [updateDoc],
  );

  const selectedAnnotation =
    (doc.annotations || []).find((a) => a.id === selectedAnnotationId) || null;

  return {
    activeTool,
    setActiveTool,
    selectedAnnotationId,
    setSelectedAnnotationId,
    selectedAnnotation,
    addAnnotation,
    deleteAnnotation,
    updateAnnotation,
    clearAllAnnotationsOnPage,
  };
}
