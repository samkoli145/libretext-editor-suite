/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك حمولة القصاصات المعمّم (Generalized Clip-Payload Engine)
 *           — تسلسل العناصر/الشرائح مع الأصول والخطوط، إعادة بناء غير الموثوق
 *           (untrusted rebuild)، وإدراج بمعرّفات جديدة مع إعادة ترميز الأصول.
 * 🏛️ الدور: نواة خط معالجة المستندات والحافظة (Document Pipeline Core).
 * 📥 المستهلك: SmartClipboardEngine, CanvasDesignerEditor, UIDesigner, Workbench.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Tagged-JSON Serialize → Whitelist Rebuild → Asset/Key Remap Insert:
 *    (1) تسلسل حمولة مُعلّمة `__bento:"clip"` ناجيةً على حافظة النظام كنص عادي.
 *    (2) إعادة بناء غير الموثوق: قراءة الحافظة عامة — كل ما لا يتطابق يُسقَط
 *        لا يُصلَح (Dropped, not Repaired) قبل أن يصير جزءاً من المستند.
 *    (3) دمج الأصول مع Remap عند تصادم المفتاح (Same-Key-Different-Value) حتى
 *        لا تُكلبِر أي شيء في المستند الهدف، وترجيع مراجع `asset:` بعد الدمج.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الحافظة وسيلة عامة: الحمولة قد تأتي من أي صفحة — لا تُصدَّق الحقول
 *       بلا فحص نوع (Type Guards) وسقف أحجام (LIMITS).
 *    2. تجنب تكرار المعرفات عند اللصق المتكرر (fresh uid + إزاحة +20px).
 *    3. إعادة الترميز يجب أن تطبق على src/asset للصور والوسائط وsvg بعد الدمج.
 *    4. المفتاح `__bento` فقط — أي تسمية أخرى تُرفَض نهائياً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards إلزامية (sanitizeElementLike / sanitizeSlideLike).
 *    - سقوف صارمة: نص القصاصة، عدد العناصر، عدد الشرائح، عدد الأصول.
 *    - JSON خالٍ من الدوال: التنظيف يمرر بلا `__proto__`/`constructor`.
 *    - قيم افتراضية آمنة لكل مفقود (مصفوفات فارغة بدل undefined).
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { uid } from './block-document-model';

/** العلامة السحرية المعتمدة لحمولة القصاصات — أي تسمية أخرى تُرفَض. */
export const CLIP_MAGIC = '__bento';

export interface ClipFontRecord {
  family: string;
  asset?: string;
  [k: string]: unknown;
}

/** عنصر قصاصة معمّم: حقول معروفة بسيطة + فهرس مفاتيح إضافية. */
export interface ClipElementLike {
  id: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  src?: string;
  asset?: string;
  text?: string;
  fontFamily?: string;
  [k: string]: unknown;
}

export interface ClipSlideLike<TEl = ClipElementLike> {
  id: string;
  elements: TEl[];
  [k: string]: unknown;
}

export interface ClipPayload<TEl = ClipElementLike, TSlide = ClipSlideLike<TEl>> {
  __bento: 'clip';
  kind: 'elements' | 'slides';
  elements?: TEl[];
  slides?: TSlide[];
  assets?: Record<string, string>;
  fonts?: ClipFontRecord[];
}

export interface ClipInsertTarget<TEl = ClipElementLike, TSlide = ClipSlideLike<TEl>> {
  assets?: Record<string, string>;
  fonts?: ClipFontRecord[];
  slides: TSlide[];
}

/** الأجزاء التي يحتاجها الدمج فعلياً (assets + fonts) فقط. */
export interface ClipMergeTarget {
  assets?: Record<string, string>;
  fonts?: ClipFontRecord[];
}

export const CLIP_LIMITS = {
  clipText: 4_000_000,
  elements: 500,
  slides: 50,
  assets: 2000,
} as const;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

/** أول عائلة خط من سلسلة font-family (يفصل عند أول فاصلة). */
export function firstFamily(fontFamily: string | undefined): string {
  return fontFamily ? (fontFamily.split(',')[0]?.trim() ?? '') : '';
}

/**
 * تنظيف عميق لحمولة JSON: يزيل الدوال والمفاتيح الخطرة ويقبض حلقات الكائنات
 * (يُستدعى بعد JSON.parse فلا توجد حلقات عادةً — لكن دفاع إضافي لا يضر).
 */
