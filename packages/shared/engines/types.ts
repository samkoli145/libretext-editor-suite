/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: تعريفات الأنواع الشاملة لكافة محركات النظام المشترك
 * 🏛️ الدور: نوع مشترك - يُصدّر الـ Interfaces والـ Types لكل المحركات
 * 📥 المستهلك: كل ملفات shared/engines والمحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Centralized Type Definitions: تعريفات موحدة تمنع التعارض بين المحركات
 *    مع دعم Generic Types للمرونة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. إضافة نوع جديد هنا فقط إذا كان مشتركاً بين محركين+
 *    2. تجنب circular dependencies
 *    3. Types يجب أن تكون أسماؤها واضحة وغير متحدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام Optional Properties حيث يناسب
 *    - عدم استخدام any - استخدام unknown بدلاً منه
 *    - إضافة JSDoc لكل type رئيسي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/types.ts

export type BlockType =
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'container'
  | 'grid'
  | 'column'
  | 'card'
  | 'badge'
  | 'divider'
  | 'table'
  | 'callout'
  | 'connector'
  | 'form'
  | 'input'
  | 'custom'
  | string;

export interface Position {
  line: number;
  col: number;
  offset: number;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface HTMLAttribute {
  name: string;
  value: string;
  quote: '"' | "'" | '';
  range: Range;
  valueRange: Range;
}

export interface HTMLNode {
  type: 'element' | 'text' | 'comment';
  tag?: string;
  attributes: HTMLAttribute[];
  children: HTMLNode[];
  selfClosing: boolean;
  range: Range;
  contentRange?: Range;
}

export interface CSSProperty {
  property: string;
  value: string;
  important: boolean;
  range: Range;
  propertyRange: Range;
  valueRange: Range;
}

export interface CSSRule {
  selector?: string;
  properties: CSSProperty[];
  range: Range;
}

export interface WebBlock {
  id: string;
  type: BlockType;
  tag?: string;
  tagName?: string;
  name?: string;
  content?: string;
  attributes?: Record<string, string>;
  styles?: Record<string, string>;
  size?: number;
  children?: WebBlock[];
}

export interface BlockMapping {
  blockId: string;
  node: HTMLNode;
  htmlRange: Range;
}

export interface MarkdownRenderOptions {
  html?: boolean;
  breaks?: boolean;
  linkify?: boolean;
  typographer?: boolean;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  target?: {
    node?: HTMLNode;
    attribute?: HTMLAttribute;
    property?: CSSProperty;
    position?: Position;
  };
}

export interface ParseError {
  message: string;
  range?: Range;
  severity: 'error' | 'warning' | 'info';
}

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors: ParseError[];
}

export type SupportedFormat = 'html' | 'jsx' | 'tsx' | 'css' | 'inline-style' | 'markdown' | 'json';
