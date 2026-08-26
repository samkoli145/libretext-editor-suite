/**
 * 🧪 اختبارات: جداول Markdown في writer + تعدد الأوراق في calc
 * 🏷️ المعرف: TEST-ENG-MULTI-001
 */

import { describe, it, expect } from 'vitest';
import { WriterEngine } from '../../src/engines/writer-engine';
import type { TableBlockNode } from '../../src/blocks/table-block';
import { CalcEngine } from '../../src/engines/calc-engine';

describe('writer markdown tables', () => {
  const engine = new WriterEngine();

  it('يستورد جدول Markdown إلى كتلة table مع صف رأس', () => {
    const md = [
      '# تقرير',
      '',
      '| الاسم | الكمية |',
      '| --- | --- |',
      '| تفاح | 5 |',
      '| موز | 12 |',
    ].join('\n');

    const doc = engine.importMarkdown(md);
    const tableBlock = doc.blocks.find(b => b.type === 'table');
    expect(tableBlock).toBeDefined();

    const table = tableBlock!.attrs?.table as TableBlockNode;
    expect(table.rows).toHaveLength(3);
    expect(table.rows[0]!.isHeader).toBe(true);
    expect(table.rows[0]!.cells[0]!.text).toBe('الاسم');
    expect(table.rows[2]!.cells[1]!.text).toBe('12');
  });

  it('يصدّر كتلة جدول إلى Markdown', () => {
    const doc = engine.importMarkdown('| أ | ب |\n| --- | --- |\n| 1 | 2 |');
    const exported = engine.exportMarkdown(doc);
    expect(exported).toContain('| أ | ب |');
    expect(exported).toContain('| --- | --- |');
    expect(exported).toContain('| 1 | 2 |');
  });

  it('يجري roundtrip كامل للجداول', () => {
    const original = '| الاسم | السعر |\n| --- | --- |\n| قلم | 3.5 |';
    const doc = engine.importMarkdown(original);
    const roundtripped = engine.exportMarkdown(doc);
    expect(roundtripped.trim()).toBe(original);
  });

  it('يهرب الأنابيب داخل الخلايا عند التصدير', () => {
    const doc = engine.importMarkdown('| رمز |\n| --- |\n| a\\|b |');
    const exported = engine.exportMarkdown(doc);
    expect(exported).toContain('a\\|b');
  });
});

function makeSheet(
  cells: ReadonlyArray<{ addr: string; raw: string }>,
): TableBlockNode {
  return {
    id: `sheet-${cells.length}`,
    type: 'table',
    domain: 'universal',
    traits: [],
    data: { rowsCount: 1, colsCount: cells.length, hasHeaderRow: false, borderStyle: 'solid' },
    rows: [
      {
        id: 'row-1',
        isHeader: false,
        cells: cells.map(c => ({
          id: `id-${c.addr}`,
          text: '',
          rawInput: c.raw,
          address: c.addr,
          computedValue: null,
        })),
      },
    ],
  } as unknown as TableBlockNode;
}

describe('calc multi-sheet', () => {
  it('يحل المراجع عبر الأوراق Sheet2!A1 من السجل', () => {
    const engine = new CalcEngine();
    const sheet1 = makeSheet([{ addr: 'A1', raw: '=Sheet2!B1*2' }]);
    const sheet2 = makeSheet([{ addr: 'B1', raw: '21' }]);

    engine.registerSheet('Sheet2', sheet2);
    const updated = engine.evaluateCell('A1', sheet1) as unknown as { computedValue?: unknown };

    expect(updated.computedValue).toBe(42);
  });

  it('يرجع #REF! لورقة غير مسجلة', () => {
    const engine = new CalcEngine();
    const sheet1 = makeSheet([{ addr: 'A1', raw: '=Missing!A1' }]);
    const updated = engine.evaluateCell('A1', sheet1) as unknown as {
      computedValue?: unknown;
      error?: string;
    };
    expect(updated.computedValue).toBeNull();
    expect(updated.error).toBe('#REF!');
  });

  it('recalculateWorkbook يحسب عدة أوراق بالترتيب', () => {
    const engine = new CalcEngine();
    const s1 = makeSheet([{ addr: 'A1', raw: '10' }]);
    const s2 = makeSheet([{ addr: 'A1', raw: '=Sheet1!A1+5' }]);

    const results = engine.recalculateWorkbook([
      { name: 'Sheet1', sheet: s1 },
      { name: 'Sheet2', sheet: s2 },
    ]);

    expect(results).toHaveLength(2);
    expect(engine.getSheetNames()).toContain('Sheet1');
    expect(engine.getSheetNames()).toContain('Sheet2');
  });

  it('unregisterSheet يزيل الورقة', () => {
    const engine = new CalcEngine();
    engine.registerSheet('X', makeSheet([]));
    expect(engine.unregisterSheet('X')).toBe(true);
    expect(engine.unregisterSheet('X')).toBe(false);
  });
});
