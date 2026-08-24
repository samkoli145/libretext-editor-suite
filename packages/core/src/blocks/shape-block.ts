/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: shape-block.ts
 * 📂 المسار: src/blocks/shape-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك الأشكال المكانية والمتجهية لنطاق Impress والسبورة
 * 📋 المعايير: دعم التموضع الحر (X, Y)، التحجيم، التدوير، والألوان النهارية
 * 🧪 الاختبارات: التحقق من صحة إحداثيات الشكل وزاوية التدوير وتوليد SVG
 * 🏷️ المعرف: BLK-IMPRESS-SHAPE
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Spatial 2D Transform Node + Vector Geometry Preset + SVG Renderer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بالألوان الفاتحة النقية فقط.
 *    2. ضمان بقاء زاوية التدوير محصورة بين 0 و 360 درجة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية الأبعاد الدنيا الموجبة (width/height > 10).
 *    - Type Guard (isShapeBlock).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createShapeBlock: إنشاء كتلة شكل مكاني (#L52)
 *    - isShapeBlock: فاحص نوع الشكل المكاني (#L80)
 *    - getShapePresetPath: استخراج مسار SVG الافتراضي للأشكال (#L87)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يدعم المحاذاة والتسنين المغناطيسي الذكي مع الكائنات المجاورة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم مسارات بيزييه المعقدة وتدرجات الألوان الفاتحة
 *    - 📖 مرجع تقني: LibreText Spatial Translation & Vector Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'star' | 'diamond';

export interface ShapeBlockData {
  readonly shapeType: ShapeType;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number; // 0 - 360
  readonly fillColor: string;
  readonly strokeColor: string;
  readonly strokeWidth: number;
  readonly label?: string;
}

export interface ShapeBlockNode extends BaseBlockNode<ShapeBlockData> {
  readonly type: 'shape';
  readonly domain: 'impress';
}

export function createShapeBlock(
  id: string,
  shapeType: ShapeType = 'rectangle',
  data?: Partial<ShapeBlockData>
): ShapeBlockNode {
  const width = Math.max(10, data?.width ?? 120);
  const height = Math.max(10, data?.height ?? 80);
  const rawRot = (data?.rotation ?? 0) % 360;
  const rotation = rawRot < 0 ? rawRot + 360 : rawRot;

  return {
    id,
    type: 'shape',
    domain: 'impress',
    traits: ['draggable', 'resizable', 'styleable', 'lockable'] as readonly TraitKey[],
    data: {
      shapeType,
      x: data?.x ?? 50,
      y: data?.y ?? 50,
      width,
      height,
      rotation,
      fillColor: data?.fillColor ?? '#EFF6FF',
      strokeColor: data?.strokeColor ?? '#3B82F6',
      strokeWidth: data?.strokeWidth ?? 2,
      label: data?.label,
    },
  };
}

export function isShapeBlock(node: unknown): node is ShapeBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as ShapeBlockNode;
  return b.type === 'shape' && b.domain === 'impress' && typeof b.data?.shapeType === 'string';
}

export function getShapePresetPath(shapeType: ShapeType, w: number, h: number): string {
  if (shapeType === 'circle') return `M ${w / 2},0 A ${w / 2},${h / 2} 0 1,0 ${w / 2},${h} A ${w / 2},${h / 2} 0 1,0 ${w / 2},0 Z`;
  if (shapeType === 'triangle') return `M ${w / 2},0 L ${w},${h} L 0,${h} Z`;
  if (shapeType === 'diamond') return `M ${w / 2},0 L ${w},${h / 2} L ${w / 2},${h} L 0,${h / 2} Z`;
  if (shapeType === 'arrow') return `M 0,${h * 0.3} L ${w * 0.6},${h * 0.3} L ${w * 0.6},0 L ${w},${h / 2} L ${w * 0.6},${h} L ${w * 0.6},${h * 0.7} L 0,${h * 0.7} Z`;
  return `M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z`;
}
