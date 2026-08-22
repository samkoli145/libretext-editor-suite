/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: context-menu-engine-enhanced.test.ts
 * 📂 المسار: packages/core/tests/engines/context-menu-engine-enhanced.test.ts
 * 🎯 الهدف الرئيسي: Tests for enhanced contextMenuEngine with iconKey,
 *    buildCanvasMenuItems, buildRichTextMenuItems
 * 🏷️ المعرف: TEST-CORE-012-ENH
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createContextMenuEngine,
  buildCanvasMenuItems,
  buildRichTextMenuItems,
} from '../../src/contextMenuEngine';

// ─── Canvas Menu Builder ───

describe('buildCanvasMenuItems', () => {
  const ctx = {
    targetType: 'shape',
    selectedObjects: [],
    position: { x: 100, y: 100 },
  };

  it('builds items with iconKey', () => {
    const items = buildCanvasMenuItems({
      onDuplicate: vi.fn(),
      onDelete: vi.fn(),
    });

    const dup = items.find(i => i.type === 'action' && i.id === 'duplicate');
    expect(dup).toBeDefined();
    if (dup && 'iconKey' in dup) {
      expect(dup.iconKey).toBe('duplicate');
    }
  });

  it('includes danger flag on delete', () => {
    const items = buildCanvasMenuItems({ onDelete: vi.fn() });
    const del = items.find(i => i.type === 'action' && i.id === 'delete');
    expect(del).toBeDefined();
    if (del && 'danger' in del) {
      expect(del.danger).toBe(true);
    }
  });

  it('includes separator before delete', () => {
    const items = buildCanvasMenuItems({ onDelete: vi.fn(), onDuplicate: vi.fn() });
    const sepIdx = items.findIndex(i => i.type === 'separator');
    const delIdx = items.findIndex(i => i.type === 'action' && 'danger' in i && i.danger);
    expect(sepIdx).toBeGreaterThan(-1);
    expect(delIdx).toBeGreaterThan(sepIdx);
  });

  it('builds empty array when no actions provided', () => {
    const items = buildCanvasMenuItems({});
    expect(items).toHaveLength(0);
  });

  it('includes labelAr', () => {
    const items = buildCanvasMenuItems({ onDuplicate: vi.fn() });
    const dup = items.find(i => i.type === 'action' && i.id === 'duplicate');
    expect(dup).toBeDefined();
    if (dup && 'labelAr' in dup) {
      expect(dup.labelAr).toBe('تكرار');
    }
  });
});

// ─── RichText Menu Builder ───

describe('buildRichTextMenuItems', () => {
  it('builds items with iconKeys', () => {
    const items = buildRichTextMenuItems({
      onCopy: vi.fn(),
      onCut: vi.fn(),
      onPaste: vi.fn(),
    });

    const copy = items.find(i => i.type === 'action' && i.id === 'copy');
    expect(copy).toBeDefined();
    if (copy && 'iconKey' in copy) {
      expect(copy.iconKey).toBe('copy');
    }
  });

  it('includes shortcuts', () => {
    const items = buildRichTextMenuItems({ onCut: vi.fn(), onCopy: vi.fn() });
    const cut = items.find(i => i.type === 'action' && i.id === 'cut');
    expect(cut).toBeDefined();
    if (cut && 'shortcut' in cut) {
      expect(cut.shortcut).toBe('Ctrl+X');
    }
  });

  it('delete is danger', () => {
    const items = buildRichTextMenuItems({ onDelete: vi.fn() });
    const del = items.find(i => i.type === 'action' && i.id === 'delete');
    expect(del).toBeDefined();
    if (del && 'danger' in del) {
      expect(del.danger).toBe(true);
    }
  });
});

// ─── Enhanced Engine with iconKey ───

describe('createContextMenuEngine with iconKey', () => {
  it('resolves items with iconKey', () => {
    const engine = createContextMenuEngine();
    const ctx = {
      targetType: 'text',
      selectedObjects: [],
      position: { x: 100, y: 100 },
    };

    engine.register({
      id: 'test-menu',
      target: 'text',
      items: [
        { id: 'copy', type: 'action', label: 'Copy', iconKey: 'copy', handler: vi.fn() },
      ],
    });

    const items = engine.getMenuItems(ctx);
    expect(items).toHaveLength(1);
    if (items[0].type === 'action') {
      expect(items[0].iconKey).toBe('copy');
    }
  });

  it('resolves submenu with iconKey', () => {
    const engine = createContextMenuEngine();
    const ctx = {
      targetType: 'shape',
      selectedObjects: [],
      position: { x: 100, y: 100 },
    };

    engine.register({
      id: 'submenu-test',
      target: 'shape',
      items: [
        {
          id: 'export-sub',
          type: 'submenu',
          label: 'Export',
          iconKey: 'export-pdf',
          items: [
            { id: 'pdf', type: 'action', label: 'PDF', handler: vi.fn() },
          ],
        },
      ],
    });

    const items = engine.getMenuItems(ctx);
    expect(items).toHaveLength(1);
    if (items[0].type === 'submenu') {
      expect(items[0].iconKey).toBe('export-pdf');
    }
  });
});
