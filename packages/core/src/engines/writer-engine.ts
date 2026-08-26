// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
// ═══════════════════════════════════════════════════════════════
// 📌 ملخص توجيهي | Guiding Summary
// ═══════════════════════════════════════════════════════════════
// [writer-engine.ts] محرك المستندات — Writer Engine
//
// هذا الملف يجيب: "كيف نحرر مستنداً غنياً بدقة؟"
//
// المبادئ المعمارية:
//
// 1. IMMUTABLE OPERATIONS:
//    كل عملية تعيد Document جديد — الأصلي لا يتغير.
//    هذا يجعل كل تعديل قابلاً للتراجع دون حفظ نسخ.
//
// 2. BLOCKS ARE THE ATOM:
//    المستند = قائمة كتل. كل عملية هي عملية على الكتل.
//    لا تحرير مباشر للنص الخام — فقط عبر الكتل.
//
// 3. MARKDOWN FIDELITY:
//    التصدير والاستيراد يحافظان على المعنى، لا البايتات.
//    ما يُصدَّر ثم يُستورد يعطي نفس المستند.
//
// 4. DERIVED METADATA:
//    عدد الكلمات والصفحات يُشتق، لا يُخزن.
//    التغيير في كتلة واحدة يُحدّث كل الإحصائيات.
// ═══════════════════════════════════════════════════════════════
// ©️ جميع الحقوق محفوظة ©️ - 2026
// ═══════════════════════════════════════════════════════════════

import { type TableBlockNode, createTableCell, createTableRow, createTableBlock } from '../blocks/table-block';
import type { BaseBlockNode, TraitKey } from '../ast/types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. DOCUMENT MODEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface WriterDocument {
  id: string;
  title: string;
  blocks: WriterBlock[];
  metadata: DocumentMetadata;
  styles: DocumentStyles;
}

export interface DocumentMetadata {
  author: string;
  createdAt: string;
  updatedAt: string;
  language: 'ar' | 'en';
}

