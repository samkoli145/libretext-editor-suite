# Blocks & Tools Registry (sijill al-kutal wa al-adawat)

> Date: 2026-08-24 | ID: DOC-ADMIN-11 | Updated: v1.5.0

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
| `list`            | Writer    | Text     | 3      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `blockquote`      | Writer    | Text     | 2      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `horizontal_rule` | Writer    | Layout   | 1      | Y   | Y    | Y    | Y   | Y     | Y   | Y   |
| `embed`           | Universal | Media    | 3      | Y   | Y    | N    | Y   | N     | Y   | N   |
| `pdf`             | Universal | Document | 5      | Y   | Y    | N    | Y   | N     | Y   | N   |
| `color_picker`    | Universal | Design   | 2      | Y   | Y    | N    | N   | N     | N   | N   |
| `icon_picker`     | Universal | Design   | 2      | Y   | Y    | N    | N   | N     | N   | N   |
| `font_picker`     | Universal | Design   | 2      | Y   | Y    | N    | N   | N     | N   | N   |
| `text_styler`     | Universal | Design   | 2      | Y   | Y    | N    | N   | N     | N   | N   |
| `bg_color`        | Universal | Design   | 1      | Y   | Y    | N    | N   | N     | N   | N   |
| `bg_image`        | Universal | Design   | 2      | Y   | Y    | N    | N   | N     | N   | N   |
| `gradient`        | Universal | Design   | 2      | Y   | Y    | N    | N   | N     | N   | N   |
| `template_card`   | Universal | Template | 2      | Y   | Y    | N    | N   | N     | N   | N   |
| `template_gallery`| Universal | Template | 2      | Y   | Y    | N    | N   | N     | N   | N   |

## Block Details

### `paragraph`

- Domain: Writer | Category: Text
- Attributes: align, lineHeight, indent, dir
- Tools: Bold, Italic, Underline, Strike, Color, AlignLeft, AlignCenter, AlignRight, Justify
- Commands: FORMAT_TEXT, SET_ALIGNMENT, INDENT
- Factory: `createParagraphBlock(id, content, data?)`

### `heading`

- Domain: Writer | Category: Text
- Attributes: level (1-6), align, numbered, anchorId
- Tools: HeadingLevelSelector, AutoNumberToggle, AnchorLink
- Commands: SET_HEADING_LEVEL, TOGGLE_NUMBERING
- Factory: `createHeadingBlock(id, content, level?, data?)`

### `table`

- Domain: Universal | Category: Data
- Attributes: rows, cols, hasHeaderRow, borderStyle, borderColor
- Tools: InsertRow, InsertCol, DeleteRow, DeleteCol, MergeCells, SplitCell
- Commands: INSERT_TABLE_ROW, DELETE_TABLE_ROW, MERGE_CELLS
- Factory: `createTableBlock(id, rows, data?)`

### `cell`

- Domain: Calc | Category: Data
- Attributes: value, dataType, format, formula, error
- Tools: FormulaEditor, NumberFormat, CurrencyFormat, ConditionalFormat
- Commands: SET_FORMULA, RECALCULATE_CELL, APPLY_CELL_FORMAT
- Factory: `createCellBlock(id, value, dataType?, format?)`

### `list`

- Domain: Writer | Category: Text
- Attributes: listType (bullet, ordered, task), items
- Tools: ToggleListType, IndentItem, OutdentItem
- Commands: TOGGLE_LIST, INDENT_LIST_ITEM
- Factory: `createListBlock(id, items, listType?)`

### `code_block`

- Domain: Writer | Category: Text
- Attributes: language, code
- Tools: LanguageSelector, CopyCode
- Commands: SET_CODE_LANGUAGE
- Factory: `createCodeBlock(id, code, language?)`

### `horizontal_rule`

- Domain: Writer | Category: Layout
- Attributes: style (solid, dashed, dotted, double)
- Tools: StyleSelector
- Commands: SET_HR_STYLE
- Factory: `createHorizontalRuleBlock(id, style?)`

### `blockquote`

- Domain: Writer | Category: Text
- Attributes: content, author, source
- Tools: AuthorEditor, SourceEditor
- Commands: SET_BLOCKQUOTE
- Factory: `createBlockquoteBlock(id, content, meta?)`

### `shape`

