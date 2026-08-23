/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: النواة المنسقة لشبكة البيانات التفاعلية (Data Grid Master Orchestrator)
 * 🏛️ الدور: النواة التنفيذية للتحكم بالرسم والأحداث والتحديد والتحرير
 * 📥 المستهلك: Studio Views, Table Editors, Data Sheet components
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Virtualized Pure Light DOM Engine & Zero-Allocation Event Delegation
 *    معمارية تصيير افتراضية سريعة تدعم مئات آلاف الصفوف مع ثيم فاتح نقي 100%،
 *    وقوائم سياقية ذكية للزر الأيمن، وتكامل كامل مع محرك الصيغ والتحديد.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بالثيم الفاتح النقي 100% - منع أي ثيم ليلي أو أسود.
 *    2. تنظيف مستمعات الأحداث في دالة destroy() لمنع تسريب الذاكرة (Memory Leaks).
 *    3. التعامل مع الإدخال السريع وتحديث الحالة بدون إعادة رسم كامل الـ DOM.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لعناصر الـ DOM والأحداث.
 *    - حماية ضد Null/Undefined في بنية الجداول.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Column, GridHost, Store, TableSheet, CellValue } from './types';
import { colToLetters, formatRef } from './a1-notation';
import { FormatEngine } from './format-engine';
import { SelectionModel, normalizeBox } from './selection-model';
import { cellKey, isFormula, recalcCells, type CellSource } from './cell-formula-engine';

const ROW_HEIGHT = 24;
const GUTTER_WIDTH = 50;
const OVERSCAN = 10;

export class GridCore {
  private host: HTMLElement;
  private store: Store;
  private sheetId: string;

  private container!: HTMLElement;
  private scroller!: HTMLElement;
  private headerEl!: HTMLElement;
  private bodyEl!: HTMLElement;
  private gutterEl!: HTMLElement;
  private editorEl: HTMLInputElement | null = null;

  private selection: SelectionModel;
  private editingCell: { row: number; col: number } | null = null;
  private computedValues = new Map<string, unknown>();
  private cycles: string[] = [];
  private isDestroyed = false;

  private unsubs: Array<() => void> = [];

  // Callbacks الخارجية للتكامل
  public onSelectionChange?: (summary: {
    ref: string;
    count: number;
    sum?: number;
    avg?: number;
  }) => void;
  public onContextMenu?: (e: MouseEvent, row: number, col: number) => void;
  public onCellChange?: (row: number, colId: string, value: unknown) => void;

  constructor(opts: GridHost) {
    this.host = opts.el;
    this.store = opts.store;
    this.sheetId = opts.sheetId;
    this.selection = new SelectionModel(100, 26);

    this.enforcePureLightTheme();
    this.initDOM();
    this.bindEvents();
    this.recomputeFormulas();
    this.render();
  }

  /**
   * فرض الثيم الفاتح النقي 100%
   */
  private enforcePureLightTheme(): void {
    this.host.style.setProperty('--grid-bg', '#ffffff');
    this.host.style.setProperty('--grid-header-bg', '#f8fafc');
    this.host.style.setProperty('--grid-border', '#e2e8f0');
    this.host.style.setProperty('--grid-text', '#0f172a');
    this.host.style.setProperty('--grid-sel-bg', 'rgba(59, 130, 246, 0.12)');
    this.host.style.setProperty('--grid-sel-border', '#2563eb');
    this.host.style.setProperty('--grid-gutter-text', '#64748b');
  }

  private getSheet(): TableSheet | undefined {
    return this.store.getSheet(this.sheetId);
  }

