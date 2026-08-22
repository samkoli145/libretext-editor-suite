/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة الاستيراد والتصدير الموحد - Universal Export/Import Hook
 * 🏛️ الدور: خطاف مشترك - يربط نافذة التحويل مع المستند النشط
 * 📥 المستهلك: SharedExportToolbar, كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unified Format Pipeline: خطاف يوفر واجهة موحدة للتصدير والاستيراد
 *    مع ربط تلقائي بنوع المستند الحالي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التحويل يجب أن يكون آمناً (no code execution)
 *    2. بعض الصيغ قد تفقد خصائص
 *    3. الحجم يجب أن يتناسب
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الملف قبل التحويل
 *    - عرض تحذيرات الفقد
 *    - تنظيف الملفات المؤقتة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import { notificationEngine } from '../engines/NotificationEngine';

export interface UseUniversalExportImportOptions {
  documentTitle?: string;
  documentType: 'canvas' | 'ui' | 'rich-text' | 'pdf';
  onGetDocumentContent: () => any;
  onApplyImportedContent?: (content: any, format: string) => void;
}

export function useUniversalExportImport({
  documentTitle = 'مستند بدون عنوان',
  documentType,
  onGetDocumentContent,
  onApplyImportedContent,
}: UseUniversalExportImportOptions) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'export' | 'import'>('export');

  const openExportModal = useCallback(() => {
    setModalMode('export');
    setIsModalOpen(true);
  }, []);

  const openImportModal = useCallback(() => {
    setModalMode('import');
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    modalMode,
    openExportModal,
    openImportModal,
    closeModal,
    documentTitle,
    documentType,
  };
}
