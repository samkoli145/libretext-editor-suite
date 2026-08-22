/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل وتنسيق الوحدات القياسية لرسام SVG - SVG Units
 * 🏛️ الدور: محرك مشترك - تحويل بين px و mm و cm و in و pt و pc
 * 📥 المستهلك: ElementPropertiesPanel, svgExporter, قياسات الصفحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unit Converter: محرك تحويل وحدات نقية 100%
 *    مع تحليل السلاسل النصية واستخراج القيمة والوحدة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. DPI يجب أن يكون ثابتاً (96 px/in)
 *    2. النسب المئوية تحتاج أصل للحساب
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الوحدة قبل التحويل
 *    - fallback لـ px
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type SvgUnit = 'px' | 'pt' | 'mm' | 'cm' | 'in' | 'pc' | '%' | 'em' | 'rem';

export interface ParsedUnit {
  value: number;
  unit: SvgUnit | string;
}

// ثوابت التحويل إلى البوصة (Inches)
const UNIT_TO_INCH: Record<string, number> = {
  in: 1,
  pt: 1 / 72,
  pc: 1 / 6,
  mm: 1 / 25.4,
  cm: 1 / 2.54,
};

/**
 * تحليل قيمة نصية أو رقمية واستخراج القيمة والوحدة
 * أمثلة: "100px" -> { value: 100, unit: 'px' }, "25.4mm" -> { value: 25.4, unit: 'mm' }
 */
export function parseUnit(input: string | number): ParsedUnit {
  if (typeof input === 'number') {
    return { value: input, unit: 'px' };
  }

  const trimmed = input.trim();
  const match = trimmed.match(/^(-?[\d.]+)\s*([a-zA-Z%]*)$/);

  if (!match) {
    const num = parseFloat(trimmed);
    return {
      value: isNaN(num) ? 0 : num,
      unit: 'px',
    };
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase() || 'px';

  return {
    value: isNaN(value) ? 0 : value,
    unit: unit as SvgUnit,
  };
}

/**
 * تحويل قيمة من وحدة إلى أخرى بالاعتماد على معامل DPI الأساسي
 * @param value القيمة العددية
 * @param fromUnit الوحدة المصدرية ('px', 'mm', 'in', 'pt', إلخ)
 * @param toUnit الوحدة المطلوبة
 * @param dpi كثافة النقط في البوصة (الافتراضي 96 لشاشات الويب)
 * @param basePx الأساس للوحدات النسبية مثل em/rem
 */
export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  dpi = 96,
  basePx = 16
): number {
  if (fromUnit === toUnit || value === 0) {
    return value;
  }

  // 1. تحويل القيمة المصدرية إلى بكسل (Pixels)
  let inPx = value;

  if (fromUnit === 'px') {
    inPx = value;
  } else if (fromUnit === 'em' || fromUnit === 'rem') {
    inPx = value * basePx;
  } else if (fromUnit === '%') {
    inPx = (value / 100) * basePx;
  } else if (UNIT_TO_INCH[fromUnit]) {
    const inInches = value * UNIT_TO_INCH[fromUnit];
    inPx = inInches * dpi;
  }

  // 2. تحويل قيمة البكسل إلى الوحدة المطلوبة
  if (toUnit === 'px') {
    return inPx;
  } else if (toUnit === 'em' || toUnit === 'rem') {
    return inPx / basePx;
  } else if (toUnit === '%') {
    return (inPx / basePx) * 100;
  } else if (UNIT_TO_INCH[toUnit]) {
    const inInches = inPx / dpi;
    return inInches / UNIT_TO_INCH[toUnit];
  }

  return inPx;
}

/**
 * تنسيق القيمة مع وحدتها مع تقريب الخانات العشرية
 */
export function formatUnit(value: number, unit: SvgUnit | string = 'px', decimals = 2): string {
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;
  return `${rounded}${unit}`;
}
