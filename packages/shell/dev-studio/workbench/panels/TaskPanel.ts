// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Bento authors
/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════
 * [TaskPanel.ts] لوحة مشغل المهام وخط الأنابيب
 *
 * يوفر أزرار تشغيل المهام (Lint, Build, Sync, Format, Scaffold)
 * وتوجيهها عبر callbacks دون تعديل مباشر للحالة.
 *
 * المبدأ:
 * "The panel is chrome... what is NOT visible is what the controls WRITE."
 * ═══════════════════════════════════════════════════════════════
 * ©️ جميع الحقوق محفوظة ©️ - 2026
 * (يُحظر التعديل على هذا الملف دون تحديث هذا السجل)
 * ═══════════════════════════════════════════════════════════════
 */

export interface TaskPanelOpts {
  onRun?: (task: string) => void;
}

export class TaskPanel {
  el: HTMLElement;
  private opts: TaskPanelOpts;

  constructor(opts: TaskPanelOpts) {
    this.opts = opts;
    this.el = document.createElement('div');
    this.el.className = 'dsw-task-panel';
    this.render();
  }

  render(): void {
    this.el.innerHTML = '';

    const tasks = [
      { id: 'task.sync', label: '🔄 مزامنة السجلات (Sync)' },
      { id: 'task.doctor', label: '🩺 فحص الدكتور (Doctor Run)' },
      { id: 'task.format', label: '🧹 تنسيق الشيفرة (Format)' },
      { id: 'task.scaffold', label: '🏗️ إنشاء أداة جديدة (Scaffold)' },
    ];

    for (const t of tasks) {
      const row = document.createElement('div');
      row.className = 'dsw-row';

      const label = document.createElement('span');
      label.textContent = t.label;
      row.appendChild(label);

      const btn = document.createElement('button');
      btn.className = 'dsw-btn';
      btn.textContent = 'تشغيل';
      btn.addEventListener('click', () => this.opts.onRun?.(t.id));
      row.appendChild(btn);

      this.el.appendChild(row);
    }
  }
}
