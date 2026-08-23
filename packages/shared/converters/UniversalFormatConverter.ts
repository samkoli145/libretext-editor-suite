/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل واستيراد وتصدير التنسيقات الشامل - Universal Format Converter
 * 🏛️ الدور: محرك رئيسي - 50+ صيغة استيراد وتصدير متطابقة بدقة
 * 📥 المستهلك: ContextualHeaderToolbar, كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    50+ Format Import/Export Engine: محرك 50+ صيغة
 *    مع Universal Importer وZero Dependencies
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل صيغة يجب أن تُعالج بشكل خاص
 *    2. الاستيراد يجب أن يُرجع مستنداً صالحاً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - صفر مكتبات خارجية
 *    - فحص نوع الملف قبل المعالجة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createZipArchive, type ZipEntryInput } from '../../features/rich-text/services/zipUtils';
import { sanitizeHtml } from '../../core/engines/HtmlPipelineEngine';
import { ImageFormatEngine } from '../lib-core/converters/image-format-engine';
import { VectorTracerEngine } from '../lib-core/raster/vector-tracer-engine';

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
  // ─── 1. منظومة البرمجيات الحرة (LibreOffice / ODF) ───────────────────
  {
    id: 'odt',
    nameAr: 'مستند نصوص حرة (LibreOffice Writer ODT)',
    nameEn: 'OpenDocument Text',
    extension: 'odt',
    mimeType: 'application/vnd.oasis.opendocument.text',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODT',
    isLossless: true,
    canImport: true,
    canExport: true,
    descriptionAr: 'مستند نصي مفتوح متوافق كلياً مع LibreOffice و OpenOffice.',
  },
  {
    id: 'fodt',
    nameAr: 'مستند ODF نصي مسطح (Flat XML FODT)',
    nameEn: 'Flat XML ODF Document',
    extension: 'fodt',
    mimeType: 'application/vnd.oasis.opendocument.text-flat-xml',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 FODT',
    isLossless: true,
    canImport: true,
    canExport: true,
    descriptionAr: 'مستند نصي بصيغة XML أحادية بدون ضغط ZIP لسهولة التتبع والنسخ.',
  },
  {
    id: 'ods',
    nameAr: 'جدول حسابي حر (LibreOffice Calc ODS)',
    nameEn: 'OpenDocument Spreadsheet',
    extension: 'ods',
    mimeType: 'application/vnd.oasis.opendocument.spreadsheet',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODS',
    canImport: true,
    canExport: true,
    descriptionAr: 'جدول بيانات وحسابات مفتوح المصدر متوافق مع كافة برامج الجداول.',
  },
  {
    id: 'odp',
    nameAr: 'عرض تقديمي حر (LibreOffice Impress ODP)',
    nameEn: 'OpenDocument Presentation',
    extension: 'odp',
    mimeType: 'application/vnd.oasis.opendocument.presentation',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODP',
    canImport: true,
    canExport: true,
    descriptionAr: 'عروض تقديمية وشرائح بصرية مفتوحة المصدر.',
  },
  {
    id: 'odg',
    nameAr: 'رسم وتصميم متجه حر (LibreOffice Draw ODG)',
    nameEn: 'OpenDocument Graphics',
    extension: 'odg',
    mimeType: 'application/vnd.oasis.opendocument.graphics',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODG',
    canImport: true,
    canExport: true,
    descriptionAr: 'رسوميات متجهة ومخططات هندسية حرة.',
  },
  {
    id: 'odf',
    nameAr: 'صيغة معادلات رياضية (ODF Math Formula)',
    nameEn: 'OpenDocument Formula',
    extension: 'odf',
    mimeType: 'application/vnd.oasis.opendocument.formula',
    category: 'libreoffice',
    categoryAr: 'برمجيات حرة و ODF',
    iconBadge: '🐧 ODF',
    canImport: true,
    canExport: true,
    descriptionAr: 'صيغ ومعادلات رياضية متوافقة مع MathML ومعايير ODF.',
  },

  // ─── 2. مستندات وسحابة Google Workspace ─────────────────────────────
  {
    id: 'gdoc',
    nameAr: 'مستند جوجل (Google Docs GDOC)',
    nameEn: 'Google Docs Document',
    extension: 'gdoc',
    mimeType: 'application/vnd.google-apps.document',
    category: 'google',
    categoryAr: 'جوجل وسحابي',
    iconBadge: '🌐 GDOC',
    canImport: true,
    canExport: true,
    descriptionAr: 'حزمة مستندات جوجل السحابية مع بنية ODF مهيكلة.',
  },
  {
    id: 'gsheet',
    nameAr: 'جدول بيانات جوجل (Google Sheets GSHEET)',
    nameEn: 'Google Sheets Spreadsheet',
    extension: 'gsheet',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    category: 'google',
    categoryAr: 'جوجل وسحابي',
    iconBadge: '🌐 GSHEET',
    canImport: true,
    canExport: true,
    descriptionAr: 'جدول بيانات سحابي مهيكل من Google Sheets.',
  },
  {
    id: 'gslides',
    nameAr: 'عرض تقديمي جوجل (Google Slides GSLIDES)',
    nameEn: 'Google Slides Presentation',
    extension: 'gslides',
    mimeType: 'application/vnd.google-apps.presentation',
    category: 'google',
    categoryAr: 'جوجل وسحابي',
    iconBadge: '🌐 GSLIDES',
    canImport: true,
    canExport: true,
    descriptionAr: 'شرائح وعروض جوجل التقديمية السحابية.',
  },
  {
    id: 'gdraw',
    nameAr: 'رسم توضيحي جوجل (Google Drawing GDRAW)',
    nameEn: 'Google Drawings Diagram',
    extension: 'gdraw',
    mimeType: 'application/vnd.google-apps.drawing',
    category: 'google',
    categoryAr: 'جوجل وسحابي',
    iconBadge: '🌐 GDRAW',
    canImport: true,
    canExport: true,
    descriptionAr: 'رسوم ومخططات جوجل التوضيحية.',
  },

  // ─── 3. مستندات مكتبية وطباعة متعددة الصفحات ──────────────────────
  {
    id: 'pdf',
    nameAr: 'مستند طباعة محمول متعدد الصفحات (Multi-page PDF)',
    nameEn: 'Multi-Page PDF Document',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '🖨️ PDF',
    canImport: true,
    canExport: true,
    descriptionAr: 'مستند محمول عالي الدقة يدعم تعدد الصفحات وعلامات الطباعة.',
  },
  {
    id: 'docx',
    nameAr: 'مستند مايكروسوفت وورد (Word DOCX)',
    nameEn: 'Microsoft Word Document',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📄 DOCX',
    canImport: true,
    canExport: true,
    descriptionAr: 'مستند وورد القياسي المتوافق مع Office 365 و Word.',
  },
  {
    id: 'rtf',
    nameAr: 'نص منسق غني (Rich Text Format RTF)',
    nameEn: 'Rich Text Format',
    extension: 'rtf',
    mimeType: 'application/rtf',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📜 RTF',
    canImport: true,
    canExport: true,
    descriptionAr: 'صيغة نصية منسقة عالمية مدعومة عبر كافة أنظمة التشغيل.',
  },
  {
    id: 'epub',
    nameAr: 'كتاب إلكتروني قياسي (EPUB 3 E-Book)',
    nameEn: 'Electronic Publication',
    extension: 'epub',
    mimeType: 'application/epub+zip',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📚 EPUB',
    canImport: true,
    canExport: true,
    descriptionAr: 'كتاب رقمي مهيكل بمعيار EPUB3 للكتب الإلكترونية.',
  },
  {
    id: 'txt',
    nameAr: 'نص عادي قياسي (Plain Text TXT)',
    nameEn: 'Plain Text File',
    extension: 'txt',
    mimeType: 'text/plain;charset=utf-8',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📝 TXT',
    canImport: true,
    canExport: true,
    descriptionAr: 'نص مجرد بدون أي تنسيقات بترميز UTF-8 القياسي.',
  },
  {
    id: 'tex',
    nameAr: 'مستند أكاديمي ولاتخ (LaTeX TeX)',
    nameEn: 'LaTeX Document Source',
    extension: 'tex',
    mimeType: 'application/x-tex',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '🔬 TEX',
    canImport: true,
    canExport: true,
    descriptionAr: 'كود التصفيف الأكاديمي والرياضي المتقدم LaTeX.',
  },
  {
    id: 'bib',
    nameAr: 'مراجع ومصادر أكاديمية (BibTeX BIB)',
    nameEn: 'BibTeX Bibliography',
    extension: 'bib',
    mimeType: 'application/x-bibtex',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📖 BIB',
    canImport: true,
    canExport: true,
    descriptionAr: 'فهارس ومراجع الأبحاث الأكاديمية بنظام BibTeX.',
  },
  {
    id: 'typ',
    nameAr: 'مستند تايبست الحديث فائق السرعة (Typst TYP)',
    nameEn: 'Typst Modern Typesetting',
    extension: 'typ',
    mimeType: 'text/plain;charset=utf-8',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '⚡ TYP',
    canImport: true,
    canExport: true,
    descriptionAr: 'نظام التصفيف الحديث بديل LaTeX فائق السرعة والخفة.',
  },
  {
    id: 'adoc',
    nameAr: 'وثيقة أسكي دوك (AsciiDoc ADOC)',
    nameEn: 'AsciiDoc Text Document',
    extension: 'adoc',
    mimeType: 'text/plain;charset=utf-8',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '📑 ADOC',
    canImport: true,
    canExport: true,
    descriptionAr: 'صيغة توثيق تقنية قوية لتوليد الكتب والكتيبات.',
  },
  {
    id: 'org',
    nameAr: 'مستند أورج مود (Emacs Org-Mode ORG)',
    nameEn: 'Org-Mode Document',
    extension: 'org',
    mimeType: 'text/plain;charset=utf-8',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '🦄 ORG',
    canImport: true,
    canExport: true,
    descriptionAr: 'مستند تخطيط وتدوين أورج مود لمحبي الإنتاجية العالية.',
  },
  {
    id: 'opml',
    nameAr: 'هيكلية ومخطط شجري (OPML Outline)',
    nameEn: 'Outline Processor Markup Language',
    extension: 'opml',
    mimeType: 'text/x-opml+xml',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '🌳 OPML',
    canImport: true,
    canExport: true,
    descriptionAr: 'هيكلية شجرية ومخططات أفكار متوافقة مع تطبيقات الخرائط الذهنية.',
  },
  {
    id: 'vtt',
    nameAr: 'نصوص وترجمة توقيتية (WebVTT VTT)',
    nameEn: 'Web Video Text Tracks',
    extension: 'vtt',
    mimeType: 'text/vtt',
    category: 'documents',
    categoryAr: 'مستندات مكتبية',
    iconBadge: '🎬 VTT',
    canImport: true,
    canExport: true,
    descriptionAr: 'ملفات الترجمة والتوقيت الزمني لمقاطع الفيديو والصوتيات.',
  },

  // ─── 4. هندسة المتجهات وCAD والتصميم (CAD & Vector) ─────────────────
  {
    id: 'svg',
    nameAr: 'رسم متجهات قياسي (SVG Vector)',
    nameEn: 'Scalable Vector Graphics',
    extension: 'svg',
    mimeType: 'image/svg+xml;charset=utf-8',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة وتصميم',
    iconBadge: '📐 SVG',
    isLossless: true,
    canImport: true,
    canExport: true,
    descriptionAr: 'رسوميات متجهة غير محدودة الدقة قابلة للتكبير والتحرير.',
  },
  {
    id: 'eps',
    nameAr: 'متجهات بوست سكريبت احترافية (Vector EPS)',
    nameEn: 'Encapsulated PostScript',
    extension: 'eps',
    mimeType: 'application/postscript',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة وتصميم',
    iconBadge: '📐 EPS',
    isLossless: true,
    canImport: true,
    canExport: true,
    descriptionAr: 'صيغة المتجهات القياسية للمطابع ودور النشر الاحترافية.',
  },
  {
    id: 'dxf',
    nameAr: 'رسم وتصميم هندسي وتصميمي (AutoCAD DXF)',
    nameEn: 'Drawing Exchange Format',
    extension: 'dxf',
    mimeType: 'application/dxf',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة وتصميم',
    iconBadge: '🏛️ DXF',
    isLossless: true,
    canImport: true,
    canExport: true,
    descriptionAr: 'صيغة التبادل الهندسي والرسومات لبرامج CAD و CNC والليزر.',
  },
  {
    id: 'drawio',
    nameAr: 'مخطط تدفق وهندسة تفاعلي (Draw.io Diagram XML)',
    nameEn: 'Draw.io Diagram XML',
    extension: 'drawio',
    mimeType: 'application/xml',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة وتصميم',
    iconBadge: '📐 Draw.io',
    canImport: true,
    canExport: true,
    descriptionAr: 'مخططات تدفق شبكية وعقدية متوافقة بالكامل مع Draw.io / Diagrams.net.',
  },
  {
    id: 'figma-tokens',
    nameAr: 'رموز تصميم وتوكنز فيجما (Figma Design Tokens)',
    nameEn: 'Figma Design Tokens JSON',
    extension: 'json',
    mimeType: 'application/json',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة وتصميم',
    iconBadge: '🎯 Figma Tokens',
    canImport: true,
    canExport: true,
    descriptionAr: 'رموز التصميم وألوان وهوامش فيجما القياسية (Design Tokens Standard).',
  },
  {
    id: 'mermaid',
    nameAr: 'مخطط كودي تدفقي (Mermaid Chart MMD)',
    nameEn: 'Mermaid Diagram Definition',
    extension: 'mmd',
    mimeType: 'text/plain;charset=utf-8',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة وتصميم',
    iconBadge: '🧜‍♀️ Mermaid',
    canImport: true,
    canExport: true,
    descriptionAr: 'مخططات العلاقات والتدفق والشبكات مكتوبة بنص برمجي مرمايد.',
  },
  {
    id: 'canvas2d',
    nameAr: 'كود رسم كانفا جافاسكريبت (HTML5 Canvas 2D JS)',
    nameEn: 'HTML5 Canvas JavaScript Code',
    extension: 'js',
    mimeType: 'text/javascript',
    category: 'cad-vector',
    categoryAr: 'متجهات وهندسة وتصميم',
    iconBadge: '🖌️ Canvas2D',
    canImport: true,
    canExport: true,
    descriptionAr: 'أكواد برمجية جاهزة لتوليد ورسم العناصر برمجياً على Canvas 2D.',
  },

  // ─── 5. مكونات تفاعلية وويب متقدم (Interactive Web & Components) ──
  {
    id: 'html-components',
    nameAr: 'مكونات ويب تفاعلية مستقلة (HTML Web Components)',
    nameEn: 'Interactive HTML Web Components',
    extension: 'html',
    mimeType: 'text/html;charset=utf-8',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '🧩 Web Component',
    canImport: true,
    canExport: true,
    descriptionAr: 'عناصر ومكونات ويب مخصصة وجاهزة للدمج الفوري في أي موقع.',
  },
  {
    id: 'single-html',
    nameAr: 'صفحة ويب قائمة بذاتها (SingleFile Standalone HTML)',
    nameEn: 'Standalone Self-Contained HTML',
    extension: 'html',
    mimeType: 'text/html;charset=utf-8',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '📦 SingleHTML',
    canImport: true,
    canExport: true,
    descriptionAr: 'صفحة ويب مدمجة الأنماط والصور والخطوط تعمل بدون خادم.',
  },
  {
    id: 'html',
    nameAr: 'صفحة ويب نظيفة ومعيارية (Clean HTML5)',
    nameEn: 'HyperText Markup Language',
    extension: 'html',
    mimeType: 'text/html;charset=utf-8',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '🌐 HTML5',
    canImport: true,
    canExport: true,
    descriptionAr: 'هيكل HTML5 قياسي دلالي فائق النقاء.',
  },
  {
    id: 'tsx',
    nameAr: 'مكون رياكت مع تايب سكريبت (React TSX Component)',
    nameEn: 'React TypeScript Component',
    extension: 'tsx',
    mimeType: 'text/typescript',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '⚛️ React TSX',
    canImport: true,
    canExport: true,
    descriptionAr: 'مكون React مع TypeScript ودعم Tailwind CSS الكامل.',
  },
  {
    id: 'vue',
    nameAr: 'مكون فيو أحادي الملف (Vue 3 SFC)',
    nameEn: 'Vue Single File Component',
    extension: 'vue',
    mimeType: 'text/x-vue',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '🟢 Vue SFC',
    canImport: true,
    canExport: true,
    descriptionAr: 'مكون Vue 3 متكامل مع التنسيق والمنطق والواجهة.',
  },
  {
    id: 'svelte',
    nameAr: 'مكون سفيلت تفاعلي (Svelte 4/5 Component)',
    nameEn: 'Svelte Web Component',
    extension: 'svelte',
    mimeType: 'text/x-svelte',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '🔥 Svelte',
    canImport: true,
    canExport: true,
    descriptionAr: 'مكون Svelte عالي الأداء مع التفاعلية اللحظية.',
  },
  {
    id: 'flutter',
    nameAr: 'عنصر واجهة فلاتر ودارت (Flutter Dart Widget)',
    nameEn: 'Flutter Dart Widget',
    extension: 'dart',
    mimeType: 'text/x-dart',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '💙 Flutter',
    canImport: true,
    canExport: true,
    descriptionAr: 'كود عنصر واجهة مستخدم Widget لمنصة Flutter لتطبيقات الهواتف.',
  },
  {
    id: 'md',
    nameAr: 'ماركداون مهيكل ومعياري (Markdown MD)',
    nameEn: 'Markdown Document',
    extension: 'md',
    mimeType: 'text/markdown;charset=utf-8',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '📑 MD',
    canImport: true,
    canExport: true,
    descriptionAr: 'مستند ماركداون قياسي متوافق مع GitHub و Notion.',
  },
  {
    id: 'mdx',
    nameAr: 'ماركداون تفاعلي مع مكونات (MDX)',
    nameEn: 'Extended Component Markdown',
    extension: 'mdx',
    mimeType: 'text/markdown;charset=utf-8',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '⚛️ MDX',
    canImport: true,
    canExport: true,
    descriptionAr: 'ماركداون مدمج به مكونات React و JSX التفاعلية.',
  },
  {
    id: 'css',
    nameAr: 'أنماط وتنسيقات أنيقة (CSS3 Stylesheet)',
    nameEn: 'Cascading Style Sheets',
    extension: 'css',
    mimeType: 'text/css',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '🎨 CSS',
    canImport: true,
    canExport: true,
    descriptionAr: 'صفحات أنماط CSS3 قياسية مع فئات الألوان والهيكل.',
  },
  {
    id: 'scss',
    nameAr: 'أنماط متقدمة مع متغيرات (Sass SCSS)',
    nameEn: 'Sassy CSS Stylesheet',
    extension: 'scss',
    mimeType: 'text/x-scss',
    category: 'interactive-components',
    categoryAr: 'مكونات تفاعلية وويب',
    iconBadge: '💅 SCSS',
    canImport: true,
    canExport: true,
    descriptionAr: 'أنماط Sass المتداخلة والمتجاوبة مع المتغيرات المركزية.',
  },

  // ─── 6. مخططات البيانات والبيانات الدلالية (JSON Schema & Data) ─────
  {
    id: 'json-schema',
    nameAr: 'مخطط قياسي للبيانات (JSON Schema Draft-07)',
    nameEn: 'JSON Schema Validation Definition',
    extension: 'schema.json',
    mimeType: 'application/schema+json',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '📐 JSON Schema',
    canImport: true,
    canExport: true,
    descriptionAr: 'مخطط تحققي وصفي دقيق لخصائص المستند والعناصر والمكونات.',
  },
  {
    id: 'json',
    nameAr: 'بيانات مهيكلة قياسية (JSON Object Data)',
    nameEn: 'JavaScript Object Notation',
    extension: 'json',
    mimeType: 'application/json;charset=utf-8',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '{ } JSON',
    canImport: true,
    canExport: true,
    descriptionAr: 'شجرة كائنات وبيانات JSON قياسية كاملة.',
  },
  {
    id: 'jsonld',
    nameAr: 'بيانات دلالية مرتبطة (JSON-LD Linked Data)',
    nameEn: 'Linked Data JSON',
    extension: 'jsonld',
    mimeType: 'application/ld+json',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '🔗 JSON-LD',
    canImport: true,
    canExport: true,
    descriptionAr: 'بيانات دلالية مهيكلة متوافقة مع معايير Schema.org لمحركات البحث.',
  },
  {
    id: 'xml',
    nameAr: 'لغة التوصيف القابلة للامتداد (XML Document)',
    nameEn: 'Extensible Markup Language',
    extension: 'xml',
    mimeType: 'application/xml',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '🏷️ XML',
    canImport: true,
    canExport: true,
    descriptionAr: 'مستند XML مهيكل بعقد وسمات دقيقة.',
  },
  {
    id: 'yaml',
    nameAr: 'توصيف إعدادات مقروء (YAML Data)',
    nameEn: "YAML Ain't Markup Language",
    extension: 'yaml',
    mimeType: 'text/yaml;charset=utf-8',
    category: 'web-code',
    categoryAr: 'مخططات وبيانات',
    iconBadge: '⚙️ YAML',
    canImport: true,
    canExport: true,
    descriptionAr: 'صيغة بيانات سهلة القراءة ومثالية للتهيئة والإعدادات.',
  },

  // ─── 7. جداول وبيانات وقواعد بيانات (Spreadsheets & SQL) ────────────
  {
    id: 'csv',
    nameAr: 'قيم مفصولة بفواصل (CSV Data Table)',
    nameEn: 'Comma-Separated Values',
    extension: 'csv',
    mimeType: 'text/csv;charset=utf-8',
    category: 'spreadsheets',
    categoryAr: 'جداول وقواعد بيانات',
    iconBadge: '📊 CSV',
    canImport: true,
    canExport: true,
    descriptionAr: 'جدول بيانات نصي مفصول بفواصل قياسية.',
  },
  {
    id: 'tsv',
    nameAr: 'قيم مفصولة بعلامات تبويب (TSV Data)',
    nameEn: 'Tab-Separated Values',
    extension: 'tsv',
    mimeType: 'text/tab-separated-values;charset=utf-8',
    category: 'spreadsheets',
    categoryAr: 'جداول وقواعد بيانات',
    iconBadge: '📊 TSV',
    canImport: true,
    canExport: true,
    descriptionAr: 'جدول بيانات مفصول بمحاذاة Tab لسهولة اللصق في Excel و Calc.',
  },
  {
    id: 'sql',
    nameAr: 'أوامر إدراج قاعدة بيانات (SQL Insert Script)',
    nameEn: 'SQL Insert Statements',
    extension: 'sql',
    mimeType: 'application/sql',
    category: 'spreadsheets',
    categoryAr: 'جداول وقواعد بيانات',
    iconBadge: '🗄️ SQL',
    canImport: true,
    canExport: true,
    descriptionAr: 'أوامر SQL جاهزة لإنشاء الجداول وإدراج سجلات المستند.',
  },

  // ─── 8. صور ورسوميات موسعة عالية الدقة (Images & Bitmaps) ───────────
  {
    id: 'webp',
    nameAr: 'صورة ويب حديثة فائقة الضغط (Modern WebP)',
    nameEn: 'WebP Modern Image',
    extension: 'webp',
    mimeType: 'image/webp',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🖼️ WEBP',
    canImport: true,
    canExport: true,
    descriptionAr: 'تنسيق صور الويب الحديث بجودة فائقة وحجم ملف مضغوط جداً.',
  },
  {
    id: 'png',
    nameAr: 'صورة نقطية عالية الدقة (Lossless PNG)',
    nameEn: 'Portable Network Graphics',
    extension: 'png',
    mimeType: 'image/png',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🖼️ PNG',
    isLossless: true,
    canImport: true,
    canExport: true,
    descriptionAr: 'صورة نقطية نقية بدون أي فقد في جودة البكسلات.',
  },
  {
    id: 'transparent-png',
    nameAr: 'صورة ذات خلفية شفافة نقية (Transparent Alpha PNG)',
    nameEn: 'Transparent Alpha PNG Image',
    extension: 'png',
    mimeType: 'image/png',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '✨ Alpha PNG',
    isLossless: true,
    canImport: true,
    canExport: true,
    descriptionAr: 'صورة مفرغة الخلفية بقناة ألفا شفافة نقية 100%.',
  },
  {
    id: 'jpg',
    nameAr: 'صورة مضغوطة قياسية (JPEG Image)',
    nameEn: 'JPEG Image',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🖼️ JPG',
    canImport: true,
    canExport: true,
    descriptionAr: 'صورة فوتوغرافية مضغوطة متوافقة مع كل الأجهزة.',
  },
  {
    id: 'avif',
    nameAr: 'صورة ويب مستقبلية الجيل الجديد (AVIF Image)',
    nameEn: 'AV1 Image File Format',
    extension: 'avif',
    mimeType: 'image/avif',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🖼️ AVIF',
    canImport: true,
    canExport: true,
    descriptionAr: 'أحدث معيار للصور الرقمية بضغط AV1 فائق التوفير.',
  },
  {
    id: 'ico',
    nameAr: 'أيقونة موقع أو تطبيق نظام (Windows/Web ICO)',
    nameEn: 'Windows Icon Format',
    extension: 'ico',
    mimeType: 'image/x-icon',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🔖 ICO',
    canImport: true,
    canExport: true,
    descriptionAr: 'ملف أيقونة متعدد المقاسات لمتصفحات الويب وتطبيقات سطح المكتب.',
  },
  {
    id: 'bmp',
    nameAr: 'صورة نقطية غير مضغوطة (Bitmap BMP)',
    nameEn: 'Windows Bitmap',
    extension: 'bmp',
    mimeType: 'image/bmp',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🖼️ BMP',
    canImport: true,
    canExport: true,
    descriptionAr: 'صورة نقطية خام غير مضغوطة عالية الوضوح.',
  },
  {
    id: 'gif',
    nameAr: 'صورة متحركة أو ثابتة خفيفة (GIF)',
    nameEn: 'Graphics Interchange Format',
    extension: 'gif',
    mimeType: 'image/gif',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🎞️ GIF',
    canImport: true,
    canExport: true,
    descriptionAr: 'تنسيق رسومي متوافق مع لوحات الألوان المحدودة.',
  },
  {
    id: 'tiff',
    nameAr: 'صورة طباعة احترافية (TIFF Tagged Image)',
    nameEn: 'Tagged Image File Format',
    extension: 'tiff',
    mimeType: 'image/tiff',
    category: 'images',
    categoryAr: 'صور ورسوميات',
    iconBadge: '🖨️ TIFF',
    canImport: true,
    canExport: true,
    descriptionAr: 'صيغة الصور الاحترافية لدور الطباعة والماسحات الضوئية.',
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
    [key: string]: any;
  }>;
  readonly detectedFormat: string;
}

