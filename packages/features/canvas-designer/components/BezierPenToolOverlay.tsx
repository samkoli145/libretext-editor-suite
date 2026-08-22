/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أداة رسم المنحنيات المتجهة ومسارات بيزييه المتقدمة - Bézier Pen Tool
 * 🏛️ الدور: مكون مشترك - رسم حي للنقاط وسحب مقابض المماس التفاعلية
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Interactive Bezier Drawing: رسم بيزييه تفاعلي
 *    مع إغلاق المسار وإضافة نقاط ومعاينة حية وتثبيت في الكانفا
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. النقاط يجب أن تكون دقيقة
 *    2. المعاينة يجب أن تكون لحظية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة النقاط قبل الرسم
 *    - fallback لمسار مستقيم
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Check,
  X,
  Undo2,
  Spline,
  Circle,
  Square,
  Lock,
  Unlock,
  Move,
  CornerUpRight,
  Palette,
  Eye,
} from 'lucide-react';
import {
  type VectorPathData,
  type PathVertex,
  createEmptyPath,
  pathToSvgString,
  addVertex,
} from '../../../shared/vector-engine/path_editor';
import { type Point2D, distance } from '../../../shared/vector-engine/common';
import { notificationEngine } from '../../../shared/engines/NotificationEngine';

export interface BezierPenToolOverlayProps {
  stageWidth: number;
  stageHeight: number;
  zoom?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  onCommitPath: (pathData: {
    pathD: string;
    points: Array<{ x: number; y: number }>;
    bbox: { x: number; y: number; width: number; height: number };
    fill: string;
    stroke: string;
    strokeWidth: number;
  }) => void;
  onCancel: () => void;
}

