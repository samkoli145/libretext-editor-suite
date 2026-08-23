/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: لوحة إدارة الألوان وعينات الباليتات ومنتقي الألوان - Color Management Panel
 * 🏛️ الدور: مكون مشترك - حفظ وتطبيق الألوان مع Eyedropper API
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Palette Manager + Eyedropper: مدير باليتات مع Eyedropper API
 *    ومنتقي ألوان متعدد الصيغ (HEX, RGB, HSL)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Eyedropper API قد لا يعمل في كل المتصفحات
 *    2. الألوان يجب أن تتوافق مع الثيم الفاتح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص دعم Eyedropper API
 *    - fallback لمنتقي ألوان تقليدي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Palette,
  Plus,
  Trash2,
  Copy,
  Check,
  Pipette,
  Layers,
  Sparkles,
  Download,
  Upload,
  Type,
  Square,
  Maximize2,
  FolderPlus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { CanvasElement, ColorPaletteGroup, ColorSwatchItem } from '../model';
import {
  SharedContextMenu,
  type ContextMenuItem,
} from '../../../shared/components/SharedContextMenu';
import { notificationEngine } from '../../../shared/engines/NotificationEngine';

interface ColorManagementPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  canvasBackground: string;
  onUpdateCanvasBackground: (color: string) => void;
}

// باليتات افتراضية احترافية بثيم فاتح نقي
const DEFAULT_PALETTES: ColorPaletteGroup[] = [
  {
    id: 'palette-brand',
    name: 'Brand & Identity',
    nameAr: 'ألوان الهوية والمشروع',
    isCustom: true,
    colors: [
      { id: 'c-1', name: 'أزرق نقي', hex: '#2563eb', category: 'primary' },
      { id: 'c-2', name: 'أزرق سماوي', hex: '#38bdf8', category: 'primary' },
      { id: 'c-3', name: 'نيلي ملكي', hex: '#4f46e5', category: 'accent' },
      { id: 'c-4', name: 'بنفسجي هادئ', hex: '#7c3aed', category: 'accent' },
      { id: 'c-5', name: 'كحلي داكن', hex: '#0f172a', category: 'neutral' },
      { id: 'c-6', name: 'رمادي مسطح', hex: '#64748b', category: 'neutral' },
    ],
  },
  {
    id: 'palette-pastels',
    name: 'Warm Pastels & Neutrals',
    nameAr: 'تدرجات الباستيل الهادئة',
    isCustom: false,
    colors: [
      { id: 'p-1', name: 'أبيض نقي', hex: '#ffffff', category: 'light' },
      { id: 'p-2', name: 'رمادي طباشيري', hex: '#f8fafc', category: 'light' },
      { id: 'p-3', name: 'ثلجي دافئ', hex: '#f1f5f9', category: 'light' },
      { id: 'p-4', name: 'أزرق باستيل', hex: '#dbeafe', category: 'light' },
      { id: 'p-5', name: 'أخضر نعناعي', hex: '#dcfce7', category: 'light' },
      { id: 'p-6', name: 'أصفر ليموني ناعم', hex: '#fef08a', category: 'light' },
      { id: 'p-7', name: 'وردي ناعم', hex: '#ffe4e6', category: 'light' },
      { id: 'p-8', name: 'بنفسجي لافندر', hex: '#f3e8ff', category: 'light' },
    ],
  },
  {
    id: 'palette-status',
    name: 'Status & Badges',
    nameAr: 'ألوان الحالات والتنبيهات',
    isCustom: false,
    colors: [
      { id: 's-1', name: 'أخضر نجاح', hex: '#16a34a', category: 'success' },
      { id: 's-2', name: 'أخضر فاتح', hex: '#22c55e', category: 'success' },
      { id: 's-3', name: 'برتقالي تحذير', hex: '#ea580c', category: 'warning' },
      { id: 's-4', name: 'أصفر كهرماني', hex: '#eab308', category: 'warning' },
      { id: 's-5', name: 'أحمر تنبيهي', hex: '#dc2626', category: 'danger' },
      { id: 's-6', name: 'وردي مميز', hex: '#db2777', category: 'accent' },
    ],
  },
];

