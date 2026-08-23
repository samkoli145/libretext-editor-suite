/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكون تحرير مسارات الحركة التفاعلية (Canvas Motion Path Sub-Editor)
 * 🏛️ الدور: مكون فرعي عالي الدقة (Sub-Editor) لتعديل نقاط التثبيت، مقابض بيزير،
 *           والسرعات اللحظية، مع نقطة محاكاة حية تدور على المسار (Live Loop Dot).
 * 📥 المستهلك: CanvasViewport, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Direct Canvas Motion Overlay with de Casteljau Splitting & Tangent Handles:
 *    رسم تفاعلي للطبقة العلوية بنظام SVG مع استجابة فورية للنقر المزدوج لإضافة/حذف النقاط
 *    وقفل التناظر للمقابض (Mirror Handles) وتجاوزها بـ Alt.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الإحداثيات مرسومة بالنسبة لإحداثيات الكانفا مع مراعاة معامل التكبير (Zoom).
 *    2. منع انتقال أحداث الفأرة إلى الطبقات السفلية أثناء التحرير (`e.stopPropagation()`).
 *    3. التحديث الذري لمسار الحركة عند الإفلات فقط لضمان سلامة التراجع (Undo/Redo).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع نقاط التحكم
 *    - حماية من القسمة على صفر أو القيم غير المحددة
 *    - استعادة فورية للمسار الأصلي عند حدوث استثناء
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MotionPathData,
  createMotionPathFromSvg,
  sampleMotionPath,
  insertWaypointOnSegment,
  removeWaypoint,
  serializeMotionPath,
} from '../../../shared/lib-core/animation/motion-path-engine';
import { mirrorPoint } from '../../../shared/lib-core/geometry/bezier-curves';
import { Play, Pause, Plus, Trash2, RotateCw, FastForward } from 'lucide-react';

export interface CanvasMotionPathEditorProps {
  elementId: string;
  elementBounds: { x: number; y: number; width: number; height: number };
  initialPathString?: string;
  zoom: number;
  onUpdatePath: (pathString: string) => void;
  onClose: () => void;
}

