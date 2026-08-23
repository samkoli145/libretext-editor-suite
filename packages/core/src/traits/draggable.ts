/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: draggable.ts
 * 📂 المسار: packages/core/src/traits/draggable.ts
 * 🎯 الهدف الرئيسي: تحويلات الحالة النقية لسمة السحب والموضع (Draggable Trait)
 * 📋 المعايير: Zero-dependency, Pure Functional State Transformer
 * 🏷️ المعرف: CORE-TRAIT-002
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Generic Structural State Transformer (Preserves Extra Metadata Keys)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الدالة Generic لضمان الحفاظ على أي حقول إضافية داخل كائن الموضع.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { PositionState } from './types';

/** تحريك البلوك إلى إحداثيات محددة */
export function moveTo<T extends PositionState>(state: T, x: number, y: number): T {
  return { ...state, x, y };
}

/** إزاحة البلوك بقيم نسبية (dx, dy) */
export function moveBy<T extends PositionState>(state: T, dx: number, dy: number): T {
  return { ...state, x: state.x + dx, y: state.y + dy };
}

/** تقديم البلوك للأمام في ترتيب الطبقات (zIndex) */
export function bringToFront<T extends PositionState>(state: T, currentMaxZ: number): T {
  return { ...state, zIndex: currentMaxZ + 1 };
}

/** إرجاع البلوك للخلف في ترتيب الطبقات (zIndex) */
export function sendToBack<T extends PositionState>(state: T, currentMinZ: number): T {
  return { ...state, zIndex: currentMinZ - 1 };
}
