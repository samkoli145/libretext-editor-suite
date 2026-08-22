/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف مناطق السحب والإفلات واللصق - Ingestion Drop Zone Hook
 * 🏛️ الدور: خطاف مشترك - يدير تلقي الملفات عبر Drag & Drop أو Paste
 * 📥 المستهلك: AssetManager, ImageDialog, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Input Drop Zone: منطقة تقبل ملفات من Drag & Drop و Paste
 *    مع تصنيف تلقائي للصيغ والمعالجة حسب النوع
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحد الأقصى للحجم يجب تحديده (10MB)
 *    2. الصيغ غير المدعومة يجب تنبيه المستخدم
 *    3. dragover يجب أن يمنع الافتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - preventDefault على dragover
 *    - فحص نوع الملف قبل المعالجة
 *    - رسالة خطأ واضحة للصيغ غير المدعومة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useState } from 'react';
import { UnifiedIngestionPipeline, type IngestionResult } from '../../core/engines/UnifiedIngestionPipeline';

export interface UseIngestionDropZoneOptions {
  onIngest: (result: IngestionResult) => void | Promise<void>;
  onError?: (error: Error) => void;
  preferredTarget?: 'canvas' | 'rich-text' | 'ui-page' | 'pdf';
}

export function useIngestionDropZone(options: UseIngestionDropZoneOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setIsProcessing(true);

      try {
        const result = await UnifiedIngestionPipeline.processInput(e.dataTransfer, {
          preferredTarget: options.preferredTarget,
        });
        await options.onIngest(result);
      } catch (error) {
        options.onError?.(error instanceof Error ? error : new Error('فشل معالجة المحتوى المسحوب'));
      } finally {
        setIsProcessing(false);
      }
    },
    [options]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      e.preventDefault();
      setIsProcessing(true);

      try {
        const result = await UnifiedIngestionPipeline.processInput(e.clipboardData, {
          preferredTarget: options.preferredTarget,
        });
        await options.onIngest(result);
      } catch (error) {
        options.onError?.(error instanceof Error ? error : new Error('فشل لصق المحتوى'));
      } finally {
        setIsProcessing(false);
      }
    },
    [options]
  );

  return {
    isDragging,
    isProcessing,
    dropZoneProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onPaste: handlePaste,
    },
  };
}
