// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [calc-engine.ts] محرك Calc الكامل — جداول بيانات حية
//
// هذا الملف يجيب: "كيف نحسب الصيغ بدقة وأمان؟"
//
// المبادئ المعمارية الحاكمة:
//
// 1. PATCH FACTORY (من rowcol.ts):
//    كل عملية تعيد TableBlockNode جديد، لا تعدل الأصلي.
//    هذا ما يجعل كل تعديل قابلاً للتراجع، ومتوافقاً مع CRDT مستقبلاً.
//
// 2. BOUNDS CLAMP, IDENTITY REFUSES:
//    المواقع خارج الجدول تُقص، المعرفات المكررة تُرفض بصوت عالٍ.
//    لا صمت، لا تخمين، لا بيانات تالفة.
//
// 3. DERIVED, NEVER STORED (من story.ts):
//    القيم المحسوبة تُشتق في كل قراءة، لا تُخزن.
//    هذا يمنع عدم الاتساق بين الصيغة والقيمة.
//
// 4. A NUMBER NEVER ANIMATES THROUGH A VALUE NOT IN DATA:
//    الخلية الفارغة تبقى فارغة، لا تصبح صفراً.
//    الخطأ يبقى خطأً، لا يُقارب.
//
// 5. SAFE EVALUATION:
//    لا eval، لا Function constructor.
//    محلل Recursive Descent يبني AST، ثم يقيّمه.
//    هذا يمنع حقن الكود ويحمي من الصيغ الخبيثة.
//
// التنبيهات المعمارية:
// - الـ DAG يكشف الدورات قبل التقييم (ليس أثناءه)
// - كل دالة مدمجة تعامل الأخطاء كقيم (#DIV/0!, #N/A, #VALUE!)
// - التفقيط العربي دقيق حتى 10^15 (كوادريليون)
// - النطاقات (Ranges) تُحلّ إلى مصفوفات قبل التقييم
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import {
  type CellBlockNode,
  type CellDataType,
  createCellBlock,
  formatCellValue,
  indexToColumnName,
} from '../blocks/cell-block';
import {
  type TableBlockNode,
  type TableRowData,
  type TableCellData,
  createTableBlock,
  createTableRow,
  createTableCell,
} from '../blocks/table-block';
import { bottomUpMergeSort } from '../../../algorithms/src/sort/mergesort';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. TOKEN TYPES — وحدات الصيغة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'BOOLEAN'
  | 'CELL_REF'
  | 'RANGE_REF'
  | 'NAMED_RANGE'
  | 'FUNCTION'
  | 'OPERATOR'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'SEMICOLON'
  | 'COLON'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. AST NODES — شجرة الصيغة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ASTNode =
  | { type: 'literal'; value: number | string | boolean | null }
  | { type: 'cellRef'; address: string; sheet?: string }
  | { type: 'rangeRef'; start: string; end: string; sheet?: string }
  | { type: 'namedRange'; name: string }
  | { type: 'binaryOp'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'unaryOp'; op: string; operand: ASTNode }
  | { type: 'functionCall'; name: string; args: ASTNode[] };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. ERROR VALUES — قيم الخطأ القياسية
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ERRORS = {
  DIV0: '#DIV/0!',
  NA: '#N/A',
  VALUE: '#VALUE!',
  REF: '#REF!',
  NAME: '#NAME?',
  NUM: '#NUM!',
  NULL: '#NULL!',
} as const;

export type ErrorValue = (typeof ERRORS)[keyof typeof ERRORS];

