// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [LatexSymbols.ts] قاعدة بيانات رموز LaTeX
// ═══════════════════════════════════════════════════════════════

import type { SymbolDefinition, EnvironmentDefinition } from './LatexTypes';

export const GREEK_SYMBOLS: SymbolDefinition[] = [
  { command: '\\alpha', symbol: 'α', name: 'alpha', category: 'greek', description: 'ألفا' },
  { command: '\\beta', symbol: 'β', name: 'beta', category: 'greek', description: 'بيتا' },
  { command: '\\gamma', symbol: 'γ', name: 'gamma', category: 'greek', description: 'غاما' },
  { command: '\\pi', symbol: 'π', name: 'pi', category: 'greek', description: 'باي' },
  // Truncated for brevity, but let's add some more
  { command: '\\theta', symbol: 'θ', name: 'theta', category: 'greek', description: 'ثيتا' },
  { command: '\\Sigma', symbol: 'Σ', name: 'Sigma', category: 'greek' },
  { command: '\\Omega', symbol: 'Ω', name: 'Omega', category: 'greek' },
];

export const OPERATOR_SYMBOLS: SymbolDefinition[] = [
  { command: '\\pm', symbol: '±', name: 'pm', category: 'operators', description: 'زائد أو ناقص' },
  { command: '\\times', symbol: '×', name: 'times', category: 'operators', description: 'ضرب' },
  { command: '\\div', symbol: '÷', name: 'div', category: 'operators', description: 'قسمة' },
];

export const RELATION_SYMBOLS: SymbolDefinition[] = [
  {
    command: '\\leq',
    symbol: '≤',
    name: 'leq',
    category: 'relations',
    description: 'أصغر أو يساوي',
  },
  {
    command: '\\geq',
    symbol: '≥',
    name: 'geq',
    category: 'relations',
    description: 'أكبر أو يساوي',
  },
  { command: '\\neq', symbol: '≠', name: 'neq', category: 'relations', description: 'لا يساوي' },
  {
    command: '\\approx',
    symbol: '≈',
    name: 'approx',
    category: 'relations',
    description: 'تقريباً',
  },
];

export const ARROW_SYMBOLS: SymbolDefinition[] = [
  {
    command: '\\rightarrow',
    symbol: '→',
    name: 'rightarrow',
    category: 'arrows',
    description: 'سهم يمين',
  },
  {
    command: '\\leftarrow',
    symbol: '←',
    name: 'leftarrow',
    category: 'arrows',
    description: 'سهم يسار',
  },
  {
    command: '\\Rightarrow',
    symbol: '⇒',
    name: 'Rightarrow',
    category: 'arrows',
    description: 'يستلزم',
  },
];

export const SET_SYMBOLS: SymbolDefinition[] = [
  { command: '\\in', symbol: '∈', name: 'in', category: 'sets', description: 'ينتمي إلى' },
  { command: '\\notin', symbol: '∉', name: 'notin', category: 'sets', description: 'لا ينتمي' },
];

export const CALCULUS_SYMBOLS: SymbolDefinition[] = [
  { command: '\\sum', symbol: '∑', name: 'sum', category: 'calculus', description: 'مجموع' },
  { command: '\\int', symbol: '∫', name: 'int', category: 'calculus', description: 'تكامل' },
  { command: '\\infty', symbol: '∞', name: 'infty', category: 'calculus', description: 'لانهاية' },
];

export const LOGIC_SYMBOLS: SymbolDefinition[] = [
  { command: '\\forall', symbol: '∀', name: 'forall', category: 'logic', description: 'لكل' },
  { command: '\\exists', symbol: '∃', name: 'exists', category: 'logic', description: 'يوجد' },
];

export const GEOMETRY_SYMBOLS: SymbolDefinition[] = [
  { command: '\\angle', symbol: '∠', name: 'angle', category: 'geometry', description: 'زاوية' },
];

export const MISC_SYMBOLS: SymbolDefinition[] = [
  { command: '\\dots', symbol: '…', name: 'dots', category: 'misc', description: 'نقاط' },
];

export const FUNCTION_SYMBOLS: SymbolDefinition[] = [
  { command: '\\sin', symbol: 'sin', name: 'sin', category: 'functions', description: 'جيب' },
  { command: '\\cos', symbol: 'cos', name: 'cos', category: 'functions', description: 'جيب تمام' },
];

export const ALL_SYMBOLS: SymbolDefinition[] = [
  ...GREEK_SYMBOLS,
  ...OPERATOR_SYMBOLS,
  ...RELATION_SYMBOLS,
  ...ARROW_SYMBOLS,
  ...SET_SYMBOLS,
  ...CALCULUS_SYMBOLS,
  ...LOGIC_SYMBOLS,
  ...GEOMETRY_SYMBOLS,
  ...MISC_SYMBOLS,
  ...FUNCTION_SYMBOLS,
];

export function findSymbol(query: string): SymbolDefinition | null {
  const q = query.toLowerCase().trim();
  return (
    ALL_SYMBOLS.find(
      (s) =>
        s.command.toLowerCase() === q ||
        s.name.toLowerCase() === q ||
        s.symbol === q ||
        s.description?.toLowerCase() === q,
    ) ?? null
  );
}

export function searchSymbols(query: string): SymbolDefinition[] {
  if (!query.trim()) return ALL_SYMBOLS;
  const q = query.toLowerCase();
  return ALL_SYMBOLS.filter(
    (s) =>
      s.command.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.symbol.includes(q) ||
      (s.description?.toLowerCase().includes(q) ?? false),
  );
}

export function symbolsByCategory(category: SymbolDefinition['category']): SymbolDefinition[] {
  return ALL_SYMBOLS.filter((s) => s.category === category);
}

export const ENVIRONMENTS: EnvironmentDefinition[] = [
  { name: 'equation', category: 'equation', description: 'معادلة مرقمة' },
  { name: 'pmatrix', category: 'matrix', description: 'مصفوفة بأقواس' },
];

export function findEnvironment(name: string): EnvironmentDefinition | null {
  return ENVIRONMENTS.find((e) => e.name === name) ?? null;
}

export const CATEGORY_NAMES: Record<SymbolDefinition['category'], string> = {
  greek: 'الحروف اليونانية',
  operators: 'العمليات',
  relations: 'العلاقات',
  arrows: 'الأسهم',
  sets: 'نظرية المجموعات',
  calculus: 'التفاضل والتكامل',
  logic: 'المنطق',
  geometry: 'الهندسة',
  misc: 'متنوع',
  functions: 'الدوال',
};
