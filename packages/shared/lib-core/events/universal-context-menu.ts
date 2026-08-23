/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك وقواعد قائمة الزر الأيمن الموحدة - Universal Context Menu
 * 🏛️ الدور: محرك مشترك - إدارة حالات وتوجيه أحداث القوائم السياقية
 * 📥 المستهلك: SharedContextMenu, كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Universal Context Menu Engine: محرك قوائم سياقية موحد
 *    مع حماية تفاعلات حقول الإدخال والنصوص
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القوائم يجب ألا تتعارض مع حقول النصوص
 *    2. الأحداث يجب أن تصل للعنصر الصحيح
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع العنصر قبل عرض القائمة
 *    - fallback لقائمة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface UniversalMenuItem {
  id: string;
  label: string;
  iconName?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  children?: UniversalMenuItem[];
  actionId?: string;
  payload?: any;
}

export interface UniversalContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  items: UniversalMenuItem[];
  targetId?: string | null;
  targetType?: string | null;
}

export const INITIAL_CONTEXT_MENU_STATE: UniversalContextMenuState = {
  isOpen: false,
  x: 0,
  y: 0,
  items: [],
  targetId: null,
  targetType: null,
};

/**
 * فحص ما إذا كان الهدف الأصلي للحدث هو حقل نصي يتطلب الحفاظ على القائمة الأصلية
 */
export function isEditableElementTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea') {
    return true;
  }

  if (target.isContentEditable) {
    return true;
  }

  return false;
}

/**
 * حساب إحداثيات القائمة السياقية لمنع خروجها عن حواف الشاشة
 */
export function clampMenuCoordinates(
  x: number,
  y: number,
  menuWidth = 220,
  menuHeight = 300,
  viewportWidth = window.innerWidth,
  viewportHeight = window.innerHeight,
): { x: number; y: number } {
  let adjustedX = x;
  let adjustedY = y;

  if (adjustedX + menuWidth > viewportWidth) {
    adjustedX = Math.max(10, viewportWidth - menuWidth - 10);
  }

  if (adjustedY + menuHeight > viewportHeight) {
    adjustedY = Math.max(10, viewportHeight - menuHeight - 10);
  }

  return { x: adjustedX, y: adjustedY };
}
