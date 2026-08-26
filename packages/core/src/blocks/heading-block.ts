/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: heading-block.ts
 * 📂 المسار: src/blocks/heading-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك العناوين الهيكلية (H1-H6) لنطاق Writer
 * 📋 المعايير: دعم مستويات 1-6، الترقيم التلقائي، ومحددات الإرساء Anchor Links
 * 🧪 الاختبارات: التحقق من صحة المستويات وتوليد كود Markdown/HTML
 * 🏷️ المعرف: BLK-WRITER-HEAD
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Level-constrained AST Node + Slug Generator + Pure Serializer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. قصر المستوى بين 1 و 6 بدقة وحظر المستويات خارج النطاق.
 *    2. ضمان عدم فراغ anchorId للربط التلقائي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية clampHeadingLevel لضبط المستوى.
 *    - type guard (isHeadingBlock).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - clampHeadingLevel: تقييد المستوى بين 1 و 6 (#L50)
 *    - createHeadingBlock: إنشاء كتلة عنوان (#L55)
 *    - isHeadingBlock: فاحص نوع العنوان (#L72)
 *    - formatHeadingMarkdown: تحويل العنوان لـ Markdown (#L79)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يوفر العقد الأساسي لتوليد جدول المحتويات (TOC).
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: إضافة خوارزمية الترقيم التسلسلي الهرمي
 *    - 📖 مرجع تقني: LibreText Block Catalog & Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, InlineNode, TraitKey, NodeId } from '../ast/types';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingBlockData {
  readonly level: HeadingLevel;
  readonly align?: 'left' | 'center' | 'right';
  readonly numbered?: boolean;
  readonly anchorId: string;
}

export interface HeadingBlockNode extends BaseBlockNode<HeadingBlockData> {
  readonly type: 'heading';
  readonly domain: 'writer';
  readonly content: readonly InlineNode[];
}

export function clampHeadingLevel(level: number): HeadingLevel {
  const rounded = Math.round(level);
  if (rounded <= 1) return 1;
  if (rounded >= 6) return 6;
  return rounded as HeadingLevel;
}

export function createHeadingBlock(
  id: string,
  content: readonly InlineNode[],
  level: number = 1,
  data?: Partial<HeadingBlockData>,
): HeadingBlockNode {
  const safeLevel = clampHeadingLevel(level);
  const plainText = content.map((c) => (c.type === 'text' ? c.text : '')).join('');
  const fallbackAnchor = `head-${id}-${plainText.slice(0, 15).replace(/\s+/g, '-').toLowerCase()}`;

  return {
    id,
    type: 'heading',
    domain: 'writer',
    traits: ['styleable', 'draggable'] as readonly TraitKey[],
    data: {
      level: safeLevel,
      align: data?.align ?? 'right',
      numbered: data?.numbered ?? false,
      anchorId: data?.anchorId ?? fallbackAnchor,
    },
    content:
      content.length > 0
        ? content
        : [{ id: `${id}-txt-1` as NodeId, type: 'text', text: 'عنوان جديد' }],
  };
}

export function isHeadingBlock(node: unknown): node is HeadingBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as HeadingBlockNode;
  return b.type === 'heading' && b.domain === 'writer' && typeof b.data?.level === 'number';
}

export function formatHeadingMarkdown(node: HeadingBlockNode): string {
  const hashes = '#'.repeat(node.data.level);
  const textParts = node.content
    .map((inline) => (inline.type === 'text' ? inline.text : ''))
    .join('');
  return `${hashes} ${textParts}`;
}
