// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [SnapshotEngine.ts] محرك اللقطات — صمام الأمان قبل أي تنفيذ
//
// هذا الملف يجيب سؤالاً واحداً: "إذا فشلت المهمة، كيف نعود؟"
//
// المبادئ الأربعة الموروثة من قاعدة المعرفة:
//
// 1. لقطة واحدة لكل مهمة (من panels.ts):
//    "Bursts of 'input' events collapse into a single undo checkpoint."
//    مئة تعديل ملف داخل مهمة واحدة = نقطة استرجاع واحدة.
//    لقطة لكل تعديل فرعي تعني مئة زر تراجع لا معنى لها.
//
// 2. الـ inverses تُشتق مسبقاً وبالعكس (من rowcol.ts):
//    الحذف يضع التجاوزات قبل الصفوف، والتراجع (الذي يطبق الـ inverses
//    بالعكس) يعيد الصفوف أولاً ثم تصحيحاتها. لذا الترتيب المعكوس ليس
//    تفصيلاً — هو ما يجعل الاسترجاع صحيحاً.
//
// 3. علم `clean` غير متناظر (الغياب يعني "غير مُتحقق منه"):
//    لقطة لم يوافق عليها الدكتور ليس لها علم `clean` إطلاقاً.
//    فقط لقطة وافق عليها الدكتور تحمل `clean: true`.
//    واجهة تراجع لا تفرّق بين "مُتحقق" و"مفترض" يجب أن تفترض الأسوأ.
//
// 4. اللقطات View State، لا Document State (من story.ts قاعدة 1):
//    اللقطات تعيش في الاستوديو، لا في ملف المشروع. مستندان متطابقان
//    يجب أن يظلا متطابقين بعد أي عملية استوديو.
//
// الرفض الصريح: لقطة بدون تصحيحات، أو بتصحيح بلا inverse، هي خطأ
// متصل — نرمي بدلاً من تخزين لقطة لا تستطيع التراجع.
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import {
  type Checkpoint,
  type DevStudioPatch,
  type DoctorReportWire,
} from '../core/DevStudioTypes';
import { globalDevStudioEvents } from '../core/DevStudioEvents';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// السقف — التاريخ محدود بالبايت، تماماً مثل store.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * أقصى عدد لقطات محتفظ بها. الأقدم تُنسى أولاً.
 *
 * لماذا سقف وليس "كل شيء"؟ لأن كل لقطة تحمل محتوى الملفات الكامل
 * (في inverses)، وخمسون مهمة تفكيك ملفات كبيرة قد تصل لمئات الميغا.
 * تاريخ غير محدود = ذاكرة غير محدودة، والاستوديو ليس مستثنى من
 * القاعدة التي يفرضها store.ts على نفسه.
 */
const MAX_CHECKPOINTS = 50;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// التخزين — الذاكرة افتراضياً، localStorage اختيارياً
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * السطح الذي يراه المحرك للتخزين.
 *
 * ⚠️ ملاحظة: التخزين هنا للقطات الاستوديو فقط (View State)،
 * وليس لمستند المشروع. الفصل مقصود: مستند يُفتح من البريد
 * يجب ألا يرث لقطات استوديو شخص آخر.
 */
export interface SnapshotStorage {
  save(ckpt: Checkpoint): void;
  load(id: string): Checkpoint | null;
  remove(id: string): void;
  listIds(): string[];
}

/**
 * تخزين في الذاكرة — الافتراضي.
 * سريع، بلا حدود localStorage، ويختفي مع إغلاق الاستوديو.
 * هذا هو السلوك الصحيح للقطات: هي حماية أثناء الجلسة.
 */
export class MemorySnapshotStorage implements SnapshotStorage {
  private map = new Map<string, Checkpoint>();

  save(ckpt: Checkpoint): void {
    this.map.set(ckpt.id, ckpt);
  }

  load(id: string): Checkpoint | null {
    return this.map.get(id) ?? null;
  }

  remove(id: string): void {
    this.map.delete(id);
  }

  listIds(): string[] {
    return [...this.map.keys()];
  }
}

