# 🏷️ Atomic Inventory — جرد ذري شامل

> **تاريخ آخر تحديث:** 2026-08-21
> **إجمالي الملفات:** 160
> **نشط:** 144 | **مكرر:** 4 | **غير مستخدم:** 3 | **كبير:** 9

---

## 🔴 المكرر (Duplicates) — 4 ملف

| الملف                                           | الأسطر | مكرر من                                         |
| ----------------------------------------------- | ------ | ----------------------------------------------- |
| `core/src/parsers/frontmatter-parser.ts`        | 97     | `serializers/src/parsers/frontmatter-parser.ts` |
| `core/src/parsers/markdown.ts`                  | 157    | `serializers/src/parsers/markdown.ts`           |
| `serializers/src/parsers/frontmatter-parser.ts` | 97     | `core/src/parsers/frontmatter-parser.ts`        |
| `serializers/src/parsers/markdown.ts`           | 157    | `core/src/parsers/markdown.ts`                  |

## 🟡 غير مستخدم (Unused) — 3 ملف

| الملف                                  | الأسطر | السبب                            |
| -------------------------------------- | ------ | -------------------------------- |
| `core/src/utils/document-validator.ts` | 255    | Never imported by any other file |
| `serializers/src/odf-package.ts`       | 134    | Never imported by any other file |
| `templates/src/calc/calc-templates.ts` | 277    | Never imported by any other file |

## 🟠 كبير (Oversized >400 lines) — 9 ملف

| الملف                                               | الأسطر | ملاحظة                                              |
| --------------------------------------------------- | ------ | --------------------------------------------------- |
| `algorithms/src/formula/functions-matrix.ts`        | 847    | 847 lines — needs splitting (50 lines/function max) |
| `algorithms/src/formula/markdown-formula.ts`        | 559    | 559 lines — needs splitting (50 lines/function max) |
| `algorithms/src/spatial/vector-path.ts`             | 445    | 445 lines — needs splitting (50 lines/function max) |
| `core/src/converters/universal-format-converter.ts` | 415    | 415 lines — needs splitting (50 lines/function max) |
| `core/src/utils/formula-parser.ts`                  | 405    | 405 lines — needs splitting (50 lines/function max) |
| `plugins/src/canvas-designer/schema-registry.ts`    | 443    | 443 lines — needs splitting (50 lines/function max) |
| `serializers/src/docx/docx-model.ts`                | 472    | 472 lines — needs splitting (50 lines/function max) |
| `templates/src/registry.ts`                         | 443    | 443 lines — needs splitting (50 lines/function max) |
| `templates/src/writer/writer-templates.ts`          | 555    | 555 lines — needs splitting (50 lines/function max) |

## 🟢 نشط (Active) — 144 ملف

