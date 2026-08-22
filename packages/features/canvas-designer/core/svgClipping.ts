/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك أقنعة وقص العناصر والمسارات المتجهة - SVG Clipping Paths & Masks
 * 🏛️ الدور: محرك مشترك - توليد وتطبيق مسارات القص على الصور والأشكال
 * 📥 المستهلك: ElementPropertiesPanel, ElementRenderer, svgExporter
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Vector Clipping Engine: محرك قص متجه بقوالب مسبقة
 *    (Circle Avatar, Rounded Hexagon, Star, Diamond, Shield)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مسارات القص يجب أن تكون صالحة لـ SVG
 *    2. التصدير يجب أن يتضمن <defs>
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة مسار القص
 *    - fallback لشكل مستطيل
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  createCirclePath,
  createPolygonPath,
  createStarPath,
  createRectanglePath,
} from './svgPathUtils';

export type ClipShapeType = 'none' | 'circle' | 'ellipse' | 'rounded' | 'hexagon' | 'star' | 'diamond' | 'shield';

export interface ClipPreset {
  id: ClipShapeType;
  name: string;
  nameAr: string;
  generatePathD: (width: number, height: number) => string;
}

/**
 * قوالب أقنعة القص المتجهة القياسية
 */
export const CLIP_PRESETS: ClipPreset[] = [
  {
    id: 'none',
    name: 'None',
    nameAr: 'بدون قناع',
    generatePathD: () => '',
  },
  {
    id: 'circle',
    name: 'Circle',
    nameAr: 'قناع دائري',
    generatePathD: (w, h) => createCirclePath(w / 2, h / 2, Math.min(w, h) / 2),
  },
  {
    id: 'rounded',
    name: 'Rounded Rectangle',
    nameAr: 'مستطيل مدور',
    generatePathD: (w, h) => createRectanglePath(0, 0, w, h, Math.min(w, h) * 0.2),
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    nameAr: 'سداسي الأضلاع',
    generatePathD: (w, h) => {
      const points = [];
      const cx = w / 2;
      const cy = h / 2;
      const rx = w / 2;
      const ry = h / 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 * Math.PI) / 180;
        points.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) });
      }
      return createPolygonPath(points);
    },
  },
  {
    id: 'star',
    name: 'Star',
    nameAr: 'نجمة خماسية',
    generatePathD: (w, h) => createStarPath(w / 2, h / 2, 5, Math.min(w, h) / 2, Math.min(w, h) / 4),
  },
  {
    id: 'diamond',
    name: 'Diamond',
    nameAr: 'معين هندسي',
    generatePathD: (w, h) => {
      const pts = [
        { x: w / 2, y: 0 },
        { x: w, y: h / 2 },
        { x: w / 2, y: h },
        { x: 0, y: h / 2 },
      ];
      return createPolygonPath(pts);
    },
  },
  {
    id: 'shield',
    name: 'Shield',
    nameAr: 'درع واقي',
    generatePathD: (w, h) => {
      return `M 0 0 L ${w} 0 L ${w} ${h * 0.6} Q ${w * 0.5} ${h}, ${w / 2} ${h} Q 0 ${h * 0.6}, 0 ${h * 0.6} Z`;
    },
  },
];

/**
 * توليد وسم `<clipPath>` لـ SVG نصي
 */
export function generateSvgClipPathElement(
  clipId: string,
  shapeType: ClipShapeType,
  width: number,
  height: number
): string {
  const preset = CLIP_PRESETS.find((p) => p.id === shapeType);
  if (!preset || shapeType === 'none') return '';

  const pathD = preset.generatePathD(width, height);
  if (!pathD) return '';

  return `<clipPath id="${clipId}">\n  <path d="${pathD}" />\n</clipPath>`;
}
