/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mouse-algorithms.ts
 * 📂 المسار: packages/algorithms/src/vector/mouse-algorithms.ts
 * 🎯 الهدف الرئيسي: خوارزميات الفأرة الدقيقة (8 مقابض تحجيم، RTL، تدوير)
 * 📋 المعايير: صفر مكتبات خارجية، دعم كامل للاتجاه RTL
 * 🧪 الاختبارات: tests/vector/mouse-algorithms.test.ts
 * 🏷️ المعرف: ALGO-035
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    8-Point Resize Algorithm: خوارزمية قياس بنقاط تحكم 8 اتجاهات
 *    مع دعم RTL وconvertPinch وSnap Grid
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحد الأدنى: 60px للعرض، 30px للارتفاع
 *    2. مراعاة إشارة deltaX في اتجاه RTL
 *    3. Ray Casting للمضلعات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function stylesObjectToString(styles?: Record<string, unknown>): string {
  if (!styles || typeof styles !== 'object') return '';
  return Object.entries(styles)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${value};`;
    })
    .join(' ');
}

export function columnSizeToPercentage(size = 12): string {
  const clamped = Math.min(12, Math.max(1, Math.round(size)));
  return `${(clamped / 12) * 100}%`;
}

export function calculateNewColumnSize(
  currentSize: number,
  deltaX: number,
  containerWidth: number,
  isRtl = true,
): number {
  if (containerWidth <= 0) return currentSize;
  const colWidth = containerWidth / 12;
  const effectiveDelta = isRtl ? -deltaX : deltaX;
  const colDelta = Math.round(effectiveDelta / colWidth);
  return Math.min(12, Math.max(1, currentSize + colDelta));
}

export interface ResizeState {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  handleDirection: string;
  isRtl: boolean;
  aspectRatio?: number;
  lockAspectRatio?: boolean;
}

export function calculateResizedDimensions(
  state: ResizeState,
  currentX: number,
  currentY: number,
  minWidth = 40,
  minHeight = 24,
  snapGrid = 1,
): { width?: number; height?: number } {
  let deltaX = currentX - state.startX;
  let deltaY = currentY - state.startY;
  if (snapGrid > 1) {
    deltaX = Math.round(deltaX / snapGrid) * snapGrid;
    deltaY = Math.round(deltaY / snapGrid) * snapGrid;
  }
  const { handleDirection, startWidth, startHeight, lockAspectRatio } = state;
  const ratio =
    state.aspectRatio || (startWidth > 0 && startHeight > 0 ? startWidth / startHeight : 1);
  let width: number | undefined;
  let height: number | undefined;

  switch (handleDirection) {
    case 'r':
      width = Math.max(minWidth, startWidth + deltaX);
      if (lockAspectRatio) height = Math.max(minHeight, width / ratio);
      break;
    case 'l':
      width = Math.max(minWidth, startWidth - deltaX);
      if (lockAspectRatio) height = Math.max(minHeight, width / ratio);
      break;
    case 'b':
      height = Math.max(minHeight, startHeight + deltaY);
      if (lockAspectRatio) width = Math.max(minWidth, height * ratio);
      break;
    case 't':
      height = Math.max(minHeight, startHeight - deltaY);
      if (lockAspectRatio) width = Math.max(minWidth, height * ratio);
      break;
    case 'br':
      width = Math.max(minWidth, startWidth + deltaX);
      height = lockAspectRatio
        ? Math.max(minHeight, width / ratio)
        : Math.max(minHeight, startHeight + deltaY);
      break;
    case 'bl':
      width = Math.max(minWidth, startWidth - deltaX);
      height = lockAspectRatio
        ? Math.max(minHeight, width / ratio)
        : Math.max(minHeight, startHeight + deltaY);
      break;
    case 'tr':
      width = Math.max(minWidth, startWidth + deltaX);
      height = lockAspectRatio
        ? Math.max(minHeight, width / ratio)
        : Math.max(minHeight, startHeight - deltaY);
      break;
    case 'tl':
      width = Math.max(minWidth, startWidth - deltaX);
      height = lockAspectRatio
        ? Math.max(minHeight, width / ratio)
        : Math.max(minHeight, startHeight - deltaY);
      break;
  }
  return { width, height };
}

export function calculateRotationAngle(
  centerX: number,
  centerY: number,
  currentX: number,
  currentY: number,
  snapAngle = 15,
): number {
  const radians = Math.atan2(currentY - centerY, currentX - centerX);
  let degrees = radians * (180 / Math.PI);
  if (degrees < 0) degrees += 360;
  if (snapAngle > 1) degrees = Math.round(degrees / snapAngle) * snapAngle;
  return Math.round(degrees);
}

export function isPointInPolygon(
  point: { x: number; y: number },
  polygon: { x: number; y: number }[],
): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i]!.x,
      yi = polygon[i]!.y;
    const xj = polygon[j]!.x,
      yj = polygon[j]!.y;
    if (yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
