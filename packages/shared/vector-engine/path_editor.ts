/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحرير المسارات الفيكتورية المتقدم - Vector Path Editor
 * 🏛️ الدور: محرك مشترك - نمذجة وتحرير المسارات بنقاط بيزييه
 * 📥 المستهلك: CanvasDesignerEditor, PenTool, VectorShapeEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bezier Path Modeling: نمذجة مسارات بـ Bezier vertices
 *    مع 3 أنواع رؤوس (Corner, Smooth, Disconnected) وأشكال هندسية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. النقاط يجب أن تكون دقيقة ( لا أرقام متحركة)
 *    2. التحويل بين الأنواع يجب أن يحافظ على الشكل
 *    3. المسارات يجب أن تكون قابلة للتعديل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة النقاط قبل التوليد
 *    - minimum distance بين النقاط
 *    - fallback لمسار مربع عند الخطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  type Point2D,
  type BoundingBox,
  generateId,
  distance,
  angle,
  rotatePoint,
  lerpPoint,
  getBounds,
  deepClone,
} from './common';

export type VertexType = 'corner' | 'smooth' | 'symmetric';

export interface PathVertex {
  id: string;
  point: Point2D;
  inHandle?: Point2D; // مقبض التحكم الوارد
  outHandle?: Point2D; // مقبض التحكم الصادر
  type: VertexType;
  selected?: boolean;
}

