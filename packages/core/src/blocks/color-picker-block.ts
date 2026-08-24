/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: color-picker-block.ts
 * 📂 المسار: src/blocks/color-picker-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك منتقي الألوان للنطاق العام
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🧪 الاختبارات: اختبارات التوليد والتصدير
 * 🏷️ المعرف: BLK-UNIV-COLOR-PICKER
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface ColorPickerBlockData {
  readonly color: string;
  readonly format: 'hex' | 'rgb' | 'hsl';
  readonly allowAlpha: boolean;
  readonly recentColors?: readonly string[];
}

export interface ColorPickerBlockNode extends BaseBlockNode<ColorPickerBlockData> {
  readonly type: 'color-picker';
}

export function createColorPickerBlock(
  id: string,
  color: string = '#000000',
  traits: readonly TraitKey[] = ['draggable', 'lockable']
): ColorPickerBlockNode {
  return {
    id,
    type: 'color-picker',
    domain: 'universal',
    traits,
    data: {
      color,
      format: 'hex',
      allowAlpha: false,
      recentColors: []
    }
  };
}

export function isColorPickerBlock(node: unknown): node is ColorPickerBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as ColorPickerBlockNode;
  return candidate.type === 'color-picker' && candidate.domain === 'universal';
}

export function formatColorPickerMarkdown(node: ColorPickerBlockNode): string {
  return `<!-- ColorPicker: ${node.data.color} (${node.data.format}) -->\n`;
}

export function formatColorPickerHtml(node: ColorPickerBlockNode): string {
  return `<div class="color-picker-block" data-color="${node.data.color}" data-format="${node.data.format}"></div>\n`;
}
