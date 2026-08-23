/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mouse-tooling-engine.ts
 * 📂 المسار: packages/core/src/engines/mouse-tooling-engine.ts
 * 🎯 الهدف الرئيسي: محرك مجرد لتحديد وتقديم قوائم الزر الأيمن والأدوات العائمة ومقابض التحويل للماوس لكل عنصر AST.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية (Zero-Dependency).
 *    - دوال نقية بأقل من 50 سطر لكل دالة.
 *    - دعم المجالات الأربعة (Writer, Calc, Impress, Base).
 * 🧪 الاختبارات: tests/mouse-tooling-engine.test.ts
 * 🏷️ المعرف: CORE-017
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Headless Context Action Provider + Canonical Action Registry + Bounding Box Gizmo Engine
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب الاعتماد على الـ DOM أو أي كائنات متصفح مباشرة.
 *    2. ضمان عودة قائمة أدوات افتراضية آمنة عند عدم التعرف على نوع العنصر.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لجميع مدخلات الأنواع
 *    - فحص حدود الإحداثيات قبل حساب المقابض
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#CORE-017
 *    - 📦 التبعيات: ../ast/types
 *    - 📄 مرتبط مباشر: ../index.ts, packages/adapters
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ASTNode, BlockNodeType, InlineNodeType } from '../ast/types';

export type ToolCategory = 'format' | 'structure' | 'transform' | 'data' | 'system';

export interface ContextMenuAction {
  readonly id: string;
  readonly label: string;
  readonly iconName: string;
  readonly category: ToolCategory;
  readonly shortcutHint?: string;
  readonly destructive?: boolean;
  readonly disabled?: boolean;
}

export interface FloatingGizmoTool {
  readonly id: string;
  readonly name: string;
  readonly iconName: string;
  readonly group: 'text' | 'cell' | 'shape' | 'table' | 'record';
  readonly isActive?: boolean;
}

export interface TransformHandle {
  readonly type: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';
  readonly x: number;
  readonly y: number;
  readonly cursor: string;
}

export interface ElementToolingProfile {
  readonly targetType: BlockNodeType | InlineNodeType | 'canvas' | 'custom';
  readonly domain: 'Writer' | 'Calc' | 'Impress' | 'Base' | 'Universal';
  readonly contextMenuActions: readonly ContextMenuAction[];
  readonly floatingGizmoTools: readonly FloatingGizmoTool[];
  readonly supportsTransformGizmo: boolean;
}

/**
 * سجل الأدوات المعياري الموحد لمختلف عناصر المحررات
 */
