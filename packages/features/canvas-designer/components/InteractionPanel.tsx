/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: لوحة برمجة التفاعلات الميكانيكية والأحداث بدون كود - Interaction Panel
 * 🏛️ الدور: مكون مشترك - ربط العناصر بأحداث النقر والتمرير والتنقل
 * 📥 المستهلك: CanvasDesignerEditor, CanvasSidebar
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Codeless Interaction Triggers: مشغلات تفاعلية بدون كود
 *    مع أنيميشن ومؤثرات صوتية فورية عبر Web Audio API
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأحداث يجب أن تتناسب مع نوع العنصر
 *    2. التأثيرات الصوتية يجب ألا تتداخل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الحدث قبل الإضافة
 *    - fallback لعدم تأثير
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Play,
  Volume2,
  Link,
  Eye,
  MousePointer,
  ArrowDownCircle,
  Sparkles,
  MessageSquare,
  Palette,
  CheckCircle2,
  Copy,
  AlertCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';
import type {
  CanvasElement,
  ElementInteraction,
  InteractionTrigger,
  InteractionAction,
} from '../model';
import { executeInteractionTrigger, playSyntheticAudioFeedback } from '../core/interactionEngine';
import {
  SharedContextMenu,
  type ContextMenuItem,
} from '../../../shared/components/SharedContextMenu';
import { notificationEngine } from '../../../shared/engines/NotificationEngine';

interface InteractionPanelProps {
  selectedElement: CanvasElement | null;
  allElements: CanvasElement[];
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  zoom?: number;
}

