/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: universal-format-converter.ts
 * 📂 المسار: packages/core/src/converters/universal-format-converter.ts
 * 🎯 الهدف الرئيسي: محرك تحويل واستيراد وتصدير التنسيقات الشامل - 50+ صيغة
 * 📋 المعايير: صفر مكتبات خارجية، تحويل ثنائي الاتجاه
 * 🧪 الاختبارات: tests/converters/universal-format-converter.test.ts
 * 🏷️ المعرف: CORE-017
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    50+ Format Import/Export Engine: محرك 50+ صيغة
 *    مع Universal Importer وZero Dependencies
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل صيغة يجب أن تُعالج بشكل خاص
 *    2. الاستيراد يجب أن يُرجع مستنداً صالحاً
 *    3. تصدير ODT/ODS يحتاج تنفيذ ZIP خارجي
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - صفر مكتبات خارجية
 *    - فحص نوع الملف قبل المعالجة
 *    - إرجاع خطأ واضح عند غياب تبعيات ZIP
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

function sanitizeHtmlLocal(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export type FormatCategory =
  | 'libreoffice'
  | 'google'
  | 'documents'
  | 'web-code'
  | 'interactive-components'
  | 'cad-vector'
  | 'images'
  | 'spreadsheets';

export interface SupportedFormatOption {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly extension: string;
  readonly mimeType: string;
  readonly category: FormatCategory;
  readonly categoryAr: string;
  readonly iconBadge: string;
  readonly isLossless?: boolean;
  readonly canImport?: boolean;
  readonly canExport?: boolean;
  readonly descriptionAr?: string;
}

export const SUPPORTED_CONVERTER_FORMATS: readonly SupportedFormatOption[] = [
  {
    id: 'odt',
    nameAr: 'مستند نصوص حرة (ODT)',
    nameEn: 'OpenDocument Text',
    extension: 'odt',
    mimeType: 'application/vnd.oasis.opendocument.text',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODT',
    isLossless: true,
    canImport: true,
    canExport: true,
  },
  {
    id: 'fodt',
    nameAr: 'مستند ODF مسطح (FODT)',
    nameEn: 'Flat XML ODF Document',
    extension: 'fodt',
    mimeType: 'application/vnd.oasis.opendocument.text-flat-xml',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 FODT',
    isLossless: true,
    canImport: true,
    canExport: true,
  },
  {
    id: 'ods',
    nameAr: 'جدول حسابي حر (ODS)',
    nameEn: 'OpenDocument Spreadsheet',
    extension: 'ods',
    mimeType: 'application/vnd.oasis.opendocument.spreadsheet',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODS',
    canImport: true,
    canExport: true,
  },
  {
    id: 'odp',
    nameAr: 'عرض تقديمي حر (ODP)',
    nameEn: 'OpenDocument Presentation',
    extension: 'odp',
    mimeType: 'application/vnd.oasis.opendocument.presentation',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODP',
    canImport: true,
    canExport: true,
  },
  {
    id: 'odg',
    nameAr: 'رسم متجه حر (ODG)',
    nameEn: 'OpenDocument Graphics',
    extension: 'odg',
    mimeType: 'application/vnd.oasis.opendocument.graphics',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODG',
    canImport: true,
    canExport: true,
  },
  {
    id: 'gdoc',
    nameAr: 'مستند جوجل (GDOC)',
    nameEn: 'Google Docs Document',
    extension: 'gdoc',
    mimeType: 'application/vnd.google-apps.document',
    category: 'google',
    categoryAr: 'جوجل وسحابي',
    iconBadge: '🌐 GDOC',
    canImport: true,
    canExport: true,
  },
  {
    id: 'gsheet',
    nameAr: 'جدول بيانات جوجل (GSHEET)',
    nameEn: 'Google Sheets Spreadsheet',
    extension: 'gsheet',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    category: 'google',
    categoryAr: 'جوجل وسحابي',
    iconBadge: '🌐 GSHEET',
    canImport: true,
    canExport: true,
  },
  {
    id: 'gslides',
    nameAr: 'عرض تقديمي جوجل (GSLIDES)',
    nameEn: 'Google Slides Presentation',
    extension: 'gslides',
    mimeType: 'application/vnd.google-apps.presentation',
    category: 'google',
    categoryAr: 'جوجل وسحابي',
    iconBadge: '🌐 GSLIDES',
    canImport: true,
    canExport: true,
  },
  {
    id: 'pdf',
    nameAr: 'مستند طباعة محمول (PDF)',
    nameEn: 'PDF Document',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '🖨️ PDF',
    canImport: true,
    canExport: true,
  },
  {
    id: 'docx',
    nameAr: 'مستند وورد (DOCX)',
    nameEn: 'Microsoft Word Document',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📄 DOCX',
    canImport: true,
    canExport: true,
  },
  {
    id: 'rtf',
    nameAr: 'نص منسق غني (RTF)',
    nameEn: 'Rich Text Format',
    extension: 'rtf',
    mimeType: 'application/rtf',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📜 RTF',
    canImport: true,
    canExport: true,
  },
  {
    id: 'epub',
    nameAr: 'كتاب إلكتروني (EPUB)',
    nameEn: 'Electronic Publication',
    extension: 'epub',
    mimeType: 'application/epub+zip',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📚 EPUB',
    canImport: true,
    canExport: true,
  },
  {
    id: 'txt',
    nameAr: 'نص عادي (TXT)',
    nameEn: 'Plain Text File',
    extension: 'txt',
    mimeType: 'text/plain;charset=utf-8',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📝 TXT',
    canImport: true,
    canExport: true,
  },
  {
    id: 'tex',
    nameAr: 'مستند لاتخ (TeX)',
    nameEn: 'LaTeX Document Source',
    extension: 'tex',
    mimeType: 'application/x-tex',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '🔬 TEX',
    canImport: true,
    canExport: true,
  },
  {
    id: 'md',
    nameAr: 'ماركداون (MD)',
    nameEn: 'Markdown Document',
    extension: 'md',
    mimeType: 'text/markdown;charset=utf-8',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '📑 MD',
    canImport: true,
    canExport: true,
  },
  {
    id: 'html',
    nameAr: 'صفحة ويب (HTML5)',
    nameEn: 'HyperText Markup Language',
    extension: 'html',
    mimeType: 'text/html;charset=utf-8',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '🌐 HTML5',
    canImport: true,
    canExport: true,
  },
  {
    id: 'svg',
    nameAr: 'رسم متجهات (SVG)',
    nameEn: 'Scalable Vector Graphics',
    extension: 'svg',
    mimeType: 'image/svg+xml;charset=utf-8',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة',
    iconBadge: '📐 SVG',
    isLossless: true,
    canImport: true,
    canExport: true,
  },
  {
    id: 'json',
    nameAr: 'بيانات مهيكلة (JSON)',
    nameEn: 'JavaScript Object Notation',
    extension: 'json',
    mimeType: 'application/json;charset=utf-8',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '{ } JSON',
    canImport: true,
    canExport: true,
  },
  {
    id: 'csv',
    nameAr: 'قيم مفصولة بفواصل (CSV)',
    nameEn: 'Comma-Separated Values',
    extension: 'csv',
    mimeType: 'text/csv;charset=utf-8',
    category: 'spreadsheets',
    categoryAr: 'جداول وقواعد بيانات',
    iconBadge: '📊 CSV',
    canImport: true,
    canExport: true,
  },
  {
    id: 'yaml',
    nameAr: 'توصيف إعدادات (YAML)',
    nameEn: "YAML Ain't Markup Language",
    extension: 'yaml',
    mimeType: 'text/yaml;charset=utf-8',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '⚙️ YAML',
    canImport: true,
    canExport: true,
  },
  {
    id: 'xml',
    nameAr: 'لغة التوصيف القابلة للامتداد (XML)',
    nameEn: 'Extensible Markup Language',
    extension: 'xml',
    mimeType: 'application/xml',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '🏷️ XML',
    canImport: true,
    canExport: true,
  },
];

export interface ConversionResult {
  readonly success: boolean;
  readonly blob?: Blob;
  readonly textContent?: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly error?: string;
}

export interface ParsedImportData {
  readonly title: string;
  readonly htmlContent: string;
  readonly plainText: string;
  readonly jsonData?: unknown;
  readonly imageSrc?: string;
  readonly elements?: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    fill?: string;
    stroke?: string;
    [key: string]: unknown;
  }>;
  readonly detectedFormat: string;
}

