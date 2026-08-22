// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [RichTextAdapter.ts] محول محرر النصوص الغنية (rich-text)
 *
 * هذا الملف ينفذ عقد EditorAdapter لمحرر النصوص.
 *
 * البنية: الأدوات في Ribbon — تبويبات (Home, Insert, Layout, Review).
 * هذا مختلف عن الكانفا والواجهات: تبويبات، لا شريط أو لوحة.
 *
 * المبدأ: كل أداة تُترجم إلى تبويب مناسب.
 * الفئة تحدد التبويب:
 *   text/align/color → Home
 *   image/chart/table → Insert
 *   layout/transform → Layout
 *   debug/test → Review
 *
 * التنبيهات:
 * - الثيم الفاتح النقي في Ribbon
 * - الزر الأيمن على كل أداة (ميثاق)
 * - المحول يصف، لا ينفذ
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

import type { EditorAdapter, MountSpec, ValidationResult, ContextMenuItem } from './EditorAdapter';
import type { ToolDefinition, ComponentCategory } from '../core/DevStudioTypes';

/**
 * تبويبات Ribbon.
 */
export type RibbonTab = 'Home' | 'Insert' | 'Layout' | 'Review';

/**
 * ترجمة الفئة إلى تبويب.
 *
 * ⚠️ هذا هو الاختلاف الجوهري عن الكانفا: المحول يترجم
 * الفئة إلى تبويب، لا إلى موقع في شريط.
 */
const CATEGORY_TO_TAB: Record<ComponentCategory, RibbonTab> = {
  text: 'Home', align: 'Home', color: 'Home', drawing: 'Home',
  selection: 'Home', shape: 'Home', effect: 'Home',
  image: 'Insert', chart: 'Insert', table: 'Insert',
  layout: 'Layout', transform: 'Layout', navigation: 'Layout',
  animation: 'Layout', interaction: 'Layout', view: 'Layout',
  export: 'Insert', import: 'Insert',
  debug: 'Review', test: 'Review', math: 'Review',
  utility: 'Home', custom: 'Home',
};

/**
 * محول النصوص الغنية.
 */
export class RichTextAdapter implements EditorAdapter {
  readonly editorId = 'richtext' as const;

  constructor(private source: { mounted: () => string[] }) {}

  mountTool(toolId: string, definition: ToolDefinition): MountSpec | null {
    const v = this.validateTool(definition);
    if (!v.valid) return null;

    // المجموعة هنا هي التبويب، لا الفئة.
    // هذا ما يجعل Ribbon يجمع الأدوات حسب التبويب.
    const tab = CATEGORY_TO_TAB[definition.category] ?? 'Home';

    const spec: MountSpec = {
      toolId,
      editor: 'richtext',
      position: 0,
      group: tab,
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
    if (!tool.editors.includes('richtext') && !tool.editors.includes('all')) {
      return { valid: false, reason: 'tool does not support rich-text' };
    }
    if (!tool.icon.includes('<svg')) {
      return { valid: false, reason: 'icon must be inline SVG' };
    }
    return { valid: true };
  }

  getContextMenuItems(toolId: string): ContextMenuItem[] {
    return [
      { id: 'run', label: 'تنفيذ', action: () => {} },
      { id: 'addqat', label: 'إضافة لشريط الوصول السريع', action: () => {} },
      { id: 'shortcut', label: 'تعيين اختصار', action: () => {} },
      { id: 'remove', label: 'إزالة من Ribbon', danger: true, action: () => {} },
    ];
  }

  /** التبويب الذي تنتمي إليه فئة. */
  tabFor(category: ComponentCategory): RibbonTab {
    return CATEGORY_TO_TAB[category] ?? 'Home';
  }
}
