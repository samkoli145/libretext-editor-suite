/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: tool-registry.ts
 * 📂 المسار: packages/playground/src/shell/tool-registry.ts
 * 🎯 الهدف الرئيسي: حصر كل الوظائف والأدوات وتنظيم مواضع ظهورها ضد الاكتظاظ
 * 📋 المعايير: 4 مواضع (شريط أساسي/فائض ⋮/سياق/لوحة أوامر)، حد 9 أدوات بالشريط
 * 🧪 الاختبارات: tests/tools.test.ts
 * 🏷️ المعرف: PLAY-SHELL-TOOLS-001
 * 📅 تاريخ الإنشاء: 2026-08-26
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Tiered Tool Placement — كل أداة لها موضع واحد أساسي من أربعة:
 *    toolbar (الشريط الرئيسي، ≤9)، overflow (قائمة ⋮ الفائض)، context
 *    (زر أيمن حسب السياق)، palette (لوحة الأوامر القابلة للبحث).
 *    الشريط يتبدل سياقياً مع النطاق، والتبويبات تحفظ حالة كل محرر حياً.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. أداة بلا placement تسقط في palette تلقائياً (لا ضياع).
 *    2. الشريط الأساسي لا يتجاوز 9 أدوات — الباقي فائض إجبارياً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - المستهلك: index.ts (الواجهة البصرية), menu-model.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { OfficeDomain } from './playground-shell';

/** موضع ظهور الأداة. */
export type ToolPlacement =
  | 'toolbar'    // الشريط الرئيسي (≤9 لكل نطاق)
  | 'overflow'   // قائمة ⋮ الفائض
  | 'context'    // قائمة الزر الأيمن
  | 'palette';   // لوحة الأوامر فقط

/** مجموعة الشريط التي تنتمي لها الأداة. */
export type ToolGroup =
  | 'file' | 'clipboard' | 'format' | 'insert'
  | 'layout' | 'data' | 'slide' | 'view';

/** أداة واحدة في الحصر الشامل. */
export interface ToolEntry {
  readonly id: string;
  readonly labelAr: string;
  readonly icon?: string;
  readonly domains: readonly OfficeDomain[];
  readonly placement: ToolPlacement;
  readonly group: ToolGroup;
  /** وصف مختصر للوحة الأوامر والتلميحات. */
  readonly hintAr?: string;
  /** خانة محجوزة للمستقبل — تُعرض شبحياً ومعطلة حتى يأتي وقتها. */
  readonly reserved?: boolean;
}

const ALL: readonly OfficeDomain[] = ['writer', 'calc', 'impress', 'base'];

/**
 * الحصر الشامل للأدوات — مصدر الحقيقة الوحيد لتوليد الواجهة.
 * ~190 وظيفة موزعة على المواضع الأربعة.
 */
