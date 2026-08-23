/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: styleable.ts
 * 📂 المسار: packages/core/src/traits/styleable.ts
 * 🎯 الهدف الرئيسي: تحويلات الحالة النقية لسمة التنسيق والمظهر (Styleable Trait)
 * 📋 المعايير: Zero-dependency, Pure Functional, Bounded Range Protections
 * 🏷️ المعرف: CORE-TRAIT-004
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bounded Range Clamping (Opacity [0..1], Normalized Angles [0..360])
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تقييد الشفافية بين 0 و 1 لمنع تشوه العرض.
 *    2. تطبيع زوايا الدوران في المجال [0, 360).
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { StyleState } from './types';

/** تحديث جزئي لخصائص النمط */
export function setStyle<T extends StyleState>(state: T, patch: Partial<StyleState>): T {
  return { ...state, ...patch };
}

/** تعيين درجة الشفافية مع تقييدها بين 0 و 1 */
export function setOpacity<T extends StyleState>(state: T, opacity: number): T {
  return { ...state, opacity: Math.min(1, Math.max(0, opacity)) };
}

/** تدوير البلوك إلى زاوية محددة مع تطبيع الدرجات بين 0 و 360 */
export function rotateTo<T extends StyleState>(state: T, degrees: number): T {
  const normalized = ((degrees % 360) + 360) % 360;
  return { ...state, rotation: normalized };
}