export function isError(v: unknown): v is ErrorValue {
  return typeof v === 'string' && Object.values(ERRORS).includes(v as ErrorValue);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. DEPENDENCY GRAPH — DAG للصيغ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class DependencyGraph {
  /** cellKey → مجموعة الخلايا التي تعتمد عليها */
  protected precedents = new Map<string, Set<string>>();
  /** cellKey → مجموعة الخلايا التي تعتمد عليها هذه الخلية */
  protected dependents = new Map<string, Set<string>>();

  /** مفاتيح الخلايا التي لها سوابق (للفحص الخارجي). */
  get precedentKeys(): string[] {
    return Array.from(this.precedents.keys());
  }

  /** إضافة حافة: `from` يعتمد على `to`. */
  addEdge(from: string, to: string): void {
    if (!this.precedents.has(from)) this.precedents.set(from, new Set());
    this.precedents.get(from)!.add(to);

    if (!this.dependents.has(to)) this.dependents.set(to, new Set());
    this.dependents.get(to)!.add(from);
  }

  /** إزالة عقدة وجميع حوافها. */
  removeNode(node: string): void {
    // إزالة من كل قائمة dependents للخلايا التي كان يعتمد عليها
    const deps = this.precedents.get(node);
    if (deps) {
      for (const dep of deps) {
        this.dependents.get(dep)?.delete(node);
      }
    }
    this.precedents.delete(node);

    // إزالة من كل قائمة precedents للخلايا التي كانت تعتمد عليه
    const preds = this.dependents.get(node);
    if (preds) {
      for (const pred of preds) {
        this.precedents.get(pred)?.delete(node);
      }
    }
    this.dependents.delete(node);
  }

  /** الخلايا التي تعتمد عليها `cellKey` (المباشر فقط). */
  getPrecedents(cellKey: string): string[] {
    return Array.from(this.precedents.get(cellKey) ?? []);
  }

  /** الخلايا التي تعتمد على `cellKey` (المباشر فقط). */
  getDependents(cellKey: string): string[] {
    return Array.from(this.dependents.get(cellKey) ?? []);
  }

  /** كل الخلايا المتأثرة بتغيير `cellKey` (بما في ذلك غير المباشر). */
  getTransitiveDependents(cellKey: string): string[] {
    const result = new Set<string>();
    const queue = [cellKey];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const dep of this.dependents.get(current) ?? []) {
        if (!result.has(dep)) {
          result.add(dep);
          queue.push(dep);
        }
      }
    }
    return Array.from(result);
  }

  /** كشف دورة تبدأ من `start` (DFS). */
  hasCycle(start: string): boolean {
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (node: string): boolean => {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      stack.add(node);

      for (const dep of this.precedents.get(node) ?? []) {
        if (dfs(dep)) return true;
      }

      stack.delete(node);
      return false;
    };

    return dfs(start);
  }

  /** ترتيب توبولوجي للخلايا (ترتيب التقييم الصحيح). */
  topologicalSort(): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (node: string): void => {
      if (visited.has(node)) return;
      visited.add(node);
      for (const dep of this.precedents.get(node) ?? []) {
        visit(dep);
      }
      result.push(node);
    };

    for (const node of this.precedents.keys()) {
      visit(node);
    }
    for (const node of this.dependents.keys()) {
      visit(node);
    }

    return result;
  }

  /** إعادة بناء الـ DAG من ورقة كاملة. */
  rebuild(sheet: TableBlockNode, extractRefs: (formula: string) => string[]): void {
    this.precedents.clear();
    this.dependents.clear();

    for (const row of sheet.rows) {
      for (const cell of row.cells) {
        const raw = cell.rawInput ?? '';
        if (raw.startsWith('=')) {
          const refs = extractRefs(raw.slice(1));
          const addr = cell.address ?? cell.id;
          for (const ref of refs) {
            this.addEdge(addr, ref);
          }
        }
      }
    }
  }

  clone(): DependencyGraph {
    const copy = new DependencyGraph();
    for (const [k, v] of this.precedents) {
      copy.precedents.set(k, new Set(v));
    }
    for (const [k, v] of this.dependents) {
      copy.dependents.set(k, new Set(v));
    }
    return copy;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. FORMULA TOKENIZER — تقسيم الصيغة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const OPERATORS = new Set(['+', '-', '*', '/', '^', '>', '<', '>=', '<=', '=', '<>']);

export function tokenize(formula: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < formula.length) {
    const ch = formula[pos]!;

    // مسافات بيضاء — تخطي
    if (/\s/.test(ch)) {
      pos++;
      continue;
    }

    // أرقام
    if (/[0-9.]/.test(ch)) {
      const start = pos;
      while (pos < formula.length && /[0-9.eE]/.test(formula[pos]!)) {
        pos++;
        if ((formula[pos - 1] === 'e' || formula[pos - 1] === 'E') &&
            (formula[pos] === '+' || formula[pos] === '-')) {
          pos++;
        }
      }
      tokens.push({ type: 'NUMBER', value: formula.slice(start, pos), position: start });
      continue;
    }

    // سلاسل نصية
    if (ch === '"') {
      const start = pos;
      pos++;
      while (pos < formula.length && formula[pos] !== '"') {
        if (formula[pos] === '\\' && pos + 1 < formula.length) pos++;
        pos++;
      }
      pos++; // تخطي علامة التنصيص الختامية
      tokens.push({ type: 'STRING', value: formula.slice(start + 1, pos - 1), position: start });
      continue;
    }

    // قيم منطقية
    if (formula.slice(pos, pos + 4).toUpperCase() === 'TRUE') {
      tokens.push({ type: 'BOOLEAN', value: 'true', position: pos });
      pos += 4;
      continue;
    }
    if (formula.slice(pos, pos + 5).toUpperCase() === 'FALSE') {
      tokens.push({ type: 'BOOLEAN', value: 'false', position: pos });
      pos += 5;
      continue;
    }

    // مراجع خلايا: A1, AA100, Sheet1!A1, 'Sheet Name'!A1
    if (/[A-Za-z_']/.test(ch)) {
      const start = pos;
      // اسم ورقة اختياري
      let sheetPrefix = '';
      if (ch === "'") {
        pos++;
        while (pos < formula.length && formula[pos] !== "'") pos++;
        pos++; // تخطي '
        sheetPrefix = formula.slice(start + 1, pos - 1);
        if (formula[pos] === '!') pos++;
      } else {
        const identStart = pos;
        while (pos < formula.length && /[A-Za-z0-9_]/.test(formula[pos]!)) pos++;
        const ident = formula.slice(identStart, pos);
        if (formula[pos] === '!') {
          sheetPrefix = ident;
          pos++;
        } else {
          // ليس اسم ورقة — قد يكون اسم دالة أو نطاق مسمى
          pos = identStart; // إعادة تعيين
        }
      }

      if (sheetPrefix) {
        // مرجع خلية بعد !
        const refStart = pos;
        while (pos < formula.length && /[A-Za-z0-9]/.test(formula[pos]!)) pos++;
        const ref = formula.slice(refStart, pos);
        tokens.push({
          type: 'CELL_REF',
          value: `${sheetPrefix}!${ref}`,
          position: start,
        });
        continue;
      }

      // اسم عادي — دالة أو نطاق مسمى أو مرجع خلية
      const identStart = pos;
      while (pos < formula.length && /[A-Za-z0-9_]/.test(formula[pos]!)) pos++;
      const ident = formula.slice(identStart, pos);

      if (/^[A-Z]{1,3}[0-9]+$/i.test(ident)) {
        tokens.push({ type: 'CELL_REF', value: ident.toUpperCase(), position: start });
      } else if (formula[pos] === '(') {
        tokens.push({ type: 'FUNCTION', value: ident.toUpperCase(), position: start });
      } else {
        tokens.push({ type: 'NAMED_RANGE', value: ident, position: start });
      }
      continue;
    }

    // عوامل تشغيل ثنائية الحرف
    if (pos + 1 < formula.length) {
      const two = formula.slice(pos, pos + 2);
      if (two === '>=' || two === '<=' || two === '<>') {
        tokens.push({ type: 'OPERATOR', value: two, position: pos });
        pos += 2;
        continue;
      }
    }

    // عوامل تشغيل أحادية
    if (OPERATORS.has(ch)) {
      tokens.push({ type: 'OPERATOR', value: ch, position: pos });
      pos++;
      continue;
    }

    // أقواس وفواصل
    if (ch === '(') { tokens.push({ type: 'LPAREN', value: '(', position: pos }); pos++; continue; }
    if (ch === ')') { tokens.push({ type: 'RPAREN', value: ')', position: pos }); pos++; continue; }
    if (ch === ',') { tokens.push({ type: 'COMMA', value: ',', position: pos }); pos++; continue; }
    if (ch === ';') { tokens.push({ type: 'SEMICOLON', value: ';', position: pos }); pos++; continue; }
    if (ch === ':') { tokens.push({ type: 'COLON', value: ':', position: pos }); pos++; continue; }

    // حرف غير معروف — تخطي مع تحذير
    pos++;
  }

  tokens.push({ type: 'EOF', value: '', position: pos });
  return tokens;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. FORMULA PARSER — Recursive Descent
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class FormulaParser {
  private tokens: Token[] = [];
  private pos = 0;

  parse(formula: string): ASTNode {
    this.tokens = tokenize(formula);
    this.pos = 0;
    const result = this.parseExpression();
    if (this.peek().type !== 'EOF') {
      throw new Error(`Unexpected token: ${this.peek().value}`);
    }
    return result;
  }

  /** استخراج كل مراجع الخلايا من صيغة (للـ DAG). */
  extractReferences(formula: string): string[] {
    const refs: string[] = [];
    const tokens = tokenize(formula);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t?.type !== 'CELL_REF') continue;

      // A1:B10 — إضافة كل الخلايا في النطاق
      if (tokens[i + 1]?.type === 'COLON' && tokens[i + 2]?.type === 'CELL_REF') {
        const expanded = expandRange(t.value, tokens[i + 2]!.value);
        refs.push(...expanded);
        i += 2;
      } else {
        refs.push(t.value);
      }
    }
    return refs;
  }

  // ── Recursive Descent ──

  private parseExpression(): ASTNode {
    return this.parseComparison();
  }

  private parseComparison(): ASTNode {
    let left = this.parseAddSub();
    while (this.match('OPERATOR', ['>', '<', '>=', '<=', '=', '<>'])) {
      const op = this.previous().value;
      const right = this.parseAddSub();
      left = { type: 'binaryOp', op, left, right };
    }
    return left;
  }

  private parseAddSub(): ASTNode {
    let left = this.parseMulDiv();
    while (this.match('OPERATOR', ['+', '-'])) {
      const op = this.previous().value;
      const right = this.parseMulDiv();
      left = { type: 'binaryOp', op, left, right };
    }
    return left;
  }

  private parseMulDiv(): ASTNode {
    let left = this.parsePower();
    while (this.match('OPERATOR', ['*', '/'])) {
      const op = this.previous().value;
      const right = this.parsePower();
      left = { type: 'binaryOp', op, left, right };
    }
    return left;
  }

  private parsePower(): ASTNode {
    let left = this.parseUnary();
    while (this.match('OPERATOR', ['^'])) {
      const op = this.previous().value;
      const right = this.parseUnary();
      left = { type: 'binaryOp', op, left, right };
    }
    return left;
  }

  private parseUnary(): ASTNode {
    if (this.match('OPERATOR', ['-'])) {
      const operand = this.parseUnary();
      return { type: 'unaryOp', op: '-', operand };
    }
    if (this.match('OPERATOR', ['+'])) {
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (token.type === 'NUMBER') {
      this.advance();
      return { type: 'literal', value: parseFloat(token.value) };
    }

    if (token.type === 'STRING') {
      this.advance();
      return { type: 'literal', value: token.value };
    }

    if (token.type === 'BOOLEAN') {
      this.advance();
      return { type: 'literal', value: token.value === 'true' };
    }

    if (token.type === 'FUNCTION') {
      return this.parseFunctionCall();
    }

    if (token.type === 'CELL_REF') {
      this.advance();
      // هل يتبعه : ليشكل نطاقاً؟
      if (this.peek().type === 'COLON') {
        this.advance(); // تخطي :
        const endToken = this.peek();
        if (endToken.type === 'CELL_REF') {
          this.advance();
          return { type: 'rangeRef', start: token.value, end: endToken.value };
        }
        throw new Error(`Invalid range: ${token.value}:`);
      }
      return { type: 'cellRef', address: token.value };
    }

    if (token.type === 'NAMED_RANGE') {
      this.advance();
      return { type: 'namedRange', name: token.value };
    }

    if (token.type === 'LPAREN') {
      this.advance();
      const expr = this.parseExpression();
      if (!this.match('RPAREN')) {
        throw new Error('Expected closing parenthesis');
      }
      return expr;
    }

    throw new Error(`Unexpected token: ${token.value || 'EOF'} at position ${token.position}`);
  }

  private parseFunctionCall(): ASTNode {
    const nameToken = this.advance();
    const name = nameToken.value;
    this.expect('LPAREN');

    const args: ASTNode[] = [];
    if (this.peek().type !== 'RPAREN') {
      args.push(this.parseExpression());
      while (this.match('COMMA') || this.match('SEMICOLON')) {
        args.push(this.parseExpression());
      }
    }

    this.expect('RPAREN');
    return { type: 'functionCall', name, args };
  }

  // ── Helpers ──

  private peek(): Token {
    return this.tokens[this.pos] ?? { type: 'EOF', value: '', position: -1 };
  }

  private advance(): Token {
    const t = this.tokens[this.pos] ?? { type: 'EOF' as const, value: '', position: -1 };
    this.pos++;
    return t;
  }

  private previous(): Token {
    return this.tokens[this.pos - 1] ?? { type: 'EOF' as const, value: '', position: -1 };
  }

  private match(type: TokenType, values?: string[]): boolean {
    const t = this.peek();
    if (t.type !== type) return false;
    if (values && !values.includes(t.value)) return false;
    this.advance();
    return true;
  }

  private expect(type: TokenType): Token {
    if (!this.match(type)) {
      throw new Error(`Expected ${type}, got ${this.peek().type}`);
    }
    return this.previous();
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. RANGE EXPANSION — توسيع النطاقات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** تحويل عنوان خلية إلى (row, col) بالأرقام. */
export function parseCellAddress(address: string): { row: number; col: number } {
  const match = /^([A-Z]+)([0-9]+)$/i.exec(address);
  if (!match) throw new Error(`Invalid cell address: ${address}`);

  const colStr = match[1]!.toUpperCase();
  const rowStr = match[2]!;

  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }

  return { row: parseInt(rowStr, 10), col };
}

/** تحويل (row, col) إلى عنوان خلية. */
export function formatCellAddress(row: number, col: number): string {
  return `${indexToColumnName(col)}${row}`;
}

/** توسيع نطاق A1:B10 إلى قائمة عناوين. */
export function expandRange(start: string, end: string): string[] {
  const s = parseCellAddress(start);
  const e = parseCellAddress(end);

  const minRow = Math.min(s.row, e.row);
  const maxRow = Math.max(s.row, e.row);
  const minCol = Math.min(s.col, e.col);
  const maxCol = Math.max(s.col, e.col);

  const result: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      result.push(formatCellAddress(r, c));
    }
  }
  return result;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. BUILT-IN FUNCTIONS — 50+ دالة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type FnImpl = (...args: unknown[]) => unknown;

/**
 * تسطيح الوسائط — الدوال مثل SUM(A1:A10, 5, B1) تأخذ
 * مزيجاً من النطاقات والقيم الفردية.
 */
function flattenArgs(args: unknown[]): unknown[] {
  const result: unknown[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...flattenArgs(arg));
    } else {
      result.push(arg);
    }
  }
  return result;
}

