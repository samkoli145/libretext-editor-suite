/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مدير مقابض التحكم والتحويل الفيكتوري - Control Handle Manager
 * 🏛️ الدور: محرك مشترك - توليد وإدارة مقابض التحجيم والتدوير ونقاط بيزييه
 * 📥 المستهلك: CanvasDesignerEditor, PathEditor, VectorShapeEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    8-Point Handle System: 8 مقابض تحجيم + مقبض تدوير + نقاط بيزييه
 *    مع مؤشرات بصرية وحسابات دقيقة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المقابض يجب أن تكون دقيقة (لا أرقام متحركة)
 *    2. التدوير يجب أن يكون حول المركز
 *    3. نقاط بيزييه يجب ألا تتداخل مع العنصر
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الأبعاد قبل توليد المقابض
 *    - حماية ضد القسمة على صفر
 *    - تنظيف المقابض القديمة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  type Point2D,
  type BoundingBox,
  degToRad,
  radToDeg,
  rotatePoint,
  distance,
  angle,
  clamp,
} from './common';
import type { VectorPathData } from './path_editor';

export type HandleType =
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'
  | 'rotation'
  | 'vertex'
  | 'inHandle'
  | 'outHandle'
  | 'radius';

export interface ControlHandle {
  id: string;
  type: HandleType;
  x: number;
  y: number;
  cursor: string;
  targetId: string;
  vertexId?: string;
  data?: Record<string, any>;
}

/**
 * حساب مؤشر الفأرة المناسب لنوع المقبض وزاوية التدوير الحالية
 */
export function getCursorForHandle(type: HandleType, rotationDeg: number = 0): string {
  if (type === 'rotation') return 'grab';
  if (type === 'vertex' || type === 'inHandle' || type === 'outHandle') return 'crosshair';
  if (type === 'radius') return 'pointer';

  const baseAngles: Record<string, number> = {
    n: 0,
    ne: 45,
    e: 90,
    se: 135,
    s: 180,
    sw: 225,
    w: 270,
    nw: 315,
  };

  const baseAngle = baseAngles[type] ?? 0;
  const totalAngle = ((baseAngle + rotationDeg) % 360 + 360) % 360;

  if ((totalAngle >= 337.5 || totalAngle < 22.5) || (totalAngle >= 157.5 && totalAngle < 202.5)) {
    return 'ns-resize';
  } else if ((totalAngle >= 22.5 && totalAngle < 67.5) || (totalAngle >= 202.5 && totalAngle < 247.5)) {
    return 'nesw-resize';
  } else if ((totalAngle >= 67.5 && totalAngle < 112.5) || (totalAngle >= 247.5 && totalAngle < 292.5)) {
    return 'ew-resize';
  } else {
    return 'nwse-resize';
  }
}

/**
 * توليد مقابض التحويل والتحجيم الثمانية بالإضافة لمقبض التدوير
 */
export function getTransformHandles(
  box: BoundingBox,
  rotationDeg: number = 0,
  targetId: string = 'element'
): ControlHandle[] {
  const center: Point2D = { x: box.centerX, y: box.centerY };
  const rad = degToRad(rotationDeg);

  const rawHandles: Array<{ type: HandleType; point: Point2D }> = [
    { type: 'nw', point: { x: box.minX, y: box.minY } },
    { type: 'n', point: { x: box.centerX, y: box.minY } },
    { type: 'ne', point: { x: box.maxX, y: box.minY } },
    { type: 'e', point: { x: box.maxX, y: box.centerY } },
    { type: 'se', point: { x: box.maxX, y: box.maxY } },
    { type: 's', point: { x: box.centerX, y: box.maxY } },
    { type: 'sw', point: { x: box.minX, y: box.maxY } },
    { type: 'w', point: { x: box.minX, y: box.centerY } },
    // مقبض التدوير أعلى المركز بمقدار 24px
    { type: 'rotation', point: { x: box.centerX, y: box.minY - 24 } },
  ];

  return rawHandles.map((h) => {
    const rotated = rotationDeg !== 0 ? rotatePoint(h.point, center, rad) : h.point;
    return {
      id: `${targetId}-handle-${h.type}`,
      type: h.type,
      x: rotated.x,
      y: rotated.y,
      cursor: getCursorForHandle(h.type, rotationDeg),
      targetId,
    };
  });
}

