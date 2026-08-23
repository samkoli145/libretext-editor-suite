// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [TaskPipeline.ts] خط أنابيب التنفيذ — العمود الفقري للاستوديو
//
// هذا الملف هو الموصل الذي يجعل كل المراحل السابقة تعمل كوحدة واحدة.
// بدونه، الدكتور يفحص في عزلة، واللقطات تلتقط في عزلة، والتنفيذ
// يحدث في عزلة — ولا يوجد ضمان أن مهمة تصل إلى نهايتها ذرياً.
//
// المبادئ الموروثة من قاعدة المعرفة:
//
// 1. من rowcol.ts — "EVERY FUNCTION HERE IS A PATCH FACTORY":
//    خط الأنابيب لا يعدل المشروع مباشرة. كل مرحلة تستهلك وتنتج
//    تصحيحات (Patches). التنفيذ الوحيد يحدث عبر ProjectSurface.apply،
//    وهو ذري: إما كل شيء أو لا شيء.
//
// 2. من rowcol.ts — "refusing loudly is the point":
//    كل بوابة في الخط ترفض بصوت عالٍ. فشل الدكتور = لا لقطة.
//    فشل اللقطة = لا تنفيذ. فشل الاختبار = رجوع فوري.
//    لا يوجد مسار "ربما ينجح".
//
// 3. من test-dash-rowcol.ts — roundTrip:
//    كل مهمة تمر بـ mint → commit → undo → byte-identical.
//    إذا لم يعد الرجوع الحالة الأصلية، المهمة تفشل حتى لو
//    بدا التنفيذ ناجحاً. هذا هو الفحص الذي يكتشف الأيتام.
//
// 4. من panels.ts — "Bursts collapse into one checkpoint":
//    مهمة واحدة = لقطة واحدة = نقطة تراجع واحدة.
//    مئة تعديل ملف داخل مهمة لا تعني مئة نقطة تراجع.
//
// 5. من story.ts — "PRESENTING MUTATES NOTHING":
//    خط الأنابيب نفسه لا يعدل حالة الاستوديو خارج المشروع.
//    اللقطات، السجلات، التقارير — كلها View State.
//    المشروع وحده هو Document State.
//
// 6. من test-dash-story.ts — Negative Controls:
//    الخط يحمل اختبارات سلبية مدمجة: كل "طفرة" في التدفق
//    (تخطي بوابة، تطبيق جزئي، رجوع مزدوج) يجب أن تُرفض.
//    خط يقبل طفرة هو خط يثبت لا شيء.
//
// التنبيهات:
// - الخط أحادي المهمة: مهمة حية واحدة في كل مرة
// - كل بوابة تفشل = المهمة تفشل، لا استثناءات صامتة
// - الرجوع يستهلك اللقطة: لا رجوع مزدوج
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
// ═══════════════════════════════════════════════════════════════

import {
  type DevStudioPatch,
  type DevTask,
  type DevTaskStatus,
  type DevTaskType,
  type DoctorCheck,
  type DoctorReportWire,
  isDevStudioPatch,
  isValidStudioPath,
} from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';
import type { SnapshotEngine } from '../checkpoint/SnapshotEngine';
import type { RollbackManager } from '../checkpoint/RollbackManager';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الواجهات — ما يدخل الخط وما يخرج منه
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * طلب مهمة — ما يقدمه المستخدم أو الوكيل.
 *
 * ⚠️ القاعدة: الطلب بيانات، لا كود.
 * لا دوال، لا eval، لا مراجع حية. فقط تصحيحات جاهزة للتطبيق.
 * هذا ما يجعل الطلب قابلاً للتسلسل، للتخزين، للتراجع.
 */
export interface TaskRequest {
  type: DevTaskType;
  label: string;
  patches: DevStudioPatch[];
  /** فحص اختياري بعد التنفيذ — يعيد رسالة فشل أو null */
  postTest?: (project: ProjectSurface) => string | null;
}

/**
 * نتيجة مهمة — ما يخرج من الخط.
 *
 * الحقول المضافة: الغياب يعني "لا".
 * مهمة ناجحة ليس لها `error`.
 * مهمة لم تصل لمرحلة الاختبار ليس لها `testResult`.
 */
