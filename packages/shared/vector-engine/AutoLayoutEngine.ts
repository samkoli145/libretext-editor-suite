/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك التدفق والتخطيط التلقائي الفيكتوري - Auto-Layout Engine
 * 🏛️ الدور: محرك مشترك - تطبيق Flexbox-like layout على العناصر الفيكتورية
 * 📥 المستهلك: CanvasDesignerEditor, AutoLayoutPanel, SmartComponentEngine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    CSS Flexbox-Inspired Layout: تخطيط مشابه لـ Flexbox
 *    مع دعم horizontal/vertical/grid/wrap ومعادلات مساحة
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التخطيط يجب أن يحدث في < 16ms (60fps)
 *    2. العناصر يجب ألا تتداخل
 *    3. التغييرات يجب أن تكون قابلة للتراجع
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود عناصر قبل التخطيط
 *    - حساب الأبعاد بدقة (لا أرقام متحركة)
 *    - fallback لل布局 العمودي
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type AutoLayoutDirection = 'horizontal' | 'vertical' | 'grid' | 'wrap';
export type AutoLayoutJustify =
  'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
export type AutoLayoutAlign = 'start' | 'center' | 'end' | 'stretch';
export type AutoLayoutSizing = 'hug' | 'fixed' | 'fill';

export interface AutoLayoutPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AutoLayoutConfig {
  direction: AutoLayoutDirection;
  gap: number;
  padding: AutoLayoutPadding;
  justifyContent: AutoLayoutJustify;
  alignItems: AutoLayoutAlign;
  gridColumns?: number;
  wrap?: boolean;
  horizontalSizing?: AutoLayoutSizing;
  verticalSizing?: AutoLayoutSizing;
}

export interface LayoutItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: any;
}

export interface LayoutContainer extends LayoutItem {
  autoLayout?: AutoLayoutConfig;
}

export const DEFAULT_AUTOLAYOUT_CONFIG: AutoLayoutConfig = {
  direction: 'horizontal',
  gap: 16,
  padding: { top: 16, right: 16, bottom: 16, left: 16 },
  justifyContent: 'start',
  alignItems: 'center',
  gridColumns: 3,
  wrap: false,
  horizontalSizing: 'hug',
  verticalSizing: 'hug',
};

/**
 * محرك حساب التخطيط التلقائي لمجموعة عناصر أو حاوية
 */
export class AutoLayoutEngine {
  /**
   * تطبيق التخطيط التلقائي على قائمة من العناصر وحساب إحداثياتها بدقة بكسلية
   * @param items العناصر المراد ترتيبها
   * @param config إعدادات التدفق والتوزيع
   * @param originX نقطة البداية الأفقية
   * @param originY نقطة البداية العمودية
   * @param containerWidth العرض الثابت للحاوية (في حال fixed/fill)
   * @param containerHeight الارتفاع الثابت للحاوية (في حال fixed/fill)
   */
  static computeLayout<T extends LayoutItem>(
    items: T[],
    config: Partial<AutoLayoutConfig> = {},
    originX = 0,
    originY = 0,
    containerWidth?: number,
    containerHeight?: number,
  ): {
    items: T[];
    computedWidth: number;
    computedHeight: number;
  } {
    if (items.length === 0) {
      const pad = { ...DEFAULT_AUTOLAYOUT_CONFIG.padding, ...(config.padding || {}) };
      return {
        items: [],
        computedWidth: containerWidth || pad.left + pad.right,
        computedHeight: containerHeight || pad.top + pad.bottom,
      };
    }

    const fullConfig: AutoLayoutConfig = {
      ...DEFAULT_AUTOLAYOUT_CONFIG,
      ...config,
      padding: { ...DEFAULT_AUTOLAYOUT_CONFIG.padding, ...(config.padding || {}) },
    };

    const {
      direction,
      gap,
      padding,
      justifyContent,
      alignItems,
      gridColumns = 3,
      wrap,
    } = fullConfig;

    const clonedItems = items.map((item) => ({ ...item }));

    if (direction === 'horizontal') {
      return this.computeHorizontalLayout(
        clonedItems,
        gap,
        padding,
        justifyContent,
        alignItems,
        originX,
        originY,
        containerWidth,
        containerHeight,
        wrap,
      );
    } else if (direction === 'vertical') {
      return this.computeVerticalLayout(
        clonedItems,
        gap,
        padding,
        justifyContent,
        alignItems,
        originX,
        originY,
        containerWidth,
        containerHeight,
      );
    } else if (direction === 'grid') {
      return this.computeGridLayout(
        clonedItems,
        gridColumns,
        gap,
        padding,
        originX,
        originY,
        containerWidth,
      );
    }

    return {
      items: clonedItems,
      computedWidth: containerWidth || 400,
      computedHeight: containerHeight || 300,
    };
  }

