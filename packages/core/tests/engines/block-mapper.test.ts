import { describe, it, expect } from 'vitest';
import { mapBlocksToGrid, findOverlappingBlocks } from '../../src/engines/block-mapper';

describe('CORE-ENG-018: block-mapper', () => {
  it('mapBlocksToGrid calculates grid positions', () => {
    const blocks = [
      { id: 'a', x: 100, y: 200, width: 300, height: 200, type: 'text' },
      { id: 'b', x: 400, y: 0, width: 100, height: 100, type: 'image' },
    ];
    const result = mapBlocksToGrid(blocks, 100);
    expect(result[0]!.gridCol).toBe(1);
    expect(result[0]!.gridRow).toBe(2);
    expect(result[0]!.spanCols).toBe(3);
    expect(result[0]!.spanRows).toBe(2);
  });

  it('findOverlappingBlocks detects overlaps', () => {
    const blocks = [
      { id: 'a', x: 0, y: 0, width: 100, height: 100, type: 't' },
      { id: 'b', x: 50, y: 50, width: 100, height: 100, type: 't' },
      { id: 'c', x: 300, y: 300, width: 50, height: 50, type: 't' },
    ];
    const overlaps = findOverlappingBlocks(blocks);
    expect(overlaps).toContain('a');
    expect(overlaps).toContain('b');
    expect(overlaps).not.toContain('c');
  });
});
