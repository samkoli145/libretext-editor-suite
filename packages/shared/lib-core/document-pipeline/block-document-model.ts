/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: نموذج مستند الكتل والصفحات (Block & Page Document Model) بنمط
 *           السجل المسطح (Flat LWW Registers) مع شجرة موضعية آمنة من الدورات.
 * 🏛️ الدور: نواة معزولة (Zero-Dependency Document Core) — الأساس المشترك
 *           لمحرك الحقول، محرك PLAN/APPLY، ومستورد Obsidian.
 * 📥 المستهلك: schema-fields-engine, plan-apply-agent-engine, obsidian-import-engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Positional Effective Parents: قاعدة "الوالد الفعلي موضعي" — الوالد يكون
 *    سابقاً في المصفوفة حصراً، فيصبح الحل ACYCLIC BY CONSTRUCTION دون مجموعة
 *    زيارة أو عدّ وصول، ولا يمكن لأي مستند مدمج أن يولّد حلقة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. خصائص الكتلة مسطحة وليست متداخلة: كل زوج (عقدة، مفتاح) سجل LWW مستقل،
 *       فالتداخل يجعل الكائن كله سجلاً واحداً يخسر التعديلات بصمت تحت التعاون.
 *    2. إصلاح المعرّفات حتمي (من البايتات لا من Math.random) كي يتفق قارئان.
 *    3. إصلاح المعرّف يُعطَّل تماماً عند سياسة/نسخة غير معروفة (frozen).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لكل المدخلات (isObj).
 *    - تقطيع الصفوف والكتل: كل ما لا يُفهم يُتخطى لا يُسقَط.
 *    - الوالد الذي يسمّي ما لا وجود له يُحذف (لا يُترك معلقاً).
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const FORMAT = 'bento/spaces'
export const FORMAT_VERSION = 1

/**
 * قواعد قد تتغير مستقبلاً مثبتة كقيم وليست مستنتجة من `version`.
 * النصف المفتوح من الاتحاد حامل (Load-Bearing): سياسة غير معروفة يجب أن
 * تفتح الملف وتُعيد دورته بايت-ببايت مع تعطيل التنضيد وإصلاح المعرّفات.
 */
export type Policy = 'bento-spaces-1' | (string & {})

/**
 * كتلة المحتوى.
 *
 * الخصائص مسطحة (Flat) وليست متداخلة تحت كائن `props` — تحت التعاون كل زوج
 * (عقدة، مفتاح) سجل Last-Writer-Wins مستقل؛ مع `props` متداخل يصير الكائن
 * كله سجلاً واحداً ويُفقد أحد التعديلين بصمت.
 *
 * `html` نص غني inline-only (راجع html-sanitizer). بنية الكتلة هي `type`،
 * وليست وسماً — المُصيّر يُصدر الوسم الدلالي.
 */
export interface Block {
  id: string
  type: string
  /** inline-only html; يُنضَّد (canonicalised) عند إغلاق جلسة الكتابة */
  html?: string
  /** التعشيش داخل الصفحة: معرّف الكتلة المالكة */
  parent?: string

  // ---- حقول حسب النوع، مسطحة عمداً -------------------------------
  /** todo */
  done?: boolean
  /** code */
  lang?: string
  /** toggle: حالة الطي كما حُفظت نية تأليفية فهي بيانات مستند */
  open?: boolean
  /** image: 'asset:<key>' | data: | https: */
  src?: string
  alt?: string
  caption?: string
  /** عرض الصورة كنسبة مئوية من عمود النص (10..100) */
  width?: number
  /** الأبعاد الذاتية بالبكسل عند الإدراج */
  w?: number
  h?: number
  /** pagelink: معرّف الصفحة الهدف */
  page?: string
  /** callout: نوع التنبيه (سلسلة مفتوحة — القيمة المستقبلية تعيش) */
  tone?: string
  /** callout: أيقونة تتجاوز علامة النغمة الافتراضية */
  icon?: string

  [extra: string]: unknown
}