export interface DocumentStyles {
  defaultFont: string;
  defaultSize: number;
  defaultLineHeight: number;
  defaultDirection: 'ltr' | 'rtl';
  pageWidth: number;
  pageHeight: number;
  margins: { top: number; right: number; bottom: number; left: number };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. BLOCK TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type WriterBlockType =
  | 'paragraph'
  | 'heading'
  | 'blockquote'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'codeBlock'
  | 'horizontalRule'
  | 'image'
  | 'table'
  | 'mathBlock';

export interface TextMark {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link';
  attrs?: Record<string, unknown>;
}

export interface WriterBlock {
  id: string;
  type: WriterBlockType;
  content: string;
  marks?: TextMark[];
  attrs?: Record<string, unknown>;
  children?: WriterBlock[]; // للقوائم المتداخلة
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. SEARCH RESULT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface SearchResult {
  blockId: string;
  position: number;
  length: number;
  text: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. WRITER ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let blockSeq = 0;
function mintBlockId(): string {
  return `blk-${Date.now().toString(36)}-${(blockSeq++).toString(36)}`;
}

export class WriterEngine {
  // ── Factory ──

  /** إنشاء مستند فارغ. */
  createDocument(title: string, language: 'ar' | 'en' = 'ar'): WriterDocument {
    return {
      id: mintBlockId(),
      title,
      blocks: [{ id: mintBlockId(), type: 'paragraph', content: '' }],
      metadata: {
        author: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language,
      },
      styles: {
        defaultFont: 'system-ui',
        defaultSize: 16,
        defaultLineHeight: 1.6,
        defaultDirection: language === 'ar' ? 'rtl' : 'ltr',
        pageWidth: 794, // A4 portrait
        pageHeight: 1123,
        margins: { top: 96, right: 96, bottom: 96, left: 96 },
      },
    };
  }

  // ── Block Operations ──

  /** إدراج كتلة بعد كتلة معينة. */
  insertBlock(doc: WriterDocument, block: WriterBlock, afterBlockId?: string): WriterDocument {
    const blocks = [...doc.blocks];
    const idx = afterBlockId
      ? blocks.findIndex(b => b.id === afterBlockId) + 1
      : blocks.length;

    blocks.splice(idx, 0, { ...block, id: block.id || mintBlockId() });
    return { ...doc, blocks, metadata: { ...doc.metadata, updatedAt: new Date().toISOString() } };
  }

  /** حذف كتلة. */
  removeBlock(doc: WriterDocument, blockId: string): WriterDocument {
    if (doc.blocks.length <= 1) return doc; // لا يمكن حذف الكتلة الأخيرة
    return {
      ...doc,
      blocks: doc.blocks.filter(b => b.id !== blockId),
      metadata: { ...doc.metadata, updatedAt: new Date().toISOString() },
    };
  }

  /** نقل كتلة إلى موضع جديد. */
  moveBlock(doc: WriterDocument, blockId: string, newIndex: number): WriterDocument {
    const blocks = [...doc.blocks];
    const currentIdx = blocks.findIndex(b => b.id === blockId);
    if (currentIdx === -1 || currentIdx === newIndex) return doc;

    const [block] = blocks.splice(currentIdx, 1) as [WriterBlock];
    const clampedIdx = Math.max(0, Math.min(newIndex, blocks.length));
    blocks.splice(clampedIdx, 0, block);

    return { ...doc, blocks, metadata: { ...doc.metadata, updatedAt: new Date().toISOString() } };
  }

  /** تكرار كتلة. */
  duplicateBlock(doc: WriterDocument, blockId: string): WriterDocument {
    const idx = doc.blocks.findIndex(b => b.id === blockId);
    if (idx === -1) return doc;

    const original = doc.blocks[idx];
    const copy: WriterBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: mintBlockId(),
    };

    const blocks = [...doc.blocks];
    blocks.splice(idx + 1, 0, copy);
    return { ...doc, blocks, metadata: { ...doc.metadata, updatedAt: new Date().toISOString() } };
  }

  /** استبدال كتلة بأخرى. */
  replaceBlock(doc: WriterDocument, blockId: string, newBlock: WriterBlock): WriterDocument {
    return {
      ...doc,
      blocks: doc.blocks.map(b => b.id === blockId ? { ...newBlock, id: blockId } : b),
      metadata: { ...doc.metadata, updatedAt: new Date().toISOString() },
    };
  }

  // ── Text Editing ──

  /** إدراج نص في كتلة. */
  insertText(doc: WriterDocument, blockId: string, position: number, text: string): WriterDocument {
    return this.updateBlockContent(doc, blockId, (content) => {
      const clampedPos = Math.max(0, Math.min(position, content.length));
      return content.slice(0, clampedPos) + text + content.slice(clampedPos);
    });
  }

  /** حذف نص من كتلة. */
  deleteText(doc: WriterDocument, blockId: string, start: number, end: number): WriterDocument {
    return this.updateBlockContent(doc, blockId, (content) => {
      const s = Math.max(0, Math.min(start, content.length));
      const e = Math.max(s, Math.min(end, content.length));
      return content.slice(0, s) + content.slice(e);
    });
  }

  /** تنسيق نص في كتلة (إضافة علامة). */
  formatText(
    doc: WriterDocument,
    blockId: string,
    _start: number,
    _end: number,
    mark: TextMark,
  ): WriterDocument {
    return {
      ...doc,
      blocks: doc.blocks.map(b => {
        if (b.id !== blockId) return b;
        const marks = [...(b.marks ?? [])];
        // تبديل: إذا كانت العلامة موجودة، أزلها
        const existingIdx = marks.findIndex(m => m.type === mark.type);
        if (existingIdx >= 0) {
          marks.splice(existingIdx, 1);
        } else {
          marks.push(mark);
        }
        return { ...b, marks };
      }),
      metadata: { ...doc.metadata, updatedAt: new Date().toISOString() },
    };
  }

  // ── Heading Operations ──

  /** رفع مستوى العنوان (h3 → h2). */
  promoteHeading(doc: WriterDocument, blockId: string): WriterDocument {
    return this.updateBlockAttrs(doc, blockId, (attrs) => {
      const level = (attrs?.level as number) ?? 1;
      if (level <= 1) return attrs;
      return { ...attrs, level: level - 1 };
    });
  }

  /** خفض مستوى العنوان (h2 → h3). */
  demoteHeading(doc: WriterDocument, blockId: string): WriterDocument {
    return this.updateBlockAttrs(doc, blockId, (attrs) => {
      const level = (attrs?.level as number) ?? 1;
      if (level >= 6) return attrs;
      return { ...attrs, level: level + 1 };
    });
  }

  // ── List Operations ──

  /** تبديل نوع القائمة. */
  toggleListType(
    doc: WriterDocument,
    blockId: string,
    listType: 'bullet' | 'number' | 'task',
  ): WriterDocument {
    const block = doc.blocks.find(b => b.id === blockId);
    if (!block) return doc;

    const typeMap: Record<string, WriterBlockType> = {
      bullet: 'bulletList',
      number: 'orderedList',
      task: 'taskList',
    };

    const newType: WriterBlockType = block.type === typeMap[listType] ? 'paragraph' : typeMap[listType] ?? 'paragraph';
    return this.replaceBlock(doc, blockId, { ...block, type: newType });
  }

  /** زيادة المسافة البادئة لعنصر قائمة. */
  indentListItem(doc: WriterDocument, blockId: string): WriterDocument {
    return this.updateBlockAttrs(doc, blockId, (attrs) => {
      const level = (attrs?.indent as number) ?? 0;
      return { ...attrs, indent: Math.min(level + 1, 5) };
    });
  }

  /** تقليل المسافة البادئة. */
  dedentListItem(doc: WriterDocument, blockId: string): WriterDocument {
    return this.updateBlockAttrs(doc, blockId, (attrs) => {
      const level = (attrs?.indent as number) ?? 0;
      return { ...attrs, indent: Math.max(level - 1, 0) };
    });
  }

  /** تبديل حالة المهمة (مكتملة/غير مكتملة). */
  toggleTaskChecked(doc: WriterDocument, blockId: string): WriterDocument {
    return this.updateBlockAttrs(doc, blockId, (attrs) => ({
      ...attrs,
      checked: !(attrs?.checked as boolean),
    }));
  }

  // ── Table Operations ──

  /** إدراج صف في جدول. */
  insertTableRow(doc: WriterDocument, blockId: string, afterRow: number): WriterDocument {
    return this.updateBlockAttrs(doc, blockId, (attrs) => {
      const table = attrs?.table as TableBlockNode | undefined;
      if (!table) return attrs;

      const colsCount = table.data.colsCount;
      const newCells = Array.from({ length: colsCount }, (_, i) => ({
        id: mintBlockId(),
        text: '',
        colspan: 1,
        rowspan: 1,
        align: 'right' as const,
      }));

      const rows = [...table.rows];
      rows.splice(afterRow + 1, 0, {
        id: mintBlockId(),
        cells: newCells,
        isHeader: false,
      });

      return {
        ...attrs,
        table: { ...table, rows, data: { ...table.data, rowsCount: rows.length } },
      };
    });
  }

  /** حذف صف من جدول. */
  deleteTableRow(doc: WriterDocument, blockId: string, rowIndex: number): WriterDocument {
    return this.updateBlockAttrs(doc, blockId, (attrs) => {
      const table = attrs?.table as TableBlockNode | undefined;
      if (!table || table.rows.length <= 1) return attrs;

      const rows = table.rows.filter((_, i) => i !== rowIndex);
      return {
        ...attrs,
        table: { ...table, rows, data: { ...table.data, rowsCount: rows.length } },
      };
    });
  }

  // ── Markdown Import/Export ──

  /** استيراد Markdown إلى مستند. */
  importMarkdown(md: string): WriterDocument {
    const blocks: WriterBlock[] = [];
    const lines = md.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i]!;

      // عنوان
      const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
      if (headingMatch) {
        blocks.push({
          id: mintBlockId(),
          type: 'heading',
          content: headingMatch[2]!,
          attrs: { level: headingMatch[1]!.length },
        });
        i++;
        continue;
      }

      // اقتباس
      if (line.startsWith('> ')) {
        blocks.push({
          id: mintBlockId(),
          type: 'blockquote',
          content: line.slice(2),
        });
        i++;
        continue;
      }

      // قائمة نقطية
      if (/^[-*+]\s+/.test(line)) {
        const items: WriterBlock[] = [];
        while (i < lines.length && /^[-*+]\s+/.test(lines[i]!)) {
          items.push({
            id: mintBlockId(),
            type: 'bulletList',
            content: lines[i]!.replace(/^[-*+]\s+/, ''),
          });
          i++;
        }
        blocks.push({
          id: mintBlockId(),
          type: 'bulletList',
          content: '',
          children: items,
        });
        continue;
      }

      // قائمة رقمية
      if (/^\d+\.\s+/.test(line)) {
        const items: WriterBlock[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i]!)) {
          items.push({
            id: mintBlockId(),
            type: 'orderedList',
            content: lines[i]!.replace(/^\d+\.\s+/, ''),
          });
          i++;
        }
        blocks.push({
          id: mintBlockId(),
          type: 'orderedList',
          content: '',
          children: items,
        });
        continue;
      }

