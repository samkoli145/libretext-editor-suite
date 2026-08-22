/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: سطح الوكيل (Agent Surface) — الفحص (validate) والكتابة بنمط
 *           PLAN/APPLY: كل فعل كتابة يرد خطة (Plan) تتحقق من المستند ثم ترد
 *           ثنك تطبيق، بخطوة Undo واحدة، دون لمس إلا ما تسمّيه.
 * 🏛️ الدور: نواة معزولة (Zero-Dependency Engine) داخل document-pipeline.
 * 📥 المستهلك: window.bento (agent API), CanvasDesigner, RichTextEditor,
 *           board/issue UIs, أي وكيل يؤلف مستندات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    PLAN/APPLY Contract: كل فعل كتابة يتحقق أولاً ويرد خطة؛ `store.commit`
 *    يضع علامة Undo قبل التحول، لذا التخطيط داخل commit يعني أن رقعة مرفوضة
 *    ما تزال تدفع مدخل Undo يلغي لا شيئاً. التخطيط أولاً يجعل مسار الكتابة
 *    كله قابلاً للاختبار في node (حيث لا store ولا DOM).
 *    السطح مضمون بالثابت: لا يستطيع وكيل كتابة مستند لا يستطيع هذا البناء
 *    نفسه إنتاجه — html يمر على المُطهّر عند الدخول، وقيمة لا يحملها JSON
 *    تُرفض لا تُسقط بصمت عند الحفظ.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل ما يفشل هنا يفشل بصمت في مستند الوكيل — الرابط لصفحة أعيدت
 *       تسميتها ما زال رابطاً في JSON، `<p>` يُفتح بلا شكوى، نوع كتلة
 *       مجهول يسقط لنصه — `validate()` هو الممر الذي يقول ذلك بصوت عالٍ.
 *    2. المعرّفات تُصك داخل الخطة لا من المتصل، فلا يمكن لوكيل أن يصطدم
 *       بمعرّف موجود. و `parent` يُعاد تعيينه ضد معرفات الدفعة نفسها.
 *    3. إسقاط الكتلة المتتالي (cascade) ليس ترفاً: حذف toggle وحده يترك
 *       كتلاً تشير لمعرّف معدوم فيعيد التحميل إسكانها غير متداخلة.
 *    4. إعادة ترميز الحقل: كل فعل كتابة يمر على syncProp، فـ `html` لا
 *       يستطيع أن يفارق `value` أبداً — ضمان التدهور يطبَّق حيث تُكتب الكتل.
 *    5. مرحلة حلقية في مستند مدمج: `planUpdatePage` تمشي تسلسل الوصول
 *       (bounded) فتموت الحلقة قبل أن تشنق التبويب.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - `jsonSafe` يرفض الدوال وعقد DOM والـ Map والـ Date قبل الالتزام.
 *    - `badTitle` يرفض عنواناً ليس سلسلة بدل قولبة [object Object].
 *    - صفحة تفرغ تُملأ فقرة جديدة — المؤشر/الهامش/قائمة / كلها معلقة بكتلة.
 *    - قيمة حقل غير معروفة/خيار غير معروف تُكتب وتُبلّغ (additivity) لا تُرفض.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/spaces/agent.ts (The Bento authors, MIT).
 */

import {
  type Block, type Page, type SpaceDoc, buildIndex, descendantsOf, isRemote, newBlock, newPage, uid,
} from './block-document-model'
import {
  type FieldSpec, type FieldOption, ISSUE_FIELDS, fieldByKey, fieldsOf, headerLength, isIssue, optionOf,
  propBlock, propHtml, valuesOf,
} from './schema-driven-fields-engine'
import { humanBytes, orphanAssets } from './content-addressed-asset-engine'

// ---------------------------------------------------------------------------
// سجل الكتل + أدوات تطهير/نص مضمّنة (نفس سياسة Bento inline-only)
// ---------------------------------------------------------------------------

/** سجل أنواع الكتل المعروفة — قابل للحقن حتى لا يعيش صندوق معرّفات هنا. */
export interface BlockRegistry {
  types: Set<string>
  init?: (block: Block) => void
}

const INLINE_ALLOWED = new Set(['B', 'I', 'U', 'S', 'EM', 'STRONG', 'CODE', 'BR', 'SPAN', 'MARK', 'SUB', 'SUP', 'A'])
const UNWRAP_TAGS = new Set(['P', 'DIV', 'SECTION', 'ARTICLE', 'LI', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'PRE', 'FONT'])
const HREF_OK = /^(https?:|mailto:|#p\/)/i

/** حلل html غير موثوق إلى مستند خامل (inert) — DOMParser لا يُحمّل الموارد. */
export function inertBody(html: string): HTMLElement {
  return new DOMParser().parseFromString(html, 'text/html').body
}

/** اسحب كل ما خارج قائمة السماح؛ وسوم البنية تُفتح (نصها يبقى). */
export function sanitizeInline(html: string): string {
  if (typeof document === 'undefined') return stripAllTags(html)
  const host = inertBody(html)

  const walk = (node: Node): void => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) continue
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove()
        continue
      }
      const el = child as HTMLElement
      const tag = el.tagName

      if (!INLINE_ALLOWED.has(tag)) {
        walk(el)
        if (UNWRAP_TAGS.has(tag)) {
          const needsGap = el.nextSibling || el.previousSibling
          while (el.firstChild) el.parentNode!.insertBefore(el.firstChild, el)
          if (needsGap) el.parentNode!.insertBefore(el.ownerDocument.createTextNode(' '), el)
        }
        el.remove()
        continue
      }

      for (const attr of [...el.attributes]) {
        const keep = tag === 'A' && attr.name === 'href' && HREF_OK.test(attr.value)
        if (!keep) el.removeAttribute(attr.name)
      }
      if (tag === 'A' && !el.getAttribute('href')) {
        walk(el)
        while (el.firstChild) el.parentNode!.insertBefore(el.firstChild, el)
        el.remove()
        continue
      }
      if (tag === 'A') {
        const href = el.getAttribute('href')!
        if (!href.startsWith('#')) {
          el.setAttribute('rel', 'noopener noreferrer')
          el.setAttribute('target', '_blank')
        }
      }
      walk(el)
    }
  }
  walk(host)
  return host.innerHTML
}

