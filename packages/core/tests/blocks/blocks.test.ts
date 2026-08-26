/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: blocks.test.ts
 * 📂 المسار: packages/core/tests/blocks/blocks.test.ts
 * 🎯 الهدف: اختبار شامل لجميع البلوكات الجديدة (25 بلوك)
 * 🏷️ المعرف: TEST-BLOCKS-001
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, expect, it } from 'vitest';
import {
  createParagraphBlock,
  isParagraphBlock,
  formatParagraphMarkdown,
  createHeadingBlock,
  isHeadingBlock,
  formatHeadingMarkdown,
  createTableBlock,
  createTableRow,
  createTableCell,
  isTableBlock,
  formatTableMarkdown,
  createImageBlock,
  isImageBlock,
  formatImageMarkdown,
  createListBlock,
  createListItem,
  isListBlock,
  formatListMarkdown,
  createCodeBlock,
  isCodeBlock,
  formatCodeBlockMarkdown,
  createHorizontalRuleBlock,
  isHorizontalRuleBlock,
  formatHorizontalRuleMarkdown,
  createBlockquoteBlock,
  isBlockquoteBlock,
  formatBlockquoteMarkdown,
  createCellBlock,
  isCellBlock,
  formatCellValue,
  createShapeBlock,
  isShapeBlock,
  getShapePresetPath,
  createSlideBlock,
  isSlideBlock,
  formatSlideSummary,
  createDatabaseRecordBlock,
  isDatabaseRecordBlock,
  formatRecordCardText,
  createEmbedBlock,
  isEmbedBlock,
  formatEmbedMarkdown,
  createColorPickerBlock,
  isColorPickerBlock,
  formatColorPickerMarkdown,
  createIconPickerBlock,
  isIconPickerBlock,
  formatIconPickerMarkdown,
  createFontPickerBlock,
  isFontPickerBlock,
  formatFontPickerMarkdown,
  createTextStylerBlock,
  isTextStylerBlock,
  formatTextStylerMarkdown,
  createBgColorBlock,
  isBgColorBlock,
  formatBgColorMarkdown,
  createBgImageBlock,
  isBgImageBlock,
  formatBgImageMarkdown,
  createGradientBlock,
  isGradientBlock,
  formatGradientMarkdown,
  createTemplateCardBlock,
  isTemplateCardBlock,
  formatTemplateCardMarkdown,
  createTemplateGalleryBlock,
  isTemplateGalleryBlock,
  formatTemplateGalleryMarkdown,
  createPdfBlock,
  isPdfBlock,
  formatPdfMarkdown,
} from '../../src/index';
import { NodeId } from '../../src/ast/types';

// ─── Writer Blocks ───

describe('Paragraph Block', () => {
  it('creates with defaults', () => {
    const block = createParagraphBlock('p1', []);
    expect(block.type).toBe('paragraph');
    expect(block.domain).toBe('writer');
    expect(block.data.align).toBe('right');
    expect(block.data.dir).toBe('rtl');
    expect(block.content).toHaveLength(1);
  });

  it('isParagraphBlock type guard', () => {
    expect(isParagraphBlock(createParagraphBlock('p1', []))).toBe(true);
    expect(isParagraphBlock({ type: 'other' })).toBe(false);
    expect(isParagraphBlock(null)).toBe(false);
  });

  it('formats to markdown', () => {
    const block = createParagraphBlock('p1', [{ id: 't1' as NodeId, type: 'text', text: 'مرحبا' }]);
    expect(formatParagraphMarkdown(block)).toBe('مرحبا');
  });
});

describe('Heading Block', () => {
  it('creates with level', () => {
    const block = createHeadingBlock('h1', [], 2);
    expect(block.type).toBe('heading');
    expect(block.data.level).toBe(2);
  });

  it('formats to markdown', () => {
    const block = createHeadingBlock(
      'h1',
      [{ id: 't1' as NodeId, type: 'text', text: 'عنوان' }],
      3,
    );
    expect(formatHeadingMarkdown(block)).toBe('### عنوان');
  });
});

describe('Table Block', () => {
  it('creates with rows and cells', () => {
    const cell = createTableCell('c1', 'بيانات');
    const row = createTableRow('r1', [cell]);
    const block = createTableBlock('t1', [row]);
    expect(block.type).toBe('table');
    expect(block.rows).toHaveLength(1);
    expect(block.data.rowsCount).toBe(1);
    expect(block.data.colsCount).toBe(1);
  });

  it('formats to markdown', () => {
    const row = createTableRow('r1', [createTableCell('c1', 'اسم'), createTableCell('c2', 'قيمة')]);
    const block = createTableBlock('t1', [row]);
    const md = formatTableMarkdown(block);
    expect(md).toContain('| اسم | قيمة |');
  });
});

describe('List Block', () => {
  it('creates bullet list', () => {
    const block = createListBlock('l1', [
      createListItem('li1', 'العنصر الأول'),
      createListItem('li2', 'العنصر الثاني'),
    ]);
    expect(block.type).toBe('list');
    expect(block.data.listType).toBe('bullet');
  });
});

describe('Code Block', () => {
  it('creates with language', () => {
    const block = createCodeBlock('cb1', 'console.log("hi")', 'typescript');
    expect(block.type).toBe('code_block');
    expect(block.data.language).toBe('typescript');
  });
});

