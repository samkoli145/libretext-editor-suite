/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: details-block.ts
 * 📂 المسار: packages/core/src/blocks/details-block.ts
 * 🎯 الهدف الرئيسي: بلوك الأكورديون/المنسدل (Details/Toggle) لنطاق Writer
 * 📋 المعايير: ملخص + محتوى، حالة انفتاح، Markdown <details><summary>
 * 🧪 الاختبارات: packages/core/tests/blocks/details-block.test.ts
 * 🏷️ المعرف: BLK-WRITER-DETAILS
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Collapsible Content Container — مستوحى من domternal extension-details (MIT)
 *    وGitHub Flavored Markdown <details> semantics
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المحتوى نص خام متعدد الأسطر — لا يُنقّى هنا (التنقية في html-pipeline).
 *    2. summary فارغ يكسر دلالات <details> — نستبدله بنص افتراضي عند التصدير.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isDetailsBlock).
 *    - حد أقصى للمحتوى 100,000 حرف.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/ast/types.ts
 *    - 📚 مراجع: domternal extension-details
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createDetailsBlock: إنشاء كتلة منسدلة (#L72)
 *    - isDetailsBlock: فاحص النوع (#L92)
 *    - formatDetailsMarkdown: تصدير <details><summary> (#L99)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: domternal-main (MIT), GFM Details semantics
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

const MAX_CONTENT_LENGTH = 100_000;

export interface DetailsBlockData {
  readonly summary: string;
  readonly content: string;
  readonly open: boolean;
}

export interface DetailsBlockNode extends BaseBlockNode<DetailsBlockData> {
  readonly type: 'details';
  readonly domain: 'writer';
}

export function createDetailsBlock(
  id: string,
  data?: Partial<DetailsBlockData>,
): DetailsBlockNode {
  return {
    id,
    type: 'details',
    domain: 'writer',
    traits: ['draggable', 'styleable'] as readonly TraitKey[],
    data: {
      summary: data?.summary ?? 'تفاصيل',
      content: (data?.content ?? '').slice(0, MAX_CONTENT_LENGTH),
      open: data?.open ?? false,
    },
  };
}

export function isDetailsBlock(node: unknown): node is DetailsBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as DetailsBlockNode;
  return b.type === 'details' && b.domain === 'writer';
}

export function formatDetailsMarkdown(node: DetailsBlockNode): string {
  const summary = node.data.summary.trim() || 'تفاصيل';
  const attrs = node.data.open ? ' open' : '';
  return `<details${attrs}>\n<summary>${summary}</summary>\n\n${node.data.content}\n\n</details>`;
}
