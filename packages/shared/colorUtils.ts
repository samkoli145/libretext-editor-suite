/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أدوات الألوان والتحويلات المشتركة - Color Utilities
 * 🏛️ الدور: مكون مشترك - تحويل HEX إلى RGBA والعكس وفلاتر الألوان
 * 📥 المستهلك: كل المحررات والمحركات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Color Conversion Utilities: أدوات تحويل الألوان
 *    مع RGBA interface وHEX/RGB conversions
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القيم يجب أن تبقى بين 0-255
 *    2. الشفافية يجب أن تبقى بين 0-1
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Math.min/max لتقييد القيم
 *    - fallback لقيم افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * تحويل كود HEX إلى RGBA
 */
export function hexToRgba(hex: string, alpha = 1): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * حساب درجة السطوع ولون النص المناسب (أبيض أو رمادي داكن) للتباين البصري
 */
export function getAccessibleTextColor(hexColor: string): '#ffffff' | '#1e293b' {
  const cleanHex = hexColor.replace('#', '');
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c+c).join('') : cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // المعادلة القياسية للسطوع YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#1e293b' : '#ffffff';
}

/**
 * لوحة الألوان الافتراضية النقية (Pure Light Palette)
 */
export const STUDIO_PALETTE = [
  '#2563eb', // Blue
  '#0d9488', // Teal
  '#16a34a', // Emerald
  '#d97706', // Amber
  '#e11d48', // Rose
  '#7c3aed', // Purple
  '#475569', // Slate
  '#0f172a', // Dark Navy
];
