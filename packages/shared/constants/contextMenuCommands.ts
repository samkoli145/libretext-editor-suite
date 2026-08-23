/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: المعرفات القياسية لأوامر القائمة السياقية - Context Menu Commands
 * 🏛️ الدور: مكون مشترك - توحيد أوامر الكانفا والنصوص والجداول والصور
 * 📥 المستهلك: SharedContextMenu, CommandRegistry, كل المحررات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Centralized Command IDs: معرفات أوامر مركزة
 *    مع بناء بنود القوائم بالعربية والفصل المنطقي
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المعرفات يجب أن تبقى فريدة
 *    2. الترجمة العربية يجب أن تكون دقيقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص عدم تكرار المعرفات
 *    - fallback لأمر عام
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const ContextMenuCommands = {
  // ─── أوامر Canvas ─────────────────────────────
  CANVAS_DUPLICATE: 'canvas:duplicate',
  CANVAS_DELETE: 'canvas:delete',
  CANVAS_ALIGN_LEFT: 'canvas:align-left',
  CANVAS_ALIGN_CENTER: 'canvas:align-center',
  CANVAS_ALIGN_RIGHT: 'canvas:align-right',
  CANVAS_ALIGN_TOP: 'canvas:align-top',
  CANVAS_ALIGN_MIDDLE: 'canvas:align-middle',
  CANVAS_ALIGN_BOTTOM: 'canvas:align-bottom',
  CANVAS_BRING_TO_FRONT: 'canvas:bring-to-front',
  CANVAS_BRING_FORWARD: 'canvas:bring-forward',
  CANVAS_SEND_BACKWARD: 'canvas:send-backward',
  CANVAS_SEND_TO_BACK: 'canvas:send-to-back',
  CANVAS_LOCK: 'canvas:lock',
  CANVAS_UNLOCK: 'canvas:unlock',

  // ─── أوامر التنسيق ─────────────────────────────
  FORMAT_BOLD: 'format:bold',
  FORMAT_ITALIC: 'format:italic',
  FORMAT_UNDERLINE: 'format:underline',
  FORMAT_STRIKETHROUGH: 'format:strikethrough',
  FORMAT_CLEAR: 'format:clear',

  // ─── أوامر التحرير ─────────────────────────────
  EDIT_CUT: 'edit:cut',
  EDIT_COPY: 'edit:copy',
  EDIT_PASTE: 'edit:paste',
  EDIT_UNDO: 'edit:undo',
  EDIT_REDO: 'edit:redo',

  // ─── أوامر الإدراج ─────────────────────────────
  INSERT_IMAGE: 'insert:image',
  INSERT_TABLE: 'insert:table',
  INSERT_LINK: 'insert:link',
  LATEX_INSERT_EQUATION: 'latex:insert-equation',

  // ─── أوامر المستند ─────────────────────────────
  DOCUMENT_SAVE: 'document:save',
  DOCUMENT_EXPORT_PDF: 'document:export-pdf',
  DOCUMENT_PRINT: 'document:print',
} as const;

/**
 * تعريف بند في القائمة السياقية.
 */
export interface ContextMenuItemDefinition {
  id: string;
  label: string;
  commandId?: string;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  children?: ContextMenuItemDefinition[];
}

/**
 * أنواع العناصر التي يمكن أن تظهر عليها القائمة السياقية.
 */
export type ContextTargetType =
  | 'canvas-element'
  | 'canvas-background'
  | 'text'
  | 'text-selection'
  | 'image'
  | 'table'
  | 'table-cell'
  | 'link'
  | 'default';

/**
 * بناء بنود القائمة السياقية حسب نوع العنصر الهدف.
 *
 * @param targetType - نوع العنصر الهدف
 * @param isRtl - هل الواجهة RTL؟
 * @returns قائمة البنود
 */
