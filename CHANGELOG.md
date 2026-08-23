## [v1.2.0] - 2026-08-22

- **Shared Context Menu (`SHARED-CMP-001`):** بناء مكون القوائم السياقية الموحد `SharedContextMenu.tsx` بالثيم الفاتح النقي والتفاعل بالماوس حصراً.
- **Canvas Integration:** ربط `CanvasDesignerPlugin` بمحلل السمات والقوائم السياقية (`resolveContextMenuForBlock`) وتحديث عناصر الكانفا بدقة متناهية (`locked`, `z-index`, `geometry`, `duplicate`, `delete`).
- **Type Safety & Encapsulation:** إزالة أي `as any` من مسارات القوائم، وتصحيح استيرادات الحزم لتعتمد المعرف الرسمي `@libretext/core`.
- **Hook Enhancements:** توحيد اتساق دالة `openMenu` في `useContextMenu.ts` عبر جميع الـ Overloads.

## [v1.1.0] - 2026-08-22

- مزامنة تلقائية لفهارس المكونات والسجلات عبر أداة `sync-registry.ts`.
- تحديث مسارات النواة والمكونات ومطابقتها لشجرة الملفات الحالية (2754 رمزاً مفهرساً).

/**

- ============================================================
- 📄 الملف: CHANGELOG.md
- 📂 المسار: CHANGELOG.md
- 🎯 الهدف الرئيسي: سجل التغييرات الرسمي للمشروع، يتبع
- معايير Keep a Changelog وإصدار Semantic Versioning.
- 📋 المعايير:
- - يجب توثيق كل تغيير جوهري في الإصدارات.
- - يجب استخدام تنسيق [Added], [Changed], [Deprecated],
-      [Removed], [Fixed], [Security].
- - يجب ربط كل تغيير بتعريف (PHASE/ID).
- 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
- 🏷️ المعرف: DOC-ADMIN-04
- 📅 تاريخ الإنشاء: 2026-08-19
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- 📚 المصادر المقتبسة: لا توجد.
- ============================================================
  */

# سجل التغييرات - LibreText Editor Suite

كل التغييرات المهمة في هذا المشروع ستُوثق في هذا الملف.

