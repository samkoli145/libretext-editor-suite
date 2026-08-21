/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Guiding Summary | ContextMenuEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * File: context-menu-engine.ts
 * Path: packages/core/src/engines/context-menu-engine.ts
 * Main Goal: Headless engine that resolves target at mouse coords to context menu actions
 * ID: CORE-ENG-005
 * Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * Innovative Pattern: Dynamic Registry + Tree Sanitizer + Screen Edge Detection
 * (c) All rights reserved - 2026 - MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ContextMenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly shortcut?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
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

export const ContextMenuEngine = {
  register,
  resolve: resolveContextMenu,
  clearRegistry,
} as const;