/** بديل بلا DOM (أدوات node): أسقط كل وسم، أبقِ الكلمات. */
function stripAllTags(html: string): string {
  return html
    .replace(/<(p|div|br|li|h[1-6]|blockquote|pre)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** النص المسطح لكتلة، للبحث ولتصدير markdown. */
export function textOf(html: string | undefined): string {
  if (!html) return ''
  if (typeof document === 'undefined') return stripAllTags(html)
  return inertBody(html).textContent ?? ''
}

/** هروب آمن للإدراج كنص (يرويّ قيم الخصائص). */
export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** هروب كتلة code: & و < و > فقط — ما يصدره مسلسل html لعقدة نصية. */
export const escText = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ---------------------------------------------------------------------------
// أدوات مشتركة
// ---------------------------------------------------------------------------

const words = (s: string): number => (s.trim() ? s.trim().split(/\s+/).length : 0)

const utf8len = (s: string): number =>
  typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length

export interface BlockAt {
  block: Block
  page: Page
  index: number
}

export function findBlock(doc: SpaceDoc, id: string): BlockAt | null {
  for (const page of doc.pages) {
    const index = page.blocks.findIndex((b) => b.id === id)
    if (index >= 0) return { block: page.blocks[index], page, index }
  }
  return null
}

/** كل كتلة متداخلة تحت id — بالقاعدة الموضعية (acyclic by construction). */
function descendants(page: Page, id: string): Set<string> {
  return descendantsOf(page, id)
}

/**
 * هل يحمل JSON.stringify هذه القيمة دون تغيير؟
 *
 * دالة أو عقدة DOM أو Map أو Date تُسنَد بنجاح ثم تختفي عند الحفظ أو ترمي
 * على حلقة — الفشل يظهر بعد ساعات في الملف بلا دليل. الصيغة تراكمية، فالمفاتيح
 * المجهولة مرحّب بها؛ الأشكال المجهولة ليست كذلك.
 */
export function jsonSafe(v: unknown, depth = 0): boolean {
  if (v === null) return true
  const t = typeof v
  if (t === 'string' || t === 'boolean') return true
  if (t === 'number') return Number.isFinite(v as number)
  if (depth > 12) return false
  if (Array.isArray(v)) return v.every((x) => jsonSafe(x, depth + 1))
  if (t === 'object') {
    const proto = Object.getPrototypeOf(v)
    if (proto !== Object.prototype && proto !== null) return false
    return Object.values(v as Record<string, unknown>).every((x) => jsonSafe(x, depth + 1))
  }
  return false
}

const hasElements = (html: string): boolean =>
  typeof document === 'undefined'
    ? /<[a-z][a-z0-9]*(\s|\/|>)/i.test(html)
    : !!inertBody(html).querySelector('*')

/**
 * الصيغة المخزنة لـ html كتلة، كما كان سيطّبقها المحرر.
 *
 * كتلة `code` مختلفة: المُصيّر يأخذ textContent، وما يخزّنه contentEditable
 * مُهرَّب — `<div>` في كتلة code يعيش في الملف كـ `&lt;div&gt;`. فـ code
 * يُهرَّب بدل تطهيره، وفقط حين يحمل وسوماً حية فعلاً: النص المهرَّب أصلاً
 * يمر دون مساس (متطابق الهوية — رقعة تُعاد لن تُضاعَف الهروب).
 */
export function normalizeHtml(html: string, type: string): string {
  if (type === 'code') return hasElements(html) ? esc(html) : html
  return sanitizeInline(html)
}

/** عنوان الصفحة يُعرض كنص، فالترميز فيه سيظهر حرفياً. */
export const plainTitle = (v: unknown): string => textOf(String(v ?? ''))

/** العنوان يجب أن يكون سلسلة — القولبة لنوع خاطئ كذبة. */
export const badTitle = (v: unknown): boolean => v != null && typeof v !== 'string'

// ---------------------------------------------------------------------------
// validate()
// ---------------------------------------------------------------------------

export type Severity = 'error' | 'warning' | 'info'

export interface Finding {
  /** رمز آلي ثابت، مثل 'broken-link' */
  code: string
  severity: Severity
  /** ما الخطأ، في سطر واحد، قابل للتنفيذ وحده */
  message: string
  /** كيف تُصلحه */
  fix: string
  page?: string
  block?: string
  /** الحقل الذي تعنيه، حين تعنيه */
  path?: string
}

export interface ValidateResult {
  /** بلا أخطاء. التحذيرات والمعلومات لا تجعل المستند غير صالح. */
  ok: boolean
  counts: Record<Severity, number>
  findings: Finding[]
}

/** وسوم inline قد تحتفظ بها كتلة (قائمة السماح، صغيرة). */
const INLINE_OK = new Set(['b', 'i', 'u', 's', 'em', 'strong', 'code', 'br', 'span', 'mark', 'sub', 'sup', 'a'])
/** الوسوم التي يفتحها المُطهّر: الوسم يذهب والكلمات تبقى. */
const UNWRAPPED = new Set([...UNWRAP_TAGS].map((t) => t.toLowerCase()))

const TAG_RE = /<\/?([a-z][a-z0-9]*)\b/gi
const LINK_RE = /href\s*=\s*["']([^"']*)["']/gi

/**
 * ما لا يُفحص عمداً: أسماء الخصائص المجهولة. حقول هذه الصيغة المجهولة ميزة —
 * هي كيف تنجو بيانات بناء مستقبلي عبر بناء أقدم، وكيف يوقف الوكيل بياناته
 * الوصفية على كتلة. التحذير منها يطلق على مستندات تعمل تماماً كما صُممت،
 * وفاحص ينبح على المستندات الجيدة فاحص يتعلم الوكيل تخطيه.
 */
export function validateDoc(doc: SpaceDoc, registry?: BlockRegistry): ValidateResult {
  const findings: Finding[] = []
  const add = (f: Finding) => findings.push(f)
  const pages = Array.isArray(doc.pages) ? doc.pages : []
  const assets = doc.assets ?? {}
  const known = registry?.types ?? new Set<string>()

  if (!pages.length) {
    add({ code: 'no-pages', severity: 'error', message: 'This space has no pages.',
      fix: 'Add at least one page — the reader shows "This space has no pages." until there is one.' })
  }

  // ---- الهوية ------------------------------------------------------------
  const seen = new Set<string>()
  const claim = (id: unknown, where: Pick<Finding, 'page' | 'block'>, what: string) => {
    if (typeof id !== 'string' || !id) {
      add({ ...where, code: 'missing-id', severity: 'error', path: 'id',
        message: `A ${what} has no id.`,
        fix: 'Give it a unique string id. Loading assigns one derived from the bytes, which is not the id you meant to link to.' })
      return
    }
    if (seen.has(id)) {
      add({ ...where, code: 'duplicate-id', severity: 'error', path: 'id',
        message: `The id "${id}" is used more than once. Ids are unique across the whole document, not per page.`,
        fix: 'Rename the later one. Loading repairs it to a derived id, which silently breaks every link that pointed at it.' })
      return
    }
    seen.add(id)
  }
  for (const p of pages) {
    claim(p.id, { page: p.id }, 'page')
    for (const b of Array.isArray(p.blocks) ? p.blocks : []) claim(b.id, { page: p.id, block: b.id }, 'block')
  }

  const pageIx = new Map(pages.map((p) => [p.id, p]))

  // ---- شجرة الصفحات ------------------------------------------------------
  for (const p of pages) {
    if (p.parent && !pageIx.has(p.parent)) {
      add({ page: p.id, code: 'no-such-page-parent', severity: 'warning', path: 'parent',
        message: `Page "${p.title}" names parent "${p.parent}", which is not a page in this space.`,
        fix: 'Point parent at a real page id, or remove it. Loading drops it and the page becomes a root page.' })
    }
    const walked = new Set<string>([p.id])
    for (let up = p.parent; up; up = pageIx.get(up)?.parent) {
      if (walked.has(up)) {
        add({ page: p.id, code: 'page-cycle', severity: 'error', path: 'parent',
          message: `Page "${p.title}" is inside its own subtree, so the tree never reaches the root and the page never appears in the sidebar.`,
          fix: 'Break the loop: give it a parent outside its own descendants, or none.' })
        break
      }
      walked.add(up)
    }
  }
  if (doc.home && !pageIx.has(doc.home)) {
    add({ code: 'no-such-home', severity: 'warning', path: 'home',
      message: `home names "${doc.home}", which is not a page in this space.`,
      fix: 'Set home to a real page id. Readers land on the first page instead, which may not be the one you wrote to be landed on.' })
  }

  // ---- مخطط الحقول --------------------------------------------------------
  const fieldOf = new Map<string, FieldSpec>()
  for (const f of fieldsOf(doc)) {
    if (f && typeof f.key === 'string' && f.key && typeof f.label === 'string') {
      fieldOf.set(f.key, f)
      continue
    }
    add({ code: 'bad-field-schema', severity: 'error', path: 'fields',
      message: `A field in doc.fields has no string key and label (${JSON.stringify(f ?? null).slice(0, 60)}). Writing a value for it THROWS while building its readable form.`,
      fix: 'Give every entry a string `key`, a string `label`, and a `vt` of select | person | number | date | text | labels.' })
  }

  // ---- الصفحات والكتل -----------------------------------------------------
  const usedAssets = new Set<string>()
  for (const p of pages) {
    const blocks = Array.isArray(p.blocks) ? p.blocks : []
    const own = new Set(blocks.map((b) => b.id))
    const propKeys = new Set<string>()

    if (!blocks.length) {
      add({ page: p.id, code: 'no-blocks', severity: 'error', path: 'blocks',
        message: `Page "${p.title}" has no blocks, so there is nothing in it to put a caret in — it cannot be typed into.`,
        fix: 'Give it at least one block, e.g. { "type": "p", "html": "" }.' })
    } else if (!blocks.some((b) => textOf(b.html).trim() || b.type === 'image' || b.type === 'pagelink' || b.type === 'divider')) {
      add({ page: p.id, code: 'empty-page', severity: 'info',
        message: `Page "${p.title}" has blocks but no content.`,
        fix: 'Write something, or remove the page. A deliberately blank page (an inbox, a stub) is fine — this is only a note.' })
    }

    for (const b of blocks) {
      const at = { page: p.id, block: b.id }

      if (known.size && !known.has(b.type)) {
        add({ ...at, code: 'unknown-block-type', severity: 'warning', path: 'type',
          message: `"${b.type}" is not a block type this build renders — it falls back to showing its html as plain text.`,
          fix: `Use one of: ${[...known].join(', ')}. The block and its fields survive untouched either way.` })
      }

      if (b.parent && !own.has(b.parent)) {
        add({ ...at, code: 'no-such-block-parent', severity: 'warning', path: 'parent',
          message: `Block parent "${b.parent}" is not a block on this page — nesting only works inside one page.`,
          fix: 'Name a block on the same page, or drop parent. Loading drops it and the block un-nests.' })
      }

      // ---- html -----------------------------------------------------------
      if (typeof b.html === 'string' && b.html.includes('<')) {
        const unwrapped: string[] = []
        const dropped: string[] = []
        for (const m of b.html.matchAll(TAG_RE)) {
          const tag = m[1].toLowerCase()
          if (INLINE_OK.has(tag)) continue
          if (UNWRAPPED.has(tag)) {
            if (!unwrapped.includes(tag)) unwrapped.push(tag)
          } else if (!dropped.includes(tag)) dropped.push(tag)
        }
        if (b.type === 'code' && (unwrapped.length || dropped.length)) {
          add({ ...at, code: 'markup-in-code', severity: 'warning', path: 'html',
            message: `A code block's html is plain TEXT — the renderer shows its textContent, so <${(unwrapped[0] ?? dropped[0])}> disappears and takes its markup with it.`,
            fix: 'Escape it: write &lt;div&gt; rather than <div>. That is what typing into a code block stores.' })
        } else if (b.type !== 'code') {
          if (unwrapped.length) {
            add({ ...at, code: 'block-markup', severity: 'warning', path: 'html',
              message: `html is inline only, and carries block markup (<${unwrapped.join('>, <')}>). The tags are unwrapped at render and the structure is lost.`,
              fix: 'Split it into separate blocks — structure is Block.type, never markup.' })
          }
          if (dropped.length) {
            add({ ...at, code: 'dropped-markup', severity: 'error', path: 'html',
              message: `<${dropped.join('>, <')}> is outside the inline allowlist, so the tag AND everything inside it is removed before anything is shown.`,
              fix: 'Use a block type that can carry it (image, code, quote), or inline tags only: b i u s em strong code a span mark sub sup br.' })
          }
        }
        for (const m of b.html.matchAll(LINK_RE)) {
          const href = m[1]
          if (href.startsWith('#p/')) {
            const raw = href.slice(3)
            const cut = raw.lastIndexOf('/')
            const target = pageIx.has(raw) || cut <= 0 ? raw : raw.slice(0, cut)
            if (!pageIx.has(target)) {
              add({ ...at, code: 'broken-link', severity: 'error', path: 'html',
                message: `Links to page "${target}", which does not exist — the link renders and does nothing when clicked.`,
                fix: 'Point it at a real page id, create that page, or remove the link.' })
            }
          } else if (!/^(https?:|mailto:)/i.test(href)) {
            add({ ...at, code: 'dead-href', severity: 'warning', path: 'html',
              message: `href "${href.slice(0, 40)}" is outside the allowlist (https:, mailto:, #p/), so the sanitizer drops the link and leaves only its text.`,
              fix: 'Use #p/<pageId> for a page in this space, or an https:/mailto: url.' })
          }
        }
      }

      // ---- حسب النوع ------------------------------------------------------
      if (b.type === 'pagelink') {
        const target = typeof b.page === 'string' ? b.page : ''
        if (!target || !pageIx.has(target)) {
          add({ ...at, code: 'broken-link', severity: 'error', path: 'page',
            message: `A pagelink card points at "${target || '(nothing)'}", which is not a page — it renders as "(missing page)".`,
            fix: 'Set page to a real page id, or remove the block.' })
        }
      }

      // ---- قيم الحقول ------------------------------------------------------
      if (b.type === 'prop') {
        const key = String((b as { key?: unknown }).key ?? '')
        const f = fieldOf.get(key)
        const value = (b as { value?: unknown }).value
        const unset = value === undefined || value === null || value === ''
        if (!key) {
          add({ ...at, code: 'prop-no-key', severity: 'warning', path: 'key',
            message: 'A prop block has no `key`, so it names no field: nothing reads it, the header strip cannot label it, and a board cannot group by it.',
            fix: `Set key to one of: ${[...fieldOf.keys()].join(', ')}.` })
        } else if (!f) {
          add({ ...at, code: 'unknown-field-key', severity: 'info', path: 'key',
            message: `"${key}" is not a field in doc.fields, so its value shows only as the text in its html and cannot be edited or grouped by here.`,
            fix: `Add { "key": "${key}", "label": "…", "vt": "text" } to doc.fields, or use one of: ${[...fieldOf.keys()].join(', ')}.` })
        } else if (f.vt === 'select' && !unset && !optionOf(f, value)) {
          add({ ...at, code: 'unknown-field-value', severity: 'info', path: 'value',
            message: `"${String(value)}" is not one of ${key}'s options, so it is shown verbatim and grouped apart from the rest.`,
            fix: `Use an option id — ${(f.options ?? []).map((o) => o.id).join(', ')} — or declare this one in doc.fields. The value is kept either way.` })
        } else if (b.html !== propHtml(f, value)) {
          add({ ...at, code: 'prop-html-stale', severity: 'warning', path: 'html',
            message: `This value's readable form disagrees with its value: html is ${JSON.stringify(b.html ?? '')} where the value reads "${propHtml(f, value)}". An older build, a thumbnailer, a grep and the markdown export show the html — so they all show the wrong value.`,
            fix: 'Write both together: bento.setField(page, key, value) does, and so does the editor. Never assign `value` on its own.' })
        }
        if (key) {
          if (propKeys.has(key)) {
            add({ ...at, code: 'duplicate-prop', severity: 'warning', path: 'key',
              message: `This page carries more than one value for "${key}". A reader takes the LAST one, so the earlier block is a value that is shown in the header, found by search, and ignored by every query.`,
              fix: 'Remove the duplicate block. bento.setField writes all of them at once while they exist, so the page at least cannot disagree with itself.' })
          }
          propKeys.add(key)
        }
      }

      const src = typeof b.src === 'string' ? b.src : ''
      if (src.startsWith('asset:')) usedAssets.add(src.slice(6))
      if (b.type === 'image') {
        if (!src) {
          add({ ...at, code: 'image-no-src', severity: 'error', path: 'src',
            message: 'An image block has no src, so nothing renders.',
            fix: 'Set src to asset:<key>, or a data: URI.' })
        } else if (src.startsWith('asset:') && !(src.slice(6) in assets)) {
          add({ ...at, code: 'missing-asset', severity: 'error', path: 'src',
            message: `src references asset "${src.slice(6)}", which is not in doc.assets — nothing renders.`,
            fix: 'Add the data: URI to doc.assets under that key, or point src at one that is there.' })
        } else if (isRemote(src)) {
          add({ ...at, code: 'remote-image', severity: 'warning', path: 'src',
            message: `src is remote (${src.slice(0, 48)}), so it shows a placeholder naming the host until the reader clicks "Load this image".`,
            fix: 'Embed the bytes: put the data: URI in doc.assets and reference it as asset:<key>.' })
        }
        if (!String(b.alt ?? '').trim()) {
          add({ ...at, code: 'image-no-alt', severity: 'warning', path: 'alt',
            message: 'This image has no alt text — screen readers get nothing, and alt is what a reader SEES if the image is remote and unloaded.',
            fix: 'Write what the image shows, in a sentence.' })
        }
        if (!b.w || !b.h) {
          add({ ...at, code: 'image-no-size', severity: 'info', path: 'w',
            message: 'No intrinsic w/h, so the page reflows under the reader as the image decodes.',
            fix: "Set w and h to the image's pixel size." })
        }
      }
    }
  }

  // ---- الأصول -------------------------------------------------------------
  for (const f of doc.fonts ?? []) {
    if (f.asset && !(f.asset in assets)) {
      add({ code: 'missing-asset', severity: 'error', path: `fonts.${f.family}`,
        message: `Font "${f.family}" names asset "${f.asset}", which is not in doc.assets — the face never loads and text silently falls back.`,
        fix: 'Add the woff2 data: URI under that key, or drop the font entry.' })
    }
    usedAssets.add(f.asset)
  }
  const orphans = orphanAssets(doc)
  if (orphans.length) {
    let bytes = 0
    for (const k of orphans) bytes += (assets[k] ?? '').length
    add({ code: 'orphan-asset', severity: 'info', path: 'assets',
      message: `${orphans.length} asset(s) (${humanBytes(bytes)}) are in doc.assets but referenced by nothing.`,
      fix: `Delete these keys to shrink the file: ${orphans.slice(0, 8).join(', ')}${orphans.length > 8 ? ', …' : ''}` })
  }

  const counts: Record<Severity, number> = { error: 0, warning: 0, info: 0 }
  for (const f of findings) counts[f.severity]++
  return { ok: counts.error === 0, counts, findings }
}

// ---------------------------------------------------------------------------
// outline()
// ---------------------------------------------------------------------------

export interface OutlineHeading {
  id: string
  level: 1 | 2 | 3
  text: string
}

export interface OutlineNode {
  id: string
  title: string
  /** 0 لصفحة جذر */
  depth: number
  parent?: string
  icon?: string
  archived?: true
  /** الصفحة الهابطة */
  home?: true
  blocks: number
  words: number
  headings?: OutlineHeading[]
  /** معرفات الصفحات التي ترتبط بها هذه الصفحة، بدون تكرار */
  links?: string[]
}

export interface OutlineResult {
  title: string
  docId: string
  pages: number
  blocks: number
  words: number
  tree: OutlineNode[]
}

/** المساحة كلها في استدعاء واحد، بترتيب الشريط الجانبي. */
export function outlineDoc(doc: SpaceDoc): OutlineResult {
  const ix = buildIndex(doc)
  const tree: OutlineNode[] = []
  const emitted = new Set<string>()

  const node = (p: Page, depth: number): OutlineNode => {
    const headings: OutlineHeading[] = []
    const links: string[] = []
    let w = 0
    for (const b of p.blocks) {
      const text = textOf(b.html)
      w += words(text)
      if (b.type === 'h1' || b.type === 'h2' || b.type === 'h3') {
        headings.push({ id: b.id, level: Number(b.type.slice(1)) as 1 | 2 | 3, text })
      }
      if (b.type === 'pagelink' && typeof b.page === 'string' && !links.includes(b.page)) links.push(b.page)
      for (const m of (b.html ?? '').matchAll(/href\s*=\s*["']#p\/([^"']+)["']/g)) {
        if (!links.includes(m[1])) links.push(m[1])
      }
    }
    return {
      id: p.id, title: p.title, depth,
      ...(p.parent ? { parent: p.parent } : {}),
      ...(p.icon ? { icon: p.icon } : {}),
      ...(p.archived ? { archived: true as const } : {}),
      ...(doc.home === p.id ? { home: true as const } : {}),
      blocks: p.blocks.length,
      words: w,
      ...(headings.length ? { headings } : {}),
      ...(links.length ? { links } : {}),
    }
  }

  const walk = (parent: string, depth: number) => {
    for (const p of ix.children.get(parent) ?? []) {
      if (emitted.has(p.id)) continue // حلقة والد كانت ستكرر بلا نهاية
      emitted.add(p.id)
      tree.push(node(p, depth))
      walk(p.id, depth + 1)
    }
  }
  walk('', 0)
  // صفحة داخل شجرة نفسها ليست في أي مسير من الجذر — لكنها في الملف وما زالت
  // قابلة للربط، لذا يجب أن تظهر هنا. validate() يسمّي الحلقة.
  for (const p of doc.pages) if (!emitted.has(p.id)) tree.push(node(p, 0))

  return {
    title: doc.title,
    docId: doc.docId,
    pages: doc.pages.length,
    blocks: doc.pages.reduce((n, p) => n + p.blocks.length, 0),
    words: tree.reduce((n, t) => n + t.words, 0),
    tree,
  }
}

// ---------------------------------------------------------------------------
// stats()
// ---------------------------------------------------------------------------

export interface AssetStat {
  key: string
  bytes: number
  mime: string
  used: number
}

export interface StatsResult {
  pages: number
  archived: number
  blocks: number
  words: number
  characters: number
  blockTypes: Record<string, number>
  todos: { done: number; total: number }
  assets: { count: number; bytes: number; orphans: number; orphanBytes: number }
  /** UTF-8 بايتات مستند JSON. الصدفة الخارجية تضيف ~600KB ثابتاً. */
  bytes: { document: number; assets: number; text: number }
  /** أكبر عشرة أصول، الأكبر أولاً */
  biggest: AssetStat[]
}

/** أين الثقل — الاستدعاء الذي يجيب "لماذا هذا الملف 30MB". */
export function statsDoc(doc: SpaceDoc): StatsResult {
  const assets = doc.assets ?? {}
  const blockTypes: Record<string, number> = {}
  const use = new Map<string, number>()
  const todos = { done: 0, total: 0 }
  let blocks = 0
  let wordCount = 0
  let characters = 0
  let textBytes = 0

  for (const p of doc.pages) {
    for (const b of p.blocks) {
      blocks++
      blockTypes[b.type] = (blockTypes[b.type] ?? 0) + 1
      if (b.type === 'todo') {
        todos.total++
        if (b.done) todos.done++
      }
      const text = textOf(b.html)
      wordCount += words(text)
      characters += text.length
      textBytes += utf8len(b.html ?? '')
      for (const v of [b.src, (b as Record<string, unknown>).poster]) {
        if (typeof v === 'string' && v.startsWith('asset:')) {
          const k = v.slice(6)
          use.set(k, (use.get(k) ?? 0) + 1)
        }
      }
    }
  }
  for (const f of doc.fonts ?? []) use.set(f.asset, (use.get(f.asset) ?? 0) + 1)

  let assetBytes = 0
  const each: AssetStat[] = []
  for (const [key, value] of Object.entries(assets)) {
    const bytes = value.length // data: URI ASCII — الطول بايتات
    assetBytes += bytes
    each.push({ key, bytes, mime: /^data:([^;,]+)/.exec(value)?.[1] ?? 'unknown', used: use.get(key) ?? 0 })
  }
  each.sort((a, b) => b.bytes - a.bytes)
  const orphans = each.filter((a) => !a.used)

  return {
    pages: doc.pages.length,
    archived: doc.pages.filter((p) => p.archived).length,
    blocks,
    words: wordCount,
    characters,
    blockTypes,
    todos,
    assets: {
      count: each.length,
      bytes: assetBytes,
      orphans: orphans.length,
      orphanBytes: orphans.reduce((n, a) => n + a.bytes, 0),
    },
    bytes: { document: utf8len(JSON.stringify(doc)), assets: assetBytes, text: textBytes },
    biggest: each.slice(0, 10),
  }
}

// ---------------------------------------------------------------------------
// أفعال الكتابة (الكتابة)
// ---------------------------------------------------------------------------

export type Plan<T> = ({ ok: true; apply: () => void } & T) | PlanError

export interface PlanError {
  ok: false
  /** آلي: 'readonly' | 'no-such-block' | 'no-such-page' | 'bad-patch' |
   *  'immutable' | 'not-serializable' | 'cycle' | 'last-page' | 'no-such-field' */
  err: string
  detail?: string
}

const fail = (err: string, detail?: string): PlanError => ({ ok: false, err, ...(detail ? { detail } : {}) })

const isPatch = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v)

/** اقسم رقعة إلى كتابات وحذف؛ `null`/`undefined` يعني حذف. */
function splitPatch(patch: Record<string, unknown>): { sets: Record<string, unknown>; dels: string[] } | PlanError {
  const sets: Record<string, unknown> = {}
  const dels: string[] = []
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === undefined) {
      dels.push(k)
      continue
    }
    if (!jsonSafe(v)) {
      return fail('not-serializable', `"${k}" holds something JSON cannot carry (a function, a DOM node, a Date, a cycle). It would vanish or throw at save time.`)
    }
    sets[k] = v
  }
  return { sets, dels }
}

