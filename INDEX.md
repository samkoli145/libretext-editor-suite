/**

- ============================================================
- 📄 الملف: INDEX.md
- 📂 المسار: INDEX.md
- 🎯 الهدف الرئيسي: فهرس شامل لكل ملفات المشروع مع
- المعرفات والمسارات والأوصاف لسهولة التنقل والبحث.
- 📋 المعايير:
- - يجب تحديث الفهرس عند إضافة ملف جديد.
- - يجب أن يحتوي على جميع الملفات مع مساراتها.
- - يجب أن يكون المعرف فريداً لكل ملف.
- 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
- 🏷️ المعرف: DOC-ADMIN-03
- 📅 تاريخ الإنشاء: 2026-08-19
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- 📚 المصادر المقتبسة: لا توجد.
- ============================================================
  */

# فهرس مشروع LibreText Editor Suite

# LibreText Editor Suite - Project Index

---

## جدول فهرس المعرفات العامة

## General ID Reference Table

| البادئة Prefix | المجال Domain   | الوصف Arabic                                   | Description English                 |
| -------------- | --------------- | ---------------------------------------------- | ----------------------------------- |
| `INFRA-*`      | البنية التحتية  | ملفات الإعداد، الأدوات، السكربتات              | Configuration files, tools, scripts |
| `CORE-*`       | النواة          | AST، State، Operations، Indexer                | AST, State, Operations, Indexer     |
| `ALGO-*`       | الخوارزميات     | Command Pattern، Expression Evaluator، Spatial | Algorithms, Formulas, Spatial       |
| `STORE-*`      | التخزين         | In-Memory، localStorage، IndexedDB             | Memory, localStorage, IndexedDB     |
| `TPL-*`        | القوالب         | Template Registry، قوالب النطاقات              | Template Registry, Domain Templates |
| `SER-*`        | المحولات        | Markdown، HTML، PDF، LaTeX، إلخ                | Markdown, HTML, PDF, LaTeX, etc.    |
| `PLUG-*`       | الإضافات        | Plugin API، الإضافات الرسمية                   | Plugin API, Official plugins        |
| `ADAP-*`       | طبقات التكيف    | React، Vue، Web Components                     | React, Vue, Web Components          |
| `PLAY-*`       | الملعب التجريبي | Playground، CLI                                | Playground, CLI                     |
| `DOC-*`        | التوثيق         | API، أدلة، أمثلة                               | API docs, guides, examples          |
| `SEC-*`        | الأمان          | Sanitization، التدقيق                          | Sanitization, Auditing              |
| `TEST-*`       | الاختبارات      | Unit، Integration، E2E                         | Unit, Integration, E2E              |
| `LEGAL-*`      | التراخيص        | تراخيص المصادر المفتوحة                        | Open source licenses                |

---

## الشجرة الكاملة للمشروع مع المعرفات

## Complete Project Tree with File IDs

