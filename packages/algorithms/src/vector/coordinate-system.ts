/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: coordinate-system.ts
 * 📂 المسار: packages/algorithms/src/vector/coordinate-system.ts
 * 🎯 الهدف الرئيسي: محرك تحويل الإحداثيات screen↔world + zoom + grid snap
 * 📋 المعايير: صفر مكتبات خارجية، دعم RTL، zoom towards mouse
 * 🧪 الاختبارات: tests/vector/coordinate-system.test.ts
 * 🏷️ المعرف: ALGO-034
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Screen↔World Projection: تحويل إحداثيات الشاشة إلى عالم الكانفا
 *    مع Zoom Towards Mouse Anchor (تثبيت مركز مؤشر الفأرة)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. containerRect قد يكون null في بيئة SSR
 *    2. Zoom يجب أن يكون محصوراً بين minZoom و maxZoom
 *    3. Grid snap يجب أن يتناسب مع Zoom
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point {
  x: number;
  y: number;
}

export interface Viewport {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export interface GridConfig {
  size: number;
  enabled: boolean;
}

export class CoordinateSystem {
  private viewport: Viewport;
  private grid: GridConfig;

  constructor(viewport?: Partial<Viewport>, grid?: Partial<GridConfig>) {
    this.viewport = {
      offsetX: viewport?.offsetX ?? 0,
      offsetY: viewport?.offsetY ?? 0,
      zoom: viewport?.zoom ?? 1,
    };
    this.grid = {
      size: grid?.size ?? 8,
      enabled: grid?.enabled ?? true,
    };
  }

  public screenToCanvas(screenX: number, screenY: number, containerRect?: DOMRect): Point {
    const baseX = containerRect ? screenX - containerRect.left : screenX;
    const baseY = containerRect ? screenY - containerRect.top : screenY;
    return {
      x: (baseX - this.viewport.offsetX) / this.viewport.zoom,
      y: (baseY - this.viewport.offsetY) / this.viewport.zoom,
    };
  }

  public canvasToScreen(canvasX: number, canvasY: number, containerRect?: DOMRect): Point {
    const screenX = canvasX * this.viewport.zoom + this.viewport.offsetX;
    const screenY = canvasY * this.viewport.zoom + this.viewport.offsetY;
    return {
      x: containerRect ? screenX + containerRect.left : screenX,
      y: containerRect ? screenY + containerRect.top : screenY,
    };
  }

  public snapToGrid(value: number, customGridSize?: number): number {
    const size = customGridSize || this.grid.size;
    if (!this.grid.enabled || size <= 1) return value;
    return Math.round(value / size) * size;
  }

  public snapPoint(point: Point, customGridSize?: number): Point {
    return {
      x: this.snapToGrid(point.x, customGridSize),
      y: this.snapToGrid(point.y, customGridSize),
    };
  }

  public calculateZoomAtPoint(
    currentZoom: number,
    zoomDelta: number,
    screenX: number,
    screenY: number,
    containerRect: DOMRect,
    currentOffset: { x: number; y: number },
    minZoom = 0.25,
    maxZoom = 4.0,
  ): { zoom: number; offsetX: number; offsetY: number } {
    const mouseCanvasBeforeX = (screenX - containerRect.left - currentOffset.x) / currentZoom;
    const mouseCanvasBeforeY = (screenY - containerRect.top - currentOffset.y) / currentZoom;
    const newZoom = Math.min(maxZoom, Math.max(minZoom, currentZoom * (1 + zoomDelta)));
    const newOffsetX = screenX - containerRect.left - mouseCanvasBeforeX * newZoom;
    const newOffsetY = screenY - containerRect.top - mouseCanvasBeforeY * newZoom;
    return { zoom: newZoom, offsetX: newOffsetX, offsetY: newOffsetY };
  }

  public getViewport(): Viewport {
    return { ...this.viewport };
  }
  public getGrid(): GridConfig {
    return { ...this.grid };
  }
  public setViewport(vp: Partial<Viewport>): void {
    if (vp.offsetX !== undefined) this.viewport.offsetX = vp.offsetX;
    if (vp.offsetY !== undefined) this.viewport.offsetY = vp.offsetY;
    if (vp.zoom !== undefined) this.viewport.zoom = vp.zoom;
  }
  public setGrid(g: Partial<GridConfig>): void {
    if (g.size !== undefined) this.grid.size = g.size;
    if (g.enabled !== undefined) this.grid.enabled = g.enabled;
  }
}

export const defaultCoordinateSystem = new CoordinateSystem();
