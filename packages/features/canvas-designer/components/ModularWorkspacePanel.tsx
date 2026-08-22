/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: لوحة العمليات المعيارية القابلة للترتيب وإعادة التسمية - Modular Workspace Panel
 * 🏛️ الدور: مكون مشترك - إدارة تبويبات اللوحات الجانبية القابلة للسحب
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Reorderable Tab System: نظام تبويبات قابل لإعادة الترتيب
 *    مع قائمة سياقية لإدارة اللوحات (تفعيل، إعادة تسمية، تحريك)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الترتيب يجب أن يتناسب مع المساحة المتاحة
 *    2. إعادة التسمية يجب أن تحافظ على التكرار
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الاسم قبل إعادة التسمية
 *    - fallback لاسم لوحة افتراضي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Layout,
  FolderTree,
  Code2,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Edit2,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  MoreVertical,
  Maximize2,
  Minimize2,
  Palette,
  Zap,
} from 'lucide-react';
import { SharedContextMenu, type ContextMenuItem } from '../../../shared/components/SharedContextMenu';
import { notificationEngine } from '../../../shared/engines/NotificationEngine';

export interface WorkspaceTabConfig {
  id: string;
  name: string;
  nameAr: string;
  iconName: string;
  visible: boolean;
  order: number;
}

export const DEFAULT_WORKSPACE_TABS: WorkspaceTabConfig[] = [
  { id: 'tools', name: 'Tools', nameAr: 'الأدوات الأساسية', iconName: 'Edit2', visible: true, order: 0 },
  { id: 'presets', name: 'Templates', nameAr: 'القوالب الجاهزة', iconName: 'Layout', visible: true, order: 1 },
  { id: 'components', name: 'Components', nameAr: 'المكونات والكتل', iconName: 'Sparkles', visible: true, order: 2 },
  { id: 'colors', name: 'Color Palette', nameAr: 'الألوان والباليتات', iconName: 'Palette', visible: true, order: 3 },
  { id: 'interactions', name: 'Interactions', nameAr: 'محرك التفاعل', iconName: 'Zap', visible: true, order: 4 },
  { id: 'layers', name: 'Layers', nameAr: 'الطبقات والمجموعات', iconName: 'FolderTree', visible: true, order: 5 },
  { id: 'code', name: 'Live Code', nameAr: 'الأكواد الحية (HTML/CSS)', iconName: 'Code2', visible: true, order: 6 },
  { id: 'assets', name: 'Asset Manager', nameAr: 'مدير الصور والأصول', iconName: 'ImageIcon', visible: true, order: 7 },
  { id: 'properties', name: 'Properties', nameAr: 'خصائص العنصر', iconName: 'Sliders', visible: true, order: 8 },
];

export interface ModularWorkspacePanelProps {
  tabs: WorkspaceTabConfig[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onReorderTabs: (sourceIndex: number, targetIndex: number) => void;
  onRenameTab: (tabId: string, newNameAr: string) => void;
  onToggleTabVisibility: (tabId: string) => void;
  onResetTabs: () => void;
}

export const ModularWorkspacePanelHeader: React.FC<ModularWorkspacePanelProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onReorderTabs,
  onRenameTab,
  onToggleTabVisibility,
  onResetTabs,
}) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Context Menu State for Panel Tabs
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    tab: WorkspaceTabConfig | null;
    tabIndex: number;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    tab: null,
    tabIndex: -1,
  });

  const sortedTabs = [...tabs].sort((a, b) => a.order - b.order);

  // معالجة النقر بالزر الأيمن على تبويب اللوحة
  const handleTabContextMenu = (e: React.MouseEvent, tab: WorkspaceTabConfig, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      tab,
      tabIndex: index,
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-3.5 h-3.5" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'FolderTree':
        return <FolderTree className="w-3.5 h-3.5" />;
      case 'Code2':
        return <Code2 className="w-3.5 h-3.5" />;
      case 'ImageIcon':
        return <ImageIcon className="w-3.5 h-3.5" />;
      case 'Palette':
        return <Palette className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Sliders':
      default:
        return <Sliders className="w-3.5 h-3.5" />;
    }
  };

  // عناصر القائمة السياقية بالزر الأيمن للتبويب
  const contextMenuItems: ContextMenuItem[] = contextMenu.tab
    ? [
        {
          id: 'tab-title',
          label: `اللوحة: ${contextMenu.tab.nameAr}`,
          disabled: true,
        },
        {
          id: 'rename-tab',
          label: 'إعادة تسمية اللوحة',
          icon: <Edit2 className="w-3.5 h-3.5 text-blue-600" />,
          onClick: () => {
            setEditingTabId(contextMenu.tab!.id);
            setEditingName(contextMenu.tab!.nameAr);
          },
        },
        {
          id: 'move-left',
          label: 'تحريك اللوحة يميناً / للأمام',
          icon: <ArrowRight className="w-3.5 h-3.5 text-slate-600" />,
          disabled: contextMenu.tabIndex <= 0,
          onClick: () => {
            onReorderTabs(contextMenu.tabIndex, contextMenu.tabIndex - 1);
            notificationEngine.info('تم تقديم موضع اللوحة');
          },
        },
        {
          id: 'move-right',
          label: 'تحريك اللوحة يساراً / للخلف',
          icon: <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />,
          disabled: contextMenu.tabIndex >= sortedTabs.length - 1,
          onClick: () => {
            onReorderTabs(contextMenu.tabIndex, contextMenu.tabIndex + 1);
            notificationEngine.info('تم تأخير موضع اللوحة');
          },
        },
        { id: 'sep-1', label: '', separator: true },
        {
          id: 'reset-tabs',
          label: 'استعادة الترتيب الافتراضي للوحات',
          icon: <Layout className="w-3.5 h-3.5 text-slate-600" />,
          onClick: () => {
            onResetTabs();
            notificationEngine.info('تمت استعادة الترتيب الافتراضي للوحات');
          },
        },
      ]
    : [];

  return (
    <div className="flex items-center border-b border-slate-200 bg-slate-50 p-1 gap-1 overflow-x-auto no-scrollbar select-none" dir="rtl">
      {sortedTabs.map((tab, idx) => {
        const isActive = activeTabId === tab.id;
        const isEditing = editingTabId === tab.id;

        return (
          <div
            key={tab.id}
            onContextMenu={(e) => handleTabContextMenu(e, tab, idx)}
            className="flex items-center"
          >
            {isEditing ? (
              <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-blue-400 shadow-xs">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="px-1.5 py-0.5 text-xs bg-white text-slate-800 focus:outline-none w-20"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editingName.trim()) {
                      onRenameTab(tab.id, editingName.trim());
                      setEditingTabId(null);
                      notificationEngine.success(`تمت إعادة التسمية إلى ${editingName.trim()}`);
                    }
                    if (e.key === 'Escape') setEditingTabId(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (editingName.trim()) {
                      onRenameTab(tab.id, editingName.trim());
                      setEditingTabId(null);
                    }
                  }}
                  className="p-0.5 text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTabId(null)}
                  className="p-0.5 text-slate-400 hover:bg-slate-100 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab(tab.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingTabId(tab.id);
                  setEditingName(tab.nameAr);
                }}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-md transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title={`${tab.nameAr} (انقر بالزر الأيمن للخيارات أو نقراً مزدوجاً لإعادة التسمية)`}
              >
                {getIcon(tab.iconName)}
                <span className="truncate">{tab.nameAr}</span>
              </button>
            )}
          </div>
        );
      })}

      {/* Shared Context Menu for Workspace Tabs (Right Click functionality) */}
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
