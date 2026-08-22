/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مزوّد تنفيذ الشيفرة - Code Runner (Sandbox) Provider
 * 🏛️ الدور: مزوّد مشترك - ينفذ الكود في بيئة آمنة معزولة
 * 📥 المستهلك: LanguageRuntime, SharedSourceCodeEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Sandboxed Execution: تنفيذ آمن في بيئة معزولة
 *    مع timeout إجباري و capture للإخراج
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التنفيذ يجب أن يكون آمناً 100% - لا وصول لـ DOM
 *    2. الحلقات اللانهائية يجب تقليدها
 *    3. بعض اللغات قد لا تدعم التنفيذ في المتصفح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - timeout إجباري (5 ثوانٍ)
 *    - capture لـ stdout و stderr
 *    - تعامل مع كل الأخطاء برسائل مفهومة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/providers/runner-provider.ts

import type { LanguageId } from '../language-definition';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timeMs: number;
}

export interface RunnerProvider {
  languageId: LanguageId;
  run: (code: string, filename?: string) => Promise<ExecutionResult>;
}
