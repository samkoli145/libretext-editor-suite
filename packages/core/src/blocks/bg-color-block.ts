/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: bg-color-block.ts
 * 📂 المسار: src/blocks/bg-color-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك لون الخلفية
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🏷️ المعرف: BLK-UNIV-BG-COLOR
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface BgColorBlockData {
  readonly color: string;
  readonly opacity: number;
}

export interface BgColorBlockNode extends BaseBlockNode<BgColorBlockData> {
  readonly type: 'bg-color';
}

export function createBgColorBlock(
  id: string,
  color: string = '#f8fafc',
  opacity: number = 100,
  traits: readonly TraitKey[] = ['draggable', 'resizable', 'styleable']
): BgColorBlockNode {
  return {
    id,
    type: 'bg-color',
    domain: 'universal',
    traits,
    data: { color, opacity }
  };
}

export function isBgColorBlock(node: unknown): node is BgColorBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as BgColorBlockNode;
  return candidate.type === 'bg-color' && candidate.domain === 'universal';
}

export function formatBgColorMarkdown(node: BgColorBlockNode): string {
  return `<!-- BgColor: ${node.data.color} (${node.data.opacity}%) -->\n`;
}

export function formatBgColorHtml(node: BgColorBlockNode): string {
  return `<div class="bg-color-block" style="background-color: ${node.data.color}; opacity: ${node.data.opacity / 100};"></div>\n`;
}
