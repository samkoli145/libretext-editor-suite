/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مكون المقابض البصرية الثمانية ومقبض التدوير وشارة الأبعاد - Transform Handles
 * 🏛️ الدور: مكون مشترك - عرض المقابض وحساب المواضع أثناء السحب
 * 📥 المستهلك: CanvasDesignerEditor, CanvasViewport
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    8-Point Vector Handles: مقابض تحجيم فيكتورية 8 نقاط + مقبض تدوير دائري
 *    مع شارة أبعاد حية (W x H) ونقطة مركز التكبير
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المؤشرات يجب أن تتوافق مع اتجاه السحب
 *    2. الأبعاد يجب أن تتناسب عند قفل النسبة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة BBox قبل توليد المقابض
 *    - fallback لمقابض أصغر
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import type { CanvasElement } from '../model';
import { RotateCw } from 'lucide-react';
import { getCursorForHandle } from '../../../shared/vector-engine/control_handle_manager';

interface TransformHandlesProps {
  element: CanvasElement;
  scale?: number;
  onResizeStart: (handle: string, e: React.MouseEvent) => void;
  onRotateStart: (e: React.MouseEvent) => void;
}

export function TransformHandles({
  element,
  scale = 1,
  onResizeStart,
  onRotateStart,
}: TransformHandlesProps) {
  const rotation = element.rotation || 0;
  const handleBaseClasses =
    'absolute w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-2xs shadow-2xs hover:scale-125 transition-transform z-30 pointer-events-auto';

  return (
    <div
      className="absolute inset-0 w-full h-full border-2 border-blue-500 pointer-events-none z-20"
    >
      {/* 8-Point Resize Handles */}
      {/* Top Left */}
      <div
        onMouseDown={(e) => onResizeStart('tl', e)}
        style={{ cursor: getCursorForHandle('nw', rotation) }}
        className={`${handleBaseClasses} -top-1.5 -left-1.5`}
      />
      {/* Top Center */}
      <div
        onMouseDown={(e) => onResizeStart('tc', e)}
        style={{ cursor: getCursorForHandle('n', rotation) }}
        className={`${handleBaseClasses} -top-1.5 left-1/2 -translate-x-1/2`}
      />
      {/* Top Right */}
      <div
        onMouseDown={(e) => onResizeStart('tr', e)}
        style={{ cursor: getCursorForHandle('ne', rotation) }}
        className={`${handleBaseClasses} -top-1.5 -right-1.5`}
      />

      {/* Middle Left */}
      <div
        onMouseDown={(e) => onResizeStart('ml', e)}
        style={{ cursor: getCursorForHandle('w', rotation) }}
        className={`${handleBaseClasses} top-1/2 -left-1.5 -translate-y-1/2`}
      />
      {/* Middle Right */}
      <div
        onMouseDown={(e) => onResizeStart('mr', e)}
        style={{ cursor: getCursorForHandle('e', rotation) }}
        className={`${handleBaseClasses} top-1/2 -right-1.5 -translate-y-1/2`}
      />

      {/* Bottom Left */}
      <div
        onMouseDown={(e) => onResizeStart('bl', e)}
        style={{ cursor: getCursorForHandle('sw', rotation) }}
        className={`${handleBaseClasses} -bottom-1.5 -left-1.5`}
      />
      {/* Bottom Center */}
      <div
        onMouseDown={(e) => onResizeStart('bc', e)}
        style={{ cursor: getCursorForHandle('s', rotation) }}
        className={`${handleBaseClasses} -bottom-1.5 left-1/2 -translate-x-1/2`}
      />
      {/* Bottom Right */}
      <div
        onMouseDown={(e) => onResizeStart('br', e)}
        style={{ cursor: getCursorForHandle('se', rotation) }}
        className={`${handleBaseClasses} -bottom-1.5 -right-1.5`}
      />

      {/* Rotation Handle */}
      <div
        onMouseDown={onRotateStart}
        className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-2xs flex items-center justify-center cursor-grab hover:scale-115 transition-transform pointer-events-auto z-30 text-blue-600"
        title="تدوير العنصر"
      >
        <RotateCw className="w-2.5 h-2.5" />
      </div>

      {/* Dimension Badge */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap select-none">
        {Math.round(element.width)} × {Math.round(element.height)}
      </div>
    </div>
  );
}
