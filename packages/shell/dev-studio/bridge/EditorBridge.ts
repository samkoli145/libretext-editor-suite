// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [EditorBridge.ts] جسر ربط الأدوات والمكونات بالمحررات الأربعة
//
// هذا الملف يجيب سؤالاً واحداً: "كيف تصل أداة جديدة إلى كل
// محرر دون كتابة كود ربط يدوي في كل مكان؟"
//
// المبادئ الموروثة:
//
// 1. من rowcol.ts — PATCH FACTORY:
//    الربط والفك ينتجان تصحيحات، لا يعدلان الحالة مباشرة.
//    هذا ما يجعل الربط قابلاً للتراجع، قابلاً للتسلسل.
//
// 2. من story.ts — DERIVED, NEVER STORED:
//    قائمة الأدوات المتاحة لمحرر تُشتق من السجل + الفلاتر،
//    لا تُخزن في المحرر. محرر يُخزن أدواته ينسخ السجل،
//    والنسخ تنفصل عن الأصل.
//
// 3. من grid.ts — READS THROUGH AN ORDER VECTOR:
//    المحرر يقرأ الأدوات عبر مرشح (editor target)، لا عبر
//    قائمة مخزنة. هذا ما يجعل أداة جديدة تظهر تلقائياً.
//
// 4. من select.ts — A SELECTION IS DATA:
//    حالة الربط (أي أداة في أي محرر) بيانات، لا DOM.
//    الواجهة ترسم ما تقوله البيانات، لا العكس.
//
// التنبيهات:
// - الربط بالـ toolId، لا بالاسم (الهوية لا تُعاد)
// - فك الربط يأخذ كل الأيتام معه (لا روابط يتيمة)
// - المحررات الأربعة: canvas, ui, richtext, pdf
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import type { DevStudioPatch, ToolDefinition, EditorTarget, ComponentCategory } from '../core/DevStudioTypes';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الواجهات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * ربط أداة بمحرر — بيانات، لا DOM.
 *
 * ⚠️ الهوية: الربط يتتبع toolId، لا الاسم.
 * أداة تُحذف ثم تُنشأ بنفس الاسم لا ترث روابط القديمة.
 * نفس مبدأ rowcol.ts: "A RID IS NEVER REUSED".
 */
export interface ToolMount {
  toolId: string;
  editor: EditorTarget;
  /** الفئة تُستخدم للفرز في الواجهة */
  category: ComponentCategory;
  /** ترتيب الأداة ضمن فئتها */
  order: number;
  mountedAt: number;
}

/**
 * السجل المركزي للأدوات — المصدر الوحيد للحقيقة.
 *
 * ⚠️ من story.ts: "SERIES ARE DERIVED, NEVER STORED".
 * المحررات لا تخزن أدواتها. تقرأ من هذا السجل عبر مرشح.
 */
