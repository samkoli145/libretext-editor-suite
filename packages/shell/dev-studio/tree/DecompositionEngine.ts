/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [DecompositionEngine.ts] محرك تفكيك الملفات الضخمة
 *
 * هذا الملف يجيب: "متى وكيف نفكك ملفاً تجاوز 500 سطر؟"
 *
 * الهدف (من الميثاق): تقليص >70% من حجم كل ملف ضخم،
 * بنمط الشرائح الرأسية — كل قطعة مفصولة يجب أن تكون
 * ذات معنى بذاتها، قادرة على الاختبار، ومرتبطة بمستهلك.
 *
 * المبدأ الحاكم (من cellformula.ts):
 * "ORDER IS THE CORRECTNESS PROBLEM, not evaluation."
 * التفكيك ليس قطعاً عشوائياً — هو إيجاد الحدود الطبيعية:
 * أقسام، أصناف، دوال. القطع في منتصف دالة ينتج كسراً
 * لا يترجم، تماماً كما أن تقييم خلية قبل تبعياتها
 * يعطي رقماً قديماً يبدو صحيحاً.
 *
 * المبدأ الثاني (من rowcol.ts):
 * التفكيك يُعاد كـ patch مركب (decomposeFile) مع inverse
 * (recomposeFile). التراجع يعيد الملف الأصلي byte-identical.
 *
 * التنبيهات:
 * - لا نفكك دون وجود حدود طبيعية كافية
 * - كل قطعة target تحمل ترويسة كاملة (ميثاق)
 * - الملف المصدر لا يُحذف إلا بعد نجاح كل الأهداف
 * - إن لم نجد نقاط فصل كافية، نرفض (لا تقسيم قسري)
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { DevStudioPatch, FileHeader } from '../core/DevStudioTypes';
import { COPYRIGHT_YEAR } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';
import { LARGE_FILE_LINES } from './ProjectTreeModel';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الأنواع
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** نقطة فصل مرشحة في الملف. */
export interface SplitPoint {
  /** رقم السطر (0-based) حيث يبدأ مقطع جديد */
  line: number;
  /** اسم المقطع المقترح (من العنوان/الصنف/الدالة) */
  name: string;
  /** نوع الحد: قسم، صنف، دالة */
  kind: 'section' | 'class' | 'function' | 'export';
}

