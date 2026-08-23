/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: spatial-drag-algorithms.ts
 * 📂 المسار: src/utils/spatial-drag-algorithms.ts
 * 🎯 الهدف الرئيسي: خوارزميات المعالجة المكانية والسحب والإفلات والتحديد المتعدد
 *    والمحاذاة والتوزيع وترتيب الطبقات لعناصر لوحة الرسم المحاكية.
 * 📋 المعايير:
 *    - دوال نقية (Pure Functions) خالية من الآثار الجانبية.
 *    - حد أقصى 50 سطر لكل دالة.
 *    - كود دفاعي (Defensive Coding) وتحقق كامل من النطاقات.
 * 🏷️ المعرف: ALGO-028
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable Spatial State Matrix + Snapped Delta Projector + Bounding Resolver
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم خروج العناصر خارج حدود لوحة الرسم أثناء السحب الجماعي.
 *    2. ضمان ثبات المسافات البينية عند التوزيع المتساوي.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  SimulatedCanvasElement,
  CanvasBoundingBox,
  MarqueeSelectionState,
  AlignmentGuideLine,
  StateHistoryEntry,
  TextScriptDirection,
} from './artboard-types';

/**
 * اكتشاف اتجاه النص ولغته (عربي RTL أو لاتيني/غربي LTR)
 */
export function detectTextScriptDirection(text?: string): 'rtl' | 'ltr' {
  if (!text || typeof text !== 'string') return 'ltr';
  const rtlRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/;
  return rtlRegex.test(text) ? 'rtl' : 'ltr';
}

/**
 * تحديد اتجاه الكتابة الفعلي لعنصر في لوحة الرسم
 */
export function getElementScriptDirection(element: SimulatedCanvasElement): 'rtl' | 'ltr' {
  if (element.direction === 'rtl' || element.direction === 'ltr') {
    return element.direction;
  }
  const title = String(element.contentData?.title || '');
  const text = String(element.contentData?.text || '');
  const name = element.name;
  if (
    detectTextScriptDirection(title) === 'rtl' ||
    detectTextScriptDirection(text) === 'rtl' ||
    detectTextScriptDirection(name) === 'rtl'
  ) {
    return 'rtl';
  }
  return 'ltr';
}

/**
 * محاذاة ذكية للعناصر بناءً على اتجاه النص (عربي يمين RTL، ولاتيني يسار LTR)
 */
export function smartAlignByScript(
  elements: readonly SimulatedCanvasElement[],
  selectedIds: readonly string[],
  canvasWidth: number,
  targetScript: TextScriptDirection = 'auto',
): readonly SimulatedCanvasElement[] {
  const targetIds = selectedIds.length > 0 ? selectedIds : elements.map((e) => e.id);
  const bounds = calculateGroupBounds(elements, targetIds);
  const margin = 24;

  return elements.map((el) => {
    if (!targetIds.includes(el.id) || el.isLocked) return el;
    const direction = targetScript === 'auto' ? getElementScriptDirection(el) : targetScript;
    let newX = el.x;

    if (direction === 'rtl') {
      newX =
        bounds && selectedIds.length > 1
          ? bounds.maxX - el.width
          : Math.max(0, canvasWidth - el.width - margin);
    } else {
      newX = bounds && selectedIds.length > 1 ? bounds.minX : margin;
    }

    return {
      ...el,
      x: Math.round(newX),
      direction,
    };
  });
}

/**
 * حساب المحاذاة الذكية وخطوط الإرشاد (Smart Guides & Edge Snapping)
 */