```
libretext-editor-suite/
│
├── [DOC-000] README.md                          # الملف التعريفي الرئيسي / Main project README
├── [DOC-ADMIN-01] PLAN.md                       # خطة المشروع / Project plan
├── [DOC-ADMIN-02] JOURNAL.md                    # يوميات العمل / Work journal
├── [DOC-ADMIN-03] INDEX.md                      # فهرس المشروع / This file (Project index)
├── [DOC-ADMIN-04] CHANGELOG.md                  # سجل التغييرات / Changelog
├── [DOC-GUIDE-01] CONTRIBUTING.md               # دليل المساهمة / Contribution guide
├── [LEGAL-001] LICENSE                          # ترخيص MIT / MIT License
├── [INFRA-001] package.json                     # الحزمة الجذرية / Root package
├── [INFRA-002] tsconfig.base.json               # إعدادات TypeScript الأساسية / Base TS config
├── [INFRA-006] pnpm-workspace.yaml              # إعدادات pnpm Workspace / pnpm workspace config
│
├── 📁 packages/
│   │
│   ├── 📁 core/                                # [CORE] النواة المجردة / Headless Core
│   │   ├── [INFRA-005] package.json             # إعدادات حزمة النواة / Core package config
│   │   ├── [INFRA-012] vite.config.ts           # إعدادات Vite / Vite build config
│   │   │
│   │   ├── 📁 src/
│   │   │   ├── [CORE-011] index.ts              # التصدير العام / Public exports
│   │   │   │
│   │   │   ├── 📁 ast/                          # [CORE-001..003] تعريفات AST / AST definitions
│   │   │   │   ├── [CORE-001] types.ts          # تعريفات الأنواع / Type definitions
│   │   │   │   ├── [CORE-002] schema.ts         # مخطط AST / AST schema
│   │   │   │   └── [CORE-003] builder.ts        # بناء الكتل / Block builder
│   │   │   │
│   │   │   ├── 📁 state/                        # [CORE-004..006] الحالة والعمليات / State & Operations
│   │   │   │   ├── [CORE-004] editor-state.ts   # حالة المحرر / Editor state
│   │   │   │   ├── [CORE-005] operations.ts     # عمليات التحرير / Edit operations
│   │   │   │   └── [CORE-006] history.ts        # التراجع والإعادة / Undo/Redo history
│   │   │   │
│   │   │   ├── 📁 indexer/                      # [CORE-007..008] نظام الفهرسة / Indexing system
│   │   │   │   ├── [CORE-007] indexer.ts        # الفهرسة / Indexer
│   │   │   │   └── [CORE-008] search.ts         # واجهة البحث / Search interface
│   │   │   │
│   │   │   ├── 📁 parsers/                      # محللات Markdown/FrontMatter
│   │   │   │   ├── frontmatter-parser.ts        # محلل YAML FrontMatter
│   │   │   │   └── markdown.ts                  # محلل Markdown
│   │   │   │
│   │   │   ├── 📁 engines/                      # [CORE-019..022] محركات المكتب / Office engines
│   │   │   │   ├── [CORE-019] base-engine.ts    # محرك قواعد البيانات / Base engine
│   │   │   │   ├── [CORE-020] calc-engine.ts    # محرك جداول البيانات / Calc engine
│   │   │   │   ├── [CORE-021] writer-engine.ts  # محرك المستندات / Writer engine
│   │   │   │   └── [CORE-022] impress-engine.ts # محرك العروض / Impress engine
│   │   │   │
│   │   │   └── 📁 Utils/                        # [CORE-009..013] دوال مساعدة / Utility functions
│   │   │       ├── [CORE-009] id.ts             # توليد المعرفات / ID generation
│   │   │       ├── [CORE-010] validation.ts     # التحقق من الصحة / Validation
│   │   │       ├── [CORE-012] pipe.ts           # الخط أنابيب الوظيفي / Functional pipe
│   │   │       ├── [CORE-013] compose.ts        # التركيب الوظيفي / Functional compose
│   │   │       ├── arabic-text.ts               # أدوات النص العربي / Arabic text utilities
│   │   │       ├── formula-parser.ts            # محلل صيغ Excel / Formula parser
│   │   │       ├── content-validator.ts         # validators للكتل / Block validators
│   │   │       └── document-validator.ts        # التحقق الشامل / Document validator
│   │   │
│   │   └── 📁 tests/                            # [TEST-CORE] اختبارات النواة / Core tests
│   │       ├── [TEST-CORE-001] ast/types.test.ts          # اختبارات AST / AST tests
│   │       └── [TEST-CORE-002] state/editor-state.test.ts # اختبارات الحالة / State tests
│   │
│   ├── 📁 algorithms/                          # [ALGO] طبقة المنطق والخوارزميات / Logic & Algorithm Layer
│   │   ├── package.json
│   │   │
│   │   ├── 📁 src/
│   │   │   ├── [ALGO-010] index.ts              # Barrel Export
│   │   │   │
│   │   │   ├── 📁 command/                      # [ALGO-001..003] Command Pattern
│   │   │   │   ├── [ALGO-001] types.ts          # أنواع الأوامر / Command types
│   │   │   │   ├── [ALGO-002] executor.ts       # منفذ الأوامر / Command executor
│   │   │   │   └── [ALGO-003] registry.ts       # سجل الأوامر / Command registry
│   │   │   │
│   │   │   ├── 📁 formula/                      # [ALGO-004..006,018-019] Expression Evaluator
│   │   │   │   ├── [ALGO-004] parser.ts         # محلل تنازلي / Recursive descent parser
│   │   │   │   ├── [ALGO-005] evaluator.ts      # مُقيّم التعابير / Expression evaluator
│   │   │   │   ├── [ALGO-006] functions.ts      # دوال مدمجة / Built-in functions
│   │   │   │   ├── functions-math.ts            # دوال رياضية / Math functions
│   │   │   │   ├── functions-text.ts            # دوال نصية / Text functions
│   │   │   │   ├── functions-arabic.ts          # دوال عربية / Arabic functions
│   │   │   │   ├── functions-financial.ts       # دوال مالية / Financial functions
│   │   │   │   ├── functions-lookup-date.ts     # بحث وتواريخ / Lookup & Date functions
│   │   │   │   ├── functions-matrix.ts          # دوال المصفوفات / Matrix & Lambda
│   │   │   │   └── markdown-formula.ts          # محرك الصيغ / Formula engine
│   │   │   │
│   │   │   └── 📁 spatial/                      # [ALGO-007..009] Spatial Translation Engine
│   │   │       ├── [ALGO-007] types.ts          # أنواع الإحداثيات / Coordinate types
│   │   │       ├── [ALGO-008] mapper.ts         # المترجم المكاني / Spatial mapper
│   │   │       └── [ALGO-009] commands.ts       # أوامر مكانية / Spatial commands
│   │   │
│   │   └── 📁 tests/                            # [TEST-ALGO] اختبارات الخوارزميات / Algorithm tests
│   │
│   ├── 📁 storage/                              # [STORE] طبقة التخزين / Storage Layer
│   │   ├── package.json
│   │   │
│   │   ├── 📁 src/
│   │   │   ├── [STORE-005] index.ts             # Barrel Export
│   │   │   ├── [STORE-001] memory.ts            # In-Memory Store
│   │   │   ├── [STORE-002] localStorage.ts      # localStorage Adapter
│   │   │   ├── [STORE-003] indexeddb.ts         # IndexedDB Adapter
│   │   │   └── [STORE-004] snapshots.ts         # Undo/Redo Snapshots
│   │   │
│   │   └── 📁 tests/                            # [TEST-STORE] اختبارات التخزين / Storage tests
│   │
│   ├── 📁 templates/                            # [TPL] نظام القوالب / Template System
│   │   ├── package.json
│   │   │
│   │   ├── 📁 src/
│   │   │   ├── [TPL-006] index.ts               # Barrel Export
│   │   │   ├── [TPL-001] registry.ts            # Template Registry
│   │   │   ├── 📁 writer/                       # [TPL-002] قوالب Writer
│   │   │   ├── 📁 calc/                         # [TPL-003] قوالب Calc
│   │   │   ├── 📁 impress/                      # [TPL-004] قوالب Impress
│   │   │   └── 📁 base/                         # [TPL-005] قوالب Base
│   │   │
│   │   └── 📁 tests/                            # [TEST-TPL] اختبارات القوالب / Template tests
│   │
│   ├── 📁 serializers/                          # [SER] المحولات / Serializers
│   │   ├── 📁 basic/                            # المحولات الأساسية / Basic serializers
│   │   │   ├── markdown-serializer.ts           # [SER-001] محول Markdown
│   │   │   ├── html-serializer.ts               # [SER-002] محول HTML
│   │   │   └── txt-serializer.ts                # [SER-003] محول TXT
│   │   ├── 📁 advanced/                         # المحولات المتقدمة / Advanced serializers
│   │   │   ├── pdf-serializer.ts                # [SER-004] محول PDF
│   │   │   ├── latex-serializer.ts              # [SER-005] محول LaTeX
│   │   │   └── zip-engine.ts                    # محرك ZIP / ZIP archive engine
│   │   ├── 📁 docx/                             # [SER-006] محول Word DOCX
│   │   │   ├── docx-types.ts                    # أنواع DOCX
│   │   │   ├── docx-model.ts                    # نموذج المستند
│   │   │   ├── inline-parser.ts                 # محلل التنسيقات المضمنة
│   │   │   ├── docx-builders.ts                 # بناة العناصر
│   │   │   ├── section-rules.ts                 # قواعد الأقسام
│   │   │   ├── docx-converter.ts                # المحول الرئيسي
│   │   │   └── index.ts                         # Barrel Export
│   │   └── 📁 parsers/                          # محللات صفر اعتماديات
│   │       ├── frontmatter-parser.ts            # محلل YAML FrontMatter
│   │       └── markdown.ts                      # محلل Markdown
│   │
│   ├── 📁 adapters/                             # [ADAP] طبقات التكيف / Adapters
│   │   ├── 📁 react/                            # [ADAP-001] React Adapter
│   │   │   ├── [ADAP-001-01] use-editor.ts      # React Hook
│   │   │   ├── [ADAP-001-02] editor-provider.tsx # React Provider
│   │   │   └── [ADAP-001-03] index.ts
│   │   ├── 📁 vue/                              # [ADAP-002] Vue Adapter
│   │   │   ├── [ADAP-002-01] use-editor.ts
│   │   │   └── [ADAP-002-02] index.ts
│   │   ├── 📁 web-component/                    # [ADAP-003] Web Component
│   │   │   ├── [ADAP-003-01] libre-text-editor.ts
│   │   │   └── [ADAP-003-02] index.ts
│   │   └── 📁 vanilla/                          # [ADAP-004] Vanilla JS
│   │       ├── [ADAP-004-01] vanilla-editor.ts
│   │       └── [ADAP-004-02] index.ts
│   │
│   ├── 📁 plugins/                              # [PLUG] الإضافات الرسمية / Official Plugins
│   │   ├── 📁 mermaid/                          # [PLUG-001] رسوم بيانية / Diagrams
│   │   │   ├── [PLUG-001-01] mermaid-plugin.ts
│   │   │   └── [PLUG-001-02] index.ts
│   │   └── 📁 math/                             # [PLUG-002] معادلات LaTeX / LaTeX equations
│   │       ├── [PLUG-002-01] math-plugin.ts
│   │       └── [PLUG-002-02] index.ts
│   │
│   └── 📁 playground/                           # [PLAY] الملعب التجريبي / Interactive Playground
│       ├── [PLAY-001] index.html                 # الصفحة الرئيسية / Main page
│       ├── [PLAY-002] main.ts                    # نقطة الدخول / Entry point
│       └── [PLAY-003] examples.ts                # أمثلة تفاعلية / Interactive examples
│
├── 📁 docs/                                     # [DOC] التوثيق / Documentation
│   ├── 📁 api/                                  # [DOC-API] وثائق API / API Reference
│   │   └── [DOC-API-001] api-reference.md
│   ├── 📁 guides/                               # [DOC-GUIDE] أدلة المستخدم / User Guides
│   │   ├── [DOC-GUIDE-002] getting-started.md
│   │   ├── [DOC-GUIDE-003] architecture.md
│   │   └── [DOC-GUIDE-004] plugin-development.md
│   └── 📁 examples/                             # [DOC-EX] أمثلة عملية / Code Examples
│       ├── [DOC-EX-001] basic-usage.md
│       └── [DOC-EX-002] advanced-usage.md
│
├── 📁 scripts/                                  # [INFRA-003..004] سكربتات البناء / Build scripts
│   ├── [INFRA-003] generate-file.ts             # سكربت توليد الملفات / File generator
│   ├── [INFRA-004] generate-header.ts           # سكربت توليد الترويسة / Header generator
│   └── [INFRA-004] README.md                    # دليل استخدام السكربت / Scripts guide
│
├── 📁 .github/                                  # [INFRA-007] CI/CD
│   ├── [INFRA-007-01] workflows/ci.yml          # سير عمل التحقق / CI workflow
│   ├── [INFRA-007-02] workflows/release.yml     # سير عمل الإصدار / Release workflow
│   └── [INFRA-007-03] ISSUE_TEMPLATE/           # قوالب Issues / Issue templates
│
└── 📁 .opencode/                                # [INFRA-008] إعدادات OpenCode / OpenCode config
    └── [INFRA-008-01] opencode.jsonc
```

