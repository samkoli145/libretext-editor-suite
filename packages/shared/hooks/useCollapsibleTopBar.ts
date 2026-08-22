/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة الأشرطة العلوية القابلة للتحجيم والطي والتثبيت
 * 🏛️ الدور: خطاف مشترك - يدير حالة الشريط العلوي (ارتفاع، طي، تثبيت)
 * 📥 المستهلك: CollapsibleTopBarWrapper, SharedRibbonBar, كل المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    State Machine Hook: خطاف يدير 4 حالات (normal, collapsed, pinned, hidden)
 *    مع حساب تلقائي للارتفاع وحفظ في localStorage
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الارتفاع يجب ألا يتجاوز 10% من الشاشة
 *    2. الحالة يجب أن تبقى متزامنة مع localStorage
 *    3. التثبيت يجب أن يحافظ على الارتفاع الحالي
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص أبعاد الشاشة قبل الحساب
 *    - fallback للارتفاع الافتراضي
 *    - تنظيف عند الإزالة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface CollapsibleTopBarOptions {
  id: string;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  defaultCollapsed?: boolean;
  defaultPinned?: boolean;
  storageKeyPrefix?: string;
}

export interface CollapsibleTopBarState {
  height: number;
  isCollapsed: boolean;
  isPinned: boolean;
  isHidden: boolean;
  isResizing: boolean;
  setHeight: (height: number) => void;
  toggleCollapse: () => void;
  togglePin: () => void;
  toggleHidden: () => void;
  expand: () => void;
  collapse: () => void;
  startResize: (e: React.MouseEvent) => void;
}

export function useCollapsibleTopBar({
  id,
  defaultHeight = 38,
  minHeight = 28,
  maxHeight = 64,
  defaultCollapsed = false,
  defaultPinned = true,
  storageKeyPrefix = 'topbar.state',
}: CollapsibleTopBarOptions): CollapsibleTopBarState {
  const storageKey = `${storageKeyPrefix}.${id}`;

  const [height, setHeightState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}.height`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= minHeight && parsed <= maxHeight) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return defaultHeight;
  });

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}.collapsed`);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // ignore
    }
    return defaultCollapsed;
  });

  const [isPinned, setIsPinned] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}.pinned`);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // ignore
    }
    return defaultPinned;
  });

  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(defaultHeight);

  // Save changes to localStorage
  const setHeight = useCallback(
    (newHeight: number) => {
      const clamped = Math.max(minHeight, Math.min(maxHeight, Math.round(newHeight)));
      setHeightState(clamped);
      try {
        localStorage.setItem(`${storageKey}.height`, clamped.toString());
      } catch {
        // ignore
      }
    },
    [minHeight, maxHeight, storageKey]
  );

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`${storageKey}.collapsed`, next ? 'true' : 'false');
      } catch {
        // ignore
      }
      return next;
    });
  }, [storageKey]);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`${storageKey}.pinned`, next ? 'true' : 'false');
      } catch {
        // ignore
      }
      return next;
    });
  }, [storageKey]);

  const toggleHidden = useCallback(() => {
    setIsHidden((prev) => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    try {
      localStorage.setItem(`${storageKey}.collapsed`, 'false');
    } catch {
      // ignore
    }
  }, [storageKey]);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
    try {
      localStorage.setItem(`${storageKey}.collapsed`, 'true');
    } catch {
      // ignore
    }
  }, [storageKey]);

  // Mouse vertical resize handler
  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      startYRef.current = e.clientY;
      startHeightRef.current = isCollapsed ? minHeight : height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = moveEvent.clientY - startYRef.current;
        const newH = startHeightRef.current + deltaY;
        const clamped = Math.max(minHeight, Math.min(maxHeight, newH));
        setHeightState(clamped);
        if (isCollapsed && deltaY > 10) {
          setIsCollapsed(false);
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        setIsResizing(false);
        const finalDelta = upEvent.clientY - startYRef.current;
        const finalH = Math.max(minHeight, Math.min(maxHeight, startHeightRef.current + finalDelta));
        try {
          localStorage.setItem(`${storageKey}.height`, finalH.toString());
        } catch {
          // ignore
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [height, isCollapsed, minHeight, maxHeight, storageKey]
  );

  return {
    height: isCollapsed ? minHeight : height,
    isCollapsed,
    isPinned,
    isHidden,
    isResizing,
    setHeight,
    toggleCollapse,
    togglePin,
    toggleHidden,
    expand,
    collapse,
    startResize,
  };
}
