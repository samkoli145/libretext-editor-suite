/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة صفحات PDF والتنقل والتدوير والتكبير - PDF Pagination
 * 🏛️ الدور: خطاف مشترك - التنقل الفوري، تدوير 90°، التكبير والتصغير المتدرج
 * 📥 المستهلك: PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Stateless Navigation Hook: خطاف تنقل بلا حالة
 *    مع تحديث فوري للصفحة الحالية وتدوير وتكبير
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التنقّل يجب أن يحترم حدود الصفحات
 *    2. التدوير يجب أن يحافظ على محتوى الصفحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Math.min/max لمنع تجاوز الحدود
 *    - fallback لصفحة 1
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useCallback } from 'react';
import type { PdfDocumentModel } from '../model';

export interface UsePdfPaginationProps {
  doc: PdfDocumentModel;
  updateDoc: (updater: (prev: PdfDocumentModel) => PdfDocumentModel) => void;
}

export function usePdfPagination({ doc, updateDoc }: UsePdfPaginationProps) {
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

  const rotatePage = useCallback(
    (targetPageNum?: number) => {
      updateDoc((prev) => {
        const pageToRotate = targetPageNum ?? prev.currentPage;
        return {
          ...prev,
          pages: (prev.pages || []).map((p) => {
            if (p.pageNumber === pageToRotate) {
              return { ...p, rotation: ((p.rotation || 0) + 90) % 360 };
            }
            return p;
          }),
        };
      });
    },
    [updateDoc],
  );

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

  return {
    currentPage: doc.currentPage,
    totalPages: doc.totalPages,
    zoom: doc.zoom,
    nextPage,
    prevPage,
    goToPage,
    rotatePage,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
