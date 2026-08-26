# 📇 فهرس Functions & Algorithms الشامل

# Comprehensive Function & Algorithm Index

> **تاريخ آخر Update:** 2026-08-26
> **عدد الحزم:** 7
> **Total العناصر المفهرسة:** 1228 عنصر

---

## 📦 packages/adapters

### 📁 react-adapter.ts

| #   | الاسم                | الType      | File:سطر               | Parameters                 |
| --- | -------------------- | ----------- | ---------------------- | -------------------------- |
| 1/2 | `ReactAdapter`       | 🏗️ class    | `react-adapter.ts:25`  | `—`                        |
| 2/2 | `createReactAdapter` | ⚙️ function | `react-adapter.ts:147` | `options?: AdapterOptions` |

### 📁 spatial-adapter.ts

| #   | الاسم               | الType       | File:سطر                | Parameters |
| --- | ------------------- | ------------ | ----------------------- | ---------- |
| 1/8 | `MouseCoords`       | 📐 interface | `spatial-adapter.ts:25` | `—`        |
| 2/8 | `GridCoordinate`    | 📐 interface | `spatial-adapter.ts:30` | `—`        |
| 3/8 | `LogicalCoordinate` | 📐 interface | `spatial-adapter.ts:35` | `—`        |
| 4/8 | `ViewportConfig`    | 📐 interface | `spatial-adapter.ts:42` | `—`        |
| 5/8 | `toLogical`         | ⚙️ function  | `spatial-adapter.ts:58` | `—`        |
| 6/8 | `toGrid`            | ⚙️ function  | `spatial-adapter.ts:70` | `—`        |
| 7/8 | `gridToLogical`     | ⚙️ function  | `spatial-adapter.ts:82` | `—`        |
| 8/8 | `logicalToGrid`     | ⚙️ function  | `spatial-adapter.ts:94` | `—`        |

### 📁 types.ts

| #   | الاسم            | الType       | File:سطر      | Parameters |
| --- | ---------------- | ------------ | ------------- | ---------- |
| 1/4 | `AdapterOptions` | 📐 interface | `types.ts:25` | `—`        |
| 2/4 | `Selection`      | 📐 interface | `types.ts:38` | `—`        |
| 3/4 | `EditorAdapter`  | 📐 interface | `types.ts:50` | `—`        |
| 4/4 | `AdapterFactory` | 🏷️ type      | `types.ts:72` | `—`        |

### 📁 vanilla-adapter.ts

| #   | الاسم                  | الType      | File:سطر                 | Parameters                 |
| --- | ---------------------- | ----------- | ------------------------ | -------------------------- |
| 1/2 | `VanillaAdapter`       | 🏗️ class    | `vanilla-adapter.ts:26`  | `—`                        |
| 2/2 | `createVanillaAdapter` | ⚙️ function | `vanilla-adapter.ts:132` | `options?: AdapterOptions` |

### 📁 vue-adapter.ts

| #   | الاسم              | الType      | File:سطر             | Parameters                 |
| --- | ------------------ | ----------- | -------------------- | -------------------------- |
| 1/2 | `VueAdapter`       | 🏗️ class    | `vue-adapter.ts:27`  | `—`                        |
| 2/2 | `createVueAdapter` | ⚙️ function | `vue-adapter.ts:133` | `options?: AdapterOptions` |

### 📁 web-component-adapter.ts

| #   | الاسم                       | الType      | File:سطر                       | Parameters                 |
| --- | --------------------------- | ----------- | ------------------------------ | -------------------------- |
| 1/2 | `WebComponentAdapter`       | 🏗️ class    | `web-component-adapter.ts:27`  | `—`                        |
| 2/2 | `createWebComponentAdapter` | ⚙️ function | `web-component-adapter.ts:133` | `options?: AdapterOptions` |

---

## 📦 packages/algorithms

### 📁 executor.ts

| #   | الاسم                      | الType       | File:سطر          | Parameters                             |
| --- | -------------------------- | ------------ | ----------------- | -------------------------------------- |
| 1/9 | `CommandOpResult`          | 🏷️ type      | `executor.ts:45`  | `—`                                    |
| 2/9 | `CommandResult`            | 📐 interface | `executor.ts:50`  | `—`                                    |
| 3/9 | `ExtensibleCommandHandler` | 📐 interface | `executor.ts:59`  | `—`                                    |
| 4/9 | `SpatialCommandHandler`    | 📌 constant  | `executor.ts:73`  | `—`                                    |
| 5/9 | `TextCommandHandler`       | 📌 constant  | `executor.ts:93`  | `—`                                    |
| 6/9 | `FormulaCommandHandler`    | 📌 constant  | `executor.ts:106` | `—`                                    |
| 7/9 | `CommandExecutor`          | 🏗️ class     | `executor.ts:122` | `—`                                    |
| 8/9 | `executeCommand`           | ⚙️ function  | `executor.ts:247` | `cmd: Command, state: FullEditorState` |
| 9/9 | `undoCommand`              | ⚙️ function  | `executor.ts:251` | `cmd: Command, state: FullEditorState` |

### 📁 registry.ts

| #     | الاسم                        | الType       | File:سطر          | Parameters                         |
| ----- | ---------------------------- | ------------ | ----------------- | ---------------------------------- |
| 1/18  | `StateCommandHandler`        | 🏷️ type      | `registry.ts:57`  | `—`                                |
| 2/18  | `CanExecuteFn`               | 🏷️ type      | `registry.ts:60`  | `—`                                |
| 3/18  | `IsEnabledFn`                | 🏷️ type      | `registry.ts:63`  | `—`                                |
| 4/18  | `CommandEvent`               | 📐 interface | `registry.ts:66`  | `—`                                |
| 5/18  | `CommandEventListener`       | 🏷️ type      | `registry.ts:73`  | `—`                                |
| 6/18  | `CommandRegistration`        | 📐 interface | `registry.ts:76`  | `—`                                |
| 7/18  | `CommandRegistry`            | 🏗️ class     | `registry.ts:84`  | `—`                                |
| 8/18  | `createCommandRegistry`      | ⚙️ function  | `registry.ts:215` | `—`                                |
| 9/18  | `registerCommand`            | ⚙️ function  | `registry.ts:221` | `—`                                |
| 10/18 | `unregisterCommand`          | ⚙️ function  | `registry.ts:229` | `type: string`                     |
| 11/18 | `dispatchCommand`            | ⚙️ function  | `registry.ts:233` | `cmd: Command, state: EditorState` |
| 12/18 | `getDefaultRegistry`         | ⚙️ function  | `registry.ts:237` | `—`                                |
| 13/18 | `FunctionRegistry`           | 🏗️ class     | `registry.ts:39`  | `—`                                |
| 14/18 | `createFunctionRegistry`     | ⚙️ function  | `registry.ts:195` | `—`                                |
| 15/18 | `getDefaultFunctionRegistry` | ⚙️ function  | `registry.ts:206` | `—`                                |
| 16/18 | `getBuiltinFunction`         | ⚙️ function  | `registry.ts:211` | `name: string`                     |
| 17/18 | `MacroRegistry`              | 🏗️ class     | `registry.ts:28`  | `—`                                |
| 18/18 | `macroRegistry`              | 📌 constant  | `registry.ts:86`  | `—`                                |

### 📁 types.ts

| #     | الاسم                     | الType       | File:سطر       | Parameters                 |
| ----- | ------------------------- | ------------ | -------------- | -------------------------- |
| 1/57  | `CommandType`             | 📌 constant  | `types.ts:34`  | `—`                        |
| 2/57  | `CommandTypeValue`        | 🏷️ type      | `types.ts:41`  | `—`                        |
| 3/57  | `BasePayload`             | 📐 interface | `types.ts:47`  | `—`                        |
| 4/57  | `SpatialCommand`          | 📐 interface | `types.ts:56`  | `—`                        |
| 5/57  | `TextCommand`             | 📐 interface | `types.ts:72`  | `—`                        |
| 6/57  | `FormulaCommand`          | 📐 interface | `types.ts:85`  | `—`                        |
| 7/57  | `Command`                 | 🏷️ type      | `types.ts:98`  | `—`                        |
| 8/57  | `CommandResult`           | 📐 interface | `types.ts:104` | `—`                        |
| 9/57  | `CommandHandler`          | 🏷️ type      | `types.ts:114` | `—`                        |
| 10/57 | `isSpatialCommand`        | ⚙️ function  | `types.ts:120` | `cmd: Command`             |
| 11/57 | `isTextCommand`           | ⚙️ function  | `types.ts:124` | `cmd: Command`             |
| 12/57 | `isFormulaCommand`        | ⚙️ function  | `types.ts:128` | `cmd: Command`             |
| 13/57 | `MacroDomain`             | 🏷️ type      | `types.ts:44`  | `—`                        |
| 14/57 | `MacroParameter`          | 📐 interface | `types.ts:46`  | `—`                        |
| 15/57 | `MacroStep`               | 📐 interface | `types.ts:53`  | `—`                        |
| 16/57 | `MacroDefinition`         | 📐 interface | `types.ts:60`  | `—`                        |
| 17/57 | `MacroExecutionOptions`   | 📐 interface | `types.ts:72`  | `—`                        |
| 18/57 | `MacroExecutionResult`    | 📐 interface | `types.ts:79`  | `—`                        |
| 19/57 | `RecorderState`           | 🏷️ type      | `types.ts:88`  | `—`                        |
| 20/57 | `RecorderOptions`         | 📐 interface | `types.ts:90`  | `—`                        |
| 21/57 | `isMacroDefinition`       | ⚙️ function  | `types.ts:98`  | `value: unknown`           |
| 22/57 | `isMacroStep`             | ⚙️ function  | `types.ts:113` | `value: unknown`           |
| 23/57 | `SearchOptions`           | 📐 interface | `types.ts:30`  | `—`                        |
| 24/57 | `SearchTargetType`        | 🏷️ type      | `types.ts:36`  | `—`                        |
| 25/57 | `SearchTargetItem`        | 📐 interface | `types.ts:39`  | `—`                        |
| 26/57 | `SearchMatch`             | 📐 interface | `types.ts:46`  | `—`                        |
| 27/57 | `ReplaceAllResult`        | 📐 interface | `types.ts:57`  | `—`                        |
| 28/57 | `LengthUnit`              | 📌 constant  | `types.ts:36`  | `—`                        |
| 29/57 | `LengthUnitValue`         | 🏷️ type      | `types.ts:44`  | `—`                        |
| 30/57 | `LogicalCoordinate`       | 📐 interface | `types.ts:47`  | `—`                        |
| 31/57 | `GridCoordinate`          | 📐 interface | `types.ts:60`  | `—`                        |
| 32/57 | `SpatialCoordinate`       | 🏷️ type      | `types.ts:67`  | `—`                        |
| 33/57 | `GridConfig`              | 📐 interface | `types.ts:70`  | `—`                        |
| 34/57 | `BoundingBox`             | 📐 interface | `types.ts:77`  | `—`                        |
| 35/57 | `isLogicalCoordinate`     | ⚙️ function  | `types.ts:88`  | `coord: SpatialCoordinate` |
| 36/57 | `isGridCoordinate`        | ⚙️ function  | `types.ts:92`  | `coord: SpatialCoordinate` |
| 37/57 | `createLogicalCoordinate` | ⚙️ function  | `types.ts:102` | `—`                        |
| 38/57 | `createGridCoordinate`    | ⚙️ function  | `types.ts:115` | `row: number, col: number` |
| 39/57 | `gridToLabel`             | ⚙️ function  | `types.ts:131` | `coord: GridCoordinate`    |
| 40/57 | `labelToGrid`             | ⚙️ function  | `types.ts:142` | `label: string`            |
| 41/57 | `isValidCellLabel`        | ⚙️ function  | `types.ts:167` | `label: string`            |
| 42/57 | `StreetType`              | 🏷️ type      | `types.ts:22`  | `—`                        |
| 43/57 | `StreetStatus`            | 🏷️ type      | `types.ts:25`  | `—`                        |
| 44/57 | `CityStreet`              | 📐 interface | `types.ts:29`  | `—`                        |
| 45/57 | `DuplicateNameReport`     | 📐 interface | `types.ts:46`  | `—`                        |
| 46/57 | `SimilarityMatch`         | 📐 interface | `types.ts:61`  | `—`                        |
| 47/57 | `StreetQueryFilter`       | 📐 interface | `types.ts:70`  | `—`                        |
| 48/57 | `StreetSortField`         | 🏷️ type      | `types.ts:82`  | `—`                        |
| 49/57 | `SortDirection`           | 🏷️ type      | `types.ts:84`  | `—`                        |
| 50/57 | `StreetSortOption`        | 📐 interface | `types.ts:86`  | `—`                        |
| 51/57 | `PaymentTiming`           | 🏷️ type      | `types.ts:18`  | `—`                        |
| 52/57 | `AABB`                    | 📐 interface | `types.ts:21`  | `—`                        |
| 53/57 | `Point2D`                 | 📐 interface | `types.ts:31`  | `—`                        |
| 54/57 | `DependencyGraphData`     | 📐 interface | `types.ts:37`  | `—`                        |
| 55/57 | `CycleDetectionResult`    | 📐 interface | `types.ts:43`  | `—`                        |
| 56/57 | `isAABB`                  | ⚙️ function  | `types.ts:50`  | `val: unknown`             |
| 57/57 | `isPoint2D`               | ⚙️ function  | `types.ts:62`  | `val: unknown`             |

### 📁 diagram-engine.ts

| #   | الاسم                 | الType       | File:سطر               | Parameters |
| --- | --------------------- | ------------ | ---------------------- | ---------- |
| 1/4 | `DiagramNode`         | 📐 interface | `diagram-engine.ts:14` | `—`        |
| 2/4 | `DiagramEdge`         | 📐 interface | `diagram-engine.ts:25` | `—`        |
| 3/4 | `DiagramLayout`       | 📐 interface | `diagram-engine.ts:33` | `—`        |
| 4/4 | `createDiagramEngine` | ⚙️ function  | `diagram-engine.ts:69` | `—`        |

### 📁 arabic-aliases.ts

| #   | الاسم                   | الType      | File:سطر               | Parameters     |
| --- | ----------------------- | ----------- | ---------------------- | -------------- |
| 1/2 | `ARABIC_FUNCTION_MAP`   | 📌 constant | `arabic-aliases.ts:25` | `—`            |
| 2/2 | `normalizeFunctionName` | ⚙️ function | `arabic-aliases.ts:90` | `name: string` |

### 📁 ast.ts

| #     | الاسم              | الType       | File:سطر    | Parameters |
| ----- | ------------------ | ------------ | ----------- | ---------- |
| 1/15  | `MATH_CONSTANTS`   | 📌 constant  | `ast.ts:28` | `—`        |
| 2/15  | `ConstantName`     | 🏷️ type      | `ast.ts:36` | `—`        |
| 3/15  | `BinaryOperator`   | 🏷️ type      | `ast.ts:37` | `—`        |
| 4/15  | `UnaryOperator`    | 🏷️ type      | `ast.ts:39` | `—`        |
| 5/15  | `NumberLiteral`    | 📐 interface | `ast.ts:41` | `—`        |
| 6/15  | `StringLiteral`    | 📐 interface | `ast.ts:45` | `—`        |
| 7/15  | `BooleanLiteral`   | 📐 interface | `ast.ts:49` | `—`        |
| 8/15  | `ConstantLiteral`  | 📐 interface | `ast.ts:53` | `—`        |
| 9/15  | `CellReference`    | 📐 interface | `ast.ts:57` | `—`        |
| 10/15 | `RangeReference`   | 📐 interface | `ast.ts:61` | `—`        |
| 11/15 | `BinaryExpression` | 📐 interface | `ast.ts:66` | `—`        |
| 12/15 | `UnaryExpression`  | 📐 interface | `ast.ts:72` | `—`        |
| 13/15 | `FunctionCall`     | 📐 interface | `ast.ts:77` | `—`        |
| 14/15 | `FormulaAST`       | 🏷️ type      | `ast.ts:83` | `—`        |
| 15/15 | `ParseError`       | 🏗️ class     | `ast.ts:94` | `—`        |

### 📁 cell-utils.ts

| #   | الاسم             | الType      | File:سطر           | Parameters                 |
| --- | ----------------- | ----------- | ------------------ | -------------------------- |
| 1/5 | `columnToIndex`   | ⚙️ function | `cell-utils.ts:31` | `col: string`              |
| 2/5 | `indexToColumn`   | ⚙️ function | `cell-utils.ts:41` | `index: number`            |
| 3/5 | `expandCellRange` | ⚙️ function | `cell-utils.ts:52` | `from: string, to: string` |
| 4/5 | `excelEquals`     | ⚙️ function | `cell-utils.ts:72` | `a: unknown, b: unknown`   |
| 5/5 | `compare`         | ⚙️ function | `cell-utils.ts:91` | `a: unknown, b: unknown`   |

### 📁 dependency-graph.ts

| #   | الاسم                   | الType       | File:سطر                  | Parameters               |
| --- | ----------------------- | ------------ | ------------------------- | ------------------------ |
| 1/8 | `CellFormulaInput`      | 🏷️ type      | `dependency-graph.ts:49`  | `—`                      |
| 2/8 | `CellsMap`              | 🏷️ type      | `dependency-graph.ts:50`  | `—`                      |
| 3/8 | `DependencyGraph`       | 📐 interface | `dependency-graph.ts:53`  | `—`                      |
| 4/8 | `extractCellReferences` | ⚙️ function  | `dependency-graph.ts:60`  | `ast: FormulaAST`        |
| 5/8 | `buildDependencyGraph`  | ⚙️ function  | `dependency-graph.ts:106` | `cells: CellsMap`        |
| 6/8 | `detectCycle`           | ⚙️ function  | `dependency-graph.ts:152` | `graph: DependencyGraph` |
| 7/8 | `topologicalSort`       | ⚙️ function  | `dependency-graph.ts:209` | `graph: DependencyGraph` |
| 8/8 | `getRecalculationOrder` | ⚙️ function  | `dependency-graph.ts:256` | `—`                      |

### 📁 evaluator-types.ts

| #   | الاسم               | الType       | File:سطر                | Parameters |
| --- | ------------------- | ------------ | ----------------------- | ---------- |
| 1/4 | `FunctionHandler`   | 🏷️ type      | `evaluator-types.ts:15` | `—`        |
| 2/4 | `EvaluationResult`  | 🏷️ type      | `evaluator-types.ts:18` | `—`        |
| 3/4 | `EvaluationContext` | 📐 interface | `evaluator-types.ts:21` | `—`        |
| 4/4 | `EvaluationError`   | 🏗️ class     | `evaluator-types.ts:28` | `—`        |

### 📁 evaluator.ts

| #   | الاسم              | الType      | File:سطر           | Parameters |
| --- | ------------------ | ----------- | ------------------ | ---------- |
| 1/2 | `FormulaEvaluator` | 🏗️ class    | `evaluator.ts:40`  | `—`        |
| 2/2 | `evaluateFormula`  | ⚙️ function | `evaluator.ts:226` | `—`        |

### 📁 functions-arabic.ts

| #   | الاسم                 | الType       | File:سطر                  | Parameters                                                    |
| --- | --------------------- | ------------ | ------------------------- | ------------------------------------------------------------- |
| 1/9 | `CurrencyConfig`      | 📐 interface | `functions-arabic.ts:48`  | `—`                                                           |
| 2/9 | `ARABIC_CURRENCIES`   | 📌 constant  | `functions-arabic.ts:58`  | `—`                                                           |
| 3/9 | `TAFQEET`             | ⚙️ function  | `functions-arabic.ts:244` | `—`                                                           |
| 4/9 | `STRIP_TASHKEEL`      | ⚙️ function  | `functions-arabic.ts:305` | `text: unknown`                                               |
| 5/9 | `NORMALIZE_ARABIC`    | ⚙️ function  | `functions-arabic.ts:315` | `text: unknown, normalizeTaa: unknown = false`                |
| 6/9 | `TO_ARABIC_NUMERALS`  | ⚙️ function  | `functions-arabic.ts:338` | `input: unknown`                                              |
| 7/9 | `TO_WESTERN_NUMERALS` | ⚙️ function  | `functions-arabic.ts:346` | `input: unknown`                                              |
| 8/9 | `ARABIC_LEN`          | ⚙️ function  | `functions-arabic.ts:359` | `text: unknown, ignoreTashkeel: unknown = true`               |
| 9/9 | `ARABIC_MATCH`        | ⚙️ function  | `functions-arabic.ts:369` | `text: unknown, pattern: unknown, isPartial: unknown = false` |

### 📁 functions-financial.ts

| #   | الاسم | الType      | File:سطر                     | Parameters                                    |
| --- | ----- | ----------- | ---------------------------- | --------------------------------------------- |
| 1/3 | `PMT` | ⚙️ function | `functions-financial.ts:78`  | `—`                                           |
| 2/3 | `NPV` | ⚙️ function | `functions-financial.ts:113` | `rateVal: unknown, ...valueArgs: unknown[]`   |
| 3/3 | `IRR` | ⚙️ function | `functions-financial.ts:139` | `valuesArg: unknown, guessVal: unknown = 0.1` |

### 📁 functions-lookup-date.ts

| #     | الاسم     | الType      | File:سطر                       | Parameters                                                  |
| ----- | --------- | ----------- | ------------------------------ | ----------------------------------------------------------- |
| 1/10  | `MATCH`   | ⚙️ function | `functions-lookup-date.ts:48`  | `—`                                                         |
| 2/10  | `INDEX`   | ⚙️ function | `functions-lookup-date.ts:90`  | `array: unknown[][], rowNum: unknown, colNum?: unknown`     |
| 3/10  | `VLOOKUP` | ⚙️ function | `functions-lookup-date.ts:115` | `—`                                                         |
| 4/10  | `XLOOKUP` | ⚙️ function | `functions-lookup-date.ts:167` | `—`                                                         |
| 5/10  | `IFS`     | ⚙️ function | `functions-lookup-date.ts:194` | `...args: unknown[]`                                        |
| 6/10  | `SWITCH`  | ⚙️ function | `functions-lookup-date.ts:212` | `expression: unknown, ...args: unknown[]`                   |
| 7/10  | `DATE`    | ⚙️ function | `functions-lookup-date.ts:234` | `year: unknown, month: unknown, day: unknown`               |
| 8/10  | `TODAY`   | ⚙️ function | `functions-lookup-date.ts:249` | `—`                                                         |
| 9/10  | `NOW`     | ⚙️ function | `functions-lookup-date.ts:258` | `—`                                                         |
| 10/10 | `DATEDIF` | ⚙️ function | `functions-lookup-date.ts:263` | `startDate: unknown, endDate: unknown, unit: unknown = 'D'` |

