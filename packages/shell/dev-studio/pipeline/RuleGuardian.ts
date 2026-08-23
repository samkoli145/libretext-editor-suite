/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: RuleGuardian.ts
 * 📂 المسار: packages/shell/dev-studio/pipeline/RuleGuardian.ts
 * 🎯 الهدف الرئيسي: حماية القواعد الصارمة — فحص ورفض تعديلات تكسر القواعد
 * 📋 المعايير: فحص ملفات TypeScript/TSX/Md مقابل قواعد AGENTS.md الصارمة
 * 🏷️ المعرف: PLUG-RULE-GUARDIAN
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Declarative Rule Engine with Severity Scoring & Auto-Fix Suggestions
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type RuleSeverity = 'error' | 'warning' | 'info';

export interface RuleDefinition {
  readonly id: string;
  readonly name: string;
  readonly severity: RuleSeverity;
  readonly description: string;
  readonly check: (content: string, filePath: string) => RuleViolation[];
}

export interface RuleViolation {
  readonly ruleId: string;
  readonly severity: RuleSeverity;
  readonly message: string;
  readonly line: number;
  readonly suggestion: string;
}

export interface RuleGuardianResult {
  readonly violations: readonly RuleViolation[];
  readonly filesChecked: number;
  readonly totalErrors: number;
  readonly totalWarnings: number;
  readonly passed: boolean;
}

const DARK_THEME_PATTERNS: readonly RegExp[] = [
  /bg-(gray|slate|zinc|neutral|stone|dark)-(800|900|950)/,
  /dark:/,
  /text-(gray|slate|zinc|neutral|stone)-(300|400)/,
  /bg-black/,
  /bg-gray-9/,
  /bg-slate-9/,
];

const SECRET_PATTERNS: readonly RegExp[] = [
  /(?:api[_-]?key|secret[_-]?key|password|token)\s*[:=]\s*['"][A-Za-z0-9+/=_-]{16,}['"]/i,
  /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/,
];

const HEADER_MARKER = '📌 ملخص توجيهي | Guiding Summary';

const RULES: readonly RuleDefinition[] = [
  {
    id: 'R-001',
    name: 'Mandatory Bilingual Header',
    severity: 'error',
    description: 'كل ملف TS/TSX يجب أن يحتوي الترويسة الثنائية',
    check(content, filePath) {
      if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return [];
      if (filePath.includes('.test.ts') || filePath.includes('.test.tsx')) return [];
      if (content.includes(HEADER_MARKER)) return [];
      return [{
        ruleId: 'R-001', severity: 'error',
        message: 'الملف يفتقر للترويسة الثنائية الإلزامية',
        line: 1,
        suggestion: 'أضف /** ... 📌 ملخص توجيهي | Guiding Summary ... */ في أعلى الملف',
      }];
    },
  },
  {
    id: 'R-002',
    name: 'No Dark Theme Colors',
    severity: 'error',
    description: 'ممنوع استخدام ألوان الثيم الداكن في ملفات الواجهة',
    check(content, filePath) {
      if (!filePath.endsWith('.tsx') && !filePath.endsWith('.css')) return [];
      const lines = content.split('\n');
      const violations: RuleViolation[] = [];
      lines.forEach((line, i) => {
        for (const pat of DARK_THEME_PATTERNS) {
          if (pat.test(line)) {
            violations.push({
              ruleId: 'R-002', severity: 'error',
              message: `لون ثيم داكن: ${pat.source}`,
              line: i + 1,
              suggestion: 'استبدل بـ bg-white / bg-slate-50 / bg-gray-50',
            });
          }
        }
      });
      return violations;
    },
  },
  {
    id: 'R-003',
    name: 'No External Dependencies',
    severity: 'error',
    description: 'حزم core/algorithms/storage ممنوع فيها اعتماديات خارجية',
    check(content, filePath) {
      const corePkgs = ['packages/core/', 'packages/algorithms/', 'packages/storage/'];
      if (!corePkgs.some(p => filePath.includes(p))) return [];
      if (!content.includes('import ') && !content.includes('require(')) return [];
      const lines = content.split('\n');
      const violations: RuleViolation[] = [];
      const allowed = ['@libretext/', 'node:', 'fs', 'path', 'url', 'child_process'];
      lines.forEach((line, i) => {
        const match = line.match(/from\s+['"]([^'"]+)['"]/);
        if (!match) return;
        const dep = match[1];
        if (allowed.some(a => dep.startsWith(a) || dep === a)) return;
        if (dep.startsWith('.')) return;
        violations.push({
          ruleId: 'R-003', severity: 'error',
          message: `dependency "${dep}" in core package`,
          line: i + 1,
          suggestion: 'أزل الاعتمادية الخارجية أو انقل الكود لحزمة منفصلة',
        });
      });
      return violations;
    },
  },
  {
    id: 'R-004',
    name: 'No Secrets in Code',
    severity: 'error',
    description: 'ممنوع تسريب مفاتيح أو كلمات سر في الكود',
    check(content) {
      const lines = content.split('\n');
      const violations: RuleViolation[] = [];
      lines.forEach((line, i) => {
        for (const pat of SECRET_PATTERNS) {
          if (pat.test(line)) {
            violations.push({
              ruleId: 'R-004', severity: 'error',
              message: 'مفتاح أو سر مكشوف في الكود',
              line: i + 1,
              suggestion: 'انتقل للمتغيرات البيئية (process.env) أو ملف .env',
            });
          }
        }
      });
      return violations;
    },
  },
  {
    id: 'R-005',
    name: 'No `as any` Cast',
    severity: 'warning',
    description: 'تجنب استخدام as any — استخدم أنواع صارمة',
    check(content) {
      const lines = content.split('\n');
      const violations: RuleViolation[] = [];
      lines.forEach((line, i) => {
        if (/as\s+any\b/.test(line) && !/eslint-disable/.test(line)) {
          violations.push({
            ruleId: 'R-005', severity: 'warning',
            message: 'as any يُخِفف الضمان النوعي',
            line: i + 1,
            suggestion: 'استبدل بنوع دقيق أو type guard',
          });
        }
      });
      return violations;
    },
  },
  {
    id: 'R-006',
    name: 'Function Length ≤ 50',
    severity: 'warning',
    description: 'لا تتجاوز أي دالة 50 سطر',
    check(content) {
      const lines = content.split('\n');
      const violations: RuleViolation[] = [];
      let funcStart = -1;
      let funcName = '';
      let braceDepth = 0;
      let inFunc = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?(?:function|const\s+\w+\s*=\s*(?:async\s+)?(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*\w+\s*=>))/);
        if (funcMatch && !inFunc) {
          funcStart = i;
          funcName = funcMatch[0].slice(0, 40);
          inFunc = true;
          braceDepth = 0;
        }
        if (inFunc) {
          braceDepth += (line.match(/{/g) || []).length;
          braceDepth -= (line.match(/}/g) || []).length;
          if (braceDepth <= 0 && i > funcStart) {
            const len = i - funcStart;
            if (len > 50) {
              violations.push({
                ruleId: 'R-006', severity: 'warning',
                message: `دالة "${funcName}..." بطول ${len} سطر`,
                line: funcStart + 1,
                suggestion: 'قسم الدالة إلى دوال فرعية أقل من 50 سطر',
              });
            }
            inFunc = false;
          }
        }
      }
      return violations;
    },
  },
  {
    id: 'R-007',
    name: 'Light Theme Only',
    severity: 'error',
    description: 'الثيم الوحيد المعتمد هو الثيم الفاتح النقي',
    check(content, filePath) {
      if (!filePath.endsWith('.tsx') && !filePath.endsWith('.css')) return [];
      const lines = content.split('\n');
      const violations: RuleViolation[] = [];
      lines.forEach((line, i) => {
        if (/dark-mode|dark-theme|theme\s*===?\s*['"]dark['"]/.test(line)) {
          violations.push({
            ruleId: 'R-007', severity: 'error',
            message: 'إشارة للثيم الداكن',
            line: i + 1,
            suggestion: 'أزل أي منطق مرتبط بالثيم الداكن',
          });
        }
      });
      return violations;
    },
  },
];

