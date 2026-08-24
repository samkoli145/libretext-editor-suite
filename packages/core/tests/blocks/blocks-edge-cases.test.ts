/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: blocks-edge-cases.test.ts
 * 📂 المسار: packages/core/tests/blocks/blocks-edge-cases.test.ts
 * 🎯 الهدف: اختبارات boundary و edge cases لجميع البلوكات
 * 🏷️ المعرف: TEST-BLOCKS-EDGE-001
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, expect, it } from 'vitest';
import { clampHeadingLevel } from '../../src/blocks/heading-block';
import { indexToColumnName, createCellBlock, formatCellValue, isCellBlock } from '../../src/blocks/cell-block';
import { createParagraphBlock, isParagraphBlock, formatParagraphMarkdown } from '../../src/blocks/paragraph-block';
import { createHeadingBlock, isHeadingBlock, formatHeadingMarkdown } from '../../src/blocks/heading-block';
import { createTableBlock, createTableRow, createTableCell, isTableBlock, formatTableMarkdown } from '../../src/blocks/table-block';
import { createImageBlock, isImageBlock, formatImageMarkdown } from '../../src/blocks/image-block';
import { createListBlock, createListItem, isListBlock, formatListMarkdown } from '../../src/blocks/list-block';
import { createCodeBlock, isCodeBlock, formatCodeBlockMarkdown } from '../../src/blocks/code-block';
import { createHorizontalRuleBlock, isHorizontalRuleBlock } from '../../src/blocks/horizontal-rule-block';
import { createBlockquoteBlock, isBlockquoteBlock, formatBlockquoteMarkdown } from '../../src/blocks/blockquote-block';
import { createShapeBlock, isShapeBlock, getShapePresetPath, type ShapeType } from '../../src/blocks/shape-block';
import { createSlideBlock, isSlideBlock, formatSlideSummary } from '../../src/blocks/slide-block';
import { createEmbedBlock, isEmbedBlock, formatEmbedMarkdown } from '../../src/blocks/embed-block';
import { createColorPickerBlock, isColorPickerBlock } from '../../src/blocks/color-picker-block';
import { createIconPickerBlock, isIconPickerBlock } from '../../src/blocks/icon-picker-block';
import { createFontPickerBlock, isFontPickerBlock } from '../../src/blocks/font-picker-block';
import { createTextStylerBlock, isTextStylerBlock } from '../../src/blocks/text-styler-block';
import { createBgColorBlock, isBgColorBlock } from '../../src/blocks/bg-color-block';
import { createBgImageBlock, isBgImageBlock } from '../../src/blocks/bg-image-block';
import { createGradientBlock, isGradientBlock } from '../../src/blocks/gradient-block';
import { createTemplateCardBlock, isTemplateCardBlock } from '../../src/blocks/template-card-block';
import { createTemplateGalleryBlock, isTemplateGalleryBlock } from '../../src/blocks/template-gallery-block';
import { createPdfBlock, isPdfBlock } from '../../src/blocks/pdf-block';
import { createDatabaseRecordBlock, isDatabaseRecordBlock, formatRecordCardText } from '../../src/blocks/database-record-block';
import { getBlockManifest, createDefaultBlockNode, serializeBlockToMarkdown, BLOCK_MANIFESTS } from '../../src/blocks/block-registry';
import { NodeId } from '../../src/ast/types';

// ─── Heading: clampHeadingLevel ───

describe('clampHeadingLevel edge cases', () => {
  it('clamps 0 to 1', () => expect(clampHeadingLevel(0)).toBe(1));
  it('clamps -5 to 1', () => expect(clampHeadingLevel(-5)).toBe(1));
  it('clamps 100 to 6', () => expect(clampHeadingLevel(100)).toBe(6));
  it('rounds 1.6 to 2', () => expect(clampHeadingLevel(1.6)).toBe(2));
  it('rounds 2.4 to 2', () => expect(clampHeadingLevel(2.4)).toBe(2));
  it('keeps 1 as 1', () => expect(clampHeadingLevel(1)).toBe(1));
  it('keeps 6 as 6', () => expect(clampHeadingLevel(6)).toBe(6));
});

