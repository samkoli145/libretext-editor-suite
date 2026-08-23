/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: محرك نقاط التثبيت الهجينة لمسارات الحركة (Hybrid Motion-Path Waypoint Tooling Engine)
 * 🏛️ الدور: نواة معزولة (Zero-Dependency) فوق motion-path-engine تُضيف نموذج
 *           نقاط التثبيت الهجين AUTO/MANUAL: التمليس التلقائي Catmull-Rom
 *           صفر المضايقة، تصنيف النقاط (من أين تكون يدوية)، تحليل المقابض
 *           الفعلية وقت التسلسل، والتحكم بالسرعات لكل نقطة (1:1).
 * 📥 المستهلك: CanvasMotionPathEditor, CanvasDesignerEditor, PresentationPlayer, ToolRegistry
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hybrid Auto/Manual Waypoints (Backward-Compatible Derivation):
 *    كل نقطة تثبيت إما AUTO (مقابضها تُشتق من مماسات Catmull-Rom وقت الحفظ —
 *    مسار مساوٍ بايتياً لمخرجات anchorsToPath) أو MANUAL (مقابض صريحة دقيقة،
 *    بلا عينات ولا إعادة تمليس ولا انحراف). التصنيف يحفظ المسارات القديمة
 *    مسارات AUTO كاملة إذا كانت مقابضها داخل 0.6px من المماسات المشتقة،
 *    ويُبقي المسارات المضبوطة يدوياً كما هي تماماً.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مصفوفة `speeds[]` يجب أن تظل 1:1 مع نقاط التثبيت عبر كل إدراج/حذف/تقسيم.
 *    2. نقطة التثبيت الأولى (0,0) هي موضع استقرار العنصر — سحبها ينقل العنصر
 *       نفسه وليس نقطة مسار.
 *    3. العقدة AUTO تُصنف يدوية فور سحب مقبضها — وإلا ستعيد المشتقة تشكيلها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تصنيف صفر المسار (لا عقد) → مصفوفة فارغة بلا انهيار
 *    - نطاق السرعة محصور دائماً في [0.2, 4] بخطوات 0.1
 *    - `near` يعالج غياب المقابض (undefined) بأمان دون مقارنة null
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/editor/patheditor.ts (The Bento authors, MIT).
 * استُخرجت خوارزميات AUTO/MANUAL والسرعات إلى نواة مشتركة فوق محرك
 * مسارات الحركة الحالي.
 */

import { type BezNode, type Pt, parseBezier, serializeBezier } from '../geometry/bezier-curves';
import { type MotionPathWaypoint } from './motion-path-engine';

export const SPEED_MIN = 0.2;
export const SPEED_MAX = 4;
export const SPEED_STEP = 0.1;
export const AUTO_NEAR_EPSILON = 0.6;

/** مماسات Catmull-Rom لنقطة التثبيت i — مطابقة تماماً لمخرجات anchorsToPath:
 *  out = P + (Pnext − Pprev)/6، in = P − (Pnext − Pprev)/6 (النهايات مثبتة). */
export function autoHandlesForWaypoints(pts: Pt[], i: number): { in?: Pt; out?: Pt } {
  const n = pts.length;
  if (n === 0) return {};
  const prev = pts[Math.max(0, i - 1)];
  const next = pts[Math.min(n - 1, i + 1)];
  const dx = (next.x - prev.x) / 6;
  const dy = (next.y - prev.y) / 6;
  const p = pts[i];
  return {
    in: i > 0 ? { x: p.x - dx, y: p.y - dy } : undefined,
    out: i < n - 1 ? { x: p.x + dx, y: p.y + dy } : undefined,
  };
}

/**
 * تحليل المقابض الفعلية لكل نقطة: اليدوية تُبقي مقابضها الصريحة، والـ AUTO
 * تأخذ مماسات Catmull-Rom المشتقة — الناتج يغذي التسلسل والقطع والمحاكاة.
 */
export function resolveEffectiveWaypoints(waypoints: MotionPathWaypoint[]): BezNode[] {
  const pts = waypoints.map((w) => w.point);
  return waypoints.map((w, i) => {
    if (w.isManual) {
      return {
        p: { ...w.point },
        in: w.inHandle && { ...w.inHandle },
        out: w.outHandle && { ...w.outHandle },
      };
    }
    const a = autoHandlesForWaypoints(pts, i);
    return { p: { ...w.point }, in: a.in, out: a.out };
  });
}

