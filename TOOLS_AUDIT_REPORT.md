# Tools Audit Report

> Date: 2026-08-21 | ID: INFRA-023

## Domain Distribution

| Domain        | Blocks | Tools | Sample Tools                                      |
| ------------- | ------ | ----- | ------------------------------------------------- |
| **Writer**    | 2      | 9     | Bold, Italic, Underline...                        |
| **Universal** | 3      | 12    | InsertRow, InsertCol, DeleteRow...                |
| **Calc**      | 1      | 4     | FormulaEditor, NumberFormat, ConditionalFormat... |
| **Impress**   | 2      | 10    | ResizeHandles, RotateHandle, FillColor...         |
| **Base**      | 1      | 4     | RecordForm, FieldConfig, SortFilter...            |

## Block Details

| Block             | Domain    | Category | Tools                                                             |
| ----------------- | --------- | -------- | ----------------------------------------------------------------- |
| `paragraph`       | Writer    | Text     | Bold, Italic, Underline, Color, Align, Indent                     |
| `heading`         | Writer    | Text     | HeadingLevel, AutoNumber, Anchor                                  |
| `table`           | Universal | Data     | InsertRow, InsertCol, DeleteRow, DeleteCol, MergeCells, SplitCell |
| `cell`            | Calc      | Data     | FormulaEditor, NumberFormat, ConditionalFormat, TextWrap          |
| `shape`           | Impress   | Visual   | ResizeHandles, RotateHandle, FillColor, Snap, AlignSmart          |
| `slide`           | Impress   | Layout   | LayoutPicker, Background, PresenterNotes, Reorder, Transitions    |
| `database_record` | Base      | Data     | RecordForm, FieldConfig, SortFilter, RelationLink                 |
| `math`            | Universal | Plugin   | SymbolPalette, LaTeXEditor, DisplayMode                           |
| `mermaid`         | Universal | Plugin   | DiagramEditor, TypeSelector, ExportSVG                            |

## Canonical Tool Packages

### TextFormatting (7)

- [USED] Bold
- [USED] Italic
- [USED] Underline
- [USED] Color
- [USED] Align
- [USED] Indent
- [AVAIL] ClearFormat

### StructureAndHeading (4)

- [USED] HeadingLevel
- [USED] AutoNumber
- [USED] Anchor
- [AVAIL] CollapseExpand

### TableGrid (7)

- [USED] InsertRow
- [USED] InsertCol
- [USED] DeleteRow
- [USED] DeleteCol
- [USED] MergeCells
- [USED] SplitCell
- [AVAIL] Sort

### CalcSpreadsheet (5)

- [USED] FormulaEditor
- [USED] NumberFormat
- [USED] ConditionalFormat
- [USED] TextWrap
- [AVAIL] TracePrecedents

### SpatialTransform (6)

- [USED] ResizeHandles
- [USED] RotateHandle
- [USED] FillColor
- [USED] Snap
- [USED] AlignSmart
- [AVAIL] ZOrder

### SlidePresentation (5)

- [USED] LayoutPicker
- [USED] Background
- [USED] PresenterNotes
- [USED] Reorder
- [USED] Transitions

### DatabaseRecord (5)

- [USED] RecordForm
- [USED] FieldConfig
- [USED] SortFilter
- [USED] RelationLink
- [AVAIL] ValidationRules

### PluginsAndAddons (7)

- [USED] SymbolPalette
- [USED] LaTeXEditor
- [USED] DisplayMode
- [USED] DiagramEditor
- [USED] TypeSelector
- [USED] ExportSVG
- [AVAIL] Zoom

### ClipboardAndLifecycle (5)

- [AVAIL] Cut
- [AVAIL] Copy
- [AVAIL] Paste
- [AVAIL] Duplicate
- [AVAIL] Delete

## Recommendations

1. Use ComposableTraitsEngine for new blocks to auto-generate context menus
2. Enable ClipboardAndLifecycle for all blocks without exception
3. Add CollapseExpand for headings and TracePrecedents for cells in next update
