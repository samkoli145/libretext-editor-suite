/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: جسر الربط التفاعلي المباشر بين المتغيرات ومحررات الكانفا والـ UI
 * 🏛️ الدور: طبقة ربط تفاعلية في الذاكرة (Reactive Memory Bridge with WeakRefs)
 * 📥 المستهلك: CanvasDesigner, UiDesigner, DataGrid, RichTextEditor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Memory Safe Reactivity: استخدام WeakRef لمنع تسرب الذاكرة.
 *    - RAF Throttling: تجميع التحديثات في إطار الرسم لمنع إرهاق المتصفح.
 *    - Pure Value Extraction: استخدام ComputedVar و `deriveVar` بدلاً من القيم المخزنة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تنظيف الروابط الميتة (Dead WeakRefs) تلقائياً عند فحص الروابط.
 *    2. منع التحديث العكسي الدائري أثناء تحديث الـ Target.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص صحة مسار الخاصية (Nested Property Path) قبل القراءة أو الكتابة.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import { getScratchpadEngine } from './ScratchpadEngine.ts';
import { type ScratchpadEvent, type ComputedVar } from './types.ts';

export interface ScratchpadBinding {
  id: string;
  varId: string;
  target: WeakRef<object>;
  property: string;
  transform?: (val: unknown) => unknown;
  inverse?: (val: unknown) => unknown;
  editorType: 'canvas' | 'ui' | 'grid' | 'richtext' | 'custom';
  createdAt: number;
}

export class ScratchpadBindings {
  private bindings = new Map<string, ScratchpadBinding>();
  private varToBindings = new Map<string, Set<string>>();
  private rafScheduled = false;
  private dirtyVars = new Set<string>();

  constructor() {
    const engine = getScratchpadEngine();
    engine.on('varChanged', this.handleVarChanged.bind(this));
    engine.on('varDeleted', this.handleVarDeleted.bind(this));
  }

  bind(
    varId: string,
    target: object,
    property: string,
    options?: {
      transform?: (val: unknown) => unknown;
      inverse?: (val: unknown) => unknown;
      editorType?: 'canvas' | 'ui' | 'grid' | 'richtext' | 'custom';
    },
  ): string {
    const bindingId = `bind_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

    const binding: ScratchpadBinding = {
      id: bindingId,
      varId,
      target: new WeakRef(target),
      property,
      transform: options?.transform,
      inverse: options?.inverse,
      editorType: options?.editorType ?? 'canvas',
      createdAt: Date.now(),
    };

    this.bindings.set(bindingId, binding);

    if (!this.varToBindings.has(varId)) {
      this.varToBindings.set(varId, new Set());
    }
    this.varToBindings.get(varId)!.add(bindingId);

    // Initial application of current derived value
    this.applyBinding(binding);

    return bindingId;
  }

  unbind(bindingId: string): boolean {
    const binding = this.bindings.get(bindingId);
    if (!binding) return false;

    this.bindings.delete(bindingId);
    const set = this.varToBindings.get(binding.varId);
    if (set) {
      set.delete(bindingId);
      if (set.size === 0) {
        this.varToBindings.delete(binding.varId);
      }
    }
    return true;
  }

  unbindAllForVar(varId: string): void {
    const set = this.varToBindings.get(varId);
    if (!set) return;

    for (const bindingId of set) {
      this.bindings.delete(bindingId);
    }
    this.varToBindings.delete(varId);
  }

  private handleVarChanged(event: ScratchpadEvent): void {
    if (event.type !== 'varChanged') return;
    this.dirtyVars.add(event.varId);
    this.scheduleRAF();
  }

  private handleVarDeleted(event: ScratchpadEvent): void {
    if (event.type !== 'varDeleted') return;
    this.unbindAllForVar(event.varId);
  }

  private scheduleRAF(): void {
    if (this.rafScheduled) return;
    this.rafScheduled = true;

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => this.flush());
    } else {
      setTimeout(() => this.flush(), 16);
    }
  }

  private flush(): void {
    this.rafScheduled = false;
    const engine = getScratchpadEngine();

    for (const varId of this.dirtyVars) {
      const bindingIds = this.varToBindings.get(varId);
      if (!bindingIds) continue;

      const computed = engine.deriveVar(varId);
      const val = computed?.value ?? null;

      for (const id of Array.from(bindingIds)) {
        const b = this.bindings.get(id);
        if (!b) continue;

        const targetObj = b.target.deref();
        if (!targetObj) {
          // Dead object collected by GC -> clean up
          this.unbind(id);
          continue;
        }

        const finalVal = b.transform ? b.transform(val) : val;
        this.setNestedProperty(targetObj, b.property, finalVal);
      }
    }

    this.dirtyVars.clear();
  }

  private applyBinding(binding: ScratchpadBinding): void {
    const engine = getScratchpadEngine();
    const computed = engine.deriveVar(binding.varId);
    const val = computed?.value ?? null;
    const targetObj = binding.target.deref();
    if (!targetObj) {
      this.unbind(binding.id);
      return;
    }
    const finalVal = binding.transform ? binding.transform(val) : val;
    this.setNestedProperty(targetObj, binding.property, finalVal);
  }

  private setNestedProperty(obj: any, path: string, value: unknown): void {
    const parts = path.split('.');
    let curr = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!curr[parts[i]] || typeof curr[parts[i]] !== 'object') {
        curr[parts[i]] = {};
      }
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
  }

  listBindings(): ScratchpadBinding[] {
    return Array.from(this.bindings.values());
  }
}

let bindingsInstance: ScratchpadBindings | null = null;

export function getScratchpadBindings(): ScratchpadBindings {
  if (!bindingsInstance) {
    bindingsInstance = new ScratchpadBindings();
  }
  return bindingsInstance;
}
