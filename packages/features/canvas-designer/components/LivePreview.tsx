/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكون المعاينة الحية التفاعلية مع محاكاة أحجام الشاشات - Live Preview
 * 🏛️ الدور: مكون مشترك - معاينة ب Sizes (Desktop/Tablet/Mobile) مع تكبير
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Responsive Preview: معاينة متجاوبة بثلاث أحجام شاشات
 *    مع تحكم بالتكبير والتصغير اللحظي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأحجام يجب أن تتوافق مع أحجام الشاشات الحقيقية
 *    2. التكبير يجب أن يكون سلساً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - fallback لحجم افتراضي
 *    - فحص صحة حجم الشاشة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Download,
  X,
  ExternalLink,
  Copy,
  Check,
  Eye,
} from 'lucide-react';
import type { CanvasElement } from '../model';
import { ElementRenderer } from './ElementRenderer';
import { exportCanvasToSvg, downloadSvgFile } from '../core/svgExporter';

interface LivePreviewProps {
  elements: CanvasElement[];
  isOpen: boolean;
  onClose: () => void;
  pageTitle?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  elements,
  isOpen,
  onClose,
  pageTitle = 'معاينة التصميم الحية',
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const getDeviceDimensions = () => {
    switch (device) {
      case 'mobile':
        return { width: '375px', height: '667px', label: 'هاتف ذكي (375x667)' };
      case 'tablet':
        return { width: '768px', height: '1024px', label: 'جهاز لوحي (768x1024)' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%', label: 'سطح المكتب (100%)' };
    }
  };

  const currentDim = getDeviceDimensions();

  // Generate full stand-alone HTML for export / copy
  const generateStandaloneHtml = () => {
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const bodyHtml = sorted
      .map((el) => {
        return `<div style="position:absolute; left:${el.x}px; top:${el.y}px; width:${el.width}px; height:${el.height}px; z-index:${el.zIndex};">
  ${el.htmlContent || `<div style="background-color:${el.fillColor || '#ffffff'}; border:1px solid ${el.strokeColor || '#cbd5e1'}; border-radius:${el.borderRadius || 12}px; padding:12px; height:100%; box-sizing:border-box;">${el.text || ''}</div>`}
</div>`;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
  </style>
</head>
<body>
  <div style="position: relative; min-height: 800px; max-width: 1200px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
    ${bodyHtml}
  </div>
</body>
</html>`;
  };

  const handleCopyHtml = () => {
    navigator.clipboard?.writeText(generateStandaloneHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const html = generateStandaloneHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webpainter-export.html';
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/40 backdrop-blur-xs select-none font-sans animate-in fade-in duration-150"
      dir="rtl"
    >
      {/* 1. Header Toolbar (Pure Light Surface) */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900">{pageTitle}</h2>
            <p className="text-[11px] text-slate-500">{currentDim.label} — تجربة تفاعلية مباشرة</p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              device === 'desktop'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">سطح المكتب</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              device === 'tablet'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">لوحي</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              device === 'mobile'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">هاتف</span>
          </button>
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs text-slate-700 font-semibold">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="p-1 hover:bg-slate-200 rounded cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              const w = device === 'mobile' ? 375 : device === 'tablet' ? 768 : 1200;
              const h = device === 'mobile' ? 667 : device === 'tablet' ? 1024 : 800;
              const svgStr = exportCanvasToSvg(elements, { width: w, height: h, title: pageTitle });
              downloadSvgFile(svgStr, 'webpainter-vector.svg');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="تصدير وتنزيل ملف SVG المتجه"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير SVG</span>
          </button>

          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="نسخ كود HTML المستقل"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'تم النسخ!' : 'نسخ HTML'}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل الصفحة</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="إغلاق المعاينة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Main Preview Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-6"
      >
        <div
          style={{
            width: currentDim.width,
            height: currentDim.height,
            maxWidth: '1280px',
            minHeight: '750px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'width 0.2s ease, height 0.2s ease',
          }}
          className="relative bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-auto p-6"
        >
          {elements.map((el) => (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                zIndex: el.zIndex,
              }}
            >
              <ElementRenderer element={el} isInteractive={true} isRtl={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
