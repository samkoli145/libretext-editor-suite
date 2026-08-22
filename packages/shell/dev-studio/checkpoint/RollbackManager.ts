// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [RollbackManager.ts] مدير الرجوع — تطبيق inverses بأمان
//
// الرجوع في هذا الاستوديو ليس "سحراً" — هو تطبيق مصفوفة inverses
// المخزنة في اللقطة، بالترتيب الذي خُزنت به (المعكوس مسبقاً في
// SnapshotEngine). لا منطق إضافياً، لا إعادة بناء، لا تخمين.
//
// هذا هو جوهر مبدأ rowcol.ts:
//   "EVERY FUNCTION HERE IS A PATCH FACTORY... a structural edit that
//    mutated the document directly would be an edit with no inverse."
// لأن كل تصحيح حمل inverse لحظة إنشائه، الرجوع لا يحتاج لمعرفة
// ماذا حدث — فقط تطبيق ما سُجل.
//
// المبادئ الثلاثة:
//
// 1. ذري عبر السطح:
//    كل inverses تُطبق في استدعاء واحد لـ project.apply().
//    السطح (applyPatch في Bento) يرمي loudly قبل أن يعدّل،
//    فإما كل شيء أو لا شيء. تطبيق تدريجي مع try/catch لكل inverse
//    كان سيترك رجوعاً نصف مطبق — وهو أسوأ من فشل كامل.
//
// 2. لقطة مستهلكة لا تُستهلك مرتين:
//    التراجع عن تراجع هو تطبيق inverses على حالة مُسترجعة بالفعل،
//    أي إعادة تنفيذ المهمة الأصلية. هذا ليس تراجعاً، هذا خلط.
//    لذا المدير يرفض، والرفض هو الإجابة الصحيحة الوحيدة.
//
// 3. التحقق قبل التنفيذ:
//    canRollback يجيب قبل أن يلمس الرجوع شيئاً.
//    واجهة تعرض زر تراجع يجب أن تعرف إن كان الضغط عليه آمناً.
//
// ⚠️ ما لا يفعله هذا المدير (عمداً):
//    - لا يلتقط لقطات (هذا عمل SnapshotEngine)
//    - لا يتحقق من أن الحالة الحالية تطابق ما بعد patches
//      (هذا يتطلب مقارنة محتوى، ويُترك لاختبارات round-trip في
//      المرحلة 5، حيث rig كامل يثبت byte-identical مثل
//      test-dash-rowcol.ts)
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import type { Checkpoint } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// نتيجة الرجوع
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تقرير الرجوع — للواجهة وللسجل.
 *
 * ⚠️ الحقول المضافة: الغياب يعني "لا".
 * رجوع ناجح ليس له `error`. رجوع لم يُطبق فيه شيء بعد ليس له
 * `applied` مخزّناً كصفر — بل الرقم الفعلي.
 */
export interface RollbackResult {
  checkpointId: string;
  /** عدد inverses التي طُبقت (يساوي total عند النجاح) */
  applied: number;
  total: number;
  succeeded: boolean;
  /** additive: موجود فقط عند الفشل */
  error?: string;
}

/**
 * فحص الأهلية — الإجابة قبل أن يلمس الرجوع شيئاً.
 */
export interface RollbackEligibility {
  ok: boolean;
  /** additive: موجود فقط عند الرفض */
  reason?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المدير
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class RollbackManager {
  /**
   * اللقطات التي استُهلكت بالفعل.
   *
   * حالة في الذاكرة فقط (View State): لو مات الاستوديو وعاد بلقطة
   * من localStorage، اللقطة تصبح قابلة للاستهلاك من جديد — وهذا
   * صحيح، لأن الجلسة الجديدة لا تعرف أنها استُهلكت.
   */
  private consumed = new Set<string>();

  /**
   * هل يمكن التراجع عن هذه اللقطة الآن؟
   *
   * أسباب الرفض:
   * - استُهلكت بالفعل (تراجع مرتين = إعادة تنفيذ المهمة)
   * - لا inverses (لقطة فارغة — كان يجب أن يرفضها capture)
   */
  canRollback(ckpt: Checkpoint): RollbackEligibility {
    if (this.consumed.has(ckpt.id)) {
      return { ok: false, reason: 'already rolled back — استُهلكت بالفعل' };
    }
    if (!ckpt.inverses || ckpt.inverses.length === 0) {
      return { ok: false, reason: 'no inverses — لا شيء للتراجع عنه' };
    }
    return { ok: true };
  }

  /**
   * تطبيق الرجوع.
   *
   * ذري: كل inverses في استدعاء واحد لـ apply. السطح يقرر الذرية
   * الفعلية (applyPatch يرمي loudly قبل التعديل). إذا رمى السطح،
   * ينتشر الخطأ كما هو — لا نبتلعه، ولا نطبق جزئياً.
   *
   * ⚠️ القاعدة من rowcol.ts: التراجع يطبق inverses بالعكس،
   * واللقطة خزنتها بالعكس مسبقاً، لذا نطبقها بالترتيب المخزن.
   *
   * @throws إذا كانت اللقطة غير مؤهلة، أو إذا فشل السطح في التطبيق.
   */
  rollback(ckpt: Checkpoint, project: ProjectSurface): RollbackResult {
    const eligibility = this.canRollback(ckpt);
    if (!eligibility.ok) {
      throw new Error(
        `[RollbackManager] لا يمكن التراجع عن "${ckpt.id}": ${eligibility.reason}`,
      );
    }

    // ── التطبيق الذري ──
    // استدعاء واحد → السطح يطبق الكل أو يرمي قبل أي تعديل.
    project.apply(ckpt.inverses);

    // ── الاستهلاك ──
    // بعد نجاح التطبيق فقط. لو رمى apply، اللقطة تبقى قابلة للاستهلاك،
    // ويمكن المحاولة من جديد بعد إصلاح السطح.
    this.consumed.add(ckpt.id);

    return {
      checkpointId: ckpt.id,
      applied: ckpt.inverses.length,
      total: ckpt.inverses.length,
      succeeded: true,
    };
  }

  /**
   * هل استُهلكت هذه اللقطة في الجلسة الحالية؟
   */
  isConsumed(checkpointId: string): boolean {
    return this.consumed.has(checkpointId);
  }

  /**
   * مسح سجل الاستهلاك (للاختبارات، أو عند إعادة تحميل اللقطات
   * من تخزين دائم في جلسة جديدة).
   */
  reset(): void {
    this.consumed.clear();
  }
}

export const globalRollbackManager = new RollbackManager();