### 📁 functions-math.ts

| #     | الاسم        | الType      | File:سطر                | Parameters                                              |
| ----- | ------------ | ----------- | ----------------------- | ------------------------------------------------------- |
| 1/12  | `POWER`      | ⚙️ function | `functions-math.ts:74`  | `number: unknown, power: unknown`                       |
| 2/12  | `SQRT`       | ⚙️ function | `functions-math.ts:82`  | `number: unknown`                                       |
| 3/12  | `MOD`        | ⚙️ function | `functions-math.ts:90`  | `number: unknown, divisor: unknown`                     |
| 4/12  | `FLOOR`      | ⚙️ function | `functions-math.ts:99`  | `number: unknown, significance: unknown = 1`            |
| 5/12  | `CEILING`    | ⚙️ function | `functions-math.ts:109` | `number: unknown, significance: unknown = 1`            |
| 6/12  | `TRUNC`      | ⚙️ function | `functions-math.ts:119` | `number: unknown, numDigits: unknown = 0`               |
| 7/12  | `MEDIAN`     | ⚙️ function | `functions-math.ts:128` | `...args: unknown[]`                                    |
| 8/12  | `MODE`       | ⚙️ function | `functions-math.ts:142` | `...args: unknown[]`                                    |
| 9/12  | `COUNTA`     | ⚙️ function | `functions-math.ts:168` | `...args: unknown[]`                                    |
| 10/12 | `COUNTBLANK` | ⚙️ function | `functions-math.ts:174` | `...args: unknown[]`                                    |
| 11/12 | `COUNTIF`    | ⚙️ function | `functions-math.ts:222` | `range: unknown, criteria: unknown`                     |
| 12/12 | `SUMIF`      | ⚙️ function | `functions-math.ts:228` | `range: unknown, criteria: unknown, sumRange?: unknown` |

### 📁 functions-matrix.ts

| #     | الاسم               | الType      | File:سطر                  | Parameters                                                  |
| ----- | ------------------- | ----------- | ------------------------- | ----------------------------------------------------------- |
| 1/43  | `to2DArray`         | ⚙️ function | `functions-matrix.ts:55`  | `input: unknown`                                            |
| 2/43  | `transpose2D`       | ⚙️ function | `functions-matrix.ts:67`  | `matrix: T[][]`                                             |
| 3/43  | `valuesEqual`       | ⚙️ function | `functions-matrix.ts:83`  | `—`                                                         |
| 4/43  | `vectorsEqual`      | ⚙️ function | `functions-matrix.ts:126` | `—`                                                         |
| 5/43  | `A_EQ`              | ⚙️ function | `functions-matrix.ts:155` | `—`                                                         |
| 6/43  | `A_NE`              | ⚙️ function | `functions-matrix.ts:183` | `—`                                                         |
| 7/43  | `A_GT`              | ⚙️ function | `functions-matrix.ts:192` | `a: unknown, b: unknown`                                    |
| 8/43  | `A_GTE`             | ⚙️ function | `functions-matrix.ts:199` | `a: unknown, b: unknown`                                    |
| 9/43  | `A_LT`              | ⚙️ function | `functions-matrix.ts:206` | `a: unknown, b: unknown`                                    |
| 10/43 | `A_LTE`             | ⚙️ function | `functions-matrix.ts:213` | `a: unknown, b: unknown`                                    |
| 11/43 | `A_XMATCH_ROWS`     | ⚙️ function | `functions-matrix.ts:222` | `—`                                                         |
| 12/43 | `A_XMATCH_COLS`     | ⚙️ function | `functions-matrix.ts:250` | `—`                                                         |
| 13/43 | `A_XLOOKUP_ROWS`    | ⚙️ function | `functions-matrix.ts:281` | `—`                                                         |
| 14/43 | `A_XLOOKUP_COLS`    | ⚙️ function | `functions-matrix.ts:306` | `—`                                                         |
| 15/43 | `A_UNION_CELLS`     | ⚙️ function | `functions-matrix.ts:334` | `—`                                                         |
| 16/43 | `A_UNION_ROWS`      | ⚙️ function | `functions-matrix.ts:359` | `array1: unknown, array2: unknown`                          |
| 17/43 | `A_UNION_COLS`      | ⚙️ function | `functions-matrix.ts:379` | `array1: unknown, array2: unknown`                          |
| 18/43 | `A_INTERSECT_CELLS` | ⚙️ function | `functions-matrix.ts:399` | `array1: unknown, array2: unknown`                          |
| 19/43 | `A_INTERSECT_ROWS`  | ⚙️ function | `functions-matrix.ts:418` | `array1: unknown, array2: unknown`                          |
| 20/43 | `A_INTERSECT_COLS`  | ⚙️ function | `functions-matrix.ts:437` | `array1: unknown, array2: unknown`                          |
| 21/43 | `A_DIFF_CELLS`      | ⚙️ function | `functions-matrix.ts:456` | `array1: unknown, array2: unknown`                          |
| 22/43 | `A_DIFF_ROWS`       | ⚙️ function | `functions-matrix.ts:475` | `array1: unknown, array2: unknown`                          |
| 23/43 | `A_DIFF_COLS`       | ⚙️ function | `functions-matrix.ts:494` | `array1: unknown, array2: unknown`                          |
| 24/43 | `A_SETDIFF_CELLS`   | 📌 constant | `functions-matrix.ts:513` | `—`                                                         |
| 25/43 | `A_SETDIFF_ROWS`    | 📌 constant | `functions-matrix.ts:514` | `—`                                                         |
| 26/43 | `A_SETDIFF_COLS`    | 📌 constant | `functions-matrix.ts:515` | `—`                                                         |
| 27/43 | `A_DROP_ROWS`       | ⚙️ function | `functions-matrix.ts:519` | `array: unknown, count: unknown = 1`                        |
| 28/43 | `A_DROP_COLS`       | ⚙️ function | `functions-matrix.ts:525` | `array: unknown, count: unknown = 1`                        |
| 29/43 | `A_TAKE_ROWS`       | ⚙️ function | `functions-matrix.ts:532` | `array: unknown, count: unknown = 1`                        |
| 30/43 | `A_TAKE_COLS`       | ⚙️ function | `functions-matrix.ts:538` | `array: unknown, count: unknown = 1`                        |
| 31/43 | `A_REVERSE_ROWS`    | ⚙️ function | `functions-matrix.ts:545` | `array: unknown`                                            |
| 32/43 | `A_REVERSE_COLS`    | ⚙️ function | `functions-matrix.ts:550` | `array: unknown`                                            |
| 33/43 | `A_DUPLICATED`      | ⚙️ function | `functions-matrix.ts:558` | `array: unknown, keep: unknown = 1, byCol: unknown = false` |
| 34/43 | `A_DUPLICATED_ROWS` | ⚙️ function | `functions-matrix.ts:597` | `array: unknown, keep: unknown = 1`                         |
| 35/43 | `A_DUPLICATED_COLS` | ⚙️ function | `functions-matrix.ts:601` | `array: unknown, keep: unknown = 1`                         |
| 36/43 | `A_DUPLICATES`      | ⚙️ function | `functions-matrix.ts:605` | `—`                                                         |
| 37/43 | `A_MAP_ROWS`        | ⚙️ function | `functions-matrix.ts:625` | `array: unknown, fnOrOp: unknown`                           |
| 38/43 | `A_MAP_COLS`        | ⚙️ function | `functions-matrix.ts:639` | `array: unknown, fnOrOp: unknown`                           |
| 39/43 | `A_REDUCE_ROWS`     | ⚙️ function | `functions-matrix.ts:650` | `—`                                                         |
| 40/43 | `A_REDUCE_COLS`     | ⚙️ function | `functions-matrix.ts:670` | `—`                                                         |
| 41/43 | `A_FILTER_ROWS`     | ⚙️ function | `functions-matrix.ts:690` | `array: unknown, predicate: unknown`                        |
| 42/43 | `A_FILTER_COLS`     | ⚙️ function | `functions-matrix.ts:698` | `array: unknown, predicate: unknown`                        |
| 43/43 | `LIBRETEXT_INFO`    | ⚙️ function | `functions-matrix.ts:789` | `query?: unknown`                                           |

### 📁 functions-text.ts

| #     | الاسم        | الType      | File:سطر                | Parameters                                                     |
| ----- | ------------ | ----------- | ----------------------- | -------------------------------------------------------------- |
| 1/16  | `TRIM`       | ⚙️ function | `functions-text.ts:70`  | `text: unknown`                                                |
| 2/16  | `CLEAN`      | ⚙️ function | `functions-text.ts:76`  | `text: unknown`                                                |
| 3/16  | `LEFT`       | ⚙️ function | `functions-text.ts:81`  | `text: unknown, numChars: unknown = 1`                         |
| 4/16  | `RIGHT`      | ⚙️ function | `functions-text.ts:89`  | `text: unknown, numChars: unknown = 1`                         |
| 5/16  | `MID`        | ⚙️ function | `functions-text.ts:99`  | `text: unknown, startNum: unknown, numChars: unknown`          |
| 6/16  | `LEN`        | ⚙️ function | `functions-text.ts:112` | `text: unknown`                                                |
| 7/16  | `LOWER`      | ⚙️ function | `functions-text.ts:117` | `text: unknown`                                                |
| 8/16  | `UPPER`      | ⚙️ function | `functions-text.ts:122` | `text: unknown`                                                |
| 9/16  | `PROPER`     | ⚙️ function | `functions-text.ts:127` | `text: unknown`                                                |
| 10/16 | `SUBSTITUTE` | ⚙️ function | `functions-text.ts:132` | `—`                                                            |
| 11/16 | `REPLACE`    | ⚙️ function | `functions-text.ts:159` | `—`                                                            |
| 12/16 | `TEXTJOIN`   | ⚙️ function | `functions-text.ts:180` | `delimiter: unknown, ignoreEmpty: unknown, ...args: unknown[]` |
| 13/16 | `EXACT`      | ⚙️ function | `functions-text.ts:189` | `text1: unknown, text2: unknown`                               |
| 14/16 | `REPT`       | ⚙️ function | `functions-text.ts:194` | `text: unknown, numberTimes: unknown`                          |
| 15/16 | `SEARCH`     | ⚙️ function | `functions-text.ts:202` | `findText: unknown, withinText: unknown, startNum: unknown = ` |
| 16/16 | `FIND`       | ⚙️ function | `functions-text.ts:212` | `findText: unknown, withinText: unknown, startNum: unknown = ` |

### 📁 functions.ts

| #     | الاسم               | الType      | File:سطر           | Parameters                                    |
| ----- | ------------------- | ----------- | ------------------ | --------------------------------------------- |
| 1/29  | `FormulaError`      | 🏗️ class    | `functions.ts:44`  | `—`                                           |
| 2/29  | `isFormulaError`    | ⚙️ function | `functions.ts:55`  | `val: unknown`                                |
| 3/29  | `SUM`               | ⚙️ function | `functions.ts:118` | `...args: unknown[]`                          |
| 4/29  | `AVERAGE`           | ⚙️ function | `functions.ts:126` | `...args: unknown[]`                          |
| 5/29  | `COUNT`             | ⚙️ function | `functions.ts:135` | `...args: unknown[]`                          |
| 6/29  | `COUNTA`            | ⚙️ function | `functions.ts:139` | `...args: unknown[]`                          |
| 7/29  | `MIN`               | ⚙️ function | `functions.ts:143` | `...args: unknown[]`                          |
| 8/29  | `MAX`               | ⚙️ function | `functions.ts:151` | `...args: unknown[]`                          |
| 9/29  | `PRODUCT`           | ⚙️ function | `functions.ts:159` | `...args: unknown[]`                          |
| 10/29 | `ABS`               | ⚙️ function | `functions.ts:165` | `value: unknown`                              |
| 11/29 | `ROUND`             | ⚙️ function | `functions.ts:172` | `value: unknown, decimals: unknown = 0`       |
| 12/29 | `FLOOR`             | ⚙️ function | `functions.ts:179` | `value: unknown`                              |
| 13/29 | `CEIL`              | ⚙️ function | `functions.ts:183` | `value: unknown`                              |
| 14/29 | `SQRT`              | ⚙️ function | `functions.ts:187` | `value: unknown`                              |
| 15/29 | `POWER`             | ⚙️ function | `functions.ts:193` | `base: unknown, exp: unknown`                 |
| 16/29 | `MOD`               | ⚙️ function | `functions.ts:197` | `dividend: unknown, divisor: unknown`         |
| 17/29 | `IF`                | ⚙️ function | `functions.ts:205` | `condition: unknown, trueVal: T, falseVal: T` |
| 18/29 | `AND`               | ⚙️ function | `functions.ts:209` | `...args: unknown[]`                          |
| 19/29 | `OR`                | ⚙️ function | `functions.ts:213` | `...args: unknown[]`                          |
| 20/29 | `NOT`               | ⚙️ function | `functions.ts:217` | `value: unknown`                              |
| 21/29 | `CONCAT`            | ⚙️ function | `functions.ts:223` | `...args: unknown[]`                          |
| 22/29 | `CONCATENATE`       | ⚙️ function | `functions.ts:229` | `...args: unknown[]`                          |
| 23/29 | `LEN`               | ⚙️ function | `functions.ts:233` | `value: unknown`                              |
| 24/29 | `UPPER`             | ⚙️ function | `functions.ts:237` | `value: unknown`                              |
| 25/29 | `LOWER`             | ⚙️ function | `functions.ts:241` | `value: unknown`                              |
| 26/29 | `TRIM`              | ⚙️ function | `functions.ts:245` | `value: unknown`                              |
| 27/29 | `NOW`               | ⚙️ function | `functions.ts:251` | `—`                                           |
| 28/29 | `TODAY`             | ⚙️ function | `functions.ts:255` | `—`                                           |
| 29/29 | `BUILTIN_FUNCTIONS` | 📌 constant | `functions.ts:263` | `—`                                           |

### 📁 latex-engine.ts

| #   | الاسم           | الType       | File:سطر              | Parameters |
| --- | --------------- | ------------ | --------------------- | ---------- |
| 1/3 | `MathSymbolMap` | 📐 interface | `latex-engine.ts:32`  | `—`        |
| 2/3 | `LaTeXEngine`   | 🏗️ class     | `latex-engine.ts:36`  | `—`        |
| 3/3 | `latexEngine`   | 📌 constant  | `latex-engine.ts:165` | `—`        |

### 📁 markdown-engine.ts

| #   | الاسم            | الType      | File:سطر                 | Parameters |
| --- | ---------------- | ----------- | ------------------------ | ---------- |
| 1/2 | `MarkdownEngine` | 🏗️ class    | `markdown-engine.ts:34`  | `—`        |
| 2/2 | `markdownEngine` | 📌 constant | `markdown-engine.ts:196` | `—`        |

### 📁 markdown-formula.ts

| #     | الاسم                      | الType       | File:سطر                  | Parameters                                 |
| ----- | -------------------------- | ------------ | ------------------------- | ------------------------------------------ |
| 1/20  | `SimpleCellAddress`        | 📐 interface | `markdown-formula.ts:54`  | `—`                                        |
| 2/20  | `TableCell`                | 📐 interface | `markdown-formula.ts:60`  | `—`                                        |
| 3/20  | `TableContent`             | 📐 interface | `markdown-formula.ts:66`  | `—`                                        |
| 4/20  | `FormulaReturn`            | 📐 interface | `markdown-formula.ts:71`  | `—`                                        |
| 5/20  | `MarkdownReturn`           | 📐 interface | `markdown-formula.ts:78`  | `—`                                        |
| 6/20  | `MarkdownFormulaOptions`   | 📐 interface | `markdown-formula.ts:83`  | `—`                                        |
| 7/20  | `ProcessedMarkdownResult`  | 📐 interface | `markdown-formula.ts:89`  | `—`                                        |
| 8/20  | `MarkdownFormulaStats`     | 📐 interface | `markdown-formula.ts:96`  | `—`                                        |
| 9/20  | `FormulaSearchResult`      | 📐 interface | `markdown-formula.ts:104` | `—`                                        |
| 10/20 | `MouseFormulaSuggestion`   | 📐 interface | `markdown-formula.ts:113` | `—`                                        |
| 11/20 | `FindConsecutiveBlocks`    | ⚙️ function  | `markdown-formula.ts:124` | `array: number[]`                          |
| 12/20 | `GetTableColumns`          | ⚙️ function  | `markdown-formula.ts:150` | `allContent: string[], lineNumber: number` |
| 13/20 | `GetTableContent`          | ⚙️ function  | `markdown-formula.ts:175` | `—`                                        |
| 14/20 | `SplitValidMarkdownTables` | ⚙️ function  | `markdown-formula.ts:209` | `—`                                        |
| 15/20 | `GetFormulaData`           | ⚙️ function  | `markdown-formula.ts:245` | `table: TableContent, sheetID: number      | string` |
| 16/20 | `MarkdownFormula`          | ⚙️ function  | `markdown-formula.ts:287` | `—`                                        |
| 17/20 | `ProcessMarkdownFormulas`  | ⚙️ function  | `markdown-formula.ts:375` | `—`                                        |
| 18/20 | `getMarkdownFormulaStats`  | ⚙️ function  | `markdown-formula.ts:423` | `document: string`                         |
| 19/20 | `searchMarkdownFormulas`   | ⚙️ function  | `markdown-formula.ts:476` | `document: string, query: string`          |
| 20/20 | `suggestFormulaAtMouse`    | ⚙️ function  | `markdown-formula.ts:511` | `—`                                        |

### 📁 parser.ts

| #   | الاسم           | الType      | File:سطر        | Parameters           |
| --- | --------------- | ----------- | --------------- | -------------------- |
| 1/2 | `FormulaParser` | 🏗️ class    | `parser.ts:63`  | `—`                  |
| 2/2 | `parseFormula`  | ⚙️ function | `parser.ts:244` | `expression: string` |

### 📁 tokenizer.ts

| #   | الاسم       | الType       | File:سطر           | Parameters      |
| --- | ----------- | ------------ | ------------------ | --------------- |
| 1/3 | `TokenType` | 🏷️ type      | `tokenizer.ts:32`  | `—`             |
| 2/3 | `Token`     | 📐 interface | `tokenizer.ts:46`  | `—`             |
| 3/3 | `tokenize`  | ⚙️ function  | `tokenizer.ts:214` | `input: string` |

### 📁 dependency.ts

| #   | الاسم                   | الType      | File:سطر            | Parameters                   |
| --- | ----------------------- | ----------- | ------------------- | ---------------------------- |
| 1/4 | `detectCycle`           | ⚙️ function | `dependency.ts:59`  | `graph: DependencyGraphData` |
| 2/4 | `getCircularError`      | ⚙️ function | `dependency.ts:127` | `graph: DependencyGraphData` |
| 3/4 | `topologicalSort`       | ⚙️ function | `dependency.ts:145` | `graph: DependencyGraphData` |
| 4/4 | `getRecalculationOrder` | ⚙️ function | `dependency.ts:202` | `—`                          |

### 📁 orthogonal-router.ts

| #   | الاسم                      | الType      | File:سطر                   | Parameters                                        |
| --- | -------------------------- | ----------- | -------------------------- | ------------------------------------------------- |
| 1/7 | `getNodeAnchorPoint`       | ⚙️ function | `orthogonal-router.ts:36`  | `—`                                               |
| 2/7 | `isSegmentBlocked`         | ⚙️ function | `orthogonal-router.ts:70`  | `p1: Point2D, p2: Point2D, box: AABB, margin = 8` |
| 3/7 | `buildRoutingChannels`     | ⚙️ function | `orthogonal-router.ts:91`  | `—`                                               |
| 4/7 | `routeAStarVisibility`     | ⚙️ function | `orthogonal-router.ts:123` | `—`                                               |
| 5/7 | `simplifyCollinearPoints`  | ⚙️ function | `orthogonal-router.ts:216` | `points: readonly Point2D[]`                      |
| 6/7 | `generateSmoothCurvedPath` | ⚙️ function | `orthogonal-router.ts:236` | `points: readonly Point2D[], radius = 10`         |
| 7/7 | `computeDiagramRoute`      | ⚙️ function | `orthogonal-router.ts:262` | `—`                                               |

### 📁 routing-types.ts

| #     | الاسم                  | الType       | File:سطر              | Parameters |
| ----- | ---------------------- | ------------ | --------------------- | ---------- |
| 1/11  | `NodeShapeType`        | 🏷️ type      | `routing-types.ts:23` | `—`        |
| 2/11  | `NodeRole`             | 🏷️ type      | `routing-types.ts:26` | `—`        |
| 3/11  | `AnchorPosition`       | 🏷️ type      | `routing-types.ts:28` | `—`        |
| 4/11  | `RoutingAlgorithmType` | 🏷️ type      | `routing-types.ts:30` | `—`        |
| 5/11  | `LineStrokeStyle`      | 🏷️ type      | `routing-types.ts:38` | `—`        |
| 6/11  | `ArrowheadType`        | 🏷️ type      | `routing-types.ts:39` | `—`        |
| 7/11  | `DiagramNode`          | 📐 interface | `routing-types.ts:41` | `—`        |
| 8/11  | `DiagramConnector`     | 📐 interface | `routing-types.ts:50` | `—`        |
| 9/11  | `AdvancedRouteOptions` | 📐 interface | `routing-types.ts:64` | `—`        |
| 10/11 | `RouteTelemetry`       | 📐 interface | `routing-types.ts:74` | `—`        |
| 11/11 | `ComputedRoute`        | 📐 interface | `routing-types.ts:84` | `—`        |

