#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: cli.ts
 * 🎯 الهدف: نقطة الدخول الرئيسية لـ DevStudio — الشريك الذكي للمطور
 * 🏛️ الدور: CLI tool يscan ويحقن ويختبر ويُوثّق تلقائياً
 * 🧠 الطريقة المبتكرة: Single CLI that orchestrates the entire dev workflow
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import {
  loadMemory,
  saveMemory,
  initializeMemory,
  addSnapshot,
  addSession,
  addDecision,
  getLatestSnapshot,
} from '../knowledge/project-memory';
import { scanProject, printSnapshot, diffSnapshots } from '../knowledge/project-scanner';
import {
  generateJournalEntry,
  generateChangelogEntry,
  createSession,
} from '../knowledge/auto-reporter';
import { cmdVerify, cmdCommitReady } from './DevStudioCommands';
import { scanProject as scanProjectDebt, formatReport } from '../pipeline/DebtGuardian';
import { cmdGuard } from './RuleGuardianCommands';
import { cmdHealth } from './HealthCommand';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(__filename), '../../../..');

function printBanner(): void {
  console.log(`
╔══════════════════════════════════════════════════════╗
║   🧠 DevStudio — الشريك الذكي للمطور               ║
║   LibreText Editor Suite                            ║
╚══════════════════════════════════════════════════════╝
`);
}

function cmdScan(runTests: boolean): void {
  console.log('🔍 جاري مسح المشروع...\n');
  const snap = scanProject(PROJECT_ROOT, runTests);
  console.log(printSnapshot(snap));

  const prev = getLatestSnapshot(PROJECT_ROOT);
  if (prev) {
    console.log('\n' + diffSnapshots(prev, snap));
  }

  addSnapshot(PROJECT_ROOT, snap);
  console.log('\n✅ تم حفظ اللقطة في الذاكرة.');
}

function cmdStatus(): void {
  const memory = loadMemory(PROJECT_ROOT);
  const latest = getLatestSnapshot(PROJECT_ROOT);

  console.log('📋 حالة المشروع:\n');
  if (latest) {
    console.log(printSnapshot(latest));
  }

  console.log(`\n📊 الإحصائيات التراكمية:`);
  console.log(`   عدد الجلسات:      ${memory.sessions.length}`);
  console.log(`   عدد اللقطات:      ${memory.snapshots.length}`);
  console.log(`   القرارات الموثقة:  ${memory.decisions.length}`);
  console.log(`   إجمالي ملفات:     ${memory.sessions.reduce((s, e) => s + e.filesAdded, 0)}`);

  if (memory.sessions.length > 0) {
    const last = memory.sessions[memory.sessions.length - 1];
    console.log(`\n🕐 آخر جلسة: ${last.date} — ${last.title}`);
  }

  if (memory.knownIssues.length > 0) {
    console.log(`\n⚠️  مشاكل معروفة:`);
    memory.knownIssues.forEach((i) => console.log(`   - ${i}`));
  }
}

function cmdImport(sourceDir: string): void {
  console.log(`📦 جاري استيراد من: ${sourceDir}\n`);

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ المجلد غير موجود: ${sourceDir}`);
    process.exit(1);
  }

  const before = scanProject(PROJECT_ROOT);

  const findCmd = `find "${sourceDir}/packages" -name "*.ts" -o -name "*.tsx" | wc -l`;
  let fileCount = 0;
  try {
    fileCount = parseInt(execSync(findCmd, { encoding: 'utf-8', timeout: 10000 }).trim());
  } catch {
    /* */
  }

  console.log(`   وجد ${fileCount} ملف في المصدر`);

  const packages = fs
    .readdirSync(path.join(sourceDir, 'packages'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  console.log(`   الحزم: ${packages.join(', ')}`);

  console.log('\n⚠️  الاستيراد يدوياً حالياً — DevStudio يscan ويُوثّق فقط.');
  console.log('   استخدم: devstudio scan بعد الانتهاء من النسخ اليدوي.');
}

function cmdVersion(): void {
  console.log('DevStudio v1.1.0');
  console.log('LibreText Editor Suite — Smart Development Partner');
}

async function cmdDebt(): Promise<void> {
  console.log('🔎 جاري فحص الديون...\n');
  const report = await scanProjectDebt(PROJECT_ROOT);
  console.log(formatReport(report));
  if (report.bySeverity.error > 0) process.exitCode = 1;
}

function cmdHelp(): void {
  console.log(`
Oaramer available:

  devstudio scan [--test]     مسح شامل للمشروع + حفظ لقطة
  devstudio status           عرض حالة المشروع والتاريخ
  devstudio import <path>    استيراد من مجلد خارجي (scan فقط)
  devstudio verify <files..> فحص شامل + طفرات (tsc + vitest + lint)
  devstudio commit-ready     فحص سريع — هل المشروع جاهز للالتزام؟
  devstudio debt             فحص الديون الضارة (regex pattern scan)
  devstudio guard            فحص القواعد الصارمة (Rule Guardian)
  devstudio health           الفحص الصحي الشامل (tsc+test+lint+guard+debt)
  devstudio version          إصدار DevStudio
  devstudio help             هذه القائمة
  devstudio init             تهيئة الذاكرة لأول مرة

أمثلة:
  pnpm devstudio scan
  pnpm devstudio scan --test
  pnpm devstudio status
  pnpm devstudio verify packages/core/src/types.ts packages/core/src/ast/types.ts
  pnpm devstudio commit-ready
  pnpm devstudio import "/home/sam2/Projects/المعدل 6/project"
  `);
}

function cmdInit(): void {
  console.log('🔧 جاري تهيئة ذاكرة المشروع...\n');
  const memory = initializeMemory(PROJECT_ROOT);
  console.log(`   المشروع: ${memory.projectName}`);
  console.log(`  _rules:  ${memory.architecturalRules.length} قاعدة معمارية`);
  console.log('\n✅ تم تهيئة الذاكرة. استخدم "devstudio scan" لأخذ أول لقطة.');
}

function main(): void {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'help';

  printBanner();

  switch (cmd) {
    case 'scan':
      cmdScan(args.includes('--test'));
      break;
    case 'status':
      cmdStatus();
      break;
    case 'import':
      if (!args[1]) {
        console.error('❌ تحديد المسار: devstudio import <path>');
        process.exit(1);
      }
      cmdImport(args[1]);
      break;
    case 'version':
      cmdVersion();
      break;
    case 'verify':
      if (args.length < 2) {
        console.error('❌ تحديد الملفات: devstudio verify <file1.ts> [file2.ts ...]');
        process.exit(1);
      }
      cmdVerify(args.slice(1)).catch((e) => {
        console.error(e);
        process.exit(1);
      });
      break;
    case 'commit-ready':
      cmdCommitReady([]).catch((e) => {
        console.error(e);
        process.exit(1);
      });
      break;
    case 'debt':
      cmdDebt().catch((e) => {
        console.error(e);
        process.exit(1);
      });
      break;
    case 'guard':
      cmdGuard(args.slice(1));
      break;
    case 'health':
      cmdHealth().then(r => {
        if (!r.passed) process.exitCode = 1;
      }).catch(e => {
        console.error(e);
        process.exit(1);
      });
      break;
    case 'init':
      cmdInit();
      break;
    case 'help':
    default:
      cmdHelp();
      break;
  }
}

main();
