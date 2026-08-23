/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك إدارة الطبقات ذات العمق اللانهائي - Layer Manager
 * 🏛️ الدور: محرك مشترك - إدارة الطبقات والشجرة التداخلية
 * 📥 المستهلك: CanvasDesignerEditor, LayersPanel, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Infinite Depth Layers: طبقات بعمق لا نهائي مع شجرة تداخلية
 *    وحساب bounds مطلق لكل عنصر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الطبقات يجب أن تبقى متزامنة مع العناصر
 *    2. الترتيب يجب أن يحافظ على z-index
 *    3. الحذف يجب أن يكون شاملاً للعناصر الفرعية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العناصر قبل التعديل
 *    - fallback لطبقة واحدة
 *    - حماية ضد التكرار اللانهائي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * محرك إدارة الطبقات ذات العمق اللانهائي وشجرة العناصر التداخلية
 * /src/features/canvas-designer/layerManager.ts
 */

import type { CanvasElement, CanvasLayer } from './model';

export interface AbsoluteBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  tag?: string;
  type: string;
}

export class InfiniteLayerManager {
  /**
   * حساب الإحداثيات المطلقة للعنصر عبر صعود شجرة الآباء
   */
  static getAbsoluteBounds(element: CanvasElement, allElements: CanvasElement[]): AbsoluteBounds {
    let currentX = element.x;
    let currentY = element.y;
    let parentId = element.parentId;

    const elementMap = new Map<string, CanvasElement>(allElements.map((el) => [el.id, el]));

    // الصعود للأعلى لحساب الإزاحة التراكمية
    while (parentId) {
      const parent = elementMap.get(parentId);
      if (!parent) break;
      currentX += parent.x;
      currentY += parent.y;
      parentId = parent.parentId;
    }

    return {
      x: currentX,
      y: currentY,
      width: element.width,
      height: element.height,
    };
  }

  /**
   * الحصول على مسار التتبع الهرمي (Breadcrumb Path)
   */
  static getBreadcrumbPath(
    elementId: string | null,
    allElements: CanvasElement[],
  ): BreadcrumbItem[] {
    if (!elementId) return [];

    const elementMap = new Map<string, CanvasElement>(allElements.map((el) => [el.id, el]));

    const path: BreadcrumbItem[] = [];
    let current: CanvasElement | undefined = elementMap.get(elementId);

    while (current) {
      path.unshift({
        id: current.id,
        name: current.text || (current.tag ? `<${current.tag}>` : current.type),
        tag: current.tag,
        type: current.type,
      });

      current = current.parentId ? elementMap.get(current.parentId) : undefined;
    }

    return path;
  }

  /**
   * جلب جميع الأبناء والأحفاد (Subtree Descendants)
   */
  static getDescendantIds(rootId: string, allElements: CanvasElement[]): string[] {
    const descendants: string[] = [];
    const queue = [rootId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = allElements.filter((el) => el.parentId === currentId);
      for (const child of children) {
        descendants.push(child.id);
        queue.push(child.id);
      }
    }

    return descendants;
  }

  /**
   * تحريك عقدة وجميع أبنائها وأحفادها
   */
  static moveSubtree(
    rootId: string,
    deltaX: number,
    deltaY: number,
    allElements: CanvasElement[],
  ): CanvasElement[] {
    const descendantIds = new Set([rootId, ...this.getDescendantIds(rootId, allElements)]);

    return allElements.map((el) => {
      if (descendantIds.has(el.id)) {
        return {
          ...el,
          x: Math.max(0, el.x + deltaX),
          y: Math.max(0, el.y + deltaY),
        };
      }
      return el;
    });
  }

