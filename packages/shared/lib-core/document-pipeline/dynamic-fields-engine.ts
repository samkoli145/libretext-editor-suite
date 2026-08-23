/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الحقول الديناميكية المشترك (Universal Dynamic Fields Engine)
 * 🏛️ الدور: نواة معزولة (Zero-Dependency) لتقييم الرموز الديناميكية مثل
 *           `{{date}}`, `{{time}}`, `{{page}}`, `{{pages}}`, `{{title}}`, `{{author}}`
 *           والمتغيرات المخصصة عبر كافة المحررات الأربعة.
 * 📥 المستهلك: RichTextEditor, CanvasDesignerEditor, UIDesignerEditor, PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Raw-Token Model Preservation & Output-Only Resolution:
 *    النموذج يخزن النص الخام للرمز دون تعديل؛ بينما يتم التقييم والاشتقاق
 *    لحظياً عند العرض أو التصدير، مما يمنع تجمد البيانات التاريخية.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الرموز المجهولة يجب أن تبقى كما هي دون إثارة أخطاء runtime.
 *    2. حقول أرقام الصفحات تعتمد على سياق العرض (Page Context) وتتحدث ديناميكياً.
 *    3. تجنب الـ RegEx Denial of Service (ReDoS) بحصر النطاق وتجنب التكرار المتداخل.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لسياق الحقول الديناميكية
 *    - حماية من الرموز الفارغة أو غير المعرفة
 *    - دعم تنسيقات التواريخ الدولية والمحلية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface FieldContext {
  pageNumber?: number;
  totalPages?: number;
  documentTitle?: string;
  authorName?: string;
  wordCount?: number;
  currentDate?: Date;
  variables?: Record<string, string | number>;
}

export interface DynamicFieldDefinition {
  token: string;
  label: string;
  category: 'datetime' | 'pagination' | 'metadata' | 'variable';
  description: string;
  example: string;
}

export const STANDARD_DYNAMIC_FIELDS: DynamicFieldDefinition[] = [
  {
    token: '{{date}}',
    label: 'التاريخ الحالي',
    category: 'datetime',
    description: 'تاريخ اليوم بالتنسيق المحلي',
    example: '2026-08-18',
  },
  {
    token: '{{time}}',
    label: 'الوقت الحالي',
    category: 'datetime',
    description: 'الوقت الحالي بالدقائق والثواني',
    example: '14:30',
  },
  {
    token: '{{page}}',
    label: 'رقم الصفحة',
    category: 'pagination',
    description: 'رقم الصفحة الحالية',
    example: '1',
  },
  {
    token: '{{pages}}',
    label: 'إجمالي الصفحات',
    category: 'pagination',
    description: 'عدد صفحات المستند الإجمالي',
    example: '5',
  },
  {
    token: '{{title}}',
    label: 'عنوان المستند',
    category: 'metadata',
    description: 'العنوان التعريفي للمستند',
    example: 'تقرير المشروع',
  },
  {
    token: '{{author}}',
    label: 'اسم المؤلف',
    category: 'metadata',
    description: 'اسم المستخدم أو منشئ المستند',
    example: 'أحمد',
  },
  {
    token: '{{wordcount}}',
    label: 'عدد الكلمات',
    category: 'metadata',
    description: 'إجمالي الكلمات المكتوبة في المستند',
    example: '1250',
  },
];

/**
 * تقييم واستبدال كافة الحقول الديناميكية في نص معين
 */
export function resolveDynamicFields(text: string, context: FieldContext = {}): string {
  if (!text || typeof text !== 'string') return '';

  const now = context.currentDate ?? new Date();
  const formattedDate = now.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, rawKey) => {
    const key = rawKey.toLowerCase();

    switch (key) {
      case 'date':
      case 'today':
        return formattedDate;
      case 'time':
      case 'now':
        return formattedTime;
      case 'page':
      case 'pagenumber':
        return String(context.pageNumber ?? 1);
      case 'pages':
      case 'totalpages':
        return String(context.totalPages ?? 1);
      case 'title':
      case 'documenttitle':
        return context.documentTitle ?? 'مستند بدون عنوان';
      case 'author':
      case 'authorname':
        return context.authorName ?? 'المصمم';
      case 'wordcount':
      case 'words':
        return String(context.wordCount ?? 0);
      default:
        // فحص المتغيرات المخصصة
        if (context.variables && key in context.variables) {
          return String(context.variables[key]);
        }
        return match; // إبقاء الرمز كما هو إذا لم يتطابق
    }
  });
}

/**
 * فحص ما إذا كان النص يحتوي على حقول ديناميكية
 */
export function containsDynamicFields(text: string): boolean {
  if (!text) return false;
  return /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/.test(text);
}
