/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مساحة العمل التفاعلية للرسم وتصميم الواجهات - Canvas Component
 * 🏛️ الدور: مكون رئيسي - الرسم والتصميم والخرائط الذهنية ومعالجة الصور
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Canvas: كانفاس بدون مكتبات خارجية
 *    مع دعم التصميم والرسم بالفأرة فقط
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الرسم يجب أن يكون فورياً
 *    2. الثيم الفاتح النقي يجب أن يبقى سليماً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الأبعاد قبل الرسم
 *    - fallback لحالة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * @file /src/components/canvas/Canvas.tsx
 * @description
 * مساحة العمل التفاعلية (Canvas) للرسم، تصميم الواجهات، الخرائط الذهنية، المعادلات الرياضية، ومعالجة الصور المتقدمة.
 * بتصميم فاتح نقي 100% وبدون أي مكتبات خارجية ثقيلة (Zero-Dependency).
 *
 * التوجهات والغرض:
 * 1. دعم وضع التصميم والرسم التفاعلي بالفأرة فقط (Zero-Keyboard).
 * 2. تشكيل وقص وتنسيق الصور الهندسية واللمعان مع إمكانية فتح محرر الصور المتقدم `ImageEditor`.
 * 3. ثيم فاتح نقي ومشرق (Light Pure Theme).
 *
 * الاختبارات المغطاة:
 * - مغطى في `src/core/__tests__/canvas_flow_tools.test.ts` و `src/core/__tests__/image_pipeline_and_asset_manager.test.ts`.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid,
  Sparkles,
  MousePointer,
  Square,
  Circle,
  Diamond,
  Type,
  MoveRight,
  Pencil,
  Eraser,
  Image as ImageIcon,
  MessageSquare,
  Layers,
  Code2,
  GitBranch,
  BookOpen,
  Sigma,
  Download,
  Trash2,
  Copy,
  Sliders,
  Check,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import {
  imageStyleEngine,
  type ImageStyleOptions,
  type ImageShapeType,
  type ShadowPreset,
  type GlossPreset,
} from '../../shared/engines/ImageStyleEngine';
import { latexEngine } from '../../shared/engines/LaTeXEngine';
import { mindMapEngine, type MindMapNode } from '../../shared/engines/MindMapEngine';
import {
  presentationNotebookEngine,
  type NotebookSlide,
  type HeaderFooterTemplate,
} from '../../shared/engines/PresentationNotebookEngine';
import { dialogEngine } from '../../shared/engines/DialogEngine';
import { ImageEditor } from '../../shared/components/ImageEditor';

export type CanvasTheme = 'light' | 'warm-light' | 'slate-light' | 'azure-light' | 'mint-light';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface CanvasShapeElement {
  id: string;
  type:
    | 'rectangle'
    | 'circle'
    | 'diamond'
    | 'triangle'
    | 'star'
    | 'hexagon'
    | 'text'
    | 'latex'
    | 'image'
    | 'callout'
    | 'mindmap'
    | 'connector'
    | 'slide-card';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  text?: string;
  latex?: string;
  imageUrl?: string;
  imageOptions?: ImageStyleOptions;
  calloutTitle?: string;
  calloutDescription?: string;
  stepNumber?: number;
  mindMapData?: MindMapNode;
  zIndex: number;
  rotation?: number;
}

export interface DrawingPath {
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
  isHighlighter?: boolean;
}

interface CanvasProps {
  elements?: CanvasShapeElement[];
  onSelectElement?: (el: CanvasShapeElement | null) => void;
  onCodeInspect?: (code: string, language: string) => void;
  initialMode?: 'design' | 'mindmap' | 'notebook' | 'drawing';
}

