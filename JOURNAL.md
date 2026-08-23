/**

- ============================================================
- 📄 الملف: JOURNAL.md
- 📂 المسار: JOURNAL.md
- 🎯 الهدف الرئيسي: يوميات العمل اليومية للمشروع، تسجل
- المنجزات والتحديات والملاحظات لكل يوم عمل.
- 📋 المعايير:
- - يجب إضافة يومية جديدة في كل جلسة عمل.
- - يجب توثيق جميع المنجزات والتحديات.
- - يجب ربط كل إنجاز بالمرحلة (PHASE) والمعرف (ID) المقابل.
- 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
- 🏷️ المعرف: DOC-ADMIN-02
- 📅 تاريخ الإنشاء: 2026-08-19
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- 📚 المصادر المقتبسة: لا توجد.
- ============================================================
  */

# يوميات مشروع LibreText Editor Suite

## 2026-08-19

### المنجزات

- إنشاء الخطة المعمارية النموذجية (Blueprint) النهائية.
- تعريف جميع المراحل (PHASE-00 إلى PHASE-10).
- تعريف فهرس المعرفات الكامل (INFRA, CORE, SER, PLUG, ADAP, PLAY, DOC, SEC, TEST).
- كتابة بروميت العميل التنفيذي لفهرسة الملفات بالعربية.
- إنشاء ملفات الإدارة الأساسية (PLAN.md, JOURNAL.md, INDEX.md, LICENSE, CONTRIBUTING.md, README.md, CHANGELOG.md).
- تحديد هيكل المشروع النهائي مع المعرفات.
- إنشاء AGENTS.md [DOC-ADMIN-05] — تعليمات العميل التنفيذي الشاملة مع القواعد الصارمة.
- إنشاء Components Registry.md [DOC-ADMIN-06] — سجل المكونات (AST Nodes, Serializers, Adapters, Plugins).
- إنشاء API Registry.md [DOC-ADMIN-07] — سجل الـ APIs والخوارزميات.
- إنشاء SystemInventory.json [DOC-ADMIN-08] — جرد النظام الكامل.
- تحديث INDEX.md [DOC-ADMIN-03] — إضافة جميع الملفات الجديدة مع الشجرة الكاملة والبروميت.
- إضافة القواعد الصارمة الثلاثة الجديدة إلى AGENTS.md:
  - القاعدة 7: الثيم الفاتح النقي حصراً (Pure Daylight Canvas) — ممنوع أي ثيم داكن.
  - القاعدة 8: التفاعل بالماوس/الفأرة حصراً (Mouse-Only Interactions).
  - القاعدة 9: السبورة البيضاء التفاعلية (Interactive Whiteboard Canvas).
- مراجعة مشروع المرجع `محرر-html-الذكي-wysiwyg` واستخراج الأنماط (DaylightThemes, WhiteboardCanvas, ContextMenu, FloatingGizmo).

### تنفيذ PHASE-00 — بيئة التطوير

**تم إنشاء الملفات التالية:**

| الملف                          | المعرف      | الحالة             |
| ------------------------------ | ----------- | ------------------ |
| `package.json` (جذري)          | `INFRA-001` | تم                 |
| `tsconfig.base.json`           | `INFRA-002` | تم                 |
| `tsconfig.json`                | `INFRA-002` | تم (يتوسع من base) |
| `pnpm-workspace.yaml`          | `INFRA-006` | تم                 |
| `packages/core/package.json`   | `INFRA-005` | تم                 |
| `packages/core/vite.config.ts` | `INFRA-012` | تم                 |
| `scripts/generate-file.ts`     | `INFRA-003` | تم                 |
| `scripts/generate-header.ts`   | `INFRA-004` | تم                 |
| `scripts/README.md`            | `INFRA-004` | تم                 |
| `vitest.config.ts`             | `INFRA-002` | تم                 |
| `turbo.json`                   | `INFRA-006` | تم                 |
| `eslint.config.js`             | `INFRA-002` | تم                 |
| `.prettierrc`                  | `INFRA-002` | تم                 |
| `.gitignore`                   | `INFRA-002` | تم                 |

**التحقق:**

- ✅ `pnpm install` — تم بنجاح (280 حزمة)
- ✅ `pnpm typecheck` — TypeScript يعمل بدون أخطاء
- ✅ `pnpm lint` — ESLint يعمل (تحذيرات console فقط في السكربتات)
- ✅ `pnpm test` — Vitest يعمل (لا توجد ملفات اختبار بعد — متوقع)

### قيد العمل

- PHASE-01: النواة Core (AST, State, Operations, Indexer) — مكتمل.

---

### تنفيذ PHASE-01 — النواة Core

**تم إنشاء الملفات التالية:**

| الملف                                            | المعرف          | الوصف                        |
| ------------------------------------------------ | --------------- | ---------------------------- |
| `packages/core/src/ast/types.ts`                 | `CORE-001`      | تعريفات AST (20+ نوع)        |
| `packages/core/src/ast/schema.ts`                | `CORE-002`      | مخطط AST مع التحقق           |
| `packages/core/src/ast/builder.ts`               | `CORE-003`      | بناء الكتل (Builder Pattern) |
| `packages/core/src/state/editor-state.ts`        | `CORE-004`      | حالة المحرر (Immutable)      |
| `packages/core/src/state/operations.ts`          | `CORE-005`      | عمليات التحرير               |
| `packages/core/src/state/history.ts`             | `CORE-006`      | التراجع والإعادة             |
| `packages/core/src/indexer/indexer.ts`           | `CORE-007`      | نظام الفهرسة                 |
| `packages/core/src/indexer/search.ts`            | `CORE-008`      | واجهة البحث النصي            |
| `packages/core/src/utils/id.ts`                  | `CORE-009`      | توليد المعرفات               |
| `packages/core/src/utils/validation.ts`          | `CORE-010`      | التحقق من الصحة              |
| `packages/core/src/index.ts`                     | `CORE-011`      | التصدير العام                |
| `packages/core/tests/ast/types.test.ts`          | `TEST-CORE-001` | اختبارات AST (28 اختبار)     |
| `packages/core/tests/state/editor-state.test.ts` | `TEST-CORE-002` | اختبارات الحالة (16 اختبار)  |

**التحقق:**

