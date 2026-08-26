/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: code-runner-block.ts
 * 📂 المسار: packages/core/src/blocks/code-runner-block.ts
 * 🎯 الهدف الرئيسي: بلوك كود تفاعلي قابل للتنفيذ الحي مع أدوات تحكم ديناميكية
 * 📋 المعايير: لغات مدعومة فقط، قيم تحكم محفوظة، تنفيذ عبر المحرك الجاهز
 * 🧪 الاختبارات: packages/core/tests/blocks/interactive-code-blocks.test.ts
 * 🏷️ المعرف: BLK-WRITER-CODE-RUNNER
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Live Executable Block + Declarative @prop Controls — أدوات التحكم تُستخرج
 *    من تعليقات الكود نفسه (/* @prop {range} [0,100,1] 50 - الوصف *​/) عبر
 *    CodeSandboxRunner الجاهز، والتنفيذ عبر liveInterpreterEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. اللغة يجب أن تكون ضمن SupportedLanguage وإلا تُرجع interpret خطأً.
 *    2. حد الكود 100KB — الأكواد الضخمة تُقص لا ترفض (تجربة سلسة).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isCodeRunnerBlock).
 *    - دمج قيم التحكم المحفوظة مع المستخرجة بأمان (id غير معروف يُتجاهل).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/ast/types.ts, shared/lib-core/code-interpreter/*
 *    - 🧪 اختبارات: tests/blocks/interactive-code-blocks.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createCodeRunnerBlock: إنشاء كتلة تشغيل (#L96)
 *    - isCodeRunnerBlock: فاحص النوع (#L118)
 *    - getInteractiveControls: استخراج أدوات @prop مع دمج القيم المحفوظة (#L125)
 *    - setControlValue: تحديث قيمة أداة بشكل immutable (#L140)
 *    - runCodeBlock: تنفيذ حي عبر liveInterpreterEngine (#L155)
 *    - formatCodeRunnerMarkdown: تصدير fenced code (#L170)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: shared/lib-core/code-interpreter (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';
import {
  liveInterpreterEngine,
} from '../../../shared/lib-core/code-interpreter/live-interpreter-engine';
import type {
  SupportedLanguage,
  InterpretedOutput,
} from '../../../shared/lib-core/code-interpreter/live-interpreter-engine';
import { CodeSandboxRunner } from '../../../shared/lib-core/code-interpreter/code-sandbox-runner';
import type { SandboxControlProp } from '../../../shared/lib-core/code-interpreter/code-sandbox-runner';

const MAX_CODE_LENGTH = 100_000;

export interface CodeRunnerBlockData {
  readonly code: string;
  readonly language: SupportedLanguage;
  readonly autoRun: boolean;
  /** القيم المحفوظة لأدوات التحكم — تُدمج فوق المستخرجة من @prop. */
  readonly controlValues?: Readonly<Record<string, unknown>>;
}

export interface CodeRunnerBlockNode extends BaseBlockNode<CodeRunnerBlockData> {
  readonly type: 'code_runner';
  readonly domain: 'writer';
}

const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
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

function safeLanguage(raw: string | undefined): SupportedLanguage {
  const clean = raw?.toLowerCase().trim() ?? '';
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(clean)
    ? (clean as SupportedLanguage)
    : 'javascript';
}

export function createCodeRunnerBlock(
  id: string,
  data?: Partial<CodeRunnerBlockData>,
): CodeRunnerBlockNode {
  return {
    id,
    type: 'code_runner',
    domain: 'writer',
    traits: ['draggable', 'styleable', 'lockable'] as readonly TraitKey[],
    data: {
      code: (data?.code ?? '').slice(0, MAX_CODE_LENGTH),
      language: safeLanguage(data?.language),
      autoRun: data?.autoRun ?? true,
      controlValues: data?.controlValues ?? {},
    },
  };
}

export function isCodeRunnerBlock(node: unknown): node is CodeRunnerBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as CodeRunnerBlockNode;
  return b.type === 'code_runner' && b.domain === 'writer';
}

/** استخراج أدوات التحكم من تعليقات @prop مع دمج القيم المحفوظة. */
export function getInteractiveControls(node: CodeRunnerBlockNode): SandboxControlProp[] {
  const extracted = CodeSandboxRunner.extractDynamicControls(node.data.code);
  const saved = node.data.controlValues ?? {};
  return extracted.map(control =>
    control.id in saved ? { ...control, value: saved[control.id] } : control,
  );
}

/** تحديث قيمة أداة تحكم بشكل immutable. */
export function setControlValue(
  node: CodeRunnerBlockNode,
  controlId: string,
  value: unknown,
): CodeRunnerBlockNode {
  return {
    ...node,
    data: {
      ...node.data,
      controlValues: { ...node.data.controlValues, [controlId]: value },
    },
  };
}

/** نتيجة تشغيل الكتلة التفاعلية. */
export interface CodeRunResult {
  readonly output: InterpretedOutput;
  readonly controls: SandboxControlProp[];
}

/** تنفيذ حي عبر المحرك الجاهز بعد حقن قيم أدوات التحكم. */
export function runCodeBlock(node: CodeRunnerBlockNode): CodeRunResult {
  const controls = getInteractiveControls(node);
  const effectiveCode =
    controls.length > 0
      ? CodeSandboxRunner.injectControlValues(node.data.code, controls)
      : node.data.code;

  const output = liveInterpreterEngine.interpret(effectiveCode, node.data.language);
  return { output, controls };
}

/** تصدير fenced code عادي — التوافقية مع كل المحولات. */
export function formatCodeRunnerMarkdown(node: CodeRunnerBlockNode): string {
  const lang = node.data.language || '';
  return `\`\`\`${lang}\n${node.data.code}\n\`\`\``;
}
