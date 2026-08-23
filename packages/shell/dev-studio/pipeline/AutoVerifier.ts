/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [AutoVerifier.ts] محقق الجودة الآلي — يشغّل tsc + vitest + lint حقيقية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DevStudioPatch } from '../core/DevStudioTypes';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const execFileAsync = promisify(execFile);
const TSC_TIMEOUT = 30_000;
const VITEST_TIMEOUT = 60_000;
const LINT_TIMEOUT = 30_000;
const ROOT = process.cwd();
const MUTATIONS_PER_RUN = 5;

export type VerificationLevel = 'tsc' | 'vitest' | 'lint';

export interface VerificationResult {
  level: VerificationLevel;
  passed: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface AutoVerifyReport {
  results: VerificationResult[];
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
}

export type VerifyResult =
  { ok: true; report: AutoVerifyReport } | { ok: false; report: AutoVerifyReport };

export type CheckFn = (level: VerificationLevel) => Promise<VerificationResult>;

async function runCommand(
  cmd: string,
  args: string[],
  timeout: number,
): Promise<{ ok: boolean; stdout: string; stderr: string; durationMs: number }> {
  const start = Date.now();
  try {
    const { stdout, stderr } = await execFileAsync(cmd, args, {
      cwd: ROOT,
      timeout,
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024,
    });
    return { ok: true, stdout, stderr, durationMs: Date.now() - start };
  } catch (error: unknown) {
    const e = error as { stdout?: string; stderr?: string; message?: string };
    return {
      ok: false,
      stdout: e.stdout ?? '',
      stderr: e.stderr ?? e.message ?? String(error),
      durationMs: Date.now() - start,
    };
  }
}

function generateMutations(patch: DevStudioPatch): string[] {
  if (patch.op !== 'addFile') return [];
  const lines = patch.content.split('\n');
  const codeLines: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t && !t.startsWith('*') && !t.startsWith('//')) codeLines.push(i);
  }
  return codeLines
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(MUTATIONS_PER_RUN, codeLines.length))
    .map((idx) => {
      const m = [...lines];
      m[idx] = m[idx] + ' // mutation-test';
      return m.join('\n');
    });
}

export async function runSingleCheck(level: VerificationLevel): Promise<VerificationResult> {
  switch (level) {
    case 'tsc': {
      const r = await runCommand('npx', ['tsc', '--noEmit'], TSC_TIMEOUT);
      return { level, passed: r.ok, stdout: r.stdout, stderr: r.stderr, durationMs: r.durationMs };
    }
    case 'vitest': {
      const r = await runCommand('npx', ['vitest', 'run', '--reporter=verbose'], VITEST_TIMEOUT);
      return { level, passed: r.ok, stdout: r.stdout, stderr: r.stderr, durationMs: r.durationMs };
    }
    case 'lint': {
      const r = await runCommand('npx', ['eslint', '.', '--max-warnings=0'], LINT_TIMEOUT);
      return { level, passed: r.ok, stdout: r.stdout, stderr: r.stderr, durationMs: r.durationMs };
    }
  }
}

export async function autoVerify(
  patch: DevStudioPatch,
  levels: VerificationLevel[] = ['tsc', 'vitest', 'lint'],
  check: CheckFn = runSingleCheck,
): Promise<VerifyResult> {
  const mutations = generateMutations(patch);
  const allResults: VerificationResult[] = [];

  for (const level of levels) allResults.push(await check(level));

  for (const mutation of mutations) {
    const fullPath = join(ROOT, patch.path);
    let backup: string | null = null;
    try {
      backup = await readFile(fullPath, 'utf-8');
    } catch {
      backup = null;
    }
    if (backup !== null) await writeFile(fullPath, mutation, 'utf-8');
    for (const level of levels) allResults.push(await check(level));
    if (backup !== null) await writeFile(fullPath, backup, 'utf-8');
  }

  const passedCount = allResults.filter((r) => r.passed).length;
  const totalCount = allResults.length;
  const report: AutoVerifyReport = {
    results: allResults,
    passedCount,
    totalCount,
    allPassed: passedCount === totalCount,
  };
  return passedCount === totalCount ? { ok: true, report } : { ok: false, report };
}
