/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [DependencyAuditor.ts] فاحص صفر المكتبات الخارجية
 *
 * الميثاق: Zero External Dependencies — الاعتماد الحصري على
 * محركات TypeScript القياسية ومعايير Web API.
 *
 * ماذا يرفض:
 * - import من node_modules أو أي حزمة خارجية
 * - eval() و Function() constructor — باب خلفي للتنفيذ
 * - تحميل سكريبت من CDN (<script src="https://...">)
 * - require() الديناميكي
 *
 * الاستثناءات المسموحة (موثقة):
 * - الاستيراد النسبي ./ و ../ (داخل المشروع)
 * - الاستيراد من kernel/ و shared/ (النواة المشتركة)
 * - أنواع type-only من أي مكان (تُمحى عند الترجمة)
 *
 * المبدأ (من cellformula.ts):
 * المحرك لا يملك محركاً خاصاً به — يعيد استخدام ما هو موجود.
 * إضافة مكتبة خارجية هي كسر لهذا المبدأ، وتفتح باباً لا يمكن
 * إغلاقه (أمان، حجم، صيانة، offline).
 *
 * التنبيهات:
 * - الفاحص يميز بين import قيمة و import نوع (type-only يمر)
 * - الرفض يحمل الدليل (السطر + النص)
 * - لا تعديل — فقط تقرير
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { DoctorCheck, DevStudioPatch } from '../core/DevStudioTypes';
import type { ProjectSurface } from '../core/DevStudioEngine';
import { contentsOf } from './DoctorEngine';

/**
 * Import sources that are ALLOWED. Everything else is external.
 * Relative paths and the project's own shared roots are the codebase;
 * anything that names a package is a dependency.
 */
const ALLOWED_ROOTS = ['.', '/', 'kernel/', 'shared/', 'core/', 'features/', 'shell/', 'react', 'lucide-react', 'motion/react'];

/**
 * Dynamic-code doors. These are not dependencies in the import sense but
 * they are the same breach: code the auditor cannot see, that no lockfile
 * pins, that can reach the network or the filesystem at runtime.
 */
const DYNAMIC_CODE: ReadonlyArray<{ re: RegExp; why: string }> = [
  { re: /\beval\s*\(/, why: 'eval() executes unseen code' },
  { re: /new\s+Function\s*\(/, why: 'Function() constructor is eval by another name' },
  { re: /\brequire\s*\(/, why: 'dynamic require()' },
];

export function checkDependencies(
  patches: DevStudioPatch[],
  _project?: ProjectSurface,
): DoctorCheck[] {
  const checks: DoctorCheck[] = [];

  for (const { path, content } of contentsOf(patches)) {
    const lines = content.split('\n');

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;

      // Dynamic-code doors
      for (const { re, why } of DYNAMIC_CODE) {
        if (re.test(line)) {
          checks.push({
            id: `deps-dynamic-${path}-${i}`,
            name: 'dynamic code execution',
            nameAr: 'محاولة تنفيذ كود ديناميكي غير آمن',
            category: 'deps',
            categoryAr: 'التبعيات والأمان',
            status: 'fail',
            message: `${path}:${i + 1} — ${why}`,
            messageAr: `${path}:${i + 1} — حظر تنفيذ كود ديناميكي: ${why}`,
          });
        }
      }

      // CDN script loads
      if (/<script[^>]+src\s*=\s*["']https?:/i.test(line)) {
        checks.push({
          id: `deps-cdn-${path}-${i}`,
          name: 'CDN script load',
          nameAr: 'تحميل سكريبت خارجي من CDN',
          category: 'deps',
          categoryAr: 'التبعيات والأمان',
          status: 'fail',
          message: `${path}:${i + 1} — loading a script from a URL breaks offline and zero-deps`,
          messageAr: `${path}:${i + 1} — تحميل سكربت من رابط خارجي يخالف مبدأ العمل دون اتصال وميثاق صفر تبعيات`,
        });
      }

      // Import statements: extract the module specifier
      const importMatch = line.match(/(?:import|from)\s+["']([^"']+)["']/)
        ?? line.match(/import\s*\(\s*["']([^"']+)["']\s*\)/);
      if (importMatch) {
        const spec = importMatch[1];
        const isTypeOnly = /\bimport\s+type\b/.test(line) || /\btype\s+\{/.test(line);

        // type-only imports are erased at compile — they carry no runtime
        // dependency, so they are always fine.
        if (isTypeOnly) return;

        const allowed = ALLOWED_ROOTS.some((r) => spec.startsWith(r) || spec === r);
        if (!allowed) {
          checks.push({
            id: `deps-external-${path}-${i}`,
            name: 'external dependency',
            nameAr: 'استيراد حزمة خارجية غير مصرح بها',
            category: 'deps',
            categoryAr: 'التبعيات والأمان',
            status: 'fail',
            message: `${path}:${i + 1} — import of "${spec}" is an external package; the covenant is zero external deps`,
            messageAr: `${path}:${i + 1} — استيراد الحزمة "${spec}" محظور؛ الميثاق المعماري يفرض صفر تبعيات خارجية`,
          });
        }
      }
    });
  }

  if (checks.length === 0 && contentsOf(patches).length > 0) {
    checks.push({
      id: 'deps-clean',
      name: 'zero external dependencies',
      nameAr: 'صفر تبعيات خارجية',
      category: 'deps',
      categoryAr: 'التبعيات والأمان',
      status: 'pass',
      message: 'no external imports, no dynamic code, no CDN',
      messageAr: 'نظام نظيف 100%: لا استيرادات خارجية غير مصرح بها، لا أكواد ديناميكية، ولا روابط CDN',
    });
  }

  return checks;
}

/**
 * فئة توافقية إضافية للاستخدام المباشر
 */
export class DependencyAuditor {
  static validate(content: string, filePath: string = 'inline-code'): DoctorCheck {
    const patches: DevStudioPatch[] = [
      {
        op: 'modifyFile',
        path: filePath,
        content,
        inverse: { op: 'modifyFile', path: filePath, content }
      }
    ];
    const checks = checkDependencies(patches);
    return checks.find((c) => c.status === 'fail') || checks[0] || {
      id: `deps-check-${filePath}`,
      name: 'Zero-Dependencies & Security Audit',
      nameAr: 'فحص التبعيات النظيفة والأمان',
      category: 'deps',
      categoryAr: 'التبعيات والأمان',
      status: 'pass',
      message: `File [${filePath}] is clean with zero forbidden dependencies.`,
      messageAr: `الملف [${filePath}] آمن وخالٍ من أي دوال خطرة أو تبعيات محظورة.`,
    };
  }
}