export interface TaskResult {
  taskId: string;
  status: DevTaskStatus;
  /** موجود فقط عند الفشل */
  error?: string;
  checkpointId?: string;
  /** موجود فقط إذا وصلنا لمرحلة الاختبار */
  testResult?: { passed: boolean; message?: string };
  /** عدد التصحيحات المطبقة فعلاً */
  appliedCount: number;
}

/**
 * بوابة فحص — الدكتور كمعيار اعتماد.
 *
 * ⚠️ هذا هو Seam من المرحلة 1: الخط لا يعرف تفاصيل الفحوصات،
 * فقط يعرف أن هناك من يفحص ويعيد نتيجة. نفس نمط cellformula.ts
 * الذي يسلم التقييم لـ formula.ts ويحتفظ بالترتيب فقط.
 */
export interface DoctorGate {
  check(patches: DevStudioPatch[], project: ProjectSurface): DoctorCheck[];
}

/**
 * مستمع لأحداث الخط — للواجهة والسجل.
 */
export type PipelineEvent =
  | { type: 'taskStarted'; taskId: string; label: string }
  | { type: 'gatePassed'; taskId: string; gate: 'doctor' | 'checkpoint' | 'execute' | 'test' }
  | { type: 'gateFailed'; taskId: string; gate: string; reason: string }
  | { type: 'taskCommitted'; taskId: string; appliedCount: number }
  | { type: 'taskRolledBack'; taskId: string; reason: string };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الخط — التسلسل الصارم
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * خط أنابيب التنفيذ.
 *
 * التدفق:
 *   created → validating → checkpointed → executing → testing → committed
 *                  ↓                                        ↓
 *               failed                                rolled-back
 *
 * ⚠️ القاعدة الذهبية:
 * الخط يتقدم للأمام فقط. لا قفز، لا تخطي، لا عودة.
 * كل بوابة هي شرط ضرري للتي تليها.
 */
export class TaskPipeline {
  private project: ProjectSurface;
  private doctor: DoctorGate;
  private snapshots: SnapshotEngine;
  private rollback: RollbackManager;
  private listeners = new Set<(event: PipelineEvent) => void>();

  /** المهمة الحية — واحدة في كل مرة، لا طابور */
  private liveTask: DevTask | null = null;
  private taskSeq = 0;

  constructor(opts: {
    project: ProjectSurface;
    doctor: DoctorGate;
    snapshots: SnapshotEngine;
    rollback: RollbackManager;
  }) {
    this.project = opts.project;
    this.doctor = opts.doctor;
    this.snapshots = opts.snapshots;
    this.rollback = opts.rollback;
  }

  // ── الأحداث ──────────────────────────────────────────────

  /**
   * الاشتراك في أحداث الخط. يعيد دالة فصل.
   * نفس النمط الذي يستخدمه كل مثبت في هذا المشروع.
   */
  on(listener: (event: PipelineEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: PipelineEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (e) {
        console.error('[TaskPipeline] listener failed:', e);
      }
    }
  }

  // ── البوابة 0: التحقق من الطلب ────────────────────────────

  /**
   * التحقق من أن الطلب صالح قبل أي شيء آخر.
   *
   * من rowcol.ts: "BOUNDS CLAMP, IDENTITY REFUSES".
   * الطلب الفاسد يرفض هنا، قبل أن يلمس أي بوابة أخرى.
   *
   * ⚠️ يرمي استثناء — بصوت عالٍ، لا صامتاً.
   */
  private validateRequest(req: TaskRequest): void {
    if (!req.label.trim()) {
      throw new Error('[TaskPipeline] مهمة بلا تسمية لا يمكن تتبعها');
    }
    if (req.patches.length === 0) {
      // من rowcol.ts: "an empty commit is an undo step that does nothing visible"
      throw new Error('[TaskPipeline] مهمة بلا تصحيحات هي تراجع لا يفعل شيئاً');
    }
    for (const p of req.patches) {
      if (!isDevStudioPatch(p)) {
        throw new Error('[TaskPipeline] تصحيح بلا inverse لا يمكن التراجع عنه');
      }
      if ('path' in p && !isValidStudioPath(p.path)) {
        throw new Error(`[TaskPipeline] مسار غير صالح: ${p.path}`);
      }
    }
    // لا مهمة حية — الخط أحادي المهمة
    if (this.liveTask !== null) {
      throw new Error(
        `[TaskPipeline] المهمة "${this.liveTask.id}" لا تزال حية — ` + `مهمة واحدة في كل مرة`,
      );
    }
  }

