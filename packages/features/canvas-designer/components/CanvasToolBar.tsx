/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: شريط أدوات الكانفا المتقدم المتكامل - Canvas Toolbar
 * 🏛️ الدور: مكون رئيسي - أشكال ونصوص ورسم حر وألوان وأيقونات وأبعاد
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Comprehensive Toolbar: شريط أدوات شامل مع 7+ أدوات
 *    (أشكال، صناديق نصية، رسم حر، ألوان، أيقونات، أبعاد، محاذاة)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الألوان يجب أن تتوافق مع الثيم الفاتح
 *    2. الأدوات يجب أن تتناسب مع المساحة المتاحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع الأداة قبل التطبيق
 *    - fallback لأداة افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  MousePointer,
  Hand,
  Square,
  Circle,
  Type,
  PenTool,
  Spline,
  Diamond,
  Triangle,
  Star,
  Hexagon,
  Octagon,
  Pentagon,
  ArrowRight,
  Minus,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Baseline,
  Sliders,
  Maximize2,
  Lock,
  Unlock,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  ChevronsUp,
  ChevronsDown,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  ChevronDown,
  Plus,
  Heart,
  Check,
  Shield,
  Zap,
  Globe,
  MessageSquare,
  Info,
  AlertTriangle,
  Video,
  Camera,
  Compass,
  Tag,
  Cpu,
  Layers,
} from 'lucide-react';
import type { CanvasElement, CanvasElementType } from '../model';
import { LIGHT_THEME_GRADIENTS } from '../core/svgPaint';

export interface CanvasToolBarProps {
  activeTool: CanvasElementType | 'select' | 'hand' | 'bezier-pen';
  onSelectTool: (tool: CanvasElementType | 'select' | 'hand' | 'bezier-pen') => void;
  selectedElement: CanvasElement | null;
  onUpdateSelectedElement: (updates: Partial<CanvasElement>) => void;
  onAddElement: (type: CanvasElementType, defaultProps?: Partial<CanvasElement>) => void;
  onDuplicateElement: () => void;
  onDeleteElement: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenAssetManager?: () => void;
}

// Light theme color swatches
const LIGHT_FILL_SWATCHES = [
  { name: 'شفاف', value: 'transparent' },
  { name: 'أبيض ناصع', value: '#ffffff' },
  { name: 'رمادي فاتح', value: '#f8fafc' },
  { name: 'ثلجي هادئ', value: '#f1f5f9' },
  { name: 'أزرق سماوي', value: '#eff6ff' },
  { name: 'أزرق ناعم', value: '#dbeafe' },
  { name: 'أخضر نعناعي', value: '#f0fdf4' },
  { name: 'أخضر باستيل', value: '#dcfce7' },
  { name: 'أصفر دافئ', value: '#fefce8' },
  { name: 'أصفر شمسي', value: '#fef08a' },
  { name: 'برتقالي هادئ', value: '#fff7ed' },
  { name: 'وردي ناعم', value: '#fff1f2' },
  { name: 'بنفسجي فاتح', value: '#faf5ff' },
  { name: 'بنفسجي لافندر', value: '#f3e8ff' },
];

const STROKE_COLOR_SWATCHES = [
  { name: 'رمادي حدود', value: '#cbd5e1' },
  { name: 'رمادي داكن', value: '#64748b' },
  { name: 'أزرق ملكي', value: '#2563eb' },
  { name: 'أزرق سماوي', value: '#0284c7' },
  { name: 'أخضر زمردي', value: '#16a34a' },
  { name: 'كهرماني', value: '#d97706' },
  { name: 'أحمر قرمزي', value: '#dc2626' },
  { name: 'بنفسجي غني', value: '#9333ea' },
  { name: 'فحمي نقي', value: '#1e293b' },
];

