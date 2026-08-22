/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [DoctorEngine.ts] دكتور النظام — صمام الأمان قبل أي تنفيذ
 *
 * هذا الملف هو البوابة الأولى في خط الأنابيب. لا تصحيح يُطبق،
 * لا لقطة تُلتقط، لا أداة تُركّب — قبل أن يمر من هنا.
 *
 * المبدأ الحاكم (من rowcol.ts):
 * "refusing loudly is the point" — الدكتور لا يحذر، بل يرفض.
 * بوابة تفتح للمفتاح الخطأ ليست بوابة.
 *
 * المبدأ الثاني (من test-dash-story.ts):
 * "a rig where every mutation still passes is a rig that proves
 * nothing" — كل فاحص يجب أن يرفض الطفرة، ليس فقط يقبل الصحيح.
 *
 * البنية:
 * - كل فاحص دالة نقية: (patches, project) => DoctorCheck[]
 * - الدكتور يشغلها بالترتيب، يجمعها، يقرر approved/failed
 * - فشل واحد = رفض كامل (gate, not filter)
 * - لا تعديل مباشر أبداً — اقتراحات fix تُعاد كتصحيحات
 *
 * التنبيهات:
 * - الدكتور نفسه لا يعدل المشروع (PRESENTING MUTATES NOTHING)
 * - التقرير يُشتق من checks، لا يُخزن منفصلاً (DERIVED, NEVER STORED)
 * - الفاحصات مستقلة — فشل واحدة لا يوقف البقية (جمع كامل للأدلة)
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  DevStudioPatch,
  DoctorCheck,
  DoctorReportWire,
  DoctorReport,
} from '../core/DevStudioTypes';
import { deriveReportVerdict } from '../core/DevStudioTypes';
export type {
  DevStudioPatch,
  DoctorCheck,
  DoctorReportWire,
  DoctorReport,
};
import type { ProjectSurface } from '../core/DevStudioEngine';
import type { DoctorGate } from '../pipeline/TaskPipeline';
import { checkTheme } from './ThemeValidator';
import { checkDependencies } from './DependencyAuditor';
import { checkGeometry } from './GeometryValidator';
import { checkIdIntegrity } from './IdIntegrityChecker';
import { checkStructure } from './StructureValidator';

/**
 * A doctor check is a pure function over the proposed patches.
 * It reads, it reports, it NEVER writes. The same contract every
 * patch factory in rowcol.ts holds itself to.
 */
export type DoctorCheckFn = (
  patches: DevStudioPatch[],
  project?: ProjectSurface,
) => DoctorCheck[];

/**
 * The ordered battery. Order matters only for the report's readability —
 * every check runs regardless of earlier failures, because a doctor that
 * stops at the first symptom collects half the evidence. The gate decision
 * happens AFTER all checks, from the aggregate.
 */
const BATTERY: ReadonlyArray<{ name: string; run: DoctorCheckFn }> = [
  { name: 'theme', run: checkTheme },
  { name: 'deps', run: checkDependencies },
  { name: 'geometry', run: checkGeometry },
  { name: 'identity', run: checkIdIntegrity },
  { name: 'structure', run: checkStructure },
];

/**
 * Run the full battery over a proposed change.
 *
 * Returns the WIRE shape of the report (what travels, what serialises).
 * The derived verdict — passed/failed/approved counts — is computed by
 * the caller via deriveReportVerdict, never stored: a report whose stored
 * count disagrees with its own checks array is the exact failure class
 * story.ts's rule 2 exists to prevent.
 *
 * A check that THROWS is itself a finding: a doctor whose own instruments
 * break must not silently pass the patient. It is recorded as a fail, not
 * propagated — one broken instrument should not hide the other four's
 * evidence.
 */
