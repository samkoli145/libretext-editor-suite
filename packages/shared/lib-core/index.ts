/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: نقطة التصدير المركزية لنواة المكتبة المعمارية المشتركة
 * 🏛️ الدور: فهرس تصدير - re-export جميع المحركات المعزولة
 * 📥 المستهلك: كل ملفات المشروع (محررات، خدمات، محركات)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Core Barrel Export: تصدير نواة بدون اعتماديات
 *    مع 9 فئات رئيسية مع تجنب تضارب الأسماء (Name Conflict Resolution)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التصدير يجب أن يكون كاملاً لجميع المحركات
 *    2. منع التضارب بين Grid Engine و Computational Notebook في ColumnType و EvalContext
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

export * from './archive/zip-engine';

// ─── 2. Converters Suite ───
export * from './converters/cad-vector-engine';
export * from './converters/document-markup-engine';
export * from './converters/image-format-engine';
export * from './converters/obsidian-vault-import-engine';
export * from './converters/odf-engine';
export * from './converters/schema-data-engine';
export * from './converters/universal-export-hub';
export * from './converters/web-components-engine';

// ─── 3. Geometry & Math Engine ───
export * from './geometry/bezier-curves';
export * from './geometry/bezier-editing-tool';
export * from './geometry/bounding-box';
export * from './geometry/connector-rerouting-engine';
export * from './geometry/line-connector-geometry';
export * from './geometry/snap-align-engine';

// ─── 4. Events & Viewport Engine ───
export * from './events/comments-anchoring-engine';
export * from './events/dockable-tab-engine';
export * from './events/drag-selection-engine';
export * from './events/sub-editor-orchestrator';
export * from './events/universal-context-menu';
export * from './events/viewport-pan-zoom';

// ─── 5. Document Pipeline & History ───
export * from './document-pipeline/block-document-model';
export * from './document-pipeline/clip-payload-engine';
export * from './document-pipeline/comments-thread-engine';
export * from './document-pipeline/content-addressed-asset-engine';
export * from './document-pipeline/dynamic-fields-engine';
export * from './document-pipeline/find-replace-engine';
export * from './document-pipeline/history-diff-engine';
export * from './document-pipeline/html-sanitizer';
export * from './document-pipeline/markdown-caret-engine';
export * from './document-pipeline/plan-apply-agent-engine';
export * from './document-pipeline/schema-driven-fields-engine';
export * from './document-pipeline/smart-clipboard-engine';
export * from './document-pipeline/tag-aware-find-replace';

// ─── 5.1. Animation & Motion Morph Engine ───
export * from './animation/motion-morph-engine';
export * from './animation/motion-path-tooling-engine';

// ─── 5.2. Collaboration & Peer Awareness Engine ───
export * from './collaboration/peer-awareness-engine';

// ─── 6. Raster & Image Filters Engine ───
export * from './raster/brush-engine';
export * from './raster/color-combine-engine';
export * from './raster/image-filters-engine';
export * from './raster/image-processing-core';
export * from './raster/color-curves-histogram';
export * from './raster/background-removal-matte';
export * from './raster/dithering-quantization-engine';
export * from './raster/vector-tracer-engine';
export * from './raster/morphology-convolution-engine';
export * from './raster/layer-blend-engine';

// ─── 7. Code Interpreter & WYSIWYG Live Engine ───
export * from './code-interpreter/live-interpreter-engine';
export * from './code-interpreter/code-sandbox-runner';
export * from './code-interpreter/regex-tester-engine';
export * from './code-interpreter/css-generator-engine';

// ─── 8. Data Grid & Spreadsheet Engine ───
export * from './grid-engine';
export * from './grid-engine/linked-chart-bridge';

// ─── 9. Computational Notebook & Persistent Scratchpad Engine ───
export {
  type ScratchpadColumnType,
  type ScratchpadVar,
  type ComputedVar,
  type ScratchpadLine,
  type Notebook,
  type ScratchpadEvalContext,
  type ScratchpadEvent,
  isValidVarName,
  isValidVarId,
  isScratchpadError,
  normalizeVar as normalizeScratchpadVar,
  normalizeNotebook as normalizeScratchpadNotebook,
  ScratchpadError,
  ERR_REF,
  ERR_CYCLE,
  ERR_VALUE,
  ERR_DIV0,
  ERR_NAME,
  type ScratchpadPatch,
  generateVarId,
  findVar,
  setScratchpadVar,
  deleteScratchpadVar,
  renameScratchpadVar,
  createNotebook,
  deleteNotebook,
  renameNotebook,
  parse as parseScratchpadExpression,
  tokenize as tokenizeScratchpadExpression,
  extractVariables as extractScratchpadVariables,
  type ASTNode as ScratchpadASTNode,
  type Token as ScratchpadToken,
  type TokenType as ScratchpadTokenType,
  ScratchpadIndexedQueue,
  DependencyGraph as ScratchpadDependencyGraph,
  buildGraphFromExpressions,
  topologicalSort,
  ScratchpadEngine,
  getScratchpadEngine,
  resetScratchpadEngine,
  ScratchpadStore,
  getScratchpadStore,
  type NotebookSnapshot,
  ScratchpadBindings,
  getScratchpadBindings,
  type ScratchpadBinding,
  runNegativeControlTests,
  type TestResult,
  type TestResult as ScratchpadTestResult,
  type CalcVal,
  type UnitCalcContext,
  evaluateCalc,
  formatCalcVal,
  asksForAnswer,
  parseDefinition,
  answerCalc,
  freshCalcContext,
  feedCalcLine,
  buildPageCalcContext,
} from './computational-notebook';

// ─── 10. Self-Healing Doctor & Diagnostics Engine ───
export * from '../engines/DoctorSelfHealingEngine';
