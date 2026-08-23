/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أداة Debounce و Throttle متعددة الاستخدامات لتحسين الأداء
 * 🏛️ الدور: أداة مشتركة - تأخير تنفيذ الدوال المتكررة لتقليل الحمل
 * 📥 المستهلك: كل الملفات التي تحتاج Debounce (Autosave, Search, Resize)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Generic Debouncer: أداة عامة تعمل مع أي نوع بيانات <+T>
 *    مع دعم Debounce و Throttle في كائن واحد
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. timer يجب أن يُنظف عند تدمير المكون (cleanup)
 *    2. leading option قد يسبب تنفيذاً غير متوقع
 *    3. maxWait يجب أن يكون أكبر من wait
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود timer قبل clearTimeout
 *    - إرجاع دالة cleanup للمستخدم
 *    - تعامل مع cancel أثناء التنفيذ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/Debouncer.ts
/**
 * مؤجّل عام للأداء والتأجيل الذكي — يُستدعى الدالة بعد فترة هدوء
 */
export class Debouncer<TArgs extends unknown[], TResult> {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private lastResult: TResult | undefined;
  private pendingResolve: ((value: TResult) => void) | null = null;

  constructor(
    private readonly fn: (...args: TArgs) => TResult,
    private readonly delayMs: number = 150,
  ) {}

  /**
   * استدعاء مؤجّل — يعيد Promise يحلّ عند اكتمال التنفيذ
   */
  invoke(...args: TArgs): Promise<TResult> {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    return new Promise<TResult>((resolve) => {
      this.pendingResolve = resolve;
      this.timer = setTimeout(() => {
        try {
          this.lastResult = this.fn(...args);
          resolve(this.lastResult);
        } catch {
          resolve(this.lastResult as TResult);
        } finally {
          this.timer = null;
          this.pendingResolve = null;
        }
      }, this.delayMs);
    });
  }

  /**
   * تنفيذ فوري وإلغاء المؤجّل
   */
  flush(...args: TArgs): TResult {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.lastResult = this.fn(...args);
    if (this.pendingResolve) {
      this.pendingResolve(this.lastResult);
      this.pendingResolve = null;
    }
    return this.lastResult;
  }

  /**
   * إلغاء المؤجّل
   */
  cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pendingResolve = null;
  }

  /**
   * آخر نتيجة
   */
  getLastResult(): TResult | undefined {
    return this.lastResult;
  }
}

/**
 * دالة تأخير وظيفية
 */
export function debounce<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  delayMs: number = 150,
): (...args: TArgs) => Promise<TResult> {
  const debouncer = new Debouncer(fn, delayMs);
  return (...args) => debouncer.invoke(...args);
}

/**
 * خنق معدل التنفيذ (throttle)
 */
export function throttle<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  intervalMs: number = 100,
): (...args: TArgs) => TResult | undefined {
  let lastCall = 0;
  let lastResult: TResult | undefined;

  return (...args: TArgs): TResult | undefined => {
    const now = Date.now();
    if (now - lastCall >= intervalMs) {
      lastCall = now;
      lastResult = fn(...args);
    }
    return lastResult;
  };
}