  /**
   * التخطيط الأفقي (Horizontal / Row Flow)
   */
  private static computeHorizontalLayout<T extends LayoutItem>(
    items: T[],
    gap: number,
    padding: AutoLayoutPadding,
    justifyContent: AutoLayoutJustify,
    alignItems: AutoLayoutAlign,
    originX: number,
    originY: number,
    containerWidth?: number,
    containerHeight?: number,
    wrap?: boolean,
  ) {
    if (wrap && containerWidth && containerWidth > 0) {
      return this.computeWrapLayout(
        items,
        gap,
        padding,
        alignItems,
        originX,
        originY,
        containerWidth,
      );
    }

    const totalItemsWidth = items.reduce((acc, it) => acc + (it.width || 0), 0);
    const totalGapsWidth = Math.max(0, items.length - 1) * gap;
    const contentWidth = totalItemsWidth + totalGapsWidth;
    const maxItemHeight = items.reduce((acc, it) => Math.max(acc, it.height || 0), 0);

    const calcWidth =
      containerWidth && containerWidth > contentWidth + padding.left + padding.right
        ? containerWidth
        : contentWidth + padding.left + padding.right;

    const calcHeight =
      containerHeight && containerHeight > maxItemHeight + padding.top + padding.bottom
        ? containerHeight
        : maxItemHeight + padding.top + padding.bottom;

    const innerAvailableWidth = calcWidth - padding.left - padding.right;
    const freeSpace = Math.max(0, innerAvailableWidth - contentWidth);

    let startX = originX + padding.left;
    let stepGap = gap;

    if (justifyContent === 'center') {
      startX += freeSpace / 2;
    } else if (justifyContent === 'end') {
      startX += freeSpace;
    } else if (justifyContent === 'space-between' && items.length > 1) {
      stepGap = gap + freeSpace / (items.length - 1);
    } else if (justifyContent === 'space-around') {
      const spacePerSide = freeSpace / items.length;
      startX += spacePerSide / 2;
      stepGap = gap + spacePerSide;
    } else if (justifyContent === 'space-evenly') {
      const spacePerSegment = freeSpace / (items.length + 1);
      startX += spacePerSegment;
      stepGap = gap + spacePerSegment;
    }

    let currentX = startX;

    items.forEach((item) => {
      const itemW = item.width || 80;
      let itemH = item.height || 40;
      let currentY = originY + padding.top;

      if (alignItems === 'center') {
        currentY = originY + padding.top + (calcHeight - padding.top - padding.bottom - itemH) / 2;
      } else if (alignItems === 'end') {
        currentY = originY + calcHeight - padding.bottom - itemH;
      } else if (alignItems === 'stretch') {
        itemH = calcHeight - padding.top - padding.bottom;
        item.height = itemH;
      }

      item.x = Math.round(currentX);
      item.y = Math.round(currentY);

      currentX += itemW + stepGap;
    });

    return {
      items,
      computedWidth: Math.round(calcWidth),
      computedHeight: Math.round(calcHeight),
    };
  }

  /**
   * التخطيط العمودي (Vertical / Column Flow)
   */
  private static computeVerticalLayout<T extends LayoutItem>(
    items: T[],
    gap: number,
    padding: AutoLayoutPadding,
    justifyContent: AutoLayoutJustify,
    alignItems: AutoLayoutAlign,
    originX: number,
    originY: number,
    containerWidth?: number,
    containerHeight?: number,
  ) {
    const totalItemsHeight = items.reduce((acc, it) => acc + (it.height || 0), 0);
    const totalGapsHeight = Math.max(0, items.length - 1) * gap;
    const contentHeight = totalItemsHeight + totalGapsHeight;
    const maxItemWidth = items.reduce((acc, it) => Math.max(acc, it.width || 0), 0);

    const calcWidth =
      containerWidth && containerWidth > maxItemWidth + padding.left + padding.right
        ? containerWidth
        : maxItemWidth + padding.left + padding.right;

    const calcHeight =
      containerHeight && containerHeight > contentHeight + padding.top + padding.bottom
        ? containerHeight
        : contentHeight + padding.top + padding.bottom;

    const innerAvailableHeight = calcHeight - padding.top - padding.bottom;
    const freeSpace = Math.max(0, innerAvailableHeight - contentHeight);

    let startY = originY + padding.top;
    let stepGap = gap;

    if (justifyContent === 'center') {
      startY += freeSpace / 2;
    } else if (justifyContent === 'end') {
      startY += freeSpace;
    } else if (justifyContent === 'space-between' && items.length > 1) {
      stepGap = gap + freeSpace / (items.length - 1);
    } else if (justifyContent === 'space-around') {
      const spacePerSide = freeSpace / items.length;
      startY += spacePerSide / 2;
      stepGap = gap + spacePerSide;
    } else if (justifyContent === 'space-evenly') {
      const spacePerSegment = freeSpace / (items.length + 1);
      startY += spacePerSegment;
      stepGap = gap + spacePerSegment;
    }

    let currentY = startY;

    items.forEach((item) => {
      let itemW = item.width || 80;
      const itemH = item.height || 40;
      let currentX = originX + padding.left;

      if (alignItems === 'center') {
        currentX = originX + padding.left + (calcWidth - padding.left - padding.right - itemW) / 2;
      } else if (alignItems === 'end') {
        currentX = originX + calcWidth - padding.right - itemW;
      } else if (alignItems === 'stretch') {
        itemW = calcWidth - padding.left - padding.right;
        item.width = itemW;
      }

      item.x = Math.round(currentX);
      item.y = Math.round(currentY);

      currentY += itemH + stepGap;
    });

    return {
      items,
      computedWidth: Math.round(calcWidth),
      computedHeight: Math.round(calcHeight),
    };
  }

