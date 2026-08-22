/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك ربط الهياكل البصرية بالأكواد البرمجية - Block Mapper Engine
 * 🏛️ الدور: محرك مشترك - ربط عناصر الكانفا بسطور الكود المتولد
 * 📥 المستهلك: CanvasDesignerEditor, LiveCodePanel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Visual-to-Code Mapping: ربط بصري إلى كود
 *    مع تحديد نطاقات الأسطر لكل عنصر
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الربط يجب أن يكون دقيقاً لكل عنصر
 *    2. أسطر الكود يجب ألا تتداخل بشكل خاطئ
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العنصر قبل الربط
 *    - fallback لنطاق فارغ
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CanvasElement } from '../../features/canvas-designer/model';
import type { ASTNode } from './HTMLParserEngine';

export interface CodeBlockMapping {
  elementId: string;
  sourceLineStart: number;
  sourceLineEnd: number;
  snippet: string;
  componentType: string;
}

export class BlockMapperEngine {
  /**
   * ربط عناصر الكانفا بسطور الكود البرمجي المتولد
   */
  static mapElementsToCodeBlocks(
    elements: CanvasElement[],
    generatedCode: string
  ): CodeBlockMapping[] {
    const lines = generatedCode.split('\n');
    const mappings: CodeBlockMapping[] = [];

    elements.forEach((el) => {
      // البحث عن موقع العنصر في الكود
      const searchTarget = `data-element-id="${el.id}"` || el.text || el.type;
      let startLine = -1;
      let endLine = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(el.id) || (el.text && lines[i].includes(el.text))) {
          if (startLine === -1) startLine = i + 1;
          endLine = i + 1;
        }
      }

      if (startLine !== -1) {
        mappings.push({
          elementId: el.id,
          sourceLineStart: startLine,
          sourceLineEnd: endLine,
          snippet: lines.slice(startLine - 1, endLine).join('\n'),
          componentType: el.type,
        });
      }
    });

    return mappings;
  }
}
