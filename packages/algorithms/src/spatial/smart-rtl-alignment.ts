/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: smart-rtl-alignment.ts
 * 📂 المسار: packages/algorithms/src/spatial/smart-rtl-alignment.ts
 * 🎯 الهدف الرئيسي: كشف اتجاه النص ومحاذاة ذكية RTL/LTR/Auto
 * 🏷️ المعرف: ALGO-033
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

import type { SimulatedCanvasElement, TextScriptDirection } from './artboard-types';

const RTL_PATTERN =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/;

export function detectTextDirection(text?: string): 'rtl' | 'ltr' {
  if (!text || typeof text !== 'string') return 'ltr';
  return RTL_PATTERN.test(text) ? 'rtl' : 'ltr';
}

export function getElementDirection(el: SimulatedCanvasElement): 'rtl' | 'ltr' {
  if (el.direction === 'rtl' || el.direction === 'ltr') return el.direction;
  const texts = [el.contentData?.title, el.contentData?.text, el.name].map(String);
  return texts.some((t) => detectTextDirection(t) === 'rtl') ? 'rtl' : 'ltr';
}

export function smartAlignByDirection(
  elements: readonly SimulatedCanvasElement[],
  selectedIds: readonly string[],
  canvasWidth: number,
  targetDirection: TextScriptDirection = 'auto',
): readonly SimulatedCanvasElement[] {
  const targets = selectedIds.length > 0 ? selectedIds : elements.map((e) => e.id);
  const margin = 24;

  return elements.map((el) => {
    if (!targets.includes(el.id) || el.isLocked) return el;
    const dir = targetDirection === 'auto' ? getElementDirection(el) : targetDirection;
    const x = dir === 'rtl' ? Math.max(0, canvasWidth - el.width - margin) : margin;
    return { ...el, x: Math.round(x), direction: dir };
  });
}
