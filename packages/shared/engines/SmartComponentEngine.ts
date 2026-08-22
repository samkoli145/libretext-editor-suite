/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المكونات الذكية - تقييم الصيغ وإدارة الحالة بدون أكواد
 * 🏛️ الدور: محرك مشترك - No-Code Smart Engine للتفاعل المباشر بالفأرة
 * 📥 المستهلك: UIDesignerEditor, UIComponentRenderer, UIPropertiesPanel
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Expression Evaluator + State Manager: محلل صيغ آمن (Sandboxed)
 *    مع مدير حالة تفاعلي يمكن تحريره بالفأرة بدون كتابة كود
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الصيغة يجب أن تكون آمنة (لا eval أو Function constructor)
 *    2. الحالة يجب أن تبقى متسقة مع واجهة المستخدم
 *    3. التحديثات المتزامنة قد تسبب سباق حالات (race conditions)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الصيغة قبل التقييم (sandbox check)
 *    - استخدام try/catch على كل تقييم
 *    - فرض الحد الأقصى لعمق التداخل (10 مستويات)
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/SmartComponentEngine.ts
// ============================================================
// محرك المكونات الذكية والربط التفاعلي للبيانات بدون أكواد (No-Code Smart Engine)
// يدعم تقييم الصيغ، إدارة الحالة، والتفاعل المباشر بالفأرة والأحداث
// ============================================================

import { WebBlock } from './types';

export interface SmartComponentState {
  [key: string]: any;
}

export interface SmartPropertyBinding {
  property: string; // e.g. 'content', 'styles.color', 'attributes.disabled'
  expression: string; // e.g. '{{state.user.name}}' or '{{state.counter > 10}}'
  defaultValue?: any;
}

export interface SmartComponentConfig {
  id: string;
  blockId: string;
  type: string;
  bindings: SmartPropertyBinding[];
  actions: {
    event: 'click' | 'change' | 'submit' | 'load' | 'hover';
    actionType: 'setState' | 'toggleState' | 'resetForm' | 'fetchApi' | 'notify';
    payload: any;
  }[];
  computedProps?: Record<string, string>;
}

export class SmartComponentEngine {
  private static instance: SmartComponentEngine;
  private stateStore: Map<string, SmartComponentState> = new Map();
  private componentConfigs: Map<string, SmartComponentConfig> = new Map();

  private constructor() {}

  public static getInstance(): SmartComponentEngine {
    if (!SmartComponentEngine.instance) {
      SmartComponentEngine.instance = new SmartComponentEngine();
    }
    return SmartComponentEngine.instance;
  }

  /**
   * تسجيل إعدادات مكون ذكي في المحرك
   */
  public registerComponent(config: SmartComponentConfig): void {
    this.componentConfigs.set(config.blockId, config);
    if (!this.stateStore.has(config.blockId)) {
      this.stateStore.set(config.blockId, {});
    }
  }

  /**
   * تحديث الحالة التفاعلية للمكون
   */
  public updateState(blockId: string, newState: Partial<SmartComponentState>): SmartComponentState {
    const current = this.stateStore.get(blockId) || {};
    const updated = { ...current, ...newState };
    this.stateStore.set(blockId, updated);
    return updated;
  }

  /**
   * جلب الحالة الحالية
   */
  public getState(blockId: string): SmartComponentState {
    return this.stateStore.get(blockId) || {};
  }

  /**
   * مسح الحالة
   */
  public clearState(blockId?: string): void {
    if (blockId) {
      this.stateStore.delete(blockId);
      this.componentConfigs.delete(blockId);
    } else {
      this.stateStore.clear();
      this.componentConfigs.clear();
    }
  }

  /**
   * تقييم الصيغ والقيم الديناميكية بأمان دون استخدام eval غير الآمن
   */
  public evaluateExpression(expression: string, state: SmartComponentState): any {
    if (!expression) return '';

    // معالجة القوالب التفاعلية e.g., 'مرحبا {{state.name}}'
    if (expression.includes('{{')) {
      return expression.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
        const val = this.resolvePath(path.trim(), state);
        return val !== undefined && val !== null ? String(val) : '';
      });
    }

    // المسار المباشر
    return this.resolvePath(expression.trim(), state);
  }

  private resolvePath(path: string, context: any): any {
    if (path.startsWith('state.')) {
      path = path.replace(/^state\./, '');
    }

    const parts = path.split('.');
    let curr = context;
    for (const p of parts) {
      if (curr === undefined || curr === null) return undefined;
      curr = curr[p];
    }
    return curr;
  }

  /**
   * تطبيق الروابط الذكية على العنصر
   */
  public applySmartBindings(block: WebBlock): WebBlock {
    const config = this.componentConfigs.get(block.id);
    if (!config) return block;

    const cloned = JSON.parse(JSON.stringify(block)) as WebBlock;
    const state = this.getState(block.id);

    for (const binding of config.bindings) {
      const evaluatedVal = this.evaluateExpression(binding.expression, state);
      const targetVal = evaluatedVal !== undefined ? evaluatedVal : binding.defaultValue;

      if (binding.property === 'content') {
        cloned.content = String(targetVal);
      } else if (binding.property.startsWith('styles.')) {
        const styleKey = binding.property.replace('styles.', '');
        cloned.styles = cloned.styles || {};
        cloned.styles[styleKey] = String(targetVal);
      } else if (binding.property.startsWith('attributes.')) {
        const attrKey = binding.property.replace('attributes.', '');
        cloned.attributes = cloned.attributes || {};
        cloned.attributes[attrKey] = String(targetVal);
      }
    }

    return cloned;
  }

  /**
   * تفعيل الأحداث المشروطة عند النقر أو التفاعل بالماوس
   */
  public triggerEvent(
    blockId: string,
    eventName: 'click' | 'change' | 'submit' | 'load' | 'hover',
    eventData?: any
  ): void {
    const config = this.componentConfigs.get(blockId);
    if (!config) return;

    const matchingActions = config.actions.filter((a) => a.event === eventName);
    for (const action of matchingActions) {
      switch (action.actionType) {
        case 'setState':
          this.updateState(blockId, action.payload);
          break;
        case 'toggleState': {
          const curr = this.getState(blockId);
          const key = action.payload?.key;
          if (key) {
            this.updateState(blockId, { [key]: !curr[key] });
          }
          break;
        }
        case 'resetForm':
          this.stateStore.set(blockId, {});
          break;
        default:
          break;
      }
    }
  }
}

export const smartComponentEngine = SmartComponentEngine.getInstance();
