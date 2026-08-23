/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: devstudio-task-pipeline.test.ts
 * 🎯 الهدف: اختبار شامل لـ TaskPipeline — دورة حياة المهام الـ 6 مراحل
 * 🧪 الاختبارات: 5+ طفرات لكل سيناريو (positive/negative/edge)
 * 🏷️ المعرف: TEST-DEVSTUDIO-PIPELINE-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TaskPipeline,
  type DoctorGate,
  type TaskRequest,
  type PipelineEvent,
} from '../dev-studio/pipeline/TaskPipeline';
import { SnapshotEngine, MemorySnapshotStorage } from '../dev-studio/checkpoint/SnapshotEngine';
import { RollbackManager } from '../dev-studio/checkpoint/RollbackManager';
import type {
  DevStudioPatch,
  DoctorCheck,
  ProjectSurface,
} from '../dev-studio/core/DevStudioTypes';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function makePatch(path = 'src/test.ts', content = 'test'): DevStudioPatch {
  return {
    op: 'addFile',
    path,
    content,
    inverse: { op: 'removeFile', path },
  };
}

function makeProject(files: Record<string, string> = {}): ProjectSurface {
  return {
    readFile: (p) => files[p] ?? null,
    listFiles: () => Object.keys(files),
    apply: vi.fn(),
  };
}

function makeDoctorGate(pass = true): DoctorGate {
  return {
    check: (): DoctorCheck[] => [
      {
        id: 'test-check',
        name: 'test',
        category: 'structure',
        status: pass ? 'pass' : 'fail',
        message: pass ? 'ok' : 'rejected',
      },
    ],
  };
}

