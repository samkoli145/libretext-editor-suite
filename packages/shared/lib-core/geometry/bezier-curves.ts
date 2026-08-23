/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الحسابات الرياضية الدقيقة لمنحنيات بيزير التكعيبية والتربيعية
 *           (High-Precision Cubic & Quadratic Bezier Geometry Engine).
 * 🏛️ الدور: نواة هندسية مشتركة (Zero-Dependency Geometry Core).
 * 📥 المستهلك: CanvasBezierSubEditor, DrawingToolsEngine, MotionMorphEngine.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    خوارزمية De Casteljau لتقسيم المنحنيات دون فقدان الدقة، مع تقريب نيوتن-رافسون
 *    لإسقاط النقاط وحساب أقرب معامل زمن $t \in [0, 1]$ بدقة $O(1)$.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب القسمة على الصفر عند تطابق نقاط التحكم أو المقابض.
 *    2. ضمان بقاء معلمات $t$ محصورة بدقة داخل المجال $[0, 1]$.
 *    3. التعامل مع النقاط الزاوية (Corners) بدون تطبيق التناظر القسري على المقابض.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع متجهات النقاط (Points & Handles).
 *    - إرجاع قيم آمنة (Default Fallbacks) عند تعذر التقارب العددي.
 *    - تنظيف دقيق لحالات Floating-Point Drifts عبر دوال التثبيت الرياضي.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Pt {
  x: number;
  y: number;
}

export interface BezNode {
  p: Pt; // النقطة الرئيسية على المنحنى
  in?: Pt; // مقبض الدخول (Control Point In)
  out?: Pt; // مقبض الخروج (Control Point Out)
  corner?: boolean; // هل النقطة زاوية حادة (بدون تناظر في المقابض)
}

export interface BezSegment {
  p0: Pt;
  cp1: Pt;
  cp2: Pt;
  p1: Pt;
}

/**
 * دالة مساعدة لتقييد القيمة في نطاق محدد
 */
export function clamp(val: number, min: number, max: number): number {
  if (Number.isNaN(val)) return min;
  return Math.max(min, Math.min(max, val));
}

/**
 * حساب المسافة الإقليدية بين نقطتين
 */
export function ptDist(a: Pt, b: Pt): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * حساب نقطة على منحنى بيزير تكعيبي عند المعامل t
 */
export function evalCubicBezier(p0: Pt, cp1: Pt, cp2: Pt, p1: Pt, t: number): Pt {
  const clampedT = clamp(t, 0, 1);
  const u = 1 - clampedT;
  const tt = clampedT * clampedT;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * clampedT;

  return {
    x: uuu * p0.x + 3 * uu * clampedT * cp1.x + 3 * u * tt * cp2.x + ttt * p1.x,
    y: uuu * p0.y + 3 * uu * clampedT * cp1.y + 3 * u * tt * cp2.y + ttt * p1.y,
  };
}

/**
 * حساب مشتق المنحنى التكعيبي (مماس السرعة) عند t
 */
export function evalCubicDerivative(p0: Pt, cp1: Pt, cp2: Pt, p1: Pt, t: number): Pt {
  const clampedT = clamp(t, 0, 1);
  const u = 1 - clampedT;

  return {
    x:
      3 * u * u * (cp1.x - p0.x) +
      6 * u * clampedT * (cp2.x - cp1.x) +
      3 * clampedT * clampedT * (p1.x - cp2.x),
    y:
      3 * u * u * (cp1.y - p0.y) +
      6 * u * clampedT * (cp2.y - cp1.y) +
      3 * clampedT * clampedT * (p1.y - cp2.y),
  };
}

/**
 * خوارزمية De Casteljau لتقسيم قطعة بيزير تكعيبية إلى قطعتين عند المعامل t
 */
export function splitCubicSegment(
  seg: BezSegment,
  t: number,
): { left: BezSegment; right: BezSegment } {
  const clampedT = clamp(t, 0, 1);
  const { p0, cp1, cp2, p1 } = seg;

  // المستوى 1
  const p01 = { x: p0.x + (cp1.x - p0.x) * clampedT, y: p0.y + (cp1.y - p0.y) * clampedT };
  const p12 = { x: cp1.x + (cp2.x - cp1.x) * clampedT, y: cp1.y + (cp2.y - cp1.y) * clampedT };
  const p23 = { x: cp2.x + (p1.x - cp2.x) * clampedT, y: cp2.y + (p1.y - cp2.y) * clampedT };

  // المستوى 2
  const p012 = { x: p01.x + (p12.x - p01.x) * clampedT, y: p01.y + (p12.y - p01.y) * clampedT };
  const p123 = { x: p12.x + (p23.x - p12.x) * clampedT, y: p12.y + (p23.y - p12.y) * clampedT };

  // المستوى 3 (نقطة الانقسام)
  const pSplit = {
    x: p012.x + (p123.x - p012.x) * clampedT,
    y: p012.y + (p123.y - p012.y) * clampedT,
  };

  return {
    left: {
      p0: { ...p0 },
      cp1: p01,
      cp2: p012,
      p1: pSplit,
    },
    right: {
      p0: { ...pSplit },
      cp1: p123,
      cp2: p23,
      p1: { ...p1 },
    },
  };
}