export function getRules(): readonly RuleDefinition[] {
  return RULES;
}

export function checkFile(
  content: string,
  filePath: string,
): RuleViolation[] {
  const violations: RuleViolation[] = [];
  for (const rule of RULES) {
    violations.push(...rule.check(content, filePath));
  }
  return violations;
}

export function checkFiles(
  files: ReadonlyArray<{ readonly path: string; readonly content: string }>,
): RuleGuardianResult {
  const allViolations: RuleViolation[] = [];

  for (const file of files) {
    allViolations.push(...checkFile(file.content, file.path));
  }

  const errors = allViolations.filter(v => v.severity === 'error').length;
  const warnings = allViolations.filter(v => v.severity === 'warning').length;

  return {
    violations: allViolations,
    filesChecked: files.length,
    totalErrors: errors,
    totalWarnings: warnings,
    passed: errors === 0,
  };
}

export function formatGuardianReport(result: RuleGuardianResult): string {
  const lines: string[] = [];
  lines.push('═══════════════════════════════════════════════');
  lines.push('🛡️  Rule Guardian — تقرير حماية القواعد');
  lines.push('═══════════════════════════════════════════════');
  lines.push(`   الملفات المفحوصة: ${result.filesChecked}`);
  lines.push(`   الأخطاء:          ${result.totalErrors}`);
  lines.push(`   التحذيرات:        ${result.totalWarnings}`);
  lines.push(`   الحالة:           ${result.passed ? '✅ ناجح' : '❌ فاشل'}`);
  lines.push('');

  if (result.violations.length === 0) {
    lines.push('   لا توجد انتهاكات — كل شيء ممتاز!');
    return lines.join('\n');
  }

  const byRule = new Map<string, RuleViolation[]>();
  for (const v of result.violations) {
    const arr = byRule.get(v.ruleId) || [];
    arr.push(v);
    byRule.set(v.ruleId, arr);
  }

  for (const [ruleId, violations] of byRule) {
    const rule = RULES.find(r => r.id === ruleId);
    const icon = violations[0].severity === 'error' ? '❌' : '⚠️';
    lines.push(`${icon} ${ruleId} — ${rule?.name ?? ruleId} (${violations.length})`);
    for (const v of violations.slice(0, 5)) {
      lines.push(`   L${v.line}: ${v.message}`);
      lines.push(`          💡 ${v.suggestion}`);
    }
    if (violations.length > 5) {
      lines.push(`   ... و ${violations.length - 5} انتهاك إضافي`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