export interface Page {
  id: string
  title: string
  /** تعشيش شجرة الصفحات؛ الغياب = صفحة جذر */
  parent?: string
  /** رمز تعبيري واحد، وليس رابطاً */
  icon?: string
  /** كتل مسطحة بترتيب Pre-Order؛ التعشيش عبر Block.parent */
  blocks: Block[]
  /** خارج الشريط الجانبي، ما زال قابلاً للبحث والربط */
  archived?: boolean
  created?: string
  edited?: string
  [extra: string]: unknown
}

export interface Theme {
  background: string
  color: string
  accent: string
  fontFamily: string
  headingFamily?: string
  /** عرض عمود النص بالبكسل — بيانات مستند */
  measure?: number
  /** الاتجاه الأساسي لمحتوى الصفحة */
  dir?: 'ltr' | 'rtl'
}

export interface SpaceDoc {
  format: typeof FORMAT
  version: number
  /** الغياب ⇒ bento-spaces-1 */
  policy?: Policy
  /** يُصك عند الإنشاء/التحميل ولا يُعاد توليده أبداً */
  docId: string
  title: string
  modified?: string
  pages: Page[]
  /** الصفحة المعروضة عند الفتح؛ الغياب ⇒ pages[0] */
  home?: string
  theme: Theme
  assets?: Record<string, string>
  fonts?: Array<{ family: string; asset: string; weight?: string; style?: string }>
  readonly?: boolean
  template?: boolean
  /** محجوز — اعتمادات التعاون */
  collab?: unknown
  [extra: string]: unknown
}

/** معرّف قصير آمن: UUID إن وُجد ثم احتياط عشوائي. */
export const uid = (p = 'b'): string => {
  const r = globalThis.crypto?.randomUUID?.()
  return r ? `${p}-${r.slice(0, 8)}` : `${p}-${Math.random().toString(36).slice(2, 10)}`
}

export const newBlock = (type = 'p', extra: Partial<Block> = {}): Block =>
  ({ id: uid('b'), type, html: '', ...extra })

export const newPage = (title = 'Untitled', extra: Partial<Page> = {}): Page =>
  ({ id: uid('p'), title, blocks: [newBlock()], ...extra })

export function defaultTheme(): Theme {
  return {
    background: '#FFFFFF',
    color: '#1E2A3A',
    accent: '#F7A600',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    measure: 720,
  }
}

/** المحتوى الذي يهم "هل تغيّر" — يستثني الحقول المتقلبة. */
export function docContentKey(doc: SpaceDoc): string {
  return JSON.stringify([doc.title, doc.home, doc.pages])
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v)

/** إصلاح معرّف حتمي من البايتات — لا من Math.random ولا من docId (الذي
 *  يُعاد صكه عند `template: true`). قارئان لملف واحد يتفقان على كل معرّف. */
function repairId(scope: string, ordinal: number, content: string, salt = 0): string {
  let h = 0x811c9dc5
  const s = `${scope}\u001f${ordinal}\u001f${content}\u001f${salt}`
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return `r-${h.toString(36)}`
}

export type SpaceDocParseResult =
  | { ok: true; doc: SpaceDoc; repaired: string[]; frozen?: 'policy' | 'version' }
  | { ok: false; err: 'empty' }
  | { ok: false; err: 'json' | 'format' | 'shape'; detail: string; found?: string }

/**
 * تحليل مستند JSON بتطبيع آمن:
 *  · الصفحات تُصلَح أولاً بترتيب Pre-Order ليكون معرّف الصفحة المالكة نهائياً.
 *  · الوالد الذي يسمّي شيئاً غير موجود يُحذف (لا يُترك معلقاً).
 *  · عندما تُعلن السياسة/النسخة قواعد لا تملكها هذه البنية (frozen) يُعاد
 *    الدوران بايت-ببايت مع تعطيل التنضيد وإصلاح المعرّفات.
 */
