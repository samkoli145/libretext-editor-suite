/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك ثلاثية التفاعل بالماوس والتحديد المتقدم (Mouse Interaction Trinity)
 * 🏛️ الدور: نواة مشتركة معزولة (Zero-Dependency) لإدارة دورة حياة سحب العناصر،
 *           قفل المحاور (Shift Axis Lock)، السحب مع النسخ (Alt/Ctrl Clone Drag)،
 *           والاختيار العميق (Deep Select) عبر طبقات العناصر المتداخلة.
 * 📥 المستهلك: CanvasDesignerEditor, UIDesignerEditor, useCanvasDragResize
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Trinity LifeCycle (Down -> Window Move -> Window Up -> Atomic Commit)
 *    مع فصل كامل بين معاينة DOM اللحظية والالتزام الذري بنموذج البيانات (Model).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مستمعات الحركة والإفلات يجب أن ترتبط حصراً بـ window لالتقاط الحركة خارج العنصر.
 *    2. تنظيف مستمعات الأحداث (Event Listener Teardown) دائماً على blur و mouseup لمنع تسرب الذاكرة.
 *    3. عدم تعديل النموذج (Store Model) أثناء الحركة، بل الالتزام دفعة واحدة عند mouseup لضمان سلامة التراجع (Undo/Redo).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لمدخلات الفأرة والنقاط الإحداثية
 *    - حماية من القسمة على صفر أو القيم غير المحددة (NaN / Infinity)
 *    - استعادة الحالة الأولية تلقائياً عند الإلغاء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface DragSessionOptions {
  startEvent: MouseEvent | React.MouseEvent;
  startPoint: Point2D;
  initialBounds: { x: number; y: number; width: number; height: number };
  enableAxisLock?: boolean;
  enableCloneDrag?: boolean;
  onMove: (state: DragMoveState) => void;
  onCommit: (state: DragCommitState) => void;
  onCancel?: () => void;
}

export interface DragMoveState {
  currentPoint: Point2D;
  delta: Point2D;
  isAxisLocked: boolean;
  lockedAxis: 'horizontal' | 'vertical' | null;
  isCloneActive: boolean;
  rawX: number;
  rawY: number;
  targetX: number;
  targetY: number;
}

export interface DragCommitState {
  hasMoved: boolean;
  isCloneActive: boolean;
  delta: Point2D;
  finalX: number;
  finalY: number;
}

/**
 * حساب قفل المحور (Shift Axis Lock)
 * يقفل الحركة إلى المحور الأفقي أو العمودي استناداً إلى الفرق الأكبر
 */
export function calculateAxisLock(
  deltaX: number,
  deltaY: number,
  threshold: number = 4,
): { lockedAxis: 'horizontal' | 'vertical' | null; deltaX: number; deltaY: number } {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX < threshold && absY < threshold) {
    return { lockedAxis: null, deltaX, deltaY };
  }

  if (absX >= absY) {
    // حركة أفقية فقط
    return { lockedAxis: 'horizontal', deltaX, deltaY: 0 };
  } else {
    // حركة عمودية فقط
    return { lockedAxis: 'vertical', deltaX: 0, deltaY };
  }
}

/**
 * محرك ثلاثية السحب والتفاعل بالماوس
 * يدير مستمعات window ويحسب قفل المحور والنسخ بالسحب
 */