export const InteractionPanel: React.FC<InteractionPanelProps> = ({
  selectedElement,
  allElements,
  onUpdateElement,
  containerRef,
  zoom = 1,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    interactionId?: string;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const [activeNewAction, setActiveNewAction] = useState<InteractionAction>('scrollToElement');
  const [activeNewTrigger, setActiveNewTrigger] = useState<InteractionTrigger>('onClick');

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 min-h-[300px]">
        <Zap className="w-10 h-10 mb-3 text-slate-300 stroke-1" />
        <p className="text-sm font-medium text-slate-600">
          حدد عنصراً لبرمجة تفاعلاته وأحداثه الميكانيكية
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
          يمكنك ربط العناصر بالتمرير، فتح الروابط، تشغيل الأنيميشن، أو التنبيهات الصوتية.
        </p>
      </div>
    );
  }

  const interactions = selectedElement.interactions || [];

  const handleAddInteraction = () => {
    const defaultTarget = allElements.find((el) => el.id !== selectedElement.id)?.id;
    const newInteraction: ElementInteraction = {
      id: `act-${Date.now()}`,
      trigger: activeNewTrigger,
      action: activeNewAction,
      targetElementId: defaultTarget,
      url: activeNewAction === 'openUrl' ? 'https://example.com' : undefined,
      targetTab: '_blank',
      animationType: 'bounce',
      soundType: 'click',
      popupMessage: 'تم تفعيل التفاعل الميكانيكي بنجاح!',
      colorValue: '#3b82f6',
      scrollOffset: 50,
      delayMs: 0,
      enabled: true,
      label: '',
    };

    const updated = [...interactions, newInteraction];
    onUpdateElement(selectedElement.id, { interactions: updated });
    notificationEngine.success('تمت إضافة تفاعل ميكانيكي جديد للعنصر');
  };

  const handleUpdateInteraction = (id: string, updates: Partial<ElementInteraction>) => {
    const updated = interactions.map((item) => (item.id === id ? { ...item, ...updates } : item));
    onUpdateElement(selectedElement.id, { interactions: updated });
  };

  const handleDeleteInteraction = (id: string) => {
    const updated = interactions.filter((item) => item.id !== id);
    onUpdateElement(selectedElement.id, { interactions: updated });
    notificationEngine.info('تم حذف التفاعل');
  };

  const handleTestInteraction = (interaction: ElementInteraction) => {
    executeInteractionTrigger(interaction, allElements, {
      containerEl: containerRef?.current,
      zoom,
      onNotify: (msg, type) => {
        if (type === 'success') notificationEngine.success(msg);
        else if (type === 'warning') notificationEngine.warning(msg);
        else notificationEngine.info(msg);
      },
      onUpdateElement,
    });
  };

  // القائمة السياقية بالزر الأيمن
  const handleContextMenu = (e: React.MouseEvent, interactionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      interactionId,
    });
  };

  const targetInteraction = interactions.find((it) => it.id === contextMenu.interactionId);

  const contextMenuItems: ContextMenuItem[] = targetInteraction
    ? [
        {
          id: 'test-now',
          label: 'تشغيل واختبار التفاعل الآن (Test Trigger)',
          icon: <Play className="w-3.5 h-3.5 text-emerald-600" />,
          onClick: () => handleTestInteraction(targetInteraction),
        },
        {
          id: 'toggle-enabled',
          label: targetInteraction.enabled ? 'تعطيل التفاعل مؤقتاً' : 'تفعيل التفاعل',
          icon: targetInteraction.enabled ? (
            <ToggleLeft className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ToggleRight className="w-3.5 h-3.5 text-blue-600" />
          ),
          onClick: () =>
            handleUpdateInteraction(targetInteraction.id, { enabled: !targetInteraction.enabled }),
        },
        {
          id: 'dup-interaction',
          label: 'تكرار هذا التفاعل (Duplicate)',
          icon: <Copy className="w-3.5 h-3.5 text-blue-600" />,
          onClick: () => {
            const clone: ElementInteraction = {
              ...targetInteraction,
              id: `act-${Date.now()}`,
              label: `${targetInteraction.label || 'تفاعل'} (نسخة)`,
            };
            onUpdateElement(selectedElement.id, {
              interactions: [...interactions, clone],
            });
            notificationEngine.success('تم تكرار التفاعل');
          },
        },
        { id: 'sep-1', label: '', separator: true },
        {
          id: 'delete-interaction',
          label: 'حذف التفاعل (Delete)',
          icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
          danger: true,
          onClick: () => handleDeleteInteraction(targetInteraction.id),
        },
      ]
    : [];

  const otherElements = allElements.filter((el) => el.id !== selectedElement.id);

  return (
    <div
      className="flex flex-col h-full bg-white text-slate-800 text-xs"
      style={{ direction: 'rtl' }}
    >
      {/* ترويسة اللوحة */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-xs">
              محرك التفاعل الميكانيكي والأحداث
            </h3>
            <p className="text-[10px] text-slate-500">
              العنصر المحدد: {selectedElement.text || selectedElement.type} ({selectedElement.id})
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] border border-blue-200">
          {interactions.length} تفاعلات
        </span>
      </div>

      {/* قائمة التفاعلات المبرمجة */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {interactions.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-medium text-slate-700 text-xs">
              لا توجد تفاعلات ميكانيكية مبرمجة بعد
            </p>
            <p className="text-[11px] text-slate-500 mt-1 mb-3">
              اختر نوع الحدث والإجراء في الأسفل لإضافة تفاعل فوري.
            </p>
          </div>
        ) : (
          interactions.map((it, idx) => (
            <div
              key={it.id}
              onContextMenu={(e) => handleContextMenu(e, it.id)}
              className={`border rounded-xl p-3 transition-all ${
                it.enabled
                  ? 'bg-white border-slate-200 shadow-sm hover:border-blue-300'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              {/* رأس بطاقة التفاعل */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {it.trigger === 'onClick' && '🖱️ عند النقر (Click)'}
                    {it.trigger === 'onMouseEnter' && '👁️ عند تمرير الفأرة (Hover)'}
                    {it.trigger === 'onMouseLeave' && '👋 عند مغادرة الفأرة (Leave)'}
                    {it.trigger === 'onScrollIntoView' && '📜 عند التمرير والظهور (Scroll)'}
                    {it.trigger === 'onDoubleClick' && '⚡ نقر مزدوج (Double Click)'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTestInteraction(it)}
                    className="p-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1 text-[10px] font-medium"
                    title="تجربة التفاعل الآن"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>تجربة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateInteraction(it.id, { enabled: !it.enabled })}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title={it.enabled ? 'تعطيل' : 'تفعيل'}
                  >
                    {it.enabled ? (
                      <ToggleRight className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInteraction(it.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* تفاصيل التفاعل والإعدادات */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      حدث الإطلاق (Trigger)
                    </label>
                    <select
                      value={it.trigger}
                      onChange={(e) =>
                        handleUpdateInteraction(it.id, {
                          trigger: e.target.value as InteractionTrigger,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="onClick">عند النقر (Click)</option>
                      <option value="onMouseEnter">عند تمرير الفأرة (Hover)</option>
                      <option value="onMouseLeave">عند مغادرة الفأرة (Leave)</option>
                      <option value="onScrollIntoView">عند التمرير للرؤية (Scroll)</option>
                      <option value="onDoubleClick">نقر مزدوج (Double Click)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      الإجراء الميكانيكي (Action)
                    </label>
                    <select
                      value={it.action}
                      onChange={(e) =>
                        handleUpdateInteraction(it.id, {
                          action: e.target.value as InteractionAction,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="scrollToElement">تمرير إلى عنصر (Scroll To)</option>
                      <option value="openUrl">فتح رابط ويب (Open URL)</option>
                      <option value="toggleVisibility">تبديل الرؤية (Toggle View)</option>
                      <option value="triggerAnimation">تشغيل أنيميشن (Animation)</option>
                      <option value="playSound">تشغيل مؤثر صوتي (Sound)</option>
                      <option value="showPopup">إظهار نافذة منبثقة (Popup)</option>
                      <option value="changeColor">تغيير لون العنصر (Change Color)</option>
                    </select>
                  </div>
                </div>

                {/* حقول مخصصة حسب الإجراء */}
                {it.action === 'scrollToElement' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      العنصر المستهدف للتمرير
                    </label>
                    <select
                      value={it.targetElementId || ''}
                      onChange={(e) =>
                        handleUpdateInteraction(it.id, { targetElementId: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="">-- اختر العنصر المستهدف --</option>
                      {otherElements.map((el) => (
                        <option key={el.id} value={el.id}>
                          {el.text ? `"${el.text.slice(0, 20)}"` : el.type} (X: {el.x}, Y: {el.y})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {it.action === 'openUrl' && (
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      عنوان الرابط (URL)
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={it.url || ''}
                        onChange={(e) => handleUpdateInteraction(it.id, { url: e.target.value })}
                        placeholder="https://example.com"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                      <select
                        value={it.targetTab || '_blank'}
                        onChange={(e) =>
                          handleUpdateInteraction(it.id, {
                            targetTab: e.target.value as '_blank' | '_self',
                          })
                        }
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="_blank">نافذة جديدة</option>
                        <option value="_self">نفس الصفحة</option>
                      </select>
                    </div>
                  </div>
                )}

                {it.action === 'toggleVisibility' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      العنصر المراد إظهاره/إخفاؤه
                    </label>
                    <select
                      value={it.targetElementId || ''}
                      onChange={(e) =>
                        handleUpdateInteraction(it.id, { targetElementId: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="">-- اختر العنصر --</option>
                      {otherElements.map((el) => (
                        <option key={el.id} value={el.id}>
                          {el.text ? `"${el.text.slice(0, 20)}"` : el.type} (حالي:{' '}
                          {el.visible === false ? 'مخفي' : 'مرئي'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {it.action === 'triggerAnimation' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        العنصر المستهدف
                      </label>
                      <select
                        value={it.targetElementId || selectedElement.id}
                        onChange={(e) =>
                          handleUpdateInteraction(it.id, { targetElementId: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      >
                        <option value={selectedElement.id}>العنصر الحالي نفسه</option>
                        {otherElements.map((el) => (
                          <option key={el.id} value={el.id}>
                            {el.text ? `"${el.text.slice(0, 15)}"` : el.type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        نوع التحريك (Animation)
                      </label>
                      <select
                        value={it.animationType || 'bounce'}
                        onChange={(e) =>
                          handleUpdateInteraction(it.id, { animationType: e.target.value as any })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="bounce">قفز ارتدادي (Bounce)</option>
                        <option value="pulse">نبض ضوئي (Pulse)</option>
                        <option value="spin">دوران دائري (Spin)</option>
                        <option value="fade-in">ظهور تدريجي (Fade In)</option>
                        <option value="shake">اهتزاز تنبيهي (Shake)</option>
                      </select>
                    </div>
                  </div>
                )}

                {it.action === 'playSound' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      نوع النغمة التفاعلية (Web Audio)
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={it.soundType || 'click'}
                        onChange={(e) =>
                          handleUpdateInteraction(it.id, { soundType: e.target.value as any })
                        }
                        className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="click">نقرة ميكانيكية (Click)</option>
                        <option value="pop">فرقعة ناعمة (Pop)</option>
                        <option value="success">نغمة نجاح ثلاثية (Success)</option>
                        <option value="chime">رنين هادئ (Chime)</option>
                        <option value="laser">تأثير ليزر رقمي (Laser)</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => playSyntheticAudioFeedback(it.soundType || 'click')}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[10px]"
                      >
                        <Volume2 className="w-3 h-3 text-blue-600" />
                        <span>استماع</span>
                      </button>
                    </div>
                  </div>
                )}

                {it.action === 'showPopup' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      نص الرسالة المنبثقة
                    </label>
                    <input
                      type="text"
                      value={it.popupMessage || ''}
                      onChange={(e) =>
                        handleUpdateInteraction(it.id, { popupMessage: e.target.value })
                      }
                      placeholder="رسالة التنبيه..."
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* قسم إضافة تفاعل جديد */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-2">
        <div className="text-[11px] font-medium text-slate-700 flex items-center justify-between">
          <span>إضافة تفاعل جديد:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={activeNewTrigger}
            onChange={(e) => setActiveNewTrigger(e.target.value as InteractionTrigger)}
            className="bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700"
          >
            <option value="onClick">عند النقر (Click)</option>
            <option value="onMouseEnter">عند تمرير الفأرة (Hover)</option>
            <option value="onScrollIntoView">عند التمرير (Scroll)</option>
            <option value="onDoubleClick">نقر مزدوج (Double Click)</option>
          </select>

          <select
            value={activeNewAction}
            onChange={(e) => setActiveNewAction(e.target.value as InteractionAction)}
            className="bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700"
          >
            <option value="scrollToElement">تمرير إلى عنصر</option>
            <option value="openUrl">فتح رابط</option>
            <option value="toggleVisibility">تبديل الرؤية</option>
            <option value="triggerAnimation">تشغيل أنيميشن</option>
            <option value="playSound">تنبيه صوتي</option>
            <option value="showPopup">نافذة منبثقة</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddInteraction}
          className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة التفاعل الميكانيكي إلى العنصر</span>
        </button>
      </div>

      {/* القائمة السياقية بالزر الأيمن */}
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
