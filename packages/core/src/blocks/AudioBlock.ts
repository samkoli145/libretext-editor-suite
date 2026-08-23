/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: AudioBlock.ts
 * 📂 المسار: packages/core/src/blocks/AudioBlock.ts
 * 🎯 الهدف الرئيسي: Audio Block Container with Functional Trait Operations
 * 📋 المعايير: Zero-dependency, Type-safe, Pure Functional Traits Integration
 * 🏷️ المعرف: BLOCK-AUDIO
 * 📅 تاريخ الإنشاء: 2026-08-22
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Container + Pure Functional Traits Composition Pattern
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تطبيق assertUnlocked قبل أي تعديل على الحالة لمنع التعديل في حالة القفل.
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { generateId } from '../utils/id';
import type { BlockMetadata, BlockPosition, BlockStyle } from './types';
import {
  moveTo as traitMoveTo,
  moveBy as traitMoveBy,
  bringToFront as traitBringToFront,
  sendToBack as traitSendToBack,
  resizeTo as traitResizeTo,
  resizeBy as traitResizeBy,
  setStyle as traitSetStyle,
  setOpacity as traitSetOpacity,
  rotateTo as traitRotateTo,
  lock as traitLock,
  unlock as traitUnlock,
  assertUnlocked,
  type SizeConstraints,
  type TraitName,
} from '../traits';

export interface AudioBlockConfig {
  title?: string;
  content?: string;
  audioUrl?: string;
  autoplay?: boolean;
}

/**
 * قدرات البلوك المسجلة: [canPlayAudio, hasSpatialLayout]
 * السمات المفعلة: ['draggable', 'resizable', 'styleable', 'lockable']
 */
export class AudioBlock {
  private metadata: BlockMetadata;
  private config: AudioBlockConfig;

