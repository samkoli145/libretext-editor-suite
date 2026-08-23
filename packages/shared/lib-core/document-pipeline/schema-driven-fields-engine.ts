/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: الحقول المكتوبة (Typed Fields) القائمة على المخطط — المخطط،
 *           الافتراضيات، وقراءة قيم الصفحة. "المسألة (Issue) هي صفحة".
 * 🏛️ الدور: نواة معزولة (Zero-Dependency Engine) داخل document-pipeline.
 * 📥 المستهلك: BoardEditor/Issues UI, agent verbs (setField/newIssue),
 *           markdown export, block registry, filter/board.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Values-As-Blocks + Schema-Is-Document-Contract:
 *    القيم كتل `prop` على الصفحة لأن كل ما يهم في المساحات يمر على
 *    `page.blocks` (بحث، استبدال، تراجع، معاينة، تصدير) — القيمة على مستوى
 *    الصفحة غير مرئية لكل أولئك وتُرسم كلا شيء على بناء أقدم. وتحت التعاون
 *    كل خاصية كتلة سجل Last-Writer-Wins خاص بها: شخصان يضبطان الحالة والمسؤول
 *    في اللحظة نفسها ينتصران معاً؛ كائن واحد على الصفحة كان سجلاً واحداً
 *    ويخسر تعديلاً بصمت. المخطط ليس قيمة (لا يُنسخ لكل مسألة) وهو تراكمي:
 *    بناء أقدم يتجاهل `doc.fields` ويعرض `html` كل كتلة prop.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل كتلة prop تحمل `html` مقروءاً — هذا ما يجعل الصيغة تتراجع بدل
 *       أن تختفي: معاينة قديمة وقاعدة grep وتصدير markdown كلها ترى
 *       "Status: In progress" دون معرفة ما هو الحقل.
 *    2. COERCE لا تفترض: المخطط يأتي من ملف أرسله شخص — `label` قد يكون
 *       رقماً، وكان هذا يرمي TypeError من API عام (setField/newIssue).
 *    3. ABSENT MEANS EVERYTHING في الفلاتر: كل view كُتب قبل وجود الفلاتر
 *       بلا `filter` ويجب أن يعرض كل المسائل إلى الأبد.
 *    4. قيمة طور غير معروفة تُعدّ OPEN: إخفاء عمل لأن بناءً أقدم لا يقرأ
 *       حالته خسارة صامتة؛ عرض مسألة زائدة ليس كذلك.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - `fieldsOf` يسقط للافتراضات عند غياب المخطط أو فراغه.
 *    - قائمة مفاتيح الحقل المعروفة للحساب (`FILTER_KEYS`) ومفاتيح غير
 *      معروفة تُعاد كما هي (additivity).
 *    - `reorderPages` خالصة: مرساة معرّف صفحة لا فهرس (الفهرس يتحرك تحت
 *      عملية الحذف)؛ عائد null يُبقي السحب بلا أثر خارج مكدس التراجع.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/spaces/fields.ts (The Bento authors, MIT).
 */

import type { Block, Page, SpaceDoc } from './block-document-model';

/** ما يحمله الحقل. قليلة عمداً: كل واحدة تكلف محرراً والتزاماً دائماً. */
export type FieldType = 'select' | 'person' | 'number' | 'date' | 'text' | 'labels';

export interface FieldOption {
  id: string;
  label: string;
  color?: string;
  /**
   * أي طرف من اللوحة يجلس عنده هذا الخيار.
   *
   * رؤية Linear: الحالة ليست اسماً فحسب، بل تنتمي لمرحلة (PHASE).
   * "Done" و"Cancelled" منتهيتان معاً؛ "In review" و"In progress" مبدآن
   * معاً. التجميع بالمرحلة هو ما يجعل "أرني المفتوح" معنى دون إعداد فلاتر.
   */
  group?: 'unstarted' | 'started' | 'done' | 'cancelled';
}

export interface FieldSpec {
  key: string;
  label: string;
  vt: FieldType;
  options?: FieldOption[];
  /** يُعرض على مسألة جديدة حين لا يُختار شيء */
  def?: string;
}

