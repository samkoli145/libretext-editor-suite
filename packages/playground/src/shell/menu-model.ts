/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: menu-model.ts
 * 📂 المسار: packages/playground/src/shell/menu-model.ts
 * 🎯 الهدف الرئيسي: نموذج القوائم العلوية لكل محرر مع تمييز الأدوات المشتركة
 * 📋 المعايير: قوائم ملف/تحرير/عرض/إدراج، أدوات مشتركة موحدة، أوامر قابلة للربط
 * 🧪 الاختبارات: tests/shell.test.ts
 * 🏷️ المعرف: PLAY-SHELL-MENU-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Declarative Menu Contracts — القوائم بيانات نقية (لا DOM) تُستهلك من أي
 *    واجهة، والأدوات المشتركة (undo/redo/save) تُعرَّف مرة وتُدمج في الجميع.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - المستهلك: shell/playground-shell.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { OfficeDomain } from './playground-shell';

/** أمر قائمة واحد. */
export interface MenuAction {
  readonly id: string;
  readonly labelAr: string;
  readonly icon?: string;
  /** أداة مشتركة بين كل المحررات — تُموَّح معالجتها. */
  readonly shared?: boolean;
  readonly separatorBefore?: boolean;
}

/** قائمة علوية واحدة (ملف/تحرير/...). */
export interface MenuSection {
  readonly id: string;
  readonly labelAr: string;
  readonly actions: readonly MenuAction[];
}

/** الأدوات المشتركة — متطابقة في كل المحررات. */
const SHARED_FILE_ACTIONS: readonly MenuAction[] = [
  { id: 'new', labelAr: 'جديد', icon: 'writer', shared: true },
  { id: 'save', labelAr: 'حفظ', icon: 'save', shared: true },
  { id: 'export-md', labelAr: 'تصدير Markdown', shared: true },
];

const SHARED_EDIT_ACTIONS: readonly MenuAction[] = [
  { id: 'undo', labelAr: 'تراجع', icon: 'undo', shared: true },
  { id: 'redo', labelAr: 'إعادة', icon: 'redo', shared: true, separatorBefore: true },
];

/** بناء قوائم نطاق معين. */
export function buildMenusForDomain(domain: OfficeDomain): readonly MenuSection[] {
  const insertActions: readonly MenuAction[] = (() => {
    switch (domain) {
      case 'writer':
        return [
          { id: 'insert-image', labelAr: 'صورة', icon: 'image' },
          { id: 'insert-table', labelAr: 'جدول', icon: 'table', separatorBefore: true },
          { id: 'insert-math', labelAr: 'معادلة LaTeX' },
          { id: 'insert-code-runner', labelAr: 'كود تفاعلي', separatorBefore: true },
          { id: 'insert-toc', labelAr: 'جدول محتويات' },
        ];
      case 'calc':
        return [
          { id: 'insert-function', labelAr: 'دالة…' },
          { id: 'insert-chart', labelAr: 'رسم بياني', separatorBefore: true },
          { id: 'insert-tafqeet', labelAr: 'تفقيط مبلغ' },
        ];
      case 'impress':
        return [
          { id: 'insert-slide', labelAr: 'شريحة جديدة' },
          { id: 'insert-shape', labelAr: 'شكل', separatorBefore: true },
          { id: 'insert-transition', labelAr: 'انتقال شريحة' },
        ];
      case 'base':
        return [
          { id: 'insert-table', labelAr: 'جدول بيانات' },
          { id: 'insert-column', labelAr: 'عمود', separatorBefore: true },
          { id: 'insert-relation', labelAr: 'علاقة' },
        ];
      default:
        return [];
    }
  })();

  return [
    {
      id: 'file',
      labelAr: 'ملف',
      actions: [...SHARED_FILE_ACTIONS, { id: 'close', labelAr: 'إغلاق', separatorBefore: true }],
    },
    {
      id: 'edit',
      labelAr: 'تحرير',
      actions: [...SHARED_EDIT_ACTIONS],
    },
    {
      id: 'view',
      labelAr: 'عرض',
      actions: [
        { id: 'toggle-layers', labelAr: 'لوحة الطبقات', icon: 'layers' },
        { id: 'toggle-properties', labelAr: 'لوحة الخصائص', icon: 'settings' },
        { id: 'pin-panels', labelAr: 'تثبيت اللوحات', icon: 'pin', separatorBefore: true },
        { id: 'open-settings', labelAr: 'الإعدادات والخلفية', icon: 'settings' },
      ],
    },
    {
      id: 'insert',
      labelAr: 'إدراج',
      actions: insertActions,
    },
  ];
}

/** تسطيح أوامر النطاق للبحث السريع. */
export function flattenMenuActions(domain: OfficeDomain): Map<string, MenuAction> {
  const map = new Map<string, MenuAction>();
  for (const section of buildMenusForDomain(domain)) {
    for (const action of section.actions) {
      map.set(action.id, action);
    }
  }
  return map;
}