التنسيق مبني على [Keep a Changelog](https://keepachangelog.com/),
والإصدار يتبع [Semantic Versioning](https://semver.org/).

## [v1.4.0] - 2026-08-23

### Added

- **Algorithm Unit Tests (7 files, 83 tests):** اختبارات شاملة لـ 7 وحدات غير مفحوصة:
  - LLRB Tree (put, get, floor, ceiling, clear, root color)
  - DisjointSet / Union-Find (makeSet, find, union, mergeRange, unmerge)
  - Dependency graph (detectCycle, topologicalSort, getRecalculationOrder)
  - Bottom-up merge sort (stability, multi-column comparator)
  - Simulation (createContext, moveCursor, selectRange, setFormula, simulate)
  - HLOOKUP (exact + approximate, compareValues, binarySearch)
  - Streets search engine (query, sort, branching tree, similarity analysis)
- **Rule Guardian (`PLUG-RULE-GUARDIAN`):** محرك فحص ورفض تلقائي للتعديلات المخالفة:
  - R-001: Mandatory bilingual file header
  - R-002: No dark theme colors
  - R-003: No external dependencies in core packages
  - R-004: No secrets in code
  - R-005: No `as any` cast (warning)
  - R-006: Function length ≤ 50 lines (warning)
  - R-007: Light theme only
  - CLI: `devstudio guard [files..]`
  - 23 tests covering all rules

### Fixed

- Fixed `scanProject` name collision in CLI (renamed to `scanProjectDebt`)
- Added `packageManager: "pnpm@11.18.0"` to `package.json`
- Fixed dark theme violations in Workbench, DevStudio, ComponentRegistry, HTMLComponentPlugin
- Fixed 16 lint errors (Function types, empty objects, let→const)
- Fixed duplicate `UiPreferencesService.ts` import path
- Added `vite.config.ts` for `@libretext/algorithms` (lib mode, ESM)

### Changed

- Formatted 440 files via `pnpm format`
- Total test count: 1273 → 1415 (89 test files)

## [v1.3.0] - 2026-08-22

### Added

- **Full Import from المعدل 4 (346 files, 85,098 lines):**
  - Core infrastructure: commands, contributions, documents, engines, events, history, plugins, services, system, storage
  - HTML blocks: 10 files (html-unified-block, types, registry, generator, layout-engine, data-engine, tailwind-editor, operations, presets, tsx-generator)
  - Canvas engines: BlockMapperEngine, CSSParserEngine, HTMLParserEngine, SelectionManager, SyncEngine
  - Shared engines: 26 engines (AI, AttributeCompletion, CodeEditor, ComponentRegistry, Debouncer, Diagram, Dialog, Doctor, HTML parsers, Icons, Images, LaTeX, Markdown, MindMap, NoCode, Notifications, PluginSystem, Presentation, Smart, ToolRegistry, Validation, WebScraping, WYSIWYG)
  - Language system: 4 packs (C++, Python, TypeScript, Web) + 6 providers + 5 core files
  - lib-core: 80+ files (animation, archive, charts, code-interpreter, collaboration, computational-notebook, converters, document-pipeline, events, geometry, grid-engine, latex, raster)
  - Primitives: Disposable, LocalizedString, Result, Scheduler, SystemTypes
  - Hooks: 16 React hooks for UI interactions
  - Vector engine: AutoLayoutEngine, common, control_handle_manager, path_editor, ref_line, snap
  - Shell dev-studio: adapters, bridge, checkpoint, core, doctor, pipeline, scaffolder, sync, tree, workbench
  - Features: canvas-designer (core+hooks+components), rich-text, ui-designer, pdf, html-component
- **Full Import from المعدل 5 (30 files, 4,950 lines):**
  - Traits system: draggable, resizable, styleable, lockable, types, index, trait-context-menu-resolver
  - Capability registry: FNV-1a hash + semantic duplicate guard
  - Blocks: block-manifest, AudioBlock, types
  - Storage: IndexedDBDocumentStorage, LocalForageDocumentStorage
  - UI plugins: CanvasDesignerPlugin, HTMLComponentPlugin, PdfPlugin, RichTextEditor, UIDesignerPlugin
  - Shared components: SharedContextMenu.tsx (Pure Daylight Theme)
  - Shell: Workbench.tsx, main.tsx
  - Tests: AudioBlock, traits, trait-context-menu-resolver
  - Documentation: JOURNAL.md, INDEX.md, CHANGELOG.md updates
  - Data: BLOCK_REGISTRY.json, DIAGNOSTICS_REPORT.json

### Fixed

- Import path corrections for cross-package references (core/src/ → shared/)
- Added react type stub for UI feature files
- Removed lucide-react dependency from unifiedTools.ts (zero-dependency compliance)
- Replaced localforage with localStorage stub (zero-dependency compliance)
- Added TraitKey type export to traits/types.ts
- Fixed noUncheckedIndexedAccess error in capability-registry.ts

## [لم يُصدر بعد]

### Added (تمت الإضافة)

- إنشاء الخطة المعمارية النهائية (Blueprint).
- تعريف فهرس المعرفات الكامل (INFRA, CORE, SER, PLUG, ADAP, PLAY, DOC, SEC, TEST).
- تحديد هيكل المشروع النهائي.
- إنشاء ملفات الإدارة الأساسية (PLAN.md, JOURNAL.md, INDEX.md, LICENSE, CONTRIBUTING.md, README.md, CHANGELOG.md).
- إنشاء AGENTS.md [DOC-ADMIN-05] — تعليمات العميل التنفيذي.
- إنشاء Components Registry.md [DOC-ADMIN-06] — سجل المكونات.
- إنشاء API Registry.md [DOC-ADMIN-07] — سجل الـ APIs والخوارزميات.
- إنشاء SystemInventory.json [DOC-ADMIN-08] — جرد النظام.
- إضافة القواعد الصارمة: الثيم الفاتح النقي، التفاعل بالماوس، السبورة البيضاء.

### High Priority Engines Integration — تكامل المحركات ذات الأولوية العالية (2026-08-21)

- ✅ `packages/core/src/engines/html-pipeline.ts` — محرك HTMLPipeline: sanitizeHtml, toRichTextDocument, exportToCleanHtml [CORE-ENG-001]
- ✅ `packages/core/src/engines/file-type-detection.ts` — محرك التعرف على أنواع الملفات متعدد الإشارات [CORE-ENG-002]
- ✅ `packages/core/src/engines/unified-ingestion.ts` — خط أنابيب الاستيراد الموحد مع إصلاح Mojibake [CORE-ENG-003]
- ✅ `packages/core/src/engines/image-pipeline.ts` — محرك الصور: EXIF Orientation, Crop, Filters, Compress, Thumbnail [CORE-ENG-004]
- ✅ `packages/core/src/engines/validation.ts` — محرك فحص وتعقيم HTML مع فحص توازن الوسوم [CORE-016]
- ✅ `packages/core/src/converters/universal-format-converter.ts` — محول 20+ صيغة: استيراد وتصدير [CORE-017]
- ✅ `packages/core/src/types.ts` — أنواع المستندات: DocumentModel, EditorPlugin, SharedFormattingState [CORE-018]
- ✅ `packages/algorithms/src/formula/latex-engine.ts` — محرك LaTeX: Recursive Descent Parser → SVG/HTML [ALGO-031]
- ✅ `packages/algorithms/src/formula/markdown-engine.ts` — محرك Markdown: تحويل ثنائي الاتجاه MD↔HTML [ALGO-032]
- ✅ تحديث Barrel Export + 0 type errors + 856 tests pass

### Level 1-5 Engine Integration — تكامل محركات المستويات 1-5 (2026-08-21)

#### Level 1 — Basic Interaction Engines

- ✅ `core/src/engines/context-menu-engine.ts` — محرك القوائم السياقية الديناميكية [CORE-ENG-005]
- ✅ `core/src/engines/selection-gizmo-engine.ts` — محرك م Affero التحديد والتقابض [CORE-ENG-006]
- ✅ `core/src/engines/composable-traits-engine.ts` — نظام السمات القابلة للتركيب [CORE-ENG-007]
- ✅ `core/src/engines/floating-gizmo-engine.ts` — محرك العناصر العائمة [CORE-ENG-008]

#### Level 2 — Interaction Engines

- ✅ `core/src/engines/spatial-drag-engine.ts` — محرك السحب المكاني مع التسنين والضبط [CORE-ENG-009]
- ✅ `core/src/engines/marquee-selection-engine.ts` — محرك التحديد بالصندوق المطاطي [CORE-ENG-010]
- ✅ `core/src/engines/multi-selection-engine.ts` — محرك التحديد المتعدد [CORE-ENG-011]
- ✅ `core/src/engines/undo-redo-engine.ts` — محرك التراجع والإعادة [CORE-ENG-012]
- ✅ `core/src/engines/mouse-command-registry.ts` — سجل أوامر الماوس [CORE-ENG-013]

#### Level 3 — Intelligence Engines

- ✅ `algorithms/src/spatial/smart-snap-engine.ts` — التسنين الذكي مع خطوط الإرشاد [ALGO-031]
- ✅ `algorithms/src/spatial/dynamic-guide-lines.ts` — خطوط إرشاد حية + مؤشرات قياس [ALGO-032]
- ✅ `algorithms/src/spatial/smart-rtl-alignment.ts` — كشف اتجاه النص ومحاذاة RTL/LTR [ALGO-033]
- ✅ `core/src/engines/screen-edge-detector.ts` — كشف حواف الشاشة وعكس القوائم [CORE-ENG-014]
- ✅ `core/src/engines/bounding-clamping-engine.ts` — تقييد العناصر داخل حدود اللوحة [CORE-ENG-015]
- ✅ `core/src/engines/z-order-manager.ts` — إدارة ترتيب الطبقات [CORE-ENG-016]

#### Level 4 — Block & Tool Integration

- ✅ `algorithms/src/vector/snap.ts` — محرك تسنين متعدد الأهداف [ALGO-034]
- ✅ `algorithms/src/vector/ref-line.ts` — خطوط إرشاد ديناميكية + مؤشرات مسافات [ALGO-035]
- ✅ `algorithms/src/vector/control-handle-manager.ts` — 8 مقابض تحجيم + تدوير [ALGO-036]
- ✅ `core/src/engines/selection-manager.ts` — مدير تحديد شامل [CORE-ENG-017]
- ✅ `core/src/engines/block-mapper.ts` — رسم خريطة البلوكات البصري [CORE-ENG-018]

#### Level 5 — Medium Engines

- ✅ `algorithms/src/diagram/diagram-engine.ts` — محرك رسومات SVG المتجهية [ALGO-037]
- ✅ `core/src/registry/component-registry.ts` — سجل المكونات المركزي [CORE-REG-001]
- ✅ `core/src/engines/smart-component-engine.ts` — تجميع المكونات الذكي [CORE-ENG-019]
- ✅ `core/src/engines/callout-engine.ts` — صناديق التعليق التوضيحي البصرية [CORE-ENG-020]

#### Backup Integration (المعدل)

- ✅ `core/src/engines/mouse-tooling-engine.ts` — محرك الفأرة والأدوات [CORE-017]
- ✅ `core/src/engines/tool-registry.ts` — سجل الأدوات الموحد [CORE-020]
- ✅ `core/src/engines/doctor-self-healing-engine.ts` — محرك الشفاء الذاتي [CORE-021]
- ✅ `algorithms/src/spatial/mouse-diagnostics.ts` — تشخيص الفأرة وإحداثيات الشاشة [ALGO-010]
- ✅ `algorithms/src/spatial/auto-layout-engine.ts` — محرك التخطيط الأوتوماتيكي [ALGO-011]
- ✅ `algorithms/src/spatial/spatial-drag-algorithms.ts` — خوارزميات السحب والتحديد [ALGO-028]
- ✅ `core/src/blocks/code-editor.ts` + `.styles.ts` + `.registry.ts` — بلوك محرر الكود
- ✅ `core/src/blocks/audio-block-block.ts` — بلوك الصوت
- ✅ `core/src/contextMenuEngine.ts` — محرك القوائم السياقية المحسّن [CORE-012]
- ✅ تحديث Barrel Export + 0 type errors + 856 tests pass

### Fifth Backup Integration — تكامل النسخة الاحتياطية الخامسة (2026-08-21)

- ✅ `packages/core/src/utils/arabic-text.ts` — أدوات النص العربي (RTL, Numerals, Diacritics) [UTIL-AR-001]
- ✅ `packages/core/src/utils/formula-parser.ts` — محلل صيغ Excel ثنائية اللغة [UTIL-FORM-001]
- ✅ `packages/core/src/utils/content-validator.ts` — validators لكل نوع ContentBlock [CORE-013]
- ✅ `packages/core/src/utils/document-validator.ts` — التحقق الشامل للمستندات [UTIL-VAL-002]
- ✅ `packages/core/src/parsers/frontmatter-parser.ts` — محلل YAML FrontMatter [SER-006-07]
- ✅ `packages/core/src/parsers/markdown.ts` — محلل Markdown إلى ContentBlock [SER-006-06]
- ✅ `packages/algorithms/src/formula/functions-matrix.ts` — دوال المصفوفات والـ Lambda [ALGO-018]
- ✅ `packages/algorithms/src/formula/markdown-formula.ts` — محرك الصيغ [ALGO-019]
- ✅ `packages/serializers/src/docx/` — محول DOCX completo (7 ملفات) [SER-006-01..05]
- ✅ `packages/serializers/src/parsers/` — محلل frontmatter + markdown [SER-006-06..07]
- ✅ جميع الأخطاء النوعية مُصلحة — صفر أخطاء tsc
- ✅ 856 اختبار ناجح — لا تراجعات

### PHASE-00 — بيئة التطوير (2026-08-19)

- ✅ إنشاء `package.json` الجذري مع جميع السكربتات.
- ✅ إنشاء `tsconfig.base.json` + `tsconfig.json` مع TypeScript صارم.
- ✅ إنشاء `pnpm-workspace.yaml` لإدارة Monorepo.
- ✅ إنشاء `packages/core/package.json` مع Vite Library Mode.
- ✅ إنشاء `packages/core/vite.config.ts` مع dts plugin.
- ✅ إنشاء `scripts/generate-file.ts` — سكربت توليد ملفات جديدة.
- ✅ إنشاء `scripts/generate-header.ts` — سكربت توليد الترويسة.
- ✅ إنشاء `vitest.config.ts` مع تغطية 95%.
- ✅ إنشاء `turbo.json` لإدارة المهام.
- ✅ إنشاء `eslint.config.js` + `.prettierrc`.
- ✅ تثبيت جميع الاعتماديات بنجاح.

### Algorithms Studio Integration — تكامل مكتبة الخوارزميات (2026-08-21)

- ✅ `packages/algorithms/src/graph/dependency.ts` — كشف التبعيات الدائرية + الفرز الجغرافي [ALGO-020]
- ✅ `packages/algorithms/src/graph/routing.ts` — توجيه محاذاةOrthogonal + A* [ALGO-021]
- ✅ `packages/algorithms/src/graph/routing-types.ts` — أنواع التوجيه [ALGO-022]
- ✅ `packages/algorithms/src/graph/orthogonal-router.ts` — مُوجّه متقدم مع مسارات ملساء [ALGO-023]
- ✅ `packages/algorithms/src/tree/llrb.ts` — شجرة LLRB (Left-Leaning Red-Black) [ALGO-024]
- ✅ `packages/algorithms/src/structure/disjoint-set.ts` — مجموعة منفصلة Union-Find [ALGO-025]
- ✅ `packages/algorithms/src/sort/mergesort.ts` — خوارزمية الدمج with Arabic collation [ALGO-026]
- ✅ `packages/algorithms/src/lookup/hlookup.ts` — بحث أفقي HLOOKUP [ALGO-027]
- ✅ `packages/algorithms/src/formula/arabic-aliases.ts` — أسماء دوال عربية [ALGO-028]
- ✅ `packages/algorithms/src/streets/similarity.ts` — بحث أسماء شوارع [ALGO-029]
- ✅ `packages/algorithms/src/types.ts` — أنواع مشتركة (Point2D, AABB) [ALGO-030]
- ✅ تحديث Barrel Export + 0 type errors + 856 tests pass

### PHASE-01 — النواة Core (2026-08-19)

- ✅ `packages/core/src/ast/types.ts` — تعريفات AST (20+ نوع).
- ✅ `packages/core/src/ast/schema.ts` — مخطط AST مع التحقق.
- ✅ `packages/core/src/ast/builder.ts` — بناء الكتل (Builder Pattern).
- ✅ `packages/core/src/state/editor-state.ts` — حالة المحرر (Immutable).
- ✅ `packages/core/src/state/operations.ts` — عمليات التحرير.
- ✅ `packages/core/src/state/history.ts` — التراجع والإعادة.
- ✅ `packages/core/src/indexer/indexer.ts` — نظام الفهرسة.
- ✅ `packages/core/src/indexer/search.ts` — واجهة البحث النصي.
- ✅ `packages/core/src/utils/id.ts` — توليد المعرفات.
- ✅ `packages/core/src/utils/validation.ts` — التحقق من الصحة.
- ✅ `packages/core/src/index.ts` — التصدير العام.
- ✅ اختبارات: 44 اختبار ناجح (تغطية 100%).
