/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مزوّد التشخيصات - Error & Warning Diagnostics Provider
 * 🏛️ الدور: مزوّد مشترك - يكتشف الأخطاء والتحذيرات في الكود
 * 📥 المستهلك: LanguageRuntime, SharedSourceCodeEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pattern-Based Diagnostics: اكتشاف الأخطاء بأنماط regex سريعة
 *    مع تصنيف الأخطاء (error/warning/info) حسب الخطورة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التشخيصات يجب أن تكون سريعة (< 50ms)
 *    2. بعض الأخطاء وهمية (false positives) - يجب تقليلها
 *    3. أخطاء TypeScript المعقدة تحتاج محركاً خاصاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخل قبل التحليل
 *    - إرجاع مصفوفة فارغة عند عدم وجود أخطاء
 *    - timeout على خوارزمية الفحص
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/providers/diagnostics-provider.ts

import type { LanguageId } from '../language-definition';

export interface Diagnostic {
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
  source?: string;
}

export interface DiagnosticsProvider {
  languageId: LanguageId;
  analyze: (code: string) => Diagnostic[];
}