export interface ToolRegistry {
  tools: Map<string, ToolDefinition>;
  mounts: ToolMount[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الجسر
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * جسر المحررات.
 *
 * المسؤوليات:
 * 1. ربط أداة بمحرر (ينتج Patch)
 * 2. فك ربط أداة (ينتج Patch + ينظف الأيتام)
 * 3. استعلام الأدوات المتاحة لمحرر (اشتقاق، لا تخزين)
 */
export class EditorBridge {
  private registry: ToolRegistry = {
    tools: new Map(),
    mounts: [],
  };
  private mountSeq = 0;

  // ── الربط ────────────────────────────────────────────────

  /**
   * ربط أداة بمحرر — مصنع تصحيح.
   *
   * ⚠️ يرمي استثناء بصوت عالٍ إذا:
   * - الأداة غير موجودة في السجل
   * - الربط موجود بالفعل (لا ربط مزدوج)
   * - المحرر غير صالح
   *
   * من rowcol.ts: "a duplicate column id is REFUSED — two columns
   * sharing one data key is silent overwriting".
   */
  mountTool(toolId: string, editor: EditorTarget, category: ComponentCategory): DevStudioPatch {
    const tool = this.registry.tools.get(toolId);
    if (!tool) {
      throw new Error(`[EditorBridge] الأداة "${toolId}" غير موجودة في السجل`);
    }

    // لا ربط مزدوج
    const existing = this.registry.mounts.find(
      m => m.toolId === toolId && (m.editor === editor || m.editor === 'all' || editor === 'all'),
    );
    if (existing) {
      throw new Error(
        `[EditorBridge] الأداة "${toolId}" مرتبطة بالفعل بـ "${existing.editor}"`,
      );
    }

    // التحقق من أن الأداة تدعم هذا المحرر
    if (tool.editors.length > 0 && !tool.editors.includes(editor) && !tool.editors.includes('all')) {
      throw new Error(
        `[EditorBridge] الأداة "${toolId}" لا تدعم المحرر "${editor}"`,
      );
    }

    const mount: ToolMount = {
      toolId,
      editor,
      category,
      order: this.mountSeq++,
      mountedAt: Date.now(),
    };

    // نطبق محلياً (الخط سيapply عبر المشروع في السياق الكامل)
    this.registry.mounts.push(mount);

    return {
      op: 'registerTool',
      toolId,
      definition: tool,
      inverse: { op: 'unregisterTool', toolId },
    };
  }

  /**
   * فك ربط أداة — مصنع تصحيح + تنظيف الأيتام.
   *
   * ⚠️ من rowcol.ts: "deleteColumn takes its overrides with it,
   * in the same commit". فك الربط يأخذ كل الروابط المرتبطة
   * بالأداة، لا يترك أيتاماً.
   */
  unmountTool(toolId: string): DevStudioPatch[] {
    const tool = this.registry.tools.get(toolId);
    if (!tool) {
      throw new Error(`[EditorBridge] الأداة "${toolId}" غير موجودة`);
    }

    // إزالة كل الروابط المرتبطة بهذه الأداة
    const before = this.registry.mounts.length;
    this.registry.mounts = this.registry.mounts.filter(m => m.toolId !== toolId);
    const removed = before - this.registry.mounts.length;

    if (removed === 0) {
      // لا شيء للفك — لا تصحيح فارغ
      // من rowcol.ts: "inserting zero rows produces NO patch"
      return [];
    }

    return [{
      op: 'unregisterTool',
      toolId,
      definition: tool,
      inverse: { op: 'registerTool', toolId, definition: tool },
    }];
  }

  /**
   * تسجيل أداة في السجل — يجب أن يحدث قبل الربط.
   */
  registerTool(tool: ToolDefinition): void {
    if (this.registry.tools.has(tool.id)) {
      throw new Error(`[EditorBridge] الأداة "${tool.id}" مسجلة بالفعل`);
    }
    this.registry.tools.set(tool.id, tool);
  }

  /**
   * إلغاء تسجيل أداة — يزيلها ويفك كل روابطها.
   *
   * ⚠️ نفس مبدأ deleteColumn: الأداة تأخذ روابطها معها.
   */
  unregisterTool(toolId: string): DevStudioPatch[] {
    if (!this.registry.tools.has(toolId)) {
      throw new Error(`[EditorBridge] الأداة "${toolId}" غير مسجلة`);
    }

    const unmountPatches = this.unmountTool(toolId);
    this.registry.tools.delete(toolId);

    return unmountPatches;
  }

  // ── الاستعلامات (اشتقاق، لا تخزين) ────────────────────────

  /**
   * الأدوات المتاحة لمحرر معين.
   *
   * ⚠️ من grid.ts: "IT READS THROUGH AN ORDER VECTOR".
   * المحرر يقرأ عبر مرشح، لا من قائمة مخزنة.
   * أداة جديدة تُسجل تظهر تلقائياً دون أي كود إضافي.
   */
  toolsForEditor(editor: EditorTarget): ToolDefinition[] {
    const mountedIds = new Set(
      this.registry.mounts
        .filter(m => m.editor === editor || m.editor === 'all' || editor === 'all')
        .map(m => m.toolId),
    );

    const result: ToolDefinition[] = [];
    for (const [id, tool] of this.registry.tools) {
      if (mountedIds.has(id)) {
        result.push(tool);
      } else if (tool.editors.includes(editor) || tool.editors.includes('all')) {
        // أداة تدعم المحرر لكنها غير مربوطة بعد
        // تُعرض كمتاحة للربط
        result.push(tool);
      }
    }

    // ترتيب حسب الفئة ثم الترتيب
    const mountOrder = new Map(
      this.registry.mounts.map(m => [m.toolId, m.order]),
    );
    return result.sort((a, b) => {
      const aCat = this.registry.mounts.find(m => m.toolId === a.id)?.category ?? 'custom';
      const bCat = this.registry.mounts.find(m => m.toolId === b.id)?.category ?? 'custom';
      if (aCat !== bCat) return aCat.localeCompare(bCat);
      return (mountOrder.get(a.id) ?? 0) - (mountOrder.get(b.id) ?? 0);
    });
  }

  /**
   * الأدوات حسب الفئة — للوحة السحب والإفلات.
   */
  toolsByCategory(category: ComponentCategory): ToolDefinition[] {
    const result: ToolDefinition[] = [];
    for (const [id, tool] of this.registry.tools) {
      const mount = this.registry.mounts.find(m => m.toolId === id);
      if (mount?.category === category) {
        result.push(tool);
      }
    }
    return result;
  }

  /**
   * هل الأداة مربوطة بمحرر؟
   */
  isMounted(toolId: string, editor?: EditorTarget): boolean {
    return this.registry.mounts.some(
      m => m.toolId === toolId && (!editor || m.editor === editor || m.editor === 'all'),
    );
  }

  /**
   * عدد الأدوات المسجلة.
   */
  get toolCount(): number {
    return this.registry.tools.size;
  }

  /**
   * عدد الروابط النشطة.
   */
  get mountCount(): number {
    return this.registry.mounts.length;
  }

  // ── الصيانة ────────────────────────────────────────────────

  /**
   * تنظيف الأيتام: روابط تشير لأدوات غير موجودة.
   *
   * ⚠️ من rowcol.ts: هذا هو نفس مبدأ deleteColumn الذي
   * يأخذ التجاوزات معه. روابط يتيمة هي أرقام خاطئة
   * ترتدي ملابس أرقام صحيحة.
   */
  cleanOrphans(): number {
    const before = this.registry.mounts.length;
    this.registry.mounts = this.registry.mounts.filter(
      m => this.registry.tools.has(m.toolId),
    );
    return before - this.registry.mounts.length;
  }

  /**
   * إعادة تعيين كاملة (للاختبارات).
   */
  reset(): void {
    this.registry.tools.clear();
    this.registry.mounts = [];
    this.mountSeq = 0;
  }
}

export const globalEditorBridge = new EditorBridge();
