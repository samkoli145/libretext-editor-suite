/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: callout-engine.ts
 * 📂 المسار: packages/core/src/engines/callout-engine.ts
 * 🎯 الهدف الرئيسي: محرك صناديق التعليق التوضيحي البصرية (Callout)
 *    مع دعم الألوان والأشكال والمواقع المتعددة.
 * 🏷️ المعرف: CORE-ENG-020
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export type CalloutShape = 'rounded' | 'sharp' | 'pill';
export type CalloutColor = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type CalloutPosition = 'top' | 'bottom' | 'left' | 'right';

export interface CalloutConfig {
  readonly id: string;
  readonly text: string;
  readonly shape: CalloutShape;
  readonly color: CalloutColor;
  readonly position: CalloutPosition;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly hasArrow: boolean;
}

const COLOR_MAP: Record<CalloutColor, { bg: string; border: string; text: string }> = {
  info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
  success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
  warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
  danger: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  neutral: { bg: '#f8fafc', border: '#94a3b8', text: '#334155' },
};

const SHAPE_RADIUS: Record<CalloutShape, number> = { rounded: 12, sharp: 0, pill: 24 };

function arrowPath(pos: CalloutPosition, x: number, y: number, w: number, h: number): string {
  const cx = x + w / 2;
  const cy = y + h / 2;
  switch (pos) {
    case 'top':
      return `M ${cx - 8} ${y} L ${cx} ${y - 10} L ${cx + 8} ${y}`;
    case 'bottom':
      return `M ${cx - 8} ${y + h} L ${cx} ${y + h + 10} L ${cx + 8} ${y + h}`;
    case 'left':
      return `M ${x} ${cy - 8} L ${x - 10} ${cy} L ${x} ${cy + 8}`;
    case 'right':
      return `M ${x + w} ${cy - 8} L ${x + w + 10} ${cy} L ${x + w} ${cy + 8}`;
  }
}

function colorFor(c: CalloutColor): { bg: string; border: string; text: string } {
  return COLOR_MAP[c] ?? COLOR_MAP.neutral;
}

export function renderCalloutSvg(cfg: CalloutConfig): string {
  const c = colorFor(cfg.color);
  const r = SHAPE_RADIUS[cfg.shape];
  const parts = [
    `<svg x="${cfg.x}" y="${cfg.y}" width="${cfg.width}" height="${cfg.height + 10}" xmlns="http://www.w3.org/2000/svg">`,
  ];
  parts.push(
    `  <rect width="${cfg.width}" height="${cfg.height}" rx="${r}" fill="${c.bg}" stroke="${c.border}" stroke-width="2"/>`,
  );
  if (cfg.hasArrow) {
    parts.push(
      `  <path d="${arrowPath(cfg.position, 0, 0, cfg.width, cfg.height)}" fill="${c.bg}" stroke="${c.border}" stroke-width="2"/>`,
    );
  }
  const tx = cfg.width / 2;
  const ty = cfg.height / 2 + 4;
  parts.push(
    `  <text x="${tx}" y="${ty}" text-anchor="middle" font-size="14" fill="${c.text}">${cfg.text}</text>`,
  );
  parts.push('</svg>');
  return parts.join('\n');
}

export function createCallout(
  id: string,
  text: string,
  x: number,
  y: number,
  opts: Partial<
    Pick<CalloutConfig, 'shape' | 'color' | 'position' | 'width' | 'height' | 'hasArrow'>
  > = {},
): CalloutConfig {
  return {
    id,
    text,
    x,
    y,
    shape: opts.shape ?? 'rounded',
    color: opts.color ?? 'info',
    position: opts.position ?? 'top',
    width: opts.width ?? 200,
    height: opts.height ?? 60,
    hasArrow: opts.hasArrow ?? true,
  };
}