---

## جدول الملفات المرجعي الكامل

## Complete File Reference Table

### البنية التحتية - Infrastructure

| المعرف ID      | المسار Path                      | الوصف Arabic                | Description English     | الحالة Status |
| -------------- | -------------------------------- | --------------------------- | ----------------------- | ------------- |
| `INFRA-001`    | `/package.json`                  | الحزمة الجذرية              | Root package.json       | تم            |
| `INFRA-002`    | `/tsconfig.base.json`            | إعدادات TypeScript الأساسية | Base TypeScript config  | تم            |
| `INFRA-003`    | `/scripts/generate-file.ts`      | سكربت توليد الملفات         | File generator script   | تم            |
| `INFRA-004`    | `/scripts/generate-header.ts`    | سكربت توليد الترويسة        | Header generator script | تم            |
| `INFRA-005`    | `packages/core/package.json`     | إعدادات حزمة النواة         | Core package config     | تم            |
| `INFRA-006`    | `/pnpm-workspace.yaml`           | إعدادات pnpm Workspace      | pnpm workspace config   | تم            |
| `INFRA-007-01` | `/.github/workflows/ci.yml`      | سير عمل التحقق              | CI workflow             | لم يبدأ       |
| `INFRA-007-02` | `/.github/workflows/release.yml` | سير عمل الإصدار             | Release workflow        | لم يبدأ       |
| `INFRA-008-01` | `/.opencode/opencode.jsonc`      | إعدادات OpenCode            | OpenCode config         | لم يبدأ       |
| `INFRA-012`    | `packages/core/vite.config.ts`   | إعدادات Vite                | Vite build config       | تم            |

