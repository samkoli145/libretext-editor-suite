/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: سجل الأدوات المركزي ومساعد العمليات الحسابية والرياضية
 * 🏛️ الدور: أداة مشتركة - واجهة موحدة لكافة المحررات مع أدوات LaTeX
 * 📥 المستهلك: SharedRibbonBar, UnifiedToolboxBlock, كل المحررات الأربعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unified Tool Registry + Calculator: سجل موحد لأدوات العلمية والرياضية
 *    مع مساعد حسابات LaTeX وصفر مكتبات خارجية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأدوات يجب أن تظهر في كل المحررات (قاعدة AGENTS.md)
 *    2. IDs يجب أن تكون فريدة
 *    3. LaTeX يجب أن يكون آمناً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة LaTeX قبل التوليد
 *    - fallback لأداة افتراضية
 *    - تنظيف SVG من العناصر الخطرة
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  ToolRegistry,
  type LatexSymbolItem,
  type LatexFormulaPreset,
  type ArithmeticToolItem,
  type EditorExecutionContext,
} from '../tools/ToolRegistry';
import { type UnifiedToolItem, type ToolCategory, UNIFIED_TOOL_ITEMS } from '../tools/unifiedTools';

export {
  ToolRegistry,
  type LatexSymbolItem,
  type LatexFormulaPreset,
  type ArithmeticToolItem,
  type EditorExecutionContext,
  type UnifiedToolItem,
  type ToolCategory,
  UNIFIED_TOOL_ITEMS,
};

/**
 * الحصول على نسخة السجل الموحد الفردية
 */
export function getUnifiedToolRegistry(): ToolRegistry {
  return ToolRegistry.getInstance();
}

/**
 * تنفيذ أداة مباشرة بنقرة فأرة
 */
export function executeUnifiedTool(toolId: string, context: EditorExecutionContext): boolean {
  return ToolRegistry.getInstance().executeTool(toolId, context);
}

/**
 * جلب أدوات LaTeX العلمية والرياضية المجمعة
 */
export function getScientificLatexTools(): {
  symbols: LatexSymbolItem[];
  formulas: LatexFormulaPreset[];
  calculators: ArithmeticToolItem[];
} {
  const registry = ToolRegistry.getInstance();
  return {
    symbols: registry.getLatexSymbols(),
    formulas: registry.getFormulaPresets(),
    calculators: registry.getArithmeticTools(),
  };
}

/**
 * تصيير كود LaTeX مباشرة إلى HTML نقي
 */
export function renderLatexToHtml(code: string, isBlock = true): string {
  return ToolRegistry.getInstance().renderLatexHtml(code, isBlock);
}

/**
 * تصيير كود LaTeX مباشرة إلى SVG متجهي نقي
 */
export function renderLatexToSvg(code: string, isBlock = true): string {
  return ToolRegistry.getInstance().renderLatexSvg(code, isBlock);
}
