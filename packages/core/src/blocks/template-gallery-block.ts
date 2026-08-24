/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: template-gallery-block.ts
 * 📂 المسار: src/blocks/template-gallery-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك قالب المعرض (Gallery)
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🏷️ المعرف: BLK-TPL-GALLERY
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface GalleryItem {
  readonly url: string;
  readonly caption?: string;
}

export interface TemplateGalleryBlockData {
  readonly items: readonly GalleryItem[];
  readonly columns: number;
  readonly gap: number;
}

export interface TemplateGalleryBlockNode extends BaseBlockNode<TemplateGalleryBlockData> {
  readonly type: 'template-gallery';
}

export function createTemplateGalleryBlock(
  id: string,
  traits: readonly TraitKey[] = ['draggable', 'resizable', 'styleable']
): TemplateGalleryBlockNode {
  return {
    id,
    type: 'template-gallery',
    domain: 'universal',
    traits,
    data: {
      columns: 3,
      gap: 16,
      items: [
        { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400', caption: 'صورة 1' },
        { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400', caption: 'صورة 2' },
        { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', caption: 'صورة 3' }
      ]
    }
  };
}

export function isTemplateGalleryBlock(node: unknown): node is TemplateGalleryBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as TemplateGalleryBlockNode;
  return candidate.type === 'template-gallery' && candidate.domain === 'universal';
}

export function formatTemplateGalleryMarkdown(node: TemplateGalleryBlockNode): string {
  return node.data.items.map(item => `![${item.caption || 'Gallery Image'}](${item.url})`).join('\n\n');
}

export function formatTemplateGalleryHtml(node: TemplateGalleryBlockNode): string {
  const itemsHtml = node.data.items.map(item => `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <img src="${item.url}" style="width: 100%; border-radius: 8px; object-fit: cover; aspect-ratio: 1;" />
      ${item.caption ? `<span style="font-size: 12px; color: #64748b; text-align: center;">${item.caption}</span>` : ''}
    </div>
  `).join('');
  return `<div class="template-gallery-block" style="display: grid; grid-template-columns: repeat(${node.data.columns}, 1fr); gap: ${node.data.gap}px;">
    ${itemsHtml}
  </div>\n`;
}