- ✅ `pnpm typecheck` — TypeScript يعمل بدون أخطاء
- ✅ `pnpm test` — **44 اختبار ناجح** (28 AST + 16 State)

### قيد العمل

- PHASE-02: المحولات الأساسية (Markdown, HTML, TXT) — التالي.

### التحديات

- التأكد من استخدام Vite بدلاً من tsup للتوافق الكامل مع TypeScript.
- ضرورة توثيق جميع المصادر المفتوحة المقتبسة بدقة.
- التوفيق بين أنماط webpainter-next ومحرر-html-الذكي-wysiwyg مع مشروع LibreText.

### ملاحظات

- التركيز على الجودة النموذجية بدلاً من السرعة.
- كل مرحلة يجب أن تمر بمراجعة قبل الانتقال للمرحلة التالية.
- سيتم استخدام pnpm + Turborepo + Vite + Vitest كأدوات أساسية.
- مشروع المرجع `محرر-html-الذكي-wysiwyg` هو النموذج الأساسي لنظام الثيمات والتفاعل بالماوس.
- مشروع المرجع `webpainter-next` هو النموذج الأساسي لũтрOak التوثيق والتعليمات.

---

## 2026-08-19 — إعادة الهيكلة المعمارية

### المنجزات

- اعتماد المعمارية الجديدة بعد مراجعة شاملة للمشروع.
- إنشاء ملف RESTRUCTURING_PLAN.md — خطة إعادة الهيكلة الشاملة.
- تحديث AGENTS.md [DOC-ADMIN-05] — إضافة:
  - القاعدة 5.1: حدود الكود الصارمة (250 سطر/ملف، 50 سطر/دالة).
  - القاعدة 5.2: طبقة المنطق والخوارزميات (Command Pattern + Expression Evaluator).
  - القاعدة 5.3: محرك الترجمة المكانية (Spatial Translation Engine).
  - القاعدة 5.4: النطاقات المكتبية الأربعة (Writer, Calc, Impress, Base).
  - القاعدة 5.5: الذاكرة والقوالب (Storage + Templates).
  - تحديث فهرس المعرفات: إضافة ALGO-_, STORE-_, TPL-*.
  - تحديث الشجرة الهيكلية: 8 حزم بدلاً من 5.
  - تحديث خريطة التكامل: 9 حزم مستهلكة.
  - تحديث المراحل: PHASE-06 إلى PHASE-13.
- تحديث PLAN.md [DOC-ADMIN-01] — تحديث المراحل والمؤشرات.
- تحديث INDEX.md [DOC-ADMIN-03] — شجرة كاملة بـ 8 حزم مع جميع الملفات.
- تحديث Components Registry.md [DOC-ADMIN-06] — إضافة مكونات Algorithms, Storage, Templates.
- تحديث API Registry.md [DOC-ADMIN-07] — إضافة APIs الأوامر، الصيغ، المكانية، التخزين، القوالب.
- إنشاء هيكل حزمة @libretext/algorithms (فارغ — package.json فقط).
- إنشاء هيكل حزمة @libretext/storage (فارغ — package.json فقط).
- إنشاء هيكل حزمة @libretext/templates (فارغ — package.json فقط).
- تحديث tsconfig.base.json — إضافة مسارات的新 الحزم.
- تحديث vitest.config.ts — إضافة اختبارات新 الحزم.

### القرارات المعمارية

| القرار           | الاختيار                               | السبب                           |
| ---------------- | -------------------------------------- | ------------------------------- |
| طبقة المنطق      | Command Pattern + Expression Evaluator | مرونة عالية + قابلية للتوسع     |
| الترجمة المكانية | Adapter → SpatialMapper → Core         | فصل التفاصيل التقنية عن النواة  |
| التخزين          | In-Memory + localStorage + IndexedDB   | ثلاث طبقات: حي/مؤقت/دائم        |
| القوالب          | Template Registry متعددة النطاقات      | دعم Writer, Calc, Impress, Base |

### التحديات

- ضرورة تقسيم الكود الموجود الذي يتجاوز 250 سطر (CORE-001 و CORE-004).
- تحديد دوال المكتبات الخارجية للخوارزميات (أو كتابتها من الصفر).
- ضمان عدم تداخل ال_hardيات بين الحزم الجديدة.

### ملاحظات

- الكود المكتوب حالياً (120 اختبار) لا يتأثر بأي تغيير — كل شيء إضافي.
- الحزم الجديدة تعتمد على @libretext/core فقط (لا دورة).

---

## 2026-08-19 — إنجاز طبقة المنطق والخوارزميات (PHASE-06)

### المنجزات

- تنفيذ `ALGO-007` (`packages/algorithms/src/spatial/types.ts`) الإصدار v3:
  - دعم الأصفار البادئة في تسميات الخلايا (`A01` تعادل `A1`).
  - دعم الأعمدة متعددة الأحرف (`AA`, `AB`, `XFD`).
  - تمييز كامل بين `LogicalCoordinate` و `GridCoordinate`.
- تنفيذ `ALGO-008` (`packages/algorithms/src/spatial/mapper.ts`) الإصدار v2:
  - محرك الترجمة المكانية الشامل `translateCoords` و `translateToGrid` و `translateToLogical`.
  - تحويل الوحدات القياسية (px, cm, mm, in, pt).
  - حماية من القسمة على صفر، والحدود القصوى `maxRow` و `maxCol`.
  - خريطة الوحدات الافتراضية للنطاقات المكتبية الأربعة (`DOMAIN_DEFAULT_UNIT`).
- كتابة اختبارات شاملة في `packages/algorithms/tests/spatial/mapper.test.ts` و `types.test.ts`.
- تحديث `FUNCTION_INDEX.md` و `API Registry.md` و `INDEX.md`.
- **التحقق الشامل:** نجاح جميع الاختبارات الـ 369 في 20 ملف اختبار عبر Vitest.

### قيد العمل

- تنفيذ `ALGO-009` (`packages/algorithms/src/spatial/commands.ts`) الإصدار v2:
  - مصانع الأوامر المكانية: `createMoveCommand`, `createResizeCommand`, `createSelectCommand`, `createDeleteCommand`, `createCreateCommand`.
  - دوال الحساب والتحويل: `computeMoveDelta` (مع Discriminated Union: `kind: 'logical' | 'grid'`), و `toBoundingBox`.
  - معالجة دفاعية وفحص دقيق لمنع خلط الوحدات والتحقق من الأبعاد الموجبة وصحة المحتوى.