/**
 * الصيغة المقروءة لكتلة prop، معاد اشتقاقها من قيمتها. دائماً.
 *
 * ضمان التدهور — "بناء أقدم ومصغّر وgrep وتصدير markdown كلهم يرون
 * 'Status: In progress'" — كان تدّعيه setField ولا يُنفَّذ في أي مكان آخر.
 * قيس على هذا البناء: `updateBlock(id,{value:'doing'})` ترك `html:'Status: Todo'`
 * — الملف قال Todo بينما قيمته تقول doing. ضمان يحفظه كاتب واحد ويكسره ثلاثة
 * ليس ضماناً. لذا يُطبق حيث تُكتب الكتل: كل فعل يمر هنا.
 */
function syncProp(doc: SpaceDoc, b: Block): void {
  if (b.type !== 'prop') return
  const key = String((b as Record<string, unknown>).key ?? '')
  const f = key ? fieldByKey(doc, key) : undefined
  if (!f || typeof f.label !== 'string') return
  ;(b as Record<string, unknown>).html = propHtml(f, (b as Record<string, unknown>).value)
}

/** أدخل كتل في صفحة. المعرفات تُصك هنا لا من المتصل — فلا تصادم ممكن. */
export function planInsertBlocks(
  doc: SpaceDoc, pageId: string, afterId: string | null, blocks: unknown, registry?: BlockRegistry
): Plan<{ ids: string[]; page: string }> {
  if (!Array.isArray(blocks)) return fail('bad-patch', 'pass an array of blocks')
  const page = doc.pages.find((p) => p.id === pageId)
  if (!page) return fail('no-such-page', String(pageId))
  if (afterId != null && !page.blocks.some((b) => b.id === afterId)) {
    return fail('no-such-block', `"${afterId}" is not a block on page "${pageId}"`)
  }

  const remap = new Map<string, string>()
  const made: Block[] = []
  for (const raw of blocks) {
    if (raw != null && !jsonSafe(raw)) return fail('not-serializable', 'a block holds something JSON cannot carry')
    const src = isPatch(raw) ? raw : {}
    const type = typeof src.type === 'string' && src.type ? src.type : 'p'
    const b = { ...src, id: uid('b'), type } as Block
    if (typeof src.id === 'string' && src.id) remap.set(src.id, b.id)
    if (typeof b.html === 'string') b.html = normalizeHtml(b.html, type)
    syncProp(doc, b) // قيمة حقل بلا صيغته المقروءة لا شيء
    registry?.init?.(b)
    made.push(b)
  }
  for (const b of made) {
    if (typeof b.parent !== 'string') continue
    const within = remap.get(b.parent)
    if (within) b.parent = within
    else if (!page.blocks.some((x) => x.id === b.parent)) delete b.parent
  }

  return {
    ok: true, ids: made.map((b) => b.id), page: page.id,
    apply() {
      const at = afterId == null ? page.blocks.length : page.blocks.findIndex((b) => b.id === afterId) + 1
      page.blocks.splice(at, 0, ...made)
    },
  }
}

