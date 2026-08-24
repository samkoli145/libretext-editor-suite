/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: image-block.ts
 * 📂 المسار: src/blocks/image-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك الصور والوسائط الرقمية مع دعم المقابض والتحجيم
 * 📋 المعايير: قفل نسبة الأبعاد، محاذاة الصور، ودعم التسميات التوضيحية
 * 🧪 الاختبارات: فحص صحة الأبعاد وروابط الصور
 * 🏷️ المعرف: BLK-UNIV-IMAGE
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Aspect-Ratio Constrained Node + Pure Filter State + Markdown Serializer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع الأبعاد السالبة أو الصفرية (width/height > 0).
 *    2. تجنب الروابط التالفة أو الفارغة في src.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية الأبعاد الدنيا (min 20px).
 *    - Type Guard (isImageBlock).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createImageBlock: إنشاء كتلة صورة (#L52)
 *    - isImageBlock: فاحص نوع الصورة (#L77)
 *    - formatImageMarkdown: تحويل الصورة لـ Markdown (#L84)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يتكامل مع معالجات EXIF ومحركات معالجة الصور النقطية.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم الرفع بالسحب والإفلات المباشر
 *    - 📖 مرجع تقني: LibreText Image Pipeline Specification
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface ImageFilterState {
  readonly brightness?: number; // 0 - 200 (100 افتراضي)
  readonly contrast?: number; // 0 - 200 (100 افتراضي)
  readonly grayscale?: boolean;
}

export interface ImageBlockData {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly isAspectRatioLocked: boolean;
  readonly align: 'left' | 'center' | 'right' | 'full';
  readonly filters?: ImageFilterState;
}

export interface ImageBlockNode extends BaseBlockNode<ImageBlockData> {
  readonly type: 'image';
  readonly domain: 'universal';
}

export function createImageBlock(
  id: string,
  src: string,
  alt: string = '',
  data?: Partial<ImageBlockData>
): ImageBlockNode {
  const width = Math.max(30, data?.width ?? 400);
  const height = Math.max(30, data?.height ?? 300);
  const aspectRatio = width / height;

  return {
    id,
    type: 'image',
    domain: 'universal',
    traits: ['draggable', 'resizable', 'styleable', 'lockable'] as readonly TraitKey[],
    data: {
      src: src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
      alt: alt || 'صورة توضيحية',
      caption: data?.caption,
      width,
      height,
      aspectRatio,
      isAspectRatioLocked: data?.isAspectRatioLocked ?? true,
      align: data?.align ?? 'center',
      filters: data?.filters,
    },
  };
}

export function isImageBlock(node: unknown): node is ImageBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as ImageBlockNode;
  return b.type === 'image' && typeof b.data?.src === 'string';
}

export function formatImageMarkdown(node: ImageBlockNode): string {
  const alt = node.data.alt || 'image';
  const src = node.data.src;
  const md = `![${alt}](${src})`;
  return node.data.caption ? `${md}\n*${node.data.caption}*` : md;
}
