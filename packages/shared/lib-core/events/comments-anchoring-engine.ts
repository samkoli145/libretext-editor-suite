/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: محرك تثبيت دبابيس التعليقات المتجاوبة (Universal Comment Pin Anchoring Engine)
 * 🏛️ الدور: نواة معزولة (Zero-Dependency) تحسب مواضع دبابيس التعليقات الثلاثة
 *           (عنصر / نقطة / شريحة) وتحديد إطار النوافذ المنبثقة داخل مجال الرؤية
 *           وتنسيق الأزمنة النسبية — بلا أي اعتماد على DOM أو Canvas.
 * 📥 المستهلك: UniversalCommentsPanel, CanvasDesignerEditor, RichTextEditor, PdfEditor, UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Spatial Pin Threading with Three-Anchor Resolution:
 *    نمط التثبيت الثلاثي — 1) عنصر: الزاوية العلوية اليمنى `(x+w, y)`،
 *    2) نقطة: رأس الدبوس يلامس النقطة تماماً، 3) شريحة: رصّ متسلسل أعلى يسار.
 *    يُراعى مقياس الكانفا (Scale) وأبعاد المؤشر (Marker Size) وتكديس الشريحة،
 *    مع اقتراح ذكي للوضع الأنسب عند النقر عبر `suggestCommentAnchor`.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التكديس على مستوى الشريحة يجب أن يستخدم فهرساً تسلسلياً فريداً (Slide Stack Index)
 *       وإلا تتداخل الدبابيس فوق بعضها.
 *    2. عناصر الغطاء الكامل (>80% من مساحة الشريحة) لا تصلح كمرسى للعنصر
 *       — يجب إسقاطها لصالح وضع النقطة أو الشريحة (Scenery Heuristic).
 *    3. إطار النافذة يجب ألا يتجاوز مجال الرؤية أبداً (Clamping في كلا المحورين).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع الواصفات (Element/Pt/Box)
 *    - قيم افتراضية آمنة (markerSize=18, stackOffset=26, padding=8)
 *    - إرجاع null عند تعذر العثور على العنصر المرتبط بدلاً من الانهيار
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/editor/comments.ts (The Bento authors, MIT).
 * نُقلت خوارزميات تموضع الدبوس وتثبيت النافذة والوقت النسبي إلى نواة
 * معزولة قابلة لإعادة الاستخدام في كل المحررات الأربعة.
 */

import type { Pt } from '../geometry/bezier-curves'

export type { Pt }

export interface AnchorBox {
  x: number
  y: number
  w: number
  h: number
}

/** صندوق عنصر مرتبط بالشريحة (بإحداثيات الكانفا غير المقيّسة). */
export interface AnchorElement {
  id: string
  x: number
  y: number
  w: number
  h: number
}

export type CommentAnchorMode = 'element' | 'point' | 'slide'

/** واصف مرسى التعليق — يحدد وضع التثبيت وبياناته. */
export interface CommentAnchorDescriptor {
  mode: CommentAnchorMode
  /** معرف العنصر المرتبط (للوضع element). */
  elementId?: string
  /** إحداثيات الكانفا للنقطة (للوضع point). */
  point?: Pt
  /** فهرس الرصّ التسلسلي (للوضع slide). */
  slideStackIndex?: number
}

export interface CommentAnchorOptions {
  /** مقياس الكانفا — يحوّل إحداثيات الشريحة إلى وحدات شاشة. الافتراضي 1. */
  scale?: number
  /** أبعاد مؤشر الدبوس. الافتراضي 18px. */
  markerSize?: number
  /** إزاحة الرصّ العمودي لكل دبوس شريحة. الافتراضي 26px. */
  stackOffsetY?: number
  /** حشوة الزاوية العليا اليسرى للرصّ. الافتراضي {x:10, y:10}. */
  stackPadding?: Pt
}

export interface ResolvedCommentMarker {
  box: AnchorBox
  mode: CommentAnchorMode
}

const MARKER_DEFAULT = 18
const STACK_OFFSET_DEFAULT = 26
const STACK_PAD_DEFAULT: Pt = { x: 10, y: 10 }

/**
 * اقتراح أفضل وضع تثبيت عند النقر في إحداثيات الشريحة:
 * عنصر لا يغطي الشريحة → مرسى عنصر؛ غير ذلك → نقطة أو شريحة.
 * (عناصر الغلاف الكامل >80% تُسقط كـ Scenery حتى لا تلتقط دبوس العرض.)
 */
export function suggestCommentAnchor(
  point: Pt,
  elements: AnchorElement[],
  slide: { w: number; h: number },
  fullSlideThreshold = 0.8
): CommentAnchorDescriptor {
  const candidates = elements.filter(
    (e) => point.x >= e.x && point.x <= e.x + e.w && point.y >= e.y && point.y <= e.y + e.h
  )
  const top = candidates[candidates.length - 1]
  if (top && !isNearFullSlideElement(top, slide, fullSlideThreshold)) {
    return { mode: 'element', elementId: top.id }
  }
  if (point.x >= 0 && point.y >= 0 && point.x <= slide.w && point.y <= slide.h) {
    return { mode: 'point', point: { x: point.x, y: point.y } }
  }
  return { mode: 'slide', slideStackIndex: 0 }
}