- كتابة اختبارات شاملة في `packages/algorithms/tests/spatial/commands.test.ts` (23 اختبار).
- تحديث `FUNCTION_INDEX.md` و `API Registry.md` و `INDEX.md`.
- **التحقق الشامل:** نجاح جميع الاختبارات الـ 395 في 21 ملف اختبار عبر Vitest بنسبة 100%.

### قيد العمل

- اكتمال PHASE-06 (طبقة المنطق والخوارزميات) بنسبة 100%.
- المرحلة التالية: PHASE-07 (طبقة التخزين `@libretext/storage`).

---

## 2026-08-21

### المنجزات

- **Q-001:** تكريب محركات الأولوية العالية من النسخة الاحتياطية (9 ملفات):
  - `html-pipeline.ts` (CORE-ENG-001) — تنقية HTML + تحويل ToRichTextDocument
  - `file-type-detection.ts` (CORE-ENG-002) — التعرف على أنواع الملفات بإشارات متعددة
  - `unified-ingestion.ts` (CORE-ENG-003) — خط الاستيراد الموحد مع إصلاح Mojibake
  - `image-pipeline.ts` (CORE-ENG-004) — معالجة الصور (EXIF, قص, فلاتر, ضغط)
  - `validation.ts` (CORE-016) — فحص وتعقيم HTML
  - `universal-format-converter.ts` (CORE-017) — محول 20+ تنسيق (مكيّف: أزيلت الاعتمادية على zipUtils/ImageFormatEngine/VectorTracerEngine)
  - `types.ts` (CORE-018) — DocumentModel, EditorPlugin, SharedFormattingState (مكيّف: أزيل React ComponentType)
  - `latex-engine.ts` (ALGO-031) — محرك LaTeX → SVG/HTML بتحليل تنازلي تكراري
  - `markdown-engine.ts` (ALGO-032) — محرك MD↔HTML ثنائي الاتجاه مع دعم LaTeX
- **Q-002:** تكريب خوارزميات المتجهات والتفاعل (4 ملفات):
  - `vector/common.ts` (ALGO-033) — Point2D, BoundingBox, debounce/throttle, deepClone
  - `vector/coordinate-system.ts` (ALGO-034) — تحويل screen↔world, zoom towards mouse
  - `vector/mouse-algorithms.ts` (ALGO-035) — 8 مقابض تحكم, Ray Casting
  - `vector/smart-alignment.ts` (ALGO-036) — محاذاة ذكية (start/center/end)
- **Q-003:** أسكريبتات الفهرسة التلقائية (3 ملفات):
  - `scripts/update-indexes.ts` (INFRA-014) — فاحص شامل للمشروع (947 رمز في 7 حزم)
  - `scripts/generate-inventory.ts` (INFRA-015) — مولّد جرد المكونات لكل محرر
  - `scripts/atomic-inventory.ts` (INFRA-016) — مولّد الجرد الذري مع كشف التكرار والفجوات
- ** kotob scripts**
  - `EDITOR_INVENTORY.md` — جرد المكونات (Writer 9, Calc 2, Impress 8, Base 2)
  - `EXECUTION_QUEUE.md` — قائمة التنفيذ المرقمة Q-001..Q-024
  - `ATOMIC_INVENTORY.md` — الجرد الذري (160 ملف: 144 نشط, 4 مكرر, 3 غير مستخدم, 9 كبير)
  - `ATOMIC_INVENTORY.json` — بيانات الجرد الذري

### نتائج التحليل الذري (Atomic Inventory)

| الفئة           | العدد | ملاحظات                                                        |
| --------------- | ----- | -------------------------------------------------------------- |
| إجمالي الملفات  | 160   |                                                                |
| نشط             | 144   | ✅                                                             |
| مكرر            | 4     | 2 أزواج متطابقة (parsers)                                      |
| غير مستخدم      | 3     | `document-validator.ts`, `odf-package.ts`, `calc-templates.ts` |
| كبير (>400 سطر) | 9     | `functions-matrix.ts` (847) هو الأكبر                          |

### التكرارات المكتشفة

1. `core/src/parsers/frontmatter-parser.ts` = `serializers/src/parsers/frontmatter-parser.ts`
2. `core/src/parsers/markdown.ts` = `serializers/src/parsers/markdown.ts`

### الملفات غير المستخدمة

1. `core/src/utils/document-validator.ts` (255 سطر)
2. `serializers/src/odf-package.ts` (134 سطر)
3. `templates/src/calc/calc-templates.ts` (277 سطر)

### الملفات الكبيرة (>400 سطر)

1. `algorithms/src/formula/functions-matrix.ts` — 847 سطر
2. `algorithms/src/formula/markdown-formula.ts` — 559 سطر
3. `templates/src/writer/writer-templates.ts` — 555 سطر
4. `serializers/src/docx/docx-model.ts` — 472 سطر
5. `algorithms/src/spatial/vector-path.ts` — 445 سطر
6. `plugins/src/canvas-designer/schema-registry.ts` — 443 سطر
7. `templates/src/registry.ts` — 443 سطر
8. `core/src/converters/universal-format-converter.ts` — 415 سطر
9. `core/src/utils/formula-parser.ts` — 405 سطر

### التزامات Git

- `fd04e2b` — تكريب HIGH Priority Engines (Q-001)
- `688b419` — تكريب Vector/Interaction Algorithms (Q-002)
- `4dd16c4` — أسكريبتات الفهرسة + EDITOR_INVENTORY + EXECUTION_QUEUE + FUNCTION_INDEX (Q-003)

### الخطوة التالية

- اتخاذ قرار بشأن:
  1. حذف الملفات غير المستخدمة (3 ملفات)
  2. إزالة التكرارات (esafer واحد من كل زوج)
  3. تقسيم الملفات الكبيرة (9 ملفات >400 سطر)
  4. حذف النسخة الاحتياطية بعد الانتهاء

---

## 2026-08-21 (Part 2 — Afternoon/Evening)

### المنجزات

#### تكامل النسخة الاحتياطية الجديدة (`المعدل`)

