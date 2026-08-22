// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-types.ts
 * 📂 المسار: packages/core/src/blocks/html-block-types.ts
 * 🎯 الهدف الرئيسي: تعريف الأنواع الأساسية لنظام بلوكات HTML الموحد،
 *    الذي يوحّد أدوات Canva و PDF و Rich Text و UI Designer في كتلة واحدة.
 * 📋 المعايير: Zero-Dependency, Typed Props, Hierarchical Classification.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-types.test.ts
 * 🏷️ المعرف: CORE-BLK-TYP-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Discriminated Union + Hierarchical Registry + Tailwind Typed Classes
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. BlockId لا يُعاد أبداً (مثل RID في rowcol.ts).
 *    2. الحقول المضافة (children, styles) الغياب يعني "لا".
 *    3. لا eval أو Function constructor في أي مكان.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من صحة العقد.
 *    - mintBlockId يضمن التفرد عبر timestamp + sequence.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: لا شيء (Zero-Dependency)
 *    - 📄 مرتبط مباشر: html-block-registry.ts, html-block-generator.ts
 *    - 🧪 اختبارات: html-block-types.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - mintBlockId: توليد معرف فريد (#L92)
 *    - isValidBlockNode: Type Guard للتحقق من العقد (#L102)
 *    - categoryFromType: استخراج الفئة من النوع (#L118)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم تصميم البنية لتكون قابلة للتوسع دون كسر التوافق.
 *    - BlockType مقسمة إلى 5 فئات هرمية لتسهيل التصنيف.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل معروفة حالياً.
 *    - 📖 مرجع تقني: rowcol.ts (نمط RID), story.ts (الحقول المضافة).
 *    - 🎯 التحسينات المستقبلية: دعم Custom Elements.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// التصنيف الهرمي | Hierarchical Classification
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * فئة البلوك — التصنيف الأعلى مستوى.
 * // @function-index: #1/5 — BlockCategory
 */
export type BlockCategory =
  | 'primitive'  // عناصر أساسية لا تقبل أطفالاً
  | 'layout'     // حاويات تنظم عرض الأطفال
  | 'data'       // عرض البيانات والجداول
  | 'media'      // الوسائط المتعددة
  | 'section';   // أقسام جاهزة مركبة

/**
 * أنواع البلوكات البدائية (Primitive).
 * // @function-index: #2/7 — PrimitiveType
 */
export type PrimitiveType =
  | 'text'
  | 'heading'
  | 'button'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio-group'
  | 'switch'
  | 'slider'
  | 'color-picker'
  | 'date-picker'
  | 'tooltip'
  | 'popover'
  | 'badge'
  | 'image'
  | 'link';

/**
 * أنواع البلوكات التخطيطية (Layout).
 * // @function-index: #3/5 — LayoutType
 */
export type LayoutType =
  | 'container'
  | 'grid'
  | 'flexbox'
  | 'card'
  | 'tabs'
  | 'accordion'
  | 'modal';

/**
 * أنواع بلوكات البيانات (Data).
 * // @function-index: #4/3 — DataType
 */
export type DataType =
  | 'data-table'
  | 'stat-card'
  | 'pagination';

/**
 * أنواع بلوكات الوسائط (Media).
 * // @function-index: #5/3 — MediaType
 */
export type MediaType =
  | 'video'
  | 'audio'
  | 'avatar'
  | 'icon';

/**
 * أنواع الأقسام الجاهزة (Section).
 * // @function-index: #6/2 — SectionType
 */
export type SectionType =
  | 'hero'
  | 'pricing'
  | 'testimonial'
  | 'faq'
  | 'cta';

/**
 * النوع الموحد — اتحاد كل الأنواع.
 * // @function-index: #7/1 — BlockType
 */
export type BlockType =
  | PrimitiveType
  | LayoutType
  | DataType
  | MediaType
  | SectionType;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// فئات Tailwind | Tailwind Classes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * فئات Tailwind المسموحة — قائمة بيضاء صارمة.
 * // @function-index: #8/1 — TailwindClasses
 */
export type TailwindClasses = {
  layout?: string[];      // grid, flex, block, etc.
  spacing?: string[];     // p-4, m-2, gap-3, etc.
  sizing?: string[];      // w-full, h-screen, etc.
  typography?: string[];  // text-lg, font-bold, etc.
  colors?: string[];      // bg-white, text-gray-900, etc.
  borders?: string[];     // border, rounded-lg, etc.
  effects?: string[];     // shadow, opacity, etc.
  responsive?: string[];  // sm:, md:, lg:, etc.
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// عقدة البلوك | Block Node
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * عقدة البلوك — الوحدة الأساسية في النظام.
 * 
 * ⚠️ الحقول المضافة:
 * - children: موجودة فقط للعناصر الحاوية (Layout, Section).
 * - styles: موجودة فقط عند وجود فئات Tailwind مخصصة.
 * - data: موجودة فقط عند وجود بيانات مخصصة.
 * 
 * // @function-index: #9/1 — HtmlBlockNode
 */
export interface HtmlBlockNode {
  /** معرف فريد — لا يُعاد أبداً (مثل RID) */
  id: string;
  /** نوع البلوك */
  type: BlockType;
  /** الفئة (مشتقة من النوع، مخزنة للأداء) */
  category: BlockCategory;
  /** خصائص خاصة بالنوع */
  props: Record<string, unknown>;
  /** فئات Tailwind — additive */
  styles?: TailwindClasses;
  /** الأطفال — additive، موجودة فقط للحاويات */
  children?: HtmlBlockNode[];
  /** بيانات مخصصة — additive */
  data?: Record<string, string>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// تعريف البلوك | Block Definition
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تعريف البلوك — وصف الأداة في السجل.
 * // @function-index: #10/1 — BlockDefinition
 */
export interface BlockDefinition {
  /** نوع البلوك */
  type: BlockType;
  /** الفئة */
  category: BlockCategory;
  /** التسمية الظاهرة */
  label: string;
  /** أيقونة SVG مضمنة */
  icon: string;
  /** هل يقبل أطفالاً؟ */
  acceptsChildren: boolean;
  /** الخصائص الافتراضية */
  defaultProps: Record<string, unknown>;
  /** فئات Tailwind الافتراضية */
  defaultTailwind: TailwindClasses;
  /** رقم الفهرس التسلسلي (#N/M) */
  index: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// دوال مساعدة | Helper Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let blockSeq = 0;

/**
 * توليد معرف فريد للبلوك.
 * 
 * ⚠️ BlockId لا يُعاد أبداً (مثل RID في rowcol.ts).
 * ⚠️ يستخدم timestamp + sequence + random لضمان التفرد.
 * 
 * // @function-index: #11/2 — mintBlockId
 */
export function mintBlockId(): string {
  const ts = Date.now().toString(36);
  const seq = (blockSeq++).toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `blk-${ts}-${seq}-${rand}`;
}

/**
 * Type Guard للتحقق من صحة عقدة البلوك.
 * 
 * ⚠️ يتحقق من:
 * - وجود id و type و category
 * - صحة نوع props
 * - صحة children إن وجدت
 * 
 * // @function-index: #12/2 — isValidBlockNode
 */
export function isValidBlockNode(node: unknown): node is HtmlBlockNode {
  if (!node || typeof node !== 'object') return false;
  const n = node as HtmlBlockNode;
  if (typeof n.id !== 'string' || !n.id) return false;
  if (typeof n.type !== 'string' || !n.type) return false;
  if (typeof n.category !== 'string' || !n.category) return false;
  if (!n.props || typeof n.props !== 'object') return false;
  if (n.children && !Array.isArray(n.children)) return false;
  return true;
}

/**
 * استخراج الفئة من النوع.
 * 
 * // @function-index: #13/2 — categoryFromType
 */
export function categoryFromType(type: BlockType): BlockCategory {
  const primitives: PrimitiveType[] = [
    'text', 'heading', 'button', 'input', 'textarea', 'select', 'checkbox', 'radio-group', 'switch', 'slider', 'color-picker', 'date-picker', 'tooltip', 'popover', 'badge', 'image', 'link'
  ];
  const layouts: LayoutType[] = [
    'container', 'grid', 'flexbox', 'card', 'tabs', 'accordion', 'modal'
  ];
  const data: DataType[] = ['data-table', 'stat-card', 'pagination'];
  const media: MediaType[] = ['video', 'audio', 'avatar', 'icon'];
  const sections: SectionType[] = ['hero', 'pricing', 'testimonial', 'faq', 'cta'];

  if (primitives.includes(type as PrimitiveType)) return 'primitive';
  if (layouts.includes(type as LayoutType)) return 'layout';
  if (data.includes(type as DataType)) return 'data';
  if (media.includes(type as MediaType)) return 'media';
  if (sections.includes(type as SectionType)) return 'section';
  return 'primitive';
}