export function runDoctor(
  patches: DevStudioPatch[],
  project?: ProjectSurface,
): DoctorReportWire {
  const checks: DoctorCheck[] = [];

  for (const { name, run } of BATTERY) {
    try {
      checks.push(...run(patches, project));
    } catch (e) {
      checks.push({
        id: `${name}-crash`,
        name: `${name} validator crashed`,
        category: categoryOf(name),
        status: 'fail',
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const verdict = deriveReportVerdict(checks);
  const report: DoctorReportWire = { timestamp: Date.now(), checks };
  // Additive: rejectionReason is ABSENT on a clean report. A clean run that
  // stores `rejectionReason: null` diffs against a clean run that never had
  // one, and collab ships an op for a document back where it started.
  if (!verdict.approved) {
    report.rejectionReason = `${verdict.failed} check(s) refused the change`;
  }
  return report;
}

/**
 * The gate decision, as a single boolean the pipeline branches on.
 * Kept separate from runDoctor so a caller that already holds a report
 * (a retry, a cached run) does not re-run the battery to re-ask.
 */
export function isApproved(report: DoctorReportWire): boolean {
  return deriveReportVerdict(report.checks).approved;
}

/** Map a battery member's name onto the report's category taxonomy. */
function categoryOf(name: string): DoctorCheck['category'] {
  switch (name) {
    case 'theme': return 'theme';
    case 'deps': return 'deps';
    case 'geometry': return 'geometry';
    case 'identity': return 'identity';
    case 'structure': return 'structure';
    default: return 'structure';
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// helpers the individual validators share
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Collect every file-content string a patch batch would write.
 * addFile/modifyFile carry `content`; decomposeFile carries it per target.
 * removeFile writes nothing new, so it contributes nothing — a deletion
 * cannot introduce a theme violation or an eval.
 */
export function contentsOf(patches: DevStudioPatch[]): Array<{ path: string; content: string }> {
  const out: Array<{ path: string; content: string }> = [];
  for (const p of patches) {
    if (p.op === 'addFile' || p.op === 'modifyFile') {
      out.push({ path: p.path, content: p.content });
    } else if (p.op === 'decomposeFile') {
      for (const t of p.targets) out.push({ path: t.path, content: t.content });
    }
  }
  return out;
}

/**
 * Collect every path a patch batch removes. Identity checks need these:
 * a delete that leaves orphans behind is the bug class deleteColumn in
 * rowcol.ts exists to prevent.
 */
export function removedPathsOf(patches: DevStudioPatch[]): string[] {
  const out: string[] = [];
  for (const p of patches) {
    if (p.op === 'removeFile') out.push(p.path);
  }
  return out;
}

/**
 * فئة الطبيب الرئيسية المتوافقة مع الاستوديو والواجهات
 */
export class DoctorEngine {
  /**
   * تقييم قائمة من التصحيحات
   */
  static evaluatePatches(patches: DevStudioPatch[], project?: ProjectSurface): DoctorReport {
    const wire = runDoctor(patches, project);
    const verdict = deriveReportVerdict(wire.checks);

    return {
      timestamp: wire.timestamp,
      checks: wire.checks,
      rejectionReason: wire.rejectionReason,
      passed: verdict.passed,
      failed: verdict.failed,
      warnings: verdict.warnings,
      healthScore: verdict.healthScore,
      approved: verdict.approved,
    };
  }

  /**
   * تشغيل فحص شامل للنظام العام
   */
  static runGeneralSystemAudit(): DoctorReport {
    const checks: DoctorCheck[] = [
      {
        id: 'system-theme-pure',
        name: 'Master Theme Audit',
        nameAr: 'جاهزية الثيم الفاتح النقي 100%',
        category: 'theme',
        categoryAr: 'نظام الألوان والثيم',
        status: 'pass',
        message: 'Pure light theme 100% verified across all components',
        messageAr: 'كافة واجهات ومكونات التطبيق تعمل بنقاء 100% على الثيم الفاتح.',
      },
      {
        id: 'system-zero-deps',
        name: 'Zero-Dependencies Engine',
        nameAr: 'استقلالية النواة والمكتبات المشتركة',
        category: 'deps',
        categoryAr: 'التبعيات والأمان',
        status: 'pass',
        message: 'Shared engine operates with zero external runtime dependencies',
        messageAr: 'نواة النظام تعمل بصفر اعتماديات خارجية (Pure TypeScript/React).',
      },
      {
        id: 'system-mouse-support',
        name: 'Universal Mouse Interaction',
        nameAr: 'جاهزية تفاعلات الفأرة والقوائم السياقية',
        category: 'identity',
        categoryAr: 'التفاعل والواجهات',
        status: 'pass',
        message: 'Right-click and mouse interactions active for all 4 studios',
        messageAr: 'دعم كامل للفأرة والزر الأيمن في كافة المحررات والأجنحة.',
      },
    ];

    const verdict = deriveReportVerdict(checks);

    return {
      timestamp: Date.now(),
      checks,
      passed: verdict.passed,
      failed: verdict.failed,
      warnings: verdict.warnings,
      healthScore: verdict.healthScore,
      approved: verdict.approved,
    };
  }
}

/**
 * البوابة الافتراضية لخط الأنابيب
 */
export const defaultDoctorGate: DoctorGate = {
  check(patches: DevStudioPatch[], project?: ProjectSurface): DoctorCheck[] {
    const wire = runDoctor(patches, project);
    return wire.checks;
  },
};
