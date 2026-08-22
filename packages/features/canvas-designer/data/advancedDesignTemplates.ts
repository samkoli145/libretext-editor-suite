/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكتبة قوالب التصميم والشروحات التفاعلية المتقدمة - Advanced Design Templates
 * 🏛️ الدور: سجل نماذج التصميم ومكونات الشرح التفاعلي (15+ قالباً عصرياً)
 * 📥 المستهلك: DraggableTemplatePanel, componentLibrary, CanvasDesignerEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Interactive Callout & Visual Annotation Framework: قوالب ومكونات HTML/SVG
 *    تفاعلية مسبقة التصميم بالثيم الفاتح النقي 100% تدعم السحب والإفلات والتعديل
 *    المباشر بالفأرة وبناء الشروحات التوضيحية بطريقة WYSIWYG.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. جميع القوالب يجب أن تستخدم ثيمات وألوان فاتحة نقية (Pure Light)
 *    2. الالتزام بالاتجاه العربي RTL في النصوص والمحاذاة
 *    3. التوافق التام مع واجهات DOMParser وCanvas 2D
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - أحجام ونسب افتراضية متوازنة
 *    - هياكل وسوم HTML معقمة وآمنة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { WebTemplateItem } from '../componentLibrary';

export const ADVANCED_DESIGN_TEMPLATES: WebTemplateItem[] = [
  // 1. Interactive Controlled Callout Box
  {
    id: 'callout-interactive-controlled',
    name: 'Controlled Callout Box',
    nameAr: 'مربع شرح تحكمي متعدد الرؤوس',
    category: 'callouts',
    categoryAr: 'مربعات الشرح والإشارات التوضيحية',
    icon: '💬',
    descriptionAr: 'صندوق شرح توضيحي تفاعلي مع رأس إشارة متجه وأيقونة تنبيه ومفتاح إجراء سريع',
    templateHtml: `
<div style="width: 320px; background-color: #ffffff; border: 1.5px solid #3b82f6; border-radius: 12px; padding: 14px 18px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05); font-family: inherit; position: relative; direction: rtl; text-align: right;">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background-color: #eff6ff; color: #2563eb; border-radius: 6px; font-weight: bold; font-size: 13px;">💡</span>
      <strong style="color: #1e3a8a; font-size: 13px;">شرح توضيحي تفاعلي</strong>
    </div>
    <span style="font-size: 10px; font-weight: 700; color: #3b82f6; background-color: #dbeafe; padding: 2px 8px; border-radius: 9999px;">خطوة 1</span>
  </div>
  <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0 0 10px 0;">
    انقر على هذا العنصر لفتح لوحة الخصائص المتقدمة وتعديل زوايا الحواف والألوان.
  </p>
  <div style="display: flex; justify-content: flex-end; gap: 6px;">
    <button style="background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">تجاهل</button>
    <button style="background-color: #2563eb; color: #ffffff; border: none; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">تنفيذ الآن</button>
  </div>
</div>
    `,
  },

  // 2. Smart Curved Connector
  {
    id: 'connector-smart-curved',
    name: 'Smart Curved Connector',
    nameAr: 'موصل منحنٍ ذكي متدرج',
    category: 'connectors',
    categoryAr: 'الموصلات والروابط التفاعلية',
    icon: '〰️',
    descriptionAr: 'موصل متجهي منحنٍ يربط بين كتلتين مع وسم وسهم نهاية ديناميكي',
    templateHtml: `
<div style="width: 260px; height: 90px; position: relative; direction: rtl;">
  <svg width="260" height="90" viewBox="0 0 260 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
    <path d="M 10 75 C 90 75, 170 15, 245 15" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="4 4" fill="none" />
    <polygon points="255,15 243,9 243,21" fill="#2563eb" />
    <circle cx="10" cy="75" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
  </svg>
  <div style="position: absolute; top: 32px; left: 80px; background-color: #ffffff; border: 1px solid #bfdbfe; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; color: #1e40af; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    تدفق البيانات ⚡
  </div>
</div>
    `,
  },

  // 3. Step-by-Step Walkthrough Pin
  {
    id: 'walkthrough-step-pin',
    name: 'Step Walkthrough Pin',
    nameAr: 'دبوس خطوة مرقم تفاعلي',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية والشروحات',
    icon: '📍',
    descriptionAr: 'دبوس دائري مرقم نابض لتسليط الضوء على خطوات التفاعل في الواجهة',
    templateHtml: `
<div style="display: inline-flex; align-items: center; gap: 8px; background-color: #ffffff; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: inherit; direction: rtl;">
  <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #ffffff; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);">
    1
  </div>
  <span style="font-size: 12px; font-weight: 700; color: #1e293b;">انقر لتحديد العنصر</span>
</div>
    `,
  },

  // 4. Magnifier Loupe Highlight
  {
    id: 'magnifier-loupe-highlight',
    name: 'Magnifier Loupe Highlight',
    nameAr: 'عدسة تكبير وتسليط الضوء',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية والشروحات',
    icon: '🔍',
    descriptionAr: 'عدسة دائرية بصرية مع إطار أنيق لتكبير التفاصيل الهندسية والصور',
    templateHtml: `
<div style="width: 130px; height: 130px; border-radius: 9999px; border: 3px solid #3b82f6; background-color: #f8fafc; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25), inset 0 0 15px rgba(59, 130, 246, 0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; font-family: inherit;">
  <span style="font-size: 24px; margin-bottom: 2px;">🔎</span>
  <span style="font-size: 11px; font-weight: 800; color: #1e40af;">تكبير 200%</span>
  <span style="font-size: 9px; color: #64748b;">تفاصيل الكانفا</span>
</div>
    `,
  },

  // 5. Spotlight Focus Overlay
  {
    id: 'spotlight-focus-overlay',
    name: 'Spotlight Focus Overlay',
    nameAr: 'قناع تسليط الضوء البؤري',
    category: 'callouts',
    categoryAr: 'مربعات الشرح والإشارات التوضيحية',
    icon: '🔦',
    descriptionAr: 'بطاقة تركيز بصرية مع إطار مضيء لشرح نقطة ارتكاز مركزية',
    templateHtml: `
<div style="width: 280px; background-color: #ffffff; border: 2px dashed #3b82f6; border-radius: 14px; padding: 16px; box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.08); font-family: inherit; direction: rtl; text-align: right;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
    <span style="color: #2563eb; font-size: 16px;">🎯</span>
    <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a;">منطقة التركيز المباشر</h4>
  </div>
  <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
    يتم توجيه انتباه المستخدم إلى هذا الزر لزيادة معدل التحويل والتفاعل.
  </p>
</div>
    `,
  },

  // 6. Interactive Code Diff Callout
  {
    id: 'code-diff-callout',
    name: 'Code Diff Callout',
    nameAr: 'بطاقة مقارنة وتصحيح الأكواد',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية والشروحات',
    icon: '🔄',
    descriptionAr: 'شريحة مقارنة كود قبل وبعد بالثيم الفاتح النقي مع تمييز الأسطر',
    templateHtml: `
<div style="width: 340px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); font-family: monospace; font-size: 11px; direction: ltr; text-align: left;">
  <div style="background-color: #f8fafc; padding: 6px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569; font-size: 10px; display: flex; justify-content: space-between;">
    <span>App.tsx (Diff View)</span>
    <span style="color: #16a34a;">+2 lines</span>
  </div>
  <div style="padding: 10px; line-height: 1.6;">
    <div style="background-color: #fef2f2; color: #dc2626; padding: 2px 6px; border-radius: 4px; margin-bottom: 2px;">- const theme = 'dark';</div>
    <div style="background-color: #f0fdf4; color: #16a34a; padding: 2px 6px; border-radius: 4px; font-weight: bold;">+ const theme = 'pure-light-100';</div>
  </div>
</div>
    `,
  },

  // 7. WYSIWYG Annotation Badge
  {
    id: 'annotation-badge-info',
    name: 'Annotation Badge Info',
    nameAr: 'شارة وسم عائمة معلوماتية',
    category: 'badge',
    categoryAr: 'الشارات والوسوم التفاعلية',
    icon: '🏷️',
    descriptionAr: 'شارة أنيقة بألوان الباستيل الفاتحة لوسم العناصر وتوضيح حالتها',
    templateHtml: `
<div style="display: inline-flex; align-items: center; gap: 6px; background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 4px 10px; border-radius: 6px; font-family: inherit; font-size: 11px; font-weight: 700; color: #1d4ed8; direction: rtl;">
  <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: #2563eb;"></span>
  <span>مكوّن متجاوب 100%</span>
</div>
    `,
  },

  // 8. Formula Annotation Anchor
  {
    id: 'formula-annotation-anchor',
    name: 'Formula Annotation Anchor',
    nameAr: 'صندوق شرح المعادلات الرياضية',
    category: 'callouts',
    categoryAr: 'مربعات الشرح والإشارات التوضيحية',
    icon: '∑',
    descriptionAr: 'بطاقة شرح هندسي مخصصة للصيغ الرياضية وتحويلات الإحداثيات',
    templateHtml: `
<div style="width: 300px; background-color: #ffffff; border: 1px solid #e2e8f0; border-right: 4px solid #8b5cf6; border-radius: 8px; padding: 12px 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); font-family: inherit; direction: rtl; text-align: right;">
  <div style="font-size: 11px; font-weight: 800; color: #6d28d9; margin-bottom: 4px;">📐 معادلة بيزييه التكعيبية</div>
  <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 11px; color: #4c1d95; margin-bottom: 6px; direction: ltr; text-align: center;">
    B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
  </div>
  <div style="font-size: 10px; color: #64748b;">تحدد انحناء المسار السلس بدقة البكسل.</div>
</div>
    `,
  },

  // 9. Foldable Accordion Callout
  {
    id: 'foldable-accordion-callout',
    name: 'Foldable Accordion Callout',
    nameAr: 'شرح توضيحي قابل للتمدد والطي',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية والشروحات',
    icon: '📂',
    descriptionAr: 'كتلة أكورديون تفاعلية مع تفاصيل مخفية تظهر عند النقر',
    templateHtml: `
<div style="width: 320px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.03); font-family: inherit; direction: rtl; text-align: right;">
  <div style="background-color: #f8fafc; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; cursor: pointer;">
    <span>💡 نظرة معمارية على النواة</span>
    <span style="color: #64748b; font-size: 10px;">▲ طي</span>
  </div>
  <div style="padding: 12px 14px; font-size: 11px; color: #475569; line-height: 1.6;">
    تعتمد المنصة على بنية معيارية خالية تماماً من التبعيات الخارجية وتستند لمكتبات المتصفح الأصلية.
  </div>
</div>
    `,
  },

  // 10. Floating Stamp Annotation
  {
    id: 'floating-stamp-approved',
    name: 'Floating Stamp Approved',
    nameAr: 'ختم اعتماد وتوثيق بصري',
    category: 'badge',
    categoryAr: 'الشارات والوسوم التفاعلية',
    icon: '💮',
    descriptionAr: 'ختم دائري مائل بلون أخضر ناصع لتوثيق اكتمال المراجعة والتسليم',
    templateHtml: `
<div style="display: inline-block; transform: rotate(-8deg); border: 2.5px solid #16a34a; color: #16a34a; background-color: rgba(240, 253, 244, 0.9); padding: 4px 14px; border-radius: 8px; font-family: inherit; font-weight: 900; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15); direction: rtl;">
  ✓ معتمد ومطابق للمعايير
</div>
    `,
  },

  // 11. Two-Way Pointer Callout
  {
    id: 'two-way-pointer-callout',
    name: 'Two-Way Pointer Callout',
    nameAr: 'مؤشر تدفق ثنائي الاتجاه',
    category: 'connectors',
    categoryAr: 'الموصلات والروابط التفاعلية',
    icon: '↔️',
    descriptionAr: 'شريط توضيحي يربط بين نقطتين ويوضح المزامنة اللحظية ثنائية الاتجاه',
    templateHtml: `
<div style="width: 280px; display: flex; align-items: center; justify-content: space-between; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 9999px; padding: 6px 16px; font-family: inherit; font-size: 11px; font-weight: 700; color: #15803d; direction: rtl;">
  <span>المحرر المرئي</span>
  <span style="font-size: 14px;">⇄</span>
  <span>محرر الكود الحي</span>
</div>
    `,
  },

  // 12. Draggable Sticky Note
  {
    id: 'draggable-sticky-note-yellow',
    name: 'Draggable Sticky Note',
    nameAr: 'ملصق ملاحظات باستيل أصفر',
    category: 'callouts',
    categoryAr: 'مربعات الشرح والإشارات التوضيحية',
    icon: '📝',
    descriptionAr: 'ورقة ملاحظات صفراء فاتحة مع شريط لاصق علوي وظل ناعم',
    templateHtml: `
<div style="width: 220px; min-height: 140px; background-color: #fef9c3; border: 1px solid #fef08a; border-radius: 2px 2px 10px 2px; padding: 14px; box-shadow: 0 8px 16px -4px rgba(0,0,0,0.08); font-family: inherit; direction: rtl; text-align: right; position: relative;">
  <div style="position: absolute; top: -6px; right: 50%; transform: translateX(50%); width: 60px; height: 14px; background-color: rgba(254, 240, 138, 0.8); border: 1px dashed #facc15;"></div>
  <div style="font-weight: 800; font-size: 12px; color: #854d0e; margin-bottom: 6px;">📌 ملاحظة هامة:</div>
  <p style="font-size: 11px; color: #713f12; line-height: 1.5; margin: 0;">
    تأكد من ضبط هوامش الحاويات لتكون متوافقة مع الأجهزة الذكية قبل التصدير.
  </p>
</div>
    `,
  },

  // 13. Measurement Ruler Guide
  {
    id: 'measurement-ruler-guide',
    name: 'Measurement Ruler Guide',
    nameAr: 'دليل قياس وأبعاد بكسلية',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية والشروحات',
    icon: '📏',
    descriptionAr: 'مسطرة قياس أفقية تعرض العرض الدقيق بالبكسل مع خطوط تحديد النهاية',
    templateHtml: `
<div style="width: 260px; height: 28px; position: relative; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 10px; font-weight: bold; color: #0284c7; direction: ltr;">
  <div style="position: absolute; left: 0; top: 2px; bottom: 2px; width: 2px; background-color: #0284c7;"></div>
  <div style="width: 100%; height: 1px; background-color: #0284c7;"></div>
  <div style="position: absolute; right: 0; top: 2px; bottom: 2px; width: 2px; background-color: #0284c7;"></div>
  <span style="position: absolute; background-color: #ffffff; border: 1px solid #bae6fd; padding: 1px 6px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">260px</span>
</div>
    `,
  },

  // 14. Target Focus Reticle
  {
    id: 'target-focus-reticle',
    name: 'Target Focus Reticle',
    nameAr: 'علامة تصويب وتحديد نقطي',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية والشروحات',
    icon: '🎯',
    descriptionAr: 'علامة تصويب هندسية دائرية متقاطعة لتحديد مراكز الجذب والتفاعل',
    templateHtml: `
<div style="width: 80px; height: 80px; position: relative; display: flex; align-items: center; justify-content: center;">
  <div style="width: 60px; height: 60px; border: 1.5px solid #ef4444; border-radius: 9999px; position: absolute;"></div>
  <div style="width: 20px; height: 20px; border: 1.5px solid #ef4444; border-radius: 9999px; position: absolute;"></div>
  <div style="width: 100%; height: 1px; background-color: #ef4444; position: absolute;"></div>
  <div style="height: 100%; width: 1px; background-color: #ef4444; position: absolute;"></div>
  <div style="width: 4px; height: 4px; background-color: #dc2626; border-radius: 9999px; position: absolute;"></div>
</div>
    `,
  },

  // 15. Interactive Legend Card
  {
    id: 'interactive-legend-card',
    name: 'Interactive Legend Card',
    nameAr: 'بطاقة مفتاح توضيحي للمخطط',
    category: 'callouts',
    categoryAr: 'مربعات الشرح والإشارات التوضيحية',
    icon: '📑',
    descriptionAr: 'بطاقة قائمة توضيحية مفهرسة لشرح دلالات الألوان في الرسم التوضيحي',
    templateHtml: `
<div style="width: 200px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); font-family: inherit; font-size: 11px; direction: rtl; text-align: right;">
  <strong style="display: block; color: #1e293b; margin-bottom: 8px; font-size: 11px;">مفتاح الخريطة والتصميم:</strong>
  <div style="display: flex; flex-direction: column; gap: 6px;">
    <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
      <span style="width: 8px; height: 8px; border-radius: 2px; background-color: #3b82f6;"></span>
      <span>مكونات الواجهة (UI)</span>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
      <span style="width: 8px; height: 8px; border-radius: 2px; background-color: #10b981;"></span>
      <span>محركات المعالجة (Core)</span>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
      <span style="width: 8px; height: 8px; border-radius: 2px; background-color: #f59e0b;"></span>
      <span>أحداث الفأرة والتفاعل</span>
    </div>
  </div>
</div>
    `,
  },

  // 16. Smart Two-Pane Comparison Split (50/50)
  {
    id: 'split-two-pane-comparison',
    name: 'Smart Two-Pane Comparison Split',
    nameAr: 'تقسيم ثنائي ذكي للمقارنة التفاعلية (50/50 Split)',
    category: 'split-layouts',
    categoryAr: 'التقسيم الذكي والتفاعل اللحظي',
    icon: '🔲',
    descriptionAr: 'قالب تقسيم رأسي متكافئ للمقارنات المباشرة مع شريط مقسم تفاعلي وبطاقات متقابلة',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.06); font-family: inherit; direction: rtl; text-align: right;">
  <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="width: 10px; height: 10px; border-radius: 9999px; background-color: #3b82f6;"></span>
      <strong style="color: #0f172a; font-size: 13px;">مقارنة تفاعلية لحظية (Side-by-Side Split)</strong>
    </div>
    <span style="font-size: 11px; background-color: #e0e7ff; color: #4338ca; padding: 3px 8px; border-radius: 6px; font-weight: bold;">تزامن لحظي 50/50</span>
  </div>
  <div style="display: flex; min-height: 220px; position: relative;">
    <!-- Left / Original Side -->
    <div style="flex: 1; padding: 16px; background-color: #ffffff; border-left: 1px solid #e2e8f0;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-size: 12px; font-weight: 700; color: #1e293b;">النموذج التقليدي (النسخة أ)</span>
        <span style="font-size: 10px; color: #64748b; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px;">الحالي</span>
      </div>
      <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0 0 12px 0;">
        الاعتماد على المعالجة التسلسلية والاتصالات الخارجية البطيئة دون تخزين مؤقت.
      </p>
      <div style="padding: 10px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; font-size: 11px; color: #991b1b;">
        ⏱️ معدل الاستجابة: <strong>480ms</strong> (بطيء)
      </div>
    </div>
    <!-- Interactive Divider Marker -->
    <div style="width: 6px; background-color: #e2e8f0; display: flex; align-items: center; justify-content: center; cursor: col-resize;">
      <div style="width: 14px; height: 28px; background-color: #3b82f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 9px; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">↔</div>
    </div>
    <!-- Right / Optimized Side -->
    <div style="flex: 1; padding: 16px; background-color: #f0fdf4;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-size: 12px; font-weight: 700; color: #166534;">المعمارية المحسنة (النسخة ب)</span>
        <span style="font-size: 10px; color: #16a34a; background-color: #dcfce7; padding: 2px 6px; border-radius: 4px; font-weight: bold;">موصى به</span>
      </div>
      <p style="font-size: 12px; color: #15803d; line-height: 1.6; margin: 0 0 12px 0;">
        نواة مشتركة معزولة (Zero-Dependency) وتخزين محلي ذكي فائق السرعة.
      </p>
      <div style="padding: 10px; background-color: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 11px; color: #166534;">
        ⚡ معدل الاستجابة: <strong>12ms</strong> (أسرع بـ 40 ضعفاً)
      </div>
    </div>
  </div>
</div>
    `,
  },

  // 17. Three-Column Dashboard Master Split
  {
    id: 'split-three-column-dashboard',
    name: 'Three-Column Dashboard Master Split',
    nameAr: 'تقسيم ثلاثي الأعمدة للوحات التحكم المتقدمة',
    category: 'dashboards',
    categoryAr: 'لوحات العمل والمقارنات',
    icon: '📊',
    descriptionAr: 'قالب تقسيم متقدم (شريط أدوات جانبي 20% + مساحة رسم مركزية 60% + مفتش خصائص 20%)',
    templateHtml: `
<div style="width: 760px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.05); font-family: inherit; direction: rtl; text-align: right;">
  <!-- Header Bar -->
  <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-weight: 800; color: #1e293b; font-size: 12px;">لوحة الإنتاج المتكاملة</span>
      <span style="font-size: 10px; color: #059669; background-color: #ecfdf5; padding: 2px 6px; border-radius: 4px; font-weight: bold;">● متصل مباشرة</span>
    </div>
    <div style="display: flex; gap: 6px;">
      <button style="padding: 3px 8px; font-size: 10px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer;">تحديث</button>
      <button style="padding: 3px 10px; font-size: 10px; background-color: #3b82f6; color: #ffffff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">تصدير</button>
    </div>
  </div>
  <!-- Main 3 Columns Body -->
  <div style="display: flex; min-height: 200px;">
    <!-- Column 1: Navigation Sidebar (20%) -->
    <div style="width: 140px; background-color: #f8fafc; border-left: 1px solid #e2e8f0; padding: 12px 8px;">
      <span style="display: block; font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 8px;">الأدوات الفعالة:</span>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="padding: 6px 8px; font-size: 11px; background-color: #eff6ff; color: #1d4ed8; border-radius: 6px; font-weight: bold; cursor: pointer;">🎨 محرر الكانفا</div>
        <div style="padding: 6px 8px; font-size: 11px; color: #475569; border-radius: 6px; cursor: pointer;">📱 مصمم الواجهات</div>
        <div style="padding: 6px 8px; font-size: 11px; color: #475569; border-radius: 6px; cursor: pointer;">✍️ محرر النصوص</div>
        <div style="padding: 6px 8px; font-size: 11px; color: #475569; border-radius: 6px; cursor: pointer;">📑 عارض PDF</div>
      </div>
    </div>
    <!-- Column 2: Central Canvas Area (60%) -->
    <div style="flex: 1; padding: 16px; background-color: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
      <div style="border: 2px dashed #cbd5e1; border-radius: 8px; width: 90%; padding: 24px 16px; background-color: #fafafa;">
        <span style="font-size: 24px; display: block; margin-bottom: 6px;">🎯</span>
        <strong style="color: #1e293b; font-size: 12px; display: block;">مساحة العمل المركزية (Main Stage)</strong>
        <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">اسحب وأفلت العناصر والمكونات مباشرة للتفاعل اللحظي.</p>
      </div>
    </div>
    <!-- Column 3: Inspector Panel (20%) -->
    <div style="width: 150px; background-color: #f8fafc; border-right: 1px solid #e2e8f0; padding: 12px 10px;">
      <span style="display: block; font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 8px;">مفتش الخصائص:</span>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 10px; color: #334155;">
        <div style="display: flex; justify-content: space-between;"><span>العرض (W):</span><strong>840px</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>الارتفاع (H):</span><strong>520px</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>الشفافية:</span><strong>100%</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>الطبقة:</span><span style="color: #2563eb; font-weight: bold;">Main-1</span></div>
      </div>
    </div>
  </div>
</div>
    `,
  },

  // 18. Live Code and Real-Time Preview Split
  {
    id: 'split-live-code-preview',
    name: 'Live Code and Real-Time Preview Split',
    nameAr: 'تقسيم محرر الكود الحي والمعاينة الفورية',
    category: 'split-layouts',
    categoryAr: 'التقسيم الذكي والتفاعل اللحظي',
    icon: '💻',
    descriptionAr: 'قالب تفاعلي مقسم يدمج كود HTML/JSX على اليمين مع العرض التفاعلي الحي على اليسار',
    templateHtml: `
<div style="width: 720px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06); font-family: inherit; direction: rtl; text-align: right;">
  <div style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-family: monospace; font-size: 12px; font-weight: bold; color: #0284c7;">&lt;/&gt; Live Code Studio</span>
      <span style="font-size: 10px; background-color: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 4px;">تفاعل لحظي</span>
    </div>
    <span style="font-size: 10px; color: #64748b;">محرر مباشر + مفسر حي</span>
  </div>
  <div style="display: flex; min-height: 200px;">
    <!-- Code Editor Half -->
    <div style="flex: 1; background-color: #f8fafc; padding: 14px; border-left: 1px solid #e2e8f0; font-family: monospace; font-size: 11px; line-height: 1.6; color: #0f172a; direction: ltr; text-align: left;">
      <div style="color: #64748b;">// Live UI Component Definition</div>
      <div><span style="color: #0284c7;">const</span> <span style="color: #d97706;">SmartButton</span> = () =&gt; {</div>
      <div style="padding-left: 14px;"><span style="color: #0284c7;">return</span> (</div>
      <div style="padding-left: 28px;">&lt;<span style="color: #2563eb;">button</span> <span style="color: #9333ea;">className</span>=<span style="color: #16a34a;">"btn-primary"</span>&gt;</div>
      <div style="padding-left: 42px;">انقر للتفاعل اللحظي ⚡</div>
      <div style="padding-left: 28px;">&lt;/<span style="color: #2563eb;">button</span>&gt;</div>
      <div style="padding-left: 14px;">);</div>
      <div>};</div>
    </div>
    <!-- Live Render Half -->
    <div style="flex: 1; padding: 20px; background-color: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
      <span style="font-size: 11px; font-weight: bold; color: #475569;">المعاينة الحية الناتجة (Live Output):</span>
      <button style="background-color: #2563eb; color: #ffffff; border: none; padding: 8px 18px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">
        انقر للتفاعل اللحظي ⚡
      </button>
      <span style="font-size: 10px; color: #16a34a; background-color: #dcfce7; padding: 2px 8px; border-radius: 9999px;">✓ تم التحقق والمطابقة</span>
    </div>
  </div>
</div>
    `,
  },

  // 19. Holy Grail Responsive Workspace Layout
  {
    id: 'split-holy-grail-workspace',
    name: 'Holy Grail Responsive Workspace Layout',
    nameAr: 'هيكل مساحة العمل الشامل (Holy Grail Split)',
    category: 'split-layouts',
    categoryAr: 'التقسيم الذكي والتفاعل اللحظي',
    icon: '🏛️',
    descriptionAr: 'قالب تقسيم شامل متجاوب يضم الترويسة، الشريط الجانبي، مساحة العمل، الملاحظات، والتذييل',
    templateHtml: `
<div style="width: 700px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05); font-family: inherit; direction: rtl; text-align: right;">
  <!-- Header -->
  <div style="background-color: #1e293b; color: #ffffff; padding: 8px 14px; font-size: 12px; font-weight: bold; display: flex; justify-content: space-between;">
    <span>🏛️ ترويسة النظام والمشروع (Header Zone)</span>
    <span style="font-size: 10px; opacity: 0.8;">إصدار 2.4</span>
  </div>
  <!-- Middle 3 zones -->
  <div style="display: flex; min-height: 140px;">
    <!-- Left Aside -->
    <div style="width: 120px; background-color: #f8fafc; border-left: 1px solid #e2e8f0; padding: 10px; font-size: 11px; color: #475569;">
      <strong>شجرة الملفات:</strong>
      <div style="margin-top: 6px; font-size: 10px; line-height: 1.8;">
        📁 src/<br>
        &nbsp;├── 🧠 core/<br>
        &nbsp;└── 🎨 shared/
      </div>
    </div>
    <!-- Main Center -->
    <div style="flex: 1; padding: 16px; background-color: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <span style="font-size: 13px; font-weight: bold; color: #0f172a;">مساحة التحرير التفاعلية (Center Stage)</span>
      <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">التحرير المباشر بطريقة WYSIWYG مع دعم كامل لكافة أدوات الفأرة.</p>
    </div>
    <!-- Right Aside -->
    <div style="width: 120px; background-color: #f8fafc; border-right: 1px solid #e2e8f0; padding: 10px; font-size: 11px; color: #475569;">
      <strong>الطبقات الفعالة:</strong>
      <div style="margin-top: 6px; font-size: 10px; line-height: 1.8;">
        🔹 Layer-1<br>
        🔹 Text-Box<br>
        🔹 Chart-Zone
      </div>
    </div>
  </div>
  <!-- Footer -->
  <div style="background-color: #f1f5f9; border-top: 1px solid #e2e8f0; padding: 6px 14px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between;">
    <span>جاهز للعمل - UTF-8</span>
    <span>تزامن تلقائي 100%</span>
  </div>
</div>
    `,
  },

  // 20. Quadrant Grid Split Screen (2x2 Matrix)
  {
    id: 'split-quadrant-grid-screen',
    name: 'Quadrant Grid Split Screen',
    nameAr: 'تقسيم شبكي رباعي متقاطع (2x2 Matrix Split)',
    category: 'split-layouts',
    categoryAr: 'التقسيم الذكي والتفاعل اللحظي',
    icon: '⊞',
    descriptionAr: 'قالب تقسيم رباعي لمراقبة 4 مناطق وظيفية ومحررات في آن واحد بتناسق تام',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05); font-family: inherit; direction: rtl; text-align: right;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; min-height: 240px;">
    <!-- Q1: Top Right -->
    <div style="padding: 14px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0; background-color: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <strong style="font-size: 12px; color: #1e293b;">1. منطقة الكانفا والرسومات</strong>
        <span style="font-size: 10px; background-color: #dbeafe; color: #1d4ed8; padding: 1px 6px; border-radius: 4px;">Q1</span>
      </div>
      <p style="font-size: 11px; color: #64748b; margin: 0;">لوحة حرة للرسم والتخطيط بالأشكال الهندسية.</p>
    </div>
    <!-- Q2: Top Left -->
    <div style="padding: 14px; border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <strong style="font-size: 12px; color: #1e293b;">2. منطقة محرر الواجهات</strong>
        <span style="font-size: 10px; background-color: #dcfce7; color: #166534; padding: 1px 6px; border-radius: 4px;">Q2</span>
      </div>
      <p style="font-size: 11px; color: #64748b; margin: 0;">بناء صفحات الويب والنماذج عبر الكتل الذكية.</p>
    </div>
    <!-- Q3: Bottom Right -->
    <div style="padding: 14px; border-left: 1px solid #e2e8f0; background-color: #f8fafc;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <strong style="font-size: 12px; color: #1e293b;">3. منطقة النصوص والمستندات</strong>
        <span style="font-size: 10px; background-color: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 4px;">Q3</span>
      </div>
      <p style="font-size: 11px; color: #64748b; margin: 0;">محرر نصوص غنية مدعوم بالجداول والشريط الموحد.</p>
    </div>
    <!-- Q4: Bottom Left -->
    <div style="padding: 14px; background-color: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <strong style="font-size: 12px; color: #1e293b;">4. منطقة عارض PDF</strong>
        <span style="font-size: 10px; background-color: #fae8ff; color: #86198f; padding: 1px 6px; border-radius: 4px;">Q4</span>
      </div>
      <p style="font-size: 11px; color: #64748b; margin: 0;">تصدير ومعاينة المستندات بجودة طباعية عالية.</p>
    </div>
  </div>
</div>
    `,
  },

  // 21. Master-Detail Drilldown Split Layout
  {
    id: 'split-master-detail-drilldown',
    name: 'Master-Detail Drilldown Split Layout',
    nameAr: 'تقسيم القائمة الرئيسية والتفاصيل التفاعلية',
    category: 'split-layouts',
    categoryAr: 'التقسيم الذكي والتفاعل اللحظي',
    icon: '📑',
    descriptionAr: 'قالب تقسيم القائمة الرئيسية على اليمين مع لوحة تفاصيل تفاعلية تتحدث فوراً على اليسار',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05); font-family: inherit; direction: rtl; text-align: right;">
  <div style="display: flex; min-height: 220px;">
    <!-- Master List (35%) -->
    <div style="width: 220px; background-color: #f8fafc; border-left: 1px solid #e2e8f0; padding: 12px;">
      <span style="font-size: 11px; font-weight: bold; color: #475569; display: block; margin-bottom: 8px;">عناصر المشروع (Master List):</span>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="padding: 8px 10px; background-color: #ffffff; border: 1.5px solid #3b82f6; border-radius: 8px; box-shadow: 0 2px 6px rgba(59,130,246,0.1); cursor: pointer;">
          <strong style="font-size: 12px; color: #1e3a8a; display: block;">محرك المعالجة المشترك</strong>
          <span style="font-size: 10px; color: #64748b;">Zero-Dependency Core</span>
        </div>
        <div style="padding: 8px 10px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
          <strong style="font-size: 12px; color: #334155; display: block;">استوديو الكود التفاعلي</strong>
          <span style="font-size: 10px; color: #64748b;">WYSIWYG Code Studio</span>
        </div>
        <div style="padding: 8px 10px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
          <strong style="font-size: 12px; color: #334155; display: block;">محرر الصور المتقدم</strong>
          <span style="font-size: 10px; color: #64748b;">Filters & Curves Engine</span>
        </div>
      </div>
    </div>
    <!-- Detail Pane (65%) -->
    <div style="flex: 1; padding: 18px; background-color: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        <strong style="font-size: 14px; color: #0f172a;">تفاصيل العنصر المختار: محرك المعالجة</strong>
        <span style="font-size: 10px; background-color: #ecfdf5; color: #059669; padding: 3px 8px; border-radius: 6px; font-weight: bold;">نشط الآن</span>
      </div>
      <p style="font-size: 12px; color: #475569; line-height: 1.7; margin: 0 0 14px 0;">
        نواة خفيفة فائقة الأداء توفر كافة العمليات الحسابية والهندسية والأرشفة المضغوطة ZIP دون أي مكتبات خارجية.
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px;">
        <div style="background-color: #f8fafc; padding: 8px; border-radius: 6px; font-size: 11px;">
          <span style="color: #64748b;">الذاكرة المستهلكة:</span> <strong>0.4 MB</strong>
        </div>
        <div style="background-color: #f8fafc; padding: 8px; border-radius: 6px; font-size: 11px;">
          <span style="color: #64748b;">التبعيات:</span> <strong>0 Libraries</strong>
        </div>
      </div>
      <button style="background-color: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
        فتح المحرك في نافذة مستقلة ↗
      </button>
    </div>
  </div>
