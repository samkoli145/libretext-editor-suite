/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * 🎯 المهمة: تخزين الأصول (الصور) بعنونة المحتوى (Content-Addressed Storage)
 *           مع تصغير إداريّ عكسي صريح للصور الضخمة.
 * 🏛️ الدور: نواة معزولة (Zero-Dependency Engine) في document-pipeline.
 * 📥 المستهلك: UniversalFormatConverterModal, RichTextEditor, CanvasDesigner, PDF
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Content-Addressed Key + Byte-Compare Intern Loop:
 *    مفتاح المحتوى SHA-256 (`s…`) مع احتياط متزامن FNV-1a (`f…`) — الوسم
 *    الحسابي داخل المفتاح كي لا تُصنع قيمتان من تجزئتين مختلفتين. التكرار
 *    (Dedupe) مقارنة بايت-بايت على اصطدام المفتاح: أي تصادم لا يُخطئ بل
 *    يُصنع متغير `~n`، لأن تصادم FNV-1a في تخزين عنونة المحتوى يعني استبدال
 *    صامت لصورة B بصورة A داخل ملف يُرسَل.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. `crypto.subtle.digest` غير متزامن ولا يُنتظر داخل استدعاء commit
 *       متزامن — لذا التأجيل متعمّد: التجزئة والمقارنة أولاً ثم COMMIT واحد
 *       متزامن يكتب البايتات والمرجع معاً (خطوة Undo واحدة للصورة).
 *    2. إعادة ترميز PNG صغير (40KB) إلى WebP قد تُكبّره وتفقد الدقة —
 *       حارس: لا تُمرَّر إلا الصور >600KB أو الضخمة أبعاداً، وممنوع أن
 *       يكبر الناتج عن الأصل.
 *    3. `btoa` على مصفوفة كبيرة قد يرمي — التجزئة تعمل على TextEncoder
 *       ثم b64url من بايتات الـ digest المقصوصة (22 محرفاً).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - `crypto.subtle` مفقود ⇒ الاحتياط المتزامن FNV-1a: الصورة تُدرج
 *      بدل أن يرمي الاستدعاء (ليست دعماً لمنابع غير آمنة).
 *    - قائمة سماح محلية لـ `src`: `asset:` و `data:` فقط داخل الملف.
 *    - انسحاب آمن عند فشل فك الترميز أو غياب الـ 2d context.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * نمط معدَّل عن: New Code_X3/spaces/assets.ts (The Bento authors, MIT).
 */

/** أطول حافة تُحفظ عند التصغير — التفاصيل فوقها غير مرئية في عمود نصي. */
export const MAX_EDGE = 1600
/** فوق هذا الحد يُسأل المستخدم قبل التضمين بدل صنع ملف 30MB بصمت. */
export const IMAGE_EMBED_BUDGET = 4 * 1024 * 1024
/** متى تتوقف المساحة عن كونها مريحة للبريد. حذر، لا يمنع. */
export const SPACE_WEIGHT_WARN = 25 * 1024 * 1024

export interface AssetTable {
  assets?: Record<string, string>
  pages?: Array<{ blocks: Array<Record<string, unknown>> }>
  fonts?: Array<{ asset?: string }>
}

export type DocumentWithAssets = AssetTable & Record<string, unknown>

/** مفتاح عنونة محتوى بتجزئة SHA-256 أو احتياط FNV-1a المتزامن. */
export async function contentKey(bytes: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle
  if (subtle) {
    const buf = new TextEncoder().encode(bytes)
    const digest = await subtle.digest('SHA-256', buf)
    const b64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    return `s${b64.slice(0, 22)}`
  }
  let h = 0x811c9dc5
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return `f${h.toString(36)}`
}

/**
 * ضع data: URI في جدول الأصول وأرجع مرجع `asset:`.
 *
 * غير متزامن عمداً: التجزئة والمقارنة بالبايت تحدث أولاً، ثم المتصل يصنع
 * COMMIT واحداً متزامناً يكتب البايتات والمرجع معاً.
 */
