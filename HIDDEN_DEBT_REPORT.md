/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: HIDDEN_DEBT_REPORT.md
 * 🎯 الهدف: تقرير الديون الخفية — مشاكل لا يكشفها tsc أو vitest
 * 🏛️ الدور: سجل الملاحظات المعمارية غير المرصودة
 * 🏷️ المعرف: DOC-ADMIN-17
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

# تقرير الديون الخفية | Hidden Debt Report

**تاريخ الفحص:** 2026-08-23
**النطاق:** `packages/shell/dev-studio/`
**الأدوات:** grep + manual review (Phase 0.5)

---

## ملخص الإيجادات

| الفئة | العدد | الأعلى خطورة |
|-------|-------|-------------|
| Type assertions غير آمنة (`as any`, `as unknown as`) | 8 | HIGH |
| JSON.parse بدون try/catch | 3 | HIGH |
| Hardcoded timeouts | 3 | MEDIUM |
| console.error في المحركات | 3 | LOW |
| console.log في CLI | 28 | مقبول (CLI) |

---

## 1. type assertions غير آمنة (HIGH)

| الملف | السطر | الكود | المشكلة |
|-------|-------|-------|---------|
| `core/DevStudioEvents.ts` | 48 | `new Set() as any` | **`as any`** — يُلغي حماية الأنواع بالكامل |
| `scratchpad/scratchpad.ts` | 376 | `as unknown as Partial<ScratchpadVar>` | **double cast** — يُخفي خطأ محتمل |
| `scratchpad/scratchpad.ts` | 418 | `as unknown as Record<string, ScratchpadVar>` | **double cast** |
| `scratchpad/scratchpad.ts` | 426 | `as unknown as Partial<ScratchpadVar>` | **double cast** |
| `scratchpad/scratchpad.ts` | 436 | `as Notebook & { inverse: ... }` | **unsafe widening** |
| `scratchpad/scratchpad.ts` | 489 | `as Notebook & { inverse: ... }` | **unsafe widening** |
| `checkpoint/SnapshotEngine.ts` | 214 | `p.inverse as DevStudioPatch` | **unsafe cast** — inverse قد لا يكون DevStudioPatch |
| `workbench/DevStudioWorkbench.ts` | 170 | `{} as HTMLElement` | **empty object as HTMLElement** |

**الحل المقترح:**
- `DevStudioEvents.ts:48` → استبدال `as any` بـ generic type properly
- `scratchpad.ts` → إنشاء `ScratchpadPatch` type رسمي بدل double casts
- `SnapshotEngine.ts:214` → إضافة type guard قبل cast

---

## 2. JSON.parse بدون حماية (HIGH)

| الملف | السطر | الكود | المشكلة |
|-------|-------|-------|---------|
| `knowledge/project-memory.ts` | 70 | `JSON.parse(raw) as ProjectMemory` | ملف corrupted = crash |
| `workbench/storage.ts` | 28 | `JSON.parse(raw) as T` | ملف corrupted = crash |
| `checkpoint/SnapshotEngine.ts` | 127 | `JSON.parse(raw) as Checkpoint` | ملف corrupted = crash |

**الحل المقترح:** استخدام `tryCatch` من `shared/utils/result.ts`:

```typescript
import { tryCatch } from '@libretext/shared/utils/result';
const result = tryCatch(() => JSON.parse(raw) as ProjectMemory);
if (result.isErr) return createEmptyMemory();
```

---

## 3. Hardcoded timeouts (MEDIUM)

| الملف | السطر | القيمة | الاستخدام |
|-------|-------|--------|-----------|
| `knowledge/project-scanner.ts` | 36 | `5000` | git log timeout |
| `knowledge/project-scanner.ts` | 39 | `5000` | git branch timeout |
| `knowledge/project-scanner.ts` | 57 | `120000` | vitest timeout |
| `cli/index.ts` | 94 | `10000` | find command timeout |

**الحل المقترح:** نقلها لـ constants في أعلى الملف أو config object.

---

## 4. console.error في المحركات (LOW)

| الملف | السطر | السبب |
|-------|-------|-------|
| `pipeline/TaskPipeline.ts` | 176 | listener failed |
| `pipeline/TaskPipeline.ts` | 393 | rollback failed |
| `core/DevStudioEvents.ts` | 72 | event listener error |

**ملاحظة:** هذه مقبولة في المحركات لأنها fallback logging. لكن يُفضل استخدام EventBus بدلاً من console.

---

## 5. التناقضات المعمارية

| التناقض | الوصف | الخطورة |
|---------|-------|---------|
| **DevStudioEvents vs EventBus** | `DevStudioEvents.ts` يُعيد اختراع EventBus من الصفر بينما يوجد `EventBus` في `shared/engines/` | HIGH |
| **Debouncer vs Scheduler** | `shared/engines/Debouncer.ts` موجود مسبقاً و `Scheduler` جديد —二者 يفعلان نفس الشيء تقريباً | MEDIUM |
| **CLI knowledge/** | `cli/index.ts` يستورد من `knowledge/` — هذا صحيح وفق Ownership Map | ✅ |

---

## الأولوية للإصلاح

1. **HIGH:** استبدال `as any` في DevStudioEvents.ts بـ typed pattern
2. **HIGH:** إضافة try/catch حول JSON.parse في 3 ملفات
3. **MEDIUM:** دمج DevStudioEvents مع EventBus من shared/
4. **MEDIUM:** توحيد Debouncer و Scheduler
5. **LOW:** تحويل hardcoded timeouts لـ constants

---

*آخر تحديث: Phase 0.5 — 2026-08-23*
