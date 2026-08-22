/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مستودع التخزين الدائم والتراجع الذري للمفكرة الحسابية (Scratchpad Store)
 * 🏛️ الدور: نواة إدارة الحالة والحفظ المحلي ودعم عمليات الـ Drop الصريحة
 * 📥 المستهلك: ScratchpadEngine, ScratchpadBindings, والواجهات الرسومية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Commit & Apply Patch with Explicit Drop Arrays
 *    - Snapshot History & LocalStorage Persistence (Document State Only)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم حفظ أي قيم مشتقة (value/error) أثناء الـ commit.
 *    2. تنفيذ عمليات الـ inverse بترتيب عكسي أثناء التراجع Undo.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التعامل مع LocalStorage بأمان تام وتفادي فشل التخزين.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import {
  type ScratchpadPatch,
  normalizeNotebook,
} from './types.ts'
import { getScratchpadEngine } from './ScratchpadEngine.ts'

export interface NotebookSnapshot {
  notebooks: Record<string, unknown>[]
  activeNotebookId: string | null
}

const STORAGE_KEY = 'scratchpad_notebooks_v2'

export class ScratchpadStore {
  private undoStack: ScratchpadPatch[][] = []
  private redoStack: ScratchpadPatch[][] = []
  private maxHistory = 100

  constructor() {
    this.loadFromStorage()
  }

  commit(patches: ScratchpadPatch[]): void {
    if (!patches || patches.length === 0) return

    const inverses: ScratchpadPatch[] = []

    for (const patch of patches) {
      const inverse = this.applyPatch(patch)
      if (inverse) {
        inverses.unshift(inverse)
      }
    }

    if (inverses.length > 0) {
      this.undoStack.push(inverses)
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift()
      }
      this.redoStack = []
    }

    this.saveToStorage()
  }

  undo(): boolean {
    const inversePatches = this.undoStack.pop()
    if (!inversePatches || inversePatches.length === 0) return false

    const redoPatches: ScratchpadPatch[] = []
    for (const patch of inversePatches) {
      const inverse = this.applyPatch(patch)
      if (inverse) {
        redoPatches.unshift(inverse)
      }
    }

    if (redoPatches.length > 0) {
      this.redoStack.push(redoPatches)
    }

    this.saveToStorage()
    return true
  }

  redo(): boolean {
    const redoPatches = this.redoStack.pop()
    if (!redoPatches || redoPatches.length === 0) return false

    const undoPatches: ScratchpadPatch[] = []
    for (const patch of redoPatches) {
      const inverse = this.applyPatch(patch)
      if (inverse) {
        undoPatches.unshift(inverse)
      }
    }

    if (undoPatches.length > 0) {
      this.undoStack.push(undoPatches)
    }

    this.saveToStorage()
    return true
  }

  private applyPatch(patch: ScratchpadPatch): ScratchpadPatch | null {
    const engine = getScratchpadEngine()

    switch (patch.op) {
      case 'setScratchpadVar': {
        const nb = engine.getAllNotebooks().find((n) => n.id === patch.notebookId)
        if (!nb) return null

        let v = nb.vars.get(patch.varId)
        const now = Date.now()

        if (!v) {
          v = {
            id: patch.varId,
            name: patch.props.name ?? 'untitled',
            expr: patch.props.expr ?? '0',
            type: patch.props.type,
            format: patch.props.format,
            description: patch.props.description,
            created: now,
            updated: now,
          }
          nb.vars.set(patch.varId, v)
        } else {
          if (patch.props.name !== undefined) v.name = patch.props.name
          if (patch.props.expr !== undefined) v.expr = patch.props.expr
          if (patch.props.type !== undefined) v.type = patch.props.type
          if (patch.props.format !== undefined) v.format = patch.props.format
          if (patch.props.description !== undefined) v.description = patch.props.description

          // Handle explicit drops
          if (patch.drop && Array.isArray(patch.drop)) {
            for (const key of patch.drop) {
              delete (v as any)[key]
            }
          }
          v.updated = now
        }

        const computed = engine.deriveVar(patch.varId, nb.id)
        engine.emit({
          type: 'varChanged',
          varId: patch.varId,
          name: v.name,
          value: computed?.value ?? null,
          notebookId: nb.id,
        })
        return patch.inverse ?? null
      }

      case 'deleteScratchpadVar': {
        const nb = engine.getAllNotebooks().find((n) => n.id === patch.notebookId)
        if (!nb) return null

        const existing = nb.vars.get(patch.varId)
        nb.vars.delete(patch.varId)

        engine.emit({
          type: 'varDeleted',
          varId: patch.varId,
          name: existing?.name,
          notebookId: nb.id,
        })
        return patch.inverse ?? null
      }

      case 'restoreScratchpadVar': {
        const nb = engine.getAllNotebooks().find((n) => n.id === patch.notebookId)
        if (!nb) return null

        nb.vars.set(patch.varId, { ...patch.data })
        const computed = engine.deriveVar(patch.varId, nb.id)

        engine.emit({
          type: 'varChanged',
          varId: patch.varId,
          name: patch.data.name,
          value: computed?.value ?? null,
          notebookId: nb.id,
        })
        return patch.inverse ?? null
      }

      case 'createNotebook': {
        const nb = normalizeNotebook({
          id: patch.notebookId,
          name: patch.name,
          vars: new Map(),
          lines: [],
        })
        engine.loadNotebook(nb as any)
        engine.emit({ type: 'notebookChanged', notebookId: patch.notebookId })
        return patch.inverse ?? null
      }

      case 'deleteNotebook': {
        const nb = engine.getAllNotebooks().find((n) => n.id === patch.notebookId)
        if (!nb) return null

        // Can't delete the only notebook
        if (engine.getAllNotebooks().length <= 1) return null

        // Internal reload
        const all = engine.getAllNotebooks().filter((n) => n.id !== patch.notebookId)
        engine.setActiveNotebook(all[0].id)
        engine.emit({ type: 'notebookChanged', notebookId: patch.notebookId })
        return patch.inverse ?? null
      }

      case 'restoreNotebook': {
        engine.loadNotebook(patch.data as any)
        engine.emit({ type: 'notebookChanged', notebookId: patch.data.id })
        return patch.inverse ?? null
      }

      case 'renameNotebook': {
        const nb = engine.getAllNotebooks().find((n) => n.id === patch.notebookId)
        if (!nb) return null
        nb.name = patch.newName
        nb.updated = Date.now()
        engine.emit({ type: 'notebookChanged', notebookId: nb.id })
        return patch.inverse ?? null
      }

      default:
        return null
    }
  }

  saveToStorage(): void {
    try {
      const engine = getScratchpadEngine()
      const rawNotebooks = engine.getAllNotebooks().map((nb) => ({
        id: nb.id,
        name: nb.name,
        created: nb.created,
        updated: nb.updated,
        vars: Array.from(nb.vars.entries()),
        lines: nb.lines,
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawNotebooks))
    } catch (e) {
      console.warn('ScratchpadStore: Failed to save to localStorage', e)
    }
  }

  loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        const engine = getScratchpadEngine()
        for (const item of parsed) {
          engine.loadNotebook(item)
        }
      }
    } catch (e) {
      console.warn('ScratchpadStore: Failed to load from localStorage', e)
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  clearHistory(): void {
    this.undoStack = []
    this.redoStack = []
  }
}

let storeInstance: ScratchpadStore | null = null

export function getScratchpadStore(): ScratchpadStore {
  if (!storeInstance) {
    storeInstance = new ScratchpadStore()
  }
  return storeInstance
}
