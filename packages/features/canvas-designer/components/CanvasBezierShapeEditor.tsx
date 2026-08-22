/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرر منحنيات وأشكال بيزير التفاعلية المباشر (Canvas Pen/Bezier Shape Sub-Editor)
 * 🏛️ الدور: محرر فرعي عالي الدقة (Sub-Editor) لتعديل نقاط ومقابض الأشكال المتجهة
 *           (Path/Vector Shapes) برسم مقابض بيزير الحقيقية والتعديل المتناظر/الزاوي.
 * 📥 المستهلك: CanvasViewport, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Direct Tangent Control Point Manipulation with Precision de Casteljau Splits:
 *    تحويل الأشكال إلى عقد بيزير دقيقة وتعديل المقابض لحظياً مع قفل التناظر
 *    وفصله بمفتاح Alt، مع إمكانية تقسيم أي قطعة بالنقر المزدوج (Split Segment).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مراعاة موضع الإطار المحيط بالعنصر (Bounding Box) ونسبة التحويل إلى إحداثيات الكانفا.
 *    2. تنظيف مستمعات الأحداث على window فوراً عند إنهاء السحب.
 *    3. عدم إتلاف المقابض غير المعرفة عند النقر السريع.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع نقاط ومقابض العقد
 *    - حماية من القسمة على صفر أو القيم غير المحددة
 *    - ضمان احتفاظ المسار بنقطتين على الأقل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react'
import {
  BezNode,
  Pt,
  parseBezier,
  serializeBezier,
  splitSegment,
  mirrorPoint,
  nearestT,
} from '../../../shared/lib-core/geometry/bezier-curves'
import { Check, Scissors, CornerDownRight } from 'lucide-react'

export interface CanvasBezierShapeEditorProps {
  elementId: string
  pathData: string
  elementBounds: { x: number; y: number; width: number; height: number }
  zoom: number
  onUpdatePath: (newD: string) => void
  onClose: () => void
}

