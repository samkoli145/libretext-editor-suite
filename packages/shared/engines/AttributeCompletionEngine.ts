/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الإكمال التلقائي للسمات - Attribute Auto-completion
 * 🏛️ الدور: محرك مشترك - اقتراح السمات والقيم أثناء الكتابة
 * 📥 المستهلك: SharedSourceCodeEditor, LiveInterpreterEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Context-Aware Completion: اقتراحات تعتمد على السياق (HTML tags, CSS props)
 *    مع مراعاة اللغة الحالية والموقع في الكود
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الاقتراحات يجب أن تكون سريعة (< 20ms)
 *    2. بعض السمات لها قيم محددة (enum-like)
 *    3. الترتيب حسب الأهمية والشيوع
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخل قبل البحث
 *    - إرجاع مصفوفة فارغة عند عدم التطابق
 *    - تعامل مع السمات غير المعروفة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/AttributeCompletionEngine.ts
/**
 * محرك إكمال واقتراح سمات HTML5 و ARIA و CSS
 * مستقل تماماً وبدون أي مكتبات خارجية
 */

export interface AttributeSuggestion {
  name: string;
  description: string;
  required?: boolean;
  values?: string[];
  type: 'string' | 'boolean' | 'enum' | 'url' | 'number';
}

export interface AttributeCompletionItem {
  label: string;
  kind: 'attribute' | 'enum' | 'tag';
  detail: string;
  insertText: string;
}

export class AttributeCompletionEngine {
  private static instance: AttributeCompletionEngine;

  private static TAG_ATTRIBUTES: Record<string, AttributeSuggestion[]> = {
    '*': [
      { name: 'id', description: 'معرّف فريد للعنصر', type: 'string' },
      { name: 'class', description: 'فئات CSS وتنسيقات Tailwind', type: 'string' },
      { name: 'style', description: 'أنماط CSS مضمنة', type: 'string' },
      { name: 'title', description: 'نص تلميحي عند مرور الفأرة', type: 'string' },
      { name: 'lang', description: 'لغة المحتوى', type: 'enum', values: ['ar', 'en', 'fr', 'es'] },
      { name: 'dir', description: 'اتجاه النص', type: 'enum', values: ['rtl', 'ltr', 'auto'] },
      { name: 'tabindex', description: 'ترتيب التبويب بلوحة المفاتيح', type: 'number' },
      { name: 'hidden', description: 'إخفاء العنصر', type: 'boolean' },
      { name: 'draggable', description: 'قابل للسحب والإفلات', type: 'boolean' },
      { name: 'contenteditable', description: 'قابل للتحرير المباشر بالمستند', type: 'boolean' },
      { name: 'data-node-id', description: 'معرّف الكتلة والعنصر التفاعلي', type: 'string' },
    ],
    aria: [
      { name: 'aria-label', description: 'وصف إمكانية الوصول لقارئات الشاشة', type: 'string' },
      { name: 'aria-hidden', description: 'إخفاء من قارئات الشاشة', type: 'boolean' },
      {
        name: 'aria-expanded',
        description: 'حالة القائمة أو الأكورديون (مفتوح/مغلق)',
        type: 'boolean',
      },
      { name: 'aria-selected', description: 'حالة العنصر المحدد', type: 'boolean' },
      { name: 'aria-disabled', description: 'حالة العنصر المعطل', type: 'boolean' },
      {
        name: 'aria-live',
        description: 'إشعار فوري بالتغييرات',
        type: 'enum',
        values: ['off', 'polite', 'assertive'],
      },
    ],
    a: [
      { name: 'href', description: 'عنوان الرابط المستهدف (URL)', type: 'url', required: true },
      {
        name: 'target',
        description: 'نافذة الفتح المستهدفة',
        type: 'enum',
        values: ['_blank', '_self', '_parent', '_top'],
      },
      {
        name: 'rel',
        description: 'علاقة المستند والارتباط',
        type: 'enum',
        values: ['noopener', 'noreferrer', 'nofollow'],
      },
      { name: 'download', description: 'تنزيل الملف المرفق تلقائياً', type: 'string' },
    ],
    img: [
      { name: 'src', description: 'مصدر وعنوان الصورة (URL)', type: 'url', required: true },
      { name: 'alt', description: 'النص البديل المعبر عن الصورة', type: 'string', required: true },
      { name: 'width', description: 'عرض الصورة بالبكسل', type: 'number' },
      { name: 'height', description: 'ارتفاع الصورة بالبكسل', type: 'number' },
      { name: 'loading', description: 'تحميل كسول ذكي', type: 'enum', values: ['lazy', 'eager'] },
    ],
    input: [
      {
        name: 'type',
        description: 'نوع حقل الإدخال',
        type: 'enum',
        required: true,
        values: [
          'text',
          'password',
          'email',
          'number',
          'tel',
          'url',
          'date',
          'checkbox',
          'radio',
          'button',
          'file',
          'color',
          'range',
        ],
      },
      { name: 'name', description: 'اسم الحقل للنموذج', type: 'string', required: true },
      { name: 'value', description: 'القيمة الافتراضية', type: 'string' },
      { name: 'placeholder', description: 'نص تلميحي مؤقت', type: 'string' },
      { name: 'required', description: 'حقل إلزامي', type: 'boolean' },
      { name: 'disabled', description: 'تعطيل الحقل', type: 'boolean' },
      { name: 'readonly', description: 'حقل للعرض والقراءة فقط', type: 'boolean' },
    ],
    button: [
      {
        name: 'type',
        description: 'نوع الزر',
        type: 'enum',
        values: ['button', 'submit', 'reset'],
      },
      { name: 'disabled', description: 'تعطيل التفاعل مع الزر', type: 'boolean' },
    ],
    table: [
      { name: 'border', description: 'سماكة حدود الجدول', type: 'number' },
      { name: 'cellpadding', description: 'الحشو الداخلي للخلايا', type: 'number' },
      { name: 'cellspacing', description: 'المسافة بين الخلايا', type: 'number' },
    ],
  };

