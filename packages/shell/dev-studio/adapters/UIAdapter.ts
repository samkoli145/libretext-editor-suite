// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [UIAdapter.ts] محول محرر الواجهات (ui-designer)
 *
 * هذا الملف ينفذ عقد EditorAdapter لمحرر الواجهات.
 *
 * البنية: الأدوات في لوحة مكونات جانبية، مجمعة حسب الفئات الـ23.
 * هذا مختلف عن الكانفا: لوحة جانبية، لا شريط أفقي.
 *
 * المبدأ (من panels.ts):
 * الأقسام النادرة تُغلق افتراضياً (CLOSED_BY_DEFAULT)،
 * لكنها تبقى قابلة للاكتشاف (العناوين مرئية دائماً).
 * نفس النمط هنا: الفئات النادرة مطوية، لكن موجودة.
 *
 * التنبيهات:
 * - الثيم الفاتح النقي في لوحة المكونات
 * - الزر الأيمن على كل مكون (ميثاق)
 * - المحول يصف، لا ينفذ
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { EditorAdapter, MountSpec, ValidationResult, ContextMenuItem } from './EditorAdapter';
import type { ToolDefinition, ComponentCategory } from '../core/DevStudioTypes';

/**
 * الفئات النادرة — مطوية افتراضياً، لكن قابلة للاكتشاف.
 * نفس مبدأ CLOSED_BY_DEFAULT في panels.ts.
 */
const RARE_CATEGORIES = new Set<ComponentCategory>([
  'debug', 'test', 'math', 'custom',
]);

/**
 * محول الواجهات.
 */
export class UIAdapter implements EditorAdapter {
  readonly editorId = 'ui' as const;

  constructor(private source: { mounted: () => string[] }) {}

  mountTool(toolId: string, definition: ToolDefinition): MountSpec | null {
    const v = this.validateTool(definition);
    if (!v.valid) return null;

    const spec: MountSpec = {
      toolId,
      editor: 'ui',
      position: 0, // لوحة المكونات ترتب حسب الفئة، لا الموقع
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
    if (!tool.editors.includes('ui') && !tool.editors.includes('all')) {
      return { valid: false, reason: 'tool does not support ui-designer' };
    }
    if (!tool.icon.includes('<svg')) {
      return { valid: false, reason: 'icon must be inline SVG' };
    }
    return { valid: true };
  }

  getContextMenuItems(toolId: string): ContextMenuItem[] {
    return [
      { id: 'insert', label: 'إدراج في اللوحة', action: () => {} },
      { id: 'preview', label: 'معاينة', action: () => {} },
      { id: 'props', label: 'عرض الخصائص', action: () => {} },
      { id: 'remove', label: 'إزالة من المكتبة', danger: true, action: () => {} },
    ];
  }

  /** هل الفئة نادرة (مطوية افتراضياً)؟ */
  isRare(category: ComponentCategory): boolean {
    return RARE_CATEGORIES.has(category);
  }
}
