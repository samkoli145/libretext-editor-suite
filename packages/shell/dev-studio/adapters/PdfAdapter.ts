// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [PdfAdapter.ts] محول محرر PDF
 *
 * هذا الملف ينفذ عقد EditorAdapter لمحرر PDF.
 *
 * البنية: الأدوات في شريط تعليق/تحرير رفيع.
 * PDF مختلف: أدوات التعليق والتوقيع والتظليل، لا الرسم.
 *
 * المبدأ: المحول يرفض الأدوات التي لا معنى لها في PDF.
 * أداة رسم شكل في PDF لا معنى لها — تُرفض بصوت عالٍ.
 *
 * التنبيهات:
 * - الثيم الفاتح النقي في شريط الأدوات
 * - الزر الأيمن على كل أداة (ميثاق)
 * - المحول يصف، لا ينفذ
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { EditorAdapter, MountSpec, ValidationResult, ContextMenuItem } from './EditorAdapter';
import type { ToolDefinition, ComponentCategory } from '../core/DevStudioTypes';

/**
 * الفئات ذات المعنى في PDF.
 *
 * ⚠️ الرفض بصوت عالٍ: أداة خارج هذه الفئات ترفض.
 * PDF ليس محرر رسم — أدوات الرسم لا معنى لها هنا.
 */
const PDF_CATEGORIES = new Set<ComponentCategory>([
  'selection',
  'text',
  'navigation',
  'view',
  'export',
  'import',
  'utility',
]);

/**
 * محول PDF.
 */
export class PdfAdapter implements EditorAdapter {
  readonly editorId = 'pdf' as const;

  constructor(private source: { mounted: () => string[] }) {}

  mountTool(toolId: string, definition: ToolDefinition): MountSpec | null {
    const v = this.validateTool(definition);
    if (!v.valid) return null;

    const spec: MountSpec = {
      toolId,
      editor: 'pdf',
      position: 0,
      group: definition.category,
      label: definition.name,
      icon: definition.icon,
      actionId: definition.actionId,
      ...(definition.shortcut ? { shortcut: definition.shortcut } : {}),
      ...(definition.description ? { description: definition.description } : {}),
    };
    return spec;
  }

  unmountTool(toolId: string): boolean {
    return this.source.mounted().includes(toolId);
  }

  getMountedTools(): string[] {
    return this.source.mounted();
  }

  validateTool(tool: ToolDefinition): ValidationResult {
    if (!tool.editors.includes('pdf') && !tool.editors.includes('all')) {
      return { valid: false, reason: 'tool does not support pdf' };
    }
    // أداة لا معنى لها في PDF تُرفض بصوت عالٍ.
    if (!PDF_CATEGORIES.has(tool.category)) {
      return { valid: false, reason: `category "${tool.category}" has no meaning in a PDF` };
    }
    if (!tool.icon.includes('<svg')) {
      return { valid: false, reason: 'icon must be inline SVG' };
    }
    return { valid: true };
  }

  getContextMenuItems(toolId: string): ContextMenuItem[] {
    return [
      { id: 'use', label: 'استخدام', action: () => {} },
      { id: 'pin', label: 'تثبيت', action: () => {} },
      { id: 'remove', label: 'إزالة', danger: true, action: () => {} },
    ];
  }
}
