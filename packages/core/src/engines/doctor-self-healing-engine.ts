/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: doctor-self-healing-engine.ts
 * 📂 المسار: packages/core/src/engines/doctor-self-healing-engine.ts
 * 🎯 الهدف الرئيسي: محرك الفحص والتشخيص التلقائي للأخطاء ومعالجتها.
 * 📋 المعايير:
 *    - صفر اعتماديات (يعمل على مستوى الـ AST أو JSON State).
 *    - نمط الخطوط الأنبوبية (Functional Pipeline).
 *    - معالجة تشوهات البيانات واستعادة المكونات المفقودة.
 * 🧪 الاختبارات: (تضاف لاحقاً)
 * 🏷️ المعرف: CORE-021
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Self-Healing Pipeline: نظام أنابيب (Pipes) يمرر حالة المستند،
 *    ويقوم كل أنبوب بفحص ومعالجة فئة محددة من الأخطاء (Nodes, Styles, Z-Index).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب تدمير بيانات المستخدم الصالحة أثناء "الإصلاح".
 *    2. الدوال يجب أن تكون نقية (Immutable).
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { pipe } from '../utils/pipe';

export interface DoctorReport {
  readonly fixedErrors: string[];
  readonly warnings: string[];
  readonly state: any; // Immutable state
}

// 1. تنظيف الحقول غير المعرفة أو المفقودة
const sanitizeUndefinedFields = (state: any): any => {
  if (!state || typeof state !== 'object') return state;
  const newState = Array.isArray(state) ? [...state] : { ...state };

  for (const key in newState) {
    if (newState[key] === undefined) {
      delete newState[key];
    } else if (typeof newState[key] === 'object') {
      newState[key] = sanitizeUndefinedFields(newState[key]);
    }
  }
  return newState;
};

// 2. إصلاح العناصر المفقودة الإحداثيات (في وضع الكانفا)
const healMissingCoordinates = (state: any): any => {
  if (!state || !state.elements || !Array.isArray(state.elements)) return state;

  const healedElements = state.elements.map((el: any) => {
    if (typeof el.x !== 'number' || typeof el.y !== 'number') {
      return { ...el, x: el.x || 0, y: el.y || 0 };
    }
    return el;
  });

  return { ...state, elements: healedElements };
};

// 3. ترتيب طبقات Z-Index لضمان عدم وجود طبقات سالبة مفقودة
const normalizeZIndex = (state: any): any => {
  if (!state || !state.elements || !Array.isArray(state.elements)) return state;

  const healedElements = state.elements.map((el: any, index: number) => {
    if (typeof el.zIndex !== 'number') {
      return { ...el, zIndex: index };
    }
    return el;
  });

  return { ...state, elements: healedElements };
};

// 4. إعادة المعرفات المفقودة
const healMissingIds = (state: any): any => {
  if (!state || !state.elements || !Array.isArray(state.elements)) return state;

  const healedElements = state.elements.map((el: any) => {
    if (!el.id) {
      return { ...el, id: `recovered-${Math.random().toString(36).substr(2, 9)}` };
    }
    return el;
  });

  return { ...state, elements: healedElements };
};

/**
 * خط أنابيب المعالجة التلقائية.
 * يمرر الحالة عبر سلسلة من دوال الإصلاح ويعيد الحالة السليمة.
 */
export const runSelfHealingPipeline = (initialState: any): DoctorReport => {
  try {
    const healedState = pipe(
      initialState,
      sanitizeUndefinedFields,
      healMissingCoordinates,
      normalizeZIndex,
      healMissingIds,
    );

    return {
      fixedErrors: ['Completed self-healing pipeline'],
      warnings: [],
      state: healedState,
    };
  } catch (error) {
    return {
      fixedErrors: [],
      warnings: [`Healing pipeline failed: ${error}`],
      state: initialState,
    };
  }
};
