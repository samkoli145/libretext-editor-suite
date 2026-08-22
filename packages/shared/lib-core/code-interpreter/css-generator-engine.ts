/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك توليد تأثيرات وأنماط CSS و Tailwind - Zero-Dependency CSS Generator Engine
 * 🏛️ الدور: نواة التصميم وتوليد الأنماط (Zero-Dependency Shared Engine Core)
 * 📥 المستهلك: InteractiveWysiwygCodeStudio, CssEffectsGeneratorModal, UIDesigner
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - توليد حزم الظلال المعمارية متعددة الطبقات (Architectural Shadow Stacks)
 *    - حساب معادلة استدارة الحواف المتداخلة (Nested Radius Rule: R_in = R_out - P)
 *    - توليد التدرجات الضوئية الفاتحة النقية (Pure Light Mesh & Linear Gradients)
 *    - دعم تصدير متزامن لكود CSS الخام وكود فئات Tailwind CSS
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بقواعد الثيم الفاتح النقي وتجنب الظلال السوداء الفجة
 *    2. منع الحواف السالبة عند حساب نصف القطر الداخلي (Math.max(0, ...))
 *    3. التوافق العالي مع متصفحات الويب بدون بادئات غير قياسية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تقييد قيم الشفافية والألوان بدقة (Clamping 0-1 and 0-255)
 *    - توفير نصوص CSS نظيفة وخالية من الأخطاء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset?: boolean;
}

export interface ShadowStackPreset {
  id: string;
  nameAr: string;
  descriptionAr: string;
  layers: ShadowLayer[];
}

export interface LightGradientPreset {
  id: string;
  nameAr: string;
  type: 'linear' | 'radial' | 'mesh';
  angleDeg?: number;
  stops: { color: string; positionPercent: number }[];
  tailwindClass: string;
}

export const SHADOW_STACK_PRESETS: ShadowStackPreset[] = [
  {
    id: 'subtle-elevation-1',
    nameAr: 'ارتفاع خفيف (بطاقة عادية)',
    descriptionAr: 'ظل خفيف جداً يمنح البطاقة فصلاً ناعماً عن الخلفية',
    layers: [
      { x: 0, y: 1, blur: 3, spread: 0, color: '#0f172a', opacity: 0.04 },
      { x: 0, y: 1, blur: 2, spread: -1, color: '#0f172a', opacity: 0.04 },
    ],
  },
  {
    id: 'medium-elevation-2',
    nameAr: 'ارتفاع متوسط (حالة تحويم Hover)',
    descriptionAr: 'طبقتان متدرجتان تمنحان عمقاً متوازناً عند تفاعل الفأرة',
    layers: [
      { x: 0, y: 4, blur: 6, spread: -1, color: '#0f172a', opacity: 0.06 },
      { x: 0, y: 2, blur: 4, spread: -2, color: '#0f172a', opacity: 0.04 },
    ],
  },
  {
    id: 'floating-modal-3',
    nameAr: 'نافذة عائمة (Floating Modal / Dialog)',
    descriptionAr: 'حزمة ظلال ثلاثية تبرز النوافذ المنبثقة والقوائم السياقية',
    layers: [
      { x: 0, y: 10, blur: 15, spread: -3, color: '#0f172a', opacity: 0.08 },
      { x: 0, y: 4, blur: 6, spread: -4, color: '#0f172a', opacity: 0.04 },
      { x: 0, y: 20, blur: 25, spread: -5, color: '#0f172a', opacity: 0.05 },
    ],
  },
  {
    id: 'soft-color-glow',
    nameAr: 'وهج ملون ناعم (Brand Accent Glow)',
    descriptionAr: 'ظل ملون لطيف يمنح الأزرار الرئيسية حيوية بدون إبهار',
    layers: [
      { x: 0, y: 4, blur: 14, spread: 0, color: '#3b82f6', opacity: 0.2 },
      { x: 0, y: 2, blur: 4, spread: -1, color: '#1d4ed8', opacity: 0.1 },
    ],
  },
  {
    id: 'crisp-inset-panel',
    nameAr: 'حفر غائر نقي (Inset Input / Well)',
    descriptionAr: 'ظل داخلي خفيف يعطي إحساساً بالعمق لحقول الإدخال',
    layers: [
      { x: 0, y: 2, blur: 4, spread: 0, color: '#0f172a', opacity: 0.06, inset: true },
    ],
  },
];

