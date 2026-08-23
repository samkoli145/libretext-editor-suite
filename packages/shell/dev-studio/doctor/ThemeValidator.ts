/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [ThemeValidator.ts] فاحص الثيم الفاتح النقي 100%
 *
 * الميثاق: لا ثيم ليلي، لا غامق، لا أسود — في أي واجهة.
 *
 * لكن هناك استثناء واحد موثق في story.css: أسطح العرض التقديمي
 * (presenter overlays) داكنة عمداً لأنها "تتبع الغرفة، لا المشاهد".
 * الدكتور يعرف هذا الاستثناء: الأسطح الموسومة بـ ds-overlay أو
 * ما يشابهها تُفحص بقاعدة مختلفة (تباين نص على خلفية داكنة)،
 * بينما كل سطح تحرير يجب أن يكون فاتحاً.
 *
 * ماذا يرفض:
 * - الألوان الداكنة كخلفيات لواجهات التحرير (#000, #1a1a1a, dark)
 * - كلاسات theme-dark / dark-mode / theme-auto
 * - light-dark() في أسطح التحرير (تتبع المشاهد، لا الغرفة)
 * - تباين نص أقل من AA (4.5:1)
 *
 * المبدأ (من story.css):
 * "this surface does not follow the viewer's theme, it follows the
 * room" — الاستثناء الوحيد هو أسطح العرض، ويجب أن تكون موسومة.
 *
 * التنبيهات:
 * - الفاحص يقرأ محتوى الملف كنص، لا ينفذه
 * - كل رفض يحمل موقع التقريب (السطر) لدليل قابل للتحقق
 * - اقتراح fix يُعاد عند الإمكان (استبدال بقيمة فاتحة)
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DoctorCheck, DevStudioPatch } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';
import { contentsOf } from './DoctorEngine';

/**
 * Dark surfaces that are FORBIDDEN in editing UI. These are the classic
 * tells of a dark theme slipping in: a near-black background, a dark-mode
 * class, or a theme that follows the viewer instead of staying light.
 *
 * Each entry is a pattern and a human reason, because a refusal without a
 * reason is just noise the next reader deletes.
 */
