/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مدير المستندات المركزي مع تخزين واسترجاع - Document Manager
 * 🏛️ الدور: نواة النظام - إنشاء وفتح وحفظ وحذف وقائمة المستندات
 * 📥 المستهلك: Shell, كل المحررات والإضافات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Manager + Storage Interface: مدير مع واجهة تخزين
 *    مع InMemoryDocumentStorage و DocumentEvents
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. IDs يجب أن تكون فريدة لكل مستند
 *    2. التخزين يجب أن يبقى متزامناً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - cloneValue لمنع تعديل المراجع
 *    - فحص وجود المستند قبل الحذف
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocumentModel, DocumentType } from "../types";
import type { EventBus } from "../events/EventBus";
import type { PluginRegistry } from "../plugins/PluginRegistry";

export const DocumentEvents = {
  created: "document:created",
  opened: "document:opened",
  changed: "document:changed",
  saved: "document:saved",
  deleted: "document:deleted",
  closed: "document:closed",
  activated: "document:activated",
  listChanged: "document:list-changed",
} as const;

export interface DocumentMetadataSummary {
  id: string;
  type: DocumentType;
  title: string;
  updatedAt: string;
  version?: number;
}

export interface DocumentStorage {
  save(document: DocumentModel): Promise<void>;
  load(id: string): Promise<DocumentModel | null>;
  delete(id: string): Promise<void>;
  list(): Promise<DocumentMetadataSummary[]>;
}

export class InMemoryDocumentStorage implements DocumentStorage {
  private documents: Map<string, DocumentModel> = new Map();

  public async save(document: DocumentModel): Promise<void> {
    this.documents.set(document.id, cloneValue(document));
  }

  public async load(id: string): Promise<DocumentModel | null> {
    const document = this.documents.get(id);

    if (!document) {
      return null;
    }

    return cloneValue(document);
  }

  public async delete(id: string): Promise<void> {
    this.documents.delete(id);
  }

  public async list(): Promise<DocumentMetadataSummary[]> {
    return Array.from(this.documents.values()).map((document) => ({
      id: document.id,
      type: document.type,
      title: document.title,
      updatedAt: document.updatedAt,
      version: document.version,
    }));
  }
}

export interface DocumentManagerOptions {
  pluginRegistry: PluginRegistry;
  events: EventBus;
  storage?: DocumentStorage;
}

export class DocumentManager {
  private readonly pluginRegistry: PluginRegistry;
  private readonly events: EventBus;
  private readonly storage: DocumentStorage;

  private openDocuments: Map<string, DocumentModel> = new Map();
  private activeDocumentId: string | null = null;

  constructor(options: DocumentManagerOptions) {
    this.pluginRegistry = options.pluginRegistry;
    this.events = options.events;
    this.storage = options.storage ?? new InMemoryDocumentStorage();
  }

  public get openDocumentsList(): DocumentModel[] {
    return Array.from(this.openDocuments.values());
  }

  public get activeDocument(): DocumentModel | null {
    if (!this.activeDocumentId) {
      return null;
    }

    return this.openDocuments.get(this.activeDocumentId) ?? null;
  }

  public get activeDocumentIdValue(): string | null {
    return this.activeDocumentId;
  }

  public createDocument(
    type: DocumentType,
    title?: string
  ): DocumentModel {
    const plugin = this.pluginRegistry.getPlugin(type);

    if (!plugin) {
      throw new Error(
        `[DocumentManager] No plugin registered for document type: "${type}"`
      );
    }

    const document = plugin.createDefaultDocument(
      title ?? `مستند ${type}`
    );

    this.openDocuments.set(document.id, document);
    this.setActiveDocument(document.id);

    this.events.emit(DocumentEvents.created, document);
    this.events.emit(DocumentEvents.opened, document);
    this.events.emit(DocumentEvents.listChanged, this.openDocumentsList);

    return document;
  }

  public openDocument(
    document: DocumentModel,
    options?: {
      activate?: boolean;
    }
  ): DocumentModel {
    const existing = this.openDocuments.get(document.id);

    const nextDocument: DocumentModel = existing
      ? {
          ...document,
          updatedAt: new Date().toISOString(),
        }
      : document;

    this.openDocuments.set(nextDocument.id, nextDocument);

    if (options?.activate !== false) {
      this.setActiveDocument(nextDocument.id);
    }

    this.events.emit(DocumentEvents.opened, nextDocument);
    this.events.emit(DocumentEvents.listChanged, this.openDocumentsList);

    return nextDocument;
  }

