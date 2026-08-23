/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mouse-diagnostics.ts
 * 📂 المسار: packages/algorithms/src/spatial/mouse-diagnostics.ts
 * 🎯 الهدف الرئيسي: دوال تشخيص وحساب إحداثيات الفأرة بشكل مجرد للسبورة والمحررات.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية (Zero-Dependency Headless Core).
 *    - دعم كامل للـ RTL/LTR.
 *    - حساب مقياس التكبير (Zoom / CSS Scale) بدقة وتلافي القسمة على صفر.
 *    - عدم تجاوز 50 سطراً للدالة الواحدة.
 * 🧪 الاختبارات: (يجب إضافتها لاحقاً في مجلد tests).
 * 🏷️ المعرف: ALGO-010
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Viewport-to-Canvas Transform: تحويل إحداثيات الشاشة إلى مساحة الكانفا
 *    بشكل رياضي بحت (Functional & Immutable).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القسمة على صفر (Zoom / Scale يجب أن يكون > 0).
 *    2. اختلاف سلوك التمرير الأفقي في RTL بين المتصفحات (Safari vs Chrome/Firefox).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام CreateEmptyRect للحماية في بيئات الـ Node/SSR.
 *    - تقييد (Clamp) النسب المئوية بين 0 و 1.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export interface RelativeMouseOffsetResult {
  readonly screen: Point2D;
  readonly local: Point2D;
  readonly absoluteLocal: Point2D;
  readonly normalized: { readonly u: number; readonly v: number };
  readonly targetRect:
    | DOMRect
    | {
        x: number;
        y: number;
        width: number;
        height: number;
        top: number;
        right: number;
        bottom: number;
        left: number;
      };
  readonly isInside: boolean;
  readonly zoom: number;
  readonly direction: 'rtl' | 'ltr';
}

export interface MouseDiagnosticsOptions {
  readonly zoom?: number;
  readonly isRtl?: boolean;
  readonly includeScroll?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createEmptyRect() {
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
  };
}

export function detectRtl(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return false;
  const style = window.getComputedStyle(element);
  return style.direction === 'rtl';
}

export function extractCssScale(element: HTMLElement): number {
  if (typeof window === 'undefined') return 1;
  const style = window.getComputedStyle(element);
  const transform = style.transform;
  if (!transform || transform === 'none') return 1;

  const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
  if (matrixMatch) {
    const values = matrixMatch[1]!.split(',').map((v) => parseFloat(v.trim()));
    const first = values[0];
    if (first !== undefined && values.length >= 1 && Number.isFinite(first) && first !== 0) {
      return Math.abs(first);
    }
  }

  const scaleMatch = transform.match(/scale\(([^)]+)\)/);
  if (scaleMatch) {
    const values = scaleMatch[1]!.split(',').map((v) => parseFloat(v.trim()));
    const first = values[0];
    if (first !== undefined && values.length >= 1 && Number.isFinite(first) && first !== 0) {
      return Math.abs(first);
    }
  }

  return 1;
}

function calculateScrollX(container: HTMLElement, isRtl: boolean): number {
  let scrollX = 0;
  if (isRtl) {
    const rawScrollLeft = container.scrollLeft;
    const maxScrollLeft = Math.max(0, (container.scrollWidth || 0) - (container.clientWidth || 0));
    scrollX = rawScrollLeft <= 0 ? Math.abs(rawScrollLeft) : rawScrollLeft;
    scrollX = clamp(scrollX, 0, Number.isFinite(maxScrollLeft) ? maxScrollLeft : 0);
  } else {
    scrollX = container.scrollLeft;
  }
  return scrollX;
}

export function calculateRelativeMouseOffset(
  clientX: number,
  clientY: number,
  container: HTMLElement | null,
  options?: MouseDiagnosticsOptions,
): RelativeMouseOffsetResult {
  const zoom = options?.zoom ?? 1;
  const includeScroll = options?.includeScroll ?? true;

  if (!container) {
    return {
      screen: { x: clientX, y: clientY },
      local: { x: 0, y: 0 },
      absoluteLocal: { x: 0, y: 0 },
      normalized: { u: 0, v: 0 },
      targetRect: createEmptyRect(),
      isInside: false,
      zoom: Math.max(zoom, 0.01),
      direction: 'ltr',
    };
  }

  const rect = container.getBoundingClientRect();
  const isRtl = options?.isRtl ?? detectRtl(container);
  const cssScale = extractCssScale(container);

  const rawZoom = zoom * cssScale;
  const totalZoom = rawZoom <= 0 || !Number.isFinite(rawZoom) ? 1 : rawZoom;

  const scrollX = includeScroll ? calculateScrollX(container, isRtl) : 0;
  const scrollY = includeScroll ? container.scrollTop : 0;

  const absoluteLocalX = (clientX - rect.left) / totalZoom + scrollX;
  const absoluteLocalY = (clientY - rect.top) / totalZoom + scrollY;

  const localX = isRtl
    ? (rect.right - clientX) / totalZoom + scrollX
    : (clientX - rect.left) / totalZoom + scrollX;

  const width = rect.width / totalZoom;
  const height = rect.height / totalZoom;

  const isInside =
    clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

  return {
    screen: { x: clientX, y: clientY },
    local: { x: localX, y: absoluteLocalY },
    absoluteLocal: { x: absoluteLocalX, y: absoluteLocalY },
    normalized: {
      u: clamp(width > 0 ? absoluteLocalX / width : 0, 0, 1),
      v: clamp(height > 0 ? absoluteLocalY / height : 0, 0, 1),
    },
    targetRect: rect,
    isInside,
    zoom: totalZoom,
    direction: isRtl ? 'rtl' : 'ltr',
  };
}
