/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: فاحص واستيراد صفحات الويب وتحويلها إلى عناصر كانفا - Web Drop Inspector
 * 🏛️ الدور: مكون مشترك - استيراد HTML وتحويله إلى عناصر قابلة للتحرير
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    DOM-to-Canvas Pipeline: خط أنابيب لتحويل صفحات الويب
 *    إلى عناصر كانفا مع استخراج الألوان والخطوط والأبعاد
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. HTML يجب أن يكون صالحاً قبل التحويل
 *    2. بعض العناصر قد لا تتحول بدقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - sanitize HTML قبل التحليل
 *    - fallback لعنصر نصي
 *    - timeout على التحليل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Globe,
  UploadCloud,
  FileCode2,
  Sparkles,
  Palette,
  Check,
  Plus,
  Layout,
  Layers,
  Copy,
  SlidersHorizontal,
  FolderTree,
} from 'lucide-react';
import { HtmlCssExtractor } from '../htmlCssExtractor';
import { WEB_COMPONENT_LIBRARY, type ComponentCategory, instantiateTemplate } from '../componentLibrary';
import type { CanvasElement } from '../model';

interface WebDropInspectorProps {
  onInsertElements: (elements: CanvasElement[], detectedColors?: string[]) => void;
  activeLayerId: string;
}

export function WebDropInspector({
  onInsertElements,
  activeLayerId,
}: WebDropInspectorProps) {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');
  const [htmlInput, setHtmlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [parsedColors, setParsedColors] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleProcessHtml = (htmlContent: string) => {
    if (!htmlContent.trim()) return;
    try {
      const result = HtmlCssExtractor.extractFromHtml(
        htmlContent,
        100 + Math.random() * 40,
        100 + Math.random() * 40,
        activeLayerId
      );

      if (result.elements.length > 0) {
        onInsertElements(result.elements, result.detectedColors);
        setParsedColors(result.detectedColors);
        setStatusMessage(`تم استخراج وتوليد ${result.elements.length} عنصر ويب بطبقات عمق تداخلية!`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to parse web drop:', err);
      setStatusMessage('حدث خطأ أثناء استخراج عناصر الويب');
    }
  };

  const handleInsertTemplate = (templateId: string) => {
    const elements = instantiateTemplate(
      templateId,
      120 + Math.random() * 30,
      120 + Math.random() * 30,
      activeLayerId
    );
    if (elements.length > 0) {
      onInsertElements(elements);
      setStatusMessage('تم إدراج قالب الويب بنجاح على الكانفا!');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setHtmlInput(content);
          handleProcessHtml(content);
        }
      };
      reader.readAsText(file);
      return;
    }

    const textHtml = e.dataTransfer.getData('text/html');
    const textPlain = e.dataTransfer.getData('text/plain');
    const content = textHtml || textPlain;

    if (content) {
      setHtmlInput(content);
      handleProcessHtml(content);
    }
  };

  // Filter templates
  const filteredTemplates = activeCategory === 'all'
    ? WEB_COMPONENT_LIBRARY
    : WEB_COMPONENT_LIBRARY.filter((t) => t.category === activeCategory);

  return (
    <div className="flex flex-col gap-3 text-xs">
      {/* 1. Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`p-4 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/90 scale-102 shadow-md'
            : 'border-slate-300 bg-slate-50/70 hover:bg-white hover:border-blue-400'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div className="font-bold text-slate-800 text-xs">
          اسحب وأفلت صفحة ويب أو ملف HTML هنا
        </div>
        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
          استخراج فوري للطبقات التداخلية وعناصر DOM والألوان وأنماط CSS و Tailwind.
        </p>
      </div>

      {statusMessage && (
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 font-medium text-[11px]">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 2. Direct HTML Input Box */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
          <span>لصق كود HTML / Tailwind المباشر</span>
          <span className="text-[10px] text-slate-400 font-normal">تحليل فوري</span>
        </label>
        <textarea
          rows={3}
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          placeholder="ألصق كود HTML أو مكونات Tailwind هنا للتحويل الفوري إلى شجرة طبقات..."
          className="w-full p-2 border border-slate-200 rounded-lg text-[11px] font-mono bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => handleProcessHtml(htmlInput)}
          disabled={!htmlInput.trim()}
          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>تحويل واستخراج العناصر إلى الكانفا</span>
        </button>
      </div>

      {/* 3. Detected Colors Palette */}
      {parsedColors.length > 0 && (
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Palette className="w-3 h-3 text-blue-600" />
            الألوان المستخرجة من صفحة الويب:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {parsedColors.map((col, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] shadow-2xs font-mono"
              >
                <div
                  className="w-3 h-3 rounded-full border border-slate-300"
                  style={{ backgroundColor: col }}
                />
                <span>{col}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Ready Web Component Library (100% Light Theme) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-blue-600" />
            <span>مكتبة قوالب الويب الجاهزة (فاتحة)</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {filteredTemplates.length} قالب
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'headers', label: 'أشرطة تنقل' },
            { id: 'hero', label: 'أقسام Hero' },
            { id: 'features', label: 'ميزات' },
            { id: 'pricing', label: 'أسعار' },
            { id: 'testimonials', label: 'آراء' },
            { id: 'cta', label: 'دعوة لاتخاذ إجراء' },
            { id: 'forms', label: 'نماذج' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2 py-1 rounded-md whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates List */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', `template:${template.id}`);
              }}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xs transition-all flex flex-col gap-1.5 group cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <span>{template.icon}</span>
                  <span className="group-hover:text-blue-600 transition-colors">
                    {template.nameAr}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInsertTemplate(template.id)}
                  className="px-2 py-0.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="إدراج على الكانفا"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>إدراج</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {template.descriptionAr}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
