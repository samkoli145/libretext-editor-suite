/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نماذج البيانات الأساسية لمحرر PDF - PDF Core Model
 * 🏛️ الدور: نواة النظام - تعريف أنواع الصفحات والتعليقات والأختام
 * 📥 المستهلك: كل ملفات features/pdf
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    PDF Type Definitions: تعريفات أنواع PDF
 *    مع PdfAnnotationType و PdfPageStructure
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأنواع يجب أن تبقى متوافقة مع كل المكونات
 *    2. لا تكرار للتعريفات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - TypeScript strict mode
 *    - fallback لأنواع افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocumentLayer, GridPatternType } from '../shared/lib-core/document-pipeline/layer-document-compositor';
import type { FloatingImageItem } from '../shared/components/media/FloatingImageLayer';
import type { CalloutVariant } from '../shared/components/typography/AcademicCalloutBox';

export type PdfAnnotationType =
  | 'highlight'
  | 'text-note'
  | 'stamp'
  | 'shape'
  | 'drawing'
  | 'signature'
  | 'callout'
  | 'latex'
  | 'redaction'
  | 'image';

export type StampVariant =
  | 'approved'
  | 'confidential'
  | 'draft'
  | 'urgent'
  | 'reviewed'
  | 'official'
  | 'rejected'
  | 'excellent'
  | 'needs-review'
  | 'perfect-score';

export type ShapeGeometryType =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'ellipse'
  | 'arrow'
  | 'line';

export type BorderStrokeStyle = 'solid' | 'dashed' | 'dotted';

/**
 * Metadata configuration for Official Stamps & Verification Badges
 */
export interface PdfStampMetadata {
  variant: StampVariant;
  label: string;
  subText?: string;
  iconName?: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  rotation?: number; // angle in degrees, e.g. -5deg
  certifiedBy?: string;
  timestamp?: string;
}

/**
 * Text Box & Rich Annotation Properties
 */
export interface PdfTextBoxProperties {
  text: string;
  fontFamily?: string;
  fontSize?: number; // in pixels / pts
  fontWeight?: 'normal' | 'bold' | '600' | '700';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: BorderStrokeStyle;
  borderRadius?: number;
  padding?: number;
  lineHeight?: number;
  shadow?: boolean;
}

/**
 * Single PDF Annotation Item (Placed onto a page layer)
 */
export interface PdfAnnotation {
  id: string;
  type: PdfAnnotationType;
  pageNumber: number; // 1-indexed
  x: number; // Percentage coordinate (0 - 100)
  y: number; // Percentage coordinate (0 - 100)
  width?: number; // Percentage coordinate (0 - 100)
  height?: number; // Percentage coordinate (0 - 100)
  opacity?: number; // 0 to 1
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: BorderStrokeStyle;
  rotation?: number; // in degrees
  zIndex?: number;

  // Rich Text Box & Note Content
  textBox?: PdfTextBoxProperties;
  text?: string;
  author?: string;
  createdAt: string;
  updatedAt?: string;

  // Stamp Details
  stamp?: PdfStampMetadata;
  stampType?: StampVariant;

  // Shape Details
  shapeType?: ShapeGeometryType;
  points?: Array<{ x: number; y: number }>;

  // Image & Asset Placement
  imageUrl?: string;
  imageName?: string;

  // LaTeX & Academic Additions
  latexFormula?: string;
  calloutVariant?: CalloutVariant;
  calloutTitle?: string;
  isTeacherSolution?: boolean;
  isRedaction?: boolean;
  scoreGrade?: string;
}

/**
 * Page Structure Definition
 */
export interface PdfPageStructure {
  pageNumber: number; // 1-indexed
  title?: string;
  rotation: number; // 0, 90, 180, 270
  aspectRatio: number; // width / height (default A4 = 0.707)
  width?: number;
  height?: number;
  extractedText?: string;
  thumbnailUrl?: string;
  isBookmarked?: boolean;
  floatingImages?: FloatingImageItem[];
}

/**
 * Root PDF Document Data Model
 */
export interface PdfDocumentModel {
  fileName: string;
  fileSize?: number;
  totalPages: number;
  currentPage: number;
  zoom: number; // 50 to 300
  fitMode: 'fit-width' | 'fit-page' | 'manual';
  pages: PdfPageStructure[];
  annotations: PdfAnnotation[];
  selectedAnnotationId?: string | null;
  pdfSourceUrl?: string;
  rawTextContent?: string;
  layers?: DocumentLayer[];
  gridPattern?: GridPatternType;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creationDate?: string;
    modificationDate?: string;
  };
}

/**
 * Factory helper to initialize default clean PDF state
 */
export function createInitialPdfDocument(title = 'مستند PDF جديد'): PdfDocumentModel {
  return {
    fileName: `${title}.pdf`,
    fileSize: 1024 * 50,
    totalPages: 3,
    currentPage: 1,
    zoom: 100,
    fitMode: 'fit-width',
    pages: [
      {
        pageNumber: 1,
        rotation: 0,
        aspectRatio: 0.707,
        title: 'الغلاف والمقدمة',
        extractedText: `وثيقة تدقيق واعتماد رسمية\nرقم المرجع: REF-2026-PDF-DOC\n\nنص الوثيقة واستعراض الشروحات والملاحظات المرفقة...`,
      },
      {
        pageNumber: 2,
        rotation: 0,
        aspectRatio: 0.707,
        title: 'البيانات الفنية والجدول',
        extractedText: `المحور الثاني: جداول المطابقة والمواصفات الفنية والملاحظات الهندسية...`,
      },
      {
        pageNumber: 3,
        rotation: 0,
        aspectRatio: 0.707,
        title: 'الاعتماد والتوقيعات',
        extractedText: `المحور الثالث: مساحة مخصصة للأختام الرسمية والتوقيع الإلكتروني المعتمد...`,
      },
    ],
    annotations: [
      {
        id: 'ann-init-stamp',
        type: 'stamp',
        stampType: 'approved',
        pageNumber: 1,
        x: 65,
        y: 10,
        width: 26,
        height: 8,
        color: '#16a34a',
        backgroundColor: '#f0fdf4',
        borderColor: '#16a34a',
        borderWidth: 2,
        borderStyle: 'solid',
        text: 'معتمد رسمياً ✓',
        author: 'المراجع المعتمد',
        createdAt: new Date().toISOString(),
      },
    ],
    metadata: {
      title,
      author: 'WebPainter Studio PDF Core',
      creationDate: new Date().toISOString(),
    },
  };
}