### النواة - Core

| المعرف ID      | المسار Path                                                  | الوصف Arabic          | Description English        | الحالة Status |
| -------------- | ------------------------------------------------------------ | --------------------- | -------------------------- | ------------- |
| `CORE-001`     | `packages/core/src/ast/types.ts`                             | تعريفات الأنواع       | Type definitions           | تم            |
| `CORE-002`     | `packages/core/src/ast/schema.ts`                            | مخطط AST              | AST schema                 | تم            |
| `CORE-003`     | `packages/core/src/ast/builder.ts`                           | بناء الكتل            | Block builder              | تم            |
| `CORE-004`     | `packages/core/src/state/editor-state.ts`                    | حالة المحرر           | Editor state               | تم            |
| `CORE-005`     | `packages/core/src/state/operations.ts`                      | عمليات التحرير        | Edit operations            | تم            |
| `CORE-006`     | `packages/core/src/state/history.ts`                         | التراجع والإعادة      | Undo/Redo history          | تم            |
| `CORE-007`     | `packages/core/src/indexer/indexer.ts`                       | الفهرسة               | Indexer                    | تم            |
| `CORE-008`     | `packages/core/src/indexer/search.ts`                        | واجهة البحث           | Search interface           | تم            |
| `CORE-009`     | `packages/core/src/utils/id.ts`                              | توليد المعرفات        | ID generation              | تم            |
| `CORE-010`     | `packages/core/src/utils/validation.ts`                      | التحقق من الصحة       | Validation                 | تم            |
| `CORE-011`     | `packages/core/src/index.ts`                                 | التصدير العام         | Public exports             | تم            |
| `CORE-012`     | `packages/core/src/utils/arabic-text.ts`                     | أدوات النص العربي     | Arabic text utilities      | تم            |
| `CORE-012`     | `packages/core/src/utils/formula-parser.ts`                  | محلل صيغ Excel        | Formula parser             | تم            |
| `CORE-013`     | `packages/core/src/utils/content-validator.ts`               | validators للكتل      | Block validators           | تم            |
| `CORE-013`     | `packages/core/src/utils/document-validator.ts`              | التحقق الشامل         | Document validator         | تم            |
| `CORE-014`     | `packages/core/src/parsers/frontmatter-parser.ts`            | محلل YAML FrontMatter | FrontMatter parser         | تم            |
| `CORE-014`     | `packages/core/src/parsers/markdown.ts`                      | محلل Markdown         | Markdown parser            | تم            |
| `CORE-ENG-001` | `packages/core/src/engines/html-pipeline.ts`                 | محرك HTMLPipeline     | HTML pipeline engine       | تم            |
| `CORE-ENG-002` | `packages/core/src/engines/file-type-detection.ts`           | التعرف على الملفات    | File type detection        | تم            |
| `CORE-ENG-003` | `packages/core/src/engines/unified-ingestion.ts`             | خط الاستيراد الموحد   | Unified ingestion          | تم            |
| `CORE-ENG-004` | `packages/core/src/engines/image-pipeline.ts`                | محرك الصور            | Image pipeline             | تم            |
| `CORE-016`     | `packages/core/src/engines/validation.ts`                    | محرك الفحص والتعقيم   | Validation engine          | تم            |
| `CORE-017`     | `packages/core/src/converters/universal-format-converter.ts` | محول التنسيقات الشامل | Universal format converter | تم            |
| `CORE-018`     | `packages/core/src/types.ts`                                 | أنواع المستندات       | Document types             | تم            |
| `CORE-019`     | `packages/core/src/engines/base-engine.ts`                   | محرك قواعد البيانات   | Base (Database) engine     | تم            |
| `CORE-020`     | `packages/core/src/engines/calc-engine.ts`                   | محرك جداول البيانات   | Calc engine                | تم            |
| `CORE-021`     | `packages/core/src/engines/writer-engine.ts`                 | محرك المستندات        | Writer engine              | تم            |
| `CORE-022`     | `packages/core/src/engines/impress-engine.ts`                | محرك العروض           | Impress engine             | تم            |
| `CORE-023`     | `packages/core/src/blocks/math-block.ts`                     | بلوك معادلات LaTeX    | Math equation block        | تم            |
| `CORE-024`     | `packages/core/src/blocks/details-block.ts`                  | بلوك منسدل تفاصيل     | Details accordion block    | تم            |
| `CORE-025`     | `packages/core/src/blocks/toc-block.ts`                      | بلوك جدول محتويات     | Table of contents block    | تم            |
| `CORE-026`     | `packages/core/src/blocks/svg-icon-block.ts`                 | بلوك أيقونة SVG       | SVG icon block             | تم            |
| `CORE-027`     | `packages/core/src/blocks/html-embed-block.ts`               | بلوك HTML معقّم       | Sanitized HTML embed block | تم            |

### الخوارزميات - Algorithms (ALGO)

