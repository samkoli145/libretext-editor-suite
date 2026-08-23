/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: packages/features/html-component/HTMLComponentPlugin.tsx
 * 🎯 الهدف الرئيسي: إضافة محرر مكونات HTML والواجهات
 * 📋 المعايير: تنفيذ واجهة EditorPlugin بالكامل
 * 🏷️ المعرف: FEAT-HTML-02
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { EditorPlugin, EditorPluginProps, DocumentModel } from '../../core/types';
import {
  HTMLComponentData,
  INITIAL_HTML_COMPONENT_DATA,
  generateHtmlFromNodes,
  generateTsxFromNodes,
  HTMLNodeItem,
} from './model';
import {
  Code2,
  Eye,
  Plus,
  Trash2,
  FileCode,
  Layers,
  Sparkles,
  Type,
  Square,
  Heading,
} from 'lucide-react';

export function HTMLComponentEditor({ document, onChange }: EditorPluginProps<HTMLComponentData>) {
  const data = document.data || INITIAL_HTML_COMPONENT_DATA;
  const [activeTab, setActiveTab] = useState<'visual' | 'html' | 'tsx'>('visual');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(data.rootId);

  const updateData = (newData: HTMLComponentData) => {
    onChange({
      ...document,
      updatedAt: new Date().toISOString(),
      version: document.version + 1,
      data: newData,
    });
  };

  const handleAddNode = (type: HTMLNodeItem['type']) => {
    const id = `node-${Date.now()}`;
    const newNode: HTMLNodeItem = {
      id,
      type,
      name: `${type.toUpperCase()} جديد`,
      props: {
        text: type === 'button' ? 'زر جديد' : type === 'heading' ? 'عنوان جديد' : 'نص جديد',
        className:
          type === 'button'
            ? 'px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700'
            : type === 'heading'
              ? 'text-xl font-bold text-slate-900'
              : 'text-sm text-slate-700',
      },
      children: [],
    };

    const targetParentId =
      selectedNodeId && data.nodes[selectedNodeId] ? selectedNodeId : data.rootId;
    const parentNode = data.nodes[targetParentId] || data.nodes[data.rootId];

    updateData({
      ...data,
      nodes: {
        ...data.nodes,
        [id]: newNode,
        [parentNode.id]: {
          ...parentNode,
          children: [...parentNode.children, id],
        },
      },
    });
    setSelectedNodeId(id);
  };

  const handleDeleteNode = (id: string) => {
    if (id === data.rootId) return;
    const newNodes = { ...data.nodes };
    delete newNodes[id];

    // Remove reference from parent
    Object.keys(newNodes).forEach((key) => {
      newNodes[key] = {
        ...newNodes[key],
        children: newNodes[key].children.filter((childId) => childId !== id),
      };
    });

    updateData({
      ...data,
      nodes: newNodes,
    });
    setSelectedNodeId(data.rootId);
  };

  const selectedNode = data.nodes[selectedNodeId];

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-800 font-sans overflow-hidden dir-rtl">
      {/* Editor Top Bar */}
      <div className="h-10 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 font-semibold text-xs text-slate-700">
          <FileCode className="w-4 h-4 text-blue-600" />
          <span>محرر مكونات HTML والواجهات البصرية</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === 'visual'
                ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>التصميم البصري</span>
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === 'html'
                ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>HTML كود</span>
          </button>
          <button
            onClick={() => setActiveTab('tsx')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === 'tsx'
                ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>TSX / React</span>
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {activeTab === 'visual' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Controls: Node Tree & Components Palette */}
          <div className="w-64 bg-white border-l border-slate-200 flex flex-col p-3 shrink-0 overflow-y-auto space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>إضافة عنصر للواجهة</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => handleAddNode('heading')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-right flex items-center gap-1.5 transition-colors"
                >
                  <Heading className="w-3.5 h-3.5 text-blue-600" />
                  <span>عنوان</span>
                </button>
                <button
                  onClick={() => handleAddNode('paragraph')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-right flex items-center gap-1.5 transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-emerald-600" />
                  <span>فقرة</span>
                </button>
                <button
                  onClick={() => handleAddNode('button')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-right flex items-center gap-1.5 transition-colors"
                >
                  <Square className="w-3.5 h-3.5 text-purple-600" />
                  <span>زر</span>
                </button>
                <button
                  onClick={() => handleAddNode('card')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-right flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>بطاقة</span>
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>شجرة العناصر</span>
              </div>
              <div className="space-y-1">
                {Object.values(data.nodes).map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      node.id === selectedNodeId
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                        : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{node.name}</span>
                    {node.id !== data.rootId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
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

          {/* Center Stage: Live Visual Canvas */}
          <div className="flex-1 p-6 bg-slate-100/80 overflow-auto flex items-center justify-center">
            <div className="w-full max-w-3xl min-h-[400px] bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 transition-all">
              <div
                dangerouslySetInnerHTML={{
                  __html: generateHtmlFromNodes(data.rootId, data.nodes),
                }}
              />
            </div>
          </div>

          {/* Right Inspector Panel */}
          {selectedNode && (
            <div className="w-64 bg-white border-r border-slate-200 p-3 shrink-0 text-xs space-y-3">
              <div className="font-semibold text-slate-800 border-b border-slate-100 pb-2">
                خصائص العنصر: {selectedNode.name}
              </div>
              {selectedNode.props.text !== undefined && (
                <div>
                  <label className="block font-medium text-slate-600 mb-1">محتوى النص</label>
                  <input
                    type="text"
                    value={selectedNode.props.text}
                    onChange={(e) => {
                      updateData({
                        ...data,
                        nodes: {
                          ...data.nodes,
                          [selectedNode.id]: {
                            ...selectedNode,
                            props: { ...selectedNode.props, text: e.target.value },
                          },
                        },
                      });
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block font-medium text-slate-600 mb-1">فئات CSS (Tailwind)</label>
                <textarea
                  rows={3}
                  value={selectedNode.props.className || ''}
                  onChange={(e) => {
                    updateData({
                      ...data,
                      nodes: {
                        ...data.nodes,
                        [selectedNode.id]: {
                          ...selectedNode,
                          props: { ...selectedNode.props, className: e.target.value },
                        },
                      },
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Code Tab (HTML or TSX) */
        <div className="flex-1 p-6 bg-slate-50 text-slate-800 font-mono text-xs overflow-auto border border-slate-200 rounded-lg">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeTab === 'html'
              ? generateHtmlFromNodes(data.rootId, data.nodes)
              : generateTsxFromNodes(data.rootId, data.nodes)}
          </pre>
        </div>
      )}
    </div>
  );
}

export class HTMLComponentPlugin implements EditorPlugin<HTMLComponentData> {
  id = 'html-component-plugin';
  name = 'مكونات HTML والواجهات';
  documentType = 'html-component';
  iconName = 'FileCode';
  fileExtensions = ['html', 'tsx', 'jsx', 'json'] as const;
  description = 'محرر مكونات HTML والواجهات البصرية التفاعلية';

  renderEditor(props: EditorPluginProps<HTMLComponentData>) {
    return <HTMLComponentEditor {...props} />;
  }

  createDefaultDocument(title = 'مكون HTML جديد'): DocumentModel<HTMLComponentData> {
    return {
      id: `doc-${Date.now()}`,
      type: 'html-component',
      title,
      fileExtension: 'html',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      data: { ...INITIAL_HTML_COMPONENT_DATA },
    };
  }

  serialize(doc: DocumentModel<HTMLComponentData>): string {
    return JSON.stringify(doc, null, 2);
  }

  deserialize(raw: string): DocumentModel<HTMLComponentData> {
    try {
      return JSON.parse(raw);
    } catch {
      return this.createDefaultDocument();
    }
  }
}