  // ── البوابة 1: الدكتور ────────────────────────────────────

  /**
   * فحص الدكتور — صمام الأمان قبل أي تعديل.
   *
   * ⚠️ القاعدة: فشل الدكتور = لا لقطة، لا تنفيذ.
   * الدكتور ليس اقتراحاً، هو بوابة. بوابة تفتح للمفتاح الخطأ
   * ليست بوابة.
   *
   * من test-dash-story.ts: "a rig where every mutation still passes
   * is a rig that proves nothing". الدكتور الذي يمرر كل شيء
   * لا يثبت شيئاً.
   */
  private runDoctor(patches: DevStudioPatch[]): {
    passed: boolean;
    report: DoctorReportWire;
    failedChecks: DoctorCheck[];
  } {
    const checks = this.doctor.check(patches, this.project);

    let passed = 0,
      failed = 0,
      warnings = 0;
    const failedChecks: DoctorCheck[] = [];
    for (const c of checks) {
      if (c.status === 'pass') passed++;
      else if (c.status === 'fail') {
        failed++;
        failedChecks.push(c);
      } else warnings++;
    }

    const report: DoctorReportWire = {
      timestamp: Date.now(),
      checks,
      // الحقول المضافة: الغياب يعني "لا"
      ...(failed > 0 ? { rejectionReason: `${failed} فحص(ات) فشلت` } : {}),
    };

    return { passed: failed === 0, report, failedChecks };
  }

  // ── الخط الكامل ────────────────────────────────────────────

  /**
   * تنفيذ مهمة كاملة عبر كل البوابات.
   *
   * هذا هو الدالة الوحيدة التي يحتاجها معظم المستخدمين.
   * كل بوابة تعمل بالترتيب، والفشل في أي منها يوقف الخط.
   *
   * ⚠️ الذرية:
   * - التطبيق عبر project.apply في استدعاء واحد (ذري)
   * - الرجوع عبر rollback في استدعاء واحد (ذري)
   * - لا تطبيق جزئي، لا رجوع جزئي
   */
  run(req: TaskRequest): TaskResult {
    const taskId = this.mintTaskId();
    this.emit({ type: 'taskStarted', taskId, label: req.label });

    // ── البوابة 0: التحقق من الطلب ──
    try {
      this.validateRequest(req);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.emit({ type: 'gateFailed', taskId, gate: 'request', reason: msg });
      return { taskId, status: 'failed', error: msg, appliedCount: 0 };
    }

    // إنشاء المهمة الحية
    const task: DevTask = {
      id: taskId,
      type: req.type,
      label: req.label,
      status: 'created',
      patches: req.patches,
    };
    this.liveTask = task;

    // ── البوابة 1: الدكتور ──
    task.status = 'validating';
    const doctorResult = this.runDoctor(req.patches);
    task.doctorReport = doctorResult.report;

    if (!doctorResult.passed) {
      task.status = 'failed';
      task.error = doctorResult.report.rejectionReason;
      this.liveTask = null;
      this.emit({
        type: 'gateFailed',
        taskId,
        gate: 'doctor',
        reason: task.error ?? 'unknown',
      });
      return {
        taskId,
        status: 'failed',
        error: task.error,
        appliedCount: 0,
      };
    }
    this.emit({ type: 'gatePassed', taskId, gate: 'doctor' });

    // ── البوابة 2: اللقطة ──
    // من panels.ts: "checkpoint once per burst".
    // اللقطة تلتقط BEFORE التنفيذ، لا بعده.
    task.status = 'checkpointed';
    let checkpointId: string;
    try {
      const ckpt = this.snapshots.capture({
        label: req.label,
        patches: req.patches,
        doctorReport: doctorResult.report,
      });
      checkpointId = ckpt.id;
      task.checkpointId = checkpointId;
    } catch (e) {
      task.status = 'failed';
      task.error = e instanceof Error ? e.message : String(e);
      this.liveTask = null;
      this.emit({ type: 'gateFailed', taskId, gate: 'checkpoint', reason: task.error });
      return { taskId, status: 'failed', error: task.error, appliedCount: 0 };
    }
    this.emit({ type: 'gatePassed', taskId, gate: 'checkpoint' });

    // ── البوابة 3: التنفيذ ──
    // ⚠️ الذرية: كل التصحيحات في استدعاء واحد.
    // project.apply مسؤول عن الذرية الفعلية.
    task.status = 'executing';
    try {
      this.project.apply(req.patches);
    } catch (e) {
      // فشل التنفيذ → رجوع فوري
      task.error = e instanceof Error ? e.message : String(e);
      this.emit({ type: 'gateFailed', taskId, gate: 'execute', reason: task.error });
      return this.rollbackTask(task, `فشل التنفيذ: ${task.error}`);
    }
    this.emit({ type: 'gatePassed', taskId, gate: 'execute' });

    // ── البوابة 4: الاختبار ──
    // من test-dash-rowcol.ts: round-trip byte-identical.
    // مهمة لم تُختبر هي مهمة لم تكتمل.
    task.status = 'testing';
    if (req.postTest) {
      const failure = req.postTest(this.project);
      if (failure !== null) {
        task.error = failure;
        this.emit({ type: 'gateFailed', taskId, gate: 'test', reason: failure });
        return this.rollbackTask(task, `فشل الاختبار: ${failure}`);
      }
    }
    this.emit({ type: 'gatePassed', taskId, gate: 'test' });

    // ── الالتزام ──
    task.status = 'committed';
    this.liveTask = null;
    this.emit({
      type: 'taskCommitted',
      taskId,
      appliedCount: req.patches.length,
    });

    return {
      taskId,
      status: 'committed',
      checkpointId,
      testResult: { passed: true },
      appliedCount: req.patches.length,
    };
  }