/** غيّر حقول كتلة واحدة. `null` يحذف حقلاً. */
export function planUpdateBlock(doc: SpaceDoc, id: string, patch: unknown, registry?: BlockRegistry): Plan<{ id: string; page: string }> {
  if (!isPatch(patch)) return fail('bad-patch', 'patch must be an object of block fields')
  const at = findBlock(doc, id)
  if (!at) return fail('no-such-block', id)
  if ('id' in patch) return fail('immutable', 'a block id never changes — links, backlinks and undo key on it')

  const { block, page } = at
  const type = 'type' in patch ? patch.type : block.type
  if (typeof type !== 'string' || !type) return fail('bad-patch', 'type must be a non-empty string')

  if ('parent' in patch && patch.parent != null) {
    const owner = String(patch.parent)
    if (owner === id) return fail('cycle', 'a block cannot be its own parent')
    if (!page.blocks.some((b) => b.id === owner)) return fail('no-such-block', `parent "${owner}" is not a block on page "${page.id}"`)
    if (descendants(page, id).has(owner)) return fail('cycle', `parent "${owner}" is nested inside "${id}"`)
  }

  const split = splitPatch(patch)
  if ('ok' in split) return split
  const { sets, dels } = split
  if (dels.includes('type')) return fail('bad-patch', 'type cannot be deleted; set it to another type instead')

  if (typeof sets.html === 'string') sets.html = normalizeHtml(sets.html, type)
  else if (sets.type && typeof block.html === 'string' && (sets.type === 'code') !== (block.type === 'code')) {
    sets.html = normalizeHtml(block.html, type)
  }

  return {
    ok: true, id, page: page.id,
    apply() {
      for (const k of dels) delete (block as Record<string, unknown>)[k]
      const retyped = typeof sets.type === 'string' && sets.type !== block.type
      Object.assign(block, sets)
      syncProp(doc, block) // القيمة والصيغة المقروءة تتحركان معاً، دائماً
      if (retyped) registry?.init?.(block)
    },
  }
}

