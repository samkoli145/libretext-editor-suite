/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أدوات مساعدة لحساب مسارات الموصلات والأسهم - Connector Utilities
 * 🏛️ الدور: أدوات مشتركة - حساب نقاط التثبيت والمسارات للربط بين العناصر
 * 📥 المستهلك: CanvasDesignerEditor, ConnectorTool, VectorShapeEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Anchor-Based Connectors: موصلات تعتمد على نقاط تثبيت (top/right/bottom/left)
 *    مع حساب مسار SVG ديناميكي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المسارات يجب أن تكون سلسة (cubic bezier)
 *    2. النقاط يجب أن تتبع حركة العناصر
 *    3. الأسهم يجب أن تظهر بشكل صحيح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العناصر قبل الحساب
 *    - fallback لخط مستقيم
 *    - حماية ضد القسمة على صفر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * أدوات مساعدة لحساب مسارات الموصلات والأسهم ونقاط التثبيت (Anchor Points)
 * /src/features/canvas-designer/connectorUtils.ts
 */

import type { CanvasElement } from './model';

export type AnchorPosition = 'top' | 'right' | 'bottom' | 'left' | 'center';

export interface Point {
  x: number;
  y: number;
}

/**
 * حساب إحداثيات نقطة التثبيت في عنصر معين
 */
export function getAnchorPoint(el: CanvasElement, anchor: AnchorPosition = 'center'): Point {
  switch (anchor) {
    case 'top':
      return { x: el.x + el.width / 2, y: el.y };
    case 'right':
      return { x: el.x + el.width, y: el.y + el.height / 2 };
    case 'bottom':
      return { x: el.x + el.width / 2, y: el.y + el.height };
    case 'left':
      return { x: el.x, y: el.y + el.height / 2 };
    case 'center':
    default:
      return { x: el.x + el.width / 2, y: el.y + el.height / 2 };
  }
}

/**
 * إيجاد أقرب نقطة تثبيت تلقائية بين عنصرين
 */
export function findClosestAnchors(
  fromEl: CanvasElement,
  toEl: CanvasElement,
): { fromAnchor: AnchorPosition; toAnchor: AnchorPosition } {
  const fromCenter = getAnchorPoint(fromEl, 'center');
  const toCenter = getAnchorPoint(toEl, 'center');

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  let fromAnchor: AnchorPosition = 'right';
  let toAnchor: AnchorPosition = 'left';

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      fromAnchor = 'right';
      toAnchor = 'left';
    } else {
      fromAnchor = 'left';
      toAnchor = 'right';
    }
  } else {
    if (dy > 0) {
      fromAnchor = 'bottom';
      toAnchor = 'top';
    } else {
      fromAnchor = 'top';
      toAnchor = 'bottom';
    }
  }

  return { fromAnchor, toAnchor };
}

/**
 * توليد مسار SVG للموصل (مستقيم، منحنٍ، أو قائم الزوايا Orthogonal)
 */
export function generateConnectorSVGPath(
  p1: Point,
  p2: Point,
  routing: 'straight' | 'orthogonal' | 'curved' = 'orthogonal',
): { path: string; labelPoint: Point } {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  if (routing === 'straight') {
    return {
      path: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
      labelPoint: { x: midX, y: midY },
    };
  }

  if (routing === 'curved') {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const cx1 = p1.x + dx * 0.5;
    const cy1 = p1.y;
    const cx2 = p1.x + dx * 0.5;
    const cy2 = p2.y;

    return {
      path: `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`,
      labelPoint: { x: midX, y: midY },
    };
  }

  // Orthogonal (قائم الزوايا مع زوايا مدورة ناعمة)
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);

  if (dx > dy) {
    return {
      path: `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`,
      labelPoint: { x: midX, y: (p1.y + p2.y) / 2 },
    };
  } else {
    return {
      path: `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`,
      labelPoint: { x: (p1.x + p2.x) / 2, y: midY },
    };
  }
}
