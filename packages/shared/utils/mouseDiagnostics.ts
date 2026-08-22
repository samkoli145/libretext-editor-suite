/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: دوال تشخيص إحداثيات الفأرة - Mouse Diagnostics
 * 🏛️ الدور: أداة مشتركة - حساب الإحداثيات النسبية والمطلقة بدقة بكسل
 * 📥 المستهلك: CanvasDesignerEditor, ImageEditor, UiDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Viewport-to-Canvas Transform: تحويل إحداثيات الشاشة إلى Canvas
 *    مع دعم التكبير والتحويلات CSS وRTL
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القسمة على صفر يجب تجنبها (zero-zoom guard)
 *    2. RTL يجب أن يُعالج بشكل صحيح
 *    3. التحويلات CSS يجب مراعاتها
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص zoom > 0 قبل القسمة
 *    - fallback لإحداثيات الأصل
 *    - cross-browser support
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface RelativeMouseOffsetResult {
  /** الإحداثيات المطلقة للشاشة */
  screen: { x: number; y: number };

  /** الإحداثيات النسبية للحاوية (تتأثر بالاتجاه RTL/LTR) */
  local: { x: number; y: number };

  /** الإحداثيات المطلقة من الزاوية العلوية اليسرى (لا تتأثر بالاتجاه - مناسبة لمساحة الرسم والكانفا) */
  absoluteLocal: { x: number; y: number };

  /** النسبة المئوية الموضعية داخل العنصر (من 0 إلى 1) */
  normalized: { u: number; v: number };

  /** أبعاد وموقع العنصر الهدف */
  targetRect: DOMRect;

  /** هل النقطة داخل حدود العنصر؟ */
  isInside: boolean;

  /** مستوى التكبير الفعلي (zoom × cssScale) */
  zoom: number;

  /** اتجاه الحاوية */
  direction: 'rtl' | 'ltr';
}

export interface MouseDiagnosticsOptions {
  /** مستوى التكبير المطلوب تطبيقه (افتراضي: 1) */
  zoom?: number;

  /** هل الحاوية في وضع RTL؟ (افتراضي: يُكتشف تلقائيًا) */
  isRtl?: boolean;

  /** هل نضيف إزاحة التمرير scrollLeft/scrollTop؟ (افتراضي: true) */
  includeScroll?: boolean;
}

/**
 * حساب الإحداثيات النسبية للفأرة بالنسبة لحاوية محددة مع دعم RTL والتكبير والتمرير عبر المتصفحات.
 */
