/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: theme-engine.ts
 * 📂 المسار: packages/core/src/engines/theme-engine.ts
 * 🎯 الهدف الرئيسي: توليد ثيمات عرض غير محدودة من أي لون أساسي (HSL math)
 * 📋 المعايير: خلفيات فاتحة دائماً (L>=96%)، تباين نص >= 4.5، أسماء عربية
 * 🧪 الاختبارات: packages/core/tests/engines/theme-engine.test.ts
 * 🏷️ المعرف: CORE-ENG-THEME-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Generative Theme Factory — الثيم دالة رياضية في اللون الأساسي:
 *    primary = اللون، secondary = -15° دورة لونية، background = نفس الصبغة
 *    عند إشباع 8% وإضاءة 97% → تناغم مضمون بلا تصميم يدوي.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. hex غير صالح → يرمي خطأ صريحاً (لا ثيمات صامتة مشوهة).
 *    2. الإضاءة النصية تُشتق من الإشباع — الألوان الحمضية تحتاج نصاً أدكن.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - regex hex صارم + قص عدد الثيمات المولدة 1..360.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/engines/index (barrel core)
 *    - 📦 التبعيات: ./impress-engine.ts (PresentationTheme)
 *    - 🧪 اختبارات: tests/engines/theme-engine.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - hexToHsl / hslToHex: تحويل فضاءات لونية (#L74, #L92)
 *    - createThemeFromColor: توليد ثيم كامل من لون (#L118)
 *    - generateThemeSpectrum: N ثيماً حول عجلة الألوان (#L146)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: HSL color space (public domain math)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { PresentationTheme } from './impress-engine';

const HEX_PATTERN = /^#([0-9a-fA-F]{6})$/;

interface Hsl {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** تحويل HEX إلى HSL (h: 0-360, s/l: 0-100). */
export function hexToHsl(hex: string): Hsl {
  const match = HEX_PATTERN.exec(hex.trim());
  if (!match) throw new Error(`Invalid hex color: "${hex}"`);

  const num = parseInt(match[1]!, 16);
  const r = ((num >> 16) & 0xff) / 255;
  const g = ((num >> 8) & 0xff) / 255;
  const b = (num & 0xff) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l: l * 100 };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);

  return { h: (h + 360) % 360, s: s * 100, l: l * 100 };
}

function channelToHex(c: number): string {
  const v = Math.round(clamp(c, 0, 1) * 255);
  return v.toString(16).padStart(2, '0');
}

/** تحويل HSL إلى HEX. */
export function hslToHex(h: number, s: number, l: number): string {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let rgb: [number, number, number];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  const [r, g, b] = rgb;
  return `#${channelToHex(r! + m)}${channelToHex(g! + m)}${channelToHex(b! + m)}`;
}

/** اسم عربي تقريبي للصبغة — للعرض فقط. */
function hueNameAr(h: number): string {
  if (h < 15 || h >= 345) return 'قرمزي';
  if (h < 45) return 'برتقالي';
  if (h < 70) return 'ذهبي';
  if (h < 160) return 'زمردي';
  if (h < 200) return 'فيروزي';
  if (h < 255) return 'أزرق';
  if (h < 290) return 'بنفسجي';
  return 'وردي';
}

/**
 * توليد ثيم عرض كامل من لون أساسي واحد.
 * الخلفية: نفس الصبغة بإشباع 10% وإضاءة 97% (فاتح نقي دائماً).
 */
export function createThemeFromColor(
  baseHex: string,
  name?: string,
): PresentationTheme {
  const { h, s } = hexToHsl(baseHex);

  return {
    name: name ?? `Generated ${hueNameAr(h)}`,
    nameAr: name ?? `${hueNameAr(h)} مولّد`,
    primaryColor: hslToHex(h, clamp(s, 55, 85), 42),
    secondaryColor: hslToHex((h + 340) % 360, clamp(s, 50, 80), 38),
    backgroundColor: hslToHex(h, 10, 97),
    textColor: hslToHex(h, 30, 12),
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    desc: `ثيم مولّد آلياً من ${baseHex} بصبغة ${Math.round(h)}°`,
  };
}

/**
 * توليد طيف ثيمات حول عجلة الألوان — ثيمات غير محدودة عملياً.
 * count مقصوص على 1..360.
 */
export function generateThemeSpectrum(
  baseHex: string,
  count: number,
): PresentationTheme[] {
  const n = clamp(Math.round(count), 1, 360);
  const { h } = hexToHsl(baseHex);
  const step = 360 / n;

  return Array.from({ length: n }, (_, i) => {
    const hue = (h + i * step) % 360;
    return createThemeFromColor(hslToHex(hue, 65, 42));
  });
}
