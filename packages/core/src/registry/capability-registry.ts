/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: capability-registry.ts
 * 📂 المسار: packages/core/src/registry/capability-registry.ts
 * 🎯 الهدف الرئيسي: منع تكرار البلوكات عبر فهرسة القدرات (Capability Tags) واشتقاق البصمة حتمياً
 * 📋 المعايير: Zero-dependency, Zero-DOM, Pure In-Memory Logic, Cross-Environment (Node/Browser)
 * 🧪 الاختبارات: vitest tests / scaffold-block integration
 * 🏷️ المعرف: CORE-REG-001
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Deterministic FNV-1a Hash + Alphabetical Tag Normalization + Semantic Duplicate Guard
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. هذا الملف نقي 100% ولا يحتوي على fs أو أي استيراد لمنصة محددة (يمر من فحص audit-core-purity).
 *    2. البصمة تشتق حتمياً من ترتيب الـ Tags أبجدياً لمنع تكرار القدرات باختلاف ترتيب الإدخال.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// القائمة المعتمدة للـ Tags (النطاقات الأربعة الرئيسية والوظائف الأساسية)
// ─────────────────────────────────────────────────────────────────────────────

export const KNOWN_CAPABILITY_TAGS = [
  // Writer Domain
  'hasTextContext',
  'hasMathTypesetting',
  'hasDiagramRendering',
  // Calc & Base Domains
  'hasGridContext',
  'hasFormulaEvaluation',
  'hasRecordBinding',
  // Impress Domain & Canvas
  'hasSpatialLayout',
  'canPlayAudio',
  'canPlayVideo',
  'hasImageSource',
  'hasInteractiveCanvas',
  // Execution & Export
  'hasCodeExecution',
  'isContainer',
  'hasExportCapability',
] as const;

export type CapabilityTag = (typeof KNOWN_CAPABILITY_TAGS)[number];

// ─────────────────────────────────────────────────────────────────────────────
// الأنواع
// ─────────────────────────────────────────────────────────────────────────────

export interface Capability {
  readonly id: string;
  readonly tags: readonly CapabilityTag[];
  readonly signature: string;
  readonly overrideReason?: string;
  readonly createdAt?: string;
}

export interface ConflictResult {
  readonly hasConflict: boolean;
  readonly conflictingBlock?: string;
  readonly reason?: 'duplicate-signature' | 'duplicate-id';
}

// ─────────────────────────────────────────────────────────────────────────────
// اشتقاق الـ Signature (حتمي، نقي وخفيف يعمل في المتصفح والـ Node)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FNV-1a hash بسيط (32-bit) — لا يعتمد على crypto لضمان نقاء النواة
 */
function fnv1aHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * اشتقاق signature حتمي من الـ tags — بترتيب أبجدي بعد إزالة التكرار
 */
export function deriveSignature(tags: readonly CapabilityTag[]): string {
  const sorted = Array.from(new Set(tags)).sort();
  return fnv1aHash(sorted.join('|'));
}

/**
 * التحقق من أن كل الـ tags المدخلة معروفة ومطابقة للقائمة المعتمدة
 */
export function validateTags(
  tags: readonly string[],
): { valid: true } | { valid: false; unknown: string[] } {
  const knownSet = new Set<string>(KNOWN_CAPABILITY_TAGS);
  const unknown = tags.filter((t) => !knownSet.has(t));
  return unknown.length === 0 ? { valid: true } : { valid: false, unknown };
}

// ─────────────────────────────────────────────────────────────────────────────
// السجل المنطقي (In-Memory Only)
// ─────────────────────────────────────────────────────────────────────────────

export class CapabilityRegistry {
  private readonly byId = new Map<string, Capability>();
  private readonly bySignature = new Map<string, Capability[]>();