  /**
   * التخطيط الشبكي (Grid Layout)
   */
  private static computeGridLayout<T extends LayoutItem>(
    items: T[],
    columns: number,
    gap: number,
    padding: AutoLayoutPadding,
    originX: number,
    originY: number,
    containerWidth?: number,
  ) {
    const cols = Math.max(1, columns);
    const maxItemWidth = items.reduce((acc, it) => Math.max(acc, it.width || 80), 80);
    const maxItemHeight = items.reduce((acc, it) => Math.max(acc, it.height || 40), 40);

    const availableInnerWidth = containerWidth
      ? containerWidth - padding.left - padding.right
      : undefined;
    const colWidth = availableInnerWidth
      ? (availableInnerWidth - (cols - 1) * gap) / cols
      : maxItemWidth;

    let row = 0;
    let col = 0;

    items.forEach((item, index) => {
      row = Math.floor(index / cols);
      col = index % cols;

      const currentX = originX + padding.left + col * (colWidth + gap);
      const currentY = originY + padding.top + row * (maxItemHeight + gap);

      item.x = Math.round(currentX);
      item.y = Math.round(currentY);
      if (availableInnerWidth) {
        item.width = Math.round(colWidth);
      }
    });

    const totalRows = Math.ceil(items.length / cols);
    const calcWidth =
      containerWidth || padding.left + cols * colWidth + (cols - 1) * gap + padding.right;
    const calcHeight =
      padding.top + totalRows * maxItemHeight + Math.max(0, totalRows - 1) * gap + padding.bottom;

    return {
      items,
      computedWidth: Math.round(calcWidth),
      computedHeight: Math.round(calcHeight),
    };
  }

  /**
   * التخطيط الملتف (Flex Wrap Layout)
   */
  private static computeWrapLayout<T extends LayoutItem>(
    items: T[],
    gap: number,
    padding: AutoLayoutPadding,
    alignItems: AutoLayoutAlign,
    originX: number,
    originY: number,
    containerWidth: number,
  ) {
    const maxLineWidth = containerWidth - padding.left - padding.right;
    let currentX = originX + padding.left;
    let currentY = originY + padding.top;
    let lineMaxHeight = 0;

    items.forEach((item) => {
      const itemW = item.width || 80;
      const itemH = item.height || 40;

      if (
        currentX + itemW > originX + padding.left + maxLineWidth &&
        currentX > originX + padding.left
      ) {
        // Move to next line
        currentX = originX + padding.left;
        currentY += lineMaxHeight + gap;
        lineMaxHeight = 0;
      }

      item.x = Math.round(currentX);
      item.y = Math.round(currentY);

      lineMaxHeight = Math.max(lineMaxHeight, itemH);
      currentX += itemW + gap;
    });

    const calcHeight = currentY + lineMaxHeight + padding.bottom - originY;

    return {
      items,
      computedWidth: Math.round(containerWidth),
      computedHeight: Math.round(calcHeight),
    };
  }

  /**
   * توزيع أفقي متساوٍ سريع
   */
  static distributeHorizontally<T extends LayoutItem>(items: T[], gap = 16): T[] {
    if (items.length <= 1) return items;
    const sorted = [...items].sort((a, b) => a.x - b.x);
    let currX = sorted[0].x;
    return sorted.map((it) => {
      const newItem = { ...it, x: Math.round(currX) };
      currX += (it.width || 0) + gap;
      return newItem;
    });
  }

  /**
   * توزيع عمودي متساوٍ سريع
   */
  static distributeVertically<T extends LayoutItem>(items: T[], gap = 16): T[] {
    if (items.length <= 1) return items;
    const sorted = [...items].sort((a, b) => a.y - b.y);
    let currY = sorted[0].y;
    return sorted.map((it) => {
      const newItem = { ...it, y: Math.round(currY) };
      currY += (it.height || 0) + gap;
      return newItem;
    });
  }

  /**
   * محاذاة العناصر إلى الشبكة (Snap Coordinates to Grid)
   */
  static alignToGrid<T extends LayoutItem>(item: T, gridSize = 20): T {
    return {
      ...item,
      x: Math.round(item.x / gridSize) * gridSize,
      y: Math.round(item.y / gridSize) * gridSize,
      width: Math.max(gridSize, Math.round((item.width || gridSize) / gridSize) * gridSize),
      height: Math.max(gridSize, Math.round((item.height || gridSize) / gridSize) * gridSize),
    };
  }
}