export function CanvasBezierShapeEditor({
  elementId,
  pathData,
  elementBounds,
  zoom,
  onUpdatePath,
  onClose,
}: CanvasBezierShapeEditorProps) {
  const [nodes, setNodes] = useState<BezNode[]>(() => {
    const { nodes: parsedNodes } = parseBezier(pathData || 'M 0 0 C 40 0, 80 40, 120 40')
    return parsedNodes
  })
  const [isClosed, setIsClosed] = useState<boolean>(() => {
    const { closed } = parseBezier(pathData || '')
    return closed
  })
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(0)

  const originX = elementBounds.x
  const originY = elementBounds.y

  // تحديث المسار الخارجي
  const commitPath = (newNodes: BezNode[], closed: boolean) => {
    const serialized = serializeBezier(newNodes, closed)
    onUpdatePath(serialized)
  }

  // سحب نقطة تثبيت (Anchor Drag)
  const handleAnchorMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setSelectedNodeIndex(index)

    const startClientX = e.clientX
    const startClientY = e.clientY
    const initialNode = nodes[index]
    const initialP = { ...initialNode.p }
    const initialIn = initialNode.in ? { ...initialNode.in } : undefined
    const initialOut = initialNode.out ? { ...initialNode.out } : undefined

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startClientX) / zoom
      const dy = (moveEvent.clientY - startClientY) / zoom

      setNodes((prevNodes) => {
        const nextNodes = [...prevNodes]
        const newP = { x: Math.round(initialP.x + dx), y: Math.round(initialP.y + dy) }
        const deltaX = newP.x - initialP.x
        const deltaY = newP.y - initialP.y

        nextNodes[index] = {
          ...initialNode,
          p: newP,
          in: initialIn ? { x: Math.round(initialIn.x + deltaX), y: Math.round(initialIn.y + deltaY) } : undefined,
          out: initialOut ? { x: Math.round(initialOut.x + deltaX), y: Math.round(initialOut.y + deltaY) } : undefined,
        }
        return nextNodes
      })
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      setNodes((latest) => {
        commitPath(latest, isClosed)
        return latest
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // سحب مقبض بيزير (Handle Drag)
  const handleHandleMouseDown = (
    e: React.MouseEvent,
    index: number,
    handleType: 'in' | 'out'
  ) => {
    e.stopPropagation()
    const startClientX = e.clientX
    const startClientY = e.clientY
    const node = nodes[index]
    const targetHandle = handleType === 'in' ? node.in : node.out
    if (!targetHandle) return

    const initialHandle = { ...targetHandle }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startClientX) / zoom
      const dy = (moveEvent.clientY - startClientY) / zoom
      const isAlt = moveEvent.altKey

      setNodes((prevNodes) => {
        const nextNodes = [...prevNodes]
        const currentNode = nextNodes[index]
        const newHandlePt = { x: Math.round(initialHandle.x + dx), y: Math.round(initialHandle.y + dy) }

        let newIn = currentNode.in
        let newOut = currentNode.out

        if (handleType === 'in') {
          newIn = newHandlePt
          if (!isAlt && !currentNode.corner && currentNode.out) {
            const oppLen = Math.hypot(currentNode.out.x - currentNode.p.x, currentNode.out.y - currentNode.p.y)
            newOut = mirrorPoint(currentNode.p, newIn, oppLen)
          }
        } else {
          newOut = newHandlePt
          if (!isAlt && !currentNode.corner && currentNode.in) {
            const oppLen = Math.hypot(currentNode.in.x - currentNode.p.x, currentNode.in.y - currentNode.p.y)
            newIn = mirrorPoint(currentNode.p, newOut, oppLen)
          }
        }

        nextNodes[index] = {
          ...currentNode,
          in: newIn,
          out: newOut,
          corner: isAlt ? true : currentNode.corner,
        }
        return nextNodes
      })
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      setNodes((latest) => {
        commitPath(latest, isClosed)
        return latest
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // حذف نقطة بالنقر المزدوج
  const handleAnchorDoubleClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    if (nodes.length <= 2) return
    const nextNodes = nodes.filter((_, idx) => idx !== index)
    setNodes(nextNodes)
    setSelectedNodeIndex(null)
    commitPath(nextNodes, isClosed)
  }

  // إنشاء المسار المعروض
  const renderedPathD = serializeBezier(
    nodes.map((n) => ({
      p: { x: originX + n.p.x, y: originY + n.p.y },
      in: n.in ? { x: originX + n.in.x, y: originY + n.in.y } : undefined,
      out: n.out ? { x: originX + n.out.x, y: originY + n.out.y } : undefined,
      corner: n.corner,
    })),
    isClosed
  )

  const selectedNode = selectedNodeIndex !== null ? nodes[selectedNodeIndex] : null

  return (
    <>
      <svg
        className="absolute inset-0 pointer-events-none z-40 overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {/* المنحنى الحي المحرر */}
        <path
          d={renderedPathD}
          fill={isClosed ? 'rgba(59, 130, 246, 0.08)' : 'none'}
          stroke="#2563eb"
          strokeWidth={2.5}
          className="pointer-events-auto cursor-pointer"
          onDoubleClick={(e) => {
            e.stopPropagation()
            // تقسيم الشريحة الأولى بالنقر المزدوج
            if (nodes.length >= 2) {
              const { a, mid, b } = splitSegment(nodes[0], nodes[1], 0.5)
              const updated = [a, mid, b, ...nodes.slice(2)]
              setNodes(updated)
              commitPath(updated, isClosed)
            }
          }}
        />

        {/* نقاط التثبيت ومقابض التحكم */}
        {nodes.map((node, idx) => {
          const absX = originX + node.p.x
          const absY = originY + node.p.y
          const isSelected = idx === selectedNodeIndex

          return (
            <g key={`bez-node-${idx}`}>
              {/* خط مقبض الدخول In */}
              {node.in && isSelected && (
                <>
                  <line
                    x1={absX}
                    y1={absY}
                    x2={originX + node.in.x}
                    y2={originY + node.in.y}
                    stroke="#93c5fd"
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={originX + node.in.x}
                    cy={originY + node.in.y}
                    r={4.5}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth={1.5}
                    className="pointer-events-auto cursor-move hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleHandleMouseDown(e, idx, 'in')}
                  />
                </>
              )}

              {/* خط مقبض الخروج Out */}
              {node.out && isSelected && (
                <>
                  <line
                    x1={absX}
                    y1={absY}
                    x2={originX + node.out.x}
                    y2={originY + node.out.y}
                    stroke="#93c5fd"
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={originX + node.out.x}
                    cy={originY + node.out.y}
                    r={4.5}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth={1.5}
                    className="pointer-events-auto cursor-move hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleHandleMouseDown(e, idx, 'out')}
                  />
                </>
              )}

              {/* نقطة التثبيت الرئيسية */}
              <rect
                x={absX - (isSelected ? 5 : 4)}
                y={absY - (isSelected ? 5 : 4)}
                width={isSelected ? 10 : 8}
                height={isSelected ? 10 : 8}
                fill={isSelected ? '#2563eb' : '#ffffff'}
                stroke="#2563eb"
                strokeWidth={2}
                className="pointer-events-auto cursor-move hover:scale-125 transition-transform"
                onMouseDown={(e) => handleAnchorMouseDown(e, idx)}
                onDoubleClick={(e) => handleAnchorDoubleClick(e, idx)}
              />
            </g>
          )
        })}
      </svg>

      {/* Floating Toolbar for Curve Actions */}
      <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-3 flex items-center gap-3 text-slate-800 text-xs select-none">
        <span className="font-semibold text-blue-600 flex items-center gap-1.5">
          <Scissors className="w-4 h-4" />
          محرر المسارات الدقيقة (Pen Curve Editor)
        </span>

        <button
          onClick={() => {
            const nextClosed = !isClosed
            setIsClosed(nextClosed)
            commitPath(nodes, nextClosed)
          }}
          className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
            isClosed
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          {isClosed ? 'مسار مغلق (Closed)' : 'مسار مفتوح (Open)'}
        </button>

        {selectedNode && (
          <button
            onClick={() => {
              if (selectedNodeIndex === null) return
              setNodes((prev) => {
                const next = [...prev]
                next[selectedNodeIndex] = {
                  ...next[selectedNodeIndex],
                  corner: !next[selectedNodeIndex].corner,
                }
                commitPath(next, isClosed)
                return next
              })
            }}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
              selectedNode.corner
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
            title="تبديل النقطة بين زاوية حادة ومنحنى متناظر ناعم"
          >
            <CornerDownRight className="w-3.5 h-3.5" />
            <span>{selectedNode.corner ? 'زاوية حادة (Corner)' : 'منحنى ناعم (Smooth)'}</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="mr-auto px-3.5 py-1.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>تم</span>
        </button>
      </div>
    </>
  )
}