export function calculateSmartSnapAndGuides(
  elements: readonly SimulatedCanvasElement[],
  movingElementIds: readonly string[],
  proposedX: number,
  proposedY: number,
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number,
  threshold = 6,
): { snappedX: number; snappedY: number; guides: readonly AlignmentGuideLine[] } {
  let snappedX = proposedX;
  let snappedY = proposedY;
  const guides: AlignmentGuideLine[] = [];

  const others = elements.filter((el) => !movingElementIds.includes(el.id));
  const proposedRight = proposedX + width;
  const proposedCenterX = proposedX + width / 2;
  const proposedBottom = proposedY + height;
  const proposedCenterY = proposedY + height / 2;

  // فحص المحاذاة الأفقية (X) مع مراكز وحواف العناصر الأخرى
  for (const other of others) {
    const otherRight = other.x + other.width;
    const otherCenterX = other.x + other.width / 2;

    if (Math.abs(proposedX - other.x) <= threshold) {
      snappedX = other.x;
      guides.push({
        type: 'vertical',
        position: other.x,
        start: Math.min(proposedY, other.y),
        end: Math.max(proposedBottom, other.y + other.height),
        label: 'محاذاة اليسار',
      });
      break;
    } else if (Math.abs(proposedRight - otherRight) <= threshold) {
      snappedX = otherRight - width;
      guides.push({
        type: 'vertical',
        position: otherRight,
        start: Math.min(proposedY, other.y),
        end: Math.max(proposedBottom, other.y + other.height),
        label: 'محاذاة اليمين',
      });
      break;
    } else if (Math.abs(proposedCenterX - otherCenterX) <= threshold) {
      snappedX = otherCenterX - width / 2;
      guides.push({
        type: 'vertical',
        position: otherCenterX,
        start: Math.min(proposedY, other.y),
        end: Math.max(proposedBottom, other.y + other.height),
        label: 'محاذاة الوسط',
      });
      break;
    }
  }

  // فحص المحاذاة الرأسية (Y)
  for (const other of others) {
    const otherBottom = other.y + other.height;
    const otherCenterY = other.y + other.height / 2;

    if (Math.abs(proposedY - other.y) <= threshold) {
      snappedY = other.y;
      guides.push({
        type: 'horizontal',
        position: other.y,
        start: Math.min(proposedX, other.x),
        end: Math.max(proposedRight, other.x + other.width),
        label: 'محاذاة الأعلى',
      });
      break;
    } else if (Math.abs(proposedBottom - otherBottom) <= threshold) {
      snappedY = otherBottom - height;
      guides.push({
        type: 'horizontal',
        position: otherBottom,
        start: Math.min(proposedX, other.x),
        end: Math.max(proposedRight, other.x + other.width),
        label: 'محاذاة الأسفل',
      });
      break;
    } else if (Math.abs(proposedCenterY - otherCenterY) <= threshold) {
      snappedY = otherCenterY - height / 2;
      guides.push({
        type: 'horizontal',
        position: otherCenterY,
        start: Math.min(proposedX, other.x),
        end: Math.max(proposedRight, other.x + other.width),
        label: 'محاذاة المنتصف',
      });
      break;
    }
  }

  return {
    snappedX: Math.round(snappedX),
    snappedY: Math.round(snappedY),
    guides,
  };
}

/**
 * إضافة لقطة جديدة إلى سجل التراجع والإعادة
 */
export function pushHistoryState(
  history: readonly StateHistoryEntry[],
  currentIndex: number,
  newElements: readonly SimulatedCanvasElement[],
  description: string,
  maxEntries = 30,
): { newHistory: readonly StateHistoryEntry[]; newIndex: number } {
  const truncated = history.slice(0, currentIndex + 1);
  const nextEntry: StateHistoryEntry = {
    elements: newElements,
    description,
    timestamp: Date.now(),
  };

  const combined = [...truncated, nextEntry];
  if (combined.length > maxEntries) {
    const excess = combined.length - maxEntries;
    return {
      newHistory: combined.slice(excess),
      newIndex: maxEntries - 1,
    };
  }

  return {
    newHistory: combined,
    newIndex: combined.length - 1,
  };
}

/**
 * تسنين القيمة إلى أقرب شبكة بمقدار معين (Snap to Grid)
 */
export function snapCoordinate(value: number, gridSize: number, enabled: boolean): number {
  if (!enabled || gridSize <= 1) return Math.round(value);
  return Math.round(value / gridSize) * gridSize;
}

/**
 * حساب الصندوق المحيط الإجمالي لمجموعة عناصر محددة
 */
