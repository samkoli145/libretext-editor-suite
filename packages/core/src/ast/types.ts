/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/core/src/ast/types.ts
 * 🎯 الهدف الرئيسي: تعريف جميع الأنواع والواجهات الأساسية لنظام AST
 *    بما في ذلك أنواع الكتل (Block Nodes) والعناصر المضمنة (Inline Nodes)
 *    والأنماط (Marks) والمستند (Document).
 * 📋 المعايير:
 *    - يجب أن تكون جميع الأنواع immutable (readonly).
 *    - يجب أن تحتوي كل عقدة على id فريد.
 *    - يجب أن يتوافق نظام الأنواع مع معايير TypeScript الصارمة.
 * 🧪 الاختبارات:
 *    - packages/core/tests/ast/types.test.ts
 *    - اختبار تعريف الأنواع
 *    - اختبار التحقق من البنية
 * 🏷️ المعرف: CORE-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Discriminated Union Types — استخدام `type` كمعرف فرعي للتمييز بين أنواع الكتل.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم استخدام `any` أو `unknown` بدلاً من الأنواع المحددة.
 *    2. التأكد من أن كل عقدة تحتوي على `type` فريد للتمييز.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type guards لكل نوع عقدة.
 *    - قيم افتراضية آمنة لكل خاصية اختيارية.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - ProseMirror (https://prosemirror.net/) - نمط تمثيل العقد.
 *    - Quill.js (https://quilljs.com/) - نمط العمليات.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── المعرف الفريد ───
export type NodeId = string & { readonly __brand: 'NodeId' };

// ─── الموقع المكاني (لـ Impress) ───
export interface LogicalPosition {
  readonly x: number;
  readonly y: number;
  readonly unit?: 'px' | 'cm' | 'inch' | 'pt';
}

// ─── أنواع العناصر المضمنة (Inline Node Types) ───
export type InlineNodeType =
  'text' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link' | 'mention';

// ─── أنواع الكتل (Block Node Types) ───
export type BlockNodeType =
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'list-item'
  | 'code-block'
  | 'blockquote'
  | 'table'
  | 'table-row'
  | 'table-cell'
  | 'horizontal-rule'
  | 'image'
  | 'embed';

// ─── أنواع الأنماط (Mark Types) ───
export type MarkType = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link';

// ─── الأنماط ───
export interface Mark {
  readonly type: MarkType;
  readonly attrs?: Readonly<Record<string, string>>;
}

// ─── العقدة المضمنة (Inline Node) ───
export interface TextNode {
  readonly type: 'text';
  readonly id: NodeId;
  readonly text: string;
  readonly marks?: readonly Mark[];
}

export interface BoldNode {
  readonly type: 'bold';
  readonly id: NodeId;
  readonly content: readonly InlineNode[];
}

export interface ItalicNode {
  readonly type: 'italic';
  readonly id: NodeId;
  readonly content: readonly InlineNode[];
}

export interface UnderlineNode {
  readonly type: 'underline';
  readonly id: NodeId;
  readonly content: readonly InlineNode[];
}

export interface StrikethroughNode {
  readonly type: 'strikethrough';
  readonly id: NodeId;
  readonly content: readonly InlineNode[];
}

export interface CodeNode {
  readonly type: 'code';
  readonly id: NodeId;
  readonly code: string;
}

export interface LinkNode {
  readonly type: 'link';
  readonly id: NodeId;
  readonly href: string;
  readonly content: readonly InlineNode[];
}

export interface MentionNode {
  readonly type: 'mention';
  readonly id: NodeId;
  readonly userId: string;
  readonly label: string;
}

// ─── الاتحاد المركّز للعناصر المضمنة ───
export type InlineNode =
  | TextNode
  | BoldNode
  | ItalicNode
  | UnderlineNode
  | StrikethroughNode
  | CodeNode
  | LinkNode
  | MentionNode;

// ─── كتل الكود ───
export interface CodeBlockNode {
  readonly type: 'code-block';
  readonly id: NodeId;
  readonly language: string;
  readonly code: string;
}

// ─── كتل القوائم ───
export interface ListItemNode {
  readonly type: 'list-item';
  readonly id: NodeId;
  readonly content: readonly BlockNode[];
  readonly nested?: readonly BlockNode[];
}

export interface ListNode {
  readonly type: 'list';
  readonly id: NodeId;
  readonly ordered: boolean;
  readonly items: readonly ListItemNode[];
}

// ─── كتل الجداول ───
export interface TableCellNode {
  readonly type: 'table-cell';
  readonly id: NodeId;
  readonly content: readonly BlockNode[];
  readonly colspan?: number;
  readonly rowspan?: number;
}

export interface TableRowNode {
  readonly type: 'table-row';
  readonly id: NodeId;
  readonly cells: readonly TableCellNode[];
}

export interface TableNode {
  readonly type: 'table';
  readonly id: NodeId;
  readonly rows: readonly TableRowNode[];
}

// ─── الكتل البسيطة ───
export interface ParagraphNode {
  readonly type: 'paragraph';
  readonly id: NodeId;
  readonly content: readonly InlineNode[];
}

export interface HeadingNode {
  readonly type: 'heading';
  readonly id: NodeId;
  readonly level: 1 | 2 | 3 | 4 | 5 | 6;
  readonly content: readonly InlineNode[];
}

export interface BlockquoteNode {
  readonly type: 'blockquote';
  readonly id: NodeId;
  readonly content: readonly BlockNode[];
}

export interface HorizontalRuleNode {
  readonly type: 'horizontal-rule';
  readonly id: NodeId;
}

export interface ImageNode {
  readonly type: 'image';
  readonly id: NodeId;
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
}

export interface EmbedNode {
  readonly type: 'embed';
  readonly id: NodeId;
  readonly embedType: string;
  readonly url: string;
}

// ─── الاتحاد المركّز للكتل ───
export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | CodeBlockNode
  | BlockquoteNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | HorizontalRuleNode
  | ImageNode
  | EmbedNode;

// ─── المستند الجذري ───
export interface DocNode {
  readonly type: 'doc';
  readonly id: NodeId;
  readonly content: readonly BlockNode[];
}

// ─── الاتحاد الشامل لجميع العقد ───
export type Node = BlockNode | InlineNode | DocNode;
export type ASTNode = Node;

// ─── نتائج البحث ───
export interface SearchResult {
  readonly nodeId: NodeId;
  readonly text: string;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly path: readonly NodeId[];
}

// ─── معلومات العقدة ───
export interface NodeInfo {
  readonly node: BlockNode | InlineNode;
  readonly path: readonly NodeId[];
  readonly depth: number;
  readonly parent: BlockNode | DocNode | null;
}

// ─── نتيجة التحقق ───
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly ValidationError[];
}

export interface ValidationError {
  readonly nodeId: NodeId;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

// ─── أنواع المجالات (Domain Types) ───
export type DomainType = 'writer' | 'calc' | 'impress' | 'base' | 'universal';

// ─── مفاتيح السمات (Trait Keys) ───
export type TraitKey = 'draggable' | 'resizable' | 'styleable' | 'lockable';

// ─── علامات النص (Text Marks) ───
export type TextMark = 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'highlight';

// ─── الكتلة الأساسية (Base Block Node) ───
export interface BaseBlockNode<TData = Record<string, unknown>> {
  readonly id: string;
  readonly type: string;
  readonly domain: DomainType;
  readonly data: TData;
  readonly traits: readonly TraitKey[];
  readonly locked?: boolean;
}

// ─── فاحص الكتلة الأساسية ───
export function isBaseBlockNode(node: unknown): node is BaseBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const candidate = node as BaseBlockNode;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.type === 'string' &&
    typeof candidate.domain === 'string' &&
    Array.isArray(candidate.traits)
  );
}
