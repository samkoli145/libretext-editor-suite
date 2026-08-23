/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك توليد الأيقونات الديناميكي - SVG Icon Generator
 * 🏛️ الدور: محرك مشترك - توليد أيقونات مخصصة حسب المدخلات
 * 📥 المستهلك: IconLibraryDialog, UiIcon, SharedRibbonBar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dynamic SVG Generation: توليد أيقونات SVG ديناميكياً من وصف نصي
 *    مع تلوين وتكييف حسب الثيم الحالي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. SVG المولد يجب أن يكون آمناً (لا script tags)
 *    2. الأبعاد يجب أن تكون متناسبة
 *    3. الألوان يجب أن تتوافق مع الثيم الفاتح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخلات قبل التوليد
 *    - إرجاع أيقونة افتراضية عند الخطأ
 *    - تنظيف SVG من العناصر الخطرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/IconGeneratorEngine.ts
// ============================================================
// محرك توليد الأيقونات المتجهة الذكي (Vector Icon Generator)
// يدعم توليد أيقونات SVG نقية بأساليب مختلفة وألوان ثيم فاتح عالية التباين
// ============================================================

export type IconStyle = 'line' | 'filled' | 'gradient' | 'duotone' | 'badge';

export interface GeneratedIcon {
  id: string;
  prompt: string;
  svg: string;
  dataUrl: string;
  matchedTerms: string[];
}

const COLOR_WORDS: Record<string, string> = {
  أحمر: '#ef4444',
  red: '#ef4444',
  أزرق: '#2563eb',
  blue: '#2563eb',
  أخضر: '#10b981',
  green: '#10b981',
  أصفر: '#eab308',
  yellow: '#eab308',
  برتقالي: '#f97316',
  orange: '#f97316',
  بنفسجي: '#8b5cf6',
  purple: '#8b5cf6',
  وردي: '#ec4899',
  pink: '#ec4899',
  تركوازي: '#0d9488',
  teal: '#0d9488',
  رمادي: '#475569',
  gray: '#475569',
  كحلي: '#1e293b',
  navy: '#1e293b',
  ذهبي: '#b45309',
  gold: '#b45309',
};

function shadeColor(hex: string, factor = 0.7): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.min(255, Math.round(((num >> 16) & 255) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((num >> 8) & 255) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((num & 255) * factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function getFillOrStroke(color: string, style: IconStyle, gradientId: string): string {
  switch (style) {
    case 'filled':
      return `fill="${color}" stroke="none"`;
    case 'gradient':
      return `fill="url(#${gradientId})" stroke="${color}" stroke-width="1.5"`;
    case 'duotone':
      return `fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
    case 'badge':
      return `fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
    default:
      return `fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;
  }
}

const SHAPE_BUILDERS: Array<{
  keys: string[];
  build: (color: string, style: IconStyle, gid: string) => string;
}> = [
  {
    keys: ['دائرة', 'circle', 'قرص'],
    build: (c, s, g) => `<circle cx="32" cy="32" r="22" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['مربع', 'square', 'صندوق', 'بطاقة'],
    build: (c, s, g) =>
      `<rect x="12" y="12" width="40" height="40" rx="8" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['مثلث', 'triangle'],
    build: (c, s, g) => `<path d="M32 10 L54 52 L10 52 Z" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['نجمة', 'star'],
    build: (c, s, g) =>
      `<path d="M32 8l7 15 16 2.5-11.5 11 2.7 16L32 45l-14.2 7.5 2.7-16L9 25.5 25 23z" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['قلب', 'heart'],
    build: (c, s, g) =>
      `<path d="M32 54C20 44 10 36 10 25c0-7 5-12 11-12 4.5 0 8.5 2.5 11 6.5C34.5 15.5 38.5 13 43 13c6 0 11 5 11 12 0 11-10 19-22 29z" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['سهم', 'arrow', 'موصل'],
    build: (c, s, g) =>
      `<path d="M12 32h40M38 18l14 14-14 14" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    keys: ['برق', 'صاعقة', 'bolt', 'lightning', 'طاقة'],
    build: (c, s, g) => `<path d="M36 6L14 36h14l-4 22 22-30H32z" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['سحابة', 'غيمة', 'cloud', 'سحابي'],
    build: (c, s, g) =>
      `<path d="M18 46a10 10 0 0 1 0-20 14 14 0 0 1 27-3 11 11 0 0 1-1 23z" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['درع', 'حماية', 'shield', 'أمان'],
    build: (c, s, g) =>
      `<path d="M32 10 L50 18 C50 38 32 54 32 54 C32 54 14 38 14 18 Z" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['دردشة', 'رسالة', 'chat', 'message', 'شرح', 'callout'],
    build: (c, s, g) =>
      `<path d="M12 16 h40 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 h-24 l-12 8 v-8 h-4 a4 4 0 0 1 -4 -4 v-20 a4 4 0 0 1 4 -4 z" ${getFillOrStroke(c, s, g)} />`,
  },
  {
    keys: ['ملاحظة', 'قفل', 'lock', 'كود', 'code'],
    build: (c, s, g) =>
      `<path d="M22 24V16a10 10 0 0 1 20 0v8M16 24h32v28H16z" ${getFillOrStroke(c, s, g)} />`,
  },
];

export class IconGeneratorEngine {
  private static instance: IconGeneratorEngine;

  public static getInstance(): IconGeneratorEngine {
    if (!IconGeneratorEngine.instance) {
      IconGeneratorEngine.instance = new IconGeneratorEngine();
    }
    return IconGeneratorEngine.instance;
  }

  public generate(prompt: string, style: IconStyle = 'line'): GeneratedIcon {
    const lower = prompt.toLowerCase();
    const matchedTerms: string[] = [];

    let primaryColor = '#2563eb';
    for (const [word, hex] of Object.entries(COLOR_WORDS)) {
      if (lower.includes(word)) {
        primaryColor = hex;
        matchedTerms.push(word);
        break;
      }
    }

    const shapes: string[] = [];
    const gradientId = `grad-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    for (const builder of SHAPE_BUILDERS) {
      if (builder.keys.some((k) => lower.includes(k))) {
        shapes.push(builder.build(primaryColor, style, gradientId));
        matchedTerms.push(builder.keys[0]);
      }
    }

    if (shapes.length === 0) {
      shapes.push(SHAPE_BUILDERS[0].build(primaryColor, style, gradientId));
    }

    const defs =
      style === 'gradient'
        ? `<defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${primaryColor}"/><stop offset="100%" stop-color="${shadeColor(primaryColor)}"/></linearGradient></defs>`
        : '';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">${defs}${shapes.join('')}</svg>`;

    return {
      id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      prompt,
      svg,
      dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      matchedTerms,
    };
  }
}

export const iconGeneratorEngine = IconGeneratorEngine.getInstance();