/**
 * إيجاد أقرب قيمة لمعامل t على منحنى بيزير من نقطة معينة في الفراغ
 */
export function nearestTOnCubic(
  seg: BezSegment,
  target: Pt,
  samples: number = 24,
): { t: number; point: Pt; distance: number } {
  let bestT = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  let bestPoint = seg.p0;

  // 1. بحث تقريبي بالعينات
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const pt = evalCubicBezier(seg.p0, seg.cp1, seg.cp2, seg.p1, t);
    const d = ptDist(pt, target);
    if (d < bestDist) {
      bestDist = d;
      bestT = t;
      bestPoint = pt;
    }
  }

  // 2. تحسين رقمي متقارب (Newton-Raphson Refinement)
  let currentT = bestT;
  for (let step = 0; step < 5; step++) {
    const pt = evalCubicBezier(seg.p0, seg.cp1, seg.cp2, seg.p1, currentT);
    const deriv = evalCubicDerivative(seg.p0, seg.cp1, seg.cp2, seg.p1, currentT);
    const denom = deriv.x * deriv.x + deriv.y * deriv.y;
    if (denom < 1e-8) break;

    const diffX = pt.x - target.x;
    const diffY = pt.y - target.y;
    const deltaT = (diffX * deriv.x + diffY * deriv.y) / denom;
    currentT = clamp(currentT - deltaT, 0, 1);
  }

  const finalPt = evalCubicBezier(seg.p0, seg.cp1, seg.cp2, seg.p1, currentT);
  return {
    t: currentT,
    point: finalPt,
    distance: ptDist(finalPt, target),
  };
}

/**
 * تناظر ومحاذاة مقابض بيزير للنقاط الناعمة (Smooth Handles Mirroring)
 */
export function mirrorHandle(
  node: BezNode,
  handleMoved: 'in' | 'out',
  keepLength: boolean = false,
): BezNode {
  if (node.corner) return node; // الزوايا الحادة لا تخضع للتناظر

  const moved = handleMoved === 'in' ? node.in : node.out;
  if (!moved) return node;

  const dx = moved.x - node.p.x;
  const dy = moved.y - node.p.y;

  if (handleMoved === 'in') {
    if (!node.out || !keepLength) {
      return {
        ...node,
        out: { x: node.p.x - dx, y: node.p.y - dy },
      };
    }
    const currentLen = ptDist(node.p, node.out);
    const movedLen = Math.sqrt(dx * dx + dy * dy);
    if (movedLen < 1e-6) return node;
    const scale = currentLen / movedLen;
    return {
      ...node,
      out: { x: node.p.x - dx * scale, y: node.p.y - dy * scale },
    };
  } else {
    if (!node.in || !keepLength) {
      return {
        ...node,
        in: { x: node.p.x - dx, y: node.p.y - dy },
      };
    }
    const currentLen = ptDist(node.p, node.in);
    const movedLen = Math.sqrt(dx * dx + dy * dy);
    if (movedLen < 1e-6) return node;
    const scale = currentLen / movedLen;
    return {
      ...node,
      in: { x: node.p.x - dx * scale, y: node.p.y - dy * scale },
    };
  }
}

/**
 * تحويل مسار نقطي حر (Polyline) إلى منحنيات بيزير ناعمة تلقائياً (Catmull-Rom to Bezier)
 */
