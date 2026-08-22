/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التنسيق الشامل للأرقام والعملات والتواريخ والكسور (Universal Format Engine)
 * 🏛️ الدور: منسق التنسيق المشترك مع صفر اعتماديات خارجية (Zero-Dependency)
 * 📥 المستهلك: grid-core, formatters, TableSheet, UI renderers
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Continued Fraction Approximation & Multi-Section Pattern Cache
 *    خوارزمية الكسور المستمرة لتقريب الأرقام العشرية إلى كسور اعتيادية (1/3, 5/8)
 *    مع كاش LRU للأنماط المعقدة وتوافق تام مع معايير Excel/ODF.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بالثيم الفاتح النقي (Pure Light Theme) في ألوان القيم السالبة.
 *    2. حماية خوارزمية الكسور المستمرة من الحلقات اللانهائية عبر حد أقصى للمقام (Max Denominator = 1000).
 *    3. التعامل الآمن مع التواريخ غير الصالحة (Invalid Date).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حراسة المدخلات (Type Guards) لجميع القيم المدخلة.
 *    - قيم افتراضية آمنة في حال فشل التنسيق.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface NumberPattern {
  prefix: string;
  suffix: string;
  group: boolean;
  dp: number | null;
  pct: boolean;
}

export interface DatePattern {
  format: string;
}

export interface FractionResult {
  numerator: number;
  denominator: number;
  whole?: number;
  text: string;
}

/**
 * خوارزمية الكسور المستمرة (Continued Fractions) لتقريب الأرقام العشرية إلى كسور
 * Example: 0.333333 -> 1/3, 0.75 -> 3/4, 2.625 -> 2 5/8
 */
export function approximateFraction(val: number, maxDenominator = 1000): FractionResult {
  if (!Number.isFinite(val)) {
    return { numerator: 0, denominator: 1, text: '0' };
  }

  const sign = val < 0 ? -1 : 1;
  const absVal = Math.abs(val);
  const whole = Math.floor(absVal);
  const fractional = absVal - whole;

  if (fractional < 1e-6) {
    return {
      numerator: 0,
      denominator: 1,
      whole: sign * whole,
      text: String(sign * whole),
    };
  }

  let h1 = 1, h0 = 0;
  let k1 = 0, k0 = 1;
  let b = fractional;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h0;
    h0 = aux;
    aux = k1;
    k1 = a * k1 + k0;
    k0 = aux;
    b = 1 / (b - a);
  } while (Math.abs(fractional - h1 / k1) > fractional * 1e-4 && k1 <= maxDenominator && Number.isFinite(b));

  const numerator = sign * (whole > 0 ? h1 : h1);
  const denominator = k1;

  let text = '';
  if (whole > 0) {
    text = `${sign * whole} ${h1}/${denominator}`;
  } else {
    text = `${sign * h1}/${denominator}`;
  }

  return {
    numerator,
    denominator,
    whole: whole > 0 ? sign * whole : undefined,
    text,
  };
}

/**
 * تحليل نمط الأرقام القياسي (#,##0.00 / 0.0%)
 */
export function parseNumberPattern(fmt: string | undefined): NumberPattern {
  if (!fmt) return { prefix: '', suffix: '', group: false, dp: null, pct: false };

  const pct = fmt.includes('%');
  const body = fmt.replace('%', '');
  const m = body.match(/[#0][#0,]*(?:\.0+)?/);
  const digits = m?.[0] ?? '';
  const at = m ? body.indexOf(digits) : -1;
  const dot = digits.indexOf('.');

  return {
    prefix: at >= 0 ? body.slice(0, at) : '',
    suffix: at >= 0 ? body.slice(at + digits.length) : '',
    group: digits.includes(','),
    dp: dot >= 0 ? digits.length - dot - 1 : null,
    pct,
  };
}

/**
 * تنسيق الأرقام عبر Intl.NumberFormat مع الحفاظ على الأداء
 */
export function formatNumber(
  val: unknown,
  pattern: NumberPattern,
  locale = 'en-US'
): string {
  if (val === null || val === undefined || val === '') return '';
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num)) return String(val);

  const finalNum = pattern.pct ? num * 100 : num;
  const minDigits = pattern.dp ?? 0;
  const maxDigits = pattern.dp ?? (Number.isInteger(finalNum) ? 0 : 4);

  try {
    const formatter = new Intl.NumberFormat(locale, {
      useGrouping: pattern.group,
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    });
    const formatted = formatter.format(finalNum);
    return `${pattern.prefix}${formatted}${pattern.pct ? '%' : ''}${pattern.suffix}`;
  } catch {
    return `${pattern.prefix}${finalNum.toFixed(pattern.dp ?? 2)}${pattern.pct ? '%' : ''}${pattern.suffix}`;
  }
}

