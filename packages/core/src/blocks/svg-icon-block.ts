/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: svg-icon-block.ts
 * 📂 المسار: packages/core/src/blocks/svg-icon-block.ts
 * 🎯 الهدف الرئيسي: بلوك أيقونة SVG مرجعي بالمعرف مع تحويل فوري إلى SVG/DataURL
 * 📋 المعايير: حل من مكتبة الأيقونات الجاهزة، قص الحجم 8-256، ألوان hex فقط
 * 🧪 الاختبارات: packages/core/tests/blocks/conversion-blocks.test.ts
 * 🏷️ المعرف: BLK-WRITER-SVG-ICON
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Reference-by-Id Icon Block — يخزن المعرف لا الـ SVG (حجم مستند صغير)
 *    والتحويل يتم وقت القراءة من ICON_LIBRARY الجاهزة (shared/engines)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. iconId غير موجود في المكتبة → resolveIconSvg يرجع null (لا اختراع).
 *    2. اللون يجب أن يكون hex صالحاً وإلا يُستخدم الافتراضي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isSvgIconBlock).
 *    - قص الحجم Math.min/Math.max + regex للون.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/ast/types.ts, shared/engines/IconLibraryEngine.ts
 *    - 🧪 اختبارات: tests/blocks/conversion-blocks.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createSvgIconBlock: إنشاء كتلة أيقونة (#L82)
 *    - isSvgIconBlock: فاحص النوع (#L102)
 *    - findIconById: بحث خطي في المكتبة بالمعرف (#L109)
 *    - resolveIconSvg: تحويل الكتلة إلى SVG جاهز (#L117)
 *    - formatSvgIconMarkdown: تصدير كوسم img بـ DataURL (#L130)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: shared/engines/IconLibraryEngine.ts (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';
import { ICON_LIBRARY } from '../../../shared/engines/IconLibraryEngine';
import type { SVGIcon } from '../../../shared/engines/IconLibraryEngine';

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

export interface SvgIconBlockData {
  readonly iconId: string;
  readonly size: number;
  readonly color: string;
  readonly strokeWidth: number;
}

export interface SvgIconBlockNode extends BaseBlockNode<SvgIconBlockData> {
  readonly type: 'svg_icon';
  readonly domain: 'writer';
}

function clampSize(raw: number | undefined): number {
  return Math.min(256, Math.max(8, Math.round(raw ?? 24)));
}

function safeColor(raw: string | undefined, fallback: string): string {
  return raw && HEX_COLOR.test(raw) ? raw : fallback;
}

export function createSvgIconBlock(
  id: string,
  data?: Partial<SvgIconBlockData>,
): SvgIconBlockNode {
  return {
    id,
    type: 'svg_icon',
    domain: 'writer',
    traits: ['draggable', 'styleable'] as readonly TraitKey[],
    data: {
      iconId: data?.iconId ?? '',
      size: clampSize(data?.size),
      color: safeColor(data?.color, '#2563EB'),
      strokeWidth: Math.min(4, Math.max(1, data?.strokeWidth ?? 2)),
    },
  };
}

export function isSvgIconBlock(node: unknown): node is SvgIconBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as SvgIconBlockNode;
  return b.type === 'svg_icon' && b.domain === 'writer';
}

/** بحث خطي بالمعرف — المكتبة صغيرة (<100 أيقونة). */
export function findIconById(iconId: string): SVGIcon | undefined {
  return ICON_LIBRARY.find(icon => icon.id === iconId);
}

/** نتيجة تحويل الأيقونة. */
export interface IconResolveResult {
  readonly svg: string | null;
  readonly dataUrl: string | null;
}

/** تحويل كتلة الأيقونة إلى SVG + DataURL عبر المكتبة الجاهزة. */
export function resolveIconSvg(node: SvgIconBlockNode): IconResolveResult {
  const icon = findIconById(node.data.iconId);
  if (!icon) return { svg: null, dataUrl: null };

  const { size, color, strokeWidth } = node.data;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
    `width="${size}" height="${size}" fill="none" stroke="${color}" ` +
    `stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
    `${icon.body}</svg>`;
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return { svg, dataUrl };
}

/** تصدير كوسم صورة بـ DataURL — يعمل في كل محولات Markdown. */
export function formatSvgIconMarkdown(node: SvgIconBlockNode): string {
  const { dataUrl } = resolveIconSvg(node);
  if (!dataUrl) return '';
  const icon = findIconById(node.data.iconId);
  return `![${icon?.nameEn ?? 'icon'}](${dataUrl})`;
}
