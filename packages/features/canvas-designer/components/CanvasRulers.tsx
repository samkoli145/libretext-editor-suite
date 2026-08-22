/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مساطر الكانفا الأفقية والعمودية التفاعلية - Canvas Rulers
 * 🏛️ الدور: مكون مشترك - مساطر تتكيف مع التكبير والتحريك
 * 📥 المستهلك: CanvasDesignerEditor, CanvasViewport
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Adaptive Rulers: مساطر تتكيف تلقائياً مع التكبير والتحريك
 *    مع قائمة سياقية للزر الأيمن (تغيير الوحدة، تبديل الشبكة، إضافة خط إرشادي)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأرقام يجب أن تتناسب مع الوحدة المختارة
 *    2. الخطوط الإرشادية يجب أن تظهر فوراً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الوحدة قبل الرسم
 *    - fallback لوحدة px
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Ruler,
  Maximize2,
  Grid,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
  Settings2,
  Sliders,
} from 'lucide-react';
import { SharedContextMenu, type ContextMenuItem } from '../../../shared/components/SharedContextMenu';
import { notificationEngine } from '../../../shared/engines/NotificationEngine';

export interface CanvasRulersProps {
  zoom: number;
  scrollLeft: number;
  scrollTop: number;
  artboardWidth: number;
  artboardHeight: number;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  onAddGuide?: (orientation: 'horizontal' | 'vertical', position: number) => void;
  unit?: 'px' | 'mm' | 'in' | 'pt';
  onUnitChange?: (unit: 'px' | 'mm' | 'in' | 'pt') => void;
  children: React.ReactNode;
}

