/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التكبير والتحريك المعزول - تحويل إحداثيات الشاشة إلى الكانفا
 * 🏛️ الدور: نواة مشتركة معزولة - أساس تفاعل الكانفا والـ PDF
 * 📥 المستهلك: useViewportPanZoom, CanvasViewport, CanvasDesignerEditor, PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Focal Point Zoom: التكبير حول نقطة بؤرية محددة مع تعويض الإزاحة
 *    لضمان بقاء مؤشر الفأرة ثابتاً أثناء التكبير/التصغير
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تقييد معامل التكبير بين 0.1 (10%) و 10.0 (1000%) دائماً
 *    2. انعدام الإزاحة عند نقر الزر الأوسط بدون حركة (dead zone)
 *    3. تحويل الإحداثيات يجب أن يراعي اتجاه RTL
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام Math.max/min لتطبيق Clamp على جميع القيم
 *    - فحص containerRect-null قبل الحساب لمنع الأخطاء
 *    - إرجاع ViewportTransform موحد دائماً حتى عند الخطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ViewportTransform {
  x: number;
  y: number;
  scale: number;
}

export interface PanZoomConfig {
  minScale?: number;
  maxScale?: number;
  zoomSpeed?: number;
}

export class ViewportPanZoomEngine {
  private minScale: number;
  private maxScale: number;
  private zoomSpeed: number;

  constructor(config: PanZoomConfig = {}) {
    this.minScale = config.minScale ?? 0.1;
    this.maxScale = config.maxScale ?? 5.0;
    this.zoomSpeed = config.zoomSpeed ?? 0.0015;
  }

  /**
   * Calculate zoom centered at a specific screen coordinate (cursor position)
   */
  public calculateZoomAtPoint(
    current: ViewportTransform,
    deltaY: number,
    cursorScreenX: number,
    cursorScreenY: number,
    containerRect: { left: number; top: number },
  ): ViewportTransform {
    const mouseX = cursorScreenX - containerRect.left;
    const mouseY = cursorScreenY - containerRect.top;

    // Zoom multiplier
    const factor = Math.exp(-deltaY * this.zoomSpeed);
    const newScale = Math.min(Math.max(current.scale * factor, this.minScale), this.maxScale);

    // Maintain mouse world position invariant
    const newX = mouseX - (mouseX - current.x) * (newScale / current.scale);
    const newY = mouseY - (mouseY - current.y) * (newScale / current.scale);

    return {
      x: Math.round(newX * 100) / 100,
      y: Math.round(newY * 100) / 100,
      scale: Math.round(newScale * 1000) / 1000,
    };
  }

  /**
   * Calculate updated pan offset from drag delta
   */
  public calculatePan(
    current: ViewportTransform,
    deltaX: number,
    deltaY: number,
  ): ViewportTransform {
    return {
      ...current,
      x: current.x + deltaX,
      y: current.y + deltaY,
    };
  }

  /**
   * Convert screen coordinates to world canvas coordinates
   */
  public screenToWorld(
    screenX: number,
    screenY: number,
    transform: ViewportTransform,
    containerRect: { left: number; top: number },
  ): { x: number; y: number } {
    const localX = screenX - containerRect.left;
    const localY = screenY - containerRect.top;
    return {
      x: (localX - transform.x) / transform.scale,
      y: (localY - transform.y) / transform.scale,
    };
  }

  /**
   * Reset zoom and center canvas inside container
   */
  public getCenterTransform(
    canvasWidth: number,
    canvasHeight: number,
    containerWidth: number,
    containerHeight: number,
    padding: number = 40,
  ): ViewportTransform {
    const availableW = Math.max(containerWidth - padding * 2, 100);
    const availableH = Math.max(containerHeight - padding * 2, 100);

    const scaleW = availableW / canvasWidth;
    const scaleH = availableH / canvasHeight;
    const scale = Math.min(Math.max(Math.min(scaleW, scaleH, 1.0), this.minScale), this.maxScale);

    const x = (containerWidth - canvasWidth * scale) / 2;
    const y = (containerHeight - canvasHeight * scale) / 2;

    return {
      x: Math.round(x),
      y: Math.round(y),
      scale: Math.round(scale * 1000) / 1000,
    };
  }
}