/** الحقول التي يبدأ بها متتبع جديد — بهيئة Linear عمداً. */
export const DEFAULT_FIELDS: FieldSpec[] = [
  {
    key: 'status',
    label: 'Status',
    vt: 'select',
    def: 'todo',
    options: [
      { id: 'backlog', label: 'Backlog', color: '#8B95A5', group: 'unstarted' },
      { id: 'todo', label: 'Todo', color: '#5B8DEF', group: 'unstarted' },
      { id: 'doing', label: 'In progress', color: '#F7A600', group: 'started' },
      { id: 'review', label: 'In review', color: '#A97BE0', group: 'started' },
      { id: 'done', label: 'Done', color: '#2FA37C', group: 'done' },
      { id: 'cancelled', label: 'Cancelled', color: '#98A2B3', group: 'cancelled' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    vt: 'select',
    def: 'none',
    options: [
      { id: 'urgent', label: 'Urgent', color: '#E5484D' },
      { id: 'high', label: 'High', color: '#F7A600' },
      { id: 'medium', label: 'Medium', color: '#5B8DEF' },
      { id: 'low', label: 'Low', color: '#8B95A5' },
      { id: 'none', label: 'No priority', color: '#C4CBD6' },
    ],
  },
  { key: 'assignee', label: 'Assignee', vt: 'person' },
  { key: 'estimate', label: 'Estimate', vt: 'number' },
  { key: 'labels', label: 'Labels', vt: 'labels' },
  { key: 'due', label: 'Due', vt: 'date' },
  { key: 'project', label: 'Project', vt: 'text' },
];

/**
 * الحقول التي تبدأ بها مسألة NEW.
 *
 * قائمة واحدة، لأن ثمّة طريقتين لصنع مسألة — ⌘⇧I في المحرر و `newIssue()`
 * من وكيل — وحقلٌ بذرته إحداهما دون الأخرى حقلٌ لا يستطيع إنسان ضبطه لاحقاً:
 * `prop` غير مُدرج في قائمة / (الكتل)، فطريق القيمة الوحيدة إلى الصفحة أن
 * تُبذر بها. بقية المخطط (labels, due, project) يُضبط عند الطلب ويظهر عند
 * ضبطه — الغياب يعني غير مضبوط.
 */
export const ISSUE_FIELDS = ['status', 'priority', 'assignee', 'estimate'];

/** المخطط الفعلي: ما يعلنه المستند، وإلا الافتراضات. */
export function fieldsOf(doc: SpaceDoc): FieldSpec[] {
  const declared = (doc as { fields?: unknown }).fields;
  return Array.isArray(declared) && declared.length ? (declared as FieldSpec[]) : DEFAULT_FIELDS;
}

export const fieldByKey = (doc: SpaceDoc, key: string): FieldSpec | undefined =>
  fieldsOf(doc).find((f) => f.key === key);

export const optionOf = (f: FieldSpec | undefined, id: unknown): FieldOption | undefined =>
  f?.options?.find((o) => o.id === String(id));

/**
 * الصيغة المقروءة للقيمة — ما يدخل في `html` الكتلة.
 *
 * ليست زينة. هذا هو الشيء الوحيد الذي يمكن أن يراه بناء أقدم، أو مُصغِّر،
 * أو grep، أو تصدير markdown، لذا يجب أن يقول ما هو الحقل وما يحمله.
 */
export function propHtml(f: FieldSpec, value: unknown): string {
  const esc = (v: unknown): string =>
    String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  const label = typeof f?.label === 'string' && f.label ? f.label : String(f?.key ?? 'field');
  const shown =
    f.vt === 'select'
      ? (optionOf(f, value)?.label ?? String(value ?? ''))
      : f.vt === 'labels'
        ? Array.isArray(value)
          ? value.join(', ')
          : String(value ?? '')
        : String(value ?? '');
  return `${esc(label)}: ${esc(shown) || '—'}`;
}

/** قيم صفحة حسب المفتاح. كتل `prop` فقط تحملها. */
export function valuesOf(page: Page): Map<string, unknown> {
  const out = new Map<string, unknown>();
  for (const b of page.blocks) {
    if (b.type !== 'prop') continue;
    const key = (b as { key?: unknown }).key;
    if (typeof key === 'string' && key) out.set(key, (b as { value?: unknown }).value);
  }
  return out;
}

/**
 * هل هذه الصفحة مسألة (ISSUE)?
 *
 * تحمل حالة (status). ليست علماً على الصفحة ولا نوع صفحة منفصلاً: جعل
 * "المسألة" وضعاً يعني أن الصفحة يمكن أن تكون من النوع الخطأ، ويضع مفهوماً
 * ثانياً في صيغة شكلها كله "صفحة بكتل". صفحة بحالة هي مسألة؛ أزل الحالة
 * فتعود مستنداً، وكل ما عداها سليم.
 */
export const isIssue = (page: Page): boolean =>
  page.blocks.some((b) => b.type === 'prop' && (b as { key?: unknown }).key === 'status');

/** أين تتوقف كتل prop الخاصة بالصفحة ويبدأ جسمها. */
export function headerLength(page: Page): number {
  let n = 0;
  while (n < page.blocks.length && page.blocks[n].type === 'prop') n++;
  return n;
}

/**
 * ما يُضيّق الرؤية. يُخزن على كتلة `view` فهو دائم.
 *
 * ABSENT MEANS EVERYTHING، وكذلك المفتاح الغائب داخله. ليست قيمة افتراضية
 * بل قاعدة توافق: كل view كُتب قبل وجود الفلاتر بلا `filter` ويجب أن يعرض
 * كل مسألة للأبد. القاعدة نفسها تجعل المحرر يحذف المفتاح بدل تخزين كائن
 * فارغ، فتصير الرؤية التي فُلتت ثم أُزيل فلترها مطابقةً بايت-ببايت لواحدة
 * لم تُفلتر أبداً.
 */
export interface ViewFilter {
  /** مفتاح الحقل → القيم التي تجتاز. قيمة لا تعرفها هذه البناءة تُقارن
   *  حرفياً، ففِلتر كتبه بناء أحدث ما يزال يختار المسائل التي قصدها بدل
   *  ألا يطابق شيئاً. */
  is?: Record<string, string[]>;
  /** المسائل التي مرحلتها ليست done ولا cancelled فقط */
  open?: boolean;
}

/** مفاتيح الفلترة التي يمكن لهذه البناءة تقييمها. */
const FILTER_KEYS = new Set(['is', 'open']);

/**
 * مفاتيح فلترة من بناء أحدث.
 *
 * تُرحَّل دون مساس، لكن هذه البناءة لا تطبقها، فتعرض الرؤية أكثر مما يجب —
 * وعددٌ أعلى بصمت هو الفشل نفسه الذي تبادله قاعدة الإضافة في الصيغة. الرؤية
 * تقول ذلك بصوت عالٍ بدل ذلك.
 */
export const unknownFilterKeys = (f: unknown): string[] =>
  f && typeof f === 'object' ? Object.keys(f).filter((k) => !FILTER_KEYS.has(k)) : [];

/**
 * الحقل الذي تُعلن خياراته المراحل — الذي "open" سؤال عنه.
 *
 * مُشتق من المخطط لا مقسّم إلى `status` أبداً: مستند يعلن حقوله يسمّي حقل
 * مرحلته، ومن لا يعلن شيئاً لا مفهوم open عنده إطلاقاً، فيمرر `open` كل شيء
 * بدل إفراغ اللوحة.
 */
export const phaseField = (doc: SpaceDoc): FieldSpec | undefined =>
  fieldsOf(doc).find((f) => f.options?.some((o) => o.group));

/** هل هذه القيمة مرحلة ما زالت جارية؟ قيمة غير معروفة تعدّ open. */
export const isOpenPhase = (f: FieldSpec | undefined, value: unknown): boolean => {
  const g = optionOf(f, value)?.group;
  return g !== 'done' && g !== 'cancelled';
};

/** هل تجتاز مسألة واحدة فلتر رؤية؟ */
export function passesFilter(
  doc: SpaceDoc,
  values: Map<string, unknown>,
  filter: unknown,
): boolean {
  if (!filter || typeof filter !== 'object') return true;
  const f = filter as ViewFilter;
  if (f.open) {
    const pf = phaseField(doc);
    if (!isOpenPhase(pf, values.get(pf?.key ?? ''))) return false;
  }
  const is = f.is;
  if (is && typeof is === 'object') {
    for (const key of Object.keys(is)) {
      const want = is[key];
      // قائمة فارغة ليست قيداً وليست "لا شيء يمر" — فارغة مخزنة ستفري اللوحة
      // لسبب لا يراه أحد
      if (!Array.isArray(want) || !want.length) continue;
      const v = values.get(key);
      const mine = Array.isArray(v) ? v.map(String) : [String(v ?? '')];
      if (!want.some((w) => mine.includes(String(w)))) return false;
    }
  }
  return true;
}

/** بمقدار ما يُضيّق الفلتر — ما يعده زر الفلترة. */
export const filterCount = (filter: unknown): number => {
  const f = (filter ?? {}) as ViewFilter;
  const is = f.is && typeof f.is === 'object' ? f.is : {};
  return (f.open ? 1 : 0) + Object.keys(is).filter((k) => (is[k] ?? []).length).length;
};

export interface IssueRow {
  page: Page;
  values: Map<string, unknown>;
}

/** كل مسألة في المساحة، بترتيب الصفحات، والمؤرشفة مستبعدة. */
export function issuesOf(doc: SpaceDoc): IssueRow[] {
  const out: IssueRow[] = [];
  for (const page of doc.pages) {
    if (page.archived || !isIssue(page)) continue;
    out.push({ page, values: valuesOf(page) });
  }
  return out;
}

/** أين تهبط بطاقة مُسقَطة: قبل بطاقة، أو بعد الأخيرة. */
export interface DropAim {
  before?: string;
  after?: string;
}

/**
 * ترتيب الصفحات بعد إسقاط بطاقة — أو NULL حين لا يغيّر الإسقاط شيئاً.
 *
 * ترتيب اللوحة هو `doc.pages`. لا يوجد حقل ترتيب لكل رؤية، ويجب ألا يُخترع
 * بواسطة معالج سحب: الترتيب المخزن دائم، عليه أن يجيب عما يحدث لمسألة لم
 * ترها رؤية قط، ويمكن أن يختلف عن الصفحات نفسها. إعادة ترتيب الصفحات لا
 * يمكن أن تختلف.
 *
 * خالصة ومنفصلة عن المحرر، لأن هذه هي الحسابات التي يسهل إخطاؤها: المرساة
 * معرّف صفحة لا فهرس لأن الفهرس يتحرك تحت عملية الحذف نفسها. العائد null هو
 * ما يُبقي سحباً ذهب لا إلى مكان خارج مكدس التراجع.
 */
export function reorderPages(pages: Page[], pageId: string, aim: DropAim): Page[] | null {
  const from = pages.findIndex((p) => p.id === pageId);
  const anchor = aim.before ?? aim.after;
  if (from < 0 || !anchor) return null;
  // هناك أصلاً بالضبط
  if (aim.before ? pages[from + 1]?.id === aim.before : pages[from - 1]?.id === aim.after)
    return null;
  const next = pages.slice();
  const [moved] = next.splice(from, 1);
  // المرساة تُبحث بعد الإزالة، فالفهرس هو الذي يحتاجه الإدراج. ويغطي أيضاً
  // إسقاط بطاقة على نفسها: المرساة هي الصفحة المُزالة، فلا تُوجد ولا يتحرك شيء.
  const at = next.findIndex((p) => p.id === anchor);
  if (at < 0) return null;
  next.splice(aim.before ? at : at + 1, 0, moved);
  return next;
}

/** كتلة قيمة صفحة لحقل معين، إن وُجدت. */
export const propBlockOf = (page: Page, key: string): Block | undefined =>
  page.blocks.find((b) => b.type === 'prop' && (b as { key?: unknown }).key === key);

/** ابنِ كتلة prop، وصيغتها المقروءة في تناغم. */
export function propBlock(f: FieldSpec, value: unknown, id: string): Block {
  return { id, type: 'prop', key: f.key, value, html: propHtml(f, value) } as Block;
}

/**
 * هل يغيّر هذا الإسقاط الترتيب الذي يراه المستخدم فعلاً؟
 *
 * `reorderPages` يقارن تجاوراً في `doc.pages`، وترتيب الصفحات ليس ترتيب
 * الأعمدة: لوحة بعمودين تقارب الأعمدة، فالبطاقة المسقطة في فتحتها لا تكون
 * مجاورة لنفسها في مصفوفة الصفحات. مقيساً: صفحات [board,i1..i5] مع i1,i3,i5
 * في عمود واحد — إسقاط i1 حيث جلس أصلاً أعاد مصفوفة مرتبة، فإيماءة لم تفعل
 * شيئاً مرئياً كتبت في المستند وأخذت مدخل تراجع وقلبت الشريط الجانبي.
 *
 * `cards` هي معرّفات بطاقات العمود بترتيب رسمها، بما فيها المُسقَطة. الجواب
 * عن العمود لأن العمود هو الترتيب الوحيد الذي كانت عنه الإيماءة.
 */
export function columnMoves(cards: string[], moved: string, aim: DropAim): boolean {
  const at = cards.indexOf(moved);
  if (at < 0) return true; // قادمة من مكان آخر
  const rest = cards.filter((id) => id !== moved);
  const target = aim.before
    ? rest.indexOf(aim.before)
    : aim.after
      ? rest.indexOf(aim.after) + 1
      : rest.length;
  if (target < 0) return true;
  const next = [...rest.slice(0, target), moved, ...rest.slice(target)];
  return next.join('\u001f') !== cards.join('\u001f');
}