export const BezierPenToolOverlay: React.FC<BezierPenToolOverlayProps> = ({
  stageWidth,
  stageHeight,
  zoom = 1,
  strokeColor = '#2563eb',
  fillColor = 'transparent',
  strokeWidth = 2,
  onCommitPath,
  onCancel,
}) => {
  const [vertices, setVertices] = useState<PathVertex[]>([]);
  const [isClosed, setIsClosed] = useState(false);
  const [cursorPos, setCursorPos] = useState<Point2D | null>(null);
  const [activeStrokeColor, setActiveStrokeColor] = useState(strokeColor);
  const [activeFillColor, setActiveFillColor] = useState(fillColor);
  const [activeStrokeWidth, setActiveStrokeWidth] = useState(strokeWidth);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [dragVertexIndex, setDragVertexIndex] = useState<number | null>(null);

  const containerRef = useRef<SVGSVGElement>(null);

  // تحويل إحداثيات حدث الفأرة إلى إحداثيات الكانفا بالنسبة لحجم الـ Stage والـ Zoom
  const getCanvasCoords = useCallback(
    (e: React.MouseEvent | MouseEvent): Point2D => {
      if (!containerRef.current) return { x: e.clientX, y: e.clientY };
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) / zoom;
      const rawY = (e.clientY - rect.top) / zoom;
      return {
        x: Math.round(rawX * 10) / 10,
        y: Math.round(rawY * 10) / 10,
      };
    },
    [zoom]
  );

  // التعامل مع تحريك مؤشر الفأرة
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getCanvasCoords(e);
    setCursorPos(coords);

    if (isDraggingHandle && dragVertexIndex !== null && vertices[dragVertexIndex]) {
      const vtx = vertices[dragVertexIndex];
      const dx = coords.x - vtx.point.x;
      const dy = coords.y - vtx.point.y;

      // تحديث مقبض الخروج مع المماس العكسي لمقبض الدخول
      setVertices((prev) => {
        const updated = [...prev];
        updated[dragVertexIndex] = {
          ...vtx,
          type: 'smooth',
          outHandle: { x: coords.x, y: coords.y },
          inHandle: { x: vtx.point.x - dx, y: vtx.point.y - dy },
        };
        return updated;
      });
    }
  };

  // التعامل مع النقر لإنشاء نقطة جديدة أو إغلاق المسار
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // الزر الأيسر فقط
    const coords = getCanvasCoords(e);

    // إذا كانت هناك نقطة أولى وقريبة من المؤشر -> إغلاق المسار
    if (vertices.length >= 2 && !isClosed) {
      const first = vertices[0].point;
      if (distance(coords, first) < 14) {
        setIsClosed(true);
        notificationEngine.info('تم إغلاق المنحنى المتجه');
        return;
      }
    }

    if (isClosed) return;

    // إضافة نقطة جديدة والبدء في وضع سحب المماس
    const newIndex = vertices.length;
    const newVertex: PathVertex = {
      id: `vtx-${Date.now()}-${newIndex}`,
      point: coords,
      type: 'corner',
    };

    setVertices((prev) => [...prev, newVertex]);
    setIsDraggingHandle(true);
    setDragVertexIndex(newIndex);
  };

  // إنهاء سحب مقبض المماس
  const handleMouseUp = () => {
    if (isDraggingHandle) {
      setIsDraggingHandle(false);
      setDragVertexIndex(null);
    }
  };

  // التراجع عن آخر نقطة
  const handleUndoPoint = () => {
    if (isClosed) {
      setIsClosed(false);
      return;
    }
    setVertices((prev) => prev.slice(0, -1));
  };

  // توليد كائن VectorPathData المؤقت لعرضه
  const currentPathData: VectorPathData = {
    id: 'pen-active-path',
    closed: isClosed,
    vertices,
    fill: activeFillColor,
    stroke: activeStrokeColor,
    strokeWidth: activeStrokeWidth,
  };

  const svgD = pathToSvgString(currentPathData);

  // إكمال وتثبيت المسار في الكانفا
  const handleCommit = () => {
    if (vertices.length < 2) {
      notificationEngine.warning('يرجى رسم نقطتين على الأقل لإنشاء المنحنى');
      return;
    }

    // حساب الإطار المحيط (Bounding Box) للمسار
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    vertices.forEach((v) => {
      minX = Math.min(minX, v.point.x, v.inHandle?.x ?? v.point.x, v.outHandle?.x ?? v.point.x);
      minY = Math.min(minY, v.point.y, v.inHandle?.y ?? v.point.y, v.outHandle?.y ?? v.point.y);
      maxX = Math.max(maxX, v.point.x, v.inHandle?.x ?? v.point.x, v.outHandle?.x ?? v.point.x);
      maxY = Math.max(maxY, v.point.y, v.inHandle?.y ?? v.point.y, v.outHandle?.y ?? v.point.y);
    });

    const padding = 10;
    const bbox = {
      x: Math.max(0, Math.round(minX - padding)),
      y: Math.max(0, Math.round(minY - padding)),
      width: Math.max(40, Math.round(maxX - minX + padding * 2)),
      height: Math.max(40, Math.round(maxY - minY + padding * 2)),
    };

    // نقل إحداثيات المسار لتكون نسبية لـ (bbox.x, bbox.y)
    const relativeVertices = vertices.map((v) => ({
      ...v,
      point: { x: v.point.x - bbox.x, y: v.point.y - bbox.y },
      inHandle: v.inHandle ? { x: v.inHandle.x - bbox.x, y: v.inHandle.y - bbox.y } : undefined,
      outHandle: v.outHandle ? { x: v.outHandle.x - bbox.x, y: v.outHandle.y - bbox.y } : undefined,
    }));

    const relativePathData: VectorPathData = {
      ...currentPathData,
      vertices: relativeVertices,
    };

    const finalSvgD = pathToSvgString(relativePathData);
    const pointsList = relativeVertices.map((v) => ({ x: v.point.x, y: v.point.y }));

    onCommitPath({
      pathD: finalSvgD,
      points: pointsList,
      bbox,
      fill: activeFillColor,
      stroke: activeStrokeColor,
      strokeWidth: activeStrokeWidth,
    });
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-auto select-none" dir="rtl">
      {/* Floating Control Ribbon (100% Light Theme) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-2 flex items-center gap-3 z-40 text-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
          <Spline className="w-4 h-4" />
          <span>أداة منحنيات بيزييه (Pen Tool)</span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndoPoint}
            disabled={vertices.length === 0}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
            title="تراجع عن آخر نقطة"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تراجع</span>
          </button>

          <button
            type="button"
            onClick={() => setIsClosed(!isClosed)}
            disabled={vertices.length < 3}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              isClosed
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
            <span>{isClosed ? 'مسار مغلق' : 'إغلاق المسار'}</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Color & Stroke Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" title="لون الخط">
            <span className="text-[11px] font-bold text-slate-500">الخط:</span>
            <input
              type="color"
              value={activeStrokeColor}
              onChange={(e) => setActiveStrokeColor(e.target.value)}
              className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer bg-white"
            />
          </div>

          <div className="flex items-center gap-1" title="لون التعبئة">
            <span className="text-[11px] font-bold text-slate-500">التعبئة:</span>
            <input
              type="color"
              value={activeFillColor === 'transparent' ? '#ffffff' : activeFillColor}
              onChange={(e) => setActiveFillColor(e.target.value)}
              className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer bg-white"
            />
            {activeFillColor !== 'transparent' && (
              <button
                type="button"
                onClick={() => setActiveFillColor('transparent')}
                className="text-[10px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
              >
                شفاف
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-500">السمك:</span>
            <select
              value={activeStrokeWidth}
              onChange={(e) => setActiveStrokeWidth(Number(e.target.value))}
              className="px-1.5 py-0.5 text-xs bg-slate-50 border border-slate-200 rounded cursor-pointer"
            >
              <option value={1}>1px</option>
              <option value={2}>2px</option>
              <option value={3}>3px</option>
              <option value={4}>4px</option>
              <option value={6}>6px</option>
            </select>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Commit / Cancel */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCommit}
            disabled={vertices.length < 2}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>حفظ وتثبيت ({vertices.length} نقاط)</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            title="إلغاء أداة القلم"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Surface */}
      <svg
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Render Active Bézier Path */}
        {svgD && (
          <path
            d={svgD}
            fill={activeFillColor}
            stroke={activeStrokeColor}
            strokeWidth={activeStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Live Elastic Connector Line to Cursor */}
        {!isClosed && vertices.length > 0 && cursorPos && (
          <line
            x1={vertices[vertices.length - 1].point.x}
            y1={vertices[vertices.length - 1].point.y}
            x2={cursorPos.x}
            y2={cursorPos.y}
            stroke={activeStrokeColor}
            strokeWidth={1}
            strokeDasharray="4,4"
            className="opacity-60"
          />
        )}

        {/* Render Handles & Tangent lines for each vertex */}
        {vertices.map((vtx, idx) => {
          const isFirst = idx === 0;
          return (
            <g key={vtx.id}>
              {/* Tangent lines to control handles */}
              {vtx.inHandle && (
                <>
                  <line
                    x1={vtx.point.x}
                    y1={vtx.point.y}
                    x2={vtx.inHandle.x}
                    y2={vtx.inHandle.y}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <circle
                    cx={vtx.inHandle.x}
                    cy={vtx.inHandle.y}
                    r={4}
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </>
              )}
              {vtx.outHandle && (
                <>
                  <line
                    x1={vtx.point.x}
                    y1={vtx.point.y}
                    x2={vtx.outHandle.x}
                    y2={vtx.outHandle.y}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <circle
                    cx={vtx.outHandle.x}
                    cy={vtx.outHandle.y}
                    r={4}
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </>
              )}

              {/* Anchor Vertex Dot */}
              <circle
                cx={vtx.point.x}
                cy={vtx.point.y}
                r={isFirst ? 6 : 5}
                fill={isFirst ? '#2563eb' : '#ffffff'}
                stroke={isFirst ? '#ffffff' : '#2563eb'}
                strokeWidth={2}
                className={`transition-transform hover:scale-125 ${
                  isFirst && vertices.length >= 2 ? 'cursor-pointer animate-pulse' : ''
                }`}
              />

              {/* Vertex Index Badge */}
              <text
                x={vtx.point.x + 8}
                y={vtx.point.y - 8}
                fontSize={10}
                fontFamily="sans-serif"
                fontWeight="bold"
                fill="#64748b"
              >
                P{idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
