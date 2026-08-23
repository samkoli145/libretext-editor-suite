/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: composable-traits-engine.ts
 * 📂 المسار: packages/core/src/engines/composable-traits-engine.ts
 * 🎯 الهدف الرئيسي: [يُحدد لاحقاً]
 * 🏷️ المعرف: [يُحدد لاحقاً]
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Guiding Summary | ComposableTraitsEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * File: composable-traits-engine.ts
 * Path: packages/core/src/engines/composable-traits-engine.ts
 * Main Goal: Composable trait system for context menus + floating gizmos per block type
 * ID: CORE-ENG-007
 * Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * Innovative Pattern: Trait Composition + Auto Context Menu + Gizmo Profile
 * (c) All rights reserved - 2026 - MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ContextMenuItem } from './context-menu-engine';

export interface TraitDef {
  readonly name: string;
  readonly contextMenuItems: readonly ContextMenuItem[];
  readonly gizmoActions: readonly string[];
}

export interface ComposedProfile {
  readonly targetType: string;
  readonly domain: string;
  readonly traits: readonly string[];
  readonly contextMenuActions: readonly ContextMenuItem[];
  readonly gizmoActions: readonly string[];
}

const CUT = { id: 'cut', label: 'Cut', icon: '✂' } as const;
const COPY = { id: 'copy', label: 'Copy', icon: '📋' } as const;
const PASTE = { id: 'paste', label: 'Paste', icon: '📄' } as const;
const DEL = { id: 'delete', label: 'Delete', icon: '🗑' } as const;
const SEP = { id: '', label: '', separator: true } as const;
const BOLD = { id: 'bold', label: 'Bold', icon: 'B' } as const;
const ITALIC = { id: 'italic', label: 'Italic', icon: 'I' } as const;
const UNDERLINE = { id: 'underline', label: 'Underline', icon: 'U' } as const;
const ALIGN_L = { id: 'align-left', label: 'Align Left', icon: '⬅' } as const;
const ALIGN_C = { id: 'align-center', label: 'Align Center', icon: '⬆' } as const;
const ALIGN_R = { id: 'align-right', label: 'Align Right', icon: '➡' } as const;
const BRING_FWD = { id: 'bring-forward', label: 'Bring Forward', icon: '⬆' } as const;
const SEND_BWD = { id: 'send-backward', label: 'Send Backward', icon: '⬇' } as const;

const TRAIT_DEFS: Record<string, TraitDef> = {
  Editable: {
    name: 'Editable',
    contextMenuItems: [CUT, COPY, PASTE, SEP, DEL],
    gizmoActions: ['delete', 'lock'],
  },
  Draggable: {
    name: 'Draggable',
    contextMenuItems: [BRING_FWD, SEND_BWD],
    gizmoActions: ['bring-forward', 'send-backward'],
  },
  FormattingSupport: {
    name: 'FormattingSupport',
    contextMenuItems: [BOLD, ITALIC, UNDERLINE, SEP, ALIGN_L, ALIGN_C, ALIGN_R],
    gizmoActions: ['bold', 'italic', 'underline', 'align-left', 'align-center', 'align-right'],
  },
  SpatialTransform: {
    name: 'SpatialTransform',
    contextMenuItems: [
      { id: 'rotate-90', label: 'Rotate 90', icon: '↻' },
      { id: 'rotate-45', label: 'Rotate 45', icon: '↻' },
    ],
    gizmoActions: ['rotate-90', 'rotate-45', 'resize-handles'],
  },
  ClipboardAndLifecycle: {
    name: 'ClipboardAndLifecycle',
    contextMenuItems: [CUT, COPY, PASTE, SEP, DEL],
    gizmoActions: ['cut', 'copy', 'paste', 'delete'],
  },
  TableGrid: {
    name: 'TableGrid',
    contextMenuItems: [
      { id: 'insert-row', label: 'Insert Row', icon: '➕' },
      { id: 'insert-col', label: 'Insert Column', icon: '➕' },
      SEP,
      { id: 'delete-row', label: 'Delete Row', icon: '➖' },
      { id: 'delete-col', label: 'Delete Column', icon: '➖' },
      SEP,
      { id: 'merge-cells', label: 'Merge Cells', icon: '🔲' },
    ],
    gizmoActions: ['insert-row', 'insert-col', 'delete-row', 'delete-col'],
  },
};

function mergeTraitItems(traits: readonly string[]): ContextMenuItem[] {
  const merged: ContextMenuItem[] = [];
  let lastSep = true;
  for (const t of traits) {
    const def = TRAIT_DEFS[t];
    if (!def) continue;
    for (const item of def.contextMenuItems) {
      if (item.separator) {
        if (!lastSep && merged.length > 0) {
          merged.push(SEP);
          lastSep = true;
        }
      } else {
        merged.push(item);
        lastSep = false;
      }
    }
  }
  const last = merged[merged.length - 1];
  if (merged.length > 0 && last?.separator) merged.pop();
  return merged;
}

function mergeGizmoActions(traits: readonly string[]): string[] {
  const all: string[] = [];
  for (const t of traits) {
    const def = TRAIT_DEFS[t];
    if (def) all.push(...def.gizmoActions);
  }
  return [...new Set(all)];
}

export function composeTraits(
  targetType: string,
  domain: string,
  traits: readonly string[],
): ComposedProfile {
  return {
    targetType,
    domain,
    traits,
    contextMenuActions: mergeTraitItems(traits),
    gizmoActions: mergeGizmoActions(traits),
  };
}

export function getTraitDef(name: string): TraitDef | undefined {
  return TRAIT_DEFS[name];
}

export function listTraits(): string[] {
  return Object.keys(TRAIT_DEFS);
}

export const ComposableTraitsEngine = {
  composeTraits,
  getTraitDef,
  listTraits,
} as const;
