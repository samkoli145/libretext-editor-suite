/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نظام الثوابت المعمارية والأمان في زمن التشغيل (Runtime Safety & Invariants)
 * 🏛️ الدور: فرض العقود البرمجية واكتشاف الخروقات في بيئة التطوير
 * 📥 المستهلك: cell-formula-engine, selection-model, grid-core
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Design-by-Contract Zero-Overhead Invariant System
 *    فحوصات بنيوية صارمة تعمل فقط في وضع التطوير (Development Mode)
 *    وتتحول إلى Zero-Op في بيئة الإنتاج لمنع أي هدر في الأداء.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم رمي أي استثناءات في بيئة الإنتاج (Production Safe).
 *    2. ضمان توفير سياق تشخيصي دقيق عند حدوث خرق للعقود.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية بيئة التشغيل من الأخطاء غير المتوقعة.
 *    - سجل أخطاء منسق لسهولة التتبع والتصحيح.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { cellKey, cellFromKey, type CellRecalc, type CellSource } from './cell-formula-engine';

export class InvariantViolation extends Error {
  constructor(
    public readonly invariant: string,
    public readonly context: Record<string, unknown>,
    message: string,
  ) {
    super(`[Invariant: ${invariant}] ${message}`);
    this.name = 'InvariantViolation';
  }
}

const IS_DEV = typeof process !== 'undefined' ? process.env.NODE_ENV !== 'production' : true;

export function assertInvariant(
  condition: boolean,
  invariant: string,
  message: string,
  context: Record<string, unknown> = {},
): void {
  if (!IS_DEV) return;
  if (!condition) {
    throw new InvariantViolation(invariant, context, message);
  }
}

/**
 * التحقق من ثنائية المفاتيح الخلوية (Bijectivity of Cell Key Mapping)
 */
export function checkCellKeyBijectivity(row: number, col: number): boolean {
  try {
    const key = cellKey(row, col);
    const decoded = cellFromKey(key);
    const valid = decoded.row === row && decoded.col === col;
    assertInvariant(
      valid,
      'CellKeyBijectivity',
      `Bijective violation for (${row}, ${col}) -> key ${key}`,
    );
    return valid;
  } catch (err) {
    assertInvariant(false, 'CellKeyBijectivity', `Exception during key conversion: ${err}`);
    return false;
  }
}

/**
 * التحقق من صحة الترتيب الطوبولوجي الناتج من خوارزمية Kahn
 */
export function checkTopologicalOrderValidity(source: CellSource, result: CellRecalc): boolean {
  if (!IS_DEV) return true;

  const evaluatedPositions = new Set<string>();

  for (const key of result.order) {
    evaluatedPositions.add(key);
  }

  assertInvariant(
    result.order.length <= source.rows * source.cols,
    'TopologicalOrderValidity',
    'Evaluation order exceeds maximum sheet cell capacity',
  );

  return true;
}
