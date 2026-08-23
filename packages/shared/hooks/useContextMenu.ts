/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: خطاف إدارة القوائم السياقية - Context Menu Hook
 * 🏛️ الدور: خطاف مشترك - يدير ظهور وإخفاء القوائم السياقية
 * 📥 المستهلك: كل المكونات التي تحتاج قائمة زر الأيمن
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    data-* Attribute Based: اكتشاف القائمة من سمات data-* على DOM
 *    مع تكامل مباشر مع CommandRegistry
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القائمة يجب أن تظهر عند النقر الأيمن فقط
 *    2. يجب إغلاق القائمة عند النقر بالخارج
 *    3. التموضع يجب أن يتكيف مع حدود الشاشة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود data-* قبل العرض
 *    - تنظيف listeners عند الإزالة
 *    - fallback لقائمة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { ContextMenuItem } from '../components/SharedContextMenu';

/**
 * حالة القائمة السياقية.
 */
export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  title?: React.ReactNode;
  targetElement: HTMLElement | null;
  targetId: string | null;
  targetType: string | null;
  items?: ContextMenuItem[];
  context: Record<string, unknown>;
}

const INITIAL_STATE: ContextMenuState = {
  isOpen: false,
  x: 0,
  y: 0,
  title: undefined,
  targetElement: null,
  targetId: null,
  targetType: null,
  items: undefined,
  context: {},
};

export interface UseContextMenuOptions {
  /** هل الخطاف مفعّل؟ (افتراضي: true) */
  enabled?: boolean;

  /** دالة تُستدعى عند فتح القائمة */
  onOpen?: (state: ContextMenuState) => void;

  /** دالة تُستدعى عند إغلاق القائمة */
  onClose?: () => void;

  /** مرشح إضافي: هل نفتح القائمة لهذا العنصر؟ */
  shouldOpen?: (target: HTMLElement) => boolean;
}

export interface UseContextMenuReturn {
  state: ContextMenuState;
  contextMenuState: ContextMenuState;
  containerRef: React.RefObject<HTMLElement | null>;
  closeMenu: () => void;
  closeContextMenu: () => void;
  openMenu: (x: number, y: number, context?: Record<string, unknown>) => void;
  openContextMenu: (
    eOrX: React.MouseEvent | MouseEvent | number,
    itemsOrY?: ContextMenuItem[] | number,
    titleOrContext?: string | React.ReactNode | Record<string, unknown>,
  ) => void;
}

/**
 * خطاف React لإدارة القائمة السياقية.
 * يعترض أحداث contextmenu داخل الحاوية المحددة، ويكتشف العنصر الهدف، ويستخرج السياق من سمات data-*.
 */
