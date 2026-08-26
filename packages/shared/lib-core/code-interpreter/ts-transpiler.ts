/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: ts-transpiler.ts
 * 📂 المسار: packages/shared/lib-core/code-interpreter/ts-transpiler.ts
 * 🎯 الهدف الرئيسي: تحويل TypeScript/TSX إلى JavaScript قابل للتنفيذ الحي
 * 📋 المعايير: عبر ts.transpileModule (Apache-2.0 — محرك VS Code نفسه)
 * 🧪 الاختبارات: packages/core/tests/blocks/ts-execution.test.ts
 * 🏷️ المعرف: SHARED-CODE-TSX-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Transpile-then-Sandbox — إزالة الأنواع أولاً (transpileModule) ثم تنفيذ
 *    الناتج في غلاف Function المعزول الموجود. TSX يُحوَّل إلى استدعاءات
 *    jsx() مع shim مصغّر بدل React (صفر اعتماديات وقت التنفيذ).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. transpileModule لا يفحص الأنواع — أخطاء النوع لا تُكتشف عمداً
 *       (سرعة الترجمة الفورية أهم من الفحص في وضع الملعب).
 *    2. diagnostics الإملائية تُجمع وتُرجع — لا تُرمى.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - require ديناميكي مع فشل آمن إن غابت الحزمة.
 *    - حد الكود 200KB قبل الترجمة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/shared/lib-core/index.ts
 *    - 📦 التبعيات: typescript (Apache-2.0), live-interpreter-engine.ts
 *    - 🧪 اختبارات: packages/core/tests/blocks/ts-execution.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - transpileTypeScript: TS/TSX → JS (#L86)
 *    - isTsxSource: كشف TSX من الامتداد/البنية (#L120)
 *    - buildJsxShim: shim مصغّر لـ jsx() (#L130)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Microsoft TypeScript (Apache-2.0) عبر transpileModule
 * ═══════════════════════════════════════════════════════════════════════════
 */

const MAX_SOURCE_LENGTH = 200_000;

/** نتيجة الترجمة. */
export interface TranspileResult {
  readonly ok: boolean;
  readonly js: string;
  readonly diagnostics: readonly string[];
  readonly error?: string;
}

/** خيارات الترجمة. */
export interface TranspileOptions {
  /** فرض وضع JSX حتى دون كشف تلقائي. */
  readonly forceJsx?: boolean;
  /** هدف JavaScript (افتراضي ES2020). */
  readonly target?: 'es2020' | 'es2022' | 'esnext';
}

interface TsApi {
  transpileModule(
    input: string,
    options: Record<string, unknown>,
  ): { outputText: string; diagnostics: readonly { messageText: unknown }[] };
  ScriptTarget: Record<string, number>;
  JsxEmit: Record<string, number>;
}

/** تحميل حزمة typescript بشكل كسول وآمن. */
function loadTs(): TsApi | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ts = require('typescript') as TsApi;
    return typeof ts?.transpileModule === 'function' ? ts : null;
  } catch {
    return null;
  }
}

/** هل المصدر يحتوي صيغة TSX (عناصر JSX)؟ */
export function isTsxSource(code: string): boolean {
  // وسم مفتوح يلي return/=> أو في بداية سطر — نمط JSX النموذجي
  return /(\breturn\s*\(?\s*<)|(=>\s*\(?\s*<)|(^[\t ]*<[A-Za-z][\w.]*[\s/>])/m.test(code);
}

/** ترجمة TypeScript/TSX إلى JavaScript قابل للتنفيذ. */
export function transpileTypeScript(
  code: string,
  options?: TranspileOptions,
): TranspileResult {
  if (!code || code.length > MAX_SOURCE_LENGTH) {
    return { ok: false, js: '', diagnostics: [], error: 'empty-or-too-large' };
  }

  const ts = loadTs();
  if (!ts) {
    return { ok: false, js: '', diagnostics: [], error: 'typescript-unavailable' };
  }

  const isTsx = options?.forceJsx || isTsxSource(code);

  const output = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget[(options?.target ?? 'es2020').toUpperCase()] ?? ts.ScriptTarget.ES2020,
      jsx: isTsx ? ts.JsxEmit.React : ts.JsxEmit.None,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      module: 99, // ESNext — لا تحويل وحدات، تنفيذ مباشر
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  });

  const diagnostics = (output.diagnostics ?? [])
    .map(d => String(typeof d.messageText === 'object' && d.messageText !== null
      ? (d.messageText as { messageText?: string }).messageText ?? ''
      : d.messageText))
    .filter(Boolean);

  const js = isTsx ? `${buildJsxShim()}\n${output.outputText}` : output.outputText;

  return { ok: true, js, diagnostics };
}

/** shim مصغّر لواجهة React الكلاسيكية الناتجة عن الترجمة (بدل React الحقيقي). */
export function buildJsxShim(): string {
  return `
const React = {
  createElement(type, props, ...children) {
    const { children: pc, ...rest } = props || {};
    const allChildren = children.length > 0 ? children : (pc ? [pc] : []);
    const attrs = Object.entries(rest)
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => \` \${k}="\${String(v === true ? '' : v).replace(/"/g, '&quot;')}"\`)
      .join('');
    const tag = typeof type === 'string' ? type : 'component';
    const inner = allChildren.map((c) => (typeof c === 'object' && c !== null ? String(c) : String(c ?? ''))).join('');
    return \`<\${tag}\${attrs}>\${inner}</\${tag}>\`;
  },
  Fragment: 'fragment',
};
`.trim();
}
