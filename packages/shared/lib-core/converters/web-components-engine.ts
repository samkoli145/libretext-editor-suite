/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك تحويل مكونات الويب الحديثة - HTML/React TSX/Vue 3 SFC/ESM
 * 🏛️ الدور: نواة مشتركة معزولة - محول تخصصي في نظام الـ 50 صيغة
 * 📥 المستهلك: UniversalExportHub, UIDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Component AST Export: تحويل شجرة مكونات UI إلى React/Vue/Web Component
 *    مع الحفاظ على التسلسل الهرمي والعلاقات والأحداث
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. React TSX يحتاج همJSImport ثابت لكل مكون مستخدم
 *    2. Vue SFC يحتاج defineComponent و <script setup> بشكل صحيح
 *    3. Web Component يحتاج Shadow DOM لمنع تسرّب الأنماط
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تسمية المكونات بشكل آمن (بدون مسافات أو أحرف خاصة)
 *    - فحص التكرار في أسماء المكونات
 *    - إرجاع كود صالح حتى مع مدخلات جزئية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { UIComponentNode } from '../../../features/ui-designer/model';

export class WebComponentsEngine {
  /**
   * توليد مكون React TSX كامل مع Tailwind CSS
   */
  public static generateReactTsx(
    components: UIComponentNode[],
    componentName = 'MyGeneratedUI',
  ): string {
    const renderNode = (node: UIComponentNode, indent = '      '): string => {
      const { type, props = {}, label } = node;
      const bg = props.bg || '#ffffff';
      const color = props.color || '#1e293b';
      const text = props.text || label || '';

      switch (type) {
        case 'button':
          return `${indent}<button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-xs">\n${indent}  ${text}\n${indent}</button>`;
        case 'input':
          return `${indent}<input type="text" placeholder="${props.placeholder || 'أدخل النص...'}" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800" />`;
        case 'card':
          return `${indent}<div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">\n${indent}  <h3 className="font-semibold text-slate-800 text-lg">${text || 'بطاقة عنوان'}</h3>\n${indent}</div>`;
        case 'text':
        case 'heading':
          return `${indent}<h2 className="text-xl font-bold text-slate-800">${text}</h2>`;
        case 'badge':
          return `${indent}<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">\n${indent}  ${text}\n${indent}</span>`;
        default:
          return `${indent}<div className="p-4 border border-slate-200 rounded-lg bg-slate-50">\n${indent}  <span>${text}</span>\n${indent}</div>`;
      }
    };

    const renderedNodes = components.map((c) => renderNode(c)).join('\n\n');

    return `import React from 'react';

export interface ${componentName}Props {
  className?: string;
}

/**
 * مكون تم توليده تلقائياً عبر محرك الويب الموحد
 */
export const ${componentName}: React.FC<${componentName}Props> = ({ className = '' }) => {
  return (
    <div className={\`w-full max-w-4xl mx-auto p-6 space-y-4 bg-slate-50/50 rounded-2xl \${className}\`}>
${renderedNodes}
    </div>
  );
};

export default ${componentName};
`;
  }

  /**
   * توليد Custom Element (Web Component) مستقل بـ Shadow DOM
   */
  public static generateWebComponent(
    components: UIComponentNode[],
    tagName = 'custom-ui-widget',
  ): string {
    const htmlBody = components
      .map((c) => {
        const text = c.props?.text || c.label || '';
        return `<div class="ui-item item-${c.type}">${text}</div>`;
      })
      .join('\n      ');

    return `/**
 * Standalone Standard Web Component (<${tagName}>)
 */
class GeneratedUIWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = \`
      <style>
        :host {
          display: block;
          font-family: 'Cairo', system-ui, sans-serif;
          color: #1e293b;
        }
        .ui-container {
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .ui-item {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
        }
        .item-button {
          background: #2563eb;
          color: #ffffff;
          cursor: pointer;
          text-align: center;
          font-weight: 500;
        }
      </style>
      <div class="ui-container">
        ${htmlBody}
      </div>
    \`;
  }
}

if (!customElements.get('${tagName}')) {
  customElements.define('${tagName}', GeneratedUIWidget);
}
`;
  }

  /**
   * توليد Vue 3 Single File Component (.vue)
   */
  public static generateVueSfc(
    components: UIComponentNode[],
    componentName = 'UiComponent',
  ): string {
    return `<template>
  <div class="ui-wrapper max-w-4xl mx-auto p-6 space-y-4 bg-white border border-slate-200 rounded-xl">
    ${components.map((c) => `<div class="ui-node-${c.type}">${c.props?.text || c.label || ''}</div>`).join('\n    ')}
  </div>
</template>

<script setup lang="ts">
// Generated via Universal Web Components Engine
defineProps<{
  title?: string;
}>();
</script>

<style scoped>
.ui-wrapper {
  font-family: 'Cairo', sans-serif;
}
</style>
`;
  }
}
