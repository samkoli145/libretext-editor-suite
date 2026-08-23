/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكون عارض الكتل وعناصر الويب التدفقية والأشكال والواجهات - Element Renderer
 * 🏛️ الدور: مكون رئيسي - تمثيل بصري لـ 23 نوع عنصر واجهة
 * 📥 المستهلك: CanvasDesignerEditor, CanvasViewport
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    23-Type Visual Renderer: مصور بصرى لأنواع العناصر
 *    مع تحرير مباشر بالنقر المزدوج وحماية أحداث الماوس أثناء التحرير
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. stopPropagation يجب استدعاؤه أثناء التحرير المباشر
 *    2. اختبارات في canvas_flow_tools.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص نوع العنصر قبل التصيير
 *    - fallback لعنصر نصي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Layers,
  Zap,
  Globe,
  Shield,
  Gauge,
  Code2,
  Database,
  Smartphone,
  Star,
  Send,
  HelpCircle,
  Menu,
  X,
  Copy,
  Check,
  Info,
  AlertTriangle,
  FileText,
  MapPin,
  ExternalLink,
  Sliders,
  Play,
  CreditCard,
  Quote,
  Layout,
  ListFilter,
  CheckSquare,
  Video as VideoIcon,
  Minus,
  Heart,
  Users,
  Activity,
  Bell,
  Home,
  Search,
  Settings,
  TrendingUp,
  MessageCircle,
  Calendar,
  Target,
  BarChart3,
  Eye,
  ShoppingBag,
  UploadCloud,
  PenTool,
  BookOpen,
} from 'lucide-react';
import type { CanvasElement } from '../model';
import { createPolygonPath, createStarPath, createArrowPath } from '../core/svgPathUtils';
import { CLIP_PRESETS } from '../core/svgClipping';
import { SVG_ANIMATION_PRESETS } from '../core/svgAnimation';
import { generateConnectorSVGPath } from '../connectorUtils';
import { SmartComponentEngine } from '../../../shared/engines/SmartComponentEngine';
import { sanitizeHtml } from '../../../core/engines/HtmlPipelineEngine';
import { latexEngine } from '../../../shared/engines/LaTeXEngine';
import { CanvasLinkedChartComponent } from './CanvasLinkedChartComponent';
import { bezierNodesToSvgPath } from '../../../shared/lib-core/geometry/bezier-curves';

// خريطة أسماء الأيقونات المعروفة (تُستخدم في أنواع icon / kpi-card / avatar)
const LUCIDE_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  users: Users,
  activity: Activity,
  bell: Bell,
  home: Home,
  search: Search,
  settings: Settings,
  trending: TrendingUp,
  message: MessageCircle,
  calendar: Calendar,
  target: Target,
  chart: BarChart3,
  eye: Eye,
  cart: ShoppingBag,
  upload: UploadCloud,
  pen: PenTool,
  book: BookOpen,
  globe: Globe,
  shield: Shield,
  gauge: Gauge,
  code: Code2,
  database: Database,
  phone: Smartphone,
  send: Send,
  help: HelpCircle,
  menu: Menu,
  info: Info,
  alert: AlertTriangle,
  file: FileText,
  pin: MapPin,
  link: ExternalLink,
  play: Play,
  card: CreditCard,
  quote: Quote,
  layout: Layout,
  filter: ListFilter,
  check: Check,
};

// توليد نقاط مضلع منتظم (Regular Polygon) لرسم السداسي والثماني والخماسي
function createRegularPolygonPoints(
  sides: number,
  w: number,
  h: number,
): { x: number; y: number }[] {
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return points;
}

// توليد مسار درع بخمس رؤوس
function createShieldPath(w: number, h: number): string {
  const pts = [
    { x: w / 2, y: 0 },
    { x: w, y: h * 0.25 },
    { x: w, y: h * 0.6 },
    { x: w / 2, y: h },
    { x: 0, y: h * 0.6 },
    { x: 0, y: h * 0.25 },
  ];
  return createPolygonPath(pts);
}