/** هل يغطي العنصر أكثر من عتبة مساحة الشريحة (Scenery)؟ الافتراضي 80%. */
export function isNearFullSlideElement(
  el: AnchorElement,
  slide: { w: number; h: number },
  threshold = 0.8
): boolean {
  if (slide.w <= 0 || slide.h <= 0) return false
  const area = el.w * el.h
  const slideArea = slide.w * slide.h
  return area > slideArea * threshold
}

/**
 * حساب صندوق مؤشر الدبوس (بإحداثيات الشاشة) حسب وضع التثبيت.
 * — element: الزاوية العلوية اليمنى `(x + w, y)` مع توسيط الدبوس فوقها.
 * — point: رأس الدبوس السفلي يلامس النقطة تماماً (إزاحة علوية بمقدار markerSize).
 * — slide: رصّ عمودي يبدأ من الزاوية العلوية اليسرى مع فهرس تسلسلي.
 */
export function resolveCommentMarker(
  descriptor: CommentAnchorDescriptor,
  elements: AnchorElement[],
  opts?: CommentAnchorOptions
): ResolvedCommentMarker | null {
  const scale = opts?.scale ?? 1
  const size = opts?.markerSize ?? MARKER_DEFAULT
  const stackY = opts?.stackOffsetY ?? STACK_OFFSET_DEFAULT
  const pad = opts?.stackPadding ?? STACK_PAD_DEFAULT

  if (descriptor.mode === 'element' && descriptor.elementId) {
    const el = elements.find((e) => e.id === descriptor.elementId)
    if (!el) return null
    const x = (el.x + el.w) * scale - size / 2
    const y = el.y * scale - size / 2
    return { mode: 'element', box: { x, y, w: size, h: size } }
  }

  if (descriptor.mode === 'point' && descriptor.point) {
    const x = descriptor.point.x * scale - size / 2
    const y = descriptor.point.y * scale - size
    return { mode: 'point', box: { x, y, w: size, h: size } }
  }

  const index = descriptor.slideStackIndex ?? 0
  const x = pad.x
  const y = pad.y + index * stackY
  return { mode: 'slide', box: { x, y, w: size, h: size } }
}

/**
 * تثبيت موضع النافذة المنبثقة داخل مجال الرؤية (Viewport Clamping).
 * النافذة تُوضع يمين المرسى (+8px) ومرفوعة قليلاً عنه، وتُقصَّر إلى الحواف
 * بحيث تبقى داخل الشاشة دائماً — النمط المطابق لـ `ed-comment-pop`.
 */
export function clampPopoverToViewport(
  anchor: AnchorBox,
  popover: { w: number; h: number },
  viewport: { w: number; h: number },
  padding = 8
): Pt {
  const safeW = Math.max(popover.w, 1)
  const safeH = Math.max(popover.h, 1)
  const rightEdge = Math.min(anchor.x + anchor.w + padding, viewport.w - safeW - padding)
  const topEdge = Math.min(anchor.y - padding, viewport.h - safeH - padding)
  return {
    x: Math.max(padding, rightEdge),
    y: Math.max(padding, topEdge),
  }
}

/**
 * تنسيق الوقت النسبي لسلسلة تعليقات (Relative Time Formatting):
 * < 45s → "just now"؛ ثم بالدقائق/الساعات/الأيام؛ وما فوق الشهر تاريخ محلي.
 * يعمل على طوابع زمنية رقمية (ملّي ثانية) أو سلاسل ISO — بديل معزول عن DOM.
 */
export function formatRelativeTime(
  timestamp: number | string,
  now: number = Date.now()
): { kind: 'just-now' | 'minutes' | 'hours' | 'days' | 'date'; value: number | null; labelAr: string; labelEn: string } {
  const t = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp
  if (!Number.isFinite(t)) return { kind: 'date', value: null, labelAr: '—', labelEn: '—' }

  const seconds = (now - t) / 1000
  if (!Number.isFinite(seconds) || seconds < 45) {
    return { kind: 'just-now', value: 0, labelAr: 'الآن فقط', labelEn: 'just now' }
  }
  if (seconds < 3600) {
    const n = Math.round(seconds / 60)
    return { kind: 'minutes', value: n, labelAr: `قبل ${n} د`, labelEn: `${n}m ago` }
  }
  if (seconds < 86400) {
    const n = Math.round(seconds / 3600)
    return { kind: 'hours', value: n, labelAr: `قبل ${n} س`, labelEn: `${n}h ago` }
  }
  if (seconds < 86400 * 30) {
    const n = Math.round(seconds / 86400)
    return { kind: 'days', value: n, labelAr: `قبل ${n} ي`, labelEn: `${n}d ago` }
  }
  return { kind: 'date', value: null, labelAr: new Date(t).toLocaleDateString('ar-EG'), labelEn: new Date(t).toLocaleDateString() }
}

/**
 * دمج ترتيب الدبابيس عبر الشريحة: يحسب فهارس الرصّ التسلسلية للتعليقات
 * غير المرتبطة (وضع الشريحة) مع الحفاظ على ترتيب المصفوفة الأصلي.
 */
export function buildSlideStackIndexes(
  descriptors: CommentAnchorDescriptor[]
): Map<number, number> {
  const indexes = new Map<number, number>()
  let stack = 0
  descriptors.forEach((d, i) => {
    if (d.mode === 'slide') {
      indexes.set(i, stack++)
    }
  })
  return indexes
}
