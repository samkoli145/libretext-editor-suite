/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [auto-fix-engine.test.ts] اختبارات محرك الإصلاح التلقائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { fixHeaders, getFixableCount } from '../dev-studio/pipeline/AutoFixEngine';
import type { RuleViolation } from '../dev-studio/pipeline/RuleGuardian';

const TMP = path.join(os.tmpdir(), 'autofix-test');

beforeEach(() => { fs.mkdirSync(TMP, { recursive: true }); });
afterEach(() => { fs.rmSync(TMP, { recursive: true, force: true }); });

describe('fixHeaders', () => {
  it('adds header to file missing it', () => {
    const fp = path.join(TMP, 'bare.ts');
    fs.writeFileSync(fp, 'export const x = 1;\n');
    const results = fixHeaders([fp], TMP);
    expect(results[0].fixed).toBe(true);
    const content = fs.readFileSync(fp, 'utf-8');
    expect(content).toContain('📌 ملخص توجيهي | Guiding Summary');
    expect(content).toContain('bare.ts');
  });

  it('skips file that already has header', () => {
    const fp = path.join(TMP, 'headed.ts');
    fs.writeFileSync(fp, '/**\n * 📌 ملخص توجيهي | Guiding Summary\n */\nexport const x = 1;\n');
    const results = fixHeaders([fp], TMP);
    expect(results[0].fixed).toBe(false);
  });

  it('handles non-existent file gracefully', () => {
    const results = fixHeaders([path.join(TMP, 'nope.ts')], TMP);
    expect(results[0].fixed).toBe(false);
    expect(results[0].description).toContain('خطأ');
  });
});

describe('getFixableCount', () => {
  it('counts R-001 and R-005 violations', () => {
    const v: RuleViolation[] = [
      { ruleId: 'R-001', severity: 'error', message: '', line: 1, suggestion: '' },
      { ruleId: 'R-002', severity: 'error', message: '', line: 1, suggestion: '' },
      { ruleId: 'R-005', severity: 'warning', message: '', line: 1, suggestion: '' },
      { ruleId: 'R-001', severity: 'error', message: '', line: 1, suggestion: '' },
    ];
    expect(getFixableCount(v)).toBe(3);
  });

  it('returns 0 for no fixable violations', () => {
    const v: RuleViolation[] = [
      { ruleId: 'R-002', severity: 'error', message: '', line: 1, suggestion: '' },
      { ruleId: 'R-003', severity: 'error', message: '', line: 1, suggestion: '' },
    ];
    expect(getFixableCount(v)).toBe(0);
  });
});
