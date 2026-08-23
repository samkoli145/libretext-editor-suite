/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: packages/features/canvas-designer/CanvasDesignerPlugin.tsx
 * 🎯 الهدف الرئيسي: إضافة محرر الكانفا والرسم الفيكتوري والواجهات
 * 📋 المعايير: دعم التفاعل التام بالماوس والثيم الفاتح النقي
 * 🏷️ المعرف: FEAT-CANVAS-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { EditorPlugin, EditorPluginProps, DocumentModel } from '../../core/types';
import { CanvasDesignerData, createDefaultCanvasData, CanvasElement } from './model';
import { useContextMenu } from '../../shared/hooks/useContextMenu';
import { SharedContextMenu } from '../../shared/components/SharedContextMenu';
import {
  resolveContextMenuForBlock,
  type TraitAwareBlockTarget,
  type TraitMenuCallbacks,
} from '@libretext/core';
import {
  Paintbrush,
  Plus,
  Trash2,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Square,
  Circle,
  Type,
  Layers,
  Sparkles,
} from 'lucide-react';

export function CanvasDesignerEditor({
  document,
  onChange,
}: EditorPluginProps<CanvasDesignerData>) {
  const data = document.data || createDefaultCanvasData();
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    data.elements[0]?.id || null,
  );
  const [zoom, setZoom] = useState<number>(data.viewport?.zoom || 1);

  // إدارة القائمة السياقية الموحدة
  const { state: contextMenuState, openContextMenu, closeMenu } = useContextMenu();

  const updateData = (newData: CanvasDesignerData) => {
    onChange({
      ...document,
      updatedAt: new Date().toISOString(),
      version: document.version + 1,
      data: newData,
    });
  };

  const handleAddElement = (type: CanvasElement['type']) => {
    const id = `el-${Date.now()}`;
    const newEl: CanvasElement = {
      id,
      type,
      x: 100 + data.elements.length * 20,
      y: 100 + data.elements.length * 20,
      width: type === 'circle' ? 120 : type === 'text' ? 200 : 250,
      height: type === 'circle' ? 120 : type === 'text' ? 50 : 140,
      zIndex: data.elements.length + 1,
      fillColor: type === 'circle' ? '#e0e7ff' : '#f8fafc',
      strokeColor: '#3b82f6',
      strokeWidth: 2,
      borderRadius: 12,
      text: type === 'text' ? 'نص جديد' : `${type.toUpperCase()} عنصر`,
    };

    updateData({
      ...data,
      elements: [...data.elements, newEl],
    });
    setSelectedElementId(id);
  };

  const handleDeleteElement = (id: string) => {
    updateData({
      ...data,
      elements: data.elements.filter((el) => el.id !== id),
    });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  /**
   * فتح القائمة السياقية الخاصة بعنصر الكانفا عند النقر بالزر الأيمن
   */
  const handleElementContextMenu = (e: React.MouseEvent, el: CanvasElement) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElementId(el.id);

    // قرار معماري: عناصر الكانفا تملك تموضعاً حراً مطلقاً (Absolute-positioned)
    // فتمنح السمات الأربع: draggable (للطبقات), resizable, styleable, lockable
    const target: TraitAwareBlockTarget = {
      id: el.id,
      type: el.type,
      traits: ['draggable', 'resizable', 'styleable', 'lockable'] as const,
      state: {
        lock: { locked: el.locked ?? false },
        position: { x: el.x, y: el.y },
        size: { width: el.width, height: el.height },
      },
    };

    const callbacks: TraitMenuCallbacks = {
      onLockToggle: (id, lock) => {
        updateData({
          ...data,
          elements: data.elements.map((item) =>
            item.id === id ? { ...item, locked: lock } : item,
          ),
        });
      },
      onBringToFront: (id) => {
        const targetEl = data.elements.find((item) => item.id === id);
        if (!targetEl) return;
        const others = data.elements.filter((item) => item.id !== id);
        updateData({
          ...data,
          elements: [...others, targetEl],
        });
      },
      onSendToBack: (id) => {
        const targetEl = data.elements.find((item) => item.id === id);
        if (!targetEl) return;
        const others = data.elements.filter((item) => item.id !== id);
        updateData({
          ...data,
          elements: [targetEl, ...others],
        });
      },
      onResetSize: (id) => {
        updateData({
          ...data,
          elements: data.elements.map((item) =>
            item.id === id ? { ...item, width: 200, height: 100 } : item,
          ),
        });
      },
      onResetStyle: (id) => {
        updateData({
          ...data,
          elements: data.elements.map((item) =>
            item.id === id
              ? { ...item, fillColor: '#ffffff', strokeColor: '#cbd5e1', strokeWidth: 1 }
              : item,
          ),
        });
      },
      onDuplicate: (id) => {
        const source = data.elements.find((item) => item.id === id);
        if (!source) return;
        const dup: CanvasElement = {
          ...source,
          id: `el-${Date.now()}`,
          x: source.x + 24,
          y: source.y + 24,
        };
        updateData({
          ...data,
          elements: [...data.elements, dup],
        });
        setSelectedElementId(dup.id);
      },
      onDelete: (id) => {
        handleDeleteElement(id);
      },
    };

    const menuItems = resolveContextMenuForBlock(target, callbacks);
    openContextMenu(e, menuItems, `عنصر ${el.type}`);
  };

  const selectedElement = data.elements.find((el) => el.id === selectedElementId);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-800 font-sans overflow-hidden dir-rtl select-none">
      {/* Top Toolbar */}
      <div className="h-10 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-700">
            <Paintbrush className="w-4 h-4 text-purple-600" />
            <span>محرر الكانفا والرسم البصري</span>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-2" />

          {/* Quick Add Shape Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAddElement('rectangle')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <Square className="w-3.5 h-3.5 text-blue-600" />
              <span>مستطيل</span>
            </button>
            <button
              onClick={() => handleAddElement('circle')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <Circle className="w-3.5 h-3.5 text-purple-600" />
              <span>دائرة</span>
            </button>
            <button
              onClick={() => handleAddElement('text')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-emerald-600" />
              <span>نص</span>
            </button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-1 text-slate-600 hover:text-slate-900"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] font-semibold text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-1 text-slate-600 hover:text-slate-900"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Elements Sidebar */}
        <div className="w-60 bg-white border-l border-slate-200 flex flex-col p-3 shrink-0 text-xs overflow-y-auto">
          <div className="font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>عناصر الكانفا ({data.elements.length})</span>
          </div>

          <div className="space-y-1 flex-1">
            {data.elements.map((el) => (
              <div
                key={el.id}
                onClick={() => setSelectedElementId(el.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  el.id === selectedElementId
                    ? 'bg-purple-50 text-purple-700 font-semibold border border-purple-200'
                    : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                }`}
              >
                <span className="truncate">{el.text || el.id}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteElement(el.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas Workspace */}
        <div className="flex-1 p-8 bg-slate-100/90 overflow-auto flex items-center justify-center relative">
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200/80 relative transition-transform duration-100"
            style={{
              width: `${data.canvasSettings?.width || 1280}px`,
              height: `${data.canvasSettings?.height || 720}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Render Canvas Elements */}
            {data.elements.map((el) => {
              const isSelected = el.id === selectedElementId;
              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  onContextMenu={(e) => handleElementContextMenu(e, el)}
                  className={`absolute flex flex-col items-center justify-center p-3 text-center transition-shadow cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-purple-600 shadow-md z-30'
                      : 'hover:ring-1 hover:ring-purple-300 z-10'
                  } ${el.locked ? 'opacity-75 cursor-not-allowed' : ''}`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    backgroundColor: el.fillColor || '#ffffff',
                    borderColor: el.strokeColor || '#cbd5e1',
                    borderWidth: `${el.strokeWidth || 1}px`,
                    borderRadius: `${el.borderRadius || 8}px`,
                  }}
                >
                  {el.text && (
                    <div className="text-sm font-semibold text-slate-800 leading-snug">
                      {el.text}
                    </div>
                  )}
                  {el.subtitle && <div className="text-xs text-slate-500 mt-1">{el.subtitle}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Element Properties Panel */}
        {selectedElement && (
          <div className="w-64 bg-white border-r border-slate-200 p-3 shrink-0 text-xs space-y-3">
            <div className="font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>خصائص العنصر</span>
              <span className="text-[10px] font-mono text-slate-400">{selectedElement.id}</span>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">العنوان / النص</label>
              <input
                type="text"
                value={selectedElement.text || ''}
                onChange={(e) => {
                  updateData({
                    ...data,
                    elements: data.elements.map((el) =>
                      el.id === selectedElement.id ? { ...el, text: e.target.value } : el,
                    ),
                  });
                }}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">لون التعبئة (Fill)</label>
              <input
                type="color"
                value={selectedElement.fillColor || '#ffffff'}
                onChange={(e) => {
                  updateData({
                    ...data,
                    elements: data.elements.map((el) =>
                      el.id === selectedElement.id ? { ...el, fillColor: e.target.value } : el,
                    ),
                  });
                }}
                className="w-full h-8 p-1 border border-slate-300 rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">لون الإطار (Stroke)</label>
              <input
                type="color"
                value={selectedElement.strokeColor || '#3b82f6'}
                onChange={(e) => {
                  updateData({
                    ...data,
                    elements: data.elements.map((el) =>
                      el.id === selectedElement.id ? { ...el, strokeColor: e.target.value } : el,
                    ),
                  });
                }}
                className="w-full h-8 p-1 border border-slate-300 rounded-md cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Shared Unified Context Menu */}
      <SharedContextMenu
        isOpen={contextMenuState.isOpen}
        x={contextMenuState.x}
        y={contextMenuState.y}
        items={contextMenuState.items}
        title={contextMenuState.title}
        onClose={closeMenu}
      />
    </div>
  );
}

export class CanvasDesignerPlugin implements EditorPlugin<CanvasDesignerData> {
  id = 'canvas-designer-plugin';
  name = 'لوحة تصميم ورسم وكانفا';
  documentType = 'canvas';
  iconName = 'Paintbrush';
  fileExtensions = ['canvas.json', 'json', 'svg'] as const;
  description = 'محرر الكانفا والرسم الفيكتوري وتصميم الواجهات الشامل';

  renderEditor(props: EditorPluginProps<CanvasDesignerData>) {
    return <CanvasDesignerEditor {...props} />;
  }

  createDefaultDocument(title = 'لوحة كانفا جديدة'): DocumentModel<CanvasDesignerData> {
    return {
      id: `doc-${Date.now()}`,
      type: 'canvas',
      title,
      fileExtension: 'canvas.json',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      data: createDefaultCanvasData(title),
    };
  }

  serialize(doc: DocumentModel<CanvasDesignerData>): string {
    return JSON.stringify(doc, null, 2);
  }

  deserialize(raw: string): DocumentModel<CanvasDesignerData> {
    try {
      return JSON.parse(raw);
    } catch {
      return this.createDefaultDocument();
    }
  }
}
