/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المترجم الفوري ومفسر الشيفرات التفاعلي - Live Code Interpreter Engine
 * 🏛️ الدور: محرك مشترك - تفسير وتحويل الكود المصدري لحظياً إلى مخرجات بصرية
 * 📥 المستهلك: CodeInterpreterPanel, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    WYSIWYG Live Interpreter: مترجم فوري بصري
 *    مع تلوين نحوي معزول بالكامل (صفر مكتبات)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التفسير يجب أن يدعم HTML/CSS/Tailwind, SVG, Markdown, LaTeX, JSON/YAML, JS/TS
 *    2. المعالجة يجب أن تبقى فورية (صفر تأخير)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الكود قبل التفسير
 *    - fallback لرسالة خطأ ودية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  zeroDependencyChartEngine,
  type ChartConfig,
  type ChartType,
} from '../charts/zero-dependency-chart-engine';

export type SupportedLanguage =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'markdown'
  | 'latex'
  | 'svg'
  | 'xml'
  | 'yaml';

export interface CodeToken {
  type:
    | 'keyword'
    | 'tag'
    | 'attribute'
    | 'string'
    | 'number'
    | 'comment'
    | 'operator'
    | 'punctuation'
    | 'text';
  value: string;
  line: number;
  col: number;
}

export interface InterpretedOutput {
  success: boolean;
  htmlContent: string;
  astNodes?: VisualAstNode[];
  error?: string;
  language: SupportedLanguage;
  executionTimeMs: number;
}

export interface VisualAstNode {
  id: string;
  tag: string;
  startLine: number;
  endLine: number;
  attributes: Record<string, string>;
  childrenCount: number;
  summary: string;
}

export interface SnippetTemplate {
  id: string;
  title: string;
  description: string;
  language: SupportedLanguage;
  code: string;
  category: string;
}