// ─── Cell: indexToColumnName ───

describe('indexToColumnName edge cases', () => {
  it('converts 1 to A', () => expect(indexToColumnName(1)).toBe('A'));
  it('converts 26 to Z', () => expect(indexToColumnName(26)).toBe('Z'));
  it('converts 27 to AA', () => expect(indexToColumnName(27)).toBe('AA'));
  it('converts 52 to AZ', () => expect(indexToColumnName(52)).toBe('AZ'));
  it('converts 53 to BA', () => expect(indexToColumnName(53)).toBe('BA'));
});

// ─── Cell: formatCellValue edge cases ───

describe('formatCellValue edge cases', () => {
  it('returns empty for null computedValue', () => {
    const block = createCellBlock('c1', 1, 1, '');
    expect(formatCellValue(block)).toBe('');
  });

  it('returns error string when error set', () => {
    const block = createCellBlock('c1', 1, 1, '=BAD', { error: '#REF!' });
    expect(formatCellValue(block)).toBe('#REF!');
  });

  it('formats currency', () => {
    const block = createCellBlock('c1', 1, 1, '100', { dataType: 'number', computedValue: 100, numberFormat: 'currency' });
    expect(formatCellValue(block)).toContain('ر.س');
  });

  it('formats percent', () => {
    const block = createCellBlock('c1', 1, 1, '0.85', { dataType: 'number', computedValue: 0.85, numberFormat: 'percent' });
    expect(formatCellValue(block)).toBe('85.0%');
  });

  it('formats string value', () => {
    const block = createCellBlock('c1', 1, 1, 'مرحبا', { computedValue: 'مرحبا' });
    expect(formatCellValue(block)).toBe('مرحبا');
  });
});

// ─── Table: empty rows ───

describe('Table edge cases', () => {
  it('empty table has 0 rows', () => {
    const block = createTableBlock('t1', []);
    expect(block.rows).toHaveLength(0);
    expect(block.data.rowsCount).toBe(0);
  });

  it('formats empty table as empty string', () => {
    const block = createTableBlock('t1', []);
    expect(formatTableMarkdown(block)).toBe('');
  });

  it('table with empty cells', () => {
    const cell = createTableCell('c1', '');
    const row = createTableRow('r1', [cell]);
    const block = createTableBlock('t1', [row]);
    expect(formatTableMarkdown(block)).toContain('|');
  });
});

// ─── Paragraph: empty content ───

describe('Paragraph edge cases', () => {
  it('creates default text node when empty', () => {
    const block = createParagraphBlock('p1', []);
    expect(block.content).toHaveLength(1);
    expect(block.content[0].type).toBe('text');
  });

  it('isParagraphBlock rejects non-objects', () => {
    expect(isParagraphBlock(null)).toBe(false);
    expect(isParagraphBlock(undefined)).toBe(false);
    expect(isParagraphBlock('string')).toBe(false);
    expect(isParagraphBlock(42)).toBe(false);
  });
});

// ─── Heading: default content ───

describe('Heading edge cases', () => {
  it('creates default text node when empty', () => {
    const block = createHeadingBlock('h1', []);
    expect(block.content).toHaveLength(1);
  });

  it('formats heading level 1', () => {
    const block = createHeadingBlock('h1', [{ id: 't1' as NodeId, type: 'text', text: 'عنوان' }], 1);
    expect(formatHeadingMarkdown(block)).toBe('# عنوان');
  });

  it('formats heading level 6', () => {
    const block = createHeadingBlock('h1', [{ id: 't1' as NodeId, type: 'text', text: 'عنوان' }], 6);
    expect(formatHeadingMarkdown(block)).toBe('###### عنوان');
  });

  it('isHeadingBlock rejects wrong type', () => {
    expect(isHeadingBlock({ type: 'paragraph' })).toBe(false);
  });
});

// ─── Image ───

describe('Image edge cases', () => {
  it('creates with provided src', () => {
    const block = createImageBlock('img1', '/photo.jpg');
    expect(block.data.src).toBe('/photo.jpg');
  });

  it('isImageBlock rejects wrong type', () => {
    expect(isImageBlock({ type: 'code' })).toBe(false);
  });
});