const CANONICAL_TOOLING_REGISTRY: Record<string, ElementToolingProfile> = {
  paragraph: {
    targetType: 'paragraph',
    domain: 'Writer',
    supportsTransformGizmo: false,
    contextMenuActions: [
      { id: 'cut', label: 'قص', iconName: 'Scissors', category: 'system' },
      { id: 'copy', label: 'نسخ', iconName: 'Copy', category: 'system' },
      { id: 'paste', label: 'لصق', iconName: 'Clipboard', category: 'system' },
      {
        id: 'turn_into_h1',
        label: 'تحويل إلى عنوان رئيسي H1',
        iconName: 'Heading1',
        category: 'structure',
      },
      {
        id: 'turn_into_h2',
        label: 'تحويل إلى عنوان فرعي H2',
        iconName: 'Heading2',
        category: 'structure',
      },
      {
        id: 'turn_into_list',
        label: 'تحويل إلى قائمة نقطية',
        iconName: 'List',
        category: 'structure',
      },
      { id: 'clear_formatting', label: 'مسح التنسيق', iconName: 'Eraser', category: 'format' },
      {
        id: 'delete_block',
        label: 'حذف الفقرة',
        iconName: 'Trash2',
        category: 'system',
        destructive: true,
      },
    ],
    floatingGizmoTools: [
      { id: 'bold', name: 'عريض', iconName: 'Bold', group: 'text' },
      { id: 'italic', name: 'مائل', iconName: 'Italic', group: 'text' },
      { id: 'underline', name: 'تسطير', iconName: 'Underline', group: 'text' },
      { id: 'color', name: 'لون النص', iconName: 'Palette', group: 'text' },
      { id: 'align_left', name: 'محاذاة لليسار', iconName: 'AlignLeft', group: 'text' },
      { id: 'align_center', name: 'توسيط', iconName: 'AlignCenter', group: 'text' },
      { id: 'align_right', name: 'محاذاة لليمين', iconName: 'AlignRight', group: 'text' },
    ],
  },
  table: {
    targetType: 'table',
    domain: 'Universal',
    supportsTransformGizmo: false,
    contextMenuActions: [
      {
        id: 'insert_row_above',
        label: 'إدراج صف لأعلى',
        iconName: 'ArrowUp',
        category: 'structure',
      },
      {
        id: 'insert_row_below',
        label: 'إدراج صف لأسفل',
        iconName: 'ArrowDown',
        category: 'structure',
      },
      {
        id: 'insert_col_left',
        label: 'إدراج عمود لليمين',
        iconName: 'ArrowRight',
        category: 'structure',
      },
      {
        id: 'insert_col_right',
        label: 'إدراج عمود لليسار',
        iconName: 'ArrowLeft',
        category: 'structure',
      },
      {
        id: 'merge_cells',
        label: 'دمج الخلايا المحددة',
        iconName: 'Combine',
        category: 'structure',
      },
      { id: 'split_cell', label: 'تقسيم الخلية', iconName: 'Split', category: 'structure' },
      {
        id: 'delete_table',
        label: 'حذف الجدول بالكامل',
        iconName: 'Trash2',
        category: 'system',
        destructive: true,
      },
    ],
    floatingGizmoTools: [
      { id: 'cell_background', name: 'لون الخلية', iconName: 'Paintbrush', group: 'table' },
      { id: 'table_borders', name: 'حدود الجدول', iconName: 'Square', group: 'table' },
      { id: 'align_cell_center', name: 'محاذاة الخلية', iconName: 'AlignCenter', group: 'table' },
    ],
  },
  shape: {
    targetType: 'custom',
    domain: 'Impress',
    supportsTransformGizmo: true,
    contextMenuActions: [
      { id: 'bring_to_front', label: 'إحضار للمقدمة', iconName: 'Layers', category: 'transform' },
      { id: 'send_to_back', label: 'إرسال للخلف', iconName: 'Layers', category: 'transform' },
      { id: 'duplicate_shape', label: 'تكرار الشكل', iconName: 'Copy', category: 'system' },
      {
        id: 'lock_aspect_ratio',
        label: 'قفل نسبة الأبعاد',
        iconName: 'Lock',
        category: 'transform',
      },
      { id: 'group_selection', label: 'تجميع الكائنات', iconName: 'Group', category: 'structure' },
      {
        id: 'delete_shape',
        label: 'حذف الكائن',
        iconName: 'Trash2',
        category: 'system',
        destructive: true,
      },
    ],
    floatingGizmoTools: [
      { id: 'fill_color', name: 'لون التعبئة', iconName: 'Palette', group: 'shape' },
      { id: 'stroke_color', name: 'لون الحد', iconName: 'PenTool', group: 'shape' },
      { id: 'stroke_width', name: 'سماكة الحد', iconName: 'Minus', group: 'shape' },
      { id: 'opacity', name: 'الشفافية', iconName: 'Sun', group: 'shape' },
      { id: 'corner_radius', name: 'استدارة الحواف', iconName: 'Square', group: 'shape' },
    ],
  },
  database_record: {
    targetType: 'custom',
    domain: 'Base',
    supportsTransformGizmo: false,
    contextMenuActions: [
      {
        id: 'edit_record_form',
        label: 'فتح نموذج التعديل',
        iconName: 'FileEdit',
        category: 'data',
      },
      { id: 'duplicate_record', label: 'تكرار السجل', iconName: 'Copy', category: 'data' },
      { id: 'export_record_json', label: 'تصدير كـ JSON', iconName: 'Download', category: 'data' },
      {
        id: 'delete_record',
        label: 'حذف السجل',
        iconName: 'Trash2',
        category: 'system',
        destructive: true,
      },
    ],
    floatingGizmoTools: [
      { id: 'filter_field', name: 'تصفية حسب الحقل', iconName: 'Filter', group: 'record' },
      { id: 'sort_ascending', name: 'فرز تصاعدي', iconName: 'SortAsc', group: 'record' },
      { id: 'sort_descending', name: 'فرز تنازلي', iconName: 'SortDesc', group: 'record' },
    ],
  },
};

/**
 * الحصول على بروفايل الأدوات والقوائم السياقية لأي عقدة أو كتلة
 */
export function getToolingProfileForNode(nodeType: string): ElementToolingProfile {
  if (CANONICAL_TOOLING_REGISTRY[nodeType]) {
    return CANONICAL_TOOLING_REGISTRY[nodeType];
  }
  return {
    targetType: 'custom',
    domain: 'Universal',
    supportsTransformGizmo: false,
    contextMenuActions: [
      { id: 'cut', label: 'قص', iconName: 'Scissors', category: 'system' },
      { id: 'copy', label: 'نسخ', iconName: 'Copy', category: 'system' },
      { id: 'delete', label: 'حذف', iconName: 'Trash2', category: 'system', destructive: true },
    ],
    floatingGizmoTools: [],
  };
}

/**
 * حساب مواضع مقابض التحويل الثمانية ومقبض التدوير رياضياً
 */
export function calculateTransformGizmoHandles(
  x: number,
  y: number,
  width: number,
  height: number,
  rotateAngle = 0,
): readonly TransformHandle[] {
  const halfW = width / 2;
  const halfH = height / 2;

  const rawHandles: Array<{
    type: TransformHandle['type'];
    relX: number;
    relY: number;
    cursor: string;
  }> = [
    { type: 'nw', relX: 0, relY: 0, cursor: 'nwse-resize' },
    { type: 'n', relX: halfW, relY: 0, cursor: 'ns-resize' },
    { type: 'ne', relX: width, relY: 0, cursor: 'nesw-resize' },
    { type: 'e', relX: width, relY: halfH, cursor: 'ew-resize' },
    { type: 'se', relX: width, relY: height, cursor: 'nwse-resize' },
    { type: 's', relX: halfW, relY: height, cursor: 'ns-resize' },
    { type: 'sw', relX: 0, relY: height, cursor: 'nesw-resize' },
    { type: 'w', relX: 0, relY: halfH, cursor: 'ew-resize' },
    { type: 'rotate', relX: halfW, relY: -24, cursor: 'grab' },
  ];

  return rawHandles.map((h) => {
    return {
      type: h.type,
      x: x + h.relX,
      y: y + h.relY,
      cursor: h.cursor,
    };
  });
}
