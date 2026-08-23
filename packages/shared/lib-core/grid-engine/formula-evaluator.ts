/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: تقييم وحساب الصيغ الرياضية والمنطقية للجداول (Spreadsheet Formula Evaluator)
 * 🏛️ الدور: محرك حسابي معزول (Zero-Dependency Math & Logic Engine)
 * 📥 المستهلك: cell-formula-engine, grid-core
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive Descent Tokenizer & Function Dispatcher
 *    محلل نحوي تراجعي خفيف الوزن يقيّم الدوال الحسابية والمنطقية والنصية بأمان تام.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع القسمة على صفر وإرجاع `#DIV/0!`.
 *    2. معالجة القيم غير المعرفة والأخطاء الممررة (#VALUE!, #NAME!, #REF!).
 *    3. عدم استخدام `eval()` أو `Function()` لمنع الثغرات الأمنية نهائياً.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التعامل الآمن مع الأخطاء عبر كائن FormulaError.
 *    - تحويل الأنواع السلس بين الأرقام والنصوص والقيم المنطقية.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { FormulaError, type Cell, type CellValue } from './types';

export interface EvalContext {
  resolveVar: (name: string) => Cell | Cell[];
  now?: Date;
}

/**
 * دالة مساعدة لتحويل أي قيمة إلى رقم بأمان
 */
export function toNumber(val: Cell): number {
  if (val instanceof FormulaError) throw val;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (val === null || val === undefined || val === '') return 0;
  const num = Number(val);
  if (isNaN(num)) {
    throw new FormulaError('#VALUE!', `Cannot convert "${String(val)}" to number`);
  }
  return num;
}

/**
 * تسطيح المصفوفات والمراجع لحسابات التجميع مثل SUM, AVERAGE
 */
export function flattenCells(args: Array<Cell | Cell[]>): Cell[] {
  const result: Cell[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...flattenCells(arg));
    } else {
      result.push(arg);
    }
  }
  return result;
}

