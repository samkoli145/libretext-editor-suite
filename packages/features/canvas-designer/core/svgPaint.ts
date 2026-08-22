/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحليل وتوليد الألوان والتدرجات اللونية - SVG Paint Engine
 * 🏛️ الدور: محرك مشترك - تحليل HEX/RGB/HSL و生成 تدرجات خطية وشعاعية
 * 📥 المستهلك: CanvasToolBar, ElementPropertiesPanel, svgExporter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Color Parser + Gradient Generator: محلل ألوان ومولد تدرجات
 *    مع قوالب تدرجات فاتحة مسبقة الضبط للثيم الفاتح
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الألوان المسماة قد لا تكون مدعومة في كل المتصفحات
 *    2. التدرجات يجب أن تكون متوافقة مع SVG
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة لون الإدخال
 *    - fallback لون أسود
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ColorStop {
  offset: number; // 0 to 1 (أو نسبة مئوية)
  color: string;
  opacity?: number;
}

export interface LinearGradientConfig {
  id: string;
  type: 'linear';
  x1?: string | number;
  y1?: string | number;
  x2?: string | number;
  y2?: string | number;
  angleDeg?: number;
  stops: ColorStop[];
}

export interface RadialGradientConfig {
  id: string;
  type: 'radial';
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  fx?: string | number;
  fy?: string | number;
  stops: ColorStop[];
}

export type SvgGradient = LinearGradientConfig | RadialGradientConfig;

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * تحليل قيمة لون نصية وتحويلها إلى RGBA
 */
export function parseColor(colorStr: string): RGBA | null {
  if (!colorStr || typeof colorStr !== 'string') return null;
  const c = colorStr.trim().toLowerCase();

  // شفاف
  if (c === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  // Hex (#RGB أو #RRGGBB أو #RRGGBBAA)
  if (c.startsWith('#')) {
    const hex = c.substring(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: parseInt(hex.substring(6, 8), 16) / 255,
      };
    }
  }

  // RGB / RGBA
  const rgbMatch = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    return {
      r: Math.min(255, Math.max(0, parseFloat(rgbMatch[1]))),
      g: Math.min(255, Math.max(0, parseFloat(rgbMatch[2]))),
      b: Math.min(255, Math.max(0, parseFloat(rgbMatch[3]))),
      a: rgbMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbMatch[4]))) : 1,
    };
  }

  return null;
}

/**
 * تحويل RGBA إلى كود HEX أو RGBA نصي
 */
export function rgbaToString(rgba: RGBA): string {
  if (rgba.a >= 1) {
    const r = Math.round(rgba.r).toString(16).padStart(2, '0');
    const g = Math.round(rgba.g).toString(16).padStart(2, '0');
    const b = Math.round(rgba.b).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${rgba.a.toFixed(2)})`;
}

/**
 * توليد وسم SVG `<linearGradient>` أو `<radialGradient>` نصي
 */
export function generateSvgGradientElement(gradient: SvgGradient): string {
  const stopsHtml = gradient.stops
    .map((s) => {
      const offsetStr = typeof s.offset === 'number' ? `${Math.round(s.offset * 100)}%` : s.offset;
      const opacityAttr = s.opacity !== undefined && s.opacity < 1 ? ` stop-opacity="${s.opacity}"` : '';
      return `  <stop offset="${offsetStr}" stop-color="${s.color}"${opacityAttr} />`;
    })
    .join('\n');

  if (gradient.type === 'linear') {
    let x1 = gradient.x1 ?? '0%';
    let y1 = gradient.y1 ?? '0%';
    let x2 = gradient.x2 ?? '100%';
    let y2 = gradient.y2 ?? '0%';

    if (gradient.angleDeg !== undefined) {
      const rad = ((gradient.angleDeg % 360) * Math.PI) / 180;
      x1 = `${Math.round((0.5 - Math.cos(rad) / 2) * 100)}%`;
      y1 = `${Math.round((0.5 - Math.sin(rad) / 2) * 100)}%`;
      x2 = `${Math.round((0.5 + Math.cos(rad) / 2) * 100)}%`;
      y2 = `${Math.round((0.5 + Math.sin(rad) / 2) * 100)}%`;
    }

    return `<linearGradient id="${gradient.id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">\n${stopsHtml}\n</linearGradient>`;
  } else {
    const cx = gradient.cx ?? '50%';
    const cy = gradient.cy ?? '50%';
    const r = gradient.r ?? '50%';
    return `<radialGradient id="${gradient.id}" cx="${cx}" cy="${cy}" r="${r}">\n${stopsHtml}\n</radialGradient>`;
  }
}

/**
 * حزمة من قوالب التدرجات الفاتحة الجاهزة
 */
export const LIGHT_THEME_GRADIENTS: LinearGradientConfig[] = [
  {
    id: 'grad-sky-soft',
    type: 'linear',
    angleDeg: 90,
    stops: [
      { offset: 0, color: '#f0f9ff' },
      { offset: 1, color: '#e0f2fe' },
    ],
  },
  {
    id: 'grad-emerald-soft',
    type: 'linear',
    angleDeg: 135,
    stops: [
      { offset: 0, color: '#f0fdf4' },
      { offset: 1, color: '#dcfce7' },
    ],
  },
  {
    id: 'grad-warm-sun',
    type: 'linear',
    angleDeg: 45,
    stops: [
      { offset: 0, color: '#fefce8' },
      { offset: 1, color: '#fef08a' },
    ],
  },
  {
    id: 'grad-purple-mist',
    type: 'linear',
    angleDeg: 90,
    stops: [
      { offset: 0, color: '#faf5ff' },
      { offset: 1, color: '#f3e8ff' },
    ],
  },
  {
    id: 'grad-rose-blush',
    type: 'linear',
    angleDeg: 180,
    stops: [
      { offset: 0, color: '#fff1f2' },
      { offset: 1, color: '#ffe4e6' },
    ],
  },
  {
    id: 'grad-pearl-white',
    type: 'linear',
    angleDeg: 90,
    stops: [
      { offset: 0, color: '#ffffff' },
      { offset: 1, color: '#f1f5f9' },
    ],
  },
];