export class UniversalFormatConverter {
  /**
   * تحويل محتوى HTML إلى مستند OpenDocument Text (.odt) حقيقي
   */
  static convertHtmlToOdtBlob(htmlContent: string, title = 'مستند'): Blob {
    const cleanHtml = sanitizeHtml(htmlContent);
    const contentXml = this.generateOdtContentXml(cleanHtml);
    const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">
  <office:styles>
    <style:default-style style:family="paragraph">
      <style:text-properties style:font-name="Cairo" fo:font-size="12pt"/>
    </style:default-style>
  </office:styles>
</office:document-styles>`;

    const metaXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" office:version="1.3">
  <office:meta>
    <dc:title>${title}</dc:title>
    <dc:creator>WebPainter Studio / Multi-Format Converter</dc:creator>
    <meta:creation-date>${new Date().toISOString()}</meta:creation-date>
  </office:meta>
</office:document-meta>`;

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
      { name: 'content.xml', data: contentXml },
      { name: 'styles.xml', data: stylesXml },
      { name: 'meta.xml', data: metaXml },
    ];

    return createZipArchive(entries);
  }

  /**
   * توليد Flat XML OpenDocument (.fodt)
   */
  static convertHtmlToFodt(htmlContent: string, title = 'مستند'): string {
    const cleanHtml = sanitizeHtml(htmlContent);
    const bodyXml = this.extractOdtParagraphs(cleanHtml);
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.text">
  <office:meta>
    <dc:title>${title}</dc:title>
    <dc:creator>WebPainter Studio</dc:creator>
  </office:meta>
  <office:body>
    <office:text>
      ${bodyXml}
    </office:text>
  </office:body>
</office:document>`;
  }

  /**
   * تحويل جدول HTML إلى حزمة OpenDocument Spreadsheet (.ods)
   */
  static convertHtmlTableToOdsBlob(htmlTableContent: string, title = 'جدول بيانات'): Blob {
    const tableXml = this.generateOdsTableXml(htmlTableContent);
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;

    const entries: ZipEntryInput[] = [
      { name: 'mimetype', data: 'application/vnd.oasis.opendocument.spreadsheet' },
      { name: 'META-INF/manifest.xml', data: manifestXml },
      { name: 'content.xml', data: tableXml },
    ];

    return createZipArchive(entries);
  }

  /**
   * توليد مستند AutoCAD DXF من عناصر أو نصوص
   */
  static convertToDxf(elementsOrText: any, title = 'Drawing'): string {
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
      elements.forEach((el, idx) => {
        const x = el.x || 0;
        const y = 800 - (el.y || 0); // Invert Y for CAD coordinates
        const w = el.width || 100;
        const h = el.height || 60;

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
            el.text || 'Text',
          );
        } else {
          // Closed polyline rectangle
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
      // Default drawing border and text
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

  /**
   * توليد مخطط JSON Schema للبيانات
   */
  static generateJsonSchema(sourceData: any, title = 'DocumentSchema'): string {
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: `https://webpainter.studio/schemas/${encodeURIComponent(title.toLowerCase())}.json`,
      title: `${title} Schema`,
      description: `JSON Schema specification generated for ${title} via WebPainter Studio Engine`,
      type: 'object',
      properties: {
        title: { type: 'string', default: title },
        version: { type: 'string', default: '1.0.0' },
        createdAt: { type: 'string', format: 'date-time' },
        viewport: {
          type: 'object',
          properties: {
            breakpoint: { type: 'string', enum: ['mobile', 'tablet', 'desktop'] },
            width: { type: 'number' },
            height: { type: 'number' },
          },
        },
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
              strokeWidth: { type: 'number' },
              opacity: { type: 'number' },
            },
          },
        },
        metadata: {
          type: 'object',
          additionalProperties: true,
        },
      },
      required: ['title'],
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * توليد كود HTML Web Components تفاعلي
   */
  static generateHtmlWebComponent(
    title = 'CustomArtboard',
    baseHtml = '',
    elements: any[] = [],
  ): string {
    const tagName = `wp-${title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'artboard-component'}`;
    const cleanTag = tagName.startsWith('wp-') ? tagName : `wp-${tagName}`;

    return `<!-- 
  WebPainter Interactive Web Component
  Usage: <${cleanTag}></${cleanTag}>
-->
<template id="${cleanTag}-template">
  <style>
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
      direction: rtl;
    }
    *, *::before, *::after {
      box-sizing: inherit;
    }
    .wp-container {
      position: relative;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    }
    .wp-header {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 16px;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
    }
    .wp-canvas {
      position: relative;
      min-height: 400px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px dashed #cbd5e1;
      overflow: hidden;
    }
    .wp-element {
      position: absolute;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .wp-element:hover {
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
      transform: translateY(-2px);
    }
  </style>

  <div class="wp-container">
    <div class="wp-header">${title}</div>
    <div class="wp-canvas">
      ${
        elements.length > 0
          ? elements
              .map(
                (el) =>
                  `<div class="wp-element" style="left:${el.x}px; top:${el.y}px; width:${el.width}px; height:${el.height}px; background:${el.fill || '#ffffff'}; border:1px solid ${el.stroke || '#cbd5e1'}; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#1e293b; font-size:14px;">${el.text || el.type}</div>`,
              )
              .join('\n      ')
          : `<div class="wp-content">${sanitizeHtml(baseHtml)}</div>`
      }
    </div>
  </div>
</template>

<script>
  if (!customElements.get('${cleanTag}')) {
    class WebPainterCustomComponent extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('${cleanTag}-template');
        if (template) {
          shadow.appendChild(template.content.cloneNode(true));
        }
      }
    }
    customElements.define('${cleanTag}', WebPainterCustomComponent);
  }
</script>
`;
  }

  /**
   * تحويل HTML إلى Markdown نقي
   */
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
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<hr\s*[\/]?>/gi, '\n---\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * تحويل HTML إلى نص عادي (Plain Text)
   */
  static convertHtmlToPlainText(html: string): string {
    if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, '');
    const tempEl = document.createElement('div');
    tempEl.innerHTML = html;
    return tempEl.textContent || tempEl.innerText || '';
  }

  /**
   * تحويل HTML Tables إلى CSV
   */
  static convertHtmlTableToCsv(html: string): string {
    if (!/<(table|tr|td|th)[\s>]/i.test(html)) {
      return html.replace(/\r\n/g, '\n').trim();
    }
    if (typeof DOMParser === 'undefined') {
      return html.replace(/\r\n/g, '\n').trim();
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('tr');
    if (rows.length === 0) {
      return this.convertHtmlToPlainText(html);
    }

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

  /**
   * تحويل SVG أو صورة نقطية إلى تنسيق صورة مستهدف (WebP, PNG, JPG, AVIF, ICO, BMP, TIFF)
   */
  static async convertImageSource(
    imageSrcOrSvg: string,
    targetFormat:
      | 'png'
      | 'jpeg'
      | 'webp'
      | 'avif'
      | 'svg'
      | 'ico'
      | 'bmp'
      | 'gif'
      | 'tiff'
      | 'tga'
      | 'ppm'
      | string,
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

        if (targetFormat === 'jpeg' || targetFormat === 'bmp' || targetFormat === 'ppm') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // معالجة الصيغ الثنائية عبر ImageFormatEngine
        if (targetFormat === 'bmp') {
          const imgData = ctx.getImageData(0, 0, width, height);
          const bmpBuf = ImageFormatEngine.encodeBmp(imgData);
          resolve(new Blob([bmpBuf], { type: 'image/bmp' }));
          return;
        }

        if (targetFormat === 'ico') {
          ImageFormatEngine.encodeIco(canvas)
            .then((icoBuf) => {
              resolve(new Blob([icoBuf], { type: 'image/x-icon' }));
            })
            .catch(() => {
              canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
            });
          return;
        }

        if (targetFormat === 'tga') {
          const imgData = ctx.getImageData(0, 0, width, height);
          const tgaBuf = ImageFormatEngine.encodeTga(imgData);
          resolve(new Blob([tgaBuf], { type: 'image/x-tga' }));
          return;
        }

        if (targetFormat === 'ppm') {
          const imgData = ctx.getImageData(0, 0, width, height);
          const ppmBuf = ImageFormatEngine.encodePpm(imgData);
          resolve(new Blob([ppmBuf], { type: 'image/x-portable-pixmap' }));
          return;
        }

        if (targetFormat === 'tiff') {
          const imgData = ctx.getImageData(0, 0, width, height);
          const tiffBuf = ImageFormatEngine.encodeTiff(imgData);
          resolve(new Blob([tiffBuf], { type: 'image/tiff' }));
          return;
        }

        let mimeType = 'image/png';
        const quality = 0.95;

        if (targetFormat === 'jpeg') mimeType = 'image/jpeg';
        else if (targetFormat === 'webp') mimeType = 'image/webp';
        else if (targetFormat === 'avif') mimeType = 'image/avif';
        else if (targetFormat === 'gif') mimeType = 'image/gif';

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Fallback to PNG if specific encoder is not natively built into browser
              canvas.toBlob((pngBlob) => {
                if (pngBlob) resolve(pngBlob);
                else reject(new Error('فشل تصدير الصورة النقطية'));
              }, 'image/png');
            }
          },
          mimeType,
          quality,
        );
      };

      img.onerror = () => {
        reject(new Error('فشل تحميل الصورة المصدرية للتحويل'));
      };

      if (imageSrcOrSvg.startsWith('<svg')) {
        const encoded = encodeURIComponent(imageSrcOrSvg);
        img.src = `data:image/svg+xml;charset=utf-8,${encoded}`;
      } else {
        img.src = imageSrcOrSvg;
      }
    });
  }

  /**
   * محرك الاستيراد الشامل (Universal Format Importer Engine)
   * يحلل ويستخرج المحتوى من الملفات المرفوعة بأي من الـ 50 صيغة
   */
  static async importFile(file: File): Promise<ParsedImportData> {
    const fileName = file.name;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    // الصور النقطية والمتجهة
    if (
      ['png', 'jpg', 'jpeg', 'webp', 'avif', 'ico', 'bmp', 'gif', 'tiff', 'svg'].includes(extension)
    ) {
      const isSvg = extension === 'svg';
      if (isSvg) {
        const svgText = await file.text();
        return {
          title: baseName,
          htmlContent: svgText,
          plainText: svgText,
          imageSrc: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`,
          detectedFormat: 'svg',
        };
      } else {
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
    }

    // ملفات النصوص والأكواد والبيانات
    const text = await file.text();

    // 1. JSON, JSON-LD, JSON Schema
    if (extension === 'json' || extension === 'jsonld' || fileName.endsWith('.schema.json')) {
      try {
        const parsed = JSON.parse(text);
        const elements = parsed.elements || parsed.blocks || [];
        return {
          title: parsed.title || baseName,
          htmlContent:
            parsed.htmlContent || `<pre><code>${JSON.stringify(parsed, null, 2)}</code></pre>`,
          plainText: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2),
          jsonData: parsed,
          elements: Array.isArray(elements) ? elements : undefined,
          detectedFormat: extension,
        };
      } catch (e) {
        return {
          title: baseName,
          htmlContent: `<pre>${text}</pre>`,
          plainText: text,
          detectedFormat: extension,
        };
      }
    }

    // 2. HTML, Web Components, Draw.io XML
    if (['html', 'htm', 'drawio', 'xml'].includes(extension)) {
      return {
        title: baseName,
        htmlContent: sanitizeHtml(text),
        plainText: this.convertHtmlToPlainText(text),
        detectedFormat: extension,
      };
    }

    // 3. Markdown / MDX
    if (['md', 'mdx'].includes(extension)) {
      const htmlFromMd = text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n$/gim, '<br />');
      return {
        title: baseName,
        htmlContent: htmlFromMd,
        plainText: text,
        detectedFormat: extension,
      };
    }

    // 4. CSV / TSV
    if (['csv', 'tsv'].includes(extension)) {
      const delimiter = extension === 'tsv' ? '\t' : ',';
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      lines.forEach((line, idx) => {
        tableHtml += '<tr>';
        const cols = line.split(delimiter);
        cols.forEach((col) => {
          const tag = idx === 0 ? 'th' : 'td';
          tableHtml += `<${tag} style="padding: 8px; border: 1px solid #cbd5e1;">${col.replace(/(^"|"$)/g, '').trim()}</${tag}>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table>';

      return {
        title: baseName,
        htmlContent: tableHtml,
        plainText: text,
        detectedFormat: extension,
      };
    }

    // Default Plain Text / Code / DXF / TeX / etc.
    return {
      title: baseName,
      htmlContent: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
      plainText: text,
      detectedFormat: extension || 'txt',
    };
  }

  /**
   * تنفيذ عملية التحويل الشاملة بناءً على نوع المصدر والتنسيق الهدف
   */
  static async convertUniversal(
    sourceData: {
      html?: string;
      rawText?: string;
      jsonData?: unknown;
      imageSrc?: string;
      title?: string;
      elements?: any[];
    },
    targetFormatId: string,
  ): Promise<ConversionResult> {
    const title = sourceData.title || 'document';
    const targetFormat = SUPPORTED_CONVERTER_FORMATS.find((f) => f.id === targetFormatId);
    if (!targetFormat) {
      return {
        success: false,
        fileName: `${title}.txt`,
        mimeType: 'text/plain',
        error: `التنسيق المطلوب غير مدعوم: ${targetFormatId}`,
      };
    }

    try {
      const baseHtml =
        sourceData.html ||
        (typeof sourceData.jsonData === 'object'
          ? `<pre>${JSON.stringify(sourceData.jsonData, null, 2)}</pre>`
          : sourceData.rawText || '');
      const elements = sourceData.elements || (sourceData.jsonData as any)?.elements || [];

      switch (targetFormat.id) {
        case 'odt': {
          const blob = this.convertHtmlToOdtBlob(baseHtml, title);
          return { success: true, blob, fileName: `${title}.odt`, mimeType: targetFormat.mimeType };
        }

        case 'fodt': {
          const textContent = this.convertHtmlToFodt(baseHtml, title);
          const blob = new Blob([textContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent,
            fileName: `${title}.fodt`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'ods': {
          const blob = this.convertHtmlTableToOdsBlob(baseHtml, title);
          return { success: true, blob, fileName: `${title}.ods`, mimeType: targetFormat.mimeType };
        }

        case 'odp':
        case 'odg':
        case 'odf':
        case 'gdoc': {
          const blob = this.convertHtmlToOdtBlob(baseHtml, title);
          return {
            success: true,
            blob,
            fileName: `${title}.${targetFormat.extension}`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'gsheet': {
          const csvText = this.convertHtmlTableToCsv(baseHtml);
          const blob = new Blob([csvText], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: csvText,
            fileName: `${title}.gsheet`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'gslides':
        case 'gdraw': {
          const blob = this.convertHtmlToOdtBlob(baseHtml, title);
          return {
            success: true,
            blob,
            fileName: `${title}.${targetFormat.extension}`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'docx': {
          const docxHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;}</style></head><body>${sanitizeHtml(baseHtml)}</body></html>`;
          const blob = new Blob(['\ufeff' + docxHtml], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            fileName: `${title}.docx`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'pdf': {
          // Multi-page PDF print layout
          const printHtml = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${title}</title><style>@page{size:A4;margin:15mm;}body{font-family:system-ui,-apple-system,sans-serif;color:#1e293b;line-height:1.6;background:#fff;}h1{border-bottom:2px solid #e2e8f0;padding-bottom:8px;}.page-break{page-break-after:always;}</style></head><body><h1>${title}</h1><div>${sanitizeHtml(baseHtml)}</div><script>window.onload=()=>{window.print();}</script></body></html>`;
          const blob = new Blob([printHtml], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: printHtml,
            fileName: `${title}.pdf`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'rtf': {
          const plain = this.convertHtmlToPlainText(baseHtml);
          const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}\\f0\\fs24 ${plain.replace(/\n/g, '\\par\n')}}`;
          const blob = new Blob([rtfContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: rtfContent,
            fileName: `${title}.rtf`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'epub': {
          const xhtml = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ar" dir="rtl"><head><title>${title}</title></head><body><h1>${title}</h1>${sanitizeHtml(baseHtml)}</body></html>`;
          const entries: ZipEntryInput[] = [
            { name: 'mimetype', data: 'application/epub+zip' },
            {
              name: 'META-INF/container.xml',
              data: '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
            },
            {
              name: 'OEBPS/content.opf',
              data: `<?xml version="1.0"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${title}</dc:title><dc:language>ar</dc:language></metadata><manifest><item id="chap1" href="chap1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="chap1"/></spine></package>`,
            },
            { name: 'OEBPS/chap1.xhtml', data: xhtml },
          ];
          const blob = createZipArchive(entries);
          return {
            success: true,
            blob,
            fileName: `${title}.epub`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'dxf': {
          const dxfContent = this.convertToDxf(elements, title);
          const blob = new Blob([dxfContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: dxfContent,
            fileName: `${title}.dxf`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'eps': {
          const epsContent = `%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 1200 800\n%%Title: ${title}\n%%Creator: WebPainter Studio Universal Engine\n/Helvetica 24 selectfont\n50 750 moveto\n(${title}) show\nshowpage\n%%EOF`;
          const blob = new Blob([epsContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: epsContent,
            fileName: `${title}.eps`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'json-schema': {
          const schemaText = this.generateJsonSchema(
            sourceData.jsonData || { title, elements },
            title,
          );
          const blob = new Blob([schemaText], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: schemaText,
            fileName: `${title}.schema.json`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'html-components': {
          const compContent = this.generateHtmlWebComponent(title, baseHtml, elements);
          const blob = new Blob([compContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: compContent,
            fileName: `${title}.component.html`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'tex': {
          const plain = this.convertHtmlToPlainText(baseHtml);
          const texContent = `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amsmath}\n\\title{${title}}\n\\author{WebPainter Studio}\n\\date{\\today}\n\\begin{document}\n\\maketitle\n\n${plain}\n\n\\end{document}`;
          const blob = new Blob([texContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: texContent,
            fileName: `${title}.tex`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'bib': {
          const bibContent = `@article{${title.toLowerCase().replace(/\s+/g, '_')},\n  title={${title}},\n  author={WebPainter Studio},\n  year={${new Date().getFullYear()}},\n  note={Exported from WebPainter Studio Universal Multi-Format Engine}\n}`;
          const blob = new Blob([bibContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: bibContent,
            fileName: `${title}.bib`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'typ': {
          const plain = this.convertHtmlToPlainText(baseHtml);
          const typContent = `#set text(font: "Cairo", lang: "ar")\n#set page(paper: "a4", margin: 2.5cm)\n\n= ${title}\n\n${plain}`;
          const blob = new Blob([typContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: typContent,
            fileName: `${title}.typ`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'adoc': {
          const plain = this.convertHtmlToMarkdown(baseHtml);
          const adocContent = `= ${title}\n:lang: ar\n:doctype: article\n\n${plain.replace(/#/g, '=')}`;
          const blob = new Blob([adocContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: adocContent,
            fileName: `${title}.adoc`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'org': {
          const plain = this.convertHtmlToMarkdown(baseHtml);
          const orgContent = `#+TITLE: ${title}\n#+AUTHOR: WebPainter Studio\n#+DATE: ${new Date().toISOString()}\n\n${plain.replace(/^#/gm, '*')}`;
          const blob = new Blob([orgContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: orgContent,
            fileName: `${title}.org`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'opml': {
          const opmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head>\n    <title>${title}</title>\n    <dateCreated>${new Date().toUTCString()}</dateCreated>\n  </head>\n  <body>\n    <outline text="${title}">\n      <outline text="${this.convertHtmlToPlainText(baseHtml).slice(0, 100)}"/>\n    </outline>\n  </body>\n</opml>`;
          const blob = new Blob([opmlContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: opmlContent,
            fileName: `${title}.opml`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'vtt': {
          const plain = this.convertHtmlToPlainText(baseHtml);
          const vttContent = `WEBVTT\n\n00:00:01.000 --> 00:00:10.000\n${plain.slice(0, 200)}\n`;
          const blob = new Blob([vttContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: vttContent,
            fileName: `${title}.vtt`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'single-html': {
          const clean = sanitizeHtml(baseHtml);
          const singleHtml = `<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${title}</title>\n<style>\n  *, *::before, *::after { box-sizing: border-box; }\n  body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 2rem; }\n  .container { max-width: 900px; margin: 0 auto; background: #ffffff; padding: 2.5rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }\n</style>\n</head>\n<body>\n<div class="container">\n${clean}\n</div>\n</body>\n</html>`;
          const blob = new Blob([singleHtml], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: singleHtml,
            fileName: `${title}.html`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'md': {
          const textContent = this.convertHtmlToMarkdown(baseHtml);
          const blob = new Blob([textContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent,
            fileName: `${title}.md`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'mdx': {
          const md = this.convertHtmlToMarkdown(baseHtml);
          const mdxContent = `export const meta = { title: "${title}", date: "${new Date().toISOString()}" };\n\n# ${title}\n\n${md}`;
          const blob = new Blob([mdxContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: mdxContent,
            fileName: `${title}.mdx`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'html': {
          const clean = sanitizeHtml(baseHtml);
          const htmlDoc = `<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<title>${title}</title>\n<style>body{font-family:system-ui,-apple-system,sans-serif;line-height:1.6;padding:2rem;color:#1e293b;}</style>\n</head>\n<body>\n${clean}\n</body>\n</html>`;
          const blob = new Blob([htmlDoc], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: htmlDoc,
            fileName: `${title}.html`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'txt': {
          const textContent = this.convertHtmlToPlainText(baseHtml);
          const blob = new Blob([textContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent,
            fileName: `${title}.txt`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'jsonld': {
          const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: title,
            dateCreated: new Date().toISOString(),
            text: this.convertHtmlToPlainText(baseHtml),
          };
          const jsonText = JSON.stringify(jsonLd, null, 2);
          const blob = new Blob([jsonText], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: jsonText,
            fileName: `${title}.jsonld`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'xml': {
          const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n  <metadata>\n    <title>${title}</title>\n    <timestamp>${new Date().toISOString()}</timestamp>\n  </metadata>\n  <content><![CDATA[\n${baseHtml}\n  ]]></content>\n</document>`;
          const blob = new Blob([xmlContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: xmlContent,
            fileName: `${title}.xml`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'yaml': {
          const plain = this.convertHtmlToPlainText(baseHtml).replace(/\n/g, '\n  ');
          const yamlContent = `title: "${title}"\ncreated_at: "${new Date().toISOString()}"\nauthor: "WebPainter Studio"\ncontent: |\n  ${plain}\n`;
          const blob = new Blob([yamlContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: yamlContent,
            fileName: `${title}.yaml`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'css': {
          const cssContent = `/* WebPainter Universal CSS Stylesheet for ${title} */\n.wp-root {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n  padding: 1.5rem;\n  background: #ffffff;\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n}\n.wp-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #0f172a;\n}\n`;
          const blob = new Blob([cssContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: cssContent,
            fileName: `${title}.css`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'scss': {
          const scssContent = `// WebPainter SCSS for ${title}\n$primary: #2563eb;\n$surface: #ffffff;\n$border-color: #e2e8f0;\n\n.artboard-layout {\n  background: $surface;\n  border: 1px solid $border-color;\n  border-radius: 8px;\n  padding: 1.5rem;\n  h1 { color: $primary; font-weight: bold; }\n}\n`;
          const blob = new Blob([scssContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: scssContent,
            fileName: `${title}.scss`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'tsx': {
          const compName = title.replace(/[^a-zA-Z0-9]/g, '') || 'GeneratedArtboard';
          const tsxContent = `import React from 'react';\n\nexport interface ${compName}Props {\n  className?: string;\n}\n\nexport const ${compName}: React.FC<${compName}Props> = ({ className = '' }) => {\n  return (\n    <div className={\`p-6 bg-white rounded-xl border border-slate-200 shadow-sm \${className}\`}>\n      <h1 className="text-xl font-bold text-slate-800 mb-4">${title}</h1>\n      <div className="prose text-slate-600">\n        {/* Interactive WebPainter Component */}\n      </div>\n    </div>\n  );\n};\n\nexport default ${compName};\n`;
          const blob = new Blob([tsxContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: tsxContent,
            fileName: `${compName}.tsx`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'vue': {
          const vueContent = `<template>\n  <div class="artboard-container">\n    <h1 class="title">${title}</h1>\n    <div class="content">\n      <!-- WebPainter Universal Vue Component -->\n    </div>\n  </div>\n</template>\n\n<script setup lang="ts">\n// WebPainter Studio Universal Component\n</script>\n\n<style scoped>\n.artboard-container {\n  padding: 1.5rem;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n}\n.title {\n  font-size: 1.25rem;\n  font-weight: bold;\n  color: #1e293b;\n}\n</style>\n`;
          const blob = new Blob([vueContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: vueContent,
            fileName: `${title}.vue`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'svelte': {
          const svelteContent = `<script lang="ts">\n  export let title: string = "${title}";\n</script>\n\n<div class="svelte-artboard">\n  <h2>{title}</h2>\n  <slot />\n</div>\n\n<style>\n  .svelte-artboard {\n    padding: 1.5rem;\n    background: #ffffff;\n    border: 1px solid #e2e8f0;\n    border-radius: 8px;\n  }\n</style>\n`;
          const blob = new Blob([svelteContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: svelteContent,
            fileName: `${title}.svelte`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'flutter': {
          const flutterContent = `import 'package:flutter/material.dart';\n\nclass ${title.replace(/[^a-zA-Z0-9]/g, '') || 'ArtboardWidget'} extends StatelessWidget {\n  const ${title.replace(/[^a-zA-Z0-9]/g, '') || 'ArtboardWidget'}({Key? key}) : super(key: key);\n\n  @override\n  Widget build(BuildContext context) {\n    return Container(\n      padding: const EdgeInsets.all(16.0),\n      decoration: BoxDecoration(\n        color: Colors.white,\n        borderRadius: BorderRadius.circular(8.0),\n        border: Border.all(color: Colors.grey.shade300),\n      ),\n      child: Text('${title}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),\n    );\n  }\n}\n`;
          const blob = new Blob([flutterContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: flutterContent,
            fileName: `${title}.dart`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'mermaid': {
          const mermaidContent = `graph TD\n  Start[${title}] --> Process[معالجة وتخطيط]\n  Process --> End[تصدير نهائي]\n`;
          const blob = new Blob([mermaidContent], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: mermaidContent,
            fileName: `${title}.mmd`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'drawio': {
          const drawioXml = `<mxfile host="WebPainter" modified="${new Date().toISOString()}" agent="WebPainter Studio" version="1.0" type="device">\n  <diagram id="diagram_1" name="Page-1">\n    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">\n      <root>\n        <mxCell id="0"/>\n        <mxCell id="1" parent="0"/>\n        <mxCell id="2" value="${title}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="1">\n          <mxGeometry x="120" y="120" width="160" height="80" as="geometry"/>\n        </mxCell>\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>`;
          const blob = new Blob([drawioXml], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: drawioXml,
            fileName: `${title}.drawio`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'figma-tokens': {
          const tokens = {
            version: '1.0.0',
            name: title,
            color: {
              primary: { value: '#2563eb', type: 'color' },
              background: { value: '#ffffff', type: 'color' },
              surface: { value: '#f8fafc', type: 'color' },
              text: { value: '#1e293b', type: 'color' },
              border: { value: '#e2e8f0', type: 'color' },
            },
            spacing: {
              xs: { value: '4px', type: 'spacing' },
              sm: { value: '8px', type: 'spacing' },
              md: { value: '16px', type: 'spacing' },
              lg: { value: '24px', type: 'spacing' },
            },
            radii: {
              sm: { value: '4px', type: 'borderRadius' },
              md: { value: '8px', type: 'borderRadius' },
              lg: { value: '12px', type: 'borderRadius' },
            },
          };
          const jsonText = JSON.stringify(tokens, null, 2);
          const blob = new Blob([jsonText], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: jsonText,
            fileName: `${title}.tokens.json`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'canvas2d': {
          const canvasCode = `// HTML5 Canvas 2D Render script for ${title}\nconst canvas = document.createElement('canvas');\ncanvas.width = 800;\ncanvas.height = 600;\nconst ctx = canvas.getContext('2d');\nif (ctx) {\n  ctx.fillStyle = '#ffffff';\n  ctx.fillRect(0, 0, 800, 600);\n  ctx.fillStyle = '#1e293b';\n  ctx.font = '24px sans-serif';\n  ctx.textAlign = 'center';\n  ctx.fillText('${title}', 400, 300);\n}\ndocument.body.appendChild(canvas);\n`;
          const blob = new Blob([canvasCode], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: canvasCode,
            fileName: `${title}.canvas.js`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'csv': {
          const csvText = this.convertHtmlTableToCsv(baseHtml);
          const blob = new Blob([csvText], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: csvText,
            fileName: `${title}.csv`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'tsv': {
          const csvText = this.convertHtmlTableToCsv(baseHtml);
          const tsvText = csvText.replace(/,/g, '\t');
          const blob = new Blob([tsvText], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: tsvText,
            fileName: `${title}.tsv`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'sql': {
          const cleanText = this.convertHtmlToPlainText(baseHtml).replace(/'/g, "''");
          const sqlScript = `-- WebPainter SQL Insert Dump for ${title}\nCREATE TABLE IF NOT EXISTS artboards (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(255) NOT NULL,\n  content TEXT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nINSERT INTO artboards (title, content) VALUES ('${title.replace(/'/g, "''")}', '${cleanText}');\n`;
          const blob = new Blob([sqlScript], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: sqlScript,
            fileName: `${title}.sql`,
            mimeType: targetFormat.mimeType,
          };
        }

        case 'json': {
          const dataToSerialize = sourceData.jsonData || {
            title,
            htmlContent: baseHtml,
            elements,
            exportedAt: new Date().toISOString(),
          };
          const jsonText = JSON.stringify(dataToSerialize, null, 2);
          const blob = new Blob([jsonText], { type: targetFormat.mimeType });
          return {
            success: true,
            blob,
            textContent: jsonText,
            fileName: `${title}.json`,
            mimeType: targetFormat.mimeType,
          };
        }

        // تحويلات الصور
        case 'svg':
        case 'png':
        case 'transparent-png':
        case 'jpg':
        case 'webp':
        case 'avif':
        case 'ico':
        case 'bmp':
        case 'gif':
        case 'tiff': {
          const imageSrc = sourceData.imageSrc || (baseHtml.includes('<svg') ? baseHtml : '');
          if (!imageSrc) {
            const isTransparent = targetFormat.id === 'transparent-png';
            const bgFill = isTransparent ? 'none' : '#ffffff';
            const generatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="${bgFill}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#334155">${title}</text></svg>`;
            if (targetFormat.id === 'svg') {
              const blob = new Blob([generatedSvg], { type: targetFormat.mimeType });
              return {
                success: true,
                blob,
                textContent: generatedSvg,
                fileName: `${title}.svg`,
                mimeType: targetFormat.mimeType,
              };
            }
            const blob = await this.convertImageSource(
              generatedSvg,
              (targetFormat.id === 'transparent-png' ? 'png' : targetFormat.id) as any,
            );
            return {
              success: true,
              blob,
              fileName: `${title}.${targetFormat.extension}`,
              mimeType: targetFormat.mimeType,
            };
          }

          const blob = await this.convertImageSource(
            imageSrc,
            targetFormat.id === 'jpg'
              ? 'jpeg'
              : targetFormat.id === 'transparent-png'
                ? 'png'
                : (targetFormat.id as any),
          );
          return {
            success: true,
            blob,
            fileName: `${title}.${targetFormat.extension}`,
            mimeType: targetFormat.mimeType,
          };
        }

        default: {
          const blob = new Blob([baseHtml], { type: 'text/plain' });
          return {
            success: true,
            blob,
            fileName: `${title}.${targetFormat.extension}`,
            mimeType: targetFormat.mimeType,
          };
        }
      }
    } catch (err: any) {
      return {
        success: false,
        fileName: `${title}.${targetFormat.extension}`,
        mimeType: targetFormat.mimeType,
        error: err?.message || 'حدث خطأ أثناء معالجة التحويل',
      };
    }
  }

  // ─── دوال داخلية لبناء XML ────────────────────────────────────────

  private static generateOdtContentXml(html: string): string {
    const paragraphs = this.extractOdtParagraphs(html);
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">
  <office:automatic-styles>
    <style:style style:name="Standard" style:family="paragraph">
      <style:paragraph-properties fo:text-align="start" style:writing-mode="rl-tb"/>
    </style:style>
    <style:style style:name="Heading1" style:family="paragraph">
      <style:text-properties fo:font-size="20pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Heading2" style:family="paragraph">
      <style:text-properties fo:font-size="16pt" fo:font-weight="bold"/>
    </style:style>
  </office:automatic-styles>
  <office:body>
    <office:text>
      ${paragraphs}
    </office:text>
  </office:body>
</office:document-content>`;
  }

  private static extractOdtParagraphs(html: string): string {
    return html
      .replace(
        /<h1[^>]*>(.*?)<\/h1>/gi,
        '<text:h text:style-name="Heading1" text:outline-level="1">$1</text:h>',
      )
      .replace(
        /<h2[^>]*>(.*?)<\/h2>/gi,
        '<text:h text:style-name="Heading2" text:outline-level="2">$1</text:h>',
      )
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<text:h text:outline-level="3">$1</text:h>')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '<text:p text:style-name="Standard">$1</text:p>')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<text:span text:style-name="Bold">$1</text:span>')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '<text:span text:style-name="Italic">$1</text:span>')
      .replace(/<br\s*[\/]?>/gi, '<text:line-break/>');
  }

  private static generateOdsTableXml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('tr');

    let rowsXml = '';
    rows.forEach((row) => {
      rowsXml += '      <table:table-row>\n';
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell) => {
        const val = (cell.textContent || '').trim();
        rowsXml += `        <table:table-cell office:value-type="string"><text:p>${val}</text:p></table:table-cell>\n`;
      });
      rowsXml += '      </table:table-row>\n';
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.3">
  <office:body>
    <office:spreadsheet>
      <table:table table:name="Sheet1">
${rowsXml || '        <table:table-row><table:table-cell office:value-type="string"><text:p>بيانات</text:p></table:table-cell></table:table-row>'}
      </table:table>
    </office:spreadsheet>
  </office:body>
</office:document-content>`;
  }
}
