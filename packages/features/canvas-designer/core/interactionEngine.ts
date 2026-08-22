/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التفاعل الميكانيكي وبرمجة الأحداث ومزامنة الإحداثيات - Interaction Engine
 * 🏛️ الدور: محرك مشترك - ربط العناصر بأحداث النقر والتمرير والتنقل
 * 📥 المستهلك: CanvasDesignerEditor, ElementRenderer
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Mechanical Interaction Engine: محرك تفاعلي ميكانيكي
 *    مع Web Audio API مباشرة (صفر مكتبات صوتية) لمزامنة الإحداثيات اللحظية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Web Audio API قد لا يعمل في بعض المتصفحات
 *    2. الإحداثيات يجب مزامنتها بشكل لحظي
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص AudioContext قبل الإنشاء
 *    - fallback لصمت عند خطأ الصوت
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CanvasElement, ElementInteraction, InteractionTrigger, InteractionAction } from '../model';

export interface InteractionLinkGeometry {
  interactionId: string;
  sourceId: string;
  sourceType: string;
  targetId: string;
  targetType: string;
  trigger: InteractionTrigger;
  action: InteractionAction;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
  label: string;
  color: string;
}

/**
 * توليد نغمة صوتية تفاعلية فورية باستخدام Web Audio API (Zero External Files)
 */
export function playSyntheticAudioFeedback(soundType: 'click' | 'pop' | 'success' | 'chime' | 'laser' = 'click') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (soundType) {
      case 'click':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'pop':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.24); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'chime':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'laser':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
    }
  } catch (err) {
    console.warn('Web Audio Feedback not permitted or active', err);
  }
}

/**
 * حساب إحداثيات ومسارات خطوط الربط التفاعلي بين العناصر (Real-time Interaction Link Curves)
 */
export function calculateInteractionLinks(
  elements: CanvasElement[],
  activeSelectedId?: string | null
): InteractionLinkGeometry[] {
  const links: InteractionLinkGeometry[] = [];
  const elMap = new Map<string, CanvasElement>();
  elements.forEach((el) => elMap.set(el.id, el));

  elements.forEach((sourceEl) => {
    if (!sourceEl.interactions || sourceEl.interactions.length === 0) return;

    sourceEl.interactions.forEach((interaction) => {
      if (!interaction.enabled) return;
      if (!interaction.targetElementId) return;

      const targetEl = elMap.get(interaction.targetElementId);
      if (!targetEl) return;

      // إذا كان هناك عنصر محدد، نفضل إبراز الروابط المرتبطة به أو عرض الكل
      const isRelated =
        !activeSelectedId ||
        activeSelectedId === sourceEl.id ||
        activeSelectedId === targetEl.id;

      if (!isRelated && activeSelectedId) return;

      // حساب الإحداثيات الفعلية اللحظية (Real-time and actual coordinates)
      const startX = sourceEl.x + sourceEl.width / 2;
      const startY = sourceEl.y + sourceEl.height / 2;
      const endX = targetEl.x + targetEl.width / 2;
      const endY = targetEl.y + targetEl.height / 2;

      // حساب نقاط تحكم بيزييه لمنحنى انسيابي جميل
      const dx = endX - startX;
      const dy = endY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const curvature = Math.min(120, dist * 0.3);

      const controlX1 = startX + (dx > 0 ? curvature : -curvature);
      const controlY1 = startY - curvature * 0.5;
      const controlX2 = endX - (dx > 0 ? curvature : -curvature);
      const controlY2 = endY - curvature * 0.5;

      const colorMap: Record<InteractionAction, string> = {
        scrollToElement: '#2563eb', // Blue
        openUrl: '#0891b2', // Cyan
        toggleVisibility: '#7c3aed', // Purple
        triggerAnimation: '#d97706', // Amber
        playSound: '#059669', // Emerald
        showPopup: '#db2777', // Pink
        changeColor: '#4f46e5', // Indigo
      };

      const labelMap: Record<InteractionAction, string> = {
        scrollToElement: 'تمرير إلى العنصر',
        openUrl: 'فتح رابط',
        toggleVisibility: 'تبديل الرؤية',
        triggerAnimation: `تشغيل أنيميشن (${interaction.animationType || 'fade'})`,
        playSound: `صوت (${interaction.soundType || 'click'})`,
        showPopup: 'نافذة منبثقة',
        changeColor: 'تغيير اللون',
      };

      links.push({
        interactionId: interaction.id,
        sourceId: sourceEl.id,
        sourceType: sourceEl.type,
        targetId: targetEl.id,
        targetType: targetEl.type,
        trigger: interaction.trigger,
        action: interaction.action,
        startX,
        startY,
        endX,
        endY,
        controlX1,
        controlY1,
        controlX2,
        controlY2,
        label: interaction.label || labelMap[interaction.action] || interaction.action,
        color: colorMap[interaction.action] || '#2563eb',
      });
    });
  });

  return links;
}

