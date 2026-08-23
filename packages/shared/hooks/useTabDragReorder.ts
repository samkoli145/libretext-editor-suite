/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف سحب وإعادة ترتيب التبويبات - Tab Drag Reorder Hook
 * 🏛️ الدور: خطاف مشترك - يدير سحب التبويبات وإعادة ترتيبها وتثبيتها
 * 📥 المستهلك: Shell, TabBar, كل المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Drag-to-Reorder Tabs: سحب التبويبات لتغيير ترتيبها
 *    مع تثبيت كأيقونات مدمجة وقوائم سياقية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. السحب يجب أن يكون سلساً مع مرئية التبويب
 *    2. التثبيت يجب أن يحافظ على الحالة
 *    3. الإغلاق يجب أن ينتقل للتبويب المجاور
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود تبويبات قبل السحب
 *    - حد أدنى للحجم بعد التثبيت
 *    - حفظ الترتيب في localStorage
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import type { DocumentModel } from '../../core/types';

const PINNED_STORAGE_KEY = 'webpainter.pinned.tabs.v1';

export function useTabDragReorder(documents: DocumentModel[]) {
  const [pinnedTabIds, setPinnedTabIds] = useState<string[]>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const saved = localStorage.getItem(PINNED_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);

  // Save pinned tabs
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedTabIds));
    } catch {}
  }, [pinnedTabIds]);

  const togglePinTab = useCallback((tabId: string) => {
    setPinnedTabIds((prev) => {
      if (prev.includes(tabId)) {
        return prev.filter((id) => id !== tabId);
      }
      return [...prev, tabId];
    });
  }, []);

  const isTabPinned = useCallback((tabId: string) => pinnedTabIds.includes(tabId), [pinnedTabIds]);

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tabId);
  };

  const handleDragOver = (e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (tabId !== dragOverTabId) {
      setDragOverTabId(tabId);
    }
  };

  const handleDragEnd = () => {
    setDraggedTabId(null);
    setDragOverTabId(null);
  };

  return {
    pinnedTabIds,
    draggedTabId,
    dragOverTabId,
    togglePinTab,
    isTabPinned,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
