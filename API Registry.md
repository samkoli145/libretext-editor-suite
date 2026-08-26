/**

- ═══════════════════════════════════════════════════════════════════════════
- 📌 ملخص توجيهي | Guiding Summary
- ═══════════════════════════════════════════════════════════════════════════
- 📄 الملف: API Registry.md
- 📂 المسار: API Registry.md
- 🎯 الهدف الرئيسي: سجل شامل لجميع الـ APIs والخوارزميات
- 📋 المعايير: تحديث عند إضافة أي API جديد
- 🧪 الاختبارات: لا توجد (ملف إداري)
- 🏷️ المعرف: DOC-ADMIN-07
- 📅 تاريخ الإنشاء: 2026-08-19
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- ═══════════════════════════════════════════════════════════════════════════
  */

# سجل الـ APIs والخوارزميات - API Registry

# مشروع LibreText Editor Suite

---

## فهرس APIs العامة

| البادئة Prefix | المجال Domain         | الوصف Arabic                    | Description English |
| -------------- | --------------------- | ------------------------------- | ------------------- |
| `CORE-API-*`   | APIs النواة           | create, apply, undo, redo       | Core APIs           |
| `ALGO-CMD-*`   | APIs الأوامر          | execute, undo, register         | Command APIs        |
| `ALGO-FRM-*`   | APIs الصيغ            | parse, evaluate, functions      | Formula APIs        |
| `ALGO-SPR-*`   | APIs المكانية         | translate, map, grid            | Spatial APIs        |
| `STORE-API-*`  | APIs التخزين          | memory, localStorage, IndexedDB | Storage APIs        |
| `TPL-API-*`    | APIs القوالب          | register, get, apply            | Template APIs       |
| `SER-API-*`    | APIs المحولات         | serialize, deserialize          | Serializer APIs     |
| `PLUG-API-*`   | APIs الإضافات         | register, unregister            | Plugin APIs         |
| `ADAP-API-*`   | APIs طبقات التكيف     | useEditor, Provider             | Adapter APIs        |
| `UTIL-API-*`   | APIs الأدوات المساعدة | generateId, validate            | Utility APIs        |

---

## 1. Core APIs

| المعرف ID      | الاسم Name          | المعلمات Params  | القيمة المُعادة Returns | الحالة |
| -------------- | ------------------- | ---------------- | ----------------------- | ------ |
| `CORE-API-001` | `createEditorState` | `doc?: DocNode`  | `EditorState`           | تم     |
| `CORE-API-002` | `applyOperation`    | `state, op`      | `EditorState`           | تم     |
| `CORE-API-003` | `getDocument`       | `state`          | `DocNode`               | تم     |
| `CORE-API-004` | `undo`              | `state`          | `EditorState`           | تم     |
| `CORE-API-005` | `redo`              | `state`          | `EditorState`           | تم     |
| `CORE-API-006` | `canUndo`           | `state`          | `boolean`               | تم     |
| `CORE-API-007` | `canRedo`           | `state`          | `boolean`               | تم     |
| `CORE-API-008` | `createIndexer`     | `doc`            | `Indexer`               | تم     |
| `CORE-API-009` | `search`            | `indexer, query` | `SearchResult[]`        | تم     |
| `CORE-API-010` | `WriterEngine`      | `—`              | `WriterDocument ops`    | تم     |
| `CORE-API-011` | `CalcEngine`        | `sheet`          | `TableBlockNode ops`    | تم     |
| `CORE-API-012` | `ImpressEngine`     | `title?`         | `Presentation ops`      | تم     |
| `CORE-API-013` | `BaseEngine`        | `—`              | `Database ops`          | تم     |

---

## 2. Command APIs

| المعرف ID      | الاسم Name             | المعلمات Params           | القيمة المُعادة Returns | الحالة |
| -------------- | ---------------------- | ------------------------- | ----------------------- | ------ |
| `ALGO-CMD-001` | `createSpatialCommand` | `type, targetId, payload` | `SpatialCommand`        | تم     |
| `ALGO-CMD-002` | `executeCommand`       | `cmd, state`              | `EditorState`           | تم     |
| `ALGO-CMD-003` | `undoCommand`          | `cmd, state`              | `EditorState`           | تم     |
| `ALGO-CMD-004` | `registerCommand`      | `type, handler`           | `void`                  | تم     |