export function buildContextMenuItems(
  targetType: ContextTargetType,
  isRtl: boolean = true,
): ContextMenuItemDefinition[] {
  switch (targetType) {
    case 'canvas-element':
      return [
        {
          id: 'cm-duplicate',
          label: 'تكرار',
          commandId: ContextMenuCommands.CANVAS_DUPLICATE,
          shortcut: 'Ctrl+D',
        },
        {
          id: 'cm-delete',
          label: 'حذف',
          commandId: ContextMenuCommands.CANVAS_DELETE,
          shortcut: 'Delete',
        },
        { id: 'cm-sep-1', label: '', separator: true },
        {
          id: 'cm-align',
          label: 'محاذاة',
          children: [
            {
              id: 'cm-align-left',
              label: 'محاذاة يسار',
              commandId: ContextMenuCommands.CANVAS_ALIGN_LEFT,
            },
            {
              id: 'cm-align-center',
              label: 'محاذاة وسط',
              commandId: ContextMenuCommands.CANVAS_ALIGN_CENTER,
            },
            {
              id: 'cm-align-right',
              label: 'محاذاة يمين',
              commandId: ContextMenuCommands.CANVAS_ALIGN_RIGHT,
            },
          ],
        },
        {
          id: 'cm-layer',
          label: 'الطبقات',
          children: [
            {
              id: 'cm-bring-front',
              label: 'إلى الأمام',
              commandId: ContextMenuCommands.CANVAS_BRING_TO_FRONT,
            },
            {
              id: 'cm-send-back',
              label: 'إلى الخلف',
              commandId: ContextMenuCommands.CANVAS_SEND_TO_BACK,
            },
          ],
        },
        { id: 'cm-sep-2', label: '', separator: true },
        { id: 'cm-lock', label: 'قفل العنصر', commandId: ContextMenuCommands.CANVAS_LOCK },
      ];

    case 'canvas-background':
      return [
        {
          id: 'cm-paste',
          label: 'لصق',
          commandId: ContextMenuCommands.EDIT_PASTE,
          shortcut: 'Ctrl+V',
        },
        { id: 'cm-sep-1', label: '', separator: true },
        {
          id: 'cm-select-all',
          label: 'تحديد الكل',
          commandId: 'canvas:select-all',
          shortcut: 'Ctrl+A',
        },
      ];

    case 'text':
    case 'text-selection':
      return [
        { id: 'cm-cut', label: 'قص', commandId: ContextMenuCommands.EDIT_CUT, shortcut: 'Ctrl+X' },
        {
          id: 'cm-copy',
          label: 'نسخ',
          commandId: ContextMenuCommands.EDIT_COPY,
          shortcut: 'Ctrl+C',
        },
        {
          id: 'cm-paste',
          label: 'لصق',
          commandId: ContextMenuCommands.EDIT_PASTE,
          shortcut: 'Ctrl+V',
        },
        { id: 'cm-sep-1', label: '', separator: true },
        {
          id: 'cm-bold',
          label: 'عريض',
          commandId: ContextMenuCommands.FORMAT_BOLD,
          shortcut: 'Ctrl+B',
        },
        {
          id: 'cm-italic',
          label: 'مائل',
          commandId: ContextMenuCommands.FORMAT_ITALIC,
          shortcut: 'Ctrl+I',
        },
        {
          id: 'cm-underline',
          label: 'تسطير',
          commandId: ContextMenuCommands.FORMAT_UNDERLINE,
          shortcut: 'Ctrl+U',
        },
        { id: 'cm-sep-2', label: '', separator: true },
        { id: 'cm-insert-link', label: 'إدراج رابط', commandId: ContextMenuCommands.INSERT_LINK },
        {
          id: 'cm-insert-equation',
          label: 'إدراج معادلة',
          commandId: ContextMenuCommands.LATEX_INSERT_EQUATION,
        },
      ];

    case 'image':
      return [
        { id: 'cm-copy', label: 'نسخ الصورة', commandId: ContextMenuCommands.EDIT_COPY },
        { id: 'cm-duplicate', label: 'تكرار', commandId: ContextMenuCommands.CANVAS_DUPLICATE },
        { id: 'cm-delete', label: 'حذف', commandId: ContextMenuCommands.CANVAS_DELETE },
        { id: 'cm-sep-1', label: '', separator: true },
        {
          id: 'cm-align',
          label: 'محاذاة',
          children: [
            {
              id: 'cm-align-left',
              label: 'يسار',
              commandId: ContextMenuCommands.CANVAS_ALIGN_LEFT,
            },
            {
              id: 'cm-align-center',
              label: 'وسط',
              commandId: ContextMenuCommands.CANVAS_ALIGN_CENTER,
            },
            {
              id: 'cm-align-right',
              label: 'يمين',
              commandId: ContextMenuCommands.CANVAS_ALIGN_RIGHT,
            },
          ],
        },
      ];

    case 'table':
    case 'table-cell':
      return [
        { id: 'cm-cut', label: 'قص', commandId: ContextMenuCommands.EDIT_CUT },
        { id: 'cm-copy', label: 'نسخ', commandId: ContextMenuCommands.EDIT_COPY },
        { id: 'cm-paste', label: 'لصق', commandId: ContextMenuCommands.EDIT_PASTE },
        { id: 'cm-sep-1', label: '', separator: true },
        { id: 'cm-add-row', label: 'إضافة صف', commandId: 'table:add-row' },
        { id: 'cm-add-col', label: 'إضافة عمود', commandId: 'table:add-column' },
        { id: 'cm-delete-row', label: 'حذف صف', commandId: 'table:delete-row' },
        { id: 'cm-delete-col', label: 'حذف عمود', commandId: 'table:delete-column' },
        { id: 'cm-delete-table', label: 'حذف الجدول', commandId: 'table:delete' },
      ];

    case 'link':
      return [
        { id: 'cm-open', label: 'فتح الرابط', commandId: 'link:open' },
        { id: 'cm-copy', label: 'نسخ الرابط', commandId: 'link:copy' },
        { id: 'cm-edit', label: 'تحرير الرابط', commandId: ContextMenuCommands.INSERT_LINK },
        { id: 'cm-remove', label: 'إزالة الرابط', commandId: 'link:remove' },
      ];

    default:
      return [
        {
          id: 'cm-undo',
          label: 'تراجع',
          commandId: ContextMenuCommands.EDIT_UNDO,
          shortcut: 'Ctrl+Z',
        },
        {
          id: 'cm-redo',
          label: 'إعادة',
          commandId: ContextMenuCommands.EDIT_REDO,
          shortcut: 'Ctrl+Y',
        },
        { id: 'cm-sep-1', label: '', separator: true },
        {
          id: 'cm-save',
          label: 'حفظ',
          commandId: ContextMenuCommands.DOCUMENT_SAVE,
          shortcut: 'Ctrl+S',
        },
        { id: 'cm-print', label: 'طباعة', commandId: ContextMenuCommands.DOCUMENT_PRINT },
      ];
  }
}