  /**
   * تجميع العناصر المحددة في حاوية واحدة (Group Elements)
   */
  static groupElements(
    selectedIds: string[],
    allElements: CanvasElement[],
    activeLayerId: string,
  ): { elements: CanvasElement[]; newContainerId: string } | null {
    if (selectedIds.length === 0) return null;

    const selectedElements = allElements.filter((el) => selectedIds.includes(el.id));
    if (selectedElements.length === 0) return null;

    // حساب الصندوق المحيط المشترك
    const minX = Math.min(...selectedElements.map((el) => el.x));
    const minY = Math.min(...selectedElements.map((el) => el.y));
    const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
    const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));

    const padding = 16;
    const containerX = Math.max(0, minX - padding);
    const containerY = Math.max(0, minY - padding);
    const containerWidth = maxX - minX + padding * 2;
    const containerHeight = maxY - minY + padding * 2;

    const containerId = `group-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const containerElement: CanvasElement = {
      id: containerId,
      type: 'container',
      tag: 'div',
      x: containerX,
      y: containerY,
      width: containerWidth,
      height: containerHeight,
      zIndex: Math.max(...allElements.map((e) => e.zIndex), 1) + 1,
      layerId: activeLayerId,
      fillColor: '#ffffff',
      strokeColor: '#cbd5e1',
      strokeWidth: 1,
      borderRadius: 12,
      text: 'مجموعة عناصر (Group)',
      children: selectedIds,
    };

    const updatedElements = allElements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return {
          ...el,
          parentId: containerId,
        };
      }
      return el;
    });

    return {
      elements: [...updatedElements, containerElement],
      newContainerId: containerId,
    };
  }

  /**
   * فك تجميع الحاوية (Ungroup)
   */
  static ungroup(containerId: string, allElements: CanvasElement[]): CanvasElement[] {
    const container = allElements.find((el) => el.id === containerId);
    if (!container) return allElements;

    return allElements
      .filter((el) => el.id !== containerId)
      .map((el) => {
        if (el.parentId === containerId) {
          return {
            ...el,
            parentId: container.parentId, // وراثة الأب الأعلى إن وجد
          };
        }
        return el;
      });
  }

  /**
   * تكرار عنصر مع كامل شجرته الفرعية (Duplicate Subtree)
   */
  static duplicateSubtree(
    rootId: string,
    allElements: CanvasElement[],
  ): { elements: CanvasElement[]; newRootId: string } {
    const descendantIds = [rootId, ...this.getDescendantIds(rootId, allElements)];
    const targetElements = allElements.filter((el) => descendantIds.includes(el.id));

    const idMap = new Map<string, string>();
    targetElements.forEach((el) => {
      idMap.set(el.id, `clone-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    });

    const offset = 24;
    const clonedElements: CanvasElement[] = targetElements.map((el) => {
      const newId = idMap.get(el.id)!;
      const newParentId = el.parentId ? idMap.get(el.parentId) || el.parentId : undefined;

      return {
        ...el,
        id: newId,
        parentId: newParentId,
        x: el.x + offset,
        y: el.y + offset,
        zIndex: el.zIndex + targetElements.length + 1,
      };
    });

    return {
      elements: [...allElements, ...clonedElements],
      newRootId: idMap.get(rootId)!,
    };
  }

  /**
   * إعادة ترتيب الطبقات للأمام وللخلف (Z-Order Reordering)
   */
  static reorderZIndex(
    elementId: string,
    action: 'front' | 'back' | 'forward' | 'backward',
    allElements: CanvasElement[],
  ): CanvasElement[] {
    const target = allElements.find((el) => el.id === elementId);
    if (!target) return allElements;

    const siblings = allElements
      .filter((el) => el.parentId === target.parentId)
      .sort((a, b) => a.zIndex - b.zIndex);

    const index = siblings.findIndex((el) => el.id === elementId);
    if (index === -1) return allElements;

    const updatedSiblings = [...siblings];

    if (action === 'front') {
      const [item] = updatedSiblings.splice(index, 1);
      updatedSiblings.push(item);
    } else if (action === 'back') {
      const [item] = updatedSiblings.splice(index, 1);
      updatedSiblings.unshift(item);
    } else if (action === 'forward' && index < updatedSiblings.length - 1) {
      const temp = updatedSiblings[index];
      updatedSiblings[index] = updatedSiblings[index + 1];
      updatedSiblings[index + 1] = temp;
    } else if (action === 'backward' && index > 0) {
      const temp = updatedSiblings[index];
      updatedSiblings[index] = updatedSiblings[index - 1];
      updatedSiblings[index - 1] = temp;
    }

    // إعادة ترقيم zIndex
    const newZMap = new Map<string, number>();
    updatedSiblings.forEach((el, idx) => {
      newZMap.set(el.id, idx + 1);
    });

    return allElements.map((el) => {
      if (newZMap.has(el.id)) {
        return { ...el, zIndex: newZMap.get(el.id)! };
      }
      return el;
    });
  }

  /**
   * تغيير الأب (Reparenting / Move into Container)
   */
  static reparentElement(
    elementId: string,
    newParentId: string | undefined,
    allElements: CanvasElement[],
  ): CanvasElement[] {
    // منع العقدة من أن تكون أباً لنفسها أو لأحد أحفادها
    if (newParentId) {
      const descendants = this.getDescendantIds(elementId, allElements);
      if (elementId === newParentId || descendants.includes(newParentId)) {
        return allElements;
      }
    }

    return allElements.map((el) => {
      if (el.id === elementId) {
        return {
          ...el,
          parentId: newParentId,
        };
      }
      return el;
    });
  }
}
