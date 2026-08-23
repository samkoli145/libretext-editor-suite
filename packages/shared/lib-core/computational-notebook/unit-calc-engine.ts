/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك حساب الوحدات والأوقات والملاحظات السحرية (Unit & Magic Notes Engine)
 * 🏛️ الدور: نواة معزولة صفرية الاعتماديات لاشتقاق الوحدات والحسابات اللحظية المضمنة
 * 📥 المستهلك: ScratchpadEngine, RichTextEditor, CanvasDesigner, UiDesigner
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Pure Recursive-Descent Unit Calculus without eval/new Function (Zero-Dependency AST Evaluator)
 *    - Magic Notes Inline Derivation: السطر المنتهي بـ `=` يُشتق جوابه في العرض فقط دون حفظه في المستند
 *    - Single Base Unit Conversion: تحويل كل عائلة وحدات عبر قاعدة واحدة لمنع التراكم والتناقض
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأمان الصارم: حظر استخدام eval أو new Function كحاجز أمني مطلق لحماية المستندات من الاختراق.
 *    2. التاريخ كرمز مفرد (Date Tokenization): تحليل ISO Dates (YYYY-MM-DD) قبل الأرقام لمنع قراءتها كعمليات طرح (2026-08-10 != 2008).
 *    3. لا تخزين للجواب: القيمة المشتقة تظهر كعرض فقط (View State) ويبقى المستند نصوصاً عادية نظيفة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التخلص من غبار الفاصلة العائمة (Float Dust Cleanup) عبر `tidy()`
 *    - فحص حدود المصفوفات والمؤشرات ومنع تجاوز طول التعبير
 *    - إرجاع null بأمان عند التعابير غير الصالحة دون رمي أي استثناءات runtime
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

export interface CalcVal {
  n: number;
  /** canonical unit key, e.g. 'm' | 'kg' | 'day' | '%'; absent = plain number */
  u?: string;
  /** the value IS a date, `n` being days since the epoch in local terms */
  date?: boolean;
  /** the value is a TIME OF DAY, `n` being seconds since midnight */
  clock?: boolean;
}

export interface UnitCalcContext {
  /** names defined earlier on the same page — `budget = 5000` */
  vars?: Map<string, CalcVal>;
  /** numbers from the lines above, for `sum above` */
  above?: number[];
  /** today, as an ISO date string */
  today?: string;
}

// ---------------------------------------------------------------------------
// units table — rigorously calibrated
// ---------------------------------------------------------------------------

interface UnitDef {
  base: string;
  k: number;
  off?: number;
}

const UNITS: Record<string, UnitDef> = {
  // length → metres
  mm: { base: 'm', k: 0.001 },
  cm: { base: 'm', k: 0.01 },
  m: { base: 'm', k: 1 },
  km: { base: 'm', k: 1000 },
  inch: { base: 'm', k: 0.0254 },
  ft: { base: 'm', k: 0.3048 },
  yd: { base: 'm', k: 0.9144 },
  mi: { base: 'm', k: 1609.344 },

  // mass → grams
  mg: { base: 'g', k: 0.001 },
  g: { base: 'g', k: 1 },
  kg: { base: 'g', k: 1000 },
  t: { base: 'g', k: 1e6 },
  oz: { base: 'g', k: 28.349523125 },
  lb: { base: 'g', k: 453.59237 },

  // data → bytes
  byte: { base: 'byte', k: 1 },
  kb: { base: 'byte', k: 1024 },
  mb: { base: 'byte', k: 1024 ** 2 },
  gb: { base: 'byte', k: 1024 ** 3 },
  tb: { base: 'byte', k: 1024 ** 4 },

  // duration → seconds
  ms: { base: 's', k: 0.001 },
  s: { base: 's', k: 1 },
  min: { base: 's', k: 60 },
  h: { base: 's', k: 3600 },
  day: { base: 's', k: 86400 },
  week: { base: 's', k: 604800 },

  // temperature → celsius
  c: { base: 'c', k: 1 },
  f: { base: 'c', k: 5 / 9, off: -32 },
  k: { base: 'c', k: 1, off: -273.15 },
};

