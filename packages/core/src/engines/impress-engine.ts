// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [impress-engine.ts] محرك العروض التقديمية — Impress Engine
//
// هذا الملف يجيب: "كيف نبني عرضاً تقديمياً حياً؟"
//
// المبادئ المعمارية:
//
// 1. SLIDES ARE DOCUMENTS:
//    كل شريحة هي مستند مصغر — كتل + خلفية + ملاحظات.
//    هذا يسمح بإعادة استخدام WriterEngine داخل الشريحة.
//
// 2. LAYOUTS ARE TEMPLATES:
//    التخطيطات تُعرّف الكتل الافتراضية، لا تُخزن البيانات.
//    التغيير في التخطيط لا يغير الشرائح الموجودة.
//
// 3. THEMES ARE DERIVED:
//    السمات تُطبَّق على العرض، لا على البيانات.
//    تغيير السمة لا يُعدّل الشرائح — يغيّر العرض فقط.
//
// 4. TRANSITIONS ARE VIEW STATE:
//    الانتقالات تفضل العارض، لا المستند.
//    (من story.ts: "A VIEWER preference, never in the document")
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import type { WriterBlock } from './writer-engine';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. PRESENTATION MODEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Presentation {
  id: string;
  title: string;
  slides: SlideData[];
  theme: PresentationTheme;
  metadata: PresentationMetadata;
}

export interface SlideData {
  id: string;
  slideNumber: number;
  layout: SlideLayout;
  blocks: WriterBlock[];
  background: SlideBackground;
  notes: string;
  transition: SlideTransition;
}

export type SlideLayout =
  | 'title'
  | 'title-content'
  | 'two-column'
  | 'blank'
  | 'image-text'
  | 'section-header'
  | 'conclusion';

export interface SlideBackground {
  type: 'color' | 'gradient' | 'image' | 'none';
  value: string;
}

export interface SlideTransition {
  type: 'none' | 'fade' | 'slide' | 'zoom' | 'morph';
  duration: number; // ms
}

export interface PresentationTheme {
  name: string;
  nameAr: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  desc?: string;
}

