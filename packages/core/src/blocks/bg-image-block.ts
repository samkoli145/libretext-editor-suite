/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: bg-image-block.ts
 * 📂 المسار: src/blocks/bg-image-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك صورة الخلفية
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🏷️ المعرف: BLK-UNIV-BG-IMAGE
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface BgImageBlockData {
  readonly url: string;
  readonly size: 'cover' | 'contain' | 'auto';
  readonly position: string;
  readonly repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  readonly opacity: number;
}

export interface BgImageBlockNode extends BaseBlockNode<BgImageBlockData> {
  readonly type: 'bg-image';
}

export function createBgImageBlock(
  id: string,
  url: string = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
  traits: readonly TraitKey[] = ['draggable', 'resizable', 'styleable']
): BgImageBlockNode {
  return {
    id,
    type: 'bg-image',
    domain: 'universal',
    traits,
    data: {
      url,
      size: 'cover',
      position: 'center',
      repeat: 'no-repeat',
      opacity: 100
    }
  };
}

export function isBgImageBlock(node: unknown): node is BgImageBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as BgImageBlockNode;
  return candidate.type === 'bg-image' && candidate.domain === 'universal';
}

export function formatBgImageMarkdown(node: BgImageBlockNode): string {
  return `<!-- BgImage: ${node.data.url} -->\n`;
}

export function formatBgImageHtml(node: BgImageBlockNode): string {
  return `<div class="bg-image-block" style="background-image: url('${node.data.url}'); background-size: ${node.data.size}; background-position: ${node.data.position}; background-repeat: ${node.data.repeat}; opacity: ${node.data.opacity / 100};"></div>\n`;
}