### 📁 routing.ts

| #   | الاسم                 | الType       | File:سطر        | Parameters                          |
| --- | --------------------- | ------------ | --------------- | ----------------------------------- |
| 1/3 | `RouteOptions`        | 📐 interface | `routing.ts:27` | `—`                                 |
| 2/3 | `pointInBox`          | ⚙️ function  | `routing.ts:33` | `p: Point2D, box: AABB, margin = 0` |
| 3/3 | `findOrthogonalRoute` | ⚙️ function  | `routing.ts:42` | `—`                                 |

### 📁 hlookup.ts

| #   | الاسم             | الType      | File:سطر         | Parameters                                      |
| --- | ----------------- | ----------- | ---------------- | ----------------------------------------------- |
| 1/4 | `HLOOKUP`         | ⚙️ function | `hlookup.ts:55`  | `—`                                             |
| 2/4 | `compareValues`   | ⚙️ function | `hlookup.ts:98`  | `a: unknown, b: unknown`                        |
| 3/4 | `exactSearchRow`  | ⚙️ function | `hlookup.ts:128` | `row: readonly unknown[], lookupValue: unknown` |
| 4/4 | `binarySearchRow` | ⚙️ function | `hlookup.ts:142` | `row: readonly unknown[], lookupValue: unknown` |

### 📁 recorder.ts

| #   | الاسم           | الType   | File:سطر         | Parameters |
| --- | --------------- | -------- | ---------------- | ---------- |
| 1/1 | `MacroRecorder` | 🏗️ class | `recorder.ts:37` | `—`        |

### 📁 runner.ts

| #   | الاسم               | الType   | File:سطر       | Parameters |
| --- | ------------------- | -------- | -------------- | ---------- |
| 1/2 | `CommandDispatcher` | 🏷️ type  | `runner.ts:32` | `—`        |
| 2/2 | `MacroRunner`       | 🏗️ class | `runner.ts:38` | `—`        |

### 📁 find-replace-engine.ts

| #   | الاسم                | الType      | File:سطر                     | Parameters    |
| --- | -------------------- | ----------- | ---------------------------- | ------------- |
| 1/4 | `escapeRegExp`       | ⚙️ function | `find-replace-engine.ts:43`  | `str: string` |
| 2/4 | `findMatches`        | ⚙️ function | `find-replace-engine.ts:50`  | `—`           |
| 3/4 | `replaceMatchInText` | ⚙️ function | `find-replace-engine.ts:115` | `—`           |
| 4/4 | `replaceAllInText`   | ⚙️ function | `find-replace-engine.ts:129` | `—`           |

### 📁 context.ts

| #   | الاسم                     | الType       | File:سطر        | Parameters                                       |
| --- | ------------------------- | ------------ | --------------- | ------------------------------------------------ |
| 1/5 | `SimulationContext`       | 📐 interface | `context.ts:25` | `—`                                              |
| 2/5 | `createSimulationContext` | ⚙️ function  | `context.ts:32` | `—`                                              |
| 3/5 | `moveCursor`              | ⚙️ function  | `context.ts:42` | `ctx: SimulationContext, dx: number, dy: number` |
| 4/5 | `selectRange`             | ⚙️ function  | `context.ts:52` | `ctx: SimulationContext, range: string`          |
| 5/5 | `setFormula`              | ⚙️ function  | `context.ts:56` | `ctx: SimulationContext, formula: string`        |

### 📁 simulator.ts

| #   | الاسم              | الType      | File:سطر          | Parameters |
| --- | ------------------ | ----------- | ----------------- | ---------- |
| 1/3 | `SimulationAction` | 🏷️ type     | `simulator.ts:27` | `—`        |
| 2/3 | `simulate`         | ⚙️ function | `simulator.ts:43` | `—`        |
| 3/3 | `simulateSingle`   | ⚙️ function | `simulator.ts:54` | `—`        |

### 📁 mergesort.ts

| #   | الاسم                         | الType       | File:سطر          | Parameters                              |
| --- | ----------------------------- | ------------ | ----------------- | --------------------------------------- |
| 1/6 | `CellValue`                   | 🏷️ type      | `mergesort.ts:12` | `—`                                     |
| 2/6 | `compareCellValues`           | ⚙️ function  | `mergesort.ts:14` | `a: CellValue, b: CellValue`            |
| 3/6 | `merge`                       | ⚙️ function  | `mergesort.ts:28` | `src, aux, lo, mid, hi, cmp` (private)  |
| 4/6 | `bottomUpMergeSort`           | ⚙️ function  | `mergesort.ts:54` | `items: readonly T[], comparator?`      |
| 5/6 | `ColumnSortSpec`              | 📐 interface | `mergesort.ts:75` | `—`                                     |
| 6/6 | `createTableColumnComparator` | ⚙️ function  | `mergesort.ts:80` | `specs: ColumnSortSpec[]`               |

### 📁 alignment-engine.ts

| #   | الاسم              | الType       | File:سطر                 | Parameters |
| --- | ------------------ | ------------ | ------------------------ | ---------- |
| 1/5 | `AlignableItem`    | 📐 interface | `alignment-engine.ts:23` | `—`        |
| 2/5 | `AlignmentType`    | 🏷️ type      | `alignment-engine.ts:31` | `—`        |
| 3/5 | `DistributionType` | 🏷️ type      | `alignment-engine.ts:34` | `—`        |
| 4/5 | `AnchorPoint`      | 📐 interface | `alignment-engine.ts:36` | `—`        |
| 5/5 | `AlignmentEngine`  | 🏗️ class     | `alignment-engine.ts:43` | `—`        |

### 📁 artboard-types.ts

| #   | الاسم                    | الType       | File:سطر               | Parameters |
| --- | ------------------------ | ------------ | ---------------------- | ---------- |
| 1/8 | `ElementType`            | 🏷️ type      | `artboard-types.ts:17` | `—`        |
| 2/8 | `DomainType`             | 🏷️ type      | `artboard-types.ts:28` | `—`        |
| 3/8 | `TextScriptDirection`    | 🏷️ type      | `artboard-types.ts:30` | `—`        |
| 4/8 | `AlignmentGuideLine`     | 📐 interface | `artboard-types.ts:32` | `—`        |
| 5/8 | `StateHistoryEntry`      | 📐 interface | `artboard-types.ts:40` | `—`        |
| 6/8 | `SimulatedCanvasElement` | 📐 interface | `artboard-types.ts:46` | `—`        |
| 7/8 | `CanvasBoundingBox`      | 📐 interface | `artboard-types.ts:65` | `—`        |
| 8/8 | `MarqueeSelectionState`  | 📐 interface | `artboard-types.ts:76` | `—`        |

### 📁 auto-layout-engine.ts

| #   | الاسم                 | الType       | File:سطر                   | Parameters |
| --- | --------------------- | ------------ | -------------------------- | ---------- |
| 1/4 | `LayoutNode`          | 📐 interface | `auto-layout-engine.ts:27` | `—`        |
| 2/4 | `LayoutContainer`     | 📐 interface | `auto-layout-engine.ts:36` | `—`        |
| 3/4 | `LayoutResult`        | 📐 interface | `auto-layout-engine.ts:46` | `—`        |
| 4/4 | `calculateAutoLayout` | ⚙️ function  | `auto-layout-engine.ts:54` | `—`        |

### 📁 bezier-engine.ts

| #     | الاسم                    | الType       | File:سطر               | Parameters                                  |
| ----- | ------------------------ | ------------ | ---------------------- | ------------------------------------------- |
| 1/11  | `BezierPoint`            | 📐 interface | `bezier-engine.ts:42`  | `—`                                         |
| 2/11  | `CubicBezierCurve`       | 📐 interface | `bezier-engine.ts:47`  | `—`                                         |
| 3/11  | `QuadraticBezierCurve`   | 📐 interface | `bezier-engine.ts:54`  | `—`                                         |
| 4/11  | `evaluateCubic`          | ⚙️ function  | `bezier-engine.ts:69`  | `curve: CubicBezierCurve, tRaw: number`     |
| 5/11  | `evaluateQuadratic`      | ⚙️ function  | `bezier-engine.ts:86`  | `curve: QuadraticBezierCurve, tRaw: number` |
| 6/11  | `cubicTangent`           | ⚙️ function  | `bezier-engine.ts:101` | `curve: CubicBezierCurve, tRaw: number`     |
| 7/11  | `subdivideCubic`         | ⚙️ function  | `bezier-engine.ts:122` | `—`                                         |
| 8/11  | `approximateCubicLength` | ⚙️ function  | `bezier-engine.ts:150` | `curve: CubicBezierCurve, segments = 24`    |
| 9/11  | `getCubicBounds`         | ⚙️ function  | `bezier-engine.ts:191` | `curve: CubicBezierCurve`                   |
| 10/11 | `cubicToSvgPath`         | ⚙️ function  | `bezier-engine.ts:223` | `curve: CubicBezierCurve`                   |
| 11/11 | `toBezierPoint`          | ⚙️ function  | `bezier-engine.ts:230` | `coord: LogicalCoordinate`                  |

### 📁 boolean-ops.ts

| #   | الاسم                     | الType       | File:سطر            | Parameters |
| --- | ------------------------- | ------------ | ------------------- | ---------- |
| 1/4 | `BooleanOpType`           | 🏷️ type      | `boolean-ops.ts:24` | `—`        |
| 2/4 | `GeometricShapeBounds`    | 📐 interface | `boolean-ops.ts:26` | `—`        |
| 3/4 | `BooleanResult`           | 📐 interface | `boolean-ops.ts:35` | `—`        |
| 4/4 | `BooleanOperationsEngine` | 🏗️ class     | `boolean-ops.ts:46` | `—`        |

### 📁 collision.ts

| #     | الاسم                  | الType       | File:سطر           | Parameters                                |
| ----- | ---------------------- | ------------ | ------------------ | ----------------------------------------- |
| 1/15  | `Rect`                 | 📐 interface | `collision.ts:88`  | `—`                                       |
| 2/15  | `Point`                | 📐 interface | `collision.ts:96`  | `—`                                       |
| 3/15  | `SnappableElement`     | 📐 interface | `collision.ts:102` | `—`                                       |
| 4/15  | `SnapResult`           | 📐 interface | `collision.ts:108` | `—`                                       |
| 5/15  | `clamp`                | ⚙️ function  | `collision.ts:115` | `value: number, min: number, max: number` |
| 6/15  | `isValidPoint`         | ⚙️ function  | `collision.ts:120` | `p: unknown`                              |
| 7/15  | `isValidRect`          | ⚙️ function  | `collision.ts:132` | `r: unknown`                              |
| 8/15  | `validateRect`         | ⚙️ function  | `collision.ts:150` | `r: Rect, name = 'rect'`                  |
| 9/15  | `validatePoint`        | ⚙️ function  | `collision.ts:172` | `p: Point`                                |
| 10/15 | `checkCollision`       | ⚙️ function  | `collision.ts:183` | `a: Rect, b: Rect`                        |
| 11/15 | `getIntersectionArea`  | ⚙️ function  | `collision.ts:195` | `a: Rect, b: Rect`                        |
| 12/15 | `getOverlapRatio`      | ⚙️ function  | `collision.ts:210` | `a: Rect, b: Rect`                        |
| 13/15 | `isPointInRect`        | ⚙️ function  | `collision.ts:223` | `point: Point, rect: Rect`                |
| 14/15 | `distanceToRect`       | ⚙️ function  | `collision.ts:239` | `point: Point, rect: Rect`                |
| 15/15 | `snapToNearestElement` | ⚙️ function  | `collision.ts:301` | `—`                                       |

### 📁 commands.ts

| #     | الاسم                 | الType       | File:سطر          | Parameters                                       |
| ----- | --------------------- | ------------ | ----------------- | ------------------------------------------------ |
| 1/16  | `SpatialOp`           | 📌 constant  | `commands.ts:58`  | `—`                                              |
| 2/16  | `SpatialOpValue`      | 🏷️ type      | `commands.ts:66`  | `—`                                              |
| 3/16  | `MoveCommand`         | 📐 interface | `commands.ts:68`  | `—`                                              |
| 4/16  | `ResizeCommand`       | 📐 interface | `commands.ts:75`  | `—`                                              |
| 5/16  | `SelectCommand`       | 📐 interface | `commands.ts:82`  | `—`                                              |
| 6/16  | `DeleteCommand`       | 📐 interface | `commands.ts:88`  | `—`                                              |
| 7/16  | `CreateCommand`       | 📐 interface | `commands.ts:93`  | `—`                                              |
| 8/16  | `SpatialCommand`      | 🏷️ type      | `commands.ts:100` | `—`                                              |
| 9/16  | `createMoveCommand`   | ⚙️ function  | `commands.ts:133` | `—`                                              |
| 10/16 | `createResizeCommand` | ⚙️ function  | `commands.ts:142` | `—`                                              |
| 11/16 | `createSelectCommand` | ⚙️ function  | `commands.ts:152` | `—`                                              |
| 12/16 | `createDeleteCommand` | ⚙️ function  | `commands.ts:165` | `targetIds: readonly string[]`                   |
| 13/16 | `createCreateCommand` | ⚙️ function  | `commands.ts:172` | `—`                                              |
| 14/16 | `MoveDelta`           | 🏷️ type      | `commands.ts:191` | `—`                                              |
| 15/16 | `computeMoveDelta`    | ⚙️ function  | `commands.ts:195` | `from: SpatialCoordinate, to: SpatialCoordinate` |
| 16/16 | `toBoundingBox`       | ⚙️ function  | `commands.ts:215` | `cmd: ResizeCommand`                             |

### 📁 connector-routing.ts

| #   | الاسم                      | الType       | File:سطر                   | Parameters                         |
| --- | -------------------------- | ------------ | -------------------------- | ---------------------------------- |
| 1/8 | `PortSide`                 | 🏷️ type      | `connector-routing.ts:41`  | `—`                                |
| 2/8 | `ConnectorPort`            | 📐 interface | `connector-routing.ts:43`  | `—`                                |
| 3/8 | `ConnectorRoute`           | 📐 interface | `connector-routing.ts:49`  | `—`                                |
| 4/8 | `getPortPosition`          | ⚙️ function  | `connector-routing.ts:59`  | `box: BoundingBox, side: PortSide` |
| 5/8 | `getOptimalPorts`          | ⚙️ function  | `connector-routing.ts:90`  | `—`                                |
| 6/8 | `routeOrthogonalConnector` | ⚙️ function  | `connector-routing.ts:127` | `—`                                |
| 7/8 | `routeCurvedConnector`     | ⚙️ function  | `connector-routing.ts:173` | `—`                                |
| 8/8 | `computeArrowhead`         | ⚙️ function  | `connector-routing.ts:203` | `—`                                |

### 📁 dynamic-guide-lines.ts

| #   | الاسم                       | الType       | File:سطر                    | Parameters |
| --- | --------------------------- | ------------ | --------------------------- | ---------- |
| 1/4 | `DynamicGuide`              | 📐 interface | `dynamic-guide-lines.ts:13` | `—`        |
| 2/4 | `MeasurementLabel`          | 📐 interface | `dynamic-guide-lines.ts:23` | `—`        |
| 3/4 | `generateDynamicGuides`     | ⚙️ function  | `dynamic-guide-lines.ts:44` | `—`        |
| 4/4 | `generateMeasurementLabels` | ⚙️ function  | `dynamic-guide-lines.ts:85` | `—`        |

### 📁 mapper.ts

| #     | الاسم                  | الType       | File:سطر        | Parameters                                                  |
| ----- | ---------------------- | ------------ | --------------- | ----------------------------------------------------------- |
| 1/17  | `PIXELS_PER_INCH`      | 📌 constant  | `mapper.ts:77`  | `—`                                                         |
| 2/17  | `PIXELS_PER_CM`        | 📌 constant  | `mapper.ts:79`  | `—`                                                         |
| 3/17  | `PIXELS_PER_MM`        | 📌 constant  | `mapper.ts:81`  | `—`                                                         |
| 4/17  | `PIXELS_PER_PT`        | 📌 constant  | `mapper.ts:83`  | `—`                                                         |
| 5/17  | `RawMouseCoords`       | 📐 interface | `mapper.ts:90`  | `—`                                                         |
| 6/17  | `ViewportConfig`       | 📐 interface | `mapper.ts:96`  | `—`                                                         |
| 7/17  | `GridMapperConfig`     | 📐 interface | `mapper.ts:108` | `—`                                                         |
| 8/17  | `MapperConfig`         | 📐 interface | `mapper.ts:118` | `—`                                                         |
| 9/17  | `OfficeDomain`         | 📌 constant  | `mapper.ts:125` | `—`                                                         |
| 10/17 | `OfficeDomainValue`    | 🏷️ type      | `mapper.ts:132` | `—`                                                         |
| 11/17 | `unitToPx`             | ⚙️ function  | `mapper.ts:160` | `value: number, unit: LengthUnitValue`                      |
| 12/17 | `pxToUnit`             | ⚙️ function  | `mapper.ts:165` | `px: number, unit: LengthUnitValue`                         |
| 13/17 | `convertLength`        | ⚙️ function  | `mapper.ts:170` | `value: number, from: LengthUnitValue, to: LengthUnitValue` |
| 14/17 | `translateToLogical`   | ⚙️ function  | `mapper.ts:195` | `—`                                                         |
| 15/17 | `translateToGrid`      | ⚙️ function  | `mapper.ts:221` | `—`                                                         |
| 16/17 | `translateCoords`      | ⚙️ function  | `mapper.ts:254` | `—`                                                         |
| 17/17 | `getDomainDefaultUnit` | ⚙️ function  | `mapper.ts:280` | `domain: OfficeDomainValue`                                 |

### 📁 matrix-2d.ts

| #     | الاسم                         | الType       | File:سطر           | Parameters                                          |
| ----- | ----------------------------- | ------------ | ------------------ | --------------------------------------------------- |
| 1/11  | `Matrix2D`                    | 📐 interface | `matrix-2d.ts:49`  | `—`                                                 |
| 2/11  | `createIdentityMatrix`        | ⚙️ function  | `matrix-2d.ts:58`  | `—`                                                 |
| 3/11  | `createTranslationMatrix`     | ⚙️ function  | `matrix-2d.ts:62`  | `tx: number, ty: number`                            |
| 4/11  | `createScalingMatrix`         | ⚙️ function  | `matrix-2d.ts:66`  | `sx: number, sy: number, pivot?: LogicalCoordinate` |
| 5/11  | `createRotationMatrix`        | ⚙️ function  | `matrix-2d.ts:76`  | `radians: number, pivot?: LogicalCoordinate`        |
| 6/11  | `createRotationDegreesMatrix` | ⚙️ function  | `matrix-2d.ts:88`  | `degrees: number, pivot?: LogicalCoordinate`        |
| 7/11  | `multiplyMatrices`            | ⚙️ function  | `matrix-2d.ts:95`  | `m1: Matrix2D, m2: Matrix2D`                        |
| 8/11  | `invertMatrix`                | ⚙️ function  | `matrix-2d.ts:109` | `m: Matrix2D`                                       |
| 9/11  | `transformPointWithMatrix`    | ⚙️ function  | `matrix-2d.ts:129` | `m: Matrix2D, p: LogicalCoordinate`                 |
| 10/11 | `transformBoxWithMatrix`      | ⚙️ function  | `matrix-2d.ts:141` | `m: Matrix2D, box: BoundingBox`                     |
| 11/11 | `toCssMatrixString`           | ⚙️ function  | `matrix-2d.ts:176` | `m: Matrix2D`                                       |

### 📁 mouse-diagnostics.ts

| #   | الاسم                          | الType       | File:سطر                   | Parameters             |
| --- | ------------------------------ | ------------ | -------------------------- | ---------------------- |
| 1/6 | `Point2D`                      | 📐 interface | `mouse-diagnostics.ts:34`  | `—`                    |
| 2/6 | `RelativeMouseOffsetResult`    | 📐 interface | `mouse-diagnostics.ts:39`  | `—`                    |
| 3/6 | `MouseDiagnosticsOptions`      | 📐 interface | `mouse-diagnostics.ts:50`  | `—`                    |
| 4/6 | `detectRtl`                    | ⚙️ function  | `mouse-diagnostics.ts:70`  | `element: HTMLElement` |
| 5/6 | `extractCssScale`              | ⚙️ function  | `mouse-diagnostics.ts:76`  | `element: HTMLElement` |
| 6/6 | `calculateRelativeMouseOffset` | ⚙️ function  | `mouse-diagnostics.ts:116` | `—`                    |

### 📁 smart-guides.ts

| #   | الاسم                     | الType       | File:سطر              | Parameters               |
| --- | ------------------------- | ------------ | --------------------- | ------------------------ |
| 1/5 | `ReferenceLine`           | 📐 interface | `smart-guides.ts:48`  | `—`                      |
| 2/5 | `DistanceBadge`           | 📐 interface | `smart-guides.ts:58`  | `—`                      |
| 3/5 | `generateReferenceLines`  | ⚙️ function  | `smart-guides.ts:73`  | `—`                      |
| 4/5 | `calculateDistanceBadges` | ⚙️ function  | `smart-guides.ts:140` | `—`                      |
| 5/5 | `filterDuplicateGuides`   | ⚙️ function  | `smart-guides.ts:216` | `lines: ReferenceLine[]` |

### 📁 smart-rtl-alignment.ts

| #   | الاسم                   | الType      | File:سطر                    | Parameters                   |
| --- | ----------------------- | ----------- | --------------------------- | ---------------------------- |
| 1/3 | `detectTextDirection`   | ⚙️ function | `smart-rtl-alignment.ts:17` | `text?: string`              |
| 2/3 | `getElementDirection`   | ⚙️ function | `smart-rtl-alignment.ts:22` | `el: SimulatedCanvasElement` |
| 3/3 | `smartAlignByDirection` | ⚙️ function | `smart-rtl-alignment.ts:28` | `—`                          |

### 📁 smart-snap-engine.ts

| #   | الاسم       | الType      | File:سطر                  | Parameters |
| --- | ----------- | ----------- | ------------------------- | ---------- |
| 1/1 | `smartSnap` | ⚙️ function | `smart-snap-engine.ts:32` | `—`        |