export interface PresentationMetadata {
  author: string;
  createdAt: string;
  updatedAt: string;
  slideWidth: number;
  slideHeight: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. BUILT-IN THEMES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * الثيمات النهارية الستة المعتمدة — منقولة من DaylightThemes
 * (المصدر: محرر-html-الذكي-wysiwyg/src/core/DaylightThemes.ts — MIT)
 */
export const DEFAULT_THEMES: Record<string, PresentationTheme> = {
  'crisp-white': {
    name: 'Crisp Studio White',
    nameAr: 'أبيض الاستوديو النقي',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    desc: 'مظهر عصري فائق النقاء والوضوح للأعمال الدقيقة',
  },
  'nordic-sky': {
    name: 'Nordic Sky Light',
    nameAr: 'سماء الشمال الهادئة',
    primaryColor: '#0284C7',
    secondaryColor: '#0369A1',
    backgroundColor: '#F0F4F8',
    textColor: '#1E293B',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    desc: 'أزرق سماوي خفيف جداً يمنح شعوراً بالانتعاش والتركيز',
  },
  'soft-ivory': {
    name: 'Soft Ivory',
    nameAr: 'عاجي ناعم دافئ',
    primaryColor: '#D97706',
    secondaryColor: '#B45309',
    backgroundColor: '#FDFBF7',
    textColor: '#292524',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    desc: 'دفء الأوراق الكلاسيكية لتقليل الإجهاد في الجلسات الطويلة',
  },
  'warm-sand': {
    name: 'Warm Dune Sand',
    nameAr: 'رمال شاطئية دافئة',
    primaryColor: '#EA580C',
    secondaryColor: '#C2410C',
    backgroundColor: '#FBF8F2',
    textColor: '#44403C',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    desc: 'درجات رملية طبيعية ناعمة تريح شبكية العين أثناء النهار',
  },
  'fresh-linen': {
    name: 'Fresh Pure Linen',
    nameAr: 'كتان طبيعي منعش',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    backgroundColor: '#F5F7F6',
    textColor: '#132E22',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    desc: 'لمسات عشبية خافتة جداً مستوحاة من الطبيعة والكتان',
  },
  'mist-pearl': {
    name: 'Morning Mist Pearl',
    nameAr: 'لؤلؤي ضباب الصباح',
    primaryColor: '#7C3AED',
    secondaryColor: '#6D28D9',
    backgroundColor: '#F9F9FB',
    textColor: '#18181B',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    desc: 'تناغم رمادي لؤلؤي فائق الأناقة بتدرجات ضوئية صباحية',
  },
};

/** أسماء الثيمات المتاحة (للفحص الخارجي). */
export const THEME_KEYS = Object.keys(DEFAULT_THEMES);

/**
 * تدرجات خلفيات الشرائح الجاهزة — منقولة من GRADIENT_PRESETS
 * (المصدر: DaylightThemes.ts — MIT)
 */
export const SLIDE_GRADIENT_PRESETS: ReadonlyArray<{
  key: string;
  nameAr: string;
  css: string;
}> = [
  { key: 'pure-cloud', nameAr: 'سحاب ناصع', css: 'linear-gradient(180deg, #ffffff, #f8fafc)' },
  { key: 'morning-glow', nameAr: 'وهج الصباح المشرق', css: 'linear-gradient(135deg, #fffbeb, #fef3c7, #fef9c3)' },
  { key: 'serene-breeze', nameAr: 'نسيم أزرق هادئ', css: 'linear-gradient(120deg, #f0f9ff, #e0f2fe, #f8fafc)' },
  { key: 'blush-velvet', nameAr: 'مخمل وردي فاتح', css: 'linear-gradient(145deg, #fff1f2, #fdf2f8, #f5f3ff)' },
  { key: 'mint-meadow', nameAr: 'نعناع وريحان نقي', css: 'linear-gradient(160deg, #ecfdf5, #f0fdf4, #f8fafc)' },
  { key: 'soft-lilac', nameAr: 'ليلكي هادئ مريح', css: 'linear-gradient(135deg, #faf5ff, #f3e8ff, #f8fafc)' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. IMPRESS ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let slideSeq = 0;
function mintSlideId(): string {
  return `slide-${Date.now().toString(36)}-${(slideSeq++).toString(36)}`;
}

let presSeq = 0;
function mintPresId(): string {
  return `pres-${Date.now().toString(36)}-${(presSeq++).toString(36)}`;
}

export class ImpressEngine {
  // ── Factory ──

  /** إنشاء عرض تقديمي فارغ. */
  createPresentation(title: string, themeName: string = 'crisp-white'): Presentation {
    const theme = DEFAULT_THEMES[themeName] ?? DEFAULT_THEMES['crisp-white']!;

    return {
      id: mintPresId(),
      title,
      slides: [this.createDefaultSlide('title', 1)],
      theme,
      metadata: {
        author: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slideWidth: 1280,
        slideHeight: 720,
      },
    };
  }

  // ── Slide Operations ──

  /** إضافة شريحة. */
  addSlide(
    pres: Presentation,
    layout: SlideLayout,
    afterIndex?: number,
  ): Presentation {
    const idx = afterIndex !== undefined
      ? Math.max(0, Math.min(afterIndex + 1, pres.slides.length))
      : pres.slides.length;

    const slideNumber = idx + 1;
    const slide = this.createDefaultSlide(layout, slideNumber);

    const slides = [...pres.slides];
    slides.splice(idx, 0, slide);

    // إعادة ترقيم الشرائح
    const renumbered = slides.map((s, i) => ({ ...s, slideNumber: i + 1 }));

    return {
      ...pres,
      slides: renumbered,
      metadata: { ...pres.metadata, updatedAt: new Date().toISOString() },
    };
  }

  /** حذف شريحة. */
  removeSlide(pres: Presentation, slideId: string): Presentation {
    if (pres.slides.length <= 1) return pres; // لا يمكن حذف الشريحة الأخيرة

    const slides = pres.slides
      .filter(s => s.id !== slideId)
      .map((s, i) => ({ ...s, slideNumber: i + 1 }));

    return {
      ...pres,
      slides,
      metadata: { ...pres.metadata, updatedAt: new Date().toISOString() },
    };
  }

  /** نقل شريحة. */
  moveSlide(pres: Presentation, slideId: string, newIndex: number): Presentation {
    const slides = [...pres.slides];
    const currentIdx = slides.findIndex(s => s.id === slideId);
    if (currentIdx === -1) return pres;

    const [slide] = slides.splice(currentIdx, 1) as [SlideData];
    const clampedIdx = Math.max(0, Math.min(newIndex, slides.length));
    slides.splice(clampedIdx, 0, slide);

    const renumbered = slides.map((s, i) => ({ ...s, slideNumber: i + 1 }));

    return {
      ...pres,
      slides: renumbered,
      metadata: { ...pres.metadata, updatedAt: new Date().toISOString() },
    };
  }

  /** تكرار شريحة. */
  duplicateSlide(pres: Presentation, slideId: string): Presentation {
    const idx = pres.slides.findIndex(s => s.id === slideId);
    if (idx === -1) return pres;

    const original = pres.slides[idx];
    const copy: SlideData = {
      ...JSON.parse(JSON.stringify(original)),
      id: mintSlideId(),
    };

    const slides = [...pres.slides];
    slides.splice(idx + 1, 0, copy);

    const renumbered = slides.map((s, i) => ({ ...s, slideNumber: i + 1 }));

    return {
      ...pres,
      slides: renumbered,
      metadata: { ...pres.metadata, updatedAt: new Date().toISOString() },
    };
  }

  // ── Block Operations within Slides ──

  /** إضافة كتلة إلى شريحة. */
  addBlockToSlide(
    pres: Presentation,
    slideId: string,
    block: WriterBlock,
    position?: number,
  ): Presentation {
    return this.updateSlide(pres, slideId, (slide) => {
      const blocks = [...slide.blocks];
      const idx = position !== undefined
        ? Math.max(0, Math.min(position, blocks.length))
        : blocks.length;
      blocks.splice(idx, 0, block);
      return { ...slide, blocks };
    });
  }

  /** حذف كتلة من شريحة. */
  removeBlockFromSlide(
    pres: Presentation,
    slideId: string,
    blockId: string,
  ): Presentation {
    return this.updateSlide(pres, slideId, (slide) => ({
      ...slide,
      blocks: slide.blocks.filter(b => b.id !== blockId),
    }));
  }

  // ── Theme ──

  /** تطبيق سمة على العرض. */
  applyTheme(pres: Presentation, theme: PresentationTheme): Presentation {
    return {
      ...pres,
      theme,
      metadata: { ...pres.metadata, updatedAt: new Date().toISOString() },
    };
  }

  /** تعيين خلفية شريحة. */
  setSlideBackground(
    pres: Presentation,
    slideId: string,
    bg: SlideBackground,
  ): Presentation {
    return this.updateSlide(pres, slideId, (slide) => ({
      ...slide,
      background: bg,
    }));
  }

  /** تطبيق تدرج جاهز كخلفية شريحة (من SLIDE_GRADIENT_PRESETS). */
  setSlideGradientPreset(
    pres: Presentation,
    slideId: string,
    presetKey: string,
  ): Presentation {
    const preset = SLIDE_GRADIENT_PRESETS.find(p => p.key === presetKey);
    if (!preset) return pres;
    return this.setSlideBackground(pres, slideId, {
      type: 'gradient',
      value: preset.css,
    });
  }

  /** تعيين انتقال شريحة. */
  setSlideTransition(
    pres: Presentation,
    slideId: string,
    transition: SlideTransition,
  ): Presentation {
    const duration = Math.min(3000, Math.max(100, Math.round(transition.duration)));
    return this.updateSlide(pres, slideId, (slide) => ({
      ...slide,
      transition: { ...transition, duration },
    }));
  }

  // ── Layout ──

  /** تغيير تخطيط شريحة. */
  changeSlideLayout(
    pres: Presentation,
    slideId: string,
    layout: SlideLayout,
  ): Presentation {
    return this.updateSlide(pres, slideId, (slide) => {
      // الحفاظ على الكتل الموجودة — التخطيط يغير فقط الكتل الافتراضية
      return { ...slide, layout };
    });
  }

  /** الحصول على الكتل الافتراضية لتخطيط معين. */
  getLayoutBlocks(layout: SlideLayout): WriterBlock[] {
    const id = () => `blk-${Math.random().toString(36).slice(2, 8)}`;

    switch (layout) {
      case 'title':
        return [
          { id: id(), type: 'heading', content: 'عنوان العرض', attrs: { level: 1 } },
          { id: id(), type: 'paragraph', content: 'العنوان الفرعي' },
        ];
      case 'title-content':
        return [
          { id: id(), type: 'heading', content: 'العنوان', attrs: { level: 2 } },
          { id: id(), type: 'paragraph', content: '' },
        ];
      case 'section-header':
        return [
          { id: id(), type: 'heading', content: 'قسم جديد', attrs: { level: 1 } },
        ];
      case 'conclusion':
        return [
          { id: id(), type: 'heading', content: 'الخلاصة', attrs: { level: 2 } },
          { id: id(), type: 'bulletList', content: '', children: [
            { id: id(), type: 'bulletList', content: 'النقطة الأولى' },
            { id: id(), type: 'bulletList', content: 'النقطة الثانية' },
          ]},
        ];
      default:
        return [];
    }
  }

  // ── Presentation Flow ──

  /** إعادة ترتيب الشرائح. */
  reorderSlides(pres: Presentation, fromIndex: number, toIndex: number): Presentation {
    const slides = [...pres.slides];
    if (fromIndex < 0 || fromIndex >= slides.length) return pres;
    if (toIndex < 0 || toIndex >= slides.length) return pres;

    const [slide] = slides.splice(fromIndex, 1) as [SlideData];
    slides.splice(toIndex, 0, slide);

    const renumbered = slides.map((s, i) => ({ ...s, slideNumber: i + 1 }));

    return {
      ...pres,
      slides: renumbered,
      metadata: { ...pres.metadata, updatedAt: new Date().toISOString() },
    };
  }

  /** عدد الشرائح. */
  getTotalSlides(pres: Presentation): number {
    return pres.slides.length;
  }

  /** تعيين ملاحظات شريحة. */
  setNotes(pres: Presentation, slideId: string, notes: string): Presentation {
    return this.updateSlide(pres, slideId, (slide) => ({ ...slide, notes }));
  }

  // ── Templates ──

  /** إنشاء عرض من قالب — يرفض خطأً صريحاً للاسم غير المعروف. */
  createFromTemplate(templateName: string): Presentation {
    const recipes: Record<string, { title: string; theme: string; layouts: SlideLayout[] }> = {
      'business-pitch': {
        title: 'عرض تقديمي تجاري',
        theme: 'crisp-white',
        layouts: ['title', 'title-content', 'two-column', 'conclusion'],
      },
      'academic-lecture': {
        title: 'محاضرة أكاديمية',
        theme: 'soft-ivory',
        layouts: ['title', 'section-header', 'title-content', 'title-content', 'image-text', 'conclusion'],
      },
      'product-launch': {
        title: 'إطلاق منتج',
        theme: 'nordic-sky',
        layouts: ['title', 'image-text', 'title-content', 'two-column', 'conclusion'],
      },
      'quarterly-report': {
        title: 'تقرير ربع سنوي',
        theme: 'mist-pearl',
        layouts: ['title', 'title-content', 'two-column', 'two-column', 'conclusion'],
      },
      'nature-portfolio': {
        title: 'ملف أعمال',
        theme: 'fresh-linen',
        layouts: ['title', 'image-text', 'image-text', 'blank', 'conclusion'],
      },
      'warm-workshop': {
        title: 'ورشة عمل',
        theme: 'warm-sand',
        layouts: ['title', 'section-header', 'title-content', 'section-header', 'title-content', 'conclusion'],
      },
    };

    const recipe = recipes[templateName];
    if (!recipe) {
      throw new Error(
        `Unknown template "${templateName}". Available: ${Object.keys(recipes).join(', ')}`,
      );
    }

    const pres = this.createPresentation(recipe.title, recipe.theme);
    const slides = recipe.layouts.map((layout, i) => this.createDefaultSlide(layout, i + 1));
    return { ...pres, slides };
  }

  /** القوالب المتاحة. */
  getAvailableTemplates(): string[] {
    return [
      'business-pitch',
      'academic-lecture',
      'product-launch',
      'quarterly-report',
      'nature-portfolio',
      'warm-workshop',
    ];
  }

  // ── Private Helpers ──

  private createDefaultSlide(layout: SlideLayout, slideNumber: number): SlideData {
    return {
      id: mintSlideId(),
      slideNumber,
      layout,
      blocks: this.getLayoutBlocks(layout),
      background: { type: 'none', value: '' },
      notes: '',
      transition: { type: 'none', duration: 300 },
    };
  }

  private updateSlide(
    pres: Presentation,
    slideId: string,
    updater: (slide: SlideData) => SlideData,
  ): Presentation {
    return {
      ...pres,
      slides: pres.slides.map(s => s.id === slideId ? updater(s) : s),
      metadata: { ...pres.metadata, updatedAt: new Date().toISOString() },
    };
  }
}