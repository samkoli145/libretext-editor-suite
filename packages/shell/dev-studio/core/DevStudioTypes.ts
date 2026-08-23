/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: الأنواع والعقود الأساسية الصارمة لاستوديو المطور (The Four Rules Contract)
 * 🏛️ الدور: نواة معزولة لتعريف التصحيحات (DevStudioPatch)، اللقطات، والفئات الـ 23
 * 📥 المستهلك: DevStudioEngine, DoctorEngine, SnapshotEngine وكافة محركات الاستوديو
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    1. EVERY EDIT IS A PATCH: كل تعديل يحمل معكوسه الصارم (inverse) لضمان التراجع Byte-Identical.
 *    2. ADDITIVE FIELDS (ABSENT MEANS NO): غياب الحقل يعني "لا"؛ منع تخزين error: null أو undefined.
 *    3. DERIVED STATE IS NEVER STORED: الحسابات الإحصائية تُشتق لحظياً ولا تُحفظ في الـ Wire shape.
 *    4. VIEW STATE ≠ DOCUMENT STATE: حالة الواجهة مستقلة تماماً عن حالة وثيقة المشروع.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع أي مسارات مطلقة أو خروج من مجلد المشروع (Path Traversal Prevention).
 *    2. حذف الحقول يتم فقط عبر drop: ['key'] وليس بتمرير undefined.
 *    3. الثيم الفاتح النقي 100% بدون أي درجات داكنة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards شاملة (isDevStudioPatch, isValidStudioPath, isValidToolId).
 *    - دالة اشتقاق التقرير deriveReportVerdict تضمن عدم تضارب الإحصاءات مع مصفوفة الفحوصات.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// File Header Contract
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface FileHeader {
  /** الملخص التوجيهي — what the file is and why it exists */
  summaryAr: string;
  /** دور الملف في البنية المعمارية */
  roleAr?: string;
  /** المستهلكون الفعليون */
  consumersAr?: string;
  /** النمط المعماري المبتكر */
  patternAr?: string;
  /** تنبيهات معمارية ونقاط الخطر */
  warnings?: string[];
  gotchasAr?: string[];
  /** توجيهات الخوارزميات والبرمجة الدفاعية */
  algorithmNotes?: string;
  defensiveAr?: string[];
  /** ©️ جميع الحقوق محفوظة ©️ - 2026 */
  copyrightYear?: number;
}

export const COPYRIGHT_YEAR = 2026;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Editors and Categories (23-Category Matrix)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type EditorTarget = 'canvas' | 'ui' | 'richtext' | 'pdf' | 'all';

export type ComponentCategory =
  | 'selection'
  | 'drawing'
  | 'text'
  | 'shape'
  | 'image'
  | 'chart'
  | 'table'
  | 'layout'
  | 'align'
  | 'transform'
  | 'color'
  | 'effect'
  | 'animation'
  | 'interaction'
  | 'navigation'
  | 'view'
  | 'export'
  | 'import'
  | 'debug'
  | 'test'
  | 'math'
  | 'utility'
  | 'custom';

export type ToolCategory = ComponentCategory;

export interface ToolDefinition {
  id: string;
  name: string;
  titleAr?: string;
  titleEn?: string;
  icon: string;
  category: ComponentCategory;
  categoryAr?: string;
  editors: EditorTarget[];
  actionId: string;
  shortcut?: string;
  contextMenu?: { label: string; icon?: string };
  description?: string;
  descriptionAr?: string;
  keywords?: string[];
}

