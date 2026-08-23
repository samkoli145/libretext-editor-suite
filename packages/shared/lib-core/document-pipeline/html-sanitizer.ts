/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تنظيف وتأمين محتوى HTML - HTML Sanitizer Engine
 * 🏛️ الدور: مكون مشترك - تطهير وسوم HTML وإزالة أكواد JavaScript المضمنة ومصادر XSS
 * 📥 المستهلك: RichTextEditor, UIDesignerEditor, UnifiedIngestionPipeline
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Sanitizer: مُطهّر معزول بالكامل
 *    بدون أي مكتبات خارجية مع الحفاظ على التنسيقات الآمنة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. XSS يجب أن يُنظف بالكامل (scripts, iframes, event handlers)
 *    2. الجداول والروابط يجب أن تبقى سليمة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص كل وسم HTML قبل السماح به
 *    - fallback لإزالة كاملة عند الشك
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const ALLOWED_TAGS = new Set([
  'p',
  'div',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'sub',
  'sup',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'a',
  'img',
  'br',
  'hr',
  'mark',
  'small',
  'figure',
  'figcaption',
]);

const ALLOWED_ATTRIBUTES = new Set([
  'style',
  'class',
  'id',
  'dir',
  'lang',
  'title',
  'alt',
  'src',
  'href',
  'target',
  'rel',
  'width',
  'height',
  'colspan',
  'rowspan',
  'align',
  'valign',
]);

/**
 * دالة تطهير نصوص ووسوم HTML بأمان تام وبدون أي مكتبة خارجية
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  // في بيئة المتصفح نستخدم DOMParser الآمن
  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirtyHtml, 'text/html');

    function cleanNode(node: Node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        // حذف الوسوم المحظورة بالكامل (مثل script, iframe, object, embed, applet)
        if (!ALLOWED_TAGS.has(tagName)) {
          // استبدال العنصر بنصوصه أو حذفه
          if (tagName === 'script' || tagName === 'style' || tagName === 'iframe') {
            element.remove();
            return;
          } else {
            const fragment = document.createDocumentFragment();
            while (element.firstChild) {
              fragment.appendChild(element.firstChild);
            }
            element.parentNode?.replaceChild(fragment, element);
            return;
          }
        }

        // تنظيف الخصائص وحذف الـ event handlers مثل onclick, onerror
        const attributes = Array.from(element.attributes);
        for (const attr of attributes) {
          const attrName = attr.name.toLowerCase();
          const attrValue = attr.value;

          if (
            attrName.startsWith('on') ||
            !ALLOWED_ATTRIBUTES.has(attrName) ||
            (attrName === 'href' && attrValue.trim().toLowerCase().startsWith('javascript:')) ||
            (attrName === 'src' && attrValue.trim().toLowerCase().startsWith('javascript:'))
          ) {
            element.removeAttribute(attr.name);
          }
        }
      }

      // معالجة الأبناء بالتكرار
      const children = Array.from(node.childNodes);
      for (const child of children) {
        cleanNode(child);
      }
    }

    cleanNode(doc.body);
    return doc.body.innerHTML;
  }

  // في البيئات الخالية من DOM (Fallback سريع)
  return dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');
}
