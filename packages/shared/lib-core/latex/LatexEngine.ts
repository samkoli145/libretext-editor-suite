// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [LatexEngine.ts] نواة محرك LaTeX الموجهة
// ═══════════════════════════════════════════════════════════════

import type { RenderOptions, RenderResult } from './LatexTypes';
import { parseLatex } from './LatexParser';
import { renderLatex } from './LatexRenderer';

export class LatexEngine {
  compile(input: string, options?: RenderOptions): RenderResult {
    const parseResult = parseLatex(input);
    if (!parseResult.ok || !parseResult.ast) {
      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="30">
  <text x="10" y="20" fill="#dc3545" font-size="14">[Error: ${parseResult.error}]</text>
</svg>`,
        width: 200,
        height: 30,
      };
    }
    return renderLatex(parseResult.ast, options);
  }

  validate(input: string): { valid: boolean; error?: string } {
    const result = parseLatex(input);
    return {
      valid: result.ok,
      error: result.error,
    };
  }
}

export const latexEngine = new LatexEngine();

export function compileLatex(input: string, options?: RenderOptions): RenderResult {
  return latexEngine.compile(input, options);
}
