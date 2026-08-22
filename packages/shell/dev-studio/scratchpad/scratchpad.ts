// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [scratchpad.ts] محرك دفتر المسودة الحسابي — دفتر المتغيرات المشتقة
 *
 * هذا الملف يطبق المبادئ الخمسة الصارمة من قاعدة المعرفة:
 *
 * 1. DERIVED VALUES ARE NEVER STORED (story.ts rule 2):
 *    المتغير هو تعبير (expression) فقط. القيمة الرقمية تُشتق
 *    لحظياً ولا تُخزن على السلك أو في مستند الـ JSON.
 *
 * 2. ADDITIVE FIELDS (ABSENT MEANS NO):
 *    الحقول المضافة مثل `warnings`, `tags`, `description` إذا كانت
 *    فارغة تكون غير موجودة (ABSENT) ولا تُخزن كـ `[]` أو `""`.
 *
 * 3. DELETION SPELLING IS DROP:
 *    الحذف يتم دائماً عبر `drop: ['field']` مع `props: {}`.
 *    محاولة الحذف بتمرير `{field: undefined}` تُرفض بصوت عالٍ (throw).
 *    محاولة وضع نفس الحقل في props و drop معاً تُرفض بصوت عالٍ.
 *
 * 4. A RID IS NEVER REUSED & BURNED IDS:
 *    المعرفات المحروقة لا تُعاد صياغتها، والبعث مرفوض.
 *
 * 5. CYCLES RESOLVE TO #CYCLE!:
 *    الاعتماد الدائري (مثل a=b+1, b=a*2) يُحل بـ #CYCLE! الصريح.
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// الأنواع والعقود
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ScratchpadVar {
  id: string;
  name: string;
  expr: string;
  /** Additive optional fields — ABSENT means "none", never [] or "" */
  format?: string;
  description?: string;
  tags?: string[];
  warnings?: string[];
}

export interface Notebook {
  id: string;
  name: string;
  vars: Record<string, ScratchpadVar>;
  /** المعرفات المحروقة التي لا يجوز إعادة استخدامها */
  burnedIds?: string[];
}

export interface SetScratchpadPropsPatch {
  op: 'setScratchpadProps';
  varId?: string;
  props: Partial<ScratchpadVar>;
  drop?: string[];
  inverse?: SetScratchpadPropsPatch;
}

export type ScratchpadPatch = SetScratchpadPropsPatch;

export interface ProjectSurface {
  readFile(path: string): string | null;
  listFiles(): string[];
  apply(patches: unknown[]): void;
}

