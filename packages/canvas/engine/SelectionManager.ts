/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مدير التحديدات والمدى ومقابض التحكم - Selection Manager
 * 🏛️ الدور: محرك مشترك - حفظ واستعادة واستبدال النصوص وحساب BoundingBox
 * 📥 المستهلك: CanvasDesignerEditor, InfiniteLayerTree
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Selection Range Management: إدارة نطاقات التحديد
 *    مع Browser Selection API و Range API صفر مكتبات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التحديد يجب أن يبقى دقيقاً بعد التعديل
 *    2. BoundingBox يجب أن يتوافق مع all elements
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود النطاق قبل التعديل
 *    - fallback لمحدد فارغ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CanvasElement } from '../../features/canvas-designer/model';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectionRange {
  startContainer?: Node;
  startOffset?: number;
  endContainer?: Node;
  endOffset?: number;
  collapsed?: boolean;
  text?: string;
}

export class SelectionManager {
  /**
   * حساب الإطار المحيط بمجموعة عناصر محددة
   */
  static calculateBoundingBox(elements: CanvasElement[]): BoundingBox | null {
    if (elements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach((el) => {
      if (el.x < minX) minX = el.x;
      if (el.y < minY) minY = el.y;
      if (el.x + el.width > maxX) maxX = el.x + el.width;
      if (el.y + el.height > maxY) maxY = el.y + el.height;
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * التحقق مما إذا كانت نقطة معينة تقع داخل العنصر
   */
  static isPointInside(x: number, y: number, el: CanvasElement): boolean {
    return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;
  }

  /**
   * حفظ المدى المحدد حالياً
   */
  static saveSelection(): SelectionRange | null {
    if (typeof window === 'undefined') return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    const range = sel.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
      collapsed: range.collapsed,
      text: sel.toString(),
    };
  }

  /**
   * استعادة المدى المحدد
   */
  static restoreSelection(rangeInfo: SelectionRange | null): boolean {
    if (!rangeInfo || typeof window === 'undefined') return false;
    const sel = window.getSelection();
    if (!sel || !rangeInfo.startContainer || !rangeInfo.endContainer) return false;

    try {
      const range = document.createRange();
      range.setStart(rangeInfo.startContainer, rangeInfo.startOffset || 0);
      range.setEnd(rangeInfo.endContainer, rangeInfo.endOffset || 0);

      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * استبدال التحديد بنص جديد
   */
  static replaceSelection(replacementText: string, selectInserted = false): boolean {
    if (typeof window === 'undefined') return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(replacementText);
    range.insertNode(textNode);

    if (selectInserted) {
      const newRange = document.createRange();
      newRange.selectNodeContents(textNode);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
    return true;
  }

  /**
   * تغليف التحديد ببادئة ولاحقة
   */
  static wrapSelection(before: string, after: string = before, defaultInside = ''): boolean {
    if (typeof window === 'undefined') return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    const range = sel.getRangeAt(0);
    const selectedText = range.toString() || defaultInside;
    range.deleteContents();

    const wrappedText = `${before}${selectedText}${after}`;
    const textNode = document.createTextNode(wrappedText);
    range.insertNode(textNode);
    return true;
  }

  /**
   * إدراج نص عند نقطة المؤشر الحالية
   */
  static insertText(text: string): boolean {
    return this.replaceSelection(text, false);
  }
}
