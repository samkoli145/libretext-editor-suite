/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: lockable.ts
 * 📂 المسار: packages/core/src/traits/lockable.ts
 * 🎯 الهدف الرئيسي: تحويلات الحالة النقية وحراسة العمليات لسمة القفل (Lockable Trait)
 * 📋 المعايير: Zero-dependency, Pure Functional, Strict Lock Assertion
 * 🏷️ المعرف: CORE-TRAIT-005
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type Assertion Guard & Immutable Lock Toggling
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. استدعاء assertUnlocked قبل تنفيذ أي تعديل على البلوك لمنع التعديل أثناء القفل.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BlockLockedError, type LockState } from './types';

/** قفل البلوك لمنع التعديلات */
export function lock<T extends LockState>(state: T): T {
  return { ...state, locked: true };
}

/** فتح قفل البلوك للسماح بالتعديلات */
export function unlock<T extends LockState>(state: T): T {
  return { ...state, locked: false };
}

/** حراسة العمليات: إلقاء BlockLockedError إذا كان البلوك مقفولاً */
export function assertUnlocked(state: LockState, operation = 'تعديل'): void {
  if (state.locked) {
    throw new BlockLockedError(operation);
  }
}
