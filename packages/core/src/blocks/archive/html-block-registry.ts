// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-registry.ts
 * 📂 المسار: packages/core/src/blocks/html-block-registry.ts
 * 🎯 الهدف الرئيسي: تسجيل وإدارة تعريفات كتل HTML الموحدة بشكل هرمي،
 *    مع توفير القيم الافتراضية والتصنيفات وفئات Tailwind الفاتحة النقية.
 * 📋 المعايير: Zero-Dependency, Pure Light Theme, Pure Typed Registry, <50 lines/fn.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-registry.test.ts
 * 🏷️ المعرف: CORE-BLK-REG-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hierarchical Registry Pattern + Preset Factories + Static Inventory
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بالثيم الفاتح النقي في فئات defaultTailwind.
 *    2. كل دالة يجب ألا تتجاوز 50 سطراً.
 *    3. تفادي أي تبعيات خارجية في النواة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية السجل ضد تكرار التعريفات غير الصالحة.
 *    - Fallbacks آمنة عند البحث عن كتل غير مسجلة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts
 *    - 📄 مرتبط مباشر: html-block-generator.ts
 *    - 🧪 اختبارات: html-block-registry.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - register: تسجيل تعريف كتلة جديدة (#L110)
 *    - get: استرجاع تعريف كتلة (#L122)
 *    - getByCategory: تصفية الكتل حسب الفئة (#L132)
 *    - getAll: استرجاع جميع الكتل المسجلة (#L142)
 *    - instantiateNode: إنشاء عقدة جديدة من التعريف (#L152)
 *    - initialize: تهيئة السجل بكافة الأدوات (#L175)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم تقسيم تهيئة الأدوات إلى دوال مساعدة لضمان عدم تجاوز 50 سطراً لكل دالة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  BlockCategory,
  BlockDefinition,
  BlockType,
  HtmlBlockNode,
  mintBlockId,
} from './html-block-types';

/**
 * سجل كتل HTML الموحد
 * // @function-index: #1/6 — HtmlBlockRegistry
 */
export class HtmlBlockRegistry {
  private static blocks = new Map<string, BlockDefinition>();
  private static initialized = false;

  /**
   * تسجيل تعريف كتلة جديدة
   * // @function-index: #2/6 — register
   */
  static register(block: BlockDefinition): void {
    if (!block || !block.type) {
      console.error('[HtmlBlockRegistry] Invalid block registration attempt');
      return;
    }
    this.blocks.set(block.type, block);
  }

  /**
   * استرجاع تعريف كتلة بالنوع
   * // @function-index: #3/6 — get
   */
  static get(type: BlockType | string): BlockDefinition | undefined {
    this.ensureInitialized();
    return this.blocks.get(type);
  }

  /**
   * استرجاع الكتل حسب الفئة
   * // @function-index: #4/6 — getByCategory
   */
  static getByCategory(category: BlockCategory): BlockDefinition[] {
    this.ensureInitialized();
    return Array.from(this.blocks.values()).filter((b) => b.category === category);
  }

  /**
   * استرجاع جميع الكتل المسجلة
   * // @function-index: #5/6 — getAll
   */
  static getAll(): BlockDefinition[] {
    this.ensureInitialized();
    return Array.from(this.blocks.values());
  }

  /**
   * إنشاء عقدة جديدة كاملة جاهزة من تعريف البلوك
   * // @function-index: #6/6 — instantiateNode
   */
  static instantiateNode(
    type: BlockType,
    customProps: Record<string, unknown> = {},
    customChildren?: HtmlBlockNode[],
  ): HtmlBlockNode {
    const def = this.get(type);
    const id = mintBlockId();

    if (!def) {
      return {
        id,
        type,
        category: 'primitive',
        props: { ...customProps },
        children: customChildren,
      };
    }

    const node: HtmlBlockNode = {
      id,
      type: def.type,
      category: def.category,
      props: { ...def.defaultProps, ...customProps },
      styles: { ...def.defaultTailwind },
    };

    if (def.acceptsChildren) {
      node.children = customChildren || [];
    }

    return node;
  }

  /**
   * ضمان تهيئة السجل
   */
  private static ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }

  /**
   * تهيئة السجل الشامل
   */
  static initialize(): void {
    if (this.initialized) return;
    this.registerPrimitives();
    this.registerLayouts();
    this.registerDataBlocks();
    this.registerMediaBlocks();
    this.registerSectionBlocks();
    this.initialized = true;
  }

  /**
   * تسجيل الكتل الأساسية (Primitives)
   */
  private static registerPrimitives(): void {
    this.register({
      type: 'text',
      category: 'primitive',
      label: 'نص عادي (Text)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>',
      acceptsChildren: false,
      defaultProps: { text: 'نص توضيحي بسيط وأنيق' },
      defaultTailwind: { typography: ['text-sm', 'text-slate-600', 'leading-relaxed'] },
      index: '#1/12',
    });

    this.register({
      type: 'heading',
      category: 'primitive',
      label: 'عنوان (Heading)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h12M6 4v16M18 4v16"/></svg>',
      acceptsChildren: false,
      defaultProps: { text: 'عنوان بارز ومميز', level: 2 },
      defaultTailwind: { typography: ['text-xl', 'font-bold', 'text-slate-900', 'tracking-tight'] },
      index: '#2/12',
    });

    this.register({
      type: 'button',
      category: 'primitive',
      label: 'زر تفاعلي (Button)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="4"/><path d="M9 12h6"/></svg>',
      acceptsChildren: false,
      defaultProps: { text: 'اضغط هنا', variant: 'primary' },
      defaultTailwind: {
        spacing: ['px-4', 'py-2'],
        colors: ['bg-blue-600', 'hover:bg-blue-700', 'text-white'],
        typography: ['text-sm', 'font-medium'],
        borders: ['rounded-lg'],
        effects: ['shadow-sm', 'transition-colors', 'cursor-pointer'],
      },
      index: '#3/12',
    });

    this.register({
      type: 'input',
      category: 'primitive',
      label: 'حقل إدخال (Input)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="3"/><line x1="7" y1="12" x2="11" y2="12"/></svg>',
      acceptsChildren: false,
      defaultProps: { placeholder: 'أدخل البيانات المطلوبة...', type: 'text' },
      defaultTailwind: {
        sizing: ['w-full'],
        spacing: ['px-3', 'py-2'],
        colors: ['bg-white', 'text-slate-800'],
        typography: ['text-sm'],
        borders: ['border', 'border-slate-300', 'rounded-lg'],
        effects: ['focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'],
      },
      index: '#4/12',
    });

    this.register({
      type: 'textarea',
      category: 'primitive',
      label: 'نص متعدد الأسطر (Textarea)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>',
      acceptsChildren: false,
      defaultProps: { placeholder: 'اكتب ملاحظاتك أو التفاصيل هنا...', rows: 4 },
      defaultTailwind: {
        sizing: ['w-full', 'min-h-[90px]'],
        spacing: ['p-3'],
        colors: ['bg-white', 'text-slate-800'],
        typography: ['text-sm'],
        borders: ['border', 'border-slate-300', 'rounded-lg'],
        effects: ['focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'],
      },
      index: '#5/12',
    });

    this.register({
      type: 'select',
      category: 'primitive',
      label: 'قائمة منسدلة (Select)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="3"/><polyline points="8 10 12 14 16 10"/></svg>',
      acceptsChildren: false,
      defaultProps: { options: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث'] },
      defaultTailwind: {
        sizing: ['w-full'],
        spacing: ['px-3', 'py-2'],
        colors: ['bg-white', 'text-slate-800'],
        typography: ['text-sm'],
        borders: ['border', 'border-slate-300', 'rounded-lg'],
        effects: ['cursor-pointer'],
      },
      index: '#6/12',
    });

    this.register({
      type: 'checkbox',
      category: 'primitive',
      label: 'مربع اختيار (Checkbox)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      acceptsChildren: false,
      defaultProps: { label: 'الموافقة على الشروط والأحكام', checked: false },
      defaultTailwind: {
        layout: ['flex', 'items-center'],
        spacing: ['gap-2'],
        typography: ['text-sm', 'text-slate-700'],
        effects: ['cursor-pointer'],
      },
      index: '#7/12',
    });

    this.register({
      type: 'switch',
      category: 'primitive',
      label: 'مفتاح تبديل (Switch)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="6"/><circle cx="8" cy="12" r="4"/></svg>',
      acceptsChildren: false,
      defaultProps: { label: 'تفعيل الميزة', enabled: true },
      defaultTailwind: {
        layout: ['flex', 'items-center'],
        spacing: ['gap-3'],
        typography: ['text-sm', 'font-medium', 'text-slate-800'],
      },
      index: '#8/12',
    });

    this.register({
      type: 'slider',
      category: 'primitive',
      label: 'شريط تمرير (Slider)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/><circle cx="12" cy="12" r="3"/></svg>',
      acceptsChildren: false,
      defaultProps: { min: 0, max: 100, value: 50 },
      defaultTailwind: { sizing: ['w-full'], effects: ['cursor-pointer'] },
      index: '#9/12',
    });

    this.register({
      type: 'badge',
      category: 'primitive',
      label: 'شارة مميزة (Badge)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      acceptsChildren: false,
      defaultProps: { text: 'شارة جديدة' },
      defaultTailwind: {
        spacing: ['px-2.5', 'py-0.5'],
        colors: ['bg-blue-50', 'text-blue-700'],
        typography: ['text-xs', 'font-semibold'],
        borders: ['rounded-full', 'border', 'border-blue-200'],
      },
      index: '#10/12',
    });

    this.register({
      type: 'image',
      category: 'primitive',
      label: 'صورة (Image)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
      acceptsChildren: false,
      defaultProps: {
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        alt: 'صورة توضيحية',
      },
      defaultTailwind: {
        sizing: ['w-full', 'h-48'],
        borders: ['rounded-xl', 'border', 'border-slate-200'],
        effects: ['object-cover'],
      },
      index: '#11/12',
    });

    this.register({
      type: 'link',
      category: 'primitive',
      label: 'رابط تشعبي (Link)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      acceptsChildren: false,
      defaultProps: { text: 'زيارة الرابط', href: '#' },
      defaultTailwind: {
        typography: ['text-sm', 'font-medium', 'text-blue-600', 'hover:underline'],
        effects: ['cursor-pointer'],
      },
      index: '#12/12',
    });
  }

  /**
   * تسجيل كتل التخطيط والحاويات (Layouts)
   */
  private static registerLayouts(): void {
    this.register({
      type: 'container',
      category: 'layout',
      label: 'حاوية رئيسية (Container)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
      acceptsChildren: true,
      defaultProps: { tag: 'div' },
      defaultTailwind: {
        spacing: ['p-6', 'space-y-4'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-2xl'],
        effects: ['shadow-xs'],
      },
      index: '#1/7',
    });

    this.register({
      type: 'card',
      category: 'layout',
      label: 'بطاقة محتوى (Card)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="3" y1="9" x2="21" y2="9"/></svg>',
      acceptsChildren: true,
      defaultProps: {},
      defaultTailwind: {
        spacing: ['p-5', 'space-y-3'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
        effects: ['shadow-sm'],
      },
      index: '#2/7',
    });

    this.register({
      type: 'grid',
      category: 'layout',
      label: 'شبكة أعمدة (Grid)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      acceptsChildren: true,
      defaultProps: { columns: 3, gap: 4 },
      defaultTailwind: {
        layout: ['grid', 'grid-cols-1', 'md:grid-cols-3'],
        spacing: ['gap-4', 'p-4'],
        colors: ['bg-slate-50/50'],
        borders: ['rounded-xl', 'border', 'border-dashed', 'border-slate-200'],
      },
      index: '#3/7',
    });

    this.register({
      type: 'flexbox',
      category: 'layout',
      label: 'توزيع مرن (Flexbox)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="6" height="16" rx="2"/><rect x="14" y="4" width="6" height="16" rx="2"/></svg>',
      acceptsChildren: true,
      defaultProps: { direction: 'row', justify: 'between', align: 'center' },
      defaultTailwind: {
        layout: ['flex', 'items-center', 'justify-between'],
        spacing: ['gap-3', 'p-3'],
        colors: ['bg-white'],
        borders: ['rounded-lg', 'border', 'border-slate-200'],
      },
      index: '#4/7',
    });

    this.register({
      type: 'tabs',
      category: 'layout',
      label: 'ألسنة تبويب (Tabs)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>',
      acceptsChildren: true,
      defaultProps: { tabs: ['التبويب 1', 'التبويب 2', 'التبويب 3'], activeIndex: 0 },
      defaultTailwind: {
        spacing: ['p-4', 'space-y-3'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
      },
      index: '#5/7',
    });

    this.register({
      type: 'accordion',
      category: 'layout',
      label: 'أكورديون قابل للطي (Accordion)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
      acceptsChildren: true,
      defaultProps: { title: 'عنوان العنصر القابل للطي', isOpen: true },
      defaultTailwind: {
        spacing: ['p-4', 'space-y-2'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
      },
      index: '#6/7',
    });

    this.register({
      type: 'modal',
      category: 'layout',
      label: 'نافذة منبثقة (Modal/Dialog)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      acceptsChildren: true,
      defaultProps: { title: 'عنوان النافذة التفاعلية' },
      defaultTailwind: {
        spacing: ['p-6', 'space-y-4'],
        colors: ['bg-white'],
        borders: ['rounded-2xl', 'border', 'border-slate-200'],
        effects: ['shadow-lg'],
      },
      index: '#7/7',
    });
  }

  /**
   * تسجيل كتل البيانات (Data)
   */
  private static registerDataBlocks(): void {
    this.register({
      type: 'data-table',
      category: 'data',
      label: 'جدول بيانات (Data Table)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
      acceptsChildren: false,
      defaultProps: {
        columns: ['المعرف', 'الاسم', 'الحالة', 'الإجراء'],
        rows: [
          ['#001', 'مشروع ألفا', 'مكتمل', 'تعديل'],
          ['#002', 'مشروع بيتا', 'قيد التنفيذ', 'تعديل'],
        ],
      },
      defaultTailwind: {
        sizing: ['w-full'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
        effects: ['shadow-xs'],
      },
      index: '#1/3',
    });

    this.register({
      type: 'stat-card',
      category: 'data',
      label: 'بطاقة مؤشر (Stat Card)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      acceptsChildren: false,
      defaultProps: { title: 'إجمالي المبيعات', value: '45,280 $', change: '+12.5%' },
      defaultTailwind: {
        spacing: ['p-5', 'space-y-1'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
        effects: ['shadow-sm'],
      },
      index: '#2/3',
    });

    this.register({
      type: 'pagination',
      category: 'data',
      label: 'ترقيم صفحات (Pagination)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/><polyline points="19 18 13 12 19 6"/></svg>',
      acceptsChildren: false,
      defaultProps: { currentPage: 1, totalPages: 5 },
      defaultTailwind: {
        layout: ['flex', 'items-center', 'justify-center'],
        spacing: ['gap-2', 'py-3'],
      },
      index: '#3/3',
    });
  }

  /**
   * تسجيل كتل الوسائط (Media)
   */
  private static registerMediaBlocks(): void {
    this.register({
      type: 'video',
      category: 'media',
      label: 'مقطع فيديو (Video)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
      acceptsChildren: false,
      defaultProps: { src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      defaultTailwind: {
        sizing: ['w-full', 'aspect-video'],
        borders: ['rounded-xl', 'border', 'border-slate-200'],
      },
      index: '#1/4',
    });

    this.register({
      type: 'audio',
      category: 'media',
      label: 'مشغل صوتي (Audio)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
      acceptsChildren: false,
      defaultProps: { src: '' },
      defaultTailwind: {
        sizing: ['w-full'],
        spacing: ['p-3'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
      },
      index: '#2/4',
    });

    this.register({
      type: 'avatar',
      category: 'media',
      label: 'صورة شخصية (Avatar)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      acceptsChildren: false,
      defaultProps: {
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        name: 'مستخدم النظام',
      },
      defaultTailwind: {
        sizing: ['w-12', 'h-12'],
        borders: ['rounded-full', 'border-2', 'border-blue-500'],
        effects: ['object-cover'],
      },
      index: '#3/4',
    });

    this.register({
      type: 'icon',
      category: 'media',
      label: 'أيقونة متجهة (Icon)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      acceptsChildren: false,
      defaultProps: { name: 'sparkles' },
      defaultTailwind: {
        sizing: ['w-6', 'h-6'],
        colors: ['text-blue-600'],
      },
      index: '#4/4',
    });
  }

  /**
   * تسجيل الأقسام الجاهزة (Sections)
   */
  private static registerSectionBlocks(): void {
    this.register({
      type: 'hero',
      category: 'section',
      label: 'قسم رئيسي (Hero Section)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><line x1="12" y1="8" x2="12" y2="16"/></svg>',
      acceptsChildren: true,
      defaultProps: {
        title: 'ابنِ واجهاتك بأقصى سرعة وأعلى جودة',
        subtitle: 'المحرر الموحد للواجهات والمكونات التفاعلية بصيغ HTML و TSX الخالصة',
      },
      defaultTailwind: {
        spacing: ['py-12', 'px-8', 'text-center', 'space-y-4'],
        colors: ['bg-slate-50'],
        borders: ['border', 'border-slate-200', 'rounded-2xl'],
        effects: ['shadow-sm'],
      },
      index: '#1/5',
    });

    this.register({
      type: 'pricing',
      category: 'section',
      label: 'جدول أسعار (Pricing Section)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      acceptsChildren: true,
      defaultProps: { title: 'خطط وأسعار مناسبة للجميع' },
      defaultTailwind: {
        spacing: ['p-8', 'space-y-6'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-2xl'],
      },
      index: '#2/5',
    });

    this.register({
      type: 'testimonial',
      category: 'section',
      label: 'آراء وتقييمات (Testimonials)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      acceptsChildren: true,
      defaultProps: {
        quote: 'أفضل أداة بناء وتصميم واجهات استخدمتها على الإطلاق، السرعة والدقة لا مثيل لهما.',
        author: 'م. أحمد الخبير',
        role: 'كبير مهندسي البرمجيات',
      },
      defaultTailwind: {
        spacing: ['p-6', 'space-y-3'],
        colors: ['bg-slate-50'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
      },
      index: '#3/5',
    });

    this.register({
      type: 'faq',
      category: 'section',
      label: 'الأسئلة الشائعة (FAQ)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      acceptsChildren: true,
      defaultProps: { title: 'الأسئلة الأكثر تكراراً' },
      defaultTailwind: {
        spacing: ['p-6', 'space-y-4'],
        colors: ['bg-white'],
        borders: ['border', 'border-slate-200', 'rounded-xl'],
      },
      index: '#4/5',
    });

    this.register({
      type: 'cta',
      category: 'section',
      label: 'دعوة للإجراء (CTA Banner)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      acceptsChildren: true,
      defaultProps: {
        title: 'ابدأ تجربتك المجانية اليوم',
        btnText: 'انضم إلينا الآن',
      },
      defaultTailwind: {
        spacing: ['p-8', 'text-center', 'space-y-4'],
        colors: ['bg-blue-50'],
        borders: ['border', 'border-blue-200', 'rounded-2xl'],
      },
      index: '#5/5',
    });
  }
}

// تهيئة تلقائية
HtmlBlockRegistry.initialize();