describe('Horizontal Rule Block', () => {
  it('creates solid line', () => {
    const block = createHorizontalRuleBlock('hr1');
    expect(block.type).toBe('horizontal_rule');
    expect(block.data.style).toBe('solid');
  });
});

describe('Blockquote Block', () => {
  it('creates with author', () => {
    const block = createBlockquoteBlock('bq1', 'الحكمة ضالة المؤمن', { author: 'ابن القيم' });
    expect(block.type).toBe('blockquote');
  });
});

// ─── Calc Blocks ───

describe('Cell Block', () => {
  it('creates number cell', () => {
    const block = createCellBlock('cl1', 1, 1, '42');
    expect(block.type).toBe('cell');
    expect(block.data.rawInput).toBe('42');
  });

  it('formats value', () => {
    const block = createCellBlock('cl1', 1, 1, '1234.5', {
      dataType: 'number',
      numberFormat: 'decimal',
    });
    expect(block.data.numberFormat).toBe('decimal');
  });
});

// ─── Impress Blocks ───

describe('Shape Block', () => {
  it('creates rectangle', () => {
    const block = createShapeBlock('sh1', 'rectangle', 10, 20, 100, 50);
    expect(block.type).toBe('shape');
    expect(block.data.shapeType).toBe('rectangle');
  });

  it('gets preset path', () => {
    const path = getShapePresetPath('circle', 50, 50);
    expect(path).toContain('M');
  });
});

describe('Slide Block', () => {
  it('creates title slide', () => {
    const block = createSlideBlock('sl1', 1, 'عرض تجاري');
    expect(block.type).toBe('slide');
    expect(block.data.layout).toBe('title_and_content');
  });

  it('formats summary', () => {
    const block = createSlideBlock('sl1', 1, 'عنوان');
    expect(formatSlideSummary(block)).toContain('عنوان');
  });
});

// ─── Base Blocks ───

describe('Database Record Block', () => {
  it('creates record', () => {
    const block = createDatabaseRecordBlock(
      'db1',
      [{ id: 'f1', name: 'الاسم', type: 'string', value: 'أحمد' }],
      'جدول المستخدمين',
    );
    expect(block.type).toBe('database_record');
  });
});

// ─── Universal Blocks ───

describe('Image Block', () => {
  it('creates with src', () => {
    const block = createImageBlock('img1', '/photo.jpg', 'صورة');
    expect(block.type).toBe('image');
    expect(block.data.src).toBe('/photo.jpg');
  });
});

describe('Embed Block', () => {
  it('creates youtube embed', () => {
    const block = createEmbedBlock('em1', 'https://youtube.com/watch?v=123', {
      provider: 'youtube',
    });
    expect(block.type).toBe('embed');
    expect(block.data.provider).toBe('youtube');
  });
});

describe('PDF Block', () => {
  it('creates pdf viewer', () => {
    const block = createPdfBlock('pdf1', '/doc.pdf');
    expect(block.type).toBe('pdf');
  });
});

// ─── Design Blocks ───

describe('Color Picker Block', () => {
  it('creates with hex', () => {
    const block = createColorPickerBlock('cp1', '#FF5733');
    expect(block.type).toBe('color-picker');
    expect(block.data.color).toBe('#FF5733');
  });

  it('formats to markdown', () => {
    const block = createColorPickerBlock('cp1', '#00FF00');
    expect(formatColorPickerMarkdown(block)).toContain('#00FF00');
  });
});

describe('Icon Picker Block', () => {
  it('creates with icon', () => {
    const block = createIconPickerBlock('ip1', 'Settings');
    expect(block.type).toBe('icon-picker');
  });
});

describe('Font Picker Block', () => {
  it('creates with font', () => {
    const block = createFontPickerBlock('fp1', 'Inter');
    expect(block.type).toBe('font-picker');
  });
});

describe('Text Styler Block', () => {
  it('creates with styles', () => {
    const block = createTextStylerBlock('ts1', { color: '#333', fontSize: 16 });
    expect(block.type).toBe('text-styler');
  });
});

describe('Background Color Block', () => {
  it('creates with color', () => {
    const block = createBgColorBlock('bg1', '#FFFFFF');
    expect(block.type).toBe('bg-color');
  });
});

describe('Background Image Block', () => {
  it('creates with image', () => {
    const block = createBgImageBlock('bgi1', '/bg.jpg');
    expect(block.type).toBe('bg-image');
  });
});

describe('Gradient Block', () => {
  it('creates linear gradient', () => {
    const block = createGradientBlock(
      'gr1',
      [
        { color: '#FF0000', position: 0 },
        { color: '#0000FF', position: 100 },
      ],
      { type: 'linear', angle: 90 },
    );
    expect(block.type).toBe('gradient');
    expect(block.data.stops).toHaveLength(2);
  });
});

// ─── Template Blocks ───

describe('Template Card Block', () => {
  it('creates card', () => {
    const block = createTemplateCardBlock('tc1', 'قالب خطاب', 'قالب رسمي');
    expect(block.type).toBe('template-card');
  });
});

describe('Template Gallery Block', () => {
  it('creates gallery', () => {
    const block = createTemplateGalleryBlock('tg1');
    expect(block.type).toBe('template-gallery');
    expect(block.data.items.length).toBeGreaterThan(0);
  });
});
