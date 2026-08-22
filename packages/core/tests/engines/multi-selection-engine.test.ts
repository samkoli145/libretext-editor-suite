import { describe, it, expect } from 'vitest';
import { createMultiSelectionEngine } from '../../src/engines/multi-selection-engine';

describe('CORE-ENG-011: MultiSelectionEngine', () => {
  it('starts empty', () => {
    const engine = createMultiSelectionEngine();
    expect(engine.getSelection()).toEqual([]);
    expect(engine.count()).toBe(0);
  });

  it('select single replaces', () => {
    const engine = createMultiSelectionEngine();
    engine.select('a');
    engine.select('b');
    expect(engine.getSelection()).toEqual(['b']);
    expect(engine.count()).toBe(1);
  });

  it('addToSelection adds', () => {
    const engine = createMultiSelectionEngine();
    engine.select('a');
    engine.addToSelection('b');
    expect(engine.getSelection()).toContain('a');
    expect(engine.getSelection()).toContain('b');
    expect(engine.count()).toBe(2);
  });

  it('removeFromSelection removes', () => {
    const engine = createMultiSelectionEngine();
    engine.select('a');
    engine.addToSelection('b');
    engine.removeFromSelection('a');
    expect(engine.getSelection()).toEqual(['b']);
  });

  it('toggleSelection adds and removes', () => {
    const engine = createMultiSelectionEngine();
    engine.select('a');
    engine.toggleSelection('b', ['a', 'b']);
    expect(engine.count()).toBe(2);
    engine.toggleSelection('a', ['a', 'b']);
    expect(engine.count()).toBe(1);
  });

  it('invertSelection', () => {
    const engine = createMultiSelectionEngine();
    engine.select('a');
    engine.addToSelection('b');
    const result = engine.invertSelection(['a', 'b', 'c', 'd']);
    expect(result).toContain('c');
    expect(result).toContain('d');
    expect(result).not.toContain('a');
  });

  it('selectAll and clearSelection', () => {
    const engine = createMultiSelectionEngine();
    engine.selectAll(['a', 'b', 'c']);
    expect(engine.count()).toBe(3);
    engine.clearSelection();
    expect(engine.count()).toBe(0);
  });

  it('isSelected', () => {
    const engine = createMultiSelectionEngine();
    engine.select('x');
    expect(engine.isSelected('x')).toBe(true);
    expect(engine.isSelected('y')).toBe(false);
  });
});