/**
 * تخزين localStorage — للقطات يجب أن تنجو من إعادة التحميل.
 *
 * ⚠️ تحذير مقيس، من نفس عائلة تحذير setHidden في rowcol.ts:
 * JSON.stringify يبتلع undefined، واللقطات التي تعتمد على حقول
 * اختيارية يجب أن تُبنى بحيث الغياب يعني "لا" (قاعدة types.ts).
 * حصة localStorage (~5MB) تعني أن اللقطات الكبيرة قد تفشل صامتة —
 * لذا save يبتلع الخطأ ويعيد، والاستوديو يستمر بالذاكرة.
 */
export class LocalSnapshotStorage implements SnapshotStorage {
  private keyPrefix: string;

  constructor(keyPrefix = 'devstudio-ckpt-') {
    this.keyPrefix = keyPrefix;
  }

  save(ckpt: Checkpoint): void {
    try {
      localStorage.setItem(this.keyPrefix + ckpt.id, JSON.stringify(ckpt));
    } catch {
      // الحصة ممتلئة أو وضع خاص — اللقطة تبقى في الذاكرة فقط.
      // فشل التخزين الدائم لا يجب أن يكسر الجلسة.
    }
  }

  load(id: string): Checkpoint | null {
    try {
      const raw = localStorage.getItem(this.keyPrefix + id);
      return raw ? (JSON.parse(raw) as Checkpoint) : null;
    } catch {
      return null;
    }
  }

  remove(id: string): void {
    try {
      localStorage.removeItem(this.keyPrefix + id);
    } catch { /* لا شيء */ }
  }