      // كتلة كود
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        i++;
        const codeLines: string[] = [];
        while (i < lines.length && !lines[i]!.startsWith('```')) {
          codeLines.push(lines[i]!);
          i++;
        }
        i++; // تخطي ``` الختامية
        blocks.push({
          id: mintBlockId(),
          type: 'codeBlock',
          content: codeLines.join('\n'),
          attrs: { language: lang || null },
        });
        continue;
      }

      // خط أفقي
      if (/^(---|\*\*\*|___)\s*$/.test(line)) {
        blocks.push({ id: mintBlockId(), type: 'horizontalRule', content: '' });
        i++;
        continue;
      }

      // جدول Markdown — | a | b | مع فاصل |---|
      if (isTableRowLine(line) && !isTableSeparatorLine(line)) {
        const tableLines: string[] = [];
        while (i < lines.length && isTableRowLine(lines[i]!)) {
          tableLines.push(lines[i]!);
          i++;
        }
        const table = parseMarkdownTable(tableLines);
        if (table) blocks.push(table);
        continue;
      }

      // فقرة
      if (line.trim() !== '') {
        blocks.push({ id: mintBlockId(), type: 'paragraph', content: line });
      }
      i++;
    }

    if (blocks.length === 0) {
      blocks.push({ id: mintBlockId(), type: 'paragraph', content: '' });
    }

    return {
      ...this.createDocument('Imported Document'),
      blocks,
    };
  }

  /** تصدير مستند إلى Markdown. */
  exportMarkdown(doc: WriterDocument): string {
    const lines: string[] = [];

    for (const block of doc.blocks) {
      switch (block.type) {
        case 'heading': {
          const level = (block.attrs?.level as number) ?? 1;
          lines.push('#'.repeat(level) + ' ' + block.content);
          break;
        }
        case 'paragraph':
          lines.push(block.content);
          break;
        case 'blockquote':
          lines.push('> ' + block.content);
          break;
        case 'bulletList':
          if (block.children) {
            for (const child of block.children) {
              lines.push('- ' + child.content);
            }
          }
          break;
        case 'orderedList':
          if (block.children) {
            block.children.forEach((child, idx) => {
              lines.push(`${idx + 1}. ` + child.content);
            });
          }
          break;
        case 'codeBlock': {
          const lang = (block.attrs?.language as string) ?? '';
          lines.push('```' + lang);
          lines.push(block.content);
          lines.push('```');
          break;
        }
        case 'horizontalRule':
          lines.push('---');
          break;
        case 'table': {
          const table = block.attrs?.table as TableBlockNode | undefined;
          if (table) lines.push(...formatTableMarkdownLines(table));
          break;
        }
      }
      lines.push('');
    }

    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  // ── Statistics ──

  /** عدد الكلمات في المستند. */
  getWordCount(doc: WriterDocument): number {
    const allText = doc.blocks
      .map(b => this.getBlockText(b))
      .join(' ');
    return allText.split(/\s+/).filter(w => w.length > 0).length;
  }

  /** عدد الأحرف. */
  getCharCount(doc: WriterDocument): number {
    return doc.blocks.map(b => this.getBlockText(b)).join('').length;
  }

  /** عدد الكتل. */
  getBlockCount(doc: WriterDocument): number {
    return doc.blocks.length;
  }

  /** وقت القراءة بالدقائق. */
  getReadingTime(doc: WriterDocument): number {
    const words = this.getWordCount(doc);
    return Math.max(1, Math.ceil(words / 200)); // 200 كلمة/دقيقة
  }

  // ── Search & Replace ──

  /** البحث في المستند. */
  search(doc: WriterDocument, query: string): SearchResult[] {
    if (!query) return [];
    const results: SearchResult[] = [];
    const lower = query.toLowerCase();

    for (const block of doc.blocks) {
      const text = this.getBlockText(block);
      const lowerText = text.toLowerCase();
      let pos = 0;

      while ((pos = lowerText.indexOf(lower, pos)) !== -1) {
        results.push({
          blockId: block.id,
          position: pos,
          length: query.length,
          text: text.slice(pos, pos + query.length),
        });
        pos += query.length;
      }
    }

    return results;
  }

  /** استبدال أول تطابق. */
  replace(doc: WriterDocument, query: string, replacement: string): WriterDocument {
    const results = this.search(doc, query);
    if (results.length === 0) return doc;

    const first = results[0]!;
    return this.updateBlockContent(doc, first.blockId, (content) => {
      return content.slice(0, first.position) + replacement + content.slice(first.position + first.length);
    });
  }

  /** استبدال كل التطابقات. */
  replaceAll(doc: WriterDocument, query: string, replacement: string): WriterDocument {
    let result = doc;
    for (const block of doc.blocks) {
      const text = this.getBlockText(block);
      if (text.includes(query)) {
        result = this.updateBlockContent(result, block.id, (content) => {
          return content.split(query).join(replacement);
        });
      }
    }
    return result;
  }

  // ── Private Helpers ──

  private updateBlockContent(
    doc: WriterDocument,
    blockId: string,
    updater: (content: string) => string,
  ): WriterDocument {
    return {
      ...doc,
      blocks: doc.blocks.map(b =>
        b.id === blockId ? { ...b, content: updater(b.content) } : b
      ),
      metadata: { ...doc.metadata, updatedAt: new Date().toISOString() },
    };
  }

  private updateBlockAttrs(
    doc: WriterDocument,
    blockId: string,
    updater: (attrs: Record<string, unknown> | undefined) => Record<string, unknown> | undefined,
  ): WriterDocument {
    return {
      ...doc,
      blocks: doc.blocks.map(b =>
        b.id === blockId ? { ...b, attrs: updater(b.attrs) ?? b.attrs } : b
      ),
      metadata: { ...doc.metadata, updatedAt: new Date().toISOString() },
    };
  }

  /** تصدير جدول إلى أسطر Markdown (منطق مكيف من markdown-engine.ts). */
  private tableToMarkdownLines(table: TableBlockNode): string[] {
    return formatTableMarkdownLines(table);
  }

  private getBlockText(block: WriterBlock): string {
    let text = block.content;
    if (block.children) {
      text += ' ' + block.children.map(c => this.getBlockText(c)).join(' ');
    }
    return text;
  }
}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TABLE MARKDOWN HELPERS — منطق مكيف من markdown-engine.ts (MIT)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** تصدير جدول إلى أسطر Markdown مع تهريب الأنابيب. */
function formatTableMarkdownLines(table: TableBlockNode): string[] {
  const lines: string[] = [];
  table.rows.forEach((row, rowIdx) => {
    const cells = row.cells.map(c => c.text.replace(/\|/g, '\\|').replace(/\n/g, ' '));
    lines.push(`| ${cells.join(' | ')} |`);
    if (rowIdx === 0) {
      lines.push(`| ${cells.map(() => '---').join(' | ')} |`);
    }
  });
  return lines;
}

