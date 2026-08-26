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
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
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

export const DEFAULT_THEMES: Record<string, PresentationTheme> = {
  'crisp-white': {
    name: 'Crisp White',
    primaryColor: '#2563EB',
    secondaryColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
  },
  'nordic-sky': {
    name: 'Nordic Sky',
    primaryColor: '#0284C7',
    secondaryColor: '#0369A1',
    backgroundColor: '#F0F4F8',
    textColor: '#102A43',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
  },
  'warm-sand': {
    name: 'Warm Sand',
    primaryColor: '#C2410C',
    secondaryColor: '#9A3412',
    backgroundColor: '#FBF9F5',
    textColor: '#38332E',
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
  },
};

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
    const theme = DEFAULT_THEMES[themeName] ?? DEFAULT_THEMES['crisp-white'] as PresentationTheme;

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

  /** إنشاء عرض من قالب. */
  createFromTemplate(templateName: string): Presentation {
    switch (templateName) {
      case 'business-pitch': {
        const pres = this.createPresentation('عرض تقديمي', 'crisp-white');
        const slides: SlideData[] = [
          this.createDefaultSlide('title', 1),
          this.createDefaultSlide('title-content', 2),
          this.createDefaultSlide('two-column', 3),
          this.createDefaultSlide('conclusion', 4),
        ];
        return { ...pres, slides };
      }
      default:
        return this.createPresentation('عرض تقديمي');
    }
  }

  /** القوالب المتاحة. */
  getAvailableTemplates(): string[] {
    return ['business-pitch', 'academic-lecture', 'product-launch'];
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