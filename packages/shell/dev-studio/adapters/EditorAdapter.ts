// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [EditorAdapter.ts] العقد المشترك لمحولات المحررات وسجلها
 *
 * هذا الملف يجيب: "كيف يركب الاستوديو أداة في محرر لا يعرفه؟"
 *
 * المبدأ الحاكم (من select.ts):
 * "A SELECTION IS DATA. Nothing here touches the DOM." — المحول
 * يصف التركيب، لا ينفذه. يولد MountSpec، والواجهة ترسم.
 * هذا ما يجعل المحولات قابلة للاختبار في node بدون DOM.
 *
 * المبدأ الثاني (من story.ts قاعدة 2):
 * "SERIES ARE DERIVED, NEVER STORED" — قائمة الأدوات المركبة
 * تُشتق من السجل، لا تُخزن. محول يخزن قائمته سينفصل عن
 * السجل لحظة إضافة أداة يدوياً.
 *
 * المبدأ الثالث (من rowcol.ts):
 * "BOUNDS CLAMP, IDENTITY REFUSES" — أداة غير صالحة ترفض،
 * تركيب في موقع غير صالح يُقص. الرفض بصوت عالٍ.
 *
 * المبدأ الرابع (من select.ts):
 * "NULL IS THE IMPORTANT RETURN" — أداة غير موجودة تعيد null،
 * لا استثناء. المحول الذي يرمي على كل سؤال يبتلع الأسئلة
 * التي يجب أن تصل لغيره.
 *
 * التنبيهات:
 * - المحول لا يعدل المحرر مباشرة (مصنع مواصفات، لا محرر)
 * - الثيم الفاتح النقي 100% في كل واجهة تركيب
 * - دعم الزر الأيمن إلزامي في كل محول
 * - كل الأدوات الموحدة تظهر في كل المحررات (الميثاق)
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import type { EditorTarget, ToolDefinition } from '../core/DevStudioTypes';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الأنواع — ما يصفه المحول
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * مواصفة تركيب — بيانات تصف كيف تظهر أداة في محرر.
 *
 * ⚠️ هذه بيانات، لا DOM. المحول يولدها، والواجهة ترسمها.
 * نفس مبدأ select.ts: التحديد بيانات، والشبكة ترسم ما يقوله.
 *
 * الحقول المضافة: الغياب يعني "لا".
 * أداة بلا shortcut ليس لها `shortcut: ''`، بل لا حقل أصلاً.
 */
export interface MountSpec {
  toolId: string;
  editor: EditorTarget;
  /** الموقع في الشريط — يُقص للحدود، لا يرمي (BOUNDS CLAMP) */
  position: number;
  /** المجموعة — للتجميع في Ribbon أو لوحة المكونات */
  group: string;
  /** التسمية الظاهرة */
  label: string;
  /** الأيقونة SVG المضمنة */
  icon: string;
  /** معرف الإجراء — يُحل وقت التنفيذ، لا يُخزن كدالة */
  actionId: string;
  /** additive: موجودة فقط إن كانت مفيدة */
  shortcut?: string;
  /** additive: وصف للعنصر النائب (tooltip) */
  description?: string;
}

/**
 * عنصر قائمة الزر الأيمن — موحدة عبر كل المحولات.
 *
 * ⚠️ إلزامي من الميثاق: "دعم الماوس (with right-click
 * functionality and options)". كل محول يجب أن يوفرها.
 */
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  action: () => void;
}

/**
 * نتيجة تركيب.
 *
 * ⚠️ الحقول المضافة: الغياب يعني "لا".
 * فشل بلا سبب لا يحمل `reason: ''`، بل لا حقل أصلاً.
 */
export interface MountResult {
  ok: boolean;
  /** additive: موجودة فقط عند الفشل */
  reason?: string;
  /** additive: موجودة فقط عند النجاح */
  spec?: MountSpec;
}

/**
 * تحقق من صلاحية أداة لمحرر.
 */
export interface ValidationResult {
  valid: boolean;
  /** additive: موجودة فقط عند الرفض */
  reason?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// العقد المشترك — ما ينفذه كل محول
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * محول محرر — العقد المشترك.
 *
 * كل محرر (canvas, ui, richtext, pdf) ينفذ هذا العقد بطريقته.
 * الاستوديو لا يعرف التفاصيل — يعرف فقط العقد.
 *
 * ⚠️ المبدأ: المحول يصف، لا ينفذ.
 * mountTool يعيد MountSpec، لا يعدل المحرر.
 * هذا ما يجعل المحولات قابلة للاختبار بدون DOM.
 */
export interface EditorAdapter {
  /** معرف المحرر الذي يخدمه هذا المحول */
  readonly editorId: EditorTarget;

