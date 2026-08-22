/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نظام اللغات الموحد - Barrel Export لكل حزم اللغات والمزوّدين
 * 🏛️ الدور: نقطة دخول موحدة - يُصدّر نظام اللغات كاملاً
 * 📥 المستهلك: كل ملفات المشروع التي تحتاج دعم لغات متعددة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Auto-Registration: تسجيل تلقائي لكل الحزم في بيئة تشغيل جاهزة
 *    مع re-export لجميع الأنواع والواجهات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب circular imports في barrel exports
 *    2. كل حزمة يجب أن تكون مسجلة هنا
 *    3. الترتيب يجب أن يسمح بالـ Tree Shaking
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام explicit exports
 *    - فحص عدم وجود حزم مكررة
 *    - تحديث هذا الملف عند إضافة لغة جديدة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/index.ts

export * from './language-definition';
export * from './language-registry';
export * from './language-runtime';
export * from './language-pack';

export * from './providers/completion-provider';
export * from './providers/diagnostics-provider';
export * from './providers/formatter-provider';
export * from './providers/symbol-provider';
export * from './providers/hover-provider';
export * from './providers/runner-provider';

export * from './packs/web';
export * from './packs/typescript';
export * from './packs/python';
export * from './packs/cpp';
export * from './packs/extended';

import { LanguageRuntime } from './language-runtime';
import { registerLanguagePack } from './language-pack';
import { typescriptPack } from './packs/typescript';
import { pythonPack } from './packs/python';
import { cppPack, cPack, rustPack } from './packs/cpp';
import { rubyPack, phpPack, perlPack, goPack, gimpPack } from './packs/extended';
import {
  glslPack,
  luaPack,
  htmlPack,
  cssPack,
  jsPack,
  markdownPack,
  svgPack,
  jsonPack,
} from './packs/web';

/**
 * بيئة تشغيل اللغات الجاهزة — مسجَّل بها كافة اللغات المدعومة
 */
export const languageRuntime = new LanguageRuntime();

const ALL_PACKS = [
  typescriptPack,
  pythonPack,
  cppPack,
  cPack,
  rustPack,
  rubyPack,
  phpPack,
  perlPack,
  goPack,
  gimpPack,
  glslPack,
  luaPack,
  htmlPack,
  cssPack,
  jsPack,
  markdownPack,
  svgPack,
  jsonPack,
];

for (const pack of ALL_PACKS) {
  registerLanguagePack(languageRuntime, pack);
}
