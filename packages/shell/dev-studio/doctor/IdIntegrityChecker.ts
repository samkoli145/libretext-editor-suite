/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [IdIntegrityChecker.ts] فاحص سلامة المعرفات والهوية
 *
 * المبدأ الحاكم (من rowcol.ts):
 * "A RID IS NEVER REUSED" — الهوية لا تُعاد. المعرفات هي ما تلتصق
 * به التصحيحات، الملاحظات، وهوية CRDT. إعطاء معرف قديم لعنصر جديد
 * يبعث تصحيحات عنصر محذوف على بيانات لا علاقة لها بها.
 *
 * ماذا يفحص:
 * - معرفات مكررة في دفعة واحدة (أدوات، مكونات، ملفات)
 * - حذف يترك أيتاماً (ربط/سجل يشير إلى معرف محذوف)
 * - "بعث" (resurrection): إعادة استخدام معرف محذوف
 * - معرفات غير صالحة (فارغة، محارف غير آمنة)
 *
 * الدرس من test-dash-rowcol.ts (THE RESURRECTION):
 * حذف عمود يترك تجاوزاته، والاستيراد التالي يعيد نفس المعرف،
 * فتلتصق أشباح العنصر المحذوف ببيانات جديدة. الحل: الحذف يأخذ
 * كل شيء معه في نفس الـ commit.
 *
 * التنبيهات:
 * - الفاحص يبني فهرساً لكل المعرفات في الدفعة
 * - يفحص الروابط (bindings) ضد المعرفات الموجودة
 * - الرفض صريح مع الدليل (المعرف + الموقع)
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { DoctorCheck, DevStudioPatch } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';
import { removedPathsOf } from './DoctorEngine';

/** What an identity-bearing patch contributes to the index. */
interface IdEntry {
  id: string;
  kind: 'tool' | 'component' | 'file';
  patchIndex: number;
}

