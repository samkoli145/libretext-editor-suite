/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: اللوحة الجانبية المعيارية لمحرر الكانفا - Canvas Sidebar Workspace
 * 🏛️ الدور: مكون رئيسي - 8 تبويبات قابلة لإعادة الترتيب والتسمية
 * 📥 المستهلك: CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    8-Tab Workspace: نظام 8 تبويبات (قوالب، مكونات، ألوان، تفاعلات، طبقات، كود، أصول، خصائص)
 *    مع ModularWorkspacePanelHeader لإدارة التبويبات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التبويبات يجب أن تتناسب مع المساحة الجانبية
 *    2. إعادة الترتيب يجب أن تحافظ على التكرار
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة التبويب قبل التبديل
 *    - fallback للتبويب الأول
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import type { CanvasDesignerData, CanvasElement, CanvasLayer } from '../model';
import {
  ModularWorkspacePanelHeader,
  DEFAULT_WORKSPACE_TABS,
  type WorkspaceTabConfig,
} from './ModularWorkspacePanel';
import { DraggableTemplatePanel } from './DraggableTemplatePanel';
import { WebDropInspector } from './WebDropInspector';
import { ColorManagementPanel } from './ColorManagementPanel';
import { InteractionPanel } from './InteractionPanel';
import { InfiniteLayerTree } from './InfiniteLayerTree';
import { LiveCodePanel } from './LiveCodePanel';
import { AssetManager, type ProjectAsset } from './AssetManager';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import { instantiateTemplate } from '../componentLibrary';
import { DockablePanelContainer } from '../../../shared/components/DockablePanelContainer';
import {
  Palette,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Eye,
} from 'lucide-react';

export type LeftPanelTab = 'tools' | 'presets' | 'components' | 'colors' | 'interactions' | 'layers' | 'code' | 'assets' | 'properties';

