/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: dynamic-guide-lines.ts
 * 📂 المسار: packages/algorithms/src/spatial/dynamic-guide-lines.ts
 * 🎯 الهدف الرئيسي: توليد خطوط إرشاد حية + مؤشرات قياس أثناء السحب
 * 🏷️ المعرف: ALGO-032
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface DynamicGuide {
  readonly id: string;
  readonly orientation: 'horizontal' | 'vertical';
  readonly position: number;
  readonly start: number;
  readonly end: number;
  readonly label?: string;
  readonly color?: string;
}

export interface MeasurementLabel {
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly orientation: 'horizontal' | 'vertical';
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
}

function dedupGuides(guides: DynamicGuide[]): DynamicGuide[] {
  const seen = new Set<string>();
  return guides.filter((g) => {
    const key = `${g.orientation}_${Math.round(g.position)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function generateDynamicGuides(
  movingBounds: { x: number; y: number; width: number; height: number },
  staticBounds: Array<{ x: number; y: number; width: number; height: number }>,
  threshold = 5,
): DynamicGuide[] {
  const lines: DynamicGuide[] = [];
  const mx = [
    movingBounds.x,
    movingBounds.x + movingBounds.width / 2,
    movingBounds.x + movingBounds.width,
  ];
  const my = [
    movingBounds.y,
    movingBounds.y + movingBounds.height / 2,
    movingBounds.y + movingBounds.height,
  ];

  for (const sb of staticBounds) {
    const sx = [sb.x, sb.x + sb.width / 2, sb.x + sb.width];
    const sy = [sb.y, sb.y + sb.height / 2, sb.y + sb.height];

    for (const px of mx) {
      for (const tx of sx) {
        if (Math.abs(px - tx) <= threshold) {
          lines.push({
            id: makeId('v'),
            orientation: 'vertical',
            position: tx,
            start: Math.min(movingBounds.y, sb.y),
            end: Math.max(movingBounds.y + movingBounds.height, sb.y + sb.height),
            label: `${Math.round(tx)}px`,
          });
        }
      }
    }

    for (const py of my) {
      for (const ty of sy) {
        if (Math.abs(py - ty) <= threshold) {
          lines.push({
            id: makeId('h'),
            orientation: 'horizontal',
            position: ty,
            start: Math.min(movingBounds.x, sb.x),
            end: Math.max(movingBounds.x + movingBounds.width, sb.x + sb.width),
            label: `${Math.round(ty)}px`,
          });
        }
      }
    }
  }

  return dedupGuides(lines);
}

export function generateMeasurementLabels(
  movingBounds: { x: number; y: number; width: number; height: number },
  staticBounds: { x: number; y: number; width: number; height: number },
): MeasurementLabel[] {
  const labels: MeasurementLabel[] = [];
  const gapH = staticBounds.x - (movingBounds.x + movingBounds.width);
  const gapV = staticBounds.y - (movingBounds.y + movingBounds.height);

  if (gapH > 0 && gapH < 100) {
    labels.push({
      x: movingBounds.x + movingBounds.width + gapH / 2,
      y: movingBounds.y + movingBounds.height / 2,
      text: `${Math.round(gapH)}`,
      orientation: 'horizontal',
    });
  }

  if (gapV > 0 && gapV < 100) {
    labels.push({
      x: movingBounds.x + movingBounds.width / 2,
      y: movingBounds.y + movingBounds.height + gapV / 2,
      text: `${Math.round(gapV)}`,
      orientation: 'vertical',
    });
  }

  return labels;
}