---

## 3. Formula APIs

| المعرف ID      | الاسم Name        | المعلمات Params                | القيمة المُعادة Returns | الحالة |
| -------------- | ----------------- | ------------------------------ | ----------------------- | ------ |
| `ALGO-FRM-001` | `parseFormula`    | `expression: string`           | `FormulaAST`            | تم     |
| `ALGO-FRM-002` | `evaluateFormula` | `ast, context`                 | `number/string`         | تم     |
| `ALGO-FRM-003` | `SUM`             | `...values: number[]`          | `number`                | تم     |
| `ALGO-FRM-004` | `AVERAGE`         | `...values: number[]`          | `number`                | تم     |
| `ALGO-FRM-005` | `IF`              | `condition, trueVal, falseVal` | `T`                     | تم     |
| `ALGO-FRM-006` | `CONCAT`          | `...strings: string[]`         | `string`                | تم     |
| `ALGO-FRM-007` | `COUNT`           | `...values: unknown[]`         | `number`                | تم     |
| `ALGO-FRM-008` | `MIN`             | `...values: number[]`          | `number`                | تم     |
| `ALGO-FRM-009` | `MAX`             | `...values: number[]`          | `number`                | تم     |
| `ALGO-FRM-010` | `ROUND`           | `value, decimals?`             | `number`                | تم     |
| `ALGO-FRM-011` | `ABS`             | `value: number`                | `number`                | تم     |

---

## 4. Spatial APIs

| المعرف ID      | الاسم Name                | المعلمات Params                      | القيمة المُعادة Returns | الحالة |
| -------------- | ------------------------- | ------------------------------------ | ----------------------- | ------ |
| `ALGO-SPR-001` | `translateCoords`         | `raw, domain, config`                | `SpatialCoordinate`     | تم     |
| `ALGO-SPR-002` | `createLogicalCoordinate` | `x, y, unit?`                        | `LogicalCoordinate`     | تم     |
| `ALGO-SPR-003` | `createGridCoordinate`    | `row, col`                           | `GridCoordinate`        | تم     |
| `ALGO-SPR-004` | `gridToLabel`             | `coord`                              | `string`                | تم     |
| `ALGO-SPR-005` | `labelToGrid`             | `label: string`                      | `GridCoordinate`        | تم     |
| `ALGO-SPR-006` | `createMoveCommand`       | `targetId, from, to`                 | `MoveCommand`           | تم     |
| `ALGO-SPR-007` | `createResizeCommand`     | `targetId, position, width, height`  | `ResizeCommand`         | تم     |
| `ALGO-SPR-008` | `createSelectCommand`     | `targetIds, addToSelection?`         | `SelectCommand`         | تم     |
| `ALGO-SPR-009` | `createDeleteCommand`     | `targetIds`                          | `DeleteCommand`         | تم     |
| `ALGO-SPR-010` | `createCreateCommand`     | `position, content, width?, height?` | `CreateCommand`         | تم     |
| `ALGO-SPR-011` | `computeMoveDelta`        | `from, to`                           | `MoveDelta`             | تم     |
| `ALGO-SPR-012` | `toBoundingBox`           | `cmd: ResizeCommand`                 | `BoundingBox`           | تم     |

---

## 5. Storage APIs

| المعرف ID       | الاسم Name                 | المعلمات Params | القيمة المُعادة Returns | الحالة  |
| --------------- | -------------------------- | --------------- | ----------------------- | ------- |
| `STORE-API-001` | `MemoryStore.create`       | `config?`       | `MemoryStore`           | لم يبدأ |
| `STORE-API-002` | `LocalStorageStore.create` | `config`        | `LocalStorageStore`     | لم يبدأ |
| `STORE-API-003` | `IndexedDBStore.create`    | `config`        | `Promise<IDBStore>`     | لم يبدأ |
| `STORE-API-004` | `SnapshotManager.create`   | `maxSnapshots?` | `SnapshotManager`       | لم يبدأ |
| `STORE-API-005` | `store.save`               | `doc, key`      | `Promise<void>`         | لم يبدأ |
| `STORE-API-006` | `store.load`               | `key: string`   | `Promise<DocNode        | null>`  | لم يبدأ |

---

## 6. Template APIs

