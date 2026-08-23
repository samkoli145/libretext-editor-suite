import { describe, it, expect } from 'vitest';
import { reorderZIndex, applyZOrderChanges } from '../../src/engines/z-order-manager';

describe('CORE-ENG-016: z-order-manager', () => {
  const els = [
    { id: 'a', zIndex: 1 },
    { id: 'b', zIndex: 2 },
    { id: 'c', zIndex: 3 },
  ];

  it('bring-to-front sets max zIndex', () => {
    const result = reorderZIndex(els, ['a'], 'bring-to-front');
    expect(result[0]!.zIndex).toBe(4);
  });

  it('send-to-back sets min zIndex', () => {
    const result = reorderZIndex(els, ['c'], 'send-to-back');
    expect(result[0]!.zIndex).toBe(0);
  });

  it('bring-forward increments', () => {
    const result = reorderZIndex(els, ['a'], 'bring-forward');
    expect(result[0]!.zIndex).toBe(2);
  });

  it('send-backward decrements', () => {
    const result = reorderZIndex(els, ['b'], 'send-backward');
    expect(result[0]!.zIndex).toBe(1);
  });

  it('applyZOrderChanges merges', () => {
    const result = applyZOrderChanges(els, [{ id: 'b', zIndex: 10 }]);
    expect(result.find((e) => e.id === 'b')!.zIndex).toBe(10);
    expect(result.find((e) => e.id === 'a')!.zIndex).toBe(1);
  });

  it('returns empty for no selection', () => {
    expect(reorderZIndex(els, [], 'bring-to-front')).toEqual([]);
  });
});
