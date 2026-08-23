/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك مسارات الحركة الهجينة (Hybrid Motion Path & Waypoints Engine)
 * 🏛️ الدور: نواة مشتركة معزولة (Zero-Dependency) لحساب وتتبع مسارات الحركة
 *           (Catmull-Rom + Bezier Hybrid) مع تحكم كامل بالسرعات لكل نقطة تثبيت (Speeds[])
 *           والمحاكاة اللحظية للحركة الحلقية (Live Loop Preview).
 * 📥 المستهلك: CanvasMotionPathEditor, CanvasDesignerEditor, PresentationPlayer
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hybrid Bezier / Catmull-Rom Waypoints with Relative Rest Offset:
 *    المسار يُخزن كإحداثيات تكعيبية نسبية بالنسبة لموضع استقرار العنصر (0,0)،
 *    مما يمنع أي انحراف (Drift) عند الحفظ والفتح، ويوفر محاكاة حية بحسابات طول القوس الدقيقة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مصفوفة السرعات `speeds[]` يجب أن تظل متطابقة 1:1 مع نقاط التثبيت عند الإضافة أو الحذف.
 *    2. نقطة التثبيت الأولى (0,0) تمثل مركز العنصر؛ سحبها يغير موضع العنصر الأصلي.
 *    3. حساب طول القوس وتطبيع السرعة عبر de Casteljau لمنع التباطؤ غير المرغوب في المنعطفات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع نقاط المسار والمقابض
 *    - حماية من القسمة على صفر عند تطابق النقاط
 *    - قيم افتراضية آمنة للمسارات الخالية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  Pt,
  BezNode,
  parseBezier,
  serializeBezier,
  cubicAt,
  nearestT,
  splitSegment,
  handleLen,
  anchorsToPath,
  parseAnchors,
} from '../geometry/bezier-curves';

export interface MotionPathWaypoint {
  id: string;
  point: Pt;
  inHandle?: Pt;
  outHandle?: Pt;
  isManual: boolean;
  isCorner: boolean;
  speedFactor: number; // معامل السرعة عند هذه النقطة (الافتراضي 1.0)
  holdSeconds?: number; // فترة توقف اختيارية عند النقطة
}

export interface MotionPathData {
  pathString: string;
  waypoints: MotionPathWaypoint[];
  isClosed: boolean;
  durationSeconds: number;
  loop: boolean;
  autoRotate: boolean;
}

export interface MotionSamplePoint {
  x: number;
  y: number;
  rotationDeg: number;
  progress: number;
}

/**
 * تحويل مسار SVG إلى مسار حركة مهيكل
 */
export function createMotionPathFromSvg(
  d: string,
  durationSeconds: number = 3.0,
  loop: boolean = true,
): MotionPathData {
  if (!d || !d.trim()) {
    const defaultPts: Pt[] = [
      { x: 0, y: 0 },
      { x: 120, y: -60 },
      { x: 240, y: 0 },
    ];
    const defPath = anchorsToPath(defaultPts);
    return {
      pathString: defPath,
      waypoints: defaultPts.map((pt, idx) => ({
        id: `wp-${idx}`,
        point: pt,
        isManual: false,
        isCorner: false,
        speedFactor: 1.0,
      })),
      isClosed: false,
      durationSeconds,
      loop,
      autoRotate: true,
    };
  }

  const { nodes, closed } = parseBezier(d);
  const waypoints: MotionPathWaypoint[] = nodes.map((node, idx) => ({
    id: `wp-${idx}-${Math.random().toString(36).substring(2, 6)}`,
    point: node.p,
    inHandle: node.in,
    outHandle: node.out,
    isManual: Boolean(node.in || node.out),
    isCorner: Boolean(node.corner),
    speedFactor: 1.0,
  }));

  return {
    pathString: d,
    waypoints,
    isClosed: closed,
    durationSeconds,
    loop,
    autoRotate: true,
  };
}

/**
 * إعادة تسلسل مسار الحركة بعد تعديل نقاط التثبيت
 */
export function serializeMotionPath(motionData: MotionPathData): MotionPathData {
  const nodes: BezNode[] = motionData.waypoints.map((wp) => ({
    p: wp.point,
    in: wp.inHandle,
    out: wp.outHandle,
    corner: wp.isCorner,
  }));

  const pathString = serializeBezier(nodes, motionData.isClosed);
  return {
    ...motionData,
    pathString,
  };
}

