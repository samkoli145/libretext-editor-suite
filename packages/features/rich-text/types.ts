/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: أنواع محرر النصوص الغنية - Rich Text Types
 * 🏛️ الدور: نوع مشترك - تعريفات Selection وCoords والخصائص
 * 📥 المستهلك: RichTextEditor, SharedFormattingToolbar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Editor State Types: أنواع لحالة المحرر (اختيار، إحداثيات، خصائص)
 *    لضمان التوافق بين المكونات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. from/to يجب أن يكونا صحيحيْن
 *    2. الإحداثيات يجب أن تتناسب مع الشاشة
 *    3. some properties يجب أن تكون اختيارية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة from/to
 *    - fallback لإحداثيات صفر
 *    - تعامل مع القيم الفارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EditorSelection {
  from: number;
  to: number;
  empty: boolean;
}

export interface EditorCoords {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface HeadingItem {
  id: string;
  level: number;
  text: string;
  pos: number;
}

export interface TextStyleAttributes {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
}

export type EditorEventType = 'transaction' | 'update' | 'selectionUpdate' | 'focus' | 'blur';

export interface ChainCommands {
  focus: () => ChainCommands;
  blur: () => ChainCommands;
  selectAll: () => ChainCommands;
  toggleBold: () => ChainCommands;
  setBold: () => ChainCommands;
  toggleItalic: () => ChainCommands;
  setItalic: () => ChainCommands;
  toggleUnderline: () => ChainCommands;
  setUnderline: () => ChainCommands;
  toggleStrike: () => ChainCommands;
  toggleSubscript: () => ChainCommands;
  toggleSuperscript: () => ChainCommands;
  setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => ChainCommands;
  toggleHeading: (attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => ChainCommands;
  setParagraph: () => ChainCommands;
  toggleBulletList: () => ChainCommands;
  toggleOrderedList: () => ChainCommands;
  toggleBlockquote: () => ChainCommands;
  toggleCodeBlock: () => ChainCommands;
  setFontFamily: (fontFamily: string) => ChainCommands;
  setFontSize: (fontSize: string) => ChainCommands;
  setColor: (color: string) => ChainCommands;
  unsetColor: () => ChainCommands;
  setHighlight: (attrs?: { color?: string } | string) => ChainCommands;
  toggleHighlight: (attrs?: { color?: string } | string) => ChainCommands;
  unsetHighlight: () => ChainCommands;
  unsetAllMarks: () => ChainCommands;
  clearNodes: () => ChainCommands;
  setHorizontalRule: () => ChainCommands;
  setLineHeight?: (height: string) => ChainCommands;
  setLink: (attrs: { href: string; target?: string | null }) => ChainCommands;
  unsetLink: () => ChainCommands;
  extendMarkRange: (type: string) => ChainCommands;
  setImage: (attrs: { src: string; alt?: string; title?: string }) => ChainCommands;
  insertContent: (content: string) => ChainCommands;
  setPageBreak: () => ChainCommands;
  insertTable: (options?: {
    rows?: number;
    cols?: number;
    withHeaderRow?: boolean;
  }) => ChainCommands;
  addRowBefore: () => ChainCommands;
  addRowAfter: () => ChainCommands;
  deleteRow: () => ChainCommands;
  addColumnBefore: () => ChainCommands;
  addColumnAfter: () => ChainCommands;
  deleteColumn: () => ChainCommands;
  deleteTable: () => ChainCommands;
  mergeCells: () => ChainCommands;
  splitCell: () => ChainCommands;
  mergeOrSplit: () => ChainCommands;
  setCellAttribute: (attribute: string, value: any) => ChainCommands;
  toggleHeaderRow?: () => ChainCommands;
  toggleHeaderColumn?: () => ChainCommands;
  toggleHeaderCell?: () => ChainCommands;
  undo: () => ChainCommands;
  redo: () => ChainCommands;
  setTextSelection: (pos: number) => ChainCommands;
  run: () => boolean;
}

export interface INativeEditor {
  element: HTMLElement | null;
  state: {
    selection: EditorSelection;
    doc: {
      descendants: (callback: (node: any, pos: number) => boolean | void) => void;
      textContent: string;
    };
  };
  view: {
    coordsAtPos: (pos: number) => { top: number; left: number; right: number; bottom: number };
    dom: HTMLElement | null;
  };
  commands: {
    setContent: (content: any, options?: { emitUpdate?: boolean }) => boolean;
    clearContent: (emitUpdate?: boolean) => boolean;
    focus: () => boolean;
    blur: () => boolean;
    undo: () => boolean;
    redo: () => boolean;
    toggleBold: () => boolean;
    toggleItalic: () => boolean;
    toggleUnderline: () => boolean;
    toggleStrike: () => boolean;
    toggleSubscript: () => boolean;
    toggleSuperscript: () => boolean;
    setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => boolean;
    toggleHeading: (attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => boolean;
    setParagraph: () => boolean;
    toggleBulletList: () => boolean;
    toggleOrderedList: () => boolean;
    toggleBlockquote: () => boolean;
    toggleCodeBlock: () => boolean;
    setFontFamily: (fontFamily: string) => boolean;
    setFontSize: (fontSize: string) => boolean;
    setColor: (color: string) => boolean;
    setHighlight: (attrs?: { color?: string } | string) => boolean;
    unsetHighlight: () => boolean;
    unsetAllMarks: () => boolean;
    clearNodes: () => boolean;
    setHorizontalRule?: () => boolean;
    setLink: (attrs: { href: string; target?: string | null }) => boolean;
    unsetLink: () => boolean;
    setImage: (attrs: { src: string; alt?: string; title?: string }) => boolean;
    insertContent: (content: string) => boolean;
    setPageBreak: () => boolean;
    insertTable: (options?: { rows?: number; cols?: number; withHeaderRow?: boolean }) => boolean;
    addRowBefore: () => boolean;
    addRowAfter: () => boolean;
    deleteRow: () => boolean;
    addColumnBefore: () => boolean;
    addColumnAfter: () => boolean;
    deleteColumn: () => boolean;
    deleteTable: () => boolean;
    mergeCells: () => boolean;
    splitCell: () => boolean;
    setCellAttribute: (attribute: string, value: any) => boolean;
  };
  chain: () => ChainCommands;
  can: () => {
    undo: () => boolean;
    redo: () => boolean;
    [key: string]: any;
  };
  isActive: (name: string | Record<string, any>, attributes?: Record<string, any>) => boolean;
  getAttributes: (name: string) => Record<string, any>;
  getHTML: () => string;
  getJSON: () => any;
  getText: () => string;
  isEmpty: () => boolean;
  isFocused: boolean;
  on: (event: EditorEventType, callback: (eventData?: any) => void) => void;
  off: (event: EditorEventType, callback: (eventData?: any) => void) => void;
  destroy: () => void;
}
