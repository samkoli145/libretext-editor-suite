/**
 * ================================================================
 * 📌 ملخص توجيهي | Guiding Summary
 * ================================================================
 * 📄 الملف: block-mapper.ts
 * 📂 المسار: packages/core/src/engines/block-mapper.ts
 * 🎯 الهدف الرئيسي: محرك رسم الخريطة البصرية للبلوكات
 *    لتحويل العناصر المكانية إلى بلوكات منطقية.
 * 🏷️ المعرف: CORE-ENG-018
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ================================================================
 */

export interface SpatialBlock {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly type: string;
}

export interface MappedBlock {
  readonly id: string;
  readonly blockType: string;
  readonly gridRow: number;
  readonly gridCol: number;
  readonly spanRows: number;
  readonly spanCols: number;
}

function snapToGrid(val: number, cellSize: number): number {
  return Math.round(val / cellSize);
}

export function mapBlocksToGrid(
  blocks: readonly SpatialBlock[],
  cellSize = 100,
): readonly MappedBlock[] {
  return blocks.map((b) => ({
    id: b.id,
    blockType: b.type,
    gridRow: snapToGrid(b.y, cellSize),
    gridCol: snapToGrid(b.x, cellSize),
    spanRows: Math.max(1, snapToGrid(b.height, cellSize)),
    spanCols: Math.max(1, snapToGrid(b.width, cellSize)),
  }));
}

export function findOverlappingBlocks(blocks: readonly SpatialBlock[]): readonly string[] {
  const overlaps: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i]!;
      const b = blocks[j]!;
      if (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      ) {
        overlaps.push(a.id, b.id);
      }
    }
  }
  return [...new Set(overlaps)];
}