- اندمجت ملفات المحركات من النسخة الاحتياطية الجديدة:
  - `mouse-tooling-engine.ts` (CORE-017) — بروفايل أدوات لكل بلوك
  - `tool-registry.ts` (CORE-020) — سجل IoC للأدوات
  - `doctor-self-healing-engine.ts` (CORE-021) — شفاء ذاتي
  - `mouse-diagnostics.ts` (ALGO-010) — تشخيص إحداثيات الشاشة
  - `auto-layout-engine.ts` (ALGO-011) — تخطيط أوتوماتيكي
  - `spatial-drag-algorithms.ts` (ALGO-028) — خوارزميات سحب كاملة
  - بلوكات: `code-editor` + `audio-block` مع بروفايلات أدوات
  - `contextMenuEngine.ts` — محرك قوائم سياقية محسّن
- أُصلحت 7 أخطاء نوعية صارمة
- حُذفت النسخة الاحتياطية الأولى (`0000000000000`)

#### المستوى 2 — تفاعل (Q-006..Q-010)

- `spatial-drag-engine.ts` (CORE-ENG-009): سحب مكاني مع تسنين وضبط حدود
- `marquee-selection-engine.ts` (CORE-ENG-010): تحديد بالصندوق المطاطي
- `multi-selection-engine.ts` (CORE-ENG-011): تحديد متعدد مع عكس وتحديد الكل
- `undo-redo-engine.ts` (CORE-ENG-012): تراجع/إعادة بسجلات + حد أقصى
- `mouse-command-registry.ts` (CORE-ENG-013): سجل أوامر الماوس

#### المستوى 3 — ذكاء (Q-011..Q-016)

- `smart-snap-engine.ts` (ALGO-031): تسنين ذكي مع خطوط إرشاد
- `dynamic-guide-lines.ts` (ALGO-032): خطوط إرشاد حية + مؤشرات قياس
- `smart-rtl-alignment.ts` (ALGO-033): كشف اتجاه النص RTL/LTR
- `screen-edge-detector.ts` (CORE-ENG-014): كشف حواف الشاشة وعكس القوائم
- `bounding-clamping-engine.ts` (CORE-ENG-015): تقييد العناصر داخل حدود اللوحة
- `z-order-manager.ts` (CORE-ENG-016): إدارة ترتيب الطبقات

#### المستوى 4 — بلوكات وأدوات (Q-017..Q-022)

- `vector/snap.ts` (ALGO-034): تسنين متعدد الأهداف
- `vector/ref-line.ts` (ALGO-035): خطوط إرشاد ديناميكية
- `vector/control-handle-manager.ts` (ALGO-036): 8 مقابض تحجيم + تدوير
- `selection-manager.ts` (CORE-ENG-017): مدير تحديد شامل
- `block-mapper.ts` (CORE-ENG-018): خريطة بلوكات بصرية

#### المستوى 5 — محركات متوسطة (Q-023..Q-028)

- `diagram-engine.ts` (ALGO-037): محرك رسومات SVG
- `component-registry.ts` (CORE-REG-001): سجل مكونات مركزي
- `smart-component-engine.ts` (CORE-ENG-019): تجميع ذكي مع كشف تبعيات
- `callout-engine.ts` (CORE-ENG-020): صناديق تعليق بصرية

#### LEVEL 6 — توثيق

- `CHANGELOG.md` — توثيق شامل لجميع المستويات 1-5
- `FUNCTION_INDEX.md` — 1134 رمز مفهرس (كان 947)

#### الاختبارات

- 20 ملف اختبار جديد — +107 اختبار (963 إجمالي من 856)
- 66 ملف اختبار ناجح — صفر خطأ tsc

### الإحصائيات النهائية

| المؤشر             | القيمة              |
| ------------------ | ------------------- |
| إجمالي المهام      | 31                  |
| مكتملة             | 30 (97%)            |
| مُؤجّلة            | 1 (الملعب التجريبي) |
| ملفات المحركات     | 30+ محرك            |
| ملفات الاختبار     | 66 ملف              |
| الاختبارات الناجحة | 963                 |
| الرموز المفهرسة    | 1134                |

### التزامات Git

- `4ba4b2f` — تكامل محركات النسخة الاحتياطية + خوارزميات مكانية
- `f2c9e0e` — المستوى 2: سحب + تحديد + تراجع + أوامر
- `99de8af` — المستوى 3: تسنين + إرشاد + RTL + حواف + طبقات
- `a6c17dd` — المستوى 4: تسنين متعدد + مقابض + تحديد + بلوكات
- `392c310` — المستوى 5: رسومات + سجل + تجميع + تعليقات
- `5e317b0` — التوثيق: CHANGELOG + FUNCTION_INDEX
- `da2fc51` — اختبارات: 20 ملف + 107 اختبار جديد

---

## 2026-08-22 — تحسينات القوائم السياقية وتكامل الأرشيف

### المنجزات

#### 1. تحسينات القوائم السياقية (Context Menu Enhancements)

- **أيقونات دلالية غنية (CORE-ENG-022):**
  - إضافة حقل `iconKey` لجميع أنواع عناصر القائمة (ActionMenuItem, SubmenuMenuItem, ResolvedMenuItem)
  - إنشاء `CONTEXT_MENU_ICON_MAP` مع 47 تعيين أيقونة دلالي (scissors, clipboard, trash-2, etc.)
  - دالة `resolveSemanticIcon()` للتوافق مع أي نظام أيقونات
- **تنقل باللوحة المفاتيح:**
  - `createKeyboardNavHandler()` — ArrowUp/Down/Enter/Escape
  - لف حول الحدود، تخطي العناصر المعطلة
  - إرجاع نوع الإجراء: 'select' | 'close' | 'navigate' | 'none'
- **إغلاق تلقائي عند التمرير:**
  - `createScrollCloseHandler()` مع `{ capture: true, passive: true }`
  - إطلاق مرة واحدة على أي حدث scroll/wheel
  - debounce اختياري، هدف قابل للحقن (للاختبار)
- **تتبع تحريك الماوس:**
  - `createHoverTracker()` مع استدعاء onChange
  - تتبع hoveredIndex و hoveredId
- **أنماط CSS والحركة (CORE-ENG-023):**
  - `@keyframes menuEnter`: scale(0.95)->1 + opacity 0->1
  - `@keyframes submenuEnter`: translateX(-6px)->0
  - `cubic-bezier(0.16, 1, 0.3, 1)` = دخول سريع وخروج سلس
  - `CONTEXT_MENU_THEME`: 12 رمز ثيم فاتح نقي (بدون ألوان داكنة)
  - `generateContextMenuCss()`: سلسلة CSS كاملة للحقن
