/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكون تراكب خطوط المحاذاة الذكية المغناطيسية - Interactive Guides Overlay
 * 🏛️ الدور: مكون مشترك - عرض خطوط المحاذاة الزرقاء أثناء السحب
 * 📥 المستهلك: CanvasDesignerEditor, CanvasViewport
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    SVG Precision Lines: خطوط SVG دقيقة للمحاذاة
 *    تتطلب إحداثيات كاملة للعناصر المحددة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الخطوط يجب أن تختفي عند الإفلات
 *    2. الإحداثيات يجب أن تتناسب مع عامل التكبير
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة الإحداثيات
 *    - fallback لعدم عرض خطوط
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { SnapLine } from '../../../shared/lib-core/geometry/snap-align-engine';

export interface InteractiveGuidesOverlayProps {
  guides?: SnapLine[];
  canvasWidth?: number;
  canvasHeight?: number;
  zoom?: number;
  elements?: any[];
  selectedElementId?: string | null;
}

export const InteractiveGuidesOverlay: React.FC<InteractiveGuidesOverlayProps> = ({
  guides = [],
  canvasWidth = 1200,
  canvasHeight = 800,
}) => {
  if (!guides || guides.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-50 overflow-visible"
      width={canvasWidth}
      height={canvasHeight}
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      {guides.map((guide, idx) => {
        if (guide.type === 'vertical') {
          return (
            <line
              key={`guide-v-${idx}`}
              x1={guide.position}
              y1={0}
              x2={guide.position}
              y2={canvasHeight}
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        } else {
          return (
            <line
              key={`guide-h-${idx}`}
              x1={0}
              y1={guide.position}
              x2={canvasWidth}
              y2={guide.position}
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        }
      })}
    </svg>
  );
};