</div>
    `,
  },

  // 22. DataSheet and Interactive Chart Split
  {
    id: 'split-datasheet-chart',
    name: 'DataSheet and Interactive Chart Split',
    nameAr: 'تقسيم جدول البيانات والمخطط البياني الحي',
    category: 'dashboards',
    categoryAr: 'لوحات العمل والمقارنات',
    icon: '📈',
    descriptionAr: 'قالب تقسيم لجدول إحصائي محاسبي مع رسم بياني دائري/شريطي متزامن لحظياً',
    templateHtml: `
<div style="width: 700px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06); font-family: inherit; direction: rtl; text-align: right;">
  <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
    <strong style="color: #0f172a; font-size: 13px;">📊 التحليل الإحصائي وجدول البيانات الحي</strong>
    <span style="font-size: 11px; background-color: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 9999px; font-weight: bold;">تحديث تلقائي</span>
  </div>
  <div style="display: flex; min-height: 180px;">
    <!-- Table Half -->
    <div style="flex: 1; padding: 12px; border-left: 1px solid #e2e8f0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="background-color: #f1f5f9; color: #334155; border-bottom: 1px solid #cbd5e1;">
            <th style="padding: 6px; text-align: right;">الشهر</th>
            <th style="padding: 6px; text-align: right;">المستخدمين</th>
            <th style="padding: 6px; text-align: right;">النمو</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px;">يناير</td>
            <td style="padding: 6px; font-weight: bold;">12,450</td>
            <td style="padding: 6px; color: #16a34a;">+18%</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
            <td style="padding: 6px;">فبراير</td>
            <td style="padding: 6px; font-weight: bold;">18,920</td>
            <td style="padding: 6px; color: #16a34a;">+32%</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px;">مارس</td>
            <td style="padding: 6px; font-weight: bold;">26,300</td>
            <td style="padding: 6px; color: #16a34a;">+45%</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Visual Bar Chart Half -->
    <div style="flex: 1; padding: 14px; display: flex; flex-direction: column; justify-content: center; gap: 8px;">
      <span style="font-size: 11px; font-weight: bold; color: #475569;">توزيع مؤشرات الأداء:</span>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; margin-bottom: 2px;">
          <span>الإنتاجية</span><span>85%</span>
        </div>
        <div style="width: 100%; height: 8px; background-color: #e2e8f0; border-radius: 9999px; overflow: hidden;">
          <div style="width: 85%; height: 100%; background-color: #3b82f6; border-radius: 9999px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; margin-bottom: 2px;">
          <span>سرعة المعالجة</span><span>94%</span>
        </div>
        <div style="width: 100%; height: 8px; background-color: #e2e8f0; border-radius: 9999px; overflow: hidden;">
          <div style="width: 94%; height: 100%; background-color: #10b981; border-radius: 9999px;"></div>
        </div>
      </div>
    </div>
  </div>
