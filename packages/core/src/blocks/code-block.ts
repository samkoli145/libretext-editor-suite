/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: code-block.ts
 * 📂 المسار: src/blocks/code-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك الأكواد البرمجية الثابتة والتوثيقية لنطاق Writer
 * 📋 المعايير: دعم اللغات البرمجية، ترقيم الأسطر، وتظليل الأسطر الخاصة
 * 🧪 الاختبارات: التحقق من كود البرمجة وتوليد كتل الكود المسورة Fenced Blocks
 * 🏷️ المعرف: BLK-WRITER-CODE
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Language-Tagged Block Node + Line-Number State + Fenced Markdown Serializer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم كسر الرموز الخاصة مثل `<` و `>` في محتوى الكود.
 *    2. ضمان خلفية فاتحة متباينة (Pure Daylight Code Container).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isCodeBlock).
 *    - حماية محتوى الكود من قيمة null أو undefined.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createCodeBlock: إنشاء كتلة كود توثيقية (#L50)
 *    - isCodeBlock: فاحص نوع كتلة الكود (#L70)
 *    - formatCodeBlockMarkdown: تحويل كتلة الكود لـ Markdown (#L77)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يختلف عن code-editor التفاعلي المخصص للتشغيل الحي للبرمجيات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم زر نسخ سريع وتظليل القواعد البرمجية
 *    - 📖 مرجع تقني: Markdown Fenced Code Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export interface CodeBlockData {
  readonly language: string;
  readonly code: string;
  readonly showLineNumbers: boolean;
  readonly highlightLines?: readonly number[];
  readonly filename?: string;
}

export interface CodeBlockNode extends BaseBlockNode<CodeBlockData> {
  readonly type: 'code_block';
  readonly domain: 'writer';
}

export function createCodeBlock(
  id: string,
  code: string,
  language: string = 'typescript',
  data?: Partial<CodeBlockData>,
): CodeBlockNode {
  return {
    id,
    type: 'code_block',
    domain: 'writer',
    traits: ['styleable', 'lockable'] as readonly TraitKey[],
    data: {
      code,
      language: language.toLowerCase().trim() || 'plaintext',
      showLineNumbers: data?.showLineNumbers ?? true,
      highlightLines: data?.highlightLines ?? [],
      filename: data?.filename,
    },
  };
}

export function isCodeBlock(node: unknown): node is CodeBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as CodeBlockNode;
  return b.type === 'code_block' && typeof b.data?.code === 'string';
}

export function formatCodeBlockMarkdown(node: CodeBlockNode): string {
  const lang = node.data.language || '';
  const code = node.data.code || '';
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYNTAX HIGHLIGHTING — تظليل نحوي عبر liveInterpreterEngine الجاهز
// ━━━━━━━━━━━═════════════════════════════════════════════════

import { liveInterpreterEngine } from '../../../shared/lib-core/code-interpreter/live-interpreter-engine';
import type { CodeToken, SupportedLanguage } from '../../../shared/lib-core/code-interpreter/live-interpreter-engine';

/** اللغات المدعومة للتظليل النحوي الفوري. */
export const HIGHLIGHTABLE_LANGUAGES: readonly SupportedLanguage[] = [
  'html',
  'css',
  'javascript',
  'typescript',
  'json',
  'markdown',
  'latex',
  'svg',
  'xml',
  'yaml',
];

/** هل يمكن تظليل هذه اللغة؟ */
export function isHighlightable(language: string): boolean {
  return HIGHLIGHTABLE_LANGUAGES.includes(
    language.toLowerCase().trim() as SupportedLanguage,
  );
}

/**
 * تظليل نحوي للكتلة — يرجع رموزاً لكل سطر عبر المحرك الجاهز.
 * لغة غير مدعومة → null (تُعرض كنص عادي).
 */
export function tokenizeCodeBlock(node: CodeBlockNode): CodeToken[][] | null {
  if (!isHighlightable(node.data.language)) return null;
  return liveInterpreterEngine.tokenize(
    node.data.code,
    node.data.language as SupportedLanguage,
  );
}

/** تحويل الرموز إلى HTML spans بأصناف CSS قياسية. */
export function tokensToHtml(lines: readonly CodeToken[][]): string {
  return lines
    .map(line =>
      line
        .map(token => `<span class="tok-${token.type}">${escapeCodeHtml(token.value)}</span>`)
        .join(''),
    )
    .join('\n');
}

function escapeCodeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
