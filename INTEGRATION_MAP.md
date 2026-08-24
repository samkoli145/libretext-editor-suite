/**

- ═══════════════════════════════════════════════════════════════════════════
- 📌 ملخص توجيهي | Guiding Summary
- ═══════════════════════════════════════════════════════════════════════════
- 📄 الملف: INTEGRATION_MAP.md
- 📂 المسار: INTEGRATION_MAP.md
- 🎯 الهدف الرئيسي: خريطة ارتباطات الحزم والمكونات في مشروع LibreText
- 📋 المعايير: توثيق شامل للاعتمادات بين الحزم وتدفق البيانات
- 🏷️ المعرف: DOC-ADMIN-10
- 📅 تاريخ الإنشاء: 2026-08-19
- ═══════════════════════════════════════════════════════════════════════════
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- ═══════════════════════════════════════════════════════════════════════════
  */

# 🗺️ خريطة ارتباطات الحزم | Package Integration Map

---

## 1. نظرة عامة على الحزم

```
┌─────────────────────────────────────────────────────────────────┐
│                    المستخدمون النهائيون                          │
│              (React / Vue / Web Component / Vanilla)             │
└──────────────┬──────────────────────┬───────────────────────────┘
               │                      │
    ┌──────────▼──────────┐  ┌───────▼────────────┐
    │   @libretext/core   │  │ @libretext/plugins  │
    │   النواة المجردة     │  │  الإضافات الرسمية   │
    │   55 ملف مصدراً      │  │  10 ملفات           │
    └──────────┬──────────┘  └───────┬────────────┘
               │                      │
    ┌──────────▼──────────┐  ┌───────▼────────────┐
    │@libretext/algorithms│  │ @libretext/storage  │
    │الخوارزميات والأوامر  │  │  طبقة التخزين       │
    │ 90 ملفاً            │  │  8 ملفات            │
    └──────────┬──────────┘  └───────┬────────────┘
               │                      │
    ┌──────────▼──────────┐  ┌───────▼────────────┐
    │@libretext/serializers│ │@libretext/templates │
    │  المحولات والتصدير   │  │  نظام القوالب       │
    │  15 ملفاً           │  │  10 ملفات           │
    └─────────────────────┘  └────────────────────┘
```

---

## 2. جدول الارتباطات التفصيلي

| الحزمة                     | المسار                  | المستهلك                 | الوظيفة الرئيسية                                                                                                       |
| -------------------------- | ----------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **@libretext/core**        | `packages/core/`        | جميع الحزم الأخرى        | النواة المجردة: تعريفات AST، إدارة الحالة، العمليات، الفهرسة، محركات التفاعل بالماوس، القوائم السياقية، التحديد، السحب |
| **@libretext/algorithms**  | `packages/algorithms/`  | core, storage, templates | نمط الأوامر، محلل الصيغ الحسابية، الترجمة المكانية، خوارزميات المتجهات، الجداول، الرسوم البيانية، البحث والاستبدال     |
| **@libretext/storage**     | `packages/storage/`     | core, algorithms         | تخزين في الذاكرة، مخزن محلي (localStorage)، IndexedDB، لقطات التراجع/الإعادة                                           |
| **@libretext/templates**   | `packages/templates/`   | storage, adapters        | سجل القوالب للمحررات الأربعة: مستندات (Writer)، جداول (Calc)، عروض (Impress)، قواعد بيانات (Base)                      |
| **@libretext/serializers** | `packages/serializers/` | playground, adapters     | محولات التصدير: Markdown، HTML، TXT، PDF، LaTeX، ODF، DOCX، SVG، ZIP                                                   |
| **@libretext/plugins**     | `packages/plugins/`     | playground, adapters     | إضافات Mermaid للمخططات، Math للرياضيات، CanvasDesigner لتصميم الكانفا، VectorEditor للمتجهات                          |
| **@libretext/adapters**    | `packages/adapters/`    | المستخدمون النهائيون     | طبقات تكيف: React، Vue، Web Component، Vanilla JS + محرر المواقع المشترك                                               |

---

## 3. تدفق البيانات بين الحزم

### 3.1 المسار الأساسي: النواة → التخزين

```
EditorState (core) ──→ Snapshots (storage) ──→ IndexedDB / localStorage
     │                                               │
     └──────→ Undo/Redo Engine (core) ←───────────────┘
```

### 3.2 مسار الأوامر: النواة → الخوارزميات

```
User Action (adapters) ──→ SpatialCommand (algorithms) ──→ EditorState (core)
                                │
                                ├──→ GridCoordinate (Calc/Base)
                                ├──→ LogicalCoordinate (Impress)
                                └──→ CharacterPosition (Writer)
```

