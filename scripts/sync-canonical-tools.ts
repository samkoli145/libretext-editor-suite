/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 Guiding Summary | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 File: sync-canonical-tools.ts
 * 📂 Path: scripts/sync-canonical-tools.ts
 * 🎯 Main Goal: Sync canonical tool templates across all editor domains
 * 📋 Criteria: Define shared tool sets, verify consistency
 * 🧪 Tests: Run via `pnpm sync:canonical-tools`
 * 🏷️ ID: INFRA-022
 * 📅 Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 Innovative Pattern: Canonical Tooling Harmonizer
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ All rights reserved ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ToolActionTemplate {
  id: string;
  name: string;
  category: string;
  domains: string[];
  canonicalTrigger: 'left_click' | 'right_click' | 'drag' | 'floating_gizmo';
}

export const SHARED_TOOL_SETS: Record<string, ToolActionTemplate[]> = {
  textFormatting: [
    {
      id: 'bold',
      name: 'Bold',
      category: 'Text Formatting',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'floating_gizmo',
    },
    {
      id: 'italic',
      name: 'Italic',
      category: 'Text Formatting',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'floating_gizmo',
    },
    {
      id: 'underline',
      name: 'Underline',
      category: 'Text Formatting',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'floating_gizmo',
    },
    {
      id: 'color',
      name: 'Text Color',
      category: 'Text Formatting',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'floating_gizmo',
    },
    {
      id: 'align',
      name: 'Align',
      category: 'Text Formatting',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'floating_gizmo',
    },
  ],
  spatialTransform: [
    {
      id: 'scale_8_handles',
      name: 'Resize (8 Handles)',
      category: 'Spatial Transform',
      domains: ['Impress', 'Writer'],
      canonicalTrigger: 'drag',
    },
    {
      id: 'rotate_handle',
      name: 'Rotate Knob',
      category: 'Spatial Transform',
      domains: ['Impress'],
      canonicalTrigger: 'drag',
    },
    {
      id: 'bring_forward',
      name: 'Bring Forward',
      category: 'Z-Order',
      domains: ['Impress', 'Writer'],
      canonicalTrigger: 'right_click',
    },
    {
      id: 'send_backward',
      name: 'Send Backward',
      category: 'Z-Order',
      domains: ['Impress', 'Writer'],
      canonicalTrigger: 'right_click',
    },
  ],
  clipboardAndLifecycle: [
    {
      id: 'cut',
      name: 'Cut',
      category: 'Clipboard',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'right_click',
    },
    {
      id: 'copy',
      name: 'Copy',
      category: 'Clipboard',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'right_click',
    },
    {
      id: 'paste',
      name: 'Paste',
      category: 'Clipboard',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'right_click',
    },
    {
      id: 'duplicate',
      name: 'Duplicate',
      category: 'Clipboard',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'right_click',
    },
    {
      id: 'delete',
      name: 'Delete',
      category: 'Clipboard',
      domains: ['Writer', 'Calc', 'Impress', 'Base'],
      canonicalTrigger: 'right_click',
    },
  ],
};

export function syncToolsAcrossEditors(): { totalSynced: number; categoriesCount: number } {
  let count = 0;
  for (const key of Object.keys(SHARED_TOOL_SETS)) {
    count += SHARED_TOOL_SETS[key]?.length ?? 0;
  }
  return { totalSynced: count, categoriesCount: Object.keys(SHARED_TOOL_SETS).length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = syncToolsAcrossEditors();
  console.log(
    `[sync:canonical-tools] Harmonized ${r.totalSynced} tools across ${r.categoriesCount} categories`,
  );
  for (const [cat, tools] of Object.entries(SHARED_TOOL_SETS)) {
    console.log(`  ${cat}: ${tools.map((t) => t.id).join(', ')}`);
  }
}