</div>
    `,
  },

  // 23. Step Wizard Split Flow
  {
    id: 'split-step-wizard-flow',
    name: 'Step Wizard Split Flow',
    nameAr: 'تقسيم مسار معالج الخطوات التفاعلي',
    category: 'split-layouts',
    categoryAr: 'التقسيم الذكي والتفاعل اللحظي',
    icon: '🪜',
    descriptionAr: 'قالب تقسيم لعرض خطوات العمل المرقمة على اليمين مع لوحة إنجاز المهمة على اليسار',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05); font-family: inherit; direction: rtl; text-align: right;">
  <div style="display: flex; min-height: 200px;">
    <!-- Step Navigator (35%) -->
    <div style="width: 220px; background-color: #f8fafc; border-left: 1px solid #e2e8f0; padding: 14px;">
      <span style="font-size: 11px; font-weight: bold; color: #475569; display: block; margin-bottom: 10px;">خطوات التهيئة:</span>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; color: #16a34a; font-size: 11px; font-weight: bold;">
          <span style="width: 20px; height: 20px; border-radius: 9999px; background-color: #dcfce7; display: flex; align-items: center; justify-content: center; font-size: 10px;">✓</span>
          <span>1. إعداد النواة</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: #2563eb; font-size: 11px; font-weight: bold;">
          <span style="width: 20px; height: 20px; border-radius: 9999px; background-color: #dbeafe; display: flex; align-items: center; justify-content: center; font-size: 10px;">2</span>
          <span>2. تقسيم المناطق</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 11px;">
          <span style="width: 20px; height: 20px; border-radius: 9999px; background-color: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 10px;">3</span>
          <span>3. التصدير والنشر</span>
        </div>
      </div>
    </div>
    <!-- Step Action Stage (65%) -->
    <div style="flex: 1; padding: 18px; background-color: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 6px;">الخطوة 2: تكوين المناطق الذكية</strong>
        <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0 0 12px 0;">
          قم باختيار نمط التقسيم المفضل لديك (50/50، ثلاثي الأعمدة، أو شبكة رباعية) للربط التلقائي.
        </p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button style="background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">السابق</button>
        <button style="background-color: #2563eb; color: #ffffff; border: none; padding: 6px 16px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">متابعة للخطوة التالية ←</button>
      </div>
    </div>
  </div>
</div>
    `,
  },

  // 24. Infographic Stat KPI Grid Split
  {
    id: 'split-infographic-stat-grid',
    name: 'Infographic Stat KPI Grid Split',
    nameAr: 'شبكة بطاقات المؤشرات الإحصائية (KPIs Split)',
    category: 'dashboards',
    categoryAr: 'لوحات العمل والمقارنات',
    icon: '📊',
    descriptionAr: 'قالب تقسيم بطاقات الأداء الرئيسية مع مؤشرات النمو اللحظية والرسوم البيانية المصغرة',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.05); font-family: inherit; direction: rtl; text-align: right;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
    <strong style="font-size: 13px; color: #0f172a;">مؤشرات الأداء اللحظية (Live KPI Stream)</strong>
    <span style="font-size: 10px; background-color: #ecfdf5; color: #059669; padding: 3px 8px; border-radius: 9999px; font-weight: bold;">محدث للتو</span>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
      <span style="font-size: 11px; color: #64748b; display: block; margin-bottom: 4px;">إجمالي المستندات</span>
      <strong style="font-size: 20px; color: #0f172a; display: block; margin-bottom: 4px;">1,420</strong>
      <span style="font-size: 10px; color: #16a34a; font-weight: bold;">↑ +14% هذا الشهر</span>
    </div>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
      <span style="font-size: 11px; color: #64748b; display: block; margin-bottom: 4px;">زمن المعالجة</span>
      <strong style="font-size: 20px; color: #2563eb; display: block; margin-bottom: 4px;">8.2 ms</strong>
      <span style="font-size: 10px; color: #16a34a; font-weight: bold;">⚡ أداء فائق</span>
    </div>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
      <span style="font-size: 11px; color: #64748b; display: block; margin-bottom: 4px;">التوافقية المعمارية</span>
      <strong style="font-size: 20px; color: #059669; display: block; margin-bottom: 4px;">100%</strong>
      <span style="font-size: 10px; color: #64748b;">Zero-Dependencies</span>
    </div>
  </div>