- **بناؤون مسبقون (Pre-built Builders):**
  - `buildCanvasMenuItems()` — قائمة سياقية للكانفا مع مفاتيح أيقونات
  - `buildRichTextMenuItems()` — قائمة سياقية للنصوص الغنية مع اختصارات
  - الفواصل تُضاف فقط عند وجود عناصر قبل/بعد

#### 2. توثيق المعايير والكتل

- **DESIGN_BOOK.md (DOC-ADMIN-13):** كتاب التصميم والمعايير القياسية — 218 سطر
- **DesignStandards.md (DOC-ADMIN-14):** معايير UI/UX شاملة — 218 سطر

#### 3. تكامل ملفات الأرشيف من المعدل 3

- نسخ 9 ملفات جذرية:
  - `ATOMIC_INVENTORY.json` + `ATOMIC_INVENTORY.md` — الجرد الذري
  - `BLOCKS_ANALYTICS.json` + `BLOCKS_AND_TOOLS_REGISTRY.md` — تحليلات الكتل
  - `EDITOR_INVENTORY.md` — جرد المحررات
  - `RESTRUCTURING_PLAN.md` — خطة إعادة الهيكلة
  - `SYSTEM_ANALYTICS.md` — تحليلات النظام
  - `TOOLS_AUDIT_REPORT.md` — تقرير تدقيق الأدوات
  - `TODONext_19_08_2026.md` — مهام التحديث
- نسخ `MIGRATION_NOTES.md (DOC-ADMIN-11)` — ملاحظات هجرة الأرشيف القديم

### الإحصائيات النهائية

| المؤشر                | القيمة    |
| --------------------- | --------- |
| ملفات الاختبار        | 71 ملف    |
| الاختبارات الناجحة    | 1122      |
| أخطاء TypeScript      | 0         |
| الملفات الجديدة اليوم | 12 ملف    |
| الأيقونات الدلالية    | 47 أيقونة |

### التزامات Git

- `1f1ccc1` — نسخ DESIGN_BOOK.md و DesignStandards.md
- `4738410` — تحسين context-menu-engine.ts (labelAr, checked, focus nav)
- `3396547` — طبقة تفاعل القوائم الكاملة (interactions + css + icon map + builders)
  -_pending- — تكامل ملفات الأرشيف والجورنال

- **2026-08-22**: مزامنة فهارس النظام والمكونات تلقائياً عبر سكربت `sync-registry.ts`. تم رصد واكتشاف 2754 رمزاً ومكوناً نشطاً.

---

## 2026-08-22 (Part 2 — جلسة توحيد القوائم السياقية والربط المكاني)

### 🎯 الهدف والمهمة الرئيسية

إنهاء الفجوة بين طبقة النواة المجردة (`@libretext/core`) وواجهات المستخدم، وبناء مكون القائمة السياقية المشترك (`SharedContextMenu`) وربطه فعلياً بمحرر الكانفا (`CanvasDesignerPlugin`) وفق عقد موحد صارم، ثيم فاتح نقي 100%، وتفاعل ماوسي بحت دون اختصارات إلزامية.

### 📋 المنجزات التفصيلية

1. **إنشاء المكون الموحد `SharedContextMenu.tsx` (`SHARED-CMP-001`):**
   - المسار: `packages/shared/components/SharedContextMenu.tsx`.
   - استيراد عقد `ContextMenuItem` الموحد حصراً من `@libretext/core` بدون أي `as any` أو تشويش نوعي.
   - تطبيق ثيم نهاري نقي (Pure Daylight Canvas: `bg-white/95`, `border-slate-200/90`, `text-slate-700`, `hover:bg-slate-50`).
   - دعم التفاعل بالماوس حصراً: استجابة للنقر بالزر الأيمن، الإغلاق عند النقر الخارجي أو التمرير، وحماية الإحداثيات من الخروج عن حدود الشاشة (`Screen Edge Clamping`).
2. **توثيق القرار المعماري لعناصر الكانفا:**
   - تم توثيق إسناد السمات الأربع (`draggable`, `resizable`, `styleable`, `lockable`) في كود `CanvasDesignerPlugin.tsx` كقرار معماري صريح نابع من طبيعة عناصر الكانفا ككائنات حرة التموضع المطلق (`Absolute-Positioned Objects`).
3. **تطبيق الـ Callbacks الفعلية في `CanvasDesignerPlugin.tsx`:**
   - ربط القفل/إلغاء القفل (`onLockToggle`) مع خاصية `locked`.
   - ربط ترتيب الطبقات (`onBringToFront` / `onSendToBack`) مع إعادة ترتيب مصفوفة العناصر.
   - ربط إعادة ضبط المقاس والمظهر (`onResetSize` / `onResetStyle`).
   - ربط التكرار والحذف (`onDuplicate` / `onDelete`) مع توليد معرفات جديدة وتعديل الـ State فوراً.
4. **معالجة وحماية حدود الحزم (Package Boundaries):**
   - استبدال المسارات النسبية المتجاوزة للحدود (`../../core/src`) بالاستيراد عبر المعرف الرسمي للباكدج (`@libretext/core`).
   - دعم وتوحيد الاتساق في دالة `openMenu` بـ `useContextMenu.ts` لتخزين `items` و `title` سواء تم الاستدعاء بحدث الماوس أو بالإحداثيات المباشرة (`x, y`).
5. **التحقق التقني والبناء:**
   - اكتمال البناء بنجاح تام عبر `compile_applet` بدون أي خطأ كومبايلر أو أخطاء نوعية.

---

### 💡 الدروس المستفادة (Lessons Learned)

1. **القرارات المعمارية يجب أن تُكتب وتُسمى كما هي:**
   - عند غياب بيانات وصفية كاملة لعنصر ما في الـ AST، فإن إسناد سمات عامة يجب أن يُعلن عنه كـ **"قرار معماري صريح" (Explicit Architectural Decision)** وليس كـ "استخراج تلقائي وهمي". الوضوح يمنع التضارب بين المطورين مستقبلاً.
