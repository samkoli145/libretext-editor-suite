/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكتبة مكونات وقوالب الويب الجاهزة والأشكال التوضيحية - Component Library
 * 🏛️ الدور: محرك مشترك - 23 نوع عنصر مع LAYOUT_PRESETS وComponentPresets
 * 📥 المستهلك: CanvasDesignerEditor, Toolbar, ContextMenu
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Component Catalog + Preset System: نظام كتالوج مكونات وقوالب مسبقة
 *    لإضافة أي كتلة أو قالب بنقرة واحدة بالفأرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل مكون يجب أن يكون فريداً (id)
 *    2. الافتراضيات يجب أن تتوافق مع الثيم الفاتح
 *    3. الاختبارات في canvas_flow_tools.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المكون قبل الإضافة
 *    - fallback لعنصر نصي
 *    - تنظيف المدخلات
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { HtmlCssExtractor } from './htmlCssExtractor';
import { ComponentRegistry } from '../../shared/engines/ComponentRegistry';
import type { CanvasElement, PageElement, ComponentPreset, LayoutPreset, WebBlock } from './model';
import { ADVANCED_DESIGN_TEMPLATES } from './data/advancedDesignTemplates';

export type ComponentCategory =
  | 'headers'
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'forms'
  | 'callouts'
  | 'connectors'
  | 'interactive'
  | 'cards'
  | 'cms-list'
  | 'faq'
  | 'video'
  | 'badge'
  | 'divider'
  | 'tabs'
  | 'footer'
  | 'stats'
  | 'gallery'
  | 'team'
  | 'table'
  | 'charts'
  | 'split-layouts'
  | 'dashboards'
  | 'basic';

export interface WebTemplateItem {
  id: string;
  name: string;
  nameAr: string;
  category: ComponentCategory;
  categoryAr: string;
  icon: string;
  descriptionAr: string;
  templateHtml: string;
}