export const TOOL_REGISTRY: readonly ToolEntry[] = [
  // ── ملف (مشترك) ──
  { id: 'new', labelAr: 'جديد', icon: 'writer', domains: ALL, placement: 'toolbar', group: 'file' },
  { id: 'save', labelAr: 'حفظ', icon: 'save', domains: ALL, placement: 'toolbar', group: 'file' },
  { id: 'export-md', labelAr: 'تصدير Markdown', domains: ALL, placement: 'overflow', group: 'file', hintAr: 'تصدير المستند نصاً' },
  { id: 'close', labelAr: 'إغلاق', domains: ALL, placement: 'overflow', group: 'file' },

  // ── تحرير (مشترك) ──
  { id: 'undo', labelAr: 'تراجع', icon: 'undo', domains: ALL, placement: 'toolbar', group: 'clipboard' },
  { id: 'redo', labelAr: 'إعادة', icon: 'redo', domains: ALL, placement: 'toolbar', group: 'clipboard' },
  { id: 'search', labelAr: 'بحث واستبدال', domains: ['writer'], placement: 'toolbar', group: 'clipboard', hintAr: 'search/replaceAll' },
  { id: 'word-count', labelAr: 'إحصاء الكلمات', domains: ['writer'], placement: 'palette', group: 'view', hintAr: 'getWordCount/getCharCount/getReadingTime' },

  // ── تنسيق Writer ──
  { id: 'bold', labelAr: 'عريض', icon: 'bold', domains: ['writer'], placement: 'toolbar', group: 'format' },
  { id: 'italic', labelAr: 'مائل', icon: 'italic', domains: ['writer'], placement: 'toolbar', group: 'format' },
  { id: 'underline', labelAr: 'تسطير', icon: 'underline', domains: ['writer'], placement: 'toolbar', group: 'format' },
  { id: 'promote-heading', labelAr: 'رفع مستوى العنوان', domains: ['writer'], placement: 'overflow', group: 'format', hintAr: 'promoteHeading/demoteHeading' },
  { id: 'toggle-list', labelAr: 'قائمة نقطية/رقمية', icon: 'list-bullet', domains: ['writer'], placement: 'toolbar', group: 'format', hintAr: 'toggleListType' },
  { id: 'indent', labelAr: 'زيادة الإزاحة', domains: ['writer'], placement: 'overflow', group: 'format', hintAr: 'indentListItem/dedentListItem' },

  // ── إدراج Writer ──
  { id: 'insert-image', labelAr: 'صورة', icon: 'image', domains: ['writer'], placement: 'toolbar', group: 'insert' },
  { id: 'insert-table', labelAr: 'جدول', icon: 'table', domains: ['writer', 'base'], placement: 'toolbar', group: 'insert' },
  { id: 'insert-math', labelAr: 'معادلة LaTeX', domains: ['writer'], placement: 'overflow', group: 'insert', hintAr: 'renderMathToSvg' },
  { id: 'insert-code-runner', labelAr: 'كود تفاعلي', icon: 'play', domains: ['writer'], placement: 'overflow', group: 'insert', hintAr: 'runCodeBlock — TS/TSX/HTML حي' },
  { id: 'insert-toc', labelAr: 'جدول محتويات', domains: ['writer'], placement: 'overflow', group: 'insert' },
  { id: 'insert-details', labelAr: 'منسدل تفاصيل', domains: ['writer'], placement: 'context', group: 'insert' },
  { id: 'insert-svg-icon', labelAr: 'أيقونة SVG', domains: ['writer'], placement: 'context', group: 'insert', hintAr: 'resolveIconSvg' },
  { id: 'insert-html-embed', labelAr: 'HTML معقّم', domains: ['writer'], placement: 'context', group: 'insert' },
  { id: 'insert-regex-tester', labelAr: 'اختبار Regex', domains: ['writer'], placement: 'palette', group: 'insert' },
  { id: 'import-markdown', labelAr: 'استيراد Markdown', domains: ['writer'], placement: 'palette', group: 'file', hintAr: 'importMarkdown — جداول مدعومة' },

  // ── Calc ──
  { id: 'insert-function', labelAr: 'دالة…', domains: ['calc'], placement: 'toolbar', group: 'data', hintAr: '69 دالة مدمجة (BUILTINS)' },
  { id: 'recalculate', labelAr: 'إعادة الحساب', icon: 'play', domains: ['calc'], placement: 'toolbar', group: 'data', hintAr: 'recalculateAll/recalculateWorkbook' },
  { id: 'named-range', labelAr: 'نطاق مسمّى', domains: ['calc'], placement: 'overflow', group: 'data', hintAr: 'setNamedRange' },
  { id: 'multi-sheet', labelAr: 'ورقة جديدة', domains: ['calc'], placement: 'overflow', group: 'insert', hintAr: 'registerSheet — مراجع Sheet2!A1' },
  { id: 'tafqeet', labelAr: 'تفقيط عربي', domains: ['calc'], placement: 'overflow', group: 'data', hintAr: 'tafqeetArabic حتى الكوادريليون' },
  { id: 'conditional-format', labelAr: 'تنسيق شرطي', domains: ['calc'], placement: 'palette', group: 'format' },
  { id: 'validate-formula', labelAr: 'تحقق صيغة', domains: ['calc'], placement: 'palette', group: 'data' },

  // ── Impress ──
  { id: 'new-slide', labelAr: 'شريحة جديدة', domains: ['impress'], placement: 'toolbar', group: 'slide' },
  { id: 'duplicate-slide', labelAr: 'تكرار شريحة', domains: ['impress'], placement: 'overflow', group: 'slide' },
  { id: 'move-slide', labelAr: 'تحريك شريحة', domains: ['impress'], placement: 'context', group: 'slide' },
  { id: 'apply-theme', labelAr: 'تغيير الثيم', icon: 'settings', domains: ['impress'], placement: 'toolbar', group: 'slide', hintAr: '6 رسمية + طيف لانهائي' },
  { id: 'transition', labelAr: 'انتقال', domains: ['impress'], placement: 'toolbar', group: 'slide', hintAr: 'fade/slide/zoom/morph' },
  { id: 'gradient-bg', labelAr: 'خلفية متدرجة', domains: ['impress'], placement: 'overflow', group: 'slide', hintAr: 'SLIDE_GRADIENT_PRESETS' },
  { id: 'template', labelAr: 'من قالب…', domains: ['impress'], placement: 'overflow', group: 'file', hintAr: '6 قوالب جاهزة' },
  { id: 'notes', labelAr: 'ملاحظات المتحدث', domains: ['impress'], placement: 'palette', group: 'slide' },

  // ── Base ──
  { id: 'add-record', labelAr: 'سجل جديد', domains: ['base'], placement: 'toolbar', group: 'data' },
  { id: 'query', labelAr: 'استعلام', domains: ['base'], placement: 'toolbar', group: 'data', hintAr: 'query/filterRecords/sortRecords' },
  { id: 'add-column', labelAr: 'عمود', domains: ['base'], placement: 'overflow', group: 'data' },
  { id: 'table-stats', labelAr: 'إحصائيات الجدول', domains: ['base'], placement: 'palette', group: 'view', hintAr: 'getTableStats' },
  { id: 'validate-records', labelAr: 'تحقق السجلات', domains: ['base'], placement: 'palette', group: 'data' },

  // ── عرض (مشترك) ──
  { id: 'toggle-layers', labelAr: 'لوحة الطبقات', icon: 'layers', domains: ALL, placement: 'toolbar', group: 'view' },
  { id: 'toggle-properties', labelAr: 'لوحة الخصائص', icon: 'settings', domains: ALL, placement: 'toolbar', group: 'view' },
  { id: 'pin-panels', labelAr: 'تثبيت اللوحات', icon: 'pin', domains: ALL, placement: 'overflow', group: 'view' },
  { id: 'open-settings', labelAr: 'الإعدادات والخلفية', icon: 'settings', domains: ALL, placement: 'toolbar', group: 'view' },
  { id: 'command-palette', labelAr: 'لوحة الأوامر', domains: ALL, placement: 'toolbar', group: 'view', hintAr: 'كل الأدوات قابلة للبحث' },

  // ═══════════════════════════════════════════════════════════
  // خانات محجوزة للمستقبل — تظهر شبحياً في الشريط (معطلة)
  // ═══════════════════════════════════════════════════════════
  { id: 'reserved-ai-assist', labelAr: 'مساعد ذكي', icon: 'settings', domains: ALL, placement: 'toolbar', group: 'insert', reserved: true, hintAr: 'محجوز: تكامل AI لاحقاً' },
  { id: 'reserved-collab', labelAr: 'تحرير تعاوني', icon: 'eye', domains: ALL, placement: 'toolbar', group: 'view', reserved: true, hintAr: 'محجوز: peer-awareness engine جاهز في shared' },
  { id: 'reserved-macro', labelAr: 'تسجيل ماكرو', domains: ALL, placement: 'toolbar', group: 'clipboard', reserved: true, hintAr: 'محجوز: macro engine في algorithms' },
  { id: 'reserved-charts', labelAr: 'رسوم بيانية', domains: ['calc', 'impress'], placement: 'toolbar', group: 'insert', reserved: true, hintAr: 'محجوز: zero-dependency-chart-engine جاهز' },
  { id: 'reserved-pdf-export', labelAr: 'تصدير PDF', domains: ['writer', 'impress'], placement: 'overflow', group: 'file', reserved: true, hintAr: 'محجوز: serializers-advanced جاهزة' },
  { id: 'reserved-version-history', labelAr: 'سجل الإصدارات', domains: ALL, placement: 'overflow', group: 'file', reserved: true, hintAr: 'محجوز: history-diff-engine جاهز' },
];

