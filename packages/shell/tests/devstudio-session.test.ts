/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [devstudio-session.test.ts] اختبارات EventBus + SessionMemory
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DevStudioEventBus } from '../dev-studio/core/DevStudioEventBus';
import { DevStudioSessionMemory } from '../dev-studio/core/DevStudioSessionMemory';

describe('DevStudioEventBus', () => {
  let bus: DevStudioEventBus;

  beforeEach(() => { bus = new DevStudioEventBus(); });

  it('emits to registered handlers', () => {
    let received = '';
    bus.on('task:started', (d) => { received = String(d); });
    bus.emit('task:started', 'hello');
    expect(received).toBe('hello');
  });

  it('supports multiple handlers', () => {
    let count = 0;
    bus.on('task:completed', () => { count++; });
    bus.on('task:completed', () => { count++; });
    bus.emit('task:completed');
    expect(count).toBe(2);
  });

  it('off removes handler', () => {
    let called = false;
    const handler = () => { called = true; };
    bus.on('error:occurred', handler);
    bus.off('error:occurred', handler);
    bus.emit('error:occurred');
    expect(called).toBe(false);
  });

  it('tracks listener count', () => {
    bus.on('health:check', () => {});
    bus.on('health:check', () => {});
    expect(bus.getListenerCount('health:check')).toBe(2);
  });

  it('tracks emit count', () => {
    bus.emit('tool:executed');
    bus.emit('tool:executed');
    bus.emit('tool:executed');
    expect(bus.getEmitCount('tool:executed')).toBe(3);
  });
});

describe('DevStudioSessionMemory', () => {
  let mem: DevStudioSessionMemory;

  beforeEach(() => { mem = new DevStudioSessionMemory('test-session'); });

  it('has session id', () => {
    expect(mem.getSessionId()).toBe('test-session');
  });

  it('adds and retrieves entries', () => {
    mem.addEntry({ type: 'fact', content: 'fact1', timestamp: 1 });
    mem.addEntry({ type: 'context', content: 'ctx1', timestamp: 2 });
    expect(mem.getEntries().length).toBe(2);
  });

  it('filters decisions', () => {
    mem.addEntry({ type: 'decision', content: 'use Vitest', timestamp: 1 });
    mem.addEntry({ type: 'fact', content: 'fact', timestamp: 2 });
    expect(mem.getDecisions().length).toBe(1);
    expect(mem.getDecisions()[0].content).toBe('use Vitest');
  });

  it('extracts active files from filePath and content', () => {
    mem.addEntry({ type: 'context', content: 'modified src/index.ts', timestamp: 1, filePath: 'packages/core/src/types.ts' });
    const files = mem.getActiveFiles();
    expect(files).toContain('packages/core/src/types.ts');
    expect(files).toContain('src/index.ts');
  });

  it('calculates context size in tokens', () => {
    mem.addEntry({ type: 'context', content: 'a'.repeat(400), timestamp: 1 });
    expect(mem.getContextSize()).toBe(100);
  });

  it('compresses when over 4000 tokens', () => {
    for (let i = 0; i < 100; i++) {
      mem.addEntry({ type: 'context', content: 'x'.repeat(200), timestamp: i });
    }
    expect(mem.getContextSize()).toBeGreaterThan(4000);
    mem.compress();
    expect(mem.getContextSize()).toBeLessThanOrEqual(4000);
  });

  it('clear empties entries', () => {
    mem.addEntry({ type: 'fact', content: 'x', timestamp: 1 });
    mem.clear();
    expect(mem.getEntries().length).toBe(0);
  });
});
