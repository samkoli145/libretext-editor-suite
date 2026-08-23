/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [DebtGuardian.ts] حارس الديون — كشف الأنماط الضارة عبر regex
 *
 * المبدأ: كل قاعدة = regex + severity + fix suggestion.
 * لا يفهم الكود — يرى الأنماط فقط..rule = regex + severity + fix suggestion.
 *
 * المبدأ: لا يفهم الكود، يرى الأنماط فقط.
 * يُستخدم من CLI كـ `devstudio debt` أو كخطوة في AutoVerifier.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

export type DebtSeverity = 'error' | 'warning' | 'info';

export interface DebtRule {
  id: string;
  name: string;
  nameAr: string;
  pattern: RegExp;
  severity: DebtSeverity;
  fix: string;
  fileFilter?: (ext: string) => boolean;
}

export interface DebtViolation {
  ruleId: string;
  ruleName: string;
  severity: DebtSeverity;
  file: string;
  line: number;
  column: number;
  match: string;
  fix: string;
}

export interface DebtReport {
  violations: DebtViolation[];
  bySeverity: Record<DebtSeverity, number>;
  byRule: Record<string, number>;
  totalFiles: number;
  totalViolations: number;
  cleanFiles: number;
}

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'coverage']);

export const DEBT_RULES: DebtRule[] = [
  {
    id: 'DEBT-001',
    name: 'Unsafe any cast',
    nameAr: 'تحويل any غير آمن',
    pattern: /\bas\s+any\b/g,
    severity: 'error',
    fix: 'استبدل بـ type assertion محدد أو أضف type guard',
    fileFilter: (ext) => ext === '.ts' || ext === '.tsx',
  },
  {
    id: 'DEBT-002',
    name: 'Double cast (as unknown as)',
    nameAr: 'تحويل مزدوج (as unknown as)',
    pattern: /\bas\s+unknown\s+as\b/g,
    severity: 'error',
    fix: 'أعد تصميم الأنواع بدل double cast',
    fileFilter: (ext) => ext === '.ts' || ext === '.tsx',
  },
  {
    id: 'DEBT-003',
    name: 'JSON.parse without try/catch',
    nameAr: 'JSON.parse بدون حماية',
    pattern: /JSON\.parse\(/g,
    severity: 'warning',
    fix: 'التف بـ tryCatch() من shared/utils/result',
    fileFilter: (ext) => ext === '.ts' || ext === '.tsx',
  },
  {
    id: 'DEBT-004',
    name: 'Hardcoded timeout',
    nameAr: 'مهلة مكتوبة بقوة',
    pattern: /(?:timeout|Timeout|TIMEOUT)\s*[:=]\s*\d{4,}/g,
    severity: 'warning',
    fix: 'استخرج القيمة لثابتWithName_MS',
    fileFilter: (ext) => ext === '.ts' || ext === '.tsx',
  },
  {
    id: 'DEBT-005',
    name: 'console.log in engine code',
    nameAr: 'console.log في كود المحرك',
    pattern: /console\.log\(/g,
    severity: 'info',
    fix: 'استبدل بـ globalDevStudioEvents.emit أو logger',
    fileFilter: (ext) => ext === '.ts',
  },
  {
    id: 'DEBT-006',
    name: 'Empty catch block',
    nameAr: 'كتلة catch فارغة',
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
    severity: 'warning',
    fix: 'أضف تعليقاً يبرر تجاهل الخطأ أو أعد رميه',
    fileFilter: (ext) => ext === '.ts' || ext === '.tsx',
  },
  {
    id: 'DEBT-007',
    name: 'Non-null assertion (!.)',
    nameAr: 'ادعاء عدم الفراغ (!.)',
    pattern: /\w+!\./g,
    severity: 'info',
    fix: 'استخدم optional chaining (?.) أو أضف فحص',
    fileFilter: (ext) => ext === '.ts' || ext === '.tsx',
  },
  {
    id: 'DEBT-008',
    name: 'Empty function body',
    nameAr: 'دالة فارغة',
    pattern: /function\s+\w+\s*\([^)]*\)\s*\{\s*\}/g,
    severity: 'info',
    fix: 'أضف تعليقاً لماذا الدالة فارغة有意ً',
    fileFilter: (ext) => ext === '.ts' || ext === '.tsx',
  },
];

async function walkDir(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
    } else if (CODE_EXTENSIONS.has(extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

export function scanFile(
  content: string,
  filePath: string,
  rules: DebtRule[] = DEBT_RULES,
): DebtViolation[] {
  const violations: DebtViolation[] = [];
  const ext = extname(filePath);
  const lines = content.split('\n');

  for (const rule of rules) {
    if (rule.fileFilter && !rule.fileFilter(ext)) continue;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(line)) !== null) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          file: filePath,
          line: i + 1,
          column: match.index + 1,
          match: match[0],
          fix: rule.fix,
        });
      }
    }
  }

  return violations;
}

