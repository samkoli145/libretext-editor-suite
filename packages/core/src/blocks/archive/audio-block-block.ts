/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: audio-block-block.ts
 * 📂 المسار: packages/core/src/blocks/audio-block-block.ts
 * 🎯 الهدف الرئيسي: تعريف كتلة AudioBlock للنطاق Writer
 * 📋 المعايير: صفر اعتماديات خارجية، ثيم فاتح نقي، تحكم كامل بالفأرة.
 * 🏷️ المعرف: CORE-BLK-AUDIOBLOCK
 * 📅 تاريخ الإنشاء: 2026-08-21
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ElementToolingProfile } from '../engines/mouse-tooling-engine';

export interface AudioBlockData {
  readonly id: string;
  readonly title?: string;
  readonly content?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface AudioBlockNode {
  readonly id: string;
  readonly type: 'audio-block';
  readonly data: AudioBlockData;
}

export const AudioBlockToolingProfile: ElementToolingProfile = {
  targetType: 'custom',
  domain: 'Writer',
  floatingGizmoTools: [],
  supportsTransformGizmo: false,
  contextMenuActions: [
    { id: 'cut', label: 'قص', iconName: 'Scissors', category: 'system' },
    { id: 'copy', label: 'نسخ', iconName: 'Copy', category: 'system' },
    { id: 'paste', label: 'لصق', iconName: 'Clipboard', category: 'system' },
    { id: 'delete_block', label: 'حذف', iconName: 'Trash2', category: 'system', destructive: true },
  ],
};

export function createAudioBlockNode(
  id: string,
  data: Partial<AudioBlockData> = {},
): AudioBlockNode {
  return {
    id,
    type: 'audio-block',
    data: {
      id,
      title: data.title || '',
      content: data.content || '',
      metadata: data.metadata || {},
    },
  };
}
