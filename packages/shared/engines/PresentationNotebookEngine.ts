/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك العروض التقديمية ودفاتر الملاحظات - خلايا متعددة الأنواع
 * 🏛️ الدور: محرك مشترك - إنشاء وعرض العروض التقديمية التفاعلية
 * 📥 المستهلك: InteractiveWysiwygCodeStudio, SharedFormattingToolbar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Notebook Cell Architecture: بناء على نمط الخلايا (Markdown, LaTeX, Code, Callout)
 *    مع عرض الشرائح بملء الشاشة والانتقالات الانسيابية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الخلايا الكبيرة جداً قد تسبب بطء في العرض
 *    2. قوالب Header/Footer يجب تحديثها عند تغيير المحتوى
 *    3. الانتقالات قد تتعارض مع Radix UI animations
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع الخلية قبل التصيير (type narrowing)
 *    - تعامل مع الخلايا الفارغة بقيم افتراضية
 *    - إجمالي الشرائح يجب أن يتحدث تلقائياً
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/PresentationNotebookEngine.ts
/**
 * محرك العروض التقديمية ودفاتر الملاحظات التفاعلية (Presentation Slides & Notebook Engine)
 * يدعم:
 * 1. خلايا وشرائح متعددة الأنواع (Markdown, LaTeX Math, Code Snippets, Callout Boxes, Drawing Canvas)
 * 2. قوالب رأس وذيل الصفحة (Header / Footer) مع الترقيم الآلي والتاريخ والعنوان
 * 3. مربعات النصوص الخاصة والتنبيهات (Special Text Boxes: Quote, Tip, Warning, Equation)
 * 4. تشغيل واستعراض العرض التقديمي بملء الشاشة مع الانتقالات الانسيابية
 * متوافق 100% مع الثيم الفاتح النقي وبدون أي مكتبات خارجية
 */

import { markdownEngine } from './MarkdownEngine';
import { latexEngine } from './LaTeXEngine';

export type NotebookCellType = 'markdown' | 'latex' | 'code' | 'callout' | 'quote' | 'canvas-drawing';

export interface HeaderFooterTemplate {
  showHeader: boolean;
  showFooter: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  showDate?: boolean;
  showPageNumbers?: boolean;
  authorName?: string;
  themeColor?: string;
}

export interface NotebookCell {
  id: string;
  type: NotebookCellType;
  content: string; // Markdown text, LaTeX code, JS/TS code, etc.
  title?: string;
  language?: string;
  calloutType?: 'info' | 'success' | 'warning' | 'tip' | 'math';
  output?: string;
  isCollapsed?: boolean;
}

export interface NotebookSlide {
  id: string;
  title: string;
  slideNumber: number;
  layout: 'single-col' | 'two-col' | 'title-hero' | 'split-code';
  cells: NotebookCell[];
  notes?: string;
  backgroundColor?: string;
}

export class PresentationNotebookEngine {
  private static instance: PresentationNotebookEngine;

  public static getInstance(): PresentationNotebookEngine {
    if (!PresentationNotebookEngine.instance) {
      PresentationNotebookEngine.instance = new PresentationNotebookEngine();
    }
    return PresentationNotebookEngine.instance;
  }

  /**
   * إنشاء دفتر ملاحظات / عرض تقديمي نموذجي
   */
  public createSampleNotebook(): {
    title: string;
    headerFooter: HeaderFooterTemplate;
    slides: NotebookSlide[];
  } {
    return {
      title: 'العرض التقديمي الذكي والمستند التفاعلي',
      headerFooter: {
        showHeader: true,
        showFooter: true,
        headerTitle: 'ستوديو التصميم والتحرير المتكامل',
        headerSubtitle: 'وثيقة تفاعلية وعرض تقديمي',
        showDate: true,
        showPageNumbers: true,
        authorName: 'فريق التطوير',
        themeColor: '#2563eb',
      },
      slides: [
        {
          id: 'slide-1',
          title: 'المقدمة والأهداف الأساسية',
          slideNumber: 1,
          layout: 'title-hero',
          cells: [
            {
              id: 'cell-1-1',
              type: 'markdown',
              content: `# مرحباً بكم في بيئة العروض التقديمية والنوتبوك 🚀\nنظام متكامل يدعم تحرير النصوص ومربعات الشرح والمعادلات الرياضية والشفرات البرمجية مباشرة بنمط فاتح نقي.`,
            },
            {
              id: 'cell-1-2',
              type: 'callout',
              title: 'ملاحظة مهمة للمصممين',
              content: 'يمكنك إضافة خلايا كود أو معادلات أو نصوص ماركدون مع دعم التحديث الفوري المباشر.',
              calloutType: 'info',
            },
          ],
        },
        {
          id: 'slide-2',
          title: 'المعادلات الرياضية والنماذج العلمية',
          slideNumber: 2,
          layout: 'single-col',
          cells: [
            {
              id: 'cell-2-1',
              type: 'markdown',
              content: `### صياغة المعادلات بدقة LaTeX\nيدعم المحرك الصيغ الرياضية المعقدة مثل نظرية النسبية والكسور والجذور والتكاملات:`,
            },
            {
              id: 'cell-2-2',
              type: 'latex',
              content: `E = mc^2 \\quad \\text{و} \\quad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad \\text{و} \\quad \\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}`,
            },
            {
              id: 'cell-2-3',
              type: 'quote',
              title: 'اقتباس علمي',
              content: '"الرياضيات هي اللغة التي كتب بها الله هذا الكون." — جاليليو جاليلي',
            },
          ],
        },
        {
          id: 'slide-3',
          title: 'الشيفرة البرمجية والتنفيذ الحي',
          slideNumber: 3,
          layout: 'split-code',
          cells: [
            {
              id: 'cell-3-1',
              type: 'code',
              title: 'دالة معالجة الرسوم المتجهة (SVG Generator)',
              language: 'typescript',
              content: `function generateSmartPath(x1: number, y1: number, x2: number, y2: number): string {\n  const midX = (x1 + x2) / 2;\n  return \`M \${x1} \${y1} Q \${midX} \${y1 - 30}, \${x2} \${y2}\`;\n}`,
              output: 'تم التحقق من الدالة بنجاح (TypeScript Type-Safe ✓)',
            },
            {
              id: 'cell-3-2',
              type: 'callout',
              title: 'نصيحة تقنية (Best Practice)',
              content: 'استخدم دائماً التوابع النقية لضمان سرعة التصيير وثبات البيانات.',
              calloutType: 'tip',
            },
          ],
        },
      ],
    };
  }