| المعرف ID     | الاسم Name                | المعلمات Params | القيمة المُعادة Returns | الحالة  |
| ------------- | ------------------------- | --------------- | ----------------------- | ------- |
| `TPL-API-001` | `TemplateRegistry.create` | `options?`      | `TemplateRegistry`      | لم يبدأ |
| `TPL-API-002` | `registry.register`       | `template`      | `void`                  | لم يبدأ |
| `TPL-API-003` | `registry.get`            | `id: string`    | `Template               | null`   | لم يبدأ |
| `TPL-API-004` | `registry.list`           | `domain?`       | `Template[]`            | لم يبدأ |
| `TPL-API-005` | `registry.apply`          | `templateId`    | `DocNode`               | لم يبدأ |

---

## 7. Serializer APIs

| المعرف ID     | الحزمة   | الاسم Name                     | المعلمات Params | القيمة المُعادة Returns | الحالة |
| ------------- | -------- | ------------------------------ | --------------- | ----------------------- | ------ |
| `SER-API-001` | basic    | `MarkdownSerializer.serialize` | `doc`           | `string`                | تم     |
| `SER-API-002` | basic    | `HtmlSerializer.serialize`     | `doc`           | `string`                | تم     |
| `SER-API-003` | basic    | `TxtSerializer.serialize`      | `doc`           | `string`                | تم     |
| `SER-API-004` | advanced | `PdfSerializer.serialize`      | `doc`           | `Uint8Array`            | تم     |
| `SER-API-005` | advanced | `LatexSerializer.serialize`    | `doc`           | `string`                | تم     |

---

## 8. Plugin APIs

| المعرف ID      | الاسم Name             | المعلمات Params | القيمة المُعادة Returns | الحالة |
| -------------- | ---------------------- | --------------- | ----------------------- | ------ |
| `PLUG-API-001` | `createPlugin`         | `config`        | `Plugin`                | تم     |
| `PLUG-API-002` | `MermaidPlugin.render` | `code`          | `string (SVG)`          | تم     |
| `PLUG-API-003` | `MathPlugin.render`    | `formula`       | `string (HTML)`         | تم     |

---

## 9. Adapter APIs

| المعرف ID      | الاسم Name             | المعلمات Params     | القيمة المُعادة Returns | الحالة |
| -------------- | ---------------------- | ------------------- | ----------------------- | ------ |
| `ADAP-API-001` | React `useEditor`      | `options`           | `EditorInstance`        | تم     |
| `ADAP-API-002` | React `EditorProvider` | `children, options` | `JSX.Element`           | تم     |
| `ADAP-API-003` | Vue `useEditor`        | `options`           | `EditorInstance`        | تم     |
| `ADAP-API-004` | `<libre-text-editor>`  | `attributes`        | `HTMLElement`           | تم     |
| `ADAP-API-005` | Vanilla `createEditor` | `element, options`  | `EditorInstance`        | تم     |

---

## 10. Utility APIs

| المعرف ID      | الملف File      | الاسم Name         | المعلمات Params | القيمة المُعادة Returns | الحالة |
| -------------- | --------------- | ------------------ | --------------- | ----------------------- | ------ |
| `UTIL-API-001` | `id.ts`         | `generateId`       | `prefix?`       | `string`                | تم     |
| `UTIL-API-002` | `validation.ts` | `validateDocument` | `doc`           | `ValidationResult`      | تم     |
| `UTIL-API-003` | `validation.ts` | `validateNode`     | `node`          | `ValidationResult`      | تم     |

---

## إحصائيات التسجيل

| الفئة Category    | العدد Count | مكتمل  | قيد العمل | لم يبدأ |
| ----------------- | ----------- | ------ | --------- | ------- |
| Core APIs         | 9           | 9      | 0         | 0       |
| Command APIs      | 4           | 4      | 0         | 0       |
| Formula APIs      | 11          | 11     | 0         | 0       |
| Spatial APIs      | 12          | 12     | 0         | 0       |
| Storage APIs      | 6           | 0      | 0         | 6       |
| Template APIs     | 5           | 0      | 0         | 5       |
| Serializer APIs   | 5           | 5      | 0         | 0       |
| Plugin APIs       | 3           | 3      | 0         | 0       |
| Adapter APIs      | 5           | 5      | 0         | 0       |
| Utility APIs      | 3           | 3      | 0         | 0       |
| **المجموع Total** | **63**      | **52** | **0**     | **11**  |