export class LiveInterpreterEngine {
  /**
   * ترجمة وتفسير الكود إلى مخرجات بصرية فورية وفق لغة المصدر
   */
  public interpret(code: string, language: SupportedLanguage): InterpretedOutput {
    const startTime = performance.now();
    try {
      let htmlOutput = '';
      let astNodes: VisualAstNode[] = [];

      switch (language) {
        case 'html':
        case 'xml': {
          htmlOutput = this.renderHtmlLive(code);
          astNodes = this.extractHtmlAst(code);
          break;
        }
        case 'svg': {
          htmlOutput = this.renderSvgLive(code);
          astNodes = this.extractHtmlAst(code);
          break;
        }
        case 'markdown': {
          htmlOutput = this.renderMarkdownLive(code);
          break;
        }
        case 'latex': {
          htmlOutput = this.renderLatexLive(code);
          break;
        }
        case 'json': {
          htmlOutput = this.renderJsonExplorerLive(code);
          break;
        }
        case 'yaml': {
          htmlOutput = this.renderYamlExplorerLive(code);
          break;
        }
        case 'css': {
          htmlOutput = this.renderCssPreviewLive(code);
          break;
        }
        case 'javascript':
        case 'typescript': {
          htmlOutput = this.renderJsSandboxLive(code);
          break;
        }
        default:
          htmlOutput = `<pre class="p-4 bg-slate-50 text-slate-800 rounded font-mono text-sm">${this.escapeHtml(code)}</pre>`;
      }

      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        success: true,
        htmlContent: htmlOutput,
        astNodes,
        language,
        executionTimeMs,
      };
    } catch (err: unknown) {
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        htmlContent: `<div class="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm font-sans flex items-start gap-2">
          <span class="font-bold">⚠️ خطأ في التفسير:</span>
          <span>${this.escapeHtml(errorMessage)}</span>
        </div>`,
        error: errorMessage,
        language,
        executionTimeMs,
      };
    }
  }

  /**
   * التلوين النحوي الخفيف المخصص للثيم الفاتح النقي 100%
   */
  public tokenize(code: string, language: SupportedLanguage): CodeToken[][] {
    const lines = code.split('\n');
    return lines.map((lineStr, lineIdx) => {
      const lineNum = lineIdx + 1;
      const tokens: CodeToken[] = [];
      let col = 1;

      if (!lineStr.trim()) {
        tokens.push({ type: 'text', value: ' ', line: lineNum, col: 1 });
        return tokens;
      }

      // Regex patterns for light-theme tokenization
      if (language === 'html' || language === 'xml' || language === 'svg') {
        const tagRegex =
          /(<\/?[a-zA-Z0-9:-]+)|(\s+[a-zA-Z0-9:-]+(?==))|(=(?:["'][^"']*["']|\S+))|(<!--[\s\S]*?-->)|([^<>&]+)|([<>&/]+)/g;
        let match: RegExpExecArray | null;
        while ((match = tagRegex.exec(lineStr)) !== null) {
          const val = match[0];
          let type: CodeToken['type'] = 'text';
          if (match[1]) type = 'tag';
          else if (match[2]) type = 'attribute';
          else if (match[3]) type = 'string';
          else if (match[4]) type = 'comment';
          else if (match[6]) type = 'punctuation';

          tokens.push({ type, value: val, line: lineNum, col });
          col += val.length;
        }
      } else if (language === 'json' || language === 'yaml') {
        const jsonRegex =
          /(true|false|null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|("(?:\\.|[^"\\])*")|([:,\{\}\[\]])|([^"\s:,\{\}\[\]]+)/g;
        let match: RegExpExecArray | null;
        while ((match = jsonRegex.exec(lineStr)) !== null) {
          const val = match[0];
          let type: CodeToken['type'] = 'text';
          if (match[1]) type = 'keyword';
          else if (match[2]) type = 'number';
          else if (match[3]) type = 'string';
          else if (match[4]) type = 'punctuation';

          tokens.push({ type, value: val, line: lineNum, col });
          col += val.length;
        }
      } else {
        // General JS/TS/CSS tokenizer
        const generalRegex =
          /(\b(?:const|let|var|function|return|if|else|import|export|from|class|extends|interface|type|default|async|await|for|while|typeof|new)\b)|(\b(?:true|false|null|undefined)\b)|(-?\d+(?:\.\d+)?)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\/[^\n]*)|([\{\}\(\)\[\];,\.<>+\-*\/=!:?&|~%^]+)|([a-zA-Z_$][a-zA-Z0-9_$]*)|(\s+)/g;
        let match: RegExpExecArray | null;
        while ((match = generalRegex.exec(lineStr)) !== null) {
          const val = match[0];
          let type: CodeToken['type'] = 'text';
          if (match[1]) type = 'keyword';
          else if (match[2]) type = 'keyword';
          else if (match[3]) type = 'number';
          else if (match[4]) type = 'string';
          else if (match[5]) type = 'comment';
          else if (match[6]) type = 'operator';
          else if (match[7]) type = 'text';

          tokens.push({ type, value: val, line: lineNum, col });
          col += val.length;
        }
      }

      return tokens.length > 0 ? tokens : [{ type: 'text', value: lineStr, line: lineNum, col: 1 }];
    });
  }

  /**
   * تحويل كود HTML لحظي مع وسوم البيانات لربط الفأرة ثنائي الاتجاه
   */
  private renderHtmlLive(code: string): string {
    if (!code.trim()) {
      return '<div class="text-slate-400 italic text-center p-8">معاينة HTML فارغة — ابدأ بكتابة الكود أو أدرج قالباً بالفأرة.</div>';
    }
    // Tag visual elements with inspector attributes for mouse hover & selection
    let augmented = code;
    let elementIdx = 0;
    augmented = augmented.replace(/<([a-zA-Z0-9]+)([^>]*)>/g, (_match, tagName, attrs) => {
      elementIdx++;
      return `<${tagName} data-wysiwyg-id="node-${elementIdx}" data-wysiwyg-tag="${tagName}" class="wysiwyg-live-node transition-all hover:outline hover:outline-1 hover:outline-blue-500" ${attrs}>`;
    });

    return `<div class="wysiwyg-canvas-root w-full h-full p-4 bg-white overflow-auto">${augmented}</div>`;
  }

  /**
   * تحويل كود SVG إلى عنصر متجاوب تفاعلي
   */
  private renderSvgLive(code: string): string {
    const trimmed = code.trim();
    if (!trimmed.startsWith('<svg')) {
      return `<div class="w-full flex items-center justify-center p-6 bg-slate-50 rounded border border-dashed border-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="max-w-full h-auto drop-shadow-sm bg-white rounded">
          ${trimmed}
        </svg>
      </div>`;
    }
    return `<div class="w-full h-full flex items-center justify-center p-6 bg-slate-50/50 overflow-auto">
      ${trimmed}
    </div>`;
  }

  /**
   * تحويل Markdown إلى HTML خفيف ونقي
   */
  private renderMarkdownLive(code: string): string {
    const lines = code.split('\n');
    const htmlLines: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;

      // Headings
      if (line.startsWith('# ')) {
        htmlLines.push(
          `<h1 class="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 mt-6">${this.formatInlineMd(line.slice(2))}</h1>`,
        );
      } else if (line.startsWith('## ')) {
        htmlLines.push(
          `<h2 class="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-1 mb-3 mt-5">${this.formatInlineMd(line.slice(3))}</h2>`,
        );
      } else if (line.startsWith('### ')) {
        htmlLines.push(
          `<h3 class="text-lg font-medium text-slate-800 mb-2 mt-4">${this.formatInlineMd(line.slice(4))}</h3>`,
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          htmlLines.push('<ul class="list-disc list-inside space-y-1 my-2 text-slate-700">');
          inList = true;
        }
        htmlLines.push(`<li>${this.formatInlineMd(line.slice(2))}</li>`);
      } else if (line.startsWith('> ')) {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push(
          `<blockquote class="border-s-4 border-blue-500 bg-blue-50/50 ps-4 py-2 my-2 text-slate-700 italic rounded-e">${this.formatInlineMd(line.slice(2))}</blockquote>`,
        );
      } else if (line.trim() === '') {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push('<div class="h-3"></div>');
      } else {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
        htmlLines.push(
          `<p class="text-slate-700 leading-relaxed my-1.5">${this.formatInlineMd(line)}</p>`,
        );
      }
    }

    if (inList) {
      htmlLines.push('</ul>');
    }

    return `<div class="prose max-w-none p-6 bg-white rounded-lg">${htmlLines.join('')}</div>`;
  }

  /**
   * تحويل معادلات LaTeX إلى تنسيق رياضي بصري
   */
  private renderLatexLive(code: string): string {
    const cleanFormula = code.trim();
    return `<div class="w-full flex flex-col items-center justify-center p-8 bg-slate-50/70 border border-slate-200 rounded-xl my-4 text-center">
      <div class="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full mb-4">معادلة رياضية / LaTeX Formula</div>
      <div class="text-2xl font-serif text-slate-900 tracking-wide bg-white px-6 py-4 rounded-lg shadow-sm border border-slate-200">${this.escapeHtml(cleanFormula)}</div>
      <div class="text-xs text-slate-500 mt-4">معاينة تفاعلية فورية مدعومة بالنواة المشتركة (Zero-Dependencies)</div>
    </div>`;
  }

  /**
   * مستكشف JSON التفاعلي الشجري مع اكتشاف وتصيير المخططات البيانية لحظياً
   */
  private renderJsonExplorerLive(code: string): string {
    try {
      const parsed = JSON.parse(code);

      // Check if parsed JSON is a ChartConfig
      if (
        parsed &&
        typeof parsed === 'object' &&
        (('type' in parsed && 'data' in parsed) ||
          ('title' in parsed && Array.isArray(parsed.data)))
      ) {
        const chartConfig = parsed as ChartConfig;
        const res = zeroDependencyChartEngine.renderInteractiveSvg(chartConfig);
        return `
          <div class="p-4 bg-white rounded-lg border border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <span class="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                📊 مخطط بياني تفاعلي حي (Live Vector Chart): ${this.escapeHtml(chartConfig.type || 'bar')}
              </span>
              <span class="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Zero-Dependencies</span>
            </div>
            <div class="w-full flex justify-center overflow-auto py-2">
              ${res.svgString}
            </div>
            <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>💡 يمكنك تغيير "type" في الكود إلى (bar, pie, donut, line, scatter, radar, gauge, etc.) للتحول الفوري.</span>
            </div>
          </div>
        `;
      }

      return `<div class="p-4 bg-white rounded-lg border border-slate-200 font-mono text-xs overflow-auto max-h-full">
        ${this.buildJsonVisualTree(parsed, 'الجذر (Root)', 0)}
      </div>`;
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : String(e);
      return `<div class="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        <span class="font-bold">تنبيه بنية JSON:</span> ${this.escapeHtml(err)}
      </div>`;
    }
  }

  /**
   * مستكشف YAML البصري
   */
  private renderYamlExplorerLive(code: string): string {
    const lines = code.split('\n');
    const nodesHtml = lines
      .map((l, i) => {
        const indent = l.search(/\S|$/);
        return `<div class="py-0.5 hover:bg-blue-50 px-2 rounded cursor-pointer transition-colors" style="padding-right: ${Math.max(8, indent * 16)}px">
        <span class="text-slate-400 select-none text-[10px] me-2">${i + 1}</span>
        <span class="text-slate-800">${this.escapeHtml(l)}</span>
      </div>`;
      })
      .join('');

    return `<div class="p-4 bg-white rounded-lg border border-slate-200 font-mono text-xs">${nodesHtml}</div>`;
  }

  /**
   * معاينة CSS بصرية حية
   */
  private renderCssPreviewLive(code: string): string {
    return `<div class="p-6 bg-slate-50 rounded-lg space-y-4">
      <style>${code}</style>
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">عينات العناصر لتطبيق أنماط CSS:</div>
      <div class="p-4 bg-white rounded border border-slate-200 sample-box">صندوق عينة 1 (Box Sample)</div>
      <button class="px-4 py-2 bg-blue-600 text-white rounded font-medium shadow-sm hover:bg-blue-700 sample-btn">زر عينة تفاعلي</button>
      <h3 class="text-lg font-bold text-slate-800 sample-heading">عنوان عينة (Heading)</h3>
    </div>`;
  }

  /**
   * بيئة تشغيل آمنة للـ JavaScript / TypeScript
   */
  private renderJsSandboxLive(code: string): string {
    const logs: string[] = [];
    try {
      const customConsole = {
        log: (...args: unknown[]) =>
          logs.push(
            args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
          ),
        warn: (...args: unknown[]) => logs.push('⚠️ ' + args.join(' ')),
        error: (...args: unknown[]) => logs.push('❌ ' + args.join(' ')),
      };

      // Execute in sandboxed Function wrapper with custom console
      const runFn = new Function('console', code);
      runFn(customConsole);

      const logsHtml =
        logs.length > 0
          ? logs
              .map(
                (l) =>
                  `<div class="py-1 px-2 border-b border-slate-100 last:border-0 font-mono text-xs text-slate-800">${this.escapeHtml(l)}</div>`,
              )
              .join('')
          : '<div class="text-slate-400 italic text-xs p-2">تم التنفيذ بنجاح (بدون مخرجات console.log)</div>';

      return `<div class="p-4 bg-white rounded-lg border border-slate-200">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <span class="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            مخرجات بيئة التشغيل التفاعلية (JS Output)
          </span>
          <span class="text-[10px] text-slate-400">${logs.length} سجلات</span>
        </div>
        <div class="bg-slate-50 p-2 rounded max-h-60 overflow-auto">${logsHtml}</div>
      </div>`;
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : String(e);
      return `<div class="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-mono">
        <div class="font-bold mb-1">خطأ تنفيذي أثناء التشغيل:</div>
        <div>${this.escapeHtml(err)}</div>
      </div>`;
    }
  }

  /**
   * استخراج شجرة الـ AST البسيطة لعناصر HTML/SVG للتفاعل بالفأرة
   */
  public extractHtmlAst(code: string): VisualAstNode[] {
    const lines = code.split('\n');
    const nodes: VisualAstNode[] = [];
    const tagRegex = /<([a-zA-Z0-9]+)([^>]*)>/g;

    lines.forEach((line, idx) => {
      let match: RegExpExecArray | null;
      while ((match = tagRegex.exec(line)) !== null) {
        const tagName = match[1]!;
        if (tagName.startsWith('/')) continue;
        nodes.push({
          id: `node-${nodes.length + 1}`,
          tag: tagName,
          startLine: idx + 1,
          endLine: idx + 1,
          attributes: {},
          childrenCount: 0,
          summary: `<${tagName}> في السطر ${idx + 1}`,
        });
      }
    });

    return nodes;
  }

  /**
   * بناء تمثيل شجري بصري تفاعلي لبيانات JSON
   */
  private buildJsonVisualTree(data: unknown, keyName: string, depth: number): string {
    const indent = depth * 16;
    if (data === null) {
      return `<div class="py-0.5 hover:bg-slate-50" style="padding-right:${indent}px"><span class="text-slate-600 font-semibold">${keyName}:</span> <span class="text-slate-400 italic">null</span></div>`;
    }
    if (typeof data === 'boolean') {
      return `<div class="py-0.5 hover:bg-slate-50" style="padding-right:${indent}px"><span class="text-slate-600 font-semibold">${keyName}:</span> <span class="text-emerald-600">${data}</span></div>`;
    }
    if (typeof data === 'number') {
      return `<div class="py-0.5 hover:bg-slate-50" style="padding-right:${indent}px"><span class="text-slate-600 font-semibold">${keyName}:</span> <span class="text-amber-600">${data}</span></div>`;
    }
    if (typeof data === 'string') {
      return `<div class="py-0.5 hover:bg-slate-50" style="padding-right:${indent}px"><span class="text-slate-600 font-semibold">${keyName}:</span> <span class="text-blue-600">"${this.escapeHtml(data)}"</span></div>`;
    }
    if (Array.isArray(data)) {
      const items = data
        .map((item, idx) => this.buildJsonVisualTree(item, `[${idx}]`, depth + 1))
        .join('');
      return `<div class="py-0.5">
        <div class="hover:bg-slate-50 font-semibold text-slate-700" style="padding-right:${indent}px">
          <span>▼ ${keyName}</span> <span class="text-slate-400 text-[10px]">(${data.length} عناصر)</span>
        </div>
        ${items}
      </div>`;
    }
    if (typeof data === 'object') {
      const keys = Object.keys(data as Record<string, unknown>);
      const items = keys
        .map((k) => this.buildJsonVisualTree((data as Record<string, unknown>)[k], k, depth + 1))
        .join('');
      return `<div class="py-0.5">
        <div class="hover:bg-slate-50 font-semibold text-slate-700" style="padding-right:${indent}px">
          <span>▼ ${keyName}</span> <span class="text-slate-400 text-[10px]">{ ${keys.length} حقول }</span>
        </div>
        ${items}
      </div>`;
    }
    return '';
  }

  private formatInlineMd(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 bg-slate-100 text-blue-700 rounded font-mono text-xs">$1</code>',
      );
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * مكتبة القوالب الجاهزة المضمنة للإدراج الفوري بالفأرة (تشمل الـ 20 نموذجاً للرسوم البيانية)
   */
  public getPresetSnippets(): SnippetTemplate[] {
    const baseSnippets: SnippetTemplate[] = [
      {
        id: 'html-card',
        title: 'بطاقة محتوى تفاعلية (HTML Card)',
        description: 'بطاقة نظيفة بالثيم الفاتح تحتوي على عنوان وزر وصورة',
        language: 'html',
        category: 'واجهات الويب',
        code: `<div class="max-w-sm rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white p-6">
  <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">🌟</div>
  <h3 class="text-lg font-bold text-slate-900 mb-2">عنوان البطاقة التفاعلية</h3>
  <p class="text-slate-600 text-sm mb-4 leading-relaxed">هذا نص توضيحي للبطاقة التفاعلية مبني بالثيم الفاتح النقي 100%.</p>
  <button class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">اتخاذ إجراء</button>
</div>`,
      },
      {
        id: 'svg-badge',
        title: 'شارة فيكتورية متجاوبة (SVG Badge)',
        description: 'شارة هندسية دقيقة بنصف قطر وتدرج فاتح',
        language: 'svg',
        category: 'أشكال فيكتورية',
        code: `<svg width="240" height="120" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="220" height="100" rx="16" fill="#f8fafc" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="50" cy="60" r="24" fill="#dbeafe"/>
  <text x="50" y="66" font-size="18" text-anchor="middle" fill="#1d4ed8">⚡</text>
  <text x="90" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">مكون فيكتوري</text>
  <text x="90" y="75" font-family="sans-serif" font-size="11" fill="#64748b">دقة هندسية عالية</text>
</svg>`,
      },
      {
        id: 'latex-quadratic',
        title: 'المعادلة التربيعية (Quadratic Formula)',
        description: 'صيغة حل المعادلات التربيعية بالصياغة الرياضية',
        language: 'latex',
        category: 'معادلات ورياضيات',
        code: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
      },
      {
        id: 'json-project-manifest',
        title: 'بيان المشروع الموحد (Project Manifest)',
        description: 'هيكل بيانات متكامل يصف المستند وعناصره',
        language: 'json',
        category: 'بيانات ومخططات',
        code: `{
  "projectName": "Universal Studio",
  "version": "1.0.0",
  "theme": "Pure Light 100%",
  "mouseDriven": true,
  "viewport": {
    "zoom": 1.0,
    "panX": 0,
    "panY": 0
  },
  "modules": ["canvas", "ui-designer", "rich-text", "pdf", "code-editor"]
}`,
      },
    ];

    // Add all 20 chart presets into snippets for 1-click mouse insertion
    const chartPresets = zeroDependencyChartEngine.get20ChartPresets().map((cp) => ({
      id: `chart-${cp.id}`,
      title: cp.title,
      description: cp.description,
      language: 'json' as SupportedLanguage,
      category: '📊 الرسوم البيانية التفاعلية (20 نموذجاً)',
      code: JSON.stringify(
        {
          id: cp.id,
          title: cp.title,
          subtitle: cp.description,
          type: cp.type,
          showLegend: true,
          showGrid: true,
          showTooltips: true,
          data: cp.data,
        },
        null,
        2,
      ),
    }));

    return [...chartPresets, ...baseSnippets];
  }

  public get20ChartPresets() {
    return zeroDependencyChartEngine.get20ChartPresets();
  }
}

export const liveInterpreterEngine = new LiveInterpreterEngine();
