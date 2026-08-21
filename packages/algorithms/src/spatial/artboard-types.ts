/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: artboard-types.ts
 * 📂 المسار: packages/algorithms/src/spatial/artboard-types.ts
 * 🎯 الهدف الرئيسي: تعريف الأنواع المشتركة للوحة الرسم (Artboard)
 *    المستخدمة في خوارزميات السحب والتحديد والمحاذاة.
 * 📋 المعايير: صفر اعتماديات خارجية، TypeScript صارم.
 * 🏷️ المعرف: ALGO-ARTBOARD-TYPES
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ================================================================
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
  readonly rotation?: number;
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

export interface MarqueeSelectionState {
  readonly isActive: boolean;
  readonly startX: number;
  readonly startY: number;
  readonly currentX: number;
  readonly currentY: number;
}
