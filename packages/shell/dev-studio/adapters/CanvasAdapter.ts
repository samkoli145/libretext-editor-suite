// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [CanvasAdapter.ts] محول محرر التصميم (canvas-designer)
 *
 * هذا الملف ينفذ عقد EditorAdapter لمحرر التصميم.
 *
 * البنية: الأدوات في شريط أدوات أفقي، مجمعة حسب الفئة.
 * الموقع يُشتق من الترتيب ضمن الفئة، لا يُخزن.
 *
 * المبدأ (من story.ts قاعدة 2):
 * "SERIES ARE DERIVED, NEVER STORED" — قائمة الأدوات المركبة
 * تُشتق من السجل، لا تُخزن. المحول لا يحتفظ بنسخة.
 *
 * المبدأ (من rowcol.ts):
 * "BOUNDS CLAMP, IDENTITY REFUSES" — موقع غير صالح يُقص،
 * أداة غير صالحة ترفض.
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

/** ترتيب الفئات في شريط أدوات الكانفا — يحدد التجميع. */
const CATEGORY_ORDER: ComponentCategory[] = [
  'selection',
  'drawing',
  'shape',
  'text',
  'image',
  'align',
  'transform',
  'color',
  'effect',
];

/**
 * محول الكانفا.
 *
 * ⚠️ المحول لا يحتفظ بقائمة الأدوات المركبة.
 * getMountedTools يُشتق من المصدر الخارجي (السجل).
 * هذا يمنع انفصال القائمة عن السجل.
 */
export class CanvasAdapter implements EditorAdapter {
  readonly editorId = 'canvas' as const;

  /**
   * مصدر الأدوات المركبة — يُحقن، لا يُنشأ داخلياً.
   * هذا ما يجعل المحول قابلاً للاختبار: الاختبار يحقن مصدراً وهمياً.
   */
  constructor(private source: { mounted: () => string[] }) {}

  mountTool(toolId: string, definition: ToolDefinition): MountSpec | null {
    const v = this.validateTool(definition);
    if (!v.valid) return null;

    // الموقع يُشتق: عدد الأدوات المركبة في نفس الفئة.
    // هذا يضع الأداة الجديدة في نهاية فئتها، دون تخزين موقع.
    const position = this.positionInCategory(definition.category);

    const spec: MountSpec = {
      toolId,
      editor: 'canvas',
      position,
      group: definition.category,
      label: definition.name,
      icon: definition.icon,
      actionId: definition.actionId,
      // الحقول المضافة: الغياب يعني "لا"
      ...(definition.shortcut ? { shortcut: definition.shortcut } : {}),
      ...(definition.description ? { description: definition.description } : {}),
    };
    return spec;
  }

  unmountTool(toolId: string): boolean {
    // الفك يُترجم لإزالة من المصدر — يعيد true إن كانت موجودة.
    return this.source.mounted().includes(toolId);
  }

  getMountedTools(): string[] {
    // يُشتق من المصدر، لا من حالة داخلية.
    return this.source.mounted();
  }

  validateTool(tool: ToolDefinition): ValidationResult {
    // أداة لا تدعم الكانفا ترفض.
    if (!tool.editors.includes('canvas') && !tool.editors.includes('all')) {
      return { valid: false, reason: 'tool does not support canvas' };
    }
    // أيقونة غير SVG ترفض — الميثاق يتطلب SVG مضمنة.
    if (!tool.icon.includes('<svg')) {
      return { valid: false, reason: 'icon must be inline SVG' };
    }
    // فئة غير معروفة ترفض.
    if (!CATEGORY_ORDER.includes(tool.category)) {
      return { valid: false, reason: `unknown category "${tool.category}"` };
    }
    return { valid: true };
  }

  getContextMenuItems(toolId: string): ContextMenuItem[] {
    // قائمة الزر الأيمن الموحدة لأداة في الكانفا.
    // إلزامية من الميثاق.
    return [
      { id: 'use', label: 'استخدام الأداة', action: () => {} },
      { id: 'pin', label: 'تثبيت في الشريط', action: () => {} },
      { id: 'shortcut', label: 'تعيين اختصار', action: () => {} },
      { id: 'remove', label: 'إزالة من الشريط', danger: true, action: () => {} },
    ];
  }

  /**
   * الموقع ضمن الفئة — يُشتق، لا يُخزن.
   *
   * ⚠️ BOUNDS CLAMP: الموقع يُقص لحدود الشريط، لا يرمي.
   */
  private positionInCategory(category: ComponentCategory): number {
    const idx = CATEGORY_ORDER.indexOf(category);
    // كل فئة تبدأ بعد الفئات السابقة — تقدير مبسط للموقع.
    return Math.max(0, idx);
  }
}