| المعرف ID  | المسار Path                                           | الوصف Arabic               | Description English        | الحالة Status |
| ---------- | ----------------------------------------------------- | -------------------------- | -------------------------- | ------------- |
| `ALGO-001` | `packages/algorithms/src/command/types.ts`            | أنواع الأوامر              | Command types              | تم            |
| `ALGO-002` | `packages/algorithms/src/command/executor.ts`         | منفذ الأوامر               | Command executor           | تم            |
| `ALGO-003` | `packages/algorithms/src/command/registry.ts`         | سجل الأوامر                | Command registry           | تم            |
| `ALGO-004` | `packages/algorithms/src/formula/parser.ts`           | محلل تنازلي للصيغ          | Expression parser          | تم            |
| `ALGO-005` | `packages/algorithms/src/formula/evaluator.ts`        | مُقيّم التعابير            | Expression evaluator       | تم            |
| `ALGO-006` | `packages/algorithms/src/formula/functions.ts`        | دوال مدمجة                 | Built-in functions         | تم            |
| `ALGO-007` | `packages/algorithms/src/spatial/types.ts`            | أنواع الإحداثيات المكانية  | Spatial coordinate types   | تم            |
| `ALGO-008` | `packages/algorithms/src/spatial/mapper.ts`           | المترجم المكاني            | Spatial mapper             | تم            |
| `ALGO-009` | `packages/algorithms/src/spatial/commands.ts`         | أوامر مكانية               | Spatial commands           | تم            |
| `ALGO-010` | `packages/algorithms/src/index.ts`                    | Barrel Export              | Public exports             | تم            |
| `ALGO-018` | `packages/algorithms/src/formula/functions-matrix.ts` | دوال المصفوفات والـ Lambda | Matrix & Lambda functions  | تم            |
| `ALGO-019` | `packages/algorithms/src/formula/markdown-formula.ts` | محرك الصيغ                 | Formula engine             | تم            |
| `ALGO-020` | `packages/algorithms/src/graph/dependency.ts`         | كشف التبعيات الدائرية      | Dependency cycle detection | تم            |
| `ALGO-021` | `packages/algorithms/src/graph/routing.ts`            | توجيه محاذاةORTH           | Orthogonal routing         | تم            |
| `ALGO-022` | `packages/algorithms/src/graph/routing-types.ts`      | أنواع التوجيه              | Routing types              | تم            |
| `ALGO-023` | `packages/algorithms/src/graph/orthogonal-router.ts`  | مُوجّه محاذاة متقدم        | Advanced orthogonal router | تم            |
| `ALGO-024` | `packages/algorithms/src/tree/llrb.ts`                | شجرة LLRB                  | Left-Leaning Red-Black     | تم            |
| `ALGO-025` | `packages/algorithms/src/structure/disjoint-set.ts`   | مجموعة منفصلة              | Union-Find data structure  | تم            |
| `ALGO-026` | `packages/algorithms/src/sort/mergesort.ts`           | خوارزمية الدمج             | Bottom-Up MergeSort        | تم            |
| `ALGO-027` | `packages/algorithms/src/lookup/hlookup.ts`           | بحث أفقي                   | HLOOKUP function           | تم            |
| `ALGO-028` | `packages/algorithms/src/formula/arabic-aliases.ts`   | أسماء دوال عربية           | Arabic function aliases    | تم            |
| `ALGO-029` | `packages/algorithms/src/streets/similarity.ts`       | بحث أسماء شوارع            | Street name similarity     | تم            |
| `ALGO-030` | `packages/algorithms/src/types.ts`                    | أنواع مشتركة               | Shared algorithm types     | تم            |
| `ALGO-031` | `packages/algorithms/src/formula/latex-engine.ts`     | محرك LaTeX                 | LaTeX equation engine      | تم            |
| `ALGO-032` | `packages/algorithms/src/formula/markdown-engine.ts`  | محرك Markdown              | Markdown engine            | تم            |
| `ALGO-033` | `packages/algorithms/src/vector/common.ts`            | أدوات هندسية مشتركة        | Vector common utilities    | تم            |
| `ALGO-034` | `packages/algorithms/src/vector/coordinate-system.ts` | محرك الإحداثيات            | Coordinate system          | تم            |
| `ALGO-035` | `packages/algorithms/src/vector/mouse-algorithms.ts`  | خوارزميات الفأرة           | Mouse algorithms           | تم            |
| `ALGO-036` | `packages/algorithms/src/vector/smart-alignment.ts`   | المحاذاة الذكي             | Smart alignment            | تم            |
| `ALGO-037` | `packages/algorithms/src/vector/index.ts`             | Barrel Export              | Vector barrel export       | تم            |

### التخزين - Storage (STORE)

| المعرف ID   | المسار Path                            | الوصف Arabic         | Description English  | الحالة Status |
| ----------- | -------------------------------------- | -------------------- | -------------------- | ------------- |
| `STORE-001` | `packages/storage/src/memory.ts`       | In-Memory Store      | In-memory store      | تم            |
| `STORE-002` | `packages/storage/src/localStorage.ts` | localStorage Adapter | localStorage adapter | تم            |
| `STORE-003` | `packages/storage/src/indexeddb.ts`    | IndexedDB Adapter    | IndexedDB adapter    | تم            |
| `STORE-004` | `packages/storage/src/snapshots.ts`    | Undo/Redo Snapshots  | Undo/redo snapshots  | تم            |
| `STORE-005` | `packages/storage/src/index.ts`        | Barrel Export        | Public exports       | تم            |

### القوالب - Templates (TPL)

| المعرف ID | المسار Path                          | الوصف Arabic      | Description English | الحالة Status |
| --------- | ------------------------------------ | ----------------- | ------------------- | ------------- |
| `TPL-001` | `packages/templates/src/registry.ts` | Template Registry | Template registry   | تم            |
| `TPL-002` | `packages/templates/src/writer/`     | قوالب Writer      | Writer templates    | تم            |
| `TPL-003` | `packages/templates/src/calc/`       | قوالب Calc        | Calc templates      | تم            |
| `TPL-004` | `packages/templates/src/impress/`    | قوالب Impress     | Impress templates   | تم            |
| `TPL-005` | `packages/templates/src/base/`       | قوالب Base        | Base templates      | تم            |
| `TPL-006` | `packages/templates/src/index.ts`    | Barrel Export     | Public exports      | تم            |

