// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [LatexParser.ts] محلل LaTeX → AST
// ═══════════════════════════════════════════════════════════════

import type { LatexNode, LatexParseResult } from './LatexTypes';
import { findSymbol } from './LatexSymbols';

export class LatexParser {
  private input: string
  private pos: number = 0
  private errors: Array<{ message: string; position: number }> = []

  constructor(input: string) {
    this.input = input
  }

  parse(): LatexParseResult {
    try {
      const ast = this.parseExpression()
      if (this.pos < this.input.length) {
        this.errors.push({
          message: `Unexpected character: ${this.input[this.pos]}`,
          position: this.pos,
        })
      }
      return {
        ok: this.errors.length === 0,
        ast,
        ...(this.errors.length > 0 && {
          error: this.errors[0].message,
          position: this.errors[0].position,
        }),
      }
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
        position: this.pos,
      }
    }
  }

  private parseExpression(): LatexNode[] {
    const nodes: LatexNode[] = []
    while (this.pos < this.input.length && this.input[this.pos] !== '}') {
      const node = this.parseNode()
      if (node) nodes.push(node)
    }
    return nodes
  }

  private parseNode(): LatexNode | null {
    if (this.pos >= this.input.length) return null

    const c = this.input[this.pos]

    if (c === ' ' || c === '\t' || c === '\n') {
      this.pos++
      return { type: 'space', position: this.pos - 1 }
    }

    if (c === '\\') {
      return this.parseCommand()
    }

    if (c === '{') {
      return this.parseGroup()
    }

    if (c === '^') {
      this.pos++
      const base = this.parseAtom()
      return { type: 'superscript', children: [base], position: this.pos - 1 }
    }

    if (c === '_') {
      this.pos++
      const base = this.parseAtom()
      return { type: 'subscript', children: [base], position: this.pos - 1 }
    }

    return this.parseText()
  }

  private parseCommand(): LatexNode {
    const startPos = this.pos
    this.pos++

    let command = ''
    while (this.pos < this.input.length && /[a-zA-Z]/.test(this.input[this.pos])) {
      command += this.input[this.pos]
      this.pos++
    }

    if (!command) {
      if (this.pos < this.input.length) {
        command = this.input[this.pos]
        this.pos++
      }
    }

    while (this.pos < this.input.length && this.input[this.pos] === ' ') {
      this.pos++
    }

    switch (command) {
      case 'frac':
        return this.parseFraction(startPos)
      case 'sqrt':
        return this.parseSqrt(startPos)
      case 'begin':
        return this.parseEnvironment(startPos)
      case 'text':
      case 'mathrm':
      case 'textbf':
      case 'textit':
        return this.parseTextCommand(command, startPos)
      case 'color':
        return this.parseColor(startPos)
      default:
        const symbol = findSymbol(`\\${command}`)
        if (symbol) {
          return {
            type: 'symbol',
            value: symbol.symbol,
            command: `\\${command}`,
            position: startPos,
          }
        }
        return {
          type: 'command',
          command,
          position: startPos,
        }
    }
  }

  private parseFraction(startPos: number): LatexNode {
    const numerator = this.parseArgument()
    const denominator = this.parseArgument()
    return {
      type: 'fraction',
      numerator,
      denominator,
      position: startPos,
    }
  }

  private parseSqrt(startPos: number): LatexNode {
    let index: LatexNode[] | undefined
    if (this.pos < this.input.length && this.input[this.pos] === '[') {
      this.pos++
      index = []
      while (this.pos < this.input.length && this.input[this.pos] !== ']') {
        const node = this.parseNode()
        if (node) index.push(node)
      }
      if (this.pos < this.input.length) this.pos++
    }
    const radicand = this.parseArgument()
    return {
      type: 'sqrt',
      radicand,
      index,
      position: startPos,
    }
  }

  private parseEnvironment(startPos: number): LatexNode {
    const envName = this.parseArgumentText()
    const content: LatexNode[] = []
    const endTag = `\\end{${envName}}`
    while (this.pos < this.input.length) {
      if (this.input.slice(this.pos, this.pos + endTag.length) === endTag) {
        this.pos += endTag.length
        break
      }
      const node = this.parseNode()
      if (node) content.push(node)
    }

    if (['pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix', 'matrix'].includes(envName)) {
      return this.parseMatrix(envName as any, content, startPos)
    }

    return {
      type: 'environment',
      environment: envName,
      children: content,
      position: startPos,
    }
  }

  private parseMatrix(
    matrixType: 'pmatrix' | 'bmatrix' | 'vmatrix' | 'Vmatrix' | 'matrix',
    content: LatexNode[],
    startPos: number,
  ): LatexNode {
    const rows: LatexNode[][] = []
    let currentRow: LatexNode[] = []

    for (const node of content) {
      if (node.type === 'command' && node.command === '\\') {
        rows.push(currentRow)
        currentRow = []
      } else if (node.type === 'text' && node.value === '&') {
        currentRow.push(node)
      } else {
        currentRow.push(node)
      }
    }
    if (currentRow.length > 0) rows.push(currentRow)

    const matrix: LatexNode[][][] = rows.map(row => {
      const cols: LatexNode[][] = [[]]
      for (const node of row) {
        if (node.type === 'text' && node.value === '&') {
          cols.push([])
        } else {
          cols[cols.length - 1].push(node)
        }
      }
      return cols
    })

    return {
      type: 'matrix',
      matrixType,
      rows: matrix,
      position: startPos,
    }
  }

  private parseTextCommand(command: string, startPos: number): LatexNode {
    const content = this.parseArgument()
    return {
      type: 'command',
      command,
      children: content,
      position: startPos,
    }
  }

  private parseColor(startPos: number): LatexNode {
    const color = this.parseArgumentText()
    const content = this.parseArgument()
    return {
      type: 'color',
      color,
      children: content,
      position: startPos,
    }
  }

  private parseGroup(): LatexNode {
    const startPos = this.pos
    this.pos++
    const content = this.parseExpression()
    if (this.pos < this.input.length && this.input[this.pos] === '}') {
      this.pos++
    } else {
      this.errors.push({
        message: 'Missing closing brace',
        position: this.pos,
      })
    }
    return {
      type: 'group',
      children: content,
      position: startPos,
    }
  }

  private parseAtom(): LatexNode {
    if (this.pos >= this.input.length) {
      return { type: 'text', value: '', position: this.pos }
    }

    if (this.input[this.pos] === '{') {
      return this.parseGroup()
    }

    const node = this.parseNode()
    return node ?? { type: 'text', value: '', position: this.pos }
  }

  private parseArgument(): LatexNode[] {
    if (this.pos >= this.input.length) {
      this.errors.push({
        message: 'Missing argument',
        position: this.pos,
      })
      return []
    }

    if (this.input[this.pos] === '{') {
      this.pos++
      const content = this.parseExpression()
      if (this.pos < this.input.length && this.input[this.pos] === '}') {
        this.pos++
      } else {
        this.errors.push({
          message: 'Missing closing brace',
          position: this.pos,
        })
      }
      return content
    }

    const node = this.parseNode()
    return node ? [node] : []
  }

  private parseArgumentText(): string {
    if (this.pos >= this.input.length || this.input[this.pos] !== '{') {
      this.errors.push({
        message: 'Missing argument',
        position: this.pos,
      })
      return ''
    }

    this.pos++
    let text = ''
    while (this.pos < this.input.length && this.input[this.pos] !== '}') {
      text += this.input[this.pos]
      this.pos++
    }
    if (this.pos < this.input.length) this.pos++
    return text
  }

  private parseText(): LatexNode {
    const startPos = this.pos
    let text = ''
    while (this.pos < this.input.length) {
      const c = this.input[this.pos]
      if (c === '\\' || c === '{' || c === '}' || c === '^' || c === '_' || c === ' ') {
        break
      }
      text += c
      this.pos++
    }
    return {
      type: 'text',
      value: text,
      position: startPos,
    }
  }
}

export function parseLatex(input: string): LatexParseResult {
  return new LatexParser(input).parse()
}
