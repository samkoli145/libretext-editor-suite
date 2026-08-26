/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: math-block.ts
 * 📂 المسار: packages/core/src/blocks/math-block.ts
 * 🎯 الهدف الرئيسي: بلوك المعادلات الرياضية (LaTeX) لنطاق Writer
 * 📋 المعايير: دعم inline/display، تحقق أساسي من توازن الأقواس، Markdown $$..$$
 * 🧪 الاختبارات: packages/core/tests/blocks/math-block.test.ts
 * 🏷️ المعرف: BLK-WRITER-MATH
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency LaTeX Source Block (العرض عبر محرك LaTeX في shared لاحقاً)
 *    المستوحى من domternal extension-math (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. لا يُقيّم هذا البلوك أي كود — يخزن مصدر LaTeX نصياً فقط (أمان).
 *    2. توازن $ الفردية داخل المصدر قد يكسر العرض — نتحقق من التوازن.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isMathBlock).
 *    - قص المصدر لحد أقصى 10,000 حرف.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/ast/types.ts
 *    - 📚 مراجع: domternal extension-math, shared/lib-core/latex/
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createMathBlock: إنشاء كتلة معادلة (#L70)
 *    - isMathBlock: فاحص النوع (#L88)
 *    - formatMathMarkdown: تصدير $$...$$ أو $...$ (#L95)
 *    - hasBalancedDelimiters: فحص توازن $ (#L102)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: domternal-main (MIT), LibreText Block Catalog
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

const MAX_LATEX_LENGTH = 10_000;

export interface MathBlockData {
  readonly latex: string;
  readonly displayMode: boolean;
}

export interface MathBlockNode extends BaseBlockNode<MathBlockData> {
  readonly type: 'math';
  readonly domain: 'writer';
}

export function createMathBlock(
  id: string,
  data?: Partial<MathBlockData>,
): MathBlockNode {
  const latex = (data?.latex ?? '').slice(0, MAX_LATEX_LENGTH);

  return {
    id,
    type: 'math',
    domain: 'writer',
    traits: ['draggable', 'styleable'] as readonly TraitKey[],
    data: {
      latex,
      displayMode: data?.displayMode ?? true,
    },
  };
}

export function isMathBlock(node: unknown): node is MathBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as MathBlockNode;
  return b.type === 'math' && b.domain === 'writer';
}

export function formatMathMarkdown(node: MathBlockNode): string {
  if (!node.data.latex) return '';
  return node.data.displayMode ? `$$\n${node.data.latex}\n$$` : `$${node.data.latex}$`;
}

/** فحص توازن محددات $ (عدد زوجي خارج $$). */
export function hasBalancedDelimiters(latex: string): boolean {
  let count = 0;
  let i = 0;
  while (i < latex.length) {
    if (latex[i] === '$') {
      if (latex[i + 1] === '$') {
        i += 2;
        continue;
      }
      count++;
    }
    i++;
  }
  return count % 2 === 0;
}