export const ColorManagementPanel: React.FC<ColorManagementPanelProps> = ({
  selectedElement,
  onUpdateElement,
  canvasBackground,
  onUpdateCanvasBackground,
}) => {
  const [palettes, setPalettes] = useState<ColorPaletteGroup[]>(DEFAULT_PALETTES);
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#2563eb');
  const [newColorName, setNewColorName] = useState<string>('لون مخصص');
  const [targetApplication, setTargetApplication] = useState<
    'fill' | 'stroke' | 'text' | 'background'
  >('fill');
  const [expandedPaletteIds, setExpandedPaletteIds] = useState<string[]>([
    'palette-brand',
    'palette-pastels',
    'palette-status',
  ]);

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    colorItem?: ColorSwatchItem;
    paletteId?: string;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const togglePaletteExpand = (id: string) => {
    setExpandedPaletteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // تطبيق اللون على العنصر المحدد بناءً على الهدف
  const applyColor = (hex: string, mode?: 'fill' | 'stroke' | 'text' | 'background') => {
    const targetMode = mode || targetApplication;
    setSelectedColorHex(hex);

    if (targetMode === 'background') {
      onUpdateCanvasBackground(hex);
      notificationEngine.success(`تم تغيير لون خلفية الكانفا إلى ${hex}`);
      return;
    }

    if (!selectedElement) {
      notificationEngine.info('حدد عنصراً لتطبيق اللون عليه، أو اختر تطبيق على خلفية الكانفا');
      return;
    }

    switch (targetMode) {
      case 'fill':
        onUpdateElement(selectedElement.id, { fillColor: hex });
        notificationEngine.success(`تم تطبيق لون التعبئة (${hex})`);
        break;
      case 'stroke':
        onUpdateElement(selectedElement.id, {
          strokeColor: hex,
          strokeWidth: selectedElement.strokeWidth || 2,
        });
        notificationEngine.success(`تم تطبيق لون الحد (${hex})`);
        break;
      case 'text':
        onUpdateElement(selectedElement.id, { textColor: hex });
        notificationEngine.success(`تم تطبيق لون النص (${hex})`);
        break;
    }
  };

  // حفظ لون جديد في الباليت المخصصة
  const handleSaveColorToPalette = (paletteId: string = 'palette-brand') => {
    const newSwatch: ColorSwatchItem = {
      id: `c-custom-${Date.now()}`,
      name: newColorName || `لون ${selectedColorHex}`,
      hex: selectedColorHex,
    };

    setPalettes((prev) =>
      prev.map((pal) =>
        pal.id === paletteId ? { ...pal, colors: [...pal.colors, newSwatch] } : pal,
      ),
    );
    notificationEngine.success(`تم حفظ العينة (${selectedColorHex}) في لوحة الألوان`);
  };

  // أخذ لون من العنصر المحدد وحفظه
  const handleCaptureSelectedElementColors = () => {
    if (!selectedElement) {
      notificationEngine.info('حدد عنصراً أولاً لاستخراج ألوانه');
      return;
    }

    const colorsToCapture: string[] = [];
    if (selectedElement.fillColor && selectedElement.fillColor !== 'transparent') {
      colorsToCapture.push(selectedElement.fillColor);
    }
    if (selectedElement.strokeColor) {
      colorsToCapture.push(selectedElement.strokeColor);
    }
    if (selectedElement.textColor) {
      colorsToCapture.push(selectedElement.textColor);
    }

    if (colorsToCapture.length === 0) {
      notificationEngine.info('لا توجد ألوان محددة في هذا العنصر');
      return;
    }

    setPalettes((prev) =>
      prev.map((pal) => {
        if (pal.id === 'palette-brand') {
          const newSwatches: ColorSwatchItem[] = colorsToCapture.map((hex, idx) => ({
            id: `c-captured-${Date.now()}-${idx}`,
            name: `لون مستخرج (${selectedElement.type})`,
            hex,
          }));
          return { ...pal, colors: [...pal.colors, ...newSwatches] };
        }
        return pal;
      }),
    );

    notificationEngine.success(`تم استخراج وحفظ ${colorsToCapture.length} لون من العنصر المحدد`);
  };

  // أداة القطارة (EyeDropper API)
  const handleNativeEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setSelectedColorHex(result.sRGBHex);
          applyColor(result.sRGBHex);
        }
      } catch {
        // ألغى المستخدم القطارة
      }
    } else {
      notificationEngine.info(
        'أداة القطارة المدعومة متاحة في المتصفحات الحديثة، يمكنك كتابة كود HEX يدوياً',
      );
    }
  };

  // حذف لون من الباليت
  const handleDeleteSwatch = (paletteId: string, swatchId: string) => {
    setPalettes((prev) =>
      prev.map((pal) =>
        pal.id === paletteId
          ? { ...pal, colors: pal.colors.filter((c) => c.id !== swatchId) }
          : pal,
      ),
    );
    notificationEngine.info('تم حذف العينة من اللوحة');
  };

  // قائمة الزر الأيمن
  const handleContextMenu = (
    e: React.MouseEvent,
    colorItem: ColorSwatchItem,
    paletteId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      colorItem,
      paletteId,
    });
  };

  const activeColor = contextMenu.colorItem;

  const contextMenuItems: ContextMenuItem[] = activeColor
    ? [
        {
          id: 'apply-fill',
          label: `تطبيق كلون تعبئة (Fill) [${activeColor.hex}]`,
          icon: <Square className="w-3.5 h-3.5 fill-current text-blue-600" />,
          onClick: () => applyColor(activeColor.hex, 'fill'),
        },
        {
          id: 'apply-stroke',
          label: `تطبيق كلون حد خارجي (Stroke)`,
          icon: <Square className="w-3.5 h-3.5 text-slate-700 stroke-2" />,
          onClick: () => applyColor(activeColor.hex, 'stroke'),
        },
        {
          id: 'apply-text',
          label: `تطبيق كلون للنص (Text Color)`,
          icon: <Type className="w-3.5 h-3.5 text-indigo-600" />,
          onClick: () => applyColor(activeColor.hex, 'text'),
        },
        {
          id: 'apply-bg',
          label: `تعيين كلون لخلفية الكانفا (Background)`,
          icon: <Layers className="w-3.5 h-3.5 text-amber-600" />,
          onClick: () => applyColor(activeColor.hex, 'background'),
        },
        { id: 'sep-1', label: '', separator: true },
        {
          id: 'copy-hex',
          label: `نسخ كود HEX (${activeColor.hex})`,
          icon: <Copy className="w-3.5 h-3.5 text-slate-600" />,
          onClick: () => {
            navigator.clipboard.writeText(activeColor.hex);
            notificationEngine.info(`تم نسخ الكود ${activeColor.hex} للحافظة`);
          },
        },
        {
          id: 'del-swatch',
          label: 'حذف العينة من الباليت',
          icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
          danger: true,
          onClick: () => {
            if (contextMenu.paletteId) {
              handleDeleteSwatch(contextMenu.paletteId, activeColor.id);
            }
          },
        },
      ]
    : [];

  return (
    <div
      className="flex flex-col h-full bg-white text-slate-800 text-xs"
      style={{ direction: 'rtl' }}
    >
      {/* الترويسة وأداة اختيار اللون النشط */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-xs">
                مدير الألوان والباليتات المخصصة
              </h3>
              <p className="text-[10px] text-slate-500">
                اختر أو احفظ عينات الألوان وطبقها بنقرة واحدة
              </p>
            </div>
          </div>
        </div>

        {/* محدد اللون النشط ونمط التطبيق الفوري */}
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg border border-slate-300 shadow-inner shrink-0 relative overflow-hidden"
              style={{ backgroundColor: selectedColorHex }}
            >
              <input
                type="color"
                value={selectedColorHex.startsWith('#') ? selectedColorHex : '#2563eb'}
                onChange={(e) => applyColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="افتح منتقي الألوان"
              />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={selectedColorHex}
                  onChange={(e) => applyColor(e.target.value)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono text-xs text-slate-800 uppercase focus:ring-1 focus:ring-blue-500"
                  placeholder="#000000"
                />
                {'EyeDropper' in window && (
                  <button
                    type="button"
                    onClick={handleNativeEyeDropper}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="التقاط لون من الشاشة بالقطارة"
                  >
                    <Pipette className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveColorToPalette('palette-brand')}
                  className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1 text-[10px] font-medium"
                  title="حفظ هذا اللون كعينة في الباليت"
                >
                  <Plus className="w-3 h-3" />
                  <span>حفظ بالباليت</span>
                </button>
              </div>
            </div>
          </div>

          {/* تبديل وضع التطبيق بنقرة واحدة */}
          <div>
            <div className="text-[10px] text-slate-500 mb-1">
              الهدف عند النقر على أي عينة لونيّة:
            </div>
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => setTargetApplication('fill')}
                className={`py-1 px-1 rounded text-[10px] font-medium border flex items-center justify-center gap-1 ${
                  targetApplication === 'fill'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>تعبئة</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetApplication('stroke')}
                className={`py-1 px-1 rounded text-[10px] font-medium border flex items-center justify-center gap-1 ${
                  targetApplication === 'stroke'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Square className="w-2.5 h-2.5 stroke-2" />
                <span>حد</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetApplication('text')}
                className={`py-1 px-1 rounded text-[10px] font-medium border flex items-center justify-center gap-1 ${
                  targetApplication === 'text'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Type className="w-2.5 h-2.5" />
                <span>نص</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetApplication('background')}
                className={`py-1 px-1 rounded text-[10px] font-medium border flex items-center justify-center gap-1 ${
                  targetApplication === 'background'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-2.5 h-2.5" />
                <span>خلفية</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الباليتات والعينات */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {palettes.map((palette) => {
          const isExpanded = expandedPaletteIds.includes(palette.id);
          return (
            <div
              key={palette.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs"
            >
              <div
                onClick={() => togglePaletteExpand(palette.id)}
                className="p-2.5 bg-slate-50 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 text-[11px]">{palette.nameAr}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({palette.colors.length})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-2.5">
                  <div className="grid grid-cols-6 gap-2">
                    {palette.colors.map((color) => {
                      const isCurrent = selectedColorHex.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <div
                          key={color.id}
                          onClick={() => applyColor(color.hex)}
                          onContextMenu={(e) => handleContextMenu(e, color, palette.id)}
                          className={`group relative aspect-square rounded-lg border cursor-pointer transition-all transform hover:scale-105 flex items-center justify-center ${
                            isCurrent
                              ? 'ring-2 ring-blue-500 ring-offset-1 border-blue-600'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} (${color.hex}) - انقر للتطبيق، أو زر أيمن للخيارات`}
                        >
                          {isCurrent && (
                            <Check className="w-3.5 h-3.5 text-white filter drop-shadow-md stroke-[3]" />
                          )}
                          <span className="absolute bottom-full mb-1 hidden group-hover:block z-20 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] whitespace-nowrap shadow">
                            {color.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* شريط الإجراءات السريعة في الأسفل */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCaptureSelectedElementColors}
          className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-[11px] flex items-center justify-center gap-1 shadow-xs"
          title="استخراج ألوان العنصر المحدد وحفظها في الباليت"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>استخراج ألوان العنصر المحدد</span>
        </button>
      </div>

      {/* القائمة السياقية بالزر الأيمن */}
      <SharedContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        items={contextMenuItems}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