/**
 * توليد مقابض الرؤوس ومقابض بيزييه للمسار الفيكتوري
 */
export function getVertexHandles(path: VectorPathData): ControlHandle[] {
  const handles: ControlHandle[] = [];

  for (const vtx of path.vertices) {
    // 1. مقبض الرأس الأساسي (Anchor Point)
    handles.push({
      id: `${path.id}-vtx-${vtx.id}`,
      type: 'vertex',
      x: vtx.point.x,
      y: vtx.point.y,
      cursor: 'crosshair',
      targetId: path.id,
      vertexId: vtx.id,
      data: { vertex: vtx },
    });

    // 2. مقبض التحكم الوارد (In Handle)
    if (vtx.inHandle) {
      handles.push({
        id: `${path.id}-in-${vtx.id}`,
        type: 'inHandle',
        x: vtx.inHandle.x,
        y: vtx.inHandle.y,
        cursor: 'crosshair',
        targetId: path.id,
        vertexId: vtx.id,
      });
    }

    // 3. مقبض التحكم الصادر (Out Handle)
    if (vtx.outHandle) {
      handles.push({
        id: `${path.id}-out-${vtx.id}`,
        type: 'outHandle',
        x: vtx.outHandle.x,
        y: vtx.outHandle.y,
        cursor: 'crosshair',
        targetId: path.id,
        vertexId: vtx.id,
      });
    }
  }

  return handles;
}

/**
 * فحص التقاط المقبض بنقطة الفأرة (Hit Testing)
 */
export function hitTestHandles(
  handles: ControlHandle[],
  point: Point2D,
  tolerance: number = 8
): ControlHandle | null {
  for (const handle of handles) {
    if (distance(point, { x: handle.x, y: handle.y }) <= tolerance) {
      return handle;
    }
  }
  return null;
}

/**
 * حساب أبعاد وموضع الصندوق المحيط الجديد بعد التحجيم
 */
export function calculateResizeDelta(
  handle: HandleType,
  startBox: BoundingBox,
  currentPoint: Point2D,
  startPoint: Point2D,
  lockAspectRatio: boolean = false,
  fromCenter: boolean = false
): BoundingBox {
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;

  let newX = startBox.x;
  let newY = startBox.y;
  let newW = startBox.width;
  let newH = startBox.height;

  const aspectRatio = startBox.width / (startBox.height || 1);

  if (handle.includes('e')) {
    newW = Math.max(10, startBox.width + dx);
  } else if (handle.includes('w')) {
    const rawW = startBox.width - dx;
    if (rawW >= 10) {
      newW = rawW;
      newX = startBox.x + dx;
    }
  }

  if (handle.includes('s')) {
    newH = Math.max(10, startBox.height + dy);
  } else if (handle.includes('n')) {
    const rawH = startBox.height - dy;
    if (rawH >= 10) {
      newH = rawH;
      newY = startBox.y + dy;
    }
  }

  if (lockAspectRatio) {
    if (['nw', 'ne', 'se', 'sw'].includes(handle)) {
      newH = Math.round(newW / aspectRatio);
    }
  }

  if (fromCenter) {
    newX = startBox.centerX - newW / 2;
    newY = startBox.centerY - newH / 2;
  }

  return {
    x: newX,
    y: newY,
    width: newW,
    height: newH,
    minX: newX,
    minY: newY,
    maxX: newX + newW,
    maxY: newY + newH,
    centerX: newX + newW / 2,
    centerY: newY + newH / 2,
  };
}

/**
 * حساب زاوية التدوير بالدرجات بالنسبة لمركز العنصر مع التسنين الذكي (Snap to 15 deg)
 */
export function calculateRotationAngle(
  center: Point2D,
  currentPoint: Point2D,
  snapAngleDeg: number = 15
): number {
  const rad = angle(center, currentPoint);
  let deg = radToDeg(rad) + 90; // محاذاة الصفر للأعلى
  deg = ((deg % 360) + 360) % 360;

  if (snapAngleDeg > 0) {
    const remainder = deg % snapAngleDeg;
    if (remainder < snapAngleDeg / 3 || remainder > (snapAngleDeg * 2) / 3) {
      deg = Math.round(deg / snapAngleDeg) * snapAngleDeg;
    }
  }

  return Math.round(deg);
}