2. **مخاطر الـ `as any` في سد فجوات العقود:**
   - استخدام `as any` لتمرير كائنات بين الحزم يخفي أخطاء runtime حقيقية (مثل اختلاف `readonly []` عن مصفوفة عادية أو غياب حقل `items` من الحالة). توحيد الـ Type Definition عند المصدر في النواة هو الحل الوحيد الموثوق.
3. **احترام حدود الحزم (Monorepo Package Encapsulation):**
   - الاستيراد عبر المسارات النسبية العابرة للمجلدات (`../../core/src/...`) يكسر مبدأ العزل والاستقلالية ويفشل في الـ Bundling للإنتاج. الاعتماد على package specifiers المعتمدة في `tsconfig` و `vite.config` (`@libretext/core`) يضمن حماية معمارية الـ Zero-Dependency النواة.
4. **اتساق الـ Overloads في الـ Hooks المشتركة:**
   - عند توفير أكثر من توقيع (Signature) لدالة فتح القوائم (`openMenu` بالإحداثيات مقابل `openContextMenu` بالحدث)، يجب أن تفضي جميع المسارات إلى نفس شكل الحالة الكامل (`State Shape`) دون إسقاط أي حقول مثل `items` أو `title`.

---

## 2026-08-22 (Part 3 — جلسة استيراد كامل من المعدل 4 و المعدل 5)

### 🎯 الهدف والمهمة الرئيسية

استيراد كافة الدوال والخوارزميات والملفات غير المضمنة من نسختي المعدل 4 والمعدل 5 إلى مشروعنا الرئيسي، مع ضمان عدم وجود أخطاء نوعية واختبارات ناجحة.

### 📋 المنجزات التفصيلية

#### المرحلة الأولى: استيراد المعدل 4 (346 ملف — 85,098 سطر)

**Core Infrastructure (packages/core/):**

- `commands/`: allCommandOptions.ts, CommandRegistry.ts — نظام الأوامر المركزي
- `contributions/`: ContributionRegistry.ts — سجل المساهمات
- `documents/`: DocumentManager.ts — مدير المستندات
- `engines/`: HtmlPipelineEngine, FileTypeDetectionEngine, ImagePipelineEngine, UnifiedIngestionPipeline, index.ts
- `events/`: EventBus.ts — ناقل الأحداث
- `history/`: HistoryManager.ts — مدير سجل التغييرات
- `plugins/`: PluginRegistry, PluginContext, BaseEditorPlugin, SnippetsPlugin, index.ts
- `services/`: UiPreferencesService.ts
- `system/`: ExtensionManager, Kernel, ServiceContainer — نواة النظام
- `storage/`: IndexedDBDocumentStorage, LocalForageDocumentStorage
- `types.ts`, `index.ts`, `createEditorServices.ts`

**HTML Blocks (10 ملفات):**

- html-unified-block, html-block-types, html-block-registry, html-block-generator
- html-block-layout-engine, html-block-data-engine, html-block-tailwind-editor
- html-block-operations, html-block-presets, html-block-tsx-generator

**Canvas Engines (7 ملفات):**

- BlockMapperEngine, CSSParserEngine, HTMLParserEngine, SelectionManager, SyncEngine, StyleExtractor

**Shared Engines (26 محرك):**

- AIEngine, AttributeCompletionEngine, codeEditorEngines, ComponentRegistry, Debouncer
- DiagramEngine, DialogEngine, DoctorSelfHealingEngine, htmlBlockParsers
- IconGeneratorEngine, IconLibraryEngine, ImageStyleEngine, ImageUploaderEngine
- LaTeXEngine, MarkdownEngine, MindMapEngine, NoCodeExecutionEngine
- NotificationEngine, PluginSystem, PresentationNotebookEngine, SmartComponentEngine
- ToolRegistry, ValidationEngine, WebScrapingEngine, WYSIWYGCalloutEngine

**Language System (15 ملف):**

- 4 حزم لغات: C++, Python, TypeScript, Web
- 6 مزوّدين: completion, diagnostics, formatter, hover, runner, symbol
- 5 ملفات أساسية: definition, pack, registry, runtime, index

**lib-core (80+ ملف):**

- animation/: motion-morph-engine, motion-path-engine, motion-path-tooling-engine
- archive/: zip-engine (بدون مكتبات خارجية)
- charts/: zero-dependency-chart-engine
- code-interpreter/: code-editor-module, code-sandbox-runner, css-generator-engine, live-interpreter-engine, regex-tester-engine
- collaboration/: peer-awareness-engine
- computational-notebook/: ScratchpadEngine, Parser, Graph, Bindings, Store, unit-calc-engine, types (10 ملفات)
- converters/: cad-vector-engine, document-markup-engine, image-format-engine, obsidian-vault-import-engine, odf-engine, schema-data-engine, universal-export-hub, web-components-engine
- document-pipeline/: 15 ملف (block-model, clip, comments, assets, dynamic-fields, find-replace, history-diff, HTML-sanitizer, LaTeX-tokenizer, layer-compositor, markdown-caret, plan-apply, schema-fields, smart-clipboard, tag-aware)
- events/: 7 ملف (comments-anchoring, dockable-tab, drag-selection, mouse-interaction, sub-editor-orchestrator, universal-context-menu, viewport-pan-zoom)
- geometry/: 8 ملف (bezier, bounding-box, connector-rerouting, coordinate-transformer, line-connector, smart-shapes, snap-align)
- grid-engine/: 9 ملف (A1-notation, cell-formula, format, formula-evaluator, grid-core, linked-chart, runtime-safety, selection-model, types)
- latex/: 6 ملف (Engine, Parser, Renderer, Symbols, Types, UI)
- raster/: 10 ملف (background-removal, brush, color-combine, color-curves, dithering, image-filters, image-processing, layer-blend, morphology, vector-tracer)

**Primitives/Utils (20 ملف):**

- Disposable, LocalizedString, Result, Scheduler, SystemTypes
- 16 React hooks, 5 utils, vector-engine (7 ملفات)

**Shell (35 ملف):**

- dev-studio/: adapters (5), bridge, checkpoint (2), core (3), doctor (6), pipeline, scaffolder, scratchpad, sync (2), tree (6), workbench + panels (4)

**Features (60+ ملف):**

