/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: DevStudioSessionMemory.ts
 * 📂 المسار: packages/shell/dev-studio/core/DevStudioSessionMemory.ts
 * 🎯 الهدف: ذاكرة الجلسة — تتبع السياق + ضغط تلقائي فوق 4000 توكن
 * 🏷️ المعرف: PLUG-SESSION-MEMORY
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SessionEntry {
  readonly type: 'fact' | 'context' | 'decision';
  readonly content: string;
  readonly timestamp: number;
  readonly filePath?: string;
}

export class DevStudioSessionMemory {
  private entries: SessionEntry[] = [];
  private readonly sessionId: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId ?? `session-${Date.now()}`;
  }

  addEntry(entry: SessionEntry): void {
    this.entries.push(entry);
  }

  getEntries(): readonly SessionEntry[] {
    return this.entries;
  }

  getDecisions(): readonly SessionEntry[] {
    return this.entries.filter(e => e.type === 'decision');
  }

  getActiveFiles(): string[] {
    const files = new Set<string>();
    for (const e of this.entries) {
      if (e.filePath) files.add(e.filePath);
      const matches = e.content.match(/[\w/.-]+\.(ts|tsx|js|json|md)/g);
      if (matches) for (const m of matches) files.add(m);
    }
    return Array.from(files);
  }

  getContextSize(): number {
    let chars = 0;
    for (const e of this.entries) {
      chars += e.content.length;
    }
    return Math.ceil(chars / 4);
  }

  compress(): void {
    if (this.getContextSize() <= 4000) return;
    const keepCount = Math.floor(this.entries.length * 0.6);
    const decisions = this.getDecisions();
    const summary: SessionEntry = {
      type: 'context',
      content: `ملخص الجلسة: ${decisions.slice(0, 5).map(d => d.content).join('; ')}`,
      timestamp: Date.now(),
    };
    this.entries = [...this.entries.slice(-keepCount), summary];
  }

  clear(): void {
    this.entries = [];
  }

  getSessionId(): string {
    return this.sessionId;
  }
}
