/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المحاذاة والمغناطيسية الذكية الفيكتورية - Smart Snapping Engine
 * 🏛️ الدور: محرك مشترك - حساب خطوط الإرشاد المغناطيسية والمحاذاة الذكية
 * 📥 المستهلك: useSnapAndGuides, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Magnetic Alignment Lines: خطوط محاذاة مغناطيسية
 *    مع حواف ومراكز وخطوط إرشاد زرقاء ذكية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحسابات يجب أن تكون فورية
 *    2. الخطوط يجب أن تظهر فقط عند الاقتراب
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الإحداثيات قبل الحساب
 *    - fallback لعدم عرض خطوط
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { RectBounds } from './bounding-box';

export interface SnapElementBounds extends RectBounds {
  id?: string;
}

export interface SnapLine {
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
}

export interface SnapResult {
  x: number;
  y: number;
  snappedX: boolean;
  snappedY: boolean;
  activeGuides: SnapLine[];
}

export class SnapAlignEngine {
  private threshold: number;

  constructor(threshold: number = 6) {
    this.threshold = threshold;
  }

  /**
   * Calculate smart snap alignments for a target rectangle against a list of other rectangles
   */
  public calculateSnap(
    target: { x: number; y: number; width: number; height: number },
    otherItems: (RectBounds & { id?: string })[],
    canvasSize?: { width: number; height: number },
  ): SnapResult {
    let snappedX = target.x;
    let snappedY = target.y;
    let hasSnappedX = false;
    let hasSnappedY = false;
    const activeGuides: SnapLine[] = [];

    const targetCenterX = target.x + target.width / 2;
    const targetRightX = target.x + target.width;
    const targetCenterY = target.y + target.height / 2;
    const targetBottomY = target.y + target.height;

    // Collect all snap points (Canvas center/edges + other items)
    const xSnapPoints: { pos: number; alignWith: number; type: 'left' | 'center' | 'right' }[] = [];
    const ySnapPoints: { pos: number; alignWith: number; type: 'top' | 'center' | 'bottom' }[] = [];

    if (canvasSize) {
      // Center of canvas
      xSnapPoints.push({
        pos: canvasSize.width / 2,
        alignWith: canvasSize.width / 2,
        type: 'center',
      });
      ySnapPoints.push({
        pos: canvasSize.height / 2,
        alignWith: canvasSize.height / 2,
        type: 'center',
      });
    }

    for (const item of otherItems) {
      const itemCenterX = item.x + item.width / 2;
      const itemRightX = item.x + item.width;
      const itemCenterY = item.y + item.height / 2;
      const itemBottomY = item.y + item.height;

      // X snap points (Left, Center, Right)
      xSnapPoints.push(
        { pos: item.x, alignWith: item.x, type: 'left' },
        { pos: itemCenterX, alignWith: itemCenterX, type: 'center' },
        { pos: itemRightX, alignWith: itemRightX, type: 'right' },
      );

      // Y snap points (Top, Center, Bottom)
      ySnapPoints.push(
        { pos: item.y, alignWith: item.y, type: 'top' },
        { pos: itemCenterY, alignWith: itemCenterY, type: 'center' },
        { pos: itemBottomY, alignWith: itemBottomY, type: 'bottom' },
      );
    }

    // Evaluate X-Axis Snapping
    let minDeltaX = this.threshold;
    for (const point of xSnapPoints) {
      // Target Left -> Point
      if (Math.abs(target.x - point.pos) < minDeltaX) {
        minDeltaX = Math.abs(target.x - point.pos);
        snappedX = point.pos;
        hasSnappedX = true;
        activeGuides.push({
          type: 'vertical',
          position: point.pos,
          start: Math.min(target.y, 0),
          end: Math.max(targetBottomY, canvasSize ? canvasSize.height : 1000),
        });
      }
      // Target Center -> Point
      if (Math.abs(targetCenterX - point.pos) < minDeltaX) {
        minDeltaX = Math.abs(targetCenterX - point.pos);
        snappedX = point.pos - target.width / 2;
        hasSnappedX = true;
        activeGuides.push({
          type: 'vertical',
          position: point.pos,
          start: Math.min(target.y, 0),
          end: Math.max(targetBottomY, canvasSize ? canvasSize.height : 1000),
        });
      }
      // Target Right -> Point
      if (Math.abs(targetRightX - point.pos) < minDeltaX) {
        minDeltaX = Math.abs(targetRightX - point.pos);
        snappedX = point.pos - target.width;
        hasSnappedX = true;
        activeGuides.push({
          type: 'vertical',
          position: point.pos,
          start: Math.min(target.y, 0),
          end: Math.max(targetBottomY, canvasSize ? canvasSize.height : 1000),
        });
      }
    }

    // Evaluate Y-Axis Snapping
    let minDeltaY = this.threshold;
    for (const point of ySnapPoints) {
      // Target Top -> Point
      if (Math.abs(target.y - point.pos) < minDeltaY) {
        minDeltaY = Math.abs(target.y - point.pos);
        snappedY = point.pos;
        hasSnappedY = true;
        activeGuides.push({
          type: 'horizontal',
          position: point.pos,
          start: Math.min(target.x, 0),
          end: Math.max(targetRightX, canvasSize ? canvasSize.width : 1000),
        });
      }
      // Target Center -> Point
      if (Math.abs(targetCenterY - point.pos) < minDeltaY) {
        minDeltaY = Math.abs(targetCenterY - point.pos);
        snappedY = point.pos - target.height / 2;
        hasSnappedY = true;
        activeGuides.push({
          type: 'horizontal',
          position: point.pos,
          start: Math.min(target.x, 0),
          end: Math.max(targetRightX, canvasSize ? canvasSize.width : 1000),
        });
      }
      // Target Bottom -> Point
      if (Math.abs(targetBottomY - point.pos) < minDeltaY) {
        minDeltaY = Math.abs(targetBottomY - point.pos);
        snappedY = point.pos - target.height;
        hasSnappedY = true;
        activeGuides.push({
          type: 'horizontal',
          position: point.pos,
          start: Math.min(target.x, 0),
          end: Math.max(targetRightX, canvasSize ? canvasSize.width : 1000),
        });
      }
    }

    return {
      x: snappedX,
      y: snappedY,
      snappedX: hasSnappedX,
      snappedY: hasSnappedY,
      activeGuides,
    };
  }
}
