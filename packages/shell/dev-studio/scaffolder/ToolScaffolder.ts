// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [ToolScaffolder.ts] مولد الأدوات — من تعريف إلى تصحيحات جاهزة
//
// هذا الملف يحول تعريفاً بسيطاً (اسم، أيقونة، فئة، إجراء)
// إلى مجموعة تصحيحات جاهزة للتطبيق عبر خط الأنابيب.
//
// المبدأ: "One-Click Registration".
// المستخدم يدخل التعريف، المولد ينتج كل التصحيحات اللازمة:
// 1. تسجيل الأداة في السجل
// 2. ربطها بالمحررات المدعومة
// 3. تحديث السجلات المركزية (Components and Properties.md)
//
// ⚠️ المولد لا يطبق شيئاً. ينتج تصحيحات فقط.
// التطبيق يحدث عبر TaskPipeline، الذي يفحص ويلتقط ويختبر.
//
// من rowcol.ts: "EVERY FUNCTION HERE IS A PATCH FACTORY".
// من story.ts: "captureStep freezes the view as data".
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import {
  type DevStudioPatch,
  type ToolDefinition,
  type ToolCategory,
  type EditorTarget,
  COPYRIGHT_YEAR,
} from '../core/DevStudioTypes';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// تعريف الإدخال — ما يقدمه المستخدم
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تعريف أداة جديد — الحد الأدنى المطلوب.
 *
 * ⚠️ الحقول المضافة: الغياب يعني "لا".
 * أداة بلا shortcut ليس لها حقل shortcut، ليس shortcut: ''.
 */
export interface ToolInput {
  /** معرف فريد — أحرف صغيرة، أرقام، شرطات */
  id: string;
  /** الاسم الظاهر — يُترجم لاحقاً */
  name: string;
  /** أيقونة SVG مضمنة — لا مراجع خارجية */
  icon: string;
  /** الفئة — واحدة من الـ 23 */
  category: ToolCategory;
  /** المحررات المدعومة — ['all'] أو قائمة محددة */
  editors: EditorTarget[];
  /** معرف الإجراء — يُحل وقت التنفيذ، لا يُخزن كدالة */
  actionId: string;
  /** اختياري: اختصار لوحة المفاتيح */
  shortcut?: string;
  /** اختياري: وصف */
  description?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المولد
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * مولد الأدوات.
 *
 * كل دالة هنا مصنع تصحيحات. لا تطبيق، لا تعديل مباشر.
 */
export class ToolScaffolder {
  /**
   * دالة مساعدة سريعة متوافقة مع لوحات التحكم
   */
  static scaffoldTool(params: {
    id: string;
    name: string;
    titleAr?: string;
    titleEn?: string;
    category?: ToolCategory;
    categoryAr?: string;
    icon?: string;
    shortcut?: string;
    description?: string;
    descriptionAr?: string;
    actionId?: string;
    editors?: EditorTarget[];
    keywords?: string[];
  }): DevStudioPatch[] {
    const rawId = params.id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const validId = /^[a-z][a-z0-9-]*$/.test(rawId) ? rawId : `tool-${Date.now()}`;
    const scaffolder = new ToolScaffolder();

    return scaffolder.generate({
      id: validId,
      name: params.name || params.titleEn || validId,
      icon:
        params.icon ||
        '<svg viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor"/></svg>',
      category: params.category || 'custom',
      editors: params.editors || ['all'],
      actionId: params.actionId || `action:${validId}`,
      shortcut: params.shortcut,
      description: params.description || params.descriptionAr,
    });
  }

