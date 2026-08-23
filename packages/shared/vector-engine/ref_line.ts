/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك خطوط الإرشاد الذكية - Smart Reference Lines & Alignment Guides
 * 🏛️ الدور: محرك مشترك - توليد خطوط محاذاة ومسافات بصرية
 * 📥 المستهلك: CanvasDesignerEditor, UiDesignerEditor, useSnapAndGuides
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dynamic Reference Lines: خطوط إرشاد ديناميكية تظهر عند السحب
 *    مع مسافات بصرية ومؤشرات فجوة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الخطوط يجب أن تظهر فقط عند التلامس
 *    2. المسافات يجب أن تكون دقيقة
 *    3. الخطوط يجب أن تتبع التكبير
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود عناصر للمحاذاة
 *    - حد أدنى للمسافة (5px)
 *    - تنظيف الخطوط بعد الإفلات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { type BoundingBox, type Point2D, generateId } from './common';
import type { SnapTarget } from './snap';

export interface ReferenceLine {
  id: string;
  orientation: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
  color?: string;
  label?: string;
}

export interface DistanceBadge {
  id: string;
  x: number;
  y: number;
  distance: number;
  orientation: 'horizontal' | 'vertical';
}

/**
 * توليد خطوط إرشادية مرئية من أهداف التسنين الذكي
 */
export function generateRefLinesFromSnapTargets(targets: SnapTarget[]): ReferenceLine[] {
  const lines: ReferenceLine[] = [];

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    lines.push({
      id: generateId('refline'),
      orientation: t.axis === 'x' ? 'vertical' : 'horizontal',
      position: t.position,
      start: t.guideStart,
      end: t.guideEnd,
      color: t.type === 'center' ? '#3b82f6' : '#2563eb',
      label: t.type === 'center' ? 'المركز' : undefined,
    });
  }

  return lines;
}

/**
 * حساب خطوط المحاذاة الشاملة لصندوق متحرك مقارنة بكافة الصناديق الأخرى
 */
export function calculateAlignmentRefLines(
  activeBox: BoundingBox,
  otherBoxes: BoundingBox[],
  tolerance: number = 4,
): ReferenceLine[] {
  const lines: ReferenceLine[] = [];

  for (const other of otherBoxes) {
    // 1. محاذاة أفقية (Horizontal Alignment)
    if (Math.abs(activeBox.minY - other.minY) <= tolerance) {
      lines.push({
        id: generateId('ref-top'),
        orientation: 'horizontal',
        position: other.minY,
        start: Math.min(activeBox.minX, other.minX) - 10,
        end: Math.max(activeBox.maxX, other.maxX) + 10,
      });
    }
    if (Math.abs(activeBox.centerY - other.centerY) <= tolerance) {
      lines.push({
        id: generateId('ref-mid'),
        orientation: 'horizontal',
        position: other.centerY,
        start: Math.min(activeBox.minX, other.minX) - 10,
        end: Math.max(activeBox.maxX, other.maxX) + 10,
        color: '#3b82f6',
      });
    }
    if (Math.abs(activeBox.maxY - other.maxY) <= tolerance) {
      lines.push({
        id: generateId('ref-bot'),
        orientation: 'horizontal',
        position: other.maxY,
        start: Math.min(activeBox.minX, other.minX) - 10,
        end: Math.max(activeBox.maxX, other.maxX) + 10,
      });
    }

    // 2. محاذاة عمودية (Vertical Alignment)
    if (Math.abs(activeBox.minX - other.minX) <= tolerance) {
      lines.push({
        id: generateId('ref-left'),
        orientation: 'vertical',
        position: other.minX,
        start: Math.min(activeBox.minY, other.minY) - 10,
        end: Math.max(activeBox.maxY, other.maxY) + 10,
      });
    }
    if (Math.abs(activeBox.centerX - other.centerX) <= tolerance) {
      lines.push({
        id: generateId('ref-center'),
        orientation: 'vertical',
        position: other.centerX,
        start: Math.min(activeBox.minY, other.minY) - 10,
        end: Math.max(activeBox.maxY, other.maxY) + 10,
        color: '#3b82f6',
      });
    }
    if (Math.abs(activeBox.maxX - other.maxX) <= tolerance) {
      lines.push({
        id: generateId('ref-right'),
        orientation: 'vertical',
        position: other.maxX,
        start: Math.min(activeBox.minY, other.minY) - 10,
        end: Math.max(activeBox.maxY, other.maxY) + 10,
      });
    }
  }

  return lines;
}

/**
 * حساب المسافات البينية وشارات الأبعاد بين العناصر
 */
export function calculateDistanceBadges(
  activeBox: BoundingBox,
  otherBoxes: BoundingBox[],
): DistanceBadge[] {
  const badges: DistanceBadge[] = [];

  for (const other of otherBoxes) {
    // المسافة الأفقية بين عنصرين على نفس الارتفاع
    const yOverlap = Math.max(
      0,
      Math.min(activeBox.maxY, other.maxY) - Math.max(activeBox.minY, other.minY),
    );
    if (yOverlap > 20) {
      if (activeBox.minX > other.maxX) {
        const gap = Math.round(activeBox.minX - other.maxX);
        badges.push({
          id: generateId('badge-h'),
          x: other.maxX + gap / 2,
          y: Math.max(activeBox.centerY, other.centerY),
          distance: gap,
          orientation: 'horizontal',
        });
      } else if (other.minX > activeBox.maxX) {
        const gap = Math.round(other.minX - activeBox.maxX);
        badges.push({
          id: generateId('badge-h'),
          x: activeBox.maxX + gap / 2,
          y: Math.max(activeBox.centerY, other.centerY),
          distance: gap,
          orientation: 'horizontal',
        });
      }
    }

    // المسافة العمودية بين عنصرين في نفس العمود
    const xOverlap = Math.max(
      0,
      Math.min(activeBox.maxX, other.maxX) - Math.max(activeBox.minX, other.minX),
    );
    if (xOverlap > 20) {
      if (activeBox.minY > other.maxY) {
        const gap = Math.round(activeBox.minY - other.maxY);
        badges.push({
          id: generateId('badge-v'),
          x: Math.max(activeBox.centerX, other.centerX),
          y: other.maxY + gap / 2,
          distance: gap,
          orientation: 'vertical',
        });
      } else if (other.minY > activeBox.maxY) {
        const gap = Math.round(other.minY - activeBox.maxY);
        badges.push({
          id: generateId('badge-v'),
          x: Math.max(activeBox.centerX, other.centerX),
          y: activeBox.maxY + gap / 2,
          distance: gap,
          orientation: 'vertical',
        });
      }
    }
  }

  return badges;
}
