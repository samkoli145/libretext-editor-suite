/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مزوّد استخراج الرموز - Symbol/Structure Extraction Provider
 * 🏛️ الدور: مزوّد مشترك - يستخرج بنية الكود ومخطط الملف
 * 📥 المستهلك: LanguageRuntime, SharedSourceCodeEditor, DocumentOutline
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Regex-Based Symbol Extraction: استخراج الرموز بأنماط regex سريعة
 *    لبناء مخطط للملف (functions, classes, interfaces, types)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الاستخراج يجب أن يكون سريعاً (< 30ms)
 *    2. بعض الرموز قد لا تُعرف (nested functions)
 *    3. التعليقات يجب استبعادها
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخل قبل التحليل
 *    - إرجاع مصفوفة فارغة عند عدم وجود رموز
 *    - timeout على عملية الاستخراج
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/providers/symbol-provider.ts

import type { LanguageId } from '../language-definition';

export interface SymbolInformation {
  name: string;
  kind: 'class' | 'interface' | 'function' | 'method' | 'property' | 'variable' | 'enum' | 'struct';
  line: number;
  containerName?: string;
}

export interface SymbolProvider {
  languageId: LanguageId;
  extractSymbols: (code: string) => SymbolInformation[];
}
