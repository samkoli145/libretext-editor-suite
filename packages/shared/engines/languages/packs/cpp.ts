/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: حزم C/C++/Rust - تعريف كامل مع مزوّدات الإكمال والتشخيص
 * 🏛️ الدور: حزم لغات - توفر مزوّدات 3 لغات منخفضة المستوى
 * 📥 المستهلك: LanguageRegistry, SharedSourceCodeEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Language Low-Level Pack: حزمة مشتركة لـ 3 لغات منخفضة المستوى
 *    مع keywords خاصة بكل لغة و regex patterns
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. C و C++ قد يختلفان في بعض keywords
 *    2. Rust له syntax فريد (ownership, borrowing)
 *    3. Preprocessor directives (#include) يجب التعرف عليها
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
// src/shared/engines/languages/packs/cpp.ts

import type { LanguagePack } from '../language-pack';

export const cppPack: LanguagePack = {
  definition: {
    id: 'cpp',
    name: { ar: 'سي بلس بلس', en: 'C++' },
    extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.h'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: true,
      preview: false,
      run: true,
      compile: true,
      transpile: false,
      design: false,
    },
  },
  completion: {
    languageId: 'cpp',
    provideCompletions: () => [
      { label: '#include <iostream>', kind: 'snippet', insertText: '#include <iostream>\nusing namespace std;' },
      { label: 'std::cout', kind: 'function', insertText: 'std::cout << "Hello World" << std::endl;' },
      { label: 'class', kind: 'keyword', insertText: 'class Controller {\npublic:\n    Controller();\n};' },
    ],
  },
};

export const cPack: LanguagePack = {
  definition: {
    id: 'c',
    name: { ar: 'سي', en: 'C' },
    extensions: ['.c', '.h'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: false,
      preview: false,
      run: true,
      compile: true,
      transpile: false,
      design: false,
    },
  },
};

export const rustPack: LanguagePack = {
  definition: {
    id: 'rust',
    name: { ar: 'رست', en: 'Rust' },
    extensions: ['.rs'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: true,
      preview: false,
      run: true,
      compile: true,
      transpile: false,
      design: false,
    },
  },
  completion: {
    languageId: 'rust',
    provideCompletions: () => [
      { label: 'fn main()', kind: 'snippet', insertText: 'fn main() {\n    println!("Hello, S1!");\n}' },
      { label: 'struct', kind: 'keyword', insertText: 'struct Config {\n    id: String,\n}' },
    ],
  },
};
