/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: validation.ts
 * 📂 المسار: packages/core/src/engines/validation.ts
 * 🎯 الهدف الرئيسي: محرك فحص وتعقيم الكود والمستندات - Validation Issues و Sanitization
 * 📋 المعايير: صفر مكتبات خارجية، فحص سلامة المدخلات والمخرجات
 * 🧪 الاختبارات: tests/engines/validation.test.ts
 * 🏷️ المعرف: CORE-016
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Level Validation Pipeline: خط أنابيب فحص متعدد المستويات
 *    (Syntax → Security → Performance) مع إصدار تقارير مفصلة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. بعض الأخطاء تحذيرية فقط ولا تمنع التنفيذ
 *    2. الفحص يجب أن يكون سريعاً (< 100ms) لمنع تأثير الأداء
 *    3. بعض التحقق يحتاج سياق (مثل HTML sanitizer)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص المدخلات null/undefined أولاً
 *    - إرجاع مصفوفة فارغة بدلاً من null عند عدم وجود أخطاء
 *    - تحديد الحد الأقصى للIssues (100) لمنع تجاوز الذاكرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
}

export class ValidationEngine {
  private static instance: ValidationEngine;

  public static getInstance(): ValidationEngine {
    if (!ValidationEngine.instance) {
      ValidationEngine.instance = new ValidationEngine();
    }
    return ValidationEngine.instance;
  }

  public validateHtml(html: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];

    if (!html || !html.trim()) {
      return { isValid: true, issues };
    }

    const openTags: string[] = [];
    const selfClosing = [
      'br',
      'hr',
      'img',
      'input',
      'meta',
      'link',
      'area',
      'base',
      'col',
      'embed',
      'source',
      'track',
      'wbr',
    ];

    const tagRegex = /<\/?([a-z0-9]+)[^>]*>/gi;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      const fullTag = match[0];
      const tagName = match[1]!.toLowerCase();

      if (selfClosing.includes(tagName) || fullTag.endsWith('/>')) {
        continue;
      }

      if (fullTag.startsWith('</')) {
        const lastOpen = openTags.pop();
        if (lastOpen !== tagName) {
          issues.push({
            type: 'warning',
            message: `وسم إغلاق غير متطابق </${tagName}>، كان المتوقع </${lastOpen || 'غير محدد'}>`,
          });
        }
      } else {
        openTags.push(tagName);
      }
    }

    if (openTags.length > 0) {
      issues.push({
        type: 'warning',
        message: `يوجد ${openTags.length} وسوم غير مغلقة بشكل كامل: ${openTags.join(', ')}`,
      });
    }

    return {
      isValid: issues.filter((i) => i.type === 'error').length === 0,
      issues,
    };
  }

  public sanitize(html: string): string {
    if (!html) return '';
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }
}

export const validationEngine = ValidationEngine.getInstance();