| الملف                                                   | الأسطر | الأولوية |
| ------------------------------------------------------- | ------ | -------- |
| `adapters/src/index.ts`                                 | 21     | medium   |
| `adapters/src/react/index.ts`                           | 17     | medium   |
| `adapters/src/react/react-adapter.ts`                   | 150    | medium   |
| `adapters/src/shared/index.ts`                          | 27     | medium   |
| `adapters/src/shared/spatial-adapter.ts`                | 103    | medium   |
| `adapters/src/shared/types.ts`                          | 75     | medium   |
| `adapters/src/vanilla/index.ts`                         | 17     | medium   |
| `adapters/src/vanilla/vanilla-adapter.ts`               | 135    | medium   |
| `adapters/src/vue/index.ts`                             | 17     | medium   |
| `adapters/src/vue/vue-adapter.ts`                       | 136    | medium   |
| `adapters/src/web-component/index.ts`                   | 17     | medium   |
| `adapters/src/web-component/web-component-adapter.ts`   | 136    | medium   |
| `algorithms/src/command/executor.ts`                    | 254    | medium   |
| `algorithms/src/command/registry.ts`                    | 240    | medium   |
| `algorithms/src/command/types.ts`                       | 131    | medium   |
| `algorithms/src/formula/arabic-aliases.ts`              | 102    | medium   |
| `algorithms/src/formula/ast.ts`                         | 104    | medium   |
| `algorithms/src/formula/cell-utils.ts`                  | 106    | medium   |
| `algorithms/src/formula/dependency-graph.ts`            | 311    | medium   |
| `algorithms/src/formula/evaluator-types.ts`             | 37     | medium   |
| `algorithms/src/formula/evaluator.ts`                   | 241    | medium   |
| `algorithms/src/formula/functions-arabic.ts`            | 379    | medium   |
| `algorithms/src/formula/functions-financial.ts`         | 205    | medium   |
| `algorithms/src/formula/functions-lookup-date.ts`       | 296    | medium   |
| `algorithms/src/formula/functions-math.ts`              | 246    | medium   |
| `algorithms/src/formula/functions-text.ts`              | 220    | medium   |
| `algorithms/src/formula/functions.ts`                   | 291    | medium   |
| `algorithms/src/formula/latex-engine.ts`                | 166    | medium   |
| `algorithms/src/formula/markdown-engine.ts`             | 197    | medium   |
| `algorithms/src/formula/parser.ts`                      | 248    | medium   |
| `algorithms/src/formula/registry.ts`                    | 214    | medium   |
| `algorithms/src/formula/tokenizer.ts`                   | 262    | medium   |
| `algorithms/src/graph/dependency.ts`                    | 242    | medium   |
| `algorithms/src/graph/orthogonal-router.ts`             | 321    | medium   |
| `algorithms/src/graph/routing-types.ts`                 | 89     | medium   |
| `algorithms/src/graph/routing.ts`                       | 54     | medium   |
| `algorithms/src/index.ts`                               | 210    | medium   |
| `algorithms/src/lookup/hlookup.ts`                      | 166    | medium   |
| `algorithms/src/macro/index.ts`                         | 19     | medium   |
| `algorithms/src/macro/recorder.ts`                      | 144    | medium   |
| `algorithms/src/macro/registry.ts`                      | 87     | medium   |
| `algorithms/src/macro/runner.ts`                        | 129    | medium   |
| `algorithms/src/macro/types.ts`                         | 123    | medium   |
| `algorithms/src/search/find-replace-engine.ts`          | 161    | medium   |
| `algorithms/src/search/index.ts`                        | 18     | medium   |
| `algorithms/src/search/types.ts`                        | 61     | medium   |
| `algorithms/src/simulation/context.ts`                  | 59     | medium   |
| `algorithms/src/simulation/simulator.ts`                | 60     | medium   |
| `algorithms/src/sort/mergesort.ts`                      | 128    | medium   |
| `algorithms/src/spatial/alignment-engine.ts`            | 178    | medium   |
| `algorithms/src/spatial/bezier-engine.ts`               | 233    | medium   |
| `algorithms/src/spatial/boolean-ops.ts`                 | 100    | medium   |
| `algorithms/src/spatial/collision.ts`                   | 344    | medium   |
| `algorithms/src/spatial/commands.ts`                    | 228    | medium   |
| `algorithms/src/spatial/connector-routing.ts`           | 234    | medium   |
| `algorithms/src/spatial/mapper.ts`                      | 283    | medium   |
| `algorithms/src/spatial/matrix-2d.ts`                   | 179    | medium   |
| `algorithms/src/spatial/smart-guides.ts`                | 230    | medium   |
| `algorithms/src/spatial/transformer.ts`                 | 315    | medium   |
| `algorithms/src/spatial/types.ts`                       | 199    | medium   |
| `algorithms/src/streets/arabic-utils.ts`                | 95     | medium   |
| `algorithms/src/streets/index.ts`                       | 23     | medium   |
| `algorithms/src/streets/sample-data.ts`                 | 173    | medium   |
| `algorithms/src/streets/search-engine.ts`               | 151    | medium   |
| `algorithms/src/streets/similarity.ts`                  | 168    | medium   |
| `algorithms/src/streets/types.ts`                       | 92     | medium   |
| `algorithms/src/structure/disjoint-set.ts`              | 204    | medium   |
| `algorithms/src/tree/llrb.ts`                           | 226    | medium   |
| `algorithms/src/types.ts`                               | 67     | medium   |
| `algorithms/src/vector/common.ts`                       | 157    | medium   |
| `algorithms/src/vector/coordinate-system.ts`            | 119    | medium   |
| `algorithms/src/vector/index.ts`                        | 20     | medium   |
| `algorithms/src/vector/mouse-algorithms.ts`             | 125    | medium   |
| `algorithms/src/vector/smart-alignment.ts`              | 103    | medium   |
| `core/src/ast/builder.ts`                               | 166    | medium   |
| `core/src/ast/schema.ts`                                | 251    | medium   |
| `core/src/ast/types.ts`                                 | 276    | medium   |
| `core/src/engines/file-type-detection.ts`               | 268    | medium   |
| `core/src/engines/html-pipeline.ts`                     | 177    | medium   |
| `core/src/engines/image-pipeline.ts`                    | 347    | medium   |
| `core/src/engines/unified-ingestion.ts`                 | 211    | medium   |
| `core/src/engines/validation.ts`                        | 106    | medium   |
| `core/src/index.ts`                                     | 128    | medium   |
| `core/src/indexer/indexer.ts`                           | 136    | medium   |
| `core/src/indexer/search.ts`                            | 107    | medium   |
| `core/src/state/editor-state.ts`                        | 210    | medium   |
| `core/src/state/history.ts`                             | 131    | medium   |
| `core/src/state/operations.ts`                          | 239    | medium   |
| `core/src/state/tree.ts`                                | 243    | medium   |
| `core/src/types.ts`                                     | 105    | medium   |
| `core/src/utils/arabic-text.ts`                         | 229    | medium   |
| `core/src/utils/compose.ts`                             | 28     | medium   |
| `core/src/utils/content-validator.ts`                   | 207    | medium   |
| `core/src/utils/id.ts`                                  | 71     | medium   |
| `core/src/utils/pipe.ts`                                | 35     | medium   |
| `core/src/utils/validation.ts`                          | 267    | medium   |
| `plugins/src/canvas-designer/canvas-designer-plugin.ts` | 110    | medium   |
| `plugins/src/canvas-designer/index.ts`                  | 19     | medium   |
| `plugins/src/canvas-designer/layer-tree-engine.ts`      | 218    | medium   |
| `plugins/src/canvas-designer/schema-types.ts`           | 108    | medium   |
| `plugins/src/index.ts`                                  | 23     | medium   |
| `plugins/src/math/index.ts`                             | 17     | medium   |
| `plugins/src/math/math-plugin.ts`                       | 214    | medium   |
| `plugins/src/mermaid/index.ts`                          | 17     | medium   |
| `plugins/src/mermaid/mermaid-plugin.ts`                 | 201    | medium   |
| `plugins/src/registry.ts`                               | 195    | medium   |
| `plugins/src/shared/index.ts`                           | 17     | medium   |
| `plugins/src/shared/types.ts`                           | 108    | medium   |
| `plugins/src/shared-tools/index.ts`                     | 16     | medium   |
| `plugins/src/shared-tools/unified-tools-registry.ts`    | 267    | medium   |
| `plugins/src/vector/index.ts`                           | 16     | medium   |
| `plugins/src/vector/vector-editor-plugin.ts`            | 90     | medium   |
| `serializers/src/advanced/index.ts`                     | 22     | medium   |
| `serializers/src/advanced/latex-serializer.ts`          | 183    | medium   |
| `serializers/src/advanced/odf-draw.ts`                  | 275    | medium   |
| `serializers/src/advanced/odf-serializer.ts`            | 326    | medium   |
| `serializers/src/advanced/pdf-serializer.ts`            | 150    | medium   |
| `serializers/src/advanced/svg-serializer.ts`            | 267    | medium   |
| `serializers/src/advanced/zip-engine.ts`                | 294    | medium   |
| `serializers/src/basic/html-serializer.ts`              | 141    | medium   |
| `serializers/src/basic/index.ts`                        | 21     | medium   |
| `serializers/src/basic/markdown-serializer.ts`          | 135    | medium   |
| `serializers/src/basic/txt-serializer.ts`               | 124    | medium   |
| `serializers/src/docx/docx-builders.ts`                 | 222    | medium   |
| `serializers/src/docx/docx-converter.ts`                | 216    | medium   |
| `serializers/src/docx/docx-types.ts`                    | 125    | medium   |
| `serializers/src/docx/index.ts`                         | 26     | medium   |
| `serializers/src/docx/inline-parser.ts`                 | 182    | medium   |
| `serializers/src/docx/section-rules.ts`                 | 51     | medium   |
| `serializers/src/index.ts`                              | 21     | medium   |
| `storage/src/index.ts`                                  | 22     | medium   |
| `storage/src/indexeddb-utils.ts`                        | 199    | medium   |
| `storage/src/indexeddb.ts`                              | 113    | medium   |
| `storage/src/localStorage.ts`                           | 85     | medium   |
| `storage/src/memory.ts`                                 | 75     | medium   |
| `storage/src/snapshots.ts`                              | 93     | medium   |
| `storage/src/storage-utils.ts`                          | 133    | medium   |
| `storage/src/types.ts`                                  | 248    | medium   |
| `templates/src/base/index.ts`                           | 105    | medium   |
| `templates/src/calc/index.ts`                           | 265    | medium   |
| `templates/src/impress/index.ts`                        | 41     | medium   |
| `templates/src/index.ts`                                | 31     | medium   |
| `templates/src/registry-types.ts`                       | 233    | medium   |
| `templates/src/writer/index.ts`                         | 24     | medium   |
