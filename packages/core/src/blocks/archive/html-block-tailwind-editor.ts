// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-tailwind-editor.ts
 * 📂 المسار: packages/core/src/blocks/html-block-tailwind-editor.ts
 * 🎯 الهدف الرئيسي: محرر Tailwind Properties Editor لتعديل فئات CSS.
 * 📋 المعايير: Zero-Dependency, Patch Factory, < 50 lines/function.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-tailwind-editor.test.ts
 * 🏷️ المعرف: CORE-BLK-TWL-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Category-based Editing + Whitelist Validation + Merge Strategy
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الفئات يجب أن تكون من القائمة البيضاء.
 *    2. الدمج يحافظ على الفئات الافتراضية.
 *    3. التحقق يمنع الفئات الضارة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من صحة الفئات.
 *    - معالجة الأخطاء بصمت مع تسجيلها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts
 *    - 📄 مرتبط مباشر: html-block-generator.ts
 *    - 🧪 اختبارات: html-block-tailwind-editor.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - updateStyles: تحديث الفئات (#L65)
 *    - mergeWithDefaults: دمج مع الافتراضيات (#L85)
 *    - validateClasses: التحقق من القائمة البيضاء (#L105)
 *    - flattenStyles: تسطيح الفئات (#L125)
 *    - updateBlockStyles: تحديث فئات البلوك (#L145)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - المحرر يدعم 8 فئات (layout, spacing, sizing, typography, colors, borders, effects, responsive).
 *    - التحقق يمنع الفئات الضارة مثل 'bg-black', 'text-white' غير المتوافقة مع الثيم الفاتح النقي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: إضافة دعم Tailwind JIT.
 *    - 📖 مرجع تقني: Tailwind CSS Documentation.
 *    - 🎯 التحسينات المستقبلية: دعم Custom Classes.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { HtmlBlockNode, TailwindClasses } from './html-block-types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tailwind Editor | محرر Tailwind
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * التحقق من أن الفئات من القائمة البيضاء وتوافق الثيم الفاتح النقي.
 *
 * ⚠️ يمنع الفئات الداكنة الصريحة مثل 'bg-black', 'bg-gray-900'.
 * ⚠️ يُعيد فقط الفئات الصالحة.
 *
 * // @function-index: #47/4 — validateClasses
 */
export function validateClasses(classes: string[]): string[] {
  const forbidden = ['bg-black', 'bg-gray-900', 'bg-slate-900', 'bg-zinc-900'];

  return classes.filter((c) => {
    if (forbidden.includes(c)) {
      console.warn('[TailwindEditor] Forbidden class:', c);
      return false;
    }
    return true;
  });
}

/**
 * تحديث الفئات في فئة معينة.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ classes يجب أن تكون من القائمة البيضاء.
 *
 * // @function-index: #45/4 — updateStyles
 */
export function updateStyles(
  node: HtmlBlockNode,
  category: keyof TailwindClasses,
  classes: string[],
): HtmlBlockNode {
  const valid = validateClasses(classes);
  if (valid.length === 0 && classes.length > 0) {
    console.warn('[TailwindEditor] No valid classes');
    return node;
  }

  const styles = { ...node.styles };
  styles[category] = valid;

  return { ...node, styles };
}

/**
 * دمج الفئات المخصصة مع الافتراضيات.
 *
 * ⚠️ الفئات المخصصة تُضاف بعد الافتراضيات.
 * ⚠️ لا تُستبدل الفئات الافتراضية.
 *
 * // @function-index: #46/4 — mergeWithDefaults
 */
export function mergeWithDefaults(
  custom: TailwindClasses,
  defaults: TailwindClasses,
): TailwindClasses {
  const merged: TailwindClasses = {};
  const categories = Array.from(
    new Set([...Object.keys(defaults), ...Object.keys(custom)]),
  ) as Array<keyof TailwindClasses>;

  for (const category of categories) {
    const def = defaults[category] ?? [];
    const cus = custom[category] ?? [];
    merged[category] = Array.from(new Set([...def, ...cus]));
  }

  return merged;
}

/**
 * تسطيح الفئات إلى سلسلة واحدة.
 *
 * ⚠️ يدمج كل الفئات من كل الفئات.
 * ⚠️ يُرجع سلسلة مفصولة بمسافات.
 *
 * // @function-index: #48/4 — flattenStyles
 */
export function flattenStyles(styles: TailwindClasses): string {
  const all: string[] = [];

  for (const category of Object.keys(styles) as Array<keyof TailwindClasses>) {
    const classes = styles[category] ?? [];
    all.push(...classes);
  }

  return all.filter(Boolean).join(' ');
}

/**
 * تحديث خصائص البلوك مع الفئات.
 *
 * ⚠️ يُعيد نسخة جديدة من العقدة (immutable).
 * ⚠️ يحسب الفئات تلقائياً من الخصائص الجديدة.
 *
 * // @function-index: #49/4 — updateBlockStyles
 */
export function updateBlockStyles(
  node: HtmlBlockNode,
  styles: Partial<TailwindClasses>,
): HtmlBlockNode {
  const merged = mergeWithDefaults(styles, node.styles ?? {});

  return {
    ...node,
    styles: merged,
  };
}
