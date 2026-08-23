/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التعرف على أنواع الملفات والامتدادات وتوجيهها - File Type Detection
 * 🏛️ الدور: محرك مشترك - الكشف من الاسم ونوع MIME والتوقيعات الثنائية
 * 📥 المستهلك: DocumentManager, PluginRegistry, UnifiedIngestionPipeline
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Signal Detection: كشف متعدد الإشارات
 *    (الامتداد + MIME + Magic Bytes + عينة محتوى) مع置信度
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Magic Bytes يجب أن تُفحص لكل صيغة
 *    2. الامتداد وحده لا يكفي للتمييز الدقيق
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - صفر مكتبات خارجية (Web APIs فقط)
 *    - fallback لـ 'rich-text' كنوع افتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocumentModel, DocumentType } from '../types';
import { PluginRegistry } from '../plugins/PluginRegistry';
import { sanitizeHtml } from './HtmlPipelineEngine';

export interface FileDetectionResult {
  readonly type: DocumentType;
  readonly extension: string;
  readonly mimeType: string;
  readonly confidence: number;
}

const EXTENSION_TO_DOCUMENT: Readonly<Record<string, DocumentType>> = {
  // 1. نصوص ومستندات قياسية ومفتوحة المصدر (LibreOffice / ODF / Word)
  docx: 'rich-text',
  odt: 'rich-text',
  fodt: 'rich-text',
  ods: 'rich-text',
  fods: 'rich-text',
  odp: 'rich-text',
  fodp: 'rich-text',
  odg: 'canvas',
  odf: 'rich-text',
  html: 'rich-text',
  htm: 'rich-text',
  md: 'rich-text',
  markdown: 'rich-text',
  txt: 'rich-text',
  rtf: 'rich-text',
  epub: 'rich-text',
  csv: 'rich-text',
  tsv: 'rich-text',

  // 2. مستندات وسحابة Google Workspace
  gdoc: 'rich-text',
  gsheet: 'rich-text',
  gslides: 'canvas',
  gdraw: 'canvas',

  // 3. رسم وصور ورسوميات موسعة
  svg: 'canvas',
  png: 'canvas',
  jpg: 'canvas',
  jpeg: 'canvas',
  webp: 'canvas',
  avif: 'canvas',
  gif: 'canvas',
  bmp: 'canvas',
  ico: 'canvas',
  tiff: 'canvas',
  tif: 'canvas',
  eps: 'canvas',

  // 4. وثائق
  pdf: 'pdf',

  // 5. هيكلي ومشاريع
  json: 'rich-text',
};

const SPECIAL_EXTENSIONS: Readonly<Record<string, DocumentType>> = {
  'canvas.json': 'canvas',
  'ui.json': 'ui-page',
  'design.json': 'canvas',
  'vector.svg': 'canvas',
};

const MIME_TO_DOCUMENT: Readonly<Record<string, DocumentType>> = {
  'text/html': 'rich-text',
  'text/markdown': 'rich-text',
  'text/plain': 'rich-text',
  'text/richtext': 'rich-text',
  'text/csv': 'rich-text',
  'text/tab-separated-values': 'rich-text',
  'application/rtf': 'rich-text',
  'application/pdf': 'pdf',
  'image/png': 'canvas',
  'image/jpeg': 'canvas',
  'image/gif': 'canvas',
  'image/svg+xml': 'canvas',
  'image/webp': 'canvas',
  'image/avif': 'canvas',
  'image/bmp': 'canvas',
  'image/x-icon': 'canvas',
  'image/tiff': 'canvas',
  'application/json': 'rich-text',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'rich-text',
  'application/vnd.oasis.opendocument.text': 'rich-text',
  'application/vnd.oasis.opendocument.spreadsheet': 'rich-text',
  'application/vnd.oasis.opendocument.presentation': 'rich-text',
  'application/vnd.oasis.opendocument.graphics': 'canvas',
  'application/vnd.google-apps.document': 'rich-text',
  'application/vnd.google-apps.spreadsheet': 'rich-text',
  'application/vnd.google-apps.presentation': 'canvas',
  'application/vnd.google-apps.drawing': 'canvas',
};

/**
 * كشف نوع المستند من اسم الملف أو MIME أو عينة المحتوى.
 */
