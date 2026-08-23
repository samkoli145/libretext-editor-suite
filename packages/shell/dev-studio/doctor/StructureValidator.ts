/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [StructureValidator.ts] فاحص البنية والترويسة الإلزامية
 *
 * الميثاق: كل ملف يجب أن يحمل:
 * 1. ملخص توجيهي بالعربية في رأس الملف
 * 2. الحقوق محفوظة ©️
 * 3. التنبيهات المعمارية
 *
 * أيضاً يفحص قاعدة "الحقول المضافة" (من story.ts):
 * - الغياب يعني "لا" — لا تخزين [] أو "" أو undefined
 * - الحذف يُهجى كـ drop، ليس {key: undefined}
 *
 * المبدأ (من test-dash-panels.ts):
 * "a setting that will not switch off" — حقل مضاف يُخزن فارغاً
 * يترك الملف متغيراً بعد round-trip، وكل قارئ يعمل diff له.
 *
 * التنبيهات:
 * - الفاحص يبحث عن علامات الترويسة في أول N سطر
 * - الرفض يحمل ما ينقص تحديداً
 * - فحص drop-vs-undefined على تصحيحات updateRegistry
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { DoctorCheck, DevStudioPatch } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';
import { contentsOf } from './DoctorEngine';

/** How far into a file the header must appear. */
const HEADER_WINDOW = 40;

/**
 * The header's load-bearing marks. Each is checked independently so the
 * report names exactly what is missing — "no header" is not useful, but
 * "header present, copyright line missing" tells the author the one line
 * to add.
 */
const HEADER_MARKS: ReadonlyArray<{ re: RegExp; name: string; nameAr: string }> = [
  {
    re: /ملخص توجيهي/,
    name: 'Arabic guiding summary (ملخص توجيهي)',
    nameAr: 'كتلة الملخص التوجيهي بالعربية',
  },
  { re: /الحقوق محفوظة|©/, name: 'copyright line (الحقوق محفوظة)', nameAr: 'سطر حفظ الحقوق ©️' },
];

/** File extensions that must carry the header. */
const CODE_EXT = /\.(ts|tsx|js|jsx|css)$/;

export function checkStructure(
  patches: DevStudioPatch[],
  _project?: ProjectSurface,
): DoctorCheck[] {
  const checks: DoctorCheck[] = [];

  // ── 1. mandatory header on every code file ──
  for (const { path, content } of contentsOf(patches)) {
    if (!CODE_EXT.test(path)) continue;

    const head = content.split('\n').slice(0, HEADER_WINDOW).join('\n');
    for (const { re, name, nameAr } of HEADER_MARKS) {
      if (!re.test(head)) {
        checks.push({
          id: `struct-header-${path}-${name}`,
          name: 'missing mandatory header element',
          nameAr: 'عنصر ترويسة إلزامي مفقود',
          category: 'structure',
          categoryAr: 'الهيكلية والتوثيق',
          status: 'fail',
          message: `${path} — lacks ${name} within the first ${HEADER_WINDOW} lines`,
          messageAr: `${path} — يفتقر إلى ${nameAr} في أول ${HEADER_WINDOW} سطراً من الملف`,
        });
      }
    }
  }

  // ── 2. additive-field discipline on registry updates ──
  for (const p of patches) {
    if (p.op !== 'updateRegistry') continue;

    for (const [k, v] of Object.entries(p.props)) {
      if (v === undefined) {
        checks.push({
          id: `struct-undef-${p.registry}-${k}`,
          name: 'delete spelled as undefined',
          nameAr: 'محاولة حذف باستخدام undefined',
          category: 'structure',
          categoryAr: 'الهيكلية والتوثيق',
          status: 'fail',
          message: `updateRegistry(${p.registry}): to remove "${k}" list it in drop, not props — undefined evaporates in JSON`,
          messageAr: `تحديث السجل (${p.registry}): لحذف المفتاح "${k}" ضعه في قائمة drop وليس props لأن undefined تتلاشى في JSON`,
        });
      }
      if (v === '' || (Array.isArray(v) && v.length === 0)) {
        checks.push({
          id: `struct-empty-${p.registry}-${k}`,
          name: 'empty additive value stored',
          nameAr: 'تخزين قيمة فارغة زائدة',
          category: 'structure',
          categoryAr: 'الهيكلية والتوثيق',
          status: 'warn',
          message: `updateRegistry(${p.registry}): "${k}" holds an empty value — an additive field means "none" by being absent`,
          messageAr: `تحديث السجل (${p.registry}): المفتاح "${k}" يحمل قيمة فارغة — الحقول المضافة تعبر عن العدم بالغياب`,
        });
      }
    }

    // a key both set and dropped is an intent travelling two ways
    if (p.drop) {
      for (const k of p.drop) {
        if (k in p.props) {
          checks.push({
            id: `struct-both-${p.registry}-${k}`,
            name: 'key set and dropped in one patch',
            nameAr: 'تعيين وحذف نفس المفتاح في تصحيح واحد',
            category: 'structure',
            categoryAr: 'الهيكلية والتوثيق',
            status: 'fail',
            message: `updateRegistry(${p.registry}): "${k}" appears in both props and drop`,
            messageAr: `تحديث السجل (${p.registry}): المفتاح "${k}" موجود في props و drop في نفس الوقت`,
          });
        }
      }
    }
  }

  if (checks.length === 0 && contentsOf(patches).length > 0) {
    checks.push({
      id: 'struct-clean',
      name: 'structure sound',
      nameAr: 'البنية والتوثيق سليم',
      category: 'structure',
      categoryAr: 'الهيكلية والتوثيق',
      status: 'pass',
      message: 'headers present, additive fields disciplined',
      messageAr: 'الترويسات الإلزامية موجودة والحقول المضافة منضبطة معمارياً',
    });
  }

  return checks;
}

export class StructureValidator {
  static validate(content: string, filePath: string = 'inline-code'): DoctorCheck {
    const patches: DevStudioPatch[] = [
      {
        op: 'modifyFile',
        path: filePath,
        content,
        inverse: { op: 'modifyFile', path: filePath, content },
      },
    ];
    const checks = checkStructure(patches);
    return (
      checks.find((c) => c.status === 'fail') ||
      checks[0] || {
        id: `struct-check-${filePath}`,
        name: 'Structure & Documentation Audit',
        nameAr: 'تدقيق البنية والتوثيق',
        category: 'structure',
        categoryAr: 'الهيكلية والتوثيق',
        status: 'pass',
        message: `File [${filePath}] complies with structural and documentation standards.`,
        messageAr: `الملف [${filePath}] مطابق لمعايير البنية والترويسة التوجيهية الإلزامية.`,
      }
    );
  }
}
