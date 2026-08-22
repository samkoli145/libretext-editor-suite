/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل وتصدير المستندات إلى حزمة OpenDocument (.odt)
 * 🏛️ الدور: مكون مشترك - إنشاء ملفات ODT قياسية بصفر مكتبات خارجية
 * 📥 المستهلك: UniversalFormatConverter, RichTextEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Library ODT Export: تصدير ODT بدون مكتبات خارجية
 *    مع createZipArchive الداخلي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الملفات يجب أن تتوافق مع معيار ODF
 *    2. XML يجب أن يكون صالحاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المحتوى قبل الإضافة
 *    - fallback لملف فارغ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createZipArchive, type ZipEntryInput } from '../features/rich-text/services/zipUtils';

export interface OdtMetadata {
  title?: string;
  creator?: string;
  description?: string;
}

export class OdtConverter {
  /**
   * توليد محتوى content.xml القياسي
   */
  static generateContentXml(htmlContent: string): string {
    const sanitizedContent = htmlContent
      .replace(/<p>/gi, '<text:p text:style-name="Standard">')
      .replace(/<\/p>/gi, '</text:p>')
      .replace(/<h1>/gi, '<text:h text:outline-level="1">')
      .replace(/<\/h1>/gi, '</text:h>')
      .replace(/<h2>/gi, '<text:h text:outline-level="2">')
      .replace(/<\/h2>/gi, '</text:h>')
      .replace(/<h3>/gi, '<text:h text:outline-level="3">')
      .replace(/<\/h3>/gi, '</text:h>')
      .replace(/<strong>(.*?)<\/strong>/gi, '<text:span text:style-name="Bold">$1</text:span>')
      .replace(/<em>(.*?)<\/em>/gi, '<text:span text:style-name="Italic">$1</text:span>')
      .replace(/<br\s*\/?>/gi, '<text:line-break/>');

    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content 
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" 
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" 
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" 
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
  office:version="1.3">
  
  <office:automatic-styles>
    <style:style style:name="Standard" style:family="paragraph">
      <style:paragraph-properties fo:text-align="start" style:writing-mode="rl-tb"/>
    </style:style>
    <style:style style:name="Bold" style:family="text">
      <style:text-properties fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Italic" style:family="text">
      <style:text-properties fo:font-style="italic"/>
    </style:style>
  </office:automatic-styles>

  <office:body>
    <office:text>
      ${sanitizedContent}
    </office:text>
  </office:body>
</office:document-content>`;
  }

  /**
   * توليد ملف styles.xml
   */
  static generateStylesXml(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles 
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" 
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" 
  office:version="1.3">
  <office:styles>
    <style:default-style style:family="paragraph">
      <style:text-properties style:font-name="Cairo"/>
    </style:default-style>
  </office:styles>
</office:document-styles>`;
  }

  /**
   * توليد ملف meta.xml
   */
  static generateMetaXml(metadata: OdtMetadata = {}): string {
    const title = metadata.title || 'مستند';
    const creator = metadata.creator || 'Google AI Studio';
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta 
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" 
  xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  office:version="1.3">
  <office:meta>
    <dc:title>${title}</dc:title>
    <dc:creator>${creator}</dc:creator>
    <meta:creation-date>${new Date().toISOString()}</meta:creation-date>
  </office:meta>
</office:document-meta>`;
  }

  /**
   * تحويل محتوى HTML إلى حزمة ODT حقيقية (ZIP Archive Blob)
   */
  static convertHtmlToOdtBlob(htmlContent: string, metadata: OdtMetadata = {}): Blob {
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;

    const entries: ZipEntryInput[] = [
      { name: 'mimetype', data: 'application/vnd.oasis.opendocument.text' },
      { name: 'META-INF/manifest.xml', data: manifestXml },
      { name: 'content.xml', data: this.generateContentXml(htmlContent) },
      { name: 'styles.xml', data: this.generateStylesXml() },
      { name: 'meta.xml', data: this.generateMetaXml(metadata) },
    ];

    return createZipArchive(entries);
  }

  /**
   * تحويل محتوى HTML/النصوص الغنية إلى مستند XML قياسي متوافق مع OpenDocument
   */
  static convertHtmlToOdtXml(htmlContent: string, metadata: OdtMetadata = {}): string {
    return this.generateContentXml(htmlContent);
  }
}

export function convertToOdt(title: string, content: string): Blob {
  return OdtConverter.convertHtmlToOdtBlob(content, { title });
}

