/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [RuleGuardianCommands.ts] أمر CLI لحارس القواعد — فحص ملفات ضد قواعد AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { checkFiles, formatGuardianReport } from '../pipeline/RuleGuardian';

function collectTsFiles(dir: string, root: string): Array<{ path: string; content: string }> {
  const results: Array<{ path: string; content: string }> = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      results.push(...collectTsFiles(fullPath, root));
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      const relPath = path.relative(root, fullPath);
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        results.push({ path: relPath, content });
      } catch {
        /* skip unreadable files */
      }
    }
  }
  return results;
}

export function cmdGuard(targets: string[]): void {
  const root = process.cwd();
  const files: Array<{ path: string; content: string }> = [];

  if (targets.length === 0) {
    console.log('🛡️  جاري فحص جميع ملفات TypeScript...\n');
    const srcDirs = ['packages/core/src', 'packages/algorithms/src', 'packages/storage/src',
      'packages/shell', 'packages/features', 'packages/components'];
    for (const dir of srcDirs) {
      files.push(...collectTsFiles(path.join(root, dir), root));
    }
  } else {
    console.log(`🛡️  جاري فحص ${targets.length} ملف...\n`);
    for (const t of targets) {
      const abs = path.resolve(t);
      try {
        const content = fs.readFileSync(abs, 'utf-8');
        files.push({ path: path.relative(root, abs), content });
      } catch {
        console.error(`   ⚠️  لا يمكن قراءة: ${t}`);
      }
    }
  }

  if (files.length === 0) {
    console.log('   لا توجد ملفات TypeScript للمراجعة.');
    return;
  }

  const result = checkFiles(files);
  console.log(formatGuardianReport(result));

  if (!result.passed) {
    process.exitCode = 1;
  }
}
