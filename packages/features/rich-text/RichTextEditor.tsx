/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: packages/features/rich-text/RichTextEditor.tsx
 * 🎯 الهدف الرئيسي: محرر النصوص الغنية المتقدم ثيم فاتح نقي
 * 📋 المعايير: إتاحة أدوات التنسيق الشاملة، تصدير متعدد الصيغ، تفاعل ماوس
 * 🏷️ المعرف: FEAT-RICH-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useRef, useState, useEffect } from 'react';
import type { EditorPluginProps } from '../../core/types';
import { RichTextData, normalizeRichTextContent } from './model';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Download,
  FileText,
  Printer,
  Sparkles,
  Highlighter,
} from 'lucide-react';

export function RichTextEditor({ document, onChange }: EditorPluginProps<RichTextData>) {
  const contentHtml = normalizeRichTextContent(document.data?.content);
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== contentHtml) {
      editorRef.current.innerHTML = contentHtml || '<h1>عنوان المستند</h1><p>أدخل النص هنا...</p>';
    }
    calculateWordCount();
  }, [document.id]);

  const calculateWordCount = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    calculateWordCount();
    onChange({
      ...document,
      updatedAt: new Date().toISOString(),
      version: document.version + 1,
      data: { content: html },
    });
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    documentCommandExec(command, value);
    handleInput();
  };

  const documentCommandExec = (command: string, value?: string) => {
    try {
      window.document.execCommand(command, false, value);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-800 font-sans overflow-hidden dir-rtl select-none">
      {/* Editor Main Format Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between gap-2 shrink-0 flex-wrap z-10 shadow-2xs">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Headings */}
          <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2 ml-1">
            <button
              onClick={() => execCmd('formatBlock', '<h1>')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              title="عنوان رئيسي H1"
            >
              <Heading1 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => execCmd('formatBlock', '<h2>')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              title="عنوان فرعي H2"
            >
              <Heading2 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => execCmd('formatBlock', '<h3>')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              title="عنوان H3"
            >
              <Heading3 className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Text Style */}
          <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2 ml-1">
            <button
              onClick={() => execCmd('bold')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="عريض (Bold)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd('italic')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="مائل (Italic)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd('underline')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="سطر تحت النص (Underline)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd('strikeThrough')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="مشطوب (Strikethrough)"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2 ml-1">
            <button
              onClick={() => execCmd('justifyRight')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="محاذاة لليمين"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd('justifyCenter')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="محاذاة للوسط"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd('justifyLeft')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="محاذاة لليسار"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd('justifyFull')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="ضبط المحاذاة (Justify)"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => execCmd('insertUnorderedList')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="قائمة نقطية"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd('insertOrderedList')}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
              title="قائمة رقمية"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>الكلمات: {wordCount}</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة المستند</span>
          </button>
        </div>
      </div>

      {/* Main Document Paper Canvas */}
      <div className="flex-1 p-8 bg-slate-100/90 overflow-auto flex justify-center">
        <div className="w-[800px] min-h-[950px] bg-white rounded-xl shadow-xl border border-slate-200/90 p-12 transition-all my-auto">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="prose prose-slate max-w-none focus:outline-none min-h-[850px] text-slate-900 leading-relaxed font-sans"
            style={{ direction: 'rtl', textAlign: 'right' }}
          />
        </div>
      </div>
    </div>
  );
}