</div>
    `,
  },

  // 25. Interactive Markdown Dual-Pane Split
  {
    id: 'split-markdown-dual-pane',
    name: 'Interactive Markdown Dual-Pane Split',
    nameAr: 'تقسيم الماركدون الدلالي والعرض المنسق',
    category: 'split-layouts',
    categoryAr: 'التقسيم الذكي والتفاعل اللحظي',
    icon: '📝',
    descriptionAr: 'قالب تقسيم متزامن لمحرر الماركدون على اليمين مع العرض التنسيقي المباشر على اليسار',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05); font-family: inherit; direction: rtl; text-align: right;">
  <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
    <strong style="font-size: 12px; color: #1e293b;">✍️ محرر الماركدون المتزامن (Dual-Pane Split)</strong>
    <span style="font-size: 10px; background-color: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px;">تزامن التمرير 100%</span>
  </div>
  <div style="display: flex; min-height: 180px;">
    <!-- Raw Markdown (50%) -->
    <div style="flex: 1; padding: 14px; background-color: #f8fafc; border-left: 1px solid #e2e8f0; font-family: monospace; font-size: 11px; line-height: 1.7; color: #334155; direction: ltr; text-align: left;">
      # Heading 1<br>
      **Pure Light Theme** is enabled.<br>
      - Fast zero-dependency core<br>
      - Full mouse & context menu support
    </div>
    <!-- Styled Render (50%) -->
    <div style="flex: 1; padding: 14px; background-color: #ffffff;">
      <h3 style="font-size: 14px; color: #0f172a; margin: 0 0 6px 0;">Heading 1</h3>
      <p style="font-size: 12px; color: #334155; margin: 0 0 8px 0;">
        <strong>Pure Light Theme</strong> is enabled.
      </p>
      <ul style="margin: 0; padding-right: 18px; font-size: 11px; color: #475569; line-height: 1.6;">
        <li>Fast zero-dependency core</li>
        <li>Full mouse & context menu support</li>
      </ul>
    </div>
  </div>
</div>
    `,
  },
];