### المحولات - Serializers

| المعرف ID    | المسار Path                                              | الوصف Arabic          | Description English | الحالة Status |
| ------------ | -------------------------------------------------------- | --------------------- | ------------------- | ------------- |
| `SER-001`    | `packages/serializers/markdown/`                         | محول Markdown         | Markdown serializer | تم            |
| `SER-002`    | `packages/serializers/html/`                             | محول HTML             | HTML serializer     | تم            |
| `SER-003`    | `packages/serializers/txt/`                              | محول TXT              | TXT serializer      | تم            |
| `SER-004`    | `packages/serializers/src/pdf/`                          | محول PDF              | PDF serializer      | تم            |
| `SER-005`    | `packages/serializers/src/latex/`                        | محول LaTeX            | LaTeX serializer    | تم            |
| `SER-006`    | `packages/serializers/src/docx/`                         | محول Word DOCX        | DOCX converter      | تم            |
| `SER-006-06` | `packages/serializers/src/parsers/markdown.ts`           | محلل Markdown         | Markdown parser     | تم            |
| `SER-006-07` | `packages/serializers/src/parsers/frontmatter-parser.ts` | محلل YAML FrontMatter | FrontMatter parser  | تم            |

### طبقات التكيف - Adapters

| المعرف ID  | المسار Path                        | الوصف Arabic  | Description English   | الحالة Status |
| ---------- | ---------------------------------- | ------------- | --------------------- | ------------- |
| `ADAP-001` | `packages/adapters/react/`         | React Adapter | React adapter         | تم            |
| `ADAP-002` | `packages/adapters/vue/`           | Vue Adapter   | Vue adapter           | تم            |
| `ADAP-003` | `packages/adapters/web-component/` | Web Component | Web Component adapter | تم            |
| `ADAP-004` | `packages/adapters/vanilla/`       | Vanilla JS    | Vanilla JS adapter    | تم            |

### الإضافات - Plugins

| المعرف ID  | المسار Path                 | الوصف Arabic  | Description English | الحالة Status |
| ---------- | --------------------------- | ------------- | ------------------- | ------------- |
| `PLUG-001` | `packages/plugins/mermaid/` | رسوم بيانية   | Diagram plugin      | تم            |
| `PLUG-002` | `packages/plugins/math/`    | معادلات LaTeX | Math/LaTeX plugin   | تم            |

### المكونات والخطافات المشتركة - Shared Components & Hooks

| المعرف ID         | المسار Path                                        | الوصف Arabic                   | Description English     | الحالة Status |
| ----------------- | -------------------------------------------------- | ------------------------------ | ----------------------- | ------------- |
| `SHARED-CMP-001`  | `packages/shared/components/SharedContextMenu.tsx` | المكون الموحد للقوائم السياقية | Unified Context Menu UI | تم            |
| `SHARED-HOOK-001` | `packages/shared/hooks/useContextMenu.ts`          | خطاف إدارة القوائم السياقية    | Context Menu React Hook | تم            |

### المحركات المشتركة - Shared Engines

| المعرف ID        | المسار Path                                    | الوصف Arabic          | Description English | الحالة Status |
| ---------------- | ---------------------------------------------- | --------------------- | ------------------- | ------------- |
| `SHARED-ENG-001` | `packages/shared/engines/AIEngine.ts`          | محرك الذكاء الاصطناعي | AI Engine           | تم            |
| `SHARED-ENG-002` | `packages/shared/engines/codeEditorEngines.ts` | محركات محرر الكود     | Code Editor Engines | تم            |
| `SHARED-ENG-003` | `packages/shared/engines/ComponentRegistry.ts` | سجل المكونات          | Component Registry  | تم            |
| `SHARED-ENG-004` | `packages/shared/engines/DiagramEngine.ts`     | محرك المخططات         | Diagram Engine      | تم            |
| `SHARED-ENG-005` | `packages/shared/engines/LaTeXEngine.ts`       | محرك LaTeX            | LaTeX Engine        | تم            |
| `SHARED-ENG-006` | `packages/shared/engines/MarkdownEngine.ts`    | محرك Markdown         | Markdown Engine     | تم            |
| `SHARED-ENG-007` | `packages/shared/engines/MindMapEngine.ts`     | محرك خرائط الذهن      | Mind Map Engine     | تم            |
| `SHARED-ENG-008` | `packages/shared/engines/PluginSystem.ts`      | نظام الإضافات         | Plugin System       | تم            |
| `SHARED-ENG-009` | `packages/shared/engines/ToolRegistry.ts`      | سجل الأدوات           | Tool Registry       | تم            |
| `SHARED-ENG-010` | `packages/shared/engines/ValidationEngine.ts`  | محرك التحقق           | Validation Engine   | تم            |

### نظام اللغات - Language System

| المعرف ID  | المسار Path                                              | الوصف Arabic     | Description English | الحالة Status |
| ---------- | -------------------------------------------------------- | ---------------- | ------------------- | ------------- |
| `LANG-001` | `packages/shared/engines/languages/language-registry.ts` | سجل اللغات       | Language Registry   | تم            |
| `LANG-002` | `packages/shared/engines/languages/language-runtime.ts`  | بيئة تشغيل اللغة | Language Runtime    | تم            |
| `LANG-003` | `packages/shared/engines/languages/packs/typescript.ts`  | حزمة TypeScript  | TypeScript Pack     | تم            |
| `LANG-004` | `packages/shared/engines/languages/packs/python.ts`      | حزمة Python      | Python Pack         | تم            |
| `LANG-005` | `packages/shared/engines/languages/packs/cpp.ts`         | حزمة C++         | C++ Pack            | تم            |
| `LANG-006` | `packages/shared/engines/languages/packs/web.ts`         | حزم الويب        | Web Packs           | تم            |