### 3.3 مسار التصدير: النواة → المحولات

```
EditorState (core) ──→ AST (core) ──→ Serializer (serializers)
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                      Markdown          HTML            PDF/LaTeX
```

### 3.4 مسار القوالب: التخزين → القوالب → المحولات

```
TemplateRegistry (templates) ──→ EditorState (core) ──→ Serializer (serializers)
        │
        ├──→ Writer Templates ( Writer domain)
        ├──→ Calc Templates   (Calc domain)
        ├──→ Impress Templates (Impress domain)
        └──→ Base Templates   (Base domain)
```

---

## 4. الاعتمادات بين الحزم

| الحزمة                   | تعتمد على                            |
| ------------------------ | ------------------------------------ |
| `@libretext/core`        | لا تعتمد على أي حزمة (صفر اعتماديات) |
| `@libretext/algorithms`  | `@libretext/core`                    |
| `@libretext/storage`     | `@libretext/core`                    |
| `@libretext/templates`   | `@libretext/core`                    |
| `@libretext/serializers` | `@libretext/core`                    |
| `@libretext/plugins`     | `@libretext/core`                    |
| `@libretext/adapters`    | `@libretext/core`                    |

---

## 5. محركات القوائم السياقية (Context Menu System)

### 5.1 الملفات الأساسية

| الملف                                  | المعرف       | الوظيفة                                                                          |
| -------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| `contextMenuEngine.ts`                 | CORE-012     | محرك القوائم السياقية الرئيسي مع التسجيل الديناميكي والتنفيذ                     |
| `engines/context-menu-engine.ts`       | CORE-ENG-005 | محرك بسيط لتحليل الأهداف وanzeigen القوائم                                       |
| `engines/context-menu-interactions.ts` | CORE-ENG-022 | طبقة التفاعل: إغلاق عند التمرير، تتبع التحريك، نقل لوحة المفاتيح، أيقونات دلالية |
| `engines/context-menu-css.ts`          | CORE-ENG-023 | أنماط CSS: @keyframes للحركة، رموز الثيم الفاتح، مولّد CSS                       |

### 5.2 الأيقونات الدلالية (47 أيقونة)

- **التحرير:** قص، نسخ، لصق، حذف، تكرار، تحديد الكل
- **التنسيق:** عريض، مائل، تسطير، ت스트رايك، محاذاة
- **الإدراج:** جدول، صورة، رابط، كود، رياضيات، تعليق، شكل
- **الترتيب:** إلى الأمام، إلى الخلف، تجميع، فك تجميع
- **التصدير:** PDF، HTML، Markdown، LaTeX
- **الanieات:** تكبير، تصغير، ملء الشاشة، إعدادات، طباعة

### 5.3 الحركة والثيم

- `@keyframes menuEnter`: تكبير من 0.95 إلى 1 + تلاشي من 0 إلى 1
- `cubic-bezier(0.16, 1, 0.3, 1)`: دخول سريع وخروج سلس
- ثيم فاتح نقي فقط: `#FFFFFF` للخلفية، `#E2E8F0` للحدود، `#0F172A` للنصوص

---

## 6. بيئة التطوير المتكاملة (DevStudio) — 6,711 سطر

### 6.1 الرؤية

**DevStudio** هي أوركسترا مركزي لإدارة دورة حياة التعديلات على المشروع — لا يُسمح بتعديل مباشر دون فحص مسبق، ولقطة احتياطية، وبوابة أمان.

### 6.2 دورة حياة المهمة

```
┌──────────┐     ┌──────────────┐     ┌────────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│ Created  │────▶│  Validating  │────▶│Checkpointed│────▶│Executing │────▶│  Testing  │────▶│ Committed│
└──────────┘     │  (DoctorGate)│     │ (Snapshot) │     │ (Patch)  │     │(DoctorGate│     └──────────┘
                 └──────┬───────┘     └──────┬─────┘     └────┬─────┘     └─────┬─────┘
                        │ فشل                 │ خطأ            │ خطأ             │ فشل
                        ▼                     ▼                ▼                 ▼
                   ┌─────────┐          ┌───────────┐    ┌───────────┐    ┌─────────┐
                   │ Rejected│          │ Rollback  │    │ Rollback  │    │ Rollback│
                   └─────────┘          └───────────┘    └───────────┘    └─────────┘
```

### 6.3 المكونات التفصيلية