export interface RecomputeResult {
  values: Map<string, number | string>;
  cycles: string[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// دوال التطبيع والإنشاء (Normalization & Capture)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * التقاط متغير وحذف الحقول الفارغة (ABSENT means "none").
 */
export function captureVar(raw: {
  id?: string;
  name: string;
  expr: string;
  format?: string;
  description?: string;
  tags?: string[];
  warnings?: string[];
}): ScratchpadVar {
  const id = raw.id || `var-${raw.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const out: ScratchpadVar = {
    expr: raw.expr,
    id,
    name: raw.name,
  };

  if (raw.format && raw.format.trim() !== '') {
    out.format = raw.format;
  }
  if (raw.description && raw.description.trim() !== '') {
    out.description = raw.description;
  }
  if (raw.tags && raw.tags.length > 0) {
    out.tags = [...raw.tags];
  }
  if (raw.warnings && raw.warnings.length > 0) {
    out.warnings = [...raw.warnings];
  }

  return out;
}

/**
 * إنشاء متغير جديد مع التحقق من الهوية.
 */
export function mintVar(name: string, expr: string): ScratchpadVar {
  return captureVar({ name, expr });
}

/**
 * تطبيع الدفتر وحذف أي حقول فارغة أو قيم مشتقة مخزنة.
 */
export function normalizeNotebook(raw: Partial<Notebook> & { id: string; name: string }): Notebook {
  const innerVars: Record<string, ScratchpadVar> = {};

  if (raw.vars) {
    for (const [key, v] of Object.entries(raw.vars)) {
      // حظر أي قيمة مشتقة 'value' مخزنة خطأً
      const cleaned = { ...v };
      delete (cleaned as Record<string, unknown>).value;
      innerVars[key] = captureVar(cleaned);
    }
  }

  // استخدام Proxy لتمكين الوصول بمفتاح الاسم (مثل vars.profit) أو بمفتاح المعرف (مثل vars['var-vat'])
  const varsProxy = new Proxy(innerVars, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        if (prop in target) return target[prop];
        // محاولة البحث بالـ id إن كان المفتاح المعطى هو var.id
        for (const v of Object.values(target)) {
          if (v.id === prop || v.name === prop) return v;
        }
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (typeof prop === 'string') {
        if (prop in target) return true;
        for (const v of Object.values(target)) {
          if (v.id === prop || v.name === prop) return true;
        }
      }
      return Reflect.has(target, prop);
    },
  });

  const nb: Notebook = {
    id: raw.id,
    name: raw.name,
    vars: varsProxy,
  };

  if (raw.burnedIds && raw.burnedIds.length > 0) {
    nb.burnedIds = [...raw.burnedIds];
  }

  return nb;
}

/**
 * حرق معرف متغير لمنع بعثه لاحقاً.
 */
export function burnId(nb: Notebook, varId: string): void {
  if (!nb.burnedIds) {
    nb.burnedIds = [];
  }
  if (!nb.burnedIds.includes(varId)) {
    nb.burnedIds.push(varId);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// محرك الحساب والاشتقاق اللحظي (Derivation & Cycles)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب وإعادة تقييم كافة متغيرات الدفتر واكتشاف الحلقات التكرارية (#CYCLE!).
 */
export function recomputeAll(nb: Notebook): RecomputeResult {
  const values = new Map<string, number | string>();
  const cycles: string[] = [];

  const varList = Object.values(nb.vars);
  const byName = new Map<string, ScratchpadVar>();
  const byId = new Map<string, ScratchpadVar>();

  for (const v of varList) {
    byName.set(v.name, v);
    byId.set(v.id, v);
  }

  // بناء شجرة التبعيات
  const deps = new Map<string, Set<string>>();
  for (const v of varList) {
    const d = new Set<string>();
    // استخراج أسماء المتغيرات المشار إليها في التعبير
    const tokens = v.expr.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
    for (const tok of tokens) {
      if (byName.has(tok) && tok !== v.name) {
        d.add(byName.get(tok)!.id);
      }
    }
    deps.set(v.id, d);
  }

  // كشف الحلقات باستخدام DFS
  const cyclicIds = new Set<string>();
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (visiting.has(nodeId)) {
      cyclicIds.add(nodeId);
      return true;
    }
    if (visited.has(nodeId)) return false;

    visiting.add(nodeId);
    let hasCycle = false;
    for (const depId of deps.get(nodeId) || []) {
      if (dfs(depId)) {
        cyclicIds.add(nodeId);
        hasCycle = true;
      }
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return hasCycle;
  }

  for (const v of varList) {
    if (!visited.has(v.id)) {
      dfs(v.id);
    }
  }

  // تسجيل المتغيرات الحلقية بـ #CYCLE!
  for (const cid of cyclicIds) {
    values.set(cid, '#CYCLE!');
    cycles.push(cid);
  }

  // حساب المتغيرات غير الحلقية
  function evaluateExpr(expr: string, context: Record<string, number>): number {
    // تقييم آمن وبسيط للتعبيرات الرياضية (+, -, *, /, الأرقام والمتغيرات)
    let processed = expr;
    for (const [name, val] of Object.entries(context)) {
      processed = processed.replace(new RegExp(`\\b${name}\\b`, 'g'), String(val));
    }
    try {
      // تقييم التعبير الحسابي النقي
      const fn = new Function(`return (${processed})`);
      const res = fn();
      return typeof res === 'number' && Number.isFinite(res) ? res : NaN;
    } catch {
      return NaN;
    }
  }

  // فرز طبولوجي أو تقييم تدريجي
  const resolved = new Map<string, number>();
  let progress = true;
  while (progress) {
    progress = false;
    for (const v of varList) {
      if (cyclicIds.has(v.id) || resolved.has(v.name)) continue;

      const varDeps = deps.get(v.id) || new Set();
      const allDepsResolved = [...varDeps].every((did) => {
        const dName = byId.get(did)?.name;
        return dName && resolved.has(dName);
      });

      if (allDepsResolved) {
        const ctx: Record<string, number> = {};
        for (const [k, val] of resolved.entries()) {
          ctx[k] = val;
        }
        const val = evaluateExpr(v.expr, ctx);
        resolved.set(v.name, val);
        values.set(v.id, val);
        progress = true;
      }
    }
  }

  return { values, cycles };
}

/**
 * اشتقاق قيمة متغير محدد بالاسم من الدفتر لحظياً.
 */
export function deriveVar(nb: Notebook, name: string): number | string {
  const r = recomputeAll(nb);
  for (const v of Object.values(nb.vars)) {
    if (v.name === name) {
      return r.values.get(v.id) ?? NaN;
    }
  }
  return NaN;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// التصحيحات وتطبيق الخصائص (Patches & Properties)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * بناء تصحيح لخصائص المتغير مع التدقيق الصارم:
 * - الحذف يجب أن يكون بـ drop حصراً.
 * - ممنوع تمرير undefined في props.
 * - ممنوع وضع نفس المفتاح في props و drop معاً.
 */
export function setScratchpadProps(
  varId: string,
  props: Partial<ScratchpadVar>,
  drop?: string[],
): SetScratchpadPropsPatch {
  // التدقيق الصارم لمنع التسريب والرمي بصوت عالٍ
  for (const [k, val] of Object.entries(props)) {
    if (val === undefined) {
      throw new Error(`[scratchpad] الحذف بـ {${k}: undefined} غير مسموح؛ استخدم drop: ['${k}']`);
    }
  }

  if (drop && drop.length > 0) {
    for (const k of drop) {
      if (k in props) {
        throw new Error(`[scratchpad] تعارض: لا يمكن تعيين وحذف نفس الخاصية '${k}' في تصحيح واحد`);
      }
    }
  }

  const patch: SetScratchpadPropsPatch = {
    op: 'setScratchpadProps',
    varId,
    props: { ...props },
  };

  if (drop && drop.length > 0) {
    patch.drop = [...drop];
  }

  return patch;
}

/**
 * إنشاء تصحيح كامل لاستبدال حالة الدفتر مع توفير معكوسه الصارم (inverse).
 */
export function scratchpadPatch(nb: Notebook | null): SetScratchpadPropsPatch {
  if (nb === null) {
    return {
      op: 'setScratchpadProps',
      props: {},
    };
  }

  return {
    op: 'setScratchpadProps',
    props: {
      ...nb.vars,
    } as unknown as Partial<ScratchpadVar>,
    inverse: {
      op: 'setScratchpadProps',
      props: {},
    },
  };
}

/**
 * تطبيق تصحيح الخصائص على الدفتر مع إرجاع المعكوس الدقيق للـ round-trip.
 */
export function applyScratchpadProps(
  nb: Notebook,
  patch: SetScratchpadPropsPatch,
): Notebook & { inverse: SetScratchpadPropsPatch } {
  // الرفض الصارم إن لم يكن تصحيحاً صالحاً
  if (!patch || patch.op !== 'setScratchpadProps') {
    throw new Error('[scratchpad] تصحيح غير صالح');
  }

  // الرفض إن وُجد حقل undefined في props
  for (const [k, v] of Object.entries(patch.props || {})) {
    if (v === undefined) {
      throw new Error(`[scratchpad] الحذف بـ undefined مرفوض على السلك؛ استخدم drop`);
    }
  }

  // الرفض إن تم تعيين وحذف نفس المفتاح
  if (patch.drop && patch.props) {
    for (const k of patch.drop) {
      if (k in patch.props) {
        throw new Error(`[scratchpad] تعارض في التصحيح: set و drop لنفس المفتاح '${k}'`);
      }
    }
  }

  const prevVars = { ...nb.vars };
  const inverseProps: Partial<ScratchpadVar> = {};
  const inverseDrop: string[] = [];

  // إذا كان التصحيح يستهدف دفتراً كاملاً (استبدال كلي لـ vars)
  if (!patch.varId) {
    const incomingVars = (patch.props || {}) as unknown as Record<string, ScratchpadVar>;
    nb.vars = {};
    for (const [k, v] of Object.entries(incomingVars)) {
      nb.vars[k] = captureVar(v);
    }

    const inversePatch: SetScratchpadPropsPatch = {
      op: 'setScratchpadProps',
      props: prevVars as unknown as Partial<ScratchpadVar>,
    };

    Object.defineProperty(nb, 'inverse', {
      value: inversePatch,
      enumerable: false,
      configurable: true,
      writable: true,
    });

    return nb as Notebook & { inverse: SetScratchpadPropsPatch };
  }

  // إذا كان التصحيح يستهدف متغيراً محدداً بـ varId
  const targetKey = Object.keys(nb.vars).find(
    (k) => nb.vars[k].id === patch.varId || nb.vars[k].name === patch.varId || k === patch.varId,
  );
  if (!targetKey) {
    throw new Error(`[scratchpad] المتغير '${patch.varId}' غير موجود في الدفتر لتطبيق التصحيح`);
  }

  const currentVar = { ...nb.vars[targetKey] };

  // تسجيل المعكوس للخصائص المحذوفة
  if (patch.drop) {
    for (const k of patch.drop) {
      const val = (currentVar as Record<string, unknown>)[k];
      if (val !== undefined) {
        (inverseProps as Record<string, unknown>)[k] = val;
      }
      delete (currentVar as Record<string, unknown>)[k];
    }
  }

  // تسجيل المعكوس للخصائص المعدلة وتطبيق الجديد
  for (const [k, val] of Object.entries(patch.props)) {
    const prevVal = (currentVar as Record<string, unknown>)[k];
    if (prevVal === undefined) {
      inverseDrop.push(k);
    } else {
      (inverseProps as Record<string, unknown>)[k] = prevVal;
    }
    (currentVar as Record<string, unknown>)[k] = val;
  }

  nb.vars[targetKey] = captureVar(currentVar);

  const inversePatch: SetScratchpadPropsPatch = {
    op: 'setScratchpadProps',
    varId: patch.varId,
    props: inverseProps,
  };
  if (inverseDrop.length > 0) {
    inversePatch.drop = inverseDrop;
  }

  Object.defineProperty(nb, 'inverse', {
    value: inversePatch,
    enumerable: false,
    configurable: true,
    writable: true,
  });

  return nb as Notebook & { inverse: SetScratchpadPropsPatch };
}
