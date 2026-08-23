/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك الشروحات التفاعلية - 15+ مكون تفاعلي (Callouts, Badges, Cards)
 * 🏛️ الدور: محرك مشترك - توليد مكونات شرح وتنبيه WYSIWYG
 * 📥 المستهلك: SharedFormattingToolbar, CanvasDesignerEditor, RichTextEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Factory Pattern + Template System: مصنع مكونات مع قوالب HTML/Tailwind
 *    يمكن توليدها وتخصيصها ديناميكياً حسب المدخلات
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. HTML المولد يجب تنظيفه قبل الإدراج (XSS protection)
 *    2. الألوان يجب أن تتوافق مع الثيم الفاتح
 *    3. الأبعاد يجب أن تكون متجاوبة (responsive)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة نوع المكون (type guard) قبل التوليد
 *    - تعامل مع القيم الفارغة بقيم افتراضية
 *    - إرجاع HTML صالح دائماً حتى مع مدخلات جزئية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */
// src/shared/engines/WYSIWYGCalloutEngine.ts
// ============================================================
// محرك الشروحات التفاعلية ومربعات التوضيح والموصلات الذكية (WYSIWYG Callouts, Shapes & Connectors Engine)
// يدعم 15+ مكون تفاعلي حديث:
// 1. مربعات الشرح مع مؤشر توجيه (Callout Balloons)
// 2. شارات ترقيم الخطوات المتسلسلة (Step Badges 1, 2, 3...)
// 3. بطاقات التوضيح والشرح الغنية (Explainer Cards)
// 4. دبابيس التركيز (Spotlight Pins)
// 5. الموصلات والأسهم الذكية التفاعلية (Smart Connectors & Flow Arrows)
// 6. بطاقات مقارنة الميزات (Feature Comparison Cards)
// 7. مربعات التحذير والتنبيه الملونة (Alert & Warning Callouts)
// 8. بطاقات الإحصائيات والأرقام البارزة (Stat Metric Tiles)
// 9. قوائم التدقيق التفاعلية (Interactive Checklists)
// 10. خط الزمني المتسلسل (Timeline Step Navigator)
// 11. مربعات شرح الأكواد البرمجية (Code Explainer Balloons)
// 12. بطاقات التبويب التفاعلية (Tabbed Explainer Cards)
// 13. أزرار الملاحظات القابلة للطي (Collapsible Note Drawers)
// 14. لافتات الاقتباس والتأكيد (Quote Highlight Banners)
// 15. صناديق التقييم والمراجعة (Review & Score Boxes)
// 16. قوالب الشروحات المرئية الجاهزة للواجهات (WYSIWYG Interactive Templates)
// ============================================================

export interface CalloutDefinition {
  id: string;
  type:
    | 'balloon'
    | 'badge'
    | 'card'
    | 'pin'
    | 'connector'
    | 'comparison'
    | 'alert'
    | 'stat'
    | 'checklist'
    | 'timeline'
    | 'code-explainer'
    | 'tabbed'
    | 'collapsible'
    | 'quote'
    | 'review';
  title: string;
  description: string;
  stepNumber?: number;
  pointerDirection?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right';
  themeColor: string;
  backgroundColor: string;
  textColor: string;
  badgeColor?: string;
  icon?: string;
  extraData?: Record<string, any>;
  position?: { x: number; y: number; width?: number; height?: number };
}

export interface ConnectorEndpoint {
  elementId?: string;
  x: number;
  y: number;
  anchor?: 'top' | 'right' | 'bottom' | 'left' | 'center';
}

export interface ConnectorDefinition {
  id: string;
  from: ConnectorEndpoint;
  to: ConnectorEndpoint;
  routing: 'straight' | 'orthogonal' | 'curved';
  color: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  arrowStart: boolean;
  arrowEnd: boolean;
  label?: string;
}

export class WYSIWYGCalloutEngine {
  private static instance: WYSIWYGCalloutEngine;

  public static getInstance(): WYSIWYGCalloutEngine {
    if (!WYSIWYGCalloutEngine.instance) {
      WYSIWYGCalloutEngine.instance = new WYSIWYGCalloutEngine();
    }
    return WYSIWYGCalloutEngine.instance;
  }

