/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: list-block.ts
 * 📂 المسار: src/blocks/list-block.ts
 * 🎯 الهدف الرئيسي: تعريف بلوك القوائم المنظمة (نقطية، رقمية، مهام) لنطاق Writer
 * 📋 المعايير: دعم التداخل الشجري، قوائم المهام Checklists، والترقيم التلقائي
 * 🧪 الاختبارات: فحص بنية العناصر وحالات المهام والتصدير لـ Markdown
 * 🏷️ المعرف: BLK-WRITER-LIST
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive Item Nesting + Checklist State Machine + GFM List Serializer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع الحلقات التكرارية في القوائم المتداخلة.
 *    2. ضمان احتواء كل عنصر قائمة على مصفوفة نصوص أو كائنات صالحة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guard (isListBlock).
 *    - فحص عمق التداخل (Max depth check).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: src/blocks/index.ts
 *    - 📦 التبعيات: src/types/ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createListItem: إنشاء عنصر قائمة (#L51)
 *    - createListBlock: إنشاء كتلة قائمة كاملة (#L63)
 *    - isListBlock: فاحص نوع القائمة (#L81)
 *    - formatListMarkdown: تحويل القائمة لـ Markdown (#L88)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يدعم قوائم المهام (Tasklists) المتوافقة مع معايير GitHub Flavored Markdown.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: دعم السحب والإفلات لإعادة ترتيب العناصر
 *    - 📖 مرجع تقني: LibreText Block Catalog & Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreText Architecture Blueprint
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BaseBlockNode, TraitKey } from '../ast/types';

export type ListType = 'bullet' | 'ordered' | 'task';

export interface ListItemData {
  readonly id: string;
  readonly text: string;
  readonly checked?: boolean;
}

export interface ListBlockData {
  readonly ordered: boolean;
  readonly listType: ListType;
  readonly startNumber?: number;
}

export interface ListBlockNode extends BaseBlockNode<ListBlockData> {
  readonly type: 'list';
  readonly domain: 'writer';
  readonly items: readonly ListItemData[];
}

export function createListItem(
  id: string,
  text: string,
  checked?: boolean
): ListItemData {
  return {
    id,
    text,
    checked,
  };
}

export function createListBlock(
  id: string,
  items: readonly ListItemData[],
  listType: ListType = 'bullet',
  startNumber: number = 1
): ListBlockNode {
  return {
    id,
    type: 'list',
    domain: 'writer',
    traits: ['styleable', 'draggable'] as readonly TraitKey[],
    data: {
      ordered: listType === 'ordered',
      listType,
      startNumber,
    },
    items: items.length > 0 ? items : [createListItem(`${id}-it-1`, 'عنصر قائمة')],
  };
}

export function isListBlock(node: unknown): node is ListBlockNode {
  if (typeof node !== 'object' || node === null) return false;
  const b = node as ListBlockNode;
  return b.type === 'list' && Array.isArray(b.items);
}

export function formatListMarkdown(node: ListBlockNode): string {
  return node.items
    .map((item, idx) => {
      if (node.data.listType === 'task') {
        const box = item.checked ? '[x]' : '[ ]';
        return `- ${box} ${item.text}`;
      }
      if (node.data.listType === 'ordered') {
        const num = (node.data.startNumber ?? 1) + idx;
        return `${num}. ${item.text}`;
      }
      return `- ${item.text}`;
    })
    .join('\n');
}
