/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: موفر الخدمات والسياق العام وموفر التبويبات - TabsProvider & AppProviders
 * 🏛️ الدور: مكون رئيسي - إدارة حالة المستندات المفتوحة وتسجيل الإضافات
 * 📥 المستهلك: App.tsx, Workbench, كل المكونات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Tabs + Services Provider: موفر تبويبات وخدمات
 *    مع الحفظ التلقائي وdebounce وإدارة أحداث النظام
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التبويبات يجب أن تبقى متزامنة
 *    2. الحفظ يجب أن يكون تلقائياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود الملف قبل الحفظ
 *    - fallback لحالة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * موفر الخدمات والسياق العام وموفر التبويبات (TabsProvider & AppProviders)
 * لإدارة حالة المستندات المفتوحة المتعددة (Rich Text, Canvas, UI Designer, PDF).
 * 
 * التوجهات والغرض:
 * 1. موفر التبويبات `TabsProvider`:
 *    - إدارة حالة المستندات المفتوحة المتعددة وقائمتها (`openDocuments`).
 *    - تحديد اللسان النشط (`activeDocument` و `activeDocumentId`).
 *    - دوال إنشاء، فتح، إغلاق، تبديل، وإعادة ترتيب الألسنة بسلاسة.
 *    - دعم كامل للمحررات الأربعة: (النصوص الغنية DOCX، الكانفا، مصمم UI، وعارض PDF).
 * 2. موفر الخدمات `EditorServicesContext` و `AppProviders`:
 *    - تسجيل كافة الإضافات والمحررات.
 *    - الحفظ التلقائي المحلي مع debounce وإدارة أحداث النظام.
 * 
 * الاختبارات والتحقق:
 * - فحص الوحدة والتكامل في `src/core/__tests__/ui_customization_and_shell.test.ts`.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import { createEditorServices } from "../core/createEditorServices";
import type { EditorServices } from "../core/createEditorServices";
import { LocalForageDocumentStorage } from "../core/storage/LocalForageDocumentStorage";
import { registerPlugins } from "./registerPlugins";
import type { DocumentModel, DocumentType } from "../core/types";
import {
  DockableLayoutProvider,
  useDockableLayout,
  type DockableLayoutContextValue,
  type PanelState,
  type TopBarState,
} from "./providers/DockableLayoutProvider";

export {
  DockableLayoutProvider,
  useDockableLayout,
  type DockableLayoutContextValue,
  type PanelState,
  type TopBarState,
};

/* ─── 1. Editor Services Context ─── */
const EditorServicesContext = createContext<EditorServices | null>(null);

/* ─── 2. Tabs Context Interface & Types ─── */
export interface TabsContextValue {
  openDocuments: DocumentModel[];
  activeDocument: DocumentModel | null;
  activeDocumentId: string | null;
  saveStatus: "idle" | "saving" | "saved";
  openDocument: (id: string) => void;
  closeDocument: (id: string) => void;
  createDocument: (type: DocumentType, title?: string) => DocumentModel;
  updateDocument: (id: string, patch: Partial<DocumentModel>) => void;
  reorderDocuments: (sourceIndex: number, destinationIndex: number) => void;
  nextTab: () => void;
  previousTab: () => void;
  saveActiveDocument: () => Promise<void>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * موفر إدارة التبويبات والمستندات المفتوحة (TabsProvider)
 */
export function TabsProvider({ children }: { children: ReactNode }) {
  const services = useEditorServices();

  const [openDocuments, setOpenDocuments] = useState<DocumentModel[]>(
    () => services.documents.openDocumentsList
  );

  const [activeDocument, setActiveDocument] = useState<DocumentModel | null>(
    () => services.documents.activeDocument
  );

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // مزامنة حالة المستندات مع أحداث خدمة المستندات
  useEffect(() => {
    const handleListChanged = () => {
      setOpenDocuments([...services.documents.openDocumentsList]);
      setActiveDocument(services.documents.activeDocument);
    };

    const handleActivated = (doc: unknown) => {
      setActiveDocument(doc as DocumentModel | null);
    };

    const handleChanged = (doc: unknown) => {
      const changed = doc as DocumentModel;
      setOpenDocuments([...services.documents.openDocumentsList]);
      if (services.documents.activeDocument?.id === changed?.id) {
        setActiveDocument(changed);
      }
    };

    const handleSaved = () => {
      setSaveStatus("saved");
      const t = setTimeout(() => setSaveStatus("idle"), 2500);
      return () => clearTimeout(t);
    };

    const unsubList = services.events.on("document:list-changed", handleListChanged);
    const unsubActive = services.events.on("document:activated", handleActivated);
    const unsubChange = services.events.on("document:changed", handleChanged);
    const unsubSaved = services.events.on("document:saved", handleSaved);

    return () => {
      unsubList();
      unsubActive();
      unsubChange();
      unsubSaved();
    };
  }, [services]);

  const openDocument = useCallback(
    (id: string) => {
      services.documents.setActiveDocument(id);
    },
    [services]
  );

  const closeDocument = useCallback(
    (id: string) => {
      services.documents.closeDocument(id);
    },
    [services]
  );

  const createDocument = useCallback(
    (type: DocumentType, title?: string) => {
      const newDoc = services.documents.createDocument(type, title);
      return newDoc;
    },
    [services]
  );

  const updateDocument = useCallback(
    (id: string, patch: Partial<DocumentModel>) => {
      const target = services.documents.getDocument(id);
      if (target) {
        services.documents.updateDocument(id, {
          ...target,
          ...patch,
          updatedAt: new Date().toISOString(),
        });
      }
    },
    [services]
  );

  const reorderDocuments = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      const list = [...services.documents.openDocumentsList];
      if (
        sourceIndex < 0 ||
        sourceIndex >= list.length ||
        destinationIndex < 0 ||
        destinationIndex >= list.length
      ) {
        return;
      }
      const [moved] = list.splice(sourceIndex, 1);
      list.splice(destinationIndex, 0, moved);
      // تحديث القائمة المفتوحة محلياً في الخدمة
      (services.documents as unknown as { openDocuments: DocumentModel[] }).openDocuments = list;
      services.events.emit("document:list-changed", list);
    },
    [services]
  );

  const nextTab = useCallback(() => {
    const list = services.documents.openDocumentsList;
    if (list.length <= 1) return;
    const currentIndex = list.findIndex((d) => d.id === services.documents.activeDocument?.id);
    const nextIndex = (currentIndex + 1) % list.length;
    services.documents.setActiveDocument(list[nextIndex].id);
  }, [services]);

  const previousTab = useCallback(() => {
    const list = services.documents.openDocumentsList;
    if (list.length <= 1) return;
    const currentIndex = list.findIndex((d) => d.id === services.documents.activeDocument?.id);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    services.documents.setActiveDocument(list[prevIndex].id);
  }, [services]);

  const saveActiveDocument = useCallback(async () => {
    const active = services.documents.activeDocument;
    if (!active) return;
    try {
      setSaveStatus("saving");
      await services.documents.saveDocument(active.id);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("[TabsProvider] Save failed:", err);
      setSaveStatus("idle");
    }
  }, [services]);

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      openDocuments,
      activeDocument,
      activeDocumentId: activeDocument?.id ?? null,
      saveStatus,
      openDocument,
      closeDocument,
      createDocument,
      updateDocument,
      reorderDocuments,
      nextTab,
      previousTab,
      saveActiveDocument,
    }),
    [
      openDocuments,
      activeDocument,
      saveStatus,
      openDocument,
      closeDocument,
      createDocument,
      updateDocument,
      reorderDocuments,
      nextTab,
      previousTab,
      saveActiveDocument,
    ]
  );

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}