// مكتبة الدوال المدمجة القياسية
const BUILTIN_FUNCTIONS: Record<string, (args: Array<Cell | Cell[]>, ctx: EvalContext) => Cell> = {
  SUM: (args) => {
    const flat = flattenCells(args);
    let total = 0;
    for (const c of flat) {
      if (typeof c === 'number') total += c;
      else if (typeof c === 'string' && c.trim() !== '') {
        const n = Number(c);
        if (!isNaN(n)) total += n;
      }
    }
    return total;
  },

  AVERAGE: (args) => {
    const flat = flattenCells(args).filter(
      (c) =>
        typeof c === 'number' || (typeof c === 'string' && !isNaN(Number(c)) && c.trim() !== ''),
    );
    if (flat.length === 0) return new FormulaError('#DIV/0!', 'Average of empty set');
    const sum = flat.reduce<number>((acc, c) => acc + toNumber(c), 0);
    return sum / flat.length;
  },

  COUNT: (args) => {
    const flat = flattenCells(args);
    return flat.filter(
      (c) =>
        typeof c === 'number' || (typeof c === 'string' && !isNaN(Number(c)) && c.trim() !== ''),
    ).length;
  },

  COUNTA: (args) => {
    const flat = flattenCells(args);
    return flat.filter((c) => c !== null && c !== undefined && c !== '').length;
  },

  MIN: (args) => {
    const flat = flattenCells(args)
      .map((c) => {
        try {
          return toNumber(c);
        } catch {
          return null;
        }
      })
      .filter((n): n is number => n !== null);
    if (flat.length === 0) return 0;
    return Math.min(...flat);
  },

  MAX: (args) => {
    const flat = flattenCells(args)
      .map((c) => {
        try {
          return toNumber(c);
        } catch {
          return null;
        }
      })
      .filter((n): n is number => n !== null);
    if (flat.length === 0) return 0;
    return Math.max(...flat);
  },

  PRODUCT: (args) => {
    const flat = flattenCells(args);
    if (flat.length === 0) return 0;
    let prod = 1;
    for (const c of flat) {
      if (typeof c === 'number') prod *= c;
    }
    return prod;
  },

  ROUND: (args) => {
    const flat = flattenCells(args);
    const val = toNumber(flat[0]);
    const digits = flat[1] !== undefined ? toNumber(flat[1]) : 0;
    const factor = Math.pow(10, digits);
    return Math.round(val * factor) / factor;
  },

  FLOOR: (args) => {
    const flat = flattenCells(args);
    const val = toNumber(flat[0]);
    return Math.floor(val);
  },

  CEIL: (args) => {
    const flat = flattenCells(args);
    const val = toNumber(flat[0]);
    return Math.ceil(val);
  },

  ABS: (args) => {
    const flat = flattenCells(args);
    return Math.abs(toNumber(flat[0]));
  },

  SQRT: (args) => {
    const flat = flattenCells(args);
    const val = toNumber(flat[0]);
    if (val < 0) return new FormulaError('#NUM!', 'Square root of negative number');
    return Math.sqrt(val);
  },

  POWER: (args) => {
    const flat = flattenCells(args);
    return Math.pow(toNumber(flat[0]), toNumber(flat[1]));
  },

  MOD: (args) => {
    const flat = flattenCells(args);
    const divisor = toNumber(flat[1]);
    if (divisor === 0) return new FormulaError('#DIV/0!');
    return toNumber(flat[0]) % divisor;
  },

  IF: (args) => {
    const condition = args[0];
    const isTrue = Array.isArray(condition) ? Boolean(condition[0]) : Boolean(condition);
    if (isTrue) {
      const v = args[1];
      return Array.isArray(v) ? v[0] : (v ?? true);
    } else {
      const v = args[2];
      return Array.isArray(v) ? v[0] : (v ?? false);
    }
  },

  AND: (args) => {
    const flat = flattenCells(args);
    return flat.every((c) => Boolean(c));
  },

  OR: (args) => {
    const flat = flattenCells(args);
    return flat.some((c) => Boolean(c));
  },

  NOT: (args) => {
    const flat = flattenCells(args);
    return !Boolean(flat[0]);
  },

  CONCAT: (args) => {
    const flat = flattenCells(args);
    return flat.map((c) => (c === null || c === undefined ? '' : String(c))).join('');
  },

  CONCATENATE: (args) => {
    const flat = flattenCells(args);
    return flat.map((c) => (c === null || c === undefined ? '' : String(c))).join('');
  },

  LEN: (args) => {
    const flat = flattenCells(args);
    return String(flat[0] ?? '').length;
  },

  UPPER: (args) => {
    const flat = flattenCells(args);
    return String(flat[0] ?? '').toUpperCase();
  },

  LOWER: (args) => {
    const flat = flattenCells(args);
    return String(flat[0] ?? '').toLowerCase();
  },

  TRIM: (args) => {
    const flat = flattenCells(args);
    return String(flat[0] ?? '').trim();
  },

  NOW: (_args, ctx) => {
    return (ctx.now ?? new Date()).toISOString();
  },

  TODAY: (_args, ctx) => {
    return (ctx.now ?? new Date()).toISOString().split('T')[0];
  },
};

/**
 * محلل نحوي تعبيري خفيف وسريع (Lightweight Recursive Descent Expression Parser)
 */
