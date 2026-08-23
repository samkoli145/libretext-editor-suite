# Blocks & Tools Registry (sijill al-kutal wa al-adawat)

> Date: 2026-08-21 | ID: DOC-ADMIN-11

## Block-Serializer Matrix

| Block             | Domain    | Category | Tools# | MD  | HTML | DOCX | ODF | LaTeX | PDF | TXT |
| ----------------- | --------- | -------- | ------ | --- | ---- | ---- | --- | ----- | --- | --- |
| `paragraph`       | Writer    | Text     | 9      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `heading`         | Writer    | Text     | 3      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `table`           | Universal | Data     | 6      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `cell`            | Calc      | Data     | 4      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `code_block`      | Writer    | Text     | 3      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `math`            | Universal | Plugin   | 3      | Y   | Y    | Y    | Y   | Y     | Y   | N   |
| `mermaid`         | Universal | Plugin   | 3      | Y   | Y    | N    | Y   | N     | Y   | N   |
| `shape`           | Impress   | Visual   | 5      | N   | Y    | Y    | Y   | N     | Y   | N   |
| `slide`           | Impress   | Layout   | 4      | Y   | Y    | N    | Y   | Y     | Y   | Y   |
| `database_record` | Base      | Data     | 4      | Y   | Y    | Y    | Y   | N     | Y   | Y   |
| `image`           | Universal | Visual   | 4      | Y   | Y    | Y    | Y   | Y     | Y   | N   |
| `callout_box`     | Writer    | Layout   | 3      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |

## Block Details

### `paragraph`

- Domain: Writer | Category: Text
- Attributes: align, lineHeight, indent, marks
- Tools: Bold, Italic, Underline, Strike, Color, AlignLeft, AlignCenter, AlignRight, Justify
- Commands: FORMAT_TEXT, SET_ALIGNMENT, INDENT

### `heading`

- Domain: Writer | Category: Text
- Attributes: level, align, id, numbered
- Tools: HeadingLevelSelector, AutoNumberToggle, AnchorLink
- Commands: SET_HEADING_LEVEL, TOGGLE_NUMBERING

### `table`

- Domain: Universal | Category: Data
- Attributes: rows, cols, headers, borders
- Tools: InsertRow, InsertCol, DeleteRow, DeleteCol, MergeCells, SplitCell
- Commands: INSERT_TABLE_ROW, DELETE_TABLE_ROW, MERGE_CELLS

### `cell`

- Domain: Calc | Category: Data
- Attributes: row, col, value, formula, format
- Tools: FormulaEditor, NumberFormat, CurrencyFormat, ConditionalFormat
- Commands: SET_FORMULA, RECALCULATE_CELL, APPLY_CELL_FORMAT

### `code_block`

- Domain: Writer | Category: Text
- Attributes: language, showLineNumbers, wrap
- Tools: LanguageSelector, LineNumbersToggle, CopyCode
- Commands: SET_CODE_LANGUAGE, TOGGLE_LINE_NUMBERS

### `math`

- Domain: Universal | Category: Plugin
- Attributes: latex, displayMode, fontSize
- Tools: MathSymbolPalette, LaTeXEditor, DisplayModeToggle
- Commands: INSERT_MATH, UPDATE_LATEX

### `mermaid`

- Domain: Universal | Category: Plugin
- Attributes: code, diagramType, theme
- Tools: DiagramTypeSelector, MermaidEditor, ExportSVG
- Commands: UPDATE_DIAGRAM, GENERATE_SVG

### `shape`

- Domain: Impress | Category: Visual
- Attributes: shapeType, x, y, width, height, rotation
- Tools: ShapeSelector, FillColorPicker, HandleTransform, RotateHandle, BooleanUnion
- Commands: TRANSFORM_SHAPE, ROTATE_SHAPE, SNAP_TO_GRID

### `slide`

- Domain: Impress | Category: Layout
- Attributes: slideIndex, layout, background, transition
- Tools: SlideLayoutPicker, BackgroundPalette, DuplicateSlide, PresenterNotes
- Commands: ADD_SLIDE, REMOVE_SLIDE, REORDER_SLIDES

### `database_record`

- Domain: Base | Category: Data
- Attributes: recordId, tableId, fields
- Tools: RecordFormEditor, FieldTypeConfig, SortFilterBar, RelationLinker
- Commands: INSERT_RECORD, UPDATE_RECORD, DELETE_RECORD

### `image`

- Domain: Universal | Category: Visual
- Attributes: src, alt, width, height, caption
- Tools: ImageUpload, ResizeHandles, CropTool, CaptionEditor
- Commands: INSERT_IMAGE, RESIZE_IMAGE, CROP_IMAGE

### `callout_box`

- Domain: Writer | Category: Layout
- Attributes: variant, icon, title, collapsible
- Tools: CalloutVariantPicker, IconSelector, ToggleCollapsible
- Commands: SET_CALLOUT_VARIANT, TOGGLE_CALLOUT_COLLAPSE
