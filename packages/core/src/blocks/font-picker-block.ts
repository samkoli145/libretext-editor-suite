/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: font-picker-block.ts
 * 📂 المسار: src/blocks/font-picker-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك منتقي الخطوط
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🏷️ المعرف: BLK-UNIV-FONT-PICKER
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface FontPickerBlockData {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontWeight: number | string;
  readonly letterSpacing?: number;
}

export interface FontPickerBlockNode extends BaseBlockNode<FontPickerBlockData> {
  readonly type: 'font-picker';
}

export function createFontPickerBlock(
  id: string,
  traits: readonly TraitKey[] = ['draggable', 'lockable'],
): FontPickerBlockNode {
  return {
    id,
    type: 'font-picker',
    domain: 'universal',
    traits,
    data: {
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: 'normal',
      letterSpacing: 0,
    },
  };
}

export function isFontPickerBlock(node: unknown): node is FontPickerBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as FontPickerBlockNode;
  return candidate.type === 'font-picker' && candidate.domain === 'universal';
}

export function formatFontPickerMarkdown(node: FontPickerBlockNode): string {
  return `<!-- FontPicker: ${node.data.fontFamily}, ${node.data.fontSize}px -->\n`;
}

export function formatFontPickerHtml(node: FontPickerBlockNode): string {
  return `<div class="font-picker-block" style="font-family: ${node.data.fontFamily}; font-size: ${node.data.fontSize}px; font-weight: ${node.data.fontWeight}; letter-spacing: ${node.data.letterSpacing || 0}px;"></div>\n`;
}