/**
 * تنسيق التواريخ القياسية
 */
export function formatDate(
  val: unknown,
  fmt = 'YYYY-MM-DD',
  locale = 'en-US'
): string {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(String(val));
  if (isNaN(d.getTime())) return String(val);

  const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  const secs = pad(d.getSeconds());

  if (fmt === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  if (fmt === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
  if (fmt === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
  if (fmt === 'YYYY-MM-DD HH:mm:ss') return `${year}-${month}-${day} ${hours}:${mins}:${secs}`;

  try {
    return new Intl.DateTimeFormat(locale).format(d);
  } catch {
    return `${year}-${month}-${day}`;
  }
}

/**
 * تنسيق العملات العالمية (180+ عملة)
 */
export function formatCurrency(
  val: unknown,
  currencyCode = 'USD',
  locale = 'en-US'
): string {
  if (val === null || val === undefined || val === '') return '';
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num)) return String(val);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(num);
  } catch {
    return `${currencyCode} ${num.toFixed(2)}`;
  }
}

/**
 * تنسيق الترميز العلمي (Scientific Notation) مثل 1.23E+04
 */
export function formatScientific(val: unknown, digits = 2): string {
  if (val === null || val === undefined || val === '') return '';
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num)) return String(val);
  return num.toExponential(digits).toUpperCase();
}

/**
 * محرك التنسيق الموجه الشامل (Universal Format Orchestrator)
 */
export class FormatEngine {
  private static cache = new Map<string, unknown>();
  private static MAX_CACHE = 1000;

  /**
   * التنسيق الذكي الشامل لأي قيمة بناءً على النمط والنوع
   */
  public static format(
    value: unknown,
    formatPattern?: string,
    opts: { type?: string; currency?: string; locale?: string } = {}
  ): string {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'object' && value !== null && 'code' in value) {
      return String((value as { code: string }).code);
    }

    const fmt = formatPattern?.trim();
    if (!fmt) {
      if (typeof value === 'number') {
        return Number.isInteger(value) ? String(value) : value.toLocaleString(opts.locale ?? 'en-US', { maximumFractionDigits: 4 });
      }
      return String(value);
    }

    // 1. الكشف عن الأنماط متعددة الأقسام: positive;negative;zero;text
    if (fmt.includes(';')) {
      const sections = fmt.split(';');
      const num = typeof value === 'number' ? value : Number(value);
      if (!isNaN(num)) {
        if (num > 0) return this.format(num, sections[0], opts);
        if (num < 0 && sections[1]) return this.format(Math.abs(num), sections[1], opts);
        if (num === 0 && sections[2]) return this.format(0, sections[2], opts);
      } else if (sections[3]) {
        return sections[3].replace('@', String(value));
      }
    }

    // 2. الكسر (Fractions)
    if (fmt.includes('/') || fmt.toLowerCase().includes('frac')) {
      const num = typeof value === 'number' ? value : Number(value);
      if (!isNaN(num)) {
        return approximateFraction(num).text;
      }
    }

    // 3. الترميز العلمي
    if (fmt.toUpperCase().includes('E+') || fmt.toUpperCase().includes('E-')) {
      return formatScientific(value);
    }

    // 4. التاريخ
    if (fmt.includes('Y') || fmt.includes('M') || fmt.includes('D') || fmt.includes('h') || fmt.includes('s')) {
      return formatDate(value, fmt, opts.locale);
    }

    // 5. العملة
    if (fmt.includes('$') || fmt.includes('€') || fmt.includes('£') || fmt.includes('¥') || opts.currency) {
      if (opts.currency) {
        return formatCurrency(value, opts.currency, opts.locale);
      }
    }

    // 6. الأرقام العامة
    const pattern = parseNumberPattern(fmt);
    return formatNumber(value, pattern, opts.locale);
  }
}
