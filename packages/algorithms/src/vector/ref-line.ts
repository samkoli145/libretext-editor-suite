/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: ref-line.ts
 * 📂 المسار: packages/algorithms/src/vector/ref-line.ts
 * 🎯 الهدف الرئيسي: توليد خطوط إرشاد ديناميكية ومؤشرات مسافات بصرية
 * 🏷️ المعرف: ALGO-035
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

import { type BoundingBox, generateId } from './common';

export interface ReferenceLine {
  readonly id: string;
  readonly orientation: 'horizontal' | 'vertical';
  readonly position: number;
  readonly start: number;
  readonly end: number;
  readonly color?: string;
  readonly label?: string;
}

export interface DistanceBadge {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly distance: number;
  readonly orientation: 'horizontal' | 'vertical';
}

export function calculateAlignmentRefLines(
  activeBox: BoundingBox,
  otherBoxes: readonly BoundingBox[],
  tolerance = 4,
): ReferenceLine[] {
  const lines: ReferenceLine[] = [];
  for (const other of otherBoxes) {
    if (Math.abs(activeBox.minY - other.minY) <= tolerance) {
      lines.push({ id: generateId('ref-top'), orientation: 'horizontal', position: other.minY, start: Math.min(activeBox.minX, other.minX) - 10, end: Math.max(activeBox.maxX, other.maxX) + 10 });
    }
    if (Math.abs(activeBox.centerY - other.centerY) <= tolerance) {
      lines.push({ id: generateId('ref-mid'), orientation: 'horizontal', position: other.centerY, start: Math.min(activeBox.minX, other.minX) - 10, end: Math.max(activeBox.maxX, other.maxX) + 10, color: '#3b82f6' });
    }
    if (Math.abs(activeBox.maxY - other.maxY) <= tolerance) {
      lines.push({ id: generateId('ref-bot'), orientation: 'horizontal', position: other.maxY, start: Math.min(activeBox.minX, other.minX) - 10, end: Math.max(activeBox.maxX, other.maxX) + 10 });
    }
    if (Math.abs(activeBox.minX - other.minX) <= tolerance) {
      lines.push({ id: generateId('ref-left'), orientation: 'vertical', position: other.minX, start: Math.min(activeBox.minY, other.minY) - 10, end: Math.max(activeBox.maxY, other.maxY) + 10 });
    }
    if (Math.abs(activeBox.centerX - other.centerX) <= tolerance) {
      lines.push({ id: generateId('ref-ctr'), orientation: 'vertical', position: other.centerX, start: Math.min(activeBox.minY, other.minY) - 10, end: Math.max(activeBox.maxY, other.maxY) + 10, color: '#3b82f6' });
    }
    if (Math.abs(activeBox.maxX - other.maxX) <= tolerance) {
      lines.push({ id: generateId('ref-rgt'), orientation: 'vertical', position: other.maxX, start: Math.min(activeBox.minY, other.minY) - 10, end: Math.max(activeBox.maxY, other.maxY) + 10 });
    }
  }
  return lines;
}

function calcGap(aMax: number, bMin: number): number {
  return Math.round(bMin - aMax);
}

export function calculateDistanceBadges(
  activeBox: BoundingBox,
  otherBoxes: readonly BoundingBox[],
): DistanceBadge[] {
  const badges: DistanceBadge[] = [];
  for (const other of otherBoxes) {
    const yOverlap = Math.max(0, Math.min(activeBox.maxY, other.maxY) - Math.max(activeBox.minY, other.minY));
    if (yOverlap > 20) {
      if (activeBox.minX > other.maxX) {
        const gap = calcGap(other.maxX, activeBox.minX);
        badges.push({ id: generateId('badge-h'), x: other.maxX + gap / 2, y: Math.max(activeBox.centerY, other.centerY), distance: gap, orientation: 'horizontal' });
      } else if (other.minX > activeBox.maxX) {
        const gap = calcGap(activeBox.maxX, other.minX);
        badges.push({ id: generateId('badge-h'), x: activeBox.maxX + gap / 2, y: Math.max(activeBox.centerY, other.centerY), distance: gap, orientation: 'horizontal' });
      }
    }
    const xOverlap = Math.max(0, Math.min(activeBox.maxX, other.maxX) - Math.max(activeBox.minX, other.minX));
    if (xOverlap > 20) {
      if (activeBox.minY > other.maxY) {
        const gap = calcGap(other.maxY, activeBox.minY);
        badges.push({ id: generateId('badge-v'), x: Math.max(activeBox.centerX, other.centerX), y: other.maxY + gap / 2, distance: gap, orientation: 'vertical' });
      } else if (other.minY > activeBox.maxY) {
        const gap = calcGap(activeBox.maxY, other.minY);
        badges.push({ id: generateId('badge-v'), x: Math.max(activeBox.centerX, other.centerX), y: activeBox.maxY + gap / 2, distance: gap, orientation: 'vertical' });
      }
    }
  }
  return badges;
}
