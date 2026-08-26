/**
 * 🧪 اختبارات البلوكات المتخصصة: math, details, toc
 * 🏷️ المعرف: TEST-BLK-SPECIALIZED-001
 */

import { describe, it, expect } from 'vitest';
import {
  createMathBlock,
  isMathBlock,
  formatMathMarkdown,
  hasBalancedDelimiters,
} from '../../src/blocks/math-block';
import {
  createDetailsBlock,
  isDetailsBlock,
  formatDetailsMarkdown,
} from '../../src/blocks/details-block';
import {
  createTocBlock,
  isTocBlock,
  formatTocMarkdown,
  buildTocEntries,
} from '../../src/blocks/toc-block';

describe('math-block', () => {
  it('ينشئ كتلة معادلة بوضع مستقل افتراضياً', () => {
    const block = createMathBlock('m1', { latex: 'E = mc^2' });
    expect(isMathBlock(block)).toBe(true);
    expect(block.data.displayMode).toBe(true);
  });

  it('يصدّر $$..$$ للوضع المستقل و$..$ للسطري', () => {
    const display = createMathBlock('m2', { latex: 'a^2 + b^2 = c^2' });
    expect(formatMathMarkdown(display)).toBe('$$\na^2 + b^2 = c^2\n$$');

    const inline = createMathBlock('m3', { latex: 'x', displayMode: false });
    expect(formatMathMarkdown(inline)).toBe('$x$');
  });

  it('يُرجع نصاً فارغاً لمصدر فارغ', () => {
    const empty = createMathBlock('m4');
    expect(formatMathMarkdown(empty)).toBe('');
  });

  it('يفحص توازن محددات $', () => {
    expect(hasBalancedDelimiters('$a$ + $b$')).toBe(true);
    expect(hasBalancedDelimiters('$a$ + $b')).toBe(false);
  });

  it('يقص المصدر الطويل جداً', () => {
    const long = createMathBlock('m5', { latex: 'x'.repeat(20_000) });
    expect(long.data.latex.length).toBeLessThanOrEqual(10_000);
  });

  it('يرفض الأنواع الأخرى', () => {
    expect(isMathBlock({ type: 'paragraph' })).toBe(false);
    expect(isMathBlock(null)).toBe(false);
  });
});

describe('details-block', () => {
  it('ينشئ كتلة منسدلة مغلقة افتراضياً', () => {
    const block = createDetailsBlock('d1', { summary: 'مزيد', content: 'نص' });
    expect(isDetailsBlock(block)).toBe(true);
    expect(block.data.open).toBe(false);
  });

  it('يصدّر صيغة GFM details', () => {
    const block = createDetailsBlock('d2', { summary: 'عنوان', content: 'المحتوى', open: true });
    const md = formatDetailsMarkdown(block);
    expect(md).toContain('<details open>');
    expect(md).toContain('<summary>عنوان</summary>');
    expect(md).toContain('المحتوى');
    expect(md.trim().endsWith('</details>')).toBe(true);
  });

  it('يستبدل الملخص الفارغ بنص افتراضي عند التصدير', () => {
    const block = createDetailsBlock('d3', { summary: '   ', content: 'x' });
    expect(formatDetailsMarkdown(block)).toContain('<summary>تفاصيل</summary>');
  });

  it('يرفض الأنواع الأخرى', () => {
    expect(isDetailsBlock({ type: 'toc' })).toBe(false);
  });
});

describe('toc-block', () => {
  it('يقص العمق إلى النطاق 1-6', () => {
    expect(createTocBlock('t1', { maxDepth: 0 }).data.maxDepth).toBe(1);
    expect(createTocBlock('t2', { maxDepth: 99 }).data.maxDepth).toBe(6);
    expect(createTocBlock('t3').data.maxDepth).toBe(3);
  });

  it('يصدّر وسم [TOC]', () => {
    expect(formatTocMarkdown(createTocBlock('t4'))).toBe('[TOC]');
  });

  it('يشتق المداخل من العناوين فقط حتى العمق المحدد', () => {
    const blocks = [
      { type: 'heading', content: 'الفصل الأول', attrs: { level: 1 } },
      { type: 'paragraph', content: 'نص' },
      { type: 'heading', content: 'قسم فرعي', attrs: { level: 2 } },
      { type: 'heading', content: 'عميق جداً', attrs: { level: 5 } },
    ];
    const entries = buildTocEntries(blocks, 3);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({ level: 1, text: 'الفصل الأول' });
    expect(entries[1]).toEqual({ level: 2, text: 'قسم فرعي' });
  });

  it('يتعامل مع عنوان بلا مستوى كـ h1', () => {
    const entries = buildTocEntries([{ type: 'heading', content: 'بلا مستوى' }], 6);
    expect(entries[0]!.level).toBe(1);
  });
});
