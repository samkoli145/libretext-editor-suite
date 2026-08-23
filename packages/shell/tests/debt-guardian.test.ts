/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [debt-guardian.test.ts] اختبارات DebtGuardian — كشف الديون عبر regex
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { scanFile, DEBT_RULES, formatReport, type DebtReport } from '../dev-studio/pipeline/DebtGuardian';

describe('DebtGuardian', () => {
  it('DEBT-001 detects "as any"', () => {
    const violations = scanFile('const x = foo as any;', 'test.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-001');
    expect(violations[0].severity).toBe('error');
    expect(violations[0].match).toBe('as any');
  });

  it('DEBT-002 detects "as unknown as"', () => {
    const violations = scanFile('const x = foo as unknown as Bar;', 'test.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-002');
    expect(violations[0].severity).toBe('error');
  });

  it('DEBT-003 detects JSON.parse without protection', () => {
    const violations = scanFile('const data = JSON.parse(raw);', 'test.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-003');
    expect(violations[0].severity).toBe('warning');
  });

  it('DEBT-004 detects hardcoded timeout', () => {
    const violations = scanFile('const TIMEOUT = 30000;', 'test.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-004');
    expect(violations[0].severity).toBe('warning');
  });

  it('DEBT-005 detects console.log in engine code', () => {
    const violations = scanFile('console.log("debug");', 'engine.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-005');
    expect(violations[0].severity).toBe('info');
  });

  it('DEBT-006 detects empty catch block', () => {
    const violations = scanFile('try { foo(); } catch (e) {}', 'test.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-006');
    expect(violations[0].severity).toBe('warning');
  });

  it('DEBT-007 detects non-null assertion', () => {
    const violations = scanFile('const x = obj!.prop;', 'test.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-007');
    expect(violations[0].severity).toBe('info');
  });

  it('DEBT-008 detects empty function body', () => {
    const violations = scanFile('function noop() {}', 'test.ts');
    expect(violations.length).toBe(1);
    expect(violations[0].ruleId).toBe('DEBT-008');
    expect(violations[0].severity).toBe('info');
  });

  it('clean code produces no violations', () => {
    const violations = scanFile(
      'const x: number = 42;\nexport function add(a: number, b: number): number { return a + b; }',
      'clean.ts'
    );
    expect(violations.length).toBe(0);
  });

  it('fileFilter skips non-matching extensions', () => {
    const violations = scanFile('const x = foo as any;', 'readme.md');
    expect(violations.length).toBe(0);
  });

  it('multiple violations in one file', () => {
    const code = [
      'const x = foo as any;',
      'const y = JSON.parse(raw);',
      'const z = bar as unknown as Baz;',
    ].join('\n');
    const violations = scanFile(code, 'multi.ts');
    expect(violations.length).toBe(3);
  });

  it('formatReport produces readable output', () => {
    const report: DebtReport = {
      violations: [{
        ruleId: 'DEBT-001', ruleName: 'Unsafe any', severity: 'error',
        file: 'test.ts', line: 1, column: 10, match: 'as any', fix: 'fix it',
      }],
      bySeverity: { error: 1, warning: 0, info: 0 },
      byRule: { 'DEBT-001': 1 },
      totalFiles: 10,
      totalViolations: 1,
      cleanFiles: 9,
    };
    const output = formatReport(report);
    expect(output).toContain('تقرير الديون');
    expect(output).toContain('ERROR:   1');
    expect(output).toContain('test.ts:1:10');
  });

  it('formatReport clean project message', () => {
    const report: DebtReport = {
      violations: [],
      bySeverity: { error: 0, warning: 0, info: 0 },
      byRule: {},
      totalFiles: 10,
      totalViolations: 0,
      cleanFiles: 10,
    };
    const output = formatReport(report);
    expect(output).toContain('المشروع نظيف');
  });

  it('DEBT_RULES has all 8 rules defined', () => {
    expect(DEBT_RULES.length).toBe(8);
    const ids = DEBT_RULES.map(r => r.id);
    expect(ids).toContain('DEBT-001');
    expect(ids).toContain('DEBT-008');
  });

  it('column number is correct for mid-line matches', () => {
    const violations = scanFile('  const x = foo as any;', 'test.ts');
    expect(violations[0].column).toBe(17);
  });
});
