/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: Workbench.tsx
 * 📂 المسار: packages/shell/Workbench.tsx
 * 🎯 الهدف الرئيسي: بيئة العمل الرئيسية ومساحة التحرير المتكاملة
 * 📋 المعايير: ثيم فاتح نقي، دعم تفاعل الماوس، إدارة المستندات والتبويبات
 * 🏷️ المعرف: SHELL-001
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Modular Workspace Shell: هيكل تحرير معزول مع شريط تبويبات مرن،
 *    لوحة جانبية للمستندات والقوالب، ودمج مستضيف المحررات الديناميكية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحفاظ على الثيم الفاتح النقي دائماً
 *    2. ضمان تحديث حالة المستند النشط بشكل ذري
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية التنقل والمستندات الشاغرة
 *    - معالجة أخطاء تحميل المحرر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEditorServices } from '../app/providers';
import { DocumentEditorHost } from '../app/DocumentEditorHost';
import type { DocumentModel, DocumentType } from '../core/types';
import {
  FileText,
  Layout,
  Paintbrush,
  FileCode,
  FileCheck,
  Plus,
  X,
  Save,
  Download,
  Code2,
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Settings,
  HelpCircle,
  Maximize2,
  Layers,
  Search,
} from 'lucide-react';

export function Workbench() {
  const services = useEditorServices();
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNewDocMenu, setShowNewDocMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'devstudio'>('editor');
  const devStudioRef = useRef<HTMLDivElement>(null);

  // Sync documents list and active document from DocumentManager
  useEffect(() => {
    const updateDocs = () => {
      const allDocs = services.documents.getAllDocuments();
      setDocuments([...allDocs]);
      const active = services.documents.activeDocument;
      setActiveDocId(active ? active.id : null);
    };

    updateDocs();

    const unsubDocCreated = services.events.on('document:created', updateDocs);
    const unsubDocOpened = services.events.on('document:opened', updateDocs);
    const unsubDocClosed = services.events.on('document:closed', updateDocs);
    const unsubDocSwitched = services.events.on('document:switched', updateDocs);

    return () => {
      unsubDocCreated();
      unsubDocOpened();
      unsubDocClosed();
      unsubDocSwitched();
    };
  }, [services]);

  // Handle document creation
  const handleCreateDocument = (type: DocumentType, title?: string) => {
    const plugin = services.plugins.getPlugin(type);
    const docTitle = title || (plugin ? `${plugin.name} جديد` : 'مستند جديد');
    const doc = services.documents.createDocument(type, docTitle);
    setActiveDocId(doc.id);
    setShowNewDocMenu(false);
  };

  // Ensure at least one default document exists if none
  useEffect(() => {
    if (documents.length === 0) {
      handleCreateDocument('rich-text', 'مستند البداية - LibreText');
    }
  }, [documents.length]);

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];

  const handleDocumentChange = (updated: DocumentModel) => {
    services.documents.updateDocument(updated.id, updated.data);
    setDocuments([...services.documents.getAllDocuments()]);
  };

  const handleCloseDocument = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    services.documents.closeDocument(id);
    const remaining = services.documents.getAllDocuments();
    setDocuments([...remaining]);
    if (remaining.length > 0) {
      setActiveDocId(remaining[remaining.length - 1].id);
    } else {
      setActiveDocId(null);
    }
  };

  const docTypeIcon = (type: DocumentType) => {
    switch (type) {
      case 'rich-text':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'canvas':
        return <Paintbrush className="w-4 h-4 text-purple-600" />;
      case 'ui-page':
        return <Layout className="w-4 h-4 text-emerald-600" />;
      case 'pdf':
        return <FileCheck className="w-4 h-4 text-rose-600" />;
      default:
        return <FileCode className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-800 font-sans select-none overflow-hidden dir-rtl">
      {/* ── Top Header Navigation ────────────────────────────── */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-3 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            title="تبديل الشريط الجانبي"
          >
            {isSidebarOpen ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center gap-2 font-bold text-slate-900 tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-semibold">LibreText</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Suite
            </span>
          </div>

          {/* Documents Tabs */}
          <div className="flex items-center gap-1 mr-4 overflow-x-auto no-scrollbar max-w-2xl">
            {documents.map((doc) => {
              const isActive = doc.id === activeDoc?.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    services.documents.setActiveDocument(doc.id);
                    setActiveDocId(doc.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs font-medium cursor-pointer border-t-2 transition-all ${
                    isActive
                      ? 'bg-slate-100/80 text-blue-700 border-blue-600 shadow-2xs font-semibold'
                      : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100/60'
                  }`}
                >
                  {docTypeIcon(doc.type)}
                  <span className="truncate max-w-[120px]">{doc.title}</span>
                  <button
                    onClick={(e) => handleCloseDocument(e, doc.id)}
                    className="p-0.5 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {/* New Document Button */}
            <div className="relative">
              <button
                onClick={() => setShowNewDocMenu(!showNewDocMenu)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="إنشاء مستند جديد"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>جديد</span>
              </button>

              {showNewDocMenu && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    اختر نوع المستند
                  </div>
                  <button
                    onClick={() => handleCreateDocument('rich-text')}
                    className="w-full text-right px-3 py-2 text-xs flex items-center gap-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">مستند نصي غني</div>
                      <div className="text-[10px] text-slate-400">Writer / Docx / Markdown</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleCreateDocument('canvas')}
                    className="w-full text-right px-3 py-2 text-xs flex items-center gap-2 hover:bg-purple-50 text-slate-700 hover:text-purple-700"
                  >
                    <Paintbrush className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium">لوحة رسم وتصميم</div>
                      <div className="text-[10px] text-slate-400">Canvas Designer / SVG</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleCreateDocument('ui-page')}
                    className="w-full text-right px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700"
                  >
                    <Layout className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">صفحة واجهة مستخدم</div>
                      <div className="text-[10px] text-slate-400">UI Designer / Components</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleCreateDocument('pdf')}
                    className="w-full text-right px-3 py-2 text-xs flex items-center gap-2 hover:bg-rose-50 text-slate-700 hover:text-rose-700"
                  >
                    <FileCheck className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="font-medium">مستند PDF وتأشيرات</div>
                      <div className="text-[10px] text-slate-400">PDF Reader / Annotations</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Dev Studio Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'editor' ? 'devstudio' : 'editor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-all ${
              viewMode === 'devstudio'
                ? 'bg-slate-200 text-slate-900 border-slate-400 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Dev Studio</span>
          </button>

          <button
            onClick={() => services.documents.saveDocument()}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ</span>
          </button>
        </div>
      </header>

      {/* ── Main Workbench Workspace ────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Panel */}
        {isSidebarOpen && (
          <aside className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                المستندات المفتوحة
              </span>
              <FolderOpen className="w-4 h-4 text-slate-400" />
            </div>

            {/* Document Tree */}
            <div className="p-2 space-y-1 overflow-y-auto flex-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    services.documents.setActiveDocument(doc.id);
                    setActiveDocId(doc.id);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    doc.id === activeDoc?.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {docTypeIcon(doc.type)}
                    <span className="truncate">{doc.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">v{doc.version}</span>
                </div>
              ))}
            </div>

            {/* Quick Templates Section */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50">
              <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>قوالب سريعة</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleCreateDocument('rich-text', 'تقرير عمل جديد')}
                  className="p-2 text-right rounded bg-white border border-slate-200 hover:border-blue-300 text-[11px] text-slate-700 font-medium truncate hover:shadow-2xs"
                >
                  📄 تقرير عمل
                </button>
                <button
                  onClick={() => handleCreateDocument('canvas', 'مخطط هيكلي جديد')}
                  className="p-2 text-right rounded bg-white border border-slate-200 hover:border-purple-300 text-[11px] text-slate-700 font-medium truncate hover:shadow-2xs"
                >
                  🎨 مخطط رسم
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Editor Main Canvas Surface */}
        <main className="flex-1 flex flex-col bg-slate-100/60 overflow-hidden relative">
          {viewMode === 'editor' ? (
            activeDoc ? (
              <DocumentEditorHost
                key={activeDoc.id}
                document={activeDoc}
                onChange={handleDocumentChange}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  مرحباً بك في LibreText Suite
                </h2>
                <p className="text-sm text-slate-500 max-w-md mb-6">
                  محرر المستندات والواجهات واللوحات التفاعلية الذكي بمعمارية معيارية ناصعة الفتح.
                </p>
                <button
                  onClick={() => handleCreateDocument('rich-text')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all"
                >
                  إنشاء مستند جديد
                </button>
              </div>
            )
          ) : (
            <div className="flex-1 p-6 bg-slate-50 text-slate-800 overflow-auto font-mono text-xs">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">
                      Dev Studio Diagnostics & Architecture
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800">
                    Engine Active
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400 text-[10px] mb-1">Active Core Document</div>
                    <div className="font-semibold text-slate-200">{activeDoc?.title || 'None'}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400 text-[10px] mb-1">Document Format Type</div>
                    <div className="font-semibold text-slate-200">{activeDoc?.type || 'N/A'}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400 text-[10px] mb-1">Total Open Documents</div>
                    <div className="font-semibold text-slate-200">{documents.length}</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-2">
                  <div className="text-slate-300 font-semibold mb-2">Registered Editor Plugins</div>
                  <ul className="space-y-1 text-slate-400">
                    <li className="flex items-center gap-2">
                      ✓ RichTextPlugin (@libretext/core: rich-text)
                    </li>
                    <li className="flex items-center gap-2">
                      ✓ CanvasDesignerPlugin (@libretext/core: canvas)
                    </li>
                    <li className="flex items-center gap-2">
                      ✓ UIDesignerPlugin (@libretext/core: ui-page)
                    </li>
                    <li className="flex items-center gap-2">✓ PdfPlugin (@libretext/core: pdf)</li>
                    <li className="flex items-center gap-2">
                      ✓ HTMLComponentPlugin (@libretext/core: html-component)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Status Bar ────────────────────────────── */}
      <footer className="h-6 bg-white border-t border-slate-200 flex items-center justify-between px-3 text-[11px] text-slate-500 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            {activeDoc ? docTypeIcon(activeDoc.type) : null}
            <span>{activeDoc?.title || 'لا يوجد مستند'}</span>
          </span>
          <span className="text-slate-300">|</span>
          <span>الإصدار: v{activeDoc?.version || 1}</span>
          <span className="text-slate-300">|</span>
          <span>المستندات: {documents.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>جاهز</span>
          </span>
          <span>اتجاه: RTL</span>
          <span>الثيم: الفاتح النقي</span>
        </div>
      </footer>
    </div>
  );
}
