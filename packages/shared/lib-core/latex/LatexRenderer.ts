// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [LatexRenderer.ts] رسم AST → SVG
// ═══════════════════════════════════════════════════════════════

import type { LatexNode, RenderOptions, RenderResult } from './LatexTypes';

export class LatexRenderer {
  private options: Required<RenderOptions>;
  private x: number = 0;
  private y: number = 0;
  private elements: string[] = [];

  constructor(options: RenderOptions = {}) {
    this.options = {
      fontSize: options.fontSize ?? 16,
      color: options.color ?? '#1a1a1a',
      width: options.width ?? 0,
      height: options.height ?? 0,
    };
  }

  render(nodes: LatexNode[]): RenderResult {
    this.elements = [];
    this.x = 0;
    this.y = this.options.fontSize;

    for (const node of nodes) {
      this.renderNode(node);
    }

    const width = this.options.width || this.x + 10;
    const height = this.options.height || this.y + 10;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    text { font-family: 'Latin Modern Math', 'STIX Two Math', 'Cambria Math', serif; }
  </style>
  ${this.elements.join('\n  ')}
</svg>`;

    return { svg, width, height };
  }

  private renderNode(node: LatexNode): void {
    switch (node.type) {
      case 'text':
        this.renderText(node);
        break;
      case 'symbol':
        this.renderSymbol(node);
        break;
      case 'command':
        this.renderCommand(node);
        break;
      case 'group':
        this.renderGroup(node);
        break;
      case 'superscript':
        this.renderSuperscript(node);
        break;
      case 'subscript':
        this.renderSubscript(node);
        break;
      case 'fraction':
        this.renderFraction(node);
        break;
      case 'sqrt':
        this.renderSqrt(node);
        break;
      case 'matrix':
        this.renderMatrix(node);
        break;
      case 'environment':
        this.renderEnvironment(node);
        break;
      case 'space':
        this.x += this.options.fontSize * 0.3;
        break;
      case 'color':
        this.renderColor(node);
        break;
      case 'error':
        this.renderError(node);
        break;
    }
  }

  private renderText(node: LatexNode): void {
    if (!node.value) return;
    this.elements.push(
      `<text x="${this.x}" y="${this.y}" fill="${this.options.color}" font-size="${this.options.fontSize}">${this.escapeXml(node.value)}</text>`,
    );
    this.x += node.value.length * this.options.fontSize * 0.6;
  }

  private renderSymbol(node: LatexNode): void {
    if (!node.value) return;
    this.elements.push(
      `<text x="${this.x}" y="${this.y}" fill="${this.options.color}" font-size="${this.options.fontSize}">${this.escapeXml(node.value)}</text>`,
    );
    this.x += this.options.fontSize * 0.7;
  }

  private renderCommand(node: LatexNode): void {
    if (node.children) {
      const savedFontSize = this.options.fontSize;
      if (node.command === 'textbf') {
        this.elements.push(`<g font-weight="bold">`);
        for (const child of node.children) this.renderNode(child);
        this.elements.push(`</g>`);
      } else if (node.command === 'textit') {
        this.elements.push(`<g font-style="italic">`);
        for (const child of node.children) this.renderNode(child);
        this.elements.push(`</g>`);
      } else {
        for (const child of node.children) this.renderNode(child);
      }
      this.options.fontSize = savedFontSize;
    } else {
      this.elements.push(
        `<text x="${this.x}" y="${this.y}" fill="${this.options.color}" font-size="${this.options.fontSize}">\\${node.command!}</text>`,
      );
      this.x += ((node.command?.length ?? 0) + 1) * this.options.fontSize * 0.5;
    }
  }

  private renderGroup(node: LatexNode): void {
    if (!node.children) return;
    for (const child of node.children) this.renderNode(child);
  }

  private renderSuperscript(node: LatexNode): void {
    if (!node.children) return;
    const savedFontSize = this.options.fontSize;
    const savedY = this.y;
    this.options.fontSize *= 0.7;
    this.y -= this.options.fontSize * 0.5;
    for (const child of node.children) this.renderNode(child);
    this.options.fontSize = savedFontSize;
    this.y = savedY;
  }

  private renderSubscript(node: LatexNode): void {
    if (!node.children) return;
    const savedFontSize = this.options.fontSize;
    const savedY = this.y;
    this.options.fontSize *= 0.7;
    this.y += this.options.fontSize * 0.3;
    for (const child of node.children) this.renderNode(child);
    this.options.fontSize = savedFontSize;
    this.y = savedY;
  }

  private renderFraction(node: LatexNode): void {
    if (!node.numerator || !node.denominator) return;

    const savedFontSize = this.options.fontSize;
    this.options.fontSize *= 0.85;

    const numStartX = this.x;
    for (const child of node.numerator) this.renderNode(child);
    const numWidth = this.x - numStartX;

    this.x = numStartX;
    this.y += this.options.fontSize * 1.2;
    for (const child of node.denominator) this.renderNode(child);
    const denWidth = this.x - numStartX;

    const lineWidth = Math.max(numWidth, denWidth) + 4;
    const lineY = this.y - this.options.fontSize * 0.6;
    this.elements.push(
      `<line x1="${numStartX - 2}" y1="${lineY}" x2="${numStartX + lineWidth}" y2="${lineY}" stroke="${this.options.color}" stroke-width="1"/>`,
    );

    this.x = numStartX + lineWidth + 4;
    this.y -= this.options.fontSize * 0.6;
    this.options.fontSize = savedFontSize;
  }

  private renderSqrt(node: LatexNode): void {
    if (!node.radicand) return;

    const startX = this.x;
    const startY = this.y;

    this.elements.push(
      `<path d="M ${startX} ${startY - this.options.fontSize * 0.3} L ${startX + 4} ${startY + 2} L ${startX + 8} ${startY - this.options.fontSize * 1.2} L ${startX + 12} ${startY - this.options.fontSize * 1.2}" stroke="${this.options.color}" stroke-width="1" fill="none"/>`,
    );
    this.x += 14;

    for (const child of node.radicand) this.renderNode(child);

    const endX = this.x;
    this.elements.push(
      `<line x1="${startX + 12}" y1="${startY - this.options.fontSize * 1.2}" x2="${endX}" y2="${startY - this.options.fontSize * 1.2}" stroke="${this.options.color}" stroke-width="1"/>`,
    );
  }

  private renderMatrix(node: LatexNode): void {
    if (!node.rows) return;

    const startX = this.x;
    const startY = this.y;

    if (node.matrixType === 'pmatrix') {
      this.elements.push(
        `<text x="${startX}" y="${startY}" fill="${this.options.color}" font-size="${this.options.fontSize * 1.5}">(</text>`,
      );
      this.x += this.options.fontSize * 0.5;
    } else if (node.matrixType === 'bmatrix') {
      this.elements.push(
        `<text x="${startX}" y="${startY}" fill="${this.options.color}" font-size="${this.options.fontSize * 1.5}">[</text>`,
      );
      this.x += this.options.fontSize * 0.5;
    }

    for (let i = 0; i < node.rows.length; i++) {
      const row = node.rows[i]!;
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]!;
        for (const child of cell) this.renderNode(child);
        if (j < row.length - 1) this.x += this.options.fontSize * 1.5;
      }
      if (i < node.rows.length - 1) {
        this.x =
          startX +
          (node.matrixType === 'pmatrix' || node.matrixType === 'bmatrix'
            ? this.options.fontSize * 0.5
            : 0);
        this.y += this.options.fontSize * 1.5;
      }
    }

    if (node.matrixType === 'pmatrix') {
      this.elements.push(
        `<text x="${this.x}" y="${startY}" fill="${this.options.color}" font-size="${this.options.fontSize * 1.5}">)</text>`,
      );
      this.x += this.options.fontSize * 0.5;
    } else if (node.matrixType === 'bmatrix') {
      this.elements.push(
        `<text x="${this.x}" y="${startY}" fill="${this.options.color}" font-size="${this.options.fontSize * 1.5}">]</text>`,
      );
      this.x += this.options.fontSize * 0.5;
    }
  }

  private renderEnvironment(node: LatexNode): void {
    if (!node.children) return;
    for (const child of node.children) this.renderNode(child);
  }

  private renderColor(node: LatexNode): void {
    if (!node.children || !node.color) return;
    const savedColor = this.options.color;
    this.options.color = node.color;
    for (const child of node.children) this.renderNode(child);
    this.options.color = savedColor;
  }

  private renderError(node: LatexNode): void {
    if (!node.error) return;
    this.elements.push(
      `<text x="${this.x}" y="${this.y}" fill="#dc3545" font-size="${this.options.fontSize}">[Error: ${this.escapeXml(node.error)}]</text>`,
    );
    this.x += (node.error.length + 10) * this.options.fontSize * 0.5;
  }

  private escapeXml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

export function renderLatex(nodes: LatexNode[], options?: RenderOptions): RenderResult {
  return new LatexRenderer(options).render(nodes);
}
