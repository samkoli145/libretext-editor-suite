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
| **Tree (Model + View + Navigation)**    | 6       | 2,115  | شجرة المشروع + كشف الانحراف + عمليات الملفات |
| **Sync (CodeGenerator + RegistrySync)** | 2       | 784    | توليد كود + مزامنة السجلات                   |
| **ToolScaffolder**                      | 1       | 235    | توليد هيكل ملفات جديد                        |
| **Workbench + Panels**                  | 6       | 672    | واجهة سطح العمل + 4 لوحات                    |
| **Adapters (5)**                        | 5       | 690    | مكيّفات: Canvas, Editor, PDF, RichText, UI   |
| **EditorBridge**                        | 1       | 305    | جسر الربط بين المحرر والاستوديو              |

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

| المؤشر                    | القيمة                |
| ------------------------- | --------------------- |
| إجمالي الملفات المصدراً   | 538 ملف TypeScript    |
| ملفات الاختبار            | 74 ملف                |
| الاختبارات الناجحة        | 1142 اختبار           |
| أخطاء TypeScript          | 0                     |
| حزم Monorepo              | 18 حزمة               |
| محركات التفاعل            | 28 محركاً             |
| محركات DevStudio          | 10 مكونات (6,711 سطر) |
| الأيقونات الدلالية        | 47 أيقونة             |
| الملفات الجذرية التوثيقية | 20 ملف                |

---

_تم تحديث هذه الخريطة في 2026-08-23 لتعكس بنية DevStudio الكاملة بعد تكامل المعدل 4 و 5._
