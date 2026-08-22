/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: التصدير التجميعي الموحد (Barrel Export) لنواة المفكرة الحسابية المنقاة
 * 🏛️ الدور: نواة مشتركة معزولة (Zero-Dependency Computational Engine Barrel)
 * 📥 المستهلك: src/shared/lib-core/index.ts وكافة المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Modular Barrel Export with Negative Control Test Suite
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

export * from './types.ts'
export {
  generateVarId,
  findVar,
  setScratchpadVar,
  deleteScratchpadVar,
  renameScratchpadVar,
  createNotebook,
  deleteNotebook,
  renameNotebook,
} from './scratchpad-patches.ts'
export * from './ScratchpadParser.ts'
export * from './ScratchpadGraph.ts'
export * from './ScratchpadEngine.ts'
export * from './ScratchpadStore.ts'
export * from './ScratchpadBindings.ts'
export * from './unit-calc-engine.ts'
export * from './negative-control-tests.ts'
