/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: معرب ومصير صيغ ومعادلات LaTeX الخالص - LaTeX Math Tokenizer
 * 🏛️ الدور: نواة معالجة وتصيير المعادلات الرياضية المشتركة (Zero-Dependency)
 * 📥 المستهلك: LatexMathRenderer, UnifiedRichTextAndMathEditor, محرر PDF
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الخوارزميات والمعالجات الرياضية | Innovative Math Algorithms:
 *    1. Tokenizer for LaTeX Macros (\frac, \sqrt, \int, \sum, \lim, \alpha, \beta, \pi, \sigma)
 *    2. Recursive Parsing for Nested Fractions and Super/Sub-scripts
 *    3. Pure HTML/SVG Typography Rendering with High Math Contrast
 *    4. Matrix and Determinant Grid Layout Generator
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بالثيم الفاتح النقي 100% (ألوان حبر واضحة وتباين عالي)
 *    2. صفر استخدام لـ KaTeX أو MathJax أو أي مكتبات خارجية
 *    3. معالجة الأقواس المتداخلة والحماية من الحلقات اللانهائية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية وترقيع الدوال | Defensive Coding:
 *    - التعامل اللطيف مع صيغ LaTeX غير المكتملة دون التسبب في Crash
 *    - Fallback لتصيير النص كما هو عند وجود أخطاء في الصياغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل التوجيهي باللغة العربية)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface MathSymbolMap {
  [key: string]: string;
}

export const GREEK_AND_SYMBOLS: MathSymbolMap = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  theta: 'θ',
  lambda: 'λ',
  mu: 'μ',
  pi: 'π',
  sigma: 'σ',
  omega: 'ω',
  Delta: 'Δ',
  Sigma: 'Σ',
  Omega: 'Ω',
  infty: '∞',
  pm: '±',
  times: '×',
  div: '÷',
  cdot: '·',
  leq: '≤',
  geq: '≥',
  neq: '≠',
  approx: '≈',
  equiv: '≡',
  in: '∈',
  notin: '∉',
  subset: '⊂',
  subseteq: '⊆',
  cup: '∪',
  cap: '∩',
  forall: '∀',
  exists: '∃',
  nabla: '∇',
  partial: '∂',
  int: '∫',
  iint: '∬',
  iiint: '∭',
  oint: '∮',
  sum: '∑',
  prod: '∏',
  to: '→',
  rightarrow: '→',
  leftarrow: '←',
  Rightarrow: '⇒',
  Leftarrow: '⇐',
  Leftrightarrow: '⇔',
};

/**
 * تحليل وتعريب نصوص LaTeX الرياضية وتحويلها إلى HTML دلالي مصمم للثيم الفاتح
 */
export function parseLatexToSemanticHtml(latex: string): string {
  if (!latex || typeof latex !== 'string') return '';

  let sanitized = latex.trim();

  // 1. استبدال الكسور: \frac{num}{den}
  const fracRegex = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;
  let prev = '';
  while (prev !== sanitized) {
    prev = sanitized;
    sanitized = sanitized.replace(
      fracRegex,
      '<span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-serif text-slate-800">' +
        '<span class="border-b border-slate-700 px-1.5 pb-0.5 text-xs font-semibold leading-tight">$1</span>' +
        '<span class="px-1.5 pt-0.5 text-xs font-semibold leading-tight">$2</span>' +
        '</span>'
    );
  }

  // 2. استبدال الجذور: \sqrt{arg} أو \sqrt[n]{arg}
  sanitized = sanitized.replace(
    /\\sqrt\[([^{}]+)\]\{([^{}]+)\}/g,
    '<span class="inline-flex items-center align-middle mx-1 font-serif text-slate-800">' +
      '<sup class="text-[9px] -mr-1 text-slate-600 font-bold">$1</sup>' +
      '<span class="text-base font-bold">√</span>' +
      '<span class="border-t border-slate-800 px-1 text-xs">$2</span>' +
      '</span>'
  );

  sanitized = sanitized.replace(
    /\\sqrt\{([^{}]+)\}/g,
    '<span class="inline-flex items-center align-middle mx-1 font-serif text-slate-800">' +
      '<span class="text-base font-bold">√</span>' +
      '<span class="border-t border-slate-800 px-1 text-xs">$1</span>' +
      '</span>'
  );

  // 3. التكاملات والمجاميع مع الحدود: \int_{a}^{b} أو \sum_{i=1}^{n}
  sanitized = sanitized.replace(
    /\\int_\{([^{}]+)\}\^\{([^{}]+)\}/g,
    '<span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-serif">' +
      '<sup class="text-[10px] text-slate-600 font-semibold">$2</sup>' +
      '<span class="text-lg font-serif text-blue-700 -my-1">∫</span>' +
      '<sub class="text-[10px] text-slate-600 font-semibold">$1</sub>' +
      '</span>'
  );

  sanitized = sanitized.replace(
    /\\sum_\{([^{}]+)\}\^\{([^{}]+)\}/g,
    '<span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-serif">' +
      '<sup class="text-[10px] text-slate-600 font-semibold">$2</sup>' +
      '<span class="text-base font-serif text-indigo-700 -my-0.5">∑</span>' +
      '<sub class="text-[10px] text-slate-600 font-semibold">$1</sub>' +
      '</span>'
  );

  // 4. الأسس والمؤشرات السفلية: x^{2} أو x_{i}
  sanitized = sanitized.replace(
    /\^\{([^{}]+)\}/g,
    '<sup class="text-[10px] text-slate-700 font-semibold align-super ml-0.5">$1</sup>'
  );
  sanitized = sanitized.replace(
    /_\{([^{}]+)\}/g,
    '<sub class="text-[10px] text-slate-600 font-semibold align-sub ml-0.5">$1</sub>'
  );
  sanitized = sanitized.replace(
    /\^([a-zA-Z0-9])/g,
    '<sup class="text-[10px] text-slate-700 font-semibold align-super ml-0.5">$1</sup>'
  );
  sanitized = sanitized.replace(
    /_([a-zA-Z0-9])/g,
    '<sub class="text-[10px] text-slate-600 font-semibold align-sub ml-0.5">$1</sub>'
  );

  // 5. استبدال الرموز الإغريقية والعمليات
  for (const [key, symbol] of Object.entries(GREEK_AND_SYMBOLS)) {
    const reg = new RegExp(`\\\\${key}(?![a-zA-Z])`, 'g');
    sanitized = sanitized.replace(reg, `<span class="mx-0.5 font-serif font-medium">${symbol}</span>`);
  }

  // 6. استبدال المصفوفات البسيطة \begin{matrix} ... \end{matrix}
  if (sanitized.includes('\\begin{matrix}')) {
    sanitized = sanitized.replace(
      /\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}/g,
      (_match, body) => {
        const rows = body.split('\\\\').map((r: string) => r.trim()).filter(Boolean);
        const htmlRows = rows
          .map((row: string) => {
            const cells = row.split('&').map((c: string) => `<td class="px-2 py-1 text-center font-mono text-xs">${c.trim()}</td>`);
            return `<tr>${cells.join('')}</tr>`;
          })
          .join('');
        return `<table class="inline-table border-x-2 border-slate-700 px-1 mx-2 align-middle bg-slate-50/80 rounded-xs"><tbody>${htmlRows}</tbody></table>`;
      }
    );
  }

  // تنظيف الشرطات المائلة المتبقية غير المعروفة
  sanitized = sanitized.replace(/\\([a-zA-Z]+)/g, '$1');

  return sanitized;
}
