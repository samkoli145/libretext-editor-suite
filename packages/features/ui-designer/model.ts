/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نموذج بيانات مصمم واجهات المستخدم - UI Designer Model
 * 🏛️ الدور: نوع مشترك - تعريف أنواع المكونات والخصائص
 * 📥 المستهلك: UIDesignerEditor, UIComponentRenderer, UIPropertiesPanel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Component Tree Model: نموذج شجري للمكونات مع فئات
 *    (layout, typography, inputs, feedback, data display, navigation)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل مكون يجب أن يكون من فئة معتمدة
 *    2. الخصائص يجب أن تتوافق مع نوع المكون
 *    3. IDs يجب أن تكون فريدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة نوع المكون
 *    - fallback لقيم افتراضية
 *    - تعامل مع المكونات غير المعروفة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * نموذج بيانات مصمم واجهات المستخدم وشجرة المكونات
 * /src/features/ui-designer/model.ts
 */

export type UIComponentCategory =
  | 'layout'
  | 'typography'
  | 'inputs'
  | 'feedback'
  | 'navigation'
  | 'sections'
  | 'widgets';

export interface UIComponentDefinition {
  type: string;
  name: string;
  category: UIComponentCategory;
  defaultProps: Record<string, any>;
  iconName: string;
}

export interface UIComponentNode {
  id: string;
  type:
    | 'heading'
    | 'paragraph'
    | 'button'
    | 'badge'
    | 'input'
    | 'form'
    | 'image'
    | 'video'
    | 'divider'
    | 'icon'
    | 'card'
    | 'section'
    | 'container'
    | 'grid'
    | 'flex'
    | 'navbar'
    | 'hero'
    | 'features'
    | 'pricing'
    | 'testimonials'
    | 'faq'
    | 'cta'
    | 'footer'
    | 'callout'
    | 'connector'
    | 'latex'
    | 'mindmap'
    | 'shape'
    | string;
  label: string;
  props: Record<string, any>;
  childrenIds?: string[];
  parentId?: string | null;
  hidden?: boolean;
  locked?: boolean;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface UIDesignerData {
  rootComponentId: string;
  components: Record<string, UIComponentNode>;
  selectedComponentId?: string | null;
  canvasSize: { width: number; height: number };
  devicePreview: DeviceMode;
}

export function createDefaultUIDesignerData(title = 'تصميم واجهة جديدة'): UIDesignerData {
  const rootId = 'root-container';
  const headerId = 'comp-header';
  const headingId = 'comp-title';
  const descId = 'comp-desc';
  const buttonId = 'comp-action-btn';
  const inputId = 'comp-input';

  return {
    rootComponentId: rootId,
    selectedComponentId: headingId,
    canvasSize: { width: 800, height: 600 },
    devicePreview: 'desktop',
    components: {
      [rootId]: {
        id: rootId,
        type: 'Card',
        label: 'حاوية الواجهة الرئيسية',
        props: {
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#e2e8f0',
        },
        childrenIds: [headerId, inputId, buttonId],
        parentId: null,
      },
      [headerId]: {
        id: headerId,
        type: 'Flex',
        label: 'ترويسة البطاقة',
        props: {
          direction: 'column',
          gap: '8px',
          marginBottom: '16px',
        },
        childrenIds: [headingId, descId],
        parentId: rootId,
      },
      [headingId]: {
        id: headingId,
        type: 'Heading',
        label: 'العنوان الرئيسي',
        props: {
          text: 'منصة تصميم الواجهات والمكونات',
          level: 2,
          fontSize: '20px',
          textColor: '#0f172a',
          fontWeight: 'bold',
        },
        parentId: headerId,
      },
      [descId]: {
        id: descId,
        type: 'Text',
        label: 'الوصف والفقرة',
        props: {
          text: 'تم بناء شجرة المكونات وتوليد شفرات TSX تلقائياً بنمط هيكلي نقي وفاتح.',
          fontSize: '14px',
          textColor: '#64748b',
        },
        parentId: headerId,
      },
      [inputId]: {
        id: inputId,
        type: 'Input',
        label: 'حقل إدخال بيانات',
        props: {
          placeholder: 'أدخل البريد الإلكتروني أو اسم المستخدم...',
          type: 'text',
          label: 'اسم الحساب',
        },
        parentId: rootId,
      },
      [buttonId]: {
        id: buttonId,
        type: 'Button',
        label: 'زر الإجراء الرئيسي',
        props: {
          text: 'حفظ ومتابعة الإجراء →',
          variant: 'primary',
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
        },
        parentId: rootId,
      },
    },
  };
}
