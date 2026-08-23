/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: DevStudioEventBus.ts
 * 📂 المسار: packages/shell/dev-studio/core/DevStudioEventBus.ts
 * 🎯 الهدف: ناقل أحداث مكتوب — on/off/emit مع عدّ أحداث
 * 🏷️ المعرف: PLUG-EVENT-BUS
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type DevStudioEvent =
  | 'task:started' | 'task:completed' | 'task:failed'
  | 'mode:changed' | 'tool:executed' | 'command:executed'
  | 'health:check' | 'error:occurred';

type Handler = (data: unknown) => void;

export class DevStudioEventBus {
  private handlers = new Map<DevStudioEvent, Set<Handler>>();
  private emitCounts = new Map<DevStudioEvent, number>();

  constructor() {
    const events: DevStudioEvent[] = [
      'task:started', 'task:completed', 'task:failed',
      'mode:changed', 'tool:executed', 'command:executed',
      'health:check', 'error:occurred',
    ];
    for (const e of events) {
      this.handlers.set(e, new Set());
      this.emitCounts.set(e, 0);
    }
  }

  on(event: DevStudioEvent, handler: Handler): void {
    this.handlers.get(event)?.add(handler);
  }

  off(event: DevStudioEvent, handler: Handler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: DevStudioEvent, data?: unknown): void {
    const set = this.handlers.get(event);
    if (set) {
      for (const h of set) h(data);
    }
    this.emitCounts.set(event, (this.emitCounts.get(event) || 0) + 1);
  }

  getListenerCount(event: DevStudioEvent): number {
    return this.handlers.get(event)?.size ?? 0;
  }

  getEmitCount(event: DevStudioEvent): number {
    return this.emitCounts.get(event) ?? 0;
  }
}
