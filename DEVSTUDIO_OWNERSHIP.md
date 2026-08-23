/**

- ═══════════════════════════════════════════════════════════════════════════
- 📌 ملخص توجيهي | Guiding Summary
- ═══════════════════════════════════════════════════════════════════════════
- 📄 الملف: DEVSTUDIO_OWNERSHIP.md
- 🎯 الهدف: خريطة المسؤوليات الوحيدة — من يملك ماذا في DevStudio
- 🏛️ الدور: المرجع الوحيد لتحديد نطاق كل أداة وتجنب التضارب
- 🏷️ المعرف: DOC-ADMIN-16
- 📅 تاريخ الإنشاء: 2026-08-23
- ═══════════════════════════════════════════════════════════════════════════
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- ═══════════════════════════════════════════════════════════════════════════
  */

# خريطة المسؤوليات | Ownership Map

## القاعدة

> **أي مسؤولية في القائمة أدناه لها مالك واحد فقط.**
> **لا ت존د مسؤولية بدون مالك.**
> **لا يجوز لماليكين تنفيذ نفس المهمة بطريقتين مختلفتين.**

---

## 1. الماسحات والأدوات المستقلة (scripts/)

| الأداة                        | المالك                 | النطاق                                  | المُستبعد               |
| ----------------------------- | ---------------------- | --------------------------------------- | ----------------------- |
| `dev-watcher.ts`              | **Tier 0 watchdog**    | مراقبة فورية — custom rules فقط (regex) | لا يشغّل tsc أو vitest  |
| `audit-block-registration.ts` | **Block auditor**      | فحص تسجيل الكتل vs capabilities-db.json | لا يعدّل الكود          |
| `find-legacy-orphans.ts`      | **Orphan detector**    | كشف الملفات الميتة (dead code)          | لا يحذف — فقط يُبلّغ    |
| `generate-header.ts`          | **Header craftsman**   | توليد ترويسة موحّدة للملفات الجديدة     | لا يحقن في ملفات موجودة |
| `update-indexes.ts`           | **Index syncer**       | تحديث INDEX.md + FUNCTION_INDEX.md      | لا يعدّل محتوى الملفات  |
| `sync-tools.ts`               | **Tool syncer**        | مزامنة الأدوات بين الحزم                | لا يعدّل بنية الحزم     |
| `analyze-blocks-and-tools.ts` | **Block analyzer**     | تحليل خصائص الكتل والأدوات              | لا يعدّل الكود          |
| `atomic-inventory.ts`         | **Inventory counter**  | جرد ذري للملفات (160 ملف)               | لا يعدّل الملفات        |
| `scaffold-block.ts`           | **Block scaffolder**   | توليد هيكل بلوك جديد                    | لا يعدّل ملفات موجودة   |
| `generate-file.ts`            | **File generator**     | توليد ملف من قالب                       | لا يعدّل ملفات موجودة   |
| `generate-block.ts`           | **Block generator**    | توليد بلوك من قالب                      | لا يعدّل ملفات موجودة   |
| `generate-inventory.ts`       | **Inventory reporter** | تقرير الجرد التلقائي                    | لا يعدّل الملفات        |
| `work-monitor.ts`             | **Work monitor**       | مراقبة سير العمل                        | لا يعدّل الكود          |
| `extract-line-numbers.ts`     | **Line counter**       | استخراج أرقام الأسطر                    | لا يعدّل الملفات        |
| `extract-line-numbers-ast.ts` | **AST line counter**   | استخراج أرقام الأسطر عبر AST            | لا يعدّل الملفات        |
| `sync-canonical-tools.ts`     | **Canonical syncer**   | مزامنة الأدوات الأساسية                 | لا يعدّل بنية الحزم     |

---

## 2. DevStudio CLI (`packages/shell/dev-studio/cli/`)

| الأمر               | المالك            | النطاق                              | المُستبعد        |
| ------------------- | ----------------- | ----------------------------------- | ---------------- |
| `devstudio scan`    | **Scanner**       | مسح حي + حفظ لقطة في الذاكرة        | لا يعدّل الكود   |
| `devstudio status`  | **Status viewer** | عرض حالة الذاكرة واللقطات           | لا يعدّل الكود   |
| `devstudio import`  | **Importer**      | استيراد من مجلد خارجي (scan فقط)    | لا ينسخ الملفات  |
| `devstudio init`    | **Initializer**   | تهيئة الذاكرة لأول مرة              | لا يعدّل الملفات |
| `devstudio verify`  | **Verifier**      | فحص tsc + vitest + lint + conflicts | Phase 2          |
| `devstudio audit`   | **Rule guardian** | فحص القواعد الصارمة                 | Phase 5          |
| `devstudio commit`  | **Git helper**    | تحضير commit + انتظار تأكيد         | Phase 4          |
| `devstudio migrate` | **Migrator**      | نسخ + تصحيح مسارات + حقن ترويسة     | Phase 3          |

---

## 3. DevStudio Knowledge (`packages/shell/dev-studio/knowledge/`)

