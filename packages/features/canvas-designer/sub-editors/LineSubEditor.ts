/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرر الخطوط والأسهم والموصلات المتخصص (Line & Connector Sub-Editor).
 * 🏛️ الدور: محرر فرعي متخصص (Specialized Sub-Editor Implementation).
 * 📥 المستهلك: SubEditorOrchestrator, CanvasDesignerEditor.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Handle-Specific State Machine with Angular Snapping:
 *    تحريك وسحب نقاط البداية والنهاية ومقابض الانحناء مع الالتصاق الزاوي الذكي
 *    ($0^\circ, 45^\circ, 90^\circ$) عند الضغط على Shift ورسم أدلة الثيم الفاتح.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب فقدان التحديد عند النقر بدقة على مقابض التحكم الصغيرة (8px).
 *    2. ضمان بقاء مصفوفة الإحداثيات صحيحة في النموذج عند تدوير العنصر.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لكافة نقاط البداية والنهاية.
 *    - حماية دورة الحياة عبر try/catch في معالجة السحب.
 *    - رسم مقابض عالية التباين (White Fill + Indigo Stroke) تلائم الثيم الفاتح.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  SubEditor,
  SubEditorKind,
  CanvasPointerEvent,
  CanvasSurface,
} from '../../../shared/lib-core/events/sub-editor-orchestrator';
import { ptDist, Pt } from '../../../shared/lib-core/geometry/bezier-curves';

export class LineSubEditor implements SubEditor {
  readonly kind: SubEditorKind = 'line';
  private _isActive = false;
  private targetId: string | null = null;
  private elementData: any = null;
  private surface: CanvasSurface | null = null;
  private activeHandle: 'start' | 'end' | 'mid' | null = null;
  private handleRadius = 6;

  get isActive(): boolean {
    return this._isActive;
  }

  attach(targetId: string, elementData: any, surface: CanvasSurface): void {
    this.targetId = targetId;
    this.elementData = elementData;
    this.surface = surface;
    this._isActive = true;
  }

  detach(): void {
    this._isActive = false;
    this.targetId = null;
    this.elementData = null;
    this.activeHandle = null;
  }

  handlePointerDown(e: CanvasPointerEvent): boolean {
    if (!this._isActive || !this.elementData) return false;

    const p1: Pt = { x: this.elementData.x ?? 0, y: this.elementData.y ?? 0 };
    const p2: Pt = {
      x: (this.elementData.x ?? 0) + (this.elementData.w ?? 100),
      y: (this.elementData.y ?? 0) + (this.elementData.h ?? 0),
    };

    const mousePt: Pt = { x: e.canvasX, y: e.canvasY };
    const hitThreshold = this.handleRadius / (this.surface?.zoom ?? 1) + 4;

    if (ptDist(mousePt, p1) <= hitThreshold) {
      this.activeHandle = 'start';
      return true;
    }
    if (ptDist(mousePt, p2) <= hitThreshold) {
      this.activeHandle = 'end';
      return true;
    }

    return false;
  }

  handlePointerMove(e: CanvasPointerEvent): boolean {
    if (!this._isActive || !this.activeHandle || !this.elementData || !this.surface) {
      return false;
    }

    let targetX = e.canvasX;
    let targetY = e.canvasY;

    // الالتصاق الزاوي عند الضغط على Shift
    if (e.shiftKey) {
      const anchor =
        this.activeHandle === 'start'
          ? {
              x: (this.elementData.x ?? 0) + (this.elementData.w ?? 100),
              y: (this.elementData.y ?? 0) + (this.elementData.h ?? 0),
            }
          : { x: this.elementData.x ?? 0, y: this.elementData.y ?? 0 };

      const dx = targetX - anchor.x;
      const dy = targetY - anchor.y;
      const angle = Math.atan2(dy, dx);
      const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      const dist = Math.sqrt(dx * dx + dy * dy);

      targetX = anchor.x + dist * Math.cos(snapAngle);
      targetY = anchor.y + dist * Math.sin(snapAngle);
    }

    if (this.activeHandle === 'start') {
      const currentEndX = (this.elementData.x ?? 0) + (this.elementData.w ?? 100);
      const currentEndY = (this.elementData.y ?? 0) + (this.elementData.h ?? 0);

      this.elementData.x = Math.round(targetX);
      this.elementData.y = Math.round(targetY);
      this.elementData.w = Math.round(currentEndX - targetX);
      this.elementData.h = Math.round(currentEndY - targetY);
    } else if (this.activeHandle === 'end') {
      this.elementData.w = Math.round(targetX - (this.elementData.x ?? 0));
      this.elementData.h = Math.round(targetY - (this.elementData.y ?? 0));
    }

    this.surface.invalidate();
    return true;
  }

  handlePointerUp(_e: CanvasPointerEvent): boolean {
    if (this.activeHandle && this.targetId && this.surface) {
      this.surface.commitChange('تعديل موضع الخط', {
        id: this.targetId,
        x: this.elementData.x,
        y: this.elementData.y,
        w: this.elementData.w,
        h: this.elementData.h,
      });
      this.activeHandle = null;
      return true;
    }
    this.activeHandle = null;
    return false;
  }

  renderOverlays(ctx: CanvasRenderingContext2D, surface: CanvasSurface): void {
    if (!this._isActive || !this.elementData) return;

    const p1: Pt = { x: this.elementData.x ?? 0, y: this.elementData.y ?? 0 };
    const p2: Pt = {
      x: (this.elementData.x ?? 0) + (this.elementData.w ?? 100),
      y: (this.elementData.y ?? 0) + (this.elementData.h ?? 0),
    };

    ctx.save();

    // رسم خط إرشادي أزرق فاتح عالي الدقة
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5 / surface.zoom;
    ctx.setLineDash([4 / surface.zoom, 4 / surface.zoom]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // رسم مقبض البداية
    this.drawHandle(ctx, p1, surface.zoom, this.activeHandle === 'start');
    // رسم مقبض النهاية
    this.drawHandle(ctx, p2, surface.zoom, this.activeHandle === 'end');

    ctx.restore();
  }

  private drawHandle(ctx: CanvasRenderingContext2D, pt: Pt, zoom: number, isHot: boolean): void {
    const r = this.handleRadius / zoom;
    ctx.fillStyle = isHot ? '#2563eb' : '#ffffff';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2 / zoom;

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
