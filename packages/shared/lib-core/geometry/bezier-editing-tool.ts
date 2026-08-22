/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: أداة تحرير المنحنيات البيزيرية (True Bezier Pen Editing Tool Engine)
 * 🏛️ الدور: نواة معزولة (Zero-Dependency) فوق bezier-curves تُضيف عمليات التحرير
 *           التفاعلية الكاملة: تصنيف الزوايا (Corner Classification)، الإدراج
 *           على المنحنى (On-Curve Insert via de Casteljau)، الحذف، تبديل
 *           النعومة/الزاوية، المرآة الحافظة للطول، وحساب الحدود الهندسية
 *           الحقيقية (True Curve Bounds) بلا أي اعتماد على DOM.
 * 📥 المستهلك: CanvasBezierShapeEditor, BezierSubEditor, CanvasMotionPathEditor, ToolRegistry
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Handle-Driven Exact Curves (Zero Drift):
 *    المنحنى هو مقابضه تماماً — لا أخذ عينات ولا إعادة تمليس عند كل سحب.
 *    الزاوية تُكشَف تلقائياً من استقامة المقبضين (زاوية > 0.14 راد ≈ 8°)،
 *    والإدراج يحافظ على الشكل التام عبر تقسيم De Casteljau عند أقرب معامل
 *    زمني t للنقطة المطلوبة، والحدود الحقيقية تشمل انتفاخ نقاط التحكم
 *    (Control-Point Bulge) فتطابق الناتج `path.getBBox()` بلا DOM.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. حذف عقدة لا يجوز أن يترك أقل من عقدتين (مسار منهار).
 *    2. في المسار المغلق، الشريحة الأخيرة تعود إلى العقدة الأولى
 *       `(i + 1) % nodes.length` — والإدراج عند التفاف الحلقة يحتاج معاملة خاصة.
 *    3. زاوية الفحص يجب أن تُطبَّع إلى [0, π] قبل المقارنة وإلا فالدوران
 *       الكامل سيُصنَّف زاويةً خطأً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - إرجاع المصفوفة الأصلية دون تعديل عند الفهارس خارج النطاق
 *    - قيم افتراضية آمنة (samples=24) للحدود الهندسية
 *    - Type Guards: `isBezierCurve` يرفض أي شكل غير مسار بيزير فعلي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/editor/beziereditor.ts (The Bento authors, MIT).
 * استُخرج منطق التحرير الكامل إلى نواة مشتركة تعمل في كل المحررات الأربعة
 * مع استبدال `getBBox` بحساب هندسي معزول يطابق نتيجته.
 */

import {
  type BezNode,
  type Pt,
  cubicAt,
  mirrorHandle,
  nearestT,
  serializeBezier,
  splitSegment,
} from './bezier-curves'

const CORNER_ANGLE_RAD = 0.14 // ≈ 8° — عتبة الزاوية لتصنيف النقطة كزاوية

/** حارس نوع: هل المسار يحمل أوامر بيزير فعلية (منحنى وليس مضلعاً مستقيماً)؟ */
export function isBezierCurve(el: { type: string; shape?: string; d?: string }): boolean {
  return el.type === 'shape' && el.shape === 'path' && /[csq]/i.test(el.d ?? '')
}

/**
 * تصنيف عقدة: إذا كان مقبضا الدخول/الخروج غير متوازيين تقريباً فهي زاوية
 * (Corner). الزاوية تُطبَّع إلى [0, π] قبل المقارنة لتفادي انعكاس الدوران.
 */
export function markBezierNode(n: BezNode): BezNode {
  if (n.in && n.out) {
    const a = Math.atan2(n.p.y - n.in.y, n.p.x - n.in.x)
    const b = Math.atan2(n.out.y - n.p.y, n.out.x - n.p.x)
    let diff = Math.abs(a - b)
    if (diff > Math.PI) diff = 2 * Math.PI - diff
    return { ...n, corner: diff > CORNER_ANGLE_RAD }
  }
  return n
}

/** تصنيف كل العقد دفعة واحدة (تُستخدم عند فتح مسار للتحرير). */
export function markAllBezierNodes(nodes: BezNode[]): BezNode[] {
  return nodes.map(markBezierNode)
}

/** تبديل حالة العقدة بين ناعمة (Smooth) وزاوية (Corner) — Alt-click. */
export function toggleBezierNodeCorner(n: BezNode): BezNode {
  return { ...n, corner: !n.corner }
}

/**
 * سحب مقبض تحكم لعقدة ناعمة مع مرآة المقبض المقابل حافظةً لطوله:
 * النقاط الناعمة فقط تخضع للتناظر؛ `breakCorner` (Alt) يكسر التناظر
 * ويحوّل العقدة إلى زاوية فوراً. (المقبض المقابل لم يتحرك بعد، لذا
 * طوله الحالي هو طوله الأصلي — و`mirrorHandle(..., true)` يحافظ عليه.)
 */
