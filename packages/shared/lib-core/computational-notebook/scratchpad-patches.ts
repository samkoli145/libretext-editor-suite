/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: مصنع التصحيحات الذرية المنقى (Refined Patch Factory)
 * 🏛️ الدور: نواة إنتاج التصحيحات مع دعم الحذف الصريح (Drop Array Support)
 * 📥 المستهلك: ScratchpadEngine, ScratchpadStore
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Patch Factory with Explicit Drop & Atomic Inverse Generation
 *    - Unbind Orphans on Delete in the same commit
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الـ Inverse يجب أن يعيد حقول الـ drop كـ props، والحقول المضافة كـ drop.
 *    2. منع التعديل المباشر على كائنات المتغيرات.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - توليد معرفات UUID فريدة لا تتكرر
 *    - فحص صحة أسماء المتغيرات قبل إصدار الـ Patch
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

import {
  type ScratchpadPatch,
  type ScratchpadVar,
  type Notebook,
  type ScratchpadColumnType,
  isValidVarName,
  isValidVarId,
} from './types.ts'

export function generateVarId(): string {
  return `var_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

export function findVar(notebook: Notebook, nameOrId: string): ScratchpadVar | undefined {
  if (isValidVarId(nameOrId)) {
    return notebook.vars.get(nameOrId)
  }
  const str = String(nameOrId)
  const clean = str.startsWith('$') ? str.slice(1).toLowerCase() : str.toLowerCase()
  for (const v of notebook.vars.values()) {
    if (v.name.toLowerCase() === clean) {
      return v
    }
  }
  return undefined
}

export function setScratchpadVar(
  notebook: Notebook,
  name: string,
  expr: string,
  options?: {
    type?: ScratchpadColumnType
    format?: string
    description?: string
  }
): ScratchpadPatch[] {
  const cleanName = name.startsWith('$') ? name.slice(1).toLowerCase() : name.toLowerCase()
  if (!isValidVarName(cleanName)) {
    throw new Error(`Invalid variable name: "${name}"`)
  }

  const existing = findVar(notebook, cleanName)
  const varId = existing ? existing.id : generateVarId()

  const props: {
    name: string
    expr: string
    type?: ScratchpadColumnType
    format?: string
    description?: string
  } = {
    name: cleanName,
    expr,
  }

  const drop: string[] = []

  if (options?.type !== undefined) {
    props.type = options.type
  } else if (existing?.type !== undefined) {
    drop.push('type')
  }

  if (options?.format !== undefined && options.format !== '') {
    props.format = options.format
  } else if (existing?.format !== undefined) {
    drop.push('format')
  }

  if (options?.description !== undefined && options.description !== '') {
    props.description = options.description
  } else if (existing?.description !== undefined) {
    drop.push('description')
  }

  // Calculate strict inverse
  let inverse: ScratchpadPatch
  if (existing) {
    const invProps: Record<string, unknown> = {
      name: existing.name,
      expr: existing.expr,
    }
    const invDrop: string[] = []

    if (existing.type !== undefined) invProps.type = existing.type
    else if (props.type !== undefined) invDrop.push('type')

    if (existing.format !== undefined) invProps.format = existing.format
    else if (props.format !== undefined) invDrop.push('format')

    if (existing.description !== undefined) invProps.description = existing.description
    else if (props.description !== undefined) invDrop.push('description')

    inverse = {
      op: 'setScratchpadVar',
      notebookId: notebook.id,
      varId: existing.id,
      props: invProps,
      drop: invDrop.length > 0 ? invDrop : undefined,
      inverse: { op: 'noop' },
    }
  } else {
    inverse = {
      op: 'deleteScratchpadVar',
      notebookId: notebook.id,
      varId,
      inverse: { op: 'noop' },
    }
  }

  return [
    {
      op: 'setScratchpadVar',
      notebookId: notebook.id,
      varId,
      props,
      drop: drop.length > 0 ? drop : undefined,
      inverse,
    },
  ]
}

export function deleteScratchpadVar(notebook: Notebook, nameOrId: string): ScratchpadPatch[] {
  const existing = findVar(notebook, nameOrId)
  if (!existing) {
    throw new Error(`Variable not found: "${nameOrId}"`)
  }

  const patches: ScratchpadPatch[] = [
    {
      op: 'unbindScratchpadVar',
      varId: existing.id,
      inverse: { op: 'noop' },
    },
    {
      op: 'deleteScratchpadVar',
      notebookId: notebook.id,
      varId: existing.id,
      inverse: {
        op: 'restoreScratchpadVar',
        notebookId: notebook.id,
        varId: existing.id,
        data: { ...existing },
      },
    },
  ]

  return patches
}

export function renameScratchpadVar(
  notebook: Notebook,
  oldNameOrId: string,
  newName: string
): ScratchpadPatch[] {
  const existing = findVar(notebook, oldNameOrId)
  if (!existing) {
    throw new Error(`Variable not found: "${oldNameOrId}"`)
  }

  const cleanNewName = newName.startsWith('$') ? newName.slice(1).toLowerCase() : newName.toLowerCase()
  if (!isValidVarName(cleanNewName)) {
    throw new Error(`Invalid new variable name: "${newName}"`)
  }

  const collision = findVar(notebook, cleanNewName)
  if (collision && collision.id !== existing.id) {
    throw new Error(`Variable name already in use: "${cleanNewName}"`)
  }

  const inverse: ScratchpadPatch = {
    op: 'setScratchpadVar',
    notebookId: notebook.id,
    varId: existing.id,
    props: { name: existing.name, expr: existing.expr },
    inverse: { op: 'noop' },
  }

  return [
    {
      op: 'setScratchpadVar',
      notebookId: notebook.id,
      varId: existing.id,
      props: { name: cleanNewName, expr: existing.expr },
      inverse,
    },
  ]
}

export function createNotebook(notebookId: string, name: string): ScratchpadPatch[] {
  return [
    {
      op: 'createNotebook',
      notebookId,
      name,
      inverse: {
        op: 'deleteNotebook',
        notebookId,
      },
    },
  ]
}

export function deleteNotebook(notebook: Notebook): ScratchpadPatch[] {
  return [
    {
      op: 'deleteNotebook',
      notebookId: notebook.id,
      inverse: {
        op: 'restoreNotebook',
        data: {
          ...notebook,
          vars: new Map(notebook.vars),
          lines: [...notebook.lines],
        },
      },
    },
  ]
}

export function renameNotebook(notebook: Notebook, newName: string): ScratchpadPatch[] {
  return [
    {
      op: 'renameNotebook',
      notebookId: notebook.id,
      newName,
      inverse: {
        op: 'renameNotebook',
        notebookId: notebook.id,
        newName: notebook.name,
      },
    },
  ]
}
