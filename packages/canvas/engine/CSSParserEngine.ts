/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحليل ومعالجة خصائص CSS والأنماط المدمجة - CSS Parser Engine
 * 🏛️ الدور: محرك مشترك - تحليل inline styles إلى كائنات JavaScript
 * 📥 المستهلك: StyleExtractor, HTMLParserEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Inline CSS Parser: محلل أنماط CSS مدمجة
 *    مع دعم !important وتحويل القيم
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. !important يجب أن يُحتفظ به
 *    2. القيم يجب أن تتحول بشكل صحيح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة النص قبل التحليل
 *    - fallback لـ Record فارغ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ParsedCSSRule {
  property: string;
  value: string;
  isImportant: boolean;
}

export class CSSParserEngine {
  /**
   * تحليل نص CSS إلى مصفوفة من القواعد
   */
  static parseInlineStyle(styleText: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!styleText || typeof styleText !== 'string') return result;

    const pairs = styleText.split(';');
    for (const pair of pairs) {
      const idx = pair.indexOf(':');
      if (idx === -1) continue;
      const key = pair.substring(0, idx).trim().toLowerCase();
      const val = pair.substring(idx + 1).trim();
      if (key && val) {
        result[key] = val;
      }
    }
    return result;
  }

  /**
   * تحويل كائن الخصائص إلى نص Style صالح
   */
  static stringifyStyle(styles: Record<string, string | number | undefined>): string {
    return Object.entries(styles)
      .filter(([_, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${this.camelToKebab(k)}: ${v}`)
      .join('; ');
  }

  /**
   * استخراج قيم الألوان السداسية والـ RGB من نصوص CSS
   */
  static extractColors(cssText: string): string[] {
    const hexPattern = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
    const rgbPattern = /rgba?\([^)]+\)/g;
    const hslPattern = /hsla?\([^)]+\)/g;

    const hexMatches = cssText.match(hexPattern) || [];
    const rgbMatches = cssText.match(rgbPattern) || [];
    const hslMatches = cssText.match(hslPattern) || [];

    return Array.from(new Set([...hexMatches, ...rgbMatches, ...hslMatches]));
  }

  /**
   * تحويل اسم الخاصية من camelCase إلى kebab-case
   */
  static camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * تحويل اسم الخاصية من kebab-case إلى camelCase
   */
  static kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
  }
}
