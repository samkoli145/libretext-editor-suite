/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة الألواح القابلة للتحجيم والإرساء - Dockable Panel Hook
 * 🏛️ الدور: خطاف مشترك - يدير حالة اللوحة (حجم، موضع، إرساء، تبويبات)
 * 📥 المستهلك: DockablePanelContainer, SharedOutlinePanel, PropertiesPanel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dockable State Machine: خطاف يدير حالات الإرساء (left, right, floating)
 *    مع تحجيم بالسحب وحفظ في localStorage
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحجم يجب ألا يتجاوز 50% من الشاشة
 *    2. الإرساء يجب أن يتكيف مع المحتوى
 *    3. التبويبات يجب أن تبقى متزامنة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حد أدنى وأقصى للحجم
 *    - fallback للوضع العائم
 *    - تنظيف عند الإزالة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { clampDimension, type ResizeConstraints } from '../lib-core/events/dockable-tab-engine';

export type DockSide = 'left' | 'right';

export interface DockablePanelOptions {
  storageKey: string;
  defaultWidth: number;
  constraints: ResizeConstraints;
  defaultPinned?: boolean;
  defaultVisible?: boolean;
  dockSide?: DockSide;
}

export function useDockablePanel({
  storageKey,
  defaultWidth,
  constraints,
  defaultPinned = true,
  defaultVisible = true,
  dockSide = 'right',
}: DockablePanelOptions) {
  // Load initial from storage if available
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return defaultWidth;
    try {
      const saved = localStorage.getItem(`${storageKey}:width`);
      if (saved) return clampDimension(Number(saved), constraints.minWidth, constraints.maxWidth);
    } catch {}
    return defaultWidth;
  });

  const [isPinned, setIsPinned] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return defaultPinned;
    try {
      const saved = localStorage.getItem(`${storageKey}:pinned`);
      if (saved !== null) return saved === 'true';
    } catch {}
    return defaultPinned;
  });

  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return defaultVisible;
    try {
      const saved = localStorage.getItem(`${storageKey}:visible`);
      if (saved !== null) return saved === 'true';
    } catch {}
    return defaultVisible;
  });

  const [isFloating, setIsFloating] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return !defaultPinned;
    try {
      const saved = localStorage.getItem(`${storageKey}:floating`);
      if (saved !== null) return saved === 'true';
    } catch {}
    return !defaultPinned;
  });

  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return { x: 100, y: 100 };
    try {
      const saved = localStorage.getItem(`${storageKey}:floatingPos`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { x: 100, y: 100 };
  });

  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingFloating, setIsDraggingFloating] = useState(false);

  const resizeStartRef = useRef<{ startX: number; startWidth: number }>({
    startX: 0,
    startWidth: defaultWidth,
  });

  const floatDragStartRef = useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
  }>({
    startX: 0,
    startY: 0,
    initX: 100,
    initY: 100,
  });

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(`${storageKey}:width`, width.toString());
      localStorage.setItem(`${storageKey}:pinned`, isPinned.toString());
      localStorage.setItem(`${storageKey}:visible`, isVisible.toString());
      localStorage.setItem(`${storageKey}:floating`, isFloating.toString());
      localStorage.setItem(`${storageKey}:floatingPos`, JSON.stringify(floatingPos));
    } catch {}
  }, [storageKey, width, isPinned, isVisible, isFloating, floatingPos]);

  // Start Resizing Handle
  const startResizing = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartRef.current = {
        startX: e.clientX,
        startWidth: width,
      };
    },
    [width],
  );

  // Resize Mouse Events
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current.startX;
      // If dockSide is right, moving mouse to the left (negative deltaX) widens the panel in RTL
      const multiplier = dockSide === 'right' ? -1 : 1;
      const target = resizeStartRef.current.startWidth + deltaX * multiplier;
      const newWidth = clampDimension(target, constraints.minWidth, constraints.maxWidth);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, dockSide, constraints]);

  // Floating Window Drag Handle
  const startFloatingDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!isFloating) return;
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('select')) return;

      setIsDraggingFloating(true);
      floatDragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initX: floatingPos.x,
        initY: floatingPos.y,
      };
    },
    [isFloating, floatingPos],
  );

  useEffect(() => {
    if (!isDraggingFloating) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - floatDragStartRef.current.startX;
      const dy = e.clientY - floatDragStartRef.current.startY;
      const nx = Math.max(
        10,
        Math.min(window.innerWidth - width - 20, floatDragStartRef.current.initX + dx),
      );
      const ny = Math.max(
        10,
        Math.min(window.innerHeight - 200, floatDragStartRef.current.initY + dy),
      );
      setFloatingPos({ x: nx, y: ny });
    };

    const handleMouseUp = () => {
      setIsDraggingFloating(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingFloating, width]);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => {
      const next = !prev;
      setIsFloating(!next);
      return next;
    });
  }, []);

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const resetSize = useCallback(() => {
    setWidth(defaultWidth);
  }, [defaultWidth]);

  return {
    width,
    isPinned,
    isVisible,
    isFloating,
    floatingPos,
    isResizing,
    isDraggingFloating,
    startResizing,
    startFloatingDrag,
    togglePin,
    toggleVisibility,
    setIsVisible,
    setIsFloating,
    resetSize,
    setWidth,
  };
}
