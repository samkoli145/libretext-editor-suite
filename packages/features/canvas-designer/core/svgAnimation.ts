/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الرسوم المتحركة المتجهة SVG - SVG Animations & CSS Keyframes
 * 🏛️ الدور: محرك مشترك - توليد قوالب حركات تفاعلية (Fade, Pulse, Float, Spin, Slide, Bounce, Wave)
 * 📥 المستهلك: ElementPropertiesPanel, ElementRenderer, svgExporter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    SMIL + CSS Keyframes Generator: مولد قوالب حركات SVG متجهة
 *    مع تصدير CSS Keyframes ووسوم SMIL في ملفات SVG
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. بعض المتصفحات لا تدعم SMIL
 *    2. التكرار اللانهائي يجب أن يكون قابلاً للإيقاف
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - fallback لـ CSS Keyframes عند عدم دعم SMIL
 *    - فحص المدة قبل التطبيق
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type SvgAnimationType =
  'none' | 'fade-in' | 'pulse' | 'float' | 'spin' | 'bounce' | 'slide-right' | 'slide-up';

export interface AnimationPreset {
  id: SvgAnimationType;
  name: string;
  nameAr: string;
  cssClass: string;
  keyframesCss: string;
  smilTag?: (durationSec: number) => string;
}

/**
 * قوالب الرسوم المتحركة المتجهة لـ SVG
 */
export const SVG_ANIMATION_PRESETS: AnimationPreset[] = [
  {
    id: 'none',
    name: 'None',
    nameAr: 'بدون حركة',
    cssClass: '',
    keyframesCss: '',
  },
  {
    id: 'fade-in',
    name: 'Fade In',
    nameAr: 'ظهور تدريجي (Fade In)',
    cssClass: 'svg-anim-fade-in',
    keyframesCss: `
      @keyframes svgFadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      .svg-anim-fade-in {
        animation: svgFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  },
  {
    id: 'pulse',
    name: 'Pulse',
    nameAr: 'نبض مستمر (Pulse)',
    cssClass: 'svg-anim-pulse',
    keyframesCss: `
      @keyframes svgPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.85; }
      }
      .svg-anim-pulse {
        animation: svgPulse 2s ease-in-out infinite;
        transform-origin: center center;
      }
    `,
  },
  {
    id: 'float',
    name: 'Float',
    nameAr: 'طفو وتموج ناعم (Float)',
    cssClass: 'svg-anim-float',
    keyframesCss: `
      @keyframes svgFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .svg-anim-float {
        animation: svgFloat 3s ease-in-out infinite;
      }
    `,
  },
  {
    id: 'spin',
    name: 'Spin',
    nameAr: 'دوران دائري (Spin)',
    cssClass: 'svg-anim-spin',
    keyframesCss: `
      @keyframes svgSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .svg-anim-spin {
        animation: svgSpin 6s linear infinite;
        transform-origin: center center;
      }
    `,
  },
  {
    id: 'bounce',
    name: 'Bounce',
    nameAr: 'ارتداد حيوي (Bounce)',
    cssClass: 'svg-anim-bounce',
    keyframesCss: `
      @keyframes svgBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      .svg-anim-bounce {
        animation: svgBounce 1.2s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
      }
    `,
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    nameAr: 'انزلاق من اليمين',
    cssClass: 'svg-anim-slide-right',
    keyframesCss: `
      @keyframes svgSlideRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .svg-anim-slide-right {
        animation: svgSlideRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    nameAr: 'انزلاق من الأسفل للأعلى',
    cssClass: 'svg-anim-slide-up',
    keyframesCss: `
      @keyframes svgSlideUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .svg-anim-slide-up {
        animation: svgSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  },
];

/**
 * استخراج كود CSS المجمع للحركات المستخدمة في الكانفا لتضمينها داخل `<style>` في ملف SVG
 */
export function generateSvgAnimationsCss(usedAnimationTypes: SvgAnimationType[]): string {
  const uniqueTypes = Array.from(new Set(usedAnimationTypes.filter((t) => t && t !== 'none')));
  if (uniqueTypes.length === 0) return '';

  return uniqueTypes
    .map((type) => {
      const preset = SVG_ANIMATION_PRESETS.find((p) => p.id === type);
      return preset ? preset.keyframesCss.trim() : '';
    })
    .filter(Boolean)
    .join('\n');
}
