/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Guiding Summary | SelectionGizmoEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * File: selection-gizmo-engine.ts
 * Path: packages/core/src/engines/selection-gizmo-engine.ts
 * Main Goal: Calculate handle positions, gizmo toolbar, and bounding box from selected elements
 * ID: CORE-ENG-006
 * Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * Innovative Pattern: 8-Point Handle Calculator + Adaptive Gizmo Positioning
 * (c) All rights reserved - 2026 - MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export interface Handle {
  readonly pos: HandlePosition;
  readonly cx: number;
  readonly cy: number;
  readonly cursor: string;
}

export interface GizmoToolbar {
  readonly x: number;
  readonly y: number;
  readonly items: readonly GizmoAction[];
}

export interface GizmoAction {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly enabled: boolean;
}

const HANDLE_SIZE = 8;
const TOOLBAR_HEIGHT = 36;
const TOOLBAR_OFFSET = 12;

const CURSOR_MAP: Record<HandlePosition, string> = {
  nw: 'nw-resize',
  n: 'n-resize',
  ne: 'ne-resize',
  e: 'e-resize',
  se: 'se-resize',
  s: 's-resize',
  sw: 'sw-resize',
  w: 'w-resize',
};

function calcHandlePositions(bbox: Rect): Handle[] {
  const { x, y, width: w, height: h } = bbox;
  const hs = HANDLE_SIZE / 2;
  return [
    { pos: 'nw', cx: x - hs, cy: y - hs, cursor: CURSOR_MAP.nw },
    { pos: 'n', cx: x + w / 2 - hs, cy: y - hs, cursor: CURSOR_MAP.n },
    { pos: 'ne', cx: x + w - hs, cy: y - hs, cursor: CURSOR_MAP.ne },
    { pos: 'e', cx: x + w - hs, cy: y + h / 2 - hs, cursor: CURSOR_MAP.e },
    { pos: 'se', cx: x + w - hs, cy: y + h - hs, cursor: CURSOR_MAP.se },
    { pos: 's', cx: x + w / 2 - hs, cy: y + h - hs, cursor: CURSOR_MAP.s },
    { pos: 'sw', cx: x - hs, cy: y + h - hs, cursor: CURSOR_MAP.sw },
    { pos: 'w', cx: x - hs, cy: y + h / 2 - hs, cursor: CURSOR_MAP.w },
  ];
}

function computeBoundingBox(
  elements: ReadonlyArray<{ x: number; y: number; width: number; height: number }>,
): Rect | null {
  if (elements.length === 0) return null;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const el of elements) {
    if (el.x < minX) minX = el.x;
    if (el.y < minY) minY = el.y;
    if (el.x + el.width > maxX) maxX = el.x + el.width;
    if (el.y + el.height > maxY) maxY = el.y + el.height;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function positionToolbar(bbox: Rect): { x: number; y: number } {
  return {
    x: bbox.x + bbox.width / 2 - 110,
    y: bbox.y - TOOLBAR_HEIGHT - TOOLBAR_OFFSET,
  };
}

function getDefaultToolbarItems(hasMultiple: boolean): GizmoAction[] {
  const items: GizmoAction[] = [
    { id: 'align-left', icon: '⬅', label: 'Align Left', enabled: hasMultiple },
    { id: 'align-center', icon: '⬆', label: 'Align Center', enabled: hasMultiple },
    { id: 'align-right', icon: '➡', label: 'Align Right', enabled: hasMultiple },
    { id: 'distribute-h', icon: '↔', label: 'Distribute H', enabled: hasMultiple },
    { id: 'rotate-90', icon: '↻90', label: 'Rotate 90', enabled: true },
    { id: 'rotate-45', icon: '↻45', label: 'Rotate 45', enabled: true },
    { id: 'lock', icon: '🔒', label: 'Lock', enabled: true },
    { id: 'delete', icon: '🗑', label: 'Delete', enabled: true },
  ];
  return items;
}

export function computeGizmo(
  elements: ReadonlyArray<{ x: number; y: number; width: number; height: number }>,
): { bbox: Rect; handles: Handle[]; toolbar: GizmoToolbar } | null {
  const bbox = computeBoundingBox(elements);
  if (!bbox) return null;
  const handles = calcHandlePositions(bbox);
  const pos = positionToolbar(bbox);
  return {
    bbox,
    handles,
    toolbar: { x: pos.x, y: pos.y, items: getDefaultToolbarItems(elements.length > 1) },
  };
}

export const SelectionGizmoEngine = {
  computeGizmo,
  computeBoundingBox,
  calcHandlePositions,
  positionToolbar,
} as const;