### مكتبة النواة المشتركة - lib-core

| المعرف ID     | المسار Path                                        | الوصف Arabic         | Description English    | الحالة Status |
| ------------- | -------------------------------------------------- | -------------------- | ---------------------- | ------------- |
| `LIBCORE-001` | `packages/shared/lib-core/code-interpreter/`       | م interpreter الكود  | Code Interpreter       | تم            |
| `LIBCORE-002` | `packages/shared/lib-core/computational-notebook/` | الدفتر الحسابي       | Computational Notebook | تم            |
| `LIBCORE-003` | `packages/shared/lib-core/document-pipeline/`      | خط أنابيب المستندات  | Document Pipeline      | تم            |
| `LIBCORE-004` | `packages/shared/lib-core/geometry/`               | الهندسة              | Geometry               | تم            |
| `LIBCORE-005` | `packages/shared/lib-core/grid-engine/`            | محرك الشبكة (Calc)   | Grid Engine            | تم            |
| `LIBCORE-006` | `packages/shared/lib-core/latex/`                  | محرك LaTeX           | LaTeX Engine           | تم            |
| `LIBCORE-007` | `packages/shared/lib-core/raster/`                 | معالجة الصور النقطية | Raster Processing      | تم            |
| `LIBCORE-008` | `packages/shared/lib-core/converters/`             | المحولات المشتركة    | Shared Converters      | تم            |
| `LIBCORE-009` | `packages/shared/lib-core/events/`                 | أحداث مشتركة         | Shared Events          | تم            |
| `LIBCORE-010` | `packages/shared/lib-core/animation/`              | محركات الحركة        | Animation Engines      | تم            |

### السمات التفاعلية - Traits

| المعرف ID        | المسار Path                                               | الوصف Arabic          | Description English   | الحالة Status |
| ---------------- | --------------------------------------------------------- | --------------------- | --------------------- | ------------- |
| `CORE-TRAIT-001` | `packages/core/src/traits/types.ts`                       | أنواع السمات          | Trait Types           | تم            |
| `CORE-TRAIT-002` | `packages/core/src/traits/draggable.ts`                   | سمة السحب             | Draggable Trait       | تم            |
| `CORE-TRAIT-003` | `packages/core/src/traits/resizable.ts`                   | سمة التحجيم           | Resizable Trait       | تم            |
| `CORE-TRAIT-004` | `packages/core/src/traits/styleable.ts`                   | سمة التنسيق           | Styleable Trait       | تم            |
| `CORE-TRAIT-005` | `packages/core/src/traits/lockable.ts`                    | سمة القفل             | Lockable Trait        | تم            |
| `CORE-TRAIT-006` | `packages/core/src/traits/trait-context-menu-resolver.ts` | محلل القوائم السياقية | Context Menu Resolver | تم            |

### بيئة التطوير المتكاملة - DevStudio

| المعرف ID | المسار Path                                                 | الوصف Arabic        | Description English  | الحالة Status |
| --------- | ----------------------------------------------------------- | ------------------- | -------------------- | ------------- |
| `DEV-001` | `packages/shell/dev-studio/core/DevStudioEngine.ts`         | الأوركسترا المركزي  | Central Orchestrator | تم            |
| `DEV-002` | `packages/shell/dev-studio/core/DevStudioTypes.ts`          | الأنواع والعقود     | Types & Contracts    | تم            |
| `DEV-003` | `packages/shell/dev-studio/core/DevStudioEvents.ts`         | ناقل الأحداث        | Event Bus            | تم            |
| `DEV-004` | `packages/shell/dev-studio/doctor/DoctorEngine.ts`          | محرك الفحص المركزي  | Central Doctor Gate  | تم            |
| `DEV-005` | `packages/shell/dev-studio/doctor/DependencyAuditor.ts`     | فاحص الاعتماديات    | Dependency Auditor   | تم            |
| `DEV-006` | `packages/shell/dev-studio/doctor/GeometryValidator.ts`     | فاحص الهندسة        | Geometry Validator   | تم            |
| `DEV-007` | `packages/shell/dev-studio/doctor/IdIntegrityChecker.ts`    | فاحص سلامة المعرفات | ID Integrity Checker | تم            |
| `DEV-008` | `packages/shell/dev-studio/doctor/StructureValidator.ts`    | فاحص الهيكل         | Structure Validator  | تم            |
| `DEV-009` | `packages/shell/dev-studio/doctor/ThemeValidator.ts`        | حارس الثيم الفاتح   | Theme Guardian       | تم            |
| `DEV-010` | `packages/shell/dev-studio/checkpoint/SnapshotEngine.ts`    | محرك اللقطات        | Snapshot Engine      | تم            |
| `DEV-011` | `packages/shell/dev-studio/checkpoint/RollbackManager.ts`   | مدير التراجع        | Rollback Manager     | تم            |
| `DEV-012` | `packages/shell/dev-studio/pipeline/TaskPipeline.ts`        | خط أنابيب المهمات   | Task Pipeline        | تم            |
| `DEV-013` | `packages/shell/dev-studio/tree/ProjectTreeModel.ts`        | نموذج شجرة المشروع  | Project Tree Model   | تم            |
| `DEV-014` | `packages/shell/dev-studio/tree/ProjectTreeView.ts`         | عرض شجرة المشروع    | Project Tree View    | تم            |
| `DEV-015` | `packages/shell/dev-studio/tree/TreeNavigation.ts`          | تنقل الشجرة         | Tree Navigation      | تم            |
| `DEV-016` | `packages/shell/dev-studio/tree/DecompositionEngine.ts`     | محرك التفكيك        | Decomposition Engine | تم            |
| `DEV-017` | `packages/shell/dev-studio/tree/DriftDetector.ts`           | كاشف الانحراف       | Drift Detector       | تم            |
| `DEV-018` | `packages/shell/dev-studio/tree/FileOperations.ts`          | عمليات الملفات      | File Operations      | تم            |
| `DEV-019` | `packages/shell/dev-studio/sync/CodeGenerator.ts`           | مولّد الكود         | Code Generator       | تم            |
| `DEV-020` | `packages/shell/dev-studio/sync/RegistrySync.ts`            | مزامن السجلات       | Registry Sync        | تم            |
| `DEV-021` | `packages/shell/dev-studio/scaffolder/ToolScaffolder.ts`    | مولّد الأدوات       | Tool Scaffolder      | تم            |
| `DEV-022` | `packages/shell/dev-studio/workbench/DevStudioWorkbench.ts` | سطح العمل           | Workbench            | تم            |
| `DEV-023` | `packages/shell/dev-studio/bridge/EditorBridge.ts`          | جسر الربط           | Editor Bridge        | تم            |
| `DEV-024` | `packages/shell/dev-studio/adapters/CanvasAdapter.ts`       | مكيّف الكانفا       | Canvas Adapter       | تم            |
| `DEV-025` | `packages/shell/dev-studio/adapters/EditorAdapter.ts`       | مكيّف المحرر        | Editor Adapter       | تم            |
| `DEV-026` | `packages/shell/dev-studio/adapters/PdfAdapter.ts`          | مكيّف PDF           | PDF Adapter          | تم            |
| `DEV-027` | `packages/shell/dev-studio/adapters/RichTextAdapter.ts`     | مكيّف النص الغني    | Rich Text Adapter    | تم            |
| `DEV-028` | `packages/shell/dev-studio/adapters/UIAdapter.ts`           | مكيّف الواجهة       | UI Adapter           | تم            |

