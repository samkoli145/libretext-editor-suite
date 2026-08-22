import { describe, it, expect } from 'vitest';
import { createUndoRedoEngine } from '../../src/engines/undo-redo-engine';

describe('CORE-ENG-012: UndoRedoEngine', () => {
  it('starts empty', () => {
    const engine = createUndoRedoEngine();
    expect(engine.canUndo()).toBe(false);
    expect(engine.canRedo()).toBe(false);
    expect(engine.size()).toBe(0);
  });

  it('push and undo', () => {
    const engine = createUndoRedoEngine<number>();
    engine.push(1, 'first');
    engine.push(2, 'second');
    expect(engine.size()).toBe(2);
    expect(engine.canUndo()).toBe(true);
    const snap = engine.undo();
    expect(snap?.data).toBe(2);
    expect(snap?.description).toBe('second');
  });

  it('redo after undo', () => {
    const engine = createUndoRedoEngine<number>();
    engine.push(1, 'a');
    engine.push(2, 'b');
    engine.undo();
    const snap = engine.redo();
    expect(snap?.data).toBe(2);
    expect(engine.canRedo()).toBe(false);
  });

  it('cannot undo past start', () => {
    const engine = createUndoRedoEngine();
    expect(engine.undo()).toBeNull();
  });

  it('cannot redo past end', () => {
    const engine = createUndoRedoEngine();
    engine.push(1, 'a');
    engine.undo();
    engine.redo();
    expect(engine.redo()).toBeNull();
  });

  it('push after undo truncates redo stack', () => {
    const engine = createUndoRedoEngine<number>();
    engine.push(1, 'a');
    engine.push(2, 'b');
    engine.undo();
    engine.push(3, 'c');
    expect(engine.size()).toBe(2);
    expect(engine.canRedo()).toBe(false);
  });

  it('respects maxSize', () => {
    const engine = createUndoRedoEngine<number>(3);
    engine.push(1, 'a');
    engine.push(2, 'b');
    engine.push(3, 'c');
    engine.push(4, 'd');
    expect(engine.size()).toBe(3);
    expect(engine.canUndo()).toBe(true);
  });

  it('clear resets everything', () => {
    const engine = createUndoRedoEngine<number>();
    engine.push(1, 'a');
    engine.push(2, 'b');
    engine.clear();
    expect(engine.size()).toBe(0);
    expect(engine.canUndo()).toBe(false);
  });

  it('current returns top snapshot', () => {
    const engine = createUndoRedoEngine<number>();
    engine.push(10, 'a');
    engine.push(20, 'b');
    expect(engine.current()?.data).toBe(20);
  });
});
