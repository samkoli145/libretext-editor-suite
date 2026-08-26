/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: icon-picker-block.ts
 * 📂 المسار: src/blocks/icon-picker-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك منتقي الأيقونات للنطاق العام
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🧪 الاختبارات: اختبارات التوليد والتصدير
 * 🏷️ المعرف: BLK-UNIV-ICON-PICKER
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface IconPickerBlockData {
  readonly iconName: string;
  readonly library: 'lucide' | 'material' | 'custom';
  readonly size?: number;
  readonly color?: string;
}

export interface IconPickerBlockNode extends BaseBlockNode<IconPickerBlockData> {
  readonly type: 'icon-picker';
}

export function createIconPickerBlock(
  id: string,
  iconName: string = 'star',
  traits: readonly TraitKey[] = ['draggable', 'resizable', 'styleable'],
): IconPickerBlockNode {
  return {
    id,
    type: 'icon-picker',
    domain: 'universal',
    traits,
    data: {
      iconName,
      library: 'lucide',
      size: 24,
      color: '#000000',
    },
  };
}

export function isIconPickerBlock(node: unknown): node is IconPickerBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as IconPickerBlockNode;
  return candidate.type === 'icon-picker' && candidate.domain === 'universal';
}

export function formatIconPickerMarkdown(node: IconPickerBlockNode): string {
  return `<!-- IconPicker: ${node.data.library}:${node.data.iconName} -->\n`;
}

export function formatIconPickerHtml(node: IconPickerBlockNode): string {
  return `<div class="icon-picker-block" data-icon="${node.data.iconName}" data-library="${node.data.library}" style="color: ${node.data.color || 'inherit'}; font-size: ${node.data.size || 24}px;"></div>\n`;
}