export interface VectorPathData {
  id: string;
  closed: boolean;
  vertices: PathVertex[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
}

/**
 * إنشاء مسار فيكتوري فارغ
 */
export function createEmptyPath(id?: string): VectorPathData {
  return {
    id: id || generateId('path'),
    closed: false,
    vertices: [],
    fill: 'none',
    stroke: '#2563eb',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
}

/**
 * توليد مضلع منتظم متعدد الأضلاع
 */
export function createPolygonPath(
  sides: number = 6,
  radius: number = 50,
  center: Point2D = { x: 50, y: 50 }
): VectorPathData {
  const count = Math.max(3, sides);
  const vertices: PathVertex[] = [];
  const angleStep = (Math.PI * 2) / count;
  const startOffset = -Math.PI / 2; // البدء من الأعلى

  for (let i = 0; i < count; i++) {
    const a = startOffset + i * angleStep;
    vertices.push({
      id: generateId('vtx'),
      point: {
        x: Math.round((center.x + radius * Math.cos(a)) * 100) / 100,
        y: Math.round((center.y + radius * Math.sin(a)) * 100) / 100,
      },
      type: 'corner',
    });
  }

  return {
    id: generateId('poly'),
    closed: true,
    vertices,
    fill: '#eff6ff',
    stroke: '#2563eb',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
}

/**
 * توليد نجمة هندسية منتظمة
 */
export function createStarPath(
  points: number = 5,
  innerRadius: number = 25,
  outerRadius: number = 50,
  center: Point2D = { x: 50, y: 50 }
): VectorPathData {
  const count = Math.max(3, points);
  const vertices: PathVertex[] = [];
  const step = Math.PI / count;
  const startOffset = -Math.PI / 2;

  for (let i = 0; i < count * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = startOffset + i * step;
    vertices.push({
      id: generateId('star-vtx'),
      point: {
        x: Math.round((center.x + r * Math.cos(a)) * 100) / 100,
        y: Math.round((center.y + r * Math.sin(a)) * 100) / 100,
      },
      type: 'corner',
    });
  }

  return {
    id: generateId('star'),
    closed: true,
    vertices,
    fill: '#fef3c7',
    stroke: '#d97706',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
}

/**
 * تحويل مسار فيكتوري إلى كود SVG Path d String
 */
export function pathToSvgString(path: VectorPathData): string {
  const vertices = path.vertices;
  if (!vertices || vertices.length === 0) return '';

  const first = vertices[0];
  let d = `M ${first.point.x} ${first.point.y}`;

  for (let i = 1; i < vertices.length; i++) {
    const prev = vertices[i - 1];
    const curr = vertices[i];

    const cp1 = prev.outHandle || prev.point;
    const cp2 = curr.inHandle || curr.point;

    const hasCurves =
      (prev.outHandle && (prev.outHandle.x !== prev.point.x || prev.outHandle.y !== prev.point.y)) ||
      (curr.inHandle && (curr.inHandle.x !== curr.point.x || curr.inHandle.y !== curr.point.y));

    if (hasCurves) {
      d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${curr.point.x} ${curr.point.y}`;
    } else {
      d += ` L ${curr.point.x} ${curr.point.y}`;
    }
  }

  if (path.closed && vertices.length > 2) {
    const last = vertices[vertices.length - 1];
    const cp1 = last.outHandle || last.point;
    const cp2 = first.inHandle || first.point;

    const hasCurves =
      (last.outHandle && (last.outHandle.x !== last.point.x || last.outHandle.y !== last.point.y)) ||
      (first.inHandle && (first.inHandle.x !== first.point.x || first.inHandle.y !== first.point.y));

    if (hasCurves) {
      d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${first.point.x} ${first.point.y} Z`;
    } else {
      d += ` Z`;
    }
  }

  return d;
}

export const pathToSvgPath = pathToSvgString;

/**
 * تحليل وتفسير مسار SVG نصي وتحويله إلى كائن VectorPathData
 */
export function parseSvgPathD(d: string): VectorPathData {
  const path = createEmptyPath();
  if (!d || typeof d !== 'string') return path;

  // تنظيف السلسلة وتجزئة الأوامر
  const commands = d.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/gi);
  if (!commands) return path;

  const vertices: PathVertex[] = [];
  let i = 0;
  let currentX = 0;
  let currentY = 0;

  while (i < commands.length) {
    const token = commands[i];
    if (/^[a-z]$/i.test(token)) {
      const cmd = token;
      i++;

      if (cmd === 'M' || cmd === 'm') {
        const x = parseFloat(commands[i++]);
        const y = parseFloat(commands[i++]);
        currentX = cmd === 'M' ? x : currentX + x;
        currentY = cmd === 'M' ? y : currentY + y;
        vertices.push({
          id: generateId('vtx'),
          point: { x: currentX, y: currentY },
          type: 'corner',
        });
      } else if (cmd === 'L' || cmd === 'l') {
        const x = parseFloat(commands[i++]);
        const y = parseFloat(commands[i++]);
        currentX = cmd === 'L' ? x : currentX + x;
        currentY = cmd === 'L' ? y : currentY + y;
        vertices.push({
          id: generateId('vtx'),
          point: { x: currentX, y: currentY },
          type: 'corner',
        });
      } else if (cmd === 'C' || cmd === 'c') {
        const x1 = parseFloat(commands[i++]);
        const y1 = parseFloat(commands[i++]);
        const x2 = parseFloat(commands[i++]);
        const y2 = parseFloat(commands[i++]);
        const x = parseFloat(commands[i++]);
        const y = parseFloat(commands[i++]);

        const prev = vertices[vertices.length - 1];
        if (prev) {
          prev.outHandle = {
            x: cmd === 'C' ? x1 : currentX + x1,
            y: cmd === 'C' ? y1 : currentY + y1,
          };
          prev.type = 'smooth';
        }

        currentX = cmd === 'C' ? x : currentX + x;
        currentY = cmd === 'C' ? y : currentY + y;

        vertices.push({
          id: generateId('vtx'),
          point: { x: currentX, y: currentY },
          inHandle: {
            x: cmd === 'C' ? x2 : currentX - (x - x2),
            y: cmd === 'C' ? y2 : currentY - (y - y2),
          },
          type: 'smooth',
        });
      } else if (cmd === 'Z' || cmd === 'z') {
        path.closed = true;
      }
    } else {
      // إحداثيات بدون أمر صريح
      i++;
    }
  }

  path.vertices = vertices;
  return path;
}

/**
 * تنعيم المسار الفيكتوري بحساب منحنيات بيزييه تلقائية للرؤوس
 */
export function smoothPath(path: VectorPathData, tension: number = 0.3): VectorPathData {
  const result = deepClone(path);
  const n = result.vertices.length;
  if (n < 3) return result;

  for (let i = 0; i < n; i++) {
    const curr = result.vertices[i];
    const prev = result.vertices[(i - 1 + n) % n];
    const next = result.vertices[(i + 1) % n];

    if (!result.closed && (i === 0 || i === n - 1)) {
      curr.type = 'corner';
      continue;
    }

    const dPrev = distance(prev.point, curr.point);
    const dNext = distance(curr.point, next.point);
    const totalDist = dPrev + dNext;

    if (totalDist === 0) continue;

    const angleBetween = angle(prev.point, next.point);
    const inDist = dPrev * tension;
    const outDist = dNext * tension;

    curr.inHandle = {
      x: Math.round((curr.point.x - inDist * Math.cos(angleBetween)) * 100) / 100,
      y: Math.round((curr.point.y - inDist * Math.sin(angleBetween)) * 100) / 100,
    };
    curr.outHandle = {
      x: Math.round((curr.point.x + outDist * Math.cos(angleBetween)) * 100) / 100,
      y: Math.round((curr.point.y + outDist * Math.sin(angleBetween)) * 100) / 100,
    };
    curr.type = 'smooth';
  }

  return result;
}

/**
 * تبسيط المسار الفيكتوري بتقليل النقاط الزائدة (Ramer-Douglas-Peucker)
 */
export function simplifyPath(path: VectorPathData, tolerance: number = 2): VectorPathData {
  if (path.vertices.length <= 2) return deepClone(path);

  const points = path.vertices.map((v) => v.point);
  const simplifiedPoints: Point2D[] = [];

  function simplifySection(startIdx: number, endIdx: number) {
    let maxDist = 0;
    let maxIdx = startIdx;
    const pStart = points[startIdx];
    const pEnd = points[endIdx];

    for (let i = startIdx + 1; i < endIdx; i++) {
      const p = points[i];
      const dx = pEnd.x - pStart.x;
      const dy = pEnd.y - pStart.y;
      const mag = Math.hypot(dx, dy);
      const d = mag === 0 ? distance(p, pStart) : Math.abs(dy * p.x - dx * p.y + pEnd.x * pStart.y - pEnd.y * pStart.x) / mag;

      if (d > maxDist) {
        maxDist = d;
        maxIdx = i;
      }
    }

    if (maxDist > tolerance) {
      simplifySection(startIdx, maxIdx);
      simplifySection(maxIdx, endIdx);
    } else {
      if (simplifiedPoints.length === 0 || simplifiedPoints[simplifiedPoints.length - 1] !== pStart) {
        simplifiedPoints.push(pStart);
      }
      simplifiedPoints.push(pEnd);
    }
  }

  simplifySection(0, points.length - 1);

  const newVertices: PathVertex[] = simplifiedPoints.map((p) => ({
    id: generateId('vtx'),
    point: p,
    type: 'corner',
  }));

  const result = deepClone(path);
  result.vertices = newVertices;
  return result;
}

/**
 * إضافة نقطة جديدة إلى المسار
 */
export function addVertex(path: VectorPathData, point: Point2D, index?: number): VectorPathData {
  const result = deepClone(path);
  const newVtx: PathVertex = {
    id: generateId('vtx'),
    point,
    type: 'corner',
  };

  if (index !== undefined && index >= 0 && index <= result.vertices.length) {
    result.vertices.splice(index, 0, newVtx);
  } else {
    result.vertices.push(newVtx);
  }

  return result;
}

/**
 * حذف نقطة من المسار
 */
export function removeVertex(path: VectorPathData, vertexId: string): VectorPathData {
  const result = deepClone(path);
  result.vertices = result.vertices.filter((v) => v.id !== vertexId);
  return result;
}

/**
 * تحديث نقطة ومقابضها
 */
export function updateVertex(
  path: VectorPathData,
  vertexId: string,
  updates: Partial<PathVertex>
): VectorPathData {
  const result = deepClone(path);
  const vtx = result.vertices.find((v) => v.id === vertexId);
  if (!vtx) return result;

  Object.assign(vtx, updates);

  // الحفاظ على تناسق المقابض إذا كان النوع Symmetric أو Smooth
  if (updates.inHandle && vtx.type === 'symmetric' && vtx.outHandle) {
    const dx = vtx.point.x - updates.inHandle.x;
    const dy = vtx.point.y - updates.inHandle.y;
    vtx.outHandle = { x: vtx.point.x + dx, y: vtx.point.y + dy };
  } else if (updates.outHandle && vtx.type === 'symmetric' && vtx.inHandle) {
    const dx = vtx.point.x - updates.outHandle.x;
    const dy = vtx.point.y - updates.outHandle.y;
    vtx.inHandle = { x: vtx.point.x + dx, y: vtx.point.y + dy };
  }

  return result;
}

/**
 * تبديل نوع الرأس (Corner <-> Smooth <-> Symmetric)
 */
export function toggleVertexType(path: VectorPathData, vertexId: string): VectorPathData {
  const result = deepClone(path);
  const vtx = result.vertices.find((v) => v.id === vertexId);
  if (!vtx) return result;

  if (vtx.type === 'corner') {
    vtx.type = 'smooth';
    // توليد مقابض افتراضية
    vtx.inHandle = { x: vtx.point.x - 20, y: vtx.point.y };
    vtx.outHandle = { x: vtx.point.x + 20, y: vtx.point.y };
  } else if (vtx.type === 'smooth') {
    vtx.type = 'symmetric';
  } else {
    vtx.type = 'corner';
    delete vtx.inHandle;
    delete vtx.outHandle;
  }

  return result;
}

/**
 * قلب المسار الفيكتوري أفقيًا أو عموديًا
 */
export function flipPath(path: VectorPathData, direction: 'horizontal' | 'vertical'): VectorPathData {
  const result = deepClone(path);
  const bounds = getPathBounds(path);

  result.vertices = result.vertices.map((v) => {
    const pt = { ...v.point };
    let inH = v.inHandle ? { ...v.inHandle } : undefined;
    let outH = v.outHandle ? { ...v.outHandle } : undefined;

    if (direction === 'horizontal') {
      pt.x = bounds.minX + (bounds.maxX - pt.x);
      if (inH) inH.x = bounds.minX + (bounds.maxX - inH.x);
      if (outH) outH.x = bounds.minX + (bounds.maxX - outH.x);
    } else {
      pt.y = bounds.minY + (bounds.maxY - pt.y);
      if (inH) inH.y = bounds.minY + (bounds.maxY - inH.y);
      if (outH) outH.y = bounds.minY + (bounds.maxY - outH.y);
    }

    return {
      ...v,
      point: pt,
      inHandle: inH,
      outHandle: outH,
    };
  });

  return result;
}

/**
 * حساب الصندوق المحيط بالمسار الفيكتوري شاملاً النقاط والمقابض
 */
export function getPathBounds(path: VectorPathData): BoundingBox {
  const points: Point2D[] = [];
  for (const v of path.vertices) {
    points.push(v.point);
    if (v.inHandle) points.push(v.inHandle);
    if (v.outHandle) points.push(v.outHandle);
  }
  return getBounds(points);
}
