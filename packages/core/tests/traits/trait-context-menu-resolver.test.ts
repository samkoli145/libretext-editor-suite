/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: trait-context-menu-resolver.test.ts
 * 📂 المسار: packages/core/tests/traits/trait-context-menu-resolver.test.ts
 * 🎯 الهدف الرئيسي: اختبارات توليد عناصر القائمة السياقية تلقائياً استناداً للـ Traits
 * 📋 المعايير: تغطية شاملة لكافة السمات وحالات القفل والفواصل
 * 🏷️ المعرف: TEST-CORE-TRAIT-005
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi } from 'vitest';
import { resolveContextMenuForBlock } from '../../src/traits/trait-context-menu-resolver';
import type { TraitAwareBlockTarget } from '../../src/traits/trait-context-menu-resolver';

describe('Trait Context Menu Resolver', () => {
  it('generates draggable items when draggable trait is present', () => {
    const target: TraitAwareBlockTarget = {
      id: 'block-1',
      type: 'AudioBlock',
      traits: ['draggable'],
    };

    const items = resolveContextMenuForBlock(target);
    const itemIds = items.map(i => i.id);

    expect(itemIds).toContain('bring_to_front');
    expect(itemIds).toContain('send_to_back');
    expect(itemIds).toContain('delete_block');
  });

  it('generates lockable item and toggles state correctly', () => {
    const unlockedTarget: TraitAwareBlockTarget = {
      id: 'block-1',
      type: 'AudioBlock',
      traits: ['lockable'],
      state: { lock: { locked: false } },
    };

    const unlockedItems = resolveContextMenuForBlock(unlockedTarget);
    const lockAction = unlockedItems.find(i => i.id === 'lock_block');
    expect(lockAction).toBeDefined();
    expect(lockAction?.checked).toBe(false);

    const lockedTarget: TraitAwareBlockTarget = {
      id: 'block-1',
      type: 'AudioBlock',
      traits: ['lockable'],
      state: { lock: { locked: true } },
    };

    const lockedItems = resolveContextMenuForBlock(lockedTarget);
    const unlockAction = lockedItems.find(i => i.id === 'unlock_block');
    expect(unlockAction).toBeDefined();
    expect(unlockAction?.checked).toBe(true);
  });

  it('disables modification actions when block is locked', () => {
    const lockedTarget: TraitAwareBlockTarget = {
      id: 'block-1',
      type: 'AudioBlock',
      traits: ['draggable', 'resizable', 'styleable', 'lockable'],
      state: { lock: { locked: true } },
    };

    const items = resolveContextMenuForBlock(lockedTarget);
    const bringToFront = items.find(i => i.id === 'bring_to_front');
    const resetSize = items.find(i => i.id === 'reset_size');
    const deleteBlock = items.find(i => i.id === 'delete_block');
    const unlockBlock = items.find(i => i.id === 'unlock_block');

    expect(bringToFront?.disabled).toBe(true);
    expect(resetSize?.disabled).toBe(true);
    expect(deleteBlock?.disabled).toBe(true);
    expect(unlockBlock?.disabled).toBeFalsy();
  });

  it('executes callbacks on action triggers', () => {
    const onBringToFront = vi.fn();
    const onDelete = vi.fn();

    const target: TraitAwareBlockTarget = {
      id: 'audio-99',
      type: 'AudioBlock',
      traits: ['draggable'],
    };

    const items = resolveContextMenuForBlock(target, { onBringToFront, onDelete });
    const btf = items.find(i => i.id === 'bring_to_front');
    const del = items.find(i => i.id === 'delete_block');

    btf?.action?.();
    expect(onBringToFront).toHaveBeenCalledWith('audio-99');

    del?.action?.();
    expect(onDelete).toHaveBeenCalledWith('audio-99');
  });
});