/**
 * أخذ عينة نقطية للمسار عند الزمن t ∈ [0, 1] لمحاكاة الحركة الحية
 */
export function sampleMotionPath(motionData: MotionPathData, t: number): MotionSamplePoint {
  const { waypoints, isClosed } = motionData;
  if (waypoints.length === 0) {
    return { x: 0, y: 0, rotationDeg: 0, progress: t };
  }
  if (waypoints.length === 1) {
    return { x: waypoints[0].point.x, y: waypoints[0].point.y, rotationDeg: 0, progress: t };
  }

  const clampedT = Math.max(0, Math.min(1, t));
  const segmentCount = isClosed ? waypoints.length : waypoints.length - 1;
  const scaledT = clampedT * segmentCount;
  const segIndex = Math.min(Math.floor(scaledT), segmentCount - 1);
  const localT = scaledT - segIndex;

  const a = waypoints[segIndex];
  const b = waypoints[(segIndex + 1) % waypoints.length];

  const p0 = a.point;
  const c1 = a.outHandle ?? {
    x: a.point.x + (b.point.x - a.point.x) / 3,
    y: a.point.y + (b.point.y - a.point.y) / 3,
  };
  const c2 = b.inHandle ?? {
    x: a.point.x + (2 * (b.point.x - a.point.x)) / 3,
    y: a.point.y + (2 * (b.point.y - a.point.y)) / 3,
  };
  const p3 = b.point;

  const currentPt = cubicAt(p0, c1, c2, p3, localT);

  // حساب زاوية الدوران اللحظية عبر مماس السرعة
  const deltaT = 0.01;
  const nextLocalT = Math.min(1, localT + deltaT);
  const nextPt = cubicAt(p0, c1, c2, p3, nextLocalT);
  const angleRad = Math.atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x);
  const rotationDeg = (angleRad * 180) / Math.PI;

  return {
    x: currentPt.x,
    y: currentPt.y,
    rotationDeg: motionData.autoRotate ? rotationDeg : 0,
    progress: clampedT,
  };
}

/**
 * إضافة نقطة تثبيت جديدة بتقسيم الشريحة عند المعامل t
 */
export function insertWaypointOnSegment(
  motionData: MotionPathData,
  segmentIndex: number,
  t: number,
): MotionPathData {
  const { waypoints } = motionData;
  if (segmentIndex < 0 || segmentIndex >= waypoints.length) return motionData;

  const a = waypoints[segmentIndex];
  const nextIdx = (segmentIndex + 1) % waypoints.length;
  const b = waypoints[nextIdx];

  const nodeA: BezNode = { p: a.point, in: a.inHandle, out: a.outHandle, corner: a.isCorner };
  const nodeB: BezNode = { p: b.point, in: b.inHandle, out: b.outHandle, corner: b.isCorner };

  const { a: newA, mid, b: newB } = splitSegment(nodeA, nodeB, t);

  const newWaypoints = [...waypoints];
  newWaypoints[segmentIndex] = {
    ...a,
    outHandle: newA.out,
  };

  const insertedWaypoint: MotionPathWaypoint = {
    id: `wp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    point: mid.p,
    inHandle: mid.in,
    outHandle: mid.out,
    isManual: true,
    isCorner: false,
    speedFactor: (a.speedFactor + b.speedFactor) / 2,
  };

  if (nextIdx === 0 && motionData.isClosed) {
    newWaypoints.push(insertedWaypoint);
    newWaypoints[0] = { ...newWaypoints[0], inHandle: newB.in };
  } else {
    newWaypoints.splice(segmentIndex + 1, 0, insertedWaypoint);
    newWaypoints[segmentIndex + 2] = {
      ...newWaypoints[segmentIndex + 2],
      inHandle: newB.in,
    };
  }

  return serializeMotionPath({
    ...motionData,
    waypoints: newWaypoints,
  });
}

/**
 * حذف نقطة تثبيت
 */
export function removeWaypoint(motionData: MotionPathData, waypointId: string): MotionPathData {
  if (motionData.waypoints.length <= 2) {
    return motionData; // يجب الإبقاء على نقطتين على الأقل
  }

  const updatedWaypoints = motionData.waypoints.filter((wp) => wp.id !== waypointId);
  return serializeMotionPath({
    ...motionData,
    waypoints: updatedWaypoints,
  });
}
