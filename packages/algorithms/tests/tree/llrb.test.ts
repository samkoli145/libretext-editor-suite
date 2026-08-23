/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [llrb.test.ts] اختبارات شجرة LLRB — الإدراج، البحث، floor/ceiling
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { LLRBTree, RED } from '../../src/tree/llrb';

describe('LLRBTree', () => {
  it('starts empty', () => {
    const tree = new LLRBTree<number, string>();
    expect(tree.size()).toBe(0);
    expect(tree.isEmpty()).toBe(true);
    expect(tree.get(1)).toBeNull();
  });

  it('put and get single key', () => {
    const tree = new LLRBTree<number, string>();
    tree.put(1, 'one');
    expect(tree.get(1)).toBe('one');
    expect(tree.size()).toBe(1);
    expect(tree.isEmpty()).toBe(false);
  });

  it('put multiple keys and retrieve all', () => {
    const tree = new LLRBTree<number, string>();
    tree.put(3, 'c');
    tree.put(1, 'a');
    tree.put(2, 'b');
    tree.put(5, 'e');
    tree.put(4, 'd');
    expect(tree.size()).toBe(5);
    expect(tree.get(1)).toBe('a');
    expect(tree.get(3)).toBe('c');
    expect(tree.get(5)).toBe('e');
  });

  it('overwrite existing key', () => {
    const tree = new LLRBTree<number, string>();
    tree.put(1, 'old');
    tree.put(1, 'new');
    expect(tree.get(1)).toBe('new');
    expect(tree.size()).toBe(1);
  });

  it('contains returns true/false correctly', () => {
    const tree = new LLRBTree<number, string>();
    tree.put(10, 'x');
    expect(tree.contains(10)).toBe(true);
    expect(tree.contains(99)).toBe(false);
  });

  it('minKey and maxKey', () => {
    const tree = new LLRBTree<number, string>();
    tree.put(5, 'e');
    tree.put(2, 'b');
    tree.put(8, 'h');
    tree.put(1, 'a');
    tree.put(9, 'i');
    expect(tree.minKey()).toBe(1);
    expect(tree.maxKey()).toBe(9);
  });

  it('minKey/maxKey on empty tree', () => {
    const tree = new LLRBTree<number, string>();
    expect(tree.minKey()).toBeNull();
    expect(tree.maxKey()).toBeNull();
  });

  it('floorKey finds largest key <= given', () => {
    const tree = new LLRBTree<number, string>();
    [10, 20, 30, 40, 50].forEach(k => tree.put(k, String(k)));
    expect(tree.floorKey(25)).toBe(20);
    expect(tree.floorKey(30)).toBe(30);
    expect(tree.floorKey(5)).toBeNull();
    expect(tree.floorKey(50)).toBe(50);
  });

  it('ceilingKey finds smallest key >= given', () => {
    const tree = new LLRBTree<number, string>();
    [10, 20, 30, 40, 50].forEach(k => tree.put(k, String(k)));
    expect(tree.ceilingKey(25)).toBe(30);
    expect(tree.ceilingKey(30)).toBe(30);
    expect(tree.ceilingKey(55)).toBeNull();
    expect(tree.ceilingKey(10)).toBe(10);
  });

  it('toInOrderArray returns sorted order with color info', () => {
    const tree = new LLRBTree<number, string>();
    [5, 3, 7, 1, 4, 6, 8].forEach(k => tree.put(k, String(k)));
    const arr = tree.toInOrderArray();
    expect(arr.length).toBe(7);
    const keys = arr.map(e => e.key);
    expect(keys).toEqual([1, 3, 4, 5, 6, 7, 8]);
    expect(arr.every(e => e.color === 'RED' || e.color === 'BLACK')).toBe(true);
  });

  it('clear empties the tree', () => {
    const tree = new LLRBTree<number, string>();
    tree.put(1, 'a');
    tree.put(2, 'b');
    tree.clear();
    expect(tree.size()).toBe(0);
    expect(tree.isEmpty()).toBe(true);
  });

  it('root is always BLACK', () => {
    const tree = new LLRBTree<number, string>();
    [10, 20, 30, 5, 15, 25, 35].forEach(k => tree.put(k, String(k)));
    const root = tree.getRoot();
    expect(root).not.toBeNull();
    expect(root!.color).toBe(false);
  });

  it('handles many inserts maintaining balance', () => {
    const tree = new LLRBTree<number, number>();
    for (let i = 1; i <= 100; i++) tree.put(i, i * 10);
    expect(tree.size()).toBe(100);
    expect(tree.get(1)).toBe(10);
    expect(tree.get(50)).toBe(500);
    expect(tree.get(100)).toBe(1000);
    expect(tree.minKey()).toBe(1);
    expect(tree.maxKey()).toBe(100);
  });

  it('string keys with custom comparator', () => {
    const tree = new LLRBTree<string, number>((a, b) => a.localeCompare(b));
    tree.put('banana', 2);
    tree.put('apple', 1);
    tree.put('cherry', 3);
    expect(tree.get('apple')).toBe(1);
    expect(tree.floorKey('ban')).toBe('apple');
    expect(tree.ceilingKey('ban')).toBe('banana');
  });
});