| الوحدة               | المالك           | البيانات                 | التحديث             |
| -------------------- | ---------------- | ------------------------ | ------------------- |
| `project-memory.ts`  | **Memory owner** | `.devstudio-memory.json` | بعد كل scan/session |
| `project-scanner.ts` | **Scan owner**   | إحصائيات حية من fs       | عند استدعاء scan    |
| `auto-reporter.ts`   | **Report owner** | JOURNAL.md, CHANGELOG.md | بعد كل مهمة         |

---

## 4. DevStudio Core Engines (`packages/shell/dev-studio/core/`)

| المحرك               | المالك           | النطاق                     |
| -------------------- | ---------------- | -------------------------- |
| `DevStudioEngine.ts` | **Orchestrator** | تنسيق دورة حياة المهام فقط |
| `DevStudioTypes.ts`  | **Contract**     | الأنواع والعقود — لا تنفيذ |
| `DevStudioEvents.ts` | **Event bus**    | أحداث DevStudio الداخلية   |

---

## 5. DevStudio Subsystems

| النظام            | المالك           | النطاق                         |
| ----------------- | ---------------- | ------------------------------ |
| `DoctorEngine/`   | **Quality gate** | 6 validators — فحص قبل التنفيذ |
| `SnapshotEngine/` | **Checkpoint**   | لقطات + تراجع Byte-Identical   |
| `TaskPipeline/`   | **Pipeline**     | دورة حياة المهام (6 مراحل)     |
| `Tree/`           | **Project tree** | شجرة الملفات + drift detection |
| `Sync/`           | **Code sync**    | توليد كود + مزامنة سجلات       |
| `Scaffolder/`     | **Scaffolder**   | توليد هياكل جديدة              |
| `Workbench/`      | **UI shell**     | سطح العمل + الألواح            |
| `Adapters/`       | **Adapters**     | تكييف المحركات للواجهات        |
| `Bridge/`         | **Bridge**       | جسر EditorBridge               |

---

## 6. المسؤوليات الجديدة (Phases)

| المسؤولية                   | المالك    | المرحلة                                 | النطاق             |
| --------------------------- | --------- | --------------------------------------- | ------------------ |
| **Hidden debt detector**    | Phase 0.5 | Negative controls + تناقضات             | فحص منطقي          |
| **Existing engine tests**   | Phase 1.5 | اختبار TaskPipeline + Snapshot + Doctor | اختبارات حقيقية    |
| **AutoVerifier**            | Phase 2   | tsc + vitest + lint + conflicts         | فحص متدرج          |
| **HeaderGenerator (مكيّف)** | Phase 3   | توليد ترويسة وفق AGENTS.md              | حقن في ملفات جديدة |
| **ArchiveMigrator**         | Phase 3   | نسخ + تصحيح مسارات + حقن ترويسة         | هجرة آمنة          |
| **GitAutomator**            | Phase 4   | رسائل ذكية + حماية main                 | git workflow       |
| **Rule Guardian**           | Phase 5   | قواعد regex/AST فقط                     | حماية القواعد      |

---

## 7. من يفعل ماذا؟ (س، ج)

| السؤال                   | الجواب                                               |
| ------------------------ | ---------------------------------------------------- |
| من يفحص tsc؟             | `devstudio verify` (Phase 2) — ليس dev-watcher       |
| من ينسخ ملفات من أرشيف؟  | `devstudio migrate` (Phase 3) — ليس dev-watcher      |
| من يحدّث INDEX.md؟       | `update-indexes.ts` (scripts/) — ليس CLI             |
| من ي护肤 commit؟         | `devstudio commit` (Phase 4) — مع انتظار تأكيد       |
| من يفحص القواعد الصارمة؟ | `devstudio audit` (Phase 5) — regex/AST فقط          |
| من يحفظ الذاكرة؟         | `project-memory.ts` (knowledge/) — بعد كل scan       |
| من يكشف التضاربات؟       | `devstudio verify` (Phase 2) — conflict detection    |
| من يكشف الملفات الميتة؟  | `find-legacy-orphans.ts` (scripts/) — reporting only |
| من يفحص تسجيل الكتل؟     | `audit-block-registration.ts` (scripts/) — لا يعدّل  |
| من يراقب فورياً؟         | `dev-watcher.ts` (scripts/) — Tier 0 فقط             |

---

## 8. الفصل بين الطبقات

```
scripts/           → أدوات مستقلة (لا تعتمد على DevStudio CLI)
knowledge/         → ذاكرة + ماسح + تقارير (تعتمد على fs)
cli/               → نقطة دخول CLI (تجمع knowledge + engines)
core/              → أوركستريتور + أنواع + أحداث
doctor/            → فحص الجودة قبل التنفيذ
checkpoint/        → لقطات + تراجع
pipeline/          → دورة حياة المهام
tree/              → شجرة الملفات
sync/              → توليد كود + مزامنة
scaffolder/        → توليد هياكل
workbench/         → واجهة سطح العمل
adapters/          → تكييف المحركات
bridge/            → جسر الاتصال
```

---

_آخر تحديث: Phase 0 — 2026-08-23_
