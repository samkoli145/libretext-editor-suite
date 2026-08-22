/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: المحرك الموحد للاستقبال واكتشاف وتحويل المحتوى المُلتصق أو المسحوب
 * 🏛️ الدور: محرك مشترك - توحيد معالجة اللصق والسحب والملفات
 * 📥 المستهلك: UnifiedFormatConverterModal, كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Smart Decoding & Mojibake Fix: فك ترميز ذكي مع منع تشوه المحارف العربية
 *    وتطهير بقايا MS Word و Google Docs
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. UTF-8 و Windows-1256 يجب أن يُعالجا بذكاء
 *    2. MS Word Bloat يجب أن يُنظف بالكامل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - صفر مكتبات خارجية (Web APIs فقط)
 *    - فحص نوع الملف قبل المعالجة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  htmlToRichTextDocument,
  htmlToCanvasBlocks,
} from './HtmlPipelineEngine';
import type { DocumentModel } from '../types';

export type IngestionSourceType =
  | 'html-document'
  | 'html-fragment'
  | 'svg'
  | 'image'
  | 'plain-text'
  | 'json-schema'
  | 'ms-word-bloat';

export type IngestionTargetEditor =
  | 'canvas'
  | 'rich-text'
  | 'ui-page'
  | 'pdf';

export interface IngestionResult {
  readonly sourceType: IngestionSourceType;
  readonly targetEditor: IngestionTargetEditor;
  readonly cleanData: unknown;
  readonly document: DocumentModel | null;
  readonly metadata: {
    readonly title: string;
    readonly hasRtl: boolean;
    readonly confidence: number;
    readonly originalEncoding?: string;
  };
}

export interface IngestionOptions {
  readonly preferredTarget?: IngestionTargetEditor;
  readonly allowExternalImages?: boolean;
}

export class UnifiedIngestionPipeline {
  /**
   * الدالة المركزية لمعالجة أي نص، حدث لصق، أو ملف مسحوب.
   */
  public static async processInput(
    rawInput: string | File | DataTransfer,
    options?: IngestionOptions
  ): Promise<IngestionResult> {
    // 1. مرحلة الاستقبال (Reception)
    const { content, fileName, mimeType } = await this.extractPayload(rawInput);

    // 2. معالجة الترميز والنوع (Encoding & Sniffing)
    const { decodedContent, encoding } = await this.smartDecode(content, mimeType);

    // 3. الكشف عن طبيعة المحتوى (على الخام قبل التطهير للحفاظ على علامات Word/Docs)
    const detected = this.sniffContentType(decodedContent, fileName, mimeType);

    // 4. التنظيف والتطهير الأمني (Sanitization)
    const sanitizedContent = this.sanitizeDirtyHtml(decodedContent);

    // 5. التوزيع والتوجيه الآلي (Dispatch & AST Building)
    const targetEditor = options?.preferredTarget ?? detected.suggestedEditor;
    const { cleanData, document } = await this.buildAst(
      sanitizedContent,
      detected.type,
      targetEditor,
      fileName
    );

    return {
      sourceType: detected.type,
      targetEditor,
      cleanData,
      document,
      metadata: {
        title: this.extractDocumentTitle(sanitizedContent, fileName),
        hasRtl: this.detectArabicText(sanitizedContent),
        confidence: detected.confidence,
        originalEncoding: encoding,
      },
    };
  }

  // ─── المرحلة 1: الاستقبال ───────────────────────────────────

  private static async extractPayload(
    rawInput: string | File | DataTransfer
  ): Promise<{ content: string | ArrayBuffer; fileName: string; mimeType: string }> {
    if (typeof rawInput === 'string') {
      return { content: rawInput, fileName: '', mimeType: 'text/plain' };
    }

    if (rawInput instanceof File) {
      const buffer = await rawInput.arrayBuffer();
      return { content: buffer, fileName: rawInput.name, mimeType: rawInput.type };
    }

    // DataTransfer (Drag & Drop / Paste)
    const dt = rawInput;
    if (dt.files && dt.files.length > 0) {
      const file = dt.files[0];
      const buffer = await file.arrayBuffer();
      return { content: buffer, fileName: file.name, mimeType: file.type };
    }

    const htmlData = dt.getData('text/html');
    if (htmlData) {
      return { content: htmlData, fileName: '', mimeType: 'text/html' };
    }

    const textData = dt.getData('text/plain');
    return { content: textData, fileName: '', mimeType: 'text/plain' };
  }

  // ─── المرحلة 2: معالجة الترميز (Mojibake Fix) ──────────────

