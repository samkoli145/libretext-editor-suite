/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: gradient-block.ts
 * 📂 المسار: src/blocks/gradient-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك التدرج اللوني
 * 📋 المعايير: التوافق مع النواة المجردة، عدم استخدام أي مكتبات خارجية
 * 🏷️ المعرف: BLK-UNIV-GRADIENT
 * 📅 تاريخ الإنشاء: 2026-08-24
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface GradientStop {
  readonly color: string;
  readonly position: number; // 0-100
}

export interface GradientBlockData {
  readonly gradientType: 'linear' | 'radial' | 'conic';
  readonly stops: readonly GradientStop[];
  readonly angle?: number;
}

export interface GradientBlockNode extends BaseBlockNode<GradientBlockData> {
  readonly type: 'gradient';
}

export function createGradientBlock(
  id: string,
  traits: readonly TraitKey[] = ['draggable', 'resizable', 'styleable']
): GradientBlockNode {
  return {
    id,
    type: 'gradient',
    domain: 'universal',
    traits,
    data: {
      gradientType: 'linear',
      angle: 90,
      stops: [
        { color: '#f8fafc', position: 0 },
        { color: '#e2e8f0', position: 100 }
      ]
    }
  };
}

export function isGradientBlock(node: unknown): node is GradientBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as GradientBlockNode;
  return candidate.type === 'gradient' && candidate.domain === 'universal';
}

export function formatGradientMarkdown(node: GradientBlockNode): string {
  return `<!-- Gradient: ${node.data.gradientType} -->\n`;
}

export function formatGradientHtml(node: GradientBlockNode): string {
  const stopsStr = node.data.stops.map(s => `${s.color} ${s.position}%`).join(', ');
  let bgStr = '';
  if (node.data.gradientType === 'linear') {
    bgStr = `linear-gradient(${node.data.angle}deg, ${stopsStr})`;
  } else if (node.data.gradientType === 'radial') {
    bgStr = `radial-gradient(circle, ${stopsStr})`;
  } else if (node.data.gradientType === 'conic') {
    bgStr = `conic-gradient(from ${node.data.angle || 0}deg, ${stopsStr})`;
  }
  return `<div class="gradient-block" style="background-image: ${bgStr};"></div>\n`;
}
