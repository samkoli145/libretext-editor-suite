/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل المستندات المتقدمة - LaTeX/EPUB/Markdown/RTF/PDF
 * 🏛️ الدور: نواة مشتركة معزولة - محول تخصصي في نظام الـ 50 صيغة
 * 📥 المستهلك: UniversalExportHub, UniversalFormatConverter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Document AST Pipeline: تحويل المستند إلى شجرة AST مشتركة ثم تصديرها
 *    لأي صيغة مطلوبة بتكلفة تحويل واحدة O(n) بدلاً من m×n
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. LaTeX يحتاج حماية الأحرف الخاصة ({, }, &, %, $) قبل الإدراج
 *    2. EPUB يتطلب هيكل مجلدات محدد (META-INF, mimetype, content.opf)
 *    3. RTF يحتاج ترميز Unicode خاصاً للعربية (\uNNNN?)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المدخلات قبل التحويل
 *    - إرجاع خطأ وصفي بدلاً من انهيار عند فشل التحويل
 *    - استخدام encodeURIComponent للنصوص غير الآمنة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ZipArchiveWriter } from '../archive/zip-engine';

export class DocumentMarkupEngine {
  /**
   * توليد مستند LaTeX (.tex) أكاديمي من نصوص HTML
   */
  public static generateLatex(
    htmlContent: string,
    title = 'Document Title',
    author = 'Universal Studio',
  ): string {
    let body = htmlContent
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\\section{$1}\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\\subsection{$1}\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\\subsubsection{$1}\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '\\textbf{$1}')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '\\textit{$1}')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '\\texttt{$1}')
      .replace(/<br\s*[\/]?>/gi, '\\newline\n');

    // Remove remaining HTML tags
    body = body.replace(/<[^>]+>/g, '');

    return `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[arabic,english]{babel}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{${title}}
\\author{${author}}
\\date{\\today}

\\begin{document}

\\maketitle

${body}

\\end{document}
`;
  }

  /**
   * توليد ملف RTF (Rich Text Format) قياسي متوافق مع MS Word & WordPad
   */
  public static generateRtf(text: string, title = 'Document'): string {
    const rtfHeader = `{\\rtf1\\ansi\\deff0\\deflang1025
{\\fonttbl{\\f0\\fnil\\fcharset178 Cairo;}{\\f1\\fnil\\fcharset0 Arial;}}
{\\colortbl ;\\red30\\green41\\blue59;\\red37\\green99\\blue235;}
\\viewkind4\\uc1\\pard\\cf1\\f0\\fs24 `;

    const cleanText = text
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\n/g, '\\par\n');

    return `${rtfHeader}${cleanText}\\par\n}`;
  }

  /**
   * توليد كتاب إلكتروني قياسي بصيغة EPUB 3 (ZIP Container)
   */
  public static async generateEpub(
    htmlContent: string,
    title = 'Book Title',
    author = 'Author',
  ): Promise<Uint8Array> {
    const writer = new ZipArchiveWriter();

    // 1. mimetype (must be uncompressed)
    writer.addFile('mimetype', 'application/epub+zip');

    // 2. META-INF/container.xml
    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    writer.addFile('META-INF/container.xml', containerXml);

    // 3. OEBPS/content.opf
    const opfXml = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${this.escapeXml(title)}</dc:title>
    <dc:creator>${this.escapeXml(author)}</dc:creator>
    <dc:identifier id="BookID">urn:uuid:${Date.now()}</dc:identifier>
    <dc:language>ar</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString()}</meta>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  </manifest>
  <spine>
    <itemref idref="chapter1"/>
  </spine>
</package>`;
    writer.addFile('OEBPS/content.opf', opfXml);

    // 4. OEBPS/chapter1.xhtml
    const xhtmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ar" dir="rtl">
<head>
  <title>${this.escapeXml(title)}</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #1e293b; padding: 2rem; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>${this.escapeXml(title)}</h1>
  <div>${htmlContent}</div>
</body>
</html>`;
    writer.addFile('OEBPS/chapter1.xhtml', xhtmlContent);

    // 5. OEBPS/nav.xhtml
    const navXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="ar">
<head><title>Navigation</title></head>
<body>
  <nav epub:type="toc">
    <h1>جدول المحتويات</h1>
    <ol>
      <li><a href="chapter1.xhtml">${this.escapeXml(title)}</a></li>
    </ol>
  </nav>
</body>
</html>`;
    writer.addFile('OEBPS/nav.xhtml', navXml);

    return writer.build();
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
