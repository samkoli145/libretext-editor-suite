/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: محرك المفكرة الحسابية المنقى القائم على الاشتقاق الحسابي النقي (Pure Derivation)
 * 🏛️ الدور: نواة محرك الحسابات بدون تخزين للقيم المشتقة (Zero-Stored-Values Engine)
 * 📥 المستهلك: ScratchpadStore, ScratchpadBindings, والواجهات التفاعلية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Rule #2: VALUES ARE DERIVED, NEVER STORED (اشتقاق كلي عبر Kahn's Topological Sort).
 *    - Rule #3: HONEST ERRORS (إرجاع أخطاء صريحة #REF!, #CYCLE! دون تخمين قيم عشوائية).
 *    - Rule #4: PRESENTING/EVALUATION MUTATES NOTHING (دوال التقييم نقية تماماً دون أي آثار جانبية).
 *    - Patch Factory Pattern: كافة عمليات التعديل تعيد Patch[] مع دعم كامل لـ `drop`.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم حفظ نتيجة `evaluateExpression` داخل كائنات `Notebook.vars`.
 *    2. تمرير القيم المحسوبة مسبقاً (evaluatedValues) أثناء السير الطوبولوجي لتفادي الحلقات المفرغة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية الدوال الرياضية المدمجة عبر try/catch مع إرجاع #VALUE! عند الخطأ.
 *    - تنظيف وتطبيع الدفاتر الواردة خارجياً بـ `normalizeNotebook`.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import { parse, type ASTNode } from './ScratchpadParser.ts'