### 📁 spatial-drag-algorithms.ts

| #     | الاسم                           | الType      | File:سطر                         | Parameters                                          |
| ----- | ------------------------------- | ----------- | -------------------------------- | --------------------------------------------------- |
| 1/18  | `detectTextScriptDirection`     | ⚙️ function | `spatial-drag-algorithms.ts:37`  | `text?: string`                                     |
| 2/18  | `getElementScriptDirection`     | ⚙️ function | `spatial-drag-algorithms.ts:46`  | `element: SimulatedCanvasElement`                   |
| 3/18  | `smartAlignByScript`            | ⚙️ function | `spatial-drag-algorithms.ts:66`  | `—`                                                 |
| 4/18  | `calculateSmartSnapAndGuides`   | ⚙️ function | `spatial-drag-algorithms.ts:102` | `—`                                                 |
| 5/18  | `pushHistoryState`              | ⚙️ function | `spatial-drag-algorithms.ts:209` | `—`                                                 |
| 6/18  | `snapCoordinate`                | ⚙️ function | `spatial-drag-algorithms.ts:241` | `value: number, gridSize: number, enabled: boolean` |
| 7/18  | `calculateGroupBounds`          | ⚙️ function | `spatial-drag-algorithms.ts:249` | `—`                                                 |
| 8/18  | `clampWithinCanvas`             | ⚙️ function | `spatial-drag-algorithms.ts:286` | `—`                                                 |
| 9/18  | `applyDeltaToSelection`         | ⚙️ function | `spatial-drag-algorithms.ts:302` | `—`                                                 |
| 10/18 | `toggleElementSelection`        | ⚙️ function | `spatial-drag-algorithms.ts:341` | `—`                                                 |
| 11/18 | `getMarqueeIntersectingIds`     | ⚙️ function | `spatial-drag-algorithms.ts:362` | `—`                                                 |
| 12/18 | `SpatialAlignmentType`          | 🏷️ type     | `spatial-drag-algorithms.ts:387` | `—`                                                 |
| 13/18 | `alignSelectedElements`         | ⚙️ function | `spatial-drag-algorithms.ts:398` | `—`                                                 |
| 14/18 | `SpatialDistributionType`       | 🏷️ type     | `spatial-drag-algorithms.ts:441` | `—`                                                 |
| 15/18 | `distributeSelectedElements`    | ⚙️ function | `spatial-drag-algorithms.ts:446` | `—`                                                 |
| 16/18 | `rotateSelectedElements`        | ⚙️ function | `spatial-drag-algorithms.ts:502` | `—`                                                 |
| 17/18 | `reorderLayers`                 | ⚙️ function | `spatial-drag-algorithms.ts:518` | `—`                                                 |
| 18/18 | `createInitialArtboardElements` | ⚙️ function | `spatial-drag-algorithms.ts:545` | `—`                                                 |

### 📁 transformer.ts

| #     | الاسم                       | الType       | File:سطر             | Parameters                                            |
| ----- | --------------------------- | ------------ | -------------------- | ----------------------------------------------------- |
| 1/25  | `Point2D`                   | 📐 interface | `transformer.ts:61`  | `—`                                                   |
| 2/25  | `TransformMatrix`           | 📐 interface | `transformer.ts:67`  | `—`                                                   |
| 3/25  | `SnapConfig`                | 📐 interface | `transformer.ts:77`  | `—`                                                   |
| 4/25  | `BBox`                      | 📐 interface | `transformer.ts:84`  | `—`                                                   |
| 5/25  | `HandlePosition`            | 🏷️ type      | `transformer.ts:92`  | `—`                                                   |
| 6/25  | `ResizeHandle`              | 📐 interface | `transformer.ts:102` | `—`                                                   |
| 7/25  | `BBoxEdges`                 | 📐 interface | `transformer.ts:108` | `—`                                                   |
| 8/25  | `applyLinearTransform`      | ⚙️ function  | `transformer.ts:129` | `pt: Point2D, m: TransformMatrix`                     |
| 9/25  | `translateMatrix`           | ⚙️ function  | `transformer.ts:137` | `tx: number, ty: number`                              |
| 10/25 | `rotationMatrix`            | ⚙️ function  | `transformer.ts:142` | `angleRad: number`                                    |
| 11/25 | `rotationAroundPointMatrix` | ⚙️ function  | `transformer.ts:149` | `—`                                                   |
| 12/25 | `screenToDocument`          | ⚙️ function  | `transformer.ts:172` | `—`                                                   |
| 13/25 | `documentToScreen`          | ⚙️ function  | `transformer.ts:189` | `—`                                                   |
| 14/25 | `snapToGrid`                | ⚙️ function  | `transformer.ts:205` | `value: number, step: number`                         |
| 15/25 | `snapPointToGrid`           | ⚙️ function  | `transformer.ts:211` | `pt: Point2D, snap: SnapConfig`                       |
| 16/25 | `rotatePoint`               | ⚙️ function  | `transformer.ts:222` | `pt: Point2D, angleRad: number, center: Point2D`      |
| 17/25 | `radToDeg`                  | ⚙️ function  | `transformer.ts:228` | `rad: number`                                         |
| 18/25 | `degToRad`                  | ⚙️ function  | `transformer.ts:233` | `deg: number`                                         |
| 19/25 | `getBoundingBox`            | ⚙️ function  | `transformer.ts:240` | `points: readonly Point2D[]`                          |
| 20/25 | `getRotatedBoundingBox`     | ⚙️ function  | `transformer.ts:259` | `corners: readonly Point2D[], angleRad: number`       |
| 21/25 | `getBBoxEdges`              | ⚙️ function  | `transformer.ts:269` | `bbox: BBox`                                          |
| 22/25 | `getResizeHandles`          | ⚙️ function  | `transformer.ts:279` | `bbox: BBox`                                          |
| 23/25 | `distance`                  | ⚙️ function  | `transformer.ts:296` | `a: Point2D, b: Point2D`                              |
| 24/25 | `createBBox`                | ⚙️ function  | `transformer.ts:301` | `x: number, y: number, width: number, height: number` |
| 25/25 | `bboxFromLogical`           | ⚙️ function  | `transformer.ts:306` | `—`                                                   |

### 📁 vector-path.ts

| #     | الاسم                 | الType       | File:سطر             | Parameters                                           |
| ----- | --------------------- | ------------ | -------------------- | ---------------------------------------------------- |
| 1/13  | `VertexType`          | 🏷️ type      | `vector-path.ts:57`  | `—`                                                  |
| 2/13  | `PathVertex`          | 📐 interface | `vector-path.ts:59`  | `—`                                                  |
| 3/13  | `VectorPathData`      | 📐 interface | `vector-path.ts:68`  | `—`                                                  |
| 4/13  | `createVectorPath`    | ⚙️ function  | `vector-path.ts:105` | `—`                                                  |
| 5/13  | `addVertex`           | ⚙️ function  | `vector-path.ts:124` | `path: VectorPathData, point: Point, index?: number` |
| 6/13  | `removeVertex`        | ⚙️ function  | `vector-path.ts:143` | `path: VectorPathData, vertexId: string`             |
| 7/13  | `updateVertex`        | ⚙️ function  | `vector-path.ts:152` | `—`                                                  |
| 8/13  | `toggleVertexType`    | ⚙️ function  | `vector-path.ts:179` | `path: VectorPathData, vertexId: string`             |
| 9/13  | `smoothPath`          | ⚙️ function  | `vector-path.ts:202` | `path: VectorPathData, tension: number = 0.3`        |
| 10/13 | `simplifyPath`        | ⚙️ function  | `vector-path.ts:243` | `path: VectorPathData, tolerance: number = 2`        |
| 11/13 | `vectorPathToSvgD`    | ⚙️ function  | `vector-path.ts:299` | `path: VectorPathData`                               |
| 12/13 | `svgDToVectorPath`    | ⚙️ function  | `vector-path.ts:335` | `id: string, d: string`                              |
| 13/13 | `getVectorPathBounds` | ⚙️ function  | `vector-path.ts:408` | `path: VectorPathData`                               |

### 📁 arabic-utils.ts

| #   | الاسم                   | الType      | File:سطر             | Parameters                      |
| --- | ----------------------- | ----------- | -------------------- | ------------------------------- |
| 1/4 | `stripArabicDiacritics` | ⚙️ function | `arabic-utils.ts:26` | `text: string`                  |
| 2/4 | `normalizeArabicText`   | ⚙️ function | `arabic-utils.ts:37` | `text: string`                  |
| 3/4 | `compareArabicStrings`  | ⚙️ function | `arabic-utils.ts:66` | `a: string, b: string`          |
| 4/4 | `arabicIncludes`        | ⚙️ function | `arabic-utils.ts:82` | `source: string, query: string` |

### 📁 sample-data.ts

| #   | الاسم                  | الType      | File:سطر            | Parameters |
| --- | ---------------------- | ----------- | ------------------- | ---------- |
| 1/1 | `INITIAL_CITY_STREETS` | 📌 constant | `sample-data.ts:20` | `—`        |

### 📁 search-engine.ts

| #   | الاسم                      | الType      | File:سطر               | Parameters |
| --- | -------------------------- | ----------- | ---------------------- | ---------- |
| 1/3 | `queryCityStreets`         | ⚙️ function | `search-engine.ts:31`  | `—`        |
| 2/3 | `sortCityStreets`          | ⚙️ function | `search-engine.ts:103` | `—`        |
| 3/3 | `buildStreetBranchingTree` | ⚙️ function | `search-engine.ts:136` | `—`        |

### 📁 similarity.ts

| #   | الاسم                          | الType      | File:سطر            | Parameters               |
| --- | ------------------------------ | ----------- | ------------------- | ------------------------ |
| 1/4 | `calculateLevenshteinDistance` | ⚙️ function | `similarity.ts:30`  | `s1: string, s2: string` |
| 2/4 | `calculateStringSimilarity`    | ⚙️ function | `similarity.ts:63`  | `s1: string, s2: string` |
| 3/4 | `analyzeDuplicateStreetNames`  | ⚙️ function | `similarity.ts:80`  | `—`                      |
| 4/4 | `findSimilarStreetPairs`       | ⚙️ function | `similarity.ts:127` | `—`                      |

### 📁 disjoint-set.ts

| #   | الاسم              | الType       | File:سطر             | Parameters |
| --- | ------------------ | ------------ | -------------------- | ---------- |
| 1/2 | `MergedCellBounds` | 📐 interface | `disjoint-set.ts:41` | `—`        |
| 2/2 | `DisjointSet`      | 🏗️ class     | `disjoint-set.ts:52` | `—`        |

### 📁 llrb.ts

| #   | الاسم           | الType       | File:سطر     | Parameters |
| --- | --------------- | ------------ | ------------ | ---------- |
| 1/5 | `RED`           | 📌 constant  | `llrb.ts:41` | `—`        |
| 2/5 | `BLACK`         | 📌 constant  | `llrb.ts:42` | `—`        |
| 3/5 | `LLRBNode`      | 📐 interface | `llrb.ts:44` | `—`        |
| 4/5 | `KeyComparator` | 🏷️ type      | `llrb.ts:53` | `—`        |
| 5/5 | `LLRBTree`      | 🏗️ class     | `llrb.ts:70` | `—`        |

### 📁 common.ts

| #     | الاسم            | الType       | File:سطر        | Parameters                                      |
| ----- | ---------------- | ------------ | --------------- | ----------------------------------------------- |
| 1/19  | `Point2D`        | 📐 interface | `common.ts:32`  | `—`                                             |
| 2/19  | `BoundingBox`    | 📐 interface | `common.ts:37`  | `—`                                             |
| 3/19  | `VectorMatrix2D` | 📐 interface | `common.ts:50`  | `—`                                             |
| 4/19  | `generateId`     | ⚙️ function  | `common.ts:59`  | `prefix = 'vec'`                                |
| 5/19  | `clamp`          | ⚙️ function  | `common.ts:66`  | `val: number, min: number, max: number`         |
| 6/19  | `degToRad`       | ⚙️ function  | `common.ts:70`  | `degrees: number`                               |
| 7/19  | `radToDeg`       | ⚙️ function  | `common.ts:74`  | `radians: number`                               |
| 8/19  | `normalizeAngle` | ⚙️ function  | `common.ts:78`  | `radians: number`                               |
| 9/19  | `distance`       | ⚙️ function  | `common.ts:83`  | `p1: Point2D, p2: Point2D`                      |
| 10/19 | `angle`          | ⚙️ function  | `common.ts:87`  | `p1: Point2D, p2: Point2D`                      |
| 11/19 | `lerp`           | ⚙️ function  | `common.ts:91`  | `start: number, end: number, t: number`         |
| 12/19 | `lerpPoint`      | ⚙️ function  | `common.ts:95`  | `p1: Point2D, p2: Point2D, t: number`           |
| 13/19 | `rotatePoint`    | ⚙️ function  | `common.ts:99`  | `p: Point2D, center: Point2D, angleRad: number` |
| 14/19 | `getBounds`      | ⚙️ function  | `common.ts:107` | `points: Point2D[]`                             |
| 15/19 | `isPointInBox`   | ⚙️ function  | `common.ts:123` | `p: Point2D, box: BoundingBox, tolerance = 0`   |
| 16/19 | `rectsIntersect` | ⚙️ function  | `common.ts:127` | `r1: BoundingBox, r2: BoundingBox`              |
| 17/19 | `deepClone`      | ⚙️ function  | `common.ts:131` | `obj: T`                                        |
| 18/19 | `debounce`       | ⚙️ function  | `common.ts:139` | `...args: unknown[]`                            |
| 19/19 | `throttle`       | ⚙️ function  | `common.ts:147` | `...args: unknown[]`                            |

### 📁 control-handle-manager.ts

| #   | الاسم                    | الType       | File:سطر                       | Parameters                                                     |
| --- | ------------------------ | ------------ | ------------------------------ | -------------------------------------------------------------- |
| 1/6 | `HandleType`             | 🏷️ type      | `control-handle-manager.ts:16` | `—`                                                            |
| 2/6 | `ControlHandle`          | 📐 interface | `control-handle-manager.ts:18` | `—`                                                            |
| 3/6 | `getTransformHandles`    | ⚙️ function  | `control-handle-manager.ts:39` | `—`                                                            |
| 4/6 | `hitTestHandles`         | ⚙️ function  | `control-handle-manager.ts:61` | `handles: readonly ControlHandle[], point: Point2D, tolerance` |
| 5/6 | `calculateResizeDelta`   | ⚙️ function  | `control-handle-manager.ts:68` | `—`                                                            |
| 6/6 | `calculateRotationAngle` | ⚙️ function  | `control-handle-manager.ts:87` | `center: Point2D, currentPoint: Point2D, snapDeg = 15`         |

### 📁 coordinate-system.ts

| #   | الاسم                     | الType       | File:سطر                   | Parameters |
| --- | ------------------------- | ------------ | -------------------------- | ---------- |
| 1/5 | `Point`                   | 📐 interface | `coordinate-system.ts:27`  | `—`        |
| 2/5 | `Viewport`                | 📐 interface | `coordinate-system.ts:32`  | `—`        |
| 3/5 | `GridConfig`              | 📐 interface | `coordinate-system.ts:38`  | `—`        |
| 4/5 | `CoordinateSystem`        | 🏗️ class     | `coordinate-system.ts:43`  | `—`        |
| 5/5 | `defaultCoordinateSystem` | 📌 constant  | `coordinate-system.ts:118` | `—`        |

### 📁 mouse-algorithms.ts

| #   | الاسم                        | الType       | File:سطر                  | Parameters                                                     |
| --- | ---------------------------- | ------------ | ------------------------- | -------------------------------------------------------------- |
| 1/7 | `stylesObjectToString`       | ⚙️ function  | `mouse-algorithms.ts:27`  | `styles?: Record<string, unknown>`                             |
| 2/7 | `columnSizeToPercentage`     | ⚙️ function  | `mouse-algorithms.ts:38`  | `size = 12`                                                    |
| 3/7 | `calculateNewColumnSize`     | ⚙️ function  | `mouse-algorithms.ts:43`  | `—`                                                            |
| 4/7 | `ResizeState`                | 📐 interface | `mouse-algorithms.ts:56`  | `—`                                                            |
| 5/7 | `calculateResizedDimensions` | ⚙️ function  | `mouse-algorithms.ts:67`  | `—`                                                            |
| 6/7 | `calculateRotationAngle`     | ⚙️ function  | `mouse-algorithms.ts:99`  | `—`                                                            |
| 7/7 | `isPointInPolygon`           | ⚙️ function  | `mouse-algorithms.ts:113` | `point: { x: number; y: number }, polygon: { x: number; y: nu` |

### 📁 ref-line.ts

| #   | الاسم                        | الType       | File:سطر         | Parameters |
| --- | ---------------------------- | ------------ | ---------------- | ---------- |
| 1/4 | `ReferenceLine`              | 📐 interface | `ref-line.ts:15` | `—`        |
| 2/4 | `DistanceBadge`              | 📐 interface | `ref-line.ts:25` | `—`        |
| 3/4 | `calculateAlignmentRefLines` | ⚙️ function  | `ref-line.ts:33` | `—`        |
| 4/4 | `calculateDistanceBadges`    | ⚙️ function  | `ref-line.ts:66` | `—`        |

### 📁 smart-alignment.ts

| #   | الاسم                   | الType       | File:سطر                 | Parameters |
| --- | ----------------------- | ------------ | ------------------------ | ---------- |
| 1/5 | `RectBounds`            | 📐 interface | `smart-alignment.ts:27`  | `—`        |
| 2/5 | `AlignmentGuide`        | 📐 interface | `smart-alignment.ts:35`  | `—`        |
| 3/5 | `AlignmentResult`       | 📐 interface | `smart-alignment.ts:41`  | `—`        |
| 4/5 | `SmartAlignmentSystem`  | 🏗️ class     | `smart-alignment.ts:47`  | `—`        |
| 5/5 | `defaultSmartAlignment` | 📌 constant  | `smart-alignment.ts:102` | `—`        |

### 📁 snap.ts

| #   | الاسم                | الType       | File:سطر     | Parameters                      |
| --- | -------------------- | ------------ | ------------ | ------------------------------- |
| 1/5 | `SnapTarget`         | 📐 interface | `snap.ts:16` | `—`                             |
| 2/5 | `SnapResult`         | 📐 interface | `snap.ts:25` | `—`                             |
| 3/5 | `SnapConfig`         | 📐 interface | `snap.ts:31` | `—`                             |
| 4/5 | `snapPointToGrid`    | ⚙️ function  | `snap.ts:41` | `point: Point2D, gridSize = 10` |
| 5/5 | `calculateSmartSnap` | ⚙️ function  | `snap.ts:67` | `—`                             |

---

## 📦 packages/core

### 📁 artboard.ts

| #     | الاسم                    | الType       | File:سطر          | Parameters |
| ----- | ------------------------ | ------------ | ----------------- | ---------- |
| 1/11  | `ElementType`            | 🏷️ type      | `artboard.ts:24`  | `—`        |
| 2/11  | `DomainType`             | 🏷️ type      | `artboard.ts:35`  | `—`        |
| 3/11  | `TextScriptDirection`    | 🏷️ type      | `artboard.ts:37`  | `—`        |
| 4/11  | `AlignmentGuideLine`     | 📐 interface | `artboard.ts:39`  | `—`        |
| 5/11  | `StateHistoryEntry`      | 📐 interface | `artboard.ts:47`  | `—`        |
| 6/11  | `SimulatedCanvasElement` | 📐 interface | `artboard.ts:53`  | `—`        |
| 7/11  | `CanvasBoundingBox`      | 📐 interface | `artboard.ts:72`  | `—`        |
| 8/11  | `ContextMenuPosition`    | 📐 interface | `artboard.ts:83`  | `—`        |
| 9/11  | `NestedContextMenuItem`  | 📐 interface | `artboard.ts:89`  | `—`        |
| 10/11 | `DragState`              | 📐 interface | `artboard.ts:101` | `—`        |
| 11/11 | `MarqueeSelectionState`  | 📐 interface | `artboard.ts:108` | `—`        |

### 📁 builder.ts

| #     | الاسم            | الType      | File:سطر         | Parameters                                                  |
| ----- | ---------------- | ----------- | ---------------- | ----------------------------------------------------------- |
| 1/22  | `text`           | ⚙️ function | `builder.ts:63`  | `—`                                                         |
| 2/22  | `bold`           | ⚙️ function | `builder.ts:75`  | `content: InlineNode[]`                                     |
| 3/22  | `italic`         | ⚙️ function | `builder.ts:79`  | `content: InlineNode[]`                                     |
| 4/22  | `underline`      | ⚙️ function | `builder.ts:83`  | `content: InlineNode[]`                                     |
| 5/22  | `strikethrough`  | ⚙️ function | `builder.ts:87`  | `content: InlineNode[]`                                     |
| 6/22  | `codeInline`     | ⚙️ function | `builder.ts:91`  | `code: string`                                              |
| 7/22  | `link`           | ⚙️ function | `builder.ts:95`  | `href: string, content: InlineNode[]`                       |
| 8/22  | `mention`        | ⚙️ function | `builder.ts:99`  | `userId: string, label: string`                             |
| 9/22  | `paragraph`      | ⚙️ function | `builder.ts:105` | `content: InlineNode[]`                                     |
| 10/22 | `heading`        | ⚙️ function | `builder.ts:109` | `level: 1                                                   | 2   | 3   | 4   | 5   | 6, content: InlineNode[]` |
| 11/22 | `codeBlock`      | ⚙️ function | `builder.ts:113` | `language: string, code: string`                            |
| 12/22 | `blockquote`     | ⚙️ function | `builder.ts:117` | `content: BlockNode[]`                                      |
| 13/22 | `horizontalRule` | ⚙️ function | `builder.ts:121` | `—`                                                         |
| 14/22 | `image`          | ⚙️ function | `builder.ts:125` | `src: string, alt: string, width?: number, height?: number` |
| 15/22 | `embed`          | ⚙️ function | `builder.ts:129` | `embedType: string, url: string`                            |
| 16/22 | `listItem`       | ⚙️ function | `builder.ts:135` | `content: BlockNode[], nested?: BlockNode[]`                |
| 17/22 | `bulletList`     | ⚙️ function | `builder.ts:139` | `items: ListItemNode[]`                                     |
| 18/22 | `orderedList`    | ⚙️ function | `builder.ts:143` | `items: ListItemNode[]`                                     |
| 19/22 | `tableCell`      | ⚙️ function | `builder.ts:149` | `content: BlockNode[], colspan?: number, rowspan?: number`  |
| 20/22 | `tableRow`       | ⚙️ function | `builder.ts:153` | `cells: TableCellNode[]`                                    |
| 21/22 | `table`          | ⚙️ function | `builder.ts:157` | `rows: TableRowNode[]`                                      |
| 22/22 | `doc`            | ⚙️ function | `builder.ts:163` | `content: BlockNode[]`                                      |