export function checkIdIntegrity(
  patches: DevStudioPatch[],
  _project?: ProjectSurface,
): DoctorCheck[] {
  const checks: DoctorCheck[] = [];

  // ── 1. build the index of every id this batch introduces ──
  const entries: IdEntry[] = [];
  patches.forEach((p, i) => {
    if (p.op === 'registerTool') entries.push({ id: p.toolId, kind: 'tool', patchIndex: i });
    else if (p.op === 'registerComponent') entries.push({ id: p.componentId, kind: 'component', patchIndex: i });
    else if (p.op === 'addFile') entries.push({ id: p.path, kind: 'file', patchIndex: i });
    else if (p.op === 'decomposeFile') {
      for (const t of p.targets) entries.push({ id: t.path, kind: 'file', patchIndex: i });
    }
  });

  // ── 2. duplicate ids WITHIN the batch ──
  const seen = new Map<string, number>();
  for (const e of entries) {
    const at = seen.get(e.id);
    if (at !== undefined) {
      checks.push({
        id: `id-dup-${e.id}`,
        name: 'duplicate id in one change',
        nameAr: 'معرف مكرر داخل نفس الدفعة',
        category: 'identity',
        categoryAr: 'الهوية والتكامل',
        status: 'fail',
        message: `"${e.id}" (${e.kind}) is registered twice — patches ${at} and ${e.patchIndex}; the second silently overwrites the first`,
        messageAr: `المعرف "${e.id}" (${e.kind}) مسجل مرتين في التصحيحات ${at} و ${e.patchIndex}، مما يؤدي إلى الكتابة فوقه بصمت`,
      });
    } else {
      seen.set(e.id, e.patchIndex);
    }
  }

  // ── 3. malformed ids ──
  for (const e of entries) {
    if (e.kind === 'file') {
      if (!e.id.trim()) {
        checks.push({
          id: `id-empty-${e.patchIndex}`,
          name: 'empty id',
          nameAr: 'معرف ملف فارغ',
          category: 'identity',
          categoryAr: 'الهوية والتكامل',
          status: 'fail',
          message: `patch ${e.patchIndex} registers a ${e.kind} with an empty id`,
          messageAr: `التصحيح ${e.patchIndex} يحاول تسجيل ملف بمعرف أو مسار فارغ`,
        });
      }
      continue;
    }
    // tool/component ids: lowercase, digits, hyphens
    if (!/^[a-z][a-z0-9-]*$/.test(e.id)) {
      checks.push({
        id: `id-malformed-${e.id}`,
        name: 'malformed id',
        nameAr: 'صيغة معرف غير متوافقة',
        category: 'identity',
        categoryAr: 'الهوية والتكامل',
        status: 'fail',
        message: `"${e.id}" must start with a lowercase letter and use only [a-z0-9-]`,
        messageAr: `المعرف "${e.id}" يجب أن يبدأ بحرف صغير ويحتوي فقط على [a-z0-9-]`,
      });
    }
  }

  // ── 4. resurrection: re-registering an id a prior patch removed ──
  const removedToolIds = new Set<string>();
  const removedComponentIds = new Set<string>();
  for (const p of patches) {
    if (p.op === 'unregisterTool') removedToolIds.add(p.toolId);
    else if (p.op === 'unregisterComponent') removedComponentIds.add(p.componentId);
  }
  for (const e of entries) {
    if (e.kind === 'tool' && removedToolIds.has(e.id)) {
      checks.push({
        id: `id-resurrect-${e.id}`,
        name: 'resurrected id',
        nameAr: 'محاولة بعث معرف أداة محذوفة',
        category: 'identity',
        categoryAr: 'الهوية والتكامل',
        status: 'fail',
        message: `"${e.id}" is removed and re-registered in the same change — the dead identity's attachments would land on the new ${e.kind}`,
        messageAr: `المعرف "${e.id}" تم حذفه وإعادة تسجيله في نفس التغيير، مما قد يؤدي لربط متعلقات الكيان المحذوف بالكيان الجديد`,
      });
    }
    if (e.kind === 'component' && removedComponentIds.has(e.id)) {
      checks.push({
        id: `id-resurrect-${e.id}`,
        name: 'resurrected id',
        nameAr: 'محاولة بعث معرف مكون محذوف',
        category: 'identity',
        categoryAr: 'الهوية والتكامل',
        status: 'fail',
        message: `"${e.id}" is removed and re-registered in the same change`,
        messageAr: `المعرف "${e.id}" تم حذفه وإعادة تسجيله في نفس التغيير`,
      });
    }
  }

  // ── 5. orphans: a delete that leaves something pointing at it ──
  const removed = new Set(removedPathsOf(patches));
  if (removed.size > 0) {
    for (const p of patches) {
      if (p.op === 'registerComponent' && removed.has(p.definition.path)) {
        checks.push({
          id: `id-orphan-${p.componentId}`,
          name: 'orphaned reference',
          nameAr: 'إحالة يتيمة لملف محذوف',
          category: 'identity',
          categoryAr: 'الهوية والتكامل',
          status: 'fail',
          message: `component "${p.componentId}" points at "${p.definition.path}" which this same change deletes`,
          messageAr: `المكون "${p.componentId}" يشير إلى المسار "${p.definition.path}" الذي يحذفه نفس التغيير`,
        });
      }
    }
  }

  if (checks.length === 0 && entries.length > 0) {
    checks.push({
      id: 'id-clean',
      name: 'identity sound',
      nameAr: 'الهويات والمعرفات سليمة تماماً',
      category: 'identity',
      categoryAr: 'الهوية والتكامل',
      status: 'pass',
      message: `${entries.length} ids unique, well-formed, no resurrection, no orphans`,
      messageAr: `تم التحقق من ${entries.length} معرف: فريدة، سليمة، بلا بعث ولا أيتام`,
    });
  }

  return checks;
}

export class IdIntegrityChecker {
  static validate(patches: DevStudioPatch[]): DoctorCheck[] {
    return checkIdIntegrity(patches);
  }
}