export function parseDoc(json: string): SpaceDocParseResult {
  if (!json || !json.trim()) return { ok: false, err: 'empty' }

  let raw: unknown
  try {
    raw = JSON.parse(json)
  } catch (e) {
    return { ok: false, err: 'json', detail: (e as Error).message }
  }
  if (!isObj(raw)) return { ok: false, err: 'shape', detail: 'the document block is not a JSON object' }

  if (raw.format !== FORMAT) {
    return {
      ok: false,
      err: 'format',
      detail: `this document declares "${String(raw.format ?? '(nothing)')}"`,
      found: typeof raw.format === 'string' ? raw.format : undefined,
    }
  }
  if (!Array.isArray(raw.pages)) {
    return { ok: false, err: 'shape', detail: 'a bento/spaces document needs a "pages" array' }
  }

  const version = typeof raw.version === 'number' ? raw.version : FORMAT_VERSION
  const policy = typeof raw.policy === 'string' ? raw.policy : 'bento-spaces-1'
  const frozen: 'policy' | 'version' | undefined =
    version > FORMAT_VERSION ? 'version' : policy !== 'bento-spaces-1' ? 'policy' : undefined

  const repaired: string[] = []
  const seen = new Set<string>()
  const claim = (want: unknown, scope: string, ordinal: number, content: string): string => {
    const id = typeof want === 'string' && want ? want : ''
    if (id && !seen.has(id)) { seen.add(id); return id }
    if (frozen && id) return id // frozen: never rewrite, even a duplicate
    let salt = 0
    let next = repairId(scope, ordinal, content, salt)
    while (seen.has(next)) next = repairId(scope, ordinal, content, ++salt)
    seen.add(next)
    repaired.push(id || '(missing id)')
    return next
  }

  const pages: Page[] = (raw.pages as unknown[]).map((p, pi) => {
    const src = isObj(p) ? p : {}
    const title = typeof src.title === 'string' ? src.title : 'Untitled'
    const pid = claim(src.id, String(src.parent ?? ''), pi, title)
    const blocksRaw = Array.isArray(src.blocks) ? src.blocks : []
    const blocks: Block[] = blocksRaw.map((b, bi) => {
      const bs = isObj(b) ? b : {}
      const type = typeof bs.type === 'string' && bs.type ? bs.type : 'p'
      const html = typeof bs.html === 'string' ? bs.html : undefined
      return {
        ...bs,
        id: claim(bs.id, pid, bi, `${type}${html ?? ''}`),
        type,
        ...(html !== undefined ? { html } : {}),
      } as Block
    })
    return { ...src, id: pid, title, blocks } as Page
  })

  const pageIds = new Set(pages.map((p) => p.id))
  for (const p of pages) {
    if (p.parent && !pageIds.has(p.parent)) delete p.parent
    const own = new Set(p.blocks.map((b) => b.id))
    for (const b of p.blocks) if (b.parent && !own.has(b.parent)) delete b.parent
  }

  const doc: SpaceDoc = {
    ...raw,
    format: FORMAT,
    version,
    docId: typeof raw.docId === 'string' && raw.docId ? raw.docId : uid('doc'),
    title: typeof raw.title === 'string' ? raw.title : 'Untitled space',
    pages,
    theme: { ...defaultTheme(), ...(isObj(raw.theme) ? raw.theme : {}) },
  } as SpaceDoc

  return { ok: true, doc, repaired, ...(frozen ? { frozen } : {}) }
}

// ---- مشتقات، لا تُخزَّن أبداً ---------------------------------------------
// تتعفن اللحظة التي يكتب فيها أي شيء آخر المستند، لذا تُشتق عند التحميل.

export interface SpaceIndex {
  page: Map<string, Page>
  /** page id → child pages in order; '' = root */
  children: Map<string, Page[]>
  block: Map<string, { block: Block; pageId: string }>
  /** target page id → the blocks that link to it */
  backlinks: Map<string, Array<{ pageId: string; blockId: string }>>
}

const LINK_RE = /href="#p\/([^"]+)"/g

