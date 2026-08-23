/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [DevStudioCommands.ts] أوامر CLI الجديدة — verify + commit-ready
 *
 * الطريقة: كل أمر يأخذ مسارات ملفات كمدخل، يشغّل AutoVerifier،
 * ويعيد تقريراً تلقائياً بحالة الفحوصات + عدد الطفرات الناجحة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { autoVerify, runSingleCheck, type VerificationLevel } from '../pipeline/AutoVerifier';
import type { DevStudioPatch } from '../core/DevStudioTypes';

function buildPatchFromFile(filePath: string): DevStudioPatch {
  return {
    op: 'addFile',
    path: filePath,
    content: '',
    inverse: { op: 'removeFile', path: filePath },
  };
}

export async function cmdVerify(filePaths: string[]): Promise<void> {
  const levels: VerificationLevel[] = ['tsc', 'vitest', 'lint'];
  console.log('🔍 جاري التحقق الشامل...');
  console.log(`   الملفات: ${filePaths.length}`);
  console.log(`   الفحوصات: ${levels.join(', ')}`);
  console.log();

  const start = Date.now();

  const tscResult = await runSingleCheck('tsc');
  const vitestResult = await runSingleCheck('vitest');
  const lintResult = await runSingleCheck('lint');

  const baseResults = [tscResult, vitestResult, lintResult];
  const baseAllPassed = baseResults.every(r => r.passed);

  console.log('📊 نتائج الفحوصات الأساسية:');
  for (const r of baseResults) {
    const icon = r.passed ? '✅' : '❌';
    console.log(`   ${icon} ${r.level}: ${r.passed ? 'ناجح' : 'فشل'} (${r.durationMs}ms)`);
    if (!r.passed && r.stderr) {
      const lines = r.stderr.split('\n').slice(0, 5);
      for (const line of lines) console.log(`      ${line}`);
    }
  }
  console.log();

  let totalMutations = 0;
  let passedMutations = 0;

  for (const fp of filePaths) {
    const patch = buildPatchFromFile(fp);
    const result = await autoVerify(patch, levels, runSingleCheck);
    const mutationsRun = result.report.totalCount - baseResults.length;
    const mutationsPassed = result.report.passedCount - (baseAllPassed ? baseResults.length : 0);
    totalMutations += mutationsRun;
    passedMutations += mutationsPassed;
  }

  const elapsed = Date.now() - start;
  const allOk = baseAllPassed && passedMutations === totalMutations;

  console.log('🧬 نتائج الطفرات (Mutations):');
  console.log(`   إجمالي الطفرات: ${totalMutations}`);
  console.log(`   ناجحة: ${passedMutations}`);
  console.log(`   فاشلة: ${totalMutations - passedMutations}`);
  console.log();

  console.log(`⏱️  الوقت الكلي: ${elapsed}ms`);
  console.log();

  if (allOk) {
    console.log('✅ التحقق شامل — الفحوصات والطفرات جميعها ناجحة.');
  } else {
    console.log('❌ التحقق غير شامل — هناك فحوصات أو طفرات فاشلة.');
    console.log('   راجع الأخطاء أعلاه قبل المتابعة.');
    process.exitCode = 1;
  }
}

export async function cmdCommitReady(filePaths: string[]): Promise<void> {
  console.log('🔍 فحص الجاهزية للالتزام...');
  const result = await autoVerify(
    buildPatchFromFile(filePaths[0] || 'package.json'),
    ['tsc'],
    runSingleCheck
  );
  if (result.ok) {
    console.log('✅ المشروع جاهز للالتزام.');
  } else {
    console.log('❌ المشروع غير جاهز — تحقق من الأخطاء.');
    process.exitCode = 1;
  }
}