/** أزل كتلاً وكل ما يتداخل تحتها. صفحة تفرغ تملأ بفقرة جديدة. */
export function planRemoveBlocks(doc: SpaceDoc, ids: unknown): Plan<{ removed: string[]; missing: string[]; added: string[] }> {
  if (!Array.isArray(ids)) return fail('bad-patch', 'pass an array of block ids')
  const perPage = new Map<Page, Set<string>>()
  const missing: string[] = []
  const removed: string[] = []

  for (const raw of ids) {
    const id = String(raw)
    const at = findBlock(doc, id)
    if (!at) {
      missing.push(id)
      continue
    }
    const set = perPage.get(at.page) ?? new Set<string>()
    perPage.set(at.page, set)
    for (const victim of [id, ...descendants(at.page, id)]) {
      if (!set.has(victim)) {
        set.add(victim)
        removed.push(victim)
      }
    }
  }

  const refills: Array<[Page, Block]> = []
  for (const [page, set] of perPage) {
    if (page.blocks.every((b) => set.has(b.id))) refills.push([page, newBlock('p')])
  }

  return {
    ok: true, removed, missing, added: refills.map(([, b]) => b.id),
    apply() {
      for (const [page, set] of perPage) page.blocks = page.blocks.filter((b) => !set.has(b.id))
      for (const [page, fresh] of refills) page.blocks.push(fresh)
    },
  }
}

