import { describe, expect, it } from 'vitest';
import {
  moveTo,
  moveBy,
  bringToFront,
  sendToBack,
  resizeTo,
  resizeBy,
  setStyle,
  setOpacity,
  rotateTo,
  lock,
  unlock,
  assertUnlocked,
  BlockLockedError,
} from '../../src/traits';

describe('Trait Functions Suite', () => {
  describe('Draggable Trait', () => {
    it('moveTo updates coordinates immutably', () => {
      const initial = { x: 10, y: 20, zIndex: 1, extra: 'kept' };
      const next = moveTo(initial, 100, 200);

      expect(next).toEqual({ x: 100, y: 200, zIndex: 1, extra: 'kept' });
      expect(initial.x).toBe(10);
    });

    it('moveBy offsets coordinates relatively', () => {
      const initial = { x: 50, y: 50, zIndex: 2 };
      const next = moveBy(initial, 25, -10);

      expect(next.x).toBe(75);
      expect(next.y).toBe(40);
    });

    it('bringToFront and sendToBack manage zIndex', () => {
      const state = { x: 0, y: 0, zIndex: 5 };
      expect(bringToFront(state, 10).zIndex).toBe(11);
      expect(sendToBack(state, 0).zIndex).toBe(-1);
    });
  });

  describe('Resizable Trait', () => {
    it('resizeTo enforces min and max constraints', () => {
      const state = { width: 100, height: 100 };
      const constrained = resizeTo(state, 50, 600, {
        minWidth: 80,
        maxWidth: 400,
        minHeight: 80,
        maxHeight: 500,
      });

      expect(constrained.width).toBe(80);
      expect(constrained.height).toBe(500);
    });

    it('resizeTo locks aspect ratio when requested', () => {
      const state = { width: 200, height: 100 }; // ratio 2:1
      const resized = resizeTo(state, 300, 100, { lockAspectRatio: true });
      expect(resized.width).toBe(300);
      expect(resized.height).toBe(150);
    });

    it('resizeBy changes dimensions relatively', () => {
      const state = { width: 150, height: 100 };
      const next = resizeBy(state, 50, -20);
      expect(next.width).toBe(200);
      expect(next.height).toBe(80);
    });
  });

  describe('Styleable Trait', () => {
    it('setStyle patches style properties', () => {
      const style = {
        backgroundColor: '#FFF',
        borderColor: '#000',
        borderWidth: 1,
        opacity: 1,
        rotation: 0,
      };
      const next = setStyle(style, { backgroundColor: '#F00', borderWidth: 3 });
      expect(next.backgroundColor).toBe('#F00');
      expect(next.borderWidth).toBe(3);
      expect(next.borderColor).toBe('#000');
    });

    it('setOpacity clamps between 0 and 1', () => {
      const style = {
        backgroundColor: '#FFF',
        borderColor: '#000',
        borderWidth: 1,
        opacity: 1,
        rotation: 0,
      };
      expect(setOpacity(style, 1.5).opacity).toBe(1);
      expect(setOpacity(style, -0.2).opacity).toBe(0);
      expect(setOpacity(style, 0.75).opacity).toBe(0.75);
    });

    it('rotateTo normalizes degrees into [0, 360)', () => {
      const style = {
        backgroundColor: '#FFF',
        borderColor: '#000',
        borderWidth: 1,
        opacity: 1,
        rotation: 0,
      };
      expect(rotateTo(style, 450).rotation).toBe(90);
      expect(rotateTo(style, -90).rotation).toBe(270);
    });
  });

  describe('Lockable Trait', () => {
    it('lock and unlock toggle locked state', () => {
      const state = { locked: false, data: 'test' };
      const lockedState = lock(state);
      expect(lockedState.locked).toBe(true);

      const unlockedState = unlock(lockedState);
      expect(unlockedState.locked).toBe(false);
    });

    it('assertUnlocked passes when unlocked and throws BlockLockedError when locked', () => {
      expect(() => assertUnlocked({ locked: false })).not.toThrow();
      expect(() => assertUnlocked({ locked: true }, 'تعديل')).toThrow(BlockLockedError);
    });
  });
});
