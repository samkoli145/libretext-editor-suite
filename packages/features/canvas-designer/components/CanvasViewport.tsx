/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مسرح عرض الكانفا والمساطر التفاعلية - Canvas Viewport & Stage
 * 🏛️ الدور: مكون رئيسي - المساطر ومساحة الإسقاط والتصيير والتحكم
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Full Canvas Stage: مسرح كامل مع مساطر تفاعلية ومنطقة إسقاط
 *    وتصيير عناصر ومحلل منحنيات بيزييه ومقابض تحجيم
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المساطر يجب أن تتناسب مع التكبير
 *    2. منطقة الإسقاط يجب أن تقبل الإفلات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة إحداثيات الإسقاط
 *    - fallback لحجم افتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import type { CanvasElement, CanvasElementType } from '../model';
import { CanvasRulers } from './CanvasRulers';
import { InteractiveGuidesOverlay } from './InteractiveGuidesOverlay';
import { BezierPenToolOverlay } from './BezierPenToolOverlay';
import { ElementRenderer } from './ElementRenderer';
import { VertexPathEditorOverlay } from '../../../shared/vector-engine';
import { TransformHandles } from './TransformHandles';
import {
  AlignmentGuidesOverlay,
  type ReferenceLine,
  type DistanceBadge,
} from '../../../shared/vector-engine';
import type { GuideLine } from '../core';
import { CanvasCollaboratorsOverlay } from './CanvasCollaboratorsOverlay';
import type {
  PeerAwarenessEngine,
  RemotePeer,
} from '../../../shared/lib-core/collaboration/peer-awareness-engine';

export interface CanvasViewportProps {
  viewportContainerRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  viewportScroll: { left: number; top: number };
  setViewportScroll: React.Dispatch<React.SetStateAction<{ left: number; top: number }>>;
  stageWidth: number;
  stageHeight?: number;
  backgroundColor?: string;
  activeTool: CanvasElementType | 'select' | 'hand' | 'bezier-pen';
  setActiveTool: (tool: CanvasElementType | 'select' | 'hand' | 'bezier-pen') => void;
  isSpacePressed: boolean;
  isPanning: boolean;
  isCanvasDragging: boolean;
  canvasDropZoneProps: Record<string, any>;
  elements: CanvasElement[];
  selectedElementId: string | null;
  editingVertexElementId: string | null;
  setEditingVertexElementId: (id: string | null) => void;
  smartGuides: ReferenceLine[];
  smartBadges: DistanceBadge[];
  activeGuides: GuideLine[];
  setActiveGuides: React.Dispatch<React.SetStateAction<GuideLine[]>>;
  peerAwarenessEngine?: PeerAwarenessEngine;
  onJumpToPeer?: (peer: RemotePeer) => void;
  marqueeBox?: { x: number; y: number; width: number; height: number } | null;
  activeDragFeedback?: {
    isAxisLocked?: boolean;
    lockedAxis?: 'horizontal' | 'vertical' | null;
    isCloneActive?: boolean;
  } | null;
  onViewportMouseDown: (e: React.MouseEvent) => void;
  onStageMouseDown: (e: React.MouseEvent) => void;
  onElementMouseDown: (e: React.MouseEvent, el: CanvasElement) => void;
  onResizeMouseDown: (e: React.MouseEvent, handleDirection: string) => void;
  onRotateMouseDown: (e: React.MouseEvent) => void;
  onSelectBlock: (id: string | null) => void;
  onHoverBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: Partial<CanvasElement>) => void;
  onAddBlock: (block: Partial<CanvasElement>) => void;
  onTriggerContextMenu: (e: React.MouseEvent, blockId: string | null) => void;
}

