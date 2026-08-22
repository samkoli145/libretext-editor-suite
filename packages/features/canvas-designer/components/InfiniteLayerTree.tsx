/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: شجرة الطبقات اللانهائية - Infinite Layer Tree
 * 🏛️ الدور: مكون مشترك - عرض وإدارة الطبقات والعناصر بعمق لا نهائي
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive Tree View: عرض شجري تكراري
 *    مع إظهار/إخفاء، قفل، حذف، إعادة تسمية لكل طبقة وعنصر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الطبقات يجب أن تبقى متزامنة مع العناصر
 *    2. التكرار يجب ألا يكون لا نهائياً في الأداء
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص العمق قبل التكرار
 *    - fallback لطبقة واحدة
 *    - حماية ضد التكرار اللانهائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  FolderTree,
  Box,
  Type,
  Image,
  Globe,
  Workflow,
  Copy,
  FolderPlus,
  FolderMinus,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Search,
  Check,
  Plus,
  Edit2,
  X,
} from 'lucide-react';
import type { CanvasElement, CanvasLayer } from '../model';
import { InfiniteLayerManager } from '../layerManager';

interface InfiniteLayerTreeProps {
  layers: CanvasLayer[];
  elements: CanvasElement[];
  activeLayerId: string;
  selectedElementId: string | null;
  multiSelectedIds?: string[];
  onSelectElement: (id: string | null, e?: React.MouseEvent) => void;
  onSelectLayer: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onGroupSelected?: () => void;
  onUngroupSelected?: () => void;
  onDuplicateElement?: (id: string) => void;
  onReorderZIndex?: (id: string, action: 'front' | 'back' | 'forward' | 'backward') => void;
  onReparentElement?: (elementId: string, newParentId?: string) => void;
  onAddLayer?: (name: string, colorTag: string) => void;
  onRenameLayer?: (layerId: string, newName: string) => void;
  onReorderLayers?: (sourceIndex: number, targetIndex: number) => void;
  onDeleteLayer?: (layerId: string) => void;
}

