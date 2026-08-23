/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: packages/features/pdf/PdfPlugin.tsx
 * 🎯 الهدف الرئيسي: محرر وقارئ وتأشير مستندات PDF
 * 📋 المعايير: تنفيذ واجهة EditorPlugin
 * 🏷️ المعرف: FEAT-PDF-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from "react";
import type { EditorPlugin, EditorPluginProps, DocumentModel } from "../../core/types";
import { FileCheck, Download, Printer, Plus, Trash2, Eye, FileText } from "lucide-react";

export interface PdfDocumentData {
  title: string;
  pages: Array<{
    id: string;
    pageNumber: number;
    content: string;
    annotations: Array<{ id: string; text: string; x: number; y: number }>;
  }>;
  zoom: number;
}

export function createDefaultPdfData(title = "مستند PDF جديد"): PdfDocumentData {
  return {
    title,
    zoom: 1,
    pages: [
      {
        id: "page-1",
        pageNumber: 1,
        content: "صفحة PDF رئيسية جاهزة للعرض وتأشير القراءة والطباعة.",
        annotations: [{ id: "ann-1", text: "ملاحظة مراجعة أولى", x: 50, y: 50 }],
      },
    ],
  };
}

export function PdfEditor({
  document,
  onChange,
}: EditorPluginProps<PdfDocumentData>) {
  const data = document.data || createDefaultPdfData();
  const [activePage, setActivePage] = useState<number>(1);

  const updateData = (newData: PdfDocumentData) => {
    onChange({
      ...document,
      updatedAt: new Date().toISOString(),
      version: document.version + 1,
      data: newData,
    });
  };

  const currentPage = data.pages.find((p) => p.pageNumber === activePage) || data.pages[0];

  const handleAddPage = () => {
    const pageNum = data.pages.length + 1;
    const newPage = {
      id: `page-${Date.now()}`,
      pageNumber: pageNum,
      content: `محتوى الصفحة رقم ${pageNum}`,
      annotations: [],
    };
    updateData({
      ...data,
      pages: [...data.pages, newPage],
    });
    setActivePage(pageNum);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-800 font-sans overflow-hidden dir-rtl select-none">
      {/* PDF Header Toolbar */}
      <div className="h-10 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <FileCheck className="w-4 h-4 text-rose-600" />
          <span>محرر ومستعرض مستندات PDF (PDF Suite)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Main Reader Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Pages Thumbnail Sidebar */}
        <div className="w-48 bg-white border-l border-slate-200 p-3 shrink-0 text-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between font-semibold text-slate-500">
            <span>الصفحات ({data.pages.length})</span>
            <button
              onClick={handleAddPage}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="إضافة صفحة"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {data.pages.map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePage(p.pageNumber)}
                className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                  p.pageNumber === activePage
                    ? "border-rose-500 bg-rose-50/40 text-rose-700 font-bold shadow-2xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                <span>صفحة {p.pageNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Page Main View */}
        <div className="flex-1 p-8 bg-slate-200/80 overflow-auto flex items-center justify-center">
          {currentPage && (
            <div className="w-[595px] h-[842px] bg-white rounded-lg shadow-2xl border border-slate-300 p-10 flex flex-col justify-between relative text-slate-900 font-serif">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <h1 className="text-xl font-bold">{document.title}</h1>
                  <span className="text-xs text-slate-400 font-sans">
                    الصفحة {currentPage.pageNumber} من {data.pages.length}
                  </span>
                </div>

                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPage.content}
                </div>
              </div>

              {/* Page Footer */}
              <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-sans flex items-center justify-between">
                <span>LibreText PDF Suite</span>
                <span>محفوظ ناصع الفتح</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export class PdfPlugin implements EditorPlugin<PdfDocumentData> {
  id = "pdf-plugin";
  name = "مستندات PDF وتأشيرات";
  documentType = "pdf";
  iconName = "FileCheck";
  fileExtensions = ["pdf", "pdf.json", "json"] as const;
  description = "محرر وقارئ مستندات PDF وتأشيرات القراءة والطباعة";

  renderEditor(props: EditorPluginProps<PdfDocumentData>) {
    return <PdfEditor {...props} />;
  }

  createDefaultDocument(title = "مستند PDF جديد"): DocumentModel<PdfDocumentData> {
    return {
      id: `doc-${Date.now()}`,
      type: "pdf",
      title,
      fileExtension: "pdf.json",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      data: createDefaultPdfData(title),
    };
  }

  serialize(doc: DocumentModel<PdfDocumentData>): string {
    return JSON.stringify(doc, null, 2);
  }

  deserialize(raw: string): DocumentModel<PdfDocumentData> {
    try {
      return JSON.parse(raw);
    } catch {
      return this.createDefaultDocument();
    }
  }
}