export function evaluateExpression(expr: string, ctx: EvalContext): Cell {
  let pos = 0;
  const str = expr.trim();

  function peek(): string {
    while (pos < str.length && str[pos] === ' ') pos++;
    return str[pos] || '';
  }

  function consume(): string {
    while (pos < str.length && str[pos] === ' ') pos++;
    return str[pos++] || '';
  }

  function parseExpression(): Cell {
    let left = parseComparison();
    while (true) {
      const next = peek();
      if (next === '&') {
        consume();
        const right = parseComparison();
        left = String(left ?? '') + String(right ?? '');
      } else {
        break;
      }
    }
    return left;
  }

  function parseComparison(): Cell {
    let left = parseAdditive();
    while (true) {
      const next2 = str.slice(pos, pos + 2);
      if (next2 === '<=' || next2 === '>=' || next2 === '<>') {
        pos += 2;
        const right = parseAdditive();
        if (next2 === '<=') left = toNumber(left) <= toNumber(right);
        else if (next2 === '>=') left = toNumber(left) >= toNumber(right);
        else if (next2 === '<>') left = left !== right;
        continue;
      }

      const next1 = peek();
      if (next1 === '=' || next1 === '<' || next1 === '>') {
        consume();
        const right = parseAdditive();
        if (next1 === '=') left = left === right;
        else if (next1 === '<') left = toNumber(left) < toNumber(right);
        else if (next1 === '>') left = toNumber(left) > toNumber(right);
        continue;
      }
      break;
    }
    return left;
  }

  function parseAdditive(): Cell {
    let left = parseMultiplicative();
    while (true) {
      const op = peek();
      if (op === '+' || op === '-') {
        consume();
        const right = parseMultiplicative();
        const n1 = toNumber(left);
        const n2 = toNumber(right);
        left = op === '+' ? n1 + n2 : n1 - n2;
      } else {
        break;
      }
    }
    return left;
  }

  function parseMultiplicative(): Cell {
    let left = parseUnary();
    while (true) {
      const op = peek();
      if (op === '*' || op === '/') {
        consume();
        const right = parseUnary();
        const n1 = toNumber(left);
        const n2 = toNumber(right);
        if (op === '/') {
          if (n2 === 0) throw new FormulaError('#DIV/0!', 'Division by zero');
          left = n1 / n2;
        } else {
          left = n1 * n2;
        }
      } else if (op === '^') {
        consume();
        const right = parseUnary();
        left = Math.pow(toNumber(left), toNumber(right));
      } else {
        break;
      }
    }
    return left;
  }

  function parseUnary(): Cell {
    const op = peek();
    if (op === '-') {
      consume();
      return -toNumber(parseUnary());
    }
    if (op === '+') {
      consume();
      return toNumber(parseUnary());
    }
    return parsePrimary();
  }

  function parsePrimary(): Cell {
    const char = peek();

    // نصوص محاطة بعلامات تنصيص "..."
    if (char === '"' || char === "'") {
      const quote = consume();
      let text = '';
      while (pos < str.length && str[pos] !== quote) {
        text += str[pos++];
      }
      if (pos < str.length && str[pos] === quote) pos++;
      return text;
    }

    // أرقام
    if ((char >= '0' && char <= '9') || char === '.') {
      let numStr = '';
      while (pos < str.length && ((str[pos] >= '0' && str[pos] <= '9') || str[pos] === '.')) {
        numStr += str[pos++];
      }
      return parseFloat(numStr);
    }

    // أقواس ( ... )
    if (char === '(') {
      consume();
      const val = parseExpression();
      if (peek() === ')') consume();
      return val;
    }

    // دوال أو متغيرات / مراجع
    if (
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      char === '_' ||
      char === '$'
    ) {
      let identifier = '';
      while (
        pos < str.length &&
        ((str[pos] >= 'a' && str[pos] <= 'z') ||
          (str[pos] >= 'A' && str[pos] <= 'Z') ||
          (str[pos] >= '0' && str[pos] <= '9') ||
          str[pos] === '_' ||
          str[pos] === '$')
      ) {
        identifier += str[pos++];
      }

      // استدعاء دالة: Identifier(...)
      if (peek() === '(') {
        consume();
        const args: Array<Cell | Cell[]> = [];
        if (peek() !== ')') {
          while (true) {
            args.push(parseExpression());
            if (peek() === ',') {
              consume();
            } else {
              break;
            }
          }
        }
        if (peek() === ')') consume();

        const fnName = identifier.toUpperCase();
        const fn = BUILTIN_FUNCTIONS[fnName];
        if (!fn) {
          throw new FormulaError('#NAME?', `Unknown function: ${identifier}`);
        }
        return fn(args, ctx);
      }

      // متغير أو قيمة من السياق
      if (identifier.toUpperCase() === 'TRUE') return true;
      if (identifier.toUpperCase() === 'FALSE') return false;

      const resolved = ctx.resolveVar(identifier);
      if (Array.isArray(resolved)) {
        return resolved[0] ?? null;
      }
      return resolved;
    }

    if (char === '') return null;
    throw new FormulaError('#ERROR!', `Unexpected character "${char}" at position ${pos}`);
  }

  try {
    return parseExpression();
  } catch (err) {
    if (err instanceof FormulaError) return err;
    return new FormulaError('#ERROR!', String(err));
  }
}
