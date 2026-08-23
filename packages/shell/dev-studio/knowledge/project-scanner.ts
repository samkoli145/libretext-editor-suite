/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: project-scanner.ts
 * 🎯 الهدف: مسح شامل للمشروع — يجمع إحصائيات حية من الكود الفعلي
 * 🏛️ الدور: عيوني في المشروع — أعرف كل شيء عن حالته الحالية
 * 🧠 الطريقة المبتكرة: Real-time project scanning via fs + child_process
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { ProjectSnapshot } from './project-memory';

const GIT_TIMEOUT_MS = 5000;
const TEST_TIMEOUT_MS = 120000;

function countFiles(dir: string, ext: string): number {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    if (entry.isDirectory()) {
      count += countFiles(fullPath, ext);
    } else if (entry.name.endsWith(ext)) {
      count++;
    }
  }
  return count;
}

function getGitInfo(projectRoot: string): { lastCommit: string; branch: string } {
  try {
    const lastCommit = execSync('git log --oneline -1', {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: GIT_TIMEOUT_MS,
    }).trim();
    const branch = execSync('git branch --show-current', {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: GIT_TIMEOUT_MS,
    }).trim();
    return { lastCommit, branch };
  } catch {
    return { lastCommit: 'unknown', branch: 'unknown' };
  }
}

function countPackages(projectRoot: string): number {
  const packagesDir = path.join(projectRoot, 'packages');
  if (!fs.existsSync(packagesDir)) return 0;
  return fs.readdirSync(packagesDir, { withFileTypes: true }).filter((e) => e.isDirectory()).length;
}

function runTestsQuietly(projectRoot: string): { passed: number; errors: number } {
  try {
    const output = execSync('npx vitest run --reporter=json 2>/dev/null', {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: TEST_TIMEOUT_MS,
    });
    const json = JSON.parse(output);
    return {
      passed: json.numPassedTests || 0,
      errors: (json.numFailedTests || 0) + (json.numPendingTests || 0),
    };
  } catch {
    return { passed: 0, errors: -1 };
  }
}

export function scanProject(projectRoot: string, runTests = false): ProjectSnapshot {
  const { lastCommit, branch } = getGitInfo(projectRoot);
  const testResults = runTests ? runTestsQuietly(projectRoot) : { passed: 0, errors: 0 };

  const sourceCount =
    countFiles(path.join(projectRoot, 'packages'), '.ts') +
    countFiles(path.join(projectRoot, 'packages'), '.tsx');
  const testCount = countFiles(path.join(projectRoot, 'packages'), '.test.ts');

  const now = new Date();
  return {
    timestamp: now.getTime(),
    date: now.toISOString().split('T')[0],
    sourceCount,
    testCount,
    testPassCount: testResults.passed,
    errorCount: testResults.errors,
    packageCount: countPackages(projectRoot),
    lastCommit,
    branch,
  };
}

export function printSnapshot(snap: ProjectSnapshot): string {
  return [
    `╔════════════════════════════════════════╗`,
    `║    📊 تقرير حالة المشروع               ║`,
    `╠════════════════════════════════════════╣`,
    `║ التاريخ:         ${snap.date}`,
    `║ الفرع:           ${snap.branch}`,
    `║ آخر commit:      ${snap.lastCommit.slice(0, 40)}`,
    `║ حزم:             ${snap.packageCount}`,
    `║ ملفات مصدر:      ${snap.sourceCount}`,
    `║ ملفات اختبار:    ${snap.testCount}`,
    `║ اختبارات ناجحة:  ${snap.testPassCount}`,
    `║ أخطاء:           ${snap.errorCount}`,
    `╚════════════════════════════════════════╝`,
  ].join('\n');
}

export function diffSnapshots(a: ProjectSnapshot, b: ProjectSnapshot): string {
  const changes: string[] = [];
  const delta = b.sourceCount - a.sourceCount;
  if (delta > 0) changes.push(`  + ${delta} ملف مصدراً`);
  if (delta < 0) changes.push(`  - ${Math.abs(delta)} ملف مصدراً`);

  const testDelta = b.testPassCount - a.testPassCount;
  if (testDelta > 0) changes.push(`  + ${testDelta} اختبار ناجح`);

  if (b.lastCommit !== a.lastCommit) {
    changes.push(`  commit: ${a.lastCommit.slice(0, 12)} → ${b.lastCommit.slice(0, 12)}`);
  }

  return changes.length > 0 ? `التغييرات منذ آخر مسح:\n${changes.join('\n')}` : 'لا توجد تغييرات.';
}
