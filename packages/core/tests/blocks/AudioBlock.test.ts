import { describe, expect, it } from 'vitest';
import { createAudioBlock } from '../../src/blocks/AudioBlock';
import { BlockLockedError } from '../../src/traits';

describe('AudioBlock with Traits', () => {
  it('should initialize with default traits and metadata', () => {
    const block = createAudioBlock();
    expect(block.getId()).toBeDefined();
    expect(block.hasTrait('draggable')).toBe(true);
    expect(block.hasTrait('resizable')).toBe(true);
    expect(block.hasTrait('styleable')).toBe(true);
    expect(block.hasTrait('lockable')).toBe(true);
    expect(block.isLocked()).toBe(false);
  });

  it('should perform draggable operations', () => {
    const block = createAudioBlock();
    block.moveTo(50, 80);
    expect(block.getPosition().x).toBe(50);
    expect(block.getPosition().y).toBe(80);

    block.moveBy(20, -30);
    expect(block.getPosition().x).toBe(70);
    expect(block.getPosition().y).toBe(50);
  });

  it('should perform resizable operations', () => {
    const block = createAudioBlock();
    block.resizeTo(600, 200);
    expect(block.getPosition().width).toBe(600);
    expect(block.getPosition().height).toBe(200);

    block.resizeBy(50, 10);
    expect(block.getPosition().width).toBe(650);
    expect(block.getPosition().height).toBe(210);
  });

  it('should perform styleable operations', () => {
    const block = createAudioBlock();
    block.setStyle({ backgroundColor: '#FAFAFA' });
    expect(block.getStyle().backgroundColor).toBe('#FAFAFA');

    block.setOpacity(0.9);
    expect(block.getStyle().opacity).toBe(0.9);

    block.rotateTo(180);
    expect(block.getStyle().rotation).toBe(180);
  });

  it('should prevent modifications when locked and allow them after unlocking', () => {
    const block = createAudioBlock();
    block.lock();
    expect(block.isLocked()).toBe(true);

    expect(() => block.moveTo(10, 10)).toThrow(BlockLockedError);
    expect(() => block.resizeTo(100, 100)).toThrow(BlockLockedError);
    expect(() => block.setStyle({ backgroundColor: '#000' })).toThrow(BlockLockedError);
    expect(() => block.updateConfig({ title: 'New title' })).toThrow(BlockLockedError);

    block.unlock();
    expect(block.isLocked()).toBe(false);

    block.moveTo(10, 10);
    expect(block.getPosition().x).toBe(10);
  });
});
