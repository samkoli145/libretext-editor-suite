/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: code-editor.ts
 * 📂 المسار: packages/core/src/blocks/code-editor.ts
 * 🎯 الهدف الرئيسي: تعريف كتلة CodeEditor للنطاق Writer
 * 📋 المعايير: صفر اعتماديات، ثيم فاتح نقي، تفاعل بالماوس وقوائم سياقية.
 * 🏷️ المعرف: CORE-BLK-CODEEDITOR
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ElementToolingProfile } from '../engines/mouse-tooling-engine';
import { CodeEditorDefaultStyles } from './code-editor.styles';

export interface CodeEditorData {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly styles?: Record<string, string>;
  readonly metadata?: Record<string, unknown>;
}

export interface CodeEditorBlock {
  readonly id: string;
  readonly type: 'code-editor';
  readonly domain: 'Writer';
  readonly data: CodeEditorData;
}

/**
 * بروفايل خيارات وأدوات الفأرة وقوائم الزر الأيمن للكتلة
 */
export const CodeEditorToolingProfile: ElementToolingProfile = {
  targetType: 'custom',
  domain: 'Writer',
  floatingGizmoTools: [],
  supportsTransformGizmo: false,
  contextMenuActions: [
    { id: 'cut', label: 'قص', iconName: 'Scissors', category: 'system' },
    { id: 'copy', label: 'نسخ', iconName: 'Copy', category: 'system' },
    { id: 'paste', label: 'لصق', iconName: 'Clipboard', category: 'system' },
    { id: 'bold', label: 'عريض', iconName: 'Bold', category: 'format' },
    { id: 'italic', label: 'مائل', iconName: 'Italic', category: 'format' },
    { id: 'underline', label: 'تسطير', iconName: 'Underline', category: 'format' },
    { id: 'delete_block', label: 'حذف', iconName: 'Trash2', category: 'system', destructive: true },
  ],
};

/**
 * إنشاء عقدة CodeEditor مع تطبيق الأنماط الافتراضية
 */
export function createCodeEditorBlock(
  id: string,
  data: Partial<CodeEditorData> = {},
): CodeEditorBlock {
  return {
    id,
    type: 'code-editor',
    domain: 'Writer',
    data: {
      id,
      title: data.title || '',
      content: data.content || '',
      styles: { ...CodeEditorDefaultStyles, ...data.styles },
      metadata: data.metadata || {},
    },
  };
}