export function calculateGroupBounds(
  elements: readonly SimulatedCanvasElement[],
  selectedIds: readonly string[],
): CanvasBoundingBox | null {
  const selected = elements.filter((el) => selectedIds.includes(el.id));
  if (selected.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of selected) {
    if (el.x < minX) minX = el.x;
    if (el.y < minY) minY = el.y;
    if (el.x + el.width > maxX) maxX = el.x + el.width;
    if (el.y + el.height > maxY) maxY = el.y + el.height;
  }

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

/**
 * تقييد الإحداثيات داخل حدود حاوية اللوحة
 */
export function clampWithinCanvas(
  x: number,
  y: number,
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } {
  const clampedX = Math.max(0, Math.min(x, Math.max(0, canvasWidth - width)));
  const clampedY = Math.max(0, Math.min(y, Math.max(0, canvasHeight - height)));
  return { x: clampedX, y: clampedY };
}

/**
 * تطبيق إزاحة السحب (Delta) على العناصر المحددة مع مراعاة القيود والشبكة
 */
export function applyDeltaToSelection(
  elements: readonly SimulatedCanvasElement[],
  initialPositions: ReadonlyMap<string, { readonly x: number; readonly y: number }>,
  deltaX: number,
  deltaY: number,
  canvasBounds: { width: number; height: number },
  snapGrid: number,
  isSnapEnabled: boolean,
): readonly SimulatedCanvasElement[] {
  return elements.map((el) => {
    const initPos = initialPositions.get(el.id);
    if (!initPos || el.isLocked) return el;

    const rawX = initPos.x + deltaX;
    const rawY = initPos.y + deltaY;

    const snappedX = snapCoordinate(rawX, snapGrid, isSnapEnabled);
    const snappedY = snapCoordinate(rawY, snapGrid, isSnapEnabled);

    const clamped = clampWithinCanvas(
      snappedX,
      snappedY,
      el.width,
      el.height,
      canvasBounds.width,
      canvasBounds.height,
    );

    return {
      ...el,
      x: clamped.x,
      y: clamped.y,
    };
  });
}

/**
 * إدارة التحديد المتعدد مع دعم مفتاح Shift
 */
export function toggleElementSelection(
  currentSelection: readonly string[],
  clickedId: string,
  isShiftPressed: boolean,
): readonly string[] {
  if (!isShiftPressed) {
    return [clickedId];
  }

  if (currentSelection.includes(clickedId)) {
    // إزالة العنصر إن وجد في المجموعة مع الإبقاء على البقية
    return currentSelection.filter((id) => id !== clickedId);
  } else {
    // إضافة العنصر لمجموعة التحديد الحالية
    return [...currentSelection, clickedId];
  }
}

/**
 * فحص تقاطع صندوق التحديد الشامل (Marquee) مع العناصر
 */
export function getMarqueeIntersectingIds(
  elements: readonly SimulatedCanvasElement[],
  marquee: MarqueeSelectionState,
): readonly string[] {
  if (!marquee.isActive) return [];

  const boxMinX = Math.min(marquee.startX, marquee.currentX);
  const boxMaxX = Math.max(marquee.startX, marquee.currentX);
  const boxMinY = Math.min(marquee.startY, marquee.currentY);
  const boxMaxY = Math.max(marquee.startY, marquee.currentY);

  return elements
    .filter((el) => {
      const elMaxX = el.x + el.width;
      const elMaxY = el.y + el.height;
      return el.x < boxMaxX && elMaxX > boxMinX && el.y < boxMaxY && elMaxY > boxMinY;
    })
    .map((el) => el.id);
}

export type SpatialAlignmentType =
  'align-left' | 'align-center-x' | 'align-right' | 'align-top' | 'align-center-y' | 'align-bottom';

/**
 * محاذاة العناصر المحددة هندسياً وفق النوع المطلوب
 */
export function alignSelectedElements(
  elements: readonly SimulatedCanvasElement[],
  selectedIds: readonly string[],
  type: SpatialAlignmentType,
): readonly SimulatedCanvasElement[] {
  const bounds = calculateGroupBounds(elements, selectedIds);
  if (!bounds || selectedIds.length < 2) return elements;

  return elements.map((el) => {
    if (!selectedIds.includes(el.id) || el.isLocked) return el;

    let newX = el.x;
    let newY = el.y;

    switch (type) {
      case 'align-left':
        newX = bounds.minX;
        break;
      case 'align-center-x':
        newX = bounds.centerX - el.width / 2;
        break;
      case 'align-right':
        newX = bounds.maxX - el.width;
        break;
      case 'align-top':
        newY = bounds.minY;
        break;
      case 'align-center-y':
        newY = bounds.centerY - el.height / 2;
        break;
      case 'align-bottom':
        newY = bounds.maxY - el.height;
        break;
    }

    return {
      ...el,
      x: Math.round(newX),
      y: Math.round(newY),
    };
  });
}

export type SpatialDistributionType = 'distribute-horizontal' | 'distribute-vertical';

/**
 * توزيع العناصر المحددة بمسافات بينية متساوية
 */
export function distributeSelectedElements(
  elements: readonly SimulatedCanvasElement[],
  selectedIds: readonly string[],
  type: SpatialDistributionType,
): readonly SimulatedCanvasElement[] {
  const targetElements = elements.filter((el) => selectedIds.includes(el.id) && !el.isLocked);

  if (targetElements.length < 3) return elements;

  if (type === 'distribute-horizontal') {
    const sorted = [...targetElements].sort((a, b) => a.x - b.x);
    const minX = sorted[0]!.x;
    const last = sorted[sorted.length - 1]!;
    const totalSpan = last.x + last.width - minX;
    const totalItemWidths = sorted.reduce((sum, item) => sum + item.width, 0);
    const totalGaps = sorted.length - 1;
    const gap = Math.max(0, (totalSpan - totalItemWidths) / totalGaps);

    let currentX = minX;
    const newPositions = new Map<string, number>();
    for (const item of sorted) {
      newPositions.set(item.id, currentX);
      currentX += item.width + gap;
    }

    return elements.map((el) => {
      const px = newPositions.get(el.id);
      return px !== undefined ? { ...el, x: Math.round(px) } : el;
    });
  } else {
    const sorted = [...targetElements].sort((a, b) => a.y - b.y);
    const minY = sorted[0]!.y;
    const last = sorted[sorted.length - 1]!;
    const totalSpan = last.y + last.height - minY;
    const totalItemHeights = sorted.reduce((sum, item) => sum + item.height, 0);
    const totalGaps = sorted.length - 1;
    const gap = Math.max(0, (totalSpan - totalItemHeights) / totalGaps);

    let currentY = minY;
    const newPositions = new Map<string, number>();
    for (const item of sorted) {
      newPositions.set(item.id, currentY);
      currentY += item.height + gap;
    }

    return elements.map((el) => {
      const py = newPositions.get(el.id);
      return py !== undefined ? { ...el, y: Math.round(py) } : el;
    });
  }
}

/**
 * تدوير العناصر المحددة بزاوية معينة
 */
export function rotateSelectedElements(
  elements: readonly SimulatedCanvasElement[],
  selectedIds: readonly string[],
  deltaAngle: number,
): readonly SimulatedCanvasElement[] {
  return elements.map((el) => {
    if (!selectedIds.includes(el.id) || el.isLocked) return el;
    const currentRot = el.rotation || 0;
    const nextRot = (currentRot + deltaAngle + 360) % 360;
    return { ...el, rotation: nextRot };
  });
}

/**
 * تغيير ترتيب طبقات العناصر (Z-Order)
 */
export function reorderLayers(
  elements: readonly SimulatedCanvasElement[],
  selectedIds: readonly string[],
  action: 'bring-to-front' | 'send-to-back' | 'bring-forward' | 'send-backward',
): readonly SimulatedCanvasElement[] {
  if (selectedIds.length === 0) return elements;

  const list = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const maxZ = Math.max(...list.map((e) => e.zIndex), 0);
  const minZ = Math.min(...list.map((e) => e.zIndex), 0);

  return elements.map((el) => {
    if (!selectedIds.includes(el.id)) return el;

    let nextZ = el.zIndex;
    if (action === 'bring-to-front') nextZ = maxZ + 1;
    else if (action === 'send-to-back') nextZ = Math.max(0, minZ - 1);
    else if (action === 'bring-forward') nextZ = el.zIndex + 1;
    else if (action === 'send-backward') nextZ = Math.max(0, el.zIndex - 1);

    return { ...el, zIndex: nextZ };
  });
}

/**
 * إنشاء الحالة الأولية للعناصر التوضيحية على لوحة الرسم
 */
export function createInitialArtboardElements(): readonly SimulatedCanvasElement[] {
  return [
    {
      id: 'sim-paragraph-1',
      type: 'paragraph',
      domain: 'Writer',
      name: 'فقرة نصية (Paragraph Node)',
      x: 30,
      y: 35,
      width: 270,
      height: 120,
      zIndex: 1,
      backgroundColor: '#ffffff',
      borderColor: '#38bdf8',
      contentData: {
        title: 'فقرة نصية',
        text: 'انقر لتحديد العنصر أو اسحبه في أي مكان. اضغط Shift للتحديد المتعدد.',
      },
    },
    {
      id: 'sim-table-1',
      type: 'table',
      domain: 'Universal',
      name: 'جدول بيانات (Table Node)',
      x: 330,
      y: 35,
      width: 290,
      height: 130,
      zIndex: 2,
      backgroundColor: '#ffffff',
      borderColor: '#34d399',
      contentData: {
        title: 'جدول الحسابات',
        rows: [
          { col1: 'المبيعات', col2: '14,250 ر.س' },
          { col1: 'المصروفات', col2: '6,100 ر.س' },
        ],
      },
    },
    {
      id: 'sim-shape-1',
      type: 'shape',
      domain: 'Impress',
      name: 'شكل مكاني (Vector Shape)',
      x: 70,
      y: 190,
      width: 170,
      height: 130,
      zIndex: 3,
      rotation: 0,
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      contentData: {
        label: 'متجه Impress',
      },
    },
    {
      id: 'sim-record-1',
      type: 'database_record',
      domain: 'Base',
      name: 'سجل بيانات (Base Record)',
      x: 350,
      y: 190,
      width: 260,
      height: 130,
      zIndex: 4,
      backgroundColor: '#ffffff',
      borderColor: '#c084fc',
      contentData: {
        recordId: 'REC-9042',
        title: 'تقرير الربع السنوي',
        status: 'معتمد',
      },
    },
  ];
}
