import { describe, it, expect } from 'vitest';
import { createSelectionManager } from '../../src/engines/selection-manager';

describe('CORE-ENG-017: selection-manager', () => {
  const els = [
    { id: 'a', x: 0, y: 0, width: 100, height: 50 },
    { id: 'b', x: 200, y: 200, width: 100, height: 50 },
    { id: 'c', x: 500, y: 500, width: 100, height: 50 },
  ];

  it('selectByPoint selects hit element', () => {
    const mgr = createSelectionManager();
    const result = mgr.selectByPoint(50, 25, els);
    expect(result).toContain('a');
  });

  it('selectByPoint skips locked elements', () => {
    const mgr = createSelectionManager();
    const locked = [{ ...els[0]!, isLocked: true }];
    const result = mgr.selectByPoint(50, 25, locked);
    expect(result).toHaveLength(0);
  });

  it('selectByRect selects elements in box', () => {
    const mgr = createSelectionManager();
    const result = mgr.selectByRect(0, 0, 150, 100, els);
    expect(result).toContain('a');
    expect(result).not.toContain('b');
  });

  it('clearSelection empties selection', () => {
    const mgr = createSelectionManager();
    mgr.selectById('a');
    mgr.clearSelection();
    expect(mgr.count()).toBe(0);
  });
});