// ─── List ───

describe('List edge cases', () => {
  it('creates with provided items', () => {
    const block = createListBlock('l1', [createListItem('li1', 'عنصر')]);
    expect(block.items).toHaveLength(1);
  });

  it('handles task list items', () => {
    const block = createListBlock('l1', [
      createListItem('li1', 'مهمة 1', true),
      createListItem('li2', 'مهمة 2', false),
    ], 'task');
    expect(block.data.listType).toBe('task');
    expect(block.items[0].checked).toBe(true);
    expect(block.items[1].checked).toBe(false);
  });

  it('isListBlock rejects wrong type', () => {
    expect(isListBlock({ type: 'heading' })).toBe(false);
  });
});

// ─── Code ───

describe('Code edge cases', () => {
  it('creates with empty code', () => {
    const block = createCodeBlock('cb1', '');
    expect(block.data.code).toBe('');
  });

  it('isCodeBlock rejects wrong type', () => {
    expect(isCodeBlock({ type: 'paragraph' })).toBe(false);
  });
});

// ─── Horizontal Rule ───

describe('Horizontal Rule edge cases', () => {
  it('creates with default style', () => {
    const block = createHorizontalRuleBlock('hr1');
    expect(block.data.style).toBe('solid');
  });

  it('isHorizontalRuleBlock rejects wrong type', () => {
    expect(isHorizontalRuleBlock({ type: 'paragraph' })).toBe(false);
  });
});

// ─── Blockquote ───

describe('Blockquote edge cases', () => {
  it('creates with provided content', () => {
    const block = createBlockquoteBlock('bq1', 'حكمة');
    expect(block.data.text).toBe('حكمة');
  });

  it('creates with author and source', () => {
    const block = createBlockquoteBlock('bq1', 'حكمة', { author: 'الشافعي', source: 'الرسالة' });
    expect(block.data.author).toBe('الشافعي');
    expect(block.data.source).toBe('الرسالة');
  });

  it('isBlockquoteBlock rejects wrong type', () => {
    expect(isBlockquoteBlock({ type: 'paragraph' })).toBe(false);
  });
});

// ─── Shape: all types ───

describe('Shape edge cases', () => {
  it('creates all shape types', () => {
    const types: ShapeType[] = ['rectangle', 'circle', 'triangle', 'arrow', 'star', 'diamond'];
    for (const t of types) {
      const block = createShapeBlock(`sh-${t}`, t, 0, 0, 100, 100);
      expect(block.data.shapeType).toBe(t);
    }
  });

  it('gets paths for all shapes', () => {
    const types: ShapeType[] = ['rectangle', 'circle', 'triangle', 'arrow', 'star', 'diamond'];
    for (const t of types) {
      const path = getShapePresetPath(t, 50, 50);
      expect(typeof path).toBe('string');
      expect(path.length).toBeGreaterThan(0);
    }
  });

  it('isShapeBlock rejects wrong type', () => {
    expect(isShapeBlock({ type: 'slide' })).toBe(false);
  });
});

// ─── Slide ───

describe('Slide edge cases', () => {
  it('creates with default layout', () => {
    const block = createSlideBlock('sl1');
    expect(block.data.layout).toBe('title_and_content');
  });

  it('isSlideBlock rejects wrong type', () => {
    expect(isSlideBlock({ type: 'shape' })).toBe(false);
  });
});

// ─── Embed: all providers ───

describe('Embed edge cases', () => {
  it('creates all provider types', () => {
    const providers = ['youtube', 'vimeo', 'codepen', 'figma', 'generic'] as const;
    for (const p of providers) {
      const block = createEmbedBlock(`em-${p}`, `https://${p}.com/123`, { provider: p });
      expect(block.data.provider).toBe(p);
    }
  });

  it('isEmbedBlock rejects wrong type', () => {
    expect(isEmbedBlock({ type: 'image' })).toBe(false);
  });
});

// ─── PDF ───