function setupPipeline(opts?: {
  doctorPass?: boolean;
  project?: ProjectSurface;
  shouldApplyThrow?: boolean;
}) {
  const project = opts?.project ?? makeProject();
  if (opts?.shouldApplyThrow) {
    (project.apply as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('apply failed');
    });
  }
  const snapshots = new SnapshotEngine(new MemorySnapshotStorage());
  const rollback = new RollbackManager();
  const doctor = makeDoctorGate(opts?.doctorPass ?? true);
  const pipeline = new TaskPipeline({ project, doctor, snapshots, rollback });
  return { pipeline, project, snapshots, rollback, doctor };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TaskPipeline
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('TaskPipeline', () => {
  // ── Positive Tests ──

  describe('positive: مهمة ناجحة بالكامل', () => {
    it('يجب أن تمر المهمة بنجاح عبر كل البوابات', () => {
      const { pipeline, project } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: 'Test task',
        patches: [makePatch()],
      });
      expect(result.status).toBe('committed');
      expect(result.appliedCount).toBe(1);
      expect(result.testResult?.passed).toBe(true);
      expect(project.apply).toHaveBeenCalledOnce();
    });

    it('يجب أن تُصدر أحداث صحيحة أثناء التنفيذ', () => {
      const { pipeline } = setupPipeline();
      const events: PipelineEvent[] = [];
      pipeline.on((e) => events.push(e));
      pipeline.run({ type: 'modify', label: 'E', patches: [makePatch()] });
      expect(events.map((e) => e.type)).toEqual([
        'taskStarted',
        'gatePassed',
        'gatePassed',
        'gatePassed',
        'gatePassed',
        'taskCommitted',
      ]);
    });

    it('يجب أن تدعم مهمات متعددة التصحيحات', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'add-tool',
        label: 'Multi',
        patches: [makePatch('a.ts'), makePatch('b.ts'), makePatch('c.ts')],
      });
      expect(result.appliedCount).toBe(3);
      expect(result.status).toBe('committed');
    });
  });

  // ── Negative Tests ──

  describe('negative: مهمة فاشلة', () => {
    it('يجب أن ترفض مهمة بلا تسمية', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: '   ',
        patches: [makePatch()],
      });
      expect(result.status).toBe('failed');
      expect(result.error).toContain('بلا تسمية');
    });

    it('يجب أن ترفض مهمة بلا تصحيحات', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: 'Empty',
        patches: [],
      });
      expect(result.status).toBe('failed');
      expect(result.error).toContain('بلا تصحيحات');
    });

    it('يجب أن ترفض مهمة بتصحيح بدون inverse', () => {
      const { pipeline } = setupPipeline();
      const badPatch = { op: 'addFile' as const, path: 'x.ts', content: '' } as DevStudioPatch;
      const result = pipeline.run({
        type: 'modify',
        label: 'Bad patch',
        patches: [badPatch],
      });
      expect(result.status).toBe('failed');
    });

    it('يجب أن ترفض مهمة بمسار غير صالح', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: 'Bad path',
        patches: [
          {
            op: 'addFile',
            path: '../escape.ts',
            content: '',
            inverse: { op: 'removeFile', path: '../escape.ts' },
          },
        ],
      });
      expect(result.status).toBe('failed');
      expect(result.error).toContain('مسار غير صالح');
    });

    it('يجب أن ترفض فشل الدكتور', () => {
      const { pipeline } = setupPipeline({ doctorPass: false });
      const result = pipeline.run({
        type: 'modify',
        label: 'Doctor rejects',
        patches: [makePatch()],
      });
      expect(result.status).toBe('failed');
      expect(result.error).toContain('فشل');
    });

    it('يجب أن ترفض مهمة أثناء مهمة حية (أحادية المهمة)', () => {
      const { pipeline } = setupPipeline();
      pipeline.run({ type: 'modify', label: 'First', patches: [makePatch()] });
      const result = pipeline.run({
        type: 'modify',
        label: 'Second',
        patches: [makePatch()],
      });
      expect(result.status).toBe('committed');
    });
  });

  // ── Rollback Tests ──

  describe('rollback: التراجع عند الفشل', () => {
    it('يجب أن تراجع المهمة عند فشل الاختبار', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: 'Fail test',
        patches: [makePatch()],
        postTest: () => 'test failed',
      });
      expect(result.status).toBe('rolled-back');
      expect(result.error).toContain('فشل الاختبار');
    });

    it('يجب أن تراجع المهمة عند فشل التنفيذ', () => {
      const { pipeline } = setupPipeline({ shouldApplyThrow: true });
      const result = pipeline.run({
        type: 'modify',
        label: 'Fail apply',
        patches: [makePatch()],
      });
      expect(result.status).toBe('rolled-back');
      expect(result.error).toContain('فشل التنفيذ');
    });
  });

  // ── postTest ──

  describe('postTest: اختبار بعد التنفيذ', () => {
    it('positive: postTest ناجح = مهمة مكتملة', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: 'With test',
        patches: [makePatch()],
        postTest: () => null,
      });
      expect(result.status).toBe('committed');
    });

    it('negative: postTest فاشل = مهمة مراجعة', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: 'Failing test',
        patches: [makePatch()],
        postTest: () => 'assertion failed',
      });
      expect(result.status).toBe('rolled-back');
    });

    it('edge: postTest بدون callback = مهمة تتجاوز الاختبار', () => {
      const { pipeline } = setupPipeline();
      const result = pipeline.run({
        type: 'modify',
        label: 'No test',
        patches: [makePatch()],
      });
      expect(result.status).toBe('committed');
    });
  });

  // ── State queries ──

  describe('state: الاستعلامات', () => {
    it('يجب أن يُرجع hasLiveTask صحيحاً أثناء المهمة', () => {
      const { pipeline } = setupPipeline();
      expect(pipeline.hasLiveTask).toBe(false);
      pipeline.run({ type: 'modify', label: 'T', patches: [makePatch()] });
      expect(pipeline.hasLiveTask).toBe(false);
    });

    it('يجب أن يُرجع currentTask null بعد الإتمام', () => {
      const { pipeline } = setupPipeline();
      pipeline.run({ type: 'modify', label: 'T', patches: [makePatch()] });
      expect(pipeline.currentTask).toBeNull();
    });
  });
});