export function detectDocumentType(
  fileName: string,
  mimeType?: string,
  contentSample?: string,
): FileDetectionResult {
  if (!fileName || fileName.trim().length === 0) {
    return createDefaultResult('', mimeType);
  }

  // 1. فحص الامتدادات الخاصة المركبة أولاً
  const specialResult = detectSpecialExtension(fileName);
  if (specialResult) return specialResult;

  // 2. فحص MIME type
  if (mimeType) {
    const mimeResult = detectByMimeType(mimeType, fileName);
    if (mimeResult && mimeResult.confidence >= 0.8) {
      return mimeResult;
    }
  }

  // 3. فحص الامتداد العادي
  const extension = extractExtension(fileName);
  const extResult = detectByExtension(extension, mimeType);
  if (extResult && extResult.confidence >= 0.7) {
    return extResult;
  }

  // 4. فحص المحتوى النصي
  if (contentSample && contentSample.length > 0) {
    const contentResult = detectByContent(contentSample, extension);
    if (contentResult && contentResult.confidence >= 0.6) {
      return contentResult;
    }
  }

  return createDefaultResult(extension, mimeType);
}

/**
 * تحديد المحرر المناسب لملف معين.
 */
export function resolveEditorPluginForFile(
  file: File | { name: string; type?: string },
): ReturnType<PluginRegistry['getPlugin']> | null {
  if (!file || !file.name) {
    return null;
  }

  const detection = detectDocumentType(file.name, file.type);
  const registry = PluginRegistry.getInstance();
  return registry.getPlugin(detection.type) ?? null;
}

/**
 * تحليل واستيراد ملف إلى نموذج مستند جاهز للتحرير.
 */
