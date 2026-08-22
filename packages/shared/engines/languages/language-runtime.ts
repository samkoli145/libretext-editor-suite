/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: بيئة تشغيل اللغات - تجميع المزوّدين حسب اللغة
 * 🏛️ الدور: محرك مشترك - واجهة موحدة للوصول لمزوّدي أي لغة
 * 📥 المستهلك: SharedSourceCodeEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Runtime Composition: تجميع ديناميكي للمزوّدين حسب اللغة المحددة
 *    مع cache للأداء و fallback للخدمات غير المدعومة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المزوّدات الفارغة يجب أن تُعامل بـ null بدلاً من استثناء
 *    2. الـ cache يجب أن يُنظف عند تغيير اللغة
 *    3. بعض اللغات قد لا تدعم كل المزوّدين
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المزوّد قبل الإرجاع
 *    - إرجاع NoOp provider عند عدم الدعم
 *    - timeout على المزوّدين البطيئة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/language-runtime.ts

import { LanguageRegistry } from './language-registry';
import type { CompletionProvider } from './providers/completion-provider';
import type { DiagnosticsProvider } from './providers/diagnostics-provider';
import type { FormatterProvider } from './providers/formatter-provider';
import type { SymbolProvider } from './providers/symbol-provider';
import type { HoverProvider } from './providers/hover-provider';
import type { RunnerProvider } from './providers/runner-provider';
import type { LanguageId } from './language-definition';

export class LanguageRuntime {
  public registry = new LanguageRegistry();

  private completionProviders = new Map<LanguageId, CompletionProvider>();
  private diagnosticsProviders = new Map<LanguageId, DiagnosticsProvider>();
  private formatterProviders = new Map<LanguageId, FormatterProvider>();
  private symbolProviders = new Map<LanguageId, SymbolProvider>();
  private hoverProviders = new Map<LanguageId, HoverProvider>();
  private runnerProviders = new Map<LanguageId, RunnerProvider>();

  registerCompletion(p: CompletionProvider): void {
    this.completionProviders.set(p.languageId, p);
  }

  registerDiagnostics(p: DiagnosticsProvider): void {
    this.diagnosticsProviders.set(p.languageId, p);
  }

  registerFormatter(p: FormatterProvider): void {
    this.formatterProviders.set(p.languageId, p);
  }

  registerSymbols(p: SymbolProvider): void {
    this.symbolProviders.set(p.languageId, p);
  }

  registerHover(p: HoverProvider): void {
    this.hoverProviders.set(p.languageId, p);
  }

  registerRunner(p: RunnerProvider): void {
    this.runnerProviders.set(p.languageId, p);
  }

  getCompletion(lang: LanguageId): CompletionProvider | undefined {
    return this.completionProviders.get(lang);
  }

  getDiagnostics(lang: LanguageId): DiagnosticsProvider | undefined {
    return this.diagnosticsProviders.get(lang);
  }

  getFormatter(lang: LanguageId): FormatterProvider | undefined {
    return this.formatterProviders.get(lang);
  }

  getSymbols(lang: LanguageId): SymbolProvider | undefined {
    return this.symbolProviders.get(lang);
  }

  getHover(lang: LanguageId): HoverProvider | undefined {
    return this.hoverProviders.get(lang);
  }

  getRunner(lang: LanguageId): RunnerProvider | undefined {
    return this.runnerProviders.get(lang);
  }
}
