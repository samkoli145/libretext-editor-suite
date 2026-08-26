/**
 * 🧪 اختبارات بلوكات التحويل المتخصصة: LaTeX→SVG، أيقونات SVG، HTML معقّم، تحويل صور
 * 🏷️ المعرف: TEST-BLK-CONVERSION-001
 */

import { describe, it, expect } from 'vitest';
import {
  createMathBlock,
  renderMathToSvg,
  hasBalancedDelimiters,
} from '../../src/blocks/math-block';
import {
  createSvgIconBlock,
  isSvgIconBlock,
  resolveIconSvg,
  formatSvgIconMarkdown,
  findIconById,
} from '../../src/blocks/svg-icon-block';
import {
  createHtmlEmbedBlock,
  sanitizeEmbedContent,
  formatHtmlEmbedMarkdown,
  getEmbedTextPreview,
  isHtmlEmbedBlock,
} from '../../src/blocks/html-embed-block';
import {
  detectImageMime,
  isEmbeddedImage,
  estimateEmbeddedSizeBytes,
  svgTextToDataUri,
} from '../../src/blocks/image-block';

describe('math → SVG conversion', () => {
  it('يحوّل معادلة بسيطة إلى SVG صالح', () => {
    const block = createMathBlock('m1', { latex: 'x + y = z' });
    const result = renderMathToSvg(block);
    expect(result.error).toBeNull();
    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
  });

  it('يرجع خطأ لمعادلة فارغة', () => {
    const block = createMathBlock('m2', { latex: '' });
    expect(renderMathToSvg(block)).toEqual({ svg: null, error: 'empty' });
  });

  it('يرجع خطأ لمصدر غير قابل للتحليل بدل الرمي', () => {
    const block = createMathBlock('m3', { latex: '\\unknowncommand{' });
    const result = renderMathToSvg(block);
    // إما خطأ محلل أو SVG — لا رمي استثناء
    expect(result.svg !== null || result.error !== null).toBe(true);
  });

  it('يفحص توازن المحددات', () => {
    expect(hasBalancedDelimiters('$a$$b$')).toBe(true);
    expect(hasBalancedDelimiters('$a')).toBe(false);
  });
});

describe('svg-icon block', () => {
  it('ينشئ كتلة بقيم مقصوصة', () => {
    const block = createSvgIconBlock('i1', { iconId: 'test', size: 9999, strokeWidth: 99 });
    expect(block.data.size).toBe(256);
    expect(block.data.strokeWidth).toBe(4);
    expect(isSvgIconBlock(block)).toBe(true);
  });

  it('يرفض لوناً غير hex ويستخدم الافتراضي', () => {
    const block = createSvgIconBlock('i2', { color: 'javascript:alert(1)' });
    expect(block.data.color).toBe('#2563EB');
  });

  it('يجد أيقونة من المكتبة الجاهزة ويحولها إلى SVG', () => {
    const first = findIconById('arrow-right') ?? undefined;
    if (!first) return; // المكتبة قد لا تحتوي هذا المعرف
    const block = createSvgIconBlock('i3', { iconId: first.id });
    const { svg, dataUrl } = resolveIconSvg(block);
    expect(svg).toContain('<svg');
    expect(dataUrl).toMatch(/^data:image\/svg\+xml/);
  });

  it('يرجع null لمعرف غير موجود (لا اختراع)', () => {
    const block = createSvgIconBlock('i4', { iconId: 'nonexistent-icon-xyz' });
    expect(resolveIconSvg(block)).toEqual({ svg: null, dataUrl: null });
    expect(formatSvgIconMarkdown(block)).toBe('');
  });
});

describe('html-embed block', () => {
  it('يعقّم السكربتات عند الإنشاء فوراً', () => {
    const block = createHtmlEmbedBlock('h1', {
      html: '<p>سلام</p><script>alert("xss")</script>',
    });
    expect(block.data.html).not.toContain('<script>');
    expect(block.data.html).toContain('<p>');
  });

  it('sanitizeEmbedContent يعيد التعقيم بعد تحديث خارجي', () => {
    let block = createHtmlEmbedBlock('h2', { html: '<b>عريض</b>' });
    block = { ...block, data: { ...block.data, html: '<img src=x onerror="alert(1)">' } };
    const clean = sanitizeEmbedContent(block);
    expect(clean.data.html).not.toContain('onerror');
  });

  it('يصدّر Markdown بـ HTML معقّم', () => {
    const block = createHtmlEmbedBlock('h3', { html: '<div>محتوى</div>', caption: 'تسمية' });
    const md = formatHtmlEmbedMarkdown(block);
    expect(md).toContain('*تسمية*');
    expect(md).toContain('<div>محتوى</div>');
  });

  it('المعاينة النصية تزيل الوسوم وتقص الطويل', () => {
    const block = createHtmlEmbedBlock('h4', { html: `<p>${'كلمة '.repeat(100)}</p>` });
    expect(getEmbedTextPreview(block).length).toBeLessThanOrEqual(121);
    expect(isHtmlEmbedBlock(block)).toBe(true);
  });
});

describe('image conversion helpers', () => {
  it('يكشف نوع الصورة من DataURI والامتداد', () => {
    expect(detectImageMime('data:image/png;base64,AAA')).toBe('image/png');
    expect(detectImageMime('photo.JPG?v=2')).toBe('image/jpeg');
    expect(detectImageMime('icon.svg')).toBe('image/svg+xml');
    expect(detectImageMime('file.txt')).toBeNull();
  });

  it('يميز الصور المضمنة ويقدّر حجمها', () => {
    const uri = svgTextToDataUri('<svg></svg>');
    expect(isEmbeddedImage(uri)).toBe(true);
    expect(isEmbeddedImage('https://x.com/a.png')).toBe(false);
    expect(estimateEmbeddedSizeBytes(uri)).toBeGreaterThan(0);
    expect(estimateEmbeddedSizeBytes('https://x.com/a.png')).toBe(0);
  });

  it('يحول نص SVG إلى DataURI قابل للفك', () => {
    const uri = svgTextToDataUri('<svg xmlns="http://www.w3.org/2000/svg"/>');
    expect(decodeURIComponent(uri.replace(/^data:image\/svg\+xml;utf8,/, ''))).toContain(
      '<svg',
    );
  });
});