| المكون                                  | الملفات | الأسطر | الدور                                        |
| --------------------------------------- | ------- | ------ | -------------------------------------------- |
| **DevStudioEngine**                     | 3       | 576    | الأوركسترا المركزي — ينسق دورة حياة المهمة   |
| **DoctorEngine**                        | 6       | 1,140  | بوابة الفحص — 6 فاحصات قبل أي تعديل          |
| **SnapshotEngine + RollbackManager**    | 2       | 499    | لقطة + تراجع — حماية Byte-Identical          |
| **TaskPipeline**                        | 1       | 430    | خط أنابيب المراحل المتعددة                   |
| **AutoVerifier**                        | 1       | 150    | فحص شامل + طفرات tsc/vitest/lint             |
| **DebtGuardian**                        | 1       | 180    | كشف الديون الضارة (8 أنماط regex)             |
| **RuleGuardian**                        | 1       | 260    | حماية القواعد الصارمة (7 قواعد، ح خطورة)     |
| **Tree (Model + View + Navigation)**    | 6       | 2,115  | شجرة المشروع + كشف الانحراف + عمليات الملفات |
| **Sync (CodeGenerator + RegistrySync)** | 2       | 784    | توليد كود + مزامنة السجلات                   |
| **ToolScaffolder**                      | 1       | 235    | توليد هيكل ملفات جديد                        |
| **Workbench + Panels**                  | 6       | 672    | واجهة سطح العمل + 4 لوحات                    |
| **Adapters (5)**                        | 5       | 690    | مكيّفات: Canvas, Editor, PDF, RichText, UI   |
| **EditorBridge**                        | 1       | 305    | جسر الربط بين المحرر والاستوديو              |
| **CLI**                                 | 3       | 320    | أوامر: scan/status/verify/commit-ready/debt/guard |

### 6.4 الفاحصات الستة (Doctor Gate)

| الفاحص                 | الملف                          | ماذا يتحقق                                  |
| ---------------------- | ------------------------------ | ------------------------------------------- |
| **DependencyAuditor**  | `doctor/DependencyAuditor.ts`  | صحة الاعتماديات وتجنب الدورات               |
| **GeometryValidator**  | `doctor/GeometryValidator.ts`  | صحة الإحداثيات والحدود المكانية             |
| **IdIntegrityChecker** | `doctor/IdIntegrityChecker.ts` | عدم تكرار المعرفات وسلامتها                 |
| **StructureValidator** | `doctor/StructureValidator.ts` | سلامة هيكل المجلدات والملفات                |
| **ThemeValidator**     | `doctor/ThemeValidator.ts`     | حماية الثيم الفاتح النقي (منع أي لون داكن)  |
| **DoctorEngine**       | `doctor/DoctorEngine.ts`       | منسّق الفاحصات — يجمع النتائج ويصدر verdict |

### 6.5 القواعد الأربعة (The Four Rules Contract)

1. **EVERY EDIT IS A PATCH:** كل تعديل يحمل معكوسه الصارم (`inverse`) — تراجع Byte-Identical
2. **ADDITIVE FIELDS:** غياب الحقل = "لا" — منع `error: null`
3. **DERIVED STATE IS NEVER STORED:** الإحصاءات تُشتق لحظياً فقط
4. **VIEW STATE ≠ DOCUMENT STATE:** حالة الواجهة مستقلة عن حالة الوثيقة

### 6.6 مسار التكامل مع باقي الحزم

```
packages/shell/dev-studio/
        │
        ├── imports from ──▶ @libretext/core (AST, State, Operations)
        ├── imports from ──▶ @libretext/algorithms (Commands, Validation)
        ├── imports from ──▶ @libretext/storage (Snapshots, IndexedDB)
        │
        ├── consumed by ──▶ packages/app/ (DocumentEditorHost, Workbench)
        ├── consumed by ──▶ packages/features/* (all plugin UIs)
        └── consumed by ──▶ packages/components/ (SettingsPanel, Canvas)
```

---

## 7. إحصائيات المشروع الحالية

| المؤشر                    | القيمة                  |
| ------------------------- | ----------------------- |
| إجمالي الملفات المصدراً   | 563 ملف TypeScript      |
| ملفات الاختبار            | 92 ملف                  |
| الاختبارات الناجحة        | 1447 اختبار             |
| أخطاء TypeScript          | 0                       |
| أخطاء lint                | 0                       |
| حزم Monorepo              | 18 حزمة                 |
| محركات التفاعل            | 28 محركاً               |
| محركات DevStudio          | 13 مكون (CLI + Guard)   |
| قواعد Rule Guardian       | 7 قواعد                 |
| **البلوكات**              | **25 بلوك + 1 سجل**    |
| الأيقونات الدلالية        | 47 أيقونة               |
| الملفات الجذرية التوثيقية | 20 ملف                  |

---

## 8. البلوكات — Block System