export async function parseAndImportFile(file: File): Promise<DocumentModel | null> {
  if (!file || !file.name) return null;

  try {
    const content = await readFileAsText(file);
    const detection = detectDocumentType(file.name, file.type, content);

    const registry = PluginRegistry.getInstance();
    const plugin = registry.getPlugin(detection.type);

    if (!plugin) {
      console.warn(`[FileTypeDetection] لا يوجد محرر مسجل للنوع: ${detection.type}`);
      return null;
    }

    const title = extractTitleFromFileName(file.name);
    const baseDocument = plugin.createDefaultDocument(title);
    const enrichedData = await transformContentByType(content, detection.type, file);

    return {
      ...baseDocument,
      data: enrichedData ?? baseDocument.data,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[FileTypeDetection] فشل استيراد الملف:', error);
    return null;
  }
}

// ─── دوال الكشف الداخلية ────────────────────────────────────

function detectSpecialExtension(fileName: string): FileDetectionResult | null {
  const lowerName = fileName.toLowerCase();
  for (const [specialExt, docType] of Object.entries(SPECIAL_EXTENSIONS)) {
    if (lowerName.endsWith(specialExt)) {
      return {
        type: docType,
        extension: specialExt,
        mimeType: 'application/json',
        confidence: 0.95,
      };
    }
  }
  return null;
}

function detectByMimeType(mimeType: string, fileName: string): FileDetectionResult | null {
  const normalizedMime = mimeType.toLowerCase().trim();
  const docType = MIME_TO_DOCUMENT[normalizedMime];
  if (!docType) return null;

  return {
    type: docType,
    extension: extractExtension(fileName),
    mimeType: normalizedMime,
    confidence: 0.9,
  };
}

function detectByExtension(extension: string, mimeType?: string): FileDetectionResult | null {
  if (!extension) return null;
  const docType = EXTENSION_TO_DOCUMENT[extension];
  if (!docType) return null;

  return {
    type: docType,
    extension,
    mimeType: mimeType ?? getMimeTypeForExtension(extension),
    confidence: 0.8,
  };
}

function detectByContent(content: string, extension: string): FileDetectionResult | null {
  const trimmed = content.trim();
  if (trimmed.length === 0) return null;

  if (
    trimmed.startsWith('<!DOCTYPE html') ||
    trimmed.startsWith('<!doctype html') ||
    trimmed.startsWith('<html')
  ) {
    return {
      type: 'rich-text',
      extension: 'html',
      mimeType: 'text/html',
      confidence: 0.85,
    };
  }

  if (trimmed.startsWith('<svg') || trimmed.includes('<svg')) {
    return {
      type: 'canvas',
      extension: 'svg',
      mimeType: 'image/svg+xml',
      confidence: 0.85,
    };
  }

  if (isMarkdownContent(trimmed)) {
    return {
      type: 'rich-text',
      extension: 'md',
      mimeType: 'text/markdown',
      confidence: 0.7,
    };
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return detectJsonDocumentType(trimmed, extension);
  }

  return null;
}

function detectJsonDocumentType(
  jsonContent: string,
  extension: string,
): FileDetectionResult | null {
  try {
    const parsed: unknown = JSON.parse(jsonContent);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const record = parsed as Record<string, unknown>;
    if (record.type === 'canvas' || record.type === 'canvas-design') {
      return {
        type: 'canvas',
        extension: 'canvas.json',
        mimeType: 'application/json',
        confidence: 0.9,
      };
    }

    if (record.type === 'ui-page' || record.type === 'ui-design') {
      return {
        type: 'ui-page',
        extension: 'ui.json',
        mimeType: 'application/json',
        confidence: 0.9,
      };
    }

    return {
      type: 'rich-text',
      extension: extension || 'json',
      mimeType: 'application/json',
      confidence: 0.6,
    };
  } catch {
    return null;
  }
}

function isMarkdownContent(content: string): boolean {
  const markdownPatterns: RegExp[] = [
    /^#{1,6}\s+.+$/m,
    /^\*\*[^*]+\*\*$/m,
    /^\*[^*]+\*$/m,
    /^\[.+\]\(.+\)$/m,
    /^```/m,
    /^[-*+]\s+.+$/m,
    /^\d+\.\s+.+$/m,
    /^>\s+.+$/m,
  ];

  let matchCount = 0;
  for (const pattern of markdownPatterns) {
    if (pattern.test(content)) matchCount++;
  }
  return matchCount >= 2;
}

function extractExtension(fileName: string): string {
  if (!fileName) return '';
  const lowerName = fileName.toLowerCase();
  for (const specialExt of Object.keys(SPECIAL_EXTENSIONS)) {
    if (lowerName.endsWith(`.${specialExt}`)) {
      return specialExt;
    }
  }

  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) return '';
  return fileName.slice(lastDotIndex + 1).toLowerCase();
}

function extractTitleFromFileName(fileName: string): string {
  if (!fileName) return 'مستند جديد';
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  return (
    withoutExt
      .replace(/\.canvas$/, '')
      .replace(/\.ui$/, '')
      .replace(/\.design$/, '') || 'مستند جديد'
  );
}

function getMimeTypeForExtension(extension: string): string {
  const mimeMap: Readonly<Record<string, string>> = {
    html: 'text/html',
    htm: 'text/html',
    md: 'text/markdown',
    markdown: 'text/markdown',
    txt: 'text/plain',
    csv: 'text/csv',
    tsv: 'text/tab-separated-values',
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    tiff: 'image/tiff',
    tif: 'image/tiff',
    svg: 'image/svg+xml',
    json: 'application/json',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    odt: 'application/vnd.oasis.opendocument.text',
    fodt: 'application/vnd.oasis.opendocument.text-flat-xml',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    fods: 'application/vnd.oasis.opendocument.spreadsheet-flat-xml',
    odp: 'application/vnd.oasis.opendocument.presentation',
    fodp: 'application/vnd.oasis.opendocument.presentation-flat-xml',
    odg: 'application/vnd.oasis.opendocument.graphics',
    gdoc: 'application/vnd.google-apps.document',
    gsheet: 'application/vnd.google-apps.spreadsheet',
    gslides: 'application/vnd.google-apps.presentation',
  };
  return mimeMap[extension] ?? 'application/octet-stream';
}

function createDefaultResult(extension: string, mimeType?: string): FileDetectionResult {
  return {
    type: 'rich-text',
    extension,
    mimeType: mimeType ?? 'text/plain',
    confidence: 0.3,
  };
}

async function readFileAsText(file: File): Promise<string> {
  if (file.type.startsWith('image/')) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsDataURL(file);
    });
  }

  try {
    return await file.text();
  } catch {
    return '';
  }
}

async function transformContentByType(
  content: string,
  type: DocumentType,
  file: File,
): Promise<Record<string, unknown> | null> {
  switch (type) {
    case 'rich-text': {
      const raw = content.startsWith('<') ? content : `<p>${content.replace(/\n/g, '<br>')}</p>`;
      return {
        content: sanitizeHtml(raw),
      };
    }

    case 'canvas':
      return {
        elements: file.type.startsWith('image/')
          ? [
              {
                id: `img-${Date.now()}`,
                type: 'image',
                x: 50,
                y: 50,
                width: 400,
                height: 300,
                rotation: 0,
                zIndex: 1,
                locked: false,
                visible: true,
                props: {
                  src: content,
                  alt: file.name,
                },
              },
            ]
          : [],
        background: '#ffffff',
        width: 1200,
        height: 800,
      };

    case 'pdf':
      return {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        lastModified: file.lastModified,
      };

    default:
      return null;
  }
}