const ALIAS: Record<string, string> = {
  millimetre: 'mm',
  millimeter: 'mm',
  centimetre: 'cm',
  centimeter: 'cm',
  metre: 'm',
  meter: 'm',
  metres: 'm',
  meters: 'm',
  kilometre: 'km',
  kilometer: 'km',
  kilometres: 'km',
  kilometers: 'km',
  in: 'inch',
  inches: 'inch',
  foot: 'ft',
  feet: 'ft',
  yard: 'yd',
  yards: 'yd',
  mile: 'mi',
  miles: 'mi',
  gram: 'g',
  grams: 'g',
  kilogram: 'kg',
  kilograms: 'kg',
  kilo: 'kg',
  kilos: 'kg',
  tonne: 't',
  tonnes: 't',
  ounce: 'oz',
  ounces: 'oz',
  pound: 'lb',
  pounds: 'lb',
  lbs: 'lb',
  b: 'byte',
  bytes: 'byte',
  kib: 'kb',
  mib: 'mb',
  gib: 'gb',
  tib: 'tb',
  sec: 's',
  secs: 's',
  second: 's',
  seconds: 's',
  minute: 'min',
  minutes: 'min',
  mins: 'min',
  hour: 'h',
  hours: 'h',
  hr: 'h',
  hrs: 'h',
  d: 'day',
  days: 'day',
  wk: 'week',
  weeks: 'week',
  w: 'week',
  celsius: 'c',
  centigrade: 'c',
  fahrenheit: 'f',
  kelvin: 'k',
};

export const unitOf = (w: string): string | undefined => {
  const k = w.toLowerCase();
  const canon = ALIAS[k] ?? k;
  return UNITS[canon] ? canon : undefined;
};

const toBase = (v: CalcVal): number => {
  const u = UNITS[v.u!];
  return (v.n + (u.off ?? 0)) * u.k;
};

const fromBase = (n: number, to: string): number => {
  const u = UNITS[to];
  return n / u.k - (u.off ?? 0);
};

// ---------------------------------------------------------------------------
// Local calendar arithmetic
// ---------------------------------------------------------------------------

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
const dayMs = 86400000;

const toDay = (y: number, m: number, d: number): number =>
  Math.round(
    new Date(y, m - 1, d).getTime() / dayMs - new Date(y, m - 1, d).getTimezoneOffset() / 1440,
  );

const fromDay = (n: number): string => {
  const at = new Date(n * dayMs);
  const y = at.getUTCFullYear(),
    m = at.getUTCMonth() + 1,
    d = at.getUTCDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

function parseISO(s: string): number | null {
  const m = ISO.exec(s);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const at = new Date(y, mo - 1, d);
  if (at.getFullYear() !== y || at.getMonth() !== mo - 1 || at.getDate() !== d) return null;
  return toDay(y, mo, d);
}

export function localToday(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

// ---------------------------------------------------------------------------
// Lexer & Recursive-Descent Parser
// ---------------------------------------------------------------------------

type Tok =
  { t: 'n'; v: number } | { t: 'w'; v: string } | { t: 'o'; v: string } | { t: 'd'; v: number };

function lex(src: string): Tok[] | null {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\u00A0') {
      i++;
      continue;
    }
    // Date token
    if (/[0-9]/.test(c)) {
      const m = /^\d{4}-\d{2}-\d{2}/.exec(src.slice(i));
      if (m) {
        const day = parseISO(m[0]);
        if (day === null) return null;
        out.push({ t: 'd', v: day });
        i += m[0].length;
        continue;
      }
    }
    // Numeric token
    if (/[0-9.]/.test(c)) {
      let j = i,
        seen = '';
      while (j < src.length && /[0-9.,_]/.test(src[j])) {
        if (src[j] === ',' && !/[0-9]/.test(src[j + 1] ?? '')) break;
        seen += src[j] === ',' || src[j] === '_' ? '' : src[j];
        j++;
      }
      const n = Number(seen);
      if (!Number.isFinite(n)) return null;
      out.push({ t: 'n', v: n });
      i = j;
      continue;
    }
    // Word / variable token
    if (/[A-Za-z_$£€]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_$£€]/.test(src[j])) j++;
      out.push({ t: 'w', v: src.slice(i, j) });
      i = j;
      continue;
    }
    // Operator token
    if ('+-*/^()%:'.includes(c)) {
      out.push({ t: 'o', v: c });
      i++;
      continue;
    }
    return null;
  }
  return out;
}

class Parser {
  i = 0;
  t: Tok[];
  ctx: UnitCalcContext;

  constructor(t: Tok[], ctx: UnitCalcContext) {
    this.t = t;
    this.ctx = ctx;
  }

  peek(): Tok | undefined {
    return this.t[this.i];
  }

  word(): string | undefined {
    const x = this.peek();
    return x?.t === 'w' ? x.v.toLowerCase() : undefined;
  }