export interface MoveTarget {
  /** الصفحة المنقول إليها؛ احذف للبقاء على الحالية */
  pageId?: string
  /** ضعه بعد هذه الكتلة */
  afterId?: string
  /** ضعه قبل هذه الكتلة (يتغلب على afterId) */
  beforeId?: string
  /** أعد تعشيشه تحت هذه الكتلة؛ null يلغي التعشيش */
  parent?: string | null
}

/** انقل كتلة بكل ما تحتها، ضمن الصفحة أو عبرها. */
export function planMoveBlock(doc: SpaceDoc, id: string, to: unknown): Plan<{ id: string; pageId: string; moved: string[] }> {
  if (to !== undefined && !isPatch(to)) return fail('bad-patch', 'pass { pageId?, afterId?, beforeId?, parent? }')
  const spec = (to ?? {}) as MoveTarget
  const at = findBlock(doc, id)
  if (!at) return fail('no-such-block', id)
  const from = at.page

  const dest = spec.pageId ? doc.pages.find((p) => p.id === spec.pageId) : from
  if (!dest) return fail('no-such-page', String(spec.pageId))

  const kin = descendants(from, id)
  const group = from.blocks.filter((b) => b.id === id || kin.has(b.id))
  const anchorId = spec.beforeId ?? spec.afterId
  if (anchorId != null) {
    if (kin.has(String(anchorId)) || String(anchorId) === id) return fail('cycle', 'a block cannot be moved inside its own subtree')
    if (!dest.blocks.some((b) => b.id === anchorId)) return fail('no-such-block', `"${anchorId}" is not a block on page "${dest.id}"`)
  }

  let parent: string | null | undefined = spec.parent
  if (parent != null) {
    const owner = String(parent)
    if (owner === id || kin.has(owner)) return fail('cycle', 'a block cannot be nested under itself')
    if (!dest.blocks.some((b) => b.id === owner)) return fail('no-such-block', `parent "${owner}" is not a block on page "${dest.id}"`)
  } else if (parent === undefined) {
    parent = at.block.parent && dest.blocks.some((b) => b.id === at.block.parent) ? at.block.parent : null
  }

  return {
    ok: true, id, pageId: dest.id, moved: group.map((b) => b.id),
    apply() {
      from.blocks = from.blocks.filter((b) => !group.includes(b))
      if (parent) at.block.parent = parent
      else delete at.block.parent
      const anchor = anchorId != null ? dest.blocks.findIndex((b) => b.id === anchorId) : -1
      const cut = anchor < 0 ? dest.blocks.length : spec.beforeId != null ? anchor : anchor + 1
      dest.blocks.splice(cut, 0, ...group)
    },
  }
}

