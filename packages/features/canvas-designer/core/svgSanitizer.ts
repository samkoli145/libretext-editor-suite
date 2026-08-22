/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تطهير وتأمين وسوم وخصائص SVG - SVG Sanitizer
 * 🏛️ الدور: محرك أمني - تنظيف SVG من محتوى خبيث (XSS, script injection)
 * 📥 المستهلك: CanvasDesignerEditor, webParser, استيراد SVG
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    White-List Sanitizer: محرك تنظيف بالقائمة البيضاء
 *    للوسوم والسمات المسموح بها فقط في رسومات SVG القياسية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. XSS يمكن أن يتسلل عبر SVG
 *    2. javascript: urls يجب حذفها بالكامل
 *    3. onerror/onload handlers خطيرة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص كل وسم وسمة ضد القائمة البيضاء
 *    - حذف أي شيء مشبوه
 *    - إزالة event handlers بالكامل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// قائمة بيضاء للوسوم المسموح بها في SVG
export const ALLOWED_SVG_TAGS = new Set([
  'svg',
  'g',
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'text',
  'tspan',
  'textpath',
  'image',
  'defs',
  'clippath',
  'mask',
  'pattern',
  'lineargradient',
  'radialgradient',
  'stop',
  'use',
  'symbol',
  'marker',
  'title',
  'desc',
]);

// قائمة بيضاء للسمات المسموح بها
export const ALLOWED_SVG_ATTRS = new Set([
  'id',
  'class',
  'style',
  'transform',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'd',
  'points',
  'width',
  'height',
  'viewbox',
  'preserveaspectratio',
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-miterlimit',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-anchor',
  'dominant-baseline',
  'href',
  'xlink:href',
  'dx',
  'dy',
  'offset',
  'stop-color',
  'stop-opacity',
  'gradientunits',
  'gradienttransform',
  'patternunits',
  'patterncontentunits',
  'maskunits',
  'clippathunits',
  'clip-path',
  'mask',
  'filter',
  'marker-start',
  'marker-mid',
  'marker-end',
]);

/**
 * التحقق من أمان السمة وقيمتها
 */
export function isSafeAttribute(name: string, value: string): boolean {
  const lowerName = name.toLowerCase();
  const lowerVal = value.trim().toLowerCase();

  // منع معالجات الأحداث (on*)
  if (lowerName.startsWith('on')) {
    return false;
  }

  // منع بروتوكول javascript: أو vbscript:
  if (
    lowerVal.includes('javascript:') ||
    lowerVal.includes('vbscript:') ||
    lowerVal.includes('data:text/html') ||
    lowerVal.includes('data:application/javascript')
  ) {
    return false;
  }

  // فحص ما إذا كانت السمة مسموحًا بها
  if (ALLOWED_SVG_ATTRS.has(lowerName)) {
    return true;
  }

  // السماح بخصائص data-* المخصصة
  if (lowerName.startsWith('data-')) {
    return true;
  }

  return false;
}

/**
 * فحص ما إذا كان اسم الوسم مسموحًا به
 */
export function isSafeTag(tagName: string): boolean {
  return ALLOWED_SVG_TAGS.has(tagName.toLowerCase());
}

/**
 * تطهير عنصر DOM وعناصره الفرعية تكراريًا
 */
export function sanitizeSvgElement(element: Element): void {
  const children = Array.from(element.children);

  for (const child of children) {
    const tagName = child.tagName.toLowerCase();

    // إزالة الوسوم غير المسموح بها (مثل script, iframe, object, foreignobject غير الآمن)
    if (!isSafeTag(tagName)) {
      child.remove();
      continue;
    }

    // إزالة السمات غير الآمنة
    const attrs = Array.from(child.attributes);
    for (const attr of attrs) {
      if (!isSafeAttribute(attr.name, attr.value)) {
        child.removeAttribute(attr.name);
      }
    }

    // تطهير العناصر الفرعية
    sanitizeSvgElement(child);
  }
}

/**
 * تطهير نص SVG كامل وإرجاع النص المطهر الآمن
 */
export function sanitizeSvgString(svgString: string): string {
  if (!svgString || typeof svgString !== 'string') {
    return '';
  }

  // تنظيف أولي سريع للنصوص الخبيثة الشائعة
  let cleaned = svgString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '');

  if (typeof DOMParser === 'undefined') {
    return cleaned;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleaned, 'image/svg+xml');

    // التحقق من أخطاء التحليل
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      // محاولة التحليل كـ HTML إذا فشل الـ XML
      const htmlDoc = parser.parseFromString(cleaned, 'text/html');
      const svg = htmlDoc.querySelector('svg');
      if (!svg) return '';
      sanitizeSvgElement(svg);
      return svg.outerHTML;
    }

    const svgElement = doc.documentElement;
    if (svgElement.tagName.toLowerCase() !== 'svg') {
      return '';
    }

    // تطهير سمات الوسم الجذري svg
    const rootAttrs = Array.from(svgElement.attributes);
    for (const attr of rootAttrs) {
      if (!isSafeAttribute(attr.name, attr.value)) {
        svgElement.removeAttribute(attr.name);
      }
    }

    // تطهير باقي الشجرة
    sanitizeSvgElement(svgElement);

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  } catch {
    return cleaned;
  }
}