### 📁 schema.ts

| #   | الاسم               | الType       | File:سطر        | Parameters        |
| --- | ------------------- | ------------ | --------------- | ----------------- |
| 1/5 | `NodeSchema`        | 📐 interface | `schema.ts:44`  | `—`               |
| 2/5 | `ALL_SCHEMAS`       | 📌 constant  | `schema.ts:180` | `—`               |
| 3/5 | `getSchema`         | ⚙️ function  | `schema.ts:188` | `type: string`    |
| 4/5 | `validateBlockNode` | ⚙️ function  | `schema.ts:195` | `node: BlockNode` |
| 5/5 | `validateDocument`  | ⚙️ function  | `schema.ts:224` | `doc: DocNode`    |

### 📁 types.ts

| #     | الاسم                   | الType       | File:سطر       | Parameters |
| ----- | ----------------------- | ------------ | -------------- | ---------- |
| 1/42  | `NodeId`                | 🏷️ type      | `types.ts:37`  | `—`        |
| 2/42  | `LogicalPosition`       | 📐 interface | `types.ts:40`  | `—`        |
| 3/42  | `InlineNodeType`        | 🏷️ type      | `types.ts:47`  | `—`        |
| 4/42  | `BlockNodeType`         | 🏷️ type      | `types.ts:51`  | `—`        |
| 5/42  | `MarkType`              | 🏷️ type      | `types.ts:66`  | `—`        |
| 6/42  | `Mark`                  | 📐 interface | `types.ts:69`  | `—`        |
| 7/42  | `TextNode`              | 📐 interface | `types.ts:75`  | `—`        |
| 8/42  | `BoldNode`              | 📐 interface | `types.ts:82`  | `—`        |
| 9/42  | `ItalicNode`            | 📐 interface | `types.ts:88`  | `—`        |
| 10/42 | `UnderlineNode`         | 📐 interface | `types.ts:94`  | `—`        |
| 11/42 | `StrikethroughNode`     | 📐 interface | `types.ts:100` | `—`        |
| 12/42 | `CodeNode`              | 📐 interface | `types.ts:106` | `—`        |
| 13/42 | `LinkNode`              | 📐 interface | `types.ts:112` | `—`        |
| 14/42 | `MentionNode`           | 📐 interface | `types.ts:119` | `—`        |
| 15/42 | `InlineNode`            | 🏷️ type      | `types.ts:127` | `—`        |
| 16/42 | `CodeBlockNode`         | 📐 interface | `types.ts:138` | `—`        |
| 17/42 | `ListItemNode`          | 📐 interface | `types.ts:146` | `—`        |
| 18/42 | `ListNode`              | 📐 interface | `types.ts:153` | `—`        |
| 19/42 | `TableCellNode`         | 📐 interface | `types.ts:161` | `—`        |
| 20/42 | `TableRowNode`          | 📐 interface | `types.ts:169` | `—`        |
| 21/42 | `TableNode`             | 📐 interface | `types.ts:175` | `—`        |
| 22/42 | `ParagraphNode`         | 📐 interface | `types.ts:182` | `—`        |
| 23/42 | `HeadingNode`           | 📐 interface | `types.ts:188` | `—`        |
| 24/42 | `BlockquoteNode`        | 📐 interface | `types.ts:195` | `—`        |
| 25/42 | `HorizontalRuleNode`    | 📐 interface | `types.ts:201` | `—`        |
| 26/42 | `ImageNode`             | 📐 interface | `types.ts:206` | `—`        |
| 27/42 | `EmbedNode`             | 📐 interface | `types.ts:215` | `—`        |
| 28/42 | `BlockNode`             | 🏷️ type      | `types.ts:223` | `—`        |
| 29/42 | `DocNode`               | 📐 interface | `types.ts:238` | `—`        |
| 30/42 | `Node`                  | 🏷️ type      | `types.ts:245` | `—`        |
| 31/42 | `ASTNode`               | 🏷️ type      | `types.ts:246` | `—`        |
| 32/42 | `SearchResult`          | 📐 interface | `types.ts:249` | `—`        |
| 33/42 | `NodeInfo`              | 📐 interface | `types.ts:258` | `—`        |
| 34/42 | `ValidationResult`      | 📐 interface | `types.ts:266` | `—`        |
| 35/42 | `ValidationError`       | 📐 interface | `types.ts:271` | `—`        |
| 36/42 | `KnownDocumentType`     | 🏷️ type      | `types.ts:30`  | `—`        |
| 37/42 | `SupportedFileFormat`   | 🏷️ type      | `types.ts:36`  | `—`        |
| 38/42 | `DocumentType`          | 🏷️ type      | `types.ts:55`  | `—`        |
| 39/42 | `DocumentModel`         | 📐 interface | `types.ts:57`  | `—`        |
| 40/42 | `EditorPluginProps`     | 📐 interface | `types.ts:68`  | `—`        |
| 41/42 | `EditorPlugin`          | 📐 interface | `types.ts:73`  | `—`        |
| 42/42 | `SharedFormattingState` | 📐 interface | `types.ts:86`  | `—`        |

### 📁 math-block.ts

| #   | الاسم                   | الType       | File:سطر           | Parameters             |
| --- | ----------------------- | ------------ | ------------------ | ---------------------- |
| 1/6 | `MathBlockData`         | 📐 interface | `math-block.ts:52` | `—`                    |
| 2/6 | `MathBlockNode`         | 📐 interface | `math-block.ts:56` | `—`                    |
| 3/6 | `createMathBlock`       | ⚙️ function  | `math-block.ts:66` | `id, data?`            |
| 4/6 | `isMathBlock`           | ⚙️ function  | `math-block.ts:82` | `node: unknown`        |
| 5/6 | `formatMathMarkdown`    | ⚙️ function  | `math-block.ts:89` | `node: MathBlockNode`  |
| 6/6 | `hasBalancedDelimiters` | ⚙️ function  | `math-block.ts:96` | `latex: string`        |

### 📁 details-block.ts

| #   | الاسم                   | الType       | File:سطر              | Parameters |
| --- | ----------------------- | ------------ | --------------------- | ---------- |
| 1/4 | `DetailsBlockData`      | 📐 interface | `details-block.ts:55` | `—`        |
| 2/4 | `DetailsBlockNode`      | 📐 interface | `details-block.ts:59` | `—`        |
| 3/4 | `createDetailsBlock`    | ⚙️ function  | `details-block.ts:68` | `id, data?` |
| 4/4 | `formatDetailsMarkdown` | ⚙️ function  | `details-block.ts:92` | `node`     |

### 📁 toc-block.ts

| #   | الاسم               | الType       | File:سطر          | Parameters         |
| --- | ------------------- | ------------ | ----------------- | ------------------ |
| 1/6 | `TocBlockData`      | 📐 interface | `toc-block.ts:53` | `—`                |
| 2/6 | `TocBlockNode`      | 📐 interface | `toc-block.ts:57` | `—`                |
| 3/6 | `TocEntry`          | 📐 interface | `toc-block.ts:61` | `—`                |
| 4/6 | `createTocBlock`    | ⚙️ function  | `toc-block.ts:65` | `id, data?`        |
| 5/6 | `formatTocMarkdown` | ⚙️ function  | `toc-block.ts:90` | `node`             |
| 6/6 | `buildTocEntries`   | ⚙️ function  | `toc-block.ts:97` | `blocks, maxDepth` |

### 📁 svg-icon-block.ts

| #   | الاسم                    | الType       | File:سطر               | Parameters          |
| --- | ------------------------ | ------------ | ---------------------- | ------------------- |
| 1/7 | `SvgIconBlockData`       | 📐 interface | `svg-icon-block.ts:60` | `—`                 |
| 2/7 | `SvgIconBlockNode`       | 📐 interface | `svg-icon-block.ts:64` | `—`                 |
| 3/7 | `createSvgIconBlock`     | ⚙️ function  | `svg-icon-block.ts:78` | `id, data?`         |
| 4/7 | `isSvgIconBlock`         | ⚙️ function  | `svg-icon-block.ts:98` | `node: unknown`     |
| 5/7 | `findIconById`           | ⚙️ function  | `svg-icon-block.ts:105` | `iconId: string`   |
| 6/7 | `resolveIconSvg`         | ⚙️ function  | `svg-icon-block.ts:116` | `node`             |
| 7/7 | `formatSvgIconMarkdown`  | ⚙️ function  | `svg-icon-block.ts:131` | `node`             |

### 📁 html-embed-block.ts

| #   | الName                     | الType       | File:سطر                | Parameters      |
| --- | -------------------------- | ------------ | ----------------------- | --------------- |
| 1/5 | `HtmlEmbedBlockData`       | 📐 interface | `html-embed-block.ts:66` | `—`            |
| 2/5 | `HtmlEmbedBlockNode`       | 📐 interface | `html-embed-block.ts:70` | `—`            |
| 3/5 | `createHtmlEmbedBlock`     | ⚙️ function  | `html-embed-block.ts:80` | `id, data?`    |
| 4/5 | `sanitizeEmbedContent`     | ⚙️ function  | `html-embed-block.ts:107` | `node`        |
| 5/5 | `formatHtmlEmbedMarkdown`  | ⚙️ function  | `html-embed-block.ts:114` | `node`        |

### 📁 code-runner-block.ts

| #   | الName                    | الType       | File:سطر                 | Parameters        |
| --- | ------------------------- | ------------ | ------------------------ | ----------------- |
| 1/7 | `CodeRunnerBlockData`     | 📐 interface | `code-runner-block.ts:66` | `—`              |
| 2/7 | `CodeRunnerBlockNode`     | 📐 interface | `code-runner-block.ts:71` | `—`              |
| 3/7 | `createCodeRunnerBlock`   | ⚙️ function  | `code-runner-block.ts:96` | `id, data?`      |
| 4/7 | `getInteractiveControls`  | ⚙️ function  | `code-runner-block.ts:125` | `node`          |
| 5/7 | `setControlValue`         | ⚙️ function  | `code-runner-block.ts:140` | `node, id, val` |
| 6/7 | `runCodeBlock`            | ⚙️ function  | `code-runner-block.ts:158` | `node`          |
| 7/7 | `formatCodeRunnerMarkdown` | ⚙️ function | `code-runner-block.ts:173` | `node`          |

### 📁 regex-tester-block.ts

| #   | الاسم                   | الType       | File:سطر                  | Parameters    |
| --- | ----------------------- | ------------ | ------------------------- | ------------- |
| 1/5 | `RegexTesterBlockData`  | 📐 interface | `regex-tester-block.ts:52` | `—`          |
| 2/5 | `RegexTesterBlockNode`  | 📐 interface | `regex-tester-block.ts:56` | `—`          |
| 3/5 | `createRegexTesterBlock` | ⚙️ function | `regex-tester-block.ts:84` | `id, data?`  |
| 4/5 | `runRegexTest`          | ⚙️ function  | `regex-tester-block.ts:111` | `node`      |
| 5/5 | `applyRegexPreset`      | ⚙️ function  | `regex-tester-block.ts:124` | `node, id`  |

### 📁 audio-block-block.ts

| #   | الاسم                      | الType       | File:سطر                  | Parameters |
| --- | -------------------------- | ------------ | ------------------------- | ---------- |
| 1/4 | `AudioBlockData`           | 📐 interface | `audio-block-block.ts:18` | `—`        |
| 2/4 | `AudioBlockNode`           | 📐 interface | `audio-block-block.ts:25` | `—`        |
| 3/4 | `AudioBlockToolingProfile` | 📌 constant  | `audio-block-block.ts:31` | `—`        |
| 4/4 | `createAudioBlockNode`     | ⚙️ function  | `audio-block-block.ts:44` | `—`        |

### 📁 code-editor.registry.ts

| #   | الاسم                     | الType      | File:سطر                     | Parameters |
| --- | ------------------------- | ----------- | ---------------------------- | ---------- |
| 1/1 | `CodeEditorRegistryEntry` | 📌 constant | `code-editor.registry.ts:15` | `—`        |

### 📁 code-editor.styles.ts

| #   | الاسم                     | الType      | File:سطر                   | Parameters |
| --- | ------------------------- | ----------- | -------------------------- | ---------- |
| 1/1 | `CodeEditorDefaultStyles` | 📌 constant | `code-editor.styles.ts:16` | `—`        |

### 📁 code-editor.ts

| #   | الاسم                      | الType       | File:سطر            | Parameters |
| --- | -------------------------- | ------------ | ------------------- | ---------- |
| 1/4 | `CodeEditorData`           | 📐 interface | `code-editor.ts:19` | `—`        |
| 2/4 | `CodeEditorBlock`          | 📐 interface | `code-editor.ts:27` | `—`        |
| 3/4 | `CodeEditorToolingProfile` | 📌 constant  | `code-editor.ts:37` | `—`        |
| 4/4 | `createCodeEditorBlock`    | ⚙️ function  | `code-editor.ts:56` | `—`        |

### 📁 contextMenuEngine.ts

| #     | الاسم                     | الType       | File:سطر                   | Parameters                           |
| ----- | ------------------------- | ------------ | -------------------------- | ------------------------------------ |
| 1/16  | `ContextMenuItemType`     | 🏷️ type      | `contextMenuEngine.ts:63`  | `—`                                  |
| 2/16  | `ContextMenuPosition`     | 📐 interface | `contextMenuEngine.ts:65`  | `—`                                  |
| 3/16  | `ContextMenuContext`      | 📐 interface | `contextMenuEngine.ts:70`  | `—`                                  |
| 4/16  | `DynamicValue`            | 🏷️ type      | `contextMenuEngine.ts:80`  | `—`                                  |
| 5/16  | `BaseMenuItem`            | 📐 interface | `contextMenuEngine.ts:82`  | `—`                                  |
| 6/16  | `ActionMenuItem`          | 📐 interface | `contextMenuEngine.ts:90`  | `—`                                  |
| 7/16  | `SubmenuMenuItem`         | 📐 interface | `contextMenuEngine.ts:102` | `—`                                  |
| 8/16  | `SeparatorMenuItem`       | 📐 interface | `contextMenuEngine.ts:111` | `—`                                  |
| 9/16  | `ContextMenuItem`         | 🏷️ type      | `contextMenuEngine.ts:115` | `—`                                  |
| 10/16 | `ResolvedMenuItem`        | 🏷️ type      | `contextMenuEngine.ts:117` | `—`                                  |
| 11/16 | `TargetMatcher`           | 🏷️ type      | `contextMenuEngine.ts:130` | `—`                                  |
| 12/16 | `ContextMenuRegistration` | 📐 interface | `contextMenuEngine.ts:135` | `—`                                  |
| 13/16 | `ContextMenuEngine`       | 📐 interface | `contextMenuEngine.ts:142` | `—`                                  |
| 14/16 | `sanitizeMenuSeparators`  | ⚙️ function  | `contextMenuEngine.ts:200` | `items: readonly ResolvedMenuItem[]` |
| 15/16 | `createContextMenuEngine` | ⚙️ function  | `contextMenuEngine.ts:293` | `—`                                  |
| 16/16 | `globalContextMenuEngine` | 📌 constant  | `contextMenuEngine.ts:410` | `—`                                  |

### 📁 universal-format-converter.ts

| #   | الاسم                         | الType       | File:سطر                            | Parameters |
| --- | ----------------------------- | ------------ | ----------------------------------- | ---------- |
| 1/6 | `FormatCategory`              | 🏷️ type      | `universal-format-converter.ts:40`  | `—`        |
| 2/6 | `SupportedFormatOption`       | 📐 interface | `universal-format-converter.ts:50`  | `—`        |
| 3/6 | `SUPPORTED_CONVERTER_FORMATS` | 📌 constant  | `universal-format-converter.ts:65`  | `—`        |
| 4/6 | `ConversionResult`            | 📐 interface | `universal-format-converter.ts:89`  | `—`        |
| 5/6 | `ParsedImportData`            | 📐 interface | `universal-format-converter.ts:98`  | `—`        |
| 6/6 | `UniversalFormatConverter`    | 🏗️ class     | `universal-format-converter.ts:119` | `—`        |

### 📁 block-mapper.ts

| #   | الاسم                   | الType       | File:سطر             | Parameters                        |
| --- | ----------------------- | ------------ | -------------------- | --------------------------------- |
| 1/4 | `SpatialBlock`          | 📐 interface | `block-mapper.ts:14` | `—`                               |
| 2/4 | `MappedBlock`           | 📐 interface | `block-mapper.ts:23` | `—`                               |
| 3/4 | `mapBlocksToGrid`       | ⚙️ function  | `block-mapper.ts:36` | `—`                               |
| 4/4 | `findOverlappingBlocks` | ⚙️ function  | `block-mapper.ts:50` | `blocks: readonly SpatialBlock[]` |

### 📁 base-engine.ts

| #    | الاسم               | الType       | File:سطر           | Parameters |
| ---- | ------------------- | ------------ | ------------------ | ---------- |
| 1/11 | `Database`          | 📐 interface | `base-engine.ts:37` | `—`        |
| 2/11 | `DatabaseTable`     | 📐 interface | `base-engine.ts:45` | `—`        |
| 3/11 | `ColumnType`        | 🏷️ type      | `base-engine.ts:52` | `—`        |
| 4/11 | `DatabaseColumn`    | 📐 interface | `base-engine.ts:63` | `—`        |
| 5/11 | `DatabaseRecord`    | 📐 interface | `base-engine.ts:74` | `—`        |
| 6/11 | `FilterOperator`    | 🏷️ type      | `base-engine.ts:85` | `—`        |
| 7/11 | `FilterPredicate`   | 📐 interface | `base-engine.ts:91` | `—`        |
| 8/11 | `QueryOptions`      | 📐 interface | `base-engine.ts:97` | `—`        |
| 9/11 | `ValidationResult`  | 📐 interface | `base-engine.ts:105` | `—`       |
| 10/11 | `TableStats`       | 📐 interface | `base-engine.ts:110` | `—`       |
| 11/11 | `BaseEngine`       | 🏗️ class     | `base-engine.ts:130` | `—`       |

### 📁 bounding-clamping-engine.ts

| #   | الاسم           | الType       | File:سطر                         | Parameters                             |
| --- | --------------- | ------------ | -------------------------------- | -------------------------------------- |
| 1/6 | `CanvasBounds`  | 📐 interface | `bounding-clamping-engine.ts:13` | `—`                                    |
| 2/6 | `ClampInput`    | 📐 interface | `bounding-clamping-engine.ts:18` | `—`                                    |
| 3/6 | `ClampResult`   | 📐 interface | `bounding-clamping-engine.ts:26` | `—`                                    |
| 4/6 | `clampElement`  | ⚙️ function  | `bounding-clamping-engine.ts:36` | `el: ClampInput, canvas: CanvasBounds` |
| 5/6 | `clampMultiple` | ⚙️ function  | `bounding-clamping-engine.ts:44` | `—`                                    |
| 6/6 | `isOutOfBounds` | ⚙️ function  | `bounding-clamping-engine.ts:51` | `el: ClampInput, canvas: CanvasBounds` |

### 📁 calc-engine.ts

| #    | الاسم               | الType       | File:سطر           | Parameters                                        |
| ---- | ------------------- | ------------ | ------------------ | ------------------------------------------------- |
| 1/19 | `TokenType`         | 🏷️ type      | `calc-engine.ts:63` | `—`                                              |
| 2/19 | `Token`             | 📐 interface | `calc-engine.ts:79` | `—`                                              |
| 3/19 | `ASTNode`           | 🏷️ type      | `calc-engine.ts:89` | `—`                                              |
| 4/19 | `ERRORS`            | 📌 constant  | `calc-engine.ts:102` | `—`                                             |
| 5/19 | `ErrorValue`        | 🏷️ type      | `calc-engine.ts:112` | `—`                                             |
| 6/19 | `isError`           | ⚙️ function  | `calc-engine.ts:114` | `v: unknown`                                    |
| 7/19 | `DependencyGraph`   | 🏗️ class     | `calc-engine.ts:122` | `—`                                             |
| 8/19 | `tokenize`          | ⚙️ function  | `calc-engine.ts:273` | `formula: string`                               |
| 9/19 | `FormulaParser`     | 🏗️ class     | `calc-engine.ts:413` | `—`                                             |
| 10/19 | `parseCellAddress` | ⚙️ function  | `calc-engine.ts:612` | `address: string`                               |
| 11/19 | `formatCellAddress` | ⚙️ function | `calc-engine.ts:628` | `row: number, col: number`                      |
| 12/19 | `expandRange`      | ⚙️ function  | `calc-engine.ts:633` | `start: string, end: string`                    |
| 13/19 | `BUILTINS`         | 📌 constant  | `calc-engine.ts:707` | `—`                                             |
| 14/19 | `tafqeetArabic`    | ⚙️ function  | `calc-engine.ts:1132` | `num: number`                                  |
| 15/19 | `tafqeetCurrency`  | ⚙️ function  | `calc-engine.ts:1176` | `num, currency`                                |
| 16/19 | `CellFormatter`    | 🏗️ class     | `calc-engine.ts:1205` | `—`                                            |
| 17/19 | `EvalContext`      | 📐 interface | `calc-engine.ts:1260` | `—`                                            |
| 18/19 | `CalcEngine`       | 🏗️ class     | `calc-engine.ts:1272` | `—`                                            |
| 19/19 | `sortTableByColumn` | ⚙️ function | `calc-engine.ts:1660` | `sheet, colIndex, direction`                   |

