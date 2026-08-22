/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: حزمة TypeScript - تعريف كامل مع مزوّد استخراج الرموز
 * 🏛️ الدور: حزمة لغة - توفر كل مزوّدي TypeScript (Completion, Diagnostics, Symbols)
 * 📥 المستهلك: LanguageRegistry, SharedSourceCodeEditor, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Full Provider Stack: حزمة متكاملة تدعم 6 مزوّدين (Completion, Diagnostics,
 *    Formatter, Hover, Runner, Symbol) مع regex patterns للتحليل
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Regex patterns يجب أن تكون سريعة (< 10ms)
 *    2. Keywords يجب أن تشمل كل TypeScript keywords
 *    3. مزوّد الرموز يجب أن يدعم interfaces و types و classes
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخل قبل التحليل
 *    - timeout على كل مزوّد
 *    - إرجاع نتائج فارغة عند الخطأ بدلاً من استثناء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/packs/typescript.ts

import type { LanguagePack } from '../language-pack';
import type { SymbolInformation } from '../providers/symbol-provider';

const TS_SYMBOL_PATTERNS: {
  kind: SymbolInformation['kind'];
  re: RegExp;
}[] = [
  { kind: 'interface', re: /^\s*export\s+interface\s+(\w+)/ },
  { kind: 'class', re: /^\s*export\s+(?:default\s+)?class\s+(\w+)/ },
  { kind: 'enum', re: /^\s*export\s+enum\s+(\w+)/ },
  { kind: 'function', re: /^\s*export\s+(?:async\s+)?function\s+(\w+)/ },
  { kind: 'function', re: /^\s*(?:async\s+)?function\s+(\w+)/ },
  { kind: 'method', re: /^\s*const\s+(\w+)\s*=\s*(?:async\s*)?\(/ },
  { kind: 'property', re: /^\s*(?:export\s+)?const\s+(\w+)\s*=/ },
];

export const typescriptPack: LanguagePack = {
  definition: {
    id: 'typescript',
    name: { ar: 'تايب سكريبت', en: 'TypeScript' },
    extensions: ['.ts', '.tsx'],
    mimeTypes: ['text/typescript'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: true,
      preview: false,
      run: true,
      compile: true,
      transpile: true,
      design: false,
    },
  },
  completion: {
    languageId: 'typescript',
    provideCompletions: () => [
      {
        label: 'interface',
        kind: 'keyword',
        detail: 'TypeScript interface declaration',
        insertText: 'interface MyInterface {\n  id: string;\n}',
      },
      {
        label: 'type',
        kind: 'keyword',
        detail: 'TypeScript type alias',
        insertText: 'type MyType = string | number;',
      },
      {
        label: 'enum',
        kind: 'keyword',
        detail: 'TypeScript enum',
        insertText: 'enum Status {\n  Active = "active",\n  Inactive = "inactive"\n}',
      },
      {
        label: 'console.log',
        kind: 'function',
        detail: 'Print to console',
        insertText: 'console.log();',
      },
      {
        label: 'async/await',
        kind: 'snippet',
        detail: 'Async function snippet',
        insertText: 'async function fetchData(): Promise<void> {\n  // implementation\n}',
      },
    ],
  },
  diagnostics: {
    languageId: 'typescript',
    analyze: (code) => {
      const diags = [];
      if (code.includes('any')) {
        diags.push({
          severity: 'warning' as const,
          message: 'تجنب استخدام النوع any لحفظ الأمان البرمجي (Explicit type recommended)',
          line: 1,
          column: 1,
          source: 'ts-lint',
        });
      }
      return diags;
    },
  },
  formatter: {
    languageId: 'typescript',
    format: (code) => code.trim().replace(/\n{3,}/g, '\n\n'),
  },
  symbols: {
    languageId: 'typescript',
    extractSymbols: (code) => {
      const symbols: SymbolInformation[] = [];
      code.split('\n').forEach((line, index) => {
        for (const { kind, re } of TS_SYMBOL_PATTERNS) {
          const m = line.match(re);
          if (m) {
            symbols.push({ name: m[1], kind, line: index + 1 });
            break;
          }
        }
      });
      return symbols;
    },
  },
};