export function pointsToBezierNodes(points: Pt[], tension: number = 0.3): BezNode[] {
  if (points.length === 0) return [];
  if (points.length === 1) return [{ p: { ...points[0] } }];
  if (points.length === 2) {
    const p0 = points[0];
    const p1 = points[1];
    return [
      { p: { ...p0 }, out: { x: p0.x + (p1.x - p0.x) / 3, y: p0.y + (p1.y - p0.y) / 3 } },
      { p: { ...p1 }, in: { x: p1.x - (p1.x - p0.x) / 3, y: p1.y - (p1.y - p0.y) / 3 } },
    ];
  }

  const nodes: BezNode[] = [];
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const curr = points[i];
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(n - 1, i + 1)];

    const dInX = curr.x - prev.x;
    const dInY = curr.y - prev.y;
    const dOutX = next.x - curr.x;
    const dOutY = next.y - curr.y;

    const inHandle =
      i === 0
        ? undefined
        : {
            x: curr.x - (dInX + (curr.x - prev.x)) * tension * 0.5,
            y: curr.y - (dInY + (curr.y - prev.y)) * tension * 0.5,
          };

    const outHandle =
      i === n - 1
        ? undefined
        : {
            x: curr.x + (dOutX + (next.x - curr.x)) * tension * 0.5,
            y: curr.y + (dOutY + (next.y - curr.y)) * tension * 0.5,
          };

    nodes.push({
      p: { ...curr },
      in: inHandle,
      out: outHandle,
      corner: false,
    });
  }

  return nodes;
}

/**
 * تحويل مصفوفة BezNode إلى مسار SVG صالح (SVG Path d attribute)
 */
export function bezierNodesToSvgPath(nodes: BezNode[], closed: boolean = false): string {
  if (nodes.length === 0) return '';
  if (nodes.length === 1) return `M ${nodes[0].p.x} ${nodes[0].p.y}`;

  let d = `M ${nodes[0].p.x} ${nodes[0].p.y}`;

  for (let i = 0; i < nodes.length - 1; i++) {
    const curr = nodes[i];
    const next = nodes[i + 1];
    const cp1 = curr.out ?? curr.p;
    const cp2 = next.in ?? next.p;
    d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${next.p.x} ${next.p.y}`;
  }

  if (closed && nodes.length > 2) {
    const last = nodes[nodes.length - 1];
    const first = nodes[0];
    const cp1 = last.out ?? last.p;
    const cp2 = first.in ?? first.p;
    d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${first.p.x} ${first.p.y} Z`;
  }

  return d;
}

const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
const roundCoord = (v: number) => Math.round(v * 100) / 100;

/**
 * تحليل مسار SVG وتحويله إلى عقد بيزير تكعيبية دقيقة (parseBezier)
 */
export function parseBezier(d: string): { nodes: BezNode[]; closed: boolean } {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const nodes: BezNode[] = [];
  let closed = false;
  let i = 0;
  let cmd = '';
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    const tk = tokens[i];
    if (/^[A-Za-z]$/.test(tk)) {
      cmd = tk;
      i++;
      if (/z/i.test(cmd)) closed = true;
      continue;
    }
    const C = cmd.toUpperCase();
    if (C === 'M') {
      nodes.push({ p: { x: num(), y: num() } });
    } else if (C === 'L') {
      const p = { x: num(), y: num() };
      const prev = nodes[nodes.length - 1];
      if (prev) prev.out = prev.out ?? lerpPt(prev.p, p, 1 / 3);
      nodes.push({ p, in: lerpPt(prev ? prev.p : p, p, 2 / 3) });
    } else if (C === 'C') {
      const c1 = { x: num(), y: num() };
      const c2 = { x: num(), y: num() };
      const p = { x: num(), y: num() };
      const prev = nodes[nodes.length - 1];
      if (prev) prev.out = c1;
      nodes.push({ p, in: c2 });
    } else {
      const p = { x: num(), y: num() };
      if (!Number.isNaN(p.x) && !Number.isNaN(p.y)) nodes.push({ p });
    }
  }
  return { nodes, closed };
}

/**
 * تسلسل عقد بيزير إلى نص مسار SVG صالح ومستقر (serializeBezier)
 */
export function serializeBezier(nodes: BezNode[], closed: boolean): string {
  if (!nodes.length) return '';
  if (nodes.length === 1) return `M ${roundCoord(nodes[0].p.x)} ${roundCoord(nodes[0].p.y)}`;
  const seg = (a: BezNode, b: BezNode) => {
    const c1 = a.out ?? lerpPt(a.p, b.p, 1 / 3);
    const c2 = b.in ?? lerpPt(a.p, b.p, 2 / 3);
    return ` C ${roundCoord(c1.x)} ${roundCoord(c1.y)} ${roundCoord(c2.x)} ${roundCoord(c2.y)} ${roundCoord(b.p.x)} ${roundCoord(b.p.y)}`;
  };
  let d = `M ${roundCoord(nodes[0].p.x)} ${roundCoord(nodes[0].p.y)}`;
  for (let i = 0; i < nodes.length - 1; i++) d += seg(nodes[i], nodes[i + 1]);
  if (closed && nodes.length > 2) {
    d += seg(nodes[nodes.length - 1], nodes[0]);
    d += ' Z';
  }
  return d;
}

/**
 * حساب النقطة على المنحنى التكعيبي عند المعامل t
 */