export const CanvasRulers: React.FC<CanvasRulersProps> = ({
  zoom,
  scrollLeft,
  scrollTop,
  artboardWidth,
  artboardHeight,
  showGrid = true,
  onToggleGrid,
  onAddGuide,
  unit = 'px',
  onUnitChange,
  children,
}) => {
  const [activeUnit, setActiveUnit] = useState<'px' | 'mm' | 'in' | 'pt'>(unit);
  const [showRulers, setShowRulers] = useState(true);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    clickedRuler: 'horizontal' | 'vertical' | 'corner' | null;
    coordValue: number;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    clickedRuler: null,
    coordValue: 0,
  });

  const RULER_THICKNESS = 24; // px

  // حساب المسافات الفاصلة وعلامات المسطرة بناءً على مستوى التكبير Zoom
  const getTickStep = (currentZoom: number) => {
    if (currentZoom >= 1.5) return { major: 50, minor: 10 };
    if (currentZoom >= 0.8) return { major: 100, minor: 20 };
    if (currentZoom >= 0.4) return { major: 200, minor: 50 };
    return { major: 500, minor: 100 };
  };

  const { major, minor } = getTickStep(zoom);

  // تحويل القيمة بوحدة البكسل إلى الوحدة النشطة
  const formatCoord = (pxVal: number) => {
    switch (activeUnit) {
      case 'mm':
        return Math.round(pxVal * 0.264583);
      case 'in':
        return (pxVal / 96).toFixed(1);
      case 'pt':
        return Math.round(pxVal * 0.75);
      case 'px':
      default:
        return Math.round(pxVal);
    }
  };

  // معالجة النقر بالزر الأيمن على المساطر
  const handleRulerContextMenu = (
    e: React.MouseEvent,
    rulerType: 'horizontal' | 'vertical' | 'corner',
    coordVal: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      clickedRuler: rulerType,
      coordValue: coordVal,
    });
  };

  // عناصر القائمة السياقية بالزر الأيمن
  const contextMenuItems: ContextMenuItem[] = [
    {
      id: 'unit-header',
      label: `وحدة القياس الحالية: ${activeUnit.toUpperCase()}`,
      disabled: true,
    },
    {
      id: 'set-px',
      label: 'بكسل (Pixels - px)',
      icon: <Check className={`w-3.5 h-3.5 ${activeUnit === 'px' ? 'text-blue-600' : 'opacity-0'}`} />,
      onClick: () => {
        setActiveUnit('px');
        onUnitChange?.('px');
        notificationEngine.info('تم ضبط وحدة قياس المسطرة على البكسل (px)');
      },
    },
    {
      id: 'set-mm',
      label: 'ميليمتر (Millimeters - mm)',
      icon: <Check className={`w-3.5 h-3.5 ${activeUnit === 'mm' ? 'text-blue-600' : 'opacity-0'}`} />,
      onClick: () => {
        setActiveUnit('mm');
        onUnitChange?.('mm');
        notificationEngine.info('تم ضبط وحدة قياس المسطرة على الميليمتر (mm)');
      },
    },
    {
      id: 'set-in',
      label: 'بوصة (Inches - in)',
      icon: <Check className={`w-3.5 h-3.5 ${activeUnit === 'in' ? 'text-blue-600' : 'opacity-0'}`} />,
      onClick: () => {
        setActiveUnit('in');
        onUnitChange?.('in');
        notificationEngine.info('تم ضبط وحدة قياس المسطرة على البوصة (in)');
      },
    },
    {
      id: 'set-pt',
      label: 'نقطة طباعية (Points - pt)',
      icon: <Check className={`w-3.5 h-3.5 ${activeUnit === 'pt' ? 'text-blue-600' : 'opacity-0'}`} />,
      onClick: () => {
        setActiveUnit('pt');
        onUnitChange?.('pt');
        notificationEngine.info('تم ضبط وحدة قياس المسطرة على النقطة (pt)');
      },
    },
    { id: 'sep-1', label: '', separator: true },
    {
      id: 'add-guide',
      label: contextMenu.clickedRuler === 'vertical'
        ? `إضافة خط إرشادي رأسي عند ${formatCoord(contextMenu.coordValue)} ${activeUnit}`
        : `إضافة خط إرشادي أفقي عند ${formatCoord(contextMenu.coordValue)} ${activeUnit}`,
      icon: <Plus className="w-3.5 h-3.5 text-blue-600" />,
      onClick: () => {
        if (onAddGuide && contextMenu.clickedRuler) {
          onAddGuide(
            contextMenu.clickedRuler === 'vertical' ? 'vertical' : 'horizontal',
            contextMenu.coordValue
          );
          notificationEngine.success(`تمت إضافة خط إرشادي جديد عند ${formatCoord(contextMenu.coordValue)} ${activeUnit}`);
        }
      },
    },
    {
      id: 'toggle-grid',
      label: showGrid ? 'إخفاء شبكة المحاذاة (Grid)' : 'إظهار شبكة المحاذاة (Grid)',
      icon: <Grid className="w-3.5 h-3.5 text-slate-600" />,
      onClick: () => {
        onToggleGrid?.();
      },
    },
    {
      id: 'toggle-rulers',
      label: showRulers ? 'إخفاء المساطر' : 'إظهار المساطر',
      icon: showRulers ? <EyeOff className="w-3.5 h-3.5 text-slate-600" /> : <Eye className="w-3.5 h-3.5 text-slate-600" />,
      onClick: () => {
        setShowRulers(!showRulers);
      },
    },
  ];

  if (!showRulers) {
    return <>{children}</>;
  }

  // إنشاء علامات المسطرة الأفقية
  const renderHorizontalTicks = () => {
    const ticks = [];
    const totalPx = Math.max(artboardWidth + 800, 2400);

    for (let px = 0; px <= totalPx; px += minor) {
      const isMajor = px % major === 0;
      const screenPos = px * zoom;
      const tickHeight = isMajor ? 12 : 6;

      ticks.push(
        <g key={`h-tick-${px}`} transform={`translate(${screenPos}, 0)`}>
          <line
            x1={0}
            y1={RULER_THICKNESS - tickHeight}
            x2={0}
            y2={RULER_THICKNESS}
            stroke="#cbd5e1"
            strokeWidth={1}
          />
          {isMajor && (
            <text
              x={2}
              y={10}
              fontSize={9}
              fontFamily="sans-serif"
              fill="#64748b"
              fontWeight="bold"
            >
              {formatCoord(px)}
            </text>
          )}
        </g>
      );
    }
    return ticks;
  };

  // إنشاء علامات المسطرة العمودية
  const renderVerticalTicks = () => {
    const ticks = [];
    const totalPx = Math.max(artboardHeight + 800, 2400);

    for (let px = 0; px <= totalPx; px += minor) {
      const isMajor = px % major === 0;
      const screenPos = px * zoom;
      const tickWidth = isMajor ? 12 : 6;

      ticks.push(
        <g key={`v-tick-${px}`} transform={`translate(0, ${screenPos})`}>
          <line
            x1={RULER_THICKNESS - tickWidth}
            y1={0}
            x2={RULER_THICKNESS}
            y2={0}
            stroke="#cbd5e1"
            strokeWidth={1}
          />
          {isMajor && (
            <text
              x={2}
              y={10}
              fontSize={9}
              fontFamily="sans-serif"
              fill="#64748b"
              fontWeight="bold"
              transform="rotate(-90 8 10)"
            >
              {formatCoord(px)}
            </text>
          )}
        </g>
      );
    }
    return ticks;
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none bg-slate-100" dir="ltr">
      {/* Top Bar: Corner Box + Horizontal Ruler */}
      <div className="flex h-6 w-full bg-white border-b border-slate-200 z-20 shrink-0">
        {/* Corner Unit Switcher (Right-Click enabled) */}
        <div
          className="w-6 h-6 bg-slate-50 border-r border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer shrink-0 transition"
          title={`وحدة القياس: ${activeUnit.toUpperCase()} (انقر بالزر الأيمن للخيارات)`}
          onClick={() => {
            const nextUnits: Record<string, 'px' | 'mm' | 'in' | 'pt'> = {
              px: 'mm',
              mm: 'in',
              in: 'pt',
              pt: 'px',
            };
            const next = nextUnits[activeUnit];
            setActiveUnit(next);
            onUnitChange?.(next);
            notificationEngine.info(`تم تبديل الوحدة إلى: ${next.toUpperCase()}`);
          }}
          onContextMenu={(e) => handleRulerContextMenu(e, 'corner', 0)}
        >
          {activeUnit}
        </div>

        {/* Horizontal Ruler Canvas / SVG */}
        <div
          className="flex-1 h-6 overflow-hidden relative cursor-crosshair bg-slate-50/50"
          onContextMenu={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pxVal = (e.clientX - rect.left) / zoom;
            handleRulerContextMenu(e, 'horizontal', pxVal);
          }}
          title="مسطرة أفقية (انقر بالزر الأيمن لإضافة خط إرشادي وتغيير الوحدة)"
        >
          <svg className="w-full h-6 block">
            {renderHorizontalTicks()}
          </svg>
        </div>
      </div>

      {/* Main Row: Vertical Ruler + Stage Children */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Vertical Ruler */}
        <div
          className="w-6 bg-slate-50/50 border-r border-slate-200 overflow-hidden relative cursor-crosshair shrink-0 z-20"
          onContextMenu={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pxVal = (e.clientY - rect.top) / zoom;
            handleRulerContextMenu(e, 'vertical', pxVal);
          }}
          title="مسطرة عمودية (انقر بالزر الأيمن لإضافة خط إرشادي وتغيير الوحدة)"
        >
          <svg className="w-6 h-full block">
            {renderVerticalTicks()}
          </svg>
        </div>

        {/* Artboard Stage Area */}
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>
      </div>

      {/* Shared Context Menu for Rulers (Right-Click functionality) */}
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