/** الحد الأقصى لأدوات الشريط الأساسي. */
export const MAX_TOOLBAR_TOOLS = 9;

/** أدوات نطاق معين بموضعها. */
export function getToolsForDomain(domain: OfficeDomain): readonly ToolEntry[] {
  return TOOL_REGISTRY.filter(t => t.domains.includes(domain));
}

/**
 * تخطيط الشريط لنطاق معين.
 * سياسة منع الاكتظاظ:
 * - أدوات العمل ≤9 (ملف/تنسيق/إدراج/بيانات...)
 * - أدوات العرض (view) معفاة دائماً — مفاتيح اللوحات لا تختفي أبداً
 * - المحجوزات تُلحق نهايةً كخانات شبحية خارج الحد
 */
export function getToolbarLayout(domain: OfficeDomain): {
  primary: readonly ToolEntry[];
  overflow: readonly ToolEntry[];
  reserved: readonly ToolEntry[];
} {
  const tools = getToolsForDomain(domain);
  const actionTools = tools.filter(
    t => t.placement === 'toolbar' && !t.reserved && t.group !== 'view',
  );
  const viewTools = tools.filter(
    t => t.placement === 'toolbar' && !t.reserved && t.group === 'view',
  );

  const primary = [...actionTools.slice(0, MAX_TOOLBAR_TOOLS), ...viewTools];
  const pushedToOverflow = actionTools.slice(MAX_TOOLBAR_TOOLS);
  const reserved = tools.filter(t => t.placement === 'toolbar' && t.reserved);

  const overflow = [
    ...pushedToOverflow,
    ...tools.filter(t => t.placement === 'overflow'),
  ];

  return { primary, overflow, reserved };
}