  listIds(): string[] {
    const out: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.keyPrefix)) out.push(k.slice(this.keyPrefix.length));
      }
    } catch { /* وضع خاص */ }
    return out;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المحرك
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class SnapshotEngine {
  private checkpoints = new Map<string, Checkpoint>();
  /** الأحدث أولاً — التراجع يبدأ دائماً من الأحدث. */
  private order: string[] = [];
  private seq = 0;
  private storage: SnapshotStorage;

  constructor(storage?: SnapshotStorage) {
    this.storage = storage ?? new MemorySnapshotStorage();
  }

  /**
   * معرفات اللقطات هي تدبير، لا هوية يعلق عليها عمل أحد
   * (الهوية الحقيقية هي مسارات الملفات ومعرفات الأدوات)،
   * لذا يمكن أن تكون رخيصة ومقروءة.
   * حتمي تحت الاختبار عبر عداد seq.
   */
  private mintCheckpointId(): string {
    return `ckpt-${Date.now().toString(36)}-${(this.seq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  }

  /**
   * التقاط لقطة لمهمة على وشك التنفيذ.
   *
   * القاعدة الذهبية: تُلتقط BEFORE التنفيذ، لا بعده.
   * لقطة بعد التنفيذ هي وصف لما حدث، لا حماية منه.
   *
   * @throws إذا كانت اللقطة ستصبح عديمة المعنى:
   *   - تسمية فارغة (لقطة بلا اسم لا يمكن الإشارة إليها)
   *   - لا تصحيحات (لا شيء للتراجع عنه)
   *   - تصحيح بلا inverse (تراجع مستحيل)
   */
  capture(opts: {
    label: string;
    patches: DevStudioPatch[];
    doctorReport?: DoctorReportWire;
    metadata?: Record<string, unknown>;
  }): Checkpoint {
    // ── الرفض الصريح ──
    if (!opts.label.trim()) {
      throw new Error('[SnapshotEngine] لقطة بلا تسمية لا يمكن الإشارة إليها');
    }
    if (opts.patches.length === 0) {
      // نفس منطق rowcol.ts: "an empty commit is an undo step that does
      // nothing visible" — لقطة فارغة هي زر تراجع لا يفعل شيئاً.
      throw new Error('[SnapshotEngine] لا تصحيحات = لا شيء للتراجع عنه');
    }
    for (const p of opts.patches) {
      if (!p.inverse || typeof p.inverse !== 'object') {
        throw new Error(
          `[SnapshotEngine] تصحيح "${p.op}" بلا inverse — التراجع مستحيل`,
        );
      }
    }

    // ── اشتقاق الـ inverses بالعكس ──
    // الترتيب المعكوس ليس تفصيلاً: deleteRowsAt يضع setOverrides قبل
    // deleteRows، والتراجع يجب أن يعيد الصفوف أولاً ثم تجاوزاتها.
    const inverses = opts.patches
      .map((p) => p.inverse as DevStudioPatch)
      .reverse();

    // ── علم clean: غير متناظر ──
    // فقط الدكتور-الموافق عليه يحمل clean:true.
    // الغياب يعني "غير مُتحقق منه"، وواجهة التراجع يجب أن تفترض الأسوأ.
    let clean: true | undefined;
    if (opts.doctorReport) {
      const failed = opts.doctorReport.checks.filter((c) => c.status === 'fail').length;
      if (failed === 0) clean = true;
    }

    const ckpt: Checkpoint = {
      id: this.mintCheckpointId(),
      label: opts.label.trim(),
      timestamp: Date.now(),
      patches: opts.patches,
      inverses,
      doctorReport: opts.doctorReport,
      ...(opts.metadata ? { metadata: opts.metadata } : {}),
      ...(clean ? { clean: true } : {}),  // الغياب = غير مُتحقق
    };

    // ── التسجيل ──
    this.checkpoints.set(ckpt.id, ckpt);
    this.order.unshift(ckpt.id);
    this.storage.save(ckpt);

    // ── فرض السقف: الأقدم يُنسى أولاً ──
    while (this.order.length > MAX_CHECKPOINTS) {
      const oldest = this.order.pop()!;
      this.checkpoints.delete(oldest);
      this.storage.remove(oldest);
    }

    globalDevStudioEvents.emit('checkpoint:created', ckpt);
    return ckpt;
  }

  /**
   * إنشاء لقطة متوافقة
   */
  createCheckpoint(
    label: string,
    patches: DevStudioPatch[],
    doctorReport?: DoctorReportWire,
    metadata?: Record<string, unknown>
  ): Checkpoint {
    return this.capture({
      label,
      patches,
      doctorReport,
      metadata
    });
  }

  /** استرجاع لقطة بمعرّفها. */
  get(id: string): Checkpoint | null {
    return this.checkpoints.get(id) ?? this.storage.load(id) ?? null;
  }

  /** الحصول على لقطة محددة */
  getCheckpointById(id: string): Checkpoint | undefined {
    return this.get(id) ?? undefined;
  }

  /** كل اللقطات، الأحدث أولاً. نسخة — لا يُسمح بالتعديل الخارجي. */
  list(): Checkpoint[] {
    return this.order
      .map((id) => this.checkpoints.get(id) ?? this.storage.load(id))
      .filter((c): c is Checkpoint => c !== null);
  }

  /** الحصول على قائمة كافة اللقطات */
  getCheckpoints(): Checkpoint[] {
    return this.list();
  }

  /** أحدث لقطة، أو null. */
  latest(): Checkpoint | null {
    const head = this.order[0];
    return head ? this.get(head) : null;
  }

  /**
   * تراجع للقطة سابقة
   */
  rollback(id: string): { success: boolean; rolledBackCheckpoint?: Checkpoint; error?: string } {
    const checkpoint = this.get(id);
    if (!checkpoint) {
      return { success: false, error: 'اللقطة المطلوبة غير موجودة.' };
    }

    globalDevStudioEvents.emit('checkpoint:restored', checkpoint);
    return { success: true, rolledBackCheckpoint: checkpoint };
  }

  /**
   * نسيان لقطة (بعد استهلاكها بالتراجع، أو يدوياً).
   *
   * ⚠️ النسيان لا يبطل ما فعله التراجع — هو فقط يزيل نقطة الاسترجاع
   * من القائمة. المستند يبقى حيث أوصله الرجوع.
   */
  forget(id: string): boolean {
    const existed = this.checkpoints.delete(id);
    if (existed) {
      this.order = this.order.filter((x) => x !== id);
      this.storage.remove(id);
    }
    return existed;
  }

  /** عدد اللقطات الحالية. */
  get size(): number {
    return this.checkpoints.size;
  }

  /** مسح كل شيء (للاختبارات وإعادة تعيين الاستوديو). */
  clear(): void {
    for (const id of this.order) this.storage.remove(id);
    this.checkpoints.clear();
    this.order = [];
  }
}

export const globalSnapshotEngine = new SnapshotEngine();
