/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: trait-context-menu-resolver.ts
 * 📂 المسار: packages/core/src/traits/trait-context-menu-resolver.ts
 * 🎯 الهدف الرئيسي: توليد أفعال القوائم السياقية تلقائياً بناءً على السمات (Traits) المفعلة في البلوك
 * 📋 المعايير: Zero-dependency, Functional Pipeline, Bilingual Actions, <50 lines/function
 * 🏷️ المعرف: CORE-TRAIT-005
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Trait-Driven Dynamic Context Menu Generation with Semantic Category Partitioning
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بالثيم الفاتح النقي وتوفير واجهة تفاعل ماوسية كاملة
 *    2. احترام حالة القفل (isLocked) لمنع التعديل على العناصر المقفلة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ContextMenuItem } from '../engines/context-menu-engine';
import type { TraitKey, PositionState, SizeState, StyleState, LockState } from './types';

export interface TraitAwareBlockTarget {
  readonly id: string;
  readonly type: string;
  readonly traits: readonly TraitKey[];
  readonly state?: {
    readonly position?: PositionState;
    readonly size?: SizeState;
    readonly style?: StyleState;
    readonly lock?: LockState;
  };
}

export interface TraitMenuCallbacks {
  readonly onLockToggle?: (id: string, lock: boolean) => void;
  readonly onBringToFront?: (id: string) => void;
  readonly onSendToBack?: (id: string) => void;
  readonly onResetSize?: (id: string) => void;
  readonly onResetStyle?: (id: string) => void;
  readonly onDuplicate?: (id: string) => void;
  readonly onDelete?: (id: string) => void;
}

/**
 * يولد عناصر القائمة السياقية المرتبطة بالسمة lockable
 */
function resolveLockableActions(target: TraitAwareBlockTarget, cbs?: TraitMenuCallbacks): ContextMenuItem[] {
  if (!target.traits.includes('lockable')) return [];
  const isLocked = target.state?.lock?.locked ?? false;
  return [
    {
      id: isLocked ? 'unlock_block' : 'lock_block',
      label: isLocked ? 'Unlock Element' : 'Lock Element',
      labelAr: isLocked ? 'إلغاء قفل العنصر' : 'قفل العنصر',
      icon: isLocked ? 'Unlock' : 'Lock',
      checked: isLocked,
      priority: 10,
      action: () => cbs?.onLockToggle?.(target.id, !isLocked),
    },
  ];
}

/**
 * يولد عناصر القائمة السياقية المرتبطة بالسمة draggable
 */
function resolveDraggableActions(target: TraitAwareBlockTarget, cbs?: TraitMenuCallbacks): ContextMenuItem[] {
  if (!target.traits.includes('draggable')) return [];
  const isLocked = target.state?.lock?.locked ?? false;
  return [
    {
      id: 'bring_to_front',
      label: 'Bring to Front',
      labelAr: 'إحضار للمقدمة',
      icon: 'ArrowUp',
      disabled: isLocked,
      priority: 20,
      action: () => cbs?.onBringToFront?.(target.id),
    },
    {
      id: 'send_to_back',
      label: 'Send to Back',
      labelAr: 'إرسال للخلف',
      icon: 'ArrowDown',
      disabled: isLocked,
      priority: 21,
      action: () => cbs?.onSendToBack?.(target.id),
    },
  ];
}

/**
 * يولد عناصر القائمة السياقية المرتبطة بالسمة resizable
 */
function resolveResizableActions(target: TraitAwareBlockTarget, cbs?: TraitMenuCallbacks): ContextMenuItem[] {
  if (!target.traits.includes('resizable')) return [];
  const isLocked = target.state?.lock?.locked ?? false;
  return [
    {
      id: 'reset_size',
      label: 'Reset Dimensions',
      labelAr: 'إعادة ضبط الأبعاد',
      icon: 'Maximize2',
      disabled: isLocked,
      priority: 30,
      action: () => cbs?.onResetSize?.(target.id),
    },
  ];
}

/**
 * يولد عناصر القائمة السياقية المرتبطة بالسمة styleable
 */
function resolveStyleableActions(target: TraitAwareBlockTarget, cbs?: TraitMenuCallbacks): ContextMenuItem[] {
  if (!target.traits.includes('styleable')) return [];
  const isLocked = target.state?.lock?.locked ?? false;
  return [
    {
      id: 'reset_style',
      label: 'Reset Styles',
      labelAr: 'إعادة ضبط المظهر',
      icon: 'RotateCcw',
      disabled: isLocked,
      priority: 40,
      action: () => cbs?.onResetStyle?.(target.id),
    },
  ];
}

/**
 * يولد العمليات العامة لجميع البلوكات (نسخ، مضاعفة، حذف)
 */
function resolveGenericActions(target: TraitAwareBlockTarget, cbs?: TraitMenuCallbacks): ContextMenuItem[] {
  const isLocked = target.state?.lock?.locked ?? false;
  return [
    {
      id: 'duplicate_block',
      label: 'Duplicate',
      labelAr: 'تكرار / مضاعفة',
      icon: 'Copy',
      disabled: isLocked,
      priority: 80,
      action: () => cbs?.onDuplicate?.(target.id),
    },
    {
      id: 'delete_block',
      label: 'Delete',
      labelAr: 'حذف',
      icon: 'Trash2',
      danger: true,
      disabled: isLocked,
      priority: 99,
      action: () => cbs?.onDelete?.(target.id),
    },
  ];
}

/**
 * يجمع ويفلتر كافة عناصر القائمة السياقية المترتبة على الـ Traits مع فواصل ذكية
 */
export function resolveContextMenuForBlock(
  target: TraitAwareBlockTarget,
  cbs?: TraitMenuCallbacks
): readonly ContextMenuItem[] {
  const groups: ContextMenuItem[][] = [
    resolveDraggableActions(target, cbs),
    resolveResizableActions(target, cbs),
    resolveStyleableActions(target, cbs),
    resolveLockableActions(target, cbs),
    resolveGenericActions(target, cbs),
  ].filter(group => group.length > 0);

  const result: ContextMenuItem[] = [];
  groups.forEach((group, index) => {
    result.push(...group);
    if (index < groups.length - 1) {
      result.push({
        id: `sep_${index}`,
        label: '',
        separator: true,
      });
    }
  });

  return result;
}
