/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: Markdown → نموذج كتل bento/spaces — كيف يصبح كومة ملاحظات
 *           موجودة مساحة. لا أحد يتبنى تطبيق ملاحظات لا يستطيع إدخال ملاحظاته
 *           إليه (دخول خزائن Obsidian: wikilinks، frontmatter، قوائم متداخلة،
 *           شجرة مجلدات).
 * 🏛️ الدور: نواة معزولة (Zero-Dependency Converter) في converters/.
 * 📥 المستهلك: UniversalFormatConverterModal, ميزة استيراد Obsidian, scripts/test
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    PURE + DOM-FREE Parsing with Placeholder Escaping:
 *    كامل المعالجة خالصة بلا DOM فتُختبر في node. كل ما يُولد كـ MARKUP يُوقف
 *    أولاً في مكان (placeholder `\u0000<n>\u0000` — أرقام تنجو من الهروب دون
 *    مساس) ثم يُهرَّب النص المتبقي كله دفعة واحدة: نصٌ كتبه المؤلف لا يمكن أن
 *    يصير وسماً، ووسم ولدناه لا يُهرَّب مرتين. ولا sanitize داخل المستورد —
 *    يُطبق لاحقاً عبر sanitizeInline (بوابة أمن واحدة في مكان اختباراتها).
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. `#w/` لا يصل مستنداً محفوظاً أبداً: resolveWikilinks يعيد كتابة كل
 *       واحد قبل الالتزام، وقائمة سماح المُطهّر (#p/، https:، mailto:)
 *       ستجرد أي ناجٍ — أسوأ ما يفعله خطأ في الحل هو فقدان رابط لا توجيهه
 *       لمكان غير متوقع.
 *    2. رابط بلا href (نسبي أو obsidian: أو file:) يُترك نص markdown كما
 *       كتبه المؤلف — نص ما زال يقول أين كان يتجه أفضل من رابط فقد وجهته
 *       بصمت. وعنوان عرضي داخل placeholder لا يُهرَّب مرتين (كان Q&A يصبح
 *       Q&amp;amp;A).
 *    3. لا صفحة تصل بصفّار كتل: مجلد بلا ملاحظة مجلد وملف .md فارغ والجذر
 *       المخترع — صفحة بلا كتل بلا مضيف قابل للتحرير وبلا قائمة / إلى الأبد.
 *    4. ملاحظة مجلد (Notes/Notes.md أو index.md) هي صفحة المجلد لا طفله؛
 *       وإلا سُتُستورد كأخ غير شقيق لشجرتها نفسها.
 *    5. سطر فاصل `---` لا يُرقّى أبداً لعنوان setext — في مجلد ملاحظات
 *       الخط المفرد فاصل أكثر كثيراً من أن يكون عنواناً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - frontmatter يُحفظ حرفياً في كتلة code مطوية داخل toggle (لا شيء يُفسَّر
 *      ولا شيء يضيع) مع وسم `frontmatter: true` كمسار ترقية ميكانيكي مستقبلاً.
 *    - أول كاتب يربح في فهرس الروابط (first-writer-wins) فلا تعتمد النتيجة
 *      على ترتيب منتقي الملفات، والتقاطعات تُعدّ وتُبلَّغ.
 *    - NUL في الإدخال يُسقط بدايةً (محايد للـ placeholder).
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/spaces/markdown.ts (The Bento authors, MIT).
 */

import type { Block, Page } from '../document-pipeline/block-document-model'
import { uid } from '../document-pipeline/block-document-model'
import { esc } from '../document-pipeline/plan-apply-agent-engine'

/** المسافة البادئة تساوي أربعة أعمدة — ثابتة كي يتسق التعشيش. */
const TAB = '    '

/** وسوم inline قد يحتفظ بها امتداد html خام — قائمة السماح ناقصة القدرة على
 *  حمل الخصائص. أعيدت صياغتها لا استيراداً لأن مجموعة تلك الوحدة تحكم DOM
 *  وهذه راحة محلِّل؛ إن تباعدتا فالمُطهّر يربح، لأنه يعمل أخيراً. */
const INLINE_OK = new Set(['b', 'i', 'u', 's', 'em', 'strong', 'code', 'br', 'span', 'mark', 'sub', 'sup'])

/** href يحمله رابط wikilink بين التحليل والحل. `#w/` لا يصل مستنداً أبداً. */
const WIKI_SCHEME = '#w/'

// ---- inline ----------------------------------------------------------------

/** وسم html خام واحد، مُختزلاً لما يسمح به النموذج، أو null لإسقاطه. */
function cleanRawTag(tag: string): string | null {
  const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)\/?>$/.exec(tag)
  if (!m) return null
  const close = m[1] === '/'
  const name = m[2].toLowerCase()
  if (name === 'a') {
    if (close) return '</a>'
    const h = /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[3])
    const url = (h?.[1] ?? h?.[2] ?? h?.[3] ?? '').trim()
    return /^(https?:|mailto:)/i.test(url) ? `<a href="${esc(url)}">` : null
  }
  if (!INLINE_OK.has(name)) return null
  return close ? `</${name}>` : `<${name}>`
}

