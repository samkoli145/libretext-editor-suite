/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: devstudio-snapshot-rollback.test.ts
 * 🎯 الهدف: اختبار شامل لـ SnapshotEngine + RollbackManager
 * 🧪 الاختبارات: 5+ طفرات لكل سيناريو
 * 🏷️ المعرف: TEST-DEVSTUDIO-SNAPSHOT-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SnapshotEngine, MemorySnapshotStorage } from '../dev-studio/checkpoint/SnapshotEngine';
import { RollbackManager } from '../dev-studio/checkpoint/RollbackManager';
import type { DevStudioPatch, Checkpoint, ProjectSurface } from '../dev-studio/core/DevStudioTypes';

function makePatch(path = 'src/test.ts'): DevStudioPatch {
  return {
    op: 'addFile',
    path,
    content: 'hello',
    inverse: { op: 'removeFile', path },
  };
}

function makeProject(): ProjectSurface {
  return {
    readFile: () => null,
    listFiles: () => [],
    apply: vi.fn(),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SnapshotEngine
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('SnapshotEngine', () => {
  let engine: SnapshotEngine;

  beforeEach(() => {
    engine = new SnapshotEngine(new MemorySnapshotStorage());
  });

  // ── capture ──

  describe('capture', () => {
    it('positive: يجب التقاط لقطة بنجاح', () => {
      const ckpt = engine.capture({ label: 'Test', patches: [makePatch()] });
      expect(ckpt.id).toMatch(/^ckpt-/);
      expect(ckpt.label).toBe('Test');
      expect(ckpt.patches).toHaveLength(1);
      expect(ckpt.inverses).toHaveLength(1);
    });

    it('negative: يجب رفض لقطة بلا تسمية', () => {
      expect(() => engine.capture({ label: '  ', patches: [makePatch()] }))
        .toThrow('بلا تسمية');
    });

    it('negative: يجب رفض لقطة بلا تصحيحات', () => {
      expect(() => engine.capture({ label: 'Empty', patches: [] }))
        .toThrow('لا تصحيحات');
    });

    it('negative: يجب رفض تصحيح بدون inverse', () => {
      const badPatch = { op: 'addFile', path: 'x.ts', content: '' } as DevStudioPatch;
      expect(() => engine.capture({ label: 'Bad', patches: [badPatch] }))
        .toThrow('بلا inverse');
    });

    it('edge: يجب أن تُخزّن اللقطة', () => {
      const ckpt = engine.capture({ label: 'Stored', patches: [makePatch()] });
      expect(engine.get(ckpt.id)).not.toBeNull();
      expect(engine.size).toBe(1);
    });
  });

  // ── list & ordering ──

  describe('list', () => {
    it('positive: يجب أن تُرجع اللقطات بالأحدث أولاً', () => {
      engine.capture({ label: 'First', patches: [makePatch('a.ts')] });
      engine.capture({ label: 'Second', patches: [makePatch('b.ts')] });
      const list = engine.list();
      expect(list[0]!.label).toBe('Second');
      expect(list[1]!.label).toBe('First');
    });

    it('edge: يجب أن تُرجع فارغة بدون لقطات', () => {
      expect(engine.list()).toHaveLength(0);
    });
  });

  // ── max checkpoints ──

  describe('max checkpoints', () => {
    it('يجب أن تتجاوز 50 لقطة (SHELF_SIZE = 50)', () => {
      for (let i = 0; i < 55; i++) {
        engine.capture({ label: `T${i}`, patches: [makePatch(`f${i}.ts`)] });
      }
      expect(engine.size).toBe(50);
    });
  });

  // ── forget ──

  describe('forget', () => {
    it('positive: يجب نسيان لقطة موجودة', () => {
      const ckpt = engine.capture({ label: 'Forget me', patches: [makePatch()] });
      expect(engine.forget(ckpt.id)).toBe(true);
      expect(engine.get(ckpt.id)).toBeNull();
    });

    it('negative: نسيان لقطة غير موجودة', () => {
      expect(engine.forget('nonexistent')).toBe(false);
    });
  });

  // ── clear ──

  describe('clear', () => {
    it('يجب أن يمسح كل اللقطات', () => {
      engine.capture({ label: 'A', patches: [makePatch()] });
      engine.capture({ label: 'B', patches: [makePatch()] });
      engine.clear();
      expect(engine.size).toBe(0);
      expect(engine.list()).toHaveLength(0);
    });
  });

  // ── clean flag ──

  describe('clean flag', () => {
    it('positive: لقطة مع تقرير طبيب ناجح = clean: true', () => {
      const ckpt = engine.capture({
        label: 'Clean',
        patches: [makePatch()],
        doctorReport: { timestamp: Date.now(), checks: [{ id: '1', name: 't', category: 'structure', status: 'pass', message: 'ok' }] },
      });
      expect(ckpt.clean).toBe(true);
    });

    it('negative: لقطة بدون تقرير طبيب = لا علم clean', () => {
      const ckpt = engine.capture({ label: 'No report', patches: [makePatch()] });
      expect(ckpt.clean).toBeUndefined();
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RollbackManager
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('RollbackManager', () => {
  let manager: RollbackManager;

  beforeEach(() => {
    manager = new RollbackManager();
  });

  function makeCkpt(id = 'ckpt-test'): Checkpoint {
    const patch = makePatch();
    return {
      id,
      label: 'test',
      timestamp: Date.now(),
      patches: [patch],
      inverses: [patch.inverse as DevStudioPatch],
      doctorReport: { timestamp: Date.now(), checks: [] },
    };
  }

  // ── canRollback ──

  describe('canRollback', () => {
    it('positive: لقطة غير مستهلكة وมี inverses = ok', () => {
      const result = manager.canRollback(makeCkpt());
      expect(result.ok).toBe(true);
    });

    it('negative: لقطة مستهلكة = لا يمكن التراجع', () => {
      const ckpt = makeCkpt();
      manager.rollback(ckpt, makeProject());
      expect(manager.canRollback(ckpt).ok).toBe(false);
      expect(manager.canRollback(ckpt).reason).toContain('استُهلكت');
    });

    it('negative: لقطة بدون inverses', () => {
      const ckpt: Checkpoint = {
        id: 'empty', label: 'e', timestamp: Date.now(),
        patches: [], inverses: [],
        doctorReport: { timestamp: Date.now(), checks: [] },
      };
      expect(manager.canRollback(ckpt).ok).toBe(false);
      expect(manager.canRollback(ckpt).reason).toContain('no inverses');
    });
  });

  // ── rollback ──

  describe('rollback', () => {
    it('positive: رجوع ناجح', () => {
      const project = makeProject();
      const ckpt = makeCkpt();
      const result = manager.rollback(ckpt, project);
      expect(result.succeeded).toBe(true);
      expect(result.applied).toBe(1);
      expect(project.apply).toHaveBeenCalledOnce();
    });

    it('negative: رجوع مرتين يرمي خطأ', () => {
      const ckpt = makeCkpt();
      manager.rollback(ckpt, makeProject());
      expect(() => manager.rollback(ckpt, makeProject())).toThrow();
    });

    it('negative: isConsumed يُرجع true بعد الرجوع', () => {
      manager.rollback(makeCkpt(), makeProject());
      expect(manager.isConsumed('ckpt-test')).toBe(true);
    });
  });

  // ── reset ──

  describe('reset', () => {
    it('يجب أن يُعيد تعيين سجل الاستهلاك', () => {
      manager.rollback(makeCkpt(), makeProject());
      expect(manager.isConsumed('ckpt-test')).toBe(true);
      manager.reset();
      expect(manager.isConsumed('ckpt-test')).toBe(false);
    });
  });
});
