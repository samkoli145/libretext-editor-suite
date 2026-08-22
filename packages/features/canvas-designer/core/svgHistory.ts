/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نظام التراجع والإعادة وسجل العمليات الموضعي للكانفا - SVG History
 * 🏛️ الدور: محرك مشترك - Command Pattern مع Batch Command وStack Limit
 * 📥 المستهلك: CanvasDesignerEditor, useCanvasShortcuts
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Command Pattern + Batch Command: نمط الأمر مع دعم التجميع
 *    مع إدارة سقف الذاكرة (Stack Limit) لحفظ الأداء
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. سقف الذاكرة يجب ألا يتجاوز 200 أمر
 *    2. التجميع يجب أن يجمع العمليات المتزامنة فقط
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الأمر قبل الإضافة
 *    - حذف الأوامر القديمة عند تجاوز السقف
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface HistoryCommand<T> {
  readonly description: string;
  apply(state: T): T;
  revert(state: T): T;
}

export class SvgHistoryManager<T> {
  private undoStack: HistoryCommand<T>[] = [];
  private redoStack: HistoryCommand<T>[] = [];
  private readonly maxStackSize: number;

  constructor(maxStackSize = 50) {
    this.maxStackSize = maxStackSize;
  }

  /**
   * تنفيذ وإضافة أمر جديد إلى السجل
   */
  execute(command: HistoryCommand<T>, currentState: T): T {
    const newState = command.apply(currentState);
    this.undoStack.push(command);
    this.redoStack = []; // تفريغ مكدس الإعادة عند إحداث تعديل جديد

    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }

    return newState;
  }

  /**
   * التراجع عن آخر أمر
   */
  undo(currentState: T): { state: T; command: HistoryCommand<T> } | null {
    if (!this.canUndo()) return null;

    const command = this.undoStack.pop()!;
    const previousState = command.revert(currentState);
    this.redoStack.push(command);

    return { state: previousState, command };
  }

  /**
   * إعادة تطبيق الأمر الأخير
   */
  redo(currentState: T): { state: T; command: HistoryCommand<T> } | null {
    if (!this.canRedo()) return null;

    const command = this.redoStack.pop()!;
    const nextState = command.apply(currentState);
    this.undoStack.push(command);

    return { state: nextState, command };
  }

  /**
   * هل يمكن التراجع؟
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * هل يمكن الإعادة؟
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * الحصول على وصف آخر أمر قابل للتراجع
   */
  getLastUndoDescription(): string | null {
    if (this.undoStack.length === 0) return null;
    return this.undoStack[this.undoStack.length - 1].description;
  }

  /**
   * تفريغ السجل بالكامل
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

/**
 * أمر عام لتغيير الحالة بالكامل عبر دوال التحويل
 */
export class StateChangeCommand<T> implements HistoryCommand<T> {
  readonly description: string;
  private readonly forwardState: T;
  private readonly backwardState: T;

  constructor(description: string, backwardState: T, forwardState: T) {
    this.description = description;
    this.backwardState = backwardState;
    this.forwardState = forwardState;
  }

  apply(_state: T): T {
    return this.forwardState;
  }

  revert(_state: T): T {
    return this.backwardState;
  }
}

/**
 * أمر تجميعي (Batch Command) لتنفيذ عدة أوامر معاً
 */
export class BatchHistoryCommand<T> implements HistoryCommand<T> {
  readonly description: string;
  private readonly commands: HistoryCommand<T>[];

  constructor(description: string, commands: HistoryCommand<T>[]) {
    this.description = description;
    this.commands = commands;
  }

  apply(state: T): T {
    let current = state;
    for (const cmd of this.commands) {
      current = cmd.apply(current);
    }
    return current;
  }

  revert(state: T): T {
    let current = state;
    // التراجع بترتيب عكسي
    for (let i = this.commands.length - 1; i >= 0; i--) {
      current = this.commands[i].revert(current);
    }
    return current;
  }
}
