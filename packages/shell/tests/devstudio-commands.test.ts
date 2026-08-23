/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [devstudio-commands.test.ts] اختبارات أوامر CLI — verify + commit-ready
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cmdVerify, cmdCommitReady } from '../dev-studio/cli/DevStudioCommands';
import * as AutoVerifier from '../dev-studio/pipeline/AutoVerifier';
import type { VerificationLevel, VerificationResult } from '../dev-studio/pipeline/AutoVerifier';
import type { VerifyResult } from '../dev-studio/pipeline/AutoVerifier';

let stdout: string[];
let origLog: typeof console.log;
let origExit: typeof process.exit;

beforeEach(() => {
  stdout = [];
  origLog = console.log;
  origExit = process.exit;
  console.log = (...args: unknown[]) => stdout.push(args.join(' '));
  process.exit = (() => {}) as typeof process.exit;
});

afterEach(() => {
  console.log = origLog;
  process.exit = origExit;
  vi.restoreAllMocks();
});

function fakeCheck(pass = true): AutoVerifier.CheckFn {
  return vi.fn(async (level: VerificationLevel): Promise<VerificationResult> => ({
    level,
    passed: pass,
    stdout: '',
    stderr: '',
    durationMs: 5,
  })) as unknown as AutoVerifier.CheckFn;
}

function fakeAutoVerify(ok = true): VerifyResult {
  return {
    ok,
    report: {
      results: [{ level: 'tsc', passed: ok, stdout: '', stderr: '', durationMs: 5 }],
      passedCount: ok ? 1 : 0,
      totalCount: 1,
      allPassed: ok,
    },
  };
}

describe('DevStudioCommands', () => {
  it('cmdVerify prints results and exits 0 on success', async () => {
    vi.spyOn(AutoVerifier, 'runSingleCheck').mockImplementation(
      async (level: VerificationLevel) => ({
        level,
        passed: true,
        stdout: '',
        stderr: '',
        durationMs: 5,
      }),
    );
    vi.spyOn(AutoVerifier, 'autoVerify').mockResolvedValue(fakeAutoVerify(true));

    await cmdVerify(['src/test.ts']);
    const output = stdout.join('\n');
    expect(output).toContain('✅');
    expect(output).toContain('tsc');
    expect(output).toContain('vitest');
    expect(output).toContain('lint');
    expect(output).toContain('التحقق شامل');
  });

  it('cmdVerify exits 1 on failure', async () => {
    vi.spyOn(AutoVerifier, 'runSingleCheck').mockImplementation(
      async (level: VerificationLevel) => ({
        level,
        passed: level !== 'tsc',
        stdout: '',
        stderr: 'error found',
        durationMs: 5,
      }),
    );
    vi.spyOn(AutoVerifier, 'autoVerify').mockResolvedValue(fakeAutoVerify(false));

    await cmdVerify(['src/bad.ts']);
    expect(process.exitCode).toBe(1);
    const output = stdout.join('\n');
    expect(output).toContain('❌');
  });

  it('cmdCommitReady prints ready on success', async () => {
    vi.spyOn(AutoVerifier, 'autoVerify').mockResolvedValue(fakeAutoVerify(true));

    await cmdCommitReady(['src/ok.ts']);
    const output = stdout.join('\n');
    expect(output).toContain('جاهز للالتزام');
  });

  it('cmdCommitReady exits 1 when not ready', async () => {
    vi.spyOn(AutoVerifier, 'autoVerify').mockResolvedValue(fakeAutoVerify(false));

    await cmdCommitReady(['src/bad.ts']);
    expect(process.exitCode).toBe(1);
  });
});
