/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [rule-guardian.test.ts] اختبارات حارس القواعد — فحص ورفض انتهاكات AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  checkFile,
  checkFiles,
  formatGuardianReport,
  getRules,
} from '../dev-studio/pipeline/RuleGuardian';

const HEADER = `/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 */`;

describe('getRules', () => {
  it('returns at least 5 rules', () => {
    expect(getRules().length).toBeGreaterThanOrEqual(5);
  });

  it('each rule has required fields', () => {
    for (const rule of getRules()) {
      expect(rule.id).toBeTruthy();
      expect(rule.name).toBeTruthy();
      expect(['error', 'warning', 'info']).toContain(rule.severity);
      expect(typeof rule.check).toBe('function');
    }
  });
});

describe('R-001: Mandatory Header', () => {
  it('passes for file with header', () => {
    const v = checkFile(`${HEADER}\nexport const x = 1;`, 'foo.ts');
    expect(v.filter(x => x.ruleId === 'R-001')).toHaveLength(0);
  });

  it('fails for file without header', () => {
    const v = checkFile('export const x = 1;', 'foo.ts');
    expect(v.some(x => x.ruleId === 'R-001')).toBe(true);
  });

  it('skips test files', () => {
    const v = checkFile('export const x = 1;', 'foo.test.ts');
    expect(v.filter(x => x.ruleId === 'R-001')).toHaveLength(0);
  });

  it('skips non-ts files', () => {
    const v = checkFile('some content', 'readme.md');
    expect(v.filter(x => x.ruleId === 'R-001')).toHaveLength(0);
  });
});

describe('R-002: No Dark Theme', () => {
  it('detects dark bg classes', () => {
    const code = `${HEADER}\n<div className="bg-gray-900 text-white">`;
    const v = checkFile(code, 'Component.tsx');
    expect(v.some(x => x.ruleId === 'R-002')).toBe(true);
  });

  it('passes for light theme', () => {
    const code = `${HEADER}\n<div className="bg-white text-gray-800">`;
    const v = checkFile(code, 'Component.tsx');
    expect(v.filter(x => x.ruleId === 'R-002')).toHaveLength(0);
  });

  it('skips non-tsx files', () => {
    const code = 'bg-gray-900 text-white';
    const v = checkFile(code, 'utils.ts');
    expect(v.filter(x => x.ruleId === 'R-002')).toHaveLength(0);
  });
});

describe('R-003: No External Dependencies', () => {
  it('detects external imports in core', () => {
    const code = `${HEADER}\nimport lodash from 'lodash';`;
    const v = checkFile(code, 'packages/core/src/utils.ts');
    expect(v.some(x => x.ruleId === 'R-003')).toBe(true);
  });

  it('allows relative imports', () => {
    const code = `${HEADER}\nimport { x } from './local';`;
    const v = checkFile(code, 'packages/core/src/utils.ts');
    expect(v.filter(x => x.ruleId === 'R-003')).toHaveLength(0);
  });

  it('allows @libretext imports', () => {
    const code = `${HEADER}\nimport { x } from '@libretext/core';`;
    const v = checkFile(code, 'packages/algorithms/src/index.ts');
    expect(v.filter(x => x.ruleId === 'R-003')).toHaveLength(0);
  });

  it('skips non-core packages', () => {
    const code = `${HEADER}\nimport React from 'react';`;
    const v = checkFile(code, 'packages/app/App.tsx');
    expect(v.filter(x => x.ruleId === 'R-003')).toHaveLength(0);
  });
});

describe('R-004: No Secrets', () => {
  it('detects API keys', () => {
    const code = `${HEADER}\nconst apiKey = "sk-1234567890abcdef1234567890abcdef";`;
    const v = checkFile(code, 'config.ts');
    expect(v.some(x => x.ruleId === 'R-004')).toBe(true);
  });

  it('passes for normal code', () => {
    const code = `${HEADER}\nconst name = "LibreText";`;
    const v = checkFile(code, 'config.ts');
    expect(v.filter(x => x.ruleId === 'R-004')).toHaveLength(0);
  });
});

describe('R-005: No as any', () => {
  it('detects as any', () => {
    const code = `${HEADER}\nconst x = value as any;`;
    const v = checkFile(code, 'foo.ts');
    expect(v.some(x => x.ruleId === 'R-005')).toBe(true);
  });

  it('allows eslint-disable', () => {
    const code = `${HEADER}\nconst x = value as any; // eslint-disable-line`;
    const v = checkFile(code, 'foo.ts');
    expect(v.filter(x => x.ruleId === 'R-005')).toHaveLength(0);
  });
});

describe('R-006: Function Length', () => {
  it('flags functions over 50 lines', () => {
    const body = Array.from({ length: 55 }, (_, i) => `  line${i};`).join('\n');
    const code = `${HEADER}\nfunction longFunc() {\n${body}\n}`;
    const v = checkFile(code, 'foo.ts');
    expect(v.some(x => x.ruleId === 'R-006')).toBe(true);
  });

  it('passes for short functions', () => {
    const code = `${HEADER}\nfunction short() {\n  return 1;\n}`;
    const v = checkFile(code, 'foo.ts');
    expect(v.filter(x => x.ruleId === 'R-006')).toHaveLength(0);
  });
});

describe('checkFiles', () => {
  it('aggregates results across files', () => {
    const result = checkFiles([
      { path: 'a.ts', content: 'export const x = 1;' },
      { path: 'b.ts', content: `${HEADER}\nexport const y = 2;` },
    ]);
    expect(result.filesChecked).toBe(2);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.passed).toBe(false);
  });

  it('passes when all files are clean', () => {
    const result = checkFiles([
      { path: 'a.test.ts', content: 'test' },
      { path: 'b.md', content: '# Hello' },
    ]);
    expect(result.passed).toBe(true);
    expect(result.totalErrors).toBe(0);
  });
});

describe('formatGuardianReport', () => {
  it('formats a passing report', () => {
    const report = formatGuardianReport({
      violations: [],
      filesChecked: 5,
      totalErrors: 0,
      totalWarnings: 0,
      passed: true,
    });
    expect(report).toContain('ناجح');
    expect(report).toContain('5');
  });

  it('formats a failing report with violations', () => {
    const report = formatGuardianReport({
      violations: [
        { ruleId: 'R-001', severity: 'error', message: 'missing header', line: 1, suggestion: 'add header' },
        { ruleId: 'R-002', severity: 'error', message: 'dark color', line: 10, suggestion: 'use light' },
      ],
      filesChecked: 2,
      totalErrors: 2,
      totalWarnings: 0,
      passed: false,
    });
    expect(report).toContain('فاشل');
    expect(report).toContain('R-001');
    expect(report).toContain('R-002');
  });
});