  op(v: string): boolean {
    const x = this.peek();
    if (x?.t === 'o' && x.v === v) {
      this.i++;
      return true;
    }
    return false;
  }

  kw(...w: string[]): boolean {
    const x = this.word();
    if (x && w.includes(x)) {
      this.i++;
      return true;
    }
    return false;
  }

  expr(): CalcVal | null {
    let a = this.term();
    if (!a) return null;
    for (;;) {
      const plus = this.op('+');
      const minus = !plus && this.op('-');
      if (!plus && !minus) return a;
      const b = this.term();
      if (!b) return null;
      if (b.u === '%') {
        a = { ...a, n: a.n * (1 + ((plus ? 1 : -1) * b.n) / 100) };
        continue;
      }
      const r = this.add(a, b, plus ? 1 : -1);
      if (!r) return null;
      a = r;
    }
  }

  add(a: CalcVal, b: CalcVal, sign: number): CalcVal | null {
    if (a.clock && b.clock) {
      if (sign > 0) return null;
      const diff = a.n - b.n;
      return { n: (diff < 0 ? diff + 86400 : diff) / 3600, u: 'h' };
    }
    if (a.clock && b.u && UNITS[b.u]?.base === 's') {
      const sec = toBase(b) * sign;
      const at = (((a.n + sec) % 86400) + 86400) % 86400;
      return { n: at, clock: true };
    }
    if (b.clock && a.u && UNITS[a.u]?.base === 's' && sign > 0) {
      const sec = toBase(a);
      const at = (((b.n + sec) % 86400) + 86400) % 86400;
      return { n: at, clock: true };
    }
    if (a.date && b.date) {
      if (sign > 0) return null;
      return { n: a.n - b.n, u: 'day' };
    }
    if (a.date && b.u && UNITS[b.u]?.base === 's') {
      const days = (toBase(b) / 86400) * sign;
      return { n: a.n + days, date: true };
    }
    if (!a.u && !b.u) return { n: a.n + b.n * sign };
    if (a.u && b.u) {
      const ua = UNITS[a.u],
        ub = UNITS[b.u];
      if (!ua || !ub || ua.base !== ub.base) return null;
      const baseVal = toBase(a) + toBase(b) * sign;
      return { n: fromBase(baseVal, a.u), u: a.u };
    }
    return null;
  }

  term(): CalcVal | null {
    let a = this.factor();
    if (!a) return null;
    for (;;) {
      const mul = this.op('*');
      const div = !mul && this.op('/');
      if (!mul && !div) return a;
      const b = this.factor();
      if (!b) return null;
      if (div && b.n === 0) return null;
      if (mul) {
        if (!a.u && !b.u) a = { n: a.n * b.n };
        else if (a.u && !b.u) a = { n: a.n * b.n, u: a.u };
        else if (!a.u && b.u) a = { n: a.n * b.n, u: b.u };
        else return null;
      } else {
        if (!a.u && !b.u) a = { n: a.n / b.n };
        else if (a.u && !b.u) a = { n: a.n / b.n, u: a.u };
        else if (a.u && b.u) {
          const ua = UNITS[a.u],
            ub = UNITS[b.u];
          if (!ua || !ub || ua.base !== ub.base) return null;
          a = { n: toBase(a) / toBase(b) };
        } else return null;
      }
    }
  }

  factor(): CalcVal | null {
    if (this.op('-')) {
      const v = this.factor();
      return v ? { ...v, n: -v.n } : null;
    }
    if (this.op('+')) return this.factor();

    const x = this.peek();
    if (!x) return null;

    // Date
    if (x.t === 'd') {
      this.i++;
      return { n: x.v, date: true };
    }

    // Number or time
    if (x.t === 'n') {
      this.i++;
      if (this.op(':')) {
        const min = this.peek();
        if (min?.t === 'n' && Number.isInteger(min.v) && min.v >= 0 && min.v < 60) {
          this.i++;
          return { n: x.v * 3600 + min.v * 60, clock: true };
        }
        return null;
      }
      const u = this.unit();
      return u ? { n: x.v, u } : { n: x.v };
    }

    // Parentheses
    if (this.op('(')) {
      const v = this.expr();
      if (!v || !this.op(')')) return null;
      const u = this.unit();
      return u ? { n: v.n, u } : v;
    }

    // Keyword or variable
    if (x.t === 'w') {
      const w = x.v.toLowerCase();
      this.i++;
      if (w === 'today') {
        const d = parseISO(this.ctx.today ?? localToday());
        return d !== null ? { n: d, date: true } : null;
      }
      if (w === 'yesterday') {
        const d = parseISO(this.ctx.today ?? localToday());
        return d !== null ? { n: d - 1, date: true } : null;
      }
      if (w === 'tomorrow') {
        const d = parseISO(this.ctx.today ?? localToday());
        return d !== null ? { n: d + 1, date: true } : null;
      }
      if (w === 'sum' && this.kw('above')) {
        const nums = this.ctx.above ?? [];
        return { n: nums.reduce((s, v) => s + v, 0) };
      }
      if (w === 'average' && this.kw('above')) {
        const nums = this.ctx.above ?? [];
        return nums.length ? { n: nums.reduce((s, v) => s + v, 0) / nums.length } : null;
      }
      const named = this.ctx.vars?.get(w);
      if (named) return named;
    }

    return null;
  }