### 8.1 البنية الأساسية

```
BaseBlockNode<TData>  ← النوع الجذر لجميع البلوكات
├── id: string
├── type: string
├── domain: 'writer' | 'calc' | 'impress' | 'base' | 'universal'
├── data: TData (generic)
├── traits: ('draggable' | 'resizable' | 'styleable' | 'lockable')[]
└── locked?: boolean
```

### 8.2 جدول البلوكات

| # | البلوك | الملف | Domain | الأسطر | الوظائف |
|---|--------|-------|--------|--------|---------|
| 1 | paragraph | `paragraph-block.ts` | writer | 104 | create, is, formatMarkdown |
| 2 | heading | `heading-block.ts` | writer | 106 | create, is, formatMarkdown |
| 3 | table | `table-block.ts` | universal | 147 | createCell, createRow, create, is, formatMarkdown |
| 4 | image | `image-block.ts` | universal | 111 | create, is, formatMarkdown, formatHtml |
| 5 | list | `list-block.ts` | writer | 121 | create, createItem, is, formatMarkdown |
| 6 | code | `code-block.ts` | writer | 92 | create, is, formatMarkdown |
| 7 | horizontal-rule | `horizontal-rule-block.ts` | writer | 89 | create, is, formatMarkdown |
| 8 | blockquote | `blockquote-block.ts` | writer | 92 | create, is, formatMarkdown |
| 9 | cell | `cell-block.ts` | calc | 124 | create, is, formatCellValue |
| 10 | shape | `shape-block.ts` | impress | 110 | create, is, getShapePresetPath |
| 11 | slide | `slide-block.ts` | impress | 95 | create, is, formatSlideSummary |
| 12 | database-record | `database-record-block.ts` | base | 117 | createField, create, is, formatRecordCardText |
| 13 | embed | `embed-block.ts` | universal | 91 | create, is, formatMarkdown |
| 14 | pdf | `pdf-block.ts` | universal | 238 | create, is, formatMarkdown, annotate, stamp |
| 15 | color-picker | `color-picker-block.ts` | universal | 62 | create, is, formatMarkdown, formatHtml |
| 16 | icon-picker | `icon-picker-block.ts` | universal | 62 | create, is, formatMarkdown, formatHtml |
| 17 | font-picker | `font-picker-block.ts` | universal | 60 | create, is, formatMarkdown, formatHtml |
| 18 | text-styler | `text-styler-block.ts` | universal | 60 | create, is, formatMarkdown, formatHtml |
| 19 | bg-color | `bg-color-block.ts` | universal | 55 | create, is, formatMarkdown, formatHtml |
| 20 | bg-image | `bg-image-block.ts` | universal | 63 | create, is, formatMarkdown, formatHtml |
| 21 | gradient | `gradient-block.ts` | universal | 75 | create, is, formatMarkdown, formatHtml |
| 22 | template-card | `template-card-block.ts` | universal | 64 | create, is, formatMarkdown, formatHtml |
| 23 | template-gallery | `template-gallery-block.ts` | universal | 75 | create, is, formatMarkdown, formatHtml |
| 24 | block-registry | `block-registry.ts` | — | 638 | getBlockManifest, createDefault, serializeToMarkdown |

### 8.3 النمط المعماري لكل بلوك

```typescript
// 1. الواجهة (Interface)
export interface XBlockData { readonly ... }
export interface XBlockNode extends BaseBlockNode<XBlockData> {
  readonly type: 'x';
  readonly domain: DomainType;
}

// 2. دالة الإنشاء (Factory)
export function createXBlock(id: string, ...): XBlockNode { ... }

// 3. فاحص النوع (Type Guard)
export function isXBlock(node: unknown): node is XBlockNode { ... }

// 4. دوال التصدير (Serializer)
export function formatXMarkdown(node: XBlockNode): string { ... }
export function formatXHtml(node: XBlockNode): string { ... }
```

### 8.4 البلوكات المؤرشفة (قديمة但仍可 الرجوع)

| الملف الأصلي                 | السبب                                  |
| ---------------------------- | -------------------------------------- |
| `AudioBlock.ts`              | تم استبداله بـ `embed-block.ts`       |
| `audio-block-block.ts`       | مكرر مع AudioBlock.ts                 |
| `code-editor.ts`             | تم استبداله بـ `code-block.ts`        |
| `html-block-*.ts` (10 ملفات) | تم استبدالها بـ `block-registry.ts`   |
| `html-unified-block.ts`      | تم دمجها في البلوكات الجديدة         |

---

_تم تحديث هذه الخريطة في 2026-08-23 — إضافة Rule Guardian + تحديث الإحصائيات._