import {
  buildGraphFromExpressions,
  topologicalSort,
} from './ScratchpadGraph.ts'
import {
  setScratchpadVar as makeSetPatch,
  deleteScratchpadVar as makeDeletePatch,
  renameScratchpadVar as makeRenamePatch,
  createNotebook as makeCreateNbPatch,
  deleteNotebook as makeDeleteNbPatch,
  renameNotebook as makeRenameNbPatch,
  findVar,
} from './scratchpad-patches.ts'
import {
  type ScratchpadPatch,
  isScratchpadError,
  normalizeNotebook,
  ERR_REF,
  ERR_CYCLE,
  ERR_VALUE,
  ERR_DIV0,
  ERR_NAME,
  type ScratchpadVar,
  type ComputedVar,
  type Notebook,
  type ScratchpadEvent,
  type ScratchpadColumnType,
} from './types.ts'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 محرك المفكرة الحسابية المنقى (Pure Derivation Engine)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class ScratchpadEngine {
  private notebooks = new Map<string, Notebook>()
  private activeNotebookId: string | null = null
  private listeners = new Map<string, Set<(event: ScratchpadEvent) => void>>()

  constructor() {
    const defaultId = 'default'
    this.notebooks.set(
      defaultId,
      normalizeNotebook({
        id: defaultId,
        name: 'دفتر الحسابات الرئيسي',
        lines: [],
        vars: new Map(),
      })
    )
    this.activeNotebookId = defaultId
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🏭 مصانع التصحيحات (Patch Factories)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  setVar(
    name: string,
    expr: string,
    options?: {
      type?: ScratchpadColumnType
      format?: string
      description?: string
      notebookId?: string
    }
  ): ScratchpadPatch[] {
    const notebook = this.getNotebook(options?.notebookId)
    if (!notebook) {
      throw new Error(`Notebook not found: ${options?.notebookId ?? this.activeNotebookId}`)
    }
    return makeSetPatch(notebook, name, expr, options)
  }

  deleteVar(nameOrId: string, notebookId?: string): ScratchpadPatch[] {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) {
      throw new Error(`Notebook not found: ${notebookId ?? this.activeNotebookId}`)
    }
    return makeDeletePatch(notebook, nameOrId)
  }

  renameVar(oldNameOrId: string, newName: string, notebookId?: string): ScratchpadPatch[] {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) {
      throw new Error(`Notebook not found: ${notebookId ?? this.activeNotebookId}`)
    }
    return makeRenamePatch(notebook, oldNameOrId, newName)
  }

  createNotebook(notebookId: string, name: string): ScratchpadPatch[] {
    return makeCreateNbPatch(notebookId, name)
  }

  deleteNotebook(notebookId?: string): ScratchpadPatch[] {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) {
      throw new Error(`Notebook not found: ${notebookId ?? this.activeNotebookId}`)
    }
    return makeDeleteNbPatch(notebook)
  }

  renameNotebook(newName: string, notebookId?: string): ScratchpadPatch[] {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) {
      throw new Error(`Notebook not found: ${notebookId ?? this.activeNotebookId}`)
    }
    return makeRenameNbPatch(notebook, newName)
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🧮 اشتقاق القيم الحسابية (Pure Derivation — Rule #2 & Rule #4)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  deriveVar(varId: string, notebookId?: string): ComputedVar | null {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) return null

    const v = notebook.vars.get(varId)
    if (!v) return null

    const allComputed = this.deriveAll(notebook.id)
    return allComputed.get(varId) ?? null
  }

  deriveAll(notebookId?: string): Map<string, ComputedVar> {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) return new Map()

    const results = new Map<string, ComputedVar>()
    const exprs = new Map<string, string>()

    for (const [id, v] of notebook.vars) {
      exprs.set(id, v.expr)
    }

    const graph = buildGraphFromExpressions(exprs)
    const { order, cycles } = topologicalSort(graph)

    const evaluatedValues = new Map<string, unknown>()
    const context = {
      vars: notebook.vars,
      evaluatedValues,
    }

    // 1. Evaluate in strict topological order
    for (const varId of order) {
      const v = notebook.vars.get(varId)
      if (!v) continue

      const result = this.evaluateExpression(v.expr, context)
      evaluatedValues.set(varId, result)

      results.set(varId, {
        ...v,
        value: isScratchpadError(result) ? null : result,
        error: isScratchpadError(result) ? result : undefined,
      })
    }

    // 2. Cycles get explicit #CYCLE! error (Rule #3: Honest error)
    for (const varId of cycles) {
      const v = notebook.vars.get(varId)
      if (!v) continue

      results.set(varId, {
        ...v,
        value: null,
        error: ERR_CYCLE(),
      })
    }

    return results
  }

  private evaluateExpression(
    expr: string,
    context: { vars: Map<string, ScratchpadVar>; evaluatedValues: Map<string, unknown> }
  ): unknown {
    const ast = parse(expr)
    if (isScratchpadError(ast)) return ast

    return this.evaluateAST(ast, context)
  }

  private evaluateAST(
    node: ASTNode,
    context: { vars: Map<string, ScratchpadVar>; evaluatedValues: Map<string, unknown> }
  ): unknown {
    switch (node.type) {
      case 'number':
      case 'string':
        return node.value

      case 'variable': {
        const varId = this.findVarIdByName(node.name, context.vars)
        if (!varId) return ERR_REF(node.name)

        if (context.evaluatedValues.has(varId)) {
          return context.evaluatedValues.get(varId)
        }
        return ERR_REF(node.name)
      }

      case 'unary': {
        const operand = this.evaluateAST(node.operand, context)
        if (isScratchpadError(operand)) return operand

        if (node.op === '-') {
          if (typeof operand !== 'number') return ERR_VALUE('Unary minus requires number')
          return -operand
        }
        return operand
      }

      case 'binary': {
        const left = this.evaluateAST(node.left, context)
        const right = this.evaluateAST(node.right, context)

        if (isScratchpadError(left)) return left
        if (isScratchpadError(right)) return right

        if (typeof left !== 'number' || typeof right !== 'number') {
          return ERR_VALUE('Binary operations require numbers')
        }

        switch (node.op) {
          case '+': return left + right
          case '-': return left - right
          case '*': return left * right
          case '/':
            if (right === 0) return ERR_DIV0()
            return left / right
          case '^': return Math.pow(left, right)
          default:
            return ERR_VALUE(`Unknown operator: ${node.op}`)
        }
      }

      case 'call': {
        const funcs: Record<string, (...args: number[]) => number> = {
          sqrt: (x) => Math.sqrt(x),
          abs: (x) => Math.abs(x),
          sin: (x) => Math.sin(x),
          cos: (x) => Math.cos(x),
          tan: (x) => Math.tan(x),
          log: (x) => Math.log(x),
          exp: (x) => Math.exp(x),
          floor: (x) => Math.floor(x),
          ceil: (x) => Math.ceil(x),
          round: (x) => Math.round(x),
          min: (...args) => Math.min(...args),
          max: (...args) => Math.max(...args),
        }

        const func = funcs[node.name.toLowerCase()]
        if (!func) return ERR_NAME(node.name)

        const args: number[] = []
        for (const argNode of node.args) {
          const arg = this.evaluateAST(argNode, context)
          if (isScratchpadError(arg)) return arg
          if (typeof arg !== 'number') return ERR_VALUE(`Function ${node.name} requires numbers`)
          args.push(arg)
        }

        try {
          return func(...args)
        } catch (e) {
          return ERR_VALUE(`Error in ${node.name}: ${e}`)
        }
      }

      default:
        return ERR_VALUE('Unknown AST node')
    }
  }

  private findVarIdByName(name: string, vars: Map<string, ScratchpadVar>): string | null {
    const normalized = name.startsWith('$') ? name.slice(1).toLowerCase() : name.toLowerCase()
    for (const [id, v] of vars) {
      if (v.name.toLowerCase() === normalized) return id
    }
    return null
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📚 إدارة الدفاتر (Notebook Management)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  getActiveNotebook(): Notebook | null {
    if (!this.activeNotebookId) return null
    return this.notebooks.get(this.activeNotebookId) ?? null
  }

  getAllNotebooks(): Notebook[] {
    return Array.from(this.notebooks.values())
  }

  setActiveNotebook(id: string): boolean {
    if (!this.notebooks.has(id)) return false
    this.activeNotebookId = id
    this.emit({
      type: 'notebookLoaded',
      notebookId: id,
    })
    return true
  }

  loadNotebook(raw: Record<string, unknown> | Notebook): void {
    const notebook = normalizeNotebook(raw as any)
    this.notebooks.set(notebook.id, notebook)
    if (!this.activeNotebookId) {
      this.activeNotebookId = notebook.id
    }
    this.emit({
      type: 'notebookLoaded',
      notebookId: notebook.id,
    })
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔍 استعلامات (Queries)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  getVarValue(nameOrId: string, notebookId?: string): unknown {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) return null

    const v = findVar(notebook, nameOrId)
    if (!v) return null

    const computed = this.deriveVar(v.id, notebook.id)
    return computed?.value ?? null
  }

  getComputedVar(nameOrId: string, notebookId?: string): ComputedVar | null {
    const notebook = this.getNotebook(notebookId)
    if (!notebook) return null

    const v = findVar(notebook, nameOrId)
    if (!v) return null

    return this.deriveVar(v.id, notebook.id)
  }

  getAllComputedVars(notebookId?: string): Map<string, ComputedVar> {
    return this.deriveAll(notebookId)
  }

  listVars(notebookId?: string): ScratchpadVar[] {
    const nb = this.getNotebook(notebookId)
    if (!nb) return []
    return Array.from(nb.vars.values())
  }

  getVar(nameOrId: string, notebookId?: string): ScratchpadVar | null {
    const nb = this.getNotebook(notebookId)
    if (!nb) return null
    return findVar(nb, nameOrId)
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📡 الأحداث (Events)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  on(eventType: string, listener: (event: ScratchpadEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(listener)
  }

  off(eventType: string, listener: (event: ScratchpadEvent) => void): void {
    this.listeners.get(eventType)?.delete(listener)
  }

  emit(event: ScratchpadEvent): void {
    const listeners = this.listeners.get(event.type)
    if (!listeners) return

    for (const listener of listeners) {
      try {
        listener(event)
      } catch (e) {
        console.error('Error in event listener:', e)
      }
    }
  }

  subscribe(listener: (event: ScratchpadEvent) => void): () => void {
    const eventTypes = ['varChanged', 'varDeleted', 'notebookChanged', 'notebookLoaded', 'patchApplied']
    for (const et of eventTypes) {
      this.on(et, listener)
    }
    return () => {
      for (const et of eventTypes) {
        this.off(et, listener)
      }
    }
  }

  private getNotebook(notebookId?: string): Notebook | null {
    const id = notebookId ?? this.activeNotebookId
    if (!id) return null
    return this.notebooks.get(id) ?? null
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌐 Singleton Instance
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let engineInstance: ScratchpadEngine | null = null

export function getScratchpadEngine(): ScratchpadEngine {
  if (!engineInstance) {
    engineInstance = new ScratchpadEngine()
  }
  return engineInstance
}

export function resetScratchpadEngine(): void {
  engineInstance = null
}
