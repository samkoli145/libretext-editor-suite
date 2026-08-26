/**
 * 🧪 اختبارات بلوكات الكود التفاعلية: code_runner + regex_tester + تظليل code_block
 * 🏷️ المعرف: TEST-BLK-INTERACTIVE-CODE-001
 */

import { describe, it, expect } from 'vitest';
import {
  createCodeRunnerBlock,
  isCodeRunnerBlock,
  getInteractiveControls,
  setControlValue,
  runCodeBlock,
  formatCodeRunnerMarkdown,
} from '../../src/blocks/code-runner-block';
import {
  createRegexTesterBlock,
  isRegexTesterBlock,
  runRegexTest,
  applyRegexPreset,
  listRegexPresets,
} from '../../src/blocks/regex-tester-block';
import {
  createCodeBlock,
  isCodeBlock,
  tokenizeCodeBlock,
  tokensToHtml,
  isHighlightable,
} from '../../src/blocks/code-block';

describe('code-runner block', () => {
  it('ينشئ كتلة بجافاسكربت افتراضياً ولغة غير معروفة تسقط بأمان', () => {
    expect(createCodeRunnerBlock('r1').data.language).toBe('javascript');
    expect(createCodeRunnerBlock('r2', { language: 'cobol' as never }).data.language).toBe(
      'javascript',
    );
    expect(createCodeRunnerBlock('r3', { language: 'json' }).data.language).toBe('json');
    expect(isCodeRunnerBlock({ type: 'code_block' })).toBe(false);
  });

  it('يستخرج أدوات @prop من التعليقات ويدمج القيم المحفوظة', () => {
    const block = createCodeRunnerBlock('r4', {
      code: '/* @prop {range} [10,100,5] $size 40 - الحجم */\n<div>${size}</div>',
      language: 'html',
      controlValues: { prop_1: 77 },
    });
    const controls = getInteractiveControls(block);
    expect(controls).toHaveLength(1);
    expect(controls[0]!.value).toBe(77); // القيمة المحفوظة لا الافتراضية
    expect(controls[0]!.varName).toBe('size');
  });

  it('setControlValue يحدّث بشكل immutable', () => {
    const block = createCodeRunnerBlock('r5', { code: '/* @prop {color} #ff0000 - لون */x' });
    const updated = setControlValue(block, 'prop_1', '#00ff00');
    expect(updated.data.controlValues).toEqual({ prop_1: '#00ff00' });
    expect(block.data.controlValues).toEqual({}); // الأصل لم يتغير
  });

  it('runCodeBlock ينفذ HTML حياً عبر المحرك الجاهز', () => {
    const block = createCodeRunnerBlock('r6', {
      code: '<div class="hello">مرحباً</div>',
      language: 'html',
    });
    const { output } = runCodeBlock(block);
    expect(output.success).toBe(true);
    expect(output.htmlContent).toContain('مرحباً');
    expect(output.language).toBe('html');
  });

  it('يحقن قيم التحكم في الكود قبل التنفيذ', () => {
    const block = createCodeRunnerBlock('r7', {
      code: '/* @prop {text} $color أحمر - اللون */<span>${color}</span>',
      language: 'html',
      controlValues: { prop_1: 'أزرق' },
    });
    const { output } = runCodeBlock(block);
    expect(output.success).toBe(true);
    expect(output.htmlContent).toContain('أزرق');
  });

  it('يستخرج أدوات تلقائية (ألوان/حواف) لكود بلا تعليقات', () => {
    const block = createCodeRunnerBlock('r7b', {
      code: '<div style="color: #ff0000; border-radius: 8px; padding: 10px">x</div>',
      language: 'html',
    });
    const controls = getInteractiveControls(block);
    expect(controls.length).toBeGreaterThanOrEqual(2); // auto_color + radius/padding
  });

  it('يصدّر fenced code عادي', () => {
    const block = createCodeRunnerBlock('r8', { code: 'let x = 1;', language: 'javascript' });
    expect(formatCodeRunnerMarkdown(block)).toBe('```javascript\nlet x = 1;\n```');
  });
});

describe('regex-tester block', () => {
  it('ينشئ كتلة ويجتاز فحص النوع', () => {
    const block = createRegexTesterBlock('x1', { pattern: '\\d+', testText: 'abc 123' });
    expect(isRegexTesterBlock(block)).toBe(true);
    expect(isRegexTesterBlock(null)).toBe(false);
  });

  it('يجري اختباراً حياً ويعد التطابقات', () => {
    const block = createRegexTesterBlock('x2', {
      pattern: '\\d+',
      flags: 'g',
      testText: 'عام 2026 شهر 08 يوم 15',
    });
    const result = runRegexTest(block);
    expect(result.isValid).toBe(true);
    expect(result.matchesCount).toBe(3);
  });

  it('نمط غير صالح يعطي isValid:false دون رمي', () => {
    const block = createRegexTesterBlock('x3', { pattern: '[invalid', testText: 'نص' });
    const result = runRegexTest(block);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('يطبّق قالباً جاهزاً بشكل immutable', () => {
    const presets = listRegexPresets();
    expect(presets.length).toBeGreaterThan(0);

    const block = createRegexTesterBlock('x4');
    const applied = applyRegexPreset(block, presets[0]!.id);
    expect(applied.data.pattern).toBe(presets[0]!.pattern);
    expect(applied.data.presetId).toBe(presets[0]!.id);
  });

  it('قالب غير معروف يرجع الكتلة كما هي', () => {
    const block = createRegexTesterBlock('x5', { pattern: 'abc' });
    expect(applyRegexPreset(block, 'nonexistent')).toBe(block);
  });
});

describe('code-block syntax highlighting', () => {
  it('يميز اللغات المدعومة عن غيرها', () => {
    expect(isHighlightable('typescript')).toBe(true);
    expect(isHighlightable('HTML')).toBe(true); // غير حساس لحالة الأحرف
    expect(isHighlightable('cobol')).toBe(false);
  });

  it('tokenizeCodeBlock يرجع رموزاً للغة مدعومة', () => {
    const block = createCodeBlock('c1', 'const x = 42;', 'typescript');
    const tokens = tokenizeCodeBlock(block);
    expect(tokens).not.toBeNull();
    expect(tokens!.length).toBeGreaterThan(0);
    expect(isCodeBlock(block)).toBe(true);
  });

  it('يرجع null للغة غير مدعومة (عرض نصي عادي)', () => {
    const block = createCodeBlock('c2', 'COBOL CODE', 'cobol');
    expect(tokenizeCodeBlock(block)).toBeNull();
  });

  it('tokensToHtml يهرب HTML وينشئ spans بأصناف', () => {
    const html = tokensToHtml([[{ type: 'keyword', value: '<script>', line: 1, col: 0 }]]);
    expect(html).toContain('tok-keyword');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });
});