describe('PDF edge cases', () => {
  it('creates with default annotations', () => {
    const block = createPdfBlock('pdf1', 'مستند تجريبي', { url: '/doc.pdf' });
    expect(block.data.url).toBe('/doc.pdf');
    expect(block.data.title).toBe('مستند تجريبي');
  });

  it('isPdfBlock rejects wrong type', () => {
    expect(isPdfBlock({ type: 'embed' })).toBe(false);
  });
});

// ─── Color Picker ───

describe('Color Picker edge cases', () => {
  it('creates with default color', () => {
    const block = createColorPickerBlock('cp1');
    expect(block.data.color).toBe('#000000');
  });

  it('isColorPickerBlock rejects wrong type', () => {
    expect(isColorPickerBlock({ type: 'icon-picker' })).toBe(false);
  });
});

// ─── Icon Picker ───

describe('Icon Picker edge cases', () => {
  it('creates with default icon', () => {
    const block = createIconPickerBlock('ip1');
    expect(block.data.iconName).toBeDefined();
  });

  it('isIconPickerBlock rejects wrong type', () => {
    expect(isIconPickerBlock({ type: 'color-picker' })).toBe(false);
  });
});

// ─── Font Picker ───

describe('Font Picker edge cases', () => {
  it('creates with default font', () => {
    const block = createFontPickerBlock('fp1');
    expect(block.data.fontFamily).toBeDefined();
  });

  it('isFontPickerBlock rejects wrong type', () => {
    expect(isFontPickerBlock({ type: 'text-styler' })).toBe(false);
  });
});

// ─── Text Styler ───

describe('Text Styler edge cases', () => {
  it('creates with default styles', () => {
    const block = createTextStylerBlock('ts1');
    expect(block.data).toBeDefined();
  });

  it('isTextStylerBlock rejects wrong type', () => {
    expect(isTextStylerBlock({ type: 'font-picker' })).toBe(false);
  });
});

// ─── Background Color ───

describe('BG Color edge cases', () => {
  it('creates with default color', () => {
    const block = createBgColorBlock('bg1');
    expect(block.data.color).toBeDefined();
  });

  it('isBgColorBlock rejects wrong type', () => {
    expect(isBgColorBlock({ type: 'bg-image' })).toBe(false);
  });
});

// ─── Background Image ───

describe('BG Image edge cases', () => {
  it('creates with provided url', () => {
    const block = createBgImageBlock('bgi1', '/bg.jpg');
    expect(block.data.url).toBe('/bg.jpg');
  });

  it('isBgImageBlock rejects wrong type', () => {
    expect(isBgImageBlock({ type: 'bg-color' })).toBe(false);
  });
});

// ─── Gradient ───

describe('Gradient edge cases', () => {
  it('creates with default stops', () => {
    const block = createGradientBlock('gr1');
    expect(block.data.stops).toHaveLength(2);
    expect(block.data.gradientType).toBe('linear');
  });

  it('creates with valid gradient structure', () => {
    const block = createGradientBlock('gr2');
    expect(block.data.angle).toBe(90);
    expect(block.data.stops[0].color).toBe('#f8fafc');
  });

  it('isGradientBlock rejects wrong type', () => {
    expect(isGradientBlock({ type: 'bg-color' })).toBe(false);
  });
});

// ─── Template Card ───

describe('Template Card edge cases', () => {
  it('creates with default title', () => {
    const block = createTemplateCardBlock('tc1');
    expect(block.data.title).toBe('عنوان البطاقة');
  });

  it('isTemplateCardBlock rejects wrong type', () => {
    expect(isTemplateCardBlock({ type: 'template-gallery' })).toBe(false);
  });
});

// ─── Template Gallery ───

describe('Template Gallery edge cases', () => {
  it('creates with default items', () => {
    const block = createTemplateGalleryBlock('tg1');
    expect(block.data.items.length).toBeGreaterThan(0);
  });

  it('isTemplateGalleryBlock rejects wrong type', () => {
    expect(isTemplateGalleryBlock({ type: 'template-card' })).toBe(false);
  });
});

// ─── Database Record ───

