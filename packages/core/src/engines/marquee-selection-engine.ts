/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: marquee-selection-engine.ts
 * 📂 المسار: packages/core/src/engines/marquee-selection-engine.ts
 * 🎯 الهدف الرئيسي: محرك التحديد بالصندوق المطاطي (Marquee)
 *    لاختيار العناصر داخل مساحة مستطيلة محددة بالماوس.
 * 📋 المعايير: صفر اعتماديات، دوال نقية < 50 سطر.
 * 🏷️ المعرف: CORE-ENG-010
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface MarqueeBox {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export interface MarqueeElement {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

function rectsOverlap(a: MarqueeBox, b: { x: number; y: number; width: number; height: number }): boolean {
  return (
    a.minX < b.x + b.width &&
    a.maxX > b.x &&
    a.minY < b.y + b.height &&
    a.maxY > b.y
  );
}

function buildBox(startX: number, startY: number, currentX: number, currentY: number): MarqueeBox {
  return {
    minX: Math.min(startX, currentX),
    minY: Math.min(startY, currentY),
    maxX: Math.max(startX, currentX),
    maxY: Math.max(startY, currentY),
  };
}

export function createMarqueeSelectionEngine() {
  let active = false;
  let sx = 0;
  let sy = 0;
  let cx = 0;
  let cy = 0;

  function start(x: number, y: number): void {
    active = true;
    sx = x; sy = y;
    cx = x; cy = y;
  }

  function update(x: number, y: number): void {
    if (!active) return;
    cx = x; cy = y;
  }

  function getIntersectingIds(elements: readonly MarqueeElement[]): readonly string[] {
    if (!active) return [];
    const box = buildBox(sx, sy, cx, cy);
    return elements.filter(el => rectsOverlap(box, el)).map(el => el.id);
  }

  function end(): readonly string[] {
    const result = getIntersectingIds([]);
    active = false;
    return result;
  }

  function isActive(): boolean { return active; }
  function getBox(): MarqueeBox { return buildBox(sx, sy, cx, cy); }

  return { start, update, getIntersectingIds, end, isActive, getBox };
}
