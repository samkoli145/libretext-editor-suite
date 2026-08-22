/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محلل ومعرب التعابير الرياضية والحسابية وبناء شجرة الـ AST للمفكرة
 * 🏛️ الدور: نواة مشتركة معزولة (Zero-Dependency Expression Parser)
 * 📥 المستهلك: ScratchpadGraph, ScratchpadEngine, ScratchpadBindings
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive Descent AST Parsing, Scientific Notation Lexer, Zero-Exception Error Objects
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأسبقية الرياضية الصارمة (PEMDAS: ^ ثم * / % ثم + -).
 *    2. معالجة العمليات الأحادية (Unary minus/plus: -5, +3).
 *    3. عدم رمي أي استثناءات runtime، وإرجاع `ScratchpadError` عند الخطأ النحوي.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية مؤشرات البحث (Index boundary checks)
 *    - التعامل مع النصوص غير المغلقة والأقواس غير المتطابقة
 *    - تدقيق الأرقام العشرية والترميز العلمي `1.5e10`
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { isValidVarName, ERR_VALUE, ERR_NAME, type ScratchpadError } from './types.ts'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔤 الرموز (Tokens)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type TokenType =
  | 'number'
  | 'string'
  | 'variable'
  | 'operator'
  | 'function'
  | 'lparen'
  | 'rparen'
  | 'comma'
  | 'percent'

export interface Token {
  type: TokenType
  value: string
  pos: number  // الموضع في النص الأصلي (للأخطاء)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌳 شجرة البناء (AST)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ASTNode =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'variable'; name: string }
  | { type: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: string; operand: ASTNode }
  | { type: 'call'; name: string; args: ASTNode[] }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 محلل الرموز (Tokenizer)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تقسيم النص إلى رموز
 */
export function tokenize(expr: string): Token[] | ScratchpadError {
  const tokens: Token[] = []
  let i = 0
  
  while (i < expr.length) {
    const c = expr[i]
    
    // تجاهل المسافات
    if (/\s/.test(c)) {
      i++
      continue
    }
    
    // الأرقام
    if (/[0-9.]/.test(c)) {
      const start = i
      while (i < expr.length && /[0-9.eE]/.test(expr[i])) {
        // معالجة eE (الترميز العلمي)
        if ((expr[i] === 'e' || expr[i] === 'E') && i + 1 < expr.length) {
          if (expr[i + 1] === '+' || expr[i + 1] === '-') {
            i += 2
            continue
          }
        }
        i++
      }
      const value = expr.slice(start, i)
      tokens.push({ type: 'number', value, pos: start })
      continue
    }
    
    // النصوص
    if (c === '"' || c === "'") {
      const quote = c
      const start = i
      i++
      while (i < expr.length && expr[i] !== quote) {
        if (expr[i] === '\\' && i + 1 < expr.length) {
          i += 2  // تخطي الحرف المحجوز
        } else {
          i++
        }
      }
      if (i >= expr.length) {
        return ERR_VALUE(`Unterminated string at position ${start}`)
      }
      i++  // تخطي علامة الاقتباس الختامية
      const value = expr.slice(start + 1, i - 1)
      tokens.push({ type: 'string', value, pos: start })
      continue
    }
    
    // المتغيرات
    if (c === '$' || /[a-zA-Z_]/.test(c)) {
      const start = i
      if (c === '$') i++  // تخطي $
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        i++
      }
      const value = expr.slice(start, i)
      
      // التحقق من صحة الاسم
      if (!isValidVarName(value)) {
        return ERR_NAME(value)
      }
      
      tokens.push({ type: 'variable', value, pos: start })
      continue
    }
    
    // العمليات
    if ('+-*/^%'.includes(c)) {
      tokens.push({ type: 'operator', value: c, pos: i })
      i++
      continue
    }
    
    // الأقواس
    if (c === '(') {
      tokens.push({ type: 'lparen', value: '(', pos: i })
      i++
      continue
    }
    if (c === ')') {
      tokens.push({ type: 'rparen', value: ')', pos: i })
      i++
      continue
    }
    
    // الفواصل
    if (c === ',') {
      tokens.push({ type: 'comma', value: ',', pos: i })
      i++
      continue
    }
    
    // حرف غير معروف
    return ERR_VALUE(`Unexpected character '${c}' at position ${i}`)
  }
  
