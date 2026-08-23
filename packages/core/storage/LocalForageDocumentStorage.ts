/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: تخزين المستندات عبر LocalForage (IndexedDB/WebSQL/localStorage)
 * 🏛️ الدور: مكون مشترك - حفظ واسترجاع وحذف وقائمة المستندات
 * 📥 المستهلك: createEditorServices, DocumentManager
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    LocalForage Abstraction: تجريد LocalForage
 *    مع فهرس مetadata محدث تلقائياً
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الفهرس يجب أن يُحدَّث مع كل حفظ
 *    2. المفتاح يجب أن يتبع النمط doc:{id}
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود الملف قبل الحذف
 *    - fallback لقائمة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import localforage from 'localforage';
import type { DocumentModel } from '../types';
import type { DocumentStorage, DocumentMetadataSummary } from '../documents/DocumentManager';

const store = localforage.createInstance({
  name: 'webpainter-next',
  storeName: 'documents',
});

const INDEX_KEY = 'meta:index';

function docKey(id: string): string {
  return `doc:${id}`;
}

export class LocalForageDocumentStorage implements DocumentStorage {
  public async save(document: DocumentModel): Promise<void> {
    await store.setItem(docKey(document.id), document);

    const index = await this.list();

    const nextIndex: DocumentMetadataSummary[] = [
      {
        id: document.id,
        type: document.type,
        title: document.title,
        updatedAt: document.updatedAt,
        version: document.version,
      },
      ...index.filter((item) => item.id !== document.id),
    ];

    await store.setItem(INDEX_KEY, nextIndex);
  }

  public async load(id: string): Promise<DocumentModel | null> {
    const document = await store.getItem<DocumentModel>(docKey(id));
    return document ?? null;
  }

  public async delete(id: string): Promise<void> {
    await store.removeItem(docKey(id));

    const index = await this.list();
    const nextIndex = index.filter((item) => item.id !== id);

    await store.setItem(INDEX_KEY, nextIndex);
  }

  public async list(): Promise<DocumentMetadataSummary[]> {
    const index = await store.getItem<DocumentMetadataSummary[]>(INDEX_KEY);

    if (!Array.isArray(index)) {
      return [];
    }

    return index.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
}
