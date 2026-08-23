/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * [devstudio-kernel.test.ts] اختبارات نواة DevStudio — Modes + Tools + Commands
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCurrentMode, setMode, getModeConfig, getAllModes,
} from '../dev-studio/core/DevStudioModes';
import { DevStudioToolRegistry } from '../dev-studio/core/DevStudioToolRegistry';
import { DevStudioCommandRegistry } from '../dev-studio/core/DevStudioCommandRegistry';

describe('DevStudioModes', () => {
  it('defaults to planning', () => {
    expect(getCurrentMode()).toBe('planning');
  });

  it('switches mode', () => {
    setMode('execution');
    expect(getCurrentMode()).toBe('execution');
    setMode('planning');
  });

  it('returns correct config for each mode', () => {
    const c = getModeConfig('force');
    expect(c.mode).toBe('force');
    expect(c.risk).toBe('danger');
    expect(c.canWrite).toBe(true);
  });

  it('has 7 modes', () => {
    expect(getAllModes().length).toBe(7);
  });

  it('planning is safe and read-only', () => {
    const c = getModeConfig('planning');
    expect(c.risk).toBe('safe');
    expect(c.canWrite).toBe(false);
    expect(c.canExecuteShell).toBe(false);
  });
});

describe('DevStudioToolRegistry', () => {
  let registry: DevStudioToolRegistry;

  beforeEach(() => {
    registry = new DevStudioToolRegistry();
  });

  it('starts empty', () => {
    expect(registry.listTools()).toHaveLength(0);
  });

  it('registers and lists tools', () => {
    registry.register({
      id: 'test-tool', name: 'Test', nameAr: 'اختبار',
      category: 'scan', risk: 'safe', description: 'test',
      execute: async () => ({ ok: true, durationMs: 0 }),
    });
    expect(registry.listTools()).toContain('test-tool');
  });

  it('filters by category', () => {
    registry.register({
      id: 'a', name: 'A', nameAr: 'أ', category: 'git', risk: 'safe', description: '',
      execute: async () => ({ ok: true, durationMs: 0 }),
    });
    registry.register({
      id: 'b', name: 'B', nameAr: 'ب', category: 'lint', risk: 'safe', description: '',
      execute: async () => ({ ok: true, durationMs: 0 }),
    });
    expect(registry.listByCategory('git')).toEqual(['a']);
    expect(registry.listByCategory('lint')).toEqual(['b']);
  });

  it('executes tool and returns result', async () => {
    registry.register({
      id: 'add', name: 'Add', nameAr: 'جمع', category: 'scan', risk: 'safe', description: '',
      execute: async (args) => ({
        ok: true, data: Number(args.a) + Number(args.b), durationMs: 0,
      }),
    });
    const result = await registry.execute('add', { a: 3, b: 4 });
    expect(result.ok).toBe(true);
    expect(result.data).toBe(7);
  });

  it('returns error for unknown tool', async () => {
    const result = await registry.execute('nonexistent');
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('unregisters tool', () => {
    registry.register({
      id: 'temp', name: 'T', nameAr: 'ت', category: 'scan', risk: 'safe', description: '',
      execute: async () => ({ ok: true, durationMs: 0 }),
    });
    expect(registry.unregister('temp')).toBe(true);
    expect(registry.listTools()).not.toContain('temp');
  });
});

describe('DevStudioCommandRegistry', () => {
  let registry: DevStudioCommandRegistry;

  beforeEach(() => {
    registry = new DevStudioCommandRegistry();
  });

  it('registers and lists commands', () => {
    registry.register({
      id: 'cmd1', titleAr: 'أمر', description: 'test', category: 'util',
      handler: () => 42,
    });
    expect(registry.listCommands()).toContain('cmd1');
  });

  it('executes command and logs', async () => {
    registry.register({
      id: 'double', titleAr: 'ضعف', description: '', category: 'math',
      handler: (n: unknown) => Number(n) * 2,
    });
    const { ok, result } = await registry.execute('double', 21);
    expect(ok).toBe(true);
    expect(result).toBe(42);
    expect(registry.getExecutionLog().length).toBe(1);
  });

  it('rejects duplicate ids', () => {
    registry.register({ id: 'x', titleAr: '', description: '', category: '', handler: () => 0 });
    expect(() => registry.register({ id: 'x', titleAr: '', description: '', category: '', handler: () => 0 })).toThrow();
  });

  it('throws for unknown command', async () => {
    await expect(registry.execute('nope')).rejects.toThrow();
  });
});
