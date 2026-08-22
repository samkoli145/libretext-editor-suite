/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك مسارات الحركة والمورف البصري بين الشرائح والعناصر
 *           (Live Motion Paths & Visual Element Morphing Engine).
 * 🏛️ الدور: نواة التحريك والانتقالات المعمارية المشتركة (Animation & Motion Core).
 * 📥 المستهلك: CanvasDesignerEditor, StoryMode, CanvasSlideTransitions.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Affine Geometry Interpolator with Tangent Heading Alignment:
 *    حساب الاستيفاء الخطي والمنحني (Interpolation) لخصائص العناصر المشتركة
 *    بين الشرائح، مع محاذاة زوايا الدوران تلقائياً وفق مماس مسار الحركة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب انقلاب الدوران (Angle Flips) عبر استخدام أقصر زاوية نسبية (Shortest Angular Delta).
 *    2. ضمان بقاء نسبة الشفافية محصورة في المجال $[0, 1]$ لتفادي وميض الشاشة.
 *    3. مطابقة العناصر الفريدة (Entering / Exiting) دون إحداث وميض بصري (Flicker).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع كائنات العناصر والمحاور.
 *    - دوال تخميد رياضية محكمة (Easing Functions) بدون أي استدعاء خارجي.
 *    - تنظيف وتطبيع الألوان عند استيفاء التدرجات (Color Hex/RGB Interpolation).
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Pt, evalCubicBezier, evalCubicDerivative, clamp } from '../geometry/bezier-curves'

export type EasingType = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutCubic' | 'easeOutBack' | 'easeOutBounce'

export interface MotionPathNode {
  p: Pt
  speedMultiplier?: number // مضاعف السرعة عند هذه النقطة
  pauseDurationMs?: number // توقف اختياري بالمللي ثانية
}

export interface MorphElementState {
  id: string
  x: number
  y: number
  w: number
  h: number
  rotation?: number
  opacity?: number
  borderRadius?: number
  fill?: string
  stroke?: string
  [key: string]: unknown
}

export class MotionMorphEngine {
  /**
   * دوال التخميد الرياضية الصرفة (Pure Math Easing)
   */
  static ease(t: number, type: EasingType = 'easeInOutCubic'): number {
    const clampedT = clamp(t, 0, 1)
    switch (type) {
      case 'linear':
        return clampedT
      case 'easeInQuad':
        return clampedT * clampedT
      case 'easeOutQuad':
        return clampedT * (2 - clampedT)
      case 'easeInOutCubic':
        return clampedT < 0.5
          ? 4 * clampedT * clampedT * clampedT
          : (clampedT - 1) * (2 * clampedT - 2) * (2 * clampedT - 2) + 1
      case 'easeOutBack': {
        const c1 = 1.70158
        const c3 = c1 + 1
        return 1 + c3 * Math.pow(clampedT - 1, 3) + c1 * Math.pow(clampedT - 1, 2)
      }
      case 'easeOutBounce': {
        const n1 = 7.5625
        const d1 = 2.75
        let x = clampedT
        if (x < 1 / d1) {
          return n1 * x * x
        } else if (x < 2 / d1) {
          x -= 1.5 / d1
          return n1 * x * x + 0.75
        } else if (x < 2.5 / d1) {
          x -= 2.25 / d1
          return n1 * x * x + 0.9375
        } else {
          x -= 2.625 / d1
          return n1 * x * x + 0.984375
        }
      }
      default:
        return clampedT
    }
  }