- canvas-designer/: core (16 SVG), hooks (3), data, sub-editors (2), components (22 TSX)
- rich-text/: core/NativeEditor, services (4), hooks (2), model, types, plugin
- ui-designer/: hooks (3), model
- pdf/: hooks (3), model
- html-component/: model

#### المرحلة الثانية: استيراد المعدل 5 (30 ملف — 4,950 سطر)

**توثيق محدث:**

- JOURNAL.md — تسجيل جلسة SharedContextMenu وتكامل السمات
- INDEX.md — قسم المكونات والخطافات المشتركة
- CHANGELOG.md — الإصدار v1.2.0

**ملفات جديدة:**

- BLOCK_REGISTRY.json — سجل البلوكات
- DIAGNOSTICS_REPORT.json — تقرير التشخيصات

**سمات تفاعلية (Traits — 7 ملفات):**

- draggable.ts, resizable.ts, styleable.ts, lockable.ts
- types.ts (TraitKey), index.ts, trait-context-menu-resolver.ts

**نواة محسّنة:**

- capability-registry.ts — FNV-1a hash + حماية التكرار
- block-manifest.ts, AudioBlock.ts, blocks/types.ts
- plugins/index.ts

**تخزين:**

- IndexedDBDocumentStorage.ts, LocalForageDocumentStorage.ts (localStorage stub)

**إضافات واجهة:**

- CanvasDesignerPlugin.tsx, HTMLComponentPlugin.tsx, PdfPlugin.tsx
- RichTextEditor.tsx, UIDesignerPlugin.tsx

**مكونات مشتركة:**

- SharedContextMenu.tsx — ثيم فاتح نقي 100%، تفاعل ماوسي حصراً

**هيكل تشغيل:**

- Workbench.tsx, main.tsx

**اختبارات جديدة:**

- AudioBlock.test.ts, traits.test.ts, trait-context-menu-resolver.test.ts

### 🔧 المشاكل المحلولة

1. **مسارات استيراد خاطئة:** تصحيح مسارات `../../shared/` إلى `../../../shared/` في ملفات core/src/
2. **憭/react type stub:** إنشاء `stubs/react.d.ts` لدعم ملفات UI Features
3. **lucide-react:** إزالة تبعية خارجية من unifiedTools.ts واستبدالها بأيقونات نصية
4. **localforage:** استبدال بـ localStorage stub للحفاظ على صفر اعتماديات
5. **TraitKey:** إضافة نوع `TraitKey` إلى types.ts لدعم trait-context-menu-resolver
6. **noUncheckedIndexedAccess:** تصحيح `existingList[0]?.id` في capability-registry

### 📊 الإحصائيات النهائية

| المؤشر                      | القيمة  |
| --------------------------- | ------- |
| ملفات الاختبار              | 74 ملف  |
| الاختبارات الناجحة          | 1142    |
| أخطاء TypeScript            | 0       |
| الملفات الجديدة (المعدل 4)  | 346 ملف |
| الملفات الجديدة (المadol 5) | 30 ملف  |
| إجمالي الملفات المضافة      | 376 ملف |

### 💡 الدروس المستفادة

1. **磕 luận y Import Paths في Monorepo:** يجب التحقق من مسارات الاستيراد النسبية قبل النسخ — المسار الصحيح من `packages/core/src/commands/` إلى `packages/shared/` هو `../../../shared/` وليس `../../shared/`.
2. **الϐάση Dependencies في Zero-Dependency Core:** أي ملف يستورد مكتبة خارجية (lucide-react, localforage, react) يجب معالجته بـ stub أو حذفها للحفاظ على مبدأ الصفر اعتماديات.
3. **الん็ipping Ahead:** نسخ ثم تصحيح أسرع من إعادة كتابة — لكن يجب تشغيل tsc فوراً بعد كل دفعة نسخ.

---

## 2026-08-23 (Part 4 — تفعيل DevStudio كشريك ذكي)

### 🎯 الهدف

جعل DevStudio الشريك الذكي للمطور — ينفذ المهام الروتينية والتكرارية ويوفر الوقت والجهد.

### 📋 المنجزات

1. **بناء CLI:** `cli/index.ts` — أوامر scan, status, import, init, help
2. **ذاكرة دائمة:** `knowledge/project-memory.ts` — JSON snapshot + sessions + decisions
3. **ماسح مشروع حي:** `knowledge/project-scanner.ts` — fs + git + vitest
4. **كاتب تقارير تلقائي:** `knowledge/auto-reporter.ts` — JOURNAL + CHANGELOG
5. **توثيق شامل:** AGENTS.md + CONTRIBUTING.md + DEVSTUDIO_PLAN.md + INTEGRATION_MAP.md

### 💡 القرار المعماري

> **أي مهمة تتكرر مرتين → DevStudio يتولاها.**
> **المطور يركز على القرارات المعمارية فقط.**

هذا القرار يُوسّع دور DevStudio تدريجياً:

- المرحلة 1 (مكتملة): scan + memory + reporter
- المرحلة 2 (قريب): typecheck/test تلقائي + كشف تضاربات
- المرحلة 3 (قريب): نسخ + تصحيح + تحديث فهارس
- المرحلة 4 (قريب): git تلقائي
- المرحلة 5 (متوسط): ذكاء معماري
- المرحلة 6 (بعيد): MCP + dashboard

---

## 2026-08-23 — يوم الاختبارات الشاملة وحارس القواعد

### المنجزات

#### اختبارات الوحدات السبع غير المفحوصة (7 ملفات اختبار جديدة)

| الملف                                    | الوحدة                          | عدد الاختبارات | المعرف |
| ---------------------------------------- | ------------------------------- | -------------- | ------ |
| `tests/tree/llrb.test.ts`                | LLRB Tree                       | 14             | ALGO   |
| `tests/structure/disjoint-set.test.ts`   | Union-Find                      | 14             | ALGO   |
| `tests/graph/dependency.test.ts`         | كشف الحلقات + الطوبولوجي        | 9              | ALGO   |
| `tests/sort/mergesort.test.ts`           | فرز مدمج مستقر                  | 9              | ALGO   |
| `tests/simulation/simulation.test.ts`    | المحاكاة النقية                 | 10             | ALGO   |
| `tests/lookup/hlookup.test.ts`           | HLOOKUP + binary search          | 14             | ALGO   |
| `tests/streets/streets.test.ts`          | بحث الأسماء + التشابه + الفرز   | 13             | ALGO   |