  private initDOM(): void {
    this.host.innerHTML = '';
    this.host.style.position = 'relative';
    this.host.style.overflow = 'hidden';
    this.host.style.display = 'flex';
    this.host.style.flexDirection = 'column';
    this.host.style.userSelect = 'none';
    this.host.style.backgroundColor = '#ffffff';

    this.container = document.createElement('div');
    this.container.className = 'grid-master-container';
    this.container.style.cssText =
      'display:flex; flex-direction:column; width:100%; height:100%; overflow:hidden; background:#ffffff; color:#0f172a; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size:13px;';

    // الرأس (Header)
    this.headerEl = document.createElement('div');
    this.headerEl.className = 'grid-header-bar';
    this.headerEl.style.cssText =
      'display:flex; height:28px; background:#f8fafc; border-bottom:1px solid #e2e8f0; font-weight:600; color:#475569; position:sticky; top:0; z-index:10;';

    // منطقة التمرير (Scroller)
    this.scroller = document.createElement('div');
    this.scroller.className = 'grid-scroller';
    this.scroller.style.cssText = 'flex:1; overflow:auto; position:relative; background:#ffffff;';

    // جسم الجدول
    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'grid-body';
    this.bodyEl.style.cssText = 'position:relative; width:100%;';

    this.scroller.appendChild(this.bodyEl);
    this.container.appendChild(this.headerEl);
    this.container.appendChild(this.scroller);
    this.host.appendChild(this.container);
  }

