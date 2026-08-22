/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مزوّد الإكمال التلقائي - Auto-completion Provider
 * 🏛️ الدور: مزوّد مشترك - يوفر اقتراحات الإكمال أثناء الكتابة
 * 📥 المستهلك: LanguageRuntime, SharedSourceCodeEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Context-Aware Completion: اقتراحات تعتمد على السياق الحالي
 *    مع مراعاة الكلمة السابقة والتسلسل الهرمي للكود
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الإكمال يجب أن يكون سريعاً جداً (< 20ms)
 *    2. الاقتراحات يجب أن تكون مفيدة ودقيقة
 *    3. بعض اللغات تحتاج اقتراحات خاصة (decorators, attributes)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخل قبل البحث
 *    - إرجاع مصفوفة فارغة عند عدم التطابق
 *    - timeout على خوارزمية البحث
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/providers/completion-provider.ts

import type { LanguageId } from '../language-definition';

export interface CompletionItem {
  label: string;
  kind: 'keyword' | 'function' | 'class' | 'variable' | 'property' | 'snippet';
  detail?: string;
  insertText?: string;
  documentation?: string;
}

export interface CompletionProvider {
  languageId: LanguageId;
  provideCompletions: (
    code: string,
    position: { line: number; column: number }
  ) => CompletionItem[];
}