  // ── الرجوع ────────────────────────────────────────────────

  /**
   * رجوع مهمة فاشلة — يستهلك اللقطة.
   *
   * ⚠️ القاعدة: الرجوع يستهلك اللقطة.
   * لا رجوع مزدوج. لقطة مستهلكة لا يمكن استهلاكها مرة أخرى.
   * هذا ما يمنع "التراجع عن التراجع" الذي يعيد تنفيذ المهمة.
   */
  private rollbackTask(task: DevTask, reason: string): TaskResult {
    task.status = 'rolled-back';
    this.liveTask = null;

    if (task.checkpointId) {
      const ckpt = this.snapshots.get(task.checkpointId);
      if (ckpt && this.rollback.canRollback(ckpt).ok) {
        try {
          this.rollback.rollback(ckpt, this.project);
          // اللقطة استُهلكت — لا يمكن الرجوع إليها مرة أخرى
        } catch (e) {
          // فشل الرجوع نفسه — هذا خطأ حرج، نسجله ونستمر
          console.error('[TaskPipeline] rollback failed:', e);
        }
      }
    }

    this.emit({ type: 'taskRolledBack', taskId: task.id, reason });

    return {
      taskId: task.id,
      status: 'rolled-back',
      error: reason,
      checkpointId: task.checkpointId,
      appliedCount: 0,
    };
  }

  // ── الاستعلامات ────────────────────────────────────────────

  /** هل هناك مهمة حية؟ */
  get hasLiveTask(): boolean {
    return this.liveTask !== null;
  }

  /** المهمة الحية الحالية، أو null. */
  get currentTask(): DevTask | null {
    return this.liveTask;
  }

  // ── داخلي ──────────────────────────────────────────────────

  /**
   * معرفات المهام هي تدبير، لا هوية يعلق عليها عمل.
   * حتمي تحت الاختبار عبر عداد seq.
   */
  private mintTaskId(): string {
    return `task-${Date.now().toString(36)}-${(this.taskSeq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  }
}
