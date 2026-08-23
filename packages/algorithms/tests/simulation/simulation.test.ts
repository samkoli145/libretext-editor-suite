/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [simulation.test.ts] اختبارات بيئة المحاكاة والمحاكي النقي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  createSimulationContext,
  moveCursor,
  selectRange,
  setFormula,
} from '../../src/simulation/context';
import { simulate, simulateSingle } from '../../src/simulation/simulator';

describe('createSimulationContext', () => {
  it('creates default writer context', () => {
    const ctx = createSimulationContext();
    expect(ctx.cursorPosition).toEqual({ x: 0, y: 0 });
    expect(ctx.selectedRange).toBe('');
    expect(ctx.activeFormula).toBeUndefined();
    expect(ctx.domain).toBe('writer');
  });

  it('creates calc context', () => {
    const ctx = createSimulationContext('calc');
    expect(ctx.domain).toBe('calc');
  });

  it('creates impress context', () => {
    expect(createSimulationContext('impress').domain).toBe('impress');
  });

  it('creates base context', () => {
    expect(createSimulationContext('base').domain).toBe('base');
  });
});

describe('moveCursor', () => {
  it('moves cursor by delta', () => {
    const ctx = createSimulationContext();
    const moved = moveCursor(ctx, 10, 20);
    expect(moved.cursorPosition).toEqual({ x: 10, y: 20 });
  });

  it('is additive', () => {
    let ctx = createSimulationContext();
    ctx = moveCursor(ctx, 5, 5);
    ctx = moveCursor(ctx, 3, 7);
    expect(ctx.cursorPosition).toEqual({ x: 8, y: 12 });
  });

  it('does not mutate original', () => {
    const ctx = createSimulationContext();
    moveCursor(ctx, 100, 100);
    expect(ctx.cursorPosition).toEqual({ x: 0, y: 0 });
  });
});

describe('selectRange', () => {
  it('sets selected range', () => {
    const ctx = selectRange(createSimulationContext(), 'A1:B5');
    expect(ctx.selectedRange).toBe('A1:B5');
  });

  it('does not mutate original', () => {
    const ctx = createSimulationContext();
    selectRange(ctx, 'X');
    expect(ctx.selectedRange).toBe('');
  });
});

describe('setFormula', () => {
  it('sets active formula', () => {
    const ctx = setFormula(createSimulationContext(), '=SUM(A1:A10)');
    expect(ctx.activeFormula).toBe('=SUM(A1:A10)');
  });
});

describe('simulate', () => {
  it('executes multiple actions sequentially', () => {
    const ctx = createSimulationContext();
    const result = simulate(ctx, [
      { type: 'MOVE', dx: 5, dy: 10 },
      { type: 'SELECT', range: 'A1:C3' },
      { type: 'EVALUATE', formula: '=SUM(A1:A10)' },
    ]);
    expect(result.cursorPosition).toEqual({ x: 5, y: 10 });
    expect(result.selectedRange).toBe('A1:C3');
    expect(result.activeFormula).toBe('=SUM(A1:A10)');
  });

  it('returns initial context for empty actions', () => {
    const ctx = createSimulationContext();
    const result = simulate(ctx, []);
    expect(result).toEqual(ctx);
  });
});

describe('simulateSingle', () => {
  it('applies single MOVE action', () => {
    const ctx = createSimulationContext();
    const result = simulateSingle(ctx, { type: 'MOVE', dx: 1, dy: 2 });
    expect(result.cursorPosition).toEqual({ x: 1, y: 2 });
  });

  it('applies single SELECT action', () => {
    const ctx = createSimulationContext();
    const result = simulateSingle(ctx, { type: 'SELECT', range: 'D4' });
    expect(result.selectedRange).toBe('D4');
  });

  it('applies single EVALUATE action', () => {
    const ctx = createSimulationContext();
    const result = simulateSingle(ctx, { type: 'EVALUATE', formula: '=1+1' });
    expect(result.activeFormula).toBe('=1+1');
  });
});
