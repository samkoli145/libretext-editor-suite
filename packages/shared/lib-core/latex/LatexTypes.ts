// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [LatexTypes.ts] أنواع محرك LaTeX العلمي
// ═══════════════════════════════════════════════════════════════

export type LatexNodeType =
  | 'text'
  | 'symbol'
  | 'command'
  | 'group'
  | 'superscript'
  | 'subscript'
  | 'fraction'
  | 'sqrt'
  | 'matrix'
  | 'environment'
  | 'space'
  | 'color'
  | 'error'

export interface LatexNode {
  type: LatexNodeType
  value?: string
  children?: LatexNode[]
  position?: number
  command?: string
  numerator?: LatexNode[]
  denominator?: LatexNode[]
  radicand?: LatexNode[]
  index?: LatexNode[]
  rows?: LatexNode[][][]
  matrixType?: 'pmatrix' | 'bmatrix' | 'vmatrix' | 'Vmatrix' | 'matrix'
  environment?: string
  color?: string
  error?: string
}

export interface LatexParseResult {
  ok: boolean
  ast?: LatexNode[]
  error?: string
  position?: number
}

export interface RenderOptions {
  fontSize?: number
  color?: string
  width?: number
  height?: number
}

export interface RenderResult {
  svg: string
  width: number
  height: number
}

export type SymbolCategory =
  | 'greek'
  | 'operators'
  | 'relations'
  | 'arrows'
  | 'sets'
  | 'calculus'
  | 'logic'
  | 'geometry'
  | 'misc'
  | 'functions'

export interface SymbolDefinition {
  command: string
  symbol: string
  name: string
  category: SymbolCategory
  description?: string
}

export type EnvironmentCategory =
  | 'equation'
  | 'matrix'
  | 'array'

export interface EnvironmentDefinition {
  name: string
  category: EnvironmentCategory
  description?: string
}
