/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/core/src/types.ts
 * 🎯 الهدف الرئيسي: الأنواع ونماذج البيانات الأساسية لنظام إدارة المستندات
 * 📋 المعايير: صفر اعتماديات خارجية، أنواع مشتركة لجميع المحررات
 * 🧪 الاختبارات: N/A (تعريفات أنواع)
 * 🏷️ المعرف: CORE-018
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Contract-First Types: أنواع مبنية على العقود أولاً
 *    مع SharedFormattingState موحد عبر جميع المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأنواع يجب أن تبقى متوافقة مع جميع المحررات
 *    2. لا تكرار للتعريفات عبر الملفات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام TypeScript strict mode
 *    - fallback لأنواع افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type KnownDocumentType = 'rich-text' | 'ui-page' | 'canvas' | 'pdf';

export type SupportedFileFormat =
  | 'doc'
  | 'docx'
  | 'odt'
  | 'md'
  | 'markdown'
  | 'html'
  | 'htm'
  | 'txt'
  | 'pdf'
  | 'pdf.json'
  | 'canvas.json'
  | 'svg'
  | 'png'
  | 'ui.json'
  | 'tsx'
  | 'jsx'
  | 'json';

export type DocumentType = KnownDocumentType | (string & {});

export interface DocumentModel<TData = unknown> {
  id: string;
  type: DocumentType;
  title: string;
  fileExtension?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  data: TData;
}

export interface EditorPluginProps<TData = unknown> {
  document: DocumentModel<TData>;
  onChange: (updated: DocumentModel<TData>) => void;
}

export interface EditorPlugin<TData = unknown> {
  id: string;
  name: string;
  documentType: DocumentType;
  iconName: string;
  fileExtensions: readonly string[];
  description: string;
  renderEditor: (props: EditorPluginProps<TData>) => unknown;
  createDefaultDocument: (title?: string) => DocumentModel<TData>;
  serialize: (document: DocumentModel<TData>) => string;
  deserialize: (raw: string) => DocumentModel<TData>;
}

export interface SharedFormattingState {
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  lineHeight?: number | string;
  direction?: 'rtl' | 'ltr';
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}