  return tokens
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏗️ بناء شجرة البناء (AST Builder)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isBinaryOp(op: string): boolean {
  return '+-*/^'.includes(op)
}

/**
 * تحويل الرموز إلى شجرة بناء (Recursive Descent Parser)
 */
export function parse(expr: string): ASTNode | ScratchpadError {
  if (!expr || expr.trim().length === 0) {
    return ERR_VALUE('Empty expression')
  }

  const tokenResult = tokenize(expr)
  if (tokenResult instanceof Error || 'code' in tokenResult) {
    return tokenResult as ScratchpadError
  }
  const tokens = tokenResult as Token[]
  if (tokens.length === 0) {
    return ERR_VALUE('Empty expression')
  }
  
  let pos = 0
  
  function peek(): Token | null {
    return pos < tokens.length ? tokens[pos] : null
  }
  
  function consume(): Token {
    return tokens[pos++]
  }
  
  function parseExpression(): ASTNode | ScratchpadError {
    let left = parseTerm()
    if (left instanceof Error || 'code' in left) return left
    
    while (peek()?.type === 'operator' && isBinaryOp(peek()!.value)) {
      const op = consume().value
      const right = parseTerm()
      if (right instanceof Error || 'code' in right) return right
      left = { type: 'binary', op, left, right }
    }
    
    return left
  }
  
  function parseTerm(): ASTNode | ScratchpadError {
    let left = parseFactor()
    if (left instanceof Error || 'code' in left) return left
    
    while (peek()?.type === 'operator' && '*/'.includes(peek()!.value)) {
      const op = consume().value
      const right = parseFactor()
      if (right instanceof Error || 'code' in right) return right
      left = { type: 'binary', op, left, right }
    }
    
    return left
  }
  
  function parseFactor(): ASTNode | ScratchpadError {
    // معالجة unary +/-
    if (peek()?.type === 'operator' && '+-'.includes(peek()!.value)) {
      const op = consume().value
      const operand = parseFactor()
      if (operand instanceof Error || 'code' in operand) return operand
      return { type: 'unary', op, operand }
    }
    
    let node = parsePrimary()
    if (node instanceof Error || 'code' in node) return node
    
    // معالجة % (نسبة مئوية - postfix)
    if (peek()?.type === 'operator' && peek()!.value === '%') {
      consume()
      node = { type: 'binary', op: '/', left: node, right: { type: 'number', value: 100 } }
    }
    
    return node
  }
  
  function parsePrimary(): ASTNode | ScratchpadError {
    const token = peek()
    if (!token) {
      return ERR_VALUE('Unexpected end of expression')
    }
    
    // رقم
    if (token.type === 'number') {
      consume()
      const value = parseFloat(token.value)
      if (!Number.isFinite(value)) {
        return ERR_VALUE(`Invalid number: ${token.value}`)
      }
      return { type: 'number', value }
    }
    
    // نص
    if (token.type === 'string') {
      consume()
      return { type: 'string', value: token.value }
    }
    
    // دالة (اسم متبوع بـ ()
    if (token.type === 'variable' && pos + 1 < tokens.length && tokens[pos + 1].type === 'lparen') {
      const rawName = consume().value
      const name = rawName.startsWith('$') ? rawName.slice(1) : rawName
      consume()  // (
      
      const args: ASTNode[] = []
      if (peek()?.type !== 'rparen') {
        const arg = parseExpression()
        if (arg instanceof Error || 'code' in arg) return arg
        args.push(arg)
        
        while (peek()?.type === 'comma') {
          consume()
          const nextArg = parseExpression()
          if (nextArg instanceof Error || 'code' in nextArg) return nextArg
          args.push(nextArg)
        }
      }
      
      if (peek()?.type !== 'rparen') {
        return ERR_VALUE(`Missing closing parenthesis for function ${name}`)
      }
      consume()
      
      return { type: 'call', name, args }
    }
    
    // متغير
    if (token.type === 'variable') {
      consume()
      const name = token.value.startsWith('$') ? token.value.slice(1) : token.value
      return { type: 'variable', name }
    }
    
    // قوس أيسر
    if (token.type === 'lparen') {
      consume()
      const exprSub = parseExpression()
      if (exprSub instanceof Error || 'code' in exprSub) return exprSub
      if (peek()?.type !== 'rparen') {
        return ERR_VALUE('Missing closing parenthesis')
      }
      consume()
      return exprSub
    }
    
    return ERR_VALUE(`Unexpected token: ${token.value}`)
  }
  
  const result = parseExpression()
  if (result instanceof Error || 'code' in result) return result
  
  if (pos < tokens.length) {
    return ERR_VALUE(`Unexpected token after expression: ${tokens[pos].value}`)
  }
  
  return result
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 استخراج المتغيرات (Variable Extraction)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * استخراج جميع المتغيرات من تعبير
 */
export function extractVariables(expr: string): string[] {
  if (!expr || expr.trim().length === 0) return []
  const tokenResult = tokenize(expr)
  if (tokenResult instanceof Error || 'code' in tokenResult) return []
  const tokens = tokenResult as Token[]
  
  const vars = new Set<string>()
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === 'variable') {
      // إذا كان يتبعه قوس أيسر فهو استدعاء دالة وليس متغيراً
      if (i + 1 < tokens.length && tokens[i + 1].type === 'lparen') {
        continue
      }
      const name = token.value.startsWith('$') ? token.value.slice(1) : token.value
      vars.add(name)
    }
  }
  
  return Array.from(vars)
}
