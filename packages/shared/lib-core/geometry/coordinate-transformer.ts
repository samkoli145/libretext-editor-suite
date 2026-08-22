/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك ومعادل الإحداثيات العام - Unified Coordinate Transformer
 * 🏛️ الدور: نواة هندسية مشتركة - تحويل الإحداثيات بين الشاشة والمستند والطبقات
 * 📥 المستهلك: محرر PDF، الكانفا، مصمم الواجهات، ومحرر النصوص (جميع المحررات)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة والخوارزميات | Innovative Algorithms:
 *    1. Forward & Inverse Affine Transformation Matrices
 *    2. Viewport Normalization (Zoom, PanX, PanY, Rotation)
 *    3. Precision Clamping & Snap-to-Grid Math
 *    4. 8-Point Bounding Box Handle Coordinates Calculation
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بالثيم الفاتح النقي 100% (Pure Light Theme)
 *    2. صفر اعتماديات خارجية (Zero External Dependencies)
 *    3. عدم فقدان الدقة عند التكبير حتى 500% أو التدوير بزوايا حرة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية وترقيع الدوال | Defensive Coding:
 *    - حماية من القسمة على صفر عند zoom = 0
 *    - تقييد القيم الشاذة (NaN / Infinity Fallback)
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل التوجيهي باللغة العربية)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface ViewportTransform {
  zoom: number; // 1 = 100%, 0.5 = 50%, 2 = 200%
  panX: number; // بكسلات الإزاحة الأفقية
  panY: number; // بكسلات الإزاحة العمودية
  rotation: number; // زاوية التدوير بالدرجات (0, 90, 180, 270 أو زوايا حرة)
}

export interface NormalizedPoint {
  x: number; // بكسلات داخل المستند
  y: number; // بكسلات داخل المستند
  pctX: number; // نسبة مئوية (0 - 100)
  pctY: number; // نسبة مئوية (0 - 100)
}

export interface BoxBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export type ResizeHandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rot';

/**
 * تحويل زاوية من درجات إلى راديان
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * تحويل نقطة شاشة (Screen / Client Point) إلى إحداثيات المستند والنسبة المئوية
 */
export function screenToDocument(
  screenPt: Point2D,
  stageRect: DOMRect,
  transform: ViewportTransform,
  docDimensions: { width: number; height: number }
): NormalizedPoint {
  const safeZoom = Math.max(0.1, transform.zoom || 1);
  const rad = degreesToRadians(-(transform.rotation || 0));

  // 1. حساب الإزاحة النسبية من مركز أو زاوية المسرح
  let relX = (screenPt.x - stageRect.left - transform.panX) / safeZoom;
  let relY = (screenPt.y - stageRect.top - transform.panY) / safeZoom;

  // 2. تطبيق عكس التدوير إذا كانت الصفحة مدورة
  if (transform.rotation % 360 !== 0) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const cx = docDimensions.width / 2;
    const cy = docDimensions.height / 2;

    const dx = relX - cx;
    const dy = relY - cy;

    relX = cx + (dx * cos - dy * sin);
    relY = cy + (dx * sin + dy * cos);
  }

  // 3. حساب النسب المئوية مع الحماية من الأرقام الشاذة
  const docW = Math.max(1, docDimensions.width);
  const docH = Math.max(1, docDimensions.height);

  const pctX = Number(((relX / docW) * 100).toFixed(3));
  const pctY = Number(((relY / docH) * 100).toFixed(3));

  return {
    x: Number(relX.toFixed(2)),
    y: Number(relY.toFixed(2)),
    pctX: Math.max(0, Math.min(100, isNaN(pctX) ? 0 : pctX)),
    pctY: Math.max(0, Math.min(100, isNaN(pctY) ? 0 : pctY)),
  };
}

/**
 * تحويل نقطة من إحداثيات المستند إلى إحداثيات الشاشة للتصيير
 */
export function documentToScreen(
  docPt: Point2D,
  stageRect: DOMRect,
  transform: ViewportTransform
): Point2D {
  const safeZoom = Math.max(0.1, transform.zoom || 1);
  return {
    x: stageRect.left + transform.panX + docPt.x * safeZoom,
    y: stageRect.top + transform.panY + docPt.y * safeZoom,
  };
}

/**
 * حساب مواضع المقابض الثمانية للتحجيم والتدوير (8-Point Resize Handles)
 */
export function calculateResizeHandles(box: BoxBounds): Record<ResizeHandleType, Point2D> {
  const { x, y, width: w, height: h } = box;
  return {
    nw: { x, y },
    n: { x: x + w / 2, y },
    ne: { x: x + w, y },
    e: { x: x + w, y: y + h / 2 },
    se: { x: x + w, y: y + h },
    s: { x: x + w / 2, y: y + h },
    sw: { x, y: y + h },
    w: { x, y: y + h / 2 },
    rot: { x: x + w / 2, y: y - 24 }, // مقبض التدوير العلوي
  };
}

/**
 * محاذاة الإحداثيات لشبكة المغناطيس الذكية (Snap to Grid)
 */
export function snapToGrid(val: number, gridSize = 10, snapThreshold = 4): number {
  const remainder = val % gridSize;
  if (remainder < snapThreshold) return val - remainder;
  if (remainder > gridSize - snapThreshold) return val + (gridSize - remainder);
  return val;
}
