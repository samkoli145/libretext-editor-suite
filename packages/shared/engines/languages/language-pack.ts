/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: حزمة اللغة - توحيد التعريف مع كل المزوّدين
 * 🏛️ الدور: محرك مشترك - يجمع تعريف اللغة وجميع مزوّديها في كائن واحد
 * 📥 المستهلك: LanguageRuntime, LanguageRegistry, SharedSourceCodeEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Language Pack Pattern: حزمة متكاملة تجمع كل ما تحتاجه لغة واحدة
 *    مع إمكانية إضافة مزوّدين مخصصين لكل لغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل حزمة يجب أن تُسجل في LanguageRegistry
 *    2. المزوّدين الفارغة يجب أن تُعامل كـ not supported
 *    3. الترتيب مهم للإكمال التلقائي (الأولوية)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المزوّد قبل الاستدعاء
 *    - إرجاع مصفوفة فارغة للمزوّدات غير المدعومة
 *    - تعامل مع المزوّدات الفاشلة بصمت
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/language-pack.ts

import type { LanguageDefinition } from './language-definition';
import type { CompletionProvider } from './providers/completion-provider';
import type { DiagnosticsProvider } from './providers/diagnostics-provider';
import type { FormatterProvider } from './providers/formatter-provider';
import type { SymbolProvider } from './providers/symbol-provider';
import type { HoverProvider } from './providers/hover-provider';
import type { RunnerProvider } from './providers/runner-provider';
import type { LanguageRuntime } from './language-runtime';

export interface LanguagePack {
  definition: LanguageDefinition;
  completion?: CompletionProvider;
  diagnostics?: DiagnosticsProvider;
  formatter?: FormatterProvider;
  symbols?: SymbolProvider;
  hover?: HoverProvider;
  runner?: RunnerProvider;
}

export function registerLanguagePack(runtime: LanguageRuntime, pack: LanguagePack): void {
  runtime.registry.register(pack.definition);
  if (pack.completion) runtime.registerCompletion(pack.completion);
  if (pack.diagnostics) runtime.registerDiagnostics(pack.diagnostics);
  if (pack.formatter) runtime.registerFormatter(pack.formatter);
  if (pack.symbols) runtime.registerSymbols(pack.symbols);
  if (pack.hover) runtime.registerHover(pack.hover);
  if (pack.runner) runtime.registerRunner(pack.runner);
}
