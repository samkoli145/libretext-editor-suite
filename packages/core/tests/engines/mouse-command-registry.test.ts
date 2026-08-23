import { describe, it, expect } from 'vitest';
import { createMouseCommandRegistry } from '../../src/engines/mouse-command-registry';

describe('CORE-ENG-013: MouseCommandRegistry', () => {
  it('starts empty', () => {
    const registry = createMouseCommandRegistry();
    expect(registry.size()).toBe(0);
    expect(registry.list()).toEqual([]);
  });

  it('register and execute', () => {
    const registry = createMouseCommandRegistry();
    let called = false;
    registry.register('scale', 'Scale', 'transform', () => {
      called = true;
    });
    expect(registry.execute('scale', {})).toBe(true);
    expect(called).toBe(true);
  });

  it('returns false for unknown command', () => {
    const registry = createMouseCommandRegistry();
    expect(registry.execute('unknown', {})).toBe(false);
  });

  it('unregister removes command', () => {
    const registry = createMouseCommandRegistry();
    registry.register('test', 'Test', 'format', () => {});
    expect(registry.unregister('test')).toBe(true);
    expect(registry.size()).toBe(0);
    expect(registry.unregister('test')).toBe(false);
  });

  it('listByCategory filters', () => {
    const registry = createMouseCommandRegistry();
    registry.register('a', 'A', 'format', () => {});
    registry.register('b', 'B', 'transform', () => {});
    registry.register('c', 'C', 'format', () => {});
    expect(registry.listByCategory('format')).toHaveLength(2);
    expect(registry.listByCategory('transform')).toHaveLength(1);
  });

  it('handles async handler errors gracefully', async () => {
    const registry = createMouseCommandRegistry();
    registry.register('fail', 'Fail', 'test', async () => {
      throw new Error('boom');
    });
    expect(registry.execute('fail', {})).toBe(true);
    await new Promise((r) => setTimeout(r, 10));
  });

  it('clear empties registry', () => {
    const registry = createMouseCommandRegistry();
    registry.register('a', 'A', 'x', () => {});
    registry.register('b', 'B', 'x', () => {});
    registry.clear();
    expect(registry.size()).toBe(0);
  });
});