const FONT_FAMILIES = [
  { name: 'تجوال (Tajawal)', value: 'Tajawal, sans-serif' },
  { name: 'كايرو (Cairo)', value: 'Cairo, sans-serif' },
  { name: 'آي بي إم (IBM Plex)', value: '"IBM Plex Sans Arabic", sans-serif' },
  { name: 'المراعي (Almarai)', value: 'Almarai, sans-serif' },
  { name: 'افتراضي (Sans)', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'نسخ (Serif)', value: 'Georgia, "Times New Roman", serif' },
  { name: 'برمجي (Monospace)', value: 'ui-monospace, monospace' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 64];

const QUICK_ICONS = [
  { name: 'نجمة', icon: Star },
  { name: 'شرارة', icon: Sparkles },
  { name: 'قلب', icon: Heart },
  { name: 'صح', icon: Check },
  { name: 'درع', icon: Shield },
  { name: 'طاقة', icon: Zap },
  { name: 'عالم', icon: Globe },
  { name: 'محادثة', icon: MessageSquare },
  { name: 'معلومات', icon: Info },
  { name: 'تنبيه', icon: AlertTriangle },
  { name: 'فيديو', icon: Video },
  { name: 'كاميرا', icon: Camera },
  { name: 'بوصلة', icon: Compass },
  { name: 'وسم', icon: Tag },
  { name: 'شريحة', icon: Cpu },
  { name: 'طبقات', icon: Layers },
];

export const CanvasToolBar: React.FC<CanvasToolBarProps> = ({
  activeTool,
  onSelectTool,
  selectedElement,
  onUpdateSelectedElement,
  onAddElement,
  onDuplicateElement,
  onDeleteElement,
  onBringToFront,
  onSendToBack,
  onUndo,
  onRedo,
  onOpenAssetManager,
}) => {
  const [openDropdown, setOpenDropdown] = useState<
    'shapes' | 'fill' | 'stroke' | 'typography' | 'icons' | 'size' | null
  >(null);

  const toggleDropdown = (name: 'shapes' | 'fill' | 'stroke' | 'typography' | 'icons' | 'size') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdown = () => setOpenDropdown(null);

  // Aspect Ratio Locked
  const isRatioLocked = selectedElement?.aspectRatioLocked ?? false;

  // Handle Dimension Change
  const handleWidthChange = (newWidth: number) => {
    if (!selectedElement) return;
    const w = Math.max(20, Math.round(newWidth));
    if (isRatioLocked && selectedElement.width > 0) {
      const ratio = selectedElement.height / selectedElement.width;
      onUpdateSelectedElement({ width: w, height: Math.round(w * ratio) });
    } else {
      onUpdateSelectedElement({ width: w });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (!selectedElement) return;
    const h = Math.max(20, Math.round(newHeight));
    if (isRatioLocked && selectedElement.height > 0) {
      const ratio = selectedElement.width / selectedElement.height;
      onUpdateSelectedElement({ height: h, width: Math.round(h * ratio) });
    } else {
      onUpdateSelectedElement({ height: h });
    }
  };

  // Handle Scale Preset
  const handleScalePreset = (factor: number) => {
    if (!selectedElement) return;
    onUpdateSelectedElement({
      width: Math.round(selectedElement.width * factor),
      height: Math.round(selectedElement.height * factor),
    });
  };

  return (
    <div
      id="canvas-main-toolbar"
      dir="rtl"
      className="w-full bg-white border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs select-none z-20 text-slate-800"
    >
      {/* Group 1: Primary Tools (Select, Shapes, Text Box, Freehand Drawing) */}
      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
        {/* Pointer / Select Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('select');
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'select'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="مؤشر التحديد والتحريك (Select)"
        >
          <MousePointer className="w-4 h-4" />
          <span className="hidden sm:inline">تحديد</span>
        </button>

        {/* Hand / Manual Pan Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('hand');
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'hand'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="أداة اليد لتحريك مساحة العمل دون تحريك العناصر (Hand Tool / Spacebar)"
        >
          <Hand className="w-4 h-4" />
          <span className="hidden sm:inline">يد التمرير</span>
        </button>

        <div className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* Rectangle Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('rectangle');
            onAddElement('rectangle', {
              width: 200,
              height: 140,
              fillColor: '#eff6ff',
              strokeColor: '#3b82f6',
              strokeWidth: 2,
              borderRadius: 12,
              text: 'مستطيل',
            });
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'rectangle'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="أداة المستطيل (Rectangle)"
        >
          <Square className="w-4 h-4" />
          <span className="hidden md:inline">مستطيل</span>
        </button>

        {/* Circle Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('circle');
            onAddElement('circle', {
              width: 150,
              height: 150,
              fillColor: '#f0fdf4',
              strokeColor: '#16a34a',
              strokeWidth: 2,
              text: 'دائرة',
            });
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'circle'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="أداة الدائرة (Circle)"
        >
          <Circle className="w-4 h-4" />
          <span className="hidden md:inline">دائرة</span>
        </button>

        {/* Ellipse Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('ellipse');
            onAddElement('ellipse', {
              width: 220,
              height: 130,
              fillColor: '#faf5ff',
              strokeColor: '#9333ea',
              strokeWidth: 2,
              text: 'قطع ناقص',
            });
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'ellipse'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="أداة القطع الناقص (Ellipse)"
        >
          <div className="w-4 h-3 rounded-full border-2 border-current" />
          <span className="hidden md:inline">قطع ناقص</span>
        </button>

        {/* Text Box Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('text');
            onAddElement('text', {
              width: 260,
              height: 80,
              text: 'صندوق نصي تفاعلي',
              fontSize: 18,
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: 'bold',
              textColor: '#1e293b',
              textAlign: 'right',
              fillColor: 'transparent',
              strokeWidth: 0,
            });
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'text'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="أداة صندوق النص (Text Box)"
        >
          <Type className="w-4 h-4" />
          <span className="hidden md:inline">صندوق نص</span>
        </button>

        {/* Freehand Drawing Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('freehand');
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'freehand'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="أداة الرسم الحر بالقلم (Freehand Drawing)"
        >
          <PenTool className="w-4 h-4" />
          <span className="hidden md:inline">رسم حر</span>
        </button>

        {/* Bézier Pen Tool */}
        <button
          type="button"
          onClick={() => {
            onSelectTool('bezier-pen');
            closeDropdown();
          }}
          className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTool === 'bezier-pen'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title="أداة منحنيات بيزييه المتقدمة (Bézier Pen Tool)"
        >
          <Spline className="w-4 h-4 text-amber-500" />
          <span className="hidden md:inline">منحنيات بيزييه</span>
        </button>

        {/* More Shapes Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('shapes')}
            className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              openDropdown === 'shapes' ? 'bg-slate-200 text-blue-700' : 'text-slate-700 hover:bg-slate-200/70'
            }`}
            title="المزيد من الأشكال الفيكتورية"
          >
            <Diamond className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {openDropdown === 'shapes' && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 grid grid-cols-2 gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  onAddElement('triangle', { width: 160, height: 140, text: 'مثلث', fillColor: '#fefce8', strokeColor: '#ca8a04' });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <Triangle className="w-3.5 h-3.5 text-amber-600" />
                <span>مثلث</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddElement('star', { width: 160, height: 160, text: 'نجمة', fillColor: '#fef08a', strokeColor: '#eab308' });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-yellow-500" />
                <span>نجمة</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddElement('diamond', { width: 150, height: 150, text: 'معين', fillColor: '#eff6ff', strokeColor: '#2563eb' });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <Diamond className="w-3.5 h-3.5 text-blue-600" />
                <span>معين</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddElement('hexagon', { width: 160, height: 150, text: 'سداسي', fillColor: '#faf5ff', strokeColor: '#8b5cf6' });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <Hexagon className="w-3.5 h-3.5 text-violet-600" />
                <span>سداسي</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddElement('octagon', { width: 160, height: 150, text: 'ثماني', fillColor: '#f0fdf4', strokeColor: '#16a34a' });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <Octagon className="w-3.5 h-3.5 text-emerald-600" />
                <span>ثماني</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddElement('pentagon', { width: 160, height: 150, text: 'خماسي', fillColor: '#fff7ed', strokeColor: '#ea580c' });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <Pentagon className="w-3.5 h-3.5 text-orange-600" />
                <span>خماسي</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddElement('shield', { width: 140, height: 160, text: 'درع', fillColor: '#fee2e2', strokeColor: '#dc2626' });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-rose-600" />
                <span>درع</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddElement('arrow', { width: 200, height: 40, strokeColor: '#2563eb', strokeWidth: 3 });
                  closeDropdown();
                }}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                <span>سهم</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Group 2: Contextual Property Controls (Light Theme Colors, Fonts, Icons, Sizing) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Fill Color Control */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('fill')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="لون التعبئة (Fill Color)"
          >
            <div
              className="w-4 h-4 rounded border border-slate-300 shadow-2xs"
              style={{
                backgroundColor:
                  selectedElement?.fillColor && selectedElement.fillColor !== 'transparent'
                    ? selectedElement.fillColor
                    : '#ffffff',
                backgroundImage:
                  selectedElement?.fillColor === 'transparent'
                    ? 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)'
                    : undefined,
                backgroundSize: '6px 6px',
              }}
            />
            <span className="hidden sm:inline">تعبئة</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {openDropdown === 'fill' && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>ألوان التعبئة الفاتحة</span>
                <input
                  type="color"
                  value={selectedElement?.fillColor && selectedElement.fillColor !== 'transparent' ? selectedElement.fillColor : '#ffffff'}
                  onChange={(e) => onUpdateSelectedElement({ fillColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                />
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {LIGHT_FILL_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => {
                      onUpdateSelectedElement({ fillColor: swatch.value });
                      closeDropdown();
                    }}
                    title={swatch.name}
                    className="w-6 h-6 rounded-md border border-slate-300 hover:scale-115 transition-transform cursor-pointer relative flex items-center justify-center shadow-2xs"
                    style={{
                      backgroundColor: swatch.value === 'transparent' ? '#ffffff' : swatch.value,
                    }}
                  >
                    {swatch.value === 'transparent' && (
                      <span className="text-[9px] text-rose-500 font-extrabold">∅</span>
                    )}
                    {selectedElement?.fillColor === swatch.value && (
                      <Check className="w-3 h-3 text-blue-600 font-bold" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-700 text-[11px]">تدرجات لونية ناعمة (SVG Gradients)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {LIGHT_THEME_GRADIENTS.map((grad) => {
                    const c1 = grad.stops[0]?.color || '#ffffff';
                    const c2 = grad.stops[1]?.color || '#f1f5f9';
                    const gradVal = `linear-gradient(135deg, ${c1}, ${c2})`;
                    return (
                      <button
                        key={grad.id}
                        type="button"
                        onClick={() => {
                          onUpdateSelectedElement({ fillColor: gradVal });
                          closeDropdown();
                        }}
                        title={grad.id}
                        className="h-6 rounded-md border border-slate-300 hover:scale-105 transition-transform cursor-pointer relative flex items-center justify-center shadow-2xs"
                        style={{ background: gradVal }}
                      >
                        {selectedElement?.fillColor === gradVal && (
                          <Check className="w-3 h-3 text-slate-700 font-bold" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stroke / Border Control */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('stroke')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="لون وسمك الحدود (Stroke & Border)"
          >
            <div
              className="w-4 h-4 rounded border-2 shadow-2xs"
              style={{
                borderColor: selectedElement?.strokeColor || '#3b82f6',
                backgroundColor: '#ffffff',
              }}
            />
            <span className="hidden sm:inline">الحدود</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {openDropdown === 'stroke' && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>لون الحدود</span>
                <input
                  type="color"
                  value={selectedElement?.strokeColor || '#3b82f6'}
                  onChange={(e) => onUpdateSelectedElement({ strokeColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                />
              </div>

              {/* Stroke Swatches */}
              <div className="grid grid-cols-9 gap-1">
                {STROKE_COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => onUpdateSelectedElement({ strokeColor: swatch.value })}
                    title={swatch.name}
                    className="w-5 h-5 rounded-md border border-slate-300 hover:scale-115 transition-transform cursor-pointer shadow-2xs"
                    style={{ backgroundColor: swatch.value }}
                  />
                ))}
              </div>

              {/* Stroke Width */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-700">سمك الخط:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 6, 8].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => onUpdateSelectedElement({ strokeWidth: w })}
                      className={`flex-1 py-1 rounded-md text-[11px] font-bold border transition cursor-pointer ${
                        (selectedElement?.strokeWidth || 1) === w
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Stroke Style */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-700">نوع الخط:</span>
                <div className="flex items-center gap-1">
                  {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => onUpdateSelectedElement({ strokeStyle: style })}
                      className={`flex-1 py-1 rounded-md text-[11px] font-bold border transition cursor-pointer ${
                        (selectedElement?.strokeStyle || 'solid') === style
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {style === 'solid' ? 'متصل' : style === 'dashed' ? 'متقطع' : 'منقط'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Radius */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-700">استدارة الحواف (Radius):</span>
                <div className="flex items-center gap-1">
                  {[0, 4, 8, 12, 16, 24].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onUpdateSelectedElement({ borderRadius: r })}
                      className={`flex-1 py-1 rounded-md text-[11px] font-bold border transition cursor-pointer ${
                        (selectedElement?.borderRadius || 0) === r
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Typography & Font Control */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('typography')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="التحكم في الخط والنصوص (Typography)"
          >
            <Baseline className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">الخط والنص</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {openDropdown === 'typography' && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 space-y-3 text-xs">
              {/* Font Family */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700">نوع الخط:</span>
                <select
                  value={selectedElement?.fontFamily || 'Tajawal, sans-serif'}
                  onChange={(e) => onUpdateSelectedElement({ fontFamily: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-hidden"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">الحجم (px):</span>
                  <select
                    value={selectedElement?.fontSize || 16}
                    onChange={(e) => onUpdateSelectedElement({ fontSize: parseInt(e.target.value, 10) })}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-hidden"
                  >
                    {FONT_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}px
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-700">الوزن:</span>
                  <select
                    value={selectedElement?.fontWeight || 'normal'}
                    onChange={(e) => onUpdateSelectedElement({ fontWeight: e.target.value })}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-hidden"
                  >
                    <option value="normal">عادي (400)</option>
                    <option value="500">متوسط (500)</option>
                    <option value="bold">عريض (700)</option>
                    <option value="800">فائق (800)</option>
                  </select>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-700">المحاذاة:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateSelectedElement({ textAlign: 'right' })}
                    className={`flex-1 py-1 rounded-md flex items-center justify-center border cursor-pointer ${
                      (selectedElement?.textAlign || 'right') === 'right'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title="محاذاة لليمين"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSelectedElement({ textAlign: 'center' })}
                    className={`flex-1 py-1 rounded-md flex items-center justify-center border cursor-pointer ${
                      selectedElement?.textAlign === 'center'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title="محاذاة للوسط"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSelectedElement({ textAlign: 'left' })}
                    className={`flex-1 py-1 rounded-md flex items-center justify-center border cursor-pointer ${
                      selectedElement?.textAlign === 'left'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title="محاذاة لليسار"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Color */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-700">لون النص:</span>
                <input
                  type="color"
                  value={selectedElement?.textColor || '#1e293b'}
                  onChange={(e) => onUpdateSelectedElement({ textColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Icons Library Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('icons')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="إدراج أيقونات ورموز (Icons)"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">أيقونات</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {openDropdown === 'icons' && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 space-y-2 text-xs">
              <div className="font-bold text-slate-800">إدراج أيقونة فيكتورية:</div>
              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_ICONS.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onAddElement('badge', {
                          width: 140,
                          height: 48,
                          text: item.name,
                          fillColor: '#eff6ff',
                          strokeColor: '#3b82f6',
                          textColor: '#1d4ed8',
                        });
                        closeDropdown();
                      }}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 flex flex-col items-center gap-1 text-[10px] font-bold text-slate-700 transition cursor-pointer"
                    >
                      <IconComp className="w-4 h-4 text-blue-600" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Size & Dimensions Control */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('size')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="التحكم الكامل في الحجم والأبعاد (Dimensions & Size)"
          >
            <Sliders className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">
              {selectedElement ? `${selectedElement.width}×${selectedElement.height}` : 'الحجم والأبعاد'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {openDropdown === 'size' && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>التحكم في الأبعاد (W × H)</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSelectedElement({
                      aspectRatioLocked: !isRatioLocked,
                    })
                  }
                  className={`p-1 rounded-md border flex items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
                    isRatioLocked
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                  title="قفل نسبة الأبعاد (Lock Aspect Ratio)"
                >
                  {isRatioLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{isRatioLocked ? 'مقفل' : 'حر'}</span>
                </button>
              </div>

              {selectedElement ? (
                <>
                  {/* Width & Height Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700">العرض (W):</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={selectedElement.width}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 20)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleWidthChange(selectedElement.width + 10)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWidthChange(selectedElement.width - 10)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                        >
                          -
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-700">الارتفاع (H):</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={selectedElement.height}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 20)}
                          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleHeightChange(selectedElement.height + 10)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHeightChange(selectedElement.height - 10)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scale Multiplier Presets */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <span className="font-bold text-slate-700">مضاعفات التحجيم:</span>
                    <div className="flex items-center gap-1">
                      {[0.5, 0.75, 1.25, 1.5, 2].map((factor) => (
                        <button
                          key={factor}
                          type="button"
                          onClick={() => handleScalePreset(factor)}
                          className="flex-1 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 hover:text-blue-700 transition cursor-pointer"
                        >
                          {factor * 100}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Preset Dimensions */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <span className="font-bold text-slate-700">مقاسات قياسية جاهزة:</span>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateSelectedElement({ width: 120, height: 120 })}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 text-right cursor-pointer"
                      >
                        مربع (120×120)
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateSelectedElement({ width: 320, height: 200 })}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 text-right cursor-pointer"
                      >
                        بطاقة (320×200)
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateSelectedElement({ width: 600, height: 180 })}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 text-right cursor-pointer"
                      >
                        لافتة (600×180)
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateSelectedElement({ width: 1000, height: 600 })}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 text-right cursor-pointer"
                      >
                        شاشة (1000×600)
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-slate-500 text-center py-2">
                  حدد عنصراً في الكانفا بالفأرة للتحكم في أبعاده ومقاساته بدقة.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Media / Asset Manager Trigger */}
        {onOpenAssetManager && (
          <button
            type="button"
            onClick={onOpenAssetManager}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition cursor-pointer"
            title="مكتبة الصور والوسائط ومعالج EXIF"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden md:inline">الصور</span>
          </button>
        )}
      </div>

      {/* Group 3: Quick Element Actions (Arrange, Duplicate, Delete, Undo, Redo) */}
      <div className="flex items-center gap-1">
        {selectedElement && (
          <>
            <button
              type="button"
              onClick={onBringToFront}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition cursor-pointer"
              title="إحضار للمقدمة (Bring to Front)"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onSendToBack}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition cursor-pointer"
              title="إرسال للخلفية (Send to Back)"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onDuplicateElement}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition cursor-pointer"
              title="تكرار العنصر (Duplicate)"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onDeleteElement}
              className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 rounded-lg transition cursor-pointer"
              title="حذف العنصر (Delete)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-0.5" />
          </>
        )}

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={onUndo}
          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition cursor-pointer"
          title="تراجع (Undo)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition cursor-pointer"
          title="إعادة (Redo)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