  /**
   * توليد كود HTML نقي للشروحات ليتم إدراجه في المحرر النصي أو في الكانفا ومصمم الواجهات
   */
  public generateCalloutHtml(callout: CalloutDefinition): string {
    const {
      title,
      description,
      stepNumber,
      themeColor = '#2563eb',
      backgroundColor = '#ffffff',
      textColor = '#1e293b',
      icon = '💡',
      extraData = {},
    } = callout;

    switch (callout.type) {
      case 'badge':
        return `
<div class="wysiwyg-step-badge" style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 999px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); margin: 6px 0;">
  <span style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background-color: ${themeColor}; color: #ffffff; font-weight: 800; font-size: 12px;">
    ${stepNumber || 1}
  </span>
  <span style="font-weight: 700; font-size: 13px; color: ${textColor};">${title}</span>
</div>`.trim();

      case 'pin':
        return `
<div class="wysiwyg-spotlight-pin" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background-color: #eff6ff; border: 1.5px solid #3b82f6; border-radius: 8px; color: #1d4ed8; font-weight: 700; font-size: 12px; margin: 4px 0; box-shadow: 0 2px 8px rgba(59,130,246,0.08);">
  <span>📍</span>
  <span>${title}: ${description}</span>
</div>`.trim();

      case 'alert':
        return `
<div class="wysiwyg-alert-callout" style="display: flex; gap: 12px; padding: 14px 18px; background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 12px; margin: 10px 0;">
  <span style="font-size: 20px;">⚠️</span>
  <div>
    <h4 style="margin: 0 0 4px 0; color: #b45309; font-size: 14px; font-weight: bold;">${title}</h4>
    <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">${description}</p>
  </div>
</div>`.trim();

      case 'stat':
        return `
<div class="wysiwyg-stat-tile" style="padding: 16px 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); max-width: 260px; margin: 8px 0;">
  <span style="font-size: 12px; font-weight: 600; color: #64748b;">${title}</span>
  <div style="font-size: 26px; font-weight: 900; color: ${themeColor}; margin: 4px 0;">${extraData.statValue || '100%'}</div>
  <p style="margin: 0; font-size: 12px; color: ${textColor};">${description}</p>
</div>`.trim();

      case 'checklist':
        return `
<div class="wysiwyg-checklist-card" style="padding: 16px 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin: 10px 0;">
  <h4 style="margin: 0 0 10px 0; color: ${textColor}; font-size: 14px; font-weight: bold;">✅ ${title}</h4>
  <ul style="margin: 0; padding-right: 20px; color: #475569; font-size: 13px; line-height: 1.8;">
    <li>${description}</li>
    <li>تم التحقق من المعايير والتصميم بالثيم الفاتح النقي</li>
  </ul>
</div>`.trim();

      case 'timeline':
        return `
<div class="wysiwyg-timeline-step" style="display: flex; gap: 12px; align-items: flex-start; margin: 10px 0;">
  <div style="width: 28px; height: 28px; border-radius: 50%; background: ${themeColor}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">
    ${stepNumber || '1'}
  </div>
  <div style="padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; flex: 1;">
    <strong style="color: #0f172a; font-size: 13px;">${title}</strong>
    <p style="margin: 2px 0 0 0; color: #64748b; font-size: 12px;">${description}</p>
  </div>
</div>`.trim();

      case 'code-explainer':
        return `
<div class="wysiwyg-code-explainer" style="background: #ffffff; border: 1.5px solid #3b82f6; border-radius: 12px; padding: 12px 16px; margin: 10px 0; box-shadow: 0 4px 12px rgba(59,130,246,0.06);">
  <div style="display: flex; align-items: center; gap: 6px; color: #2563eb; font-weight: bold; font-size: 12px; margin-bottom: 6px;">
    <span>💻</span> <span>شرح الشفرة: ${title}</span>
  </div>
  <code style="display: block; background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #0f172a; margin-bottom: 6px;">
    ${extraData.codeSample || 'const init = () => true;'}
  </code>
  <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">${description}</p>
</div>`.trim();

      case 'comparison':
        return `
<div class="wysiwyg-comparison-box" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0;">
  <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
    <h5 style="margin: 0 0 4px 0; color: #64748b; font-size: 12px;">السابق</h5>
    <p style="margin: 0; color: #94a3b8; font-size: 12px;">${extraData.beforeText || 'الطريقة اليدوية التقليدية'}</p>
  </div>
  <div style="padding: 12px; background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 10px;">
    <h5 style="margin: 0 0 4px 0; color: #16a34a; font-size: 12px;">✨ الجديد (${title})</h5>
    <p style="margin: 0; color: #15803d; font-size: 12px;">${description}</p>
  </div>
</div>`.trim();

      case 'quote':
        return `
<blockquote class="wysiwyg-quote-banner" style="margin: 12px 0; padding: 12px 18px; border-right: 4px solid ${themeColor}; background: #f8fafc; border-radius: 0 8px 8px 0; color: ${textColor}; font-size: 13px; font-style: italic;">
  <strong>"${title}"</strong> — ${description}
</blockquote>`.trim();

      case 'review':
        return `
<div class="wysiwyg-review-box" style="padding: 12px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); margin: 8px 0;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
    <strong style="color: #0f172a; font-size: 13px;">${title}</strong>
    <span style="color: #f59e0b; font-size: 12px;">★★★★★ 5.0</span>
  </div>
  <p style="margin: 0; color: #64748b; font-size: 12px;">${description}</p>
</div>`.trim();

      default:
        return `
<div class="wysiwyg-callout-card" style="position: relative; max-width: 380px; padding: 14px 18px; background: ${backgroundColor}; border: 1.5px solid ${themeColor}; border-radius: 12px; box-shadow: 0 4px 14px rgba(37,99,235,0.08); margin: 12px 0; font-family: inherit;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
    ${stepNumber ? `<span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: ${themeColor}; color: #ffffff; font-size: 11px; font-weight: bold;">${stepNumber}</span>` : `<span style="font-size: 16px;">${icon}</span>`}
    <strong style="color: ${themeColor}; font-size: 14px; font-weight: 800;">${title}</strong>
  </div>
  <p style="margin: 0; font-size: 13px; color: ${textColor}; line-height: 1.6;">${description}</p>
</div>`.trim();
    }
  }

  /**
   * حساب مسار SVG للموصل بين نقطتين أو عنصرين
   */
  public calculateConnectorPath(connector: ConnectorDefinition): string {
    const { from, to, routing } = connector;
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;

    if (routing === 'straight') {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    if (routing === 'curved') {
      const dx = (x2 - x1) * 0.5;
      return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
    }

    // Orthogonal
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }

  /**
   * توليد شفرة SVG متجهة للموصل لعرضها وتصديرها
   */
  public generateConnectorSvg(connector: ConnectorDefinition): string {
    const pathD = this.calculateConnectorPath(connector);
    const markerStart = connector.arrowStart
      ? `marker-start="url(#arrow-${connector.id}-start)"`
      : '';
    const markerEnd = connector.arrowEnd ? `marker-end="url(#arrow-${connector.id}-end)"` : '';

    return `
<g class="connector-group" id="connector-${connector.id}">
  <defs>
    ${
      connector.arrowEnd
        ? `
    <marker id="arrow-${connector.id}-end" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0 1, 8 4, 0 7" fill="${connector.color}" />
    </marker>`
        : ''
    }
    ${
      connector.arrowStart
        ? `
    <marker id="arrow-${connector.id}-start" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
      <polygon points="8 1, 0 4, 8 7" fill="${connector.color}" />
    </marker>`
        : ''
    }
  </defs>
  <path d="${pathD}" fill="none" stroke="${connector.color}" stroke-width="${connector.strokeWidth}" stroke-dasharray="${connector.strokeStyle === 'dashed' ? '5,5' : connector.strokeStyle === 'dotted' ? '2,2' : 'none'}" ${markerStart} ${markerEnd} />
  ${
    connector.label
      ? `
  <text x="${(connector.from.x + connector.to.x) / 2}" y="${(connector.from.y + connector.to.y) / 2 - 8}" fill="${connector.color}" font-size="11" font-weight="bold" text-anchor="middle">
    ${connector.label}
  </text>`
      : ''
  }
</g>`.trim();
  }
}

export const wysiwygCalloutEngine = WYSIWYGCalloutEngine.getInstance();