/** غيّر حقول الصفحة نفسها. `blocks` مرفوض — البنية تمر عبر أفعال الكتل. */
export function planUpdatePage(doc: SpaceDoc, id: string, patch: unknown): Plan<{ id: string }> {
  if (!isPatch(patch)) return fail('bad-patch', 'patch must be an object of page fields')
  const page = doc.pages.find((p) => p.id === id)
  if (!page) return fail('no-such-page', id)
  if ('id' in patch) return fail('immutable', 'a page id never changes — every #p/ link and backlink keys on it')
  if ('blocks' in patch) return fail('immutable', 'use insertBlocks / updateBlock / removeBlocks / moveBlock for block structure')

  const split = splitPatch(patch)
  if ('ok' in split) return split
  const { sets, dels } = split

  if ('title' in sets) {
    if (badTitle(sets.title)) return fail('bad-title', 'title must be a string')
    sets.title = plainTitle(sets.title)
  }
  if ('parent' in sets) {
    const owner = String(sets.parent)
    if (owner === id) return fail('cycle', 'a page cannot contain itself')
    if (!doc.pages.some((p) => p.id === owner)) return fail('no-such-page', `parent "${owner}"`)
    // BOUNDED: حلقة قائمة في الملف (A.parent=B, B.parent=A) تنجو من parseDoc
    // وتصل من أي ملف منسوخ — وهذا المسير كان يدور للأبد. التسلسل المقيد هو
    // الموصى به — validate() يبلّغ page-cycle ثم يعيد الوكيل الإسكان فتُعلّق.
    const seen = new Set<string>()
    for (let up: string | undefined = owner; up && !seen.has(up); up = doc.pages.find((p) => p.id === up)?.parent) {
      seen.add(up)
      if (up === id) return fail('cycle', `"${owner}" is inside "${id}"`)
    }
    sets.parent = owner
  }
  if ('archived' in sets) {
    if (sets.archived) sets.archived = true
    else {
      delete sets.archived
      dels.push('archived')
    }
  }

  return {
    ok: true, id,
    apply() {
      for (const k of dels) delete (page as Record<string, unknown>)[k]
      Object.assign(page, sets)
    },
  }
}

export interface RemovePageOpts {
  /** احذف الصفحات المتداخلة تحتها أيضاً؛ الافتراضي يعيد إسكانها مستوىً لأعلى */
  descendants?: boolean
}

/** أزل صفحة. الأطفال يُعاد إسكانهم لوالد الصفحة المحذوفة افتراضياً. */
export function planRemovePage(doc: SpaceDoc, id: string, opts: RemovePageOpts = {}): Plan<{ removed: string[]; rehomed: number; links: number }> {
  const page = doc.pages.find((p) => p.id === id)
  if (!page) return fail('no-such-page', id)
  if (doc.pages.length <= 1) return fail('last-page', 'a space needs at least one page')

  const doomed = new Set<string>([id])
  if (opts.descendants) {
    let grew = true
    while (grew) {
      grew = false
      for (const p of doc.pages) {
        if (p.parent && doomed.has(p.parent) && !doomed.has(p.id)) {
          doomed.add(p.id)
          grew = true
        }
      }
    }
  }
  if (doomed.size >= doc.pages.length) return fail('last-page', 'that would remove every page in the space')

  const rehome = opts.descendants ? [] : doc.pages.filter((p) => p.parent === id)
  const ix = buildIndex(doc)
  let links = 0
  for (const gone of doomed) {
    for (const ref of ix.backlinks.get(gone) ?? []) if (!doomed.has(ref.pageId)) links++
  }

  return {
    ok: true, removed: [...doomed], rehomed: rehome.length, links,
    apply() {
      for (const p of rehome) {
        if (page.parent) p.parent = page.parent
        else delete p.parent
      }
      doc.pages = doc.pages.filter((p) => !doomed.has(p.id))
      if (doc.home && doomed.has(doc.home)) delete doc.home
    },
  }
}

// ---------------------------------------------------------------------------
// المتتبع: المخطط والقيم والتراكم
// ---------------------------------------------------------------------------

/** المخطط الفعلي، كبيانات — نسخة لا الكائن نفسه (حماية من التعديل الجانبي). */
export function fieldsReport(doc: SpaceDoc): FieldSpec[] {
  return JSON.parse(JSON.stringify(fieldsOf(doc))) as FieldSpec[]
}

export interface FieldWarning {
  code: 'unknown-option'
  key: string
  detail: string
  /** المعرفات التي هي خيارات فعلاً، كي يصحح المتصل نفسه */
  options: string[]
}

/**
 * هل هذه قيمة تعرفها خيارات الحقل؟
 *
 * تحذير متعمد لا رفض. الصيغة دائمة وتراكمية: حالة أعلنها بناء أحدث يجب أن
 * ترحل عبر هذه البناءة حرفياً، وفعل يرفضها يجعل بناءً أقدم عاجزاً عن تحرير
 * مستند كتبه أحدث. لكن وكيلاً كتب 'In progress' حيث معرّف الخيار 'doing'
 * أخطأ، والصمت يتركه يعتقد غير ذلك: القيمة ستُخزن واللوحة ستصنفها تحت "Other".
 */
function optionWarning(f: FieldSpec, value: unknown): FieldWarning | undefined {
  if (f.vt !== 'select' || value === '' || value === null || value === undefined) return undefined
  if (optionOf(f, value)) return undefined
  const options = (f.options ?? []).map((o) => o.id)
  return {
    code: 'unknown-option', key: f.key, options,
    detail: `"${String(value)}" is not one of ${f.key}'s options (${options.join(', ')}). It was written unchanged — the format keeps a value a newer build may have declared — but if you meant an existing option, use its id, not its label.`,
  }
}

/** رفض واحد مصاغ مرة واحدة: كل فعلَي الكتابة يرفضان الخطأ نفسه. */
const noSuchField = (k: string, schema: FieldSpec[]): PlanError =>
  fail('no-such-field', `"${k}" is not a field in this space. The schema is doc.fields, which declares: ${schema.map((x) => x.key).join(', ')}. Add the field there first — a value whose field nothing declares cannot be labelled, edited or grouped by.`)

export interface SetFieldResult {
  pageId: string
  key: string
  value: unknown
  /** الصيغة المقروءة المكتوبة معها — ما يعرضه بناء أقدم */
  html?: string
  /** كتل prop التي تحمل القيمة الآن (أو التي أُزيلت للتو) */
  blocks: string[]
  /** الصفحة لم تكن تحمل قيمة لهذا الحقل فأُضيفت إلى الترويسة */
  created: boolean
  /** القيمة مُسحت: كتل prop تلك ذهبت */
  removed: boolean
  warning?: FieldWarning
}

/** ضع حقلاً واحداً على صفحة واحدة — خطوة Undo الواحدة التي تكتب قيمة حقل. */
export function planSetField(doc: SpaceDoc, pageId: string, key: unknown, value: unknown): Plan<SetFieldResult> {
  const page = doc.pages.find((p) => p.id === pageId)
  if (!page) return fail('no-such-page', String(pageId))
  const k = String(key ?? '')
  const schema = fieldsOf(doc)
  const f = schema.find((x) => x.key === k)
  if (!f) return noSuchField(k, schema)
  if (value !== null && value !== undefined && !jsonSafe(value)) {
    return fail('not-serializable', `the value for "${k}" holds something JSON cannot carry (a function, a DOM node, a Date, a cycle). It would vanish or throw at save time.`)
  }

  const mine = page.blocks.filter((b) => b.type === 'prop' && (b as { key?: unknown }).key === k)

  if (value === null || value === undefined) {
    return {
      ok: true, pageId: page.id, key: k, value: null,
      blocks: mine.map((b) => b.id), created: false, removed: true,
      apply() {
        page.blocks = page.blocks.filter((b) => !mine.includes(b))
      },
    }
  }

  const html = propHtml(f, value)
  const fresh = mine.length ? null : propBlock(f, value, uid('b'))
  const warning = optionWarning(f, value)
  return {
    ok: true,
    pageId: page.id, key: k, value, html,
    blocks: fresh ? [fresh.id] : mine.map((b) => b.id),
    created: !!fresh, removed: false,
    ...(warning ? { warning } : {}),
    apply() {
      for (const b of mine) {
        ;(b as Record<string, unknown>).value = value
        b.html = html
      }
      // القيمة الجديدة تنضم لشريط الترويسة: كتل prop قبل أول كتلة غير prop
      // هي الترويسة (بالموضع) — إلحاقها آخر الصفحة كان سيترك حقلاً تحت النص.
      if (fresh) page.blocks.splice(headerLength(page), 0, fresh)
    },
  }
}

