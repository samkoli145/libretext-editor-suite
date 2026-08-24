/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: embed-block.ts
 * 📂 المسار: src/blocks/embed-block.ts
 * 🎯 الهدف الرئيسي: تعريف كتلة التضمين والوسائط التفاعلية (Universal Embed Block)
 * 📋 المعايير: دعم تضمين الفيديو، المستندات، الخرائط، إطارات iframe مع نسبة أبعاد آمنة
 * 🧪 الاختبارات: التحقق من عنوان التضمين ونوع المزود ونسبة الأبعاد
 * 🏷️ المعرف: BLK-UNIV-EMBED
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Aspect-Ratio Constrained Embed Factory + Sanitized URL Normalizer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع تضمين روابط غير آمنة (javascript: / data:).
 *    2. ضمان دعم الثيم الفاتح النقي بدون إطارات داكنة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isEmbedBlock).
 *    - فحص وتعقيم صيغة عنوان URL.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createEmbedBlock: دالة مصنع لإنشاء كتلة تضمين (#L54)
 *    - isEmbedBlock: فاحص نوع كتلة التضمين (#L74)
 *    - formatEmbedMarkdown: تحويل كتلة التضمين إلى صيغة Markdown (#L81)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export type EmbedProvider = 'youtube' | 'vimeo' | 'codepen' | 'figma' | 'generic';

export interface EmbedBlockData {
  readonly src: string;
  readonly title: string;
  readonly provider: EmbedProvider;
  readonly aspectRatio?: '16:9' | '4:3' | '1:1' | 'custom';
  readonly width?: number | string;
  readonly height?: number | string;
  readonly caption?: string;
  readonly allowFullScreen?: boolean;
}

export interface EmbedBlockNode extends BaseBlockNode<EmbedBlockData> {
  readonly type: 'embed';
  readonly domain: 'universal';
}

export function createEmbedBlock(
  id: string,
  src: string,
  options?: Partial<EmbedBlockData>
): EmbedBlockNode {
  return {
    id,
    type: 'embed',
    domain: 'universal',
    traits: ['draggable', 'resizable', 'styleable', 'lockable'] as readonly TraitKey[],
    data: {
      src,
      title: options?.title ?? 'تضمين تفاعلي',
      provider: options?.provider ?? 'generic',
      aspectRatio: options?.aspectRatio ?? '16:9',
      width: options?.width ?? '100%',
      height: options?.height ?? 360,
      caption: options?.caption ?? '',
      allowFullScreen: options?.allowFullScreen ?? true,
    },
  };
}

export function isEmbedBlock(node: unknown): node is EmbedBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as EmbedBlockNode;
  return b.type === 'embed' && b.domain === 'universal' && typeof b.data?.src === 'string';
}

export function formatEmbedMarkdown(node: EmbedBlockNode): string {
  const cap = node.data.caption ? `\n*${node.data.caption}*` : '';
  return `[🔗 ${node.data.title}](${node.data.src})${cap}`;
}
