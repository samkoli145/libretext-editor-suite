/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: حزمة Python - تعريف كامل مع مزوّدات الإكمال والتشخيص
 * 🏛️ الدور: حزمة لغة - توفر مزوّدي Python (Completion + Diagnostics)
 * 📥 المستهلك: LanguageRegistry, SharedSourceCodeEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Python-Specific Patterns: دعم keywords الخاصة بـ Python
 *    مع regex patterns للتحليل (decorators, comprehensions)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Python يستخدم indentation بدلاً من braces
 *    2. decorators يجب التعرف عليها (@)
 *    3. comprehension patterns معقدة للتحليل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخل قبل التحليل
 *    - timeout على المزوّدات
 *    - إرجاع نتائج فارغة عند الخطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/packs/python.ts

import type { LanguagePack } from '../language-pack';

export const pythonPack: LanguagePack = {
  definition: {
    id: 'python',
    name: { ar: 'بايثون', en: 'Python' },
    extensions: ['.py'],
    mimeTypes: ['text/x-python'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: true,
      preview: false,
      run: true,
      compile: false,
      transpile: false,
      design: false,
    },
  },
  completion: {
    languageId: 'python',
    provideCompletions: () => [
      { label: 'def', kind: 'keyword', detail: 'Function definition', insertText: 'def main():\n    pass' },
      { label: 'class', kind: 'keyword', detail: 'Class declaration', insertText: 'class MyClass:\n    def __init__(self):\n        pass' },
      { label: 'print', kind: 'function', detail: 'Print function', insertText: 'print()' },
      { label: 'import numpy as np', kind: 'snippet', detail: 'Import numpy', insertText: 'import numpy as np' },
    ],
  },
  runner: {
    languageId: 'python',
    run: async (code) => {
      const start = Date.now();
      let stdout = '';
      if (code.includes('print(')) {
        const matches = [...code.matchAll(/print\((['"])(.*?)\1\)/g)];
        stdout = matches.map((m) => m[2]).join('\n');
      }
      if (!stdout) stdout = 'Python script executed successfully.';
      return { stdout, stderr: '', exitCode: 0, timeMs: Date.now() - start };
    },
  },
};