**النتيجة:** من 1273 اختبار → 1392 اختبار (88 ملف اختبار)، جميعها ناجحة.

#### المرحلة 5 — Rule Guardian (حارس القواعد)

بناء نظام فحص ورفض تلقائي للتعديلات التي تكسر القواعد الصارمة في AGENTS.md:

| الملف                                      | الوصف                                           | المعرف         |
| ------------------------------------------ | ----------------------------------------------- | -------------- |
| `dev-studio/pipeline/RuleGuardian.ts`      | محرك القواعد التوضيحي مع 7 قواعد               | PLUG-RULE-GUARDIAN |
| `dev-studio/cli/RuleGuardianCommands.ts`   | أوامر CLI: `devstudio guard [files..]`          | PLUG-RULE-GUARDIAN |
| `tests/rule-guardian.test.ts`              | 23 اختبار شامل لكل قاعدة                       | TEST           |

**القواعد السبع المُ FINED:**

| المعرف | القاعدة                           | الخطورة  |
| ------ | --------------------------------- | -------- |
| R-001  | الترويسة الثنائية الإلزامية       | error    |
| R-002  | ممنوع ألوان الثيم الداكن          | error    |
| R-003  | ممنوع اعتماديات خارجية في النواة | error    |
| R-004  | ممنوع أسرار/مفاتيح في الكود      | error    |
| R-005  | تجنب `as any`                     | warning  |
| R-006  | دوال ≤ 50 سطر                    | warning  |
| R-007  | الثيم الفاتح النقي حصراً          | error    |

#### إصلاحات حرجة سابقة (نفس اليوم)

- إصلاح `pnpm-workspace.yaml` — تسجيل 7 حزم workspace
- حذف `UiPreferencesService.ts` المكرر + تصحيح الاستيراد
- إصلاح اصطدام `scanProject` في CLI (renamed → `scanProjectDebt`)
- إضافة `packageManager: "pnpm@11.18.0"` لـ `package.json`
- إصلاح 22 انتهاك ثيم داكن (Workbench, DevStudio, ComponentRegistry, HTMLComponentPlugin)
- إصلاح 16 خطأ lint (Function type → specific, {} → Record, let → const)
- إنشاء `vite.config.ts` لـ `@libretext/algorithms` (lib mode, ESM)
- تنسيق 440 ملف عبر `pnpm format`
- **البناء:** 7/7 حزم ناجحة (12.8s)
- **Lint:** 0 أخطاء، 851 تحذير (no-console في السكربتات فقط)

### الإحصائيات النهائية لل يوم

| المقياس                     | القيمة     |
| --------------------------- | ---------- |
| ملفات الاختبار              | 89 ملف     |
| إجمالي الاختبارات           | 1415 اختبار|
| اختبارات Rule Guardian      | 23 اختبار  |
| قواعد Rule Guardian         | 7 قواعد    |
| بناء الحزم                  | 7/7 ناجح   |
| أخطاء lint                  | 0          |
| تحذيرات lint                | 851        |
| Git commits اليوم            | 3          |
| Git push                     | 3          |

---

## 2026-08-23 (المجلد الثاني) — تطعيم DevStudio بنموذج Nawat Kernel

### المرجع: nawat-kernel

تم قراءة المرجع `/home/sam2/projects/الجديد/open-editor/references/nawat-kernel` واستخراج الأنماط المعمارية:

| النمط                        | الوصف                                           |
| ---------------------------- | ----------------------------------------------- |
| Tool Registry                | تسجيل أدوات بفئات + مستويات مخاطر               |
| Command Registry             | سجل أوامر مركزي مع سجل تنفيذ                    |
| Kernel Modes                 | 7 أوضاع (planning → execution → review)         |
| Session Memory + Compression | ذاكرة جلسة مع ضغط تلقائي فوق 4000 توكن        |
| Event Bus                    | ناقل أحداث مكتوب for decoupling                 |

### الطور 1: بناء النواة الأساسية

| الملف                                      | الوصف                                           | المعرف         |
| ------------------------------------------ | ----------------------------------------------- | -------------- |
| `dev-studio/core/DevStudioModes.ts`        | 7 أوضاع مع صلاحيات القراءة/الكتابة              | PLUG-MODES     |
| `dev-studio/core/DevStudioToolRegistry.ts` | سجل أدوات + فئات + تنفيذ                        | PLUG-TOOL-REG  |
| `dev-studio/core/DevStudioCommandRegistry.ts` | سجل أوامر + سجل تنفيذ                        | PLUG-CMD-REG   |
| `tests/devstudio-kernel.test.ts`           | 15 اختبار                                      | TEST           |

### الطور 2: ذاكرة الجلسة + ناقل الأحداث

| الملف                                      | الوصف                                           | المعرف         |
| ------------------------------------------ | ----------------------------------------------- | -------------- |
| `dev-studio/core/DevStudioEventBus.ts`     | 8 أحداث مكتوبة + عدّ listeners/emits            | PLUG-EVENT-BUS |
| `dev-studio/core/DevStudioSessionMemory.ts` | ذاكرة جلسة + ضغط تلقائي فوق 4000 توكن          | PLUG-SESSION   |
| `tests/devstudio-session.test.ts`          | 12 اختبار                                      | TEST           |

### الطور 3: محرك الإصلاح التلقائي

| الملف                                      | الوصف                                           | المعرف         |
| ------------------------------------------ | ----------------------------------------------- | -------------- |
| `dev-studio/pipeline/AutoFixEngine.ts`     | fixHeaders + fixLintIssues + getFixableCount     | PLUG-AUTO-FIX  |
| `dev-studio/cli/FixCommand.ts`             | أمر CLI: `devstudio fix [headers|lint|all]`      | PLUG-FIX-CMD   |
| `tests/auto-fix-engine.test.ts`            | 5 اختبارات مع fs مؤقت                          | TEST           |

### الإحصائيات النهائية

| المقياس                     | القيمة     |
| --------------------------- | ---------- |
| ملفات الاختبار              | 92 ملف     |
| إجمالي الاختبارات           | 1447 اختبار|
| أوامر DevStudio             | 11 أمر     |
| مكونات النواة               | 8 ملفات    |
| Git commits (إجمالي اليوم)  | 6          |
