/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: packages/features/ui-designer/UIDesignerPlugin.tsx
 * 🎯 الهدف الرئيسي: محرر تصميم واجهات المستخدم والمكونات البصرية
 * 📋 المعايير: تنفيذ EditorPlugin وتوافق 100% مع شجرة المكونات
 * 🏷️ المعرف: FEAT-UI-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { EditorPlugin, EditorPluginProps, DocumentModel } from '../../core/types';
import { UIDesignerData, createDefaultUIDesignerData, UIComponentNode } from './model';
import {
  Layout,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Trash2,
  Type,
  Square,
  Layers,
  Sparkles,
} from 'lucide-react';

export function UIDesignerEditor({ document, onChange }: EditorPluginProps<UIDesignerData>) {
  const data = document.data || createDefaultUIDesignerData();
  const [selectedId, setSelectedId] = useState<string>(
    data.selectedComponentId || data.rootComponentId,
  );
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(
    data.devicePreview || 'desktop',
  );

  const updateData = (newData: UIDesignerData) => {
    onChange({
      ...document,
      updatedAt: new Date().toISOString(),
      version: document.version + 1,
      data: newData,
    });
  };

  const handleAddComponent = (type: string, label: string) => {
    const id = `comp-${Date.now()}`;
    const newComp: UIComponentNode = {
      id,
      type,
      label,
      props: {
        text: type === 'Button' ? 'زر جديد' : type === 'Heading' ? 'عنوان جديد' : 'نص تجريبي',
        fontSize: '14px',
        textColor: '#0f172a',
      },
      parentId: data.rootComponentId,
    };

    const rootComp = data.components[data.rootComponentId];
    updateData({
      ...data,
      components: {
        ...data.components,
        [id]: newComp,
        [data.rootComponentId]: {
          ...rootComp,
          childrenIds: [...(rootComp.childrenIds || []), id],
        },
      },
    });
    setSelectedId(id);
  };

  const handleDeleteComponent = (id: string) => {
    if (id === data.rootComponentId) return;
    const newComps = { ...data.components };
    delete newComps[id];

    // Remove reference from root
    if (newComps[data.rootComponentId]) {
      newComps[data.rootComponentId] = {
        ...newComps[data.rootComponentId],
        childrenIds: (newComps[data.rootComponentId].childrenIds || []).filter((cId) => cId !== id),
      };
    }

    updateData({
      ...data,
      components: newComps,
    });
    setSelectedId(data.rootComponentId);
  };

  const selectedComp = data.components[selectedId];

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-800 font-sans overflow-hidden dir-rtl select-none">
      {/* Top Controls Header */}
      <div className="h-10 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Layout className="w-4 h-4 text-emerald-600" />
          <span>محرر تصميم صفحات وواجهات المستخدم (UI Designer)</span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              device === 'desktop'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>حاسوب</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              device === 'tablet'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>لوحي</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              device === 'mobile'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>جوال</span>
          </button>
        </div>
      </div>

      {/* Main Studio View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Component Tree Sidebar */}
        <div className="w-60 bg-white border-l border-slate-200 p-3 shrink-0 text-xs flex flex-col overflow-y-auto space-y-4">
          <div>
            <div className="font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>إضافة مكون واجهة</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAddComponent('Heading', 'عنوان جديد')}
                className="p-2 border border-slate-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 text-right flex items-center gap-1.5 transition-colors"
              >
                <Type className="w-3.5 h-3.5 text-emerald-600" />
                <span>عنوان</span>
              </button>
              <button
                onClick={() => handleAddComponent('Button', 'زر تفاعلي')}
                className="p-2 border border-slate-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 text-right flex items-center gap-1.5 transition-colors"
              >
                <Square className="w-3.5 h-3.5 text-blue-600" />
                <span>زر</span>
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>شجرة العناصر ({Object.keys(data.components).length})</span>
            </div>
            <div className="space-y-1">
              {Object.values(data.components).map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => setSelectedId(comp.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    comp.id === selectedId
                      ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                      : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                  }`}
                >
                  <span className="truncate">{comp.label || comp.type}</span>
                  {comp.id !== data.rootComponentId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComponent(comp.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center UI Canvas Stage */}
        <div className="flex-1 p-8 bg-slate-100/90 overflow-auto flex items-center justify-center">
          <div
            className={`bg-white rounded-2xl shadow-xl border border-slate-200 p-6 transition-all duration-200 space-y-4 ${
              device === 'mobile'
                ? 'w-[360px] min-h-[500px]'
                : device === 'tablet'
                  ? 'w-[600px] min-h-[550px]'
                  : 'w-[800px] min-h-[600px]'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>شاشة معينة المكونات الحية ({device})</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            </div>

            {Object.values(data.components).map((comp) => {
              if (comp.id === data.rootComponentId) return null;
              const isSelected = comp.id === selectedId;
              return (
                <div
                  key={comp.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(comp.id);
                  }}
                  className={`p-3 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 bg-emerald-50/30'
                      : 'hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {comp.type === 'Heading' && (
                    <h2 className="text-xl font-bold text-slate-900">{comp.props.text}</h2>
                  )}
                  {comp.type === 'Text' && (
                    <p className="text-sm text-slate-600 leading-relaxed">{comp.props.text}</p>
                  )}
                  {comp.type === 'Button' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-xs hover:bg-blue-700">
                      {comp.props.text}
                    </button>
                  )}
                  {comp.type === 'Input' && (
                    <input
                      type="text"
                      readOnly
                      placeholder={comp.props.placeholder}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Panel */}
        {selectedComp && (
          <div className="w-64 bg-white border-r border-slate-200 p-3 shrink-0 text-xs space-y-3">
            <div className="font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>خصائص المكون</span>
              <span className="text-[10px] font-mono text-slate-400">{selectedComp.type}</span>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">تسمية العنصر</label>
              <input
                type="text"
                value={selectedComp.label}
                onChange={(e) => {
                  updateData({
                    ...data,
                    components: {
                      ...data.components,
                      [selectedComp.id]: { ...selectedComp, label: e.target.value },
                    },
                  });
                }}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {selectedComp.props.text !== undefined && (
              <div>
                <label className="block font-medium text-slate-600 mb-1">نص المكون</label>
                <input
                  type="text"
                  value={selectedComp.props.text}
                  onChange={(e) => {
                    updateData({
                      ...data,
                      components: {
                        ...data.components,
                        [selectedComp.id]: {
                          ...selectedComp,
                          props: { ...selectedComp.props, text: e.target.value },
                        },
                      },
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export class UIDesignerPlugin implements EditorPlugin<UIDesignerData> {
  id = 'ui-designer-plugin';
  name = 'مصمم الواجهات وصفحات المستخدم';
  documentType = 'ui-page';
  iconName = 'Layout';
  fileExtensions = ['ui.json', 'json', 'tsx'] as const;
  description = 'محرر ومصمم صفحات واجهات المستخدم مع معاينات تفاعلية للأجهزة';

  renderEditor(props: EditorPluginProps<UIDesignerData>) {
    return <UIDesignerEditor {...props} />;
  }

  createDefaultDocument(title = 'صفحة واجهة جديدة'): DocumentModel<UIDesignerData> {
    return {
      id: `doc-${Date.now()}`,
      type: 'ui-page',
      title,
      fileExtension: 'ui.json',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      data: createDefaultUIDesignerData(title),
    };
  }

  serialize(doc: DocumentModel<UIDesignerData>): string {
    return JSON.stringify(doc, null, 2);
  }

  deserialize(raw: string): DocumentModel<UIDesignerData> {
    try {
      return JSON.parse(raw);
    } catch {
      return this.createDefaultDocument();
    }
  }
}