export function useContextMenu(options?: UseContextMenuOptions): UseContextMenuReturn {
  const { enabled = true, onOpen, onClose, shouldOpen } = options ?? {};

  const [state, setState] = useState<ContextMenuState>(INITIAL_STATE);
  const containerRef = useRef<HTMLElement | null>(null);
  const escapeHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  /**
   * معالجة حدث الزر الأيمن.
   */
  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;

      // منع القائمة الافتراضية للمتصفح
      event.preventDefault();
      event.stopPropagation();

      // اكتشاف العنصر الهدف
      const target = event.target as HTMLElement;

      // البحث عن أقرب عنصر يحمل سمات سياق
      const contextTarget = target.closest?.(
        '[data-element-id], [data-block-type], [data-editable], [data-context-target]',
      ) as HTMLElement | null;

      // تطبيق المرشح الإضافي إذا كان موجودًا
      if (shouldOpen && !shouldOpen(contextTarget ?? target)) {
        return;
      }

      // استخراج المعرف والنوع
      const targetId = contextTarget?.dataset?.elementId ?? null;
      const targetType =
        contextTarget?.dataset?.blockType ??
        contextTarget?.dataset?.editable ??
        contextTarget?.dataset?.contextTarget ??
        null;

      // استخراج السياق من سمات data-context-*
      const context: Record<string, unknown> = {};
      if (contextTarget && contextTarget.dataset) {
        for (const [key, value] of Object.entries(contextTarget.dataset)) {
          if (key.startsWith('context') && key !== 'contextTarget') {
            const contextKey = key.replace('context', '').replace(/^[A-Z]/, (m) => m.toLowerCase());

            try {
              context[contextKey] = JSON.parse(value ?? 'null');
            } catch {
              context[contextKey] = value;
            }
          }
        }
      }

      const newState: ContextMenuState = {
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        targetElement: contextTarget,
        targetId,
        targetType,
        context,
      };

      setState(newState);
      onOpen?.(newState);
    },
    [enabled, onOpen, shouldOpen],
  );

  /**
   * إغلاق القائمة.
   */
  const closeMenu = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
    onClose?.();
  }, [onClose]);

  /**
   * فتح القائمة برمجيًا.
   */
  const openMenu = useCallback(
    (x: number, y: number, context?: Record<string, unknown>) => {
      const newState: ContextMenuState = {
        isOpen: true,
        x,
        y,
        targetElement: null,
        targetId: null,
        targetType: null,
        context: context ?? {},
      };
      setState(newState);
      onOpen?.(newState);
    },
    [onOpen],
  );

  /**
   * دالة مدمجة لفتح القائمة السياقية تدعم الاستدعاء القديم والجديد والعنوان.
   */
  const openContextMenu = useCallback(
    (
      eOrX: React.MouseEvent | MouseEvent | number,
      itemsOrY?: ContextMenuItem[] | number,
      titleOrContext?: string | React.ReactNode | Record<string, unknown>,
    ) => {
      if (typeof eOrX === 'number' && typeof itemsOrY === 'number') {
        openMenu(
          eOrX,
          itemsOrY,
          typeof titleOrContext === 'object' ? (titleOrContext as Record<string, unknown>) : {},
        );
        return;
      }

      const event = eOrX as React.MouseEvent | MouseEvent;
      event.preventDefault?.();
      event.stopPropagation?.();

      const items = Array.isArray(itemsOrY) ? itemsOrY : undefined;
      const title =
        typeof titleOrContext === 'string' || React.isValidElement(titleOrContext)
          ? (titleOrContext as React.ReactNode)
          : undefined;
      const context =
        typeof titleOrContext === 'object' && !React.isValidElement(titleOrContext)
          ? (titleOrContext as Record<string, unknown>)
          : {};

      const target = (event.target as HTMLElement) || null;
      const contextTarget = target?.closest?.(
        '[data-element-id], [data-block-type], [data-editable], [data-context-target]',
      ) as HTMLElement | null;

      const targetId = contextTarget?.dataset?.elementId ?? null;
      const targetType =
        contextTarget?.dataset?.blockType ??
        contextTarget?.dataset?.editable ??
        contextTarget?.dataset?.contextTarget ??
        null;

      const newState: ContextMenuState = {
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        title,
        targetElement: contextTarget,
        targetId,
        targetType,
        items,
        context,
      };

      setState(newState);
      onOpen?.(newState);
    },
    [openMenu, onOpen],
  );

  // ربط/فصل مستمع الأحداث
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('contextmenu', handleContextMenu);

    const handleOutsideClick = (_e: MouseEvent) => {
      setState((prev) => {
        if (!prev.isOpen) return prev;
        return { ...prev, isOpen: false };
      });
    };

    escapeHandlerRef.current = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
      if (escapeHandlerRef.current) {
        document.addEventListener('keydown', escapeHandlerRef.current);
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      container.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleOutsideClick);
      if (escapeHandlerRef.current) {
        document.removeEventListener('keydown', escapeHandlerRef.current);
      }
    };
  }, [handleContextMenu, closeMenu, enabled]);

  return {
    state,
    contextMenuState: state,
    containerRef,
    closeMenu,
    closeContextMenu: closeMenu,
    openMenu,
    openContextMenu,
  };
}

/**
 * خطاف مساعد لربط القائمة السياقية بـ CommandRegistry.
 */
export function useContextMenuCommands() {
  const executeCommand = useCallback(
    async (commandId: string, context?: Record<string, unknown>) => {
      try {
        const { CommandRegistry } = await import('../../core/commands/CommandRegistry');
        const registry = CommandRegistry.getInstance();

        if (registry && typeof registry.has === 'function' && registry.has(commandId)) {
          await registry.execute(commandId, context);
          return true;
        }

        console.warn(`[ContextMenu] Command not found: ${commandId}`);
        return false;
      } catch (error) {
        console.error(`[ContextMenu] Error executing command: ${commandId}`, error);
        return false;
      }
    },
    [],
  );

  return { executeCommand };
}

/**
 * خطاف متكامل يربط القائمة السياقية بـ CommandRegistry العام.
 * يُستخدم في Shell أو أي حاوية رئيسية.
 */
export function useGlobalContextMenu() {
  const { state, containerRef, closeMenu, openMenu } = useContextMenu({
    enabled: true,
  });

  const executeCommand = useCallback(
    async (commandId: string, context: Record<string, unknown> = {}) => {
      try {
        const { CommandRegistry } = await import('../../core/commands/CommandRegistry');
        const registry = CommandRegistry.getInstance();

        if (registry && typeof registry.has === 'function' && registry.has(commandId)) {
          await registry.execute(commandId, context);
          return true;
        }

        console.warn(`[GlobalContextMenu] Command not registered: ${commandId}`);
        return false;
      } catch (error) {
        console.error(`[GlobalContextMenu] Failed to execute: ${commandId}`, error);
        return false;
      }
    },
    [],
  );

  return {
    state,
    containerRef,
    closeMenu,
    openMenu,
    executeCommand,
  };
}
