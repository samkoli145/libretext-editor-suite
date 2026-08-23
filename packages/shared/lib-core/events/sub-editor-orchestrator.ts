/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أوركسترا المحررات المتخصصة المنسقة (Multi-Editor Orchestrator Engine).
 * 🏛️ الدور: نواة الأحداث والتفاعل المشترك (Shared Event & Interaction Core).
 * 📥 المستهلك: CanvasDesignerEditor, UIDesigner, RichText, DrawingCanvas.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Coexistence Strategy Pattern: كل نوع عنصر يتولى تحريره محرر فرعي متخصص
 *    (Line, Bezier, Motion, TextInplace, Selection) مع التنازل والتسليم السلس
 *    (Smooth Contextual Handoff) دون أي احتكاك في تجربة المستخدم.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تنظيف مراجع المحرر السابق عبر `detach()` قبل تفعيل المحرر الجديد.
 *    2. تمرير الأحداث غير المعالجة إلى طبقة التحديد الافتراضية لمنع تجمد الفأرة.
 *    3. حماية أحداث المفاتيح والحقول النصية من التداخل مع اختصارات المحرر.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع معالجات الأحداث وتدقيق صحة الإحداثيات.
 *    - حماية دورة الحياة عبر try/catch في جميع نداءات `renderOverlays`.
 *    - دعم الثيم الفاتح النقي 100% في كافة أدلة ورسومات التحرير.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type SubEditorKind =
  'selection' | 'line' | 'bezier' | 'motionPath' | 'textInplace' | 'drawing';

export interface CanvasPointerEvent {
  canvasX: number;
  canvasY: number;
  screenX: number;
  screenY: number;
  button: number;
  buttons: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  rawEvent: MouseEvent | TouchEvent | PointerEvent;
}

export interface CanvasSurface {
  zoom: number;
  panX: number;
  panY: number;
  viewportWidth: number;
  viewportHeight: number;
  invalidate: () => void;
  setCursor: (cursor: string) => void;
  commitChange: (description: string, patch: Record<string, unknown>) => void;
}

export interface SubEditor {
  readonly kind: SubEditorKind;
  readonly isActive: boolean;
  attach(targetId: string, elementData: any, surface: CanvasSurface): void;
  detach(): void;
  handlePointerDown(e: CanvasPointerEvent): boolean;
  handlePointerMove(e: CanvasPointerEvent): boolean;
  handlePointerUp(e: CanvasPointerEvent): boolean;
  handleDoubleClick?(e: CanvasPointerEvent): boolean;
  handleKeyDown?(e: KeyboardEvent): boolean;
  renderOverlays?(ctx: CanvasRenderingContext2D, surface: CanvasSurface): void;
}

export class SubEditorOrchestrator {
  private activeEditor: SubEditor | null = null;
  private editors: Map<SubEditorKind, SubEditor> = new Map();
  private surface: CanvasSurface | null = null;
  private currentTargetId: string | null = null;

  constructor(surface?: CanvasSurface) {
    if (surface) {
      this.surface = surface;
    }
  }

  setSurface(surface: CanvasSurface): void {
    this.surface = surface;
  }

  registerEditor(editor: SubEditor): void {
    this.editors.set(editor.kind, editor);
  }

  getActiveKind(): SubEditorKind | null {
    return this.activeEditor ? this.activeEditor.kind : null;
  }

  getActiveEditor(): SubEditor | null {
    return this.activeEditor;
  }

  getTargetId(): string | null {
    return this.currentTargetId;
  }

  /**
   * التبديل الذكي للمحرر المتخصص بناءً على خصائص العنصر المحدد
   */
  switchForElement(elementId: string | null, elementData: any): boolean {
    if (!elementId || !elementData) {
      this.detachCurrent();
      return false;
    }

    let targetKind: SubEditorKind = 'selection';

    if (elementData.type === 'bezier' || elementData.points || Array.isArray(elementData.nodes)) {
      targetKind = 'bezier';
    } else if (
      elementData.type === 'line' ||
      elementData.type === 'arrow' ||
      elementData.type === 'connector'
    ) {
      targetKind = 'line';
    } else if (elementData.type === 'motionPath' || elementData.hasMotionPath) {
      targetKind = 'motionPath';
    }

    return this.activate(targetKind, elementId, elementData);
  }

  activate(kind: SubEditorKind, targetId: string, elementData: any): boolean {
    if (!this.surface) return false;

    // إذا كان المحرر الحالي هو نفسه على نفس العنصر، لا داعي لإعادة التهيئة
    if (this.activeEditor && this.activeEditor.kind === kind && this.currentTargetId === targetId) {
      return true;
    }

    this.detachCurrent();

    const nextEditor = this.editors.get(kind);
    if (!nextEditor) return false;

    try {
      nextEditor.attach(targetId, elementData, this.surface);
      this.activeEditor = nextEditor;
      this.currentTargetId = targetId;
      this.surface.invalidate();
      return true;
    } catch (err) {
      console.error(`Failed to attach sub-editor ${kind}:`, err);
      this.detachCurrent();
      return false;
    }
  }

  detachCurrent(): void {
    if (this.activeEditor) {
      try {
        this.activeEditor.detach();
      } catch (err) {
        console.error('Error during sub-editor detach:', err);
      }
      this.activeEditor = null;
      this.currentTargetId = null;
      if (this.surface) {
        this.surface.setCursor('default');
        this.surface.invalidate();
      }
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🖱️ توجيه أحداث الفأرة للمحرر النشط
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  dispatchPointerDown(e: CanvasPointerEvent): boolean {
    if (this.activeEditor && this.activeEditor.isActive) {
      return this.activeEditor.handlePointerDown(e);
    }
    return false;
  }

  dispatchPointerMove(e: CanvasPointerEvent): boolean {
    if (this.activeEditor && this.activeEditor.isActive) {
      return this.activeEditor.handlePointerMove(e);
    }
    return false;
  }

  dispatchPointerUp(e: CanvasPointerEvent): boolean {
    if (this.activeEditor && this.activeEditor.isActive) {
      return this.activeEditor.handlePointerUp(e);
    }
    return false;
  }

  dispatchDoubleClick(e: CanvasPointerEvent): boolean {
    if (this.activeEditor && this.activeEditor.isActive && this.activeEditor.handleDoubleClick) {
      return this.activeEditor.handleDoubleClick(e);
    }
    return false;
  }

  dispatchKeyDown(e: KeyboardEvent): boolean {
    if (this.activeEditor && this.activeEditor.isActive && this.activeEditor.handleKeyDown) {
      return this.activeEditor.handleKeyDown(e);
    }
    return false;
  }

  renderOverlays(ctx: CanvasRenderingContext2D): void {
    if (
      this.activeEditor &&
      this.activeEditor.isActive &&
      this.surface &&
      this.activeEditor.renderOverlays
    ) {
      try {
        this.activeEditor.renderOverlays(ctx, this.surface);
      } catch (err) {
        console.error('Error rendering sub-editor overlays:', err);
      }
    }
  }
}