### 📁 callout-engine.ts

| #   | الاسم              | الType       | File:سطر               | Parameters           |
| --- | ------------------ | ------------ | ---------------------- | -------------------- |
| 1/6 | `CalloutShape`     | 🏷️ type      | `callout-engine.ts:14` | `—`                  |
| 2/6 | `CalloutColor`     | 🏷️ type      | `callout-engine.ts:15` | `—`                  |
| 3/6 | `CalloutPosition`  | 🏷️ type      | `callout-engine.ts:16` | `—`                  |
| 4/6 | `CalloutConfig`    | 📐 interface | `callout-engine.ts:18` | `—`                  |
| 5/6 | `renderCalloutSvg` | ⚙️ function  | `callout-engine.ts:56` | `cfg: CalloutConfig` |
| 6/6 | `createCallout`    | ⚙️ function  | `callout-engine.ts:71` | `—`                  |

### 📁 composable-traits-engine.ts

| #   | الاسم                    | الType       | File:سطر                          | Parameters     |
| --- | ------------------------ | ------------ | --------------------------------- | -------------- |
| 1/6 | `TraitDef`               | 📐 interface | `composable-traits-engine.ts:18`  | `—`            |
| 2/6 | `ComposedProfile`        | 📐 interface | `composable-traits-engine.ts:24`  | `—`            |
| 3/6 | `composeTraits`          | ⚙️ function  | `composable-traits-engine.ts:119` | `—`            |
| 4/6 | `getTraitDef`            | ⚙️ function  | `composable-traits-engine.ts:133` | `name: string` |
| 5/6 | `listTraits`             | ⚙️ function  | `composable-traits-engine.ts:137` | `—`            |
| 6/6 | `ComposableTraitsEngine` | 📌 constant  | `composable-traits-engine.ts:141` | `—`            |

### 📁 context-menu-engine.ts

| #   | الاسم                | الType       | File:سطر                     | Parameters |
| --- | -------------------- | ------------ | ---------------------------- | ---------- |
| 1/6 | `ContextMenuItem`    | 📐 interface | `context-menu-engine.ts:16`  | `—`        |
| 2/6 | `ContextMenuTarget`  | 📐 interface | `context-menu-engine.ts:28`  | `—`        |
| 3/6 | `ContextMenuResult`  | 📐 interface | `context-menu-engine.ts:36`  | `—`        |
| 4/6 | `resolveContextMenu` | ⚙️ function  | `context-menu-engine.ts:114` | `—`        |
| 5/6 | `clearRegistry`      | ⚙️ function  | `context-menu-engine.ts:131` | `—`        |
| 6/6 | `ContextMenuEngine`  | 📌 constant  | `context-menu-engine.ts:135` | `—`        |

### 📁 doctor-self-healing-engine.ts

| #   | الاسم                    | الType       | File:سطر                           | Parameters |
| --- | ------------------------ | ------------ | ---------------------------------- | ---------- |
| 1/2 | `DoctorReport`           | 📐 interface | `doctor-self-healing-engine.ts:31` | `—`        |
| 2/2 | `runSelfHealingPipeline` | 📌 constant  | `doctor-self-healing-engine.ts:98` | `—`        |

### 📁 file-type-detection.ts

| #   | الاسم                 | الType       | File:سطر                     | Parameters |
| --- | --------------------- | ------------ | ---------------------------- | ---------- |
| 1/3 | `DocumentType`        | 🏷️ type      | `file-type-detection.ts:30`  | `—`        |
| 2/3 | `FileDetectionResult` | 📐 interface | `file-type-detection.ts:32`  | `—`        |
| 3/3 | `detectDocumentType`  | ⚙️ function  | `file-type-detection.ts:118` | `—`        |

### 📁 floating-gizmo-engine.ts

| #   | الاسم                  | الType       | File:سطر                       | Parameters |
| --- | ---------------------- | ------------ | ------------------------------ | ---------- |
| 1/6 | `GizmoPosition`        | 📐 interface | `floating-gizmo-engine.ts:16`  | `—`        |
| 2/6 | `FloatingAction`       | 📐 interface | `floating-gizmo-engine.ts:18`  | `—`        |
| 3/6 | `FloatingGizmoState`   | 📐 interface | `floating-gizmo-engine.ts:26`  | `—`        |
| 4/6 | `computeFloatingGizmo` | ⚙️ function  | `floating-gizmo-engine.ts:107` | `—`        |
| 5/6 | `hideGizmo`            | ⚙️ function  | `floating-gizmo-engine.ts:119` | `—`        |
| 6/6 | `FloatingGizmoEngine`  | 📌 constant  | `floating-gizmo-engine.ts:123` | `—`        |

### 📁 html-pipeline.ts

| #   | الاسم                       | الType       | File:سطر               | Parameters                                                  |
| --- | --------------------------- | ------------ | ---------------------- | ----------------------------------------------------------- |
| 1/9 | `RichTextData`              | 📐 interface | `html-pipeline.ts:30`  | `—`                                                         |
| 2/9 | `HtmlToRichTextOptions`     | 📐 interface | `html-pipeline.ts:34`  | `—`                                                         |
| 3/9 | `sanitizeHtml`              | ⚙️ function  | `html-pipeline.ts:43`  | `html: string, options?: { stripStyles?: boolean }`         |
| 4/9 | `htmlToRichTextDocument`    | ⚙️ function  | `html-pipeline.ts:75`  | `—`                                                         |
| 5/9 | `exportDocumentToCleanHtml` | ⚙️ function  | `html-pipeline.ts:99`  | `document: { title?: string; type: string; data: unknown }` |
| 6/9 | `extractHtmlTitle`          | ⚙️ function  | `html-pipeline.ts:141` | `html: string`                                              |
| 7/9 | `escapeHtml`                | ⚙️ function  | `html-pipeline.ts:146` | `text: string`                                              |
| 8/9 | `stripHtmlTags`             | ⚙️ function  | `html-pipeline.ts:158` | `text: string`                                              |
| 9/9 | `readAttr`                  | ⚙️ function  | `html-pipeline.ts:171` | `attrs: string, name: string`                               |

### 📁 impress-engine.ts

| #     | الاسم                   | الType       | File:سطر                | Parameters |
| ----- | ----------------------- | ------------ | ----------------------- | ---------- |
| 1/12 | `Presentation`          | 📐 interface | `impress-engine.ts:37`  | `—`        |
| 2/12 | `SlideData`             | 📐 interface | `impress-engine.ts:45`  | `—`        |
| 3/12 | `SlideLayout`           | 🏷️ type      | `impress-engine.ts:55`  | `—`        |
| 4/12 | `SlideBackground`       | 📐 interface | `impress-engine.ts:64`  | `—`        |
| 5/12 | `SlideTransition`       | 📐 interface | `impress-engine.ts:69`  | `—`        |
| 6/12 | `PresentationTheme`     | 📐 interface | `impress-engine.ts:74`  | `—`        |
| 7/12 | `PresentationMetadata`  | 📐 interface | `impress-engine.ts:86`  | `—`        |
| 8/12 | `DEFAULT_THEMES`        | 📌 constant  | `impress-engine.ts:102` | `—`        |
| 9/12 | `THEME_KEYS`            | 📌 constant  | `impress-engine.ts:172` | `—`        |
| 10/12 | `SLIDE_GRADIENT_PRESETS` | 📌 constant | `impress-engine.ts:178` | `—`       |
| 11/12 | `ImpressEngine`         | 🏗️ class     | `impress-engine.ts:205` | `—`       |
| 12/12 | `mintSlideId`           | ⚙️ function  | `impress-engine.ts:196` | `—` (private) |

### 📁 image-pipeline.ts

| #     | الاسم                   | الType       | File:سطر                | Parameters                                                     |
| ----- | ----------------------- | ------------ | ----------------------- | -------------------------------------------------------------- |
| 1/17  | `ProcessedImageResult`  | 📐 interface | `image-pipeline.ts:30`  | `—`                                                            |
| 2/17  | `CropRect`              | 📐 interface | `image-pipeline.ts:39`  | `—`                                                            |
| 3/17  | `ImageFilters`          | 📐 interface | `image-pipeline.ts:46`  | `—`                                                            |
| 4/17  | `ImageFilterOptions`    | 🏷️ type      | `image-pipeline.ts:58`  | `—`                                                            |
| 5/17  | `ImageTransformOptions` | 📐 interface | `image-pipeline.ts:60`  | `—`                                                            |
| 6/17  | `ResizeResult`          | 📐 interface | `image-pipeline.ts:72`  | `—`                                                            |
| 7/17  | `readJpegOrientation`   | ⚙️ function  | `image-pipeline.ts:84`  | `buffer: ArrayBuffer`                                          |
| 8/17  | `applyOrientation`      | ⚙️ function  | `image-pipeline.ts:127` | `—`                                                            |
| 9/17  | `prepareUploadedImage`  | ⚙️ function  | `image-pipeline.ts:142` | `—`                                                            |
| 10/17 | `processImageFile`      | ⚙️ function  | `image-pipeline.ts:198` | `file: File`                                                   |
| 11/17 | `transformImage`        | ⚙️ function  | `image-pipeline.ts:202` | `—`                                                            |
| 12/17 | `cropImage`             | ⚙️ function  | `image-pipeline.ts:253` | `source: HTMLImageElement                                      | string, cropRect: CropRect`    |
| 13/17 | `applyImageFilter`      | ⚙️ function  | `image-pipeline.ts:258` | `source: HTMLImageElement                                      | string, filters: ImageFilters` |
| 14/17 | `resizeImageToFit`      | ⚙️ function  | `image-pipeline.ts:263` | `width: number, height: number, maxWidth: number, maxHeight: ` |
| 15/17 | `compressImage`         | ⚙️ function  | `image-pipeline.ts:271` | `—`                                                            |
| 16/17 | `createThumbnail`       | ⚙️ function  | `image-pipeline.ts:278` | `source: HTMLImageElement                                      | string, size = 120`            |
| 17/17 | `buildFilterString`     | ⚙️ function  | `image-pipeline.ts:334` | `filters: ImageFilters`                                        |

### 📁 marquee-selection-engine.ts

| #   | الاسم                          | الType       | File:سطر                         | Parameters |
| --- | ------------------------------ | ------------ | -------------------------------- | ---------- |
| 1/3 | `MarqueeBox`                   | 📐 interface | `marquee-selection-engine.ts:15` | `—`        |
| 2/3 | `MarqueeElement`               | 📐 interface | `marquee-selection-engine.ts:22` | `—`        |
| 3/3 | `createMarqueeSelectionEngine` | ⚙️ function  | `marquee-selection-engine.ts:48` | `—`        |

### 📁 mouse-command-registry.ts

| #   | الاسم                        | الType       | File:سطر                       | Parameters |
| --- | ---------------------------- | ------------ | ------------------------------ | ---------- |
| 1/3 | `CommandHandler`             | 🏷️ type      | `mouse-command-registry.ts:15` | `—`        |
| 2/3 | `MouseCommand`               | 📐 interface | `mouse-command-registry.ts:17` | `—`        |
| 3/3 | `createMouseCommandRegistry` | ⚙️ function  | `mouse-command-registry.ts:24` | `—`        |

### 📁 mouse-tooling-engine.ts

| #   | الاسم                            | الType       | File:سطر                      | Parameters         |
| --- | -------------------------------- | ------------ | ----------------------------- | ------------------ |
| 1/7 | `ToolCategory`                   | 🏷️ type      | `mouse-tooling-engine.ts:34`  | `—`                |
| 2/7 | `ContextMenuAction`              | 📐 interface | `mouse-tooling-engine.ts:36`  | `—`                |
| 3/7 | `FloatingGizmoTool`              | 📐 interface | `mouse-tooling-engine.ts:46`  | `—`                |
| 4/7 | `TransformHandle`                | 📐 interface | `mouse-tooling-engine.ts:54`  | `—`                |
| 5/7 | `ElementToolingProfile`          | 📐 interface | `mouse-tooling-engine.ts:61`  | `—`                |
| 6/7 | `getToolingProfileForNode`       | ⚙️ function  | `mouse-tooling-engine.ts:157` | `nodeType: string` |
| 7/7 | `calculateTransformGizmoHandles` | ⚙️ function  | `mouse-tooling-engine.ts:177` | `—`                |

### 📁 multi-selection-engine.ts

| #   | الاسم                        | الType      | File:سطر                       | Parameters |
| --- | ---------------------------- | ----------- | ------------------------------ | ---------- |
| 1/1 | `createMultiSelectionEngine` | ⚙️ function | `multi-selection-engine.ts:15` | `—`        |

### 📁 screen-edge-detector.ts

| #   | الاسم            | الType       | File:سطر                     | Parameters |
| --- | ---------------- | ------------ | ---------------------------- | ---------- |
| 1/5 | `ViewportBounds` | 📐 interface | `screen-edge-detector.ts:14` | `—`        |
| 2/5 | `MenuDimensions` | 📐 interface | `screen-edge-detector.ts:19` | `—`        |
| 3/5 | `FlipResult`     | 📐 interface | `screen-edge-detector.ts:24` | `—`        |
| 4/5 | `detectAndFlip`  | ⚙️ function  | `screen-edge-detector.ts:37` | `—`        |
| 5/5 | `isNearEdge`     | ⚙️ function  | `screen-edge-detector.ts:48` | `—`        |

### 📁 selection-gizmo-engine.ts

| #   | الاسم                  | الType       | File:سطر                        | Parameters |
| --- | ---------------------- | ------------ | ------------------------------- | ---------- |
| 1/7 | `Rect`                 | 📐 interface | `selection-gizmo-engine.ts:16`  | `—`        |
| 2/7 | `HandlePosition`       | 🏷️ type      | `selection-gizmo-engine.ts:18`  | `—`        |
| 3/7 | `Handle`               | 📐 interface | `selection-gizmo-engine.ts:20`  | `—`        |
| 4/7 | `GizmoToolbar`         | 📐 interface | `selection-gizmo-engine.ts:27`  | `—`        |
| 5/7 | `GizmoAction`          | 📐 interface | `selection-gizmo-engine.ts:33`  | `—`        |
| 6/7 | `computeGizmo`         | ⚙️ function  | `selection-gizmo-engine.ts:97`  | `—`        |
| 7/7 | `SelectionGizmoEngine` | 📌 constant  | `selection-gizmo-engine.ts:111` | `—`        |

### 📁 selection-manager.ts

| #   | الاسم                    | الType       | File:سطر                  | Parameters |
| --- | ------------------------ | ------------ | ------------------------- | ---------- |
| 1/3 | `SelectableElement`      | 📐 interface | `selection-manager.ts:14` | `—`        |
| 2/3 | `SelectionMode`          | 🏷️ type      | `selection-manager.ts:23` | `—`        |
| 3/3 | `createSelectionManager` | ⚙️ function  | `selection-manager.ts:29` | `—`        |

### 📁 smart-component-engine.ts

| #   | الاسم                 | الType       | File:سطر                       | Parameters                             |
| --- | --------------------- | ------------ | ------------------------------ | -------------------------------------- |
| 1/4 | `ComponentDependency` | 📐 interface | `smart-component-engine.ts:14` | `—`                                    |
| 2/4 | `ResolveResult`       | 📐 interface | `smart-component-engine.ts:21` | `—`                                    |
| 3/4 | `resolveComponents`   | ⚙️ function  | `smart-component-engine.ts:60` | `—`                                    |
| 4/4 | `sortByIdWeight`      | ⚙️ function  | `smart-component-engine.ts:74` | `deps: readonly ComponentDependency[]` |

### 📁 spatial-drag-engine.ts

| #   | الاسم                     | الType       | File:سطر                    | Parameters |
| --- | ------------------------- | ------------ | --------------------------- | ---------- |
| 1/4 | `DragElement`             | 📐 interface | `spatial-drag-engine.ts:17` | `—`        |
| 2/4 | `DragState`               | 📐 interface | `spatial-drag-engine.ts:26` | `—`        |
| 3/4 | `DragResult`              | 📐 interface | `spatial-drag-engine.ts:33` | `—`        |
| 4/4 | `createSpatialDragEngine` | ⚙️ function  | `spatial-drag-engine.ts:67` | `—`        |

### 📁 tool-registry.ts

| #   | الاسم             | الType       | File:سطر               | Parameters |
| --- | ----------------- | ------------ | ---------------------- | ---------- |
| 1/4 | `ToolCategory`    | 🏷️ type      | `tool-registry.ts:29`  | `—`        |
| 2/4 | `UnifiedToolItem` | 📐 interface | `tool-registry.ts:33`  | `—`        |
| 3/4 | `ToolRegistry`    | 🏗️ class     | `tool-registry.ts:45`  | `—`        |
| 4/4 | `toolRegistry`    | 📌 constant  | `tool-registry.ts:103` | `—`        |

### 📁 undo-redo-engine.ts

| #   | الاسم                  | الType       | File:سطر                 | Parameters     |
| --- | ---------------------- | ------------ | ------------------------ | -------------- |
| 1/2 | `Snapshot`             | 📐 interface | `undo-redo-engine.ts:15` | `—`            |
| 2/2 | `createUndoRedoEngine` | ⚙️ function  | `undo-redo-engine.ts:21` | `maxSize = 50` |

### 📁 unified-ingestion.ts

| #   | الاسم                      | الType       | File:سطر                  | Parameters |
| --- | -------------------------- | ------------ | ------------------------- | ---------- |
| 1/5 | `IngestionSourceType`      | 🏷️ type      | `unified-ingestion.ts:32` | `—`        |
| 2/5 | `IngestionTargetEditor`    | 🏷️ type      | `unified-ingestion.ts:41` | `—`        |
| 3/5 | `IngestionResult`          | 📐 interface | `unified-ingestion.ts:43` | `—`        |
| 4/5 | `IngestionOptions`         | 📐 interface | `unified-ingestion.ts:56` | `—`        |
| 5/5 | `UnifiedIngestionPipeline` | 🏗️ class     | `unified-ingestion.ts:61` | `—`        |

### 📁 validation.ts

| #   | الاسم              | الType       | File:سطر            | Parameters     |
| --- | ------------------ | ------------ | ------------------- | -------------- |
| 1/4 | `ValidationIssue`  | 📐 interface | `validation.ts:32`  | `—`            |
| 2/4 | `ValidationEngine` | 🏗️ class     | `validation.ts:38`  | `—`            |
| 3/4 | `validationEngine` | 📌 constant  | `validation.ts:105` | `—`            |
| 4/4 | `validateDocument` | ⚙️ function  | `validation.ts:45`  | `doc: DocNode` |

### 📁 writer-engine.ts

| #   | الاسم              | الType       | File:سطر              | Parameters |
| --- | ------------------ | ------------ | --------------------- | ---------- |
| 1/8 | `WriterDocument`   | 📐 interface | `writer-engine.ts:38` | `—`        |
| 2/8 | `DocumentMetadata` | 📐 interface | `writer-engine.ts:46` | `—`        |
| 3/8 | `DocumentStyles`   | 📐 interface | `writer-engine.ts:53` | `—`        |
| 4/8 | `WriterBlockType`  | 🏷️ type      | `writer-engine.ts:67` | `—`        |
| 5/8 | `TextMark`         | 📐 interface | `writer-engine.ts:80` | `—`        |
| 6/8 | `WriterBlock`      | 📐 interface | `writer-engine.ts:85` | `—`        |
| 7/8 | `SearchResult`     | 📐 interface | `writer-engine.ts:98` | `—`        |
| 8/8 | `WriterEngine`     | 🏗️ class     | `writer-engine.ts:114` | `—`       |

### 📁 z-order-manager.ts

| #   | الاسم                | الType       | File:سطر                | Parameters |
| --- | -------------------- | ------------ | ----------------------- | ---------- |
| 1/4 | `ZElement`           | 📐 interface | `z-order-manager.ts:14` | `—`        |
| 2/4 | `ZOrderAction`       | 🏷️ type      | `z-order-manager.ts:19` | `—`        |
| 3/4 | `reorderZIndex`      | ⚙️ function  | `z-order-manager.ts:36` | `—`        |
| 4/4 | `applyZOrderChanges` | ⚙️ function  | `z-order-manager.ts:56` | `—`        |

### 📁 indexer.ts

| #   | الاسم            | الType       | File:سطر         | Parameters                       |
| --- | ---------------- | ------------ | ---------------- | -------------------------------- |
| 1/4 | `Indexer`        | 📐 interface | `indexer.ts:36`  | `—`                              |
| 2/4 | `buildIndexer`   | ⚙️ function  | `indexer.ts:45`  | `doc: DocNode`                   |
| 3/4 | `getNodeById`    | ⚙️ function  | `indexer.ts:126` | `indexer: Indexer, id: NodeId`   |
| 4/4 | `getNodesByType` | ⚙️ function  | `indexer.ts:133` | `indexer: Indexer, type: string` |

### 📁 search.ts

| #   | الاسم           | الType       | File:سطر        | Parameters |
| --- | --------------- | ------------ | --------------- | ---------- |
| 1/3 | `SearchOptions` | 📐 interface | `search.ts:37`  | `—`        |
| 2/3 | `search`        | ⚙️ function  | `search.ts:48`  | `—`        |
| 3/3 | `simpleSearch`  | ⚙️ function  | `search.ts:100` | `—`        |

### 📁 frontmatter-parser.ts

| #   | الاسم                     | الType       | File:سطر                   | Parameters     |
| --- | ------------------------- | ------------ | -------------------------- | -------------- |
| 1/3 | `DocumentMetadata`        | 📐 interface | `frontmatter-parser.ts:21` | `—`            |
| 2/3 | `ParsedFrontMatterResult` | 📐 interface | `frontmatter-parser.ts:33` | `—`            |
| 3/3 | `parseFrontMatter`        | ⚙️ function  | `frontmatter-parser.ts:39` | `text: string` |

### 📁 markdown.ts

