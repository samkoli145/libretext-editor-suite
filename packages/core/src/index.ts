/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/core/src/index.ts
 * 🎯 الهدف الرئيسي: التصدير العام لجميع واجهات ودوال النواة.
 * 📋 المعايير:
 *    - يجب أن يصدّر جميع الأنواع والدوال العامة.
 *    - يجب ألا يصدّر شيئاً خاصاً (internal).
 * 🧪 الاختبارات: لا توجد اختبارات مباشرة.
 * 🏷️ المعرف: CORE-011
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Barrel Export — تصدير مركّز من نقطة واحدة.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── الأنواع ───
export type {
  NodeId,
  InlineNodeType,
  BlockNodeType,
  MarkType,
  Mark,
  LogicalPosition,
  TextNode,
  BoldNode,
  ItalicNode,
  UnderlineNode,
  StrikethroughNode,
  CodeNode,
  LinkNode,
  MentionNode,
  InlineNode,
  CodeBlockNode,
  ListItemNode,
  ListNode,
  TableCellNode,
  TableRowNode,
  TableNode,
  ParagraphNode,
  HeadingNode,
  BlockquoteNode,
  HorizontalRuleNode,
  ImageNode,
  EmbedNode,
  BlockNode,
  DocNode,
  Node,
  ASTNode,
  SearchResult,
  NodeInfo,
  ValidationResult,
  ValidationError,
} from './ast/types';

// ─── بناء AST ───
export * as builder from './ast/builder';
export { getSchema, validateBlockNode, validateDocument, type NodeSchema } from './ast/schema';

// ─── الحالة والعمليات ───
export type { EditorState, Selection, FullEditorState } from './state/editor-state';
export {
  createEditorState,
  canUndo,
  canRedo,
  getDocument,
  apply,
  undo,
  redo,
} from './state/editor-state';

export type { Operation, OperationType } from './state/operations';
export { applyOperation, applyOperations } from './state/operations';

export type { HistorySnapshot, HistoryState } from './state/history';
export { createHistory, pushSnapshot, popUndo, popRedo, clearHistory } from './state/history';

// ─── الفهرسة والبحث ───
export type { Indexer } from './indexer/indexer';
export { buildIndexer, getNodeById, getNodesByType } from './indexer/indexer';

export type { SearchOptions } from './indexer/search';
export { search, simpleSearch } from './indexer/search';

// ─── الأدوات المساعدة ───
export { generateId, isValidId } from './utils/id';
export { validateDocument as validateDoc } from './utils/validation';
export { pipe } from './utils/pipe';
export { compose } from './utils/compose';

// ─── الأدوات العربية ───
export * from './utils/arabic-text';

// ─── محلل الصيغ ───
export * from './utils/formula-parser';

// ─── محلل الماركداون والبيانات الوصفية ───
export * from './parsers/frontmatter-parser';
export * from './parsers/markdown';

// ─── مدقق المحتوى ───
export * from './utils/content-validator';

// ─── محركات النواة الجديدة ───
export * from './engines/html-pipeline';
export * from './engines/file-type-detection';
export * from './engines/unified-ingestion';
export * from './engines/image-pipeline';
export * from './engines/validation';

// ─── محول التنسيقات الشامل ───
export * from './converters/universal-format-converter';

// ─── محركات التفاعل الجديدة ───
export { ContextMenuEngine } from './engines/context-menu-engine';
export type { ContextMenuItem, ContextMenuTarget, ContextMenuResult } from './engines/context-menu-engine';

// ─── محرك القوائم السياقية المتقدم ───
export {
  createContextMenuEngine,
  globalContextMenuEngine,
  buildCanvasMenuItems,
  buildRichTextMenuItems,
  sanitizeMenuSeparators,
} from './contextMenuEngine';
export type {
  ContextMenuContext,
  ActionMenuItem,
  SubmenuMenuItem,
  SeparatorMenuItem,
  ContextMenuItem as CtxMenuItem,
  ResolvedMenuItem,
  ContextMenuRegistration,
  ContextMenuEngine as CtxEngine,
  CanvasMenuActions,
  RichTextMenuActions,
  TargetMatcher,
  DynamicValue,
} from './contextMenuEngine';

// ─── تفاعلات القوائم السياقية ───
export {
  createScrollCloseHandler,
  createHoverTracker,
  createKeyboardNavHandler,
  resolveSemanticIcon,
  CONTEXT_MENU_ICON_MAP,
} from './engines/context-menu-interactions';
export type {
  ScrollCloseOptions,
  HoverState,
  HoverTracker,
  KeyboardNavState,
  KeyboardNavHandler,
  ContextMenuIconKey,
} from './engines/context-menu-interactions';