  private static async smartDecode(
    content: string | ArrayBuffer,
    _mimeType: string
  ): Promise<{ decodedContent: string; encoding: string }> {
    if (typeof content === 'string') {
      return { decodedContent: content, encoding: 'utf-8 (string)' };
    }

    // محاولة 1: UTF-8 القياسي
    try {
      const decoder = new TextDecoder('utf-8', { fatal: true });
      const decoded = decoder.decode(content);
      if (!decoded.includes('\uFFFD')) {
        return { decodedContent: decoded, encoding: 'utf-8' };
      }
    } catch {
      // تجربة ترميز بديل
    }

    // محاولة 2: Windows-1256 (الترميز العربي الكلاسيكي لملفات Word)
    try {
      const decoder = new TextDecoder('windows-1256', { fatal: false });
      const decoded = decoder.decode(content);
      if (this.detectArabicText(decoded)) {
        return { decodedContent: decoded, encoding: 'windows-1256' };
      }
    } catch {
      // فشل
    }

    // محاولة 3: ISO-8859-6
    try {
      const decoder = new TextDecoder('iso-8859-6', { fatal: false });
      return { decodedContent: decoder.decode(content), encoding: 'iso-8859-6' };
    } catch {
      // فشل
    }

    // Fallback نهائي: UTF-8 آمن
    const decoder = new TextDecoder('utf-8', { fatal: false });
    return { decodedContent: decoder.decode(content), encoding: 'utf-8 (fallback)' };
  }

  // ─── المرحلة 3: التنظيف ─────────────────────────────────────

  private static sanitizeDirtyHtml(input: string): string {
    if (!input) return '';

    return input
      .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '')
      .replace(/<\/?\w+:[^>]*>/gi, '')
      .replace(/\s*mso-[^;:"'>]+;?/gi, '')
      .replace(/class="Mso[^"]*"/gi, '')
      .replace(/<xml>[\s\S]*?<\/xml>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  // ─── المرحلة 4: الكشف ───────────────────────────────────────

  private static sniffContentType(
    content: string,
    fileName: string,
    mimeType: string
  ): {
    type: IngestionSourceType;
    suggestedEditor: IngestionTargetEditor;
    confidence: number;
  } {
    const trimmed = content.trim();

    // 1. فحص الصور
    if (mimeType.startsWith('image/') || (fileName && /\.(png|jpg|jpeg|webp|gif|bmp)$/i.test(fileName))) {
      return { type: 'image', suggestedEditor: 'canvas', confidence: 0.95 };
    }

    // 2. فحص SVG
    if (trimmed.startsWith('<svg') || trimmed.includes('<svg xmlns=')) {
      return { type: 'svg', suggestedEditor: 'canvas', confidence: 0.95 };
    }

    // 3. فحص JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        JSON.parse(trimmed);
        return { type: 'json-schema', suggestedEditor: 'ui-page', confidence: 0.9 };
      } catch {
        // ليس JSON صالح
      }
    }

    // 4. فحص HTML كامل
    if (trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html')) {
      return { type: 'html-document', suggestedEditor: 'rich-text', confidence: 0.9 };
    }

    // 5. فحص مقتطفات HTML
    if (/<[a-z][\s\S]*>/i.test(trimmed) && (trimmed.includes('</') || trimmed.includes('/>'))) {
      if (content.includes('mso-') || content.includes('MsoNormal')) {
        return { type: 'ms-word-bloat', suggestedEditor: 'rich-text', confidence: 0.85 };
      }
      return { type: 'html-fragment', suggestedEditor: 'rich-text', confidence: 0.8 };
    }

    // 6. نص عادي
    return { type: 'plain-text', suggestedEditor: 'rich-text', confidence: 0.6 };
  }

  // ─── المرحلة 5: بناء شجرة AST ─────────────────────────────

  private static async buildAst(
    content: string,
    type: IngestionSourceType,
    target: IngestionTargetEditor,
    fileName: string
  ): Promise<{ cleanData: unknown; document: DocumentModel | null }> {
    switch (type) {
      case 'image': {
        return {
          cleanData: { src: content, type: 'image' },
          document: null,
        };
      }

      case 'svg': {
        return {
          cleanData: { svgContent: content, type: 'svg' },
          document: null,
        };
      }

      case 'html-document':
      case 'html-fragment':
      case 'ms-word-bloat': {
        if (target === 'canvas') {
          const blocks = htmlToCanvasBlocks(content);
          return { cleanData: blocks, document: null };
        }

        const title = this.extractDocumentTitle(content, fileName);
        const doc = htmlToRichTextDocument(content, {
          title,
          stripScripts: true,
          stripStyles: false,
        });
        return { cleanData: doc.data, document: doc };
      }

      case 'json-schema': {
        try {
          const parsed = JSON.parse(content);
          return { cleanData: parsed, document: null };
        } catch {
          return { cleanData: { text: content }, document: null };
        }
      }

      default: {
        return {
          cleanData: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }],
          },
          document: null,
        };
      }
    }
  }

  // ─── دوال مساعدة ──────────────────────────────────────────

  private static detectArabicText(text: string): boolean {
    return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
  }

  private static extractDocumentTitle(content: string, fileName?: string): string {
    if (fileName) {
      return fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    }
    const match = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      return h1Match[1].trim();
    }
    return 'مستند مستورد جديد';
  }
}