export interface ElementRendererProps {
  element: CanvasElement;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdateContent?: (newText: string) => void;
  isInteractive?: boolean;
  isRtl?: boolean;
  onTriggerAction?: (action: string, target?: string) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected = false,
  onSelect,
  onUpdateContent,
  isInteractive = true,
  isRtl = true,
  onTriggerAction,
}) => {
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard?.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleInlineBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsEditingInline(false);
    const newText = e.currentTarget.innerText.trim();
    if (newText && onUpdateContent) {
      onUpdateContent(newText);
    }
  };

  const handleEditableMouseDown = (e: React.MouseEvent) => {
    if (isEditingInline) {
      e.stopPropagation();
    }
  };

  // Render by element type and specialized UI blocks (23 flow element types + vector shapes)
  const renderContent = () => {
    switch (element.type) {
      // 1. Navbar
      case 'navbar':
        return (
          <header className="w-full h-full flex items-center justify-between px-6 bg-white border border-slate-200 rounded-xl shadow-xs text-xs select-none">
            <div className="flex items-center gap-2 font-bold text-blue-600">
              <Sparkles className="w-4 h-4" />
              <span
                contentEditable={isEditingInline}
                suppressContentEditableWarning
                onMouseDown={handleEditableMouseDown}
                onBlur={handleInlineBlur}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingInline(true);
                }}
              >
                {element.text || 'شعار الموقع الفاتح'}
              </span>
            </div>
            <nav className="hidden sm:flex items-center gap-5 text-slate-600 font-medium">
              <span className="hover:text-blue-600 cursor-pointer">الرئيسية</span>
              <span className="hover:text-blue-600 cursor-pointer">الميزات</span>
              <span className="hover:text-blue-600 cursor-pointer">الأسعار</span>
              <span className="hover:text-blue-600 cursor-pointer">الأسئلة الشائعة</span>
            </nav>
            <button
              type="button"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition cursor-pointer"
            >
              ابدأ الآن
            </button>
          </header>
        );

      // 2. Hero Header
      case 'hero':
        return (
          <section className="w-full h-full p-8 bg-linear-to-br from-slate-50 to-blue-50/40 border border-blue-100 rounded-2xl flex flex-col justify-center text-right shadow-xs select-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/70 border border-blue-200 text-blue-700 text-[11px] font-bold rounded-full w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>إصدار الجيل القادم النقي</span>
            </div>
            <h1
              className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2"
              contentEditable={isEditingInline}
              suppressContentEditableWarning
              onMouseDown={handleEditableMouseDown}
              onBlur={handleInlineBlur}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingInline(true);
              }}
            >
              {element.text || 'صمم واجهاتك وصدّر الأكواد البرمجية فورياً'}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 max-w-xl">
              {element.subtitle ||
                'منظومة متكاملة لربط الكانفا الفيكتوري بصفحات الويب وعناصر HTML الحية.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                ابدأ التصميم مجاناً
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium rounded-lg transition cursor-pointer"
              >
                معاينة النماذج الحية
              </button>
            </div>
          </section>
        );

      // 3. Features Bento Grid
      case 'features':
        return (
          <section className="w-full h-full p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-xs select-none">
            <div className="flex items-center justify-between mb-3">
              <h2
                className="text-sm font-bold text-slate-900"
                contentEditable={isEditingInline}
                suppressContentEditableWarning
                onMouseDown={handleEditableMouseDown}
                onBlur={handleInlineBlur}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingInline(true);
                }}
              >
                {element.text || 'ميزات المنصة الذكية'}
              </h2>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                شبكة بينتو
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Zap className="w-5 h-5 text-blue-600 mb-1.5" />
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">سرعة فائقة</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  توليد أكواد React و Tailwind فورياً.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Layers className="w-5 h-5 text-emerald-600 mb-1.5" />
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">طبقات لا نهائية</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  تحكم دقيق بالترتيب والعمق والتجميع.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Code2 className="w-5 h-5 text-indigo-600 mb-1.5" />
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">صفر مكتبات</h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  محركات أصلية خفيفة وعالية الكفاءة.
                </p>
              </div>
            </div>
          </section>
        );

      // 4. Pricing Cards
      case 'pricing':
        return (
          <section className="w-full h-full p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-xs select-none">
            <div className="text-center mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                {element.text || 'باقات الاشتراك والأسعار'}
              </h2>
              <p className="text-[11px] text-slate-500">اختر الخطة المناسبة لاحتياجات فريقك</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">الخطة الأساسية</h3>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    مجاناً <span className="text-[10px] font-normal text-slate-500">/ للأبد</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 mt-2 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> تصاميم غير محدودة
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> تصدير HTML/TSX
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg"
                >
                  اختيار الخطة
                </button>
              </div>
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-blue-900">الخطة الاحترافية</h3>
                    <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">
                      شائع
                    </span>
                  </div>
                  <div className="text-lg font-black text-blue-900 mt-1">
                    29$ <span className="text-[10px] font-normal text-slate-500">/ شهرياً</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 mt-2 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> جميع الميزات المتقدمة
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> دعم مباشر 24/7
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  ترقية الحساب
                </button>
              </div>
            </div>
          </section>
        );

      // 5. Testimonials
      case 'testimonials':
        return (
          <section className="w-full h-full p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-xs select-none">
            <div className="flex items-center gap-2 mb-2">
              <Quote className="w-5 h-5 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900">
                {element.text || 'آراء وتجارب المستخدمين'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
              "
              {element.subtitle ||
                'أحدثت هذه المنصة نقلة نوعية في سرعة بناء الواجهات التفاعلية وتصدير الأكواد النظيفة.'}
              "
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span className="font-bold text-slate-800">
                م. عبد الرحمن الأحمد — مطور واجهات رئيسي
              </span>
              <div className="flex text-amber-500">★★★★★</div>
            </div>
          </section>
        );

      // 6. FAQ Accordion
      case 'faq':
        return (
          <section className="w-full h-full p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-xs select-none">
            <h2 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>{element.text || 'الأسئلة الشائعة'}</span>
            </h2>
            <div className="space-y-2">
              {[
                {
                  q: 'هل يعمل المحرر بدون أي اتصال بالإنترنت؟',
                  a: 'نعم، المحرك أصلي ومستقل تماماً ويدعم العمل المحلي الكامل.',
                },
                {
                  q: 'كيف يتم تصدير الأكواد الناتجة؟',
                  a: 'يمكنك تصدير كود React/TSX أو HTML/CSS نقي بنقرة واحدة بالفأرة.',
                },
              ].map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                    className="w-full p-2.5 bg-slate-50 flex items-center justify-between text-right text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${faqOpenIndex === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {faqOpenIndex === idx && (
                    <div className="p-2.5 bg-white text-[11px] text-slate-600 leading-relaxed border-t border-slate-100">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      // 7. Call To Action (CTA)
      case 'cta':
        return (
          <section className="w-full h-full p-6 bg-linear-to-r from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl flex items-center justify-between shadow-xs select-none">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {element.text || 'جاهز للبدء في تصميم مشروعك القادم؟'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {element.subtitle || 'انضم إلى آلاف المطورين والمصممين اليوم مجاناً.'}
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer shrink-0"
            >
              ابدأ الآن مجاناً
            </button>
          </section>
        );

      // 8. Footer
      case 'footer':
        return (
          <footer className="w-full h-full p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-500 shadow-xs select-none">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{element.text || 'ستوديو الويب الذكي'}</span>
            </div>
            <div className="flex gap-4">
              <span className="hover:text-blue-600 cursor-pointer">سياسة الخصوصية</span>
              <span className="hover:text-blue-600 cursor-pointer">الشروط والأحكام</span>
              <span className="hover:text-blue-600 cursor-pointer">تواصل معنا</span>
            </div>
            <div>© {new Date().getFullYear()} جميع الحقوق محفوظة.</div>
          </footer>
        );

      // 9. CMS List Repeater
      case 'cms-list':
        return (
          <div className="w-full h-full p-4 bg-white border border-slate-200 rounded-2xl shadow-xs select-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ListFilter className="w-4 h-4 text-blue-600" />
                <span>{element.text || 'قائمة عناصر CMS المتكررة'}</span>
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                تكرار ديناميكي
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {i}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">مقال توضيحي #{i}</h4>
                    <p className="text-[10px] text-slate-500">تم جلب السجل من قاعدة البيانات.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 10. Form Container
      case 'form':
        return (
          <form
            className="w-full h-full p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between select-none"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <span>{element.text || 'نموذج التواصل السريع'}</span>
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="الاسم الكامل..."
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني..."
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:bg-white"
              />
            </div>
            <button
              type="button"
              className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
            >
              إرسال الرسالة
            </button>
          </form>
        );

      // 11. Input Field
      case 'input':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            <label className="text-[11px] font-semibold text-slate-700 mb-1">
              {element.text || 'حقل إدخال'}
            </label>
            <input
              type="text"
              placeholder={element.subtitle || 'أدخل النص هنا...'}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-hidden focus:border-blue-500 shadow-xs"
              readOnly
            />
          </div>
        );

      // 12. Heading (H1-H6)
      case 'heading':
        return (
          <h2
            className="w-full h-full flex items-center text-lg font-black text-slate-900 select-none"
            contentEditable={isEditingInline}
            suppressContentEditableWarning
            onMouseDown={handleEditableMouseDown}
            onBlur={handleInlineBlur}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingInline(true);
            }}
            style={{
              color: element.textColor,
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
            }}
          >
            {element.text || 'عنوان رئيسي مميز'}
          </h2>
        );

      // 13. Paragraph
      case 'paragraph':
        return (
          <p
            className="w-full h-full flex items-center text-xs text-slate-600 leading-relaxed select-none"
            contentEditable={isEditingInline}
            suppressContentEditableWarning
            onMouseDown={handleEditableMouseDown}
            onBlur={handleInlineBlur}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingInline(true);
            }}
            style={{
              color: element.textColor,
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
            }}
          >
            {element.text || 'فقرة نصية توضيحية منضبطة المسافات والتباعد للقراءة السلسة والمريحة.'}
          </p>
        );

      // 14. Section / Container / Grid Containers
      case 'section':
      case 'container':
      case 'grid':
      case 'card':
        return (
          <div
            className="w-full h-full p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between select-none"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              borderColor: element.strokeColor || '#e2e8f0',
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="text-xs font-bold text-slate-800">
                {element.text || 'حاوية كتل وتصميم'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{element.type}</span>
            </div>
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl p-3">
              {element.subtitle || 'اسحب أو أدرج عناصر تدفقية وأشكال بداخل هذه الحاوية بالفأرة'}
            </div>
          </div>
        );

      // 15. Image & Vector Clipped Image
      case 'image': {
        const shapeMask = element.shapeMask || 'none';
        const preset = CLIP_PRESETS.find((p) => p.id === shapeMask);
        const clipPathD =
          preset && shapeMask !== 'none' ? preset.generatePathD(element.width, element.height) : '';
        const clipId = `clip-${element.id}`;

        return (
          <div className="w-full h-full relative select-none overflow-hidden flex items-center justify-center">
            {clipPathD ? (
              <svg
                className="w-full h-full absolute inset-0 pointer-events-none"
                viewBox={`0 0 ${element.width} ${element.height}`}
              >
                <defs>
                  <clipPath id={clipId}>
                    <path d={clipPathD} />
                  </clipPath>
                </defs>
                <image
                  href={
                    element.imageUrl ||
                    element.src ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
                  }
                  width={element.width}
                  height={element.height}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#${clipId})`}
                />
              </svg>
            ) : (
              <img
                src={
                  element.imageUrl ||
                  element.src ||
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
                }
                alt={element.text || 'صورة الكانفا'}
                className="w-full h-full object-cover"
                style={{
                  borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
                  opacity: element.opacity !== undefined ? element.opacity : 1,
                }}
              />
            )}
          </div>
        );
      }

      // 16. Video
      case 'video':
        return (
          <div className="w-full h-full bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500 shadow-xs select-none">
            <VideoIcon className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-xs font-bold text-slate-700">
              {element.text || 'مشغل فيديو تفاعلي'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">انقر لمعاينة أو تخصيص الرابط</span>
          </div>
        );

      // 17. Divider
      case 'divider':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <hr className="w-full border-t border-slate-200" />
          </div>
        );

      // 17. Smart Callouts & Explanations
      case 'callout-balloon':
      case 'warning-box':
      case 'special-quote':
      case 'explainer-card': {
        const isWarning = element.type === 'warning-box';
        const isQuote = element.type === 'special-quote';
        return (
          <div
            className={`w-full h-full p-4 rounded-xl border flex flex-col justify-between transition-all select-none ${
              isWarning
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : isQuote
                  ? 'bg-slate-50 border-r-4 border-r-blue-600 border-slate-200 text-slate-800'
                  : 'bg-white border-blue-200 text-slate-800 shadow-xs'
            }`}
            style={{
              borderColor: element.strokeColor,
              backgroundColor: element.fillColor,
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {element.stepNumber && (
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {element.stepNumber}
                  </span>
                )}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                {isQuote && <span className="text-blue-600 font-bold text-lg">“</span>}
                <strong
                  className="text-xs font-bold text-slate-900"
                  contentEditable={isEditingInline}
                  suppressContentEditableWarning
                  onMouseDown={handleEditableMouseDown}
                  onBlur={handleInlineBlur}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditingInline(true);
                  }}
                >
                  {element.text || 'صندوق شرح تفاعلي'}
                </strong>
              </div>
              {element.badgeTextColor && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  توجيه ذكي
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed m-0">
              {element.subtitle || element.label || 'انقر لتحرير الملاحظة أو سحب موصل توضيحي.'}
            </p>
          </div>
        );
      }

      // 18. Spotlight Pin
      case 'spotlight-pin':
        return (
          <div className="relative flex flex-col items-center justify-center">
            <button
              onClick={() => setPopoverOpen(!popoverOpen)}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-blue-100"
              title="انقر لفتح الملاحظة"
            >
              <MapPin className="w-4 h-4" />
            </button>
            {popoverOpen && (
              <div className="absolute top-10 z-30 w-56 bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs text-right">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5 font-bold text-slate-900">
                  <span>{element.text || 'نقطة توضيح'}</span>
                  <button
                    onClick={() => setPopoverOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-slate-600 m-0 leading-relaxed text-[11px]">
                  {element.subtitle || 'شرح تفصيلي للمنطقة المحددة بالفأرة.'}
                </p>
              </div>
            )}
          </div>
        );

      // 19. Step Badge
      case 'step-badge':
        return (
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xs cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => setActiveStep((s) => (s % 5) + 1)}
          >
            <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center">
              {element.stepNumber || activeStep}
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">
                {element.text || 'خطوة إجرائية'}
              </div>
              {element.subtitle && (
                <div className="text-[10px] text-slate-500">{element.subtitle}</div>
              )}
            </div>
          </div>
        );

      // 20. Diagram & MindMap Node
      case 'diagram-node':
      case 'mindmap-node': {
        const isRoot = element.nodeType === 'mindmap-root' || element.nodeType === 'start';
        return (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all select-none ${
              isRoot
                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-extrabold shadow-sm'
                : 'bg-white border-slate-200 text-slate-800 shadow-xs'
            }`}
            style={{
              backgroundColor: element.fillColor,
              borderColor: element.strokeColor,
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
            }}
          >
            <span
              className="text-xs font-bold leading-tight"
              contentEditable={isEditingInline}
              suppressContentEditableWarning
              onMouseDown={handleEditableMouseDown}
              onBlur={handleInlineBlur}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingInline(true);
              }}
            >
              {element.text || 'عقدة مخطط'}
            </span>
            {element.subtitle && (
              <span className="text-[10px] text-slate-500 mt-0.5">{element.subtitle}</span>
            )}
          </div>
        );
      }

      // 21. Connectors & Arrows
      case 'connector':
      case 'arrow':
      case 'line': {
        const w = Math.max(element.width || 100, 20);
        const h = Math.max(element.height || 40, 20);
        const strokeColor = element.strokeColor || '#2563eb';
        const strokeW = element.strokeWidth || 2;
        const routing =
          element.routing || (element.type === 'connector' ? 'orthogonal' : 'straight');
        const hasArrowEnd =
          element.arrowEnd !== false &&
          (element.type === 'arrow' || element.type === 'connector' || element.arrowEnd === true);
        const hasArrowStart = element.arrowStart === true;

        const p1 = { x: 4, y: h / 2 };
        const p2 = { x: w - 4, y: h / 2 };
        const { path, labelPoint } = generateConnectorSVGPath(p1, p2, routing);
        const markerEndId = `arrow-end-${element.id}`;
        const markerStartId = `arrow-start-${element.id}`;

        return (
          <div className="w-full h-full relative select-none flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible pointer-events-none"
              viewBox={`0 0 ${w} ${h}`}
              preserveAspectRatio="none"
            >
              <defs>
                {hasArrowEnd && (
                  <marker
                    id={markerEndId}
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,6 L6,3 z" fill={strokeColor} />
                  </marker>
                )}
                {hasArrowStart && (
                  <marker
                    id={markerStartId}
                    markerWidth="8"
                    markerHeight="8"
                    refX="0"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M6,0 L6,6 L0,3 z" fill={strokeColor} />
                  </marker>
                )}
              </defs>
              <path
                d={path}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={
                  element.strokeStyle === 'dashed'
                    ? '6 4'
                    : element.strokeStyle === 'dotted'
                      ? '2 4'
                      : undefined
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={hasArrowEnd ? `url(#${markerEndId})` : undefined}
                markerStart={hasArrowStart ? `url(#${markerStartId})` : undefined}
              />
            </svg>
            {element.label && (
              <span
                className="absolute px-2.5 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 shadow-xs pointer-events-auto"
                style={{
                  top: labelPoint ? `${(labelPoint.y / h) * 100}%` : '50%',
                  left: labelPoint ? `${(labelPoint.x / w) * 100}%` : '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {element.label}
              </span>
            )}
          </div>
        );
      }

      // 22. Button
      case 'button':
        return (
          <button
            type="button"
            className="w-full h-full px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            style={{
              backgroundColor: element.fillColor,
              color: element.textColor || '#ffffff',
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
            }}
          >
            <span>{element.text || 'زر تفاعلي'}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        );

      // 23. Badge
      case 'badge':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold shadow-xs"
            style={{
              backgroundColor: element.fillColor,
              borderColor: element.strokeColor,
              color: element.textColor,
            }}
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>{element.text || 'شارة ميزة'}</span>
          </span>
        );

      // 24. Dedicated Text Box
      case 'text':
        return (
          <div
            className="w-full h-full p-2 select-none overflow-hidden flex flex-col justify-center"
            style={{
              fontFamily: element.fontFamily || 'inherit',
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
              fontWeight: element.fontWeight || 'normal',
              color: element.textColor || '#1e293b',
              textAlign: element.textAlign || 'right',
              backgroundColor:
                element.fillColor && element.fillColor !== 'transparent'
                  ? element.fillColor
                  : 'transparent',
              border:
                element.strokeWidth && element.strokeWidth > 0
                  ? `${element.strokeWidth}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#cbd5e1'}`
                  : 'none',
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
              lineHeight: element.lineHeight || 1.6,
            }}
            contentEditable={isEditingInline}
            suppressContentEditableWarning
            onMouseDown={handleEditableMouseDown}
            onBlur={handleInlineBlur}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingInline(true);
            }}
          >
            {element.text || 'أدخل النص هنا...'}
          </div>
        );

      // 25. Freehand Drawing / Vector Path
      case 'freehand':
      case 'path': {
        const stroke = element.strokeColor || '#2563eb';
        const strokeW = element.strokeWidth || 3;
        const fill =
          element.fillColor && element.fillColor !== 'transparent' ? element.fillColor : 'none';
        return (
          <div className="w-full h-full relative select-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${element.width || 100} ${element.height || 100}`}
              preserveAspectRatio="none"
            >
              {element.pathData ? (
                <path
                  d={element.pathData}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={
                    element.strokeStyle === 'dashed'
                      ? '6 4'
                      : element.strokeStyle === 'dotted'
                        ? '2 4'
                        : undefined
                  }
                />
              ) : (
                <polyline
                  points={(element.points || []).map((p) => `${p.x},${p.y}`).join(' ')}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
        );
      }

      // 26. Ellipse
      case 'ellipse':
        return (
          <div
            className="w-full h-full flex items-center justify-center text-center p-2 text-xs font-bold text-slate-800 select-none"
            style={{
              backgroundColor: element.fillColor || '#eff6ff',
              border: `${element.strokeWidth || 2}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#3b82f6'}`,
              borderRadius: '50% / 50%',
              color: element.textColor || '#1e293b',
              fontFamily: element.fontFamily,
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
              fontWeight: element.fontWeight,
            }}
            contentEditable={isEditingInline}
            suppressContentEditableWarning
            onMouseDown={handleEditableMouseDown}
            onBlur={handleInlineBlur}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingInline(true);
            }}
          >
            {element.text}
          </div>
        );

      // 27. Circle
      case 'circle':
        return (
          <div
            className="w-full h-full flex items-center justify-center text-center p-2 text-xs font-bold text-slate-800 select-none"
            style={{
              backgroundColor: element.fillColor || '#eff6ff',
              border: `${element.strokeWidth || 2}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#3b82f6'}`,
              borderRadius: '9999px',
              color: element.textColor || '#1e293b',
              fontFamily: element.fontFamily,
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
              fontWeight: element.fontWeight,
            }}
            contentEditable={isEditingInline}
            suppressContentEditableWarning
            onMouseDown={handleEditableMouseDown}
            onBlur={handleInlineBlur}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingInline(true);
            }}
          >
            {element.text}
          </div>
        );

      // 28. Rectangle
      case 'rectangle':
        return (
          <div
            className="w-full h-full flex items-center justify-center text-center p-2 text-xs font-bold text-slate-800 select-none"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              border: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#cbd5e1'}`,
              borderRadius:
                element.borderRadius !== undefined ? `${element.borderRadius}px` : '12px',
              color: element.textColor || '#1e293b',
              fontFamily: element.fontFamily,
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
              fontWeight: element.fontWeight,
              textAlign: element.textAlign || 'center',
            }}
            contentEditable={isEditingInline}
            suppressContentEditableWarning
            onMouseDown={handleEditableMouseDown}
            onBlur={handleInlineBlur}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingInline(true);
            }}
          >
            {element.text}
          </div>
        );

      // 29. Triangle
      case 'triangle': {
        const w = element.width || 100;
        const h = element.height || 100;
        const pts = [
          { x: w / 2, y: 0 },
          { x: w, y: h },
          { x: 0, y: h },
        ];
        const pathD = createPolygonPath(pts);
        return (
          <div className="w-full h-full relative flex items-center justify-center select-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${w} ${h}`}
              preserveAspectRatio="none"
            >
              <path
                d={pathD}
                fill={element.fillColor || '#fefce8'}
                stroke={element.strokeColor || '#ca8a04'}
                strokeWidth={element.strokeWidth ?? 2}
                strokeDasharray={
                  element.strokeStyle === 'dashed'
                    ? '6 4'
                    : element.strokeStyle === 'dotted'
                      ? '2 4'
                      : undefined
                }
              />
            </svg>
            {element.text && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 pt-3 pointer-events-none">
                {element.text}
              </span>
            )}
          </div>
        );
      }

      // 30. Star
      case 'star': {
        const w = element.width || 100;
        const h = element.height || 100;
        const pathD = createStarPath(w / 2, h / 2, 5, Math.min(w, h) / 2, Math.min(w, h) / 4);
        return (
          <div className="w-full h-full relative flex items-center justify-center select-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${w} ${h}`}
              preserveAspectRatio="none"
            >
              <path
                d={pathD}
                fill={element.fillColor || '#fef08a'}
                stroke={element.strokeColor || '#eab308'}
                strokeWidth={element.strokeWidth ?? 2}
                strokeDasharray={
                  element.strokeStyle === 'dashed'
                    ? '6 4'
                    : element.strokeStyle === 'dotted'
                      ? '2 4'
                      : undefined
                }
              />
            </svg>
            {element.text && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 pointer-events-none">
                {element.text}
              </span>
            )}
          </div>
        );
      }

      // 31. Diamond
      case 'diamond': {
        const w = element.width || 100;
        const h = element.height || 100;
        const pts = [
          { x: w / 2, y: 0 },
          { x: w, y: h / 2 },
          { x: w / 2, y: h },
          { x: 0, y: h / 2 },
        ];
        const pathD = createPolygonPath(pts);
        return (
          <div className="w-full h-full relative flex items-center justify-center select-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${w} ${h}`}
              preserveAspectRatio="none"
            >
              <path
                d={pathD}
                fill={element.fillColor || '#eff6ff'}
                stroke={element.strokeColor || '#2563eb'}
                strokeWidth={element.strokeWidth ?? 2}
                strokeDasharray={
                  element.strokeStyle === 'dashed'
                    ? '6 4'
                    : element.strokeStyle === 'dotted'
                      ? '2 4'
                      : undefined
                }
              />
            </svg>
            {element.text && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 pointer-events-none">
                {element.text}
              </span>
            )}
          </div>
        );
      }

      // 32. Regular Polygons (Polygon / Hexagon / Octagon / Pentagon / Shield)
      case 'polygon':
      case 'hexagon':
      case 'octagon':
      case 'pentagon':
      case 'shield': {
        const w = element.width || 100;
        const h = element.height || 100;
        let pathD: string;
        if (element.type === 'shield') {
          pathD = createShieldPath(w, h);
        } else {
          const sides =
            element.type === 'hexagon'
              ? 6
              : element.type === 'octagon'
                ? 8
                : element.type === 'pentagon'
                  ? 5
                  : element.sides || 6;
          pathD = createPolygonPath(createRegularPolygonPoints(sides, w, h));
        }
        return (
          <div className="w-full h-full relative flex items-center justify-center select-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${w} ${h}`}
              preserveAspectRatio="none"
            >
              <path
                d={pathD}
                fill={element.fillColor || '#f5f3ff'}
                stroke={element.strokeColor || '#8b5cf6'}
                strokeWidth={element.strokeWidth ?? 2}
                strokeDasharray={
                  element.strokeStyle === 'dashed'
                    ? '6 4'
                    : element.strokeStyle === 'dotted'
                      ? '2 4'
                      : undefined
                }
              />
            </svg>
            {element.text && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 pointer-events-none">
                {element.text}
              </span>
            )}
          </div>
        );
      }

      // 33. HTML Content Container (Sanitized WYSIWYG)
      case 'html-card':
      case 'web-frame': {
        if (element.htmlContent) {
          const cleanHtml = sanitizeHtml(element.htmlContent, { stripStyles: false });
          return (
            <div
              className="w-full h-full overflow-auto rounded-xl select-none"
              style={{
                backgroundColor: element.fillColor || '#ffffff',
                border: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#cbd5e1'}`,
                borderRadius: element.borderRadius ? `${element.borderRadius}px` : '12px',
              }}
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          );
        }
        return (
          <div
            className="w-full h-full rounded-xl flex items-center justify-center text-center p-2 text-xs font-bold text-slate-800 select-none"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              border: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#cbd5e1'}`,
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : '12px',
            }}
          >
            {element.text}
          </div>
        );
      }

      // 34. Icon (أيقونة متجهة من خريطة الأسماء المعروفة)
      case 'icon': {
        const IconCmp = LUCIDE_ICON_MAP[(element.iconName || '').toLowerCase()] || Sparkles;
        const iconColor = element.textColor || element.fillColor || '#2563eb';
        return (
          <div className="w-full h-full flex items-center justify-center select-none">
            <IconCmp
              className="w-[55%] h-[55%]"
              style={{
                color: iconColor,
                opacity: element.opacity ?? 1,
                filter: element.glossEffect
                  ? 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.25))'
                  : undefined,
              }}
            />
          </div>
        );
      }

      // 35. LaTeX Equation (معادلة رياضية عبر محرك LaTeX)
      case 'latex-equation': {
        const latexSrc = element.latex || element.text || 'f(x) = \\int_{a}^{b} x^2\\,dx';
        let equationHtml = latexEngine.renderToHtml(latexSrc, true);
        if (!equationHtml || equationHtml === '<span class="latex-block"></span>') {
          equationHtml = `<span class="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-sm">${latexSrc}</span>`;
        }
        return (
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden p-3 rounded-xl select-none"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              border: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#cbd5e1'}`,
            }}
          >
            <div
              className="max-w-full overflow-hidden text-slate-900"
              style={{
                fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                lineHeight: element.lineHeight || 1.5,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
              }}
              dangerouslySetInnerHTML={{ __html: equationHtml }}
            />
          </div>
        );
      }

      // 36. Slide Header (ترويسة شريحة)
      case 'slide-header':
        return (
          <div
            className="w-full h-full flex items-center justify-between gap-3 px-5 select-none"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              borderBottom: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#e2e8f0'}`,
              color: element.textColor || '#0f172a',
            }}
          >
            <strong
              className="text-sm font-black text-slate-900 leading-tight"
              contentEditable={isEditingInline}
              suppressContentEditableWarning
              onMouseDown={handleEditableMouseDown}
              onBlur={handleInlineBlur}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingInline(true);
              }}
            >
              {element.text || 'عنوان الشريحة'}
            </strong>
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
              {element.subtitle || 'عرض تقديمي فاتح نقي'}
            </span>
          </div>
        );

      // 37. Slide Footer (تذييل شريحة)
      case 'slide-footer':
        return (
          <div
            className="w-full h-full flex items-center justify-between gap-3 px-5 select-none"
            style={{
              backgroundColor: element.fillColor || '#f8fafc',
              borderTop: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#e2e8f0'}`,
              color: element.textColor || '#0f172a',
            }}
          >
            <span className="text-[10px] font-medium text-slate-500">
              {element.text || 'محرر الكانفا الفيكتوري'}
            </span>
            <span className="text-[10px] font-bold text-blue-600">
              {element.subtitle || 'صفحة 1'}
            </span>
          </div>
        );

      // 38. KPI Card (بطاقة مؤشر أداء)
      case 'kpi-card': {
        const KpiIcon = LUCIDE_ICON_MAP[(element.iconName || '').toLowerCase()] || Gauge;
        return (
          <div
            className="w-full h-full flex flex-col justify-center gap-1.5 p-4 rounded-2xl border border-slate-200 bg-white shadow-xs select-none"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              borderColor: element.strokeColor || '#e2e8f0',
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-slate-500">
                {element.subtitle || 'مؤشر الأداء الرئيسي'}
              </span>
              <span
                className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600"
                style={{ color: element.textColor || '#2563eb' }}
              >
                <KpiIcon className="w-4 h-4" />
              </span>
            </div>
            <strong className="text-lg font-black text-slate-900 leading-none">
              {element.text || '٩٨٪'}
            </strong>
            <span className="text-[10px] font-semibold text-emerald-600">
              {element.calloutDescription || 'نمو ١٢٪ عن الربع السابق'}
            </span>
          </div>
        );
      }

      // 39. Note (ملاحظة لاصقة)
      case 'note':
        return (
          <div
            className="w-full h-full p-4 flex flex-col rounded-md shadow-sm select-none"
            style={{
              backgroundColor: element.fillColor || '#fefce8',
              border: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#fde047'}`,
              transform: element.rotation ? `rotate(${element.rotation}deg)` : 'rotate(-1.2deg)',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-amber-700">
                {element.subtitle || 'ملاحظة'}
              </span>
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p
              className="text-xs text-slate-800 leading-relaxed flex-1"
              contentEditable={isEditingInline}
              suppressContentEditableWarning
              onMouseDown={handleEditableMouseDown}
              onBlur={handleInlineBlur}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingInline(true);
              }}
            >
              {element.text ||
                element.calloutDescription ||
                'انقر بالزر الأيمن لتحرير نص الملاحظة.'}
            </p>
            <span className="text-[9px] text-slate-400 mt-2 text-left">
              أُنشئت في الكانفا الفيكتوري
            </span>
          </div>
        );

      // 40. Avatar (صورة شخصية دائرية أو حرف أول)
      case 'avatar': {
        const avatarSrc = element.imageUrl || element.src;
        const initial = (element.text || '؟').trim().charAt(0) || '؟';
        return (
          <div
            className="w-full h-full flex items-center justify-center select-none"
            style={{
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : '9999px',
              overflow: 'hidden',
            }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={element.alt || element.text || 'صورة شخصية'}
                className="w-full h-full object-cover"
                style={{
                  borderRadius: element.borderRadius ? `${element.borderRadius}px` : '9999px',
                  border: `${element.strokeWidth || 2}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#e2e8f0'}`,
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-black text-white"
                style={{
                  backgroundColor: element.fillColor || '#2563eb',
                  borderRadius: element.borderRadius ? `${element.borderRadius}px` : '9999px',
                  fontSize: Math.max(16, Math.min(element.width, element.height) * 0.42),
                }}
              >
                {initial}
              </div>
            )}
          </div>
        );
      }

      // 41. Linked Chart (رسم بياني مرتبط بالجداول والمفكرة)
      case 'chart': {
        return (
          <CanvasLinkedChartComponent
            id={element.id}
            title={element.text || 'رسم بياني تحليلي'}
            width={element.width || 320}
            height={element.height || 220}
            chartType={(element.chartType as any) || 'bar'}
          />
        );
      }

      // 42. Bezier Curve Element (منحنى بيزييه الدقيق)
      case 'bezier': {
        const pathD = element.nodes
          ? bezierNodesToSvgPath(element.nodes as any, element.closed || false)
          : element.pathData || '';
        return (
          <div className="w-full h-full relative select-none">
            <svg
              className="w-full h-full overflow-visible pointer-events-none"
              viewBox={`0 0 ${element.width || 100} ${element.height || 100}`}
              preserveAspectRatio="none"
            >
              <path
                d={pathD}
                fill={element.fillColor || 'none'}
                stroke={element.strokeColor || '#2563eb'}
                strokeWidth={element.strokeWidth || 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={
                  element.strokeStyle === 'dashed'
                    ? '6 4'
                    : element.strokeStyle === 'dotted'
                      ? '2 4'
                      : undefined
                }
              />
            </svg>
          </div>
        );
      }

      // Default Standard Shapes
      default:
        return (
          <div
            className="w-full h-full rounded-xl flex items-center justify-center text-center p-2 text-xs font-bold text-slate-800 select-none"
            style={{
              backgroundColor: element.fillColor || '#ffffff',
              border: `${element.strokeWidth || 1}px ${element.strokeStyle || 'solid'} ${element.strokeColor || '#cbd5e1'}`,
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : '12px',
              color: element.textColor || '#1e293b',
              fontFamily: element.fontFamily,
              fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
              fontWeight: element.fontWeight,
            }}
            contentEditable={isEditingInline}
            suppressContentEditableWarning
            onMouseDown={handleEditableMouseDown}
            onBlur={handleInlineBlur}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingInline(true);
            }}
          >
            {element.text}
          </div>
        );
    }
  };

  const animPreset = SVG_ANIMATION_PRESETS.find((p) => p.id === element.animation);
  const animClass = animPreset ? animPreset.cssClass : '';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`relative w-full h-full transition-all ${animClass} ${
        isSelected ? 'ring-2 ring-blue-600 ring-offset-2 shadow-md' : 'hover:border-slate-300'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {renderContent()}
    </div>
  );
};
