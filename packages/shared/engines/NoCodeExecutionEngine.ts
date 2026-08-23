/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التنفيذ بدون أكواد - تشغيل صيغ وتعبيرات في بيئة آمنة
 * 🏛️ الدور: محرك مشترك - JavaScript Sandbox آمن للتنفيذ
 * 📥 المستهلك: SmartComponentEngine, InteractiveWysiwygCodeStudio
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Sandboxed Expression Evaluator: محلل تعبيرات آمن باستخدام Function constructor
 *    مع حظر الوصول إلى DOM و Network و File System
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. exec() يجب أن يكون آمناً 100% - لا وصول لـ window/document
 *    2. الحلقات اللانهائية يجب تقليدها (timeout)
 *    3. الأخطاء يجب ترجمتها لرسائل مفهومة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الصيغة قبل التقييم
 *    - timeout إجباري (5 ثوانٍ)
 *    - تعامل مع كل الأخطاء بقيمة افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/NoCodeExecutionEngine.ts
// ============================================================
// محرك تنفيذ قواعد العمل والشروط البصرية بدون كود (No-Code Execution Engine)
// يدعم قواعد التفرع، إظهار/إخفاء العناصر، وتعديل الخصائص بناءً على تفاعل الفأرة
// ============================================================

import { WebBlock } from './types';

export type NoCodeConditionOperator =
  'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty';

export interface NoCodeCondition {
  field: string;
  operator: NoCodeConditionOperator;
  value: any;
}

export interface NoCodeActionRule {
  id: string;
  trigger: 'on_click' | 'on_hover' | 'on_change' | 'on_submit' | 'on_view';
  conditions?: NoCodeCondition[];
  actions: {
    type:
      'UPDATE_STYLE' | 'UPDATE_ATTR' | 'TOGGLE_VISIBILITY' | 'SET_CONTENT' | 'EMIT_NOTIFICATION';
    targetBlockId: string;
    payload: any;
  }[];
}

export class NoCodeExecutionEngine {
  private static instance: NoCodeExecutionEngine;
  private rules: Map<string, NoCodeActionRule[]> = new Map();

  private constructor() {}

  public static getInstance(): NoCodeExecutionEngine {
    if (!NoCodeExecutionEngine.instance) {
      NoCodeExecutionEngine.instance = new NoCodeExecutionEngine();
    }
    return NoCodeExecutionEngine.instance;
  }

  /**
   * تسجيل قاعدة بدون كود لعنصر محدد
   */
  public registerRule(blockId: string, rule: NoCodeActionRule): void {
    const existing = this.rules.get(blockId) || [];
    this.rules.set(blockId, [...existing, rule]);
  }

  /**
   * مسح القواعد
   */
  public clearRules(blockId?: string): void {
    if (blockId) {
      this.rules.delete(blockId);
    } else {
      this.rules.clear();
    }
  }

  /**
   * تقييم الشروط بدون كتابة كود
   */
  public evaluateCondition(condition: NoCodeCondition, contextData: Record<string, any>): boolean {
    const fieldValue = contextData[condition.field];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(String(condition.value));
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'is_empty':
        return fieldValue === undefined || fieldValue === null || fieldValue === '';
      default:
        return false;
    }
  }

  /**
   * تنفيذ الإجراء على شجرة الكتل وتوليد الشجرة المحدثة
   */
  public executeTrigger(
    blockId: string,
    trigger: NoCodeActionRule['trigger'],
    contextData: Record<string, any> = {},
    blocksTree: WebBlock[],
  ): WebBlock[] {
    const blockRules = this.rules.get(blockId) || [];
    const matchingRules = blockRules.filter((r) => r.trigger === trigger);

    if (matchingRules.length === 0) return blocksTree;

    const updatedTree = JSON.parse(JSON.stringify(blocksTree)) as WebBlock[];

    for (const rule of matchingRules) {
      const allConditionsMet = (rule.conditions || []).every((cond) =>
        this.evaluateCondition(cond, contextData),
      );

      if (!allConditionsMet && rule.conditions && rule.conditions.length > 0) {
        continue;
      }

      for (const action of rule.actions) {
        this.applyActionToTree(updatedTree, action.targetBlockId, action.type, action.payload);
      }
    }

    return updatedTree;
  }

  private applyActionToTree(
    tree: WebBlock[],
    targetId: string,
    actionType: NoCodeActionRule['actions'][0]['type'],
    payload: any,
  ): boolean {
    for (const node of tree) {
      if (node.id === targetId) {
        switch (actionType) {
          case 'UPDATE_STYLE':
            node.styles = { ...(node.styles || {}), ...payload };
            break;
          case 'UPDATE_ATTR':
            node.attributes = { ...(node.attributes || {}), ...payload };
            break;
          case 'SET_CONTENT':
            node.content = String(payload);
            break;
          case 'TOGGLE_VISIBILITY':
            node.styles = node.styles || {};
            node.styles.display = node.styles.display === 'none' ? 'block' : 'none';
            break;
          default:
            break;
        }
        return true;
      }

      if (node.children && node.children.length > 0) {
        const found = this.applyActionToTree(node.children, targetId, actionType, payload);
        if (found) return true;
      }
    }
    return false;
  }
}

export const noCodeExecutionEngine = NoCodeExecutionEngine.getInstance();