/**
 * Markdown inline → html inline.
 *
 * كل ما يُصدر كـ MARKUP يُوقف في placeholder أولاً، فتمر أخيرة الهروب على
 * السلسلة المتبقية كاملة دفعة واحدة: نص المؤلف لا يصير وسماً أبداً، ووسم
 * ولدناه لا يُهرَّب مرتين. `\u0000<n>\u0000` — أرقام تنجو من الهروب، ونصوص
 * NUL في الإدخال تُسقط بدايةً.
 */
export function inlineHtml(src: string): string {
  const held: string[] = []
  const hold = (html: string): string => `\u0000${held.push(html) - 1}\u0000`
  let s = src.replace(/\u0000/g, '')

  // امتدادات code أولاً: محتواها حرفي، فلا شيء أدناه قد يراه
  s = s.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (_m, _t, code: string) =>
    hold(`<code>${esc(code.replace(/^ (.*) $/, '$1'))}</code>`))

  // هروب الشرطة المائلة — محفوظ كنص كي لا يعيد المحايد الإطلاق أدناه
  s = s.replace(/\\([\\`*_{}[\]()#+\-.!~>|=])/g, (_m, ch: string) => hold(esc(ch)))

  // <https://…> قبل جولة الوسوم الخام التي كانت ستلتهمه
  // نص العرض لا يُهرَّب هنا: كل ما يحميه placeholder ترميز نهائي يحمل هروبه
  // بنفسه؛ كل ما خارجه نص عادي يهرّبه esc(s) الوحيد نهاية الدالة مرة واحدة
  s = s.replace(/<((?:https?|mailto):[^>\s]+)>/gi, (_m, url: string) =>
    hold(`<a href="${esc(url)}">`) + url + hold('</a>'))

  // html خام. `</a>` يُحتفظ به فقط حين حُفظ `<a>`: إسقاط رابط رفضنا hrefه
  // (javascript:, obsidian:) يجب ألا يترك وسم إغلاقه ليتعثر به المُطهّر.
  let openA = 0
  s = s.replace(/<\/?[a-zA-Z][^<>]*>/g, (tag) => {
    const ok = cleanRawTag(tag)
    if (!ok) return ''
    if (ok === '</a>' && openA === 0) return ''
    if (ok.startsWith('<a ')) openA++
    else if (ok === '</a>') openA--
    return hold(ok)
  })

  // ![[embed]] و [[wikilink|alias]] قبل الروابط العادية: تضمين ملاحظة مجرد
  // رابط لها، لأن النموذج لا transclusion فيه
  s = s.replace(/!?\[\[([^\]]+)\]\]/g, (_m, inner: string) => {
    const [target, alias] = splitOnce(inner, '|')
    return hold(`<a href="${WIKI_SCHEME}${encodeURIComponent(target.trim())}">`) +
      (alias ?? target).trim() + hold('</a>')
  })

  // صورة inline لا يمكن أن تكون كتلة، والنموذج بلا <img> inline: أبقِ نص
  // alt، وأبقِ العنوان كرابط حين يوجد ما يتبعه
  s = s.replace(/!\[([^\]]*)\]\(\s*<?([^\s)>]*)>?(?:\s+"[^"]*")?\s*\)/g,
    (_m, alt: string, url: string) => /^(https?:|data:)/i.test(url)
      ? hold(`<a href="${esc(url)}">`) + (alt || url) + hold('</a>')
      : (alt || url))

  // رابط عنوانه لا يحمله النموذج (نسبي، obsidian:، file:) يُترك markdown كما
  // كتبه المؤلف — العنوان والنص معاً. المُطهّر كان سيجرد hrefه أصلاً.
  s = s.replace(/\[([^\]]*)\]\(\s*<?([^\s)>]*)>?(?:\s+"[^"]*")?\s*\)/g,
    (m: string, text: string, url: string) =>
      /^(https?:|mailto:)/i.test(url)
        ? hold(`<a href="${esc(url)}">`) + text + hold('</a>')
        : m)

  s = s.replace(/~~([\s\S]+?)~~/g, (_m, x: string) => hold('<s>') + x + hold('</s>'))
  s = s.replace(/==([\s\S]+?)==/g, (_m, x: string) => hold('<mark>') + x + hold('</mark>'))
  s = s.replace(/\*\*(?=\S)([\s\S]+?)\*\*/g, (_m, x: string) => hold('<strong>') + x + hold('</strong>'))
  s = s.replace(/(^|[^\w\\])__(?=\S)([\s\S]+?)__(?!\w)/g,
    (_m, pre: string, x: string) => pre + hold('<strong>') + x + hold('</strong>'))
  s = s.replace(/(^|[^*\w])\*(?=\S)([^*]+?)\*/g,
    (_m, pre: string, x: string) => pre + hold('<em>') + x + hold('</em>'))
  // `_` فقط خارج الكلمة، أو تتحول معرّفات snake_case إلى مائل
  s = s.replace(/(^|[^\w\\])_(?=\S)([^_]+?)_(?!\w)/g,
    (_m, pre: string, x: string) => pre + hold('<em>') + x + hold('</em>'))

  return esc(s).replace(/\u0000(\d+)\u0000/g, (_m, n: string) => held[Number(n)])
}

/** Markdown inline → نص عادي، للعناوين (عنوان الصفحة نص لا html). */
export function plainText(src: string): string {
  return src
    .replace(/!?\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_m, t: string, a: string) => a ?? t)
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`]+/g, '')
    .replace(/^#+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const splitOnce = (s: string, sep: string): [string, string | undefined] => {
  const i = s.indexOf(sep)
  return i < 0 ? [s, undefined] : [s.slice(0, i), s.slice(i + sep.length)]
}

// ---- ملاحظة واحدة -----------------------------------------------------------

export interface PendingImage {
  /** كتلة الصورة، بالمرجع — يعيدها المستورد كتابتها في مكانها */
  block: Block
  /** العنوان كما كتبته الملاحظة تماماً */
  ref: string
  /** مجلد الملاحظة، لحل عنوان نسبي */
  dir: string
}

export interface ParsedNote {
  title: string
  blocks: Block[]
  /** YAML بين سوري `---` الافتتاحيين، حرفياً */
  frontmatter?: string
  images: PendingImage[]
  /** صور تشير للويب: محفوظة، لا تُحمّل حتى يطلبها قارئ */
  remoteImages: number
  /** جداول markdown، التي لا كتلة لها في هذا النموذج بعد */
  tables: number
}

const mk = (type: string, extra: Partial<Block> = {}): Block => ({ id: uid('b'), type, ...extra })

const IMG_LINE = /^!\[([^\]]*)\]\(\s*<?([^\s)>]*)>?(?:\s+"([^"]*)")?\s*\)$/
const IMG_EMBED = /^!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]$/
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)$/i

