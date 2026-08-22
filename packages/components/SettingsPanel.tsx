/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكون لوحة الإعدادات وتخصيص الواجهة الديناميكية - Settings Panel
 * 🏛️ الدور: مكون مشترك - إظهار/إخفاء المكونات وتعديل مواقعها وتخصيص الخطوط
 * 📥 المستهلك: Workbench
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dynamic Movable Settings Panel: لوحة إعدادات ديناميكية قابلة للسحب
 *    مع قراءة من ComponentMatrix و UiPreferencesService
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التغييرات يجب أن تُطبَّق فوراً
 *    2. السحب يجب أن يكون سلساً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة المكون قبل التعديل
 *    - fallback لحالة افتراضية
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Move,
  Settings,
  Layout,
  Maximize2,
  Type,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Sliders,
  Palette,
  Smartphone,
  FileText,
  FileCheck,
  Shapes,
  Activity,
  MousePointerClick,
  Check,
  Layers,
  Monitor,
} from 'lucide-react';
import {
  ComponentMatrix,
  type UIComponentRegistration,
  type UIPosition,
  type UIComponentCategory,
} from '../lib/component-registry';
import {
  UiPreferencesService,
  AVAILABLE_FONTS,
  ICON_SIZES,
  type UiPreferences,
  type IconSizeMode,
} from '../core/services/UiPreferencesService';
import { UiIcon } from '../shared/components/UiIcon';
import { useTabs } from '../app/providers';

export interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'matrix' | 'appearance' | 'studios';

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('matrix');
  const [components, setComponents] = useState<UIComponentRegistration[]>(() =>
    ComponentMatrix.getAllComponents()
  );
  const [prefs, setPrefs] = useState<UiPreferences>(() =>
    UiPreferencesService.getPreferences()
  );

  const { activeDocument, createDocument, openDocuments } = useTabs();

  // Dynamic Movable Panel (Mouse Drag) State
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  // Subscribe to ComponentMatrix & UiPreferences
  useEffect(() => {
    const unsubMatrix = ComponentMatrix.subscribe((matrix) => {
      setComponents(matrix.getAllComponents());
    });
    const unsubPrefs = UiPreferencesService.subscribe((updated) => {
      setPrefs(updated);
    });

    return () => {
      unsubMatrix();
      unsubPrefs();
    };
  }, []);

  // Center modal initially upon open
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        const modalWidth = Math.min(720, window.innerWidth - 32);
        const modalHeight = Math.min(620, window.innerHeight - 32);
        const initialX = Math.max(16, (window.innerWidth - modalWidth) / 2);
        const initialY = Math.max(16, (window.innerHeight - modalHeight) / 2);
        setPosition({ x: initialX, y: initialY });
      }
    }
  }, [isOpen]);

  // Mouse Drag Logic
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only drag from header surface, not buttons/inputs
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('select')) {
        return;
      }
      setIsDragging(true);
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPosX: position.x,
        initialPosY: position.y,
      };
    },
    [position]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const newX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.initialPosX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, dragStartRef.current.initialPosY + dy));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  const handleToggleVisibility = (id: string, currentVisible: boolean) => {
    const next = !currentVisible;
    ComponentMatrix.setComponentVisibility(id, next);

    // Sync corresponding shell preferences if mapped
    if (id === 'statusBar') {
      UiPreferencesService.updatePreferences({ showStatusBar: next });
    } else if (id === 'contextRibbon') {
      UiPreferencesService.updatePreferences({ showContextRibbon: next });
    } else if (id === 'documentRuler') {
      UiPreferencesService.updatePreferences({ showRulers: next });
    }
  };

  const handlePositionChange = (id: string, newPos: UIPosition) => {
    ComponentMatrix.setComponentPosition(id, newPos);
  };

  const handleResetAll = () => {
    ComponentMatrix.resetToDefaults();
    UiPreferencesService.resetDefaults();
  };

  const categoryLabels: Record<UIComponentCategory, string> = {
    shell: 'مكونات الهيكل والواجهة الأساسية (Shell)',
    'canvas-designer': 'استوديو الكانفا والفيكتور',
    'ui-designer': 'استوديو مصمم الواجهات',
    'rich-text': 'استوديو المستندات الغنية',
    pdf: 'استوديو مستندات PDF',
    'shared-modal': 'النوافذ والأدوات العائمة المتقدمة',
    tooling: 'أدوات مساعدة وقوائم',
  };

  const positionLabels: Record<UIPosition, string> = {
    'top-bar': 'الشريط العلوي (Top)',
    'right-sidebar': 'الشريط الجانبي الأيمن (Right)',
    'left-sidebar': 'الشريط الجانبي الأيسر (Left)',
    'bottom-bar': 'الشريط السفلي (Bottom)',
    'canvas-center': 'مركز مساحة العمل (Center)',
    'modal-overlay': 'نافذة منبثقة (Modal)',
    'context-menu': 'قائمة سياقية (Context)',
    'floating-dock': 'رصيف عائم (Floating)',
  };

  return (
    <div
      id="settings-panel-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-xs select-none"
      dir="rtl"
    >
      <div
        id="settings-panel-container"
        className="fixed bg-white rounded-2xl shadow-2xl border border-slate-200 w-[92vw] sm:w-[680px] max-h-[85vh] flex flex-col overflow-hidden text-slate-800 text-xs transition-shadow"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        {/* ── Header (Movable Drag Handle) ── */}
        <div
          onMouseDown={handleMouseDown}
          className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/90 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <UiIcon icon={Settings} size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  لوحة الإعدادات ومصفوفة المكونات
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <Move size={10} />
                  <span>قابلة للسحب بالفأرة</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                إدارة رؤية المكونات، وتخصيص الواجهة بالثيم الفاتح النقي 100%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              title="إغلاق لوحة الإعدادات (Escape)"
            >
              <UiIcon icon={X} size={18} />
            </button>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <UiIcon icon={Layout} size={14} />
            <span>مصفوفة المكونات والرؤية ({components.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <UiIcon icon={Palette} size={14} />
            <span>التفضيلات العامة والمظهر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('studios')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'studios'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <UiIcon icon={Monitor} size={14} />
            <span>المحررات والمتصفح</span>
          </button>
        </div>

        {/* ── Body Content ── */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 max-h-[calc(85vh-120px)]">
          {/* TAB 1: Component Matrix & Visibility */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Sparkles size={16} className="text-blue-600" />
                  <span>المصدر الموثوق لهيكلية الواجهة (`ComponentMatrix`)</span>
                </div>
                <span className="text-[11px] text-blue-700 font-bold">
                  {components.filter((c) => c.isVisible).length} / {components.length} مكون مرئي
                </span>
              </div>

              <div className="space-y-3">
                {components.map((comp) => (
                  <div
                    key={comp.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                      comp.isVisible
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50/80 border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          comp.isVisible
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        <Layers size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs">{comp.nameAr}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {comp.id}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {categoryLabels[comp.category]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {comp.descriptionAr}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                          <span>المسار: {comp.filePath}</span>
                          {comp.supportedInteractions.keyboardShortcut && (
                            <span className="text-blue-600 bg-blue-50 px-1 rounded">
                              {comp.supportedInteractions.keyboardShortcut}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Visibility Toggle + Position */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {comp.settingsConfig.allowPositionChange && (
                        <select
                          value={comp.currentPosition}
                          onChange={(e) => handlePositionChange(comp.id, e.target.value as UIPosition)}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 font-sans cursor-pointer focus:outline-none focus:border-blue-500"
                        >
                          <option value="top-bar">أعلى</option>
                          <option value="right-sidebar">يمين</option>
                          <option value="left-sidebar">يسار</option>
                          <option value="bottom-bar">أسفل</option>
                        </select>
                      )}

                      {comp.settingsConfig.allowToggleVisibility ? (
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(comp.id, comp.isVisible)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                            comp.isVisible
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {comp.isVisible ? (
                            <>
                              <Eye size={13} />
                              <span>مرئي</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={13} />
                              <span>مخفي</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded font-bold">
                          إلزامي للنظام
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: General UI & Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              {/* Icon Size */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Maximize2 size={16} className="text-blue-600" />
                    <span>حجم الأيقونات العام في البرنامج</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {prefs.iconSizePx}px
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(ICON_SIZES) as IconSizeMode[]).map((mode) => {
                    const isSelected = prefs.iconSize === mode;
                    const cfg = ICON_SIZES[mode];
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => UiPreferencesService.updatePreferences({ iconSize: mode })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-bold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Sparkles style={{ width: `${cfg.px}px`, height: `${cfg.px}px` }} className="text-blue-600" />
                        <span className="text-[11px]">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Font Family */}
              <section className="space-y-2">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Type size={16} className="text-blue-600" />
                  <span>الخط العربي واللاتيني المعتمد للواجهة</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_FONTS.map((font) => {
                    const isSelected = prefs.fontFamily === font.fontStack;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => UiPreferencesService.updatePreferences({ fontFamily: font.fontStack })}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer text-right ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                        style={{ fontFamily: font.fontStack }}
                      >
                        <span className="text-xs font-bold">{font.nameAr}</span>
                        {isSelected && <Check size={14} className="text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Interface Font Size */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Sliders size={16} className="text-blue-600" />
                    <span>مقياس خطوط النصوص والواجهة</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {prefs.fontSize}px
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[11, 12, 13, 14, 15, 16].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => UiPreferencesService.updatePreferences({ fontSize: sz })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        prefs.fontSize === sz
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sz}px {sz === 13 ? '(الموصى به)' : ''}
                    </button>
                  ))}
                </div>
              </section>

              {/* Theme Lock Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-xs">نظام الثيم المعتمد:</span>
                  <span className="text-xs">الثيم الفاتح النقي 100% (Pure Light Theme)</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  WCAG AA Compliant
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: Studios & Browser Tabs */}
          {activeTab === 'studios' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                التبديل الفوري بين الاستوديوهات الأربعة وإنشاء مستندات جديدة:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    createDocument('canvas', 'رسم فيكتوري جديد');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-white text-right transition cursor-pointer group flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                    <Palette size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">استوديو الكانفا والفيكتور</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      رسم المتجهات، والطبقات، والمنحنيات، وفلاتر الصور
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    createDocument('ui-designer', 'واجهة مستخدم جديدة');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-white text-right transition cursor-pointer group flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">استوديو مصمم الواجهات</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      تصميم نماذج UI تفاعلية ومعاينة أبعاد الأجهزة
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    createDocument('rich-text', 'مستند نصوص جديد');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-white text-right transition cursor-pointer group flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">استوديو المستندات الغنية</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      مستندات معالج النصوص، والجداول، وأشرطة أوفيس
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    createDocument('pdf', 'مستند PDF جديد');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-white text-right transition cursor-pointer group flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                    <FileCheck size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">استوديو مستندات PDF</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      قراءة وتظليل وتدوير واستخراج صفحات PDF
                    </div>
                  </div>
                </button>
              </div>

              {/* Open Tabs Overview */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="font-bold text-xs text-slate-800 mb-2">
                  المستندات المفتوحة حالياً في المتصفح ({openDocuments.length}):
                </div>
                <div className="space-y-1.5">
                  {openDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between ${
                        doc.id === activeDocument?.id
                          ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{doc.title}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{doc.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/90">
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition cursor-pointer text-xs font-bold"
          >
            <RotateCcw size={14} />
            <span>استعادة الضبط الافتراضي للمصفوفة</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <span>حفظ وإغلاق</span>
          </button>
        </div>
      </div>
    </div>
  );
}