export interface CanvasSidebarProps {
  workspaceTabs: WorkspaceTabConfig[];
  setWorkspaceTabs: React.Dispatch<React.SetStateAction<WorkspaceTabConfig[]>>;
  leftTab: LeftPanelTab;
  setLeftTab: (tab: LeftPanelTab) => void;
  data: CanvasDesignerData;
  selectedElement: CanvasElement | null;
  selectedElementId: string | null;
  multiSelectedIds: string[];
  stageWidth: number;
  zoom: number;
  viewportContainerRef: React.RefObject<HTMLDivElement | null>;
  onInsertElements: (elements: CanvasElement[], detectedColors?: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onSelectLayer: (id: string) => void;
  onSelectElement: (id: string | null, e?: React.MouseEvent) => void;
  onToggleLayerVisibility: (id: string) => void;
  onToggleLayerLock: (id: string) => void;
  onGroupSelected: () => void;
  onUngroupSelected: () => void;
  onDuplicateSubtree: (id: string) => void;
  onReorderZIndex: (id: string, action: 'front' | 'back' | 'forward' | 'backward') => void;
  onReparentElement: (elementId: string, newParentId?: string) => void;
  onAddLayer: (name: string, colorTag: string) => void;
  onRenameLayer: (id: string, newName: string) => void;
  onReorderLayers: (sourceIndex: number, targetIndex: number) => void;
  onDeleteLayer: (id: string) => void;
  onUpdateCanvasBackground: (color: string) => void;
  onOpenImageEditor: (url: string, elementId?: string) => void;
  onAddElementsBulk: (elements: CanvasElement[]) => void;
  toolsContent?: React.ReactNode;
  // Unified Header Controls
  undo?: () => void;
  redo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  breakpoint?: 'mobile' | 'tablet' | 'desktop';
  onSetBreakpoint?: (bp: 'mobile' | 'tablet' | 'desktop') => void;
  elementCount?: number;
  onExportSvg?: () => void;
  onOpenPreview?: () => void;
  documentTitle?: string;
}

export function CanvasSidebar({
  workspaceTabs,
  setWorkspaceTabs,
  leftTab,
  setLeftTab,
  data,
  selectedElement,
  selectedElementId,
  multiSelectedIds,
  stageWidth,
  zoom,
  viewportContainerRef,
  onInsertElements,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onSelectLayer,
  onSelectElement,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onGroupSelected,
  onUngroupSelected,
  onDuplicateSubtree,
  onReorderZIndex,
  onReparentElement,
  onAddLayer,
  onRenameLayer,
  onReorderLayers,
  onDeleteLayer,
  onUpdateCanvasBackground,
  onOpenImageEditor,
  onAddElementsBulk,
  toolsContent,
  undo,
  redo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  breakpoint,
  onSetBreakpoint,
  elementCount,
  onExportSvg,
  onOpenPreview,
  documentTitle,
}: CanvasSidebarProps) {
  return (
    <DockablePanelContainer
      id="canvas-sidebar-unified"
      title="الشريط الجانبي الموحد"
      icon={Palette}
      side="right"
      defaultWidth={380}
      minWidth={300}
      maxWidth={600}
      storageKeyPrefix="panel.canvas"
    >
      <div className="flex flex-col h-full bg-white overflow-hidden select-none" dir="rtl">
        {/* Unified Top Controls Integrated directly inside Right Sidebar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">محرر الكانفا</span>
              <span className="truncate max-w-[150px]">{documentTitle || 'تصميم متجه'}</span>
            </div>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {elementCount ?? data.elements.length} عناصر
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-200/80">
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={undo}
                disabled={!undo}
                className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition cursor-pointer disabled:opacity-40"
                title="تراجع (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!redo}
                className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition cursor-pointer disabled:opacity-40"
                title="إعادة (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            {zoom !== undefined && (
              <div className="flex items-center gap-0.5 bg-white p-0.5 rounded border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={onZoomOut}
                  className="p-0.5 hover:bg-slate-100 text-slate-700 rounded cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={onResetZoom}
                  className="px-1 font-mono font-bold text-[10px] text-slate-700 hover:text-blue-600 cursor-pointer"
                  title="إعادة الضبط إلى 100%"
                >
                  {Math.round((zoom || 1) * 100)}%
                </button>
                <button
                  type="button"
                  onClick={onZoomIn}
                  className="p-0.5 hover:bg-slate-100 text-slate-700 rounded cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Breakpoint */}
            {breakpoint && onSetBreakpoint && (
              <div className="flex items-center gap-0.5 bg-white p-0.5 rounded border border-slate-200">
                <button
                  type="button"
                  onClick={() => onSetBreakpoint('desktop')}
                  className={`p-1 rounded cursor-pointer ${breakpoint === 'desktop' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
                  title="مكتبي"
                >
                  <Monitor className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onSetBreakpoint('tablet')}
                  className={`p-1 rounded cursor-pointer ${breakpoint === 'tablet' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
                  title="لوحي"
                >
                  <Tablet className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onSetBreakpoint('mobile')}
                  className={`p-1 rounded cursor-pointer ${breakpoint === 'mobile' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
                  title="جوال"
                >
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Export & Preview */}
            <div className="flex items-center gap-1">
              {onExportSvg && (
                <button
                  type="button"
                  onClick={onExportSvg}
                  className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                  title="تصدير SVG"
                >
                  <Download className="w-3 h-3" />
                  <span>SVG</span>
                </button>
              )}
              {onOpenPreview && (
                <button
                  type="button"
                  onClick={onOpenPreview}
                  className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                  title="معاينة الشاشة"
                >
                  <Eye className="w-3 h-3" />
                  <span>معاينة</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modular Workspace Panel Header (Tabs with Reordering, Renaming & Right-Click Context Menu) */}
        <ModularWorkspacePanelHeader
          tabs={workspaceTabs}
          activeTabId={leftTab}
          onSelectTab={(tabId) => setLeftTab(tabId as LeftPanelTab)}
          onReorderTabs={(sourceIndex, targetIndex) => {
            if (targetIndex < 0 || targetIndex >= workspaceTabs.length) return;
            const sorted = [...workspaceTabs].sort((a, b) => a.order - b.order);
            const [moved] = sorted.splice(sourceIndex, 1);
            sorted.splice(targetIndex, 0, moved);
            const reordered = sorted.map((t, idx) => ({ ...t, order: idx }));
            setWorkspaceTabs(reordered);
          }}
          onRenameTab={(tabId, newNameAr) => {
            setWorkspaceTabs((prev) =>
              prev.map((t) => (t.id === tabId ? { ...t, nameAr: newNameAr } : t))
            );
          }}
          onToggleTabVisibility={(tabId) => {
            setWorkspaceTabs((prev) =>
              prev.map((t) => (t.id === tabId ? { ...t, visible: !t.visible } : t))
            );
          }}
          onResetTabs={() => setWorkspaceTabs(DEFAULT_WORKSPACE_TABS)}
        />

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {leftTab === 'tools' && toolsContent}

          {leftTab === 'presets' && (
            <DraggableTemplatePanel
              onInsertTemplate={(template, position) => {
                const tplElements = instantiateTemplate(
                  template,
                  position?.y ?? 80,
                  undefined,
                  undefined,
                  stageWidth
                );
                if (tplElements.length > 0) {
                  if (position?.x !== undefined) {
                    tplElements[0].x = position.x;
                  }
                  onAddElementsBulk(tplElements);
                }
              }}
            />
          )}

          {leftTab === 'components' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>مكونات الويب وقوالب HTML الجاهزة:</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">سحب وإفلات بالفأرة</span>
              </div>
              <WebDropInspector
                activeLayerId={data.activeLayerId || data.layers[0]?.id || 'layer-main'}
                onInsertElements={onInsertElements}
              />
            </div>
          )}

          {leftTab === 'colors' && (
            <ColorManagementPanel
              selectedElement={selectedElement}
              onUpdateElement={onUpdateElement}
              canvasBackground={data.backgroundColor || '#ffffff'}
              onUpdateCanvasBackground={onUpdateCanvasBackground}
            />
          )}

          {leftTab === 'interactions' && (
            <InteractionPanel
              selectedElement={selectedElement}
              allElements={data.elements}
              onUpdateElement={onUpdateElement}
              containerRef={viewportContainerRef}
              zoom={zoom}
            />
          )}

          {leftTab === 'layers' && (
            <InfiniteLayerTree
              layers={data.layers}
              activeLayerId={data.activeLayerId || data.layers[0]?.id || 'layer-main'}
              elements={data.elements}
              selectedElementId={selectedElementId}
              multiSelectedIds={multiSelectedIds}
              onSelectLayer={onSelectLayer}
              onSelectElement={onSelectElement}
              onToggleVisibility={onToggleLayerVisibility}
              onToggleLock={onToggleLayerLock}
              onDeleteElement={onDeleteElement}
              onGroupSelected={onGroupSelected}
              onUngroupSelected={onUngroupSelected}
              onDuplicateElement={onDuplicateSubtree}
              onReorderZIndex={onReorderZIndex}
              onReparentElement={onReparentElement}
              onAddLayer={onAddLayer}
              onRenameLayer={onRenameLayer}
              onReorderLayers={onReorderLayers}
              onDeleteLayer={onDeleteLayer}
            />
          )}

          {leftTab === 'code' && (
            <LiveCodePanel
              elements={data.elements}
              selectedElement={selectedElement}
              canvasWidth={stageWidth}
              canvasHeight={800}
              isOpen={true}
              onToggle={() => {}}
            />
          )}

          {leftTab === 'assets' && (
            <AssetManager
              selectedElementId={selectedElementId}
              onInsertAsset={(asset: ProjectAsset) => {
                if (selectedElement && (selectedElement.type === 'image' || selectedElement.imageUrl)) {
                  onUpdateElement(selectedElement.id, { imageUrl: asset.url });
                } else {
                  onAddElementsBulk([
                    {
                      id: `el-img-${Date.now()}`,
                      type: 'image',
                      imageUrl: asset.url,
                      text: asset.name,
                      width: asset.width ? Math.min(800, asset.width) : 600,
                      height: asset.height ? Math.min(500, asset.height) : 400,
                      x: 80,
                      y: 80,
                      zIndex: data.elements.length + 1,
                      layerId: data.activeLayerId || data.layers[0]?.id || 'layer-main',
                    } as CanvasElement,
                  ]);
                }
              }}
              onUpdateSelectedElementImage={(url) => {
                if (selectedElement) {
                  onUpdateElement(selectedElement.id, { imageUrl: url });
                }
              }}
            />
          )}

          {leftTab === 'properties' && selectedElement && (
            <ElementPropertiesPanel
              selectedElement={selectedElement}
              onUpdateElement={(updated) => onUpdateElement(selectedElement.id, updated)}
              onDeleteElement={() => onDeleteElement(selectedElement.id)}
              onDuplicateElement={() => onDuplicateElement(selectedElement.id)}
              onOpenImageEditor={(url) => {
                onOpenImageEditor(url, selectedElement.id);
              }}
            />
          )}
        </div>
      </div>
    </DockablePanelContainer>
  );
}

