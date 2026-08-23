/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/core/src/blocks/types.ts
 * 🎯 الهدف الرئيسي: تعريف أنواع بيانات البلوكات والبيانات الوصفية
 * 📋 المعايير: Zero-dependency, Type-safe
 * 🏷️ المعرف: CORE-BLOCK-000
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { SizeConstraints, TraitName } from '../traits/types';

export interface BlockPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface BlockStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  opacity: number;
  rotation: number;
}

export interface BlockMetadata {
  id: string;
  type: string;
  position: BlockPosition;
  style: BlockStyle;
  createdAt: number;
  updatedAt: number;
  locked: boolean;
  visible: boolean;
  layer: string;
  constraints?: SizeConstraints;
  traits?: TraitName[];
}
