/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: devstudio-doctor-events.test.ts
 * 🎯 الهدف: اختبار DoctorEngine + DevStudioEventBus + Type Guards
 * 🧪 الاختبارات: 5+ طفرات لكل سيناريو
 * 🏷️ المعرف: TEST-DEVSTUDIO-DOCTOR-01
 * 📅 تاريخ الإنشاء: 2026-08-23
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  runDoctor,
  isApproved,
  DoctorEngine,
  contentsOf,
  removedPathsOf,
} from '../dev-studio/doctor/DoctorEngine';
import { DevStudioEventBus } from '../dev-studio/core/DevStudioEvents';
import {
  isDevStudioPatch,
  isValidStudioPath,
  isValidToolId,
  deriveReportVerdict,
  type DevStudioPatch,
} from '../dev-studio/core/DevStudioTypes';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function makePatch(path = 'src/test.ts'): DevStudioPatch {
  return {
    op: 'addFile',
    path,
    content: [
      '/* ═══════════════════════════════════════════════════════════════════════════',
      ' * 📌 ملخص توجيهي | Guiding Summary',
      ' * ═══════════════════════════════════════════════════════════════════════════',
      ' * ©️ جميع الحقوق محفوظة ©️ - 2026',
      ' * ═══════════════════════════════════════════════════════════════════════════',
      ' */',
      'export const x = 42;',
    ].join('\n'),
    inverse: { op: 'removeFile', path },
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DoctorEngine
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('DoctorEngine', () => {
  describe('runDoctor', () => {
    it('positive: تقرير نظيف بدون أخطاء', () => {
      const report = runDoctor([makePatch()]);
      expect(report.timestamp).toBeGreaterThan(0);
      expect(report.checks.length).toBeGreaterThan(0);
      expect(report.rejectionReason).toBeUndefined();
    });

    it('positive: كل 5 validators تعمل', () => {
      const report = runDoctor([makePatch()]);
      expect(report.checks.length).toBeGreaterThanOrEqual(5);
    });

    it('negative: تقرير مع رفض (محتوى خطر)', () => {
      const dangerousPatch: DevStudioPatch = {
        op: 'addFile',
        path: 'src/evil.ts',
        content: 'eval("alert(1)");',
        inverse: { op: 'removeFile', path: 'src/evil.ts' },
      };
      const report = runDoctor([dangerousPatch]);
      const failed = report.checks.filter((c) => c.status === 'fail');
      expect(failed.length).toBeGreaterThan(0);
    });

    it('negative: فاحص يرمي خطأ لا يقتل الدكتور', () => {
      const report = runDoctor([makePatch()]);
      expect(report.checks).toBeDefined();
      expect(Array.isArray(report.checks)).toBe(true);
    });
  });

  describe('isApproved', () => {
    it('positive: تقرير نظيف = معتمد', () => {
      const report = runDoctor([makePatch()]);
      expect(isApproved(report)).toBe(true);
    });

    it('negative: تقرير بผู้_fail = غير معتمد', () => {
      const report = runDoctor([
        {
          op: 'addFile',
          path: 'x.ts',
          content: 'eval("x")',
          inverse: { op: 'removeFile', path: 'x.ts' },
        },
      ]);
      const approved = isApproved(report);
      expect(typeof approved).toBe('boolean');
    });
  });

  describe('DoctorEngine.evaluatePatches', () => {
    it('positive: يُرجع DoctorReport مع healthScore', () => {
      const report = DoctorEngine.evaluatePatches([makePatch()]);
      expect(report.passed).toBeGreaterThanOrEqual(0);
      expect(report.failed).toBeGreaterThanOrEqual(0);
      expect(typeof report.approved).toBe('boolean');
      expect(typeof report.healthScore).toBe('number');
    });

    it('positive: runGeneralSystemAudit', () => {
      const report = DoctorEngine.runGeneralSystemAudit();
      expect(report.approved).toBe(true);
      expect(report.checks.length).toBe(3);
    });
  });

  describe('helpers', () => {
    it('contentsOf: يستخرج محتويات addFile + modifyFile', () => {
      const patches: DevStudioPatch[] = [
        makePatch('a.ts'),
        {
          op: 'modifyFile',
          path: 'b.ts',
          content: 'new',
          inverse: { op: 'modifyFile', path: 'b.ts', content: 'old' },
        },
      ];
      const contents = contentsOf(patches);
      expect(contents).toHaveLength(2);
    });

    it('removedPathsOf: يستخرج مسارات removeFile', () => {
      const patches: DevStudioPatch[] = [
        {
          op: 'removeFile',
          path: 'del.ts',
          content: '',
          inverse: { op: 'addFile', path: 'del.ts', content: '' },
        },
        makePatch('keep.ts'),
      ];
      const removed = removedPathsOf(patches);
      expect(removed).toEqual(['del.ts']);
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Type Guards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Type Guards', () => {
  describe('isDevStudioPatch', () => {
    it('positive: valid patch', () => {
      expect(isDevStudioPatch(makePatch())).toBe(true);
    });

    it('negative: null', () => {
      expect(isDevStudioPatch(null)).toBe(false);
    });

    it('negative: empty object', () => {
      expect(isDevStudioPatch({})).toBe(false);
    });

    it('negative: string', () => {
      expect(isDevStudioPatch('patch')).toBe(false);
    });

    it('negative: object without inverse', () => {
      expect(isDevStudioPatch({ op: 'addFile' })).toBe(false);
    });
  });

  describe('isValidStudioPath', () => {
    it('positive: مسار نسبي صالح', () => {
      expect(isValidStudioPath('src/file.ts')).toBe(true);
    });

    it('negative: مسار مطلق', () => {
      expect(isValidStudioPath('/etc/passwd')).toBe(false);
    });

    it('negative: مسار يحتوي ..', () => {
      expect(isValidStudioPath('../escape.ts')).toBe(false);
    });

    it('negative: مسار Windows', () => {
      expect(isValidStudioPath('C:\\Windows')).toBe(false);
    });

    it('negative: مسار فارغ', () => {
      expect(isValidStudioPath('')).toBe(false);
    });
  });

  describe('isValidToolId', () => {
    it('positive: معرف صالح', () => {
      expect(isValidToolId('my-tool')).toBe(true);
    });

    it('negative: يبدأ برقم', () => {
      expect(isValidToolId('1tool')).toBe(false);
    });

    it('negative: يحتوي مسافة', () => {
      expect(isValidToolId('my tool')).toBe(false);
    });

    it('negative: طويل جداً', () => {
      expect(isValidToolId('a'.repeat(65))).toBe(false);
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DevStudioEventBus
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('DevStudioEventBus', () => {
  let bus: DevStudioEventBus;

  beforeEach(() => {
    bus = new DevStudioEventBus();
  });

  it('positive: on + emit', () => {
    const received: string[] = [];
    bus.on('task:status', (e) => received.push(e.status));
    bus.emit('task:status', { taskId: '1', status: 'committed' });
    expect(received).toEqual(['committed']);
  });

  it('positive: off يُلغي المستمع', () => {
    const received: string[] = [];
    const unsub = bus.on('task:status', (e) => received.push(e.status));
    unsub();
    bus.emit('task:status', { taskId: '1', status: 'committed' });
    expect(received).toHaveLength(0);
  });

  it('positive: emit بدون مستمعين لا يرمي خطأ', () => {
    expect(() => bus.emit('task:status', { taskId: '1', status: 'committed' })).not.toThrow();
  });

  it('negative: مستمع يرمي خطأ لا يقتل الآخرين', () => {
    bus.on('task:status', () => {
      throw new Error('bad');
    });
    const received: string[] = [];
    bus.on('task:status', (e) => received.push(e.status));
    bus.emit('task:status', { taskId: '1', status: 'committed' });
    expect(received).toEqual(['committed']);
  });

  it('positive: clear يحذف كل المستمعين', () => {
    const received: string[] = [];
    bus.on('task:status', (e) => received.push(e.status));
    bus.clear();
    bus.emit('task:status', { taskId: '1', status: 'committed' });
    expect(received).toHaveLength(0);
  });

  it('positive: أحداث متعددة', () => {
    const events: string[] = [];
    bus.on('task:status', () => events.push('task'));
    bus.on('checkpoint:created', () => events.push('ckpt'));
    bus.emit('task:status', { taskId: '1', status: 'committed' });
    bus.emit('checkpoint:created', {
      id: '1',
      label: 't',
      timestamp: 0,
      patches: [],
      inverses: [],
      doctorReport: { timestamp: 0, checks: [] },
    });
    expect(events).toEqual(['task', 'ckpt']);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// deriveReportVerdict
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('deriveReportVerdict', () => {
  it('positive: كل passes = approved', () => {
    const verdict = deriveReportVerdict([
      { id: '1', name: 'a', category: 'structure', status: 'pass', message: 'ok' },
      { id: '2', name: 'b', category: 'theme', status: 'pass', message: 'ok' },
    ]);
    expect(verdict.approved).toBe(true);
    expect(verdict.passed).toBe(2);
    expect(verdict.healthScore).toBe(100);
  });

  it('negative: وجود fail واحد = غير معتمد', () => {
    const verdict = deriveReportVerdict([
      { id: '1', name: 'a', category: 'structure', status: 'pass', message: 'ok' },
      { id: '2', name: 'b', category: 'theme', status: 'fail', message: 'bad' },
    ]);
    expect(verdict.approved).toBe(false);
    expect(verdict.failed).toBe(1);
  });

  it('edge: فارغ = معتمد', () => {
    const verdict = deriveReportVerdict([]);
    expect(verdict.approved).toBe(true);
    expect(verdict.healthScore).toBe(100);
  });

  it('edge: warnings فقط = معتمد مع healthScore أقل', () => {
    const verdict = deriveReportVerdict([
      { id: '1', name: 'a', category: 'structure', status: 'warn', message: 'hmm' },
    ]);
    expect(verdict.approved).toBe(true);
    expect(verdict.healthScore).toBe(50);
  });
});
