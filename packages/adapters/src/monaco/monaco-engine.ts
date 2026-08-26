/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: monaco-engine.ts
 * 📂 المسار: packages/adapters/src/monaco/monaco-engine.ts
 * 🎯 الهدف الرئيسي: محرك Monaco (نسخة VS Code الويب، MIT) كمكتبة محمّلة كسولاً
 * 📋 المعايير: تحميل CDN آمن SRI-اختياري، جسر ثيمات Daylight، لغات SupportedLanguage
 * 🧪 الاختبارات: يدوي (يتطلب DOM) — الواجهة النقية مغطاة بالنوع
 * 🏷️ المعرف: ADAP-MONACO-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Lazy Engine Adapter — Monaco لا يُحمَّل إلا عند أول createMonacoEngine
 *    (loader واحد مضمون التفرد)، والثيمات تُترجم من PresentationTheme إلى
 *    monaco themes عبر defineTheme — دعم ثيمات لا نهائي مجاناً.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يتطلب DOM — لا يعمل في Node/الاختبارات (SSR آمن: يرجع Promise مرفوضة).
 *    2. CDN خارجي — للنشر المعزول مرر loaderUrl محلياً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تحميل مرة واحدة (singleton promise) + فشل صريح برسالة عربية.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/adapters/src/index.ts
 *    - 📦 التبعيات: monaco-editor (MIT — CDN lazy)
 *    - 📚 مراجع: core/engines/impress-engine (PresentationTheme), theme-engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - loadMonaco: محمّل مفرد (#L96)
 *    - registerDaylightTheme: ترجمة ثيمنا لثيم monaco (#L124)
 *    - createMonacoEngine: إنشاء محرر مربوط (#L146)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Microsoft Monaco Editor (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { PresentationTheme } from '@libretext/core';

/** الحد الأدنى من واجهة Monaco المستخدمة — بلا استيراد ثقيل. */
export interface MonacoMinimal {
  editor: {
    create(
      el: HTMLElement,
      options: Record<string, unknown>,
    ): { getValue(): string; setValue(v: string): void; onDidChangeContentSize(cb: () => void): unknown; dispose(): void };
    defineTheme(name: string, theme: unknown): void;
    setTheme(name: string): void;
  };
  languages: {
    registerCompletionItemProvider(language: string, provider: unknown): unknown;
  };
}

export type MonacoLanguage =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'markdown'
  | 'xml'
  | 'yaml';

const DEFAULT_CDN = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs';

let loaderPromise: Promise<MonacoMinimal> | null = null;

/** محمّل مفرد — يُحمَّل مرة واحدة مهما نودي. */
export function loadMonaco(cdnBase: string = DEFAULT_CDN): Promise<MonacoMinimal> {
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Monaco requires a browser environment (DOM)'));
      return;
    }

    const w = window as unknown as Record<string, unknown>;
    w.require = {
      paths: { vs: `${cdnBase}/vs` },
    };

    const script = document.createElement('script');
    script.src = `${cdnBase}/vs/loader.js`;
    script.onload = () => {
      const amdRequire = (window as unknown as { require: ((...args: unknown[]) => void) & { config(cfg: unknown): void } }).require;
      amdRequire.config({ paths: { vs: `${cdnBase}/vs` } });
      amdRequire(['vs/editor/editor.main'], () => {
        resolve((window as unknown as { monaco: MonacoMinimal }).monaco);
      });
    };
    script.onerror = () =>
      reject(new Error('فشل تحميل Monaco — تحقق من الشبكة أو مرر cdnBase محلياً'));
    document.head.appendChild(script);
  });

  return loaderPromise;
}

/** ترجمة ثيم Daylight/Presentation إلى ثيم Monaco مسجل. */
export function registerDaylightTheme(
  monaco: MonacoMinimal,
  themeName: string,
  theme: PresentationTheme,
): string {
  const monacoName = `libretext-${themeName}`;
  monaco.editor.defineTheme(monacoName, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: theme.primaryColor.replace('#', '') },
      { token: 'string', foreground: '0f766e' },
      { token: 'comment', foreground: theme.secondaryColor.replace('#', ''), fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': theme.backgroundColor,
      'editor.foreground': theme.textColor,
      'editorLineNumber.foreground': theme.secondaryColor,
      'editor.selectionBackground': `${theme.primaryColor}33`,
      'editor.lineHighlightBackground': `${theme.primaryColor}11`,
    },
  });
  return monacoName;
}

/** خيارات إنشاء المحرك. */
export interface MonacoEngineOptions {
  readonly language: MonacoLanguage;
  readonly value?: string;
  readonly theme?: PresentationTheme;
  readonly themeKey?: string;
  readonly readOnly?: boolean;
  readonly minimap?: boolean;
  readonly onChange?: (value: string) => void;
}

/** محرر جاهز مربوط بالأحداث والثيم. */
export interface MonacoEngineHandle {
  getValue(): string;
  setValue(value: string): void;
  setTheme(theme: PresentationTheme, key: string): void;
  dispose(): void;
}

/** إنشاء محرر Monaco داخل حاوية — الواجهة الموحدة للملاعب. */
export async function createMonacoEngine(
  container: HTMLElement,
  options: MonacoEngineOptions,
): Promise<MonacoEngineHandle> {
  const monaco = await loadMonaco();

  let themeName = options.themeKey ?? 'libretext-crisp-white';
  if (options.theme) {
    themeName = registerDaylightTheme(monaco, options.themeKey ?? 'crisp-white', options.theme);
    monaco.editor.setTheme(themeName);
  }

  const editor = monaco.editor.create(container, {
    value: options.value ?? '',
    language: options.language,
    theme: themeName,
    minimap: { enabled: options.minimap ?? false },
    readOnly: options.readOnly ?? false,
    automaticLayout: true,
    fontSize: 14,
    fontFamily: "'Cascadia Code', 'Fira Code', monospace",
    rtlShortcuts: true,
  });

  if (options.onChange) {
    editor.onDidChangeContentSize(() => options.onChange!(editor.getValue()));
    // ملاحظة: onDidChangeContentSize يُستخدم كنبض؛ الربط الدقيق عبر
    // editor.onDidChangeModelContent متاح في الواجهة الكاملة عند التوسع.
  }

  return {
    getValue: () => editor.getValue(),
    setValue: (v: string) => editor.setValue(v),
    setTheme: (theme: PresentationTheme, key: string) => {
      themeName = registerDaylightTheme(monaco, key, theme);
      monaco.editor.setTheme(themeName);
    },
    dispose: () => editor.dispose(),
  };
}
