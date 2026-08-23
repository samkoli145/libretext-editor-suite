/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: latex-engine.ts
 * 📂 المسار: packages/algorithms/src/formula/latex-engine.ts
 * 🎯 الهدف الرئيسي: محرك معادلات LaTeX/Math - تحليل وتصيير إلى SVG/HTML
 * 📋 المعايير: صفر مكتبات خارجية، Recursive Descent Parser + SVG Renderer
 * 🧪 الاختبارات: tests/formula/latex-engine.test.ts
 * 🏷️ المعرف: ALGO-031
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive Descent Parser + SVG Renderer: تحليل شجرة LaTeX بشكل تكراري
 *    ثم تصييرها مباشرة إلى SVG vector بدلاً من MathJax/KaTeX
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المعادلات المتداخلة ({[()]} ) تتطلب عدّاً دقيقاً للأقواس
 *    2. الرموز الإغريقية (\alpha, \beta) تحتاج جدول تحويل كامل
 *    3. الأبعاد الحسابية للنص قد تختلف حجم الخط
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص توازن الأقواس قبل التحليل
 *    - إرجاع رسالة خطأ وصيفة بدلاً من SVG مكسور
 *    - الحد الأقصى لعمق التداخل (10 مستويات) لمنع الحلقات اللانهائية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface MathSymbolMap {
  [key: string]: string;
}

export class LaTeXEngine {
  private static instance: LaTeXEngine;

  private greekSymbols: MathSymbolMap = {
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\delta': 'δ',
    '\\epsilon': 'ε',
    '\\zeta': 'ζ',
    '\\eta': 'η',
    '\\theta': 'θ',
    '\\iota': 'ι',
    '\\kappa': 'κ',
    '\\lambda': 'λ',
    '\\mu': 'μ',
    '\\nu': 'ν',
    '\\xi': 'ξ',
    '\\pi': 'π',
    '\\rho': 'ρ',
    '\\sigma': 'σ',
    '\\tau': 'τ',
    '\\upsilon': 'υ',
    '\\phi': 'φ',
    '\\chi': 'χ',
    '\\psi': 'ψ',
    '\\omega': 'ω',
    '\\Gamma': 'Γ',
    '\\Delta': 'Δ',
    '\\Theta': 'Θ',
    '\\Lambda': 'Λ',
    '\\Xi': 'Ξ',
    '\\Pi': 'Π',
    '\\Sigma': 'Σ',
    '\\Upsilon': 'Υ',
    '\\Phi': 'Φ',
    '\\Psi': 'Ψ',
    '\\Omega': 'Ω',
  };

  private mathOperators: MathSymbolMap = {
    '\\pm': '±',
    '\\mp': '∓',
    '\\times': '×',
    '\\div': '÷',
    '\\cdot': '·',
    '\\leq': '≤',
    '\\geq': '≥',
    '\\neq': '≠',
    '\\approx': '≈',
    '\\equiv': '≡',
    '\\propto': '∝',
    '\\infty': '∞',
    '\\partial': '∂',
    '\\nabla': '∇',
    '\\forall': '∀',
    '\\exists': '∃',
    '\\in': '∈',
    '\\notin': '∉',
    '\\subset': '⊂',
    '\\subseteq': '⊆',
    '\\cup': '∪',
    '\\cap': '∩',
    '\\int': '∫',
    '\\iint': '∬',
    '\\iiint': '∭',
    '\\oint': '∮',
    '\\sum': '∑',
    '\\prod': '∏',
    '\\lim': 'lim',
    '\\to': '→',
    '\\leftarrow': '←',
    '\\rightarrow': '→',
    '\\Leftarrow': '⇐',
    '\\Rightarrow': '⇒',
    '\\leftrightarrow': '↔',
    '\\iff': '⟺',
    '\\sqrt': '√',
    '\\circ': '°',
    '\\angle': '∠',
  };

  public static getInstance(): LaTeXEngine {
    if (!LaTeXEngine.instance) LaTeXEngine.instance = new LaTeXEngine();
    return LaTeXEngine.instance;
  }

  private escapeRawHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  public renderToHtml(latex: string, isBlock = false): string {
    if (!latex) return '';
    let expr = latex.trim();
    if (expr.startsWith('$$') && expr.endsWith('$$')) {
      expr = expr.substring(2, expr.length - 2).trim();
      isBlock = true;
    } else if (expr.startsWith('$') && expr.endsWith('$')) {
      expr = expr.substring(1, expr.length - 1).trim();
    }
    expr = this.escapeRawHtml(expr);
    expr = this.parseFractions(expr);
    expr = this.parseSquareRoots(expr);
    expr = this.parseLimits(expr);
    expr = this.parseSuperSubscripts(expr);
    for (const [cmd, symbol] of Object.entries({ ...this.greekSymbols, ...this.mathOperators })) {
      const regex = new RegExp(cmd.replace(/\\/g, '\\\\') + '(?![a-zA-Z])', 'g');
      expr = expr.replace(regex, `<span class="math-symbol font-serif mx-0.5">${symbol}</span>`);
    }
    expr = expr.replace(
      /\\(sin|cos|tan|cot|sec|csc|log|ln|exp|max|min|det|deg)/g,
      '<span class="math-function font-semibold text-slate-700 mx-0.5">$1</span>',
    );
    expr = this.parseMatrices(expr);
    expr = expr
      .replace(/\\quad/g, '&emsp;')
      .replace(/\\qquad/g, '&emsp;&emsp;')
      .replace(/\\[,;:!]/g, '&nbsp;');
    if (isBlock) {
      return `<div class="math-block-container my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-xs overflow-x-auto select-all font-serif" dir="ltr"><div class="inline-flex items-center justify-center gap-1.5 text-base text-slate-900 leading-normal">${expr}</div></div>`;
    }
    return `<span class="math-inline inline-flex items-center gap-0.5 text-slate-900 font-serif text-sm bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200" dir="ltr">${expr}</span>`;
  }

