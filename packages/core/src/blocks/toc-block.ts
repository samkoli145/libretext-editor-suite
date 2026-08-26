/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: toc-block.ts
 * 📂 المسار: packages/core/src/blocks/toc-block.ts
 * 🎯 الهدف الرئيسي: بلوك جدول المحتويات (TOC) لنطاق Writer
 * 📋 المعايير: عمق أقصى للعناوين، تصدير [TOC]، توليد قائمة من العناوين
 * 🧪 الاختبارات: packages/core/tests/blocks/toc-block.test.ts
 * 🏷️ المعرف: BLK-WRITER-TOC
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Derived Content Block — المحتوى يُشتق من عناوين المستند وقت القراءة
 *    (DERIVED, NEVER STORED) — مستوحى من domternal extension-toc (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. TOC لا يخزن العناوين — يُشتق من blocks المستند عند العرض.
 *    2. العمق 1-6 فقط — القيم خارج النطاق تُقص.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isTocBlock).
 *    - قص العمق عبر Math.min/Math.max.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/ast/types.ts, heading-block.ts
 *    - 📚 مراجع: domternal extension-toc
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createTocBlock: إنشاء كتلة فهرس (#L74)
 *    - isTocBlock: فاحص النوع (#L92)
 *    - formatTocMarkdown: تصدير وسم [TOC] (#L99)
 *    - buildTocEntries: اشتقاق مداخل الفهرس من كتل المستند (#L106)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: domternal-main (MIT), LibreText Block Catalog
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface TocBlockData {
  readonly maxDepth: number;
  readonly title: string;
}

export interface TocBlockNode extends BaseBlockNode<TocBlockData> {
  readonly type: 'toc';
  readonly domain: 'writer';
}

/** مدخل واحد في جدول المحتويات. */
export interface TocEntry {
  readonly level: number;
  readonly text: string;
}

export function createTocBlock(id: string, data?: Partial<TocBlockData>): TocBlockNode {
  const rawDepth = data?.maxDepth ?? 3;
  const maxDepth = Math.min(6, Math.max(1, Math.round(rawDepth)));

  return {
    id,
    type: 'toc',
    domain: 'writer',
    traits: ['draggable', 'styleable'] as readonly TraitKey[],
    data: {
      maxDepth,
      title: data?.title ?? 'جدول المحتويات',
    },
  };
}

export function isTocBlock(node: unknown): node is TocBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as TocBlockNode;
  return b.type === 'toc' && b.domain === 'writer';
}

export function formatTocMarkdown(_node: TocBlockNode): string {
  return '[TOC]';
}

/**
 * اشتقاق مداخل الفهرس من كتل المستند — يعمل مع الشكلين
 * (HeadingBlockNode الرسمي وأي كتلة type=heading مع attrs.level).
 */
export function buildTocEntries(
  blocks: ReadonlyArray<{ type: string; content?: string; attrs?: Record<string, unknown> }>,
  maxDepth: number,
): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const block of blocks) {
    if (block.type !== 'heading') continue;
    const level = typeof block.attrs?.level === 'number' ? block.attrs.level : 1;
    if (level > maxDepth) continue;
    entries.push({ level, text: block.content ?? '' });
  }
  return entries;
}
