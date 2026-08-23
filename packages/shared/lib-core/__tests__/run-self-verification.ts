/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: مشغّل تحقق ذاتي لمحركات New Code_X3 Tooling + Clip Payload
 * 🏛️ الدور: تشغيل يدوي عبر tsx لتأكيد عمل الشرائح الرأسية بلا إطار اختبار.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { testNewCodeX3ToolingEngines } from './new-code-x3-tooling.test';
import { testClipPayloadEngine } from './clip-payload-engine.test';
import { testColorCombineEngine } from './color-combine-engine.test';

async function main() {
  const suites = [
    await testNewCodeX3ToolingEngines(),
    await testClipPayloadEngine(),
    await testColorCombineEngine(),
  ];
  let failed = 0;
  for (const suite of suites) {
    console.log('\n' + suite.message);
    if (!suite.success) failed++;
  }
  console.log(failed === 0 ? '\nALL SUITES PASSED' : `\n${failed} SUITE(S) FAILED`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