export interface IssueReport {
  id: string
  title: string
  /** href الذي كان سيستخدمه رابط inline: `#p/<id>` */
  url: string
  archived?: true
  /** مرحلة حالته (FieldOption.group) — ما يجعل "open" تعني شيئاً بلا فلترة. */
  group?: string
  /** كل قيم الحقل على الصفحة، حسب المفتاح */
  fields: Record<string, unknown>
}

export interface IssueQuery {
  /**
   * مساواة الحقل. `{ status: 'todo' }`، مصفوفة لأيٍّ من (`{ status: ['backlog', 'todo'] }`)،
   * `null` لـ"غير مضبوط" — تغطي غياب كتلة prop والكتلة الفارغة معاً.
   */
  where?: Record<string, unknown>
  /** مرحلة الحالة: 'unstarted' | 'started' | 'done' | 'cancelled' | 'unknown'، مصفوفة منها، أو 'open' */
  group?: string | string[]
  /** اشمل المؤرشفة أيضاً؛ مستبعدة افتراضياً */
  archived?: boolean
}

const FINISHED = new Set(['done', 'cancelled'])

/** تُقارن كنص، فـ `3` و `"3"` نفس التقدير — هذا المستند JSON مكتوب يدوياً. */
function matches(actual: unknown, want: unknown): boolean {
  if (Array.isArray(want)) return want.some((w) => matches(actual, w))
  if (want === null || want === undefined) return actual === undefined || actual === null || actual === ''
  return String(actual ?? '') === String(want)
}

/** التراكم كبيانات — استدعاء واحد بدل مسح صفحة بصفحة. */
export function issuesReport(doc: SpaceDoc, query: IssueQuery = {}): IssueReport[] {
  const status = fieldsOf(doc).find((f) => f.key === 'status')
  const want = query.group == null ? null
    : (Array.isArray(query.group) ? query.group : [query.group]).map(String)
  const out: IssueReport[] = []

  for (const page of doc.pages) {
    if (!isIssue(page)) continue
    if (page.archived && !query.archived) continue
    const values = valuesOf(page)
    const raw = values.get('status')
    const opt = status && optionOf(status, raw)
    // حالة غير مضبوطة ليست حالة مجهولة — لا تخبر الوكيل أن قيمة أتت من بناء
    // لا نفهمه حين لا قيمة أصلاً، وهما تريدان معالجة متعاكستين.
    const group = raw === undefined || raw === null || raw === ''
      ? undefined
      : opt
        ? opt.group
        : 'unknown'

    // OPEN MEANS NOT FINISHED — مسند واحد، فالحالة بلا مجموعة والحالة التي
    // لم تسمع بها هذه البناءة تعدان عملاً. هذا هو الاتجاه الآمن.
    if (want && !want.some((g) => (g === 'open' ? !(group && FINISHED.has(group)) : g === group))) continue

    let keep = true
    for (const [k, w] of Object.entries(query.where ?? {})) {
      if (!matches(values.get(k), w)) {
        keep = false
        break
      }
    }
    if (!keep) continue

    out.push({
      id: page.id, title: page.title, url: `#p/${page.id}`,
      ...(page.archived ? { archived: true as const } : {}),
      ...(group ? { group } : {}),
      fields: Object.fromEntries(values),
    })
  }
  return out
}

export interface NewIssueResult {
  id: string
  blocks: string[]
  warnings?: FieldWarning[]
}

/**
 * مسألة جديدة: صفحة واحدة، حقولها عليها، في خطوة Undo واحدة.
 *
 * `title` و `parent` للصفحة؛ كل مفتاح آخر مفتاح حقل، والغائب من المخطط
 * يُرفض لا يُوقف على الصفحة. الصفحة تنتهي بفقرة فارغة، كما يفعل ⌘⇧I: صفحة
 * كل كتلتها prop لا مكان لمؤشر ولا سطر لكتابة المسألة.
 */
export function planNewIssue(doc: SpaceDoc, spec: unknown): Plan<NewIssueResult> {
  if (spec !== undefined && !isPatch(spec)) return fail('bad-patch', 'pass { title?, parent?, ...fieldValues }')
  const src = (spec ?? {}) as Record<string, unknown>
  if (badTitle(src.title)) return fail('bad-title', 'title must be a string')
  const parent = src.parent == null ? '' : String(src.parent)
  if (parent && !doc.pages.some((p) => p.id === parent)) return fail('no-such-page', `parent "${parent}"`)

  const schema = fieldsOf(doc)
  const values: Record<string, unknown> = {}
  const warnings: FieldWarning[] = []
  for (const [k, v] of Object.entries(src)) {
    if (k === 'title' || k === 'parent') continue
    const f = schema.find((x) => x.key === k)
    if (!f) return noSuchField(k, schema)
    if (v !== null && v !== undefined && !jsonSafe(v)) return fail('not-serializable', `the value for "${k}" holds something JSON cannot carry`)
    values[k] = v ?? ''
    const w = optionWarning(f, values[k])
    if (w) warnings.push(w)
  }

  const page = newPage(plainTitle(src.title) || 'New issue', parent ? { parent } : {})
  // قائمة البذر من fields.ts أبداً، لا نسخة ثانية: مسألة جديدة من وكيل ومن
  // ⌘⇧I يجب أن تحملا الحقول نفسها، أو يصنع أحدهما مسألة لا يستطيع إنسان
  // تعيينها — لا إيماءة "أضف حقلاً" لأن `prop` غير مُدرج في قائمة / عمداً.
  const seed = schema.filter((f) => ISSUE_FIELDS.includes(f.key) || f.key in values)

  // مسألة جديدة يجب أن تكون مسألة — فضائٌ يعلن مخططه دون status لم يبذر
  // شيئاً معروفاً: الفعل كان سيرد ok وصفحته غير مرئية لكل لوحة. الإبلاغ
  // بنجاح لصفحة ليست مسألة أسوأ من رفض صنعها.
  if (!seed.some((f) => f.key === 'status')) {
    return fail('no-status-field',
      'this space declares no `status` field, and a page is an issue because it has one — '
      + 'add a status field to doc.fields (see bento.fields()) before creating issues')
  }

  const props = seed
    .map((f) => propBlock(f, f.key in values ? values[f.key] : (f.def ?? ''), uid('b')))
  page.blocks = [...props, newBlock('p')]

  return {
    ok: true, id: page.id, blocks: page.blocks.map((b) => b.id),
    ...(warnings.length ? { warnings } : {}),
    apply() {
      doc.pages.push(page)
    },
  }
}

export type { FieldOption }
