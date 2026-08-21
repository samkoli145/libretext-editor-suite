/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Guiding Summary | Execution Queue
 * ═══════════════════════════════════════════════════════════════════════════
 * File: EXECUTION_QUEUE.md
 * Path: EXECUTION_QUEUE.md
 * Main Goal: Numbered execution queue for all tasks
 * ID: DOC-ADMIN-11
 * Created: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * (c) All rights reserved - 2026 - MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

# Execution Queue

> Last updated: 2026-08-21

---

## COMPLETED

| # | Task | Files | Status |
|---|------|-------|--------|
| Q-001 | HIGH Priority Engines (9 files) | html-pipeline, file-type-detection, unified-ingestion, image-pipeline, validation, universal-format-converter, types, latex-engine, markdown-engine | DONE |
| Q-002 | Vector/Interaction Algorithms (4 files) | common, coordinate-system, mouse-algorithms, smart-alignment | DONE |
| Q-003 | Auto-indexing scripts (3 files) | update-indexes, generate-inventory, atomic-inventory | DONE |
| Q-004 | Dev scripts from backup (5 files) | analyze-blocks, generate-block, scaffold-block, sync-canonical-tools, sync-tools | DONE |
| Q-005 | LEVEL 1 Interaction Engines (4 files) | context-menu-engine, selection-gizmo-engine, composable-traits-engine, floating-gizmo-engine | DONE |

---

## LEVEL 2 — Interaction (Next)

| # | Task | Target File | Est. Lines | Priority | Description |
|---|------|-------------|------------|----------|-------------|
| Q-006 | SpatialDragEngine | core/src/engines/spatial-drag-engine.ts | ~300 | HIGH | Delta movement (deltaX/deltaY), snap-to-grid (10/15/20px), bounding clamping, multi-element parallel drag |
| Q-007 | MarqueeSelectionEngine | core/src/engines/marquee-selection-engine.ts | ~200 | HIGH | Rubber band selection, empty-area box drag, element intersection test |
| Q-008 | MultiSelectionEngine | core/src/engines/multi-selection-engine.ts | ~150 | HIGH | Shift+Click add/remove, selection set management, invert selection |
| Q-009 | UndoRedoEngine (enhanced) | core/src/engines/undo-redo-engine.ts | ~200 | HIGH | pushHistoryState for positions/props, auto-enable/disable buttons, max stack size |
| Q-010 | MouseCommandRegistry | core/src/engines/mouse-command-registry.ts | ~180 | HIGH | Register mouse commands per tool (Scale, Rotate, Snap, TextFormat, TableOp) |

---

## LEVEL 3 — Intelligence (After Level 2)

| # | Task | Target File | Est. Lines | Priority | Description |
|---|------|-------------|------------|----------|-------------|
| Q-011 | SmartSnapEngine | algorithms/src/spatial/smart-snap-engine.ts | ~250 | MEDIUM | calculateSmartSnapAndGuides: detect adjacent element edges/centers, snap with tolerance |
| Q-012 | DynamicGuideLines | algorithms/src/spatial/dynamic-guide-lines.ts | ~200 | MEDIUM | Render live guide lines + measurement labels during drag/snap |
| Q-013 | SmartRTLAlignment | algorithms/src/spatial/smart-rtl-alignment.ts | ~180 | MEDIUM | detectTextScriptDirection, smartAlignByScript, RTL/LTR/Auto toggle |
| Q-014 | ScreenEdgeDetector | core/src/engines/screen-edge-detector.ts | ~80 | MEDIUM | Detect viewport edges, flip menu/gizmo direction to prevent overflow |
| Q-015 | BoundingClamping | core/src/engines/bounding-clamping-engine.ts | ~100 | MEDIUM | Confine element movement within artboard/canvas bounds |
| Q-016 | ZOrderManager | core/src/engines/z-order-manager.ts | ~120 | MEDIUM | Manage z-index stacking, bring-forward/send-backward/bring-to-front/send-to-back |

---

## LEVEL 4 — Block & Tool Integration

| # | Task | Target File | Est. Lines | Priority | Description |
|---|------|-------------|------------|----------|-------------|
| Q-017 | snap.ts (from backup) | algorithms/src/vector/snap.ts | ~240 | HIGH | Multi-grid snap engine from vector-engine |
| Q-018 | ref-line.ts (from backup) | algorithms/src/vector/ref-line.ts | ~206 | HIGH | Dynamic reference lines from vector-engine |
| Q-019 | control-handle-manager.ts | algorithms/src/vector/control-handle-manager.ts | ~287 | HIGH | 8-point resize handles from vector-engine |
| Q-020 | AutoLayoutEngine.ts | algorithms/src/vector/auto-layout.ts | ~465 | HIGH | Flexbox-like auto layout from vector-engine |
| Q-021 | SelectionManager.ts | core/src/engines/selection-manager.ts | ~165 | MEDIUM | Element selection management from canvas |
| Q-022 | BlockMapperEngine.ts | core/src/engines/block-mapper.ts | ~74 | MEDIUM | Visual block mapping from canvas |

---

## LEVEL 5 — Medium Engines (from backup)

| # | Task | Target File | Est. Lines | Priority | Description |
|---|------|-------------|------------|----------|-------------|
| Q-023 | DiagramEngine | algorithms/src/diagram/diagram-engine.ts | ~586 | MEDIUM | SVG diagram engine |
| Q-024 | ComponentRegistry | core/src/registry/component-registry.ts | ~795 | MEDIUM | Central component registry |
| Q-025 | ToolRegistry | core/src/registry/tool-registry.ts | ~254 | MEDIUM | Central tool registry |
| Q-026 | SmartComponentEngine | core/src/engines/smart-component-engine.ts | ~200 | LOW | Smart component assembly |
| Q-027 | DoctorSelfHealingEngine | core/src/engines/doctor-engine.ts | ~300 | LOW | Auto-diagnosis and repair |
| Q-028 | WYSIWYGCalloutEngine | core/src/engines/callout-engine.ts | ~150 | LOW | Visual callout boxes |

---

## LEVEL 6 — Documentation & Polish

| # | Task | Description | Priority |
|---|------|-------------|----------|
| Q-029 | Update INDEX.md | Add all new engine files | HIGH |
| Q-030 | Update CHANGELOG.md | Document all engine additions | HIGH |
| Q-031 | Update FUNCTION_INDEX.md | Re-index with 947+ new symbols | HIGH |
| Q-032 | PHASE-09 Playground | Interactive playground | LOW |

---

## Stats

| Level | Tasks | Completed | Remaining |
|-------|-------|-----------|-----------|
| Level 1 (Basic) | 4 | 4 | 0 |
| Level 2 (Interaction) | 5 | 0 | 5 |
| Level 3 (Intelligence) | 6 | 0 | 6 |
| Level 4 (Block/Tool) | 6 | 0 | 6 |
| Level 5 (Medium) | 6 | 0 | 6 |
| Level 6 (Docs) | 4 | 0 | 4 |
| **Total** | **31** | **4** | **27** |