/** فحص إن كان السطر يبدو خلية جدول Markdown. */
function isTableRowLine(line: string): boolean {
  return line.trim().startsWith('|') && line.trim().endsWith('|');
}

/** تقسيم سطر جدول إلى خلايا مع احترام التهريب \| . */
function splitTableRow(line: string): string[] {
  const trimmed = line.trim().slice(1, -1);
  const cells: string[] = [];
  let current = '';
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]!;
    if (ch === '\\' && trimmed[i + 1] === '|') {
      current += '|';
      i++;
    } else if (ch === '|') {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

/** فحص سطر الفاصل |---|---|. */
function isTableSeparatorLine(line: string): boolean {
  return /^\|?[\s:|-]+\|?$/.test(line.trim()) && line.includes('---');
}

/** بناء كتلة جدول من أسطر Markdown (صف أول = رأس). */
function parseMarkdownTable(tableLines: string[]): WriterBlock | null {
  const dataLines = tableLines.filter(l => !isTableSeparatorLine(l));
  if (dataLines.length === 0) return null;

  const hasHeader = dataLines.length < tableLines.length;
  const rows = dataLines.map((line, rowIdx) => {
    const cells = splitTableRow(line).map(text =>
      createTableCell(`${mintBlockId()}-c`, text),
    );
    return createTableRow(`${mintBlockId()}-r`, cells, hasHeader && rowIdx === 0);
  });

  if (rows.length === 0) return null;

  return {
    id: mintBlockId(),
    type: 'table',
    content: '',
    attrs: {
      table: createTableBlock(`${mintBlockId()}-t`, rows, { hasHeaderRow: hasHeader }),
    },
  };
}
