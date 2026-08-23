/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: واجهة عرض وسحب القوالب الجاهزة مباشرة إلى لوحة الرسم - Draggable Templates
 * 🏛️ الدور: مكون مشترك - سحب وإفلات القوالب مع قوائم سياقية
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Drag & Drop Templates: نظام سحب وإفلات HTML5
 *    مع قوائم سياقية بالزر الأيمن للمعاينة والتخصيص والتكرار
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. السحب يجب أن يحافظ على تنسيق البيانات
 *    2. النقر يجب أن يُدرج فوراً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة البيانات المنقولة
 *    - fallback للنقر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Layout,
  Plus,
  Eye,
  Copy,
  Sparkles,
  Move,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
} from 'lucide-react';
import {
  WEB_COMPONENT_LIBRARY,
  getAllWebComponents,
  type WebTemplateItem,
  type ComponentCategory,
} from '../componentLibrary';
import {
  SharedContextMenu,
  type ContextMenuItem,
} from '../../../shared/components/SharedContextMenu';
import { notificationEngine } from '../../../shared/engines/NotificationEngine';

export interface DraggableTemplatePanelProps {
  onInsertTemplate: (template: WebTemplateItem, position?: { x: number; y: number }) => void;
  onPreviewTemplate?: (template: WebTemplateItem) => void;
}

export const DraggableTemplatePanel: React.FC<DraggableTemplatePanelProps> = ({
  onInsertTemplate,
  onPreviewTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplateForContext, setActiveTemplateForContext] = useState<WebTemplateItem | null>(
    null,
  );

  // Context Menu State for Templates
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    template: WebTemplateItem | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    template: null,
  });

  const categories: { id: ComponentCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'الكل (جميع الفئات)', icon: '🌟' },
    { id: 'split-layouts', label: 'التقسيم الذكي والتفاعل اللحظي', icon: '🔲' },
    { id: 'dashboards', label: 'لوحات العمل والمقارنات', icon: '📊' },
    { id: 'headers', label: 'الترويسة والتنقل', icon: '🧭' },
    { id: 'hero', label: 'الترحيب والبطولة', icon: '🚀' },
    { id: 'features', label: 'الميزات والخدمات', icon: '⚡' },
    { id: 'pricing', label: 'جداول الأسعار', icon: '💎' },
    { id: 'testimonials', label: 'آراء العملاء', icon: '💬' },
    { id: 'forms', label: 'النماذج والتسجيل', icon: '📝' },
    { id: 'callouts', label: 'التنبيهات والإرشادات', icon: '💡' },
    { id: 'connectors', label: 'الخطوات والمسارات', icon: '🪜' },
    { id: 'interactive', label: 'العناصر التفاعلية', icon: '⚡' },
    { id: 'cards', label: 'البطاقات والملفات', icon: '🗂️' },
    { id: 'cms-list', label: 'المقالات والمدونة', icon: '📰' },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: '❓' },
    { id: 'video', label: 'مشغلات الفيديو', icon: '🎥' },
    { id: 'badge', label: 'الشارات والتصنيفات', icon: '🏷️' },
    { id: 'divider', label: 'الفواصل والمساحات', icon: '➖' },
    { id: 'tabs', label: 'التبويبات والأزرار', icon: '📑' },
    { id: 'footer', label: 'تذييل الصفحات', icon: '🦶' },
    { id: 'stats', label: 'المؤشرات والأرقام', icon: '📊' },
    { id: 'gallery', label: 'معارض الصور', icon: '🖼️' },
    { id: 'team', label: 'فريق العمل', icon: '👥' },
    { id: 'table', label: 'جداول البيانات', icon: '📋' },
    { id: 'charts', label: 'المخططات والرسوم', icon: '📈' },
    { id: 'cta', label: 'الحث على الإجراء', icon: '🎯' },
  ];

  // تصفية القوالب حسب الفئة والبحث عبر كافة مكونات المكتبة
  const allTemplates = getAllWebComponents();
  const filteredTemplates = allTemplates.filter((tpl) => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tpl.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // معالجة النقر بالزر الأيمن على بطاقة القالب
  const handleTemplateContextMenu = (e: React.MouseEvent, template: WebTemplateItem) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTemplateForContext(template);
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      template,
    });
  };

  // عناصر القائمة السياقية بالزر الأيمن
  const contextMenuItems: ContextMenuItem[] = contextMenu.template
    ? [
        {
          id: 'tpl-title',
          label: `القالب: ${contextMenu.template.nameAr}`,
          disabled: true,
        },
        {
          id: 'insert-center',
          label: 'إدراج القالب في منتصف اللوحة',
          icon: <Plus className="w-3.5 h-3.5 text-blue-600" />,
          onClick: () => {
            onInsertTemplate(contextMenu.template!);
            notificationEngine.success(`تم إدراج: ${contextMenu.template!.nameAr}`);
          },
        },
        {
          id: 'insert-top',
          label: 'إدراج في أعلى اللوحة (Y: 50)',
          icon: <Layout className="w-3.5 h-3.5 text-emerald-600" />,
          onClick: () => {
            onInsertTemplate(contextMenu.template!, { x: 50, y: 50 });
            notificationEngine.success(`تم إدراج القالب في الأعلى`);
          },
        },
        {
          id: 'copy-code',
          label: 'نسخ كود HTML المصدري للقالب',
          icon: <Code2 className="w-3.5 h-3.5 text-slate-600" />,
          onClick: () => {
            navigator.clipboard.writeText(contextMenu.template!.templateHtml);
            notificationEngine.info('تم نسخ كود HTML للقالب إلى الحافظة');
          },
        },
        { id: 'sep-1', label: '', separator: true },
        {
          id: 'category-filter',
          label: `عرض قوالب فئة (${contextMenu.template.categoryAr}) فقط`,
          icon: <Filter className="w-3.5 h-3.5 text-slate-600" />,
          onClick: () => {
            setSelectedCategory(contextMenu.template!.category);
          },
        },
      ]
    : [];

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden" dir="rtl">
      {/* Top Search & Filter Bar */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في القوالب الجاهزة..."
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-bold whitespace-nowrap cursor-pointer transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="ml-1">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid List (Draggable + Right Clickable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
          <span>اسحب القالب إلى لوحة الرسم أو انقر لإدراجه فوراً</span>
          <span className="font-mono text-slate-500">({filteredTemplates.length})</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify({
                    type: 'canvas:add-template',
                    templateId: template.id,
                  }),
                );
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => {
                onInsertTemplate(template);
                notificationEngine.success(`تمت إضافة ${template.nameAr}`);
              }}
              onContextMenu={(e) => handleTemplateContextMenu(e, template)}
              className="group p-3 bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-400 rounded-xl cursor-grab active:cursor-grabbing transition-all shadow-2xs hover:shadow-xs relative"
              title="اسحب إلى لوحة الرسم أو انقر بالزر الأيمن لخيارات إضافية"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl shrink-0 p-1 bg-slate-50 border border-slate-100 rounded-lg group-hover:scale-110 transition-transform">
                    {template.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {template.nameAr}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {template.categoryAr}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsertTemplate(template);
                  }}
                  className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition shrink-0 cursor-pointer shadow-2xs"
                  title="إدراج في اللوحة"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {template.descriptionAr}
              </p>

              {/* Drag Indicator Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Move className="w-3 h-3 text-slate-400" />
                  <span>قابل للسحب المباشر</span>
                </span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-[-2px] transition-transform">
                  + إضافة
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Context Menu for Templates (Right Click functionality) */}
      <SharedContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        items={contextMenuItems}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
