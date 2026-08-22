/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: لوحة التحكم بمحتوى الشروحات والصور والعناصر التفاعلية - Element Properties Panel
 * 🏛️ الدور: مكون مشترك - تعديل الخصائص للعنصر المحدد في الكانفا
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dynamic Properties Panel: لوحة خصائص ديناميكية تتغير حسب نوع العنصر
 *    مع دعم الصور والنصوص والعناوين وأنماط CSS و HTML
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الخصائص يجب أن تتحدث فوراً عند التعديل
 *    2. الصور تحتاج ImageEditor للتحرير المباشر
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العنصر قبل عرض الخصائص
 *    - fallback لحالة فارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import {
  SlidersHorizontal,
  Type,
  Palette,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Layers,
  ArrowUpRight,
  Code2,
  ChevronDown,
  Info,
  Image as ImageIcon,
  Edit3,
  ExternalLink,
  Baseline,
} from 'lucide-react';
import type { CanvasElement, CanvasElementType } from '../model';
import { LIGHT_THEME_GRADIENTS } from '../core/svgPaint';
import { CLIP_PRESETS, type ClipShapeType } from '../core/svgClipping';
import { SVG_ANIMATION_PRESETS, type SvgAnimationType } from '../core/svgAnimation';
import { SharedFormattingToolbar } from '../../../shared/components/SharedFormattingToolbar';

interface ElementPropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (updatedProps: Partial<CanvasElement>) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onOpenImageEditor?: (imageUrl: string) => void;
}