export const LIGHT_GRADIENTS_PRESETS: LightGradientPreset[] = [
  {
    id: 'pearl-slate',
    nameAr: 'لؤلؤي فاتح (Slate Pearl)',
    type: 'linear',
    angleDeg: 135,
    stops: [
      { color: '#ffffff', positionPercent: 0 },
      { color: '#f8fafc', positionPercent: 50 },
      { color: '#f1f5f9', positionPercent: 100 },
    ],
    tailwindClass: 'bg-gradient-to-br from-white via-slate-50 to-slate-100',
  },
  {
    id: 'warm-aurora',
    nameAr: 'شروق دافئ ناعم (Warm Aurora)',
    type: 'linear',
    angleDeg: 120,
    stops: [
      { color: '#fffbeb', positionPercent: 0 },
      { color: '#fef3c7', positionPercent: 40 },
      { color: '#ecfdf5', positionPercent: 100 },
    ],
    tailwindClass: 'bg-gradient-to-br from-amber-50 via-amber-100/40 to-emerald-50/50',
  },
  {
    id: 'soft-sky-breeze',
    nameAr: 'نسيم سماوي فاتح (Sky Breeze)',
    type: 'linear',
    angleDeg: 180,
    stops: [
      { color: '#f0f9ff', positionPercent: 0 },
      { color: '#e0f2fe', positionPercent: 60 },
      { color: '#ffffff', positionPercent: 100 },
    ],
    tailwindClass: 'bg-gradient-to-b from-sky-50 via-sky-100/50 to-white',
  },
  {
    id: 'mint-frost',
    nameAr: 'نعناع بلوري (Mint Frost)',
    type: 'radial',
    stops: [
      { color: '#f0fdf4', positionPercent: 0 },
      { color: '#dcfce7', positionPercent: 50 },
      { color: '#ffffff', positionPercent: 100 },
    ],
    tailwindClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-emerald-100/40 to-white',
  },
];

export class CssGeneratorEngine {
  /**
   * حساب معادلة الزاوية الداخلية المتداخلة (Nested Border Radius)
   * R_inner = max(0, R_outer - Padding)
   */
  public static calculateNestedRadius(outerRadius: number, padding: number): number {
    return Math.max(0, outerRadius - padding);
  }

  /**
   * توليد قيمة box-shadow من مصفوفة طبقات
   */
  public static generateBoxShadowCss(layers: ShadowLayer[]): string {
    if (layers.length === 0) return 'none';

    return layers
      .map((l) => {
        const rgbaColor = this.hexToRgba(l.color, l.opacity);
        const insetText = l.inset ? 'inset ' : '';
        return `${insetText}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgbaColor}`;
      })
      .join(', ');
  }

  /**
   * توليد قيمة CSS Gradient
   */
  public static generateGradientCss(preset: LightGradientPreset): string {
    const stopsStr = preset.stops.map((s) => `${s.color} ${s.positionPercent}%`).join(', ');
    if (preset.type === 'radial') {
      return `radial-gradient(circle at center, ${stopsStr})`;
    }
    return `linear-gradient(${preset.angleDeg || 135}deg, ${stopsStr})`;
  }

  /**
   * توليد نمط الزجاج الفاتح النقي (Pure Light Frosted Glass)
   */
  public static generateFrostedGlassCss(blurAmount = 12, alpha = 0.8): {
    css: string;
    tailwind: string;
  } {
    return {
      css: `background: rgba(255, 255, 255, ${alpha});\nbackdrop-filter: blur(${blurAmount}px);\n-webkit-backdrop-filter: blur(${blurAmount}px);\nborder: 1px solid rgba(255, 255, 255, 0.4);\nbox-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);`,
      tailwind: `bg-white/${Math.round(alpha * 100)} backdrop-blur-md border border-white/40 shadow-sm`,
    };
  }

  /**
   * توليد تخطيط شبكي تفاعلي CSS Grid
   */
  public static generateGridCss(cols: number, gapPx: number, minColWidthPx = 200): {
    css: string;
    tailwind: string;
  } {
    return {
      css: `display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(${minColWidthPx}px, 1fr));\ngap: ${gapPx}px;`,
      tailwind: `grid grid-cols-1 md:grid-cols-${cols} gap-[${gapPx}px]`,
    };
  }

  private static hexToRgba(hex: string, alpha: number): string {
    const cleanHex = hex.replace('#', '');
    let r = 0;
    let g = 0;
    let b = 0;

    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`;
  }
}