function deepClean(v: unknown, depth = 0, seen = new Set<object>()): unknown {
  if (depth > 12) return undefined;
  if (Array.isArray(v)) {
    return v.map((x) => deepClean(x, depth + 1, seen));
  }
  if (isPlainObject(v)) {
    if (seen.has(v)) return undefined;
    seen.add(v);
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      out[k] = deepClean(val, depth + 1, seen);
    }
    return out;
  }
  if (typeof v === 'string' || isFiniteNumber(v) || typeof v === 'boolean' || v === null) {
    return v;
  }
  return undefined;
}

/** تعقيم عنصر واحد عبر قائمة مفاتيح معروفة + أنواعها الصحيحة. */
export function sanitizeElementLike(raw: unknown): ClipElementLike | null {
  const obj = deepClean(raw);
  if (!isPlainObject(obj)) return null;
  const type = obj.type;
  if (!isString(type) || !type || type.length > 64) return null;
  const id = obj.id;
  if (!isString(id) || !id) return null;

  const el: ClipElementLike = { id, type };
  if (isFiniteNumber(obj.x)) el.x = obj.x;
  if (isFiniteNumber(obj.y)) el.y = obj.y;
  if (isFiniteNumber(obj.width)) el.width = obj.width;
  if (isFiniteNumber(obj.height)) el.height = obj.height;
  if (isString(obj.src) && obj.src.length <= 2_000_000) el.src = obj.src;
  if (isString(obj.asset) && obj.asset.length <= 512) el.asset = obj.asset;
  if (isString(obj.text) && obj.text.length <= 1_000_000) el.text = obj.text;
  if (isString(obj.fontFamily) && obj.fontFamily.length <= 512) el.fontFamily = obj.fontFamily;
  // النسق المعروف من الشاشة الأخرى: image/media عبر src + svg عبر asset
  for (const [k, v] of Object.entries(obj)) {
    if (
      k === 'id' ||
      k === 'type' ||
      k === 'x' ||
      k === 'y' ||
      k === 'width' ||
      k === 'height' ||
      k === 'src' ||
      k === 'asset' ||
      k === 'text' ||
      k === 'fontFamily'
    )
      continue;
    if (k === '__bento' || k === 'kind') continue;
    const clean = deepClean(v);
    if (clean !== undefined) el[k] = clean;
  }
  return el;
}

export function sanitizeSlideLike<TEl = ClipElementLike>(raw: unknown): ClipSlideLike<TEl> | null {
  const obj = deepClean(raw);
  if (!isPlainObject(obj)) return null;
  const id = obj.id;
  if (!isString(id) || !id) return null;
  const els = obj.elements;
  if (!Array.isArray(els)) return null;
  const elements = els
    .map((e) => sanitizeElementLike(e))
    .filter((e): e is ClipElementLike => e !== null) as unknown as TEl[];
  if (!elements.length) return null;

  const slide: ClipSlideLike<TEl> = { id, elements };
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'id' || k === 'elements') continue;
    const clean = deepClean(v);
    if (clean !== undefined) (slide as Record<string, unknown>)[k] = clean;
  }
  return slide;
}

export function sanitizeClipAssets(raw: unknown): Record<string, string> | undefined {
  if (!isPlainObject(raw)) return undefined;
  const out: Record<string, string> = {};
  let count = 0;
  for (const [k, v] of Object.entries(raw)) {
    if (!isString(k) || k.length > 512) continue;
    if (!isString(v) || v.length > 4_000_000) continue;
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    out[k] = v;
    if (++count >= CLIP_LIMITS.assets) break;
  }
  return Object.keys(out).length ? out : undefined;
}

export function sanitizeClipFonts(raw: unknown): ClipFontRecord[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: ClipFontRecord[] = [];
  for (const entry of raw) {
    const obj = deepClean(entry);
    if (!isPlainObject(obj)) continue;
    const family = obj.family;
    if (!isString(family) || !family || family.length > 512) continue;
    const rec: ClipFontRecord = { family };
    if (isString(obj.asset) && obj.asset.length <= 512) rec.asset = obj.asset;
    if (isString(obj.weight)) rec.weight = obj.weight;
    if (isString(obj.url) && obj.url.length <= 2_000_000) rec.url = obj.url;
    out.push(rec);
  }
  return out.length ? out : undefined;
}