| #   | الاسم            | الType       | File:سطر         | Parameters         |
| --- | ---------------- | ------------ | ---------------- | ------------------ |
| 1/4 | `TableData`      | 📐 interface | `markdown.ts:25` | `—`                |
| 2/4 | `ContentBlock`   | 📐 interface | `markdown.ts:30` | `—`                |
| 3/4 | `ParsedMarkdown` | 📐 interface | `markdown.ts:38` | `—`                |
| 4/4 | `parseMarkdown`  | ⚙️ function  | `markdown.ts:42` | `markdown: string` |

### 📁 component-registry.ts

| #   | الاسم                     | الType       | File:سطر                   | Parameters |
| --- | ------------------------- | ------------ | -------------------------- | ---------- |
| 1/4 | `ComponentCategory`       | 🏷️ type      | `component-registry.ts:14` | `—`        |
| 2/4 | `ComponentPosition`       | 🏷️ type      | `component-registry.ts:16` | `—`        |
| 3/4 | `ComponentRegistration`   | 📐 interface | `component-registry.ts:18` | `—`        |
| 4/4 | `createComponentRegistry` | ⚙️ function  | `component-registry.ts:36` | `—`        |

### 📁 editor-state.ts

| #     | الاسم               | الType       | File:سطر              | Parameters                                     |
| ----- | ------------------- | ------------ | --------------------- | ---------------------------------------------- |
| 1/10  | `EditorState`       | 📐 interface | `editor-state.ts:41`  | `—`                                            |
| 2/10  | `Selection`         | 📐 interface | `editor-state.ts:48`  | `—`                                            |
| 3/10  | `FullEditorState`   | 📐 interface | `editor-state.ts:66`  | `—`                                            |
| 4/10  | `createEditorState` | ⚙️ function  | `editor-state.ts:87`  | `doc?: DocNode`                                |
| 5/10  | `canUndo`           | ⚙️ function  | `editor-state.ts:106` | `state: FullEditorState`                       |
| 6/10  | `canRedo`           | ⚙️ function  | `editor-state.ts:113` | `state: FullEditorState`                       |
| 7/10  | `getDocument`       | ⚙️ function  | `editor-state.ts:120` | `state: FullEditorState`                       |
| 8/10  | `apply`             | ⚙️ function  | `editor-state.ts:128` | `state: FullEditorState, operation: Operation` |
| 9/10  | `undo`              | ⚙️ function  | `editor-state.ts:158` | `state: FullEditorState`                       |
| 10/10 | `redo`              | ⚙️ function  | `editor-state.ts:186` | `state: FullEditorState`                       |

### 📁 history.ts

| #   | الاسم             | الType       | File:سطر         | Parameters                                       |
| --- | ----------------- | ------------ | ---------------- | ------------------------------------------------ |
| 1/7 | `HistorySnapshot` | 📐 interface | `history.ts:36`  | `—`                                              |
| 2/7 | `HistoryState`    | 📐 interface | `history.ts:41`  | `—`                                              |
| 3/7 | `createHistory`   | ⚙️ function  | `history.ts:50`  | `maxSize: number = 100`                          |
| 4/7 | `pushSnapshot`    | ⚙️ function  | `history.ts:61`  | `state: HistoryState, snapshot: HistorySnapshot` |
| 5/7 | `popUndo`         | ⚙️ function  | `history.ts:76`  | `state: HistoryState`                            |
| 6/7 | `popRedo`         | ⚙️ function  | `history.ts:100` | `state: HistoryState`                            |
| 7/7 | `clearHistory`    | ⚙️ function  | `history.ts:124` | `state: HistoryState`                            |

### 📁 operations.ts

| #     | الاسم                    | الType       | File:سطر            | Parameters                                       |
| ----- | ------------------------ | ------------ | ------------------- | ------------------------------------------------ |
| 1/14  | `OperationType`          | 🏷️ type      | `operations.ts:47`  | `—`                                              |
| 2/14  | `InsertBlockOperation`   | 📐 interface | `operations.ts:59`  | `—`                                              |
| 3/14  | `DeleteBlockOperation`   | 📐 interface | `operations.ts:67`  | `—`                                              |
| 4/14  | `UpdateBlockOperation`   | 📐 interface | `operations.ts:72`  | `—`                                              |
| 5/14  | `MoveBlockOperation`     | 📐 interface | `operations.ts:78`  | `—`                                              |
| 6/14  | `InsertInlineOperation`  | 📐 interface | `operations.ts:85`  | `—`                                              |
| 7/14  | `DeleteInlineOperation`  | 📐 interface | `operations.ts:93`  | `—`                                              |
| 8/14  | `UpdateInlineOperation`  | 📐 interface | `operations.ts:98`  | `—`                                              |
| 9/14  | `SpatialMoveOperation`   | 📐 interface | `operations.ts:104` | `—`                                              |
| 10/14 | `TextUpdateOperation`    | 📐 interface | `operations.ts:110` | `—`                                              |
| 11/14 | `FormulaUpdateOperation` | 📐 interface | `operations.ts:116` | `—`                                              |
| 12/14 | `Operation`              | 🏷️ type      | `operations.ts:122` | `—`                                              |
| 13/14 | `applyOperation`         | ⚙️ function  | `operations.ts:140` | `doc: DocNode, operation: Operation`             |
| 14/14 | `applyOperations`        | ⚙️ function  | `operations.ts:236` | `doc: DocNode, operations: readonly Operation[]` |

### 📁 tree.ts

| #   | الاسم                    | الType      | File:سطر      | Parameters                                       |
| --- | ------------------------ | ----------- | ------------- | ------------------------------------------------ |
| 1/7 | `insertInArray`          | ⚙️ function | `tree.ts:36`  | `—`                                              |
| 2/7 | `findAndUpdateBlock`     | ⚙️ function | `tree.ts:90`  | `—`                                              |
| 3/7 | `findAndUpdateInline`    | ⚙️ function | `tree.ts:126` | `—`                                              |
| 4/7 | `removeBlocks`           | ⚙️ function | `tree.ts:145` | `blocks: readonly BlockNode[], targetId: NodeId` |
| 5/7 | `removeInlineFromBlocks` | ⚙️ function | `tree.ts:170` | `—`                                              |
| 6/7 | `insertInlineIntoBlock`  | ⚙️ function | `tree.ts:190` | `—`                                              |
| 7/7 | `moveBlockInTree`        | ⚙️ function | `tree.ts:215` | `—`                                              |

### 📁 arabic-text.ts

| #     | الاسم                     | الType      | File:سطر             | Parameters                                |
| ----- | ------------------------- | ----------- | -------------------- | ----------------------------------------- |
| 1/21  | `ARABIC_RANGES`           | 📌 constant | `arabic-text.ts:38`  | `—`                                       |
| 2/21  | `ARABIC_DIACRITICS`       | 📌 constant | `arabic-text.ts:47`  | `—`                                       |
| 3/21  | `NUMERALS`                | 📌 constant | `arabic-text.ts:50`  | `—`                                       |
| 4/21  | `NORMALIZATION_MAP`       | 📌 constant | `arabic-text.ts:56`  | `—`                                       |
| 5/21  | `TextDirection`           | 🏷️ type     | `arabic-text.ts:65`  | `—`                                       |
| 6/21  | `isArabicChar`            | ⚙️ function | `arabic-text.ts:72`  | `char: string`                            |
| 7/21  | `containsArabic`          | ⚙️ function | `arabic-text.ts:85`  | `text: string`                            |
| 8/21  | `detectDirection`         | ⚙️ function | `arabic-text.ts:98`  | `text: string`                            |
| 9/21  | `countArabicWords`        | ⚙️ function | `arabic-text.ts:114` | `text: string`                            |
| 10/21 | `removeDiacritics`        | ⚙️ function | `arabic-text.ts:125` | `text: string`                            |
| 11/21 | `removeTatweel`           | ⚙️ function | `arabic-text.ts:131` | `text: string`                            |
| 12/21 | `normalizeArabicLetters`  | ⚙️ function | `arabic-text.ts:137` | `text: string`                            |
| 13/21 | `normalizeArabic`         | ⚙️ function | `arabic-text.ts:147` | `text: string`                            |
| 14/21 | `arabicToWesternNumerals` | ⚙️ function | `arabic-text.ts:157` | `text: string`                            |
| 15/21 | `westernToArabicNumerals` | ⚙️ function | `arabic-text.ts:171` | `text: string`                            |
| 16/21 | `normalizeNumerals`       | ⚙️ function | `arabic-text.ts:185` | `text: string`                            |
| 17/21 | `wrapWithDir`             | ⚙️ function | `arabic-text.ts:194` | `text: string, direction?: TextDirection` |
| 18/21 | `embedBidi`               | ⚙️ function | `arabic-text.ts:202` | `text: string`                            |
| 19/21 | `arabicEquals`            | ⚙️ function | `arabic-text.ts:215` | `a: string, b: string`                    |
| 20/21 | `arabicIncludes`          | ⚙️ function | `arabic-text.ts:220` | `text: string, query: string`             |
| 21/21 | `normalizeWhitespace`     | ⚙️ function | `arabic-text.ts:225` | `text: string`                            |

### 📁 compose.ts

| #   | الاسم     | الType      | File:سطر        | Parameters                    |
| --- | --------- | ----------- | --------------- | ----------------------------- |
| 1/1 | `compose` | ⚙️ function | `compose.ts:25` | `...fns: ReadonlyArray<(v: T` |

### 📁 content-validator.ts

| #   | الاسم                   | الType       | File:سطر                   | Parameters                              |
| --- | ----------------------- | ------------ | -------------------------- | --------------------------------------- |
| 1/8 | `BlockValidation`       | 📐 interface | `content-validator.ts:50`  | `—`                                     |
| 2/8 | `HeadingHierarchyState` | 📐 interface | `content-validator.ts:57`  | `—`                                     |
| 3/8 | `isTableContent`        | ⚙️ function  | `content-validator.ts:63`  | `content: unknown`                      |
| 4/8 | `validateHeadingBlock`  | ⚙️ function  | `content-validator.ts:74`  | `—`                                     |
| 5/8 | `validateListBlock`     | ⚙️ function  | `content-validator.ts:110` | `block: ContentBlock, position: number` |
| 6/8 | `validateTableBlock`    | ⚙️ function  | `content-validator.ts:133` | `block: ContentBlock, position: number` |
| 7/8 | `validateCodeBlock`     | ⚙️ function  | `content-validator.ts:167` | `block: ContentBlock, position: number` |
| 8/8 | `validateBlock`         | ⚙️ function  | `content-validator.ts:182` | `—`                                     |

### 📁 document-validator.ts

| #   | الاسم                      | الType       | File:سطر                    | Parameters                         |
| --- | -------------------------- | ------------ | --------------------------- | ---------------------------------- |
| 1/8 | `ValidationResult`         | 📐 interface | `document-validator.ts:56`  | `—`                                |
| 2/8 | `ContentValidationResult`  | 📐 interface | `document-validator.ts:65`  | `—`                                |
| 3/8 | `validateDocument`         | ⚙️ function  | `document-validator.ts:145` | `markdown: string`                 |
| 4/8 | `validateHeadingHierarchy` | ⚙️ function  | `document-validator.ts:164` | `content: readonly ContentBlock[]` |
| 5/8 | `validateTables`           | ⚙️ function  | `document-validator.ts:188` | `content: readonly ContentBlock[]` |
| 6/8 | `hasFrontMatter`           | ⚙️ function  | `document-validator.ts:239` | `markdown: string`                 |
| 7/8 | `extractMetadata`          | ⚙️ function  | `document-validator.ts:244` | `markdown: string`                 |
| 8/8 | `hasValidFrontMatter`      | ⚙️ function  | `document-validator.ts:250` | `markdown: string`                 |

### 📁 formula-parser.ts

| #     | الاسم                         | الType       | File:سطر                | Parameters                                              |
| ----- | ----------------------------- | ------------ | ----------------------- | ------------------------------------------------------- |
| 1/15  | `ARABIC_TO_ENGLISH_FUNCTIONS` | 📌 constant  | `formula-parser.ts:39`  | `—`                                                     |
| 2/15  | `ENGLISH_FUNCTIONS`           | 📌 constant  | `formula-parser.ts:112` | `—`                                                     |
| 3/15  | `FormulaValidation`           | 📐 interface | `formula-parser.ts:200` | `—`                                                     |
| 4/15  | `CellReference`               | 📐 interface | `formula-parser.ts:210` | `—`                                                     |
| 5/15  | `translateFormula`            | ⚙️ function  | `formula-parser.ts:222` | `formula: string`                                       |
| 6/15  | `parseFormula`                | ⚙️ function  | `formula-parser.ts:249` | `rawFormula: string`                                    |
| 7/15  | `validateFormula`             | ⚙️ function  | `formula-parser.ts:307` | `formula: string`                                       |
| 8/15  | `columnToIndex`               | ⚙️ function  | `formula-parser.ts:316` | `column: string`                                        |
| 9/15  | `indexToColumn`               | ⚙️ function  | `formula-parser.ts:325` | `index: number`                                         |
| 10/15 | `parseCellReference`          | ⚙️ function  | `formula-parser.ts:337` | `ref: string`                                           |
| 11/15 | `formatCellReference`         | ⚙️ function  | `formula-parser.ts:350` | `—`                                                     |
| 12/15 | `hasCircularReference`        | ⚙️ function  | `formula-parser.ts:362` | `formula: string, currentCell: string`                  |
| 13/15 | `adjustReferences`            | ⚙️ function  | `formula-parser.ts:368` | `formula: string, rowOffset: number, colOffset: number` |
| 14/15 | `getAllReferences`            | ⚙️ function  | `formula-parser.ts:392` | `formula: string`                                       |
| 15/15 | `sanitizeFormula`             | ⚙️ function  | `formula-parser.ts:398` | `formula: string`                                       |

### 📁 id.ts

| #   | الاسم        | الType      | File:سطر   | Parameters        |
| --- | ------------ | ----------- | ---------- | ----------------- |
| 1/2 | `generateId` | ⚙️ function | `id.ts:52` | `prefix?: string` |
| 2/2 | `isValidId`  | ⚙️ function | `id.ts:68` | `id: string`      |

### 📁 pipe.ts

| #   | الاسم  | الType      | File:سطر     | Parameters                              |
| --- | ------ | ----------- | ------------ | --------------------------------------- |
| 1/1 | `pipe` | ⚙️ function | `pipe.ts:28` | `value: T, ...fns: ReadonlyArray<(v: T` |

---

## 📦 packages/plugins

### 📁 canvas-designer-plugin.ts

| #   | الاسم                         | الType       | File:سطر                       | Parameters |
| --- | ----------------------------- | ------------ | ------------------------------ | ---------- |
| 1/2 | `CanvasDesignerPluginOptions` | 📐 interface | `canvas-designer-plugin.ts:27` | `—`        |
| 2/2 | `createCanvasDesignerPlugin`  | ⚙️ function  | `canvas-designer-plugin.ts:32` | `—`        |

### 📁 layer-tree-engine.ts

| #   | الاسم             | الType       | File:سطر                  | Parameters |
| --- | ----------------- | ------------ | ------------------------- | ---------- |
| 1/2 | `LayerNode`       | 📐 interface | `layer-tree-engine.ts:26` | `—`        |
| 2/2 | `LayerTreeEngine` | 🏗️ class     | `layer-tree-engine.ts:37` | `—`        |

### 📁 schema-registry.ts

| #   | الاسم                    | الType      | File:سطر                 | Parameters                |
| --- | ------------------------ | ----------- | ------------------------ | ------------------------- |
| 1/4 | `CANVAS_ELEMENT_SCHEMAS` | 📌 constant | `schema-registry.ts:28`  | `—`                       |
| 2/4 | `getSchemaForType`       | ⚙️ function | `schema-registry.ts:409` | `type: CanvasElementType` |
| 3/4 | `getAllSchemas`          | ⚙️ function | `schema-registry.ts:413` | `—`                       |
| 4/4 | `createDefaultElement`   | ⚙️ function | `schema-registry.ts:417` | `—`                       |

### 📁 schema-types.ts

| #   | الاسم                     | الType       | File:سطر             | Parameters |
| --- | ------------------------- | ------------ | -------------------- | ---------- |
| 1/4 | `CanvasElementType`       | 🏷️ type      | `schema-types.ts:26` | `—`        |
| 2/4 | `ElementCategory`         | 🏷️ type      | `schema-types.ts:60` | `—`        |
| 3/4 | `ElementSchemaDefinition` | 📐 interface | `schema-types.ts:62` | `—`        |
| 4/4 | `CanvasElementInstance`   | 📐 interface | `schema-types.ts:80` | `—`        |

### 📁 math-plugin.ts

| #   | الاسم        | الType   | File:سطر            | Parameters |
| --- | ------------ | -------- | ------------------- | ---------- |
| 1/1 | `MathPlugin` | 🏗️ class | `math-plugin.ts:40` | `—`        |

### 📁 mermaid-plugin.ts

| #   | الاسم           | الType   | File:سطر               | Parameters |
| --- | --------------- | -------- | ---------------------- | ---------- |
| 1/1 | `MermaidPlugin` | 🏗️ class | `mermaid-plugin.ts:50` | `—`        |

### 📁 registry.ts

| #   | الاسم              | الType       | File:سطر          | Parameters |
| --- | ------------------ | ------------ | ----------------- | ---------- |
| 1/4 | `OfficeDomain`     | 🏷️ type      | `registry.ts:59`  | `—`        |
| 2/4 | `RegisteredPlugin` | 📐 interface | `registry.ts:61`  | `—`        |
| 3/4 | `PluginRegistry`   | 🏗️ class     | `registry.ts:66`  | `—`        |
| 4/4 | `pluginRegistry`   | 📌 constant  | `registry.ts:194` | `—`        |

### 📁 types.ts

| #   | الاسم           | الType       | File:سطر      | Parameters |
| --- | --------------- | ------------ | ------------- | ---------- |
| 1/5 | `Plugin`        | 📐 interface | `types.ts:25` | `—`        |
| 2/5 | `PluginOptions` | 📐 interface | `types.ts:64` | `—`        |
| 3/5 | `PluginResult`  | 📐 interface | `types.ts:74` | `—`        |
| 4/5 | `PluginContext` | 📐 interface | `types.ts:86` | `—`        |
| 5/5 | `EditorPlugin`  | 📐 interface | `types.ts:96` | `—`        |

### 📁 unified-tools-registry.ts

| #   | الاسم                   | الType       | File:سطر                        | Parameters |
| --- | ----------------------- | ------------ | ------------------------------- | ---------- |
| 1/5 | `DomainType`            | 🏷️ type      | `unified-tools-registry.ts:24`  | `—`        |
| 2/5 | `ToolCategory`          | 🏷️ type      | `unified-tools-registry.ts:26`  | `—`        |
| 3/5 | `UnifiedToolDefinition` | 📐 interface | `unified-tools-registry.ts:37`  | `—`        |
| 4/5 | `UNIFIED_TOOLS`         | 📌 constant  | `unified-tools-registry.ts:49`  | `—`        |
| 5/5 | `UnifiedToolsRegistry`  | 🏗️ class     | `unified-tools-registry.ts:243` | `—`        |

### 📁 vector-editor-plugin.ts

| #   | الاسم                  | الType       | File:سطر                     | Parameters                          |
| --- | ---------------------- | ------------ | ---------------------------- | ----------------------------------- |
| 1/3 | `VectorPluginOptions`  | 📐 interface | `vector-editor-plugin.ts:44` | `—`                                 |
| 2/3 | `createVectorPlugin`   | ⚙️ function  | `vector-editor-plugin.ts:50` | `options: VectorPluginOptions = {}` |
| 3/3 | `renderVectorPathHtml` | ⚙️ function  | `vector-editor-plugin.ts:79` | `—`                                 |

---

## 📦 packages/serializers

### 📁 latex-serializer.ts

| #   | الاسم             | الType   | File:سطر                 | Parameters |
| --- | ----------------- | -------- | ------------------------ | ---------- |
| 1/1 | `LatexSerializer` | 🏗️ class | `latex-serializer.ts:52` | `—`        |

### 📁 odf-draw.ts

| #   | الاسم               | الType       | File:سطر         | Parameters |
| --- | ------------------- | ------------ | ---------------- | ---------- |
| 1/2 | `OdfDrawOptions`    | 📐 interface | `odf-draw.ts:44` | `—`        |
| 2/2 | `OdfDrawSerializer` | 🏗️ class     | `odf-draw.ts:51` | `—`        |

### 📁 odf-serializer.ts

| #   | الاسم              | الType       | File:سطر               | Parameters |
| --- | ------------------ | ------------ | ---------------------- | ---------- |
| 1/2 | `OdfExportOptions` | 📐 interface | `odf-serializer.ts:45` | `—`        |
| 2/2 | `OdfSerializer`    | 🏗️ class     | `odf-serializer.ts:52` | `—`        |

### 📁 pdf-serializer.ts

| #   | الاسم           | الType   | File:سطر               | Parameters |
| --- | --------------- | -------- | ---------------------- | ---------- |
| 1/1 | `PdfSerializer` | 🏗️ class | `pdf-serializer.ts:36` | `—`        |

### 📁 svg-serializer.ts

| #   | الاسم            | الType       | File:سطر               | Parameters |
| --- | ---------------- | ------------ | ---------------------- | ---------- |
| 1/3 | `SvgElementSpec` | 📐 interface | `svg-serializer.ts:40` | `—`        |
| 2/3 | `SvgSceneSpec`   | 📐 interface | `svg-serializer.ts:77` | `—`        |
| 3/3 | `SvgSerializer`  | 🏗️ class     | `svg-serializer.ts:86` | `—`        |

### 📁 zip-engine.ts

| #   | الاسم              | الType       | File:سطر            | Parameters         |
| --- | ------------------ | ------------ | ------------------- | ------------------ |
| 1/5 | `ZipEntry`         | 📐 interface | `zip-engine.ts:37`  | `—`                |
| 2/5 | `ExtractedZipFile` | 📐 interface | `zip-engine.ts:44`  | `—`                |
| 3/5 | `crc32`            | ⚙️ function  | `zip-engine.ts:60`  | `data: Uint8Array` |
| 4/5 | `ZipArchiveWriter` | 🏗️ class     | `zip-engine.ts:78`  | `—`                |
| 5/5 | `ZipArchiveReader` | 🏗️ class     | `zip-engine.ts:195` | `—`                |