  /**
   * تصيير خلية نوت بوك مفردة إلى HTML
   */
  public renderCellToHtml(cell: NotebookCell): string {
    switch (cell.type) {
      case 'markdown':
        return `<div class="notebook-cell-markdown text-slate-800 leading-relaxed">${markdownEngine.toHtml(cell.content)}</div>`;

      case 'latex':
        return latexEngine.renderToHtml(cell.content, true);

      case 'code':
        return `
<div class="notebook-cell-code my-3 border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-900/5">
  ${cell.title ? `<div class="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
    <span>💻 ${cell.title}</span>
    <span class="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">${cell.language || 'code'}</span>
  </div>` : ''}
  <pre class="p-4 bg-slate-50 font-mono text-xs text-slate-800 overflow-x-auto select-all leading-relaxed" dir="ltr"><code>${this.escapeHtml(cell.content)}</code></pre>
  ${cell.output ? `<div class="px-4 py-2.5 bg-emerald-50/70 border-t border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
    <span>▶ النتيجة:</span>
    <span class="font-mono">${cell.output}</span>
  </div>` : ''}
</div>`.trim();

      case 'quote':
        return `
<blockquote class="my-4 p-4 border-r-4 border-amber-500 bg-amber-50/50 rounded-l-xl shadow-xs">
  ${cell.title ? `<strong class="block text-xs font-bold text-amber-900 mb-1">${cell.title}</strong>` : ''}
  <p class="text-xs text-slate-700 italic leading-relaxed m-0">${cell.content}</p>
</blockquote>`.trim();

      case 'callout': {
        const typeStyles = {
          info: { bg: 'bg-blue-50/70', border: 'border-blue-500', title: 'text-blue-900', icon: 'ℹ️' },
          success: { bg: 'bg-emerald-50/70', border: 'border-emerald-500', title: 'text-emerald-900', icon: '✅' },
          warning: { bg: 'bg-amber-50/70', border: 'border-amber-500', title: 'text-amber-900', icon: '⚠️' },
          tip: { bg: 'bg-purple-50/70', border: 'border-purple-500', title: 'text-purple-900', icon: '💡' },
          math: { bg: 'bg-sky-50/70', border: 'border-sky-500', title: 'text-sky-900', icon: '📐' },
        };
        const st = typeStyles[cell.calloutType || 'info'];
        return `
<div class="my-3 p-4 ${st.bg} border-r-4 ${st.border} rounded-l-xl shadow-xs">
  <div class="flex items-center gap-2 mb-1.5">
    <span>${st.icon}</span>
    <strong class="text-xs font-bold ${st.title}">${cell.title || 'توضيح'}</strong>
  </div>
  <div class="text-xs text-slate-700 leading-relaxed pr-6">${cell.content}</div>
</div>`.trim();
      }

      default:
        return `<div class="p-3 text-xs text-slate-600">${cell.content}</div>`;
    }
  }

  /**
   * تصيير شريحة كاملة مع رأس وذيل الصفحة
   */
  public renderSlideToHtml(slide: NotebookSlide, headerFooter: HeaderFooterTemplate, totalSlides = 1): string {
    const cellsHtml = slide.cells.map((c) => this.renderCellToHtml(c)).join('\n');
    const dateStr = new Date().toLocaleDateString('ar-EG');

    return `
<div class="notebook-slide-page p-8 bg-white border border-slate-200 rounded-2xl shadow-sm my-6 flex flex-col justify-between min-h-[500px]" style="background-color: ${slide.backgroundColor || '#ffffff'};">
  ${headerFooter.showHeader ? `
  <header class="flex items-center justify-between pb-3 mb-6 border-b border-slate-200 text-xs font-semibold text-slate-500">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full" style="background-color: ${headerFooter.themeColor || '#2563eb'};"></span>
      <span class="font-bold text-slate-800">${headerFooter.headerTitle || ''}</span>
      ${headerFooter.headerSubtitle ? `<span class="text-slate-400">|</span><span>${headerFooter.headerSubtitle}</span>` : ''}
    </div>
    ${headerFooter.showDate ? `<span>${dateStr}</span>` : ''}
  </header>` : ''}

  <main class="flex-1 space-y-4">
    <h2 class="text-xl font-extrabold text-slate-900 mb-4 pb-1">${slide.title}</h2>
    ${cellsHtml}
  </main>

  ${headerFooter.showFooter ? `
  <footer class="flex items-center justify-between pt-3 mt-6 border-t border-slate-200 text-xs text-slate-400">
    <span>${headerFooter.authorName || 'ستوديو التصميم الذكي'}</span>
    ${headerFooter.showPageNumbers ? `<span class="font-bold text-slate-600">صفحة ${slide.slideNumber} من ${totalSlides}</span>` : ''}
  </footer>` : ''}
</div>`.trim();
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

export const presentationNotebookEngine = PresentationNotebookEngine.getInstance();