  public static getInstance(): AttributeCompletionEngine {
    if (!AttributeCompletionEngine.instance) {
      AttributeCompletionEngine.instance = new AttributeCompletionEngine();
    }
    return AttributeCompletionEngine.instance;
  }

  public suggestAttributes(tag: string, existingAttrs: string[] = []): AttributeCompletionItem[] {
    const suggestions: AttributeCompletionItem[] = [];

    const globalAttrs = AttributeCompletionEngine.TAG_ATTRIBUTES['*'] || [];
    for (const attr of globalAttrs) {
      if (!existingAttrs.includes(attr.name)) {
        suggestions.push({
          label: attr.name,
          kind: 'attribute',
          detail: attr.description,
          insertText: attr.type === 'boolean' ? attr.name : `${attr.name}=""`,
        });
      }
    }

    const ariaAttrs = AttributeCompletionEngine.TAG_ATTRIBUTES['aria'] || [];
    for (const attr of ariaAttrs) {
      if (!existingAttrs.includes(attr.name)) {
        suggestions.push({
          label: attr.name,
          kind: 'attribute',
          detail: attr.description,
          insertText: attr.type === 'boolean' ? attr.name : `${attr.name}=""`,
        });
      }
    }

    const tagAttrs = AttributeCompletionEngine.TAG_ATTRIBUTES[tag.toLowerCase()] || [];
    for (const attr of tagAttrs) {
      if (!existingAttrs.includes(attr.name)) {
        suggestions.push({
          label: attr.name,
          kind: 'attribute',
          detail: `${attr.description}${attr.required ? ' (مطلوب)' : ''}`,
          insertText: attr.type === 'boolean' ? attr.name : `${attr.name}=""`,
        });
      }
    }

    return suggestions;
  }

  public getAttributeCompletions(tag: string, query = ''): AttributeCompletionItem[] {
    const items = this.suggestAttributes(tag, []);
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q),
    );
  }

  public suggestAttributeValues(tag: string, attrName: string): AttributeCompletionItem[] {
    const suggestions: AttributeCompletionItem[] = [];
    const globalAttrs = AttributeCompletionEngine.TAG_ATTRIBUTES['*'] || [];
    const globalAttr = globalAttrs.find((a) => a.name === attrName);
    if (globalAttr?.values) {
      for (const val of globalAttr.values) {
        suggestions.push({
          label: val,
          kind: 'enum',
          detail: `قيمة مقترحة للسمة ${attrName}`,
          insertText: val,
        });
      }
    }

    const tagAttrs = AttributeCompletionEngine.TAG_ATTRIBUTES[tag.toLowerCase()] || [];
    const tagAttr = tagAttrs.find((a) => a.name === attrName);
    if (tagAttr?.values) {
      for (const val of tagAttr.values) {
        suggestions.push({
          label: val,
          kind: 'enum',
          detail: `قيمة محددة للوسم <${tag}>`,
          insertText: val,
        });
      }
    }

    return suggestions;
  }
}

export const attributeCompletionEngine = AttributeCompletionEngine.getInstance();
