/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: template-card-block.ts
 * 📂 المسار: src/blocks/template-card-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك قالب البطاقة
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🏷️ المعرف: BLK-TPL-CARD
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface TemplateCardBlockData {
  readonly title: string;
  readonly description: string;
  readonly imageUrl?: string;
  readonly buttonText?: string;
}

export interface TemplateCardBlockNode extends BaseBlockNode<TemplateCardBlockData> {
  readonly type: 'template-card';
}

export function createTemplateCardBlock(
  id: string,
  traits: readonly TraitKey[] = ['draggable', 'resizable', 'styleable'],
): TemplateCardBlockNode {
  return {
    id,
    type: 'template-card',
    domain: 'universal',
    traits,
    data: {
      title: 'عنوان البطاقة',
      description: 'وصف قصير لهذه البطاقة لتوضيح المحتوى.',
      buttonText: 'المزيد',
    },
  };
}

export function isTemplateCardBlock(node: unknown): node is TemplateCardBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as TemplateCardBlockNode;
  return candidate.type === 'template-card' && candidate.domain === 'universal';
}

export function formatTemplateCardMarkdown(node: TemplateCardBlockNode): string {
  return `### ${node.data.title}\n\n${node.data.description}\n\n[${node.data.buttonText || 'Link'}]()\n`;
}

export function formatTemplateCardHtml(node: TemplateCardBlockNode): string {
  return `<div class="template-card-block" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #fff;">
  ${node.data.imageUrl ? `<img src="${node.data.imageUrl}" style="max-width: 100%; border-radius: 4px; margin-bottom: 12px;" />` : ''}
  <h3 style="margin-top: 0; color: #1e293b;">${node.data.title}</h3>
  <p style="color: #64748b;">${node.data.description}</p>
  ${node.data.buttonText ? `<button style="background: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">${node.data.buttonText}</button>` : ''}
</div>\n`;
}