  constructor(
    position: Partial<BlockPosition> = {},
    style: Partial<BlockStyle> = {},
    config: AudioBlockConfig = {},
    constraints: SizeConstraints = {}
  ) {
    this.config = config;
    this.metadata = {
      id: generateId('block'),
      type: 'audio',
      position: {
        x: position.x ?? 0,
        y: position.y ?? 0,
        width: position.width ?? 400,
        height: position.height ?? 120,
        zIndex: position.zIndex ?? 0,
      },
      style: {
        backgroundColor: style.backgroundColor ?? '#FFFFFF',
        borderColor: style.borderColor ?? '#E2E8F0',
        borderWidth: style.borderWidth ?? 1,
        borderRadius: style.borderRadius ?? 8,
        padding: style.padding ?? 16,
        margin: style.margin ?? 0,
        opacity: style.opacity ?? 1,
        rotation: style.rotation ?? 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      locked: false,
      visible: true,
      layer: 'default',
      constraints,
      traits: ['draggable', 'resizable', 'styleable', 'lockable'],
    };
  }

  // ─── Getters ───

  getId(): string {
    return this.metadata.id;
  }

  getMetadata(): BlockMetadata {
    return { ...this.metadata, position: { ...this.metadata.position }, style: { ...this.metadata.style } };
  }

  getConfig(): AudioBlockConfig {
    return { ...this.config };
  }

  getPosition(): BlockPosition {
    return { ...this.metadata.position };
  }

  getStyle(): BlockStyle {
    return { ...this.metadata.style };
  }

  isLocked(): boolean {
    return this.metadata.locked;
  }

  hasTrait(trait: TraitName): boolean {
    return this.metadata.traits?.includes(trait) ?? false;
  }

  // ─── Configuration ───

  updateConfig(config: Partial<AudioBlockConfig>): void {
    assertUnlocked(this.metadata, 'تحديث الإعدادات');
    this.config = { ...this.config, ...config };
    this.metadata.updatedAt = Date.now();
  }

  // ─── Draggable Trait ───

  moveTo(x: number, y: number): void {
    assertUnlocked(this.metadata, 'تحريك');
    this.metadata.position = traitMoveTo(this.metadata.position, x, y);
    this.metadata.updatedAt = Date.now();
  }

  moveBy(dx: number, dy: number): void {
    assertUnlocked(this.metadata, 'إزاحة');
    this.metadata.position = traitMoveBy(this.metadata.position, dx, dy);
    this.metadata.updatedAt = Date.now();
  }

  bringToFront(currentMaxZ: number): void {
    assertUnlocked(this.metadata, 'تقديم للأمام');
    this.metadata.position = traitBringToFront(this.metadata.position, currentMaxZ);
    this.metadata.updatedAt = Date.now();
  }

  sendToBack(currentMinZ: number): void {
    assertUnlocked(this.metadata, 'إرجاع للخلف');
    this.metadata.position = traitSendToBack(this.metadata.position, currentMinZ);
    this.metadata.updatedAt = Date.now();
  }

  setPosition(position: Partial<BlockPosition>): void {
    assertUnlocked(this.metadata, 'تعديل الموضع');
    this.metadata.position = { ...this.metadata.position, ...position };
    this.metadata.updatedAt = Date.now();
  }

  // ─── Resizable Trait ───

  resizeTo(width: number, height: number): void {
    assertUnlocked(this.metadata, 'تغيير الحجم');
    const updated = traitResizeTo(
      { width: this.metadata.position.width, height: this.metadata.position.height },
      width,
      height,
      this.metadata.constraints
    );
    this.metadata.position.width = updated.width;
    this.metadata.position.height = updated.height;
    this.metadata.updatedAt = Date.now();
  }

  resizeBy(dWidth: number, dHeight: number): void {
    assertUnlocked(this.metadata, 'تغيير نسبي للحجم');
    const updated = traitResizeBy(
      { width: this.metadata.position.width, height: this.metadata.position.height },
      dWidth,
      dHeight,
      this.metadata.constraints
    );
    this.metadata.position.width = updated.width;
    this.metadata.position.height = updated.height;
    this.metadata.updatedAt = Date.now();
  }

  // ─── Styleable Trait ───

  setStyle(stylePatch: Partial<BlockStyle>): void {
    assertUnlocked(this.metadata, 'تعديل النمط');
    this.metadata.style = traitSetStyle(this.metadata.style, stylePatch);
    this.metadata.updatedAt = Date.now();
  }

  setOpacity(opacity: number): void {
    assertUnlocked(this.metadata, 'تعديل الشفافية');
    this.metadata.style = traitSetOpacity(this.metadata.style, opacity);
    this.metadata.updatedAt = Date.now();
  }

  rotateTo(degrees: number): void {
    assertUnlocked(this.metadata, 'تدوير');
    this.metadata.style = traitRotateTo(this.metadata.style, degrees);
    this.metadata.updatedAt = Date.now();
  }

  // ─── Lockable Trait ───

  lock(): void {
    this.metadata = traitLock(this.metadata);
    this.metadata.updatedAt = Date.now();
  }

  unlock(): void {
    this.metadata = traitUnlock(this.metadata);
    this.metadata.updatedAt = Date.now();
  }
}

export function createAudioBlock(
  position?: Partial<BlockPosition>,
  style?: Partial<BlockStyle>,
  config?: AudioBlockConfig,
  constraints?: SizeConstraints
): AudioBlock {
  return new AudioBlock(position, style, config, constraints);
}

// ─── التوافقية العكسية (Backward Compatibility Aliases) ───
export interface AudioBlockData {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface AudioBlockNode {
  readonly id: string;
  readonly type: 'audio-block' | 'audio';
  readonly data: AudioBlockData;
}

export function createAudioBlockNode(
  id: string,
  data: Partial<AudioBlockData> = {}
): AudioBlockNode {
  return {
    id,
    type: 'audio',
    data: {
      id,
      title: data.title || '',
      content: data.content || '',
      metadata: data.metadata || {},
    },
  };
}

export default AudioBlock;
