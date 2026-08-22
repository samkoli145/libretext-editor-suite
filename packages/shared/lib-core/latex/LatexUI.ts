// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [LatexUI.ts] منتقي رموز LaTeX
// ═══════════════════════════════════════════════════════════════

import {
  ALL_SYMBOLS,
  CATEGORY_NAMES,
  searchSymbols,
  symbolsByCategory,
} from './LatexSymbols';
import type { SymbolDefinition } from './LatexTypes';

export class SymbolPicker {
  private host: HTMLElement
  private onSelect: (symbol: SymbolDefinition) => void
  private currentCategory: SymbolDefinition['category'] | 'all' = 'all'
  private searchQuery: string = ''

  constructor(host: HTMLElement, onSelect: (symbol: SymbolDefinition) => void) {
    this.host = host
    this.onSelect = onSelect
    this.render()
  }

  private render(): void {
    this.host.innerHTML = ''
    this.host.classList.add('latex-picker')
    this.host.style.cssText = `
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px;
      font-family: system-ui, sans-serif;
    `

    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = 'بحث عن رمز...'
    searchInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 14px;
    `
    searchInput.addEventListener('input', () => {
      this.searchQuery = searchInput.value
      this.renderSymbols()
    })
    this.host.appendChild(searchInput)

    const categories = document.createElement('div')
    categories.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 12px;
    `

    const allButton = this.createCategoryButton('الكل', 'all')
    categories.appendChild(allButton)

    for (const [key, name] of Object.entries(CATEGORY_NAMES)) {
      const button = this.createCategoryButton(name, key as SymbolDefinition['category'])
      categories.appendChild(button)
    }
    this.host.appendChild(categories)

    const symbolsContainer = document.createElement('div')
    symbolsContainer.id = 'latex-symbols'
    symbolsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
    `
    this.host.appendChild(symbolsContainer)

    this.renderSymbols()
  }

  private createCategoryButton(label: string, category: SymbolDefinition['category'] | 'all'): HTMLButtonElement {
    const button = document.createElement('button')
    button.textContent = label
    button.style.cssText = `
      padding: 6px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: ${this.currentCategory === category ? '#0066cc' : '#ffffff'};
      color: ${this.currentCategory === category ? '#ffffff' : '#1a1a1a'};
      cursor: pointer;
      font-size: 13px;
    `
    button.addEventListener('click', () => {
      this.currentCategory = category
      this.render()
    })
    return button
  }

  private renderSymbols(): void {
    const container = this.host.querySelector('#latex-symbols')
    if (!container) return

    container.innerHTML = ''

    let symbols: SymbolDefinition[]
    if (this.searchQuery) {
      symbols = searchSymbols(this.searchQuery)
    } else if (this.currentCategory === 'all') {
      symbols = ALL_SYMBOLS
    } else {
      symbols = symbolsByCategory(this.currentCategory)
    }

    for (const symbol of symbols) {
      const button = this.createSymbolButton(symbol)
      container.appendChild(button)
    }
  }

  private createSymbolButton(symbol: SymbolDefinition): HTMLButtonElement {
    const button = document.createElement('button')
    button.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 4px;">${symbol.symbol}</div>
      <div style="font-size: 10px; color: #666;">${symbol.command}</div>
    `
    button.style.cssText = `
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
      text-align: center;
      transition: background 0.15s;
    `
    button.addEventListener('mouseenter', () => {
      button.style.background = '#f5f5f5'
    })
    button.addEventListener('mouseleave', () => {
      button.style.background = '#ffffff'
    })
    button.addEventListener('click', () => {
      this.onSelect(symbol)
    })
    return button
  }
}

export function createSymbolPicker(
  host: HTMLElement,
  onSelect: (symbol: SymbolDefinition) => void,
): SymbolPicker {
  return new SymbolPicker(host, onSelect)
}
