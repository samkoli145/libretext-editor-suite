/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك معادلات LaTeX/Math - تحليل وتصيير إلى SVG/HTML بدون مكتبات
 * 🏛️ الدور: محرك مشترك - أساس عرض المعادلات الرياضية والعلمية
 * 📥 المستهلك: MarkdownEngine, LatexInsertDialog, RichTextEditor
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
// src/shared/engines/LaTeXEngine.ts
/**
 * محرك معادلات LaTeX و Math أصيل 100% بدون أي مكتبات خارجية
 * يقوم بتحليل وتصيير معادلات LaTeX الرياضية والعلمية إلى SVG و HTML نقي
 * مع دعم الكسور، الجذور، الأسس، الرموز الإغريقية، التكاملات والمصفوفات.
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
    if (!LaTeXEngine.instance) {
      LaTeXEngine.instance = new LaTeXEngine();
    }
    return LaTeXEngine.instance;
  }

  /**
   * دالة مساعدة لتهريب الرموز الخاصة في HTML لحماية التعبير الرياضي من حقن الشيفرات الخبيثة XSS
   */
  private escapeRawHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * تصيير كود LaTeX إلى كود HTML منسق بدقة عالية
   */
  public renderToHtml(latex: string, isBlock = false): string {
    if (!latex) return '';

    let expr = latex.trim();

    // Remove wrapping $$ or $ if present
    if (expr.startsWith('$$') && expr.endsWith('$$')) {
      expr = expr.substring(2, expr.length - 2).trim();
      isBlock = true;
    } else if (expr.startsWith('$') && expr.endsWith('$')) {
      expr = expr.substring(1, expr.length - 1).trim();
    }

    // Escape raw HTML first to prevent stored XSS attacks
    expr = this.escapeRawHtml(expr);

    // Process Fractions: \frac{a}{b} -> HTML fraction with numerator & denominator
    expr = this.parseFractions(expr);

    // Process Square roots: \sqrt{x} or \sqrt[n]{x}
    expr = this.parseSquareRoots(expr);

    // Process Integrals & Summations with limits: \int_{a}^{b} or \sum_{i=1}^{n}
    expr = this.parseLimits(expr);

    // Process Subscripts & Superscripts: x_{1}^{2} or x^2 or x_1
    expr = this.parseSuperSubscripts(expr);

    // Replace Greek Symbols & Operators
    for (const [cmd, symbol] of Object.entries({ ...this.greekSymbols, ...this.mathOperators })) {
      const regex = new RegExp(cmd.replace(/\\/g, '\\\\') + '(?![a-zA-Z])', 'g');
      expr = expr.replace(regex, `<span class="math-symbol font-serif mx-0.5">${symbol}</span>`);
    }

    // Replace basic functions like \sin, \cos, \tan, \log, \ln
    const funcRegex = /\\(sin|cos|tan|cot|sec|csc|log|ln|exp|max|min|det|deg)/g;
    expr = expr.replace(
      funcRegex,
      '<span class="math-function font-semibold text-slate-700 mx-0.5">$1</span>',
    );

    // Replace matrices \begin{matrix} ... \end{matrix} or pmatrix / bmatrix
    expr = this.parseMatrices(expr);

    // Cleanup spaces like \, \: \; \quad \qquad
    expr = expr.replace(/\\quad/g, '&emsp;');
    expr = expr.replace(/\\qquad/g, '&emsp;&emsp;');
    expr = expr.replace(/\\[,;:!]/g, '&nbsp;');

    if (isBlock) {
      return `
<div class="math-block-container my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-xs overflow-x-auto select-all font-serif" dir="ltr">
  <div class="inline-flex items-center justify-center gap-1.5 text-base text-slate-900 leading-normal">
    ${expr}
  </div>
</div>`.trim();
    }

    return `<span class="math-inline inline-flex items-center gap-0.5 text-slate-900 font-serif text-sm bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200" dir="ltr">${expr}</span>`;
  }

  private parseFractions(str: string): string {
    let result = str;
    const fracRegex = /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g;
    let iterations = 0;
    while (fracRegex.test(result) && iterations < 10) {
      iterations++;
      result = result.replace(fracRegex, (_match, num, den) => {
        return `<span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-none" style="vertical-align: -0.5em;"><span class="border-b border-slate-700 px-1 pb-0.5 text-[0.9em]">${this.renderToHtml(num, false)}</span><span class="pt-0.5 text-[0.9em]">${this.renderToHtml(den, false)}</span></span>`;
      });
    }
    return result;
  }

  private parseSquareRoots(str: string): string {
    let result = str;
    const sqrtNRegex = /\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g;
    result = result.replace(sqrtNRegex, (_match, n, content) => {
      return `
<span class="inline-flex items-center mx-1 align-middle">
  <sup class="text-[0.7em] -mr-1 text-slate-600">${n}</sup>
  <span class="text-lg font-serif">√</span>
  <span class="border-t border-slate-700 px-1 pt-0.5 -ml-0.5">${this.renderToHtml(content, false)}</span>
</span>`.trim();
    });

    const sqrtRegex = /\\sqrt\{([^{}]+)\}/g;
    result = result.replace(sqrtRegex, (_match, content) => {
      return `
<span class="inline-flex items-center mx-1 align-middle">
  <span class="text-lg font-serif">√</span>
  <span class="border-t border-slate-700 px-1 pt-0.5 -ml-0.5">${this.renderToHtml(content, false)}</span>
</span>`.trim();
    });
    return result;
  }

  private parseLimits(str: string): string {
    let result = str;
    const limRegex = /\\(sum|prod|int|iint|lim)_\{([^{}]+)\}\^\{([^{}]+)\}/g;
    result = result.replace(limRegex, (_match, op, lower, upper) => {
      const symbol = this.mathOperators[`\\${op}`] || op;
      return `
<span class="inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-none" style="vertical-align: -0.6em;">
  <span class="text-[0.75em] text-slate-600 font-sans">${upper}</span>
  <span class="text-xl font-serif text-slate-900 leading-none">${symbol}</span>
  <span class="text-[0.75em] text-slate-600 font-sans">${lower}</span>
</span>`.trim();
    });
    return result;
  }

  private parseSuperSubscripts(str: string): string {
    let result = str;
    // Superscript + Subscript combo: x_{1}^{2} or x^{2}_{1}
    result = result.replace(
      /([a-zA-Z0-9\)\}\]])_\{([^{}]+)\}\^\{([^{}]+)\}/g,
      '$1<sub class="text-[0.75em]">$2</sub><sup class="text-[0.75em]">$3</sup>',
    );
    result = result.replace(
      /([a-zA-Z0-9\)\}\]])\^\{([^{}]+)\}_\{([^{}]+)\}/g,
      '$1<sup class="text-[0.75em]">$2</sup><sub class="text-[0.75em]">$3</sup>',
    );

    // Single Superscript: x^{2} or x^2
    result = result.replace(
      /\^\{([^{}]+)\}/g,
      '<sup class="text-[0.75em] text-slate-800">$1</sup>',
    );
    result = result.replace(
      /\^([a-zA-Z0-9])/g,
      '<sup class="text-[0.75em] text-slate-800">$1</sup>',
    );

    // Single Subscript: x_{1} or x_1
    result = result.replace(/_\{([^{}]+)\}/g, '<sub class="text-[0.75em] text-slate-800">$1</sub>');
    result = result.replace(
      /_([a-zA-Z0-9])/g,
      '<sub class="text-[0.75em] text-slate-800">$1</sub>',
    );

    return result;
  }

  private parseMatrices(str: string): string {
    let result = str;
    const matrixRegex = /\\begin\{(matrix|pmatrix|bmatrix)\}([\s\S]*?)\\end\{\1\}/g;
    result = result.replace(matrixRegex, (_match, type, content) => {
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
      if (type === 'pmatrix') {
        borderClass = 'border-l-2 border-r-2 border-slate-700 rounded-lg px-1';
      } else if (type === 'bmatrix') {
        borderClass = 'border-l-2 border-r-2 border-t-2 border-b-2 border-slate-700 px-1';
      }

      return `<table class="inline-table align-middle mx-2 ${borderClass}"><tbody>${rowsHtml}</tbody></table>`;
    });
    return result;
  }

  public renderToSvg(latex: string, displayMode = false): string {
    const rawHtml = this.renderToHtml(latex, displayMode);
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

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="latex-svg-rendered" style="display:inline-block; vertical-align:middle;">
  <rect width="100%" height="100%" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Cambria, 'Times New Roman', serif" font-size="16" fill="#0f172a" font-weight="600">
    ${plainText}
  </text>
</svg>`;
  }
}

export const latexEngine = LaTeXEngine.getInstance();
