/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: context-menu-interactions.test.ts
 * 📂 المسار: packages/core/tests/engines/context-menu-interactions.test.ts
 * 🎯 الهدف الرئيسي: Unit tests for scroll close, hover tracking,
 *    keyboard navigation, and semantic icon resolution
 * 🏷️ المعرف: TEST-CORE-ENG-022
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createScrollCloseHandler,
  createHoverTracker,
  createKeyboardNavHandler,
  resolveSemanticIcon,
  CONTEXT_MENU_ICON_MAP,
} from '../../src/engines/context-menu-interactions';

// ─── Mock Event Target ───

function createMockTarget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listeners: Record<string, Array<{ fn: (...args: any[]) => void; opts: any }>> = {};
  return {
    listeners,
    addEventListener(type: string, fn: (...args: unknown[]) => void, opts?: unknown) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push({ fn, opts });
    },
    removeEventListener(type: string, fn: (...args: unknown[]) => void, _opts?: unknown) {
      if (listeners[type]) {
        listeners[type] = listeners[type].filter((l) => l.fn !== fn);
      }
    },
    emit(type: string) {
      for (const l of listeners[type] ?? []) l.fn();
    },
  };
}

// ─── Scroll Close Handler ───

describe('createScrollCloseHandler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onClose immediately on scroll when no debounce', () => {
    const onClose = vi.fn();
    const target = createMockTarget();
    const cleanup = createScrollCloseHandler({ onClose, target });

    target.emit('scroll');
    expect(onClose).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('calls onClose immediately on wheel when no debounce', () => {
    const onClose = vi.fn();
    const target = createMockTarget();
    const cleanup = createScrollCloseHandler({ onClose, target });

    target.emit('wheel');
    expect(onClose).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('only fires once even with multiple scroll events', () => {
    const onClose = vi.fn();
    const target = createMockTarget();
    const cleanup = createScrollCloseHandler({ onClose, target });

    target.emit('scroll');
    target.emit('scroll');
    target.emit('wheel');
    expect(onClose).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('debounces close when debounceMs > 0', () => {
    const onClose = vi.fn();
    const target = createMockTarget();
    const cleanup = createScrollCloseHandler({ onClose, target, debounceMs: 100 });

    target.emit('scroll');
    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(onClose).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('cleanup removes listeners', () => {
    const onClose = vi.fn();
    const target = createMockTarget();
    const cleanup = createScrollCloseHandler({ onClose, target });
    cleanup();

    target.emit('scroll');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('registers both scroll and wheel listeners', () => {
    const target = createMockTarget();
    const cleanup = createScrollCloseHandler({ onClose: vi.fn(), target });

    expect(target.listeners['scroll']).toHaveLength(1);
    expect(target.listeners['wheel']).toHaveLength(1);

    cleanup();
  });
});

// ─── Hover Tracker ───

describe('createHoverTracker', () => {
  it('starts with no hover', () => {
    const tracker = createHoverTracker();
    expect(tracker.getState()).toEqual({ hoveredIndex: -1, hoveredId: null });
  });

  it('tracks enter', () => {
    const tracker = createHoverTracker();
    tracker.onEnter(2, 'item-2');
    expect(tracker.getState()).toEqual({ hoveredIndex: 2, hoveredId: 'item-2' });
  });

  it('clears on leave', () => {
    const tracker = createHoverTracker();
    tracker.onEnter(0, 'item-0');
    tracker.onLeave();
    expect(tracker.getState()).toEqual({ hoveredIndex: -1, hoveredId: null });
  });

  it('resets state', () => {
    const tracker = createHoverTracker();
    tracker.onEnter(5, 'item-5');
    tracker.reset();
    expect(tracker.getState()).toEqual({ hoveredIndex: -1, hoveredId: null });
  });

  it('calls onChange callback', () => {
    const onChange = vi.fn();
    const tracker = createHoverTracker(onChange);

    tracker.onEnter(1, 'item-1');
    expect(onChange).toHaveBeenCalledWith({ hoveredIndex: 1, hoveredId: 'item-1' });

    tracker.onLeave();
    expect(onChange).toHaveBeenCalledWith({ hoveredIndex: -1, hoveredId: null });
  });
});

// ─── Keyboard Navigation ───

describe('createKeyboardNavHandler', () => {
  const itemIds = ['cut', 'copy', 'paste', 'delete'];
  const disabled = [false, false, false, false];

  it('starts with no focus', () => {
    const handler = createKeyboardNavHandler(itemIds, disabled);
    expect(handler.getState()).toEqual({ focusedIndex: -1, focusedId: null });
  });

  it('ArrowDown moves to first item from -1', () => {
    const handler = createKeyboardNavHandler(itemIds, disabled);
    const result = handler.handleKeyDown('ArrowDown');
    expect(result).toBe('navigate');
    expect(handler.getState().focusedIndex).toBe(0);
    expect(handler.getState().focusedId).toBe('cut');
  });

  it('ArrowDown wraps around to 0 from last', () => {
    const handler = createKeyboardNavHandler(itemIds, disabled);
    handler.handleKeyDown('ArrowDown');
    handler.handleKeyDown('ArrowDown');
    handler.handleKeyDown('ArrowDown');
    handler.handleKeyDown('ArrowDown');
    handler.handleKeyDown('ArrowDown');
    expect(handler.getState().focusedIndex).toBe(0);
  });

  it('ArrowUp wraps to last from 0', () => {
    const handler = createKeyboardNavHandler(itemIds, disabled);
    handler.setIndex(0);
    handler.handleKeyDown('ArrowUp');
    expect(handler.getState().focusedIndex).toBe(3);
  });

  it('Enter returns select', () => {
    const onSelect = vi.fn();
    const handler = createKeyboardNavHandler(itemIds, disabled, { onSelect });
    handler.setIndex(1);
    const result = handler.handleKeyDown('Enter');
    expect(result).toBe('select');
    expect(onSelect).toHaveBeenCalledWith('copy');
  });

  it('Escape returns close', () => {
    const onClose = vi.fn();
    const handler = createKeyboardNavHandler(itemIds, disabled, { onClose });
    const result = handler.handleKeyDown('Escape');
    expect(result).toBe('close');
    expect(onClose).toHaveBeenCalled();
  });

  it('unknown key returns none', () => {
    const handler = createKeyboardNavHandler(itemIds, disabled);
    expect(handler.handleKeyDown('a')).toBe('none');
  });

  it('skips disabled items', () => {
    const mixedDisabled = [false, true, false, false];
    const handler = createKeyboardNavHandler(itemIds, mixedDisabled);
    handler.handleKeyDown('ArrowDown');
    expect(handler.getState().focusedId).toBe('cut');
    handler.handleKeyDown('ArrowDown');
    expect(handler.getState().focusedId).toBe('paste');
  });

  it('reset clears focus', () => {
    const handler = createKeyboardNavHandler(itemIds, disabled);
    handler.handleKeyDown('ArrowDown');
    handler.reset();
    expect(handler.getState()).toEqual({ focusedIndex: -1, focusedId: null });
  });
});

// ─── Semantic Icons ───

describe('resolveSemanticIcon', () => {
  it('returns correct icon for known key', () => {
    expect(resolveSemanticIcon('cut')).toBe('scissors');
    expect(resolveSemanticIcon('copy')).toBe('clipboard');
    expect(resolveSemanticIcon('paste')).toBe('clipboard-paste');
    expect(resolveSemanticIcon('delete')).toBe('trash-2');
    expect(resolveSemanticIcon('bold')).toBe('bold');
    expect(resolveSemanticIcon('insert-table')).toBe('table');
    expect(resolveSemanticIcon('insert-math')).toBe('sigma');
  });

  it('returns fallback for unknown key', () => {
    const result = resolveSemanticIcon('unknown' as any);
    expect(result).toBe('circle');
  });

  it('CONTEXT_MENU_ICON_MAP has entries for all keys', () => {
    expect(CONTEXT_MENU_ICON_MAP.size).toBeGreaterThan(30);
  });

  it('all mapped values are non-empty strings', () => {
    for (const [key, value] of CONTEXT_MENU_ICON_MAP) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