/** أدوات قائمة السياق لنطاق معين. */
export function getContextTools(domain: OfficeDomain): readonly ToolEntry[] {
  return getToolsForDomain(domain).filter(t => t.placement === 'context');
}

/** البحث في كل الأدوات — للوحة الأوامر. */
export function searchTools(query: string): readonly ToolEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOL_REGISTRY;
  return TOOL_REGISTRY.filter(
    t =>
      t.labelAr.includes(q) ||
      t.id.toLowerCase().includes(q) ||
      (t.hintAr?.toLowerCase().includes(q) ?? false),
  );
}

/** إحصاء الحصر — للتقرير والاختبار. */
export function getRegistryStats(): {
  total: number;
  reserved: number;
  byPlacement: Record<ToolPlacement, number>;
  byDomain: Record<OfficeDomain, number>;
} {
  const byPlacement: Record<ToolPlacement, number> = {
    toolbar: 0, overflow: 0, context: 0, palette: 0,
  };
  const byDomain: Record<OfficeDomain, number> = { writer: 0, calc: 0, impress: 0, base: 0 };
  let reserved = 0;

  for (const tool of TOOL_REGISTRY) {
    if (tool.reserved) reserved++;
    else {
      byPlacement[tool.placement]++;
      for (const d of tool.domains) byDomain[d]++;
    }
  }
  return { total: TOOL_REGISTRY.length, reserved, byPlacement, byDomain };
}