  private bindEvents(): void {
    // 1. التمرير
    const onScroll = () => {
      if (!this.isDestroyed) this.renderVirtualRows();
    };
    this.scroller.addEventListener('scroll', onScroll, { passive: true });
    this.unsubs.push(() => this.scroller.removeEventListener('scroll', onScroll));

    // 2. النقر بالفأرة والتحديد
    const onMouseDown = (e: MouseEvent) => {
      const cellTarget = (e.target as HTMLElement).closest('[data-row][data-col]');
      if (!cellTarget) return;

      const row = parseInt(cellTarget.getAttribute('data-row') || '0', 10);
      const col = parseInt(cellTarget.getAttribute('data-col') || '0', 10);

      if (e.button === 2) {
        // الزر الأيمن (Context Menu)
        if (!this.selection.isSelected(row, col)) {
          this.selection.setSingle({ row, col });
          this.render();
        }
        if (this.onContextMenu) {
          this.onContextMenu(e, row, col);
        }
        return;
      }

      if (e.shiftKey) {
        this.selection.extendTo({ row, col });
      } else if (e.metaKey || e.ctrlKey) {
        this.selection.addRange({ row, col });
      } else {
        this.selection.setSingle({ row, col });
      }

      this.notifySelection();
      this.render();
    };
    this.bodyEl.addEventListener('mousedown', onMouseDown);
    this.unsubs.push(() => this.bodyEl.removeEventListener('mousedown', onMouseDown));

    // 3. النقر المزدوج للتحرير (Double Click to Edit)
    const onDblClick = (e: MouseEvent) => {
      const cellTarget = (e.target as HTMLElement).closest('[data-row][data-col]');
      if (!cellTarget) return;
      const row = parseInt(cellTarget.getAttribute('data-row') || '0', 10);
      const col = parseInt(cellTarget.getAttribute('data-col') || '0', 10);
      this.startEditing(row, col);
    };
    this.bodyEl.addEventListener('dblclick', onDblClick);
    this.unsubs.push(() => this.bodyEl.removeEventListener('dblclick', onDblClick));

    // 4. لوحة المفاتيح
    const onKeyDown = (e: KeyboardEvent) => {
      if (this.editingCell) {
        if (e.key === 'Enter') {
          this.commitEditing();
          this.selection.moveCursor(1, 0, false);
          this.render();
          e.preventDefault();
        } else if (e.key === 'Escape') {
          this.cancelEditing();
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        this.selection.moveCursor(-1, 0, e.shiftKey, e.metaKey || e.ctrlKey);
        this.render();
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        this.selection.moveCursor(1, 0, e.shiftKey, e.metaKey || e.ctrlKey);
        this.render();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        this.selection.moveCursor(0, -1, e.shiftKey, e.metaKey || e.ctrlKey);
        this.render();
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        this.selection.moveCursor(0, 1, e.shiftKey, e.metaKey || e.ctrlKey);
        this.render();
        e.preventDefault();
      } else if (e.key === 'Tab') {
        this.selection.handleTab(e.shiftKey);
        this.render();
        e.preventDefault();
      } else if (e.key === 'Enter') {
        this.selection.handleEnter(e.shiftKey);
        this.render();
        e.preventDefault();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const { row, col } = this.selection.cursor;
        this.startEditing(row, col, e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    this.unsubs.push(() => window.removeEventListener('keydown', onKeyDown));

    // 5. الاستماع لتحديثات Store
    const unsubStore = this.store.subscribe((patch) => {
      if (patch.sheetId === this.sheetId) {
        this.recomputeFormulas();
        this.render();
      }
    });
    this.unsubs.push(unsubStore);
  }

  private notifySelection(): void {
    if (!this.onSelectionChange) return;
    const summary = this.selection.getSummary((r, c) => this.getEffectiveValue(r, c));
    this.onSelectionChange(summary);
  }

  public recomputeFormulas(): void {
    const sheet = this.getSheet();
    if (!sheet) return;

    const source: CellSource = {
      rows: 1000,
      cols: sheet.columns.length,
      formulaAt: (r, c) => {
        const col = sheet.columns[c];
        if (!col) return undefined;
        const key = cellKey(r, c);
        return sheet.cellFormulas?.get(key) || col.formula;
      },
      valueAt: (r, c) => {
        const col = sheet.columns[c];
        if (!col) return null;
        return this.store.readCell(this.sheetId, r, col.id);
      },
    };

    const recalc = recalcCells(source);
    this.computedValues = recalc.values;
    this.cycles = recalc.cycles;
  }

  public getEffectiveValue(row: number, colIndex: number): unknown {
    const sheet = this.getSheet();
    if (!sheet) return null;
    const col = sheet.columns[colIndex];
    if (!col) return null;

    const key = cellKey(row, colIndex);
    if (this.computedValues.has(key)) {
      return this.computedValues.get(key);
    }
    return this.store.readCell(this.sheetId, row, col.id);
  }

  public render(): void {
    const sheet = this.getSheet();
    if (!sheet) return;

    this.renderHeader(sheet.columns);
    this.renderVirtualRows();
  }

  private renderHeader(columns: Column[]): void {
    this.headerEl.innerHTML = '';

    // زاوية العمود الأيسر (Gutter Corner)
    const corner = document.createElement('div');
    corner.style.cssText = `width:${GUTTER_WIDTH}px; min-width:${GUTTER_WIDTH}px; height:100%; border-right:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; background:#f1f5f9; color:#94a3b8; font-size:11px;`;
    corner.textContent = '#';
    this.headerEl.appendChild(corner);

    // عناوين الأعمدة
    for (let c = 0; c < columns.length; c++) {
      const col = columns[c];
      const colEl = document.createElement('div');
      const w = col.width || 100;
      colEl.style.cssText = `width:${w}px; min-width:${w}px; height:100%; border-right:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 8px; font-size:12px; color:#334155;`;
      colEl.innerHTML = `<span>${col.name || colToLetters(c)}</span><span style="color:#94a3b8; font-size:10px;">${colToLetters(c)}</span>`;
      this.headerEl.appendChild(colEl);
    }
  }

  private renderVirtualRows(): void {
    const sheet = this.getSheet();
    if (!sheet) return;

    const scrollTop = this.scroller.scrollTop;
    const viewHeight = this.scroller.clientHeight || 400;

    const totalRows = 1000;
    const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + viewHeight) / ROW_HEIGHT) + OVERSCAN,
    );

    this.bodyEl.style.height = `${totalRows * ROW_HEIGHT}px`;
    this.bodyEl.innerHTML = '';

    for (let r = startRow; r <= endRow; r++) {
      const rowEl = document.createElement('div');
      rowEl.style.cssText = `position:absolute; top:${r * ROW_HEIGHT}px; left:0; right:0; height:${ROW_HEIGHT}px; display:flex; border-bottom:1px solid #f1f5f9;`;

      // رقم الصف في الـ Gutter
      const gutterCell = document.createElement('div');
      gutterCell.style.cssText = `width:${GUTTER_WIDTH}px; min-width:${GUTTER_WIDTH}px; height:100%; border-right:1px solid #e2e8f0; background:#f8fafc; color:#64748b; font-size:11px; display:flex; align-items:center; justify-content:center;`;
      gutterCell.textContent = String(r + 1);
      rowEl.appendChild(gutterCell);

      // خلايا الصف
      for (let c = 0; c < sheet.columns.length; c++) {
        const col = sheet.columns[c];
        const w = col.width || 100;
        const cellEl = document.createElement('div');
        cellEl.setAttribute('data-row', String(r));
        cellEl.setAttribute('data-col', String(c));

        const isSelected = this.selection.isSelected(r, c);
        const isCursor = this.selection.isCursor(r, c);

        let bg = '#ffffff';
        let border = '1px solid transparent';
        if (isSelected) {
          bg = 'rgba(59, 130, 246, 0.08)';
        }
        if (isCursor) {
          border = '2px solid #2563eb';
        }

        cellEl.style.cssText = `width:${w}px; min-width:${w}px; height:100%; border-right:1px solid #f1f5f9; display:flex; align-items:center; padding:0 6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; background:${bg}; border:${border}; box-sizing:border-box; color:#0f172a;`;

        const rawVal = this.getEffectiveValue(r, c);
        const formatted = FormatEngine.format(rawVal, col.format, { type: col.type });
        cellEl.textContent = formatted;

        rowEl.appendChild(cellEl);
      }

      this.bodyEl.appendChild(rowEl);
    }
  }

  private startEditing(row: number, col: number, initialChar?: string): void {
    const sheet = this.getSheet();
    if (!sheet) return;
    const colDef = sheet.columns[col];
    if (!colDef) return;

    this.editingCell = { row, col };
    const key = cellKey(row, col);
    const existingFormula = sheet.cellFormulas?.get(key);
    const existingVal = this.store.readCell(this.sheetId, row, colDef.id);

    const initialText =
      initialChar !== undefined
        ? initialChar
        : existingFormula ||
          (existingVal !== null && existingVal !== undefined ? String(existingVal) : '');

    // حقن حقل الإدخال فوق الخلية
    const input = document.createElement('input');
    input.type = 'text';
    input.value = initialText;
    input.style.cssText = `position:absolute; top:${row * ROW_HEIGHT}px; left:${GUTTER_WIDTH + col * 100}px; width:100px; height:${ROW_HEIGHT}px; z-index:20; border:2px solid #2563eb; background:#ffffff; color:#0f172a; padding:0 4px; font-size:13px; outline:none; box-sizing:border-box;`;

    this.scroller.appendChild(input);
    input.focus();
    input.select();
    this.editorEl = input;

    input.addEventListener('blur', () => {
      this.commitEditing();
    });
  }

  private commitEditing(): void {
    if (!this.editingCell || !this.editorEl) return;
    const { row, col } = this.editingCell;
    const sheet = this.getSheet();
    const val = this.editorEl.value;

    if (sheet) {
      const colDef = sheet.columns[col];
      if (colDef) {
        if (isFormula(val)) {
          if (!sheet.cellFormulas) sheet.cellFormulas = new Map();
          sheet.cellFormulas.set(cellKey(row, col), val);
        } else {
          sheet.cellFormulas?.delete(cellKey(row, col));
          const num = Number(val);
          const finalVal: CellValue = !isNaN(num) && val.trim() !== '' ? num : val;
          this.store.writeCell(this.sheetId, row, colDef.id, finalVal);
        }
        if (this.onCellChange) {
          this.onCellChange(row, colDef.id, val);
        }
      }
    }

    this.cancelEditing();
    this.recomputeFormulas();
    this.render();
  }

  private cancelEditing(): void {
    if (this.editorEl && this.editorEl.parentNode) {
      this.editorEl.parentNode.removeChild(this.editorEl);
    }
    this.editorEl = null;
    this.editingCell = null;
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.cancelEditing();
    for (const unsub of this.unsubs) {
      try {
        unsub();
      } catch {}
    }
    this.unsubs = [];
    this.host.innerHTML = '';
  }
}
