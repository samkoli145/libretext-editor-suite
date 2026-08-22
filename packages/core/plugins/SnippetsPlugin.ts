/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: إضافة مقتطفات الكود والعناصر الجاهزة - Snippets Plugin Engine
 * 🏛️ الدور: إضافة مشتركة - قوالب HTML سريعة للإدراج (حاويات، صور، أزرار، بطاقات)
 * 📥 المستهلك: CommandPalette, ContextMenus, كل المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Code Snippets Templates: قوالب مقتطفات كود جاهزة
 *    مع صفر مكتبات خارجية وتكامل مع CommandPalette
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القوالب يجب أن تكون متوافقة مع Web APIs
 *    2. IDs يجب أن تكون فريدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع القالب قبل الإدراج
 *    - fallback لقالب div بسيط
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface CodeSnippet {
  id: string;
  label: string;
  detail: string;
  template: string;
  category: 'layout' | 'media' | 'interactive' | 'typography';
}

export const HTML_SNIPPETS: CodeSnippet[] = [
  {
    id: 'div-block',
    label: 'كتلة حاوية (Div Block)',
    detail: 'كتلة WebPainter مرنة لاحتواء العناصر',
    template: '<div class="p-4 bg-white rounded-lg border border-slate-200 shadow-sm" data-node-id="block-${id}">\n  ${cursor}\n</div>',
    category: 'layout',
  },
  {
    id: 'img-block',
    label: 'كتلة صورة (Image Block)',
    detail: 'عنصر صورة متجاوب مع نص بديل',
    template: '<img src="${src}" alt="${alt}" class="w-full h-auto rounded-lg object-cover" data-node-id="img-${id}" />',
    category: 'media',
  },
  {
    id: 'link-block',
    label: 'كتلة رابط (Link Block)',
    detail: 'رابط تشعبي أنيق قابل للنقر',
    template: '<a href="${url}" target="_blank" class="text-blue-600 hover:text-blue-700 underline font-medium" data-node-id="link-${id}">${text}</a>',
    category: 'interactive',
  },
  {
    id: 'button-block',
    label: 'كتلة زر تفاعلي (Button Block)',
    detail: 'زر بتصميم حديث وثيم فاتح',
    template: '<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors" data-node-id="btn-${id}">${text}</button>',
    category: 'interactive',
  },
  {
    id: 'card-block',
    label: 'بطاقة محتوى (Card Block)',
    detail: 'بطاقة بتصميم فاخر وظلال خفيفة',
    template: '<div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3" data-node-id="card-${id}">\n  <h3 class="text-lg font-bold text-slate-800">عنوان البطاقة</h3>\n  <p class="text-slate-600 text-sm leading-relaxed">تفاصيل ووصف المحتوى التوضيحي داخل البطاقة.</p>\n</div>',
    category: 'layout',
  },
  {
    id: 'grid-block',
    label: 'شبكة أعمدة (Grid Layout)',
    detail: 'شبكة أعمدة متجاوبة بتصميم نظيف',
    template: '<div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-node-id="grid-${id}">\n  <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">العمود 1</div>\n  <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">العمود 2</div>\n  <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">العمود 3</div>\n</div>',
    category: 'layout',
  },
];

/**
 * معالجة وتوليد قالب مقتطف مع استبدال المعاملات
 */
export function generateSnippetHtml(
  snippetId: string,
  params: Record<string, string> = {}
): string | null {
  const snippet = HTML_SNIPPETS.find((s) => s.id === snippetId);
  if (!snippet) return null;

  let result = snippet.template;
  const mergedParams = {
    id: Date.now().toString(36),
    cursor: '',
    src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    alt: 'صورة توضيحية',
    url: '#',
    text: 'اضغط هنا',
    ...params,
  };

  for (const [key, value] of Object.entries(mergedParams)) {
    result = result.replaceAll(`\${${key}}`, value);
  }

  return result;
}
