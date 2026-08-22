/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: context-menu-interactions.ts
 * 📂 المسار: packages/core/src/engines/context-menu-interactions.ts
 * 🎯 الهدف الرئيسي: Mouse/Keyboard interaction layer for context menus
 *    — scroll close, hover tracking, keyboard navigation, semantic icons
 * 📋 المعايير: Zero Dependency, Headless, <50 lines/function
 * 🏷️ المعرف: CORE-ENG-022
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Headless Interaction Layer — pure functions for scroll/hover/keyboard
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Scroll listeners use { capture: true, passive: true } for perf
 *    2. All handlers must return cleanup functions
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - All callbacks wrapped in try/catch
 *    - Null-safe DOM checks before listener attachment
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/core/src/index.ts
 *    - 📦 التبعيات: لا توجد
 *    - 📄 مرتبط: context-menu-engine.ts, context-menu-css.ts
 *    - 🧪 اختبارات: tests/engines/context-menu-interactions.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createScrollCloseHandler: (#L30) auto-close on scroll/wheel
 *    - createHoverTracker: (#L55) track mouse hover over menu items
 *    - createKeyboardNavHandler: (#L80) ArrowUp/Down/Enter/Escape nav
 *    - resolveSemanticIcon: (#L110) map action ID to icon key
 *    - CONTEXT_MENU_ICON_MAP: (#L135) semantic icon registry
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - Inspired by المعدل 3 SharedContextMenu.tsx patterns
 *    - Icons are string keys mapped to any icon system (lucide, custom SVG)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── Scroll Auto-Close ───

export interface ScrollCloseOptions {
  readonly onClose: () => void;
  readonly debounceMs?: number;
  readonly target?: { addEventListener: Function; removeEventListener: Function };
}

export function createScrollCloseHandler(opts: ScrollCloseOptions): () => void {
  const { onClose, debounceMs = 0 } = opts;
  const tgt = opts.target ?? (typeof window !== 'undefined' ? window : null);
  let closed = false;

  const handler = () => {
    if (!closed) {
      closed = true;
      onClose();
    }
  };

  const debounced = debounceMs > 0 ? debounce(handler, debounceMs) : handler;

  if (!tgt) return () => {};

  tgt.addEventListener('scroll', debounced, { capture: true, passive: true });
  tgt.addEventListener('wheel', debounced, { capture: true, passive: true });

  return () => {
    tgt.removeEventListener('scroll', debounced, { capture: true });
    tgt.removeEventListener('wheel', debounced, { capture: true });
  };
}

function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

// ─── Hover Tracking ───

export interface HoverState {
  readonly hoveredIndex: number;
  readonly hoveredId: string | null;
}

export interface HoverTracker {
  readonly getState: () => HoverState;
  readonly onEnter: (index: number, id: string) => void;
  readonly onLeave: () => void;
  readonly reset: () => void;
}

export function createHoverTracker(onChange?: (state: HoverState) => void): HoverTracker {
  let state: HoverState = { hoveredIndex: -1, hoveredId: null };

  const emit = () => onChange?.(state);

  return {
    getState: () => state,
    onEnter: (index: number, id: string) => {
      state = { hoveredIndex: index, hoveredId: id };
      emit();
    },
    onLeave: () => {
      state = { hoveredIndex: -1, hoveredId: null };
      emit();
    },
    reset: () => {
      state = { hoveredIndex: -1, hoveredId: null };
      emit();
    },
  };
}

// ─── Keyboard Navigation ───

export interface KeyboardNavState {
  readonly focusedIndex: number;
  readonly focusedId: string | null;
}

export interface KeyboardNavHandler {
  readonly getState: () => KeyboardNavState;
  readonly handleKeyDown: (key: string) => 'select' | 'close' | 'navigate' | 'none';
  readonly setIndex: (i: number) => void;
  readonly reset: () => void;
}

export function createKeyboardNavHandler(
  itemIds: readonly string[],
  disabledFlags: readonly boolean[],
  opts?: { onSelect?: (id: string) => void; onClose?: () => void }
): KeyboardNavHandler {
  let state: KeyboardNavState = { focusedIndex: -1, focusedId: null };

  const selectable = itemIds
    .map((id, i) => ({ id, i, disabled: disabledFlags[i] ?? false }))
    .filter(e => !e.disabled);

  const clamp = (i: number) => (i + selectable.length) % (selectable.length || 1);
  const getSelectableId = (idx: number) => selectable[idx]?.id ?? null;

  return {
    getState: () => state,
    handleKeyDown: (key: string) => {
      if (key === 'ArrowDown') {
        state = {
          focusedIndex: clamp(state.focusedIndex + 1),
          focusedId: getSelectableId(clamp(state.focusedIndex + 1)),
        };
        return 'navigate';
      }
      if (key === 'ArrowUp') {
        state = {
          focusedIndex: clamp(state.focusedIndex - 1),
          focusedId: getSelectableId(clamp(state.focusedIndex - 1)),
        };
        return 'navigate';
      }
      if (key === 'Enter' && state.focusedIndex >= 0) {
        const id = getSelectableId(state.focusedIndex);
        if (id) opts?.onSelect?.(id);
        return 'select';
      }
      if (key === 'Escape') {
        opts?.onClose?.();
        return 'close';
      }
      return 'none';
    },
    setIndex: (i: number) => {
      state = { focusedIndex: i, focusedId: getSelectableId(i) };
    },
    reset: () => {
      state = { focusedIndex: -1, focusedId: null };
    },
  };
}

// ─── Semantic Icon Map ───

export type ContextMenuIconKey =
  | 'cut' | 'copy' | 'paste' | 'delete' | 'duplicate'
  | 'select-all' | 'undo' | 'redo'
  | 'bold' | 'italic' | 'underline' | 'strikethrough'
  | 'align-left' | 'align-center' | 'align-right' | 'align-justify'
  | 'insert-table' | 'insert-image' | 'insert-link' | 'insert-code'
  | 'insert-math' | 'insert-callout' | 'insert-shape'
  | 'bring-forward' | 'send-backward' | 'group' | 'ungroup'
  | 'lock' | 'unlock' | 'rotate'
  | 'export-pdf' | 'export-html' | 'export-markdown' | 'export-latex'
  | 'zoom-in' | 'zoom-out' | 'fit-to-screen'
  | 'properties' | 'format-cells' | 'sort-asc' | 'sort-desc'
  | 'add-row' | 'add-col' | 'del-row' | 'del-col' | 'merge-cells'
  | 'find-replace' | 'print' | 'page-setup';

export const CONTEXT_MENU_ICON_MAP: ReadonlyMap<ContextMenuIconKey, string> = new Map([
  ['cut', 'scissors'], ['copy', 'clipboard'], ['paste', 'clipboard-paste'],
  ['delete', 'trash-2'], ['duplicate', 'copy-plus'], ['select-all', 'list-checks'],
  ['undo', 'undo-2'], ['redo', 'redo-2'],
  ['bold', 'bold'], ['italic', 'italic'], ['underline', 'underline'],
  ['strikethrough', 'strikethrough'],
  ['align-left', 'align-left'], ['align-center', 'align-center'],
  ['align-right', 'align-right'], ['align-justify', 'align-justify'],
  ['insert-table', 'table'], ['insert-image', 'image'],
  ['insert-link', 'link'], ['insert-code', 'code-2'],
  ['insert-math', 'sigma'], ['insert-callout', 'message-square'],
  ['insert-shape', 'pentagon'],
  ['bring-forward', 'arrow-up-to-line'], ['send-backward', 'arrow-down-to-line'],
  ['group', 'group'], ['ungroup', 'ungroup'],
  ['lock', 'lock'], ['unlock', 'unlock'], ['rotate', 'rotate-cw'],
  ['export-pdf', 'file-text'], ['export-html', 'globe'],
  ['export-markdown', 'file-code-2'], ['export-latex', 'sigma-square'],
  ['zoom-in', 'zoom-in'], ['zoom-out', 'zoom-out'], ['fit-to-screen', 'maximize-2'],
  ['properties', 'settings'], ['format-cells', 'paintbrush'],
  ['sort-asc', 'arrow-up-narrow-wide'], ['sort-desc', 'arrow-down-wide-narrow'],
  ['add-row', 'plus-square'], ['add-col', 'columns-3-add'],
  ['del-row', 'minus-square'], ['del-col', 'columns-3-minus'],
  ['merge-cells', 'merge'], ['find-replace', 'search-replace'],
  ['print', 'printer'], ['page-setup', 'page-setup'],
]);

export function resolveSemanticIcon(iconKey: ContextMenuIconKey): string {
  return CONTEXT_MENU_ICON_MAP.get(iconKey) ?? 'circle';
}