/**
 * خطاف مخصص لاستخدام سياق التبويبات والمستندات المفتوحة
 */
export function useTabs(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used inside a TabsProvider");
  }
  return context;
}

/* ─── 3. Main App Providers Component ─── */
export function AppProviders({ children }: { children: ReactNode }) {
  const [services] = useState(() =>
    createEditorServices({
      storage: new LocalForageDocumentStorage(),
    })
  );

  /**
   * تسجيل الإضافات واستعادة المستندات المخزنة أو إنشاء ألسنة المحررات الأربعة الأساسية.
   */
  useEffect(() => {
    registerPlugins(services);

    services.documents.listStoredDocuments().then((stored) => {
      if (services.documents.openDocumentsList.length === 0) {
        if (stored.length > 0) {
          services.documents.openStoredDocument(stored[0].id);
        } else {
          // فتح مححر مكونات HTML والواجهات كأول محرر رئيسي، متبوعاً بباقي المحررات
          services.documents.createDocument("html-component" as any, "محرر مكونات HTML والواجهات");
          services.documents.createDocument("rich-text", "محرر المستندات والنصوص (DOCX)");
          services.documents.createDocument("canvas", "لوحة الكانفا والكتل التدفقية");
          services.documents.createDocument("ui-page", "مصمم واجهات الاستخدام (UI)");
          services.documents.createDocument("pdf", "عارض ومعدل مستندات PDF");

          // تفعيل أول مستند
          const list = services.documents.openDocumentsList;
          if (list.length > 0) {
            services.documents.setActiveDocument(list[0].id);
          }
        }
      }
    });
  }, [services]);

  /**
   * الحفظ التلقائي مع debounce.
   */
  useEffect(() => {
    const timers = new Map<string, ReturnType<typeof setTimeout>>();

    const unsubscribe = services.events.on<DocumentModel>(
      "document:changed",
      (document) => {
        if (!document?.id) {
          return;
        }

        const existingTimer = timers.get(document.id);

        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
          services.documents
            .saveDocument(document.id)
            .catch((error) => {
              console.error("[AppProviders] Autosave failed", error);
            })
            .finally(() => {
              timers.delete(document.id);
            });
        }, 800);

        timers.set(document.id, timer);
      }
    );

    return () => {
      unsubscribe();

      for (const timer of timers.values()) {
        clearTimeout(timer);
      }

      timers.clear();
    };
  }, [services]);

  return (
    <EditorServicesContext.Provider value={services}>
      <DockableLayoutProvider>
        <TabsProvider>
          <div
            id="app-root-container"
            dir="rtl"
            className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased select-none"
          >
            {children}
          </div>
        </TabsProvider>
      </DockableLayoutProvider>
    </EditorServicesContext.Provider>
  );
}

export function useEditorServices(): EditorServices {
  const context = useContext(EditorServicesContext);

  if (!context) {
    throw new Error("useEditorServices must be used inside AppProviders");
  }

  return context;
}
