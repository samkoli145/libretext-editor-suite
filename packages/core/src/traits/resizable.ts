/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: resizable.ts
 * 📂 المسار: packages/core/src/traits/resizable.ts
 * 🎯 الهدف الرئيسي: تحويلات الحالة النقية لسمة التحجيم (Resizable Trait)
 * 📋 المعايير: Zero-dependency, Pure Functional, Aspect-Ratio & Constraint Clamping
 * 🏷️ المعرف: CORE-TRAIT-003
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Adaptive Aspect Ratio Preservation with Min/Max Dimension Bounds
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عند قفل نسبة الأبعاد (lockAspectRatio)، يتم الاعتماد على originalAspectRatio إن وجد،
 *       أو حساب النسبة من الحالة الحالية.
 *    2. تطبيق حدود min/max بدقة بعد ضبط نسبة الأبعاد.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { SizeState, SizeConstraints } from './types';

function clamp(value: number, min?: number, max?: number): number {
  let result = value;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  return result;
}

/** تغيير حجم البلوك إلى أبعاد مطلوبة مع احترام القيود ونسبة الأبعاد */
export function resizeTo<T extends SizeState>(
  state: T,
  targetWidth: number,
  targetHeight: number,
  constraints: SizeConstraints = {},
): T {
  let width = targetWidth;
  let height = targetHeight;

  if (constraints.lockAspectRatio) {
    const ratio =
      constraints.originalAspectRatio && constraints.originalAspectRatio > 0
        ? constraints.originalAspectRatio
        : state.height > 0
          ? state.width / state.height
          : 1;

    const widthDelta = Math.abs(targetWidth - state.width);
    const heightDelta = Math.abs(targetHeight - state.height);

    if (widthDelta >= heightDelta) {
      height = targetWidth / ratio;
    } else {
      width = targetHeight * ratio;
    }
  }

  width = clamp(width, constraints.minWidth, constraints.maxWidth);
  height = clamp(height, constraints.minHeight, constraints.maxHeight);

  return { ...state, width, height };
}

/** تغيير نسبي في أبعاد البلوك */
export function resizeBy<T extends SizeState>(
  state: T,
  dWidth: number,
  dHeight: number,
  constraints: SizeConstraints = {},
): T {
  return resizeTo(state, state.width + dWidth, state.height + dHeight, constraints);
}