  constructor(initial: readonly Capability[] = []) {
    for (const cap of initial) {
      const derivedSignature = deriveSignature(cap.tags);
      const normalizedCap: Capability = { ...cap, signature: derivedSignature };
      this.byId.set(normalizedCap.id, normalizedCap);
      const list = this.bySignature.get(derivedSignature) ?? [];
      list.push(normalizedCap);
      this.bySignature.set(derivedSignature, list);
    }
  }

  /**
   * فحص التعارض قبل التسجيل
   */
  checkConflict(id: string, tags: readonly CapabilityTag[]): ConflictResult {
    if (this.byId.has(id)) {
      return { hasConflict: true, conflictingBlock: id, reason: 'duplicate-id' };
    }
    const signature = deriveSignature(tags);
    const existingList = this.bySignature.get(signature);
    if (existingList && existingList.length > 0) {
      return {
        hasConflict: true,
        conflictingBlock: existingList[0]?.id ?? '',
        reason: 'duplicate-signature',
      };
    }
    return { hasConflict: false };
  }

  /**
   * تسجيل قدرة جديدة مع خيار التجاوز الموثق بالسبب (overrideReason)
   */
  register(
    id: string,
    tags: readonly CapabilityTag[],
    options?: { allowDuplicateSignature?: boolean; reason?: string },
  ): Capability {
    const conflict = this.checkConflict(id, tags);
    if (conflict.hasConflict) {
      if (conflict.reason === 'duplicate-id') {
        throw new Error(`يوجد بلوك مسجّل بنفس المعرف: "${id}"`);
      }
      if (conflict.reason === 'duplicate-signature' && !options?.allowDuplicateSignature) {
        throw new Error(
          `تركيبة القدرات هذه مطابقة تماماً لبلوك موجود: "${conflict.conflictingBlock}". فكّر في توسيعه أو استخدم الاستثناء الموثق بحجة واضحة.`,
        );
      }
    }

    const capability: Capability = {
      id,
      tags,
      signature: deriveSignature(tags),
      ...(options?.reason ? { overrideReason: options.reason } : {}),
      createdAt: new Date().toISOString(),
    };

    this.byId.set(id, capability);
    const list = this.bySignature.get(capability.signature) ?? [];
    list.push(capability);
    this.bySignature.set(capability.signature, list);

    return capability;
  }

  findById(id: string): Capability | undefined {
    return this.byId.get(id);
  }

  findBySignature(signature: string): Capability[] {
    return this.bySignature.get(signature) ?? [];
  }

  toArray(): Capability[] {
    return Array.from(this.byId.values());
  }

  /** تسجيل بلوك قديم (baseline) بدون tags حقيقية بعد — علامة مؤقتة صريحة */
  registerLegacy(id: string, meta?: { note?: string }): void {
    if (this.byId.has(id)) return; // idempotent، لا يكرر لو اشتغل البايسلاين مرتين
    const capability: Capability = {
      id,
      tags: [], // ⚠️ فارغة عمداً — تمييز واضح أنها لم تُراجع بعد
      signature: `legacy-${id}`, // لا تدخل في فحص التعارض الدلالي العادي
      ...(meta?.note ? { overrideReason: meta.note } : {}),
      createdAt: new Date().toISOString(),
    };
    this.byId.set(id, capability);
    // ملاحظة: عمداً لا نضيفها لـ bySignature حتى لا تتعارض مع فحص deriveSignature الطبيعي
  }

  /** حذف مجموعة من القدرات حسب شرط (يُستخدم في --clean-stale) */
  removeWhere(predicate: (cap: Capability) => boolean): void {
    for (const cap of this.toArray()) {
      if (predicate(cap)) {
        this.byId.delete(cap.id);
        const group = this.bySignature.get(cap.signature) ?? [];
        const filtered = group.filter((c) => c.id !== cap.id);
        if (filtered.length > 0) this.bySignature.set(cap.signature, filtered);
        else this.bySignature.delete(cap.signature);
      }
    }
  }
}