// ─── أنماط CSS للقوائم السياقية ───
export {
  CONTEXT_MENU_KEYFRAMES,
  CONTEXT_MENU_THEME,
  CONTEXT_MENU_ITEM_STYLES,
  generateContextMenuCss,
  getMenuAnimationStyle,
  getSubmenuAnimationStyle,
} from './engines/context-menu-css';
export type {
  ContextMenuThemeTokens,
  ContextMenuItemStyle,
  MenuAnimationStyle,
} from './engines/context-menu-css';

export { SelectionGizmoEngine } from './engines/selection-gizmo-engine';
export type { Handle, HandlePosition, GizmoToolbar, GizmoAction, Rect } from './engines/selection-gizmo-engine';

export { ComposableTraitsEngine } from './engines/composable-traits-engine';
export type { TraitDef, ComposedProfile } from './engines/composable-traits-engine';

export { FloatingGizmoEngine } from './engines/floating-gizmo-engine';
export type { FloatingAction, FloatingGizmoState, GizmoPosition } from './engines/floating-gizmo-engine';

// ─── محركات الماوس والأدوات ───
export type { ToolCategory, ContextMenuAction, FloatingGizmoTool, TransformHandle, ElementToolingProfile } from './engines/mouse-tooling-engine';
export { getToolingProfileForNode, calculateTransformGizmoHandles } from './engines/mouse-tooling-engine';

export type { UnifiedToolItem } from './engines/tool-registry';
export { ToolRegistry, toolRegistry } from './engines/tool-registry';

export type { DoctorReport } from './engines/doctor-self-healing-engine';
export { runSelfHealingPipeline } from './engines/doctor-self-healing-engine';

// ─── Level 2: محركات التفاعل المتقدمة ───
export { createSpatialDragEngine } from './engines/spatial-drag-engine';
export type { DragElement, DragState, DragResult } from './engines/spatial-drag-engine';

export { createMarqueeSelectionEngine } from './engines/marquee-selection-engine';
export type { MarqueeBox, MarqueeElement } from './engines/marquee-selection-engine';

export { createMultiSelectionEngine } from './engines/multi-selection-engine';

export { createUndoRedoEngine } from './engines/undo-redo-engine';
export type { Snapshot } from './engines/undo-redo-engine';

export { createMouseCommandRegistry } from './engines/mouse-command-registry';
export type { CommandHandler, MouseCommand } from './engines/mouse-command-registry';

// ─── Level 3: محركات الذكاء ───
export { detectAndFlip, isNearEdge } from './engines/screen-edge-detector';
export type { ViewportBounds, MenuDimensions, FlipResult } from './engines/screen-edge-detector';

export { clampElement, clampMultiple, isOutOfBounds } from './engines/bounding-clamping-engine';
export type { CanvasBounds, ClampInput, ClampResult } from './engines/bounding-clamping-engine';

export { reorderZIndex, applyZOrderChanges } from './engines/z-order-manager';
export type { ZElement, ZOrderAction } from './engines/z-order-manager';

// ─── Level 4: بلوكات وأدوات ───
export { createSelectionManager } from './engines/selection-manager';
export type { SelectableElement, SelectionMode } from './engines/selection-manager';

export { mapBlocksToGrid, findOverlappingBlocks } from './engines/block-mapper';
export type { SpatialBlock, MappedBlock } from './engines/block-mapper';

// ─── Level 5: محركات متوسطة ───
export { createComponentRegistry } from './registry/component-registry';
export type { ComponentCategory, ComponentPosition, ComponentRegistration } from './registry/component-registry';

export { resolveComponents, sortByIdWeight } from './engines/smart-component-engine';
export type { ComponentDependency, ResolveResult } from './engines/smart-component-engine';

export { renderCalloutSvg, createCallout } from './engines/callout-engine';
export type { CalloutShape, CalloutColor, CalloutPosition, CalloutConfig } from './engines/callout-engine';

// ─── Level 6: بروفايلات الكانفا ───
export {
  createCanvasProfile,
  getFilteredTools,
  mergeProfiles,
  getFilteredToolsFromProfiles,
  isToolAllowed,
  WRITER_PROFILE,
  CALC_PROFILE,
  IMPRESS_PROFILE,
  BASE_PROFILE,
} from './engines/canvas-profile-engine';
export type { CanvasProfile, FilterResult, CanvasProfileConfig } from './engines/canvas-profile-engine';

// ─── كتل المحتوى ───
export { createCodeEditorBlock } from './blocks/code-editor';
export type { CodeEditorData, CodeEditorBlock } from './blocks/code-editor';
export { createAudioBlockNode } from './blocks/audio-block-block';
export type { AudioBlockData, AudioBlockNode } from './blocks/audio-block-block';

// ─── أنواع المستندات الأساسية ───
export {
  type KnownDocumentType,
  type SupportedFileFormat,
  type DocumentModel,
  type EditorPluginProps,
  type EditorPlugin,
  type SharedFormattingState,
} from './types';