export function calculateRelativeMouseOffset(
  event: MouseEvent | React.MouseEvent,
  container: HTMLElement | null,
  options?: MouseDiagnosticsOptions
): RelativeMouseOffsetResult {
  const zoom = options?.zoom ?? 1;
  const includeScroll = options?.includeScroll ?? true;

  // ─── حماية الحاوية الفارغة ──────────────────────────────
  if (!container) {
    return {
      screen: { x: event.clientX, y: event.clientY },
      local: { x: 0, y: 0 },
      absoluteLocal: { x: 0, y: 0 },
      normalized: { u: 0, v: 0 },
      targetRect: createEmptyRect(),
      isInside: false,
      zoom: Math.max(zoom, 0.01),
      direction: 'ltr',
    };
  }

  // 1. أبعاد الحاوية والاتجاه
  const rect = container.getBoundingClientRect();
  const isRtl = options?.isRtl ?? detectRtl(container);
  const cssScale = extractCssScale(container);

  // 2. الحماية من القسمة على صفر
  const rawZoom = zoom * cssScale;
  const totalZoom = rawZoom <= 0 || !Number.isFinite(rawZoom) ? 1 : rawZoom;

  const screenX = event.clientX;
  const screenY = event.clientY;

  // 3. تصحيح إزاحة التمرير عبر المتصفحات لوضع RTL
  let scrollX = 0;
  let scrollY = 0;

  if (includeScroll) {
    scrollY = container.scrollTop;

    if (isRtl) {
      // Chrome/Firefox: scrollLeft يكون سالبًا أو صفرًا في وضع RTL
      // Safari: scrollLeft يكون موجبًا
      const rawScrollLeft = container.scrollLeft;
      const maxScrollLeft = Math.max(0, (container.scrollWidth || 0) - (container.clientWidth || 0));

      if (rawScrollLeft <= 0) {
        scrollX = Math.abs(rawScrollLeft);
      } else {
        scrollX = rawScrollLeft;
      }

      scrollX = clamp(scrollX, 0, Number.isFinite(maxScrollLeft) ? maxScrollLeft : 0);
    } else {
      scrollX = container.scrollLeft;
    }
  }

  // 4. الإحداثيات المطلقة من الزاوية العلوية اليسرى (دائمًا قياسية للكانفا)
  const absoluteLocalX = (screenX - rect.left) / totalZoom + scrollX;
  const absoluteLocalY = (screenY - rect.top) / totalZoom + scrollY;

  // 5. الإحداثيات النسبية حسب الاتجاه (في RTL نقطة الصفر من الحافة اليمنى)
  let localX: number;
  if (isRtl) {
    localX = (rect.right - screenX) / totalZoom + scrollX;
  } else {
    localX = (screenX - rect.left) / totalZoom + scrollX;
  }
  const localY = absoluteLocalY;

  // 6. الأبعاد والنسب المئوية
  const width = rect.width / totalZoom;
  const height = rect.height / totalZoom;

  const u = width > 0 ? absoluteLocalX / width : 0;
  const v = height > 0 ? absoluteLocalY / height : 0;

  // 7. التحقق من وقوع النقطة داخل الحدود
  const isInside =
    screenX >= rect.left &&
    screenX <= rect.right &&
    screenY >= rect.top &&
    screenY <= rect.bottom;

  return {
    screen: { x: screenX, y: screenY },
    local: { x: localX, y: localY },
    absoluteLocal: { x: absoluteLocalX, y: absoluteLocalY },
    normalized: { u: clamp(u, 0, 1), v: clamp(v, 0, 1) },
    targetRect: rect,
    isInside,
    zoom: totalZoom,
    direction: isRtl ? 'rtl' : 'ltr',
  };
}

/**
 * اكتشاف اتجاه العنصر تلقائيًا من CSS.
 */
export function detectRtl(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return false;
  const style = window.getComputedStyle(element);
  return style.direction === 'rtl';
}

/**
 * استخراج مقياس CSS transform من العنصر.
 */
export function extractCssScale(element: HTMLElement): number {
  if (typeof window === 'undefined') return 1;
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  if (!transform || transform === 'none') {
    return 1;
  }

  // matrix(a, b, c, d, tx, ty) → a = scaleX
  const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
  if (matrixMatch) {
    const values = matrixMatch[1].split(',').map((v) => parseFloat(v.trim()));
    if (values.length >= 1 && Number.isFinite(values[0]) && values[0] !== 0) {
      return Math.abs(values[0]);
    }
  }

  // scale(x) أو scale(x, y)
  const scaleMatch = transform.match(/scale\(([^)]+)\)/);
  if (scaleMatch) {
    const values = scaleMatch[1].split(',').map((v) => parseFloat(v.trim()));
    if (values.length >= 1 && Number.isFinite(values[0]) && values[0] !== 0) {
      return Math.abs(values[0]);
    }
  }

  return 1;
}

/**
 * تقييد قيمة بين حد أدنى وأقصى.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * إنشاء مستطيل فارغ آمن في بيئات بلا DOM (DOMRect غير متاح في الاختبارات).
 */
function createEmptyRect(): DOMRect {
  if (typeof DOMRect !== 'undefined') {
    return new DOMRect(0, 0, 0, 0);
  }
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    toJSON: () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 }),
  } as DOMRect;
}

/**
 * حساب إحداثيات الفأرة بالنسبة لمستند Canvas مع دعم الطبقات.
 */
export function calculateCanvasCoordinates(
  event: MouseEvent | React.MouseEvent,
  canvasContainer: HTMLElement | null,
  zoom: number = 1
): { x: number; y: number; isInside: boolean } {
  const result = calculateRelativeMouseOffset(event, canvasContainer, {
    zoom,
    isRtl: false, // Canvas دائمًا LTR داخليًا
    includeScroll: true,
  });

  return {
    x: result.absoluteLocal.x,
    y: result.absoluteLocal.y,
    isInside: result.isInside,
  };
}