const CALLOUT_TYPES: { type: CanvasElementType; labelAr: string; icon: string }[] = [
  // أقسام وبنية الصفحة
  { type: 'section', labelAr: 'قسم / مقطع صفحة', icon: '📑' },
  { type: 'container', labelAr: 'حاوية مرنة', icon: '🗂️' },
  { type: 'grid', labelAr: 'شبكة تخطيط', icon: '🔲' },
  { type: 'navbar', labelAr: 'شريط تنقّل علوي', icon: '🧭' },
  { type: 'hero', labelAr: 'قسم ترحيبي Hero', icon: '🚀' },
  { type: 'features', labelAr: 'شبكة مزايا', icon: '⭐' },
  { type: 'pricing', labelAr: 'جدول أسعار', icon: '💲' },
  { type: 'testimonials', labelAr: 'آراء العملاء', icon: '🗣️' },
  { type: 'faq', labelAr: 'أسئلة شائعة FAQ', icon: '❓' },
  { type: 'cta', labelAr: 'دعوة لاتخاذ إجراء CTA', icon: '🎯' },
  { type: 'footer', labelAr: 'تذييل صفحة', icon: '🦶' },
  { type: 'cms-list', labelAr: 'قائمة محتوى CMS', icon: '📚' },
  // عناصر المحتوى والنماذج
  { type: 'heading', labelAr: 'عنوان رئيسي', icon: '🔠' },
  { type: 'paragraph', labelAr: 'فقرة نصية', icon: '📝' },
  { type: 'button', labelAr: 'زر إجراء تفاعلي', icon: '🔘' },
  { type: 'card', labelAr: 'بطاقة محتوى', icon: '🃏' },
  { type: 'form', labelAr: 'نموذج إدخال', icon: '📋' },
  { type: 'input', labelAr: 'حقل إدخال', icon: '⌨️' },
  { type: 'badge', labelAr: 'شارة وسم وحالة', icon: '🏷️' },
  { type: 'divider', labelAr: 'فاصل خطي', icon: '➖' },
  // الأشكال المتجهة (Canvas Vector Shapes)
  { type: 'rectangle', labelAr: 'مستطيل متجه', icon: '⬛' },
  { type: 'circle', labelAr: 'دائرة متجهة', icon: '⭕' },
  { type: 'ellipse', labelAr: 'قطع ناقص', icon: '🥚' },
  { type: 'freehand', labelAr: 'رسم حر بالقلم', icon: '✏️' },
  { type: 'path', labelAr: 'مسار متجه حر', icon: '〰️' },
  { type: 'diamond', labelAr: 'معين (Diamond)', icon: '🔶' },
  { type: 'triangle', labelAr: 'مثلث متجه', icon: '🔺' },
  { type: 'star', labelAr: 'نجمة متجهة', icon: '🌟' },
  { type: 'hexagon', labelAr: 'سداسي متجه', icon: '⬡' },
  { type: 'octagon', labelAr: 'ثماني متجه', icon: '🛑' },
  { type: 'pentagon', labelAr: 'خماسي متجه', icon: '🔷' },
  { type: 'shield', labelAr: 'درع متجه', icon: '🛡️' },
  // النصوص والوسائط
  { type: 'text', labelAr: 'نص حر', icon: '💬' },
  { type: 'latex-equation', labelAr: 'معادلة LaTeX', icon: '∑' },
  { type: 'mindmap-node', labelAr: 'عقدة خريطة ذهنية', icon: '🧠' },
  { type: 'slide-header', labelAr: 'ترويسة شريحة', icon: '⬆️' },
  { type: 'slide-footer', labelAr: 'تذييل شريحة', icon: '⬇️' },
  { type: 'image', labelAr: 'صورة منسقة تفاعلية', icon: '🖼️' },
  { type: 'icon', labelAr: 'أيقونة متجهة', icon: '🔣' },
  { type: 'video', labelAr: 'فيديو / إطار', icon: '🎬' },
  { type: 'avatar', labelAr: 'صورة شخصية', icon: '👤' },
  // الشروحات والتوجيه
  { type: 'callout-balloon', labelAr: 'فقاعة شرح مع مؤشر', icon: '💬' },
  { type: 'warning-box', labelAr: 'صندوق تنبيه وتحذير', icon: '⚠️' },
  { type: 'special-quote', labelAr: 'اقتباس وتوجيه مميز', icon: '📜' },
  { type: 'spotlight-pin', labelAr: 'دبوس ملاحظات تفاعلي', icon: '📍' },
  { type: 'step-badge', labelAr: 'شارة خطوة إجرائية', icon: '🔢' },
  { type: 'explainer-card', labelAr: 'بطاقة شرح عريضة', icon: '💡' },
  { type: 'diagram-node', labelAr: 'عقدة مخطط وتدفق', icon: '💠' },
  { type: 'kpi-card', labelAr: 'بطاقة مؤشر أداء KPI', icon: '📊' },
  { type: 'note', labelAr: 'ملاحظة لاصقة', icon: '📌' },
  // الموصلات والأسهم
  { type: 'arrow', labelAr: 'سهم اتجاه', icon: '➡️' },
  { type: 'line', labelAr: 'خط مستقيم', icon: '📏' },
  { type: 'connector', labelAr: 'موصل بين عنصرين', icon: '🔗' },
  // حاويات الويب
  { type: 'web-frame', labelAr: 'إطار صفحة ويب', icon: '🌐' },
  { type: 'html-card', labelAr: 'حاوية HTML حرة', icon: '🧩' },
];

const PRESET_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
  '#eff6ff', '#dbeafe', '#bfdbfe', '#2563eb',
  '#f0fdf4', '#dcfce7', '#bbf7d0', '#16a34a',
  '#fefce8', '#fef08a', '#fde047', '#ca8a04',
  '#fef2f2', '#fee2e2', '#fecaca', '#dc2626',
  '#faf5ff', '#f3e8ff', '#e9d5ff', '#9333ea',
];

