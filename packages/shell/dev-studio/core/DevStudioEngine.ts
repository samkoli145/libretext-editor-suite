/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 المهمة: المحرك المركزي الأوركسترالي لاستوديو التطوير (DevStudioEngine)
 * 🏛️ الدور: تنسيق دورة حياة المهام: Created -> Validating -> Checkpointed -> Executing -> Testing -> Committed
 * 📥 المستهلك: كافة أجنحة واجهة الاستوديو (DevStudioWorkbench)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    - Strict Multi-Stage Orchestrator: لا تنفيذ بدون فحص دكتور مسبق، ولا حفظ بدون لقطة،
 *      مع دعم كامل لـ Rollback عند حدوث أي خطأ.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. في حال فشل الدكتور في مرحلة التقييم يتم رفض المهمة فوراً دون تعديل الحالة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التراجع الفوري الآلي (Auto-Rollback) في حال حدوث استثناء غير متوقع أثناء التنفيذ.
 * ═══════════════════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { DevStudioPatch, DevTask } from './DevStudioTypes';
import { defaultDoctorGate } from '../doctor/DoctorEngine';
import { globalSnapshotEngine } from '../checkpoint/SnapshotEngine';
import { globalRollbackManager } from '../checkpoint/RollbackManager';
import { TaskPipeline } from '../pipeline/TaskPipeline';
import { globalDevStudioEvents } from './DevStudioEvents';

export interface ProjectSurface {
  readFile(path: string): string | null;
  listFiles(): string[];
  apply(patches: DevStudioPatch[]): void;
}

export class DevStudioEngine {
  private tasks: DevTask[] = [];
  private activeTaskId: string | null = null;
  private projectSurface: ProjectSurface = {
    readFile: () => null,
    listFiles: () => [],
    apply: () => {}
  };
  private pipeline: TaskPipeline;

  constructor() {
    this.pipeline = new TaskPipeline({
      project: this.projectSurface,
      doctor: defaultDoctorGate,
      snapshots: globalSnapshotEngine,
      rollback: globalRollbackManager
    });

    this.pipeline.on((event) => {
      if (event.type === 'gatePassed') {
        const statusMap: Record<string, DevTask['status']> = {
          doctor: 'validating',
          checkpoint: 'checkpointed',
          execute: 'executing',
          test: 'testing'
        };
        const st = statusMap[event.gate] || 'executing';
        globalDevStudioEvents.emit('task:status', { taskId: event.taskId, status: st });
      } else if (event.type === 'gateFailed') {
        globalDevStudioEvents.emit('task:status', { taskId: event.taskId, status: 'failed', error: event.reason });
      } else if (event.type === 'taskCommitted') {
        globalDevStudioEvents.emit('task:status', { taskId: event.taskId, status: 'committed' });
      } else if (event.type === 'taskRolledBack') {
        globalDevStudioEvents.emit('task:status', { taskId: event.taskId, status: 'rolled-back', error: event.reason });
      }
    });
  }

  public setProjectSurface(surface: ProjectSurface): void {
    this.projectSurface = surface;
    this.pipeline = new TaskPipeline({
      project: this.projectSurface,
      doctor: defaultDoctorGate,
      snapshots: globalSnapshotEngine,
      rollback: globalRollbackManager
    });
  }

  public getProjectSurface(): ProjectSurface {
    return this.projectSurface;
  }

  public getPipeline(): TaskPipeline {
    return this.pipeline;
  }

  /**
   * إنشاء وتشغيل مهمة جديدة ضمن دورة الحياة الصارمة عبر TaskPipeline
   */
  async executeTask(
    label: string,
    type: DevTask['type'],
    patches: DevStudioPatch[]
  ): Promise<{ success: boolean; task: DevTask; error?: string }> {
    const taskBefore: DevTask = {
      id: `task-${Date.now().toString(36)}`,
      type,
      label,
      status: 'created',
      patches,
      createdAt: Date.now()
    };
    globalDevStudioEvents.emit('task:created', taskBefore);

    const result = this.pipeline.run({
      type,
      label,
      patches
    });

    const task: DevTask = {
      id: result.taskId,
      type,
      label,
      status: result.status,
      patches,
      checkpointId: result.checkpointId,
      error: result.error,
      completedAt: result.status === 'committed' ? Date.now() : undefined
    };

    this.tasks.unshift(task);
    this.activeTaskId = task.id;

    if (result.status === 'committed') {
      globalDevStudioEvents.emit('task:completed', task);
    }

    return {
      success: result.status === 'committed',
      task,
      error: result.error
    };
  }

  /**
   * التراجع الآمن عن لقطة معينة عبر RollbackManager
   */
  rollbackCheckpoint(checkpointId: string): { success: boolean; error?: string } {
    const ckpt = globalSnapshotEngine.get(checkpointId);
    if (!ckpt) {
      return { success: false, error: 'اللقطة غير موجودة' };
    }

    try {
      globalRollbackManager.rollback(ckpt, this.projectSurface);
      globalSnapshotEngine.rollback(checkpointId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'فشل التراجع عن اللقطة' };
    }
  }

  getTasks(): DevTask[] {
    return [...this.tasks];
  }

  getActiveTask(): DevTask | undefined {
    return this.tasks.find((t) => t.id === this.activeTaskId);
  }
}

export const globalDevStudioEngine = new DevStudioEngine();