### Shell والdevelopment studio

| المعرف ID   | المسار Path                                          | الوصف Arabic       | Description English | الحالة Status |
| ----------- | ---------------------------------------------------- | ------------------ | ------------------- | ------------- |
| `SHELL-001` | `packages/shell/dev-studio/core/DevStudioEngine.ts`  | محرك بيئة التطوير  | Dev Studio Engine   | تم            |
| `SHELL-002` | `packages/shell/dev-studio/doctor/DoctorEngine.ts`   | محرك الفحص والشفاء | Doctor Engine       | تم            |
| `SHELL-003` | `packages/shell/dev-studio/tree/ProjectTreeModel.ts` | نموذج شجرة المشروع | Project Tree Model  | تم            |
| `SHELL-004` | `packages/shell/Workbench.tsx`                       | سطح العمل الرئيسي  | Main Workbench      | تم            |

### الملعب التجريبي - Playground

| المعرف ID  | المسار Path                       | الوصف Arabic    | Description English  | الحالة Status |
| ---------- | --------------------------------- | --------------- | -------------------- | ------------- |
| `PLAY-001` | `packages/playground/index.html`  | الصفحة الرئيسية | Main page            | لم يبدأ       |
| `PLAY-002` | `packages/playground/main.ts`     | نقطة الدخول     | Entry point          | لم يبدأ       |
| `PLAY-003` | `packages/playground/examples.ts` | أمثلة تفاعلية   | Interactive examples | لم يبدأ       |

### التوثيق - Documentation

| المعرف ID      | المسار Path               | الوصف Arabic              | Description English          | الحالة Status |
| -------------- | ------------------------- | ------------------------- | ---------------------------- | ------------- |
| `DOC-000`      | `/README.md`              | الملف التعريفي الرئيسي    | Main project README          | تم            |
| `DOC-ADMIN-01` | `/PLAN.md`                | خطة المشروع               | Project plan                 | تم            |
| `DOC-ADMIN-02` | `/JOURNAL.md`             | يوميات العمل              | Work journal                 | تم            |
| `DOC-ADMIN-03` | `/INDEX.md`               | فهرس المشروع              | Project index                | تم            |
| `DOC-ADMIN-04` | `/CHANGELOG.md`           | سجل التغييرات             | Changelog                    | تم            |
| `DOC-ADMIN-05` | `/AGENTS.md`              | تعليمات العميل التنفيذي   | Executive agent instructions | تم            |
| `DOC-ADMIN-06` | `/Components Registry.md` | سجل المكونات              | Components registry          | تم            |
| `DOC-ADMIN-07` | `/API Registry.md`        | سجل الـ APIs والخوارزميات | API & algorithms registry    | تم            |
| `DOC-ADMIN-08` | `/SystemInventory.json`   | جرد النظام                | System inventory             | تم            |
| `DOC-GUIDE-01` | `/CONTRIBUTING.md`        | دليل المساهمة             | Contribution guide           | تم            |

### الاختبارات - Tests

| المعرف ID       | المسار Path                                      | الوصف Arabic    | Description English | الحالة Status |
| --------------- | ------------------------------------------------ | --------------- | ------------------- | ------------- |
| `TEST-CORE-001` | `packages/core/tests/ast/types.test.ts`          | اختبارات AST    | AST tests           | تم            |
| `TEST-CORE-002` | `packages/core/tests/state/editor-state.test.ts` | اختبارات الحالة | State tests         | تم            |

### التراخيص - Legal

| المعرف ID   | المسار Path | الوصف Arabic | Description English | الحالة Status |
| ----------- | ----------- | ------------ | ------------------- | ------------- |
| `LEGAL-001` | `/LICENSE`  | ترخيص MIT    | MIT License         | تم            |
