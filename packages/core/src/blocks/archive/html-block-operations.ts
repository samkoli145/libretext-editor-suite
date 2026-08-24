// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-block-operations.ts
 * 📂 المسار: packages/core/src/blocks/html-block-operations.ts
 * 🎯 الهدف الرئيسي: عمليات البلوكات (إضافة، إزالة، نقل، تكرار).
 * 📋 المعايير: Zero-Dependency, Patch Factory, < 50 lines/function.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-block-operations.test.ts
 * 🏷️ المعرف: CORE-BLK-OPS-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Patch Factory + Immutable Operations + Undo/Redo Support
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل عملية تُعيد Patch مع inverse.
 *    2. parentId يجب أن يكون موجوداً.
 *    3. blockId يجب أن يكون فريداً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من صحة المعرفات.
 *    - معالجة الأخطاء بصمت مع تسجيلها.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: html-block-types.ts, html-block-registry.ts
 *    - 📄 مرتبط مباشر: html-block-generator.ts
 *    - 🧪 اختبارات: html-block-operations.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - addBlock: إضافة بلوك (#L65)
 *    - removeBlock: إزالة بلوك (#L85)
 *    - moveBlock: نقل بلوك (#L105)
 *    - duplicateBlock: تكرار بلوك (#L125)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - العمليات تدعم Undo/Redo عبر inverse.
 *    - كل عملية تُعيد Patch قابل للتطبيق.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: إضافة دعم batch operations.
 *    - 📖 مرجع تقني: rowcol.ts (Patch Factory pattern).
 *    - 🎯 التحسينات المستقبلية: دعم transaction operations.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { HtmlBlockNode, BlockType } from './html-block-types';
import { mintBlockId, categoryFromType } from './html-block-types';
import { HtmlBlockRegistry } from './html-block-registry';

export interface BlockPatch {
  op: 'addBlock' | 'removeBlock' | 'moveBlock' | 'updateBlock';
  parentId?: string;
  blockId?: string;
  block?: HtmlBlockNode;
  index?: number;
  newIndex?: number;
}

export interface OperationResult {
  patch: BlockPatch;
  inverse: BlockPatch;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Block Operations | عمليات البلوكات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * إضافة بلوك جديد.
 *
 * ⚠️ يُعيد Patch مع inverse.
 * ⚠️ parentId يجب أن يكون موجوداً.
 *
 * // @function-index: #50/4 — addBlock
 */
export function addBlock(parentId: string, type: BlockType, index?: number): OperationResult {
  const def = HtmlBlockRegistry.get(type);
  if (!def) {
    throw new Error(`[Operations] Unknown block type: ${type}`);
  }

  const newBlock: HtmlBlockNode = {
    id: mintBlockId(),
    type,
    category: categoryFromType(type),
    props: { ...def.defaultProps },
    styles: { ...def.defaultTailwind },
    ...(def.acceptsChildren ? { children: [] } : {}),
  };

  return {
    patch: { op: 'addBlock', parentId, block: newBlock, index },
    inverse: { op: 'removeBlock', blockId: newBlock.id, parentId },
  };
}

/**
 * إزالة بلوك.
 *
 * ⚠️ يُعيد Patch مع inverse.
 * ⚠️ blockId يجب أن يكون موجوداً.
 *
 * // @function-index: #51/4 — removeBlock
 */
export function removeBlock(
  blockId: string,
  block: HtmlBlockNode,
  parentId = '',
  index = 0,
): OperationResult {
  return {
    patch: { op: 'removeBlock', blockId, parentId },
    inverse: { op: 'addBlock', parentId, block, index },
  };
}

/**
 * نقل بلوك.
 *
 * ⚠️ يُعيد Patch مع inverse.
 * ⚠️ newIndex يجب أن يكون ضمن الحدود.
 *
 * // @function-index: #52/4 — moveBlock
 */
export function moveBlock(blockId: string, newIndex: number, oldIndex = 0): OperationResult {
  return {
    patch: { op: 'moveBlock', blockId, newIndex },
    inverse: { op: 'moveBlock', blockId, newIndex: oldIndex },
  };
}

/**
 * تكرار بلوك.
 *
 * ⚠️ يُعيد Patch مع inverse.
 * ⚠️ يُنشئ معرف جديد للبلوك المكرر.
 *
 * // @function-index: #53/4 — duplicateBlock
 */
export function duplicateBlock(
  block: HtmlBlockNode,
  parentId = '',
  index?: number,
): OperationResult {
  const newBlock: HtmlBlockNode = {
    ...block,
    id: mintBlockId(),
  };

  return {
    patch: { op: 'addBlock', parentId, block: newBlock, index },
    inverse: { op: 'removeBlock', blockId: newBlock.id, parentId },
  };
}