describe('Database Record edge cases', () => {
  it('creates with multiple field types', () => {
    const fields = {
      f1: { key: 'f1', label: 'الاسم', type: 'string' as const, value: 'أحمد' },
      f2: { key: 'f2', label: 'العمر', type: 'number' as const, value: 25 },
      f3: { key: 'f3', label: 'نشط', type: 'boolean' as const, value: true },
    };
    const block = createDatabaseRecordBlock('db1', 'table1', 'rec1', 'المستخدمين', fields);
    expect(Object.keys(block.data.fields)).toHaveLength(3);
  });

  it('formats record', () => {
    const fields = {
      f1: { key: 'f1', label: 'الاسم', type: 'string' as const, value: 'أحمد' },
    };
    const block = createDatabaseRecordBlock('db1', 'table1', 'rec1', 'سجل', fields);
    const text = formatRecordCardText(block);
    expect(typeof text).toBe('string');
  });

  it('isDatabaseRecordBlock rejects wrong type', () => {
    expect(isDatabaseRecordBlock({ type: 'cell' })).toBe(false);
  });
});

// ─── Block Registry ───

describe('Block Registry', () => {
  it('has manifests', () => {
    expect(BLOCK_MANIFESTS.length).toBeGreaterThan(0);
  });

  it('getBlockManifest returns manifest for known type', () => {
    const manifest = getBlockManifest('paragraph');
    expect(manifest).toBeDefined();
    expect(manifest?.type).toBe('paragraph');
  });

  it('getBlockManifest returns undefined for unknown type', () => {
    const manifest = getBlockManifest('unknown_type' as any);
    expect(manifest).toBeUndefined();
  });

  it('createDefaultBlockNode creates paragraph by default', () => {
    const block = createDefaultBlockNode('paragraph', 'test-1');
    expect(block.type).toBe('paragraph');
    expect(block.id).toBe('test-1');
  });

  it('createDefaultBlockNode creates heading', () => {
    const block = createDefaultBlockNode('heading', 'test-2');
    expect(block.type).toBe('heading');
  });

  it('createDefaultBlockNode creates table', () => {
    const block = createDefaultBlockNode('table', 'test-3');
    expect(block.type).toBe('table');
  });

  it('serializeBlockToMarkdown handles paragraph', () => {
    const block = createDefaultBlockNode('paragraph', 'test-5');
    const md = serializeBlockToMarkdown(block);
    expect(typeof md).toBe('string');
  });

  it('serializeBlockToMarkdown handles heading', () => {
    const block = createDefaultBlockNode('heading', 'test-6');
    const md = serializeBlockToMarkdown(block);
    expect(typeof md).toBe('string');
  });
});

// ─── BaseBlockNode: trait system ───

describe('BaseBlockNode traits', () => {
  it('all blocks have traits array', () => {
    const blocks = [
      createParagraphBlock('p1', []),
      createHeadingBlock('h1', []),
      createTableBlock('t1', []),
      createImageBlock('img1', ''),
      createListBlock('l1', []),
      createCodeBlock('cb1', ''),
      createHorizontalRuleBlock('hr1'),
      createBlockquoteBlock('bq1', ''),
      createCellBlock('cl1', 1, 1),
      createShapeBlock('sh1', 'rectangle', 0, 0, 10, 10),
      createSlideBlock('sl1'),
      createEmbedBlock('em1', ''),
      createPdfBlock('pdf1', ''),
    ];
    for (const block of blocks) {
      expect(Array.isArray(block.traits)).toBe(true);
      expect(block.traits.length).toBeGreaterThan(0);
    }
  });

  it('all blocks have valid domain', () => {
    const validDomains = ['writer', 'calc', 'impress', 'base', 'universal'];
    const blocks = [
      createParagraphBlock('p1', []),
      createCellBlock('cl1', 1, 1),
      createShapeBlock('sh1', 'rectangle', 0, 0, 10, 10),
      createSlideBlock('sl1'),
      createImageBlock('img1', ''),
    ];
    for (const block of blocks) {
      expect(validDomains).toContain(block.domain);
    }
  });
});
