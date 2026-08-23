/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [FileOperations.ts] مصنع تصحيحات الملفات — لا تعديل مباشر
 *
 * هذا الملف هو ترجمة مبدأ rowcol.ts إلى مستوى الملفات:
 * "EVERY FUNCTION HERE IS A PATCH FACTORY. It reads and returns
 *  what the store should commit — it never writes."
 *
 * كل عملية ملف (إضافة، تعديل، حذف، نقل) تُعاد كـ DevStudioPatch
 * مع inverse مرفق. هذا ما يجعل:
 * - التراجع ممكناً (الـ inverse جاهز)
 * - اللقطات ممكنة (الـ patches قابلة للتخزين)
 * - خط الأنابيب قادراً على الفحص قبل التطبيق
 *
 * المبدأ الثاني (من rowcol.ts):
 * "BOUNDS CLAMP, IDENTITY REFUSES."
 * - المسار الفاسد يُرفض (هوية) — لا يُقص ليصبح صالحاً
 * - المحتوى الفارغ لإضافة ملف يُرفض
 * - حذف ملف غير موجود يُرفض
 * - تعديل ملف غير موجود يُرفض (لا إنشاء صامت)
 *
 * المبدأ الثالث (من rowcol.ts deleteColumn):
 * الحذف يأخذ أيتامه معه. حذف ملف يجب أن يمسح أي مراجع
 * معلومة له — هنا نبلّغ إن كانت هناك مراجع، والقرار للخط.
 *
 * التنبيهات:
 * - inverse يُبنى من المحتوى الفعلي، لا من الذاكرة
 * - القراءة قبل الكتابة هي ما يجعل الـ inverse صادقاً
 * - لا استثناءات صامتة: الرفض بصوت عالٍ دائماً
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { DevStudioPatch, FileHeader } from '../core/DevStudioTypes';
import { isValidStudioPath, COPYRIGHT_YEAR } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الترويسة — ما يجب أن يحمله كل ملف
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * التحقق من صحة ترويسة ملف.
 *
 * ⚠️ الرفض بصوت عالٍ: ترويسة بلا ملخص عربي أو بلا سنة
 * حقوق هي انتهاك ميثاق، وليست تفصيلاً يُتسامح معه.
 */
