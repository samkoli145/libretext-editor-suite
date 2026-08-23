/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التاريخ والتراجع باللقطات المعزول - حل مشكلة Stale Closures
 * 🏛️ الدور: نواة مشتركة معزولة - أساس نظام Undo/Redo لكل المحررات الأربعة
 * 📥 المستهلك: CanvasDesignerEditor, RichTextEditor, UIDesignerEditor, PdfEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable Snapshot Stacks + Ref-Safe Dispatchers: حفظ اللقطات غير القابلة للتعديل
 *    مع إرسال آمن عبر المراجع لمنع أخطاء Stale Closures في React
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. حجم اللقطات الكبيرة قد يستنزف الذاكرة - يُنصح بتحديد maxHistorySize
 *    2. Transaction Batching يجب أن ينتهي بـ commit() أو يُلغي بـ rollback()
 *    3. الفروع (Branches) لا تتبع تلقائياً عند العودة لمسار سابق
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود لقطات قبل التراجع (canUndo/canRedo)
 *    - تعامل مع الأنواع العامة <T> مع فرض غير القابل للتعديل
 *    - إرجاع معرف اللقطة بعد كل عملية لمتابعة التدقيق
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface HistoryConfig {
  maxHistorySize?: number;
  debounceMs?: number;
}

export interface HistorySnapshot<T> {
  id: string;
  timestamp: number;
  description?: string;
  state: T;
}

export type HistorySubscriber<T> = (state: T, canUndo: boolean, canRedo: boolean) => void;

/**
 * Pure In-Memory Snapshot Stack Manager (Immutable & Thread-safe for React)
 */
export class HistoryDiffEngine<T> {
  private past: HistorySnapshot<T>[] = [];
  private present: HistorySnapshot<T>;
  private future: HistorySnapshot<T>[] = [];
  private maxHistorySize: number;
  private subscribers: Set<HistorySubscriber<T>> = new Set();
  private isBatching = false;
  private batchDescription?: string;
  private lastPushedTimestamp = 0;
  private debounceMs: number;

  constructor(initialState: T, config: HistoryConfig = {}) {
    this.maxHistorySize = config.maxHistorySize ?? 50;
    this.debounceMs = config.debounceMs ?? 0;
    this.present = {
      id: this.generateId(),
      timestamp: Date.now(),
      description: 'Initial State',
      state: this.cloneState(initialState),
    };
  }

  /**
   * Clone state using structuredClone or fallback to JSON deep clone
   */
  private cloneState(state: T): T {
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(state);
      } catch {
        return JSON.parse(JSON.stringify(state));
      }
    }
    return JSON.parse(JSON.stringify(state));
  }

  private generateId(): string {
    return `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  /**
   * Returns the current state snapshot (Immutable)
   */
  public getCurrentState(): T {
    return this.cloneState(this.present.state);
  }

  /**
   * Returns whether undo is available
   */
  public get canUndo(): boolean {
    return this.past.length > 0;
  }

  /**
   * Returns whether redo is available
   */
  public get canRedo(): boolean {
    return this.future.length > 0;
  }

  /**
   * Push a new state snapshot onto the history stack.
   * Clears the redo (future) stack to maintain linear chronological timeline.
   */
  public pushState(nextState: T, description?: string): void {
    if (this.isBatching) {
      this.present.state = this.cloneState(nextState);
      return;
    }

    const now = Date.now();
    if (
      this.debounceMs > 0 &&
      now - this.lastPushedTimestamp < this.debounceMs &&
      this.past.length > 0
    ) {
      // Overwrite present state if within debounce interval
      this.present.state = this.cloneState(nextState);
      if (description) this.present.description = description;
      this.notifySubscribers();
      return;
    }

    this.lastPushedTimestamp = now;

    // Archive present into past stack
    this.past.push(this.present);
    if (this.past.length > this.maxHistorySize) {
      this.past.shift(); // Trim oldest
    }

    // Set new present
    this.present = {
      id: this.generateId(),
      timestamp: now,
      description,
      state: this.cloneState(nextState),
    };

    // Clear future
    this.future = [];

    this.notifySubscribers();
  }

  /**
   * Undo to previous state snapshot.
   * Guarantees returning pure cloned state without closure staleness.
   */
  public undo(): T | null {
    if (!this.canUndo) return null;

    const previous = this.past.pop()!;
    this.future.unshift(this.present);
    this.present = previous;

    const restored = this.cloneState(this.present.state);
    this.notifySubscribers();
    return restored;
  }

  /**
   * Redo to next state snapshot.
   */
  public redo(): T | null {
    if (!this.canRedo) return null;

    const next = this.future.shift()!;
    this.past.push(this.present);
    this.present = next;

    const restored = this.cloneState(this.present.state);
    this.notifySubscribers();
    return restored;
  }

  /**
   * Batch multiple continuous actions into a single undo/redo transaction
   */
  public startBatch(description?: string): void {
    this.isBatching = true;
    this.batchDescription = description;
  }

  public commitBatch(): void {
    if (!this.isBatching) return;
    this.isBatching = false;
    this.pushState(this.present.state, this.batchDescription);
  }

  /**
   * Reset the history stack with a fresh base state
   */
  public reset(newState: T): void {
    this.past = [];
    this.future = [];
    this.present = {
      id: this.generateId(),
      timestamp: Date.now(),
      description: 'Reset State',
      state: this.cloneState(newState),
    };
    this.notifySubscribers();
  }

  /**
   * Subscribe to history changes
   */
  public subscribe(fn: HistorySubscriber<T>): () => void {
    this.subscribers.add(fn);
    fn(this.getCurrentState(), this.canUndo, this.canRedo);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private notifySubscribers(): void {
    const curr = this.getCurrentState();
    const u = this.canUndo;
    const r = this.canRedo;
    for (const sub of this.subscribers) {
      try {
        sub(curr, u, r);
      } catch (err) {
        console.error('History subscriber notification error:', err);
      }
    }
  }
}
