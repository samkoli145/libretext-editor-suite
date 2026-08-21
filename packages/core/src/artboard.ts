/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: artboard.ts
 * 📂 المسار: src/types/artboard.ts
 * 🎯 الهدف الرئيسي: تعريف الأنواع والواجهات الخاصة بلوحة الرسم التفاعلية المحاكية
 *    (Simulated Artboard) ودعم التحديد المتعدد، السحب والإفلات، والقوائم المتداخلة.
 * 📋 المعايير:
 *    - TypeScript صارم (strict).
 *    - صفر كود مكرر، واجهات مجردة وغير قابلة للتعديل العشوائي (Readonly).
 * 🏷️ المعرف: PLAY-004
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hierarchical Spatial Node Types + Multi-Level Menu Schema
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مراعاة إحداثيات العناصر داخل الحاوية النسبية ومطابقتها للمتجه.
 *    2. ضمان دعم التحديد المتعدد عبر Shift بدقة.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ElementType =
  | 'paragraph'
  | 'heading'
  | 'table'
  | 'cell'
  | 'shape'
  | 'slide'
  | 'database_record'
  | 'math'
  | 'mermaid';

export type DomainType = 'Writer' | 'Calc' | 'Impress' | 'Base' | 'Universal';

export type TextScriptDirection = 'rtl' | 'ltr' | 'auto';

export interface AlignmentGuideLine {
  readonly type: 'vertical' | 'horizontal';
  readonly position: number;
  readonly start: number;
  readonly end: number;
  readonly label?: string;
}

export interface StateHistoryEntry {
  readonly elements: readonly SimulatedCanvasElement[];
  readonly description: string;
  readonly timestamp: number;
}

export interface SimulatedCanvasElement {
  readonly id: string;
  readonly type: ElementType;
  readonly domain: DomainType;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly zIndex: number;
  readonly rotation?: number; // In degrees
  readonly isLocked?: boolean;
  readonly groupId?: string;
  readonly backgroundColor?: string;
  readonly borderColor?: string;
  readonly direction?: TextScriptDirection;
  readonly contentData?: Record<string, unknown>;
}

export interface CanvasBoundingBox {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
}

export interface ContextMenuPosition {
  readonly x: number;
  readonly y: number;
  readonly targetElementIds: readonly string[];
}

export interface NestedContextMenuItem {
  readonly id: string;
  readonly label: string;
  readonly iconName?: string;
  readonly shortcut?: string;
  readonly destructive?: boolean;
  readonly disabled?: boolean;
  readonly dividerAfter?: boolean;
  readonly subMenu?: readonly NestedContextMenuItem[];
  readonly onSelect?: () => void;
}

export interface DragState {
  readonly isDragging: boolean;
  readonly startMouseX: number;
  readonly startMouseY: number;
  readonly initialPositions: ReadonlyMap<string, { readonly x: number; readonly y: number }>;
}

export interface MarqueeSelectionState {
  readonly isActive: boolean;
  readonly startX: number;
  readonly startY: number;
  readonly currentX: number;
  readonly currentY: number;
}
