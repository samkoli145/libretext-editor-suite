/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: هندسة التحرير المباشر على الكانفا لأشكال الخط/المنحنى/الموصِّل
 *           (line / curved-line / connector) — البديل البديهي عن تحجيم صندوق.
 * 🏛️ الدور: نواة معزولة (Zero-Dependency Geometry) داخل lib-core/geometry.
 * 📥 المستهلك: canvas-designer (LineEditor), ui-designer, motion-path-engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Model-Driven Handles + Hybrid Path Round-Trip:
 *    المقابض تُوضع من هندسة العنصر لا من عقدة DOM (لا يهم إعادة الرسم تحتها)،
 *    والتحويلات ثنائية الاتجاه: خط ⇄ نقطتا نهاية (مركز الصندوق ± نصف العرض
 *    على طول الدوران) ومسار ⇄ نقاط تثبيت (pathBox مُطبَّع إلى [0,0,w,h]).
 *    استخراج نقاط التثبيت يُحافظ على شكل المنحنى: أخذ عينات عبر المتصفح
 *    (فتعمل الأقواس والأوامر النسبية وH/V/Z) ثم اختزال بـ Ramer–Douglas–Peucker.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. `samplePathAnchors` يتطلب DOM (SVG getTotalLength) — في بيئات بلا DOM
 *       يعود `parseAnchors` (نقط نهاية المقاطع) بدل الانهيار.
 *    2. المسار المستقيم (polyline/polygon) يُحلل بالضبط؛ المنحنى يُؤخذ عيّنةً
 *       ويُختزل — مساران مختلفان قد يتشاركان نقاط التثبيت بعد الاختزال.
 *    3. `setLineEndpoints` يجب أن يحافظ على سُمك صندوق الشوط (el.h أو 4).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - الحفاظ على w>=1 وتجنب القسمة على صفر (عرض/ارتفاع pathBox معدوم).
 *    - Type Guards: isLineLike لا يأخذ إلا shape من النوع line/path.
 *    - نقاط <2 لا تُكتب مساراً أبداً.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/editor/lineedit.ts (The Bento authors, MIT).
 * الدالتان parseAnchors و anchorsToPath مستعارتان من bezier-curves.ts (لا تكرار).
 */

import { type Pt, anchorsToPath, parseAnchors } from './bezier-curves'

const rnd = (v: number): number => Math.round(v * 100) / 100

/** الأشكال المغلقة (المضلعات) تنتهي بـ Z؛ المستقيمة بلا أوامر منحنى. */
export const pathIsClosed = (d?: string): boolean => /z\s*$/i.test(d ?? '')
export const pathIsStraight = (d?: string): boolean => !/[csqta]/i.test(d ?? '')

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

/** شكل قابل للخط: نوع shape مع شكل line أو path. */
export function isLineLike(el: { type: string; shape?: string }): boolean {
  return el.type === 'shape' && (el.shape === 'line' || el.shape === 'path')
}

/** نقطتا نهاية شكل الخط، بإحداثيات الشريحة. */
export function lineEndpoints(el: { x: number; y: number; w: number; h: number; rotation?: number }): [Pt, Pt] {
  const cx = el.x + el.w / 2
  const cy = el.y + el.h / 2
  const rad = ((el.rotation || 0) * Math.PI) / 180
  const hw = el.w / 2
  const dx = Math.cos(rad) * hw
  const dy = Math.sin(rad) * hw
  return [{ x: cx - dx, y: cy - dy }, { x: cx + dx, y: cy + dy }]
}

/** اكتب شكل خط من نقطتي نهاية (يحافظ على سُمك صندوق الشوط). */
export function setLineEndpoints(el: { x: number; y: number; w: number; h: number; rotation?: number }, a: Pt, b: Pt): void {
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2
  const w = Math.max(Math.hypot(b.x - a.x, b.y - a.y), 1)
  const h = el.h || 4
  el.w = w
  el.x = cx - w / 2
  el.y = cy - h / 2
  el.rotation = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
}

export function boxCenter(b: Box): Pt {
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 }
}

/** أين يقطع شعاع من مركز الصندوق b نحو target حدود الصندوق. */
export function borderPoint(b: Box, target: Pt): Pt {
  const cx = b.x + b.w / 2
  const cy = b.y + b.h / 2
  const dx = target.x - cx
  const dy = target.y - cy
  if (!dx && !dy) return { x: cx, y: cy }
  const sx = dx ? b.w / 2 / Math.abs(dx) : Infinity
  const sy = dy ? b.h / 2 / Math.abs(dy) : Infinity
  const s = Math.min(sx, sy)
  return { x: cx + dx * s, y: cy + dy * s }
}