/** سطر لا شيء فيه إلا صورة. `![[x]]` يُعد فقط حين يسمي ملف صورة — وإلا فهو
 *  تضمين ملاحظة أخرى، أي رابط. */
function imageOf(line: string): { ref: string; alt: string; caption?: string } | null {
  const m = IMG_LINE.exec(line.trim())
  if (m) return { ref: m[2], alt: m[1], ...(m[3] ? { caption: m[3] } : {}) }
  const e = IMG_EMBED.exec(line.trim())
  if (e && IMAGE_EXT.test(e[1].trim())) return { ref: e[1].trim(), alt: '' }
  return null
}

/**
 * ملف markdown واحد → كتل صفحة واحدة.
 *
 * قاعدة العنوان، التي يجب أن تكون متوقعة قبل كل شيء: `# Heading` افتتاحية
 * تصبح عنوان الصفحة وتُزال من الجسد؛ وإلا اسم الملف بلا امتداده هو العنوان.
 * لا يُستشار frontmatter فيه — wikilinks تحل بملف الاسم، فعنوان من مفتاح
 * `title:` يخالف اسم الملف كان سيترك `[[Note]]` يشير لصفحة اسمها ليس في
 * الشريط الجانبي.
 */
export function parseNote(text: string, fileTitle: string): ParsedNote {
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []
  const images: PendingImage[] = []
  let remoteImages = 0
  let tables = 0
  let frontmatter: string | undefined
  let i = 0

  if (lines[0]?.trim() === '---') {
    for (let j = 1; j < lines.length; j++) {
      if (/^(---|\.\.\.)\s*$/.test(lines[j])) {
        frontmatter = lines.slice(1, j).join('\n')
        i = j + 1
        break
      }
    }
  }

  let title = ''
  {
    let j = i
    while (j < lines.length && !lines[j].trim()) j++
    const m = /^ {0,3}#\s+(.+?)\s*#*$/.exec(lines[j] ?? '')
    if (m) {
      title = plainText(m[1])
      i = j + 1
    }
  }

  /** مستويات القوائم المفتوحة، الأعمق أخيراً */
  const stack: Array<{ indent: number; id: string }> = []
  /** الفقرة التي يكملها سطر ناعم، والاقتباس الذي يكمل `>` */
  let para: Block | null = null
  let quote: Block | null = null

  const ownerFor = (indent: number): string | undefined => {
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop()
    return stack[stack.length - 1]?.id || undefined
  }
  const add = (b: Block, parent?: string): Block => {
    if (parent) b.parent = parent
    blocks.push(b)
    return b
  }
  const imageBlock = (ref: string, alt: string, caption: string | undefined, parent?: string) => {
    const b = mk('image', { src: ref, ...(alt ? { alt } : {}), ...(caption ? { caption } : {}) })
    add(b, parent)
    if (/^(https?:)?\/\//i.test(ref)) remoteImages++
    else if (!/^data:/i.test(ref)) images.push({ block: b, ref, dir: '' })
    return b
  }

  for (; i < lines.length; i++) {
    const line = lines[i].replace(/\t/g, TAB)
    const indent = /^ */.exec(line)![0].length
    const body = line.slice(indent).trimEnd()

    if (!body) {
      para = null
      quote = null
      continue
    }

    // code مسوَّر — يؤخذ كاملاً، فلا شيء داخله يُفسَّر
    const fence = /^(`{3,}|~{3,})\s*(\S*)/.exec(body)
    if (fence) {
      para = null
      quote = null
      const owner = ownerFor(indent)
      const mark = fence[1][0]
      const buf: string[] = []
      let j = i + 1
      for (; j < lines.length; j++) {
        const t = lines[j].trim()
        if (t.length >= 3 && t[0] === mark && t === mark.repeat(t.length)) break
        buf.push(lines[j].startsWith(' '.repeat(indent)) ? lines[j].slice(indent) : lines[j])
      }
      i = j
      add(mk('code', { html: esc(buf.join('\n')), ...(fence[2] ? { lang: fence[2].toLowerCase() } : {}) }), owner)
      continue
    }

    // الجدول بلا نوع كتلة في هذا النموذج بعد، وتحويله لفقرات يمزقه. يُحفظ
    // حرفياً في كتلة code بدل ذلك: مصفوفاً وقابلاً للبحث والتصدير والترقية
    // ميكانيكياً يوم تشحن كتلة الجدول. فقدان البيانات لتجميلها ليس مقايضة.
    if (body.includes('|') && isTableRule(lines[i + 1])) {
      para = null
      quote = null
      const owner = ownerFor(indent)
      const buf = [body]
      let j = i + 1
      for (; j < lines.length && lines[j].includes('|'); j++) buf.push(lines[j].trim())
      i = j - 1
      tables++
      add(mk('code', { html: esc(buf.join('\n')) }), owner)
      continue
    }

    // setext: `===` تحت فقرة يرقّيها. `---` لا يرقّى عمداً — في مجلد ملاحظات
    // الخط المفرد فاصل أكثر كثيراً من عنوان.
    if (para && /^=+$/.test(body)) {
      para.type = 'h1'
      para = null
      continue
    }

    if (/^([-*_])\s*(?:\1\s*){2,}$/.test(body)) {
      para = null
      quote = null
      add(mk('divider'), ownerFor(indent))
      continue
    }

    const head = /^(#{1,6})\s+(.*?)\s*#*$/.exec(body)
    if (head) {
      para = null
      quote = null
      // h4–h6 تهبط على h3: النموذج بثلاثة مستويات عناوين، وإسقاط عميق لعنوان
      // لفقرة كان سيخسر المخطط الكلي
      add(mk(`h${Math.min(head[1].length, 3)}`, { html: inlineHtml(head[2]) }), ownerFor(indent))
      continue
    }

    const q = /^>\s?(.*)$/.exec(body)
    if (q) {
      para = null
      const text = inlineHtml(q[1].replace(/^[>\s]+/, ''))
      if (quote) quote.html = `${quote.html}<br>${text}`
      else quote = add(mk('quote', { html: text }), ownerFor(indent))
      continue
    }
    quote = null

    const item = /^([-*+]|\d{1,9}[.)])(?:\s+(.*)|\s*)$/.exec(body)
    if (item) {
      para = null
      const owner = ownerFor(indent)
      const text = item[2] ?? ''
      const todo = /^\[([ xX])\]\s*(.*)$/.exec(text)
      const pic = imageOf(text)
      const block = todo
        ? add(mk('todo', { html: inlineHtml(todo[2]), done: todo[1] !== ' ' }), owner)
        : pic
          ? imageBlock(pic.ref, pic.alt, pic.caption, owner)
          : add(mk(/^\d/.test(item[1]) ? 'number' : 'bullet', { html: inlineHtml(text) }), owner)
      // الصورة ليست حاوية ولا تحمل نصاً، فلا هي هدف استمرار ولا والدة.
      // كانت الاثنتين: سطر استمرار كان سيعمل `${para.html}<br>${text}` ضد
      // كتلة بلا html، كاتباً السلسلة الحرفية "undefined" في المستند. دفع
      // OWNER الصورة (لا الصورة) يبقي التسمية التوضيحية أخاً شقيقاً للصورة
      // تحت نفس عنصر القائمة.
      stack.push({ indent, id: pic ? (owner ?? '') : block.id })
      para = pic ? null : block
      continue
    }

    const pic = imageOf(body)
    if (pic) {
      para = null
      imageBlock(pic.ref, pic.alt, pic.caption, ownerFor(indent))
      continue
    }

    // سطر عادي: استمرار للكتلة أعلاه، أو فقرة جديدة.
    // فاصل السطر الناعم يصبح <br> لا مسافة — الملاحظات مكتوبة بفواصل
    // المؤلف (عناوين، شعر، حقائق سطرية) ودمجها في فقرة غير عكسي.
    const text = inlineHtml(body)
    if (para) para.html = `${para.html}<br>${text}`
    else para = add(mk('p', { html: text }), ownerFor(indent))
  }

  return {
    title: title || fileTitle,
    blocks,
    ...(frontmatter !== undefined ? { frontmatter } : {}),
    images,
    remoteImages,
    tables,
  }
}

/** `|---|:--:|` — الصف الذي يجعل السطر فوقه رأس جدول. */
function isTableRule(line: string | undefined): boolean {
  if (!line) return false
  const t = line.trim()
  return t.includes('-') && t.includes('|') && /^\|?[\s:|-]+$/.test(t)
}

// ---- مجلد ملاحظات -----------------------------------------------------------

export interface SourceFile {
  /** مسار نسبي لجذر الاستيراد، بفواصل `/` (webkitRelativePath) */
  path: string
  text: string
}

export interface ImportStats {
  files: number
  pages: number
  blocks: number
  /** `[[wikilinks]]` التي وجدت صفحة في هذا الاستيراد */
  linked: number
  /** …وتلك التي سمّت ملاحظة ليست في التحديد */
  dangling: number
  frontmatter: number
  /** ملاحظات تقاسمت اسماً مع سابقة، فحُلّت روابطها للأولى */
  duplicateNames: number
  tables: number
  remoteImages: number
}

export interface ImportPlan {
  pages: Page[]
  /** مراجع صور محلية، ما زالت تنتظر الحل ضد الملفات المختارة */
  images: PendingImage[]
  stats: ImportStats
}

const normalizePath = (p: string): string =>
  p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/+/g, '/').trim()

const dirOf = (p: string): string => p.slice(0, Math.max(0, p.lastIndexOf('/')))
const fileOf = (p: string): string => p.slice(p.lastIndexOf('/') + 1)
const stemOf = (p: string): string => fileOf(p).replace(/\.[^.]+$/, '')
const lastSeg = (p: string): string => p.slice(p.lastIndexOf('/') + 1)

/**
 * ملاحظات كثيرة → صفحات مساحة، مع إعادة بناء شجرة المجلدات.
 *
 * خالصة: لا ملفات تُقرأ هنا ولا معرفات تغادر هذا المستند، فكامل الخطة
 * قابلة للافتراض في node. المتصل يفعل الشيئين اللذين يحتاجان متصفحاً —
 * قراءة بايتات الصور وتشغيل المُطهّر — ثم يلتزم الصفحات في خطوة واحدة.
 */
export function planImport(
  files: SourceFile[],
  opts: {
    rootTitle: string
    /**
     * صفحات المساحة الموجودة، بالعنوان — تُستشار بعد أن يخطئ فهرس الاستيراد.
     *
     * الترتيب مهم وهو هكذا عمداً: خزنة مستوردة كاملة يجب أن ترتبط بنفسها،
     * لا بصفحة غريبة تشترك معها بالعنوان. لكن من يضيف ملاحظة لمساحة يحتفظ
     * بها منذ سنة يتوقع أن تعني `[[Home]]` بيته، وبدونها كانت ستصل نصاً ميتاً.
     */
    resolveExisting?: (target: string) => string | undefined
  }
): ImportPlan {
  const src = files
    .map((f) => ({ path: normalizePath(f.path), text: f.text }))
    .filter((f) => f.path)
    .sort((a, b) => a.path.localeCompare(b.path))

  // مجلد مختار له مقطع أول مشترك، وذاك المجلد هو جذر الشجرة — فقط اختيار
  // مسطح ومختلط يحتاج صفحة حاوية مخترعة. على أي حال يهبط الاستيراد تحت جذر
  // جديد واحد بالضبط: قابل للتراجع بخطوة واحدة وللحذف بإيماءة واحدة.
  const tops = new Set(src.map((f) => (f.path.includes('/') ? f.path.split('/')[0] : '')))
  const wrap = src.length > 1 && !(tops.size === 1 && !tops.has(''))

  const pages: Page[] = []
  const images: PendingImage[] = []
  const stats: ImportStats = {
    files: src.length, pages: 0, blocks: 0, linked: 0, dangling: 0,
    frontmatter: 0, tables: 0, remoteImages: 0, duplicateNames: 0,
  }

  let rootId: string | undefined
  if (wrap) {
    const root: Page = { id: uid('p'), title: opts.rootTitle, icon: 'folder', blocks: [] }
    pages.push(root)
    rootId = root.id
  }

  // ملاحظة مجلد — `Notes/Notes.md` أو `Notes/index.md` — هي صفحة المجلد لا
  // طفل من واجهة فارغة. تلك العادة هي ما تستخدمه خزائن Obsidian و Foam
  // لعرض قسم، واستيرادها كأخ شقيق لشجرتها نفسها يقرأ كخطأ.
  const folderNote = new Map<string, string>()
  for (const f of src) {
    const dir = dirOf(f.path)
    if (!dir) continue
    const stem = stemOf(f.path).toLowerCase()
    if (stem === 'index' || stem === lastSeg(dir).toLowerCase()) {
      if (!folderNote.has(dir)) folderNote.set(dir, f.path)
    }
  }

  // ملاحظة مجلد ترتد لاسم المجلد لا اسم الملف: قيس على خزنة حقيقية —
  // `Meetings/index.md` كان سيُعنون القسم كله "index" لولا هذا.
  const parsed = new Map<string, ParsedNote>()
  for (const f of src) {
    const dir = dirOf(f.path)
    const fallback = folderNote.get(dir) === f.path ? lastSeg(dir) : stemOf(f.path)
    parsed.set(f.path, parseNote(f.text, fallback))
  }

  // المجلدات أولاً، الوالد قبل الطفل، فـ `parent` يُحل دائماً
  const dirs = new Set<string>()
  for (const f of src) {
    for (let d = dirOf(f.path); d; d = dirOf(d)) dirs.add(d)
  }
  const dirPage = new Map<string, Page>()
  for (const dir of [...dirs].sort()) {
    const note = folderNote.get(dir)
    const page: Page = note
      ? { id: uid('p'), title: parsed.get(note)!.title, icon: 'folder', blocks: [] }
      : { id: uid('p'), title: lastSeg(dir), icon: 'folder', blocks: [] }
    const parent = dirPage.get(dirOf(dir))?.id ?? rootId
    if (parent) page.parent = parent
    dirPage.set(dir, page)
    pages.push(page)
  }

  const filePage = new Map<string, Page>()
  for (const f of src) {
    const dir = dirOf(f.path)
    if (folderNote.get(dir) === f.path) {
      filePage.set(f.path, dirPage.get(dir)!)
      continue
    }
    const page: Page = { id: uid('p'), title: parsed.get(f.path)!.title, blocks: [] }
    const parent = dirPage.get(dir)?.id ?? rootId
    if (parent) page.parent = parent
    filePage.set(f.path, page)
    pages.push(page)
  }

  // ---- املأ الصفحات --------------------------------------------------------
  for (const f of src) {
    const note = parsed.get(f.path)!
    const page = filePage.get(f.path)!
    const dir = dirOf(f.path)

    if (note.frontmatter !== undefined) {
      stats.frontmatter++
      page.blocks.push(...frontmatterBlocks(note.frontmatter))
    }
    page.blocks.push(...note.blocks)
    for (const img of note.images) images.push({ ...img, dir })
    stats.tables += note.tables
    stats.remoteImages += note.remoteImages
  }

  // ---- wikilinks، بعد أن توجد كل صفحة --------------------------------------
  const { index, collisions } = linkIndex(src, parsed, filePage, tops.size === 1 ? [...tops][0] : '')
  for (const page of pages) {
    for (const b of page.blocks) {
      if (!b.html) continue
      const r = resolveWikilinks(b.html, (target) =>
        index.get(linkKey(target)) ?? opts.resolveExisting?.(linkKey(target)))
      b.html = r.html
      stats.linked += r.linked
      stats.dangling += r.dangling
    }
  }

  // لا صفحة تصل بصفّار كتل — مجلد بلا ملاحظة مجلد وملف .md فارغ والجذر
  // المخترع. صفحة بلا كتل بلا مضيف قابل للتحرير وبلا قائمة / إلى الأبد:
  // لا شيء يضيف كتلة لصفحة مجلد أبداً.
  for (const p of pages) if (!p.blocks.length) p.blocks.push(mk('p', { html: '' }))

  for (const p of pages) stats.blocks += p.blocks.length
  stats.duplicateNames = collisions
  stats.pages = pages.length
  return { pages, images, stats }
}

/**
 * أين يذهب frontmatter، وهذا قرار دائم لأنه في كل ملف يكتبه استيراد:
 * حرفياً، في كتلة code موسومة `frontmatter: true`، مطوية داخل toggle كي
 * لا يصرخ من قمة كل صفحة.
 *
 * لا يُحلل إلى حقول. لا نموذج خصائص عند المساحات بعد، ونموذج مصمم هنا —
 * في مستورد، من مفاتيح خزنة شخص واحد — كان سيسبق التصميم الحقيقي ويستحيل
 * تغييره لأن الشكل سيكون في ملفات على أقراص. لا شيء يُفسَّر ولا شيء يضيع:
 * yaml ما زالت نص المؤلف تماماً، قابلة للبحث، تطبع، وتُصدر خلفاً ككتلة
 * fenced yaml، و`frontmatter: true` هو الوسم الذي يجعل تبنّي هذه في خصائص
 * حقيقية مسحاً ميكانيكياً يوم تشحن.
 */
function frontmatterBlocks(yaml: string): Block[] {
  const fold = mk('toggle', { html: 'Frontmatter', open: false })
  const body = mk('code', { html: esc(yaml), lang: 'yaml', frontmatter: true, parent: fold.id })
  return [fold, body]
}

/** كل ما قد يسمّيه `[[wikilink]]`، بحروف صغيرة. أول كاتب يربح، فلا تعتمد
 *  النتيجة على ترتيب منحه منتقي الملفات إيانا. */
function linkIndex(
  src: SourceFile[],
  parsed: Map<string, ParsedNote>,
  filePage: Map<string, Page>,
  root: string
): { index: Map<string, string>; collisions: number } {
  const index = new Map<string, string>()
  // ملاحظتان يمكن أن تتقاسماه اسماً في مجلدين مختلفين، و[[wikilink]] يسمي
  // الاسم وحده. الأول يربح — السلوك القياسي والشيء الوحيد الذي يمكن لاسم
  // عار أن يعنيه — لكن يجب أن يُبلَّغ: بصمت، كل رابط للملاحظة الثانية كان
  // سيشير للأولى. تُعد هنا وتُسطح في الملخص.
  const collisions = new Set<string>()
  const put = (k: string, id: string) => {
    const key = linkKey(k)
    if (key && index.has(key) && index.get(key) !== id) collisions.add(key)
    if (key && !index.has(key)) index.set(key, id)
  }
  for (const f of src) {
    const id = filePage.get(f.path)!.id
    put(stemOf(f.path), id) // [[Note]]
    put(f.path.replace(/\.[^.]+$/, ''), id) // [[folder/Note]]
    if (root && f.path.startsWith(`${root}/`)) {
      put(f.path.slice(root.length + 1).replace(/\.[^.]+$/, ''), id) // vault-relative
    }
    put(parsed.get(f.path)!.title, id) // [[The title]]
  }
  return { index, collisions: collisions.size }
}

/** أهداف wikilink تتجاهل الحالة ولاحقة `.md` ومرساة `#heading`/`^block` —
 *  النموذج بلا مراسٍ داخل الصفحة، فتلك تهبط على الصفحة. */
const linkKey = (raw: string): string =>
  raw.replace(/^\.?\//, '').replace(/[#^].*$/, '').replace(/\.(md|markdown)$/i, '')
    .trim().toLowerCase()

export interface Resolution {
  html: string
  linked: number
  dangling: number
}

/**
 * حوّل مواضع `#w/` الخاصة بالمحلل إلى روابط `#p/<id>` حقيقية.
 *
 * هدف غير موجود في هذا الاستيراد يبقى `[[Name]]` الحرفي كما كتبه المؤلف:
 * صادق وقابل للبحث وما زال markdown صحيحاً إن صدُر ثانية — ويُحل فعلاً إذا
 * استُوردت الملاحظة المفقودة لاحقاً. فك رابطة صامت كان كذباً عن ما قاله الملف.
 */
export function resolveWikilinks(html: string, lookup: (target: string) => string | undefined): Resolution {
  let linked = 0
  let dangling = 0
  const out = html.replace(
    /<a href="#w\/([^"]*)">([\s\S]*?)<\/a>/g,
    (_m, enc: string, text: string) => {
      let target = enc
      try {
        target = decodeURIComponent(enc)
      } catch {
        /* أبقِ الصيغة الخام */
      }
      const id = lookup(target)
      if (id) {
        linked++
        return `<a href="#p/${esc(id)}">${text}</a>`
      }
      dangling++
      const shown = esc(target)
      return text === shown ? `[[${text}]]` : `[[${shown}|${text}]]`
    }
  )
  return { html: out, linked, dangling }
}
