// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-presets.ts
 * 📂 المسار: packages/core/src/blocks/html-block-presets.ts
 * 🎯 الهدف الرئيسي: مولد الأقسام الجاهزة (Hero, Pricing, Testimonials,
 *    FAQ, CTA) — كل قسم يُنتج شجرة HtmlBlockNode كاملة جاهزة للإدراج.
 * 📋 المعايير: Zero-Dependency, Pure Light Theme defaults, Composable.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-presets.test.ts
 * 🏷️ المعرف: CORE-BLK-PRS-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Composite Pattern + Factory Functions + Typed Preset Options
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل preset يعيد شجرة جديدة (لا مشاركة مراجع).
 *    2. BlockId فريد لكل عقدة (mintBlockId لكل عنصر).
 *    3. الحقول المضافة: الغياب يعني "لا" (لا children فارغة).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من الخيارات.
 *    - معالجة الأخطاء بصمت مع تسجيلها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts
 *    - 📄 مرتبط مباشر: html-block-registry.ts, html-block-generator.ts
 *    - 🧪 اختبارات: html-block-presets.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createHeroPreset: إنشاء قسم Hero (#L75)
 *    - createPricingPreset: إنشاء جدول أسعار (#L110)
 *    - createTestimonialsPreset: إنشاء آراء العملاء (#L155)
 *    - createFaqPreset: إنشاء FAQ (#L195)
 *    - createCtaPreset: إنشاء CTA (#L235)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - كل preset يقبل خيارات مخصصة (ألوان، نصوص، صور).
 *    - القيم الافتراضية تستخدم ثيم Daylight الفاتح.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: إضافة المزيد من الأقسام (Gallery, Team, Stats).
 *    - 📖 مرجع تقني: Tailwind UI, Shadcn/ui.
 *    - 🎯 التحسينات المستقبلية: دعم RTL للعربية.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { HtmlBlockNode, TailwindClasses, mintBlockId, categoryFromType } from './html-block-types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helpers | دوال مساعدة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * إنشاء عقدة بلوك جديدة بمعرّف فريد.
 * // @function-index: #1/11 — createNode
 */
function createNode(
  type: HtmlBlockNode['type'],
  props: Record<string, unknown> = {},
  styles: TailwindClasses = {},
  children: HtmlBlockNode[] = [],
): HtmlBlockNode {
  const node: HtmlBlockNode = {
    id: mintBlockId(),
    type,
    category: categoryFromType(type),
    props,
    styles,
  };
  if (children.length > 0) {
    node.children = children;
  }
  return node;
}

/**
 * إنشاء عقدة نصية.
 * // @function-index: #2/11 — textNode
 */
function textNode(content: string, styles: TailwindClasses = {}): HtmlBlockNode {
  return createNode('text', { content }, styles);
}

/**
 * إنشاء عقدة عنوان.
 * // @function-index: #3/11 — headingNode
 */
function headingNode(
  content: string,
  level: 'h1' | 'h2' | 'h3' = 'h2',
  styles: TailwindClasses = {},
): HtmlBlockNode {
  return createNode('heading', { content, level }, styles);
}

/**
 * إنشاء عقدة زر.
 * // @function-index: #4/11 — buttonNode
 */
function buttonNode(
  label: string,
  variant: 'primary' | 'secondary' = 'primary',
  styles: TailwindClasses = {},
): HtmlBlockNode {
  return createNode('button', { label, variant }, styles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Hero Preset | قسم Hero
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * خيارات قسم Hero.
 * // @function-index: #5/11 — HeroPresetOptions
 */
export interface HeroPresetOptions {
  title?: string;
  subtitle?: string;
  primaryButton?: string;
  secondaryButton?: string;
  backgroundImage?: string;
}

/**
 * إنشاء قسم Hero جاهز.
 * // @function-index: #6/11 — createHeroPreset
 */
export function createHeroPreset(opts: HeroPresetOptions = {}): HtmlBlockNode {
  const title = opts.title ?? 'مرحباً بك في موقعنا';
  const subtitle = opts.subtitle ?? 'نص وصفي يشرح القيمة المقدمة';
  const primary = opts.primaryButton ?? 'ابدأ الآن';
  const secondary = opts.secondaryButton ?? 'تعرف أكثر';

  const buttons = createNode(
    'flexbox',
    { direction: 'row', gap: 4 },
    { layout: ['flex', 'flex-row', 'gap-4', 'justify-center'] },
    [
      buttonNode(primary, 'primary', {
        layout: ['px-6', 'py-3', 'rounded-lg'],
        colors: ['bg-blue-600', 'text-white'],
      }),
      buttonNode(secondary, 'secondary', {
        layout: ['px-6', 'py-3', 'rounded-lg'],
        borders: ['border', 'border-gray-300'],
      }),
    ],
  );

  return createNode(
    'hero',
    { title, subtitle },
    {
      layout: ['flex', 'flex-col', 'items-center', 'py-20', 'px-4'],
      typography: ['text-center'],
    },
    [
      headingNode(title, 'h1', {
        typography: ['text-5xl', 'font-bold', 'text-gray-900', 'mb-4'],
      }),
      textNode(subtitle, {
        typography: ['text-xl', 'text-gray-600', 'mb-8', 'max-w-2xl'],
      }),
      buttons,
    ],
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pricing Preset | جدول الأسعار
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * خطة أسعار.
 * // @function-index: #7/11 — PricingPlan
 */
export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

/**
 * خيارات جدول الأسعار.
 * // @function-index: #8/11 — PricingPresetOptions
 */
export interface PricingPresetOptions {
  plans?: PricingPlan[];
}

/**
 * إنشاء جدول أسعار جاهز.
 * // @function-index: #9/11 — createPricingPreset
 */
export function createPricingPreset(opts: PricingPresetOptions = {}): HtmlBlockNode {
  const plans: PricingPlan[] = opts.plans ?? [
    { name: 'أساسي', price: '$9', features: ['ميزة 1', 'ميزة 2'] },
    { name: 'احترافي', price: '$29', features: ['ميزة 1', 'ميزة 2', 'ميزة 3'], highlighted: true },
    { name: 'مؤسسي', price: '$99', features: ['ميزة 1', 'ميزة 2', 'ميزة 3', 'ميزة 4'] },
  ];

  const cards = plans.map((plan) => createPricingCard(plan));

  return createNode(
    'pricing',
    { columns: plans.length, gap: 8 },
    { layout: ['grid', 'grid-cols-3', 'gap-8', 'p-8'] },
    cards,
  );
}

/**
 * إنشاء بطاقة سعر واحدة.
 * // @function-index: #10/11 — createPricingCard
 */
function createPricingCard(plan: PricingPlan): HtmlBlockNode {
  const features = plan.features.map((f) =>
    textNode(`✓ ${f}`, { typography: ['text-gray-600', 'mb-2'] }),
  );

  const highlightStyles: TailwindClasses = plan.highlighted
    ? { borders: ['border-2', 'border-blue-600'], effects: ['shadow-lg'] }
    : { borders: ['border', 'border-gray-200'] };

  return createNode(
    'container',
    {},
    {
      layout: ['p-6', 'rounded-xl', 'flex', 'flex-col'],
      colors: ['bg-white'],
      ...highlightStyles,
    },
    [
      headingNode(plan.name, 'h3', {
        typography: ['text-xl', 'font-semibold', 'mb-2'],
      }),
      headingNode(plan.price, 'h2', {
        typography: ['text-4xl', 'font-bold', 'mb-4'],
        colors: ['text-blue-600'],
      }),
      ...features,
      buttonNode('اشترك الآن', plan.highlighted ? 'primary' : 'secondary', {
        layout: ['mt-auto', 'w-full', 'py-2'],
      }),
    ],
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Testimonials Preset | آراء العملاء
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * شهادة عميل.
 * // @function-index: #11/11 — Testimonial
 */
export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

/**
 * خيارات آراء العملاء.
 * // @function-index: #12/11 — TestimonialsPresetOptions
 */
export interface TestimonialsPresetOptions {
  testimonials?: Testimonial[];
}

/**
 * إنشاء بطاقة شهادة واحدة.
 * // @function-index: #13/11 — createTestimonialCard
 */
function createTestimonialCard(t: Testimonial): HtmlBlockNode {
  const children: HtmlBlockNode[] = [
    textNode(`"${t.quote}"`, {
      typography: ['text-gray-700', 'italic', 'mb-4', 'flex-1'],
    }),
    textNode(t.author, {
      typography: ['font-semibold', 'text-gray-900'],
    }),
  ];

  if (t.role) {
    children.push(
      textNode(t.role, {
        typography: ['text-sm', 'text-gray-500'],
      }),
    );
  }

  return createNode(
    'container',
    {},
    {
      layout: ['p-6', 'rounded-xl', 'flex', 'flex-col'],
      colors: ['bg-white'],
      effects: ['shadow-sm'],
    },
    children,
  );
}

/**
 * إنشاء قسم آراء العملاء.
 * // @function-index: #14/11 — createTestimonialsPreset
 */
export function createTestimonialsPreset(opts: TestimonialsPresetOptions = {}): HtmlBlockNode {
  const testimonials: Testimonial[] = opts.testimonials ?? [
    { quote: 'منتج رائع غيّر طريقة عملنا', author: 'أحمد محمد', role: 'مدير تنفيذي' },
    { quote: 'دعم فني ممتاز وسرعة في الاستجابة', author: 'سارة علي', role: 'مديرة تسويق' },
    { quote: 'أفضل استثمار قمنا به هذا العام', author: 'خالد يوسف', role: 'مؤسس' },
  ];

  const cards = testimonials.map((t) => createTestimonialCard(t));

  return createNode(
    'testimonial',
    {},
    {
      layout: ['py-16', 'px-4'],
      colors: ['bg-gray-50'],
    },
    [
      headingNode('ماذا يقول عملاؤنا', 'h2', {
        typography: ['text-3xl', 'font-bold', 'text-center', 'mb-12'],
      }),
      createNode(
        'grid',
        { columns: 3, gap: 8 },
        { layout: ['grid', 'grid-cols-3', 'gap-8', 'max-w-6xl', 'mx-auto'] },
        cards,
      ),
    ],
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ Preset | الأسئلة الشائعة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * عنصر FAQ.
 * // @function-index: #15/11 — FaqItem
 */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * خيارات FAQ.
 * // @function-index: #16/11 — FaqPresetOptions
 */
export interface FaqPresetOptions {
  items?: FaqItem[];
}

/**
 * إنشاء قسم الأسئلة الشائعة.
 * // @function-index: #17/11 — createFaqPreset
 */
export function createFaqPreset(opts: FaqPresetOptions = {}): HtmlBlockNode {
  const items: FaqItem[] = opts.items ?? [
    { question: 'كيف أبدأ؟', answer: 'سجل حساباً مجانياً وابدأ في دقائق.' },
    { question: 'هل هناك نسخة تجريبية؟', answer: 'نعم، 14 يوم مجاناً بدون بطاقة ائتمان.' },
    { question: 'كيف ألغي الاشتراك؟', answer: 'من إعدادات الحساب بضغطة واحدة.' },
  ];

  const accordionItems = items.map((item) =>
    createNode(
      'accordion',
      { items: [item.question] },
      { layout: ['border-b', 'border-gray-200'] },
      [
        textNode(item.answer, {
          typography: ['text-gray-600', 'py-3'],
        }),
      ],
    ),
  );

  return createNode('faq', {}, { layout: ['py-16', 'px-4', 'max-w-3xl', 'mx-auto'] }, [
    headingNode('الأسئلة الشائعة', 'h2', {
      typography: ['text-3xl', 'font-bold', 'text-center', 'mb-12'],
    }),
    createNode('container', {}, { layout: ['flex', 'flex-col'] }, accordionItems),
  ]);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CTA Preset | دعوة للعمل
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * خيارات CTA.
 * // @function-index: #18/11 — CtaPresetOptions
 */
export interface CtaPresetOptions {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

/**
 * إنشاء قسم دعوة للعمل.
 * // @function-index: #19/11 — createCtaPreset
 */
export function createCtaPreset(opts: CtaPresetOptions = {}): HtmlBlockNode {
  const title = opts.title ?? 'جاهز للبدء؟';
  const subtitle = opts.subtitle ?? 'انضم إلى آلاف العملاء الراضين اليوم';
  const buttonText = opts.buttonText ?? 'ابدأ مجاناً';

  return createNode(
    'cta',
    { title, subtitle },
    {
      layout: ['flex', 'flex-col', 'items-center', 'py-16', 'px-4'],
      colors: ['bg-blue-50'],
    },
    [
      headingNode(title, 'h2', {
        typography: ['text-4xl', 'font-bold', 'mb-4'],
      }),
      textNode(subtitle, {
        typography: ['text-xl', 'text-gray-600', 'mb-8'],
      }),
      buttonNode(buttonText, 'primary', {
        layout: ['px-8', 'py-4', 'rounded-lg', 'text-lg'],
        colors: ['bg-blue-600', 'text-white'],
      }),
    ],
  );
}
