/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Guiding Summary | FloatingGizmoEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * File: floating-gizmo-engine.ts
 * Path: packages/core/src/engines/floating-gizmo-engine.ts
 * Main Goal: Adaptive floating toolbar that appears above selected elements
 * ID: CORE-ENG-008
 * Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * Innovative Pattern: Adaptive Positioning + Action Grouping + Edge Clamping
 * (c) All rights reserved - 2026 - MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface GizmoPosition {
  readonly x: number;
  readonly y: number;
}

export interface FloatingAction {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly group: string;
  readonly enabled: boolean;
}

export interface FloatingGizmoState {
  readonly visible: boolean;
  readonly position: GizmoPosition;
  readonly actions: readonly FloatingAction[];
  readonly groups: readonly string[];
}

const TOOLBAR_H = 40;
const TOOLBAR_PAD = 14;
const GROUP_GAP = 6;

const ACTION_REGISTRY: Record<string, FloatingAction[]> = {
  alignment: [
    { id: 'align-left', icon: '⬅', label: 'Align Left', group: 'alignment', enabled: true },
    { id: 'align-center-h', icon: '⬆', label: 'Align Center H', group: 'alignment', enabled: true },
    { id: 'align-right', icon: '➡', label: 'Align Right', group: 'alignment', enabled: true },
    { id: 'align-top', icon: '⬆', label: 'Align Top', group: 'alignment', enabled: true },
    { id: 'align-center-v', icon: '⬇', label: 'Align Center V', group: 'alignment', enabled: true },
    { id: 'align-bottom', icon: '⬇', label: 'Align Bottom', group: 'alignment', enabled: true },
  ],
  distribute: [
    { id: 'distribute-h', icon: '↔', label: 'Distribute H', group: 'distribute', enabled: true },
    { id: 'distribute-v', icon: '↕', label: 'Distribute V', group: 'distribute', enabled: true },
  ],
  rotate: [
    { id: 'rotate-90-cw', icon: '↻90', label: 'Rotate 90 CW', group: 'rotate', enabled: true },
    { id: 'rotate-90-ccw', icon: '↺90', label: 'Rotate 90 CCW', group: 'rotate', enabled: true },
    { id: 'rotate-45', icon: '↻45', label: 'Rotate 45', group: 'rotate', enabled: true },
  ],
  zorder: [
    { id: 'bring-front', icon: '⏫', label: 'Bring to Front', group: 'zorder', enabled: true },
    { id: 'bring-forward', icon: '⬆', label: 'Bring Forward', group: 'zorder', enabled: true },
    { id: 'send-backward', icon: '⬇', label: 'Send Backward', group: 'zorder', enabled: true },
    { id: 'send-back', icon: '⏬', label: 'Send to Back', group: 'zorder', enabled: true },
  ],
  lifecycle: [
    { id: 'lock', icon: '🔒', label: 'Lock', group: 'lifecycle', enabled: true },
    { id: 'duplicate', icon: '📋', label: 'Duplicate', group: 'lifecycle', enabled: true },
    { id: 'delete', icon: '🗑', label: 'Delete', group: 'lifecycle', enabled: true },
  ],
};

function resolveActions(actionIds: readonly string[]): FloatingAction[] {
  const result: FloatingAction[] = [];
  const seen = new Set<string>();
  for (const id of actionIds) {
    for (const group of Object.values(ACTION_REGISTRY)) {
      const found = group.find((a) => a.id === id);
      if (found && !seen.has(found.id)) {
        result.push(found);
        seen.add(found.id);
      }
    }
  }
  return result;
}

function groupActions(actions: readonly FloatingAction[]): string[] {
  return [...new Set(actions.map((a) => a.group))];
}

function calcWidth(groups: readonly string[], actions: readonly FloatingAction[]): number {
  let w = TOOLBAR_PAD * 2;
  for (let i = 0; i < groups.length; i++) {
    const gActions = actions.filter((a) => a.group === groups[i]);
    w += gActions.length * 32;
    if (i < groups.length - 1) w += GROUP_GAP;
  }
  return w;
}

function positionAbove(
  bbox: { x: number; y: number; width: number; height: number },
  vw: number,
  vh: number,
): GizmoPosition {
  const w = calcWidth(groupActions(resolveActions([])), resolveActions([]));
  let x = bbox.x + bbox.width / 2 - w / 2;
  let y = bbox.y - TOOLBAR_H - TOOLBAR_PAD;
  if (x < 4) x = 4;
  if (x + w > vw - 4) x = vw - w - 4;
  if (y < 4) y = bbox.y + bbox.height + TOOLBAR_PAD;
  return { x, y };
}

export function computeFloatingGizmo(
  bbox: { x: number; y: number; width: number; height: number },
  actionIds: readonly string[],
  viewportWidth: number,
  viewportHeight: number,
): FloatingGizmoState {
  const actions = resolveActions(actionIds);
  const groups = groupActions(actions);
  const pos = positionAbove(bbox, viewportWidth, viewportHeight);
  return { visible: true, position: pos, actions, groups };
}

export function hideGizmo(): FloatingGizmoState {
  return { visible: false, position: { x: 0, y: 0 }, actions: [], groups: [] };
}

export const FloatingGizmoEngine = {
  computeFloatingGizmo,
  hideGizmo,
  resolveActions,
  groupActions,
  ACTION_REGISTRY,
} as const;