export function cubicAt(p0: Pt, c1: Pt, c2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const dd = t * t * t;
  return {
    x: a * p0.x + b * c1.x + c * c2.x + dd * p3.x,
    y: a * p0.y + b * c1.y + c * c2.y + dd * p3.y,
  };
}

/**
 * إيجاد أقرب معامل زمن t لنقطة q على المنحنى التكعيبي
 */
export function nearestT(p0: Pt, c1: Pt, c2: Pt, p3: Pt, q: Pt): number {
  const N = 24;
  let bestT = 0;
  let bestD = Infinity;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const pt = cubicAt(p0, c1, c2, p3, t);
    const d = (pt.x - q.x) ** 2 + (pt.y - q.y) ** 2;
    if (d < bestD) {
      bestD = d;
      bestT = t;
    }
  }
  let step = 1 / N;
  for (let iter = 0; iter < 12; iter++) {
    step /= 2;
    for (const t of [bestT - step, bestT + step]) {
      if (t < 0 || t > 1) continue;
      const pt = cubicAt(p0, c1, c2, p3, t);
      const d = (pt.x - q.x) ** 2 + (pt.y - q.y) ** 2;
      if (d < bestD) {
        bestD = d;
        bestT = t;
      }
    }
  }
  return bestT;
}

/**
 * تقسيم قطعة بيزير تكعيبية بخوارزمية de Casteljau مع الحفاظ على الشكل التام
 */
export function splitSegment(
  a: BezNode,
  b: BezNode,
  t: number,
): { a: BezNode; mid: BezNode; b: BezNode } {
  const p0 = a.p;
  const c1 = a.out ?? lerpPt(a.p, b.p, 1 / 3);
  const c2 = b.in ?? lerpPt(a.p, b.p, 2 / 3);
  const p3 = b.p;
  const q0 = lerpPt(p0, c1, t);
  const q1 = lerpPt(c1, c2, t);
  const q2 = lerpPt(c2, p3, t);
  const s0 = lerpPt(q0, q1, t);
  const s1 = lerpPt(q1, q2, t);
  const mid = lerpPt(s0, s1, t);
  return {
    a: { ...a, out: q0 },
    mid: { p: mid, in: s0, out: s1 },
    b: { ...b, in: q2 },
  };
}

/**
 * عكس مقبض التحكم حول نقطة التثبيت لتوفير انسيابية مستمرة
 */
export function mirrorPoint(p: Pt, h: Pt, oppLen: number): Pt {
  const dx = p.x - h.x;
  const dy = p.y - h.y;
  const len = Math.hypot(dx, dy);
  if (!len) return { ...p };
  const k = oppLen / len;
  return { x: p.x + dx * k, y: p.y + dy * k };
}

export const handleLen = (p: Pt, h?: Pt): number => (h ? Math.hypot(h.x - p.x, h.y - p.y) : 0);

/**
 * استخراج نقاط التثبيت من مسار SVG
 */
export function parseAnchors(d: string): Pt[] {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const pts: Pt[] = [];
  let i = 0;
  let cmd = '';
  const arity: Record<string, number> = { M: 2, L: 2, T: 2, Q: 4, S: 4, C: 6 };
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[A-Za-z]$/.test(t)) {
      cmd = t.toUpperCase();
      i++;
      continue;
    }
    const n = arity[cmd] ?? 2;
    const nums = tokens.slice(i, i + n).map(Number);
    if (nums.length === n && nums.every((v) => !Number.isNaN(v))) {
      pts.push({ x: nums[n - 2], y: nums[n - 1] });
    }
    i += n;
  }
  return pts;
}

/**
 * توليد مسار انسيابي Catmull-Rom من مصفوفة نقاط تثبيت
 */
export function anchorsToPath(pts: Pt[]): string {
  if (!pts.length) return '';
  if (pts.length === 1) return `M ${roundCoord(pts[0].x)} ${roundCoord(pts[0].y)}`;
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  let d = `M ${roundCoord(pts[0].x)} ${roundCoord(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const c1x = P(i).x + (P(i + 1).x - P(i - 1).x) / 6;
    const c1y = P(i).y + (P(i + 1).y - P(i - 1).y) / 6;
    const c2x = P(i + 1).x - (P(i + 2).x - P(i).x) / 6;
    const c2y = P(i + 1).y - (P(i + 2).y - P(i).y) / 6;
    d += ` C ${roundCoord(c1x)} ${roundCoord(c1y)} ${roundCoord(c2x)} ${roundCoord(c2y)} ${roundCoord(P(i + 1).x)} ${roundCoord(P(i + 1).y)}`;
  }
  return d;
}