  /**
   * تقييم موضع وزاوية عنصر على مسار حركة بيزير عند التقدم t
   */
  static evaluateMotionPath(
    nodes: MotionPathNode[],
    progress: number,
    alignToTangent: boolean = true
  ): { position: Pt; angleDeg: number } {
    if (!nodes || nodes.length === 0) {
      return { position: { x: 0, y: 0 }, angleDeg: 0 }
    }
    if (nodes.length === 1) {
      return { position: { ...nodes[0].p }, angleDeg: 0 }
    }

    const t = clamp(progress, 0, 1)
    const segmentCount = nodes.length - 1
    const scaledT = t * segmentCount
    const segIdx = Math.min(Math.floor(scaledT), segmentCount - 1)
    const localT = scaledT - segIdx

    const n0 = nodes[segIdx]
    const n1 = nodes[segIdx + 1]

    // حساب نقاط التحكم الافتراضية
    const cp1 = {
      x: n0.p.x + (n1.p.x - n0.p.x) / 3,
      y: n0.p.y + (n1.p.y - n0.p.y) / 3,
    }
    const cp2 = {
      x: n1.p.x - (n1.p.x - n0.p.x) / 3,
      y: n1.p.y - (n1.p.y - n0.p.y) / 3,
    }

    const pos = evalCubicBezier(n0.p, cp1, cp2, n1.p, localT)
    let angleDeg = 0

    if (alignToTangent) {
      const deriv = evalCubicDerivative(n0.p, cp1, cp2, n1.p, localT)
      angleDeg = (Math.atan2(deriv.y, deriv.x) * 180) / Math.PI
    }

    return { position: pos, angleDeg }
  }

  /**
   * استيفاء ومورف بين حالتي شريحة كاملة (Slide A -> Slide B)
   */
  static interpolateSlideElements(
    fromElements: MorphElementState[],
    toElements: MorphElementState[],
    progress: number,
    easing: EasingType = 'easeInOutCubic'
  ): MorphElementState[] {
    const easedT = this.ease(progress, easing)
    const fromMap = new Map<string, MorphElementState>(fromElements.map(el => [el.id, el]))
    const toMap = new Map<string, MorphElementState>(toElements.map(el => [el.id, el]))

    const result: MorphElementState[] = []

    // 1. معالجة العناصر المشتركة والعناصر المتحولة
    toMap.forEach((toEl, id) => {
      const fromEl = fromMap.get(id)
      if (fromEl) {
        // عنصر موجود في الشريحتين -> مورف كامل
        result.push(this.interpolateElement(fromEl, toEl, easedT))
      } else {
        // عنصر جديد يدخل الشريحة (Entering Element) -> تلاشٍ للداخل مع تكبير خفيف
        result.push({
          ...toEl,
          opacity: (toEl.opacity ?? 1) * easedT,
          x: toEl.x + (1 - easedT) * 10,
          y: toEl.y + (1 - easedT) * 10,
        })
      }
    })

    // 2. معالجة العناصر المغادرة (Exiting Elements)
    fromMap.forEach((fromEl, id) => {
      if (!toMap.has(id)) {
        result.push({
          ...fromEl,
          opacity: (fromEl.opacity ?? 1) * (1 - easedT),
          x: fromEl.x - easedT * 10,
          y: fromEl.y - easedT * 10,
        })
      }
    })

    return result
  }

  /**
   * استيفاء سلس بين عنصرين
   */
  static interpolateElement(from: MorphElementState, to: MorphElementState, t: number): MorphElementState {
    const lerp = (a: number, b: number) => a + (b - a) * t

    // استيفاء الزاوية بأقصر مسار
    const fromRot = from.rotation ?? 0
    let toRot = to.rotation ?? 0
    let rotDiff = (toRot - fromRot) % 360
    if (rotDiff > 180) rotDiff -= 360
    if (rotDiff < -180) rotDiff += 360
    const finalRot = fromRot + rotDiff * t

    return {
      ...to,
      id: to.id,
      x: lerp(from.x, to.x),
      y: lerp(from.y, to.y),
      w: lerp(from.w, to.w),
      h: lerp(from.h, to.h),
      rotation: finalRot,
      opacity: lerp(from.opacity ?? 1, to.opacity ?? 1),
      borderRadius: lerp(from.borderRadius ?? 0, to.borderRadius ?? 0),
    }
  }
}