/** منتصف جانب من جوانب الصندوق (نقاط تثبيت الموصل). */
export function sideMidpoint(b: Box, side: 'top' | 'right' | 'bottom' | 'left'): Pt {
  if (side === 'top') return { x: b.x + b.w / 2, y: b.y }
  if (side === 'bottom') return { x: b.x + b.w / 2, y: b.y + b.h }
  if (side === 'left') return { x: b.x, y: b.y + b.h / 2 }
  return { x: b.x + b.w, y: b.y + b.h / 2 }
}

/** نقطتا تثبيت شكل path بإحداثيات الشريحة. المسارات المستقيمة (المتعددة
 *  الخطوط/المضلعات) تُحلل بالضبط؛ المنحنيات تُؤخذ عيّنةً وتُختزل. */
export function pathAnchors(el: {
  x: number
  y: number
  w: number
  h: number
  d?: string
  pathBox?: [number, number, number, number]
}): Pt[] {
  const [px, py, pw, ph] = el.pathBox ?? [0, 0, el.w || 1, el.h || 1]
  const sx = el.w / (pw || 1)
  const sy = el.h / (ph || 1)
  const src = pathIsStraight(el.d) ? parseAnchors(el.d ?? '') : samplePathAnchors(el.d ?? '')
  return src.map((p) => ({ x: el.x + (p.x - px) * sx, y: el.y + (p.y - py) * sy }))
}

/** اكتب شكل path من نقاط تثبيت (إحداثيات شريحة)؛ يطبّع pathBox.
 *  `straight` يُبقي المقاطع خطوطاً (المضلعات)؛ `closed` يلحق Z. */
export function setPathAnchors(
  el: { x: number; y: number; w: number; h: number; d?: string; pathBox?: [number, number, number, number] },
  pts: Pt[],
  opts: { closed?: boolean; straight?: boolean } = {}
): void {
  if (pts.length < 2) return
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const w = Math.max(Math.max(...xs) - minX, 1)
  const h = Math.max(Math.max(...ys) - minY, 1)
  el.x = minX
  el.y = minY
  el.w = w
  el.h = h
  el.pathBox = [0, 0, w, h]
  const rel = pts.map((p) => ({ x: rnd(p.x - minX), y: rnd(p.y - minY) }))
  el.d =
    (opts.straight
      ? 'M ' + rel.map((p) => `${p.x} ${p.y}`).join(' L ')
      : anchorsToPath(rel)) + (opts.closed ? ' Z' : '')
}

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * نقاط تثبيت تحافظ على شكل المنحنى: يُؤخذ المسار عيّنةً عبر المتصفح
 * (فتعمل البيزييهات والأقواس والأوامر النسبية و H/V/Z) ثم تُختزل العينات
 * بـ Ramer–Douglas–Peucker. منحنى وحيد C مثل "M 0 0 C 122 0 133 140 255 140"
 * ينتج نقاط تثبيت داخلية تعيد إنتاج الانحناء S — بينما parseAnchors وحدها
 * كانت ستفلّته إلى خط. خارج بيئة DOM يعود parseAnchors كاحتياط آمن.
 */
export function samplePathAnchors(d: string): Pt[] {
  if (typeof document === 'undefined') return parseAnchors(d)
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  document.body.appendChild(svg)
  try {
    const total = path.getTotalLength()
    if (!Number.isFinite(total) || total < 1) return parseAnchors(d)
    const n = Math.min(256, Math.max(24, Math.ceil(total / 4)))
    const samples: Pt[] = []
    for (let i = 0; i <= n; i++) {
      const p = path.getPointAtLength((total * i) / n)
      samples.push({ x: p.x, y: p.y })
    }
    // خفّف التسامح حتى يصبح عدد النقاط مريحاً للتحرير.
    let eps = 0.75
    let pts = rdp(samples, eps)
    while (pts.length > 12) {
      eps *= 1.7
      pts = rdp(samples, eps)
    }
    return pts
  } catch {
    return parseAnchors(d)
  } finally {
    svg.remove()
  }
}

/** اختزال أثر مؤشر خام إلى نقاط تثبيت قابلة للتحرير (الرسم الحر). */
export function simplifyPoints(pts: Pt[], eps = 3): Pt[] {
  return rdp(pts, eps)
}

function rdp(pts: Pt[], eps: number): Pt[] {
  if (pts.length <= 2) return pts.slice()
  let maxDist = 0
  let idx = 0
  const a = pts[0]
  const b = pts[pts.length - 1]
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], a, b)
    if (d > maxDist) {
      maxDist = d
      idx = i
    }
  }
  if (maxDist > eps) {
    return [...rdp(pts.slice(0, idx + 1), eps), ...rdp(pts.slice(idx), eps).slice(1)]
  }
  return [a, b]
}

function perpDist(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  if (!len) return Math.hypot(p.x - a.x, p.y - a.y)
  return Math.abs(((p.x - a.x) * dy - (p.y - a.y) * dx)) / len
}