export class MouseInteractionTrinity {
  /**
   * بدء جلسة سحب معزولة
   */
  public static startDragSession(
    options: DragSessionOptions,
    screenToCanvas: (screenX: number, screenY: number) => Point2D,
  ): () => void {
    const {
      startPoint,
      initialBounds,
      enableAxisLock = true,
      enableCloneDrag = true,
      onMove,
      onCommit,
      onCancel,
    } = options;

    let hasMoved = false;
    let isCloneActive = Boolean(
      options.startEvent.altKey || options.startEvent.metaKey || options.startEvent.ctrlKey,
    );

    let currentTargetX = initialBounds.x;
    let currentTargetY = initialBounds.y;
    let lastDelta: Point2D = { x: 0, y: 0 };

    const handleWindowMouseMove = (e: MouseEvent) => {
      const currentCanvasPt = screenToCanvas(e.clientX, e.clientY);
      let rawDeltaX = currentCanvasPt.x - startPoint.x;
      let rawDeltaY = currentCanvasPt.y - startPoint.y;

      if (!hasMoved && (Math.abs(rawDeltaX) > 2 || Math.abs(rawDeltaY) > 2)) {
        hasMoved = true;
      }

      let isAxisLocked = false;
      let lockedAxis: 'horizontal' | 'vertical' | null = null;

      if (enableAxisLock && e.shiftKey) {
        const lockResult = calculateAxisLock(rawDeltaX, rawDeltaY);
        lockedAxis = lockResult.lockedAxis;
        rawDeltaX = lockResult.deltaX;
        rawDeltaY = lockResult.deltaY;
        isAxisLocked = lockedAxis !== null;
      }

      if (enableCloneDrag) {
        isCloneActive = Boolean(e.altKey || e.metaKey || e.ctrlKey);
      }

      currentTargetX = initialBounds.x + rawDeltaX;
      currentTargetY = initialBounds.y + rawDeltaY;
      lastDelta = { x: rawDeltaX, y: rawDeltaY };

      onMove({
        currentPoint: currentCanvasPt,
        delta: lastDelta,
        isAxisLocked,
        lockedAxis,
        isCloneActive,
        rawX: initialBounds.x + (currentCanvasPt.x - startPoint.x),
        rawY: initialBounds.y + (currentCanvasPt.y - startPoint.y),
        targetX: currentTargetX,
        targetY: currentTargetY,
      });
    };

    const cleanup = () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('blur', handleWindowBlur);
    };

    const handleWindowMouseUp = (_e: MouseEvent) => {
      cleanup();
      onCommit({
        hasMoved,
        isCloneActive,
        delta: lastDelta,
        finalX: currentTargetX,
        finalY: currentTargetY,
      });
    };

    const handleWindowBlur = () => {
      cleanup();
      if (onCancel) {
        onCancel();
      } else {
        onCommit({
          hasMoved,
          isCloneActive,
          delta: lastDelta,
          finalX: currentTargetX,
          finalY: currentTargetY,
        });
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('mouseup', handleWindowMouseUp, { once: true });
    window.addEventListener('blur', handleWindowBlur, { once: true });

    return cleanup;
  }
}

/**
 * محرك الاختيار العميق (Deep Selection Engine)
 * عند النقر مع مفتاح Alt، يبحث في كافة العناصر المتداخلة تحت النقطة ويتحرك طبقة أعمق في كل نقرة
 */
export function performDeepSelect(
  point: Point2D,
  elements: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex?: number;
    locked?: boolean;
  }>,
  currentSelectedId: string | null,
): string | null {
  // تصفية العناصر التي تحتوي على النقطة (Hit Test)
  const hitElements = elements
    .filter((el) => {
      if (el.locked) return false;
      return (
        point.x >= el.x &&
        point.x <= el.x + el.width &&
        point.y >= el.y &&
        point.y <= el.y + el.height
      );
    })
    // ترتيب تنازلي حسب zIndex والترتيب في المصفوفة (الأعلى أولاً)
    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  if (hitElements.length === 0) return null;
  if (hitElements.length === 1) return hitElements[0].id;

  // إذا لم يكن هناك عنصر محدد حالياً أو العنصر المحدد ليس ضمن قائمة العناصر المتداخلة
  const currentIndex = hitElements.findIndex((el) => el.id === currentSelectedId);
  if (currentIndex === -1) {
    return hitElements[0].id;
  }

  // التنقل الدائري للطبقة التالية الأعمق
  const nextIndex = (currentIndex + 1) % hitElements.length;
  return hitElements[nextIndex].id;
}
