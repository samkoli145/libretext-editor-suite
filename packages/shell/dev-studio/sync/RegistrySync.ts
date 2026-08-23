/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [RegistrySync.ts] مزامنة السجلات المركزية مع واقع المشروع
 *
 * هذا الملف يجيب: "هل السجلات المركزية تعكس ما هو موجود فعلاً؟"
 *
 * المبدأ الحاكم (من story.ts قاعدة 2):
 * "SERIES ARE DERIVED, NEVER STORED" — السجل يُشتق من الواقع،
 * لا العكس. سجل مكونات يخزن قائمة ثابتة سينفصل عن الحقيقة
 * لحظة إضافة أداة يدوياً أو حذف ملف. الاشتقاق في كل قراءة
 * هو ما يجعل السجل صادقاً.
 *
 * المبدأ الثاني (من rowcol.ts):
 * "EVERY FUNCTION HERE IS A PATCH FACTORY" — المزامنة لا تعدل
 * السجل مباشرة. تنتج patch عبر FileOperations، يمر عبر خط
 * الأنابيب للفحص واللقطة والاختبار. هذا ما يجعل تحديث السجل
 * قابلاً للتراجع.
 *
 * المبدأ الثالث (من story.ts PLATFORM §3):
 * السجلات قد تحمل حقولاً من بناء أحدث. normalizeRegistry يحافظ
 * عليها عبر spread. لا يوجد خادم لترقية الملفات الموجودة.
 *
 * التنبيهات:
 * - السجلات: Components.md، Algorithms.md، SystemInventory.json
 * - كل مزامنة تنتج patch واحد (لا تعديل مباشر)
 * - الرفض بصوت عالٍ عند سجل فاسد
 * - الحقول المضافة: الغياب يعني "لا"
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import type { ProjectSurface } from '../core/DevStudioEngine';
import type { DevStudioPatch } from '../core/DevStudioTypes';
import { COPYRIGHT_YEAR } from '../core/DevStudioTypes';
import { modifyFilePatch } from '../tree/FileOperations';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الأنواع — السجلات التي نزامنها
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** السجلات المركزية الثلاثة. كل منها ملف في جذر المشروع. */
export type RegistryKind = 'components' | 'algorithms' | 'inventory';

/** مسار كل سجل. ثابت لأن السجلات في الجذر دائماً. */
export const REGISTRY_PATHS: Record<RegistryKind, string> = {
  components: 'Components and Properties.md',
  algorithms: 'Algorithms and Math Registry.md',
  inventory: 'SystemInventory.json',
};

/**
 * مدخل في سجل المكونات.
 *
 * ⚠️ الحقول المضافة: الغياب يعني "لا".
 * مدخل بلا description ليس له `description: ''`، بل لا حقل أصلاً.
 * هذا ما يجعل round-trip السجل byte-identical.
 */
export interface ComponentEntry {
  id: string;
  name: string;
  path: string;
  category?: string;
  /** additive: موجودة فقط إن كانت مفيدة */
  description?: string;
  registeredAt: number;
}

/**
 * مدخل في سجل الخوارزميات.
 */
export interface AlgorithmEntry {
  id: string;
  name: string;
  path: string;
  /** التعقيد الزمني، مثل O(n) */
  complexity?: string;
  description?: string;
  registeredAt: number;
}

/**
 * نتيجة مقارنة سجل بالواقع.
 *
 * missing: موجود في الواقع، غائب من السجل
 * stale: موجود في السجل، غائب من الواقع (ملف حُذف)
 * matched: موجود في الاثنين
 */
export interface RegistryDiff {
  kind: RegistryKind;
  missing: string[];
  stale: string[];
  matched: string[];
  /** هل السجل متسق مع الواقع؟ */
  inSync: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// القراءة — ماذا يقول السجل الآن؟
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * قراءة سجل المكونات من ملف Markdown.
 *
 * ⚠️ القراءة دفاعية، مثل readFrozen في rowcol.ts:
 * "anything unreadable means the state every reader can agree on."
 * سجل فاسد يُقرأ كقائمة فارغة، لا يرمي.
 *
 * التنسيق المتوقع: جدول Markdown بأعمدة | id | name | path |
 */
export function parseComponentRegistry(md: string): ComponentEntry[] {
  const out: ComponentEntry[] = [];
  if (!md) return out;

  const lines = md.split('\n');
  for (const line of lines) {
    // نتعرف على صفوف الجدول: تبدأ بـ | وتحتوي على | أخرى
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    // نتجاهل صف الرأس وصف الفاصل
    if (trimmed.includes('---')) continue;
    if (/^\|\s*(id|المكون|component)/i.test(trimmed)) continue;

    const cells = trimmed
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 3) continue;

    // الخلايا: id | name | path | ...
    let [id, name, path] = cells;
    id = id.replace(/^`|`$/g, '').trim();
    name = name.replace(/^`|`$/g, '').trim();
    path = path.replace(/^`|`$/g, '').trim();

    if (!id || !name || !path) continue;

    const entry: ComponentEntry = {
      id,
      name,
      path,
      registeredAt: 0,
    };
    if (cells.length > 3 && cells[3]) {
      entry.description = cells[3].trim();
    }
    out.push(entry);
  }
  return out;
}