  /**
   * تركيب أداة — يعيد مواصفة، أو null إن لم تكن صالحة.
   *
   * ⚠️ NULL IS THE IMPORTANT RETURN: أداة غير صالحة تعيد null،
   * لا استثناء. الرفض الاستثنائي يكسر الأسئلة التي يجب أن
   * تصل لغيرها.
   */
  mountTool(toolId: string, definition: ToolDefinition): MountSpec | null;

  /** فك أداة — يعيد true إن كانت مركبة، false إن لم تكن. */
  unmountTool(toolId: string): boolean;

  /** ما المركب حالياً — يُشتق، لا يُخزن. */
  getMountedTools(): string[];

  /** هل الأداة صالحة لهذا المحرر؟ */
  validateTool(tool: ToolDefinition): ValidationResult;

  /** عناصر قائمة الزر الأيمن لأداة — إلزامي من الميثاق. */
  getContextMenuItems(toolId: string): ContextMenuItem[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// السجل — يدير المحولات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * سجل المحولات.
 *
 * المسؤوليات:
 * 1. تسجيل محول لكل محرر
 * 2. تركيب أداة في كل المحررات الداعمة لها
 * 3. توفير المحول المناسب عند السؤال
 *
 * ⚠️ المبدأ: السجل يدير، لا ينفذ.
 * التركيب الفعلي يحدث في كل محول على حدة.
 */
export class AdapterRegistry {
  private adapters = new Map<EditorTarget, EditorAdapter>();

  /**
   * تسجيل محول.
   *
   * ⚠️ الرفض بصوت عالٍ: محرر مسجل مسبقاً يرفض.
   * محولان لمحرر واحد يعنيان تركيبين متضاربين.
   */
  register(adapter: EditorAdapter): void {
    if (this.adapters.has(adapter.editorId)) {
      throw new Error(`[AdapterRegistry] editor "${adapter.editorId}" already has an adapter`);
    }
    this.adapters.set(adapter.editorId, adapter);
  }

  /**
   * الحصول على محول محرر.
   *
   * ⚠️ NULL IS THE IMPORTANT RETURN: محرر غير مسجل يعيد null.
   */
  get(editor: EditorTarget): EditorAdapter | null {
    return this.adapters.get(editor) ?? null;
  }

  /** المحولات المسجلة كلها. */
  all(): EditorAdapter[] {
    return [...this.adapters.values()];
  }

  /**
   * تركيب أداة في كل المحررات الداعمة لها.
   *
   * ⚠️ المبدأ من الميثاق: "كل الأدوات تظهر في كل واجهة".
   * أداة editors:['all'] تُركب في كل المحررات المسجلة.
   * أداة editors:['canvas','ui'] تُركب فيهما فقط.
   *
   * الرفض بصوت عالٍ: أداة لا يدعمها أي محرر مسجل ترفض.
   */
  mountToAll(toolId: string, definition: ToolDefinition): MountResult[] {
    const targets = this.resolveTargets(definition.editors);
    if (targets.length === 0) {
      throw new Error(`[AdapterRegistry] tool "${toolId}" supports no registered editor`);
    }

    const results: MountResult[] = [];
    for (const target of targets) {
      const adapter = this.adapters.get(target);
      if (!adapter) continue;

      const spec = adapter.mountTool(toolId, definition);
      results.push(
        spec
          ? { ok: true, spec }
          : { ok: false, reason: `adapter "${target}" refused "${toolId}"` },
      );
    }
    return results;
  }

  /**
   * فك أداة من كل المحررات.
   */
  unmountFromAll(toolId: string, editors: EditorTarget[]): void {
    const targets = this.resolveTargets(editors);
    for (const target of targets) {
      this.adapters.get(target)?.unmountTool(toolId);
    }
  }

  /**
   * حل قائمة المحررات المستهدفة.
   *
   * 'all' يتوسع لكل المحررات المسجلة.
   * قائمة محددة تُرشح للمسجلة فقط.
   */
  private resolveTargets(editors: EditorTarget[]): EditorTarget[] {
    const registered = [...this.adapters.keys()];
    if (editors.includes('all')) return registered;
    return editors.filter((e) => e !== 'all' && registered.includes(e));
  }
}

/** معرَّضة للاختبارات، كما تفعل rowcol.ts. */
export const _adapterInternals = {};
