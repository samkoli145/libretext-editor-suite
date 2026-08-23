/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: auto-layout-engine.ts
 * 📂 المسار: packages/algorithms/src/spatial/auto-layout-engine.ts
 * 🎯 الهدف الرئيسي: محرك التخطيط التلقائي (Auto Layout) المتجاوب الشبيه بـ Flexbox.
 * 📋 المعايير:
 *    - صفر اعتماديات (لا يعتمد على DOM).
 *    - دالة نقية 100% تقوم بحساب المواضع والأبعاد بناءً على سياسات التخطيط.
 * 🧪 الاختبارات: (تضاف لاحقاً)
 * 🏷️ المعرف: ALGO-011
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Flex-Math: محاكاة خوارزمية Flexbox حسابياً بدون متصفح.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب تداخل العناصر (Overlapping) عند ضيق المساحة.
 *    2. احترام هوامش (Padding/Margin) الكيانات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface LayoutNode {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly minWidth?: number;
  readonly minHeight?: number;
  readonly flexGrow?: number;
}

export interface LayoutContainer {
  readonly width: number;
  readonly height: number;
  readonly padding: number;
  readonly gap: number;
  readonly direction: 'row' | 'column';
  readonly align: 'start' | 'center' | 'end' | 'stretch';
  readonly justify: 'start' | 'center' | 'end' | 'space-between';
}

export interface LayoutResult {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function calculateAutoLayout(
  container: LayoutContainer,
  nodes: LayoutNode[],
): LayoutResult[] {
  if (!nodes.length) return [];

  const isRow = container.direction === 'row';
  const availableMain = (isRow ? container.width : container.height) - container.padding * 2;
  const availableCross = (isRow ? container.height : container.width) - container.padding * 2;

  // 1. حساب المساحة الأساسية المطلوبة
  let totalFixedMain = (nodes.length - 1) * container.gap;
  let totalFlexGrow = 0;

  for (const node of nodes) {
    totalFixedMain += isRow ? node.width : node.height;
    totalFlexGrow += node.flexGrow || 0;
  }

  // 2. حساب المساحة المتبقية للنمو
  const extraMain = Math.max(0, availableMain - totalFixedMain);
  const flexUnit = totalFlexGrow > 0 ? extraMain / totalFlexGrow : 0;

  // 3. حساب المحاذاة (Justify)
  let currentMain = container.padding;
  if (totalFlexGrow === 0 && availableMain > totalFixedMain) {
    if (container.justify === 'center') {
      currentMain += (availableMain - totalFixedMain) / 2;
    } else if (container.justify === 'end') {
      currentMain += availableMain - totalFixedMain;
    } else if (container.justify === 'space-between' && nodes.length > 1) {
      // Space between logic can be expanded here
    }
  }

  const results: LayoutResult[] = [];

  for (const node of nodes) {
    const nodeMain = (isRow ? node.width : node.height) + (node.flexGrow || 0) * flexUnit;
    const nodeCrossFixed = isRow ? node.height : node.width;

    let nodeCross = nodeCrossFixed;
    if (container.align === 'stretch') {
      nodeCross = availableCross;
    }

    let currentCross = container.padding;
    if (container.align === 'center') {
      currentCross += (availableCross - nodeCross) / 2;
    } else if (container.align === 'end') {
      currentCross += availableCross - nodeCross;
    }

    results.push({
      id: node.id,
      x: isRow ? currentMain : currentCross,
      y: isRow ? currentCross : currentMain,
      width: isRow ? nodeMain : nodeCross,
      height: isRow ? nodeCross : nodeMain,
    });

    currentMain += nodeMain + container.gap;
  }

  return results;
}