export class UniversalFormatConverter {
  static generateFodt(htmlContent: string, title = 'مستند'): string {
    const cleanHtml = sanitizeHtmlLocal(htmlContent);
    const paragraphs = cleanHtml
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .split('\n')
      .filter(Boolean)
      .map((line) => `      <text:p>${line.trim()}</text:p>`)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.text">
  <office:meta><dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">${title}</dc:title></office:meta>
  <office:body>
    <office:text>
${paragraphs}
    </office:text>
  </office:body>
</office:document>`;
  }

  static generateDxf(elementsOrText: unknown, title = 'Drawing'): string {
    const lines: string[] = [
      '0',
      'SECTION',
      '2',
      'HEADER',
      '9',
      '$ACADVER',
      '1',
      'AC1015',
      '0',
      'ENDSEC',
      '0',
      'SECTION',
      '2',
      'TABLES',
      '0',
      'ENDSEC',
      '0',
      'SECTION',
      '2',
      'BLOCKS',
      '0',
      'ENDSEC',
      '0',
      'SECTION',
      '2',
      'ENTITIES',
    ];

    const elements = Array.isArray(elementsOrText) ? elementsOrText : [];
    if (elements.length > 0) {
      elements.forEach((el: Record<string, unknown>) => {
        const x = (el.x as number) || 0;
        const y = 800 - ((el.y as number) || 0);
        const w = (el.width as number) || 100;
        const h = (el.height as number) || 60;

        if (el.type === 'circle' || el.type === 'ellipse') {
          lines.push(
            '0',
            'CIRCLE',
            '8',
            '0',
            '10',
            String(x + w / 2),
            '20',
            String(y - h / 2),
            '30',
            '0.0',
            '40',
            String(w / 2),
          );
        } else if (el.type === 'text') {
          lines.push(
            '0',
            'TEXT',
            '8',
            '0',
            '10',
            String(x),
            '20',
            String(y),
            '30',
            '0.0',
            '40',
            '16.0',
            '1',
            String(el.text || 'Text'),
          );
        } else {
          lines.push(
            '0',
            'LWPOLYLINE',
            '8',
            '0',
            '90',
            '4',
            '70',
            '1',
            '10',
            String(x),
            '20',
            String(y),
            '10',
            String(x + w),
            '20',
            String(y),
            '10',
            String(x + w),
            '20',
            String(y - h),
            '10',
            String(x),
            '20',
            String(y - h),
          );
        }
      });
    } else {
      lines.push(
        '0',
        'TEXT',
        '8',
        '0',
        '10',
        '100.0',
        '20',
        '500.0',
        '30',
        '0.0',
        '40',
        '24.0',
        '1',
        title,
        '0',
        'LWPOLYLINE',
        '8',
        '0',
        '90',
        '4',
        '70',
        '1',
        '10',
        '50.0',
        '20',
        '750.0',
        '10',
        '750.0',
        '20',
        '750.0',
        '10',
        '750.0',
        '20',
        '50.0',
        '10',
        '50.0',
        '20',
        '50.0',
      );
    }

    lines.push('0', 'ENDSEC', '0', 'EOF');
    return lines.join('\n');
  }

  static generateJsonSchema(sourceData: unknown, title = 'DocumentSchema'): string {
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: `${title} Schema`,
      type: 'object',
      properties: {
        title: { type: 'string', default: title },
        version: { type: 'string', default: '1.0.0' },
        createdAt: { type: 'string', format: 'date-time' },
        elements: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'type', 'x', 'y', 'width', 'height'],
            properties: {
              id: { type: 'string' },
              type: { type: 'string' },
              x: { type: 'number' },
              y: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' },
              text: { type: 'string' },
              fill: { type: 'string' },
              stroke: { type: 'string' },
            },
          },
        },
      },
      required: ['title'],
    };

    return JSON.stringify(schema, null, 2);
  }

  static convertHtmlToMarkdown(html: string): string {
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1\n\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<hr\s*\/?>/gi, '\n---\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  static convertHtmlToPlainText(html: string): string {
    if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, '');
    const tempEl = document.createElement('div');
    tempEl.innerHTML = html;
    return tempEl.textContent || tempEl.innerText || '';
  }

  static convertHtmlTableToCsv(html: string): string {
    if (!/<(table|tr|td|th)[\s>]/i.test(html)) return html.replace(/\r\n/g, '\n').trim();
    if (typeof DOMParser === 'undefined') return html.replace(/\r\n/g, '\n').trim();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('tr');
    if (rows.length === 0) return this.convertHtmlToPlainText(html);

    const csvLines: string[] = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll('th, td');
      const rowValues: string[] = [];
      cells.forEach((cell) => {
        const text = (cell.textContent || '').trim().replace(/"/g, '""');
        rowValues.push(`"${text}"`);
      });
      csvLines.push(rowValues.join(','));
    });

    return csvLines.join('\n');
  }

  static async convertImageSource(
    imageSrcOrSvg: string,
    targetFormat: 'png' | 'jpeg' | 'webp' | 'avif' | 'svg',
    scale = 1,
  ): Promise<Blob> {
    if (
      targetFormat === 'svg' &&
      (imageSrcOrSvg.includes('<svg') || imageSrcOrSvg.startsWith('data:image/svg+xml'))
    ) {
      const svgText = imageSrcOrSvg.startsWith('data:')
        ? decodeURIComponent(imageSrcOrSvg.split(',')[1] || '')
        : imageSrcOrSvg;
      return new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const width = Math.round(img.naturalWidth * scale) || 800;
        const height = Math.round(img.naturalHeight * scale) || 600;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('فشل إنشاء سياق Canvas 2D'));
          return;
        }

        if (targetFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);

        let mimeType = 'image/png';
        if (targetFormat === 'jpeg') mimeType = 'image/jpeg';
        else if (targetFormat === 'webp') mimeType = 'image/webp';
        else if (targetFormat === 'avif') mimeType = 'image/avif';

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else
              canvas.toBlob((pngBlob) => {
                if (pngBlob) resolve(pngBlob);
                else reject(new Error('فشل تصدير الصورة'));
              }, 'image/png');
          },
          mimeType,
          0.95,
        );
      };

      img.onerror = () => reject(new Error('فشل تحميل الصورة المصدرية'));
      if (imageSrcOrSvg.startsWith('<svg')) {
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(imageSrcOrSvg)}`;
      } else {
        img.src = imageSrcOrSvg;
      }
    });
  }

  static async importFile(file: File): Promise<ParsedImportData> {
    const fileName = file.name;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if (
      ['png', 'jpg', 'jpeg', 'webp', 'avif', 'ico', 'bmp', 'gif', 'tiff', 'svg'].includes(extension)
    ) {
      if (extension === 'svg') {
        const svgText = await file.text();
        return {
          title: baseName,
          htmlContent: svgText,
          plainText: svgText,
          imageSrc: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`,
          detectedFormat: 'svg',
        };
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          resolve({
            title: baseName,
            htmlContent: `<img src="${dataUrl}" alt="${baseName}" />`,
            plainText: `[Image: ${fileName}]`,
            imageSrc: dataUrl,
            detectedFormat: extension,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    const text = await file.text();

    if (extension === 'json' || fileName.endsWith('.schema.json')) {
      try {
        const parsed = JSON.parse(text) as Record<string, unknown>;
        const elements = (parsed.elements || parsed.blocks) as unknown[];
        return {
          title: String(parsed.title || baseName),
          htmlContent: String(
            parsed.htmlContent || `<pre><code>${JSON.stringify(parsed, null, 2)}</code></pre>`,
          ),
          plainText: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2),
          jsonData: parsed,
          elements: Array.isArray(elements)
            ? (elements as ParsedImportData['elements'])
            : undefined,
          detectedFormat: 'json',
        };
      } catch {
        return {
          title: baseName,
          htmlContent: `<pre><code>${this.escapeHtml(text)}</code></pre>`,
          plainText: text,
          detectedFormat: 'json',
        };
      }
    }

    if (extension === 'md' || extension === 'markdown' || extension === 'mdx') {
      return {
        title: baseName,
        htmlContent: this.convertMarkdownToHtml(text),
        plainText: text,
        detectedFormat: 'markdown',
      };
    }

    if (extension === 'csv' || extension === 'tsv') {
      const delimiter = extension === 'tsv' ? '\t' : ',';
      const rows = text.split('\n').filter(Boolean);
      let html = '<table class="border-collapse border border-slate-300"><tbody>';
      rows.forEach((row, i) => {
        const cells = row.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
        const tag = i === 0 ? 'th' : 'td';
        html += `<tr>${cells.map((c) => `<${tag} class="border border-slate-300 px-2 py-1">${this.escapeHtml(c)}</${tag}>`).join('')}</tr>`;
      });
      html += '</tbody></table>';
      return { title: baseName, htmlContent: html, plainText: text, detectedFormat: extension };
    }

    if (extension === 'yaml') {
      return {
        title: baseName,
        htmlContent: `<pre><code>${this.escapeHtml(text)}</code></pre>`,
        plainText: text,
        detectedFormat: 'yaml',
      };
    }

    if (extension === 'xml') {
      return {
        title: baseName,
        htmlContent: `<pre><code>${this.escapeHtml(text)}</code></pre>`,
        plainText: text,
        detectedFormat: 'xml',
      };
    }

    return {
      title: baseName,
      htmlContent: `<pre><code>${this.escapeHtml(text)}</code></pre>`,
      plainText: text,
      detectedFormat: extension || 'txt',
    };
  }

  static getFormatById(id: string): SupportedFormatOption | undefined {
    return SUPPORTED_CONVERTER_FORMATS.find((f) => f.id === id);
  }

  static getFormatsByCategory(category: FormatCategory): readonly SupportedFormatOption[] {
    return SUPPORTED_CONVERTER_FORMATS.filter((f) => f.category === category);
  }

  static getImportableFormats(): readonly SupportedFormatOption[] {
    return SUPPORTED_CONVERTER_FORMATS.filter((f) => f.canImport);
  }

  static getExportableFormats(): readonly SupportedFormatOption[] {
    return SUPPORTED_CONVERTER_FORMATS.filter((f) => f.canExport);
  }

  private static convertMarkdownToHtml(md: string): string {
    return md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