/** الصفحة التي يسمّيها هدف `#p/…` — يدعم `#p/<page>/<block>` لمستقبلية
 *  الإصدارات الأحدث دون كسر الروابط. */
function linkTarget(raw: string, pages: Map<string, Page>): string {
  if (pages.has(raw)) return raw
  const cut = raw.lastIndexOf('/')
  return cut > 0 ? raw.slice(0, cut) : raw
}

const pushInto = <T>(m: Map<string, T[]>, k: string, v: T) => {
  const list = m.get(k)
  if (list) list.push(v)
  else m.set(k, [v])
}

/**
 * الإجابة الوحيدة عن "تحت أي كتلة هذا".
 *
 * الوالد الفعلي للكتلة هو `b.parent` إذا وُجدت في نفس الصفحة وقبلها حصراً
 * في المصفوفة. أي شيء آخر — والد غائب، أو هو نفسه، أو لاحق — يتحلل إلى الجذر.
 *
 * موضعي لأنه لا يمكن أن يفشل: والدٌ سابقٌ حصراً يعني النتيجة ACYCLIC BY
 * CONSTRUCTION — لا مجموعة زيارة، لا حد قفز، لا مسح وصول، ولا مستند يمكن
 * تأليفه أو دمجه في شكل يجعله يدور.
 */
export function effectiveParents(page: Page): Map<string, string | undefined> {
  const out = new Map<string, string | undefined>()
  const seenAt = new Map<string, number>()
  page.blocks.forEach((b, i) => {
    const p = typeof b.parent === 'string' ? b.parent : undefined
    out.set(b.id, p !== undefined && seenAt.has(p) ? p : undefined)
    seenAt.set(b.id, i)
  })
  return out
}

/**
 * كل كتلة متداخلة تحت `id` على أي عمق — بالقاعدة الموضعية أعلاه، فهي
 * تنتهي على أي مستند ولا تخرج أبداً خارج الشجرة الفرعية.
 */
export function descendantsOf(page: Page, id: string): Set<string> {
  const eff = effectiveParents(page)
  const out = new Set<string>()
  // تمريرة أمامية واحدة تكفي: الطفل يتبع والده الفعلي دائماً
  for (const b of page.blocks) {
    const p = eff.get(b.id)
    if (p !== undefined && (p === id || out.has(p))) out.add(b.id)
  }
  return out
}

export function buildIndex(doc: SpaceDoc): SpaceIndex {
  const page = new Map<string, Page>()
  const children = new Map<string, Page[]>()
  const block = new Map<string, { block: Block; pageId: string }>()
  const backlinks = new Map<string, Array<{ pageId: string; blockId: string }>>()

  for (const p of doc.pages) page.set(p.id, p)
  for (const p of doc.pages) {
    pushInto(children, p.parent && page.has(p.parent) ? p.parent : '', p)
    for (const b of p.blocks) {
      block.set(b.id, { block: b, pageId: p.id })
      if (b.html) {
        for (const m of b.html.matchAll(LINK_RE)) {
          pushInto(backlinks, linkTarget(m[1], page), { pageId: p.id, blockId: b.id })
        }
      }
      if (b.type === 'pagelink' && typeof b.page === 'string') {
        pushInto(backlinks, b.page, { pageId: p.id, blockId: b.id })
      }
    }
  }
  return { page, children, block, backlinks }
}

/** الصفحة التي يهبط عليها القارئ. */
export const homePage = (doc: SpaceDoc): Page | undefined =>
  (doc.home ? doc.pages.find((p) => p.id === doc.home) : undefined) ?? doc.pages[0]

/**
 * هل سيلمس تحميل هذا src الشبكة؟
 *
 * قائمة سماح محلية من الشكلين: `asset:` داخل الملف و `data:` هو البايتات
 * نفسها. كل ما عدا ذلك خارجي (بما فيه المسار النسبي و //host). الاختبار
 * قائمة سماح لا قائمة حظر.
 */
export function isRemote(src: string): boolean {
  if (!src) return false
  return !src.startsWith('asset:') && !src.startsWith('data:')
}