- Domain: Impress | Category: Visual
- Attributes: shapeType, x, y, width, height, rotation, fill, stroke
- Tools: ShapeSelector, FillColorPicker, HandleTransform, RotateHandle, BooleanUnion
- Commands: TRANSFORM_SHAPE, ROTATE_SHAPE, SNAP_TO_GRID
- Factory: `createShapeBlock(id, shapeType, x, y, w, h, data?)`

### `slide`

- Domain: Impress | Category: Layout
- Attributes: layout, title, content, background, notes
- Tools: SlideLayoutPicker, BackgroundPalette, DuplicateSlide, PresenterNotes
- Commands: ADD_SLIDE, REMOVE_SLIDE, REORDER_SLIDES
- Factory: `createSlideBlock(id, layout, title, content?, data?)`

### `database_record`

- Domain: Base | Category: Data
- Attributes: fields, tableName
- Tools: RecordFormEditor, FieldTypeConfig, SortFilterBar, RelationLinker
- Commands: INSERT_RECORD, UPDATE_RECORD, DELETE_RECORD
- Factory: `createDatabaseRecordBlock(id, fields, tableName?)`

### `image`

- Domain: Universal | Category: Visual
- Attributes: src, alt, width, height, filters, caption
- Tools: ImageUpload, ResizeHandles, CropTool, CaptionEditor, FilterEditor
- Commands: INSERT_IMAGE, RESIZE_IMAGE, CROP_IMAGE
- Factory: `createImageBlock(id, src, alt?, data?)`

### `embed`

- Domain: Universal | Category: Media
- Attributes: provider, url, title
- Tools: ProviderSelector, UrlEditor
- Commands: INSERT_EMBED
- Factory: `createEmbedBlock(id, provider, url, title?)`

### `pdf`

- Domain: Universal | Category: Document
- Attributes: src, page, zoom, annotations, stamps
- Tools: PdfViewer, AnnotationTool, StampTool, PageNavigator
- Commands: INSERT_PDF, ANNOTATE_PDF, STAMP_PDF
- Factory: `createPdfBlock(id, src, data?)`

### `color_picker`

- Domain: Universal | Category: Design
- Attributes: color, format (hex, rgb, hsl), allowAlpha, recentColors
- Tools: ColorPalette, RecentColors
- Commands: SET_COLOR
- Factory: `createColorPickerBlock(id, color?, traits?)`

### `icon_picker`

- Domain: Universal | Category: Design
- Attributes: icon, iconSet, size
- Tools: IconSearch, IconGrid
- Commands: SET_ICON
- Factory: `createIconPickerBlock(id, icon?, traits?)`

### `font_picker`

- Domain: Universal | Category: Design
- Attributes: fontFamily, fontSize, fontWeight, fontStyle
- Tools: FontList, SizeSlider, WeightSelector
- Commands: SET_FONT
- Factory: `createFontPickerBlock(id, fontFamily?, traits?)`

### `text_styler`

- Domain: Universal | Category: Design
- Attributes: color, bgColor, fontSize, fontWeight, textAlign, lineHeight
- Tools: ColorPicker, AlignmentPicker, SpacingSlider
- Commands: SET_TEXT_STYLE
- Factory: `createTextStylerBlock(id, styles?, traits?)`

### `bg_color`

- Domain: Universal | Category: Design
- Attributes: color, opacity
- Tools: ColorPicker, OpacitySlider
- Commands: SET_BG_COLOR
- Factory: `createBgColorBlock(id, color?, opacity?, traits?)`

### `bg_image`

- Domain: Universal | Category: Design
- Attributes: src, size, position, repeat
- Tools: ImageUploader, PositionGrid
- Commands: SET_BG_IMAGE
- Factory: `createBgImageBlock(id, src?, data?, traits?)`

### `gradient`

- Domain: Universal | Category: Design
- Attributes: type (linear, radial), angle, stops
- Tools: GradientEditor, StopManager
- Commands: SET_GRADIENT
- Factory: `createGradientBlock(id, stops, data?, traits?)`

### `template_card`

- Domain: Universal | Category: Template
- Attributes: name, description, thumbnail, category
- Tools: TemplatePreview, CategoryFilter
- Commands: SELECT_TEMPLATE
- Factory: `createTemplateCardBlock(id, name, description?, thumbnail?, traits?)`

### `template_gallery`

- Domain: Universal | Category: Template
- Attributes: items, columns, gap
- Tools: GridLayout, FilterBar
- Commands: SELECT_GALLERY_ITEM
- Factory: `createTemplateGalleryBlock(id, items, data?, traits?)`