  public async openStoredDocument(
    id: string
  ): Promise<DocumentModel | null> {
    const alreadyOpen = this.openDocuments.get(id);

    if (alreadyOpen) {
      this.setActiveDocument(id);
      return alreadyOpen;
    }

    const loaded = await this.storage.load(id);

    if (!loaded) {
      return null;
    }

    return this.openDocument(loaded);
  }

  public getDocument(id: string): DocumentModel | undefined {
    return this.openDocuments.get(id);
  }

  public updateDocument(
    id: string,
    updater: Partial<DocumentModel> | ((document: DocumentModel) => DocumentModel)
  ): DocumentModel | null {
    const current = this.openDocuments.get(id);

    if (!current) {
      return null;
    }

    let next: DocumentModel;

    if (typeof updater === "function") {
      const updated = updater(current);

      next = {
        ...updated,
        id: current.id,
        type: current.type,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
      };
    } else {
      next = {
        ...current,
        ...updater,
        id: current.id,
        type: current.type,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
      };
    }

    this.openDocuments.set(id, next);

    this.events.emit(DocumentEvents.changed, next);

    return next;
  }

  public updateDocumentData<TData = unknown>(
    id: string,
    dataOrUpdater: Partial<TData> | ((currentData: unknown) => TData)
  ): DocumentModel | null {
    const document = this.openDocuments.get(id);

    if (!document) {
      return null;
    }

    let nextData: unknown;

    if (typeof dataOrUpdater === "function") {
      nextData = (dataOrUpdater as (currentData: unknown) => unknown)(
        document.data
      );
    } else if (
      isRecord(document.data) &&
      isRecord(dataOrUpdater)
    ) {
      nextData = {
        ...(document.data as Record<string, unknown>),
        ...(dataOrUpdater as Record<string, unknown>),
      };
    } else {
      nextData = dataOrUpdater;
    }

    return this.updateDocument(id, (doc) => ({
      ...doc,
      data: nextData,
    }));
  }

  public setActiveDocument(id: string | null): void {
    if (id !== null && !this.openDocuments.has(id)) {
      console.warn(
        `[DocumentManager] Cannot activate document. Document not open: "${id}"`
      );

      return;
    }

    if (this.activeDocumentId === id) {
      return;
    }

    this.activeDocumentId = id;

    this.events.emit(DocumentEvents.activated, this.activeDocument);
  }

  public closeDocument(id: string): boolean {
    const existed = this.openDocuments.delete(id);

    if (!existed) {
      return false;
    }

    if (this.activeDocumentId === id) {
      const nextId = this.openDocuments.keys().next().value ?? null;
      this.setActiveDocument(nextId);
    }

    this.events.emit(DocumentEvents.closed, { id });
    this.events.emit(DocumentEvents.listChanged, this.openDocumentsList);

    return true;
  }

  public async saveDocument(id?: string): Promise<DocumentModel> {
    const document = id
      ? this.getDocument(id)
      : this.activeDocument;

    if (!document) {
      throw new Error("[DocumentManager] No document to save.");
    }

    await this.storage.save(document);

    this.events.emit(DocumentEvents.saved, document);

    return document;
  }

  public async saveAll(): Promise<void> {
    for (const document of this.openDocuments.values()) {
      await this.storage.save(document);
      this.events.emit(DocumentEvents.saved, document);
    }
  }

  public serializeDocument(id?: string): string {
    const document = id
      ? this.getDocument(id)
      : this.activeDocument;

    if (!document) {
      throw new Error("[DocumentManager] No document to serialize.");
    }

    const plugin = this.pluginRegistry.getPlugin(document.type);

    if (plugin?.serialize) {
      return plugin.serialize(document);
    }

    return JSON.stringify(document, null, 2);
  }

  public deserializeDocument(raw: string): DocumentModel {
    const parsed = JSON.parse(raw) as Partial<DocumentModel>;

    if (!parsed || typeof parsed.type !== "string") {
      throw new Error(
        "[DocumentManager] Invalid document format: missing document type."
      );
    }

    const plugin = this.pluginRegistry.getPlugin(
      parsed.type as DocumentType
    );

    if (plugin?.deserialize) {
      return plugin.deserialize(raw);
    }

    return parsed as DocumentModel;
  }

  public importFromSerialized(raw: string): DocumentModel {
    const document = this.deserializeDocument(raw);
    return this.openDocument(document);
  }

  public async listStoredDocuments(): Promise<DocumentMetadataSummary[]> {
    return this.storage.list();
  }

  public async deleteStoredDocument(id: string): Promise<void> {
    await this.storage.delete(id);
    if (this.openDocuments.has(id)) {
      this.closeDocument(id);
    }
    this.events.emit(DocumentEvents.deleted, { id });
  }
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}
