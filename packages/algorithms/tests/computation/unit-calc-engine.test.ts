import { describe, it, expect } from 'vitest';
import {
  evaluateCalc,
  answerCalc,
  formatCalcVal,
  parseDefinition,
  feedCalcLine,
  buildPageCalcContext,
  freshCalcContext,
  asksForAnswer,
  unitOf,
  localToday,
  type CalcVal,
} from '../../src/computation/unit-calc-engine';

describe('ALGO-CALC-001: unit-calc-engine', () => {
  describe('evaluateCalc - basic arithmetic', () => {
    it('addition', () => expect(evaluateCalc('2 + 3')).toEqual({ n: 5 }));
    it('subtraction', () => expect(evaluateCalc('10 - 4')).toEqual({ n: 6 }));
    it('multiplication', () => expect(evaluateCalc('6 * 7')).toEqual({ n: 42 }));
    it('division', () => expect(evaluateCalc('15 / 3')).toEqual({ n: 5 }));
    it('parentheses', () => expect(evaluateCalc('(2 + 3) * 4')).toEqual({ n: 20 }));
    it('nested parentheses', () => expect(evaluateCalc('((1 + 2) * (3 + 4))')).toEqual({ n: 21 }));
    it('unary minus', () => expect(evaluateCalc('-5')?.n).toBe(-5));
    it('unary plus', () => expect(evaluateCalc('+5')?.n).toBe(5));
    it('precedence', () => expect(evaluateCalc('2 + 3 * 4')).toEqual({ n: 14 }));
    it('null for empty', () => expect(evaluateCalc('')).toBeNull());
    it('null for garbage', () => expect(evaluateCalc('abc')).toBeNull());
    it('null for >200 chars', () => expect(evaluateCalc('1+'.repeat(101) + '1')).toBeNull());
    it('null for div by zero', () => expect(evaluateCalc('10 / 0')).toBeNull());
    it('comma separators', () => expect(evaluateCalc('1,000 + 2,000')).toEqual({ n: 3000 }));
    it('underscore separators', () => expect(evaluateCalc('1_000 + 2_000')).toEqual({ n: 3000 }));
    it('trailing = stripped', () => expect(evaluateCalc('100 + 200 =')).toEqual({ n: 300 }));
  });

  describe('evaluateCalc - unit arithmetic', () => {
    it('plain number with unit', () => expect(evaluateCalc('4.5 m')).toEqual({ n: 4.5, u: 'm' }));
    it('cm + m', () => {
      const r = evaluateCalc('100 cm + 2 m');
      expect(r?.u).toBe('cm');
      expect(r?.n).toBeCloseTo(300, 1);
    });
    it('km - km', () => {
      const r = evaluateCalc('5 km - 1 km');
      expect(r?.u).toBe('km');
      expect(r?.n).toBeCloseTo(4, 1);
    });
    it('null for m + kg', () => expect(evaluateCalc('1 m + 1 kg')).toBeNull());
    it('number * unit', () => expect(evaluateCalc('10 * 5 m')).toEqual({ n: 50, u: 'm' }));
    it('unit / number', () => {
      const r = evaluateCalc('10 m / 2');
      expect(r?.u).toBe('m');
      expect(r?.n).toBe(5);
    });
    it('m / km -> plain', () => {
      const r = evaluateCalc('1000 m / 1 km');
      expect(r?.u).toBeUndefined();
      expect(r?.n).toBeCloseTo(1, 4);
    });
    it('null for unit * unit', () => expect(evaluateCalc('1 m * 1 kg')).toBeNull());
    it('percentage +', () => expect(evaluateCalc('1000 + 10%')?.n).toBeCloseTo(1100, 0));
    it('percentage -', () => expect(evaluateCalc('1000 - 10%')?.n).toBeCloseTo(900, 0));
    it('kg + g', () => {
      const r = evaluateCalc('2 kg + 500 g');
      expect(r?.u).toBe('kg');
      expect(r?.n).toBeCloseTo(2.5, 2);
    });
  });

  describe('evaluateCalc - clock arithmetic', () => {
    it('parses HH:MM', () => {
      const r = evaluateCalc('17:00');
      expect(r?.clock).toBe(true);
      expect(r?.n).toBe(61200);
    });
    it('clock - clock -> hours', () => {
      const r = evaluateCalc('17:00 - 08:30');
      expect(r?.u).toBe('h');
      expect(r?.n).toBeCloseTo(8.5, 1);
    });
    it('clock + duration', () => {
      const r = evaluateCalc('12:30 + 45 min');
      expect(r?.clock).toBe(true);
      expect(r?.n).toBe(47700);
    });
    it('null for clock + clock', () => expect(evaluateCalc('10:00 + 12:00')).toBeNull());
  });

  describe('evaluateCalc - date arithmetic', () => {
    it('parses ISO date', () => {
      const r = evaluateCalc('2026-08-22');
      expect(r?.date).toBe(true);
    });
    it('date - date -> days', () => {
      const r = evaluateCalc('2026-08-22 - 2026-08-01');
      expect(r?.u).toBe('day');
      expect(r?.n).toBe(21);
    });
    it('date + duration', () => {
      const r = evaluateCalc('2026-08-01 + 10 day');
      expect(r?.date).toBe(true);
    });
    it('null for date + date', () => expect(evaluateCalc('2026-08-01 + 2026-08-02')).toBeNull());
    it('null for invalid date', () => expect(evaluateCalc('2026-02-30')).toBeNull());
  });

  describe('evaluateCalc - keywords', () => {
    it('today', () => {
      const r = evaluateCalc('today', { today: '2026-08-22' });
      expect(r?.date).toBe(true);
    });
    it('yesterday', () => {
      const r = evaluateCalc('yesterday', { today: '2026-08-22' });
      expect(r?.date).toBe(true);
    });
    it('tomorrow', () => {
      const r = evaluateCalc('tomorrow', { today: '2026-08-22' });
      expect(r?.date).toBe(true);
    });
    it('sum above', () => {
      expect(evaluateCalc('sum above', { above: [10, 20, 30] })?.n).toBe(60);
    });
    it('average above', () => {
      expect(evaluateCalc('average above', { above: [10, 20, 30] })?.n).toBe(20);
    });
    it('average above empty', () => {
      expect(evaluateCalc('average above', { above: [] })).toBeNull();
    });
    it('user variable', () => {
      const vars = new Map<string, CalcVal>([['budget', { n: 5000 }]]);
      expect(evaluateCalc('budget', { vars })?.n).toBe(5000);
    });
  });

  describe('asksForAnswer', () => {
    it('detects trailing =', () => expect(asksForAnswer('100 + 200 =')).toBe(true));
    it('detects trailing = with spaces', () => expect(asksForAnswer('100 + 200  = ')).toBe(true));
    it('rejects non-trailing =', () => expect(asksForAnswer('a = 5')).toBe(false));
    it('rejects no equals', () => expect(asksForAnswer('100 + 200')).toBe(false));
  });

  describe('unitOf', () => {
    it('canonical units', () => {
      expect(unitOf('m')).toBe('m');
      expect(unitOf('kg')).toBe('kg');
      expect(unitOf('km')).toBe('km');
    });
    it('aliases', () => {
      expect(unitOf('meter')).toBe('m');
      expect(unitOf('meters')).toBe('m');
      expect(unitOf('kilogram')).toBe('kg');
      expect(unitOf('inches')).toBe('inch');
      expect(unitOf('feet')).toBe('ft');
      expect(unitOf('lbs')).toBe('lb');
      expect(unitOf('bytes')).toBe('byte');
      expect(unitOf('hours')).toBe('h');
      expect(unitOf('days')).toBe('day');
    });
    it('undefined for unknown', () => {
      expect(unitOf('foo')).toBeUndefined();
      expect(unitOf('banana')).toBeUndefined();
    });
    it('case-insensitive', () => {
      expect(unitOf('M')).toBe('m');
      expect(unitOf('KG')).toBe('kg');
      expect(unitOf('METER')).toBe('m');
    });
  });

  describe('formatCalcVal', () => {
    it('plain number', () => expect(formatCalcVal({ n: 42 })).toBe('42'));
    it('number with unit', () => expect(formatCalcVal({ n: 4.5, u: 'm' })).toBe('4.5 m'));
    it('percentage', () => expect(formatCalcVal({ n: 10, u: '%' })).toBe('10%'));
    it('date', () => {
      const r = formatCalcVal({ n: 20672, date: true });
      expect(r).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    it('clock 17:00', () => expect(formatCalcVal({ n: 61200, clock: true })).toBe('17:00'));
    it('clock 12:30', () => expect(formatCalcVal({ n: 45000, clock: true })).toBe('12:30'));
    it('custom labels', () => {
      expect(formatCalcVal({ n: 1, u: 'c' })).toContain('C');
      expect(formatCalcVal({ n: 1, u: 'f' })).toContain('F');
      expect(formatCalcVal({ n: 1, u: 'byte' })).toContain('B');
      expect(formatCalcVal({ n: 1, u: 'day' })).toContain('days');
    });
    it('zero cleanup via tidy', () => {
      const r = formatCalcVal({ n: 1e-15 });
      expect(r).toBe('0');
    });
  });

  describe('parseDefinition', () => {
    it('parses simple definition', () => {
      const r = parseDefinition('budget = 5000');
      expect(r?.name).toBe('budget');
      expect(r?.val.n).toBe(5000);
    });
    it('rejects magic note (trailing =)', () => {
      expect(parseDefinition('100 + 200 =')).toBeNull();
    });
    it('rejects reserved name', () => {
      expect(parseDefinition('today = 2026-01-01')).toBeNull();
    });
    it('rejects unit name', () => {
      expect(parseDefinition('meter = 100')).toBeNull();
    });
    it('parses with context', () => {
      const vars = new Map<string, CalcVal>([['x', { n: 10 }]]);
      const r = parseDefinition('y = x + 5', { vars });
      expect(r?.val.n).toBe(15);
    });
  });

  describe('freshCalcContext', () => {
    it('creates empty context', () => {
      const ctx = freshCalcContext();
      expect(ctx.vars?.size).toBe(0);
      expect(ctx.above?.length).toBe(0);
      expect(ctx.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('feedCalcLine', () => {
    it('feeds definition', () => {
      const ctx = freshCalcContext();
      feedCalcLine(ctx, 'budget = 5000');
      expect(ctx.vars?.get('budget')?.n).toBe(5000);
    });
    it('feeds number into above', () => {
      const ctx = freshCalcContext();
      feedCalcLine(ctx, '100');
      feedCalcLine(ctx, '200');
      expect(ctx.above).toEqual([100, 200]);
    });
    it('clears above on magic note', () => {
      const ctx = freshCalcContext();
      feedCalcLine(ctx, '100');
      feedCalcLine(ctx, '200');
      feedCalcLine(ctx, 'sum above =');
      expect(ctx.above?.length).toBe(0);
    });
    it('clears above on non-numeric text', () => {
      const ctx = freshCalcContext();
      feedCalcLine(ctx, '100');
      feedCalcLine(ctx, 'hello');
      expect(ctx.above?.length).toBe(0);
    });
    it('resets above after definition', () => {
      const ctx = freshCalcContext();
      feedCalcLine(ctx, '100');
      feedCalcLine(ctx, 'x = 5');
      expect(ctx.above?.length).toBe(0);
    });
  });

  describe('buildPageCalcContext', () => {
    it('builds context from page lines', () => {
      const lines = [
        { id: '1', text: 'x = 10' },
        { id: '2', text: '100' },
        { id: '3', text: 'y = 20' },
      ];
      const ctx = buildPageCalcContext(lines, '3');
      expect(ctx.vars?.get('x')?.n).toBe(10);
      expect(ctx.vars?.has('y')).toBe(false);
      expect(ctx.above).toEqual([100]);
    });
    it('stops at upToId', () => {
      const lines = [
        { id: '1', text: 'x = 10' },
        { id: '2', text: 'y = 20' },
        { id: '3', text: 'z = 30' },
      ];
      const ctx = buildPageCalcContext(lines, '2');
      expect(ctx.vars?.get('x')?.n).toBe(10);
      expect(ctx.vars?.has('y')).toBe(false);
    });
    it('returns fresh context if upToId is first', () => {
      const lines = [{ id: '1', text: 'x = 10' }];
      const ctx = buildPageCalcContext(lines, '1');
      expect(ctx.vars?.size).toBe(0);
    });
  });
});
