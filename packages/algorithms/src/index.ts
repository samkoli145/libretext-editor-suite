/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/algorithms/src/index.ts
 * 🎯 الهدف الرئيسي: تصدير محتويات مكتبة الخوارزميات (Barrel Export)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Command Pattern Exports
export * from './command/types';
export {
  CommandExecutor,
  SpatialCommandHandler,
  TextCommandHandler,
  FormulaCommandHandler,
  executeCommand,
  undoCommand,
} from './command/executor';
export type { CommandOpResult } from './command/executor';
export * from './command/registry';

// Formula AST & Evaluator Exports
export * from './formula/ast';
export * from './formula/tokenizer';
export * from './formula/parser';
export * from './formula/functions';
export { CEILING, TRUNC, MEDIAN, MODE, COUNTBLANK, COUNTIF, SUMIF } from './formula/functions-math';
export {
  CLEAN,
  LEFT,
  RIGHT,
  MID,
  PROPER,
  SUBSTITUTE,
  REPLACE,
  TEXTJOIN,
  EXACT,
  REPT,
  SEARCH,
  FIND,
} from './formula/functions-text';
export * from './formula/functions-arabic';
export * from './formula/functions-financial';
export * from './formula/evaluator';
export * from './formula/evaluator-types';
export * from './formula/cell-utils';
export * from './formula/dependency-graph';
export * from './formula/registry';
export {
  MATCH,
  INDEX,
  VLOOKUP,
  XLOOKUP,
  IFS,
  SWITCH,
  DATE,
  TODAY,
  NOW,
  DATEDIF,
} from './formula/functions-lookup-date';

// Matrix & Lambda Functions
export * from './formula/functions-matrix';

// Markdown Formula Engine
export * from './formula/markdown-formula';

// LaTeX Engine
export * from './formula/latex-engine';

// Markdown Engine
export * from './formula/markdown-engine';

// Macro System Exports
export * from './macro/types';
export { MacroRecorder } from './macro/recorder';
export { MacroRunner } from './macro/runner';
export { MacroRegistry, macroRegistry } from './macro/registry';

// Spatial Translation Exports
export * from './spatial/types';
export * from './spatial/mapper';
export * from './spatial/transformer';
export * from './spatial/collision';
export * from './spatial/vector-path';
export * from './spatial/bezier-engine';
export * from './spatial/alignment-engine';
export * from './spatial/boolean-ops';
export * from './spatial/connector-routing';
export * from './spatial/matrix-2d';
export * from './spatial/smart-guides';
export * from './spatial/mouse-diagnostics';
export * from './spatial/spatial-drag-algorithms';
export * from './spatial/auto-layout-engine';
export * from './spatial/artboard-types';
export {
  type SpatialOpValue,
  type MoveCommand,
  type ResizeCommand,
  type SelectCommand,
  type DeleteCommand,
  type CreateCommand,
  type MoveDelta,
  SpatialOp,
  createMoveCommand,
  createResizeCommand,
  createSelectCommand,
  createDeleteCommand,
  createCreateCommand,
  computeMoveDelta,
  toBoundingBox,
} from './spatial/commands';

// Search & Replace Exports
export * from './search/types';
export * from './search/find-replace-engine';

// Simulation Exports
export * from './simulation/context';
export { type SimulationAction, simulate, simulateSingle } from './simulation/simulator';

// Graph Algorithms (from algorithms-studio)
export {
  detectCycle,
  topologicalSort,
  getCircularError,
  getRecalculationOrder,
} from './graph/dependency';
export {
  routeAStarVisibility,
  getNodeAnchorPoint,
  findOrthogonalRoute,
  pointInBox,
} from './graph/routing';
export {
  simplifyCollinearPoints,
  generateSmoothCurvedPath,
  computeDiagramRoute,
} from './graph/orthogonal-router';

// Tree Structures (from algorithms-studio)
export { LLRBTree } from './tree/llrb';

// Structure Algorithms (from algorithms-studio)
export { DisjointSet } from './structure/disjoint-set';

// Sort Algorithms (from algorithms-studio)
export { bottomUpMergeSort } from './sort/mergesort';

// Lookup Functions (from algorithms-studio)
export { HLOOKUP } from './lookup/hlookup';

// Arabic Function Aliases (from algorithms-studio)
export { normalizeFunctionName, ARABIC_FUNCTION_MAP } from './formula/arabic-aliases';

// Street Name Search Engine (from algorithms-studio)
export {
  calculateLevenshteinDistance,
  calculateStringSimilarity,
  analyzeDuplicateStreetNames,
  findSimilarStreetPairs,
} from './streets/similarity';

// Vector & Interaction Algorithms
export {
  type Point2D as VecPoint2D,
  type BoundingBox as VecBoundingBox,
  type VectorMatrix2D,
  generateId,
  clamp,
  degToRad,
  radToDeg,
  normalizeAngle,
  distance,
  angle,
  lerp,
  lerpPoint,
  rotatePoint,
  getBounds,
  isPointInBox,
  rectsIntersect,
  deepClone,
  debounce,
  throttle,
} from './vector/common';
export {
  CoordinateSystem,
  defaultCoordinateSystem,
  type Point as VecPoint,
  type Viewport,
  type GridConfig as VecGridConfig,
} from './vector/coordinate-system';
export {
  stylesObjectToString,
  columnSizeToPercentage,
  calculateNewColumnSize,
  calculateResizedDimensions,
  calculateRotationAngle,
  isPointInPolygon,
  type ResizeState,
} from './vector/mouse-algorithms';
export {
  SmartAlignmentSystem,
  defaultSmartAlignment,
  type RectBounds,
  type AlignmentGuide,
  type AlignmentResult,
} from './vector/smart-alignment';

// Shared Types
export type { Point2D, AABB, DependencyGraphData, CycleDetectionResult } from './types';
