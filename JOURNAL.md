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
- ** kotob  scripts**
  - `EDITOR_INVENTORY.md` — جرد المكونات (Writer 9, Calc 2, Impress 8, Base 2)
  - `EXECUTION_QUEUE.md` — قائمة التنفيذ المرقمة Q-001..Q-024
  - `ATOMIC_INVENTORY.md` — الجرد الذري (160 ملف: 144 نشط, 4 مكرر, 3 غير مستخدم, 9 كبير)
  - `ATOMIC_INVENTORY.json` — بيانات الجرد الذري

### نتائج التحليل الذري (Atomic Inventory)

| الفئة | العدد | ملاحظات |
|-------|-------|---------|
| إجمالي الملفات | 160 | |
| نشط | 144 | ✅ |
| مكرر | 4 | 2 أزواج متطابقة (parsers) |
| غير مستخدم | 3 | `document-validator.ts`, `odf-package.ts`, `calc-templates.ts` |
| كبير (>400 سطر) | 9 | `functions-matrix.ts` (847) هو الأكبر |

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

| المؤشر | القيمة |
|--------|--------|
| إجمالي المهام | 31 |
| مكتملة | 30 (97%) |
| مُؤجّلة | 1 (الملعب التجريبي) |
| ملفات المحركات | 30+ محرك |
| ملفات الاختبار | 66 ملف |
| الاختبارات الناجحة | 963 |
| الرموز المفهرسة | 1134 |

### التزامات Git

- `4ba4b2f` — تكامل محركات النسخة الاحتياطية + خوارزميات مكانية
- `f2c9e0e` — المستوى 2: سحب + تحديد + تراجع + أوامر
- `99de8af` — المستوى 3: تسنين + إرشاد + RTL + حواف + طبقات
- `a6c17dd` — المستوى 4: تسنين متعدد + مقابض + تحديد + بلوكات
- `392c310` — المستوى 5: رسومات + سجل + تجميع + تعليقات
- `5e317b0` — التوثيق: CHANGELOG + FUNCTION_INDEX
- `da2fc51` — اختبارات: 20 ملف + 107 اختبار جديد