/** نتيجة تحليل ملف للتفكيك. */
export interface DecompositionPlan {
  sourcePath: string;
  lines: number;
  /** نقاط الفصل المرشحة، مرتبة */
  splitPoints: SplitPoint[];
  /** هل التفكيك مجدٍ (نقاط كافية)؟ */
  feasible: boolean;
  /** السبب إن لم يكن مجدياً */
  reason?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الكشف — إيجاد الحدود الطبيعية
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * أنماط الحدود الطبيعية.
 *
 * ⚠️ هذه أنماط تقريبية (heuristic)، ليست parser كامل.
 * الهدف اقتراح نقاط، والمستخدم/الخط يقرر. هذا تواضع
 * مقصود — نفس تواضع autoFitWidth في rowcol.ts الذي يقول
 * "THIS IS AN ESTIMATE".
 */
const SECTION_RE = /^\/\/\s*[─━═]{3,}/;
const CLASS_RE = /^(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/;
const FUNCTION_RE = /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/;
const EXPORT_RE = /^export\s+(?:const|let|var|interface|type|enum)\s+(\w+)/;

/**
 * تحليل ملف لإيجاد نقاط الفصل المرشحة.
 *
 * الخوارزمية:
 * 1. مسح الأسطر بحثاً عن أنماط الحدود
 * 2. جمع النقاط مع أسمائها وأنواعها
 * 3. تحديد الجدوى: هل النقاط كافية لقطع ذات معنى؟
 *
 * ⚠️ الجدوى تتطلب نقطتين على الأقل — نقطة واحدة تعني
 * قطعتين إحداهما قد تكون تافهة. ونرفض ملفاً لا حدود فيه.
 */
export function analyzeForDecomposition(project: ProjectSurface, path: string): DecompositionPlan {
  const content = project.readFile(path);
  if (content === null) {
    return {
      sourcePath: path,
      lines: 0,
      splitPoints: [],
      feasible: false,
      reason: 'file not found',
    };
  }

  const lines = content.split('\n');
  const splitPoints: SplitPoint[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const sec = SECTION_RE.exec(line);
    if (sec) {
      // اسم القسم من السطر التالي إن وُجد
      const name = (lines[i + 1] ?? '').replace(/^\/\/\s*/, '').trim() || `section-${i}`;
      splitPoints.push({ line: i, name, kind: 'section' });
      continue;
    }

    const cls = CLASS_RE.exec(line);
    if (cls) {
      splitPoints.push({ line: i, name: cls[1], kind: 'class' });
      continue;
    }

    const fn = FUNCTION_RE.exec(line);
    if (fn) {
      splitPoints.push({ line: i, name: fn[1], kind: 'function' });
      continue;
    }

    const exp = EXPORT_RE.exec(line);
    if (exp) {
      splitPoints.push({ line: i, name: exp[1], kind: 'export' });
    }
  }

  // الجدوى: ملف >500 سطر مع نقطتين على الأقل
  const feasible = lines.length > LARGE_FILE_LINES && splitPoints.length >= 2;
  return {
    sourcePath: path,
    lines: lines.length,
    splitPoints,
    feasible,
    ...(feasible
      ? {}
      : {
          reason:
            lines.length <= LARGE_FILE_LINES
              ? 'file not large enough'
              : 'not enough natural split points',
        }),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// التفكيك — بناء الـ patch المركب
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تفكيك ملف إلى أهداف، كـ patch مركب.
 *
 * ⚠️ الرفض بصوت عالٍ:
 * - ملف غير موجود
 * - خطة غير مجدية
 * - عدد أهداف < 2
 *
 * inverse هو recomposeFile: يعيد بناء المصدر من الأهداف.
 * هذا ما يجعل التراجع byte-identical — نفس مبدأ roundTrip.
 */
export function decomposeFilePatch(
  project: ProjectSurface,
  path: string,
  targets: Array<{ path: string; content: string; header: FileHeader }>,
): DevStudioPatch {
  const source = project.readFile(path);
  if (source === null) {
    throw new Error(`[DecompositionEngine] no such file: ${path}`);
  }
  if (targets.length < 2) {
    throw new Error(`[DecompositionEngine] decomposition needs ≥2 targets, got ${targets.length}`);
  }
  // كل هدف يجب أن يحمل ترويسة صالحة (ميثاق)
  for (const t of targets) {
    if (!t.header.summaryAr?.trim()) {
      throw new Error(`[DecompositionEngine] target ${t.path} missing header summary`);
    }
    if (!t.content.trim()) {
      throw new Error(`[DecompositionEngine] target ${t.path} is empty`);
    }
  }

  return {
    op: 'decomposeFile',
    sourcePath: path,
    targets: targets.map((t) => ({
      ...t,
      header: { ...t.header, copyrightYear: t.header.copyrightYear || COPYRIGHT_YEAR },
    })),
    inverse: {
      op: 'recomposeFile',
      sourcePath: path,
      targetPaths: targets.map((t) => t.path),
    },
  };
}

/**
 * اقتراح تلقائي: يقسم المحتوى على نقاط الفصل.
 *
 * يُعيد مسودة أهداف يمكن للمنادي تنقيحها قبل تمريرها
 * إلى decomposeFilePatch. لا نطبق مباشرة — نفس مبدأ
 * "مصنع، لا محرر".
 */
export function suggestTargets(
  project: ProjectSurface,
  path: string,
): Array<{ path: string; content: string; header: FileHeader }> {
  const plan = analyzeForDecomposition(project, path);
  if (!plan.feasible) {
    throw new Error(`[DecompositionEngine] cannot decompose: ${plan.reason}`);
  }

  const content = project.readFile(path)!;
  const lines = content.split('\n');
  const targets: Array<{ path: string; content: string; header: FileHeader }> = [];

  // نقاط الفصل + نهاية الملف
  const boundaries = [...plan.splitPoints.map((p) => p.line), lines.length];

  const dir = path.slice(0, path.lastIndexOf('/')) || '.';
  const base = path.slice(path.lastIndexOf('/') + 1).replace(/\.[a-z0-9]+$/i, '');

  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i];
    const end = boundaries[i + 1];
    const chunk = lines.slice(start, end).join('\n');
    if (!chunk.trim()) continue;

    const point = plan.splitPoints[i];
    const name = point?.name ?? `${base}-part${i}`;
    const targetPath = `${dir}/${base}/${name}.ts`;

    targets.push({
      path: targetPath,
      content: chunk,
      header: {
        summaryAr: `قطعة مفصولة من ${path} — ${name}`,
        copyrightYear: COPYRIGHT_YEAR,
      },
    });
  }

  if (targets.length < 2) {
    throw new Error('[DecompositionEngine] split produced fewer than 2 non-empty targets');
  }
  return targets;
}