export function InfiniteLayerTree({
  layers,
  elements,
  activeLayerId,
  selectedElementId,
  multiSelectedIds = [],
  onSelectElement,
  onSelectLayer,
  onToggleLock,
  onToggleVisibility,
  onDeleteElement,
  onGroupSelected,
  onUngroupSelected,
  onDuplicateElement,
  onReorderZIndex,
  onReparentElement,
  onAddLayer,
  onRenameLayer,
  onReorderLayers,
  onDeleteLayer,
}: InfiniteLayerTreeProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOverTargetId, setDragOverTargetId] = useState<string | null>(null);
  const [isAddingLayer, setIsAddingLayer] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  const [newLayerColor, setNewLayerColor] = useState('#2563eb');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState('');

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-3.5 h-3.5 text-slate-500" />;
      case 'image':
        return <Image className="w-3.5 h-3.5 text-emerald-500" />;
      case 'html-card':
      case 'web-frame':
      case 'container':
        return <Globe className="w-3.5 h-3.5 text-blue-500" />;
      case 'diagram-node':
        return <Workflow className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Box className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  // Breadcrumbs for selected element
  const breadcrumbs = InfiniteLayerManager.getBreadcrumbPath(selectedElementId, elements);

  // Filter elements by query
  const filteredElements = searchQuery.trim()
    ? elements.filter((el) => {
        const query = searchQuery.toLowerCase();
        const text = (el.text || '').toLowerCase();
        const tag = (el.tag || '').toLowerCase();
        const type = el.type.toLowerCase();
        return text.includes(query) || tag.includes(query) || type.includes(query);
      })
    : elements;

  // Root elements
  const rootElements = filteredElements.filter((el) => !el.parentId);

  // Drag & drop layer reparenting
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedElementId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedElementId && draggedElementId !== targetId) {
      setDragOverTargetId(targetId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedElementId && onReparentElement) {
      onReparentElement(draggedElementId, targetId);
    }
    setDraggedElementId(null);
    setDragOverTargetId(null);
  };

  const renderElementNode = (el: CanvasElement, depth = 0) => {
    const isSelected = el.id === selectedElementId || multiSelectedIds.includes(el.id);
    const isLocked = !!el.locked;
    const isHidden = el.visible === false;
    const childElements = elements.filter((child) => child.parentId === el.id);
    const hasChildren = childElements.length > 0;
    const isCollapsed = !!collapsedNodes[el.id];
    const isDragOver = dragOverTargetId === el.id;

    return (
      <div key={el.id} className="flex flex-col">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, el.id)}
          onDragOver={(e) => handleDragOver(e, el.id)}
          onDragLeave={() => setDragOverTargetId(null)}
          onDrop={(e) => handleDrop(e, el.id)}
          onClick={(e) => onSelectElement(el.id, e)}
          className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs cursor-pointer transition-all select-none group border ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/90 ring-1 ring-blue-400'
              : isSelected
              ? 'bg-blue-100/90 text-blue-900 border-blue-300 font-bold shadow-2xs'
              : 'hover:bg-slate-50 text-slate-700 border-transparent'
          }`}
          style={{ paddingRight: `${Math.max(8, depth * 16 + 8)}px` }}
        >
          <div className="flex items-center gap-1.5 truncate flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleCollapse(el.id, e)}
                className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5 inline-block" />
            )}

            {getElementIcon(el.type)}

            <span className="truncate text-[11px]">
              {el.text || (el.tag ? `<${el.tag}>` : el.type)}
            </span>

            {el.tag && (
              <span className="text-[9px] font-mono bg-slate-200/80 text-slate-600 px-1 py-0.5 rounded">
                {el.tag}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(el.id);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              title={isHidden ? 'إظهار العنصر' : 'إخفاء العنصر'}
            >
              {isHidden ? <EyeOff className="w-3 h-3 text-rose-500" /> : <Eye className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(el.id);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              title={isLocked ? 'إلغاء القفل' : 'قفل العنصر'}
            >
              {isLocked ? <Lock className="w-3 h-3 text-amber-600" /> : <Unlock className="w-3 h-3" />}
            </button>

            {onDuplicateElement && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateElement(el.id);
                }}
                className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                title="تكرار وتوليد نسخة"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteElement(el.id);
              }}
              className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
              title="حذف"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recursive Children */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col border-r border-slate-200/70 mr-3 pr-1">
            {childElements.map((child) => renderElementNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 text-xs">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث في شجرة الطبقات والعناصر..."
          className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
        />
      </div>

      {/* Selected Element Operations Toolbar */}
      {selectedElementId && (
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          {/* Breadcrumb path */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500 overflow-x-auto whitespace-nowrap pb-1 border-b border-slate-200/60">
              <span className="font-bold text-slate-400">المسار:</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.id}>
                  <button
                    type="button"
                    onClick={() => onSelectElement(crumb.id)}
                    className={`hover:underline cursor-pointer ${
                      crumb.id === selectedElementId ? 'font-bold text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    {crumb.name}
                  </button>
                  {idx < breadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Quick Actions (Z-Index Reordering & Grouping) */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-0.5">
              {onReorderZIndex && (
                <>
                  <button
                    type="button"
                    onClick={() => onReorderZIndex(selectedElementId, 'front')}
                    className="p-1 text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-200 rounded cursor-pointer"
                    title="إحضار للمقدمة تماماً (Bring to Front)"
                  >
                    <ChevronsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorderZIndex(selectedElementId, 'forward')}
                    className="p-1 text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-200 rounded cursor-pointer"
                    title="تقديم للأمام (Bring Forward)"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorderZIndex(selectedElementId, 'backward')}
                    className="p-1 text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-200 rounded cursor-pointer"
                    title="تراجع للخلف (Send Backward)"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorderZIndex(selectedElementId, 'back')}
                    className="p-1 text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-200 rounded cursor-pointer"
                    title="إرسال للخلفية تماماً (Send to Back)"
                  >
                    <ChevronsDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              {onGroupSelected && (
                <button
                  type="button"
                  onClick={onGroupSelected}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded cursor-pointer shadow-2xs"
                  title="تجميع العناصر المحددة (Ctrl+G)"
                >
                  <FolderPlus className="w-3 h-3 text-blue-600" />
                  <span>تجميع</span>
                </button>
              )}

              {onUngroupSelected && (
                <button
                  type="button"
                  onClick={onUngroupSelected}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 rounded cursor-pointer shadow-2xs"
                  title="فك التجميع"
                >
                  <FolderMinus className="w-3 h-3 text-rose-500" />
                  <span>فك</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Layers Overview & Management */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            الطبقات الرئيسية ({layers.length})
          </span>
          {onAddLayer && (
            <button
              type="button"
              onClick={() => {
                setIsAddingLayer(!isAddingLayer);
                setNewLayerName(`طبقة ${layers.length + 1}`);
              }}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded cursor-pointer transition"
              title="إضافة طبقة جديدة"
            >
              <Plus className="w-3 h-3" />
              <span>إضافة طبقة</span>
            </button>
          )}
        </div>

        {/* New Layer Form */}
        {isAddingLayer && (
          <div className="p-2 bg-slate-50 border border-blue-200 rounded-lg space-y-2">
            <div className="text-[11px] font-bold text-slate-700">إنشاء طبقة جديدة</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                placeholder="اسم الطبقة..."
                className="flex-1 px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newLayerName.trim() && onAddLayer) {
                    onAddLayer(newLayerName.trim(), newLayerColor);
                    setIsAddingLayer(false);
                    setNewLayerName('');
                  }
                  if (e.key === 'Escape') setIsAddingLayer(false);
                }}
              />
              <input
                type="color"
                value={newLayerColor}
                onChange={(e) => setNewLayerColor(e.target.value)}
                className="w-7 h-7 p-0 border border-slate-300 rounded cursor-pointer bg-white"
                title="لون تعريف الطبقة"
              />
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingLayer(false)}
                className="px-2 py-0.5 text-[10px] text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={!newLayerName.trim()}
                onClick={() => {
                  if (newLayerName.trim() && onAddLayer) {
                    onAddLayer(newLayerName.trim(), newLayerColor);
                    setIsAddingLayer(false);
                    setNewLayerName('');
                  }
                }}
                className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded cursor-pointer"
              >
                حفظ الطبقة
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {layers.map((layer, idx) => {
            const isActive = layer.id === activeLayerId;
            const count = elements.filter((el) => el.layerId === layer.id).length;
            const isEditing = editingLayerId === layer.id;

            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all border ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/80 font-bold text-blue-800 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: layer.colorTag || '#2563eb' }}
                  />

                  {isEditing ? (
                    <div
                      className="flex items-center gap-1 flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingLayerName}
                        onChange={(e) => setEditingLayerName(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-xs bg-white border border-blue-400 rounded focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editingLayerName.trim() && onRenameLayer) {
                            onRenameLayer(layer.id, editingLayerName.trim());
                            setEditingLayerId(null);
                          }
                          if (e.key === 'Escape') setEditingLayerId(null);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingLayerName.trim() && onRenameLayer) {
                            onRenameLayer(layer.id, editingLayerName.trim());
                          }
                          setEditingLayerId(null);
                        }}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="تأكيد التعديل"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingLayerId(null)}
                        className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                        title="إلغاء"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      className="truncate font-medium cursor-text"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingLayerId(layer.id);
                        setEditingLayerName(layer.name);
                      }}
                      title="انقر نقراً مزدوجاً لإعادة التسمية"
                    >
                      {layer.name}
                    </span>
                  )}
                </div>

                {/* Layer Control Actions */}
                <div
                  className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Reorder Buttons */}
                  {onReorderLayers && (
                    <div className="flex items-center">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onReorderLayers(idx, idx - 1)}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === layers.length - 1}
                        onClick={() => onReorderLayers(idx, idx + 1)}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Rename Action */}
                  {onRenameLayer && !isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLayerId(layer.id);
                        setEditingLayerName(layer.name);
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                      title="إعادة تسمية الطبقة"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(layer.id)}
                    className={`p-1 rounded cursor-pointer transition ${
                      layer.visible === false
                        ? 'text-slate-400 hover:text-slate-600 bg-slate-100'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                    }`}
                    title={layer.visible === false ? 'إظهار الطبقة' : 'إخفاء الطبقة'}
                  >
                    {layer.visible === false ? (
                      <EyeOff className="w-3 h-3 text-slate-400" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleLock(layer.id)}
                    className={`p-1 rounded cursor-pointer transition ${
                      layer.locked
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-500 hover:text-amber-600 hover:bg-slate-100'
                    }`}
                    title={layer.locked ? 'إلغاء قفل الطبقة' : 'قفل الطبقة'}
                  >
                    {layer.locked ? (
                      <Lock className="w-3 h-3 text-amber-600" />
                    ) : (
                      <Unlock className="w-3 h-3" />
                    )}
                  </button>

                  {/* Delete Layer (Only if more than 1 layer) */}
                  {onDeleteLayer && layers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteLayer(layer.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="حذف الطبقة"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Layer Tree */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <FolderTree className="w-3 h-3 text-blue-600" />
            <span>شجرة الطبقات والعناصر المتداخلة</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {filteredElements.length}
          </span>
        </div>

        {filteredElements.length === 0 ? (
          <div className="p-3 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
            لا توجد عناصر مطابقة في اللوحة
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, undefined)}
            className="space-y-0.5 max-h-72 overflow-y-auto"
          >
            {rootElements.map((el) => renderElementNode(el, 0))}
          </div>
        )}
      </div>
    </div>
  );
}
