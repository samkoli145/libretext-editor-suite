/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-unified-block.ts
 * 📂 المسار: packages/core/src/blocks/html-unified-block.ts
 * 🎯 الهدف الرئيسي: توحيد أدوات محرر Canva و PDF والمستندات الغنية ومحرر واجهة 
 *    المستخدم في كتلة HTML موحدة (Headless Core) قابلة للتوسع.
 * 📋 المعايير: Zero-Dependency, Pure Light Theme, Mouse-Only, < 50 lines/function.
 * 🧪 الاختبارات: packages/core/tests/blocks/html-unified-block.test.ts
 * 🏷️ المعرف: CORE-BLK-01
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Strategy Pattern + Headless Core + Plugin Architecture
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ممنوع استخدام eval أو Function constructor أبداً.
 *    2. يجب أن تظل كل دالة أقل من 50 سطراً.
 *    3. الترويسة الإلزامية يجب أن تبقى في رأس الملف دون تعديل.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من صحة المدخلات.
 *    - معالجة الأخطاء بصمت مع تسجيلها في Console.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: docs/INDEX.md
 *    - 📦 التبعيات: packages/core/src/types.ts
 *    - 📄 مرتبط مباشر: packages/adapters/src/react/html-adapter.tsx
 *    - 🧪 اختبارات: packages/core/tests/blocks/html-unified-block.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createUnifiedBlock: إنشاء كتلة موحدة جديدة (#L48)
 *    - registerTool: تسجيل أداة في الكتلة (#L65)
 *    - executeTool: تنفيذ أداة محددة بأمان (#L82)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم دمج أدوات Canva و PDF و Rich Text هنا لتقليل التكرار.
 *    - الحالة (State) مفصولة تماماً عن العرض (View).
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: نقل المنطق القديم تدريجياً عبر واجهات متوافقة.
 *    - 📖 مرجع تقني: AGENTS.md (القواعد الصارمة)
 *    - 🎯 التحسينات المستقبلية: إضافة دعم WebAssembly للمعالجة الثقيلة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: webpainter-next AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ToolType = 'canva' | 'pdf' | 'rich-text' | 'ui-designer';

export interface UnifiedTool {
  id: string;
  type: ToolType;
  name: string;
  execute: (payload: unknown) => Promise<unknown>;
}

export interface HtmlUnifiedBlock {
  id: string;
  tools: Map<string, UnifiedTool>;
  registerTool: (tool: UnifiedTool) => void;
  executeTool: (toolId: string, payload: unknown) => Promise<unknown>;
  getToolsByType: (type: ToolType) => UnifiedTool[];
}

function isValidTool(tool: unknown): tool is UnifiedTool {
  if (!tool || typeof tool !== 'object') return false;
  const t = tool as UnifiedTool;
  return typeof t.id === 'string' && typeof t.execute === 'function';
}

export function createUnifiedBlock(id: string): HtmlUnifiedBlock {
  const tools = new Map<string, UnifiedTool>();

  const registerTool = (tool: UnifiedTool) => {
    if (!isValidTool(tool)) {
      console.error('[UnifiedBlock] Invalid tool registration');
      return;
    }
    tools.set(tool.id, tool);
  };

  const executeTool = async (toolId: string, payload: unknown) => {
    const tool = tools.get(toolId);
    if (!tool) {
      throw new Error(`[UnifiedBlock] Tool '${toolId}' not found`);
    }
    return tool.execute(payload);
  };

  const getToolsByType = (type: ToolType): UnifiedTool[] => {
    return Array.from(tools.values()).filter((t) => t.type === type);
  };

  return { id, tools, registerTool, executeTool, getToolsByType };
}