### 📁 html-serializer.ts

| #   | الاسم            | الType   | File:سطر                | Parameters |
| --- | ---------------- | -------- | ----------------------- | ---------- |
| 1/1 | `HtmlSerializer` | 🏗️ class | `html-serializer.ts:48` | `—`        |

### 📁 markdown-serializer.ts

| #   | الاسم                | الType   | File:سطر                    | Parameters |
| --- | -------------------- | -------- | --------------------------- | ---------- |
| 1/1 | `MarkdownSerializer` | 🏗️ class | `markdown-serializer.ts:35` | `—`        |

### 📁 txt-serializer.ts

| #   | الاسم           | الType   | File:سطر               | Parameters |
| --- | --------------- | -------- | ---------------------- | ---------- |
| 1/1 | `TxtSerializer` | 🏗️ class | `txt-serializer.ts:34` | `—`        |

### 📁 docx-builders.ts

| #   | الاسم                 | الType      | File:سطر               | Parameters                                             |
| --- | --------------------- | ----------- | ---------------------- | ------------------------------------------------------ |
| 1/9 | `buildHeading`        | ⚙️ function | `docx-builders.ts:44`  | `block: ContentBlock, options: DocxConversionOptions`  |
| 2/9 | `buildParagraph`      | ⚙️ function | `docx-builders.ts:58`  | `block: ContentBlock, options: DocxConversionOptions`  |
| 3/9 | `buildList`           | ⚙️ function | `docx-builders.ts:70`  | `block: ContentBlock, options: DocxConversionOptions`  |
| 4/9 | `buildTable`          | ⚙️ function | `docx-builders.ts:88`  | `tableData: TableData, options: DocxConversionOptions` |
| 5/9 | `buildCodeBlock`      | ⚙️ function | `docx-builders.ts:150` | `block: ContentBlock, options: DocxConversionOptions`  |
| 6/9 | `buildHorizontalRule` | ⚙️ function | `docx-builders.ts:174` | `—`                                                    |
| 7/9 | `DocxElement`         | 🏷️ type     | `docx-builders.ts:188` | `—`                                                    |
| 8/9 | `buildElement`        | ⚙️ function | `docx-builders.ts:190` | `block: ContentBlock, options: DocxConversionOptions`  |
| 9/9 | `buildElements`       | ⚙️ function | `docx-builders.ts:216` | `—`                                                    |

### 📁 docx-converter.ts

| #   | الاسم                         | الType      | File:سطر                | Parameters |
| --- | ----------------------------- | ----------- | ----------------------- | ---------- |
| 1/5 | `splitIntoSections`           | ⚙️ function | `docx-converter.ts:45`  | `—`        |
| 2/5 | `buildDocument`               | ⚙️ function | `docx-converter.ts:80`  | `—`        |
| 3/5 | `convertMarkdownToDocxBuffer` | ⚙️ function | `docx-converter.ts:116` | `—`        |
| 4/5 | `convertMarkdownToDocx`       | ⚙️ function | `docx-converter.ts:144` | `—`        |
| 5/5 | `convertToDocx`               | ⚙️ function | `docx-converter.ts:171` | `—`        |

### 📁 docx-model.ts

| #     | الاسم                      | الType       | File:سطر            | Parameters |
| ----- | -------------------------- | ------------ | ------------------- | ---------- |
| 1/23  | `HeadingLevel`             | 📋 enum      | `docx-model.ts:27`  | `—`        |
| 2/23  | `AlignmentType`            | 📋 enum      | `docx-model.ts:37`  | `—`        |
| 3/23  | `LevelFormat`              | 📋 enum      | `docx-model.ts:46`  | `—`        |
| 4/23  | `BorderStyle`              | 📋 enum      | `docx-model.ts:55`  | `—`        |
| 5/23  | `WidthType`                | 📋 enum      | `docx-model.ts:63`  | `—`        |
| 6/23  | `BorderOptions`            | 📐 interface | `docx-model.ts:69`  | `—`        |
| 7/23  | `TextRunOptions`           | 📐 interface | `docx-model.ts:76`  | `—`        |
| 8/23  | `TextRun`                  | 🏗️ class     | `docx-model.ts:87`  | `—`        |
| 9/23  | `ExternalHyperlinkOptions` | 📐 interface | `docx-model.ts:133` | `—`        |
| 10/23 | `ExternalHyperlink`        | 🏗️ class     | `docx-model.ts:138` | `—`        |
| 11/23 | `ParagraphOptions`         | 📐 interface | `docx-model.ts:155` | `—`        |
| 12/23 | `Paragraph`                | 🏗️ class     | `docx-model.ts:169` | `—`        |
| 13/23 | `TableCellOptions`         | 📐 interface | `docx-model.ts:234` | `—`        |
| 14/23 | `TableCell`                | 🏗️ class     | `docx-model.ts:239` | `—`        |
| 15/23 | `TableRowOptions`          | 📐 interface | `docx-model.ts:261` | `—`        |
| 16/23 | `TableRow`                 | 🏗️ class     | `docx-model.ts:265` | `—`        |
| 17/23 | `TableOptions`             | 📐 interface | `docx-model.ts:278` | `—`        |
| 18/23 | `Table`                    | 🏗️ class     | `docx-model.ts:291` | `—`        |
| 19/23 | `DocxBodyElement`          | 🏷️ type      | `docx-model.ts:319` | `—`        |
| 20/23 | `ISectionOptions`          | 📐 interface | `docx-model.ts:321` | `—`        |
| 21/23 | `DocumentProperties`       | 📐 interface | `docx-model.ts:339` | `—`        |
| 22/23 | `Document`                 | 🏗️ class     | `docx-model.ts:364` | `—`        |
| 23/23 | `Packer`                   | 🏗️ class     | `docx-model.ts:372` | `—`        |

### 📁 docx-types.ts

| #     | الاسم                   | الType       | File:سطر            | Parameters                       |
| ----- | ----------------------- | ------------ | ------------------- | -------------------------------- |
| 1/12  | `PageSize`              | 🏷️ type      | `docx-types.ts:36`  | `—`                              |
| 2/12  | `PageMargins`           | 📐 interface | `docx-types.ts:38`  | `—`                              |
| 3/12  | `DocxConversionOptions` | 📐 interface | `docx-types.ts:45`  | `—`                              |
| 4/12  | `DocxConversionResult`  | 📐 interface | `docx-types.ts:54`  | `—`                              |
| 5/12  | `TWIPS_PER_INCH`        | 📌 constant  | `docx-types.ts:67`  | `—`                              |
| 6/12  | `TWIPS_PER_CM`          | 📌 constant  | `docx-types.ts:68`  | `—`                              |
| 7/12  | `TWIPS_PER_PT`          | 📌 constant  | `docx-types.ts:69`  | `—`                              |
| 8/12  | `DEFAULTS`              | 📌 constant  | `docx-types.ts:72`  | `—`                              |
| 9/12  | `HEADING_LEVELS`        | 📌 constant  | `docx-types.ts:89`  | `—`                              |
| 10/12 | `resolveMargins`        | ⚙️ function  | `docx-types.ts:102` | `partial?: Partial<PageMargins>` |
| 11/12 | `clampHeadingLevel`     | ⚙️ function  | `docx-types.ts:111` | `level: number`                  |
| 12/12 | `validateInputPath`     | ⚙️ function  | `docx-types.ts:117` | `inputPath: string`              |

### 📁 inline-parser.ts

| #   | الاسم                   | الType      | File:سطر               | Parameters     |
| --- | ----------------------- | ----------- | ---------------------- | -------------- |
| 1/3 | `InlineToken`           | 🏷️ type     | `inline-parser.ts:28`  | `—`            |
| 2/3 | `tokenizeInline`        | ⚙️ function | `inline-parser.ts:51`  | `text: string` |
| 3/3 | `parseInlineFormatting` | ⚙️ function | `inline-parser.ts:131` | `—`            |

### 📁 section-rules.ts

| #   | الاسم                      | الType      | File:سطر              | Parameters |
| --- | -------------------------- | ----------- | --------------------- | ---------- |
| 1/1 | `shouldCreateSectionBreak` | ⚙️ function | `section-rules.ts:27` | `—`        |

### 📁 odf-package.ts

| #   | الاسم                    | الType       | File:سطر            | Parameters |
| --- | ------------------------ | ------------ | ------------------- | ---------- |
| 1/2 | `OfficeSuitePackageData` | 📐 interface | `odf-package.ts:31` | `—`        |
| 2/2 | `OdfPackageEngine`       | 🏗️ class     | `odf-package.ts:61` | `—`        |

### 📁 frontmatter-parser.ts

| #   | الاسم                     | الType       | File:سطر                   | Parameters     |
| --- | ------------------------- | ------------ | -------------------------- | -------------- |
| 1/3 | `DocumentMetadata`        | 📐 interface | `frontmatter-parser.ts:21` | `—`            |
| 2/3 | `ParsedFrontMatterResult` | 📐 interface | `frontmatter-parser.ts:33` | `—`            |
| 3/3 | `parseFrontMatter`        | ⚙️ function  | `frontmatter-parser.ts:39` | `text: string` |

### 📁 markdown.ts

| #   | الاسم            | الType       | File:سطر         | Parameters         |
| --- | ---------------- | ------------ | ---------------- | ------------------ |
| 1/4 | `TableData`      | 📐 interface | `markdown.ts:25` | `—`                |
| 2/4 | `ContentBlock`   | 📐 interface | `markdown.ts:30` | `—`                |
| 3/4 | `ParsedMarkdown` | 📐 interface | `markdown.ts:38` | `—`                |
| 4/4 | `parseMarkdown`  | ⚙️ function  | `markdown.ts:42` | `markdown: string` |

---

## 📦 packages/storage

### 📁 indexeddb-utils.ts

| #   | الاسم                  | الType       | File:سطر                 | Parameters                                   |
| --- | ---------------------- | ------------ | ------------------------ | -------------------------------------------- |
| 1/7 | `IDBOpenOptions`       | 📐 interface | `indexeddb-utils.ts:60`  | `—`                                          |
| 2/7 | `IndexedDBError`       | 🏗️ class     | `indexeddb-utils.ts:66`  | `—`                                          |
| 3/7 | `isIndexedDBAvailable` | ⚙️ function  | `indexeddb-utils.ts:78`  | `—`                                          |
| 4/7 | `wrapRequest`          | ⚙️ function  | `indexeddb-utils.ts:90`  | `request: IDBRequest<T>`                     |
| 5/7 | `openDatabase`         | ⚙️ function  | `indexeddb-utils.ts:105` | `name: string, options: IDBOpenOptions = {}` |
| 6/7 | `deleteDatabase`       | ⚙️ function  | `indexeddb-utils.ts:156` | `name: string`                               |
| 7/7 | `databaseExists`       | ⚙️ function  | `indexeddb-utils.ts:180` | `name: string`                               |

### 📁 indexeddb.ts

| #   | الاسم            | الType      | File:سطر           | Parameters |
| --- | ---------------- | ----------- | ------------------ | ---------- |
| 1/2 | `IndexedDBStore` | 🏗️ class    | `indexeddb.ts:30`  | `—`        |
| 2/2 | `indexedDBStore` | 📌 constant | `indexeddb.ts:112` | `—`        |

### 📁 localStorage.ts

| #   | الاسم               | الType      | File:سطر             | Parameters |
| --- | ------------------- | ----------- | -------------------- | ---------- |
| 1/2 | `LocalStorageStore` | 🏗️ class    | `localStorage.ts:28` | `—`        |
| 2/2 | `localStorageStore` | 📌 constant | `localStorage.ts:84` | `—`        |

### 📁 memory.ts

| #   | الاسم         | الType       | File:سطر       | Parameters |
| --- | ------------- | ------------ | -------------- | ---------- |
| 1/3 | `StorageItem` | 📐 interface | `memory.ts:31` | `—`        |
| 2/3 | `MemoryStore` | 🏗️ class     | `memory.ts:37` | `—`        |
| 3/3 | `memoryStore` | 📌 constant  | `memory.ts:74` | `—`        |

### 📁 snapshots.ts

| #   | الاسم             | الType       | File:سطر          | Parameters |
| --- | ----------------- | ------------ | ----------------- | ---------- |
| 1/2 | `Snapshot`        | 📐 interface | `snapshots.ts:30` | `—`        |
| 2/2 | `SnapshotManager` | 🏗️ class     | `snapshots.ts:37` | `—`        |

### 📁 storage-utils.ts

| #   | الاسم                     | الType      | File:سطر               | Parameters                            |
| --- | ------------------------- | ----------- | ---------------------- | ------------------------------------- |
| 1/9 | `QuotaExceededError`      | 🏗️ class    | `storage-utils.ts:30`  | `—`                                   |
| 2/9 | `StorageUnavailableError` | 🏗️ class    | `storage-utils.ts:41`  | `—`                                   |
| 3/9 | `isQuotaExceededError`    | ⚙️ function | `storage-utils.ts:54`  | `err: unknown`                        |
| 4/9 | `isLocalStorageAvailable` | ⚙️ function | `storage-utils.ts:69`  | `—`                                   |
| 5/9 | `SafeJsonResult`          | 🏷️ type     | `storage-utils.ts:86`  | `—`                                   |
| 6/9 | `safeJsonParse`           | ⚙️ function | `storage-utils.ts:91`  | `raw: string                          | null` |
| 7/9 | `safeJsonStringify`       | ⚙️ function | `storage-utils.ts:109` | `value: unknown`                      |
| 8/9 | `prefixKey`               | ⚙️ function | `storage-utils.ts:120` | `prefix: string, key: string`         |
| 9/9 | `unprefixKey`             | ⚙️ function | `storage-utils.ts:127` | `prefix: string, prefixedKey: string` |

### 📁 types.ts

| #     | الاسم                  | الType       | File:سطر       | Parameters       |
| ----- | ---------------------- | ------------ | -------------- | ---------------- |
| 1/17  | `StoreEventType`       | 📌 constant  | `types.ts:65`  | `—`              |
| 2/17  | `StoreEventTypeValue`  | 🏷️ type      | `types.ts:71`  | `—`              |
| 3/17  | `StoreEvent`           | 📐 interface | `types.ts:74`  | `—`              |
| 4/17  | `StoreEventListener`   | 🏷️ type      | `types.ts:82`  | `—`              |
| 5/17  | `UnsubscribeFn`        | 🏷️ type      | `types.ts:85`  | `—`              |
| 6/17  | `StoreMetadata`        | 📐 interface | `types.ts:92`  | `—`              |
| 7/17  | `StoreEntry`           | 📐 interface | `types.ts:100` | `—`              |
| 8/17  | `StoreConfig`          | 📐 interface | `types.ts:111` | `—`              |
| 9/17  | `DEFAULT_STORE_CONFIG` | 📌 constant  | `types.ts:120` | `—`              |
| 10/17 | `Store`                | 📐 interface | `types.ts:136` | `—`              |
| 11/17 | `AsyncStore`           | 📐 interface | `types.ts:156` | `—`              |
| 12/17 | `isValidKey`           | ⚙️ function  | `types.ts:180` | `key: unknown`   |
| 13/17 | `validateKey`          | ⚙️ function  | `types.ts:188` | `key: unknown`   |
| 14/17 | `createStoreEntry`     | ⚙️ function  | `types.ts:195` | `—`              |
| 15/17 | `isStoreEntry`         | ⚙️ function  | `types.ts:218` | `value: unknown` |
| 16/17 | `deepClone`            | ⚙️ function  | `types.ts:237` | `—`              |
| 17/17 | `DocStore`             | 🏷️ type      | `types.ts:247` | `—`              |

---

## 📦 packages/templates

### 📁 index.ts

| #     | الاسم                            | الType      | File:سطر       | Parameters |
| ----- | -------------------------------- | ----------- | -------------- | ---------- |
| 1/10  | `customerRecordsTemplate`        | 📌 constant | `index.ts:18`  | `—`        |
| 2/10  | `arabicNameSearchCensusTemplate` | 📌 constant | `index.ts:49`  | `—`        |
| 3/10  | `baseTemplates`                  | 📌 constant | `index.ts:101` | `—`        |
| 4/10  | `budgetTemplate`                 | 📌 constant | `index.ts:18`  | `—`        |
| 5/10  | `incidentCensusTemplate`         | 📌 constant | `index.ts:55`  | `—`        |
| 6/10  | `inventoryAuditTemplate`         | 📌 constant | `index.ts:137` | `—`        |
| 7/10  | `comparativeStatisticsTemplate`  | 📌 constant | `index.ts:208` | `—`        |
| 8/10  | `calcTemplates`                  | 📌 constant | `index.ts:259` | `—`        |
| 9/10  | `presentationTemplate`           | 📌 constant | `index.ts:18`  | `—`        |
| 10/10 | `impressTemplates`               | 📌 constant | `index.ts:40`  | `—`        |

### 📁 calc-templates.ts

| #   | الاسم                      | الType      | File:سطر                | Parameters                            |
| --- | -------------------------- | ----------- | ----------------------- | ------------------------------------- |
| 1/5 | `createBudgetTemplate`     | ⚙️ function | `calc-templates.ts:115` | `—`                                   |
| 2/5 | `createTrackerTemplate`    | ⚙️ function | `calc-templates.ts:158` | `—`                                   |
| 3/5 | `createStatisticsTemplate` | ⚙️ function | `calc-templates.ts:209` | `—`                                   |
| 4/5 | `registerCalcTemplates`    | ⚙️ function | `calc-templates.ts:258` | `registry: TemplateRegistry<DocNode>` |
| 5/5 | `getCalcTemplates`         | ⚙️ function | `calc-templates.ts:274` | `—`                                   |

### 📁 registry-types.ts

| #     | الاسم                    | الType       | File:سطر                | Parameters          |
| ----- | ------------------------ | ------------ | ----------------------- | ------------------- |
| 1/24  | `TemplateDomain`         | 📌 constant  | `registry-types.ts:48`  | `—`                 |
| 2/24  | `TemplateDomainValue`    | 🏷️ type      | `registry-types.ts:56`  | `—`                 |
| 3/24  | `OfficeDomain`           | 🏷️ type      | `registry-types.ts:57`  | `—`                 |
| 4/24  | `TemplateEventType`      | 📌 constant  | `registry-types.ts:63`  | `—`                 |
| 5/24  | `TemplateEventTypeValue` | 🏷️ type      | `registry-types.ts:72`  | `—`                 |
| 6/24  | `TemplateStyle`          | 📌 constant  | `registry-types.ts:78`  | `—`                 |
| 7/24  | `TemplateStyleValue`     | 🏷️ type      | `registry-types.ts:87`  | `—`                 |
| 8/24  | `TemplateMetadata`       | 📐 interface | `registry-types.ts:93`  | `—`                 |
| 9/24  | `Template`               | 📐 interface | `registry-types.ts:103` | `—`                 |
| 10/24 | `DocumentTemplate`       | 🏷️ type      | `registry-types.ts:116` | `—`                 |
| 11/24 | `TemplateEvent`          | 📐 interface | `registry-types.ts:118` | `—`                 |
| 12/24 | `TemplateEventListener`  | 🏷️ type      | `registry-types.ts:126` | `—`                 |
| 13/24 | `TemplateUnsubscribeFn`  | 🏷️ type      | `registry-types.ts:128` | `—`                 |
| 14/24 | `TemplateQuery`          | 📐 interface | `registry-types.ts:134` | `—`                 |
| 15/24 | `ContentGuard`           | 🏷️ type      | `registry-types.ts:145` | `—`                 |
| 16/24 | `defaultContentGuard`    | 📌 constant  | `registry-types.ts:147` | `—`                 |
| 17/24 | `DomainValidator`        | 🏷️ type      | `registry-types.ts:153` | `—`                 |
| 18/24 | `CloneContentFn`         | 🏷️ type      | `registry-types.ts:159` | `—`                 |
| 19/24 | `defaultCloneContent`    | ⚙️ function  | `registry-types.ts:161` | `content: TContent` |
| 20/24 | `TemplateStorage`        | 📐 interface | `registry-types.ts:176` | `—`                 |
| 21/24 | `TemplateRegistryConfig` | 📐 interface | `registry-types.ts:186` | `—`                 |
| 22/24 | `ResolvedConfig`         | 📐 interface | `registry-types.ts:196` | `—`                 |
| 23/24 | `resolveConfig`          | ⚙️ function  | `registry-types.ts:206` | `—`                 |
| 24/24 | `escapeRegExp`           | ⚙️ function  | `registry-types.ts:230` | `text: string`      |

### 📁 registry.ts

| #   | الاسم                    | الType      | File:سطر          | Parameters          |
| --- | ------------------------ | ----------- | ----------------- | ------------------- |
| 1/3 | `TemplateRegistry`       | 🏗️ class    | `registry.ts:86`  | `—`                 |
| 2/3 | `createTemplateRegistry` | ⚙️ function | `registry.ts:435` | `'@libretext/core'` |
| 3/3 | `templateRegistry`       | 📌 constant | `registry.ts:442` | `—`                 |

### 📁 writer-templates.ts

| #   | الاسم                     | الType      | File:سطر                  | Parameters                            |
| --- | ------------------------- | ----------- | ------------------------- | ------------------------------------- |
| 1/6 | `createLetterTemplate`    | ⚙️ function | `writer-templates.ts:77`  | `—`                                   |
| 2/6 | `createReportTemplate`    | ⚙️ function | `writer-templates.ts:178` | `—`                                   |
| 3/6 | `createEssayTemplate`     | ⚙️ function | `writer-templates.ts:290` | `—`                                   |
| 4/6 | `createResumeTemplate`    | ⚙️ function | `writer-templates.ts:398` | `—`                                   |
| 5/6 | `registerWriterTemplates` | ⚙️ function | `writer-templates.ts:530` | `registry: TemplateRegistry<DocNode>` |
| 6/6 | `getWriterTemplates`      | ⚙️ function | `writer-templates.ts:547` | `—`                                   |

---
