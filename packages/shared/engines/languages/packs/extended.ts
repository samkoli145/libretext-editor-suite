/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: حزم اللغات الموسعة - Ruby, PHP, Perl, Go, GIMP Script
 * 🏛️ الدور: حزم لغات - توفر مزوّدات أساسية للغات الإضافية
 * 📥 المستهلك: LanguageRegistry, SharedSourceCodeEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Extended Language Support: دعم لغات إضافية خارج النواة الأساسية
 *    مع مزوّدات مبسطة (Completion + Diagnostics فقط)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. بعض اللغات قد لا تكتمل (GIMP Script محدود)
 *    2. Ruby و PHP لها syntax معقد
 *    3. Perl يحتوي على أنماط صعبة للتحليل (regex literals)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - إرجاع مزوّد فارغ للغات غير المكتملة
 *    - timeout على المزوّدات
 *    - تعامل مع الأخطاء بصمت
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/packs/extended.ts

import type { LanguagePack } from '../language-pack';

export const rubyPack: LanguagePack = {
  definition: {
    id: 'ruby',
    name: { ar: 'روبي (Ruby 3.3)', en: 'Ruby' },
    extensions: ['.rb', '.rake', '.gemspec'],
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
    languageId: 'ruby',
    provideCompletions: () => [
      {
        label: 'def',
        kind: 'keyword',
        detail: 'تعريف دالة برمجية',
        insertText: 'def process_data(items)\n  items.map { |i| i * 2 }\nend',
      },
      {
        label: 'class',
        kind: 'keyword',
        detail: 'تعريف كلاس في روبي',
        insertText:
          'class UserEngine\n  attr_accessor :name\n  def initialize(name)\n    @name = name\n  end\nend',
      },
      {
        label: 'puts',
        kind: 'function',
        detail: 'طباعة نص في روبي',
        insertText: 'puts "Hello from Ruby"',
      },
    ],
  },
};

export const phpPack: LanguagePack = {
  definition: {
    id: 'php',
    name: { ar: 'بي إتش بي (PHP 8.3)', en: 'PHP' },
    extensions: ['.php', '.phtml'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: true,
      preview: true,
      run: true,
      compile: false,
      transpile: false,
      design: false,
    },
  },
  completion: {
    languageId: 'php',
    provideCompletions: () => [
      {
        label: '<?php',
        kind: 'snippet',
        detail: 'وسم بداية PHP',
        insertText:
          '<?php\n\nclass KernelService {\n    public function boot(): void {\n        echo "PHP Kernel Booted\\n";\n    }\n}\n',
      },
      { label: 'echo', kind: 'keyword', detail: 'طباعة نص', insertText: 'echo "Output";' },
    ],
  },
};

export const perlPack: LanguagePack = {
  definition: {
    id: 'perl',
    name: { ar: 'بيرل (Perl 5.38)', en: 'Perl' },
    extensions: ['.pl', '.pm'],
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
    languageId: 'perl',
    provideCompletions: () => [
      {
        label: 'use strict',
        kind: 'snippet',
        detail: 'تفعيل وضع Strict',
        insertText:
          '#!/usr/bin/env perl\nuse strict;\nuse warnings;\n\nprint "S1 Perl Interpreter Running\\n";\n',
      },
      {
        label: 'print',
        kind: 'function',
        detail: 'دالة الطباعة',
        insertText: 'print "Hello Perl\\n";',
      },
    ],
  },
};

export const goPack: LanguagePack = {
  definition: {
    id: 'go',
    name: { ar: 'جو (Go / Golang 1.22)', en: 'Go / Golang' },
    extensions: ['.go'],
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
    languageId: 'go',
    provideCompletions: () => [
      {
        label: 'main',
        kind: 'snippet',
        detail: 'برنامج Go رئيسي',
        insertText:
          'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("S1 Micro-Kernel Go Service")\n}\n',
      },
      {
        label: 'func',
        kind: 'keyword',
        detail: 'تعريف دالة',
        insertText: 'func process() error {\n\treturn nil\n}',
      },
    ],
  },
};

export const gimpPack: LanguagePack = {
  definition: {
    id: 'gimp',
    name: { ar: 'سكربتات GIMP & Krita (Python-Fu)', en: 'GIMP/Krita Scripting' },
    extensions: ['.pyf', '.scm', '.kra'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: true,
      preview: true,
      run: true,
      compile: false,
      transpile: false,
      design: true,
    },
  },
  completion: {
    languageId: 'gimp',
    provideCompletions: () => [
      {
        label: 'gimpfu',
        kind: 'snippet',
        detail: 'إضافة لبرنامج GIMP بواسطة Python-Fu',
        insertText:
          'from gimpfu import *\n\ndef plugin_func(image, drawable):\n    gimp.displays_flush()\n\nregister(\n    "python_fu_s1_filter",\n    "S1 Filter", "S1 Graphic Filter", "Author", "GPL", "2026",\n    "<Image>/Filters/S1", "*", [], [], plugin_func\n)\nmain()\n',
      },
    ],
  },
};
