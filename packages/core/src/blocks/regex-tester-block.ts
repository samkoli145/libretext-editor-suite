/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: regex-tester-block.ts
 * 📂 المسار: packages/core/src/blocks/regex-tester-block.ts
 * 🎯 الهدف الرئيسي: بلوك اختبار تعبير نمطي حي مع تمييز التطابقات والاستبدال
 * 📋 المعايير: regex آمن (المحرك يعالج الأخطاء)، قوالب جاهزة، حد نص 50KB
 * 🧪 الاختبارات: packages/core/tests/blocks/interactive-code-blocks.test.ts
 * 🏷️ المعرف: BLK-WRITER-REGEX-TESTER
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Live Evaluation Block — النتيجة تُحسب وقت الطلب عبر RegexTesterEngine
 *    الجاهز (لا تُخزن أبداً) + قوالب شائعة جاهزة (بريد، رابط، هاتف...)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. نمط غير صالح → isValid:false مع رسالة — لا رمي استثناء.
 *    2. ReDoS: المحرك ينظف الأعلام؛ حد النص 50KB يقلل سطح الهجوم.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isRegexTesterBlock).
 *    - تنظيف الأعلام في المحرك نفسه (gimsuy فقط).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/ast/types.ts, shared/lib-core/code-interpreter/regex-tester-engine.ts
 *    - 🧪 اختبارات: tests/blocks/interactive-code-blocks.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createRegexTesterBlock: إنشاء كتلة اختبار (#L84)
 *    - isRegexTesterBlock: فاحص النوع (#L104)
 *    - runRegexTest: تنفيذ الاختبار الحي (#L111)
 *    - applyRegexPreset: تطبيق قالب جاهز (#L124)
 *    - listRegexPresets: قائمة القوالب المتاحة (#L136)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: shared/lib-core/code-interpreter/regex-tester-engine.ts (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';
import {
  RegexTesterEngine,
  COMMON_REGEX_PRESETS,
} from '../../../shared/lib-core/code-interpreter/regex-tester-engine';
import type {
  RegexTestResult,
  RegexPreset,
} from '../../../shared/lib-core/code-interpreter/regex-tester-engine';

const MAX_TEXT_LENGTH = 50_000;

export interface RegexTesterBlockData {
  readonly pattern: string;
  readonly flags: string;
  readonly testText: string;
  readonly replacement?: string;
  readonly presetId?: string;
}

export interface RegexTesterBlockNode extends BaseBlockNode<RegexTesterBlockData> {
  readonly type: 'regex_tester';
  readonly domain: 'writer';
}

export function createRegexTesterBlock(
  id: string,
  data?: Partial<RegexTesterBlockData>,
): RegexTesterBlockNode {
  return {
    id,
    type: 'regex_tester',
    domain: 'writer',
    traits: ['draggable', 'styleable'] as readonly TraitKey[],
    data: {
      pattern: data?.pattern ?? '',
      flags: data?.flags ?? 'g',
      testText: (data?.testText ?? '').slice(0, MAX_TEXT_LENGTH),
      replacement: data?.replacement,
      presetId: data?.presetId,
    },
  };
}

export function isRegexTesterBlock(node: unknown): node is RegexTesterBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as RegexTesterBlockNode;
  return b.type === 'regex_tester' && b.domain === 'writer';
}

/** تنفيذ الاختبار الحي — النتيجة مشتقة لا مخزنة. */
export function runRegexTest(node: RegexTesterBlockNode): RegexTestResult {
  return RegexTesterEngine.test(
    node.data.pattern,
    node.data.flags,
    node.data.testText,
    node.data.replacement,
  );
}

/** تطبيق قالب جاهز على الكتلة (immutable). */
export function applyRegexPreset(
  node: RegexTesterBlockNode,
  presetId: string,
): RegexTesterBlockNode {
  const preset = COMMON_REGEX_PRESETS.find(p => p.id === presetId);
  if (!preset) return node;

  return {
    ...node,
    data: {
      ...node.data,
      pattern: preset.pattern,
      flags: preset.flags,
      testText: preset.sampleText,
      presetId: preset.id,
    },
  };
}

/** القوالب الجاهزة المتاحة. */
export function listRegexPresets(): readonly RegexPreset[] {
  return COMMON_REGEX_PRESETS;
}