/** تصفية القيم الرقمية من مصفوفة. */
function filterNumbers(values: unknown[]): number[] {
  return values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
}

/** تقييم معيار مثل ">5" أو "<=10" أو "<>0" أو "text". */
function matchesCriteria(value: unknown, criteria: string): boolean {
  if (typeof criteria !== 'string') return value === criteria;

  const trimmed = criteria.trim();

  // معيار رقمي مع عامل تشغيل
  const opMatch = /^([><=!]{1,2})\s*(-?\d+\.?\d*)$/.exec(trimmed);
  if (opMatch) {
    const [, op, numStr] = opMatch as unknown as [string, string, string];
    const num = parseFloat(numStr);
    const v = typeof value === 'number' ? value : parseFloat(String(value));
    if (!Number.isFinite(v)) return false;

    switch (op) {
      case '>': return v > num;
      case '<': return v < num;
      case '>=': return v >= num;
      case '<=': return v <= num;
      case '=': return v === num;
      case '<>': return v !== num;
      default: return false;
    }
  }

  // معيار نصي — مقارنة دقيقة
  return String(value) === trimmed;
}

export const BUILTINS: Record<string, FnImpl> = {
  // ── Math ──
  SUM: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args));
    return nums.reduce((a, b) => a + b, 0);
  },

  AVERAGE: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args));
    if (nums.length === 0) return ERRORS.DIV0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },

  MEDIAN: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args)).sort((a, b) => a - b);
    if (nums.length === 0) return ERRORS.NUM;
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 !== 0 ? nums[mid]! : (nums[mid - 1]! + nums[mid]!) / 2;
  },

  MODE: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args));
    if (nums.length === 0) return ERRORS.NA;
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
    let maxFreq = 0;
    let mode: number | null = null;
    for (const [n, f] of freq) {
      if (f > maxFreq && f > 1) { maxFreq = f; mode = n; }
    }
    return mode ?? ERRORS.NA;
  },

  MIN: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args));
    return nums.length > 0 ? Math.min(...nums) : 0;
  },

  MAX: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args));
    return nums.length > 0 ? Math.max(...nums) : 0;
  },

  COUNT: (...args: unknown[]) => {
    return filterNumbers(flattenArgs(args)).length;
  },

  COUNTA: (...args: unknown[]) => {
    return flattenArgs(args).filter(v => v !== null && v !== undefined && v !== '').length;
  },

  COUNTBLANK: (...args: unknown[]) => {
    return flattenArgs(args).filter(v => v === null || v === undefined || v === '').length;
  },

  COUNTIF: (range: unknown, criteria: unknown) => {
    if (!Array.isArray(range) || typeof criteria !== 'string') return ERRORS.VALUE;
    return flattenArgs([range]).filter(v => matchesCriteria(v, criteria)).length;
  },

  SUMIF: (range: unknown, criteria: unknown, sumRange?: unknown) => {
    if (!Array.isArray(range) || typeof criteria !== 'string') return ERRORS.VALUE;
    const flat = flattenArgs([range]);
    const sumFlat = sumRange ? flattenArgs([sumRange]) : flat;
    let total = 0;
    for (let i = 0; i < flat.length; i++) {
      if (matchesCriteria(flat[i], criteria) && typeof sumFlat[i] === 'number') {
        total += sumFlat[i] as number;
      }
    }
    return total;
  },

  SUMPRODUCT: (...arrays: unknown[]) => {
    const flat = arrays.map(a => filterNumbers(flattenArgs([a])));
    const len = flat[0]?.length ?? 0;
    if (flat.some(a => a.length !== len)) return ERRORS.VALUE;
    let total = 0;
    for (let i = 0; i < len; i++) {
      let product = 1;
      for (const arr of flat) product *= arr[i]!;
      total += product;
    }
    return total;
  },

  ABS: (n: unknown) => typeof n === 'number' ? Math.abs(n) : ERRORS.VALUE,
  ROUND: (n: unknown, d: unknown = 0) => {
    if (typeof n !== 'number' || typeof d !== 'number') return ERRORS.VALUE;
    const factor = Math.pow(10, Math.round(d));
    return Math.round(n * factor) / factor;
  },
  ROUNDUP: (n: unknown, d: unknown = 0) => {
    if (typeof n !== 'number' || typeof d !== 'number') return ERRORS.VALUE;
    const factor = Math.pow(10, Math.round(d));
    return Math.ceil(n * factor) / factor;
  },
  ROUNDDOWN: (n: unknown, d: unknown = 0) => {
    if (typeof n !== 'number' || typeof d !== 'number') return ERRORS.VALUE;
    const factor = Math.pow(10, Math.round(d));
    return Math.floor(n * factor) / factor;
  },
  CEILING: (n: unknown, sig: unknown = 1) => {
    if (typeof n !== 'number' || typeof sig !== 'number' || sig === 0) return ERRORS.VALUE;
    return Math.ceil(n / sig) * sig;
  },
  FLOOR: (n: unknown, sig: unknown = 1) => {
    if (typeof n !== 'number' || typeof sig !== 'number' || sig === 0) return ERRORS.VALUE;
    return Math.floor(n / sig) * sig;
  },
  MOD: (n: unknown, d: unknown) => {
    if (typeof n !== 'number' || typeof d !== 'number' || d === 0) return ERRORS.DIV0;
    return n - d * Math.floor(n / d);
  },
  POWER: (base: unknown, exp: unknown) => {
    if (typeof base !== 'number' || typeof exp !== 'number') return ERRORS.VALUE;
    return Math.pow(base, exp);
  },
  SQRT: (n: unknown) => {
    if (typeof n !== 'number' || n < 0) return ERRORS.NUM;
    return Math.sqrt(n);
  },
  SIGN: (n: unknown) => {
    if (typeof n !== 'number') return ERRORS.VALUE;
    return n > 0 ? 1 : n < 0 ? -1 : 0;
  },
  RAND: () => Math.random(),
  RANDBETWEEN: (min: unknown, max: unknown) => {
    if (typeof min !== 'number' || typeof max !== 'number') return ERRORS.VALUE;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  PI: () => Math.PI,

  // ── Text ──
  CONCAT: (...args: unknown[]) => flattenArgs(args).map(String).join(''),
  LEN: (text: unknown) => typeof text === 'string' ? text.length : ERRORS.VALUE,
  LEFT: (text: unknown, count: unknown = 1) => {
    if (typeof text !== 'string' || typeof count !== 'number') return ERRORS.VALUE;
    return text.slice(0, Math.max(0, Math.floor(count)));
  },
  RIGHT: (text: unknown, count: unknown = 1) => {
    if (typeof text !== 'string' || typeof count !== 'number') return ERRORS.VALUE;
    return text.slice(-Math.max(0, Math.floor(count)));
  },
  MID: (text: unknown, start: unknown, count: unknown) => {
    if (typeof text !== 'string' || typeof start !== 'number' || typeof count !== 'number') return ERRORS.VALUE;
    return text.slice(Math.max(0, Math.floor(start) - 1), Math.floor(start) - 1 + Math.floor(count));
  },
  UPPER: (text: unknown) => typeof text === 'string' ? text.toUpperCase() : ERRORS.VALUE,
  LOWER: (text: unknown) => typeof text === 'string' ? text.toLowerCase() : ERRORS.VALUE,
  TRIM: (text: unknown) => typeof text === 'string' ? text.trim() : ERRORS.VALUE,
  PROPER: (text: unknown) => {
    if (typeof text !== 'string') return ERRORS.VALUE;
    return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  },
  SUBSTITUTE: (text: unknown, old: unknown, rep: unknown, instance?: unknown) => {
    if (typeof text !== 'string' || typeof old !== 'string' || typeof rep !== 'string') return ERRORS.VALUE;
    if (instance === undefined) return text.split(old).join(rep);
    if (typeof instance !== 'number') return ERRORS.VALUE;
    let count = 0;
    return text.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), (match) => {
      count++;
      return count === instance ? rep : match;
    });
  },
  FIND: (needle: unknown, haystack: unknown, start: unknown = 1) => {
    if (typeof needle !== 'string' || typeof haystack !== 'string' || typeof start !== 'number') return ERRORS.VALUE;
    const idx = haystack.indexOf(needle, Math.max(0, Math.floor(start) - 1));
    return idx === -1 ? ERRORS.VALUE : idx + 1;
  },
  TEXT: (value: unknown, format: unknown) => {
    if (typeof value !== 'number' || typeof format !== 'string') return ERRORS.VALUE;
    // تنسيقات بسيطة — في الإنتاج: محلل تنسيقات كامل
    if (format === '0') return String(Math.round(value));
    if (format === '0.00') return value.toFixed(2);
    if (format === '#,##0') return Math.round(value).toLocaleString();
    if (format === '#,##0.00') return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return String(value);
  },
  TAFQEET: (num: unknown) => {
    if (typeof num !== 'number') return ERRORS.VALUE;
    return tafqeetArabic(num);
  },

  // ── Logic ──
  IF: (cond: unknown, trueVal: unknown, falseVal: unknown) => cond ? trueVal : falseVal,
  IFS: (...args: unknown[]) => {
    for (let i = 0; i < args.length - 1; i += 2) {
      if (args[i]) return args[i + 1];
    }
    return ERRORS.NA;
  },
  AND: (...args: unknown[]) => flattenArgs(args).every(v => Boolean(v)),
  OR: (...args: unknown[]) => flattenArgs(args).some(v => Boolean(v)),
  NOT: (v: unknown) => !v,
  IFERROR: (value: unknown, fallback: unknown) => isError(value) ? fallback : value,
  IFNA: (value: unknown, fallback: unknown) => value === ERRORS.NA ? fallback : value,
  SWITCH: (expr: unknown, ...args: unknown[]) => {
    for (let i = 0; i < args.length - 1; i += 2) {
      if (args[i] === expr) return args[i + 1];
    }
    return args.length % 2 === 1 ? args[args.length - 1] : ERRORS.NA;
  },
  TRUE: () => true,
  FALSE: () => false,

  // ── Lookup ──
  VLOOKUP: (lookupValue: unknown, tableArray: unknown, colIndex: unknown, exactMatch: unknown = true) => {
    if (!Array.isArray(tableArray) || typeof colIndex !== 'number') return ERRORS.VALUE;
    const rows = tableArray as unknown[][];
    const idx = Math.floor(colIndex) - 1;
    if (idx < 0) return ERRORS.VALUE;

    for (const row of rows) {
      if (Array.isArray(row) && row[0] === lookupValue) {
        return idx < row.length ? row[idx] : ERRORS.REF;
      }
    }
    return ERRORS.NA;
  },

  HLOOKUP: (lookupValue: unknown, tableArray: unknown, rowIndex: unknown, exactMatch: unknown = true) => {
    if (!Array.isArray(tableArray) || typeof rowIndex !== 'number') return ERRORS.VALUE;
    const rows = tableArray as unknown[][];
    const firstRow = rows[0];
    if (!Array.isArray(firstRow)) return ERRORS.VALUE;

    const colIdx = firstRow.indexOf(lookupValue);
    if (colIdx === -1) return ERRORS.NA;
    const rowIdx = Math.floor(rowIndex) - 1;
    return rowIdx < rows.length && Array.isArray(rows[rowIdx]) ? rows[rowIdx][colIdx] : ERRORS.REF;
  },

  INDEX: (array: unknown, row: unknown, col?: unknown) => {
    if (!Array.isArray(array) || typeof row !== 'number') return ERRORS.VALUE;
    const rows = array as unknown[][];
    const r = Math.floor(row) - 1;
    if (r < 0 || r >= rows.length) return ERRORS.REF;

    if (col === undefined) return rows[r];
    if (typeof col !== 'number') return ERRORS.VALUE;
    const c = Math.floor(col) - 1;
    const rowArr = rows[r];
    return Array.isArray(rowArr) && c >= 0 && c < rowArr.length ? rowArr[c] : ERRORS.REF;
  },

  MATCH: (lookupValue: unknown, lookupArray: unknown, matchType: unknown = 0) => {
    if (!Array.isArray(lookupArray)) return ERRORS.VALUE;
    const arr = flattenArgs([lookupArray]);
    const type = typeof matchType === 'number' ? matchType : 0;

    if (type === 0) {
      const idx = arr.indexOf(lookupValue);
      return idx === -1 ? ERRORS.NA : idx + 1;
    }
    // type 1 or -1: approximate match — مبسط
    return ERRORS.NA;
  },

  XLOOKUP: (lookupValue: unknown, lookupArray: unknown, returnArray: unknown, ifNotFound?: unknown) => {
    if (!Array.isArray(lookupArray) || !Array.isArray(returnArray)) return ERRORS.VALUE;
    const lookFlat = flattenArgs([lookupArray]);
    const retFlat = flattenArgs([returnArray]);
    const idx = lookFlat.indexOf(lookupValue);
    if (idx === -1) return ifNotFound ?? ERRORS.NA;
    return idx < retFlat.length ? retFlat[idx] : ERRORS.REF;
  },

  CHOOSE: (index: unknown, ...values: unknown[]) => {
    if (typeof index !== 'number') return ERRORS.VALUE;
    const i = Math.floor(index) - 1;
    return i >= 0 && i < values.length ? values[i] : ERRORS.VALUE;
  },

  // ── Date ──
  TODAY: () => new Date().toISOString().slice(0, 10),
  NOW: () => new Date().toISOString().slice(0, 16).replace('T', ' '),
  YEAR: (date: unknown) => {
    if (typeof date !== 'string') return ERRORS.VALUE;
    const d = new Date(date);
    return isNaN(d.getTime()) ? ERRORS.VALUE : d.getFullYear();
  },
  MONTH: (date: unknown) => {
    if (typeof date !== 'string') return ERRORS.VALUE;
    const d = new Date(date);
    return isNaN(d.getTime()) ? ERRORS.VALUE : d.getMonth() + 1;
  },
  DAY: (date: unknown) => {
    if (typeof date !== 'string') return ERRORS.VALUE;
    const d = new Date(date);
    return isNaN(d.getTime()) ? ERRORS.VALUE : d.getDate();
  },
  DATEDIF: (start: unknown, end: unknown, unit: unknown) => {
    if (typeof start !== 'string' || typeof end !== 'string' || typeof unit !== 'string') return ERRORS.VALUE;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return ERRORS.VALUE;

    const u = unit.toUpperCase();
    if (u === 'D') return Math.floor((e.getTime() - s.getTime()) / 86400000);
    if (u === 'M') return (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
    if (u === 'Y') return e.getFullYear() - s.getFullYear();
    return ERRORS.NUM;
  },
  EOMONTH: (date: unknown, months: unknown) => {
    if (typeof date !== 'string' || typeof months !== 'number') return ERRORS.VALUE;
    const d = new Date(date);
    if (isNaN(d.getTime())) return ERRORS.VALUE;
    d.setMonth(d.getMonth() + Math.floor(months) + 1);
    d.setDate(0);
    return d.toISOString().slice(0, 10);
  },

  // ── Financial ──
  PV: (rate: unknown, nper: unknown, pmt: unknown, fv: unknown = 0, type: unknown = 0) => {
    if (typeof rate !== 'number' || typeof nper !== 'number' || typeof pmt !== 'number') return ERRORS.VALUE;
    if (rate === 0) return -(pmt * nper + (fv as number));
    const t = type === 1 ? 1 : 0;
    return -(pmt * (1 + rate * t) * (Math.pow(1 + rate, nper) - 1) / rate + (fv as number) / Math.pow(1 + rate, nper));
  },
  FV: (rate: unknown, nper: unknown, pmt: unknown, pv: unknown = 0, type: unknown = 0) => {
    if (typeof rate !== 'number' || typeof nper !== 'number' || typeof pmt !== 'number') return ERRORS.VALUE;
    if (rate === 0) return -((pv as number) + pmt * nper);
    const t = type === 1 ? 1 : 0;
    return -((pv as number) * Math.pow(1 + rate, nper) + pmt * (1 + rate * t) * (Math.pow(1 + rate, nper) - 1) / rate);
  },
  PMT: (rate: unknown, nper: unknown, pv: unknown, fv: unknown = 0, type: unknown = 0) => {
    if (typeof rate !== 'number' || typeof nper !== 'number' || typeof pv !== 'number') return ERRORS.VALUE;
    if (rate === 0) return -((pv + (fv as number)) / nper);
    const t = type === 1 ? 1 : 0;
    return -(pv * Math.pow(1 + rate, nper) + (fv as number)) * rate / ((1 + rate * t) * (Math.pow(1 + rate, nper) - 1));
  },
  NPV: (rate: unknown, ...values: unknown[]) => {
    if (typeof rate !== 'number') return ERRORS.VALUE;
    const nums = filterNumbers(flattenArgs(values));
    let npv = 0;
    for (let i = 0; i < nums.length; i++) {
      npv += nums[i]! / Math.pow(1 + rate, i + 1);
    }
    return npv;
  },

  // ── Statistical ──
  STDEV: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args));
    if (nums.length < 2) return ERRORS.DIV0;
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nums.length - 1);
    return Math.sqrt(variance);
  },
  VAR: (...args: unknown[]) => {
    const nums = filterNumbers(flattenArgs(args));
    if (nums.length < 2) return ERRORS.DIV0;
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    return nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nums.length - 1);
  },
  CORREL: (x: unknown, y: unknown) => {
    if (!Array.isArray(x) || !Array.isArray(y)) return ERRORS.VALUE;
    const xs = filterNumbers(flattenArgs([x]));
    const ys = filterNumbers(flattenArgs([y]));
    if (xs.length !== ys.length || xs.length < 2) return ERRORS.NA;
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const my = ys.reduce((a, b) => a + b, 0) / ys.length;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < xs.length; i++) {
      num += (xs[i]! - mx) * (ys[i]! - my);
      dx += Math.pow(xs[i]! - mx, 2);
      dy += Math.pow(ys[i]! - my, 2);
    }
    const denom = Math.sqrt(dx * dy);
    return denom === 0 ? ERRORS.DIV0 : num / denom;
  },
  PERCENTILE: (values: unknown, k: unknown) => {
    if (!Array.isArray(values) || typeof k !== 'number') return ERRORS.VALUE;
    const nums = filterNumbers(flattenArgs([values])).sort((a, b) => a - b);
    if (nums.length === 0 || k < 0 || k > 1) return ERRORS.NUM;
    const idx = k * (nums.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return lo === hi ? nums[lo]! : nums[lo]! + (nums[hi]! - nums[lo]!) * (idx - lo);
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. TAFQEET — التفقيط العربي
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
              'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
              'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const HUNDREDS = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة',
                  'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
const SCALE = ['', 'ألف', 'مليون', 'مليار', 'تريليون', 'كوادريليون'];
const SCALE_PLURAL = ['', 'آلاف', 'ملايين', 'مليارات', 'تريليونات', 'كوادريليونات'];
const SCALE_DUAL = ['', 'ألفان', 'مليونان', 'ملياران', 'تريليونان', 'كوادريليونان'];

function tafqeetGroup(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n]!;

  const h = Math.floor(n / 100);
  const rem = n % 100;
  const parts: string[] = [];

  if (h > 0) parts.push(HUNDREDS[h]!);

  if (rem > 0) {
    if (rem < 20) {
      parts.push(ONES[rem]!);
    } else {
      const t = Math.floor(rem / 10);
      const o = rem % 10;
      if (o > 0) {
        parts.push(`${ONES[o]!} و${TENS[t]!}`);
      } else {
        parts.push(TENS[t]!);
      }
    }
  }

  return parts.join(' و');
}

/** تحويل رقم إلى كلمات عربية. */
export function tafqeetArabic(num: number): string {
  if (!Number.isFinite(num)) return ERRORS.VALUE;
  if (num === 0) return 'صفر';

  const isNeg = num < 0;
  const abs = Math.abs(Math.floor(num));
  const decimals = Math.round((Math.abs(num) - abs) * 100);

  if (abs > 999999999999999) return ERRORS.NUM; // أكبر من كوادريليون

  const groups: number[] = [];
  let remaining = abs;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]!;
    if (g === 0) continue;

    if (g === 1) {
      parts.push(SCALE[i]!);
    } else if (g === 2) {
      parts.push(SCALE_DUAL[i]!);
    } else if (g >= 3 && g <= 10) {
      parts.push(`${tafqeetGroup(g)} ${SCALE_PLURAL[i]!}`);
    } else {
      const groupText = tafqeetGroup(g);
      parts.push(i > 0 ? `${groupText} ${SCALE[i]!}` : groupText);
    }
  }

  let result = parts.join(' و');
  if (decimals > 0) {
    result += ` و${tafqeetGroup(decimals)} بالمائة`;
  }
  if (isNeg) result = `سالب ${result}`;

  return result;
}

