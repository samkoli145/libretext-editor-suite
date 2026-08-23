/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: AutoFixEngine.ts
 * 📂 المسار: packages/shell/dev-studio/pipeline/AutoFixEngine.ts
 * 🎯 الهدف: محرك الإصلاح التلقائي — ترويسات + lint fix + اقتراحات
 * 🏷️ المعرف: PLUG-AUTO-FIX
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import type { RuleViolation } from './RuleGuardian';

export interface FixResult {
  file: string;
  ruleId: string;
  fixed: boolean;
  description: string;
}

const HEADER_TEMPLATE = `/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: {FILENAME}
 * 📂 المسار: {FILEPATH}
 * 🎯 الهدف الرئيسي: [يُحدد لاحقاً]
 * 🏷️ المعرف: [يُحدد لاحقاً]
 * 📅 تاريخ الإنشاء: {DATE}
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */
`;

function buildHeader(filePath: string, projectRoot: string): string {
  const filename = path.basename(filePath);
  const relPath = path.relative(projectRoot, filePath);
  const date = new Date().toISOString().slice(0, 10);
  return HEADER_TEMPLATE
    .replace('{FILENAME}', filename)
    .replace('{FILEPATH}', relPath)
    .replace('{DATE}', date);
}

export function fixHeaders(filePaths: string[], projectRoot: string): FixResult[] {
  const results: FixResult[] = [];
  for (const fp of filePaths) {
    try {
      const content = fs.readFileSync(fp, 'utf-8');
      if (content.includes('📌 ملخص توجيهي | Guiding Summary')) {
        results.push({ file: fp, ruleId: 'R-001', fixed: false, description: 'يحتوي ترويسة بالفعل' });
        continue;
      }
      const header = buildHeader(fp, projectRoot);
      fs.writeFileSync(fp, header + content, 'utf-8');
      results.push({ file: fp, ruleId: 'R-001', fixed: true, description: 'تم إضافة الترويسة الثنائية' });
    } catch (e) {
      results.push({ file: fp, ruleId: 'R-001', fixed: false, description: `خطأ: ${e instanceof Error ? e.message : '?'}` });
    }
  }
  return results;
}

export function fixLintIssues(projectRoot: string): FixResult[] {
  try {
    execSync('npx eslint packages/ --fix 2>&1', {
      encoding: 'utf-8', timeout: 60000, cwd: projectRoot, stdio: 'pipe',
    });
    return [{ file: 'packages/', ruleId: 'LINT', fixed: true, description: 'تم إصلاح مشاكل lint تلقائياً' }];
  } catch {
    return [{ file: 'packages/', ruleId: 'LINT', fixed: false, description: 'eslint --fix لم ينجح بالكامل' }];
  }
}

export function getFixableCount(violations: readonly RuleViolation[]): number {
  return violations.filter(v => v.ruleId === 'R-001' || v.ruleId === 'R-005').length;
}