export async function scanProject(
  root: string,
  rules: DebtRule[] = DEBT_RULES,
): Promise<DebtReport> {
  const files = await walkDir(root);
  const allViolations: DebtViolation[] = [];
  let cleanFiles = 0;

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8');
    const relativePath = relative(root, filePath);
    const violations = scanFile(content, relativePath, rules);
    if (violations.length === 0) cleanFiles++;
    allViolations.push(...violations);
  }

  const bySeverity: Record<DebtSeverity, number> = { error: 0, warning: 0, info: 0 };
  const byRule: Record<string, number> = {};
  for (const v of allViolations) {
    bySeverity[v.severity]++;
    byRule[v.ruleId] = (byRule[v.ruleId] || 0) + 1;
  }

  return {
    violations: allViolations,
    bySeverity,
    byRule,
    totalFiles: files.length,
    totalViolations: allViolations.length,
    cleanFiles,
  };
}

export function formatReport(report: DebtReport): string {
  const lines: string[] = [];
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('  📊 تقرير الديون | Debt Report');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`  الملفات المفحوصة:  ${report.totalFiles}`);
  lines.push(`  الملفات النظيفة:   ${report.cleanFiles}`);
  lines.push(`  إجمالي المخالفات: ${report.totalViolations}`);
  lines.push('');
  lines.push('  حسب الخطورة:');
  lines.push(`    🔴 ERROR:   ${report.bySeverity.error}`);
  lines.push(`    🟡 WARNING: ${report.bySeverity.warning}`);
  lines.push(`    🔵 INFO:    ${report.bySeverity.info}`);
  lines.push('');

  if (report.totalViolations === 0) {
    lines.push('  ✅ لا توجد ديون — المشروع نظيف!');
    return lines.join('\n');
  }

  lines.push('  حسب القاعدة:');
  for (const [ruleId, count] of Object.entries(report.byRule)) {
    const rule = DEBT_RULES.find((r) => r.id === ruleId);
    lines.push(`    ${ruleId} (${rule?.nameAr ?? ruleId}): ${count}`);
  }
  lines.push('');
  lines.push('  ───────────────────────────────────────────────────');
  lines.push('  المخالفات التفصيلية:');
  lines.push('');

  const sorted = [...report.violations].sort((a, b) => {
    const sev = { error: 0, warning: 1, info: 2 };
    return sev[a.severity] - sev[b.severity] || a.file.localeCompare(b.file) || a.line - b.line;
  });

  for (const v of sorted.slice(0, 50)) {
    const icon = v.severity === 'error' ? '🔴' : v.severity === 'warning' ? '🟡' : '🔵';
    lines.push(`  ${icon} ${v.file}:${v.line}:${v.column}`);
    lines.push(`     ${v.ruleId}: ${v.match}`);
    lines.push(`     💡 ${v.fix}`);
    lines.push('');
  }

  if (sorted.length > 50) {
    lines.push(`  ... و ${sorted.length - 50} مخالفة إضافية`);
  }

  return lines.join('\n');
}
