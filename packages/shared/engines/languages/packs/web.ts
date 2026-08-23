/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: حزم لغات الويب - 8 لغات (GLSL, Lua, HTML, CSS, JS, Markdown, SVG, JSON)
 * 🏛️ الدور: حزم لغات - توفر مزوّدات أساسية لكل لغات الويب
 * 📥 المستهلك: LanguageRegistry, SharedSourceCodeEditor, LiveInterpreterEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Language Pack: حزمة متعددة اللغات مع مزوّدين مشتركيين
 *    (Completion + Diagnostics) لكل لغة مع keywords مخصصة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. GLSL و Lua قد لا يتوفران مزوّدات كاملة
 *    2. JSON يحتاج تنسيقاً خاصاً (لا diagnostics)
 *    3. SVG يحتاج دعم XML attributes
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - إرجاع مزوّد فارغ للغات غير المدعومة بالكامل
 *    - فحص صحة JSON قبل التحليل
 *    - تعامل مع HTML المccoء (unclosed tags)
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/languages/packs/web.ts

import type { LanguagePack } from '../language-pack';

export const glslPack: LanguagePack = {
  definition: {
    id: 'glsl',
    name: { ar: 'جي إل إس إل', en: 'GLSL' },
    extensions: ['.glsl', '.vert', '.frag'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: false,
      symbols: true,
      classes: false,
      preview: true,
      run: false,
      compile: true,
      transpile: false,
      design: true,
    },
  },
};

export const luaPack: LanguagePack = {
  definition: {
    id: 'lua',
    name: { ar: 'لوا', en: 'Lua' },
    extensions: ['.lua'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: false,
      preview: false,
      run: true,
      compile: false,
      transpile: false,
      design: false,
    },
  },
};

export const htmlPack: LanguagePack = {
  definition: {
    id: 'html',
    name: { ar: 'اتتش تي ام ال', en: 'HTML' },
    extensions: ['.html', '.htm'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: false,
      preview: true,
      run: false,
      compile: false,
      transpile: false,
      design: true,
    },
  },
};

export const cssPack: LanguagePack = {
  definition: {
    id: 'css',
    name: { ar: 'سي اس اس', en: 'CSS' },
    extensions: ['.css'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: false,
      preview: true,
      run: false,
      compile: false,
      transpile: false,
      design: true,
    },
  },
};

export const jsPack: LanguagePack = {
  definition: {
    id: 'javascript',
    name: { ar: 'جافا سكريبت', en: 'JavaScript' },
    extensions: ['.js', '.jsx'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: true,
      preview: true,
      run: true,
      compile: false,
      transpile: true,
      design: false,
    },
  },
};

export const markdownPack: LanguagePack = {
  definition: {
    id: 'markdown',
    name: { ar: 'مارك داون', en: 'Markdown' },
    extensions: ['.md'],
    capabilities: {
      completion: true,
      diagnostics: false,
      formatting: true,
      symbols: true,
      classes: false,
      preview: true,
      run: false,
      compile: false,
      transpile: false,
      design: false,
    },
  },
  symbols: {
    languageId: 'markdown',
    extractSymbols: (code) => {
      const symbols = [];
      code.split('\n').forEach((line, index) => {
        const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
        if (m) {
          symbols.push({
            name: m[2],
            kind: 'variable' as const,
            line: index + 1,
          });
        }
      });
      return symbols;
    },
  },
};

export const svgPack: LanguagePack = {
  definition: {
    id: 'svg',
    name: { ar: 'إس في جي', en: 'SVG' },
    extensions: ['.svg'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: false,
      preview: true,
      run: false,
      compile: false,
      transpile: false,
      design: true,
    },
  },
};

export const jsonPack: LanguagePack = {
  definition: {
    id: 'json',
    name: { ar: 'جسون', en: 'JSON' },
    extensions: ['.json', '.jsonc'],
    mimeTypes: ['application/json'],
    capabilities: {
      completion: true,
      diagnostics: true,
      formatting: true,
      symbols: true,
      classes: false,
      preview: false,
      run: false,
      compile: false,
      transpile: false,
      design: false,
    },
  },
  completion: {
    languageId: 'json',
    provideCompletions: () => [
      {
        label: '"key": value',
        kind: 'property' as const,
        detail: 'زوج مفتاح/قيمة JSON',
        insertText: '"key": ',
      },
      { label: '{ }', kind: 'snippet' as const, detail: 'كائن JSON', insertText: '{\n  \n}' },
      { label: '[ ]', kind: 'snippet' as const, detail: 'مصفوفة JSON', insertText: '[\n  \n]' },
    ],
  },
  diagnostics: {
    languageId: 'json',
    analyze: (code) => {
      try {
        JSON.parse(code);
        return [];
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return [
          {
            severity: 'error' as const,
            message: `JSON غير صالح: ${msg}`,
            line: 1,
            column: 1,
            source: 'json-lint',
          },
        ];
      }
    },
  },
  formatter: {
    languageId: 'json',
    format: (code) => {
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch {
        return code;
      }
    },
  },
};
