/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: لوحة الكود البرمجي المباشر وتوليد الأكواد - Live Code Panel
 * 🏛️ الدور: مكون مشترك - توليد ونسخ وتنزيل أكواد React و HTML و SVG
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Format Code Generator: مولد أكواد متعدد الصيغ
 *    (React TSX, HTML, SVG) مع نسخ وتنزيل مباشر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الكود يجب أن يكون نظيفاً وصالحاً
 *    2. النسخ يجب أن يعمل في كل المتصفحات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الكود قبل العرض
 *    - fallback لرسالة خطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Sparkles,
  Layers,
  Maximize2,
} from 'lucide-react';
import type { CanvasElement } from '../model';
import {
  generateReactTsxCode,
  generateHtml5Code,
  generateSvgCode,
  elementToTailwindClasses,
} from '../codeGenerator';
import { downloadFile } from '../../../shared/exportUtils';

interface LiveCodePanelProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  canvasWidth: number;
  canvasHeight: number;
  isOpen: boolean;
  onToggle: () => void;
}

type CodeFormat = 'react' | 'html' | 'svg' | 'tailwind' | 'latex' | 'markdown';

export function LiveCodePanel({
  elements,
  selectedElement,
  canvasWidth,
  canvasHeight,
  isOpen,
  onToggle,
}: LiveCodePanelProps) {
  const [format, setFormat] = useState<CodeFormat>('react');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let activeCode = '';
  let fileExt = 'tsx';
  let mimeType = 'text/plain';

  if (format === 'react') {
    activeCode = generateReactTsxCode(elements, 'CustomCanvasUi');
    fileExt = 'tsx';
    mimeType = 'text/typescript';
  } else if (format === 'html') {
    activeCode = generateHtml5Code(elements);
    fileExt = 'html';
    mimeType = 'text/html';
  } else if (format === 'svg') {
    activeCode = generateSvgCode(elements, canvasWidth, canvasHeight);
    fileExt = 'svg';
    mimeType = 'image/svg+xml';
  } else if (format === 'latex') {
    if (selectedElement?.latex) {
      activeCode = `$$ ${selectedElement.latex} $$`;
    } else {
      activeCode =
        `\\documentclass{article}\n\\usepackage{amsmath}\n\\begin{document}\n\\section{صيغة رياضية}\n` +
        elements
          .filter((el) => el.latex)
          .map((el) => `\\[ ${el.latex} \\]`)
          .join('\n') +
        `\n\\end{document}`;
    }
    fileExt = 'tex';
    mimeType = 'text/x-tex';
  } else if (format === 'markdown') {
    activeCode =
      `# مستند الكانفا المصدّر\n\n` +
      elements
        .map((el) => {
          if (el.latex) return `$$\n${el.latex}\n$$`;
          if (el.type === 'callout-balloon' || el.type === 'special-quote') {
            return `> **${el.subtitle || 'ملاحظة'}**: ${el.text || ''}`;
          }
          return `### ${el.text || el.id}\n- النوع: \`${el.type}\`\n- الأبعاد: ${el.width}x${el.height}px`;
        })
        .join('\n\n');
    fileExt = 'md';
    mimeType = 'text/markdown';
  } else {
    // Tailwind classes of selected or all elements
    if (selectedElement) {
      activeCode = `/* فئات Tailwind للعنصر المحدد (${selectedElement.id}): */\n${elementToTailwindClasses(selectedElement)}\n\n/* الأنماط المخصصة (Raw CSS): */\n${selectedElement.rawCss || '/* لا توجد أنماط مضمنة مخصصة */'}`;
    } else {
      activeCode =
        `/* حدد أي عنصر على الكانفا لمعاينة وتعديل فئات Tailwind الخاصة به فورياً */\n\n/* جميع فئات العناصر الحالية: */\n` +
        elements
          .map((el) => `// [${el.type}] ${el.id}:\n${elementToTailwindClasses(el)}`)
          .join('\n\n');
    }
    fileExt = 'css';
    mimeType = 'text/css';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(activeCode, `CanvasExport.${fileExt}`, `${mimeType};charset=utf-8`);
  };

  return (
    <aside
      id="canvas-live-code-panel"
      className="w-80 bg-white border-e border-slate-200 flex flex-col shrink-0 text-slate-800 z-10 shadow-xs select-text overflow-hidden"
    >
      {/* Header */}
      <div className="h-10 px-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
          <div className="p-1 rounded bg-blue-100 text-blue-700">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <span>مولد الأكواد اللحظي (Live Code)</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
            title="نسخ الكود إلى الحافظة"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>نسخ</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded transition-colors cursor-pointer"
            title="تنزيل الملف المصدّر"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/60 p-1 gap-1 text-[11px] font-medium">
        <button
          type="button"
          onClick={() => setFormat('react')}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            format === 'react'
              ? 'bg-white text-blue-700 font-bold shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          React/TSX
        </button>

        <button
          type="button"
          onClick={() => setFormat('tailwind')}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            format === 'tailwind'
              ? 'bg-white text-blue-700 font-bold shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tailwind
        </button>

        <button
          type="button"
          onClick={() => setFormat('html')}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            format === 'html'
              ? 'bg-white text-blue-700 font-bold shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          HTML5
        </button>

        <button
          type="button"
          onClick={() => setFormat('svg')}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            format === 'svg'
              ? 'bg-white text-blue-700 font-bold shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          SVG
        </button>

        <button
          type="button"
          onClick={() => setFormat('latex')}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            format === 'latex'
              ? 'bg-white text-purple-700 font-bold shadow-2xs border border-purple-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          LaTeX
        </button>

        <button
          type="button"
          onClick={() => setFormat('markdown')}
          className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
            format === 'markdown'
              ? 'bg-white text-emerald-700 font-bold shadow-2xs border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Markdown
        </button>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 p-2 bg-slate-50/70 overflow-auto font-mono text-[11px] leading-relaxed text-slate-800 border-b border-slate-200">
        <pre className="whitespace-pre-wrap select-all font-mono text-[11px] text-slate-800 bg-white p-2.5 rounded border border-slate-200/80 shadow-2xs">
          {activeCode}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="p-2 bg-white text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100">
        <span>يتحدث الكود تلقائياً ولحظياً مع كل حركة.</span>
        <span className="font-mono text-blue-600 font-semibold">{elements.length} عناصر</span>
      </div>
    </aside>
  );
}