export const Canvas: React.FC<CanvasProps> = ({
  elements: initialElements,
  onSelectElement,
  onCodeInspect,
  initialMode = 'design',
}) => {
  // Viewport & Zoom
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showGrid, setShowGrid] = useState(true);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>('light');
  const [viewOptionsOpen, setViewOptionsOpen] = useState(false);

  // Active Tool
  const [activeTool, setActiveTool] = useState<
    | 'select'
    | 'pen'
    | 'highlighter'
    | 'eraser'
    | 'rectangle'
    | 'circle'
    | 'diamond'
    | 'triangle'
    | 'star'
    | 'hexagon'
    | 'text'
    | 'latex'
    | 'image'
    | 'callout'
    | 'mindmap'
    | 'slide-card'
  >('select');

  // Canvas Mode
  const [canvasMode, setCanvasMode] = useState<'design' | 'mindmap' | 'notebook' | 'drawing'>(
    initialMode,
  );

  // Elements State
  const [elements, setElements] = useState<CanvasShapeElement[]>(() => {
    if (initialElements && initialElements.length > 0) return initialElements;
    return [
      {
        id: 'el-hero',
        type: 'rectangle',
        x: 100,
        y: 80,
        width: 320,
        height: 160,
        fillColor: '#eff6ff',
        strokeColor: '#3b82f6',
        strokeWidth: 2,
        text: 'مساحة العمل المتكاملة ⚡\nتحرير فوري ورسم حر وشروحات',
        zIndex: 1,
      },
      {
        id: 'el-math',
        type: 'latex',
        x: 460,
        y: 80,
        width: 280,
        height: 120,
        latex: 'E = mc^2 \\quad \\text{و} \\quad \\sqrt{a^2 + b^2}',
        zIndex: 2,
      },
      {
        id: 'el-callout',
        type: 'callout',
        x: 100,
        y: 280,
        width: 300,
        height: 100,
        calloutTitle: 'خطوة توضيحية ذكية',
        calloutDescription: 'انقر على أي عنصر لفحص الشيفرة البرمجية وتعديل الأنماط والخصائص.',
        stepNumber: 1,
        fillColor: '#ffffff',
        strokeColor: '#2563eb',
        zIndex: 3,
      },
    ];
  });

  // Freehand Drawing Paths
  const [drawingPaths, setDrawingPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [penColor, setPenColor] = useState('#2563eb');
  const [penWidth, setPenWidth] = useState(3);

  // Selection & Dragging
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Mindmap Data
  const [mindMapRoot, setMindMapRoot] = useState<MindMapNode>(() =>
    mindMapEngine.createSampleMindMap('الخريطة الذهنية المركزية'),
  );

  // Presentation Notebook Data
  const [notebookData, setNotebookData] = useState(() =>
    presentationNotebookEngine.createSampleNotebook(),
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Image Shape Transformer Modal State
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [advancedEditingImage, setAdvancedEditingImage] = useState<CanvasShapeElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // Sync selected element code inspection
  useEffect(() => {
    if (selectedElement && onCodeInspect) {
      let code = '';
      if (selectedElement.type === 'latex') {
        code = `$$ ${selectedElement.latex || ''} $$`;
      } else if (selectedElement.type === 'image') {
        code = imageStyleEngine.renderToHtml(
          selectedElement.imageUrl || '',
          'صورة منسقة',
          selectedElement.imageOptions,
        );
      } else if (selectedElement.type === 'callout') {
        code = `<div class="p-4 bg-white border-2 border-blue-500 rounded-xl shadow-xs">\n  <strong>${selectedElement.calloutTitle}</strong>\n  <p>${selectedElement.calloutDescription}</p>\n</div>`;
      } else {
        code = `<div style="background-color: ${selectedElement.fillColor}; border: ${selectedElement.strokeWidth}px solid ${selectedElement.strokeColor}; width: ${selectedElement.width}px; height: ${selectedElement.height}px;">\n  ${selectedElement.text || ''}\n</div>`;
      }
      onCodeInspect(code, selectedElement.type === 'latex' ? 'latex' : 'html');
    }
  }, [selectedElement, onCodeInspect]);

  // Handle Mouse Down on Stage for Drawing or Creating
  const handleStageMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;
    const clickX = (e.clientX - rect.left) / scale;
    const clickY = (e.clientY - rect.top) / scale;

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      const newPath: DrawingPath = {
        id: `path-${Date.now()}`,
        points: [{ x: clickX, y: clickY }],
        color: penColor,
        width: activeTool === 'highlighter' ? 16 : penWidth,
        isHighlighter: activeTool === 'highlighter',
      };
      setCurrentPath(newPath);
      return;
    }

    if (activeTool === 'eraser') {
      // Erase nearby paths
      setDrawingPaths((prev) =>
        prev.filter((p) => {
          const isNear = p.points.some((pt) => Math.hypot(pt.x - clickX, pt.y - clickY) < 20);
          return !isNear;
        }),
      );
      return;
    }

    if (activeTool !== 'select') {
      // Create Shape
      const newId = `el-${Date.now()}`;
      let newEl: CanvasShapeElement;

      if (activeTool === 'latex') {
        newEl = {
          id: newId,
          type: 'latex',
          x: clickX - 100,
          y: clickY - 40,
          width: 240,
          height: 90,
          latex: 'f(x) = \\int_{-\\infty}^{\\infty} e^{-x^2} dx',
          zIndex: elements.length + 1,
        };
      } else if (activeTool === 'callout') {
        newEl = {
          id: newId,
          type: 'callout',
          x: clickX - 120,
          y: clickY - 40,
          width: 260,
          height: 90,
          calloutTitle: 'شرح توضيحي جديد',
          calloutDescription: 'اكتب نص الشرح والملاحظة التفاعلية هنا.',
          stepNumber: elements.length + 1,
          fillColor: '#ffffff',
          strokeColor: '#2563eb',
          zIndex: elements.length + 1,
        };
      } else if (activeTool === 'image') {
        newEl = {
          id: newId,
          type: 'image',
          x: clickX - 100,
          y: clickY - 80,
          width: 200,
          height: 160,
          imageUrl:
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
          imageOptions: {
            shape: 'rounded',
            borderRadius: 16,
            shadow: 'elevation-md',
            gloss: 'top-shine',
          },
          zIndex: elements.length + 1,
        };
      } else {
        newEl = {
          id: newId,
          type: activeTool as any,
          x: clickX - 60,
          y: clickY - 40,
          width: 130,
          height: 80,
          fillColor: '#ffffff',
          strokeColor: penColor,
          strokeWidth: 2,
          text: activeTool === 'text' ? 'نص جديد' : '',
          zIndex: elements.length + 1,
        };
      }

      setElements((prev) => [...prev, newEl]);
      setSelectedId(newId);
      onSelectElement?.(newEl);
      setActiveTool('select');
      return;
    }

    // Deselect if clicked on empty stage
    setSelectedId(null);
    onSelectElement?.(null);
  };

  const handleStageMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;
    const moveX = (e.clientX - rect.left) / scale;
    const moveY = (e.clientY - rect.top) / scale;

    if (currentPath) {
      setCurrentPath((prev) =>
        prev ? { ...prev, points: [...prev.points, { x: moveX, y: moveY }] } : null,
      );
    } else if (isDragging && selectedId) {
      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedId
            ? { ...el, x: Math.round(moveX - dragOffset.x), y: Math.round(moveY - dragOffset.y) }
            : el,
        ),
      );
    }
  };

  const handleStageMouseUp = () => {
    if (currentPath) {
      setDrawingPaths((prev) => [...prev, currentPath]);
      setCurrentPath(null);
    }
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasShapeElement) => {
    e.stopPropagation();
    if (activeTool !== 'select') return;
    setSelectedId(el.id);
    onSelectElement?.(el);
    setIsDragging(true);

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const scale = zoomLevel / 100;
      const mouseX = (e.clientX - rect.left) / scale;
      const mouseY = (e.clientY - rect.top) / scale;
      setDragOffset({ x: mouseX - el.x, y: mouseY - el.y });
    }
  };

  // Viewport width styling
  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const vpDims = getViewportDimensions();

  // Canvas background theme styles (100% Light Tones)
  const getThemeBackground = () => {
    switch (canvasTheme) {
      case 'warm-light':
        return 'bg-[#faf8f5]';
      case 'slate-light':
        return 'bg-[#f1f5f9]';
      case 'azure-light':
        return 'bg-[#f0f7ff]';
      case 'mint-light':
        return 'bg-[#f0fdf4]';
      case 'light':
      default:
        return 'bg-[#ffffff]';
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col bg-slate-100 overflow-hidden select-none font-sans text-slate-800"
      dir="rtl"
    >
      {/* 1. TOP TOOLBAR */}
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 shadow-xs shrink-0 z-20">
        {/* Left: Modes & Viewport */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setCanvasMode('design')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                canvasMode === 'design'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎨 مصمم الأشكال
            </button>
            <button
              onClick={() => setCanvasMode('mindmap')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                canvasMode === 'mindmap'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧠 خرائط ذهنية
            </button>
            <button
              onClick={() => setCanvasMode('notebook')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                canvasMode === 'notebook'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📓 نوتبوك وشرائح
            </button>
          </div>

          {/* Viewport Modes */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewport === 'desktop' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="عرض سطح المكتب"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-md transition-all ${viewport === 'tablet' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="عرض الجهاز اللوحي"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewport === 'mobile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="عرض الهاتف"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Tools Palette */}
        {canvasMode === 'design' && (
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTool('select')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'select' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="أداة التحديد والتحريك (V)"
            >
              <MousePointer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('pen')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'pen' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="قلم الرسم الحر (P)"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('highlighter')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'highlighter' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="قلم التمييز الفسفوري"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('eraser')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'eraser' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="ممحاة الرسم"
            >
              <Eraser className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <button
              onClick={() => setActiveTool('rectangle')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'rectangle' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="مستطيل"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('circle')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'circle' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="دائرة"
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('diamond')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'diamond' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="معين"
            >
              <Diamond className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('text')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'text' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              title="نص"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('latex')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'latex' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'}`}
              title="معادلة LaTeX رياضية"
            >
              <Sigma className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('callout')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'callout' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 bg-amber-50 hover:bg-amber-100'}`}
              title="مربع شرح وتوضيح"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('image')}
              className={`p-1.5 rounded-lg transition-all ${activeTool === 'image' ? 'bg-sky-600 text-white shadow-xs' : 'text-sky-700 bg-sky-50 hover:bg-sky-100'}`}
              title="صورة مع أشكال وتأثيرات ولمعان"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Theme, Grid & Zoom */}
        <div className="flex items-center gap-2">
          {/* Canvas Light Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setViewOptionsOpen(!viewOptionsOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <div
                className="w-3 h-3 rounded-full border border-slate-300"
                style={{
                  backgroundColor:
                    canvasTheme === 'light'
                      ? '#fff'
                      : canvasTheme === 'warm-light'
                        ? '#faf8f5'
                        : canvasTheme === 'azure-light'
                          ? '#f0f7ff'
                          : '#f1f5f9',
                }}
              />
              <span>الثيم الفاتح</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {viewOptionsOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setCanvasTheme('light');
                    setViewOptionsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-right"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white border border-slate-300" /> فاتح
                    ناصع
                  </span>
                  {canvasTheme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    setCanvasTheme('warm-light');
                    setViewOptionsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-right"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#faf8f5] border border-amber-200" />{' '}
                    دافئ مريح
                  </span>
                  {canvasTheme === 'warm-light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    setCanvasTheme('azure-light');
                    setViewOptionsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-right"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#f0f7ff] border border-blue-200" />{' '}
                    أزرق سماوي
                  </span>
                  {canvasTheme === 'azure-light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    setCanvasTheme('slate-light');
                    setViewOptionsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-right"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#f1f5f9] border border-slate-300" />{' '}
                    رمادي حديث
                  </span>
                  {canvasTheme === 'slate-light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border transition-colors ${showGrid ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
            title="إظهار / إخفاء الشبكة"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs text-slate-700 font-semibold">
            <button
              onClick={() => setZoomLevel((z) => Math.max(40, z - 10))}
              className="p-1 hover:bg-slate-200 rounded"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(250, z + 10))}
              className="p-1 hover:bg-slate-200 rounded"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN STAGE AREA */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center p-6 relative"
      >
        {/* DESIGN & SHAPES MODE */}
        {canvasMode === 'design' && (
          <div
            style={{
              width: vpDims.width,
              height: vpDims.height,
              maxWidth: '1400px',
              minHeight: '800px',
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease',
            }}
            className={`relative rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${getThemeBackground()}`}
          >
            {/* SVG STAGE */}
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full cursor-crosshair"
              onMouseDown={handleStageMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseUp={handleStageMouseUp}
            >
              {/* Dot Grid Pattern */}
              {showGrid && (
                <defs>
                  <pattern
                    id="canvas-dot-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="10" cy="10" r="1.2" fill="#cbd5e1" />
                  </pattern>
                </defs>
              )}
              {showGrid && <rect width="100%" height="100%" fill="url(#canvas-dot-grid)" />}

              {/* Freehand Drawing Paths */}
              {drawingPaths.map((p) => {
                const d = p.points.reduce(
                  (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
                  '',
                );
                return (
                  <path
                    key={p.id}
                    d={d}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={p.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={p.isHighlighter ? 0.35 : 1}
                  />
                );
              })}

              {/* Current Active Path */}
              {currentPath && (
                <path
                  d={currentPath.points.reduce(
                    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
                    '',
                  )}
                  fill="none"
                  stroke={currentPath.color}
                  strokeWidth={currentPath.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={currentPath.isHighlighter ? 0.35 : 1}
                />
              )}
            </svg>

            {/* DOM / HTML RENDERED ELEMENTS */}
            {elements.map((el) => {
              const isSelected = el.id === selectedId;
              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  style={{
                    position: 'absolute',
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    zIndex: el.zIndex,
                    cursor: activeTool === 'select' ? 'move' : 'default',
                  }}
                  className={`group transition-shadow ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                >
                  {/* Element Inner Renderer */}
                  {el.type === 'latex' && (
                    <div
                      className="w-full h-full bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-center overflow-x-auto select-all"
                      dangerouslySetInnerHTML={{
                        __html: latexEngine.renderToHtml(el.latex || '', true),
                      }}
                    />
                  )}

                  {el.type === 'callout' && (
                    <div
                      className="w-full h-full bg-white border-2 border-blue-500 rounded-xl p-3.5 shadow-xs flex flex-col justify-between"
                      style={{ borderColor: el.strokeColor || '#2563eb' }}
                    >
                      <div className="flex items-center gap-2">
                        {el.stepNumber && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center">
                            {el.stepNumber}
                          </span>
                        )}
                        <strong className="text-xs font-bold text-slate-800">
                          {el.calloutTitle || 'شرح توضيحي'}
                        </strong>
                      </div>
                      <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                        {el.calloutDescription}
                      </p>
                    </div>
                  )}

                  {el.type === 'image' && (
                    <div
                      className="w-full h-full relative"
                      dangerouslySetInnerHTML={{
                        __html: imageStyleEngine.renderToHtml(
                          el.imageUrl || '',
                          'صورة منسقة',
                          el.imageOptions,
                        ),
                      }}
                      onDoubleClick={() => setEditingImageId(el.id)}
                    />
                  )}

                  {el.type === 'rectangle' && (
                    <div
                      className="w-full h-full rounded-xl flex items-center justify-center text-center p-3 text-xs font-bold shadow-xs whitespace-pre-line"
                      style={{
                        backgroundColor: el.fillColor || '#ffffff',
                        border: `${el.strokeWidth || 1}px solid ${el.strokeColor || '#cbd5e1'}`,
                        color: '#1e293b',
                      }}
                    >
                      {el.text}
                    </div>
                  )}

                  {el.type === 'circle' && (
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-center p-2 text-xs font-bold shadow-xs"
                      style={{
                        backgroundColor: el.fillColor || '#ffffff',
                        border: `${el.strokeWidth || 1}px solid ${el.strokeColor || '#cbd5e1'}`,
                        color: '#1e293b',
                      }}
                    >
                      {el.text}
                    </div>
                  )}

                  {el.type === 'diamond' && (
                    <div
                      className="w-full h-full flex items-center justify-center text-center p-2 text-xs font-bold shadow-xs"
                      style={{
                        backgroundColor: el.fillColor || '#ffffff',
                        border: `${el.strokeWidth || 1}px solid ${el.strokeColor || '#cbd5e1'}`,
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        color: '#1e293b',
                      }}
                    >
                      {el.text}
                    </div>
                  )}

                  {el.type === 'text' && (
                    <div className="w-full h-full flex items-center p-2 text-sm font-bold text-slate-800">
                      {el.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MIND MAP MODE */}
        {canvasMode === 'mindmap' && (
          <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 flex flex-col min-h-[700px]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    محرر الخرائط الذهنية والعقد التفاعلية
                  </h3>
                  <p className="text-xs text-slate-500">
                    توزيع تلقائي للمسارات المنحنية والعقد المركزية
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const svgCode = mindMapEngine.exportToSvg(mindMapRoot);
                  const blob = new Blob([svgCode], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'mindmap.svg';
                  a.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير الخريطة SVG</span>
              </button>
            </div>
            <div
              className="flex-1 rounded-xl overflow-auto p-4 bg-slate-50/50 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: mindMapEngine.exportToSvg(mindMapRoot) }}
            />
          </div>
        )}

        {/* PRESENTATION NOTEBOOK MODE */}
        {canvasMode === 'notebook' && (
          <div className="w-full max-w-4xl flex flex-col gap-4">
            {/* Slide Navigation */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-xs text-slate-800">
                  شريحة {activeSlideIndex + 1} من {notebookData.slides.length}:{' '}
                  {notebookData.slides[activeSlideIndex]?.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
                  disabled={activeSlideIndex === 0}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-bold"
                >
                  السابق
                </button>
                <button
                  onClick={() =>
                    setActiveSlideIndex((i) => Math.min(notebookData.slides.length - 1, i + 1))
                  }
                  disabled={activeSlideIndex === notebookData.slides.length - 1}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold"
                >
                  التالي
                </button>
              </div>
            </div>

            {/* Slide Page Content */}
            {notebookData.slides[activeSlideIndex] && (
              <div
                dangerouslySetInnerHTML={{
                  __html: presentationNotebookEngine.renderSlideToHtml(
                    notebookData.slides[activeSlideIndex],
                    notebookData.headerFooter,
                    notebookData.slides.length,
                  ),
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* 3. IMAGE SHAPE & STYLING MODAL (When Double-clicking an Image) */}
      {editingImageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-800 text-sm">
                  تنسيق الصورة وتشكيل الحواف واللمعان
                </h3>
              </div>
              <button
                onClick={() => setEditingImageId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              {/* Button to Launch Full Image Editor */}
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-900 text-xs">معالج ومحرر الصور المتقدم</div>
                  <div className="text-[11px] text-blue-700">
                    قص بـ 8 مقابض، تحكم بالسطوع والتباين، فلاتر، وتدوير
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = elements.find((e) => e.id === editingImageId);
                    if (el && el.imageUrl) {
                      setAdvancedEditingImage(el);
                      setEditingImageId(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>فتح المحرر المتقدم</span>
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  الشكل الهندسي (Shape Mask)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      'rounded',
                      'circle',
                      'pill',
                      'hexagon',
                      'diamond',
                      'star',
                      'shield',
                      'squircle',
                    ] as ImageShapeType[]
                  ).map((shp) => (
                    <button
                      key={shp}
                      onClick={() => {
                        setElements((prev) =>
                          prev.map((el) =>
                            el.id === editingImageId
                              ? { ...el, imageOptions: { ...el.imageOptions, shape: shp } }
                              : el,
                          ),
                        );
                      }}
                      className="p-2 border border-slate-200 rounded-lg hover:border-blue-500 capitalize text-center"
                    >
                      {shp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  تأثيرات اللمعان والانعكاس (Gloss / Shine)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'top-shine', 'diagonal-gloss', 'glass-card'] as GlossPreset[]).map(
                    (gls) => (
                      <button
                        key={gls}
                        onClick={() => {
                          setElements((prev) =>
                            prev.map((el) =>
                              el.id === editingImageId
                                ? { ...el, imageOptions: { ...el.imageOptions, gloss: gls } }
                                : el,
                            ),
                          );
                        }}
                        className="p-2 border border-slate-200 rounded-lg hover:border-blue-500 capitalize text-center"
                      >
                        {gls}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  قوالب الظلال الناعمة (Elevation Shadows)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      'soft-subtle',
                      'elevation-md',
                      'elevation-lg',
                      'blue-glow',
                      'floating-3d',
                    ] as ShadowPreset[]
                  ).map((shd) => (
                    <button
                      key={shd}
                      onClick={() => {
                        setElements((prev) =>
                          prev.map((el) =>
                            el.id === editingImageId
                              ? { ...el, imageOptions: { ...el.imageOptions, shadow: shd } }
                              : el,
                          ),
                        );
                      }}
                      className="p-2 border border-slate-200 rounded-lg hover:border-blue-500 capitalize text-center"
                    >
                      {shd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setEditingImageId(null)}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
              >
                تم وتطبيق التنسيقات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADVANCED IMAGE EDITOR MODAL (Full Canvas Engine) */}
      {advancedEditingImage && advancedEditingImage.imageUrl && (
        <ImageEditor
          src={advancedEditingImage.imageUrl}
          imageName={advancedEditingImage.text || 'صورة الكانفا'}
          onSave={(result) => {
            setElements((prev) =>
              prev.map((el) =>
                el.id === advancedEditingImage.id
                  ? {
                      ...el,
                      imageUrl: result.dataUrl,
                      width: Math.min(1000, result.width),
                      height: Math.min(800, result.height),
                    }
                  : el,
              ),
            );
            setAdvancedEditingImage(null);
          }}
          onCancel={() => setAdvancedEditingImage(null)}
        />
      )}
    </div>
  );
};