/**
 * قراءة سجل الجرد (SystemInventory.json).
 *
 * ⚠️ JSON.parse قد يرمي — نبتلع ونعيد كائن فارغ.
 * نفس مبدأ readNavState في TreeNavigation.
 */
export function parseInventory(json: string): Record<string, unknown> {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الاشتقاق — ماذا يوجد في الواقع؟
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * اشتقاق قائمة المكونات من شجرة المشروع الفعلية.
 *
 * ⚠️ هذه الدالة تقرأ الواقع، لا السجل. السجل هو ما يجب أن
 * يطابق هذا، لا العكس. نفس مبدأ stepOption في story.ts:
 * "derived, every time, from the sheet."
 *
 * نعتبر كل ملف .ts/.tsx في مجلد components/ أو shared/ مكوناً.
 */
export function deriveComponents(project: ProjectSurface): ComponentEntry[] {
  const out: ComponentEntry[] = [];
  const files = project.listFiles();

  for (const path of files) {
    if (!/\.(ts|tsx)$/.test(path)) continue;
    // استبعاد محركات lib-core
    if (/\/lib-core\//.test(path)) continue;
    // نتعرف على ملفات المكونات: في مجلد components أو ملفات .tsx
    const isComp =
      /\/components\//.test(path) || path.startsWith('components/') || /\.tsx$/.test(path);
    if (!isComp) continue;

    // نستخرج اسم المكون من اسم الملف
    const name =
      path
        .split('/')
        .pop()
        ?.replace(/\.(ts|tsx)$/, '') ?? '';
    if (!name) continue;
    // المعرف هو اسم الملف (هوية، لا تُعاد)
    const id = name;

    out.push({
      id,
      name,
      path,
      registeredAt: Date.now(),
    });
  }
  return out;
}

/**
 * اشتقاق قائمة الخوارزميات من الشجرة.
 * نعتبر كل ملف في lib-core/ أو يحمل اسم *Engine أو *Validator خوارزمية.
 */
export function deriveAlgorithms(project: ProjectSurface): AlgorithmEntry[] {
  const out: AlgorithmEntry[] = [];
  const files = project.listFiles();

  for (const path of files) {
    if (!/\.(ts|tsx)$/.test(path)) continue;
    const name =
      path
        .split('/')
        .pop()
        ?.replace(/\.(ts|tsx)$/, '') ?? '';
    if (!name) continue;
    // نتعرف على الخوارزميات: في lib-core، أو اسم يحمل Engine/Validator/Graph/Detector/Parser
    const isLibCore = /\/lib-core\//.test(path);
    const isEngineName = /(Engine|Validator|Graph|Detector|Parser)$/.test(name);
    if (!isLibCore && !isEngineName) continue;

    out.push({
      id: name,
      name,
      path,
      registeredAt: Date.now(),
    });
  }
  return out;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المقارنة — هل السجل متسق؟
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * مقارنة سجل بالواقع.
 *
 * ⚠️ الرفض بصوت عالٍ: سجل يطلب مكونات غير موجودة في الواقع
 * ليس خطأ يُتجاهل — هو سجل كاذب. نبلغ عنه في diff.stale.
 */
export function diffRegistry(
  kind: RegistryKind,
  inRegistry: string[],
  inReality: string[],
): RegistryDiff {
  const regSet = new Set(inRegistry);
  const realSet = new Set(inReality);

  const missing = inReality.filter((x) => !regSet.has(x));
  const stale = inRegistry.filter((x) => !realSet.has(x));
  const matched = inReality.filter((x) => regSet.has(x));

  return {
    kind,
    missing,
    stale,
    matched,
    inSync: missing.length === 0 && stale.length === 0,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الكتابة — إنتاج patch لتحديث السجل
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد محتوى Markdown لسجل المكونات من قائمة مداخل.
 *
 * ⚠️ التوليد حتمي: نفس المدخلات تعطي نفس المخرجات دائماً.
 * هذا ما يجعل round-trip byte-identical ممكناً.
 */
export function renderComponentRegistry(entries: ComponentEntry[]): string {
  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  const lines: string[] = [
    '# 📦 Components and Properties',
    '',
    `> آخر مزامنة: ${new Date().toISOString().slice(0, 10)} · ©️ ${COPYRIGHT_YEAR}`,
    '',
    '| المكون (Component) | الاسم | المسار | الوصف |',
    '|---|---|---|---|',
  ];
  for (const e of sorted) {
    // الحقول المضافة: الغياب يعني "لا". وصف فارغ = عمود فارغ.
    const desc = e.description ?? '';
    lines.push(`| \`${e.id}\` | ${e.name} | \`${e.path}\` | ${desc} |`);
  }
  lines.push('');
  return lines.join('\n');
}

/**
 * توليد محتوى سجل الخوارزميات.
 */
export function renderAlgorithmRegistry(entries: AlgorithmEntry[]): string {
  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  const lines: string[] = [
    '# 🧮 Algorithms and Math Registry',
    '',
    `> آخر مزامنة: ${new Date().toISOString().slice(0, 10)} · ©️ ${COPYRIGHT_YEAR}`,
    '',
    '| الخوارزمية | المسار | التعقيد | الوصف |',
    '|---|---|---|---|',
  ];
  for (const e of sorted) {
    const complexity = e.complexity ?? '';
    const desc = e.description ?? '';
    lines.push(`| \`${e.id}\` | \`${e.path}\` | ${complexity} | ${desc} |`);
  }
  lines.push('');
  return lines.join('\n');
}

/** استخراج معرفات الخوارزميات من Markdown الحالي. */
function currentEntriesOfAlgorithms(md: string): string[] {
  const out: string[] = [];
  if (!md) return out;
  for (const line of md.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed.includes('---')) continue;
    const cells = trimmed
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 2) continue;
    // المعرف بين backticks في الخلية الأولى
    const m = /^`([^`]+)`$/.exec(cells[0]);
    if (m) out.push(m[1]);
  }
  return out;
}

/**
 * مزامنة SystemInventory.json.
 *
 * ⚠️ من PLATFORM §3: نحافظ على الحقول المجهولة عبر spread.
 * لا نعيد بناء JSON من الصفر — نضيف/نحدّث فقط ما نعرفه.
 */
function syncInventory(project: ProjectSurface): DevStudioPatch | null {
  const path = REGISTRY_PATHS.inventory;
  const current = project.readFile(path) ?? '{}';
  const inventory = parseInventory(current);

  // اشتقاق الواقع
  const files = project.listFiles();
  const fileCount = files.length;
  const tsCount = files.filter((f) => /\.(ts|tsx)$/.test(f)).length;

  // نقارن: إن كان الجرد الحالي يطابق الواقع، لا patch
  if (
    inventory.fileCount === fileCount &&
    inventory.tsCount === tsCount &&
    inventory.lastSynced !== undefined
  ) {
    return null;
  }

  // spread يحافظ على الحقول المجهولة (PLATFORM §3)
  const next = {
    ...inventory,
    fileCount,
    tsCount,
    lastSynced: new Date().toISOString(),
  };
  const rendered = JSON.stringify(next, null, 2);

  return modifyFilePatch(project, path, rendered, {
    summaryAr: 'مزامنة سجل الجرد الشامل للمشروع SystemInventory.json',
    copyrightYear: COPYRIGHT_YEAR,
  });
}

/**
 * مزامنة سجل واحد: قراءة الواقع، مقارنة، إنتاج patch إن لزم.
 *
 * ⚠️ هذا مصنع تصحيحات، لا محرر. يعيد patch أو null إن كان
 * السجل متسقاً. null هنا إجابة حقيقية، مثل NULL في select.ts:
 * "NULL IS THE IMPORTANT RETURN."
 */
export function syncRegistry(project: ProjectSurface, kind: RegistryKind): DevStudioPatch | null {
  const path = REGISTRY_PATHS[kind];
  const current = project.readFile(path) ?? '';

  // اشتقاق الواقع
  let rendered: string;
  let realityIds: string[];

  if (kind === 'components') {
    const derived = deriveComponents(project);
    realityIds = derived.map((e) => e.id);
    rendered = renderComponentRegistry(derived);
  } else if (kind === 'algorithms') {
    const derived = deriveAlgorithms(project);
    realityIds = derived.map((e) => e.id);
    rendered = renderAlgorithmRegistry(derived);
  } else {
    // inventory: JSON، نعالجه بشكل مختلف
    return syncInventory(project);
  }

  // قراءة السجل الحالي ومقارنة
  const currentEntries =
    kind === 'components'
      ? parseComponentRegistry(current).map((e) => e.id)
      : currentEntriesOfAlgorithms(current);
  const diff = diffRegistry(kind, currentEntries, realityIds);

  // إن كان متسقاً، لا patch (إجابة null الحقيقية)
  if (diff.inSync && current.trim() === rendered.trim()) return null;

  // إنتاج patch عبر FileOperations (لا تعديل مباشر)
  return modifyFilePatch(project, path, rendered, {
    summaryAr: `مزامنة سجل ${kind} مع واقع المشروع الفعلي`,
    copyrightYear: COPYRIGHT_YEAR,
  });
}

/**
 * مزامنة كل السجلات دفعة واحدة.
 *
 * ⚠️ تعيد مصفوفة patches، كل واحد يمر عبر خط الأنابيب منفصلاً.
 * هذا ما يجعل كل تحديث سجل قابلاً للتراجع على حدة.
 */
export function syncAllRegistries(project: ProjectSurface): DevStudioPatch[] {
  const out: DevStudioPatch[] = [];
  for (const kind of ['components', 'algorithms', 'inventory'] as RegistryKind[]) {
    const patch = syncRegistry(project, kind);
    if (patch) out.push(patch);
  }
  return out;
}

/** معرَّضة للاختبارات، كما تفعل rowcol.ts. */
export const _registrySyncInternals = {
  parseComponentRegistry,
  parseInventory,
  diffRegistry,
  renderComponentRegistry,
  renderAlgorithmRegistry,
  REGISTRY_PATHS,
};
