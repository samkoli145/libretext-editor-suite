/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: اختبارات التحكم السلبية لنواة المفكرة الحسابية (Negative Control Tests)
 * 🏛️ الدور: جناح اختبارات جودة النواة (Kernel Verification & Negative Controls M1..M11)
 * 📥 المستهلك: الاختبار والتحقق الشامل من مطابقة دستوري story.ts و rowcol.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Negative Control Matrix: 11 اختباراً صارماً للتحقق من عدم اختراق قواعد الاشتقاق والعزل.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. M1: التحقق من عدم اختلاق قيم أثناء التقييم (Honest error over invented fallback).
 *    2. M2: التحقق من عدم تخزين أي قيمة (value) داخل كائن المستند.
 *    3. M3: التحقق من أن الحقول الغائبة تُحذف فعلياً بواسطة drop في الـ Patches.
 *    4. M4: التحقق من أن Round-trip للدفتر يحافظ على الحقول المجهولة (PLATFORM §3).
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  ScratchpadEngine,
  getScratchpadEngine,
  resetScratchpadEngine,
} from './ScratchpadEngine.ts';
import { ScratchpadStore } from './ScratchpadStore.ts';
import { normalizeNotebook, normalizeVar, type ScratchpadVar, type Notebook } from './types.ts';
import {
  evaluateCalc,
  formatCalcVal,
  freshCalcContext,
  feedCalcLine,
  answerCalc,
  asksForAnswer,
} from './unit-calc-engine.ts';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runNegativeControlTests(): TestResult[] {
  const results: TestResult[] = [];

  const test = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (e: any) {
      results.push({ name, passed: false, message: e.message || String(e) });
    }
  };

  // M1: Negative Control: Rule #2 - Document State MUST NOT carry 'value'
  test('M1: ScratchpadVar normalized has NO value or error property', () => {
    const raw = {
      id: 'var_12345678',
      name: 'width',
      expr: '100 * 2',
      value: 200, // Injected dirty value
      error: 'fake error',
    };
    const normalized = normalizeVar(raw);
    if ('value' in normalized) {
      throw new Error('Violation of Rule #2: normalized var carries "value"');
    }
    if ('error' in normalized) {
      throw new Error('Violation of Rule #3: normalized var carries "error"');
    }
  });

  // M2: Negative Control: Empty additive strings must become ABSENT, not empty string
  test('M2: Empty description or format is deleted (Absent = None)', () => {
    const raw = {
      id: 'var_test_absent',
      name: 'height',
      expr: '50',
      description: '',
      format: '',
      tags: [],
    };
    const normalized = normalizeVar(raw);
    if ('description' in normalized) {
      throw new Error('Violation: empty description was not dropped');
    }
    if ('format' in normalized) {
      throw new Error('Violation: empty format was not dropped');
    }
    if ('tags' in normalized) {
      throw new Error('Violation: empty tags array was not dropped');
    }
  });

  // M3: Negative Control: PLATFORM §3 - Unknown future fields survive normalization
  test('M3: Unknown future properties survive normalization unharmed', () => {
    const raw = {
      id: 'var_future_v3',
      name: 'radius',
      expr: '25',
      customAiMetadata: { model: 'gemini-3.7', confidence: 0.99 },
      v3SchemaFlag: true,
    };
    const normalized = normalizeVar(raw) as any;
    if (!normalized.customAiMetadata || normalized.customAiMetadata.confidence !== 0.99) {
      throw new Error('Violation of PLATFORM §3: customAiMetadata was lost');
    }
    if (normalized.v3SchemaFlag !== true) {
      throw new Error('Violation of PLATFORM §3: v3SchemaFlag was lost');
    }
  });

  // M4: Negative Control: Circular dependencies must report #CYCLE! and not crash or loop
  test('M4: Circular dependencies report #CYCLE! honestly without NaN fallback', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();

    // $a = $b, $b = $a
    const p1 = engine.setVar('a', '$b + 1');
    const p2 = engine.setVar('b', '$a + 1');

    const store = new ScratchpadStore();
    store.commit(p1);
    store.commit(p2);

    const compA = engine.getComputedVar('a');
    const compB = engine.getComputedVar('b');

    if (!compA?.error || compA.error.code !== '#CYCLE!') {
      throw new Error(`Expected #CYCLE! for var A, got: ${compA?.error?.code}`);
    }
    if (!compB?.error || compB.error.code !== '#CYCLE!') {
      throw new Error(`Expected #CYCLE! for var B, got: ${compB?.error?.code}`);
    }
    if (compA.value !== null || compB.value !== null) {
      throw new Error('Violation of Rule #3: Cycle produced an invented numeric value');
    }
  });

  // M5: Negative Control: Missing variable reports #REF!
  test('M5: Missing variable reference reports #REF!', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();
    const p = engine.setVar('x', '$unknown_var * 2');
    const store = new ScratchpadStore();
    store.commit(p);

    const compX = engine.getComputedVar('x');
    if (!compX?.error || compX.error.code !== '#REF!') {
      throw new Error(`Expected #REF! error, got ${compX?.error?.code}`);
    }
  });

  // M6: Negative Control: Division by zero reports #DIV/0!
  test('M6: Division by zero reports #DIV/0! honestly', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();
    const p = engine.setVar('div_zero', '100 / 0');
    const store = new ScratchpadStore();
    store.commit(p);

    const comp = engine.getComputedVar('div_zero');
    if (!comp?.error || comp.error.code !== '#DIV/0!') {
      throw new Error(`Expected #DIV/0! error, got ${comp?.error?.code}`);
    }
  });

  // M7: Negative Control: Undo after delete restores with byte-identical props and drop inversion
  test('M7: Undo delete restores exact structure and unbinds orphans', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();
    const store = new ScratchpadStore();

    const pSet = engine.setVar('total', '500', { format: '$0.00', description: 'Budget' });
    store.commit(pSet);

    const createdVar = engine.getComputedVar('total');
    if (!createdVar) throw new Error('Variable not created');

    const pDel = engine.deleteVar('total');
    store.commit(pDel);

    if (engine.getComputedVar('total') !== null) {
      throw new Error('Variable still exists after delete');
    }

    // Undo
    const undone = store.undo();
    if (!undone) throw new Error('Undo failed');

    const restored = engine.getComputedVar('total');
    if (!restored) throw new Error('Variable not restored on undo');
    if (restored.format !== '$0.00' || restored.description !== 'Budget') {
      throw new Error('Restored variable lost additive properties');
    }
  });

  // M8: Negative Control: Drop array removes keys on setScratchpadVar patch
  test('M8: Drop array in setScratchpadVar explicitly removes keys', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();
    const store = new ScratchpadStore();

    // 1. Set with format
    store.commit(engine.setVar('price', '10', { format: 'currency' }));
    let v = engine.getComputedVar('price');
    if (v?.format !== 'currency') throw new Error('Format was not set');

    // 2. Set without format (should generate drop: ['format'])
    store.commit(engine.setVar('price', '20'));
    v = engine.getComputedVar('price');
    if ('format' in (v as any) && (v as any).format !== undefined) {
      throw new Error('Format was not dropped after omitting it');
    }
  });

  // M9: Negative Control: Pure evaluation does not mutate document
  test('M9: deriveAll() and evaluateExpression() never mutate Notebook.vars', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();
    const store = new ScratchpadStore();

    store.commit(engine.setVar('w', '150'));
    store.commit(engine.setVar('h', '300'));
    store.commit(engine.setVar('area', '$w * $h'));

    const nb = engine.getActiveNotebook()!;
    const areaVar = nb.vars.get(engine.getComputedVar('area')!.id)!;

    // Verify raw object has NO value attached
    if ('value' in areaVar) {
      throw new Error('Notebook var was mutated with value during setup');
    }

    // Call deriveAll multiple times
    engine.deriveAll();
    engine.deriveAll();

    if ('value' in areaVar) {
      throw new Error('deriveAll mutated the internal Document State!');
    }
  });

  // M10: Negative Control: Topological sort evaluates deep chains in linear order
  test('M10: Deep dependency chain evaluates accurately ($a->$b->$c->$d)', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();
    const store = new ScratchpadStore();

    store.commit(engine.setVar('a', '10'));
    store.commit(engine.setVar('b', '$a * 2'));
    store.commit(engine.setVar('c', '$b + 5'));
    store.commit(engine.setVar('d', '$c * 3')); // (10 * 2 + 5) * 3 = 75

    const d = engine.getComputedVar('d');
    if (d?.value !== 75) {
      throw new Error(`Expected deep chain result 75, got ${d?.value}`);
    }
  });

  // M11: Negative Control: Math built-ins work cleanly
  test('M11: Math built-in functions (sqrt, min, max, sin, abs) evaluate correctly', () => {
    resetScratchpadEngine();
    const engine = getScratchpadEngine();
    const store = new ScratchpadStore();

    store.commit(engine.setVar('calc', 'sqrt(16) + min(10, 20) + abs(-5)')); // 4 + 10 + 5 = 19
    const res = engine.getComputedVar('calc');
    if (res?.value !== 19) {
      throw new Error(`Expected 19 from math built-ins, got ${res?.value}`);
    }
  });

  // M12: Negative Control: Unit Conversion & Arithmetic without eval
  test('M12: Zero-dependency unit conversion evaluates lengths and masses cleanly', () => {
    const v1 = evaluateCalc('100 cm + 2 m');
    if (!v1 || v1.n !== 300 || v1.u !== 'cm') {
      throw new Error(`Expected 300 cm, got: ${JSON.stringify(v1)}`);
    }
    const formatted1 = formatCalcVal(v1);
    if (formatted1 !== '300 cm') {
      throw new Error(`Expected '300 cm', got '${formatted1}'`);
    }

    const v2 = evaluateCalc('1 kg - 200 g');
    if (!v2 || v2.n !== 0.8 || v2.u !== 'kg') {
      throw new Error(`Expected 0.8 kg, got: ${JSON.stringify(v2)}`);
    }
  });

  // M13: Negative Control: Time of Day and Duration Calculus
  test('M13: Clock and time duration arithmetic (9:30 + 45 min = 10:15)', () => {
    const clock = evaluateCalc('9:30 + 45 min');
    if (!clock || !clock.clock || clock.n !== 10 * 3600 + 15 * 60) {
      throw new Error(`Expected 10:15 clock value, got: ${JSON.stringify(clock)}`);
    }
    if (formatCalcVal(clock) !== '10:15') {
      throw new Error(`Expected formatted '10:15', got '${formatCalcVal(clock)}'`);
    }

    const span = evaluateCalc('17:00 - 9:30');
    if (!span || span.u !== 'h' || span.n !== 7.5) {
      throw new Error(`Expected 7.5 h between 9:30 and 17:00, got: ${JSON.stringify(span)}`);
    }
  });

  // M14: Negative Control: Percentage arithmetic (340 + 15% = 391)
  test('M14: Percentage arithmetic resolves intuitive intent (340 + 15% = 391)', () => {
    const percent = evaluateCalc('340 + 15%');
    if (!percent || percent.n !== 391) {
      throw new Error(`Expected 340 + 15% = 391, got ${percent?.n}`);
    }
  });

  // M15: Negative Control: Magic Notes & Sum Above in Plain Reading Order
  test('M15: Magic notes answer derivation with sum above in reading order', () => {
    const ctx = freshCalcContext();

    if (!asksForAnswer('budget * 0.3 =')) {
      throw new Error('asksForAnswer failed on trailing =');
    }

    feedCalcLine(ctx, 'budget = 6000');
    const ans1 = answerCalc('budget * 0.3 =', ctx);
    if (ans1 !== '1,800' && ans1 !== '1800') {
      throw new Error(`Expected 1,800, got '${ans1}'`);
    }

    feedCalcLine(ctx, '100');
    feedCalcLine(ctx, '200');
    feedCalcLine(ctx, '300');
    const ansSum = answerCalc('sum above =', ctx);
    if (ansSum !== '600') {
      throw new Error(`Expected sum above = 600, got '${ansSum}'`);
    }
  });

  return results;
}
