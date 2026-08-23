/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: قواعد تعديل صفحات الويب والمستندات - Page Mutations Guard
 * 🏛️ الدور: أداة مشتركة - التحقق من قبول المستندات لجراحة DOM
 * 📥 المستهلك: TemplateEngine, RichTextEditor, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Document Acceptance Rules: قواعد لقبول/رفض تعديل المستندات
 *    مع حماية القوالب المحمية وفحص نوع المستند
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القوالب المحمية يجب ألا تُعدل
 *    2. المستندات المقفلة يجب رفض التعديل
 *    3. فحص نوع المستند قبل الإدراج
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص isLocked قبل التعديل
 *    - fallback لرفض التعديل
 *    - رسالة خطأ واضحة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { PageDocument } from '../../features/canvas-designer/model';

export type Page = PageDocument;

export type PageTemplate = PageDocument & {
  isTemplate: true;
};

/**
 * فحص ما إذا كانت الصفحة المحددة قالبًا محمياً.
 */
export const isPageTemplate = (
  page: Page | PageTemplate | undefined | null,
): page is PageTemplate => {
  if (!page) return false;
  return Boolean((page as any).isTemplate === true);
};

/**
 * التحقق مما إذا كان المستند يقبل إدراج وتعديل وتحويل عناصر HTML.
 * تقبل مستندات HTML العمليات التفاعلية، بينما تُعامل القوالب أو المستندات النصية بقواعد مقيدة.
 */
export const allowsHtmlMutations = (page: Page | PageTemplate | undefined | null): boolean => {
  if (!page || isPageTemplate(page)) {
    return false;
  }

  // نوع المستند يمكن حفظه في meta.documentType أو settings.documentType
  const documentType = (page as any).meta?.documentType ?? (page as any).settings?.documentType;
  return documentType === undefined || documentType === 'html';
};