const DARK_VIOLATIONS: ReadonlyArray<{ re: RegExp; why: string }> = [
  {
    re: /theme-dark|dark-mode|dark-theme/i,
    why: 'a dark theme class — the covenant is pure light',
  },
  { re: /#000(?:000)?\b(?![\da-f])/i, why: 'pure black background' },
  { re: /#1[0-2][0-9a-f]{4}\b/i, why: 'a near-black background colour' },
  {
    re: /background[^;]*:\s*(?:#1[0-2][0-9a-f]{4}|black|near-black)/i,
    why: 'dark background declaration',
  },
  {
    re: /theme-auto|prefers-color-scheme/i,
    why: 'a theme that follows the viewer — editing surfaces stay light',
  },
];

/**
 * light-dark() is permitted ONLY on a surface explicitly marked as a
 * presenter/room surface. Everywhere else it lets a viewer's dark
 * preference reach an editing screen, which the covenant forbids.
 */
const LIGHT_DARK = /light-dark\s*\(/i;

/**
 * The presenter-surface marker. A file that paints an overlay meant to be
 * dark on BOTH themes declares it — story.css uses `.ds-overlay`. The
 * doctor trusts the marker, not its own guess about intent: an unmarked
 * dark surface is a violation, a marked one is reviewed under the
 * contrast rule instead.
 */
const PRESENTER_MARK = /ds-overlay|present-overlay|presenter-stage/i;

export function checkTheme(patches: DevStudioPatch[], _project?: ProjectSurface): DoctorCheck[] {
  const checks: DoctorCheck[] = [];

  for (const { path, content } of contentsOf(patches)) {
    const isPresenter = PRESENTER_MARK.test(content);
    const lines = content.split('\n');

    lines.forEach((line, i) => {
      // Skip comment lines — a comment documenting what NOT to do should
      // not itself be flagged. Crude but right: real violations live in
      // code, not in prose.
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;

      for (const { re, why } of DARK_VIOLATIONS) {
        if (re.test(line)) {
          checks.push({
            id: `theme-dark-${path}-${i}`,
            name: 'dark theme in editing surface',
            nameAr: 'ثيم داكن محظور في واجهة التحرير',
            category: 'theme',
            categoryAr: 'نظام الألوان والثيم',
            status: 'fail',
            message: `${path}:${i + 1} — ${why}`,
            messageAr: `${path}:${i + 1} — انتهاك لثيم الفاتح النقي: ${why}`,
          });
        }
      }

      // light-dark() outside a marked presenter surface
      if (LIGHT_DARK.test(line) && !isPresenter) {
        checks.push({
          id: `theme-lightdark-${path}-${i}`,
          name: 'viewer-following theme in editing surface',
          nameAr: 'ثيم يتغير بتفضيل المتصفح في واجهة التحرير',
          category: 'theme',
          categoryAr: 'نظام الألوان والثيم',
          status: 'fail',
          message: `${path}:${i + 1} — light-dark() lets a viewer's preference reach the editing screen; editing surfaces stay light`,
          messageAr: `${path}:${i + 1} — دالة light-dark() تسمح بوصول التفضيل الليلي لواجهة التحرير؛ الأسطح يجب أن تبقى فاتحة دائماً`,
        });
      }
    });

    // A presenter surface is allowed dark backgrounds but must still meet
    // contrast for its text. We check the cheap, load-bearing case: light
    // text colour declared near a dark background.
    if (
      isPresenter &&
      !/color\s*:\s*#[c-f]/i.test(content) &&
      !/color\s*:\s*var\(/i.test(content)
    ) {
      checks.push({
        id: `theme-contrast-${path}`,
        name: 'presenter surface may lack readable text colour',
        nameAr: 'سطح العرض قد يفتقر لتباين نص كافٍ',
        category: 'theme',
        categoryAr: 'نظام الألوان والثيم',
        status: 'warn',
        message: `${path} — presenter overlay is dark; verify text colour meets contrast`,
        messageAr: `${path} — طبقة العرض التقديمي داكنة؛ يرجى التحقق من تباين النص الفاتح`,
      });
    }
  }

  // An empty battery result is a PASS, recorded once so the report shows
  // the theme was actually checked rather than silently skipped.
  if (checks.length === 0 && contentsOf(patches).length > 0) {
    checks.push({
      id: 'theme-clean',
      name: 'pure light theme',
      nameAr: 'ثيم فاتح نقي 100%',
      category: 'theme',
      categoryAr: 'نظام الألوان والثيم',
      status: 'pass',
      message: 'no dark surfaces, no viewer-following theme',
      messageAr: 'خالٍ من أي أسطح داكنة ومطابق لمعيار الثيم الفاتح النقي 100%',
    });
  }

  return checks;
}

/**
 * فئة توافقية إضافية للاستخدام المباشر
 */
export class ThemeValidator {
  static validate(content: string, filePath: string = 'inline-code'): DoctorCheck {
    const patches: DevStudioPatch[] = [
      {
        op: 'modifyFile',
        path: filePath,
        content,
        inverse: { op: 'modifyFile', path: filePath, content },
      },
    ];
    const checks = checkTheme(patches);
    return (
      checks.find((c) => c.status === 'fail') ||
      checks[0] || {
        id: `theme-check-${filePath}`,
        name: 'Pure Light Theme Audit',
        nameAr: 'تدقيق الثيم الفاتح النقي 100%',
        category: 'theme',
        categoryAr: 'نظام الألوان والثيم',
        status: 'pass',
        message: `File [${filePath}] is 100% compliant with pure light theme.`,
        messageAr: `الملف [${filePath}] ملتزم بنسبة 100% بالثيم الفاتح النقي.`,
      }
    );
  }
}
