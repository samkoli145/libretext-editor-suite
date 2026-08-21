/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: contextMenuEngine.ts
 * 📂 المسار: packages/core/src/contextMenuEngine.ts
 * 🎯 الهدف الرئيسي: نظام تسجيل وقوائم سياقية ديناميكية ذكية (Context Menu Registry)
 *    للأزرار والقوائم الفرعية والفواصل بحسب نوع الكائن المحدد على لوحة الرسم (Artboard).
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية (Zero-Dependency Headless Core).
 *    - دعم كامل للتفاعل بالماوس فقط (Mouse-Only Interactions) مع النقر بالزر الأيمن.
 *    - دعم القوائم الفرعية (Submenus) والفواصل (Separators) والأوامر (Actions).
 *    - دوال نقية بأقل من 50 سطراً لكل دالة.
 * 🧪 الاختبارات: tests/context-menu-engine.test.ts
 * 🏷️ المعرف: CORE-012
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dynamic Rule-Based Context Menu Registry: سجل قائم على مطابقة نوع الكائن
 *    مع تنقية الفواصل الزائدة وتقييم الشروط اللحظية والحساب التلقائي للأولويات.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تجاوز 50 سطر في أي دالة واحدة.
 *    2. تنظيف الفواصل المتتالية أو الواقعة في البداية والنهاية تلقائياً.
 *    3. التعامل الدفاعي مع المعاملات غير المعرفة أو الاستثناءات في المعالجات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص Type Guards لجميع عناصر القائمة.
 *    - حماية استدعاء دوال المعالجة (Error Boundary / Safe Execution).
 *    - تقييم آمن للشروط والوظائف الديناميكية (Visibility & Disabled Guards).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/core/src/index.ts
 *    - 📦 التبعيات: لا توجد تبعيات خارجية
 *    - 📄 مرتبط مباشر: packages/core/src/engines/mouse-tooling-engine.ts
 *    - 🧪 اختبارات: packages/core/tests/context-menu.test.ts
 *    - 📚 مراجع: AGENTS.md
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createContextMenuEngine: مصنع لإنشاء سجل قوائم سياقية جديد (#L145)
 *    - register: تسجيل قواعد أو عناصر لقائمة سياقية (#L170)
 *    - getMenuItems: استخراج وترتيب وتصفية عناصر القائمة للسياق النشط (#L205)
 *    - executeItem: تنفيذ أمر من القائمة بالسياق المحدد (#L255)
 *    - sanitizeMenuSeparators: تنقية الفواصل الزائدة والمتتالية (#L280)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يدعم المحررات الأربعة (Writer, Calc, Impress, Base) بالإضافة لمصمم الكانفا.
 *    - متوافق 100% مع الثيم الفاتح النقي وتجربة النقر بالزر الأيمن بالفأرة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: تسجيل مسبق للأوامر القياسية وإمكانية التخصيص من الإضافات.
 *    - 📖 مرجع تقني: VSCode Context Menu API + Figma Context Menu Engine.
 *    - 🎯 التحسينات المستقبلية: دعم تسجيل أيقونات SVG مخصصة وحساب أبعاد القائمة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد (تصميم أصيل).
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── تعريفات الأنواع والواجهات (Types & Interfaces) ───

export type ContextMenuItemType = 'action' | 'submenu' | 'separator';

export interface ContextMenuPosition {
  readonly x: number;
  readonly y: number;
}

export interface ContextMenuContext<T = unknown> {
  readonly targetType: string;
  readonly selectedObjects: readonly T[];
  readonly primaryObject?: T;
  readonly position: ContextMenuPosition;
  readonly canvasState?: unknown;
  readonly services?: unknown;
  readonly customData?: Readonly<Record<string, unknown>>;
}

export type DynamicValue<T> = T | ((ctx: ContextMenuContext) => T);

export interface BaseMenuItem {
  readonly id: string;
  readonly type?: ContextMenuItemType;
  readonly order?: number;
  readonly group?: string;
  readonly visible?: DynamicValue<boolean>;
}

export interface ActionMenuItem extends BaseMenuItem {
  readonly type?: 'action';
  readonly label: string;
  readonly labelAr?: string;
  readonly iconName?: string;
  readonly shortcut?: string;
  readonly danger?: boolean;
  readonly disabled?: DynamicValue<boolean>;
  readonly checked?: DynamicValue<boolean>;
  readonly handler: (ctx: ContextMenuContext) => void | Promise<void>;
}

export interface SubmenuMenuItem extends BaseMenuItem {
  readonly type: 'submenu';
  readonly label: string;
  readonly labelAr?: string;
  readonly iconName?: string;
  readonly disabled?: DynamicValue<boolean>;
  readonly items: ContextMenuItem[] | ((ctx: ContextMenuContext) => ContextMenuItem[]);
}

export interface SeparatorMenuItem extends BaseMenuItem {
  readonly type: 'separator';
}

export type ContextMenuItem = ActionMenuItem | SubmenuMenuItem | SeparatorMenuItem;

export type ResolvedMenuItem =
  | (Omit<ActionMenuItem, 'visible' | 'disabled' | 'checked'> & {
      readonly type: 'action';
      readonly disabled: boolean;
      readonly checked?: boolean;
    })
  | (Omit<SubmenuMenuItem, 'visible' | 'disabled' | 'items'> & {
      readonly type: 'submenu';
      readonly disabled: boolean;
      readonly items: readonly ResolvedMenuItem[];
    })
  | (SeparatorMenuItem & { readonly type: 'separator' });

export type TargetMatcher =
  | string
  | readonly string[]
  | ((ctx: ContextMenuContext) => boolean);

export interface ContextMenuRegistration {
  readonly id: string;
  readonly target: TargetMatcher;
  readonly priority?: number;
  readonly items: ContextMenuItem[] | ((ctx: ContextMenuContext) => ContextMenuItem[]);
}

export interface ContextMenuEngine {
  register(registration: ContextMenuRegistration): () => void;
  registerAction(
    target: TargetMatcher,
    item: Omit<ActionMenuItem, 'type'>
  ): () => void;
  registerSubmenu(
    target: TargetMatcher,
    item: Omit<SubmenuMenuItem, 'type'>
  ): () => void;
  registerSeparator(
    target: TargetMatcher,
    options?: { id?: string; order?: number; group?: string }
  ): () => void;
  getMenuItems(context: ContextMenuContext): readonly ResolvedMenuItem[];
  executeItem(itemId: string, context: ContextMenuContext): Promise<boolean>;
  unregister(registrationId: string): boolean;
  clear(): void;
  size(): number;
}

// ─── دوال مساعدة دفاعية للتقييم والتطابق ───

function evaluateDynamicBool(val: DynamicValue<boolean> | undefined, ctx: ContextMenuContext, defaultVal: boolean): boolean {
  if (val === undefined) return defaultVal;
  if (typeof val === 'function') {
    try {
      return Boolean(val(ctx));
    } catch {
      return defaultVal;
    }
  }
  return Boolean(val);
}

function matchesTarget(target: TargetMatcher, ctx: ContextMenuContext): boolean {
  if (typeof target === 'string') {
    return target === '*' || target === ctx.targetType;
  }
  if (Array.isArray(target)) {
    return target.includes('*') || target.includes(ctx.targetType);
  }
  if (typeof target === 'function') {
    try {
      return Boolean(target(ctx));
    } catch {
      return false;
    }
  }
  return false;
}

function sortMenuItems<T extends { order?: number }>(items: T[]): T[] {
  return items.slice().sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

// ─── تنقية الفواصل المتعاقبة والزائدة ───

export function sanitizeMenuSeparators(items: readonly ResolvedMenuItem[]): readonly ResolvedMenuItem[] {
  const result: ResolvedMenuItem[] = [];
  let lastWasSeparator = true;

  for (const item of items) {
    if (item.type === 'separator') {
      if (!lastWasSeparator) {
        result.push(item);
        lastWasSeparator = true;
      }
    } else {
      result.push(item);
      lastWasSeparator = false;
    }
  }

  const last = result[result.length - 1];
  if (result.length > 0 && last !== undefined && last.type === 'separator') {
    result.pop();
  }

  return Object.freeze(result);
}

// ─── دالة حل عناصر القوائم وتوليدها للشجرة ───

function resolveSingleMenuItem(
  rawItem: ContextMenuItem,
  ctx: ContextMenuContext,
  actionRegistry: Map<string, ActionMenuItem>
): ResolvedMenuItem | null {
  const isVisible = evaluateDynamicBool(rawItem.visible, ctx, true);
  if (!isVisible) return null;

  if (rawItem.type === 'separator') {
    return { ...rawItem, type: 'separator' };
  }

  const isDisabled = evaluateDynamicBool(rawItem.disabled, ctx, false);

  if (rawItem.type === 'submenu') {
    const rawSubItems = typeof rawItem.items === 'function' ? rawItem.items(ctx) : rawItem.items;
    const resolvedSub = resolveMenuItemsList(rawSubItems || [], ctx, actionRegistry);
    return {
      id: rawItem.id,
      type: 'submenu',
      label: rawItem.label,
      labelAr: rawItem.labelAr,
      iconName: rawItem.iconName,
      order: rawItem.order,
      group: rawItem.group,
      disabled: isDisabled,
      items: resolvedSub,
    };
  }

  const isChecked = rawItem.checked !== undefined ? evaluateDynamicBool(rawItem.checked, ctx, false) : undefined;
  actionRegistry.set(rawItem.id, rawItem);

  return {
    id: rawItem.id,
    type: 'action',
    label: rawItem.label,
    labelAr: rawItem.labelAr,
    iconName: rawItem.iconName,
    shortcut: rawItem.shortcut,
    danger: rawItem.danger,
    order: rawItem.order,
    group: rawItem.group,
    disabled: isDisabled,
    checked: isChecked,
    handler: rawItem.handler,
  };
}

function resolveMenuItemsList(
  items: readonly ContextMenuItem[],
  ctx: ContextMenuContext,
  actionRegistry: Map<string, ActionMenuItem>
): readonly ResolvedMenuItem[] {
  const sorted = sortMenuItems(items.slice());
  const resolved: ResolvedMenuItem[] = [];

  for (const item of sorted) {
    const res = resolveSingleMenuItem(item, ctx, actionRegistry);
    if (res) resolved.push(res);
  }

  return sanitizeMenuSeparators(resolved);
}

// ─── المحرك الرئيسي لسجل القوائم السياقية ───

export function createContextMenuEngine(): ContextMenuEngine {
  const registrations = new Map<string, ContextMenuRegistration>();
  const actionRegistry = new Map<string, ActionMenuItem>();
  let nextAutoId = 1;

  function generateRegistrationId(): string {
    return `ctx-reg-${Date.now().toString(36)}-${(nextAutoId++).toString(36)}`;
  }

  function register(registration: ContextMenuRegistration): () => void {
    const id = registration.id || generateRegistrationId();
    registrations.set(id, { ...registration, id });
    return () => unregister(id);
  }

  function unregister(registrationId: string): boolean {
    return registrations.delete(registrationId);
  }

  function registerAction(target: TargetMatcher, item: Omit<ActionMenuItem, 'type'>): () => void {
    const actionItem: ActionMenuItem = { ...item, type: 'action' };
    return register({
      id: `action-${item.id}-${Date.now().toString(36)}`,
      target,
      items: [actionItem],
    });
  }

  function registerSubmenu(target: TargetMatcher, item: Omit<SubmenuMenuItem, 'type'>): () => void {
    const submenuItem: SubmenuMenuItem = { ...item, type: 'submenu' };
    return register({
      id: `submenu-${item.id}-${Date.now().toString(36)}`,
      target,
      items: [submenuItem],
    });
  }

  function registerSeparator(
    target: TargetMatcher,
    options?: { id?: string; order?: number; group?: string }
  ): () => void {
    const sepId = options?.id || `sep-${Date.now().toString(36)}-${(nextAutoId++).toString(36)}`;
    const separatorItem: SeparatorMenuItem = {
      id: sepId,
      type: 'separator',
      order: options?.order,
      group: options?.group,
    };
    return register({
      id: `reg-${sepId}`,
      target,
      items: [separatorItem],
    });
  }

  function getMenuItems(context: ContextMenuContext): readonly ResolvedMenuItem[] {
    actionRegistry.clear();
    const collectedRawItems: ContextMenuItem[] = [];

    const sortedRegs = Array.from(registrations.values()).sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    for (const reg of sortedRegs) {
      if (matchesTarget(reg.target, context)) {
        const items = typeof reg.items === 'function' ? reg.items(context) : reg.items;
        if (Array.isArray(items)) {
          collectedRawItems.push(...items);
        }
      }
    }

    return resolveMenuItemsList(collectedRawItems, context, actionRegistry);
  }

  async function executeItem(itemId: string, context: ContextMenuContext): Promise<boolean> {
    const action = actionRegistry.get(itemId);
    if (!action || !action.handler) {
      return false;
    }
    const isDisabled = evaluateDynamicBool(action.disabled, context, false);
    if (isDisabled) {
      return false;
    }
    try {
      await Promise.resolve(action.handler(context));
      return true;
    } catch (err) {
      console.error(`[ContextMenuEngine] Failed to execute action ${itemId}:`, err);
      return false;
    }
  }

  function clear(): void {
    registrations.clear();
    actionRegistry.clear();
  }

  function size(): number {
    return registrations.size;
  }

  return {
    register,
    registerAction,
    registerSubmenu,
    registerSeparator,
    getMenuItems,
    executeItem,
    unregister,
    clear,
    size,
  };
}

// ─── النسخة الافتراضية العامة الموحدة (Default Global Instance) ───

export const globalContextMenuEngine: ContextMenuEngine = createContextMenuEngine();
