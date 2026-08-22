/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: INTEGRATION_MAP.md
 * 📂 المسار: INTEGRATION_MAP.md
 * 🎯 الهدف الرئيسي: خريطة ارتباطات الحزم والمكونات في مشروع LibreText
 * 📋 المعايير: توثيق شامل للاعتمادات بين الحزم وتدفق البيانات
 * 🏷️ المعرف: DOC-ADMIN-10
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
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

| الحزمة | المسار | المستهلك | الوظيفة الرئيسية |
|--------|--------|----------|-----------------|
| **@libretext/core** | `packages/core/` | جميع الحزم الأخرى | النواة المجردة: تعريفات AST، إدارة الحالة، العمليات، الفهرسة، محركات التفاعل بالماوس، القوائم السياقية، التحديد، السحب |
| **@libretext/algorithms** | `packages/algorithms/` | core, storage, templates | نمط الأوامر، محلل الصيغ الحسابية، الترجمة المكانية، خوارزميات المتجهات، الجداول، الرسوم البيانية، البحث والاستبدال |
| **@libretext/storage** | `packages/storage/` | core, algorithms | تخزين في الذاكرة، مخزن محلي (localStorage)، IndexedDB، لقطات التراجع/الإعادة |
| **@libretext/templates** | `packages/templates/` | storage, adapters | سجل القوالب للمحررات الأربعة: مستندات (Writer)، جداول (Calc)، عروض (Impress)، قواعد بيانات (Base) |
| **@libretext/serializers** | `packages/serializers/` | playground, adapters | محولات التصدير: Markdown، HTML، TXT، PDF، LaTeX، ODF، DOCX، SVG، ZIP |
| **@libretext/plugins** | `packages/plugins/` | playground, adapters | إضافات Mermaid للمخططات، Math للرياضيات، CanvasDesigner لتصميم الكانفا، VectorEditor للمتجهات |
| **@libretext/adapters** | `packages/adapters/` | المستخدمون النهائيون | طبقات تكيف: React، Vue، Web Component، Vanilla JS + محرر المواقع المشترك |

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

| الحزمة | تعتمد على |
|--------|----------|
| `@libretext/core` | لا تعتمد على أي حزمة (صفر اعتماديات) |
| `@libretext/algorithms` | `@libretext/core` |
| `@libretext/storage` | `@libretext/core` |
| `@libretext/templates` | `@libretext/core` |
| `@libretext/serializers` | `@libretext/core` |
| `@libretext/plugins` | `@libretext/core` |
| `@libretext/adapters` | `@libretext/core` |

---

## 5. محركات القوائم السياقية (Context Menu System)

### 5.1 الملفات الأساسية
| الملف | المعرف | الوظيفة |
|-------|--------|---------|
| `contextMenuEngine.ts` | CORE-012 | محرك القوائم السياقية الرئيسي مع التسجيل الديناميكي والتنفيذ |
| `engines/context-menu-engine.ts` | CORE-ENG-005 | محرك بسيط لتحليل الأهداف وanzeigen القوائم |
| `engines/context-menu-interactions.ts` | CORE-ENG-022 | طبقة التفاعل: إغلاق عند التمرير، تتبع التحريك، نقل لوحة المفاتيح، أيقونات دلالية |
| `engines/context-menu-css.ts` | CORE-ENG-023 | أنماط CSS: @keyframes للحركة، رموز الثيم الفاتح، مولّد CSS |

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

## 6. إحصائيات المشروع الحالية

| المؤشر | القيمة |
|--------|--------|
| إجمالي الملفات المصدراً | 274 ملف TypeScript |
| ملفات الاختبار | 71 ملف |
| الاختبارات الناجحة | 1122 اختبار |
| أخطاء TypeScript | 0 |
| حزم Monorepo | 7 حزم |
| محركات التفاعل | 28 محركاً |
| الأيقونات الدلالية | 47 أيقونة |
| الملفات الجذرية التوثيقية | 20 ملف |

---

*تم تحديث هذه الخريطة في 2026-08-22 لتعكس البنية الحالية للمشروع بعد تكامل تحسينات القوائم السياقية.*
