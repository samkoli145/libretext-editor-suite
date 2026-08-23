/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: FixCommand.ts
 * 📂 المسار: packages/shell/dev-studio/cli/FixCommand.ts
 * 🎯 الهدف: أمر الإصلاح التلقائي — fixHeaders + fixLint
 * 🏷️ المعرف: PLUG-FIX-CMD
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { fixHeaders, fixLintIssues } from '../pipeline/AutoFixEngine';

function collectTsFiles(dir: string, root: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
        results.push(...collectTsFiles(full, root));
      }
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts') && !entry.name.includes('.test.')) {
      results.push(full);
    }
  }
  return results;
}

export function cmdFix(target: string): void {
  const root = process.cwd();

  if (target === 'headers' || target === 'all') {
    console.log('🔧 جاري إصلاح الترويسات...\n');
    const srcDirs = ['packages/core/src', 'packages/algorithms/src', 'packages/storage/src',
      'packages/shell/dev-studio', 'packages/shell/dev-studio/cli'];
    const files: string[] = [];
    for (const dir of srcDirs) files.push(...collectTsFiles(path.join(root, dir), root));
    const results = fixHeaders(files, root);
    const fixed = results.filter(r => r.fixed).length;
    const skipped = results.filter(r => !r.fixed).length;
    console.log(`   ✅ تم إصلاح: ${fixed} ملف`);
    console.log(`   ⏭️  مُتخطى: ${skipped} ملف (يحتوي ترويسة)`);
    console.log('');
  }

  if (target === 'lint' || target === 'all') {
    console.log('🔧 جاري إصلاح lint...\n');
    const results = fixLintIssues(root);
    for (const r of results) {
      const icon = r.fixed ? '✅' : '⚠️';
      console.log(`   ${icon} ${r.description}`);
    }
    console.log('');
  }

  console.log('✅ اكتمل الإصلاح.');
}