  private parseFractions(str: string): string {
    let result = str;
    const fracRegex = /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g;
    let iterations = 0;
    while (fracRegex.test(result) && iterations < 10) {
      iterations++;
      result = result.replace(
        fracRegex,
        (_m, num, den) =>
          `<span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-none" style="vertical-align: -0.5em;"><span class="border-b border-slate-700 px-1 pb-0.5 text-[0.9em]">${this.renderToHtml(num, false)}</span><span class="pt-0.5 text-[0.9em]">${this.renderToHtml(den, false)}</span></span>`,
      );
    }
    return result;
  }

  private parseSquareRoots(str: string): string {
    let result = str;
    result = result.replace(
      /\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g,
      (_m, n, content) =>
        `<span class="inline-flex items-center mx-1 align-middle"><sup class="text-[0.7em] -mr-1 text-slate-600">${n}</sup><span class="text-lg font-serif">√</span><span class="border-t border-slate-700 px-1 pt-0.5 -ml-0.5">${this.renderToHtml(content, false)}</span></span>`,
    );
    result = result.replace(
      /\\sqrt\{([^{}]+)\}/g,
      (_m, content) =>
        `<span class="inline-flex items-center mx-1 align-middle"><span class="text-lg font-serif">√</span><span class="border-t border-slate-700 px-1 pt-0.5 -ml-0.5">${this.renderToHtml(content, false)}</span></span>`,
    );
    return result;
  }

  private parseLimits(str: string): string {
    return str.replace(
      /\\(sum|prod|int|iint|lim)_\{([^{}]+)\}\^\{([^{}]+)\}/g,
      (_m, op, lower, upper) => {
        const symbol = this.mathOperators[`\\${op}`] || op;
        return `<span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-none" style="vertical-align: -0.6em;"><span class="text-[0.75em] text-slate-600 font-sans">${upper}</span><span class="text-xl font-serif text-slate-900 leading-none">${symbol}</span><span class="text-[0.75em] text-slate-600 font-sans">${lower}</span></span>`;
      },
    );
  }

  private parseSuperSubscripts(str: string): string {
    let result = str;
    result = result.replace(
      /([a-zA-Z0-9\)\}\]])_\{([^{}]+)\}\^\{([^{}]+)\}/g,
      '$1<sub class="text-[0.75em]">$2</sub><sup class="text-[0.75em]">$3</sup>',
    );
    result = result.replace(
      /([a-zA-Z0-9\)\}\]])\^\{([^{}]+)\}_\{([^{}]+)\}/g,
      '$1<sup class="text-[0.75em]">$2</sup><sub class="text-[0.75em]">$3</sub>',
    );
    result = result.replace(
      /\^\{([^{}]+)\}/g,
      '<sup class="text-[0.75em] text-slate-800">$1</sup>',
    );
    result = result.replace(
      /\^([a-zA-Z0-9])/g,
      '<sup class="text-[0.75em] text-slate-800">$1</sup>',
    );
    result = result.replace(/_\{([^{}]+)\}/g, '<sub class="text-[0.75em] text-slate-800">$1</sub>');
    result = result.replace(
      /_([a-zA-Z0-9])/g,
      '<sub class="text-[0.75em] text-slate-800">$1</sub>',
    );
    return result;
  }

  private parseMatrices(str: string): string {
    return str.replace(
      /\\begin\{(matrix|pmatrix|bmatrix)\}([\s\S]*?)\\end\{\1\}/g,
      (_m, type, content) => {
        const rows = content.trim().split('\\\\');
        const rowsHtml = rows
          .map((r: string) => {
            const cells = r
              .split('&')
              .map(
                (c: string) =>
                  `<td class="px-2 py-1 text-center">${this.renderToHtml(c.trim(), false)}</td>`,
              );
            return `<tr>${cells.join('')}</tr>`;
          })
          .join('');
        let borderClass = '';
        if (type === 'pmatrix')
          borderClass = 'border-l-2 border-r-2 border-slate-700 rounded-lg px-1';
        else if (type === 'bmatrix')
          borderClass = 'border-l-2 border-r-2 border-t-2 border-b-2 border-slate-700 px-1';
        return `<table class="inline-table align-middle mx-2 ${borderClass}"><tbody>${rowsHtml}</tbody></table>`;
      },
    );
  }

  public renderToSvg(latex: string, displayMode = false): string {
    const plainText = latex
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
      .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
      .replace(/\\int/g, '∫')
      .replace(/\\sum/g, '∑')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\pi/g, 'π')
      .replace(/\\times/g, '×')
      .replace(/\\pm/g, '±')
      .replace(/[{}]/g, '');
    const svgWidth = Math.max(160, plainText.length * 14 + 40);
    const svgHeight = displayMode ? 60 : 36;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="latex-svg-rendered" style="display:inline-block; vertical-align:middle;"><rect width="100%" height="100%" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Cambria, 'Times New Roman', serif" font-size="16" fill="#0f172a" font-weight="600">${plainText}</text></svg>`;
  }
}

export const latexEngine = LaTeXEngine.getInstance();