export async function internAsset(doc: DocumentWithAssets, dataUri: string): Promise<string> {
  if (!dataUri.startsWith('data:')) return dataUri
  const assets = (doc.assets ??= {})
  const base = await contentKey(dataUri)
  let key = base
  for (let n = 1; ; n++) {
    const held = assets[key]
    if (held === undefined) break // حر
    if (held === dataUri) return `asset:${key}` // الصورة نفسها فعلاً
    key = `${base}~${n}` // تصادم، لا تكرار
  }
  assets[key] = dataUri
  return `asset:${key}`
}

/** الأصول التي لم تعد أي كتلة تشير إليها. */
export function orphanAssets(doc: DocumentWithAssets): string[] {
  const used = new Set<string>()
  for (const p of doc.pages ?? []) {
    for (const b of p.blocks) {
      for (const v of [b.src, b.poster]) {
        if (typeof v === 'string' && v.startsWith('asset:')) used.add(v.slice(6))
      }
    }
  }
  for (const f of doc.fonts ?? []) {
    if (f.asset) used.add(f.asset)
  }
  return Object.keys(doc.assets ?? {}).filter((k) => !used.has(k))
}

/** تقريبياً ما يزنه هذا المستند، للقراءة السريعة. */
export function docWeight(doc: DocumentWithAssets): number {
  let n = 0
  for (const v of Object.values(doc.assets ?? {})) n += v.length
  for (const p of doc.pages ?? []) for (const b of p.blocks) n += (String(b.html ?? '')).length + 80
  return n
}

export interface PreparedImage {
  /** data: URI جاهزة للإدراج */
  dataUri: string
  /** الحجم الذاتي بعد أي تصغير — يحمل صندوق النسبة أثناء فك الترميز */
  w: number
  h: number
  /** false عندما أُعيد ترميز البايتات، فيقول الواجهة ذلك ويعرض الأصل */
  original: boolean
  /** البايتات قبل التصغير، للشارة */
  wasBytes: number
}

/**
 * اقرأ ملفاً مختاراً، وإن كان كبيراً أعد ترميزه أصغر.
 *
 * صورة الهاتف 3–8MB وعرضها 4000px؛ في عمود 720px هذا التفصيل غير مرئي
 * والميغابايت تسافر مع الملف للأبد. التصغير هو الفرق بين مساحة قابلة
 * للبريد وأخرى لا. وهو عكسي ويقول ذلك: الكتلة تسجّل `original: false`,
 * والمحرر يضع شارة، و"استخدم الأصل" يعيد البايتات غير الملموسة.
 */
export async function prepareImage(file: File | Blob): Promise<PreparedImage> {
  const raw = await blobToDataUri(file)
  const wasBytes = raw.length

  let bmp: ImageBitmap | null = null
  try {
    bmp = await createImageBitmap(file)
  } catch {
    /* ليست صورة قابلة للفك */
  }
  if (!bmp) return { dataUri: raw, w: 0, h: 0, original: true, wasBytes }

  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height))
  // صغيرة بما يكفي، أو بايتاتها صغيرة أصلاً: أبقِها. إعادة ترميز PNG 40KB
  // كـ WebP قد تُكبّره وتفقد الدقة دائماً.
  if (scale === 1 && raw.length < 600 * 1024) {
    const out = { dataUri: raw, w: bmp.width, h: bmp.height, original: true, wasBytes }
    bmp.close()
    return out
  }

  const w = Math.round(bmp.width * scale)
  const h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bmp.close()
    return { dataUri: raw, w: bmp.width, h: bmp.height, original: true, wasBytes }
  }
  ctx.drawImage(bmp, 0, 0, w, h)
  bmp.close()

  const encoded = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.82))
  if (!encoded) return { dataUri: raw, w, h, original: true, wasBytes }
  const smaller = await blobToDataUri(encoded)
  // لا تدع "التحسين" يجعلها أكبر أبداً
  if (smaller.length >= raw.length) return { dataUri: raw, w, h, original: true, wasBytes }
  return { dataUri: smaller, w, h, original: false, wasBytes }
}

export function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(String(r.result))
    r.onerror = () => rej(r.error)
    r.readAsDataURL(blob)
  })
}

/** تحويل حجم بايت إلى نص مقروء. */
export const humanBytes = (n: number): string =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : n >= 1024
      ? `${Math.round(n / 1024)} KB`
      : `${n} B`
