/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مدمج ومنظم المستندات متعددة الطبقات - Multi-Layer Compositor
 * 🏛️ الدور: نواة تنظيم الطبقات المشتركة لجميع المحررات (PDF, Canvas, UI, Rich Text)
 * 📥 المستهلك: MultiLayerStageCompositor, useLayerManager, محرر PDF
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 خوارزميات وإدارة الطبقات | Innovative Multi-Layer Architecture:
 *    1. Modular Layer Kinds: (Base Document, Floating Images, Teacher Solutions, Student Notes, Grids)
 *    2. Layer Z-Index Sorting & Normalization ($O(n \log n)$)
 *    3. Selective Visibility Toggles (إظهار/إخفاء طبقة حلول المعلم للامتحانات)
 *    4. Immutable Layer Patching & State Clamping
 *    5. Atomic Lock Protection (منع التحريك العرضي للطبقات المقفلة)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الكامل بالثيم الفاتح النقي 100%
 *    2. صفر اعتماديات خارجية
 *    3. عدم فقدان معرفات الطبقات (UUIDs) لضمان اتساق التراجع والإعادة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية وترقيع الدوال | Defensive Coding:
 *    - ضمان وجود طبقة الأساس دائماً كـ Fallback
 *    - تنظيف الطبقات المعطوبة أو ذات المعرفات المكررة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل التوجيهي باللغة العربية)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type LayerKind =
  | 'base-page' // طبقة المستند الأصلية (الصفحة أو الرسم الأساسي)
  | 'floating-images' // طبقة الصور الطافية ذات التحجيم الحر
  | 'teacher-solution' // طبقة حلول المعلم ونموذج الإجابة
  | 'student-notes' // طبقة ملاحظات وشروحات وتلخيص الطالب
  | 'grid-overlay' // طبقة شبكات الرسم البياني والهندسي
  | 'redaction-mask' // طبقة الحجب والتعتيم الأكاديمي
  | 'vector-drawings'; // طبقة الرسم الفيكتوري والخطوط

export type GridPatternType =
  'none' | 'graph-paper' | 'dot-grid' | 'music-staff' | 'isometric' | 'lined-ruled';

export interface DocumentLayer {
  id: string;
  name: string;
  kind: LayerKind;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1
  zIndex: number;
  gridType?: GridPatternType;
  color?: string; // لون مميز للطبقة (مثال: أزرق للمعلم، أخضر للحلول)
  itemsCount?: number;
  metadata?: Record<string, any>;
}

export interface MultiLayerDocumentState {
  activeLayerId: string;
  layers: DocumentLayer[];
}

/**
 * توليد المعرفات الفريدة للطبقات
 */
export function generateLayerId(prefix = 'layer'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * توليد الطبقات التعليمية الافتراضية لأي مستند
 */
export function createDefaultEducationalLayers(): DocumentLayer[] {
  return [
    {
      id: 'layer-base',
      name: '📄 صفحة المستند الأصلية',
      kind: 'base-page',
      visible: true,
      locked: true,
      opacity: 1,
      zIndex: 0,
      color: '#64748b',
    },
    {
      id: 'layer-grid',
      name: '📐 شبكة الرسم البياني والهندسي',
      kind: 'grid-overlay',
      visible: false,
      locked: false,
      opacity: 0.7,
      zIndex: 10,
      gridType: 'graph-paper',
      color: '#3b82f6',
    },
    {
      id: 'layer-images',
      name: '🖼️ الصور والأشكال التوضيحية',
      kind: 'floating-images',
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: 20,
      color: '#8b5cf6',
    },
    {
      id: 'layer-student',
      name: '✏️ ملاحظات وشروحات الطالب',
      kind: 'student-notes',
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: 30,
      color: '#059669',
    },
    {
      id: 'layer-teacher',
      name: '🎓 طبقة حلول المعلم ونموذج الإجابة',
      kind: 'teacher-solution',
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: 40,
      color: '#d97706',
    },
  ];
}

/**
 * إعادة ترتيب الطبقات وتطبيع قيم الـ Z-Index
 */
export function normalizeLayersZIndex(layers: DocumentLayer[]): DocumentLayer[] {
  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  return sorted.map((layer, index) => ({
    ...layer,
    zIndex: index * 10,
  }));
}

/**
 * تبديل رؤية طبقة محددة (مثل إخفاء طبقة حلول المعلم أثناء الاختبار)
 */
export function toggleLayerVisibility(
  layers: DocumentLayer[],
  targetLayerId: string,
): DocumentLayer[] {
  return layers.map((layer) =>
    layer.id === targetLayerId ? { ...layer, visible: !layer.visible } : layer,
  );
}

/**
 * تبديل حالة قفل الطبقة (Lock/Unlock)
 */
export function toggleLayerLock(layers: DocumentLayer[], targetLayerId: string): DocumentLayer[] {
  return layers.map((layer) =>
    layer.id === targetLayerId ? { ...layer, locked: !layer.locked } : layer,
  );
}

/**
 * تعديل شفافية الطبقة (Opacity)
 */
export function setLayerOpacity(
  layers: DocumentLayer[],
  targetLayerId: string,
  opacity: number,
): DocumentLayer[] {
  const clamped = Math.max(0, Math.min(1, opacity));
  return layers.map((layer) =>
    layer.id === targetLayerId ? { ...layer, opacity: clamped } : layer,
  );
}
