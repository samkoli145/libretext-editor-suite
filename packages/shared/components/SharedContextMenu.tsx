/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: SharedContextMenu.tsx
 * 📂 المسار: packages/shared/components/SharedContextMenu.tsx
 * 🎯 الهدف الرئيسي: مكون React أصيل عالي الجودة للقوائم السياقية (Context Menu) بالثيم الفاتح والتفاعل بالماوس
 * 📋 المعايير: Pure Light Theme, Zero-Dark-Mode, Mouse-Driven, Fully-Typed Contract
 * 🧪 الاختبارات: tests/components/SharedContextMenu.test.tsx
 * 🏷️ المعرف: SHARED-CMP-001
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unified Headless Item Contract + Pure Light Daylight Surface + Viewport Boundary Clamping
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع أي ألوان أو خلفيات داكنة (Pure Daylight Canvas: bg-white / bg-slate-50)
 *    2. احترام حالة التعطيل (disabled) وحالة الخطر (danger)
 *    3. إغلاق القائمة تلقائياً عند النقر بالخارج أو اختيار عنصر فعال
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية الإحداثيات من الخروج خارج نافذة العرض (Viewport Clamping)
 *    - تصفية العناصر غير المرئية (visible !== false)
 *    - عدم تنفيذ action للعناصر المعطلة (disabled)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/shared/index.ts
 *    - 📦 التبعيات: packages/core/src/engines/context-menu-engine.ts, lucide-react
 *    - 📄 مرتبط مباشر: packages/shared/hooks/useContextMenu.ts, packages/features/canvas-designer/CanvasDesignerPlugin.tsx
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - renderIcon: رسم أيقونة Lucide المناسبة حسب الاسم (#L80)
 *    - clampCoordinates: ضبط موضع القائمة لمنع تدفقها خارج الشاشة (#L110)
 *    - SharedContextMenu: المكون الرئيسي لعرض القائمة السياقية (#L135)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم توحيد عقد ContextMenuItem بالكامل مع @libretext/core
 *    - الواجهة تعتمد 100% على التفاعل بالماوس وفق قواعد AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useMemo } from 'react';
import type { ContextMenuItem } from '@libretext/core';
import {
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Maximize2,
  RotateCcw,
  Copy,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type { ContextMenuItem };

export interface SharedContextMenuProps {
  /** حالة فتح القائمة */
  isOpen: boolean;
  /** موضع X بالبكسل */
  x: number;
  /** موضع Y بالبكسل */
  y: number;
  /** عناصر القائمة السياقية */
  items?: readonly ContextMenuItem[];
  /** عنوان أو رأس اختياري */
  title?: React.ReactNode;
  /** دالة تُستدعى عند طلب إغلاق القائمة */
  onClose: () => void;
  /** اسم فئة إضافي لتخصيص الحاوية */
  className?: string;
}

/**
 * دالة مساعدة لرسم الأيقونة بناءً على اسمها النصي
 */
function renderIcon(iconName?: string) {
  if (!iconName) return null;

  const normalized = iconName.toLowerCase().replace(/[-_]/g, '');

  switch (normalized) {
    case 'lock':
      return <Lock className="w-3.5 h-3.5 text-slate-500" />;
    case 'unlock':
      return <Unlock className="w-3.5 h-3.5 text-slate-500" />;
    case 'arrowup':
    case 'bringtofront':
      return <ArrowUp className="w-3.5 h-3.5 text-slate-500" />;
    case 'arrowdown':
    case 'sendtoback':
      return <ArrowDown className="w-3.5 h-3.5 text-slate-500" />;
    case 'maximize2':
    case 'resetsize':
      return <Maximize2 className="w-3.5 h-3.5 text-slate-500" />;
    case 'rotateccw':
    case 'resetstyle':
      return <RotateCcw className="w-3.5 h-3.5 text-slate-500" />;
    case 'copy':
    case 'duplicate':
      return <Copy className="w-3.5 h-3.5 text-slate-500" />;
    case 'trash2':
    case 'trash':
    case 'delete':
      return <Trash2 className="w-3.5 h-3.5 text-rose-500" />;
    case 'edit2':
    case 'edit':
    case 'rename':
      return <Edit2 className="w-3.5 h-3.5 text-blue-500" />;
    case 'check':
      return <Check className="w-3.5 h-3.5 text-emerald-500" />;
    default:
      return <Sparkles className="w-3.5 h-3.5 text-slate-400" />;
  }
}

/**
 * المكون الرئيسي للقائمة السياقية المشتركة
 */
export const SharedContextMenu: React.FC<SharedContextMenuProps> = ({
  isOpen,
  x,
  y,
  items = [],
  title,
  onClose,
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر بالماوس في أي مكان خارجها
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    window.addEventListener('mousedown', handlePointerDownOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDownOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  // حساب موضع العرض مع حماية الحواف (Screen Edge Clamping)
  const adjustedPosition = useMemo(() => {
    if (typeof window === 'undefined') return { left: x, top: y };

    const menuWidth = 220;
    const menuHeight = Math.max(items.length * 36 + 40, 100);

    const maxX = window.innerWidth - menuWidth - 12;
    const maxY = window.innerHeight - menuHeight - 12;

    return {
      left: Math.max(12, Math.min(x, maxX)),
      top: Math.max(12, Math.min(y, maxY)),
    };
  }, [x, y, items.length]);

  if (!isOpen || !items || items.length === 0) {
    return null;
  }

  // تصفية العناصر المرئية فقط
  const visibleItems = items.filter((item) => item.visible !== false);

  return (
    <div
      ref={menuRef}
      id="shared-context-menu-container"
      role="menu"
      aria-orientation="vertical"
      className={`fixed z-50 min-w-[200px] max-w-[280px] bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/5 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100 select-none ${className}`}
      style={{
        left: `${adjustedPosition.left}px`,
        top: `${adjustedPosition.top}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* رأس أو عنوان اختياري */}
      {title && (
        <div className="px-3 py-1.5 mb-1 border-b border-slate-100 text-[11px] font-medium text-slate-400">
          {title}
        </div>
      )}

      {/* قائمة العناصر */}
      <div className="space-y-0.5 px-1">
        {visibleItems.map((item, idx) => {
          if (item.separator) {
            return (
              <div
                key={item.id || `sep-${idx}`}
                className="my-1 border-t border-slate-100"
                role="separator"
              />
            );
          }

          const isDisabled = !!item.disabled;
          const isDanger = !!item.danger;

          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isDisabled) return;
                onClose();
                item.action?.();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-start transition-colors duration-75 ${
                isDisabled
                  ? 'text-slate-300 cursor-not-allowed'
                  : isDanger
                    ? 'text-rose-600 hover:bg-rose-50 active:bg-rose-100 cursor-pointer'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {renderIcon(item.icon)}
                <span className="truncate font-medium text-xs">{item.labelAr || item.label}</span>
              </div>

              {/* حالة الاختيار أو الاختصار إن وجد */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.checked && <Check className="w-3.5 h-3.5 text-blue-600" />}
                {item.shortcut && (
                  <span className="text-[10px] text-slate-400 font-mono">{item.shortcut}</span>
                )}
                {item.children && item.children.length > 0 && (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
