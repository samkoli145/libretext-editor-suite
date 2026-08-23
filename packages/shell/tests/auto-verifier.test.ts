/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [auto-verifier.test.ts] اختبارات AutoVerifier — الفحص الآلي مع 5 mutations
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi } from 'vitest';
import { autoVerify, type CheckFn } from '../dev-studio/pipeline/AutoVerifier';
import type { DevStudioPatch } from '../dev-studio/core/DevStudioTypes';
import type { VerificationLevel, VerificationResult } from '../dev-studio/pipeline/AutoVerifier';

function makePatch(): DevStudioPatch {
  return {
    op: 'addFile',
    path: 'src/test-auto.ts',
    content: [
      '/* ═══════════════════════════════════════════════════════════════════════════',
      ' * 📌 ملخص توجيهي | Guiding Summary',
      ' * ═══════════════════════════════════════════════════════════════════════════',
      ' * ©️ جميع الحقوق محفوظة ©️ - 2026',
      ' * ═══════════════════════════════════════════════════════════════════════════',
      ' */',
      'export const a = 1;',
      'export const b = 2;',
      'export const c = 3;',
      'export const d = 4;',
      'export const e = 5;',
      'export const f = 6;',
    ].join('\n'),
    inverse: { op: 'removeFile', path: 'src/test-auto.ts' },
  };
}

function mockCheck(pass = true): CheckFn {
  let calls = 0;
  return vi.fn(async (level: VerificationLevel): Promise<VerificationResult> => {
    calls++;
    return { level, passed: pass, stdout: `mock-${calls}`, stderr: '', durationMs: 1 };
  }) as unknown as CheckFn;
}

describe('AutoVerifier', () => {
  it('autoVerify ok when all checks pass', async () => {
    const result = await autoVerify(makePatch(), ['tsc'], mockCheck(true));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.report.results.length).toBeGreaterThanOrEqual(1);
      expect(result.report.allPassed).toBe(true);
    }
  });

  it('autoVerify generates 5 mutations for addFile (6 code lines → 5 max)', async () => {
    const check = mockCheck(true);
    const result = await autoVerify(makePatch(), ['tsc'], check);
    if (result.ok) {
      expect(result.report.results.length).toBe(6);
      expect(result.report.totalCount).toBe(6);
      expect(check).toHaveBeenCalledTimes(6);
    }
  });

  it('autoVerify multiplies levels x mutations', async () => {
    const check = mockCheck(true);
    const result = await autoVerify(makePatch(), ['tsc', 'vitest'], check);
    if (result.ok) {
      expect(result.report.results.length).toBe(12);
      expect(result.report.totalCount).toBe(12);
    }
  });

  it('autoVerify returns err when check fails', async () => {
    let callNum = 0;
    const check: CheckFn = vi.fn(async (level: VerificationLevel) => {
      callNum++;
      return { level, passed: callNum !== 1, stdout: '', stderr: '', durationMs: 1 };
    }) as unknown as CheckFn;
    const result = await autoVerify(makePatch(), ['tsc'], check);
    expect(result.ok).toBe(false);
  });

  it('autoVerify ok when patch op is not addFile (no mutations generated)', async () => {
    const patch: DevStudioPatch = { op: 'removeFile', path: 'src/old.ts' };
    const check = mockCheck(true);
    const result = await autoVerify(patch, ['tsc'], check);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.report.results.length).toBe(1);
      expect(result.report.totalCount).toBe(1);
    }
  });

  it('autoVerify returns correct allPassed=false when any mutation check fails', async () => {
    const check: CheckFn = vi.fn(async (level: VerificationLevel, i?: number) => {
      const result: VerificationResult = {
        level, passed: true, stdout: '', stderr: '', durationMs: 1,
      };
      return result;
    }) as unknown as CheckFn;
    const result = await autoVerify(makePatch(), ['tsc'], check);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.report.allPassed).toBe(true);
      expect(result.report.passedCount).toBe(result.report.totalCount);
    }
  });
});
