/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: block-registry.ts
 * 📂 المسار: src/blocks/block-registry.ts
 * 🎯 الهدف الرئيسي: السجل المركزي لجميع البلوكات الـ 12 مع مصفوفة التصدير ومصانع الكتل
 * 📋 المعايير: تغطية النطاقات الأربعة (Writer, Calc, Impress, Base)، ثيم نهاري نقي
 * 🧪 الاختبارات: التحقق من تسجيل البلوكات وتوليد النماذج الافتراضية
 * 🏷️ المعرف: BLK-REGISTRY-001
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Centralized IoC Block Registry + Polymorphic Markdown/HTML Serializers
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم كسر مصفوفة التصدير لأي نوع كتلة.
 *    2. ضمان بقاء الدوال أقل من 50 سطراً مع تقسيم المنطق.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية Switch-Case مع استجابة افتراضية آمنة.
 *    - Type Guards شاملة للكتل الـ 12.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts, src/blocks/*.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - getAllBlockManifests: استرجاع جميع بيانات الكتل الـ 12 (#L85)
 *    - createDefaultBlockNode: إنشاء كتلة افتراضية (#L155)
 *    - serializeBlockToMarkdown: تصدير الكتلة إلى Markdown (#L195)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يربط جميع تعريفات الكتل بنظام واجهة المستخدم والمحررات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: إضافة إمكانية تسجيل كتل مخصصة من الإضافات Plugins
 *    - 📖 مرجع تقني: LibreText Components Registry Specification
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { DomainType, TraitKey, NodeId } from '../ast/types';
import {
  ParagraphBlockNode,
  createParagraphBlock,
  formatParagraphMarkdown,
  isParagraphBlock,
} from './paragraph-block';
import {
  HeadingBlockNode,
  createHeadingBlock,
  formatHeadingMarkdown,
  isHeadingBlock,
} from './heading-block';
import {
  TableBlockNode,
  createTableBlock,
  createTableRow,
  createTableCell,
  formatTableMarkdown,
  isTableBlock,
} from './table-block';
import { ImageBlockNode, createImageBlock, formatImageMarkdown, isImageBlock } from './image-block';
import {
  ListBlockNode,
  createListBlock,
  createListItem,
  formatListMarkdown,
  isListBlock,
} from './list-block';
import { CodeBlockNode, createCodeBlock, formatCodeBlockMarkdown, isCodeBlock } from './code-block';
import {
  HorizontalRuleBlockNode,
  createHorizontalRuleBlock,
  formatHorizontalRuleMarkdown,
  isHorizontalRuleBlock,
} from './horizontal-rule-block';
import {
  BlockquoteBlockNode,
  createBlockquoteBlock,
  formatBlockquoteMarkdown,
  isBlockquoteBlock,
} from './blockquote-block';
import { CellBlockNode, createCellBlock, formatCellValue, isCellBlock } from './cell-block';
import { ShapeBlockNode, createShapeBlock, isShapeBlock } from './shape-block';
import { SlideBlockNode, createSlideBlock, formatSlideSummary, isSlideBlock } from './slide-block';
import {
  DatabaseRecordBlockNode,
  createDatabaseRecordBlock,
  createDatabaseField,
  formatRecordCardText,
  isDatabaseRecordBlock,
} from './database-record-block';
import { EmbedBlockNode, createEmbedBlock, formatEmbedMarkdown, isEmbedBlock } from './embed-block';
import { PdfBlockNode, createPdfBlock, formatPdfMarkdown, isPdfBlock } from './pdf-block';
import {
  ColorPickerBlockNode,
  createColorPickerBlock,
  formatColorPickerMarkdown,
  formatColorPickerHtml,
  isColorPickerBlock,
} from './color-picker-block';
import {
  IconPickerBlockNode,
  createIconPickerBlock,
  formatIconPickerMarkdown,
  formatIconPickerHtml,
  isIconPickerBlock,
} from './icon-picker-block';
import {
  BgColorBlockNode,
  createBgColorBlock,
  formatBgColorMarkdown,
  formatBgColorHtml,
  isBgColorBlock,
} from './bg-color-block';
import {
  BgImageBlockNode,
  createBgImageBlock,
  formatBgImageMarkdown,
  formatBgImageHtml,
  isBgImageBlock,
} from './bg-image-block';
import {
  GradientBlockNode,
  createGradientBlock,
  formatGradientMarkdown,
  formatGradientHtml,
  isGradientBlock,
} from './gradient-block';
import {
  FontPickerBlockNode,
  createFontPickerBlock,
  formatFontPickerMarkdown,
  formatFontPickerHtml,
  isFontPickerBlock,
} from './font-picker-block';
import {
  TextStylerBlockNode,
  createTextStylerBlock,
  formatTextStylerMarkdown,
  formatTextStylerHtml,
  isTextStylerBlock,
} from './text-styler-block';
import {
  TemplateCardBlockNode,
  createTemplateCardBlock,
  formatTemplateCardMarkdown,
  formatTemplateCardHtml,
  isTemplateCardBlock,
} from './template-card-block';
import {
  TemplateGalleryBlockNode,
  createTemplateGalleryBlock,
  formatTemplateGalleryMarkdown,
  formatTemplateGalleryHtml,
  isTemplateGalleryBlock,
} from './template-gallery-block';
import {
  MathBlockNode,
  createMathBlock,
  formatMathMarkdown,
  isMathBlock,
} from './math-block';
import {
  DetailsBlockNode,
  createDetailsBlock,
  formatDetailsMarkdown,
  isDetailsBlock,
} from './details-block';
import { TocBlockNode, createTocBlock, formatTocMarkdown, isTocBlock } from './toc-block';

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'table'
  | 'image'
  | 'list'
  | 'code_block'
  | 'horizontal_rule'
  | 'blockquote'
  | 'cell'
  | 'shape'
  | 'slide'
  | 'database_record'
  | 'embed'
  | 'pdf'
  | 'color-picker'
  | 'icon-picker'
  | 'bg-color'
  | 'bg-image'
  | 'gradient'
  | 'font-picker'
  | 'text-styler'
  | 'template-card'
  | 'template-gallery'
  | 'math'
  | 'details'
  | 'toc';

export type AnyBlockNode =
  | ParagraphBlockNode
  | HeadingBlockNode
  | TableBlockNode
  | ImageBlockNode
  | ListBlockNode
  | CodeBlockNode
  | HorizontalRuleBlockNode
  | BlockquoteBlockNode
  | CellBlockNode
  | ShapeBlockNode
  | SlideBlockNode
  | DatabaseRecordBlockNode
  | EmbedBlockNode
  | PdfBlockNode
  | ColorPickerBlockNode
  | IconPickerBlockNode
  | BgColorBlockNode
  | BgImageBlockNode
  | GradientBlockNode
  | FontPickerBlockNode
  | TextStylerBlockNode
  | TemplateCardBlockNode
  | TemplateGalleryBlockNode
  | MathBlockNode
  | DetailsBlockNode
  | TocBlockNode;

export interface BlockManifest {
  readonly type: BlockType;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly domain: DomainType;
  readonly category: 'Text' | 'Data' | 'Visual' | 'Layout' | 'Plugin';
  readonly descriptionAr: string;
  readonly traits: readonly TraitKey[];
  readonly priority: 'High' | 'Medium' | 'Low';
  readonly supportedSerializers: readonly string[];
}

export const BLOCK_MANIFESTS: readonly BlockManifest[] = [
  {
    type: 'paragraph',
    nameAr: 'فقرة نصية',
    nameEn: 'Paragraph',
    domain: 'writer',
    category: 'Text',
    descriptionAr: 'الوحدة البنائية الأساسية للمحتوى النصي مع دعم التنسيقات المضمنة',
    traits: ['styleable', 'draggable'],
    priority: 'High',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF', 'TXT'],
  },
  {
    type: 'heading',
    nameAr: 'عنوان هيكلي',
    nameEn: 'Heading',
    domain: 'writer',
    category: 'Text',
    descriptionAr: 'عناوين هرمية من المستوى الأول H1 حتى السادس H6 مع ترقيم تلقائي',
    traits: ['styleable', 'draggable'],
    priority: 'High',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF', 'TXT'],
  },
  {
    type: 'table',
    nameAr: 'جدول هيكلي',
    nameEn: 'Table',
    domain: 'universal',
    category: 'Data',
    descriptionAr: 'جدول مدمج متعدد الصفوف والأعمدة مع دعم دمج الخلايا وتنسيق الحدود',
    traits: ['resizable', 'styleable', 'lockable'],
    priority: 'High',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF', 'TXT'],
  },
  {
    type: 'image',
    nameAr: 'صورة ووسائط',
    nameEn: 'Image',
    domain: 'universal',
    category: 'Visual',
    descriptionAr: 'عرض الصور والوسائط الرقمية مع نسبة أبعاد مغناطيسية وفلاتر نهارية',
    traits: ['draggable', 'resizable', 'styleable', 'lockable'],
    priority: 'High',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF'],
  },
  {
    type: 'list',
    nameAr: 'قائمة منظمة',
    nameEn: 'List',
    domain: 'writer',
    category: 'Text',
    descriptionAr: 'قوائم نقطية ورقمية وقوائم مهام قابلة للتأشير والتداخل',
    traits: ['styleable', 'draggable'],
    priority: 'Medium',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF', 'TXT'],
  },
  {
    type: 'code_block',
    nameAr: 'مقطع برمجي',
    nameEn: 'Code Block',
    domain: 'writer',
    category: 'Text',
    descriptionAr: 'عرض الأكواد البرمجية للتوثيق مع ترقيم الأسطر وتظليل القواعد',
    traits: ['styleable', 'lockable'],
    priority: 'Medium',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF', 'TXT'],
  },
  {
    type: 'horizontal_rule',
    nameAr: 'خط فاصل',
    nameEn: 'Horizontal Rule',
    domain: 'writer',
    category: 'Layout',
    descriptionAr: 'خط فاصل بصري لتقسيم المقاطع بنمط متصل أو منقط فاتح',
    traits: ['draggable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF', 'TXT'],
  },
  {
    type: 'blockquote',
    nameAr: 'اقتباس مميز',
    nameEn: 'Blockquote',
    domain: 'writer',
    category: 'Text',
    descriptionAr: 'إبراز المقولات والنظريات مع شريط جانبي ومصدر الاقتباس',
    traits: ['styleable', 'draggable'],
    priority: 'Medium',
    supportedSerializers: ['Markdown', 'HTML5', 'DOCX', 'ODF', 'LaTeX', 'PDF', 'TXT'],
  },
  {
    type: 'cell',
    nameAr: 'خلية حسابية A1',
    nameEn: 'Calc Cell',
    domain: 'calc',
    category: 'Data',
    descriptionAr: 'خلية جداول بيانات ذكية تدعم الصيغ الحسابية وتنسيق الأرقام والعملات',
    traits: ['styleable'],
    priority: 'Low',
    supportedSerializers: ['Markdown', 'HTML5', 'ODF', 'DOCX', 'PDF'],
  },
  {
    type: 'shape',
    nameAr: 'شكل مكاني',
    nameEn: 'Vector Shape',
    domain: 'impress',
    category: 'Visual',
    descriptionAr: 'أشكال هندسية ورسومية متجهة قابلة للتحريك والتدوير في السبورة',
    traits: ['draggable', 'resizable', 'styleable', 'lockable'],
    priority: 'Low',
    supportedSerializers: ['HTML5', 'ODF', 'DOCX', 'PDF'],
  },
  {
    type: 'slide',
    nameAr: 'شريحة عرض',
    nameEn: 'Presentation Slide',
    domain: 'impress',
    category: 'Layout',
    descriptionAr: 'إطار شريحة تقديمية مع تخطيطات قياسية ومذكرات العارض',
    traits: ['styleable', 'lockable'],
    priority: 'Low',
    supportedSerializers: ['ODF', 'LaTeX', 'HTML5', 'PDF', 'Markdown'],
  },
  {
    type: 'database_record',
    nameAr: 'سجل قاعدة بيانات',
    nameEn: 'Database Record',
    domain: 'base',
    category: 'Data',
    descriptionAr: 'بطاقة سجل موحدة بحقول منوعة ونوعية قوية',
    traits: ['draggable', 'styleable', 'lockable'],
    priority: 'Low',
    supportedSerializers: ['JSON', 'HTML5', 'Markdown', 'DOCX', 'ODF', 'PDF', 'TXT'],
  },
  {
    type: 'embed',
    nameAr: 'تضمين تفاعلي',
    nameEn: 'Interactive Embed',
    domain: 'universal',
    category: 'Visual',
    descriptionAr: 'تضمين وسائط وفيديوهات وإطارات تفاعلية مع نسبة أبعاد آمنة',
    traits: ['draggable', 'resizable', 'styleable', 'lockable'],
    priority: 'Low',
    supportedSerializers: ['HTML5', 'Markdown', 'PDF'],
  },
  {
    type: 'pdf',
    nameAr: 'مستند PDF ذكي',
    nameEn: 'Smart PDF Document',
    domain: 'universal',
    category: 'Visual',
    descriptionAr: 'قراءة وتحرير مستندات PDF بمواصفات عالية مع تعليقات وأختام وتواقيع',
    traits: ['draggable', 'resizable', 'styleable', 'lockable'],
    priority: 'High',
    supportedSerializers: ['PDF', 'Markdown', 'HTML5'],
  },
  {
    type: 'color-picker',
    nameAr: 'منتقي الألوان',
    nameEn: 'Color Picker',
    domain: 'universal',
    category: 'Visual',
    descriptionAr: 'أداة تفاعلية لاختيار الألوان بصيغ مختلفة (HEX, RGB, HSL)',
    traits: ['draggable', 'lockable'],
    priority: 'Medium',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'icon-picker',
    nameAr: 'منتقي الأيقونات',
    nameEn: 'Icon Picker',
    domain: 'universal',
    category: 'Visual',
    descriptionAr: 'منتقي أيقونات سريع مع دعم لمكتبات متعددة مثل Lucide',
    traits: ['draggable', 'resizable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'bg-color',
    nameAr: 'خلفية لونية',
    nameEn: 'Background Color',
    domain: 'universal',
    category: 'Layout',
    descriptionAr: 'كتلة لتعيين خلفية لونية للمحتوى',
    traits: ['draggable', 'resizable', 'styleable'],
    priority: 'Low',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'bg-image',
    nameAr: 'خلفية صورة',
    nameEn: 'Background Image',
    domain: 'universal',
    category: 'Layout',
    descriptionAr: 'كتلة لتعيين صورة كخلفية',
    traits: ['draggable', 'resizable', 'styleable'],
    priority: 'Low',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'gradient',
    nameAr: 'تدرج لوني',
    nameEn: 'Gradient',
    domain: 'universal',
    category: 'Visual',
    descriptionAr: 'تدرج لوني متقدم (طي، خطي، قطري)',
    traits: ['draggable', 'resizable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'font-picker',
    nameAr: 'منتقي الخطوط',
    nameEn: 'Font Picker',
    domain: 'universal',
    category: 'Visual',
    descriptionAr: 'منتقي خطوط متقدم مع دعم لخصائص الخط',
    traits: ['draggable', 'lockable'],
    priority: 'Low',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'text-styler',
    nameAr: 'منسق نصوص',
    nameEn: 'Text Styler',
    domain: 'universal',
    category: 'Layout',
    descriptionAr: 'تنسيق متقدم للنصوص شامل الحواف والظلال',
    traits: ['draggable', 'lockable'],
    priority: 'Low',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'template-card',
    nameAr: 'قالب بطاقة',
    nameEn: 'Template Card',
    domain: 'universal',
    category: 'Layout',
    descriptionAr: 'قالب بطاقة مرنة لتنظيم المحتوى',
    traits: ['draggable', 'resizable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'template-gallery',
    nameAr: 'قالب معرض',
    nameEn: 'Template Gallery',
    domain: 'universal',
    category: 'Layout',
    descriptionAr: 'قالب معرض صور شبكي',
    traits: ['draggable', 'resizable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['HTML5', 'Markdown'],
  },
  {
    type: 'math',
    nameAr: 'معادلة رياضية',
    nameEn: 'Math Equation',
    domain: 'writer',
    category: 'Plugin',
    descriptionAr: 'معادلات LaTeX بوضع سطري أو مستقل مع فحص توازن المحددات',
    traits: ['draggable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['Markdown', 'HTML5', 'LaTeX', 'PDF'],
  },
  {
    type: 'details',
    nameAr: 'منسدل تفاصيل',
    nameEn: 'Details Accordion',
    domain: 'writer',
    category: 'Layout',
    descriptionAr: 'قسم قابل للطي بملخص ومحتوى مخفي بنمط GFM details',
    traits: ['draggable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['Markdown', 'HTML5'],
  },
  {
    type: 'toc',
    nameAr: 'جدول محتويات',
    nameEn: 'Table of Contents',
    domain: 'writer',
    category: 'Layout',
    descriptionAr: 'فهرس مشتق تلقائياً من عناوين المستند حتى عمق محدد',
    traits: ['draggable', 'styleable'],
    priority: 'Medium',
    supportedSerializers: ['Markdown', 'HTML5'],
  },
];

export function getBlockManifest(type: BlockType): BlockManifest | undefined {
  return BLOCK_MANIFESTS.find((m) => m.type === type);
}

function createDefaultWriterBlock(type: BlockType, id: string): AnyBlockNode {
  if (type === 'heading') {
    return createHeadingBlock(
      id,
      [{ id: `${id}-t` as NodeId, type: 'text', text: 'عنوان جديد رئيسي' }],
      2,
    );
  }
  if (type === 'list') {
    return createListBlock(id, [
      createListItem(`${id}-1`, 'العنصر الأول في القائمة'),
      createListItem(`${id}-2`, 'العنصر الثاني في القائمة'),
      createListItem(`${id}-3`, 'العنصر الثالث في القائمة'),
    ]);
  }
  if (type === 'code_block') {
    return createCodeBlock(
      id,
      'const greeting = "مرحباً بكم في LibreText";\nconsole.log(greeting);',
      'typescript',
    );
  }
  if (type === 'horizontal_rule') {
    return createHorizontalRuleBlock(id);
  }
  if (type === 'blockquote') {
    return createBlockquoteBlock(id, 'الحكمة ضالة المؤمن، أنى وجدها فهو أحق بها.', {
      author: 'ابن القيم',
    });
  }
  return createParagraphBlock(id, [
    {
      id: `${id}-t` as NodeId,
      type: 'text',
      text: 'هذه فقرة نصية تجريبية مصممة بنقاء عالي ونظام خطوط عربي سلس.',
    },
  ]);
}

function createDefaultUniversalBlock(type: BlockType, id: string): AnyBlockNode {
  if (type === 'embed') {
    return createEmbedBlock(id, 'https://www.youtube.com/embed/dQw4w9WgXcQ', {
      title: 'فيديو توضيحي تفاعلي',
    });
  }
  if (type === 'pdf') {
    return createPdfBlock(id, 'مستند المواصفات القياسية لنواة LibreText');
  }
  if (type === 'table') {
    const row1 = createTableRow(
      `${id}-r1`,
      [
        createTableCell(`${id}-c11`, 'العنصر'),
        createTableCell(`${id}-c12`, 'الكمية'),
        createTableCell(`${id}-c13`, 'السعر'),
      ],
      true,
    );
    const row2 = createTableRow(`${id}-r2`, [
      createTableCell(`${id}-c21`, 'حزمة النواة Core'),
      createTableCell(`${id}-c22`, '1'),
      createTableCell(`${id}-c23`, '150 ر.س'),
    ]);
    return createTableBlock(id, [row1, row2]);
  }
  if (type === 'image') {
    return createImageBlock(
      id,
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
      'تدرج نهاري فاتح',
      { caption: 'صورة توضيحية بنمط daylight' },
    );
  }
  if (type === 'color-picker') {
    return createColorPickerBlock(id, '#3b82f6');
  }
  if (type === 'icon-picker') {
    return createIconPickerBlock(id, 'star');
  }
  if (type === 'bg-color') {
    return createBgColorBlock(id);
  }
  if (type === 'bg-image') {
    return createBgImageBlock(id);
  }
  if (type === 'gradient') {
    return createGradientBlock(id);
  }
  if (type === 'font-picker') {
    return createFontPickerBlock(id);
  }
  if (type === 'text-styler') {
    return createTextStylerBlock(id);
  }
  if (type === 'template-card') {
    return createTemplateCardBlock(id);
  }
  if (type === 'template-gallery') {
    return createTemplateGalleryBlock(id);
  }
  if (type === 'math') {
    return createMathBlock(id, { latex: 'E = mc^2', displayMode: true });
  }
  if (type === 'details') {
    return createDetailsBlock(id, { summary: 'تفاصيل إضافية', content: 'المحتوى المخفي هنا.' });
  }
  if (type === 'toc') {
    return createTocBlock(id, { maxDepth: 3 });
  }
  return createDefaultWriterBlock(type, id);
}

function createDefaultDataOrVisualBlock(type: BlockType, id: string): AnyBlockNode {
  if (type === 'cell') {
    return createCellBlock(id, 1, 1, '=SUM(B2:B10)', {
      computedValue: 2450,
      numberFormat: 'currency',
    });
  }
  if (type === 'shape') {
    return createShapeBlock(id, 'circle', { label: 'نواة النظام' });
  }
  if (type === 'slide') {
    return createSlideBlock(id, 1, 'مقدمة في منظومة LibreText Suite', {
      subtitle: 'محرر مكتبي متعدد الصيغ',
    });
  }
  if (type === 'database_record') {
    const f1 = createDatabaseField('name', 'الاسم', 'string', 'حسام الخولي');
    const f2 = createDatabaseField('role', 'الدور', 'string', 'مهندس برمجيات رئيسي');
    const f3 = createDatabaseField('active', 'نشط', 'boolean', true);
    return createDatabaseRecordBlock(id, 'tbl-users', 'rec-001', 'ملف المهندس المسؤول', {
      name: f1,
      role: f2,
      active: f3,
    });
  }
  return createDefaultUniversalBlock(type, id);
}

export function createDefaultBlockNode(type: BlockType, id: string): AnyBlockNode {
  return createDefaultDataOrVisualBlock(type, id);
}

export function serializeBlockToMarkdown(block: AnyBlockNode): string {
  if (isParagraphBlock(block)) return formatParagraphMarkdown(block);
  if (isHeadingBlock(block)) return formatHeadingMarkdown(block);
  if (isTableBlock(block)) return formatTableMarkdown(block);
  if (isImageBlock(block)) return formatImageMarkdown(block);
  if (isListBlock(block)) return formatListMarkdown(block);
  if (isCodeBlock(block)) return formatCodeBlockMarkdown(block);
  if (isHorizontalRuleBlock(block)) return formatHorizontalRuleMarkdown(block);
  if (isBlockquoteBlock(block)) return formatBlockquoteMarkdown(block);
  if (isCellBlock(block)) return `[Cell ${block.data.address}: ${formatCellValue(block)}]`;
  if (isSlideBlock(block)) return formatSlideSummary(block);
  if (isDatabaseRecordBlock(block)) return formatRecordCardText(block);
  if (isShapeBlock(block))
    return `[Shape: ${block.data.shapeType} (${block.data.width}x${block.data.height})]`;
  if (isEmbedBlock(block)) return formatEmbedMarkdown(block);
  if (isPdfBlock(block)) return formatPdfMarkdown(block);
  if (isColorPickerBlock(block)) return formatColorPickerMarkdown(block);
  if (isIconPickerBlock(block)) return formatIconPickerMarkdown(block);
  if (isBgColorBlock(block)) return formatBgColorMarkdown(block);
  if (isBgImageBlock(block)) return formatBgImageMarkdown(block);
  if (isGradientBlock(block)) return formatGradientMarkdown(block);
  if (isFontPickerBlock(block)) return formatFontPickerMarkdown(block);
  if (isTextStylerBlock(block)) return formatTextStylerMarkdown(block);
  if (isTemplateCardBlock(block)) return formatTemplateCardMarkdown(block);
  if (isTemplateGalleryBlock(block)) return formatTemplateGalleryMarkdown(block);
  if (isMathBlock(block)) return formatMathMarkdown(block);
  if (isDetailsBlock(block)) return formatDetailsMarkdown(block);
  if (isTocBlock(block)) return formatTocMarkdown(block);
  return '';
}