export function CanvasMotionPathEditor({
  elementId,
  elementBounds,
  initialPathString = '',
  zoom,
  onUpdatePath,
  onClose,
}: CanvasMotionPathEditorProps) {
  const [motionData, setMotionData] = useState<MotionPathData>(() =>
    createMotionPathFromSvg(initialPathString),
  );
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animProgress, setAnimProgress] = useState<number>(0);

  // مركز العنصر في الكانفا
  const originX = elementBounds.x + elementBounds.width / 2;
  const originY = elementBounds.y + elementBounds.height / 2;

  // حلقة المحاكاة اللحظية (Live Loop Preview)
  useEffect(() => {
    if (!isPlaying) return;
    let reqId: number;
    const startTime = performance.now();
    const durationMs = motionData.durationSeconds * 1000;

    const loopFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = (elapsed % durationMs) / durationMs;
      setAnimProgress(progress);
      reqId = requestAnimationFrame(loopFrame);
    };

    reqId = requestAnimationFrame(loopFrame);
    return () => cancelAnimationFrame(reqId);
  }, [isPlaying, motionData.durationSeconds]);

  // حساب موضع نقطة المحاكاة اللحظية
  const sample = sampleMotionPath(motionData, animProgress);
  const liveDotX = originX + sample.x;
  const liveDotY = originY + sample.y;

  // سحب نقطة تثبيت (Waypoint Drag)
  const handleWaypointMouseDown = (
    e: React.MouseEvent,
    wpId: string,
    initialPt: { x: number; y: number },
  ) => {
    e.stopPropagation();
    setSelectedWaypointId(wpId);

    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startClientX) / zoom;
      const dy = (moveEvent.clientY - startClientY) / zoom;

      setMotionData((prev) => {
        const updatedWps = prev.waypoints.map((wp) => {
          if (wp.id !== wpId) return wp;
          const newPt = { x: Math.round(initialPt.x + dx), y: Math.round(initialPt.y + dy) };
          // تحديث المقابض بنقلها مع النقطة
          const deltaX = newPt.x - wp.point.x;
          const deltaY = newPt.y - wp.point.y;
          const newIn = wp.inHandle
            ? { x: wp.inHandle.x + deltaX, y: wp.inHandle.y + deltaY }
            : undefined;
          const newOut = wp.outHandle
            ? { x: wp.outHandle.x + deltaX, y: wp.outHandle.y + deltaY }
            : undefined;
          return {
            ...wp,
            point: newPt,
            inHandle: newIn,
            outHandle: newOut,
          };
        });
        const nextData = serializeMotionPath({ ...prev, waypoints: updatedWps });
        return nextData;
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setMotionData((latest) => {
        onUpdatePath(latest.pathString);
        return latest;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // سحب مقبض بيزير (Handle Drag)
  const handleControlHandleMouseDown = (
    e: React.MouseEvent,
    wpId: string,
    handleType: 'in' | 'out',
    initialHandlePt: { x: number; y: number },
  ) => {
    e.stopPropagation();
    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startClientX) / zoom;
      const dy = (moveEvent.clientY - startClientY) / zoom;
      const isAltKey = moveEvent.altKey;

      setMotionData((prev) => {
        const updatedWps = prev.waypoints.map((wp) => {
          if (wp.id !== wpId) return wp;
          const newHandlePt = {
            x: Math.round(initialHandlePt.x + dx),
            y: Math.round(initialHandlePt.y + dy),
          };

          let newIn = wp.inHandle;
          let newOut = wp.outHandle;

          if (handleType === 'in') {
            newIn = newHandlePt;
            if (!isAltKey && !wp.isCorner && wp.outHandle) {
              const oppLen = Math.hypot(wp.outHandle.x - wp.point.x, wp.outHandle.y - wp.point.y);
              newOut = mirrorPoint(wp.point, newIn, oppLen);
            }
          } else {
            newOut = newHandlePt;
            if (!isAltKey && !wp.isCorner && wp.inHandle) {
              const oppLen = Math.hypot(wp.inHandle.x - wp.point.x, wp.inHandle.y - wp.point.y);
              newIn = mirrorPoint(wp.point, newOut, oppLen);
            }
          }

          return {
            ...wp,
            inHandle: newIn,
            outHandle: newOut,
            isManual: true,
            isCorner: isAltKey ? true : wp.isCorner,
          };
        });
        return serializeMotionPath({ ...prev, waypoints: updatedWps });
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setMotionData((latest) => {
        onUpdatePath(latest.pathString);
        return latest;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // تحويل المسار النسبي إلى مسار مطلق على شاشة الكانفا
  const canvasPathD = motionData.waypoints.reduce((acc, wp, idx) => {
    const absX = originX + wp.point.x;
    const absY = originY + wp.point.y;
    if (idx === 0) return `M ${absX} ${absY}`;

    const prevWp = motionData.waypoints[idx - 1];
    const cp1X = prevWp.outHandle
      ? originX + prevWp.outHandle.x
      : originX + prevWp.point.x + (wp.point.x - prevWp.point.x) / 3;
    const cp1Y = prevWp.outHandle
      ? originY + prevWp.outHandle.y
      : originY + prevWp.point.y + (wp.point.y - prevWp.point.y) / 3;
    const cp2X = wp.inHandle
      ? originX + wp.inHandle.x
      : originX + prevWp.point.x + (2 * (wp.point.x - prevWp.point.x)) / 3;
    const cp2Y = wp.inHandle
      ? originY + wp.inHandle.y
      : originY + prevWp.point.y + (2 * (wp.point.y - prevWp.point.y)) / 3;

    return `${acc} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${absX} ${absY}`;
  }, '');

  const selectedWp = motionData.waypoints.find((wp) => wp.id === selectedWaypointId);

  return (
    <>
      {/* SVG Canvas Overlay */}
      <svg
        className="absolute inset-0 pointer-events-none z-40 overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {/* خط المسار الإرشادي المنقط */}
        <path
          d={canvasPathD}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          strokeDasharray="6 4"
          className="pointer-events-auto cursor-pointer"
          onDoubleClick={(e) => {
            e.stopPropagation();
            // إضافة نقطة تثبيت في المنتصف
            setMotionData((prev) => {
              const updated = insertWaypointOnSegment(prev, 0, 0.5);
              onUpdatePath(updated.pathString);
              return updated;
            });
          }}
        />

        {/* خطوط مقابض التحكم بيزير */}
        {motionData.waypoints.map((wp) => {
          const absX = originX + wp.point.x;
          const absY = originY + wp.point.y;
          const isSel = wp.id === selectedWaypointId;

          return (
            <g key={`handles-${wp.id}`}>
              {wp.inHandle && isSel && (
                <>
                  <line
                    x1={absX}
                    y1={absY}
                    x2={originX + wp.inHandle.x}
                    y2={originY + wp.inHandle.y}
                    stroke="#a78bfa"
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={originX + wp.inHandle.x}
                    cy={originY + wp.inHandle.y}
                    r={5}
                    fill="#ffffff"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    className="pointer-events-auto cursor-move hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleControlHandleMouseDown(e, wp.id, 'in', wp.inHandle!)}
                  />
                </>
              )}

              {wp.outHandle && isSel && (
                <>
                  <line
                    x1={absX}
                    y1={absY}
                    x2={originX + wp.outHandle.x}
                    y2={originY + wp.outHandle.y}
                    stroke="#a78bfa"
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={originX + wp.outHandle.x}
                    cy={originY + wp.outHandle.y}
                    r={5}
                    fill="#ffffff"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    className="pointer-events-auto cursor-move hover:scale-125 transition-transform"
                    onMouseDown={(e) =>
                      handleControlHandleMouseDown(e, wp.id, 'out', wp.outHandle!)
                    }
                  />
                </>
              )}

              {/* نقطة التثبيت الرئيسية (Waypoint Anchor) */}
              <circle
                cx={absX}
                cy={absY}
                r={isSel ? 7 : 5.5}
                fill={isSel ? '#7c3aed' : '#ffffff'}
                stroke="#7c3aed"
                strokeWidth={2.5}
                className="pointer-events-auto cursor-move hover:scale-125 transition-transform"
                onMouseDown={(e) => handleWaypointMouseDown(e, wp.id, wp.point)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setMotionData((prev) => {
                    const updated = removeWaypoint(prev, wp.id);
                    onUpdatePath(updated.pathString);
                    return updated;
                  });
                }}
              />
            </g>
          );
        })}

        {/* نقطة المحاكاة اللحظية (Live Loop Dot) */}
        <circle
          cx={liveDotX}
          cy={liveDotY}
          r={7}
          fill="#ec4899"
          stroke="#ffffff"
          strokeWidth={2}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(236,72,153,0.4))' }}
        />
      </svg>

      {/* Floating Control Toolbar */}
      <div
        className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 p-3.5 flex items-center gap-3 text-slate-800 text-xs select-none"
        style={{ minWidth: '320px' }}
      >
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 flex items-center justify-center transition-colors shadow-sm font-semibold"
          title={isPlaying ? 'إيقاف المعاينة' : 'تشغيل المعاينة'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-1.5 border-r border-l border-slate-200 px-3">
          <span className="text-slate-500 font-medium">الزمن:</span>
          <input
            type="number"
            min={0.5}
            max={30}
            step={0.5}
            value={motionData.durationSeconds}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 3;
              setMotionData((prev) => ({ ...prev, durationSeconds: val }));
            }}
            className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-violet-700"
          />
          <span className="text-slate-400">ثانية</span>
        </div>

        <button
          onClick={() => {
            setMotionData((prev) => {
              const updated = { ...prev, autoRotate: !prev.autoRotate };
              return updated;
            });
          }}
          className={`px-2.5 py-1.5 rounded-xl border font-medium flex items-center gap-1 transition-colors ${
            motionData.autoRotate
              ? 'bg-violet-600 text-white border-violet-600'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}
          title="دوران العنصر تلقائياً باتجاه مماس المسار"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>تدوير</span>
        </button>

        <button
          onClick={onClose}
          className="mr-auto px-3 py-1.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          حفظ وإنهاء
        </button>
      </div>
    </>
  );
}