/** تفقيط عملة. */
export function tafqeetCurrency(num: number, currency: 'SAR' | 'USD' | 'EGP' | 'EUR'): string {
  const currencyNames: Record<string, [string, string]> = {
    SAR: ['ريال سعودي', 'ريالات'],
    USD: ['دولار أمريكي', 'دولارات'],
    EGP: ['جنيه مصري', 'جنيهات'],
    EUR: ['يورو', 'يورو'],
  };

  const [singular, plural] = currencyNames[currency]!;
  const isNeg = num < 0;
  const abs = Math.abs(num);
  const whole = Math.floor(abs);
  const cents = Math.round((abs - whole) * 100);

  const wholeText = whole === 0 ? 'صفر' : tafqeetArabic(whole);
  const unit = whole === 1 ? singular : whole === 2 ? `${singular}ان` : `${wholeText} ${plural}`;

  let result = isNeg ? `سالب ${unit}` : unit;
  if (cents > 0) {
    result += ` و${tafqeetArabic(cents)} هللة`;
  }

  return result;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. CELL FORMATTER — تنسيق القيم
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class CellFormatter {
  /** تنسيق قيمة حسب نوع التنسيق. */
  formatValue(value: unknown, format: string): string {
    if (isError(value)) return value;
    if (value === null || value === undefined) return '';

    switch (format) {
      case 'currency':
        return typeof value === 'number'
          ? `${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`
          : String(value);

      case 'percent':
        return typeof value === 'number'
          ? `${(value * 100).toFixed(1)}%`
          : String(value);

      case 'decimal':
        return typeof value === 'number'
          ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : String(value);

      case 'date':
        if (typeof value === 'string') {
          const d = new Date(value);
          return isNaN(d.getTime()) ? value : d.toLocaleDateString('ar-SA');
        }
        return String(value);

      case 'standard':
      default:
        return typeof value === 'number'
          ? value.toLocaleString()
          : String(value);
    }
  }

  /** تنسيق شرطي — إرجاع نمط الخلية إذا طابق قاعدة. */
  applyConditionalFormatting(
    value: unknown,
    rules: Array<{ condition: string; style: { background?: string; color?: string } }>,
  ): { background?: string; color?: string } | null {
    for (const rule of rules) {
      if (matchesCriteria(value, rule.condition)) {
        return rule.style;
      }
    }
    return null;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. EVAL CONTEXT — سياق التقييم
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface EvalContext {
  cellKey: string;
  sheet: TableBlockNode;
  allSheets: TableBlockNode[];
  namedRanges: Record<string, string>;
  visitedCells: Set<string>; // لكشف الدورات أثناء التقييم
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. CALC ENGINE — المحرك الرئيسي
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class CalcEngine {
  private graph = new DependencyGraph();
  private parser = new FormulaParser();
  private formatter = new CellFormatter();
  private namedRanges = new Map<string, string>();
  /** سجل الأوراق المسمّاة لدعم المراجع عبر الأوراق (نموذج libresheets). */
  private workbook = new Map<string, TableBlockNode>();

  /** تسجيل ورقة باسم لتمكين المراجع مثل Sheet2!B3. */
  registerSheet(name: string, sheet: TableBlockNode): void {
    this.workbook.set(name, sheet);
  }

  /** إزالة ورقة من السجل. */
  unregisterSheet(name: string): boolean {
    return this.workbook.delete(name);
  }

  /** أسماء الأوراق المسجلة. */
  getSheetNames(): string[] {
    return Array.from(this.workbook.keys());
  }

  // ── Core Evaluation ──

  /** تقييم صيغة واحدة في سياق معين. */
  evaluate(formula: string, context: EvalContext): unknown {
    try {
      const ast = this.parser.parse(formula);
      return this.evalNode(ast, context);
    } catch (e) {
      return ERRORS.VALUE;
    }
  }

  /** المدخل الخام لخلية (يدعم شكلي CellBlockNode وTableCellData). */
  private cellRawInput(cell: CellBlockNode): string {
    if ('data' in cell && cell.data?.rawInput !== undefined) return cell.data.rawInput;
    return (cell as unknown as { rawInput?: string }).rawInput ?? '';
  }

  /** القيمة المحسوبة لخلية (يدعم شكلي CellBlockNode وTableCellData). */
  private cellComputedValue(cell: CellBlockNode): unknown {
    if ('data' in cell && cell.data?.computedValue !== undefined) return cell.data.computedValue;
    return (cell as unknown as { computedValue?: unknown }).computedValue ?? null;
  }

  /** تقييم خلية واحدة (تحديث قيمتها المحسوبة). */
  evaluateCell(cellKey: string, sheet: TableBlockNode, allSheets?: TableBlockNode[]): CellBlockNode {
    const cell = this.findCell(sheet, cellKey);
    if (!cell) {
      return createCellBlock(cellKey, 0, 0, '', { error: ERRORS.REF });
    }

    const rawInput = this.cellRawInput(cell);
    if (!rawInput.startsWith('=')) {
      // ليست صيغة — القيمة هي المدخل نفسه
      const parsed = this.parseLiteral(rawInput);
      return this.updateCellComputed(cell, parsed);
    }

    const formula = rawInput.slice(1);

    // كشف الدورة
    const ctx: EvalContext = {
      cellKey,
      sheet,
      allSheets: allSheets ?? Array.from(this.workbook.values()),
      namedRanges: Object.fromEntries(this.namedRanges),
      visitedCells: new Set([cellKey]),
    };

    const result = this.evaluate(formula, ctx);
    return this.updateCellComputed(cell, result);
  }

  /**
   * إعادة حساب مصنف كامل (عدة أوراق مسمّاة) — نموذج libresheets.
   * تسجل الأوراق أولاً ثم يُحسب كلٌّ بالترتيب.
   */
  recalculateWorkbook(namedSheets: ReadonlyArray<{ name: string; sheet: TableBlockNode }>): TableBlockNode[] {
    for (const { name, sheet } of namedSheets) this.registerSheet(name, sheet);

    const sheets = namedSheets.map(ns => ns.sheet);
    return namedSheets.map(ns => this.recalculateAll(ns.sheet, sheets));
  }

  /** إعادة حساب الورقة كاملة — بالترتيب التوبولوجي. */
  recalculateAll(sheet: TableBlockNode, allSheets?: TableBlockNode[]): TableBlockNode {
    const sheets = allSheets ?? [sheet];
    // إعادة بناء الـ DAG
    this.graph.rebuild(sheet, (f) => this.parser.extractReferences(f));

    // كشف الدورات
    for (const cellKey of this.graph.precedentKeys) {
      if (this.graph.hasCycle(cellKey)) {
        // كل خلية في الدورة تحصل على #REF!
        return this.markCycleErrors(sheet, cellKey);
      }
    }

    // التقييم بالترتيب التوبولوجي
    const order = this.graph.topologicalSort();
    let result = sheet;

    for (const cellKey of order) {
      const evaluated = this.evaluateCell(cellKey, result, sheets);
      result = this.updateCellInSheet(result, cellKey, evaluated);
    }

    // تقييم الخلايا غير الصيغية أيضاً
    for (const row of result.rows) {
      for (const cell of row.cells) {
        const raw = cell.rawInput ?? '';
        if (!raw.startsWith('=') && (cell.computedValue ?? null) === null) {
          const parsed = this.parseLiteral(raw);
          const updated = this.updateCellComputed(cell, parsed);
          result = this.updateCellInSheet(result, cell.address ?? cell.id, updated as unknown as CellBlockNode);
        }
      }
    }

    return result;
  }

  /** إعادة حساب نطاق محدد. */
  recalculateRange(startCell: string, endCell: string, sheet: TableBlockNode): TableBlockNode {
    const addresses = expandRange(startCell, endCell);
    let result = sheet;
    for (const addr of addresses) {
      const evaluated = this.evaluateCell(addr, result);
      result = this.updateCellInSheet(result, addr, evaluated);
    }
    return result;
  }

  /** استدعى عند تغيير خلية — إعادة حساب كل المتأثرين. */
  onCellChanged(cellKey: string, sheet: TableBlockNode): TableBlockNode {
    this.graph.rebuild(sheet, (f) => this.parser.extractReferences(f));

    const affected = this.graph.getTransitiveDependents(cellKey);
    const toRecalc = [cellKey, ...affected];

    let result = sheet;
    for (const addr of toRecalc) {
      const evaluated = this.evaluateCell(addr, result);
      result = this.updateCellInSheet(result, addr, evaluated);
    }

    return result;
  }

  // ── Named Ranges ──

  setNamedRange(name: string, range: string): void {
    this.namedRanges.set(name, range);
  }

  getNamedRange(name: string): string | undefined {
    return this.namedRanges.get(name);
  }

  resolveNamedRange(name: string, sheet: TableBlockNode): unknown[] {
    const range = this.namedRanges.get(name);
    if (!range) return [];

    // هل هو نطاق مثل A1:B10؟
    const rangeMatch = /^([A-Z]+[0-9]+):([A-Z]+[0-9]+)$/i.exec(range);
    if (rangeMatch) {
      return expandRange(rangeMatch[1]!, rangeMatch[2]!).map(addr => {
        const cell = this.findCell(sheet, addr);
        return cell ? ((this.cellComputedValue(cell) ?? this.cellRawInput(cell)) || null) : null;
      });
    }

    // خلية واحدة
    const cell = this.findCell(sheet, range);
    return [cell ? ((this.cellComputedValue(cell) ?? this.cellRawInput(cell)) || null) : null];
  }

  // ── Validation ──

  validateFormula(formula: string): { valid: boolean; error?: string } {
    try {
      this.parser.parse(formula);
      return { valid: true };
    } catch (e) {
      return { valid: false, error: (e as Error).message };
    }
  }

  // ── Private Helpers ──

  private evalNode(node: ASTNode, ctx: EvalContext): unknown {
    switch (node.type) {
      case 'literal':
        return node.value;

      case 'cellRef': {
        if (ctx.visitedCells.has(node.address)) return ERRORS.REF; // دورة
        const cell = this.findCellInContext(node.address, ctx);
        if (!cell) return ERRORS.REF;

        const raw = this.cellRawInput(cell);
        if (raw.startsWith('=')) {
          const subCtx = { ...ctx, cellKey: node.address, visitedCells: new Set([...ctx.visitedCells, node.address]) };
          return this.evaluate(raw.slice(1), subCtx);
        }
        return this.cellComputedValue(cell) ?? this.parseLiteral(raw);
      }

      case 'rangeRef': {
        const addresses = expandRange(node.start, node.end);
        return addresses.map(addr => {
          const cell = this.findCellInContext(addr, ctx);
          return cell ? ((this.cellComputedValue(cell) ?? this.cellRawInput(cell)) || null) : null;
        });
      }

      case 'namedRange': {
        const range = ctx.namedRanges[node.name] ?? this.namedRanges.get(node.name);
        if (!range) return ERRORS.NAME;
        return this.resolveNamedRange(node.name, ctx.sheet);
      }

      case 'binaryOp': {
        const left = this.evalNode(node.left, ctx);
        const right = this.evalNode(node.right, ctx);
        if (isError(left)) return left;
        if (isError(right)) return right;
        return this.applyBinaryOp(node.op, left, right);
      }

      case 'unaryOp': {
        const operand = this.evalNode(node.operand, ctx);
        if (isError(operand)) return operand;
        if (node.op === '-') {
          return typeof operand === 'number' ? -operand : ERRORS.VALUE;
        }
        return operand;
      }

      case 'functionCall': {
        const fn = BUILTINS[node.name];
        if (!fn) return ERRORS.NAME;
        const args = node.args.map(a => this.evalNode(a, ctx));
        // إذا كان أي وسيط خطأً، بعض الدوال تتعامل معه (IFERROR)
        try {
          return fn(...args);
        } catch {
          return ERRORS.VALUE;
        }
      }
    }
  }

  private applyBinaryOp(op: string, left: unknown, right: unknown): unknown {
    switch (op) {
      case '+':
        if (typeof left === 'number' && typeof right === 'number') return left + right;
        if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
        return ERRORS.VALUE;
      case '-':
        return typeof left === 'number' && typeof right === 'number' ? left - right : ERRORS.VALUE;
      case '*':
        return typeof left === 'number' && typeof right === 'number' ? left * right : ERRORS.VALUE;
      case '/':
        if (typeof left !== 'number' || typeof right !== 'number') return ERRORS.VALUE;
        if (right === 0) return ERRORS.DIV0;
        return left / right;
      case '^':
        return typeof left === 'number' && typeof right === 'number' ? Math.pow(left, right) : ERRORS.VALUE;
      case '>':
        return this.compare(left, right) > 0;
      case '<':
        return this.compare(left, right) < 0;
      case '>=':
        return this.compare(left, right) >= 0;
      case '<=':
        return this.compare(left, right) <= 0;
      case '=':
        return left === right;
      case '<>':
        return left !== right;
      default:
        return ERRORS.VALUE;
    }
  }

  private compare(a: unknown, b: unknown): number {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  }

  private findCell(sheet: TableBlockNode, address: string): CellBlockNode | null {
    for (const row of sheet.rows) {
      for (const cell of row.cells) {
        if (cell.address === address) {
          return cell as unknown as CellBlockNode;
        }
        const cellBlock = cell as unknown as CellBlockNode;
        if (cellBlock.data?.address === address) {
          return cellBlock;
        }
      }
    }
    return null;
  }

  private findCellInContext(address: string, ctx: EvalContext): CellBlockNode | null {
    // مرجع عبر الأوراق: Sheet1!A1 — يُحل من سجل الأوراق المسمّاة
    const bangIdx = address.indexOf('!');
    if (bangIdx > 0) {
      const sheetName = address.slice(0, bangIdx).replace(/^'|'$/g, '');
      const localAddr = address.slice(bangIdx + 1);
      const target = this.workbook.get(sheetName);
      return target ? this.findCell(target, localAddr) : null;
    }

    // البحث في الورقة الحالية أولاً
    let cell = this.findCell(ctx.sheet, address) as CellBlockNode | null;
    if (cell) return cell;

    // ثم في الأوراق الأخرى
    for (const sheet of ctx.allSheets) {
      cell = this.findCell(sheet, address) as CellBlockNode | null;
      if (cell) return cell;
    }
    return null;
  }

  private updateCellComputed<T extends CellBlockNode | TableCellData>(cell: T, value: unknown): T {
    const isError_ = isError(value);
    const dataType: CellDataType = isError_
      ? 'error'
      : typeof value === 'number'
        ? 'number'
        : typeof value === 'boolean'
          ? 'boolean'
          : 'text';

    // CellBlockNode — القيمة داخل data
    if ('data' in cell) {
      return {
        ...cell,
        data: {
          ...cell.data,
          computedValue: isError_ ? null : value,
          dataType,
          error: isError_ ? (value as string) : undefined,
        },
      } as T;
    }

    // TableCellData — القيمة على الخلية مباشرة
    return {
      ...cell,
      computedValue: isError_ ? null : (value as number | string | boolean | null),
      error: isError_ ? (value as string) : undefined,
    } as T;
  }

  private updateCellInSheet(sheet: TableBlockNode, address: string, cell: CellBlockNode): TableBlockNode {
    const newRows = sheet.rows.map(row => ({
      ...row,
      cells: row.cells.map(c => {
        const cb = c as unknown as CellBlockNode;
        return (c.address === address || cb.data?.address === address)
          ? (cell as unknown as TableCellData)
          : c;
      }),
    }));

    return { ...sheet, rows: newRows };
  }

  private markCycleErrors(sheet: TableBlockNode, startCell: string): TableBlockNode {
    const cycleCells = new Set<string>();
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (node: string): void => {
      if (stack.has(node)) {
        // وجدنا دورة — كل شيء في المكدس من هذه النقطة
        cycleCells.add(node);
        return;
      }
      if (visited.has(node)) return;

      visited.add(node);
      stack.add(node);

      for (const dep of this.graph.getPrecedents(node)) {
        dfs(dep);
      }

      stack.delete(node);
    };

    dfs(startCell);

    let result = sheet;
    for (const addr of cycleCells) {
      const cell = this.findCell(result, addr);
      if (cell) {
        const errorCell = this.updateCellComputed(cell, ERRORS.REF);
        result = this.updateCellInSheet(result, addr, errorCell);
      }
    }
    return result;
  }

  private parseLiteral(raw: string): number | string | boolean | null {
    if (raw === '') return null;
    if (raw.toUpperCase() === 'TRUE') return true;
    if (raw.toUpperCase() === 'FALSE') return false;
    const num = parseFloat(raw);
    if (!isNaN(num) && String(num) === raw.trim()) return num;
    return raw;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. SORTING & FILTERING — التكامل مع mergesort
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** فرز صفوف الجدول حسب عمود. */
export function sortTableByColumn(
  sheet: TableBlockNode,
  colIndex: number,
  direction: 'asc' | 'desc' = 'asc',
): TableBlockNode {
  const rows = [...sheet.rows];

  const comparator = (a: TableRowData, b: TableRowData): number => {
    const valA = a.cells[colIndex];
    const valB = b.cells[colIndex];
    if (!valA || !valB) return 0;

    // استخدام formatCellValue للحصول على القيمة المقروءة
    const textA = valA.text;
    const textB = valB.text;

    const numA = parseFloat(textA);
    const numB = parseFloat(textB);

    if (!isNaN(numA) && !isNaN(numB)) {
      return direction === 'asc' ? numA - numB : numB - numA;
    }

    return direction === 'asc'
      ? textA.localeCompare(textB)
      : textB.localeCompare(textA);
  };

  const sorted = bottomUpMergeSort(rows, comparator);
  return { ...sheet, rows: sorted };
}