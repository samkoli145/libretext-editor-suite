// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-layout-engine.ts
 * 📂 المسار: packages/core/src/blocks/html-block-layout-engine.ts
 * 🎯 الهدف الرئيسي: محرك تخطيط البلوكات (Grid + Flexbox) مع دعم
 *    إضافة/حذف/نقل الأطفال ديناميكياً ودمج قدرات محرر Canva/UI Designer.
 * 📋 المعايير: Zero-Dependency, Patch Factory, < 50 lines/function.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-layout-engine.test.ts
 * 🏷️ المعرف: CORE-BLK-LAY-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Strategy Pattern + Computed Styles + Dynamic Children
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Grid columns يجب أن يكون بين 1 و 12.
 *    2. Flexbox direction يجب أن يكون 'row' أو 'column'.
 *    3. children يجب أن يكون موجوداً فقط للحاويات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من صحة الخصائص.
 *    - معالجة الأخطاء بصمت مع تسجيلها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts
 *    - 📄 مرتبط مباشر: html-block-registry.ts
 *    - 🧪 اختبارات: html-block-layout-engine.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - computeGridStyles: حساب فئات Grid (#L65)
 *    - computeFlexboxStyles: حساب فئات Flexbox (#L85)
 *    - addChildToLayout: إضافة طفل للحاوية (#L105)
 *    - removeChildFromLayout: إزالة طفل من الحاوية (#L125)
 *    - moveChildInLayout: نقل طفل في الحاوية (#L145)
 *    - updateLayoutProps: تحديث خصائص التخطيط (#L165)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - المحرك يدعم Grid (1-12 عمود) و Flexbox (row/column).
 *    - الأطفال يُضافون ديناميكياً عبر addChildToLayout.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: إضافة دعم auto-fit و auto-fill.
 *    - 📖 مرجع تقني: Tailwind CSS Grid/Flexbox.
 *    - 🎯 التحسينات المستقبلية: دعم CSS Grid Areas.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { HtmlBlockNode, TailwindClasses } from './html-block-types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Grid Engine | محرك الشبكة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب فئات Grid من الخصائص.
 *
 * ⚠️ columns يجب أن يكون بين 1 و 12.
 * ⚠️ gap يجب أن يكون رقم موجب.
 *
 * // @function-index: #33/4 — computeGridStyles
 */
export function computeGridStyles(columns = 12, gap = 4): TailwindClasses {
  const cols = Math.max(1, Math.min(12, Math.floor(columns)));
  const g = Math.max(0, Math.floor(gap));

  return {
    layout: ['grid', `grid-cols-${cols}`],
    spacing: g > 0 ? [`gap-${g}`] : [],
  };
}

/**
 * حساب فئات Flexbox من الخصائص.
 *
 * ⚠️ direction يجب أن يكون 'row' أو 'column'.
 * ⚠️ justify يجب أن يكون 'start', 'center', 'end', 'between', 'around'.
 * ⚠️ align يجب أن يكون 'start', 'center', 'end', 'stretch'.
 *
 * // @function-index: #34/4 — computeFlexboxStyles
 */
export function computeFlexboxStyles(
  direction: 'row' | 'column' = 'row',
  justify: 'start' | 'center' | 'end' | 'between' | 'around' = 'start',
  align: 'start' | 'center' | 'end' | 'stretch' = 'start',
  gap = 4,
): TailwindClasses {
  const dir = direction === 'column' ? 'flex-col' : 'flex-row';
  const just = justify === 'start' ? 'justify-start' : `justify-${justify}`;
  const al = align === 'start' ? 'items-start' : `items-${align}`;
  const g = Math.max(0, Math.floor(gap));

  return {
    layout: ['flex', dir, just, al],
    spacing: g > 0 ? [`gap-${g}`] : [],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Dynamic Children | الأطفال الديناميكيون
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * إضافة طفل للحاوية.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ index اختياري - إن لم يُحدد، يُضاف في النهاية.
 *
 * // @function-index: #35/4 — addChildToLayout
 */
export function addChildToLayout(
  node: HtmlBlockNode,
  child: HtmlBlockNode,
  index?: number,
): HtmlBlockNode {
  const children = [...(node.children ?? [])];
  const idx = index ?? children.length;
  children.splice(idx, 0, child);

  return { ...node, children };
}

/**
 * إزالة طفل من الحاوية.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ childId يجب أن يكون موجوداً.
 *
 * // @function-index: #36/4 — removeChildFromLayout
 */
export function removeChildFromLayout(node: HtmlBlockNode, childId: string): HtmlBlockNode {
  if (!node.children) return node;

  const children = node.children.filter((c) => c.id !== childId);
  if (children.length === node.children.length) {
    console.warn('[LayoutEngine] Child not found:', childId);
    return node;
  }

  return { ...node, children };
}

/**
 * نقل طفل في الحاوية.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ newIndex يجب أن يكون ضمن الحدود.
 *
 * // @function-index: #37/4 — moveChildInLayout
 */
export function moveChildInLayout(
  node: HtmlBlockNode,
  childId: string,
  newIndex: number,
): HtmlBlockNode {
  if (!node.children) return node;

  const children = [...node.children];
  const oldIndex = children.findIndex((c) => c.id === childId);
  if (oldIndex === -1) {
    console.warn('[LayoutEngine] Child not found:', childId);
    return node;
  }

  const [child] = children.splice(oldIndex, 1);
  if (!child) return node;
  const idx = Math.max(0, Math.min(children.length, newIndex));
  children.splice(idx, 0, child);

  return { ...node, children };
}

/**
 * تحديث خصائص الحاوية.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ يحسب الفئات تلقائياً من الخصائص الجديدة.
 *
 * // @function-index: #38/4 — updateLayoutProps
 */
export function updateLayoutProps(
  node: HtmlBlockNode,
  props: Record<string, unknown>,
): HtmlBlockNode {
  let styles: TailwindClasses = {};

  if (node.type === 'grid') {
    styles = computeGridStyles((props.columns as number) ?? 12, (props.gap as number) ?? 4);
  } else if (node.type === 'flexbox') {
    styles = computeFlexboxStyles(
      (props.direction as 'row' | 'column') ?? 'row',
      (props.justify as 'start' | 'center' | 'end' | 'between' | 'around') ?? 'start',
      (props.align as 'start' | 'center' | 'end' | 'stretch') ?? 'start',
      (props.gap as number) ?? 4,
    );
  }

  return {
    ...node,
    props: { ...node.props, ...props },
    styles: { ...node.styles, ...styles },
  };
}