/** تسلسل نقاط التثبيت الهجينة إلى مسار SVG (C مفتوح أو مغلق). */
export function hybridWaypointsToPath(waypoints: MotionPathWaypoint[], closed: boolean): string {
  if (waypoints.length === 0) return '';
  return serializeBezier(resolveEffectiveWaypoints(waypoints), closed);
}

/**
 * تصنيف مسار محفوظ إلى نقاط تثبيت هجينة AUTO/MANUAL مع سرعات افتراضية 1.0:
 * مسار بلا أوامر منحنى (مضلع بسيط) → كله AUTO؛ وعند وجود منحنيات تُعتبر
 * النقطة AUTO فقط إذا كانت مقابضها داخل 0.6px من مماسات Catmull-Rom —
 * فتُعاد المسارات القديمة AUTO كاملة وتحفظ المسارات المضبوطة يدوياً بدقة.
 */
export function classifyHybridWaypoints(pathString: string): MotionPathWaypoint[] {
  if (!pathString || !pathString.trim()) return [];
  const { nodes, closed } = parseBezier(pathString);
  const hadCurves = /[csq]/i.test(pathString);
  const pts = nodes.map((n) => n.p);

  return nodes.map((n, i) => {
    if (!hadCurves) {
      return {
        id: `wp-${i}`,
        point: { ...n.p },
        isManual: false,
        isCorner: false,
        speedFactor: 1.0,
      };
    }
    const a = autoHandlesForWaypoints(pts, i);
    const near = (p?: Pt, q?: Pt): boolean =>
      (!p && !q) || (!!p && !!q && Math.hypot(p.x - q.x, p.y - q.y) < AUTO_NEAR_EPSILON);
    const auto = near(n.in, a.in) && near(n.out, a.out);
    return auto
      ? { id: `wp-${i}`, point: { ...n.p }, isManual: false, isCorner: false, speedFactor: 1.0 }
      : {
          id: `wp-${i}`,
          point: { ...n.p },
          inHandle: n.in && { ...n.in },
          outHandle: n.out && { ...n.out },
          isManual: true,
          isCorner: Boolean(n.corner),
          speedFactor: 1.0,
        };
  });
}

/**
 * تحويل نقاط التثبيت إلى BezNode (بدون مقابض AUTO) مع الحفاظ على تمييز
 * `manual` الداخلي للمعالجات المتقدمة.
 */
export function waypointsToBezNodes(
  waypoints: MotionPathWaypoint[],
): Array<BezNode & { manual?: boolean }> {
  return waypoints.map((w) => ({
    p: { ...w.point },
    in: w.inHandle && { ...w.inHandle },
    out: w.outHandle && { ...w.outHandle },
    corner: w.isCorner,
    manual: w.isManual,
  }));
}

/** ضبط سرعة نقطة (بمطابقة المعرّف) مع حصر نطاق [0.2, 4] وستيب 0.1. */
export function setWaypointSpeed(
  waypoints: MotionPathWaypoint[],
  waypointId: string,
  speed: number,
): MotionPathWaypoint[] {
  const clamped = Math.round(clampSpeed(speed) / SPEED_STEP) * SPEED_STEP;
  return waypoints.map((w) =>
    w.id === waypointId ? { ...w, speedFactor: roundSpeed(clamped) } : w,
  );
}

/** مضاعفة سرعة نقطة (تمرير العجلة) بخطوة ثابتة 0.1 ضمن النطاق الآمن. */
export function nudgeWaypointSpeed(
  waypoints: MotionPathWaypoint[],
  waypointId: string,
  delta: number,
): MotionPathWaypoint[] {
  const target = waypoints.find((w) => w.id === waypointId)?.speedFactor ?? 1.0;
  return setWaypointSpeed(waypoints, waypointId, target + delta * SPEED_STEP);
}

/** حصر قيمة السرعة في النطاق المسموح [0.2, 4]. */
export function clampSpeed(speed: number): number {
  if (!Number.isFinite(speed)) return 1.0;
  return Math.max(SPEED_MIN, Math.min(SPEED_MAX, speed));
}

/** تقريب السرعة لدرجة عشرية واحدة (تمنع خطأ الفاصلة العائمة). */
export function roundSpeed(speed: number): number {
  return Math.round(speed * 10) / 10;
}

/**
 * تحويل نقطة إلى زاوية (كسر التناظر) أو العكس — Alt-click:
 * المقابض الصريحة تبقى محفوظة، والـ AUTO تتحول إلى MANUAL عند كسرها.
 */
export function toggleWaypointCorner(waypoint: MotionPathWaypoint): MotionPathWaypoint {
  return { ...waypoint, isCorner: !waypoint.isCorner, isManual: true };
}
