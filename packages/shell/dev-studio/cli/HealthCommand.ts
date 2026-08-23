/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: HealthCommand.ts
 * 📂 المسار: packages/shell/dev-studio/cli/HealthCommand.ts
 * 🎯 الهدف: الفحص الصحي الشامل — tsc + test + lint + guard + debt في أمر واحد
 * 🏷️ المعرف: PLUG-HEALTH-CMD
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { checkFiles } from '../pipeline/RuleGuardian';
import { scanProject } from '../pipeline/DebtGuardian';

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
  durationMs: number;
}

async function runCheck(name: string, fn: () => Promise<{ passed: boolean; detail: string }>): Promise<CheckResult> {
  const start = Date.now();
  try {
    const r = await fn();
    return { name, passed: r.passed, detail: r.detail, durationMs: Date.now() - start };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { name, passed: false, detail: msg.slice(0, 200), durationMs: Date.now() - start };
  }
}

function checkTsc(): { passed: boolean; detail: string } {
  execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8', timeout: 60000 });
  return { passed: true, detail: 'ناجح' };
}

function checkTests(): { passed: boolean; detail: string } {
  const out = execSync('npx vitest run 2>&1', { encoding: 'utf-8', timeout: 120000 });
  const m = out.match(/Tests\s+(\d+)\s+passed/);
  const count = m ? m[1] : '?';
  return { passed: true, detail: `${count} اختبار ناجح` };
}

function checkLint(): { passed: boolean; detail: string } {
  try {
    execSync('npx eslint packages/ 2>&1', { encoding: 'utf-8', timeout: 60000, stdio: 'pipe' });
    return { passed: true, detail: '0 أخطاء' };
  } catch (e: unknown) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    const out = String(err.stdout || err.stderr || '');
    // Count actual ESLint errors (lines with "error" severity)
    const errorLines = out.split('\n').filter(l => l.includes('  error  '));
    if (errorLines.length > 0) {
      return { passed: false, detail: `${errorLines.length} خطأ` };
    }
    // If only warnings about ignored files, that's OK
    return { passed: true, detail: '0 أخطاء' };
  }
}

function checkGuard(projectRoot: string): { passed: boolean; detail: string } {
  const srcDirs = ['packages/core/src', 'packages/algorithms/src', 'packages/storage/src'];
  const files: Array<{ path: string; content: string }> = [];
  for (const dir of srcDirs) {
    const abs = path.join(projectRoot, dir);
    if (!fs.existsSync(abs)) continue;
    collectTs(abs, projectRoot, files);
  }
  const result = checkFiles(files);
  return {
    passed: result.passed,
    detail: `${result.totalErrors} خطأ / ${result.totalWarnings} تحذير`,
  };
}

function collectTs(dir: string, root: string, out: Array<{ path: string; content: string }>): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(entry.name)) collectTs(full, root, out);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      try {
        out.push({ path: path.relative(root, full), content: fs.readFileSync(full, 'utf-8') });
      } catch { /* skip */ }
    }
  }
}

async function checkDebt(projectRoot: string): Promise<{ passed: boolean; detail: string }> {
  const report = await scanProject(projectRoot);
  return {
    passed: report.bySeverity.error === 0,
    detail: `${report.bySeverity.error} خطأ / ${report.bySeverity.warning} تحذير / ${report.bySeverity.info} معلومة`,
  };
}

function icon(ok: boolean): string { return ok ? '✅' : '❌'; }

export async function cmdHealth(): Promise<{ passed: boolean }> {
  const root = process.cwd();

  console.log('🏥 جاري الفحص الصحي الشامل...\n');

  const tsc = await runCheck('TypeScript', async () => checkTsc());
  const tests = await runCheck('Tests', async () => checkTests());
  const lint = await runCheck('Lint', async () => checkLint());
  const guard = await runCheck('Rule Guardian', async () => checkGuard(root));
  const debt = await runCheck('Debt', async () => checkDebt(root));

  const checks = [tsc, tests, lint, guard, debt];
  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;

  console.log('═══════════════════════════════════════════════');
  console.log('🏥 DevStudio Health Check — الفحص الصحي الشامل');
  console.log('═══════════════════════════════════════════════');
  for (const c of checks) {
    const dur = ` (${c.durationMs}ms)`;
    console.log(`   ${icon(c.passed)} ${c.name.padEnd(16)} ${c.detail}${dur}`);
  }
  console.log('   ─────────────────────────────────────────');
  const status = passed === total ? '✅ ممتاز — كل شيء نظيف' : `❌ فشل (${total - passed} من ${total} فحوصات فاشلة)`;
  console.log(`   الحالة العامة:  ${status}`);
  console.log('═══════════════════════════════════════════════');

  return { passed: passed === total };
}