/**
 * تنفيذ التفاعل الميكانيكي برمجياً (Trigger Execution Runtime)
 */
export function executeInteractionTrigger(
  interaction: ElementInteraction,
  allElements: CanvasElement[],
  options?: {
    containerEl?: HTMLElement | null;
    zoom?: number;
    onNotify?: (msg: string, type?: 'info' | 'success' | 'warning') => void;
    onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  }
) {
  if (!interaction.enabled) return;

  const runAction = () => {
    switch (interaction.action) {
      case 'scrollToElement': {
        if (!interaction.targetElementId) return;
        const target = allElements.find((el) => el.id === interaction.targetElementId);
        if (!target) {
          options?.onNotify?.(`العنصر المستهدف غير موجود (${interaction.targetElementId})`, 'warning');
          return;
        }

        // التمرير في الحاوية بناءً على الإحداثيات الفعلية
        if (options?.containerEl) {
          const currentZoom = options.zoom || 1;
          const targetScrollX = target.x * currentZoom - 100;
          const targetScrollY = target.y * currentZoom - 100;

          options.containerEl.scrollTo({
            left: Math.max(0, targetScrollX),
            top: Math.max(0, targetScrollY),
            behavior: 'smooth',
          });
        }

        // تمرير إلى عنصر DOM إن وجد
        const domEl = document.getElementById(`canvas-el-${target.id}`) || document.getElementById(target.id);
        if (domEl) {
          domEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          // تسليط وميض بصري على العنصر
          domEl.classList.add('ring-4', 'ring-blue-500', 'transition-all', 'duration-500');
          setTimeout(() => {
            domEl.classList.remove('ring-4', 'ring-blue-500');
          }, 1500);
        }

        options?.onNotify?.(`تم التمرير إلى العنصر: ${target.text || target.type || target.id}`, 'info');
        break;
      }

      case 'openUrl': {
        if (!interaction.url) return;
        const targetTab = interaction.targetTab || '_blank';
        window.open(interaction.url, targetTab);
        options?.onNotify?.(`تم فتح الرابط: ${interaction.url}`, 'info');
        break;
      }

      case 'toggleVisibility': {
        if (!interaction.targetElementId) return;
        const target = allElements.find((el) => el.id === interaction.targetElementId);
        if (!target) return;
        const newVisible = target.visible === false ? true : false;
        options?.onUpdateElement?.(target.id, { visible: newVisible });
        options?.onNotify?.(`تم تبديل رؤية العنصر (${target.id}) إلى: ${newVisible ? 'مرئي' : 'مخفي'}`, 'info');
        break;
      }

      case 'triggerAnimation': {
        if (!interaction.targetElementId) return;
        const domEl = document.getElementById(`canvas-el-${interaction.targetElementId}`);
        const animType = interaction.animationType || 'bounce';
        if (domEl) {
          const animClass = `animate-${animType}`;
          domEl.classList.add(animClass);
          setTimeout(() => {
            domEl.classList.remove(animClass);
          }, 1200);
        }
        options?.onNotify?.(`تم تشغيل أنيميشن (${animType}) على العنصر`, 'info');
        break;
      }

      case 'playSound': {
        const soundType = interaction.soundType || 'click';
        playSyntheticAudioFeedback(soundType);
        options?.onNotify?.(`تم تشغيل التأثير الصوتي: ${soundType}`, 'info');
        break;
      }

      case 'showPopup': {
        const msg = interaction.popupMessage || 'تنبيه تفاعلي من محرك الأحداث';
        options?.onNotify?.(msg, 'success');
        break;
      }

      case 'changeColor': {
        if (!interaction.targetElementId || !interaction.colorValue) return;
        options?.onUpdateElement?.(interaction.targetElementId, {
          fillColor: interaction.colorValue,
        });
        options?.onNotify?.(`تم تطبيق اللون (${interaction.colorValue}) على العنصر`, 'info');
        break;
      }
    }
  };

  if (interaction.delayMs && interaction.delayMs > 0) {
    setTimeout(runAction, interaction.delayMs);
  } else {
    runAction();
  }
}