  /**
   * التحقق من تعريف الإدخال.
   *
   * ⚠️ يرمي استثناء بصوت عالٍ — من rowcol.ts:
   * "refusing loudly is the point".
   */
  validate(input: ToolInput): void {
    if (!input.id || !/^[a-z][a-z0-9-]*$/.test(input.id)) {
      throw new Error(
        `[ToolScaffolder] معرف غير صالح: "${input.id}" — ` +
          `يجب أن يبدأ بحرف صغير ويحتوي فقط على أحرف صغيرة وأرقام وشرطات`,
      );
    }
    if (!input.name.trim()) {
      throw new Error('[ToolScaffolder] الاسم مطلوب');
    }
    if (!input.icon.includes('<svg')) {
      throw new Error(
        '[ToolScaffolder] الأيقونة يجب أن تكون SVG مضمنة — ' +
          'لا مراجع خارجية، لا روابط، لا صور نقطية',
      );
    }
    if (input.editors.length === 0) {
      throw new Error('[ToolScaffolder] يجب تحديد محرر واحد على الأقل');
    }
    if (!input.actionId.trim()) {
      throw new Error('[ToolScaffolder] معرف الإجراء مطلوب');
    }
  }

  /**
   * توليد كل التصحيحات اللازمة لتسجيل أداة جديدة.
   *
   * ⚠️ القاعدة: المولد ينتج تصحيحات، لا يطبقها.
   * التطبيق عبر TaskPipeline، الذي يفحص ويلتقط ويختبر.
   *
   * الترتيب مهم — من rowcol.ts: "the overrides go in the SAME
   * commit, before the rows". هنا: التسجيل قبل الربط،
   * لأن الربط يعتمد على وجود الأداة في السجل.
   */
  generate(input: ToolInput): DevStudioPatch[] {
    this.validate(input);

    const definition: ToolDefinition = {
      id: input.id,
      name: input.name,
      icon: input.icon,
      category: input.category,
      editors: input.editors,
      actionId: input.actionId,
      // الحقول المضافة: الغياب يعني "لا"
      ...(input.shortcut ? { shortcut: input.shortcut } : {}),
      ...(input.description ? { description: input.description } : {}),
    };

    const patches: DevStudioPatch[] = [];

    // 1. تسجيل الأداة في السجل
    patches.push({
      op: 'registerTool',
      toolId: input.id,
      definition,
      inverse: { op: 'unregisterTool', toolId: input.id, definition },
    });

    // 2. تحديث سجل المكونات (Components and Properties.md)
    // هذا يُطبق كتحديث سجل، ليس كملف مباشر
    patches.push({
      op: 'updateRegistry',
      registry: 'components',
      props: {
        [input.id]: {
          name: input.name,
          category: input.category,
          path: `src/shared/tools/${input.id}.ts`,
          editors: input.editors,
          registeredAt: Date.now(),
          copyrightYear: COPYRIGHT_YEAR,
        },
      },
      inverse: {
        op: 'updateRegistry',
        registry: 'components',
        props: {},
        drop: [input.id],
      },
    });

    return patches;
  }

  /**
   * توليد تصحيحات إزالة أداة.
   *
   * ⚠️ من rowcol.ts: الحذف يأخذ كل شيء معه.
   * إزالة أداة تزيل: التسجيل، الروابط، سجل المكونات.
   * لا أيتام.
   */
  generateRemoval(toolId: string, currentDefinition: ToolDefinition): DevStudioPatch[] {
    return [
      // 1. فك الربط (يأخذ كل الروابط معه)
      {
        op: 'unregisterTool',
        toolId,
        definition: currentDefinition,
        inverse: { op: 'registerTool', toolId, definition: currentDefinition },
      },
      // 2. إزالة من سجل المكونات
      {
        op: 'updateRegistry',
        registry: 'components',
        props: {},
        drop: [toolId],
        inverse: {
          op: 'updateRegistry',
          registry: 'components',
          props: {
            [toolId]: {
              name: currentDefinition.name,
              category: currentDefinition.category,
              path: `src/shared/tools/${toolId}.ts`,
              editors: currentDefinition.editors,
            },
          },
        },
      },
    ];
  }
}

export const globalToolScaffolder = new ToolScaffolder();