export function CanvasViewport({
  viewportContainerRef,
  stageRef,
  zoom,
  setZoom,
  viewportScroll,
  setViewportScroll,
  stageWidth,
  stageHeight = 800,
  backgroundColor = '#ffffff',
  activeTool,
  setActiveTool,
  isSpacePressed,
  isPanning,
  isCanvasDragging,
  canvasDropZoneProps,
  elements,
  selectedElementId,
  editingVertexElementId,
  setEditingVertexElementId,
  smartGuides,
  smartBadges,
  activeGuides,
  setActiveGuides,
  peerAwarenessEngine,
  onJumpToPeer,
  marqueeBox,
  activeDragFeedback,
  onViewportMouseDown,
  onStageMouseDown,
  onElementMouseDown,
  onResizeMouseDown,
  onRotateMouseDown,
  onSelectBlock,
  onHoverBlock,
  onUpdateBlock,
  onAddBlock,
  onTriggerContextMenu,
}: CanvasViewportProps) {
  return (
    <CanvasRulers
      zoom={zoom}
      scrollLeft={viewportScroll.left}
      scrollTop={viewportScroll.top}
      artboardWidth={stageWidth}
      artboardHeight={stageHeight}
      showGrid={true}
      onToggleGrid={() => {}}
      onAddGuide={(orientation, position) => {
        setActiveGuides((prev) => [
          ...prev,
          {
            id: `guide-${Date.now()}`,
            type: orientation,
            position: Math.round(position),
            start: 0,
            end: 2000,
            targetElementIds: [],
          },
        ]);
      }}
    >
      <main
        id="canvas-viewport"
        ref={viewportContainerRef}
        {...canvasDropZoneProps}
        onScroll={(e) => {
          const target = e.currentTarget;
          setViewportScroll({ left: target.scrollLeft, top: target.scrollTop });
        }}
        onMouseDown={onViewportMouseDown}
        className={`w-full h-full bg-slate-100 overflow-auto relative p-8 flex items-start justify-center transition-colors ${
          activeTool === 'hand' || isSpacePressed
            ? isPanning
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default'
        } ${isCanvasDragging ? 'ring-4 ring-blue-400 ring-inset bg-blue-50/40' : ''}`}
        onContextMenu={(e) => {
          onTriggerContextMenu(e, null);
        }}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
              setZoom((z) => Math.min(2.0, Math.round((z + 0.05) * 100) / 100));
            } else {
              setZoom((z) => Math.max(0.3, Math.round((z - 0.05) * 100) / 100));
            }
          }
        }}
        onClick={() => {
          if (activeTool === 'select') {
            onSelectBlock(null);
          }
        }}
      >
        <div
          id="canvas-stage"
          ref={stageRef}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 relative transition-transform overflow-hidden"
          style={{
            width: stageWidth,
            minHeight: stageHeight,
            backgroundColor,
            transform: `scale(${zoom})`,
            transformOrigin: 'center top',
          }}
          onMouseDown={onStageMouseDown}
        >
          {/* Mechanical Event & Codeless Interaction Guides Overlay */}
          <InteractiveGuidesOverlay
            elements={elements}
            selectedElementId={selectedElementId}
            zoom={zoom}
          />

          {/* Active Bézier Pen Tool Drawing Overlay */}
          {activeTool === 'bezier-pen' && (
            <BezierPenToolOverlay
              stageWidth={stageWidth}
              stageHeight={stageHeight}
              zoom={zoom}
              strokeColor="#2563eb"
              fillColor="transparent"
              strokeWidth={2}
              onCommitPath={({ pathD, points, bbox, fill, stroke, strokeWidth }) => {
                onAddBlock({
                  type: 'path' as any,
                  x: bbox.x,
                  y: bbox.y,
                  width: bbox.width,
                  height: bbox.height,
                  pathData: pathD,
                  points,
                  fillColor: fill,
                  strokeColor: stroke,
                  strokeWidth,
                });
                setActiveTool('select');
              }}
              onCancel={() => setActiveTool('select')}
            />
          )}

          {/* Render Elements */}
          {elements.map((el) => {
            const isSelected = selectedElementId === el.id;

            return (
              <div
                key={el.id}
                id={`canvas-el-${el.id}`}
                data-element-id={el.id}
                data-block-type={el.type || 'canvas-element'}
                data-context-z-index={el.zIndex}
                onMouseDown={(e) => onElementMouseDown(e, el)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (
                    [
                      'path',
                      'freehand',
                      'polygon',
                      'star',
                      'triangle',
                      'diamond',
                      'hexagon',
                      'rectangle',
                      'circle',
                    ].includes(el.type) ||
                    Boolean(el.pathData) ||
                    Boolean(el.points)
                  ) {
                    setEditingVertexElementId(el.id);
                  }
                }}
                onMouseEnter={() => onHoverBlock(el.id)}
                onMouseLeave={() => onHoverBlock(null)}
                className="absolute cursor-move"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  zIndex: el.zIndex,
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                  transformOrigin: 'center center',
                }}
              >
                <ElementRenderer
                  element={el}
                  isSelected={isSelected}
                  onSelect={() => onSelectBlock(el.id)}
                  onUpdateContent={(newText) => onUpdateBlock(el.id, { text: newText })}
                />

                {/* Interactive Direct Vertex & Bezier Path Editor Overlay */}
                {editingVertexElementId === el.id ? (
                  <VertexPathEditorOverlay
                    element={el}
                    zoom={zoom}
                    onUpdatePath={(newD, newPts) => {
                      onUpdateBlock(el.id, { pathData: newD, points: newPts });
                    }}
                    onClose={() => setEditingVertexElementId(null)}
                  />
                ) : (
                  /* 8-Handle Resize Overlay */
                  isSelected && (
                    <TransformHandles
                      element={el}
                      scale={zoom}
                      onResizeStart={(handle, e) => onResizeMouseDown(e, handle)}
                      onRotateStart={onRotateMouseDown}
                    />
                  )
                )}
              </div>
            );
          })}

          {/* Comprehensive Smart Alignment Guides & Distance Badges Overlay */}
          <AlignmentGuidesOverlay guides={smartGuides} distanceBadges={smartBadges} zoom={zoom} />

          {/* Smart Alignment Guides Overlay (Light Blue) */}
          {activeGuides.map((g) => {
            if (g.type === 'vertical') {
              return (
                <div
                  key={g.id}
                  className="absolute pointer-events-none bg-blue-500 z-50 transition-opacity"
                  style={{
                    left: g.position,
                    top: Math.max(0, g.start),
                    width: 1,
                    height: Math.max(20, g.end - g.start),
                    boxShadow: '0 0 4px rgba(59, 130, 246, 0.4)',
                  }}
                />
              );
            } else {
              return (
                <div
                  key={g.id}
                  className="absolute pointer-events-none bg-blue-500 z-50 transition-opacity"
                  style={{
                    left: Math.max(0, g.start),
                    top: g.position,
                    width: Math.max(20, g.end - g.start),
                    height: 1,
                    boxShadow: '0 0 4px rgba(59, 130, 246, 0.4)',
                  }}
                />
              );
            }
          })}
          {/* Live Peer Collaborators Cursors and Badges Overlay */}
          {peerAwarenessEngine && (
            <CanvasCollaboratorsOverlay
              engine={peerAwarenessEngine}
              zoom={zoom}
              panX={viewportScroll.left}
              panY={viewportScroll.top}
              onJumpToPeer={onJumpToPeer}
            />
          )}
          {/* Rubberband Marquee Selection Box */}
          {marqueeBox && (
            <div
              className="absolute pointer-events-none z-40 border border-blue-500 bg-blue-500/10 rounded-sm"
              style={{
                left: marqueeBox.x,
                top: marqueeBox.y,
                width: marqueeBox.width,
                height: marqueeBox.height,
                boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.25)',
              }}
            />
          )}

          {/* Live Drag Interaction Feedback Badge (Shift Axis Lock / Alt-Ctrl Clone) */}
          {activeDragFeedback &&
            (activeDragFeedback.isAxisLocked || activeDragFeedback.isCloneActive) && (
              <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-white/95 text-slate-800 text-xs font-semibold rounded-full shadow-lg border border-slate-200 flex items-center gap-2 pointer-events-none transition-all">
                {activeDragFeedback.isCloneActive && (
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="font-bold">+</span> سحب مع النسخ (Alt/Ctrl)
                  </span>
                )}
                {activeDragFeedback.isAxisLocked && (
                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    🔒 قفل المحور (
                    {activeDragFeedback.lockedAxis === 'horizontal' ? 'أفقي ↔' : 'عمودي ↕'})
                  </span>
                )}
              </div>
            )}
        </div>
      </main>
    </CanvasRulers>
  );
}
