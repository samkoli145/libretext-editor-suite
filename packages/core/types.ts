/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: الأنواع ونماذج البيانات الأساسية لنظام إدارة المستندات - Core Types
 * 🏛️ الدور: نواة النظام - تعريف العقود والأنواع المشتركة لجميع المحررات الأربعة
 * 📥 المستهلك: كل ملفات المشروع (محررات، خدمات، محركات)
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

import type { ComponentType } from 'react';

/**
 * أنواع المستندات المعروفة داخل المشروع وصيغ التنسيقات المدعومة
 */
export type KnownDocumentType = 'rich-text' | 'ui-page' | 'canvas' | 'pdf';

/**
 * التنسيقات والامتدادات المدعومة في النظام
 */
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

/**
 * نموذج المستند داخل النظام.
 */
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

/**
 * الخصائص التي يستلمها محرر المستند.
 */
export interface EditorPluginProps<TData = unknown> {
  document: DocumentModel<TData>;
  onChange: (updated: DocumentModel<TData>) => void;
}

/**
 * تعريف أي Plugin داخل النظام.
 */
export interface EditorPlugin<TData = unknown> {
  id: string;
  name: string;
  documentType: DocumentType;
  iconName: string;
  fileExtensions: readonly string[];
  description: string;

  /**
   * مكوّن React المسؤول عن تحرير هذا النوع من المستندات.
   */
  renderEditor: ComponentType<EditorPluginProps<TData>>;

  /**
   * إنشاء مستند افتراضي جديد.
   */
  createDefaultDocument: (title?: string) => DocumentModel<TData>;

  /**
   * تحويل المستند إلى نص قابل للحفظ.
   */
  serialize: (document: DocumentModel<TData>) => string;

  /**
   * إعادة بناء المستند من نص محفوظ.
   */
  deserialize: (raw: string) => DocumentModel<TData>;
}

/**
 * خصائص التنسيق المشتركة بين المحررات (نصوص، خطوط، ألوان، محاذاة، أبعاد)
 */
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
