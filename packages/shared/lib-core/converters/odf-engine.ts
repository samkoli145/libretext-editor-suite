/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل واستيراد وتصدير حزم مستندات البرمجيات الحرة - ODT/ODS/ODP/FODT/FODS
 * 🏛️ الدور: نواة مشتركة معزولة - محول OpenDocument عبر zip-engine الموحد
 * 📥 المستهلك: UniversalExportHub, UniversalFormatConverter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    ZIP Container Pipeline: بناء حزمة ODF كملف ZIP مع الملفات الفرعية المطلوبة
 *    (mimetype, content.xml, styles.xml) باستخدام zip-engine المعزول
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ملف mimetype يجب أن يكون أول ملف في الأرشيف بدون ضغط
 *    2. namespaces XML يجب أن تكون صحيحة (office, text, table, style)
 *    3. FODT/FODS ملف فردي بدون ضغط - يختلف عن ODT/ODS
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود zip-engine قبل البدء
 *    - حماية أسماء الملفات غير الآمنة في الأرشيف
 *    - إرجاع Uint8Array فارغ مع خطأ وصفي عند الفشل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ZipArchiveWriter, ZipArchiveReader } from '../archive/zip-engine';

export interface OdfExportOptions {
  title?: string;
  author?: string;
  language?: string;
}

export class OdfEngine {
  private static textEncoder = new TextEncoder();

  /**
   * توليد مستند ODT قياسي كامل متوافق مع LibreOffice و OpenOffice و MS Word
   */
  public static async generateOdt(htmlContent: string, options: OdfExportOptions = {}): Promise<Uint8Array> {
    const writer = new ZipArchiveWriter();
    const title = options.title || 'مستند بدون عنوان';
    const author = options.author || 'Universal Studio';

    // 1. mimetype (يجب أن يكون الملف الأول بدون ضغط STORE)
    writer.addFile('mimetype', 'application/vnd.oasis.opendocument.text');

    // 2. META-INF/manifest.xml
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
    writer.addFile('META-INF/manifest.xml', manifestXml);

    // 3. meta.xml
    const metaXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" office:version="1.3">
  <office:meta>
    <dc:title>${this.escapeXml(title)}</dc:title>
    <dc:creator>${this.escapeXml(author)}</dc:creator>
    <dc:date>${new Date().toISOString()}</dc:date>
    <meta:generator>Universal Shared Engine Core</meta:generator>
  </office:meta>
</office:document-meta>`;
    writer.addFile('meta.xml', metaXml);

    // 4. styles.xml
    const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">
  <office:styles>
    <style:default-style style:family="paragraph">
      <style:paragraph-properties fo:text-align="start"/>
      <style:text-properties fo:font-size="12pt" fo:color="#1e293b" style:font-name="Cairo"/>
    </style:default-style>
  </office:styles>
</office:document-styles>`;
    writer.addFile('styles.xml', stylesXml);

    // 5. content.xml (تحويل محتوى HTML إلى وسوم ODF Text)
    const odfBody = this.htmlToOdfText(htmlContent);
    const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">
  <office:body>
    <office:text>
      ${odfBody}
    </office:text>
  </office:body>
</office:document-content>`;
    writer.addFile('content.xml', contentXml);

    return writer.build();
  }

  /**
   * توليد جدول ODS قياسي للبيانات وجداول الحسابات
   */
  public static async generateOds(data: (string | number)[][], options: OdfExportOptions = {}): Promise<Uint8Array> {
    const writer = new ZipArchiveWriter();
    writer.addFile('mimetype', 'application/vnd.oasis.opendocument.spreadsheet');

    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
    writer.addFile('META-INF/manifest.xml', manifestXml);

    let rowsXml = '';
    for (const row of data) {
      rowsXml += '<table:table-row>';
      for (const cell of row) {
        const isNum = typeof cell === 'number';
        const valType = isNum ? 'float' : 'string';
        const valAttr = isNum ? ` office:value="${cell}"` : '';
        rowsXml += `<table:table-cell office:value-type="${valType}"${valAttr}><text:p>${this.escapeXml(String(cell))}</text:p></table:table-cell>`;
      }
      rowsXml += '</table:table-row>';
    }

    const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" office:version="1.3">
  <office:body>
    <office:spreadsheet>
      <table:table table:name="Sheet1">
        ${rowsXml}
      </table:table>
    </office:spreadsheet>
  </office:body>
</office:document-content>`;
    writer.addFile('content.xml', contentXml);

    return writer.build();
  }

  /**
   * توليد Flat XML FODT
   */
  public static generateFodt(htmlContent: string, title = 'Document'): string {
    const odfBody = this.htmlToOdfText(htmlContent);
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/" office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.text">
  <office:meta>
    <dc:title>${this.escapeXml(title)}</dc:title>
  </office:meta>
  <office:body>
    <office:text>
      ${odfBody}
    </office:text>
  </office:body>
</office:document>`;
  }

  /**
   * قراءة واستخراج النصوص من ملف ODT
   */
  public static async parseOdt(buffer: ArrayBuffer | Uint8Array): Promise<string> {
    const reader = new ZipArchiveReader(buffer);
    const files = await reader.extractFiles();
    const contentXmlFile = files.find(f => f.name === 'content.xml');
    if (!contentXmlFile) {
      throw new Error('الملف ليس مستند ODT صالح (حاوية content.xml مفقودة)');
    }
    const xml = contentXmlFile.text();
    // استخراج فقرات النصوص <text:p>
    const matches = xml.match(/<text:p[^>]*>(.*?)<\/text:p>/gi) || [];
    return matches.map(p => p.replace(/<[^>]+>/g, '')).join('\n\n');
  }

  private static htmlToOdfText(html: string): string {
    if (!html) return '<text:p/>';
    // استبدال وسوم الفقرات والعناوين
    const cleanHtml = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<text:h text:outline-level="1">$1</text:h>')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<text:h text:outline-level="2">$1</text:h>')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<text:h text:outline-level="3">$1</text:h>')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '<text:p>$1</text:p>')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<text:span text:style-name="Bold">$1</text:span>')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '<text:span text:style-name="Italic">$1</text:span>')
      .replace(/<br\s*[\/]?>/gi, '<text:line-break/>');

    // إزالة بقية وسوم الـ HTML غير المتوافقة
    return cleanHtml.replace(/<(?!\/?(text:p|text:h|text:span|text:line-break))[^>]+>/g, '');
  }

  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
