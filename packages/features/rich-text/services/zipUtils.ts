/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أدوات ZIP المعزولة للمستندات (OOXML, ODF) - ZIP Utilities
 * 🏛️ الدور: محرك مشترك - إنشاء وقراءة ملفات ZIP للمستندات
 * 📥 المستهلك: docxUtils, docxServices
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Shared ZIP Core Delegation: تفويض لـ shared/lib-core/archive/zip-engine
 *    مع إعادة تصدير CRC32 وZipArchiveWriter/Reader
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. CRC32 يجب أن يكون دقيقاً
 *    2. بيانات ZIP يجب أن تكون متوافقة مع OOXML
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة البيانات قبل الإنشاء
 *    - fallback لخطأ واضح
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Zero-dependency Pure TypeScript ZIP Archiver and Extractor for in-browser OOXML (.docx), ODF and general archives.
 * Delegates to the unified shared pure zip-engine core.
 */

import { calculateCRC32 as sharedCRC32, ZipArchiveWriter, ZipArchiveReader } from '../../../shared/lib-core/archive/zip-engine';

export const calculateCRC32 = sharedCRC32;

export interface ZipEntryInput {
  name: string;
  data: Uint8Array | string;
}

/**
 * Creates a valid ZIP archive using the shared pure zip-engine (Zero dependencies)
 */
export function createZipArchive(entries: ZipEntryInput[]): Blob {
  const writer = new ZipArchiveWriter();
  for (const entry of entries) {
    writer.addFile(entry.name, entry.data);
  }
  const buffer = writer.build();
  return new Blob([buffer], { type: 'application/zip' });
}

/**
 * Reads all entries from a ZIP archive as a Map of string names to Uint8Array contents
 */
export async function readZipEntries(buffer: ArrayBuffer | Uint8Array): Promise<Map<string, Uint8Array>> {
  const reader = new ZipArchiveReader(buffer);
  const files = await reader.extractFiles();
  const resultMap = new Map<string, Uint8Array>();
  for (const f of files) {
    resultMap.set(f.name, f.data);
  }
  return resultMap;
}

/**
 * Extracts files from a ZIP archive using the shared pure zip-engine as string contents
 */
export async function extractZipArchive(blob: Blob | ArrayBuffer): Promise<Map<string, string>> {
  const buffer = blob instanceof Blob ? await blob.arrayBuffer() : blob;
  const reader = new ZipArchiveReader(buffer);
  const files = await reader.extractFiles();
  const resultMap = new Map<string, string>();
  for (const f of files) {
    resultMap.set(f.name, f.text());
  }
  return resultMap;
}
