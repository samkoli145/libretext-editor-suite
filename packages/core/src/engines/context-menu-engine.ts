/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: context-menu-engine.ts
 * 📂 المسار: packages/core/src/engines/context-menu-engine.ts
 * 🎯 الهدف الرئيسي: Headless engine that resolves target at mouse coords to context menu actions
 * 📋 المعايير: Zero Dependency, Tree Sanitizer, Screen Edge Clamping
 * 🏷️ المعرف: CORE-ENG-005
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dynamic Registry + Tree Sanitizer + Screen Edge Detection + Bilingual Labels
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Engine is pure headless — no DOM, no framework dependency
 *    2. All screen edge detection uses estimated dimensions for perf
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - sanitizeSeparators removes consecutive/leading/trailing separators
 *    - resolveVisibility filters hidden items recursively
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 🧪 اختبارات: engines/context-menu-engine.test.ts
 *    - 📚 مرجع: SharedContextMenu.tsx (المعدل 3 backup)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - register: (#L62) register menu items for a target type
 *    - findMatchingEntries: (#L68) find entries matching target
 *    - resolveVisibility: (#L76) filter hidden items recursively
 *    - sanitizeSeparators: (#L86) clean consecutive/leading/trailing dividers
 *    - detectScreenEdge: (#L105) check if menu overflows viewport
 *    - mergeEntries: (#L115) merge all matching entries
 *    - resolveContextMenu: (#L127) main resolution entry point
 *    - getSelectableItems: (#L143) filter non-disabled actionable items
 *    - navigateFocus: (#L154) keyboard focus navigation
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - Enhanced from المعدل 3 backup SharedContextMenu.tsx patterns
 *    - Added: labelAr, checked, danger, getSelectableItems, navigateFocus
 *    - Size budget: each function < 50 lines
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ContextMenuItem {
  readonly id: string;
  readonly label: string;
  readonly labelAr?: string;
  readonly icon?: string;
  readonly shortcut?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly danger?: boolean;
  readonly checked?: boolean;
  readonly priority?: number;
  readonly children?: readonly ContextMenuItem[];
  readonly action?: () => void;
}

export interface ContextMenuTarget {
  readonly targetType: string;
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly selected?: boolean;
}

export interface ContextMenuResult {
  readonly items: readonly ContextMenuItem[];
  readonly x: number;
  readonly y: number;
  readonly adjustedX: boolean;
  readonly adjustedY: boolean;
}

type MenuItemPredicate = (target: ContextMenuTarget) => boolean;

interface RegisteredEntry {
  targetType: string;
  items: ContextMenuItem[];
  predicate?: MenuItemPredicate;
}

const registry: RegisteredEntry[] = [];

function register(targetType: string, items: ContextMenuItem[], predicate?: MenuItemPredicate): void {
  registry.push({ targetType, items, predicate });
}

function findMatchingEntries(target: ContextMenuTarget): RegisteredEntry[] {
  return registry.filter(e =>
    e.targetType === '*' || e.targetType === target.targetType
  );
}

function resolveVisibility(items: readonly ContextMenuItem[], target: ContextMenuTarget): ContextMenuItem[] {
  return items
    .filter(item => item.visible === undefined || item.visible)
    .map(item => ({
      ...item,
      disabled: item.disabled,
      children: item.children ? resolveVisibility(item.children, target) : undefined,
    }));
}

function sanitizeSeparators(items: ContextMenuItem[]): ContextMenuItem[] {
  const result: ContextMenuItem[] = [];
  let lastWasSeparator = true;
  for (const item of items) {
    if (item.separator) {
      if (!lastWasSeparator && result.length > 0) {
        result.push(item);
        lastWasSeparator = true;
      }
    } else {
      result.push(item);
      lastWasSeparator = false;
    }
  }
  const lastItem = result[result.length - 1];
  if (result.length > 0 && lastItem?.separator) {
    result.pop();
  }
  return result;
}

function detectScreenEdge(x: number, y: number, width: number, height: number): { adjustX: boolean; adjustY: boolean } {
  const MENU_ESTIMATED_WIDTH = 220;
  const MENU_ESTIMATED_HEIGHT = 280;
  return {
    adjustX: x + MENU_ESTIMATED_WIDTH > width,
    adjustY: y + MENU_ESTIMATED_HEIGHT > height,
  };
}

function mergeEntries(entries: RegisteredEntry[], target: ContextMenuTarget): ContextMenuItem[] {
  const merged: ContextMenuItem[] = [];
  for (const entry of entries) {
    if (entry.predicate && !entry.predicate(target)) continue;
    const resolved = resolveVisibility(entry.items, target);
    merged.push(...resolved);
  }
  return sanitizeSeparators(merged);
}

export function resolveContextMenu(
  target: ContextMenuTarget,
  viewportWidth: number,
  viewportHeight: number,
): ContextMenuResult {
  const entries = findMatchingEntries(target);
  const items = mergeEntries(entries, target);
  const edge = detectScreenEdge(target.x, target.y, viewportWidth, viewportHeight);
  return {
    items,
    x: edge.adjustX ? target.x - 220 : target.x,
    y: edge.adjustY ? target.y - 280 : target.y,
    adjustedX: edge.adjustX,
    adjustedY: edge.adjustY,
  };
}

export function clearRegistry(): void {
  registry.length = 0;
}

function getSelectableItems(items: readonly ContextMenuItem[]): ContextMenuItem[] {
  return items.filter(item =>
    !item.separator && !item.disabled && typeof item.action === 'function'
  );
}

function navigateFocus(
  items: readonly ContextMenuItem[],
  current: number,
  direction: 'up' | 'down'
): number {
  const selectable = getSelectableItems(items);
  if (selectable.length === 0) return -1;
  if (direction === 'down') {
    return (current + 1) % selectable.length;
  }
  return (current - 1 + selectable.length) % selectable.length;
}

function buildEditableFieldItems(actions: {
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onSelectAll?: () => void;
  onDelete?: () => void;
  hasSelection?: boolean;
}): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];
  if (actions.onCut) {
    items.push({ id: 'cut', label: 'Cut', labelAr: 'قص', shortcut: 'Ctrl+X', disabled: !actions.hasSelection, action: actions.onCut });
  }
  if (actions.onCopy) {
    items.push({ id: 'copy', label: 'Copy', labelAr: 'نسخ', shortcut: 'Ctrl+C', disabled: !actions.hasSelection, action: actions.onCopy });
  }
  if (actions.onPaste) {
    items.push({ id: 'paste', label: 'Paste', labelAr: 'لصق', shortcut: 'Ctrl+V', action: actions.onPaste });
  }
  items.push({ id: 'sep1', label: '', separator: true });
  if (actions.onSelectAll) {
    items.push({ id: 'select-all', label: 'Select All', labelAr: 'تحديد الكل', shortcut: 'Ctrl+A', action: actions.onSelectAll });
  }
  if (actions.onDelete) {
    items.push({ id: 'delete', label: 'Delete', labelAr: 'حذف', danger: true, shortcut: 'Del', action: actions.onDelete });
  }
  return items;
}

export const ContextMenuEngine = {
  register,
  resolve: resolveContextMenu,
  clearRegistry,
  getSelectableItems,
  navigateFocus,
  buildEditableFieldItems,
} as const;