export interface ComponentDefinition {
  id: string;
  name: string;
  nameAr?: string;
  category: ComponentCategory;
  categoryAr?: string;
  path: string;
  description?: string;
  props?: Array<{ name: string; type: string; required?: boolean; description?: string }>;
  defaultProps?: Record<string, unknown>;
  tags?: string[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Patches — The Universal Currency (Rule 1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type DevStudioPatch =
  | {
      op: 'addFile';
      path: string;
      content: string;
      header?: FileHeader;
      inverse: { op: 'removeFile'; path: string };
    }
  | {
      op: 'removeFile';
      path: string;
      content: string;
      header?: FileHeader;
      inverse: { op: 'addFile'; path: string; content: string; header?: FileHeader };
    }
  | {
      op: 'modifyFile';
      path: string;
      content: string;
      oldContent?: string;
      header?: FileHeader;
      inverse: {
        op: 'modifyFile';
        path: string;
        content: string;
        oldContent?: string;
        header?: FileHeader;
      };
    }
  | {
      op: 'decomposeFile';
      sourcePath: string;
      targets: Array<{ path: string; content: string; header?: FileHeader }>;
      inverse: { op: 'recomposeFile'; sourcePath: string; targetPaths: string[] };
    }
  | {
      op: 'recomposeFile';
      sourcePath: string;
      targetPaths: string[];
      inverse: {
        op: 'decomposeFile';
        sourcePath: string;
        targets: Array<{ path: string; content: string; header?: FileHeader }>;
      };
    }
  | {
      op: 'registerTool';
      toolId: string;
      definition: ToolDefinition;
      inverse: { op: 'unregisterTool'; toolId: string; definition?: ToolDefinition };
    }
  | {
      op: 'unregisterTool';
      toolId: string;
      definition: ToolDefinition;
      inverse: { op: 'registerTool'; toolId: string; definition: ToolDefinition };
    }
  | {
      op: 'registerComponent';
      componentId: string;
      definition: ComponentDefinition;
      inverse: { op: 'unregisterComponent'; componentId: string; definition?: ComponentDefinition };
    }
  | {
      op: 'unregisterComponent';
      componentId: string;
      definition: ComponentDefinition;
      inverse: { op: 'registerComponent'; componentId: string; definition: ComponentDefinition };
    }
  | {
      op: 'updateRegistry';
      registry: 'components' | 'algorithms' | 'inventory';
      props: Record<string, unknown>;
      drop?: string[];
      inverse: {
        op: 'updateRegistry';
        registry: 'components' | 'algorithms' | 'inventory';
        props: Record<string, unknown>;
        drop?: string[];
      };
    };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Doctor Quality Gate
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type DoctorCategory =
  | 'theme' // pure light theme, no dark surfaces
  | 'deps' // zero external dependencies, no eval
  | 'geometry' // nested radius rule, dimension sanity
  | 'identity' // unique ids, no orphans
  | 'structure' // mandatory header, copyright, Arabic summary
  | 'additivity' // absent-means-no
  | 'wire'; // deletion spelled as drop, never undefined

export type DoctorStatus = 'pass' | 'fail' | 'warn';

export interface DoctorCheck {
  id: string;
  name: string;
  nameAr?: string;
  category: DoctorCategory;
  categoryAr?: string;
  status: DoctorStatus;
  message: string;
  messageAr?: string;
  fix?: DevStudioPatch;
  fixPatch?: DevStudioPatch;
}

export interface DoctorReportWire {
  timestamp: number;
  checks: DoctorCheck[];
  rejectionReason?: string;
}

export interface DoctorReport extends DoctorReportWire {
  readonly passed: number;
  readonly failed: number;
  readonly warnings: number;
  readonly approved: boolean;
  readonly healthScore?: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Checkpoints (Rollback Mechanism)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Checkpoint {
  id: string;
  label: string;
  timestamp: number;
  patches: DevStudioPatch[];
  inverses: DevStudioPatch[];
  doctorReport: DoctorReportWire;
  clean?: true;
  metadata?: Record<string, unknown>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tasks (Unit of Work Lifecycle)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type DevTaskStatus =
  | 'created'
  | 'validating'
  | 'checkpointed'
  | 'executing'
  | 'testing'
  | 'committed'
  | 'failed'
  | 'rolled-back';

export type DevTaskType =
  'add-tool' | 'add-component' | 'decompose' | 'modify' | 'organize' | 'custom';

export interface DevTask {
  id: string;
  type: DevTaskType;
  label: string;
  status: DevTaskStatus;
  patches: DevStudioPatch[];
  checkpointId?: string;
  doctorReport?: DoctorReportWire;
  error?: string;
  createdAt?: number;
  completedAt?: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Events
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type DevStudioEvent =
  | { type: 'taskCreated'; taskId: string }
  | { type: 'taskStatus'; taskId: string; status: DevTaskStatus }
  | { type: 'doctorReport'; taskId: string; report: DoctorReportWire }
  | { type: 'checkpointTaken'; checkpointId: string }
  | { type: 'rollback'; checkpointId: string }
  | { type: 'registryChanged'; registry: 'components' | 'algorithms' | 'inventory' };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Pure Type Guards & Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function isDevStudioPatch(v: unknown): v is DevStudioPatch {
  if (!v || typeof v !== 'object') return false;
  const p = v as Record<string, unknown>;
  if (typeof p.op !== 'string') return false;
  if (!('inverse' in p) || !p.inverse || typeof p.inverse !== 'object') return false;
  return true;
}

export function isValidStudioPath(path: string): boolean {
  if (typeof path !== 'string' || path.length === 0) return false;
  if (path.startsWith('/') || path.startsWith('\\')) return false;
  if (path.includes('..')) return false;
  if (/^[A-Za-z]:/.test(path)) return false;
  return true;
}

export function isValidToolId(id: string): boolean {
  return typeof id === 'string' && /^[a-z][a-z0-9-]*$/.test(id) && id.length <= 64;
}

export function deriveReportVerdict(checks: DoctorCheck[]): {
  passed: number;
  failed: number;
  warnings: number;
  approved: boolean;
  healthScore: number;
} {
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const c of checks) {
    if (c.status === 'pass') passed++;
    else if (c.status === 'fail') failed++;
    else warnings++;
  }

  const total = checks.length;
  const healthScore = total > 0 ? Math.round(((passed + warnings * 0.5) / total) * 100) : 100;

  return {
    passed,
    failed,
    warnings,
    approved: failed === 0,
    healthScore,
  };
}
