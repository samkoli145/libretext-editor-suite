/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: الفئة المجردة الأساسية لإضافات المحررات - Base Editor Plugin
 * 🏛️ الدور: نواة النظام - توفير الهيكل الأساسي لكل محرر
 * 📥 المستهلك: CanvasDesignerPlugin, RichTextPlugin, PdfPlugin, UIDsPlugin
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Abstract Base Class: فئة أساسية مجردة
 *    مع createDefaultDocument و helper functions
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل فئة فرعية يجب أن تُ implementing جميع الخصائص المجردة
 *    2. createDefaultDocument يجب أن يُرجع مستنداً صالحاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - crypto.randomUUID مع fallback
 *    - فحص صحة التواريخ والأرقام
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ComponentType } from "react";
import type {
  DocumentModel,
  DocumentType,
  EditorPlugin,
  EditorPluginProps,
} from "../types";

function createDocumentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `doc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toIsoString(value: unknown): string {
  return typeof value === "string" ? value : new Date().toISOString();
}

function toVersion(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 1;
}

export abstract class BaseEditorPlugin<TData = unknown>
  implements EditorPlugin<TData>
{
  abstract id: string;
  abstract name: string;
  abstract documentType: DocumentType;
  abstract iconName: string;
  abstract fileExtensions: readonly string[];
  abstract description: string;

  abstract renderEditor: ComponentType<EditorPluginProps<TData>>;

  abstract createDefaultDocument(title?: string): DocumentModel<TData>;

  /**
   * تسلسل افتراضي بصيغة JSON.
   * يمكن لأي Plugin أن يتجاوزه إذا احتاج صيغة خاصة.
   */
  public serialize(document: DocumentModel<TData>): string {
    return this.serializeJson(document);
  }

  /**
   * فك تسلسل افتراضي من JSON.
   * يمكن لأي Plugin أن يتجاوزه إذا احتاج تحققًا خاصًا.
   */
  public deserialize(raw: string): DocumentModel<TData> {
    return this.deserializeJson(raw);
  }

  /**
   * مساعد لإنشاء هيكل مستند جديد.
   */
  protected createDocumentShell(
    title: string,
    data: TData
  ): DocumentModel<TData> {
    const now = new Date().toISOString();

    return {
      id: createDocumentId(),
      type: this.documentType,
      title,
      createdAt: now,
      updatedAt: now,
      version: 1,
      data,
    };
  }

  /**
   * مساعد لتحويل المستند إلى JSON.
   */
  protected serializeJson(document: DocumentModel<TData>): string {
    return JSON.stringify(document, null, 2);
  }

  /**
   * مساعد لإعادة بناء المستند من JSON.
   */
  protected deserializeJson(raw: string): DocumentModel<TData> {
    const parsed = JSON.parse(raw) as Partial<DocumentModel<TData>>;

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid document format: expected an object.");
    }

    if (!parsed.id || typeof parsed.id !== "string") {
      throw new Error("Invalid document format: missing document id.");
    }

    if (!parsed.type || typeof parsed.type !== "string") {
      throw new Error("Invalid document format: missing document type.");
    }

    if (!("data" in parsed)) {
      throw new Error("Invalid document format: missing document data.");
    }

    return {
      id: parsed.id,
      type: this.documentType,
      title: typeof parsed.title === "string" ? parsed.title : "Untitled",
      createdAt: toIsoString(parsed.createdAt),
      updatedAt: toIsoString(parsed.updatedAt),
      version: toVersion(parsed.version),
      data: parsed.data as TData,
    };
  }
}