export const WEB_COMPONENT_LIBRARY: WebTemplateItem[] = [
  // 1. Headers / Navbar
  {
    id: 'header-clean-light',
    name: 'Clean Light Navbar',
    nameAr: 'شريط تنقل علوي فاتح وحديث',
    category: 'headers',
    categoryAr: 'أشرطة التنقل والترويسة',
    icon: '🧭',
    descriptionAr: 'شريط تنقل رئيسي يحتوي على الشعار، روابط الصفحات، وزر تسجيل الدخول',
    templateHtml: `
<header style="width: 760px; display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
  <div style="font-weight: 800; font-size: 17px; color: #2563eb; display: flex; align-items: center; gap: 8px;">
    ⚡ ستوديو الويب الذكي
  </div>
  <nav style="display: flex; gap: 20px; font-size: 13px; color: #475569; font-weight: 600;">
    <span>الرئيسية</span>
    <span>الميزات</span>
    <span>الحلول</span>
    <span>الأسعار</span>
  </nav>
  <button style="background-color: #2563eb; color: #ffffff; padding: 9px 18px; border-radius: 8px; border: none; font-weight: 700; font-size: 12px; cursor: pointer;">
    ابدأ الآن مجاناً
  </button>
</header>
    `,
  },

  // 2. Hero Section
  {
    id: 'hero-light-gradient',
    name: 'Hero Light Gradient',
    nameAr: 'قسم البطولة والترحيب الفاتح',
    category: 'hero',
    categoryAr: 'أقسام الترحيب (Hero)',
    icon: '🚀',
    descriptionAr: 'عنوان عريض، شارة تميز، نص وصفي وزرين للإجراءات السريعة',
    templateHtml: `
<section style="width: 760px; padding: 40px 32px; background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 1px solid #bfdbfe; border-radius: 16px; text-align: right; box-shadow: 0 4px 16px rgba(37,99,235,0.06);">
  <div style="display: inline-block; padding: 4px 14px; background-color: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; border-radius: 20px; margin-bottom: 12px;">
    ✨ إصدار الجيل القادم من المحرر
  </div>
  <h1 style="font-size: 30px; font-weight: 900; color: #0f172a; margin: 0 0 14px 0; line-height: 1.3;">
    صمم واجهاتك وصدّر الأكواد البرمجية فورياً
  </h1>
  <p style="font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 24px; max-width: 620px;">
    منظومة متكاملة لربط الكانفا الفيكتوري بصفحات الويب وعناصر HTML الحية، مع توليد أكواد React و Tailwind التزامنية.
  </p>
  <div style="display: flex; gap: 12px;">
    <button style="background-color: #2563eb; color: #ffffff; padding: 11px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; border: none; cursor: pointer;">
      ابدأ التصميم الآن
    </button>
    <button style="background-color: #ffffff; color: #334155; padding: 11px 22px; border-radius: 8px; font-weight: 600; font-size: 13px; border: 1px solid #cbd5e1; cursor: pointer;">
      معاينة الأمثلة الحية
    </button>
  </div>
</section>
    `,
  },

  // 3. Features Grid
  {
    id: 'features-3cards-light',
    name: 'Features 3-Card Grid',
    nameAr: 'شبكة الميزات الثلاثية الفاتحة',
    category: 'features',
    categoryAr: 'عرض الميزات والخدمات',
    icon: '💎',
    descriptionAr: 'ثلاث بطاقات بمؤثرات خفيفة وأيقونات مميزة ونصوص موجزة',
    templateHtml: `
<div style="width: 760px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); text-align: right;">
    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px;">⚡</div>
    <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">أداء فائق وسرعة</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.6;">محرك مبني بدون أطر عمل ثقيلة لاستجابة فورية ونقاء كامل.</p>
  </div>
  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); text-align: right;">
    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px;">🛡️</div>
    <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">أمان واستقرار</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.6;">نظام عزل للطبقات ومزامنة محلية دقيقة للبيانات والمستندات.</p>
  </div>
  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); text-align: right;">
    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: #faf5ff; color: #9333ea; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px;">🎨</div>
    <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">توليد أكواد نظيفة</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.6;">تصدير TSX و Tailwind جاهز للاستخدام المباشر في مشروعك.</p>
  </div>
</div>
    `,
  },

  // 4. Pricing Card
  {
    id: 'pricing-card-light-pro',
    name: 'Pricing Card Light Pro',
    nameAr: 'بطاقة أسعار احترافية فاتحة',
    category: 'pricing',
    categoryAr: 'الأسعار والباقات',
    icon: '💳',
    descriptionAr: 'بطاقة خطة احترافية تبرزها شارة مميزة مع زر اشتراك بارز',
    templateHtml: `
<div style="width: 360px; background-color: #ffffff; border: 2px solid #bfdbfe; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); text-align: right;">
  <div style="display: inline-block; padding: 4px 12px; background-color: #dbeafe; color: #1d4ed8; font-size: 10px; font-weight: 800; border-radius: 20px; margin-bottom: 12px;">✨ الأكثر اختياراً</div>
  <div style="font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 6px;">الخطة الاحترافية</div>
  <div style="font-size: 30px; font-weight: 900; color: #0f172a; margin-bottom: 4px;">$29 <span style="font-size: 12px; font-weight: 500; color: #94a3b8;">/ شهرياً</span></div>
  <div style="font-size: 12px; color: #64748b; margin-bottom: 18px;">لمحترفي التصميم والفرق النامية</div>
  <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; font-size: 13px; color: #334155;">
    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #16a34a; font-weight: 900;">✓</span> مشاريع ومساحات عمل غير محدودة</div>
    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #16a34a; font-weight: 900;">✓</span> أدوات تعاون مباشر للفريق</div>
    <div style="display: flex; align-items: center; gap: 8px;"><span style="color: #16a34a; font-weight: 900;">✓</span> تصدير الأكواد والتصاميم بجودة عالية</div>
  </div>
  <button style="width: 100%; background-color: #2563eb; color: #ffffff; padding: 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 13px; cursor: pointer;">ابدأ الآن مجاناً</button>
</div>
    `,
  },

  // 5. Testimonial Card
  {
    id: 'testimonial-card-light',
    name: 'Testimonial Card Light',
    nameAr: 'بطاقة رأي عميل فاتحة',
    category: 'testimonials',
    categoryAr: 'آراء العملاء والشهادات',
    icon: '⭐',
    descriptionAr: 'اقتباس عميل مع تقييم نجوم وصورة رمزية',
    templateHtml: `
<div style="width: 380px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); text-align: right;">
  <div style="display: flex; gap: 3px; color: #f59e0b; font-size: 14px; margin-bottom: 12px;">★★★★★</div>
  <div style="font-size: 13px; color: #475569; line-height: 1.8; margin-bottom: 16px;">"غيّر المحرر طريقة عملنا بالكامل — أصبحنا ننجز تصميمات متكاملة بوقت أقل من النصف، والمخرجات جاهزة للاستخدام مباشرة."</div>
  <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
    <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #dbeafe, #e0e7ff); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #1d4ed8; font-size: 14px;">س</div>
    <div>
      <div style="font-size: 13px; font-weight: 800; color: #0f172a;">سارة أحمد</div>
      <div style="font-size: 11px; color: #94a3b8;">مديرة المنتج — شركة ابتكار</div>
    </div>
  </div>
</div>
    `,
  },

  // 6. Call To Action Banner
  {
    id: 'cta-light-banner',
    name: 'Call To Action Light Banner',
    nameAr: 'شريط الدعوة لاتخاذ إجراء فاتح',
    category: 'cta',
    categoryAr: 'شريط اتخاذ الإجراء',
    icon: '🎯',
    descriptionAr: 'شريط أزرق فاتح يشجع على الاشتراك مع زر بارز',
    templateHtml: `
<div style="width: 760px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 16px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; box-shadow: 0 4px 16px rgba(37,99,235,0.08);">
  <div style="text-align: right;">
    <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 6px;">جاهز لبناء موقعك التالي؟</div>
    <div style="font-size: 13px; color: #475569;">انضم إلى آلاف المصممين الذين يستخدمون المنصة يومياً — بدون بطاقة ائتمان.</div>
  </div>
  <button style="flex-shrink: 0; background-color: #2563eb; color: #ffffff; padding: 12px 26px; border-radius: 10px; border: none; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 2px 8px rgba(37,99,235,0.25);">ابدأ الآن مجاناً</button>
</div>
    `,
  },

  // 7. Contact Form
  {
    id: 'contact-form-light',
    name: 'Contact Form Light',
    nameAr: 'نموذج تواصل فاتح',
    category: 'forms',
    categoryAr: 'نماذج التواصل',
    icon: '📮',
    descriptionAr: 'نموذج تواصل كامل بحقول الاسم والبريد والرسالة وزر إرسال',
    templateHtml: `
<div style="width: 420px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); text-align: right;">
  <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 4px;">تواصل معنا</div>
  <div style="font-size: 12px; color: #64748b; margin-bottom: 18px;">أرسل استفسارك وسنرد عليك خلال 24 ساعة</div>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <div style="font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 5px;">الاسم الكامل</div>
      <input placeholder="أدخل اسمك" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background-color: #f8fafc; outline: none;" />
    </div>
    <div>
      <div style="font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 5px;">البريد الإلكتروني</div>
      <input type="email" placeholder="you@example.com" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background-color: #f8fafc; outline: none;" />
    </div>
    <div>
      <div style="font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 5px;">رسالتك</div>
      <textarea rows="3" placeholder="اكتب رسالتك هنا..." style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background-color: #f8fafc; outline: none; resize: vertical; font-family: inherit;"></textarea>
    </div>
    <button style="width: 100%; background-color: #2563eb; color: #ffffff; padding: 12px; border-radius: 10px; border: none; font-weight: 800; font-size: 13px; cursor: pointer;">إرسال الرسالة</button>
  </div>
</div>
    `,
  },

  // 8. Callout & Alert
  {
    id: 'callout-info-light',
    name: 'Callout Info Banner',
    nameAr: 'صندوق تنبيه وإرشاد فاتح',
    category: 'callouts',
    categoryAr: 'التنبيهات والإرشادات',
    icon: '💡',
    descriptionAr: 'صندوق إرشادي بمعلومات مهمة ورمز تعبيري',
    templateHtml: `
<div style="width: 680px; background-color: #eff6ff; border-right: 4px solid #2563eb; border-radius: 8px; padding: 16px 20px; display: flex; align-items: flex-start; gap: 14px; text-align: right;">
  <span style="font-size: 20px;">💡</span>
  <div>
    <div style="font-size: 14px; font-weight: 800; color: #1e40af; margin-bottom: 4px;">ملاحظة معمارية هامة</div>
    <div style="font-size: 12px; color: #3b82f6; line-height: 1.6;">جميع عمليات معالجة الصور واستخراج الألوان تتم محلياً بالكامل بصفر مكتبات خارجية للحفاظ على أقصى أداء.</div>
  </div>
</div>
    `,
  },

  // 9. Connectors & Steps Roadmap
  {
    id: 'steps-horizontal-light',
    name: 'Horizontal Process Steps',
    nameAr: 'مسار خطوات أفقي متتابع',
    category: 'connectors',
    categoryAr: 'الخطوات والمسارات',
    icon: '🪜',
    descriptionAr: 'ثلاث خطوات متتابعة بأرقام مميزة وخطوط ربط',
    templateHtml: `
<div style="width: 760px; display: flex; align-items: center; justify-content: space-between; padding: 24px 32px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; text-align: center;">
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
    <div style="width: 36px; height: 36px; border-radius: 50%; background-color: #2563eb; color: #ffffff; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 14px;">1</div>
    <div style="font-size: 13px; font-weight: 800; color: #0f172a;">التخطيط</div>
    <div style="font-size: 11px; color: #64748b;">تحديد متطلبات الواجهة</div>
  </div>
  <div style="flex: 1; height: 2px; background-color: #e2e8f0; margin: 0 16px;"></div>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
    <div style="width: 36px; height: 36px; border-radius: 50%; background-color: #dbeafe; color: #1d4ed8; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 14px;">2</div>
    <div style="font-size: 13px; font-weight: 800; color: #0f172a;">التصميم</div>
    <div style="font-size: 11px; color: #64748b;">رسم الكتل وتطبيق الثيم</div>
  </div>
  <div style="flex: 1; height: 2px; background-color: #e2e8f0; margin: 0 16px;"></div>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
    <div style="width: 36px; height: 36px; border-radius: 50%; background-color: #f1f5f9; color: #64748b; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 14px;">3</div>
    <div style="font-size: 13px; font-weight: 800; color: #0f172a;">التصدير</div>
    <div style="font-size: 11px; color: #64748b;">توليد الأكواد النظيفة</div>
  </div>
</div>
    `,
  },

  // 10. Interactive Widget (Live Counter / Status)
  {
    id: 'widget-live-counter',
    name: 'Live Counter Card',
    nameAr: 'بطاقة عداد تفاعلي مباشر',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية',
    icon: '⚡',
    descriptionAr: 'بطاقة تفاعلية مع شارة حالة نشطة وعداد فوري',
    templateHtml: `
<div style="width: 320px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: right; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
    <span style="font-size: 11px; font-weight: 700; color: #16a34a; background-color: #dcfce7; padding: 3px 10px; border-radius: 12px;">● متصل الآن</span>
    <span style="font-size: 13px; font-weight: 800; color: #334155;">حالة المزامنة</span>
  </div>
  <div style="font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 4px;">1,420</div>
  <div style="font-size: 12px; color: #64748b;">عنصر تمت معالجته في الكانفا</div>
</div>
    `,
  },

  // 11. Cards (Profile / Media)
  {
    id: 'card-profile-light',
    name: 'Profile Media Card',
    nameAr: 'بطاقة عضو أو مطور فاتحة',
    category: 'cards',
    categoryAr: 'البطاقات والمحتوى',
    icon: '🗂️',
    descriptionAr: 'بطاقة ملف شخصي تحتوي على صورة رمزية ودور وظيفي وشارات مهارات',
    templateHtml: `
<div style="width: 320px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1d4ed8; font-weight: 900; font-size: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px auto;">م</div>
  <h4 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">محمد الخالد</h4>
  <p style="font-size: 12px; color: #64748b; margin: 0 0 14px 0;">مهندس معمارية النظم والمكتبات</p>
  <div style="display: flex; justify-content: center; gap: 6px;">
    <span style="background-color: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">TypeScript</span>
    <span style="background-color: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">React</span>
    <span style="background-color: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">Tailwind</span>
  </div>
</div>
    `,
  },

  // 12. CMS / Blog List
  {
    id: 'cms-article-card-light',
    name: 'CMS Article Row',
    nameAr: 'صف مقال تدوينة أو محتوى CMS',
    category: 'cms-list',
    categoryAr: 'قوائم المقالات والمحتوى (CMS)',
    icon: '📰',
    descriptionAr: 'بطاقة مقال بنسق أفقي مع تاريخ النشر وشارة الفئة',
    templateHtml: `
<div style="width: 720px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; text-align: right;">
  <div style="flex: 1;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
      <span style="background-color: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">معمارية البرمجيات</span>
      <span style="font-size: 11px; color: #94a3b8;">17 أغسطس 2026</span>
    </div>
    <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">بناء محركات التصميم المعزولة بصفر مكتبات خارجية</h3>
    <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">استعراض تقني لطريقة تقسيم الملفات المتضخمة وتوفير أداء فائق في المتصفح.</p>
  </div>
  <button style="background-color: #f8fafc; border: 1px solid #cbd5e1; color: #334155; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">قراءة المزيد</button>
</div>
    `,
  },

  // 13. FAQ Accordion Item
  {
    id: 'faq-item-light',
    name: 'FAQ Accordion Single',
    nameAr: 'سؤال وجواب شائع فاتح',
    category: 'faq',
    categoryAr: 'الأسئلة الشائعة (FAQ)',
    icon: '❓',
    descriptionAr: 'عنصر سؤال وجواب قابل للتمدد بنقر الفأرة',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 22px; text-align: right;">
  <div style="display: flex; align-items: center; justify-content: space-between; font-weight: 800; font-size: 14px; color: #0f172a;">
    <span>هل يعمل المحرر دون اتصال بالإنترنت؟</span>
    <span style="color: #2563eb; font-size: 16px;">+</span>
  </div>
  <div style="margin-top: 10px; font-size: 12px; color: #64748b; line-height: 1.7; border-top: 1px solid #f1f5f9; padding-top: 10px;">
    نعم، كافة محركات الرسم ومعالجة الصور وقراءة EXIF وتوليد الأكواد مبنية بصفر اعتماديات خارجية وتعمل محلياً 100%.
  </div>
</div>
    `,
  },

  // 14. Video Player Placeholder
  {
    id: 'video-player-frame',
    name: 'Video Player Frame',
    nameAr: 'إطار مشغل فيديو تفاعلي',
    category: 'video',
    categoryAr: 'مشغلات الفيديو والوسائط',
    icon: '🎥',
    descriptionAr: 'حاوية فيديو مع زر تشغيل وتدرج فاتح',
    templateHtml: `
<div style="width: 680px; height: 320px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border: 1px solid #cbd5e1; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
  <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #2563eb; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 14px rgba(37,99,235,0.3); cursor: pointer;">▶</div>
  <span style="margin-top: 14px; font-size: 13px; font-weight: 700; color: #475569;">معاينة الفيديو التعريفي (1080p)</span>
</div>
    `,
  },

  // 15. Badge & Tag Cloud
  {
    id: 'badge-pill-group',
    name: 'Tag & Badge Group',
    nameAr: 'مجموعة شارات وتصنيفات ملونة',
    category: 'badge',
    categoryAr: 'الشارات والتصنيفات',
    icon: '🏷️',
    descriptionAr: 'شارات مخصصة بحالات مختلفة (نجاح، تحذير، معلومة)',
    templateHtml: `
<div style="display: flex; gap: 8px; flex-wrap: wrap; padding: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;">
  <span style="background-color: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">جديد</span>
  <span style="background-color: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">مفعل</span>
  <span style="background-color: #fefce8; color: #ca8a04; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">قيد التطوير</span>
  <span style="background-color: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">v2.5</span>
</div>
    `,
  },

  // 16. Divider & Spacer
  {
    id: 'divider-styled-light',
    name: 'Styled Section Divider',
    nameAr: 'فاصل أقسام أنيق مع علامة نصية',
    category: 'divider',
    categoryAr: 'الفواصل والمساحات',
    icon: '➖',
    descriptionAr: 'فاصل أفقي دقيق مع نص وسطي متزن',
    templateHtml: `
<div style="width: 720px; display: flex; align-items: center; gap: 16px; margin: 16px 0;">
  <div style="flex: 1; height: 1px; background-color: #e2e8f0;"></div>
  <span style="font-size: 12px; font-weight: 700; color: #94a3b8; background-color: #f8fafc; padding: 4px 12px; border-radius: 12px; border: 1px solid #e2e8f0;">أو من خلال</span>
  <div style="flex: 1; height: 1px; background-color: #e2e8f0;"></div>
</div>
    `,
  },

  // 17. Tabs Segmented Control
  {
    id: 'tabs-segmented-light',
    name: 'Segmented Tabs Bar',
    nameAr: 'شريط تبويبات تفاعلي فاتح',
    category: 'tabs',
    categoryAr: 'التبويبات وأزرار التبديل',
    icon: '📑',
    descriptionAr: 'ثلاثة تبويبات لاختيار الوضع المناسب بالماوس',
    templateHtml: `
<div style="display: inline-flex; background-color: #f1f5f9; padding: 4px; border-radius: 10px; border: 1px solid #e2e8f0;">
  <button style="background-color: #ffffff; color: #0f172a; font-weight: 800; font-size: 12px; padding: 8px 18px; border-radius: 8px; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.06); cursor: pointer;">التصميم الحي</button>
  <button style="background: transparent; color: #64748b; font-weight: 600; font-size: 12px; padding: 8px 18px; border: none; cursor: pointer;">المخطط الهيكلي</button>
  <button style="background: transparent; color: #64748b; font-weight: 600; font-size: 12px; padding: 8px 18px; border: none; cursor: pointer;">الشيفرة البرمجية</button>
</div>
    `,
  },

  // 18. Footer
  {
    id: 'footer-multi-col-light',
    name: 'Multi-Column Footer',
    nameAr: 'تذييل صفحة متعدد الأعمدة',
    category: 'footer',
    categoryAr: 'تذييل الصفحات (Footers)',
    icon: '🦶',
    descriptionAr: 'تذييل كامل بروابط الأقسام، الشعار، وحقوق الملكية 2026',
    templateHtml: `
<footer style="width: 760px; background-color: #ffffff; border-top: 1px solid #e2e8f0; padding: 32px 28px 20px 28px; border-radius: 12px; text-align: right;">
  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 32px; margin-bottom: 24px;">
    <div>
      <div style="font-weight: 900; font-size: 16px; color: #2563eb; margin-bottom: 8px;">⚡ ستوديو الويب المتكامل</div>
      <div style="font-size: 12px; color: #64748b; line-height: 1.6;">المنصة المعمارية لتصميم وتطوير واجهات الويب وتصدير الأكواد الفورية.</div>
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #475569;">
      <span style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">الروابط</span>
      <span>المحررات</span>
      <span>المكونات</span>
      <span>الأدوات الموحدة</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #475569;">
      <span style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">الدعم</span>
      <span>التوثيق الشامل</span>
      <span>محولات الصيغ</span>
      <span>الخصوصية</span>
    </div>
  </div>
  <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center;">
    جميع الحقوق محفوظة © 2026 — مصمم بأعلى معايير الجودة والنقاء المعماري
  </div>
</footer>
    `,
  },

  // 19. Stats & Metrics
  {
    id: 'stats-3col-light',
    name: 'Stats & Metrics 3-Col',
    nameAr: 'أرقام وإحصائيات ثلاثية',
    category: 'stats',
    categoryAr: 'الإحصائيات والأرقام',
    icon: '📊',
    descriptionAr: 'ثلاثة أرقام إحصائية بارزة توضح الإنجازات والسرعة',
    templateHtml: `
<div style="width: 760px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; text-align: center;">
  <div>
    <div style="font-size: 28px; font-weight: 900; color: #2563eb; margin-bottom: 4px;">99.9%</div>
    <div style="font-size: 12px; color: #64748b; font-weight: 700;">دقة توليد الأكواد</div>
  </div>
  <div style="border-right: 1px solid #f1f5f9; border-left: 1px solid #f1f5f9;">
    <div style="font-size: 28px; font-weight: 900; color: #16a34a; margin-bottom: 4px;">0 ms</div>
    <div style="font-size: 12px; color: #64748b; font-weight: 700;">تأخير التصدير المحلي</div>
  </div>
  <div>
    <div style="font-size: 28px; font-weight: 900; color: #9333ea; margin-bottom: 4px;">50+</div>
    <div style="font-size: 12px; color: #64748b; font-weight: 700;">صيغة استيراد وتصدير</div>
  </div>
</div>
    `,
  },

  // 20. Gallery & Image Grid
  {
    id: 'gallery-2x2-light',
    name: 'Photo Gallery 2x2 Grid',
    nameAr: 'معرض صور مصغر 2x2',
    category: 'gallery',
    categoryAr: 'معارض الصور والأصول',
    icon: '🖼️',
    descriptionAr: 'شبكة صور متناسقة مع حواف ناعمة وإمكانية استبدال فوري',
    templateHtml: `
<div style="width: 680px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px;">
  <div style="height: 140px; background-color: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #3b82f6;">صورة أصل 1</div>
  <div style="height: 140px; background-color: #f0fdf4; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #16a34a;">صورة أصل 2</div>
  <div style="height: 140px; background-color: #faf5ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #9333ea;">صورة أصل 3</div>
  <div style="height: 140px; background-color: #fff7ed; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #ea580c;">صورة أصل 4</div>
</div>
    `,
  },

  // 21. Team & Author Box
  {
    id: 'team-author-light',
    name: 'Author & Team Box',
    nameAr: 'صندوق كاتب ومطور المحتوى',
    category: 'team',
    categoryAr: 'فريق العمل والكتّاب',
    icon: '👥',
    descriptionAr: 'معلومات الكاتب مع نبذة تعريفية وروابط اجتماعية',
    templateHtml: `
<div style="width: 680px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; text-align: right;">
  <div style="width: 52px; height: 52px; border-radius: 50%; background-color: #dbeafe; color: #1d4ed8; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">ع</div>
  <div>
    <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">عمر بن عبد العزيز</div>
    <div style="font-size: 12px; color: #64748b; line-height: 1.5;">كبير مهندسي البرمجيات — مسؤول عن محركات التصدير ومعالجة الصور النقطية.</div>
  </div>
</div>
    `,
  },

  // 22. Table / Data Grid
  {
    id: 'table-data-light',
    name: 'Data Table 3-Col Light',
    nameAr: 'جدول بيانات ثلاثي الأعمدة فاتح',
    category: 'table',
    categoryAr: 'جداول البيانات (Tables)',
    icon: '📋',
    descriptionAr: 'جدول بيانات منظم بصفوف متبادلة وتنسيق أنيق',
    templateHtml: `
<table style="width: 720px; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; text-align: right; font-size: 13px;">
  <thead>
    <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #334155; font-weight: 800;">
      <th style="padding: 12px 16px;">الميزة</th>
      <th style="padding: 12px 16px;">الحالة</th>
      <th style="padding: 12px 16px;">الاعتماديات</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px 16px; font-weight: 700; color: #0f172a;">معالج الصور EXIF</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 700;">✓ مكتمل</td>
      <td style="padding: 12px 16px; color: #64748b;">صفر مكتبات (Pure TS)</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
      <td style="padding: 12px 16px; font-weight: 700; color: #0f172a;">محول 50+ صيغة</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 700;">✓ مكتمل</td>
      <td style="padding: 12px 16px; color: #64748b;">ZipEngine + ODF</td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; font-weight: 700; color: #0f172a;">مكتبة المكونات الـ 23</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 700;">✓ مدرجة بالكامل</td>
      <td style="padding: 12px 16px; color: #64748b;">قوالب نقية</td>
    </tr>
  </tbody>
</table>
    `,
  },

  // 23. Charts / Metric Card
  {
    id: 'chart-metric-card-light',
    name: 'Chart Metric Visualizer',
    nameAr: 'بطاقة مخطط بياني ومؤشرات',
    category: 'charts',
    categoryAr: 'المخططات والرسوم البيانية',
    icon: '📈',
    descriptionAr: 'بطاقة مؤشرات مع تمثيل أعمدة بيانية فاتحة متزنة',
    templateHtml: `
<div style="width: 360px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; text-align: right; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
  <div style="font-size: 13px; font-weight: 800; color: #64748b; margin-bottom: 4px;">نمو الاستخدام الشهري</div>
  <div style="font-size: 26px; font-weight: 900; color: #0f172a; margin-bottom: 16px;">+148% <span style="font-size: 12px; color: #16a34a; font-weight: 700;">↑ تصاعدي</span></div>
  <div style="display: flex; align-items: flex-end; gap: 10px; height: 80px; padding: 8px 0;">
    <div style="flex: 1; height: 35%; background-color: #dbeafe; border-radius: 4px;"></div>
    <div style="flex: 1; height: 50%; background-color: #bfdbfe; border-radius: 4px;"></div>
    <div style="flex: 1; height: 65%; background-color: #93c5fd; border-radius: 4px;"></div>
    <div style="flex: 1; height: 85%; background-color: #60a5fa; border-radius: 4px;"></div>
    <div style="flex: 1; height: 100%; background-color: #2563eb; border-radius: 4px;"></div>
  </div>
</div>
    `,
  },

  // 24. Controlled Callout Box
  {
    id: 'callout-controlled-card',
    name: 'Controlled Pointer Callout',
    nameAr: 'مربع شرح متحكم فيه مع رأس ومؤشر توجيه',
    category: 'callouts',
    categoryAr: 'التنبيهات والإرشادات',
    icon: '💬',
    descriptionAr: 'مربع شرح تفاعلي مع شارة عنوان، نص توضيحي، ومؤشر توجيه سفلي قابل للتحريك',
    templateHtml: `
<div style="width: 320px; background: #ffffff; border: 2px solid #2563eb; border-radius: 12px; padding: 16px 20px; text-align: right; box-shadow: 0 4px 14px rgba(37,99,235,0.12); position: relative;">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
    <span style="background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px;">💡 ملاحظة شرح</span>
    <span style="font-size: 11px; color: #94a3b8;">تفاعلي WYSIWYG</span>
  </div>
  <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">ملاحظة تحكّم وتوجيه</div>
  <div style="font-size: 12px; color: #475569; line-height: 1.6;">انقر للتحكم في النص ورأس السهم والموقع المباشر بالفأرة.</div>
</div>
    `,
  },

  // 25. Interactive Labeled Connector
  {
    id: 'connector-flow-labeled',
    name: 'Interactive Labeled Connector',
    nameAr: 'موصل تدفق تفاعلي مع بطاقة شرح',
    category: 'connectors',
    categoryAr: 'الخطوات والمسارات',
    icon: '🔗',
    descriptionAr: 'خط ربط مع سهم اتجاهي وبطاقة نصية وسيطة لربط الكتل بالشرح التفاعلي',
    templateHtml: `
<div style="width: 440px; display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: #f8fafc; border: 1px dashed #2563eb; border-radius: 12px;">
  <div style="background: #2563eb; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 800;">عقدة المبدأ</div>
  <div style="flex: 1; height: 2px; background: #2563eb; position: relative; margin: 0 12px;">
    <div style="position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: #ffffff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 10px;">مسار الربط ⚡</div>
  </div>
  <div style="background: #10b981; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 800;">عقدة النتيجة</div>
</div>
    `,
  },

  // 26. Interactive Tooltip Popover
  {
    id: 'interactive-tooltip-popover',
    name: 'Interactive Tooltip Spec',
    nameAr: 'وسم شرح وتلميح تفاعلي Popover',
    category: 'callouts',
    categoryAr: 'التنبيهات والإرشادات',
    icon: '🔍',
    descriptionAr: 'تلميح منبثق توضيحي لعرض التفاصيل الإضافية عند تحريك الفأرة أو النقر',
    templateHtml: `
<div style="width: 260px; background: #0f172a; color: #f8fafc; border-radius: 10px; padding: 12px 16px; text-align: right; box-shadow: 0 4px 12px rgba(15,23,42,0.15);">
  <div style="font-size: 11px; font-weight: 800; color: #60a5fa; margin-bottom: 4px;">معاينة تلميح الشرح ⚡</div>
  <div style="font-size: 12px; line-height: 1.5; color: #e2e8f0;">يُظهر تفاصيل العنصر والأبعاد التفاعلية في الوقت الفعلي.</div>
</div>
    `,
  },

  // 27. Interactive Step Explainer
  {
    id: 'step-explainer-card',
    name: 'Interactive Step Explainer',
    nameAr: 'بطاقة شرح الخطوات التفاعلية',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية',
    icon: '🪜',
    descriptionAr: 'بطاقة شرح خطوة بخطوة مع شريط تقدم تفاعلي وأزرار التنقل',
    templateHtml: `
<div style="width: 380px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; text-align: right; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
    <span style="font-size: 11px; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 3px 10px; border-radius: 12px;">الخطوة 2 من 4</span>
    <div style="display: flex; gap: 4px;"><div style="width: 20px; height: 4px; background: #2563eb; border-radius: 2px;"></div><div style="width: 20px; height: 4px; background: #2563eb; border-radius: 2px;"></div><div style="width: 20px; height: 4px; background: #e2e8f0; border-radius: 2px;"></div></div>
  </div>
  <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">ربط المكونات والموصلات</div>
  <div style="font-size: 12px; color: #64748b; line-height: 1.6; margin-bottom: 14px;">حدد المكونين من اللوحة ثم اسحب سهم الموصل الذكي لإنشاء الرابط التفاعلي.</div>
  <div style="display: flex; gap: 8px;">
    <button style="background: #2563eb; color: #ffffff; border: none; padding: 8px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">التالي ←</button>
    <button style="background: #f1f5f9; color: #475569; border: none; padding: 8px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">← السابق</button>
  </div>
</div>
    `,
  },

  // 28. Math Formula Annotation Callout
  {
    id: 'latex-callout-explainer',
    name: 'LaTeX Math Formula Callout',
    nameAr: 'مربع شرح معادلة رياضية بـ LaTeX',
    category: 'callouts',
    categoryAr: 'التنبيهات والإرشادات',
    icon: '📐',
    descriptionAr: 'بطاقة شرح تجمع بين الرمز الرياضي بـ LaTeX وتفسير الحدود الفيزيائية/الرياضية',
    templateHtml: `
<div style="width: 360px; background: #f8fafc; border: 1px solid #cbd5e1; border-right: 4px solid #7c3aed; border-radius: 12px; padding: 18px; text-align: right;">
  <div style="font-size: 11px; font-weight: 800; color: #7c3aed; margin-bottom: 6px;">شرح صيغة علمية</div>
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center; font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px;">
    E = mc²
  </div>
  <div style="font-size: 12px; color: #475569; line-height: 1.6;">تُعبر E عن الطاقة، m عن الكتلة، وc عن سرعة الضوء في الفراغ.</div>
</div>
    `,
  },

  // 29. Flowchart Decision Node
  {
    id: 'flowchart-decision-node',
    name: 'Flowchart Decision Condition',
    nameAr: 'عنصر اتخاذ قرار شرطي للمخطط',
    category: 'connectors',
    categoryAr: 'الخطوات والمسارات',
    icon: '♦️',
    descriptionAr: 'عنصر قرار ماسي الشكل مع مساري نعم/لا للربط في المخططات الانسيابية',
    templateHtml: `
<div style="width: 240px; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 16px; text-align: center;">
  <div style="font-size: 11px; font-weight: 800; color: #b45309; margin-bottom: 4px;">؟ شرط التحقق</div>
  <div style="font-size: 13px; font-weight: 800; color: #78350f;">هل الشرط محقق؟</div>
  <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 10px; font-weight: 800;">
    <span style="color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 4px;">نعم ✓</span>
    <span style="color: #dc2626; background: #fee2e2; padding: 2px 8px; border-radius: 4px;">لا ✗</span>
  </div>
</div>
    `,
  },

  // 30. Code Snippet Callout
  {
    id: 'code-snippet-callout',
    name: 'Code Snippet Explainer Callout',
    nameAr: 'شرح كود برمجي تفاعلي مع تبويبات',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية',
    icon: '💻',
    descriptionAr: 'بطاقة شرح كود مع أسلوب العرض المباشر وأزرار النسخ والتوضيح',
    templateHtml: `
<div style="width: 420px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: right; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 12px;">
    <span style="font-size: 11px; font-weight: 800; color: #2563eb;">TypeScript / React</span>
    <button style="background: #f1f5f9; border: none; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; color: #475569; cursor: pointer;">📋 نسخ الكود</button>
  </div>
  <pre style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: #0f172a; direction: ltr; text-align: left; margin: 0 0 10px 0;">const engine = new SharedEngine();
engine.render({ interactive: true });</pre>
  <div style="font-size: 11px; color: #64748b;">تُنشئ هذه الشيفرة النواة المشتركة وتفعل التفاعلات الفورية مع الفأرة.</div>
</div>
    `,
  },

  // 31. Smart Sticky Pin
  {
    id: 'smart-sticky-pin',
    name: 'Smart Sticky Note with Pin Target',
    nameAr: 'ملاحظة لاصقة مع دبوس توجيه',
    category: 'callouts',
    categoryAr: 'التنبيهات والإرشادات',
    icon: '📌',
    descriptionAr: 'ملاحظة صفراء فاتحة أنيقة مع دبوس تثبيت ومكان لكتابة التعليقات السريعة',
    templateHtml: `
<div style="width: 220px; background: #fef9c3; border: 1px solid #fde047; border-radius: 10px; padding: 16px; text-align: right; box-shadow: 0 4px 12px rgba(234,179,8,0.12); position: relative;">
  <div style="position: absolute; top: -10px; right: 16px; font-size: 18px;">📌</div>
  <div style="font-size: 12px; font-weight: 800; color: #854d0e; margin-bottom: 4px;">ملاحظة مراجعة</div>
  <div style="font-size: 11px; color: #a16207; line-height: 1.6;">راجع أبعاد الزر ومحاذاة النصوص في الثيم الفاتح قبل التصدير النهائي.</div>
</div>
    `,
  },

  // 32. Comparison Slider Panel
  {
    id: 'comparison-slider-panel',
    name: 'Comparison Side-by-Side Panel',
    nameAr: 'لوحة مقارنة تفاعلية قبل/بعد',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية',
    icon: '⚖️',
    descriptionAr: 'لوحة مقارنة بصرية بين حلين أو حالتين جنبًا إلى جنب مع شارة الفرق',
    templateHtml: `
<div style="width: 480px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; text-align: right;">
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
    <div style="font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 6px;">الحالة الأولى (قبل)</div>
    <div style="font-size: 12px; font-weight: 700; color: #0f172a;">معالجة تقليدية</div>
    <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">بطء وتأخير في التحميل</div>
  </div>
  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px;">
    <div style="font-size: 11px; font-weight: 800; color: #2563eb; margin-bottom: 6px;">الحالة الثانية (بعد) ✨</div>
    <div style="font-size: 12px; font-weight: 700; color: #1e40af;">نواة معيارية مجردة</div>
    <div style="font-size: 11px; color: #3b82f6; margin-top: 4px;">سرعة استجابة لحظية 0ms</div>
  </div>
</div>
    `,
  },

  // 33. Feature Tour Beacon Target
  {
    id: 'feature-beacon-target',
    name: 'Feature Spotlight Beacon Target',
    nameAr: 'نقطة تركيز وتسليط الضوء الشريح',
    category: 'callouts',
    categoryAr: 'التنبيهات والإرشادات',
    icon: '🎯',
    descriptionAr: 'نقطة ينبض منها ضوء أزرق للفت الانتباه وشرح وظيفة محددة في الواجهة',
    templateHtml: `
<div style="width: 280px; display: flex; align-items: center; gap: 12px; background: #ffffff; border: 1px solid #2563eb; border-radius: 30px; padding: 8px 16px; text-align: right; box-shadow: 0 2px 10px rgba(37,99,235,0.15);">
  <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.25); flex-shrink: 0;"></div>
  <div>
    <div style="font-size: 12px; font-weight: 800; color: #0f172a;">ميزة مستحدثة</div>
    <div style="font-size: 10px; color: #64748b;">انقر هنا للوصول إلى أدوات التحكم</div>
  </div>
</div>
    `,
  },

  // 34. Timeline Milestone Node
  {
    id: 'timeline-milestone-node',
    name: 'Timeline Milestone Node',
    nameAr: 'عقدة جدول زمني للمراحل والخطوات',
    category: 'connectors',
    categoryAr: 'الخطوات والمسارات',
    icon: '📅',
    descriptionAr: 'عقدة زامنية مع تاريخ وشارة حالة وأسهم ربط المخططات الزمنية',
    templateHtml: `
<div style="width: 320px; background: #ffffff; border: 1px solid #e2e8f0; border-right: 4px solid #10b981; border-radius: 12px; padding: 16px; text-align: right;">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
    <span style="font-size: 10px; font-weight: 800; color: #10b981; background: #dcfce7; padding: 2px 8px; border-radius: 10px;">المرحلة 1: مكتملة</span>
    <span style="font-size: 11px; color: #94a3b8;">الربع الأول 2026</span>
  </div>
  <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">تأسيس النواة المشتركة</div>
  <div style="font-size: 11px; color: #64748b; line-height: 1.5;">عزل محركات الرسم والتأكد من دعم الفأرة والزر الأيمن بالكامل.</div>
</div>
    `,
  },

  // 35. Feedback & Rating Callout
  {
    id: 'feedback-rating-callout',
    name: 'Feedback & Rating Explainer',
    nameAr: 'مربع تقييم وملاحظات التفاعل',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية',
    icon: '⭐',
    descriptionAr: 'مربع حواري صغير مع أزرار النجوم وإبداء الملاحظات السريعة',
    templateHtml: `
<div style="width: 300px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
  <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">ما رأيك في تجربة التحرير؟</div>
  <div style="font-size: 18px; color: #f59e0b; margin-bottom: 12px;">★ ★ ★ ★ ★</div>
  <div style="display: flex; gap: 8px; justify-content: center;">
    <button style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">ممتازة جداً</button>
    <button style="background: #f1f5f9; color: #475569; border: none; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">إضافة اقتراح</button>
  </div>
</div>
    `,
  },

  // 36. WYSIWYG Floating Action Bar Spec
  {
    id: 'wysiwyg-floating-toolbar',
    name: 'Floating Action Bar Spec',
    nameAr: 'شريط أدوات عائم تفاعلي WYSIWYG',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية',
    icon: '🛠️',
    descriptionAr: 'شريط أدوات عائم يظهر فوق العنصر المحدد للتنسيق والحذف والتكرار',
    templateHtml: `
<div style="width: 280px; display: flex; align-items: center; justify-content: space-around; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 30px; padding: 8px 14px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); text-align: center;">
  <button style="background: transparent; border: none; color: #0f172a; font-weight: 800; font-size: 12px; cursor: pointer;"><b>B</b></button>
  <button style="background: transparent; border: none; color: #0f172a; font-style: italic; font-size: 12px; cursor: pointer;"><i>I</i></button>
  <button style="background: transparent; border: none; color: #2563eb; font-size: 12px; cursor: pointer;">🎨 لون</button>
  <div style="width: 1px; height: 16px; background: #e2e8f0;"></div>
  <button style="background: transparent; border: none; color: #ef4444; font-size: 12px; cursor: pointer;">🗑️ حذف</button>
</div>
    `,
  },

  // 37. Interactive Modal & Drawer Spec Blueprint
  {
    id: 'modal-drawer-blueprint',
    name: 'Interactive Modal Spec Blueprint',
    nameAr: 'شاشة نموذجية للنافذة العائمة والدرج',
    category: 'interactive',
    categoryAr: 'العناصر التفاعلية',
    icon: '🔳',
    descriptionAr: 'مخطط هرمي للنافذة الحوارية مع الترويسة وجسم المحتوى وأزرار التأكيد',
    templateHtml: `
<div style="width: 380px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; text-align: right; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 14px;">
    <div style="font-size: 14px; font-weight: 800; color: #0f172a;">نافذة تأكيد الإجراء ⚡</div>
    <span style="font-size: 14px; color: #94a3b8; cursor: pointer;">✕</span>
  </div>
  <div style="font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 18px;">هل أنت تأكد من تطبيق هذه الإعدادات المعمارية على كافة واجهات المحرر؟</div>
  <div style="display: flex; justify-content: flex-end; gap: 10px;">
    <button style="background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">إلغاء</button>
    <button style="background: #2563eb; color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">تأكيد وتطبيق</button>
  </div>
</div>
    `,
  },

  // 38. Interactive Status Badge Node
  {
    id: 'status-badge-node',
    name: 'System Diagnostic Status Badge',
    nameAr: 'شارة حالة وتشخيص تفاعلية',
    category: 'badge',
    categoryAr: 'الشارات والتصنيفات',
    icon: '🩺',
    descriptionAr: 'شارة عرض حالة النظام والفحوصات مع إمكانية التحديث التلقائي',
    templateHtml: `
<div style="width: 260px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; text-align: right; display: flex; align-items: center; justify-content: space-between;">
  <div>
    <div style="font-size: 11px; font-weight: 800; color: #166534;">تشخيص النظام</div>
    <div style="font-size: 10px; color: #15803d;">كل المحركات تعمل بنجاح 100%</div>
  </div>
  <span style="background: #22c55e; color: #ffffff; font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 12px;">سليم ✓</span>
</div>
    `,
  },
];

// Presets for single click insertion (covering all major categories)
export const componentPresets: ComponentPreset[] = [
  {
    id: 'preset-callout-controlled',
    name: 'Controlled Callout Box',
    nameAr: 'مربع شرح متحكم فيه',
    category: 'callouts',
    descriptionAr: 'مربع شرح تفاعلي مع شارة ومؤشر اتجاهي قابل للتحريك',
    icon: 'MessageSquare',
    element: {
      id: 'flow-callout-' + Date.now(),
      type: 'card',
      content: 'ملاحظة تحكّم وتوجيه',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        borderWidth: '2px',
        borderColor: '#2563eb',
        padding: '16px 20px',
      },
    },
  },
  {
    id: 'preset-connector-flow',
    name: 'Labeled Flow Connector',
    nameAr: 'موصل تدفق مع شارة نصية',
    category: 'connectors',
    descriptionAr: 'خط ربط تفاعلي بين العقد مع شارة توضيحية',
    icon: 'GitBranch',
    element: {
      id: 'flow-conn-' + Date.now(),
      type: 'card',
      content: 'موصل تدفق تفاعلي',
      styles: {
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        borderWidth: '1px',
        borderColor: '#2563eb',
        padding: '12px',
      },
    },
  },
  {
    id: 'preset-step-explainer',
    name: 'Interactive Step Explainer',
    nameAr: 'بطاقة شرح الخطوات',
    category: 'interactive',
    descriptionAr: 'بطاقة شرح خطوة بخطوة مع تقدم تفاعلي',
    icon: 'HelpCircle',
    element: {
      id: 'flow-step-' + Date.now(),
      type: 'card',
      content: 'بطاقة شرح الخطوات التفاعلية',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '20px',
      },
    },
  },
  {
    id: 'preset-latex-callout',
    name: 'LaTeX Math Callout',
    nameAr: 'شرح معادلة رياضية',
    category: 'callouts',
    descriptionAr: 'شرح صيغة علمية بـ LaTeX وتفسير الحدود',
    icon: 'Code2',
    element: {
      id: 'flow-latex-' + Date.now(),
      type: 'card',
      content: 'E = mc²',
      styles: {
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        borderWidth: '1px',
        borderColor: '#7c3aed',
        padding: '18px',
      },
    },
  },
  {
    id: 'preset-sticky-pin',
    name: 'Smart Sticky Note',
    nameAr: 'ملاحظة لاصقة مع دبوس',
    category: 'callouts',
    descriptionAr: 'ملاحظة مراجعة صفراء أنيقة مع دبوس توجيه',
    icon: 'StickyNote',
    element: {
      id: 'flow-sticky-' + Date.now(),
      type: 'card',
      content: 'ملاحظة مراجعة سريعة',
      styles: {
        backgroundColor: '#fef9c3',
        borderRadius: '10px',
        borderWidth: '1px',
        borderColor: '#fde047',
        padding: '16px',
      },
    },
  },
  {
    id: 'preset-hero',
    name: 'Hero Section',
    nameAr: 'قسم ترويسة وترحيب (Hero)',
    category: 'hero',
    descriptionAr: 'عنوان رئيسي مع وصف وأزرار إجرائية',
    icon: 'Sparkles',
    element: {
      id: 'flow-hero-' + Date.now(),
      type: 'hero',
      content: 'صمم واجهاتك وصدّر الأكواد البرمجية فورياً',
      styles: {
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: '#bfdbfe',
        padding: '32px',
      },
    },
  },
  {
    id: 'preset-navbar',
    name: 'Navbar',
    nameAr: 'شريط تنقل وترويسة (Navbar)',
    category: 'navbar',
    descriptionAr: 'شريط ملاحة كامل مع شعار وروابط وزر تسجيل',
    icon: 'Navigation',
    element: {
      id: 'flow-nav-' + Date.now(),
      type: 'navbar',
      content: 'ستوديو الويب الذكي',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '16px 24px',
      },
    },
  },
  {
    id: 'preset-features',
    name: 'Features Grid',
    nameAr: 'شبكة ميزات (Features)',
    category: 'features',
    descriptionAr: 'شبكة بطاقات ميزات ثلاثية بتصميم فاتح أنيق',
    icon: 'Layers',
    element: {
      id: 'flow-feat-' + Date.now(),
      type: 'features',
      content: 'ميزات المنصة الذكية',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '24px',
      },
    },
  },
  {
    id: 'preset-pricing',
    name: 'Pricing Table',
    nameAr: 'جدول باقات وأسعار (Pricing)',
    category: 'pricing',
    descriptionAr: 'بطاقتي اشتراك مجاني واحترافي',
    icon: 'CreditCard',
    element: {
      id: 'flow-price-' + Date.now(),
      type: 'pricing',
      content: 'باقات الاشتراك والأسعار',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '24px',
      },
    },
  },
  {
    id: 'preset-faq',
    name: 'FAQ Accordion',
    nameAr: 'الأسئلة الشائعة (FAQ)',
    category: 'faq',
    descriptionAr: 'قوائم أكورديون تفاعلية مع إجابات قابلة للفتح والغلق',
    icon: 'HelpCircle',
    element: {
      id: 'flow-faq-' + Date.now(),
      type: 'faq',
      content: 'الأسئلة الشائعة',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '24px',
      },
    },
  },
  {
    id: 'preset-stats',
    name: 'Stats Grid',
    nameAr: 'شبكة مؤشرات وإحصائيات',
    category: 'basic',
    descriptionAr: 'بطاقات إحصاءات ثلاثية بالألوان الفاتحة',
    icon: 'BarChart2',
    element: {
      id: 'flow-stats-' + Date.now(),
      type: 'card',
      content: 'مؤشرات الأداء والإنجاز',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '20px',
      },
    },
  },
  {
    id: 'preset-testimonials',
    name: 'Testimonial Card',
    nameAr: 'بطاقة شهادة عميل',
    category: 'basic',
    descriptionAr: 'اقتباس رأي عميل مع نجوم تقييم وصورة رمزية',
    icon: 'MessageSquare',
    element: {
      id: 'flow-testi-' + Date.now(),
      type: 'card',
      content: 'آراء وتقييمات العملاء',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '20px',
      },
    },
  },
  {
    id: 'preset-cta',
    name: 'Call to Action Banner',
    nameAr: 'شريط دعوة لاتخاذ إجراء (CTA)',
    category: 'basic',
    descriptionAr: 'شريط ترويجي مع زر اتخاذ إجراء بارز',
    icon: 'Zap',
    element: {
      id: 'flow-cta-' + Date.now(),
      type: 'card',
      content: 'جاهز للانطلاق والتصميم؟',
      styles: {
        backgroundColor: '#eff6ff',
        borderRadius: '14px',
        borderWidth: '1px',
        borderColor: '#bfdbfe',
        padding: '24px',
      },
    },
  },
  // Site Pages & Navigation Model Presets
  {
    id: 'preset-page-tree',
    name: 'Site Page Tree',
    nameAr: 'شجرة صفحات الموقع النموذجية',
    category: 'basic',
    descriptionAr: 'هيكل شجري لصفحات الموقع والتنقل الداخلي بنقرة واحدة',
    icon: 'FolderTree',
    element: {
      id: 'flow-page-tree-' + Date.now(),
      type: 'card',
      content: 'شجرة صفحات الموقع النموذجية',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '20px',
      },
    },
  },
  {
    id: 'preset-navbar-tree',
    name: 'Multi-Page Navbar',
    nameAr: 'شريط تنقل الصفحات المتعدد',
    category: 'navbar',
    descriptionAr: 'ترويسة الموقع مع الروابط المتصلة بشجرة الصفحات',
    icon: 'Navigation',
    element: {
      id: 'flow-navbar-tree-' + Date.now(),
      type: 'navbar',
      content: 'منصة الويب المتكاملة',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '16px',
      },
    },
  },
  // Presentation Slide Model Presets
  {
    id: 'preset-slide-hero',
    name: 'Hero Slide',
    nameAr: 'شريحة عنوان وغلاف العرض',
    category: 'hero',
    descriptionAr: 'شريحة غلاف رئيسية متكاملة مع الرأس والذيل والترقيم',
    icon: 'Tv',
    element: {
      id: 'flow-slide-hero-' + Date.now(),
      type: 'card',
      content: 'مقدمة المشروع والابتكار التقني',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '32px',
        minHeight: '380px',
      },
    },
  },
  {
    id: 'preset-slide-two-col',
    name: 'Two Column Comparison Slide',
    nameAr: 'شريحة مقارنة ثنائية للأفكار',
    category: 'features',
    descriptionAr: 'شريحة عرض لمقارنة المفاهيم جنبًا إلى جنب بتنسيق فاتح متزن',
    icon: 'Layers',
    element: {
      id: 'flow-slide-two-col-' + Date.now(),
      type: 'card',
      content: 'المقارنة التقنية والتحليل',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        padding: '32px',
        minHeight: '380px',
      },
    },
  },
];

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'layout-landing-page',
    name: 'Complete Landing Page',
    nameAr: 'صفحة هبوط متكاملة فاتحة',
    category: 'landing',
    descriptionAr: 'هيكل كامل يضم نافبار وهيرو وشبكة ميزات وأسعار وتذييل',
    template: {
      id: 'tpl-landing',
      type: 'section',
      styles: { display: 'flex', flexDirection: 'column', gap: '24px' },
      children: [
        { id: 't-nav', type: 'navbar', content: 'ستوديو الويب' },
        { id: 't-hero', type: 'hero', content: 'صمم بسرعة وثقة' },
        { id: 't-feat', type: 'features', content: 'أهم الميزات' },
        { id: 't-price', type: 'pricing', content: 'الخطط والأسعار' },
        { id: 't-foot', type: 'footer', content: 'جميع الحقوق محفوظة' },
      ],
    },
  },
  {
    id: 'layout-site-structure',
    name: 'Multi-Page Site Layout',
    nameAr: 'هيكل موقع متعدد الصفحات وشجرة التنقل',
    category: 'landing',
    descriptionAr: 'قالب موقع نموذجي بشريط تنقل ومسار تدرجي ومحتوى وتذييل',
    template: {
      id: 'tpl-multi-page',
      type: 'section',
      styles: { display: 'flex', flexDirection: 'column', gap: '20px' },
      children: [
        { id: 't-p-nav', type: 'navbar', content: 'منصة الويب النموذجية' },
        { id: 't-p-hero', type: 'hero', content: 'أهلاً بكم في المنصة الشاملة' },
        { id: 't-p-feat', type: 'features', content: 'صفحات وأقسام الموقع' },
        { id: 't-p-foot', type: 'footer', content: 'جميع الحقوق محفوظة © 2026' },
      ],
    },
  },
  {
    id: 'layout-presentation-deck',
    name: 'Presentation Deck 5-Slides',
    nameAr: 'طقم عرض تقديمي نموذجي 5 شرائح',
    category: 'landing',
    descriptionAr: 'طقم شرائح متكامل (غلاف، محتوى، مقارنة، شفرة برمجية، معادلات)',
    template: {
      id: 'tpl-slides-deck',
      type: 'section',
      styles: { display: 'flex', flexDirection: 'column', gap: '32px' },
      children: [
        { id: 't-s-1', type: 'card', content: 'الشريحة 1: الغلاف والعنوان الرئيسي' },
        { id: 't-s-2', type: 'card', content: 'الشريحة 2: المحتوى والأهداف' },
        { id: 't-s-3', type: 'card', content: 'الشريحة 3: التحليل المقارن' },
        { id: 't-s-4', type: 'card', content: 'الشريحة 4: الشيفرة البرمجية والتنفيذ' },
        { id: 't-s-5', type: 'card', content: 'الشريحة 5: النماذج والملخص' },
      ],
    },
  },
];

export function getAllWebComponents(): WebTemplateItem[] {
  const registryItems: WebTemplateItem[] = ComponentRegistry.getInstance()
    .getAll()
    .map((c) => ({
      id: c.id,
      name: c.name,
      nameAr: c.nameAr,
      category: c.category as ComponentCategory,
      categoryAr: c.categoryAr,
      icon: c.icon,
      descriptionAr: c.descriptionAr,
      templateHtml: c.templateHtml,
    }));

  const map = new Map<string, WebTemplateItem>();
  for (const item of ADVANCED_DESIGN_TEMPLATES) {
    map.set(item.id, item);
  }
  for (const item of WEB_COMPONENT_LIBRARY) {
    map.set(item.id, item);
  }
  for (const item of registryItems) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

export function instantiateTemplate(
  templateOrId: WebTemplateItem | string,
  x = 100,
  y = 100,
  layerId = 'layer-main',
  stageWidth = 1200,
): CanvasElement[] {
  let item: WebTemplateItem | undefined;
  if (typeof templateOrId === 'string') {
    const all = getAllWebComponents();
    item = all.find((t) => t.id === templateOrId);
  } else {
    item = templateOrId;
  }

  if (!item) return [];

  const extracted = HtmlCssExtractor.extractFromHtml(item.templateHtml, x, y, layerId, stageWidth);
  if (extracted.elements && extracted.elements.length > 0) {
    return extracted.elements;
  }

  const maxW = Math.max(280, stageWidth - 32);
  const cardW = Math.min(760, maxW);
  const cardH = Math.round(300 * (cardW / 760));
  const finalX = Math.max(16, Math.round((stageWidth - cardW) / 2));

  return [
    {
      id: `el-tpl-${Date.now()}`,
      type: 'html-card',
      x: finalX,
      y,
      width: cardW,
      height: cardH,
      zIndex: 1,
      layerId,
      fillColor: '#ffffff',
      strokeColor: '#e2e8f0',
      strokeWidth: 1,
      borderRadius: 12,
      htmlContent: item.templateHtml,
      text: item.nameAr,
    },
  ];
}