/** مفتاح الأصول الذي ترجعه العناصر (image/media عبر src، وsvg عبر asset). */
export function clipAssetKeysOf(els: ClipElementLike[]): Set<string> {
  const keys = new Set<string>();
  for (const el of els) {
    if (
      (el.type === 'image' || el.type === 'media') &&
      typeof el.src === 'string' &&
      el.src.startsWith('asset:')
    ) {
      keys.add(el.src.slice(6));
    }
    if (typeof el.asset === 'string') keys.add(el.asset);
  }
  return keys;
}

/** الخطوط المطلوبة فعلياً من عناصر نصية في قائمة عناصر. */
export function fontsForElements(
  els: ClipElementLike[],
  docFonts: ClipFontRecord[],
): ClipFontRecord[] {
  const families = new Set<string>();
  for (const el of els) {
    if (el.type === 'text' && typeof el.fontFamily === 'string') {
      const f = firstFamily(el.fontFamily);
      if (f) families.add(f);
    }
  }
  return (docFonts ?? []).filter((font) => families.has(firstFamily(font.family)));
}

/** جمع بيانات الأصول المطلوبة فعلياً (عناصر + خطوط) من مخزن المستند. */
export function collectClipAssets(
  els: ClipElementLike[],
  fonts: ClipFontRecord[],
  docAssets: Record<string, string> | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  const keys = clipAssetKeysOf(els);
  for (const font of fonts) if (typeof font.asset === 'string') keys.add(font.asset);
  for (const k of keys) {
    const v = docAssets?.[k];
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

/** تسلسل عناصر إلى حمولة نصية معلّمة مع أصولها وخطوطها. */
export function serializeElements(
  els: ClipElementLike[],
  assets?: Record<string, string>,
  fonts?: ClipFontRecord[],
): string {
  const safeEls = els
    .map((e) => sanitizeElementLike(e))
    .filter((e): e is ClipElementLike => e !== null);
  const payload: ClipPayload = {
    __bento: 'clip',
    kind: 'elements',
    elements: JSON.parse(JSON.stringify(safeEls)),
    assets: collectClipAssets(safeEls, fonts ?? [], assets),
    fonts: fontsForElements(safeEls, fonts ?? []),
  };
  return JSON.stringify(payload);
}

/** تسلسل شرائح إلى حمولة نصية معلّمة مع أصولها وخطوطها. */
export function serializeSlides<TEl = ClipElementLike>(
  slides: ClipSlideLike<TEl>[],
  assets?: Record<string, string>,
  fonts?: ClipFontRecord[],
): string {
  const safe = slides
    .map((s) => sanitizeSlideLike<TEl>(s))
    .filter((s): s is ClipSlideLike<TEl> => s !== null);
  const els = safe.flatMap((s) => s.elements as unknown as ClipElementLike[]);
  const payload: ClipPayload<TEl, ClipSlideLike<TEl>> = {
    __bento: 'clip',
    kind: 'slides',
    slides: JSON.parse(JSON.stringify(safe)) as ClipSlideLike<TEl>[],
    assets: collectClipAssets(els, fonts ?? [], assets),
    fonts: fontsForElements(els, fonts ?? []),
  };
  return JSON.stringify(payload);
}

/**
 * قراءة الحمولة من نص الحافظة — المكان الوحيد الذي تدخل فيه شظايا المستندات
 * الأجنبية، ولهذا يُعاد بناؤها بالكامل عبر التعقيم (Dropped, not Repaired).
 * الحمولة التي لا يبقى منها شيء بعد إعادة البناء تُرد null فيقع اللصق على
 * مسار النص العادي بدل الالتزام الصامت.
 */
export function parseClip(text: string): ClipPayload | null {
  if (!text || text.length > CLIP_LIMITS.clipText) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isPlainObject(raw)) return null;
  const p = raw as Record<string, unknown>;
  if (p.__bento !== 'clip') return null;
  if (p.kind !== 'elements' && p.kind !== 'slides') return null;

  const payload: ClipPayload = {
    __bento: 'clip',
    kind: p.kind,
    assets: sanitizeClipAssets(p.assets),
    fonts: sanitizeClipFonts(p.fonts),
  };

  if (p.kind === 'elements') {
    if (!Array.isArray(p.elements) || p.elements.length > CLIP_LIMITS.elements) return null;
    payload.elements = p.elements
      .map((e) => sanitizeElementLike(e))
      .filter((e): e is ClipElementLike => e !== null);
    if (!payload.elements.length) return null;
  } else {
    if (!Array.isArray(p.slides) || p.slides.length > CLIP_LIMITS.slides) return null;
    payload.slides = p.slides
      .map((s) => sanitizeSlideLike(s))
      .filter((s): s is ClipSlideLike => s !== null);
    if (!payload.slides.length) return null;
  }
  return payload;
}

/** دمج أصول الحمولة في المستند مع Remap عند تصادم المفتاح بمحتوى مختلف. */
export function mergeClipAssets(
  payload: ClipPayload,
  target: ClipMergeTarget,
): Map<string, string> {
  const remap = new Map<string, string>();
  if (!payload.assets) return remap;
  target.assets = target.assets ?? {};
  for (const [k, v] of Object.entries(payload.assets)) {
    const existing = target.assets[k];
    if (existing === undefined) target.assets[k] = v;
    else if (existing !== v) {
      const nk = `${k}-${uid('a')}`;
      target.assets[nk] = v;
      remap.set(k, nk);
    }
  }
  return remap;
}

/** دمج سجلات الخطوط المضمّنة بعد إعادة ترميز مفاتيح أصولها. */
export function mergeClipFonts(
  payload: ClipPayload,
  target: ClipMergeTarget,
  remap: Map<string, string>,
): void {
  if (!payload.fonts?.length) return;
  target.fonts = target.fonts ?? [];
  for (const source of payload.fonts) {
    if (target.fonts.some((f) => f.family === source.family)) continue;
    target.fonts.push({ ...source, asset: remap.get(source.asset ?? '') ?? source.asset });
  }
}

/** إعادة كتابة مراجع asset: بعد الدمج في جميع العناصر. */
export function rewriteClipRefs(els: ClipElementLike[], remap: Map<string, string>): void {
  if (!remap.size) return;
  for (const el of els) {
    if (
      (el.type === 'image' || el.type === 'media') &&
      typeof el.src === 'string' &&
      el.src.startsWith('asset:')
    ) {
      const k = el.src.slice(6);
      if (remap.has(k)) el.src = 'asset:' + remap.get(k);
    }
    if (typeof el.asset === 'string' && remap.has(el.asset)) {
      el.asset = remap.get(el.asset);
    }
  }
}

/** إدراج العناصر الملصوقة على شريحة بمعرّفات جديدة وإزاحة للرؤية. */
export function insertElements<TEl = ClipElementLike>(
  payload: ClipPayload<TEl>,
  target: ClipInsertTarget<TEl>,
  slide: ClipSlideLike<TEl>,
): TEl[] {
  const remap = mergeClipAssets(payload as ClipPayload, target);
  mergeClipFonts(payload as ClipPayload, target, remap);
  const source = (payload.elements ?? []) as ClipElementLike[];
  const els = source.map((e): ClipElementLike => ({
    ...(JSON.parse(JSON.stringify(e)) as ClipElementLike),
    id: uid(e.type.charAt(0) || 'e'),
    x: (e.x ?? 0) + 20,
    y: (e.y ?? 0) + 20,
  }));
  rewriteClipRefs(els, remap);
  slide.elements.push(...(els as unknown as TEl[]));
  return els as unknown as TEl[];
}

/** إدراج الشرائح الملصوقة عند فهرس `at` بمعرّفات جديدة مع دمج الأصول والخطوط. */
export function insertSlides<TEl = ClipElementLike, TSlide = ClipSlideLike<TEl>>(
  payload: ClipPayload<TEl, TSlide>,
  target: ClipInsertTarget<TEl, TSlide>,
  at: number,
): TSlide[] {
  const remap = mergeClipAssets(payload as ClipPayload, target);
  mergeClipFonts(payload as ClipPayload, target, remap);
  const index = Math.max(0, Math.min(at, target.slides.length));
  const slides: TSlide[] = ((payload.slides ?? []) as ClipSlideLike<TEl>[]).map((s) => {
    const copy = JSON.parse(JSON.stringify(s)) as ClipSlideLike<TEl>;
    copy.id = uid('slide');
    if ('stateOf' in copy) delete copy.stateOf;
    rewriteClipRefs(copy.elements as unknown as ClipElementLike[], remap);
    return copy;
  }) as unknown as TSlide[];
  target.slides.splice(index, 0, ...slides);
  return slides;
}

/** اختصار: نسخ عناصر وإرجاع الحمولة النصية النهائية. */
export const buildClipPayload = serializeElements;
