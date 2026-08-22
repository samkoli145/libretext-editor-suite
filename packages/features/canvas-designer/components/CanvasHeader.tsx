/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: شريط رأس محرر الكانفا العلوي - Canvas Header Action Bar
 * 🏛️ الدور: مكون رئيسي - أزرار التحكم السريع والتكبير والتصدير والمعاينة
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Compact Action Bar: شريط إجراءات مدمج
 *    مع تحجيم رأسي بالسحب والطي والتوسيع الفوري
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الشريط يجب ألا يتجاوز 10% من الشاشة
 *    2. الأزرار يجب أن تتناسب مع المساحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة حالة الشريط
 *    - fallback لعرض افتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Pin,
  PinOff,
} from 'lucide-react';
import { useCollapsibleTopBar } from '../../../shared/hooks/useCollapsibleTopBar';

export interface CanvasHeaderProps {
  isLeftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  undo: () => void;
  redo: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  onSetBreakpoint: (bp: 'mobile' | 'tablet' | 'desktop') => void;
  elementCount: number;
  onExportSvg: () => void;
  onOpenPreview: () => void;
}

export function CanvasHeader({
  isLeftPanelOpen,
  onToggleLeftPanel,
  undo,
  redo,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  breakpoint,
  onSetBreakpoint,
  elementCount,
  onExportSvg,
  onOpenPreview,
}: CanvasHeaderProps) {
  const {
    height,
    isCollapsed,
    isPinned,
    toggleCollapse,
    togglePin,
    startResize,
  } = useCollapsibleTopBar({
    id: 'canvas-header-bar',
    defaultHeight: 44,
    minHeight: 32,
    maxHeight: 75,
    defaultCollapsed: false,
    defaultPinned: true,
  });

  return (
    <header
      id="canvas-header-root"
      className="relative bg-white border-b border-slate-200 px-3 flex items-center justify-between shadow-2xs z-20 transition-[height] duration-75 overflow-hidden shrink-0 select-none"
      style={{ height: isCollapsed ? '32px' : `${height}px`, maxHeight: '75px', minHeight: '32px' }}
      dir="rtl"
    >
      <div className="flex items-center gap-1.5 overflow-hidden">
        {/* Left Panel Toggle */}
        <button
          type="button"
          onClick={onToggleLeftPanel}
          className={`p-1 rounded-md border transition cursor-pointer ${
            isLeftPanelOpen
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="تبديل اللوحة الجانبية"
        >
          {isLeftPanelOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
          <button
            type="button"
            onClick={undo}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            title="تراجع (Undo - Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={redo}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            title="إعادة (Redo - Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Zoom Controls */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md border border-slate-200">
              <button
                type="button"
                onClick={onZoomOut}
                className="p-0.5 bg-white hover:bg-slate-50 text-slate-700 rounded transition cursor-pointer shadow-2xs"
                title="تصغير (Zoom Out)"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={onResetZoom}
                className="px-1 py-0.2 text-[11px] font-mono font-bold text-slate-700 hover:text-blue-600 transition cursor-pointer"
                title="إعادة الضبط إلى 100%"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={onZoomIn}
                className="p-0.5 bg-white hover:bg-slate-50 text-slate-700 rounded transition cursor-pointer shadow-2xs"
                title="تكبير (Zoom In)"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Breakpoint Switcher */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md border border-slate-200">
              <button
                type="button"
                onClick={() => onSetBreakpoint('desktop')}
                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded transition cursor-pointer ${
                  breakpoint === 'desktop' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span className="hidden sm:inline">مكتبي</span>
              </button>
              <button
                type="button"
                onClick={() => onSetBreakpoint('tablet')}
                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded transition cursor-pointer ${
                  breakpoint === 'tablet' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-3 h-3" />
                <span className="hidden sm:inline">لوحي</span>
              </button>
              <button
                type="button"
                onClick={() => onSetBreakpoint('mobile')}
                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded transition cursor-pointer ${
                  breakpoint === 'mobile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span className="hidden sm:inline">جوال</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Center Title & Stats (Hidden when collapsed or on narrow screen) */}
      {!isCollapsed && (
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-800">محرر كانفا</span>
          <span>•</span>
          <span>{elementCount} عناصر</span>
        </div>
      )}

      {/* Right Actions & Collapsible Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {!isCollapsed && (
          <>
            <button
              type="button"
              onClick={onExportSvg}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold transition cursor-pointer"
              title="تصدير وتنزيل ملف SVG المتجه بنقرة واحدة"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SVG</span>
            </button>

            <button
              type="button"
              onClick={onOpenPreview}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-xs font-bold transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">معاينة</span>
            </button>

            <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
          </>
        )}

        {/* Pin / Unpin Button */}
        <button
          type="button"
          onClick={togglePin}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isPinned
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-700'
          }`}
          title={isPinned ? 'الشريط مثبّت' : 'تثبيت الشريط (Pin)'}
        >
          {isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
        </button>

        {/* Collapse / Expand Button */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition cursor-pointer"
          title={isCollapsed ? 'توسيع شريط الأدوات' : 'طي شريط الأدوات لتوسيع مساحة العمل (<= 10%)'}
        >
          {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>

      {/* Bottom Resizing Edge Handle (cursor-ns-resize) */}
      <div
        onMouseDown={startResize}
        className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-40"
        title="اسحب بالفأرة لتعديل ارتفاع شريط الأدوات"
      />
    </header>
  );
}