export const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onOpenImageEditor,
}) => {
  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-2">
        <SlidersHorizontal className="w-8 h-8 text-slate-300 stroke-1" />
        <div className="text-xs font-bold text-slate-600">لا يوجد عنصر محدد حالياً</div>
        <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
          حدد أي مربع شرح، صورة، نص، شكل، أو قالب بالفأرة لتعديل نصوصه ومؤشراته وألوانه.
        </p>
      </div>
    );
  }

  const isCallout =
    selectedElement.type === 'callout-balloon' ||
    selectedElement.type === 'warning-box' ||
    selectedElement.type === 'special-quote' ||
    selectedElement.type === 'spotlight-pin' ||
    selectedElement.type === 'step-badge' ||
    selectedElement.type === 'explainer-card';

  const isConnector =
    selectedElement.type === 'connector' ||
    selectedElement.type === 'arrow' ||
    selectedElement.type === 'line';

  const isImage = selectedElement.type === 'image' || Boolean(selectedElement.imageUrl);

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-right" dir="rtl">
      {/* 1. Quick Action Header */}
      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="p-1 rounded-md bg-blue-100 text-blue-700">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </span>
          <span>التحكم بـ {selectedElement.type}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdateElement({ locked: !selectedElement.locked })}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              selectedElement.locked
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={selectedElement.locked ? 'إلغاء القفل' : 'قفل العنصر'}
          >
            {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onDuplicateElement}
            className="p-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            title="تكرار العنصر"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDeleteElement}
            className="p-1.5 bg-white text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition cursor-pointer"
            title="حذف العنصر"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Type Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
          <span>نوع العنصر</span>
          <span className="text-[10px] text-blue-600 font-semibold">{selectedElement.type}</span>
        </label>
        <select
          value={selectedElement.type}
          onChange={(e) => onUpdateElement({ type: e.target.value as CanvasElementType })}
          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
        >
          {CALLOUT_TYPES.map((t) => (
            <option key={t.type} value={t.type}>
              {t.icon} {t.labelAr} ({t.type})
            </option>
          ))}
        </select>
      </div>

      {/* Dedicated Image Controls (when Image Element) */}
      {isImage && (
        <div className="flex flex-col gap-2.5 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
          <div className="font-bold text-blue-950 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>إدارة وتعديل الصورة</span>
            </div>
            <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
              معالج الصور
            </span>
          </div>

          {/* Image URL Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-600">رابط الصورة (URL أو DataURL)</label>
            <input
              type="text"
              value={selectedElement.imageUrl || ''}
              onChange={(e) => onUpdateElement({ imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Edit in ImageEditor Button */}
          {selectedElement.imageUrl && onOpenImageEditor && (
            <button
              type="button"
              onClick={() => onOpenImageEditor(selectedElement.imageUrl || '')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>قص وتعديل الصورة بالمحرر (Image Editor)</span>
            </button>
          )}

          {/* SVG Clipping Mask (قناع وقص الصورة المتجه) */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-blue-200/60">
            <label className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
              <span>قناع القص المتجه (SVG Clip Mask)</span>
              <span className="text-[9px] text-blue-600 font-semibold">{selectedElement.shapeMask || 'بدون'}</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {CLIP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onUpdateElement({ shapeMask: preset.id as any })}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                    (selectedElement.shapeMask || 'none') === preset.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={preset.nameAr}
                >
                  {preset.nameAr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Text & Content Editing (العنوان والمحتوى وتنسيق الخطوط بالفأرة) */}
      <div className="flex flex-col gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
        <div className="font-bold text-slate-800 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-blue-600" />
            <span>محتوى وتنسيق النصوص</span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
            فأرة فقط
          </span>
        </div>

        {/* Unified Formatting Toolbar for Selected Element */}
        <div className="pt-1">
          <SharedFormattingToolbar
            variant="compact"
            state={{
              fontFamily: selectedElement.fontFamily,
              fontSize: selectedElement.fontSize || 14,
              bold: selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === '700',
              italic: selectedElement.fontStyle === 'italic',
              underline: selectedElement.textDecoration?.includes('underline'),
              strike: selectedElement.textDecoration?.includes('line-through'),
              textAlign: selectedElement.textAlign || 'right',
              textColor: selectedElement.textColor || '#1e293b',
              backgroundColor: selectedElement.fillColor || 'transparent',
              direction: selectedElement.direction || 'rtl',
              lineHeight: selectedElement.lineHeight || 1.5,
            }}
            onChange={(updates) => {
              const patched: Partial<CanvasElement> = {};
              if (updates.fontFamily !== undefined) patched.fontFamily = updates.fontFamily;
              if (updates.fontSize !== undefined) patched.fontSize = updates.fontSize;
              if (updates.bold !== undefined) patched.fontWeight = updates.bold ? 'bold' : 'normal';
              if (updates.italic !== undefined) patched.fontStyle = updates.italic ? 'italic' : 'normal';
              if (updates.underline !== undefined) {
                patched.textDecoration = updates.underline ? 'underline' : 'none';
              }
              if (updates.strike !== undefined) {
                patched.textDecoration = updates.strike ? 'line-through' : 'none';
              }
              if (updates.textAlign !== undefined) {
                patched.textAlign = updates.textAlign === 'justify' ? 'left' : updates.textAlign;
              }
              if (updates.textColor !== undefined) patched.textColor = updates.textColor;
              if (updates.backgroundColor !== undefined) patched.fillColor = updates.backgroundColor;
              if (updates.direction !== undefined) patched.direction = updates.direction;
              if (updates.lineHeight !== undefined) patched.lineHeight = updates.lineHeight;
              onUpdateElement(patched);
            }}
          />
        </div>

        {/* Title or Primary Text */}
        <div className="flex flex-col gap-1 mt-1">
          <label className="text-[10px] font-bold text-slate-500">العنوان الرئيسي / النص</label>
          <input
            type="text"
            value={selectedElement.text || ''}
            onChange={(e) => onUpdateElement({ text: e.target.value })}
            placeholder="اكتب العنوان هنا..."
            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        {/* Callout Description */}
        {isCallout && (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">التفاصيل والشرح</label>
            <textarea
              rows={2}
              value={selectedElement.calloutDescription || ''}
              onChange={(e) => onUpdateElement({ calloutDescription: e.target.value })}
              placeholder="اكتب تفاصيل التوضيح هنا..."
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Callout Pointer Direction & Step Number */}
        {isCallout && (
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">اتجاه المؤشر</label>
              <select
                value={selectedElement.pointerDirection || 'bottom'}
                onChange={(e) => onUpdateElement({ pointerDirection: e.target.value as any })}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="bottom">👇 للأسفل</option>
                <option value="top">👆 للأعلى</option>
                <option value="right">👉 لليمين</option>
                <option value="left">👈 لليسار</option>
                <option value="none">🚫 بلا مؤشر</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">رقم الخطوة</label>
              <input
                type="number"
                min={1}
                max={99}
                value={selectedElement.stepNumber || ''}
                onChange={(e) => onUpdateElement({ stepNumber: parseInt(e.target.value, 10) || undefined })}
                placeholder="1"
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Connector & Line Routing Controls */}
        {isConnector && (
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-700">خصائص المسار والموصل</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'straight', label: 'مستقيم' },
                { id: 'orthogonal', label: 'قائم الزوايا' },
                { id: 'curved', label: 'منحنٍ' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onUpdateElement({ routing: r.id as any })}
                  className={`p-1.5 rounded-lg border text-[10px] font-bold transition cursor-pointer text-center ${
                    (selectedElement.routing || (selectedElement.type === 'connector' ? 'orthogonal' : 'straight')) === r.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedElement.arrowStart === true}
                  onChange={(e) => onUpdateElement({ arrowStart: e.target.checked })}
                  className="rounded text-blue-600 accent-blue-600"
                />
                <span>سهم في البداية</span>
              </label>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedElement.arrowEnd !== false}
                  onChange={(e) => onUpdateElement({ arrowEnd: e.target.checked })}
                  className="rounded text-blue-600 accent-blue-600"
                />
                <span>سهم في النهاية</span>
              </label>
            </div>

            <div className="flex flex-col gap-1 pt-1">
              <label className="text-[10px] font-bold text-slate-500">نص تسمية الموصل (Label)</label>
              <input
                type="text"
                value={selectedElement.label || ''}
                onChange={(e) => onUpdateElement({ label: e.target.value })}
                placeholder="تسمية توضيحية على المسار..."
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Appearance & Colors (الألوان والخلفيات) */}
      <div className="flex flex-col gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
        <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span>الألوان والمظهر الخارجي</span>
        </div>

        {/* Color Presets */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500">لوحة الألوان الجاهزة</label>
          <div className="grid grid-cols-8 gap-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onUpdateElement({ fillColor: c })}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-md border transition cursor-pointer ${
                  selectedElement.fillColor === c ? 'border-blue-600 scale-110 shadow-xs' : 'border-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Soft Gradients */}
        <div className="flex flex-col gap-1 pt-1 border-t border-slate-100">
          <label className="text-[10px] font-bold text-slate-500">تدرجات لونية ناعمة (SVG Gradients)</label>
          <div className="grid grid-cols-6 gap-1">
            {LIGHT_THEME_GRADIENTS.map((grad) => {
              const c1 = grad.stops[0]?.color || '#ffffff';
              const c2 = grad.stops[1]?.color || '#f1f5f9';
              const gradVal = `linear-gradient(135deg, ${c1}, ${c2})`;
              return (
                <button
                  key={grad.id}
                  type="button"
                  onClick={() => onUpdateElement({ fillColor: gradVal })}
                  title={grad.id}
                  style={{ background: gradVal }}
                  className={`h-5 rounded-md border transition cursor-pointer ${
                    selectedElement.fillColor === gradVal ? 'border-blue-600 scale-110 shadow-xs' : 'border-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Stroke Color & Width */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">لون الإطار</label>
            <input
              type="color"
              value={selectedElement.strokeColor || '#3b82f6'}
              onChange={(e) => onUpdateElement({ strokeColor: e.target.value })}
              className="w-full h-8 p-0.5 bg-white border border-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">سمك الإطار (px)</label>
            <input
              type="number"
              min={0}
              max={12}
              value={selectedElement.strokeWidth ?? 1}
              onChange={(e) => onUpdateElement({ strokeWidth: parseInt(e.target.value, 10) || 0 })}
              className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Border Radius & Opacity */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">انحناء الزوايا ({selectedElement.borderRadius || 12}px)</label>
            <input
              type="range"
              min={0}
              max={40}
              value={selectedElement.borderRadius || 12}
              onChange={(e) => onUpdateElement({ borderRadius: parseInt(e.target.value, 10) })}
              className="w-full cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">الشفافية ({Math.round((selectedElement.opacity ?? 1) * 100)}%)</label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={selectedElement.opacity ?? 1}
              onChange={(e) => onUpdateElement({ opacity: parseFloat(e.target.value) })}
              className="w-full cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* SVG Animation (الحركة والتحريك المتجه) */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200">
          <label className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
            <span>الحركة المتجهة (SVG Animation)</span>
            <span className="text-[9px] text-indigo-600 font-semibold">{selectedElement.animation || 'بدون'}</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SVG_ANIMATION_PRESETS.map((anim) => (
              <button
                key={anim.id}
                type="button"
                onClick={() => onUpdateElement({ animation: anim.id as any })}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                  (selectedElement.animation || 'none') === anim.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title={anim.nameAr}
              >
                {anim.nameAr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Custom HTML / Template Code Editor */}
      {(selectedElement.type === 'html-card' || selectedElement.type === 'web-frame' || selectedElement.htmlContent) && (
        <div className="flex flex-col gap-1.5 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-800 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>كود HTML / Tailwind المباشر</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">رندر حي</span>
          </div>
          <textarea
            rows={4}
            value={selectedElement.htmlContent || ''}
            onChange={(e) => onUpdateElement({ htmlContent: e.target.value })}
            placeholder="<div>...</div>"
            className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 outline-none focus:border-emerald-500"
          />
        </div>
      )}
    </div>
  );
};
