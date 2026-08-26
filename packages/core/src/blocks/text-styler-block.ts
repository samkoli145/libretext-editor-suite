/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: text-styler-block.ts
 * 📂 المسار: src/blocks/text-styler-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك تنسيق النصوص والشكل
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🏷️ المعرف: BLK-UNIV-TEXT-STYLER
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface TextStylerBlockData {
  readonly shadow?: string;
  readonly border?: string;
  readonly borderRadius?: number;
  readonly opacity?: number;
}

export interface TextStylerBlockNode extends BaseBlockNode<TextStylerBlockData> {
  readonly type: 'text-styler';
}

export function createTextStylerBlock(
  id: string,
  traits: readonly TraitKey[] = ['draggable', 'lockable'],
): TextStylerBlockNode {
  return {
    id,
    type: 'text-styler',
    domain: 'universal',
    traits,
    data: {
      shadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      opacity: 100,
    },
  };
}

export function isTextStylerBlock(node: unknown): node is TextStylerBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as TextStylerBlockNode;
  return candidate.type === 'text-styler' && candidate.domain === 'universal';
}

export function formatTextStylerMarkdown(node: TextStylerBlockNode): string {
  return `<!-- TextStyler applied -->\n`;
}

export function formatTextStylerHtml(node: TextStylerBlockNode): string {
  return `<div class="text-styler-block" style="box-shadow: ${node.data.shadow || 'none'}; border: ${node.data.border || 'none'}; border-radius: ${node.data.borderRadius || 0}px; opacity: ${(node.data.opacity ?? 100) / 100};"></div>\n`;
}
