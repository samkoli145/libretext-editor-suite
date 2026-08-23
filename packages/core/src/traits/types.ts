/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/core/src/traits/types.ts
 * 🎯 الهدف الرئيسي: تعريف أشكال الحالة (State Shapes) للسمات التفاعلية (Traits)
 * 📋 المعايير: Zero-dependency, Pure Functional, Structural Typing
 * 🏷️ المعرف: CORE-TRAIT-001
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Structural Interface Contracts + Pure State Transformations + Lock Assertions
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بالـ immutability في كافة تحويلات الـ traits.
 *    2. عزل كل سمة عن الأخرى مع حراسة صريحة لحالة القفل عبر assertUnlocked.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const KNOWN_TRAITS = [
  'draggable',
  'resizable',
  'styleable',
  'lockable',
] as const;

export type TraitName = (typeof KNOWN_TRAITS)[number];

// ─────────────────────────────────────────────────────────────────
// أشكال الحالة (State Shapes)
// ─────────────────────────────────────────────────────────────────

export interface PositionState {
  readonly x: number;
  readonly y: number;
  readonly zIndex: number;
}

export interface SizeConstraints {
  readonly minWidth?: number;
  readonly minHeight?: number;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly lockAspectRatio?: boolean;
  readonly originalAspectRatio?: number;
}

export interface SizeState {
  readonly width: number;
  readonly height: number;
}

export interface StyleState {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly borderWidth: number;
  readonly borderRadius?: number;
  readonly padding?: number;
  readonly margin?: number;
  readonly opacity: number;
  readonly rotation: number;
}

export interface LockState {
  readonly locked: boolean;
}

/** خطأ مخصص — يُستخدم عندما تُستدعى عملية تعديل على بلوك مقفول */
export class BlockLockedError extends Error {
  constructor(operation: string) {
    super(`لا يمكن تنفيذ "${operation}" — البلوك مقفول (locked).`);
    this.name = 'BlockLockedError';
  }
}

export type TraitKey = TraitName;