  unit(): string | undefined {
    if (this.op('%')) return '%';
    const w = this.word();
    if (!w) return undefined;
    const u = unitOf(w);
    if (u) {
      this.i++;
      return u;
    }
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Formatting & Helpers
// ---------------------------------------------------------------------------

const LABEL: Record<string, string> = {
  inch: 'in',
  byte: 'B',
  kb: 'KB',
  mb: 'MB',
  gb: 'GB',
  tb: 'TB',
  day: 'days',
  week: 'weeks',
  c: '°C',
  f: '°F',
  k: 'K',
};

const tidy = (n: number): number => (Math.abs(n) < 1e-10 ? 0 : Number(n.toPrecision(12)));

export function formatCalcVal(v: CalcVal, locale?: string): string {
  if (v.date) return fromDay(Math.round(v.n));
  if (v.clock) {
    const t = Math.round(v.n / 60);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  }
  const n = tidy(v.n);
  const abs = Math.abs(n);
  const digits = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  const num = new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(n);
  if (!v.u) return num;
  if (v.u === '%') return `${num}%`;
  return `${num} ${LABEL[v.u] ?? v.u}`;
}

// ---------------------------------------------------------------------------
// Surface APIs: evaluate, answer, asksForAnswer, pageContext, feed
// ---------------------------------------------------------------------------

const ASKS = /=\s*$/;
export const asksForAnswer = (text: string): boolean => ASKS.test(text);

const DEF = /^\s*([A-Za-z_][A-Za-z0-9_ ]{0,30}?)\s*=\s*(.+)$/;

export function parseDefinition(
  text: string,
  ctx: UnitCalcContext = {},
): { name: string; val: CalcVal } | null {
  const m = DEF.exec(text);
  if (!m || asksForAnswer(text)) return null;
  const name = m[1].trim().toLowerCase();
  if (
    !name ||
    unitOf(name) ||
    ['today', 'tomorrow', 'yesterday', 'sum', 'total', 'average'].includes(name)
  ) {
    return null;
  }
  const val = evaluateCalc(m[2], ctx);
  return val ? { name, val } : null;
}

export function evaluateCalc(src: string, ctx: UnitCalcContext = {}): CalcVal | null {
  const body = src.replace(ASKS, '').trim();
  if (!body || body.length > 200) return null;
  const toks = lex(body);
  if (!toks || !toks.length) return null;
  const p = new Parser(toks, ctx);
  const v = p.expr();
  if (!v || p.i !== toks.length || !Number.isFinite(v.n)) return null;
  return v;
}

export function answerCalc(
  text: string,
  ctx: UnitCalcContext = {},
  locale?: string,
): string | null {
  if (!asksForAnswer(text)) return null;
  const v = evaluateCalc(text, ctx);
  return v ? formatCalcVal(v, locale) : null;
}

export const freshCalcContext = (): UnitCalcContext => ({
  vars: new Map<string, CalcVal>(),
  above: [],
  today: localToday(),
});

export function feedCalcLine(ctx: UnitCalcContext, text: string): void {
  const def = parseDefinition(text, ctx);
  if (def) {
    ctx.vars!.set(def.name, def.val);
    ctx.above!.length = 0;
    return;
  }
  if (asksForAnswer(text)) {
    ctx.above!.length = 0;
    return;
  }
  const v = evaluateCalc(text, ctx);
  if (v && !v.date && !v.clock) {
    ctx.above!.push(v.n);
  } else if (text.trim()) {
    ctx.above!.length = 0;
  }
}

export function buildPageCalcContext(
  lines: Array<{ id: string; text: string }>,
  upToId: string,
): UnitCalcContext {
  const ctx = freshCalcContext();
  for (const l of lines) {
    if (l.id === upToId) break;
    feedCalcLine(ctx, l.text);
  }
  return ctx;
}