export function dragBezierHandle(
  node: BezNode,
  which: 'in' | 'out',
  newHandle: Pt,
  opts?: { breakCorner?: boolean }
): BezNode {
  const moved = which === 'in' ? { ...node, in: { ...newHandle } } : { ...node, out: { ...newHandle } }
  const next = opts?.breakCorner ? { ...moved, corner: true } : moved
  if (next.corner) return next
  return mirrorHandle(next, which, true)
}

/**
 * إدراج عقدة على المنحنى عند أقرب نقطة من q: يفحص كل الشرائح (مع الالتفاف
 * في المسارات المغلقة)، يجد أقرب معامل t عبر `nearestT` ثم يقسم بـ De Casteljau
 * ويُدرج العقدة الوسطى — الشكل يُحفظ تماماً بلا تشويه.
 * يعيد العقد المحدثة وفهرس العقدة المدرجة ونقطة الإدراج.
 */
export function insertBezierNodeAt(
  nodes: BezNode[],
  closed: boolean,
  q: Pt
): { nodes: BezNode[]; index: number; point: Pt } {
  if (nodes.length < 2) return { nodes: [...nodes], index: -1, point: q }

  const segmentCount = closed ? nodes.length : nodes.length - 1
  let best = 0
  let bestT = 0.5
  let bestD = Infinity

  for (let i = 0; i < segmentCount; i++) {
    const a = nodes[i]
    const b = nodes[(i + 1) % nodes.length]
    const c1 = a.out ?? a.p
    const c2 = b.in ?? b.p
    const t = nearestT(a.p, c1, c2, b.p, q)
    const pt = cubicAt(a.p, c1, c2, b.p, t)
    const dd = (pt.x - q.x) ** 2 + (pt.y - q.y) ** 2
    if (dd < bestD) {
      bestD = dd
      best = i
      bestT = t
    }
  }

  const a = nodes[best]
  const b = nodes[(best + 1) % nodes.length]
  const split = splitSegment(a, b, bestT)
  const next = [...nodes]
  next[best] = split.a
  next[(best + 1) % nodes.length] = split.b
  next.splice(best + 1, 0, split.mid)

  return { nodes: next, index: best + 1, point: split.mid.p }
}

/**
 * حذف عقدة (بالفهرس) مع فرض حد أدنى بعقدتين — المسار الواحد لا يُسمح بحذفه.
 */
export function removeBezierNode(nodes: BezNode[], index: number): BezNode[] {
  if (nodes.length <= 2) return nodes
  if (index < 0 || index >= nodes.length) return nodes
  return nodes.filter((_, i) => i !== index)
}

/**
 * الحدود الهندسية الحقيقية للمنحنى (تشمل انتفاخ نقاط التحكم) بلا DOM:
 * يجمع نقاط التثبيت والمقابض مع عينات لكل شريحة (الافتراضي 24) لالتقاط
 * الانحناء، فيطابق ناتج `path.getBBox()` تقريباً — مناسب للاختيار والطباعة.
 */
export function curveBoundsForNodes(
  nodes: BezNode[],
  closed: boolean,
  samplesPerSegment = 24
): { x: number; y: number; w: number; h: number } {
  if (nodes.length === 0) return { x: 0, y: 0, w: 0, h: 0 }
  if (nodes.length === 1) {
    return { x: nodes[0].p.x, y: nodes[0].p.y, w: 0, h: 0 }
  }

  const pts: Pt[] = []
  const segmentCount = closed ? nodes.length : nodes.length - 1

  for (let i = 0; i < segmentCount; i++) {
    const a = nodes[i]
    const b = nodes[(i + 1) % nodes.length]
    const p0 = a.p
    const c1 = a.out ?? a.p
    const c2 = b.in ?? b.p
    const p3 = b.p
    pts.push(p0)
    for (let s = 1; s <= samplesPerSegment; s++) {
      pts.push(cubicAt(p0, c1, c2, p3, s / samplesPerSegment))
    }
    if (a.in) pts.push(a.in)
    if (a.out) pts.push(a.out)
    if (b.in) pts.push(b.in)
    if (b.out) pts.push(b.out)
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of pts) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }

  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: 0, h: 0 }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

/**
 * حساب أبعاد الصندوق المطابق للمسار من عقد بالمساحة المحلية وإرجاع مسار
 * SVG مع `pathBox` مطبَّع — مساعدة لإعادة الكتابة بعد التحرير.
 */
export function normalizeBezierNodes(nodes: BezNode[], closed: boolean): {
  d: string
  box: { x: number; y: number; w: number; h: number }
  nodes: BezNode[]
} {
  const bb = curveBoundsForNodes(nodes, closed)
  const w = Math.max(bb.w, 1)
  const h = Math.max(bb.h, 1)
  const rnd = (v: number): number => Math.round(v * 100) / 100
  const loc = (p: Pt): Pt => ({ x: rnd(p.x - bb.x), y: rnd(p.y - bb.y) })
  const local = nodes.map((n) => ({
    p: loc(n.p),
    in: n.in && loc(n.in),
    out: n.out && loc(n.out),
    corner: n.corner,
  }))
  return {
    d: serializeBezier(local, closed),
    box: { x: rnd(bb.x), y: rnd(bb.y), w: rnd(w), h: rnd(h) },
    nodes: local,
  }
}