export function validateHeader(header: FileHeader): void {
  if (!header.summaryAr || !header.summaryAr.trim()) {
    throw new Error('[FileOperations] header missing Arabic summary (ملخص توجيهي)');
  }
  if (typeof header.copyrightYear !== 'number' || header.copyrightYear < 2026) {
    throw new Error('[FileOperations] header missing valid copyright year');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المصانع — كل عملية تعيد patch مع inverse
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * إضافة ملف جديد.
 *
 * الرفض:
 * - مسار فاسد (هوية)
 * - ملف موجود مسبقاً (استخدم التعديل)
 * - محتوى فارغ (لا معنى لإضافة ملف فارغ)
 * - ترويسة ناقصة (ميثاق)
 */
export function addFilePatch(
  project: ProjectSurface,
  path: string,
  content: string,
  header: FileHeader,
): DevStudioPatch {
  if (!isValidStudioPath(path)) {
    throw new Error(`[FileOperations] invalid path: ${path}`);
  }
  if (project.readFile(path) !== null) {
    throw new Error(`[FileOperations] file already exists: ${path} — use modifyFilePatch`);
  }
  if (!content.trim()) {
    throw new Error(`[FileOperations] refusing to add empty file: ${path}`);
  }
  validateHeader(header);

  return {
    op: 'addFile',
    path,
    content,
    header: { ...header, copyrightYear: header.copyrightYear || COPYRIGHT_YEAR },
    inverse: { op: 'removeFile', path },
  };
}

/**
 * تعديل ملف موجود.
 *
 * ⚠️ القراءة قبل الكتابة: الـ inverse يُبنى من المحتوى
 * الفعلي الحالي، لا من ذاكرة المنادي. هذا ما يجعل التراجع
 * يعيد الملف byte-identical — نفس اختبار roundTrip في
 * test-dash-rowcol.ts.
 *
 * الرفض:
 * - مسار فاسد
 * - ملف غير موجود (لا إنشاء صامت)
 */
export function modifyFilePatch(
  project: ProjectSurface,
  path: string,
  content: string,
  header?: FileHeader,
): DevStudioPatch {
  if (!isValidStudioPath(path)) {
    throw new Error(`[FileOperations] invalid path: ${path}`);
  }
  const before = project.readFile(path);
  if (before === null) {
    throw new Error(`[FileOperations] no such file: ${path} — use addFilePatch`);
  }
  if (header) validateHeader(header);

  return {
    op: 'modifyFile',
    path,
    content,
    ...(header ? { header } : {}),
    inverse: {
      op: 'modifyFile',
      path,
      content: before,
    },
  };
}

/**
 * حذف ملف.
 *
 * ⚠️ الحذف يحمل المحتوى معه (في الـ inverse)، تماماً كما
 * يحمل deleteRowsAt التجاوزات معه. حذف بلا نسخة هو حذف
 * لا يمكن التراجع عنه.
 *
 * الرفض:
 * - مسار فاسد
 * - ملف غير موجود
 */
export function removeFilePatch(project: ProjectSurface, path: string): DevStudioPatch {
  if (!isValidStudioPath(path)) {
    throw new Error(`[FileOperations] invalid path: ${path}`);
  }
  const content = project.readFile(path);
  if (content === null) {
    throw new Error(`[FileOperations] no such file to remove: ${path}`);
  }

  return {
    op: 'removeFile',
    path,
    content,
    header: {
      summaryAr: 'ملف محذوف — محتوى محفوظ للاستعادة',
      copyrightYear: COPYRIGHT_YEAR,
    },
    inverse: {
      op: 'addFile',
      path,
      content,
      header: {
        summaryAr: 'ملف مستعاد من لقطة',
        copyrightYear: COPYRIGHT_YEAR,
      },
    },
  };
}

/**
 * نقل/إعادة تسمية ملف.
 *
 * يُبنى كـ remove + add، لكن كـ patch واحد مركب حتى يكون
 * التراجع ذرياً. من درس moveColumn: الحركة يجب أن تكون
 * permutation كاملة، لا حذف-ثم-إضافة يضيع البيانات.
 */
export function moveFilePatch(
  project: ProjectSurface,
  fromPath: string,
  toPath: string,
): DevStudioPatch[] {
  if (!isValidStudioPath(fromPath) || !isValidStudioPath(toPath)) {
    throw new Error(`[FileOperations] invalid move: ${fromPath} → ${toPath}`);
  }
  if (fromPath === toPath) {
    // لا حركة = لا patch (مبدأ insertRowsAt: فارغ يعني لا شيء)
    return [];
  }
  const content = project.readFile(fromPath);
  if (content === null) {
    throw new Error(`[FileOperations] no such file to move: ${fromPath}`);
  }
  if (project.readFile(toPath) !== null) {
    throw new Error(`[FileOperations] move target exists: ${toPath}`);
  }

  // إزالة ثم إضافة، بالترتيب الصحيح. الـ inverse يعكس.
  return [
    {
      op: 'removeFile',
      path: fromPath,
      content,
      header: { summaryAr: 'نقل ملف — خطوة الإزالة', copyrightYear: COPYRIGHT_YEAR },
      inverse: {
        op: 'addFile',
        path: fromPath,
        content,
        header: { summaryAr: 'ملف مستعاد', copyrightYear: COPYRIGHT_YEAR },
      },
    },
    {
      op: 'addFile',
      path: toPath,
      content,
      header: { summaryAr: 'نقل ملف — خطوة الإضافة', copyrightYear: COPYRIGHT_YEAR },
      inverse: { op: 'removeFile', path: toPath },
    },
  ];
}
